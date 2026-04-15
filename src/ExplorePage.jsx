import React, { useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Nav, PhotoStrip } from './App'
import { IMAGES, NEW_IMAGES, BATCH3_IMAGES } from './images-paths'
import { revealOnScroll } from './utils/animations'

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

const strip2 = [
  BATCH3_IMAGES.dresdenFrauenkirche,
  BATCH3_IMAGES.galwayChristmas,
  IMAGES.pragueAerial,
  BATCH3_IMAGES.templeBarDublin,
  NEW_IMAGES.sistineChapel,
]

const DESTINATIONS = [
  { name: 'Dublin + Galway', slug: 'dublin', badge: 'Both Lads', spots: '45+' },
  { name: 'Rome + Italy', slug: 'rome', badge: 'Both Lads', spots: '43' },
  { name: 'Barcelona + Madrid', slug: 'spain', badge: 'Both Lads', spots: '115' },
  { name: 'Australia + NZ', slug: 'australia', badge: 'Brady', spots: '123' },
  { name: 'Iceland', slug: 'iceland', badge: 'Dawson', spots: '20+' },
  { name: 'Prague + Vienna + Dresden', slug: 'prague', badge: 'Brady', spots: '75+' },
  { name: 'Munich Oktoberfest', slug: 'munich', badge: 'Research', spots: '15+' },
  { name: 'Poland', slug: 'poland', badge: 'Research', spots: '30+' },
  { name: 'Thailand', slug: 'thailand', badge: 'Research', spots: '25+' },
  { name: 'Charleston', slug: 'charleston', badge: 'Brady', spots: '12' },
]

const HEADED = [
  { category: 'TREKS', items: [
    { name: 'Lima + Huacachina + Salkantay + Machu Picchu', desc: "Lima to the oasis, ATV through red mountains, five days on the Salkantay, then standing at a wonder of the world.", status: 'now' },
    { name: 'Tour du Mont Blanc', desc: "We\u2019ve been to Europe. We haven\u2019t hiked the Alps. Hut to hut through Switzerland, France, and Italy \u2014 the distance, the countries, the scenery.", status: 'list' },
    { name: 'New Zealand Great Walks', desc: "My deepest travel regret is not hiking New Zealand when we were already in Australia. One of the most beautiful countries on earth.", status: 'list' },
    { name: 'Kilimanjaro', desc: "The true pinnacle. Everest gets the name recognition but Kili has always been the one.", status: 'list' },
    { name: 'Everest Base Camp', desc: "We always think big.", status: 'list' },
  ]},
  { category: 'EVENTS', items: [
    { name: 'Oktoberfest \u2014 Munich', desc: "Two weeks, the Theresienwiese, and every beer hall in the city.", status: 'live' },
    { name: 'Thailand NYE \u2014 Koh Phangan', desc: "Ring in the new year on the islands.", status: 'live' },
    { name: 'Running of the Bulls \u2014 Pamplona', desc: "Do it once in your life. Who else can say they have.", status: 'list' },
    { name: 'Camp Nou Reopening \u2014 Barcelona', desc: "I was devastated to miss the grand opening. The immersive museum was the most impressive thing I\u2019ve seen from any sporting organization. And Yamal.", status: 'list' },
  ]},
  { category: 'ROUTES & WONDERS', items: [
    { name: 'West Coast Road Trip \u2014 Vancouver to Phoenix', desc: "The best way to experience the beauty of America is by exploring its nature. There\u2019s a reason this is so popular.", status: 'list' },
    { name: 'Petra \u2014 Jordan', desc: "Truly the most impressive wonder of the world. Undervisited because of political tension. The wonders matter to us.", status: 'list' },
    { name: 'The Pyramids \u2014 Egypt', desc: "Infinite history. Culture and history alongside great experiences \u2014 that\u2019s what the Lads seek. And the pyramids, like the Colosseum, are truly magnificent.", status: 'list' },
  ]},
]

export default function ExplorePage() {
  const navigate = useNavigate()
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <>
      <Nav scrolled={true} />
      <div style={{ background: '#141210', minHeight: '100vh' }}>

        {/* ===== PHOTO HEADER ===== */}
        <div style={{
          position: 'relative', height: '60vh', minHeight: 400,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden',
        }}>
          <img src={IMAGES.montserrat} alt="Montserrat" loading="eager" style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
          }} />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(20,18,16,0.6)' }} />
          <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 32px' }}>
            <Reveal>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, letterSpacing: 4, color: '#b8886e', marginBottom: 16 }}>EXPLORE</div>
              <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(40px, 6vw, 72px)', fontStyle: 'italic', fontWeight: 400, color: '#e8dcc8', lineHeight: 1.1, marginBottom: 12 }}>Where do you want to go?</h1>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: '#8a8070' }}>183 validated spots. 10 frameworks. One system.</p>
            </Reveal>
          </div>
        </div>

        {/* ===== DESTINATION CARDS ===== */}
        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            {DESTINATIONS.map((d, i) => (
              <Reveal key={d.slug} delay={i * 60}>
                <div onClick={() => navigate('/' + d.slug)} style={{
                  background: '#1c1915', border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 12, padding: '28px 24px', cursor: 'pointer',
                  transition: 'all 0.2s', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'none' }}
                >
                  <div>
                    <div style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontStyle: 'italic', fontWeight: 400, color: '#e8dcc8', marginBottom: 4 }}>{d.name}</div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#8a8070' }}>{d.badge} &middot; {d.spots} spots</div>
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#d4a843', letterSpacing: 1 }}>VIEW &rarr;</div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ===== PHOTO STRIP 2 (cities) ===== */}
        <PhotoStrip images={strip2} height={200} />

        {/* ===== WHERE WE'RE HEADED ===== */}
        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 32px 80px' }}>
          <div style={{ padding: '60px 40px', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 16 }}>
            <Reveal>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: 3, color: '#b8886e', marginBottom: 12 }}>WHERE WE'RE HEADED</div>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontStyle: 'italic', fontWeight: 400, color: '#e8dcc8', lineHeight: 1.15, marginBottom: 8 }}>The List.</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: '#8a8070', marginBottom: 48 }}>No dates on most of these. That's intentional.</div>
            </Reveal>

            {HEADED.map((cat, ci) => (
              <div key={cat.category}>
                <Reveal delay={ci * 100}>
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 600,
                    letterSpacing: 3, color: '#d4a843',
                    padding: ci === 0 ? '16px 0 20px' : '32px 0 20px',
                    borderTop: '1px solid rgba(201,168,76,0.15)', marginTop: ci === 0 ? 0 : 16,
                  }}>{cat.category}</div>
                </Reveal>
                {cat.items.map((item, i) => (
                  <Reveal key={item.name} delay={ci * 100 + 50 + i * 60}>
                    <div style={{ padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 6 }}>
                        <div style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', fontStyle: 'italic', fontWeight: 400, color: '#e8dcc8' }}>{item.name}</div>
                        <span style={{
                          fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: 1, padding: '3px 10px', borderRadius: 20,
                          ...(item.status === 'now' ? { background: '#d4a843', color: '#141210' }
                            : item.status === 'live' ? { background: '#5a9aad', color: '#141210' }
                            : { background: 'transparent', color: '#d4a843', border: '1px solid rgba(201,168,76,0.3)' }),
                        }}>{item.status === 'now' ? 'HAPPENING NOW' : item.status === 'live' ? 'FRAMEWORK LIVE' : 'ON THE LIST'}</span>
                      </div>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#b8ad9a', lineHeight: 1.6, maxWidth: 640 }}>{item.desc}</div>
                    </div>
                  </Reveal>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* Back link */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px 60px', textAlign: 'center' }}>
          <Link to="/" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#b8ad9a', textDecoration: 'none', letterSpacing: 1 }}>&larr; Back home</Link>
        </div>
      </div>

      <style>{`
        @media(max-width:640px) {
          div[style*="gridTemplateColumns: repeat(2"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
