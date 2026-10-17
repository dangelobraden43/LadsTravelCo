/* The field-guide builder: places land in their real town, money reads € with $, a line resting on an
 * unconfirmed fact says so, nothing cites a refuted finding, and the public preview carries no paid detail. */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { buildField } from '../trip-guide/build-field.mjs'

const item = (id, claim, status = 'confirmed', extra = {}) => ({ id, claim, status, sources: [{ url: 'https://example.org/' + id, title: id, kind: 'official' }], notes: '', kind: 'fact', part: null, ...extra })
const data = { builtOn: '2026-10-17', runs: [{ destination: 'r', stats: { findings: 4, sources: 4, agentFiles: 1, verdicts: {} }, items: [
  item('f-1', 'A round costs EUR 450-500.'), item('f-2', 'Maybe true.', 'unconfirmed'),
  item('p-1', 'A pub with nightly trad sessions.', 'confirmed', { kind: 'place', part: 'drink', name: "Tig Coili, Galway" }),
  item('p-2', 'A castle on the river.', 'confirmed', { kind: 'place', part: 'see', name: "King John's Castle" }),
] }] }
const day = (date, ids) => ({ date, title: 'T', sleep: 'Galway', plan: [{ t: 'Do it, EUR 10-20.', ids }] })
const plan = () => ({
  runs: { r: 'x' }, meta: { title: 'T', introConfig: {} }, copy: {}, cta: {},
  towns: [{ id: 'galway', name: 'Galway city', county: 'Co. Galway', match: (p) => /Galway/.test(p.name) }, { id: 'limerick', name: 'Limerick city', county: 'Co. Limerick', match: (p) => /King John/.test(p.name) }],
  sleepTown: { Galway: 'galway' },
  shapes: [{ id: 'A', label: 'L', short: 's', bestFor: 'b', blurb: 'x', nights: { '13-20': [['Galway', 1]], '14-21': [['Galway', 1]] }, metrics: { moves: 0, transit: [1, 2], ids: ['x:f-1'] }, legs: [], pins: [], golf: [],
    days: { '13-20': [day('2027-09-14', ['x:f-1'])], '14-21': [day('2027-09-15', ['x:f-2'])] } }],
  golf: [], golfCallout: [], book: [], flights: {}, know: [], stays: {}, townNotes: {},
  watch: { days: { fri: {}, sat: {}, sun: {} }, match: { items: [] }, tv: { items: [] } },
})

test('places land in their real town', () => {
  const G = buildField(data, plan(), { pins: [] }, [], 'private')
  const g = G.towns.find((t) => t.id === 'galway'); const l = G.towns.find((t) => t.id === 'limerick')
  assert.equal(g.places.drink[0].name, 'Tig Coili')
  assert.equal(l.places.see[0].name, "King John's Castle")
})

test('money reads euro first with dollars alongside', () => {
  const G = buildField(data, plan(), { pins: [] }, [], 'private')
  assert.match(G.plans[0].altDays[0].plan[0].t, /€10–20 \(about \$11–23\)/)
})

test('a line resting on an unconfirmed finding is marked weak', () => {
  const G = buildField(data, plan(), { pins: [] }, [], 'private')
  assert.equal(G.plans[0].days[0].plan[0].weak, true)
  assert.equal(G.plans[0].altDays[0].plan[0].weak, false)
})

test('citing a finding that does not exist fails the build', () => {
  const p = plan(); p.shapes[0].days['14-21'][0].plan[0].ids = ['x:gone']
  assert.throws(() => buildField(data, p, { pins: [] }, [], 'private'), /unknown or refuted/)
})

test('the public preview drops towns, golf, bookings and the facts behind them', () => {
  const G = buildField(data, plan(), { pins: [] }, [], 'preview')
  assert.deepEqual(G.towns, []); assert.deepEqual(G.book, []); assert.equal(G.match, null)
  assert.deepEqual(Object.keys(G.F), ['x:f-1'])
})
