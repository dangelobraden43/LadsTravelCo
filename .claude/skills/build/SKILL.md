---
name: build
description: Build a new framework as a React route + data file from a synthesis document. Use when Brady says "build framework", "new framework", or names a destination that needs one.
---

# New Framework Build Workflow

New frameworks are React routes driven by a `src/data/<slug>.js` file and
rendered by `FrameworkPage.jsx` at `/<slug>` — NOT standalone HTML.

## Inputs Required
1. A synthesis document (PDF/DOCX) with the research
2. The destination name + desired slug
3. Whether it's personally validated or research-based
4. Any personal photos (Brady/Dawson) available

## Build Steps
1. Read `CLAUDE.md` for brand voice, architecture patterns, and the palette/type vars.
2. Read the synthesis document fully — the trip, the audience, the key findings.
3. Create `src/data/<slug>.js` exporting the framework object. Every spot needs at
   least `name` + `description`/`notes` (the live-walk counts only those). Set
   `validated: true/false` per spot. Leave `ladsTake`/`forWho`/`story` empty unless
   Brady provides them — never AI-generate the personal layer.
4. Register the slug in `DESTINATIONS` in `src/main.jsx` (adds route `/<slug>`).
5. Add a `vercel.json` rewrite `{ "source": "/<slug>", "destination": "/" }`.
6. Choose a distinct palette that differs from ALL existing frameworks; drive it
   through the `src/index.css :root` vars — never reuse another framework's colors.
7. Ensure the route renders the required sections (Quick Read, day-by-day with
   specific spots, What First-Timers Get Wrong, cost by group size, day trips with
   booking links, Google Maps lists, validated-vs-research confidence).
8. Media: reference photos via the extract-images pipeline / Cloudinary — no base64.
   Add a `<Helmet>` block (title, description, canonical).

## Quality Check
- [ ] Distinct palette from all other frameworks
- [ ] No invented spots, prices, or recommendations
- [ ] NO insurance content anywhere
- [ ] Route lazy-loaded + vercel.json rewrite present
- [ ] Mobile responsive (max-width 480px); `prefers-reduced-motion` respected
- [ ] `npm run build` passes; framework chunk stays small (5–33 KB range)
- [ ] Reads like the Spain/Rome quality bar, not early Munich
