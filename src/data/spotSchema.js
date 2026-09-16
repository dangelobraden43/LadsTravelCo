/* THE V2 PLACE SCHEMA — the two layers, and the line between them.
 *
 * WHY THIS FILE EXISTS. On Sept 16 2026 an audit walked all 220 published
 * places and counted every filled field. The result:
 *
 *     description   220 / 220
 *     ladsRating     15 / 220
 *     ladsTake        0 / 220   <- not empty. ABSENT FROM THE SCHEMA.
 *     forWho          0 / 220
 *     story           0 / 220
 *
 * CLAUDE.md had recorded the personal layer as "mostly empty" for months. It
 * was not mostly empty, it did not exist: no place object carried the field,
 * and the framework spot card had no slot to render one. Brady had spent hours
 * writing firsthand notes from every trip and there was nowhere on the site
 * for a single line of it to land.
 *
 * The `enrich` skill has named these fields since August and forbids
 * AI-generating them. The rule was written; the schema was not. This file is
 * the schema, so the rule now has something to attach to.
 *
 * ⛔ THE TWO-LAYER RULE, PROMOTED FROM /peru, WHICH IS THE PRODUCT.
 * The founder layer is a founder's words or it is empty. The research layer is
 * what the public says, labelled, quieter, and sourced on every entry. They
 * render differently on purpose and must never be mistaken for each other.
 * Nothing in the research layer is ever written to fill a founder silence.
 *
 * ⛔ SILENCE OVER PADDING. An empty founder field renders NOTHING. Not "no
 * note from the Lads on this one", not a placeholder, not a greyed row — the
 * absence is never announced. Brady ruled this on /peru after the page shipped
 * its own completeness accounting to a reader who had no use for it. An empty
 * `criticized` likewise renders nothing rather than "no complaints found",
 * which would be an endorsement we did not make.
 */

/* ===== THE FOUNDER LAYER =====
 *
 * These come from Brady or Dawson verbatim, or they stay empty. There is no
 * third option and no pipeline that may write them.
 *
 * `ladsRating` is in this list on purpose. It is not a number the data can
 * compute — it is a founder's score, and it drives the endorsement gradient in
 * FrameworkPage.jsx. A researched rating would launder consensus into a Lads
 * claim, which is the whole failure mode this file guards.
 */
export const FOUNDER_FIELDS = Object.freeze([
  'ladsTake', // The line itself, verbatim.
  'forWho', // Who this is actually for, in their words.
  'story', // The anecdote. The thing AI cannot produce.
  'ladsRating', // A founder's score. Drives the endorsement gradient.
])

/* ===== THE RESEARCH LAYER =====
 *
 * The public's opinion, always labelled as the public's. A consensus claim
 * with no resolvable source does not ship. Thin research ships empty and says
 * "limited coverage" out loud rather than being padded into confidence.
 */
export const RESEARCH_FIELDS = Object.freeze([
  'publicConsensus', // { summary, praised[], criticized[], practical[] }
  'consensusSources', // [{ title, url, kind, checkedOn }]
  'bestTime', // When to go, WITH its reasoning attached.
  'nearby', // Computed from stored coordinates. Never geocoded from a name.
  'theTrap', // The thing that catches people out.
  'enrichedOn', // ISO date of the research pass.
])

/* Attribution required alongside each founder field. A founder line with no
 * named author is an orphan quote, and an orphan quote is indistinguishable
 * from generated copy six months later — which is exactly the state the
 * `PERU_SAVED_SOURCE.note` false claim reached before Lane 3 caught it. */
export const FOUNDER_ATTRIBUTION = Object.freeze({
  ladsTake: 'ladsTakeBy',
  forWho: 'forWhoBy',
  story: 'storyBy',
  ladsRating: 'validator',
})

/* ===== PROVENANCE SOURCE BLOCK =====
 *
 * Promoted from peru.js's BRADY_TAKE_SOURCE. Every data file carrying founder
 * copy declares one of these, so a reader of the FILE can always answer "who
 * said this, when, and how do we know" without trusting a comment.
 *
 * ⛔ NEVER RENDER `medium`. On /peru it resolved to the string "Brady, direct
 * to Claude Code in session", which is our own paperwork and belongs nowhere
 * near a reader. It is provenance for us, not copy for them.
 */
export function founderSource({ by, capturedAt, medium, note }) {
  if (!by)
    throw new Error(
      'founderSource: `by` is required — an unattributed founder layer is not a founder layer'
    )
  if (!capturedAt) throw new Error('founderSource: `capturedAt` is required')
  return { by, capturedAt, medium: medium || null, note: note || null }
}

/* ===== COLLECTIVE TAKE =====
 *
 * One statement about a SET of places. Promoted from LADS_COLLECTIVE_TAKE.
 *
 * ⛔ RENDER AS A GROUP, NEVER SPLIT PER PLACE. "All of the restaurants were as
 * good as advertised" is one sentence about a set. Slicing it into a
 * per-restaurant blurb manufactures a firsthand opinion the founder never gave
 * about that specific place. This is the single easiest way to turn a true
 * statement into a false one, and it looks like an improvement while you do it.
 */
export function collectiveTake({ scope, text, by, capturedAt, framing }) {
  if (!scope)
    throw new Error(
      'collectiveTake: `scope` is required — a statement about a set must name the set'
    )
  if (!by) throw new Error('collectiveTake: `by` is required')
  return {
    scope,
    text,
    by,
    capturedAt: capturedAt || null,
    framing: framing || null,
    isCollective: true,
  }
}

/* ===== QUOTE OWNERSHIP =====
 *
 * Promoted from PeruPage.jsx. One founder sentence is sometimes attached to
 * more than one place — Brady's ATV line sits on both the Red Valley operator
 * record and Vinicunca itself. Printing it twice reads as a bug AND
 * double-counts a single endorsement.
 *
 * The tie-break is deliberately NOT "first in the array". That hands the quote
 * to whichever record happens to sort first, which on Peru was a tour
 * operator's office in downtown Cusco, about 100 km from the mountain the
 * sentence is actually about. A quote belongs to the EXPERIENCE. So a record
 * flagged `recordIsOffice` always loses ownership to one that is not.
 *
 * Returns { owner, owns } — `owns(place)` is true for exactly one place per
 * distinct sentence. The non-owning place renders a one-line pointer to where
 * its words are printed instead, which is honest and cheap.
 */
export function quoteOwnership(places, field = 'ladsTake') {
  const owner = new Map()
  for (const p of places || []) {
    const quote = p && p[field]
    if (!quote) continue
    const held = owner.get(quote)
    if (!held || (held.recordIsOffice && !p.recordIsOffice)) owner.set(quote, p)
  }
  return {
    owner,
    distinct: owner.size,
    owns: (p) => Boolean(p && p[field]) && owner.get(p[field]) === p,
    holderFor: (p) => (p && p[field] ? owner.get(p[field]) : null),
  }
}

/* ===== THE ENFORCEMENT =====
 *
 * Code cannot detect that a sentence was AI-generated. What it CAN detect is a
 * founder field arriving with no named author, which is the shape generated
 * copy takes when it slips in — nobody writes a fake attribution, they just
 * omit one. So attribution is the enforceable proxy and this is where it is
 * enforced.
 *
 * Dev-time only, by design. It reports every violation at once rather than
 * throwing on the first, because a data file being migrated will trip several
 * and fixing them one build at a time is miserable. Silent in production: a
 * reader must never see our validation output, same rule as everything else on
 * this page.
 */
export function auditFounderProvenance(places, { label = 'places' } = {}) {
  const problems = []
  for (const p of places || []) {
    if (!p || !p.name) continue
    for (const field of FOUNDER_FIELDS) {
      const value = p[field]
      const filled = value !== null && value !== undefined && value !== ''
      if (!filled) continue
      const attributionKey = FOUNDER_ATTRIBUTION[field]
      if (!p[attributionKey]) {
        problems.push(`${p.name}: \`${field}\` is filled but \`${attributionKey}\` is missing`)
      }
    }
  }
  if (problems.length && typeof console !== 'undefined' && import.meta.env?.DEV) {
    console.warn(
      `[spotSchema] ${problems.length} unattributed founder field(s) in ${label}:\n  ` +
        problems.join('\n  ') +
        '\n  A founder field with no named author cannot be told apart from generated copy.'
    )
  }
  return problems
}

/* True when a place carries anything from a founder. Used by the render to
 * decide whether a founder block exists at all — NOT to display a count of how
 * many do, which is completeness accounting and is banned. */
export const hasFounderVoice = (p) =>
  FOUNDER_FIELDS.some((f) => p && p[f] !== null && p[f] !== undefined && p[f] !== '')

/* True when a place carries researched consensus worth rendering. An entry
 * with sources but no summary is not ready and renders nothing. */
export const hasResearchLayer = (p) => Boolean(p && p.publicConsensus && p.publicConsensus.summary)
