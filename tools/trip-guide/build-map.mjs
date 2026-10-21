/* /trip-guide map builder. Runs at build time; the page itself makes no map requests.
 *
 *   - town waypoints: OSM Nominatim, "Town, ST" only, and each result must carry the expected
 *     state (a bare name is never trusted: the Tivoli rule)
 *   - road geometry: OSRM public router, one route per leg option, through the plan's waypoints
 *   - state outlines: glynnbird/usstatesgeojson, outer rings only, simplified
 *   - elevation: OpenTopoData srtm90m, sampled along one chosen path, 100 points per call
 * Everything is projected through ONE equirectangular transform per canvas (lat first in
 * project(), GeoJSON order inside the fetch code) and cached to <out> so rebuilds are offline.
 *
 * Usage: node tools/trip-guide/build-map.mjs <plan.mjs> <out map.json> [--refresh]
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const UA = { 'User-Agent': 'lads-travel-co trip-guide builder (brady@ladstravel.com)' }
const STATE_NAMES = { MI: 'michigan', OH: 'ohio', IN: 'indiana', KY: 'kentucky', WV: 'west virginia', VA: 'virginia', PA: 'pennsylvania', MD: 'maryland', NC: 'north carolina', TN: 'tennessee', DE: 'delaware', NJ: 'new jersey', NY: 'new york', DC: 'district of columbia' }

async function getJSON(url, tries = 3) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { headers: UA })
      if (r.ok) return await r.json()
      if (r.status === 429) { await sleep(2000 * (i + 1)); continue }
      throw new Error(`HTTP ${r.status} ${url}`)
    } catch (e) { if (i === tries - 1) throw e; await sleep(1500) }
  }
}

export async function geocodeTown(q, cache) {
  if (cache[q]) return cache[q]
  const [town, st] = q.split(',').map((s) => s.trim())
  const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&countrycodes=us&limit=5&city=${encodeURIComponent(town)}&state=${encodeURIComponent(STATE_NAMES[st] || st)}`
  const res = await getJSON(url)
  await sleep(1100) // Nominatim policy: one request a second
  const hit = (res || []).find((x) => (x.address && (x.address.state || '').toLowerCase() === (STATE_NAMES[st] || '').toLowerCase()))
  if (!hit) throw new Error(`geocode: no ${st} match for "${q}"`)
  cache[q] = { lat: +hit.lat, lng: +hit.lon, source: `OSM ${hit.osm_type}/${hit.osm_id}` }
  return cache[q]
}

async function route(points) {
  const coords = points.map((p) => `${p.lng.toFixed(5)},${p.lat.toFixed(5)}`).join(';')
  const r = await getJSON(`https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`)
  await sleep(1000)
  if (!r || r.code !== 'Ok') throw new Error('osrm: ' + (r && r.code))
  const rt = r.routes[0]
  return { line: rt.geometry.coordinates.map(([lng, lat]) => [lat, lng]), km: rt.distance / 1000, hours: rt.duration / 3600 }
}

/* Douglas-Peucker on [x,y] */
export function simplify(pts, eps) {
  if (pts.length < 3) return pts
  const keep = new Uint8Array(pts.length); keep[0] = keep[pts.length - 1] = 1
  const stack = [[0, pts.length - 1]]
  while (stack.length) {
    const [a, b] = stack.pop(); let idx = -1; let dmax = eps
    const [ax, ay] = pts[a]; const [bx, by] = pts[b]; const dx = bx - ax; const dy = by - ay; const len = Math.hypot(dx, dy) || 1
    for (let i = a + 1; i < b; i++) { const d = Math.abs(dy * pts[i][0] - dx * pts[i][1] + bx * ay - by * ax) / len; if (d > dmax) { dmax = d; idx = i } }
    if (idx > 0) { keep[idx] = 1; stack.push([a, idx], [idx, b]) }
  }
  return pts.filter((_, i) => keep[i])
}

export function projector(bbox, width) {
  const [s, w, n, e] = bbox; const lat0 = ((s + n) / 2) * Math.PI / 180; const k = Math.cos(lat0)
  const sx = width / ((e - w) * k); const height = (n - s) * sx
  return { width, height: Math.round(height), project: (lat, lng) => [+((lng - w) * k * sx).toFixed(1), +((n - lat) * sx).toFixed(1)] }
}
const toPath = (xy) => xy.map(([x, y], i) => (i ? 'L' : 'M') + x + ' ' + y).join('') // compact SVG path

async function stateOutlines(codes, cache) {
  const out = {}
  for (const c of codes) {
    if (cache[c]) { out[c] = cache[c]; continue }
    const g = await getJSON(`https://raw.githubusercontent.com/glynnbird/usstatesgeojson/master/${encodeURIComponent(STATE_NAMES[c])}.geojson`)
    const geom = g.features ? g.features[0].geometry : g.geometry
    const polys = geom.type === 'Polygon' ? [geom.coordinates] : geom.coordinates
    out[c] = cache[c] = polys.map((p) => p[0].map(([lng, lat]) => [lat, lng])) // outer rings only
  }
  return out
}

function haversine(a, b) {
  const R = 6371; const toR = Math.PI / 180
  const dLat = (b[0] - a[0]) * toR; const dLng = (b[1] - a[1]) * toR
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a[0] * toR) * Math.cos(b[0] * toR) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

async function elevationProfile(line, everyKm) {
  const samples = []; let acc = 0; let next = 0
  for (let i = 0; i < line.length; i++) {
    if (i) acc += haversine(line[i - 1], line[i])
    if (acc >= next) { samples.push({ km: +acc.toFixed(1), lat: line[i][0], lng: line[i][1] }); next += everyKm }
  }
  for (let i = 0; i < samples.length; i += 100) {
    const chunk = samples.slice(i, i + 100)
    const r = await getJSON(`https://api.opentopodata.org/v1/srtm90m?locations=${chunk.map((s) => s.lat.toFixed(5) + ',' + s.lng.toFixed(5)).join('|')}`)
    r.results.forEach((x, j) => { chunk[j].m = x.elevation })
    await sleep(1200)
  }
  return samples.map((s) => ({ km: s.km, m: s.m, lat: s.lat, lng: s.lng }))
}

export async function buildMap(spec, prev = {}) {
  const geo = { ...(prev.geocode || {}) }; const states = { ...(prev.statesRaw || {}) }
  const pt = async (w) => (typeof w === 'string' ? geocodeTown(w, geo) : w)
  const routes = {}
  for (const r of spec.routes) {
    const pts = []; for (const w of r.via) pts.push(await pt(w))
    routes[r.id] = { ...(await route(pts)), label: r.label, leg: r.leg, main: Boolean(r.main) }
    console.log(`route ${r.id}: ${Math.round(routes[r.id].km * 0.621)} mi, ${routes[r.id].hours.toFixed(1)} h (raw OSRM)`)
  }
  const outlines = await stateOutlines(spec.states, states)
  const P = projector(spec.bbox, spec.width || 1000)
  const proj = (line, eps) => simplify(line.map(([la, lo]) => P.project(la, lo)), eps)
  const map = {
    width: P.width, height: P.height,
    states: Object.fromEntries(Object.entries(outlines).map(([c, rings]) => [c, rings.map((r) => toPath(proj(r, 0.6))).join('Z') + 'Z'])),
    routes: Object.fromEntries(Object.entries(routes).map(([id, r]) => [id, { d: toPath(proj(r.line, 0.5)), label: r.label, leg: r.leg, main: r.main, mi: Math.round(r.km * 0.621) }])),
    bases: spec.bases.map((b) => ({ ...b, xy: P.project(b.lat, b.lng) })),
    towns: spec.labels.map((t) => ({ name: t, xy: P.project(geo[t].lat, geo[t].lng) })).filter((t) => t.xy[0] > 0 && t.xy[0] < P.width && t.xy[1] > 0 && t.xy[1] < P.height),
  }
  const mainLine = spec.profile.flatMap((id) => routes[id].line)
  const profile = prev.profile && prev.profileKey === spec.profile.join() ? prev.profile : await elevationProfile(mainLine, spec.profileEveryKm || 8)

  /* Regional maps: the same projection idea at street scale. Lines come from an OSM extract
   * saved to disk (rivers) or from OSRM through ordered, identity-checked points (a scenic
   * road traced through its own overlooks). Trip routes are clipped in for context. The page
   * projects place pins itself from bbox + width, through the identical formula. */
  const regions = []
  for (const r of spec.regions || []) {
    const RP = projector(r.bbox, r.width || 1000)
    const rp = (line, eps) => simplify(line.map(([la, lo]) => RP.project(la, lo)), eps)
    const lines = []
    for (const l of r.lines || []) {
      if (l.osmFile) {
        const d = JSON.parse(readFileSync(l.osmFile, 'utf8'))
        for (const el of d.elements || []) lines.push({ kind: l.kind, label: l.label, d: toPath(rp(el.geometry.map((g) => [g.lat, g.lon]), 0.8)) })
      } else if (l.through) {
        const pts = await Promise.all(l.through.map(pt))
        const rt = await route(pts)
        lines.push({ kind: l.kind, label: l.label, d: toPath(rp(rt.line, 0.8)) })
      }
    }
    for (const id of r.routes || []) lines.push({ kind: 'route', label: routes[id].label, id, d: toPath(rp(routes[id].line, 0.8)) })
    for (const t of r.labels || []) await geocodeTown(t, geo)
    regions.push({ id: r.id, bbox: r.bbox, width: RP.width, height: RP.height, lines, bases: spec.bases.map((b) => ({ ...b, xy: RP.project(b.lat, b.lng) })), towns: (r.labels || []).map((t) => ({ name: t.split(',')[0], xy: RP.project(geo[t].lat, geo[t].lng) })) })
  }
  return { map, profile, profileKey: spec.profile.join(), geocode: geo, statesRaw: states, regions }
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  const [planPath, out, flag] = process.argv.slice(2)
  const mod = await import(pathToFileURL(path.resolve(planPath)).href)
  const prev = existsSync(out) && flag !== '--refresh' ? JSON.parse(readFileSync(out, 'utf8')) : {}
  const res = await buildMap(mod.mapSpec, prev)
  writeFileSync(out, JSON.stringify(res))
  const ms = res.profile.map((p) => p.m)
  console.log(`${out}: ${res.map.width}x${res.map.height}, ${Object.keys(res.map.routes).length} routes, ${res.profile.length} elevation samples ${Math.min(...ms)}-${Math.max(...ms)} m`)
}
