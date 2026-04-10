---
name: links
description: Replace placeholder framework links across all HTML files. Use when Brady says "update links", "replace links", "add URLs", or "Vercel URLs".
---

# Link Replacement Workflow

## When Brady provides Vercel URLs:
1. Read index.html (main site)
2. Find every `href="#"` that has "Open Framework" or "Open Full Framework" in its link text
3. Map each to the correct framework URL based on the card's destination name
4. Replace all placeholder links in one pass
5. Show the diff before saving
6. After confirmation, also check all other HTML files for cross-references

## Expected URL mapping (Brady fills in after Vercel deploy):
```
Dublin + Galway    → /dublin-galway.html
Rome + Italy       → /rome-italy.html
Barcelona + Madrid → /spain-2026.html
Australia + NZ     → /australia-nz.html
Iceland            → /iceland-2026.html
Prague + Vienna    → /prague-vienna.html
Munich Oktoberfest → /munich-oktoberfest.html
Poland August      → /poland-august.html
Thailand NYE       → /thailand-nye.html
Lads Local         → /lads-local.html
```

## Rules
- Never change Google Maps links or tour booking links — only framework placeholder links
- Show the full list of replacements before executing
- Count total replacements made and confirm
