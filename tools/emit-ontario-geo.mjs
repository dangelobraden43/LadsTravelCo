/* Emits ../src/ontarioGeo.js from the peninsula region of ontario-out.json.
 *
 * Run trace-ontario.mjs first (it fetches Natural Earth and writes
 * ontario-out.json), then:
 *
 *   node emit-ontario-geo.mjs
 *
 * Kept separate from emit-midwest-geo.mjs on purpose: the Ontario layer is
 * additive background that never participates in the projection, so it must
 * not be able to perturb the six-state pipeline that defines the transform.
 */

import { readFileSync, writeFileSync } from 'fs'

const out = JSON.parse(readFileSync('ontario-out.json', 'utf8'))
const p = out.regions.peninsula

// First subpath is Ontario's political boundary; the rest are lakes punched
// out of it. (`political` replaced the earlier `land` key when the tracer
// moved off the Natural Earth land layer — see the header note.)
const outer = p.political || p.land
const d = [...outer, ...p.lakes].join(' ')

const header = `/* GENERATED — do not hand-edit.
 * Ontario / Bruce Peninsula land, for the /good-news Midwest map.
 *
 * Regenerate with tools/trace-ontario.mjs then tools/emit-ontario-geo.mjs
 * (fetch commands are in the tracer's header).
 *
 * WHY THIS IS NOT A PLAIN BOUNDARY POLYGON.
 * Ontario's POLITICAL boundary runs through the middle of the Great Lakes —
 * it contains all of Georgian Bay and half of Huron — so drawing it directly
 * paints land over open water. Natural Earth's LAND layer has the mirror
 * problem: it is "everything that is not ocean", so Lake Huron tests as land
 * there too, and inside this area it degenerates to a bare rectangle.
 *
 * The fix is both together. The political boundary supplies the real inland
 * edges; the lake polygons are punched out as holes with fill-rule evenodd.
 * Real coastline on the water side, real border on the inland side. Note that
 * Natural Earth names Georgian Bay separately from Lake Huron — miss it and
 * the whole east side of the peninsula renders as land.
 *
 * Scoped to a tight AOI around the peninsula and the Lake Huron shore
 * (lon -83.0..-80.519, lat 42.5..46.5), which still contains all 17 pins in
 * src/data/brucePeninsula.js. The full-canvas alternative costs ~22.9 KB,
 * nearly all of it lake outlines already hidden beneath the US state
 * polygons. Every straight edge in this path lies exactly on an AOI clip
 * line; there are no degenerate artifacts.
 *
 * Clipped AFTER the projection bounds were fixed by the six US states, so it
 * cannot move the shared transform. viewBox, lat0, scale and all four routes
 * are byte-identical with or without this file.
 *
 * ${p.subpathCount} subpaths, ${p.totalPts} points.
 */

export const ONTARIO_PENINSULA =
  `

writeFileSync('../src/ontarioGeo.js', header + JSON.stringify(d) + '\n')
console.log(
  `wrote ../src/ontarioGeo.js — ${p.subpathCount} subpaths, ${p.totalPts} pts, ${(d.length / 1024).toFixed(1)} KB of path data`
)
