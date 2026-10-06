import { test } from 'node:test'
import assert from 'node:assert/strict'
import { reduceIntake, serializeDraft, parseDraft } from '../../src/intake/draft.js'
import { emptyIntake } from '../../src/intake/schema.js'

const s0 = emptyIntake()
test('toggle adds and removes; None clears the rest', () => {
  let s = reduceIntake(s0, { type: 'toggle', key: 'diet', value: 'Vegan' })
  s = reduceIntake(s, { type: 'toggle', key: 'diet', value: 'Allergy' })
  assert.deepEqual(s.diet, ['Vegan', 'Allergy'])
  s = reduceIntake(s, { type: 'toggle', key: 'diet', value: 'None' })
  assert.deepEqual(s.diet, ['None'])
  s = reduceIntake(s, { type: 'toggle', key: 'diet', value: 'Vegan' })
  assert.deepEqual(s.diet, ['Vegan'])
})
test('toggle with max drops the oldest pick', () => {
  let s = s0
  for (const v of ['Food', 'Nightlife', 'Where we sleep']) s = reduceIntake(s, { type: 'toggle', key: 'splurge', value: v, max: 2 })
  assert.deepEqual(s.splurge, ['Nightlife', 'Where we sleep'])
})
test('rank keeps order, caps at three, and removes from also-into', () => {
  let s = { ...s0, also: ['Beaches'] }
  for (const v of ['Beaches', 'Food & drink', 'Day trips', 'Photography']) s = reduceIntake(s, { type: 'rank', key: 'top3', value: v })
  assert.deepEqual(s.top3, ['Beaches', 'Food & drink', 'Day trips'])
  assert.deepEqual(s.also, [])
  s = reduceIntake(s, { type: 'rank', key: 'top3', value: 'Food & drink' })
  assert.deepEqual(s.top3, ['Beaches', 'Day trips'])
})
test('count respects its minimum', () => {
  const s = reduceIntake({ ...s0, adults: 1 }, { type: 'count', key: 'adults', delta: -1, min: 1 })
  assert.equal(s.adults, 1)
})
test('a draft round-trips and a corrupt one is ignored', () => {
  const str = serializeDraft({ data: { ...s0, name: 'Alex' }, step: 3, resume: 'a'.repeat(32), startedAt: 5 })
  assert.equal(parseDraft(str).data.name, 'Alex')
  assert.equal(parseDraft('{not json'), null)
  assert.equal(parseDraft(JSON.stringify({ v: 999 })), null)
})
