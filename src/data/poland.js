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
    framework: 'Built from research across multiple sources. LOT Polish Airlines runs nonstop ORD–WAR. The south-to-north route (Krakow → Warsaw → Gdansk) is the most efficient and ends at the coast.',
    philosophy: 'Poland rewards the group that slows down. The history is heavy, the nightlife is world-class, and the food costs almost nothing. Do not rush through Krakow to check boxes in Warsaw.',
  },

  categories: [
    {
      name: 'Kazimierz Nightlife',
      id: 'kazimierz',
      spots: [
        { name: 'Alchemia', area: 'Kazimierz', description: 'The anchor bar of Kazimierz. Candlelit, dark, bohemian. Live music in the basement. This is where the night starts.', validated: true, validator: 'Research' },
        { name: 'Singer', area: 'Kazimierz', description: 'Sewing machines as tables. Candles in bottles. One of the most atmospheric bars in Europe.', validated: true, validator: 'Research' },
        { name: 'HEVRE', area: 'Kazimierz', description: 'Former synagogue converted to a bar/club. Multi-level, excellent cocktails. The upscale option in the neighborhood.', validated: true, validator: 'Research' },
        { name: 'William Rabbit', area: 'Kazimierz', description: 'Speakeasy-style cocktail bar. Small, reservation-worthy on weekends.', validated: true, validator: 'Research' },
        { name: 'Plac Nowy', area: 'Kazimierz', description: 'The square that anchors the neighborhood. Zapiekanka windows open until 2am. The bars surrounding it are the circuit.', validated: true, validator: 'Research', note: 'Open until 2am' },
      ],
    },
    {
      name: 'Cultural Sites',
      id: 'cultural',
      spots: [
        { name: 'Auschwitz-Birkenau', area: 'Oświęcim', description: 'The most important site in Poland. Book 90 days ahead — guided tours sell out completely in summer. Free entry but guided tour required for peak season. Allow a full day.', validated: true, validator: 'Research', note: 'Book 90 days ahead' },
        { name: 'Wieliczka Salt Mine', area: 'Wieliczka', description: 'Underground cathedral carved from salt. The Miners\' Route (143 PLN) is more immersive than the tourist route — you wear a helmet and use the original equipment.', price: '143 PLN (Miners\' Route)', validated: true, validator: 'Research' },
        { name: 'Warsaw Rising Museum', area: 'Warsaw', description: 'Documents the 1944 Warsaw Uprising. One of the best war museums in Europe. Allow 2–3 hours minimum.', validated: true, validator: 'Research' },
        { name: 'European Solidarity Centre', area: 'Gdansk', description: 'The story of Solidarity and the fall of communism. Modern, interactive, world-class museum at the Gdansk Shipyard.', validated: true, validator: 'Research' },
        { name: 'WWII Museum', area: 'Gdansk', description: 'Covers the full scope of the war from a Polish and Central European perspective. Newer museum, excellent curation.', validated: true, validator: 'Research' },
      ],
    },
    {
      name: 'Food',
      id: 'food',
      spots: [
        { name: 'Zapiekanka at Okrąglak', area: 'Kazimierz, Krakow', description: 'Open-faced baguette with mushrooms, cheese, and whatever else you want. The Polish street food staple. Best from the windows at Plac Nowy.', price: '8–15 PLN', validated: true, validator: 'Research' },
        { name: 'Milk Bars (Bar Mleczny)', area: 'Various', description: 'Government-subsidized cafeterias serving traditional Polish food. Pierogi, bigos, żurek for $5–7 per person. Not trendy — just honest, cheap food.', price: '$5–7 pp', validated: true, validator: 'Research' },
      ],
    },
  ],

  dayTrips: [
    {
      name: 'Zakopane & the Tatras',
      from: 'Krakow',
      description: 'Full day trip south to the Tatra Mountains. Poland\'s outdoor capital. Hiking, cable car to Kasprowy Wierch, oscypek (smoked cheese) from street vendors. 2 hours by bus from Krakow.',
    },
    {
      name: 'Dunajec River Gorge',
      from: 'Krakow',
      description: 'Traditional wooden raft trip through a gorge on the Polish-Slovak border. Scenic, calm, and completely different from everything else on the itinerary.',
    },
    {
      name: 'Sopot',
      from: 'Gdansk',
      description: '25 minutes by commuter rail. Baltic beach town with the longest wooden pier in Europe. Beach bars, boardwalk, and a different energy from Gdansk. Easy half-day or evening trip.',
    },
  ],

  mapsLinks: [],

  logistics: {
    flights: 'LOT Polish Airlines nonstop ORD–WAR ~$680. Open-jaw option: fly into Krakow, out of Gdansk (or reverse) to avoid backtracking.',
    inCountry: 'Pendolino (PKP Intercity) Krakow–Warsaw: 2h20m, 120–180 PLN. Warsaw–Gdansk: 2h45m, similar pricing. Book on intercity.pl for best rates.',
    gettingAround: 'Trams and buses in all three cities are cheap and reliable. Uber works everywhere. Krakow Old Town and Kazimierz are fully walkable.',
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
    { title: 'Using Euronet ATMs', detail: 'Euronet charges 10–15% hidden fees via dynamic currency conversion. Use any bank ATM (mBank, PKO, Santander) and always choose PLN, never USD.' },
    { title: 'Accepting USD at Card Terminals', detail: 'When the terminal asks "charge in USD or PLN?" — always choose PLN. Choosing USD triggers a 5–8% conversion markup.' },
    { title: 'Following Strip Club Promoters', detail: 'Krakow Old Town has aggressive promoters on the main square. They will overcharge you by hundreds of euros, hold your card, or worse. Do not engage.' },
    { title: 'Basing in Old Town', detail: 'Krakow Old Town is for sightseeing, not staying. Kazimierz has better bars, better food, and lower prices. Stay there.' },
    { title: 'Skipping Auschwitz', detail: 'It is the most important site in Poland. Book 90 days ahead — summer guided tours sell out completely. Free entry but guided tour required in peak season.' },
  ],

  ladsTake: 'Best value trip in Europe and it\'s not close.',

  specialCallouts: [
    {
      type: 'warning',
      title: 'Strip Club Danger — Krakow',
      text: 'Promoters in Old Town Krakow target tourist groups aggressively. Common scam: inflated bills, held credit cards, intimidation to pay. Do not follow promoters off the main streets. Kazimierz is where the real nightlife is.',
    },
    {
      type: 'booking',
      title: 'Auschwitz Booking Protocol',
      text: 'Book guided tours 90 days ahead at visit.auschwitz.org. Summer slots sell out completely. Morning tours (7:30–8:30am) have smaller groups. Allow a full day including travel from Krakow.',
    },
  ],

  navSections: ['Overview', 'Kazimierz', 'Cultural Sites', 'Day Trips', 'Costs', 'Safety'],
};
