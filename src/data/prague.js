export default {
  id: 'prague',
  name: 'Prague + Vienna + Dresden',
  region: 'Central Europe',
  route: '/prague',
  tagline: 'Three Central European capitals. Best value in European travel.',
  confidence: 'Brady — Personally Validated',
  heroStats: [
    { value: '75+', label: 'Database Spots' },
    { value: '4', label: 'Google Maps Lists' },
    { value: '3', label: 'Countries' },
  ],

  palette: {
    bg: '#13111a',
    surface: '#1a1824',
    elevated: '#22202e',
    accent: '#9a8bc2',
  },

  overview: {
    quickRead: 'Brady visited all three cities. 38 rated spots in Prague, 37 in Vienna, plus Dresden. Best value destination in Europe — Prague beer is $1.50–$3 a pint.',
    budget: '$1,800–$3,200 per person depending on duration and accommodation style',
  },

  categories: [
    {
      name: 'Prague Highlights',
      id: 'prague-highlights',
      spots: [
        { name: 'Prague Castle', area: 'Hradcany', description: 'Largest ancient castle complex in the world. Free to walk the grounds.', validated: true, validator: 'Brady', tier: 'Must-Hit' },
        { name: 'St. Vitus Cathedral', area: 'Prague Castle', description: 'Gothic cathedral inside the castle complex. Stained glass by Mucha.', validated: true, validator: 'Brady', tier: 'Must-Hit' },
        { name: 'Old Town Square', area: 'Stare Mesto', description: 'Heart of Prague. Tyn Church, street performers, Christmas market in December.', validated: true, validator: 'Brady', tier: 'Must-Hit' },
        { name: 'Astronomical Clock', area: 'Old Town Square', description: 'Medieval astronomical clock. Hourly show. Worth seeing once — do not eat near here.', validated: true, validator: 'Brady', tier: 'Must-Hit' },
        { name: 'Charles Bridge', area: 'Vltava River', description: 'Iconic pedestrian bridge. Go at sunrise to avoid crowds.', validated: true, validator: 'Brady', tier: 'Must-Hit' },
        { name: 'Jewish Quarter (Josefov)', area: 'Stare Mesto', description: 'Historic synagogues, Old Jewish Cemetery. Powerful and essential.', validated: true, validator: 'Brady', tier: 'Must-Hit' },
        { name: 'Vysehrad', area: 'Vysehrad', description: 'Hilltop fortress south of centre. Views over the Vltava. Far fewer tourists than the castle.', validated: true, validator: 'Brady', tier: 'Lads Pick' },
        { name: 'Letna Beer Garden', area: 'Letna Park', description: 'Best beer garden in Prague. Views over the river and Old Town. Cheap beer.', validated: true, validator: 'Brady', tier: 'Must-Hit' },
        { name: 'Vitkarka Beer Garden', area: 'Vysehrad', description: 'Hidden beer garden near Vysehrad. Locals only. Incredible atmosphere.', validated: true, validator: 'Brady', tier: 'Lads Pick' },
        { name: 'Napaj Market', area: 'Holesovice', description: 'Farmers market and food hall. Local produce, craft beer, street food.', validated: true, validator: 'Brady', tier: 'Lads Pick' },
        { name: 'Lokal', area: 'Various', description: 'Czech pub chain done right. Tank beer, traditional food, reasonable prices.', validated: true, validator: 'Brady', tier: 'Must-Hit' },
      ],
    },
    {
      name: 'Vienna Highlights',
      id: 'vienna-highlights',
      spots: [
        { name: 'Schonbrunn Palace', area: 'Hietzing', description: 'Habsburg summer residence. Gardens are free and enormous. The palace tour is worth the fee.', validated: true, validator: 'Brady', tier: 'Must-Hit' },
        { name: 'Naschmarkt', area: 'Wieden', description: 'Vienna\'s main outdoor market. 120+ stalls. Go hungry.', validated: true, validator: 'Brady', tier: 'Must-Hit' },
        { name: "St. Stephen's Cathedral", area: 'Innere Stadt', description: 'Gothic cathedral in the city centre. Climb the south tower for views.', validated: true, validator: 'Brady', tier: 'Must-Hit' },
        { name: 'Belvedere', area: 'Landstrasse', description: 'Baroque palace complex. Klimt\'s The Kiss is here.', validated: true, validator: 'Brady', tier: 'Must-Hit' },
        { name: 'Albertina', area: 'Innere Stadt', description: 'Major art museum. Monet, Picasso, Klimt. World-class collection.', validated: true, validator: 'Brady', tier: 'Lads Pick' },
        { name: 'Cafe Central', area: 'Innere Stadt', description: 'Vienna\'s most famous coffee house. Freud, Trotsky, and Tito were regulars. Go for the experience.', validated: true, validator: 'Brady', tier: 'Must-Hit' },
        { name: 'MuseumsQuartier', area: 'Neubau', description: 'One of the largest cultural complexes in the world. Leopold Museum, MUMOK, Kunsthalle.', validated: true, validator: 'Brady', tier: 'Lads Pick' },
        { name: 'Prater', area: 'Leopoldstadt', description: 'Giant Ferris wheel and amusement park. Iconic Vienna landmark.', validated: true, validator: 'Brady', tier: 'Lads Pick' },
      ],
    },
    {
      name: 'Dresden',
      id: 'dresden',
      spots: [
        { name: 'Frauenkirche', area: 'Altstadt', description: 'Baroque church rebuilt after WWII bombing. The reconstruction story is extraordinary.', validated: true, validator: 'Brady', tier: 'Must-Hit' },
        { name: 'Zwinger Palace', area: 'Altstadt', description: 'Baroque palace with world-class art galleries. Courtyard is free.', validated: true, validator: 'Brady', tier: 'Must-Hit' },
        { name: 'Hofkirche', area: 'Altstadt', description: 'Catholic cathedral. Largest church in Saxony.', validated: true, validator: 'Brady', tier: 'Lads Pick' },
        { name: "Bruhl's Terrace", area: 'Altstadt', description: 'The Balcony of Europe. Elevated walkway along the Elbe with views of the Neustadt.', validated: true, validator: 'Brady', tier: 'Must-Hit' },
      ],
    },
  ],

  dayTrips: [
    {
      name: 'Pilsner Urquell Brewery',
      from: 'Prague',
      description: '1.5 hours by train. $5–$8 train ticket. $12–$15 brewery tour. The birthplace of pilsner.',
      ladsRating: '9/10',
    },
    {
      name: 'Dresden',
      from: 'Prague',
      description: '2 hours by train. $15–$20 ticket. Frauenkirche, Zwinger Palace, Bruhl\'s Terrace. Easy full-day trip.',
      ladsRating: '8.5/10',
    },
  ],

  mapsLinks: [
    { name: 'Prague Attractions', url: 'https://maps.app.goo.gl/e3pGDSj6PCcPEy8j7' },
    { name: 'Prague Bars', url: 'https://maps.app.goo.gl/o7BCdPPpzPHJsEA59' },
    { name: 'Vienna', url: 'https://maps.app.goo.gl/R4TC9toa9oP5qJed8' },
    { name: 'Dresden', url: 'https://maps.app.goo.gl/FYEJQFkTJVyqZr1x7' },
  ],

  logistics: {
    flights: 'Fly into Vienna or Prague, out the other. Open-jaw saves backtracking. Flights from ORD $450–$700.',
    inCountry: 'RegioJet or OBB Vienna to Prague: 4 hours, $15–$25. Comfortable, scenic, cheap.',
    gettingAround: 'Prague and Vienna are walkable. Metro systems in both cities are excellent and cheap.',
  },

  costModel: {
    headers: ['Category', 'Prague', 'Vienna'],
    rows: [
      ['Food/day', '$20–$35', '$40–$65'],
      ['Beer', '$1.50–$3', '$4–$6'],
      ['Flights (ORD)', '$450–$700', '$450–$700'],
      ['Total (7–10 days)', '$1,800–$3,200', '$1,800–$3,200'],
    ],
    totals: ['Combined Trip Total', '$1,800–$3,200', '—'],
  },

  mistakes: [
    { title: 'Staying in Prague 1', detail: 'Tourist trap district. Overpriced everything. Stay in Prague 2, 3, or 7 for half the price and better food.' },
    { title: 'Eating Near the Astronomical Clock', detail: 'Tourist markup is 2–3x. Walk 10 minutes in any direction for real Czech food at real prices.' },
    { title: 'Skipping Vienna Beisl', detail: 'A Beisl is a traditional Viennese pub-restaurant. Schnitzel, goulash, local beer. Skip the upscale restaurants and eat where locals eat.' },
    { title: 'Not Booking the Pilsen Tour', detail: 'Pilsner Urquell Brewery tour sells out. Book ahead. The unfiltered tank beer at the end is worth the trip alone.' },
    { title: 'Trying 3 Cities in 5 Days', detail: 'Each city deserves 2–3 full days minimum. Rushing means missing the beer gardens, the markets, and the atmosphere that makes these cities special.' },
  ],

  ladsTake: 'Prague is the best value city in Europe — full stop.',

  specialCallouts: [],

  navSections: ['Overview', 'Prague', 'Vienna', 'Dresden', 'Day Trips', 'Maps', 'Logistics'],
};
