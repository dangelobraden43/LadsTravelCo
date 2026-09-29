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
