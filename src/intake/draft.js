const VERSION = 1

export function reduceIntake(s, a) {
  switch (a.type) {
    case 'set':
      return { ...s, [a.key]: a.value }
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
      const next = cur.includes(a.value)
        ? cur.filter((x) => x !== a.value)
        : cur.length < 3
          ? [...cur, a.value]
          : cur
      return { ...s, [a.key]: next, also: (s.also || []).filter((x) => !next.includes(x)) }
    }
    case 'pair':
      return { ...s, pairs: { ...s.pairs, [a.key]: a.value } }
    case 'more': {
      const cur = s.more?.[a.interest] || []
      const next = cur.includes(a.value) ? cur.filter((x) => x !== a.value) : [...cur, a.value]
      return { ...s, more: { ...s.more, [a.interest]: next } }
    }
    case 'count':
      return { ...s, [a.key]: Math.max(a.min ?? 0, (s[a.key] || 0) + a.delta) }
    case 'listAdd':
      return a.value.trim() ? { ...s, [a.key]: [...(s[a.key] || []), a.value.trim()] } : s
    case 'listDel':
      return { ...s, [a.key]: (s[a.key] || []).filter((_, i) => i !== a.index) }
    case 'load':
      return { ...s, ...a.state }
    default:
      return s
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
