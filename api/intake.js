import { normalizeIntake, validateIntake } from '../src/intake/schema.js'
import { hardLimits } from '../src/intake/limits.js'
import { mintToken } from './_lib/token.js'
import { checkSpam } from './_lib/spam.js'
import { createStore } from './_lib/store.js'

const TOKEN = /^[0-9a-f]{32}$/
/* Statuses the client may set. Anything else in Airtable was set by a founder and
 * is never overwritten from the site (Oct 6 review #6). */
const CLIENT_STATUSES = ['Draft']

function triage(d) {
  return {
    Name: d.name,
    Email: d.email,
    Phone: d.phone,
    Destination: d.destMode === 'help' ? `Help choose: ${d.feels.join(', ')}` : d.dest,
    Dates: d.dateMode === 'fixed' ? `${d.start} to ${d.end}` : `${d.length} in ${d.months.join('/')}`,
    Party: d.adults + d.kids,
    Budget: `${d.budget} ${d.budgetMode === 'day' ? 'per day' : 'per trip'} (${d.firm || 'firmness not given'})`,
    Occasion: d.occasion,
    Source: d.heard,
    'Opt in': Boolean(d.optIn),
    'Hard limits': hardLimits(d, [])
      .map((l) => `• ${l.text}`)
      .join('\n'),
    Answers: JSON.stringify(d),
  }
}

export async function handleIntake(req, { store, env, now, fetchImpl }) {
  if (req.method === 'GET') {
    const resume = req.query?.resume
    if (!TOKEN.test(resume || '')) return { status: 404, json: { error: 'not found' } }
    const found = await store.findIntake(resume)
    if (found.error) return { status: 502, json: { error: 'lookup failed' } }
    if (!found.stored) return { status: 404, json: { error: 'not found' } }
    return { status: 200, json: { data: normalizeIntake(JSON.parse(found.fields.Answers || '{}')), status: found.fields.Status } }
  }
  if (req.method !== 'POST') return { status: 405, json: { error: 'method' } }

  const { resume: given, final: rawFinal, meta = {} } = req.body || {}
  const final = rawFinal === true
  if (!req.body?.data) return { status: 400, json: { errors: ['data: required'] } }
  const data = normalizeIntake(req.body.data)
  const v = validateIntake(data, { final })
  if (!v.ok) return { status: 400, json: { errors: v.errors } }
  if (meta.honeypot || final) {
    const spam = await checkSpam({ ...meta, now, kind: 'intake', ip: req.ip }, env, fetchImpl)
    if (!spam.ok) return { status: 422, json: { reason: spam.reason } }
  }

  const resume = TOKEN.test(given || '') ? given : mintToken()
  const existing = TOKEN.test(given || '') ? await store.findIntake(resume) : { stored: false }
  if (existing.error) return { status: 502, json: { error: 'lookup failed' } }
  const current = existing.stored ? existing.fields?.Status : null
  const clientOwned = !current || CLIENT_STATUSES.includes(current)

  const companions = data.companions.map((c) => ({ name: c.name, invite: c.invite || mintToken() }))
  const fields = triage({ ...data, companions })
  if (clientOwned) {
    fields.Status = final ? 'New' : 'Draft'
    if (final) fields['Submitted at'] = new Date(now).toISOString()
  }
  const saved = await store.upsertIntake(resume, fields)
  if (store.live && !saved.stored) return { status: 502, json: { error: 'save failed' } }

  for (const c of companions) {
    const row = await store.findCompanion(c.invite)
    if (!row.stored && !row.error) await store.upsertCompanion(c.invite, { Name: c.name, Intake: resume, Status: 'Waiting' })
  }
  const status = clientOwned ? (final ? 'new' : 'draft') : 'received'
  return { status: 200, json: { resume, status, stored: saved.stored, invites: companions } }
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  try {
    const out = await handleIntake(
      { method: req.method, query: req.query, body: req.body, ip: req.headers['x-forwarded-for'] },
      { store: createStore(process.env), env: process.env, now: Date.now() },
    )
    res.status(out.status).json(out.json)
  } catch {
    res.status(500).json({ error: 'unexpected' })
  }
}
