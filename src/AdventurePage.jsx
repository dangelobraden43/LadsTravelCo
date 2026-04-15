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

export default function AdventurePage() {
  return (
    <>
    <Nav scrolled={true} />
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingTop: 80 }}>
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 32px' }}>
        <Reveal>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, letterSpacing: 3, color: 'var(--copper)', marginBottom: 12 }}>ADVENTURE</div>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', fontStyle: 'italic', fontWeight: 400, color: 'var(--cream)', lineHeight: 1.15, marginBottom: 12 }}>The Ladder.</h1>
          <p style={{ fontFamily: 'var(--sans)', fontSize: 15, color: 'var(--cream2)', maxWidth: 560 }}>From first trails to expedition logistics. Where the Lads are headed next.</p>
        </Reveal>

        {/* Three rungs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginTop: 48 }}>
          {[
            { rung: 'RUNG 1', title: 'Accessible Wilderness', desc: 'Day hikes and weekend trips. No experience required. Grand Canyon, Zion, Olympic.', status: null },
            { rung: 'RUNG 2', title: 'Multi-Day Treks', desc: 'Three to ten days. Real preparation required. The Salkantay is the proof of concept.', status: 'now' },
            { rung: 'RUNG 3', title: 'Expedition', desc: 'Ten days to three weeks. This is the list we\'re building toward.', extras: 'Kilimanjaro · TMB · Everest Base Camp', status: null },
          ].map((r, i) => (
            <Reveal key={r.rung} delay={i * 100}>
              <div style={{
                background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 12, padding: '32px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, letterSpacing: 2, color: 'var(--gold)' }}>{r.rung}</span>
                  {r.status === 'now' && <span style={{ fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, letterSpacing: 1, padding: '3px 10px', borderRadius: 20, background: 'var(--gold)', color: '#141210' }}>HAPPENING NOW</span>}
                </div>
                <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 600, color: 'var(--cream)', marginBottom: 8 }}>{r.title}</h3>
                <p style={{ fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--cream2)', lineHeight: 1.6 }}>{r.desc}</p>
                {r.extras && <p style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--muted)', marginTop: 12, letterSpacing: 0.5 }}>{r.extras}</p>}
              </div>
            </Reveal>
          ))}
        </div>

        {/* Featured Trek placeholder */}
        <Reveal delay={300}>
          <div style={{
            marginTop: 48, padding: '48px 40px', borderRadius: 12,
            border: '1px solid var(--copper)', background: 'rgba(184,136,110,0.04)',
            textAlign: 'center',
          }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, letterSpacing: 3, color: 'var(--copper)', marginBottom: 16 }}>FEATURED TREK</div>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontStyle: 'italic', fontWeight: 400, color: 'var(--cream)', lineHeight: 1.3 }}>Salkantay + Machu Picchu</div>
            <div style={{ fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--muted)', marginTop: 12 }}>Framework coming May 2026</div>
          </div>
        </Reveal>
      </section>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px 60px', textAlign: 'center' }}>
        <Link to="/" style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--cream2)', textDecoration: 'none', letterSpacing: 1 }}>← Back home</Link>
      </div>
    </div>
    </>
  );
}
