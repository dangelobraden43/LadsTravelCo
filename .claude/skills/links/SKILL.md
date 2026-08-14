---
name: links
description: Verify and fix internal route links + external affiliate/Maps links across the React site. Use when Brady says "update links", "check links", "fix links", or "broken links".
---

# Link Audit Workflow

Static HTML frameworks were deleted May 31, 2026. Framework links are now
React Router routes `/<slug>` (dublin, spain, rome, australia, iceland,
prague, munich, poland, thailand, michigan, charleston), plus the four
collection routes `/global`, `/outdoors`, `/bucket-list`, `/local`.

## Internal Routes
1. Scan `src/**/*.jsx` for framework/collection CTAs (`OPEN FRAMEWORK →`,
   card links, nav, Footer).
2. Confirm each points at a real route above via `<Link to="/slug">` /
   `<Navigate>` — NOT an old `.html` path and not a leftover `href="#"`.
3. For every React-only route, confirm a matching `vercel.json` rewrite
   exists (`{ "source": "/slug", "destination": "/" }`); a missing rewrite
   404s on direct hits / refresh.
4. Confirm retired paths still redirect: /explore→/global, /adventure→/outdoors,
   /plan→/, /story→/ (both `vercel.json` redirects and client `<Navigate replace>`).

## External Links
- Tour booking (Viator / GetYourGuide) and Google Maps list links live in
  `src/data/<slug>.js`. Verify they are real URLs, not placeholders.
- NEVER rewrite Google Maps or tour/affiliate links to different targets —
  only flag broken or placeholder ones.

## Rules
- Show the full list of proposed changes before executing.
- One pass, then report count of links checked / fixed / flagged.
- Do not touch affiliate or Maps destinations without Brady's confirmation.
