# Intake Phase 1 — Intakes Flowing — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A traveller can complete the `/plan-your-trip` quiz (organiser and companion flows) on a phone, and the answers land in Airtable as a triage-ready intake.

**Architecture:** Pure-JS intake logic (schema, hard limits, group merge) in `src/intake/` is shared by the React quiz and by Vercel functions in `api/`. The functions write to Airtable through its REST API and fall back to a no-store "stub" mode until env vars exist, so the UI can be built, deployed at a hidden URL and click-tested before Brady supplies credentials.

**Tech Stack:** React 19 + Vite + React Router (existing), Vercel Node functions (`api/*.js`, ESM), Airtable REST API via `fetch`, Cloudflare Turnstile (optional, env-gated), `node:test`.

**Spec:** `docs/superpowers/specs/2026-10-06-intake-to-guide-design.md` · **Approved prototype (source of truth for screens and copy):** `docs/superpowers/specs/2026-10-06-intake-prototype.html`

## Global Constraints

- Route `/plan-your-trip` (organiser) and `/plan-your-trip/join/:invite` (companion). Not in nav, not in sitemap, `noindex` until `INTAKE_LIVE` is true.
- Phone-first: tap targets ≥ 44px, no plain `<select>`, no drag, no slider without typed alternative, "(optional)" labels, no asterisks.
- Never the word "free" in copy. Never a price stated by us; budget bands are the traveller's answer options.
- Site palette tokens from `src/index.css`; the six step inks are new and used only on this route.
- No client data in the repo or the bundle. Secrets only in Vercel env: `AIRTABLE_TOKEN`, `AIRTABLE_BASE_ID`, `TURNSTILE_SECRET`, `VITE_TURNSTILE_SITE_KEY`.
- Tests: `node --test "tools/**/*.test.mjs"` (`npm test`). Every logic module gets a test file in `tools/tests/`.
- `npm run build` clean before every commit; push after every verified task (checkpoint rule).

## Review Focus

1. **Refresh or closed tab mid-quiz** — answers must survive (localStorage draft, then server resume token). Test: reducer state round-trips through `serializeDraft`/`parseDraft` (Task 4).
2. **A companion link opened after the organiser already submitted** — companion answers must still save and attach. Test: `handleCompanion` saves when the intake status is `New` (Task 3).
3. **Group limits disagree** (organiser "3 to 5 hours", companion "1 to 3 hours") — the strictest wins and the review page names who it is for. Test in Task 1.
4. **Credentials missing in production** — submit must not throw or lose data; the function returns `stored:false` and the UI tells the traveller to email us instead. Test in Task 2/3.
5. **Bots and accidental double-submits** — honeypot filled, or submitted in under 45 s, is rejected; a second final submit of the same resume token updates, not duplicates. Tests in Tasks 2 and 3.

---

## File structure

| File | Responsibility |
|---|---|
| `src/intake/options.js` | Every option list the quiz renders (one source for UI and validation) |
| `src/intake/schema.js` | `emptyIntake`, `emptyCompanion`, `validateIntake`, `validateCompanion` |
| `src/intake/limits.js` | `strictest`, `mergeGroup`, `hardLimits` |
| `src/intake/draft.js` | `serializeDraft`, `parseDraft`, `reduceIntake` (state reducer) |
| `src/intake/config.js` | `INTAKE_LIVE` flag |
| `api/_lib/token.js` | `mintToken` |
| `api/_lib/spam.js` | `checkSpam` |
| `api/_lib/store.js` | `createStore` — Airtable or stub |
| `api/intake.js` | draft save / resume / final submit |
| `api/companion.js` | companion load + save |
| `src/PlanYourTrip.jsx` + `.css` | page shell, header (stamps + pass), nav, step router |
| `src/intake/Controls.jsx` | Chips, Seg, TilePair, Counter, Ranker, ListAdd, Typeahead |
| `src/intake/OrganiserSteps.jsx` | steps 0–6, Review, Sent |
| `src/intake/CompanionFlow.jsx` | companion steps |
| `tools/tests/intake-*.test.mjs` | tests |

---

### Task 1: Options, schema and hard limits

**Files:**
- Create: `src/intake/options.js`, `src/intake/schema.js`, `src/intake/limits.js`
- Test: `tools/tests/intake-schema.test.mjs`, `tools/tests/intake-limits.test.mjs`

**Interfaces:**
- Produces: `OPTIONS` (object of arrays), `HIKE_ORDER`, `ALT_ORDER`; `emptyIntake(): Intake`; `emptyCompanion(): Companion`; `validateIntake(i, {final:boolean}): {ok:boolean, errors:string[]}`; `validateCompanion(c): {ok, errors}`; `strictest(values:string[], order:string[]): string|null`; `mergeGroup(i, companions[]): {hike, altitude, diets:[{who, diet}], notes:[{who,text}]}`; `hardLimits(i, companions[]): {kind:string, text:string}[]`.

- [ ] **Step 1: Write `src/intake/options.js`**

```js
/* Every list the intake quiz renders. One source for the UI and validation.
 * Copy is from the prototype Brady approved on Oct 6 2026. */
export const OCCASIONS = ['Just because', 'Graduation trip', 'Birthday', 'Honeymoon or anniversary', 'Bachelor or bachelorette', 'Study abroad visit', 'Reunion', 'A big event or game']
export const HEARD = ['TikTok', 'Instagram', 'A friend', 'Google', 'In person', 'Other']
export const FEELS = ['Sun and water', 'Big city energy', 'Mountains and trails', 'Old towns and history', 'Food above all', 'Somewhere nobody we know has been']
export const FLY_FAR = ['Under 5 hours', 'Up to 9 hours', 'Anywhere']
export const BASES = ['One base', 'Two or three stops', 'On the move']
export const LENGTHS = ['A long weekend', '4 to 6 nights', '7 to 9 nights', '10 to 14 nights', '2 weeks+']
export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
export const AGES = ['Under 21', '21', '22 to 29', '30s', '40s', '50+']
export const RELATIONS = ['Friends', 'Couple', 'Family', 'Mixed group', 'Solo']
export const EXPERIENCE = ['First big trip', 'A few trips', 'Seasoned travellers']
export const PASSPORTS = ['All valid', 'Someone expires within 6 months', "Someone doesn't have one", 'Not sure']
export const SPLITS = ['Everyone pays their own', 'Split evenly', 'One person is paying', 'Not sure yet']
export const BUDGET_DAY = ['Under $100', '$100 to $175', '$175 to $275', '$275 to $400', '$400+']
export const BUDGET_TRIP = ['Under $1,500', '$1,500 to $2,500', '$2,500 to $4,000', '$4,000 to $6,000', '$6,000+']
export const FIRMNESS = ['A hard limit', 'A rough guide', 'Flexible for the right thing']
export const SPEND_ON = ['Food', 'Nightlife', 'Where we sleep', 'Experiences and tours', 'Getting around easily']
export const PAIRS = [
  { key: 'pace', a: ['⚡', 'Packed days', 'See as much as we can'], b: ['🌿', 'Slow days', 'Room to wander and rest'] },
  { key: 'plan', a: ['🗓', 'Planned', 'A plan for every hour'], b: ['🎲', 'Spontaneous', 'A few anchors, the rest open'] },
  { key: 'clock', a: ['🌅', 'Early starts', 'Beat the crowds'], b: ['🌙', 'Late nights', 'Sleep in, stay out'] },
  { key: 'fame', a: ['🏛', 'The icons', 'The famous sights, done right'], b: ['🗝', 'Hidden gems', 'Where the locals go'] },
  { key: 'guide', a: ['🎟', 'Guided', 'Tours and experts'], b: ['🧭', 'On our own', 'Just tell us where'] },
  { key: 'crowd', a: ['👥', 'Crowds are fine', 'Worth it for the big sights'], b: ['🚪', 'Avoid crowds', 'Go early, go elsewhere'] },
]
export const INTERESTS = {
  'Food & drink': ['Street food', 'Markets', 'Local classics', 'Fine dining', 'Cooking class', 'Food tour', 'Coffee and bakeries'],
  'Bars & nightlife': ['Pubs', 'Cocktail bars', 'Breweries', 'Wine bars', 'Live music', 'Clubs', 'Rooftops'],
  'History & museums': ['Big museums', 'Ruins and sites', 'Castles and palaces', 'Guided history tours', 'Small, odd museums'],
  'Outdoors & hiking': ['Day hikes', 'Multi-day treks', 'Viewpoints', 'Wildlife', 'Water sports', 'Cycling'],
  'Beaches': ['Lively beach', 'Quiet beach', 'Snorkeling', 'Surfing', 'Beach clubs'],
  'Live sport': ['Football (soccer)', 'Rugby', 'Local league games', 'Stadium tours', 'Watching in a pub'],
  'Festivals & events': ['Music festivals', 'Cultural festivals', 'Holidays and parades', 'Christmas markets'],
  'Art & architecture': ['Galleries', 'Street art', 'Churches and cathedrals', 'Modern architecture'],
  'Photography': ['Sunrise spots', 'Sunset spots', 'Cityscapes', 'Landscapes', 'Night shots'],
  'Shopping & markets': ['Flea markets', 'Local makers', 'Fashion', 'Food markets'],
  'Wellness & spas': ['Thermal baths', 'Spa day', 'Sauna', 'Yoga'],
  'Day trips': ['Nearby towns', 'Nature', 'Wine regions', 'Another country'],
}
export const DIETS = ['None', 'Allergy', 'Vegetarian', 'Vegan', 'Gluten-free', 'Halal', 'Kosher', 'Other']
export const SEVERITY = ['Mild', 'Moderate', 'Severe (anaphylaxis)']
export const DRINKING = ['Yes, we drink', 'Some of us', "We don't drink"]
export const LODGING = ['Hotel', 'Hostel', 'Apartment', 'Boutique or guesthouse', 'Resort']
export const VIBES = ['Central', 'Quiet', 'Near nightlife', 'Near nature', 'Local, not touristy']
export const SHARING = ['Shared rooms are fine', 'Everyone gets a bed', 'Private rooms']
export const AROUND = ['Walking', 'Public transit', 'Taxis and rideshare', 'A rental car', 'Bikes and scooters']
export const WALK = ['Under 5,000 steps', '5,000 to 10,000', '10,000 to 15,000', '15,000+ steps']
export const TRAVEL_DAY = ['Under 2 hours', 'Up to 4 hours', 'A full travel day']
export const ACCESS_NEEDS = ['Step-free access', 'Wheelchair', 'Limited stairs', 'Short walks only', 'Other']
export const HIKE_ORDER = ['Under 1 hour', '1 to 3 hours', '3 to 5 hours', 'A full day', 'Multi-day']
export const ALT_ORDER = ['Never been high', 'Fine up to 2,500 m', 'Fine above 3,000 m']
export const POINTS = ['Chase Ultimate Rewards', 'Amex Membership Rewards', 'Capital One', 'Citi ThankYou', 'Delta SkyMiles', 'United MileagePlus', 'American AAdvantage', 'Marriott Bonvoy', 'Hilton Honors', 'None']
export const FORMATS = ['Web guide only', 'Web guide plus a PDF']
export const CONTACT = ['Email', 'Text', 'Call']
export const AIRPORTS = [
  ['DTW', 'Detroit Metropolitan'], ['GRR', 'Grand Rapids, Gerald R. Ford'], ['ORD', "Chicago O'Hare"], ['MDW', 'Chicago Midway'],
  ['MKE', 'Milwaukee Mitchell'], ['MSP', 'Minneapolis-St Paul'], ['CLE', 'Cleveland Hopkins'], ['CMH', 'Columbus John Glenn'],
  ['IND', 'Indianapolis'], ['TVC', 'Traverse City Cherry Capital'], ['LAN', 'Lansing Capital Region'], ['AZO', 'Kalamazoo/Battle Creek'],
  ['FNT', 'Flint Bishop'], ['CVG', 'Cincinnati/Northern Kentucky'],
]
```

- [ ] **Step 2: Write the failing tests** — `tools/tests/intake-schema.test.mjs`

```js
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { emptyIntake, validateIntake, emptyCompanion, validateCompanion } from '../../src/intake/schema.js'

const filled = () => ({ ...emptyIntake(), name: 'Alex', email: 'alex@example.com', destMode: 'know', dest: 'Lisbon', dateMode: 'flex', length: '7 to 9 nights', months: ['Apr'], airport: 'DTW', adults: 4, budget: '$175 to $275', top3: ['Food & drink'] })

test('a draft only needs a name and a valid email', () => {
  assert.equal(validateIntake({ ...emptyIntake(), name: 'A', email: 'a@b.co' }, { final: false }).ok, true)
  assert.equal(validateIntake({ ...emptyIntake(), name: 'A', email: 'nope' }, { final: false }).ok, false)
})
test('a final submit needs the trip basics', () => {
  assert.equal(validateIntake(filled(), { final: true }).ok, true)
  const r = validateIntake({ ...filled(), airport: '' }, { final: true })
  assert.equal(r.ok, false)
  assert.ok(r.errors.some((e) => e.includes('airport')))
})
test('help-me-choose needs at least one feel instead of a destination', () => {
  assert.equal(validateIntake({ ...filled(), destMode: 'help', dest: '', feels: [] }, { final: true }).ok, false)
  assert.equal(validateIntake({ ...filled(), destMode: 'help', dest: '', feels: ['Sun and water'] }, { final: true }).ok, true)
})
test('fixed dates must be real and in order', () => {
  assert.equal(validateIntake({ ...filled(), dateMode: 'fixed', start: '2027-04-26', end: '2027-04-18' }, { final: true }).ok, false)
  assert.equal(validateIntake({ ...filled(), dateMode: 'fixed', start: '2027-04-18', end: '2027-04-26' }, { final: true }).ok, true)
})
test('top 3 holds one to three interests, no unknown values', () => {
  assert.equal(validateIntake({ ...filled(), top3: [] }, { final: true }).ok, false)
  assert.equal(validateIntake({ ...filled(), top3: ['Juggling'] }, { final: true }).ok, false)
})
test('free-text fields are capped so a paste cannot flood Airtable', () => {
  assert.equal(validateIntake({ ...filled(), perfectDay: 'x'.repeat(2001) }, { final: true }).ok, false)
})
test('a companion needs only a name', () => {
  assert.equal(validateCompanion({ ...emptyCompanion(), name: 'Jordan' }).ok, true)
  assert.equal(validateCompanion(emptyCompanion()).ok, false)
})
```

`tools/tests/intake-limits.test.mjs`

```js
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { strictest, mergeGroup, hardLimits } from '../../src/intake/limits.js'
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
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL — `Cannot find module '../../src/intake/schema.js'`

- [ ] **Step 4: Implement `src/intake/schema.js`**

```js
import * as O from './options.js'

export function emptyIntake() {
  return {
    name: '', email: '', phone: '', occasion: '', heard: '', optIn: true,
    destMode: 'know', dest: '', nearby: 'Yes, show us', bases: '', feels: [], flyFar: '',
    dateMode: 'flex', start: '', end: '', flexDays: '', length: '', months: [],
    airport: '',
    adults: 2, kids: 0, ages: [], rel: '', experience: '', firstAbroad: '', passport: '', split: '',
    companions: [],
    budgetMode: 'day', budget: '', budgetExact: '', firm: '', splurge: [], save: [],
    pairs: {}, top3: [], also: [], more: {}, perfectDay: '',
    diet: [], allergy: '', severity: '', crossContact: '', adventurous: null, drinking: '', bigDinner: '',
    lodging: [], vibe: [], sharing: '', lightSleepers: '',
    around: [], walk: '', drive: '', travelDay: '', earlyTransit: '', access: '', accessNeeds: [], motion: '',
    hike: '', altitude: '', heat: null,
    points: [], openCards: '',
    tenOutOfTen: '', mustDo: [], avoid: [], booked: [], loved: '', hated: '',
    shareWith: [], needBy: '', pdf: 'Web guide only', contact: 'Email',
  }
}

export function emptyCompanion() {
  return { name: '', diet: [], allergy: '', severity: '', drinking: '', hike: '', altitude: '', pairs: {}, top3: [], note: '', mustDo: '' }
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const TEXT_CAP = 2000
const ISO = /^\d{4}-\d{2}-\d{2}$/

function textFields(o) {
  return Object.entries(o).filter(([, v]) => typeof v === 'string')
}

export function validateIntake(i, { final }) {
  const errors = []
  if (!i.name || !i.name.trim()) errors.push('name: required')
  if (!EMAIL.test(i.email || '')) errors.push('email: not a valid address')
  for (const [k, v] of textFields(i)) if (v.length > TEXT_CAP) errors.push(`${k}: longer than ${TEXT_CAP} characters`)
  for (const list of ['mustDo', 'avoid', 'booked', 'shareWith']) {
    if ((i[list] || []).length > 20) errors.push(`${list}: more than 20 entries`)
  }
  if (final) {
    if (i.destMode === 'know' && !i.dest.trim()) errors.push('dest: required')
    if (i.destMode === 'help' && !i.feels.length) errors.push('feels: pick at least one')
    if (i.dateMode === 'fixed') {
      if (!ISO.test(i.start) || !ISO.test(i.end)) errors.push('dates: both required')
      else if (i.end < i.start) errors.push('dates: return is before departure')
    } else if (!i.length) errors.push('length: required')
    if (!i.airport) errors.push('airport: required')
    if (!(i.adults >= 1)) errors.push('adults: at least one')
    if (!i.budget) errors.push('budget: required')
    const known = Object.keys(O.INTERESTS)
    if (!i.top3.length || i.top3.length > 3) errors.push('top3: pick one to three')
    if (i.top3.some((t) => !known.includes(t))) errors.push('top3: unknown interest')
  }
  return { ok: errors.length === 0, errors }
}

export function validateCompanion(c) {
  const errors = []
  if (!c.name || !c.name.trim()) errors.push('name: required')
  for (const [k, v] of textFields(c)) if (v.length > TEXT_CAP) errors.push(`${k}: longer than ${TEXT_CAP} characters`)
  return { ok: errors.length === 0, errors }
}
```

- [ ] **Step 5: Implement `src/intake/limits.js`**

```js
import { HIKE_ORDER, ALT_ORDER } from './options.js'

export function strictest(values, order) {
  const idx = values.filter(Boolean).map((v) => order.indexOf(v)).filter((n) => n >= 0)
  return idx.length ? order[Math.min(...idx)] : null
}

export function mergeGroup(i, companions) {
  const people = [{ ...i, who: i.name || 'Organiser' }, ...companions.map((c) => ({ ...c, who: c.name }))]
  const diets = []
  const notes = []
  for (const p of people) {
    for (const d of p.diet || []) if (d !== 'None' && d !== 'Allergy') diets.push({ who: p.who, diet: d })
    const note = p.note && p.note.trim()
    if (note) notes.push({ who: p.who, text: note })
  }
  return {
    hike: strictest(people.map((p) => p.hike), HIKE_ORDER),
    altitude: strictest(people.map((p) => p.altitude), ALT_ORDER),
    diets,
    notes,
  }
}

const outdoors = (i) => (i.top3 || []).includes('Outdoors & hiking') || (i.also || []).includes('Outdoors & hiking')

export function hardLimits(i, companions) {
  const out = []
  const g = mergeGroup(i, companions)
  const people = [{ ...i, who: i.name }, ...companions.map((c) => ({ ...c, who: c.name }))]
  for (const p of people) {
    if ((p.diet || []).includes('Allergy')) {
      const what = (p.allergy || '').trim().toLowerCase() || 'food'
      const sev = (p.severity || '').toLowerCase()
      const cross = p.crossContact === 'Yes' ? ', including cross-contact' : ''
      const whose = p === people[0] ? 'your' : `${p.who}'s`
      out.push({ kind: 'allergy', text: `Anywhere that can't safely handle ${whose} ${sev ? `${sev} ` : ''}${what} allergy${cross}` })
    }
  }
  for (const d of g.diets) out.push({ kind: 'diet', text: `A meal without a ${d.diet.toLowerCase()} option, for ${d.who}` })
  for (const n of g.notes) out.push({ kind: 'note', text: `${n.text} (${n.who})` })
  if (i.drive === 'No') out.push({ kind: 'driving', text: 'Anything that needs someone to drive' })
  if (i.motion === 'Yes') out.push({ kind: 'motion', text: 'Long boat trips or winding mountain roads' })
  if (outdoors(i) && g.hike) out.push({ kind: 'hike', text: `Hikes longer than ${g.hike.toLowerCase()} (the group's shortest limit)` })
  if (outdoors(i) && g.altitude === 'Never been high') out.push({ kind: 'altitude', text: 'High altitude' })
  if (i.access === 'Yes' && (i.accessNeeds || []).length) out.push({ kind: 'access', text: `Places without ${i.accessNeeds.join(', ').toLowerCase()}` })
  if (i.firm === 'A hard limit' && i.budget) out.push({ kind: 'budget', text: `Going over ${i.budget} ${i.budgetMode === 'day' ? 'a day' : 'for the trip'}, per person` })
  if (i.passport && i.passport !== 'All valid') out.push({ kind: 'passport', text: 'A destination whose entry rules your passports might not meet' })
  return out
}
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `npm test`
Expected: all intake tests PASS, existing 78 still pass.

- [ ] **Step 7: Commit and push**

```bash
git add src/intake tools/tests/intake-schema.test.mjs tools/tests/intake-limits.test.mjs
git commit -m "feat(intake): options, schema and hard limits with group merge"
git push
```

---

### Task 2: Server helpers — token, spam check, store

**Files:**
- Create: `api/_lib/token.js`, `api/_lib/spam.js`, `api/_lib/store.js`
- Test: `tools/tests/intake-server.test.mjs`

**Interfaces:**
- Produces: `mintToken(bytes=16): string` (hex); `checkSpam({honeypot, startedAt, now, kind, turnstile, ip}, env, fetchImpl): Promise<{ok, reason}>`; `createStore(env, fetchImpl): Store` where `Store = { live:boolean, findIntake(resume), upsertIntake(resume, fields), findCompanion(invite), upsertCompanion(invite, fields) }`. Each method resolves `{ stored:boolean, id:string|null, fields?:object }`.

- [ ] **Step 1: Write the failing tests** — `tools/tests/intake-server.test.mjs`

```js
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mintToken } from '../../api/_lib/token.js'
import { checkSpam, MIN_MS } from '../../api/_lib/spam.js'
import { createStore } from '../../api/_lib/store.js'

test('tokens are 128-bit hex and unique', () => {
  const a = mintToken(), b = mintToken()
  assert.match(a, /^[0-9a-f]{32}$/)
  assert.notEqual(a, b)
})
test('a filled honeypot is spam', async () => {
  assert.deepEqual(await checkSpam({ honeypot: 'x', startedAt: 0, now: 999999, kind: 'intake' }, {}), { ok: false, reason: 'honeypot' })
})
test('a final intake faster than the minimum is spam', async () => {
  const r = await checkSpam({ honeypot: '', startedAt: 1000, now: 1000 + MIN_MS.intake - 1, kind: 'intake' }, {})
  assert.equal(r.reason, 'too-fast')
})
test('turnstile is skipped without a secret and enforced with one', async () => {
  const ok = await checkSpam({ honeypot: '', startedAt: 0, now: 10 ** 9, kind: 'intake' }, {})
  assert.equal(ok.ok, true)
  const fake = async () => ({ json: async () => ({ success: false }) })
  const r = await checkSpam({ honeypot: '', startedAt: 0, now: 10 ** 9, kind: 'intake', turnstile: 't' }, { TURNSTILE_SECRET: 's' }, fake)
  assert.equal(r.reason, 'turnstile')
})
test('without credentials the store is a stub that stores nothing and never throws', async () => {
  const s = createStore({})
  assert.equal(s.live, false)
  assert.deepEqual(await s.upsertIntake('abc', { Name: 'A' }), { stored: false, id: null })
  assert.deepEqual(await s.findIntake('abc'), { stored: false, id: null })
})
test('with credentials, upsert updates an existing row instead of duplicating', async () => {
  const calls = []
  const fake = async (url, opts = {}) => {
    calls.push([opts.method || 'GET', url])
    if (!opts.method) return { ok: true, json: async () => ({ records: [{ id: 'rec1', fields: { Resume: 'abc' } }] }) }
    return { ok: true, json: async () => ({ id: 'rec1', fields: {} }) }
  }
  const s = createStore({ AIRTABLE_TOKEN: 't', AIRTABLE_BASE_ID: 'app1' }, fake)
  const r = await s.upsertIntake('abcdef0123456789abcdef0123456789', { Name: 'A' })
  assert.equal(r.id, 'rec1')
  assert.equal(calls.filter(([m]) => m === 'POST').length, 0)
  assert.equal(calls.filter(([m]) => m === 'PATCH').length, 1)
})
test('an Airtable error resolves stored:false rather than throwing', async () => {
  const fake = async () => ({ ok: false, status: 500, json: async () => ({}) })
  const s = createStore({ AIRTABLE_TOKEN: 't', AIRTABLE_BASE_ID: 'app1' }, fake)
  assert.equal((await s.upsertIntake('abcdef0123456789abcdef0123456789', {})).stored, false)
})
test('a resume token with a quote cannot break the Airtable formula', async () => {
  let seen = ''
  const fake = async (url) => { seen = decodeURIComponent(url); return { ok: true, json: async () => ({ records: [] }) } }
  await createStore({ AIRTABLE_TOKEN: 't', AIRTABLE_BASE_ID: 'app1' }, fake).findIntake("x' OR 1=1")
  assert.ok(!seen.includes("'x' OR"))
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test` — Expected: FAIL, module not found.

- [ ] **Step 3: Implement `api/_lib/token.js`**

```js
import { randomBytes } from 'node:crypto'
export const mintToken = (bytes = 16) => randomBytes(bytes).toString('hex')
```

- [ ] **Step 4: Implement `api/_lib/spam.js`**

```js
/* Three cheap checks before a human ever reads an intake: a hidden field only bots
 * fill, a floor on how fast a person can finish, and Cloudflare Turnstile when its
 * secret is configured. Founder triage is the fourth. */
export const MIN_MS = { intake: 45_000, companion: 12_000 }

export async function checkSpam({ honeypot, startedAt, now, kind, turnstile, ip }, env, fetchImpl = fetch) {
  if (honeypot) return { ok: false, reason: 'honeypot' }
  if (!(now - startedAt >= MIN_MS[kind])) return { ok: false, reason: 'too-fast' }
  if (env.TURNSTILE_SECRET) {
    try {
      const body = new URLSearchParams({ secret: env.TURNSTILE_SECRET, response: turnstile || '', remoteip: ip || '' })
      const res = await fetchImpl('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body })
      const out = await res.json()
      if (!out.success) return { ok: false, reason: 'turnstile' }
    } catch {
      return { ok: false, reason: 'turnstile' }
    }
  }
  return { ok: true, reason: null }
}
```

- [ ] **Step 5: Implement `api/_lib/store.js`**

```js
/* Airtable when credentials exist, a stub that stores nothing otherwise. The stub
 * lets the quiz be built, deployed at a hidden URL and click-tested before Brady
 * creates the token. It never throws: a lost intake is worse than a reported one. */
const TABLES = { intake: 'Intakes', companion: 'Companions' }
const KEY = { intake: 'Resume', companion: 'Invite' }
const SAFE = /^[0-9a-f]{16,64}$/

export function createStore(env, fetchImpl = fetch) {
  const live = Boolean(env.AIRTABLE_TOKEN && env.AIRTABLE_BASE_ID)
  const none = { stored: false, id: null }
  const base = `https://api.airtable.com/v0/${env.AIRTABLE_BASE_ID}`
  const headers = { Authorization: `Bearer ${env.AIRTABLE_TOKEN}`, 'Content-Type': 'application/json' }

  async function find(kind, key) {
    if (!live || !SAFE.test(key || '')) return none
    try {
      const formula = encodeURIComponent(`{${KEY[kind]}}='${key}'`)
      const res = await fetchImpl(`${base}/${encodeURIComponent(TABLES[kind])}?maxRecords=1&filterByFormula=${formula}`, { headers })
      if (!res.ok) return none
      const rec = (await res.json()).records?.[0]
      return rec ? { stored: true, id: rec.id, fields: rec.fields } : none
    } catch {
      return none
    }
  }

  async function upsert(kind, key, fields) {
    if (!live || !SAFE.test(key || '')) return none
    try {
      const found = await find(kind, key)
      const url = `${base}/${encodeURIComponent(TABLES[kind])}${found.id ? `/${found.id}` : ''}`
      const res = await fetchImpl(url, {
        method: found.id ? 'PATCH' : 'POST',
        headers,
        body: JSON.stringify({ fields: { ...fields, [KEY[kind]]: key }, typecast: true }),
      })
      if (!res.ok) return none
      const rec = await res.json()
      return { stored: true, id: rec.id }
    } catch {
      return none
    }
  }

  return {
    live,
    findIntake: (k) => find('intake', k),
    upsertIntake: (k, f) => upsert('intake', k, f),
    findCompanion: (k) => find('companion', k),
    upsertCompanion: (k, f) => upsert('companion', k, f),
  }
}
```

Note: the formula test passes because `SAFE` rejects the quoted token before any request is made.

- [ ] **Step 6: Run tests, verify pass.** `npm test` → PASS.

- [ ] **Step 7: Commit and push** — `git add api/_lib tools/tests/intake-server.test.mjs && git commit -m "feat(intake): token, spam check and Airtable store with stub mode" && git push`

---

### Task 3: The two functions

**Files:**
- Create: `api/intake.js`, `api/companion.js`
- Test: `tools/tests/intake-api.test.mjs`

**Interfaces:**
- Consumes: Task 1 (`validateIntake`, `validateCompanion`, `hardLimits`), Task 2 (`mintToken`, `checkSpam`, `createStore`).
- Produces: `handleIntake(req, deps): Promise<{status:number, json:object}>` and `handleCompanion(req, deps)` where `req = {method, query, body, ip}` and `deps = {store, env, now, fetchImpl}`. HTTP contract:
  - `POST /api/intake` body `{resume?, data, final, meta:{honeypot, startedAt, turnstile}}` → `200 {resume, status:'draft'|'new', stored, invites:[{name, invite}]}`; `400 {errors}`; `422 {reason}` when spam.
  - `GET /api/intake?resume=…` → `200 {data}` or `404`.
  - `GET /api/companion?invite=…` → `200 {organiser, dest}` (first name and destination only) or `404`.
  - `POST /api/companion` body `{invite, data, meta}` → `200 {stored}`.

- [ ] **Step 1: Write the failing tests** — `tools/tests/intake-api.test.mjs`

```js
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { handleIntake } from '../../api/intake.js'
import { handleCompanion } from '../../api/companion.js'
import { emptyIntake, emptyCompanion } from '../../src/intake/schema.js'

function memStore() {
  const rows = { intake: new Map(), companion: new Map() }
  const s = (k) => ({
    find: async (key) => (rows[k].has(key) ? { stored: true, id: key, fields: rows[k].get(key) } : { stored: false, id: null }),
    upsert: async (key, f) => { rows[k].set(key, { ...(rows[k].get(key) || {}), ...f }); return { stored: true, id: key } },
  })
  return { rows, live: true, findIntake: s('intake').find, upsertIntake: s('intake').upsert, findCompanion: s('companion').find, upsertCompanion: s('companion').upsert }
}
const full = { ...emptyIntake(), name: 'Alex', email: 'a@b.co', dest: 'Lisbon', length: '7 to 9 nights', airport: 'DTW', budget: '$175 to $275', top3: ['Food & drink'], companions: [{ name: 'Jordan' }] }
const deps = (store) => ({ store, env: {}, now: 10 ** 9 })

test('a draft save mints a resume token and stores status Draft', async () => {
  const store = memStore()
  const r = await handleIntake({ method: 'POST', body: { data: { ...emptyIntake(), name: 'A', email: 'a@b.co' }, final: false, meta: { startedAt: 0 } } }, deps(store))
  assert.equal(r.status, 200)
  assert.match(r.json.resume, /^[0-9a-f]{32}$/)
  assert.equal(store.rows.intake.get(r.json.resume).Status, 'Draft')
})
test('the same resume token updates, never duplicates', async () => {
  const store = memStore()
  const a = await handleIntake({ method: 'POST', body: { data: full, final: false, meta: { startedAt: 0 } } }, deps(store))
  await handleIntake({ method: 'POST', body: { resume: a.json.resume, data: full, final: true, meta: { startedAt: 0 } } }, deps(store))
  assert.equal(store.rows.intake.size, 1)
  assert.equal(store.rows.intake.get(a.json.resume).Status, 'New')
})
test('final submit stores hard limits and triage columns', async () => {
  const store = memStore()
  const r = await handleIntake({ method: 'POST', body: { data: { ...full, drive: 'No' }, final: true, meta: { startedAt: 0 } } }, deps(store))
  const row = store.rows.intake.get(r.json.resume)
  assert.equal(row.Destination, 'Lisbon')
  assert.ok(row['Hard limits'].includes('drive'))
})
test('companions get invite tokens and stub rows', async () => {
  const store = memStore()
  const r = await handleIntake({ method: 'POST', body: { data: full, final: false, meta: { startedAt: 0 } } }, deps(store))
  assert.equal(r.json.invites.length, 1)
  assert.equal(store.rows.companion.get(r.json.invites[0].invite).Status, 'Waiting')
})
test('spam is rejected with 422 and nothing stored', async () => {
  const store = memStore()
  const r = await handleIntake({ method: 'POST', body: { data: full, final: true, meta: { honeypot: 'bot', startedAt: 0 } } }, deps(store))
  assert.equal(r.status, 422)
  assert.equal(store.rows.intake.size, 0)
})
test('invalid final data is a 400 with field errors', async () => {
  const r = await handleIntake({ method: 'POST', body: { data: { ...full, airport: '' }, final: true, meta: { startedAt: 0 } } }, deps(memStore()))
  assert.equal(r.status, 400)
})
test('the stub store still answers 200 with stored:false', async () => {
  const stub = { live: false, findIntake: async () => ({ stored: false, id: null }), upsertIntake: async () => ({ stored: false, id: null }), findCompanion: async () => ({ stored: false, id: null }), upsertCompanion: async () => ({ stored: false, id: null }) }
  const r = await handleIntake({ method: 'POST', body: { data: full, final: true, meta: { startedAt: 0 } } }, deps(stub))
  assert.equal(r.status, 200)
  assert.equal(r.json.stored, false)
})
test('resume loads the saved answers', async () => {
  const store = memStore()
  const a = await handleIntake({ method: 'POST', body: { data: full, final: false, meta: { startedAt: 0 } } }, deps(store))
  const r = await handleIntake({ method: 'GET', query: { resume: a.json.resume } }, deps(store))
  assert.equal(r.json.data.dest, 'Lisbon')
})
test('a companion can answer after the organiser already submitted', async () => {
  const store = memStore()
  const a = await handleIntake({ method: 'POST', body: { data: full, final: true, meta: { startedAt: 0 } } }, deps(store))
  const invite = a.json.invites[0].invite
  const g = await handleCompanion({ method: 'GET', query: { invite } }, deps(store))
  assert.deepEqual(g.json, { organiser: 'Alex', dest: 'Lisbon' })
  const r = await handleCompanion({ method: 'POST', body: { invite, data: { ...emptyCompanion(), name: 'Jordan', hike: '1 to 3 hours' }, meta: { startedAt: 0 } } }, deps(store))
  assert.equal(r.json.stored, true)
  assert.equal(store.rows.companion.get(invite).Status, 'Answered')
})
test('an unknown invite is a 404', async () => {
  const r = await handleCompanion({ method: 'GET', query: { invite: 'ffffffffffffffff' } }, deps(memStore()))
  assert.equal(r.status, 404)
})
```

- [ ] **Step 2: Run to verify fail.** `npm test` → FAIL (module not found).

- [ ] **Step 3: Implement `api/intake.js`**

```js
import { validateIntake } from '../src/intake/schema.js'
import { hardLimits } from '../src/intake/limits.js'
import { mintToken } from './_lib/token.js'
import { checkSpam } from './_lib/spam.js'
import { createStore } from './_lib/store.js'

function triage(d, final) {
  return {
    Status: final ? 'New' : 'Draft',
    Name: d.name, Email: d.email, Phone: d.phone || '',
    Destination: d.destMode === 'help' ? `Help choose: ${d.feels.join(', ')}` : d.dest,
    Dates: d.dateMode === 'fixed' ? `${d.start} to ${d.end}` : `${d.length} in ${d.months.join('/')}`,
    Party: d.adults + d.kids,
    Budget: `${d.budget} ${d.budgetMode === 'day' ? 'per day' : 'per trip'} (${d.firm || 'firmness not given'})`,
    Occasion: d.occasion, Source: d.heard, 'Opt in': Boolean(d.optIn),
    'Hard limits': hardLimits(d, []).map((l) => `• ${l.text}`).join('\n'),
    Answers: JSON.stringify(d),
    ...(final ? { 'Submitted at': new Date().toISOString() } : {}),
  }
}

export async function handleIntake(req, { store, env, now, fetchImpl }) {
  if (req.method === 'GET') {
    const found = await store.findIntake(req.query?.resume)
    if (!found.stored) return { status: 404, json: { error: 'not found' } }
    return { status: 200, json: { data: JSON.parse(found.fields.Answers || '{}'), status: found.fields.Status } }
  }
  if (req.method !== 'POST') return { status: 405, json: { error: 'method' } }
  const { resume: given, data, final, meta = {} } = req.body || {}
  if (!data) return { status: 400, json: { errors: ['data: required'] } }
  const v = validateIntake(data, { final: Boolean(final) })
  if (!v.ok) return { status: 400, json: { errors: v.errors } }
  if (meta.honeypot || final) {
    const spam = await checkSpam({ ...meta, now, kind: 'intake', ip: req.ip }, env, fetchImpl)
    if (!spam.ok) return { status: 422, json: { reason: spam.reason } }
  }
  const resume = /^[0-9a-f]{32}$/.test(given || '') ? given : mintToken()
  const companions = (data.companions || []).map((c) => ({ name: String(c.name || '').slice(0, 60), invite: /^[0-9a-f]{32}$/.test(c.invite || '') ? c.invite : mintToken() }))
  const saved = await store.upsertIntake(resume, triage({ ...data, companions }, Boolean(final)))
  for (const c of companions) {
    const existing = await store.findCompanion(c.invite)
    if (!existing.stored) await store.upsertCompanion(c.invite, { Name: c.name, Intake: resume, Status: 'Waiting' })
  }
  return { status: 200, json: { resume, status: final ? 'new' : 'draft', stored: saved.stored, invites: companions } }
}

export default async function handler(req, res) {
  const out = await handleIntake(
    { method: req.method, query: req.query, body: req.body, ip: req.headers['x-forwarded-for'] },
    { store: createStore(process.env), env: process.env, now: Date.now() },
  )
  res.setHeader('Cache-Control', 'no-store')
  res.status(out.status).json(out.json)
}
```

- [ ] **Step 4: Implement `api/companion.js`**

```js
import { validateCompanion } from '../src/intake/schema.js'
import { checkSpam } from './_lib/spam.js'
import { createStore } from './_lib/store.js'

export async function handleCompanion(req, { store, env, now, fetchImpl }) {
  const invite = req.method === 'GET' ? req.query?.invite : req.body?.invite
  const row = await store.findCompanion(invite)
  if (!row.stored) return { status: 404, json: { error: 'not found' } }
  const intake = await store.findIntake(row.fields.Intake)
  const answers = intake.stored ? JSON.parse(intake.fields.Answers || '{}') : {}
  if (req.method === 'GET') {
    return { status: 200, json: { organiser: answers.name || '', dest: answers.destMode === 'help' ? '' : answers.dest || '' } }
  }
  if (req.method !== 'POST') return { status: 405, json: { error: 'method' } }
  const { data, meta = {} } = req.body || {}
  const v = validateCompanion(data || {})
  if (!v.ok) return { status: 400, json: { errors: v.errors } }
  const spam = await checkSpam({ ...meta, now, kind: 'companion', ip: req.ip }, env, fetchImpl)
  if (!spam.ok) return { status: 422, json: { reason: spam.reason } }
  const saved = await store.upsertCompanion(invite, { Name: data.name, Status: 'Answered', Answers: JSON.stringify(data), 'Answered at': new Date().toISOString() })
  return { status: 200, json: { stored: saved.stored } }
}

export default async function handler(req, res) {
  const out = await handleCompanion(
    { method: req.method, query: req.query, body: req.body, ip: req.headers['x-forwarded-for'] },
    { store: createStore(process.env), env: process.env, now: Date.now() },
  )
  res.setHeader('Cache-Control', 'no-store')
  res.status(out.status).json(out.json)
}
```

- [ ] **Step 5: Run tests, verify pass.** `npm test` → PASS.

- [ ] **Step 6: Make sure Vercel does not rewrite `/api/*` to the SPA.** Read `vercel.json`; rewrites are per-path (no catch-all), so no change is needed. Confirm with `grep -n '"source": "/(.*)"' vercel.json` → no match.

- [ ] **Step 7: Commit and push** — `git add api tools/tests/intake-api.test.mjs && git commit -m "feat(intake): intake and companion functions" && git push`

---

### Task 4: Draft state reducer and persistence

**Files:**
- Create: `src/intake/draft.js`, `src/intake/config.js`
- Test: `tools/tests/intake-draft.test.mjs`

**Interfaces:**
- Produces: `reduceIntake(state, action): state` with actions `{type:'set', key, value}`, `{type:'toggle', key, value, max?}` (multi-select; `'None'` clears others), `{type:'rank', key:'top3', value}` (append up to 3 or remove), `{type:'pair', key, value}` (into `pairs`), `{type:'more', interest, value}`, `{type:'count', key, delta, min}`, `{type:'listAdd', key, value}`, `{type:'listDel', key, index}`, `{type:'load', state}`; `serializeDraft({data, step, resume, startedAt}): string`; `parseDraft(str): object|null`; `INTAKE_LIVE: boolean`, `DRAFT_KEY = 'lads-intake-draft-v1'`.

- [ ] **Step 1: Failing tests** — `tools/tests/intake-draft.test.mjs`

```js
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
```

- [ ] **Step 2: Run, verify fail.**

- [ ] **Step 3: Implement `src/intake/config.js`**

```js
/* The quiz route is hidden (noindex, unlinked) until this is true. Flip it only
 * after Airtable credentials are set in Vercel and a test intake has landed. */
export const INTAKE_LIVE = false
export const DRAFT_KEY = 'lads-intake-draft-v1'
```

- [ ] **Step 4: Implement `src/intake/draft.js`**

```js
const VERSION = 1

export function reduceIntake(s, a) {
  switch (a.type) {
    case 'set': return { ...s, [a.key]: a.value }
    case 'toggle': {
      const cur = s[a.key] || []
      let next
      if (a.value === 'None') next = cur.includes('None') ? [] : ['None']
      else {
        next = cur.filter((x) => x !== 'None')
        next = next.includes(a.value) ? next.filter((x) => x !== a.value) : [...next, a.value]
        if (a.max && next.length > a.max) next = next.slice(next.length - a.max)
      }
      return { ...s, [a.key]: next }
    }
    case 'rank': {
      const cur = s[a.key] || []
      const next = cur.includes(a.value) ? cur.filter((x) => x !== a.value) : cur.length < 3 ? [...cur, a.value] : cur
      return { ...s, [a.key]: next, also: (s.also || []).filter((x) => !next.includes(x)) }
    }
    case 'pair': return { ...s, pairs: { ...s.pairs, [a.key]: a.value } }
    case 'more': {
      const cur = s.more?.[a.interest] || []
      const next = cur.includes(a.value) ? cur.filter((x) => x !== a.value) : [...cur, a.value]
      return { ...s, more: { ...s.more, [a.interest]: next } }
    }
    case 'count': return { ...s, [a.key]: Math.max(a.min ?? 0, (s[a.key] || 0) + a.delta) }
    case 'listAdd': return a.value.trim() ? { ...s, [a.key]: [...(s[a.key] || []), a.value.trim()] } : s
    case 'listDel': return { ...s, [a.key]: (s[a.key] || []).filter((_, i) => i !== a.index) }
    case 'load': return { ...s, ...a.state }
    default: return s
  }
}

export function serializeDraft({ data, step, resume, startedAt }) {
  return JSON.stringify({ v: VERSION, data, step, resume, startedAt })
}

export function parseDraft(str) {
  try {
    const d = JSON.parse(str)
    return d && d.v === VERSION && d.data ? d : null
  } catch {
    return null
  }
}
```

- [ ] **Step 5: Run tests, verify pass. Commit and push** — `git commit -m "feat(intake): draft reducer and persistence"`

---

### Task 5: Quiz shell, controls and organiser steps

**Files:**
- Create: `src/PlanYourTrip.jsx`, `src/PlanYourTrip.css`, `src/intake/Controls.jsx`, `src/intake/OrganiserSteps.jsx`
- Modify: `src/main.jsx` (lazy import + routes), `vercel.json` (rewrites for `/plan-your-trip` and `/plan-your-trip/join/:invite`)

**Interfaces:**
- Consumes: Tasks 1, 4 (`OPTIONS`, `emptyIntake`, `reduceIntake`, `serializeDraft`, `parseDraft`, `hardLimits`, `INTAKE_LIVE`, `DRAFT_KEY`).
- Produces: default export `PlanYourTrip` (route element); `Controls.jsx` exports `Chips({value, options, multi, max, onToggle, onSet})`, `Seg({value, options:[[v,label]], onSet})`, `TilePair({value, a, b, onSet})`, `NoPref({value, onSet})`, `Counter({label, value, onDelta})`, `Ranker({value, options, onRank})`, `ListAdd({items, placeholder, onAdd, onDel, id})`, `Typeahead({id, value, items:[[code,label]], onPick})`.

The prototype is the source of truth for every screen, label and option. Port it screen by screen; the CSS ports almost verbatim with `--ink` set per step on the page root.

- [ ] **Step 1: Controls.** Port `chips`, `seg`, `tilePair`, `ranker`, `listAdd`, the counter and the typeahead from the prototype script into React components in `Controls.jsx`. Every button gets `type="button"` and `aria-pressed`. Typeahead filters on code or label, max 5 results, each result a 44px button.

- [ ] **Step 2: Shell.** `PlanYourTrip.jsx` holds `useReducer(reduceIntake, …)`, `step`, `resume`, `startedAt`. On mount it reads `localStorage[DRAFT_KEY]` (try/catch) and, if a `?resume=` param is present, `GET /api/intake?resume=` and dispatches `load`. On every state change it writes the draft (try/catch). On every step advance it `POST`s a draft save (`final:false`) and stores the returned `resume` and `invites` (merged into `companions` by name). Header renders the six stamps (tap to jump to a completed step), the mini boarding pass on steps 1–6, and "Step n of 7 · label". Footer nav: Back, "Saved ✓", primary button with the prototype's labels ("Let's go", "Stamp it", "Check my pass", "Send to the Lads"). `<Helmet>`: title "Plan your trip · The Lads Travel Co.", `meta robots noindex,nofollow` while `!INTAKE_LIVE`, canonical `https://ladstravel.com/plan-your-trip`. A hidden honeypot input `name="company"` (off-screen, `tabIndex=-1`, `autoComplete="off"`, `aria-hidden`).

- [ ] **Step 3: Organiser steps.** `OrganiserSteps.jsx` exports `StepStart, StepTrip, StepCrew, StepBudget, StepStyle, StepDetails, StepWishes, StepReview, StepSent`, each `({s, d})` where `d` is dispatch. Port copy and conditional logic exactly from the prototype (`orgScreen()` cases 0–8, `reviewScreen()`, `pass()`), using `hardLimits(s, [])` for the "We will never plan…" list. Companion rows on step 2 show the real invite URL (`https://ladstravel.com/plan-your-trip/join/<invite>`) with a Copy button (`navigator.clipboard.writeText` in the click handler, fallback selects the text) once a draft save has returned invites; before that, "Link appears when you continue".

- [ ] **Step 4: Final submit.** "Send to the Lads" posts `final:true` with `meta:{honeypot, startedAt}`. On `200` with `stored:true` → Sent screen and clear the local draft. On `200` with `stored:false` → Sent screen variant: "We couldn't save this automatically. Email it to brady@ladstravel.com and we'll take it from there", with the address as selectable text. On `400` → jump to the first step owning an error field and show the message beside it. On `422` → "That was quicker than we expected. Please check your answers and send again." On network failure → keep the draft, show "Couldn't reach us. Your answers are saved on this device; try again."

- [ ] **Step 5: Routes.** In `src/main.jsx`: `const PlanYourTrip = lazy(() => import('./PlanYourTrip'))`; `<Route path="/plan-your-trip" element={<PlanYourTrip />} />` and `<Route path="/plan-your-trip/join/:invite" element={<PlanYourTrip companion />} />`. In `vercel.json` rewrites add `{ "source": "/plan-your-trip", "destination": "/" }` and `{ "source": "/plan-your-trip/join/:invite", "destination": "/" }`. Do NOT add to the sitemap or nav.

- [ ] **Step 6: Build and click-test.** `npm run build` clean. `npx vite preview`, then in the Playwright browser at 390 and 1440: walk every organiser step clicking at least one control of each type; rank 3 interests and confirm the badges read 1-2-3 and the "Which kind?" blocks follow the ranking; remove Outdoors and confirm Active limits disappears; pick Allergy and confirm the hard-limit box opens; reload mid-quiz and confirm the step and answers return; confirm `document.documentElement.scrollWidth <= innerWidth`; confirm every button's box is ≥ 44px tall (`[...document.querySelectorAll('button')].filter(b => b.offsetHeight && b.offsetHeight < 44)` lists only the deliberate small links: Change, No preference, Back). Submit with the stub store and confirm the stored:false message appears.

- [ ] **Step 7: Commit and push** — `git commit -m "feat(intake): /plan-your-trip organiser quiz (hidden route)"`

---

### Task 6: Companion flow

**Files:**
- Create: `src/intake/CompanionFlow.jsx`
- Modify: `src/PlanYourTrip.jsx` (render `CompanionFlow` when the `companion` prop is set)

**Interfaces:**
- Consumes: `emptyCompanion`, `validateCompanion`, `Controls.jsx`, `GET/POST /api/companion`.

- [ ] **Step 1:** On mount `GET /api/companion?invite=<param>`. 404 → a plain screen: "This invite link isn't active. Ask whoever sent it for a new one." Otherwise port the prototype's `compScreen()` cases 0–3 (welcome with organiser name and destination, limits, style, done). Its own `localStorage` key `lads-companion-<invite>`.
- [ ] **Step 2:** Submit posts `{invite, data, meta:{honeypot, startedAt}}`; same `stored:false` and error handling as Task 5 Step 4.
- [ ] **Step 3:** Build, click-test the full companion flow at 390 against the stub (expect the 404 screen without a store) and against the in-memory dev store described in Task 7 Step 2.
- [ ] **Step 4:** Commit and push — `git commit -m "feat(intake): companion flow"`

---

### Task 7: Local end-to-end without Airtable

**Files:**
- Create: `tools/intake/dev-server.mjs`

- [ ] **Step 1:** A 60-line Node HTTP server that serves `dist/` with SPA fallback and routes `/api/intake` and `/api/companion` to `handleIntake`/`handleCompanion` with an in-memory store (same shape as `memStore` in the Task 3 tests), logging each stored row to the console. Run: `node tools/intake/dev-server.mjs` → `http://localhost:4180`.
- [ ] **Step 2:** In the Playwright browser: complete an organiser intake with two companions, copy one invite link, complete it as the companion, and confirm the console shows the intake row (Status `New`, Hard limits populated) and the companion row (Status `Answered`). Then reload `/plan-your-trip?resume=<token>` and confirm the answers load.
- [ ] **Step 3:** Commit and push — `git commit -m "chore(intake): local end-to-end dev server"`

---

### Task 8: Airtable base and going live (needs Brady)

- [ ] **Step 1:** With Brady's OK, create the base "Lads Intakes" through the Airtable connector: table `Intakes` (Resume, Status single select [Draft, New, Spam, Needs follow-up, Run started, In review, Delivered, Closed], Name, Email, Phone, Destination, Dates, Party number, Budget, Occasion, Source, Opt in checkbox, Hard limits long text, Answers long text, Submitted at date-time) and `Companions` (Invite, Intake, Name, Status single select [Waiting, Answered], Answers long text, Answered at). Add an Airtable automation or "last modified time" field on Status for per-status timestamps.
- [ ] **Step 2:** Brady creates a personal access token scoped to that base (data.records:read/write) and sets `AIRTABLE_TOKEN` and `AIRTABLE_BASE_ID` in Vercel (Production + Preview). Optional: Turnstile site key and secret.
- [ ] **Step 3:** On a Vercel preview deploy, submit one real test intake and one companion; confirm both rows in Airtable; mark the test row Spam.
- [ ] **Step 4:** Flip `INTAKE_LIVE = true` (removes noindex), link "Plan a trip with us" from `/join`'s trip track and the homepage CTA, add `/plan-your-trip` to the sitemap at 0.9. Update `/privacy` with a paragraph on intake data (what is collected, why, stored in Airtable, deleted 12 months after travel, how to ask for deletion). Click-test, `/ship`.
