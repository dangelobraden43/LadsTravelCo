/* STOP HOOK for every Lads research agent.
 *
 * When an agent tries to finish, this finds the output it just wrote and runs
 * the contract validator over it. Invalid output is sent back (exit 2) so the
 * agent fixes it. On the second attempt Claude Code sets stop_hook_active; we
 * then let the agent stop and leave <output>.INVALID.txt beside the file so
 * /research reports it, rather than looping forever.
 */
import { readdirSync, statSync, existsSync, writeFileSync, rmSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { validateFile } from './validate.mjs'

export const outputNameFor = (agent) => (agent === 'lads-trip-architect' ? 'PACKET.md' : `${agent}.json`)

export function findLatestOutput(root, agent, { now = Date.now(), maxAgeMs = 3 * 3600e3 } = {}) {
  if (!existsSync(root)) return null
  const name = outputNameFor(agent)
  let best = null
  let bestM = -1
  for (const dest of readdirSync(root, { withFileTypes: true })) {
    if (!dest.isDirectory()) continue
    for (const run of readdirSync(path.join(root, dest.name), { withFileTypes: true })) {
      if (!run.isDirectory()) continue
      const f = path.join(root, dest.name, run.name, name)
      if (!existsSync(f)) continue
      const m = statSync(f).mtimeMs
      if (now - m <= maxAgeMs && m > bestM) { best = f; bestM = m }
    }
  }
  return best
}

export function decide({ file, errors, stopHookActive }) {
  if (file && errors.length === 0) return { exit: 0, message: '', writeInvalid: false }
  const message = file
    ? `Your output ${file} fails the research contract:\n  - ${errors.join('\n  - ')}\nFix every item, rewrite the file, then finish.`
    : 'No output file found. Write your findings to the run directory named in RUN.json (internal/research/<destination>/<runId>/) before finishing.'
  if (stopHookActive) return { exit: 0, message, writeInvalid: true }
  return { exit: 2, message, writeInvalid: false }
}

async function readStdin() {
  let data = ''
  for await (const chunk of process.stdin) data += chunk
  return data
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  const agent = process.argv[2]
  const input = JSON.parse((await readStdin()) || '{}')
  const projectDir = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd()
  const root = path.join(projectDir, 'internal', 'research')
  const file = agent ? findLatestOutput(root, agent) : null
  const errors = file ? validateFile(file) : []
  const d = decide({ file, errors, stopHookActive: Boolean(input.stop_hook_active) })
  if (file) {
    const invalid = file + '.INVALID.txt'
    if (d.writeInvalid) writeFileSync(invalid, d.message + '\n')
    else if (d.exit === 0 && existsSync(invalid)) rmSync(invalid)
  }
  if (d.exit === 2) process.stderr.write(d.message + '\n')
  process.exit(d.exit)
}
