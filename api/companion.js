import { normalizeCompanion, validateCompanion } from '../src/intake/schema.js'
import { checkSpam } from './_lib/spam.js'
import { createStore } from './_lib/store.js'

const TOKEN = /^[0-9a-f]{32}$/

export async function handleCompanion(req, { store, env, now, fetchImpl }) {
  const invite = req.method === 'GET' ? req.query?.invite : req.body?.invite
  if (!TOKEN.test(invite || '')) return { status: 404, json: { error: 'not found' } }
  const row = await store.findCompanion(invite)
  if (row.error) return { status: 502, json: { error: 'lookup failed' } }
  if (!row.stored) return { status: 404, json: { error: 'not found' } }

  if (req.method === 'GET') {
    const intake = await store.findIntake(row.fields.Intake)
    let answers = {}
    try {
      answers = intake.stored ? JSON.parse(intake.fields.Answers || '{}') : {}
    } catch {
      answers = {}
    }
    /* First name and destination only: a companion link must not expose the organiser's details. */
    return { status: 200, json: { organiser: String(answers.name || ''), dest: answers.destMode === 'help' ? '' : String(answers.dest || '') } }
  }
  if (req.method !== 'POST') return { status: 405, json: { error: 'method' } }

  const { meta = {} } = req.body || {}
  const data = normalizeCompanion(req.body?.data)
  const v = validateCompanion(data)
  if (!v.ok) return { status: 400, json: { errors: v.errors } }
  const spam = await checkSpam({ ...meta, now, kind: 'companion', ip: req.ip }, env, fetchImpl)
  if (!spam.ok) return { status: 422, json: { reason: spam.reason } }
  const saved = await store.upsertCompanion(invite, { Name: data.name, Status: 'Answered', Answers: JSON.stringify(data), 'Answered at': new Date(now).toISOString() })
  if (store.live && !saved.stored) return { status: 502, json: { error: 'save failed' } }
  return { status: 200, json: { stored: saved.stored } }
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  try {
    const out = await handleCompanion(
      { method: req.method, query: req.query, body: req.body, ip: req.headers['x-forwarded-for'] },
      { store: createStore(process.env), env: process.env, now: Date.now() },
    )
    res.status(out.status).json(out.json)
  } catch {
    res.status(500).json({ error: 'unexpected' })
  }
}
