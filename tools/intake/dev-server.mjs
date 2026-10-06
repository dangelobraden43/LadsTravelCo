/* Local end-to-end for the intake quiz, no Airtable needed.
 * Serves dist/ with SPA fallback and routes /api/intake and /api/companion to the
 * real handlers with an in-memory store. Every stored row is logged.
 *   npm run build && node tools/intake/dev-server.mjs   → http://localhost:4180 */
import http from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { handleIntake } from '../../api/intake.js'
import { handleCompanion } from '../../api/companion.js'

const DIST = path.resolve('dist')
const PORT = Number(process.env.PORT || 4180)
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.json': 'application/json', '.woff2': 'font/woff2' }

const rows = { intake: new Map(), companion: new Map() }
const table = (k) => ({
  find: async (key) => (rows[k].has(key) ? { stored: true, id: key, fields: rows[k].get(key) } : { stored: false, id: null }),
  upsert: async (key, f) => {
    rows[k].set(key, { ...(rows[k].get(key) || {}), ...f })
    console.log(`[${k}] ${key}`, JSON.stringify({ ...rows[k].get(key), Answers: '(json)' }))
    return { stored: true, id: key }
  },
})
const store = { live: true, findIntake: table('intake').find, upsertIntake: table('intake').upsert, findCompanion: table('companion').find, upsertCompanion: table('companion').upsert }

async function body(req) {
  let raw = ''
  for await (const chunk of req) raw += chunk
  try {
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

http
  .createServer(async (req, res) => {
    const url = new URL(req.url, `http://localhost:${PORT}`)
    if (url.pathname === '/api/intake' || url.pathname === '/api/companion') {
      const handler = url.pathname === '/api/intake' ? handleIntake : handleCompanion
      const out = await handler(
        { method: req.method, query: Object.fromEntries(url.searchParams), body: req.method === 'POST' ? await body(req) : undefined, ip: '127.0.0.1' },
        /* dev only: skew the clock so a scripted click-through clears the 45 s floor */
        { store, env: {}, now: Date.now() + 120_000 },
      )
      res.writeHead(out.status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' })
      return res.end(JSON.stringify(out.json))
    }
    let file = path.join(DIST, decodeURIComponent(url.pathname))
    if (!file.startsWith(DIST)) {
      res.writeHead(403)
      return res.end()
    }
    try {
      if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html')
    } catch {
      file = path.join(DIST, 'index.html')
    }
    try {
      const data = await readFile(file)
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' })
      res.end(data)
    } catch {
      res.writeHead(200, { 'Content-Type': 'text/html' })
      res.end(await readFile(path.join(DIST, 'index.html')))
    }
  })
  .listen(PORT, () => console.log(`intake dev server: http://localhost:${PORT}/plan-your-trip`))
