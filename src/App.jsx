import React, { useState, useEffect, useRef, Suspense, lazy } from 'react'
import { useNavigate } from 'react-router-dom'
import { IMAGES, NEW_IMAGES, BATCH3_IMAGES } from './images-paths'
import { gsap, staggerReveal } from './utils/animations'
import Splitting from 'splitting'
import 'splitting/dist/splitting.css'
import WorldManager from './worlds/WorldManager'
import VideoBackground from './worlds/VideoBackground'
import Footer from './Footer'
const DepthHero = lazy(() => import('./worlds/DepthHero'))
const Globe = lazy(() => import('./Globe'))

/* ===== HOOKS ===== */
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

function WorldSection({ worldId, children, style = {}, fullHeight = false }) {
  return (
    <section
      data-world={worldId}
      style={{
        position: 'relative',
        zIndex: 2,
        ...(fullHeight ? { minHeight: '100vh' } : {}),
        ...style,
      }}
    >
      {children}
    </section>
  )
}

function IconChevron() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

/* ===== HERO IMAGES (locked) ===== */
const heroImages = [
  IMAGES.colosseum,
  IMAGES.opera,
  NEW_IMAGES.fitzroyBeach,
  IMAGES.iceland,
  BATCH3_IMAGES.oahuSunset,
  IMAGES.cliffs,
]

/* ===== STRIP 1 PHOTOS ===== */
const strip1 = [
  NEW_IMAGES.sagradaSunset,
  NEW_IMAGES.bondiCoastal,
  NEW_IMAGES.glendalough,
  BATCH3_IMAGES.oahuSunset,
  BATCH3_IMAGES.rockPoolSwim,
]

/* ===== STRIP 3 PHOTOS (moments) ===== */
const strip3 = [
  NEW_IMAGES.galwayGuinness,
  NEW_IMAGES.pragueOldTown,
  BATCH3_IMAGES.kangarooFeeding,
  NEW_IMAGES.castelSantAngelo,
]

/* ===== NAV ===== */
function Nav({ scrolled }) {
  const navigate = useNavigate()
  const NAV_ITEMS = [
    { label: 'Global', short: 'Global', path: '/global' },
    { label: 'Outdoors', short: 'Outdoors', path: '/outdoors' },
    { label: 'Bucket List', short: 'Bucket', path: '/bucket-list' },
    { label: 'Local', short: 'Local', path: '/local' },
  ]

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: scrolled ? '12px 0' : '16px 0',
        background: scrolled ? 'rgba(20,18,16,0.92)' : 'rgba(20,18,16,0.4)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        transition: 'all 0.3s ease',
        borderBottom: scrolled ? '1px solid rgba(201,168,76,0.1)' : '1px solid transparent',
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div
          onClick={() => navigate('/')}
          style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ color: 'var(--gold)' }}
          >
            <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1.2" />
            <ellipse cx="16" cy="16" rx="14" ry="6" stroke="currentColor" strokeWidth="1.2" />
            <line x1="2" y1="16" x2="30" y2="16" stroke="currentColor" strokeWidth="1.2" />
            <line x1="16" y1="2" x2="16" y2="30" stroke="currentColor" strokeWidth="1.2" />
          </svg>
          <span
            style={{
              fontFamily: 'var(--display)',
              fontSize: 16,
              fontWeight: 600,
              color: 'var(--cream, #e8dcc8)',
              letterSpacing: 0.5,
            }}
          >
            The Lads Travel Co.
          </span>
        </div>
        <div
          className="nav-pills"
          style={{
            display: 'flex',
            gap: 4,
            background: 'rgba(255,255,255,0.06)',
            borderRadius: 24,
            padding: 4,
          }}
        >
          {NAV_ITEMS.map((item) => (
            <button
              key={item.path}
              className="nav-pill"
              onClick={() => navigate(item.path)}
              style={{
                background: 'transparent',
                color: 'var(--cream2, #b8ad9a)',
                border: 'none',
                fontFamily: 'var(--mono)',
                fontSize: 12,
                fontWeight: 600,
                padding: '8px 18px',
                borderRadius: 20,
                cursor: 'pointer',
                letterSpacing: 0.5,
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
              }}
            >
              <span className="nav-label-full">{item.label}</span>
              <span className="nav-label-short">{item.short}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}

/* ===== DATA SPECTACLE ===== */
function useCountUp(ref, target) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let animated = false
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated) {
          animated = true
          obs.unobserve(el)
          const duration = 2000
          const start = performance.now()
          const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            el.textContent = Math.round(eased * target)
            if (progress < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.3 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [ref, target])
}

function DataSpectacle() {
  const bigRef = useRef(null)
  const stat1 = useRef(null)
  const stat2 = useRef(null)
  const stat3 = useRef(null)
  const subRef = useRef(null)

  useCountUp(bigRef, 226)
  useCountUp(stat1, 11)
  useCountUp(stat2, 21)
  useCountUp(stat3, 4)

  // Reveal subtitle via IntersectionObserver
  useEffect(() => {
    const el = subRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)'
          el.style.transition = 'opacity 0.8s ease, transform 0.8s ease'
          obs.unobserve(el)
        }
      },
      { threshold: 0.3 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section style={{ background: 'transparent', padding: '100px 0 80px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 32px', textAlign: 'center' }}>
        <div
          ref={bigRef}
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(80px, 12vw, 120px)',
            fontWeight: 700,
            color: '#d4a843',
            lineHeight: 1,
          }}
        >
          0
        </div>
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            letterSpacing: 4,
            color: '#8a8070',
            marginTop: 8,
            marginBottom: 48,
          }}
        >
          PERSONALLY VALIDATED SPOTS
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 0,
            flexWrap: 'wrap',
          }}
        >
          {[
            { ref: stat1, label: 'COUNTRIES' },
            { ref: stat2, label: 'CITIES' },
            { ref: stat3, label: 'CONTINENTS' },
          ].map((s, i) => (
            <React.Fragment key={s.label}>
              {i > 0 && (
                <div
                  style={{
                    width: 1,
                    height: 48,
                    background: 'rgba(212,168,67,0.2)',
                    margin: '0 32px',
                  }}
                />
              )}
              <div style={{ textAlign: 'center', minWidth: 80 }}>
                <div
                  ref={s.ref}
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 'clamp(32px, 5vw, 48px)',
                    fontWeight: 700,
                    color: '#d4a843',
                    lineHeight: 1,
                  }}
                >
                  0
                </div>
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10,
                    letterSpacing: 3,
                    color: '#8a8070',
                    marginTop: 6,
                  }}
                >
                  {s.label}
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>

        <p
          ref={subRef}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 15,
            fontStyle: 'italic',
            color: '#b8ad9a',
            maxWidth: 480,
            margin: '40px auto 0',
            lineHeight: 1.6,
            opacity: 0,
            transform: 'translateY(20px)',
          }}
        >
          Not scraped. Not generated. Walked into and earned.
        </p>
      </div>
    </section>
  )
}

/* ===== PHOTO STRIP ===== */
function PhotoStrip({ images, height = 220 }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${images.length}, 1fr)`,
        gap: 3,
        width: '100%',
        overflow: 'hidden',
      }}
    >
      {images.map((src, i) => (
        <div key={i} style={{ height, overflow: 'hidden' }}>
          <img
            src={src}
            alt=""
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              transition: 'transform 0.4s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          />
        </div>
      ))}
    </div>
  )
}

/* ===== CURSOR GLOW ===== */
function CursorGlow() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const move = (e) => {
      el.style.left = e.clientX + 'px'
      el.style.top = e.clientY + 'px'
    }
    window.addEventListener('mousemove', move, { passive: true })
    return () => window.removeEventListener('mousemove', move)
  }, [])
  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        width: 200,
        height: 200,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(212,168,67,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 9999,
        transform: 'translate(-50%,-50%)',
        mixBlendMode: 'screen',
      }}
    />
  )
}

/* ===== FEATURED WORK ===== */
const FEATURED = [
  {
    slug: 'dublin',
    name: 'Dublin',
    region: 'Ireland · Dublin + Galway',
    lede: 'A week of pubs, cliffs, and the West coast. Both Lads were there.',
    img: IMAGES.cliffs,
    fallbackSpots: 34,
  },
  {
    slug: 'spain',
    name: 'Spain',
    region: 'Barcelona + Madrid',
    lede: "Two cities, one framework. Brady's study-abroad city, walked.",
    img: IMAGES.sagrada,
    fallbackSpots: 33,
  },
  {
    slug: 'rome',
    name: 'Rome',
    region: 'Italy · Five days',
    lede: 'Five days that reveal themselves slowly. The Eternal City done right.',
    img: IMAGES.colosseum,
    fallbackSpots: 24,
  },
]

function countSpots(data) {
  if (!data) return 0
  let n = 0
  const walk = (o) => {
    if (!o) return
    if (Array.isArray(o)) o.forEach(walk)
    else if (typeof o === 'object') {
      if (o.name && (o.description || o.notes)) n += 1
      Object.values(o).forEach(walk)
    }
  }
  walk(data)
  return n
}

function FeaturedWork() {
  const navigate = useNavigate()
  const [counts, setCounts] = useState(
    Object.fromEntries(FEATURED.map((f) => [f.slug, f.fallbackSpots]))
  )

  useEffect(() => {
    let mounted = true
    Promise.all(FEATURED.map((f) => import(`./data/${f.slug}.js`))).then((mods) => {
      if (!mounted) return
      const live = {}
      mods.forEach((mod, i) => {
        live[FEATURED[i].slug] = countSpots(mod.default || mod) || FEATURED[i].fallbackSpots
      })
      setCounts(live)
    })
    return () => {
      mounted = false
    }
  }, [])

  return (
    <section
      style={{
        position: 'relative',
        zIndex: 2,
        padding: '80px 32px 80px',
        maxWidth: 1200,
        margin: '0 auto',
      }}
    >
      <Reveal>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 4,
              color: '#d4a843',
              marginBottom: 14,
              textTransform: 'uppercase',
            }}
          >
            THE WORK
          </div>
          <h2
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
              fontWeight: 400,
              fontStyle: 'italic',
              color: '#e8dcc8',
              lineHeight: 1.15,
              margin: 0,
            }}
          >
            Real frameworks. Real places.
          </h2>
        </div>
      </Reveal>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 20,
        }}
      >
        {FEATURED.map((card, i) => (
          <Reveal key={card.slug} delay={i * 110}>
            <a
              href={`/${card.slug}`}
              onClick={(e) => {
                e.preventDefault()
                navigate(`/${card.slug}`)
              }}
              style={{
                display: 'block',
                position: 'relative',
                aspectRatio: '4 / 5',
                borderRadius: 16,
                overflow: 'hidden',
                background: '#1c1915',
                border: '1px solid rgba(255,255,255,0.06)',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.4)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <img
                src={card.img}
                alt={card.name}
                loading="lazy"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'brightness(0.6) saturate(1.05)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(to bottom, rgba(20,18,16,0.25) 0%, rgba(20,18,16,0.2) 45%, rgba(20,18,16,0.92) 100%)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '32px 32px 28px',
                }}
              >
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: 3,
                    color: '#d4a843',
                    marginBottom: 14,
                  }}
                >
                  VALIDATED &middot; {counts[card.slug]} SPOTS
                </div>
                <h3
                  style={{
                    fontFamily: "'Fraunces', serif",
                    fontSize: 'clamp(2rem, 3.6vw, 2.6rem)',
                    fontStyle: 'italic',
                    fontWeight: 400,
                    color: '#f4ecdb',
                    lineHeight: 1.05,
                    margin: '0 0 6px',
                  }}
                >
                  {card.name}
                </h3>
                <div
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 13,
                    color: '#e8dcc8',
                    marginBottom: 14,
                  }}
                >
                  {card.region}
                </div>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 14,
                    color: '#b8ad9a',
                    lineHeight: 1.55,
                    margin: '0 0 18px',
                  }}
                >
                  {card.lede}
                </p>
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: 2,
                    color: '#d4a843',
                  }}
                >
                  OPEN FRAMEWORK &rarr;
                </div>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* ===== MAIN APP (HOMEPAGE) ===== */
export default function App() {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const ctaRef = useRef(null)
  const ctaInitRef = useRef(false)
  const heroLine1 = useRef(null)
  const heroLine2 = useRef(null)
  const heroAnimRef = useRef(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Splitting.js hero headline animation
  useEffect(() => {
    if (heroAnimRef.current) return
    heroAnimRef.current = true
    setTimeout(() => {
      ;[heroLine1, heroLine2].forEach((ref, idx) => {
        if (!ref.current) return
        Splitting({ target: ref.current, by: 'chars' })
        const chars = ref.current.querySelectorAll('.char')
        gsap.fromTo(
          chars,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.03, delay: idx * 0.3 }
        )
      })
    }, 200)
  }, [])

  useEffect(() => {
    if (ctaInitRef.current || !ctaRef.current) return
    ctaInitRef.current = true
    const pills = ctaRef.current.querySelectorAll('.cta-pill')
    if (pills.length) staggerReveal(pills, { stagger: 0.1 })
  }, [])

  return (
    <WorldManager>
      <CursorGlow />
      <Nav scrolled={scrolled} />

      {/* ===== WORLD 1: THE HOOK — Living 3D Photos ===== */}
      <WorldSection worldId="pub" style={{ minHeight: 'auto' }}>
        <Suspense fallback={<div style={{ height: '100vh', background: '#141210' }} />}>
          <DepthHero>
            <div
              style={{
                textAlign: 'center',
                maxWidth: 700,
                padding: '0 32px',
                pointerEvents: 'auto',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 11,
                  color: 'var(--gold)',
                  letterSpacing: 4,
                  marginBottom: 24,
                  textTransform: 'uppercase',
                }}
              >
                PREVIEW &middot; LAUNCHING FALL 2026
              </div>
              <h1 style={{ margin: 0, lineHeight: 1.1, marginBottom: 20 }}>
                <span
                  ref={heroLine1}
                  data-splitting=""
                  style={{
                    fontFamily: "'Space Grotesk', var(--sans)",
                    fontSize: 'clamp(36px, 5vw, 64px)',
                    fontWeight: 300,
                    color: '#fff',
                    display: 'block',
                  }}
                >
                  Step into your
                </span>
                <span
                  ref={heroLine2}
                  data-splitting=""
                  style={{
                    fontFamily: "'Fraunces', var(--display)",
                    fontSize: 'clamp(40px, 5.5vw, 72px)',
                    fontWeight: 400,
                    fontStyle: 'italic',
                    color: 'var(--gold)',
                    display: 'block',
                  }}
                >
                  comfort zone.
                </span>
              </h1>
              <p
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: 18,
                  color: '#b8ad9a',
                  maxWidth: 580,
                  margin: '0 auto',
                  lineHeight: 1.6,
                }}
              >
                AI guesses. We know. Built by friends who've actually been there.
              </p>
            </div>
            <div
              style={{
                position: 'absolute',
                bottom: 40,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 2,
                animation: 'float 2s ease-in-out infinite',
                opacity: 0.5,
                color: 'var(--cream2, #b8ad9a)',
              }}
            >
              <IconChevron />
            </div>
          </DepthHero>
        </Suspense>
      </WorldSection>

      {/* ===== FEATURED WORK — Real frameworks, real places ===== */}
      <FeaturedWork />

      {/* ===== WORLD 2: GLOBE ===== */}
      <WorldSection worldId="globe" fullHeight>
        <section style={{ padding: '60px 0 0', position: 'relative' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', textAlign: 'center' }}>
            <Suspense
              fallback={
                <div
                  style={{
                    height: '50vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 12,
                      color: '#8a8070',
                      letterSpacing: 2,
                    }}
                  >
                    LOADING GLOBE...
                  </span>
                </div>
              }
            >
              <Globe />
            </Suspense>
          </div>
        </section>
        <div style={{ textAlign: 'center', padding: '40px 32px 80px' }}>
          <Reveal>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 13,
                color: '#8a8070',
                letterSpacing: 3,
              }}
            >
              21 CITIES &middot; 4 CONTINENTS &middot; 226 SPOTS
            </div>
          </Reveal>
        </div>
      </WorldSection>

      {/* ===== WORLD 3: CITIES ===== */}
      <WorldSection worldId="cities" fullHeight>
        {/* ===== DATA SPECTACLE ===== */}
        <DataSpectacle />

        {/* ===== PHOTO STRIP 1 (range) ===== */}
        <PhotoStrip images={strip1} height={220} />

        {/* ===== FOUR PATH CTA ===== */}
        <section style={{ background: 'transparent', padding: '80px 0 100px' }}>
          <div
            style={{
              maxWidth: 700,
              margin: '0 auto',
              padding: '60px 32px',
              textAlign: 'center',
              background: 'rgba(20,18,16,0.6)',
              backdropFilter: 'blur(10px)',
              borderRadius: 16,
            }}
          >
            <Reveal>
              <h2
                style={{
                  fontFamily: "'Fraunces', var(--display)",
                  fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
                  fontWeight: 400,
                  fontStyle: 'italic',
                  color: 'var(--cream, #e8dcc8)',
                  lineHeight: 1.2,
                  marginBottom: 40,
                }}
              >
                Where do you want to go?
              </h2>
            </Reveal>
            <div
              ref={ctaRef}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                maxWidth: 400,
                margin: '0 auto',
              }}
            >
              {[
                { label: 'Browse Destinations', path: '/explore' },
                { label: 'Adventure & Treks', path: '/adventure' },
                { label: 'When to Travel', path: '/when' },
                { label: 'Start Planning', path: '/plan', primary: true },
              ].map((btn) => (
                <button
                  key={btn.path}
                  className="cta-pill"
                  onClick={() => navigate(btn.path)}
                  style={{
                    width: '100%',
                    padding: '16px 28px',
                    borderRadius: 28,
                    border: btn.primary ? 'none' : '1px solid rgba(201,168,76,0.25)',
                    background: btn.primary ? 'var(--gold, #d4a843)' : 'transparent',
                    color: btn.primary ? '#141210' : 'var(--cream, #e8dcc8)',
                    fontFamily: 'var(--sans)',
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    letterSpacing: 0.3,
                    opacity: 0,
                    transform: 'translateY(20px)',
                  }}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ===== PHOTO STRIP 3 (moments) ===== */}
        <PhotoStrip images={strip3} height={280} />
      </WorldSection>

      {/* ===== WORLD 4: WILD ===== */}
      <WorldSection worldId="wild">
        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '100px 32px 80px' }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 4,
                  color: '#b8886e',
                  marginBottom: 16,
                  textTransform: 'uppercase',
                }}
              >
                ADVENTURE
              </div>
              <h2
                style={{
                  fontFamily: "'Fraunces', var(--display)",
                  fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
                  fontWeight: 400,
                  fontStyle: 'italic',
                  color: 'var(--cream, #e8dcc8)',
                  lineHeight: 1.15,
                  marginBottom: 12,
                }}
              >
                The Ladder.
              </h2>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 15,
                  color: '#b8ad9a',
                  maxWidth: 480,
                  margin: '0 auto',
                }}
              >
                From first trails to expedition logistics.
              </p>
            </div>
          </Reveal>

          {/* Rung Cards */}
          {[
            {
              num: 'RUNG 1',
              title: 'Accessible Wilderness',
              desc: 'Day hikes and weekend trips. No experience required. Grand Canyon, Zion, Olympic.',
              pills: ['Zion', 'Olympic', 'Grand Canyon'],
              status: null,
            },
            {
              num: 'RUNG 2',
              title: 'Multi-Day Treks',
              desc: 'Three to ten days. Real preparation required. The Salkantay is the proof of concept.',
              pills: ['Salkantay', 'TMB', 'W Trek'],
              status: null,
            },
            {
              num: 'RUNG 3',
              title: 'Expedition',
              desc: 'Ten days to three weeks. This is the list we\u2019re building toward.',
              pills: ['TMB', 'Kilimanjaro', 'Everest Base Camp'],
              status: null,
            },
          ].map((rung, i) => (
            <Reveal key={rung.num} delay={i * 120}>
              <div
                style={{
                  background: '#1c1915',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 12,
                  padding: '32px 36px',
                  marginBottom: 20,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: 2,
                      color: '#b8886e',
                    }}
                  >
                    {rung.num}
                  </span>
                  {rung.status && (
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 9,
                        fontWeight: 700,
                        letterSpacing: 1,
                        padding: '3px 10px',
                        borderRadius: 20,
                        background: '#d4a843',
                        color: '#141210',
                      }}
                    >
                      {rung.status}
                    </span>
                  )}
                </div>
                <h3
                  style={{
                    fontFamily: "'Fraunces', serif",
                    fontSize: 'clamp(24px, 3vw, 32px)',
                    fontStyle: 'italic',
                    fontWeight: 400,
                    color: '#e8dcc8',
                    marginBottom: 10,
                  }}
                >
                  {rung.title}
                </h3>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 14,
                    color: '#b8ad9a',
                    lineHeight: 1.6,
                    marginBottom: 14,
                  }}
                >
                  {rung.desc}
                </p>
                {rung.pills.length > 0 && (
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {rung.pills.map((p) => (
                      <span
                        key={p}
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: 10,
                          letterSpacing: 1,
                          color: '#d4a843',
                          padding: '4px 12px',
                          borderRadius: 16,
                          border: '1px solid rgba(212,168,67,0.3)',
                        }}
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Reveal>
          ))}

          {/* Salkantay Callout */}
          <Reveal delay={400}>
            <div
              style={{
                padding: '24px 28px',
                borderRadius: 8,
                background: 'rgba(184,136,110,0.06)',
                borderLeft: '3px solid #b8886e',
                marginTop: 12,
              }}
            >
              <div
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: 18,
                  fontStyle: 'italic',
                  color: '#e8dcc8',
                  marginBottom: 8,
                }}
              >
                SALKANTAY + MACHU PICCHU
              </div>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 13,
                  color: '#b8ad9a',
                  lineHeight: 1.5,
                  marginBottom: 2,
                }}
              >
                Brady completed the Salkantay trek in May 2026.
              </p>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 13,
                  color: '#8a8070',
                  lineHeight: 1.5,
                }}
              >
                Framework coming soon.
              </p>
            </div>
          </Reveal>

          {/* Adventure video */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
            <VideoBackground
              publicId="SmokeyNP_eewi1h"
              posterTime={3}
              placement="portrait-frame"
              hasAudio={false}
              isActive={true}
            />
          </div>
        </section>
      </WorldSection>

      {/* ===== WORLD 6: SYSTEM ===== */}
      <WorldSection worldId="system">
        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '100px 32px 80px' }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 4,
                  color: '#b8886e',
                  marginBottom: 16,
                  textTransform: 'uppercase',
                }}
              >
                HOW IT WORKS
              </div>
              <h2
                style={{
                  fontFamily: "'Fraunces', var(--display)",
                  fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
                  fontWeight: 400,
                  fontStyle: 'italic',
                  color: 'var(--cream, #e8dcc8)',
                  lineHeight: 1.15,
                  marginBottom: 12,
                }}
              >
                The System
              </h2>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 15,
                  color: '#b8ad9a',
                  maxWidth: 520,
                  margin: '0 auto',
                }}
              >
                226 spots. 11 countries. Built on data, not guesses.
              </p>
            </div>
          </Reveal>

          {/* 5-Step Process */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 8,
              flexWrap: 'wrap',
              marginBottom: 60,
            }}
          >
            {['Research', 'Validate', 'Rate', 'Build', 'Deliver'].map((step, i) => (
              <Reveal key={step} delay={i * 80}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div
                    style={{
                      background: '#1c1915',
                      border: '1px solid rgba(201,168,76,0.2)',
                      borderRadius: 24,
                      padding: '10px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 10,
                        fontWeight: 700,
                        color: '#d4a843',
                      }}
                    >
                      0{i + 1}
                    </span>
                    <span
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 13,
                        fontWeight: 600,
                        color: '#e8dcc8',
                      }}
                    >
                      {step}
                    </span>
                  </div>
                  {i < 4 && <span style={{ color: '#5a5550', fontSize: 16 }}>{'\u2192'}</span>}
                </div>
              </Reveal>
            ))}
          </div>

          {/* Stat Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 20,
              marginBottom: 60,
            }}
          >
            {[
              { value: '226', label: 'VALIDATED SPOTS', sub: 'Walked into. Not scraped.' },
              { value: '11', label: 'COUNTRIES', sub: '4 continents. 21 cities.' },
              {
                value: '6',
                label: 'AI RESEARCH AGENTS',
                sub: 'Flight, cost, neighborhood, validation, booking, local intel.',
              },
            ].map((stat, i) => (
              <Reveal key={stat.label} delay={i * 100}>
                <div
                  style={{
                    background: '#1c1915',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 12,
                    padding: '36px 28px',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: 48,
                      fontWeight: 700,
                      color: '#d4a843',
                      lineHeight: 1,
                      marginBottom: 8,
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 10,
                      letterSpacing: 3,
                      color: '#8a8070',
                      marginBottom: 10,
                    }}
                  >
                    {stat.label}
                  </div>
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 13,
                      color: '#b8ad9a',
                      lineHeight: 1.5,
                    }}
                  >
                    {stat.sub}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Quote */}
          <Reveal>
            <blockquote
              style={{
                textAlign: 'center',
                maxWidth: 640,
                margin: '0 auto',
                padding: '32px 0',
                borderTop: '1px solid rgba(201,168,76,0.12)',
                borderBottom: '1px solid rgba(201,168,76,0.12)',
              }}
            >
              <p
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: 'clamp(18px, 2.5vw, 22px)',
                  fontStyle: 'italic',
                  fontWeight: 400,
                  color: '#e8dcc8',
                  lineHeight: 1.6,
                  marginBottom: 12,
                }}
              >
                "90% of AI-generated travel itineraries contain factual errors. We fix that."
              </p>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  letterSpacing: 2,
                  color: '#8a8070',
                }}
              >
                FIRSTHAND KNOWLEDGE + DATA SCIENCE + AI RESEARCH
              </div>
            </blockquote>
          </Reveal>
        </section>
      </WorldSection>

      {/* ===== WORLD 7: PUB RETURN ===== */}
      <WorldSection worldId="pub-return">
        <section id="team" style={{ maxWidth: 1200, margin: '0 auto', padding: '100px 32px 80px' }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 4,
                  color: '#b8886e',
                  marginBottom: 16,
                  textTransform: 'uppercase',
                }}
              >
                THE LADS
              </div>
              <h2
                style={{
                  fontFamily: "'Fraunces', var(--display)",
                  fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
                  fontWeight: 400,
                  fontStyle: 'italic',
                  color: 'var(--cream, #e8dcc8)',
                  lineHeight: 1.15,
                  marginBottom: 12,
                }}
              >
                Let&rsquo;s Plan Your Trip
              </h2>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 15,
                  color: '#b8ad9a',
                  maxWidth: 520,
                  margin: '0 auto',
                }}
              >
                You&rsquo;ve seen where we&rsquo;ve been. Now let&rsquo;s plan where you&rsquo;re
                going.
              </p>
            </div>
          </Reveal>

          {/* Team Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 20,
              marginBottom: 60,
            }}
          >
            {[
              {
                name: 'Brady',
                role: 'Builder / Data Science',
                line: 'M.S. Applied Statistics. The builder. 20+ cities, 4 continents.',
              },
              {
                name: 'Dawson',
                role: 'Analytics / Firsthand Knowledge',
                line: 'Data Analytics. Madrid, Iceland Ring Road, Rome, Paris.',
              },
              {
                name: 'Stew',
                role: 'Sales / Outreach',
                line: 'Sales. Chicago. Client outreach and networking.',
              },
            ].map((member, i) => (
              <Reveal key={member.name} delay={i * 120}>
                <div
                  style={{
                    background: '#1c1915',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 12,
                    padding: '32px 28px',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      background: 'rgba(201,168,76,0.1)',
                      border: '1px solid rgba(201,168,76,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Fraunces', serif",
                        fontSize: 22,
                        fontStyle: 'italic',
                        color: '#d4a843',
                      }}
                    >
                      {member.name[0]}
                    </span>
                  </div>
                  <h3
                    style={{
                      fontFamily: "'Fraunces', serif",
                      fontSize: 24,
                      fontStyle: 'italic',
                      fontWeight: 400,
                      color: '#e8dcc8',
                      marginBottom: 4,
                    }}
                  >
                    {member.name}
                  </h3>
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 10,
                      letterSpacing: 2,
                      color: '#b8886e',
                      marginBottom: 14,
                    }}
                  >
                    {member.role}
                  </div>
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 14,
                      color: '#b8ad9a',
                      lineHeight: 1.6,
                    }}
                  >
                    {member.line}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* CTA */}
          <Reveal>
            <div style={{ textAlign: 'center' }}>
              <button
                onClick={() => navigate('/plan')}
                style={{
                  padding: '16px 40px',
                  borderRadius: 28,
                  border: 'none',
                  background: 'var(--gold, #d4a843)',
                  color: '#141210',
                  fontFamily: 'var(--sans)',
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: 'pointer',
                  letterSpacing: 0.3,
                  transition: 'all 0.2s ease',
                  marginBottom: 20,
                }}
              >
                Start Planning
              </button>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 12,
                  color: '#8a8070',
                  letterSpacing: 1,
                }}
              >
                <a
                  href="mailto:brady@ladstravel.com"
                  style={{ color: '#b8ad9a', textDecoration: 'none' }}
                >
                  brady@ladstravel.com
                </a>
              </div>
            </div>
          </Reveal>
        </section>
      </WorldSection>

      {/* Float animation */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(8px); }
        }
        [data-splitting] .char { display: inline-block; }
      `}</style>

      <Footer />
    </WorldManager>
  )
}

export { Nav, PhotoStrip }
