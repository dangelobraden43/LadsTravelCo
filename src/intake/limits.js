import { HIKE_ORDER, ALT_ORDER } from './options.js'

export function strictest(values, order) {
  const idx = values
    .filter(Boolean)
    .map((v) => order.indexOf(v))
    .filter((n) => n >= 0)
  return idx.length ? order[Math.min(...idx)] : null
}

export function mergeGroup(i, companions) {
  const people = [
    { ...i, who: i.name || 'Organiser' },
    ...companions.map((c) => ({ ...c, who: c.name })),
  ]
  const diets = []
  const notes = []
  for (const p of people) {
    for (const d of p.diet || [])
      if (d !== 'None' && d !== 'Allergy' && d !== 'Other') diets.push({ who: p.who, diet: d })
    const note = p.note && p.note.trim()
    if (note) notes.push({ who: p.who, text: note })
  }
  return {
    hike: strictest(
      people.map((p) => p.hike),
      HIKE_ORDER
    ),
    altitude: strictest(
      people.map((p) => p.altitude),
      ALT_ORDER
    ),
    diets,
    notes,
  }
}

const outdoors = (i) =>
  (i.top3 || []).includes('Outdoors & hiking') || (i.also || []).includes('Outdoors & hiking')

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
      out.push({
        kind: 'allergy',
        text: `Anywhere we can't confirm can safely handle ${whose} ${sev ? `${sev} ` : ''}${what} allergy${cross}`,
      })
    }
  }
  for (const d of g.diets)
    out.push({
      kind: 'diet',
      text: `A meal without a ${d.diet.toLowerCase()} option, for ${d.who}`,
    })
  for (const n of g.notes) out.push({ kind: 'note', text: `${n.text} (${n.who})` })
  if (i.drive === 'No') out.push({ kind: 'driving', text: 'Anything that needs someone to drive' })
  if (i.motion === 'Yes')
    out.push({ kind: 'motion', text: 'Long boat trips or winding mountain roads' })
  if (outdoors(i) && g.hike)
    out.push({
      kind: 'hike',
      text: `Hikes longer than ${g.hike.toLowerCase()} (the group's shortest limit)`,
    })
  if (outdoors(i) && g.altitude === 'Never been high')
    out.push({ kind: 'altitude', text: 'High altitude' })
  if (i.access === 'Yes' && (i.accessNeeds || []).length)
    out.push({ kind: 'access', text: `Places without ${i.accessNeeds.join(', ').toLowerCase()}` })
  if (i.firm === 'A hard limit' && i.budget) {
    const cap = budgetCap(i.budget)
    const per = i.budgetMode === 'day' ? 'a day' : 'for the trip'
    out.push({
      kind: 'budget',
      text: cap
        ? `Going over ${cap} ${per}, per person`
        : `Spending well past ${i.budget} ${per}, per person`,
    })
  }
  if (i.passport && i.passport !== 'All valid')
    out.push({
      kind: 'passport',
      text: 'A destination whose entry rules your passports might not meet',
    })
  return out
}

/* The ceiling of a budget band: "$175 to $275" → "$275", "Under $100" → "$100".
 * An open band ("$400+") has no ceiling and returns null. */
export function budgetCap(band) {
  const to = band.match(/to (\$[\d,]+)/)
  if (to) return to[1]
  const under = band.match(/^Under (\$[\d,]+)/)
  return under ? under[1] : null
}
