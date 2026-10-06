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
const TEXT_CAP = 2000
const ISO = /^\d{4}-\d{2}-\d{2}$/

function textFields(o) {
  return Object.entries(o).filter(([, v]) => typeof v === 'string')
}

export function validateIntake(i, { final }) {
  const errors = []
  if (!i.name || !i.name.trim()) errors.push('name: required')
  if (!EMAIL.test(i.email || '')) errors.push('email: not a valid address')
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
