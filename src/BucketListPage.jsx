/* /bucket-list — the trips you build a year around.
 *
 * Every entry comes from src/data/bucketList.js, GENERATED from the research runs: dates read
 * from the organiser's own page, checked by the verifier, traps riding on the entry they name.
 * An entry leaves the page the day after it ends (utils/events). Nothing on this page is typed
 * from memory: the four featured cards only pick entries out of the same data by id.
 *
 * ⛔ No ticket prices. No ranking of ours. No "free".
 */
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Nav } from './App'
import Footer from './Footer'
import { IMAGES, BATCH3_IMAGES, NEW_IMAGES } from './images-paths'
import { eventStatus, visibleEvents, todayISO } from './utils/events'
import { BUCKET_EVENTS, BUCKET_META } from './data/bucketList'
import { MARKETS, CHECKED_ON as MARKETS_CHECKED } from './data/christmasMarkets'
import './BucketListPage.css'

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

const KIND_LABELS = {
  festival: 'Festival',
  music: 'Music',
  sport: 'Sport',
  culture: 'Culture',
  nature: 'Nature',
  holiday: 'Holiday',
  food: 'Food & drink',
  winter: 'Winter',
}
const KIND_ORDER = ['festival', 'music', 'sport', 'culture', 'nature', 'holiday', 'food', 'winter']
const STATUS_LABELS = {
  confirmed: 'Dates confirmed',
  expected: 'Expected dates',
  'not-announced': 'Dates not out yet',
}

const MONTHS =
  'January February March April May June July August September October November December'.split(' ')
const SHORT = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ')
const DAYS = 'Sun Mon Tue Wed Thu Fri Sat'.split(' ')
const parse = (iso) => {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}
const day = (iso, year) => {
  const d = parse(iso)
  return `${DAYS[d.getDay()]} ${SHORT[d.getMonth()]} ${d.getDate()}${year ? `, ${d.getFullYear()}` : ''}`
}
const when = (e) => {
  if (!e.start) return null
  if (!e.end || e.end === e.start) return day(e.start, true)
  const sameYear = e.start.slice(0, 4) === e.end.slice(0, 4)
  return `${day(e.start, !sameYear)} to ${day(e.end, true)}`
}
const monthKey = (iso) => iso.slice(0, 7)
const monthLabel = (key) => {
  const [y, m] = key.split('-').map(Number)
  return `${MONTHS[m - 1]} ${y}`
}
const longDate = (iso) => {
  const d = parse(iso)
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
}

/* A trip that lands inside one of our frameworks links to it; derived from the place, never typed. */
const MIDWEST =
  /^(detroit|chicago|indianapolis|milwaukee|minneapolis|cleveland|columbus|cincinnati|grand rapids|ann arbor|madison|speedway)\b/i
const COUNTRY_ROUTE = {
  Ireland: ['/dublin', 'Ireland framework'],
  Spain: ['/spain', 'Spain framework'],
  Italy: ['/rome', 'Rome framework'],
  Iceland: ['/iceland', 'Iceland framework'],
  Czechia: ['/prague', 'Prague framework'],
  'Czech Republic': ['/prague', 'Prague framework'],
  Austria: ['/vienna', 'Vienna framework'],
  Australia: ['/australia', 'Australia framework'],
  Poland: ['/poland', 'Poland framework'],
  Peru: ['/peru', 'Peru framework'],
}
function frameworkFor(e) {
  if (e.kind === 'winter' && /christmas market/i.test(e.name))
    return ['/christmas-markets', 'Christmas markets guide']
  if (e.country === 'Germany' && /munich/i.test(e.city || ''))
    return ['/munich', 'Munich framework']
  if (e.country === 'United States' && MIDWEST.test(e.city || '')) return ['/local', 'Lads Local']
  return COUNTRY_ROUTE[e.country] || null
}

const byId = (id) => BUCKET_EVENTS.find((e) => e.id === id) || null
/* the featured strip: entries picked out of the data by id, with a photograph each */
const FEATURED_IDS = [
  ['ryder-cup-2027', IMAGES.cliffs],
  ['total-solar-eclipse-over-southern-spain-2027', NEW_IMAGES.montserratSpain],
  ['oktoberfest-2027', BATCH3_IMAGES.munichMarienplatz],
  ['vivid-sydney-2027', NEW_IMAGES.vividSydney],
]
/* the Christmas markets guide is its own page; its dates are the markets' own, from that data */
const MARKETS_CARD = {
  id: 'christmas-markets-guide',
  name: 'European Christmas markets',
  kind: 'winter',
  start: MARKETS.map((m) => m.start).sort()[0],
  end: MARKETS.map((m) => m.end)
    .sort()
    .pop(),
  city: [...new Set(MARKETS.map((m) => m.city))].slice(0, 4).join(' · '),
  country: 'Europe',
  status: 'confirmed',
  what: `Official dates for ${MARKETS.length} markets, which are open on your dates, and rail routes that link three cities in a week.`,
  img: BATCH3_IMAGES.galwayChristmas,
  guide: ['/christmas-markets', 'Christmas markets guide'],
  checkedOn: MARKETS_CHECKED,
}

function StatusPill({ e }) {
  const s = eventStatus(e)
  if (s === 'now') return <span className="bl-pill bl-pill--now">Happening now</span>
  return <span className={`bl-pill bl-pill--${e.status}`}>{STATUS_LABELS[e.status]}</span>
}

function TripCard({ e }) {
  const fw = e.guide || frameworkFor(e)
  const src = e.sources && e.sources[0]
  return (
    <article className="bl-card" id={e.id}>
      <div className="bl-card-top">
        <span className="bl-kind">{KIND_LABELS[e.kind]}</span>
        <StatusPill e={e} />
      </div>
      <h3 className="bl-name">{e.name}</h3>
      {when(e) && <p className="bl-when">{when(e)}</p>}
      <p className="bl-where">
        {e.city}
        {e.country && e.country !== e.city ? `, ${e.country}` : ''}
      </p>
      <p className="bl-what">{e.what}</p>
      {e.ticket && <p className="bl-ticket">Tickets: {e.ticket}</p>}
      {e.caution && <p className="bl-caution">{e.caution}</p>}
      <div className="bl-links">
        {src && (
          <a href={src.url} target="_blank" rel="noopener noreferrer">
            Organiser&rsquo;s page
          </a>
        )}
        {fw && <Link to={fw[0]}>{fw[1]} &rarr;</Link>}
        <Link to="/plan-your-trip" className="bl-plan">
          Plan this trip
        </Link>
      </div>
    </article>
  )
}

export default function BucketListPage() {
  const [kind, setKind] = useState('all')
  const [month, setMonth] = useState('all')
  const today = todayISO()
  useEffect(() => {
    if (!window.location.hash) window.scrollTo(0, 0)
  }, [])

  const live = useMemo(() => visibleEvents(BUCKET_EVENTS, today), [today])
  const dated = live.filter((e) => e.start)
  const waiting = live.filter((e) => !e.start)
  const featured = FEATURED_IDS.map(([id, img]) => {
    const e = byId(id)
    return e && eventStatus(e, today) !== 'past' ? { ...e, img } : null
  }).filter(Boolean)
  if (eventStatus(MARKETS_CARD, today) !== 'past') featured.splice(1, 0, MARKETS_CARD)

  const kinds = KIND_ORDER.filter((k) => dated.some((e) => e.kind === k))
  const byKind = dated.filter((e) => kind === 'all' || e.kind === kind)
  /* an entry already under way sits under "Now"; the rest under the month it starts */
  const groupOf = (e) => (e.start <= today ? 'now' : monthKey(e.start))
  const months = [...new Set(byKind.map(groupOf))].sort((a, b) =>
    a === 'now' ? -1 : b === 'now' ? 1 : a.localeCompare(b)
  )
  const shown = byKind.filter((e) => month === 'all' || groupOf(e) === month)
  const groups = months
    .filter((m) => month === 'all' || m === month)
    .map((m) => [m, shown.filter((e) => groupOf(e) === m)])
    .filter(([, list]) => list.length)

  const checked = BUCKET_META.runs
    .map((r) => r.today)
    .sort()
    .pop()
  const description = `${dated.length} dated trips for the year ahead: festivals, finals, carnivals and the sky, every date read from the organiser's own page and checked.`

  return (
    <>
      <Helmet>
        <title>Bucket List: the trips you build a year around | The Lads Travel Co.</title>
        <meta name="description" content={description} />
        <link rel="canonical" href="https://ladstravel.com/bucket-list" />
      </Helmet>

      <Nav scrolled={true} />

      <main className="bucket-page">
        <header className="bucket-hero">
          <Reveal>
            <div className="bucket-eyebrow">LADS BUCKET LIST</div>
            <h1 className="bucket-h1">The trips you build a year around.</h1>
            <p className="bucket-lede">
              Festivals, finals, carnivals and the sky. Every date here was read from the
              organiser&rsquo;s own page and checked again before it went up. Pick a month, or a
              kind of trip.
            </p>
          </Reveal>
        </header>

        <section className="bucket-events" aria-labelledby="featured-h">
          <Reveal>
            <div className="bucket-section-head">
              <div className="bucket-section-eyebrow">THE BIG ONES</div>
              <h2 id="featured-h" className="bucket-section-h">
                Where our frameworks meet the calendar.
              </h2>
            </div>
          </Reveal>
          <div className="event-grid">
            {featured.map((ev, i) => (
              <Reveal key={ev.id} delay={i * 90}>
                <article className="event-card">
                  <div className="event-card-img-wrap">
                    <img src={ev.img} alt="" className="event-card-img" loading="lazy" />
                    <div className="event-card-tint" />
                    {eventStatus(ev, today) === 'now' ? (
                      <span className="event-pill event-pill--now">HAPPENING NOW</span>
                    ) : (
                      <span className="event-pill event-pill--soon">
                        {STATUS_LABELS[ev.status].toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="event-card-body">
                    <h3 className="event-card-name">{ev.name}</h3>
                    <div className="event-card-when">{when(ev)}</div>
                    <div className="event-card-where">
                      {ev.city}
                      {ev.country && ev.country !== ev.city ? ` · ${ev.country}` : ''}
                    </div>
                    <p className="event-card-note">{ev.what}</p>
                    {(ev.guide || frameworkFor(ev)) && (
                      <Link to={(ev.guide || frameworkFor(ev))[0]} className="event-card-link">
                        {(ev.guide || frameworkFor(ev))[1]} &rarr;
                      </Link>
                    )}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="bl-calendar" aria-labelledby="calendar-h">
          <Reveal>
            <div className="bucket-section-head">
              <div className="bucket-section-eyebrow">THE YEAR AHEAD</div>
              <h2 id="calendar-h" className="bucket-section-h">
                {dated.length} dated trips, month by month.
              </h2>
            </div>
          </Reveal>
          <div className="bl-filters">
            <div className="bl-chips" role="group" aria-label="Kind of trip">
              <button
                type="button"
                className={kind === 'all' ? 'is-on' : undefined}
                aria-pressed={kind === 'all'}
                onClick={() => setKind('all')}
              >
                Everything
              </button>
              {kinds.map((k) => (
                <button
                  key={k}
                  type="button"
                  className={kind === k ? 'is-on' : undefined}
                  aria-pressed={kind === k}
                  onClick={() => setKind(k)}
                >
                  {KIND_LABELS[k]}
                </button>
              ))}
            </div>
            <div className="bl-months" role="group" aria-label="Month">
              <button
                type="button"
                className={month === 'all' ? 'is-on' : undefined}
                aria-pressed={month === 'all'}
                onClick={() => setMonth('all')}
              >
                All months
              </button>
              {months.map((m) => (
                <button
                  key={m}
                  type="button"
                  className={month === m ? 'is-on' : undefined}
                  aria-pressed={month === m}
                  onClick={() => setMonth(month === m ? 'all' : m)}
                >
                  {m === 'now' ? 'Now' : monthLabel(m).replace(/^(\w{3})\w* /, '$1 ')}
                  <span>{byKind.filter((e) => groupOf(e) === m).length}</span>
                </button>
              ))}
            </div>
          </div>

          {groups.map(([m, list]) => (
            <div key={m} className="bl-month">
              <h3 className="bl-month-h">
                {m === 'now' ? 'Under way now' : monthLabel(m)}
                <span>{list.length}</span>
              </h3>
              <div className="bl-grid">
                {list.map((e) => (
                  <TripCard key={e.id} e={e} />
                ))}
              </div>
            </div>
          ))}
          {groups.length === 0 && <p className="bl-empty">Nothing on the list matches that.</p>}
        </section>

        {waiting.length > 0 && (
          <section className="bl-waiting" aria-labelledby="waiting-h">
            <Reveal>
              <div className="bucket-section-head">
                <div className="bucket-section-eyebrow">WATCHING FOR DATES</div>
                <h2 id="waiting-h" className="bucket-section-h">
                  Worth a trip, dates not out yet.
                </h2>
              </div>
            </Reveal>
            <ul className="bl-waiting-list">
              {waiting.map((e) => (
                <li key={e.id}>
                  <div className="bl-card-top">
                    <span className="bl-kind">{KIND_LABELS[e.kind]}</span>
                  </div>
                  <h3 className="bl-name">{e.name}</h3>
                  <p className="bl-where">
                    {e.city}
                    {e.country && e.country !== e.city ? `, ${e.country}` : ''}
                  </p>
                  <p className="bl-what">{e.what}</p>
                  {e.sources && e.sources[0] && (
                    <div className="bl-links">
                      <a href={e.sources[0].url} target="_blank" rel="noopener noreferrer">
                        Organiser&rsquo;s page
                      </a>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="bl-how" aria-labelledby="how-h">
          <h2 id="how-h">How this list is built</h2>
          <div className="bl-how-grid">
            <div>
              <h3>Read from the organiser</h3>
              <p>
                Each entry&rsquo;s dates and ticket situation were read on the organiser&rsquo;s,
                venue&rsquo;s or governing body&rsquo;s own page, which is the first link on every
                card. Aggregators and guides only point us there.
              </p>
            </div>
            <div>
              <h3>Checked, then marked</h3>
              <p>
                An independent pass re-opens the source behind each entry. &ldquo;Dates
                confirmed&rdquo; means the organiser has published 2027 dates.
                &ldquo;Expected&rdquo; means a fixed rule or an announcement we could only read
                second-hand. A date we could not confirm is not shown.
              </p>
            </div>
            <div>
              <h3>Nothing for sale here</h3>
              <p>
                No ticket prices, no booking links, no ranking of ours. An entry leaves the page the
                day after it ends. {checked ? `Last read ${longDate(checked)}.` : ''}
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
