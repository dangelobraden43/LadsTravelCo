/* tools/build-local-relief.mjs — GENERATES the ground the /local map is drawn on.
 *
 *   node tools/build-local-relief.mjs
 *
 * 1. public/local/relief-midwest.png + src/data/midwestRelief.js — a measured elevation
 *    grid of the Midwest, from the Terrarium elevation tiles (Mapzen / AWS open data).
 *      red   = height above BASE_M, 0-255 over BASE_M..MAX_M
 *      green = kind: 0 nothing drawn · 60 lake · 100 one of the six states · 200 Canada
 *    Which state a cell is in comes from Natural Earth 1:50m; the lake shores from
 *    Natural Earth 1:10m lakes, which is what gives the Great Lakes their real outline.
 * 2. public/local/state-lines.json — state lines inside the frame, from Natural Earth.
 *
 * One projection is shared by the relief, the lines, the markers and the page: see
 * makeFrame() in src/LocalMap.jsx. Nothing here is typed by hand.
 */
/* eslint-env node */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { PNG } from 'pngjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT = path.join(ROOT, 'public/local')
const now = new Date()
const TODAY = [now.getFullYear(), now.getMonth() + 1, now.getDate()]
  .map((n) => String(n).padStart(2, '0'))
  .join('-') // the local date: toISOString() is UTC and reads a day ahead in the evening
const NE = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/'

const REGION = {
  id: 'midwest',
  label: 'The Midwest',
  bounds: { west: -97.6, east: -80.2, south: 36.8, north: 49.6 },
  cols: 640,
  rows: 640,
  zoom: 7,
  baseMetres: 100,
  maxMetres: 760,
}
const STATES = ['Michigan', 'Wisconsin', 'Minnesota', 'Illinois', 'Indiana', 'Ohio']
const LAKES =
  /^Lake (Superior|Michigan|Huron|Erie|Saint Clair|St\. Clair|Winnebago|Nipigon|of the Woods|Nipissing|Simcoe)$|Georgian Bay|Red Lake|Mille Lacs|Rainy Lake|Leech Lake|Houghton Lake|Lake Winnibigoshish/

async function getJson(url) {
  for (let attempt = 1; ; attempt++) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': 'local-map-build/1.0' } })
      if (!r.ok) throw new Error(`${r.status} ${url}`)
      return await r.json()
    } catch (e) {
      if (attempt >= 4) throw e
      await new Promise((res) => setTimeout(res, 900 * attempt))
    }
  }
}

const tileCache = new Map()
async function tile(z, x, y) {
  const k = `${z}/${x}/${y}`
  if (!tileCache.has(k)) {
    const url = `https://s3.amazonaws.com/elevation-tiles-prod/terrarium/${k}.png`
    let buf
    for (let attempt = 1; ; attempt++) {
      try {
        const r = await fetch(url)
        if (!r.ok) throw new Error(`${r.status} ${url}`)
        buf = Buffer.from(await r.arrayBuffer())
        break
      } catch (e) {
        if (attempt >= 5) throw e
        await new Promise((res) => setTimeout(res, 800 * attempt))
      }
    }
    tileCache.set(k, PNG.sync.read(buf))
  }
  return tileCache.get(k)
}
async function elevation(z, lat, lng) {
  const n = 2 ** z
  const fx = ((lng + 180) / 360) * n
  const s = Math.sin((lat * Math.PI) / 180)
  const fy = (0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)) * n
  const png = await tile(z, Math.floor(fx), Math.floor(fy))
  const px = Math.min(255, Math.floor((fx - Math.floor(fx)) * 256))
  const py = Math.min(255, Math.floor((fy - Math.floor(fy)) * 256))
  const i = (py * 256 + px) * 4
  return png.data[i] * 256 + png.data[i + 1] + png.data[i + 2] / 256 - 32768
}

/* point-in-polygon with a bounding box first: the 1:10m lakes carry a lot of vertices */
function prep(feature) {
  const g = feature.geometry
  const polys = g.type === 'Polygon' ? [g.coordinates] : g.coordinates
  return polys.map((rings) => {
    let x0 = Infinity
    let x1 = -Infinity
    let y0 = Infinity
    let y1 = -Infinity
    for (const [x, y] of rings[0]) {
      x0 = Math.min(x0, x)
      x1 = Math.max(x1, x)
      y0 = Math.min(y0, y)
      y1 = Math.max(y1, y)
    }
    return { rings, x0, x1, y0, y1 }
  })
}
function inRing(ring, x, y) {
  let inside = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i]
    const [xj, yj] = ring[j]
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside
  }
  return inside
}
function inside(polys, x, y) {
  for (const p of polys) {
    if (x < p.x0 || x > p.x1 || y < p.y0 || y > p.y1) continue
    if (inRing(p.rings[0], x, y) && !p.rings.slice(1).some((h) => inRing(h, x, y))) return true
  }
  return false
}

fs.mkdirSync(OUT, { recursive: true })
const { bounds: B, cols, rows, zoom, baseMetres, maxMetres } = REGION

const admin1 = (await getJson(NE + 'ne_50m_admin_1_states_provinces.geojson')).features
const ours = admin1
  .filter((f) => f.properties.iso_a2 === 'US' && STATES.includes(f.properties.name))
  .flatMap(prep)
if (ours.length < STATES.length) throw new Error('a state is missing from Natural Earth')
const otherUS = admin1
  .filter((f) => f.properties.iso_a2 === 'US' && !STATES.includes(f.properties.name))
  .flatMap(prep)
const canada = admin1.filter((f) => f.properties.iso_a2 === 'CA').flatMap(prep)
const lakeFeatures = (await getJson(NE + 'ne_10m_lakes.geojson')).features.filter((f) =>
  LAKES.test(f.properties.name || '')
)
const named = new Set(lakeFeatures.map((f) => f.properties.name))
for (const must of ['Lake Superior', 'Lake Michigan', 'Lake Huron', 'Lake Erie']) {
  if (!named.has(must)) throw new Error(`Natural Earth lakes has no ${must}`)
}
const lakes = lakeFeatures.flatMap(prep)

const dLat = (B.north - B.south) / (rows - 1)
const dLng = (B.east - B.west) / (cols - 1)
const kind = new Uint8Array(cols * rows) // 0 unknown · 60 lake · 100 ours · 200 Canada · 1 other US
const height = new Float32Array(cols * rows)
let top = 0
let topAt = null
for (let r = 0; r < rows; r++) {
  const lat = B.north - r * dLat
  for (let c = 0; c < cols; c++) {
    const lng = B.west + c * dLng
    const i = r * cols + c
    if (inside(lakes, lng, lat)) kind[i] = 60
    else if (inside(ours, lng, lat)) kind[i] = 100
    else if (inside(canada, lng, lat)) kind[i] = 200
    else if (inside(otherUS, lng, lat)) kind[i] = 1
    if (kind[i] === 100 || kind[i] === 200 || kind[i] === 0) {
      let m = 0
      for (const dy of [-0.33, 0, 0.33]) {
        for (const dx of [-0.33, 0, 0.33]) m += await elevation(zoom, lat + dy * dLat, lng + dx * dLng)
      }
      height[i] = m / 9
      if (kind[i] === 100 && height[i] > top) {
        top = height[i] // Canada is clamped, not measured against
        topAt = [lat.toFixed(2), lng.toFixed(2)]
      }
    }
  }
}
/* The 1:50m state outlines and the 1:10m lake shores do not meet exactly. A cell left in
 * neither takes the kind most of its classified neighbours have, a few passes over. */
for (let pass = 0; pass < 6; pass++) {
  const next = kind.slice()
  let changed = 0
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c
      if (kind[i] !== 0) continue
      const tally = {}
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const rr = r + dr
          const cc = c + dc
          if (rr < 0 || cc < 0 || rr >= rows || cc >= cols) continue
          const k = kind[rr * cols + cc]
          if (k) tally[k] = (tally[k] || 0) + 1
        }
      }
      const best = Object.entries(tally).sort((a, b) => b[1] - a[1])[0]
      if (best) {
        next[i] = Number(best[0])
        changed++
      }
    }
  }
  kind.set(next)
  if (!changed) break
}
/* The tiles carry the odd bad sample (one cell in Wisconsin read 921 m on ground that is
 * about 250 m). A cell far above the median of its neighbours takes that median. */
let spikes = 0
top = 0
for (let r = 1; r < rows - 1; r++) {
  for (let c = 1; c < cols - 1; c++) {
    const i = r * cols + c
    if (kind[i] !== 100 && kind[i] !== 200) continue
    const near = []
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const j = (r + dr) * cols + c + dc
        if (j !== i && (kind[j] === 100 || kind[j] === 200)) near.push(height[j])
      }
    }
    if (near.length >= 3) {
      near.sort((a, b) => a - b)
      const median = near[Math.floor(near.length / 2)]
      if (height[i] - median > 150) {
        height[i] = median
        spikes++
      }
    }
    if (kind[i] === 100 && height[i] > top) {
      top = height[i]
      topAt = [(B.north - r * dLat).toFixed(2), (B.west + c * dLng).toFixed(2)]
    }
  }
}
console.log(`bad samples replaced: ${spikes}`)
if (top > maxMetres) throw new Error(`a cell reaches ${Math.round(top)} m at ${topAt}, above maxMetres`)

const png = new PNG({ width: cols, height: rows })
const count = { 60: 0, 100: 0, 200: 0 }
for (let i = 0; i < cols * rows; i++) {
  png.data[i * 4 + 3] = 255
  const k = kind[i]
  if (k !== 60 && k !== 100 && k !== 200) continue
  count[k]++
  png.data[i * 4 + 1] = k
  if (k !== 60) {
    const t = (height[i] - baseMetres) / (maxMetres - baseMetres)
    png.data[i * 4] = Math.max(1, Math.min(255, Math.round(t * 255)))
  }
}
fs.writeFileSync(path.join(OUT, 'relief-midwest.png'), PNG.sync.write(png))
console.log(
  `relief: ${cols}x${rows}, highest cell in the six states ${Math.round(top)} m; cells: ${count[100]} states, ${count[200]} Canada, ${count[60]} lake`
)

/* ---------- state lines ---------- */
const inFrame = (x, y) => x > B.west && x < B.east && y > B.south && y < B.north
const gj = await getJson(NE + 'ne_50m_admin_1_states_provinces_lines.geojson')
const lines = []
for (const f of gj.features) {
  const p = f.properties
  if ((p.adm0_a3 || p.ADM0_A3) !== 'USA') continue
  const parts = f.geometry.type === 'LineString' ? [f.geometry.coordinates] : f.geometry.coordinates
  for (const part of parts) {
    let run = []
    for (let i = 0; i < part.length; i++) {
      const pt = part[i]
      if (!inFrame(pt[0], pt[1])) {
        if (run.length > 1) lines.push(run)
        run = []
        continue
      }
      if (run.length) {
        const [x0, y0] = part[i - 1]
        const steps = Math.ceil(Math.hypot(pt[0] - x0, pt[1] - y0) / 0.1)
        for (let s = 1; s < steps; s++) {
          run.push([x0 + ((pt[0] - x0) * s) / steps, y0 + ((pt[1] - y0) * s) / steps])
        }
      }
      run.push(pt)
    }
    if (run.length > 1) lines.push(run)
  }
}
if (lines.length < 8) throw new Error('state lines look incomplete')
fs.writeFileSync(
  path.join(OUT, 'state-lines.json'),
  JSON.stringify(lines.map((l) => l.map(([x, y]) => [Math.round(x * 1000) / 1000, Math.round(y * 1000) / 1000])))
)
console.log(`state lines: ${lines.length} runs`)

fs.writeFileSync(
  path.join(ROOT, 'src/data/midwestRelief.js'),
  `/* GENERATED by tools/build-local-relief.mjs on ${TODAY}. Do not edit by hand: re-run the tool.
 * The frame of the elevation grid the /local map is drawn on (public/local/relief-midwest.png):
 * red is height (0-255 over baseMetres-maxMetres), green is kind (0 not drawn, 60 lake,
 * 100 one of the six states, 200 Canada), rows north first.
 * Elevation: Terrarium tiles (AWS open data). States: Natural Earth 1:50m. Lakes: Natural Earth 1:10m. */

export const MIDWEST_RELIEF = ${JSON.stringify(
    {
      id: REGION.id,
      label: REGION.label,
      bounds: B,
      cols,
      rows,
      baseMetres,
      maxMetres,
      states: STATES,
      src: '/local/relief-midwest.png',
      linesSrc: '/local/state-lines.json',
      checkedOn: TODAY,
    },
    null,
    2
  )}
`
)
console.log(`tiles fetched: ${tileCache.size}`)
