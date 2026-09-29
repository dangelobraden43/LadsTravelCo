import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { parseFrontmatter, readAgents, publicAgents } from './agents-manifest.mjs'

const AGENT = (name, pub = 'true', label = 'costs') => `---
name: ${name}
description: "Researches costs."
tools: WebSearch, WebFetch, Read, Glob, Grep, Write
model: sonnet
memory: project
skills:
  - research-contract
lads-public: ${pub}
lads-label: ${label}
hooks:
  Stop:
    - hooks:
        - type: command
          command: node tools/research/hook-validate.mjs ${name}
---
Body text.
`

test('parseFrontmatter reads scalars and top-level lists, ignores nested blocks', () => {
  const fm = parseFrontmatter(AGENT('lads-costs-budget'))
  assert.equal(fm.name, 'lads-costs-budget')
  assert.equal(fm.description, 'Researches costs.')
  assert.deepEqual(fm.skills, ['research-contract'])
  assert.equal(fm['lads-public'], 'true')
  assert.equal(fm.command, undefined)
})
test('parseFrontmatter tolerates CRLF line endings', () => {
  const fm = parseFrontmatter(AGENT('lads-a').replace(/\n/g, '\r\n'))
  assert.equal(fm.name, 'lads-a')
  assert.deepEqual(fm.skills, ['research-contract'])
})
test('readAgents + publicAgents on a fixture dir', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'lads-agents-'))
  writeFileSync(path.join(dir, 'lads-a.md'), AGENT('lads-a'))
  writeFileSync(path.join(dir, 'lads-b.md'), AGENT('lads-b', 'false', 'x'))
  writeFileSync(path.join(dir, 'notes.txt'), 'ignored')
  const all = readAgents(dir)
  assert.equal(all.length, 2)
  assert.deepEqual(all.map((a) => a.tools.length), [6, 6])
  assert.deepEqual(publicAgents(all).map((a) => a.name), ['lads-a'])
})
test('missing dir yields an empty roster', () => {
  assert.deepEqual(readAgents(path.join(tmpdir(), 'none-' + Date.now())), [])
})

/* ROSTER INVARIANTS — run against the real .claude/agents once Task 6 lands.
 * Skipped until the directory has agents, so Task 5 can land first. */
const REAL = readAgents(path.resolve('.claude/agents'))
const EXPECTED = [
  'lads-provenance', 'lads-destination-scout', 'lads-stay-neighborhoods', 'lads-parks-trails',
  'lads-timing-events', 'lads-flights', 'lads-getting-around', 'lads-costs-budget',
  'lads-rewards-points', 'lads-deals-savings', 'lads-bookings-tickets', 'lads-entry-essentials',
  'lads-verifier', 'lads-trip-architect',
]
test('roster: exactly the 14 agents in the spec', { skip: REAL.length === 0 }, () => {
  assert.deepEqual(REAL.map((a) => a.name).sort(), [...EXPECTED].sort())
})
test('roster: every agent is wired to the contract, memory and both hooks', { skip: REAL.length === 0 }, () => {
  for (const a of REAL) {
    assert.equal(path.basename(a.file, '.md'), a.name, `${a.name}: filename`)
    assert.ok(a.description.length > 40, `${a.name}: description`)
    assert.ok(['sonnet', 'opus'].includes(a.model), `${a.name}: model`)
    assert.ok(a.skills.includes('research-contract'), `${a.name}: preloads research-contract`)
    assert.equal(a.memory, 'project', `${a.name}: memory`)
    assert.ok(!a.tools.includes('Edit') && !a.tools.includes('Bash'), `${a.name}: no Edit/Bash`)
    assert.ok(a.raw.includes('node tools/research/guard.mjs'), `${a.name}: PreToolUse guard`)
    assert.ok(a.raw.includes(`node tools/research/hook-validate.mjs ${a.name}`), `${a.name}: Stop validator`)
  }
})
test('roster: 13 public research agents, architect excluded, all labelled', { skip: REAL.length === 0 }, () => {
  const pub = publicAgents(REAL)
  assert.equal(pub.length, 13)
  assert.ok(!pub.some((a) => a.name === 'lads-trip-architect'))
  for (const a of pub) assert.ok(a.label, `${a.name}: lads-label`)
})
test('roster: only the architect lacks web tools', { skip: REAL.length === 0 }, () => {
  for (const a of REAL) {
    const web = a.tools.includes('WebSearch') && a.tools.includes('WebFetch')
    assert.equal(web, a.name !== 'lads-trip-architect', `${a.name}: web tools`)
  }
})
