/* GOOD VIEWS + THE GOLF SLATE — the research tier behind Lads Local.
 *
 * WHY THIS FILE EXISTS: the banner promised "Good Brews · Good Views · Good
 * News" and only Brews had ever been built. The map was 97 places, nearly all
 * of them in one corner of one state, and Minnesota, Wisconsin, Illinois,
 * Indiana and Ohio were empty ground. Views is what actually fills them,
 * because the reason anyone drives into those states is the water and the
 * trails, not another taproom.
 *
 * ⛔ EVERYTHING HERE IS RESEARCH TIER. Copper, every one. Not a single entry
 * carries a Lads rating, a Lads take, or a claim that one of us has been. Where
 * we HAVE been, the place already lives in michigan.js as gold and is not
 * duplicated here.
 *
 * ⛔ THE DESCRIPTORS ARE GEOGRAPHY, NOT OPINION. Each `what` line says what a
 * place physically is. There is no "stunning", no "must-see", no verdict. A
 * verdict is a founder's to give and none has been given on these.
 *
 * COORDINATES BY PROVENANCE. Read Sept 2 2026 from Wikipedia's coordinates API
 * in two batched calls — a published record with a URL, stored per entry as
 * `coordSource`. Not one was resolved from a name typed into a search box. The
 * Tivoli rule is satisfied the same way it is for the 97.
 */

export const BEST_OF_CHECKED_ON = '2026-09-02'

/* ===== GOOD VIEWS =====
 * 16 places across all six states plus the Ontario shore's neighbours. These
 * are the landmarks the region is actually known for, and every one of them
 * resolved to a real published coordinate. */
export const GOOD_VIEWS = [
  // ── MICHIGAN ──
  {
    name: 'Sleeping Bear Dunes National Lakeshore',
    state: 'MI',
    region: 'Northern Michigan',
    lat: 44.85,
    lng: -86.05,
    type: 'view',
    what: 'Freshwater dunes rising straight off the Lake Michigan shore.',
    wiki: 'Sleeping_Bear_Dunes_National_Lakeshore',
  },
  {
    name: 'Pictured Rocks National Lakeshore',
    state: 'MI',
    region: 'The UP',
    lat: 46.56222222,
    lng: -86.3125,
    type: 'view',
    what: 'Banded sandstone cliffs along forty miles of Lake Superior.',
    wiki: 'Pictured_Rocks_National_Lakeshore',
  },
  {
    name: 'Porcupine Mountains',
    state: 'MI',
    region: 'The UP',
    lat: 46.75416667,
    lng: -89.79,
    type: 'view',
    what: 'Old-growth forest and the Lake of the Clouds escarpment.',
    wiki: 'Porcupine_Mountains',
  },
  {
    name: 'Tahquamenon Falls',
    state: 'MI',
    region: 'The UP',
    lat: 46.574,
    lng: -85.256,
    type: 'view',
    what: 'One of the largest waterfalls east of the Mississippi.',
    wiki: 'Tahquamenon_Falls',
  },
  {
    name: 'Isle Royale National Park',
    state: 'MI',
    region: 'The UP',
    lat: 48.01,
    lng: -88.85,
    type: 'view',
    what: 'An island wilderness in Lake Superior, reachable only by boat or seaplane.',
    wiki: 'Isle_Royale_National_Park',
  },
  {
    name: 'Mackinac Island',
    state: 'MI',
    region: 'Northern Michigan',
    lat: 45.86111111,
    lng: -84.63055556,
    type: 'view',
    what: 'Car-free island in the Straits, between the two peninsulas.',
    wiki: 'Mackinac_Island',
  },
  {
    name: 'Warren Dunes State Park',
    state: 'MI',
    region: 'Harbor Country',
    lat: 41.90527778,
    lng: -86.59944444,
    type: 'view',
    what: 'Dune ridge and beach at the southern end of the Michigan shore.',
    wiki: 'Warren_Dunes_State_Park',
  },

  // ── INDIANA ──
  {
    name: 'Indiana Dunes National Park',
    state: 'IN',
    region: 'Indiana',
    lat: 41.64805556,
    lng: -87.10805556,
    type: 'view',
    what: 'Dunes, marsh and beach on the south shore of Lake Michigan.',
    wiki: 'Indiana_Dunes_National_Park',
  },

  // ── WISCONSIN ──
  {
    name: 'Apostle Islands National Lakeshore',
    state: 'WI',
    region: 'Wisconsin',
    lat: 46.96527778,
    lng: -90.66416667,
    type: 'view',
    what: 'Twenty-one islands and the mainland sea caves on Lake Superior.',
    wiki: 'Apostle_Islands_National_Lakeshore',
  },
  {
    name: "Devil's Lake State Park",
    state: 'WI',
    region: 'Wisconsin',
    lat: 43.41472222,
    lng: -89.71305556,
    type: 'view',
    what: 'Quartzite bluffs standing five hundred feet over a spring-fed lake.',
    wiki: "Devil's_Lake_State_Park_(Wisconsin)",
  },
  {
    name: 'Kettle Moraine State Forest',
    state: 'WI',
    region: 'Wisconsin',
    lat: 43.5833,
    lng: -88.1833,
    type: 'view',
    what: 'Glacial ridges and kettles running through south-east Wisconsin.',
    wiki: 'Kettle_Moraine_State_Forest',
  },

  // ── ILLINOIS ──
  {
    name: 'Starved Rock State Park',
    state: 'IL',
    region: 'Illinois',
    lat: 41.32138889,
    lng: -88.99027778,
    type: 'view',
    what: 'Sandstone canyons and seasonal waterfalls above the Illinois River.',
    wiki: 'Starved_Rock_State_Park',
  },

  // ── OHIO ──
  {
    name: 'Cuyahoga Valley National Park',
    state: 'OH',
    region: 'Ohio',
    lat: 41.24166667,
    lng: -81.54972222,
    type: 'view',
    what: 'River valley, falls and towpath trail between Cleveland and Akron.',
    wiki: 'Cuyahoga_Valley_National_Park',
  },
  {
    name: 'Hocking Hills State Park',
    state: 'OH',
    region: 'Ohio',
    lat: 39.43055556,
    lng: -82.53888889,
    type: 'view',
    what: 'Gorges, recess caves and waterfalls in the Ohio hill country.',
    wiki: 'Hocking_Hills_State_Park',
  },

  // ── MINNESOTA ──
  {
    name: 'Split Rock Lighthouse State Park',
    state: 'MN',
    region: 'Minnesota',
    lat: 47.19194444,
    lng: -91.39277778,
    type: 'view',
    what: 'Cliff-top lighthouse on the Lake Superior north shore.',
    wiki: 'Split_Rock_Lighthouse_State_Park',
  },
  {
    name: 'Gooseberry Falls State Park',
    state: 'MN',
    region: 'Minnesota',
    lat: 47.14694444,
    lng: -91.46333333,
    type: 'view',
    what: 'Stepped falls where the Gooseberry River meets Lake Superior.',
    wiki: 'Gooseberry_Falls_State_Park',
  },
].map((v) => ({
  ...v,
  validated: false,
  validatedBy: null,
  visitedDate: null,
  coordSource: `https://en.wikipedia.org/wiki/${v.wiki}`,
  checkedOn: BEST_OF_CHECKED_ON,
}))

/* ===== THE GOLF SLATE =====
 *
 * 🚩 THESE ARE A LIST, NOT PINS, AND THAT IS DELIBERATE. Golf courses do not
 * have Wikipedia coordinate records — all eleven candidates checked on Sept 2
 * came back "no page" or "no coordinates". Rather than geocode twenty course
 * names in a search box, which is precisely the Tivoli failure, they ship
 * unplaced and honestly labelled. Getting them by provenance is a job for the
 * signed-in browser and it is on tomorrow's queue.
 *
 * EVERY "BEST" CLAIM CARRIES ITS RANK AND ITS SOURCE. This is Golfweek's 2026
 * ranking of Michigan public courses, not ours. We have played two of the
 * twenty; those two are marked and they are gold in michigan.js. The other
 * eighteen are a ranked list we are passing on with attribution, which is a
 * different and smaller claim than a recommendation.
 */
export const GOLF_SOURCE = {
  label: "Golfweek's 2026 ranking of Michigan's top 20 public golf courses",
  url: 'https://sports.yahoo.com/articles/michigans-best-20-public-golf-091126193.html',
  publisher: 'Golfweek, via syndication',
  checkedOn: BEST_OF_CHECKED_ON,
  note: "The ranking is Golfweek's. It is reported here, never restated as a Lads verdict.",
}

export const GOLF_SLATE = [
  { rank: 1, name: 'Arcadia Bluffs (Bluffs Course)', town: 'Arcadia', ladsPlayed: true },
  { rank: 2, name: 'Marquette Golf Club (Greywalls)', town: 'Marquette' },
  { rank: 3, name: 'Forest Dunes (The Loop, Red & Black)', town: 'Roscommon' },
  { rank: 4, name: 'Arcadia Bluffs (South Course)', town: 'Arcadia' },
  { rank: 5, name: 'Forest Dunes', town: 'Roscommon', ladsPlayed: true },
  { rank: 6, name: "Boyne's Bay Harbor (Links/Quarry)", town: 'Bay Harbor' },
  { rank: 7, name: 'Belvedere', town: 'Charlevoix' },
  { rank: 8, name: 'Eagle Eye', town: 'Bath' },
  { rank: 9, name: 'Island Resort and Casino (Sweetgrass)', town: 'Harris' },
  { rank: 10, name: 'Gull Lake View Resort (Stoatin Brae)', town: 'Augusta' },
  { rank: 11, name: 'American Dunes', town: 'Grand Haven' },
  { rank: 12, name: "Pilgrim's Run", town: 'Pierson' },
  { rank: 13, name: 'University of Michigan', town: 'Ann Arbor' },
  { rank: 14, name: 'Tullymore Golf Resort (Tullymore)', town: 'Stanwood' },
  { rank: 15, name: 'Sage Run', town: 'Bark River' },
  { rank: 16, name: 'Harbor Shores', town: 'Benton Harbor' },
  { rank: 17, name: 'Boyne Highlands (Arthur Hills)', town: 'Harbor Springs' },
  { rank: 18, name: 'Hidden River Golf & Casting Club', town: 'Brutus' },
  { rank: 19, name: 'Pine Mountain Resort (Timber Stone)', town: 'Iron Mountain' },
  { rank: 20, name: 'Treetops (Smith Signature)', town: 'Gaylord' },
]
