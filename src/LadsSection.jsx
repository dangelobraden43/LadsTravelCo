import React, { useState, useEffect, useRef } from 'react';
import { IMAGES } from './images';
import { NEW_IMAGES } from './images-new';
import { BATCH3_IMAGES } from './images-batch3';
import { BATCH4_IMAGES } from './images-batch4';
import { HERO_IMAGES } from './images-hero';
import { HEIC_HERO_IMAGES } from './images-heic-hero';
import './LadsSection.css';

/* ===== HOOKS ===== */
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
  const cls = type === 'up' ? 'reveal' : type === 'fade' ? 'reveal-fade' : type === 'scale' ? 'reveal-scale' : type === 'left' ? 'reveal-left' : 'reveal';
  const s = delay ? { ...style, transitionDelay: `${delay}ms` } : style;
  return <div ref={ref} className={cls} style={s}>{children}</div>;
}

/* ===== DATA ===== */
const FOUNDERS = [
  {
    name: 'Brady',
    role: 'Builder / Data Science',
    img: IMAGES.surf,
    credentials: [
      { label: 'M.S. Applied Statistics', detail: 'Grand Valley State University (May 2027)' },
      { label: 'Farmers Insurance', detail: 'Gradient boosting models — 24.7% error reduction on 2M+ records' },
      { label: 'Ford Motor Company', detail: 'Starting May 2026' },
      { label: 'GVSU Padnos International Center', detail: 'Former peer advisor — sent students abroad' },
      { label: '20+ cities, 4 continents', detail: 'Every spot in the database validated firsthand' },
    ],
  },
  {
    name: 'Dawson',
    role: 'Analytics / Firsthand Knowledge',
    img: IMAGES.stoutie,
    credentials: [
      { label: 'Data Analytics', detail: 'Kalamazoo College' },
      { label: 'Study abroad: Madrid', detail: 'Full semester immersion' },
      { label: 'Full Iceland Ring Road', detail: 'Drove every kilometer' },
      { label: 'Firsthand knowledge', detail: 'Spain, Ireland, Iceland, Rome, Paris' },
      { label: 'Co-validates', detail: 'Every framework recommendation' },
    ],
  },
];

const TIMELINE = [
  { year: '2023', event: 'Costa Rica trip — first framework seed', milestone: false },
  { year: '2024', event: 'Sydney study abroad (6 weeks)', milestone: true },
  { year: '2024', event: 'Europe summer — Rome, Barcelona, Prague, Vienna', milestone: false },
  { year: '2024', event: 'Iceland Ring Road (Dawson)', milestone: false },
  { year: '2025', event: 'Barcelona study abroad (Brady)', milestone: true },
  { year: '2025', event: 'Broke hand surfing → 20-day build sprint', milestone: true },
  { year: '2026', event: 'Site launches. Peru trip (May). Ford starts.', milestone: true },
  { year: '2026', event: 'Poland trip (August)', milestone: false },
  { year: '2027', event: 'M.S. graduation. Paid consulting launches.', milestone: true },
];

const GALLERY_IMAGES = [
  { src: NEW_IMAGES.pragueOldTown, alt: 'Lads in Prague Old Town' },
  { src: BATCH3_IMAGES.bradyStPeters, alt: 'Brady at St Peters Rome' },
  { src: NEW_IMAGES.galwayGuinness, alt: 'Lads with Guinness Galway' },
  { src: BATCH3_IMAGES.kangarooFeeding, alt: 'Feeding a kangaroo' },
  { src: NEW_IMAGES.surfGroup, alt: 'Surf group Australia' },
  { src: BATCH3_IMAGES.munichMarienplatz, alt: 'Brady at Marienplatz Munich' },
  { src: NEW_IMAGES.schonbrunnWalk, alt: 'Walking into Schonbrunn' },
  { src: NEW_IMAGES.mountainOverlook, alt: 'Mountain overlook Costa Rica' },
  { src: BATCH3_IMAGES.hohRainforest, alt: 'Hoh Rainforest Olympic' },
  { src: NEW_IMAGES.pilsnerUrquell, alt: 'Pilsner Urquell brewery' },
  { src: BATCH3_IMAGES.rockPoolSwim, alt: 'Rock pool swim Australia' },
  { src: NEW_IMAGES.glendalough, alt: 'Glendalough Ireland' },
  { src: BATCH4_IMAGES.barcelona_IMG_0393, alt: 'Barcelona street life' },
  { src: HEIC_HERO_IMAGES.heicHiking_IMG_4327, alt: 'Mountain summit trail' },
];

const TRIP_STYLES = ['Nightlife', 'Culture', 'Beach', 'Adventure', 'Food & Drink', 'Mix'];

/* ===== COMPONENT ===== */
export default function LadsSection({ quizData }) {
  const [formSent, setFormSent] = useState(false);
  const [formError, setFormError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [styles, setStyles] = useState(quizData?.styles || []);
  const formRef = useRef(null);

  const hasQuizData = quizData && quizData.destination;

  const toggleStyle = (s) => {
    setStyles(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const fd = new FormData(e.target);
    fd.set('Trip Style', styles.join(', '));
    if (quizData) {
      if (quizData.destination) fd.set('Quiz Destination', quizData.destination);
      if (quizData.timing) fd.set('Quiz Timing', quizData.timing);
      if (quizData.group) fd.set('Quiz Group', quizData.group);
      if (quizData.budget) fd.set('Quiz Budget', quizData.budget);
    }
    try {
      const res = await fetch('https://formspree.io/f/xvzvekkk', { method: 'POST', body: fd, headers: { Accept: 'application/json' } });
      if (res.ok) { setFormSent(true); setFormError(false); }
      else { setFormError(true); }
    } catch { setFormError(true); }
    setSubmitting(false);
  };

  return (
    <div className="lads-root">
      {/* Section Intro */}
      <section className="lads-intro">
        <div className="lads-inner">
          <Reveal>
            <div className="lads-label">THE LADS</div>
            <h2 className="lads-title">Who <em>We Are</em></h2>
            <p className="lads-desc">Two guys, 650+ spots, and zero interest in giving you the same itinerary as everyone else.</p>
          </Reveal>
        </div>
      </section>

      {/* Founders */}
      <section className="lads-founders-section">
        <div className="lads-inner">
          <div className="lads-founders-grid">
            {FOUNDERS.map((f, fi) => (
              <Reveal key={f.name} delay={fi * 150} type="scale">
                <div className="lads-founder">
                  <div className="lads-founder-photo">
                    <img src={f.img} alt={f.name} />
                    <div className="lads-founder-photo-overlay" />
                    <div className="lads-founder-photo-info">
                      <div className="lads-founder-name">{f.name}</div>
                      <div className="lads-founder-role">{f.role}</div>
                    </div>
                  </div>
                  <div className="lads-founder-creds">
                    {f.credentials.map((c, ci) => (
                      <div key={ci} className="lads-cred-row">
                        <div className="lads-cred-label">{c.label}</div>
                        <div className="lads-cred-detail">{c.detail}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Build Story Callout */}
      <section className="lads-build">
        <div className="lads-inner">
          <Reveal type="fade">
            <div className="lads-build-card">
              <div className="lads-build-stat">20 Days</div>
              <p className="lads-build-text">Broke his hand surfing in Costa Rica. Built the entire site, research pipeline, and 650+ spot database with one good hand. 4.0 GPA didn't drop.</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Photo Gallery — Horizontal Scroll */}
      <div className="lads-gallery">
        {GALLERY_IMAGES.map((img, i) => (
          <div key={i} className="lads-gallery-item">
            <img src={img.src} alt={img.alt} loading="lazy" />
          </div>
        ))}
      </div>

      {/* Timeline */}
      <section className="lads-timeline-section">
        <div className="lads-inner">
          <Reveal>
            <h3 className="lads-section-heading">How We Got Here</h3>
          </Reveal>
          <div className="lads-timeline">
            {TIMELINE.map((t, i) => (
              <Reveal key={i} delay={i * 50}>
                <div className="lads-timeline-item">
                  <div className={`lads-timeline-dot ${t.milestone ? 'milestone' : ''}`} />
                  <div className="lads-timeline-year">{t.year}</div>
                  <div className="lads-timeline-event">{t.event}</div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={200}>
            <p className="lads-study-abroad">
              Brady spent two years as a peer advisor at GVSU's Padnos International Center. If you're heading overseas through a university program, we've literally done this job before.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Book a Call */}
      <section className="lads-call-section">
        <div className="lads-inner" style={{textAlign:'center'}}>
          <Reveal type="fade">
            <h3 className="lads-call-heading">Want to talk first?</h3>
            <p className="lads-call-sub">15 minutes. Free. We'll tell you if we can actually help.</p>
            <button
              className="lads-call-btn"
              data-cal-link="braden-dangelo/secret"
              data-cal-namespace="secret"
              data-cal-config='{"layout":"month_view"}'
            >Book a Call</button>
          </Reveal>
        </div>
      </section>

      {/* Intake Form */}
      <div className="lads-gradient-to-dark" />
      <section className="lads-form-section" id="intake-form">
        <div className="lads-inner">
          <div className="lads-form-container" ref={formRef}>
            {formSent ? (
              <Reveal type="scale">
                <div className="lads-form-success">
                  <h4>Got it.</h4>
                  <p>Brady will follow up within 24 hours.</p>
                </div>
              </Reveal>
            ) : (
              <>
                <div className="lads-form-header">
                  <h3>{hasQuizData ? 'Almost there. Just a few details.' : 'Tell Us Where You\'re Going'}</h3>
                  {!hasQuizData && <p>No cost through 2026. Seriously.</p>}
                  {hasQuizData && quizData.destination && (
                    <div className="lads-form-prefill-tag">Planning: {quizData.destination}</div>
                  )}
                </div>
                <form onSubmit={handleSubmit}>
                  <input type="hidden" name="_subject" value="New Trip Inquiry" />
                  {hasQuizData && quizData.destination && <input type="hidden" name="Destination" value={quizData.destination} />}
                  {hasQuizData && quizData.timing && <input type="hidden" name="Travel Dates" value={quizData.timing} />}
                  {hasQuizData && quizData.group && <input type="hidden" name="Group Size" value={quizData.group} />}
                  {hasQuizData && quizData.budget && <input type="hidden" name="Budget" value={quizData.budget} />}

                  <div className="lads-form-grid">
                    <div className="lads-form-field">
                      <label>Name *</label>
                      <input name="Name" required placeholder="Your name" />
                    </div>
                    <div className="lads-form-field">
                      <label>Email *</label>
                      <input name="Email" type="email" required placeholder="you@email.com" />
                    </div>
                  </div>

                  {!hasQuizData && (
                    <>
                      <div className="lads-form-grid">
                        <div className="lads-form-field">
                          <label>Trip Type</label>
                          <select name="Trip Type">
                            <option value="">Select...</option>
                            <option>International</option>
                            <option>Domestic</option>
                            <option>Both</option>
                            <option>Not Sure</option>
                          </select>
                        </div>
                        <div className="lads-form-field">
                          <label>Destination</label>
                          <input name="Destination" placeholder="Where are you thinking?" />
                        </div>
                      </div>
                      <div className="lads-form-grid">
                        <div className="lads-form-field">
                          <label>Travel Dates</label>
                          <input name="Travel Dates" placeholder="e.g., September 2026" />
                        </div>
                        <div className="lads-form-field">
                          <label>Group Size</label>
                          <select name="Group Size">
                            <option value="">Select...</option>
                            <option>Just me</option>
                            <option>2</option>
                            <option>3-4</option>
                            <option>5-6</option>
                            <option>7-10</option>
                            <option>10+</option>
                          </select>
                        </div>
                      </div>
                      <div className="lads-form-grid">
                        <div className="lads-form-field">
                          <label>Budget Per Person</label>
                          <select name="Budget">
                            <option value="">Select...</option>
                            <option>Under $1K</option>
                            <option>$1K - $3K</option>
                            <option>$3K - $5K</option>
                            <option>$5K - $7K+</option>
                            <option>Flexible</option>
                          </select>
                        </div>
                        <div className="lads-form-field">
                          <label>Savings Priority</label>
                          <select name="Savings Priority">
                            <option value="">Select...</option>
                            <option>Cheapest possible</option>
                            <option>Best value</option>
                            <option>Don't care — just make it great</option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="lads-form-grid">
                    <div className="lads-form-field">
                      <label>Cities Already Visited</label>
                      <input name="Cities Visited" placeholder="Rome, Barcelona, London..." />
                    </div>
                    <div className="lads-form-field">
                      <label>How'd You Hear About Us?</label>
                      <select name="Referral">
                        <option value="">Select...</option>
                        <option>Friend</option>
                        <option>Instagram</option>
                        <option>LinkedIn</option>
                        <option>University</option>
                        <option>Google</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>

                  {!hasQuizData && (
                    <div className="lads-form-field" style={{marginBottom:20}}>
                      <label>Trip Style</label>
                      <div className="lads-form-styles">
                        {TRIP_STYLES.map(s => (
                          <button key={s} type="button"
                            className={`lads-form-style-pill ${styles.includes(s) ? 'active' : ''}`}
                            onClick={() => toggleStyle(s)}
                          >{s}</button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="lads-form-field">
                    <label>Anything Else?</label>
                    <textarea name="Notes" rows={3} placeholder="Allergies, must-dos, deal-breakers..." />
                  </div>

                  {formError && <p className="lads-form-error">Something went wrong. Try again or email dangelobraden43@gmail.com</p>}

                  <button type="submit" className="lads-form-submit" disabled={submitting}>
                    {submitting ? 'Sending...' : "Let's Plan Your Trip"}
                  </button>
                </form>
              </>
            )}
          </div>
          <p className="lads-form-fallback">Or reach out directly — <a href="mailto:dangelobraden43@gmail.com">dangelobraden43@gmail.com</a></p>
        </div>
      </section>
    </div>
  );
}
