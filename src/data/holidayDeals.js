/* /deals data — Holiday Travel Sales 2026.
 * Only findings the independent fact-checker CONFIRMED or CORRECTED belong here
 * (internal/research/market/2026-10-12-deals-verified.md). Offers are quoted in the
 * brand's own words. No single fare from us, no Lads price, no "free" in our voice.
 * Status, expiry and the hero state are computed in src/utils/deals.js. */

export const CHECKED_ON = '2026-10-12'

export const EDITION = {
  year: 2026,
  name: 'Holiday Travel Sales 2026',
  eyebrow: 'Lads Deals · Black Friday to Travel Tuesday 2026',
  dates: { blackFriday: '2026-11-27', cyberMonday: '2026-11-30', travelTuesday: '2026-12-01' },
  // the week cards must be re-checked inside (saleStatus hides stale ones)
  watchFrom: '2026-11-20',
  watchUntil: '2026-12-05',
  habit: '',
  intro: { world: '', us: '' },
}

export const KINDS = [
  ['airline', 'Airlines'],
  ['hotel', 'Hotels'],
  ['ota', 'Booking sites'],
  ['rail', 'Rail'],
  ['tour', 'Tour operators'],
  ['cruise', 'Cruises'],
  ['gear', 'Luggage and gear'],
]

export const EVIDENCE = []
export const TRAPS = []
export const SALES = []
export const SEASONAL = []
