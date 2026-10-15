/* /trip-guide page builder: data.json (from build-data.mjs) + a trip plan module -> one HTML page.
 *
 * The plan module (private, per trip) exports:
 *   plan     - everything the template renders by hand: title, bases, book, days, regions, road, copy
 *   sections - { <run destination>: 'gorge' | 'ridge' | 'road' }
 *   areas    - [{ section, match: RegExp over topic/name, label, drive, near }]  first match wins
 *   legs     - { <part>: legId } for the road section
 *   knowGroups by run: { <run destination>: groupId }
 *
 * Usage: node tools/trip-guide/build-guide.mjs <data.json> <plan.mjs> <out.html>
 */
import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const CATS = [['eat', 'Eat'], ['coffee', 'Coffee'], ['drink', 'Drink'], ['see', 'See and do'], ['views', 'Views'], ['outdoors', 'Falls and outdoors']]

export function category(it) {
  const t = `${it.topic} ${it.name}`.toLowerCase()
  const lead = `${it.name} ${it.claim.slice(0, 160)}`.toLowerCase()
  if (/coffee|cafe|café|bakery|espresso|bagel/.test(lead) && !/brew(ery|ing|works)|winery|cider/.test(lead)) return 'coffee'
  if (it.part === 'eat') return 'eat'
  if (it.part === 'drink') return 'drink'
  if (/overlook|viewpoint|views?\b|lookout/.test(t)) return 'views'
  if (/waterfall|falls|outdoors|wildlife|state-park|river/.test(t)) return 'outdoors'
  if (/brew|bar\b|bars|winer|wine|cider|distill|taproom/.test(t + ' ' + lead)) return 'drink'
  if (/dining|restaurant|food|eat|bbq|barbecue|diner|market|grocer/.test(t)) return 'eat'
  return 'see'
}

/* Reader copy only. Our own pipeline (agent names, finding ids, "the founder's plan", DISCOVERED
 * tags, verifier notes) is paperwork, never product: Brady's Peru rule. Claims lose any sentence
 * that mentions it; notes keep only the labelled lines a reader can use. */
const PAPERWORK = /\b(lads-[a-z-]+|scout-[a-z0-9-]+|prov-\d+|park-\d+|move-\d+|book-\d+|time-\d+|founders?'?s?|brady|dawson|lukas|personal guide|oct 4 (plan|guide|draft)|draft guide|candidate list|discovered|orchestrator|two-source|second source|verifier|run\.json|this run|the brief|routing agent|OSRM|engine|thin\b)/i
export function readerClaim(text) {
  const sentences = String(text || '').replace(/^DISCOVERED(\s*\(thin\))?:\s*/i, '').split(/(?<=[.!?])\s+(?=[A-Z0-9])/)
  // first try cutting just the clause (", the lunch stop in the founder's plan,"), then the sentence
  const clause = new RegExp('(,|\\(|;)[^,.;()]*' + PAPERWORK.source + '[^,.;()]*(,|\\)|;)', 'gi')
  const kept = sentences.map((s) => s.replace(clause, (m0) => { const a = m0[0]; const c = m0[m0.length - 1]; return a === '(' || (a === ',' && c === ',') ? ' ' : a === ';' ? ';' : ',' }).replace(/\s+,/g, ',').replace(/,\s*\./g, '.').replace(/\s{2,}/g, ' ')).filter((s) => !PAPERWORK.test(s))
  return (kept.length ? kept : sentences.slice(0, 1).map((s) => s.replace(PAPERWORK, '').trim())).join(' ')
}
const NOTE_LABELS = { praised: 'Praised', criticised: 'Watch out', criticized: 'Watch out', trap: 'Watch out', practical: 'Practical', 'best time': 'Best time', suits: 'Who it suits', 'who it suits': 'Who it suits', detour: 'Detour', option: 'Route', options: 'Route', routes: 'Route' }
export function readerNotes(notes) {
  const rows = []
  for (const line of String(notes || '').split(/\n/)) {
    const m = line.match(/^\s*([A-Za-z][A-Za-z /]{1,24}):\s*(.+)$/)
    if (!m) continue
    const label = NOTE_LABELS[m[1].trim().toLowerCase()]
    if (!label) continue
    const body = m[2].split(/(?<=[.!?])\s+/).filter((s) => !PAPERWORK.test(s)).join(' ').trim()
    if (body && !/^(nothing found|none found|n\/a)\.?$/i.test(body)) rows.push([label, trim(body, 360)])
  }
  return rows
}

const trim =(s, n) => (s && s.length > n ? s.slice(0, n).replace(/\s+\S*$/, '') + '…' : s || '')
const fmtRange = (v, unit = '') => {
  if (v == null) return null
  if (typeof v === 'number') return String(v) + unit
  if (typeof v === 'object' && v.low != null) return v.low === v.high ? `${v.low}${unit}` : `${v.low}–${v.high}${unit}`
  return String(v)
}

export function build(data, mod, map = null) {
  const { plan, sections, areas, legs, knowGroups, skipPlace = () => false } = mod
  const items = []; const hikes = []; const know = []; const stories = []
  const seen = new Map()
  const byId = new Map()
  for (const run of data.runs) {
    const section = sections[run.destination]
    for (const it of run.items) {
      byId.set(it.id + '@' + run.destination, it); byId.set(it.id, byId.get(it.id) || it)
      const claim = readerClaim(it.claim)
      if (it.part === 'history') {
        const yr = (claim.match(/(1[5-9]\d\d|20[0-2]\d)/) || [])[1]
        stories.push({ id: it.id, section, name: it.name, claim, year: yr ? +yr : null, status: it.status, link: (it.sources[0] || {}).url || null, key: (it.name || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim() })
        continue
      }
      const areaHit = areas.find((a) => (!a.section || a.section === section) && a.match.test(`${it.topic} ${it.name || ''}`))
      // hikes: trail routes and trail facts with stats
      if (it.agent === 'lads-parks-trails' && /trail/.test(it.topic) && (it.kind === 'route' || it.kind === 'fact') && it.value && it.value.miles != null) {
        const hikeArea = areas.find((a) => a.section === section && a.match.test(`${it.value.trailhead || ''} ${it.topic} ${it.name}`))
        const v = it.value
        hikes.push({
          id: it.id, section, name: it.name, miles: fmtRange(v.miles), gain: fmtRange(v.gainFt), hours: fmtRange(v.hours),
          difficulty: v.difficulty ? String(v.difficulty).replace(/\s*\(.*\)$/, '') : null, where: v.trailhead ? String(v.trailhead).replace(/\s*\(.*\)$/, '') : null,
          drive: hikeArea ? hikeArea.drive : null, status: it.status, claim,
          closed: /\bclosed\b/i.test(claim.slice(0, 220)) ? 'Partly closed: see note' : null,
          geo: typeof v.lat === 'number' && v.coordSource ? { lat: v.lat, lng: v.lng } : null,
        })
        continue
      }
      if (it.kind === 'place') {
        if (skipPlace(it)) continue
        if (it.geo && it.geo.summit) continue // summits are hikes, not places to drive to
        const key = section + '|' + (it.name || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
        const site = (it.sources.find((s) => s.kind === 'official' || s.kind === 'government') || {}).url || null
        const g = {
          id: it.id, section, kind: 'place', name: it.name, claim, rows: readerNotes(it.notes), status: it.status,
          why: it.verifierReason ? trim(readerClaim(it.verifierReason), 420) : null, sources: it.sources.slice(0, 4), site, geo: it.geo,
          cat: category(it), areaLabel: areaHit ? areaHit.label : null, drive: areaHit ? areaHit.drive : null,
          driveSort: areaHit ? areaHit.sort ?? 999 : 999, near: Boolean(areaHit && areaHit.near), state: areaHit ? areaHit.state : null,
          leg: section === 'road' ? legs[it.part] || null : null, markable: true,
        }
        const prev = seen.get(key)
        if (prev) { // same place twice in one section: keep the richer card, carry coordinates over
          if (!prev.geo && g.geo) prev.geo = g.geo
          if (prev.agent === 'lads-provenance' || g.claim.length > prev.claim.length * 1.6) Object.assign(prev, { claim: g.claim, rows: g.rows, sources: g.sources, site: g.site || prev.site, cat: g.cat, status: g.status, why: g.why })
          continue
        }
        g.agent = it.agent
        seen.set(key, g); items.push(g)
        continue
      }
      if (it.kind === 'trap' || it.kind === 'requirement' || it.kind === 'window' || (it.kind === 'fact' && /closure|status|hours|season|ticket|fee|pass|toll|road|cell|fuel|parking|weather|sun|moon|colou?r|event|hunting|river/.test(it.topic))) {
        know.push({ id: it.id, group: knowGroups[run.destination], kind: it.kind, claim, status: it.status, link: (it.sources[0] || {}).url || null })
      }
    }
  }
  // history attaches to the place it is about (exact name in the same section), and also lives in the timeline
  for (const st of stories) {
    const it = items.find((i) => i.section === st.section && (i.name || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim() === st.key)
    if (it && st.status !== 'unconfirmed') (it.history = it.history || []).push(st.claim)
    delete st.key
  }
  stories.sort((a, b) => (a.year ?? 9999) - (b.year ?? 9999))
  items.sort((a, b) => a.driveSort - b.driveSort || a.name.localeCompare(b.name))
  hikes.sort((a, b) => (a.section > b.section ? 1 : a.section < b.section ? -1 : 0) || a.name.localeCompare(b.name))
  for (const it of items) { delete it.driveSort; delete it.agent }

  // how it was made: counted from the runs, never typed
  const tot = { findings: 0, sources: 0, agentFiles: 0, agents: new Set(), verdicts: {} }
  for (const r of data.runs) {
    const st = r.stats || {}
    tot.findings += st.findings || 0; tot.sources += st.sources || 0; tot.agentFiles += st.agentFiles || 0
    for (const a of st.agents || []) tot.agents.add(a)
    for (const [k, n] of Object.entries(st.verdicts || {})) tot.verdicts[k] = (tot.verdicts[k] || 0) + n
  }
  const catches = (plan.catches || []).map((c) => {
    const f = byId.get(c.id)
    return { title: c.title, text: c.text, status: f ? f.status : 'pending', link: f && f.sources[0] ? f.sources[0].url : null }
  })
  const made = {
    runs: data.runs.length, verifiedRuns: data.runs.filter((r) => r.verified).length,
    findings: tot.findings, sources: tot.sources, agentPasses: tot.agentFiles, specialists: [...tot.agents].length,
    verdicts: tot.verdicts, catches,
  }
  made.checked = Object.values(tot.verdicts).reduce((x, n) => x + n, 0)
  const counts = `${items.length} places, ${hikes.length} hikes, ${know.length} notes from ${made.findings} findings. Fact-checked: ${made.checked} of ${made.findings} findings.`
  return { builtOn: data.builtOn, plan: { ...plan, cats: CATS, catches: undefined }, items, hikes, know, stories, made, map, counts }
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  const [dataPath, planPath, out, mapPath] = process.argv.slice(2)
  const data = JSON.parse(readFileSync(dataPath, 'utf8'))
  const mod = await import(pathToFileURL(path.resolve(planPath)).href)
  let map = null
  if (mapPath) {
    const m = JSON.parse(readFileSync(mapPath, 'utf8'))
    map = { trip: m.map, profile: m.profile.map((p) => [p.km, p.m]), regions: m.regions, profileLegs: mod.mapSpec.profile.map((id) => ({ id, mi: m.map.routes[id].mi, label: m.map.routes[id].label })) }
    const secPath = path.join(path.dirname(mapPath), 'sections.json')
    try { map.sections = JSON.parse(readFileSync(secPath, 'utf8')) } catch { map.sections = null }
  }
  const g = build(data, mod, map)
  const tpl = readFileSync(new URL('./template.html', import.meta.url), 'utf8')
  const json = JSON.stringify(g).replace(/</g, '\\u003c')
  const html = tpl.replace('__TITLE__', mod.plan.title).replace('__DATA__', () => json)
  writeFileSync(out, html)
  console.log(`${out}: ${(html.length / 1024).toFixed(0)} KB. ${g.counts}`)
  const leaks = g.items.filter((i) => /\b(lads-|founder|brady|dawson|lukas|DISCOVERED)/i.test(i.claim + JSON.stringify(i.rows)))
  if (leaks.length) { console.error('PAPERWORK LEAK:', leaks.map((i) => i.id)); process.exitCode = 1 }
}
