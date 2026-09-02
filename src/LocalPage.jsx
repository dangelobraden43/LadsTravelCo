import React, { useEffect, useRef, lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Nav } from './App'
import Footer from './Footer'
import { BRUCE_PLACES } from './data/brucePeninsula'
import { MIDWEST_CANDIDATES } from './data/midwestCandidates'
import michigan from './data/michigan'
import './LocalPage.css'

/* THE MAP IS THE HERO — /local graduated Sept 2 2026.
 *
 * Until today this page was two cards above the fold and the real map lived
 * unlinked at /good-news behind a noindex. That was the right call while the
 * map had one data layer and a Tennessee photograph on the Michigan card. It
 * has three layers now, so the map comes to the front and /good-news redirects
 * here. "Good Brews · Good Views · Good News" comes with it as the BANNER
 * IDENTITY of Lads Local — it was never a separate destination, it is what
 * this page is called.
 *
 * The map is lazy: it pulls the traced Midwest + Ontario geometry and three
 * data files, and none of that should sit in the critical path for a visitor
 * who lands here and scrolls. */
const LadsLocalMap = lazy(() => import('./GoodNews'))

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

function Reveal({ children, delay = 0, className = '' }) {
  const ref = useReveal()
  const style = delay ? { transitionDelay: `${delay}ms` } : undefined
  return (
    <div ref={ref} className={`reveal ${className}`.trim()} style={style}>
      {children}
    </div>
  )
}

/* COUNTS ARE DERIVED, NEVER TYPED. Every number this page prints is walked out
 * of the data files at module load, the same discipline the Globe and Featured
 * Work use. A hand-typed count is a claim that goes stale the first time
 * somebody edits a data file and forgets this page exists. */
const MICHIGAN_SPOTS = (() => {
  const found = []
  const walk = (o) => {
    if (!o || typeof o !== 'object') return
    if (Array.isArray(o)) return o.forEach(walk)
    if (o.name && (o.description || o.notes)) found.push(o)
    Object.values(o).forEach(walk)
  }
  walk(michigan)
  return found
})()
const MICH_PINNED = MICHIGAN_SPOTS.filter((s) => Number.isFinite(s.lat)).length
const MICH_TOTAL = MICHIGAN_SPOTS.length
const VALIDATED_TOTAL = MICH_TOTAL + BRUCE_PLACES.filter((p) => p.validated === true).length
const CANDIDATE_TOTAL = MIDWEST_CANDIDATES.length

export default function LocalPage() {
  useEffect(() => {
    if (!window.location.hash) window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <Helmet>
        <title>Lads Local &mdash; Good Brews · Good Views · Good News | The Lads Travel Co.</title>
        <meta
          name="description"
          content={`An interactive map of the Midwest built from places we actually walked into — ${VALIDATED_TOTAL} validated across Michigan and the Bruce Peninsula, plus ${CANDIDATE_TOTAL} researched candidates we are honest about not having visited yet.`}
        />
        <link rel="canonical" href="https://ladstravel.com/local" />
        <meta property="og:title" content="Lads Local — Good Brews · Good Views · Good News" />
        <meta
          property="og:description"
          content={`${VALIDATED_TOTAL} validated Midwest spots on an interactive map. Gold means we were there. Copper means we were not, and we say so.`}
        />
        <meta property="og:url" content="https://ladstravel.com/local" />
        <meta property="og:type" content="website" />
        {/* No custom OG image yet — deliberately falling through to the
            site-wide default rather than pointing at a file that does not
            exist. A map screenshot is the obvious candidate once one is cut. */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Lads Local — Good Brews · Good Views · Good News',
            url: 'https://ladstravel.com/local',
            description: `An interactive Midwest map. ${VALIDATED_TOTAL} places validated firsthand by the founders; ${CANDIDATE_TOTAL} further places listed as researched candidates and explicitly not claimed as visited.`,
            isPartOf: {
              '@type': 'WebSite',
              name: 'The Lads Travel Co.',
              url: 'https://ladstravel.com',
            },
          })}
        </script>
      </Helmet>

      <Nav scrolled={true} />

      <main className="local-page">
        {/* HERO — the banner identity, then straight into the map */}
        <header className="local-hero local-hero--map">
          <Reveal>
            <div className="local-eyebrow">LADS LOCAL</div>
            <h1 className="local-h1">
              Good Brews <span className="local-h1-dot">·</span> Good Views{' '}
              <span className="local-h1-dot">·</span> Good News
            </h1>
            <p className="local-lede">
              Breweries, wineries, food and golf across the Midwest. Gold pins are places we have
              been. Copper pins are on the list and not visited yet.
            </p>
            <ul className="local-key" aria-label="What the pin colours mean">
              <li>
                <span className="local-key-dot local-key-dot--gold" />
                <strong>{VALIDATED_TOTAL} validated</strong> &mdash; we were there
              </li>
              <li>
                <span className="local-key-dot local-key-dot--copper" />
                <strong>{CANDIDATE_TOTAL} on the list</strong> &mdash; researched, not visited
              </li>
            </ul>
          </Reveal>
        </header>

        <section className="local-map-wrap" aria-labelledby="local-map-h">
          <h2 id="local-map-h" className="sr-only">
            Interactive map of the Midwest
          </h2>
          <Suspense
            fallback={
              <div className="local-map-loading" role="status">
                Drawing the map&hellip;
              </div>
            }
          >
            <LadsLocalMap />
          </Suspense>
        </section>

        {/* THE FRAMEWORK the map is a front door to */}
        <section className="local-grid-section" aria-labelledby="cards-h">
          <h2 id="cards-h" className="local-section-h">
            The framework behind it
          </h2>
          <div className="local-grid">
            <Reveal>
              <Link to="/michigan" className="local-card local-card--flat">
                <div className="local-card-body">
                  <div className="local-card-tag">HOME TURF</div>
                  <h3 className="local-card-name">Michigan</h3>
                  <div className="local-card-region">
                    Grand Rapids &middot; Northern Michigan &middot; Harbor Country &middot; Detroit
                  </div>
                  {/* The old line here claimed "Every region across both peninsulas,
                      validated." With coordinates on 8 of 22 that was a claim the
                      data could not carry. This says what is actually true. */}
                  <p className="local-card-line">
                    {MICH_TOTAL} spots we have been to &mdash; breweries, golf, road trips.{' '}
                    {MICH_PINNED} of them sit on the map above; the rest are named there too, and
                    stay off it until we hold a real coordinate for them.
                  </p>
                  <div className="local-card-cta">OPEN FRAMEWORK &rarr;</div>
                </div>
              </Link>
            </Reveal>
          </div>

          <Reveal>
            <p className="local-more-line">
              <em>
                More U.S. and Caribbean frameworks in development &mdash; Puerto Rico, Smoky
                Mountains, the West Coast spine.
              </em>
            </p>
          </Reveal>
        </section>

        {/* THE HONEST FOOTNOTE. Not decoration: the whole reason to trust the
            map is that its limits are printed on it. */}
        <section className="local-method" aria-labelledby="local-method-h">
          <h2 id="local-method-h" className="local-section-h">
            How this map is built
          </h2>
          <div className="local-method-grid">
            <div>
              <h3>Coordinates are followed, not looked up</h3>
              <p>
                Every pin sits where Google&rsquo;s own record for that saved place sits, read from
                our own saved lists. We never resolve a name into a location &mdash; that is how a
                map ends up sending someone to the wrong Tivoli, in the wrong country.
              </p>
            </div>
            <div>
              <h3>Two tiers, never blended</h3>
              <p>
                Gold is firsthand. Copper is a candidate. Where a copper pin shows a rating it is{' '}
                <strong>Google&rsquo;s rating</strong>, labelled as Google&rsquo;s. We do not score
                a place we have not been to, and we do not write a description for one either.
              </p>
            </div>
            <div>
              <h3>Missing is better than invented</h3>
              <p>
                {MICH_TOTAL - MICH_PINNED} Michigan spots we have genuinely visited are absent from
                the canvas because we do not hold a real coordinate for them yet. They are listed by
                name instead. Closed venues are removed outright rather than greyed out.
              </p>
            </div>
          </div>
          <p className="local-method-note">
            The Hop Passport is a third-party Michigan brewery programme, not ours. Where it comes
            up we describe it as theirs and invent none of its rules.
          </p>
        </section>
      </main>

      <Footer />
    </>
  )
}
