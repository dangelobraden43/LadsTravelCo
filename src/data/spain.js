const spain = {
  id: 'spain',
  name: 'Barcelona + Madrid',
  region: 'Spain',
  route: '/spain',
  tagline: 'Two Cities. Two Lads. One Definitive Guide.',
  confidence: 'Both Lads — Personally Validated',

  heroStats: [
    { value: '100+', label: 'Validated Spots' },
    { value: '3', label: 'Trip Versions' },
    { value: '2', label: 'Study Abroads' },
  ],

  palette: {
    bg: '#1C1714',
    surface: '#241E19',
    elevated: '#2C2520',
    accent: '#D4A039',
  },

  overview: {
    quickRead: 'The most validated two-city framework in the portfolio. Brady studied abroad in Barcelona; Dawson studied abroad in Madrid. Three versions for groups of 2, 4, or 8 — each with its own accommodation strategy, cost model, and nightlife routing. 100+ spots across both cities, every one personally visited.',
    budget: '$2,000–$3,200 per person (group of 4, flights from ORD)',
    framework: 'Three versions: Barcelona-only (7 days), Barcelona + Madrid combo (12 days), or Madrid-only (7 days). Open-jaw routing — fly into Barcelona, train to Madrid, fly home from Madrid. Same price as round-trip.',
    ladsBothKnow: 'Brady lived in Barcelona for a semester. Dawson lived in Madrid. Between the two of us, every neighbourhood, every bar, every shortcut in both cities has been walked personally. This isn\'t research — this is home turf.',
  },

  categories: [
    {
      name: 'Barcelona Architecture',
      id: 'barcelona-architecture',
      spots: [
        { name: 'Sagrada Familia', area: 'Eixample', description: 'The non-negotiable. Book tower access 3+ weeks ahead. Morning tickets for best stained glass light. Interior is life-changing.', price: '€26+', rating: 4.8, validated: true, validator: 'Both Lads', tier: 'Must-Hit', note: 'Book ahead' },
        { name: 'Park Guell', area: 'Gracia', description: 'Famous mosaics, panoramic views. Pre-booked entry required for monumental zone. Go early morning.', price: '€10', rating: 4.4, validated: true, validator: 'Both Lads' },
        { name: 'Palau de la Musica Catalana', area: 'El Born', description: 'UNESCO concert hall. Extraordinary interior — one of the most ornate rooms in Europe.', price: '€22', rating: 4.7, validated: true, validator: 'Brady' },
        { name: 'Casa Batllo', area: 'Eixample', description: 'Gaudi\'s dragon house. Interior spectacular but expensive. Can view facade from Passeig de Gracia for free.', price: '€35+', rating: 4.7, validated: true, validator: 'Brady' },
        { name: 'Recinte Modernista de Sant Pau', area: 'Eixample', description: 'UNESCO site. Less crowded than Gaudi marquee spots. Beautiful Modernist hospital complex — underrated.', price: '€16', rating: 4.6, validated: true, validator: 'Research' },
        { name: 'Bunkers del Carmel', area: 'El Carmel', description: 'Best free 360-degree sunset view in the city. Bring a beer. Old Civil War bunkers.', price: 'Free', rating: 4.7, validated: true, validator: 'Brady', tier: 'Must-Hit' },
        { name: 'Basilica de Santa Maria del Mar', area: 'El Born', description: 'Gothic. Free mornings. More powerful than the Cathedral. The church locals prefer.', price: 'Free mornings', rating: 4.7, validated: true, validator: 'Brady' },
        { name: 'Magic Fountain of Montjuic', area: 'Montjuic', description: 'Free light and music show Thu-Sun evenings. Go with a group and a beer.', price: 'Free', rating: 4.6, validated: true, validator: 'Both Lads' },
        { name: 'Gothic Quarter', area: 'Ciutat Vella', description: 'Medieval heart of Barcelona. Best explored by wandering without a plan.', price: 'Free', validated: true, validator: 'Both Lads' },
      ]
    },
    {
      name: 'Barcelona Bars & Speakeasies',
      id: 'barcelona-bars',
      spots: [
        { name: 'Paradiso', area: 'El Born', description: '#4 World\'s Best Bars. Hidden behind fridge door in pastrami shop. Theatrical cocktails.', price: '€10-20', rating: 4.3, validated: true, validator: 'Brady', tier: 'Must-Hit', note: 'World\'s Best' },
        { name: 'Bobby\'s Free', area: 'Eixample', description: '1920s speakeasy hidden inside a barber shop. Dark wood, amber cocktails.', price: '€10-20', rating: 4.6, validated: true, validator: 'Brady', note: 'Lads Pick' },
        { name: 'Mariposa Negra', area: 'El Born', description: 'Intimate cocktail bar. Consistently excellent drinks, no gimmicks, no queues.', price: '€10-20', rating: 4.8, validated: true, validator: 'Brady', note: 'Lads Pick' },
        { name: 'The Alchemix', area: 'Eixample', description: 'Highest-rated cocktail bar in database. Chemistry-themed mixology.', price: '€10-20', rating: 4.8, validated: true, validator: 'Research' },
        { name: 'Kahiki Barcelona', area: 'Eixample', description: 'Tiki cocktail bar. Fun, colourful, different energy from speakeasy circuit.', price: '€10-20', rating: 4.7, validated: true, validator: 'Research' },
        { name: 'Seven Under Bar', area: 'Gracia', description: 'One of the highest-rated bars in Barcelona. Local spot.', price: '€10-20', rating: 4.8, validated: true, validator: 'Brady', note: 'Lads Pick' },
        { name: 'Le Cyrano', area: 'El Born', description: 'Budget gem. Under €10 drinks. Good atmosphere, no pretension.', price: '€1-10', rating: 4.4, validated: true, validator: 'Brady', note: 'Lads Pick' },
        { name: 'Tehran Bar', area: 'Gracia', description: 'Highest-rated bar in entire Barcelona database. 4.9 stars.', price: '€10-20', rating: 4.9, validated: true, validator: 'Research' },
        { name: 'El Xampanyet', area: 'El Born', description: 'Old-school cava bar. Cava and anchovies at the bar.', price: '€10-20', validated: true, validator: 'Brady' },
      ]
    },
    {
      name: 'Barcelona Food',
      id: 'barcelona-food',
      spots: [
        { name: 'Can Paixano (La Xampanyeria)', area: 'Barceloneta', description: 'Standing-room cava bar. House sausage sandwiches and cheap cava. Best cheap meal-and-drink experience in Barcelona.', price: '€10-20', validated: true, validator: 'Brady', tier: 'Must-Hit', note: 'Lads Pick' },
        { name: 'Bo de B', area: 'El Born', description: 'Legendary baguette sandwiches. Under €10.', price: '€1-10', validated: true, validator: 'Brady', note: 'Lads Pick' },
        { name: 'COMPA', area: 'Gracia', description: 'Panino Calabrese. Simple, exceptional.', price: '€10-20', validated: true, validator: 'Brady', note: 'Lads Pick' },
        { name: 'Bar Tomas', area: 'Sarria', description: 'Best patatas bravas in Barcelona. Worth the metro ride.', price: '€1-10', validated: true, validator: 'Research' },
        { name: 'Cal Pep', area: 'El Born', description: 'Standing-bar tapas legend. Baby squid and clams.', price: '€20-30', validated: true, validator: 'Research' },
        { name: 'Cerveceria Catalana', area: 'Eixample', description: 'Montaditos and tapas. Reliable, always good.', price: '€10-20', validated: true, validator: 'Brady' },
        { name: 'Mercat de Santa Caterina', area: 'El Born', description: 'Local alternative to Boqueria. Less touristy, better prices.', price: '€1-10', validated: true, validator: 'Brady' },
        { name: 'Hand Of God', area: 'El Born', description: 'Independent football jersey shop — rare and retro kits.', price: '€20+', rating: 4.7, validated: true, validator: 'Brady', note: 'Lads Pick' },
      ]
    },
    {
      name: 'Madrid Essentials',
      id: 'madrid-essentials',
      spots: [
        { name: 'Prado Museum', area: 'Retiro', description: 'Velazquez\'s Las Meninas and Goya\'s Black Paintings. Free last 2 hours but huge queues.', price: '€15', validated: true, validator: 'Dawson', tier: 'Must-Hit' },
        { name: 'Reina Sofia', area: 'Atocha', description: 'Home to Picasso\'s Guernica. Essential viewing.', price: '€12', validated: true, validator: 'Dawson', tier: 'Must-Hit' },
        { name: 'Retiro Park', area: 'Retiro', description: 'Madrid\'s green lungs. Free. Row boats, Crystal Palace, people-watching.', price: 'Free', validated: true, validator: 'Dawson' },
        { name: 'Santiago Bernabeu', area: 'Chamartin', description: 'Fully integrated entertainment complex. 85K+ capacity. Tour worth it even without match tickets.', price: '€300-500 match', validated: true, validator: 'Dawson', tier: 'Must-Hit' },
        { name: 'Temple de Debod', area: 'Moncloa', description: 'Actual Egyptian temple in a Madrid park, gifted by Egypt in 1968. Free. Sunset views behind Royal Palace.', price: 'Free', validated: true, validator: 'Dawson', note: 'Dawson Pick' },
        { name: 'Teatro Kapital', area: 'Atocha', description: 'Seven floors in former theater. EDM, karaoke, reggaeton, rooftop. Strict dress code. Arrive after 1am.', price: '€15-20 entry', validated: true, validator: 'Dawson', tier: 'Must-Hit' },
        { name: 'Circulo de Bellas Artes', area: 'Centro', description: 'Best skyline rooftop bar in Madrid. 360-degree views.', price: '€5 entry + drinks', validated: true, validator: 'Dawson' },
        { name: 'Mercado de San Anton', area: 'Chueca', description: 'Market below, rooftop bar above. Early-evening move.', price: '€10-20', validated: true, validator: 'Dawson' },
      ]
    },
  ],

  dayTrips: [
    { name: 'Montserrat', from: 'Barcelona', description: 'Jagged mountain range with Benedictine monastery. R5 train from Placa d\'Espanya + cable car or rack railway. Insane views. Half-day minimum.', price: '~€25', ladsRating: '9/10', bookingUrl: 'https://www.viator.com/tours/Barcelona/From-Barcelona-Montserrat-Girona-and-Sitges-Full-Day-Tour/d562-6874P164', bookingPlatform: 'Viator' },
    { name: 'Girona', from: 'Barcelona', description: 'Medieval city, Game of Thrones filming location. 38-minute AVANT train. Half-day viable. Bagels & Beers for a pint after.', price: '~€12' },
    { name: 'Sitges', from: 'Barcelona', description: '30 minutes south by train. Refined beach town with beautiful coves. More upscale than Barceloneta.', price: '~€6' },
    { name: 'Segovia', from: 'Madrid', description: 'Perfectly preserved Roman Aqueduct and Alcazar castle (Disney castle inspiration). 30-minute high-speed train. Roast suckling pig famous.', price: '~€12', ladsRating: '8/10' },
    { name: 'Toledo', from: 'Madrid', description: 'UNESCO "City of Three Cultures" — Christian, Jewish, Muslim heritage. 30 minutes from Madrid. Medieval streets.', price: '~€14', ladsRating: '8/10' },
  ],

  mapsLinks: [
    { name: 'Barcelona Food', url: 'https://maps.app.goo.gl/bZp95gDP9VwBe6Kd7' },
    { name: 'Barcelona Bars', url: 'https://maps.app.goo.gl/2LZGLZQEuT53NK3Z8' },
    { name: 'Barcelona Attractions', url: 'https://maps.app.goo.gl/63o5dgY5Fr8SJUZk6' },
  ],

  logistics: {
    flights: 'Direct flights from ORD to Barcelona on American, United, Iberia (~8.5 hrs). Open-jaw routing: fly into BCN, out of MAD — same price as round-trip. Book 4-6 months ahead for best fares.',
    inCountry: 'Barcelona to Madrid: Iryo train (Frecciarossa 1000, 2.5 hrs, XXL leather seats, 5G WiFi). Budget option: Ouigo from €9 if booked 60+ days ahead. AVE/Iryo is the best transport value in Europe.',
    gettingAround: 'Barcelona: T-Casual 10-ride metro card (€11.35). Madrid: 10-trip Metrobus ticket (€12.20). Both cities highly walkable within central neighbourhoods.',
    tipping: '5-10% max, not mandatory. Round up at bars. Never tip 20% — it confuses staff. Always pay in euros, never accept Dynamic Currency Conversion (3-5% fee).',
  },

  costModel: {
    headers: ['Category', 'Lean', 'Standard', 'Generous'],
    rows: [
      ['Flights (ORD)', '$650', '$850', '$1,200'],
      ['Accommodation (7 nights)', '$350', '$550', '$900'],
      ['Food & Drink', '$350', '$500', '$800'],
      ['Activities', '$150', '$300', '$600'],
      ['Transport', '$40', '$80', '$150'],
    ],
    totals: ['Total (Barcelona 7d)', '$1,540', '$2,280', '$3,650'],
    lean: 'Football tickets not included in standard — add $300-$500/person. Group of 4 sharing accommodation for best rate.',
  },

  mistakes: [
    { title: 'Staying on Las Ramblas', detail: 'Tourist pricing, pickpocket corridor. Stay in Eixample instead.' },
    { title: 'Eating at La Boqueria', detail: 'Tourist traps, double prices. Go to Mercat de Santa Caterina instead.' },
    { title: 'Tipping American-style', detail: '20% confuses staff. 5-10% max or just round up.' },
    { title: 'Showing up to Madrid clubs before 1am', detail: 'The city operates on a different clock. Dinner at 10pm, pre-game until 1am, clubs until 6am.' },
    { title: 'Skipping Montserrat', detail: 'Turns a city trip into a multi-destination experience. Half-day trip, absolutely worth it.' },
  ],

  ladsTake: 'Brady lived in Eixample. Dawson lived in Malasana. Between the two of us, these cities aren\'t recommendations — they\'re home turf. If you trust us on one framework, make it this one.',

  specialCallouts: [],

  navSections: ['Overview', 'Barcelona Architecture', 'Barcelona Bars', 'Barcelona Food', 'Madrid', 'Day Trips', 'Maps', 'Logistics'],
};

export default spain;
