/* /runs inventory: every research run, its stage, and what is missing.
 * Read-only. Usage: node tools/research/runs.mjs [--md out.md]
 */
import { readdirSync, existsSync, readFileSync, writeFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { validateFile } from './validate.mjs'

export const expectedFile = (name) =>
  name === 'lads-trip-architect' ? 'PACKET.md' : `${name}.json`

export function inventory(root, { now = Date.now() } = {}) {
  const rows = []
  if (!existsSync(root)) return rows
  for (const dest of readdirSync(root, { withFileTypes: true })) {
    if (!dest.isDirectory() || dest.name.startsWith('_') || dest.name === 'market') continue
    for (const run of readdirSync(path.join(root, dest.name), { withFileTypes: true })) {
      if (!run.isDirectory()) continue
      const dir = path.join(root, dest.name, run.name)
      const runFile = path.join(dir, 'RUN.json')
      if (!existsSync(runFile)) continue
      let doc
      try { doc = JSON.parse(readFileSync(runFile, 'utf8')) } catch { rows.push({ run: `${dest.name}/${run.name}`, stage: 'broken RUN.json' }); continue }
      const fix = typeof doc.purpose === 'string' && doc.purpose.startsWith('FRAMEWORK FIX PASS')
      const roster = (doc.roster || Object.keys(doc.callBudgets || {})).filter((a) => a !== 'lads-trip-architect' && a !== 'lads-verifier')
      const files = readdirSync(dir)
      const state = (f) => {
        if (!files.includes(f)) return 'missing'
        /* Judge a run against its own day: generatedOn must equal RUN.json.today. */
        try { return validateFile(path.join(dir, f), doc.today ? { today: doc.today } : undefined).length ? 'invalid' : 'ok' } catch { return 'invalid' }
      }
      const research = roster.map((a) => ({ a, s: state(expectedFile(a)) }))
      const verifier = state('lads-verifier.json')
      const final = fix ? (files.includes('FIXES.md') ? 'ok' : 'missing') : state('PACKET.md')
      const falseMarkers = files.filter((f) => f.endsWith('.MISSING.txt') && state(f.replace(/\.MISSING\.txt$/, '')) === 'ok')
      const missing = research.filter((r) => r.s !== 'ok').map((r) => `${r.a}${r.s === 'invalid' ? ' (invalid)' : ''}`)
      const stage = missing.length ? 'researching' : verifier !== 'ok' ? 'verifying' : final !== 'ok' ? 'assembling' : 'complete'
      const ageDays = Math.floor((now - statSync(runFile).mtimeMs) / 86400e3)
      rows.push({ run: `${dest.name}/${run.name}`, fix, stage, missing, verifier, final: fix ? `FIXES.md ${final}` : `PACKET.md ${final}`, falseMarkers, ageDays })
    }
  }
  return rows
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  const rows = inventory(path.join(process.cwd(), 'internal', 'research'))
  const lines = ['| run | stage | age (d) | missing research | verifier | final | false markers |', '|---|---|---|---|---|---|---|']
  for (const r of rows) lines.push(`| ${r.run}${r.fix ? ' (fix pass)' : ''} | ${r.stage} | ${r.ageDays ?? ''} | ${(r.missing || []).join(', ') || '-'} | ${r.verifier ?? ''} | ${r.final ?? ''} | ${(r.falseMarkers || []).length || '-'} |`)
  const md = lines.join('\n')
  console.log(md)
  const i = process.argv.indexOf('--md')
  if (i > 0 && process.argv[i + 1]) writeFileSync(process.argv[i + 1], `# Research runs\n\nGenerated ${new Date().toISOString()}\n\n${md}\n`)
}
