/* THE TWO-LAYER PLACE CARD — founder voice and researched consensus, rendered
 * so they can never be mistaken for each other.
 *
 * Promoted from /peru, where the pattern was proven, into a shared component
 * so every framework inherits it instead of reimplementing it. San Juan is the
 * first framework built on this from day one; the existing ten gain it as
 * Brady's notes land.
 *
 * ⛔ THE RULE THIS COMPONENT EXISTS TO ENFORCE. The founder layer is gold,
 * forward, and attributed to a person. The research layer is copper, quieter,
 * indented behind a left border, and labelled as the public's opinion on every
 * single render. A reader who skims must still be able to tell which of the
 * two they are reading, because the entire product is the difference between
 * them.
 *
 * ⛔ SILENCE OVER PADDING. Every block below returns null when its content is
 * absent. Nothing says "no note from the Lads on this one", nothing greys out,
 * nothing holds space. Brady ruled this on /peru: absence is never announced,
 * because a reader has no use for our progress bar.
 */
import React from 'react'
import { hasFounderVoice, hasResearchLayer } from './data/spotSchema'
import { resolveBooking, isBookingEndorsed } from './utils/affiliate'
import './PlaceLayers.css'

/* ===== THE FOUNDER LAYER =====
 *
 * `owns` comes from quoteOwnership(). When one founder sentence is attached to
 * several places, exactly one prints it and the others point at the owner —
 * printing it twice double-counts a single endorsement.
 */
export function FounderLayer({ place, owns = true, holder = null }) {
  if (!place || !hasFounderVoice(place)) return null

  const showQuote = Boolean(place.ladsTake) && owns
  const echoesElsewhere = Boolean(place.ladsTake) && !owns

  /* A place whose only founder field is a rating gets the chip and nothing
     else — no empty quote frame waiting to be filled. */
  if (!showQuote && !echoesElsewhere && !place.story && !place.forWho && !place.ladsRating) {
    return null
  }

  return (
    <div className="pl-founder">
      <div className="pl-founder-rail" aria-hidden="true" />
      <div className="pl-founder-body">
        {showQuote && <p className="pl-founder-take">{place.ladsTake}</p>}

        {place.story && <p className="pl-founder-story">{place.story}</p>}

        {place.forWho && (
          <p className="pl-founder-forwho">
            <span className="pl-k">Who it&rsquo;s for</span>
            {place.forWho}
          </p>
        )}

        {/* The attribution is the enforcement made visible. An unattributed
            founder line cannot be told apart from generated copy, so the name
            is not decoration. ⛔ Never print the source `medium` — on /peru it
            resolved to "Brady, direct to Claude Code in session", which is our
            paperwork, not their reading. */}
        {(showQuote || place.story) && place.ladsTakeBy && (
          <div className="pl-founder-by">{place.ladsTakeBy}</div>
        )}

        {/* Honest, one line, and cheap: says where the words actually print
            rather than silently dropping a sentence a reader may have seen. */}
        {echoesElsewhere && holder && (
          <p className="pl-founder-echo">Written about under {holder.name}.</p>
        )}
      </div>
    </div>
  )
}

/* ===== THE RESEARCH LAYER =====
 *
 * What the public says. Labelled as theirs on every render, sourced on every
 * entry, and visually subordinate to the founder layer above it.
 *
 * ⛔ An empty `criticized` renders NOTHING rather than "no complaints found",
 * which would be an endorsement we never made. Genuinely thin research says
 * "limited coverage" out loud instead of being padded into confidence.
 */
export function ResearchLayer({ place }) {
  if (!place || !hasResearchLayer(place)) return null

  const c = place.publicConsensus
  const sources = place.consensusSources || []
  const praised = c.praised || []
  const criticized = c.criticized || []
  const practical = c.practical || []
  const thin = c.thin || (sources.length > 0 && sources.length < 2)

  return (
    <div className="pl-research">
      <div className="pl-research-head">
        <span className="pl-research-label">What people say</span>
        {thin && <span className="pl-research-thin">Limited coverage</span>}
      </div>

      <p className="pl-research-summary">{c.summary}</p>

      {(praised.length > 0 || criticized.length > 0) && (
        <div className="pl-research-cols">
          {praised.length > 0 && (
            <div className="pl-research-col pl-research-col--up">
              <span className="pl-k">Praised</span>
              <ul>
                {praised.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
          )}
          {criticized.length > 0 && (
            <div className="pl-research-col pl-research-col--down">
              <span className="pl-k">Criticised</span>
              <ul>
                {criticized.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {practical.length > 0 && (
        <ul className="pl-research-practical">
          {practical.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      )}

      {/* A consensus claim with no resolvable source does not ship, so the
          sourcing line is not optional chrome — it is the claim's warrant. */}
      {sources.length > 0 && (
        <div className="pl-research-src">
          <span className="pl-k">Sources</span>
          {sources.map((s, i) => (
            <a
              key={i}
              className="pl-research-srclink"
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {s.title || s.kind}
            </a>
          ))}
          {place.enrichedOn && (
            <span className="pl-research-checked">Checked {place.enrichedOn}</span>
          )}
        </div>
      )}
    </div>
  )
}

/* ===== CLOSURE =====
 *
 * A place that cannot be visited right now, stated where a reader will
 * actually see it rather than buried in a tips field.
 *
 * ⛔ SELF-EXPIRING BY CONSTRUCTION. `until` is compared against today on every
 * render, exactly like `datedUntil` on timing windows. A closure that has
 * passed stops rendering on its own — nobody has to remember to remove it, and
 * the site cannot end up warning visitors away from somewhere that reopened
 * months ago. That failure has the same shape as Iceland's dead eclipse
 * window, which read "already booked, avoid" for weeks after the eclipse.
 *
 * The inverse matters just as much: while a closure is live, the card must not
 * print normal opening hours underneath it. Dublin Castle recorded its own
 * closure in `wayToSave` and went on advertising "Daily 9:45am-5:45pm".
 */
export function isClosedNow(place, today = new Date().toISOString().slice(0, 10)) {
  const c = place && place.closure
  if (!c) return false
  if (c.from && today < c.from) return false
  if (c.until && today > c.until) return false
  return true
}

/* ISO is how the data stores a date and how it must be COMPARED, but it is not
 * how a reader reads one. "Closed until 2026-12-31" is a database row; "Closed
 * until Dec 31, 2026" is a sentence. Parsed as UTC so the rendered day cannot
 * slip backwards for a viewer west of Greenwich. */
const READABLE_DATE = (iso) => {
  if (!iso) return ''
  const d = new Date(iso + 'T00:00:00Z')
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

export function ClosureNotice({ place, today }) {
  if (!isClosedNow(place, today)) return null
  const c = place.closure
  return (
    <div className="pl-closure" role="note">
      <span className="pl-closure-k">
        Closed{c.until ? ` until ${READABLE_DATE(c.until)}` : ''}
        {c.reason ? ` · ${c.reason}` : ''}
      </span>
      {c.detail}
    </div>
  )
}

/* ===== THE TRAP =====
 *
 * The most useful line on most cards, so it is the one part of the research
 * layer allowed to be loud. It is still research, not a founder claim.
 */
export function TheTrap({ place }) {
  if (!place || !place.theTrap) return null
  return (
    <div className="pl-trap">
      <span className="pl-trap-k">The trap</span>
      {place.theTrap}
    </div>
  )
}

/* ===== BEST TIME =====
 *
 * Ships only WITH its reasoning. A timing claim that cannot say why it is true
 * is the Iceland eclipse window waiting to happen: correct when typed, false
 * later, and nothing in the data able to notice.
 */
export function BestTime({ place }) {
  if (!place || !place.bestTime || place.bestTime === 'any') return null

  /* 176 of the 220 published places already carry a bare `bestTime`, and
     FrameworkPage already renders it as a compact chip in the meta row. This
     block is the ENRICHED form and deliberately does not fire without a
     reason: rendering it for a bare value would duplicate the chip on 176
     cards and gain the reader nothing. When the research pass attaches the
     why, the fuller line appears. */
  if (!place.bestTimeWhy) return null

  return (
    <p className="pl-besttime">
      <span className="pl-k">Best time</span>
      {place.bestTime}
      <span className="pl-besttime-why"> &middot; {place.bestTimeWhy}</span>
    </p>
  )
}

/* ===== NEARBY =====
 *
 * Computed from stored coordinates, never geocoded from a name. The Tivoli
 * rule: resolving "Tivoli" returned Copenhagen, and a Rome page nearly shipped
 * a link to Denmark.
 */
export function Nearby({ place }) {
  if (!place || !Array.isArray(place.nearby) || place.nearby.length === 0) return null
  return (
    <p className="pl-nearby">
      <span className="pl-k">Nearby</span>
      {place.nearby.map((n) => (typeof n === 'string' ? n : n.name)).join(' · ')}
    </p>
  )
}

/* ===== COLLECTIVE TAKE =====
 *
 * One founder statement about a SET of places, rendered once, above or beside
 * the set it describes.
 *
 * ⛔ NEVER SPLIT THIS PER PLACE. "All of the restaurants were as good as
 * advertised" is a sentence about a group. Slicing it into per-restaurant
 * blurbs manufactures a firsthand opinion about a specific place that the
 * founder never gave — and it looks like an improvement while you do it.
 */
export function CollectiveTake({ take }) {
  if (!take || !take.text) return null
  return (
    <div className="pl-collective">
      <div className="pl-collective-k">One statement about a set &middot; {take.scope}</div>
      <blockquote className="pl-collective-text">{take.text}</blockquote>
      {take.framing && <div className="pl-collective-frame">{take.framing}</div>}
      <div className="pl-collective-by">{take.by}</div>
    </div>
  )
}

/* ===== THE BOOKING CTA =====
 *
 * Added September 24, 2026, and the reason is structural rather than
 * cosmetic. Before today `bookingUrl` rendered at EXACTLY ONE place in the
 * whole codebase — inside the `dayTrips` block of FrameworkPage — which
 * meant affiliate coverage on the 220 framework PLACES was not "low", it was
 * architecturally impossible. No amount of adding links to data files could
 * have changed it. October's 100% coverage goal needed a component, and this
 * is the component.
 *
 * ⛔ THE GRADIENT IS NOT DECORATION. Gold + "WE DID THIS" is a claim that a
 * founder personally did the thing being sold. It renders ONLY where
 * `ladsRating` supplies the evidence. Everything else renders as a neutral
 * outline that says "Book this tour" and claims nothing. Since no framework
 * spot carries a rating today, every place-level link below is neutral by
 * construction — and that is the honest starting state.
 *
 * ⛔ The href is never taken from the data unchanged. `resolveBooking()` tags
 * it, names the platform from the host, and refuses anything that is not an
 * approved partner — so an untagged paste cannot reach a reader.
 */
export function BookingCTA({ place, className = 'pl-book' }) {
  if (!place) return null

  const booking = resolveBooking(place.bookingUrl)
  if (!booking) return null

  const endorsed = isBookingEndorsed(place)

  return (
    <a
      href={booking.href}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={`${className}${endorsed ? ` ${className}--endorsed` : ''}`}
    >
      {endorsed ? (
        <>
          <span className={`${className}-flag`}>WE DID THIS</span>
          Book on {booking.platform} &rarr;
        </>
      ) : (
        <>Book this tour &rarr;</>
      )}
    </a>
  )
}
