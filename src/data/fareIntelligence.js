/* FARE INTELLIGENCE — the shared schema behind every framework's `fareIntelligence`.
 *
 * WHAT THIS LAYER IS FOR: a reader deciding when to buy. Not a fare search, not
 * a price we quote, and never a number we cannot stand behind. This is the
 * credibility layer, so it is built to fail loudly rather than guess quietly.
 *
 * ── THE HARD RULES ───────────────────────────────────────────────────────────
 * 1. RANGES, NEVER POINT PRICES. "$780" is a promise. "$650–$900" is a pattern.
 *    Only the second is honest about what research can actually tell you. This
 *    rule already caught one live claim: rome/september was publishing
 *    "Flights from ORD drop to ~$750 RT" in its timing window.
 * 2. NO INVENTED PRECISION. Every dollar figure needs a source id that resolves
 *    in FARE_SOURCES. A band with no source does not ship — it stays `null` and
 *    the component says so out loud.
 * 3. EVERY RECORD IS STAMPED. `checkedOn` plus `sourcedFrom`. A fare claim with
 *    no date is a fare claim with no meaning.
 * 4. QUARTERLY REFRESH, WRITTEN INTO THE DATA. `nextReviewDue` is computed and
 *    surfaced; `isFareStale()` lets any surface refuse to render a stale record
 *    rather than wait for a human to notice. Same lesson as the Iceland eclipse.
 *
 * ── WHY EVERY `bands` FIELD IS CURRENTLY null ────────────────────────────────
 * Because nobody has pulled real fares yet, and the aggregators disagree
 * violently. Researching Lima on Sept 2 2026 returned "June is the cheapest
 * month", "May is generally the cheapest", "August is the cheapest", and
 * "January is cheapest at $594" — four different answers from four vendors,
 * none of them specific to ORD, DTW or GRR, all of them marketing pages for a
 * booking funnel. Averaging that into a confident "$700–$900 from Detroit in
 * June" would be manufacturing precision out of noise, which is the exact
 * failure this company exists to not commit.
 *
 * So the layer ships with what IS defensible — the relative seasonal SHAPE, the
 * booking-window research, and the disagreement itself — and the dollar bands
 * stay null until a real pull happens. See FARE_BANDS_BLOCKED below.
 *
 * ── HOW A LIVE FEED REPLACES THIS WITHOUT TOUCHING THE COMPONENT ─────────────
 * The component reads `origins[].bands`. It does not care whether that array was
 * typed by a human, researched quarterly, or fetched this morning. Fill it from
 * an API and set `bandSource: 'live'` and the render changes with no code edit.
 * The Aviasales/WayAway slot already architected for the /local airport panels
 * is the obvious first candidate.
 */

export const FARE_SCHEMA_VERSION = 1

/* Every id used in a `sourcedFrom` array must resolve here. If it does not,
 * the record is citing something nobody can check. */
export const FARE_SOURCES = {
  'going-2026': {
    label: 'Going — "When Is the Best Time to Book a Flight?" (2026 data)',
    url: 'https://www.going.com/guides/the-best-time-to-book-a-cheap-flight',
    retrievedOn: '2026-09-02',
    kind: 'industry-analysis',
  },
  'expedia-arc-window': {
    label: 'Expedia / ARC air travel hacks — booking-window finding (31–45 days)',
    url: 'https://www.smartertravel.com/booking-international-flights-for-summer/',
    retrievedOn: '2026-09-02',
    kind: 'industry-analysis',
    note: 'Cited BECAUSE it disagrees with the 3-6 month advice. The disagreement is the finding.',
  },
  'europe-shoulder-delta': {
    label: 'Reporting on European shoulder-season fares running 20–40% below July/December',
    url: 'https://travel.yahoo.com/advice/travel-tips/articles/best-time-book-flights-europe-115211530.html',
    retrievedOn: '2026-09-02',
    kind: 'press',
  },
}

/* The Midwest origin set. These three are the minimum every framework carries
 * because they are where the Lads and the people reading this actually leave
 * from. GRR is included precisely because it is the small one — a regional
 * airport behaves differently from a hub, and pretending otherwise would hide
 * the most useful thing a Grand Rapids reader could be told. */
export const MIDWEST_ORIGINS = [
  { airport: 'ORD', city: 'Chicago' },
  { airport: 'DTW', city: 'Detroit' },
  { airport: 'GRR', city: 'Grand Rapids' },
]

/* ⛔ THE BLOCKER, STATED IN THE DATA RATHER THAN IN SOMEBODY'S MEMORY.
 * Read by the component so the gap is visible to a reader, not just to us. */
export const FARE_BANDS_BLOCKED = {
  since: '2026-09-02',
  reason:
    'No sourced fare pull exists yet for these routes. Vendor "cheapest month" pages disagree with each other and are not origin-specific, so they cannot support a dollar band.',
  unblockedBy: [
    'A live fare feed (the Aviasales/WayAway slot already architected for the /local airport panels), or',
    'A manual dated fare pull per origin that a founder signs off on.',
  ],
}

/* Relative seasonal tiers. This is the part research CAN support: not what a
 * seat costs, but when the curve is high and low relative to itself. */
export const FARE_TIERS = {
  low: 'Low',
  shoulder: 'Shoulder',
  peak: 'Peak',
}

const QUARTER_MS = 92 * 24 * 60 * 60 * 1000

export function nextReviewDue(checkedOn) {
  return new Date(new Date(checkedOn).getTime() + QUARTER_MS).toISOString().slice(0, 10)
}

/* A stale fare record is worse than none — it is a confident wrong number.
 * Any surface may call this and decline to render. */
export function isFareStale(record, today = new Date().toISOString().slice(0, 10)) {
  if (!record?.checkedOn) return true
  return nextReviewDue(record.checkedOn) < today
}

/* Shared booking-lead-time guidance. Deliberately reports the DISAGREEMENT
 * between sources rather than picking the tidier answer, because a reader who
 * books at 40 days on our say-so and pays more deserves to have been told the
 * evidence was split. */
export const BOOKING_LEAD_TIME = {
  headline: 'Roughly 6 to 16 weeks out, and the research does not fully agree.',
  detail:
    "Most guidance for transatlantic and long-haul routes lands between six and sixteen weeks before departure. Expedia's own analysis puts the sweet spot considerably later, at 31 to 45 days, including international travel — against the more common advice to book three to six months ahead for Europe. We report the spread rather than pick a winner: the honest read is that there is a broad plateau, not a single perfect day, and that the expensive mistakes are at the edges.",
  edges:
    'The two reliable losers are booking inside about two weeks, where last-minute premiums are typical, and waiting on a peak-season departure that sells into its highest fare buckets.',
  sourcedFrom: ['going-2026', 'expedia-arc-window'],
  checkedOn: '2026-09-02',
}
