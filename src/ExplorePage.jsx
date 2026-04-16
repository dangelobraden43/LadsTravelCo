import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Nav, PhotoStrip } from './App'
import { IMAGES, NEW_IMAGES, BATCH3_IMAGES, HERO_IMAGES, HEIC_HERO_IMAGES } from './images-paths'
import { gsap } from './utils/animations'
import Splitting from 'splitting'
import 'splitting/dist/splitting.css'

const DESTINATIONS = [
  {
    name: 'Dublin',
    slug: 'dublin',
    line: '35 spots. Every pub worth going to and the ones worth skipping.',
    photo: IMAGES.cliffs,
    spots: 35,
  },
  {
    name: 'Rome',
    slug: 'rome',
    line: 'The aperitivo strategy that saves you $40 a night.',
    photo: IMAGES.colosseum,
    spots: 25,
  },
  {
    name: 'Spain',
    slug: 'spain',
    line: 'Two cities, one framework. Barcelona meets Madrid.',
    photo: NEW_IMAGES.sagradaSunset,
    spots: 30,
  },
  {
    name: 'Australia',
    slug: 'australia',
    line: 'Sydney, Tasmania, the coast. Where we studied abroad.',
    photo: IMAGES.opera,
    spots: 19,
  },
  {
    name: 'Iceland',
    slug: 'iceland',
    line: 'Ring Road logistics nobody else will tell you.',
    photo: IMAGES.iceland,
    spots: 23,
  },
  {
    name: 'Prague',
    slug: 'prague',
    line: 'The cheapest great city in Europe.',
    photo: IMAGES.stvitus,
    spots: 23,
  },
  {
    name: 'Munich',
    slug: 'munich',
    line: 'Oktoberfest done right.',
    photo: BATCH3_IMAGES.munichMarienplatz,
    spots: 9,
  },
  {
    name: 'Poland',
    slug: 'poland',
    line: "Krakow is the most underrated city we've been to.",
    photo: NEW_IMAGES.pragueSkyline,
    spots: 12,
  },
  {
    name: 'Thailand',
    slug: 'thailand',
    line: 'NYE on the islands.',
    photo: NEW_IMAGES.fitzroyBeach,
    spots: 13,
  },
  {
    name: 'Charleston',
    slug: 'charleston',
    line: 'The domestic trip worth treating like an international one.',
    photo: BATCH3_IMAGES.smokyRockOverlook,
    spots: 17,
  },
]

const strip2 = [
  BATCH3_IMAGES.dresdenFrauenkirche,
  BATCH3_IMAGES.galwayChristmas,
  IMAGES.pragueAerial,
  BATCH3_IMAGES.templeBarDublin,
  NEW_IMAGES.sistineChapel,
]

const HEADED = [
  {
    category: 'TREKS',
    items: [
      {
        name: 'Lima + Huacachina + Salkantay + Machu Picchu',
        desc: 'Lima to the oasis, ATV through red mountains, five days on the Salkantay, then standing at a wonder of the world.',
        status: 'now',
      },
      {
        name: 'Tour du Mont Blanc',
        desc: 'We\u2019ve been to Europe. We haven\u2019t hiked the Alps. Hut to hut through Switzerland, France, and Italy.',
        status: 'list',
      },
      { name: 'Kilimanjaro', desc: 'The true pinnacle.', status: 'list' },
      { name: 'Everest Base Camp', desc: 'We always think big.', status: 'list' },
    ],
  },
  {
    category: 'EVENTS',
    items: [
      {
        name: 'Oktoberfest \u2014 Munich',
        desc: 'Two weeks, the Theresienwiese, and every beer hall in the city.',
        status: 'live',
      },
      {
        name: 'Thailand NYE \u2014 Koh Phangan',
        desc: 'Ring in the new year on the islands.',
        status: 'live',
      },
      {
        name: 'Running of the Bulls \u2014 Pamplona',
        desc: 'Do it once in your life.',
        status: 'list',
      },
      {
        name: 'Camp Nou Reopening \u2014 Barcelona',
        desc: 'The immersive museum was the most impressive thing I\u2019ve seen from any sporting organization.',
        status: 'list',
      },
    ],
  },
  {
    category: 'ROUTES & WONDERS',
    items: [
      {
        name: 'West Coast \u2014 Vancouver to Phoenix',
        desc: 'The best way to experience America is by exploring its nature.',
        status: 'list',
      },
      {
        name: 'Petra \u2014 Jordan',
        desc: 'Truly the most impressive wonder of the world.',
        status: 'list',
      },
      {
        name: 'The Pyramids \u2014 Egypt',
        desc: 'Infinite history. The wonders matter to us.',
        status: 'list',
      },
    ],
  },
]

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

/* ===== SPLIT-SCREEN THEATER ===== */
function DestinationTheater() {
  const navigate = useNavigate()
  const [active, setActive] = useState(0)
  const [photoOpacity, setPhotoOpacity] = useState(1)
  const nameRefs = useRef([])

  // Splitting.js on destination names
  useEffect(() => {
    nameRefs.current.forEach((el) => {
      if (el && !el.dataset.split) {
        Splitting({ target: el, by: 'chars' })
        el.dataset.split = 'true'
        const chars = el.querySelectorAll('.char')
        gsap.fromTo(
          chars,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power3.out',
            stagger: 0.02,
            scrollTrigger: { trigger: el, start: 'top 85%', once: true },
          }
        )
      }
    })
  }, [])

  const handleHover = (i) => {
    if (i === active) return
    setPhotoOpacity(0)
    setTimeout(() => {
      setActive(i)
      setPhotoOpacity(1)
    }, 200)
  }

  return (
    <div className="explore-theater">
      {/* Left: editorial list */}
      <div className="explore-list">
        {DESTINATIONS.map((d, i) => (
          <div
            key={d.slug}
            className={`explore-row${active === i ? ' active' : ''}`}
            onMouseEnter={() => handleHover(i)}
            onClick={() => navigate('/' + d.slug)}
          >
            <div className="explore-row-num">{String(i + 1).padStart(2, '0')}</div>
            <div className="explore-row-content">
              <div
                className="explore-row-name"
                ref={(el) => (nameRefs.current[i] = el)}
                data-splitting=""
              >
                {d.name}
              </div>
              <div className="explore-row-line">{d.line}</div>
              <div className="explore-row-meta">
                <span className="explore-row-spots">{d.spots} spots</span>
                <span className="explore-row-arrow">&rarr;</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Right: photo panel */}
      <div className="explore-photo-panel">
        <div className="explore-photo-inner" style={{ opacity: photoOpacity }}>
          <img src={DESTINATIONS[active].photo} alt={DESTINATIONS[active].name} loading="eager" />
        </div>
        <div className="explore-photo-overlay" />
        <div className="explore-photo-label">
          <span className="explore-photo-count">{DESTINATIONS[active].spots}</span>
          <span className="explore-photo-word">validated spots</span>
        </div>
      </div>
    </div>
  )
}

export default function ExplorePage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <Nav scrolled={true} />
      <div style={{ background: '#141210', minHeight: '100vh' }}>
        {/* ===== HERO HEADER ===== */}
        <div
          style={{
            position: 'relative',
            height: '50vh',
            minHeight: 360,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          <img
            src={IMAGES.montserrat}
            alt=""
            loading="eager"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(20,18,16,0.6)' }} />
          <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 32px' }}>
            <Reveal>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 4,
                  color: '#b8886e',
                  marginBottom: 16,
                }}
              >
                EXPLORE
              </div>
              <h1
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: 'clamp(36px, 6vw, 64px)',
                  fontStyle: 'italic',
                  fontWeight: 400,
                  color: '#e8dcc8',
                  lineHeight: 1.1,
                  marginBottom: 12,
                }}
              >
                Where do you want to go?
              </h1>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: '#8a8070' }}>
                183 validated spots. 10 frameworks. One system.
              </p>
            </Reveal>
          </div>
        </div>

        {/* ===== FEATURED FRAMEWORKS ===== */}
        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 32px 40px' }}>
          <Reveal>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 4,
                color: '#d4a843',
                marginBottom: 12,
              }}
            >
              FEATURED
            </div>
            <div
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
                fontStyle: 'italic',
                color: '#e8dcc8',
                marginBottom: 28,
              }}
            >
              The last two we built.
            </div>
          </Reveal>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 20,
            }}
          >
            {[
              {
                href: '/vegas-zion-rise',
                tag: 'CLIENT FRAMEWORK',
                title: 'Pack Your Bags',
                line: 'Vegas + Zion + Rise Lantern Festival \u2014 built for Lexie.',
                img: 'https://res.cloudinary.com/doonck2rm/video/upload/so_5,w_1200,f_jpg/RiseLantern_xuegox.jpg',
                accent: '#f0a838',
              },
              {
                href: '/jordi',
                tag: 'FOUNDING STORY',
                title: 'Jordi',
                line: 'A thank you to the guide who gave us his Barcelona.',
                img: '/images/jordi/best-sagrada.webp',
                accent: '#D4782E',
              },
            ].map((c) => (
              <a
                key={c.href}
                href={c.href}
                style={{
                  position: 'relative',
                  display: 'block',
                  aspectRatio: '16 / 9',
                  borderRadius: 14,
                  overflow: 'hidden',
                  textDecoration: 'none',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <img
                  src={c.img}
                  alt={c.title}
                  loading="lazy"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'brightness(0.6)',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(to bottom, transparent 0%, rgba(20,18,16,0.85) 100%)',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: '24px 28px',
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: 3,
                      color: c.accent,
                      marginBottom: 8,
                    }}
                  >
                    {c.tag}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Fraunces', serif",
                      fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
                      fontStyle: 'italic',
                      color: '#f4ecdb',
                      lineHeight: 1.05,
                      marginBottom: 6,
                    }}
                  >
                    {c.title}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 13,
                      color: '#b8ad9a',
                    }}
                  >
                    {c.line}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ===== SPLIT-SCREEN DESTINATIONS ===== */}
        <DestinationTheater />

        {/* ===== PHOTO STRIP 2 ===== */}
        <PhotoStrip images={strip2} height={200} />

        {/* ===== WHERE WE'RE HEADED ===== */}
        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 32px 80px' }}>
          <div
            style={{
              padding: '60px 40px',
              border: '1px solid rgba(255,255,255,0.04)',
              borderRadius: 16,
            }}
          >
            <Reveal>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: 3,
                  color: '#b8886e',
                  marginBottom: 12,
                }}
              >
                WHERE WE&rsquo;RE HEADED
              </div>
              <div
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  fontStyle: 'italic',
                  fontWeight: 400,
                  color: '#e8dcc8',
                  lineHeight: 1.15,
                  marginBottom: 8,
                }}
              >
                The List.
              </div>
              <div
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 14,
                  color: '#8a8070',
                  marginBottom: 48,
                }}
              >
                No dates on most of these. That&rsquo;s intentional.
              </div>
            </Reveal>
            {HEADED.map((cat, ci) => (
              <div key={cat.category}>
                <Reveal delay={ci * 80}>
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 10,
                      fontWeight: 600,
                      letterSpacing: 3,
                      color: '#d4a843',
                      padding: ci === 0 ? '16px 0 20px' : '32px 0 20px',
                      borderTop: '1px solid rgba(201,168,76,0.15)',
                      marginTop: ci === 0 ? 0 : 16,
                    }}
                  >
                    {cat.category}
                  </div>
                </Reveal>
                {cat.items.map((item, i) => (
                  <Reveal key={item.name} delay={ci * 80 + 40 + i * 50}>
                    <div
                      style={{
                        padding: '14px 0',
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          flexWrap: 'wrap',
                          marginBottom: 4,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'Fraunces', serif",
                            fontSize: 'clamp(1rem, 2vw, 1.3rem)',
                            fontStyle: 'italic',
                            fontWeight: 400,
                            color: '#e8dcc8',
                          }}
                        >
                          {item.name}
                        </span>
                        <span
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: 9,
                            fontWeight: 700,
                            letterSpacing: 1,
                            padding: '3px 10px',
                            borderRadius: 20,
                            ...(item.status === 'now'
                              ? { background: '#d4a843', color: '#141210' }
                              : item.status === 'live'
                                ? { background: '#5a9aad', color: '#141210' }
                                : {
                                    background: 'transparent',
                                    color: '#d4a843',
                                    border: '1px solid rgba(201,168,76,0.3)',
                                  }),
                          }}
                        >
                          {item.status === 'now'
                            ? 'HAPPENING NOW'
                            : item.status === 'live'
                              ? 'FRAMEWORK LIVE'
                              : 'ON THE LIST'}
                        </span>
                      </div>
                      <div
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: 13,
                          color: '#b8ad9a',
                          lineHeight: 1.5,
                        }}
                      >
                        {item.desc}
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            ))}
          </div>
        </section>

        <div
          style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px 60px', textAlign: 'center' }}
        >
          <Link
            to="/"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12,
              color: '#b8ad9a',
              textDecoration: 'none',
              letterSpacing: 1,
            }}
          >
            &larr; Back home
          </Link>
        </div>
      </div>

      <style>{`
        .explore-theater {
          display: flex;
          min-height: 80vh;
          position: relative;
        }
        .explore-list {
          flex: 0 0 55%;
          padding: 40px 0 40px 40px;
          position: relative;
          z-index: 2;
        }
        .explore-photo-panel {
          flex: 0 0 45%;
          position: sticky;
          top: 0;
          height: 100vh;
          overflow: hidden;
        }
        .explore-photo-inner {
          width: 100%;
          height: 100%;
          transition: opacity 0.3s ease;
        }
        .explore-photo-inner img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .explore-photo-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to right, #141210 0%, transparent 30%);
          pointer-events: none;
        }
        .explore-photo-label {
          position: absolute;
          bottom: 48px;
          right: 48px;
          text-align: right;
          pointer-events: none;
        }
        .explore-photo-count {
          display: block;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 64px;
          font-weight: 700;
          color: #d4a843;
          line-height: 1;
        }
        .explore-photo-word {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 3px;
          color: #8a8070;
          text-transform: uppercase;
        }

        .explore-row {
          display: flex;
          gap: 20px;
          padding: 24px 32px 24px 0;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }
        .explore-row::before {
          content: '';
          position: absolute;
          left: -40px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: transparent;
          transition: background 0.3s;
        }
        .explore-row.active::before {
          background: #d4a843;
        }
        .explore-row:hover {
          background: rgba(255,255,255,0.02);
        }
        .explore-row-num {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          color: #5a5550;
          padding-top: 8px;
          min-width: 28px;
          transition: color 0.3s;
        }
        .explore-row.active .explore-row-num {
          color: #d4a843;
        }
        .explore-row-content { flex: 1; }
        .explore-row-name {
          font-family: 'Fraunces', serif;
          font-size: clamp(28px, 4vw, 42px);
          font-style: italic;
          font-weight: 400;
          color: #5a5550;
          line-height: 1.1;
          margin-bottom: 6px;
          transition: color 0.3s;
        }
        .explore-row.active .explore-row-name {
          color: #e8dcc8;
        }
        .explore-row-line {
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          color: #5a5550;
          line-height: 1.5;
          max-width: 400px;
          transition: color 0.3s;
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s ease, color 0.3s, opacity 0.3s;
          opacity: 0;
        }
        .explore-row.active .explore-row-line {
          color: #b8ad9a;
          max-height: 60px;
          opacity: 1;
        }
        .explore-row-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 8px;
          max-height: 0;
          overflow: hidden;
          opacity: 0;
          transition: max-height 0.4s ease, opacity 0.3s;
        }
        .explore-row.active .explore-row-meta {
          max-height: 40px;
          opacity: 1;
        }
        .explore-row-spots {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 1px;
          color: #d4a843;
          padding: 3px 10px;
          border: 1px solid rgba(212,168,67,0.3);
          border-radius: 12px;
        }
        .explore-row-arrow {
          font-family: 'JetBrains Mono', monospace;
          font-size: 14px;
          color: #d4a843;
          transition: transform 0.2s;
        }
        .explore-row:hover .explore-row-arrow {
          transform: translateX(4px);
        }

        /* Splitting.js character styling */
        .explore-row-name .char {
          display: inline-block;
        }

        @media(max-width: 768px) {
          .explore-theater {
            flex-direction: column;
          }
          .explore-list {
            flex: none;
            padding: 24px 24px;
          }
          .explore-photo-panel {
            display: none;
          }
          .explore-row-name {
            font-size: 28px;
          }
          .explore-row-line {
            max-height: 60px !important;
            opacity: 1 !important;
            color: #b8ad9a !important;
          }
          .explore-row-meta {
            max-height: 40px !important;
            opacity: 1 !important;
          }
        }
      `}</style>
    </>
  )
}
