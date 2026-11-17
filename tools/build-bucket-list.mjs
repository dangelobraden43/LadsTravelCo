/* tools/build-bucket-list.mjs — GENERATES src/data/bucketList.js from research runs.
 *
 *   node tools/build-bucket-list.mjs <runDir> [<runDir> ...]
 *
 * Reads every lads-timing-events.*.json in each run, applies that run's lads-verifier.json when
 * it exists (refuted findings are dropped; weakened ones take the verifier's proposedClaim and
 * carry it as a note), attaches traps to the event they name, and writes one sorted list of
 * dated trips. A finding whose organiser has not fixed 2027 dates is kept with no dates and
 * shown as "waiting on dates". Nothing here is typed by hand except the LABELS below, which
 * give the Nov 10 calendar run's findings a display name and a kind (those files predate the
 * `value.name` field); a label is a name, never a fact. No money amount survives.
 */
/* eslint-env node */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const runDirs = process.argv.slice(2)
if (!runDirs.length) throw new Error('usage: node tools/build-bucket-list.mjs <runDir> [<runDir> ...]')
const now = new Date()
const TODAY = [now.getFullYear(), now.getMonth() + 1, now.getDate()]
  .map((n) => String(n).padStart(2, '0'))
  .join('-')
const MONEY = /(?:[$€£]\s?\d)|\b\d+\s?(?:USD|EUR|GBP|AUD|CAD|dollars?|euros?|pounds?)\b/i
const slug = (s) =>
  String(s || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

/* The Nov 10 calendar run: display names and kinds for findings that carry none. A finding
 * not listed here, or marked skip, is not a trip (a draw, a deadline, a capacity figure). */
const LABELS = {
  'time-001': { name: 'Total solar eclipse over southern Spain', city: 'Cádiz province', country: 'Spain', kind: 'nature' },
  'time-002': { name: 'Ryder Cup', city: 'Adare', country: 'Ireland', kind: 'sport' },
  'time-004': { name: "Men's Rugby World Cup", city: 'Seven host cities', country: 'Australia', kind: 'sport' },
  'time-005': { name: "FIFA Women's World Cup", city: 'Rio de Janeiro and seven cities', country: 'Brazil', kind: 'sport' },
  'time-007': { name: 'Pan American Games', city: 'Lima', country: 'Peru', kind: 'sport' },
  'time-008': { name: 'Tour de France Grand Départ', city: 'Edinburgh', country: 'United Kingdom', kind: 'sport' },
  'time-009': { name: 'Tour de France Femmes start', city: 'Leeds', country: 'United Kingdom', kind: 'sport' },
  'time-010': { name: "ICC Men's Cricket World Cup", city: 'Johannesburg and host cities', country: 'South Africa', kind: 'sport' },
  'time-012': { name: 'Expo 2027', city: 'Belgrade', country: 'Serbia', kind: 'culture' },
  'time-013': { name: 'Skulptur Projekte Münster', city: 'Münster', country: 'Germany', kind: 'culture' },
  'time-014': { name: 'documenta 16', city: 'Kassel', country: 'Germany', kind: 'culture' },
  'time-015': { name: 'Venice Biennale Architettura', city: 'Venice', country: 'Italy', kind: 'culture' },
  'time-016': { name: 'Liepāja 2027 opening weekend', city: 'Liepāja', country: 'Latvia', kind: 'culture' },
  'time-017': { name: 'Évora 2027 opening', city: 'Évora', country: 'Portugal', kind: 'culture' },
  'time-018': { name: "NCAA Men's Final Four", city: 'Detroit', country: 'United States', kind: 'sport' },
  'time-019': { name: 'Glastonbury Festival', city: 'Pilton, Somerset', country: 'United Kingdom', kind: 'music' },
  'time-021': { name: 'Oktoberfest', city: 'Munich', country: 'Germany', kind: 'festival' },
  'time-022': { name: "St Patrick's Festival", city: 'Dublin', country: 'Ireland', kind: 'holiday' },
  'time-023': { name: 'Vivid Sydney', city: 'Sydney', country: 'Australia', kind: 'festival' },
  'time-024': { name: 'Northern lights season', city: 'Across Iceland', country: 'Iceland', kind: 'nature' },
  'time-025': { name: 'Inca Trail and Machu Picchu 2027 tickets', city: 'Cusco', country: 'Peru', kind: 'nature' },
  'time-rec-001': { name: 'Australian Open', city: 'Melbourne', country: 'Australia', kind: 'sport' },
  'time-rec-002': { name: 'Vienna Philharmonic Ball', city: 'Vienna', country: 'Austria', kind: 'culture' },
  'time-rec-003': { name: 'Vienna Opera Ball', city: 'Vienna', country: 'Austria', kind: 'culture' },
  'time-rec-006': { name: 'Carnevale di Venezia', city: 'Venice', country: 'Italy', kind: 'festival' },
  'time-rec-007': { name: 'Rio Carnival', city: 'Rio de Janeiro', country: 'Brazil', kind: 'festival' },
  'time-rec-008': { name: 'Super Bowl LXI', city: 'Inglewood, California', country: 'United States', kind: 'sport' },
  'time-rec-009': { name: 'Horsetail Fall "firefall"', city: 'Yosemite National Park', country: 'United States', kind: 'nature' },
  'time-rec-010': { name: 'Las Fallas', city: 'Valencia', country: 'Spain', kind: 'festival' },
  'time-rec-011': { name: 'Keukenhof in bloom', city: 'Lisse', country: 'Netherlands', kind: 'nature' },
  'time-rec-012': { name: 'Semana Santa', city: 'Seville', country: 'Spain', kind: 'holiday' },
  'time-rec-013': { name: 'Holi', city: 'Mathura, Vrindavan, Delhi, Jaipur', country: 'India', kind: 'holiday' },
  'time-rec-014': { name: 'Cherry blossom season', city: 'Tokyo and Kyoto', country: 'Japan', kind: 'nature' },
  'time-rec-015': { name: 'The Masters', city: 'Augusta, Georgia', country: 'United States', kind: 'sport' },
  'time-rec-016': { name: 'Feria de Abril', city: 'Seville', country: 'Spain', kind: 'festival' },
  'time-rec-018': { name: 'Songkran', city: 'Bangkok and Chiang Mai', country: 'Thailand', kind: 'holiday' },
  'time-rec-019': { name: 'Kentucky Derby', city: 'Louisville, Kentucky', country: 'United States', kind: 'sport' },
  'time-rec-020': { name: 'Prague Spring Festival', city: 'Prague', country: 'Czechia', kind: 'culture' },
  'time-rec-021': { name: 'Monaco Grand Prix', city: 'Monaco', country: 'Monaco', kind: 'sport' },
  'time-rec-022': { name: 'Synchronous fireflies, Elkmont', city: 'Great Smoky Mountains', country: 'United States', kind: 'nature' },
  'time-rec-023': { name: 'Midsummer in Reykjavik', city: 'Reykjavik', country: 'Iceland', kind: 'nature' },
  'time-rec-024': { name: 'Inti Raymi', city: 'Cusco', country: 'Peru', kind: 'culture' },
  'time-rec-026': { name: 'Wimbledon', city: 'London', country: 'United Kingdom', kind: 'sport' },
  'time-rec-028': { name: 'Holy Week and Easter in Rome', city: 'Rome', country: 'Italy', kind: 'holiday' },
  'time-rec-029': { name: 'Edinburgh Festival Fringe', city: 'Edinburgh', country: 'United Kingdom', kind: 'culture' },
  'time-rec-030': { name: 'Orange Warsaw Festival', city: 'Warsaw', country: 'Poland', kind: 'music' },
  'time-rec-033': { name: 'Jewish Culture Festival', city: 'Kraków', country: 'Poland', kind: 'culture' },
  'time-rec-034': { name: 'La Tomatina', city: 'Buñol', country: 'Spain', kind: 'festival' },
  'time-rec-035': { name: 'Melbourne Cup', city: 'Melbourne', country: 'Australia', kind: 'sport' },
  'time-rec-036': { name: 'Iceland Airwaves', city: 'Reykjavik', country: 'Iceland', kind: 'music' },
  'time-rec-037': { name: 'Vienna Christmas markets', city: 'Vienna', country: 'Austria', kind: 'winter' },
}
/* traps in the Nov 10 run that name no event: where they belong */
const TRAP_TARGET = { 'time-028': 'time-007' }
/* Holy Week in Rome: the finding's range runs on to World Youth Day in Seoul; the trip is the week */
const RANGE_OVERRIDE = { 'time-rec-028': { start: '2027-03-21', end: '2027-03-28' } }

const KINDS = new Set(['festival', 'music', 'sport', 'culture', 'nature', 'holiday', 'food', 'winter'])

/* A researcher's claim is written for the verifier, so it carries working notes: which file it
 * confirms, what the page did on fetch, where a date was computed. None of that is information
 * for a reader. A sentence about the research process is dropped; a trailing "per the
 * organiser's page" tail is cut; at most three sentences remain. The source link on the card
 * is where the provenance lives. */
const PROCESS =
  /\b(CONFIRMS|CORRECTS|REFUTES|Oct 12 file|the file said|the file|on fetch|not read|was read|were read|page read|pages read|snippet|could not be read|renders only|is recorded|not recorded|computed|by hand|this run|search result|search snippet|the brief|the verifier|WebFetch|aggregator|third-party)\b/i
const TAIL = /,?\s+(?:per|according to|as printed on|as listed on)\s+(?:the\s+)?[^.;]*?(?:reporting|announcement|release|page|site|notice|calendar|gazette|list|listing|bulletin)[^.;]*?\.?$/i
function clean(claim) {
  const sentences = claim.split(/(?<=[.!?])\s+(?=[A-Z("'‘“])/)
  const kept = sentences
    .map((s) => s.replace(TAIL, '.').replace(/\.\.$/, '.').trim())
    .filter((s) => s && !PROCESS.test(s))
    .slice(0, 3)
  return (kept.length ? kept : sentences.slice(0, 1)).join(' ')
}
const cleanTicket = (t) => (t && !/not read|fetch|not printed|not stated|not shown|not listed/i.test(t) ? t : null)
const events = []
const traps = []
const stats = { files: 0, findings: 0, dropped: 0, weakened: 0, verified: false, runs: [] }

for (const runDir of runDirs) {
  const RUN = path.resolve(ROOT, runDir)
  const files = fs.readdirSync(RUN)
  const load = (f) => JSON.parse(fs.readFileSync(path.join(RUN, f), 'utf8'))
  const run = load('RUN.json')
  stats.runs.push({ id: run.runId, today: run.today })
  const verifier = files.includes('lads-verifier.json') ? load('lads-verifier.json') : null
  if (verifier) stats.verified = true
  const verdicts = new Map()
  if (verifier) {
    for (const v of verifier.verdicts || []) {
      // the Nov 10 run keys its verdicts by agent part ("lads-timing-events.oneoff"); later runs by `part`
      const part = v.part || (v.agent && v.agent.split('.')[1]) || ''
      verdicts.set(`${part}|${v.findingId}`, v)
    }
  }
  const eventFiles = files.filter((f) => /^lads-timing-events\..*\.json$/.test(f) && !/\.(MISSING|INVALID)/.test(f))
  for (const f of eventFiles) {
    stats.files++
    const part = f.replace(/^lads-timing-events\./, '').replace(/\.json$/, '')
    const j = load(f)
    for (const x of j.findings) {
      stats.findings++
      const v = verdicts.get(`${part}|${x.id}`) || verdicts.get(`|${x.id}`) || null
      if (v && v.verdict === 'refuted') {
        stats.dropped++
        continue
      }
      const label = LABELS[x.id]
      const val = x.value || {}
      if (x.kind === 'trap') {
        traps.push({ ...x, _run: run.runId, _verdict: v })
        continue
      }
      if (x.kind !== 'fact' && x.kind !== 'window') continue
      // the Nov 10 run: only labelled findings are trips; later runs name every event in value.name
      if (!label && !val.name) continue
      const claim = v && v.verdict === 'weakened' && v.proposedClaim ? v.proposedClaim : x.claim
      if (v && v.verdict === 'weakened') stats.weakened++
      if (MONEY.test(claim)) throw new Error(`a money amount in ${x.id}: ${claim.slice(0, 80)}`)
      const name = (label && label.name) || val.name
      const kind = (label && label.kind) || val.kind
      if (!KINDS.has(kind)) throw new Error(`${x.id}: unknown kind ${kind}`)
      const range = RANGE_OVERRIDE[x.id] || {}
      const start = range.start || (val.start && /^\d{4}-\d{2}-\d{2}$/.test(val.start) ? val.start : null)
      const end = range.end || (val.end && /^\d{4}-\d{2}-\d{2}$/.test(val.end) ? val.end : start)
      const s2027 = String(val.status2027 || '').toLowerCase()
      let status = !start ? 'not-announced' : s2027.startsWith('expected') ? 'expected' : s2027.startsWith('not') ? 'expected' : 'confirmed'
      if (start && /conflict|computed|fixed/.test(s2027)) status = 'expected'
      events.push({
        id: `${slug(name)}-${start ? start.slice(0, 4) : '2027'}`,
        findingId: x.id,
        run: run.runId,
        name,
        kind,
        start,
        end,
        city: (label && label.city) || val.city || null,
        country: (label && label.country) || val.country || null,
        status,
        what: clean(claim),
        ticket: val.ticketStatus && !/^not ticketed$/i.test(val.ticketStatus) ? cleanTicket(val.ticketStatus) : null,
        appliesTo: x.appliesTo || null,
        sources: (x.sources || []).filter((s) => s.access === 'read' && /^https?:/.test(s.url)).slice(0, 2).map((s) => ({ title: s.title, url: s.url })),
        checkedOn: v && v.checkedOn ? v.checkedOn : x.checkedOn,
        ...(v && v.verdict === 'confirmed' ? { checked: true } : {}),
        ...(v && v.verdict === 'weakened' && v.proposedClaim ? { note: v.proposedClaim } : {}),
      })
    }
  }
}

/* a trap rides on the event it names, as a caution in the verifier's words where it ruled */
let attached = 0
const byFinding = new Map(events.map((e) => [e.findingId, e]))
const norm = (s) => slug(s).split('-')[0]
for (const t of traps) {
  const text = t._verdict && t._verdict.verdict === 'weakened' && t._verdict.proposedClaim ? t._verdict.proposedClaim : t.claim
  if (MONEY.test(text)) throw new Error(`a money amount in trap ${t.id}`)
  const val = t.value || {}
  // a trap that names its own event (Bonnaroo's year off, Essence's lost venue) is that event's
  // entry, undated; it never rides on a neighbour that merely shares the city
  const standalone = Boolean(val.name && !val.start)
  let target = TRAP_TARGET[t.id] ? byFinding.get(TRAP_TARGET[t.id]) : null
  if (!target && !standalone && t.appliesTo) {
    const key = norm(t.appliesTo)
    target = events.find((e) => e.run === t._run && e.appliesTo && norm(e.appliesTo) === key) || events.find((e) => e.run === t._run && e.city && norm(e.city) === key)
  }
  if (!target) {
    if (standalone) {
      events.push({
        id: `${slug(val.name)}-2027`,
        findingId: t.id,
        run: t._run,
        name: val.name,
        kind: KINDS.has(val.kind) ? val.kind : 'music',
        start: null,
        end: null,
        city: val.city || null,
        country: val.country || null,
        status: 'not-announced',
        what: clean(text),
        ticket: null,
        appliesTo: t.appliesTo || null,
        sources: (t.sources || []).filter((s) => /^https?:/.test(s.url)).slice(0, 2).map((s) => ({ title: s.title, url: s.url })),
        checkedOn: t.checkedOn,
      })
      attached++
    } else console.warn(`trap not attached: ${t.id} (${t.appliesTo})`)
    continue
  }
  const c = clean(text)
  target.caution = target.caution ? `${target.caution} ${c}` : c
  attached++
}

/* one entry per trip: a later run's reading of the same name replaces an earlier one */
const seen = new Map()
for (const e of events) seen.set(slug(e.name), e)
const unique = [...seen.values()].map((e) => {
  const { findingId, appliesTo, run, ...rest } = e
  return rest
})
unique.sort((a, b) => {
  if (a.start && b.start) return a.start < b.start ? -1 : a.start > b.start ? 1 : a.name.localeCompare(b.name)
  if (a.start) return -1
  if (b.start) return 1
  return a.name.localeCompare(b.name)
})
for (const e of unique) {
  if (MONEY.test(e.what) || (e.ticket && MONEY.test(e.ticket)) || (e.caution && MONEY.test(e.caution))) throw new Error(`money in ${e.id}`)
  if (/\bfree\b/i.test(`${e.what} ${e.ticket || ''}`)) console.warn(`CHECK "free" wording in ${e.id}`)
}

const header = `/* GENERATED by tools/build-bucket-list.mjs on ${TODAY} from ${runDirs.join(', ')}. Do not edit by hand.
 * Every entry was read from the organiser's, venue's or governing body's own page, which is the
 * first source on each row. ${stats.verified ? 'The verifier ran over these runs.' : 'NOT YET VERIFIED.'}
 * No ticket prices, no ratings, no Lads voice. */
`
fs.writeFileSync(
  path.join(ROOT, 'src/data/bucketList.js'),
  header +
    `\nexport const BUCKET_META = ${JSON.stringify({ runs: stats.runs, builtOn: TODAY, verified: stats.verified }, null, 2)}\n\nexport const BUCKET_EVENTS = ${JSON.stringify(unique, null, 1)}\n`
)
const n = (k) => unique.filter((e) => e.status === k).length
console.log(`${unique.length} trips from ${stats.findings} findings in ${stats.files} files: ${n('confirmed')} confirmed, ${n('expected')} expected, ${n('not-announced')} waiting on dates; ${attached} traps attached, ${stats.dropped} refuted dropped, ${stats.weakened} weakened`)
console.log(`verifier: ${stats.verified ? 'applied' : 'NOT RUN on at least one run'}; checked rows: ${unique.filter((e) => e.checked).length}`)
