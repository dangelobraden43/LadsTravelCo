export default {
  id: 'thailand',
  name: 'Thailand NYE',
  region: 'Southeast Asia',
  route: '/thailand',
  tagline: 'Bangkok, Koh Phangan, Krabi. Built around New Year\'s Eve at Haad Rin.',
  confidence: 'Research-Based',
  heroStats: [
    { value: 'Dec 26', label: 'Arrival' },
    { value: 'NYE', label: 'Haad Rin Anchor' },
    { value: '4-8', label: 'Group Size' },
  ],

  palette: {
    bg: '#0e0e0c',
    surface: '#181814',
    elevated: '#222220',
    accent: '#c9a84c',
  },

  overview: {
    quickRead: 'The entire trip is built around one fixed point: Haad Rin Beach on December 31. Bangkok on arrival, ferry to Koh Phangan for NYE, then south to Krabi for beaches and recovery. Seven days, three locations, one anchor event.',
    budget: '$1,153–$1,561 lean to $1,706–$2,340 generous. All-in from ORD.',
    framework: 'Built from research across multiple sources. The itinerary is structured around the NYE Full Moon Party at Haad Rin, which dictates the timing of every other segment. Not yet personally validated.',
    philosophy: 'Thailand rewards the group that picks a base in each location and explores from there. Do not island-hop every day. Bangkok is chaos by design. Koh Phangan is the anchor. Krabi is the cooldown.',
  },

  categories: [
    {
      name: 'Bangkok Attractions',
      id: 'bangkok',
      spots: [
        { name: 'Grand Palace', area: 'Rattanakosin', description: 'The most visited site in Bangkok. Dress code enforced — long pants, covered shoulders. Go at 8:30am opening to beat the crowds. Watch for the "Grand Palace is closed" scam at the entrance.', validated: true, validator: 'Research' },
        { name: 'Wat Pho', area: 'Rattanakosin', description: 'Reclining Buddha — 46 meters long, covered in gold leaf. Adjacent to the Grand Palace. Worth combining into one morning.', validated: true, validator: 'Research' },
        { name: 'Wat Arun', area: 'Thonburi', description: 'Temple of Dawn. Cross the river by ferry from Wat Pho (4 THB). Best photographed from the east bank at sunset, best visited in person in the morning.', validated: true, validator: 'Research' },
        { name: 'Rajadamnern Muay Thai', area: 'Phra Nakhon', description: 'The original Muay Thai stadium. Fights most evenings. Real sport, not a tourist show. Ringside seats available.', validated: true, validator: 'Research' },
        { name: 'Khao San Road', area: 'Banglamphu', description: 'The backpacker strip. Worth one evening for the spectacle — street food, cheap drinks, chaos. Not worth a second visit.', validated: true, validator: 'Research' },
        { name: 'Chinatown / Yaowarat', area: 'Samphanthawong', description: 'The best street food corridor in Bangkok. Go at night when the stalls open along Yaowarat Road. This is where locals eat.', validated: true, validator: 'Research' },
        { name: 'Terminal 21 Food Court', area: 'Asok', description: 'Mall food court with full Thai meals for 60–100 THB ($1.70–$2.85). Not a tourist trap — locals eat here daily. Air-conditioned lunch stop between temples.', price: '60–100 THB', validated: true, validator: 'Research' },
      ],
    },
    {
      name: 'Koh Phangan',
      id: 'koh-phangan',
      spots: [
        { name: 'Ban Tai (Base)', area: 'West Coast', description: 'Base here, NOT Haad Rin. Ban Tai is $240/person cheaper for accommodation, quieter between events, and 20 minutes by songthaew to Haad Rin on NYE. Every dollar saved on a room is a dollar spent on the experience.', validated: true, validator: 'Research', note: '$240 cheaper than Haad Rin' },
        { name: 'Haad Rin NYE', area: 'Southeast Tip', description: 'The Full Moon Party on December 31. 30,000+ people on the beach. Free entry — no ticket required. Anyone selling "NYE tickets" is scamming you. Fire shows, DJs, bars along the entire beachfront.', validated: true, validator: 'Research', note: 'Free entry — no tickets exist' },
        { name: 'Bottle Beach', area: 'North Coast', description: 'Only accessible by boat. One of the most beautiful beaches on the island. Longtail boat from Chaloklum. Recovery day destination after NYE.', validated: true, validator: 'Research' },
      ],
    },
    {
      name: 'Krabi',
      id: 'krabi',
      spots: [
        { name: 'Railay Beach', area: 'Railay Peninsula', description: 'Only accessible by longtail boat. Limestone cliffs, clear water, rock climbing. The single best beach in mainland Thailand. Stay one night if budget allows.', validated: true, validator: 'Research' },
        { name: 'Hong Islands', area: 'Ao Nang', description: 'Day trip by longtail or speedboat from Ao Nang. Lagoon surrounded by karst cliffs. Snorkeling, kayaking, emerald water. Book the morning trip to avoid afternoon crowds.', validated: true, validator: 'Research' },
        { name: 'Tiger Cave Temple', area: 'Krabi Town', description: '1,237 steps to the summit. Panoramic views of Krabi and the Andaman coast. Go at sunrise to avoid heat. Monkeys at the base will take anything not secured.', validated: true, validator: 'Research', note: '1,237 steps' },
      ],
    },
  ],

  dayTrips: [],

  mapsLinks: [],

  logistics: {
    flights: 'Cathay Pacific ORD–HKG–BKK $800–986 round trip. Book domestic flight BKK–KSM (Koh Samui, then ferry to Koh Phangan) at the same time as international — $40–80 one way. Do not book domestic flights late; NYE routes sell out.',
    inCountry: 'BKK–KSM domestic flight $40–80, then Lomprayah ferry to Koh Phangan. Koh Phangan to Krabi: ferry + bus combo or domestic flight via Surat Thani.',
    gettingAround: 'Bangkok: BTS Skytrain + MRT for main areas, Grab (not Uber) for taxis, longtail boats on the river. Koh Phangan: rent a scooter ONLY if experienced — roads are steep and unpaved in places. Songthaew (shared trucks) are the safe default. Krabi: longtail boats to Railay, songthaew between beaches.',
  },

  costModel: {
    headers: ['Category', 'Lean', 'Generous'],
    rows: [
      ['Flights (ORD–BKK)', '$800', '$986'],
      ['Domestic Flight (BKK–KSM)', '$40', '$80'],
      ['Accommodation (7 nights)', '$140', '$490'],
      ['Food & Drink', '$70', '$210'],
      ['Activities & Boats', '$50', '$150'],
      ['Local Transit', '$30', '$70'],
      ['Ferries', '$23', '$54'],
    ],
    totals: ['All-In Total', '~$1,153–$1,561', '~$1,706–$2,340'],
    lean: '$1,153 floor assumes hostels, street food, minimal activities. $1,561 lean-comfortable with private rooms and one paid excursion per location.',
  },

  mistakes: [
    { title: 'Staying in Haad Rin', detail: 'Accommodation in Haad Rin over NYE is $240/person more expensive than Ban Tai, 20 minutes away. You are paying a premium to sleep next to a sound system.' },
    { title: 'Buying Fake NYE Tickets', detail: 'There is no ticket to the Haad Rin Full Moon Party. Entry to the beach is free. Anyone selling tickets — online or in person — is running a scam.' },
    { title: 'Renting a Scooter Without Experience', detail: 'Koh Phangan roads are steep, unpaved in sections, and shared with trucks. If you have never ridden a motorbike, this is not the place to learn. Songthaew is the safe option.' },
    { title: 'Eating on the Tourist Strip', detail: 'Tourist-facing restaurants charge 3–5x local prices. Yaowarat in Bangkok and market stalls everywhere else serve better food for a fraction of the cost.' },
    { title: 'Choosing USD at ATMs', detail: 'When a Thai ATM asks "charge in USD or THB?" — always choose THB. Choosing USD triggers a 5–8% dynamic currency conversion fee on top of the ATM withdrawal fee.' },
    { title: 'Booking Domestic Flights Late', detail: 'BKK–KSM flights over NYE sell out and prices triple. Book domestic and international flights at the same time.' },
    { title: 'Grand Palace Redirect Scam', detail: 'Tuk-tuk drivers near the Grand Palace will tell you it is closed and offer to take you to a "better temple" (which leads to a gem shop kickback). The Grand Palace is open. Walk past them.' },
  ],

  ladsTake: 'The entire trip is built around one fixed point: Haad Rin Beach on December 31.',

  specialCallouts: [
    {
      type: 'savings',
      title: 'Ban Tai vs Haad Rin — $240/Person Saved',
      text: 'Ban Tai on the west coast is 20 minutes from Haad Rin by songthaew. Accommodation runs $240/person cheaper over the NYE window. Quieter base, same party access. The savings alone cover two days of food and activities.',
    },
    {
      type: 'warning',
      title: 'NYE Ticket Scam',
      text: 'The Haad Rin Full Moon Party has no entry fee. There is no ticket. Websites and street vendors selling "VIP NYE passes" or "Full Moon Party tickets" are scams. Entry to the beach is free — always has been.',
    },
  ],

  navSections: ['Overview', 'Bangkok', 'Koh Phangan', 'Krabi', 'Costs', 'Safety'],
};
