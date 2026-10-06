/* Every list the intake quiz renders. One source for the UI and validation.
 * Copy is from the prototype Brady approved on Oct 6 2026. */
export const OCCASIONS = [
  'Just because',
  'Graduation trip',
  'Birthday',
  'Honeymoon or anniversary',
  'Bachelor or bachelorette',
  'Study abroad visit',
  'Reunion',
  'A big event or game',
]
export const HEARD = ['TikTok', 'Instagram', 'A friend', 'Google', 'In person', 'Other']
export const FEELS = [
  'Sun and water',
  'Big city energy',
  'Mountains and trails',
  'Old towns and history',
  'Food above all',
  'Somewhere nobody we know has been',
]
export const FLY_FAR = ['Under 5 hours', 'Up to 9 hours', 'Anywhere']
export const BASES = ['One base', 'Two or three stops', 'On the move']
export const LENGTHS = [
  'A long weekend',
  '4 to 6 nights',
  '7 to 9 nights',
  '10 to 14 nights',
  '2 weeks+',
]
export const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]
export const AGES = ['Under 21', '21', '22 to 29', '30s', '40s', '50+']
export const RELATIONS = ['Friends', 'Couple', 'Family', 'Mixed group', 'Solo']
export const EXPERIENCE = ['First big trip', 'A few trips', 'Seasoned travellers']
export const PASSPORTS = [
  'All valid',
  'Someone expires within 6 months',
  "Someone doesn't have one",
  'Not sure',
]
export const SPLITS = [
  'Everyone pays their own',
  'Split evenly',
  'One person is paying',
  'Not sure yet',
]
export const BUDGET_DAY = ['Under $100', '$100 to $175', '$175 to $275', '$275 to $400', '$400+']
export const BUDGET_TRIP = [
  'Under $1,500',
  '$1,500 to $2,500',
  '$2,500 to $4,000',
  '$4,000 to $6,000',
  '$6,000+',
]
export const FIRMNESS = ['A hard limit', 'A rough guide', 'Flexible for the right thing']
export const SPEND_ON = [
  'Food',
  'Nightlife',
  'Where we sleep',
  'Experiences and tours',
  'Getting around easily',
]
export const PAIRS = [
  {
    key: 'pace',
    a: ['⚡', 'Packed days', 'See as much as we can'],
    b: ['🌿', 'Slow days', 'Room to wander and rest'],
  },
  {
    key: 'plan',
    a: ['🗓', 'Planned', 'A plan for every hour'],
    b: ['🎲', 'Spontaneous', 'A few anchors, the rest open'],
  },
  {
    key: 'clock',
    a: ['🌅', 'Early starts', 'Beat the crowds'],
    b: ['🌙', 'Late nights', 'Sleep in, stay out'],
  },
  {
    key: 'fame',
    a: ['🏛', 'The icons', 'The famous sights, done right'],
    b: ['🗝', 'Hidden gems', 'Where the locals go'],
  },
  {
    key: 'guide',
    a: ['🎟', 'Guided', 'Tours and experts'],
    b: ['🧭', 'On our own', 'Just tell us where'],
  },
  {
    key: 'crowd',
    a: ['👥', 'Crowds are fine', 'Worth it for the big sights'],
    b: ['🚪', 'Avoid crowds', 'Go early, go elsewhere'],
  },
]
export const INTERESTS = {
  'Food & drink': [
    'Street food',
    'Markets',
    'Local classics',
    'Fine dining',
    'Cooking class',
    'Food tour',
    'Coffee and bakeries',
  ],
  'Bars & nightlife': [
    'Pubs',
    'Cocktail bars',
    'Breweries',
    'Wine bars',
    'Live music',
    'Clubs',
    'Rooftops',
  ],
  'History & museums': [
    'Big museums',
    'Ruins and sites',
    'Castles and palaces',
    'Guided history tours',
    'Small, odd museums',
  ],
  'Outdoors & hiking': [
    'Day hikes',
    'Multi-day treks',
    'Viewpoints',
    'Wildlife',
    'Water sports',
    'Cycling',
  ],
  Beaches: ['Lively beach', 'Quiet beach', 'Snorkeling', 'Surfing', 'Beach clubs'],
  'Live sport': [
    'Football (soccer)',
    'Rugby',
    'Local league games',
    'Stadium tours',
    'Watching in a pub',
  ],
  'Festivals & events': [
    'Music festivals',
    'Cultural festivals',
    'Holidays and parades',
    'Christmas markets',
  ],
  'Art & architecture': [
    'Galleries',
    'Street art',
    'Churches and cathedrals',
    'Modern architecture',
  ],
  Photography: ['Sunrise spots', 'Sunset spots', 'Cityscapes', 'Landscapes', 'Night shots'],
  'Shopping & markets': ['Flea markets', 'Local makers', 'Fashion', 'Food markets'],
  'Wellness & spas': ['Thermal baths', 'Spa day', 'Sauna', 'Yoga'],
  'Day trips': ['Nearby towns', 'Nature', 'Wine regions', 'Another country'],
}
export const DIETS = [
  'None',
  'Allergy',
  'Vegetarian',
  'Vegan',
  'Gluten-free',
  'Halal',
  'Kosher',
  'Other',
]
export const SEVERITY = ['Mild', 'Moderate', 'Severe (anaphylaxis)']
export const DRINKING = ['Yes, we drink', 'Some of us', "We don't drink"]
export const LODGING = ['Hotel', 'Hostel', 'Apartment', 'Boutique or guesthouse', 'Resort']
export const VIBES = ['Central', 'Quiet', 'Near nightlife', 'Near nature', 'Local, not touristy']
export const SHARING = ['Shared rooms are fine', 'Everyone gets a bed', 'Private rooms']
export const AROUND = [
  'Walking',
  'Public transit',
  'Taxis and rideshare',
  'A rental car',
  'Bikes and scooters',
]
export const WALK = ['Under 5,000 steps', '5,000 to 10,000', '10,000 to 15,000', '15,000+ steps']
export const TRAVEL_DAY = ['Under 2 hours', 'Up to 4 hours', 'A full travel day']
export const ACCESS_NEEDS = [
  'Step-free access',
  'Wheelchair',
  'Limited stairs',
  'Short walks only',
  'Other',
]
export const HIKE_ORDER = [
  'Under 1 hour',
  '1 to 3 hours',
  '3 to 5 hours',
  'A full day',
  'Multi-day',
]
export const ALT_ORDER = ['Never been high', 'Fine up to 2,500 m', 'Fine above 3,000 m']
export const POINTS = [
  'Chase Ultimate Rewards',
  'Amex Membership Rewards',
  'Capital One',
  'Citi ThankYou',
  'Delta SkyMiles',
  'United MileagePlus',
  'American AAdvantage',
  'Marriott Bonvoy',
  'Hilton Honors',
  'None',
]
export const FORMATS = ['Web guide only', 'Web guide plus a PDF']
export const CONTACT = ['Email', 'Text', 'Call']
export const AIRPORTS = [
  ['DTW', 'Detroit Metropolitan'],
  ['GRR', 'Grand Rapids, Gerald R. Ford'],
  ['ORD', "Chicago O'Hare"],
  ['MDW', 'Chicago Midway'],
  ['MKE', 'Milwaukee Mitchell'],
  ['MSP', 'Minneapolis-St Paul'],
  ['CLE', 'Cleveland Hopkins'],
  ['CMH', 'Columbus John Glenn'],
  ['IND', 'Indianapolis'],
  ['TVC', 'Traverse City Cherry Capital'],
  ['LAN', 'Lansing Capital Region'],
  ['AZO', 'Kalamazoo/Battle Creek'],
  ['FNT', 'Flint Bishop'],
  ['CVG', 'Cincinnati/Northern Kentucky'],
]
