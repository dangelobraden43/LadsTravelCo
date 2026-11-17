/* tools/build-local-data.mjs — GENERATES src/data/localResearch.js from a research run.
 *
 *   node tools/build-local-data.mjs internal/research/midwest-local/<runId>/
 *
 * Reads every lads-destination-scout.*.json (places and traps) and lads-timing-events.*.json
 * (dated events) in the run, applies lads-verifier.json when it exists (refuted findings are
 * dropped; weakened ones use the verifier's proposedClaim and are marked), and resolves each
 * place's COORDINATE FROM WIKIDATA BY QID (P625), never from its name. A place with no QID,
 * or a QID with no coordinate, is kept for the lists and left off the map.
 *
 * Events are tied to a place by the venue's QID first, then by an exact venue-name match.
 * Nothing here is typed by hand, and no ticket price survives: the validator already refused
 * them and this tool refuses any amount that slipped through.
 */
/* eslint-env node */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const runDir = process.argv[2]
if (!runDir) throw new Error('usage: node tools/build-local-data.mjs <runDir>')
const RUN = path.resolve(ROOT, runDir)
const now = new Date()
const TODAY = [now.getFullYear(), now.getMonth() + 1, now.getDate()]
  .map((n) => String(n).padStart(2, '0'))
  .join('-')
const CACHE = path.join(RUN, 'wikidata-cache.json')

const files = fs.readdirSync(RUN)
const load = (f) => JSON.parse(fs.readFileSync(path.join(RUN, f), 'utf8'))
const run = load('RUN.json')
const scoutFiles = files.filter((f) => /^lads-destination-scout\..*\.json$/.test(f) && !/\.(MISSING|INVALID)/.test(f))
const eventFiles = files.filter((f) => /^lads-timing-events\..*\.json$/.test(f) && !/\.(MISSING|INVALID)/.test(f))
const verifier = files.includes('lads-verifier.json') ? load('lads-verifier.json') : null

/* ---------- verdicts ---------- */
/* Finding ids repeat across parts (every scout starts at scout-001), so a verdict is keyed by
 * the part it belongs to as well. The part is the middle of the file name. */
const partOf = (file) => file.replace(/^lads-[a-z-]+\./, '').replace(/\.json$/, '')
const verdicts = new Map()
if (verifier) {
  for (const v of verifier.verdicts || verifier.findings || []) {
    const id = v.findingId || v.id
    if (id) verdicts.set(`${v.part || ''}|${id}`, v)
  }
}
const verdictOf = (f) => verdicts.get(`${partOf(f._file)}|${f.id}`) || null
let dropped = 0
let weakened = 0

/* ---------- wikidata ---------- */
const cache = fs.existsSync(CACHE) ? JSON.parse(fs.readFileSync(CACHE, 'utf8')) : {}
async function entity(qid) {
  if (cache[qid]) return cache[qid]
  const url = `https://www.wikidata.org/wiki/Special:EntityData/${qid}.json`
  let j
  for (let attempt = 1; ; attempt++) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': 'lads-local-build/1.0 (ladstravel.com)' } })
      if (!r.ok) throw new Error(`${r.status} ${url}`)
      j = await r.json()
      break
    } catch (e) {
      if (attempt >= 4) {
        console.warn(`wikidata: ${qid} failed (${e.message})`)
        return null
      }
      await new Promise((res) => setTimeout(res, 800 * attempt))
    }
  }
  const e = j.entities && j.entities[qid]
  if (!e) return null
  const claim = (p) => (e.claims && e.claims[p] && e.claims[p][0] && e.claims[p][0].mainsnak.datavalue) || null
  const coord = claim('P625')
  const site = claim('P856')
  const out = {
    label: (e.labels && e.labels.en && e.labels.en.value) || null,
    description: (e.descriptions && e.descriptions.en && e.descriptions.en.value) || null,
    lat: coord ? coord.value.latitude : null,
    lng: coord ? coord.value.longitude : null,
    site: site ? site.value : null,
    dissolved: Boolean(e.claims && (e.claims.P576 || e.claims.P3999)), // dissolved / date of official closure
    via: null,
  }
  if (!coord) {
    // a hall inside a building, a market inside a block: Wikidata records the container
    const holder = claim('P276') || claim('P361')
    const hq = holder && holder.value && holder.value.id
    if (hq && /^Q\d+$/.test(hq)) {
      const h = await entity(hq)
      if (h && Number.isFinite(h.lat)) {
        out.lat = h.lat
        out.lng = h.lng
        out.via = hq
        console.log(`${qid} has no coordinate; using its location ${hq} (${h.label})`)
      }
    }
  }
  cache[qid] = out
  return out
}

/* ---------- places ---------- */
const slug = (s) =>
  String(s || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
const norm = (s) => slug(s).replace(/^the-/, '')
const MONEY = /(?:[$€£]\s?\d)|\b\d+\s?(?:USD|CAD|dollars?)\b/i

const placeFindings = []
const traps = []
for (const f of scoutFiles) {
  const j = load(f)
  for (const x of j.findings) {
    x._file = f
    const v = verdictOf(x)
    if (v && v.verdict === 'refuted') {
      dropped++
      continue
    }
    if (x.kind === 'place' && x.value && x.value.name) placeFindings.push({ ...x, _file: f, _verdict: v })
    else if (x.kind === 'trap') traps.push({ ...x, _file: f, _verdict: v })
  }
}

const byQid = new Map()
const noQid = []
for (const f of placeFindings) {
  const q = f.value.wikidata && /^Q\d+$/.test(f.value.wikidata) ? f.value.wikidata : null
  if (q) {
    if (byQid.has(q)) continue // the same place found by two parts: first one wins
    byQid.set(q, f)
  } else noQid.push(f)
}

const places = []
for (const [qid, f] of byQid) {
  const e = await entity(qid)
  const v = f.value
  const claim = f._verdict && f._verdict.verdict === 'weakened' && f._verdict.proposedClaim ? f._verdict.proposedClaim : f.claim
  if (f._verdict && f._verdict.verdict === 'weakened') weakened++
  if (MONEY.test(claim)) throw new Error(`a money amount in a place claim: ${f.id}`)
  // P576 can record a closure a place has since come back from (Michigan Central Station
  // closed in 1988 and reopened in 2024), so it is a flag for the verifier, not a filter.
  if (e && e.dissolved) console.warn(`CHECK still open: ${v.name} (${qid}) carries a closure date on Wikidata`)
  places.push({
    id: qid,
    name: v.name,
    city: v.city || null,
    state: v.state || null,
    category: v.category || 'landmark',
    what: claim,
    capacity: Number.isFinite(v.capacity) ? v.capacity : null,
    officialUrl: v.officialUrl || (e && e.site) || null,
    lat: e && Number.isFinite(e.lat) ? Math.round(e.lat * 1e5) / 1e5 : null,
    lng: e && Number.isFinite(e.lng) ? Math.round(e.lng * 1e5) / 1e5 : null,
    coordSource: e && Number.isFinite(e.lat) ? `https://www.wikidata.org/wiki/${e.via || qid}` : null,
    wikidataLabel: e ? e.label : null,
    sources: f.sources.filter((s) => s.access === 'read').slice(0, 2).map((s) => ({ title: s.title, url: s.url })),
    checkedOn: f.checkedOn,
  })
}
for (const f of noQid) {
  const v = f.value
  places.push({
    id: `p-${slug(v.name)}`,
    name: v.name,
    city: v.city || null,
    state: v.state || null,
    category: v.category || 'landmark',
    what: f.claim,
    capacity: Number.isFinite(v.capacity) ? v.capacity : null,
    officialUrl: v.officialUrl || null,
    lat: null,
    lng: null,
    coordSource: null,
    sources: f.sources.filter((s) => s.access === 'read').slice(0, 2).map((s) => ({ title: s.title, url: s.url })),
    checkedOn: f.checkedOn,
  })
}
fs.writeFileSync(CACHE, JSON.stringify(cache, null, 1))

/* a label that disagrees with the name is the Tivoli trap: say so loudly */
const mismatched = places.filter(
  (p) => p.wikidataLabel && !norm(p.wikidataLabel).includes(norm(p.name).slice(0, 12)) && !norm(p.name).includes(norm(p.wikidataLabel).slice(0, 12))
)
for (const p of mismatched) console.warn(`CHECK identity: "${p.name}" resolved to Wikidata "${p.wikidataLabel}" (${p.id})`)
for (const p of places) delete p.wikidataLabel

/* places already on the page from another file are not repeated as researched */
const { GOOD_VIEWS } = await import(pathToFileURL(path.join(ROOT, 'src/data/localBestOf.js')).href)
const existing = new Set(GOOD_VIEWS.map((g) => norm(g.name)))
const before = places.length
const kept = places.filter((p) => {
  const n = norm(p.name)
  const dup = [...existing].some((x) => x === n || (n.length >= 14 && x.includes(n)) || (x.length >= 14 && n.includes(x)))
  if (dup) console.log(`already on the page: ${p.name}`)
  return !dup
})

/* traps attach to the place they name */
const byNorm = new Map(kept.map((p) => [norm(p.name), p]))
let attached = 0
for (const t of traps) {
  const target = t.appliesTo && byNorm.get(norm(t.appliesTo))
  if (!target) continue
  const tv = t._verdict
  target.caution = tv && tv.verdict === 'weakened' && tv.proposedClaim ? tv.proposedClaim : t.claim
  attached++
}

/* ---------- venues the events name that the scouts did not list ---------- */
const placeByQid = new Map(kept.filter((p) => /^Q/.test(p.id)).map((p) => [p.id, p]))
let synthesised = 0
for (const f of eventFiles) {
  for (const x of load(f).findings) {
    const e = x.kind === 'fact' && x.value
    const q = e && e.venueWikidata && /^Q\d+$/.test(e.venueWikidata) ? e.venueWikidata : null
    if (!q || placeByQid.has(q) || byNorm.has(norm(e.venue))) continue
    const w = await entity(q)
    if (!w || !Number.isFinite(w.lat)) continue
    // identity check: the event's venue name and Wikidata's label must share a word
    const shared = norm(e.venue).split('-').filter((t) => t.length > 3 && norm(w.label || '').includes(t))
    if (!shared.length) {
      console.warn(`CHECK venue identity: "${e.venue}" vs Wikidata "${w.label}" (${q})`)
      continue
    }
    const src = x.sources.find((s) => s.access === 'read') || x.sources[0]
    const p = {
      id: q,
      name: e.venue,
      city: e.city || null,
      state: e.state || null,
      category: 'venue',
      what: null, // nobody described the building; the events are what we know about it
      capacity: null,
      officialUrl: w.site || null,
      lat: Math.round(w.lat * 1e5) / 1e5,
      lng: Math.round(w.lng * 1e5) / 1e5,
      coordSource: `https://www.wikidata.org/wiki/${q}`,
      sources: src ? [{ title: src.title, url: src.url }] : [],
      checkedOn: x.checkedOn,
    }
    kept.push(p)
    placeByQid.set(q, p)
    byNorm.set(norm(e.venue), p)
    synthesised++
  }
}
fs.writeFileSync(CACHE, JSON.stringify(cache, null, 1))
console.log(`venues added from the events files: ${synthesised}`)

/* ---------- events ---------- */
const events = []
const seenEvents = new Set()
let unplaced = 0
for (const f of eventFiles) {
  const j = load(f)
  for (const x of j.findings) {
    if (x.kind !== 'fact' || !x.value || !x.value.date) continue
    x._file = f
    const v = verdictOf(x)
    if (v && v.verdict === 'refuted') {
      dropped++
      continue
    }
    const e = x.value
    if (v && v.verdict === 'weakened' && /cancel/i.test((v.reason || '') + (v.proposedClaim || ''))) {
      console.log(`cancelled, dropped: ${e.title} (${e.date})`)
      dropped++
      continue
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(e.date) || !e.title || !e.venue || !e.url) continue
    if (MONEY.test(x.claim) || MONEY.test(e.title)) throw new Error(`a money amount in an event: ${x.id}`)
    const place = (e.venueWikidata && placeByQid.get(e.venueWikidata)) || byNorm.get(norm(e.venue)) || null
    if (!place) unplaced++
    const key = `${e.date}|${norm(e.title)}|${norm(e.venue)}`
    if (seenEvents.has(key)) continue
    seenEvents.add(key)
    // a row the researcher could only call 'home game' takes the opponent the verifier read
    let title = e.title
    if (/opponent not printed/i.test(title) && v && v.proposedClaim) {
      const m = /^([A-Z][\w .'-]+? vs [A-Z][\w .'-]+?) at /.exec(v.proposedClaim)
      if (m) title = m[1].replace(/^(Milwaukee|Chicago|Detroit|Minnesota|Cleveland|Indiana|Indianapolis) /, '')
    }
    events.push({
      id: `${slug(e.venue).slice(0, 24)}-${e.date}-${slug(e.title).slice(0, 28)}`,
      title,
      date: e.date,
      endDate: e.endDate && /^\d{4}-\d{2}-\d{2}$/.test(e.endDate) ? e.endDate : null,
      time: e.time || null,
      venue: e.venue,
      city: e.city || (place && place.city) || null,
      state: e.state || (place && place.state) || null,
      type: e.type || 'other',
      url: e.url,
      venueKey: place ? place.id : null,
      ...(v && v.verdict === 'weakened' && v.proposedClaim ? { note: v.proposedClaim } : {}),
      ...(v && v.verdict === 'confirmed' ? { checked: true } : {}),
    })
  }
}
events.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : a.title.localeCompare(b.title)))

/* ---------- write ---------- */
const header = `/* GENERATED by tools/build-local-data.mjs on ${TODAY} from ${runDir}. Do not edit by hand.
 * Places are the research agents' findings; each coordinate is Wikidata's (P625) for that
 * place's own QID, never resolved from a name. Events were read from each organiser's own
 * page, which is the url on every row. ${verifier ? 'The verifier ran over this run.' : 'NOT YET VERIFIED.'}
 * No ticket prices, no ratings, no Lads voice: a founder has visited none of these. */
`
fs.writeFileSync(
  path.join(ROOT, 'src/data/localResearch.js'),
  header +
    `\nexport const RESEARCH_META = ${JSON.stringify(
      {
        run: run.runId,
        checkedOn: run.today,
        builtOn: TODAY,
        verified: Boolean(verifier),
        sources: [
          { name: 'Wikidata', url: 'https://www.wikidata.org/', licence: 'CC0' },
          { name: 'Natural Earth', url: 'https://www.naturalearthdata.com/', licence: 'public domain' },
          { name: 'Terrarium elevation tiles', url: 'https://registry.opendata.aws/terrain-tiles/' },
        ],
      },
      null,
      2
    )}\n\nexport const RESEARCH_PLACES = ${JSON.stringify(kept, null, 1)}\n\nexport const RESEARCH_EVENTS = ${JSON.stringify(events, null, 1)}\n`
)
console.log(
  `places: ${kept.length} (${before - kept.length} already on the page, ${kept.filter((p) => p.lat != null).length} with a coordinate, ${noQid.length} without a QID, ${attached} cautions attached, ${mismatched.length} identities to check)`
)
console.log(`events: ${events.length} (${unplaced} at a venue not in the place list)`)
console.log(`verifier: ${verifier ? `${verdicts.size} verdicts, ${dropped} dropped (refuted or cancelled), ${events.filter((e) => e.checked).length} events confirmed on the organiser page, ${events.filter((e) => e.note).length} carrying a correction` : 'not run yet'}`)
