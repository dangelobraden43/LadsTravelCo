import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync, utimesSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { findLatestOutput, outputNameFor, decide, agentFrom, hookOutput, currentRunDir, outputFor } from './hook-validate.mjs'

/* Review #3: the stop hook must check THIS run, never an older run's file. */
function runsTree() {
  const root = mkdtempSync(path.join(tmpdir(), 'lads-runs-'))
  const mkRun = (dest, run, ageMs, files = []) => {
    const d = path.join(root, dest, run); mkdirSync(d, { recursive: true })
    const t = (Date.now() - ageMs) / 1000
    for (const f of ['RUN.json', ...files]) { const p = path.join(d, f); writeFileSync(p, '{}'); utimesSync(p, t, t) }
    return d
  }
  return { root, mkRun }
}
test('currentRunDir: the run with the newest RUN.json wins', () => {
  const { root, mkRun } = runsTree()
  mkRun('vancouver', 'r1', 60 * 60e3)
  const newest = mkRun('pictured-rocks', 'r2', 5_000)
  assert.equal(currentRunDir(root, { now: Date.now(), maxAgeMs: 6 * 3600e3 }), newest)
})
test('outputFor: an older run holding the file does not satisfy the current run', () => {
  const { root, mkRun } = runsTree()
  mkRun('vancouver', 'r1', 60 * 60e3, ['lads-flights.json'])
  const cur = mkRun('pictured-rocks', 'r2', 5_000)
  const o = outputFor(root, 'lads-flights', { now: Date.now(), maxAgeMs: 6 * 3600e3 })
  assert.equal(o.runDir, cur)
  assert.equal(o.file, null)
})
test('outputFor: finds the file in the current run', () => {
  const { root, mkRun } = runsTree()
  const cur = mkRun('pictured-rocks', 'r2', 5_000, ['lads-flights.json'])
  assert.equal(outputFor(root, 'lads-flights', { now: Date.now(), maxAgeMs: 6 * 3600e3 }).file, path.join(cur, 'lads-flights.json'))
})
test('outputFor: no recent RUN.json falls back to the newest output file (manual runs)', () => {
  const { root } = runsTree()
  const d = path.join(root, 'x', 'y'); mkdirSync(d, { recursive: true }); writeFileSync(path.join(d, 'lads-flights.json'), '{}')
  assert.equal(outputFor(root, 'lads-flights', { now: Date.now(), maxAgeMs: 6 * 3600e3 }).file, path.join(d, 'lads-flights.json'))
})

test('hookOutput: a block becomes {decision:"block", reason}; a release prints nothing', () => {
  assert.deepEqual(hookOutput({ exit: 2, message: 'fix it', writeInvalid: false }), { decision: 'block', reason: 'fix it' })
  assert.equal(hookOutput({ exit: 0, message: '', writeInvalid: false }), null)
  assert.equal(hookOutput({ exit: 0, message: 'bad', writeInvalid: true }), null)
})

test('agentFrom: reads the Lads agent from the SubagentStop payload, ignores others', () => {
  assert.equal(agentFrom({ agent_type: 'lads-flights' }, []), 'lads-flights')
  assert.equal(agentFrom({ agent_type: 'general-purpose' }, []), null)
  assert.equal(agentFrom({}, []), null)
  assert.equal(agentFrom({}, ['lads-costs-budget']), 'lads-costs-budget')
})

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
