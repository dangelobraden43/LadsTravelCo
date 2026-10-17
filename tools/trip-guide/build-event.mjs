/* /trip-guide event builder (tournament guides: shapes as toggles, tabbed app, map, simulator, golf cards).
 *
 *   node tools/trip-guide/build-event.mjs <data.json> <plan.mjs> <map.json> <out.html> [--mode private|product]
 *
 * data.json comes from build-data.mjs over every run of the trip. The plan module cites findings as
 * '<run code>:<finding id>'; a missing id fails the build. Only reader copy reaches the page: claims
 * pass through readerClaim (no pipeline paperwork), refuted findings never render, and every cited
 * finding carries its fact-check status. Places come from the runs named by each base.
 * Spec: docs/superpowers/specs/2026-10-16-ryder-cup-2027-design.md
 */
import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL, fileURLToPath } from 'node:url'
import { readerClaim, readerNotes, category } from './build-guide.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
/* the site never says "free" about a price (ruled Sept 17 / Sept 29): drop any sentence that does */
const FREE_OK = /\b(duty|visa|toll|gluten|car|sugar|alcohol|hands|barrier|tax)-free\b/gi
export const noFree = (t) => String(t || '').split(/(?<=[.!?])\s+/).filter((x) => !/\bfree\b/i.test(x.replace(FREE_OK, ''))).join(' ')
const trim = (s, n) => (s && s.length > n ? s.slice(0, n).replace(/\s+\S*$/, '') + '…' : s || '')

export function buildEvent(data, plan, map, mode) {
  const code = plan.runs
  const F = {}
  const byRun = {}
  for (const run of data.runs) {
    const rc = code[run.destination]
    if (!rc) throw new Error('no run code for ' + run.destination)
    byRun[rc] = run
    for (const it of run.items) {
      F[rc + ':' + it.id] = {
        c: noFree(readerClaim(it.claim)), s: it.status, d: it.datedUntil || null, n: it.name || null,
        why: it.verifierReason ? trim(readerClaim(it.verifierReason), 360) : null,
        src: (it.sources || []).slice(0, 3).map((x) => ({ u: x.url, t: x.title })),
      }
    }
  }
  /* every id the plan cites must exist (refuted findings are already gone from data, so citing one fails here) */
  const cited = new Set(); const missing = []
  const walk = (v) => {
    if (Array.isArray(v)) return v.forEach(walk)
    if (v && typeof v === 'object') {
      if (Array.isArray(v.ids)) for (const id of v.ids) { cited.add(id); if (!F[id]) missing.push(id) }
      for (const k of Object.keys(v)) if (k !== 'ids') walk(v[k])
    }
  }
  walk([plan.shapes, plan.bases, plan.golf, plan.golfCallout, plan.watch, plan.book, plan.flights, plan.know, plan.pinInfo])
  if (missing.length) throw new Error('plan cites unknown or refuted findings: ' + [...new Set(missing)].join(', '))

  /* places per base, from the base's runs and parts */
  const bases = {}
  for (const [bid, b] of Object.entries(plan.bases)) {
    const places = { eat: [], drink: [], watch: [], see: [] }
    for (const rc of b.runs) {
      for (const it of byRun[rc].items) {
        if (it.kind !== 'place' || !b.parts.includes(it.part)) continue
        let cat = it.part === 'see' ? 'see' : it.part === 'watch' ? 'watch' : it.part === 'eat' ? 'eat' : it.part === 'drink' ? 'drink' : category(it)
        if (!places[cat]) cat = cat === 'coffee' ? 'eat' : 'see'
        if (it.part === 'watch' && /golf/i.test(it.name || '')) continue
        const site = (it.sources.find((s) => s.kind === 'official' || s.kind === 'government') || {}).url || null
        const town = (String(it.name || '').match(/,\s*([^,]+)$/) || [])[1] || b.town || b.name
        places[cat].push({ id: rc + ':' + it.id, name: String(it.name || '').replace(/,\s*[^,]+$/, ''), town, claim: noFree(readerClaim(it.claim)), rows: readerNotes(it.notes).slice(0, 3), site, q: `${it.name} ${b.q || 'Ireland'}`, s: it.status })
      }
    }
    const rank = { confirmed: 0, corrected: 1, pending: 2, unchecked: 3, unconfirmed: 4 }
    for (const c of Object.keys(places)) places[c].sort((a, z) => (rank[a.s] - rank[z.s]) || a.name.localeCompare(z.name))
    bases[bid] = { name: b.name, callout: b.callout || null, stay: b.stay || [], places, link: b.link || null }
  }

  /* map: pins carry their own short labels */
  const pins = map.pins.map((p) => ({ ...p, short: p.label.replace(/ Golf Club$| Golf Links$/, '') }))

  const stats = { findings: 0, sources: 0, passes: 0, checked: 0 }
  for (const r of data.runs) {
    stats.findings += r.stats.findings; stats.sources += r.stats.sources; stats.passes += r.stats.agentFiles
    stats.checked += Object.values(r.stats.verdicts || {}).reduce((a, n) => a + n, 0)
  }
  const flights = { ...plan.flights }
  if (mode !== 'private') delete flights.points
  else for (const k of ['dtw', 'any']) flights[k] = { ...flights[k], items: [...flights[k].items, ...flights.points.items.map((x) => ({ ...x, title: 'Points: ' + x.title }))] }

  if (mode === 'preview') {
    /* the public page: Plan tab only. Nothing from the paid tabs reaches the file, not even the facts behind it. */
    const keep = new Set(); const grab = (v) => { if (Array.isArray(v)) return v.forEach(grab); if (v && typeof v === 'object') { if (Array.isArray(v.ids)) v.ids.forEach((i) => keep.add(i)); for (const k of Object.keys(v)) if (k !== 'ids' && k !== 'days') grab(v[k]) } }
    const shapesLite = plan.shapes.map((s) => ({ ...s, days: {}, nights: s.nights[plan.presets.product.dates] || Object.values(s.nights)[0] }))
    const flightsLite = { dtw: plan.flights.dtw, any: plan.flights.any }
    grab([shapesLite, flightsLite, plan.pinInfo])
    const Fp = {}; for (const id of keep) if (F[id]) Fp[id] = F[id]
    const daysCount = Object.fromEntries(plan.shapes.map((s) => [s.id, Object.values(s.days)[0].length]))
    const placeCount = Object.values(bases).reduce((a, b) => a + Object.values(b.places).reduce((x, l) => x + l.length, 0), 0)
    return {
      builtOn: data.builtOn, meta: { ...plan.meta, mode }, preset: plan.presets.product, toggles: plan.toggles, copy: plan.copy, sim: plan.sim,
      shapes: shapesLite, flights: flightsLite, pinInfo: plan.pinInfo, map: { ...map, pins }, made: stats, F: Fp,
      inside: { days: daysCount, places: placeCount, golf: plan.golf.length, book: plan.book.length, know: plan.know.length, cta: plan.cta },
      bases: {}, golf: [], golfCallout: [], watch: null, book: [], know: [],
    }
  }
  return {
    builtOn: data.builtOn,
    meta: { ...plan.meta, mode },
    preset: plan.presets[mode],
    toggles: plan.toggles, copy: plan.copy, sim: plan.sim,
    shapes: plan.shapes.map((s) => ({ ...s, nights: s.nights[plan.presets[mode].dates] || Object.values(s.nights)[0] })),
    bases, golf: plan.golf, golfCallout: plan.golfCallout, watch: plan.watch, book: plan.book, flights, know: plan.know,
    pinInfo: plan.pinInfo, map: { ...map, pins },
    made: stats, F,
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  const args = process.argv.slice(2)
  const mode = args.includes('--mode') ? args[args.indexOf('--mode') + 1] : 'private'
  const [dataPath, planPath, mapPath, out] = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--mode')
  const data = JSON.parse(readFileSync(dataPath, 'utf8'))
  const plan = await import(pathToFileURL(path.resolve(planPath)).href)
  const map = JSON.parse(readFileSync(mapPath, 'utf8'))
  const G = buildEvent(data, plan, map, mode)
  const tpl = readFileSync(path.join(here, 'event-template.html'), 'utf8')
  const stage = readFileSync(path.join(here, '../golf-intro/stage.html'), 'utf8')
  const introJs = readFileSync(path.join(here, '../golf-intro/first-tee.js'), 'utf8')
  const json = JSON.stringify(G).replace(/</g, '\\u003c')
  const html = tpl.replace('__TITLE__', mode === 'preview' ? `${plan.meta.title} 2027 Preview` : `${plan.meta.title} 2027 Guide`).replace('__INTRO_STAGE__', () => stage)
    .replace('__INTRO_CONFIG__', () => JSON.stringify(plan.meta.introConfig)).replace('__INTRO_JS__', () => introJs)
    .replace('__DATA__', () => json)
  writeFileSync(out, html)
  /* reader-copy checks: words we never publish, and paperwork that slipped through */
  const text = JSON.stringify([G.shapes, G.bases, G.golf, G.watch, G.book, G.know, G.copy, G.flights, Object.values(G.F).map((f) => f.c)])
  const bad = []
  for (const m of text.matchAll(/[^."]{0,40}\b(free|insurance|founder|brady|dawson|lads-[a-z]+|DISCOVERED)\b[^."]{0,30}/gi)) {
    if (/^free$/i.test(m[1]) && !/\bfree\b/i.test(m[0].replace(FREE_OK, ''))) continue
    bad.push(m[0].trim())
  }
  const counts = Object.values(G.F).reduce((a, f) => ((a[f.s] = (a[f.s] || 0) + 1), a), {})
  console.log(`${out}: ${(html.length / 1024).toFixed(0)} KB, mode ${mode}. Findings by status:`, counts)
  if (bad.length) { console.error('COPY CHECK:', [...new Set(bad)].slice(0, 20)); process.exitCode = 1 }
}
