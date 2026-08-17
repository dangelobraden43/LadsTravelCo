/* Re-fit the four routes to the new Midwest projection.
   Routes are declared as REAL lat/lng waypoints and projected through the same
   transform as the silhouette, then smoothed Catmull-Rom -> cubic Bezier.
   That way a projection change re-fits them automatically instead of needing
   hand-tuned control points. */
import { readFileSync } from 'fs'

const d = JSON.parse(readFileSync('midwest-out.json', 'utf8'))
const { lat0, K, scale } = d

// Re-derive the exact projection used by the tracer.
const minLon = -97.239, maxLat = 49.384, PAD = 24
const project = (lon, lat) => [
  +(PAD + (lon - minLon) * K * scale).toFixed(1),
  +(PAD + (maxLat - lat) * scale).toFixed(1),
]

const ROUTES = [
  {
    id: 'west-coast',
    pts: [
      [-86.744, 41.794], // New Buffalo
      [-86.255, 42.115], // South Haven (coast hug)
      [-85.587, 42.292], // Kalamazoo
      [-85.668, 42.963], // Grand Rapids
      [-86.248, 43.234], // Muskegon
      [-86.208, 44.000], // Ludington
      [-85.620, 44.763], // Traverse City
    ],
  },
  {
    id: 'up-north',
    pts: [
      [-83.743, 42.281], // Ann Arbor
      [-83.617, 43.012], // Flint-ish
      [-84.247, 44.000], // I-75 spine
      [-84.598, 44.499], // Roscommon
      [-84.727, 45.777], // Mackinaw / the Straits
      [-85.500, 46.100], // UP crossing
      [-86.650, 46.420], // Munising
      [-87.395, 46.543], // Marquette
    ],
  },
  {
    id: 'motor-city',
    pts: [
      [-83.743, 42.281], // Ann Arbor
      [-83.300, 42.320], // Dearborn
      [-83.077, 42.334], // Corktown
      [-83.046, 42.331], // Detroit
      [-82.930, 42.470], // Grosse Pointe / lakeshore
    ],
  },
  {
    id: 'harbor-golf',
    pts: [
      [-86.744, 41.794], // New Buffalo (Harbor Country)
      [-86.100, 42.100], // inland turn
      [-85.600, 42.700], // golf country south
      [-85.100, 43.400],
      [-84.598, 44.499], // Roscommon (Forest Dunes)
    ],
  },
]

// Catmull-Rom through the points -> cubic Bezier segments.
function smooth(points) {
  const p = points
  if (p.length < 2) return ''
  let out = `M ${p[0][0]} ${p[0][1]}`
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] || p[i]
    const p1 = p[i]
    const p2 = p[i + 1]
    const p3 = p[i + 2] || p2
    const c1x = +(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)
    const c1y = +(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)
    const c2x = +(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)
    const c2y = +(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)
    out += ` C ${c1x} ${c1y} ${c2x} ${c2y} ${p2[0]} ${p2[1]}`
  }
  return out
}

for (const r of ROUTES) {
  const projected = r.pts.map(([lon, lat]) => project(lon, lat))
  console.log(`\n// ${r.id}`)
  console.log(`d: '${smooth(projected)}',`)
}
