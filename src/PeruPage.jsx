import React, { useEffect, useRef, useState, useCallback, lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Nav } from './App'
import Footer from './Footer'
import {
  PERU_SOURCE,
  PERU_PLACES,
  PERU_SAVED_SOURCE,
  PERU_SAVED_PLACES,
  GOOGLE_LISTING,
  LADS_COLLECTIVE_TAKE,
  BRADY_TAKE_SOURCE,
  PERU_TIMING_WINDOWS,
  PERU_FARE_INTELLIGENCE,
} from './data/peru'
import { FARE_SOURCES } from './data/fareIntelligence.js'
import { TOTAL_SPOTS } from './utils/siteStats'
import './PeruPage.css'

/* ============================================================================
 * PERU — THE STANDARD-SETTER. Page shell + motion language.
 * ============================================================================
 *
 * This is the page every later framework copies, so the rules it obeys matter
 * more than the pixels. Four of them govern almost every line below.
 *
 * 1. NOTHING HERE WAS WRITTEN FOR A PLACE. Brady spoke about eight distinct
 *    things on Aug 28 2026 and that is the entire personal layer of this page.
 *    Sixteen of the saved places carry no note from him and they render with
 *    no description, no tagline and no researched blurb standing in for one.
 *    A researched sentence in a Lads card reads as firsthand, which is exactly
 *    why it is not here.
 *
 * 2. NO NUMBER IN THIS FILE IS TYPED. Every count is walked out of the data at
 *    module load. `src/utils/derive.js`'s walkSpots is deliberately NOT the
 *    tool for it here: that walker only counts objects carrying `description`
 *    or `notes`, and peru.js uses `note` on purpose so that day anchors and
 *    silent places cannot move a canonical total. Counting them with the site
 *    walker would quietly break that. The site-wide total IS imported, and
 *    used to say out loud that Peru is not in it.
 *
 * 3. THE MAP IS NOT OURS. `PeruMap.jsx` is a stub owned by another lane. The
 *    shell reserves the box and lazy-loads the component behind a skeleton, so
 *    the real map drops in with zero layout shift and no edit to this file.
 *
 * 4. EVERY ANIMATION HAS A STATIC FALLBACK. Motion here is native
 *    IntersectionObserver adding `.visible`, the repo's Reveal pattern, plus
 *    CSS keyframes for the hero. There are no scroll listeners, because a
 *    scroll handler running layout maths on every frame is what makes a long
 *    page stutter on a mid-range phone. `prefers-reduced-motion` is handled in
 *    BOTH places: the CSS neutralises every transition and keyframe, and the
 *    hook skips the observer entirely and marks content visible on mount, so
 *    a reader who never scrolls past a section still sees all of it.
 * ========================================================================= */

const PeruMap = lazy(() => import('./PeruMap'))

/* ===== MOTION PRIMITIVES ================================================= */

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

/* The repo's Reveal, with two additions this page needs: a reduced-motion
 * bail-out that marks the element visible immediately, and an `onReveal`
 * callback so the trek rail can light itself as days arrive. The callback is
 * held in a ref so passing an inline arrow never re-runs the observer. */
function useReveal({ threshold = 0.14, onReveal } = {}) {
  const ref = useRef(null)
  const cb = useRef(onReveal)
  /* Written in an effect, not during render. Assigning to a ref while
     rendering is what react-hooks/refs exists to catch, and the effect runs
     before the observer's effect below on every commit anyway. */
  useEffect(() => {
    cb.current = onReveal
  })

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined') {
      el.classList.add('visible')
      if (cb.current) cb.current()
      return
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        el.classList.add('visible')
        if (cb.current) cb.current()
        obs.unobserve(el)
      },
      { threshold, rootMargin: '0px 0px -6% 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])

  return ref
}

function Reveal({
  children,
  as: Tag = 'div',
  variant = 'rise',
  delay = 0,
  className = '',
  ...rest
}) {
  const ref = useReveal()
  const style = delay ? { transitionDelay: `${delay}ms` } : undefined
  return (
    <Tag
      ref={ref}
      className={`peru-r peru-r--${variant} ${className}`.trim()}
      style={style}
      {...rest}
    >
      {children}
    </Tag>
  )
}

/* THE PULL QUOTE — the founder-voice treatment, and the only place on this
 * page where a first-person sentence is allowed to appear. It carries the
 * speaker and the date the words were captured, both read off
 * BRADY_TAKE_SOURCE rather than typed, so a quote can never drift loose from
 * its provenance. */
function PullQuote({ text, subject, variant = 'inline' }) {
  const ref = useReveal({ threshold: 0.2 })
  return (
    <figure ref={ref} className={`peru-r peru-r--quote peru-quote peru-quote--${variant}`}>
      <span className="peru-quote-rule" aria-hidden="true" />
      <blockquote className="peru-quote-text">{text}</blockquote>
      <figcaption className="peru-quote-by">
        {BRADY_TAKE_SOURCE.medium.split(',')[0]}
        <span className="peru-quote-sep" aria-hidden="true">
          /
        </span>
        <span className="peru-quote-date">recorded {BRADY_TAKE_SOURCE.capturedAt}</span>
        {subject ? <span className="peru-quote-subject">on {subject}</span> : null}
      </figcaption>
    </figure>
  )
}

/* ===== DERIVED FIGURES ===================================================
 * Everything the page prints about our own data is computed here, once, at
 * module load. If a number appears on screen and is not in this block, it
 * came out of the data file verbatim as provenance. */

const DAY_ANCHORS = PERU_PLACES.slice().sort((a, b) => a.day - b.day)
const ANCHOR_COUNT = DAY_ANCHORS.length
const PERU_ARC_DAYS = DAY_ANCHORS.filter((d) => d.inPeruArc).length
const FLAGGED_ANCHORS = DAY_ANCHORS.filter((d) => d.flagged).length
const MEDIA_PHOTOS = DAY_ANCHORS.reduce((n, d) => n + (d.photos || 0), 0)
const MEDIA_VIDEOS = DAY_ANCHORS.reduce((n, d) => n + (d.videos || 0), 0)

const SAVED_COUNT = PERU_SAVED_PLACES.length
const WITH_VOICE = PERU_SAVED_PLACES.filter((p) => p.ladsTake).length
const SILENT = SAVED_COUNT - WITH_VOICE
const OFFICE_RECORDS = PERU_SAVED_PLACES.filter((p) => p.recordIsOffice).length
const WITH_GOOGLE = PERU_SAVED_PLACES.filter((p) => GOOGLE_LISTING[p.name]).length

/* WHO OWNS EACH QUOTE. Brady's ATV sentence is attached to two entries: the
 * Cusco operator record for Red Valley, and Vinicunca itself. Printing it
 * twice would read as a bug and would double-count a single endorsement, so
 * each distinct sentence is rendered exactly once.
 *
 * The tie-break is not "first in the array" — that would hand the quote to the
 * operator record, whose Google coordinate is an office in downtown Cusco
 * about 100 km from the mountain. A quote belongs to the experience, so a
 * non-office entry always wins ownership. The other entry says where its words
 * are printed instead, which is honest and takes up one line. */
const QUOTE_OWNER = (() => {
  const owner = new Map()
  for (const p of PERU_SAVED_PLACES) {
    if (!p.ladsTake) continue
    const held = owner.get(p.ladsTake)
    if (!held || (held.recordIsOffice && !p.recordIsOffice)) owner.set(p.ladsTake, p)
  }
  return owner
})()
const DISTINCT_VOICE = QUOTE_OWNER.size
const ownsQuote = (p) => Boolean(p.ladsTake) && QUOTE_OWNER.get(p.ladsTake) === p

/* Grouped by the real `area` values in the data, in first-appearance order.
 * No area was renamed, merged or invented to make the grid tidier. */
const AREAS = (() => {
  const m = new Map()
  for (const p of PERU_SAVED_PLACES) {
    if (!m.has(p.area)) m.set(p.area, [])
    m.get(p.area).push(p)
  }
  return Array.from(m, ([area, places]) => ({ area, places }))
})()

const LIVE_WINDOWS = (() => {
  const today = new Date().toISOString().slice(0, 10)
  return PERU_TIMING_WINDOWS.filter((w) => !w.datedUntil || w.datedUntil >= today)
})()

const DRIVER_LABELS = {
  weather: 'WEATHER',
  events: 'EVENTS',
  pricing: 'PRICING',
  logistics: 'ACCESS',
}

const MONTHS = [
  ['JAN', 'January'],
  ['FEB', 'February'],
  ['MAR', 'March'],
  ['APR', 'April'],
  ['MAY', 'May'],
  ['JUN', 'June'],
  ['JUL', 'July'],
  ['AUG', 'August'],
  ['SEP', 'September'],
  ['OCT', 'October'],
  ['NOV', 'November'],
  ['DEC', 'December'],
]

const SECTIONS = [
  { id: 'peru-route', label: 'The Route' },
  { id: 'peru-when', label: 'When To Go' },
  { id: 'peru-getting-there', label: 'Getting There' },
  { id: 'peru-trek', label: 'The Trek' },
  { id: 'peru-places', label: 'The Places' },
  { id: 'peru-differently', label: 'Differently' },
]

const fmt = (n) => n.toLocaleString('en-US')

/* ===== 1. HERO — THE ARRIVAL ============================================= */

function Hero() {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    /* One frame, so the browser paints the pre-animation state first and the
     * arrival actually plays. Under reduced motion the class still lands and
     * the CSS simply has nothing to animate. */
    const id = window.requestAnimationFrame(() => setReady(true))
    return () => window.cancelAnimationFrame(id)
  }, [])

  return (
    <header className={`peru-hero${ready ? ' is-ready' : ''}`}>
      {/* THE IMAGE SLOT. No photograph is wired yet, and the box is reserved
          at a fixed aspect ratio so dropping one in shifts nothing. The
          gradient is not standing in for a picture of Peru; it is an empty
          frame that says so. */}
      <div className="peru-hero-media" aria-hidden="true">
        <div className="peru-hero-wash" />
        <span className="peru-hero-slot-note">HERO IMAGE PENDING</span>
      </div>

      <div className="peru-hero-inner">
        <Link to="/outdoors" className="peru-hero-back peru-hero-el">
          Back to Lads Outdoors
        </Link>
        <div className="peru-eyebrow peru-hero-el">SOUTH AMERICA / PERU</div>
        <h1 className="peru-hero-title peru-hero-el">
          Peru<span className="peru-hero-stop">.</span>
        </h1>
        <p className="peru-hero-lede peru-hero-el">
          Lima to the coast, the coast to Cusco, Cusco to the Salkantay corridor and out at Machu
          Picchu. Ten days in May 2026, walked by two of us. What follows is what the camera can
          prove, what Brady said out loud, and what Google says, kept apart on purpose.
        </p>

        <dl className="peru-hero-stats peru-hero-el">
          <div className="peru-stat">
            <dt>Day anchors</dt>
            <dd>{ANCHOR_COUNT}</dd>
          </div>
          <div className="peru-stat">
            <dt>Saved places</dt>
            <dd>{SAVED_COUNT}</dd>
          </div>
          <div className="peru-stat">
            <dt>In his words</dt>
            <dd>{DISTINCT_VOICE}</dd>
          </div>
          <div className="peru-stat">
            <dt>Frames behind it</dt>
            <dd>{fmt(MEDIA_PHOTOS + MEDIA_VIDEOS)}</dd>
          </div>
        </dl>

        <p className="peru-hero-foot peru-hero-el">
          Peru is not one of the {fmt(TOTAL_SPOTS)} spots the site counts today, and this page does
          not move that number. {SILENT} of the {SAVED_COUNT} places below carry no note from us at
          all. They are listed with what Google holds and nothing else.
        </p>
      </div>
    </header>
  )
}

/* ===== 2. THE ROUTE ====================================================== */

function RouteSection() {
  return (
    <section id="peru-route" className="peru-section peru-section--route">
      <Reveal variant="rise">
        <div className="peru-eyebrow">THE ROUTE</div>
        <h2 className="peru-h2">Every point on it is a place the camera was.</h2>
        <p className="peru-lede">
          {PERU_ARC_DAYS} of the {ANCHOR_COUNT} day anchors sit inside Peru. The first is a US
          departure day and is left off the line rather than stretched onto it. Coordinates come out
          of the camera, not out of a search box, which is why {FLAGGED_ANCHORS} of them carry a
          flag instead of a caption.
        </p>
      </Reveal>

      {/* THE RESERVED BOX. Its height is set by aspect-ratio at every
          breakpoint, so the skeleton, the stub and the finished map all occupy
          exactly the same space. */}
      <Reveal variant="map" className="peru-map-box">
        <Suspense
          fallback={
            <div className="peru-map-skeleton" role="status" aria-live="polite">
              <span className="peru-map-skeleton-shimmer" aria-hidden="true" />
              <span className="peru-map-skeleton-label">Drawing the route</span>
            </div>
          }
        >
          <PeruMap />
        </Suspense>
      </Reveal>

      <Reveal variant="fade">
        <p className="peru-note">
          Provenance: {PERU_SOURCE.label}. {PERU_SOURCE.note}
        </p>
      </Reveal>
    </section>
  )
}

/* ===== 3. WHEN TO GO ===================================================== */

function WhenToGo() {
  if (!LIVE_WINDOWS.length) return null

  return (
    <section id="peru-when" className="peru-section">
      <Reveal variant="rise">
        <div className="peru-eyebrow">WHEN TO GO</div>
        <h2 className="peru-h2">
          {LIVE_WINDOWS.length} windows, and the force that decides each one.
        </h2>
        <p className="peru-lede">
          Peru is the destination where the four drivers are genuinely four different things. A dry
          season set by weather. A festival on a fixed date. A fare curve. And a trail that closes
          every year whatever the sky is doing. Each card says which force is talking and how we
          arrived at it.
        </p>
      </Reveal>

      <div className="peru-window-grid">
        {LIVE_WINDOWS.map((w, i) => (
          <Reveal
            key={w.id}
            as="article"
            variant="rise"
            delay={i * 90}
            className={`peru-window${w.recommended ? ' peru-window--rec' : ''}`}
          >
            <div className="peru-window-chips">
              {w.driver && (
                <span className={`peru-chip peru-chip--${w.driver}`}>
                  {DRIVER_LABELS[w.driver] || w.driver.toUpperCase()}
                </span>
              )}
              {w.recommended && <span className="peru-chip peru-chip--rec">RECOMMENDED</span>}
            </div>

            <h3 className="peru-window-name">{w.name}</h3>
            {w.verdict && <p className="peru-window-verdict">{w.verdict}</p>}
            {w.primaryDraw && <p className="peru-window-draw">{w.primaryDraw}</p>}
            {w.detail && <p className="peru-window-detail">{w.detail}</p>}

            <dl className="peru-window-meta">
              {w.atmosphere && (
                <div>
                  <dt>Feel</dt>
                  <dd>{w.atmosphere}</dd>
                </div>
              )}
              {w.crowdMix && (
                <div>
                  <dt>Crowd</dt>
                  <dd>{w.crowdMix}</dd>
                </div>
              )}
              {w.priceTier && (
                <div>
                  <dt>Price</dt>
                  <dd>{w.priceTier}</dd>
                </div>
              )}
            </dl>

            {/* THE SOURCING LINE. Visible on every card, never folded away
                behind a toggle, and an empty source list is printed as an
                empty source list rather than dressed with a citation nobody
                checked. */}
            {w.sourcing && (
              <footer className="peru-sourcing">
                <span className="peru-sourcing-label">HOW WE GOT HERE</span>
                <span className="peru-sourcing-basis">{w.sourcing.basis}</span>
                <span className="peru-sourcing-meta">
                  {w.sourcing.checkedOn && <>Checked {w.sourcing.checkedOn}. </>}
                  {w.sourcing.sources && w.sourcing.sources.length ? (
                    <>
                      Sources:{' '}
                      {w.sourcing.sources.map((s, j) => (
                        <React.Fragment key={j}>
                          {j > 0 && '; '}
                          {typeof s === 'string' ? (
                            s
                          ) : (
                            <a href={s.url} target="_blank" rel="noopener noreferrer">
                              {s.label || s.url}
                            </a>
                          )}
                        </React.Fragment>
                      ))}
                      .
                    </>
                  ) : (
                    <em>No external citation recorded for this window.</em>
                  )}
                </span>
              </footer>
            )}
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* ===== 4. GETTING THERE ================================================== */

function GettingThere() {
  const fare = PERU_FARE_INTELLIGENCE
  if (!fare) return null

  const byMonth = {}
  ;(fare.seasonality || []).forEach((s) => s.months.forEach((m) => (byMonth[m] = s)))
  const anyBands = (fare.origins || []).some((o) => o.bands)
  const stale = fare.nextReviewDue && fare.nextReviewDue < new Date().toISOString().slice(0, 10)

  return (
    <section id="peru-getting-there" className="peru-section">
      <Reveal variant="rise">
        <div className="peru-eyebrow">GETTING THERE</div>
        <h2 className="peru-h2">The shape of the year, without a price we cannot stand behind.</h2>
        <p className="peru-lede">
          Relative tiers, month by month, from the Midwest airports we actually fly out of. The
          dollar bands are missing and the page says so, because researching Lima fares returned
          four different cheapest months from four vendors, none of them tied to an origin.
        </p>
      </Reveal>

      <Reveal variant="fade">
        <div className="peru-fare-strip" role="list" aria-label="Fare seasonality by month">
          {MONTHS.map(([short, full], i) => {
            const s = byMonth[i + 1]
            const tier = s?.tier || 'unknown'
            return (
              <div
                key={short}
                role="listitem"
                className={`peru-fare-month peru-fare-month--${tier}`}
                title={s ? `${full}: ${tier}. ${s.note || ''}` : full}
              >
                <span className="peru-fare-month-abbr">{short}</span>
                <span className="peru-fare-month-tier">{tier}</span>
              </div>
            )
          })}
        </div>
        <div className="peru-fare-key">
          <span>
            <i className="peru-dot peru-dot--low" /> Low
          </span>
          <span>
            <i className="peru-dot peru-dot--shoulder" /> Shoulder
          </span>
          <span>
            <i className="peru-dot peru-dot--peak" /> Peak
          </span>
        </div>
      </Reveal>

      <div className="peru-fare-grid">
        <Reveal variant="rise" className="peru-card">
          <div className="peru-card-label">FROM THE MIDWEST</div>
          <ul className="peru-origins">
            {(fare.origins || []).map((o) => (
              <li key={o.airport}>
                <span className="peru-iata">{o.airport}</span>
                <span className="peru-origin-city">{o.city}</span>
                <span className="peru-origin-band">
                  {o.bands ? o.bands : <em>no sourced band yet</em>}
                </span>
                {o.note && <span className="peru-origin-note">{o.note}</span>}
              </li>
            ))}
          </ul>
          {!anyBands && (
            <p className="peru-gap">
              <strong>The dollar bands are deliberately absent.</strong> Nobody has pulled real
              fares from these airports, so there is no band to print. The shape of the year is
              research we can defend. A number would not be.
            </p>
          )}
        </Reveal>

        <Reveal variant="rise" delay={90} className="peru-card">
          <div className="peru-card-label">WHAT PATIENCE IS WORTH</div>
          <p className="peru-card-text">{fare.patienceSaves}</p>
        </Reveal>
      </div>

      <Reveal variant="fade">
        <footer className="peru-sourcing peru-sourcing--wide">
          <span className="peru-sourcing-label">HOW WE GOT HERE</span>
          <span className="peru-sourcing-basis">{fare.basis}</span>
          <span className="peru-sourcing-meta">
            Checked {fare.checkedOn}.{' '}
            {fare.refreshCadence && (
              <>
                Reviewed {fare.refreshCadence}; next due {fare.nextReviewDue}.{' '}
              </>
            )}
            {stale && <strong className="peru-stale">This record is past its review date. </strong>}
            {!!(fare.sourcedFrom || []).length && (
              <>
                Sources:{' '}
                {fare.sourcedFrom.map((id, i) => {
                  const src = FARE_SOURCES[id]
                  if (!src) return null
                  return (
                    <React.Fragment key={id}>
                      {i > 0 && '; '}
                      <a href={src.url} target="_blank" rel="noopener noreferrer">
                        {src.label}
                      </a>
                    </React.Fragment>
                  )
                })}
                .
              </>
            )}
          </span>
        </footer>
      </Reveal>
    </section>
  )
}

/* ===== 5. THE TREK ======================================================= */

function TrekDay({ anchor, index, onLit }) {
  const lit = useCallback(() => onLit(index), [index, onLit])
  const ref = useReveal({ threshold: 0.25, onReveal: lit })

  const outsideArc = anchor.inPeruArc === false

  return (
    <li
      ref={ref}
      className={`peru-r peru-r--day peru-day${anchor.flagged ? ' peru-day--flagged' : ''}${
        outsideArc ? ' peru-day--outside' : ''
      }`}
    >
      <span className="peru-day-node" aria-hidden="true" />
      <div className="peru-day-body">
        <div className="peru-day-head">
          <span className="peru-day-num">Day {anchor.day}</span>
          <span className="peru-day-date">{anchor.date}</span>
          {outsideArc && <span className="peru-chip peru-chip--quiet">OUTSIDE PERU</span>}
          {anchor.flagged && <span className="peru-chip peru-chip--flag">LABEL DISPUTED</span>}
        </div>

        <h3 className="peru-day-name">{anchor.name}</h3>

        <div className="peru-day-coord">
          <span className="peru-day-coord-val">
            {anchor.lat}, {anchor.lng}
          </span>
          <span className="peru-day-coord-src">
            {anchor.coordSource}
            {anchor.coordPrecision ? ` / ${anchor.coordPrecision}` : ''}
          </span>
        </div>

        {anchor.note && <p className="peru-day-note">{anchor.note}</p>}

        <div className="peru-day-foot">
          <span className="peru-day-manifest">
            <span className="peru-day-manifest-label">MANIFEST HEADING</span>
            {anchor.manifestLabel}
          </span>
          <span className="peru-day-media">
            {anchor.photos} photos / {anchor.videos} clips
          </span>
        </div>
      </div>
    </li>
  )
}

function Trek() {
  const [lit, setLit] = useState(0)
  const onLit = useCallback((i) => setLit((n) => Math.max(n, i + 1)), [])
  const pct = ANCHOR_COUNT ? Math.round((lit / ANCHOR_COUNT) * 100) : 0

  return (
    <section id="peru-trek" className="peru-section">
      <Reveal variant="rise">
        <div className="peru-eyebrow">THE TREK</div>
        <h2 className="peru-h2">Ten days, read off the camera rather than off an itinerary.</h2>
        <p className="peru-lede">
          Every coordinate below was lifted from the location tag the camera wrote at the moment of
          capture. That proves where Brady stood and on what day. It proves nothing about any hostel
          or guide or restaurant, so none appear here. Where the manifest heading and the coordinate
          disagree, the coordinate wins and the heading is kept beside it as a record. That happened{' '}
          {FLAGGED_ANCHORS} times.
        </p>
      </Reveal>

      <div className="peru-trek-wrap">
        {/* The rail fills as days arrive. It is driven by the same observers
            that reveal the cards, not by a scroll handler, so it costs nothing
            per frame. Under reduced motion every day reports in on mount and
            the rail is simply full. */}
        <div className="peru-rail" aria-hidden="true">
          <span className="peru-rail-fill" style={{ height: `${pct}%` }} />
        </div>
        <ol className="peru-days">
          {DAY_ANCHORS.map((a, i) => (
            <TrekDay key={`${a.day}-${a.name}`} anchor={a} index={i} onLit={onLit} />
          ))}
        </ol>
      </div>

      <Reveal variant="fade">
        <p className="peru-note">
          {fmt(MEDIA_PHOTOS)} photographs and {fmt(MEDIA_VIDEOS)} clips sit behind these ten
          anchors. {PERU_SOURCE.media}.
        </p>
      </Reveal>
    </section>
  )
}

/* ===== 6. THE PLACES ===================================================== */

function GoogleLine({ listing }) {
  if (!listing) return null
  return (
    <div className="peru-google">
      <span className="peru-google-label">GOOGLE&rsquo;S LISTING</span>
      <span className="peru-google-body">
        {listing.category}
        {typeof listing.rating === 'number' && (
          <>
            <span className="peru-google-sep" aria-hidden="true">
              /
            </span>
            {/* One decimal always. Google's 5.0 printed as a bare "5" reads as
                a rounded number rather than the score Google actually shows. */}
            {listing.rating.toFixed(1)} from {fmt(listing.reviews)} Google reviews
          </>
        )}
        {listing.price && (
          <>
            <span className="peru-google-sep" aria-hidden="true">
              /
            </span>
            {listing.price}
          </>
        )}
      </span>
      <span className="peru-google-caveat">
        {listing.price ? (
          <>
            Google&rsquo;s numbers and Google&rsquo;s own price band. Not ours, and not a price we
            quote.
          </>
        ) : (
          <>Google&rsquo;s numbers, not ours.</>
        )}
      </span>
    </div>
  )
}

function PlaceCard({ place }) {
  const listing = GOOGLE_LISTING[place.name]
  const owns = ownsQuote(place)
  const echoesElsewhere = Boolean(place.ladsTake) && !owns
  const holder = echoesElsewhere ? QUOTE_OWNER.get(place.ladsTake) : null
  const silent = !place.ladsTake

  /* Three states, and the chip has to match what the card actually shows. An
     entry whose quote is printed under another entry must not wear "IN HIS
     WORDS" over a card with no words on it. */
  const tier = owns ? 'voice' : echoesElsewhere ? 'echo' : 'listed'
  const TIER_LABEL = { voice: 'IN HIS WORDS', echo: 'QUOTED ELSEWHERE', listed: 'ON THE LIST' }

  return (
    <article
      className={`peru-place${place.recordIsOffice ? ' peru-place--office' : ''}${
        silent ? ' peru-place--silent' : ''
      }`}
    >
      <header className="peru-place-head">
        <h4 className="peru-place-name">{place.name}</h4>
        <span className={`peru-tier peru-tier--${tier}`}>{TIER_LABEL[tier]}</span>
      </header>

      {place.fullName && place.fullName !== place.name && (
        <div className="peru-place-fullname">{place.fullName}</div>
      )}

      {/* THE OFFICE RECORDS. Google's pin for these two sits on a tour desk in
          central Cusco, roughly 100 km from the thing the entry is named
          after. Their coordinate is therefore not printed and they are not
          drawn as features. Saying so is more useful than hiding them. */}
      {place.recordIsOffice ? (
        <p className="peru-place-office">
          Google&rsquo;s record for this name is a tour operator&rsquo;s desk in central Cusco,
          around 100 km from the place it is named after. We do not print its coordinate and it is
          never drawn on the map as a feature. The endorsement is of the experience, not of the
          office.
        </p>
      ) : (
        <div className="peru-place-coord">
          {place.lat}, {place.lng}
          <span className="peru-place-coord-src">followed from the saved list, never searched</span>
        </div>
      )}

      {owns && <PullQuote text={place.ladsTake} variant="card" />}

      {echoesElsewhere && holder && (
        <p className="peru-place-echo">
          Brady&rsquo;s words about this cover the experience itself, and they are printed once,
          under {holder.name}.
        </p>
      )}

      <GoogleLine listing={listing} />

      {silent && <p className="peru-place-silent">No note from the Lads on this one.</p>}
    </article>
  )
}

function Places() {
  return (
    <section id="peru-places" className="peru-section">
      <Reveal variant="rise">
        <div className="peru-eyebrow">THE PLACES</div>
        <h2 className="peru-h2">
          {SAVED_COUNT} saved places, {DISTINCT_VOICE} of them spoken for.
        </h2>
        <p className="peru-lede">
          Brady pruned this list himself and said everything left on it is something the Lads would
          recommend. That is a curation statement, so every entry is validated. It is not a licence
          to write {SILENT} descriptions he never gave, so those {SILENT} entries carry
          Google&rsquo;s listing and nothing else. {WITH_GOOGLE} of the {SAVED_COUNT} have a Google
          listing at all, and {OFFICE_RECORDS} are operator records rather than places.
        </p>
      </Reveal>

      {/* THE GROUP STATEMENT, RENDERED ONCE. Brady said one sentence about a
          set of restaurants. Splitting it across the individual cards would
          manufacture a firsthand opinion for each of them out of a single
          remark about all of them, so it lives here, with its scope printed
          next to it. */}
      <Reveal variant="fade" className="peru-collective">
        <div className="peru-collective-scope">
          ONE STATEMENT ABOUT A SET / {LADS_COLLECTIVE_TAKE.scope}
        </div>
        <blockquote className="peru-collective-text">{LADS_COLLECTIVE_TAKE.text}</blockquote>
        <div className="peru-collective-frame">{LADS_COLLECTIVE_TAKE.framing}</div>
        <div className="peru-collective-by">
          {LADS_COLLECTIVE_TAKE.by}, recorded {LADS_COLLECTIVE_TAKE.capturedAt}. This covers the set
          and is never attached to any single place on it.
        </div>
      </Reveal>

      {AREAS.map((group, gi) => (
        <div key={group.area} className="peru-area">
          <Reveal variant="rise" delay={Math.min(gi, 3) * 60}>
            <div className="peru-area-head">
              <h3 className="peru-area-name">{group.area}</h3>
              <span className="peru-area-count">
                {group.places.length} {group.places.length === 1 ? 'place' : 'places'}
              </span>
            </div>
          </Reveal>
          <div className="peru-place-grid">
            {group.places.map((p, i) => (
              <Reveal key={p.placeId || p.name} variant="rise" delay={Math.min(i, 4) * 70}>
                <PlaceCard place={p} />
              </Reveal>
            ))}
          </div>
        </div>
      ))}

      <Reveal variant="fade">
        <p className="peru-note">
          Source: {PERU_SAVED_SOURCE.label}, owned by {PERU_SAVED_SOURCE.owner}, read{' '}
          {PERU_SAVED_SOURCE.capturedAt}. Every coordinate was read off Google&rsquo;s own record
          for a place Brady had already saved. No name was ever typed into a search box and the
          first result accepted.
        </p>
      </Reveal>
    </section>
  )
}

/* ===== 7. WHAT WE'D DO DIFFERENTLY ======================================= */

function Differently() {
  return (
    <section id="peru-differently" className="peru-section peru-section--last">
      <Reveal variant="rise">
        <div className="peru-eyebrow">WHAT WE&rsquo;D DO DIFFERENTLY</div>
        <h2 className="peru-h2">Empty, and staying empty until they write it.</h2>
        <p className="peru-lede">
          This is the section that separates a trip report from a framework: the parts the Lads got
          wrong, and what they would change on a second run. It is the hardest thing on the page to
          fake and the easiest thing to fake badly, so nothing goes in it that did not come from
          Brady or Dawson directly.
        </p>
      </Reveal>

      <Reveal variant="fade" className="peru-empty">
        <div className="peru-empty-rule" aria-hidden="true" />
        <p className="peru-empty-text">
          Nothing recorded yet. The frame is built and takes founder copy as soon as there is any.
        </p>
      </Reveal>
    </section>
  )
}

/* ===== PAGE ============================================================== */

export default function PeruPage() {
  const [active, setActive] = useState(null)

  useEffect(() => {
    if (!window.location.hash) window.scrollTo(0, 0)
  }, [])

  /* Which section the reader is in. One observer over the section elements,
   * no scroll handler. */
  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean)
    if (!els.length || typeof IntersectionObserver === 'undefined') return
    const obs = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (hit) setActive(hit.target.id)
      },
      { rootMargin: '-45% 0px -45% 0px' }
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  const jump = (id) => {
    const el = document.getElementById(id)
    if (!el) return
    el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
  }

  const description = `Peru, walked in May 2026. ${ANCHOR_COUNT} GPS day anchors, ${SAVED_COUNT} saved places of which ${SILENT} carry no note from us, ${LIVE_WINDOWS.length} travel windows with their sourcing printed, and a fare curve with no invented prices.`

  return (
    <>
      <Helmet>
        <title>Peru · The Lads Travel Co.</title>
        <meta name="description" content={description} />
        {/* NOINDEX ON PURPOSE. This is a shell: the map belongs to another
            lane, the hero has no photograph and the "what we would do
            differently" section is empty by design. It is not in the sitemap
            either. Both come off in the same pass, when the page is finished
            and a founder says it ships. */}
        <meta name="robots" content="noindex" />
        <link rel="canonical" href="https://ladstravel.com/peru" />
        <meta property="og:title" content="Peru · The Lads Travel Co." />
        <meta property="og:description" content={description} />
        <meta property="og:url" content="https://ladstravel.com/peru" />
        <meta property="og:type" content="website" />
      </Helmet>

      <Nav scrolled={true} />

      <main className="peru-page">
        <Hero />

        <nav className="peru-sectionnav" aria-label="Sections of this framework">
          <div className="peru-sectionnav-inner">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                type="button"
                className={`peru-pill${active === s.id ? ' is-active' : ''}`}
                onClick={() => jump(s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </nav>

        <RouteSection />
        <WhenToGo />
        <GettingThere />
        <Trek />
        <Places />
        <Differently />
      </main>

      <Footer />
    </>
  )
}
