import { test } from 'node:test'
import assert from 'node:assert/strict'
import { handleIntake } from '../../api/intake.js'
import { handleCompanion } from '../../api/companion.js'
import { emptyIntake, emptyCompanion } from '../../src/intake/schema.js'

function memStore() {
  const rows = { intake: new Map(), companion: new Map() }
  const s = (k) => ({
    find: async (key) => (rows[k].has(key) ? { stored: true, id: key, fields: rows[k].get(key) } : { stored: false, id: null }),
    upsert: async (key, f) => { rows[k].set(key, { ...(rows[k].get(key) || {}), ...f }); return { stored: true, id: key } },
  })
  return { rows, live: true, findIntake: s('intake').find, upsertIntake: s('intake').upsert, findCompanion: s('companion').find, upsertCompanion: s('companion').upsert }
}
const full = { ...emptyIntake(), name: 'Alex', email: 'a@b.co', dest: 'Lisbon', length: '7 to 9 nights', airport: 'DTW', budget: '$175 to $275', top3: ['Food & drink'], companions: [{ name: 'Jordan' }] }
const deps = (store) => ({ store, env: {}, now: 10 ** 9 })

test('a draft save mints a resume token and stores status Draft', async () => {
  const store = memStore()
  const r = await handleIntake({ method: 'POST', body: { data: { ...emptyIntake(), name: 'A', email: 'a@b.co' }, final: false, meta: { startedAt: 0 } } }, deps(store))
  assert.equal(r.status, 200)
  assert.match(r.json.resume, /^[0-9a-f]{32}$/)
  assert.equal(store.rows.intake.get(r.json.resume).Status, 'Draft')
})
test('the same resume token updates, never duplicates', async () => {
  const store = memStore()
  const a = await handleIntake({ method: 'POST', body: { data: full, final: false, meta: { startedAt: 0 } } }, deps(store))
  await handleIntake({ method: 'POST', body: { resume: a.json.resume, data: full, final: true, meta: { startedAt: 0 } } }, deps(store))
  assert.equal(store.rows.intake.size, 1)
  assert.equal(store.rows.intake.get(a.json.resume).Status, 'New')
})
test('final submit stores hard limits and triage columns', async () => {
  const store = memStore()
  const r = await handleIntake({ method: 'POST', body: { data: { ...full, drive: 'No' }, final: true, meta: { startedAt: 0 } } }, deps(store))
  const row = store.rows.intake.get(r.json.resume)
  assert.equal(row.Destination, 'Lisbon')
  assert.ok(row['Hard limits'].includes('drive'))
})
test('companions get invite tokens and stub rows', async () => {
  const store = memStore()
  const r = await handleIntake({ method: 'POST', body: { data: full, final: false, meta: { startedAt: 0 } } }, deps(store))
  assert.equal(r.json.invites.length, 1)
  assert.equal(store.rows.companion.get(r.json.invites[0].invite).Status, 'Waiting')
})
test('spam is rejected with 422 and nothing stored', async () => {
  const store = memStore()
  const r = await handleIntake({ method: 'POST', body: { data: full, final: true, meta: { honeypot: 'bot', startedAt: 0 } } }, deps(store))
  assert.equal(r.status, 422)
  assert.equal(store.rows.intake.size, 0)
})
test('invalid final data is a 400 with field errors', async () => {
  const r = await handleIntake({ method: 'POST', body: { data: { ...full, airport: '' }, final: true, meta: { startedAt: 0 } } }, deps(memStore()))
  assert.equal(r.status, 400)
})
test('the stub store still answers 200 with stored:false', async () => {
  const stub = { live: false, findIntake: async () => ({ stored: false, id: null }), upsertIntake: async () => ({ stored: false, id: null }), findCompanion: async () => ({ stored: false, id: null }), upsertCompanion: async () => ({ stored: false, id: null }) }
  const r = await handleIntake({ method: 'POST', body: { data: full, final: true, meta: { startedAt: 0 } } }, deps(stub))
  assert.equal(r.status, 200)
  assert.equal(r.json.stored, false)
})
test('resume loads the saved answers', async () => {
  const store = memStore()
  const a = await handleIntake({ method: 'POST', body: { data: full, final: false, meta: { startedAt: 0 } } }, deps(store))
  const r = await handleIntake({ method: 'GET', query: { resume: a.json.resume } }, deps(store))
  assert.equal(r.json.data.dest, 'Lisbon')
})
test('a companion can answer after the organiser already submitted', async () => {
  const store = memStore()
  const a = await handleIntake({ method: 'POST', body: { data: full, final: true, meta: { startedAt: 0 } } }, deps(store))
  const invite = a.json.invites[0].invite
  const g = await handleCompanion({ method: 'GET', query: { invite } }, deps(store))
  assert.deepEqual(g.json, { organiser: 'Alex', dest: 'Lisbon' })
  const r = await handleCompanion({ method: 'POST', body: { invite, data: { ...emptyCompanion(), name: 'Jordan', hike: '1 to 3 hours' }, meta: { startedAt: 0 } } }, deps(store))
  assert.equal(r.json.stored, true)
  assert.equal(store.rows.companion.get(invite).Status, 'Answered')
})
test('an unknown invite is a 404', async () => {
  const r = await handleCompanion({ method: 'GET', query: { invite: 'ffffffffffffffff' } }, deps(memStore()))
  assert.equal(r.status, 404)
})
