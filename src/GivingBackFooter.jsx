import React, { useState, useRef, useEffect } from 'react';
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

const CAUSES = [
  { window: 'LATE AUG — SEP', cause: 'Breast Cancer Research', charity: 'Ginny L. Clements Institute', url: 'https://cancercenter.arizona.edu/about/ginny-l-clements-breast-cancer-research-institute' },
  { window: 'LATE NOV — DEC', cause: "Children's Hospital", charity: 'C.S. Mott Children\'s Hospital', url: 'https://www.michiganmedicine.org/giving/areas-support/giving-cs-mott-childrens-hospital' },
  { window: 'LATE APR — MAY', cause: 'Protecting Our Parks', charity: 'National Parks Conservation Assoc.', url: 'https://support.npca.org/page/94316/action/1' },
  { window: 'AUGUST', cause: 'Youth Athletics', charity: 'TUFF — The Uniform Funding Foundation', url: 'https://gettuff.org/donate' },
];

export default function GivingBackFooter() {
  const [emailSent, setEmailSent] = useState(false);
  const [emailSubmitting, setEmailSubmitting] = useState(false);

  const handleEmail = async (e) => {
    e.preventDefault();
    setEmailSubmitting(true);
    const fd = new FormData(e.target);
    try {
      const res = await fetch('https://formspree.io/f/xvzvekkk', { method: 'POST', body: fd, headers: { Accept: 'application/json' } });
      if (res.ok) setEmailSent(true);
    } catch {}
    setEmailSubmitting(false);
  };

  return (
    <>
      {/* ===== GIVING BACK ===== */}
      <div className="gb-gradient-in" />
      <section className="gb-section">
        <div className="gb-inner">
          <Reveal type="fade">
            <blockquote className="gb-philosophy">
              "If you allow yourself to not stress about the small things, the lifelong memories typically create themselves without even thinking about it."
            </blockquote>
            <div className="gb-philosophy-label">THE LADS PHILOSOPHY</div>
          </Reveal>

          <Reveal delay={200}>
            <p className="gb-statement">
              Every trip we plan through 2026 is free. Any donations go straight to these causes. We don't take a cut.
            </p>
            <p className="gb-statement" style={{ marginTop: 8, fontSize: 15, opacity: 0.7 }}>
              Free through 2026. Building something that lasts.
            </p>
          </Reveal>

          <div className="gb-causes">
            {CAUSES.map((c, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="gb-cause">
                  <div className="gb-cause-window">{c.window}</div>
                  <div className="gb-cause-name">{c.cause}</div>
                  <div className="gb-cause-charity">{c.charity}</div>
                  <a href={c.url} target="_blank" rel="noopener noreferrer" className="gb-cause-link">Donate &rarr;</a>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="gb-rotation-note">CAUSES ROTATE WITH EACH TRAVEL WINDOW</div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="ft-footer">
        <div className="ft-inner">
          <div className="ft-brand">
            <div className="ft-brand-icon">L</div>
            <span className="ft-brand-name">The Lads Travel Co.</span>
          </div>

          <p className="ft-tagline">Built with coffee, flight delays, and questionable pub decisions.</p>

          {/* Email capture */}
          <div className="ft-email">
            {emailSent ? (
              <p className="ft-email-thanks">You're in. We'll be in touch.</p>
            ) : (
              <form onSubmit={handleEmail} className="ft-email-form">
                <input type="hidden" name="_subject" value="Email Signup" />
                <input name="email" type="email" required placeholder="your@email.com" className="ft-email-input" />
                <button type="submit" className="ft-email-btn" disabled={emailSubmitting}>
                  {emailSubmitting ? '...' : 'Stay Updated'}
                </button>
              </form>
            )}
          </div>

          <div className="ft-contact">
            <a href="mailto:dangelobraden43@gmail.com">dangelobraden43@gmail.com</a>
          </div>

          <div className="ft-copy">&copy; 2026 The Lads Travel Co.</div>
        </div>
      </footer>
    </>
  );
}
