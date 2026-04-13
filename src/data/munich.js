// Munich Oktoberfest — Data Model v2
// 9 spots reclassified, research layer filled, personal layer blank for Brady

export default {
  id: 'munich',
  name: 'Munich Oktoberfest',
  region: 'Germany',
  route: '/munich',
  tagline: 'Tent strategy, cost intelligence, and day trips for a group of 4-10.',
  confidence: 'Research-Based',
  heroStats: [
    { value: 'Sept 19', label: 'Festival Opens' },
    { value: '4-10', label: 'Group Size' },
    { value: '3', label: 'Tent Sessions' },
  ],

  palette: {
    bg: '#15120e',
    surface: '#1c1810',
    elevated: '#242018',
    accent: '#b89050',
  },

  overview: {
    quickRead: 'Oktoberfest is not a pub crawl — it is a tent strategy problem. The difference between a great trip and a wasted one comes down to which tents you pick, when you arrive, and how many sessions you commit to. Three properly executed sessions across five days is the move.',
    budget: '€330-380 lean to €620-750 generous (experience only). All-in with flights and accommodation: $1,800-$2,800 per person.',
    framework: 'Built from research across multiple Oktoberfest seasons. Tent rankings, cost models, and day trip logistics sourced from verified reports and local intelligence. Not yet personally validated.',
    philosophy: 'Oktoberfest rewards the group that commits to fewer tents and stays longer. Tent-hopping wastes time and guarantees you never get a seat. Pick your three sessions, arrive early, and stay put.',
  },

  timingWindows: [
    { id: 'week1', name: 'Opening Weekend (Sep 19-21)', recommended: true, atmosphere: 'Peak energy, massive crowds', crowdMix: '50/50', pubExperience: 'Maximum chaos', priceTier: 'Highest', primaryDraw: 'Opening ceremony, first keg tapped', verdict: 'Best energy, hardest entry', detail: 'The mayor taps the first keg at noon Saturday. Augustiner fills by 7am opening day. Arrive Thursday to settle in. Book accommodation 6+ months ahead.' },
    { id: 'midweek', name: 'Midweek (Tue-Thu)', recommended: true, atmosphere: 'Relaxed, achievable', crowdMix: '40% local', pubExperience: 'Seats available, better atmosphere', priceTier: 'Moderate', primaryDraw: 'Realistic tent entry', verdict: 'The smart play', detail: 'Tents accessible until noon. Locals come after work. Less tourist chaos. Same beer, same music, better experience. Family days on Tuesdays.' },
  ],

  itinerary: [
    { day: 'Day 1', anchor: 'Arrival + Munich', stops: 'Settle in Glockenbachviertel, Viktualienmarkt lunch, English Garden' },
    { day: 'Day 2', anchor: 'Tent Session 1', stops: 'Augustiner-Brau (arrive 8:30am), full session, evening at local bars' },
    { day: 'Day 3', anchor: 'Recovery + Day Trip', stops: 'Neuschwanstein Castle or Salzburg day trip' },
    { day: 'Day 4', anchor: 'Tent Session 2', stops: 'Hacker-Pschorr midday, transition to Hofbrau evening' },
    { day: 'Day 5', anchor: 'Tent Session 3 + Departure', stops: 'Paulaner morning session, Viktualienmarkt farewell lunch' },
  ],

  // ===== V2 SPOTS — RECLASSIFIED WITH RESEARCH LAYER =====
  spots: [
    // ── OKTOBERFEST TENTS ──
    {
      name: 'Augustiner-Brau', city: 'Munich', neighborhood: 'Theresienwiese',
      category: 'Beer Hall / Beer Garden', subcategory: 'Oktoberfest tent',
      vibeTags: ['Send It', 'Take It All In', 'Show Them Everything'],
      description: 'The locals\' tent. Wooden kegs tapped by hand — the only tent that still does this. Best beer on the Wiesn by consensus. Hardest to get into — arrive before 9am on weekends.',
      priceRange: '$$', hours: 'During Oktoberfest: Mon-Fri 10am-11:30pm, Sat-Sun 9am-11:30pm',
      happyHour: 'N/A', wayToSave: 'No reservations for the beer garden section — arrive early. A Mass (1L) is ~€14-15. Bring cash.',
      bestTime: 'morning', address: 'Theresienwiese, 80339 Munchen',
      coordinates: { lat: 48.1319, lng: 11.5492 }, website: 'https://www.augustiner-braeu.de',
      ladsTake: '', story: '', forWho: '',
      validated: true, validator: 'Research', visitDate: '', featured: true, photoKey: '',
    },
    {
      name: 'Hacker-Pschorr (Himmel der Bayern)', city: 'Munich', neighborhood: 'Theresienwiese',
      category: 'Beer Hall / Beer Garden', subcategory: 'Oktoberfest tent',
      vibeTags: ['Send It', 'Take It All In', 'Show Them Everything'],
      description: 'The painted ceiling depicting a Bavarian sky is iconic. Excellent atmosphere, strong beer, slightly easier entry than Augustiner. "Heaven of the Bavarians."',
      priceRange: '$$', hours: 'During Oktoberfest: Mon-Fri 10am-11:30pm, Sat-Sun 9am-11:30pm',
      happyHour: 'N/A', wayToSave: 'Weekday midday entry is achievable without queueing at dawn. Beer garden section no reservation needed.',
      bestTime: 'morning', address: 'Theresienwiese, 80339 Munchen',
      coordinates: { lat: 48.1315, lng: 11.5488 }, website: '',
      ladsTake: '', story: '', forWho: '',
      validated: true, validator: 'Research', visitDate: '', featured: true, photoKey: '',
    },
    {
      name: 'Paulaner', city: 'Munich', neighborhood: 'Theresienwiese',
      category: 'Beer Hall / Beer Garden', subcategory: 'Oktoberfest tent',
      vibeTags: ['Send It', 'Show Them Everything'],
      description: 'High energy. Popular with younger crowds. Good music, solid beer. More accessible than the Tier 1 tents on weekdays.',
      priceRange: '$$', hours: 'During Oktoberfest: Mon-Fri 10am-11:30pm, Sat-Sun 9am-11:30pm',
      happyHour: 'N/A', wayToSave: 'Easier entry than Augustiner/Hacker. Good first-timer tent.',
      bestTime: 'morning', address: 'Theresienwiese, 80339 Munchen',
      coordinates: { lat: 48.1322, lng: 11.5500 }, website: '',
      ladsTake: '', story: '', forWho: '',
      validated: true, validator: 'Research', visitDate: '', featured: false, photoKey: '',
    },
    {
      name: 'Hofbrau', city: 'Munich', neighborhood: 'Theresienwiese',
      category: 'Beer Hall / Beer Garden', subcategory: 'Oktoberfest tent',
      vibeTags: ['Send It', 'Show Them Everything'],
      description: 'The tourist tent. Standing room is open entry — no reservation needed. Loudest, most chaotic. Good for one session, not three.',
      priceRange: '$$', hours: 'During Oktoberfest: Mon-Fri 10am-11:30pm, Sat-Sun 9am-11:30pm',
      happyHour: 'N/A', wayToSave: 'Standing room is the easiest entry on the Wiesn. Go once for the chaos, then graduate to better tents.',
      bestTime: 'afternoon', address: 'Theresienwiese, 80339 Munchen',
      coordinates: { lat: 48.1316, lng: 11.5495 }, website: '',
      ladsTake: '', story: '', forWho: '',
      validated: true, validator: 'Research', visitDate: '', featured: false, photoKey: '',
    },

    // ── MUNICH CITY ──
    {
      name: 'Glockenbachviertel', city: 'Munich', neighborhood: 'South of Altstadt',
      category: 'Neighborhood', subcategory: 'Nightlife / food district',
      vibeTags: ['Send It', 'Just Us'],
      description: 'Munich\'s best neighborhood for food and nightlife outside the festival. Walkable to Theresienwiese. Where locals actually go out. Bars, restaurants, and a scene that exists year-round.',
      priceRange: '$$', hours: 'Always accessible',
      happyHour: 'N/A', wayToSave: 'Stay here instead of the Altstadt — better food, better bars, lower prices, 15-min walk to the Wiesn.',
      bestTime: 'evening', address: 'Glockenbachviertel, Munich',
      coordinates: { lat: 48.1280, lng: 11.5700 }, website: '',
      ladsTake: '', story: '', forWho: '',
      validated: true, validator: 'Research', visitDate: '', featured: false, photoKey: '',
    },
    {
      name: 'Viktualienmarkt', city: 'Munich', neighborhood: 'Altstadt',
      category: 'Market / Food Hall', subcategory: 'Outdoor market / beer garden',
      vibeTags: ['Take It All In', 'Show Them Everything'],
      description: 'Open-air food market with a beer garden in the center. Operating since 1807. Best lunch stop in the city. The beer garden rotates between Munich\'s six major breweries.',
      priceRange: '$$', hours: 'Market Mon-Sat 8am-8pm, Beer garden Mon-Sat 9am-10pm',
      happyHour: 'N/A', wayToSave: 'Market stalls for lunch (€5-10). Beer garden allows you to bring your own food from the market stalls — just buy the beer.',
      bestTime: 'morning', address: 'Viktualienmarkt 3, 80331 Munchen',
      coordinates: { lat: 48.1352, lng: 11.5764 }, website: 'https://www.viktualienmarkt-muenchen.de',
      ladsTake: '', story: '', forWho: '',
      validated: true, validator: 'Research', visitDate: '', featured: true, photoKey: '',
    },
    {
      name: 'English Garden', city: 'Munich', neighborhood: 'Schwabing',
      category: 'Park / Garden', subcategory: 'Urban park / beer gardens',
      vibeTags: ['Take It All In', 'Unplug'],
      description: 'Larger than Central Park. Beer gardens inside (Chinesischer Turm, Seehaus). Surfers on the Eisbach wave year-round. Recovery day destination after a tent session.',
      priceRange: '$', hours: 'Always accessible',
      happyHour: 'N/A', wayToSave: 'Free to enter. Beer gardens inside have reasonable prices. Watch the Eisbach surfers for free.',
      bestTime: 'afternoon', address: 'Englischer Garten, 80538 Munchen',
      coordinates: { lat: 48.1528, lng: 11.5919 }, website: '',
      ladsTake: '', story: '', forWho: '',
      validated: true, validator: 'Research', visitDate: '', featured: false, photoKey: '',
    },
    {
      name: 'Marienplatz', city: 'Munich', neighborhood: 'Altstadt',
      category: 'Landmark', subcategory: 'Historic square',
      vibeTags: ['Take It All In', 'Show Them Everything'],
      description: 'Main square. Glockenspiel at 11am and noon (daily, plus 5pm in summer). Orientation point — not a destination you linger at. Neues Rathaus tower has views.',
      priceRange: 'Free', hours: 'Always accessible. Glockenspiel 11am, 12pm (+ 5pm May-Oct)',
      happyHour: 'N/A', wayToSave: 'Free. Tower climb ~€4 for views. Do not eat at the restaurants here.',
      bestTime: 'morning', address: 'Marienplatz 1, 80331 Munchen',
      coordinates: { lat: 48.1373, lng: 11.5753 }, website: '',
      ladsTake: '', story: '', forWho: '',
      validated: true, validator: 'Research', visitDate: '', featured: false, photoKey: '',
    },

    // ── ACCOMMODATION ──
    {
      name: 'Schwan Locke', city: 'Munich', neighborhood: 'Glockenbachviertel',
      category: 'Accommodation', subcategory: 'Apart-hotel',
      vibeTags: ['Just Us'],
      description: 'Apart-hotel with kitchenettes. 15-minute walk to the Wiesn. €475-600 for 5 nights. In a neighborhood with actual restaurants and bars instead of tourist traps.',
      priceRange: '$$', hours: '24/7',
      happyHour: 'N/A', wayToSave: 'Kitchenette saves on breakfast costs. Book 4-6 months ahead for Oktoberfest dates.',
      bestTime: 'any', address: 'Landwehrstrasse 75, 80336 Munchen',
      coordinates: { lat: 48.1320, lng: 11.5600 }, website: 'https://www.lockeliving.com/en/munich/schwan-locke',
      ladsTake: '', story: '', forWho: '',
      validated: true, validator: 'Research', visitDate: '', featured: false, photoKey: '',
    },
  ],

  // ===== LEGACY CATEGORIES =====
  categories: [
    { name: 'Oktoberfest Tents', id: 'tents', spots: [] },
    { name: 'Accommodation', id: 'accommodation', spots: [] },
    { name: 'Neighborhood', id: 'neighborhood', spots: [] },
  ],

  dayTrips: [
    { name: 'Neuschwanstein Castle', from: 'Munich', description: '1.5 hours by train. The castle that inspired Disney. Book tickets 60 days ahead at hohenschwangau.de — they sell out. €23.50 entry. Guided tours only.', price: '€23.50', bookingNote: 'Book 60 days ahead at hohenschwangau.de' },
    { name: 'Salzburg', from: 'Munich', description: '1.5 hours by train. Bayern Ticket covers up to 5 people for €64 total. Mozart\'s birthplace, Festung Hohensalzburg, Mirabell Gardens. Worth a full day.', price: '€64 Bayern Ticket (up to 5 people)' },
  ],

  mapsLinks: [],

  logistics: {
    flights: 'Icelandair ORD-KEF-MUC with Iceland stopover option. $625-750 round trip. Book 3-4 months out for Oktoberfest dates.',
    inCountry: 'Group Day Ticket ~€29/day covers all public transit in Munich for up to 5 people. Bayern Ticket €64 for up to 5 people on regional trains across Bavaria.',
    gettingAround: 'U-Bahn to Theresienwiese (U4/U5). Walking from Glockenbachviertel is 15 minutes. Taxis after tent sessions — Uber works but surges hard.',
    tipping: 'Round up to the nearest euro on drinks. Servers in tents carry 10+ liters at once — they earn it.',
  },

  costModel: {
    headers: ['Category', 'Lean', 'Generous'],
    rows: [
      ['Flights (ORD)', '$625', '$750'],
      ['Accommodation (5 nights)', '€475', '€600'],
      ['Tent Sessions (3)', '€120', '€200'],
      ['Food & Drink (off-Wiesn)', '€120', '€250'],
      ['Day Trips', '€50', '€100'],
      ['Transit', '€30', '€50'],
    ],
    totals: ['All-In Total', '~$1,800', '~$2,800'],
    lean: '€330-380 experience only. Stay in hostels, eat at Viktualienmarkt, limit tent sessions to 2.',
  },

  mistakes: [
    { title: 'Tent-Hopping', detail: 'You will not get back into a tent once you leave. Pick one per session and commit.' },
    { title: 'Arriving Mid-Day', detail: 'Tents fill by 10am on weekends, noon on weekdays. If you are not in line by 9am Saturday, you are not getting a seat.' },
    { title: 'Spending the Whole Trip on the Wiesn', detail: 'Three sessions is enough. Munich has excellent food, beer gardens, and day trips outside the festival.' },
    { title: 'Under-Tipping', detail: 'Round up to the nearest euro on drinks. Servers in tents carry 10+ liters at once — they earn it.' },
    { title: 'Buying Fake Entry Tickets', detail: 'There is no general entry ticket to Oktoberfest. Entry to the Wiesn grounds is free. Anyone selling "tickets" is scamming you.' },
    { title: 'Anchoring at Hofbrau', detail: 'It is the easiest tent to enter because it has the highest tourist concentration. Go once for the experience, then move to Augustiner or Hacker-Pschorr.' },
  ],

  ladsTake: 'Three properly executed tent sessions beat six half-sessions.',

  specialCallouts: [],

  navSections: ['Overview', 'Tent Strategy', 'Day Trips', 'Accommodation', 'Flights', 'Costs'],
};
