import { readFileSync, writeFileSync } from 'fs'
import { execSync } from 'child_process'

const d = JSON.parse(readFileSync('midwest-out.json', 'utf8'))
const routes = execSync('node routes.mjs', { encoding: 'utf8' })

// pull the generated route d-strings back out
const routeD = {}
for (const m of routes.matchAll(/\/\/ ([\w-]+)\n\s*d: '([^']+)'/g)) routeD[m[1]] = m[2]

const STATE_META = {
  MN: 'Minnesota', WI: 'Wisconsin', MI: 'Michigan',
  IL: 'Illinois', IN: 'Indiana', OH: 'Ohio',
  ON: 'Ontario',
}

const lines = []
lines.push(`/* GENERATED — do not hand-edit.`)
lines.push(` * Midwest silhouettes traced from real state-boundary GeoJSON`)
lines.push(` * (glynnbird/usstatesgeojson), simplified with Douglas-Peucker and`)
lines.push(` * projected through ONE shared equirectangular transform so all six`)
lines.push(` * states, every city, every airport and all four routes share a single`)
lines.push(` * reference frame.`)
lines.push(` *`)
lines.push(` *   viewBox   ${d.viewBox}`)
lines.push(` *   lat0      ${d.lat0.toFixed(3)}  (cos = ${d.K.toFixed(4)})`)
lines.push(` *   scale     ${d.scale.toFixed(3)} px/deg`)
lines.push(` *   bounds    lon -97.239..-80.519, lat 36.970..49.384`)
lines.push(` *`)
lines.push(` * Regenerate with the tracer in scratchpad/trace-midwest.mjs.`)
lines.push(` */`)
lines.push('')
lines.push(`export const VIEWBOX = '${d.viewBox}'`)
lines.push(`export const VB_W = ${d.VB_W}`)
lines.push(`export const VB_H = ${d.VB_H}`)
lines.push('')
lines.push('/* Each state is one or more closed rings. Michigan keeps two (LP + UP). */')
lines.push('export const STATES = [')
for (const [code, paths] of Object.entries(d.paths)) {
  lines.push(`  {`)
  lines.push(`    code: '${code}',`)
  lines.push(`    name: '${STATE_META[code]}',`)
  lines.push(`    focus: ${code === 'MI'},`)
  lines.push(`    rings: [`)
  for (const p of paths) lines.push(`      '${p}',`)
  lines.push(`    ],`)
  lines.push(`  },`)
}
lines.push(']')
lines.push('')
lines.push('/* Real city lat/lngs projected through the same transform. */')
lines.push('export const PLACES = {')
for (const [k, v] of Object.entries(d.places)) lines.push(`  ${k}: { x: ${v.x}, y: ${v.y} },`)
lines.push('}')
lines.push('')
lines.push('export const AIRPORTS = {')
for (const [k, v] of Object.entries(d.airports)) lines.push(`  ${k}: { x: ${v.x}, y: ${v.y} },`)
lines.push('}')
lines.push('')
lines.push('/* Routes declared as real waypoints upstream, smoothed Catmull-Rom. */')
lines.push('export const ROUTE_PATHS = {')
for (const [k, v] of Object.entries(routeD)) lines.push(`  '${k}': '${v}',`)
lines.push('}')
lines.push('')

writeFileSync('C:/Users/brady/lads-travel-co/src/midwestGeo.js', lines.join('\n'))
console.log('wrote src/midwestGeo.js —', lines.join('\n').length, 'bytes')
