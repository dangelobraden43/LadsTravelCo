/* AFFILIATE LINK BUILDERS
 *
 * Viator-direct since August 25, 2026. We hold a company Viator Partners
 * account; the Travelpayouts network was removed entirely (their programs
 * denied us) along with its site-wide tracking script.
 *
 * Format pinned from a REAL dashboard-generated link, not inferred:
 *   https://www.viator.com/tours/Pompeii/Rome-Day-Trip-Small-Group-Pompeii
 *     -Tour-and-Lunch-in-Sorrento-coast/d24336-15932P127
 *     ?pid=P00297284&mcid=42383&medium=link
 *
 * The three params are account-level constants, not per-product values, so
 * they are hardcoded here rather than read from env. They are also fully
 * public — they ride in every outbound URL and are visible to any visitor.
 * Hardcoding them removes the previous failure mode: the old version read
 * VITE_VIATOR_AFFILIATE_ID, that var was never set in .env.local, and the
 * builder therefore emitted untagged links that earned nothing while
 * looking correct in review.
 */

const VIATOR_PARTNER = {
  pid: 'P00297284', // our partner account
  mcid: '42383', // marketing channel: text link
  medium: 'link',
}

/**
 * Append our Viator partner params to a Viator PRODUCT url.
 *
 * Pass the plain product URL (the one in the address bar on the tour page).
 * Existing query params are preserved; our params overwrite any stale copy
 * so re-running this on an already-tagged link is safe and idempotent.
 *
 * Returns the input unchanged if it is not a viator.com URL — we never
 * decorate another platform's link with Viator credentials.
 */
export function viatorLink(productUrl) {
  let url
  try {
    url = new URL(productUrl)
  } catch {
    return productUrl
  }
  if (!/(^|\.)viator\.com$/i.test(url.hostname)) return productUrl

  url.searchParams.set('pid', VIATOR_PARTNER.pid)
  url.searchParams.set('mcid', VIATOR_PARTNER.mcid)
  url.searchParams.set('medium', VIATOR_PARTNER.medium)
  return url.toString()
}

/**
 * GetYourGuide — NO AFFILIATE PROGRAM IS ACTIVE.
 *
 * GYG was only ever reachable through Travelpayouts, which is gone. Until a
 * direct GYG partner account exists, a GYG link is a plain outbound link
 * that earns nothing. This is a deliberate pass-through: the previous
 * version appended `partner_id=`, a param we never held credentials for,
 * which would have looked wired while tracking nothing.
 */
export function gygLink(productUrl) {
  return productUrl
}

/** Non-affiliate outbound link with our own campaign tagging. */
export function externalLink(url, source, campaign) {
  return `${url}?utm_source=ladstravel&utm_medium=${source}&utm_campaign=${campaign}`
}

/* ===================================================================
 * THE GATE — added September 24, 2026
 * ===================================================================
 *
 * WHY THIS EXISTS. Until today this file was imported by NOTHING. The two
 * live Viator links were pre-tagged string literals pasted straight into
 * dublin.js and spain.js, which means `viatorLink()` guarded nothing and an
 * UNTAGGED paste looked identical to a tagged one in review — the failure
 * mode the file's own header describes, reintroduced through the door of
 * simply never calling it.
 *
 * So the render path no longer reads `bookingUrl` directly. It calls
 * `resolveBooking()`, and that function is the only way a booking link
 * reaches a page. Consequences, all deliberate:
 *
 *   1. A Viator URL is tagged HERE, at render, every time. Whether the data
 *      file pasted the params or not is now irrelevant — idempotent by
 *      construction, so a stale or missing param set cannot ship.
 *   2. The PLATFORM NAME is derived from the host, never read from the data.
 *      `bookingPlatform: 'Viator'` sitting on a gyg.me URL was a drift bug
 *      waiting to happen; the host cannot lie about what it is.
 *   3. An UNKNOWN host returns null and renders NOTHING. We are not in the
 *      business of sending readers to a platform we have not decided on,
 *      and a silent no-render is a far better failure than an untracked
 *      outbound link that looks official.
 *
 * ⛔ Do not read `place.bookingUrl` anywhere in a component. Call this.
 */

const BOOKING_HOSTS = [
  {
    test: /(^|\.)viator\.com$/i,
    platform: 'Viator',
    earns: true,
    tag: viatorLink,
  },
  {
    /* gyg.me is GetYourGuide's own short-link domain. Both forms appear in
       the data (dublin + rome use gyg.me). Neither earns anything today —
       see gygLink above — and the two survivors are kept deliberately
       until Viator equivalents exist. */
    test: /(^|\.)(gyg\.me|getyourguide\.com)$/i,
    platform: 'GetYourGuide',
    earns: false,
    tag: gygLink,
  },
]

/**
 * Resolve a raw `bookingUrl` from a data file into something renderable.
 *
 * Returns `null` when there is no link, when the URL does not parse, or
 * when the host is not one we have approved. Returning null means the CTA
 * does not render at all — absence, never a broken or untracked link.
 *
 * @returns {{href: string, platform: string, earns: boolean} | null}
 */
export function resolveBooking(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return null

  let url
  try {
    url = new URL(rawUrl)
  } catch {
    return null
  }

  /* http is not good enough for a link we are paid for, and a reader
     should never be downgraded on our say-so. */
  if (url.protocol !== 'https:') return null

  const match = BOOKING_HOSTS.find((h) => h.test.test(url.hostname))
  if (!match) return null

  return { href: match.tag(rawUrl), platform: match.platform, earns: match.earns }
}

/**
 * THE ENDORSEMENT GRADIENT, in one place.
 *
 * Two separate questions, deliberately kept apart since Aug 27 2026:
 *   1. Did we do the PLACE?            → `ladsRating` is the recorded evidence.
 *   2. Is the BOOKABLE PRODUCT the exact version we did? → `bookingEndorsed`.
 *
 * `bookingEndorsed: false` forces the neutral CTA while KEEPING the rating
 * chip, so a true fact never has to be deleted to avoid an untrue claim.
 * `bookingEndorsed: true` is deliberately NOT sufficient on its own: with no
 * rating there is no evidence, and we refuse to manufacture the claim.
 *
 * ⚠️ `ladsRating` is the ONLY accepted evidence, for day trips and for
 * places alike. `validated: true` is NOT enough — it can mean a founder
 * curated a saved list without standing behind a specific bookable product.
 * Today no framework spot carries a rating, so every spot-level link renders
 * NEUTRAL. That is the correct starting state, not a gap to paper over.
 */
export function isBookingEndorsed(item) {
  if (!item || item.bookingEndorsed === false) return false
  return Boolean(item.ladsRating)
}
