/* SITE-WIDE STATS — the single import for every canonical number on screen.
 *
 * The values come from `virtual:lads-stats`, which vite.config.js computes at
 * BUILD TIME by importing the ten framework data files and walking them. That
 * indirection is the whole point: the homepage renders "220 spots" without
 * shipping a byte of the prose those 220 spots live in, and the number cannot
 * be wrong, because nobody typed it.
 *
 * ⛔ Do not add a hand-written number to this file. If a surface needs a count
 * this file does not expose, derive it — add it to the plugin or to
 * src/utils/derive.js. The moment a literal lands here we are back to Sept 8
 * 2026, when six surfaces disagreed with each other and with the data.
 *
 * ℹ️ FOUNDER TRAVEL HISTORY IS NOT IN HERE AND MUST NOT BE. "20+ cities, 4
 * continents" on the founder bios describes where Brady and Dawson have been,
 * not what the site covers. The two have always been kept apart and blending
 * them would inflate our coverage claim with personal travel.
 */
export {
  TOTAL_SPOTS,
  SPOTS_BY_FRAMEWORK,
  VALIDATED_CITIES,
  COUNTRIES,
  CONTINENTS,
  FRAMEWORKS,
} from 'virtual:lads-stats'
