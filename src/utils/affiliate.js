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
