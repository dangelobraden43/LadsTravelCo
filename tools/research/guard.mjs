/* PATH GUARD for every Lads research agent (PreToolUse hook).
 *
 * Agents research; founders publish. The cleanest way to make that true is to
 * make it impossible for an agent to write anywhere a reader could see: this
 * hook allows Write/Edit only inside the gitignored staging tree and the
 * agents' own memory folders. Everything else, src/data included, is refused.
 *
 * HOW IT REFUSES, and why it is not exit code 2. Verified live on 2026-09-29
 * (Claude Code 2.1.285): inside an Agent-tool subagent, a PreToolUse hook that
 * exited 2 with a reason on stderr was IGNORED and the write went through. The
 * structured form below, printed on stdout with exit 0, was honoured and the
 * write was refused. Do not "simplify" this back to exit 2.
 */
import path from 'node:path'
import { pathToFileURL } from 'node:url'

export const ALLOWED_PREFIXES = ['internal/research/', '.claude/agent-memory/']
export const GUARDED_TOOLS = ['Write', 'Edit', 'MultiEdit', 'NotebookEdit']

/* Wired in .claude/settings.json, so it runs for EVERY Write in the project.
 * It only acts inside a Lads research agent: Claude Code puts the subagent's
 * name in `agent_type`, and the main session has none. (Hooks declared in an
 * agent's own frontmatter did not fire for Agent-tool subagents on
 * 2026-09-29, which is why this lives in project settings instead.) */
export function shouldGuard(input) {
  return Boolean(
    input && typeof input.agent_type === 'string' && input.agent_type.startsWith('lads-') &&
    GUARDED_TOOLS.includes(input.tool_name))
}

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

/* Returns the hook's stdout object when the write must be refused, else null. */
export function guardDecision(input, projectDir) {
  if (!shouldGuard(input)) return null
  const ti = input.tool_input || {}
  const target = ti.file_path || ti.notebook_path || ''
  if (isAllowedWrite(target, projectDir)) return null
  return {
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'deny',
      permissionDecisionReason:
        `BLOCKED by tools/research/guard.mjs: research agents may only write inside ` +
        `internal/research/ or .claude/agent-memory/. Refused: ${target}. ` +
        `Write your findings to the run directory named in RUN.json instead.`,
    },
  }
}

async function readStdin() {
  let data = ''
  for await (const chunk of process.stdin) data += chunk
  return data
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  const input = JSON.parse((await readStdin()) || '{}')
  const projectDir = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd()
  const out = guardDecision(input, projectDir)
  if (out) process.stdout.write(JSON.stringify(out))
  process.exit(0)
}
