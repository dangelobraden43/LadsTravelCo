import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Nav } from './App'
import {
  IMAGES, NEW_IMAGES, BATCH3_IMAGES,
  HERO_IMAGES, HEIC_HERO_IMAGES,
} from './images-paths'

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

const SEASONS = [
  {
    id: 'spring',
    months: 'APR \u2013 MAY',
    name: 'Spring.',
    photo: NEW_IMAGES.schonbrunn,
    tagline: 'Europe before the crowds arrive and the prices climb.',
    destinations: [
      { name: 'Rome', price: '$480 avg RT', spots: '25 spots' },
      { name: 'Prague', price: '$520 avg RT', spots: '23 spots' },
      { name: 'Barcelona', price: '$550 avg RT', spots: '30 spots' },
    ],
    nextLabel: 'SUMMER',
    cause: {
      label: 'Protecting Our Parks',
      charity: 'National Parks Conservation Assoc.',
      url: 'https://support.npca.org/page/94316/action/1',
      story: "We hike these parks. The trails we plan trips around \u2014 Olympic, Zion, Grand Canyon \u2014 exist because someone fought to protect them. NPCA is that fight. Every spring trip we help plan, we support keeping these places exactly as we found them.",
    },
  },
  {
    id: 'summer',
    months: 'JUN \u2013 AUG',
    name: 'Summer.',
    photo: BATCH3_IMAGES.rockPoolSwim,
    tagline: "Peak season. Worth it if you book it right. Don't wait.",
    destinations: [
      { name: 'Iceland', price: '$650 avg RT', spots: '23 spots' },
      { name: 'Ireland', price: '$580 avg RT', spots: '35 spots' },
      { name: 'Australia', price: '$950 avg RT', spots: '19 spots' },
    ],
    nextLabel: 'FALL',
    cause: {
      label: 'Youth Athletics',
      charity: 'TUFF \u2014 The Uniform Funding Foundation',
      url: 'https://gettuff.org/donate',
      story: "All four of us are athletes. We know what sport gives you \u2014 discipline, identity, somewhere to put your energy. TUFF funds the uniforms that let kids who can\u2019t afford them stay in the game. This is our summer cause.",
    },
  },
  {
    id: 'fall',
    months: 'SEP \u2013 OCT',
    name: 'Fall.',
    photo: BATCH3_IMAGES.munichMarienplatz,
    tagline: 'The best month most people miss. Oktoberfest. Shoulder pricing. Still warm.',
    destinations: [
      { name: 'Munich', price: '$620 avg RT', spots: '9 spots' },
      { name: 'Thailand', price: '$780 avg RT', spots: '13 spots' },
      { name: 'Charleston', price: 'domestic', spots: '17 spots' },
    ],
    nextLabel: 'WINTER',
    cause: {
      label: 'Breast Cancer Research',
      charity: 'Ginny L. Clements Breast Cancer Research',
      url: 'https://cancercenter.arizona.edu/about/ginny-l-clements-breast-cancer-research-institute',
      story: "This cause is personal. Brady\u2019s girlfriend\u2019s family has lived this disease. September is when we push hardest for Europe \u2014 shoulder season, lower prices, better experiences. And every trip we help plan this window, we donate to research that matters to people we love.",
    },
  },
  {
    id: 'winter',
    months: 'NOV \u2013 MAR',
    name: 'Winter.',
    photo: HERO_IMAGES.glendaloughCelticCrossesIreland,
    tagline: "Budget season. The cities don\u2019t disappear \u2014 the tourists do.",
    destinations: [
      { name: 'Southeast Asia', price: '$800 avg RT', spots: '' },
      { name: 'Southern Europe', price: '$350 avg RT', spots: '' },
      { name: 'Domestic Road Trips', price: 'drive', spots: '' },
    ],
    nextLabel: null,
    cause: {
      label: "Children's Hospital",
      charity: 'C.S. Mott Children\u2019s Hospital',
      url: 'https://www.michiganmedicine.org/giving/areas-support/giving-cs-mott-childrens-hospital',
      story: "Brady spent a week in Mott Children\u2019s Hospital over Thanksgiving with a condition that took months to diagnose. The care there was extraordinary. The winter window \u2014 budget season, holiday markets, the trips most people skip \u2014 is when we give back to the people who were there when it mattered.",
    },
  },
]

function SeasonSection({ season, index }) {
  return (
    <>
      {/* Season scroll section */}
      <div style={{ position: 'relative', minHeight: '200vh' }}>
        {/* Photo layer — sticky */}
        <div className="when-sticky" style={{
          position: 'sticky', top: 0, height: '100vh', width: '100%', zIndex: 1, overflow: 'hidden',
        }}>
          <img src={season.photo} alt={season.name} loading={index === 0 ? 'eager' : 'lazy'} style={{
            width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center',
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, rgba(20,18,16,0.3) 0%, transparent 40%)',
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, transparent 20%, rgba(20,18,16,0.85) 100%)',
          }} />
        </div>

        {/* Content layer — sticky on top of photo */}
        <div className="when-content-sticky" style={{
          position: 'sticky', top: 0, height: '100vh', zIndex: 2,
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
          padding: '0 80px 80px', marginTop: '-100vh',
          pointerEvents: 'none',
        }}>
          <div style={{ pointerEvents: 'auto', maxWidth: 700 }}>
            <Reveal delay={index * 100}>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 4,
                color: '#b8886e', marginBottom: 16,
              }}>{season.months}</div>
              <h2 style={{
                fontFamily: "'Fraunces', serif", fontSize: 'clamp(60px, 8vw, 96px)',
                fontStyle: 'italic', fontWeight: 400, color: '#e8dcc8',
                lineHeight: 1.0, marginBottom: 16,
              }}>{season.name}</h2>
              <p style={{
                fontFamily: "'Inter', sans-serif", fontSize: 16, color: '#b8ad9a',
                maxWidth: 520, lineHeight: 1.6, marginBottom: 32,
              }}>{season.tagline}</p>
            </Reveal>

            {/* Destination picks */}
            {season.destinations.map((d, di) => (
              <Reveal key={d.name} delay={index * 100 + 100 + di * 60}>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 0',
                  borderTop: '1px solid rgba(212,168,67,0.15)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{
                      fontFamily: "'Fraunces', serif", fontSize: 22, fontStyle: 'italic',
                      fontWeight: 400, color: '#e8dcc8',
                    }}>{d.name}</span>
                    {d.spots && <span style={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                      color: '#d4a843', padding: '2px 8px', borderRadius: 12,
                      border: '1px solid rgba(212,168,67,0.3)',
                    }}>{d.spots}</span>}
                  </div>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                    color: '#8a8070',
                  }}>{d.price}</span>
                </div>
              </Reveal>
            ))}

            {/* Scroll hint */}
            {season.nextLabel && (
              <div style={{
                position: 'fixed', bottom: 32, right: 32,
                fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
                letterSpacing: 2, color: '#5a5550',
                display: 'flex', alignItems: 'center', gap: 6,
                pointerEvents: 'none',
              }}>
                SCROLL INTO {season.nextLabel}
                <span style={{ animation: 'float 2s ease-in-out infinite', display: 'inline-block' }}>&darr;</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cause section — normal flow after sticky */}
      <div style={{
        background: '#1c1915', padding: '64px 80px',
      }}>
        <div style={{ maxWidth: 700 }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 600,
            letterSpacing: 3, color: '#b8886e', marginBottom: 16,
          }}>THIS SEASON&rsquo;S CAUSE</div>
          <h3 style={{
            fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(24px, 4vw, 32px)',
            fontWeight: 600, color: '#e8dcc8', marginBottom: 16,
          }}>{season.cause.charity}</h3>
          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: 15, fontStyle: 'italic',
            color: '#b8ad9a', maxWidth: 600, lineHeight: 1.8, marginBottom: 24,
          }}>{season.cause.story}</p>
          <a href={season.cause.url} target="_blank" rel="noopener noreferrer" style={{
            display: 'inline-block', fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11, fontWeight: 600, letterSpacing: 1,
            color: '#d4a843', padding: '10px 24px', borderRadius: 24,
            border: '1px solid rgba(212,168,67,0.4)', textDecoration: 'none',
            transition: 'all 0.2s',
          }}>DONATE DIRECTLY &rarr;</a>
          <div style={{
            borderTop: '1px solid rgba(212,168,67,0.12)', marginTop: 32, paddingTop: 16,
          }}>
            <p style={{
              fontFamily: "'Inter', sans-serif", fontSize: 12, color: '#8a8070', textAlign: 'center',
            }}>Free trip planning through 2026. Donations go directly &mdash; we take nothing.</p>
          </div>
        </div>
      </div>

      {/* Dark breathing gap between seasons */}
      <div style={{ height: 40, background: '#141210' }} />
    </>
  )
}

export default function WhenPage() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <>
      <Nav scrolled={true} />
      <div style={{ background: '#141210', minHeight: '100vh', paddingTop: 80 }}>
        {/* Page header */}
        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 32px 40px' }}>
          <Reveal>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, letterSpacing: 3, color: '#b8886e', marginBottom: 12 }}>WHEN TO GO</div>
            <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', fontStyle: 'italic', fontWeight: 400, color: '#e8dcc8', lineHeight: 1.15, marginBottom: 12 }}>Four Windows.</h1>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: '#b8ad9a', maxWidth: 560 }}>Everything outside these windows costs more and delivers less.</p>
          </Reveal>
        </section>

        {/* Four seasons */}
        {SEASONS.map((s, i) => (
          <SeasonSection key={s.id} season={s} index={i} />
        ))}

        {/* Back link */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 32px 60px', textAlign: 'center' }}>
          <Link to="/" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#b8ad9a', textDecoration: 'none', letterSpacing: 1 }}>&larr; Back home</Link>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }
        @media(max-width:768px) {
          .when-sticky { position: relative !important; height: 65vh !important; }
          .when-content-sticky {
            position: relative !important; height: auto !important;
            margin-top: -30vh !important; padding: 0 24px 48px !important;
          }
        }
      `}</style>
    </>
  )
}
