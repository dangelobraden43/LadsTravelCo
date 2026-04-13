export default {
  id: 'michigan',
  name: 'Michigan Local Intelligence',
  region: 'Michigan',
  route: '/michigan',
  tagline: 'Every brewery, bar, concert, and golf course across Michigan.',
  confidence: 'Brady — Personally Validated',
  heroStats: [
    { value: '42+', label: 'Venues' },
    { value: '123', label: 'Shows Tracked' },
    { value: '9', label: 'Golf Destinations' },
  ],

  palette: {
    bg: '#1a4d2e',
    surface: '#1f5a36',
    elevated: '#24663e',
    accent: '#96782a',
  },

  overview: {
    quickRead: 'Home turf. Breweries across 8 regions, 123 concerts April-November 2026, 9 golf destinations, 8 curated bar crawls. No fluff, no ads, just intel.',
    budget: 'See individual runs for cost estimates',
  },

  categories: [
    {
      name: 'Grand Rapids Breweries',
      id: 'grand-rapids-breweries',
      spots: [
        { name: 'Founders Brewing', area: 'Grand Rapids', description: 'Flagship GR brewery. KBS, All Day IPA, and a massive taproom.', rating: 9.2, validated: true, validator: 'Brady', tier: 'Must-Hit' },
        { name: 'Brewery Vivant', area: 'Grand Rapids', description: 'Belgian farmhouse style in a converted chapel. Outstanding atmosphere.', rating: 9.0, validated: true, validator: 'Brady', tier: 'Must-Hit' },
        { name: 'Winchester', area: 'Grand Rapids', description: 'Craft cocktails and elevated pub food. One of the best spots in GR.', rating: 9.0, validated: true, validator: 'Brady', tier: 'Must-Hit' },
        { name: "Butcher's Union", area: 'Grand Rapids', description: 'Steakhouse meets craft bar. High-end for GR.', rating: 8.9, validated: true, validator: 'Brady', tier: 'Must-Hit' },
        { name: 'New Holland Brewing', area: 'Grand Rapids', description: "Dragon's Milk origin. Solid taproom, solid food.", rating: 8.8, validated: true, validator: 'Brady', tier: 'Lads Pick' },
        { name: 'Mitten Brewing', area: 'Grand Rapids', description: 'Pizza and baseball memorabilia in a converted firehouse.', rating: 8.4, validated: true, validator: 'Brady', tier: 'Lads Pick' },
        { name: 'HopCat', area: 'Grand Rapids', description: '100+ taps. Crack Fries are the draw.', rating: 8.3, validated: true, validator: 'Brady', tier: 'Also Good' },
      ],
    },
    {
      name: 'Detroit',
      id: 'detroit',
      spots: [
        { name: 'Sugar House', area: 'Corktown', description: 'Best cocktail bar in Michigan. Speakeasy style, no menu — tell them what you like.', rating: 9.4, validated: true, validator: 'Brady', tier: 'Must-Hit' },
        { name: 'Eastern Market Brewing', area: 'Eastern Market', description: 'Massive space in the market district. Great beer, great energy on market days.', rating: 9.3, validated: true, validator: 'Brady', tier: 'Must-Hit' },
        { name: 'Batch Brewing', area: 'Corktown', description: 'Small-batch neighborhood brewery. Rotating taps, always interesting.', rating: 8.9, validated: true, validator: 'Brady', tier: 'Lads Pick' },
        { name: 'Slows Bar BQ', area: 'Corktown', description: 'The BBQ spot that helped revive Corktown. Always a line, always worth it.', validated: true, validator: 'Brady', tier: 'Lads Pick' },
      ],
    },
    {
      name: 'Traverse City',
      id: 'traverse-city',
      spots: [
        { name: "Short's Brewing", area: 'Bellaire / TC', description: 'Huma Lupa Licious and wildly creative seasonals. Worth the drive to Bellaire.', rating: 9.0, validated: true, validator: 'Brady', tier: 'Must-Hit' },
        { name: 'Jolly Pumpkin', area: 'Traverse City', description: 'Sour-forward, Belgian-inspired. Outdoor seating with bay views.', rating: 8.3, validated: true, validator: 'Brady', tier: 'Lads Pick' },
        { name: "Cooks' House", area: 'Traverse City', description: 'Farm-to-table fine dining. One of the best restaurants in northern Michigan.', validated: true, validator: 'Brady', tier: 'Lads Pick' },
      ],
    },
    {
      name: 'Harbor Country',
      id: 'harbor-country',
      spots: [
        { name: 'Journeyman Distillery', area: 'Three Oaks', description: 'Craft spirits in a historic corset factory. Outstanding cocktails and food.', rating: 9.1, validated: true, validator: 'Brady', tier: 'Must-Hit' },
        { name: 'Beer Church', area: 'New Buffalo', description: 'Brewery in a converted church. The vibe is exactly what it sounds like.', validated: true, validator: 'Brady', tier: 'Lads Pick' },
        { name: 'Round Barn Winery', area: 'Baroda', description: 'Wine, beer, spirits all on one property. Good afternoon stop.', rating: 8.2, validated: true, validator: 'Brady', tier: 'Also Good' },
      ],
    },
    {
      name: 'Golf',
      id: 'golf',
      spots: [
        { name: 'Arcadia Bluffs', area: 'Arcadia', description: '#16 Greatest Public Course. Lake Michigan bluffs. $250 peak, $125-195 shoulder season.', price: '$125-250', validated: true, validator: 'Research', tier: 'Must-Hit', note: '#16 Greatest Public' },
        { name: 'Forest Dunes', area: 'Roscommon', description: '#37 Greatest Public Course. The Loop is a reversible design — plays differently every day.', price: '$185-215', validated: true, validator: 'Research', tier: 'Must-Hit', note: '#37 Greatest Public' },
        { name: 'Greywalls', area: 'Marquette', description: '#55 Greatest Public Course. Upper Peninsula gem.', price: '$235', validated: true, validator: 'Research', tier: 'Must-Hit', note: '#55 Greatest Public' },
        { name: 'Hills of Lenawee', area: 'Adrian', description: '#3 GolfPass Best Value. Incredible for the price.', price: '$25-52', validated: true, validator: 'Research', tier: 'Lads Pick', note: '#3 GolfPass Value' },
      ],
    },
  ],

  dayTrips: [],

  mapsLinks: [],

  logistics: null,

  costModel: null,

  mistakes: [],

  ladsTake: 'Home turf. We grew up here, went to school here, know every brewery, every trail, and every shortcut.',

  specialCallouts: [],

  navSections: ['Overview', 'Grand Rapids', 'Detroit', 'Traverse City', 'Harbor Country', 'Golf'],
};
