/* The event guide builder (tools/trip-guide/build-event.mjs) must never put an unchecked or
 * refuted claim, a "free" price line, or paid content on a public preview. */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import path from 'node:path'
import { buildEvent, noFree } from '../trip-guide/build-event.mjs'

const item = (id, claim, status = 'confirmed', extra = {}) => ({ id, claim, status, sources: [{ url: 'https://example.org/' + id, title: id, kind: 'official' }], notes: '', kind: 'fact', part: null, ...extra })
const data = {
  builtOn: '2026-10-17',
  runs: [{ destination: 'trip-a', stats: { findings: 3, sources: 3, agentFiles: 1, verdicts: { confirmed: 3 } },
    items: [item('f-1', 'The shuttle runs 05:00 to 23:00.'), item('f-2', 'Entry is free on Sundays. The castle opens at 09:30.'),
      item('p-1', 'A pub with screens.', 'confirmed', { kind: 'place', part: 'drink', name: 'The Pub, Town' })] }],
}
const plan = (cites) => ({
  runs: { 'trip-a': 'a' },
  meta: { title: 'T', introConfig: {} }, presets: { private: { dates: 'x' }, product: { dates: 'x' } }, toggles: {}, copy: {}, sim: {},
  shapes: [{ id: 'A', nights: { x: [] }, days: { x: [{ date: '2027-09-14', plan: [{ t: 'Line', ids: cites }] }] } }],
  bases: { b: { name: 'Town', runs: ['a'], parts: ['drink'] } },
  golf: [{ id: 'g', facts: [{ k: 'Fee', t: 'x', ids: ['a:f-2'] }], transit: {} }], golfCallout: [], watch: {}, book: [],
  flights: { dtw: { items: [{ title: 'x', lines: [{ t: 'y', ids: ['a:f-1'] }] }] }, any: { items: [] }, points: { items: [] } },
  know: [], pinInfo: {}, cta: {},
})
const map = { pins: [] }

test('a plan citing an unknown (or refuted, therefore absent) finding fails the build', () => {
  assert.throws(() => buildEvent(data, plan(['a:nope']), map, 'private'), /unknown or refuted/)
})

test('every rendered claim drops a sentence that calls something free', () => {
  const G = buildEvent(data, plan(['a:f-1']), map, 'private')
  assert.equal(G.F['a:f-2'].c, 'The castle opens at 09:30.')
  assert.equal(noFree('Duty-free allowance applies. Visa-free for 90 days.'), 'Duty-free allowance applies. Visa-free for 90 days.')
})

test('places come from the base runs and carry their status', () => {
  const G = buildEvent(data, plan(['a:f-1']), map, 'private')
  assert.equal(G.bases.b.places.drink[0].name, 'The Pub')
  assert.equal(G.bases.b.places.drink[0].s, 'confirmed')
})

test('the public preview carries only the facts the Plan tab cites, and no paid tabs', () => {
  const G = buildEvent(data, plan(['a:f-1']), map, 'preview')
  assert.deepEqual(Object.keys(G.F), ['a:f-1'])
  assert.deepEqual(G.golf, []); assert.deepEqual(G.book, []); assert.deepEqual(G.bases, {})
  assert.deepEqual(G.shapes[0].days, {})
})

/* the Ryder Cup plan lives in internal/ (gitignored); check it when it is on this machine */
const rc = path.resolve('internal/trip-guides/ryder-cup-2027/plan.mjs')
test('Ryder Cup shapes cover every night from landing to leaving, both date options', { skip: !existsSync(rc) }, async () => {
  const P = await import(pathToFileURL(rc).href)
  const span = { '13-20': ['2027-09-14', '2027-09-20'], '14-21': ['2027-09-15', '2027-09-21'] }
  for (const s of P.shapes) {
    for (const [v, [a, z]] of Object.entries(span)) {
      const dates = s.days[v].map((d) => d.date)
      assert.equal(dates[0], a, `${s.id} ${v} starts on landing day`)
      assert.equal(dates.at(-1), z, `${s.id} ${v} ends on the flight home`)
      for (let i = 1; i < dates.length; i++) assert.equal((new Date(dates[i]) - new Date(dates[i - 1])) / 864e5, 1, `${s.id} ${v} has no gap before ${dates[i]}`)
      assert.ok(s.days[v].some((d) => d.date === '2027-09-17' && d.match), `${s.id} ${v} keeps Friday as match day`)
      const nights = s.nights[v].reduce((n, [, k]) => n + k, 0)
      assert.equal(nights, dates.length - 1, `${s.id} ${v} nights add up`)
    }
  }
})
