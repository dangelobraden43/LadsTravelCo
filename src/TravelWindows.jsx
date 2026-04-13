import React, { useState, useEffect, useRef, useCallback } from 'react';
import { IMAGES } from './images';
import { NEW_IMAGES } from './images-new';
import { BATCH3_IMAGES } from './images-batch3';
import { HERO_IMAGES } from './images-hero';
import './TravelWindows.css';

/* ===== SCROLL PROGRESS HOOK ===== */
function useScrollProgress(ref) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // progress 0 = element top enters viewport bottom
      // progress 1 = element bottom leaves viewport top
      const total = rect.height + vh;
      const traveled = vh - rect.top;
      setProgress(Math.min(1, Math.max(0, traveled / total)));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [ref]);
  return progress;
}

/* ===== REVEAL HOOK (mirrors App.jsx) ===== */
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

function Reveal({ children, className = 'reveal', style = {}, delay = 0 }) {
  const ref = useReveal();
  const s = delay ? { ...style, transitionDelay: `${delay}ms` } : style;
  return <div ref={ref} className={className} style={s}>{children}</div>;
}

/* ===== WINDOW DATA ===== */
const WINDOWS = [
  {
    id: 'post-labor-day',
    badge: '#1 RECOMMENDATION',
    name: 'Late August / September',
    tagline: 'The overall winner. Crowds vanish, prices follow, weather stays excellent.',
    image: HERO_IMAGES.sagradaFamiliaSunsetBarcelona,
    imageAlt: 'Sagrada Familia at sunset, Barcelona',
    stats: [
      { value: '30–45%', label: 'Fare drop vs July' },
      { value: 'Low–Med', label: 'Crowd level' },
      { value: '65–80°F', label: 'Avg temp Europe' },
    ],
    why: 'This is the single best travel window in the calendar and it\'s not close. The moment American kids go back to school, the entire European travel infrastructure exhales. Flights drop 30–45% from July peaks. Hotels that were sold out in August suddenly have availability. Restaurants in Rome and Barcelona go from "reservation required three weeks out" to "walk in and sit down." But the weather hasn\'t changed. September in Barcelona is 78°F. September in Rome is 75°F. You\'re getting July weather at October prices.',
    proof: 'ORD to Barcelona in September averages $580 round-trip versus $880 in July — a 34% drop for essentially identical weather. Rome accommodation in September runs 35% below August rates at the same properties. The Vatican in September has average wait times of 25 minutes versus 90+ in July. Munich in late September means Oktoberfest — strategic tent choices and weekday timing make it manageable.',
    bestFor: 'Literally everything except Nordic/Scandinavian trips. Rome, Barcelona, Madrid, Dublin, Prague, Vienna, Munich (especially Oktoberfest), Poland, Croatia, Greece. Multi-city trips. Budget-conscious travelers who want premium experiences.',
    skipIf: 'You\'re locked into a school calendar. You\'re going to Iceland for Midnight Sun (that\'s June). You need the absolute cheapest flights (late November still beats September on price alone).',
    ladsTake: 'If someone asks us "when should I go to Europe?" without any other constraints, the answer is always mid-September. Every time. September is the answer to the question most travelers don\'t know to ask: "When does Europe stop being a tourist destination and start being a place you can actually experience?"',
  },
  {
    id: 'shoulder-spring',
    badge: null,
    name: 'Late April / Early May',
    tagline: 'The shoulder season sweet spot.',
    image: NEW_IMAGES.pragueSkyline,
    imageAlt: 'Prague Old Town skyline with Tyn Church spires',
    stats: [
      { value: '20–35%', label: 'Fare drop vs summer' },
      { value: 'Medium', label: 'Crowd level' },
      { value: '55–70°F', label: 'Avg temp Europe' },
    ],
    why: 'Spring shoulder season in Europe is the closest thing to a cheat code in travel. The weather is warming up — Rome hits 65°F, Barcelona is already in the low 70s, and Dublin is having its driest stretch of the year. But schools aren\'t out yet. Airlines price this window below summer but above winter, creating a middle ground where you get 80% of the summer experience at 65% of the summer cost.',
    proof: 'Rome in late April averages $680 round-trip from ORD versus $950 in July. Barcelona in early May has average highs of 68°F with roughly half the tourist volume of August. The Vatican in April has 40% shorter lines than June–August. Ireland in May is statistically its driest month. Accommodation in Prague drops 25% compared to June bookings for the same properties.',
    bestFor: 'Mediterranean cities (Rome, Barcelona, Madrid). Ireland and UK (driest month). Culture-heavy itineraries with lots of walking. Groups who want good weather without summer pricing.',
    skipIf: 'You need guaranteed beach weather above 80°F. You\'re going to Scandinavia or Iceland (still cold in April). You need school break alignment for family travel.',
    ladsTake: 'Both Brady and Dawson have traveled Europe in this window. The difference between late April Rome and July Rome is the difference between enjoying the Colosseum and enduring it. If your schedule allows it, this window gives you the best version of almost every European city.',
  },
  {
    id: 'holiday',
    name: 'Late November / Early December',
    tagline: 'The underrated one. Cheap flights, thin crowds, Christmas markets.',
    image: BATCH3_IMAGES.galwayChristmas,
    imageAlt: 'Galway Christmas lights at night',
    stats: [
      { value: '25–40%', label: 'Fare drop vs peak' },
      { value: 'Low', label: 'Crowd level' },
      { value: '35–50°F', label: 'Avg temp Europe' },
    ],
    why: 'The window between American Thanksgiving and the Christmas travel surge is one of the least exploited in transatlantic travel. Airlines drop prices to fill seats during a period most Americans associate with staying home. European cities are entering their Christmas market season — Vienna, Prague, Munich, and Dresden all come alive with Gluhwein stands — but the tourist hordes haven\'t arrived yet. You\'re getting the atmosphere without the crowds.',
    proof: 'Dublin in late November averages 30% cheaper flights from ORD than the same route in June. Prague Christmas markets open November 30 most years — arrive the first week and you\'ll have the Old Town Square stalls practically to yourself. Vienna\'s Rathausplatz market runs late November through December 23, and hotel rates don\'t spike until December 10.',
    bestFor: 'Christmas markets (Vienna, Prague, Munich, Dresden). Pub culture (Dublin, Galway). City culture trips where weather doesn\'t matter. Budget-conscious groups who want Europe without peak pricing.',
    skipIf: 'You want beach weather. You need guaranteed sunshine. You\'re going to Mediterranean destinations where off-season means closed restaurants and empty coastlines.',
    ladsTake: 'Brady went to Dublin in late November. The pubs were full of locals, the flights were cheap, and Temple Bar was actually walkable. This window is for people who understand that the best version of a city isn\'t always the sunniest one.',
  },
  {
    id: 'peak-summer',
    name: 'August',
    tagline: 'Beach destinations only. Everything else is a trap.',
    image: NEW_IMAGES.fitzroyBeach,
    imageAlt: 'Fitzroy Island turquoise beach through tropical canopy',
    stats: [
      { value: 'Peak', label: 'European pricing' },
      { value: 'High', label: 'Crowd level' },
      { value: '75–95°F', label: 'Avg temp S. Europe' },
    ],
    why: 'August is the single most overbooked month in European travel. Every American family with school-age kids is competing for the same flights, hotels, and restaurant tables. City trips to Rome, Paris, and Barcelona in August are genuinely unpleasant — 95°F heat, three-hour museum lines, and prices inflated 40% above shoulder season. But August is when certain destinations peak the right way. Beach destinations and Eastern Europe are built for August.',
    proof: 'Poland flights from ORD in August average $620 on LOT direct — compared to $850–950 for Western European capitals. Krakow in August averages 77°F. Gdansk has Baltic beaches that feel like a secret. Thailand\'s Koh Samui and Koh Phangan are in dry season on the Gulf side. The smart August move is geographic arbitrage: go where Europeans aren\'t going.',
    bestFor: 'Poland (warm, cheap, uncrowded). Beach destinations (Greek islands, Croatia). Thailand Gulf coast. Groups locked into summer schedules who pick the right destinations.',
    skipIf: 'You\'re going to Rome, Paris, Barcelona, or any Western European capital. You hate heat. You want value. You don\'t have a specific beach or Eastern European destination in mind.',
    ladsTake: 'We built the Poland framework specifically for August because it\'s the contrarian play. Everyone\'s fighting over overpriced Western European capitals while Krakow, Warsaw, and Gdansk are sitting there with direct flights from ORD and world-class nightlife. August isn\'t bad — August in the wrong place is bad.',
  },
];

/* ===== SINGLE WINDOW COMPONENT ===== */
function WindowPanel({ window: w, index }) {
  const panelRef = useRef(null);
  const progress = useScrollProgress(panelRef);
  const [expanded, setExpanded] = useState(false);

  // Photo zoom: 1.0 → 1.12 over scroll
  const photoScale = 1 + progress * 0.12;
  // Gradient: starts at 40% opacity, ends at 85%
  const gradientOpacity = 0.4 + progress * 0.45;
  // Content fades in after 20% scroll progress
  const contentOpacity = Math.min(1, Math.max(0, (progress - 0.2) / 0.3));
  // Stats slide up
  const statsTranslate = Math.max(0, 40 - (progress * 80));

  const isWinner = w.badge != null;

  return (
    <div
      ref={panelRef}
      className="tw2-panel"
      style={{ position: 'relative' }}
    >
      {/* Sticky photo container */}
      <div className="tw2-sticky">
        <div className="tw2-photo-wrap">
          <img
            src={w.image}
            alt={w.imageAlt}
            className="tw2-photo"
            style={{ transform: `scale(${photoScale})` }}
          />
          <div
            className="tw2-photo-overlay"
            style={{
              background: `linear-gradient(
                to bottom,
                rgba(20,18,16,${gradientOpacity * 0.3}) 0%,
                rgba(20,18,16,${gradientOpacity * 0.6}) 30%,
                rgba(20,18,16,${gradientOpacity}) 60%,
                rgba(20,18,16,0.97) 100%
              )`
            }}
          />

          {/* Content overlaid on photo */}
          <div
            className="tw2-content"
            style={{ opacity: contentOpacity }}
          >
            {/* Badge */}
            {isWinner && (
              <div className="tw2-winner-badge">{w.badge}</div>
            )}

            {/* Window name */}
            <h3 className={`tw2-name ${isWinner ? 'tw2-name-gold' : ''}`}>
              {w.name}
            </h3>
            <p className="tw2-tagline">{w.tagline}</p>

            {/* Stats row */}
            <div
              className="tw2-stats"
              style={{ transform: `translateY(${statsTranslate}px)` }}
            >
              {w.stats.map((s, i) => (
                <Reveal key={i} className="reveal tw2-stat" delay={i * 100}>
                  <div className="tw2-stat-value">{s.value}</div>
                  <div className="tw2-stat-label">{s.label}</div>
                </Reveal>
              ))}
            </div>

            {/* Expand toggle */}
            <button
              className="tw2-expand-btn"
              onClick={() => setExpanded(!expanded)}
            >
              <span>{expanded ? 'Collapse' : 'Read the full breakdown'}</span>
              <span className={`tw2-expand-chevron ${expanded ? 'open' : ''}`}>&#9662;</span>
            </button>
          </div>
        </div>
      </div>

      {/* Expanded detail section — below the sticky viewport */}
      <div className={`tw2-detail ${expanded ? 'tw2-detail-open' : ''}`}>
        <div className="tw2-detail-inner">
          <div className="tw2-detail-section">
            <div className="tw2-detail-label">Why It Works</div>
            <p className="tw2-detail-text">{w.why}</p>
          </div>

          <div className="tw2-detail-section">
            <div className="tw2-detail-label">Proof Points</div>
            <p className="tw2-detail-text">{w.proof}</p>
          </div>

          <div className="tw2-best-skip">
            <div className="tw2-best">
              <div className="tw2-best-title">Best For</div>
              <p className="tw2-best-text">{w.bestFor}</p>
            </div>
            <div className="tw2-skip">
              <div className="tw2-skip-title">Skip If</div>
              <p className="tw2-skip-text">{w.skipIf}</p>
            </div>
          </div>

          <div className="tw2-lads-take">
            <div className="tw2-lads-take-label">The Lads' Take</div>
            <p className="tw2-lads-take-text">{w.ladsTake}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===== MAIN EXPORT ===== */
export default function TravelWindows() {
  return (
    <div className="tw2-section">
      {/* Dark gradient in from light system section */}
      <div className="tw2-gradient-in" />

      <div className="tw2-header">
        <Reveal>
          <div className="section-label" style={{ textAlign: 'center', color: 'var(--gold)' }}>
            Travel Windows
          </div>
          <h2 className="tw2-section-title">
            When to <em>Actually Go</em>
          </h2>
          <p className="tw2-section-desc">
            Four optimal windows based on fare data, crowd patterns, and weather.
            Everything outside these windows costs more and delivers less.
          </p>
        </Reveal>
      </div>

      {WINDOWS.map((w, i) => (
        <WindowPanel key={w.id} window={w} index={i} />
      ))}

      {/* Dark gradient out back to light system section */}
      <div className="tw2-gradient-out" />
    </div>
  );
}
