import { test } from 'node:test'
import assert from 'node:assert/strict'
import path from 'node:path'
import { isAllowedWrite } from './guard.mjs'

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
