/* EVENT STATUS, COMPUTED FROM THE DATES.
 *
 * On Sept 29 2026 /bucket-list told visitors Vivid Sydney was "HAPPENING NOW"
 * three and a half months after it ended, and that Oktoberfest was "COMING
 * SOON" while it was running. Both labels were typed once and went stale. The
 * status now comes from each event's `start` / `end` (ISO dates), and an event
 * whose end has passed stops rendering. Tested in tools/tests/events.test.mjs.
 *
 * `start` may be null when only a rough window is published ("late November");
 * such an event reads as upcoming until it ends, never as a guessed "now". */

export const todayISO = () => new Date().toLocaleDateString('en-CA')

export function eventStatus(ev, today = todayISO()) {
  if (ev.end && today > ev.end) return 'past'
  if (ev.start && today >= ev.start) return 'now'
  return 'upcoming'
}

export const visibleEvents = (events, today = todayISO()) =>
  events.filter((ev) => eventStatus(ev, today) !== 'past')
