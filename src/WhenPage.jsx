import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Nav } from './App'
import Footer from './Footer'
import { IMAGES, NEW_IMAGES, BATCH3_IMAGES, HERO_IMAGES, HEIC_HERO_IMAGES } from './images-paths'
import { SPOTS_BY_FRAMEWORK } from './utils/siteStats.js'
import { BOOKING_LEAD_TIME, FARE_BANDS_BLOCKED, isFareStale } from './data/fareIntelligence.js'

function useReveal(threshold = 0.15) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add('visible')
          obs.unobserve(el)
        }
      },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}
function Reveal({ children, style = {}, delay = 0, type = 'up' }) {
  const ref = useReveal()
  const cls =
    type === 'up'
      ? 'reveal'
      : type === 'fade'
        ? 'reveal-fade'
        : type === 'scale'
          ? 'reveal-scale'
          : 'reveal'
  const s = delay ? { ...style, transitionDelay: `${delay}ms` } : style
  return (
    <div ref={ref} className={cls} style={s}>
      {children}
    </div>
  )
}

/* \u26d4 NO `price` FIELD LIVES HERE, AND IT IS NOT AN OVERSIGHT.
 *
 * Until Sept 17 2026 every destination below carried a hand-typed point fare
 * ('$480 avg RT' and nine more). Nobody sourced them and nothing refreshed
 * them. They were the same class of failure as the counts the Sept 8 truth
 * pass removed, with one difference that makes them worse: a stale count
 * understates our own work, while a stale fare sends a reader to an airline
 * with the wrong number in their head.
 *
 * `src/data/fareIntelligence.js` already states our position on this in code:
 * every `bands` field in it is deliberately null, and FARE_BANDS_BLOCKED
 * records why \u2014 vendor "cheapest month" pages disagree with each other and are
 * not origin-specific, so they cannot support a dollar figure. So this page
 * was publishing ten numbers our own data layer formally refuses to state.
 *
 * The rule from the Sept 8 queue is "derive or delete." There is nothing to
 * derive from, so they are deleted, and the page now ends on the fare
 * intelligence we CAN source. Do not reintroduce a fare here. When a sourced
 * per-origin band exists it goes in fareIntelligence.js and renders from there.
 */
const SEASONS = [
  {
    id: 'spring',
    months: 'APR \u2013 MAY',
    name: 'Spring.',
    photo: NEW_IMAGES.schonbrunn,
    tagline: 'Europe before the crowds arrive and the prices climb.',
    destinations: [
      { name: 'Rome', slug: 'rome' },
      { name: 'Prague', slug: 'prague' },
      { name: 'Barcelona', slug: 'spain' },
    ],
    nextLabel: 'SUMMER',
  },
  {
    id: 'summer',
    months: 'JUN \u2013 AUG',
    name: 'Summer.',
    photo: BATCH3_IMAGES.rockPoolSwim,
    tagline: "Peak season. Worth it if you book it right. Don't wait.",
    destinations: [
      { name: 'Iceland', slug: 'iceland' },
      { name: 'Ireland', slug: 'dublin' },
      { name: 'Australia', slug: 'australia' },
    ],
    nextLabel: 'FALL',
  },
  {
    id: 'fall',
    months: 'SEP \u2013 OCT',
    name: 'Fall.',
    photo: BATCH3_IMAGES.munichMarienplatz,
    tagline: 'The best month most people miss. Oktoberfest. Shoulder pricing. Still warm.',
    /* Thailand sat here until Sept 17 2026. It was retired Aug 13 2026 \u2014 its
     * data file moved to retired/, its route and rewrite were deleted, and it
     * came out of the sitemap on Sept 2. It stayed on this page for five weeks
     * pointing readers at a destination we no longer cover, with an invented
     * fare attached. Fall carries one destination now. One true row beats two
     * rows where the second is a dead link with a made-up price on it. */
    destinations: [{ name: 'Munich', slug: 'munich' }],
    nextLabel: 'WINTER',
  },
  {
    id: 'winter',
    months: 'NOV \u2013 MAR',
    name: 'Winter.',
    photo: HERO_IMAGES.glendaloughCelticCrossesIreland,
    tagline: 'Budget season. The cities don\u2019t disappear \u2014 the tourists do.',
    /* These three are regions, not frameworks \u2014 deliberately slug-less, so the
     * place-count chip never renders and no coverage is implied. They read as
     * seasonal advice, which is all they are. */
    destinations: [{ name: 'Southern Europe' }, { name: 'Domestic Road Trips' }],
    nextLabel: null,
  },
]

function SeasonSection({ season, index }) {
  return (
    <>
      {/* Season scroll section */}
      <div style={{ position: 'relative', minHeight: '200vh' }}>
        {/* Photo layer — sticky */}
        <div
          className="when-sticky"
          style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            width: '100%',
            zIndex: 1,
            overflow: 'hidden',
          }}
        >
          <img
            src={season.photo}
            alt={season.name}
            loading={index === 0 ? 'eager' : 'lazy'}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, rgba(20,18,16,0.3) 0%, transparent 40%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, transparent 20%, rgba(20,18,16,0.85) 100%)',
            }}
          />
        </div>

        {/* Content layer — sticky on top of photo */}
        <div
          className="when-content-sticky"
          style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '0 80px 80px',
            marginTop: '-100vh',
            pointerEvents: 'none',
          }}
        >
          <div style={{ pointerEvents: 'auto', maxWidth: 700 }}>
            <Reveal delay={index * 100}>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  letterSpacing: 4,
                  color: '#b8886e',
                  marginBottom: 16,
                }}
              >
                {season.months}
              </div>
              <h2
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: 'clamp(60px, 8vw, 96px)',
                  fontStyle: 'italic',
                  fontWeight: 400,
                  color: '#e8dcc8',
                  lineHeight: 1.0,
                  marginBottom: 16,
                }}
              >
                {season.name}
              </h2>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 16,
                  color: '#b8ad9a',
                  maxWidth: 520,
                  lineHeight: 1.6,
                  marginBottom: 32,
                }}
              >
                {season.tagline}
              </p>
            </Reveal>

            {/* Destination picks */}
            {season.destinations.map((d, di) => (
              <Reveal key={d.name} delay={index * 100 + 100 + di * 60}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 0',
                    borderTop: '1px solid rgba(212,168,67,0.15)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span
                      style={{
                        fontFamily: "'Fraunces', serif",
                        fontSize: 22,
                        fontStyle: 'italic',
                        fontWeight: 400,
                        color: '#e8dcc8',
                      }}
                    >
                      {d.name}
                    </span>
                    {SPOTS_BY_FRAMEWORK[d.slug] && (
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: 10,
                          color: '#d4a843',
                          padding: '2px 8px',
                          borderRadius: 12,
                          border: '1px solid rgba(212,168,67,0.3)',
                        }}
                      >
                        {SPOTS_BY_FRAMEWORK[d.slug]} places
                      </span>
                    )}
                  </div>
                  {/* The right-hand slot held a hand-typed fare until Sept 17
                   * 2026. See the note on SEASONS above. A destination that
                   * is a framework carries its derived place count on the
                   * left, which is a number we can stand behind; a region
                   * carries nothing, which is honest. */}
                  {d.slug && (
                    <Link
                      to={`/${d.slug}`}
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 11,
                        color: '#b8886e',
                        textDecoration: 'none',
                        letterSpacing: 1,
                      }}
                    >
                      OPEN &rarr;
                    </Link>
                  )}
                </div>
              </Reveal>
            ))}

            {/* Scroll hint */}
            {season.nextLabel && (
              <div
                style={{
                  position: 'fixed',
                  bottom: 32,
                  right: 32,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 9,
                  letterSpacing: 2,
                  color: '#5a5550',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  pointerEvents: 'none',
                }}
              >
                SCROLL INTO {season.nextLabel}
                <span
                  style={{ animation: 'float 2s ease-in-out infinite', display: 'inline-block' }}
                >
                  &darr;
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dark breathing gap between seasons */}
      <div style={{ height: 40, background: '#141210' }} />
    </>
  )
}

export default function WhenPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <Nav scrolled={true} />
      <div style={{ background: '#141210', minHeight: '100vh', paddingTop: 80 }}>
        {/* Page header */}
        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 32px 40px' }}>
          <Reveal>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 3,
                color: '#b8886e',
                marginBottom: 12,
              }}
            >
              WHEN TO GO
            </div>
            <h1
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
                fontStyle: 'italic',
                fontWeight: 400,
                color: '#e8dcc8',
                lineHeight: 1.15,
                marginBottom: 12,
              }}
            >
              Four Windows.
            </h1>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 15,
                color: '#b8ad9a',
                maxWidth: 560,
              }}
            >
              Everything outside these windows costs more and delivers less.
            </p>
          </Reveal>
        </section>

        {/* Four seasons */}
        {SEASONS.map((s, i) => (
          <SeasonSection key={s.id} season={s} index={i} />
        ))}

        {/* WHEN TO BOOK — the replacement for the ten deleted fares.
         * Everything here is sourced and dated in fareIntelligence.js, and it
         * reports the DISAGREEMENT between sources rather than picking the
         * tidier answer. That is the honest version of what the point prices
         * were pretending to tell a reader. */}
        {/* isFareStale() is not decoration. fareIntelligence.js says a stale
         * fare record "is worse than none — it is a confident wrong number",
         * and gives every surface the right to decline to render. This is a
         * surface taking it. If nobody re-checks the sources within a quarter
         * this block removes itself rather than ageing quietly on the page,
         * which is the whole lesson of the Iceland eclipse window. */}
        {!isFareStale(BOOKING_LEAD_TIME) && (
          <section style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 32px 40px' }}>
            <Reveal>
              <div
                style={{
                  background: '#1c1915',
                  border: '1px solid rgba(212,168,67,0.22)',
                  borderRadius: 16,
                  padding: 'clamp(24px, 4vw, 40px)',
                }}
              >
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: 3,
                    color: '#b8886e',
                    marginBottom: 12,
                  }}
                >
                  WHEN TO BOOK
                </div>
                <h2
                  style={{
                    fontFamily: "'Fraunces', serif",
                    fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                    fontStyle: 'italic',
                    fontWeight: 400,
                    color: '#e8dcc8',
                    lineHeight: 1.2,
                    margin: '0 0 16px',
                  }}
                >
                  {BOOKING_LEAD_TIME.headline}
                </h2>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 15,
                    lineHeight: 1.7,
                    color: '#b8ad9a',
                    maxWidth: 720,
                    margin: '0 0 16px',
                  }}
                >
                  {BOOKING_LEAD_TIME.detail}
                </p>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 15,
                    lineHeight: 1.7,
                    color: '#b8ad9a',
                    maxWidth: 720,
                    margin: '0 0 24px',
                  }}
                >
                  {BOOKING_LEAD_TIME.edges}
                </p>

                {/* The gap, stated to the reader rather than hidden from them. */}
                <div
                  style={{
                    borderTop: '1px solid rgba(212,168,67,0.15)',
                    paddingTop: 16,
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 16,
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                  }}
                >
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 13,
                      lineHeight: 1.6,
                      color: '#8a8070',
                      maxWidth: 560,
                      margin: 0,
                    }}
                  >
                    We do not publish a dollar figure per route. {FARE_BANDS_BLOCKED.reason} When we
                    can source one per departure airport, it will appear here with its date on it.
                  </p>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 10,
                      letterSpacing: 1,
                      color: '#5a5550',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    CHECKED {BOOKING_LEAD_TIME.checkedOn}
                  </span>
                </div>
              </div>
            </Reveal>
          </section>
        )}

        {/* Back link */}
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '40px 32px 60px',
            textAlign: 'center',
          }}
        >
          <Link
            to="/"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12,
              color: '#b8ad9a',
              textDecoration: 'none',
              letterSpacing: 1,
            }}
          >
            &larr; Back home
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }
        @media(max-width:768px) {
          .when-sticky { position: relative !important; height: 65vh !important; }
          .when-content-sticky {
            position: relative !important; height: auto !important;
            margin-top: -30vh !important; padding: 0 24px 48px !important;
          }
        }
      `}</style>
      <Footer />
    </>
  )
}
