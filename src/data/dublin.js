export default {
  id: 'dublin',
  name: 'Dublin + Galway',
  region: 'Ireland',
  route: '/dublin',
  tagline: '35+ pubs. One week. Both Lads were there.',
  confidence: 'Personally Validated — All Three Lads',
  heroStats: [
    { value: '35+', label: 'Pubs Visited' },
    { value: '6-7', label: 'Days' },
    { value: '3', label: 'Windows' },
  ],

  palette: {
    bg: '#0f1a15',
    surface: '#142019',
    elevated: '#1a2a22',
    accent: '#4a8c6f',
  },

  overview: {
    quickRead: 'Both Lads have done this trip. 35+ pubs in Ireland in one week. 30 rated spots in Dublin, 15 in Galway (100% validated). Three timing windows \u2014 Christmas is the one we know best. Galway is the quieter half and worth every minute. The Cliffs of Moher day trip from Galway is non-negotiable.',
    budget: '$2,200\u2013$3,400 per person (group of 4), depending on timing window and accommodation style. Flights from ORD.',
    framework: 'This is not a guide built from research. Both Lads completed this exact trip at Christmas \u2014 35+ pubs across Dublin and Galway in under a week. The personal experience is the primary source. Research covers two additional timing windows and fills the gaps.',
    philosophy: 'Ireland rewards the group that plans around pub sessions, not monuments. The sights are worth doing, but they exist to earn the pint that follows. The pub is the destination. Everything else is the route there.',
    ladsBothKnow: 'Christmas. Every time. The pubs are full of people who actually live there. Seventy percent local crowd, fire-lit snugs, and the best trad music sessions of any window.',
  },

  timingWindows: [
    {
      id: 'christmas',
      name: 'Christmas',
      recommended: true,
      atmosphere: 'Cozy, fire-lit, local',
      crowdMix: '70% local',
      pubExperience: 'Snugs, warm sessions',
      priceTier: 'Moderate',
      primaryDraw: 'Wren Day, markets',
      verdict: 'Best for this group',
      detail: 'Late December. Dublin Castle Christmas Market. Galway\u2019s Eyre Square Market (50+ chalets, 32-meter Big Wheel, German Bier Keller). Dec 25 full closure. Dec 26 = St. Stephen\u2019s Day (Wren Day) \u2014 wrenboy parades, pub sessions noon to midnight.',
    },
    {
      id: 'stpatricks',
      name: "St. Patrick's",
      recommended: false,
      atmosphere: 'Chaotic, global spectacle',
      crowdMix: '80% tourist',
      pubExperience: 'Standing room only',
      priceTier: 'Highest',
      primaryDraw: 'Parade, After Dark',
      verdict: 'Energy yes, crowds no',
      detail: '4-day festival, 500,000 people. After Dark concerts March 14\u201316. Galway substantially better in this window. Book 9\u201312 months out. Flights from ORD $900\u2013$1,300.',
    },
    {
      id: 'summer',
      name: 'Summer / GIAF',
      recommended: false,
      atmosphere: 'Bohemian, artistic',
      crowdMix: '50/50',
      pubExperience: 'Outdoor, live gigs',
      priceTier: 'High',
      primaryDraw: 'Heineken Big Top',
      verdict: 'Worth it for GIAF',
      detail: 'Galway Arts Festival July 13\u201326, 2026. Heineken Big Top at Nimmo\u2019s Pier (James, The Flaming Lips, Saw Doctors). Roisin Dubh and Monroe\u2019s run official festival gigs. Accommodation doubles, books 6\u20138 months out.',
    },
  ],

  itinerary: [
    { day: 'Friday', anchor: 'Dublin Arrival', stops: 'Lark Inn, Ginger Man, Christ Church area' },
    { day: 'Saturday', anchor: 'Dublin Sights', stops: 'Trinity, St Patrick\u2019s, Dublin Castle, The Long Hall' },
    { day: 'Sunday', anchor: 'Day Trip', stops: 'Wicklow/Glendalough or Kilkenny Castle' },
    { day: 'Monday', anchor: 'Howth + Guinness', stops: 'DART to Howth, cliff walk, Storehouse, Brazen Head' },
    { day: 'Tuesday', anchor: 'Train to Galway', stops: 'Irish Rail, Latin Quarter, Taaffes, Tig Coili' },
    { day: 'Wednesday', anchor: 'Cliffs of Moher', stops: 'Burren, Hazel Mountain Chocolate, evening pints' },
    { day: 'Thursday', anchor: 'Galway + Depart', stops: 'Morning wander, Garavans for a final pint' },
  ],

  templeBarWarning: {
    title: 'The Temple Bar Warning',
    text: 'Temple Bar looks like Ireland. It is not Ireland. Walk 12 minutes to Stoneybatter or stay in the Liberties and pay half price for an identical pint in a better pub with a better crowd.',
    comparison: [
      { label: 'Temple Bar Pub', price: '\u20AC10.45/pint', verdict: 'bad' },
      { label: 'Stoneybatter local', price: '\u20AC5.50/pint', verdict: 'good' },
    ],
    groupNote: 'For a group of 8, drinking in Temple Bar costs over \u20AC20 per person per night in wasted spend.',
  },

  categories: [
    {
      name: 'Dublin Pubs',
      id: 'dublin-pubs',
      spots: [
        { name: 'The Cobblestone', area: 'Smithfield', description: 'Best trad pub in Dublin. Locals fought a development to protect it. Arrive before 9pm for a seat.', rating: 4.7, price: '\u20AC10\u201320', validated: true, validator: 'Research', tier: 'Must-Hit' },
        { name: 'John Kavanagh / The Gravediggers', area: 'Glasnevin', description: 'Unchanged for 150 years. Worth the trip from the centre.', rating: 4.7, price: '\u20AC10\u201320', validated: true, validator: 'Research', tier: 'Must-Hit' },
        { name: "Darkey Kelly's", area: 'Fishamble Street', description: 'Historic, excellent reviews, high energy.', rating: 4.7, price: '\u20AC20\u201330', validated: true, validator: 'Research', tier: 'Must-Hit' },
        { name: 'The Long Hall', area: 'South Great George\u2019s St', description: 'Victorian interior. One of Dublin\u2019s most beautiful pubs. Dark wood, high ceilings. Slow pint territory.', rating: 4.6, price: '\u20AC10\u201320', validated: true, validator: 'Both Lads', tier: 'Must-Hit' },
        { name: "O'Donoghues Bar", area: 'Merrion Row', description: 'Legendary trad music. The Dubliners started here.', rating: 4.6, validated: true, validator: 'Both Lads', tier: 'Must-Hit' },
        { name: 'The Celt', area: 'Talbot Street', description: 'Live trad music nightly. Tourist-friendly but genuinely good sessions.', rating: 4.6, price: '\u20AC20\u201330', validated: true, validator: 'Research', tier: 'Must-Hit' },
        { name: 'The Lark Inn', area: 'Harold\u2019s Cross', description: 'The arrival ritual. Toasties and cheap pints to decompress from the journey.', rating: 4.6, validated: true, validator: 'Both Lads', tier: 'Must-Hit', note: 'Arrival Ritual' },
        { name: 'The Ginger Man', area: 'Fenian Street', description: 'Favourite pub in Dublin among the Lads. More local crowd. The kind of place you go back to.', rating: 4.5, price: '\u20AC10\u201320', validated: true, validator: 'Both Lads', tier: 'Lads Pick', note: 'Lads Favourite' },
        { name: 'The Brazen Head', area: 'Bridge Street', description: 'Oldest pub in Ireland, established 1198. Touristy but unmissable.', rating: 4.5, price: '\u20AC20\u201330', validated: true, validator: 'Both Lads', tier: 'Lads Pick' },
        { name: "Kehoe's", area: 'South Anne Street', description: 'Victorian snug pub. Fireplace and a perfectly poured pint.', rating: 4.5, price: '\u20AC10\u201320', validated: true, validator: 'Research', tier: 'Lads Pick' },
        { name: "Mulligan's", area: 'Poolbeg Street', description: 'Best Guinness in Dublin. No frills. Perfect pint.', validated: true, validator: 'Research', tier: 'Lads Pick' },
        { name: "The Stag's Head", area: 'Dame Court', description: 'Victorian. One of Dublin\u2019s most photogenic bars. Stained glass and dark wood.', rating: 4.5, price: '\u20AC10\u201320', validated: true, validator: 'Research', tier: 'Lads Pick' },
        { name: 'The Dawson Lounge', area: 'Dawson Street', description: 'Smallest pub in Dublin. A must for novelty alone.', rating: 4.5, price: '\u20AC1\u201310', validated: true, validator: 'Both Lads', tier: 'Lads Pick' },
        { name: "Grogan's", area: 'South William Street', description: 'Artist pub. Cheap pints, no music. Bohemian crowd.', rating: 4.5, price: '\u20AC10\u201320', validated: true, validator: 'Research', tier: 'Lads Pick' },
        { name: "O'Neills", area: 'Suffolk Street', description: 'Large, good energy. Became the designated Jager bomb stop.', rating: 4.5, price: '\u20AC10\u201320', validated: true, validator: 'Both Lads', tier: 'Also Good' },
        { name: 'The Blind Pig Speakeasy', area: 'Fade Street', description: 'Prohibition-style speakeasy. Good for a one-off cocktail night.', rating: 4.4, price: '\u20AC\u20AC\u20AC', validated: true, validator: 'Research', tier: 'Also Good' },
        { name: 'Bunsen', area: 'Various', description: 'Best burgers in Dublin. Simple menu. Hit this for at least one lunch.', validated: true, validator: 'Research', tier: 'Also Good' },
      ],
    },
    {
      name: 'Dublin Sights',
      id: 'dublin-sights',
      spots: [
        { name: 'Trinity College / The Long Room', area: 'College Green', description: 'The Long Room library is extraordinary. One of the most photographed rooms in Europe.', rating: 4.6, price: '\u20AC14+', validated: true, validator: 'Research' },
        { name: 'Guinness Storehouse', area: "St James's Gate", description: 'Gravity Bar pint with 360-degree views. Get the Stoutie.', rating: 4.4, price: '\u20AC26+', validated: true, validator: 'Both Lads', note: 'Must Do' },
        { name: "St Patrick's Cathedral", area: 'Patrick Street', description: 'Ireland\u2019s largest cathedral. Jonathan Swift\u2019s tomb.', rating: 4.5, price: '\u20AC8', validated: true, validator: 'Research' },
        { name: 'Kilmainham Gaol', area: 'Inchicore', description: 'Where the 1916 Rising leaders were executed. Essential.', rating: 4.7, price: '\u20AC8', validated: true, validator: 'Research' },
        { name: 'Dublin Castle', area: 'Dame Street', description: 'Former seat of British rule. Gardens are free.', rating: 4.3, price: '\u20AC8', validated: true, validator: 'Research' },
      ],
    },
    {
      name: 'Galway Pubs',
      id: 'galway-pubs',
      spots: [
        { name: 'Tig Coili', area: 'Mainguard Street', description: 'Best trad music sessions in Galway. Pack in early \u2014 seats disappear by 8pm.', rating: 4.7, price: '\u20AC10\u201320', validated: true, validator: 'Both Lads' },
        { name: "O'Connell's Bar", area: 'Eyre Square', description: "One of Galway's best traditional pubs. Nearly 3,000 reviews at 4.7 stars.", rating: 4.7, price: '\u20AC10\u201320', validated: true, validator: 'Both Lads' },
        { name: 'Taaffes Bar', area: 'Shop Street', description: 'Trad music, cheap pints. Both Lads returned a second time the same night.', rating: 4.6, price: '\u20AC1\u201310', validated: true, validator: 'Both Lads', note: 'Went Back Twice' },
        { name: 'Tigh Neachtain', area: 'Quay Street', description: 'Classic Galway pub. Outdoor seating on Quay Street. Colourful exterior.', rating: 4.6, price: '\u20AC10\u201320', validated: true, validator: 'Both Lads', note: "Lads' Galway Pick" },
        { name: "Garavan's Bar", area: 'William Street', description: 'No music. Great pints, good conversation. The right final pint of the trip.', rating: 4.6, price: '\u20AC10\u201320', validated: true, validator: 'Both Lads' },
        { name: 'Barr An Chaladh', area: 'Docks', description: 'Quieter pint away from the main strip. Good for landing in Galway.', rating: 4.6, price: '\u20AC10\u201320', validated: true, validator: 'Both Lads' },
        { name: 'The Kings Head', area: 'High Street', description: 'Medieval building, live music. One of the most atmospheric rooms in the city.', rating: 4.4, price: '\u20AC20\u201330', validated: true, validator: 'Both Lads' },
        { name: "McGinn's Hop House", area: 'Quay Street', description: 'Gastropub with craft beer focus.', rating: 4.5, price: '\u20AC10\u201320', validated: true, validator: 'Both Lads' },
        { name: 'Salt House', area: 'Raven Terrace', description: 'Very good. Pending full database entry.', validated: true, validator: 'Both Lads' },
        { name: 'Tigh Chinn', area: 'Latin Quarter', description: 'Very good. Pending full database entry.', validated: true, validator: 'Both Lads' },
      ],
    },
    {
      name: 'Galway Food & Sights',
      id: 'galway-food-sights',
      spots: [
        { name: 'The Dough Bros', area: 'Middle Street', description: 'Best-reviewed restaurant in Galway. Worth a dinner stop.', rating: 4.7, price: '\u20AC10\u201320', validated: true, validator: 'Research' },
        { name: 'The Latin Quarter', area: 'Galway Centre', description: 'Medieval quarter. Best area to wander. This is where the pub circuit concentrates.', rating: 4.6, price: 'Free', validated: true, validator: 'Both Lads' },
        { name: 'Galway Cathedral', area: 'University Road', description: 'Worth a look if arriving by road.', rating: 4.6, price: 'Free', validated: true, validator: 'Research' },
      ],
    },
  ],

  dayTrips: [
    {
      name: 'Howth Cliff Walk',
      from: 'Dublin',
      description: '30 minutes by DART from Connolly or Tara Street. Coastal village, cliff walk with Atlantic views, seafood at the harbour, pint at McNeills at the trailhead.',
      rating: 4.9,
      price: 'Free',
      ladsRating: '8/10',
    },
    {
      name: 'Wicklow & Glendalough & Kilkenny',
      from: 'Dublin',
      description: 'Wicklow Mountains (1 hour south, monastic ruins, lake, mountain scenery \u2014 8.5/10) and Kilkenny Castle (1.5 hours, medieval castle, cobbled streets, Matt the Millers pub stop).',
      bookingUrl: 'https://gyg.me/V0UrxNUe',
      bookingPlatform: 'GetYourGuide',
      ladsRating: '8.5/10',
    },
    {
      name: 'Cliffs of Moher & The Burren',
      from: 'Galway',
      description: 'One of the most dramatic coastal sites in Europe. The Burren is a lunar limestone landscape completely different from the rest of Ireland. Stop at Hazel Mountain Chocolate en route \u2014 genuinely excellent.',
      bookingUrl: 'https://www.viator.com/tours/Galway/Cliffs-of-Moher-and-Burren-Day-Trip-Including-Dunguaire-Castle-Aillwee-Cave-and-Doolin-from-Galway/d5156-8625P1',
      bookingPlatform: 'Viator',
      ladsRating: '9/10',
    },
  ],

  mapsLinks: [
    { name: 'Dublin Pubs & Food', url: 'https://maps.app.goo.gl/NrZtg6tUR1Rjk8oS8' },
    { name: 'Dublin Attractions', url: 'https://maps.app.goo.gl/9YLakDkjrE6jj7cQA' },
    { name: 'Galway', url: 'https://maps.app.goo.gl/deRD11SQis6ZUsKL8' },
  ],

  logistics: {
    flights: 'ORD to DUB \u2014 Aer Lingus and United nonstop daily, 7h15m. DTW has no nonstop; connections via JFK, BOS, or PHL. ORD is worth the drive.',
    inCountry: 'Irish Rail Dublin to Galway: ~\u20AC45/person, 2h10m, comfortable and direct.',
    gettingAround: 'Howth: DART 30 min from Connolly. Wicklow/Glendalough: Tour or rental car. Cliffs: Tour from Galway. Urban: Uber works in Dublin, taxis reliable, walking is default.',
    tipping: 'Round up. Do not leave 20%.',
  },

  costModel: {
    headers: ['Category', 'Christmas', "St. Pat's", 'Summer'],
    rows: [
      ['Flights (ORD)', '$850', '$1,100', '$1,200'],
      ['Accommodation (6 nights)', '$600', '$900', '$750'],
      ['Dublin\u2013Galway Train', '$50', '$50', '$50'],
      ['Pub Spend (~\u20AC60/day)', '$450', '$500', '$450'],
      ['Food (~\u20AC40/day)', '$300', '$300', '$300'],
      ['Activities', '$150', '$150', '$200'],
    ],
    totals: ['Total (Standard)', '$2,400', '$3,000', '$2,950'],
    lean: '~$1,900 (Christmas). Hostel private dorms, Bus Eireann, \u20AC5 pints, grocery breakfasts.',
  },

  mistakes: [
    { title: 'Drinking in Temple Bar', detail: '\u20AC10.45/pint vs \u20AC5.50 in Stoneybatter, 12 minutes away.' },
    { title: 'Assuming All Pubs Are the Same', detail: 'A trad session pub and a DJ bar are different planets.' },
    { title: 'Underestimating Galway', detail: "It's not a day trip. Give it two full nights minimum." },
    { title: 'Tipping Like an American', detail: 'Round up to the nearest euro. That\u2019s it.' },
    { title: "Booking St. Patrick's Day Late", detail: 'Need 9\u201312 months out. Flights ORD hit $900\u2013$1,300.' },
    { title: 'Skipping Howth', detail: '30 min by DART. Coastal cliff walk. Rated 8/10.' },
  ],

  ladsTake: 'Ireland rewards the group that plans around pub sessions, not monuments. The sights are worth doing, but they exist to earn the pint that follows. The pub is the destination. Everything else is the route there.',

  specialCallouts: [],

  navSections: ['Overview', 'Dublin', 'Galway', 'Day Trips', 'Maps', 'Logistics'],
};
