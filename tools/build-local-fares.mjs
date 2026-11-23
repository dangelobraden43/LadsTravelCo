/* tools/build-local-fares.mjs — GENERATES src/data/localFares.js from a midwest-fares research run.
 *
 *   node tools/build-local-fares.mjs internal/research/midwest-fares/<runId>/
 *
 * One row per gateway airport and destination: the seasonal fare ranges (low, shoulder, peak) and
 * the whole-year range as the agents read them from published fare history, the routing in one or
 * two plain sentences, the flight time, the booking window, and any trap as a caution. Refuted
 * findings are dropped, weakened ones take the verifier's wording. Sentences about the research
 * process are stripped. A point price anywhere throws.
 */
/* eslint-env node */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const runDir = process.argv[2]
if (!runDir) throw new Error('usage: node tools/build-local-fares.mjs <runDir>')
const RUN = path.resolve(ROOT, runDir)
const now = new Date()
const TODAY = [now.getFullYear(), now.getMonth() + 1, now.getDate()].map((n) => String(n).padStart(2, '0')).join('-')

const files = fs.readdirSync(RUN)
const load = (f) => JSON.parse(fs.readFileSync(path.join(RUN, f), 'utf8'))
const run = load('RUN.json')
const DEST = new Map(run.scope.destinations.map((d) => [d.iata, d]))
const verifier = files.includes('lads-verifier.json') ? load('lads-verifier.json') : null
const verdicts = new Map()
if (verifier) for (const v of verifier.verdicts || []) verdicts.set(`${v.part || ''}|${v.findingId}`, v)

/* a point price survives nowhere: every amount must sit in a "$X to $Y" or "$X–$Y" pair */
const AMOUNT = /\$\s?\d[\d,]*/g
const pointPrice = (s) => {
  const amounts = (s.match(AMOUNT) || []).length
  const pairs = (s.match(/\$\s?\d[\d,]*\s*(?:to|–|-|and)\s*\$?\s?\d[\d,]*/g) || []).length
  return amounts > pairs * 2
}
const PROCESS =
  /\b(CONFIRMS|CORRECTS|REFUTES|the file|on fetch|not read|was read|were read|page read|pages read|snippet|could not be read|renders only|is recorded|not recorded|computed|by hand|this run|search result|the brief|the verifier|WebFetch|blocked|CAPTCHA|403)\b/i
const TAIL = /,?\s+(?:per|according to|as printed on|as listed on)\s+(?:the\s+)?[^.;]*?(?:reporting|announcement|release|page|site|notice|table|history|histories|insights|filing)[^.;]*?\.?$/i
/* a transit fare or any amount in another currency stays off the card: the card carries fare ranges only */
const OTHER_MONEY = /\b(EUR|CZK|AUD|GBP|CHF|USD)\s?\d|[€£]\s?\d|\d\s?(EUR|CZK|AUD|GBP|CHF)\b/
function clean(claim, max = 2) {
  const sentences = claim.split(/(?<=[.!?])\s+(?=[A-Z("'‘“])/)
  const kept = sentences
    .map((s) => s.replace(TAIL, '.').replace(/\.\.$/, '.').trim())
    .filter((s) => s && !PROCESS.test(s) && !OTHER_MONEY.test(s) && !/\$\s?\d/.test(s)) // sentences carry no money; the ranges do
    .slice(0, max)
  return (kept.length ? kept : sentences.slice(0, 1)).join(' ')
}

const rows = new Map() // `${origin}|${dest}` → row
const airportNotes = {}
let dropped = 0
let weakened = 0
const rowFor = (origin, iata) => {
  const key = `${origin}|${iata}`
  if (!rows.has(key)) {
    const d = DEST.get(iata)
    rows.set(key, {
      origin,
      iata,
      destination: d ? d.city : iata,
      framework: d ? d.framework : null,
      year: null,
      ranges: [],
      routing: null,
      carriers: null,
      stops: null,
      hours: null,
      window: null,
      arrival: null,
      leadDays: null,
      cheapestMonths: null,
      caution: null,
      sources: [],
      checkedOn: null,
      checked: false,
    })
  }
  return rows.get(key)
}
const addSource = (row, f) => {
  for (const s of (f.sources || []).filter((s) => s.access === 'read' && /^https?:/.test(s.url))) {
    if (row.sources.length < 3 && !row.sources.some((x) => x.url === s.url)) row.sources.push({ title: s.title, url: s.url })
  }
  if (!row.checkedOn || f.checkedOn > row.checkedOn) row.checkedOn = f.checkedOn
}

for (const f of files.filter((x) => /^lads-flights\..*\.json$/.test(x) && !/\.(MISSING|INVALID)/.test(x))) {
  const part = f.replace(/^lads-flights\./, '').replace(/\.json$/, '')
  for (const x of load(f).findings) {
    const v = verdicts.get(`${part}|${x.id}`) || null
    if (v && v.verdict === 'refuted') {
      dropped++
      continue
    }
    const val = x.value || {}
    const claim = v && v.verdict === 'weakened' && v.proposedClaim ? v.proposedClaim : x.claim
    if (v && v.verdict === 'weakened') weakened++
    if (val.topic === 'fare-range' && pointPrice(claim)) throw new Error(`a point price in ${part} ${x.id}: ${claim.slice(0, 90)}`)
    const origin = val.origin
    if (!origin) continue
    if (!val.destination || !DEST.has(val.destination)) {
      // an airport-level fact or trap (Midway has no Europe flights; the Blue Line runs all night)
      if (x.kind === 'trap' || val.topic === 'routing') {
        const list = (airportNotes[origin] = airportNotes[origin] || [])
        if (list.length < 3) list.push(clean(claim, 2))
      }
      continue
    }
    const row = rowFor(origin, val.destination)
    if (x.kind === 'trap') {
      const c = clean(claim, 2)
      row.caution = row.caution ? `${row.caution} ${c}` : c
      addSource(row, x)
      continue
    }
    switch (val.topic) {
      case 'fare-range':
        if (!(Number.isFinite(val.low) && Number.isFinite(val.high) && val.low < val.high)) break
        if (val.season) row.ranges.push({ season: val.season, months: val.months || null, low: val.low, high: val.high, basis: val.basis || null, ...(v && v.verdict === 'confirmed' ? { checked: true } : {}) })
        else row.year = { low: val.low, high: val.high, basis: val.basis || null, ...(v && v.verdict === 'confirmed' ? { checked: true } : {}) }
        if (v && v.verdict === 'confirmed') row.checked = true
        addSource(row, x)
        break
      case 'routing':
        // the agents file two kinds of "routing": how you fly there, and how you reach town on arrival
        {
          const arrival =
            !val.carriers &&
            /\b(km|miles?)\b[^.]*\b(centre|center|downtown|city|CBD)\b|\b(train|coach|bus|metro|rail|taxi|tram)\b/i.test(claim)
          if (arrival) row.arrival = clean(claim, 2)
          else if (!row.routing || val.carriers) {
            row.routing = clean(claim, 2)
            row.carriers = val.carriers || row.carriers
            row.stops = Number.isFinite(val.stops) ? val.stops : row.stops
          }
        }
        addSource(row, x)
        break
      case 'flight-time':
        row.hours = Number.isFinite(val.hours) ? val.hours : row.hours
        if (!row.routing) row.routing = clean(claim, 1)
        break
      case 'booking-window':
        row.window = clean(claim, 2)
        row.leadDays = val.leadDays || row.leadDays
        row.cheapestMonths = val.months || row.cheapestMonths
        addSource(row, x)
        break
      default:
        break
    }
  }
}

const ORDER = { low: 0, shoulder: 1, peak: 2 }
const out = [...rows.values()]
  .map((r) => ({ ...r, ranges: r.ranges.sort((a, b) => (ORDER[a.season] ?? 9) - (ORDER[b.season] ?? 9)) }))
  .filter((r) => r.year || r.ranges.length)
  .sort((a, b) => a.origin.localeCompare(b.origin) || [...DEST.keys()].indexOf(a.iata) - [...DEST.keys()].indexOf(b.iata))
for (const r of out) {
  for (const s of [r.routing, r.window, r.caution]) if (s && pointPrice(s)) throw new Error(`a point price in a sentence for ${r.origin}-${r.iata}`)
}

const header = `/* GENERATED by tools/build-local-fares.mjs on ${TODAY} from ${runDir}. Do not edit by hand.
 * Typical round-trip economy fare ranges from a gateway airport to a Lads destination, read from
 * published fare history (the sources on each row), never a quote. ${verifier ? 'The verifier ran over this run.' : 'NOT YET VERIFIED.'}
 * No point price survives the build. */
`
fs.writeFileSync(
  path.join(ROOT, 'src/data/localFares.js'),
  header +
    `\nexport const FARES_META = ${JSON.stringify({ run: run.runId, checkedOn: run.today, builtOn: TODAY, verified: Boolean(verifier) }, null, 2)}\n\nexport const FARES = ${JSON.stringify(out, null, 1)}\n\nexport const AIRPORT_NOTES = ${JSON.stringify(airportNotes, null, 1)}\n`
)
console.log(`${out.length} airport-destination rows from ${[...new Set(out.map((r) => r.origin))].join(', ')}; ${out.filter((r) => r.ranges.length).length} with seasonal bands, ${out.filter((r) => r.caution).length} with a caution; ${dropped} refuted dropped, ${weakened} weakened; verifier ${verifier ? 'applied' : 'not run'}`)
