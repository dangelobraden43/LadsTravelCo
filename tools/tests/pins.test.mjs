/* THE GLOBE MUST AGREE WITH THE SITE.
 *
 * On Sept 29 2026 the gold globe pins summed to 220 while the caption above
 * them said 227: Globe.jsx kept its own copy of the spot walker, and it had
 * not learned the Sept 24 rules (a founder's ladsTake is a description; office
 * records and framework roots are not places). These tests pin the globe to
 * the one walker the rest of the site uses. */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { walkSpots, countSpotsByCity, derivePinCount } from '../../src/utils/derive.js'
import { FRAMEWORKS, VALIDATED_CITY_PINS, PUBLISHED_UNCOUNTED_CITY_PINS } from '../../src/data/canonical.js'

const load = async (slug) => {
  const mod = await import(pathToFileURL(path.resolve('src/data', slug + '.js')).href)
  return mod.default || Object.values(mod)[0]
}
const DATA = Object.fromEntries(await Promise.all(FRAMEWORKS.map(async (f) => [f.slug, await load(f.slug)])))
const siteTotal = FRAMEWORKS.reduce((n, f) => n + walkSpots(DATA[f.slug]).length, 0)

test('bucketed totals equal the site walker, framework by framework', () => {
  for (const f of FRAMEWORKS) {
    assert.equal(countSpotsByCity(DATA[f.slug]).total, walkSpots(DATA[f.slug]).length, f.slug)
  }
})
test('gold pins sum to the site total', () => {
  const sum = VALIDATED_CITY_PINS.reduce((n, p) => n + derivePinCount(DATA[p.slug], p.slug, p.city), 0)
  assert.equal(sum, siteTotal)
})
test('every counted framework has a gold pin, and no gold pin reads zero', () => {
  for (const f of FRAMEWORKS) {
    if (walkSpots(DATA[f.slug]).length === 0) continue
    assert.ok(VALIDATED_CITY_PINS.some((p) => p.slug === f.slug && p.primary), `${f.slug}: primary gold pin`)
  }
  for (const p of VALIDATED_CITY_PINS) assert.ok(derivePinCount(DATA[p.slug], p.slug, p.city) > 0, `${p.city}: count > 0`)
})
test('no framework is both counted and parked as published-uncounted', () => {
  for (const p of PUBLISHED_UNCOUNTED_CITY_PINS) {
    assert.equal(walkSpots(DATA[p.slug]).length, 0, `${p.city} counts places; it belongs in VALIDATED_CITY_PINS`)
  }
})
