/* /christmas-markets — European Christmas Markets 2026.
 * A research-led Bucket List guide whose job is to make someone want to book.
 * Design approved by Brady Oct 6 2026 (mockup: claude.ai/artifact/PK6JGCBTMsCvSwySGogPSm).
 * Every fact comes from src/data/christmasMarkets.js, which holds only verified
 * findings. Counts and dates on this page are derived from that file, never typed. */
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Nav } from './App'
import Footer from './Footer'
import { NEW_IMAGES, BATCH3_IMAGES } from './images-paths'
import {
  MARKETS,
  CITIES,
  ROUTES,
  WHEN,
  FLY,
  MONEY,
  MOVE,
  VALIDATED,
  CHECKED_ON,
} from './data/christmasMarkets.js'
import './ChristmasMarketsPage.css'

const PHOTOS = {
  schonbrunn: {
    src: NEW_IMAGES.schonbrunn,
    alt: 'The yellow facade of Schönbrunn Palace in Vienna',
  },
  munichMarienplatz: {
    src: BATCH3_IMAGES.munichMarienplatz,
    alt: 'Munich’s New Town Hall on Marienplatz',
  },
  pragueOldTown: {
    src: NEW_IMAGES.pragueOldTown,
    alt: 'Prague’s Old Town Square and the Týn Church spires',
  },
}
const LO = Date.parse('2026-11-01')
const HI = Date.parse('2027-01-15')
const XMAS = '2026-12-25'
const pct = (d) => Math.min(100, Math.max(0, ((Date.parse(d) - LO) / (HI - LO)) * 100))
const fmt = (d) =>
  new Date(`${d}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
const afterXmas = (m) => m.end && m.end > XMAS
const byId = Object.fromEntries(MARKETS.map((m) => [m.id, m]))

const FILTERS = [
  ['all', 'All markets', () => true],
  ['classic', 'The big classics', (m) => m.tags.includes('classic')],
  ['small', 'Small towns', (m) => m.tags.includes('small')],
  ['after', 'Open after Christmas', afterXmas],
  ['family', 'Rides and rinks', (m) => m.tags.includes('family')],
]

function Src({ href }) {
  if (!href) return null
  let host = ''
  try {
    host = new URL(href).hostname.replace(/^www\./, '')
  } catch {
    host = 'source'
  }
  return (
    <a className="xm-src" href={href} target="_blank" rel="noopener noreferrer">
      Source: {host}
    </a>
  )
}

function Lights() {
  const ref = useRef(null)
  useEffect(() => {
    const cv = ref.current
    if (!cv || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const cx = cv.getContext('2d')
    let flakes = []
    let raf = 0
    const size = () => {
      const r = window.devicePixelRatio || 1
      cv.width = cv.offsetWidth * r
      cv.height = cv.offsetHeight * r
      flakes = Array.from({ length: Math.round(cv.offsetWidth / 10) }, () => ({
        x: Math.random() * cv.width,
        y: Math.random() * cv.height,
        r: (Math.random() * 1.6 + 0.4) * r,
        s: (Math.random() * 0.4 + 0.15) * r,
      }))
    }
    const tick = () => {
      cx.clearRect(0, 0, cv.width, cv.height)
      cx.fillStyle = 'rgba(242,194,107,.55)'
      for (const f of flakes) {
        f.y += f.s
        f.x += Math.sin(f.y / 60) * 0.2
        if (f.y > cv.height) {
          f.y = -4
          f.x = Math.random() * cv.width
        }
        cx.beginPath()
        cx.arc(f.x, f.y, f.r, 0, 6.283)
        cx.fill()
      }
      raf = window.requestAnimationFrame(tick)
    }
    size()
    tick()
    window.addEventListener('resize', size)
    return () => {
      window.cancelAnimationFrame(raf)
      window.removeEventListener('resize', size)
    }
  }, [])
  return <canvas ref={ref} className="xm-lights" aria-hidden="true" />
}

function Finder() {
  const [from, setFrom] = useState('2026-12-02')
  const [to, setTo] = useState('2026-12-09')
  const [filter, setFilter] = useState('all')
  const [sel, setSel] = useState('rathausplatz')
  const ok = from && to && to >= from
  const test = FILTERS.find((f) => f[0] === filter)[2]
  const rows = MARKETS.filter(test)
  const isOpen = (m) => ok && m.end && m.start <= to && m.end >= from
  /* No published closing date: open on your dates is possible but unconfirmed. */
  const isMaybe = (m) => ok && !m.end && m.start <= to
  const openCount = rows.filter(isOpen).length
  const maybeCount = rows.filter(isMaybe).length
  const m = byId[sel]

  return (
    <section id="finder" className="xm-section">
      <div className="xm-wrap">
        <span className="xm-tag">Researched · official 2026 dates</span>
        <h2 className="xm-h2">
          Pick your dates. <em>See what&rsquo;s open.</em>
        </h2>
        <p className="xm-sub">
          Most guides list markets. This shows which ones are actually running while you&rsquo;re
          there. Tap any market for its hours and the catch.
        </p>

        <div className="xm-picker">
          <label htmlFor="xm-from">
            Arrive
            <input
              id="xm-from"
              type="date"
              value={from}
              min="2026-11-01"
              max="2027-01-15"
              onChange={(e) => setFrom(e.target.value)}
            />
          </label>
          <label htmlFor="xm-to">
            Leave
            <input
              id="xm-to"
              type="date"
              value={to}
              min="2026-11-01"
              max="2027-01-15"
              onChange={(e) => setTo(e.target.value)}
            />
          </label>
          <p className="xm-count" aria-live="polite">
            {ok ? (
              <>
                <b>{openCount}</b> of {rows.length} open while you&rsquo;re there
                {maybeCount > 0 && <small> · {maybeCount} not yet confirmed</small>}
              </>
            ) : (
              'Pick a leave date after you arrive'
            )}
          </p>
        </div>

        <div className="xm-filters" role="group" aria-label="Filter markets">
          {FILTERS.map(([id, label]) => (
            <button
              key={id}
              type="button"
              className="xm-chip"
              aria-pressed={filter === id}
              onClick={() => setFilter(id)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="xm-cal">
          <div className="xm-cal-in">
            <div className="xm-cal-head">
              <span />
              <div className="xm-months" aria-hidden="true">
                {[
                  ['Nov', '2026-11-01'],
                  ['Dec', '2026-12-01'],
                  ['Jan', '2027-01-01'],
                ].map(([l, d]) => (
                  <span key={l} style={{ left: `${pct(d)}%` }}>
                    {l}
                  </span>
                ))}
              </div>
            </div>
            {rows.map((mk) => {
              const open = isOpen(mk)
              const maybe = isMaybe(mk)
              const end = mk.end || mk.start
              const width = mk.end ? pct(end) - pct(mk.start) : 6
              return (
                <button
                  key={mk.id}
                  type="button"
                  className={`xm-row${open ? ' is-open' : ''}${maybe ? ' is-maybe' : ''}${sel === mk.id ? ' is-sel' : ''}`}
                  onClick={() => setSel(mk.id)}
                  aria-label={`${mk.city}, ${mk.name}: ${fmt(mk.start)} to ${mk.end ? fmt(mk.end) : 'closing date not yet published'}${open ? ', open on your dates' : maybe ? ', may be open on your dates; closing date not yet published' : ''}`}
                >
                  <span className="xm-name">
                    {mk.city}
                    <small>{mk.name}</small>
                  </span>
                  <span className="xm-track" aria-hidden="true">
                    <span
                      className={`xm-bar${mk.end ? '' : ' is-unknown'}${mk.end > '2027-01-15' ? ' runs-on' : ''}`}
                      style={{ left: `${pct(mk.start)}%`, width: `${width}%` }}
                    />
                    {ok && (
                      <span
                        className="xm-window"
                        style={{
                          left: `${pct(from)}%`,
                          width: `${Math.max(0.6, pct(to) - pct(from))}%`,
                        }}
                      />
                    )}
                    <span className="xm-xmas" style={{ left: `${pct(XMAS)}%` }} />
                  </span>
                </button>
              )
            })}
          </div>
        </div>
        <p className="xm-note">
          The thin gold line is Christmas Day. Bruges’ season runs on to Feb 14.
        </p>

        {m && (
          <div className="xm-detail" aria-live="polite">
            <span className="xm-when">
              {fmt(m.start)} – {m.end ? fmt(m.end) : 'closing date not yet published'}
            </span>
            <h3>
              {m.city} · {m.name}
            </h3>
            <p>{m.note}</p>
            <Src href={m.src[0]} />
          </div>
        )}
      </div>
    </section>
  )
}

function CityGuides() {
  const [open, setOpen] = useState(CITIES[0].id)
  const city = CITIES.find((c) => c.id === open)
  const photo = city.photo ? PHOTOS[city.photo] : null
  return (
    <section id="cities" className="xm-section">
      <div className="xm-wrap">
        <span className="xm-tag">Researched · not yet visited by us</span>
        <h2 className="xm-h2">
          The cities, and the reasons to go <em>beyond the stalls.</em>
        </h2>
        <div className="xm-city-tabs" role="tablist" aria-label="City guides">
          {CITIES.map((c) => (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={open === c.id}
              className="xm-chip"
              onClick={() => setOpen(c.id)}
            >
              {c.name}
            </button>
          ))}
        </div>
        <article className="xm-city" role="tabpanel" aria-label={city.name}>
          <div className="xm-city-head">
            {photo && (
              <img src={photo.src} alt={photo.alt} loading="lazy" width="640" height="420" />
            )}
            <div className="xm-city-intro">
              <h3>{city.name}</h3>
              <p className="xm-lede-sm">{city.lede}</p>
              <ul className="xm-city-markets">
                {city.markets.map((id) => (
                  <li key={id}>
                    <b>{byId[id].name}</b>
                    <span>
                      {fmt(byId[id].start)} –{' '}
                      {byId[id].end ? fmt(byId[id].end) : 'closing date TBA'}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <dl className="xm-city-grid">
            <div>
              <dt>What it&rsquo;s known for</dt>
              <dd>{city.known}</dd>
            </div>
            <div>
              <dt>Beyond the stalls</dt>
              <dd>{city.beyond}</dd>
            </div>
            <div className="is-trap">
              <dt>The catch</dt>
              <dd>{city.trap}</dd>
            </div>
            <div>
              <dt>Where to stay</dt>
              <dd>{city.stay}</dd>
            </div>
            <div>
              <dt>What a drink costs</dt>
              <dd>{city.drinks}</dd>
            </div>
          </dl>
          <div className="xm-srcs">
            {city.src.map((s) => (
              <Src key={s} href={s} />
            ))}
          </div>
        </article>
      </div>
    </section>
  )
}

function Panels({ id, tag, title, items, cols = 3 }) {
  return (
    <section id={id} className="xm-section">
      <div className="xm-wrap">
        <span className="xm-tag">{tag}</span>
        <h2 className="xm-h2">{title}</h2>
        <div className={`xm-grid xm-grid-${cols}`}>
          {items.map((it) => (
            <div key={it.title} className="xm-panel">
              {it.k && <span className="xm-k">{it.k}</span>}
              <h3>{it.title}</h3>
              <p>{it.body}</p>
              <Src href={it.src} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function ChristmasMarketsPage() {
  useEffect(() => {
    if (!window.location.hash) window.scrollTo(0, 0)
  }, [])
  const stats = useMemo(() => {
    const starts = MARKETS.map((m) => m.start).sort()
    const ends = MARKETS.filter((m) => m.end && m.end < '2027-02-01')
      .map((m) => m.end)
      .sort()
    return {
      count: MARKETS.length,
      first: starts[0],
      last: ends[ends.length - 1],
      cities: new Set(MARKETS.map((m) => m.city)).size,
    }
  }, [])
  const description = `Official 2026 dates for ${stats.count} European Christmas markets, which are open on your travel dates, train routes between them, how to fly in, what things cost and the traps to avoid.`

  return (
    <>
      <Helmet>
        <title>European Christmas Markets 2026 · The Lads Travel Co.</title>
        <meta name="description" content={description} />
        <link rel="canonical" href="https://ladstravel.com/christmas-markets" />
        <meta property="og:title" content="European Christmas Markets 2026 · The Lads Travel Co." />
        <meta property="og:description" content={description} />
        <meta property="og:url" content="https://ladstravel.com/christmas-markets" />
      </Helmet>
      <Nav scrolled={true} />
      <main className="xm-page">
        <header className="xm-hero">
          <Lights />
          <div className="xm-wrap">
            <div className="xm-eyebrow">Lads Bucket List · Winter 2026</div>
            <h1>
              Europe&rsquo;s Christmas markets, <em>planned properly.</em>
            </h1>
            <p className="xm-lede">
              Every major market&rsquo;s real 2026 dates, which ones are open on your trip, how to
              string three cities together by train, and the mistakes that cost people the best
              nights.
            </p>
            <div className="xm-stats">
              <div>
                <b>{stats.count}</b>markets with official 2026 dates
              </div>
              <div>
                <b>{fmt(stats.first)}</b>first to open
              </div>
              <div>
                <b>{fmt(stats.last)}</b>last to close
              </div>
            </div>
            <div className="xm-ctas">
              <a className="xm-btn xm-btn-main" href="#finder">
                Find markets open on my dates
              </a>
              <Link className="xm-btn xm-btn-ghost" to="/plan-your-trip">
                Have us plan the trip
              </Link>
            </div>
          </div>
        </header>

        <Finder />
        <CityGuides />

        <section id="routes" className="xm-section">
          <div className="xm-wrap">
            <span className="xm-tag">Researched</span>
            <h2 className="xm-h2">
              Three cities, <em>one train at a time.</em>
            </h2>
            <p className="xm-sub">
              Routes chosen so every stop is open on the same dates. Times are typical fastest
              trains; the 2027 timetable starts mid-December and can shift them.
            </p>
            <div className="xm-grid xm-grid-3">
              {ROUTES.map((r) => (
                <div key={r.id} className="xm-panel">
                  <span className="xm-k">{r.name}</span>
                  <h3>
                    {r.stops
                      .map((s) => byId[s].city)
                      .filter((c, i, a) => a.indexOf(c) === i)
                      .join(' → ')}
                  </h3>
                  <ul className="xm-legs">
                    {r.legs.map((l) => (
                      <li key={l}>{l}</li>
                    ))}
                  </ul>
                  <p className="xm-fine">{r.window}</p>
                  <p>{r.tip}</p>
                  <Src href={r.src[0]} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <Panels
          id="when"
          tag="Researched"
          title={
            <>
              When to go, <em>and when not to.</em>
            </>
          }
          items={WHEN}
          cols={4}
        />
        <Panels
          id="flights"
          tag="Researched"
          title={
            <>
              Getting there, <em>wherever you start.</em>
            </>
          }
          items={FLY}
        />
        <Panels
          id="money"
          tag="Researched · ranges, never a single price"
          title={
            <>
              What it costs, <em>and how not to overpay.</em>
            </>
          }
          items={MONEY}
        />
        <Panels
          id="around"
          tag="Researched"
          title={
            <>
              Getting <em>between them.</em>
            </>
          }
          items={MOVE}
          cols={2}
        />

        <section className="xm-section">
          <div className="xm-wrap">
            <div className="xm-gold">
              <img
                src={BATCH3_IMAGES.galwayChristmas}
                alt="Galway at Christmas, from the Lads’ own trip"
                loading="lazy"
                width="640"
                height="420"
              />
              <div>
                <span className="xm-tag xm-tag-gold">Validated · we were there</span>
                <h2 className="xm-h3">{VALIDATED.title}</h2>
                <blockquote>{VALIDATED.quote}</blockquote>
                <Link className="xm-btn xm-btn-ghost" to={VALIDATED.href}>
                  Open the Ireland framework
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="plan" className="xm-section xm-ask">
          <div className="xm-wrap">
            <h2 className="xm-h2">
              Want this built <em>around your dates?</em>
            </h2>
            <div className="xm-ask-box">
              <p>
                Tell us when you can travel, who&rsquo;s coming and what you like. We research the
                route, the trains, where to stay and which nights to spend where, all checked
                against official sources.
              </p>
              <div className="xm-ctas">
                <Link className="xm-btn xm-btn-main" to="/plan-your-trip">
                  Plan my Christmas trip
                </Link>
                <Link className="xm-btn xm-btn-ghost" to="/join">
                  Join the founding list
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="xm-section xm-method">
          <div className="xm-wrap">
            <p>
              Researched, not visited: we have not been to these markets yet. Every date, time and
              range above was checked on{' '}
              {new Date(`${CHECKED_ON}T12:00:00`).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}{' '}
              against the organisers&rsquo; and cities&rsquo; own pages where they publish them, by
              our research agents and an independent fact-checker. Markets whose 2026 dates we could
              not confirm, including Dresden and Kraków, are left out until they can be.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
