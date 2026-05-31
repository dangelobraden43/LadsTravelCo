import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Nav } from './App'
import Footer from './Footer'
import { IMAGES, BATCH3_IMAGES, NEW_IMAGES } from './images-paths'
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

const VEGAS_PROOF = {
  href: '/vegas-zion-rise',
  tag: 'VALIDATED · APRIL 2026',
  title: 'Rise Festival',
  location: 'Mojave Desert · Nevada',
  desc: 'Four nights, three worlds, one lantern festival. The first Bucket List framework live on the site.',
  img: 'https://res.cloudinary.com/doonck2rm/video/upload/so_5,w_1200,f_jpg/RiseLantern_xuegox.jpg',
  accent: '#f0a838',
}

const EVENTS = [
  {
    name: 'Vivid Sydney',
    when: 'May 22 – June 13, 2026',
    where: 'Sydney, Australia',
    note: 'Light, music, ideas. Opera House and Harbour Bridge become canvases.',
    img: IMAGES.opera,
    status: 'now',
    frameworkHref: '/australia',
    frameworkLabel: 'Sydney framework',
  },
  {
    name: 'Oktoberfest 2026',
    when: 'September 19 – October 4, 2026',
    where: 'Theresienwiese · Munich',
    note: 'Sixteen days. Fourteen tents. Reservations close months out.',
    img: BATCH3_IMAGES.munichMarienplatz,
    status: 'soon',
    frameworkHref: '/munich',
    frameworkLabel: 'Munich framework',
  },
  {
    name: 'Centenary Ryder Cup',
    when: 'September 17 – 19, 2027',
    where: 'Adare Manor · County Limerick · Ireland',
    note: 'The 100th anniversary. First time on Irish soil since 2006. Tickets ballot in 2026.',
    img: IMAGES.cliffs,
    status: 'soon',
    frameworkHref: '/dublin',
    frameworkLabel: 'Ireland framework',
  },
  {
    name: 'European Christmas Markets',
    when: 'Late November – December',
    where: 'Vienna · Prague · Strasbourg · Dresden',
    note: 'Mulled wine, gothic squares, week-long itineraries that hop between three or four cities.',
    img: NEW_IMAGES.galwayChristmas,
    status: 'soon',
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

        {/* PROOF */}
        <section className="bucket-proof" aria-labelledby="proof-h">
          <Reveal>
            <Link to={VEGAS_PROOF.href} className="proof-card">
              <img
                src={VEGAS_PROOF.img}
                alt={VEGAS_PROOF.title}
                className="proof-card-img"
                loading="eager"
              />
              <div className="proof-card-tint" />
              <div className="proof-card-body">
                <div className="proof-card-tag" style={{ color: VEGAS_PROOF.accent }}>
                  {VEGAS_PROOF.tag}
                </div>
                <h2 id="proof-h" className="proof-card-title">
                  {VEGAS_PROOF.title}
                </h2>
                <div className="proof-card-location">{VEGAS_PROOF.location}</div>
                <p className="proof-card-desc">{VEGAS_PROOF.desc}</p>
                <div className="proof-card-cta" style={{ color: VEGAS_PROOF.accent }}>
                  OPEN FRAMEWORK &rarr;
                </div>
              </div>
            </Link>
          </Reveal>
        </section>

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
            {EVENTS.map((ev, i) => (
              <Reveal key={ev.name} delay={i * 90}>
                <article className="event-card">
                  <div className="event-card-img-wrap">
                    <img src={ev.img} alt={ev.name} className="event-card-img" loading="lazy" />
                    <div className="event-card-tint" />
                    {ev.status === 'now' ? (
                      <span className="event-pill event-pill--now">HAPPENING NOW</span>
                    ) : (
                      <span className="event-pill event-pill--soon">COMING SOON</span>
                    )}
                  </div>
                  <div className="event-card-body">
                    <h3 className="event-card-name">{ev.name}</h3>
                    <div className="event-card-when">{ev.when}</div>
                    <div className="event-card-where">{ev.where}</div>
                    <p className="event-card-note">{ev.note}</p>
                    {ev.frameworkHref ? (
                      <Link to={ev.frameworkHref} className="event-card-link">
                        {ev.frameworkLabel} &rarr;
                        <span className="event-card-sub">framework coming soon</span>
                      </Link>
                    ) : (
                      <div className="event-card-link event-card-link--muted">
                        framework coming soon
                      </div>
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
