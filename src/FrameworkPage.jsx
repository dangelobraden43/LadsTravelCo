import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { SEO_DEFAULTS } from './utils/seo'
import Footer from './Footer'
import { FARE_SOURCES } from './data/fareIntelligence.js'
import './FrameworkPage.css'

/* ===== WHEN TO GO =====
 *
 * 9 of 10 frameworks have carried `timingWindows` since they were written and
 * NOTHING rendered them — roughly 24 windows of finished research shipped in
 * the bundle and reached nobody. This is the switch-on.
 *
 * THE DRIVER IS THE POINT. These windows were never one kind of thing: Munich's
 * are Oktoberfest weekend-vs-midweek, Spain's are seasons, Iceland's winter is
 * really about roads closing. Nothing in the data recorded which, so every
 * window read like a vague seasonal vibe. `driver` names the force, and a
 * window that cannot name one does not ship.
 *
 * ⛔ NO LADS VOICE IN HERE. A window explains the world; only a founder speaks
 * for the Lads. Same rule that keeps the 16 silent Peru places silent. */
const DRIVER_LABELS = {
  weather: 'WEATHER',
  events: 'EVENTS',
  pricing: 'PRICING',
  logistics: 'ACCESS',
}

function TimingWindows({ windows }) {
  /* datedUntil IS LOAD-BEARING, NOT DECORATION. Iceland's eclipse window sat
   * telling readers to avoid a month for a reason that expired three weeks
   * earlier, and it only escaped being an embarrassment because nothing
   * rendered. A dated window now removes itself the day it dies, with no
   * human in the loop. Compared as ISO strings, which sort correctly. */
  const today = new Date().toISOString().slice(0, 10)
  const live = (windows || []).filter((w) => !w.datedUntil || w.datedUntil >= today)
  if (!live.length) return null

  return (
    <section id="when-to-go" className="fw-section">
      <div className="fw-section-label">WHEN TO GO</div>
      <h2 className="fw-section-title">
        {live.length} {live.length === 1 ? 'Window' : 'Windows'}, and What Drives Each One
      </h2>
      <p className="fw-tw-lede">
        Every window says what force decides it &mdash; the weather, an event, the fare curve, or
        whether the roads are open at all. Where we have not recorded how a window was sourced, it
        says that too, rather than dressing it up.
      </p>

      <div className="fw-tw-grid">
        {live.map((w) => (
          <article key={w.id} className={`fw-tw-card${w.recommended ? ' fw-tw-card--rec' : ''}`}>
            <header className="fw-tw-head">
              <div className="fw-tw-chips">
                {w.driver && (
                  <span className={`fw-tw-chip fw-tw-chip--${w.driver}`}>
                    {DRIVER_LABELS[w.driver] || w.driver.toUpperCase()}
                  </span>
                )}
                {w.recommended && <span className="fw-tw-chip fw-tw-chip--rec">RECOMMENDED</span>}
              </div>
              <h3 className="fw-tw-name">{w.name}</h3>
              {w.verdict && <div className="fw-tw-verdict">{w.verdict}</div>}
            </header>

            {w.primaryDraw && <p className="fw-tw-draw">{w.primaryDraw}</p>}
            {w.detail && <p className="fw-tw-detail">{w.detail}</p>}

            <dl className="fw-tw-meta">
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

            {/* THE SOURCING LINE. Every window states the reasoning that
                produced it. An empty `sources` array is shown as exactly that
                — not hidden, and never filled with a plausible-looking
                citation nobody actually checked. */}
            {w.sourcing && (
              <footer className="fw-tw-sourcing">
                <span className="fw-tw-sourcing-basis">{w.sourcing.basis}</span>
                {w.sourcing.checkedOn && (
                  <span className="fw-tw-sourcing-date"> Checked {w.sourcing.checkedOn}.</span>
                )}
              </footer>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}

/* ===== FARE INTELLIGENCE =====
 *
 * The credibility layer, and the one most likely to be quietly wrong, so it is
 * built to show its own gaps. Three things render here: the seasonal shape, the
 * booking-lead-time research (including where the research disagrees with
 * itself), and — when it exists — the dollar band per origin airport.
 *
 * 🚩 IT CURRENTLY RENDERS "NO SOURCED BANDS YET" ON EVERY FRAMEWORK, ON PURPOSE.
 * Nobody has pulled real fares from ORD/DTW/GRR. Vendor "cheapest month" pages
 * disagree with each other and are not origin-specific, so they cannot support
 * a band. Printing a confident "$700–$900" from that would be inventing
 * precision, so instead the section says what is missing and why. A live feed
 * fills `origins[].bands` and this component changes behaviour with no edit. */
/* Three letters, not one. A single-letter strip renders J-F-M-A-M-J-J-A-S-O-N-D,
 * in which three pairs are indistinguishable at a glance — and the whole point
 * of this strip is that a reader can find a specific month in it. The cells are
 * wide enough at every breakpoint to carry the abbreviation. */
const MONTH_LETTERS = [
  'JAN',
  'FEB',
  'MAR',
  'APR',
  'MAY',
  'JUN',
  'JUL',
  'AUG',
  'SEP',
  'OCT',
  'NOV',
  'DEC',
]
const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

function FareIntelligence({ fare }) {
  if (!fare) return null

  /* Flatten the seasonality groups into a 12-slot lookup so the strip can be
   * rendered by month index rather than by group. */
  const byMonth = {}
  ;(fare.seasonality || []).forEach((s) => {
    s.months.forEach((m) => {
      byMonth[m] = s
    })
  })

  const stale = fare.nextReviewDue && fare.nextReviewDue < new Date().toISOString().slice(0, 10)
  const anyBands = (fare.origins || []).some((o) => o.bands)

  return (
    <section id="flight-intelligence" className="fw-section">
      <div className="fw-section-label">FLIGHT INTELLIGENCE</div>
      <h2 className="fw-section-title">What the Fare Curve Actually Does</h2>
      <p className="fw-tw-lede">
        When seats are cheap, when they are not, and how far ahead the evidence says to buy. Ranges
        and patterns only &mdash; we do not quote you a price, because a price we cannot stand
        behind is worse than no price at all.
      </p>

      {/* THE SEASONAL STRIP. Relative tiers, not money. This is the part
          research genuinely supports: not what a seat costs, but when the
          curve is high and low against itself. */}
      <div className="fw-fi-strip" role="list" aria-label="Fare seasonality by month">
        {MONTH_LETTERS.map((letter, i) => {
          const s = byMonth[i + 1]
          const tier = s?.tier || 'unknown'
          return (
            <div
              key={i}
              role="listitem"
              className={`fw-fi-month fw-fi-month--${tier}`}
              title={s ? `${MONTH_NAMES[i]} — ${tier}. ${s.note || ''}` : MONTH_NAMES[i]}
            >
              <span className="fw-fi-month-letter">{letter}</span>
            </div>
          )
        })}
      </div>
      <div className="fw-fi-key">
        <span>
          <i className="fw-fi-dot fw-fi-dot--low" /> Low
        </span>
        <span>
          <i className="fw-fi-dot fw-fi-dot--shoulder" /> Shoulder
        </span>
        <span>
          <i className="fw-fi-dot fw-fi-dot--peak" /> Peak
        </span>
      </div>

      <div className="fw-fi-grid">
        {/* ORIGINS. Named airports, because "flights are cheaper in May" is
            useless without knowing where you are leaving from. */}
        <div className="fw-fi-card">
          <div className="fw-overview-card-label">FROM THE MIDWEST</div>
          <ul className="fw-fi-origins">
            {(fare.origins || []).map((o) => (
              <li key={o.airport}>
                <span className="fw-fi-iata">{o.airport}</span>
                <span className="fw-fi-origin-city">{o.city}</span>
                <span className="fw-fi-origin-band">
                  {o.bands ? o.bands : <em>no sourced band yet</em>}
                </span>
                {o.note && <span className="fw-fi-origin-note">{o.note}</span>}
              </li>
            ))}
          </ul>
          {!anyBands && (
            <p className="fw-fi-gap">
              <strong>Dollar bands are deliberately absent.</strong> No origin-specific fare pull
              has been done for these airports, and the published &ldquo;cheapest month&rdquo; pages
              disagree with one another. We would rather show you the shape of the year and admit
              the gap than print a number nobody checked.
            </p>
          )}
        </div>

        {/* BOOKING LEAD TIME. Reports the disagreement rather than picking the
            tidier answer — a reader who books on our say-so and pays more
            deserves to have been told the evidence was split. */}
        {fare.bookingLeadTime && (
          <div className="fw-fi-card">
            <div className="fw-overview-card-label">WHEN TO BUY</div>
            <p className="fw-fi-headline">{fare.bookingLeadTime.headline}</p>
            <p className="fw-tw-detail">{fare.bookingLeadTime.detail}</p>
            {fare.bookingLeadTime.edges && (
              <p className="fw-tw-detail">{fare.bookingLeadTime.edges}</p>
            )}
          </div>
        )}
      </div>

      {fare.patienceSaves && (
        <div className="fw-callout">
          <div className="fw-callout-label">WHAT PATIENCE IS WORTH</div>
          <p className="fw-callout-text">{fare.patienceSaves}</p>
        </div>
      )}

      <footer className="fw-tw-sourcing fw-fi-sourcing">
        {fare.basis} <span className="fw-tw-sourcing-date">Checked {fare.checkedOn}.</span>{' '}
        {fare.refreshCadence && (
          <span className="fw-tw-sourcing-date">
            Reviewed {fare.refreshCadence}; next due {fare.nextReviewDue}.
          </span>
        )}
        {stale && <strong className="fw-fi-stale"> This record is past its review date.</strong>}
        {!!(fare.sourcedFrom || []).length && (
          <span className="fw-fi-sources">
            {' '}
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
          </span>
        )}
      </footer>
    </section>
  )
}

export default function FrameworkPage({ data, heroImg }) {
  const [activeNav, setActiveNav] = useState(null)
  const [categoryFilter, setCategoryFilter] = useState('All')

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = `${data.name} — The Lads Travel Co.`
  }, [data.name])

  const style = {
    '--fw-bg': data.palette.bg,
    '--fw-surface': data.palette.surface,
    '--fw-elevated': data.palette.elevated,
    '--fw-accent': data.palette.accent,
  }

  const scrollTo = (id) => {
    setActiveNav(id)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  // Support v2 spots array OR legacy categories
  const hasV2Spots = data.spots && data.spots.length > 0
  const totalSpots = hasV2Spots
    ? data.spots.length
    : data.categories.reduce((sum, cat) => sum + cat.spots.length, 0)

  // Build unique category list from v2 spots
  const spotCategories = useMemo(() => {
    if (!hasV2Spots) return []
    const cats = [...new Set(data.spots.map((s) => s.category))]
    return ['All', ...cats]
  }, [data.spots, hasV2Spots])

  const filteredSpots = useMemo(() => {
    if (!hasV2Spots) return []
    if (categoryFilter === 'All') return data.spots
    return data.spots.filter((s) => s.category === categoryFilter)
  }, [data.spots, categoryFilter, hasV2Spots])

  return (
    <div className="fw-page" style={style}>
      <Helmet>
        <title>
          {data.name} — {SEO_DEFAULTS.siteName}
        </title>
        <meta name="description" content={data.tagline} />
        <meta property="og:title" content={`${data.name} — ${SEO_DEFAULTS.siteName}`} />
        <meta property="og:description" content={data.overview?.quickRead || data.tagline} />
        <meta property="og:type" content="website" />
        {/* Framework routes had NO canonical of their own, so they inherited
            the shell's homepage one and told search engines all 10 were
            duplicates of the front page. data.id is the route slug. */}
        {data.id && <link rel="canonical" href={`https://ladstravel.com/${data.id}`} />}
        {data.id && <meta property="og:url" content={`https://ladstravel.com/${data.id}`} />}
      </Helmet>
      {/* ===== HERO ===== */}
      <section className="fw-hero">
        {heroImg && (
          <div className="fw-hero-bg">
            <img src={heroImg} alt={data.name} loading="eager" />
          </div>
        )}
        <div className="fw-hero-overlay" />
        <Link to="/" className="fw-hero-back">
          &larr; Back to The Lads Travel Co.
        </Link>
        <div className="fw-hero-content">
          <div className="fw-hero-badge">PERSONALLY VALIDATED</div>
          <h1 className="fw-hero-name">{data.name}</h1>
          <p className="fw-hero-tagline">{data.tagline}</p>
          <div className="fw-hero-stats">
            {data.heroStats.map((s, i) => (
              <div key={i} className="fw-hero-stat">
                <span className="fw-hero-stat-val">{s.value}</span>
                <span className="fw-hero-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== NAV ===== */}
      <nav className="fw-nav">
        <div className="fw-nav-inner">
          {data.navSections.map((s) => {
            const id = s.toLowerCase().replace(/\s+/g, '-')
            return (
              <button
                key={id}
                className={`fw-nav-pill${activeNav === id ? ' active' : ''}`}
                onClick={() => scrollTo(id)}
              >
                {s}
              </button>
            )
          })}
        </div>
      </nav>

      {/* ===== OVERVIEW ===== */}
      <section id="overview" className="fw-section">
        <div className="fw-section-label">OVERVIEW</div>
        <h2 className="fw-section-title">
          {totalSpots} Spots Across {data.categories.length} Categories
        </h2>
        <div className="fw-overview-grid">
          <div className="fw-overview-card">
            <div className="fw-overview-card-label">AT A GLANCE</div>
            <p className="fw-overview-card-text">{data.overview.quickRead}</p>
          </div>
          <div className="fw-overview-card">
            <div className="fw-overview-card-label">BUDGET</div>
            <p className="fw-overview-card-text">{data.overview.budget}</p>
          </div>
          <div className="fw-overview-card">
            <div className="fw-overview-card-label">THE FRAMEWORK</div>
            <p className="fw-overview-card-text">{data.overview.framework}</p>
          </div>
        </div>
        {data.overview.ladsBothKnow && (
          <div className="fw-callout">
            <div className="fw-callout-label">BOTH LADS KNOW THIS</div>
            <p className="fw-callout-text">{data.overview.ladsBothKnow}</p>
          </div>
        )}
      </section>

      {/* ===== WHEN TO GO — between Overview and the spots, per the approved spec ===== */}
      <TimingWindows windows={data.timingWindows} />

      {/* ===== FLIGHT INTELLIGENCE — after the windows, before the spots ===== */}
      <FareIntelligence fare={data.fareIntelligence} />

      {/* ===== SPOTS — V2 (with category filters) ===== */}
      {hasV2Spots && (
        <section id="spots" className="fw-section">
          <div className="fw-section-label">ALL SPOTS</div>
          <h2 className="fw-section-title">
            {totalSpots} Spots —{' '}
            {data.spots.filter((s) => s.validated && s.validator !== 'Research').length} Personally
            Validated
          </h2>

          {/* Category filter pills */}
          <div className="fw-cat-filters">
            {spotCategories.map((cat) => (
              <button
                key={cat}
                className={`fw-cat-pill${categoryFilter === cat ? ' active' : ''}`}
                onClick={() => setCategoryFilter(cat)}
              >
                {cat}
                {cat !== 'All' && ` (${data.spots.filter((s) => s.category === cat).length})`}
              </button>
            ))}
          </div>

          <div className="fw-spots-grid">
            {filteredSpots.map((spot, i) => {
              const isLads = spot.validator && spot.validator !== 'Research'
              const hasHH =
                spot.happyHour &&
                spot.happyHour !== 'None known' &&
                spot.happyHour !== 'N/A' &&
                spot.happyHour !== 'TBD'
              const hasSave = spot.wayToSave && spot.wayToSave !== 'TBD'
              return (
                <div key={i} className={`fw-spot${spot.featured ? ' featured' : ''}`}>
                  <div className="fw-spot-top">
                    <div className="fw-spot-name">{spot.name}</div>
                    {spot.priceRange && (
                      <span className="fw-spot-price-badge">{spot.priceRange}</span>
                    )}
                  </div>
                  <div className="fw-spot-area">
                    {spot.neighborhood || spot.area}
                    {spot.city ? `, ${spot.city}` : ''}
                  </div>
                  <p className="fw-spot-desc">{spot.description}</p>

                  {hasHH && (
                    <div className="fw-spot-hh">
                      <span className="fw-spot-hh-label">HAPPY HOUR</span>
                      <span className="fw-spot-hh-text">{spot.happyHour}</span>
                    </div>
                  )}

                  {hasSave && (
                    <div className="fw-spot-save">
                      <span className="fw-spot-save-icon">&#128161;</span>
                      <span className="fw-spot-save-text">{spot.wayToSave}</span>
                    </div>
                  )}

                  <div className="fw-spot-meta">
                    <span className={`fw-spot-badge ${isLads ? 'validated' : 'research'}`}>
                      {isLads ? spot.validator : 'RESEARCH'}
                    </span>
                    <span className="fw-spot-cat-tag">{spot.category}</span>
                    {spot.bestTime && spot.bestTime !== 'any' && (
                      <span className="fw-spot-time">{spot.bestTime}</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* ===== SPOTS — LEGACY (categories array) ===== */}
      {!hasV2Spots &&
        data.categories.map(
          (cat) =>
            cat.spots.length > 0 && (
              <section key={cat.id} id={cat.id} className="fw-section" style={{ paddingTop: 40 }}>
                <div className="fw-category-header">
                  <h3 className="fw-category-name">{cat.name}</h3>
                  <span className="fw-category-count">{cat.spots.length} spots</span>
                </div>
                <div className="fw-spots-grid">
                  {cat.spots.map((spot, i) => {
                    const isLads = spot.validator && spot.validator !== 'Research'
                    return (
                      <div key={i} className="fw-spot">
                        <div className="fw-spot-name">{spot.name}</div>
                        <div className="fw-spot-area">{spot.area}</div>
                        <p className="fw-spot-desc">{spot.description}</p>
                        <div className="fw-spot-meta">
                          <span className={`fw-spot-badge ${isLads ? 'validated' : 'research'}`}>
                            {isLads ? spot.validator : 'RESEARCH'}
                          </span>
                          {spot.rating && (
                            <span className="fw-spot-rating">{spot.rating}&#9733;</span>
                          )}
                          {spot.price && <span className="fw-spot-price">{spot.price}</span>}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            )
        )}

      {/* ===== DAY TRIPS ===== */}
      <section id="day-trips" className="fw-section">
        <div className="fw-section-label">DAY TRIPS</div>
        <h2 className="fw-section-title">{data.dayTrips.length} Day Trips We Recommend</h2>
        <div className="fw-trips-grid">
          {data.dayTrips.map((trip, i) => {
            /* ENDORSEMENT GRADIENT — two separate questions, two separate fields.
               1. Did we do the PLACE?   → `ladsRating`. Drives the visible chip.
               2. Is the BOOKABLE PRODUCT the exact version we did?
                                        → `bookingEndorsed` (optional).
               A rating is our recorded evidence for (1). It used to drive the CTA
               too, which meant the only way to get a neutral CTA was to delete the
               rating — deleting a true fact to avoid an untrue claim.
               `bookingEndorsed: false` now forces the neutral CTA while the rating
               chip stays. Absent/undefined = the original behaviour exactly.
               `true` is only meaningful alongside a rating: without evidence we
               still refuse to make the claim. */
            const endorsed = Boolean(trip.ladsRating) && trip.bookingEndorsed !== false
            return (
              <div key={i} className="fw-trip">
                <div className="fw-trip-header">
                  <div>
                    <div className="fw-trip-name">{trip.name}</div>
                    <div className="fw-trip-from">FROM {trip.from.toUpperCase()}</div>
                  </div>
                  {trip.ladsRating && <div className="fw-trip-rating">Lads: {trip.ladsRating}</div>}
                </div>
                <p className="fw-trip-desc">{trip.description}</p>
                {trip.bookingUrl && (
                  <a
                    href={trip.bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`fw-trip-book${endorsed ? ' fw-trip-book--endorsed' : ''}`}
                  >
                    {endorsed ? (
                      <>
                        <span className="fw-trip-book-flag">WE DID THIS</span>
                        Book on {trip.bookingPlatform} &rarr;
                      </>
                    ) : (
                      <>Book this tour &rarr;</>
                    )}
                  </a>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* ===== MAPS ===== */}
      <section id="maps" className="fw-section">
        <div className="fw-section-label">GOOGLE MAPS</div>
        <h2 className="fw-section-title">Drop These Into Your Phone</h2>
        <p className="fw-section-desc">
          Open in Google Maps, hit save, and navigate like you live there. Every pub, restaurant,
          and attraction pinned.
        </p>
        <div className="fw-maps-grid">
          {data.mapsLinks.map((m, i) => (
            <a
              key={i}
              href={m.url}
              target="_blank"
              rel="noopener noreferrer"
              className="fw-map-card"
            >
              <div className="fw-map-icon">&#128205;</div>
              <div className="fw-map-name">{m.name}</div>
              <div className="fw-map-cta">Open in Google Maps &rarr;</div>
            </a>
          ))}
        </div>
      </section>

      {/* ===== LOGISTICS ===== */}
      <section id="logistics" className="fw-section">
        <div className="fw-section-label">LOGISTICS</div>
        <h2 className="fw-section-title">Getting There &amp; Getting Around</h2>
        {/* GUARDED. michigan.js has `logistics: null`, and dereferencing it
            here threw "Cannot read properties of null (reading 'flights')",
            which unmounted the whole tree and rendered /michigan as a blank
            black page in production. Missing data must degrade to an honest
            placeholder, never to a crash. */}
        {data.logistics ? (
          <div className="fw-logistics-grid">
            <div className="fw-logistics-card">
              <div className="fw-logistics-label">FLIGHTS</div>
              <p className="fw-logistics-text">{data.logistics.flights}</p>
            </div>
            <div className="fw-logistics-card">
              <div className="fw-logistics-label">IN-COUNTRY</div>
              <p className="fw-logistics-text">{data.logistics.inCountry}</p>
            </div>
            <div className="fw-logistics-card">
              <div className="fw-logistics-label">GETTING AROUND</div>
              <p className="fw-logistics-text">{data.logistics.gettingAround}</p>
            </div>
            <div className="fw-logistics-card">
              <div className="fw-logistics-label">TIPPING</div>
              <p className="fw-logistics-text">{data.logistics.tipping}</p>
            </div>
          </div>
        ) : (
          <div className="fw-pending">
            <div className="fw-pending-label">COMING SOON</div>
            <p className="fw-pending-text">
              Logistics for {data.name} are still being written up &mdash; flights, getting around
              and the rest. The spots below are already validated.
            </p>
          </div>
        )}

        {data.costModel && (
          <>
            <h3 className="fw-section-title" style={{ fontSize: '1.4rem', marginTop: 48 }}>
              Cost Model (Per Person, Group of 4)
            </h3>
            {/* Scroll container: the cost table has enough columns to exceed a
                phone viewport and was pushing the whole page sideways at 390px.
                It scrolls inside itself now instead of overflowing the body. */}
            <div className="fw-cost-scroll">
              <table className="fw-cost-table">
                <thead>
                  <tr>
                    {data.costModel.headers.map((h, i) => (
                      <th key={i}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.costModel.rows.map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, j) => (
                        <td key={j}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                  <tr>
                    {data.costModel.totals.map((cell, j) => (
                      <td key={j}>{cell}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            {data.costModel.lean && <p className="fw-cost-lean">{data.costModel.lean}</p>}
          </>
        )}
      </section>

      {/* ===== LADS TAKE ===== */}
      <div className="fw-lads-take">
        <p className="fw-lads-take-quote">&ldquo;{data.ladsTake}&rdquo;</p>
        <div className="fw-lads-take-attr">THE LADS&rsquo; TAKE</div>
      </div>

      {/* ===== FOOTER NAV ===== */}
      <div className="fw-footer-nav">
        <Link to="/" className="fw-footer-link">
          &larr; Back to all destinations
        </Link>
      </div>
      <Footer />
    </div>
  )
}
