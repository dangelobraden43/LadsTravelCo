import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Nav } from './App'
import Footer from './Footer'
import { HERO_IMAGES } from './images-paths'
import './LocalPage.css'

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

const DESTINATIONS = [
  {
    name: 'Michigan',
    region: 'Lower Peninsula · Upper Peninsula · Detroit',
    tag: 'HOME TURF',
    line: 'Breweries, golf, concerts, road trips. Every region across both peninsulas, validated.',
    href: '/michigan',
    img: HERO_IMAGES.smokyMountainsCabinOverlook,
    accent: '#96782a',
  },
]

export default function LocalPage() {
  useEffect(() => {
    if (!window.location.hash) window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <Helmet>
        <title>Local &mdash; The Lads Travel Co.</title>
        <meta
          name="description"
          content="Domestic and close-to-home trips. Engineered the same as the international ones."
        />
        <link rel="canonical" href="https://ladstravel.com/local" />
      </Helmet>

      <Nav scrolled={true} />

      <main className="local-page">
        {/* HERO */}
        <header className="local-hero">
          <Reveal>
            <div className="local-eyebrow">LADS LOCAL</div>
            <h1 className="local-h1">Closer than you think.</h1>
            <p className="local-lede">
              Domestic and close-to-home trips, engineered the same way as the international ones.
              Same data, same depth, same standard.
            </p>
          </Reveal>
        </header>

        {/* CARDS */}
        <section className="local-grid-section" aria-labelledby="cards-h">
          <h2 id="cards-h" className="sr-only">
            Local destinations
          </h2>
          <div className="local-grid">
            {DESTINATIONS.map((d, i) => (
              <Reveal key={d.name} delay={i * 120}>
                <Link to={d.href} className="local-card" style={{ '--card-accent': d.accent }}>
                  <img src={d.img} alt={d.name} className="local-card-img" loading="lazy" />
                  <div className="local-card-tint" />
                  <div className="local-card-body">
                    <div className="local-card-tag">{d.tag}</div>
                    <h3 className="local-card-name">{d.name}</h3>
                    <div className="local-card-region">{d.region}</div>
                    <p className="local-card-line">{d.line}</p>
                    <div className="local-card-cta">OPEN FRAMEWORK &rarr;</div>
                  </div>
                </Link>
              </Reveal>
            ))}
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
      </main>

      <Footer />
    </>
  )
}
