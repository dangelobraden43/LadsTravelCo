// Poland — Data Model v2
// 12 spots reclassified, research layer filled, personal layer blank for Brady

export default {
  id: 'poland',
  name: 'Poland August',
  region: 'Eastern Europe',
  route: '/poland',
  tagline: 'Krakow, Warsaw, Gdansk. Three versions, one south-to-north route.',
  confidence: 'Research-Based',
  heroStats: [
    { value: 'Aug 15-31', label: 'Window' },
    { value: '4-8', label: 'Group Size' },
    { value: '3', label: 'City Versions' },
  ],

  palette: {
    bg: '#12110f',
    surface: '#1a1816',
    elevated: '#222019',
    accent: '#c9a84c',
  },

  overview: {
    quickRead: 'Poland is the best value trip in Europe. Three cities, south to north: Krakow for nightlife and history, Warsaw for culture and food, Gdansk for the Baltic coast. Three versions scale from 6 to 10 days depending on how deep you want to go.',
    budget: 'Version A (6 days) ~$1,555. Version B (8 days) ~$1,850. Version C (10 days) ~$2,140. All-in from ORD.',
    framework: 'Built from research across multiple sources. LOT Polish Airlines runs nonstop ORD-WAR. The south-to-north route (Krakow → Warsaw → Gdansk) is the most efficient and ends at the coast.',
    philosophy: 'Poland rewards the group that slows down. The history is heavy, the nightlife is world-class, and the food costs almost nothing. Do not rush through Krakow to check boxes in Warsaw.',
  },

  timingWindows: [
    { id: 'august', name: 'August', recommended: true, atmosphere: 'Warm, lively, festival season', crowdMix: '50/50', pubExperience: 'Outdoor bars, beer gardens', priceTier: 'Moderate', primaryDraw: 'Best weather, Baltic coast swimming', verdict: 'The window', detail: '25-30°C. All three cities at their best. Gdansk beach season. Krakow nightlife peaks. Long daylight hours. This is the framework timing window.' },
    { id: 'winter', name: 'Winter (Dec-Feb)', recommended: false, atmosphere: 'Cold, atmospheric, Christmas markets', crowdMix: '80% local', pubExperience: 'Indoor bars, mulled wine', priceTier: 'Low', primaryDraw: 'Krakow Christmas market, lowest prices', verdict: 'Different trip', detail: 'Below freezing. Krakow Christmas market is excellent. Gdansk not worth the cold. Warsaw less appealing. Budget $300-500 less than summer.' },
  ],

  itinerary: [
    { day: 'Day 1-2', anchor: 'Krakow', stops: 'Old Town, Wawel Castle, Kazimierz nightlife (Alchemia, Singer)' },
    { day: 'Day 3', anchor: 'Auschwitz', stops: 'Full day: guided tour of Auschwitz-Birkenau. Book 90 days ahead.' },
    { day: 'Day 4', anchor: 'Krakow Day Trip', stops: 'Wieliczka Salt Mine or Zakopane & the Tatras' },
    { day: 'Day 5-6', anchor: 'Warsaw', stops: 'Pendolino train, Old Town, Warsaw Rising Museum, Praga district' },
    { day: 'Day 7-8', anchor: 'Gdansk', stops: 'Train north, Old Town, WWII Museum, European Solidarity Centre, Sopot beach' },
  ],

  // ===== V2 SPOTS — RECLASSIFIED WITH RESEARCH LAYER =====
  spots: [
    // ── KRAKOW NIGHTLIFE ──
    {
      name: 'Alchemia', city: 'Krakow', neighborhood: 'Kazimierz',
      category: 'Bar', subcategory: 'Bohemian bar',
      vibeTags: ['Send It', 'Take It All In'],
      description: 'The anchor bar of Kazimierz. Candlelit, dark, bohemian. Live music in the basement. This is where the night starts in Krakow. Open incredibly late.',
      priceRange: '$', hours: 'Mon 10am-4am, Tue-Sun 9am-4am',
      happyHour: 'None known', wayToSave: 'Already cheap. Beer 10-15 PLN (~$2.50-4). The basement concerts are free or very cheap cover.',
      bestTime: 'evening', address: 'ul. Estery 5, 31-056 Krakow',
      coordinates: { lat: 50.0519, lng: 19.9447 }, website: 'https://alchemia.com.pl',
      ladsTake: '', story: '', forWho: '',
      validated: true, validator: 'Research', visitDate: '', featured: true, photoKey: '',
    },
    {
      name: 'Singer', city: 'Krakow', neighborhood: 'Kazimierz',
      category: 'Bar', subcategory: 'Atmospheric bar',
      vibeTags: ['Take It All In', 'Just Us'],
      description: 'Sewing machines as tables. Candles in bottles. One of the most atmospheric bars in Europe. On Plac Nowy. Open until 6am on weekends.',
      priceRange: '$', hours: 'Sun-Thu 9am-4am, Fri-Sat 10am-6am',
      happyHour: 'None known', wayToSave: 'Drinks are already some of the cheapest in Europe. Vodka shots 5-8 PLN.',
      bestTime: 'evening', address: 'ul. Estery 20, 31-056 Krakow',
      coordinates: { lat: 50.0515, lng: 19.9451 }, website: '',
      ladsTake: '', story: '', forWho: '',
      validated: true, validator: 'Research', visitDate: '', featured: true, photoKey: '',
    },
    {
      name: 'HEVRE', city: 'Krakow', neighborhood: 'Kazimierz',
      category: 'Cocktail Bar', subcategory: 'Converted synagogue bar',
      vibeTags: ['Send It', 'Show Them Everything'],
      description: 'Former synagogue converted to a multi-level bar and club. Excellent cocktails, moody architecture. The upscale option in Kazimierz.',
      priceRange: '$$', hours: 'Mon-Thu 9am-2am, Fri-Sat 9am-4am, Sun 9am-2am',
      happyHour: 'None known', wayToSave: 'Cocktails 25-35 PLN (~$6-9). Still cheap by any Western European standard.',
      bestTime: 'evening', address: 'ul. Meiselsa 18, 31-059 Krakow',
      coordinates: { lat: 50.0510, lng: 19.9445 }, website: '',
      ladsTake: '', story: '', forWho: '',
      validated: true, validator: 'Research', visitDate: '', featured: false, photoKey: '',
    },
    {
      name: 'William Rabbit', city: 'Krakow', neighborhood: 'Kazimierz',
      category: 'Speakeasy', subcategory: 'Cocktail bar',
      vibeTags: ['Send It', 'Just Us'],
      description: 'Speakeasy-style cocktail bar. Small, reservation-worthy on weekends. Ring the buzzer to enter. Quality cocktails in Krakow\'s growing mixology scene.',
      priceRange: '$$', hours: 'Daily from 6pm',
      happyHour: 'None known', wayToSave: 'Go on a weeknight to avoid the queue. Cocktails 25-35 PLN.',
      bestTime: 'evening', address: 'ul. Bozego Ciala 12, Krakow',
      coordinates: { lat: 50.0505, lng: 19.9440 }, website: 'https://williamrabbit.pl',
      ladsTake: '', story: '', forWho: '',
      validated: true, validator: 'Research', visitDate: '', featured: false, photoKey: '',
    },
    {
      name: 'Plac Nowy', city: 'Krakow', neighborhood: 'Kazimierz',
      category: 'Neighborhood', subcategory: 'Nightlife square',
      vibeTags: ['Send It', 'Show Them Everything'],
      description: 'The square that anchors Kazimierz nightlife. Zapiekanka windows in the rotunda open until 2am — open-faced baguettes that are Poland\'s signature street food. The surrounding bars are the circuit.',
      priceRange: '$', hours: 'Always accessible. Zapiekanka windows open until 2am+',
      happyHour: 'N/A', wayToSave: 'Zapiekanka 8-15 PLN (~$2-4). Eat here, drink at the surrounding bars.',
      bestTime: 'evening', address: 'Plac Nowy, Kazimierz, Krakow',
      coordinates: { lat: 50.0508, lng: 19.9449 }, website: '',
      ladsTake: '', story: '', forWho: '',
      validated: true, validator: 'Research', visitDate: '', featured: true, photoKey: '',
    },

    // ── CULTURAL SITES ──
    {
      name: 'Auschwitz-Birkenau', city: 'Oswiecim', neighborhood: 'Oswiecim',
      category: 'Historical Site', subcategory: 'Memorial / museum',
      vibeTags: ['Take It All In'],
      description: 'The most important site in Poland. Book guided tours 90 days ahead — summer tours sell out completely. Free entry but guided tour required in peak season. Allow a full day including travel from Krakow.',
      priceRange: 'Free', hours: 'Daily 7:30am-seasonal close (3:30pm Dec, 8:30pm Jun-Aug). Closed Jan 1, Dec 25, Easter Sun',
      happyHour: 'N/A', wayToSave: 'Free entry. Guided tour required in peak season (~50 PLN). Book at visit.auschwitz.org 90 days ahead. Morning tours (7:30-8:30am) have smaller groups.',
      bestTime: 'morning', address: 'ul. Wiezniow Oswiecimia 20, 32-603 Oswiecim',
      coordinates: { lat: 50.0266, lng: 19.2036 }, website: 'https://www.auschwitz.org',
      ladsTake: '', story: '', forWho: '',
      validated: true, validator: 'Research', visitDate: '', featured: true, photoKey: '',
    },
    {
      name: 'Wieliczka Salt Mine', city: 'Wieliczka', neighborhood: 'Wieliczka',
      category: 'Historical Site', subcategory: 'Underground mine / UNESCO site',
      vibeTags: ['Take It All In', 'Show Them Everything'],
      description: 'Underground cathedral carved from salt. The Miners\' Route (143 PLN) is more immersive than the tourist route — you wear a helmet and use the original equipment. UNESCO World Heritage Site.',
      priceRange: '$$', hours: 'Daily 9am-5pm (seasonal variation)',
      happyHour: 'N/A', wayToSave: 'Miners\' Route (143 PLN) is more immersive than Tourist Route (120 PLN). Both include guide. Book online for guaranteed entry.',
      bestTime: 'morning', address: 'ul. Danilowicza 10, 32-020 Wieliczka',
      coordinates: { lat: 49.9835, lng: 20.0550 }, website: 'https://www.wieliczka-saltmine.com',
      ladsTake: '', story: '', forWho: '',
      validated: true, validator: 'Research', visitDate: '', featured: false, photoKey: '',
    },
    {
      name: 'Warsaw Rising Museum', city: 'Warsaw', neighborhood: 'Wola',
      category: 'Museum / Gallery', subcategory: 'War museum',
      vibeTags: ['Take It All In', 'Show Them Everything'],
      description: 'Documents the 1944 Warsaw Uprising. One of the best war museums in Europe. Interactive exhibits, replica sewer tunnels, and a B-24 Liberator. Allow 2-3 hours minimum.',
      priceRange: '$', hours: 'Mon/Wed/Fri-Sun 8am-6pm, Thu 8am-8pm, Tue closed',
      happyHour: 'N/A', wayToSave: 'Free on Sundays. Weekdays 25 PLN. Go Thursday evening for extended hours.',
      bestTime: 'morning', address: 'ul. Grzybowska 79, 00-844 Warszawa',
      coordinates: { lat: 52.2260, lng: 20.9752 }, website: 'https://www.1944.pl',
      ladsTake: '', story: '', forWho: '',
      validated: true, validator: 'Research', visitDate: '', featured: false, photoKey: '',
    },
    {
      name: 'European Solidarity Centre', city: 'Gdansk', neighborhood: 'Shipyard',
      category: 'Museum / Gallery', subcategory: 'History museum',
      vibeTags: ['Take It All In', 'Show Them Everything'],
      description: 'The story of Solidarity and the fall of communism. Modern, interactive, world-class museum at the Gdansk Shipyard where it all started. Essential context for understanding modern Poland.',
      priceRange: '$', hours: 'Mon/Wed-Fri 10am-5pm, Sat-Sun 10am-6pm, Tue closed',
      happyHour: 'N/A', wayToSave: 'Free on Wednesdays. Standard admission 25 PLN.',
      bestTime: 'morning', address: 'pl. Solidarnosci 1, 80-863 Gdansk',
      coordinates: { lat: 54.3597, lng: 18.6468 }, website: 'https://ecs.gda.pl',
      ladsTake: '', story: '', forWho: '',
      validated: true, validator: 'Research', visitDate: '', featured: false, photoKey: '',
    },
    {
      name: 'WWII Museum', city: 'Gdansk', neighborhood: 'Old Town',
      category: 'Museum / Gallery', subcategory: 'War museum',
      vibeTags: ['Take It All In', 'Show Them Everything'],
      description: 'Covers the full scope of WWII from a Polish and Central European perspective. Newer museum (opened 2017), excellent curation, powerful exhibits. Allow 2-3 hours.',
      priceRange: '$', hours: 'Tue 10am-4pm, Wed-Sun 10am-6pm (Jul-Aug until 8pm), Mon closed',
      happyHour: 'N/A', wayToSave: 'Free on Tuesdays. Standard admission 25 PLN.',
      bestTime: 'morning', address: 'pl. Wladyslawa Bartoszewskiego 1, 80-862 Gdansk',
      coordinates: { lat: 54.3545, lng: 18.6518 }, website: 'https://muzeum1939.pl',
      ladsTake: '', story: '', forWho: '',
      validated: true, validator: 'Research', visitDate: '', featured: false, photoKey: '',
    },

    // ── FOOD ──
    {
      name: 'Zapiekanka at Okraglak', city: 'Krakow', neighborhood: 'Kazimierz',
      category: 'Quick Bites', subcategory: 'Street food',
      vibeTags: ['Send It', 'Just Us'],
      description: 'Open-faced baguette with mushrooms, cheese, and whatever else you want. The Polish street food staple. Best from the windows in the Plac Nowy rotunda. Open until 2am+.',
      priceRange: '$', hours: 'Rotunda windows open until 2am+',
      happyHour: 'N/A', wayToSave: '8-15 PLN (~$2-4). This IS the budget food. A full meal for the price of a side dish in Western Europe.',
      bestTime: 'evening', address: 'Plac Nowy, Kazimierz, Krakow',
      coordinates: { lat: 50.0508, lng: 19.9449 }, website: '',
      ladsTake: '', story: '', forWho: '',
      validated: true, validator: 'Research', visitDate: '', featured: false, photoKey: '',
    },
    {
      name: 'Milk Bars (Bar Mleczny)', city: 'Various', neighborhood: 'Various',
      category: 'Restaurant — Casual', subcategory: 'Government-subsidized cafeteria',
      vibeTags: ['Take It All In', 'Just Us'],
      description: 'Government-subsidized cafeterias serving traditional Polish food. Pierogi, bigos, zurek for $5-7 per person. Not trendy — just honest, cheap food. An institution since communist times.',
      priceRange: '$', hours: 'Typically Mon-Fri 7am-7pm, Sat 8am-4pm',
      happyHour: 'N/A', wayToSave: 'Already the cheapest restaurant in any Polish city. Full meal under 30 PLN. Look for "Bar Mleczny" signs.',
      bestTime: 'afternoon', address: 'Various locations in Krakow, Warsaw, Gdansk',
      coordinates: { lat: 50.0614, lng: 19.9372 }, website: '',
      ladsTake: '', story: '', forWho: '',
      validated: true, validator: 'Research', visitDate: '', featured: false, photoKey: '',
    },
  ],

  // ===== LEGACY CATEGORIES =====
  categories: [
    { name: 'Kazimierz Nightlife', id: 'kazimierz', spots: [] },
    { name: 'Cultural Sites', id: 'cultural', spots: [] },
    { name: 'Food', id: 'food', spots: [] },
  ],

  dayTrips: [
    { name: 'Zakopane & the Tatras', from: 'Krakow', description: 'Full day trip south to the Tatra Mountains. Poland\'s outdoor capital. Hiking, cable car to Kasprowy Wierch, oscypek (smoked cheese) from street vendors. 2 hours by bus from Krakow.' },
    { name: 'Dunajec River Gorge', from: 'Krakow', description: 'Traditional wooden raft trip through a gorge on the Polish-Slovak border. Scenic, calm, and completely different from everything else on the itinerary.' },
    { name: 'Sopot', from: 'Gdansk', description: '25 minutes by commuter rail. Baltic beach town with the longest wooden pier in Europe. Beach bars, boardwalk, and a different energy from Gdansk. Easy half-day or evening trip.' },
  ],

  mapsLinks: [],

  logistics: {
    flights: 'LOT Polish Airlines nonstop ORD-WAR ~$680. Open-jaw option: fly into Krakow, out of Gdansk (or reverse) to avoid backtracking.',
    inCountry: 'Pendolino (PKP Intercity) Krakow-Warsaw: 2h20m, 120-180 PLN. Warsaw-Gdansk: 2h45m, similar pricing. Book on intercity.pl for best rates.',
    gettingAround: 'Trams and buses in all three cities are cheap and reliable. Uber works everywhere. Krakow Old Town and Kazimierz are fully walkable.',
    tipping: 'Round up 10%. Service charge sometimes included — check the bill.',
  },

  costModel: {
    headers: ['Category', 'Version A (6 days)', 'Version B (8 days)', 'Version C (10 days)'],
    rows: [
      ['Flights (ORD)', '$680', '$680', '$680'],
      ['Accommodation', '$300', '$420', '$540'],
      ['Food & Drink', '$180', '$250', '$320'],
      ['Activities & Museums', '$120', '$180', '$240'],
      ['Intercity Trains', '$75', '$120', '$160'],
      ['Local Transit', '$40', '$60', '$80'],
      ['Buffer', '$160', '$140', '$120'],
    ],
    totals: ['All-In Total', '~$1,555', '~$1,850', '~$2,140'],
    lean: 'Version A covers Krakow + Warsaw only. Version B adds Gdansk. Version C gives breathing room and day trips in each city.',
  },

  mistakes: [
    { title: 'Using Euronet ATMs', detail: 'Euronet charges 10-15% hidden fees via dynamic currency conversion. Use any bank ATM (mBank, PKO, Santander) and always choose PLN, never USD.' },
    { title: 'Accepting USD at Card Terminals', detail: 'When the terminal asks "charge in USD or PLN?" — always choose PLN. Choosing USD triggers a 5-8% conversion markup.' },
    { title: 'Following Strip Club Promoters', detail: 'Krakow Old Town has aggressive promoters on the main square. They will overcharge you by hundreds of euros, hold your card, or worse. Do not engage.' },
    { title: 'Basing in Old Town', detail: 'Krakow Old Town is for sightseeing, not staying. Kazimierz has better bars, better food, and lower prices. Stay there.' },
    { title: 'Skipping Auschwitz', detail: 'It is the most important site in Poland. Book 90 days ahead — summer guided tours sell out completely. Free entry but guided tour required in peak season.' },
  ],

  ladsTake: 'Best value trip in Europe and it\'s not close.',

  specialCallouts: [
    { type: 'warning', title: 'Strip Club Danger — Krakow', text: 'Promoters in Old Town Krakow target tourist groups aggressively. Common scam: inflated bills, held credit cards, intimidation to pay. Do not follow promoters off the main streets. Kazimierz is where the real nightlife is.' },
    { type: 'booking', title: 'Auschwitz Booking Protocol', text: 'Book guided tours 90 days ahead at visit.auschwitz.org. Summer slots sell out completely. Morning tours (7:30-8:30am) have smaller groups. Allow a full day including travel from Krakow.' },
  ],

  navSections: ['Overview', 'Kazimierz', 'Cultural Sites', 'Day Trips', 'Costs', 'Safety'],
};
