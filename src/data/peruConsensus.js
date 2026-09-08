/* PERU — THE RESEARCH LAYER. Public consensus, per place.
 *
 * WHAT THIS IS. Stage 1 of the enrichment pipeline, run across all 25 saved
 * places on 2026-09-08. It is what the PUBLIC says about a place, paraphrased
 * from sources that are named on every entry. It renders labelled as such,
 * beside Google's own listing data, in exactly the way GOOGLE_LISTING already
 * does.
 *
 * ⛔ THIS IS NOT THE LADS' VOICE AND MUST NEVER BE STYLED AS IT. The founder
 * layer is `ladsTake` in peru.js and it comes from Brady verbatim or it stays
 * empty. Nothing here was written to fill a silence: a researched sentence
 * dressed as a firsthand one is the single failure this whole site is built to
 * avoid. The two layers render differently on purpose.
 *
 * ⛔ NO CLAIM WITHOUT A SOURCE. Every entry carries `sources` and `checkedOn`.
 *
 * ⛔ THIN SHIPS EMPTY, NEVER PADDED. Several of these are small independent
 * cafés and shops with almost no English-language coverage. An empty
 * `criticized` on those is the correct and expected result.
 *
 * ℹ️ `coverage` distinguishes two very different things that look identical on
 * a page: 'good' means we looked and found substance, 'thin' means we looked
 * and found little, and 'blocked' would mean we could not look. reddit.com is
 * blocked in this environment for every entry here, so its silence is never
 * evidence of anything and is not treated as such.
 *
 * ℹ️ Claims marked (search snippet) came through search result summaries
 * because Tripadvisor returns 403 on direct fetch. They were never read in
 * full, and the phrase is kept so a reviewer knows.
 */

export const CONSENSUS_CHECKED_ON = '2026-09-08'

export const CONSENSUS_LABEL = 'What travellers report'
export const CONSENSUS_DISCLAIMER =
  'Public consensus, paraphrased from the sources named on each entry. This is what other people say, not a Lads verdict.'

/* Keyed by the exact `name` in PERU_SAVED_PLACES. */
export const PERU_CONSENSUS = {
  'Huacachina Oasis': {
    coverage: 'good',
    summary:
      'The oasis works because of the dune buggy and sandboarding run, not the town. Reviewers repeatedly rate the ride among the best things they did in Peru, while several found the lagoon itself littered and underwhelming in daylight.',
    praised: ['The buggy and sandboarding run', 'Dunes far bigger in person than in photographs'],
    criticized: [
      'Trash on the dunes around the lagoon (search snippet)',
      'Little to do in the heat of the day',
    ],
    trap: 'Third-party bookings run well over the price of booking direct, and operators are not all insured. There are also reports of bags being gone through while groups are out on the dunes.',
    bestTime:
      'Late afternoon for the run and the sunset. Staying the night buys the quiet lagoon that day-trippers never see.',
    sources: [
      {
        t: 'Huacachina safety and scams',
        u: 'https://www.huacachina.com/travel-tips/safety-scams-in-huacachina-what-travelers-should-know/',
      },
    ],
  },

  Paracas: {
    coverage: 'good',
    summary:
      'The Ballestas Islands boat tour is the reason to come, and it is consistently called one of the best-value wildlife trips in the country: sea lion colonies, seabirds and the Candelabra geoglyph in about two hours.',
    praised: ['Close-up wildlife on a well-run boat', 'Affordable for what it is'],
    criticized: [
      'A same-day round trip from Lima runs 14 to 18 hours',
      'Seasickness in the slower cruising',
    ],
    trap: 'Boats run mornings only because the wind gets up later. A day trip that leaves Lima late misses the boat entirely, which is the whole reason to go.',
    bestTime: 'Morning departures, commonly 07:30 and 10:00. Book ahead on weekends.',
    sources: [
      {
        t: 'Paracas in one day vs overnight',
        u: 'https://bushop.com/peru/guides/paracas-in-one-day-vs-overnight-what-you-miss-if-you-rush-it/',
      },
    ],
  },

  'Ambra Rooftop Bar': {
    coverage: 'good',
    summary:
      'A sixteenth-floor rooftop in Miraflores with consistent praise for the ocean views, the cocktails and the service. The food splits opinion, and it is priced as an occasion rather than an everyday bar.',
    praised: [
      'Panoramic Pacific and coastline views',
      'Cocktails and pisco, with staff named in reviews',
    ],
    criticized: [
      'Food called closer to bar fare than to the setting (search snippet)',
      'Limited menu during the day',
    ],
    trap: 'Not a budget stop. Spend is cited around PEN 200 and up, with one report of a prepayment required without a reservation.',
    bestTime: 'Weekend evenings, with a reservation. Closed Sundays per hotel listings.',
    sources: [
      {
        t: 'Ambra Rooftop Bar',
        u: 'https://www.therooftopguide.com/rooftop-bars-in-lima/ambra-rooftop-bar.html',
      },
    ],
  },

  'Caños del Santero Miraflores': {
    coverage: 'thin',
    summary:
      'A craft beer and burger bar in the middle of Miraflores, praised for its IPA list and its burgers, with more than one reviewer calling it the most genuine craft beer in the city.',
    praised: ['The IPA selection (search snippet)', 'Burgers alongside the beer'],
    criticized: [],
    trap: '',
    bestTime:
      'Open daily, roughly noon to 20:30 per listings. Screens for sport, occasional weekend live music.',
    sources: [
      {
        t: 'Restaurant Guru listing',
        u: 'https://restaurantguru.com/Canos-Del-Santero-Miraflores',
      },
    ],
  },

  'Sol Coffee — Cafecito Here': {
    coverage: 'thin',
    summary:
      'A newer speciality coffee shop in Miraflores roasting Peru-sourced beans, with a quiet patio a block off the main strip. Opinion on the coffee itself is split.',
    praised: ['Peru-sourced beans roasted in house', 'A calm patio away from the busier streets'],
    criticized: [
      'One detailed account found the espresso watery, though it notes most people order lattes (search snippet)',
    ],
    trap: '',
    bestTime: 'Mon to Fri 07:00 to 19:00, weekends 07:30 to 14:30 per listings.',
    sources: [{ t: 'Cafecito Here', u: 'https://cafecitohere.com/' }],
  },

  'Plaza de Armas': {
    coverage: 'good',
    summary:
      'Cusco’s main square and the natural orientation point for the whole city, Inca Huacaypata beneath Spanish arcades, with almost everything else radiating out from it.',
    praised: ['The easiest landmark to navigate from', 'Colonial architecture on Inca foundations'],
    criticized: [
      'Named repeatedly as the city’s worst pickpocketing spot',
      'Persistent vendors and tour touts',
    ],
    trap: 'Children in traditional dress approach for paid photographs, and reports say the price can escalate past what was agreed.',
    bestTime:
      'Early morning is quiet. Midday is the busiest. It sits at about 3,400 m, so take it gently before you are acclimatised.',
    sources: [
      {
        t: 'Cusco safety guide',
        u: 'https://illakunturtravel.com/travel-guide/cusco-safety-guide-2/',
      },
    ],
  },

  '7 Vidas Taproom Cusco': {
    coverage: 'good',
    summary:
      'A second-floor craft beer taproom on Calle Ruinas with a large rotating list, solid pub food and weekend live music. Reviews skew strongly positive with no recurring complaint.',
    praised: [
      'Two dozen-plus taps, bottles to take away',
      'Burgers, the alpaca one called out by name',
    ],
    criticized: [],
    trap: '',
    bestTime: 'Weekends for the live music.',
    sources: [
      {
        t: 'Tripadvisor listing (search snippet)',
        u: 'https://www.tripadvisor.com/Restaurant_Review-g294314-d27974599-Reviews-7_Vidas_Tap_Room_Cusco-Cusco_Cusco_Region.html',
      },
    ],
  },

  'LLAMA CAFÉ I': {
    coverage: 'good',
    summary:
      'A San Blas breakfast and brunch café known for its llama-themed room and well-presented plates at fair prices, a short uphill walk from the main square.',
    praised: ['Pancakes and empanadas', 'Generous portions, gluten-free and vegan options'],
    criticized: ['Long waits reported even on simple orders', 'Service slows at peak'],
    trap: 'Opening hours differ between listings, and one shows Monday closed. Confirm locally rather than trusting a listing.',
    bestTime: 'Breakfast, outside the peak hours where the waits are reported.',
    sources: [
      { t: 'HappyCow listing', u: 'https://www.happycow.net/reviews/llama-cafe-cusco-288485' },
    ],
  },

  'ARTESANÍAS ASUNTA': {
    coverage: 'good',
    summary:
      'A large family-run handicraft shop a few minutes uphill from the square, widely praised for low prices and range on alpaca goods. Coverage is genuinely mixed rather than thin.',
    praised: ['Prices well under nearby shops', 'Wide range, helpful sizing advice'],
    criticized: [
      'Reports of inconsistent pricing between visits',
      'Reports that items sold as alpaca are synthetic blends',
    ],
    trap: 'Check the fabric before you buy if alpaca purity matters to you. Bargaining is expected, especially on more than one item.',
    bestTime: '',
    sources: [
      {
        t: 'Tripadvisor reviews (search snippet)',
        u: 'https://www.tripadvisor.com/ShowUserReviews-g294314-d9838893-r616551859-Artesanias_Asunta-Cusco_Cusco_Region.html',
      },
    ],
  },

  'KUSYKAY Peruvian Craft Food': {
    coverage: 'good',
    summary:
      'A very highly rated Peruvian kitchen a block from the square, praised for authentic, carefully plated dishes and attentive service at strong value.',
    praised: [
      'Lomo Rossini and Trucha Andina named repeatedly',
      'Knowledgeable service, strong value',
    ],
    criticized: ['Long waits without a booking'],
    trap: 'A reservation is reported to secure a place in the queue rather than a table. Turning up expecting to be seated straight away is the mistake.',
    bestTime: 'Book through the restaurant’s own site or WhatsApp in advance.',
    sources: [{ t: 'Kusykay reservations', u: 'https://kusykay.com/reservation/' }],
  },

  'Wild Rover Cusco': {
    coverage: 'good',
    summary:
      'A well-known international party hostel in the centre with an on-site bar that serves non-guests. Consensus splits hard on one line: people who came for the party rate it highly, people hoping to sleep do not.',
    praised: ['Central and walkable', 'Lively bar with sport and live events'],
    criticized: ['Noise routinely past 02:00', 'Reports of theft risk and cleanliness issues'],
    trap: 'Almost all of this consensus is about staying the night. We list it as somewhere to go out, not somewhere to sleep.',
    bestTime: '',
    sources: [
      {
        t: 'Hostelworld listing',
        u: 'https://www.hostelworld.com/hostels/p/47380/wild-rover-cusco/',
      },
    ],
  },

  'Magicpacker hostel': {
    coverage: 'good',
    summary:
      'A small hostel about five minutes from the main square in a colonial building, quieter than the party hostels, with breakfast included and staff named repeatedly in reviews.',
    praised: ['Friendly staff', 'Included breakfast', 'Quiet enough to actually sleep'],
    criticized: ['Cold showers reported off-season'],
    trap: '',
    bestTime: '',
    sources: [
      {
        t: 'Kayak listing',
        u: 'https://www.kayak.com/Cusco-Hotels-Magicpacker-hostel.2940486.ksp',
      },
    ],
  },

  'Cervecería Del Valle Sagrado Cusco Centro': {
    coverage: 'good',
    summary:
      'A craft brewpub above the Choco Museo with balcony seating over the square, a wide range of styles and live music on some nights.',
    praised: ['IPA, red ale, coffee stout and Belgian wit', 'Balcony seating and live music'],
    criticized: [],
    trap: 'This brand runs at least three rooms — the Urubamba original, Pisac and this one — and online reviews do not reliably separate them. Some praise may belong to a different location.',
    bestTime: 'Evenings, for the music and the balcony.',
    sources: [{ t: 'Wanderlog entry', u: 'https://wanderlog.com/place/details/2518705/' }],
  },

  'Yaku Restaurant': {
    coverage: 'good',
    summary:
      'One of the highest-rated restaurants in Cusco across thousands of reviews, serving modern Peruvian in a heated outdoor room with live folk music.',
    praised: [
      'Alpaca skewer, lomo saltado, ceviche',
      'Presentation, and wood stoves with blankets outside',
    ],
    criticized: [
      'Priced above much of Cusco, though most say it earns it',
      'Noise from the live music',
    ],
    trap: '',
    bestTime: 'Book ahead. Near Plaza Regocijo, steps from the centre.',
    sources: [
      {
        t: 'Tripadvisor listing (search snippet)',
        u: 'https://www.tripadvisor.com/Restaurant_Review-g294314-d16955071-Reviews-Yaku-Cusco_Cusco_Region.html',
      },
    ],
  },

  'Moray Peruvian Cuisine': {
    coverage: 'good',
    summary:
      'An Andean-fusion kitchen near the historic centre holding a very high rating across independent platforms, with the desserts called out as much as the mains.',
    praised: ['Alpaca, Andean trout ceviche, lomo saltado', 'Desserts named specifically'],
    criticized: [],
    trap: 'Not the restaurants of the same name out near the Moray ruins at Maras. This is the Cusco city room, confirmed against our own coordinate.',
    bestTime: '',
    sources: [{ t: 'Moray Restaurant', u: 'https://morayrestaurant.com' }],
  },

  'Restobar by Viajero Cusco': {
    coverage: 'thin',
    summary:
      'A restaurant and bar inside a hostel in the historic centre, social and backpacker-facing, with Peruvian plates, cocktails and live music some nights.',
    praised: ['Alpaca steak and tequeños, vegetarian options', 'Pisco sours and a social room'],
    criticized: [],
    trap: 'A similarly named café in Cusco carries a slow-service complaint. It is a different venue and that criticism is not this one.',
    bestTime: 'Evenings for the live music.',
    sources: [
      {
        t: 'Viajero Hostels',
        u: 'https://www.viajerohostels.com/en/food-and-drinks/restobar-by-viajero-cusco',
      },
    ],
  },

  'Black Llama Coffee': {
    coverage: 'good',
    summary:
      'A speciality coffee shop attached to a hostel near the square, pouring single-origin Peruvian beans roasted in Cusco, with courtyard seating.',
    praised: [
      'Beans from Quillabamba and Chanchamayo, roasted in house',
      'Garden seating, skilled baristas',
    ],
    criticized: ['Service slows when busy'],
    trap: 'The wifi is only reliable near reception, which matters if you were planning to work from here.',
    bestTime: '',
    sources: [
      { t: 'Black Llama', u: 'https://www.blackllamahostels.com/en/blog/best-coffee-shop-cusco' },
    ],
  },

  'Historic Sanctuary of Machu Picchu': {
    coverage: 'good',
    summary:
      'Near-universally rated worth the cost and the planning. The consensus is that crowds and logistics are a real tax on the day but not a reason to skip it, and most complaints are about the system around the site rather than the site.',
    praised: [
      'The setting, called once-in-a-lifetime almost everywhere',
      'Early entry, before the buses build',
    ],
    criticized: [
      'Overcrowding, with one source alleging routes carry more than the stated caps',
      'Fog that can close the view with no warning',
    ],
    trap: 'The town below, Aguas Calientes, is repeatedly called a tourist trap, and train services have been disrupted by protest action in recent years. Check conditions rather than assuming.',
    bestTime:
      'Late April to May or September to October for the balance of weather and crowds. Afternoon slots, 13:00 to 15:00, are reported quieter as the day trips leave.',
    sources: [
      {
        t: 'Best time to visit Machu Picchu',
        u: 'https://bushop.com/peru/guides/best-time-to-visit-machu-picchu-crowds-rain-visibility-train-demand/',
      },
    ],
  },

  'Huayna Picchu': {
    coverage: 'good',
    summary:
      'The peak behind the ruins, climbed on its own timed permit. Consensus is that it is dramatic but manageable for anyone reasonably fit, and that the real barrier is exposure rather than fitness.',
    praised: ['The view down over the whole site', 'Steel cables on the exposed sections'],
    criticized: [
      'Steep, narrow ancient stairs with real drop-offs',
      'Not for anyone with a genuine fear of heights',
    ],
    trap: 'It is a separate permit, capped and sold apart from your entry ticket. Sources conflict sharply on how dangerous it is, one claiming twenty-plus deaths and another none recorded, so treat that as contested rather than settled.',
    bestTime:
      'Two windows, roughly 07:00 and 10:00. About an hour to an hour and a half up over some 1,200 steps.',
    sources: [
      {
        t: 'Is the Huayna Picchu hike worth it',
        u: 'https://goingawesomeplaces.com/is-the-huayna-picchu-hike-worth-it/',
      },
    ],
  },

  'Avenida Hermanos Ayar': {
    coverage: 'thin',
    summary:
      'A central street in Aguas Calientes, the train-or-hike-only town below Machu Picchu. Street-level coverage barely exists, so this is what people say about the town the avenue runs through.',
    praised: [
      'A convenient base for an early entry the next morning',
      'The hot springs the town is named for',
    ],
    criticized: [
      'The restaurant strip is widely called overpriced',
      'A hard-sell atmosphere near the market',
    ],
    trap: 'Eat at the Mercado de Abastos rather than on the strip. Same town, a fraction of the price.',
    bestTime: 'There is no road in. Train, or the walk from the hydroelectric station.',
    sources: [{ t: 'Aguas Calientes', u: 'https://en.wikipedia.org/wiki/Aguas_Calientes,_Peru' }],
  },

  'Humantay Lake': {
    coverage: 'good',
    summary:
      'A turquoise glacial lake under snow peaks, reached by a short but genuinely demanding climb. Rated one of the most rewarding half-days out of Cusco.',
    praised: [
      'The colour of the water against the peaks',
      'Short round trip next to other Cusco-area treks',
    ],
    criticized: [
      'The altitude catches people who read "short" as "easy"',
      'Cloud rolls in by early afternoon',
    ],
    trap: 'It reads as a short hike and is not. The endpoint sits near 4,200 m, and the cloud can erase the view you came for.',
    bestTime: 'Mornings, May to September. Acclimatise in Cusco for a day or two first.',
    sources: [
      {
        t: 'Humantay Lake hike difficulty',
        u: 'https://www.comeseeperutours.com/travel-information/humantay-lake-hike-difficulty',
      },
    ],
  },

  Vinicunca: {
    coverage: 'good',
    summary:
      'Rainbow Mountain, and the consensus is that it genuinely delivers with two caveats attached to almost every account: it is now extremely crowded, and the altitude at the viewpoint is a serious physical ask.',
    praised: [
      'The striped ridges match the photographs',
      'Early arrivals get a markedly better morning',
    ],
    criticized: ['Queues and a heavy day-tour feel (search snippet)', 'A brutal early start'],
    trap: 'The viewpoint is commonly cited between 5,000 and 5,200 m. Sources say symptoms are common even in fit people and that the standard advice is to descend if they start. Some travellers say they would pick the quieter Palcoyo instead.',
    bestTime:
      'Leaving Cusco around 03:00 to 03:30 is the most repeated tip for beating both the crowds and the cloud. Two to three days acclimatising first.',
    sources: [
      {
        t: 'Rainbow Mountain altitude',
        u: 'https://www.comeseeperutours.com/travel-information/altitude-sickness-at-rainbow-mountain-peru',
      },
    ],
  },

  'Salkantay zipline': {
    coverage: 'good',
    summary:
      'A zipline course above the Salkantay river in the Santa Teresa coffee country, several long cable runs plus a suspension bridge, commonly done as a stop on the way through.',
    praised: ['Runs of roughly 500 to 900 m', 'Guides described as safety-focused'],
    criticized: ['Intense if you are uneasy with heights'],
    trap: 'Coverage of the wider Cusco zipline scene warns that safety standards vary a lot by operator, including a historical fatality tied to a poorly installed line. That is a reason sources give for sticking to established setups.',
    bestTime: 'About an hour for the full course.',
    sources: [
      {
        t: 'Tripadvisor listing (search snippet)',
        u: 'https://www.tripadvisor.com/Attraction_Review-g3463634-d24137158-Reviews-Salkantay_Zipline-Santa_Teresa_Sacred_Valley_Cusco_Region.html',
      },
    ],
  },

  'Salkantay Trek (Cusco operator record)': {
    coverage: 'good',
    summary:
      'The trail itself: a scenic, physically demanding alternative to the Inca Trail. Longer, higher at its pass, no advance permit, and colder and less serviced along the way.',
    praised: [
      'Rated ahead of the Inca Trail on scenery by most comparisons',
      'No permit quota, so bookable late',
    ],
    criticized: [
      'The pass at roughly 4,630 m is the hardest stretch',
      'Sub-freezing nights at the first high camp',
    ],
    trap: 'Toilet facilities are described as basic to nonexistent for most of the route outside premium setups.',
    bestTime: 'May to September. December to March is the rainy season and the trail is muddier.',
    sources: [
      {
        t: 'Salkantay trek difficulty',
        u: 'https://www.torntackies.com/salkantay-trek-difficulty/',
      },
    ],
  },

  'Red Valley Cusco (Cusco operator record)': {
    coverage: 'good',
    summary:
      'Valle Rojo, the red iron-rich valley beside Rainbow Mountain. Reviewers frequently rate its ridgelines as good as or better than Vinicunca itself, largely because so few people carry on to it.',
    praised: [
      'Red ridgeline scenery rated with or above Rainbow Mountain',
      'A fraction of the crowd',
    ],
    criticized: [
      'Not automatically included on every Rainbow Mountain tour',
      'Colder on site than guides describe',
    ],
    trap: 'Ask before you book whether it is included. A small community fee is commonly reported, paid in cash on site.',
    bestTime:
      'A 20 to 30 minute walk on from the Rainbow Mountain viewpoint. April and October for weather against crowds.',
    sources: [
      {
        t: 'Rainbow Mountain vs Red Valley',
        u: 'https://www.yapaexplorers.com/travel-guides/rainbow-mountain-vs-red-valley-which-trail-should-you-take/',
      },
    ],
  },
}
