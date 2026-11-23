/* tools/build-local-landmarks.mjs — GENERATES the landmark layer of /local.
 *
 *   node tools/build-local-landmarks.mjs
 *
 * Writes
 *   src/data/localLandmarks.js        airports (identity from Wikidata, confirmed on the IATA code),
 *                                     each hub's centre and model file, venue footprints by QID
 *   public/local/build/<hub>.json     the model city for a hub: building footprints in metres from
 *                                     the hub centre with a height, lazy-loaded on fly-in
 *
 * Every shape is read from OpenStreetMap (Overpass) at build time: buildings around a hub centre that
 * the data itself chose (the member with the most neighbours within 2 km), venues by their Wikidata
 * tag, runways by `aeroway=runway` around the airport's own coordinate. Heights are OSM's `height`
 * or `building:levels`; a building with neither gets DEFAULT_H and is marked so the page can say so.
 * Nothing is drawn by hand. Raw responses are cached under internal/research/landmarks-cache/.
 */
/* eslint-env node */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const CACHE = path.join(ROOT, 'internal/research/landmarks-cache')
const OUT_DIR = path.join(ROOT, 'public/local/build')
fs.mkdirSync(CACHE, { recursive: true })
fs.mkdirSync(OUT_DIR, { recursive: true })
const now = new Date()
const TODAY = [now.getFullYear(), now.getMonth() + 1, now.getDate()].map((n) => String(n).padStart(2, '0')).join('-')
const UA = { 'User-Agent': 'lads-local-build/1.0 (ladstravel.com)' }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

/* the index imports this tool's own output, so a first run boots from an empty file */
const TARGET = path.join(ROOT, 'src/data/localLandmarks.js')
if (!fs.existsSync(TARGET))
  fs.writeFileSync(
    TARGET,
    `/* stub written by tools/build-local-landmarks.mjs before its first run */\nexport const LANDMARKS_META = { builtOn: null, defaultHeightM: 12, footprintScale: 8, heightScale: 25 }\nexport const AIRPORTS = []\nexport const HUB_BUILDS = []\n`
  )
const { HUBS, placeById } = await import(pathToFileURL(path.join(ROOT, 'src/data/localIndex.js')).href)

/* ---------- the airports we show: name for the search, IATA code for the identity check ---------- */
const AIRPORTS = [
  { iata: 'ORD', search: "O'Hare International Airport", gateway: true },
  { iata: 'MDW', search: 'Chicago Midway International Airport' },
  { iata: 'DTW', search: 'Detroit Metropolitan Wayne County Airport', gateway: true },
  { iata: 'GRR', search: 'Gerald R. Ford International Airport', gateway: true },
  { iata: 'MSP', search: 'Minneapolis–Saint Paul International Airport', gateway: true },
  { iata: 'FNT', search: 'Bishop International Airport' },
  { iata: 'LAN', search: 'Capital Region International Airport' },
  { iata: 'TVC', search: 'Cherry Capital Airport' },
  { iata: 'MKE', search: 'Milwaukee Mitchell International Airport' },
  { iata: 'MSN', search: 'Dane County Regional Airport' },
  { iata: 'GRB', search: 'Austin Straubel International Airport', alt: ['Green Bay Austin Straubel International Airport', 'Green Bay airport'] },
  { iata: 'IND', search: 'Indianapolis International Airport' },
  { iata: 'SBN', search: 'South Bend International Airport', alt: ['South Bend Regional Airport', 'South Bend airport Indiana'] },
  { iata: 'CLE', search: 'Cleveland Hopkins International Airport' },
  { iata: 'CMH', search: 'John Glenn Columbus International Airport' },
  { iata: 'CVG', search: 'Cincinnati/Northern Kentucky International Airport' },
  { iata: 'DLH', search: 'Duluth International Airport' },
  { iata: 'MQT', search: 'Sawyer International Airport' },
]

async function getJSON(url, key, init) {
  const file = path.join(CACHE, key + '.json')
  if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, 'utf8'))
  for (let attempt = 1; ; attempt++) {
    try {
      const r = await fetch(url, { headers: UA, ...init })
      if (r.status === 429) throw Object.assign(new Error(`429 ${url.slice(0, 80)}`), { slow: true })
      if (!r.ok) throw new Error(`${r.status} ${url.slice(0, 80)}`)
      const j = await r.json()
      fs.writeFileSync(file, JSON.stringify(j))
      await sleep(500) // Wikidata and Overpass both rate-limit a burst
      return j
    } catch (e) {
      if (attempt >= (process.env.LANDMARK_FAST ? 2 : 6)) throw e
      console.warn(`retry ${attempt}: ${e.message}`)
      await sleep((e.slow ? 8000 : 1500) * attempt)
    }
  }
}

/* ---------- Wikidata: find the entity, then prove it by its IATA code ---------- */
const claim = (e, p) => (e.claims && e.claims[p] && e.claims[p][0] && e.claims[p][0].mainsnak.datavalue) || null
async function airport(a) {
  const hits = []
  const names = [a.search, ...(a.alt || [])]
  for (let i = 0; i < names.length; i++) {
    const s = await getJSON(
      `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(names[i])}&language=en&limit=7&format=json`,
      `search-${a.iata}-${i}`
    )
    hits.push(...(s.search || []))
  }
  for (const hit of hits) {
    const ent = await getJSON(`https://www.wikidata.org/wiki/Special:EntityData/${hit.id}.json`, `entity-${hit.id}`)
    const e = ent.entities[hit.id]
    const iata = claim(e, 'P238')
    if (!iata || iata.value !== a.iata) continue
    const coord = claim(e, 'P625')
    if (!coord) continue
    // passengers per year: the latest statement with a point in time
    let pax = null
    for (const st of (e.claims && e.claims.P3872) || []) {
      const n = st.mainsnak.datavalue && Number(st.mainsnak.datavalue.value.amount)
      const when = st.qualifiers && st.qualifiers.P585 && st.qualifiers.P585[0].datavalue
      const year = when ? Number(when.value.time.slice(1, 5)) : null
      if (Number.isFinite(n) && (!pax || (year || 0) > (pax.year || 0))) pax = { n, year }
    }
    const site = claim(e, 'P856')
    return {
      iata: a.iata,
      qid: hit.id,
      name: e.labels.en.value,
      lat: Math.round(coord.value.latitude * 1e5) / 1e5,
      lng: Math.round(coord.value.longitude * 1e5) / 1e5,
      passengers: pax,
      url: site ? site.value : null,
      gateway: Boolean(a.gateway),
    }
  }
  console.warn(`SKIPPED ${a.iata}: no Wikidata entity carrying that IATA code among the search hits for "${names.join('" / "')}"`)
  return null
}

/* ---------- Overpass ---------- */
const OVERPASS = ['https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter']
async function overpass(query, key) {
  let last = null
  for (const url of OVERPASS) {
    try {
      const j = await getJSON(url, key, {
        method: 'POST',
        body: 'data=' + encodeURIComponent(query),
        headers: { ...UA, 'Content-Type': 'application/x-www-form-urlencoded' },
      })
      await sleep(1200)
      return j.elements || []
    } catch (e) {
      last = e
      console.warn(`overpass mirror failed (${e.message.slice(0, 60)}); trying the next`)
    }
  }
  throw last
}

/* metres east/north of an origin, from degrees */
const local = (lat, lng, o) => [
  Math.round(((lng - o.lng) * 111200 * Math.cos((o.lat * Math.PI) / 180)) * 2) / 2,
  Math.round((lat - o.lat) * 111200 * 2) / 2,
]
/* Douglas-Peucker on a closed ring, metres */
function simplify(pts, tol) {
  if (pts.length <= 4) return pts
  const d2 = (p, a, b) => {
    const dx = b[0] - a[0]
    const dy = b[1] - a[1]
    const l2 = dx * dx + dy * dy
    let t = l2 ? ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / l2 : 0
    t = Math.max(0, Math.min(1, t))
    const ex = a[0] + t * dx - p[0]
    const ey = a[1] + t * dy - p[1]
    return ex * ex + ey * ey
  }
  const keep = new Uint8Array(pts.length)
  keep[0] = keep[pts.length - 1] = 1
  const stack = [[0, pts.length - 1]]
  while (stack.length) {
    const [i, j] = stack.pop()
    let best = -1
    let far = tol * tol
    for (let k = i + 1; k < j; k++) {
      const d = d2(pts[k], pts[i], pts[j])
      if (d > far) {
        far = d
        best = k
      }
    }
    if (best > 0) {
      keep[best] = 1
      stack.push([i, best], [best, j])
    }
  }
  return pts.filter((_, k) => keep[k])
}
const area = (p) => {
  let s = 0
  for (let i = 0; i < p.length; i++) {
    const a = p[i]
    const b = p[(i + 1) % p.length]
    s += a[0] * b[1] - b[0] * a[1]
  }
  return Math.abs(s) / 2
}
const DEFAULT_H = 12 // metres: three storeys, used only where OSM records no height or level count
function heightOf(tags) {
  const h = tags.height && parseFloat(String(tags.height).replace(/[^\d.]/g, ''))
  if (Number.isFinite(h) && h > 0) return { h: Math.round(h), known: true }
  const lv = tags['building:levels'] && parseFloat(tags['building:levels'])
  if (Number.isFinite(lv) && lv > 0) return { h: Math.round(lv * 3.6), known: true }
  return { h: DEFAULT_H, known: false }
}
/* the outer ring of a way or a multipolygon relation, as [lat,lng] pairs */
function rings(el) {
  if (el.type === 'way' && el.geometry) return [el.geometry.map((g) => [g.lat, g.lon])]
  if (el.type === 'relation' && el.members)
    return el.members.filter((m) => m.role === 'outer' && m.geometry).map((m) => m.geometry.map((g) => [g.lat, g.lon]))
  return []
}
function footprints(elements, origin, { minArea = 150, tol = 2 } = {}) {
  const out = []
  let unknown = 0
  for (const el of elements) {
    const tags = el.tags || {}
    const { h, known } = heightOf(tags)
    for (const ring of rings(el)) {
      let p = ring.map(([la, lo]) => local(la, lo, origin))
      if (p.length > 1 && p[0][0] === p[p.length - 1][0] && p[0][1] === p[p.length - 1][1]) p = p.slice(0, -1)
      p = simplify([...p, p[0]], tol).slice(0, -1)
      if (p.length < 3 || area(p) < minArea) continue
      if (!known) unknown++
      out.push({ p, h, ...(known ? {} : { d: 1 }), ...(tags.wikidata ? { q: tags.wikidata } : {}), ...(tags.name ? { n: tags.name } : {}) })
    }
  }
  return { out, unknown }
}

/* ---------- hubs: the centre the data chooses ---------- */
const km = (a, b) => {
  const dLat = (a.lat - b.lat) * 111.2
  const dLng = (a.lng - b.lng) * 111.2 * Math.cos((((a.lat + b.lat) / 2) * Math.PI) / 180)
  return Math.hypot(dLat, dLng)
}
function centreOf(hub) {
  const members = hub.memberIds.map(placeById)
  let best = null
  for (const m of members) {
    const near = members.filter((o) => km(m, o) <= 2).length
    if (!best || near > best.near) best = { near, m }
  }
  return { lat: best.m.lat, lng: best.m.lng, anchor: best.m.name, near: best.near }
}

/* ---------- run ---------- */
const airports = []
for (const a of AIRPORTS) {
  const r = await airport(a)
  if (!r) continue
  airports.push(r)
  console.log(`${r.iata} ${r.qid} ${r.name} ${r.passengers ? `${r.passengers.n} pax (${r.passengers.year})` : ''}`)
}
const gateways = airports.filter((a) => a.gateway)
for (const a of airports) {
  const g = gateways.map((x) => [km(a, x), x.iata]).sort((p, q) => p[0] - q[0])[0]
  a.gatewayIata = a.gateway ? a.iata : g[1]
  const rw = await overpass(
    `[out:json][timeout:60];way["aeroway"="runway"](around:3500,${a.lat},${a.lng});out body geom;`,
    `runways-${a.iata}`
  )
  a.runways = rw
    .filter((w) => w.geometry && w.geometry.length >= 2)
    .map((w) => ({
      p: simplify(w.geometry.map((g) => local(g.lat, g.lon, a)), 3),
      w: Math.round(parseFloat((w.tags && w.tags.width) || 45)) || 45,
    }))
  console.log(`  ${a.iata}: ${a.runways.length} runways, gateway ${a.gatewayIata}`)
}

const hubsOut = []
const skipped = []
for (const hub of HUBS) {
  const c = centreOf(hub)
  const radius = hub.memberIds.length >= 25 ? 1100 : 800
  let els
  try {
    els = await overpass(
    `[out:json][timeout:90];(way["building"](around:${radius},${c.lat},${c.lng});relation["building"]["type"="multipolygon"](around:${radius},${c.lat},${c.lng}););out body geom;`,
    `buildings-${hub.id}`
    )
  } catch (e) {
    // a hub the servers would not give us today is left without a model; the page copes
    console.warn(`SKIPPED ${hub.name}: ${e.message.slice(0, 80)}`)
    skipped.push(hub.name)
    continue
  }
  const { out: buildings, unknown } = footprints(els, c)
  // the venues this hub holds, by their Wikidata tag on the map data
  const qids = hub.memberIds.map(placeById).filter((p) => p.key && /^Q\d+$/.test(p.key) && p.layer === 'venues').map((p) => p.key)
  let venues = []
  if (qids.length) {
    let vEls = []
    try {
      vEls = await overpass(
        `[out:json][timeout:60];(way["wikidata"~"^(${qids.join('|')})$"];relation["wikidata"~"^(${qids.join('|')})$"];);out body geom;`,
        `venues-${hub.id}`
      )
    } catch (e) {
      console.warn(`venues for ${hub.name} not read: ${e.message.slice(0, 60)}`)
    }
    venues = footprints(vEls, c, { minArea: 400, tol: 3 }).out.filter((v) => v.q)
    // a venue with no recorded height is a bowl, not three storeys
    for (const v of venues) if (v.d) v.h = 24
  }
  const file = `${hub.id}.json`
  fs.writeFileSync(path.join(OUT_DIR, file), JSON.stringify({ centre: [c.lat, c.lng], radius, buildings, venues }))
  hubsOut.push({ id: hub.id, name: hub.name, centre: [c.lat, c.lng], anchor: c.anchor, radius, file: `/local/build/${file}`, buildings: buildings.length, unknownHeights: unknown, venues: venues.map((v) => v.q) })
  console.log(`${hub.name}: centre at ${c.anchor} (${c.near} within 2 km), ${buildings.length} buildings (${unknown} default height), ${venues.length} of ${qids.length} venues footprinted`)
}

const header = `/* GENERATED by tools/build-local-landmarks.mjs on ${TODAY}. Do not edit by hand.
 * Airports: Wikidata entities proven by their IATA code (P238), coordinates P625, passengers P3872.
 * Runways, buildings and venue footprints: OpenStreetMap via Overpass (© OpenStreetMap contributors, ODbL),
 * read around a hub centre the data itself chose. Heights: OSM height or building:levels; d:1 marks the default. */
`
fs.writeFileSync(
  path.join(ROOT, 'src/data/localLandmarks.js'),
  header +
    `\nexport const LANDMARKS_META = ${JSON.stringify({ builtOn: TODAY, defaultHeightM: DEFAULT_H, footprintScale: 8, heightScale: 25 }, null, 2)}\n\nexport const AIRPORTS = ${JSON.stringify(airports, null, 1)}\n\nexport const HUB_BUILDS = ${JSON.stringify(hubsOut, null, 1)}\n`
)
console.log(`airports: ${airports.length}; hub models: ${hubsOut.length}${skipped.length ? `; SKIPPED (re-run later): ${skipped.join(', ')}` : ''}`)
