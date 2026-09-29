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
test('missing or invalid mode fails', () => {
  assert.match(validateFindingsFile(goodDoc({ mode: 'maybe' }), { today: TODAY }).join('\n'), /mode/)
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
test('hasPointPrice: a range elsewhere in the claim does not excuse a point price (review #1)', () => {
  assert.equal(hasPointPrice('Entry is $25; guided tours run $40-60.'), true)
  assert.equal(hasPointPrice('Ages 12-17 pay $15.'), true)
  assert.equal(hasPointPrice('Trains leave 2-3 times hourly; fare $12.'), true)
  assert.equal(hasPointPrice('Open 9 to 5; entry $20.'), true)
})
test('hasPointPrice: currency words and symbols outside the ISO list', () => {
  assert.equal(hasPointPrice('Entry is 25 euros.'), true)
  assert.equal(hasPointPrice('The train is S/ 152 one way.'), true)
  assert.equal(hasPointPrice('A beer is 30 dollars here.'), true)
  assert.equal(hasPointPrice('Tickets run 20-30 euros.'), false)
  assert.equal(hasPointPrice('Tickets run S/ 150 to 250.'), false)
})
test('hasPointPrice: genuine ranges in every written form pass', () => {
  assert.equal(hasPointPrice('Lunch runs $15-$25.'), false)
  assert.equal(hasPointPrice('A mid-range day runs CAD 180-260 per person.'), false)
  assert.equal(hasPointPrice('Fares run USD 400 to 650 in winter.'), false)
})
test('a point price hidden in notes is caught too', () => {
  const d = withFinding({ notes: 'Parking is $40 a day.' })
  assert.match(validateFindingsFile(d, { today: TODAY }).join('\n'), /point price/)
})
/* Brady, Sept 29: a budget the agents add up themselves may ship, as long as it
 * is rooted in sourced findings. derivedFrom makes that checkable. */
function derivedDoc(derivedFrom) {
  const d = goodDoc()
  d.findings.push({
    id: 'costs-002', topic: 'lunch', kind: 'range', claim: 'A casual lunch runs CAD 10-18.',
    value: { low: 10, high: 18, currency: 'CAD' }, sources: [src()], checkedOn: TODAY, confidence: 'high', notes: '',
  })
  d.findings.push({
    id: 'costs-010', topic: 'daily-budget', kind: 'range', claim: 'A mid-range day adds up to CAD 60-120 before lodging.',
    value: { low: 60, high: 120, currency: 'CAD' }, derivedFrom, sources: [src()], checkedOn: TODAY, confidence: 'medium',
    notes: 'Two meals from costs-002 plus a transit day from costs-001.',
  })
  return d
}
test('derived budget that names real, sourced inputs passes', () => {
  assert.deepEqual(validateFindingsFile(derivedDoc(['costs-001', 'costs-002']), { today: TODAY }), [])
})
test('derived budget naming a finding that does not exist fails', () => {
  assert.match(validateFindingsFile(derivedDoc(['costs-001', 'costs-999']), { today: TODAY }).join('\n'), /derivedFrom.*costs-999/)
})
test('derivedFrom must be a non-empty list', () => {
  assert.match(validateFindingsFile(derivedDoc([]), { today: TODAY }).join('\n'), /derivedFrom/)
})
test('a finding cannot be derived from itself', () => {
  assert.match(validateFindingsFile(derivedDoc(['costs-010']), { today: TODAY }).join('\n'), /derivedFrom/)
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
