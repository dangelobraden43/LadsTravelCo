import { TOTAL_SPOTS, FRAMEWORKS } from './siteStats.js'
/* Only `siteName` is consumed today (FrameworkPage's title and og:title).
 *
 * The old `description` here read "Free personal travel consulting through
 * 2026. 650+ validated spots across 20+ cities." Every part of that was a
 * problem: "free" is banned site-wide (the site is a PREVIEW until the Jan 1
 * 2027 launch), and 650+/20+ never matched the canonical totals, which are
 * 220 spots across 13 validated cities. It was never rendered, so nothing
 * live was wrong - but it sat here ready for the next person to wire into a
 * meta tag. Replaced rather than left loaded.
 *
 * The old `image` pointed at ladstravel.CO, which is not our domain. */
export const SEO_DEFAULTS = {
  siteName: 'The Lads Travel Co.',
  /* Derived. This string is one wire-up away from being a rendered meta tag,
   * and its previous version carried BOTH a banned "free" claim and a count
   * that never matched canonical. Numbers here come from the build. */
  description:
    `AI researches. We validate on foot. ${TOTAL_SPOTS} validated spots across ${FRAMEWORKS} ` +
    'destination frameworks, built from firsthand experience.',
  image: 'https://ladstravel.com/og-image.jpg',
  twitterHandle: '@ladstravelco',
}

export function buildPageTitle(page) {
  return `${page} | The Lads Travel Co.`
}
