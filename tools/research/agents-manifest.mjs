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
        group: fm['lads-group'] || null,
        summary: fm['lads-summary'] || null,
        raw,
      }
    })
}

export const publicAgents = (agents) => agents.filter((a) => a.isPublic)
