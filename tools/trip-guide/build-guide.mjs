/* /trip-guide page builder: data.json (from build-data.mjs) + a trip plan module -> one HTML page.
 *
 * The plan module (private, per trip) exports:
 *   plan     - everything the template renders by hand: title, bases, book, days, regions, road, copy
 *   sections - { <run destination>: 'gorge' | 'ridge' | 'road' }
 *   areas    - [{ section, match: RegExp over topic/name, label, drive, near }]  first match wins
 *   legs     - { <part>: legId } for the road section
 *   knowGroups by run: { <run destination>: groupId }
 *
 * Usage: node tools/trip-guide/build-guide.mjs <data.json> <plan.mjs> <out.html>
 */
import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const CATS = [['eat', 'Eat'], ['coffee', 'Coffee'], ['drink', 'Drink'], ['see', 'See and do'], ['views', 'Views'], ['outdoors', 'Falls and outdoors']]

export function category(it) {
  const t = `${it.topic} ${it.name}`.toLowerCase()
  const lead = `${it.name} ${it.claim.slice(0, 160)}`.toLowerCase()
  if (/coffee|cafe|café|bakery|espresso|bagel/.test(lead) && !/brew(ery|ing|works)|winery|cider/.test(lead)) return 'coffee'
  if (it.part === 'eat') return 'eat'
  if (it.part === 'drink') return 'drink'
  if (/overlook|viewpoint|views?\b|lookout/.test(t)) return 'views'
  if (/waterfall|falls|outdoors|wildlife|state-park|river/.test(t)) return 'outdoors'
  if (/brew|bar\b|bars|winer|wine|cider|distill|taproom/.test(t + ' ' + lead)) return 'drink'
  if (/dining|restaurant|food|eat|bbq|barbecue|diner|market|grocer/.test(t)) return 'eat'
  return 'see'
}

/* a part file named for a leg ("leg1") belongs to the road */
const trim = (s, n) => (s && s.length > n ? s.slice(0, n).replace(/\s+\S*$/, '') + '…' : s || '')
const fmtRange = (v, unit = '') => {
  if (v == null) return null
  if (typeof v === 'number') return String(v) + unit
  if (typeof v === 'object' && v.low != null) return v.low === v.high ? `${v.low}${unit}` : `${v.low}–${v.high}${unit}`
  return String(v)
}

export function build(data, mod) {
  const { plan, sections, areas, legs, knowGroups, skipPlace = () => false } = mod
  const items = []; const hikes = []; const know = []
  const seen = new Map()
  for (const run of data.runs) {
    const section = sections[run.destination]
    for (const it of run.items) {
      const areaHit = areas.find((a) => (!a.section || a.section === section) && a.match.test(`${it.topic} ${it.name || ''}`))
      // hikes: trail routes and trail facts with stats
      if (it.agent === 'lads-parks-trails' && /trail/.test(it.topic) && (it.kind === 'route' || it.kind === 'fact') && it.value && it.value.miles != null) {
        const hikeArea = areas.find((a) => a.section === section && a.match.test(`${it.value.trailhead || ''} ${it.topic} ${it.name}`))
        hikes.push({ id: it.id, section, name: it.name, miles: fmtRange(it.value.miles), gain: fmtRange(it.value.gainFt), difficulty: it.value.difficulty ? String(it.value.difficulty).replace(/\s*\(.*\)$/, '') : null, hours: fmtRange(it.value.hours), where: it.value.trailhead || null, drive: hikeArea ? hikeArea.drive : null, status: it.status, closed: /closed/i.test(it.claim.slice(0, 200)) ? 'Partly closed: see note' : null, claim: it.claim })
        continue
      }
      if (it.kind === 'place') {
        if (skipPlace(it)) continue
        if (it.geo && it.geo.summit) continue // summits are hikes, not places to drive to
        const key = section + '|' + (it.name || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
        const site = (it.sources.find((s) => s.kind === 'official' || s.kind === 'government') || {}).url || null
        const g = {
          id: it.id, section, kind: 'place', name: it.name, claim: it.claim, notes: trim(it.notes, 900), status: it.status,
          why: it.verifierReason ? trim(it.verifierReason, 500) : null, sources: it.sources.slice(0, 4), site, geo: it.geo,
          cat: category(it), areaLabel: areaHit ? areaHit.label : null, drive: areaHit ? areaHit.drive : null,
          driveSort: areaHit ? areaHit.sort ?? 999 : 999, near: Boolean(areaHit && areaHit.near), state: areaHit ? areaHit.state : null,
          leg: section === 'road' ? legs[it.part] || null : null, markable: true,
        }
        const prev = seen.get(key)
        if (prev) { // same place twice in one section: keep the richer card, carry coordinates over
          if (!prev.geo && g.geo) prev.geo = g.geo
          if (prev.agent === 'lads-provenance' || g.claim.length > prev.claim.length * 1.6) Object.assign(prev, { claim: g.claim, notes: g.notes, sources: g.sources, site: g.site || prev.site, cat: g.cat, status: g.status, why: g.why })
          continue
        }
        g.agent = it.agent
        seen.set(key, g); items.push(g)
        continue
      }
      if (it.kind === 'trap' || it.kind === 'requirement' || it.kind === 'window' || (it.kind === 'fact' && /closure|status|hours|season|ticket|fee|pass|toll|road|cell|fuel|parking|weather|sun|moon|colou?r|event|hunting|river/.test(it.topic))) {
        know.push({ id: it.id, group: knowGroups[run.destination], kind: it.kind, claim: it.claim, status: it.status, link: (it.sources[0] || {}).url || null })
      }
    }
  }
  items.sort((a, b) => a.driveSort - b.driveSort || a.name.localeCompare(b.name))
  hikes.sort((a, b) => (a.section > b.section ? 1 : a.section < b.section ? -1 : 0) || a.name.localeCompare(b.name))
  const verified = data.runs.filter((r) => r.verified).length
  const counts = `${items.length} places, ${hikes.length} hikes, ${know.length} notes. Fact-check: ${verified} of ${data.runs.length} research runs verified.`
  for (const it of items) { delete it.driveSort; delete it.agent }
  return { builtOn: data.builtOn, plan: { ...plan, cats: CATS }, items, hikes, know, counts }
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  const [dataPath, planPath, out] = process.argv.slice(2)
  const data = JSON.parse(readFileSync(dataPath, 'utf8'))
  const mod = await import(pathToFileURL(path.resolve(planPath)).href)
  const g = build(data, mod)
  const tpl = readFileSync(new URL('./template.html', import.meta.url), 'utf8')
  const json = JSON.stringify(g).replace(/</g, '\\u003c')
  const html = tpl.replace('__TITLE__', mod.plan.title).replace('__DATA__', () => json)
  writeFileSync(out, html)
  console.log(`${out}: ${(html.length / 1024).toFixed(0)} KB. ${g.counts}`)
  const byCat = {}; for (const i of g.items) byCat[i.section + ':' + i.cat] = (byCat[i.section + ':' + i.cat] || 0) + 1
  console.log(byCat, 'no area:', g.items.filter((i) => !i.areaLabel).map((i) => i.section + ':' + i.name).slice(0, 40))
}
