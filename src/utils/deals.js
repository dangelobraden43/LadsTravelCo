/* HOLIDAY SALES MUST NOT GO STALE.
 *
 * Same lesson as src/utils/events.js: a status typed by hand is true the day it
 * is written and false a week later. Every state on /deals comes from the dates
 * in src/data/holidayDeals.js. A sale whose book-by date has passed stops
 * rendering; a current-year sale nobody has re-checked within a week of sale
 * week hides itself rather than vouch for terms that may have changed.
 * Tested in tools/tests/deals.test.mjs. Dates are ISO strings (YYYY-MM-DD);
 * string comparison is date comparison. */

export const todayISO = () => new Date().toLocaleDateString('en-CA')

const daysBetween = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 86400000)

export const STALE_AFTER_DAYS = 7

/* last-year  — a previous edition's sale, shown only as the pattern to expect
 * expired    — book-by date has passed
 * stale      — inside sale week and not re-checked within STALE_AFTER_DAYS
 * live       — bookable now
 * announced  — published, booking not yet open */
export function saleStatus(sale, edition, today = todayISO()) {
  if (sale.year < edition.year) return 'last-year'
  if (sale.bookBy && today > sale.bookBy) return 'expired'
  const inSaleWeek = today >= edition.watchFrom && today <= edition.watchUntil
  if (inSaleWeek && sale.checkedOn && daysBetween(sale.checkedOn, today) > STALE_AFTER_DAYS) {
    return 'stale'
  }
  if (sale.bookStart && today < sale.bookStart) return 'announced'
  return 'live'
}

export const currentSales = (sales, edition, today = todayISO()) =>
  sales.filter((s) => ['live', 'announced'].includes(saleStatus(s, edition, today)))

export const lastYearSales = (sales, edition) => sales.filter((s) => s.year < edition.year)

/* Does this sale's travel window cover the whole trip, with no blackout date
 * inside it? Unknown windows answer null ("check the brand's terms"), never a
 * guessed yes. Blackouts are single ISO dates or [start, end] pairs. */
export function coversTrip(sale, from, to) {
  if (!sale.travelStart || !sale.travelEnd) return null
  if (from < sale.travelStart || to > sale.travelEnd) return false
  return !blackoutHits(sale, from, to).length
}

export function blackoutHits(sale, from, to) {
  return (sale.blackouts || []).filter((b) => {
    const [s, e] = Array.isArray(b) ? b : [b, b]
    return s <= to && e >= from
  })
}

/* A window ending before mid-March misses most US spring breaks (which run
 * from early March into April). Derived, so the card can say it truthfully. */
export function missesSpringBreak(sale) {
  if (!sale.travelEnd) return false
  const y = Number(sale.travelEnd.slice(0, 4))
  const breakStart = `${y}-03-14`
  return sale.travelEnd < breakStart && sale.travelEnd >= `${y}-01-01`
}

/* The hero's state: before sale week, during it, the tail while any current
 * sale is still bookable, then over. */
export function heroState(edition, sales, today = todayISO()) {
  const { blackFriday, travelTuesday } = edition.dates
  if (today < blackFriday) {
    return { state: 'before', daysToGo: daysBetween(today, blackFriday) }
  }
  if (today <= edition.watchUntil && today >= blackFriday) {
    const lastDay = today <= travelTuesday ? 'week' : 'tail'
    return { state: lastDay }
  }
  const open = currentSales(sales, edition, today)
  if (open.length) return { state: 'tail' }
  return { state: 'over' }
}
