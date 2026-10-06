import { validateCompanion } from '../src/intake/schema.js'
import { checkSpam } from './_lib/spam.js'
import { createStore } from './_lib/store.js'

export async function handleCompanion(req, { store, env, now, fetchImpl }) {
  const invite = req.method === 'GET' ? req.query?.invite : req.body?.invite
  const row = await store.findCompanion(invite)
  if (!row.stored) return { status: 404, json: { error: 'not found' } }
  const intake = await store.findIntake(row.fields.Intake)
  const answers = intake.stored ? JSON.parse(intake.fields.Answers || '{}') : {}
  if (req.method === 'GET') {
    return { status: 200, json: { organiser: answers.name || '', dest: answers.destMode === 'help' ? '' : answers.dest || '' } }
  }
  if (req.method !== 'POST') return { status: 405, json: { error: 'method' } }
  const { data, meta = {} } = req.body || {}
  const v = validateCompanion(data || {})
  if (!v.ok) return { status: 400, json: { errors: v.errors } }
  const spam = await checkSpam({ ...meta, now, kind: 'companion', ip: req.ip }, env, fetchImpl)
  if (!spam.ok) return { status: 422, json: { reason: spam.reason } }
  const saved = await store.upsertCompanion(invite, { Name: data.name, Status: 'Answered', Answers: JSON.stringify(data), 'Answered at': new Date().toISOString() })
  return { status: 200, json: { stored: saved.stored } }
}

export default async function handler(req, res) {
  const out = await handleCompanion(
    { method: req.method, query: req.query, body: req.body, ip: req.headers['x-forwarded-for'] },
    { store: createStore(process.env), env: process.env, now: Date.now() },
  )
  res.setHeader('Cache-Control', 'no-store')
  res.status(out.status).json(out.json)
}
