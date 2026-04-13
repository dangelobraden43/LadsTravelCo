export default {
  id: 'iceland',
  name: 'Iceland',
  region: 'North Atlantic',
  route: '/iceland',
  tagline: 'One island. Two seasons. Four frameworks from firsthand Ring Road experience.',
  confidence: 'Dawson — Personally Validated (Full Ring Road, Summer)',
  heroStats: [
    { value: '4', label: 'Trip Versions' },
    { value: '10', label: 'Days Ring Road' },
    { value: '2', label: 'Seasons Covered' },
  ],

  palette: {
    bg: '#1a1e24',
    surface: '#1f242b',
    elevated: '#252b33',
    accent: '#c9a84c',
  },

  overview: {
    quickRead: 'Dawson completed the full Ring Road in summer. Four versions: summer short (5–7 days), summer long (10–12), winter short, winter long.',
    budget: '$1,800–$3,800 per person depending on version',
  },

  categories: [
    {
      name: 'Reykjavik',
      id: 'reykjavik',
      spots: [
        { name: 'Hallgrimskirkja', area: 'Reykjavik Centre', description: 'Iconic church towering over the city. Elevator to the top for panoramic views.', validated: true, validator: 'Dawson', tier: 'Must-Hit' },
        { name: 'Sun Voyager', area: 'Waterfront', description: 'Stainless steel sculpture on the harbour. Best at sunset.', validated: true, validator: 'Dawson', tier: 'Must-Hit' },
        { name: 'Sky Lagoon', area: 'Kársnes', description: 'Infinity-edge geothermal pool overlooking the Atlantic. Better than Blue Lagoon.', price: '$70', validated: true, validator: 'Dawson', tier: 'Must-Hit' },
        { name: 'KEF Duty-Free', area: 'Keflavik Airport', description: 'Buy your alcohol here. City prices are brutal. This is not optional advice.', validated: true, validator: 'Dawson', tier: 'Must-Hit' },
      ],
    },
    {
      name: 'Golden Circle',
      id: 'golden-circle',
      spots: [
        { name: 'Thingvellir National Park', area: 'Golden Circle', description: 'Tectonic plate rift. UNESCO World Heritage Site. Free entry.', price: 'Free', validated: true, validator: 'Dawson', tier: 'Must-Hit' },
        { name: 'Gullfoss', area: 'Golden Circle', description: 'Massive two-tiered waterfall. Free. One of the most powerful in Europe.', price: 'Free', validated: true, validator: 'Dawson', tier: 'Must-Hit' },
        { name: 'Lupine Fields', area: 'Various', description: 'Purple lupine blooms across the landscape in June. Stunning photo opportunities.', validated: true, validator: 'Dawson', tier: 'Lads Pick' },
        { name: 'Icelandic Horses', area: 'Various', description: 'Everywhere along the road. Pull over. They are friendly and photogenic.', validated: true, validator: 'Dawson', tier: 'Lads Pick' },
      ],
    },
    {
      name: 'South Coast',
      id: 'south-coast',
      spots: [
        { name: 'Seljalandsfoss', area: 'South Coast', description: 'Walk behind the waterfall. Bring a rain jacket.', validated: true, validator: 'Dawson', tier: 'Must-Hit' },
        { name: 'Skogafoss', area: 'South Coast', description: 'Massive curtain waterfall. Climb the stairs for the view from the top.', validated: true, validator: 'Dawson', tier: 'Must-Hit' },
        { name: 'Reynisfjara Black Sand Beach', area: 'Vik', description: 'Black sand, basalt columns, violent waves. Do not turn your back on the ocean.', validated: true, validator: 'Dawson', tier: 'Must-Hit' },
        { name: 'Dyrholaey', area: 'Vik', description: 'Arch rock formation and lighthouse. Puffin nesting site in summer.', validated: true, validator: 'Dawson', tier: 'Must-Hit' },
        { name: 'Diamond Beach', area: 'Jokulsarlon', description: 'Icebergs washed up on black sand. Looks unreal.', validated: true, validator: 'Dawson', tier: 'Must-Hit' },
        { name: 'Glacier Lagoon (Jokulsarlon)', area: 'South Coast', description: 'Floating icebergs. Boat tours available. One of the most photographed spots in Iceland.', validated: true, validator: 'Dawson', tier: 'Must-Hit' },
        { name: 'Hrunalaug', area: 'South Coast', description: 'Natural hot spring. Tiny, hidden, authentic. Far better than Blue Lagoon.', price: '$15', validated: true, validator: 'Research', tier: 'Lads Pick' },
      ],
    },
    {
      name: 'Westman Islands',
      id: 'westman-islands',
      spots: [
        { name: 'Eldfell Volcano', area: 'Heimaey', description: 'Hike the volcano that erupted in 1973. Still warm underfoot.', validated: true, validator: 'Dawson', tier: 'Must-Hit' },
        { name: 'Puffin Colony', area: 'Heimaey', description: 'Largest puffin colony in Iceland. Summer only.', validated: true, validator: 'Dawson', tier: 'Must-Hit' },
        { name: 'Eruption Museum (Eldheimar)', area: 'Heimaey', description: 'House excavated from the 1973 eruption. Powerful exhibit.', validated: true, validator: 'Dawson', tier: 'Lads Pick' },
        { name: 'Car Ferry', area: 'Landeyjahöfn', description: 'Ferry from mainland to Westman Islands. Book ahead.', price: '$110–$150', validated: true, validator: 'Dawson', tier: 'Must-Hit' },
      ],
    },
    {
      name: 'North Iceland',
      id: 'north-iceland',
      spots: [
        { name: 'Akureyri', area: 'North', description: 'Capital of the north. Good base for Myvatn and whale watching.', validated: true, validator: 'Dawson', tier: 'Must-Hit' },
        { name: 'Lake Myvatn', area: 'North', description: 'Volcanic lake with geothermal areas. Myvatn Nature Baths are the northern Sky Lagoon.', validated: true, validator: 'Dawson', tier: 'Must-Hit' },
        { name: 'Godafoss', area: 'North', description: 'Waterfall of the Gods. Where Iceland officially converted to Christianity.', validated: true, validator: 'Dawson', tier: 'Must-Hit' },
        { name: 'Grabrókarfell', area: 'West', description: 'Volcanic crater with a boardwalk loop. Quick stop, dramatic views.', validated: true, validator: 'Dawson', tier: 'Lads Pick' },
      ],
    },
  ],

  dayTrips: [
    {
      name: 'Westman Islands',
      from: 'Landeyjahöfn',
      description: 'Full day trip. Ferry over, hike Eldfell, see puffins, visit Eruption Museum, ferry back.',
      ladsRating: '9/10',
    },
  ],

  mapsLinks: [],

  logistics: {
    flights: 'Seasonal from ORD via Icelandair. Direct in summer. Connections via BOS or JFK off-season.',
    inCountry: 'Rental car is mandatory. Dacia Duster 4WD recommended for F-roads and gravel.',
    dutyFree: 'Buy all alcohol at KEF Duty-Free on arrival. City prices are 2–3x higher.',
  },

  costModel: {
    headers: ['Version', 'Budget', 'Comfortable'],
    rows: [
      ['V1 Summer Short (5–7d)', '$1,800', '$2,600'],
      ['V2 Summer Long (10–12d)', '$2,800', '$3,800'],
      ['V3 Winter Short (5–7d)', '$1,400', '$2,100'],
      ['V4 Winter Long (8–10d)', '$2,200', '$3,200'],
    ],
    totals: ['Range', '$1,400–$2,800', '$2,100–$3,800'],
  },

  mistakes: [
    { title: 'Booking August 2026', detail: 'Total solar eclipse August 12, 2026. Every hotel and car in Iceland is already booked. Prices are absurd.' },
    { title: 'Waiting Outside for the Aurora', detail: 'You will freeze. Check the forecast, drive to a clear spot, stay in the car until it appears.' },
    { title: 'Choosing July over Late June', detail: 'Late June has midnight sun and lupine fields. July is more crowded with worse light.' },
    { title: 'Rushing Eastern Fjords in Winter', detail: 'Roads close. Weather changes in minutes. The east needs time and respect.' },
    { title: 'Paying City Prices for Alcohol', detail: 'A beer in Reykjavik is $12–$15. KEF Duty-Free is $3–$5. Do the math.' },
    { title: 'Blue Lagoon over Hrunalaug', detail: 'Blue Lagoon is $70+ and a tourist factory. Hrunalaug is $15 and feels like a secret.' },
  ],

  ladsTake: 'Highly highly highly recommend Iceland. — Dawson',

  specialCallouts: [
    { title: 'Eclipse Warning — August 2026', detail: 'Total solar eclipse crosses Iceland on August 12, 2026. All accommodation and rental cars are booking up fast. If you want August 2026, book now or reconsider timing.' },
  ],

  navSections: ['Overview', 'Reykjavik', 'Golden Circle', 'South Coast', 'Westman Islands', 'North', 'Logistics'],
};
