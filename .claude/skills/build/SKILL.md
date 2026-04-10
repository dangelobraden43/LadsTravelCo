---
name: build
description: Build a new framework HTML from a synthesis document. Use when Brady says "build framework", "new framework", or names a destination that needs a new HTML.
---

# New Framework Build Workflow

## Inputs Required
1. A synthesis document (PDF or DOCX) with the research
2. The destination name
3. Whether it's personally validated or research-based
4. Any personal photos available

## Build Steps
1. Read CLAUDE.md for brand voice, typography, and design principles
2. Read the synthesis document fully — understand the trip, the audience, the key findings
3. Choose a distinct color palette that differs from ALL existing frameworks:
   - Dublin: dark green
   - Rome: terracotta
   - Spain: warm brown
   - Australia: deep navy
   - Iceland: volcanic slate
   - Munich: amber dark
   - Thailand: near-black
   - Poland: warm brown-stone
4. Build the HTML with these required sections:
   - Hero with destination name and route
   - Quick Read / overview
   - Day-by-day itinerary with specific spots
   - What First-Timers Get Wrong
   - Cost breakdown by group size
   - Day trips with booking links
   - Accommodation strategy
   - Money intelligence / savings
   - Google Maps list links
   - Confidence labels (personal vs research)
5. Use EB Garamond for headlines, Outfit or the framework's body font, JetBrains Mono for data
6. Embed any provided photos as optimized base64 JPEG
7. Test on mobile viewport (max-width: 480px responsive)
8. Save to the project folder with a clean filename

## Quality Check
Before presenting to Brady, verify:
- [ ] Distinct palette from all other frameworks
- [ ] No invented spots or prices
- [ ] All sections present
- [ ] Mobile responsive
- [ ] Total file size reasonable (under 2MB with images)
- [ ] Reads like the Barcelona or Rome framework quality, not the early Munich quality
