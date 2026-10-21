/* /trip-guide cross-sections: real terrain profiles for section openers.
 * Each transect is sampled from OpenTopoData srtm90m along a straight line and cached.
 *   - { id, from:[lat,lng], to:[lat,lng], n, marks:[{name, lat, lng}] }
 *   - or { id, across: { at:[lat,lng], riverFile, halfKm, n } }: a line perpendicular to the river
 *     at the nearest river point, so a gorge is cut square
 * Marks are projected onto the line (distance along it), never moved.
 *
 * Usage: node tools/trip-guide/build-sections.mjs <plan.mjs> <out sections.json>
 */
import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const R = 6371
const toR = Math.PI / 180
function dist(a, b) { // km, [lat,lng]
  const dLat = (b[0] - a[0]) * toR; const dLng = (b[1] - a[1]) * toR
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a[0] * toR) * Math.cos(b[0] * toR) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}
const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]

function perpendicular(at, riverFile, halfKm) {
  const d = JSON.parse(readFileSync(riverFile, 'utf8'))
  const pts = d.elements.flatMap((e) => e.geometry.map((g) => [g.lat, g.lon]))
  let best = 0
  pts.forEach((p, i) => { if (dist(p, at) < dist(pts[best], at)) best = i })
  const a = pts[Math.max(0, best - 3)]; const b = pts[Math.min(pts.length - 1, best + 3)]
  const k = Math.cos(at[0] * toR)
  const vx = (b[1] - a[1]) * k; const vy = b[0] - a[0]; const len = Math.hypot(vx, vy)
  const px = -vy / len; const py = vx / len // unit perpendicular, in (lng*k, lat) space
  const degLat = halfKm / 111.32
  const c = pts[best]
  return { from: [c[0] - py * degLat, c[1] - (px * degLat) / k], to: [c[0] + py * degLat, c[1] + (px * degLat) / k], river: c }
}

async function sample(from, to, n) {
  const pts = Array.from({ length: n }, (_, i) => lerp(from, to, i / (n - 1)))
  const out = []
  for (let i = 0; i < pts.length; i += 100) {
    const chunk = pts.slice(i, i + 100)
    const r = await fetch(`https://api.opentopodata.org/v1/srtm30m?locations=${chunk.map((p) => p[0].toFixed(5) + ',' + p[1].toFixed(5)).join('|')}`).then((x) => x.json())
    if (!r.results) throw new Error('opentopodata: ' + JSON.stringify(r).slice(0, 200))
    r.results.forEach((x, j) => out.push(x.elevation))
    await sleep(1200)
  }
  const total = dist(from, to)
  return pts.map((p, i) => [+(total * i / (n - 1)).toFixed(3), out[i]])
}

function along(from, to, p) { // km along the line of the point's projection
  const k = Math.cos(from[0] * toR)
  const ax = (to[1] - from[1]) * k; const ay = to[0] - from[0]
  const bx = (p[1] - from[1]) * k; const by = p[0] - from[0]
  const t = (ax * bx + ay * by) / (ax * ax + ay * ay)
  return +(t * dist(from, to)).toFixed(3)
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  const [planPath, out] = process.argv.slice(2)
  const mod = await import(pathToFileURL(path.resolve(planPath)).href)
  const res = {}
  for (const t of mod.sectionsSpec) {
    let { from, to } = t; let river = null
    if (t.across) ({ from, to, river } = perpendicular(t.across.at, t.across.riverFile, t.across.halfKm))
    const profile = await sample(from, to, t.n || 120)
    const marks = (t.marks || []).map((m) => ({ name: m.name, km: along(from, to, [m.lat, m.lng]), kind: m.kind || 'peak' }))
    if (river) marks.push({ name: t.riverName || 'River', km: along(from, to, river), kind: 'river' })
    res[t.id] = { from, to, km: profile[profile.length - 1][0], profile, marks, exaggeration: t.exaggeration || 1, note: t.note || '' }
    const ms = profile.map((p) => p[1])
    console.log(`${t.id}: ${res[t.id].km.toFixed(1)} km, ${Math.min(...ms)}-${Math.max(...ms)} m, marks ${marks.map((m) => m.name + '@' + m.km).join(' ')}`)
  }
  writeFileSync(out, JSON.stringify(res))
}
