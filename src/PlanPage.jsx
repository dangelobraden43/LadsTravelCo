import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Nav } from './App';
import SystemSection from './SystemSection';
import './SystemSection.css';
import LadsSection from './LadsSection';
import './LadsSection.css';

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

export default function PlanPage() {
  const [quizData, setQuizData] = useState(null);

  return (
    <>
    <Nav scrolled={true} />
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingTop: 80 }}>
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 32px 40px', textAlign: 'center' }}>
        <Reveal>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, letterSpacing: 3, color: 'var(--copper)', marginBottom: 12 }}>START PLANNING</div>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', fontStyle: 'italic', fontWeight: 400, color: 'var(--cream)', lineHeight: 1.15, marginBottom: 8 }}>
            Free through 2026. <em style={{ color: 'var(--gold)' }}>Seriously.</em>
          </h1>
        </Reveal>
      </section>

      <SystemSection onQuizComplete={(data) => {
        setQuizData(data);
        setTimeout(() => {
          const el = document.getElementById('intake-form');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      }} />

      <LadsSection quizData={quizData} />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px 60px', textAlign: 'center' }}>
        <Link to="/" style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--cream2)', textDecoration: 'none', letterSpacing: 1 }}>← Back home</Link>
      </div>
    </div>
    </>
  );
}
