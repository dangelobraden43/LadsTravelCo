/* Airtable when credentials exist, a stub that stores nothing otherwise. The stub
 * lets the quiz be built, deployed at a hidden URL and click-tested before Brady
 * creates the token. It never throws: a lost intake is worse than a reported one. */
const TABLES = { intake: 'Intakes', companion: 'Companions' }
const KEY = { intake: 'Resume', companion: 'Invite' }
const SAFE = /^[0-9a-f]{16,64}$/

export function createStore(env, fetchImpl = fetch) {
  const live = Boolean(env.AIRTABLE_TOKEN && env.AIRTABLE_BASE_ID)
  const none = { stored: false, id: null }
  /* A lookup that errored is not "not found": writing after it would duplicate the row. */
  const failed = { stored: false, id: null, error: true }
  const base = `https://api.airtable.com/v0/${env.AIRTABLE_BASE_ID}`
  const headers = { Authorization: `Bearer ${env.AIRTABLE_TOKEN}`, 'Content-Type': 'application/json' }

  async function find(kind, key) {
    if (!live || !SAFE.test(key || '')) return none
    try {
      const formula = encodeURIComponent(`{${KEY[kind]}}='${key}'`)
      const res = await fetchImpl(`${base}/${encodeURIComponent(TABLES[kind])}?maxRecords=1&filterByFormula=${formula}`, { headers })
      if (!res.ok) return failed
      const rec = (await res.json()).records?.[0]
      return rec ? { stored: true, id: rec.id, fields: rec.fields } : none
    } catch {
      return failed
    }
  }

  async function upsert(kind, key, fields) {
    if (!live || !SAFE.test(key || '')) return none
    try {
      const found = await find(kind, key)
      if (found.error) return none
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
