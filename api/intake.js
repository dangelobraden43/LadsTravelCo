import { validateIntake } from '../src/intake/schema.js'
import { hardLimits } from '../src/intake/limits.js'
import { mintToken } from './_lib/token.js'
import { checkSpam } from './_lib/spam.js'
import { createStore } from './_lib/store.js'

function triage(d, final) {
  return {
    Status: final ? 'New' : 'Draft',
    Name: d.name, Email: d.email, Phone: d.phone || '',
    Destination: d.destMode === 'help' ? `Help choose: ${d.feels.join(', ')}` : d.dest,
    Dates: d.dateMode === 'fixed' ? `${d.start} to ${d.end}` : `${d.length} in ${d.months.join('/')}`,
    Party: d.adults + d.kids,
    Budget: `${d.budget} ${d.budgetMode === 'day' ? 'per day' : 'per trip'} (${d.firm || 'firmness not given'})`,
    Occasion: d.occasion, Source: d.heard, 'Opt in': Boolean(d.optIn),
    'Hard limits': hardLimits(d, []).map((l) => `• ${l.text}`).join('\n'),
    Answers: JSON.stringify(d),
    ...(final ? { 'Submitted at': new Date().toISOString() } : {}),
  }
}

export async function handleIntake(req, { store, env, now, fetchImpl }) {
  if (req.method === 'GET') {
    const found = await store.findIntake(req.query?.resume)
    if (!found.stored) return { status: 404, json: { error: 'not found' } }
    return { status: 200, json: { data: JSON.parse(found.fields.Answers || '{}'), status: found.fields.Status } }
  }
  if (req.method !== 'POST') return { status: 405, json: { error: 'method' } }
  const { resume: given, data, final, meta = {} } = req.body || {}
  if (!data) return { status: 400, json: { errors: ['data: required'] } }
  const v = validateIntake(data, { final: Boolean(final) })
  if (!v.ok) return { status: 400, json: { errors: v.errors } }
  if (meta.honeypot || final) {
    const spam = await checkSpam({ ...meta, now, kind: 'intake', ip: req.ip }, env, fetchImpl)
    if (!spam.ok) return { status: 422, json: { reason: spam.reason } }
  }
  const resume = /^[0-9a-f]{32}$/.test(given || '') ? given : mintToken()
  const companions = (data.companions || []).map((c) => ({ name: String(c.name || '').slice(0, 60), invite: /^[0-9a-f]{32}$/.test(c.invite || '') ? c.invite : mintToken() }))
  const saved = await store.upsertIntake(resume, triage({ ...data, companions }, Boolean(final)))
  for (const c of companions) {
    const existing = await store.findCompanion(c.invite)
    if (!existing.stored) await store.upsertCompanion(c.invite, { Name: c.name, Intake: resume, Status: 'Waiting' })
  }
  return { status: 200, json: { resume, status: final ? 'new' : 'draft', stored: saved.stored, invites: companions } }
}

export default async function handler(req, res) {
  const out = await handleIntake(
    { method: req.method, query: req.query, body: req.body, ip: req.headers['x-forwarded-for'] },
    { store: createStore(process.env), env: process.env, now: Date.now() },
  )
  res.setHeader('Cache-Control', 'no-store')
  res.status(out.status).json(out.json)
}
