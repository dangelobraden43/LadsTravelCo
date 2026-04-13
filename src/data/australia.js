export default {
  id: 'australia',
  name: 'Australia + NZ',
  region: 'Southern Hemisphere',
  route: '/australia',
  tagline: 'Sydney. Tasmania. Queenstown. Built on six weeks of living there.',
  confidence: 'Brady — Personally Validated (Sydney + Tasmania). NZ Research-Based.',
  heroStats: [
    { value: '123', label: 'Sydney Spots' },
    { value: '6', label: 'Weeks Lived There' },
    { value: '3', label: 'Regions' },
  ],

  palette: {
    bg: '#0B1A2E',
    surface: '#112240',
    elevated: '#172850',
    accent: '#D4835E',
  },

  overview: {
    quickRead: 'Brady lived in Sydney for six weeks. 57 rated spots in Sydney, 18 in Tasmania. Two versions — V1 Australia only, V2 adds trans-Tasman hop to NZ.',
    budget: '$3,500–$5,500 per person depending on version and duration',
  },

  categories: [
    {
      name: 'Sydney Brewery Crawl',
      id: 'sydney-breweries',
      spots: [
        { name: 'Philter Brewing', area: 'Marrickville', description: 'Best brewery in the crawl. Consistently excellent beers across the range.', rating: 9.5, validated: true, validator: 'Brady', tier: 'Must-Hit' },
        { name: 'Sauce Brewing Co', area: 'Marrickville', description: 'Strong lineup, great taproom atmosphere.', rating: 9.0, validated: true, validator: 'Brady', tier: 'Must-Hit' },
        { name: 'Grifter Brewing Co', area: 'Marrickville', description: 'Solid beers, good vibes. Part of the Marrickville circuit.', rating: 8.5, validated: true, validator: 'Brady', tier: 'Lads Pick' },
        { name: 'Hawkes Brewing Co', area: 'Marrickville', description: 'Cider-forward but does both well.', rating: 8.0, validated: true, validator: 'Brady', tier: 'Lads Pick' },
        { name: 'Mixtape Brewing', area: 'Marrickville', description: 'Worth a stop if doing the full crawl.', rating: 7.0, validated: true, validator: 'Brady', tier: 'Also Good' },
      ],
    },
    {
      name: 'Sydney Speakeasy Circuit',
      id: 'sydney-speakeasies',
      spots: [
        { name: 'Maybe Sammy', area: 'The Rocks', description: 'One of the best cocktail bars in the world. Literally award-winning.', validated: true, validator: 'Brady', tier: 'Must-Hit' },
        { name: 'Baxter Inn', area: 'CBD', description: 'Whiskey bar hidden down an alley. Hundreds of bottles. No sign outside.', validated: true, validator: 'Brady', tier: 'Must-Hit' },
        { name: 'Old Mates Place', area: 'CBD', description: 'Speakeasy with a rotating concept. Find the door.', validated: true, validator: 'Brady', tier: 'Lads Pick' },
        { name: 'Cantina OK', area: 'CBD', description: 'Mezcal-focused basement bar. Small, intimate, excellent drinks.', validated: true, validator: 'Brady', tier: 'Lads Pick' },
      ],
    },
    {
      name: 'Sydney Food',
      id: 'sydney-food',
      spots: [
        { name: 'Marrickville Pork Roll', area: 'Marrickville', description: 'Best banh mi in Sydney. Under $10. The line is worth it.', validated: true, validator: 'Brady', tier: 'Must-Hit' },
        { name: 'Gelato Messina', area: 'Various', description: 'Best gelato in Australia. Multiple locations. Get the specials board.', validated: true, validator: 'Brady', tier: 'Must-Hit' },
        { name: "Mary's Burgers", area: 'Newtown', description: 'Dive bar burgers. Loud music, cheap beer, incredible smash burgers.', validated: true, validator: 'Brady', tier: 'Lads Pick' },
        { name: 'El Jannah', area: 'Various', description: 'Lebanese charcoal chicken. Garlic sauce is legendary.', validated: true, validator: 'Brady', tier: 'Lads Pick' },
      ],
    },
    {
      name: 'Sydney Day Trips',
      id: 'sydney-day-trips',
      spots: [
        { name: 'Figure 8 Pools', area: 'Royal National Park', description: 'Only accessible at low tide. 6km return hike. Unique on the planet.', rating: 11, validated: true, validator: 'Brady', tier: 'Must-Hit', note: 'Safety: Check Risk Forecast' },
        { name: 'Manly Ferry', area: 'Circular Quay to Manly', description: 'Best ferry ride in Sydney. Butterboy cookie at Manly. 4 Pines on the way back.', rating: 9.5, validated: true, validator: 'Brady', tier: 'Must-Hit' },
        { name: 'Blue Mountains', area: '1.5 hours west', description: 'Three Sisters, Jamison Valley. Full day trip.', rating: 9.0, validated: true, validator: 'Brady', tier: 'Must-Hit' },
      ],
    },
    {
      name: 'Tasmania Bars',
      id: 'tasmania-bars',
      spots: [
        { name: 'Pickled Frog', area: 'Hobart', description: 'Backpacker bar with character. Cheap drinks, good crowd.', validated: true, validator: 'Brady', tier: 'Lads Pick' },
        { name: 'In the Hanging Garden', area: 'Hobart', description: 'Cocktail bar with a moody atmosphere. Worth a night out.', validated: true, validator: 'Brady', tier: 'Lads Pick' },
        { name: 'Hope and Anchor', area: 'Hobart', description: 'Historic pub. Solid pints in a classic setting.', validated: true, validator: 'Brady', tier: 'Also Good' },
      ],
    },
  ],

  dayTrips: [
    {
      name: 'Figure 8 Pools',
      from: 'Sydney',
      description: '6km return. Only at low tide. Unique on the planet.',
      ladsRating: '11/10',
    },
    {
      name: 'Manly Ferry',
      from: 'Sydney',
      description: 'Best ferry ride in Sydney. Butterboy cookie. 4 Pines on the way back.',
      ladsRating: '9.5/10',
    },
    {
      name: 'Blue Mountains',
      from: 'Sydney',
      description: '1.5 hours. Three Sisters, Jamison Valley. Full day.',
      ladsRating: '9/10',
    },
  ],

  mapsLinks: [],

  logistics: {
    flights: '20–23 hours. No direct from the Midwest. Connections via LAX, SFO, or DFW typical.',
    inCountry: 'Opal card for Sydney transit. Sunday cap $9.65 AUD — do all your travel on Sundays.',
    tipping: 'Not expected. Do not tip like an American.',
  },

  costModel: {
    headers: ['Category', 'Summer', 'Shoulder'],
    rows: [
      ['Flights', '$1,200–$1,800', '$1,100–$1,500'],
      ['Accommodation/day', '$150–$250', '$120–$200'],
      ['Food/day', '$80–$150', '$70–$130'],
      ['V1 Total (10–12 days)', '$3,500–$5,600', '$2,800–$4,800'],
    ],
    totals: ['Total Range', '$3,500–$5,600', '$2,800–$4,800'],
  },

  mistakes: [
    { title: 'Underestimating Distances', detail: 'Australia is a continent. Sydney to Melbourne is a 9-hour drive. Plan flights between regions.' },
    { title: 'Only Doing Bondi', detail: 'Bondi is fine. Manly is better. Coogee to Bondi walk is the move if you must do Bondi.' },
    { title: 'Skipping Tasmania', detail: 'Hobart, Cradle Mountain, MONA. Tasmania is the part of Australia most people miss and most people should not.' },
    { title: 'Not Budgeting for Food', detail: 'Australia is expensive. $80–$150/day on food is normal, not extravagant.' },
    { title: 'Flying Through on a Stopover', detail: 'Two days in Sydney is worse than not going. Give it a week minimum or save it for a real trip.' },
  ],

  ladsTake: 'Australia is not just a trip. It is a lifestyle reset.',

  specialCallouts: [],

  navSections: ['Overview', 'Sydney Breweries', 'Sydney Speakeasies', 'Sydney Food', 'Day Trips', 'Tasmania', 'Logistics'],
};
