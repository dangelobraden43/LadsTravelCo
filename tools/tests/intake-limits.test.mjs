import { test } from 'node:test'
import assert from 'node:assert/strict'
import { strictest, mergeGroup, hardLimits, budgetCap } from '../../src/intake/limits.js'
import { HIKE_ORDER } from '../../src/intake/options.js'
import { emptyIntake, emptyCompanion } from '../../src/intake/schema.js'

test('strictest picks the most limiting answer and ignores blanks', () => {
  assert.equal(strictest(['3 to 5 hours', '1 to 3 hours', ''], HIKE_ORDER), '1 to 3 hours')
  assert.equal(strictest(['', null], HIKE_ORDER), null)
})
test('group merge takes the strictest hike and names diets by person', () => {
  const org = { ...emptyIntake(), name: 'Alex', hike: '3 to 5 hours', diet: ['None'] }
  const jordan = { ...emptyCompanion(), name: 'Jordan', hike: '1 to 3 hours', diet: ['Vegetarian'], note: 'Bad knee' }
  const g = mergeGroup(org, [jordan])
  assert.equal(g.hike, '1 to 3 hours')
  assert.deepEqual(g.diets, [{ who: 'Jordan', diet: 'Vegetarian' }])
  assert.deepEqual(g.notes, [{ who: 'Jordan', text: 'Bad knee' }])
})
test('a severe allergy with cross-contact becomes a hard limit', () => {
  const i = { ...emptyIntake(), diet: ['Allergy'], allergy: 'Shellfish', severity: 'Severe (anaphylaxis)', crossContact: 'Yes' }
  const l = hardLimits(i, [])
  assert.ok(l.some((x) => x.kind === 'allergy' && x.text.includes('shellfish') && x.text.includes('cross-contact')))
})
test('no driving, motion sickness, a hard budget and passport trouble are hard limits', () => {
  const i = { ...emptyIntake(), drive: 'No', motion: 'Yes', firm: 'A hard limit', budget: '$175 to $275', budgetMode: 'day', passport: 'Not sure' }
  const kinds = hardLimits(i, []).map((x) => x.kind)
  for (const k of ['driving', 'motion', 'budget', 'passport']) assert.ok(kinds.includes(k), k)
})
test('hike limits only appear when outdoors was picked', () => {
  const i = { ...emptyIntake(), hike: '3 to 5 hours', top3: ['Food & drink'] }
  assert.ok(!hardLimits(i, []).some((x) => x.kind === 'hike'))
  assert.ok(hardLimits({ ...i, top3: ['Outdoors & hiking'] }, []).some((x) => x.kind === 'hike'))
})
test('an allergy without a named allergen is not turned into a sentence about "undefined"', () => {
  const l = hardLimits({ ...emptyIntake(), diet: ['Allergy'], allergy: '' }, [])
  assert.ok(l.every((x) => !x.text.includes('undefined')))
})
test('a hard budget names its ceiling, not the whole band', () => {
  assert.equal(budgetCap('$175 to $275'), '$275')
  assert.equal(budgetCap('Under $100'), '$100')
  assert.equal(budgetCap('$400+'), null)
  const l = hardLimits({ ...emptyIntake(), firm: 'A hard limit', budget: '$1,500 to $2,500', budgetMode: 'trip' }, [])
  assert.ok(l.some((x) => x.text === 'Going over $2,500 for the trip, per person'))
})
