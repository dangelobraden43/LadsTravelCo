/* /trip-guide data builder.
 *
 * Merges every research file in one or more runs with that run's verifier
 * verdicts into a compact guide dataset. The guide renders ONLY from this.
 *   - refuted findings are dropped
 *   - weakened findings use the verifier's proposedClaim
 *   - unverifiable findings stay, flagged "unconfirmed" (call ahead)
 *   - no verifier file yet: everything is "pending"
 * Coordinates come only from a place finding's own value (with coordSource) or
 * from a provenance finding in the SAME run whose appliesTo is the identical
 * normalised name. No fuzzy matching (the Tivoli rule).
 *
 * Usage: node tools/trip-guide/build-data.mjs <out.json> <runDir> [runDir...]
 */
import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

export const norm = (s) => String(s || '').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')
  .replace(/&/g, ' and ').replace(/['’]/g, '').replace(/[^a-z0-9]+/g, ' ').trim()

const OFFICIAL_RANK = { official: 0, government: 1, press: 2, aggregator: 3, google: 4, forum: 5 }

export function statusFor(v) {
  if (!v) return 'pending'
  if (v.verdict === 'confirmed') return 'confirmed'
  if (v.verdict === 'weakened') return 'corrected'
  if (v.verdict === 'refuted') return 'refuted'
  /* a budget-limited pass is not a failed check: say it was not re-checked */
  if (/^\s*not checked/i.test(v.reason || '')) return 'unchecked'
  return 'unconfirmed'
}

export function loadRun(runDir) {
  const run = JSON.parse(readFileSync(path.join(runDir, 'RUN.json'), 'utf8'))
  const files = readdirSync(runDir).filter((f) => f.startsWith('lads-') && f.endsWith('.json') && !f.startsWith('lads-verifier'))
  const vfile = path.join(runDir, 'lads-verifier.json')
  const verdicts = new Map()
  /* lads-verifier.json plus any top-up passes (lads-verifier.<part>.json) for later part files */
  for (const vf of readdirSync(runDir).filter((f) => /^lads-verifier(\.[a-z0-9-]+)?\.json$/.test(f)).sort()) {
    for (const v of JSON.parse(readFileSync(path.join(runDir, vf), 'utf8')).verdicts || []) verdicts.set(v.findingId, v)
  }
  const findings = []
  for (const f of files) {
    const doc = JSON.parse(readFileSync(path.join(runDir, f), 'utf8'))
    const part = f.replace(/\.json$/, '').split('.')[1] || null
    for (const x of doc.findings || []) findings.push({ ...x, agent: doc.agent, part })
  }
  return { run, findings, verdicts, verified: existsSync(vfile) }
}

export function buildItems({ run, findings, verdicts }) {
  /* identity-checked coordinates from provenance, exact names only */
  const coords = new Map()
  for (const x of findings) {
    if (x.agent === 'lads-provenance' && x.kind === 'place' && x.value && typeof x.value.lat === 'number' && x.value.coordSource) {
      coords.set(norm(x.appliesTo), { lat: x.value.lat, lng: x.value.lng, coordSource: x.value.coordSource, summit: Boolean(x.value.coordinateIsSummit || x.coordinateIsSummit) })
    }
  }
  const items = []
  for (const x of findings) {
    const v = verdicts.get(x.id)
    const status = statusFor(v)
    if (status === 'refuted') continue
    const claim = status === 'corrected' && v.proposedClaim ? v.proposedClaim : x.claim
    const own = x.value && typeof x.value.lat === 'number' && x.value.coordSource
      ? { lat: x.value.lat, lng: x.value.lng, coordSource: x.value.coordSource, summit: Boolean(x.value.coordinateIsSummit) } : null
    const geo = own || coords.get(norm(x.appliesTo)) || null
    const sources = [...(x.sources || [])].sort((a, b) => (OFFICIAL_RANK[a.kind] ?? 9) - (OFFICIAL_RANK[b.kind] ?? 9))
    items.push({
      id: x.id,
      run: run.destination,
      agent: x.agent,
      part: x.part,
      kind: x.kind,
      topic: x.topic,
      name: x.appliesTo || null,
      claim,
      notes: x.notes || '',
      driver: x.driver || null,
      datedUntil: x.datedUntil || null,
      confidence: x.confidence,
      status,
      verifierReason: v && status !== 'confirmed' ? v.reason : null,
      link: sources[0] ? { title: sources[0].title, url: sources[0].url, kind: sources[0].kind } : null,
      sources: sources.map((s) => ({ title: s.title, url: s.url, kind: s.kind })),
      geo,
      value: x.value && typeof x.value === 'object' ? x.value : null,
    })
  }
  return items
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  const [out, ...dirs] = process.argv.slice(2)
  if (!out || !dirs.length) { console.error('usage: build-data.mjs <out.json> <runDir...>'); process.exit(2) }
  const runs = []
  for (const d of dirs) {
    const loaded = loadRun(d)
    const items = buildItems(loaded)
    const counts = items.reduce((m, i) => ((m[i.status] = (m[i.status] || 0) + 1), m), {})
    console.log(`${loaded.run.destination}: ${items.length} items (verified: ${loaded.verified})`, counts)
    const verdictCounts = {}
    for (const v of loaded.verdicts.values()) verdictCounts[v.verdict] = (verdictCounts[v.verdict] || 0) + 1
    const stats = {
      findings: loaded.findings.length,
      sources: new Set(loaded.findings.flatMap((f) => (f.sources || []).map((s) => s.url))).size,
      agentFiles: new Set(loaded.findings.map((f) => f.agent + (f.part ? '.' + f.part : ''))).size,
      agents: [...new Set(loaded.findings.map((f) => f.agent))],
      verdicts: verdictCounts,
    }
    runs.push({ destination: loaded.run.destination, displayName: loaded.run.displayName, verified: loaded.verified, trip: loaded.run.trip, stats, items })
  }
  writeFileSync(out, JSON.stringify({ builtOn: new Date().toLocaleDateString('en-CA'), runs }, null, 1))
}
