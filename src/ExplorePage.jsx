import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Nav } from './App';

function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add('visible'); obs.unobserve(el); }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}
function Reveal({ children, style = {}, delay = 0, type = 'up' }) {
  const ref = useReveal();
  const cls = type === 'up' ? 'reveal' : type === 'fade' ? 'reveal-fade' : type === 'scale' ? 'reveal-scale' : 'reveal';
  const s = delay ? { ...style, transitionDelay: `${delay}ms` } : style;
  return <div ref={ref} className={cls} style={s}>{children}</div>;
}

export default function ExplorePage() {
  const navigate = useNavigate();

  return (
    <>
    <Nav scrolled={true} />
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingTop: 80 }}>
      {/* Section header */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 32px 40px' }}>
        <Reveal>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, letterSpacing: 3, color: 'var(--copper)', marginBottom: 12 }}>EXPLORE</div>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', fontStyle: 'italic', fontWeight: 400, color: 'var(--cream)', lineHeight: 1.15, marginBottom: 12 }}>Where We've Been.</h1>
          <p style={{ fontFamily: 'var(--sans)', fontSize: 15, color: 'var(--cream2)', maxWidth: 500 }}>10 frameworks. 180+ validated spots. Every recommendation from personal experience.</p>
        </Reveal>
      </section>

      {/* Destination cards — 2-column grid */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px 60px' }}>
        <div className="explore-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          {[
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
          ].map((d, i) => (
            <Reveal key={d.slug} delay={i * 60}>
              <div onClick={() => navigate('/' + d.slug)} style={{
                background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 12, padding: '28px 24px', cursor: 'pointer',
                transition: 'all 0.2s', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'none'; }}
              >
                <div>
                  <div style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontStyle: 'italic', fontWeight: 400, color: 'var(--cream)', marginBottom: 4 }}>{d.name}</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)' }}>{d.badge} · {d.spots} spots</div>
                </div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--gold)', letterSpacing: 1 }}>VIEW →</div>
              </div>
            </Reveal>
          ))}
        </div>
        <style>{`@media(max-width:640px) { .explore-grid { grid-template-columns: 1fr !important; } }`}</style>
      </section>

      {/* Where We're Headed */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px 80px' }}>
        <div style={{ background: 'var(--bg)', borderRadius: 16, padding: '60px 40px', border: '1px solid rgba(255,255,255,0.04)' }}>
          <Reveal>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, letterSpacing: 3, color: 'var(--copper)', marginBottom: 12 }}>WHERE WE'RE HEADED</div>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontStyle: 'italic', fontWeight: 400, color: 'var(--cream)', lineHeight: 1.15, marginBottom: 8 }}>The List.</div>
            <div style={{ fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--muted)', marginBottom: 48 }}>No dates on most of these. That's intentional.</div>
          </Reveal>

          {[
            { category: 'TREKS', items: [
              { name: 'Lima + Huacachina + Salkantay + Machu Picchu', desc: "Lima to the oasis, ATV through red mountains, five days on the Salkantay, then standing at a wonder of the world.", status: 'now' },
              { name: 'Tour du Mont Blanc', desc: "We've been to Europe. We haven't hiked the Alps. Hut to hut through Switzerland, France, and Italy — the distance, the countries, the scenery.", status: 'list' },
              { name: 'New Zealand Great Walks', desc: "My deepest travel regret is not hiking New Zealand when we were already in Australia. One of the most beautiful countries on earth.", status: 'list' },
              { name: 'Kilimanjaro', desc: "The true pinnacle. Everest gets the name recognition but Kili has always been the one.", status: 'list' },
              { name: 'Everest Base Camp', desc: "We always think big.", status: 'list' },
            ]},
            { category: 'EVENTS', items: [
              { name: 'Oktoberfest — Munich', desc: "Two weeks, the Theresienwiese, and every beer hall in the city.", status: 'live' },
              { name: 'Thailand NYE — Koh Phangan', desc: "Ring in the new year on the islands.", status: 'live' },
              { name: 'Running of the Bulls — Pamplona', desc: "Do it once in your life. Who else can say they have.", status: 'list' },
              { name: 'Camp Nou Reopening — Barcelona', desc: "I was devastated to miss the grand opening. The immersive museum was the most impressive thing I've seen from any sporting organization. And Yamal.", status: 'list' },
            ]},
            { category: 'ROUTES & WONDERS', items: [
              { name: 'West Coast Road Trip — Vancouver to Phoenix', desc: "The best way to experience the beauty of America is by exploring its nature. There's a reason this is so popular.", status: 'list' },
              { name: 'Petra — Jordan', desc: "Truly the most impressive wonder of the world. Undervisited because of political tension. The wonders matter to us.", status: 'list' },
              { name: 'The Pyramids — Egypt', desc: "Infinite history. Culture and history alongside great experiences — that's what the Lads seek. And the pyramids, like the Colosseum, are truly magnificent.", status: 'list' },
            ]},
          ].map((cat, ci) => (
            <div key={cat.category}>
              <Reveal delay={ci * 100}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 600, letterSpacing: 3, color: 'var(--gold)', padding: ci === 0 ? '16px 0 20px' : '32px 0 20px', borderTop: '1px solid rgba(201,168,76,0.15)', marginTop: ci === 0 ? 0 : 16 }}>{cat.category}</div>
              </Reveal>
              {cat.items.map((item, i) => (
                <Reveal key={item.name} delay={ci * 100 + 50 + i * 60}>
                  <div style={{ padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 6 }}>
                      <div style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', fontStyle: 'italic', fontWeight: 400, color: 'var(--cream)' }}>{item.name}</div>
                      <span style={{
                        fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, letterSpacing: 1, padding: '3px 10px', borderRadius: 20,
                        ...(item.status === 'now' ? { background: 'var(--gold)', color: '#141210' } : item.status === 'live' ? { background: '#5a9aad', color: '#141210' } : { background: 'transparent', color: 'var(--gold)', border: '1px solid rgba(201,168,76,0.3)' }),
                      }}>{item.status === 'now' ? 'HAPPENING NOW' : item.status === 'live' ? 'FRAMEWORK LIVE' : 'ON THE LIST'}</span>
                    </div>
                    <div style={{ fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--cream2)', lineHeight: 1.6, maxWidth: 640 }}>{item.desc}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Back link */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px 60px', textAlign: 'center' }}>
        <Link to="/" style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--cream2)', textDecoration: 'none', letterSpacing: 1 }}>← Back home</Link>
      </div>
    </div>
    </>
  );
}
