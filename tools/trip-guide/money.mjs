/* Money for travellers paying in another currency: every euro amount reads "€450–500 (about $505–565)".
 * Rates are the ECB euro reference rates, stated once on the page with their date. Converted figures are
 * rounded outward (low down, high up) so a range never looks narrower than its source.
 * Pounds in a source about Ireland are converted to euro and marked as converted. One pass, so a
 * converted figure is never converted again. */

export const RATES = { date: '2026-10-16', source: 'https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html', USD: 1.1253, GBP: 0.84385 }

const num = (s) => Number(String(s).replace(/,/g, ''))
const step = (v) => (v >= 1000 ? 50 : v >= 100 ? 5 : 1)
const down = (v) => Math.floor(v / step(v)) * step(v)
const up = (v) => Math.ceil(v / step(v)) * step(v)
const fmt = (v) => (v >= 1000 ? v.toLocaleString('en-US') : String(v))
const keep = (s) => (String(s).includes('.') ? num(s).toFixed(2) : fmt(num(s)))
const conv = (lo, hi) => {
  if (Math.max(lo, hi ?? lo) < 10) return hi == null ? lo.toFixed(2) : `${lo.toFixed(2)}–${hi.toFixed(2)}`
  return hi == null ? fmt(Math.round(lo)) : `${fmt(down(lo))}–${fmt(up(hi))}`
}

/* an amount already followed by its conversion, or itself a conversion ("about $…"), is left alone;
 * the trailing guards stop the engine backtracking to a partial range to dodge them */
const RE = /(?<!\(about )(EUR|€|GBP|£|USD|\$)\s?(\d[\d,]*(?:\.\d+)?)(?:\s*(?:-|–|to)\s*(?:€|\$|£)?(\d[\d,]*(?:\.\d+)?))?(?![\d,]|\.\d|\s*[-–]\s*\d|\s*\(about )/g

export function money(text, r = RATES) {
  if (!text) return text
  return String(text).replace(RE, (m, cur, a, b) => {
    const lo = num(a); const hi = b ? num(b) : null
    if (cur === 'EUR' || cur === '€') return `€${keep(a)}${b ? '–' + keep(b) : ''} (about $${conv(lo * r.USD, hi == null ? null : hi * r.USD)})`
    if (cur === 'GBP' || cur === '£') {
      const el = lo / r.GBP; const eh = hi == null ? null : hi / r.GBP
      return `about €${conv(el, eh)} (about $${conv(el * r.USD, eh == null ? null : eh * r.USD)}; converted from £${a}${b ? '–' + b : ''})`
    }
    return `$${keep(a)}${b ? '–' + keep(b) : ''} (about €${conv(lo / r.USD, hi == null ? null : hi / r.USD)})`
  }).replace(/\babout about\b/g, 'about')
}
