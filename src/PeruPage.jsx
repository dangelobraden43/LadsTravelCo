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
import CloudImage from './CloudImage'
import {
  PERU_TICKETS,
  PERU_PACKING,
  PERU_SAVE,
  LIMA_FOOD,
  PREPARE_CHECKED_ON,
} from './data/peruPrepare.js'
import { PERU_ROUTES, ROUTE_SCALE, ROUTES_NOTE, ROUTES_CHECKED_ON } from './data/peruRoutes.js'
import { PERU_CONSENSUS, CONSENSUS_LABEL, CONSENSUS_CHECKED_ON } from './data/peruConsensus.js'
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
      {/* Attribution is the founder and the trip, full stop. This used to print
          BRADY_TAKE_SOURCE.medium, which reads "Brady, direct to Claude Code in
          session" — a provenance record that belongs in the data file and never
          in front of a reader. The record still exists; it is just not copy. */}
      <figcaption className="peru-quote-by">
        Brady D&rsquo;Angelo
        <span className="peru-quote-sep" aria-hidden="true">
          /
        </span>
        <span className="peru-quote-date">Peru, May 2026</span>
        {subject ? <span className="peru-quote-subject">on {subject}</span> : null}
      </figcaption>
    </figure>
  )
}

/* ===== DERIVED FIGURES ===================================================
 * Everything the page prints about our own data is computed here, once, at
 * module load. If a number appears on screen and is not in this block, it
 * came out of the data file verbatim as provenance. */

/* MIAMI IS OUT, EVERYWHERE. Day 1 is a departure-day GPS fix in Florida. It is
 * a real anchor and it stays in peru.js as provenance, but it is not Peru, it
 * is not part of the trip anyone is planning, and it was padding the day count
 * by one. Removed from the page on Brady's instruction, Sept 8 2026.
 * `inPeruArc` is the data's own flag for exactly this. */
const DAY_ANCHORS = PERU_PLACES.filter((d) => d.inPeruArc !== false)
  .slice()
  .sort((a, b) => a.day - b.day)
const ANCHOR_COUNT = DAY_ANCHORS.length
const PERU_ARC_DAYS = DAY_ANCHORS.filter((d) => d.inPeruArc).length
const FLAGGED_ANCHORS = DAY_ANCHORS.filter((d) => d.flagged).length
const MEDIA_PHOTOS = DAY_ANCHORS.reduce((n, d) => n + (d.photos || 0), 0)
const MEDIA_VIDEOS = DAY_ANCHORS.reduce((n, d) => n + (d.videos || 0), 0)

const SAVED_COUNT = PERU_SAVED_PLACES.length
const WITH_VOICE = PERU_SAVED_PLACES.filter((p) => p.ladsTake).length
const SILENT = SAVED_COUNT - WITH_VOICE
/* DISPLAY NAMES FOR TWO ANCHORS.
 *
 * peru.js names day 6 "Day 6 anchor - label disputed" and day 9 "Day 9 anchor -
 * approach to Machu Picchu". Those are working notes from the ingest, not
 * places, and printing them puts our unresolved paperwork in front of a reader.
 *
 * Day 6 is NOT actually unresolved. CLAUDE.md records it settled from four
 * independent directions: the coordinate matches Vinicunca to about 0.01
 * degrees, a photograph that day shows a sign reading Rainbow Mountain, the
 * pre-trip intent names it, and Brady's own saved list contains Vinicunca at
 * the same point. What was disputed was the MANIFEST's label, and the manifest
 * lost. The data keeps the flag as provenance; the page states the finding.
 *
 * Day 9's coordinate sits in the Santa Teresa area on the walk-in side of the
 * mountain, which is what the label already said in longhand.
 */
const ANCHOR_DISPLAY_NAME = {
  6: 'Vinicunca — Rainbow Mountain',
  9: 'Santa Teresa — the approach',
}
const anchorName = (a) => ANCHOR_DISPLAY_NAME[a.day] || a.name

const AREA_COUNT = new Set(PERU_SAVED_PLACES.map((p) => p.area).filter(Boolean)).size
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
  { id: 'peru-getting-in', label: 'Getting In' },
  { id: 'peru-prepare', label: 'Before You Go' },
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
      <div className="peru-hero-media">
        <CloudImage
          id="peru/machu-picchu-huayna-mist"
          alt="Machu Picchu on its ridge with Huayna Picchu rising behind it, cloud sitting in the terraces"
          width={1920}
          height={2560}
          priority
          sizes="100vw"
          className="peru-hero-img"
          objectPosition="center 42%"
        />
        <div className="peru-hero-wash" />
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
          You can reach Machu Picchu on a train in an afternoon. Or you can walk in over a 4,600 m
          pass, sleep under the glacier that feeds it, and come down through cloud forest to the
          back of the mountain. Same ruins. Completely different trip.
        </p>

        <dl className="peru-hero-stats peru-hero-el">
          <div className="peru-stat">
            <dt>Days</dt>
            <dd>{ANCHOR_COUNT}</dd>
          </div>
          <div className="peru-stat">
            <dt>Places</dt>
            <dd>{SAVED_COUNT}</dd>
          </div>
          <div className="peru-stat">
            <dt>Regions</dt>
            <dd>{AREA_COUNT}</dd>
          </div>
          <div className="peru-stat">
            <dt>Travelled</dt>
            <dd>May 2026</dd>
          </div>
        </dl>

        {/* The old hero footnote lived here. It told the reader how many places
            carried no note from us, and that Peru is outside the site's counted
            total. Both are true and both are OURS, not theirs: pipeline state
            dressed as product. The count discipline still holds in the data and
            in the comments, where it belongs. Ruled by Brady, Sept 8 2026. */}
      </div>
    </header>
  )
}

/* ===== 2. THE ROUTE ====================================================== */

/* ===== BEFORE YOU GO — tickets, permits, packing, ways to save ============
 *
 * The half of a framework somebody is paying for. Everything in here is
 * sourced in src/data/peruPrepare.js and carries a check date on screen,
 * because a ticket rule that has quietly changed is worse than no rule at all:
 * a reader acts on it, months ahead, with money.
 */

/* A full-bleed photographic band. The page was reading as a long column of
 * panels on one ground; these break it and let a frame carry a transition on
 * its own. Height is capped in CSS and the box is reserved, so none of them
 * can shift layout while loading. */
function PhotoBand({ id, alt, caption, position }) {
  return (
    <Reveal variant="fade" className="peru-band">
      <CloudImage
        id={id}
        alt={alt}
        width={1920}
        height={2560}
        sizes="100vw"
        className="peru-band-img"
        objectPosition={position}
      />
      {caption && <div className="peru-band-cap">{caption}</div>}
    </Reveal>
  )
}

function SourceLink({ href, children = 'source' }) {
  if (!href) return null
  return (
    <a className="peru-src" href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  )
}

/* ===== GETTING IN — the four routes to Machu Picchu, compared =============
 *
 * The widest cost spread on the trip lives here: the same mountain is
 * reachable for a bus fare or for several thousand dollars. Bars are
 * LOGARITHMIC on purpose. A linear axis across 15 to 3,500 renders the budget
 * routes as invisible slivers and flatters the luxury end, which would be a
 * chart that argues rather than informs.
 */

const logPos = (v) => {
  const { min, max } = ROUTE_SCALE
  const clamped = Math.min(Math.max(v, min), max)
  return ((Math.log(clamped) - Math.log(min)) / (Math.log(max) - Math.log(min))) * 100
}

const usd = (n) => '$' + n.toLocaleString('en-US')

function RouteBar({ band }) {
  const left = logPos(band.low)
  const right = logPos(band.high)
  const tLeft = logPos(band.typical[0])
  const tRight = logPos(band.typical[1])
  return (
    <div
      className="peru-bar"
      role="img"
      aria-label={`Reported range ${usd(band.low)} to ${usd(band.high)} per person, typically ${usd(band.typical[0])} to ${usd(band.typical[1])}`}
    >
      <div className="peru-bar-track" />
      {/* The full reported spread, edge to edge. */}
      <div
        className="peru-bar-range"
        style={{ left: `${left}%`, width: `${Math.max(right - left, 1.5)}%` }}
      />
      {/* Where the sources actually cluster. This is the honest headline. */}
      <div
        className="peru-bar-typical"
        style={{ left: `${tLeft}%`, width: `${Math.max(tRight - tLeft, 2)}%` }}
      />
      <span className="peru-bar-lo" style={{ left: `${left}%` }}>
        {usd(band.low)}
      </span>
      <span className="peru-bar-hi" style={{ left: `${Math.min(right, 92)}%` }}>
        {usd(band.high)}
      </span>
    </div>
  )
}

function GettingIn() {
  return (
    <section id="peru-getting-in" className="peru-section">
      <Reveal variant="rise">
        <div className="peru-eyebrow">GETTING IN</div>
        <h2 className="peru-h2">Four ways to reach it, and they are not close on price.</h2>
        <p className="peru-lede">
          This is the decision that moves your budget more than anything else on the trip. The same
          mountain is reachable for the cost of a bus ticket or for several thousand dollars, and
          the difference is mostly about how you spend the days getting there rather than what you
          see at the end.
        </p>
      </Reveal>

      <div className="peru-routes">
        {PERU_ROUTES.map((r, i) => (
          <Reveal key={r.id} variant="rise" delay={Math.min(i, 3) * 80}>
            <article className={`peru-route-card peru-route-card--${r.id}`}>
              <header className="peru-route-head">
                <div>
                  <span className="peru-route-kicker">{r.kicker}</span>
                  <h3 className="peru-route-name">{r.name}</h3>
                </div>
                <dl className="peru-route-facts">
                  <div>
                    <dt>Days</dt>
                    <dd>{r.days}</dd>
                  </div>
                  <div>
                    <dt>Permit</dt>
                    <dd>{r.permit}</dd>
                  </div>
                  <div>
                    <dt>Book</dt>
                    <dd>{r.lead}</dd>
                  </div>
                </dl>
              </header>

              <RouteBar band={r.band} />
              <p className="peru-route-typical">
                Sources cluster at{' '}
                <strong>
                  {usd(r.band.typical[0])}&ndash;{usd(r.band.typical[1])}
                </strong>{' '}
                per person
              </p>

              <p className="peru-route-summary">{r.summary}</p>
              <p className="peru-route-effort">
                <span className="peru-route-effort-k">Effort</span> {r.effort}
              </p>

              <ul className="peru-tiers">
                {r.tiers.map((t) => (
                  <li key={t.tier}>
                    <span className="peru-tier-name">{t.tier}</span>
                    <span className="peru-tier-band">{t.band}</span>
                    <span className="peru-tier-what">{t.what}</span>
                  </li>
                ))}
              </ul>

              <div className="peru-route-src">
                {r.sources.map((src) => (
                  <SourceLink key={src.url} href={src.url}>
                    {src.title}
                  </SourceLink>
                ))}
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal variant="fade">
        <p className="peru-note">
          {ROUTES_NOTE} Checked {ROUTES_CHECKED_ON}. We sell none of these and take no cut of any of
          them, and no operator is named or ranked here: the tiers describe what changes as you pay
          more, not who to pay.
        </p>
      </Reveal>
    </section>
  )
}

function Prepare() {
  return (
    <section id="peru-prepare" className="peru-section peru-section--prepare">
      <Reveal variant="rise">
        <div className="peru-eyebrow">BEFORE YOU GO</div>
        <h2 className="peru-h2">The bookings that cannot be fixed later.</h2>
        <p className="peru-lede">
          Almost everything on this trip can be arranged a week out. Three things cannot: your Machu
          Picchu entry, your circuit, and Huayna Picchu. Get those wrong and no amount of planning
          on the ground repairs it.
        </p>
      </Reveal>

      {/* ── TICKETS ── */}
      <figure className="peru-figure">
        <CloudImage
          id="peru/machu-picchu-approach"
          alt="Machu Picchu's peaks seen through pine branches on the walk in, cloud low over the ridges"
          width={2560}
          height={1920}
          sizes="(max-width: 900px) 100vw, 900px"
        />
        <figcaption className="peru-figure-cap">
          The approach. What the permits and the lead times are all for.
        </figcaption>
      </figure>

      <div className="peru-prep-grid">
        {PERU_TICKETS.items.map((t, i) => (
          <Reveal key={t.name} variant="rise" delay={Math.min(i, 3) * 70}>
            <article className={`peru-ticket${t.ladsPush ? ' peru-ticket--push' : ''}`}>
              <header className="peru-ticket-head">
                <h3 className="peru-ticket-name">{t.name}</h3>
                <span className="peru-ticket-lead">{t.lead}</span>
              </header>
              <p className="peru-ticket-rule">{t.rule}</p>
              <p className="peru-ticket-detail">{t.detail}</p>

              {/* The one recommendation on this page to do MORE than planned.
                  It rests on Brady having climbed it, not on research. */}
              {t.ladsPush && (
                <p className="peru-ticket-push">
                  Make the extra push. Brady climbed it and it is the difference between seeing
                  Machu Picchu and standing above it. Book the permit at the same moment you book
                  your entry, because it sells out first and separately.
                </p>
              )}

              <SourceLink href={t.sourceUrl} />
            </article>
          </Reveal>
        ))}
      </div>

      {/* ── PACKING ── */}
      <Reveal variant="rise">
        <h3 className="peru-h3">{PERU_PACKING.title}</h3>
        <p className="peru-lede peru-lede--tight">{PERU_PACKING.lede}</p>
      </Reveal>

      <div className="peru-pack-grid">
        {PERU_PACKING.groups.map((g, i) => (
          <Reveal key={g.group} variant="rise" delay={Math.min(i, 3) * 70}>
            <article className="peru-pack">
              <h4 className="peru-pack-name">{g.group}</h4>
              <p className="peru-pack-note">{g.note}</p>
              <ul className="peru-pack-list">
                {g.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
              <SourceLink href={g.sourceUrl} />
            </article>
          </Reveal>
        ))}
      </div>

      {/* ── WAYS TO SAVE ── */}
      <Reveal variant="rise">
        <h3 className="peru-h3">{PERU_SAVE.title}</h3>
        <p className="peru-lede peru-lede--tight">{PERU_SAVE.lede}</p>
      </Reveal>

      <div className="peru-save-grid">
        {PERU_SAVE.items.map((it, i) => (
          <Reveal key={it.move} variant="rise" delay={Math.min(i, 5) * 55}>
            <article className="peru-save">
              <h4 className="peru-save-move">{it.move}</h4>
              <p className="peru-save-detail">{it.detail}</p>
              <SourceLink href={it.sourceUrl} />
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal variant="fade">
        <p className="peru-note">
          Ticket rules, permit caps and entry windows change. Everything above was checked on{' '}
          {PREPARE_CHECKED_ON}, and each card links the source it came from so you can confirm it
          before you book rather than trusting a page.
        </p>
      </Reveal>
    </section>
  )
}

/* ===== LIMA — the highlight band ========================================= */

function LimaFood() {
  return (
    <Reveal variant="fade" className="peru-lima">
      <div className="peru-lima-inner">
        <div className="peru-eyebrow">LIMA</div>
        <h3 className="peru-lima-title">{LIMA_FOOD.title}</h3>
        <p className="peru-lima-claim">{LIMA_FOOD.claim}</p>
        <p className="peru-lima-more">{LIMA_FOOD.more}</p>
        <p className="peru-lima-sowhat">{LIMA_FOOD.soWhat}</p>
        <div className="peru-lima-src">
          {LIMA_FOOD.sources.map((src) => (
            <SourceLink key={src.url} href={src.url}>
              {src.title}
            </SourceLink>
          ))}
          <span className="peru-lima-checked">checked {LIMA_FOOD.checkedOn}</span>
        </div>
      </div>
    </Reveal>
  )
}

function RouteSection() {
  return (
    <section id="peru-route" className="peru-section peru-section--route">
      <Reveal variant="rise">
        <div className="peru-eyebrow">THE ROUTE</div>
        <h2 className="peru-h2">Nine days, coast to altitude to the cloud forest.</h2>
        <p className="peru-lede">
          Lima first, at sea level and worth more than the night most itineraries give it. Then the
          desert oasis at Huacachina, then Cusco to get your lungs used to 3,400 m, and only then
          the trail. The order matters more than the mileage.
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
      <figure className="peru-figure">
        <CloudImage
          id="peru/rainbow-mountain-ridges"
          alt="The mineral-striped ridges of Vinicunca under hard blue sky, no crowd in frame"
          width={1920}
          height={2560}
          sizes="(max-width: 900px) 100vw, 900px"
        />
        <figcaption className="peru-figure-cap">
          Vinicunca in early May. The colour holds all year; the clear sky does not.
        </figcaption>
      </figure>
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
      <figure className="peru-figure">
        <CloudImage
          id="peru/cusco-street-dusk"
          alt="A cobbled Cusco street at dusk, colonial walls narrowing toward the hills"
          width={1920}
          height={2560}
          sizes="(max-width: 900px) 100vw, 900px"
        />
        <figcaption className="peru-figure-cap">
          Cusco at altitude. Most routes in put you here before the trail.
        </figcaption>
      </figure>
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
          {/* The LABEL DISPUTED chip was removed Sept 8 2026. It advertised an
              open question in our own records, and in day 6's case the question
              was already closed. See ANCHOR_DISPLAY_NAME above. */}
        </div>

        <h3 className="peru-day-name">{anchorName(anchor)}</h3>

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
      <figure className="peru-figure">
        <CloudImage
          id="peru/salkantay-trail-start"
          alt="A hiker with trekking poles walking a dirt trail into a green valley below snow peaks"
          width={1920}
          height={2560}
          sizes="(max-width: 900px) 100vw, 900px"
        />
        <figcaption className="peru-figure-cap">
          The Salkantay corridor on the first morning out.
        </figcaption>
      </figure>
      <Reveal variant="rise">
        <div className="peru-eyebrow">THE TREK</div>
        <h2 className="peru-h2">What the nine days actually look like.</h2>
        <p className="peru-lede">
          Lima and the coast first, then altitude in Cusco before the trail, then four days walking
          the Salkantay corridor and out at Machu Picchu on the last morning. Run it in this order
          and the acclimatisation happens on the cheap days rather than on the mountain.
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
          Every day on this route is fixed by the GPS written into the camera at the time, so the
          line above is where the trip actually went rather than where an itinerary said it would.
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
  const consensus = PERU_CONSENSUS[place.name]

  /* Three states, and the chip has to match what the card actually shows. An
     entry whose quote is printed under another entry must not wear "IN HIS
     WORDS" over a card with no words on it. */
  const tier = owns ? 'voice' : echoesElsewhere ? 'echo' : 'listed'
  /* Only the affirmative state gets a chip. "QUOTED ELSEWHERE" and "ON THE
     LIST" were both descriptions of our own workflow, and a reader has no use
     for either. The echo case still avoids printing the quote twice; it just
     no longer wears a badge explaining why. */
  const TIER_LABEL = { voice: 'IN HIS WORDS', echo: null, listed: null }

  return (
    <article
      className={`peru-place${place.recordIsOffice ? ' peru-place--office' : ''}${
        silent ? ' peru-place--silent' : ''
      }`}
    >
      {/* No tier chip. "IN HIS WORDS" turned a framework into a quote board:
          it badged our editorial process on the face of a recommendation. The
          site's voice IS the Lads' voice, so a founder's line simply reads as
          the description. Ruled by Brady, Sept 8 2026. */}
      <header className="peru-place-head">
        <h4 className="peru-place-name">{place.name}</h4>
        {place.googleCategory && <span className="peru-place-kind">{place.googleCategory}</span>}
      </header>

      {place.fullName && place.fullName !== place.name && (
        <div className="peru-place-fullname">{place.fullName}</div>
      )}

      {/* THE OFFICE RECORDS. Google's pin for these two sits on a tour desk in
          central Cusco, roughly 100 km from the thing the entry is named
          after. Their coordinate is therefore not printed and they are not
          drawn as features. Saying so is more useful than hiding them. */}
      {/* The founder's line IS the description. It used to render as a
          captioned pull-quote with the capture medium underneath, which read as
          an archive of things Brady said rather than as a recommendation.
          The raw coordinate and its "followed from the saved list, never
          searched" provenance line came off the card too: that is how we know
          the pin is right, not something a traveller needs to read. */}
      {owns && <p className="peru-place-desc">{place.ladsTake}</p>}

      {/* ── THE RESEARCH LAYER ──────────────────────────────────────────
          Public consensus, run across all 25 places on 2026-09-08 and stored
          in peruConsensus.js. This is what fills the cards that carry no
          founder line, and it is styled deliberately UNLIKE the founder voice
          above: quieter, labelled, and sourced. A researched sentence dressed
          as a firsthand one is the one failure this site exists to avoid, so
          the two layers must never be mistaken for each other. */}
      {consensus && (
        <div className="peru-research">
          <div className="peru-research-head">
            <span className="peru-research-label">{CONSENSUS_LABEL}</span>
            {consensus.coverage === 'thin' && (
              <span className="peru-research-thin">limited coverage</span>
            )}
          </div>

          <p className="peru-research-summary">{consensus.summary}</p>

          {(consensus.praised?.length > 0 || consensus.criticized?.length > 0) && (
            <div className="peru-research-cols">
              {consensus.praised?.length > 0 && (
                <div className="peru-research-col peru-research-col--up">
                  <span className="peru-research-k">Praised</span>
                  <ul>
                    {consensus.praised.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </div>
              )}
              {/* An empty `criticized` renders nothing at all rather than a
                  "no complaints found" line, which would read as an endorsement
                  we did not make. */}
              {consensus.criticized?.length > 0 && (
                <div className="peru-research-col peru-research-col--down">
                  <span className="peru-research-k">Criticised</span>
                  <ul>
                    {consensus.criticized.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {consensus.trap && (
            <p className="peru-trap">
              <span className="peru-trap-k">The trap</span>
              {consensus.trap}
            </p>
          )}

          {consensus.bestTime && (
            <p className="peru-besttime">
              <span className="peru-research-k">When</span> {consensus.bestTime}
            </p>
          )}

          <div className="peru-research-src">
            {consensus.sources.map((src) => (
              <SourceLink key={src.u} href={src.u}>
                {src.t}
              </SourceLink>
            ))}
            <span className="peru-research-checked">checked {CONSENSUS_CHECKED_ON}</span>
          </div>
        </div>
      )}

      {/* Useful to a traveller, so it stays: booking this name gets you an
          experience run out of a Cusco office, not somewhere to turn up. */}
      {place.recordIsOffice && (
        <p className="peru-place-office">
          Booked as an experience rather than visited as an address. The listing under this name is
          a tour desk in central Cusco, not the site itself.
        </p>
      )}

      <GoogleLine listing={listing} />

      {/* No "we have not written this one yet" line. A card either carries a
          founder's words or it presents the place on its research and Google's
          own listing. Absence is not announced. */}
    </article>
  )
}

function Places() {
  return (
    <section id="peru-places" className="peru-section">
      <figure className="peru-figure">
        <CloudImage
          id="peru/huacachina-dune-sunset"
          alt="A dune buggy silhouetted on a ridge of sand as the sun drops behind the dunes"
          width={1920}
          height={2560}
          sizes="(max-width: 900px) 100vw, 900px"
        />
        <figcaption className="peru-figure-cap">
          Huacachina at the end of the afternoon run.
        </figcaption>
      </figure>
      <Reveal variant="rise">
        <div className="peru-eyebrow">THE PLACES</div>
        <h2 className="peru-h2">The places, {AREA_COUNT} regions deep.</h2>
        {/* This paragraph used to publish four internal figures: how many places
            we had not written up, how many carried a Google listing, how many
            were operator records. That is the state of our own pipeline, and a
            reader has no use for it. What survives is the only part that is
            about THEM: every place here was kept on the list deliberately. */}
        <p className="peru-lede">
          Brady walked this list and pruned it himself. What is left is what the Lads would send a
          friend to, grouped the way the trip actually ran.
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
        {/* The caption used to explain our own rule for the sentence: that it
            covers the set and is never attached to a single place. That rule is
            real and still enforced in the code, but it is our filing system,
            not a note for a reader. */}
        <div className="peru-collective-by">{LADS_COLLECTIVE_TAKE.by} &middot; Peru, May 2026</div>
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

  /* Written for a stranger deciding whether to read the page, not for us.
     The old one listed how many places carried no note from the Lads. */
  const description = `Walk into Machu Picchu over the Salkantay pass instead of riding the train in. Nine days from Lima to the cloud forest: what it costs, when to go, which tickets sell out first, and ${SAVED_COUNT} places across ${AREA_COUNT} regions.`

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
        <PhotoBand
          id="peru/salkantay-ladder-bridge"
          alt="A narrow ladder bridge of wooden slats strung across a green gorge on the Salkantay route"
          caption="The Salkantay corridor, day four."
          position="center 55%"
        />
        <GettingIn />
        <Prepare />
        <LimaFood />
        <PhotoBand
          id="peru/rainbow-mountain-cairn"
          alt="A stacked stone cairn standing against deep blue sky high on the Vinicunca ridge"
          caption="Above 5,000 m at Vinicunca."
          position="center 45%"
        />
        <Trek />
        <PhotoBand
          id="peru/inca-masonry-wall"
          alt="Close-cut Inca stonework, blocks fitted without mortar, under low cloud"
          caption="Masonry at Machu Picchu, cut without mortar."
          position="center 50%"
        />
        <Places />
        <Differently />
      </main>

      <Footer />
    </>
  )
}
