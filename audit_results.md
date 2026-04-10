# Framework Audit Results — The Lads Travel Co.
## Completed April 9, 2026

---

## 1. Munich Oktoberfest — NEEDS REBUILD

### CRITICAL

```
[CRITICAL] Structure > No Insurance Section
  Current: No insurance section exists anywhere in the file
  Should be: Dedicated insurance section covering SAAP/GP coverage, framed as mandatory
  Why: CLAUDE.md states "Insurance is non-negotiable in all frameworks." This is entirely missing.
```

```
[CRITICAL] Meta > No Open Graph Meta Tags ✅ FIXED
  Current: Only <meta charset> and <meta viewport> present
  Should be: Full og:title, og:description, og:type meta tags
  Why: Launch gate requirement per CLAUDE.md
```

```
[CRITICAL] Contact > No Contact Email Anywhere
  Current: No email, no mailto, no contact reference in the entire file
  Should be: dangelobraden43@gmail.com referenced (footer or contact section)
  Why: CLAUDE.md specifies this email
```

```
[CRITICAL] Typography > Outfit Font Not Loaded ✅ FIXED
  Current: Google Fonts link loads only EB Garamond and JetBrains Mono
  Should be: Also load Outfit font; body should use font-family: 'Outfit', sans-serif
  Why: CLAUDE.md requires "Body: Outfit"
```

```
[CRITICAL] Fonts > No Google Fonts Preconnect ✅ FIXED
  Current: Direct <link> with no preconnect
  Should be: Preconnect for fonts.googleapis.com and fonts.gstatic.com
  Why: Required per audit checklist and standard performance practice
```

### SHOULD FIX

```
[SHOULD FIX] Visual > Background Uses Dublin's Green Palette
  Current: --green-deepest: #0B1A0F, body background uses this green base
  Should be: Dark/amber-gold palette per CLAUDE.md — Munich should NOT use green
  Why: CLAUDE.md says "green is Dublin's identity"
```

```
[SHOULD FIX] Visual > CSS Variable Names Are Dublin-Inherited
  Current: --green-deepest, --green-dark, --green-mid, etc.
  Should be: Renamed to neutral or Munich-specific names with Munich-appropriate hex values
  Why: Entire color system is copied from the Dublin framework
```

```
[SHOULD FIX] Confidence Labels > No Visual Distinction for Research-Based Content
  Current: Callout uses gold left-border, research-based note is plain text in gold callout
  Should be: Research-based sections should use "cool blue-grey treatment"
  Why: Gold/copper styling suggests personal validation; research should be visually distinct
```

```
[SHOULD FIX] Copy > Currency Inconsistency in Quick Numbers
  Current: "€475–$700" and "€680–$800" — mixing EUR and USD in single ranges
  Should be: Consistent currency within each range
  Why: A range should not start in euros and end in dollars
```

```
[SHOULD FIX] Photos > Broken Placeholder Image Sources
  Current: src="LADS_IMG" and src="STEIN_IMG" — literal placeholder strings
  Should be: Dark textured card approach (no personal photos exist for Munich)
  Why: These render as broken images
```

```
[SHOULD FIX] Structure > No Google Maps List Links
  Current: No Google Maps links anywhere
  Should be: Google Maps list link(s) for Munich spots
  Why: Required per structure checklist
```

```
[SHOULD FIX] Structure > No Tour Booking Links
  Current: Day trip section mentions Neuschwanstein and Salzburg but no bookable links
  Should be: Include Viator/GetYourGuide links for day trips
  Why: Required per structure checklist
```

```
[SHOULD FIX] Structure > Group Sizes Don't Model 2 or 8
  Current: Hero says "4–10", cost models only show group of 4
  Should be: Cost tables should model 2/4/8 where applicable
  Why: Different group sizes have very different per-person costs
```

### NICE TO HAVE

```
[NICE TO HAVE] Data > Oktoberfest 2026 Dates Need Verification
  Current: "September 19 through October 4, 2026"
  Should be: Verify against official dates when announced
```

```
[NICE TO HAVE] Data > Chase Sapphire Reserve Annual Fee
  Current: $795
  Should be: Verify current 2026 fee
```

```
[NICE TO HAVE] Visual > Mobile Table Overflow Not Addressed
  Current: Tables have basic responsive sizing but no overflow-x wrapper
  Should be: Consider overflow-x: auto for tables with 4+ columns
```

### Summary

| Category | Verdict |
|----------|---------|
| Copy | PASS |
| Visual | FAIL |
| Data | PASS |
| Structure | FAIL |
| Photos | FAIL |

---

## 2. Thailand NYE — NEEDS REBUILD

### CRITICAL

```
[CRITICAL] Head > Missing Open Graph meta tags ✅ FIXED
```

```
[CRITICAL] Head > Missing Outfit font for body text ✅ FIXED
```

```
[CRITICAL] Head > Google Fonts loaded via @import, not preconnect + <link> ✅ FIXED
```

```
[CRITICAL] Structure > No "Quick Read / Overview" section
  Current: Hero jumps directly to Bangkok day-by-day content
  Should be: Quick-read summary section after the version bar
  Why: Required structural element per audit rubric
```

```
[CRITICAL] Structure > No "What First-Timers Get Wrong" section
  Current: Some first-timer advice scattered (scooter warning, DCC warning)
  Should be: Dedicated consolidated section
  Why: Required structural element per rubric
```

```
[CRITICAL] Structure > No insurance section
  Current: No mention of travel insurance anywhere
  Should be: Dedicated insurance section framed as mandatory
  Why: "Insurance is non-negotiable in all frameworks" per CLAUDE.md
```

```
[CRITICAL] Footer > No contact email
  Current: Footer has brand name and disclaimer, no email
  Should be: dangelobraden43@gmail.com
  Why: Required per CLAUDE.md
```

```
[CRITICAL] Structure > No Google Maps list links
  Current: Zero Google Maps links
  Should be: Maps lists for Bangkok, Phangan, Krabi spots
  Why: Required structural element
```

```
[CRITICAL] Structure > No tour booking links
  Current: References to Viator, GetYourGuide are text-only (no hyperlinks)
  Should be: Actual clickable <a href="..."> links
  Why: Required per rubric
```

### SHOULD FIX

```
[SHOULD FIX] Copy > Confidence labels missing entirely
  Current: No confidence label system visible
  Should be: Cool blue-grey border labels marking sections as "Research-Based Intelligence"
  Why: Thailand is research-based; the confidence label system must visually communicate this
```

```
[SHOULD FIX] Photos > Embedded image exceeds 150KB limit
  Current: Base64-encoded JPEG is ~238KB decoded
  Should be: Under 150KB per embedded image
```

```
[SHOULD FIX] Photos > Using embedded photo despite no personal photos available
  Current: Embedded JPEG of Haad Rin Beach
  Should be: Dark textured card approach per CLAUDE.md
  Why: "If no photo exists for a destination, use a dark textured card"
```

```
[SHOULD FIX] Structure > Day trips not highlighted prominently
  Current: Buried in day-by-day expandable sections
  Should be: Dedicated "Day Trips That Make This Trip" section with booking links
```

```
[SHOULD FIX] Copy > Some generic travel phrases
  Current: "genuinely beautiful", "visually dramatic", "the landscape gets more dramatic"
  Should be: More specific phrasing
```

```
[SHOULD FIX] Data > Group size inconsistency
  Current: Hero says "4-8 people", cost says "group of 4", ORD callout says "group of 8"
  Should be: Consistent group size modeling throughout
```

### NICE TO HAVE

```
[NICE TO HAVE] Visual > --bg-card has transparency that looks unintentional
  Current: --bg-card: #18181400 (fully transparent due to "00" alpha hex)
  Should be: --bg-card: #181814
```

```
[NICE TO HAVE] Copy > Footer says "Five specialized research agents"
  Current: "Five specialized research agents"
  Should be: "Six AI agents" per CLAUDE.md
```

### Summary

| Category | Verdict |
|----------|---------|
| Copy | FAIL |
| Visual | Conditional Pass |
| Data | PASS |
| Structure | FAIL |
| Photos | FAIL |

---

## 3. Poland August — NEEDS REBUILD

### CRITICAL

```
[CRITICAL] Head > Missing Open Graph meta tags ✅ FIXED
```

```
[CRITICAL] Head > Missing Outfit font (body text) ✅ FIXED
```

```
[CRITICAL] Head > Google Fonts loaded via @import, no preconnect ✅ FIXED
```

```
[CRITICAL] Visual > No confidence label system (research-based cool blue-grey treatment)
  Current: No visual indicator that this is research-based
  Should be: Cool blue-grey left-border treatment on research sections
  Why: Poland is research-based; copper warm = personal, cool blue-grey = research
```

```
[CRITICAL] Photos > Embedded images far exceed 150KB limit
  Current: Image 1: ~338KB, Image 2: ~308KB
  Should be: Each under 150KB
```

```
[CRITICAL] Structure > No contact email anywhere
  Current: No email in the document
  Should be: dangelobraden43@gmail.com
```

### SHOULD FIX

```
[SHOULD FIX] Structure > No "What First-Timers Get Wrong" section
  Current: No section with this title or equivalent
  Should be: Dedicated section covering common mistakes
```

```
[SHOULD FIX] Structure > No tour booking links
  Current: Mentions tours but zero clickable booking URLs
  Should be: Direct booking links to Viator/GetYourGuide for Auschwitz, Wieliczka, etc.
```

```
[SHOULD FIX] Structure > No Google Maps list links
  Current: Zero Google Maps links
  Should be: Curated Google Maps lists for Krakow, Warsaw, Gdansk
```

```
[SHOULD FIX] Copy > "The specificity speaks for itself" in footer
  Current: Self-congratulatory copy
  Should be: Remove or rephrase
```

```
[SHOULD FIX] Visual > Stock/AI images instead of dark textured cards
  Current: Two large JPEG images for Warsaw and Gdansk
  Should be: Dark textured card approach per CLAUDE.md (no personal Poland photos exist)
```

```
[SHOULD FIX] Structure > Insurance section is only "Adventure Insurance"
  Current: Only mentions Hazardous Activities rider
  Should be: Full insurance section with general travel insurance + SAAP/GP framing
```

### NICE TO HAVE

```
[NICE TO HAVE] Copy > Auschwitz handled with appropriate restraint ✅ PASS
```

```
[NICE TO HAVE] Structure > 60-Second Read serves as Quick Read — adequate
```

```
[NICE TO HAVE] Data > Credit card referral cascade says "Jan 2026" — now stale
  Should be: Update to "ASAP" or "Now"
```

### Summary

| Category | Verdict |
|----------|---------|
| Copy | Conditional Pass |
| Visual | FAIL |
| Data | Conditional Pass |
| Structure | FAIL |
| Photos | FAIL |

---

## 4. Iceland — NEEDS WORK

### CRITICAL

```
[CRITICAL] Photo Integration > No images embedded
  Current: Zero images — no base64, no <img> tags
  Should be: Dawson's personal photos (Oxararfoss, Westman Islands, Eldfell available per CLAUDE.md)
  Why: Only framework validated by one of the Lads with multiple personal photos available
```

```
[CRITICAL] Structure > No Google Maps list links
  Current: No maps.app.goo.gl links anywhere
  Should be: Links to relevant Google Maps lists (Iceland listed as pending city for database extraction)
```

```
[CRITICAL] Structure > No tour booking links
  Current: No Viator or GetYourGuide links
  Should be: Day trip booking links for Westman Islands ferry, ice cave tours, glacier hikes
```

```
[CRITICAL] Copy > "One of the Lads" instead of "Dawson"
  Current: Every personal voice callout says "One of the Lads"
  Should be: "Dawson" — Iceland is Dawson's validated destination per CLAUDE.md
```

### SHOULD FIX

```
[SHOULD FIX] Meta Tags > Missing Open Graph tags ✅ FIXED
```

```
[SHOULD FIX] Copy > Email address mismatch ✅ FIXED
```

```
[SHOULD FIX] Visual > No body font (Outfit) loaded ✅ FIXED
```

```
[SHOULD FIX] Data > "2026 kilometre road tax" reference
  Current: "The 2026 kilometer road tax adds cost but does not change the route"
  Should be: Verify this is a real policy; if real, add estimated cost
```

```
[SHOULD FIX] Structure > No "Quick Read" / overview section
  Current: Goes straight from hero to eclipse warning to insurance
  Should be: Brief Quick Read section after the hero
```

### NICE TO HAVE

```
[NICE TO HAVE] Visual > Confidence label colors don't match spec exactly
  Current: Uses gold/summer-accent/research-voice
  Should be: Copper warm = personal, cool blue-grey = research per CLAUDE.md
```

```
[NICE TO HAVE] Typography > Google Fonts preconnect ✅ FIXED
```

```
[NICE TO HAVE] Visual > Palette is strong and distinct ✅ PASS
```

### Summary

| Category | Verdict |
|----------|---------|
| Copy | Partial Pass |
| Visual | PASS |
| Data | Mostly Pass |
| Structure | Partial Pass |
| Photos | FAIL |

---

## 5. Dublin + Galway — NEEDS WORK

### CRITICAL

```
[CRITICAL] Structure > Google Maps list links completely missing
  Current: No Google Maps links anywhere
  Should be: Dublin Pubs, Dublin Attractions, Galway lists
```

```
[CRITICAL] Structure > Day trip tour links use wrong URLs
  Current: Generic Viator links
  Should be: https://gyg.me/V0UrxNUe (Wicklow) and viator.com/.../d5156-8625P1 (Cliffs of Moher)
```

```
[CRITICAL] Other > Contact email was wrong ✅ FIXED
```

```
[CRITICAL] Other > Open Graph meta tags missing ✅ FIXED
```

```
[CRITICAL] Visual > Outfit font not loaded ✅ FIXED
```

```
[CRITICAL] Other > Google Fonts preconnect ✅ FIXED
```

### SHOULD FIX

```
[SHOULD FIX] Visual > Background color doesn't match spec exactly
  Current: --bg:#14261A
  Should be: #0f1a15 per CLAUDE.md Dublin/Galway palette
```

```
[SHOULD FIX] Visual > No confidence label differentiation
  Current: All badges use single style (gold/copper accent)
  Should be: Personal = copper warm, Research = cool blue-grey
```

```
[SHOULD FIX] Structure > No Quick Read / overview summary section
```

```
[SHOULD FIX] Structure > Insurance section missing
  Current: No mention of travel insurance
  Should be: Dedicated insurance section
```

```
[SHOULD FIX] Photos > One embedded image exceeds 150KB threshold
  Current: "Hazel Mountain Chocolate" image ~174KB
  Should be: Under 150KB
```

```
[SHOULD FIX] Copy > Research-based sections not clearly labeled as such
  Current: St. Patrick's and Summer timing windows presented identically to Christmas (validated)
  Should be: Should carry "Research-Based" labels
```

### NICE TO HAVE

```
[NICE TO HAVE] Copy > U2 claim about O'Donoghues is incorrect
  Current: "U2 allegedly got their start here"
  Should be: The Dubliners and Christy Moore are associated with O'Donoghue's, not U2
```

```
[NICE TO HAVE] Copy > Two placeholder descriptions (Salt House, Tigh Chinn)
  Current: "Very good. Pending database addition."
  Should be: Actual descriptions with personal detail
```

```
[NICE TO HAVE] Data > Flight prices may need 2026 verification
  Current: Christmas ORD-DUB $850 seems low for peak holiday
```

### Summary

| Category | Verdict |
|----------|---------|
| Copy | Marginal Pass |
| Visual | FAIL |
| Data | Marginal Pass |
| Structure | FAIL |
| Photos | Marginal Pass |

---

## 6. Italy / Rome — NEEDS WORK

### CRITICAL

```
[CRITICAL] Structure > No Google Maps List Links
  Current: No links to Rome Food or Rome Attractions maps
  Should be: maps.app.goo.gl/kmFjNeA6k8BHuHWT8 and maps.app.goo.gl/RAS5mqRhc6BYTa5D6
```

```
[CRITICAL] Structure > No Day Trip Booking Link
  Current: No reference to Pompeii + Amalfi + Sorrento tour
  Should be: https://gyg.me/c6cN0bz2 prominently placed
```

```
[CRITICAL] Footer > Wrong Contact Email ✅ FIXED
```

```
[CRITICAL] Structure > No Insurance Section
  Current: No mention of insurance
  Should be: Dedicated insurance section
```

```
[CRITICAL] Head > No Open Graph Meta Tags ✅ FIXED
```

### SHOULD FIX

```
[SHOULD FIX] Typography > Body Font Uses EB Garamond Instead of Outfit ✅ FIXED (font loaded, CSS update still needed)
```

```
[SHOULD FIX] Head > Outfit Font Not Loaded ✅ FIXED
```

```
[SHOULD FIX] Head > No Google Fonts Preconnect ✅ FIXED
```

```
[SHOULD FIX] Data > Hero Says "43 Validated Spots" but Database Says 33 Rated
  Current: "43 validated spots"
  Should be: "33 rated spots" or clarify 43 = total (rated + unrated)
```

```
[SHOULD FIX] Visual > Confidence Labels Use Wrong Color System
  Current: Research uses green (#7A8B6A)
  Should be: Cool blue-grey like #8A9BAA
```

```
[SHOULD FIX] Photos > Two Images Exceed 150KB Limit
  Current: ~161KB and ~223KB
  Should be: Under 150KB each
```

### NICE TO HAVE

```
[NICE TO HAVE] Copy > Pantheon description sounds generic
[NICE TO HAVE] Photos > Sistine Chapel ceiling available but not used
[NICE TO HAVE] Data > Roma Pass price may need 2026 update (currently 58€)
```

### Summary

| Category | Verdict |
|----------|---------|
| Copy | PASS |
| Visual | Conditional Pass |
| Data | PASS |
| Structure | FAIL |
| Photos | Conditional Pass |

---

## 7. Spain (Barcelona + Madrid) — NEEDS WORK

### CRITICAL

```
[CRITICAL] Structure > No Google Maps List Links
  Current: Zero Google Maps links
  Should be: Barcelona Food, Barcelona Bars, Barcelona Attractions lists
```

```
[CRITICAL] Structure > No Tour Booking Links
  Current: Montserrat mentioned but no booking link
  Should be: viator.com/.../d562-6874P164
```

```
[CRITICAL] Structure > No Insurance Section
```

```
[CRITICAL] Structure > No Contact Email
  Should be: dangelobraden43@gmail.com
```

```
[CRITICAL] Structure > No Open Graph Meta Tags ✅ FIXED
```

```
[CRITICAL] Structure > No Quick Read / Overview Section
```

```
[CRITICAL] Structure > No "What First-Timers Get Wrong" Section
```

### SHOULD FIX

```
[SHOULD FIX] Visual > Outfit Font Not Loaded ✅ FIXED
```

```
[SHOULD FIX] Visual > No Google Fonts Preconnect ✅ FIXED
```

```
[SHOULD FIX] Visual > Confidence Label System Incorrect
  Current: Differentiates by person (amber/burgundy/grey) instead of by confidence tier
  Should be: Copper warm = personal, cool blue-grey = research
```

```
[SHOULD FIX] Data > Database Spot Count Discrepancy
  Current: Hero says "79 personally validated Barcelona spots"
  Should be: 55 rated spots per CLAUDE.md database
```

```
[SHOULD FIX] Photos > One Embedded Image Exceeds 150KB (165KB)
```

```
[SHOULD FIX] Data > Camp Nou Capacity Reference May Be Outdated
  Current: "capacity limited to ~60K" — may be fully reopened by 2026
```

```
[SHOULD FIX] Structure > No Href Links At All (Beyond Google Fonts)
  Current: Zero <a href="..."> links in entire 2019-line file
  Should be: Clickable links for tours, maps, email, external references
```

### NICE TO HAVE

```
[NICE TO HAVE] Photos > Montserrat viewpoint photo is present ✅ PASS
[NICE TO HAVE] Copy > Minor generic phrases ("one of the best weeks of your life")
```

### Summary

| Category | Verdict |
|----------|---------|
| Copy | Conditional Pass |
| Visual | FAIL |
| Data | Conditional Pass |
| Structure | FAIL |
| Photos | Conditional Pass |

---

## 8. Australia + NZ — NEEDS WORK

### CRITICAL

```
[CRITICAL] Footer > Wrong Contact Email ✅ FIXED
```

```
[CRITICAL] Head > Missing Open Graph Meta Tags ✅ FIXED
```

```
[CRITICAL] Structure > No Insurance Section
  Current: No mention of insurance
  Should be: Dedicated section — especially critical for Australia (healthcare expensive for non-residents)
```

```
[CRITICAL] Head > Missing Outfit Font ✅ FIXED
```

```
[CRITICAL] Head > No Google Fonts Preconnect ✅ FIXED
```

```
[CRITICAL] Structure > No Google Maps List Links
```

```
[CRITICAL] Structure > No Tour Booking Links
```

### SHOULD FIX

```
[SHOULD FIX] Data > Sydney Spot Count Uses Total (123) Instead of Rated (57)
  Current: "123 rated spots in the database"
  Should be: "57 rated spots" or "123 spots, 57 rated"
```

```
[SHOULD FIX] Photos > Two Embedded Images Exceed 150KB
  Current: ~186KB and ~157KB
  Should be: Under 150KB each
```

```
[SHOULD FIX] Photos > Missing Available Personal Photos
  Current: 7 images used
  Should be: Also include nightclub inflatables, kangaroos, surf camp group
```

```
[SHOULD FIX] Structure > No "What First-Timers Get Wrong" Section
```

```
[SHOULD FIX] Structure > No Explicit Group Size Modeling
```

```
[SHOULD FIX] Data > Cost Table Says "All AUD" but Flight Prices Are USD from ORD
```

```
[SHOULD FIX] Copy > "Quick Read" Section Labeled as "Overview" Instead
```

### NICE TO HAVE

```
[NICE TO HAVE] Copy > NZ section could be more substantive (thin vs. Australia half)
[NICE TO HAVE] Data > Opal Sunday cap price ($9.65 AUD) may be outdated for 2026
```

### Summary

| Category | Verdict |
|----------|---------|
| Copy | PASS |
| Visual | FAIL |
| Data | Conditional Pass |
| Structure | FAIL |
| Photos | Conditional Pass |

---

## MASTER SUMMARY TABLE

| Framework | Copy | Visual | Data | Structure | Photos | Critical | Should Fix | Overall |
|-----------|------|--------|------|-----------|--------|----------|------------|---------|
| **Munich** | Pass | FAIL | Pass | FAIL | FAIL | 5 | 8 | REBUILD |
| **Thailand** | FAIL | Cond. | Pass | FAIL | FAIL | 9 | 8 | REBUILD |
| **Poland** | Cond. | FAIL | Cond. | FAIL | FAIL | 6 | 9 | REBUILD |
| **Iceland** | Partial | Pass | Mostly | Partial | FAIL | 4 | 5 | NEEDS WORK |
| **Dublin** | Marg. | FAIL | Marg. | FAIL | Marg. | 7 | 8 | NEEDS WORK |
| **Italy** | Pass | Cond. | Pass | FAIL | Cond. | 5 | 7 | NEEDS WORK |
| **Spain** | Cond. | FAIL | Cond. | FAIL | Cond. | 7 | 7 | NEEDS WORK |
| **Australia** | Pass | FAIL | Cond. | FAIL | Cond. | 7 | 7 | NEEDS WORK |

---

## UNIVERSAL ISSUES (found across all 8 frameworks)

| Issue | Affected | Status |
|-------|----------|--------|
| No Outfit font loaded | 8/8 | ✅ FIXED |
| No Open Graph meta tags | 8/8 | ✅ FIXED |
| No Google Fonts preconnect | 8/8 | ✅ FIXED |
| Wrong or missing contact email | 8/8 | ✅ FIXED (4 replaced, 4 had none) |
| No insurance section | 7/8 (Poland partial) | OPEN |
| No Google Maps list links | 8/8 | OPEN |
| No tour booking links | 7/8 (Dublin has wrong ones) | OPEN |
| Missing Quick Read section | 6/8 | OPEN |
| Missing "What First-Timers Get Wrong" | 5/8 | OPEN |
| Images over 150KB limit | 6/8 | OPEN |

---

## RECOMMENDED PRIORITY

1. **Universal fixes applied** — Outfit font, OG tags, preconnect, contact email (completed April 9, 2026)
2. **Munich, Thailand, Poland** need full rebuilds per CLAUDE.md Track 1
3. **Iceland, Dublin, Italy, Spain, Australia** need structural fixes (links, sections) but have strong copy foundations
4. **Remaining universal issues** — insurance sections, Google Maps links, tour booking links should be addressed across all files before launch
