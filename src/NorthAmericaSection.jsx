import React, { useState, useEffect, useRef } from 'react';
import { IMAGES } from './images';
import { NEW_IMAGES } from './images-new';
import { BATCH3_IMAGES } from './images-batch3';
import { HERO_IMAGES } from './images-hero';
import './NorthAmericaSection.css';

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
const DOMESTIC = [
  {name:"Jaco, Costa Rica",meta:"Both Lads · 28 Spots",desc:"Beach Airbnb, surf lessons, and an ATV tour to a hidden waterfall that we'd rank as our single best half-day experience anywhere we've traveled.",img:"costaRicaViewpoint",links:[{t:"Book ATV Tour",u:"https://gyg.me/0vVQ5scX"},{t:"Google Maps",u:"https://maps.app.goo.gl/hc199wu19C6cKj9G6"}]},
  {name:"San Juan",meta:"Brady · 14 Spots",desc:"No passport needed. Old San Juan is walkable, the mofongo is real, and the nightlife on Calle de la Fortaleza runs until 3am.",img:"oahu_IMG_5001",imgSrc:"hero",links:[{t:"Google Maps",u:"https://maps.app.goo.gl/ZWM8LXFGV9QpS8fB7"}]},
  {name:"Vancouver",meta:"Brady · 22 Spots",desc:"Stanley Park, Granville Island, and sushi that rivals Tokyo. 22 spots mapped across the best food city in the Pacific Northwest.",img:"vancouver",links:[{t:"Bars & Food",u:"https://maps.app.goo.gl/9n9uM7NG8Sa2aA8"},{t:"Things to Do",u:"https://maps.app.goo.gl/4moCgAkEHz5uJbQ9A"}]},
  {name:"Seattle + Olympic",meta:"Brady · 14 Spots",desc:"Pike Place for the morning, Capitol Hill bars at night, and a day trip to Olympic National Park that makes the whole trip worth it.",img:"hohRainforest",links:[{t:"Google Maps",u:"https://maps.app.goo.gl/Fr7KdvoLsnXeBV1q8"}]},
  {name:"Phoenix + Golf",meta:"Brady · 7 Spots",desc:"The golf trip. Shoulder season pricing in late spring or early fall cuts costs 40% and the weather's still perfect.",img:"phoenix_IMG_2651",imgSrc:"hero",links:[{t:"Google Maps",u:"https://maps.app.goo.gl/PTJn6coPBcRDKbHw5"}]},
  {name:"Smoky Mountains",meta:"Brady · 8 Spots",desc:"Cabin on the quiet side, away from Gatlinburg crowds. Go in October for fall colors that make you forget you're three hours from Nashville.",img:"smokyRockOverlook",links:[]},
  {name:"Las Vegas",meta:"Both Lads",desc:"Best as 3–4 nights. Skip the strip restaurants — the off-strip food scene is where the real value hides.",img:"best_IMG_9695",imgSrc:"hero",links:[]},
  {name:"Charleston",meta:"Brady",desc:"Best food city in the South, and it's not close. King Street for cocktails, Sullivan's Island for the beach day, Husk for the dinner that sells the trip.",img:"best_100_0110",imgSrc:"hero",links:[{t:"One-Pager",u:"charleston.html"}]},
];

const MICH_SPOTS = {
  food: [
    {name:"Zingerman's Deli", area:"Ann Arbor", note:"The Reuben changed the way we think about sandwiches. Not cheap, not sorry.", badge:"Brady"},
    {name:"Frita Batidos", area:"Ann Arbor", note:"Cuban street food. The burger is the move, but the batido makes the meal.", badge:"Brady"},
    {name:"Dearborn Arab Food District", area:"Detroit", note:"Best Middle Eastern food outside the Middle East. Not an exaggeration.", badge:"Brady"},
    {name:"Eastern Market", area:"Detroit", note:"Saturday mornings only. Get there by 8am or don't bother.", badge:"Brady"},
    {name:"Cherry Republic", area:"Traverse City", note:"Everything cherry, and unironically all of it is good.", badge:"Brady"},
    {name:"Grand Traverse Pie Co.", area:"Traverse City", note:"Cherry crumb pie. Order two — one for the road.", badge:"Brady"},
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
    {name:"Sleeping Bear Dunes", area:"Traverse City", note:"Most beautiful place in Michigan, full stop. Pierce Stocking Scenic Drive is free and stunning.", badge:"Brady"},
    {name:"Pictured Rocks", area:"Upper Peninsula", note:"Kayak the shoreline. The colors in the rock face don't look real. Book guides early.", badge:"Brady"},
    {name:"Nordhouse Dunes", area:"Ludington", note:"Backpack to a beach campsite on Lake Michigan. No cars, no buildings, just sand and water.", badge:"Brady"},
    {name:"Mission Peninsula", area:"Traverse City", note:"Underrated wine region. Drive the peninsula, stop at 3–4 wineries, end at the lighthouse.", badge:"Brady"},
    {name:"Torch Lake", area:"Up North", note:"The Caribbean of the Midwest. Not a joke — the water is actually turquoise in July.", badge:"Brady"},
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

const MICH_CATEGORIES = [
  { id: 'food', label: 'Food', icon: '\uD83C\uDF7D\uFE0F' },
  { id: 'breweries', label: 'Breweries', icon: '\uD83C\uDF7A' },
  { id: 'outdoors', label: 'Outdoors', icon: '\u26F0\uFE0F' },
  { id: 'daytrips', label: 'Day Trips', icon: '\uD83D\uDE97' },
  { id: 'hidden', label: 'Hidden Gems', icon: '\u2728' },
];

/* ===== COMPONENT ===== */
export default function NorthAmericaSection() {
  const [michCategory, setMichCategory] = useState('food');
  const [expandedCard, setExpandedCard] = useState(null);

  const getCardImage = (d) => {
    if (d.imgSrc === 'hero') return HERO_IMAGES[d.img];
    return IMAGES[d.img] || NEW_IMAGES[d.img] || BATCH3_IMAGES[d.img] || HERO_IMAGES[d.img];
  };

  return (
    <div className="na-root">
      {/* Section Intro */}
      <section className="na-intro">
        <div className="na-inner">
          <Reveal>
            <div className="na-label">NORTH AMERICA</div>
            <h2 className="na-title">Closer to Home. <em>Same Standards.</em></h2>
            <p className="na-desc">Not every great trip needs a passport.</p>
          </Reveal>
        </div>
      </section>

      {/* Michigan Hero */}
      <section className="na-michigan">
        <div className="na-inner">
          <Reveal type="scale">
            <div className="na-mich-panel">
              <div className="na-mich-header">
                <div>
                  <h3 className="na-mich-title">Lads Local Michigan</h3>
                  <div className="na-mich-subtitle">Home Turf Intelligence</div>
                </div>
                <div className="na-mich-stats">
                  <div className="na-mich-stat"><span className="na-mich-stat-num">46</span><span className="na-mich-stat-label">spots</span></div>
                  <div className="na-mich-stat"><span className="na-mich-stat-num">8</span><span className="na-mich-stat-label">regions</span></div>
                  <div className="na-mich-stat"><span className="na-mich-stat-num">Free</span><span className="na-mich-stat-label">resource</span></div>
                </div>
              </div>

              <p className="na-mich-intro">We grew up here. Every brewery, every trail, every shortcut. Same depth as the international frameworks, except we can also tell you where to park.</p>

              {/* Category Tabs */}
              <div className="na-mich-tabs">
                {MICH_CATEGORIES.map(c => (
                  <button key={c.id}
                    className={`na-mich-tab ${michCategory === c.id ? 'active' : ''}`}
                    onClick={() => setMichCategory(c.id)}
                  >{c.label}</button>
                ))}
              </div>

              {/* Spots List */}
              <div className="na-mich-spots">
                {MICH_SPOTS[michCategory].map((spot, i) => (
                  <Reveal key={spot.name} delay={i * 40}>
                    <div className="na-mich-spot">
                      <div className="na-mich-spot-main">
                        <div className="na-mich-spot-name">{spot.name}</div>
                        <div className="na-mich-spot-area">{spot.area}</div>
                      </div>
                      <div className="na-mich-spot-note">{spot.note}</div>
                      <div className="na-mich-spot-badge">{spot.badge}</div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Domestic Destination Cards */}
      <section className="na-destinations">
        <div className="na-inner">
          <Reveal>
            <h3 className="na-dest-title">Beyond Michigan</h3>
            <p className="na-dest-desc">Same depth. Shorter flight.</p>
          </Reveal>

          <div className="na-dest-grid">
            {DOMESTIC.map((d, i) => {
              const img = getCardImage(d);
              const isExpanded = expandedCard === i;
              return (
                <Reveal key={d.name} delay={i * 60}>
                  <div className={`na-dest-card ${isExpanded ? 'expanded' : ''}`}
                    onClick={() => setExpandedCard(isExpanded ? null : i)}>
                    <div className="na-dest-card-img">
                      {img && <img src={img} alt={d.name} loading="lazy" />}
                      <div className="na-dest-card-overlay" />
                      <div className="na-dest-card-name-overlay">
                        <div className="na-dest-card-meta-badge">{d.meta}</div>
                        <div className="na-dest-card-name-text">{d.name}</div>
                      </div>
                    </div>
                    <div className="na-dest-card-body">
                      <p className="na-dest-card-desc">{d.desc}</p>
                      {d.links.length > 0 && (
                        <div className="na-dest-card-links">
                          {d.links.map(link => (
                            <a key={link.t} href={link.u} className="na-dest-card-link"
                              onClick={e => e.stopPropagation()} target="_blank" rel="noopener noreferrer">{link.t}</a>
                          ))}
                        </div>
                      )}
                      <div className="na-dest-card-expand">
                        {isExpanded ? 'Less' : 'The honest take +'}
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pull quote */}
      <div className="na-quote">
        <Reveal type="fade">
          <blockquote className="na-quote-text">
            "You don't need to cross an ocean to have the best weekend of your life."
          </blockquote>
        </Reveal>
      </div>
    </div>
  );
}
