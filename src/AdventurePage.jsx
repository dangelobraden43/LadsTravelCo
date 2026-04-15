import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Nav } from './App'
import { IMAGES, NEW_IMAGES, HERO_IMAGES, HEIC_HERO_IMAGES } from './images-paths'

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

const RUNGS = [
  {
    num: 'RUNG 1',
    title: 'Accessible Wilderness',
    desc: 'Day hikes and weekend trips. No experience required. Grand Canyon, Zion, Olympic.',
    photo: HERO_IMAGES.olympicDeerAboveClouds,
    pills: ['Zion', 'Olympic', 'Grand Canyon'],
    status: null,
  },
  {
    num: 'RUNG 2',
    title: 'Multi-Day Treks',
    desc: 'Three to ten days. Real preparation required. The Salkantay is the proof of concept.',
    photo: NEW_IMAGES.mountainOverlook,
    pills: [],
    status: 'now',
    callout: {
      title: 'SALKANTAY + MACHU PICCHU',
      line1: 'Brady is on this trek May 3\u201313, 2026.',
      line2: 'Full framework coming May 14.',
    },
  },
  {
    num: 'RUNG 3',
    title: 'Expedition',
    desc: 'Ten days to three weeks. This is the list we\u2019re building toward.',
    photo: HERO_IMAGES.hiking_7103980642848666692,
    pills: ['TMB', 'Kilimanjaro', 'Everest Base Camp'],
    status: null,
  },
]

export default function AdventurePage() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <>
      <Nav scrolled={true} />
      <div style={{ background: '#141210', minHeight: '100vh' }}>

        {/* ===== PHOTO HEADER ===== */}
        <div style={{
          position: 'relative', height: '60vh', minHeight: 400,
          display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
        }}>
          <img src={HERO_IMAGES.olympicDeerAboveClouds} alt="Adventure" loading="eager" style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
          }} />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(20,18,16,0.55)' }} />
          <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 32px' }}>
            <Reveal>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, letterSpacing: 4, color: '#b8886e', marginBottom: 16 }}>ADVENTURE</div>
              <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(40px, 6vw, 72px)', fontStyle: 'italic', fontWeight: 400, color: '#e8dcc8', lineHeight: 1.1, marginBottom: 12 }}>The Ladder.</h1>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: '#8a8070' }}>From first trails to expedition logistics.</p>
            </Reveal>
          </div>
        </div>

        {/* ===== RUNG CARDS ===== */}
        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 32px' }}>
          {RUNGS.map((r, i) => (
            <Reveal key={r.num} delay={i * 120}>
              <div style={{
                display: 'flex', gap: 0, marginBottom: 24, borderRadius: 12, overflow: 'hidden',
                background: '#1c1915', border: '1px solid rgba(255,255,255,0.06)',
                minHeight: 400, flexDirection: i % 2 === 0 ? 'row' : 'row-reverse',
              }}>
                {/* Content half */}
                <div style={{ flex: 1, padding: '40px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: 2, color: '#b8886e' }}>{r.num}</span>
                    {r.status === 'now' && <span style={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700,
                      letterSpacing: 1, padding: '3px 10px', borderRadius: 20, background: '#d4a843', color: '#141210',
                    }}>HAPPENING NOW</span>}
                  </div>
                  <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(28px, 4vw, 36px)', fontStyle: 'italic', fontWeight: 400, color: '#e8dcc8', marginBottom: 12 }}>{r.title}</h3>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: '#b8ad9a', lineHeight: 1.6, marginBottom: 16 }}>{r.desc}</p>

                  {r.pills.length > 0 && (
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                      {r.pills.map(p => (
                        <span key={p} style={{
                          fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 1,
                          color: '#d4a843', padding: '4px 12px', borderRadius: 16,
                          border: '1px solid rgba(212,168,67,0.3)',
                        }}>{p}</span>
                      ))}
                    </div>
                  )}

                  {r.callout && (
                    <div style={{
                      padding: '20px 24px', borderRadius: 8, background: 'rgba(184,136,110,0.06)',
                      borderLeft: '3px solid #b8886e', marginTop: 8,
                    }}>
                      <div style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontStyle: 'italic', color: '#e8dcc8', marginBottom: 8 }}>{r.callout.title}</div>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#b8ad9a', lineHeight: 1.5, marginBottom: 2 }}>{r.callout.line1}</p>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#8a8070', lineHeight: 1.5 }}>{r.callout.line2}</p>
                    </div>
                  )}
                </div>

                {/* Photo half */}
                <div style={{ flex: 1, position: 'relative', minHeight: 300 }}>
                  <img src={r.photo} alt={r.title} loading="lazy" style={{
                    width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0,
                  }} />
                </div>
              </div>
            </Reveal>
          ))}
        </section>

        {/* Back link */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px 60px', textAlign: 'center' }}>
          <Link to="/" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#b8ad9a', textDecoration: 'none', letterSpacing: 1 }}>&larr; Back home</Link>
        </div>
      </div>

      <style>{`
        @media(max-width:768px) {
          div[style*="flexDirection: row"], div[style*="flexDirection: row-reverse"] {
            flex-direction: column !important;
          }
          div[style*="minHeight: 300"] { min-height: 240px !important; }
        }
      `}</style>
    </>
  )
}
