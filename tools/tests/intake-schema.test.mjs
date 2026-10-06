import { test } from 'node:test'
import assert from 'node:assert/strict'
import { emptyIntake, validateIntake, emptyCompanion, validateCompanion } from '../../src/intake/schema.js'

const filled = () => ({ ...emptyIntake(), name: 'Alex', email: 'alex@example.com', destMode: 'know', dest: 'Lisbon', dateMode: 'flex', length: '7 to 9 nights', months: ['Apr'], airport: 'DTW', adults: 4, budget: '$175 to $275', top3: ['Food & drink'] })

test('a draft only needs a name and a valid email', () => {
  assert.equal(validateIntake({ ...emptyIntake(), name: 'A', email: 'a@b.co' }, { final: false }).ok, true)
  assert.equal(validateIntake({ ...emptyIntake(), name: 'A', email: 'nope' }, { final: false }).ok, false)
})
test('a final submit needs the trip basics', () => {
  assert.equal(validateIntake(filled(), { final: true }).ok, true)
  const r = validateIntake({ ...filled(), airport: '' }, { final: true })
  assert.equal(r.ok, false)
  assert.ok(r.errors.some((e) => e.includes('airport')))
})
test('help-me-choose needs at least one feel instead of a destination', () => {
  assert.equal(validateIntake({ ...filled(), destMode: 'help', dest: '', feels: [] }, { final: true }).ok, false)
  assert.equal(validateIntake({ ...filled(), destMode: 'help', dest: '', feels: ['Sun and water'] }, { final: true }).ok, true)
})
test('fixed dates must be real and in order', () => {
  assert.equal(validateIntake({ ...filled(), dateMode: 'fixed', start: '2027-04-26', end: '2027-04-18' }, { final: true }).ok, false)
  assert.equal(validateIntake({ ...filled(), dateMode: 'fixed', start: '2027-04-18', end: '2027-04-26' }, { final: true }).ok, true)
})
test('top 3 holds one to three interests, no unknown values', () => {
  assert.equal(validateIntake({ ...filled(), top3: [] }, { final: true }).ok, false)
  assert.equal(validateIntake({ ...filled(), top3: ['Juggling'] }, { final: true }).ok, false)
})
test('free-text fields are capped so a paste cannot flood Airtable', () => {
  assert.equal(validateIntake({ ...filled(), perfectDay: 'x'.repeat(2001) }, { final: true }).ok, false)
})
test('a companion needs only a name', () => {
  assert.equal(validateCompanion({ ...emptyCompanion(), name: 'Jordan' }).ok, true)
  assert.equal(validateCompanion(emptyCompanion()).ok, false)
})
