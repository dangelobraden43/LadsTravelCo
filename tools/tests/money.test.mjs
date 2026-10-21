/* Prices for US travellers in Ireland: euro first, dollars alongside, pounds converted and marked. */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { money } from '../trip-guide/money.mjs'

const r = { USD: 1.1253, GBP: 0.84385 }

test('a euro range gets its dollar range, rounded outward', () => {
  assert.equal(money('Budget EUR 450-500 each.', r), 'Budget €450–500 (about $505–565) each.')
})
test('small amounts keep their cents', () => {
  assert.equal(money('A pint runs about EUR 5.50-7.50.', r), 'A pint runs about €5.50–7.50 (about $6.19–8.44).')
})
test('pounds are converted to euro and marked as converted', () => {
  assert.equal(money('3-4 star hotels about GBP 129-164 a night.', r), '3-4 star hotels about €150–195 (about $170–220; converted from £129–164) a night.')
})
test('dollar fares get euro alongside', () => {
  assert.equal(money('about USD 640-1,520', r), 'about $640–1,520 (about €565–1,400)')
})
test('a converted string is never converted again', () => {
  const once = money('EUR 9-14 by slot', r)
  assert.equal(money(once, r), once)
})
