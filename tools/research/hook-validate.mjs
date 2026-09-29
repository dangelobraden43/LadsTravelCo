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

/* The run an agent is working in: the directory whose RUN.json was written
 * most recently (within maxAge). /research writes RUN.json before dispatching
 * anyone, so this is the current run. Review #3 (Sept 29): picking the newest
 * <agent>.json from ANY run let an older run's valid file pass for an agent
 * that wrote nothing this time. */
export function currentRunDir(root, { now = Date.now(), maxAgeMs = 6 * 3600e3 } = {}) {
  if (!existsSync(root)) return null
  let best = null
  let bestM = -1
  for (const dest of readdirSync(root, { withFileTypes: true })) {
    if (!dest.isDirectory()) continue
    for (const run of readdirSync(path.join(root, dest.name), { withFileTypes: true })) {
      if (!run.isDirectory()) continue
      const f = path.join(root, dest.name, run.name, 'RUN.json')
      if (!existsSync(f)) continue
      const m = statSync(f).mtimeMs
      if (now - m <= maxAgeMs && m > bestM) { best = path.join(root, dest.name, run.name); bestM = m }
    }
  }
  return best
}

/* { runDir, file }: the agent's output in the CURRENT run, or file null if it
 * wrote nothing there. With no recent RUN.json at all (a manual one-off run),
 * falls back to the newest output file. */
export function outputFor(root, agent, opts = {}) {
  const runDir = currentRunDir(root, opts)
  if (!runDir) return { runDir: null, file: findLatestOutput(root, agent, opts) }
  const f = path.join(runDir, outputNameFor(agent))
  return { runDir, file: existsSync(f) ? f : null }
}

/* Wired as SubagentStop in .claude/settings.json, so it fires for every
 * subagent. The Lads agent's name arrives as `agent_type`; anything else is
 * not ours and passes. A CLI argument still works for manual runs. */
export function agentFrom(input, argv) {
  const t = input && input.agent_type
  if (typeof t === 'string') return t.startsWith('lads-') ? t : null
  return argv && argv[0] && argv[0].startsWith('lads-') ? argv[0] : null
}

export function decide({ file, errors, stopHookActive }) {
  if (file && errors.length === 0) return { exit: 0, message: '', writeInvalid: false }
  const message = file
    ? `Your output ${file} fails the research contract:\n  - ${errors.join('\n  - ')}\nFix every item, rewrite the file, then finish.`
    : 'No output file found. Write your findings to the run directory named in RUN.json (internal/research/<destination>/<runId>/) before finishing.'
  if (stopHookActive) return { exit: 0, message, writeInvalid: true }
  return { exit: 2, message, writeInvalid: false }
}

/* The structured form Claude Code honours for SubagentStop: printed on stdout
 * with exit 0. (Exit code 2 was ignored for subagent PreToolUse hooks on
 * 2026-09-29; the stop hook uses the same structured channel for the same
 * reason.) `decide().exit` stays as the internal signal. */
export function hookOutput(d) {
  return d.exit === 2 ? { decision: 'block', reason: d.message } : null
}

async function readStdin() {
  let data = ''
  for await (const chunk of process.stdin) data += chunk
  return data
}

/* Entry point. Called by the hook launcher in .claude/settings.json, which
 * resolves this file from process.env.CLAUDE_PROJECT_DIR inside node (the
 * shell does not expand it: verified Sept 29), and by a direct `node` run. */
export async function main() {
  const input = JSON.parse((await readStdin()) || '{}')
  const agent = agentFrom(input, process.argv.slice(2))
  if (!agent) process.exit(0)
  const projectDir = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd()
  const root = path.join(projectDir, 'internal', 'research')
  const { runDir, file } = outputFor(root, agent)
  const errors = file ? validateFile(file) : []
  const d = decide({ file, errors, stopHookActive: Boolean(input.stop_hook_active) })
  /* The marker lands beside the expected output in the current run, so
   * /research sees a MISSING file too, not only an invalid one (review #4). */
  const marker = file ? file + '.INVALID.txt' : runDir ? path.join(runDir, outputNameFor(agent) + '.MISSING.txt') : null
  if (marker) {
    if (d.writeInvalid) writeFileSync(marker, d.message + '\n')
    else if (d.exit === 0 && existsSync(marker)) rmSync(marker)
  }
  const out = hookOutput(d)
  if (out) process.stdout.write(JSON.stringify(out))
  process.exit(0)
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) await main()
