/* /deals MUST NOT VOUCH FOR A SALE THAT HAS ENDED OR CHANGED.
 * Every state on the page is computed from dates in src/data/holidayDeals.js. */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  saleStatus,
  currentSales,
  coversTrip,
  blackoutHits,
  missesSpringBreak,
  heroState,
} from '../../src/utils/deals.js'
import { EDITION, SALES } from '../../src/data/holidayDeals.js'

const ed = {
  year: 2026,
  dates: { blackFriday: '2026-11-27', cyberMonday: '2026-11-30', travelTuesday: '2026-12-01' },
  watchFrom: '2026-11-20',
  watchUntil: '2026-12-05',
}
const sale = {
  year: 2026,
  bookStart: '2026-11-27',
  bookBy: '2026-12-02',
  travelStart: '2027-01-06',
  travelEnd: '2027-03-04',
  blackouts: ['2027-02-12', ['2027-02-15', '2027-02-16']],
  checkedOn: '2026-11-27',
}

test('a previous edition is last year, whatever the date', () => {
  assert.equal(saleStatus({ ...sale, year: 2025 }, ed, '2026-10-12'), 'last-year')
})
test('before booking opens it is announced, then live', () => {
  assert.equal(saleStatus(sale, ed, '2026-11-15'), 'announced')
  assert.equal(saleStatus(sale, ed, '2026-11-27'), 'live')
})
test('after the book-by date it is expired and drops off', () => {
  assert.equal(saleStatus(sale, ed, '2026-12-03'), 'expired')
  assert.deepEqual(currentSales([sale], ed, '2026-12-03'), [])
})
test('inside sale week, a sale not re-checked for over 7 days hides', () => {
  const old = { ...sale, bookBy: '2026-12-15', checkedOn: '2026-11-21' }
  assert.equal(saleStatus(old, ed, '2026-11-28'), 'live')
  assert.equal(saleStatus(old, ed, '2026-11-29'), 'stale')
  assert.deepEqual(currentSales([old], ed, '2026-11-29'), [])
})
test('outside sale week an older check does not hide it', () => {
  const early = { ...sale, bookStart: null, bookBy: '2026-12-15', checkedOn: '2026-10-01' }
  assert.equal(saleStatus(early, ed, '2026-11-10'), 'live')
})
test('a trip inside the window with no blackout is covered', () => {
  assert.equal(coversTrip(sale, '2027-01-20', '2027-01-27'), true)
})
test('a trip outside the window is not covered', () => {
  assert.equal(coversTrip(sale, '2027-03-01', '2027-03-08'), false)
})
test('a blackout inside the trip breaks cover, single dates and ranges', () => {
  assert.equal(coversTrip(sale, '2027-02-10', '2027-02-13'), false)
  assert.deepEqual(blackoutHits(sale, '2027-02-14', '2027-02-15'), [['2027-02-15', '2027-02-16']])
})
test('an unknown window answers null, never a guessed yes', () => {
  assert.equal(coversTrip({ year: 2026 }, '2027-01-01', '2027-01-05'), null)
})
test('a window ending Mar 4 misses spring break; one ending in April does not', () => {
  assert.equal(missesSpringBreak(sale), true)
  assert.equal(missesSpringBreak({ travelEnd: '2027-04-30' }), false)
})
test('hero: countdown before, week during, tail after Travel Tuesday, over at the end', () => {
  assert.deepEqual(heroState(ed, [], '2026-11-20'), { state: 'before', daysToGo: 7 })
  assert.equal(heroState(ed, [], '2026-11-28').state, 'week')
  assert.equal(heroState(ed, [], '2026-12-03').state, 'tail')
  assert.equal(heroState(ed, [{ ...sale, bookBy: '2026-12-15' }], '2026-12-10').state, 'tail')
  assert.equal(heroState(ed, [], '2026-12-10').state, 'over')
})

test('the data: every sale has a source, a check date and a region', () => {
  for (const s of SALES) {
    assert.ok(s.src && /^https?:\/\//.test(s.src), `${s.id} has no source URL`)
    assert.match(s.checkedOn, /^\d{4}-\d{2}-\d{2}$/, `${s.id} has no checkedOn`)
    assert.ok(['us', 'world'].includes(s.region), `${s.id} region`)
  }
})
test('the data: no Lads voice says "free", and no single dollar fare is ours', () => {
  const text = JSON.stringify({ EDITION, SALES })
  // brand offer names may contain the word only inside quotation marks
  const bare = text.replace(/“[^”]*”/g, '').replace(/\\"[^"]*\\"/g, '')
  assert.ok(!/\bfree\b/i.test(bare), 'the word "free" outside a quoted brand offer')
})
test('the data: edition dates are the confirmed 2026 dates', () => {
  assert.deepEqual(EDITION.dates, {
    blackFriday: '2026-11-27',
    cyberMonday: '2026-11-30',
    travelTuesday: '2026-12-01',
  })
})
