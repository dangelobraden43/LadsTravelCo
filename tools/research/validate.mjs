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

/* Every money amount is checked ON ITS OWN: it passes only if it is one end of
 * a range. (Until the Sept 29 review, one range anywhere in a claim excused
 * every other amount in it: "Entry is $25; tours run $40-60" passed.) */
const CUR = 'USD|CAD|EUR|GBP|PEN|AUD|ISK|CZK|PLN|CRC|MXN'
const CUR_WORDS = 'dollars?|euros?|soles?|pounds?|kr|kronur|koruna|zloty|colones'
const NUM = '\\d[\\d,]*(?:\\.\\d+)?'
const MONEY_G = new RegExp(
  '(?:(?:[$\u20ac\u00a3]|S\\/)\\s?' + NUM + ')' +
  '|(?:\\b(?:' + CUR + ')\\s?' + NUM + ')' +
  '|(?:\\b' + NUM + '\\s?(?:' + CUR + '|' + CUR_WORDS + ')\\b)', 'gi')
const SEP = '(?:-|\u2013|\u2014|to|and)'
const RANGE_BEFORE = new RegExp('\\d[\\d,.]*\\s*' + SEP + '\\s*$', 'i')
const RANGE_AFTER = new RegExp('^\\s*' + SEP + '\\s*(?:[$\u20ac\u00a3]|S\\/)?\\s*\\d', 'i')

export const localToday = () => new Date().toLocaleDateString('en-CA')

export function scanBanned(text) {
  if (!text) return []
  return BANNED.filter((b) => b.re.test(text)).map((b) => b.why)
}

export function hasPointPrice(text) {
  if (!text) return false
  for (const m of String(text).matchAll(MONEY_G)) {
    const before = text.slice(0, m.index)
    const after = text.slice(m.index + m[0].length)
    if (!RANGE_BEFORE.test(before) && !RANGE_AFTER.test(after)) return true
  }
  return false
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
      if (typeof v.low !== 'number' || typeof v.high !== 'number' || !(v.low < v.high)) errs.push(`${at}: range needs numeric low < high (value.low, value.high)`)
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
    if ((hasPointPrice(f.claim) || hasPointPrice(f.notes)) && !officialFee) errs.push(`${at}: point price in claim or notes; state a range, or set fixedPrice with an official source`)

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
