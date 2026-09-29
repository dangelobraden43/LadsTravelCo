import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync, utimesSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { findLatestOutput, outputNameFor, decide } from './hook-validate.mjs'

function tree() {
  const root = mkdtempSync(path.join(tmpdir(), 'lads-research-'))
  const mk = (dest, run, name, ageMs) => {
    const d = path.join(root, dest, run); mkdirSync(d, { recursive: true })
    const f = path.join(d, name); writeFileSync(f, '{}')
    const t = (Date.now() - ageMs) / 1000; utimesSync(f, t, t)
    return f
  }
  return { root, mk }
}

test('outputNameFor', () => {
  assert.equal(outputNameFor('lads-flights'), 'lads-flights.json')
  assert.equal(outputNameFor('lads-trip-architect'), 'PACKET.md')
})
test('finds the newest file for this agent across destinations and runs', () => {
  const { root, mk } = tree()
  mk('vancouver', 'r1', 'lads-flights.json', 60_000)
  const newer = mk('pictured-rocks', 'r2', 'lads-flights.json', 1_000)
  mk('pictured-rocks', 'r2', 'lads-costs-budget.json', 0)
  assert.equal(findLatestOutput(root, 'lads-flights', { now: Date.now(), maxAgeMs: 3 * 3600e3 }), newer)
})
test('ignores files older than maxAge', () => {
  const { root, mk } = tree()
  mk('vancouver', 'r1', 'lads-flights.json', 5 * 3600e3)
  assert.equal(findLatestOutput(root, 'lads-flights', { now: Date.now(), maxAgeMs: 3 * 3600e3 }), null)
})
test('missing root returns null', () => {
  assert.equal(findLatestOutput(path.join(tmpdir(), 'nope-' + Date.now()), 'lads-x', { now: Date.now(), maxAgeMs: 1 }), null)
})
test('decide: valid output releases the agent', () => {
  assert.deepEqual(decide({ file: 'f', errors: [], stopHookActive: false }), { exit: 0, message: '', writeInvalid: false })
})
test('decide: invalid output blocks the first time', () => {
  const d = decide({ file: 'f', errors: ['bad'], stopHookActive: false })
  assert.equal(d.exit, 2); assert.match(d.message, /bad/); assert.equal(d.writeInvalid, false)
})
test('decide: invalid output on the retry releases and records INVALID (no infinite loop)', () => {
  const d = decide({ file: 'f', errors: ['bad'], stopHookActive: true })
  assert.equal(d.exit, 0); assert.equal(d.writeInvalid, true)
})
test('decide: no file blocks once, then releases with INVALID', () => {
  assert.equal(decide({ file: null, errors: [], stopHookActive: false }).exit, 2)
  assert.equal(decide({ file: null, errors: [], stopHookActive: true }).exit, 0)
})
