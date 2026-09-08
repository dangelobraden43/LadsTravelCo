/* HOW YOU ACTUALLY REACH MACHU PICCHU — the four routes, compared.
 *
 * This is the biggest decision on the trip and the one with the widest cost
 * spread. The same mountain can be reached for the price of a bus ticket or
 * for several thousand dollars, and almost nothing else in the itinerary moves
 * the budget as much. A framework that does not break this down is not doing
 * the job.
 *
 * ⛔ RANGES, NEVER POINT PRICES. This is the discipline already written into
 * fareIntelligence.js and it applies with full force here: "$780 is a promise.
 * $650-$900 is a pattern." Trek and train pricing moves with season, operator,
 * booking window and demand. A single number would be wrong for almost every
 * reader on almost every date.
 *
 * ⛔ THESE ARE NOT OUR PRICES. We sell nothing here, take no cut of any trek or
 * train, and the bands below are researched market ranges published by others.
 * Our own pricing is a founder decision locked in December and appears nowhere.
 *
 * ⛔ NO OPERATOR IS NAMED, RANKED OR ENDORSED. The tiers below describe what
 * changes as you pay more, which is a fact about the market. Which company to
 * hand money to is a recommendation we have not earned by walking it, and we
 * take affiliate revenue in this category, so we do not make it.
 *
 * ⚠️ EVERY BAND CARRIES A SOURCE AND A CHECK DATE, and the page prints both.
 * Money numbers go stale faster than anything else on this site.
 */

export const ROUTES_CHECKED_ON = '2026-09-08'

export const ROUTES_NOTE =
  'Researched market ranges in US dollars per person, not prices we set or sell. Trek and train fares move with season, operator and how early you book, so treat these as the shape of the decision and confirm the number at the point of purchase.'

/* `band` drives the comparison bars. `low` and `high` are the honest outer
 * edges of what sources report; `typical` is where they cluster, and is what
 * the bar highlights. */
export const PERU_ROUTES = [
  {
    id: 'salkantay',
    name: 'The Salkantay trek',
    kicker: 'What we did',
    days: '5 days, 4 nights',
    effort: 'Hard. A 4,630 m pass and cold camps.',
    permit: 'None required',
    lead: 'Bookable weeks out. Your Machu Picchu ticket is not.',
    band: { low: 450, typical: [500, 750], high: 3500 },
    summary:
      'The longer way round and the one without a permit quota, which is exactly why it exists as an alternative. Roughly 74 km against the Inca Trail’s 42, usually a day more, and generally rated ahead of it on raw scenery. Standard runs camp at Soraypampa, Chaullay and Lucmabamba, then a hotel night in Aguas Calientes before the site.',
    tiers: [
      { tier: 'Standard group', band: '450–750', what: 'Camping, shared guide, meals, transfers.' },
      { tier: 'Comfort', band: '450–900', what: 'Domes or upgraded camps, smaller groups.' },
      { tier: 'Private or lodge', band: '1,000–3,500', what: 'Lodge-to-lodge, private guiding.' },
    ],
    sources: [
      {
        title: 'Salkantay Trek cost and budget planning',
        url: 'https://www.guidingcusco.com/salkantay-trek-cost/',
      },
      {
        title: 'Salkantay Trek real costs and conditions',
        url: 'https://www.theonlyperuguide.com/research/salkantay-trek-real-costs-conditions-altitude-food-gear-weather/',
      },
    ],
  },

  {
    id: 'inca-trail',
    name: 'The classic Inca Trail',
    kicker: 'The famous one',
    days: '4 days, 3 nights',
    effort: 'Hard. Dead Woman’s Pass at 4,215 m.',
    permit: 'Permit required, strictly capped',
    lead: 'Three to six months minimum. Six to nine for May to September.',
    band: { low: 650, typical: [800, 900], high: 2500 },
    summary:
      'The route with the name, and the one with a hard daily permit cap. That cap is the whole planning problem: permits sell out four to six months ahead in peak season, they are tied to your passport, and there is no late workaround. Packages normally fold in the trail permit, the Machu Picchu entry, transfers, the return train, a bilingual guide, porters, tents and meals.',
    tiers: [
      { tier: 'Budget operator', band: '650–900', what: 'Larger groups, basic camping kit.' },
      { tier: 'Mid-range', band: '900–1,400', what: 'Smaller groups, better gear and food.' },
      { tier: 'Premium', band: '1,500–2,500', what: 'Private or near-private, top-end camps.' },
    ],
    sources: [
      {
        title: 'Inca Trail cost 2026',
        url: 'https://abexpeditions.com/inca-trail-cost/',
      },
      {
        title: 'Inca Trail budget guide 2026',
        url: 'https://www.machupicchu.org/inca-trail-budget-guide-2026-complete-cost-breakdown.htm',
      },
    ],
  },

  {
    id: 'train',
    name: 'The train',
    kicker: 'No trek at all',
    days: 'A day trip, or a night in Aguas Calientes',
    effort: 'None beyond the site itself',
    permit: 'No trek permit. Machu Picchu entry still required.',
    lead: 'Book with your entry ticket. Peak dates sell out.',
    band: { low: 70, typical: [70, 250], high: 1000 },
    summary:
      'Two operators run the line and most departures leave from Ollantaytambo, about an hour and three quarters by road from Cusco and another hour and three quarters by rail. Service class is the entire price story: the basic class is a seat and a window, the panoramic classes add glass roofs, and the top-end service is a restored 1920s train with dining and an observation car.',
    tiers: [
      {
        tier: 'Basic class',
        band: '35–60 each way',
        what: 'A seat and a window from Ollantaytambo.',
      },
      { tier: 'Panoramic', band: 'mid', what: 'Glass roof and side panels for the valley.' },
      {
        tier: 'Luxury service',
        band: '500+ return',
        what: 'Restored 1920s train, dining, observation car.',
      },
    ],
    sources: [
      {
        title: 'Machu Picchu by train 2026: the service classes compared',
        url: 'https://www.yapaexplorers.com/travel-guides/machu-picchu-by-train-expedition-vistadome-observatory-or-hiram-bingham/',
      },
      {
        title: 'PeruRail vs Inca Rail 2026',
        url: 'https://www.yapaexplorers.com/travel-guides/peru-rail-vs-inca-rail-which-train-to-machu-picchu-is-actually-worth-it/',
      },
    ],
  },

  {
    id: 'hidroelectrica',
    name: 'The Hidroeléctrica back door',
    kicker: 'The cheap way in',
    days: 'A long day each way',
    effort: 'Easy walking, brutal bus',
    permit: 'No trek permit. Machu Picchu entry still required.',
    lead: 'Bookable days out',
    band: { low: 15, typical: [15, 40], high: 60 },
    summary:
      'The budget route almost nobody puts in a brochure. A bus from Cusco to the Hidroeléctrica station runs six to seven hours over the Abra Málaga pass at 4,316 m, and from there it is about 11 km on foot along the railway line into Aguas Calientes, roughly two to three hours and close to flat beside the Urubamba. It costs a fraction of the train and buys back none of the day.',
    tiers: [
      { tier: 'Bus, one way', band: 'around 15', what: 'Six to seven hours from Cusco.' },
      { tier: 'The walk', band: 'free', what: '11 km beside the tracks, 2 to 3 hours.' },
    ],
    sources: [
      {
        title: 'Bus from Cusco to Hidroeléctrica',
        url: 'https://sapadventures.org/transport/bus-from-cusco-to-hidroelectrica/',
      },
      {
        title: 'PeruRail on the Hidroeléctrica route',
        url: 'https://www.perurail.com/destinations/hidroelectrica/',
      },
    ],
  },
]

/* The bar scale. Fixed rather than derived from the data so that adding a
 * route later cannot silently rescale every bar and change what the picture
 * says. Logarithmic, because a linear axis across 15 to 3,500 renders the
 * budget routes as invisible slivers and overstates the luxury end. */
export const ROUTE_SCALE = { min: 10, max: 3500 }
