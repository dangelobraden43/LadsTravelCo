/* BUCKET LIST EVENTS MUST NOT GO STALE.
 * Sept 29 2026: /bucket-list said Vivid Sydney was "HAPPENING NOW" three and a
 * half months after it ended, and Oktoberfest was "COMING SOON" while it was
 * running. The status is now computed from the dates. */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { eventStatus, visibleEvents } from '../../src/utils/events.js'

const vivid = { name: 'Vivid', start: '2026-05-22', end: '2026-06-13' }
const okt = { name: 'Okt', start: '2026-09-19', end: '2026-10-04' }
const ryder = { name: 'Ryder', start: '2027-09-17', end: '2027-09-19' }
const markets = { name: 'Markets', start: null, end: '2026-12-31' }

test('before the start date it is upcoming', () => {
  assert.equal(eventStatus(ryder, '2026-09-29'), 'upcoming')
  assert.equal(eventStatus(okt, '2026-09-18'), 'upcoming')
})
test('between start and end, inclusive, it is happening now', () => {
  assert.equal(eventStatus(okt, '2026-09-29'), 'now')
  assert.equal(eventStatus(okt, '2026-09-19'), 'now')
  assert.equal(eventStatus(okt, '2026-10-04'), 'now')
})
test('after the end date it is past', () => {
  assert.equal(eventStatus(vivid, '2026-09-29'), 'past')
  assert.equal(eventStatus(okt, '2026-10-05'), 'past')
})
test('no start date means upcoming until it ends, never a guessed "now"', () => {
  assert.equal(eventStatus(markets, '2026-09-29'), 'upcoming')
  assert.equal(eventStatus(markets, '2027-01-01'), 'past')
})
test('visibleEvents drops past events', () => {
  assert.deepEqual(visibleEvents([vivid, okt, ryder, markets], '2026-09-29').map((e) => e.name), ['Okt', 'Ryder', 'Markets'])
})
