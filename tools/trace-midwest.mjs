/* Midwest silhouette tracer.
   Same method as the original Michigan trace: real state-boundary GeoJSON
   (glynnbird/usstatesgeojson) -> keep the meaningful polygons, drop islands ->
   Douglas-Peucker simplify HARD -> project every state through ONE shared
   equirectangular transform so all six land in a single reference frame. */
import { readFileSync, writeFileSync } from 'fs'

// The six US states DEFINE the canvas bounds. Anything added afterwards is
// clipped INTO those bounds so the projection — and therefore every existing
// route, city, anchor and airport — never moves.
const STATES = [
  // keep = how many of the largest rings to retain (Michigan needs 2: LP + UP)
  { slug: 'minnesota', code: 'MN', keep: 1, target: 190 },
  { slug: 'wisconsin', code: 'WI', keep: 1, target: 200 },
  { slug: 'michigan', code: 'MI', keep: 2, target: 300 },
  { slug: 'illinois', code: 'IL', keep: 1, target: 180 },
  { slug: 'indiana', code: 'IN', keep: 1, target: 150 },
  { slug: 'ohio', code: 'OH', keep: 1, target: 180 },
]

// Ontario runs far past the canvas (lon -95.15..-74.32, lat 41.91..56.87 —
// out to Hudson Bay and Ottawa), so it cannot be dropped in like a 7th state.
// It is clipped to the canvas rectangle first. This is what puts real land
// under the Bruce Peninsula.
// NOTE (Aug 17): Ontario is NOT enabled. The clipping works correctly, but the
// only source to hand is a POLITICAL boundary, and Ontario's political polygon
// includes the Canadian half of Lakes Superior and Huron. Rendered as land it
// paints straight over the lakes and swallows Georgian Bay. Needs a LAND /
// coastline polygon source (the US states file is coastline-based, which is
// why Michigan traces as LP + UP). Re-enable once that source is in place.
const CLIPPED = []

/* Sutherland-Hodgman: clip a polygon ring against an axis-aligned rectangle,
   one edge at a time. Operates in lon/lat space, BEFORE projection. */
function clipRing(ring, [minX, minY, maxX, maxY]) {
  const inside = (p, edge) =>
    edge === 0 ? p[0] >= minX : edge === 1 ? p[0] <= maxX : edge === 2 ? p[1] >= minY : p[1] <= maxY
  const intersect = (a, b, edge) => {
    const t =
      edge === 0
        ? (minX - a[0]) / (b[0] - a[0])
        : edge === 1
          ? (maxX - a[0]) / (b[0] - a[0])
          : edge === 2
            ? (minY - a[1]) / (b[1] - a[1])
            : (maxY - a[1]) / (b[1] - a[1])
    return [a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])]
  }
  let out = ring
  for (let edge = 0; edge < 4; edge++) {
    const input = out
    out = []
    for (let i = 0; i < input.length; i++) {
      const cur = input[i]
      const prev = input[(i + input.length - 1) % input.length]
      const curIn = inside(cur, edge)
      const prevIn = inside(prev, edge)
      if (curIn) {
        if (!prevIn) out.push(intersect(prev, cur, edge))
        out.push(cur)
      } else if (prevIn) {
        out.push(intersect(prev, cur, edge))
      }
    }
    if (!out.length) return []
  }
  return out
}

/* ---------- geometry helpers ---------- */
function ringsOf(geo) {
  const g = geo.geometry || geo
  const out = []
  if (g.type === 'Polygon') out.push(...g.coordinates)
  else if (g.type === 'MultiPolygon') for (const poly of g.coordinates) out.push(...poly)
  return out
}

// Shoelace area in degrees^2 — only used to rank ring size.
function ringArea(r) {
  let a = 0
  for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
    a += r[j][0] * r[i][1] - r[i][0] * r[j][1]
  }
  return Math.abs(a / 2)
}

function perpDist(p, a, b) {
  const [px, py] = p, [ax, ay] = a, [bx, by] = b
  const dx = bx - ax, dy = by - ay
  if (dx === 0 && dy === 0) return Math.hypot(px - ax, py - ay)
  const t = ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)
  const cx = ax + t * dx, cy = ay + t * dy
  return Math.hypot(px - cx, py - cy)
}

function rdp(pts, eps) {
  if (pts.length < 3) return pts
  let maxD = 0, idx = 0
  for (let i = 1; i < pts.length - 1; i++) {
    const d = perpDist(pts[i], pts[0], pts[pts.length - 1])
    if (d > maxD) { maxD = d; idx = i }
  }
  if (maxD > eps) {
    const l = rdp(pts.slice(0, idx + 1), eps)
    const r = rdp(pts.slice(idx), eps)
    return l.slice(0, -1).concat(r)
  }
  return [pts[0], pts[pts.length - 1]]
}

// Binary-search epsilon until the ring lands near the target point count.
function simplifyTo(ring, target) {
  let lo = 0, hi = 2, best = ring
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2
    const out = rdp(ring, mid)
    if (out.length > target) lo = mid
    else { best = out; hi = mid }
    if (hi - lo < 1e-7) break
  }
  return best
}

/* ---------- load + pick rings ---------- */
const picked = []
for (const st of STATES) {
  const geo = JSON.parse(readFileSync(`${st.slug}.json`, 'utf8'))
  const rings = ringsOf(geo).sort((a, b) => ringArea(b) - ringArea(a))
  const keep = rings.slice(0, st.keep)
  picked.push({ ...st, rings: keep, rawPts: keep.reduce((n, r) => n + r.length, 0) })
}

/* ---------- ONE shared projection for all six states ---------- */
let minLon = Infinity, maxLon = -Infinity, minLat = Infinity, maxLat = -Infinity
for (const s of picked) {
  for (const r of s.rings) {
    for (const [lon, lat] of r) {
      if (lon < minLon) minLon = lon
      if (lon > maxLon) maxLon = lon
      if (lat < minLat) minLat = lat
      if (lat > maxLat) maxLat = lat
    }
  }
}
/* ---------- clipped additions (Ontario) — AFTER bounds are fixed ---------- */
const BBOX = [minLon, minLat, maxLon, maxLat]
for (const add of CLIPPED) {
  const geo = JSON.parse(readFileSync(add.file, 'utf8'))
  const feat = (geo.features || []).find((f) =>
    add.match.test((f.properties && (f.properties.name || f.properties.NAME)) || '')
  )
  if (!feat) {
    console.log(`!! ${add.code}: no matching feature in ${add.file} — skipped`)
    continue
  }
  const clipped = ringsOf(feat)
    .sort((a, b) => ringArea(b) - ringArea(a))
    .slice(0, add.keep)
    .map((r) => clipRing(r, BBOX))
    .filter((r) => r.length >= 4)
  if (!clipped.length) {
    console.log(`!! ${add.code}: nothing survived clipping — skipped`)
    continue
  }
  picked.push({
    ...add,
    rings: clipped,
    rawPts: clipped.reduce((n, r) => n + r.length, 0),
    clipped: true,
  })
}

const lat0 = (minLat + maxLat) / 2
const K = Math.cos((lat0 * Math.PI) / 180) // equirectangular x-compression

const PAD = 24
const VB_W = 1000
const spanX = (maxLon - minLon) * K
const spanY = maxLat - minLat
const scale = (VB_W - PAD * 2) / spanX
const VB_H = Math.round(spanY * scale + PAD * 2)

const project = (lon, lat) => [
  +(PAD + (lon - minLon) * K * scale).toFixed(1),
  +(PAD + (maxLat - lat) * scale).toFixed(1), // y flips: north is up
]

/* ---------- simplify + project ---------- */
const out = {}
let totalPts = 0
const report = []
for (const s of picked) {
  const paths = []
  let kept = 0
  for (const ring of s.rings) {
    const simp = simplifyTo(ring, Math.round(s.target / s.rings.length))
    kept += simp.length
    const d =
      simp
        .map((c, i) => `${i === 0 ? 'M' : 'L'} ${project(c[0], c[1]).join(' ')}`)
        .join(' ') + ' Z'
    paths.push(d)
  }
  out[s.code] = paths
  totalPts += kept
  report.push({ code: s.code, raw: s.rawPts, kept, rings: s.rings.length })
}

/* ---------- project the real place / airport coordinates ---------- */
const PLACES = {
  newBuffalo: [-86.744, 41.794], kalamazoo: [-85.587, 42.292],
  grandRapids: [-85.668, 42.963], traverseCity: [-85.620, 44.763],
  annArbor: [-83.743, 42.281], detroit: [-83.046, 42.331],
  roscommon: [-84.598, 44.499], marquette: [-87.395, 46.543],
  milwaukee: [-87.906, 43.039], madison: [-89.401, 43.073],
  chicago: [-87.630, 41.878], indianapolis: [-86.158, 39.769],
  cleveland: [-81.694, 41.499], columbus: [-82.999, 39.961],
  minneapolis: [-93.265, 44.978], duluth: [-92.101, 46.787],
  mackinaw: [-84.727, 45.777],
  // university anchors — real campus coordinates
  gvsu: [-85.8889, 42.9636], // GVSU Allendale campus
  kalamazooCollege: [-85.6024, 42.2917], // Kalamazoo College
}
const AIRPORTS = {
  DTW: [-83.353, 42.212], GRR: [-85.523, 42.881], ORD: [-87.905, 41.978],
  MDW: [-87.752, 41.786], MKE: [-87.897, 42.947], MSP: [-93.222, 44.882],
  IND: [-86.295, 39.717], CLE: [-81.850, 41.412], CMH: [-82.892, 39.998],
}

const proj = (o) =>
  Object.fromEntries(
    Object.entries(o).map(([k, [lon, lat]]) => {
      const [x, y] = project(lon, lat)
      return [k, { x, y }]
    })
  )

console.log('=== PROJECTION ===')
console.log(`lon ${minLon.toFixed(3)}..${maxLon.toFixed(3)}   lat ${minLat.toFixed(3)}..${maxLat.toFixed(3)}`)
console.log(`lat0 ${lat0.toFixed(3)}  K(cos) ${K.toFixed(4)}  scale ${scale.toFixed(3)}`)
console.log(`viewBox 0 0 ${VB_W} ${VB_H}`)
console.log('\n=== SIMPLIFICATION ===')
for (const r of report) console.log(`  ${r.code}  ${String(r.raw).padStart(5)} -> ${String(r.kept).padStart(4)} pts  (${r.rings} ring${r.rings > 1 ? 's' : ''})`)
console.log(`  TOTAL kept: ${totalPts} pts`)

writeFileSync(
  'midwest-out.json',
  JSON.stringify({ viewBox: `0 0 ${VB_W} ${VB_H}`, VB_W, VB_H, lat0, K, scale, paths: out, places: proj(PLACES), airports: proj(AIRPORTS) }, null, 2)
)
console.log('\nwrote midwest-out.json')
