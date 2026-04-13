import React, { useState, useEffect, useRef, useCallback } from 'react';
import { IMAGES } from './images';
import { NEW_IMAGES } from './images-new';
import { BATCH3_IMAGES } from './images-batch3';
import { HERO_IMAGES } from './images-hero';
import { BATCH4_IMAGES } from './images-batch4';
import { HEIC_HERO_IMAGES } from './images-heic-hero';
import { HEIC_CARD_IMAGES } from './images-heic-card';
import TravelWindows from './TravelWindows';
import './TravelWindows.css';

/* ===== IMAGE DATA ===== */

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

function Reveal({ children, className = 'reveal', style = {}, delay = 0 }) {
  const ref = useReveal();
  const s = delay ? { ...style, transitionDelay: `${delay}ms` } : style;
  return <div ref={ref} className={className} style={s}>{children}</div>;
}

/* ===== DESTINATION DATA ===== */
const DESTINATIONS = [
  {
    name: "Dublin + Galway", img: "cliffs", accent: "#2a6b3a",
    route: "DUBLIN → KILKENNY → GALWAY → CLIFFS OF MOHER",
    badge: "Both Lads — Personally Validated",
    stats: [{n:"35+",l:"Pubs we drank in across Dublin & Galway"},{n:"3",l:"Versions: Christmas, St. Pat's, or summer"},{n:"45+",l:"Spots mapped — pubs, restaurants, sights"},{n:"3",l:"Day trips we personally took"}],
    desc: "Christmas markets, St. Patrick's Day, or summer — three completely different trips from the same two cities. Every pub rated, every attraction mapped, every day trip personally taken.",
    link: "dublin-galway.html",
    maps: [{t:"Pubs & Food",u:"https://maps.app.goo.gl/NrZtg6tUR1Rjk8oS8"},{t:"Attractions",u:"https://maps.app.goo.gl/9YLakDkjrE6jj7cQA"},{t:"Galway",u:"https://maps.app.goo.gl/deRD11SQis6ZUsKL8"}],
    trips: [{t:"Cliffs of Moher + Burren",d:"Full day from Galway. Brady rated 9/10.",u:"https://www.viator.com/tours/Galway/Cliffs-of-Moher-and-Burren-Day-Trip-Including-Dunguaire-Castle-Aillwee-Cave-and-Doolin-from-Galway/d5156-8625P1"},{t:"Wicklow + Glendalough + Kilkenny",d:"Full day from Dublin. Medieval castle, monastic ruins, mountains.",u:"https://gyg.me/V0UrxNUe"}]
  },
  {
    name: "Rome + Italy", img: "colosseum", accent: "#bc6c25",
    route: "ROME → VATICAN → TRASTEVERE → POMPEII → AMALFI COAST",
    badge: "Both Lads — Personally Validated",
    stats: [{n:"11/10",l:"How we rated Pompeii — not optional"},{n:"43",l:"Restaurants, bars & hidden spots we found"},{n:"2025",l:"Jubilee Year — Vatican holy doors open"},{n:"2",l:"Day trips: Pompeii + Amalfi Coast"}],
    desc: "Five days during the Jubilee Year. \u20AC1 beers at Bar San Calisto, cacio e pepe at Tonnarello, the Vatican with holy doors open. The framework includes Trastevere nightlife routing, restaurant tiers, and a full Pompeii day trip plan.",
    link: "italy.html",
    maps: [{t:"Food & Drink",u:"https://maps.app.goo.gl/kmFjNeA6k8BHuHWT8"},{t:"Attractions",u:"https://maps.app.goo.gl/RAS5mqRhc6BYTa5D6"}],
    trips: [{t:"Pompeii + Amalfi + Sorrento",d:"Full day from Rome. Pompeii is non-negotiable — 11/10.",u:"https://gyg.me/c6cN0bz2"}]
  },
  {
    name: "Barcelona + Madrid", img: "sagrada", accent: "#8a3040",
    route: "BARCELONA → MONTSERRAT → GIRONA → SITGES → MADRID",
    badge: "Both Lads — Personally Validated",
    stats: [{n:"100+",l:"Bars, restaurants & spots across both cities"},{n:"3",l:"Versions: groups of 2, 4, or 8"},{n:"2",l:"Study abroads between us — Brady + Dawson"},{n:"3",l:"Day trips: Montserrat, Girona, Sitges"}],
    desc: "The most validated two-city framework. Brady's Barcelona study abroad meets Dawson's Madrid. Three versions for groups of 2, 4, or 8 — each with its own accommodation strategy and cost model.",
    link: "spain.html",
    maps: [{t:"Food",u:"https://maps.app.goo.gl/bZp95gDP9VwBe6Kd7"},{t:"Bars",u:"https://maps.app.goo.gl/2LZGLZQEuT53NK3Z8"},{t:"Attractions",u:"https://maps.app.goo.gl/63o5dgY5Fr8SJUZk6"}],
    trips: [{t:"Montserrat + Girona + Sitges",d:"Full day from Barcelona. Mountain monastery, medieval town, coastal village.",u:"https://www.viator.com/tours/Barcelona/From-Barcelona-Montserrat-Girona-and-Sitges-Full-Day-Tour/d562-6874P164"}]
  },
  {
    name: "Australia + NZ", img: "opera", accent: "#c26e52",
    route: "SYDNEY → BONDI → BLUE MOUNTAINS → TASMANIA → SOUTH ISLAND NZ",
    badge: "Brady — Personally Validated",
    stats: [{n:"6",l:"Weeks actually living in Sydney"},{n:"123",l:"Spots — surf camps, rock pools, hidden bars"},{n:"4",l:"Days exploring Tasmania's wilderness"},{n:"1",l:"Banh mi in Marrickville that changed us"}],
    desc: "The deepest single-city knowledge base in the portfolio. Surf camps, rock pools, Vivid Sydney light shows, and the best banh mi in Marrickville. Six weeks of actually living there — not visiting.",
    link: "australia-nz.html",
    maps: [],
    trips: []
  },
  {
    name: "Iceland", img: "iceland", accent: "#6a8ea8",
    route: "REYKJAVIK → GOLDEN CIRCLE → RING ROAD → WESTMAN ISLANDS",
    badge: "Dawson — Personally Validated",
    stats: [{n:"10",l:"Days driving the full Ring Road"},{n:"4",l:"Versions: summer/winter, short/long"},{n:"2",l:"Seasons — Northern Lights or Midnight Sun"},{n:"1",l:"Lad who drove every single kilometer"}],
    desc: "Full Ring Road. Four versions: summer or winter, short or long. Northern Lights, Midnight Sun, volcanic landscapes. Dawson drove every kilometer.",
    link: "iceland.html",
    maps: [],
    trips: []
  },
  {
    name: "Prague + Vienna + Dresden", img: "stvitus", accent: "#7a6a4a",
    route: "VIENNA → PRAGUE → PILSEN → DRESDEN",
    badge: "Brady — Personally Validated",
    stats: [{n:"75+",l:"Bars, breweries & spots across 3 cities"},{n:"4",l:"Google Maps lists — use them on the ground"},{n:"3",l:"Countries: Austria, Czechia, Germany"},{n:"10",l:"Day itinerary — every hour planned"}],
    desc: "Pilsner Urquell brewery. Sch\u00F6nbrunn Palace. St. Vitus Cathedral. Best value city in Europe meets Habsburg grandeur. Three countries, one framework.",
    link: "prague-vienna.html",
    maps: [{t:"Prague Attractions",u:"https://maps.app.goo.gl/e3pGDSj6PCcPEy8j7"},{t:"Prague Bars",u:"https://maps.app.goo.gl/o7BCdPPpzPHJsEA59"},{t:"Vienna",u:"https://maps.app.goo.gl/R4TC9toa9oP5qJed8"},{t:"Dresden",u:"https://maps.app.goo.gl/FYEJQFkTJVyqZr1x7"}],
    trips: [{t:"Pilsner Urquell Brewery",d:"Day trip from Prague. The original pilsner, underground cellars.",u:"https://prazdrojvisit.cz"}]
  }
];

const BUCKET_LIST = [
  {name:"Munich Oktoberfest",route:"CHICAGO → MUNICH → SALZBURG",status:"ready",meta:"4\u201310 ppl \u00B7 5\u20138 days \u00B7 Sept 2026",link:"munich.html",desc:"Skip the tourist tents. We know which beer hall to hit, where to stay in Glockenbachviertel, and exactly what it costs for groups of 4\u201310."},
  {name:"Poland August",route:"CHICAGO \u2192 KRAKOW \u2192 WARSAW \u2192 GDA\u0143SK",status:"ready",meta:"4\u20138 ppl \u00B7 6\u201310 days \u00B7 Aug 2026",link:"poland.html",desc:"LOT flies non-stop from Chicago. Krakow's nightlife, Auschwitz, Gda\u0144sk beaches \u2014 best value trip in Europe and it's not close."},
  {name:"Thailand NYE",route:"BANGKOK \u2192 KOH PHANGAN \u2192 KRABI",status:"ready",meta:"4\u20138 ppl \u00B7 10\u201316 days \u00B7 Dec\u2013Jan",link:"thailand.html",desc:"Ring in the new year at a Full Moon Party, then island-hop to Krabi. Cathay Pacific routing via Hong Kong. Every logistics headache already solved."},
  {name:"Tour du Mont Blanc",route:"CHAMONIX \u2192 COURMAYEUR \u2192 SWITZERLAND",status:"building",meta:"2\u20136 ppl \u00B7 7\u201311 days \u00B7 Jul\u2013Sep",desc:"Hut-to-hut across the Alps through France, Italy, and Switzerland. The trek that belongs on every adventure traveler's list."},
  {name:"Pilsenfest + Prague",route:"PRAGUE \u2192 PILSEN \u2192 CZECH COUNTRYSIDE",status:"building",meta:"2\u20138 ppl \u00B7 4\u20137 days \u00B7 Oct annual",desc:"Brady drank Pilsner Urquell in the underground cellars where it was invented. This trip wraps that brewery experience around a Czech beer festival."},
  {name:"Camp Nou Reopening",route:"BARCELONA \u2192 CAMP NOU \u2192 MONTSERRAT",status:"building",meta:"2\u20138 ppl \u00B7 5\u20138 days \u00B7 2025\u201326",desc:"Watch a match in the largest stadium in Europe the year it reopens \u2014 with 100+ validated Barcelona spots around it."},
  {name:"Ryder Cup 2027",route:"DUBLIN \u2192 ADARE MANOR \u2192 GALWAY",status:"building",meta:"2\u20138 ppl \u00B7 7\u201310 days \u00B7 Sep 2027",desc:"Golf trip of a lifetime at Adare Manor, wrapped inside the Ireland framework we've already validated. 45+ spots, 35+ pubs, every day trip mapped."}
];

const DB_SPOTS = [
  {city:"Sydney",n:123},{city:"Barcelona",n:115},{city:"Rome",n:43},{city:"Dublin",n:39},{city:"Prague",n:38},
  {city:"Vienna",n:37},{city:"Costa Rica",n:28},{city:"Tasmania",n:27},{city:"Vancouver",n:22},{city:"Galway",n:15}
];

const DOMESTIC = [
  {name:"Jaco, Costa Rica",meta:"Both Lads \u00B7 28 Spots",desc:"Beach Airbnb, surf lessons, and an ATV tour to a hidden waterfall that we'd rank as our single best half-day experience anywhere we've traveled.",img:"costaRicaViewpoint",links:[{t:"Book ATV Tour",u:"https://gyg.me/0vVQ5scX"},{t:"Google Maps",u:"https://maps.app.goo.gl/hc199wu19C6cKj9G6"}]},
  {name:"San Juan",meta:"Brady \u00B7 14 Spots",desc:"No passport needed. Old San Juan is walkable, the mofongo is real, and the nightlife on Calle de la Fortaleza runs until 3am.",img:"oahu_IMG_5001",imgSrc:"hero",links:[{t:"Google Maps",u:"https://maps.app.goo.gl/ZWM8LXFGV9QpS8fB7"}]},
  {name:"Vancouver",meta:"Brady \u00B7 22 Spots",desc:"Stanley Park, Granville Island, and sushi that rivals Tokyo. 22 spots mapped across the best food city in the Pacific Northwest.",img:"vancouver",links:[{t:"Bars & Food",u:"https://maps.app.goo.gl/9n9uM7NG8Sa2aA8"},{t:"Things to Do",u:"https://maps.app.goo.gl/4moCgAkEHz5uJbQ9A"}]},
  {name:"Seattle + Olympic",meta:"Brady \u00B7 14 Spots",desc:"Pike Place for the morning, Capitol Hill bars at night, and a day trip to Olympic National Park that makes the whole trip worth it.",img:"hohRainforest",links:[{t:"Google Maps",u:"https://maps.app.goo.gl/Fr7KdvoLsnXeBV1q8"}]},
  {name:"Phoenix + Golf",meta:"Brady \u00B7 7 Spots",desc:"The golf trip. Shoulder season pricing in late spring or early fall cuts costs 40% and the weather's still perfect.",img:"phoenix_IMG_2651",imgSrc:"hero",links:[{t:"Google Maps",u:"https://maps.app.goo.gl/PTJn6coPBcRDKbHw5"}]},
  {name:"Smoky Mountains",meta:"Brady \u00B7 8 Spots",desc:"Cabin on the quiet side, away from Gatlinburg crowds. Go in October for fall colors that make you forget you're three hours from Nashville.",img:"smokyRockOverlook",links:[]},
  {name:"Las Vegas",meta:"Both Lads",desc:"Best as 3\u20134 nights. Skip the strip restaurants \u2014 the off-strip food scene is where the real value hides.",img:"best_IMG_9695",imgSrc:"hero",links:[]},
  {name:"Charleston",meta:"Brady",desc:"Best food city in the South, and it's not close. King Street for cocktails, Sullivan's Island for the beach day, Husk for the dinner that sells the trip.",img:"best_100_0110",imgSrc:"hero",links:[{t:"One-Pager",u:"charleston.html"}]}
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

/* ===== MAIN APP ===== */

/* ===== QUIZ RECS ===== */
const QUIZ_RECS = {
      nightlife_low: { pick: "Dublin + Galway", why: "Cheapest validated nightlife city in our portfolio. 35+ pubs documented, three timing versions, and flights from ORD under $500 in shoulder season. Temple Bar is overpriced but the spots we send you to aren't.", alt: "Poland August", altWhy: "Krakow's nightlife district is world-class and even cheaper.", link: "dublin-galway.html" },
      nightlife_mid: { pick: "Munich Oktoberfest", why: "Event-driven nightlife at its peak. Augustiner-Brau tent strategy, Glockenbachviertel base, and a complete cost model for groups of 4-10. This is the one trip where the party IS the culture.", alt: "Barcelona + Madrid", altWhy: "100+ validated spots and Dawson's Madrid nightlife knowledge.", link: "munich.html" },
      nightlife_high: { pick: "Thailand NYE", why: "Full Moon Party on Koh Phangan, rooftop bars in Bangkok, beach clubs in Krabi. Cathay Pacific via Hong Kong. This is the bucket-list nightlife trip — 10 to 16 days of it.", alt: "Barcelona + Madrid", altWhy: "If Southeast Asia feels too far, Barcelona's nightlife runs until 6am.", link: "thailand.html" },
      nightlife_flex: { pick: "Thailand NYE", why: "Full Moon Party on Koh Phangan, rooftop bars in Bangkok, beach clubs in Krabi. Cathay Pacific via Hong Kong. This is the bucket-list nightlife trip — 10 to 16 days of it.", alt: "Barcelona + Madrid", altWhy: "If Southeast Asia feels too far, Barcelona's nightlife runs until 6am.", link: "thailand.html" },
      culture_low: { pick: "Prague + Vienna + Dresden", why: "Best value culture cities in Europe. St. Vitus Cathedral, Schonbrunn Palace, Pilsner Urquell brewery, and the Dresden Hofkirche — all on a budget that makes Western Europe look embarrassing. 75+ spots across three cities.", alt: "Dublin + Galway", altWhy: "Literary pubs, medieval castles, and the Cliffs of Moher for under $2K.", link: "prague-vienna.html" },
      culture_mid: { pick: "Rome + Italy", why: "Deepest validated culture framework in the portfolio. Vatican with Jubilee holy doors, Pompeii day trip rated 11/10, Trastevere neighborhood routing, and 43 validated spots. Five days minimum.", alt: "Barcelona + Madrid", altWhy: "Sagrada Familia, Montserrat monastery, and the Prado — different flavor, same depth.", link: "italy.html" },
      culture_high: { pick: "Australia + NZ", why: "Six weeks of depth. Sydney Opera House, Aboriginal cultural experiences, Tasmania wilderness, and the South Island. This isn't a vacation — it's an education. 123 spots in the database.", alt: "Rome + Italy extended", altWhy: "Add Amalfi Coast and Florence for a 10-day Italian deep dive.", link: "australia-nz.html" },
      culture_flex: { pick: "Australia + NZ", why: "Six weeks of depth. Sydney Opera House, Aboriginal cultural experiences, Tasmania wilderness, and the South Island. This isn't a vacation — it's an education. 123 spots in the database.", alt: "Rome + Italy extended", altWhy: "Add Amalfi Coast and Florence for a 10-day Italian deep dive.", link: "australia-nz.html" },
      adventure_low: { pick: "Iceland", why: "Ring Road works at any budget. Dawson did it. Northern Lights or Midnight Sun depending on timing. Volcanic landscapes, waterfalls, and the Westman Islands. Four versions: summer or winter, short or long.", alt: "Smoky Mountains", altWhy: "Cabin on the quiet side, fall colors, minimal flight cost from the Midwest.", link: "iceland.html" },
      adventure_mid: { pick: "Iceland", why: "Ring Road works at any budget. Dawson did it. Northern Lights or Midnight Sun depending on timing. Volcanic landscapes, waterfalls, and the Westman Islands. Four versions: summer or winter, short or long.", alt: "Costa Rica", altWhy: "ATV jungle tour, surf lessons, and a beach Airbnb — our best half-day experience anywhere.", link: "iceland.html" },
      adventure_high: { pick: "Iceland", why: "Ring Road works at any budget. Dawson did it. Northern Lights or Midnight Sun depending on timing. Volcanic landscapes, waterfalls, and the Westman Islands. Four versions: summer or winter, short or long.", alt: "Peru / Machu Picchu", altWhy: "Salkantay Trek, Rainbow Mountain ATV, Huacachina sandboarding — Brady's doing it May 2026.", link: "iceland.html" },
      adventure_flex: { pick: "Iceland", why: "Ring Road works at any budget. Dawson did it. Northern Lights or Midnight Sun depending on timing. Volcanic landscapes, waterfalls, and the Westman Islands. Four versions: summer or winter, short or long.", alt: "Peru / Machu Picchu", altWhy: "Salkantay Trek, Rainbow Mountain ATV, Huacachina sandboarding — Brady's doing it May 2026.", link: "iceland.html" },
      food_low: { pick: "Dublin + Galway", why: "Pub food done right plus Galway's seafood scene. McDonagh's fish and chips, oysters at the Saturday market, and 35+ pubs where the Guinness actually tastes different. Affordable and validated.", alt: "Poland August", altWhy: "Pierogi, zurek, and Krakow's Kazimierz food scene for half the price of Western Europe.", link: "dublin-galway.html" },
      food_mid: { pick: "Barcelona + Madrid", why: "100+ validated spots and a tapas culture that makes every meal an event. Dawson's Madrid study abroad plus Brady's Barcelona — two food cities with completely different personalities. Boqueria market, pintxos bars, and late-night churros con chocolate.", alt: "Rome + Italy", altWhy: "Trastevere trattorias, cacio e pepe at Tonnarello, and one-euro espresso.", link: "spain.html" },
      food_high: { pick: "Rome + Italy Extended", why: "Trastevere deep dive. Tonnarello, Bar San Calisto, and the kind of neighborhood restaurants that don't show up on TripAdvisor. Extend to Amalfi Coast for seafood and limoncello. This is the trip where you eat your way through history.", alt: "Barcelona + Madrid", altWhy: "If Italian food fatigue is even possible, switch to Spain's variety.", link: "italy.html" },
      food_flex: { pick: "Rome + Italy Extended", why: "Trastevere deep dive. Tonnarello, Bar San Calisto, and the kind of neighborhood restaurants that don't show up on TripAdvisor. Extend to Amalfi Coast for seafood and limoncello. This is the trip where you eat your way through history.", alt: "Barcelona + Madrid", altWhy: "If Italian food fatigue is even possible, switch to Spain's variety.", link: "italy.html" },
      mix_low: { pick: "Poland August", why: "Best all-around value in our portfolio. Krakow anchor with nightlife, Auschwitz for sobering culture, Gdansk beaches, Warsaw's rebuilt old town. LOT non-stop from ORD. Three duration versions for groups of 4-8.", alt: "Dublin + Galway", altWhy: "Pubs, castles, cliffs, and craic — hard to beat for a balanced trip under $2K.", link: "poland.html" },
      mix_mid: { pick: "Barcelona + Madrid", why: "Most validated mix in the portfolio. Two study abroads, 100+ spots, nightlife until 6am, Sagrada Familia, Montserrat day trip, tapas culture, and beach days. Three group versions. This is the default recommendation for a reason.", alt: "Rome + Italy", altWhy: "Swap beaches for history and you still get nightlife and world-class food.", link: "spain.html" },
      mix_high: { pick: "Multi-City Europe", why: "Open-jaw routing — fly into one city, out of another. Combine Barcelona + Rome, or Dublin + Iceland, or Prague + Munich. We build the flight strategy, the frameworks connect, and you get two trips in one. This is where our system shines.", alt: "Australia + NZ", altWhy: "If you have 2+ weeks, Sydney alone has 123 spots — add Tasmania and NZ for the full experience.", link: "#" },
      mix_flex: { pick: "Multi-City Europe", why: "Open-jaw routing — fly into one city, out of another. Combine Barcelona + Rome, or Dublin + Iceland, or Prague + Munich. We build the flight strategy, the frameworks connect, and you get two trips in one. This is where our system shines.", alt: "Australia + NZ", altWhy: "If you have 2+ weeks, Sydney alone has 123 spots — add Tasmania and NZ for the full experience.", link: "#" }
    };

/* ===== TRAVEL WINDOWS INLINE JSX ===== */
function TRAVEL_WINDOWS_JSX(openWindow, toggleWindow) {
  return (
    <>
              {/* Window 1: Late November */}
              <div className={`tw-card`} onClick={() => toggleWindow(0)}>
                <div className="tw-card-header">
                  <div className="tw-card-header-left">
                    <div className="tw-window-name">Late November / Early December</div>
                    <div className="tw-tagline">The underrated one. Cheap flights, thin crowds, Christmas markets.</div>
                  </div>
                  <div className={`tw-chevron ${openWindow===0?'open':''}`}>&#9662;</div>
                </div>
                <div className={`tw-body ${openWindow===0?'open':''}`}>
                  <div className="tw-body-inner">
                    <div className="tw-stats">
                      <div className="tw-stat"><div className="tw-stat-num">25-40%</div><div className="tw-stat-label">Fare Drop vs Peak</div></div>
                      <div className="tw-stat"><div className="tw-stat-num">Low</div><div className="tw-stat-label">Crowd Level</div></div>
                      <div className="tw-stat"><div className="tw-stat-num">35-50°F</div><div className="tw-stat-label">Avg Temp Europe</div></div>
                    </div>
                    <div className="tw-section-label">Why It Works</div>
                    <p className="tw-text">The window between American Thanksgiving and the Christmas travel surge is one of the least exploited in transatlantic travel. Airlines drop prices to fill seats during a period most Americans associate with staying home. European cities are entering their Christmas market season — Vienna, Prague, Munich, and Dresden all come alive with Gluhwein stands and hand-crafted ornaments — but the tourist hordes haven't arrived yet. You're getting the atmosphere without the crowds.</p>
                    <div className="tw-section-label">Proof Points</div>
                    <p className="tw-text">Dublin in late November averages 30% cheaper flights from ORD than the same route in June. Prague Christmas markets open November 30 most years — arrive the first week and you'll have the Old Town Square stalls practically to yourself. Vienna's Rathausplatz market runs late November through December 23, and hotel rates don't spike until December 10. Munich's Christkindlmarkt at Marienplatz opens the Friday before Advent — early arrivals get the magic before the weekend crush.</p>
                    <div className="tw-section-label">What People Get Wrong</div>
                    <p className="tw-text">They assume cold weather means bad travel. Wrong. Cold weather means fewer tourists, lower prices, and cozy pub culture at its best. Dublin in November is 45°F and drizzly — which is exactly when the pubs feel most alive. Prague in early December is 35°F — which is exactly when the mulled wine hits different. The cities that struggle in winter are beach destinations, not European capitals. If you're going to Barcelona for the beach, skip this window. If you're going for culture, nightlife, food, and markets, this is the move.</p>
                    <div className="tw-best-skip">
                      <div className="tw-best">
                        <div className="tw-best-title">Best For</div>
                        <div className="tw-best-list">Christmas markets (Vienna, Prague, Munich, Dresden). Pub culture (Dublin, Galway). City culture trips where weather doesn't matter. Budget-conscious groups who want Europe without peak pricing.</div>
                      </div>
                      <div className="tw-skip">
                        <div className="tw-skip-title">Skip If</div>
                        <div className="tw-skip-list">You want beach weather. You need guaranteed sunshine. You're going to Mediterranean destinations where off-season means closed restaurants and empty coastlines.</div>
                      </div>
                    </div>
                    <div className="tw-lads-take">
                      <div className="tw-lads-take-label">The Lads Take</div>
                      <div className="tw-lads-take-text">Brady went to Dublin in late November. The pubs were full of locals, the flights were cheap, and Temple Bar was actually walkable. Dawson's Iceland Ring Road worked in shoulder season. This window is for people who understand that the best version of a city isn't always the sunniest one.</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Window 2: Late April */}
              <div className={`tw-card`} onClick={() => toggleWindow(1)}>
                <div className="tw-card-header">
                  <div className="tw-card-header-left">
                    <div className="tw-window-name">Late April / Early May</div>
                    <div className="tw-tagline">The shoulder season sweet spot.</div>
                  </div>
                  <div className={`tw-chevron ${openWindow===1?'open':''}`}>&#9662;</div>
                </div>
                <div className={`tw-body ${openWindow===1?'open':''}`}>
                  <div className="tw-body-inner">
                    <div className="tw-stats">
                      <div className="tw-stat"><div className="tw-stat-num">20-35%</div><div className="tw-stat-label">Fare Drop vs Summer</div></div>
                      <div className="tw-stat"><div className="tw-stat-num">Medium</div><div className="tw-stat-label">Crowd Level</div></div>
                      <div className="tw-stat"><div className="tw-stat-num">55-70°F</div><div className="tw-stat-label">Avg Temp Europe</div></div>
                    </div>
                    <div className="tw-section-label">Why It Works</div>
                    <p className="tw-text">Spring shoulder season in Europe is the closest thing to a cheat code in travel. The weather is warming up — Rome hits 65°F, Barcelona is already in the low 70s, and Dublin is having its driest stretch of the year. But schools aren't out yet. American families are locked into the academic calendar, which means the tourist infrastructure is open and staffed but not overwhelmed. Airlines price this window below summer but above winter, creating a middle ground where you get 80% of the summer experience at 65% of the summer cost.</p>
                    <div className="tw-section-label">Proof Points</div>
                    <p className="tw-text">Rome in late April averages $680 round-trip from ORD versus $950 in July. Barcelona in early May has average highs of 68°F with roughly half the tourist volume of August. The Vatican in April has 40% shorter lines than June-August — the Sistine Chapel is actually viewable. Ireland in May is statistically its driest month, which most people don't know because they associate Ireland with rain year-round. Accommodation in Prague drops 25% compared to June bookings for the same properties.</p>
                    <div className="tw-section-label">What People Get Wrong</div>
                    <p className="tw-text">They wait for summer because it feels "safer." But summer in Southern Europe isn't comfortable — it's hot. Rome in July is 90°F and you're walking 8 miles a day through ancient ruins with no shade. Barcelona in August is a sweat lodge. The Mediterranean cities are actually better in late April and May: warm enough for outdoor dining, cool enough for all-day walking, and empty enough that you can get a table at the good restaurants without a reservation three weeks in advance.</p>
                    <div className="tw-best-skip">
                      <div className="tw-best">
                        <div className="tw-best-title">Best For</div>
                        <div className="tw-best-list">Mediterranean cities (Rome, Barcelona, Madrid). Ireland and UK (driest month). Culture-heavy itineraries with lots of walking. Groups who want good weather without summer pricing. Couples and small groups who prefer quieter experiences.</div>
                      </div>
                      <div className="tw-skip">
                        <div className="tw-skip-title">Skip If</div>
                        <div className="tw-skip-list">You need guaranteed beach weather above 80°F. You're going to Scandinavia or Iceland (still cold in April). You need school break alignment for family travel.</div>
                      </div>
                    </div>
                    <div className="tw-lads-take">
                      <div className="tw-lads-take-label">The Lads Take</div>
                      <div className="tw-lads-take-text">Both Brady and Dawson have traveled Europe in this window. The difference between late April Rome and July Rome is the difference between enjoying the Colosseum and enduring it. If your schedule allows it, this window gives you the best version of almost every European city.</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Window 3: August */}
              <div className={`tw-card`} onClick={() => toggleWindow(2)}>
                <div className="tw-card-header">
                  <div className="tw-card-header-left">
                    <div className="tw-window-name">August</div>
                    <div className="tw-tagline">Beach destinations only. Everything else is a trap.</div>
                  </div>
                  <div className={`tw-chevron ${openWindow===2?'open':''}`}>&#9662;</div>
                </div>
                <div className={`tw-body ${openWindow===2?'open':''}`}>
                  <div className="tw-body-inner">
                    <div className="tw-stats">
                      <div className="tw-stat"><div className="tw-stat-num">Peak</div><div className="tw-stat-label">European Pricing</div></div>
                      <div className="tw-stat"><div className="tw-stat-num">High</div><div className="tw-stat-label">Crowd Level</div></div>
                      <div className="tw-stat"><div className="tw-stat-num">75-95°F</div><div className="tw-stat-label">Avg Temp S. Europe</div></div>
                    </div>
                    <div className="tw-section-label">Why It Works — For the Right Destinations</div>
                    <p className="tw-text">August is the single most overbooked month in European travel. Every American family with school-age kids is competing for the same flights, the same hotels, and the same restaurant tables. City trips to Rome, Paris, and Barcelona in August are genuinely unpleasant — 95°F heat, three-hour museum lines, and prices inflated 40% above shoulder season. But August is also when certain destinations peak in exactly the right way. Beach destinations — Greek islands, Croatia, the Dalmatian Coast, Thailand's Gulf side — are built for August. Poland in August is warm, cheap, and uncrowded by Western European standards because everyone's heading south.</p>
                    <div className="tw-section-label">Proof Points</div>
                    <p className="tw-text">Poland flights from ORD in August average $620 on LOT direct — compared to $850-950 for Western European capitals. Krakow in August averages 77°F, which is warm but not punishing. Gdansk has Baltic beaches that feel like a secret — warm enough to swim, empty enough to breathe. Thailand's Koh Samui and Koh Phangan are in dry season on the Gulf side in August while the Andaman coast (Phuket, Krabi) gets monsoon rain. The smart August move is geographic arbitrage: go where Europeans aren't going.</p>
                    <div className="tw-section-label">What People Get Wrong</div>
                    <p className="tw-text">They treat August as a default. "We'll go to Europe in August" is the most expensive sentence in travel planning. August in Rome means 90°F at 9am, a two-hour wait for the Vatican, and €18 Aperol Spritzes on every tourist-facing piazza. August in Barcelona means La Rambla is literally shoulder-to-shoulder. The mistake is going to cities designed for walking and outdoor dining during the month when walking and outdoor dining are miserable. August works when the destination is built around water, not cobblestones.</p>
                    <div className="tw-best-skip">
                      <div className="tw-best">
                        <div className="tw-best-title">Best For</div>
                        <div className="tw-best-list">Poland (warm, cheap, uncrowded). Beach destinations (Greek islands, Croatia). Thailand Gulf coast (dry season). Groups locked into summer schedules who pick the right destinations. Eastern Europe broadly — the crowds thin dramatically east of Vienna.</div>
                      </div>
                      <div className="tw-skip">
                        <div className="tw-skip-title">Skip If</div>
                        <div className="tw-skip-list">You're going to Rome, Paris, Barcelona, or any Western European capital. You hate heat. You want value — August is peak pricing almost everywhere west of Prague. You don't have a specific beach or Eastern European destination in mind.</div>
                      </div>
                    </div>
                    <div className="tw-lads-take">
                      <div className="tw-lads-take-label">The Lads Take</div>
                      <div className="tw-lads-take-text">We built the Poland framework specifically for August because it's the contrarian play. Everyone's fighting over overpriced Western European capitals while Krakow, Warsaw, and Gdansk are sitting there with direct flights from ORD, world-class nightlife, and per-day costs that make Dublin look expensive. August isn't bad — August in the wrong place is bad.</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Window 4: Late August / September — THE WINNER */}
              <div className={`tw-card tw-gold`} onClick={() => toggleWindow(3)}>
                <div className="tw-card-header">
                  <div className="tw-card-header-left">
                    <div className="tw-winner-badge">#1 Recommendation</div>
                    <div className="tw-window-name" style={{color:'var(--gold)'}}>Late August / September Post-Labor Day</div>
                    <div className="tw-tagline">The overall winner. Crowds vanish, prices follow, weather stays excellent.</div>
                  </div>
                  <div className={`tw-chevron ${openWindow===3?'open':''}`}>&#9662;</div>
                </div>
                <div className={`tw-body ${openWindow===3?'open':''}`}>
                  <div className="tw-body-inner">
                    <div className="tw-stats">
                      <div className="tw-stat"><div className="tw-stat-num">30-45%</div><div className="tw-stat-label">Fare Drop vs July</div></div>
                      <div className="tw-stat"><div className="tw-stat-num">Low-Med</div><div className="tw-stat-label">Crowd Level</div></div>
                      <div className="tw-stat"><div className="tw-stat-num">65-80°F</div><div className="tw-stat-label">Avg Temp Europe</div></div>
                    </div>
                    <div className="tw-section-label">Why It Works</div>
                    <p className="tw-text">This is the single best travel window in the calendar and it's not close. The moment American kids go back to school, the entire European travel infrastructure exhales. Flights drop 30-45% from July peaks. Hotels that were sold out in August suddenly have availability. Restaurants in Rome and Barcelona go from "reservation required three weeks out" to "walk in and sit down." But here's the key: the weather hasn't changed. September in Barcelona is 78°F. September in Rome is 75°F. September in Dublin is 60°F with the longest dry stretch still holding. You're getting July weather at October prices.</p>
                    <div className="tw-section-label">Proof Points</div>
                    <p className="tw-text">ORD to Barcelona in September averages $580 round-trip versus $880 in July — a 34% drop for essentially identical weather. Rome accommodation in September runs 35% below August rates at the same properties. The Vatican in September has average wait times of 25 minutes versus 90+ in July. Munich in late September means Oktoberfest — the world's largest folk festival with 6 million annual visitors, but strategic tent choices and weekday timing make it manageable. Iceland in September offers the overlap window: still enough daylight for full Ring Road days, but dark enough at night for early Northern Lights season.</p>
                    <div className="tw-section-label">What People Get Wrong</div>
                    <p className="tw-text">They think September is "too late." This is the biggest misconception in European travel. September in Southern Europe is summer. September in Central Europe is early fall at worst — still warm, still sunny, still outdoor dining weather. The only destinations where September gets genuinely dicey are Nordic countries and high-altitude Alpine routes, where shorter days and dropping temperatures start to limit options. For everything else — Mediterranean, Western Europe, Eastern Europe, even Ireland — September is objectively the best month to travel. The data backs it up across every metric we track: price, weather, crowds, and availability.</p>
                    <div className="tw-best-skip">
                      <div className="tw-best">
                        <div className="tw-best-title">Best For</div>
                        <div className="tw-best-list">Literally everything except Nordic/Scandinavian trips. Rome, Barcelona, Madrid, Dublin, Prague, Vienna, Munich (especially Oktoberfest), Poland, Croatia, Greece. Multi-city trips using open-jaw routing. Groups with flexible schedules who aren't locked into school calendars. Budget-conscious travelers who want premium experiences at shoulder-season prices.</div>
                      </div>
                      <div className="tw-skip">
                        <div className="tw-skip-title">Skip If</div>
                        <div className="tw-skip-list">You're locked into a school calendar. You're going to Iceland for Midnight Sun (that's June). You're doing high-altitude Alpine hiking where snow starts early. You need the absolute cheapest flights (late November still beats September on price alone).</div>
                      </div>
                    </div>
                    <div className="tw-lads-take">
                      <div className="tw-lads-take-label">The Lads Take</div>
                      <div className="tw-lads-take-text">If someone asks us "when should I go to Europe?" without any other constraints, the answer is always mid-September. Every time. We built the Munich Oktoberfest framework around late September specifically because it's the convergence point: the festival, the weather, the pricing, and the crowd levels all align perfectly. September is the answer to the question most travelers don't know to ask: "When does Europe stop being a tourist destination and start being a place you can actually experience?"</div>
                    </div>
                  </div>
                </div>
              </div>
    </>
  );
}

/* ===== FLIGHT INTELLIGENCE INLINE JSX ===== */
function FLIGHT_INTEL_JSX(openFlight, toggleFlight, openMyth, toggleMyth) {
  return (
    <>
            {/* Group 1: Understanding the Machine */}
            <div className="fi-group-label">Understanding the Machine</div>

            {/* Card 1 */}
            <div className="fi-card" onClick={() => toggleFlight(0)}>
              <div className="fi-card-header">
                <div className="fi-card-num">01</div>
                <div className="fi-card-title">How Airline Pricing Works</div>
                <div className={`tw-chevron ${openFlight===0?'open':''}`}>&#9662;</div>
              </div>
              <div className={`fi-body ${openFlight===0?'open':''}`}>
                <div className="fi-body-inner">
                  <p className="fi-text">Airlines use dynamic pricing algorithms that adjust fares based on demand, competition, time to departure, day of week, and historical booking patterns. A seat on the same flight can cost $400 or $1,200 depending on when you book, how full the plane is, and what fare class is currently available. There is no single "best price" — there's a price curve, and our job is to help you book at the right point on that curve.</p>
                  <p className="fi-text">The key concept is fare classes. Every flight has multiple fare buckets (Y, B, M, H, K, L, Q, etc.) with different prices and rules. As cheap buckets sell out, the algorithm moves to the next tier. This is why prices "jump" — you didn't miss a sale, you missed a fare class. Understanding this lets us monitor when cheap buckets open back up, which happens more often than people think, especially on competitive routes.</p>
                  <p className="fi-text">Airlines also practice market segmentation. They charge different prices on different routes based on competition. ORD to Dublin is cheaper than DTW to Dublin because ORD has Aer Lingus competing with United and American. DTW to Dublin requires a connection, which means less competition and higher fares. We use this to recommend originating airports — sometimes driving to O'Hare saves $300 per person.</p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="fi-card" onClick={() => toggleFlight(1)}>
              <div className="fi-card-header">
                <div className="fi-card-num">02</div>
                <div className="fi-card-title">The Booking Window</div>
                <div className={`tw-chevron ${openFlight===1?'open':''}`}>&#9662;</div>
              </div>
              <div className={`fi-body ${openFlight===1?'open':''}`}>
                <div className="fi-body-inner">
                  <p className="fi-text">The optimal booking window for international flights is 6-10 weeks before departure for economy, 4-8 weeks for off-peak seasons, and 8-14 weeks for peak summer travel. This isn't opinion — it's based on fare data across thousands of routes. Book too early (6+ months out) and you're paying the "certainty premium" — airlines know early bookers value guaranteed seats. Book too late (under 3 weeks) and you're paying the "desperation premium."</p>
                  <p className="fi-text">The sweet spot exists because airlines need to fill planes. Around 6-10 weeks out, they have enough data on booking pace to know if a flight is underselling. If it is, they open cheaper fare classes to stimulate demand. This is when you pounce. We track routes our clients are interested in and alert them when fares dip below our target thresholds.</p>
                  <p className="fi-text">For example: Poland in August 2026 is roughly 3 months out right now. LOT Polish Airlines runs a direct ORD-WAW route. Historical data shows this route drops to $550-650 range about 8 weeks before departure. Right now it's sitting at $720. We're watching it. When it drops, we tell you to book. That's the service — not just finding the flight, but timing the purchase.</p>
                </div>
              </div>
            </div>

            {/* Group 2: The Tools We Actually Use */}
            <div className="fi-group-label">The Tools We Actually Use</div>

            {/* Card 3 */}
            <div className="fi-card" onClick={() => toggleFlight(2)}>
              <div className="fi-card-header">
                <div className="fi-card-num">03</div>
                <div className="fi-card-title">Google Flights</div>
                <div className={`tw-chevron ${openFlight===2?'open':''}`}>&#9662;</div>
              </div>
              <div className={`fi-body ${openFlight===2?'open':''}`}>
                <div className="fi-body-inner">
                  <p className="fi-text">Google Flights is the single best flight search tool available and it's free. Not Skyscanner, not Kayak, not Hopper — Google Flights. Here's why: it searches direct airline inventory, it shows fare calendars with date flexibility, it has a built-in price tracking feature that actually works, and it displays the full fare breakdown including bags. Every other tool is either scraping Google Flights data with a delay or showing you cached prices.</p>
                  <p className="fi-text">The features most people miss: the "Explore" map (shows cheapest destinations from your airport), the date grid (shows fare variations across a two-month window), the price graph (shows historical pricing for your route), and the tracking alert (emails you when your saved route drops). We use all four of these for every client. The date grid alone has saved our clients thousands — shifting departure by two days can drop fares 20-30% on competitive routes.</p>
                  <p className="fi-text">The one limitation: Google Flights doesn't always show budget carriers (Ryanair within Europe, for example). For intra-European segments, we supplement with Skyscanner. But for the transatlantic leg — the expensive part — Google Flights is the tool.</p>
                </div>
              </div>
            </div>

            {/* Card 4 */}
            <div className="fi-card" onClick={() => toggleFlight(3)}>
              <div className="fi-card-header">
                <div className="fi-card-num">04</div>
                <div className="fi-card-title">Error Fares</div>
                <div className={`tw-chevron ${openFlight===3?'open':''}`}>&#9662;</div>
              </div>
              <div className={`fi-body ${openFlight===3?'open':''}`}>
                <div className="fi-body-inner">
                  <p className="fi-text">Error fares happen when airlines accidentally publish incorrect prices — usually due to currency conversion mistakes, fare filing errors, or IT glitches. A $900 flight to Rome might appear for $280. These are real bookable fares and airlines honor them roughly 70% of the time (US DOT guidelines generally require airlines to honor purchased tickets). The catch: they disappear within hours, sometimes minutes.</p>
                  <p className="fi-text">We monitor error fare sources including Secret Flying, The Points Guy error fare alerts, Scott's Cheap Flights (now Going), and a few private deal communities. When an error fare appears on a route relevant to a client, we alert immediately. The window is usually 2-6 hours. You need to book first and ask questions later — most error fares are refundable for 24 hours under DOT rules, so there's no risk in grabbing one and canceling if it doesn't work for your schedule.</p>
                  <p className="fi-text">Error fares are unpredictable by nature, so we never build a framework assuming one will appear. But when they do, they can cut the flight budget by 50-70%. We treat them as found money — nice when they happen, not something to wait for.</p>
                </div>
              </div>
            </div>

            {/* Card 5 */}
            <div className="fi-card" onClick={() => toggleFlight(4)}>
              <div className="fi-card-header">
                <div className="fi-card-num">05</div>
                <div className="fi-card-title">Flexible Dates</div>
                <div className={`tw-chevron ${openFlight===4?'open':''}`}>&#9662;</div>
              </div>
              <div className={`fi-body ${openFlight===4?'open':''}`}>
                <div className="fi-body-inner">
                  <p className="fi-text">Date flexibility is the single most powerful lever you have in flight pricing. A Tuesday departure instead of Friday can save $150-300 per person on transatlantic routes. Mid-week flights (Tuesday, Wednesday, Thursday) are consistently cheaper because business travelers fly Monday and Friday, inflating demand on those days. The algorithm knows weekend departures carry leisure premium — and charges for it.</p>
                  <p className="fi-text">We use Google Flights' date grid to map the full fare landscape for every route. For the Poland August framework, shifting departure from Friday August 7 to Tuesday August 4 dropped the fare $180 per person on the same LOT direct flight. For a group of 6, that's $1,080 saved by moving three days. This is the kind of intelligence that goes into every framework — not just "here's a flight," but "here's why this specific date on this specific day of the week is the right booking."</p>
                  <p className="fi-text">The other date lever: return flight timing. Flying back on a Tuesday or Wednesday after a weekend saves another $100-200. Most groups want to "maximize the trip" by flying back Sunday — but Sunday returns are the most expensive day of the week. Fly back Tuesday morning, gain two more days, and pay less for the flight. It's counterintuitive until you see the numbers.</p>
                </div>
              </div>
            </div>

            {/* Group 3: Routing Strategies */}
            <div className="fi-group-label">Routing Strategies</div>

            {/* Card 6 */}
            <div className="fi-card" onClick={() => toggleFlight(5)}>
              <div className="fi-card-header">
                <div className="fi-card-num">06</div>
                <div className="fi-card-title">Open-Jaw Routing</div>
                <div className={`tw-chevron ${openFlight===5?'open':''}`}>&#9662;</div>
              </div>
              <div className={`fi-body ${openFlight===5?'open':''}`}>
                <div className="fi-body-inner">
                  <p className="fi-text">Open-jaw means flying into one city and out of another. Instead of round-trip Chicago to Rome, you fly Chicago to Rome and Barcelona to Chicago. This eliminates the "backtrack" — the wasted day and money spent getting back to your origin city. For multi-city European trips, open-jaw routing saves an average of $200-400 per person compared to round-trip plus intra-European positioning flights.</p>
                  <p className="fi-text">Google Flights supports open-jaw searches natively (use the "Multi-city" option). We build every multi-destination framework with open-jaw as the default routing assumption. The Spain framework, for example, routes Chicago to Barcelona, then Madrid to Chicago — which lets you take a $15 Renfe train from Barcelona to Madrid instead of flying back to Barcelona for your return flight. The Italy framework could route into Rome and out of Milan if you're adding Florence and the north.</p>
                  <p className="fi-text">The one complexity: open-jaw fares are sometimes slightly higher per leg than round-trip fares to a single city. But the total trip cost is almost always lower because you eliminate an intra-European flight ($60-150 on budget carriers, plus airport time, plus the stress of an extra flight). We run both scenarios for every client and show the math.</p>
                </div>
              </div>
            </div>

            {/* Card 7 */}
            <div className="fi-card" onClick={() => toggleFlight(6)}>
              <div className="fi-card-header">
                <div className="fi-card-num">07</div>
                <div className="fi-card-title">Hub Arbitrage</div>
                <div className={`tw-chevron ${openFlight===6?'open':''}`}>&#9662;</div>
              </div>
              <div className={`fi-body ${openFlight===6?'open':''}`}>
                <div className="fi-body-inner">
                  <p className="fi-text">Hub arbitrage exploits the price difference between originating airports. ORD (O'Hare) and DTW (Detroit Metro) are our two primary departure hubs, and the fare differences between them can be dramatic. ORD is a major international hub with direct competition from United, American, Aer Lingus, LOT, Lufthansa, and others. DTW is a Delta fortress hub with less international competition, which means higher base fares on most European routes.</p>
                  <p className="fi-text">For Michigan-based clients, the decision between DTW and ORD is a real cost calculation. ORD is a 4-hour drive or a $80 Amtrak from Kalamazoo/Grand Rapids. If the fare difference is $200+ per person, driving to ORD pays for itself for groups of 2 or more. We run both airports for every client and include the ground transportation math.</p>
                  <table className="fi-table">
                    <thead><tr><th>Route</th><th>From ORD</th><th>From DTW</th><th>Savings</th></tr></thead>
                    <tbody>
                      <tr><td>Dublin</td><td>$480-550</td><td>$650-780</td><td>$170-230</td></tr>
                      <tr><td>Rome</td><td>$580-680</td><td>$720-850</td><td>$140-170</td></tr>
                      <tr><td>Barcelona</td><td>$520-620</td><td>$680-800</td><td>$160-180</td></tr>
                      <tr><td>Warsaw (LOT Direct)</td><td>$550-650</td><td>$750-900</td><td>$200-250</td></tr>
                      <tr><td>Bangkok</td><td>$680-850</td><td>$800-1000</td><td>$120-150</td></tr>
                      <tr><td>Reykjavik</td><td>$380-480</td><td>$520-650</td><td>$140-170</td></tr>
                    </tbody>
                  </table>
                  <p className="fi-text">These are September shoulder-season estimates based on our tracking data. Peak summer adds $150-300 to both columns. The pattern holds: ORD is almost always cheaper for European destinations because of direct route competition.</p>
                </div>
              </div>
            </div>

            {/* Card 8 */}
            <div className="fi-card" onClick={() => toggleFlight(7)}>
              <div className="fi-card-header">
                <div className="fi-card-num">08</div>
                <div className="fi-card-title">Group Booking Splits</div>
                <div className={`tw-chevron ${openFlight===7?'open':''}`}>&#9662;</div>
              </div>
              <div className={`fi-body ${openFlight===7?'open':''}`}>
                <div className="fi-body-inner">
                  <p className="fi-text">When you search for 6 seats on a flight, the algorithm returns the price of the most expensive fare class that has 6 seats available. If there are 3 seats at $520 and 3 seats at $680, all 6 show as $680. This is how airlines extract maximum revenue from groups — and it's why group travel feels disproportionately expensive compared to booking as a couple.</p>
                  <p className="fi-text">The fix: split the booking. Search for 2 seats at a time instead of 6. Book the cheap fare class in pairs until it sells out, then book the remainder at the next tier. For the Munich Oktoberfest framework (groups of 4-10), we consistently find $80-150 per person savings by splitting group bookings into pairs. On a group of 8, that's $640-1,200 in total savings — real money that goes toward accommodation or experiences instead.</p>
                  <p className="fi-text">The risk: split bookings mean separate reservations, which can complicate seat assignments and schedule changes. If the airline cancels or reschedules, passengers on different reservations may get rebooked differently. We mitigate this by booking the same flight for all pairs and checking in together. For the savings involved, the minor coordination overhead is worth it every time.</p>
                </div>
              </div>
            </div>

            {/* Group 4: Money Strategies */}
            <div className="fi-group-label">Money Strategies</div>

            {/* Card 9 */}
            <div className="fi-card" onClick={() => toggleFlight(8)}>
              <div className="fi-card-header">
                <div className="fi-card-num">09</div>
                <div className="fi-card-title">Credit Card Bonuses</div>
                <div className={`tw-chevron ${openFlight===8?'open':''}`}>&#9662;</div>
              </div>
              <div className={`fi-body ${openFlight===8?'open':''}`}>
                <div className="fi-body-inner">
                  <p className="fi-text">The single fastest way to reduce flight costs is a travel credit card signup bonus. The Chase Sapphire Preferred currently offers 60,000 Ultimate Rewards points after $4,000 spend in 3 months. Those 60,000 points are worth $750 when redeemed through Chase Travel or transferred to airline partners. The $95 annual fee is waived the first year. Net value: $750 in travel credit for spending money you were going to spend anyway.</p>
                  <p className="fi-text">For groups, the math scales: if 3 people in a group of 6 each open a card and hit the bonus, that's $2,250 in combined travel credit — enough to cover half the group's flights to Europe. We include credit card strategy in every framework where the group has 3+ months before departure (time needed to apply, receive the card, and hit the spending threshold). We never recommend cards with fees that don't pay for themselves.</p>
                  <p className="fi-text">Transfer partners matter. Chase points transfer 1:1 to United, Hyatt, Southwest, British Airways, and others. Amex points transfer to Delta, Air France/KLM, and British Airways. The right card depends on which airline serves your route. For ORD-based clients flying to Europe, Chase Sapphire is almost always the pick because of the United transfer partnership.</p>
                </div>
              </div>
            </div>

            {/* Card 10 */}
            <div className="fi-card" onClick={() => toggleFlight(9)}>
              <div className="fi-card-header">
                <div className="fi-card-num">10</div>
                <div className="fi-card-title">Seasonal Sales</div>
                <div className={`tw-chevron ${openFlight===9?'open':''}`}>&#9662;</div>
              </div>
              <div className={`fi-body ${openFlight===9?'open':''}`}>
                <div className="fi-body-inner">
                  <p className="fi-text">Airlines run predictable sales cycles. January through early March is "sale season" — airlines dump inventory for spring and summer travel at reduced prices to stimulate early bookings and generate cash flow after the holiday spending slump. The other reliable window is late August through September, when airlines discount fall and winter travel. These aren't random — they're structural features of the airline revenue cycle.</p>
                  <p className="fi-text">The specific sales to watch: Aer Lingus runs a January transatlantic sale almost every year with fares 20-30% below normal. LOT Polish Airlines discounts ORD-Warsaw fares in late February. Norwegian (when operating) runs flash sales on long-haul routes. WOW Air's successor Play runs Iceland sales in January. We track these cycles and alert clients when relevant sales appear for their target routes.</p>
                  <p className="fi-text">The trap: don't wait for a sale if you're already seeing a good fare. Sales discount from regular pricing, but if regular pricing is already low due to competition or low demand, the sale price might not materialize — the fare is already as low as it's going. We've seen clients wait for a "sale" while watching a $520 fare climb to $680 because they thought it would go lower. If a fare is at or below our target threshold for that route, we say book it regardless of sale timing.</p>
                </div>
              </div>
            </div>

            {/* Card 11 */}
            <div className="fi-card" onClick={() => toggleFlight(10)}>
              <div className="fi-card-header">
                <div className="fi-card-num">11</div>
                <div className="fi-card-title">Fare Class Monitoring</div>
                <div className={`tw-chevron ${openFlight===10?'open':''}`}>&#9662;</div>
              </div>
              <div className={`fi-body ${openFlight===10?'open':''}`}>
                <div className="fi-body-inner">
                  <p className="fi-text">Fare classes are the hidden layer of airline pricing. Every flight has multiple booking classes — from full-fare Y class down to deep-discount Q class — and the algorithm opens and closes these classes based on demand forecasting. When a cheap class sells out, the price jumps to the next tier. When the airline realizes a flight is underselling, it reopens cheap classes. These fluctuations happen daily, sometimes hourly.</p>
                  <p className="fi-text">We monitor fare classes using Google Flights price tracking, ExpertFlyer (for detailed class availability), and manual spot-checks. When a cheap fare class reopens on a route we're tracking for a client, we alert immediately. This is particularly valuable for popular routes like ORD-Dublin or ORD-Barcelona where fare classes turn over quickly. The difference between booking in L class versus H class on the same United flight can be $200+ per person.</p>
                  <p className="fi-text">For the Poland August framework, we're currently tracking LOT's ORD-WAW direct flight in fare classes L and K. L class is showing $620 — our target is under $600. Historical data suggests L class availability will increase around 8 weeks before departure as LOT adjusts capacity. We'll alert when it hits. This kind of route-specific, class-specific monitoring is what separates our flight intelligence from "just search Google Flights yourself."</p>
                </div>
              </div>
            </div>

            {/* Myths Section */}
            <div className="fi-group-label" style={{color:'#a05050'}}>Myths We Hear All the Time</div>

            {/* Myth 1 */}
            <div className="fi-myth-card" onClick={() => toggleMyth(0)}>
              <div className="fi-myth-header">
                <div>
                  <div className="fi-myth-label">Myth</div>
                  <div className="fi-myth-title">"Incognito mode gets you cheaper flights"</div>
                </div>
                <div className={`tw-chevron ${openMyth===0?'open':''}`}>&#9662;</div>
              </div>
              <div className={`fi-myth-body ${openMyth===0?'open':''}`}>
                <div className="fi-myth-body-inner">
                  <p className="fi-text">This was marginally true in 2012. It's not true now. Airlines don't use browser cookies to inflate prices on repeat searches — they use demand-based algorithmic pricing that's the same regardless of your browser mode. The price changes you see between searches are real-time fare class adjustments, not cookie manipulation. We've tested this extensively. Search the same route in Chrome, Firefox, incognito, and a VPN — you get the same prices within seconds of each other. Save your energy for strategies that actually work.</p>
                </div>
              </div>
            </div>

            {/* Myth 2 */}
            <div className="fi-myth-card" onClick={() => toggleMyth(1)}>
              <div className="fi-myth-header">
                <div>
                  <div className="fi-myth-label">Myth</div>
                  <div className="fi-myth-title">"Tuesday is always the cheapest day to book"</div>
                </div>
                <div className={`tw-chevron ${openMyth===1?'open':''}`}>&#9662;</div>
              </div>
              <div className={`fi-myth-body ${openMyth===1?'open':''}`}>
                <div className="fi-myth-body-inner">
                  <p className="fi-text">This advice comes from a 2014 study that's been misquoted ever since. The original finding was that airlines were more likely to file new fares on Tuesday, which occasionally resulted in lower prices mid-week. But modern dynamic pricing adjusts fares continuously — not on a weekly schedule. There is no statistically significant cheapest day to purchase a ticket. What matters is the booking window (how far from departure) and fare class availability (which changes hourly), not what day of the week you happen to open your laptop. Tuesday is the cheapest day to fly, not to book. Those are different things.</p>
                </div>
              </div>
            </div>

            {/* Myth 3 */}
            <div className="fi-myth-card" onClick={() => toggleMyth(2)}>
              <div className="fi-myth-header">
                <div>
                  <div className="fi-myth-label">Myth</div>
                  <div className="fi-myth-title">"Book as early as possible for the best price"</div>
                </div>
                <div className={`tw-chevron ${openMyth===2?'open':''}`}>&#9662;</div>
              </div>
              <div className={`fi-myth-body ${openMyth===2?'open':''}`}>
                <div className="fi-myth-body-inner">
                  <p className="fi-text">Booking 6+ months in advance almost always means overpaying. Airlines know that early bookers value certainty — the guarantee of a confirmed seat — and they price accordingly. The cheapest fares don't appear until airlines can forecast demand for a specific departure, which requires enough booking data to model. That data doesn't exist until 6-10 weeks before departure for most international routes. Booking 8 months out means paying a "peace of mind" premium of $100-300 per person. The exception: peak holiday travel (Christmas, Spring Break) on limited-capacity routes where early booking is necessary to ensure availability. For everything else, patience pays.</p>
                </div>
              </div>
            </div>

            {/* Myth 4 */}
            <div className="fi-myth-card" onClick={() => toggleMyth(3)}>
              <div className="fi-myth-header">
                <div>
                  <div className="fi-myth-label">Myth</div>
                  <div className="fi-myth-title">"Use a VPN to get prices from other countries"</div>
                </div>
                <div className={`tw-chevron ${openMyth===3?'open':''}`}>&#9662;</div>
              </div>
              <div className={`fi-myth-body ${openMyth===3?'open':''}`}>
                <div className="fi-myth-body-inner">
                  <p className="fi-text">This one has a kernel of truth but is mostly impractical. Yes, airline websites sometimes display different prices based on the point-of-sale country because of currency conversion, local market pricing, and regional promotions. But modern OTAs and Google Flights normalize pricing effectively. The rare cases where VPN routing saves money are typically on domestic flights within other countries or on airlines with separate regional pricing engines. For transatlantic flights from the US, the price you see on Google Flights from a US IP is the price. The effort spent fiddling with VPNs and foreign-language booking pages is almost never worth the marginal savings. Focus on timing, flexibility, and routing instead.</p>
                </div>
              </div>
            </div>

    </>
  );
}

/* ===== WHAT YOU GET INLINE JSX ===== */
function WYG_JSX(openDeliverable, toggleDeliverable, quizVibe, setQuizVibe, quizGroup, setQuizGroup, quizBudget, setQuizBudget, quizResult, resetQuiz) {
  return (
    <>
              {/* Deliverable 1: HTML Trip Framework */}
              <div className="wyg-card" onClick={() => toggleDeliverable(0)}>
                <div className="wyg-header">
                  <div className="wyg-num">01</div>
                  <div className="wyg-header-text">
                    <div className="wyg-title">Custom HTML Trip Framework</div>
                    <div className="wyg-subtitle">A designed, mobile-optimized trip plan. Not a PDF. Not a Google Doc.</div>
                  </div>
                  <div className={`tw-chevron ${openDeliverable===0?'open':''}`}>&#9662;</div>
                </div>
                <div className={`wyg-body ${openDeliverable===0?'open':''}`}>
                  <div className="wyg-body-inner">
                    <p className="wyg-text">Every client receives a custom-built HTML document designed specifically for their trip. This isn't a template — each framework has its own visual identity, color palette, and content structure tailored to the destination. It works on your phone, your laptop, and your tablet. It loads instantly because there's no app to download and no account to create. Open the link, and your entire trip plan is there.</p>
                    <p className="wyg-text">Each framework includes: neighborhood-by-neighborhood breakdowns with honest assessments, cost models with per-person and per-day projections, day-by-day itinerary suggestions (not rigid schedules — options), accommodation strategy with specific property recommendations, restaurant and bar tiers from "validated favorites" to "research picks," day trip logistics with bookable links, and a "What First-Timers Get Wrong" section that saves you from the mistakes we see every group make.</p>
                    <p className="wyg-text">The framework is yours permanently. No subscription, no expiration. We update frameworks when prices or venues change, and you always have access to the latest version via the same link.</p>
                    <div className="wyg-example">
                      <div className="wyg-example-label">Real Example: Munich Oktoberfest Framework</div>
                      <div className="wyg-example-text">The Munich framework includes tent-by-tent strategy for Oktoberfest (Augustiner-Brau for locals, Hofbrau for first-timers), a Glockenbachviertel neighborhood base recommendation, complete cost models for groups of 4, 6, 8, and 10, and a "What First-Timers Get Wrong" section covering reservation timing, tent capacity, and the Sunday morning strategy. It's 40+ pages of actionable intelligence in a format that works on your phone at the beer hall.</div>
                    </div>
                    <div style={{marginTop:16}}>
                      <a href="munich.html" target="_blank" rel="noopener noreferrer" className="btn btn-primary">View Munich Framework →</a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Deliverable 2: Flight Intelligence */}
              <div className="wyg-card" onClick={() => toggleDeliverable(1)}>
                <div className="wyg-header">
                  <div className="wyg-num">02</div>
                  <div className="wyg-header-text">
                    <div className="wyg-title">Flight Intelligence Report</div>
                    <div className="wyg-subtitle">Route analysis, booking windows, and fare monitoring for your specific trip.</div>
                  </div>
                  <div className={`tw-chevron ${openDeliverable===1?'open':''}`}>&#9662;</div>
                </div>
                <div className={`wyg-body ${openDeliverable===1?'open':''}`}>
                  <div className="wyg-body-inner">
                    <p className="wyg-text">We analyze the specific routes for your trip: which airlines fly direct, which connections are worth considering, which airports to originate from (ORD vs DTW), and when to book based on historical fare data for that route. This isn't generic "book 6 weeks in advance" advice — it's route-specific, date-specific, and fare-class-specific intelligence.</p>
                    <p className="wyg-text">The flight report includes: recommended booking window based on historical fare curves for your route, target price thresholds (what's a "good" fare for this route in this season), originating airport comparison with ground transportation math, open-jaw routing options for multi-city trips, group booking split strategy if applicable, and credit card bonus recommendations aligned to your timeline.</p>
                    <p className="wyg-text">After delivery, we continue monitoring your route until you book. If fares drop below our target threshold or an error fare appears, you'll hear from us. This is ongoing — not a one-time report.</p>
                    <div className="wyg-example">
                      <div className="wyg-example-label">Real Example: Poland August Flight Intelligence</div>
                      <div className="wyg-example-text">For the Poland August framework, the flight intelligence identifies LOT Polish Airlines' direct ORD-WAW route as the primary option ($550-650 target range), shows that DTW routing adds $150-250 per person with a connection penalty, recommends booking 6-8 weeks before departure based on LOT's historical pricing curve for summer Warsaw flights, and includes a group split strategy for parties of 6+ that saves $80-120 per person. We're currently tracking fare class L availability and will alert when it hits our target.</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Deliverable 3: Google Maps Lists */}
              <div className="wyg-card" onClick={() => toggleDeliverable(2)}>
                <div className="wyg-header">
                  <div className="wyg-num">03</div>
                  <div className="wyg-header-text">
                    <div className="wyg-title">Google Maps Lists</div>
                    <div className="wyg-subtitle">Every spot we've validated or researched, organized and saved to your phone.</div>
                  </div>
                  <div className={`tw-chevron ${openDeliverable===2?'open':''}`}>&#9662;</div>
                </div>
                <div className={`wyg-body ${openDeliverable===2?'open':''}`}>
                  <div className="wyg-body-inner">
                    <p className="wyg-text">Frameworks are for planning. Google Maps lists are for the ground. Every destination in our portfolio has organized, saved Google Maps lists that you can open on your phone and navigate to directly. No searching, no scrolling through blog posts, no screenshots of recommendation lists. Tap a pin, get walking directions, arrive at a place we've either been to personally or vetted through our research system.</p>
                    <p className="wyg-text">The lists are organized by category (pubs and food, attractions, bars, etc.) and by city. For destinations with multiple cities (Spain covers Barcelona and Madrid, Ireland covers Dublin and Galway), each city gets its own organized lists. We currently maintain 18 active Google Maps lists across 10 destinations, covering 650+ individual spots.</p>
                    <p className="wyg-text">When you receive your framework, you'll get links to every relevant Google Maps list. Save them to your phone before the trip. On the ground, you'll always have a validated spot within walking distance — no matter what neighborhood you're in.</p>
                    <div className="wyg-maps-grid">
                      <a href="https://maps.app.goo.gl/NrZtg6tUR1Rjk8oS8" target="_blank" rel="noopener noreferrer" className="wyg-map-link">Dublin Pubs & Food</a>
                      <a href="https://maps.app.goo.gl/9YLakDkjrE6jj7cQA" target="_blank" rel="noopener noreferrer" className="wyg-map-link">Dublin Attractions</a>
                      <a href="https://maps.app.goo.gl/deRD11SQis6ZUsKL8" target="_blank" rel="noopener noreferrer" className="wyg-map-link">Galway</a>
                      <a href="https://maps.app.goo.gl/kmFjNeA6k8BHuHWT8" target="_blank" rel="noopener noreferrer" className="wyg-map-link">Rome Food & Drink</a>
                      <a href="https://maps.app.goo.gl/RAS5mqRhc6BYTa5D6" target="_blank" rel="noopener noreferrer" className="wyg-map-link">Rome Attractions</a>
                      <a href="https://maps.app.goo.gl/bZp95gDP9VwBe6Kd7" target="_blank" rel="noopener noreferrer" className="wyg-map-link">Barcelona Food</a>
                      <a href="https://maps.app.goo.gl/2LZGLZQEuT53NK3Z8" target="_blank" rel="noopener noreferrer" className="wyg-map-link">Barcelona Bars</a>
                      <a href="https://maps.app.goo.gl/63o5dgY5Fr8SJUZk6" target="_blank" rel="noopener noreferrer" className="wyg-map-link">Barcelona Attractions</a>
                      <a href="https://maps.app.goo.gl/hc199wu19C6cKj9G6" target="_blank" rel="noopener noreferrer" className="wyg-map-link">Jaco, Costa Rica</a>
                      <a href="https://maps.app.goo.gl/ZWM8LXFGV9QpS8fB7" target="_blank" rel="noopener noreferrer" className="wyg-map-link">San Juan</a>
                      <a href="https://maps.app.goo.gl/Fr7KdvoLsnXeBV1q8" target="_blank" rel="noopener noreferrer" className="wyg-map-link">Seattle + Olympic</a>
                      <a href="https://maps.app.goo.gl/PTJn6coPBcRDKbHw5" target="_blank" rel="noopener noreferrer" className="wyg-map-link">Phoenix + Golf</a>
                      <a href="https://maps.app.goo.gl/9n9uM7NG8Sa2aA8" target="_blank" rel="noopener noreferrer" className="wyg-map-link">Vancouver Bars</a>
                      <a href="https://maps.app.goo.gl/4moCgAkEHz5uJbQ9A" target="_blank" rel="noopener noreferrer" className="wyg-map-link">Vancouver Attractions</a>
                      <a href="https://maps.app.goo.gl/R4TC9toa9oP5qJed8" target="_blank" rel="noopener noreferrer" className="wyg-map-link">Vienna Bars</a>
                      <a href="https://maps.app.goo.gl/e3pGDSj6PCcPEy8j7" target="_blank" rel="noopener noreferrer" className="wyg-map-link">Prague Attractions</a>
                      <a href="https://maps.app.goo.gl/o7BCdPPpzPHJsEA59" target="_blank" rel="noopener noreferrer" className="wyg-map-link">Prague Bars</a>
                      <a href="https://maps.app.goo.gl/FYEJQFkTJVyqZr1x7" target="_blank" rel="noopener noreferrer" className="wyg-map-link">Dresden</a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Deliverable 4: Money Intelligence */}
              <div className="wyg-card" onClick={() => toggleDeliverable(3)}>
                <div className="wyg-header">
                  <div className="wyg-num">04</div>
                  <div className="wyg-header-text">
                    <div className="wyg-title">Money Intelligence</div>
                    <div className="wyg-subtitle">Savings opportunities specific to your destination, your group, and your timeline.</div>
                  </div>
                  <div className={`tw-chevron ${openDeliverable===3?'open':''}`}>&#9662;</div>
                </div>
                <div className={`wyg-body ${openDeliverable===3?'open':''}`}>
                  <div className="wyg-body-inner">
                    <p className="wyg-text">Every framework includes a "Ways to Save" section tailored to the destination. This isn't generic advice like "eat at local restaurants" — it's specific, researched intelligence about where money is wasted and where it can be redirected. We break down accommodation pricing by neighborhood, identify the overpriced tourist traps vs. the local-priced equivalents, and build cost models that show exactly what a trip costs per person per day at different comfort levels.</p>
                    <p className="wyg-text">The money intelligence covers: accommodation strategy (neighborhood selection, Airbnb vs hotel economics for your group size), food budgeting (where to splurge vs where the cheap food is actually better), transit optimization (when to walk, when to metro, when a day pass pays for itself), experience prioritization (which paid attractions are worth it and which are skippable), group purchasing strategies (tent reservations, group tours, shared accommodation), and timing savings (which days of the week and times of day save money at specific venues).</p>
                    <div className="wyg-example">
                      <div className="wyg-example-label">Real Example: Munich Oktoberfest Money Intelligence</div>
                      <div className="wyg-example-text">The Munich framework's money section is one of our most detailed. It covers: Oktoberfest tent reservation economics (free entry but you need a food/drink commitment — we break down the real per-person cost), Glockenbachviertel Airbnb pricing vs Marienplatz hotel pricing (the neighborhood we recommend is 35% cheaper and has better nightlife), supermarket strategy for breakfast (Aldi runs at German prices — €1.50 breakfast vs €12 hotel breakfast), Bavaria day trip costs (Salzburg by train is €29 round-trip and takes 90 minutes), and credit card optimization for euro transactions (no foreign transaction fee cards save 3% on everything). Total estimated savings versus a "book it all on TripAdvisor" approach: $400-700 per person for a 6-day trip.</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Deliverable 5: Personalized Recommendation */}
              <div className="wyg-card" onClick={() => toggleDeliverable(4)}>
                <div className="wyg-header">
                  <div className="wyg-num">05</div>
                  <div className="wyg-header-text">
                    <div className="wyg-title">Personalized Recommendation</div>
                    <div className="wyg-subtitle">Not sure where to go? We match you to a destination based on what actually matters.</div>
                  </div>
                  <div className={`tw-chevron ${openDeliverable===4?'open':''}`}>&#9662;</div>
                </div>
                <div className={`wyg-body ${openDeliverable===4?'open':''}`}>
                  <div className="wyg-body-inner">
                    <p className="wyg-text">Half the people who contact us don't have a destination in mind. They know they want to travel, they know roughly when and how much they want to spend, but they don't know where. That's fine — it's actually our favorite kind of client because we get to match them to the right trip instead of reverse-engineering a trip into a destination they picked from Instagram.</p>
                    <p className="wyg-text">The recommendation process starts with three questions: what kind of trip are you looking for (nightlife, culture, adventure, food, or a mix), how many people, and what's your budget per person? From those inputs and a short conversation, we narrow to 2-3 destinations from our portfolio and explain why each one fits. You pick. We build. No pressure, no affiliate incentives, no sponsored destinations. We recommend what we'd actually book ourselves.</p>
                    <p className="wyg-text">Try it yourself right now. Answer three questions and see what we'd recommend:</p>

                    {/* Interactive Quiz */}
                    <div className="quiz-container" onClick={(e) => e.stopPropagation()}>
                      <div className="quiz-question">What kind of trip are you looking for?</div>
                      <div className="quiz-options">
                        {['nightlife','culture','adventure','food','mix'].map(v => (
                          <div key={v} className={`quiz-option ${quizVibe===v?'selected':''}`} onClick={() => setQuizVibe(v)}>
                            {{nightlife:'Nightlife',culture:'Culture & History',adventure:'Adventure & Outdoors',food:'Food & Drink',mix:'A Mix of Everything'}[v]}
                          </div>
                        ))}
                      </div>

                      <div className="quiz-question">How many people?</div>
                      <div className="quiz-options">
                        {['2','3-4','5-6','7-10'].map(g => (
                          <div key={g} className={`quiz-option ${quizGroup===g?'selected':''}`} onClick={() => setQuizGroup(g)}>
                            {g} people
                          </div>
                        ))}
                      </div>

                      <div className="quiz-question">Budget per person (flights + accommodation)?</div>
                      <div className="quiz-options">
                        {[{k:'low',l:'Under $1,500'},{k:'mid',l:'$1,500 - $3,000'},{k:'high',l:'$3,000 - $5,000'},{k:'flex',l:'$5,000+ / Flexible'}].map(b => (
                          <div key={b.k} className={`quiz-option ${quizBudget===b.k?'selected':''}`} onClick={() => setQuizBudget(b.k)}>
                            {b.l}
                          </div>
                        ))}
                      </div>

                      {quizResult && (
                        <div className="quiz-result">
                          <div style={{fontFamily:'var(--mono)',fontSize:9,letterSpacing:2,textTransform:'uppercase',color:'var(--copper)',marginBottom:8}}>Our Recommendation</div>
                          <div className="quiz-result-title">{quizResult.pick}</div>
                          <div className="quiz-result-why">{quizResult.why}</div>
                          <div className="quiz-result-alt"><strong>Alternative:</strong> {quizResult.alt} — {quizResult.altWhy}</div>
                          {quizResult.link !== '#' && (
                            <a href={quizResult.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{marginRight:12}}>View Framework →</a>
                          )}
                          <button className="quiz-reset" onClick={resetQuiz}>Start Over</button>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              </div>

    </>
  );
}

/* ===== SVG ICONS ===== */
function IconMapPin() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>; }
function IconDatabase() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>; }
function IconPlane() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>; }
function IconSend() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/></svg>; }

/* ===== MAIN APP ===== */
export default function App() {
  const [activeSection, setActiveSection] = useState('destinations');
  const [scrolled, setScrolled] = useState(false);
  const [heroImg, setHeroImg] = useState(0);
  const [selectedVibe, setSelectedVibe] = useState(null);

  const heroImages = [IMAGES.cliffs, NEW_IMAGES.colosseumInside, NEW_IMAGES.sagradaSunset, IMAGES.opera, NEW_IMAGES.fitzroyBeach, BATCH3_IMAGES.oahuSunset];

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 100);
      // Update active section based on scroll position
      const sections = ['destinations','system','domestic','lads'];
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Crossfade hero images
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroImg(prev => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const scrollTo = (id) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const pos = el.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: pos, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* NAV */}
      <header className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-inner">
          <div className="nav-brand" onClick={() => window.scrollTo({top:0,behavior:'smooth'})}>
            <div className="nav-brand-icon">L</div>
            <div className="nav-brand-text">The Lads<span> Travel Co</span></div>
          </div>
          <nav className="nav-pills">
            {[{id:'destinations',label:'Destinations'},{id:'system',label:'The System'},{id:'domestic',label:'Domestic'},{id:'lads',label:'The Lads'}].map(t => (
              <button key={t.id} className={`nav-pill ${activeSection===t.id?'active':''}`} onClick={() => scrollTo(t.id)}>{t.label}</button>
            ))}
          </nav>
          <button className="nav-cta" onClick={() => scrollTo('lads')}>Start Planning</button>
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        {heroImages.map((src, i) => (
          <div key={i} className="hero-bg" style={{opacity: heroImg === i ? 1 : 0}}>
            <img src={src} alt="" />
            <div className="hero-overlay" />
          </div>
        ))}
        <div className="hero-content">
          <div className="hero-label">Free Personal Travel Consulting Through 2026</div>
          <h1>Travel Like<br/><em>You Know Someone</em></h1>
          <p className="hero-sub">Two friends. 20+ cities. Four continents. Every trip we plan through 2026 is free. We're building something real and we want you to be part of it.</p>
          <div className="hero-buttons">
            <button className="btn-primary-pill" onClick={() => scrollTo('adventure')}>Choose Your Adventure</button>
            <button className="btn-ghost-pill" onClick={() => scrollTo('destinations')}>Browse Destinations</button>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-icon"><IconMapPin /></div>
              <div className="hero-stat-text"><div className="hero-stat-val">650+</div><div className="hero-stat-label">Validated Spots</div></div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-icon"><IconDatabase /></div>
              <div className="hero-stat-text"><div className="hero-stat-val">20+</div><div className="hero-stat-label">Cities Explored</div></div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-icon"><IconPlane /></div>
              <div className="hero-stat-text"><div className="hero-stat-val">4</div><div className="hero-stat-label">Continents</div></div>
            </div>
          </div>
        </div>
        <div className="hero-scroll" onClick={() => scrollTo('adventure')}>
          <span>Scroll to explore</span>
          <span>↓</span>
        </div>
        <div className="hero-dots">
          {heroImages.map((_, i) => (
            <button key={i} className={`hero-dot ${heroImg===i?'active':''}`} onClick={() => setHeroImg(i)} />
          ))}
        </div>
      </section>

      {/* CHOOSE YOUR ADVENTURE */}
      <VibeSelector selectedVibe={selectedVibe} onSelect={(v) => setSelectedVibe(selectedVibe === v ? null : v)} scrollTo={scrollTo} />

      {/* EARLY ACCESS EMAIL CAPTURE */}
      <section style={{padding:'56px 24px',textAlign:'center',background:'linear-gradient(180deg, var(--bg) 0%, var(--surface) 50%, var(--bg) 100%)'}}>
        <Reveal>
          <div style={{maxWidth:520,margin:'0 auto'}}>
            <div className="section-label" style={{textAlign:'center',marginBottom:8}}>Free Through 2026</div>
            <h2 style={{fontFamily:'var(--editorial)',fontSize:'clamp(1.4rem, 3vw, 2rem)',fontWeight:600,marginBottom:12}}>Free personal travel consulting. <em>Seriously.</em></h2>
            <p style={{fontSize:14,color:'var(--muted)',marginBottom:28,lineHeight:1.7}}>Every trip we plan through 2026 is free. Drop your email and we'll reach out to start planning yours.</p>
            <form action="https://formspree.io/f/xvzvekkk" method="POST" style={{display:'flex',gap:8,maxWidth:420,margin:'0 auto',flexWrap:'wrap',justifyContent:'center'}}>
              <input type="hidden" name="_subject" value="Early Access Signup" />
              <input type="email" name="email" required placeholder="your@email.com" style={{flex:'1 1 240px',padding:'12px 18px',borderRadius:10,border:'1px solid var(--border2)',background:'var(--surface)',color:'var(--cream)',fontSize:14,fontFamily:'var(--sans)',outline:'none'}} />
              <button type="submit" className="btn-primary-pill" style={{whiteSpace:'nowrap'}}>Get Early Access</button>
            </form>
          </div>
        </Reveal>
      </section>

      {/* GRADIENT: dark → light */}
      <div className="gradient-dark-to-light" />

      {/* DESTINATIONS */}
      <div id="destinations">
        <DestinationsSection selectedVibe={selectedVibe} />
      </div>

      {/* PHOTO STRIP: destinations → system */}
      <div className="photo-strip" style={{background:'var(--light-bg)'}}>
        <div style={{maxWidth:1200,margin:'0 auto',padding:'0 24px'}}>
          <div className="photo-strip-grid" style={{gridTemplateColumns:'repeat(5, 1fr)',borderRadius:12,overflow:'hidden'}}>
            <img src={NEW_IMAGES.pantheonRome} alt="Pantheon Rome" style={{height:180}} />
            <img src={NEW_IMAGES.pragueSkyline} alt="Prague skyline" style={{height:180}} />
            <img src={BATCH3_IMAGES.templeBarDublin} alt="Temple Bar Dublin" style={{height:180}} />
            <img src={NEW_IMAGES.fitzroyBeach2} alt="Fitzroy Island beach" style={{height:180}} />
            <img src={BATCH3_IMAGES.klimtKiss} alt="Klimt The Kiss Vienna" style={{height:180}} />
          </div>
        </div>
      </div>

      {/* GRADIENT: light → light-alt */}
      <div className="gradient-light-to-light-alt" />

      {/* SYSTEM */}
      <div id="system">
        <SystemSection selectedVibe={selectedVibe} />
      </div>

      {/* PHOTO STRIP: system → domestic */}
      <div className="photo-strip" style={{background:'var(--light-bg-alt)'}}>
        <div style={{maxWidth:1200,margin:'0 auto',padding:'0 24px'}}>
          <div className="photo-strip-grid" style={{gridTemplateColumns:'2fr 1fr 1fr 2fr',borderRadius:12,overflow:'hidden'}}>
            <img src={BATCH3_IMAGES.hawaiiPillbox} alt="Hawaii pillbox hike coastline" style={{height:200}} />
            <img src={BATCH3_IMAGES.dresdenFrauenkirche} alt="Dresden Frauenkirche" style={{height:200}} />
            <img src={BATCH3_IMAGES.busBarNight} alt="Bus bar string lights" style={{height:200}} />
            <img src={BATCH3_IMAGES.vividDroneHeart} alt="Vivid Sydney drone heart" style={{height:200}} />
          </div>
        </div>
      </div>

      {/* GRADIENT: light-alt → light */}
      <div className="gradient-light-alt-to-light" />

      {/* DOMESTIC */}
      <div id="domestic">
        <DomesticSection />
      </div>

      {/* PHOTO STRIP: domestic → lads */}
      <div className="photo-strip" style={{background:'var(--light-bg)'}}>
        <div style={{maxWidth:1200,margin:'0 auto',padding:'0 24px'}}>
          <div className="photo-strip-grid" style={{gridTemplateColumns:'1fr 2fr 1fr',borderRadius:12,overflow:'hidden'}}>
            <img src={NEW_IMAGES.dresdenPalace} alt="Dresden Palace" style={{height:220}} />
            <img src={NEW_IMAGES.bondiRocks} alt="Bondi coastal rocks" style={{height:220}} />
            <img src={NEW_IMAGES.colosseumInside2} alt="Inside the Colosseum" style={{height:220}} />
          </div>
        </div>
      </div>

      {/* LADS */}
      <div id="lads">
        <LadsSection />
      </div>

      {/* PHOTO STRIP: lads → giving back */}
      <div className="photo-strip" style={{background:'var(--light-bg)'}}>
        <div style={{maxWidth:1200,margin:'0 auto',padding:'0 24px'}}>
          <div className="photo-strip-grid" style={{gridTemplateColumns:'2fr 1fr 1fr 2fr',borderRadius:12,overflow:'hidden'}}>
            <img src={NEW_IMAGES.rockArchPNW} alt="Rock arch Pacific Northwest" style={{height:180}} />
            <img src={BATCH3_IMAGES.europeanWaterfall} alt="European waterfall" style={{height:180}} />
            <img src={BATCH3_IMAGES.galwayChristmas} alt="Galway Christmas lights" style={{height:180}} />
            <img src={BATCH3_IMAGES.konaBrewing} alt="Kona Brewing Hawaii" style={{height:180}} />
          </div>
        </div>
      </div>

      {/* GRADIENT: light → dark */}
      <div className="gradient-light-to-dark" />

      {/* GIVING BACK — DARK SECTION */}
      <section className="section giving-back-section">
        <div className="giving-back-bg">
          <img src={NEW_IMAGES.mountainOverlook} alt="" />
        </div>
        <div className="section-inner" style={{position:'relative',zIndex:1}}>
          <Reveal>
            <div className="section-header" style={{textAlign:'center'}}>
              <div className="section-label" style={{textAlign:'center'}}>Giving Back</div>
              <div className="section-title" style={{textAlign:'center'}}>Free Through 2026.<br/><span className="muted">Donations Go to Causes We Care About.</span></div>
              <p className="section-desc" style={{margin:'16px auto 0',textAlign:'center',color:'var(--cream2)'}}>Through 2026, every trip we plan is free. Any donations go directly to causes we care about — matched to the travel season that inspires them.</p>
            </div>
          </Reveal>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))',gap:16,marginTop:48}}>
            {[
              {window:'Late Aug / Sep',cause:'Breast Cancer Research',why:'October awareness approaching',icon:'\uD83C\uDF80'},
              {window:'Nov / Dec',cause:"Mott Children's Hospital",why:'Holiday giving season',icon:'\u2764\uFE0F'},
              {window:'Apr / May',cause:'Protecting Our Parks',why:'Earth Day, spring outdoors',icon:'\uD83C\uDF32'},
              {window:'Jul / Aug',cause:'Sports Science Medical Research',why:'Summer athletics season',icon:'\u26BD'},
              {window:'Rotating',cause:'Current Events',why:'Responding to what matters now',icon:'\uD83C\uDF0D'}
            ].map((c,i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="giving-back-card">
                  <div style={{fontSize:32,marginBottom:12}}>{c.icon}</div>
                  <div style={{fontFamily:'var(--mono)',fontSize:10,letterSpacing:2,textTransform:'uppercase',color:'var(--muted)',marginBottom:8}}>{c.window}</div>
                  <div style={{fontFamily:'var(--editorial)',fontSize:'1.1rem',fontWeight:600,marginBottom:6,color:'var(--cream)'}}>{c.cause}</div>
                  <div style={{fontSize:12,color:'var(--dim)'}}>{c.why}</div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={400}>
            <p style={{textAlign:'center',fontSize:13,color:'var(--dim)',maxWidth:480,margin:'40px auto 0',lineHeight:1.7}}>This isn't a marketing angle. It's year zero. Free service, real charity, build the portfolio, prove the system. Paid consulting launches 2027.</p>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="nav-brand-icon">L</div>
            <span style={{fontSize:13,color:'var(--muted)'}}>The Lads Travel Co</span>
          </div>
          <div className="footer-tagline">Built with coffee, flight delays, and questionable pub decisions.</div>
          <div className="footer-copy">2026</div>
        </div>
      </footer>
    </>
  );
}

/* ===== VIBE SELECTOR ===== */
function VibeSelector({ selectedVibe, onSelect, scrollTo }) {
  return (
    <section className="vibe-section" id="adventure">
      <div className="section-inner">
        <Reveal>
          <div className="vibe-header">
            <div className="section-label">Choose Your Adventure</div>
            <div className="section-title">What kind of trip<br/><em>are you looking for?</em></div>
            <p className="section-desc">Pick your vibe and we'll show you where to start. Every destination stays visible — we just surface the ones that fit.</p>
          </div>
        </Reveal>
        <div className="vibe-grid">
          {VIBES.map((vibe, i) => (
            <Reveal key={vibe.id} delay={i * 60}>
              <button
                className={`vibe-card ${selectedVibe === vibe.id ? 'selected' : ''}`}
                onClick={() => { const isSelecting = selectedVibe !== vibe.id; onSelect(vibe.id); if (isSelecting) setTimeout(() => scrollTo('destinations'), 400); }}
                style={{'--vibe-color': vibe.color}}
              >
                <div className="vibe-card-icon">{vibe.icon}</div>
                <div className="vibe-card-label">{vibe.label}</div>
                <div className="vibe-card-tagline">{vibe.tagline}</div>
                <div className="vibe-card-count">
                  {vibe.destinations.length + vibe.bucketList.length} trips
                </div>
                {selectedVibe === vibe.id && (
                  <div className="vibe-card-active">Selected</div>
                )}
              </button>
            </Reveal>
          ))}
        </div>
        <div style={{textAlign:'center', opacity: selectedVibe ? 1 : 0, transition: 'opacity 0.3s', pointerEvents: selectedVibe ? 'auto' : 'none'}}>
          <button className="vibe-clear" onClick={() => onSelect(selectedVibe)}>
            Clear selection — show all destinations
          </button>
        </div>
      </div>
    </section>
  );
}

/* ===== DESTINATIONS SECTION ===== */
function DestinationsSection({ selectedVibe }) {
  const [filter, setFilter] = useState('all');

  const activeVibe = VIBES.find(v => v.id === selectedVibe);
  const vibeDestNames = activeVibe ? activeVibe.destinations : [];
  const vibeBucketNames = activeVibe ? activeVibe.bucketList : [];

  // Reorder: matching destinations first, then the rest
  const validated = selectedVibe
    ? [...DESTINATIONS.filter(d => vibeDestNames.includes(d.name)), ...DESTINATIONS.filter(d => !vibeDestNames.includes(d.name))]
    : DESTINATIONS;

  const sortedBucket = selectedVibe
    ? [...BUCKET_LIST.filter(b => vibeBucketNames.includes(b.name)), ...BUCKET_LIST.filter(b => !vibeBucketNames.includes(b.name))]
    : BUCKET_LIST;

  return (
    <section className="section">
      <div className="section-inner">
        <Reveal>
          <div className="section-header-split">
            <div>
              <div className="section-label">Destinations</div>
              <div className="section-title">Where We've Been.<br/><span className="muted">Where We'll Take You.</span></div>
            </div>
            <div className="filter-tabs">
              {[{id:'all',label:'All Trips'},{id:'validated',label:'Validated'},{id:'research',label:'Bucket List'}].map(t => (
                <button key={t.id} className={`filter-tab ${filter===t.id?'active':''}`} onClick={() => setFilter(t.id)}>{t.label}</button>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Validated destinations */}
        {(filter === 'all' || filter === 'validated') && (
          <Reveal delay={100}>
            {filter === 'all' && (
              <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:24}}>
                <div style={{width:36,height:36,borderRadius:'50%',background:'var(--gold-dim)',border:'1px solid var(--gold-border)',display:'flex',alignItems:'center',justifyContent:'center'}}><IconMapPin /></div>
                <div>
                  <div style={{fontWeight:600,fontSize:15}}>Personally Validated</div>
                  <div style={{fontSize:12,color:'var(--muted)'}}>Every spot visited and tested by the Lads</div>
                </div>
              </div>
            )}
            <div className={`dest-grid ${selectedVibe ? 'vibe-active' : ''}`}>
              {validated.map((dest, i) => {
                const isMatch = selectedVibe && vibeDestNames.includes(dest.name);
                const isDimmed = selectedVibe && !vibeDestNames.includes(dest.name);
                return (
                <Reveal key={dest.name} delay={i * 100}>
                <a href={dest.link} target="_blank" rel="noopener noreferrer" className={`dest-card ${isMatch ? 'vibe-match' : ''} ${isDimmed ? 'vibe-dim' : ''}`} style={{textDecoration:'none'}}>
                  <img src={IMAGES[dest.img]} alt={dest.name} />
                  <div className="dest-card-overlay" />
                  <div className="dest-card-badge"><IconMapPin /> <span>{dest.stats[0].n} {dest.stats[0].l.split(' ')[0]}</span></div>
                  <div className="dest-card-content">
                    <div className="dest-card-region">{dest.route.split(' \u2192 ')[0]}</div>
                    <div className="dest-card-name">{dest.name}</div>
                    <div className="dest-card-meta">
                      <span>{dest.badge}</span>
                    </div>
                    <div className="dest-card-highlights">
                      {dest.stats.slice(0, i === 0 ? 4 : 3).map((s,j) => (
                        <span key={j} className="dest-card-tag">{s.n} {s.l}</span>
                      ))}
                    </div>
                    {isMatch && <div className="vibe-match-label">Matches your vibe</div>}
                    <div className="dest-card-cta">
                      <span>Explore Framework</span> <span>→</span>
                    </div>
                  </div>
                </a>
                </Reveal>
                );
              })}
            </div>
          </Reveal>
        )}

        {/* Research / Bucket List */}
        {(filter === 'all' || filter === 'research') && (
          <Reveal delay={200}>
            <div style={{marginTop:filter==='all'?48:0}}>
              {filter === 'all' && (
                <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:24}}>
                  <div style={{width:36,height:36,borderRadius:'50%',background:'var(--teal-dim)',border:'1px solid rgba(90,154,173,0.3)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--teal)'}}>&#10024;</div>
                  <div>
                    <div style={{fontWeight:600,fontSize:15}}>Research Built</div>
                    <div style={{fontSize:12,color:'var(--muted)'}}>Six-agent AI framework for new destinations</div>
                  </div>
                </div>
              )}
              <div style={{display:'grid',gridTemplateColumns:'repeat(3, 1fr)',gap:16}}>
                {sortedBucket.map((b,i) => {
                  const isBucketMatch = selectedVibe && vibeBucketNames.includes(b.name);
                  const isBucketDim = selectedVibe && !vibeBucketNames.includes(b.name);
                  return (
                  <div key={b.name} className={`dest-card ${isBucketMatch ? 'vibe-match' : ''} ${isBucketDim ? 'vibe-dim' : ''}`} style={{aspectRatio:'4/5',minHeight:0,background:'var(--surface)'}}>
                    <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg, var(--surface), var(--elevated))'}} />
                    <div className="dest-card-overlay" style={{background:'linear-gradient(transparent 40%, rgba(20,18,16,0.9) 85%)'}} />
                    <div className="dest-card-badge research">{b.status==='ready'?'Framework Ready':'Building'}</div>
                    <div className="dest-card-content">
                      <div className="dest-card-region">{b.route.split(' \u2192 ')[0]}</div>
                      <div className="dest-card-name" style={{fontSize:'1.3rem'}}>{b.name}</div>
                      <div style={{fontSize:12,color:'var(--muted)',marginBottom:8}}>{b.meta}</div>
                      <p style={{fontSize:12,color:'var(--cream2)',lineHeight:1.6}}>{b.desc}</p>
                      {b.link && (
                        <div style={{marginTop:12}}>
                          <a href={b.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{fontSize:11}}>Open Framework &#8594;</a>
                        </div>
                      )}
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>
          </Reveal>
        )}

        {/* Maps CTA */}
        <Reveal delay={300}>
          <div className="maps-banner">
            <div style={{display:'flex',alignItems:'center',gap:16}}>
              <div style={{width:48,height:48,borderRadius:'var(--radius)',background:'var(--gold-dim)',border:'1px solid var(--gold-border)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><IconMapPin /></div>
              <div className="maps-banner-text">
                <h4>18 Curated Google Maps Lists</h4>
                <p>Drop them straight into your Google Maps app</p>
              </div>
            </div>
            <button className="btn-primary-pill" onClick={() => {
              const el = document.getElementById('system');
              if (el) el.scrollIntoView({behavior:'smooth'});
            }}>Access All Maps &#8594;</button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ===== SYSTEM SECTION ===== */
function SystemSection({ selectedVibe }) {
  const [activeStep, setActiveStep] = useState(0);
  // openWindow state removed — TravelWindows is now a standalone component
  const [openFlight, setOpenFlight] = useState(null);
  const [openMyth, setOpenMyth] = useState(null);
  const [openDeliverable, setOpenDeliverable] = useState(null);
  const [activeDeliverable, setActiveDeliverable] = useState(0);

  // Pre-select quiz vibe from adventure selector
  const vibeMapping = VIBES.find(v => v.id === selectedVibe);
  const [quizVibe, setQuizVibe] = useState(null);
  const [quizGroup, setQuizGroup] = useState(null);
  const [quizBudget, setQuizBudget] = useState(null);

  // Sync quiz vibe when adventure vibe changes
  useEffect(() => {
    if (vibeMapping) {
      setQuizVibe(vibeMapping.quizVibe);
    }
  }, [selectedVibe]);

  const toggleFlight = (i) => setOpenFlight(openFlight === i ? null : i);
  const toggleMyth = (i) => setOpenMyth(openMyth === i ? null : i);
  const toggleDeliverable = (i) => setOpenDeliverable(openDeliverable === i ? null : i);
  const resetQuiz = () => { setQuizVibe(null); setQuizGroup(null); setQuizBudget(null); };

  const getRecommendation = () => {
    if (!quizVibe || !quizBudget) return null;
    const key = quizVibe + '_' + quizBudget;
    const recs = QUIZ_RECS;
    return recs[key] || null;
  };
  const quizResult = getRecommendation();

  const steps = [
    {n:"01",t:"Fill out the intake",d:"90 seconds. Where, who, when.",detail:"We learn about you \u2014 not just where you want to go, but how you like to travel. 90 seconds to fill out, and it tells us everything we need to start."},
    {n:"02",t:"15-minute call",d:"Flights, accommodation, experiences, budget \u2014 all of it.",detail:"We cover flights, accommodation, experiences, budget, and deal-breakers. By the end, we know exactly what to build for you."},
    {n:"03",t:"Research runs",d:"Six AI agents across flights, neighborhoods, and savings.",detail:"Real-time data on weather, events, pricing, and local intel gets synthesized by six specialized research agents."},
    {n:"04",t:"Framework delivered",d:"Designed HTML document. Cost breakdowns, validated spots.",detail:"Not a rigid itinerary \u2014 a flexible system with cost models, validated spots, and day templates that works on your phone."},
    {n:"05",t:"Follow-up included",d:"Questions after delivery are part of the deal.",detail:"Travel plans change \u2014 we're here when they do. Questions after delivery are part of every package."}
  ];

  return (
    <>
    <section className="section section-alt">
      <div className="section-inner">
        {/* Header */}
        <Reveal>
          <div className="section-header" style={{textAlign:'center'}}>
            <div className="section-label" style={{textAlign:'center'}}>The System</div>
            <div className="section-title" style={{textAlign:'center'}}>Data Science Meets<br/><span className="muted">Personal Experience</span></div>
            <p className="section-desc" style={{margin:'12px auto 0',textAlign:'center'}}>We don't give generic advice. Every recommendation is backed by real data, cost models, and 650+ spots we've personally validated.</p>
          </div>
        </Reveal>

        {/* Process Steps — Interactive (v0 pattern) */}
        <Reveal delay={100}>
          <h3 style={{fontFamily:'var(--editorial)',fontSize:'1.6rem',fontWeight:600,marginBottom:28,color:'var(--light-text)'}}>How We Work</h3>
          <div className="process-grid">
            <div className="process-list">
              {steps.map((s,i) => (
                <button key={i} className={`process-step ${activeStep===i?'active':''}`} onClick={() => setActiveStep(i)}>
                  <div className="process-step-icon">{s.n}</div>
                  <div>
                    <div className="process-step-num">{s.n}</div>
                    <div className="process-step-title">{s.t}</div>
                    <div className="process-step-desc">{s.d}</div>
                  </div>
                </button>
              ))}
            </div>
            <div className="process-detail">
              <div className="process-detail-bg-num">{steps[activeStep].n}</div>
              <div className="process-detail-icon">{steps[activeStep].n}</div>
              <h3>{steps[activeStep].t}</h3>
              <p>{steps[activeStep].detail}</p>
            </div>
          </div>
        </Reveal>

        {/* Travel Windows — v2 sticky scroll component (renders its own dark section with gradient bridges) */}
        </div>
      </section>
      <TravelWindows />
      <section className="section section-alt">
        <div className="section-inner">

        {/* Flight Intelligence */}
        <Reveal delay={200}>
          <div style={{marginTop:80}}>
            <div className="section-label">Flight Intelligence</div>
            <div className="section-title" style={{marginBottom:12}}>How We Find <em>the Deals</em></div>
            <p className="section-desc" style={{marginBottom:24}}>Airline pricing is adversarial by design. Here's how we beat it.</p>
            {FLIGHT_INTEL_JSX(openFlight, toggleFlight, openMyth, toggleMyth)}
          </div>
        </Reveal>

        {/* Database + Bucket List side by side (v0 pattern) */}
        <Reveal delay={200}>
          <div style={{marginTop:80,display:'grid',gridTemplateColumns:'1fr 1fr',gap:24}}>
            {/* Database viz */}
            <div className="db-viz">
              <div className="db-viz-header">
                <div>
                  <div style={{fontWeight:600,fontSize:15}}>The Database</div>
                  <div style={{fontSize:12,color:'var(--muted)'}}>650+ spots across 20+ cities</div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div className="db-viz-total">650</div>
                  <div className="db-viz-total-label">total spots</div>
                </div>
              </div>
              {[{name:'Sydney',count:123},{name:'Barcelona',count:115},{name:'Rome',count:43},{name:'Dublin',count:39},{name:'Prague',count:38}].map(c => (
                <div key={c.name} className="db-bar-row">
                  <div className="db-bar-header"><span>{c.name}</span><span>{c.count}</span></div>
                  <div className="db-bar"><div className="db-bar-fill" style={{width:`${(c.count/123)*100}%`}} /></div>
                </div>
              ))}
              <div className="db-cities">
                <p>Cities covered</p>
                <div className="db-city-tags">
                  {["Sydney","Barcelona","Rome","Dublin","Prague","Vienna","Costa Rica","Tasmania","Vancouver","Galway","Chicago","San Juan","Seattle","Phoenix"].map(c => (
                    <span key={c} className="db-city-tag">{c}</span>
                  ))}
                </div>
              </div>
            </div>
            {/* Bucket List panel */}
            <div className="bucket-panel">
              <div className="bucket-panel-header">
                <div style={{width:36,height:36,borderRadius:'50%',background:'rgba(90,154,173,0.12)',border:'1px solid rgba(90,154,173,0.3)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--teal)'}}>&#128197;</div>
                <div>
                  <div style={{fontWeight:600,fontSize:15}}>Bucket List</div>
                  <div style={{fontSize:12,color:'var(--muted)'}}>Where we're headed next</div>
                </div>
              </div>
              {BUCKET_LIST.map((b,i) => (
                <div key={i} className="bucket-item">
                  <div className="bucket-item-name">{b.name}</div>
                  <div className="bucket-item-right">
                    <span className="bucket-item-meta">{b.meta.split('\u00B7')[0]}</span>
                    <span className={`bucket-status-tag ${b.status==='ready'?'ready':'building'}`}>{b.status==='ready'?'Ready':'Building'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* What You Get */}
        <Reveal delay={200}>
          <div style={{marginTop:80}}>
            <div className="section-label">What You Get</div>
            <div className="section-title" style={{marginBottom:12}}>Five Deliverables. <em>Zero Fluff.</em></div>
            <p className="section-desc" style={{marginBottom:32}}>Every client gets the same core package. No tiers. No upsells.</p>
            {WYG_JSX(openDeliverable, toggleDeliverable, quizVibe, setQuizVibe, quizGroup, setQuizGroup, quizBudget, setQuizBudget, quizResult, resetQuiz)}
          </div>
        </Reveal>
      </div>
    </section>
    </>
  );
}

/* ===== DOMESTIC SECTION ===== */
function DomesticSection() {
  const [expandedDom, setExpandedDom] = useState(null);
  const [michCategory, setMichCategory] = useState('food');

  const michCategories = [
    {id:'food', label:'Food', icon:'\uD83C\uDF7D\uFE0F'},
    {id:'breweries', label:'Breweries', icon:'\uD83C\uDF7A'},
    {id:'outdoors', label:'Outdoors', icon:'\u26F0\uFE0F'},
    {id:'daytrips', label:'Day Trips', icon:'\uD83D\uDE97'},
    {id:'hidden', label:'Hidden Gems', icon:'\u2728'},
  ];

  const michSpots = {
    food: [
      {name:"Zingerman's Deli", area:"Ann Arbor", note:"The Reuben changed the way we think about sandwiches. Not cheap, not sorry.", badge:"Brady"},
      {name:"Frita Batidos", area:"Ann Arbor", note:"Cuban street food. The burger is the move, but the batido makes the meal.", badge:"Brady"},
      {name:"Dearborn Arab Food District", area:"Detroit", note:"Best Middle Eastern food outside the Middle East. This isn't an exaggeration.", badge:"Brady"},
      {name:"Eastern Market", area:"Detroit", note:"Saturday mornings only. Get there by 8am or don't bother.", badge:"Brady"},
      {name:"Cherry Republic", area:"Traverse City", note:"Everything cherry, and unironically all of it is good.", badge:"Brady"},
      {name:"Grand Traverse Pie Co.", area:"Traverse City", note:"Cherry crumb pie. Order two \u2014 one for the road.", badge:"Brady"},
      {name:"The Chop House", area:"Ann Arbor", note:"Gameday dinner spot. Get a reservation or eat standing.", badge:"Brady"},
    ],
    breweries: [
      {name:"Founders Brewing", area:"Grand Rapids", note:"KBS is the crown jewel, but All Day IPA is why you come back. Beer City USA starts here.", badge:"Brady"},
      {name:"HOMES Brewery", area:"Ann Arbor", note:"Korean-fusion brewery. The food is as good as the beer. Unreal concept.", badge:"Brady"},
      {name:"Batch Brewing", area:"Detroit", note:"Corktown's best kept secret. Small batches, no hype, great beer.", badge:"Brady"},
      {name:"Short's Brewing", area:"Bellaire", note:"Up north institution. Soft Parade is a Michigan summer in a glass.", badge:"Brady"},
      {name:"Bell's Brewery", area:"Kalamazoo", note:"Two Hearted and Oberon. That's the whole pitch.", badge:"Dawson"},
      {name:"Brewery Vivant", area:"Grand Rapids", note:"Belgian-style in a converted funeral chapel. The space alone is worth the trip.", badge:"Brady"},
    ],
    outdoors: [
      {name:"Sleeping Bear Dunes", area:"Traverse City", note:"Most beautiful place in Michigan, full stop. The Pierce Stocking Scenic Drive is free and stunning.", badge:"Brady"},
      {name:"Pictured Rocks", area:"Upper Peninsula", note:"Kayak the shoreline. The colors in the rock face don't look real. Book guides early.", badge:"Brady"},
      {name:"Nordhouse Dunes", area:"Ludington", note:"Backpack to a beach campsite on Lake Michigan. No cars, no buildings, just sand and water.", badge:"Brady"},
      {name:"Mission Peninsula", area:"Traverse City", note:"Underrated wine region. Drive the peninsula, stop at 3-4 wineries, end at the lighthouse.", badge:"Brady"},
      {name:"Torch Lake", area:"Up North", note:"The Caribbean of the Midwest. Not a joke \u2014 the water is actually turquoise in July.", badge:"Brady"},
    ],
    daytrips: [
      {name:"Ann Arbor Football Saturday", area:"Ann Arbor", note:"The Big House holds 107,000 people. Get there at 8am for tailgating. Zingerman's first, campus walk, then the game.", badge:"Brady"},
      {name:"Saugatuck + Douglas", area:"Lakeshore", note:"Art galleries, Oval Beach, and small-town Lake Michigan vibes. 2 hours from GR, perfect day trip.", badge:"Brady"},
      {name:"Mackinac Island", area:"Northern Michigan", note:"No cars allowed. Fudge shops and bike rentals. Touristy but worth it once.", badge:"Brady"},
      {name:"Holland Tulip Festival", area:"Holland", note:"May only. Dutch heritage, 5 million tulips, and Windmill Island. Genuinely special.", badge:"Brady"},
    ],
    hidden: [
      {name:"The Blind Pig", area:"Ann Arbor", note:"Where Nirvana played before they were Nirvana. Small venue, great sound, historic.", badge:"Brady"},
      {name:"The Belt", area:"Detroit", note:"Hidden alley art district between two buildings downtown. Walk through it, then hit the bars on either side.", badge:"Brady"},
      {name:"Tunnel of Trees", area:"Harbor Springs", note:"M-119 in October. 20 miles of canopy road along Lake Michigan. Best fall drive in the state.", badge:"Brady"},
      {name:"Third Man Records", area:"Detroit", note:"Jack White's pressing plant and record store. They press vinyl in front of you.", badge:"Brady"},
      {name:"Kitch-iti-kipi", area:"Upper Peninsula", note:"Michigan's largest freshwater spring. Crystal clear, 40 feet deep, you can see the bottom. Free.", badge:"Brady"},
    ],
  };

  return (
    <section className="section">
      <div className="section-inner">
        <Reveal>
          <div className="section-header-split">
            <div>
              <div className="section-label">Domestic</div>
              <div className="section-title">Closer to Home.<br/><span className="muted">Still Curated.</span></div>
            </div>
            <p className="section-desc" style={{maxWidth:400}}>US and North American destinations with the same depth as our international frameworks.</p>
          </div>
        </Reveal>

        {/* ===== LADS LOCAL MICHIGAN — HERO FEATURE ===== */}
        <Reveal delay={100}>
          <div style={{
            background:'linear-gradient(135deg, #0a1f14, #122a1c, #0d2618)',
            borderRadius:'var(--radius)',
            overflow:'hidden',
            marginBottom:48,
            border:'1px solid rgba(45,122,66,0.2)'
          }}>
            {/* Michigan Hero Header */}
            <div style={{padding:'40px 36px 0'}}>
              <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16}}>
                <div style={{width:40,height:40,borderRadius:'50%',background:'rgba(45,122,66,0.2)',border:'1px solid rgba(45,122,66,0.35)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18}}>
                  {'\uD83C\uDF32'}
                </div>
                <div>
                  <div style={{fontFamily:'var(--serif)',fontSize:'1.6rem',fontWeight:700,color:'#e8f0e8'}}>Lads Local</div>
                  <div style={{fontSize:12,color:'rgba(200,230,200,0.5)',letterSpacing:2,textTransform:'uppercase'}}>Michigan Intelligence</div>
                </div>
              </div>
              <p style={{fontSize:14,color:'rgba(200,230,200,0.7)',lineHeight:1.7,maxWidth:600,marginBottom:6}}>
                Home turf. We grew up here, went to school here, know every brewery, every trail, and every shortcut.
                This is the same depth as our international frameworks \u2014 but for the state we actually live in.
              </p>
              <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:24}}>
                <span style={{padding:'4px 14px',borderRadius:'var(--radius-full)',fontSize:11,fontWeight:500,background:'rgba(45,122,66,0.2)',color:'#7ac490',border:'1px solid rgba(45,122,66,0.3)'}}>46 spots validated</span>
                <span style={{padding:'4px 14px',borderRadius:'var(--radius-full)',fontSize:11,fontWeight:500,background:'rgba(45,122,66,0.2)',color:'#7ac490',border:'1px solid rgba(45,122,66,0.3)'}}>8 regions covered</span>
                <span style={{padding:'4px 14px',borderRadius:'var(--radius-full)',fontSize:11,fontWeight:500,background:'rgba(45,122,66,0.2)',color:'#7ac490',border:'1px solid rgba(45,122,66,0.3)'}}>Free resource</span>
              </div>
            </div>

            {/* Category Tabs */}
            <div style={{padding:'0 36px 16px',display:'flex',gap:6,flexWrap:'wrap'}}>
              {michCategories.map(c => (
                <button key={c.id}
                  onClick={() => setMichCategory(c.id)}
                  style={{
                    padding:'8px 18px',
                    borderRadius:'var(--radius-full)',
                    border: michCategory===c.id ? '1px solid rgba(45,122,66,0.5)' : '1px solid rgba(255,255,255,0.08)',
                    background: michCategory===c.id ? 'rgba(45,122,66,0.25)' : 'rgba(255,255,255,0.04)',
                    color: michCategory===c.id ? '#7ac490' : 'rgba(200,230,200,0.5)',
                    fontSize:12, fontWeight:500, fontFamily:'var(--sans)',
                    cursor:'pointer', transition:'all 0.2s',
                    display:'flex', alignItems:'center', gap:6,
                  }}
                >
                  <span>{c.icon}</span> {c.label}
                </button>
              ))}
            </div>

            {/* Spots */}
            <div style={{padding:'0 36px 32px'}}>
              {michSpots[michCategory].map((spot, i) => (
                <div key={i} style={{
                  display:'flex', justifyContent:'space-between', alignItems:'flex-start',
                  padding:'14px 16px', marginBottom:6,
                  borderRadius:'var(--radius-sm)',
                  background:'rgba(255,255,255,0.03)',
                  border:'1px solid rgba(255,255,255,0.05)',
                }}>
                  <div style={{flex:1}}>
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      <span style={{fontSize:14,fontWeight:600,color:'#e8f0e8'}}>{spot.name}</span>
                      <span style={{fontSize:10,color:'rgba(200,230,200,0.35)'}}>{spot.area}</span>
                    </div>
                    <div style={{fontSize:13,color:'rgba(200,230,200,0.55)',marginTop:3,lineHeight:1.5}}>{spot.note}</div>
                  </div>
                  <span style={{
                    padding:'3px 10px', borderRadius:4, fontSize:10, fontWeight:500, flexShrink:0, marginLeft:12,
                    background: spot.badge==='Dawson' ? 'rgba(90,154,173,0.15)' : 'rgba(184,136,110,0.15)',
                    color: spot.badge==='Dawson' ? 'var(--teal)' : 'var(--copper)',
                  }}>{spot.badge}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div style={{padding:'0 36px 32px',display:'flex',gap:12,flexWrap:'wrap'}}>
              <a href="lads-local.html" target="_blank" rel="noopener noreferrer"
                style={{
                  padding:'10px 24px', borderRadius:'var(--radius-full)',
                  background:'rgba(45,122,66,0.3)', color:'#7ac490',
                  border:'1px solid rgba(45,122,66,0.4)',
                  fontSize:13, fontWeight:500, fontFamily:'var(--sans)',
                  textDecoration:'none', transition:'all 0.2s',
                  display:'inline-flex', alignItems:'center', gap:8,
                }}>
                Open Full Michigan Guide {'\u2192'}
              </a>
            </div>
          </div>
        </Reveal>

        {/* ===== OTHER DOMESTIC DESTINATIONS ===== */}
        <Reveal delay={100}>
          <div style={{marginBottom:24}}>
            <div className="section-label">More Destinations</div>
            <div className="section-title" style={{fontSize:'clamp(1.4rem, 3vw, 1.8rem)'}}>US & North America</div>
          </div>
        </Reveal>

        <div className="domestic-grid">
            {DOMESTIC.map((d,i) => (
              <Reveal key={i} delay={i * 80}>
              <div className="dom-card" onClick={() => setExpandedDom(expandedDom===i?null:i)}>
                <div className="dom-card-img">
                  {d.img && <img src={d.imgSrc === 'hero' ? HERO_IMAGES[d.img] : (IMAGES[d.img] || NEW_IMAGES[d.img] || BATCH3_IMAGES[d.img] || HERO_IMAGES[d.img] || BATCH4_IMAGES[d.img])} alt={d.name} />}
                  {!d.img && <div style={{width:'100%',height:'100%',background:'linear-gradient(135deg, var(--elevated), var(--surface))',position:'relative'}}><div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center'}}><span style={{fontFamily:'var(--serif)',fontSize:'2.2rem',fontWeight:700,color:'var(--dim)',letterSpacing:2}}>{d.name}</span></div></div>}
                  <div className="dom-card-img-overlay" />
                  <div className="dom-card-img-name">
                    <div className="region">{(d.meta.split('\u00B7')[0] || '').trim()}</div>
                    <div className="name">{d.name}</div>
                  </div>
                </div>
                <div className="dom-card-body">
                  <div className="dom-card-vibe">{d.desc.substring(0, 60)}...</div>
                  <div className="dom-card-expand">
                    <span>{expandedDom===i ? 'Less' : 'Honest Take'}</span> <span style={{transition:'transform 0.3s',transform:expandedDom===i?'rotate(90deg)':'none'}}>&#8250;</span>
                  </div>
                  {expandedDom === i && (
                    <div className="dom-card-honest">
                      <div className="dom-card-honest-label">The honest take</div>
                      <p>{d.desc}</p>
                      {d.links && d.links.length > 0 && (
                        <div style={{display:'flex',flexWrap:'wrap',gap:8,marginTop:12}}>
                          {d.links.map((l,j) => (
                            <a key={j} href={l.u} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{fontSize:11}} onClick={e => e.stopPropagation()}>{l.t}</a>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              </Reveal>
            ))}
          </div>
      </div>
    </section>
  );
}

/* ===== LADS SECTION ===== */
function LadsSection() {
  const [formSent, setFormSent] = useState(false);
  const [formError, setFormError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [styles, setStyles] = useState([]);

  const toggleStyle = (s) => {
    setStyles(prev => prev.includes(s) ? prev.filter(x=>x!==s) : [...prev, s]);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(false);
    const fd = new FormData(e.target);
    fd.set('Trip Style', styles.join(', '));
    try {
      const res = await fetch('https://formspree.io/f/xvzvekkk', {
        method: 'POST', body: fd, headers: { 'Accept': 'application/json' }
      });
      if (res.ok) { setFormSent(true); } else { setFormError(true); }
    } catch { setFormError(true); }
    setSubmitting(false);
  };

  const founders = [
    {
      name: "Brady", role: "The Builder", img: "surf",
      bio: "M.S. Applied Statistics, Grand Valley State. Studied abroad in Sydney for six weeks. 25+ countries across four continents. Built the AI research system, the database, and every framework on this site. Former peer advisor at GVSU's Padnos International Center. Starting at Ford Motor Company May 18th, 2026.",
      stats: {trips:"25+",countries:"4 continents",abroad:"Sydney"},
      specialties: ["AI Research System","Cost Modeling","Data Science"]
    },
    {
      name: "Dawson", role: "The Scout", img: "stoutie",
      bio: "Data Analytics, Kalamazoo College. Studied abroad in Madrid. Completed the full Iceland Ring Road. Deep firsthand knowledge of Spain, Ireland, Iceland, Rome, and Paris. 35+ pubs in Ireland in one week. The other half of every \"Both Lads\" validation label on this site.",
      stats: {trips:"14+",countries:"6 countries",abroad:"Madrid"},
      specialties: ["Hidden Gems","Local Research","Food & Drink"]
    }
  ];

  const timeline = [
    {year:"2019",event:"Brady's first overseas trip. The spark.",milestone:true},
    {year:"2022",event:"Brady studies abroad in Sydney. Six weeks, 123 spots validated.",milestone:true},
    {year:"2023",event:"Dawson studies abroad in Madrid. Deep Spain + Ireland knowledge.",milestone:true},
    {year:"2024",event:"Brady builds LLMs and AI models at Farmers Insurance for a year.",milestone:false},
    {year:"2025",event:"Broke hand surfing in Costa Rica. Extra free time becomes the 20-day build sprint.",milestone:true},
    {year:"2026",event:"The Lads Travel Co goes live. 650+ spots. 20+ cities. Let's go.",milestone:true}
  ];

  const buildSteps = [
    {day:"Days 1-3",task:"Database architecture and spot categorization system"},
    {day:"Days 4-7",task:"AI agent framework \u2014 six specialized research bots"},
    {day:"Days 8-12",task:"Framework templates and Google Maps integration"},
    {day:"Days 13-16",task:"Cost modeling and flight intelligence systems"},
    {day:"Days 17-20",task:"This website. Every pixel."}
  ];

  return (
    <section className="section section-alt">
      <div className="section-inner">
        {/* Header */}
        <Reveal>
          <div className="section-header" style={{textAlign:'center'}}>
            <div className="section-label" style={{textAlign:'center'}}>The Lads</div>
            <div className="section-title" style={{textAlign:'center'}}>Two Friends.<br/><span className="muted">One Mission.</span></div>
            <p className="section-desc" style={{margin:'12px auto 0',textAlign:'center'}}>We're not a faceless travel agency. We're two guys who love planning trips as much as taking them.</p>
          </div>
        </Reveal>

        {/* Founder Cards */}
          <div className="founders-grid">
            {founders.map((f,i) => (
              <Reveal key={i} delay={i * 150}>
              <div className="founder-card">
                <div className="founder-card-img">
                  <img src={IMAGES[f.img]} alt={f.name} />
                  <div className="founder-card-img-overlay" />
                  <div className="founder-card-img-info">
                    <div className="role">{f.role}</div>
                    <div className="name">{f.name}</div>
                  </div>
                </div>
                <div className="founder-card-body">
                  <p className="founder-card-bio">{f.bio}</p>
                  <div className="founder-card-stats">
                    <div className="founder-stat"><div className="founder-stat-val">{f.stats.trips}</div><div className="founder-stat-label">Trips</div></div>
                    <div className="founder-stat"><div className="founder-stat-val">{f.stats.countries}</div><div className="founder-stat-label">Reach</div></div>
                    <div className="founder-stat"><div className="founder-stat-val">{f.stats.abroad}</div><div className="founder-stat-label">Study Abroad</div></div>
                  </div>
                  <div className="founder-specialties">
                    {f.specialties.map(s => <span key={s} className="founder-specialty">{s}</span>)}
                  </div>
                </div>
              </div>
              </Reveal>
            ))}
          </div>

        {/* Origin Story */}
        <Reveal delay={200}>
          <h3 style={{fontFamily:'var(--editorial)',fontSize:'1.6rem',fontWeight:600,textAlign:'center',margin:'80px 0 40px',color:'var(--light-text)'}}>The Origin Story</h3>
          <div className="timeline" style={{maxWidth:600,margin:'0 auto'}}>
            {timeline.map((t,i) => (
              <div key={i} className="timeline-item">
                <div className={`timeline-dot ${t.milestone?'milestone':''}`} />
                <div className="timeline-year">{t.year}</div>
                <div className="timeline-event">{t.event}</div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Build Narrative + Differentiators */}
        <Reveal delay={200}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:24,marginTop:80}}>
            <div className="build-panel">
              <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:20}}>
                <div style={{width:36,height:36,borderRadius:'50%',background:'var(--teal-dim)',border:'1px solid rgba(90,154,173,0.3)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--teal)'}}>&#128187;</div>
                <div>
                  <div style={{fontWeight:600,fontSize:15}}>The 20-Day Build</div>
                  <div style={{fontSize:12,color:'var(--muted)'}}>From idea to launch</div>
                </div>
              </div>
              {buildSteps.map((s,i) => (
                <div key={i} className="build-step">
                  <div className="build-step-day">{s.day}</div>
                  <div className="build-step-task">
                    <div className={`build-step-dot ${i===buildSteps.length-1?'last':''}`} />
                    <div className="build-step-text">{s.task}</div>
                  </div>
                </div>
              ))}
              <div className="build-footer">
                <p>Total build time</p>
                <div className="build-total">20 days</div>
              </div>
            </div>
            <div className="diff-panel">
              <h4 style={{fontWeight:600,marginBottom:24}}>Why We're Different</h4>
              {[
                {icon:"&#128202;",title:"Real Database",desc:"650+ spots we've actually been to"},
                {icon:"&#10024;",title:"AI + Human",desc:"Six research agents backed by personal experience"},
                {icon:"&#128179;",title:"Cost Transparency",desc:"Real numbers from our trips, not estimates"},
                {icon:"&#127758;",title:"Honest Takes",desc:"We tell you what to skip, not just what to see"}
              ].map((d,i) => (
                <div key={i} className="diff-item">
                  <div className="diff-icon"><span>{d.icon}</span></div>
                  <div>
                    <div className="diff-title">{d.title}</div>
                    <div className="diff-desc">{d.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Photos — The Lads in the field */}
        <Reveal delay={200}>
          <div className="lads-gallery">
            <img src={NEW_IMAGES.pragueOldTown} alt="Lads in Prague Old Town" />
            <img src={BATCH3_IMAGES.bradyStPeters} alt="Brady at St Peters Rome" />
            <img src={NEW_IMAGES.galwayGuinness} alt="Lads with Guinness in Galway" />
            <img src={BATCH3_IMAGES.kangarooFeeding} alt="Feeding a kangaroo in Australia" />
            <img src={NEW_IMAGES.surfGroup} alt="Surf group in Australia" />
            <img src={BATCH3_IMAGES.munichMarienplatz} alt="Brady at Marienplatz Munich" />
            <img src={NEW_IMAGES.schonbrunnWalk} alt="Walking into Schonbrunn Palace" />
            <img src={NEW_IMAGES.mountainOverlook} alt="Mountain overlook Costa Rica" />
          </div>
        </Reveal>

        {/* Study Abroad */}
        <Reveal delay={150}>
          <div style={{textAlign:'center',marginTop:48,padding:'24px 16px',background:'var(--surface)',borderRadius:12,border:'1px solid var(--border)'}}>
            <p style={{fontFamily:'var(--serif)',fontSize:'1.1rem',fontWeight:600,marginBottom:8}}>Heading Abroad for School?</p>
            <p style={{fontSize:13,color:'var(--muted)',maxWidth:500,margin:'0 auto'}}>Brady was a peer advisor at GVSU's Padnos International Center before his Sydney study abroad. Students heading abroad — reach out, we share what we know for free.</p>
          </div>
        </Reveal>

        {/* Book a Call */}
        <Reveal delay={150}>
          <div style={{textAlign:'center',marginTop:48,marginBottom:32}}>
            <p style={{fontFamily:'var(--serif)',fontSize:'1.3rem',fontWeight:600,marginBottom:8}}>Want to talk first?</p>
            <p style={{fontSize:13,color:'var(--muted)',marginBottom:20}}>Book a free 15-minute intro call. No commitment, no pressure.</p>
            <button
              className="btn-primary-pill"
              data-cal-link="braden-dangelo/secret"
              data-cal-namespace="secret"
              data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}'
            >
              Book a Call
            </button>
          </div>
        </Reveal>

        {/* Intake Form */}
        <Reveal delay={200}>
          <div style={{marginTop:48}}>
            {!formSent ? (
              <form onSubmit={submitForm} className="intake-form">
                <div className="intake-header">
                  <div className="intake-icon"><IconSend /></div>
                  <div>
                    <div style={{fontWeight:600,fontSize:15}}>Start Your Journey</div>
                    <div style={{fontSize:12,color:'var(--muted)'}}>No cost through 2026. Seriously. We're building something and we want you to be part of it.</div>
                  </div>
                </div>
                <div className="intake-grid">
                  <div className="intake-field"><label>Name *</label><input name="Name" required /></div>
                  <div className="intake-field"><label>Email *</label><input name="Email" type="email" required /></div>
                  <div className="intake-field"><label>International or Domestic?</label><select name="Trip Type"><option>International</option><option>Domestic</option><option>Not sure yet</option></select></div>
                  <div className="intake-field"><label>Destination</label><input name="Destination" placeholder="Or 'not sure yet'" /></div>
                  <div className="intake-field"><label>Travel Dates</label><input name="Travel Dates" placeholder="Specific dates or 'flexible'" /></div>
                  <div className="intake-field"><label>Group Size</label><select name="Group Size"><option>2</option><option>3-4</option><option>5-6</option><option>7-10</option><option>10+</option></select></div>
                  <div className="intake-field"><label>Budget Per Person</label><select name="Budget"><option>Under $1,000</option><option>$1,000-$2,000</option><option>$2,000-$3,000</option><option>$3,000-$5,000</option><option>$5,000+</option><option>Not sure</option></select></div>
                  <div className="intake-field"><label>Savings Priority</label><select name="Savings Priority"><option>Flights</option><option>Accommodation</option><option>Food & Drink</option><option>Activities</option><option>All of it</option></select></div>
                </div>
                <div style={{marginBottom:20}}>
                  <label style={{display:'block',fontSize:12,fontWeight:500,marginBottom:8}}>Trip Style</label>
                  <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
                    {['Nightlife','Culture','Beach','Adventure','Food & Drink','Mix'].map(s => (
                      <div key={s} className={`quiz-option ${styles.includes(s)?'selected':''}`} onClick={() => toggleStyle(s)}>{s}</div>
                    ))}
                  </div>
                </div>
                <div className="intake-grid">
                  <div className="intake-field"><label>Cities Already Visited</label><input name="Cities Visited" placeholder="So we don't repeat" /></div>
                  <div className="intake-field"><label>How'd You Hear About Us?</label><select name="Referral"><option>Friend</option><option>Social media</option><option>Study abroad office</option><option>Google</option><option>Other</option></select></div>
                </div>
                <div className="intake-field" style={{marginBottom:24}}><label>Anything Else?</label><textarea name="Notes" placeholder="Anything we should know" /></div>
                {formError && <div style={{textAlign:'center',marginBottom:16,color:'#c45',fontSize:14}}>Something went wrong. Try again or email us directly.</div>}
                <button type="submit" className="intake-submit" disabled={submitting}>{submitting ? 'Sending...' : "Let's Plan Your Trip"}</button>
              </form>
            ) : (
              <div className="intake-success">
                <h4>Got it.</h4>
                <p>Brady will follow up within 24 hours.</p>
              </div>
            )}
          </div>
        </Reveal>

        {/* Contact */}
        <Reveal>
          <div style={{textAlign:'center',marginTop:48,paddingTop:32,borderTop:'1px solid var(--border)'}}>
            <p style={{fontSize:13,color:'var(--muted)',marginBottom:16}}>Or reach out directly</p>
            <a href="mailto:dangelobraden43@gmail.com" style={{fontSize:13,color:'var(--gold)'}}>dangelobraden43@gmail.com</a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ===== END ===== */
