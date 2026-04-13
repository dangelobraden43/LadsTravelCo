const rome = {
  id: 'rome',
  name: 'Rome + Italy',
  region: 'Italy',
  route: '/rome',
  tagline: 'Five days that reveal themselves slowly. Pompeii redefines what ruins can be.',
  confidence: 'Both Lads — Personally Validated',

  heroStats: [
    { value: '33', label: 'Rated Spots' },
    { value: '5', label: 'Days in Rome' },
    { value: '2', label: 'Trip Options' },
  ],

  palette: {
    bg: '#1C1510',
    surface: '#241C14',
    elevated: '#2A2018',
    accent: '#C9883A',
  },

  overview: {
    quickRead: 'Two options for one of the great cities. Option A gives seven to nine days in Rome — five full days with the city, plus Pompeii, Tivoli, and an Amalfi Coast day trip. Option B extends with three to four nights on the Amalfi Coast, visiting Pompeii on the transit day south.',
    budget: '$2,200–$3,800 per person depending on option and season',
    framework: 'Option A: Rome 7-9 days. Option B: Rome + Amalfi Coast 10-14 days. The Pompeii transit day strategy makes Option B more efficient than it looks on paper.',
    ladsBothKnow: 'Both Lads were in Rome during the Jubilee Year 2025. They walked through the Holy Doors, witnessed Pope Francis lying in state, and validated 33 spots across bars, food, and attractions.',
  },

  categories: [
    {
      name: 'Rome Attractions',
      id: 'rome-attractions',
      spots: [
        { name: 'Colosseum', area: 'Rome', description: 'Buy timed entry online in advance. See it during the day and at night.', price: '$$', rating: 4.8, validated: true, validator: 'Both Lads', tier: 'Must-Hit' },
        { name: 'Roman Forum + Palatine Hill', area: 'Rome', description: 'Ticket includes Colosseum. Larger than expected — give it time.', price: '$$', rating: 4.8, validated: true, validator: 'Both Lads' },
        { name: 'Vatican Museums + Sistine Chapel', area: 'Rome', description: 'Book online, arrive early. Half day minimum. Worth every cent.', price: '€20+', rating: 4.6, validated: true, validator: 'Both Lads', tier: 'Must-Hit' },
        { name: "St. Peter's Basilica", area: 'Rome', description: 'Free entry. Largest church in the world. Climb the dome for panoramic views.', price: 'Free', rating: 4.8, validated: true, validator: 'Both Lads' },
        { name: 'Pantheon', area: 'Rome', description: 'The oculus alone is worth the stop.', price: '€5', rating: 4.8, validated: true, validator: 'Both Lads' },
        { name: 'Trevi Fountain', area: 'Rome', description: 'Go before 8am. After that it belongs to the crowds.', price: 'Free', rating: 4.7, validated: true, validator: 'Both Lads' },
        { name: "Castel Sant'Angelo", area: 'Rome', description: 'Rooftop has excellent river and city views.', price: '$$', rating: 4.7, validated: true, validator: 'Both Lads' },
        { name: "Chiesa di Sant'Ignazio di Loyola", area: 'Rome', description: 'Trompe-l\'oeil ceiling — the painted dome is not real. Underrated and free.', price: 'Free', rating: 4.8, validated: true, validator: 'Both Lads' },
        { name: 'Monument to Victor Emmanuel II', area: 'Rome', description: 'Pay for the lift to the top for panoramic views.', price: 'Free/€', rating: 4.8, validated: true, validator: 'Both Lads' },
      ]
    },
    {
      name: 'Rome Food',
      id: 'rome-food',
      spots: [
        { name: 'Tonnarello', area: 'Trastevere', description: 'Cacio e pepe destination.', price: '$$', validated: true, validator: 'Both Lads', tier: 'Must-Hit' },
        { name: 'Bonci Pizzarium', area: 'Near Vatican', description: 'Pizza al taglio — sold by weight. The best in Rome.', price: '$', validated: true, validator: 'Both Lads', tier: 'Must-Hit' },
        { name: 'Mancini', area: 'Testaccio', description: 'Carbonara institution.', price: '$', validated: true, validator: 'Both Lads' },
        { name: 'Supplì Roma', area: 'Rome', description: "Rome's best supplì.", price: '€1-10', rating: 4.7, validated: true, validator: 'Both Lads' },
        { name: 'Giollitti Gelato', area: 'Near Pantheon', description: 'Classic Roman gelato.', price: '$', validated: true, validator: 'Both Lads' },
        { name: 'Antico Forno Roscioli', area: 'Rome', description: 'Pizza bianca in the morning. Get there early.', price: '$', validated: true, validator: 'Both Lads' },
        { name: 'Two Sizes', area: 'Rome', description: '15K+ reviews. One of the highest-rated sweet spots.', price: '$', rating: 4.7, validated: true, validator: 'Both Lads' },
        { name: "Forno Campo de' Fiori", area: "Campo de' Fiori", description: 'Bakery on the square. Pizza al taglio.', price: '€1-10', rating: 4.5, validated: true, validator: 'Both Lads' },
      ]
    },
    {
      name: 'Rome Aperitivo & Bars',
      id: 'rome-bars',
      spots: [
        { name: 'Freni e Frizioni', area: 'Trastevere', description: 'Former mechanic shop. Most generous aperitivo buffet. Outdoor terrace.', price: '€10-20', rating: 4.2, validated: true, validator: 'Both Lads', tier: 'Must-Hit', note: 'Aperitivo anchor' },
        { name: 'Salotto 42', area: 'Piazza di Pietra', description: 'You drink aperitivo in front of a Roman temple. Best setting in Rome.', price: '€10-20', validated: true, validator: 'Both Lads' },
        { name: 'Bar San Calisto', area: 'Trastevere', description: 'Institution. Locals, students, €1 beers.', price: '€1-10', rating: 4.5, validated: true, validator: 'Both Lads', note: 'Lads Pick' },
        { name: 'Ma Che Siete Venuti A Fà', area: 'Trastevere', description: 'Tiny craft beer bar. Standing room only.', price: '€1-10', rating: 4.6, validated: true, validator: 'Both Lads' },
        { name: 'Open Baladin', area: 'Rome', description: 'Italian craft beer pub. Excellent tap selection.', price: '€10-20', rating: 4.4, validated: true, validator: 'Both Lads' },
        { name: 'Drink Kong', area: 'Rome', description: "Anime-inspired. One of Rome's most acclaimed cocktail bars.", price: '$$$', rating: 4.3, validated: true, validator: 'Both Lads' },
        { name: 'Jerry Thomas Speakeasy', area: 'Rome', description: "Prohibition-style. Rome's original speakeasy. Reserve ahead.", price: '$$$', rating: 4.5, validated: true, validator: 'Both Lads' },
      ]
    },
    {
      name: 'Accommodation',
      id: 'rome-accommodation',
      spots: [
        { name: 'Yellow Square Hostel', area: 'Castro Pretorio', description: '10 min walk from Termini. YellowBar across the street does free pasta hour 7-8pm.', price: '€35-50/night', validated: true, validator: 'Both Lads', note: 'Social anchor' },
      ]
    },
  ],

  dayTrips: [
    { name: 'Pompeii', from: 'Rome', description: 'Frecciarossa to Naples (70 min), then Circumvesuviana to Pompei Scavi. Total ~2.5 hours. Depart by 7am. Timed entry required. Garden of the Fugitives is the reason Pompeii is unlike any other site on earth.', price: '€18-25 entry', ladsRating: '11/10', bookingUrl: 'https://gyg.me/c6cN0bz2', bookingPlatform: 'GetYourGuide' },
    { name: 'Tivoli', from: 'Rome', description: 'Villa d\'Este (500+ fountains, gravity-fed water organs) + Villa Adriana (Hadrian\'s retreat). Full day. Private van recommended for group.', price: '€400-550 van for 4-8', ladsRating: 'Essential' },
    { name: 'Amalfi Coast Day Trip', from: 'Rome via Naples', description: 'Train to Naples, ferry or transfer along the coast. A single day gives the drive and the water.', ladsRating: 'Beautiful enough to come back for' },
  ],

  mapsLinks: [
    { name: 'Rome Food & Drink', url: 'https://maps.app.goo.gl/kmFjNeA6k8BHuHWT8' },
    { name: 'Rome Attractions', url: 'https://maps.app.goo.gl/RAS5mqRhc6BYTa5D6' },
  ],

  logistics: {
    flights: 'Direct from ORD on United, American, ITA Airways. Shoulder season fares ~$750 RT. Book 4-6 months out for September.',
    inCountry: 'Metro + walking in Rome. Skip the Roma Pass (€58, rarely breaks even). Frecciarossa to Naples for Pompeii (70 min). Private van for Tivoli day trip.',
    gettingAround: 'Use contactless on the metro. Trastevere is walkable from centro. Amalfi Coast: ferry between towns (€10-15), never rent a car.',
    tipping: 'Coperto of €1-3/person is standard and unavoidable — it is not a tip. Additional tipping not expected. Round up at group dinners. Never select USD at terminals — DCC adds 3-5%.',
  },

  costModel: {
    headers: ['Category', 'Option A Lean', 'Option A Generous', 'Option B Generous'],
    rows: [
      ['Flights (ORD)', '$750', '$950', '$950'],
      ['Accommodation', '€245-350', '€350-500', '€600-900'],
      ['Food & Drink', '€200-300', '€400-600', '€550-800'],
      ['Transport', '€80-120', '€200-300', '€350-500'],
      ['Activities', '€60-100', '€100-180', '€250-400'],
    ],
    totals: ['Per Person', '~$1,800', '~$2,800', '~$3,800'],
    lean: 'Aperitivo strategy saves €50-75/person over 5 nights. €10-15 drink includes buffet, 6:30-9pm.',
  },

  mistakes: [
    { title: 'Combining Pompeii and Naples in one day', detail: 'Pompeii alone needs 4-6 hours plus 2.5 hours travel each way. Naples is a full day on its own.' },
    { title: 'Staying in Positano (Option B)', detail: 'Visually extraordinary, logistically punishing. 30 minutes of stairs between villa and beach. Day trip to Positano instead.' },
    { title: 'Skipping the aperitivo', detail: '€10-15 drink gets a substantial buffet from 6:30-9pm. This functions as dinner. Use it every evening.' },
    { title: 'Buying the Roma Pass', detail: '€58 for two free sites that total ~€35 in ticket value. Buy tickets individually instead.' },
    { title: 'Over-tipping', detail: 'Coperto is standard. Additional tipping is not expected. Do not tip 20%.' },
    { title: 'Skipping Tivoli', detail: 'Villa d\'Este and Villa Adriana together are a full day of world-class heritage. Both Lads did this day.' },
  ],

  ladsTake: 'Rome is a city that reveals itself slowly. Five days is not rushing it — five days is the minimum to understand why people keep going back. The aperitivo ritual changes how you budget the entire trip.',

  specialCallouts: [],

  navSections: ['Overview', 'Rome Attractions', 'Rome Food', 'Rome Bars', 'Day Trips', 'Maps', 'Logistics'],
};

export default rome;
