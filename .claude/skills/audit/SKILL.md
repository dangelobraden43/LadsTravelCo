---
name: audit
description: Audit a framework HTML file against the Lads Travel Co quality rubric. Use when Brady says "audit", "check", "review", or "rubric" followed by a framework name.
---

# Framework Audit Workflow

Read the specified HTML framework file and check against every criterion below. Output a consolidated change list organized by severity (Critical / Should Fix / Nice to Have).

## Copy Consistency
- [ ] Personal validation voice present? ("Brady knows this" / "Dawson knows this" / "Both Lads")
- [ ] Research-based sections clearly labeled?
- [ ] Copy sounds like latest frameworks (Barcelona, Rome quality) not early ones (Munich, Thailand)?
- [ ] Any phrases that sound like generic travel content?
- [ ] Specific spot names from the database used (not vague descriptions)?

## Visual Polish
- [ ] Distinct visual identity that differs from all other frameworks?
- [ ] Confidence labels use correct system? (copper warm border = personal, cool blue-grey = research)
- [ ] Tables render cleanly on mobile?
- [ ] Typography hierarchy clear? (EB Garamond headlines, body font, JetBrains Mono labels)
- [ ] Images embedded with correct MIME types? (JPEG as JPEG, PNG as PNG)

## Data Accuracy
- [ ] Cost models current for 2026?
- [ ] Flight prices in right range?
- [ ] Any venue references that may have closed?
- [ ] Timing windows reflect established windows? (Late Nov, Late April, Sept post-Labor Day)

## Structure
- [ ] Has a Quick Read / overview section?
- [ ] Has a "What First-Timers Get Wrong" section?
- [ ] Day trips highlighted prominently?
- [ ] Models correct group sizes (2/4/8 where applicable)?
- [ ] Tour booking links included where relevant?
- [ ] Google Maps list links included?

## Photo Integration
- [ ] Uses personal photos from Brady or Dawson?
- [ ] Photo slots designed well (not afterthoughts)?
- [ ] Images optimized (under 150KB per embedded image)?

## Output Format
For each issue found, output:
```
[SEVERITY] Section > Specific Issue
  Current: what it says now
  Should be: what it should say
  Why: brief reasoning
```
