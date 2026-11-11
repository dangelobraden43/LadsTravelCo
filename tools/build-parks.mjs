/* tools/build-parks.mjs — GENERATES the two data files behind /outdoors/parks.
 *
 *   node tools/build-parks.mjs
 *
 * 1. src/data/nationalParks.js — the park roster, read from the National Park Service's
 *    own data service (developer.nps.gov). Names, designations, states, coordinates, the
 *    park's own description and its official page all come from that record. Nothing is
 *    typed by hand and nothing is resolved from a name (the Tivoli rule).
 * 2. src/data/usRelief.js — a real elevation grid of the lower 48, sampled from the
 *    Terrarium elevation tiles (Mapzen / AWS open data: SRTM, USGS 3DEP, GMTED, ETOPO1),
 *    with the Great Lakes punched out and the US separated from its neighbours using
 *    Natural Earth polygons.
 *
 * One projection is shared by the relief, the pins and the page: see RELIEF.bounds and
 * project() in src/ParksMap.jsx. Set NPS_API_KEY for a personal key; DEMO_KEY is the
 * public low-rate key and is enough for one run.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { PNG } from 'pngjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const TODAY = new Date().toISOString().slice(0, 10)
const KEY = process.env.NPS_API_KEY || 'DEMO_KEY'

const BOUNDS = { west: -125.5, east: -66.0, south: 24.0, north: 50.0 }
const COLS = 720
const ROWS = 330
const ZOOM = 6
const MAX_M = 4400 // Mount Whitney is 4,421 m; the grid averages below that

async function getJson(url) {
  const r = await fetch(url, { headers: { 'User-Agent': 'parks-map-build/1.0' } })
  if (!r.ok) throw new Error(`${r.status} ${url}`)
  return r.json()
}

/* ---------- 1. the roster ---------- */
async function buildRoster() {
  const j = await getJson(`https://developer.nps.gov/api/v1/parks?limit=600&api_key=${KEY}`)
  if (!j.data || j.data.length < 400) throw new Error('NPS roster looks incomplete')
  const isNationalPark = (p) =>
    /^National Parks?( & Preserve)?$/.test(p.designation) ||
    p.designation === 'National and State Parks' ||
    p.parkCode === 'npsa' // "National Park of American Samoa" carries an empty designation
  const parks = j.data
    .filter(isNationalPark)
    .map((p) => {
      const lat = Number(p.latitude)
      const lng = Number(p.longitude)
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) throw new Error(`no coordinate: ${p.parkCode}`)
      const fee = (p.entranceFees || [])
        .map((f) => ({ title: f.title, cost: Number(f.cost) }))
        .filter((f) => Number.isFinite(f.cost))
      return {
        code: p.parkCode,
        name: p.fullName,
        states: p.states.split(',').filter(Boolean),
        lat: Math.round(lat * 1e5) / 1e5,
        lng: Math.round(lng * 1e5) / 1e5,
        npsDescription: p.description.trim(),
        url: p.url,
        activities: (p.activities || []).map((a) => a.name),
        entranceFees: fee,
      }
    })
    .sort((a, b) => a.name.localeCompare(b.name))
  return parks
}

/* ---------- 2. the relief ---------- */
const tileCache = new Map()
async function tile(x, y) {
  const k = `${x}/${y}`
  if (!tileCache.has(k)) {
    const url = `https://s3.amazonaws.com/elevation-tiles-prod/terrarium/${ZOOM}/${x}/${y}.png`
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
async function elevation(lat, lng) {
  const n = 2 ** ZOOM
  const fx = ((lng + 180) / 360) * n
  const s = Math.sin((lat * Math.PI) / 180)
  const fy = (0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)) * n
  const png = await tile(Math.floor(fx), Math.floor(fy))
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

async function buildRelief() {
  const NE = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/'
  const lakes = (await getJson(NE + 'ne_50m_lakes.geojson')).features.filter((f) =>
    /^Lake (Superior|Michigan|Huron|Erie|Ontario)$|Great Salt Lake|Lake of the Woods|Lake Okeechobee|Lake Champlain|Lake Winnipeg|Lake Nipigon|Lake Saint Clair|Lake St. Clair/.test(
      f.properties.name || '',
    ),
  )
  const us = (await getJson(NE + 'ne_50m_admin_0_countries.geojson')).features.find(
    (f) => f.properties.ADM0_A3 === 'USA',
  )
  if (!us || lakes.length < 5) throw new Error('Natural Earth layers incomplete')

  const dLat = (BOUNDS.north - BOUNDS.south) / (ROWS - 1)
  const dLng = (BOUNDS.east - BOUNDS.west) / (COLS - 1)
  const height = new Uint8Array(COLS * ROWS)
  const kind = new Uint8Array(COLS * ROWS) // 0 water, 1 United States, 2 neighbouring land
  for (let r = 0; r < ROWS; r++) {
    const lat = BOUNDS.north - (r / (ROWS - 1)) * (BOUNDS.north - BOUNDS.south)
    for (let c = 0; c < COLS; c++) {
      const lng = BOUNDS.west + (c / (COLS - 1)) * (BOUNDS.east - BOUNDS.west)
      // 3x3 box average inside the cell: the tiles are finer than the grid
      let m = 0
      for (const dy of [-0.33, 0, 0.33]) {
        for (const dx of [-0.33, 0, 0.33]) m += await elevation(lat + dy * dLat, lng + dx * dLng)
      }
      m /= 9
      const i = r * COLS + c
      if (m <= 0 || lakes.some((l) => inFeature(l, lng, lat))) continue
      height[i] = Math.max(1, Math.min(255, Math.round((m / MAX_M) * 255)))
      kind[i] = inFeature(us, lng, lat) ? 1 : 2
    }
  }
  return { height, kind }
}

/* ---------- write ---------- */
const parks = await buildRoster()
const relief = await buildRelief()

const header = (what) => `/* GENERATED by tools/build-parks.mjs on ${TODAY}. Do not edit by hand: re-run the tool.\n * ${what} */\n`

fs.writeFileSync(
  path.join(ROOT, 'src/data/nationalParks.js'),
  header(
    'The national park roster, exactly as the National Park Service publishes it\n * (developer.nps.gov/api/v1/parks). npsDescription is the Service\'s own text and is always\n * rendered with that attribution. Entrance fees are government-set official fees.',
  ) +
    `\nexport const PARKS_SOURCE = ${JSON.stringify(
      {
        name: 'National Park Service',
        url: 'https://www.nps.gov/subjects/developer/api-documentation.htm',
        checkedOn: TODAY,
      },
      null,
      2,
    )}\n\nexport const PARKS = ${JSON.stringify(parks, null, 2)}\n`,
)

// The grid ships as one small PNG (red = height, green = kind) so it is fetched once and
// cached, not parsed as JavaScript. usRelief.js keeps only what the projection needs.
const png = new PNG({ width: COLS, height: ROWS })
for (let i = 0; i < COLS * ROWS; i++) {
  png.data[i * 4] = relief.height[i]
  png.data[i * 4 + 1] = relief.kind[i] * 100
  png.data[i * 4 + 2] = 0
  png.data[i * 4 + 3] = 255
}
fs.mkdirSync(path.join(ROOT, 'public/outdoors'), { recursive: true })
fs.writeFileSync(path.join(ROOT, 'public/outdoors/us-relief.png'), PNG.sync.write(png))

fs.writeFileSync(
  path.join(ROOT, 'src/data/usRelief.js'),
  header(
    [
      'The frame of the lower-48 elevation grid. The grid itself is public/outdoors/us-relief.png:',
      ' * red is height (0-255 over 0-maxMetres), green is kind (0 water, 100 United States,',
      ' * 200 neighbouring land), rows north first. Elevation: Terrarium tiles (AWS open data).',
      ' * Lakes and the national outline: Natural Earth 1:50m.',
    ].join(String.fromCharCode(10)),
  ) +
    `
export const RELIEF = ${JSON.stringify(
      { bounds: BOUNDS, cols: COLS, rows: ROWS, maxMetres: MAX_M, checkedOn: TODAY, src: '/outdoors/us-relief.png' },
      null,
      2,
    )}
`,
)

/* ---------- 3. state lines ---------- */
// Natural Earth 1:50m internal state boundaries, clipped to the canvas, as plain polylines.
// Long straight borders are densified so a line can follow the ground it is draped on.
{
  const NE = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/'
  const gj = await getJson(NE + 'ne_50m_admin_1_states_provinces_lines.geojson')
  const inside = ([lng, lat]) =>
    lng > BOUNDS.west && lng < BOUNDS.east && lat > BOUNDS.south && lat < BOUNDS.north
  const lines = []
  for (const f of gj.features) {
    const p = f.properties
    if ((p.adm0_a3 || p.ADM0_A3) !== 'USA') continue
    const parts = f.geometry.type === 'LineString' ? [f.geometry.coordinates] : f.geometry.coordinates
    for (const part of parts) {
      let run = []
      for (let i = 0; i < part.length; i++) {
        const pt = part[i]
        if (!inside(pt)) {
          if (run.length > 1) lines.push(run)
          run = []
          continue
        }
        if (run.length) {
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
  fs.writeFileSync(path.join(ROOT, 'public/outdoors/us-states.json'), JSON.stringify(rounded))
  console.log(`state lines: ${rounded.length} runs, ${rounded.reduce((n, l) => n + l.length, 0)} points`)
}

const inBox = parks.filter(
  (p) => p.lng > BOUNDS.west && p.lng < BOUNDS.east && p.lat > BOUNDS.south && p.lat < BOUNDS.north,
)
console.log(`parks: ${parks.length} records (${inBox.length} inside the lower-48 canvas)`)
console.log(`relief: ${COLS}x${ROWS}, ${tileCache.size} tiles`)
