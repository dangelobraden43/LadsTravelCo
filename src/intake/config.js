/* The quiz route is hidden (noindex, unlinked) until this is true. Flip it only
 * after Airtable credentials are set in Vercel and a test intake has landed. */
export const INTAKE_LIVE = true
export const DRAFT_KEY = 'lads-intake-draft-v1'

/* The call-booking link offered after submit. Null until Brady confirms which
 * Cal.com event to use; the Sent screen then asks people to reply to our email. */
export const CAL_URL = null
