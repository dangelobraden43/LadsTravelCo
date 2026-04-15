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

export default function WhenPage() {
  const seasons = [
    {
      name: 'Spring Shoulder', months: 'April — May', temp: '55–70°F Europe',
      picks: [
        { dest: 'Rome + Italy', note: 'Late April Rome is 65°F with half the tourists of summer.' },
        { dest: 'Prague + Vienna', note: 'Best value culture cities. Everything is open, nothing is packed.' },
        { dest: 'Barcelona + Madrid', note: 'Low 70s. Beach days starting. Tapas without the wait.' },
      ],
      flights: '$580–$750 from ORD',
      cause: { name: 'Protecting Our Parks', charity: 'NPCA', url: 'https://support.npca.org/page/94316/action/1' },
    },
    {
      name: 'Summer', months: 'June — August', temp: '75–95°F',
      picks: [
        { dest: 'Iceland', note: 'Midnight Sun. The Ring Road at its absolute best.' },
        { dest: 'Ireland', note: 'Galway Arts Festival in July. Driest month of the year.' },
        { dest: 'Australia + NZ', note: 'Their winter. Cheaper flights, ski season, Vivid Sydney.' },
      ],
      flights: '$850–$1,200 from ORD',
      cause: { name: 'Youth Athletics', charity: 'TUFF', url: 'https://gettuff.org/donate' },
    },
    {
      name: 'Fall Shoulder', months: 'September — October', temp: '65–80°F Europe',
      picks: [
        { dest: 'Munich (Oktoberfest)', note: 'The event. Late September. Framework covers tent strategy.' },
        { dest: 'Thailand', note: 'Shoulder into dry season. Bangkok + islands without peak pricing.' },
        { dest: 'Charleston', note: 'Best food city in the South. Perfect weather window.' },
      ],
      flights: '$480–$680 from ORD',
      cause: { name: 'Breast Cancer Research', charity: 'Ginny L. Clements Institute', url: 'https://cancercenter.arizona.edu/about/ginny-l-clements-breast-cancer-research-institute' },
    },
    {
      name: 'Winter Budget', months: 'November — March', temp: '35–50°F Europe',
      picks: [
        { dest: 'Southeast Asia', note: 'Thailand dry season. $600 flights via Cathay Pacific.' },
        { dest: 'Southern Europe', note: 'Rome and Barcelona in November — cheap, uncrowded, still mild.' },
        { dest: 'Domestic road trips', note: 'Smoky Mountains fall colors. Phoenix golf season. Charleston winter.' },
      ],
      flights: '$380–$620 from ORD',
      cause: { name: "Children's Hospital", charity: 'C.S. Mott Children\'s Hospital', url: 'https://www.michiganmedicine.org/giving/areas-support/giving-cs-mott-childrens-hospital' },
    },
  ];

  return (
    <>
    <Nav scrolled={true} />
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingTop: 80 }}>
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 32px 40px' }}>
        <Reveal>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, letterSpacing: 3, color: 'var(--copper)', marginBottom: 12 }}>WHEN TO GO</div>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', fontStyle: 'italic', fontWeight: 400, color: 'var(--cream)', lineHeight: 1.15, marginBottom: 12 }}>Four Windows.</h1>
          <p style={{ fontFamily: 'var(--sans)', fontSize: 15, color: 'var(--cream2)', maxWidth: 560 }}>Everything outside these windows costs more and delivers less.</p>
        </Reveal>
      </section>

      {seasons.map((s, si) => (
        <section key={s.name} style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 32px', borderTop: si > 0 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
          <Reveal delay={si * 80}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, flexWrap: 'wrap', marginBottom: 24 }}>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 600, color: 'var(--cream)' }}>{s.name}</h2>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--muted)' }}>{s.months} · {s.temp}</span>
            </div>
          </Reveal>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
            {s.picks.map((p, pi) => (
              <Reveal key={p.dest} delay={si * 80 + 40 + pi * 40}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
                  <span style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontStyle: 'italic', color: 'var(--cream)', minWidth: 'fit-content' }}>{p.dest}</span>
                  <span style={{ fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--cream2)', lineHeight: 1.5 }}>{p.note}</span>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={si * 80 + 160}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--dim)', marginBottom: 16 }}>{s.flights}</div>
            <div style={{ fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--copper)', fontStyle: 'italic' }}>
              This is our {s.cause.name} season. Donations go directly to{' '}
              <a href={s.cause.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--copper)', textDecoration: 'underline' }}>{s.cause.charity}</a>.
            </div>
          </Reveal>
        </section>
      ))}

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 32px 60px', textAlign: 'center' }}>
        <Link to="/" style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--cream2)', textDecoration: 'none', letterSpacing: 1 }}>← Back home</Link>
      </div>
    </div>
    </>
  );
}
