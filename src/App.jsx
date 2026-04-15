import React, { useState, useEffect, useRef, Suspense, lazy } from 'react'
import { useNavigate } from 'react-router-dom'
import { IMAGES, NEW_IMAGES, BATCH3_IMAGES } from './images-paths'
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

/* ===== HERO IMAGES ===== */
const heroImages = [
  IMAGES.colosseum,
  IMAGES.opera,
  NEW_IMAGES.sagradaSunset,
  IMAGES.cliffs,
  NEW_IMAGES.fitzroyBeach,
  BATCH3_IMAGES.oahuSunset,
]

/* ===== NAV ===== */
function Nav({ scrolled }) {
  const navigate = useNavigate()

  const NAV_ITEMS = [
    { label: 'Explore', path: '/explore' },
    { label: 'Adventure', path: '/adventure' },
    { label: 'When', path: '/when' },
    { label: 'Plan', path: '/plan' },
    { label: 'The Lads', path: '/lads' },
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
        borderBottom: scrolled
          ? '1px solid rgba(201,168,76,0.1)'
          : '1px solid transparent',
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
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'var(--gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--display)',
              fontSize: 18,
              fontWeight: 700,
              color: '#1a1a1a',
            }}
          >
            L
          </div>
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
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}

/* ===== MAIN APP (HOMEPAGE) ===== */
export default function App() {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [heroImg, setHeroImg] = useState(0)

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

  return (
    <>
      <Nav scrolled={scrolled} />

      {/* ===== HERO ===== */}
      <section
        className="hero"
        style={{
          position: 'relative',
          height: '100vh',
          minHeight: 700,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {heroImages.map((src, i) => (
          <div
            key={i}
            className="hero-bg"
            style={{
              position: 'absolute',
              inset: 0,
              opacity: heroImg === i ? 1 : 0,
              transition: 'opacity 1.2s ease-in-out',
              zIndex: 0,
            }}
          >
            <img
              src={src}
              alt=""
              loading="eager"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        ))}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, rgba(20,18,16,0.45) 0%, rgba(20,18,16,0.25) 40%, rgba(20,18,16,0.75) 70%, var(--bg) 100%)',
            zIndex: 1,
          }}
        />
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            textAlign: 'center',
            maxWidth: 700,
            padding: '0 32px',
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
            FREE PERSONAL TRAVEL CONSULTING THROUGH 2026
          </div>
          <h1 style={{ margin: 0, lineHeight: 1.1, marginBottom: 20 }}>
            <span
              style={{
                fontFamily: "'Space Grotesk', var(--sans)",
                fontSize: 'clamp(36px, 5vw, 64px)',
                fontWeight: 300,
                color: '#fff',
                display: 'block',
              }}
            >
              Travel Like
            </span>
            <span
              style={{
                fontFamily: "'Fraunces', var(--display)",
                fontSize: 'clamp(40px, 5.5vw, 72px)',
                fontWeight: 400,
                fontStyle: 'italic',
                color: 'var(--gold)',
                display: 'block',
              }}
            >
              You Know Someone
            </span>
          </h1>
          <p
            style={{
              fontFamily: 'var(--sans)',
              fontSize: 16,
              color: 'var(--cream2, #b8ad9a)',
              maxWidth: 580,
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            Two friends. Four continents. Every recommendation from personal experience.
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
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            right: 32,
            zIndex: 2,
            display: 'flex',
            gap: 8,
            alignItems: 'center',
          }}
        >
          {heroImages.map((_, i) => (
            <div
              key={i}
              onClick={() => setHeroImg(i)}
              style={{
                width: heroImg === i ? 24 : 8,
                height: 8,
                borderRadius: 4,
                background: heroImg === i ? 'var(--gold)' : 'rgba(255,255,255,0.3)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>
      </section>

      {/* ===== GLOBE + DATABASE ===== */}
      <section
        style={{
          background: 'var(--bg, #141210)',
          padding: '60px 0 40px',
          position: 'relative',
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '0 32px',
            textAlign: 'center',
          }}
        >
          <Reveal type="fade">
            <div
              style={{
                fontFamily: 'var(--mono)',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: 4,
                color: 'var(--gold)',
                marginBottom: 16,
              }}
            >
              THE DATABASE
            </div>
            <h2
              style={{
                fontFamily: "'Fraunces', var(--display)",
                fontSize: 'clamp(1.8rem, 4vw, 3rem)',
                fontWeight: 400,
                color: 'var(--cream, #e8dcc8)',
                lineHeight: 1.2,
                marginBottom: 8,
              }}
            >
              180+ Spots. 29 Cities. 13 Countries.
            </h2>
            <p
              style={{
                fontFamily: 'var(--sans)',
                fontSize: 15,
                color: 'var(--cream2, #b8ad9a)',
                marginBottom: 0,
              }}
            >
              Every one walked into, sat down at, or stumbled out of.
            </p>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 20,
                marginTop: 28,
                flexWrap: 'wrap',
              }}
            >
              {[
                { n: '180+', l: 'Validated Spots' },
                { n: '29', l: 'Cities' },
                { n: '13', l: 'Countries' },
                { n: '4', l: 'Continents' },
              ].map((s, i) => (
                <div
                  key={i}
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(201,168,76,0.15)',
                    borderRadius: 12,
                    padding: '12px 20px',
                    textAlign: 'center',
                    minWidth: 90,
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--mono)',
                      fontSize: 20,
                      fontWeight: 700,
                      color: 'var(--gold)',
                    }}
                  >
                    {s.n}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--sans)',
                      fontSize: 11,
                      color: 'var(--cream2)',
                      marginTop: 2,
                    }}
                  >
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
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
                    fontFamily: 'var(--mono)',
                    fontSize: 12,
                    color: 'var(--muted)',
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

      {/* ===== WHERE DO YOU WANT TO GO? ===== */}
      <section
        style={{
          background: 'var(--bg, #141210)',
          padding: '80px 0 100px',
        }}
      >
        <div
          style={{
            maxWidth: 700,
            margin: '0 auto',
            padding: '0 32px',
            textAlign: 'center',
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
            ].map((btn, i) => (
              <Reveal key={btn.path} delay={i * 80}>
                <button
                  onClick={() => navigate(btn.path)}
                  style={{
                    width: '100%',
                    padding: '16px 28px',
                    borderRadius: 28,
                    border: btn.primary
                      ? 'none'
                      : '1px solid rgba(201,168,76,0.25)',
                    background: btn.primary
                      ? 'var(--gold, #d4a843)'
                      : 'transparent',
                    color: btn.primary
                      ? '#141210'
                      : 'var(--cream, #e8dcc8)',
                    fontFamily: 'var(--sans)',
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    letterSpacing: 0.3,
                  }}
                >
                  {btn.label}
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Float animation */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(8px); }
        }
      `}</style>
    </>
  )
}

export { Nav }
