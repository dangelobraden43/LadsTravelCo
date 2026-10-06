/* Fixes from the Oct 6 independent review of intake phase 1. Each test names the
 * review item it pins. */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { normalizeIntake, normalizeCompanion, validateIntake, emptyIntake, LIMITS } from '../../src/intake/schema.js'
import { handleIntake } from '../../api/intake.js'
import { handleCompanion } from '../../api/companion.js'
import { checkSpam } from '../../api/_lib/spam.js'
import { createStore } from '../../api/_lib/store.js'

function memStore({ failWrites = false } = {}) {
  const rows = { intake: new Map(), companion: new Map() }
  let calls = 0
  const s = (k) => ({
    find: async (key) => { calls++; return rows[k].has(key) ? { stored: true, id: key, fields: rows[k].get(key) } : { stored: false, id: null } },
    upsert: async (key, f) => {
      calls++
      if (failWrites) return { stored: false, id: null }
      rows[k].set(key, { ...(rows[k].get(key) || {}), ...f })
      return { stored: true, id: key }
    },
  })
  return { rows, live: true, calls: () => calls, findIntake: s('intake').find, upsertIntake: s('intake').upsert, findCompanion: s('companion').find, upsertCompanion: s('companion').upsert }
}
const deps = (store) => ({ store, env: {}, now: 10 ** 9 })
const full = { ...emptyIntake(), name: 'Alex', email: 'a@b.co', dest: 'Lisbon', length: '7 to 9 nights', airport: 'DTW', budget: '$175 to $275', top3: ['Food & drink'] }

test('#1 companions are capped, so one request cannot fan out into thousands of writes', async () => {
  const store = memStore()
  const many = Array.from({ length: 2000 }, (_, i) => ({ name: `P${i}` }))
  const r = await handleIntake({ method: 'POST', body: { data: { ...full, companions: many }, final: false, meta: {} } }, deps(store))
  assert.equal(r.status, 200)
  assert.ok(r.json.invites.length <= LIMITS.companions)
  assert.ok(store.calls() <= 2 + LIMITS.companions * 2 + 2)
})
test('#1 nested strings and arrays are capped', () => {
  const n = normalizeIntake({ ...full, feels: Array(500).fill('x'.repeat(9000)), more: { a: Array(500).fill('y'.repeat(9000)) }, companions: [{ name: 'z'.repeat(9000) }] })
  assert.ok(n.feels.length <= LIMITS.list)
  assert.ok(n.feels.every((s) => s.length <= LIMITS.text))
  assert.ok(JSON.stringify(n).length <= LIMITS.json)
  assert.ok(n.companions[0].name.length <= 60)
})
test('#11 wrong types never throw; unknown keys are dropped', () => {
  const n = normalizeIntake({ name: 5, email: ['a'], dest: 5, feels: 'x', top3: null, adults: '3', kids: 'x', evil: 'drop me', pairs: 'nope' })
  assert.equal(n.name, '5')
  assert.deepEqual(n.feels, [])
  assert.equal(n.adults, 3)
  assert.equal(n.kids, 0)
  assert.equal(n.evil, undefined)
  assert.deepEqual(n.pairs, {})
  assert.doesNotThrow(() => validateIntake(n, { final: true }))
})
test('#11 a malformed body is a 400, never an uncaught 500', async () => {
  const r = await handleIntake({ method: 'POST', body: { final: true, data: { name: 'a', email: 'a@b.co', dest: 5, feels: 7 } } }, deps(memStore()))
  assert.equal(r.status, 400)
})
test('#2 a live store that fails to write is a 502, not a quiet success', async () => {
  const r = await handleIntake({ method: 'POST', body: { data: full, final: true, meta: { startedAt: 0 } } }, deps(memStore({ failWrites: true })))
  assert.equal(r.status, 502)
})
test('#5 duplicate companion names are de-duplicated on the server', async () => {
  const store = memStore()
  const r = await handleIntake({ method: 'POST', body: { data: { ...full, companions: [{ name: 'Sam' }, { name: 'sam ' }, { name: 'Jo' }] }, final: false, meta: {} } }, deps(store))
  assert.deepEqual(r.json.invites.map((x) => x.name), ['Sam', 'Jo'])
})
test('#6 a late draft save never downgrades a submitted intake', async () => {
  const store = memStore()
  const a = await handleIntake({ method: 'POST', body: { data: full, final: true, meta: { startedAt: 0 } } }, deps(store))
  await handleIntake({ method: 'POST', body: { resume: a.json.resume, data: full, final: false, meta: {} } }, deps(store))
  assert.equal(store.rows.intake.get(a.json.resume).Status, 'New')
})
test('#6 a founder-set status is never overwritten by the client', async () => {
  const store = memStore()
  const a = await handleIntake({ method: 'POST', body: { data: full, final: true, meta: { startedAt: 0 } } }, deps(store))
  store.rows.intake.get(a.json.resume).Status = 'Run started'
  await handleIntake({ method: 'POST', body: { resume: a.json.resume, data: full, final: true, meta: { startedAt: 0 } } }, deps(store))
  assert.equal(store.rows.intake.get(a.json.resume).Status, 'Run started')
})
test('#7 Turnstile is only enforced once explicitly switched on', async () => {
  const fake = async () => ({ json: async () => ({ success: false }) })
  const base = { honeypot: '', startedAt: 0, now: 10 ** 9, kind: 'intake' }
  assert.equal((await checkSpam(base, { TURNSTILE_SECRET: 's' }, fake)).ok, true)
  assert.equal((await checkSpam(base, { TURNSTILE_SECRET: 's', TURNSTILE_ENFORCE: '1' }, fake)).reason, 'turnstile')
})
test('#10 Text or Call as the contact method needs a phone number', () => {
  const r = validateIntake({ ...full, contact: 'Text', phone: '' }, { final: true })
  assert.ok(r.errors.some((e) => e.startsWith('phone')))
})
test('#4 a failed lookup aborts the write instead of creating a duplicate row', async () => {
  let posts = 0
  const fake = async (url, opts = {}) => {
    if (!opts.method) return { ok: false, status: 429, json: async () => ({}) }
    posts++
    return { ok: true, json: async () => ({ id: 'recX' }) }
  }
  const r = await createStore({ AIRTABLE_TOKEN: 't', AIRTABLE_BASE_ID: 'app1' }, fake).upsertIntake('abcdef0123456789abcdef0123456789', {})
  assert.equal(r.stored, false)
  assert.equal(posts, 0)
})
test('companion answers are normalised and capped too', async () => {
  const n = normalizeCompanion({ name: 'J', diet: 'x', note: 'n'.repeat(9000), pairs: { pace: 0, junk: 'x' } })
  assert.deepEqual(n.diet, [])
  assert.ok(n.note.length <= LIMITS.text)
  const store = memStore()
  const a = await handleIntake({ method: 'POST', body: { data: { ...full, companions: [{ name: 'Jo' }] }, final: false, meta: {} } }, deps(store))
  const r = await handleCompanion({ method: 'POST', body: { invite: a.json.invites[0].invite, data: { name: 'Jo', diet: 7 }, meta: { startedAt: 0 } } }, deps(store))
  assert.equal(r.status, 200)
})
