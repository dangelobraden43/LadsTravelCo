/* /trip-guide FIELD GUIDE builder: one long page, every plan visible, places by real town.
 *
 *   node tools/trip-guide/build-field.mjs <data.json> <plan.mjs> <map.json> <out.html> [--mode private|preview]
 *
 * Layout and rules come from the Oct 17 research (internal/research/market/2026-10-17-guide-ux.md):
 * nothing gated behind settings; a comparison card then every plan's days, each naming where you sleep;
 * towns written once and linked from every plan; booking as numbered dated steps; euro first with
 * dollars alongside at a stated ECB rate; no fact-check chip on every line (sources live in a drawer per
 * section, and a line resting on an unconfirmed finding says "check before booking").
 * Places: research findings (refuted never reach data.json) plus our own walked framework places.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL, fileURLToPath } from 'node:url'
import { readerClaim, readerNotes, category } from './build-guide.mjs'
import { noFree } from './build-event.mjs'
import { money, RATES } from './money.mjs'
import { walkSpots } from '../../src/utils/derive.js'

const here = path.dirname(fileURLToPath(import.meta.url))
const clean = (t) => money(noFree(readerClaim(t)))
const OK = new Set(['confirmed', 'corrected'])

export function buildField(data, plan, map, frameworks, mode) {
  const code = plan.runs
  const F = {}
  const items = []
  for (const run of data.runs) {
    const rc = code[run.destination]; if (!rc) throw new Error('no run code for ' + run.destination)
    for (const it of run.items) {
      const id = rc + ':' + it.id
      F[id] = { c: clean(it.claim), s: it.status, n: it.name || null, d: it.datedUntil || null,
        src: (it.sources || []).slice(0, 3).map((x) => ({ u: x.url, t: x.title })) }
      items.push({ ...it, id, run: rc })
    }
  }
  /* every id the plan cites must exist; refuted findings are absent from data, so citing one fails */
  const missing = new Set()
  const walk = (v) => { if (Array.isArray(v)) return v.forEach(walk); if (v && typeof v === 'object') { if (Array.isArray(v.ids)) for (const i of v.ids) if (!F[i]) missing.add(i); for (const k of Object.keys(v)) if (k !== 'ids' && typeof v[k] !== 'function') walk(v[k]) } }
  walk([plan.shapes, plan.golf, plan.golfCallout, plan.watch, plan.book, plan.flights, plan.know, plan.stays, plan.townNotes])
  if (missing.size) throw new Error('plan cites unknown or refuted findings: ' + [...missing].join(', '))

  /* a line: its text (money-formatted), its ids, and whether any cited fact is still unconfirmed */
  const line = (l) => {
    if (!l) return null
    if (typeof l === 'string') return { t: money(noFree(l)), ids: [] }
    const ids = l.ids || []
    const weak = ids.some((i) => !OK.has(F[i].s))
    return { t: money(noFree(l.t)), ids, weak }
  }
  const lines = (arr) => (arr || []).filter(Boolean).map(line)

  /* places by town */
  const towns = plan.towns.map((t) => ({ id: t.id, name: t.name, county: t.county, places: { eat: [], drink: [], watch: [], see: [] }, stay: [], notes: [] }))
  const byId = Object.fromEntries(towns.map((t) => [t.id, t]))
  const catOf = (it) => {
    if (it.part === 'watch') return 'watch'
    if (it.part === 'see') return 'see'
    if (it.part === 'eat') return 'eat'
    if (it.part === 'drink') return /sky|screen|sport/i.test(it.claim) ? 'watch' : 'drink'
    const c = category(it)
    if (c === 'coffee' || c === 'eat') return 'eat'
    const lead = `${it.name} ${it.claim.slice(0, 220)}`
    if (c === 'drink' || (it.part === 'eatdrink' && /\b(pub|bar|tavern|inn|session|trad|music|pint)\b/i.test(lead))) return /sky sports|big screen|screens/i.test(it.claim) ? 'watch' : 'drink'
    if (it.part === 'eatdrink') return 'eat'
    return 'see'
  }
  const seen = new Set()
  for (const it of items) {
    if (it.kind !== 'place' || it.part === 'golf' || it.part === 'event') continue
    if (/golf/i.test(it.name || '') && it.part === 'watch') continue
    const p = { name: it.name || '', claim: it.claim, run: it.run }
    const t = plan.towns.find((x) => x.match(p)); if (!t) continue
    const key = t.id + '|' + p.name.toLowerCase().replace(/,.*$/, '')
    if (seen.has(key)) continue; seen.add(key)
    const site = (it.sources.find((s) => s.kind === 'official' || s.kind === 'government') || {}).url || null
    byId[t.id].places[catOf(it)].push({
      id: it.id, name: p.name.replace(/,\s*(Doolin|Ennis|Lahinch|Liscannor|Kilfenora|Lisdoonvarna|Killarney|Tralee|Dingle|Listowel|Kenmare|Limerick|Galway|Gap of Dunloe)$/i, ''),
      text: clean(it.claim), rows: readerNotes(it.notes).slice(0, 3).map(([k, v]) => [k, money(noFree(v))]),
      site, q: `${p.name}, ${t.name.split(/,| and /)[0]}, Ireland`, weak: !OK.has(it.status), walked: false,
    })
  }
  /* our own walked framework places (Dublin and Galway) */
  for (const fw of frameworks) {
    for (const s of walkSpots(fw)) {
      const p = { name: s.name, city: s.city, claim: s.description || '' }
      const t = plan.towns.find((x) => x.match(p)); if (!t) continue
      const key = t.id + '|' + s.name.toLowerCase()
      if (seen.has(key)) continue; seen.add(key)
      const cat = /pub|bar|brew|whiskey|cocktail|club/i.test(`${s.category} ${s.subcategory}`) ? 'drink' : /restaurant|cafe|café|food|bakery|market|breakfast|brunch/i.test(`${s.category} ${s.subcategory}`) ? 'eat' : 'see'
      byId[t.id].places[cat].unshift({
        id: 'fw:' + (s.id || s.name), name: s.name, text: money(noFree(s.description || s.notes || s.ladsTake || '')),
        rows: [s.neighborhood && ['Area', s.neighborhood], s.hours && ['Hours (from our guide; check before you go)', s.hours]].filter(Boolean),
        site: s.website || null, q: `${s.name}, ${s.city}, Ireland`, weak: false, walked: true,
      })
    }
  }
  const rank = (x) => (x.walked ? 0 : x.weak ? 2 : 1)
  for (const t of towns) for (const c of Object.keys(t.places)) t.places[c].sort((a, b) => rank(a) - rank(b) || a.name.localeCompare(b.name))
  for (const [tid, st] of Object.entries(plan.stays || {})) byId[tid].stay = st.map((s) => ({ title: s.title, lines: lines(s.lines) }))
  for (const [tid, ns] of Object.entries(plan.townNotes || {})) byId[tid].notes = lines(ns)
  const townList = towns.filter((t) => Object.values(t.places).some((l) => l.length) || t.stay.length)

  /* plans: one spine of days per plan; the other date option shows as swap lines, not a setting */
  const pick = (v, key = 'default') => (v && typeof v === 'object' && !Array.isArray(v) && v.byTickets ? v.byTickets[key] ?? v.byTickets.default : v)
  const dayOut = (d) => d && ({
    date: d.date, title: pick(d.title), sleep: d.sleep || '', match: !!d.match, town: d.town || (plan.sleepTown || {})[d.sleep] || null,
    legs: (pick(d.legs) || []).map((l) => ({ m: l.m, t: money(l.t), d: l.d, weak: (l.ids || []).some((i) => !OK.has(F[i].s)), ids: l.ids || [] })),
    plan: lines(pick(d.plan)), noTicket: d.match ? lines(pick(d.plan, 'none')) : null, note: d.note ? line(pick(d.note)) : null,
  })
  const plans = plan.shapes.map((s) => {
    /* the main week (fly out Tue 14, home Tue 21) in full; the Monday-to-Monday week as a complete second list */
    const days = s.days['14-21'].map(dayOut)
    const altDays = s.days['13-20'].map(dayOut)
    return { id: s.id, short: s.short, label: s.label, bestFor: s.bestFor, skipIf: s.skipIf || '', blurb: s.blurb, pick: !!s.pick,
      nights: s.nights['14-21'], nightsAlt: s.nights['13-20'], metrics: s.metrics, legs: s.legs, pins: s.pins, golf: s.golf, days, altDays,
      sleeps: [...new Set([...days, ...altDays].map((d) => d.town).filter(Boolean))], visits: s.visits || [] }
  })

  const sourcesFor = (obj) => { const out = new Set(); const g = (v) => { if (Array.isArray(v)) return v.forEach(g); if (v && typeof v === 'object') { if (Array.isArray(v.ids)) v.ids.forEach((i) => out.add(i)); for (const k of Object.keys(v)) if (k !== 'ids') g(v[k]) } }; g(obj); return [...out] }
  const stats = { findings: 0, sources: 0, passes: 0, checked: 0 }
  for (const r of data.runs) { stats.findings += r.stats.findings; stats.sources += r.stats.sources; stats.passes += r.stats.agentFiles; stats.checked += Object.values(r.stats.verdicts || {}).reduce((a, n) => a + n, 0) }

  const G = {
    builtOn: data.builtOn, mode, meta: plan.meta, money: RATES, copy: plan.copy,
    plans, towns: townList, map: { ...map, pins: map.pins.map((p) => ({ ...p, short: p.label.replace(/ Golf Club$| Golf Links$/, '') })) },
    golf: plan.golf.map((c) => ({ ...c, facts: c.facts.map((f) => ({ k: f.k, ...line(f) })), transit: Object.fromEntries(Object.entries(c.transit || {}).map(([k, v]) => [k, line(v)])), note: line(c.note) })),
    golfCallout: lines(plan.golfCallout),
    match: { fri: plan.watch.days.fri, sat: plan.watch.days.sat, sun: plan.watch.days.sun, getIn: plan.watch.match.items.map((x) => ({ title: x.title, lines: lines(x.lines) })), tv: plan.watch.tv.items.map((x) => ({ title: x.title, lines: lines(x.lines) })) },
    book: plan.book.filter((b) => !b.mode || b.mode === mode).map((b) => ({ ...b, text: line(b.text) })),
    flights: Object.fromEntries(Object.entries(plan.flights).filter(([k, v]) => !v.mode || v.mode === mode).map(([k, v]) => [k, { title: v.title, items: v.items.map((x) => ({ title: x.title, lines: lines(x.lines.map((l) => (l.byBudget ? l.byBudget.mid : l))) })) }])),
    know: plan.know.map((k) => ({ title: k.title, lines: lines(k.lines.map((l) => (l && l.byBudget ? null : l))), tiers: k.lines.filter((l) => l && l.byBudget).map((l) => Object.fromEntries(Object.entries(l.byBudget).map(([b, v]) => [b, line(v)]))) })),
    made: stats, F,
  }
  /* a plan's days and towns render everything; the per-section drawers list each cited source once */
  G.sections = { plans: sourcesFor(plan.shapes), match: sourcesFor(plan.watch), golf: sourcesFor([plan.golf, plan.golfCallout]), book: sourcesFor(plan.book), know: sourcesFor([plan.know, plan.flights]) }
  if (mode === 'preview') {
    /* the public page: plans comparison, map and the first two days of each plan. Nothing else. */
    const keep = new Set(sourcesFor(plan.shapes.map((s) => ({ m: s.metrics }))))
    G.plans = G.plans.map((p) => ({ ...p, days: p.days.slice(0, 2) }))
    G.towns = []; G.golf = []; G.book = []; G.know = []; G.match = null
    for (const k of Object.keys(G.F)) if (!keep.has(k)) delete G.F[k]
    G.inside = { cta: plan.cta, days: plan.shapes.length, towns: townList.length, places: townList.reduce((a, t) => a + Object.values(t.places).reduce((x, l) => x + l.length, 0), 0), golf: plan.golf.length, book: plan.book.length }
  }
  return G
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  const args = process.argv.slice(2)
  const mode = args.includes('--mode') ? args[args.indexOf('--mode') + 1] : 'private'
  const [dataPath, planPath, mapPath, out] = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--mode')
  const data = JSON.parse(readFileSync(dataPath, 'utf8'))
  const plan = await import(pathToFileURL(path.resolve(planPath)).href)
  const map = JSON.parse(readFileSync(mapPath, 'utf8'))
  const frameworks = []
  for (const f of plan.frameworks || []) frameworks.push((await import(pathToFileURL(path.resolve(f)).href)).default)
  const G = buildField(data, plan, map, frameworks, mode)
  const tpl = readFileSync(path.join(here, 'field-template.html'), 'utf8')
  const stage = readFileSync(path.join(here, '../golf-intro/stage.html'), 'utf8')
  const introSrc = readFileSync(path.join(here, '../golf-intro/first-tee.js'), 'utf8').split('\n')
  const lastImport = introSrc.reduce((n, l, i) => (/^import /.test(l) ? i : n), -1)
  const introJs = [...introSrc.slice(0, lastImport + 1), 'if (!window.__INTRO_SKIP) {', ...introSrc.slice(lastImport + 1), '}'].join('\n')
  const html = tpl.replace('__TITLE__', mode === 'preview' ? `${plan.meta.title} 2027 Preview` : `${plan.meta.title} 2027 Guide`)
    .replace('__INTRO_STAGE__', () => stage).replace('__INTRO_CONFIG__', () => JSON.stringify(plan.meta.introConfig))
    .replace('__INTRO_JS__', () => introJs).replace('__DATA__', () => JSON.stringify(G).replace(/</g, '\\u003c'))
  writeFileSync(out, html)
  const txt = JSON.stringify([G.plans, G.towns, G.golf, G.book, G.know, G.match, G.flights])
  const bad = [...txt.matchAll(/[^."]{0,40}\b(free|insurance|founder|brady|dawson|lads-[a-z]+|DISCOVERED|GBP|USD)\b[^."]{0,30}/gi)].map((m) => m[0]).filter((s) => !/Dawson (Street|Lounge)/.test(s)).filter((s) => !/\b(duty|visa|toll|barrier|gluten|tax|car|hands)-free\b/i.test(s) || /\bfree\b(?!-)/i.test(s.replace(/\b\w+-free\b/gi, '')))
  const places = G.towns.reduce((a, t) => a + Object.values(t.places).reduce((x, l) => x + l.length, 0), 0)
  console.log(`${out}: ${(html.length / 1024).toFixed(0)} KB, mode ${mode}: ${G.plans.length} plans, ${G.towns.length} towns, ${places} places`)
  if (bad.length) { console.error('COPY CHECK:', [...new Set(bad)].slice(0, 15)); process.exitCode = 1 }
}
