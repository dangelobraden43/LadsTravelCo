import React, { useEffect, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { Nav } from './App'
import Footer from './Footer'
import { HERO_IMAGES, NEW_IMAGES } from './images-paths'
import './OutdoorsPage.css'

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

const LADDER = [
  {
    rung: 'BASE CAMP',
    title: 'Day hikes & weekends.',
    desc: 'No experience required. Trails you can fly into on Friday and be back at work Monday.',
    pills: ['Zion', 'Olympic', 'Grand Canyon'],
    photo: HERO_IMAGES.olympicDeerAboveClouds,
  },
  {
    rung: 'MULTI-DAY',
    title: 'Three to ten days on trail.',
    desc: 'Real preparation. Permits, gear, conditioning. The terrain people train a year for.',
    pills: ['Salkantay', 'Tour du Mont Blanc', 'W Trek'],
    photo: NEW_IMAGES.mountainOverlook,
  },
  {
    rung: 'EXPEDITION',
    title: 'The list we are building toward.',
    desc: 'Ten days to three weeks. Altitude, logistics, expedition-grade prep. The trips that earn their place.',
    pills: ['Everest Base Camp', 'Kilimanjaro', 'Patagonia'],
    photo: HERO_IMAGES.hiking_7103980642848666692,
  },
]

const COMING_SOON = [
  {
    name: 'Tour du Mont Blanc',
    region: 'France · Italy · Switzerland',
    note: '170 km · 11 days · refuge-to-refuge',
  },
  { name: 'Everest Base Camp', region: 'Nepal', note: '130 km · 12 days · 5,364 m at camp' },
  { name: 'Kilimanjaro', region: 'Tanzania', note: '65 km · 7 days · 5,895 m at the summit' },
  {
    name: 'Bruce Peninsula',
    region: 'Ontario, Canada',
    note: 'Day hikes on the Bruce Trail along Georgian Bay — the Grotto and the cliffs out toward Tobermory.',
  },
]

export default function OutdoorsPage() {
  useEffect(() => {
    if (!window.location.hash) window.scrollTo(0, 0)
  }, [])

  const scrollToFollow = (e) => {
    e.preventDefault()
    const el = document.getElementById('follow-along')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <Helmet>
        <title>Outdoors &mdash; The Lads Travel Co.</title>
        <meta
          name="description"
          content="Treks, hikes, and backpacking. From your first day hike to the trip you train a year for."
        />
        <link rel="canonical" href="https://ladstravel.com/outdoors" />
      </Helmet>

      <Nav scrolled={true} />

      <main className="outdoors-page">
        {/* HERO */}
        <header className="outdoors-hero">
          <img
            src={HERO_IMAGES.olympicDeerAboveClouds}
            alt="Olympic National Park"
            className="outdoors-hero-img"
            loading="eager"
          />
          <div className="outdoors-hero-tint" />
          <div className="outdoors-hero-inner">
            <Reveal>
              <div className="outdoors-eyebrow">LADS OUTDOORS</div>
              <h1 className="outdoors-h1">Where the trail starts.</h1>
              <p className="outdoors-lede">
                Treks, hikes, backpacking. From your first day hike to the trip you train a year
                for.
              </p>
            </Reveal>
          </div>
        </header>

        {/* THE LADDER */}
        <section className="outdoors-ladder" aria-labelledby="ladder-h">
          <Reveal>
            <div className="outdoors-section-head">
              <div className="outdoors-section-eyebrow">THE LADDER</div>
              <h2 id="ladder-h" className="outdoors-section-h">
                Three steps. One progression.
              </h2>
            </div>
          </Reveal>

          {LADDER.map((row, i) => (
            <Reveal key={row.rung} delay={i * 80}>
              <article className={`ladder-row ladder-row--${i % 2 === 0 ? 'a' : 'b'}`}>
                <div className="ladder-row-img">
                  <img src={row.photo} alt={row.title} loading="lazy" />
                </div>
                <div className="ladder-row-body">
                  <div className="ladder-row-rung">{row.rung}</div>
                  <h3 className="ladder-row-title">{row.title}</h3>
                  <p className="ladder-row-desc">{row.desc}</p>
                  <div className="ladder-row-pills">
                    {row.pills.map((p) => (
                      <span key={p} className="ladder-pill">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </section>

        {/* SALKANTAY BLOCK */}
        <section className="outdoors-salkantay" aria-labelledby="salk-h">
          <Reveal>
            <div className="salk-card">
              <div className="salk-card-eyebrow">VALIDATED &middot; MAY 2026</div>
              <h2 id="salk-h" className="salk-card-h">
                Salkantay to Machu Picchu.
              </h2>
              <p className="salk-card-body">
                Our first validated trek &mdash; Brady completed Salkantay to Machu Picchu in May
                2026. The route ran Lima to Huacachina, then five days on the Salkantay trail: over
                the Salkantay Pass at roughly 4,600 m, past the glacial turquoise of Humantay Lake,
                and down through cloud forest to Machu Picchu itself. The first Lads Travel YouTube
                video is coming, and the full framework with it. Follow along to see it first.
              </p>
              <div className="salk-card-chips" aria-label="Trek at a glance">
                <span className="salk-chip">5 days on trail</span>
                <span className="salk-chip">~74 km</span>
                <span className="salk-chip">4,600 m pass</span>
                <span className="salk-chip">Humantay Lake</span>
              </div>
              <a href="#follow-along" onClick={scrollToFollow} className="salk-card-cta">
                Follow along <span aria-hidden="true">&darr;</span>
              </a>
            </div>
          </Reveal>
        </section>

        {/* COMING SOON */}
        <section className="outdoors-coming" aria-labelledby="coming-h">
          <Reveal>
            <div className="outdoors-section-head">
              <div className="outdoors-section-eyebrow">ON THE BOARD</div>
              <h2 id="coming-h" className="outdoors-section-h">
                The treks we are building.
              </h2>
            </div>
          </Reveal>
          <div className="coming-grid">
            {COMING_SOON.map((c, i) => (
              <Reveal key={c.name} delay={i * 80}>
                <div className="coming-card">
                  <div className="coming-card-name">{c.name}</div>
                  <div className="coming-card-region">{c.region}</div>
                  <div className="coming-card-note">{c.note}</div>
                  <div className="coming-card-badge">Coming soon</div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
