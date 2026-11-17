/* /bucket-list: the generated trips list. These fail if an entry is undated but confirmed,
 * carries a price, lacks an organiser link, or could outlive its own last day. */
import { test } from 'node:test'
import assert from 'node:assert/strict'

const { BUCKET_EVENTS, BUCKET_META } = await import('../../src/data/bucketList.js')
const { visibleEvents, eventStatus } = await import('../../src/utils/events.js')

const KINDS = new Set(['festival', 'music', 'sport', 'culture', 'nature', 'holiday', 'food', 'winter'])
const STATUS = new Set(['confirmed', 'expected', 'not-announced'])

test('every trip has a unique id, a name, a kind and a status from the fixed sets', () => {
  const ids = new Set()
  for (const e of BUCKET_EVENTS) {
    assert.ok(e.id && e.name, JSON.stringify(e).slice(0, 80))
    assert.ok(!ids.has(e.id), `duplicate ${e.id}`)
    ids.add(e.id)
    assert.ok(KINDS.has(e.kind), `${e.id}: kind ${e.kind}`)
    assert.ok(STATUS.has(e.status), `${e.id}: status ${e.status}`)
  }
})

test('a confirmed or expected trip is dated; one waiting on dates is not', () => {
  for (const e of BUCKET_EVENTS) {
    if (e.status === 'not-announced') assert.equal(e.start, null, e.id)
    else {
      assert.match(e.start, /^\d{4}-\d{2}-\d{2}$/, e.id)
      assert.match(e.end, /^\d{4}-\d{2}-\d{2}$/, e.id)
      assert.ok(e.end >= e.start, `${e.id} ends before it starts`)
    }
  }
})

test('dated trips are sorted by start and the undated ones come last', () => {
  let prev = ''
  let undatedSeen = false
  for (const e of BUCKET_EVENTS) {
    if (!e.start) {
      undatedSeen = true
      continue
    }
    assert.ok(!undatedSeen, 'a dated trip after an undated one')
    assert.ok(e.start >= prev, `${e.id} is out of order`)
    prev = e.start
  }
})

test('no price, no "free", and every trip links to the organiser', () => {
  const money = /(?:[$€£]\s?\d)|\b\d+\s?(?:USD|EUR|GBP|dollars?|euros?)\b/i
  for (const e of BUCKET_EVENTS) {
    const text = `${e.what} ${e.ticket || ''} ${e.caution || ''}`
    assert.ok(!money.test(text), `price in ${e.id}`)
    assert.ok(!/\bfree\b/i.test(text), `"free" in ${e.id}`)
    assert.ok(e.sources.length && /^https?:\/\//.test(e.sources[0].url), `${e.id} has no organiser link`)
  }
})

test('a trip leaves the page the day after it ends, and one under way reads as now', () => {
  const dated = BUCKET_EVENTS.filter((e) => e.start)
  const e = dated[0]
  const next = (iso) => {
    const d = new Date(iso + 'T12:00:00')
    d.setDate(d.getDate() + 1)
    return d.toISOString().slice(0, 10)
  }
  assert.ok(visibleEvents(BUCKET_EVENTS, e.end).includes(e))
  assert.ok(!visibleEvents(BUCKET_EVENTS, next(e.end)).includes(e))
  assert.equal(eventStatus(e, e.start), 'now')
  assert.equal(eventStatus(e, '2000-01-01'), 'upcoming')
})

test('the data names its runs and the day they were read', () => {
  assert.ok(BUCKET_META.runs.length >= 1)
  for (const r of BUCKET_META.runs) assert.match(r.today, /^\d{4}-\d{2}-\d{2}$/)
})
