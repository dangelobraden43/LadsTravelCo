---
name: audit
description: Audit a framework's data + rendered React route against the Lads Travel Co quality rubric. Use when Brady says "audit", "check", "review", or "rubric" followed by a framework name (dublin, spain, rome, australia, iceland, prague, munich, poland, thailand, michigan, charleston).
---

# Framework Audit Workflow

Audit one framework, source of truth `src/data/<slug>.js`, rendered by
`FrameworkPage.jsx` at route `/<slug>`. Read the data file, then load the
route in the dev server (`npm run dev` → http://localhost:5173/<slug>) to
judge the rendered result. Output a change list by severity
(Critical / Should Fix / Nice to Have).

## Copy Consistency
- [ ] Personal validation voice present where `validated: true`? (ladsTake / forWho / story filled — Brady writes these, never AI-generated)
- [ ] Research-only spots clearly distinct from validated (copper vs gold)?
- [ ] Copy matches the latest frameworks (Spain, Rome) not the early ones (Munich, Thailand)?
- [ ] Specific spot names from the data used, not vague descriptions?
- [ ] No generic travel-content filler?

## Data Accuracy
- [ ] Every spot has `name` + `description`/`notes` (else it won't count in the live-walk)?
- [ ] No invented spots, prices, or recommendations?
- [ ] Cost models / flight ranges current for 2026?
- [ ] Any venue references that may have closed?
- [ ] `validated` flag set correctly per spot?
- [ ] NO insurance content anywhere — no section, aside, or line?

## Visual Polish (rendered route)
- [ ] Distinct palette from every other framework (never reuse another's colors)?
- [ ] Uses the design-system vars from `src/index.css :root` (--gold, --copper, --cream, --bg, --surface)?
- [ ] Typography hierarchy via the type vars (--editorial Fraunces, --sans Inter, --mono JetBrains, --serif EB Garamond)?
- [ ] Reveal-on-scroll and motion respect `prefers-reduced-motion`?
- [ ] Renders cleanly on mobile (max-width 480px)?

## Structure
- [ ] Quick Read / overview present?
- [ ] "What First-Timers Get Wrong" present?
- [ ] Day trips highlighted?
- [ ] Tour booking (Viator/GYG) + Google Maps list links present where relevant?
- [ ] Route has a `<Helmet>` block (title, description, canonical) and a vercel.json rewrite?

## Output Format
For each issue:
```
[SEVERITY] Section > Specific Issue
  Current: what it says / does now
  Should be: what it should say / do
  Why: brief reasoning
```
