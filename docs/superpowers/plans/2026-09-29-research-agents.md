# Lads Research Agents Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fourteen real, version-controlled Claude Code research agents covering every part of trip planning, held to one machine-checked output contract, orchestrated by `/research`, proven on a walked-list city (Vancouver) and an unvisited national park (Pictured Rocks), with the homepage agent count derived from the agent files.

**Architecture:** Agents are `.claude/agents/lads-*.md` files that preload one shared `research-contract` skill and carry two hooks: a `PreToolUse` path guard (writes only to `internal/research/` and `.claude/agent-memory/`) and a `Stop` validator that rejects malformed output. The main session runs `/research`, which dispatches agents in pairs, then the verifier, then the trip-architect, producing `internal/research/<dest>/<runId>/PACKET.md` for founder review. A build-time Vite plugin counts public agents for the homepage.

**Tech Stack:** Claude Code 2.1.284 subagents/skills/hooks · Node 24 (`node:test`, no new deps) · Vite plugin (existing `ladsCanonicalStats`) · React (`App.jsx`).

**Spec:** `docs/superpowers/specs/2026-09-29-research-agents-design.md`

## Global Constraints

- Agents research; founders validate. No agent writes `ladsTake`, `ladsRating`, `validated`, `forWho`, `story`, or first-person Lads voice.
- No agent may write to `src/data/` or anywhere outside `internal/research/` and `.claude/agent-memory/` (guard-enforced).
- Every finding: ≥1 source with `url` + `checkedOn`; researched mode: ≥2 distinct source hosts for kinds `range, requirement, promo, route, window, product`.
- Money: ranges with ISO currency; a single amount only when `fixedPrice: true` AND a source of kind `official|government`. Our own prices appear nowhere.
- `kind: "promo"` requires `datedUntil` ≥ today. `kind: "window"` requires `driver` ∈ `weather|events|pricing|logistics`.
- Never mention insurance. Never charity content. Tivoli rule: never resolve a place from a bare string.
- Staging lives in `internal/research/` (already gitignored via `internal/`). Agent memory lives in `.claude/agent-memory/` and IS committed.
- Concurrency: two agents at a time. Per-agent WebSearch budget comes from `RUN.json` (default 12; verifier 20).
- No emoji or astral-plane characters in `.jsx` (rolldown rejects them). `.md` and `.mjs` under `tools/` are fine.
- Use the Write tool for any file containing backslashes or heavy punctuation; never a Bash heredoc.
- Checkpoint rule: every verified task commits AND pushes to `feature/research-agents`. CLAUDE.md record ships in the same push as the merge.
- `npm run build` must pass before any commit that touches `src/` or `vite.config.js`.

## Review Focus

1. **A malformed or missing output file makes the Stop hook loop forever** — expected: on the second failure (`stop_hook_active: true`) the hook lets the agent stop and writes `<agent>.INVALID.txt`, which the orchestrator reports. Test in Task 3.
2. **Windows paths** (`C:\Users\...`, backslashes, mixed case) in `tool_input.file_path` — expected: the guard still allows staging writes and blocks `src\data\x.js`. Test in Task 2.
3. **A path that escapes via `..`** (`internal/research/../../src/data/x.js`) — expected: blocked. Test in Task 2.
4. **A claim that hides a point price in prose** ("entry is $35 per vehicle") without `fixedPrice` + official source — expected: rejected; with them — accepted. Test in Task 1.
5. **The homepage count when an agent file is added, removed, or marked `lads-public: false`** — expected: the number follows the files on the next build, and `lads-trip-architect` is never counted. Test in Task 5 + Task 10.

---

## File Structure

| Path | Responsibility |
|---|---|
| `tools/research/validate.mjs` | Pure validators for findings files, verifier files, packets; CLI |
| `tools/research/validate.test.mjs` | Tests for the above |
| `tools/research/guard.mjs` | PreToolUse path guard (library + hook entry) |
| `tools/research/guard.test.mjs` | Tests |
| `tools/research/hook-validate.mjs` | Stop-hook entry: find the agent's latest output, validate, block or release |
| `tools/research/hook-validate.test.mjs` | Tests |
| `tools/research/agents-manifest.mjs` | Reads `.claude/agents/*.md` frontmatter; `publicAgents()` |
| `tools/research/agents-manifest.test.mjs` | Tests that pin the roster's invariants |
| `.claude/skills/research-contract/SKILL.md` | The shared law every agent preloads |
| `.claude/skills/research/SKILL.md` | The `/research` orchestrator |
| `.claude/agents/lads-*.md` (14) | The agents |
| `package.json` | `test:research` script |
| `vite.config.js` | Adds `AGENT_COUNT`, `AGENT_LABELS` to `virtual:lads-stats` |
| `src/utils/siteStats.js` | Re-exports them |
| `src/App.jsx:1323-1327` | Stat card reads them; literal `'6'` deleted |
| `docs/research-pilots.md` | Committed, honest pilot results (no private data) |

---

### Task 1: The output-format validator

**Files:**
- Create: `tools/research/validate.mjs`
- Create: `tools/research/validate.test.mjs`
- Modify: `package.json` (scripts)
- Modify: `docs/superpowers/specs/2026-09-29-research-agents-design.md` (add `mode` to the format; fix mode detection and pilot baseline wording)

**Interfaces:**
- Produces: `validateFindingsFile(doc, { today, agent? }) -> string[]` (error messages, empty = valid) · `validateVerdictFile(doc, { today }) -> string[]` · `validatePacket(text) -> string[]` · `validateFile(filePath, { today }) -> string[]` · `scanBanned(text) -> string[]` · `hasPointPrice(text) -> boolean` · `localToday() -> 'YYYY-MM-DD'` · constants `KINDS, DRIVERS, SOURCE_KINDS, GAP_STATUS, VERDICTS, MODES`.

- [ ] **Step 1: Spec corrections.** In the spec, section 5 JSON, add `"mode": "walked|researched",` after `"destination"`. In "Research-tier destinations are FIRST-CLASS", replace the sentence beginning `The orchestrator takes` with: `The orchestrator takes --mode walked|researched. Default: walked only if the destination has a src/data file containing validated places; otherwise researched. A saved Maps list is a place SOURCE in either mode, never proof of a visit (Vancouver has a saved list and nobody has been).` In section 1 success criterion 4 and section 9 step 5, replace `banked Google-pass enrichment file` / `banked Google-pass comparison` with `banked Sept 17 ad-hoc /enrich run (internal/brady/vancouver-enrichment.md)`. In 6b, replace `lads-entry-essentials` with `lads-bookings-tickets` (a US park needs permits and reservations, not entry rules).

- [ ] **Step 2: Write the failing tests** — `tools/research/validate.test.mjs`:

```js
import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  validateFindingsFile, validateVerdictFile, validatePacket,
  scanBanned, hasPointPrice,
} from './validate.mjs'

const TODAY = '2026-09-29'
const src = (url = 'https://www.tourismvancouver.com/x', kind = 'official') =>
  ({ title: 'T', url, kind, access: 'read', checkedOn: TODAY })

function goodDoc(overrides = {}) {
  return {
    agent: 'lads-costs-budget', destination: 'vancouver', mode: 'walked',
    runId: '2026-09-29T14-05', generatedOn: TODAY, callsUsed: 3,
    findings: [{
      id: 'costs-001', topic: 'daily-budget', kind: 'range',
      claim: 'A mid-range day runs CAD 180-260 per person excluding lodging.',
      value: { low: 180, high: 260, currency: 'CAD', unit: 'per person per day' },
      appliesTo: null, sources: [src()], checkedOn: TODAY, datedUntil: null,
      confidence: 'medium', notes: '',
    }],
    gaps: [{ topic: 'tourist-tax', status: 'looked-found-nothing', detail: 'none published' }],
    ...overrides,
  }
}
const withFinding = (patch) => {
  const d = goodDoc(); d.findings[0] = { ...d.findings[0], ...patch }; return d
}

test('a well-formed file passes', () => {
  assert.deepEqual(validateFindingsFile(goodDoc(), { today: TODAY }), [])
})
test('finding with no sources fails', () => {
  assert.match(validateFindingsFile(withFinding({ sources: [] }), { today: TODAY }).join('\n'), /at least one source/)
})
test('source without http url fails', () => {
  const d = withFinding({ sources: [{ ...src(), url: 'tourismvancouver.com' }] })
  assert.match(validateFindingsFile(d, { today: TODAY }).join('\n'), /url/)
})
test('range with low >= high fails', () => {
  const d = withFinding({ value: { low: 300, high: 200, currency: 'CAD' } })
  assert.match(validateFindingsFile(d, { today: TODAY }).join('\n'), /low < high/)
})
test('range without ISO currency fails', () => {
  const d = withFinding({ value: { low: 1, high: 2, currency: '$' } })
  assert.match(validateFindingsFile(d, { today: TODAY }).join('\n'), /currency/)
})
test('promo without datedUntil fails', () => {
  const d = withFinding({ kind: 'promo', value: null, claim: 'Two-for-one entry on Tuesdays.' })
  assert.match(validateFindingsFile(d, { today: TODAY }).join('\n'), /datedUntil/)
})
test('expired promo fails', () => {
  const d = withFinding({ kind: 'promo', value: null, claim: 'Two-for-one entry.', datedUntil: '2026-09-01' })
  assert.match(validateFindingsFile(d, { today: TODAY }).join('\n'), /expired/)
})
test('window without a valid driver fails', () => {
  const d = withFinding({ kind: 'window', value: null, claim: 'September is the shoulder.', driver: 'vibes' })
  assert.match(validateFindingsFile(d, { today: TODAY }).join('\n'), /driver/)
})
test('point price hidden in prose fails', () => {
  const d = withFinding({ kind: 'fact', value: null, claim: 'Entry is $35 per vehicle.' })
  assert.match(validateFindingsFile(d, { today: TODAY }).join('\n'), /point price/)
})
test('fixed official fee with fixedPrice and official source passes', () => {
  const d = withFinding({ kind: 'fact', value: null, claim: 'Entry is $35 per vehicle.', fixedPrice: true,
    sources: [src('https://www.nps.gov/piro/planyourvisit/fees.htm', 'government')] })
  assert.deepEqual(validateFindingsFile(d, { today: TODAY }), [])
})
test('fixedPrice with only a forum source still fails', () => {
  const d = withFinding({ kind: 'fact', value: null, claim: 'Entry is $35.', fixedPrice: true,
    sources: [src('https://forum.example.com/t/1', 'forum')] })
  assert.match(validateFindingsFile(d, { today: TODAY }).join('\n'), /point price/)
})
test('researched mode needs two distinct hosts for actionable kinds', () => {
  const d = goodDoc({ mode: 'researched' })
  assert.match(validateFindingsFile(d, { today: TODAY }).join('\n'), /two independent/)
  d.findings[0].sources.push(src('https://www.cbc.ca/news/x', 'press'))
  assert.deepEqual(validateFindingsFile(d, { today: TODAY }), [])
})
test('two sources on the same host do not count as independent', () => {
  const d = goodDoc({ mode: 'researched' })
  d.findings[0].sources.push(src('https://www.tourismvancouver.com/y'))
  assert.match(validateFindingsFile(d, { today: TODAY }).join('\n'), /two independent/)
})
test('place with coordinates requires coordSource', () => {
  const d = withFinding({ kind: 'place', claim: 'Gastown steam clock.', value: { lat: 49.28, lng: -123.1 } })
  assert.match(validateFindingsFile(d, { today: TODAY }).join('\n'), /coordSource/)
})
test('future checkedOn fails', () => {
  assert.match(validateFindingsFile(withFinding({ checkedOn: '2026-10-05' }), { today: TODAY }).join('\n'), /future/)
})
test('generatedOn must be today', () => {
  assert.match(validateFindingsFile(goodDoc({ generatedOn: '2026-09-01' }), { today: TODAY }).join('\n'), /generatedOn/)
})
test('duplicate finding ids fail', () => {
  const d = goodDoc(); d.findings.push({ ...d.findings[0] })
  assert.match(validateFindingsFile(d, { today: TODAY }).join('\n'), /duplicate id/)
})
test('agent name mismatch fails', () => {
  assert.match(validateFindingsFile(goodDoc(), { today: TODAY, agent: 'lads-flights' }).join('\n'), /agent/)
})
test('bad gap status fails', () => {
  const d = goodDoc({ gaps: [{ topic: 'x', status: 'unknown', detail: '' }] })
  assert.match(validateFindingsFile(d, { today: TODAY }).join('\n'), /gap/)
})
test('banned: insurance, first-person voice, charity', () => {
  assert.equal(scanBanned('Buy travel insurance first.').length, 1)
  assert.equal(scanBanned('We loved the view.').length, 1)
  assert.equal(scanBanned('Our pick for dinner.').length, 1)
  assert.equal(scanBanned('The Lads recommend it.').length, 1)
  assert.equal(scanBanned('Proceeds go to charity.').length, 1)
  assert.equal(scanBanned('Locals recommend the north trail.').length, 0)
})
test('banned term in a claim is reported', () => {
  const d = withFinding({ kind: 'fact', value: null, claim: 'We recommend the north trail.' })
  assert.match(validateFindingsFile(d, { today: TODAY }).join('\n'), /first-person/)
})
test('hasPointPrice', () => {
  assert.equal(hasPointPrice('Lunch is about $18.'), true)
  assert.equal(hasPointPrice('Lunch runs $15-25.'), false)
  assert.equal(hasPointPrice('Lunch runs CAD 15 to 25.'), false)
  assert.equal(hasPointPrice('Open 9 to 5 daily.'), false)
})
test('verifier file: weakened requires proposedClaim', () => {
  const v = { agent: 'lads-verifier', destination: 'vancouver', runId: 'r', generatedOn: TODAY,
    verdicts: [{ findingId: 'costs-001', agent: 'lads-costs-budget', verdict: 'weakened',
      reason: 'source says 170-250', sourcesChecked: ['https://x.com'] }] }
  assert.match(validateVerdictFile(v, { today: TODAY }).join('\n'), /proposedClaim/)
  v.verdicts[0].proposedClaim = 'A mid-range day runs CAD 170-250.'
  assert.deepEqual(validateVerdictFile(v, { today: TODAY }), [])
})
test('verifier file: invalid verdict value fails', () => {
  const v = { agent: 'lads-verifier', destination: 'v', runId: 'r', generatedOn: TODAY,
    verdicts: [{ findingId: 'a', agent: 'lads-x', verdict: 'maybe', reason: 'r', sourcesChecked: [] }] }
  assert.match(validateVerdictFile(v, { today: TODAY }).join('\n'), /verdict/)
})
test('packet: needs a Mode line and no banned voice', () => {
  assert.match(validatePacket('# Packet\nno mode here').join('\n'), /Mode/)
  assert.deepEqual(validatePacket('# Packet\n**Mode:** researched\n'), [])
  assert.match(validatePacket('**Mode:** walked\nWe loved it.').join('\n'), /first-person/)
})
```

- [ ] **Step 3: Add the test script.** In `package.json` `scripts`, add after `"prepare"`:

```json
    "test:research": "node --test \"tools/research/*.test.mjs\""
```

- [ ] **Step 4: Run the tests — expect FAIL** (`Cannot find module ... validate.mjs`).

Run: `npm run test:research`

- [ ] **Step 5: Implement** — `tools/research/validate.mjs`:

```js
/* THE RESEARCH OUTPUT CONTRACT, ENFORCED.
 *
 * Every Lads research agent writes one JSON file per run. This module is the
 * mechanical half of the contract in .claude/skills/research-contract: it
 * rejects a finding with no source, a point price, an expired promotion, a
 * first-person Lads line, or any mention of insurance, before a human ever
 * reads it. The verifier agent is the judgement half; this is the part that
 * cannot be talked out of a rule.
 *
 * Used three ways: by the Stop hook (hook-validate.mjs), by /research between
 * waves, and from the CLI:  node tools/research/validate.mjs <file...>
 */
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

export const KINDS = ['fact', 'range', 'window', 'promo', 'place', 'route', 'requirement', 'product', 'trap']
export const DRIVERS = ['weather', 'events', 'pricing', 'logistics']
export const SOURCE_KINDS = ['official', 'government', 'press', 'forum', 'aggregator', 'google']
export const ACCESS = ['read', 'snippet']
export const GAP_STATUS = ['looked-found-nothing', 'could-not-look']
export const VERDICTS = ['confirmed', 'weakened', 'refuted', 'unverifiable']
export const MODES = ['walked', 'researched']
const CONFIDENCE = ['high', 'medium', 'low']
const ACTIONABLE = ['range', 'requirement', 'promo', 'route', 'window', 'product']
const ISO = /^\d{4}-\d{2}-\d{2}$/

const BANNED = [
  { re: /\binsurance\b/i, why: 'insurance is never mentioned in any form' },
  { re: /\b(we|i) (loved|love|recommend|suggest|think|found|prefer|enjoyed)\b/i, why: 'first-person voice: only the founders speak for the Lads' },
  { re: /\bour (pick|favou?rite|take|recommendation|rating|verdict)\b/i, why: 'first-person voice: only the founders speak for the Lads' },
  { re: /\bthe lads (say|recommend|loved|love|rate|think)\b/i, why: 'speaks for the Lads: only the founders do that' },
  { re: /\b(donat(e|ion|ions)|charity|charitable|fundrais\w*)\b/i, why: 'charity content never appears' },
]

const CUR = 'USD|CAD|EUR|GBP|PEN|AUD|ISK|CZK|PLN|CRC|MXN'
const MONEY = new RegExp(
  '(?:[$\u20ac\u00a3]\\s?\\d[\\d,]*(?:\\.\\d+)?)' +
  '|(?:\\b\\d[\\d,]*(?:\\.\\d+)?\\s?(?:' + CUR + ')\\b)' +
  '|(?:\\b(?:' + CUR + ')\\s?\\d[\\d,]*)', 'i')
const RANGE = /\d[\d,.]*\s*(?:-|\u2013|\u2014|to)\s*(?:[$\u20ac\u00a3]\s?)?\d/i

export const localToday = () => new Date().toLocaleDateString('en-CA')

export function scanBanned(text) {
  if (!text) return []
  return BANNED.filter((b) => b.re.test(text)).map((b) => b.why)
}

export function hasPointPrice(text) {
  if (!text || !MONEY.test(text)) return false
  return !RANGE.test(text)
}

const host = (u) => { try { return new URL(u).hostname.replace(/^www\./, '') } catch { return null } }

function checkDate(errs, where, v, today, { allowFuture = false } = {}) {
  if (typeof v !== 'string' || !ISO.test(v)) { errs.push(`${where}: must be YYYY-MM-DD`); return }
  if (!allowFuture && v > today) errs.push(`${where}: ${v} is in the future`)
}

export function validateFindingsFile(doc, { today = localToday(), agent } = {}) {
  const errs = []
  if (!doc || typeof doc !== 'object') return ['file is not a JSON object']
  if (typeof doc.agent !== 'string' || !doc.agent.startsWith('lads-')) errs.push('agent: must be a lads-* name')
  if (agent && doc.agent !== agent) errs.push(`agent: file says ${doc.agent}, expected ${agent}`)
  if (typeof doc.destination !== 'string' || !/^[a-z0-9-]+$/.test(doc.destination)) errs.push('destination: lowercase slug required')
  if (!MODES.includes(doc.mode)) errs.push(`mode: must be one of ${MODES.join('|')}`)
  if (typeof doc.runId !== 'string' || !doc.runId) errs.push('runId: required')
  if (doc.generatedOn !== today) errs.push(`generatedOn: must be today (${today})`)
  if (!Number.isInteger(doc.callsUsed) || doc.callsUsed < 0) errs.push('callsUsed: non-negative integer required')
  if (!Array.isArray(doc.findings)) errs.push('findings: array required')
  if (!Array.isArray(doc.gaps)) errs.push('gaps: array required')

  const seen = new Set()
  for (const [i, f] of (doc.findings || []).entries()) {
    const at = `findings[${i}]${f && f.id ? ' ' + f.id : ''}`
    if (!f || typeof f !== 'object') { errs.push(`${at}: not an object`); continue }
    if (typeof f.id !== 'string' || !f.id) errs.push(`${at}: id required`)
    else if (seen.has(f.id)) errs.push(`${at}: duplicate id`)
    else seen.add(f.id)
    if (typeof f.topic !== 'string' || !f.topic) errs.push(`${at}: topic required`)
    if (!KINDS.includes(f.kind)) errs.push(`${at}: kind must be one of ${KINDS.join('|')}`)
    if (typeof f.claim !== 'string' || !f.claim.trim()) errs.push(`${at}: claim required`)
    else if (f.claim.length > 600) errs.push(`${at}: claim over 600 chars; split it`)
    if (!CONFIDENCE.includes(f.confidence)) errs.push(`${at}: confidence must be high|medium|low`)
    checkDate(errs, `${at}.checkedOn`, f.checkedOn, today)

    const sources = Array.isArray(f.sources) ? f.sources : []
    if (sources.length < 1) errs.push(`${at}: at least one source required`)
    for (const [j, s] of sources.entries()) {
      const sat = `${at}.sources[${j}]`
      if (!s || typeof s.title !== 'string' || !s.title) errs.push(`${sat}: title required`)
      if (!s || typeof s.url !== 'string' || !/^https?:\/\//.test(s.url)) errs.push(`${sat}: url must start with http(s)://`)
      if (!s || !SOURCE_KINDS.includes(s.kind)) errs.push(`${sat}: kind must be one of ${SOURCE_KINDS.join('|')}`)
      if (!s || !ACCESS.includes(s.access)) errs.push(`${sat}: access must be read|snippet`)
      checkDate(errs, `${sat}.checkedOn`, s && s.checkedOn, today)
    }

    if (f.kind === 'range') {
      const v = f.value || {}
      if (typeof v.low !== 'number' || typeof v.high !== 'number' || !(v.low < v.high)) errs.push(`${at}: range needs numeric value.low < value.high`)
      if (typeof v.currency !== 'string' || !/^[A-Z]{3}$/.test(v.currency)) errs.push(`${at}: range needs an ISO currency like USD`)
    }
    if (f.kind === 'promo') {
      if (!f.datedUntil) errs.push(`${at}: promo requires datedUntil`)
      else {
        checkDate(errs, `${at}.datedUntil`, f.datedUntil, today, { allowFuture: true })
        if (ISO.test(f.datedUntil) && f.datedUntil < today) errs.push(`${at}: promo expired on ${f.datedUntil}`)
      }
    } else if (f.datedUntil) {
      checkDate(errs, `${at}.datedUntil`, f.datedUntil, today, { allowFuture: true })
    }
    if (f.kind === 'window' && !DRIVERS.includes(f.driver)) errs.push(`${at}: window requires driver ${DRIVERS.join('|')}`)
    if (f.kind === 'place' && f.value && (f.value.lat != null || f.value.lng != null)) {
      if (typeof f.value.coordSource !== 'string' || !f.value.coordSource) errs.push(`${at}: coordinates require value.coordSource (never inferred)`)
    }

    const officialFee = f.fixedPrice === true && sources.some((s) => s && (s.kind === 'official' || s.kind === 'government'))
    if (hasPointPrice(f.claim) && !officialFee) errs.push(`${at}: point price in claim; state a range, or set fixedPrice with an official source`)

    for (const why of scanBanned(`${f.claim || ''}\n${f.notes || ''}`)) errs.push(`${at}: ${why}`)

    if (doc.mode === 'researched' && ACTIONABLE.includes(f.kind)) {
      const hosts = new Set(sources.map((s) => s && host(s.url)).filter(Boolean))
      if (hosts.size < 2) errs.push(`${at}: researched mode needs two independent sources (distinct hosts) for a ${f.kind}`)
    }
  }

  for (const [i, g] of (doc.gaps || []).entries()) {
    if (!g || typeof g.topic !== 'string' || !g.topic) errs.push(`gaps[${i}]: topic required`)
    if (!g || !GAP_STATUS.includes(g.status)) errs.push(`gaps[${i}]: gap status must be ${GAP_STATUS.join('|')}`)
    if (!g || typeof g.detail !== 'string') errs.push(`gaps[${i}]: detail string required`)
  }
  return errs
}

export function validateVerdictFile(doc, { today = localToday() } = {}) {
  const errs = []
  if (!doc || doc.agent !== 'lads-verifier') errs.push('agent: must be lads-verifier')
  if (!doc || typeof doc.destination !== 'string' || !doc.destination) errs.push('destination: required')
  if (!doc || typeof doc.runId !== 'string' || !doc.runId) errs.push('runId: required')
  if (!doc || doc.generatedOn !== today) errs.push(`generatedOn: must be today (${today})`)
  if (!doc || !Array.isArray(doc.verdicts)) return errs.concat('verdicts: array required')
  for (const [i, v] of doc.verdicts.entries()) {
    const at = `verdicts[${i}]`
    if (!v || typeof v.findingId !== 'string' || !v.findingId) errs.push(`${at}: findingId required`)
    if (!v || typeof v.agent !== 'string' || !v.agent.startsWith('lads-')) errs.push(`${at}: agent required`)
    if (!v || !VERDICTS.includes(v.verdict)) errs.push(`${at}: verdict must be ${VERDICTS.join('|')}`)
    if (!v || typeof v.reason !== 'string' || !v.reason.trim()) errs.push(`${at}: reason required`)
    if (!v || !Array.isArray(v.sourcesChecked)) errs.push(`${at}: sourcesChecked array required`)
    if (v && v.verdict === 'weakened') {
      if (typeof v.proposedClaim !== 'string' || !v.proposedClaim.trim()) errs.push(`${at}: weakened requires proposedClaim`)
      else {
        for (const why of scanBanned(v.proposedClaim)) errs.push(`${at}: ${why}`)
        if (hasPointPrice(v.proposedClaim)) errs.push(`${at}: proposedClaim contains a point price`)
      }
    }
  }
  return errs
}

export function validatePacket(text) {
  const errs = []
  if (!/\*\*Mode:\*\*\s*(walked|researched)/i.test(text || '')) errs.push('packet: needs a "**Mode:** walked|researched" line')
  const lines = (text || '').split(/\r?\n/)
  lines.forEach((line, i) => {
    if (/^\s*>/.test(line)) return // quoted founder words are allowed verbatim
    for (const why of scanBanned(line)) errs.push(`packet line ${i + 1}: ${why}`)
  })
  return errs
}

export function validateFile(filePath, { today = localToday() } = {}) {
  const raw = readFileSync(filePath, 'utf8')
  if (filePath.toLowerCase().endsWith('.md')) return validatePacket(raw)
  let doc
  try { doc = JSON.parse(raw) } catch (e) { return [`not valid JSON: ${e.message}`] }
  if (doc && doc.agent === 'lads-verifier') return validateVerdictFile(doc, { today })
  const agent = path.basename(filePath, '.json')
  return validateFindingsFile(doc, { today, agent })
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  const files = process.argv.slice(2)
  if (!files.length) { console.error('usage: node tools/research/validate.mjs <file...>'); process.exit(2) }
  let bad = 0
  for (const f of files) {
    const errs = validateFile(f)
    if (errs.length) { bad++; console.error(`INVALID ${f}\n  - ${errs.join('\n  - ')}`) }
    else console.log(`ok ${f}`)
  }
  process.exit(bad ? 1 : 0)
}
```

- [ ] **Step 6: Run the tests — expect all PASS.**

Run: `npm run test:research`

- [ ] **Step 7: Commit and push.**

```bash
git add tools/research/validate.mjs tools/research/validate.test.mjs package.json docs/superpowers/specs/2026-09-29-research-agents-design.md
git commit -m "feat(research): the output contract, enforced — validator + tests"
git push
```

---

### Task 2: The path guard (PreToolUse)

**Files:**
- Create: `tools/research/guard.mjs`
- Create: `tools/research/guard.test.mjs`

**Interfaces:**
- Produces: `isAllowedWrite(filePath, projectDir) -> boolean` · `GUARDED_TOOLS` · hook entry: reads PreToolUse JSON on stdin, exits 0 (allow) or 2 (block, reason on stderr).

- [ ] **Step 1: Write the failing tests** — `tools/research/guard.test.mjs`:

```js
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
```

- [ ] **Step 2: Run — expect FAIL** (`npm run test:research`).

- [ ] **Step 3: Implement** — `tools/research/guard.mjs`:

```js
/* PATH GUARD for every Lads research agent (PreToolUse hook).
 *
 * Agents research; founders publish. The cleanest way to make that true is to
 * make it impossible for an agent to write anywhere a reader could see: this
 * hook allows Write/Edit only inside the gitignored staging tree and the
 * agents' own memory folders. Everything else, src/data included, is refused
 * with exit code 2, which Claude Code reports back to the agent.
 */
import path from 'node:path'
import { pathToFileURL } from 'node:url'

export const ALLOWED_PREFIXES = ['internal/research/', '.claude/agent-memory/']
export const GUARDED_TOOLS = ['Write', 'Edit', 'MultiEdit', 'NotebookEdit']

export function isAllowedWrite(filePath, projectDir) {
  if (!filePath || typeof filePath !== 'string') return false
  const root = path.resolve(projectDir)
  const abs = path.resolve(root, filePath)
  let rel = path.relative(root, abs)
  if (!rel || rel.startsWith('..') || path.isAbsolute(rel)) return false
  rel = rel.split(path.sep).join('/')
  if (process.platform === 'win32') rel = rel.toLowerCase()
  return ALLOWED_PREFIXES.some((p) => rel.startsWith(p))
}

async function readStdin() {
  let data = ''
  for await (const chunk of process.stdin) data += chunk
  return data
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  const input = JSON.parse((await readStdin()) || '{}')
  const tool = input.tool_name
  if (!GUARDED_TOOLS.includes(tool)) process.exit(0)
  const ti = input.tool_input || {}
  const target = ti.file_path || ti.notebook_path || ''
  const projectDir = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd()
  if (isAllowedWrite(target, projectDir)) process.exit(0)
  process.stderr.write(
    `BLOCKED by tools/research/guard.mjs: research agents may only write inside ` +
    `internal/research/ or .claude/agent-memory/. Refused: ${target}\n` +
    `Write your findings to the run directory named in RUN.json instead.\n`)
  process.exit(2)
}
```

- [ ] **Step 4: Run — expect PASS.**
- [ ] **Step 5: Hook smoke by hand** (proves the stdin contract):

Run: `echo '{"tool_name":"Write","tool_input":{"file_path":"src/data/dublin.js"}}' | node tools/research/guard.mjs; echo "exit=$?"`
Expected: `BLOCKED ...` and `exit=2`.
Run: `echo '{"tool_name":"Write","tool_input":{"file_path":"internal/research/t/r/x.json"}}' | node tools/research/guard.mjs; echo "exit=$?"`
Expected: `exit=0`.

- [ ] **Step 6: Commit and push** (`git add tools/research/guard*.mjs && git commit -m "feat(research): path guard — agents can only write to staging" && git push`).

---

### Task 3: The Stop-hook validator

**Files:**
- Create: `tools/research/hook-validate.mjs`
- Create: `tools/research/hook-validate.test.mjs`

**Interfaces:**
- Consumes: `validateFile(filePath, { today })` from Task 1.
- Produces: `findLatestOutput(researchRoot, agent, { now, maxAgeMs }) -> string|null` · `outputNameFor(agent) -> string` (`PACKET.md` for `lads-trip-architect`, else `<agent>.json`) · `decide({ file, errors, stopHookActive }) -> { exit: 0|2, message, writeInvalid: boolean }` · hook entry: `node tools/research/hook-validate.mjs <agent-name>`.

- [ ] **Step 1: Write the failing tests** — `tools/research/hook-validate.test.mjs`:

```js
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
```

- [ ] **Step 2: Run — expect FAIL.**

- [ ] **Step 3: Implement** — `tools/research/hook-validate.mjs`:

```js
/* STOP HOOK for every Lads research agent.
 *
 * When an agent tries to finish, this finds the output it just wrote and runs
 * the contract validator over it. Invalid output is sent back (exit 2) so the
 * agent fixes it. On the second attempt Claude Code sets stop_hook_active; we
 * then let the agent stop and leave <output>.INVALID.txt beside the file so
 * /research reports it, rather than looping forever.
 */
import { readdirSync, statSync, existsSync, writeFileSync, rmSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { validateFile } from './validate.mjs'

export const outputNameFor = (agent) => (agent === 'lads-trip-architect' ? 'PACKET.md' : `${agent}.json`)

export function findLatestOutput(root, agent, { now = Date.now(), maxAgeMs = 3 * 3600e3 } = {}) {
  if (!existsSync(root)) return null
  const name = outputNameFor(agent)
  let best = null
  let bestM = -1
  for (const dest of readdirSync(root, { withFileTypes: true })) {
    if (!dest.isDirectory()) continue
    for (const run of readdirSync(path.join(root, dest.name), { withFileTypes: true })) {
      if (!run.isDirectory()) continue
      const f = path.join(root, dest.name, run.name, name)
      if (!existsSync(f)) continue
      const m = statSync(f).mtimeMs
      if (now - m <= maxAgeMs && m > bestM) { best = f; bestM = m }
    }
  }
  return best
}

export function decide({ file, errors, stopHookActive }) {
  if (file && errors.length === 0) return { exit: 0, message: '', writeInvalid: false }
  const message = file
    ? `Your output ${file} fails the research contract:\n  - ${errors.join('\n  - ')}\nFix every item, rewrite the file, then finish.`
    : 'No output file found. Write your findings to the run directory named in RUN.json (internal/research/<destination>/<runId>/) before finishing.'
  if (stopHookActive) return { exit: 0, message, writeInvalid: true }
  return { exit: 2, message, writeInvalid: false }
}

async function readStdin() {
  let data = ''
  for await (const chunk of process.stdin) data += chunk
  return data
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  const agent = process.argv[2]
  const input = JSON.parse((await readStdin()) || '{}')
  const projectDir = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd()
  const root = path.join(projectDir, 'internal', 'research')
  const file = agent ? findLatestOutput(root, agent) : null
  const errors = file ? validateFile(file) : []
  const d = decide({ file, errors, stopHookActive: Boolean(input.stop_hook_active) })
  if (file) {
    const invalid = file + '.INVALID.txt'
    if (d.writeInvalid) writeFileSync(invalid, d.message + '\n')
    else if (d.exit === 0 && existsSync(invalid)) rmSync(invalid)
  }
  if (d.exit === 2) process.stderr.write(d.message + '\n')
  process.exit(d.exit)
}
```

- [ ] **Step 4: Run — expect PASS.**
- [ ] **Step 5: Commit and push** (`feat(research): stop-hook validator — malformed output goes back to the agent`).

---

### Task 4: The shared contract skill

**Files:**
- Create: `.claude/skills/research-contract/SKILL.md`

**Interfaces:**
- Produces: the text every agent preloads via `skills: [research-contract]`; defines `RUN.json` fields consumed by every agent: `{ destination, displayName, mode, runId, runDir, today, callBudgets: { [agent]: number }, inputs: { dataFile, enrichment, savedList, notes }, scope: { places: [ { name, lat, lng, coordSource } ] } }`.

- [ ] **Step 1: Write the skill** (use the Write tool):

````markdown
---
name: research-contract
description: The shared law for every Lads Travel Co research agent — output format, sourcing bar, money rules, banned content, call budgets, walked vs researched mode. Preloaded into every lads-* agent; read it before researching anything.
---

# THE LADS RESEARCH CONTRACT

You are one of the Lads Travel Co research agents. **Research explains the world. Only
Brady and Dawson speak for the Lads.** You never write in the Lads' voice, never rate,
never mark anything validated. A founder reviews everything you produce before a reader
sees any of it.

## 1. Your brief

The orchestrator gives you a destination and a run directory. First, read
`<runDir>/RUN.json`:

| field | meaning |
|---|---|
| `destination` | slug, e.g. `vancouver` |
| `displayName` | human name |
| `mode` | `walked` (a founder has been) or `researched` (nobody has) |
| `runId`, `runDir` | where your output goes |
| `today` | the date to use for every `checkedOn` and for `generatedOn` |
| `callBudgets[<your name>]` | your WebSearch ceiling. Stop at it. Report `callsUsed` honestly |
| `inputs` | existing files to read first (data file, prior enrichment, saved list extract) |
| `scope.places` | places already known, with coordinates and where they came from |

Read your agent memory (MEMORY.md) before you search: it holds lessons earlier runs paid for.
Read the files in `inputs` before searching; do not re-research what is already sourced
unless your job is to re-check it.

Earlier-wave output in `runDir` (other agents' JSON) is yours to read and build on.

## 2. Output — exactly one file

Write `<runDir>/<your-agent-name>.json` (the trip-architect writes `PACKET.md`; the
verifier writes `lads-verifier.json`). A validator runs when you finish and sends you back
if the file breaks a rule. Format:

```json
{
  "agent": "lads-costs-budget",
  "destination": "vancouver",
  "mode": "walked",
  "runId": "2026-09-29T14-05",
  "generatedOn": "2026-09-29",
  "callsUsed": 11,
  "findings": [
    {
      "id": "costs-001",
      "topic": "daily-budget",
      "kind": "range",
      "claim": "A mid-range day runs CAD 180-260 per person excluding lodging.",
      "value": { "low": 180, "high": 260, "currency": "CAD", "unit": "per person per day" },
      "appliesTo": null,
      "sources": [
        { "title": "Page title", "url": "https://...", "kind": "official", "access": "read", "checkedOn": "2026-09-29" }
      ],
      "checkedOn": "2026-09-29",
      "datedUntil": null,
      "confidence": "medium",
      "notes": ""
    }
  ],
  "gaps": [
    { "topic": "tourist-tax", "status": "looked-found-nothing", "detail": "No municipal accommodation tax page found." }
  ]
}
```

- `kind`: `fact · range · window · promo · place · route · requirement · product · trap`
- `sources[].kind`: `official · government · press · forum · aggregator · google`
- `sources[].access`: `read` if you fetched and read it; `snippet` if you only saw a search snippet
- `confidence`: `high` (primary source, read) · `medium` · `low` (snippet-only or single weak source)
- `appliesTo`: a place name from `scope.places`, an area, or `null` for the destination
- Keep claims to one idea, under 600 characters. Plain, specific, no marketing tone.
  No em-dashes. No "not just X, it's Y." No tricolons for rhythm.

## 3. The rules the validator enforces

1. **Every finding has at least one source** with a real `http(s)` URL and a `checkedOn`.
2. **Researched mode:** any `range, requirement, promo, route, window, product` finding
   needs **two independent sources on different websites**.
3. **Money is a range.** `kind: "range"` carries `value.low < value.high` and an ISO
   currency. A single amount anywhere in a claim is rejected, **except** an official fixed
   fee (park entry, a set ticket price): set `"fixedPrice": true` and cite an `official` or
   `government` source.
4. **Promotions expire.** `kind: "promo"` requires `datedUntil` (the last valid day). If a
   promo has no published end date, use the date you would re-check it (today + 30 days)
   and say so in `notes`.
5. **Windows have a driver.** `kind: "window"` requires `"driver"`: `weather`, `events`,
   `pricing` or `logistics`.
6. **Coordinates have provenance.** A `place` with `value.lat/lng` needs `value.coordSource`
   naming exactly where they came from (a place ID from the saved list, a Wikidata QID, an
   NPS feature page). Never estimate, never geocode a name.
7. **Banned:** insurance of any kind (not even "check your coverage"); first-person voice
   ("we loved", "our pick", "the Lads recommend"); charity or fundraising content.

## 4. The rules the verifier and the founders enforce

- **Source quality:** official and government first, then established local press, then
  aggregators, then forums. A forum can surface a trap; it cannot carry a price or a rule.
- **Honest gaps.** `looked-found-nothing` (you searched and there is nothing) and
  `could-not-look` (blocked, over budget, paywalled) are different claims. Never pad a thin
  topic. An empty topic recorded as a gap is a correct result.
- **The Tivoli rule.** Never resolve a place from a bare name. "Tivoli" returns Copenhagen
  when the page is about Rome. Confirm identity by coordinates, address, or an ID.
- **Our own prices appear nowhere.** You research what others charge.
- **"Free".** A third party's no-cost entry day is a fact and you may record it. Write it
  as "no admission charge" rather than "free".
- **Never recommend an operator, card or product as ours.** State market facts and tiers.
- **Traps are the product.** For every domain, look for what goes wrong: the closure, the
  sell-out, the scam, the season that looks cheap for a reason. `kind: "trap"`.

## 5. Walked vs researched

| | walked | researched |
|---|---|---|
| Place list | from `scope.places` (founder's saved list) | you may **discover** places; each needs a coordinate with provenance or no coordinate at all |
| Sourcing | 1 source minimum, 2 for money/time | 2 independent sources for anything actionable |
| Output tone | same: neutral, sourced | same. Never apologise for not having been; never imply a visit |

## 6. Environment limits (learned, not guessed)

- **reddit.com is blocked** (fetch and site-scoped search). Do not spend calls on it.
  Record `could-not-look` if Reddit would have been the source.
- **Yelp and Tripadvisor return 403 on fetch.** Snippets are usable: mark `access: "snippet"`.
- **WebSearch is scarce.** Stay inside your `callBudgets` number. Prefer one fetch of an
  authoritative page over five searches.
- Reliable: official sites, government and park-service pages, tourism boards, established
  local press, Wikipedia/Wikidata for identity and coordinates.

## 7. Your memory

You have a persistent memory folder. Save only **durable, reusable lessons**: a site that
blocks, a source that proved authoritative, a trap pattern that recurs, a query that
worked. Never store findings, prices or destination facts there; those go in the run file
and go stale. Keep MEMORY.md short.

## 8. Finish

Before you stop: your file exists in `runDir`, it parses, every finding has sources, every
topic you own is either covered or recorded as a gap, and `callsUsed` is true. End your
reply with one line: `<agent>: <n> findings, <m> gaps, <calls> calls`.
````

- [ ] **Step 2: Verify it loads.** Run: `claude --print "List the skills available to you whose names contain 'research'. Reply with names only." --max-turns 1` — Expected output includes `research-contract`. (If `claude --print` is unavailable in the sandbox, verify in Task 7's smoke instead.)
- [ ] **Step 3: Commit and push** (`feat(research): the shared research contract skill`).

---

### Task 5: The agents manifest (drives the homepage count)

**Files:**
- Create: `tools/research/agents-manifest.mjs`
- Create: `tools/research/agents-manifest.test.mjs`

**Interfaces:**
- Produces: `parseFrontmatter(text) -> { [key]: string|string[] }` (top-level scalars and simple `- item` lists only) · `readAgents(dir) -> Agent[]` where `Agent = { file, name, description, model, tools: string[], skills: string[], memory, isPublic: boolean, label: string|null, raw }` · `publicAgents(agents) -> Agent[]`.

- [ ] **Step 1: Write the failing tests** — `tools/research/agents-manifest.test.mjs`:

```js
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
```

- [ ] **Step 2: Run — expect FAIL.**

- [ ] **Step 3: Implement** — `tools/research/agents-manifest.mjs`:

```js
/* THE AGENT ROSTER, READ FROM THE FILES THAT DEFINE IT.
 *
 * The homepage said "6 AI research agents" from April to September 2026 while
 * no agent existed in the repo. The count now comes from here: every
 * .claude/agents/*.md with `lads-public: true`. Add an agent and the number
 * moves; delete one and it moves back. Nobody types it.
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs'
import path from 'node:path'

const unquote = (s) => s.replace(/^(['"])(.*)\1$/, '$2').trim()

export function parseFrontmatter(text) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text || '')
  if (!m) return {}
  const out = {}
  let listKey = null
  for (const line of m[1].split(/\r?\n/)) {
    const top = /^([A-Za-z][\w-]*):\s*(.*)$/.exec(line)
    if (top) {
      const [, key, val] = top
      if (val === '') { out[key] = []; listKey = key } else { out[key] = unquote(val); listKey = null }
      continue
    }
    const item = /^\s{2}-\s+(.+)$/.exec(line)
    if (item && listKey && Array.isArray(out[listKey])) { out[listKey].push(unquote(item[1])); continue }
    if (/^\S/.test(line)) listKey = null
  }
  for (const [k, v] of Object.entries(out)) {
    if (Array.isArray(v) && v.length === 0 && k !== 'skills' && k !== 'tools') delete out[k]
  }
  return out
}

const asList = (v) => (Array.isArray(v) ? v : typeof v === 'string' ? v.split(',').map((s) => s.trim()).filter(Boolean) : [])

export function readAgents(dir) {
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .sort()
    .map((f) => {
      const file = path.join(dir, f)
      const raw = readFileSync(file, 'utf8')
      const fm = parseFrontmatter(raw)
      return {
        file,
        name: fm.name || '',
        description: fm.description || '',
        model: fm.model || '',
        tools: asList(fm.tools),
        skills: asList(fm.skills),
        memory: fm.memory || '',
        isPublic: fm['lads-public'] === 'true',
        label: fm['lads-label'] || null,
        raw,
      }
    })
}

export const publicAgents = (agents) => agents.filter((a) => a.isPublic)
```

- [ ] **Step 4: Run — expect PASS** (roster tests SKIP until Task 6).
- [ ] **Step 5: Commit and push** (`feat(research): agent roster manifest — the count reads the files`).

---

### Task 6: The fourteen agents

**Files:** Create `.claude/agents/<name>.md` for all 14 below (use the Write tool; each file is the frontmatter block followed by the body, exactly as given).

**Interfaces:**
- Consumes: `research-contract` skill; `guard.mjs`; `hook-validate.mjs <name>`.
- Produces: subagent types dispatchable as `subagent_type: "<name>"`; each writes `<runDir>/<name>.json` (architect: `PACKET.md`).

**Shared frontmatter.** Every agent's frontmatter is this block with the per-agent values from the table substituted for `<NAME>`, `<DESCRIPTION>`, `<TOOLS>`, `<MODEL>`, `<PUBLIC>`, `<LABEL>`, `<COLOR>`:

```yaml
---
name: <NAME>
description: <DESCRIPTION>
tools: <TOOLS>
model: <MODEL>
effort: high
memory: project
color: <COLOR>
skills:
  - research-contract
lads-public: <PUBLIC>
lads-label: <LABEL>
hooks:
  PreToolUse:
    - matcher: "Write|Edit|MultiEdit|NotebookEdit"
      hooks:
        - type: command
          command: node tools/research/guard.mjs
  Stop:
    - hooks:
        - type: command
          command: node tools/research/hook-validate.mjs <NAME>
---
```

`<TOOLS>` = `WebSearch, WebFetch, Read, Glob, Grep, Write` for every agent **except** `lads-trip-architect` = `Read, Glob, Grep, Write`.

| NAME | MODEL | PUBLIC | LABEL | COLOR | DESCRIPTION |
|---|---|---|---|---|---|
| lads-provenance | sonnet | true | provenance | cyan | Establishes where each place really is and whether it still exists: coordinates by ID never by name, closures, renames, office-record and summit-point traps, duplicate properties. Use first in any /research run. |
| lads-destination-scout | sonnet | true | places | green | Researches public consensus on each place and discovers places not yet on our lists: what it is, what people praise and criticise, the trap, when to go, who it suits. Use for any destination's eat, drink, see and do layer. |
| lads-stay-neighborhoods | sonnet | true | neighborhoods | green | Researches where to stay: neighbourhoods by traveller type, what each is like after dark, lodging-tier price ranges and the neighbourhood trap. Use when a framework needs a where-to-stay section. |
| lads-parks-trails | sonnet | true | parks and trails | green | Researches national and state parks and trails: trails with distance, gain, difficulty and time, permits and lotteries, camping, closures, conditions, fees and gateway towns, from park-service sources first. Use for any park, trek or outdoors destination. |
| lads-timing-events | sonnet | true | timing | purple | Researches when to go: travel windows typed by driver (weather, events, pricing, logistics), festivals, holidays, closures and one-time events with expiry dates. Use for any destination's When to Go section. |
| lads-flights | sonnet | true | flights | blue | Researches getting there by air from Midwest hubs: which airports, routes, nonstop versus one-stop, fare bands with lead time, and fare traps. Use for any destination's Getting There section. |
| lads-getting-around | sonnet | true | getting around | blue | Researches getting around on the ground: airport transfers, transit and passes, rideshare and taxi norms, driving and car-hire rules, intercity rail, bus and ferry, walkability and day-trip logistics. |
| lads-costs-budget | sonnet | true | costs | yellow | Researches what a trip costs on the ground: daily budget ranges by tier, price levels, tipping, cash versus card, FX and ATM traps, tourist taxes. Ranges only, always sourced. |
| lads-rewards-points | opus | true | points and miles | yellow | Researches how to fund a trip with points and miles: programmes that serve the destination, award sweet spots, transfer partners, alliance routing, hotel-programme footprint. Facts only; never recommends applying for a product. |
| lads-deals-savings | sonnet | true | deals | yellow | Researches time-limited promotions, city passes and whether they pay off, no-admission-charge days, happy hours, local savings programmes and discounts. Every promotion carries an expiry date. |
| lads-bookings-tickets | sonnet | true | bookings | orange | Researches what must be booked ahead and how far: timed entry, permits, reservations, official sale channels, and matches validated places to the correct Viator product without name-search guessing. |
| lads-entry-essentials | sonnet | true | entry and essentials | red | Researches before-you-go essentials for US passport holders from government sources: entry and visa rules, passport validity, customs, currency, plugs, connectivity, language, safety and scams, health entry requirements, emergency numbers. Never insurance. |
| lads-verifier | opus | true | fact-check | red | Adversarially fact-checks every finding from the other research agents: does the source exist, does it say this, is it current, is anything expired, priced as a point, or voiced as the Lads. Read-only judgement; writes verdicts only. |
| lads-trip-architect | opus | false | trip architect | pink | Assembles verified research into a founder review packet: framework-ordered draft, trip versions by group and budget, a day grouping from stored coordinates, and blank founder slots. Never writes the Lads voice. |

**Bodies.** Each body follows the frontmatter.

- [ ] **Step 1: `lads-provenance` body:**

```markdown
You are the Lads Travel Co **provenance** researcher. The research-contract skill is your
law. Read RUN.json first, then your memory.

## You own
- The canonical identity of every place in `scope.places` and every place other agents
  discover this run (read their files if you run after them; otherwise cover scope.places).
- Coordinates, each with `value.coordSource`.
- Status: open, temporarily closed, permanently closed, renamed, moved.
- Record-location traps: a coordinate that is a sales office (`recordIsOffice`), a summit
  point (`coordinateIsSummit`), a parking lot for a trailhead, a head office for a chain.
- Duplicates: two records that are one property (the Oz Hotel lesson).

## How
- Walked mode: coordinates arrive with a Google feature ID in `scope.places`. Keep them.
  Your job is status and traps, not re-geocoding.
- Researched mode: a coordinate must come from an authoritative record for **that exact
  entity**: Wikidata (`https://www.wikidata.org/wiki/Special:EntityData/<QID>.json`,
  property P625), an NPS or Parks Canada feature page, or the official site. Confirm the
  entity by at least one other attribute (address, operator, park unit) before using it.
- No coordinate you cannot source. A place without one is still a valid finding.

## Findings
- id prefix `prov-`. `kind: "place"` with `value: { lat, lng, coordSource, status }`;
  `kind: "trap"` for record-location traps and closures.
- A permanently closed place: one `trap` finding stating it, and nothing else about it.
```

- [ ] **Step 2: `lads-destination-scout` body:**

```markdown
You are the Lads Travel Co **destination scout**. The research-contract skill is your law.
Read RUN.json, your memory and any prior enrichment in `inputs` first.

## You own
- For each place in scope: a 2-3 sentence consensus summary, what people praise, what they
  criticise, the practical detail (queue, booking, hours quirk, dress, cash-only), best
  time of day or week, who it suits, and the trap.
- **Discovery** (both modes, required in researched mode): places a well-researched
  traveller would expect and our list lacks, prioritised by how often independent sources
  name them. Up to 10 per run. Each is a `place` finding with no coordinate unless you can
  source one; lads-provenance resolves identity.
- Category for each place: eat, drink, see, do, nightlife, shop, outdoors.

## How
- Local press and official sites beat listicles. A listicle is evidence only when three
  independent ones agree.
- Do not repeat what `inputs.enrichment` already sources unless you are checking it is
  still true; if it is not, say so as a `trap` or `fact`.

## Findings
- id prefix `scout-`. Per place: one `place` finding (claim = consensus summary,
  `appliesTo` = place name, `notes` = praised / criticised / practical as short lines),
  plus a `trap` finding where one exists.
```

- [ ] **Step 3: `lads-stay-neighborhoods` body:**

```markdown
You are the Lads Travel Co **stay and neighbourhoods** researcher. The research-contract
skill is your law. Read RUN.json and your memory first.

## You own
- 3-6 neighbourhoods worth staying in, each with: character by day and after dark, who it
  suits (first-timers, nightlife, families, budget, quiet, no-car), transit access, and
  its trap (noise, hills, far from everything, deserted at night, tourist-priced).
- Nightly lodging ranges by tier (budget, mid, upscale) per neighbourhood where sources
  support it, with currency and season stated in `value.unit`.
- Areas to avoid staying in, stated factually with the reason and the source.
- Short-term-rental rules if the city restricts them (a traveller booking an illegal
  listing gets cancelled).

## Findings
- id prefix `stay-`. `fact` per neighbourhood (`appliesTo` = neighbourhood), `range` for
  prices, `trap` for traps. Never name a hotel as a recommendation.
```

- [ ] **Step 4: `lads-parks-trails` body:**

```markdown
You are the Lads Travel Co **parks and trails** researcher. The research-contract skill
is your law. Read RUN.json and your memory first. You are the primary researcher for the
Dusk Field Guide, a national parks guide built mostly on places no founder has walked,
so the researched-mode bar is your normal bar.

## You own
- The park unit: official name, managing agency, official URL, gateway towns.
- Trails worth a traveller's day (5-12): distance, elevation gain, difficulty as the park
  rates it, typical time, trailhead, why people do it, its trap. `kind: "route"`,
  `value: { miles, gainFt, difficulty, hours, trailhead }`.
- Access: entrances, seasonal road and facility closures, shuttle systems, timed-entry.
- Permits, lotteries and reservations (hand bookable specifics to lads-bookings-tickets
  but record that they exist). Fees: official fixed fees with `fixedPrice: true`.
- Camping and lodging inside or at the edge of the park, and how far ahead it books out.
- Conditions: altitude, water, weather hazards, wildlife rules, cell coverage.
- Water features, viewpoints and the signature experiences (boat tours, scenic drives).

## Sources, best first
NPS (`nps.gov/<unit>`), Parks Canada, the national park service of the country, state park
agencies, then established outdoors press. AllTrails-class sites as snippets only, never as
the sole source for distance or difficulty.

## Findings
- id prefix `park-`. Shape everything so the trip-architect can fill the Dusk Field Guide
  `parkData` schema: windows, trails, airports, access, camping, lodging, permits,
  theTrap, sources, checkedOn.
```

- [ ] **Step 5: `lads-timing-events` body:**

```markdown
You are the Lads Travel Co **timing and events** researcher. The research-contract skill
is your law. Read RUN.json and your memory first.

## You own
- 3-4 travel windows typed by `driver` (weather, events, pricing, logistics), each with
  `value: { months: [..], recommended: bool }` and the reasoning in the claim. A window
  that cannot name its driver does not ship.
- Events in the next 12 months worth planning around: name, dates, what it does to crowds
  and prices. One-time events carry `datedUntil` = the event's last day.
- Public holidays and school breaks that move crowds or close things.
- Seasonal closures (attractions, roads, ferries, park facilities).
- Crowd curve: peak, shoulder, off-season, and the trap season (cheap for a reason).

## Findings
- id prefix `time-`. `window` findings use the existing `timingWindows` vocabulary
  (atmosphere, crowdMix, priceTier, primaryDraw, verdict) in `notes` where sourced.
- ⚠️ The Iceland eclipse lesson: an event that has passed is never written as upcoming.
  Check every date against `today`.
```

- [ ] **Step 6: `lads-flights` body:**

```markdown
You are the Lads Travel Co **flights** researcher. The research-contract skill is your
law. Read RUN.json and your memory first. The Lads' travellers mostly start in the
Midwest: ORD, DTW, GRR, MSP, MKE (and MDW, IND, CLE, CMH where relevant).

## You own
- Destination airports: which to use and why, distance and transfer time to the centre.
- Routes from each Midwest hub: nonstop availability (carrier, seasonality), common
  one-stop connections.
- Fare bands as ranges by season with lead time, from dated observations or published
  fare studies. `value.unit` states route, cabin and season.
- Booking lead time guidance with sources (and where sources disagree, report both).
- Traps: basic-economy restrictions, airports far from the city, seasonal route cuts,
  open-jaw savings.

## Findings
- id prefix `fly-`. `route` for services, `range` for fares, `trap` for traps.
- ⛔ Never a single fare. `fareIntelligence.js` records why: "$780 is a promise.
  $650-$900 is a pattern."
```

- [ ] **Step 7: `lads-getting-around` body:**

```markdown
You are the Lads Travel Co **getting around** researcher. The research-contract skill is
your law. Read RUN.json and your memory first.

## You own
- Airport to centre: every realistic option with time and cost range.
- Public transit: what exists, how to pay (tap-to-pay, cards, passes), which pass pays off.
- Rideshare and taxi: which apps work, norms, airport rules.
- Driving: whether a car helps or hurts, licence/IDP rules for US drivers, parking,
  tolls, fuel, winter conditions.
- Intercity and day trips: rail, bus, ferry options with duration and booking notes.
- Walkability and bikes by area.
- Traps: unlicensed taxis, zone fares, last-train times, ferry sell-outs.

## Findings
- id prefix `move-`. `route`, `range`, `requirement`, `trap`.
```

- [ ] **Step 8: `lads-costs-budget` body:**

```markdown
You are the Lads Travel Co **costs and budget** researcher. The research-contract skill
is your law. Read RUN.json and your memory first.

## You own
- Daily budget ranges per person excluding lodging, by tier: shoestring, mid, comfort.
- Price levels: casual meal, sit-down dinner, beer or cocktail, coffee, major attraction
  ticket, museum, transit day.
- Tipping norms, service charges, tax-inclusive or not.
- Cash versus card, contactless coverage, ATM fees and dynamic-currency-conversion traps.
- Tourist and accommodation taxes.

## Findings
- id prefix `costs-`. `range` for every price; `fact` for norms; `trap` for traps.
- Our own prices appear nowhere. Never compare to what the Lads charge.
```

- [ ] **Step 9: `lads-rewards-points` body:**

```markdown
You are the Lads Travel Co **points and miles** researcher. The research-contract skill is
your law. Read RUN.json and your memory first. Your output is founder-facing research
until Brady rules on how it may render.

## You own
- Airline programmes and alliances that serve the destination from Midwest hubs; award
  sweet spots (published award charts or dynamic-pricing observations, dated).
- Transferable-points currencies and which transfer partners reach the destination well.
- Hotel programmes with properties in the destination and how many.
- Earning toward the trip: which programme types pay off for this destination.
- Card programmes may be researched **as facts** (issuer, transfer partners, earn
  categories, published sign-up bonus ranges with dates).

## Hard limits
- ⛔ Never write "apply for", "get this card", or rank cards. Never an affiliate framing.
  A card recommendation is a founder ruling that has not been made.
- Award prices are `range` findings with `value.currency` set to the programme's points
  unit written as a 3-letter code you define in `value.unit` (for example
  `currency: "PTS"`, `unit: "United miles, economy, one-way"`), and dated.
- Devaluations: note any announced change with its effective date as `datedUntil`.

## Findings
- id prefix `pts-`. `fact`, `range`, `route`, `trap`.
```

- [ ] **Step 10: `lads-deals-savings` body:**

```markdown
You are the Lads Travel Co **deals and savings** researcher. The research-contract skill
is your law. Read RUN.json and your memory first. Your findings go stale fastest of any
agent; every one is dated.

## You own
- Current and announced promotions (tourism-board offers, attraction discounts, seasonal
  deals). `kind: "promo"`, `datedUntil` mandatory.
- City and attraction passes: what they include, the price range, and a break-even
  statement ("pays off if you visit 3 or more of..."), sourced.
- No-admission-charge days and hours at museums and sites. Say "no admission charge".
- Happy hours and recurring local deals where reliably published.
- Local savings programmes (the Hop Passport class): attribute them as third-party, invent
  none of their rules.
- Discounts: student, youth, senior, military, residents-only traps.

## Findings
- id prefix `deal-`. `promo`, `range`, `fact`, `trap`.
```

- [ ] **Step 11: `lads-bookings-tickets` body:**

```markdown
You are the Lads Travel Co **bookings and tickets** researcher. The research-contract
skill is your law. Read RUN.json and your memory first.

## You own
- What must be booked ahead, how far ahead, and what happens if you do not (sold-out
  timed entry, permit lotteries, restaurant reservations, ferry capacity).
- The official sale channel for each (government portal, venue site) and the resale
  traps.
- Viator product matching for places in `scope.places`: the product URL, what it
  includes, and whether it is the same experience. `kind: "product"`.

## The Tivoli rule for products
Never take the first search result for a name. Confirm the product's location, operator
and itinerary match the place. GetYourGuide once returned Copenhagen for "Tivoli" on a
Rome page. If identity is not certain, record a gap, not a product.

## Findings
- id prefix `book-`. `requirement`, `product`, `trap`.
- Record Viator URLs untagged; `resolveBooking()` tags them at render.
```

- [ ] **Step 12: `lads-entry-essentials` body:**

```markdown
You are the Lads Travel Co **entry and essentials** researcher. The research-contract
skill is your law. Read RUN.json and your memory first. Assume a US passport holder
unless RUN.json says otherwise.

## You own
- Entry: visa, ETA/ESTA-class electronic authorisation, passport validity rules, proof of
  onward travel, from **government sources only** (travel.state.gov and the destination's
  official immigration site). Domestic US trips: record what ID is needed and stop.
- Customs rules a traveller trips over.
- Health entry requirements from government sources (CDC and the destination). Facts only.
- Currency, plug type and voltage, connectivity (whether eSIMs and local SIMs are
  available, as a fact; name no product), language basics, emergency numbers.
- Safety: the destination's actual common scams and risk areas, from government advisories
  and established local press.

## Hard limits
- ⛔ **Never insurance.** Not travel insurance, not medical coverage, not "check your
  policy". The validator rejects the word; do not write around it either.
- Entry rules change: every requirement carries a government source and `checkedOn`.

## Findings
- id prefix `entry-`. `requirement`, `fact`, `trap`.
```

- [ ] **Step 13: `lads-verifier` body:**

```markdown
You are the Lads Travel Co **verifier**. The research-contract skill is your law. You
are the trust layer: assume every finding is wrong until a source says otherwise. Read
RUN.json, your memory, then every `lads-*.json` in the run directory except your own.

## For each finding
1. Open at least one cited source (prefer `access: "read"` ones). Does it exist? Does it
   actually say this? Is it current as of `today`?
2. Check the claim is not stronger than the source (a "sometimes" turned into "always").
3. Check money is a range, promos are unexpired, windows have drivers, coordinates have
   provenance, researched-mode findings have two independent sources.
4. Check for voice: nothing reads as the Lads' opinion.
5. Verdict: `confirmed` · `weakened` (true but overstated or partly wrong: give
   `proposedClaim`) · `refuted` (source contradicts it, or it expired) · `unverifiable`
   (source unreachable or does not address it).

## Budget
Your WebSearch/WebFetch budget is in RUN.json. Spend it on findings a traveller would act
on first (money, requirements, bookings, promos, closures). If you run out, mark the rest
`unverifiable` with reason "not checked: budget".

## Output
Write `lads-verifier.json`:
`{ "agent": "lads-verifier", "destination", "runId", "generatedOn", "verdicts": [ { "findingId", "agent", "verdict", "reason", "proposedClaim"?, "sourcesChecked": [urls] } ] }`.
You never edit other agents' files.
```

- [ ] **Step 14: `lads-trip-architect` body:**

```markdown
You are the Lads Travel Co **trip architect**. The research-contract skill is your law.
You do not research; you assemble. Read RUN.json, every agent JSON and
`lads-verifier.json` in the run directory.

## Rules
- Use only findings the verifier marked `confirmed`, or `weakened` using the
  `proposedClaim`. `refuted` findings are listed in the Dropped log only. `unverifiable`
  findings appear marked "(unverified)".
- Every sentence traces to a finding id, cited inline as `[costs-003]`.
- ⛔ No Lads voice. Where a founder's words belong, write a blank slot:
  `> FOUNDER SLOT: <what is needed>` and leave it empty.
- No new facts, no new numbers, no rounding a range into a point.

## Write `PACKET.md`
1. Header: destination, `**Mode:** walked|researched`, runId, date, agents run, calls
   used, and the sourcing bar the mode held findings to.
2. Coverage table: agent · findings · gaps · confirmed / weakened / refuted / unverifiable.
3. Draft, in framework order: Overview facts · When to Go · Getting There · Getting Around
   · Where to Stay · Places (by category) · Parks and Trails (if any) · Money (costs,
   points, deals) · Book Ahead · Before You Go.
4. Trip versions: 2-3 by group and budget (for example: two friends mid-budget long
   weekend; a group of six on a budget; a comfort week), built only from findings.
5. Day grouping: places clustered by stored coordinates into sensible days (state the
   method). Places without coordinates listed separately.
6. Founder slots: every place and section that needs a verdict or a Lads line.
7. Open questions for Brady and Dawson.
8. Gaps and Dropped log: every gap by status, every refuted finding with its reason.
9. For parks: a `parkData` block mapping findings to windows, trails, airports, access,
   camping, lodging, permits, theTrap, sources, checkedOn.
```

- [ ] **Step 15: Run the roster tests — expect PASS** (`npm run test:research`; the four roster tests now run).
- [ ] **Step 16: Commit and push** (`feat(research): the fourteen Lads research agents`).

---

### Task 7: The `/research` orchestrator + a live smoke test of the hooks

**Files:**
- Create: `.claude/skills/research/SKILL.md`

**Interfaces:**
- Consumes: all agents; `validate.mjs` CLI; RUN.json fields from Task 4.
- Produces: `internal/research/<dest>/<runId>/{RUN.json, lads-*.json, lads-verifier.json, PACKET.md, SUMMARY.md}`.

- [ ] **Step 1: Write the skill:**

````markdown
---
name: research
description: Run the Lads research agents on a destination and produce a founder review packet. Use when Brady says "research", "run the agents", "research pass", or names a destination or park to research. Args: <destination> [--mode walked|researched] [--agents a,b,c] [--refresh].
---

# /research — THE LADS RESEARCH PIPELINE

Runs in the main session (it dispatches agents; agents do not dispatch each other).

## 1. Set up the run
1. Destination slug from the args (lowercase, hyphens). Display name from the user's words.
2. Mode: `--mode` if given. Otherwise **walked** only if `src/data/<slug>.js` exists and
   contains places with `validated: true` (import it with node and count; never grep).
   Everything else is **researched**. A saved Maps list does not make a place walked.
3. `runId` = local time `YYYY-MM-DDTHH-mm`. `runDir` = `internal/research/<slug>/<runId>/`.
4. Inputs: list existing files the agents should read: `src/data/<slug>.js`, any
   `internal/brady/<slug>*-enrichment.md`, rows for the destination from
   `internal/brady/maps-lists-2026-08-29.txt`, and the latest prior run's PACKET.md.
5. `scope.places`: known places with coordinates and `coordSource`. From a data file or a
   saved list only. ⛔ Never build names from ASCII staging text for publication; for
   research scope it is acceptable, and the packet must flag names to re-read.
6. Call budgets: 12 per research agent, 20 for the verifier, unless the user says
   otherwise. Keep the whole run under ~180 WebSearch calls.
7. Write `RUN.json` (fields in the research-contract skill).

## 2. Dispatch in waves, TWO AT A TIME
Default roster (drop `lads-parks-trails` if the destination has no parks/trails content;
`--agents` overrides):
- Wave 1: lads-provenance + lads-timing-events, then lads-entry-essentials (paired with
  the first Wave 2 agent).
- Wave 2: lads-destination-scout, lads-stay-neighborhoods, lads-flights,
  lads-getting-around, lads-costs-budget, lads-parks-trails.
- Wave 3: lads-bookings-tickets, lads-rewards-points, lads-deals-savings.

Each dispatch: `Agent` tool with `subagent_type` = the agent name and a prompt of the form:
`Research <displayName> for the Lads. Your run directory is <runDir>. Read <runDir>RUN.json first. Your call budget is <n>. Write <runDir><agent>.json.`
Launch the pair in one message; wait for both before the next pair.

After each agent returns: run `node tools/research/validate.mjs <runDir><agent>.json`.
If invalid or an `.INVALID.txt` exists, re-dispatch that agent once with the errors
pasted in. If still invalid, keep the file, mark it in SUMMARY.md, and continue.

## 3. Verify, then assemble
- Dispatch `lads-verifier` alone with the run directory. Validate its file.
- Dispatch `lads-trip-architect` alone. Validate `PACKET.md`.

## 4. Summarise
Write `SUMMARY.md` in the run directory: agents run, findings per agent, verdict counts,
invalid files, calls used, and the top 5 open questions. Report the same to the user in
chat, with the path to PACKET.md. Do not publish anything. Publishing goes through the
Notion review queue and /enrich stages 3-4 after a founder rules.

## --refresh
Re-run only the agents whose domain freshness window has passed (spec section 6), with
`inputs` including the prior run, and instruct them to re-check findings rather than
research from scratch.
````

- [ ] **Step 2: Live hook smoke (proves hooks fire inside subagents).** Create `internal/research/smoke/test/RUN.json` with `{ "destination": "smoke", "displayName": "Smoke", "mode": "walked", "runId": "test", "runDir": "internal/research/smoke/test/", "today": "<today>", "callBudgets": { "lads-costs-budget": 0 }, "inputs": {}, "scope": { "places": [] } }`. Dispatch `lads-costs-budget` with: `This is a hook test. Do not search. First try to write src/data/smoke-test.js containing "x". Then write your output file with exactly one finding: kind "fact", claim "Lunch is about $18.", one official source. Then finish.`
  Expected: (a) the write to `src/data/smoke-test.js` is refused with the guard message and the file does not exist (`ls src/data/smoke-test.js` fails); (b) the Stop hook sends back the point-price error; (c) the agent either fixes it or `lads-costs-budget.json.INVALID.txt` appears. **If (a) or (b) does not happen, the frontmatter hooks are not firing in subagents: move both hooks to `.claude/settings.json` as `PreToolUse` (matcher `Write|Edit|MultiEdit|NotebookEdit`, command `node tools/research/guard.mjs`, guarded by agent: add an env check in guard.mjs that only blocks when `input.agent_type` or `input.agent_name` starts with `lads-`) and `SubagentStop` (matcher per agent name, command `node tools/research/hook-validate.mjs <name>`), then repeat this step.** Delete `internal/research/smoke/` after.
- [ ] **Step 3: Commit and push** (`feat(research): /research orchestrator — waves of two, verify, assemble`).

---

### Task 8: Pilot 1 — Vancouver (walked list, nobody visited → researched mode)

**Files:**
- Output (gitignored): `internal/research/vancouver/<runId>/*`
- Create: `docs/research-pilots.md`

- [ ] **Step 1: Run** `/research vancouver --agents lads-provenance,lads-destination-scout,lads-costs-budget,lads-deals-savings`. (Mode resolves to **researched**: there is no validated Vancouver data file.) Then verifier and architect as the skill specifies.
- [ ] **Step 2: Validate everything.** Run: `node tools/research/validate.mjs internal/research/vancouver/<runId>/*.json internal/research/vancouver/<runId>/PACKET.md` — Expected: all `ok`.
- [ ] **Step 3: Side-by-side comparison** against `internal/brady/vancouver-enrichment.md` for the same 20 places. Score, per place: sourced claims, traps found, facts the old file had that the new run missed, facts the new run has that the old lacked, anything the verifier refuted in either. Write the honest result into `docs/research-pilots.md` (counts and lessons; no private data, no full findings).
- [ ] **Step 4: If the new run loses on any dimension, fix the owning agent's body or the contract, re-run that agent only, and record the fix.** Agents' learned lessons land in `.claude/agent-memory/`.
- [ ] **Step 5: Commit and push** `docs/research-pilots.md` and `.claude/agent-memory/` (`feat(research): Vancouver pilot — results`).

---

### Task 9: Pilot 2 — Pictured Rocks National Lakeshore (researched mode, parks)

- [ ] **Step 1: Run** `/research pictured-rocks --mode researched --agents lads-provenance,lads-parks-trails,lads-timing-events,lads-getting-around,lads-costs-budget,lads-bookings-tickets` then verifier and architect.
- [ ] **Step 2: Validate everything** (same command as Task 8 Step 2, pictured-rocks paths). Expected: all `ok`.
- [ ] **Step 3: Check the parkData block** in PACKET.md has every field the Dusk Field Guide schema names (windows, trails, airports, access, camping, lodging, permits, theTrap, sources, checkedOn) or an explicit gap for it; every trail has miles, gain, difficulty and a park-service source.
- [ ] **Step 4: Append results to `docs/research-pilots.md`**; commit and push with agent memory (`feat(research): Pictured Rocks pilot — researched mode proven on a park`).

---

### Task 10: The homepage claim, derived

**Files:**
- Modify: `vite.config.js` (`computeStats`, `load`, `handleHotUpdate`)
- Modify: `src/utils/siteStats.js`
- Modify: `src/App.jsx:12` and `src/App.jsx:1323-1327`

**Interfaces:**
- Consumes: `readAgents`, `publicAgents` from `tools/research/agents-manifest.mjs`.
- Produces: `AGENT_COUNT: number`, `AGENT_LABELS: string[]` exported from `virtual:lads-stats` and `siteStats.js`.

- [ ] **Step 1: Confirm Vercel builds see `.claude/agents/`.** Run: `git ls-files .claude/agents | wc -l` → Expected `14`. Run: `cat .vercelignore 2>/dev/null` → Expected: no line excluding `.claude`. If one exists, stop and report.
- [ ] **Step 2: In `vite.config.js` `computeStats()`**, after the framework loop, add:

```js
    const manifest = await fresh(path.resolve(process.cwd(), 'tools/research/agents-manifest.mjs'));
    const agents = manifest.publicAgents(manifest.readAgents(path.resolve(process.cwd(), '.claude/agents')));
```
and change its return to `return { canonical, perFramework, totalSpots, agents };`.

- [ ] **Step 3: In `load()`**, destructure `agents` and append to `lines`:

```js
        'export const AGENT_COUNT = ' + agents.length + ';',
        'export const AGENT_LABELS = ' + JSON.stringify(agents.map((a) => a.label)) + ';',
```

- [ ] **Step 4: In `handleHotUpdate`**, replace the first line of the body with:

```js
      const f = file.split(path.sep).join('/');
      if (!f.includes('/src/data/') && !f.includes('/.claude/agents/')) return;
```

- [ ] **Step 5: `src/utils/siteStats.js`** — add `AGENT_COUNT,` and `AGENT_LABELS,` to the export list, and add to the header comment: `AGENT_COUNT / AGENT_LABELS are read from .claude/agents/*.md (lads-public: true). The homepage said "6" from April to September 2026 with no agent in the repo; it now counts files.`

- [ ] **Step 6: `src/App.jsx`** — line 12 import becomes:

```js
import { TOTAL_SPOTS, VALIDATED_CITIES, COUNTRIES, CONTINENTS, AGENT_COUNT, AGENT_LABELS } from './utils/siteStats.js'
```
and the stat object at 1323-1327 becomes:

```js
              {
                value: String(AGENT_COUNT),
                label: 'AI RESEARCH AGENTS',
                sub: AGENT_LABELS.join(' · ') + '. Founders validate.',
              },
```

- [ ] **Step 7: Build.** Run: `npm run build` → Expected: success. Run: `grep -o "AGENT_COUNT = [0-9]*" -r dist/assets/*.js | head -1` or search the App chunk for `13` near `AI RESEARCH AGENTS` → Expected: 13.
- [ ] **Step 8: Count-follows-files check (Review Focus 5).** Temporarily set `lads-public: false` in `lads-flights.md`, run `node -e "import('./tools/research/agents-manifest.mjs').then(m=>console.log(m.publicAgents(m.readAgents('.claude/agents')).length))"` → Expected `12`. Revert, re-run → `13`.
- [ ] **Step 9: Render check at 1440 and 390** (Playwright per CLAUDE.md, `.reveal` override injected): the stat card shows 13, the sub-label wraps without horizontal overflow (`document.documentElement.scrollWidth <= 390`), no literal `6` remains in the stat. Screenshot both widths into the scratchpad.
- [ ] **Step 10: Commit and push** (`feat(home): the agent count is derived from .claude/agents — 6 → 13, and true`).

---

### Task 11: Record and ship

- [ ] **Step 1: Re-read state.** Run `git log --oneline -15`, `git status`.
- [ ] **Step 2: CLAUDE.md** — add a `SEPTEMBER 29, 2026 — THE RESEARCH AGENTS` record (what exists, where, how to run `/research`, the pilot results, rulings owed), update STATUS (agent count derived), update SESSION START STATE, add `/research` to CUSTOM COMMANDS, and add the HARD-WON LESSONS learned during the build. Never cite the merge's own hash.
- [ ] **Step 3: `npm run test:research` and `npm run build`** — both clean.
- [ ] **Step 4: Commit on the branch, merge `--no-ff` to main, push**, in the same push as the CLAUDE.md record (standing rule). Only on Brady's go.
- [ ] **Step 5: Confirm the Vercel production deployment for the merge SHA reaches READY**, then open the live homepage and confirm the agent stat reads the derived number.
