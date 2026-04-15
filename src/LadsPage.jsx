import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Nav } from './App';
import LadsSection from './LadsSection';
import './LadsSection.css';
import GivingBackFooter from './GivingBackFooter';
import './GivingBackFooter.css';

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

export default function LadsPage() {
  return (
    <>
    <Nav scrolled={true} />
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingTop: 80 }}>
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 32px 40px' }}>
        <Reveal>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, letterSpacing: 3, color: 'var(--copper)', marginBottom: 12 }}>THE LADS</div>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', fontStyle: 'italic', fontWeight: 400, color: 'var(--cream)', lineHeight: 1.15, marginBottom: 12 }}>Who We Are.</h1>
          <p style={{ fontFamily: 'var(--sans)', fontSize: 15, color: 'var(--cream2)', maxWidth: 560 }}>Two guys, 650+ spots, and zero interest in giving you the same itinerary as everyone else.</p>
        </Reveal>
      </section>

      <LadsSection />

      <GivingBackFooter />
    </div>
    </>
  );
}
