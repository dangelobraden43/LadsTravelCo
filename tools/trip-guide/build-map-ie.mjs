/* /trip-guide map builder for Ireland (event guides). Runs at build time; the page makes no map requests.
 *
 *   - island outline: Natural Earth 1:10m land, rings inside the bbox only, Douglas-Peucker simplified
 *   - rail: OpenStreetMap ways railway=rail (no service tracks) via Overpass, built into a graph;
 *     each rail leg is the shortest path through that graph between two station nodes, so the drawn
 *     line is the real track, never a straight line pretending to be one
 *   - stations: OSM station nodes matched on the EXACT name inside the bbox (one match or the build fails)
 *   - pins: Wikidata coordinates by QID (P625), or an OSM element by exact name + tag, never a geocode
 *   - bus legs: drawn as a gentle dashed arc between their two pins and labelled bus; no fake route
 * One equirectangular projection per canvas (lat first in project()); everything cached to <out>.
 *
 * Usage: node tools/trip-guide/build-map-ie.mjs <plan.mjs> <out map.json> [--refresh]
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const UA = { 'User-Agent': 'lads-travel-co trip-guide builder (brady@ladstravel.com)' }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function getJSON(url, opts = {}, tries = 3) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { ...opts, headers: { ...UA, ...(opts.headers || {}) } })
      if (r.ok) return await r.json()
      console.error('HTTP', r.status, url.slice(0, 90))
    } catch (e) { console.error('fetch failed', e.message) }
    await sleep(4000 * (i + 1))
  }
  throw new Error('gave up: ' + url.slice(0, 120))
}
const overpass = (q) => getJSON('https://overpass-api.de/api/interpreter', { method: 'POST', body: new URLSearchParams({ data: q }) })

/* Douglas-Peucker on [lng, lat] pairs */
function simplify(pts, tol) {
  if (pts.length < 3) return pts
  const keep = new Uint8Array(pts.length); keep[0] = keep[pts.length - 1] = 1
  const stack = [[0, pts.length - 1]]
  while (stack.length) {
    const [a, b] = stack.pop(); let md = 0; let mi = -1
    const [x1, y1] = pts[a]; const [x2, y2] = pts[b]; const dx = x2 - x1; const dy = y2 - y1; const L = dx * dx + dy * dy || 1e-12
    for (let i = a + 1; i < b; i++) {
      const t = Math.max(0, Math.min(1, ((pts[i][0] - x1) * dx + (pts[i][1] - y1) * dy) / L))
      const d = Math.hypot(pts[i][0] - (x1 + t * dx), pts[i][1] - (y1 + t * dy))
      if (d > md) { md = d; mi = i }
    }
    if (md > tol && mi > 0) { keep[mi] = 1; stack.push([a, mi], [mi, b]) }
  }
  return pts.filter((_, i) => keep[i])
}
const hav = (a, b) => { const R = 6371; const r = Math.PI / 180; const dLat = (b[1] - a[1]) * r; const dLng = (b[0] - a[0]) * r; const s = Math.sin(dLat / 2) ** 2 + Math.cos(a[1] * r) * Math.cos(b[1] * r) * Math.sin(dLng / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(s)) }

export async function fetchAll(spec, pinsOnly = false) {
  const [s, w, n, e] = spec.bbox
  if (pinsOnly) return { pins: await fetchPins(spec, {}) }
  const land = await getJSON('https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_land.geojson')
  const rings = []
  for (const f of land.features) {
    const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates
    for (const p of polys) {
      const ring = p[0]
      const inside = ring.filter(([x, y]) => x >= w && x <= e && y >= s && y <= n).length
      if (inside / ring.length > 0.9 && ring.length > 30) rings.push(ring)
    }
  }
  const railQ = `[out:json][timeout:180];way["railway"="rail"][!"service"](${s},${w},${n},${e});out geom;`
  const rail = await overpass(railQ)
  const ways = rail.elements.filter((x) => x.type === 'way' && x.geometry).map((x) => ({ id: x.id, nodes: x.nodes, geom: x.geometry.map((g) => [g.lon, g.lat]), usage: x.tags.usage || null }))
  await sleep(2000)
  const names = spec.stations.map((st) => st.osmName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  const stQ = `[out:json][timeout:60];node["railway"="station"]["name"~"^(${names.join('|')})$"](${s},${w},${n},${e});out;`
  const st = await overpass(stQ)
  const stations = {}
  for (const x of spec.stations) {
    const hits = st.elements.filter((el) => el.tags.name === x.osmName)
    if (hits.length !== 1) throw new Error(`station ${x.osmName}: ${hits.length} exact matches (need 1)`)
    stations[x.id] = { lat: hits[0].lat, lng: hits[0].lon, source: `OSM node ${hits[0].id} (${x.osmName})` }
  }
  const pins = await fetchPins(spec, stations)
  return { rings, ways, stations, pins }
}

async function fetchPins(spec, stations) {
  const [s, w, n, e] = spec.bbox
  const pins = {}
  for (const p of spec.pins) {
    if (p.wd) {
      const j = await getJSON(`https://www.wikidata.org/wiki/Special:EntityData/${p.wd}.json`)
      const ent = j.entities[p.wd]
      const c = ent.claims.P625 && ent.claims.P625[0].mainsnak.datavalue.value
      if (!c) throw new Error(`${p.wd} has no P625`)
      const label = ent.labels.en && ent.labels.en.value
      if (p.expectLabel && !String(label).includes(p.expectLabel)) throw new Error(`${p.wd} label "${label}" does not match ${p.expectLabel}`)
      pins[p.id] = { lat: c.latitude, lng: c.longitude, source: `Wikidata ${p.wd} (${label})` }
    } else if (p.osm) {
      const q = `[out:json][timeout:60];nwr["${p.osm.tag}"="${p.osm.value}"]["name"="${p.osm.name}"](${s},${w},${n},${e});out center;`
      const r = await overpass(q)
      if (r.elements.length < 1) throw new Error(`OSM ${p.osm.name}: no exact match`)
      const el = r.elements.sort((a, b) => (a.type === 'relation' ? -1 : 1))[0]
      const c = el.center || { lat: el.lat, lon: el.lon }
      pins[p.id] = { lat: c.lat, lng: c.lon, source: `OSM ${el.type} ${el.id} (${p.osm.name})` }
      await sleep(1500)
    } else if (p.station) {
      pins[p.id] = { ...stations[p.station] }
    }
  }
  return pins
}

export function compose(spec, raw) {
  const [s, w, n, e] = spec.bbox
  const lat0 = (s + n) / 2; const k = Math.cos(lat0 * Math.PI / 180)
  const W = spec.width; const H = Math.round(W * (n - s) / ((e - w) * k))
  const project = (lat, lng) => [+(((lng - w) * k) / ((e - w) * k) * W).toFixed(1), +(((n - lat) / (n - s)) * H).toFixed(1)]
  const toD = (pts, close) => pts.map((p, i) => (i ? 'L' : 'M') + project(p[1], p[0]).join(' ')).join('') + (close ? 'Z' : '')
  const land = raw.rings.map((r) => toD(simplify(r, 0.006), true)).join('')

  /* graph from rail ways, node id -> [lng, lat] and adjacency */
  const coord = new Map(); const adj = new Map()
  const link = (a, b, d) => { if (!adj.has(a)) adj.set(a, []); adj.get(a).push([b, d]) }
  for (const wy of raw.ways) {
    for (let i = 0; i < wy.nodes.length; i++) coord.set(wy.nodes[i], wy.geom[i])
    for (let i = 1; i < wy.nodes.length; i++) { const d = hav(wy.geom[i - 1], wy.geom[i]); link(wy.nodes[i - 1], wy.nodes[i], d); link(wy.nodes[i], wy.nodes[i - 1], d) }
  }
  /* OSM splits a line into ways that do not always share a node at a junction; stitch any way
   * end to the closest node of another way within 40 m so the graph matches the real network */
  const ends = []; for (const wy of raw.ways) ends.push([wy.nodes[0], wy.id], [wy.nodes[wy.nodes.length - 1], wy.id])
  const wayOf = new Map(); for (const wy of raw.ways) for (const nd of wy.nodes) if (!wayOf.has(nd)) wayOf.set(nd, wy.id)
  const cells = new Map(); const cellKey = (c) => Math.round(c[0] * 200) + ':' + Math.round(c[1] * 200)
  for (const [id, c] of coord) { const k = cellKey(c); if (!cells.has(k)) cells.set(k, []); cells.get(k).push(id) }
  let stitched = 0
  for (const [nd, wid] of ends) {
    const c = coord.get(nd); const [cx, cy] = cellKey(c).split(':').map(Number); let best = null; let bd = 0.04
    for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) for (const o of cells.get((cx + dx) + ':' + (cy + dy)) || []) {
      if (o === nd || wayOf.get(o) === wid) continue
      const d = hav(c, coord.get(o)); if (d < bd) { bd = d; best = o }
    }
    if (best != null && !(adj.get(nd) || []).some(([v]) => v === best)) { link(nd, best, bd); link(best, nd, bd); stitched++ }
  }
  const nearest = (lat, lng) => { let best = null; let bd = Infinity; for (const [id, c] of coord) { const d = hav([lng, lat], c); if (d < bd) { bd = d; best = id } } return { id: best, km: bd } }
  const snap = {}
  for (const [id, stn] of Object.entries(raw.stations)) {
    const nn = nearest(stn.lat, stn.lng)
    if (nn.km > 0.6) throw new Error(`station ${id} is ${nn.km.toFixed(2)} km from any track`)
    snap[id] = nn.id
  }
  function dijkstra(a, b) {
    const dist = new Map([[a, 0]]); const prev = new Map(); const seen = new Set()
    const heap = [[0, a]]
    while (heap.length) {
      heap.sort((x, y) => x[0] - y[0]); const [d, u] = heap.shift()
      if (seen.has(u)) continue; seen.add(u)
      if (u === b) break
      for (const [v, wgt] of adj.get(u) || []) { const nd = d + wgt; if (nd < (dist.get(v) ?? Infinity)) { dist.set(v, nd); prev.set(v, u); heap.push([nd, v]) } }
    }
    if (!dist.has(b)) return null
    const path = [b]; while (path[0] !== a) path.unshift(prev.get(path[0]))
    return { km: dist.get(b), pts: path.map((id) => coord.get(id)) }
  }
  /* the whole network, faint: simplified per way */
  const network = raw.ways.map((wy) => toD(simplify(wy.geom, 0.003), false)).join('')

  const legs = {}
  for (const [id, leg] of Object.entries(spec.legs)) {
    if (leg.mode === 'rail') {
      const stops = [leg.from, ...(leg.via || []), leg.to]
      let pts = []; let km = 0
      /* a stop that is a pin (a temporary event station, say) snaps to the nearest track within leg.snapKm */
      for (const sp of stops) if (!snap[sp]) { const g = raw.pins[sp]; if (!g) throw new Error(`leg ${id}: unknown stop ${sp}`); const nn = nearest(g.lat, g.lng); if (nn.km > (leg.snapKm || 0.6)) throw new Error(`leg ${id}: ${sp} is ${nn.km.toFixed(2)} km from track`); snap[sp] = nn.id }
      for (let i = 1; i < stops.length; i++) {
        const r = dijkstra(snap[stops[i - 1]], snap[stops[i]])
        if (!r) throw new Error(`no rail path for leg ${id} (${stops[i - 1]} -> ${stops[i]})`)
        pts = pts.concat(i > 1 ? r.pts.slice(1) : r.pts); km += r.km
      }
      legs[id] = { mode: 'rail', style: leg.style || null, d: toD(simplify(pts, 0.0015), false), km: Math.round(km), label: leg.label }
    } else {
      const A = raw.pins[leg.from] || raw.stations[leg.from]; const B = raw.pins[leg.to] || raw.stations[leg.to]
      if (!A || !B) throw new Error(`bus leg ${id}: missing pin`)
      const [x1, y1] = project(A.lat, A.lng); const [x2, y2] = project(B.lat, B.lng)
      const mx = (x1 + x2) / 2; const my = (y1 + y2) / 2; const nx = -(y2 - y1) * 0.12; const ny = (x2 - x1) * 0.12
      legs[id] = { mode: leg.mode, style: leg.style || null, d: `M${x1} ${y1}Q${(mx + nx).toFixed(1)} ${(my + ny).toFixed(1)} ${x2} ${y2}`, km: Math.round(hav([A.lng, A.lat], [B.lng, B.lat])), label: leg.label }
    }
  }
  const pins = []
  for (const p of spec.pins) {
    const g = raw.pins[p.id]; if (!g) continue
    const [x, y] = project(g.lat, g.lng)
    pins.push({ id: p.id, label: p.label, kind: p.kind, x, y, lat: +g.lat.toFixed(5), lng: +g.lng.toFixed(5), source: g.source, card: p.card || null, anchor: p.anchor || 'r' })
  }
  return { w: W, h: H, land, network, legs, pins, shapes: spec.shapes }
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  const [planPath, out, flag] = process.argv.slice(2)
  const mod = await import(pathToFileURL(path.resolve(planPath)).href)
  const spec = mod.mapSpecIE
  const cache = out.replace(/\.json$/, '.raw.json')
  let raw
  if (existsSync(cache) && flag !== '--refresh') raw = JSON.parse(readFileSync(cache, 'utf8'))
  else { raw = await fetchAll(spec); writeFileSync(cache, JSON.stringify(raw)) }
  /* pins added to the spec since the cache was written are fetched on their own */
  const missing = spec.pins.filter((p) => !raw.pins[p.id])
  if (missing.length) { const extra = await fetchAll({ ...spec, pins: missing.filter((p) => !p.station) }, true); for (const p of missing.filter((q) => q.station)) extra.pins[p.id] = { ...raw.stations[p.station] }; Object.assign(raw.pins, extra.pins); writeFileSync(cache, JSON.stringify(raw)) }
  const m = compose(spec, raw)
  writeFileSync(out, JSON.stringify(m))
  console.log(`${out}: ${m.w}x${m.h}, ${m.pins.length} pins, ${Object.keys(m.legs).length} legs, ${(JSON.stringify(m).length / 1024).toFixed(0)} KB`)
  for (const [id, l] of Object.entries(m.legs)) console.log(`  ${id} ${l.mode} ${l.km} km`)
}
