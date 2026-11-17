/* /local: the derived index behind the Midwest map. These fail if a count is ever typed, a
 * tier is blended, a pin has no coordinate, or an event could survive its own last day. */
import { test } from 'node:test'
import assert from 'node:assert/strict'

const idx = await import('../../src/data/localIndex.js')
const { LOCAL_PLACES, PINNED, WALKED_TOTAL, OTHER_TOTAL, HUBS, LOCAL_EVENTS, eventsBetween, dateWindows, hubIdOf } = idx

test('every place has an id, a name and a tier, and ids are unique', () => {
  const ids = new Set()
  for (const p of LOCAL_PLACES) {
    assert.ok(p.id && p.name, `${p.name} lacks an id or name`)
    assert.ok(['walked', 'saved', 'researched'].includes(p.tier), `${p.name}: tier ${p.tier}`)
    assert.ok(!ids.has(p.id), `duplicate id ${p.id}`)
    ids.add(p.id)
  }
})

test('the counts the page prints are the arrays, not typed numbers', () => {
  assert.equal(WALKED_TOTAL, LOCAL_PLACES.filter((p) => p.tier === 'walked').length)
  assert.equal(OTHER_TOTAL, LOCAL_PLACES.length - WALKED_TOTAL)
  assert.ok(WALKED_TOTAL > 0 && OTHER_TOTAL > 0)
})

test('only walked places are gold, and no walked place came from the research run', () => {
  for (const p of LOCAL_PLACES) {
    if (p.key) assert.notEqual(p.tier, 'walked', `${p.name} is researched and cannot be gold`)
    if (p.tier !== 'walked') assert.notEqual(p.status, 'We have been')
  }
})

test('every pinned place has finite coordinates inside the Midwest frame', () => {
  for (const p of PINNED) {
    assert.ok(Number.isFinite(p.lat) && Number.isFinite(p.lng), p.name)
    assert.ok(p.lat > 36 && p.lat < 50 && p.lng > -98 && p.lng < -80, `${p.name} is off the model`)
  }
})

test('researched places carry no Lads voice', () => {
  const voice = /\b(we|our|the lads)\b/i
  for (const p of LOCAL_PLACES.filter((x) => x.tier === 'researched')) {
    assert.ok(!p.what || !voice.test(p.what), `${p.name}: ${p.what}`)
  }
})

test('hubs are found in the data, name a real city and do not share members', () => {
  assert.ok(HUBS.length >= 3)
  const seen = new Set()
  for (const h of HUBS) {
    assert.ok(h.name && h.memberIds.length >= 6, h.name)
    for (const id of h.memberIds) {
      assert.ok(!seen.has(id), `${id} is in two hubs`)
      seen.add(id)
      assert.equal(hubIdOf(id), h.id)
    }
  }
})

test('events are dated, sorted, linked to an organiser page and carry no price', () => {
  let prev = ''
  for (const e of LOCAL_EVENTS) {
    assert.match(e.date, /^\d{4}-\d{2}-\d{2}$/, e.title)
    assert.ok(e.date >= prev, 'events are sorted by date')
    prev = e.date
    assert.match(e.url, /^https?:\/\//, e.title)
    assert.ok(!/[$€£]\s?\d/.test(e.title), `price in ${e.title}`)
    assert.ok(e.last >= e.date)
  }
})

test('an event leaves the page the day after its last day', () => {
  if (!LOCAL_EVENTS.length) return
  const e = LOCAL_EVENTS[0]
  const next = (iso) => {
    const d = new Date(iso + 'T12:00:00')
    d.setDate(d.getDate() + 1)
    return d.toISOString().slice(0, 10)
  }
  assert.ok(eventsBetween(e.last, e.last).includes(e))
  assert.ok(!eventsBetween(next(e.last), '2999-12-31').includes(e))
})

test('the date windows start today or later and the weekend is Friday to Sunday', () => {
  const w = dateWindows('2026-11-18') // a Wednesday
  const weekend = w.find((x) => x.id === 'weekend')
  assert.equal(weekend.from, '2026-11-20')
  assert.equal(weekend.to, '2026-11-22')
  const sat = dateWindows('2026-11-21').find((x) => x.id === 'weekend')
  assert.equal(sat.from, '2026-11-21')
  assert.equal(sat.to, '2026-11-22')
  for (const x of w) assert.ok(x.from >= '2026-11-18' && x.to >= x.from, x.id)
})
