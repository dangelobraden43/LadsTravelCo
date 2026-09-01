// Vienna — Data Model v2
// SPLIT OUT OF prague.js on August 29, 2026.
//
// This is a SEPARATION, not a rewrite. All 8 spots below were moved verbatim
// out of the `Prague + Vienna + Dresden` framework — same fields, same
// descriptions, same coordinates, same validation flags. Nothing was authored,
// re-researched or embellished in the move.
//
// Dresden did NOT come with Vienna. It stays in prague.js because it is a
// Prague day trip (2 hours by train, and it carries a `from: 'Prague'` dayTrip
// entry). Vienna is 250 km the other way.
//
// COUNT DISCIPLINE: prague.js was a 25-spot live-walk before the split
// (Prague 11 + Vienna 8 + Dresden 4 + 2 day trips). After the split it is
// prague 17 + vienna 8 = 25. The canonical site total was 219 at the time of this split (220 since Aug 31 2026, via michigan.js) —
// spots moved between files, none were created or destroyed.
//
// The personal layer (ladsTake / story / forWho) is blank here exactly as it
// was in prague.js. Brady fills those; they cannot be AI-generated.

export default {
  id: 'vienna',
  name: 'Vienna',
  region: 'Central Europe',
  route: '/vienna',
  tagline: 'Imperial capital. Coffee houses, palaces, and Klimt.',
  confidence: 'Brady — Personally Validated',
  heroStats: [
    { value: '8', label: 'Database Spots' },
    { value: '1', label: 'Google Maps List' },
    { value: '1', label: 'Country' },
  ],

  // Habsburg burgundy — deliberately distinct from Prague's violet (#9a8bc2).
  // House rule: never reuse another framework's palette.
  palette: {
    bg: '#191114',
    surface: '#221619',
    elevated: '#2b1d21',
    accent: '#a85c62',
  },

  overview: {
    quickRead:
      'Brady visited Vienna as the second half of a Central European trip. 8 rated spots. Grander and more expensive than Prague — the palaces and coffee houses are the product.',
    budget: '$1,800-$3,200 per person for the combined Central Europe trip',
    framework:
      'Vienna 2-3 days. Most often paired with Prague — RegioJet or OBB connects the two in 4 hours for $15-25. Open-jaw: fly into one, out the other.',
    philosophy:
      'Vienna rewards slowing down. The coffee houses are not a caffeine stop, they are the attraction — sitting for two hours is the correct use of one.',
    ladsBothKnow:
      'Brady visited Vienna firsthand. The coffee houses, the palace gardens, the Ferris wheel. Every spot below is one he stood in.',
  },

  timingWindows: [
    {
      id: 'spring',
      name: 'Spring (Apr-May)',
      recommended: true,
      atmosphere: 'Warm, gardens open',
      crowdMix: '50/50',
      pubExperience: 'Terrace season starts',
      priceTier: 'Moderate',
      primaryDraw: 'Palace gardens in bloom, pleasant weather',
      verdict: 'Best window',
      detail:
        '15-22°C. Schonbrunn and Belvedere gardens at their best. Shoulder pricing on flights.',
    },
    {
      id: 'christmas',
      name: 'Christmas Markets (Dec)',
      recommended: true,
      atmosphere: 'Festive, cold, atmospheric',
      crowdMix: '60% tourist',
      pubExperience: 'Mulled wine, indoor cafes',
      priceTier: 'Moderate-High',
      primaryDraw: 'Rathausplatz Christmas market',
      verdict: 'Magical if you embrace the cold',
      detail:
        'Vienna Rathausplatz market is one of the biggest in Europe. Below freezing, but the coffee houses are built for exactly this.',
    },
    {
      id: 'summer',
      name: 'Summer (Jun-Aug)',
      recommended: false,
      atmosphere: 'Hot, crowded',
      crowdMix: '70% tourist',
      pubExperience: 'Outdoor everything',
      priceTier: 'High',
      primaryDraw: 'Longest days, festivals',
      verdict: 'Crowded and hot',
      detail: '30°C+. Palace queues at their worst and prices peak.',
    },
  ],

  itinerary: [
    {
      day: 'Day 1',
      anchor: 'Arrival + Innere Stadt',
      stops: "Naschmarkt, St. Stephen's tower climb",
    },
    {
      day: 'Day 2',
      anchor: 'Palace Day',
      stops: 'Schonbrunn morning, Belvedere afternoon, Cafe Central',
    },
    {
      day: 'Day 3',
      anchor: 'Museums + Departure',
      stops: 'Albertina or MuseumsQuartier, Prater Ferris wheel, departure',
    },
  ],

  spots: [
    {
      name: 'Schonbrunn Palace',
      city: 'Vienna',
      neighborhood: 'Hietzing',
      category: 'Historical Site',
      subcategory: 'Imperial palace',
      vibeTags: ['Take It All In', 'Show Them Everything'],
      description:
        'Habsburg summer residence. 1,441 rooms. Gardens are free and enormous — the Gloriette hilltop view is worth the walk. The palace tour is worth the fee for the state rooms.',
      priceRange: '$$',
      hours: 'Apr-Oct 8:30am-6:30pm, Nov-Mar 8:30am-5:30pm',
      happyHour: 'N/A',
      wayToSave:
        'Gardens free. Imperial Tour (22 rooms, €22) is sufficient — skip the Grand Tour unless you love Habsburg history.',
      bestTime: 'morning',
      address: 'Schonbrunner Schlossstrasse 47, 1130 Wien',
      coordinates: { lat: 48.1845, lng: 16.3122 },
      website: 'https://www.schoenbrunn.at',
      ladsTake: '',
      story: '',
      forWho: '',
      validated: true,
      validator: 'Brady',
      visitDate: '',
      featured: true,
      photoKey: '',
    },
    {
      name: 'Naschmarkt',
      city: 'Vienna',
      neighborhood: 'Wieden',
      category: 'Market / Food Hall',
      subcategory: 'Outdoor market',
      vibeTags: ['Take It All In', 'Show Them Everything'],
      description:
        "Vienna's main outdoor market since the 16th century. 120+ stalls. Go hungry. Falafel, Turkish food, cheese, wine — the variety is enormous. Saturday flea market adjacent.",
      priceRange: '$$',
      hours: 'Mon-Fri 6am-9pm, Sat 6am-6pm, closed Sun',
      happyHour: 'N/A',
      wayToSave:
        'Eat at the stalls inside the market (€5-10) instead of the sit-down restaurants flanking it (€15-25).',
      bestTime: 'morning',
      address: 'Rechte Wienzeile 35, 1040 Wien',
      coordinates: { lat: 48.1993, lng: 16.3637 },
      website: 'https://www.naschmarkt-vienna.com',
      ladsTake: '',
      story: '',
      forWho: '',
      validated: true,
      validator: 'Brady',
      visitDate: '',
      featured: true,
      photoKey: '',
    },
    {
      name: "St. Stephen's Cathedral",
      city: 'Vienna',
      neighborhood: 'Innere Stadt',
      category: 'Religious / Spiritual',
      subcategory: 'Gothic cathedral',
      vibeTags: ['Take It All In', 'Show Them Everything'],
      description:
        "Vienna's Gothic heart. The south tower climb (343 steps) has the best view in the city. The catacombs contain the Habsburgs' organs in urns.",
      priceRange: '$',
      hours: 'Mon-Sat 9am-11:30am & 1-4:30pm, Sun 1-4:30pm. Towers daily 9am-7pm',
      happyHour: 'N/A',
      wayToSave:
        'Cathedral entry free during worship. South tower climb €6. Catacombs €6. Both worth it.',
      bestTime: 'morning',
      address: 'Stephansplatz 3, 1010 Wien',
      coordinates: { lat: 48.2085, lng: 16.3731 },
      website: 'https://www.stephanskirche.at',
      ladsTake: '',
      story: '',
      forWho: '',
      validated: true,
      validator: 'Brady',
      visitDate: '',
      featured: false,
      photoKey: '',
    },
    {
      name: 'Belvedere',
      city: 'Vienna',
      neighborhood: 'Landstrasse',
      category: 'Museum / Gallery',
      subcategory: 'Baroque palace / art museum',
      vibeTags: ['Take It All In', 'Show Them Everything'],
      description:
        "Baroque palace complex. Klimt's The Kiss is in the Upper Belvedere — the reason you come. The gardens between upper and lower palaces are free and beautiful.",
      priceRange: '$$',
      hours: 'Upper daily 9am-6pm, Lower daily 10am-6pm',
      happyHour: 'N/A',
      wayToSave:
        "Gardens free. Upper Belvedere (€16.70) for The Kiss. Skip Lower unless you're an art completist.",
      bestTime: 'morning',
      address: 'Prinz Eugen-Strasse 27, 1030 Wien',
      coordinates: { lat: 48.1914, lng: 16.3808 },
      website: 'https://www.belvedere.at',
      ladsTake: '',
      story: '',
      forWho: '',
      validated: true,
      validator: 'Brady',
      visitDate: '',
      featured: false,
      photoKey: '',
    },
    {
      name: 'Albertina',
      city: 'Vienna',
      neighborhood: 'Innere Stadt',
      category: 'Museum / Gallery',
      subcategory: 'Art museum',
      vibeTags: ['Take It All In', 'Unplug'],
      description:
        'Major art museum. Monet, Picasso, Klimt, Munch. World-class permanent collection plus rotating exhibitions. Wed and Fri late nights until 9pm.',
      priceRange: '$$',
      hours: 'Daily 10am-6pm, Wed & Fri until 9pm',
      happyHour: 'N/A',
      wayToSave: 'Wednesday/Friday evenings (6-9pm) are less crowded. Under-19 free.',
      bestTime: 'afternoon',
      address: 'Albertinaplatz 1, 1010 Wien',
      coordinates: { lat: 48.2047, lng: 16.3683 },
      website: 'https://www.albertina.at',
      ladsTake: '',
      story: '',
      forWho: '',
      validated: true,
      validator: 'Brady',
      visitDate: '',
      featured: false,
      photoKey: '',
    },
    {
      name: 'Cafe Central',
      city: 'Vienna',
      neighborhood: 'Innere Stadt',
      category: 'Restaurant — Casual',
      subcategory: 'Viennese coffee house',
      vibeTags: ['Take It All In', 'Show Them Everything'],
      description:
        "Vienna's most famous coffee house. Freud, Trotsky, and Tito were regulars. Go for the experience — the architecture and atmosphere are the product. NOTE: Closed Mar 2026 through autumn 2026 for renovation.",
      priceRange: '$$',
      hours: 'Mon-Sat 8am-10pm, Sun 10am-10pm (CLOSED FOR RENOVATION until late 2026)',
      happyHour: 'N/A',
      wayToSave:
        'A melange (Viennese cappuccino) and cake is the classic order (~€12). The experience is the value.',
      bestTime: 'morning',
      address: 'Herrengasse 14, 1010 Wien',
      coordinates: { lat: 48.2097, lng: 16.3659 },
      website: 'https://cafecentral.wien/en',
      ladsTake: '',
      story: '',
      forWho: '',
      validated: true,
      validator: 'Brady',
      visitDate: '',
      featured: true,
      photoKey: '',
    },
    {
      name: 'MuseumsQuartier',
      city: 'Vienna',
      neighborhood: 'Neubau',
      category: 'Museum / Gallery',
      subcategory: 'Cultural complex',
      vibeTags: ['Take It All In', 'Unplug'],
      description:
        'One of the largest cultural complexes in the world. Leopold Museum (Schiele, Klimt), MUMOK (modern art), Kunsthalle. The courtyard is a hangout spot with colorful benches.',
      priceRange: '$$',
      hours: 'Courtyards 24/7. Museums vary (most Tue-Sun 10am-6pm)',
      happyHour: 'N/A',
      wayToSave: 'Courtyard is free and atmospheric. Pick one museum instead of trying all three.',
      bestTime: 'afternoon',
      address: 'Museumsplatz 1, 1070 Wien',
      coordinates: { lat: 48.2032, lng: 16.3583 },
      website: 'https://www.mqw.at',
      ladsTake: '',
      story: '',
      forWho: '',
      validated: true,
      validator: 'Brady',
      visitDate: '',
      featured: false,
      photoKey: '',
    },
    {
      name: 'Prater',
      city: 'Vienna',
      neighborhood: 'Leopoldstadt',
      category: 'Activity / Tour',
      subcategory: 'Amusement park / Ferris wheel',
      vibeTags: ['Send It', 'Show Them Everything'],
      description:
        'Giant Ferris wheel (Riesenrad) and amusement park. Iconic Vienna landmark from The Third Man. The Ferris wheel ride gives views over the entire city.',
      priceRange: '$$',
      hours: 'Riesenrad daily 9am-10pm (high season), shorter in winter',
      happyHour: 'N/A',
      wayToSave:
        'Riesenrad ticket ~€14. The park itself is free to walk through. Skip the VIP cabin.',
      bestTime: 'evening',
      address: 'Gaudeegasse 1, 1020 Wien',
      coordinates: { lat: 48.2167, lng: 16.3967 },
      website: 'https://wienerriesenrad.com',
      ladsTake: '',
      story: '',
      forWho: '',
      validated: true,
      validator: 'Brady',
      visitDate: '',
      featured: false,
      photoKey: '',
    },
  ],

  // ===== LEGACY CATEGORIES =====
  categories: [{ name: 'Vienna Highlights', id: 'vienna-highlights', spots: [] }],

  // No day trips recorded. Prague is 4 hours by train and is its own framework,
  // so it is deliberately NOT listed here as a "day trip" — that would be false.
  dayTrips: [],

  mapsLinks: [{ name: 'Vienna', url: 'https://maps.app.goo.gl/R4TC9toa9oP5qJed8' }],

  logistics: {
    flights:
      'Fly into Vienna or Prague, out the other. Open-jaw saves backtracking. Flights from ORD $450-$700.',
    inCountry: 'RegioJet or OBB Vienna to Prague: 4 hours, $15-$25. Comfortable, scenic, cheap.',
    gettingAround: 'Vienna is walkable and the U-Bahn is excellent. 24hr pass €8.',
    tipping: 'Austria: 5-10%. Never 20%.',
  },

  costModel: {
    headers: ['Category', 'Vienna'],
    rows: [
      ['Food/day', '$40-$65'],
      ['Beer', '$4-$6'],
      ['Flights (ORD)', '$450-$700'],
      ['Total (7-10 days)', '$1,800-$3,200'],
    ],
    totals: ['Combined Central Europe Trip Total', '$1,800-$3,200'],
  },

  mistakes: [
    {
      title: 'Skipping the Beisl',
      detail:
        'A Beisl is a traditional Viennese pub-restaurant. Schnitzel, goulash, local beer. Skip the upscale restaurants and eat where locals eat.',
    },
    {
      title: 'Treating a Coffee House Like a Coffee Shop',
      detail:
        'You are buying a table for as long as you want it. Ordering a melange and leaving in ten minutes misses the entire point.',
    },
    {
      title: 'Trying 3 Cities in 5 Days',
      detail:
        'Vienna deserves 2-3 full days minimum. Rushing means missing the coffee houses and the palace gardens that make the city.',
    },
  ],

  ladsTake: 'Vienna is the grand one. Prague is the value — Vienna is the splurge.',

  specialCallouts: [
    {
      title: 'Cafe Central Closure 2026',
      detail:
        'Cafe Central Vienna is closed from March 2026 through autumn 2026 for renovation. Alternative: Cafe Sperl (Gumpendorfer Str. 11) for a similar experience.',
    },
  ],

  navSections: ['Overview', 'Vienna', 'Maps', 'Logistics'],
}
