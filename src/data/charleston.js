export default {
  id: 'charleston',
  name: 'Charleston',
  region: 'South Carolina',
  route: '/charleston',
  tagline: 'The Holy City — Michelin kitchens, rooftops over the harbor, ten miles of Atlantic shoreline.',
  confidence: 'Brady — Personally Validated',
  heroStats: [
    { value: '6', label: 'Night Trip' },
    { value: '3', label: 'Michelin Spots' },
    { value: '8', label: 'Restaurants' },
  ],

  palette: {
    bg: '#1E2D4A',
    surface: '#243352',
    elevated: '#2A3D5E',
    accent: '#C4714E',
  },

  overview: {
    quickRead: 'Spring 2026 guide. Kiawah Island base, 35-45 min drive to downtown. Six nights covering Michelin restaurants, rooftop bars, Charleston Festival, beach day, and King Street shopping.',
    budget: 'See daily itinerary for individual restaurant pricing',
  },

  categories: [
    {
      name: 'Michelin & Fine Dining',
      id: 'michelin-fine-dining',
      spots: [
        { name: 'Chubby Fish', area: 'Downtown', description: 'NYT top 50, Eater All-Time 38. No reservations — queue at 4:45pm.', validated: true, validator: 'Brady', tier: 'Must-Hit', note: 'Queue 4:45pm, no reservations' },
        { name: "Vern's", area: 'Downtown', description: 'Michelin star. Book 3-4 weeks out.', validated: true, validator: 'Brady', tier: 'Must-Hit', note: 'Book 3-4 weeks ahead' },
        { name: 'Malagon', area: 'Downtown', description: 'Michelin star. Spanish tapas, ~$40/head. Bar walk-in available at noon.', validated: true, validator: 'Brady', tier: 'Must-Hit', note: 'Bar walk-in at noon' },
        { name: 'Husk', area: 'Downtown', description: 'Michelin recommended. Southern heritage cooking. Reserve 2+ weeks out.', validated: true, validator: 'Brady', tier: 'Must-Hit', note: 'Reserve 2+ weeks' },
      ],
    },
    {
      name: 'Dinner Spots',
      id: 'dinner-spots',
      spots: [
        { name: '82 Queen', area: 'Queen Street', description: 'Refined Lowcountry. Reserve 1-2 weeks out.', validated: true, validator: 'Brady', tier: 'Must-Hit', note: 'Reserve 1-2 weeks' },
        { name: 'Fleet Landing', area: 'Waterfront', description: 'Waterfront dining. Shrimp & grits.', validated: true, validator: 'Brady', tier: 'Lads Pick' },
        { name: 'The Lost Isle', area: 'Downtown', description: 'Southern Living Restaurant of the Year 2025. Walk-in by 6:30pm.', validated: true, validator: 'Brady', tier: 'Lads Pick', note: 'Walk-in by 6:30pm' },
        { name: "Poogan's Porch", area: 'Queen Street', description: 'Since 1976. Go for brunch.', validated: true, validator: 'Brady', tier: 'Lads Pick', note: 'Brunch spot' },
      ],
    },
    {
      name: 'Bars & Rooftops',
      id: 'bars-rooftops',
      spots: [
        { name: 'The Vendue Rooftop', area: 'Vendue Range', description: 'Harbor views. No cover.', validated: true, validator: 'Brady', tier: 'Must-Hit' },
        { name: 'Satellite Bar', area: '495 King Street', description: '360-degree skyline views. Age 23+ after 9pm.', validated: true, validator: 'Brady', tier: 'Must-Hit', note: '23+ after 9pm' },
        { name: 'Babas on Cannon', area: 'Cannon Street', description: 'Aperitivo vibes.', validated: true, validator: 'Brady', tier: 'Lads Pick' },
        { name: 'Seahorse', area: 'Downtown', description: 'Jewel box cocktail bar.', validated: true, validator: 'Brady', tier: 'Lads Pick' },
        { name: 'Graft Wine', area: 'Downtown', description: '40+ wines by the glass.', validated: true, validator: 'Brady', tier: 'Lads Pick' },
        { name: 'Last Saint', area: 'Downtown', description: "AD's most beautiful bar in South Carolina.", validated: true, validator: 'Brady', tier: 'Lads Pick' },
        { name: 'Annex', area: 'Downtown', description: 'Custom cocktails, no menu. Reserve ahead.', validated: true, validator: 'Brady', tier: 'Lads Pick', note: 'Reserve ahead' },
      ],
    },
    {
      name: 'Dives',
      id: 'dives',
      spots: [
        { name: "Moe's Crosstown Tavern", area: 'Rutledge Ave', description: 'Most authentically local bar in Charleston.', validated: true, validator: 'Brady', tier: 'Lads Pick' },
        { name: 'Recovery Room', area: 'Downtown', description: '#1 PBR seller in the US.', validated: true, validator: 'Brady', tier: 'Also Good' },
      ],
    },
  ],

  dayTrips: [],

  mapsLinks: [],

  logistics: {
    gettingAround: 'Kiawah Island to downtown Charleston is 35-45 min by car. Parking at Aquarium Wharf is $2/hr. DASH trolley runs free through downtown.',
    flights: 'CHS airport is 50-55 min from Kiawah Island.',
  },

  costModel: null,

  mistakes: [
    { title: "Do Poogan's for shrimp & grits", detail: 'The brunch is the move. Since 1976 for a reason.' },
    { title: 'Do both rooftops — Vendue + Satellite', detail: 'Vendue for harbor views, Satellite for 360-degree skyline. Both no cover.' },
    { title: 'Queue Chubby Fish at 4:45pm', detail: 'No reservations. NYT top 50, Eater All-Time 38. The line is the price of admission.' },
    { title: 'Use Kiawah beach for your beach day', detail: 'Skip Folly Beach crowds. Kiawah is right there.' },
    { title: 'Reserve Annex', detail: 'Custom cocktails, no menu. Book ahead or miss out.' },
  ],

  ladsTake: "Best food city in the South, and it's not close.",

  specialCallouts: [],

  navSections: ['Overview', 'Dining', 'Bars', 'Attractions', 'Logistics'],
};
