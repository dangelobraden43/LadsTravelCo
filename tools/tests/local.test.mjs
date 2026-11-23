/* /local: the derived index behind the Midwest map. These fail if a count is ever typed, a pin
 * has no coordinate, a headline list is ordered by anything but the published measure, or an
 * event could survive its own last day. */
import { test } from 'node:test'
import assert from 'node:assert/strict'

const idx = await import('../../src/data/localIndex.js')
const {
  LOCAL_PLACES,
  PINNED,
  UNPINNED,
  TOTAL,
  HUBS,
  LOCAL_EVENTS,
  eventsBetween,
  dateWindows,
  hubIdOf,
  headline,
  headlineAcross,
  HEADLINE_LAYERS,
} = idx

test('every place has an id, a name and a source, and ids are unique', () => {
  const ids = new Set()
  for (const p of LOCAL_PLACES) {
    assert.ok(p.id && p.name && p.source, `${p.name} lacks an id, name or source`)
    assert.ok(!('tier' in p) && !('status' in p), `${p.name}: this page carries no tiers`)
    assert.ok(!ids.has(p.id), `duplicate id ${p.id}`)
    ids.add(p.id)
  }
})

test('the counts the page prints are the arrays, not typed numbers', () => {
  assert.equal(TOTAL, LOCAL_PLACES.length)
  assert.equal(PINNED.length + UNPINNED.length, TOTAL)
  assert.ok(TOTAL > 0 && PINNED.length > 0)
})

test('every pinned place has finite coordinates inside the Midwest frame', () => {
  for (const p of PINNED) {
    assert.ok(Number.isFinite(p.lat) && Number.isFinite(p.lng), p.name)
    assert.ok(p.lat > 36 && p.lat < 50 && p.lng > -98 && p.lng < -80, `${p.name} is off the model`)
  }
})

test('places from the research run carry no Lads voice', () => {
  const voice = /\b(we|our|the lads)\b/i
  for (const p of LOCAL_PLACES.filter((x) => x.key)) {
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

test('headline places are ordered by Wikipedia coverage, come from the hub, and are never bars or food', () => {
  for (const h of HUBS) {
    const picks = headline(h, 5)
    assert.ok(picks.length <= 5)
    for (let i = 0; i < picks.length; i++) {
      const p = picks[i]
      assert.ok(h.memberIds.includes(p.id), `${p.name} is not in ${h.name}`)
      assert.ok(HEADLINE_LAYERS.has(p.layer), `${p.name} is a ${p.layer}`)
      assert.ok(p.editions > 0, `${p.name} has no coverage record`)
      if (i) assert.ok(picks[i - 1].editions >= p.editions, `${h.name} is out of order at ${p.name}`)
    }
  }
  const across = headlineAcross(12)
  for (let i = 1; i < across.length; i++) assert.ok(across[i - 1].editions >= across[i].editions)
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

test('every airport carries an IATA code, a Wikidata identity and a gateway that exists', () => {
  const { AIRPORT_PLACES, gatewayOf } = idx
  assert.ok(AIRPORT_PLACES.length >= 4)
  const gateways = AIRPORT_PLACES.filter((a) => a.gateway)
  assert.ok(gateways.length >= 3)
  for (const a of AIRPORT_PLACES) {
    assert.match(a.iata, /^[A-Z]{3}$/, a.name)
    assert.match(a.key, /^Q\d+$/, a.name)
    const g = gatewayOf(a)
    assert.ok(g && g.gateway, `${a.iata} points at no gateway`)
    assert.ok(!HEADLINE_LAYERS.has(a.layer), 'an airport is never a headline place')
  }
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
