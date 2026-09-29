import { test } from 'node:test'
import assert from 'node:assert/strict'
import path from 'node:path'
import { isAllowedWrite, shouldGuard, guardDecision, main as guardMain } from './guard.mjs'
import { main as stopMain } from './hook-validate.mjs'

test('both hook scripts export main() for the cwd-independent launcher', () => {
  assert.equal(typeof guardMain, 'function')
  assert.equal(typeof stopMain, 'function')
})

const ROOT0 = path.resolve('C:/Users/brady/lads-travel-co')
test('guardDecision: a Lads agent writing src/data gets a structured deny', () => {
  const out = guardDecision({ agent_type: 'lads-flights', tool_name: 'Write', tool_input: { file_path: 'src/data/x.js' } }, ROOT0)
  assert.equal(out.hookSpecificOutput.hookEventName, 'PreToolUse')
  assert.equal(out.hookSpecificOutput.permissionDecision, 'deny')
  assert.match(out.hookSpecificOutput.permissionDecisionReason, /internal\/research/)
})
test('guardDecision: allowed writes and non-Lads sessions return null', () => {
  assert.equal(guardDecision({ agent_type: 'lads-flights', tool_name: 'Write', tool_input: { file_path: 'internal/research/v/r/x.json' } }, ROOT0), null)
  assert.equal(guardDecision({ tool_name: 'Write', tool_input: { file_path: 'src/data/x.js' } }, ROOT0), null)
})

test('shouldGuard: only Lads research agents are guarded, never the main session', () => {
  assert.equal(shouldGuard({ agent_type: 'lads-costs-budget', tool_name: 'Write' }), true)
  assert.equal(shouldGuard({ agent_type: 'lads-verifier', tool_name: 'Edit' }), true)
  assert.equal(shouldGuard({ tool_name: 'Write' }), false)
  assert.equal(shouldGuard({ agent_type: 'general-purpose', tool_name: 'Write' }), false)
  assert.equal(shouldGuard({ agent_type: 'lads-costs-budget', tool_name: 'Read' }), false)
})

const ROOT = path.resolve('C:/Users/brady/lads-travel-co')

test('staging and agent memory are allowed', () => {
  assert.equal(isAllowedWrite('internal/research/vancouver/r1/lads-flights.json', ROOT), true)
  assert.equal(isAllowedWrite('.claude/agent-memory/lads-flights/MEMORY.md', ROOT), true)
})
test('absolute Windows paths with backslashes are handled', () => {
  assert.equal(isAllowedWrite(ROOT + '\\internal\\research\\v\\r\\x.json', ROOT), true)
  assert.equal(isAllowedWrite(ROOT + '\\src\\data\\dublin.js', ROOT), false)
})
test('mixed case on Windows still matches the allowed prefix', () => {
  if (process.platform !== 'win32') return
  assert.equal(isAllowedWrite(ROOT.toUpperCase() + '\\INTERNAL\\research\\v\\x.json', ROOT), true)
})
test('src/data, CLAUDE.md and the repo root are blocked', () => {
  assert.equal(isAllowedWrite('src/data/dublin.js', ROOT), false)
  assert.equal(isAllowedWrite('CLAUDE.md', ROOT), false)
  assert.equal(isAllowedWrite('.claude/agents/lads-flights.md', ROOT), false)
  assert.equal(isAllowedWrite('internal/brady/vancouver-enrichment.md', ROOT), false)
})
test('.. escapes are blocked', () => {
  assert.equal(isAllowedWrite('internal/research/../../src/data/x.js', ROOT), false)
  assert.equal(isAllowedWrite('../elsewhere/internal/research/x.json', ROOT), false)
})
test('a prefix look-alike is blocked', () => {
  assert.equal(isAllowedWrite('internal/research-evil/x.json', ROOT), false)
})
test('empty path is blocked', () => {
  assert.equal(isAllowedWrite('', ROOT), false)
  assert.equal(isAllowedWrite(undefined, ROOT), false)
})
