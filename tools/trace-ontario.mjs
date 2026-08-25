/* PROTOTYPE — Ontario/Canadian-shore land polygon, clipped to the existing
   Midwest canvas bounds, with the Great Lakes subtracted so they don't
   render as land.

   Source: Natural Earth 10m (public domain), via nvkelso/natural-earth-vector:
     geojson/ne_10m_admin_1_states_provinces.geojson — political province
       boundaries (Ontario extracted by name)
     geojson/ne_10m_lakes.geojson  — lake polygons (Great Lakes among them)
   Fetch once (not committed — same convention as the six state files):
     curl -sL -o ne_10m_admin_1_states_provinces.geojson https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_1_states_provinces.geojson
     curl -sL -o ne_10m_lakes.geojson                    https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_lakes.geojson

   REVISION HISTORY / why political+lakes, not physical land+lakes:
   A first pass used ne_10m_land (physical land/continents) for the outer
   boundary. Within this AOI that ring degenerates to a plain rectangle —
   "everything not ocean," and there's no ocean here — which produced a
   correct-on-the-lake-side but FAKE straight edge on the inland side (a
   dead giveaway next to the six states' real traced coastlines). Switched
   to the Ontario POLITICAL boundary (ne_10m_admin_1_states_provinces,
   feature name === 'Ontario') instead: it carries real inland borders
   (the thing the rectangle lacked) — see tools/README.md's existing note
   that this is the boundary already "to hand." Its OWN defect is exactly
   what the lake subtraction below fixes: it runs through the middle of
   Lakes Superior/Huron along the international boundary and includes all
   of the Canadian halves + all of Georgian Bay as if they were land
   (confirmed: a point at Lake Huron's center tests OUTSIDE this Ontario
   polygon — the border bisects the lake — but a point at Georgian Bay's
   center tests INSIDE it, i.e. it really does paint over the bay, exactly
   as tools/README.md described). Political boundary for real inland edges
   + lake subtraction for the coastline/bay defect = both problems solved
   by the two sources together.

   FINDING (kept from the first pass): Great Lakes are a SEPARATE layer in
   Natural Earth's model — land/political fills don't exclude them; you
   draw water on top. So the lakes must be subtracted explicitly, not
   assumed already-absent. Georgian Bay is also its own named feature in
   ne_10m_lakes (NOT folded into "Lake Huron" by name) — an initial name
   regex missed it; the pattern below explicitly includes it.

   Two REGIONS are produced for comparison (see TASK 2c cost report):
     FULL      — clipped to the full six-state canvas bounds (same BBOX
                 trace-midwest.mjs uses for its own CLIPPED mechanism).
     PENINSULA — a tight sub-box around the five Bruce Peninsula places
                 (Tobermory/Point Clark/Kincardine/Bayfield/Neustadt),
                 i.e. "pin only the peninsula subset."

   Uses the SAME clip rectangle mechanics, Sutherland-Hodgman clipper, RDP
   simplifier and equirectangular projection as trace-midwest.mjs. All
   clipping happens AFTER the six-state bounds are fixed (they are hard-
   coded below at full precision, re-derived from the six state files) —
   this can never move the projection.

   THIS IS A PROTOTYPE. Reads the two files above, writes ontario-out.json
   + ontario-preview-full.svg + ontario-preview-peninsula.svg to inspect.
   Does NOT touch src/midwestGeo.js or any file under src/.
*/
import { readFileSync, writeFileSync } from 'fs'

// Exact six-state bounds (re-derived from minnesota/wisconsin/michigan/
// illinois/indiana/ohio .json via the same ringsOf/ringArea logic as
// trace-midwest.mjs — full precision; the README/generated-file header
// rounds these to 3dp for display only).
const minLon = -97.239155, maxLon = -80.518693
const minLat = 36.970298, maxLat = 49.384358
const K = 0.7292394463508672
const scale = 78.07617386875357
const PAD = 24
const CANVAS_BBOX = [minLon, minLat, maxLon, maxLat]

const project = (lon, lat) => [
  +(PAD + (lon - minLon) * K * scale).toFixed(1),
  +(PAD + (maxLat - lat) * scale).toFixed(1),
]

/* ---------- geometry helpers (copied from trace-midwest.mjs) ---------- */
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

function ringBbox(ring) {
  let a = Infinity, b = Infinity, c = -Infinity, e = -Infinity
  for (const [x, y] of ring) { if (x < a) a = x; if (y < b) b = y; if (x > c) c = x; if (y > e) e = y }
  return [a, b, c, e]
}
function bboxOverlaps(a, b) {
  return a[0] <= b[2] && a[2] >= b[0] && a[1] <= b[3] && a[3] >= b[1]
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

function ringsOf(geo) {
  const g = geo.geometry || geo
  const out = []
  if (g.type === 'Polygon') out.push(...g.coordinates)
  else if (g.type === 'MultiPolygon') for (const poly of g.coordinates) out.push(...poly)
  return out
}

/* ---------- load Natural Earth political + lakes, keep rings that touch an AOI ---------- */
const GREAT_LAKES = /Superior|Michigan|Huron|Erie|Ontario|St(\.|aint) ?Clair|Georgian Bay/i

// Generic: every ring from every feature whose bbox overlaps the AOI.
// Used for the lakes file, where we want ALL Great-Lakes-named rings
// regardless of which "feature" groups them.
function loadOverlappingRings(file, aoi) {
  const geo = JSON.parse(readFileSync(file, 'utf8'))
  const rings = []
  for (const f of geo.features) {
    for (const ring of ringsOf(f)) {
      const bb = ringBbox(ring)
      if (bboxOverlaps(bb, aoi)) rings.push({ ring, name: f.properties && (f.properties.name || f.properties.featurecla) })
    }
  }
  return rings
}

// Named: rings belonging to ONE specific feature (matched by name), still
// filtered to those whose bbox overlaps the AOI. Used for Ontario itself —
// we do NOT want to accidentally sweep in Michigan/Ohio/etc.'s admin_1
// polygons, only the single Ontario feature.
function loadNamedFeatureRings(file, featureName, aoi) {
  const geo = JSON.parse(readFileSync(file, 'utf8'))
  const feat = geo.features.find((f) => f.properties && f.properties.name === featureName)
  if (!feat) throw new Error(`loadNamedFeatureRings: no feature named "${featureName}" in ${file}`)
  const rings = []
  for (const ring of ringsOf(feat)) {
    const bb = ringBbox(ring)
    if (bboxOverlaps(bb, aoi)) rings.push({ ring, name: featureName })
  }
  return rings
}

function processRings(rings, target, clipBBOX) {
  const out = []
  let raw = 0, kept = 0
  for (const { ring } of rings) {
    const clipped = clipRing(ring, clipBBOX)
    if (clipped.length < 4) continue
    raw += ring.length
    const simp = simplifyTo(clipped, target)
    kept += simp.length
    const d = simp.map((c, i) => `${i === 0 ? 'M' : 'L'} ${project(c[0], c[1]).join(' ')}`).join(' ') + ' Z'
    out.push(d)
  }
  return { paths: out, raw, kept }
}

/* ---------- build one region: load, clip, simplify, project ---------- */
function buildRegion(name, aoi, { politicalTarget, lakeTarget }) {
  // Pad the source-selection AOI by 1deg so a ring that just clips the
  // edge isn't missed by the bbox-overlap prefilter.
  const selectAOI = [aoi[0] - 1, aoi[1] - 1, aoi[2] + 1, aoi[3] + 1]
  const politicalRingsAll = loadNamedFeatureRings('ne_10m_admin_1_states_provinces.geojson', 'Ontario', selectAOI)
  const lakeRingsAll = loadOverlappingRings('ne_10m_lakes.geojson', selectAOI)
  const lakeRings = lakeRingsAll.filter((r) => r.name && GREAT_LAKES.test(r.name))

  const political = processRings(politicalRingsAll, politicalTarget, aoi)
  const lakes = processRings(lakeRings, lakeTarget, aoi)

  const combinedD = [...political.paths, ...lakes.paths]
  const totalPts = political.kept + lakes.kept
  const bytesAdded = combinedD.reduce((n, s) => n + s.length + 6, 0) // +6 slop for quotes/comma/indent

  console.log(`\n=== REGION: ${name} ===`)
  console.log(`  AOI (lon/lat): ${aoi.map((n) => n.toFixed(3)).join(', ')}`)
  console.log(`  political (Ontario): ${politicalRingsAll.length} source ring(s) considered -> ${political.paths.length} subpath(s), ${political.kept} pts`)
  console.log(`  lakes: ${lakeRingsAll.length} source ring(s) overlap, ${lakeRings.length} Great-Lakes-named -> ${lakes.paths.length} subpath(s), ${lakes.kept} pts`)
  console.log(`  lake names kept: ${[...new Set(lakeRings.map((r) => r.name))].join(', ')}`)
  console.log(`  TOTAL: ${combinedD.length} subpaths, ${totalPts} pts, ~${bytesAdded} bytes (~${(bytesAdded / 1024).toFixed(1)} KB) of path-data string content`)

  const svg = `<svg viewBox="0 0 1000 1017" xmlns="http://www.w3.org/2000/svg">
  <rect width="1000" height="1017" fill="#141210"/>
  <path d="${combinedD.join(' ')}" fill="#3a352c" fill-rule="evenodd" stroke="#d4a843" stroke-width="1" opacity="0.9"/>
</svg>`
  writeFileSync(`ontario-preview-${name}.svg`, svg)

  return { political: political.paths, lakes: lakes.paths, totalPts, bytesAdded, subpathCount: combinedD.length }
}

// REGION 1 — full canvas (matches trace-midwest.mjs's own CLIPPED bbox).
const full = buildRegion('full', CANVAS_BBOX, { politicalTarget: 260, lakeTarget: 90 })

// REGION 2 — peninsula-only: tight box around the five Bruce Peninsula
// places from TASK 2a (Tobermory/Point Clark/Kincardine/Bayfield/Neustadt
// span lon -81.749..-81.0, lat 43.56..45.25), padded to a round box.
const PENINSULA_AOI = [-83.0, 42.5, -80.518693, 46.5]
const peninsula = buildRegion('peninsula', PENINSULA_AOI, { politicalTarget: 140, lakeTarget: 70 })

console.log('\n=== SUMMARY ===')
console.log(`  full canvas region:      ${full.totalPts} pts, ~${(full.bytesAdded / 1024).toFixed(1)} KB`)
console.log(`  peninsula-only region:   ${peninsula.totalPts} pts, ~${(peninsula.bytesAdded / 1024).toFixed(1)} KB`)

writeFileSync(
  'ontario-out.json',
  JSON.stringify(
    {
      note: 'PROTOTYPE output — not consumed by the app. Inspect political/lakes path data here.',
      source:
        '10m Natural Earth (ne_10m_admin_1_states_provinces.geojson, feature name=Ontario; ne_10m_lakes.geojson), nvkelso/natural-earth-vector',
      regions: { full, peninsula },
    },
    null,
    2
  )
)
console.log('\nwrote ontario-out.json + ontario-preview-full.svg + ontario-preview-peninsula.svg (scratch/inspection only)')
