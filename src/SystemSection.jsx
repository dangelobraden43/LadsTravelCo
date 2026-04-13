import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';

const Globe = lazy(() => import('./Globe'));
import { IMAGES } from './images';
import { NEW_IMAGES } from './images-new';
import { BATCH3_IMAGES } from './images-batch3';
import { HERO_IMAGES } from './images-hero';
import TravelWindows from './TravelWindows';
import './SystemSection.css';

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
function useCountUp(target, duration = 1500) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started) { setStarted(true); obs.unobserve(el); }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [started]);
  useEffect(() => {
    if (!started) return;
    const num = parseInt(target);
    if (isNaN(num)) { setCount(target); return; }
    const startTime = performance.now();
    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(num * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [started, target, duration]);
  return { ref, count, started };
}

const PROCESS_STEPS = [
  { num: '01', title: 'Fill Out the Intake', desc: '90 seconds. Where, who, when, budget.' },
  { num: '02', title: '15-Minute Call', desc: 'Flights, stay, experiences — all covered.' },
  { num: '03', title: 'Research Runs', desc: 'Six AI agents. Flights, neighborhoods, savings.' },
  { num: '04', title: 'Framework Delivered', desc: 'Designed HTML doc. Cost breakdowns. Validated spots.' },
  { num: '05', title: 'Follow-Up Included', desc: 'Plans change — we\'re here when they do.' },
];

const FLIGHT_STRATEGIES = [
  { num: '01', title: 'How Airline Pricing Works', desc: 'Airlines use dynamic pricing algorithms. A seat can cost $400 or $1,200 depending on when you book and what fare class is available. We monitor when cheap buckets reopen.' },
  { num: '02', title: 'The Booking Window', desc: 'Optimal: 6–10 weeks out for economy, 4–8 for off-peak, 8–14 for peak summer. We track routes and alert when fares drop below target thresholds.' },
  { num: '03', title: 'Google Flights', desc: 'The single best flight search tool. Free. Searches direct airline inventory, shows fare calendars, tracks prices. The Explore map, date grid, and alerts — we use all four.' },
  { num: '04', title: 'Error Fares', desc: 'Airlines accidentally publish wrong prices. A $900 flight appears for $280. They honor them ~70% of the time. We monitor sources and alert immediately. Window: 2–6 hours.' },
  { num: '05', title: 'Flexible Dates', desc: 'Tuesday vs Friday saves $150–300 per person transatlantic. Mid-week flights are consistently cheaper. We map the full fare landscape for every route.' },
  { num: '06', title: 'Open-Jaw Routing', desc: 'Fly into one city, out of another. Eliminates backtracking. Saves $200–400 per person vs round-trip plus positioning flights.' },
  { num: '07', title: 'Hub Arbitrage', desc: 'ORD vs DTW fare differences are dramatic. ORD has more competition = lower fares. For Michigan clients, driving to O\'Hare saves $200+ per person.',
    table: { headers: ['Route','From ORD','From DTW','Savings'], rows: [['Dublin','$480–550','$650–780','$170–230'],['Rome','$580–680','$720–850','$140–170'],['Barcelona','$520–620','$680–800','$160–180'],['Warsaw (LOT)','$550–650','$750–900','$200–250'],['Reykjavik','$380–480','$520–650','$140–170']] } },
];

const FLIGHT_MYTHS = [
  { myth: '"Tuesday is always the cheapest day to book"', reality: 'Airlines reprice dynamically thousands of times daily. The booking day matters far less than the departure day, booking window, and fare class availability.' },
  { myth: '"Incognito mode gets you cheaper flights"', reality: 'Airlines don\'t track your search history to raise prices. Price variations are caused by real-time fare class changes, not cookies. Savings from incognito: zero.' },
  { myth: '"Book 6 months early for the best price"', reality: 'Booking too early = paying the certainty premium. The sweet spot is 6–10 weeks out for international economy, when airlines open cheaper fare classes to fill seats.' },
  { myth: '"Direct flights are always more expensive"', reality: 'On competitive routes, directs are often cheaper. ORD to Dublin on Aer Lingus direct frequently beats connecting through JFK on American.' },
];

const ALL_CITIES = [
  {city:"Sydney",n:123},{city:"Barcelona",n:115},{city:"Rome",n:43},{city:"Dublin",n:39},
  {city:"Prague",n:38},{city:"Vienna",n:37},{city:"Costa Rica",n:28},{city:"Tasmania",n:27},
  {city:"Vancouver",n:22},{city:"Chicago",n:15},{city:"Galway",n:15},{city:"San Juan",n:14},
  {city:"Seattle",n:14},{city:"Smoky Mtns",n:8},{city:"Phoenix",n:7}
];

const DELIVERABLES = [
  { title: 'Custom Trip Framework', desc: 'Your full itinerary in a designed, interactive doc. Cost breakdowns, validated spots, day-by-day templates. Works on your phone.', preview: 'framework' },
  { title: 'Flight Intelligence Report', desc: 'Route analysis, booking windows, hub arbitrage comparison, error fare monitoring. For your specific dates and airports.', preview: 'flights' },
  { title: '18 Google Maps Lists', desc: 'Drop them into your phone and navigate like you live there. Every restaurant, bar, attraction, and hidden spot we found.', preview: 'maps' },
  { title: 'Money Intelligence', desc: 'Per-person cost models for your group size. Accommodation, food, transport, experiences. No surprises.', preview: 'money' },
  { title: 'Personalized Match', desc: 'Don\'t know where to go? Take the quiz below. Seven questions and we\'ll tell you exactly where to start.', preview: 'quiz' },
];

const QUIZ_QUESTIONS = [
  { id: 'destination', question: 'Do you know where you want to go?', type: 'choice',
    options: [
      { value: 'exact', label: 'I know exactly', hasInput: true, inputPlaceholder: 'Type your destination...' },
      { value: 'region', label: 'I have a region in mind', hasSubOptions: true, subOptions: ['Europe','Central America','Southeast Asia','Australia & NZ','Domestic US'] },
      { value: 'surprise', label: 'Surprise me' },
    ]},
  { id: 'timing', question: 'When are you thinking?', type: 'choice',
    options: [
      { value: 'dates', label: 'I have dates', hasInput: true, inputPlaceholder: 'e.g., September 2026' },
      { value: 'flexible', label: 'I\'m flexible on timing', hasSubOptions: true, subOptions: ['Spring','Summer','Fall','Winter'] },
      { value: 'whenever', label: 'Whenever makes the most sense' },
    ]},
  { id: 'group', question: 'Who\'s going?', type: 'choice',
    options: [
      { value: 'solo', label: 'Just me' },
      { value: 'couple', label: 'Me and my partner' },
      { value: 'friends', label: 'Friends', hasCounter: true, min: 3, max: 10 },
      { value: 'family', label: 'Family', hasCounter: true, min: 2, max: 10 },
    ]},
  { id: 'budget', question: 'What\'s your budget per person?', type: 'choice',
    options: [
      { value: 'low', label: 'Under $3K' },
      { value: 'mid', label: '$3K – $5K' },
      { value: 'high', label: '$5K – $7K+' },
      { value: 'flex', label: 'Flexible — tell me what it costs' },
    ]},
  { id: 'priorities', question: 'What matters most?', subtitle: 'Pick up to 3', type: 'multi', maxSelect: 3,
    options: [
      { value: 'nightlife', label: 'Nightlife & social' },
      { value: 'culture', label: 'History & culture' },
      { value: 'beach', label: 'Beaches & relaxation' },
      { value: 'adventure', label: 'Adventure & outdoors' },
      { value: 'food', label: 'Food & drink' },
      { value: 'photography', label: 'Photography & scenery' },
    ]},
  { id: 'avoid', question: 'Anything you want to avoid?', subtitle: 'Optional', type: 'multi', maxSelect: 6, optional: true,
    options: [
      { value: 'crowds', label: 'Crowds' },
      { value: 'cold', label: 'Cold weather' },
      { value: 'longflights', label: 'Long flights (8+ hrs)' },
      { value: 'budget-stays', label: 'Budget accommodation' },
      { value: 'packed', label: 'Packed schedules' },
      { value: 'touristy', label: 'Tourist traps' },
    ]},
  { id: 'been', question: 'Where have you already been?', subtitle: 'So we don\'t send you somewhere you\'ve done.', type: 'text', optional: true, placeholder: 'e.g., Rome, Barcelona, London...' },
];

const QUIZ_RECS = {
  nightlife_low: { pick: "Dublin + Galway", why: "Cheapest validated nightlife city. 35+ pubs, three timing versions, flights from ORD under $500 shoulder season.", alt: "Poland August", altWhy: "Krakow's nightlife district is world-class and even cheaper.", link: "/dublin" },
  nightlife_mid: { pick: "Munich Oktoberfest", why: "Event-driven nightlife at its peak. Augustiner tent strategy, Glockenbachviertel base, cost model for groups of 4-10.", alt: "Barcelona + Madrid", altWhy: "100+ validated spots and Madrid nightlife.", link: "munich.html" },
  nightlife_high: { pick: "Thailand NYE", why: "Full Moon Party, Bangkok rooftops, Krabi beach clubs. Cathay Pacific via Hong Kong.", alt: "Barcelona + Madrid", altWhy: "Barcelona's nightlife runs until 6am.", link: "thailand.html" },
  nightlife_flex: { pick: "Thailand NYE", why: "Full Moon Party, Bangkok rooftops, Krabi beach clubs. Cathay Pacific via Hong Kong.", alt: "Barcelona + Madrid", altWhy: "Barcelona's nightlife runs until 6am.", link: "thailand.html" },
  culture_low: { pick: "Prague + Vienna + Dresden", why: "Best value culture cities in Europe. St. Vitus, Schonbrunn, Pilsner Urquell — all on a budget.", alt: "Dublin + Galway", altWhy: "Literary pubs, medieval castles, Cliffs of Moher under $2K.", link: "prague-vienna.html" },
  culture_mid: { pick: "Rome + Italy", why: "Deepest culture framework. Vatican Jubilee, Pompeii 11/10, Trastevere routing, 43 spots.", alt: "Barcelona + Madrid", altWhy: "Sagrada Familia, Montserrat, the Prado.", link: "italy.html" },
  culture_high: { pick: "Australia + NZ", why: "Six weeks of depth. Opera House, Aboriginal experiences, Tasmania, South Island.", alt: "Rome + Italy extended", altWhy: "Add Amalfi and Florence for 10-day deep dive.", link: "australia-nz.html" },
  culture_flex: { pick: "Australia + NZ", why: "Six weeks of depth. Opera House, Aboriginal experiences, Tasmania, South Island.", alt: "Rome + Italy extended", altWhy: "Add Amalfi and Florence for 10-day deep dive.", link: "australia-nz.html" },
  adventure_low: { pick: "Iceland", why: "Ring Road at any budget. Northern Lights or Midnight Sun. Four versions.", alt: "Smoky Mountains", altWhy: "Cabin, fall colors, minimal flight cost.", link: "iceland.html" },
  adventure_mid: { pick: "Iceland", why: "Ring Road at any budget. Northern Lights or Midnight Sun. Four versions.", alt: "Costa Rica", altWhy: "ATV tour, surf lessons, best half-day experience anywhere.", link: "iceland.html" },
  adventure_high: { pick: "Iceland", why: "Ring Road at any budget. Volcanic landscapes, waterfalls, Westman Islands.", alt: "Peru / Machu Picchu", altWhy: "Salkantay Trek, Rainbow Mountain — Brady's doing it May 2026.", link: "iceland.html" },
  adventure_flex: { pick: "Iceland", why: "Ring Road at any budget. Volcanic landscapes, waterfalls, Westman Islands.", alt: "Peru / Machu Picchu", altWhy: "Salkantay Trek, Rainbow Mountain — Brady's doing it May 2026.", link: "iceland.html" },
  food_low: { pick: "Dublin + Galway", why: "Pub food plus Galway seafood. McDonagh's, oyster market, 35+ pubs.", alt: "Poland August", altWhy: "Pierogi, zurek, Krakow Kazimierz food scene.", link: "/dublin" },
  food_mid: { pick: "Barcelona + Madrid", why: "100+ spots, tapas culture, two study abroads of knowledge. Boqueria, pintxos, churros.", alt: "Rome + Italy", altWhy: "Trastevere trattorias, cacio e pepe, one-euro espresso.", link: "spain.html" },
  food_high: { pick: "Rome + Italy Extended", why: "Trastevere deep dive. Tonnarello, Bar San Calisto. Extend to Amalfi for seafood.", alt: "Barcelona + Madrid", altWhy: "Switch to Spain's variety if Italian food fatigue is possible.", link: "italy.html" },
  food_flex: { pick: "Rome + Italy Extended", why: "Trastevere deep dive. Tonnarello, Bar San Calisto. Extend to Amalfi for seafood.", alt: "Barcelona + Madrid", altWhy: "Switch to Spain's variety if Italian food fatigue is possible.", link: "italy.html" },
  mix_low: { pick: "Poland August", why: "Best value. Krakow nightlife, Auschwitz, Gdansk beaches, Warsaw old town. LOT direct from ORD.", alt: "Dublin + Galway", altWhy: "Pubs, castles, cliffs — balanced under $2K.", link: "poland.html" },
  mix_mid: { pick: "Barcelona + Madrid", why: "Most validated mix. Two study abroads, 100+ spots, nightlife, Sagrada, Montserrat, tapas, beaches.", alt: "Rome + Italy", altWhy: "Swap beaches for history, keep nightlife and food.", link: "spain.html" },
  mix_high: { pick: "Multi-City Europe", why: "Open-jaw routing. Combine Barcelona + Rome, Dublin + Iceland, Prague + Munich. Two trips in one.", alt: "Australia + NZ", altWhy: "2+ weeks? Sydney has 123 spots. Add Tasmania and NZ.", link: "#" },
  mix_flex: { pick: "Multi-City Europe", why: "Open-jaw routing. Combine Barcelona + Rome, Dublin + Iceland, Prague + Munich. Two trips in one.", alt: "Australia + NZ", altWhy: "2+ weeks? Sydney has 123 spots. Add Tasmania and NZ.", link: "#" },
};

const DEST_IMAGES = {
  'Dublin + Galway': IMAGES.cliffs,
  'Rome + Italy': IMAGES.colosseum,
  'Barcelona + Madrid': IMAGES.sagrada,
  'Australia + NZ': IMAGES.opera,
  'Iceland': IMAGES.iceland,
  'Prague + Vienna + Dresden': IMAGES.stvitus,
  'Munich Oktoberfest': BATCH3_IMAGES.munichMarienplatz,
  'Poland August': NEW_IMAGES.pragueSkyline,
  'Thailand NYE': NEW_IMAGES.fitzroyBeach,
  'Rome + Italy Extended': IMAGES.colosseum,
  'Multi-City Europe': NEW_IMAGES.sagradaSunset,
  'Costa Rica': IMAGES.costaRicaViewpoint,
  'Smoky Mountains': BATCH3_IMAGES.smokyRockOverlook,
  'Peru / Machu Picchu': HERO_IMAGES.hiking_7103980642848666692,
};

export default function SystemSection({ onQuizComplete }) {
  // Quiz state
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [counterValues, setCounterValues] = useState({});
  const [transitionDir, setTransitionDir] = useState('next');

  const computeResult = (answers) => {
    const priorities = answers.priorities?.values || [];
    let quizVibe = 'mix';
    if (priorities.includes('nightlife')) quizVibe = 'nightlife';
    else if (priorities.includes('culture')) quizVibe = 'culture';
    else if (priorities.includes('adventure')) quizVibe = 'adventure';
    else if (priorities.includes('food')) quizVibe = 'food';
    const budget = answers.budget?.value || 'flex';
    const key = `${quizVibe}_${budget}`;
    const rec = QUIZ_RECS[key] || QUIZ_RECS['mix_mid'];
    setQuizResult(rec);
  };

  return (
    <div className="sys-root">
      {/* SUB-SECTION 1: Intro + Process (light) */}
      <section className="sys-section-light">
        <div className="sys-inner">
          <Reveal>
            <div className="sys-label">THE SYSTEM</div>
            <h2 className="sys-title-light">How It Actually Works</h2>
            <p className="sys-desc-light">650+ spots. Cost models built by a data scientist. Nothing we haven't done ourselves.</p>
          </Reveal>

          {/* Process Pipeline */}
          <div className="sys-process">
            {PROCESS_STEPS.map((step, i) => (
              <Reveal key={i} delay={i * 100} type="scale">
                <div className="sys-step">
                  <div className="sys-step-num">{step.num}</div>
                  <div className="sys-step-content">
                    <div className="sys-step-title">{step.title}</div>
                    <div className="sys-step-desc">{step.desc}</div>
                  </div>
                  {i < PROCESS_STEPS.length - 1 && <div className="sys-step-connector" />}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SUB-SECTION 2: Travel Windows (self-contained dark) */}
      <TravelWindows />

      {/* SUB-SECTION 3: Flight Intelligence (light) */}
      <section className="sys-section-light-2">
        <div className="sys-inner">
          {/* Typographic moment */}
          <div className="sys-fi-hero">
            <Reveal type="fade">
              <p className="sys-fi-stat">90% of AI travel itineraries contain factual errors.</p>
              <p className="sys-fi-counter">We don't guess.</p>
            </Reveal>
          </div>

          {/* Strategy label */}
          <Reveal>
            <div className="sys-label" style={{marginTop:60}}>FLIGHT INTELLIGENCE</div>
            <h3 className="sys-subtitle-light">How We Actually Find Cheap Flights</h3>
          </Reveal>

          {/* Strategy cards — 2 column masonry */}
          <div className="sys-fi-grid">
            {FLIGHT_STRATEGIES.map((card, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className="sys-fi-card">
                  <div className="sys-fi-card-num">{card.num}</div>
                  <h4 className="sys-fi-card-title">{card.title}</h4>
                  <p className="sys-fi-card-desc">{card.desc}</p>
                  {card.table && (
                    <table className="sys-fi-table">
                      <thead><tr>{card.table.headers.map((h,j) => <th key={j}>{h}</th>)}</tr></thead>
                      <tbody>{card.table.rows.map((row,j) => <tr key={j}>{row.map((cell,k) => <td key={k} className={k === 3 ? 'sys-fi-table-gold' : ''}>{cell}</td>)}</tr>)}</tbody>
                    </table>
                  )}
                </div>
              </Reveal>
            ))}
          </div>

          {/* Myths */}
          <Reveal>
            <h3 className="sys-subtitle-light" style={{marginTop:60}}>Myths We Bust</h3>
          </Reveal>
          <div className="sys-myth-grid">
            {FLIGHT_MYTHS.map((m, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="sys-myth-card">
                  <div className="sys-myth-label">MYTH</div>
                  <p className="sys-myth-text">{m.myth}</p>
                  <p className="sys-myth-reality">{m.reality}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Strip */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:4,overflow:'hidden'}}>
        {[NEW_IMAGES.rockArchPNW, BATCH3_IMAGES.europeanWaterfall, NEW_IMAGES.schonbrunnWalk, HERO_IMAGES.konaBrewingVwBusHawaii].map((src,i) => (
          <div key={i} style={{overflow:'hidden',height:220}}>
            <img src={src} alt="" style={{width:'100%',height:'100%',objectFit:'cover',transition:'transform 0.5s ease'}}
              onMouseEnter={e => e.target.style.transform='scale(1.04)'}
              onMouseLeave={e => e.target.style.transform='scale(1)'} />
          </div>
        ))}
      </div>

      {/* SUB-SECTION 4: Database Viz (dark) */}
      <div className="sys-gradient-light-to-dark" />
      <section className="sys-section-dark">
        <div className="sys-inner" style={{textAlign:'center'}}>
          <Reveal type="fade">
            <div className="sys-label-copper">THE DATABASE</div>
            <h2 className="sys-title-dark" style={{fontSize:'clamp(2rem,5vw,3.6rem)'}}>650+ Spots. 20+ Cities.</h2>
            <p className="sys-subtitle-dark">Every one walked into, sat down at, or stumbled out of.</p>
          </Reveal>
          <Suspense fallback={<div style={{height:'60vh',display:'flex',alignItems:'center',justifyContent:'center'}}><span style={{fontFamily:'var(--mono)',fontSize:12,color:'var(--muted)',letterSpacing:2}}>LOADING GLOBE...</span></div>}>
            <Globe />
          </Suspense>
        </div>
      </section>
      <div className="sys-gradient-dark-to-light" />

      {/* SUB-SECTION 5: What You Get (light) */}
      <section className="sys-section-light">
        <div className="sys-inner">
          <Reveal>
            <div className="sys-label">WHAT YOU GET</div>
            <h2 className="sys-title-light">What You Get</h2>
            <p className="sys-desc-light">All five. Every time. No tiers.</p>
          </Reveal>
          <div className="sys-del-scroll">
            {DELIVERABLES.map((d, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="sys-del-card">
                  <div className="sys-del-included">INCLUDED FREE</div>
                  <h4 className="sys-del-title">{d.title}</h4>
                  <p className="sys-del-desc">{d.desc}</p>
                  <div className="sys-del-preview">
                    {d.preview === 'framework' && (
                      <div className="sys-del-mock">
                        <div className="sys-del-mock-line" style={{width:'80%'}} />
                        <div className="sys-del-mock-line" style={{width:'60%'}} />
                        <div className="sys-del-mock-line" style={{width:'70%'}} />
                        <div className="sys-del-mock-dots"><span /><span /><span /><span /></div>
                      </div>
                    )}
                    {d.preview === 'flights' && (
                      <div className="sys-del-mini-table">
                        <div className="sys-del-mini-row"><span>Dublin</span><span style={{color:'var(--gold)'}}>Save $200</span></div>
                        <div className="sys-del-mini-row"><span>Rome</span><span style={{color:'var(--gold)'}}>Save $150</span></div>
                        <div className="sys-del-mini-row"><span>Warsaw</span><span style={{color:'var(--gold)'}}>Save $250</span></div>
                      </div>
                    )}
                    {d.preview === 'maps' && (
                      <div className="sys-del-maps-grid">
                        {['Dublin Pubs','Rome Food','Barcelona Bars','Galway','Prague','Vienna','Dresden','Vancouver','Seattle'].map(m => (
                          <div key={m} className="sys-del-map-pin"><span style={{color:'var(--gold)'}}>&#9679;</span> {m}</div>
                        ))}
                      </div>
                    )}
                    {d.preview === 'money' && (
                      <div className="sys-del-money">
                        <div className="sys-del-money-row">
                          <span style={{textDecoration:'line-through',color:'var(--muted)'}}>$4,200</span>
                          <span style={{color:'var(--gold)',fontFamily:'var(--display)',fontSize:28,fontWeight:700}}>$2,800</span>
                        </div>
                        <div style={{fontSize:12,color:'var(--muted)',marginTop:4}}>Average savings per person</div>
                      </div>
                    )}
                    {d.preview === 'quiz' && (
                      <div style={{textAlign:'center',padding:'16px 0'}}>
                        <span style={{color:'var(--gold)',fontFamily:'var(--mono)',fontSize:13,letterSpacing:1}}>TAKE THE QUIZ BELOW ↓</span>
                      </div>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SUB-SECTION 6: Quiz (dark surface) */}
      <div className="sys-gradient-light-to-surface" />
      <section className="sys-section-surface" id="quiz">
        <div className="sys-inner">
          <Reveal type="fade">
            <div style={{textAlign:'center',marginBottom:48}}>
              <div className="sys-label">FIND YOUR TRIP</div>
              <h2 className="sys-title-dark">Not Sure Where to Go?</h2>
              <p className="sys-subtitle-dark" style={{fontStyle:'normal',color:'var(--cream2)'}}>Seven questions. We'll tell you.</p>
            </div>
          </Reveal>

          {!quizStarted && !quizResult && (
            <div style={{textAlign:'center'}}>
              <button className="sys-quiz-start" onClick={() => setQuizStarted(true)}>Start the Quiz</button>
            </div>
          )}

          {quizStarted && !quizResult && (
            <div className="sys-quiz-container">
              <div className="sys-quiz-progress">
                <div className="sys-quiz-progress-fill" style={{width: `${((quizStep + 1) / QUIZ_QUESTIONS.length) * 100}%`}} />
              </div>
              {QUIZ_QUESTIONS.map((q, qi) => (
                <div key={q.id} className="sys-quiz-question" style={{display: qi === quizStep ? 'block' : 'none'}}>
                  <h3 className="sys-quiz-q-text">{q.question}</h3>
                  {q.subtitle && <p className="sys-quiz-q-sub">{q.subtitle}</p>}

                  {q.type === 'choice' && (
                    <div className="sys-quiz-options">
                      {q.options.map(opt => {
                        const isSelected = quizAnswers[q.id]?.value === opt.value;
                        return (
                          <div key={opt.value}>
                            <button className={`sys-quiz-option ${isSelected ? 'selected' : ''}`}
                              onClick={() => {
                                const na = {...quizAnswers, [q.id]: {value: opt.value}};
                                setQuizAnswers(na);
                                if (!opt.hasInput && !opt.hasSubOptions && !opt.hasCounter) {
                                  setTimeout(() => { if (quizStep < QUIZ_QUESTIONS.length - 1) setQuizStep(quizStep + 1); else computeResult(na); }, 300);
                                }
                              }}>{opt.label}</button>
                            {isSelected && opt.hasSubOptions && (
                              <div className="sys-quiz-sub-options">
                                {opt.subOptions.map(sub => (
                                  <button key={sub} className={`sys-quiz-sub ${quizAnswers[q.id]?.sub === sub ? 'selected' : ''}`}
                                    onClick={() => { const na = {...quizAnswers, [q.id]: {value: opt.value, sub}}; setQuizAnswers(na); setTimeout(() => { if (quizStep < QUIZ_QUESTIONS.length - 1) setQuizStep(quizStep + 1); else computeResult(na); }, 300); }}>{sub}</button>
                                ))}
                              </div>
                            )}
                            {isSelected && opt.hasInput && (
                              <div className="sys-quiz-input-wrap">
                                <input className="sys-quiz-input" placeholder={opt.inputPlaceholder} value={quizAnswers[q.id]?.input || ''}
                                  onChange={e => setQuizAnswers({...quizAnswers, [q.id]: {value: opt.value, input: e.target.value}})} autoFocus />
                              </div>
                            )}
                            {isSelected && opt.hasCounter && (
                              <div className="sys-quiz-counter">
                                <button className="sys-quiz-counter-btn" onClick={e => { e.stopPropagation(); const cur = quizAnswers[q.id]?.count || opt.min; if (cur > opt.min) setQuizAnswers({...quizAnswers, [q.id]: {value: opt.value, count: cur - 1}}); }}>−</button>
                                <span className="sys-quiz-counter-val">{quizAnswers[q.id]?.count || opt.min}</span>
                                <button className="sys-quiz-counter-btn" onClick={e => { e.stopPropagation(); const cur = quizAnswers[q.id]?.count || opt.min; if (cur < opt.max) setQuizAnswers({...quizAnswers, [q.id]: {value: opt.value, count: cur + 1}}); }}>+</button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {q.type === 'multi' && (
                    <div className="sys-quiz-options" style={{flexWrap:'wrap'}}>
                      {q.options.map(opt => {
                        const sels = quizAnswers[q.id]?.values || [];
                        const isSel = sels.includes(opt.value);
                        return (
                          <button key={opt.value} className={`sys-quiz-option ${isSel ? 'selected' : ''} ${q.id === 'avoid' ? 'teal' : ''}`}
                            onClick={() => {
                              let ns; if (isSel) ns = sels.filter(v => v !== opt.value); else if (sels.length < q.maxSelect) ns = [...sels, opt.value]; else return;
                              setQuizAnswers({...quizAnswers, [q.id]: {values: ns}});
                            }}>{opt.label}</button>
                        );
                      })}
                    </div>
                  )}

                  {q.type === 'text' && (
                    <input className="sys-quiz-input" placeholder={q.placeholder} value={quizAnswers[q.id]?.input || ''}
                      onChange={e => setQuizAnswers({...quizAnswers, [q.id]: {input: e.target.value}})} />
                  )}

                  <div className="sys-quiz-nav">
                    {quizStep > 0 && <button className="sys-quiz-back" onClick={() => setQuizStep(quizStep - 1)}>← Back</button>}
                    <div style={{flex:1}} />
                    {q.optional && <button className="sys-quiz-skip" onClick={() => { if (quizStep < QUIZ_QUESTIONS.length - 1) setQuizStep(quizStep + 1); else computeResult(quizAnswers); }}>Skip</button>}
                    {(q.type === 'multi' || q.type === 'text' || (q.type === 'choice' && quizAnswers[q.id]?.value && (q.options.find(o => o.value === quizAnswers[q.id]?.value)?.hasInput || q.options.find(o => o.value === quizAnswers[q.id]?.value)?.hasCounter))) && (
                      <button className="sys-quiz-next" onClick={() => { if (quizStep < QUIZ_QUESTIONS.length - 1) setQuizStep(quizStep + 1); else computeResult(quizAnswers); }}>
                        {quizStep === QUIZ_QUESTIONS.length - 1 ? 'See My Match' : 'Next →'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {quizResult && (
            <Reveal type="scale">
              <div className="sys-quiz-result">
                <div className="sys-quiz-result-bg">
                  {DEST_IMAGES[quizResult.pick] && <img src={DEST_IMAGES[quizResult.pick]} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}} />}
                </div>
                <div className="sys-quiz-result-overlay" />
                <div className="sys-quiz-result-content">
                  <div className="sys-quiz-result-label">YOUR MATCH</div>
                  <h3 className="sys-quiz-result-dest">{quizResult.pick}</h3>
                  <p className="sys-quiz-result-why">{quizResult.why}</p>
                  {quizResult.alt && <p className="sys-quiz-result-alt">Also consider: <strong>{quizResult.alt}</strong> — {quizResult.altWhy}</p>}
                  <div className="sys-quiz-result-actions">
                    <button className="sys-quiz-cta-gold"
                      onClick={() => {
                        if (onQuizComplete) {
                          onQuizComplete({
                            destination: quizResult.pick,
                            timing: quizAnswers.timing?.input || quizAnswers.timing?.sub || quizAnswers.timing?.value || '',
                            group: quizAnswers.group?.count ? `${quizAnswers.group.value} (${quizAnswers.group.count})` : quizAnswers.group?.value || '',
                            budget: quizAnswers.budget?.value || '',
                            styles: quizAnswers.priorities?.values || [],
                          });
                        }
                      }}>Start Planning This Trip →</button>
                    <button className="sys-quiz-cta-ghost">Book a Call Instead →</button>
                  </div>
                  <button className="sys-quiz-reset" onClick={() => { setQuizStep(0); setQuizAnswers({}); setQuizResult(null); setQuizStarted(false); }}>Start Over</button>
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </section>

    </div>
  );
}
