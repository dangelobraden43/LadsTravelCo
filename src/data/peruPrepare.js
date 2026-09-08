/* PERU — THE PRACTICAL LAYER: tickets, permits, packing, and ways to save.
 *
 * This is the half of a framework somebody is actually paying for. The route
 * and the photographs sell the trip; this is what stops them losing a morning,
 * a permit or a few hundred dollars.
 *
 * ⛔ EVERY CLAIM HERE CARRIES A SOURCE AND A CHECK DATE. Nothing in this file
 * was remembered. Ticket rules, permit caps and entry windows change, and a
 * stale rule is worse than no rule because a reader acts on it — the same
 * lesson as the Iceland eclipse window, applied to something with money and a
 * booking deadline attached.
 *
 * ⛔ NO PRICES. Not one, anywhere. Fares and ticket costs move, we take no cut,
 * and pricing is a founder decision locked in December. Lead times and rules
 * are stable enough to publish; numbers with currency signs are not.
 *
 * ℹ️ WHAT IS NOT HERE: no operator is named, rated or recommended. We take
 * affiliate revenue in this category and an operator opinion would read as an
 * endorsement we have not earned by walking it.
 */

export const PREPARE_CHECKED_ON = '2026-09-08'

/* ── TICKETS AND PERMITS ─────────────────────────────────────────────────────
 * The single most expensive mistake on this trip is arriving without the right
 * ticket, because there is no fixing it on the day. */
export const PERU_TICKETS = {
  id: 'tickets',
  title: 'Tickets and permits',
  lede: 'The part of this trip you cannot fix on the day. Everything else has a workaround; a sold-out entry slot does not.',

  items: [
    {
      name: 'Machu Picchu entry',
      rule: 'Buy from the government, not from a search result.',
      detail:
        'Entry is sold by Peru’s Ministry of Culture through its own portal, tuboleto.cultura.pe, with the state site machupicchu.gob.pe behind it. In person, the ticket offices are on Calle Garcilaso and at Calle Maruri 340 in Cusco. Resellers exist and charge for the privilege; the state channel is the one that guarantees a valid ticket at the official price.',
      lead: 'Two to three months ahead, and further for June to August.',
      sourceUrl:
        'https://www.machupicchu.org/how-to-buy-tickets-for-machu-picchu-2026-insider-tips.htm',
    },
    {
      name: 'Which circuit',
      rule: 'The circuit you book is the walk you get.',
      detail:
        'Peru moved to a new circuit system on 1 May 2026, and the route is fixed at the point of purchase rather than chosen at the gate. Circuit 2 is the one that includes the classic overlook, the central plaza and the main terraces, and is the one most commonly described as the complete visit. Daily admission is capped, running to 5,600 visitors on peak dates.',
      lead: 'Decided when you buy, not when you arrive.',
      sourceUrl:
        'https://www.machupicchu.org/machu-picchu-tickets-2026-circuits-booking-entry-guide.htm',
    },
    {
      name: 'Huayna Picchu',
      rule: 'A separate permit. A standard ticket does not get you on the mountain.',
      detail:
        'The peak behind the ruins is sold as its own capacity-limited add-on, in two entry windows at roughly 07:00 and 10:00, with sources citing about 200 places per window. It is roughly an hour to an hour and a half up over about 1,200 stone steps and around 45 minutes down. Steel cables run the exposed sections. Reviewers consistently say the difficulty is exposure rather than fitness, and that the “stairs of death” name oversells it.',
      lead: 'Three to six months for June to August; four to eight weeks in shoulder season.',
      sourceUrl:
        'https://www.yapaexplorers.com/travel-guides/when-do-machu-picchu-tickets-sell-out-month-by-month-planning-guide/',
      /* The one place on this page where we tell a reader to do MORE than they
       * planned. It rests on Brady having done it, not on research. */
      ladsPush: true,
    },
    {
      name: 'The Salkantay trail itself',
      rule: 'No permit quota, which is the whole reason people take it.',
      detail:
        'Unlike the Inca Trail and its fixed daily allocation, the Salkantay route needs no advance permit, so it can be arranged on far shorter notice. It is the longer way round, roughly 74 km against 42, and typically a day more. Your Machu Picchu entry at the end of it is still a separate ticket on the rules above.',
      lead: 'Bookable late. The Machu Picchu ticket at the end of it is not.',
      sourceUrl: 'https://www.tierrasvivas.com/en/salkantay-trek-faqs',
    },
  ],
}

/* ── PACKING ─────────────────────────────────────────────────────────────────
 * Written around the two things that actually catch people out on this route:
 * the cold at altitude, and how little there is once you are on the trail. */
export const PERU_PACKING = {
  id: 'packing',
  title: 'Packing the trek',
  lede: 'The Salkantay pass tops out around 4,630 m. What makes it hard is the altitude and the cold, not the technical difficulty, and both are gear problems before they are fitness problems.',

  groups: [
    {
      group: 'For the pass and the cold night',
      note: 'The first high camp is the one people underestimate. Reports of sub-freezing nights are routine, and colder in the winter months.',
      items: [
        'Layers you can add and shed on the move, including a genuine insulating layer for the pass',
        'Rain protection that survives an afternoon storm, not a shower',
        'A headlamp — camps run on early starts and early darkness',
        'Gloves and a warm hat, which people leave behind because the valley is mild',
      ],
      sourceUrl: 'https://www.torntackies.com/salkantay-trek-difficulty/',
    },
    {
      group: 'For the walking',
      note: 'Distance is not the problem. Thin air on a long climb is.',
      items: [
        'Trekking poles, repeatedly recommended for the descents',
        'Boots already broken in — the route is long rather than steep',
        'Sun protection at altitude, where it burns faster than the temperature suggests',
        'Your own water capacity between camps',
      ],
      sourceUrl:
        'https://www.comeseeperutours.com/travel-information/humantay-lake-hike-difficulty',
    },
    {
      group: 'What is not out there',
      note: 'Toilet facilities on most of the route are described as basic to nonexistent outside premium setups. Plan for that rather than discovering it.',
      items: [
        'Toilet paper and a way to pack out what you use',
        'Any medication you would not want to source in a village',
        'Cash — the trail is not a card economy',
      ],
      sourceUrl:
        'https://www.alpacaexpeditions.com/salkantay-trek-accommodations-and-infrastructure-campsites-lodges-and-facilities/',
    },
  ],
}

/* ── WAYS TO SAVE ────────────────────────────────────────────────────────────
 * Each one is a specific, sourced behaviour, not general thrift advice. */
export const PERU_SAVE = {
  id: 'save',
  title: 'Ways to save',
  lede: 'Four of these are about when you book. The rest are about not paying the tourist-strip premium for something available a street away.',

  items: [
    {
      move: 'Go in the shoulder',
      detail:
        'Late April to May, or September to October, is repeatedly named the best balance of weather against crowds. June to August is the driest and the busiest, and prices follow the crowds.',
      sourceUrl:
        'https://bushop.com/peru/guides/best-time-to-visit-machu-picchu-crowds-rain-visibility-train-demand/',
    },
    {
      move: 'Take the afternoon entry slot',
      detail:
        'Afternoon slots between roughly 13:00 and 15:00 are reported as noticeably quieter as the day-trippers leave, with good light. Same site, same ticket class, fewer people in it.',
      sourceUrl:
        'https://bushop.com/peru/guides/best-time-to-visit-machu-picchu-crowds-rain-visibility-train-demand/',
    },
    {
      move: 'Eat off the strip in Aguas Calientes',
      detail:
        'The restaurant strip in the town below Machu Picchu is widely called overpriced tourist food. Sources point to the Mercado de Abastos, the local market, for cheaper and more authentic eating a short walk away.',
      sourceUrl: 'https://en.wikipedia.org/wiki/Aguas_Calientes,_Peru',
    },
    {
      move: 'Book Huacachina direct',
      detail:
        'Travel-tip sources specific to Huacachina document third-party bookings running well over the price of booking direct with a lodge, alongside uninsured buggy operators. Book the dune run at the source and confirm the operator is insured.',
      sourceUrl:
        'https://www.huacachina.com/travel-tips/safety-scams-in-huacachina-what-travelers-should-know/',
    },
    {
      move: 'Add the Red Valley on foot',
      detail:
        'Valle Rojo sits beside Rainbow Mountain and is a 20 to 30 minute walking extension from the main viewpoint, commonly with a small community fee paid on site. Only a fraction of Rainbow Mountain visitors continue to it, which is most of its appeal.',
      sourceUrl:
        'https://www.yapaexplorers.com/travel-guides/rainbow-mountain-vs-red-valley-which-trail-should-you-take/',
    },
    {
      move: 'Acclimatise on the cheap days',
      detail:
        'Two to three days in Cusco before anything at altitude is the most repeated piece of advice across sources, and Cusco is the cheapest place on this route to spend them. Doing it the other way round risks the expensive, non-refundable days.',
      sourceUrl:
        'https://www.comeseeperutours.com/travel-information/altitude-sickness-at-rainbow-mountain-peru',
    },
  ],
}

/* ── LIMA, AND WHY IT IS NOT A LAYOVER ───────────────────────────────────────
 * Brady asked for this to be highlighted. It is worth stating precisely rather
 * than as "voted best food in the world", because the precise version is
 * stronger and the vague version is the kind of claim that ages badly. */
export const LIMA_FOOD = {
  id: 'lima-food',
  title: 'Do not treat Lima as a layover',
  claim:
    'Lima holds the current World’s Best Restaurant. Maido took the number one spot on The World’s 50 Best Restaurants in 2025, and Central held it in 2023, which puts two recent world number ones in one city.',
  more: 'In November 2026 the ranking itself is being staged in Lima for the first time in its history, and the first time anywhere in South America. Kjolle, Mérito and Mayta also placed in the 2025 list.',
  soWhat:
    'Most Peru itineraries treat Lima as the airport you pass through on the way to Cusco. Give it a night on the way in, when you are not yet at altitude and not yet tired.',
  sources: [
    {
      title: 'The World’s 50 Best Restaurants 2026 to take place in Lima',
      url: 'https://www.theworlds50best.com/stories/News/the-worlds-50-best-restaurants-2026-lima.html',
    },
  ],
  checkedOn: PREPARE_CHECKED_ON,
}
