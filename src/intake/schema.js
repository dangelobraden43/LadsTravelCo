import * as O from './options.js'

export function emptyIntake() {
  return {
    name: '',
    email: '',
    phone: '',
    occasion: '',
    heard: '',
    optIn: true,
    destMode: 'know',
    dest: '',
    nearby: 'Yes, show us',
    bases: '',
    feels: [],
    flyFar: '',
    dateMode: 'flex',
    start: '',
    end: '',
    flexDays: '',
    length: '',
    months: [],
    airport: '',
    adults: 2,
    kids: 0,
    ages: [],
    rel: '',
    experience: '',
    firstAbroad: '',
    passport: '',
    split: '',
    companions: [],
    budgetMode: 'day',
    budget: '',
    budgetExact: '',
    firm: '',
    splurge: [],
    save: [],
    pairs: {},
    top3: [],
    also: [],
    more: {},
    perfectDay: '',
    diet: [],
    allergy: '',
    severity: '',
    crossContact: '',
    adventurous: null,
    drinking: '',
    bigDinner: '',
    lodging: [],
    vibe: [],
    sharing: '',
    lightSleepers: '',
    around: [],
    walk: '',
    drive: '',
    travelDay: '',
    earlyTransit: '',
    access: '',
    accessNeeds: [],
    motion: '',
    hike: '',
    altitude: '',
    heat: null,
    points: [],
    openCards: '',
    tenOutOfTen: '',
    mustDo: [],
    avoid: [],
    booked: [],
    loved: '',
    hated: '',
    shareWith: [],
    needBy: '',
    pdf: 'Web guide only',
    contact: 'Email',
  }
}

export function emptyCompanion() {
  return {
    name: '',
    diet: [],
    allergy: '',
    severity: '',
    drinking: '',
    hike: '',
    altitude: '',
    pairs: {},
    top3: [],
    note: '',
    mustDo: '',
  }
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const ISO = /^\d{4}-\d{2}-\d{2}$/
const TOKEN = /^[0-9a-f]{32}$/

/* Caps on anything a stranger can send. Oct 6 review: an uncapped companion list
 * let one request fan out into thousands of Airtable writes. */
export const LIMITS = { text: 2000, item: 200, list: 20, companions: 12, json: 60000 }
const TEXT_CAP = LIMITS.text

const INTEREST_KEYS = Object.keys(O.INTERESTS)
const PAIR_KEYS = O.PAIRS.map((p) => p.key)
/* Multi-select fields keep only values the quiz offers. */
const OPTION_LISTS = {
  feels: O.FEELS,
  months: O.MONTHS,
  ages: O.AGES,
  splurge: O.SPEND_ON,
  save: O.SPEND_ON,
  top3: INTEREST_KEYS,
  also: INTEREST_KEYS,
  diet: O.DIETS,
  lodging: O.LODGING,
  vibe: O.VIBES,
  around: O.AROUND,
  accessNeeds: O.ACCESS_NEEDS,
  points: O.POINTS,
}
const FREE_LISTS = ['mustDo', 'avoid', 'booked', 'shareWith']

const str = (v, cap = LIMITS.text) =>
  typeof v === 'string' || typeof v === 'number' ? String(v).slice(0, cap) : ''
const pick = (v, allowed, max) =>
  Array.isArray(v) ? [...new Set(v.filter((x) => allowed.includes(x)))].slice(0, max) : []
const freeList = (v) =>
  Array.isArray(v)
    ? v
        .filter((x) => typeof x === 'string' && x.trim())
        .map((x) => x.trim().slice(0, LIMITS.item))
        .slice(0, LIMITS.list)
    : []
const tri = (v) => (v === 0 || v === 1 ? v : v === -1 ? -1 : null)
const int = (v, min, max, dflt) => {
  const n = Number(v)
  return Number.isFinite(n) ? Math.min(max, Math.max(min, Math.round(n))) : dflt
}
const pairs = (v) => {
  const out = {}
  if (v && typeof v === 'object' && !Array.isArray(v))
    for (const k of PAIR_KEYS) if (tri(v[k]) !== null) out[k] = tri(v[k])
  return out
}

/* Coerce whatever arrived into the intake shape: known keys only, right types,
 * every string and list capped. Never throws. */
export function normalizeIntake(raw) {
  const r = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {}
  const base = emptyIntake()
  const out = {}
  for (const [k, dflt] of Object.entries(base)) {
    const v = r[k]
    if (OPTION_LISTS[k]) out[k] = pick(v, OPTION_LISTS[k], k === 'top3' ? 3 : 30)
    else if (FREE_LISTS.includes(k)) out[k] = freeList(v)
    else if (k === 'companions') {
      const seen = new Set()
      out[k] = (Array.isArray(v) ? v : [])
        .map((c) => ({
          name: str(c?.name, 60).trim(),
          invite: TOKEN.test(c?.invite || '') ? c.invite : undefined,
        }))
        .filter((c) => c.name && !seen.has(c.name.toLowerCase()) && seen.add(c.name.toLowerCase()))
        .slice(0, LIMITS.companions)
    } else if (k === 'pairs') out[k] = pairs(v)
    else if (k === 'more') {
      out[k] = {}
      if (v && typeof v === 'object' && !Array.isArray(v))
        for (const t of INTEREST_KEYS) if (v[t]) out[k][t] = pick(v[t], O.INTERESTS[t], 10)
    } else if (k === 'adults') out[k] = int(v, 1, 40, 2)
    else if (k === 'kids') out[k] = int(v, 0, 40, 0)
    else if (k === 'adventurous' || k === 'heat') out[k] = tri(v) === -1 ? null : tri(v)
    else if (k === 'optIn') out[k] = v === undefined ? dflt : Boolean(v)
    else out[k] = v === undefined || v === null ? dflt : str(v)
  }
  return out
}

export function normalizeCompanion(raw) {
  const r = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {}
  return {
    name: str(r.name, 60).trim(),
    diet: pick(r.diet, O.DIETS, 10),
    allergy: str(r.allergy, LIMITS.item),
    severity: str(r.severity, LIMITS.item),
    drinking: str(r.drinking, LIMITS.item),
    hike: str(r.hike, LIMITS.item),
    altitude: str(r.altitude, LIMITS.item),
    pairs: pairs(r.pairs),
    top3: pick(r.top3, INTEREST_KEYS, 3),
    note: str(r.note),
    mustDo: str(r.mustDo, LIMITS.item),
  }
}

function textFields(o) {
  return Object.entries(o).filter(([, v]) => typeof v === 'string')
}

export function validateIntake(i, { final }) {
  const errors = []
  if (!i.name || !i.name.trim()) errors.push('name: required')
  if (!EMAIL.test(i.email || '')) errors.push('email: not a valid address')
  if (JSON.stringify(i).length > LIMITS.json) errors.push('answers: too long')
  if (final && (i.contact === 'Text' || i.contact === 'Call') && !String(i.phone || '').trim())
    errors.push('phone: needed to text or call you')
  for (const [k, v] of textFields(i))
    if (v.length > TEXT_CAP) errors.push(`${k}: longer than ${TEXT_CAP} characters`)
  for (const list of ['mustDo', 'avoid', 'booked', 'shareWith']) {
    if ((i[list] || []).length > 20) errors.push(`${list}: more than 20 entries`)
  }
  if (final) {
    if (i.destMode === 'know' && !i.dest.trim()) errors.push('dest: required')
    if (i.destMode === 'help' && !i.feels.length) errors.push('feels: pick at least one')
    if (i.dateMode === 'fixed') {
      if (!ISO.test(i.start) || !ISO.test(i.end)) errors.push('dates: both required')
      else if (i.end < i.start) errors.push('dates: return is before departure')
    } else if (!i.length) errors.push('length: required')
    if (!i.airport) errors.push('airport: required')
    if (!(i.adults >= 1)) errors.push('adults: at least one')
    if (!i.budget) errors.push('budget: required')
    const known = Object.keys(O.INTERESTS)
    if (!i.top3.length || i.top3.length > 3) errors.push('top3: pick one to three')
    if (i.top3.some((t) => !known.includes(t))) errors.push('top3: unknown interest')
  }
  return { ok: errors.length === 0, errors }
}

export function validateCompanion(c) {
  const errors = []
  if (!c.name || !c.name.trim()) errors.push('name: required')
  for (const [k, v] of textFields(c))
    if (v.length > TEXT_CAP) errors.push(`${k}: longer than ${TEXT_CAP} characters`)
  return { ok: errors.length === 0, errors }
}
