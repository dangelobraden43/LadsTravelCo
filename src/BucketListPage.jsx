import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Nav } from './App'
import Footer from './Footer'
import { IMAGES, BATCH3_IMAGES, NEW_IMAGES } from './images-paths'
import { eventStatus, visibleEvents } from './utils/events'
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

const EVENTS = [
  {
    name: 'Vivid Sydney',
    when: 'May 22 – June 13, 2026',
    where: 'Sydney, Australia',
    note: 'Light, music, ideas. Opera House and Harbour Bridge become canvases.',
    img: IMAGES.opera,
    start: '2026-05-22',
    end: '2026-06-13',
    frameworkHref: '/australia',
    frameworkLabel: 'Sydney framework',
  },
  {
    name: 'Oktoberfest 2026',
    when: 'September 19 – October 4, 2026',
    start: '2026-09-19',
    end: '2026-10-04',
    where: 'Theresienwiese · Munich',
    note: 'Sixteen days. Fourteen tents. Reservations close months out.',
    img: BATCH3_IMAGES.munichMarienplatz,
    frameworkHref: '/munich',
    frameworkLabel: 'Munich framework',
  },
  {
    name: 'Centenary Ryder Cup',
    when: 'September 17 – 19, 2027',
    start: '2027-09-17',
    end: '2027-09-19',
    where: 'Adare Manor · County Limerick · Ireland',
    note: 'The 100th anniversary. First time on Irish soil since 2006. Tickets ballot in 2026.',
    img: IMAGES.cliffs,
    frameworkHref: '/dublin',
    frameworkLabel: 'Ireland framework',
  },
  {
    name: 'European Christmas Markets',
    when: 'Late November – December',
    start: null,
    end: '2026-12-31',
    where: 'Vienna · Prague · Strasbourg · Dresden',
    note: 'Mulled wine, gothic squares, week-long itineraries that hop between three or four cities.',
    img: NEW_IMAGES.galwayChristmas,
    frameworkHref: null,
    frameworkLabel: null,
  },
]

export default function BucketListPage() {
  useEffect(() => {
    if (!window.location.hash) window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <Helmet>
        <title>Bucket List &mdash; The Lads Travel Co.</title>
        <meta
          name="description"
          content="The trips you build a year around. Events, festivals, sports, holidays."
        />
        <link rel="canonical" href="https://ladstravel.com/bucket-list" />
      </Helmet>

      <Nav scrolled={true} />

      <main className="bucket-page">
        {/* HERO */}
        <header className="bucket-hero">
          <Reveal>
            <div className="bucket-eyebrow">LADS BUCKET LIST</div>
            <h1 className="bucket-h1">The trips you build a year around.</h1>
            <p className="bucket-lede">
              Events, festivals, sports, holidays. The trips that anchor a calendar.
            </p>
          </Reveal>
        </header>

        {/* EVENTS */}
        <section className="bucket-events" aria-labelledby="events-h">
          <Reveal>
            <div className="bucket-section-head">
              <div className="bucket-section-eyebrow">ON THE BOARD</div>
              <h2 id="events-h" className="bucket-section-h">
                The trips we are mapping.
              </h2>
            </div>
          </Reveal>

          <div className="event-grid">
            {visibleEvents(EVENTS).map((ev, i) => (
              <Reveal key={ev.name} delay={i * 90}>
                <article className="event-card">
                  <div className="event-card-img-wrap">
                    <img src={ev.img} alt={ev.name} className="event-card-img" loading="lazy" />
                    <div className="event-card-tint" />
                    {eventStatus(ev) === 'now' ? (
                      <span className="event-pill event-pill--now">HAPPENING NOW</span>
                    ) : (
                      <span className="event-pill event-pill--soon">UPCOMING</span>
                    )}
                  </div>
                  <div className="event-card-body">
                    <h3 className="event-card-name">{ev.name}</h3>
                    <div className="event-card-when">{ev.when}</div>
                    <div className="event-card-where">{ev.where}</div>
                    <p className="event-card-note">{ev.note}</p>
                    {/* No "framework coming soon" line: absence is never announced. */}
                    {ev.frameworkHref && (
                      <Link to={ev.frameworkHref} className="event-card-link">
                        {ev.frameworkLabel} &rarr;
                      </Link>
                    )}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <p className="bucket-calendar-line">
              <em>A calendar view of every event is coming.</em>
            </p>
          </Reveal>
        </section>
      </main>

      <Footer />
    </>
  )
}
