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
    budget: '€330–380 lean to €620–750 generous (experience only). All-in with flights and accommodation: $1,800–$2,800 per person.',
    framework: 'Built from research across multiple Oktoberfest seasons. Tent rankings, cost models, and day trip logistics sourced from verified reports and local intelligence. Not yet personally validated.',
    philosophy: 'Oktoberfest rewards the group that commits to fewer tents and stays longer. Tent-hopping wastes time and guarantees you never get a seat. Pick your three sessions, arrive early, and stay put.',
  },

  categories: [
    {
      name: 'Oktoberfest Tents',
      id: 'tents',
      spots: [
        { name: 'Augustiner-Bräu', area: 'Theresienwiese', description: 'The locals\' tent. Wooden kegs tapped by hand. Best beer on the Wiesn by consensus. Hardest to get into — arrive before 9am on weekends.', validated: true, validator: 'Research', tier: 'Tier 1' },
        { name: 'Hacker-Pschorr (Himmel der Bayern)', area: 'Theresienwiese', description: 'The painted ceiling is iconic. Excellent atmosphere, strong beer, slightly easier entry than Augustiner. The "Heaven of the Bavarians."', validated: true, validator: 'Research', tier: 'Tier 1' },
        { name: 'Paulaner', area: 'Theresienwiese', description: 'High energy. Popular with younger crowds. Good music, solid beer. More accessible than the Tier 1 tents on weekdays.', validated: true, validator: 'Research', tier: 'Tier 2' },
        { name: 'Hofbräu', area: 'Theresienwiese', description: 'The tourist tent. Standing room is open entry — no reservation needed. Loudest, most chaotic. Good for one session, not three.', validated: true, validator: 'Research', tier: 'Tier 3' },
      ],
    },
    {
      name: 'Accommodation',
      id: 'accommodation',
      spots: [
        { name: 'Schwan Locke', area: 'Glockenbachviertel', description: 'Apart-hotel with kitchenettes. 15-minute walk to the Wiesn. €475–600 for 5 nights in a neighborhood with actual restaurants and bars.', price: '€475–600/5 nights', validated: true, validator: 'Research' },
      ],
    },
    {
      name: 'Neighborhood',
      id: 'neighborhood',
      spots: [
        { name: 'Glockenbachviertel', area: 'South of Altstadt', description: 'Munich\'s best neighborhood for food and nightlife outside the festival. Walkable to Theresienwiese. Where locals actually go out.', validated: true, validator: 'Research' },
        { name: 'Viktualienmarkt', area: 'Altstadt', description: 'Open-air food market with a beer garden in the center. Operating since 1807. Best lunch stop in the city.', validated: true, validator: 'Research' },
        { name: 'English Garden', area: 'Schwabing', description: 'Larger than Central Park. Beer gardens inside. Surfers on the Eisbach wave. Recovery day destination.', validated: true, validator: 'Research' },
        { name: 'Marienplatz', area: 'Altstadt', description: 'Main square. Glockenspiel at 11am and noon. Orientation point — not a destination you linger at.', validated: true, validator: 'Research' },
      ],
    },
  ],

  dayTrips: [
    {
      name: 'Neuschwanstein Castle',
      from: 'Munich',
      description: '1.5 hours by train. The castle that inspired Disney. Book tickets 60 days ahead at hohenschwangau.de — they sell out. €23.50 entry.',
      price: '€23.50',
      bookingNote: 'Book 60 days ahead at hohenschwangau.de',
    },
    {
      name: 'Salzburg',
      from: 'Munich',
      description: '1.5 hours by train. Bayern Ticket covers up to 5 people for €64 total. Mozart\'s birthplace, Festung Hohensalzburg, Mirabell Gardens. Worth a full day.',
      price: '€64 Bayern Ticket (up to 4 people)',
    },
  ],

  mapsLinks: [],

  logistics: {
    flights: 'Icelandair ORD–KEF–MUC with Iceland stopover option. $625–750 round trip. Book 3–4 months out for Oktoberfest dates.',
    inCountry: 'Group Day Ticket ~€29/day covers all public transit in Munich for up to 5 people. Bayern Ticket €64 for up to 4 people on regional trains across Bavaria.',
    gettingAround: 'U-Bahn to Theresienwiese (U4/U5). Walking from Glockenbachviertel is 15 minutes. Taxis after tent sessions — Uber works but surges hard.',
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
    lean: '€330–380 experience only. Stay in hostels, eat at Viktualienmarkt, limit tent sessions to 2.',
  },

  mistakes: [
    { title: 'Tent-Hopping', detail: 'You will not get back into a tent once you leave. Pick one per session and commit.' },
    { title: 'Arriving Mid-Day', detail: 'Tents fill by 10am on weekends, noon on weekdays. If you are not in line by 9am Saturday, you are not getting a seat.' },
    { title: 'Spending the Whole Trip on the Wiesn', detail: 'Three sessions is enough. Munich has excellent food, beer gardens, and day trips outside the festival.' },
    { title: 'Under-Tipping', detail: 'Round up to the nearest euro on drinks. Servers in tents carry 10+ liters at once — they earn it.' },
    { title: 'Buying Fake Entry Tickets', detail: 'There is no general entry ticket to Oktoberfest. Entry to the Wiesn grounds is free. Anyone selling "tickets" is scamming you.' },
    { title: 'Anchoring at Hofbräu', detail: 'It is the easiest tent to enter because it has the highest tourist concentration. Go once for the experience, then move to Augustiner or Hacker-Pschorr.' },
  ],

  ladsTake: 'Three properly executed tent sessions beat six half-sessions.',

  specialCallouts: [],

  navSections: ['Overview', 'Tent Strategy', 'Day Trips', 'Accommodation', 'Flights', 'Costs'],
};
