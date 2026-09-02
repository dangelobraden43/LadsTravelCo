/* MICHIGAN LOCAL INTELLIGENCE
 *
 * COORDINATES — 8 of 22 spots carry lat/lng. They were NOT geocoded from
 * names. Each was matched by strict token containment plus a distance sanity
 * check against Brady's own Google Maps saved lists (read by provenance in a
 * signed-in browser, Aug 29 2026), so the coordinate is Google's own stored
 * record for the saved place rather than the result of resolving a string.
 * The Tivoli rule is satisfied by provenance.
 * ⛔ Loose fuzzy matching was tried and REJECTED — it paired Founders→Arvon and
 * Sugar House→O'Toole's off shared words like "brewing" and "house". Do not
 * lower that bar to fill in the remaining 14.
 *
 * `placeId` is Google's feature ID, converted from the captured decimal pair
 * to the hex form used elsewhere in src/data/ — a lossless transform of the
 * captured value, not a re-lookup.
 *
 * THE 14 WITHOUT COORDINATES ARE NOT ERRORS. They render in the unpinnable
 * tier on /local (named in the companion list, absent from the map) until a
 * coordinate arrives by provenance. Four of them are Detroit; Brady is
 * compiling a Detroit list that closes those in one step.
 *
 * SHORT'S IS TWO ENTRIES ON PURPOSE — ruled by Brady, Aug 31 2026: "shorts is
 * the elk rapids pull barn I would like on the list but I have been to both."
 * The Bellaire/TC taproom and the Elk Rapids Pull Barn are venues 17 km apart
 * and both were genuinely visited. Bellaire keeps its entry and stays
 * UNPINNED (no coordinate by provenance yet); Elk Rapids is its own spot with
 * its own coordinate. Do NOT collapse them or move the Elk Rapids coordinate
 * onto the Bellaire entry.
 *
 * COUNT: this file live-walks to 22 spots (was 21 before Elk Rapids), which is
 * why the canonical site total is 220, not 219.
 */

const michiganData = {
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
    quickRead:
      'Home turf. Breweries across 8 regions, 123 concerts April-November 2026, 9 golf destinations, 8 curated bar crawls. No fluff, no ads, just intel.',
    budget: 'See individual runs for cost estimates',
  },

  /* TIMING WINDOWS — written Sept 2 2026. Michigan was the one framework of the
   * ten carrying no windows at all.
   *
   * ⚠️ THE SOURCING LINE HERE IS DOING REAL WORK. Brady's Michigan validation
   * covers the SPOTS — he has walked into them. It does not cover these
   * windows, which are researched seasonal pattern. Those are two different
   * claims and the data must not let them blur into one, because "personally
   * validated" is the most valuable thing this framework says and it has to
   * stay true of exactly what it is attached to.
   *
   * Michigan carries NO fareIntelligence, deliberately. This is a driving
   * framework for the people it is written for; a fare curve from GRR to GRR
   * would be theatre. */
  timingWindows: [
    {
      id: 'fall',
      name: 'Fall (Sep–Oct)',
      recommended: true,
      driver: 'weather',
      months: [9, 10],
      atmosphere: 'Colour, cool air, harvest',
      crowdMix: 'Heavily local',
      pubExperience: 'Patios still open, taprooms full',
      priceTier: 'Moderate',
      primaryDraw: 'Fall colour with the golf and the breweries both still running',
      verdict: 'The window',
      detail:
        'The short overlap where everything is true at once: the colour comes through Northern Michigan, the courses are still open, and the summer crowds have gone home. Colour peaks earlier in the Upper Peninsula than in the Lower, so the same weekend is a different trip depending which side of the Mackinac Bridge you are on.',
      sourcing: {
        basis:
          'Great Lakes seasonal pattern, researched Sept 2 2026. NOT a founder statement — the Lads validation on this framework covers the spots, not these windows.',
        checkedOn: '2026-09-02',
        sources: [],
      },
    },
    {
      id: 'summer',
      name: 'Summer (Jun–Aug)',
      recommended: true,
      driver: 'weather',
      months: [6, 7, 8],
      atmosphere: 'Long days, lake water finally warm',
      crowdMix: '50/50',
      pubExperience: 'Beer gardens, outdoor everything',
      priceTier: 'Highest',
      primaryDraw: 'The lakeshore, and everything seasonal is open',
      verdict: 'Everything is open, and everyone is here',
      detail:
        'Peak Michigan. Every seasonal business up north is running, the water is swimmable, and the days are long enough to drive and still arrive somewhere in daylight. The trade is lodging: Traverse City and Harbor Country price like resort towns in July and August because for two months they are.',
      sourcing: {
        basis:
          'Great Lakes seasonal pattern, researched Sept 2 2026. NOT a founder statement — see the note above this array.',
        checkedOn: '2026-09-02',
        sources: [],
      },
    },
    {
      id: 'spring',
      name: 'Spring (Apr–May)',
      recommended: false,
      driver: 'pricing',
      months: [4, 5],
      atmosphere: 'Thawing, grey, cheap',
      crowdMix: 'Almost entirely local',
      pubExperience: 'Taprooms quiet, tables available',
      priceTier: 'Low',
      primaryDraw: 'The cheapest beds up north, before the season starts',
      verdict: 'Good value, with gaps',
      detail:
        'Lodging in the northern towns is at its cheapest and the cities are entirely themselves. The catch is that "seasonal" up north genuinely means seasonal — a share of restaurants, courses and lakeshore businesses have not reopened yet, and hours in April are not the hours on the website. Call ahead rather than assume.',
      sourcing: {
        basis:
          'Seasonal-opening pattern in Northern Michigan resort towns, researched Sept 2 2026. Not a founder statement.',
        checkedOn: '2026-09-02',
        sources: [],
      },
    },
    {
      id: 'winter',
      name: 'Winter (Nov–Mar)',
      recommended: false,
      driver: 'logistics',
      months: [11, 12, 1, 2, 3],
      atmosphere: 'Snow, dark early, quiet',
      crowdMix: 'Local, plus the ski and sled crowd',
      pubExperience: 'Indoor, fireplaces, no queue',
      priceTier: 'Low',
      primaryDraw: 'Snow country, and an empty Grand Rapids beer scene',
      verdict: 'A different framework entirely',
      detail:
        'This is an access window, not a weather one. Golf is closed, a meaningful share of Northern Michigan and Upper Peninsula businesses shut for the season, and lake-effect snow makes the drive the hardest part of the plan rather than the easy part. What remains is genuinely good — the Grand Rapids taprooms do not close, and the snow belt is the reason people move here — but it is not this framework run in cold weather. It is a different trip.',
      sourcing: {
        basis:
          'Seasonal closures and lake-effect driving conditions, researched Sept 2 2026. Not a founder statement.',
        checkedOn: '2026-09-02',
        sources: [],
      },
    },
  ],

  categories: [
    {
      name: 'Grand Rapids Breweries',
      id: 'grand-rapids-breweries',
      spots: [
        {
          name: 'Founders Brewing',
          area: 'Grand Rapids',
          description: 'Flagship GR brewery. KBS, All Day IPA, and a massive taproom.',
          rating: 9.2,
          validated: true,
          validator: 'Brady',
          tier: 'Must-Hit',
        },
        /* Renamed by the business — Google now lists it as "Vivant Brewery and
           Spirits" at the same address (925 Cherry St SE). Ruled Aug 31 2026:
           follow the official rename, keep the old name searchable. */
        {
          name: 'Vivant Brewery and Spirits',
          formerName: 'Brewery Vivant',
          area: 'Grand Rapids',
          lat: 42.9597977,
          lng: -85.6461401,
          placeId: '0x8819ada11a4ddfb9:0x663cc10526c23d84',
          description:
            'Belgian farmhouse style in a converted chapel. Outstanding atmosphere. Formerly Brewery Vivant, same building and same address under a new name.',
          rating: 9.0,
          validated: true,
          validator: 'Brady',
          tier: 'Must-Hit',
        },
        {
          name: 'Winchester',
          area: 'Grand Rapids',
          type: 'food',
          description: 'Craft cocktails and elevated pub food. One of the best spots in GR.',
          rating: 9.0,
          validated: true,
          validator: 'Brady',
          tier: 'Must-Hit',
        },
        {
          name: "Butcher's Union",
          area: 'Grand Rapids',
          type: 'food',
          description: 'Steakhouse meets craft bar. High-end for GR.',
          rating: 8.9,
          validated: true,
          validator: 'Brady',
          tier: 'Must-Hit',
        },
        {
          name: 'New Holland Brewing',
          area: 'Grand Rapids',
          lat: 42.9707644,
          lng: -85.6798044,
          placeId: '0x8819add6c5c0a30b:0x532ebcc186310f45',
          description: "Dragon's Milk origin. Solid taproom, solid food.",
          rating: 8.8,
          validated: true,
          validator: 'Brady',
          tier: 'Lads Pick',
        },
        {
          name: 'Mitten Brewing',
          area: 'Grand Rapids',
          lat: 42.9851369,
          lng: -85.6810929,
          placeId: '0x8819ac28eed9620f:0x3eec4a2e5df9f1f2',
          description: 'Pizza and baseball memorabilia in a converted firehouse.',
          rating: 8.4,
          validated: true,
          validator: 'Brady',
          tier: 'Lads Pick',
        },
        {
          name: 'HopCat',
          area: 'Grand Rapids',
          description: '100+ taps. Crack Fries are the draw.',
          rating: 8.3,
          validated: true,
          validator: 'Brady',
          tier: 'Also Good',
        },
      ],
    },
    {
      name: 'Detroit',
      id: 'detroit',
      spots: [
        {
          name: 'Sugar House',
          area: 'Corktown',
          type: 'gem',
          description:
            'Best cocktail bar in Michigan. Speakeasy style, no menu — tell them what you like.',
          rating: 9.4,
          validated: true,
          validator: 'Brady',
          tier: 'Must-Hit',
        },
        {
          name: 'Eastern Market Brewing',
          area: 'Eastern Market',
          description:
            'Massive space in the market district. Great beer, great energy on market days.',
          rating: 9.3,
          validated: true,
          validator: 'Brady',
          tier: 'Must-Hit',
        },
        {
          name: 'Batch Brewing',
          area: 'Corktown',
          description: 'Small-batch neighborhood brewery. Rotating taps, always interesting.',
          rating: 8.9,
          validated: true,
          validator: 'Brady',
          tier: 'Lads Pick',
        },
        {
          name: 'Slows Bar BQ',
          area: 'Corktown',
          type: 'food',
          description: 'The BBQ spot that helped revive Corktown. Always a line, always worth it.',
          validated: true,
          validator: 'Brady',
          tier: 'Lads Pick',
        },
      ],
    },
    {
      name: 'Traverse City',
      id: 'traverse-city',
      spots: [
        /* TWO Short's venues, 17 km apart, both visited. See the file header.
           Bellaire has NO coordinate by provenance yet and stays unpinned. */
        {
          name: "Short's Brewing",
          area: 'Bellaire / TC',
          description:
            'Huma Lupa Licious and wildly creative seasonals. Worth the drive to Bellaire.',
          rating: 9.0,
          validated: true,
          validator: 'Brady',
          tier: 'Must-Hit',
        },
        {
          name: "Short's Pull Barn",
          area: 'Elk Rapids',
          lat: 44.9035254,
          lng: -85.4069907,
          placeId: '0x881fd87751849ebf:0xbf2707b1df8c7237',
          description:
            "Short's production brewery and Pull Barn taproom in Elk Rapids — a separate venue from the Bellaire taproom, 17 km up the road. Brady has been to both.",
          validated: true,
          validator: 'Brady',
          tier: 'Lads Pick',
          validationBasis:
            "Brady, Aug 31 2026: 'shorts is the elk rapids pull barn I would like on the list but I have been to both.'",
        },
        {
          name: 'Jolly Pumpkin',
          area: 'Traverse City',
          description: 'Sour-forward, Belgian-inspired. Outdoor seating with bay views.',
          rating: 8.3,
          validated: true,
          validator: 'Brady',
          tier: 'Lads Pick',
        },
        {
          name: "Cooks' House",
          area: 'Traverse City',
          type: 'food',
          description:
            'Farm-to-table fine dining. One of the best restaurants in northern Michigan.',
          validated: true,
          validator: 'Brady',
          tier: 'Lads Pick',
        },
      ],
    },
    {
      name: 'Harbor Country',
      id: 'harbor-country',
      spots: [
        {
          name: 'Journeyman Distillery',
          area: 'Three Oaks',
          lat: 41.8030925,
          lng: -86.6114698,
          placeId: '0x88111f3b24144841:0xc9316d475cdb2afa',
          description:
            'Craft spirits in a historic corset factory. Outstanding cocktails and food.',
          rating: 9.1,
          validated: true,
          validator: 'Brady',
          tier: 'Must-Hit',
        },
        {
          name: 'Beer Church',
          area: 'New Buffalo',
          lat: 41.7933409,
          lng: -86.7434497,
          placeId: '0x881104aa9b3fefdd:0x3172ae47dffd98d3',
          description: 'Brewery in a converted church. The vibe is exactly what it sounds like.',
          validated: true,
          validator: 'Brady',
          tier: 'Lads Pick',
        },
        {
          name: 'Round Barn Winery',
          area: 'Baroda',
          description: 'Wine, beer, spirits all on one property. Good afternoon stop.',
          rating: 8.2,
          validated: true,
          validator: 'Brady',
          tier: 'Also Good',
        },
      ],
    },
    {
      name: 'Golf',
      id: 'golf',
      spots: [
        {
          name: 'Arcadia Bluffs',
          area: 'Arcadia',
          lat: 44.456655,
          lng: -86.24252,
          placeId: '0x881e7823e97a838f:0xee13c4ee680868cc',
          description:
            '#16 Greatest Public Course. Lake Michigan bluffs. $250 peak, $125-195 shoulder season.',
          price: '$125-250',
          validated: true,
          validator: 'Research',
          tier: 'Must-Hit',
          note: '#16 Greatest Public',
        },
        {
          name: 'Forest Dunes',
          area: 'Roscommon',
          lat: 44.5918334,
          lng: -84.5296051,
          placeId: '0x88206a11b536e8bd:0x2244cbe9c357ab0e',
          description:
            '#37 Greatest Public Course. The Loop is a reversible design — plays differently every day.',
          price: '$185-215',
          validated: true,
          validator: 'Research',
          tier: 'Must-Hit',
          note: '#37 Greatest Public',
        },
        {
          name: 'Greywalls',
          area: 'Marquette',
          description: '#55 Greatest Public Course. Upper Peninsula gem.',
          price: '$235',
          validated: true,
          validator: 'Research',
          tier: 'Must-Hit',
          note: '#55 Greatest Public',
        },
        {
          name: 'Hills of Lenawee',
          area: 'Adrian',
          description: '#3 GolfPass Best Value. Incredible for the price.',
          price: '$25-52',
          validated: true,
          validator: 'Research',
          tier: 'Lads Pick',
          note: '#3 GolfPass Value',
        },
      ],
    },
  ],

  dayTrips: [],

  mapsLinks: [],

  logistics: null,

  costModel: null,

  mistakes: [],

  ladsTake:
    'Home turf. We grew up here, went to school here, know every brewery, every trail, and every shortcut.',

  specialCallouts: [],

  navSections: [
    'Overview',
    'When to Go',
    'Grand Rapids',
    'Detroit',
    'Traverse City',
    'Harbor Country',
    'Golf',
  ],
}

export default michiganData

/* ── DERIVED PIN VIEWS ────────────────────────────────────────────────────
 * DERIVED, never hand-maintained — the same discipline as the Globe pin
 * counts. Edit a spot above and both lists below re-derive on next build, so
 * a coordinate can never drift out of agreement with its own framework entry.
 *
 * MICHIGAN_PINNED  → the gold tier: validated spots that CAN be placed.
 * MICHIGAN_UNPINNED → validated spots that CANNOT be placed yet. They are
 *   named in the companion list on /local and are deliberately absent from
 *   the map. Rendering them at a guessed coordinate is the exact failure the
 *   Tivoli rule exists to prevent, and a spot Brady stood in deserves better
 *   than being quietly dropped because Google's record was hard to match. */

const TYPE_BY_CATEGORY = {
  'grand-rapids-breweries': 'brewery',
  detroit: 'brewery',
  'traverse-city': 'brewery',
  'harbor-country': 'brewery',
  golf: 'golf',
}

const allSpots = () =>
  michiganData.categories.flatMap((c) =>
    c.spots.map((s) => ({
      ...s,
      type: s.type || TYPE_BY_CATEGORY[c.id] || 'gem',
      category: c.name,
    }))
  )

export const MICHIGAN_PINNED = allSpots().filter(
  (s) => typeof s.lat === 'number' && typeof s.lng === 'number'
)

export const MICHIGAN_UNPINNED = allSpots().filter(
  (s) => typeof s.lat !== 'number' || typeof s.lng !== 'number'
)
