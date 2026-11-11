/* tools/build-parks.mjs — GENERATES the data behind /outdoors/parks.
 *
 *   node tools/build-parks.mjs
 *
 * 1. src/data/nationalParks.js — the park roster, read from the National Park Service's
 *    own data service (developer.nps.gov). Names, states, coordinates, the park's own
 *    description, activities, entrance fees and official page all come from that record.
 *    Nothing is typed by hand and nothing is resolved from a name (the Tivoli rule).
 * 2. public/outdoors/relief-<region>.png + src/data/usRelief.js — a real elevation grid
 *    for each region the page can show (the lower 48, Alaska, Hawaii), sampled from the
 *    Terrarium elevation tiles (Mapzen / AWS open data: SRTM, USGS 3DEP, GMTED, ETOPO1).
 *    Lakes and neighbouring countries come from Natural Earth 1:50m.
 * 3. public/outdoors/bounds-<region>.json — each park's boundary from the Park Service's
 *    Land Resources Division boundary service, looked up by unit code.
 * 4. public/outdoors/us-states.json — state lines for the lower 48, from Natural Earth.
 *
 * One projection per region is shared by the relief, the lines, the markers and the page:
 * see frameOf() in src/ParksMap.jsx. Set NPS_API_KEY for a personal key; DEMO_KEY is the
 * public low-rate key and is enough for one run.
 */
/* eslint-env node */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { PNG } from 'pngjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT = path.join(ROOT, 'public/outdoors')
const TODAY = new Date().toISOString().slice(0, 10)
const KEY = process.env.NPS_API_KEY || 'DEMO_KEY'
const NE = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/'

/* Each region is its own model at full width, so a phone never has to shrink one to fit
 * another beside it. maxMetres sits just above the highest grid cell in that region. */
const REGIONS = [
  {
    id: 'lower48',
    label: 'Lower 48',
    bounds: { west: -125.5, east: -66.0, south: 24.0, north: 50.0 },
    cols: 720,
    rows: 330,
    zoom: 6,
    maxMetres: 4400,
    neighbours: ['CAN', 'MEX', 'BHS', 'CUB'],
    lakes: /^Lake (Superior|Michigan|Huron|Erie|Ontario)$|Great Salt Lake|Lake of the Woods|Lake Okeechobee|Lake Champlain|Lake Winnipeg|Lake Nipigon|Lake Saint Clair|Lake St. Clair/,
    boundaryOffset: 0.012,
  },
  {
    id: 'alaska',
    label: 'Alaska',
    bounds: { west: -170.0, east: -129.5, south: 54.0, north: 71.5 },
    cols: 520,
    rows: 480,
    zoom: 5,
    maxMetres: 5000,
    neighbours: ['CAN', 'RUS'],
    lakes: /Iliamna|Becharof/,
    boundaryOffset: 0.03,
  },
  {
    id: 'hawaii',
    label: 'Hawaii',
    // Maui and the Big Island: the two islands that hold Hawaii's national parks
    bounds: { west: -156.85, east: -154.7, south: 18.85, north: 21.1 },
    cols: 440,
    rows: 490,
    zoom: 9,
    maxMetres: 4250,
    neighbours: [],
    lakes: /^$/,
    boundaryOffset: 0.004,
  },
]
const inRegion = (r, lng, lat) =>
  lng > r.bounds.west && lng < r.bounds.east && lat > r.bounds.south && lat < r.bounds.north

async function getJson(url) {
  for (let attempt = 1; ; attempt++) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': 'parks-map-build/1.0' } })
      if (!r.ok) throw new Error(`${r.status} ${url}`)
      return await r.json()
    } catch (e) {
      if (attempt >= 4) throw e
      await new Promise((res) => setTimeout(res, 900 * attempt))
    }
  }
}

/* ---------- 1. the roster ---------- */
async function buildRoster() {
  const j = await getJson(`https://developer.nps.gov/api/v1/parks?limit=600&api_key=${KEY}`)
  if (!j.data || j.data.length < 400) throw new Error('NPS roster looks incomplete')
  const isNationalPark = (p) =>
    /^National Parks?( & Preserve)?$/.test(p.designation) ||
    p.designation === 'National and State Parks' ||
    p.parkCode === 'npsa' // "National Park of American Samoa" carries an empty designation
  return j.data
    .filter(isNationalPark)
    .map((p) => {
      const lat = Number(p.latitude)
      const lng = Number(p.longitude)
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) throw new Error(`no coordinate: ${p.parkCode}`)
      const region = REGIONS.find((r) => inRegion(r, lng, lat))
      return {
        code: p.parkCode,
        name: p.fullName,
        states: p.states.split(',').filter(Boolean),
        lat: Math.round(lat * 1e5) / 1e5,
        lng: Math.round(lng * 1e5) / 1e5,
        region: region ? region.id : null,
        npsDescription: p.description.trim(),
        url: p.url,
        activities: (p.activities || []).map((a) => a.name),
        entranceFees: (p.entranceFees || [])
          .map((f) => ({ title: f.title, cost: Number(f.cost) }))
          .filter((f) => Number.isFinite(f.cost)),
      }
    })
    .sort((a, b) => a.name.localeCompare(b.name))
}

/* ---------- 2. the relief ---------- */
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

function inRing(ring, x, y) {
  let inside = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i]
    const [xj, yj] = ring[j]
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside
  }
  return inside
}
function polygons(feature) {
  const g = feature.geometry
  return g.type === 'Polygon' ? [g.coordinates] : g.coordinates
}
function inFeature(feature, x, y) {
  for (const poly of polygons(feature)) {
    if (inRing(poly[0], x, y) && !poly.slice(1).some((hole) => inRing(hole, x, y))) return true
  }
  return false
}

async function buildRelief(region, countries, allLakes) {
  const { bounds: B, cols, rows, zoom, maxMetres } = region
  const lakes = allLakes.filter((f) => region.lakes.test(f.properties.name || ''))
  const others = region.neighbours.map((code) => {
    const f = countries.find((c) => c.properties.ADM0_A3 === code)
    if (!f) throw new Error(`Natural Earth has no ${code}`)
    return f
  })
  const dLat = (B.north - B.south) / (rows - 1)
  const dLng = (B.east - B.west) / (cols - 1)
  const png = new PNG({ width: cols, height: rows })
  let top = 0
  for (let r = 0; r < rows; r++) {
    const lat = B.north - r * dLat
    for (let c = 0; c < cols; c++) {
      const lng = B.west + c * dLng
      // 3x3 box average inside the cell: the tiles are finer than the grid
      let m = 0
      for (const dy of [-0.33, 0, 0.33]) {
        for (const dx of [-0.33, 0, 0.33]) m += await elevation(zoom, lat + dy * dLat, lng + dx * dLng)
      }
      m /= 9
      const i = (r * cols + c) * 4
      png.data[i + 3] = 255
      if (m <= 0 || lakes.some((l) => inFeature(l, lng, lat))) continue
      top = Math.max(top, m)
      // red = height; green = kind (100 United States, 200 neighbouring land). Land that
      // is in no neighbouring country is the United States: its own coast, drawn to the
      // resolution of the elevation, not of a coarse outline.
      png.data[i] = Math.max(1, Math.min(255, Math.round((m / maxMetres) * 255)))
      png.data[i + 1] = others.some((o) => inFeature(o, lng, lat)) ? 200 : 100
    }
  }
  if (top > maxMetres) throw new Error(`${region.id}: a cell reaches ${Math.round(top)} m, above maxMetres`)
  fs.writeFileSync(path.join(OUT, `relief-${region.id}.png`), PNG.sync.write(png))
  console.log(`relief ${region.id}: ${cols}x${rows}, highest cell ${Math.round(top)} m`)
}

/* ---------- 3. park boundaries ---------- */
async function buildBounds(region, parks) {
  const SERVICE =
    'https://services1.arcgis.com/fBc8EJBxQRMcHlei/arcgis/rest/services/NPS_Land_Resources_Division_Boundary_and_Tract_Data_Service/FeatureServer/2/query'
  const UNITS = { seki: ['SEQU', 'KICA'] } // one roster record, two boundary units
  const out = {}
  const missing = []
  for (const p of parks.filter((q) => q.region === region.id)) {
    const rings = []
    for (const code of UNITS[p.code] || [p.code.toUpperCase()]) {
      const q = new URLSearchParams({
        where: `UNIT_CODE='${code}'`,
        outFields: 'UNIT_CODE',
        returnGeometry: 'true',
        outSR: '4326',
        maxAllowableOffset: String(region.boundaryOffset),
        f: 'json',
      })
      const j = await getJson(`${SERVICE}?${q}`)
      for (const f of j.features || []) {
        for (const ring of f.geometry?.rings || []) {
          if (ring.length < 5) continue
          rings.push(ring.map(([x, y]) => [Math.round(x * 1000) / 1000, Math.round(y * 1000) / 1000]))
        }
      }
    }
    if (rings.length) out[p.code] = rings
    else missing.push(p.code)
  }
  fs.writeFileSync(path.join(OUT, `bounds-${region.id}.json`), JSON.stringify(out))
  console.log(
    `boundaries ${region.id}: ${Object.keys(out).length} parks` +
      (missing.length ? `, none for ${missing.join(', ')}` : ''),
  )
}

/* ---------- 4. state lines (lower 48) ---------- */
async function buildStateLines(region) {
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
        if (!inRegion(region, pt[0], pt[1])) {
          if (run.length > 1) lines.push(run)
          run = []
          continue
        }
        if (run.length) {
          // densify long straight borders so the line can follow the ground it is draped on
          const [x0, y0] = part[i - 1]
          const steps = Math.ceil(Math.hypot(pt[0] - x0, pt[1] - y0) / 0.2)
          for (let s = 1; s < steps; s++) {
            run.push([x0 + ((pt[0] - x0) * s) / steps, y0 + ((pt[1] - y0) * s) / steps])
          }
        }
        run.push(pt)
      }
      if (run.length > 1) lines.push(run)
    }
  }
  if (lines.length < 20) throw new Error('state lines look incomplete')
  const rounded = lines.map((l) => l.map(([x, y]) => [Math.round(x * 100) / 100, Math.round(y * 100) / 100]))
  fs.writeFileSync(path.join(OUT, 'us-states.json'), JSON.stringify(rounded))
  console.log(`state lines: ${rounded.length} runs`)
}

/* ---------- run ---------- */
fs.mkdirSync(OUT, { recursive: true })
const header = (lines) =>
  `/* GENERATED by tools/build-parks.mjs on ${TODAY}. Do not edit by hand: re-run the tool.\n${lines
    .map((l) => ' * ' + l)
    .join('\n')} */\n`

const parks = await buildRoster()
fs.writeFileSync(
  path.join(ROOT, 'src/data/nationalParks.js'),
  header([
    'The national park roster, exactly as the National Park Service publishes it',
    "(developer.nps.gov/api/v1/parks). npsDescription is the Service's own text and is always",
    'rendered with that attribution. Entrance fees are government-set official fees.',
    '`region` is the map the park is drawn on, or null for a park shown in the index only.',
  ]) +
    `\nexport const PARKS_SOURCE = ${JSON.stringify(
      { name: 'National Park Service', url: 'https://www.nps.gov/subjects/developer/api-documentation.htm', checkedOn: TODAY },
      null,
      2,
    )}\n\nexport const PARKS = ${JSON.stringify(parks, null, 2)}\n`,
)
console.log(
  `parks: ${parks.length} records (` +
    REGIONS.map((r) => `${parks.filter((p) => p.region === r.id).length} ${r.id}`).join(', ') +
    `, ${parks.filter((p) => !p.region).length} index only)`,
)

const countries = (await getJson(NE + 'ne_50m_admin_0_countries.geojson')).features
const allLakes = (await getJson(NE + 'ne_50m_lakes.geojson')).features
for (const region of REGIONS) {
  await buildRelief(region, countries, allLakes)
  await buildBounds(region, parks)
}
await buildStateLines(REGIONS[0])

fs.writeFileSync(
  path.join(ROOT, 'src/data/usRelief.js'),
  header([
    'The frame of each elevation grid the Parks Map can show. The grids themselves are',
    'public/outdoors/relief-<id>.png: red is height (0-255 over 0-maxMetres), green is kind',
    '(0 water, 100 United States, 200 neighbouring land), rows north first.',
    'Elevation: Terrarium tiles (AWS open data). Lakes and neighbours: Natural Earth 1:50m.',
  ]) +
    `\nexport const RELIEFS = ${JSON.stringify(
      REGIONS.map((r) => ({
        id: r.id,
        label: r.label,
        bounds: r.bounds,
        cols: r.cols,
        rows: r.rows,
        maxMetres: r.maxMetres,
        src: `/outdoors/relief-${r.id}.png`,
        boundsSrc: `/outdoors/bounds-${r.id}.json`,
        linesSrc: r.id === 'lower48' ? '/outdoors/us-states.json' : null,
        checkedOn: TODAY,
      })),
      null,
      2,
    )}\n`,
)
for (const stale of ['us-relief.png', 'park-bounds.json']) {
  const f = path.join(OUT, stale)
  if (fs.existsSync(f)) fs.unlinkSync(f)
}
console.log(`tiles fetched: ${tileCache.size}`)
