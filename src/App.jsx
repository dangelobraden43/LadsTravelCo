import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { IMAGES } from './images';
import { NEW_IMAGES } from './images-new';
import { BATCH3_IMAGES } from './images-batch3';
import { HERO_IMAGES } from './images-hero';
import { BATCH4_IMAGES } from './images-batch4';
import { HEIC_HERO_IMAGES } from './images-heic-hero';
import { HEIC_CARD_IMAGES } from './images-heic-card';
const Globe = lazy(() => import('./Globe'));
import SystemSection from './SystemSection';
import './SystemSection.css';
import NorthAmericaSection from './NorthAmericaSection';
import './NorthAmericaSection.css';
import LadsSection from './LadsSection';
import './LadsSection.css';
import PhotoGallery from './PhotoGallery';
import './PhotoGallery.css';
import GivingBackFooter from './GivingBackFooter';
import './GivingBackFooter.css';

/* ===== INTERSECTION OBSERVER HOOK ===== */
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

function Reveal({ children, className = 'reveal', style = {}, delay = 0, type = 'up' }) {
  const ref = useReveal();
  const typeClass = type === 'up' ? 'reveal' : type === 'fade' ? 'reveal-fade' : type === 'scale' ? 'reveal-scale' : type === 'left' ? 'reveal-left' : 'reveal';
  const s = delay ? { ...style, transitionDelay: `${delay}ms` } : style;
  return <div ref={ref} className={typeClass} style={s}>{children}</div>;
}

/* ===== COUNT-UP HOOK ===== */
function useCountUp(target, duration = 1500) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started) {
        setStarted(true);
        obs.unobserve(el);
      }
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

/* ===== SVG ICONS ===== */
function IconPin() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>; }
function IconGlobe() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>; }
function IconPlane() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>; }
function IconChevron() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>; }

/* ===== DESTINATION DATA ===== */
const DESTINATIONS = [
  {
    name: "Dublin + Galway", img: "cliffs", accent: "#2a6b3a",
    route: "DUBLIN \u2192 KILKENNY \u2192 GALWAY \u2192 CLIFFS OF MOHER",
    badge: "Both Lads \u2014 Personally Validated",
    stats: [{n:"35+",l:"Pubs we drank in across Dublin & Galway"},{n:"3",l:"Versions: Christmas, St. Pat's, or summer"},{n:"45+",l:"Spots mapped \u2014 pubs, restaurants, sights"},{n:"3",l:"Day trips we personally took"}],
    desc: "Christmas markets, St. Patrick\u2019s Day, or summer \u2014 three completely different trips from the same two cities. Every pub rated, every attraction mapped, every day trip personally taken.",
    link: "/dublin",
    maps: [{t:"Pubs & Food",u:"https://maps.app.goo.gl/NrZtg6tUR1Rjk8oS8"},{t:"Attractions",u:"https://maps.app.goo.gl/9YLakDkjrE6jj7cQA"},{t:"Galway",u:"https://maps.app.goo.gl/deRD11SQis6ZUsKL8"}],
    trips: [{t:"Cliffs of Moher + Burren",d:"Full day from Galway. Brady rated 9/10.",u:"https://www.viator.com/tours/Galway/Cliffs-of-Moher-and-Burren-Day-Trip-Including-Dunguaire-Castle-Aillwee-Cave-and-Doolin-from-Galway/d5156-8625P1"},{t:"Wicklow + Glendalough + Kilkenny",d:"Full day from Dublin. Medieval castle, monastic ruins, mountains.",u:"https://gyg.me/V0UrxNUe"}]
  },
  {
    name: "Rome + Italy", img: "colosseum", accent: "#bc6c25",
    route: "ROME \u2192 VATICAN \u2192 TRASTEVERE \u2192 POMPEII \u2192 AMALFI COAST",
    badge: "Both Lads \u2014 Personally Validated",
    stats: [{n:"11/10",l:"How we rated Pompeii \u2014 not optional"},{n:"43",l:"Restaurants, bars & hidden spots we found"},{n:"2025",l:"Jubilee Year \u2014 Vatican holy doors open"},{n:"2",l:"Day trips: Pompeii + Amalfi Coast"}],
    desc: "Five days during the Jubilee Year. \u20AC1 beers at Bar San Calisto, cacio e pepe at Tonnarello, the Vatican with holy doors open. The framework includes Trastevere nightlife routing, restaurant tiers, and a full Pompeii day trip plan.",
    link: "/rome",
    maps: [{t:"Food & Drink",u:"https://maps.app.goo.gl/kmFjNeA6k8BHuHWT8"},{t:"Attractions",u:"https://maps.app.goo.gl/RAS5mqRhc6BYTa5D6"}],
    trips: [{t:"Pompeii + Amalfi + Sorrento",d:"Full day from Rome. Pompeii is non-negotiable \u2014 11/10.",u:"https://gyg.me/c6cN0bz2"}]
  },
  {
    name: "Barcelona + Madrid", img: "sagrada", accent: "#8a3040",
    route: "BARCELONA \u2192 MONTSERRAT \u2192 GIRONA \u2192 SITGES \u2192 MADRID",
    badge: "Both Lads \u2014 Personally Validated",
    stats: [{n:"100+",l:"Bars, restaurants & spots across both cities"},{n:"3",l:"Versions: groups of 2, 4, or 8"},{n:"2",l:"Study abroads between us \u2014 Brady + Dawson"},{n:"3",l:"Day trips: Montserrat, Girona, Sitges"}],
    desc: "The most validated two-city framework. Brady\u2019s Barcelona study abroad meets Dawson\u2019s Madrid. Three versions for groups of 2, 4, or 8 \u2014 each with its own accommodation strategy and cost model.",
    link: "/spain",
    maps: [{t:"Food",u:"https://maps.app.goo.gl/bZp95gDP9VwBe6Kd7"},{t:"Bars",u:"https://maps.app.goo.gl/2LZGLZQEuT53NK3Z8"},{t:"Attractions",u:"https://maps.app.goo.gl/63o5dgY5Fr8SJUZk6"}],
    trips: [{t:"Montserrat + Girona + Sitges",d:"Full day from Barcelona. Mountain monastery, medieval town, coastal village.",u:"https://www.viator.com/tours/Barcelona/From-Barcelona-Montserrat-Girona-and-Sitges-Full-Day-Tour/d562-6874P164"}]
  },
  {
    name: "Australia + NZ", img: "opera", accent: "#c26e52",
    route: "SYDNEY \u2192 BONDI \u2192 BLUE MOUNTAINS \u2192 TASMANIA \u2192 SOUTH ISLAND NZ",
    badge: "Brady \u2014 Personally Validated",
    stats: [{n:"6",l:"Weeks actually living in Sydney"},{n:"123",l:"Spots \u2014 surf camps, rock pools, hidden bars"},{n:"4",l:"Days exploring Tasmania\u2019s wilderness"},{n:"1",l:"Banh mi in Marrickville that changed us"}],
    desc: "The deepest single-city knowledge base in the portfolio. Surf camps, rock pools, Vivid Sydney light shows, and the best banh mi in Marrickville. Six weeks of actually living there \u2014 not visiting.",
    link: "/australia",
    maps: [],
    trips: []
  },
  {
    name: "Iceland", img: "iceland", accent: "#6a8ea8",
    route: "REYKJAVIK \u2192 GOLDEN CIRCLE \u2192 RING ROAD \u2192 WESTMAN ISLANDS",
    badge: "Dawson \u2014 Personally Validated",
    stats: [{n:"10",l:"Days driving the full Ring Road"},{n:"4",l:"Versions: summer/winter, short/long"},{n:"2",l:"Seasons \u2014 Northern Lights or Midnight Sun"},{n:"1",l:"Lad who drove every single kilometer"}],
    desc: "Full Ring Road. Four versions: summer or winter, short or long. Northern Lights, Midnight Sun, volcanic landscapes. Dawson drove every kilometer.",
    link: "/iceland",
    maps: [],
    trips: []
  },
  {
    name: "Prague + Vienna + Dresden", img: "stvitus", accent: "#7a6a4a",
    route: "VIENNA \u2192 PRAGUE \u2192 PILSEN \u2192 DRESDEN",
    badge: "Brady \u2014 Personally Validated",
    stats: [{n:"75+",l:"Bars, breweries & spots across 3 cities"},{n:"4",l:"Google Maps lists \u2014 use them on the ground"},{n:"3",l:"Countries: Austria, Czechia, Germany"},{n:"10",l:"Day itinerary \u2014 every hour planned"}],
    desc: "Pilsner Urquell brewery. Sch\u00F6nbrunn Palace. St. Vitus Cathedral. Best value city in Europe meets Habsburg grandeur. Three countries, one framework.",
    link: "/prague",
    maps: [{t:"Prague Attractions",u:"https://maps.app.goo.gl/e3pGDSj6PCcPEy8j7"},{t:"Prague Bars",u:"https://maps.app.goo.gl/o7BCdPPpzPHJsEA59"},{t:"Vienna",u:"https://maps.app.goo.gl/R4TC9toa9oP5qJed8"},{t:"Dresden",u:"https://maps.app.goo.gl/FYEJQFkTJVyqZr1x7"}],
    trips: [{t:"Pilsner Urquell Brewery",d:"Day trip from Prague. The original pilsner, underground cellars.",u:"https://prazdrojvisit.cz"}]
  }
];

const BUCKET_LIST = [
  {name:"Peru / Machu Picchu",route:"LIMA \u2192 CUSCO \u2192 SALKANTAY TREK \u2192 MACHU PICCHU",status:"departing",meta:"Salkantay Trek \u2014 5 days to Machu Picchu",desc:"Brady\u2019s departing May 2026 for the Salkantay Trek. Five days through the Andes to Machu Picchu. The first case study \u2014 built from firsthand experience, not research."},
  {name:"Munich Oktoberfest",route:"CHICAGO \u2192 MUNICH \u2192 SALZBURG",status:"ready",meta:"4\u201310 ppl \u00B7 5\u20138 days \u00B7 Sept 2026",link:"/munich",desc:"Skip the tourist tents. We know which beer hall to hit, where to stay in Glockenbachviertel, and exactly what it costs for groups of 4\u201310."},
  {name:"Poland August",route:"CHICAGO \u2192 KRAKOW \u2192 WARSAW \u2192 GDA\u0143SK",status:"ready",meta:"4\u20138 ppl \u00B7 6\u201310 days \u00B7 Aug 2026",link:"/poland",desc:"LOT flies non-stop from Chicago. Krakow\u2019s nightlife, Auschwitz, Gda\u0144sk beaches \u2014 best value trip in Europe and it\u2019s not close."},
  {name:"Thailand NYE",route:"BANGKOK \u2192 KOH PHANGAN \u2192 KRABI",status:"ready",meta:"4\u20138 ppl \u00B7 10\u201316 days \u00B7 Dec\u2013Jan",link:"/thailand",desc:"Ring in the new year at a Full Moon Party, then island-hop to Krabi. Cathay Pacific routing via Hong Kong. Every logistics headache already solved."},
  {name:"Tour du Mont Blanc",route:"CHAMONIX \u2192 COURMAYEUR \u2192 SWITZERLAND",status:"building",meta:"2\u20136 ppl \u00B7 7\u201311 days \u00B7 Jul\u2013Sep",desc:"Hut-to-hut across the Alps through France, Italy, and Switzerland. The trek that belongs on every adventure traveler\u2019s list."},
  {name:"Pilsenfest + Prague",route:"PRAGUE \u2192 PILSEN \u2192 CZECH COUNTRYSIDE",status:"building",meta:"2\u20138 ppl \u00B7 4\u20137 days \u00B7 Oct annual",desc:"Brady drank Pilsner Urquell in the underground cellars where it was invented. This trip wraps that brewery experience around a Czech beer festival."},
  {name:"Camp Nou Reopening",route:"BARCELONA \u2192 CAMP NOU \u2192 MONTSERRAT",status:"building",meta:"2\u20138 ppl \u00B7 5\u20138 days \u00B7 2025\u201326",desc:"Watch a match in the largest stadium in Europe the year it reopens \u2014 with 100+ validated Barcelona spots around it."},
  {name:"Ryder Cup 2027",route:"DUBLIN \u2192 ADARE MANOR \u2192 GALWAY",status:"building",meta:"2\u20138 ppl \u00B7 7\u201310 days \u00B7 Sep 2027",desc:"Golf trip of a lifetime at Adare Manor, wrapped inside the Ireland framework we\u2019ve already validated. 45+ spots, 35+ pubs, every day trip mapped."}
];

const DB_SPOTS = [
  {city:"Sydney",n:123},{city:"Barcelona",n:115},{city:"Rome",n:43},{city:"Dublin",n:39},{city:"Prague",n:38},
  {city:"Vienna",n:37},{city:"Costa Rica",n:28},{city:"Tasmania",n:27},{city:"Vancouver",n:22},{city:"Galway",n:15}
];

const DOMESTIC = [
  {name:"Jaco, Costa Rica",meta:"Both Lads \u00B7 28 Spots",desc:"Beach Airbnb, surf lessons, and an ATV tour to a hidden waterfall that we\u2019d rank as our single best half-day experience anywhere we\u2019ve traveled.",img:"costaRicaViewpoint",links:[{t:"Book ATV Tour",u:"https://gyg.me/0vVQ5scX"},{t:"Google Maps",u:"https://maps.app.goo.gl/hc199wu19C6cKj9G6"}]},
  {name:"San Juan",meta:"Brady \u00B7 14 Spots",desc:"No passport needed. Old San Juan is walkable, the mofongo is real, and the nightlife on Calle de la Fortaleza runs until 3am.",img:"oahu_IMG_5001",imgSrc:"hero",links:[{t:"Google Maps",u:"https://maps.app.goo.gl/ZWM8LXFGV9QpS8fB7"}]},
  {name:"Vancouver",meta:"Brady \u00B7 22 Spots",desc:"Stanley Park, Granville Island, and sushi that rivals Tokyo. 22 spots mapped across the best food city in the Pacific Northwest.",img:"vancouver",links:[{t:"Bars & Food",u:"https://maps.app.goo.gl/9n9uM7NG8Sa2aA8"},{t:"Things to Do",u:"https://maps.app.goo.gl/4moCgAkEHz5uJbQ9A"}]},
  {name:"Seattle + Olympic",meta:"Brady \u00B7 14 Spots",desc:"Pike Place for the morning, Capitol Hill bars at night, and a day trip to Olympic National Park that makes the whole trip worth it.",img:"hohRainforest",links:[{t:"Google Maps",u:"https://maps.app.goo.gl/Fr7KdvoLsnXeBV1q8"}]},
  {name:"Phoenix + Golf",meta:"Brady \u00B7 7 Spots",desc:"The golf trip. Shoulder season pricing in late spring or early fall cuts costs 40% and the weather\u2019s still perfect.",img:"phoenix_IMG_2651",imgSrc:"hero",links:[{t:"Google Maps",u:"https://maps.app.goo.gl/PTJn6coPBcRDKbHw5"}]},
  {name:"Smoky Mountains",meta:"Brady \u00B7 8 Spots",desc:"Cabin on the quiet side, away from Gatlinburg crowds. Go in October for fall colors that make you forget you\u2019re three hours from Nashville.",img:"smokyRockOverlook",links:[]},
  {name:"Las Vegas",meta:"Both Lads",desc:"Best as 3\u20134 nights. Skip the strip restaurants \u2014 the off-strip food scene is where the real value hides.",img:"best_IMG_9695",imgSrc:"hero",links:[]},
  {name:"Charleston",meta:"Brady",desc:"Best food city in the South, and it\u2019s not close. King Street for cocktails, Sullivan\u2019s Island for the beach day, Husk for the dinner that sells the trip.",img:"best_100_0110",imgSrc:"hero",links:[{t:"One-Pager",u:"/charleston"}]}
];

/* ===== VIBE DATA ===== */
const VIBES = [
  {
    id: 'send-it', label: 'Send It',
    tagline: 'Group adventure, nightlife, festivals',
    icon: '\u26A1',
    destinations: ['Dublin + Galway', 'Barcelona + Madrid'],
    bucketList: ['Munich Oktoberfest', 'Poland August', 'Thailand NYE'],
    domestic: ['Las Vegas'],
    quizVibe: 'nightlife',
    color: '#c9a84c'
  },
  {
    id: 'take-it-in', label: 'Take It All In',
    tagline: 'History, architecture, cultural depth',
    icon: '\uD83C\uDFDB\uFE0F',
    destinations: ['Prague + Vienna + Dresden', 'Rome + Italy', 'Barcelona + Madrid'],
    bucketList: ['Pilsenfest + Prague', 'Camp Nou Reopening'],
    domestic: [],
    quizVibe: 'culture',
    color: '#b8886e'
  },
  {
    id: 'unplug', label: 'Unplug',
    tagline: 'Beaches, relaxation, disconnect',
    icon: '\uD83C\uDF34',
    destinations: ['Australia + NZ'],
    bucketList: ['Thailand NYE'],
    domestic: ['Jaco, Costa Rica', 'Smoky Mountains', 'Charleston'],
    quizVibe: 'mix',
    color: '#5a9aad'
  },
  {
    id: 'push-limits', label: 'Push Your Limits',
    tagline: 'Trekking, altitude, endurance',
    icon: '\u26F0\uFE0F',
    destinations: ['Iceland'],
    bucketList: ['Tour du Mont Blanc'],
    domestic: ['Jaco, Costa Rica', 'Seattle + Olympic', 'Smoky Mountains'],
    quizVibe: 'adventure',
    color: '#7aaa6e'
  },
  {
    id: 'show-everything', label: 'Show Them Everything',
    tagline: 'Family travel, variety, a bit of it all',
    icon: '\uD83C\uDF0D',
    destinations: ['Australia + NZ', 'Dublin + Galway', 'Barcelona + Madrid'],
    bucketList: ['Ryder Cup 2027'],
    domestic: ['Vancouver', 'San Juan'],
    quizVibe: 'mix',
    color: '#c26e52'
  },
  {
    id: 'just-us', label: 'Just Us',
    tagline: 'Romantic, couples, intimate',
    icon: '\u2728',
    destinations: ['Rome + Italy', 'Iceland', 'Prague + Vienna + Dresden'],
    bucketList: [],
    domestic: ['Charleston', 'Smoky Mountains', 'Vancouver'],
    quizVibe: 'food',
    color: '#c9a84c'
  }
];

/* ===== QUIZ RECS ===== */
const QUIZ_RECS = {
  nightlife_low: { pick: "Dublin + Galway", why: "Cheapest validated nightlife city in our portfolio. 35+ pubs documented, three timing versions, and flights from ORD under $500 in shoulder season. Temple Bar is overpriced but the spots we send you to aren't.", alt: "Poland August", altWhy: "Krakow's nightlife district is world-class and even cheaper.", link: "/dublin" },
  nightlife_mid: { pick: "Munich Oktoberfest", why: "Event-driven nightlife at its peak. Augustiner-Brau tent strategy, Glockenbachviertel base, and a complete cost model for groups of 4-10. This is the one trip where the party IS the culture.", alt: "Barcelona + Madrid", altWhy: "100+ validated spots and Dawson's Madrid nightlife knowledge.", link: "/munich" },
  nightlife_high: { pick: "Thailand NYE", why: "Full Moon Party on Koh Phangan, rooftop bars in Bangkok, beach clubs in Krabi. Cathay Pacific via Hong Kong. This is the bucket-list nightlife trip \u2014 10 to 16 days of it.", alt: "Barcelona + Madrid", altWhy: "If Southeast Asia feels too far, Barcelona's nightlife runs until 6am.", link: "/thailand" },
  nightlife_flex: { pick: "Thailand NYE", why: "Full Moon Party on Koh Phangan, rooftop bars in Bangkok, beach clubs in Krabi. Cathay Pacific via Hong Kong. This is the bucket-list nightlife trip \u2014 10 to 16 days of it.", alt: "Barcelona + Madrid", altWhy: "If Southeast Asia feels too far, Barcelona's nightlife runs until 6am.", link: "/thailand" },
  culture_low: { pick: "Prague + Vienna + Dresden", why: "Best value culture cities in Europe. St. Vitus Cathedral, Schonbrunn Palace, Pilsner Urquell brewery, and the Dresden Hofkirche \u2014 all on a budget that makes Western Europe look embarrassing. 75+ spots across three cities.", alt: "Dublin + Galway", altWhy: "Literary pubs, medieval castles, and the Cliffs of Moher for under $2K.", link: "/prague" },
  culture_mid: { pick: "Rome + Italy", why: "Deepest validated culture framework in the portfolio. Vatican with Jubilee holy doors, Pompeii day trip rated 11/10, Trastevere neighborhood routing, and 43 validated spots. Five days minimum.", alt: "Barcelona + Madrid", altWhy: "Sagrada Familia, Montserrat monastery, and the Prado \u2014 different flavor, same depth.", link: "/rome" },
  culture_high: { pick: "Australia + NZ", why: "Six weeks of depth. Sydney Opera House, Aboriginal cultural experiences, Tasmania wilderness, and the South Island. This isn't a vacation \u2014 it's an education. 123 spots in the database.", alt: "Rome + Italy extended", altWhy: "Add Amalfi Coast and Florence for a 10-day Italian deep dive.", link: "/australia" },
  culture_flex: { pick: "Australia + NZ", why: "Six weeks of depth. Sydney Opera House, Aboriginal cultural experiences, Tasmania wilderness, and the South Island. This isn't a vacation \u2014 it's an education. 123 spots in the database.", alt: "Rome + Italy extended", altWhy: "Add Amalfi Coast and Florence for a 10-day Italian deep dive.", link: "/australia" },
  adventure_low: { pick: "Iceland", why: "Ring Road works at any budget. Dawson did it. Northern Lights or Midnight Sun depending on timing. Volcanic landscapes, waterfalls, and the Westman Islands. Four versions: summer or winter, short or long.", alt: "Smoky Mountains", altWhy: "Cabin on the quiet side, fall colors, minimal flight cost from the Midwest.", link: "/iceland" },
  adventure_mid: { pick: "Iceland", why: "Ring Road works at any budget. Dawson did it. Northern Lights or Midnight Sun depending on timing. Volcanic landscapes, waterfalls, and the Westman Islands. Four versions: summer or winter, short or long.", alt: "Costa Rica", altWhy: "ATV jungle tour, surf lessons, and a beach Airbnb \u2014 our best half-day experience anywhere.", link: "/iceland" },
  adventure_high: { pick: "Iceland", why: "Ring Road works at any budget. Dawson did it. Northern Lights or Midnight Sun depending on timing. Volcanic landscapes, waterfalls, and the Westman Islands. Four versions: summer or winter, short or long.", alt: "Peru / Machu Picchu", altWhy: "Salkantay Trek, Rainbow Mountain ATV, Huacachina sandboarding \u2014 Brady's doing it May 2026.", link: "/iceland" },
  adventure_flex: { pick: "Iceland", why: "Ring Road works at any budget. Dawson did it. Northern Lights or Midnight Sun depending on timing. Volcanic landscapes, waterfalls, and the Westman Islands. Four versions: summer or winter, short or long.", alt: "Peru / Machu Picchu", altWhy: "Salkantay Trek, Rainbow Mountain ATV, Huacachina sandboarding \u2014 Brady's doing it May 2026.", link: "/iceland" },
  food_low: { pick: "Dublin + Galway", why: "Pub food done right plus Galway's seafood scene. McDonagh's fish and chips, oysters at the Saturday market, and 35+ pubs where the Guinness actually tastes different. Affordable and validated.", alt: "Poland August", altWhy: "Pierogi, zurek, and Krakow's Kazimierz food scene for half the price of Western Europe.", link: "/dublin" },
  food_mid: { pick: "Barcelona + Madrid", why: "100+ validated spots and a tapas culture that makes every meal an event. Dawson's Madrid study abroad plus Brady's Barcelona \u2014 two food cities with completely different personalities. Boqueria market, pintxos bars, and late-night churros con chocolate.", alt: "Rome + Italy", altWhy: "Trastevere trattorias, cacio e pepe at Tonnarello, and one-euro espresso.", link: "/spain" },
  food_high: { pick: "Rome + Italy Extended", why: "Trastevere deep dive. Tonnarello, Bar San Calisto, and the kind of neighborhood restaurants that don't show up on TripAdvisor. Extend to Amalfi Coast for seafood and limoncello. This is the trip where you eat your way through history.", alt: "Barcelona + Madrid", altWhy: "If Italian food fatigue is even possible, switch to Spain's variety.", link: "/rome" },
  food_flex: { pick: "Rome + Italy Extended", why: "Trastevere deep dive. Tonnarello, Bar San Calisto, and the kind of neighborhood restaurants that don't show up on TripAdvisor. Extend to Amalfi Coast for seafood and limoncello. This is the trip where you eat your way through history.", alt: "Barcelona + Madrid", altWhy: "If Italian food fatigue is even possible, switch to Spain's variety.", link: "/rome" },
  mix_low: { pick: "Poland August", why: "Best all-around value in our portfolio. Krakow anchor with nightlife, Auschwitz for sobering culture, Gdansk beaches, Warsaw's rebuilt old town. LOT non-stop from ORD. Three duration versions for groups of 4-8.", alt: "Dublin + Galway", altWhy: "Pubs, castles, cliffs, and craic \u2014 hard to beat for a balanced trip under $2K.", link: "/poland" },
  mix_mid: { pick: "Barcelona + Madrid", why: "Most validated mix in the portfolio. Two study abroads, 100+ spots, nightlife until 6am, Sagrada Familia, Montserrat day trip, tapas culture, and beach days. Three group versions. This is the default recommendation for a reason.", alt: "Rome + Italy", altWhy: "Swap beaches for history and you still get nightlife and world-class food.", link: "/spain" },
  mix_high: { pick: "Multi-City Europe", why: "Open-jaw routing \u2014 fly into one city, out of another. Combine Barcelona + Rome, or Dublin + Iceland, or Prague + Munich. We build the flight strategy, the frameworks connect, and you get two trips in one. This is where our system shines.", alt: "Australia + NZ", altWhy: "If you have 2+ weeks, Sydney alone has 123 spots \u2014 add Tasmania and NZ for the full experience.", link: "#" },
  mix_flex: { pick: "Multi-City Europe", why: "Open-jaw routing \u2014 fly into one city, out of another. Combine Barcelona + Rome, or Dublin + Iceland, or Prague + Munich. We build the flight strategy, the frameworks connect, and you get two trips in one. This is where our system shines.", alt: "Australia + NZ", altWhy: "If you have 2+ weeks, Sydney alone has 123 spots \u2014 add Tasmania and NZ for the full experience.", link: "#" }
};

/* ===== BUCKET LIST IMAGE MAP ===== */
const BUCKET_IMAGES = {
  "Peru / Machu Picchu": HEIC_HERO_IMAGES.heicHiking_IMG_4195,
  "Munich Oktoberfest": BATCH3_IMAGES.munichMarienplatz,
  "Poland August": NEW_IMAGES.pragueSkyline,
  "Thailand NYE": NEW_IMAGES.fitzroyBeach,
  "Tour du Mont Blanc": HEIC_HERO_IMAGES.heicHiking_IMG_5304,
  "Pilsenfest + Prague": NEW_IMAGES.pilsnerUrquell,
  "Camp Nou Reopening": NEW_IMAGES.sagradaSunset,
  "Ryder Cup 2027": BATCH3_IMAGES.galwayChristmas,
};

/* ===== VIBE PHOTO MAP ===== */
const VIBE_PHOTOS = {
  'send-it': BATCH3_IMAGES.busBarNight,
  'take-it-in': HERO_IMAGES.sistineChapelCeilingRome,
  'unplug': NEW_IMAGES.fitzroyBeach,
  'push-limits': HERO_IMAGES.olympicDeerAboveClouds,
  'show-everything': HERO_IMAGES.schonbrunnPalaceGardensVienna,
  'just-us': HERO_IMAGES.best_IMG_0724,
};

/* ===== HERO IMAGES ===== */
const heroImages = [
  IMAGES.colosseum,
  IMAGES.opera,
  NEW_IMAGES.sagradaSunset,
  IMAGES.cliffs,
  NEW_IMAGES.fitzroyBeach,
  BATCH3_IMAGES.oahuSunset,
];

/* ===== PHOTO STRIP IMAGES ===== */
const photoStrip1 = [
  NEW_IMAGES.sagradaSunset,
  HERO_IMAGES.olympicDeerAboveClouds,
  NEW_IMAGES.colosseumInside,
  HERO_IMAGES.schonbrunnPalaceGardensVienna,
  BATCH3_IMAGES.oahuSunset,
];

const photoStrip2 = [
  BATCH3_IMAGES.hawaiiPillbox,
  HERO_IMAGES.mattTheMillersPubKilkenny,
  NEW_IMAGES.dresdenPalace,
  BATCH3_IMAGES.vividDroneHeart,
];

/* Additional photo strips for rhythm */
const photoStrip3 = [
  HERO_IMAGES.castelSantAngeloStPetersViewRome,
  NEW_IMAGES.bondiCoastal,
  BATCH3_IMAGES.rockPoolSwim,
];

/* Photo strip 4: quick rhythm between domestic and cinematic */
const photoStrip4 = [
  HEIC_HERO_IMAGES.heicBarcelona_IMG_6905,
  BATCH4_IMAGES.ireland_IMG_2287,
  HEIC_HERO_IMAGES.heicItaly_IMG_3525,
  BATCH4_IMAGES.prauge_IMG_0274,
  HEIC_HERO_IMAGES.heicAustralia_IMG_0994,
];

/* Photo strip 5: lingering trio between Lads and Giving Back */
const photoStrip5 = [
  HEIC_HERO_IMAGES.heicHiking_IMG_4312,
  BATCH4_IMAGES.oahu_IMG_5004,
  HEIC_HERO_IMAGES.heicIreland_IMG_2610,
];

const photoStripCinematic = HERO_IMAGES.olympicDeerAboveClouds;

/* ===== STAT PILL COMPONENT ===== */
function StatPill({ icon, target, label }) {
  const { ref, count } = useCountUp(target, 1500);
  return (
    <div ref={ref} className="hero-stat" style={{
      background: 'rgba(255,255,255,0.06)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 16,
      padding: '16px 24px',
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      minWidth: 160,
      flex: '1 1 160px',
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: '50%',
        background: 'rgba(201,168,76,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--gold)', flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 24, fontWeight: 700, color: '#fff', lineHeight: 1 }}>
          {count}{typeof target === 'string' && target.includes('+') ? '+' : ''}
        </div>
        <div style={{ fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--cream2)', marginTop: 4 }}>{label}</div>
      </div>
    </div>
  );
}

/* ===== PHOTO STRIP COMPONENT ===== */
function PhotoStrip({ images, height = 220, columns }) {
  const cols = columns || images.length;
  return (
    <div className="photo-strip-responsive" style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gap: 4,
      height,
      overflow: 'hidden',
      width: '100%',
    }}>
      {images.map((src, i) => (
        <div key={i} style={{
          overflow: 'hidden',
          position: 'relative',
        }}>
          <img
            src={src}
            alt=""
            loading="lazy"
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              transition: 'transform 0.4s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          />
        </div>
      ))}
    </div>
  );
}

/* ===== VIBE SELECTOR COMPONENT ===== */
function VibeSelector({ selectedVibe, setSelectedVibe }) {
  const destRef = useRef(null);

  const handleSelect = (vibeId) => {
    if (selectedVibe === vibeId) {
      setSelectedVibe(null);
    } else {
      setSelectedVibe(vibeId);
      setTimeout(() => {
        const el = document.getElementById('destinations');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    }
  };

  return (
    <section className="vibe-section" style={{ padding: '80px 0 60px' }}>
      <div className="section-inner">
        <Reveal>
          <div className="section-label" style={{ color: 'var(--gold)' }}>CHOOSE YOUR ADVENTURE</div>
          <h2 className="section-title" style={{ color: 'var(--light-text, var(--cream))' }}>What Are You Looking For?</h2>
        </Reveal>
        <div className="vibe-grid" style={{
          marginTop: 40,
        }}>
          {VIBES.map((vibe, i) => {
            const tripCount = vibe.destinations.length + vibe.bucketList.length + vibe.domestic.length;
            const isSelected = selectedVibe === vibe.id;
            return (
              <Reveal key={vibe.id} delay={i * 80} type="scale">
                <div
                  className={`vibe-card${isSelected ? ' selected' : ''}`}
                  onClick={() => handleSelect(vibe.id)}
                  style={{
                    background: '#fff',
                    borderRadius: 16,
                    padding: '32px 24px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: isSelected ? `2px solid ${vibe.color}` : '2px solid transparent',
                    boxShadow: isSelected
                      ? `0 0 0 4px ${vibe.color}22, 0 8px 32px rgba(0,0,0,0.12)`
                      : '0 2px 12px rgba(0,0,0,0.06)',
                    position: 'relative',
                    textAlign: 'center',
                  }}
                >
                  {isSelected && (
                    <div className="vibe-card-active" style={{
                      position: 'absolute', top: 12, right: 12,
                      background: vibe.color, color: '#fff',
                      fontSize: 10, fontFamily: 'var(--mono)',
                      padding: '3px 10px', borderRadius: 20, fontWeight: 700,
                      letterSpacing: 1,
                    }}>ACTIVE</div>
                  )}
                  <div style={{
                    width: 48, height: 48, borderRadius: '50%', overflow: 'hidden',
                    border: '2px solid var(--light-border, #e0d8cc)', margin: '0 auto 16px',
                  }}>
                    <img src={VIBE_PHOTOS[vibe.id]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div className="vibe-card-label" style={{
                    fontFamily: 'var(--display)', fontSize: 20, fontWeight: 600,
                    color: '#1a1a1a', marginBottom: 6,
                  }}>{vibe.label}</div>
                  <div className="vibe-card-tagline" style={{
                    fontFamily: 'var(--sans)', fontSize: 14,
                    color: '#666', marginBottom: 12,
                  }}>{vibe.tagline}</div>
                  <div className="vibe-card-count" style={{
                    fontFamily: 'var(--mono)', fontSize: 12,
                    color: vibe.color, fontWeight: 600,
                  }}>{tripCount} matching trips</div>
                </div>
              </Reveal>
            );
          })}
        </div>
        {selectedVibe && (
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <button
              className="vibe-clear"
              onClick={() => setSelectedVibe(null)}
              style={{
                background: 'transparent',
                border: '1px solid var(--light-border, #ccc)',
                color: 'var(--light-muted, #888)',
                fontFamily: 'var(--mono)',
                fontSize: 12,
                padding: '8px 20px',
                borderRadius: 20,
                cursor: 'pointer',
                letterSpacing: 1,
                transition: 'all 0.2s ease',
              }}
            >CLEAR SELECTION</button>
          </div>
        )}
      </div>
    </section>
  );
}

/* ===== DESTINATIONS SECTION ===== */
function DestinationsSection({ selectedVibe, setSelectedVibe, navigate }) {
  const [filter, setFilter] = useState('all');
  const activeVibe = VIBES.find(v => v.id === selectedVibe);

  const isVibeMatch = (name, type) => {
    if (!activeVibe) return false;
    if (type === 'dest') return activeVibe.destinations.includes(name);
    if (type === 'bucket') return activeVibe.bucketList.includes(name);
    return false;
  };

  const filteredDests = filter === 'bucket' ? [] : DESTINATIONS;
  const filteredBucket = filter === 'validated' ? [] : BUCKET_LIST;

  return (
    <section id="destinations" className="section-alt" style={{scrollMarginTop:60,
      background: 'var(--light-bg, #f5f0e8)',
      padding: '80px 0',
    }}>
      <div className="section-inner">
        <Reveal>
          <div className="section-label" style={{ color: 'var(--gold)' }}>DESTINATIONS</div>
          <h2 className="section-title" style={{ color: 'var(--light-text, #1a1a1a)' }}>
            Where We've Been. <span style={{ color: 'var(--light-muted, #999)' }}>Where You're Going.</span>
          </h2>
        </Reveal>

        {/* Vibe pills — compact horizontal selector */}
        <div style={{
          display: 'flex', gap: 6, marginTop: 24, justifyContent: 'center', flexWrap: 'wrap',
        }}>
          {VIBES.map(vibe => {
            const isActive = selectedVibe === vibe.id;
            return (
              <button key={vibe.id}
                onClick={() => setSelectedVibe(isActive ? null : vibe.id)}
                style={{
                  background: isActive ? vibe.color : 'transparent',
                  color: isActive ? '#fff' : 'var(--light-muted, #888)',
                  border: isActive ? 'none' : '1px solid var(--light-border, #ddd)',
                  fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 600,
                  padding: '6px 14px', borderRadius: 20, cursor: 'pointer',
                  letterSpacing: 0.5, transition: 'all 0.2s ease', whiteSpace: 'nowrap',
                }}
              >{vibe.label}</button>
            );
          })}
        </div>

        {/* Filter tabs */}
        <div className="filter-tabs" style={{
          display: 'flex', gap: 8, marginTop: 16, marginBottom: 40,
          justifyContent: 'center',
        }}>
          {[
            { id: 'all', label: 'All Trips' },
            { id: 'validated', label: 'Validated' },
            { id: 'bucket', label: 'Bucket List' },
          ].map(tab => (
            <button
              key={tab.id}
              className={`filter-tab${filter === tab.id ? ' active' : ''}`}
              onClick={() => setFilter(tab.id)}
              style={{
                background: filter === tab.id ? 'var(--gold)' : 'transparent',
                color: filter === tab.id ? '#1a1a1a' : 'var(--light-muted, #888)',
                border: filter === tab.id ? 'none' : '1px solid var(--light-border, #ddd)',
                fontFamily: 'var(--mono)',
                fontSize: 12,
                padding: '8px 20px',
                borderRadius: 20,
                cursor: 'pointer',
                fontWeight: 600,
                letterSpacing: 1,
                transition: 'all 0.2s ease',
              }}
            >{tab.label}</button>
          ))}
        </div>

        {/* Destination cards grid */}
        {filteredDests.length > 0 && (
          <div className="dest-grid" style={{
            display: 'grid',
            gap: 16,
          }}>
            {filteredDests.map((dest, i) => {
              const match = selectedVibe ? isVibeMatch(dest.name, 'dest') : null;
              const isFirst = i === 0;
              const previewLine = `${dest.stats[0]?.n} ${dest.stats[0]?.l?.split(' ').slice(0, 3).join(' ')}`;
              return (
                <Reveal key={dest.name} delay={i * 80}>
                  <div
                    className={`dest-card${match === true ? ' vibe-match' : ''}${match === false ? ' vibe-dim' : ''}`}
                    onClick={() => dest.link.startsWith('/') ? navigate(dest.link) : (window.location.href = dest.link)}
                    style={{
                      position: 'relative',
                      borderRadius: 16,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      gridColumn: isFirst ? 'span 2' : undefined,
                      gridRow: isFirst ? 'span 2' : undefined,
                      aspectRatio: isFirst ? undefined : '4/5',
                      minHeight: isFirst ? 500 : undefined,
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <img
                      src={IMAGES[dest.img]}
                      alt={dest.name}
                      loading="lazy"
                      className="dest-card-bg"
                      style={{
                        position: 'absolute', inset: 0,
                        width: '100%', height: '100%', objectFit: 'cover',
                        transition: 'transform 0.4s ease',
                      }}
                    />
                    <div className="dest-card-overlay" style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(to bottom, transparent 20%, rgba(0,0,0,0.88) 100%)',
                      transition: 'background 0.3s ease',
                    }} />
                    <div className="dest-card-badge" style={{
                      position: 'absolute', top: 16, left: 16,
                      background: dest.badge.includes('Research') ? 'rgba(106,142,168,0.9)' : 'rgba(184,136,110,0.9)',
                      color: '#fff',
                      fontFamily: 'var(--mono)',
                      fontSize: 10, fontWeight: 700,
                      padding: '5px 12px', borderRadius: 20,
                      letterSpacing: 1, zIndex: 2,
                    }}>
                      {dest.badge.includes('Research') ? 'RESEARCH BUILT' : 'PERSONALLY VALIDATED'}
                    </div>
                    <div className="dest-card-content" style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0,
                      padding: '24px', zIndex: 2,
                    }}>
                      <div className="dest-card-region" style={{
                        fontFamily: 'var(--mono)',
                        fontSize: 10, color: 'var(--gold)',
                        letterSpacing: 2, marginBottom: 8,
                      }}>{dest.route}</div>
                      <div className="dest-card-name" style={{
                        fontFamily: 'var(--display)',
                        fontSize: isFirst ? 32 : 24, fontWeight: 600,
                        color: '#fff', marginBottom: 8, lineHeight: 1.2,
                      }}>{dest.name}</div>
                      <div className="dest-card-meta" style={{
                        fontFamily: 'var(--sans)',
                        fontSize: 13, color: 'rgba(255,255,255,0.7)',
                        display: 'flex', gap: 12, flexWrap: 'wrap',
                      }}>
                        {dest.stats.slice(0, 3).map((s, si) => (
                          <span key={si} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <span style={{ color: 'var(--gold)', fontFamily: 'var(--mono)', fontWeight: 700 }}>{s.n}</span>
                            <span>{s.l.split(' ').slice(0, 3).join(' ')}</span>
                          </span>
                        ))}
                      </div>
                      <div className="dest-card-cta" style={{
                        marginTop: 12,
                        fontFamily: 'var(--mono)',
                        fontSize: 12, color: 'var(--gold)',
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                        letterSpacing: 1,
                      }}>View Framework &rarr;</div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        )}

        {/* Google Maps banner */}
        {filter !== 'bucket' && (
          <Reveal delay={200}>
            <div className="maps-banner" style={{
              marginTop: 40,
              background: 'var(--surface, #1c1915)',
              borderRadius: 16,
              padding: '32px 40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 24,
              border: '1px solid rgba(201,168,76,0.15)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%',
                  background: 'rgba(201,168,76,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--gold)', flexShrink: 0,
                }}>
                  <IconPin />
                </div>
                <div className="maps-banner-text">
                  <div style={{
                    fontFamily: 'var(--display)',
                    fontSize: 20, fontWeight: 600, color: 'var(--cream, #e8dcc8)',
                  }}>18 Google Maps Lists. Made by Us.</div>
                  <div style={{
                    fontFamily: 'var(--sans)',
                    fontSize: 14, color: 'var(--cream2, #b8ad9a)', marginTop: 4,
                  }}>Drop them into your phone. Navigate like you live there.</div>
                </div>
              </div>
              <button style={{
                background: 'transparent',
                border: '1px solid var(--gold)',
                color: 'var(--gold)',
                fontFamily: 'var(--mono)',
                fontSize: 12, fontWeight: 600,
                padding: '10px 24px',
                borderRadius: 20,
                cursor: 'pointer',
                letterSpacing: 1,
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
              }}>BROWSE MAPS</button>
            </div>
          </Reveal>
        )}

        {/* Bucket List section */}
        {filteredBucket.length > 0 && (
          <div style={{ marginTop: 60 }}>
            <Reveal>
              <div className="section-label" style={{ color: 'var(--gold)' }}>BUCKET LIST</div>
              <h2 className="section-title" style={{
                color: 'var(--light-text, #1a1a1a)',
                fontSize: 28, marginBottom: 32,
              }}>What's Next</h2>
            </Reveal>
            <div className="dest-grid" style={{ gap: 16 }}>
              {filteredBucket.map((item, i) => {
                const match = selectedVibe ? isVibeMatch(item.name, 'bucket') : null;
                return (
                  <Reveal key={item.name} delay={i * 80}>
                    <div
                      className={`dest-card${match === true ? ' vibe-match' : ''}${match === false ? ' vibe-dim' : ''}`}
                      onClick={() => item.link && (item.link.startsWith('/') ? navigate(item.link) : (window.location.href = item.link))}
                      style={{
                        position: 'relative',
                        borderRadius: 16,
                        overflow: 'hidden',
                        cursor: item.link ? 'pointer' : 'default',
                        aspectRatio: '3/4',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <img
                        src={BUCKET_IMAGES[item.name]}
                        alt={item.name}
                        loading="lazy"
                        style={{
                          position: 'absolute', inset: 0,
                          width: '100%', height: '100%', objectFit: 'cover',
                          transition: 'transform 0.4s ease',
                        }}
                      />
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(to bottom, transparent 20%, rgba(0,0,0,0.88) 100%)',
                      }} />
                      <div style={{
                        position: 'absolute', top: 16, right: 16,
                        background: item.status === 'departing' ? 'rgba(201,168,76,0.95)' : item.status === 'ready' ? 'rgba(201,168,76,0.9)' : 'rgba(90,154,173,0.9)',
                        color: item.status === 'departing' ? '#1a1a1a' : '#fff',
                        fontFamily: 'var(--mono)',
                        fontSize: 10, fontWeight: 700,
                        padding: '5px 12px', borderRadius: 20,
                        letterSpacing: 1, zIndex: 2,
                      }}>
                        {item.status === 'departing' ? 'DEPARTING MAY 2026' : item.status === 'ready' ? 'FRAMEWORK READY' : 'BUILDING'}
                      </div>
                      <div style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0,
                        padding: '20px', zIndex: 2,
                      }}>
                        <div style={{
                          fontFamily: 'var(--mono)',
                          fontSize: 10, color: 'var(--gold)',
                          letterSpacing: 2, marginBottom: 6,
                        }}>{item.route}</div>
                        <div style={{
                          fontFamily: 'var(--display)',
                          fontSize: 22, fontWeight: 600,
                          color: '#fff', marginBottom: 6, lineHeight: 1.2,
                        }}>{item.name}</div>
                        <div style={{
                          fontFamily: 'var(--sans)',
                          fontSize: 12, color: 'rgba(255,255,255,0.6)',
                        }}>{item.meta}</div>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ===== MAIN APP ===== */
export default function App() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('destinations');
  const [heroImg, setHeroImg] = useState(0);
  const [selectedVibe, setSelectedVibe] = useState(null);
  const [quizData, setQuizData] = useState(null);

  /* Scroll listener for nav */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Hero image cycling */
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroImg(prev => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* ===== NAV ===== */}
      <nav className={`nav${scrolled ? ' scrolled' : ''}`} style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: scrolled ? '12px 0' : '16px 0',
        background: scrolled ? 'rgba(20,18,16,0.92)' : 'rgba(20,18,16,0.4)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        transition: 'all 0.3s ease',
        borderBottom: scrolled ? '1px solid rgba(201,168,76,0.1)' : '1px solid transparent',
      }}>
        <div className="nav-inner" style={{
          maxWidth: 1200, margin: '0 auto', padding: '0 32px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div className="nav-brand" style={{
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'var(--gold)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--display)', fontSize: 18, fontWeight: 700,
              color: '#1a1a1a',
            }}>L</div>
            <span style={{
              fontFamily: 'var(--display)',
              fontSize: 16, fontWeight: 600,
              color: 'var(--cream, #e8dcc8)',
              letterSpacing: 0.5,
            }}>The Lads Travel Co.</span>
          </div>
          <div className="nav-pills" style={{
            display: 'flex', gap: 4,
            background: 'rgba(255,255,255,0.06)',
            borderRadius: 24, padding: 4,
          }}>
            {['Destinations', 'The System', 'Domestic', 'The Lads'].map(tab => {
              const id = tab.toLowerCase().replace(/\s+/g, '-');
              const isActive = activeSection === id;
              return (
                <button
                  key={id}
                  className={`nav-pill${isActive ? ' active' : ''}`}
                  onClick={() => {
                    setActiveSection(id);
                    const el = document.getElementById(id === 'destinations' ? 'destinations' : id);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  style={{
                    background: isActive ? 'rgba(201,168,76,0.15)' : 'transparent',
                    color: isActive ? 'var(--gold)' : 'var(--cream2, #b8ad9a)',
                    border: 'none',
                    fontFamily: 'var(--mono)',
                    fontSize: 12, fontWeight: 600,
                    padding: '8px 18px',
                    borderRadius: 20,
                    cursor: 'pointer',
                    letterSpacing: 0.5,
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap',
                  }}
                >{tab}</button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section className="hero" style={{
        position: 'relative',
        height: '100vh', minHeight: 700,
        overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {/* Background images with crossfade */}
        {heroImages.map((src, i) => (
          <div
            key={i}
            className="hero-bg"
            style={{
              position: 'absolute', inset: 0,
              opacity: heroImg === i ? 1 : 0,
              transition: 'opacity 1.2s ease-in-out',
              zIndex: 0,
            }}
          >
            <img src={src} alt="" loading="eager" style={{
              width: '100%', height: '100%', objectFit: 'cover',
            }} />
          </div>
        ))}

        {/* Gradient overlay */}
        <div className="hero-overlay" style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(20,18,16,0.45) 0%, rgba(20,18,16,0.25) 40%, rgba(20,18,16,0.75) 70%, var(--bg) 100%)',
          zIndex: 1,
        }} />

        {/* Hero content */}
        <div className="hero-content" style={{
          position: 'relative', zIndex: 2,
          textAlign: 'center',
          maxWidth: 700,
          padding: '0 32px',
        }}>
          <div className="hero-label" style={{
            fontFamily: 'var(--mono)',
            fontSize: 11,
            color: 'var(--gold)',
            letterSpacing: 4,
            marginBottom: 24,
            textTransform: 'uppercase',
          }}>FREE PERSONAL TRAVEL CONSULTING THROUGH 2026</div>

          <h1 style={{ margin: 0, lineHeight: 1.1, marginBottom: 20 }}>
            <span style={{
              fontFamily: "'Space Grotesk', var(--sans)",
              fontSize: 'clamp(36px, 5vw, 64px)',
              fontWeight: 300,
              color: '#fff',
              display: 'block',
            }}>Travel Like</span>
            <span style={{
              fontFamily: "'Fraunces', var(--display)",
              fontSize: 'clamp(40px, 5.5vw, 72px)',
              fontWeight: 400,
              fontStyle: 'italic',
              color: 'var(--gold)',
              display: 'block',
            }}>You Know Someone</span>
          </h1>

          <p className="hero-sub" style={{
            fontFamily: 'var(--sans)',
            fontSize: 16,
            color: 'var(--cream2, #b8ad9a)',
            maxWidth: 580,
            margin: '0 auto',
            lineHeight: 1.6,
          }}>
            Two friends. Four continents. Every recommendation from personal experience.
          </p>

          {/* Stats moved to Database section — hero is photography-first */}
        </div>

        {/* Scroll indicator */}
        <div className="hero-scroll" style={{
          position: 'absolute',
          bottom: 40, left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2,
          animation: 'float 2s ease-in-out infinite',
          opacity: 0.5,
          color: 'var(--cream2, #b8ad9a)',
        }}>
          <IconChevron />
        </div>

        {/* Dot indicators */}
        <div className="hero-dots" style={{
          position: 'absolute',
          bottom: 40, right: 32,
          zIndex: 2,
          display: 'flex',
          gap: 8,
          alignItems: 'center',
        }}>
          {heroImages.map((_, i) => (
            <div
              key={i}
              className={`hero-dot${heroImg === i ? ' active' : ''}`}
              onClick={() => setHeroImg(i)}
              style={{
                width: heroImg === i ? 24 : 8,
                height: 8,
                borderRadius: 4,
                background: heroImg === i ? 'var(--gold)' : 'rgba(255,255,255,0.3)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>
      </section>

      {/* ===== GLOBE + DATABASE (pulled up from System section) ===== */}
      <section style={{
        background: 'var(--bg, #141210)',
        padding: '60px 0 40px',
        position: 'relative',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', textAlign: 'center' }}>
          <Reveal type="fade">
            <div style={{ fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 600, letterSpacing: 4, color: 'var(--gold)', marginBottom: 16 }}>THE DATABASE</div>
            <h2 style={{
              fontFamily: "'Fraunces', var(--display)", fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              fontWeight: 400, color: 'var(--cream, #e8dcc8)', lineHeight: 1.2, marginBottom: 8,
            }}>180+ Spots. 29 Cities. 13 Countries.</h2>
            <p style={{ fontFamily: 'var(--sans)', fontSize: 15, color: 'var(--cream2, #b8ad9a)', marginBottom: 0 }}>
              Every one walked into, sat down at, or stumbled out of.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 28, flexWrap: 'wrap' }}>
              {[{n:'180+',l:'Validated Spots'},{n:'29',l:'Cities'},{n:'13',l:'Countries'},{n:'4',l:'Continents'}].map((s,i) => (
                <div key={i} style={{
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,168,76,0.15)',
                  borderRadius: 12, padding: '12px 20px', textAlign: 'center', minWidth: 90,
                }}>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 20, fontWeight: 700, color: 'var(--gold)' }}>{s.n}</div>
                  <div style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--cream2)', marginTop: 2 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </Reveal>
          <Suspense fallback={<div style={{ height: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--muted)', letterSpacing: 2 }}>LOADING GLOBE...</span></div>}>
            <Globe />
          </Suspense>
        </div>
      </section>

      {/* ===== DESTINATIONS (vibe pills integrated) ===== */}
      <DestinationsSection selectedVibe={selectedVibe} setSelectedVibe={setSelectedVibe} navigate={navigate} />

      {/* ===== PHOTO STRIP 2 ===== */}
      <PhotoStrip images={photoStrip2} height={260} columns={4} />

      {/* ===== ACT 2: THE SYSTEM ===== */}
      <div id="the-system" style={{scrollMarginTop:60}}>
        <SystemSection onQuizComplete={(data) => {
          setQuizData(data);
          setTimeout(() => {
            const el = document.getElementById('intake-form');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 300);
        }} />
      </div>

      {/* ===== PHOTO STRIP 3 (cinematic trio) ===== */}
      <PhotoStrip images={photoStrip3} height={340} columns={3} />

      {/* ===== ACT 3: NORTH AMERICA ===== */}
      <div id="domestic" style={{scrollMarginTop:60}}>
        <NorthAmericaSection />
      </div>

      {/* ===== PHOTO STRIP 4 (quick rhythm) ===== */}
      <PhotoStrip images={photoStrip4} height={180} columns={5} />

      {/* ===== CINEMATIC SINGLE IMAGE ===== */}
      <div className="cinematic-single">
        <img src={photoStripCinematic} alt="" loading="lazy" />
        <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom, rgba(20,18,16,0.1) 0%, rgba(20,18,16,0.4) 100%)'}} />
      </div>

      {/* ===== ACT 4: THE LADS ===== */}
      <div id="the-lads" style={{scrollMarginTop:60}}>
        <LadsSection quizData={quizData} />
      </div>

      {/* ===== PHOTO STRIP 5 (lingering) ===== */}
      <PhotoStrip images={photoStrip5} height={260} columns={3} />

      {/* ===== PHOTO GALLERY — PARALLAX WALL ===== */}
      <PhotoGallery />

      {/* ===== ACT 5: GIVING BACK + FOOTER ===== */}
      <GivingBackFooter />

      {/* Float animation keyframes */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(8px); }
        }
        .dest-card:hover .dest-card-bg {
          transform: scale(1.02);
        }
        .dest-card:hover .dest-card-overlay {
          background: linear-gradient(to bottom, transparent 10%, rgba(0,0,0,0.92) 100%);
        }
        .dest-card:hover .dest-card-cta {
          opacity: 1 !important;
        }
        .vibe-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.15);
        }
      `}</style>
    </>
  );
}
