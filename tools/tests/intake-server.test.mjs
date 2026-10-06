import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mintToken } from '../../api/_lib/token.js'
import { checkSpam, MIN_MS } from '../../api/_lib/spam.js'
import { createStore } from '../../api/_lib/store.js'

test('tokens are 128-bit hex and unique', () => {
  const a = mintToken(), b = mintToken()
  assert.match(a, /^[0-9a-f]{32}$/)
  assert.notEqual(a, b)
})
test('a filled honeypot is spam', async () => {
  assert.deepEqual(await checkSpam({ honeypot: 'x', startedAt: 0, now: 999999, kind: 'intake' }, {}), { ok: false, reason: 'honeypot' })
})
test('a final intake faster than the minimum is spam', async () => {
  const r = await checkSpam({ honeypot: '', startedAt: 1000, now: 1000 + MIN_MS.intake - 1, kind: 'intake' }, {})
  assert.equal(r.reason, 'too-fast')
})
test('turnstile is skipped without a secret and enforced with one', async () => {
  const ok = await checkSpam({ honeypot: '', startedAt: 0, now: 10 ** 9, kind: 'intake' }, {})
  assert.equal(ok.ok, true)
  const fake = async () => ({ json: async () => ({ success: false }) })
  const r = await checkSpam({ honeypot: '', startedAt: 0, now: 10 ** 9, kind: 'intake', turnstile: 't' }, { TURNSTILE_SECRET: 's', TURNSTILE_ENFORCE: '1' }, fake)
  assert.equal(r.reason, 'turnstile')
})
test('without credentials the store is a stub that stores nothing and never throws', async () => {
  const s = createStore({})
  assert.equal(s.live, false)
  assert.deepEqual(await s.upsertIntake('abc', { Name: 'A' }), { stored: false, id: null })
  assert.deepEqual(await s.findIntake('abc'), { stored: false, id: null })
})
test('with credentials, upsert updates an existing row instead of duplicating', async () => {
  const calls = []
  const fake = async (url, opts = {}) => {
    calls.push([opts.method || 'GET', url])
    if (!opts.method) return { ok: true, json: async () => ({ records: [{ id: 'rec1', fields: { Resume: 'abc' } }] }) }
    return { ok: true, json: async () => ({ id: 'rec1', fields: {} }) }
  }
  const s = createStore({ AIRTABLE_TOKEN: 't', AIRTABLE_BASE_ID: 'app1' }, fake)
  const r = await s.upsertIntake('abcdef0123456789abcdef0123456789', { Name: 'A' })
  assert.equal(r.id, 'rec1')
  assert.equal(calls.filter(([m]) => m === 'POST').length, 0)
  assert.equal(calls.filter(([m]) => m === 'PATCH').length, 1)
})
test('an Airtable error resolves stored:false rather than throwing', async () => {
  const fake = async () => ({ ok: false, status: 500, json: async () => ({}) })
  const s = createStore({ AIRTABLE_TOKEN: 't', AIRTABLE_BASE_ID: 'app1' }, fake)
  assert.equal((await s.upsertIntake('abcdef0123456789abcdef0123456789', {})).stored, false)
})
test('a resume token with a quote cannot break the Airtable formula', async () => {
  let seen = ''
  const fake = async (url) => { seen = decodeURIComponent(url); return { ok: true, json: async () => ({ records: [] }) } }
  await createStore({ AIRTABLE_TOKEN: 't', AIRTABLE_BASE_ID: 'app1' }, fake).findIntake("x' OR 1=1")
  assert.ok(!seen.includes("'x' OR"))
})
