import React, { useState, useEffect, useRef, Suspense, lazy } from 'react'
import { useNavigate } from 'react-router-dom'
import { IMAGES, NEW_IMAGES, BATCH3_IMAGES, HERO_IMAGES } from './images-paths'
import { gsap, countUpOnScroll, revealOnScroll, staggerReveal } from './utils/animations'
import Splitting from 'splitting'
import 'splitting/dist/splitting.css'
const Globe = lazy(() => import('./Globe'))

/* ===== HOOKS ===== */
function useReveal(threshold = 0.15) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.unobserve(el) } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}

function Reveal({ children, style = {}, delay = 0, type = 'up' }) {
  const ref = useReveal()
  const cls = type === 'up' ? 'reveal' : type === 'fade' ? 'reveal-fade' : type === 'scale' ? 'reveal-scale' : 'reveal'
  const s = delay ? { ...style, transitionDelay: `${delay}ms` } : style
  return <div ref={ref} className={cls} style={s}>{children}</div>
}

function IconChevron() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
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
    { label: 'Explore', short: 'Explore', path: '/explore' },
    { label: 'Adventure', short: 'Trek', path: '/adventure' },
    { label: 'When', short: 'When', path: '/when' },
    { label: 'Plan', short: 'Plan', path: '/plan' },
    { label: 'The Lads', short: 'Lads', path: '/lads' },
  ]

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      padding: scrolled ? '12px 0' : '16px 0',
      background: scrolled ? 'rgba(20,18,16,0.92)' : 'rgba(20,18,16,0.4)',
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      transition: 'all 0.3s ease',
      borderBottom: scrolled ? '1px solid rgba(201,168,76,0.1)' : '1px solid transparent',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: 'var(--gold)' }}>
            <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1.2"/>
            <ellipse cx="16" cy="16" rx="14" ry="6" stroke="currentColor" strokeWidth="1.2"/>
            <line x1="2" y1="16" x2="30" y2="16" stroke="currentColor" strokeWidth="1.2"/>
            <line x1="16" y1="2" x2="16" y2="30" stroke="currentColor" strokeWidth="1.2"/>
          </svg>
          <span style={{ fontFamily: 'var(--display)', fontSize: 16, fontWeight: 600, color: 'var(--cream, #e8dcc8)', letterSpacing: 0.5 }}>The Lads Travel Co.</span>
        </div>
        <div className="nav-pills" style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 24, padding: 4 }}>
          {NAV_ITEMS.map((item) => (
            <button key={item.path} className="nav-pill" onClick={() => navigate(item.path)} style={{
              background: 'transparent', color: 'var(--cream2, #b8ad9a)', border: 'none',
              fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 600, padding: '8px 18px',
              borderRadius: 20, cursor: 'pointer', letterSpacing: 0.5, transition: 'all 0.2s ease', whiteSpace: 'nowrap',
            }}>
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
function DataSpectacle() {
  const bigRef = useRef(null)
  const stat1 = useRef(null)
  const stat2 = useRef(null)
  const stat3 = useRef(null)
  const subRef = useRef(null)
  const [init, setInit] = useState(false)

  useEffect(() => {
    if (init) return
    setInit(true)
    if (bigRef.current) countUpOnScroll(bigRef.current, 183, '')
    if (stat1.current) countUpOnScroll(stat1.current, 13, '')
    if (stat2.current) countUpOnScroll(stat2.current, 29, '')
    if (stat3.current) countUpOnScroll(stat3.current, 4, '')
    if (subRef.current) revealOnScroll(subRef.current, { delay: 0.4 })
  }, [init])

  return (
    <section style={{ background: '#141210', padding: '100px 0 80px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 32px', textAlign: 'center' }}>
        <div ref={bigRef} style={{
          fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(80px, 12vw, 120px)',
          fontWeight: 700, color: '#d4a843', lineHeight: 1,
        }}>0</div>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: 4,
          color: '#8a8070', marginTop: 8, marginBottom: 48,
        }}>PERSONALLY VALIDATED SPOTS</div>

        <div style={{
          display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 0,
          flexWrap: 'wrap',
        }}>
          {[
            { ref: stat1, label: 'COUNTRIES' },
            { ref: stat2, label: 'CITIES' },
            { ref: stat3, label: 'CONTINENTS' },
          ].map((s, i) => (
            <React.Fragment key={s.label}>
              {i > 0 && <div style={{ width: 1, height: 48, background: 'rgba(212,168,67,0.2)', margin: '0 32px' }} />}
              <div style={{ textAlign: 'center', minWidth: 80 }}>
                <div ref={s.ref} style={{
                  fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(32px, 5vw, 48px)',
                  fontWeight: 700, color: '#d4a843', lineHeight: 1,
                }}>0</div>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 3,
                  color: '#8a8070', marginTop: 6,
                }}>{s.label}</div>
              </div>
            </React.Fragment>
          ))}
        </div>

        <p ref={subRef} style={{
          fontFamily: "'Inter', sans-serif", fontSize: 15, fontStyle: 'italic',
          color: '#b8ad9a', maxWidth: 480, margin: '40px auto 0', lineHeight: 1.6,
          opacity: 0, transform: 'translateY(20px)',
        }}>
          Not scraped. Not generated. Walked into and earned.
        </p>
      </div>
    </section>
  )
}

/* ===== PHOTO STRIP ===== */
function PhotoStrip({ images, height = 220 }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${images.length}, 1fr)`, gap: 3, width: '100%', overflow: 'hidden' }}>
      {images.map((src, i) => (
        <div key={i} style={{ height, overflow: 'hidden' }}>
          <img src={src} alt="" loading="lazy" style={{
            width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center',
            transition: 'transform 0.4s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
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
  return <div ref={ref} style={{
    position: 'fixed', width: 200, height: 200, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(212,168,67,0.06) 0%, transparent 70%)',
    pointerEvents: 'none', zIndex: 9999, transform: 'translate(-50%,-50%)',
    mixBlendMode: 'screen',
  }} />
}

/* ===== MAIN APP (HOMEPAGE) ===== */
export default function App() {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [heroImg, setHeroImg] = useState(0)
  const ctaRef = useRef(null)
  const [ctaInit, setCtaInit] = useState(false)
  const heroLine1 = useRef(null)
  const heroLine2 = useRef(null)
  const [heroAnimDone, setHeroAnimDone] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroImg((prev) => (prev + 1) % heroImages.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  // Splitting.js hero headline animation
  useEffect(() => {
    if (heroAnimDone) return
    setHeroAnimDone(true)
    setTimeout(() => {
      ;[heroLine1, heroLine2].forEach((ref, idx) => {
        if (!ref.current) return
        Splitting({ target: ref.current, by: 'chars' })
        const chars = ref.current.querySelectorAll('.char')
        gsap.fromTo(chars,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.03, delay: idx * 0.3 }
        )
      })
    }, 200)
  }, [heroAnimDone])

  useEffect(() => {
    if (ctaInit || !ctaRef.current) return
    setCtaInit(true)
    const pills = ctaRef.current.querySelectorAll('.cta-pill')
    if (pills.length) staggerReveal(pills, { stagger: 0.1 })
  }, [ctaInit])

  return (
    <>
      <CursorGlow />
      <Nav scrolled={scrolled} />

      {/* ===== HERO ===== */}
      <section className="hero" style={{
        position: 'relative', height: '100vh', minHeight: 700,
        overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {heroImages.map((src, i) => (
          <div key={i} className="hero-bg" style={{
            position: 'absolute', inset: 0, opacity: heroImg === i ? 1 : 0,
            transition: 'opacity 1.2s ease-in-out', zIndex: 0,
          }}>
            <img src={src} alt="" loading="eager" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        ))}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(20,18,16,0.45) 0%, rgba(20,18,16,0.25) 40%, rgba(20,18,16,0.75) 70%, var(--bg) 100%)',
          zIndex: 1,
        }} />
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: 700, padding: '0 32px' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--gold)', letterSpacing: 4, marginBottom: 24, textTransform: 'uppercase' }}>
            FREE PERSONAL TRAVEL CONSULTING THROUGH 2026
          </div>
          <h1 style={{ margin: 0, lineHeight: 1.1, marginBottom: 20 }}>
            <span ref={heroLine1} data-splitting="" style={{ fontFamily: "'Space Grotesk', var(--sans)", fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 300, color: '#fff', display: 'block' }}>Travel Like</span>
            <span ref={heroLine2} data-splitting="" style={{ fontFamily: "'Fraunces', var(--display)", fontSize: 'clamp(40px, 5.5vw, 72px)', fontWeight: 400, fontStyle: 'italic', color: 'var(--gold)', display: 'block' }}>You Know Someone</span>
          </h1>
          <p style={{ fontFamily: 'var(--sans)', fontSize: 18, color: '#b8ad9a', maxWidth: 580, margin: '0 auto', lineHeight: 1.6 }}>
            Free trip planning from two guys who've actually been there.
          </p>
        </div>
        <div style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', zIndex: 2, animation: 'float 2s ease-in-out infinite', opacity: 0.5, color: 'var(--cream2, #b8ad9a)' }}>
          <IconChevron />
        </div>
        <div style={{ position: 'absolute', bottom: 40, right: 32, zIndex: 2, display: 'flex', gap: 8, alignItems: 'center' }}>
          {heroImages.map((_, i) => (
            <div key={i} onClick={() => setHeroImg(i)} style={{
              width: heroImg === i ? 24 : 8, height: 8, borderRadius: 4,
              background: heroImg === i ? 'var(--gold)' : 'rgba(255,255,255,0.3)',
              cursor: 'pointer', transition: 'all 0.3s ease',
            }} />
          ))}
        </div>
      </section>

      {/* ===== GLOBE ===== */}
      <section style={{ background: '#141210', padding: '60px 0 0', position: 'relative' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', textAlign: 'center' }}>
          <Suspense fallback={<div style={{ height: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#8a8070', letterSpacing: 2 }}>LOADING GLOBE...</span></div>}>
            <Globe />
          </Suspense>
        </div>
      </section>

      {/* ===== DATA SPECTACLE ===== */}
      <DataSpectacle />

      {/* ===== PHOTO STRIP 1 (range) ===== */}
      <PhotoStrip images={strip1} height={220} />

      {/* ===== FOUR PATH CTA ===== */}
      <section style={{ background: 'var(--bg, #141210)', padding: '80px 0 100px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 32px', textAlign: 'center' }}>
          <Reveal>
            <h2 style={{
              fontFamily: "'Fraunces', var(--display)", fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              fontWeight: 400, fontStyle: 'italic', color: 'var(--cream, #e8dcc8)', lineHeight: 1.2, marginBottom: 40,
            }}>Where do you want to go?</h2>
          </Reveal>
          <div ref={ctaRef} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 400, margin: '0 auto' }}>
            {[
              { label: 'Browse Destinations', path: '/explore' },
              { label: 'Adventure & Treks', path: '/adventure' },
              { label: 'When to Travel', path: '/when' },
              { label: 'Start Planning', path: '/plan', primary: true },
            ].map((btn) => (
              <button key={btn.path} className="cta-pill" onClick={() => navigate(btn.path)} style={{
                width: '100%', padding: '16px 28px', borderRadius: 28,
                border: btn.primary ? 'none' : '1px solid rgba(201,168,76,0.25)',
                background: btn.primary ? 'var(--gold, #d4a843)' : 'transparent',
                color: btn.primary ? '#141210' : 'var(--cream, #e8dcc8)',
                fontFamily: 'var(--sans)', fontSize: 15, fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.2s ease', letterSpacing: 0.3,
                opacity: 0, transform: 'translateY(20px)',
              }}>{btn.label}</button>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PHOTO STRIP 3 (moments) ===== */}
      <PhotoStrip images={strip3} height={280} />

      {/* Float animation */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(8px); }
        }
        .nav-label-short { display: none; }
        [data-splitting] .char { display: inline-block; }
        @media(max-width:640px) {
          .nav-label-full { display: none; }
          .nav-label-short { display: inline; }
        }
        @media(max-width:768px) {
          .photo-strip-responsive { grid-template-columns: repeat(3, 1fr) !important; }
        }
      `}</style>
    </>
  )
}

export { Nav, PhotoStrip }
