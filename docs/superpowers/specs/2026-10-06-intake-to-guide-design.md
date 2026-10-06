# Intake to Guide — design

**Date:** October 6, 2026 · **Status:** approved in conversation by Brady (sections 1–5), spec awaiting his review
**Prototype:** https://claude.ai/artifact/KsTsgXnu1kKfFxroZUo6aB (v2, approved: "the quiz looks good")
**Research behind it:** `internal/research/market/2026-10-06-intake-ux.md`, `…-landscape.md`, `…-holiday-deals.md`

## 1. What this is

A traveller tells us who they are and what they want; the research pipeline turns that
into a guide they can trust, for any destination, visited by us or not. This is the
product strangers pay for from January 1, 2027 (launch gate 1).

Brady, Oct 6: *"go from an intake quiz and some talk about preferences to a truly amazing
guide with all of the best research and recommendations regardless if we have been there
or not."*

**Success:** a stranger completes the intake on a phone, a founder triages it, the agents
research it, a founder reviews it, and the traveller opens a guide at Peru-page quality.

**Out of scope here:** checkout and price (waits on the founders' packaging decision and
the five conversations), Club membership mechanics.

## 2. Decisions already made (Brady, Oct 6)

| Decision | Ruling |
|---|---|
| Guide format | A private web page on ladstravel.com built on the Peru components. PDF on request. |
| Who starts a run | A founder, after reading the intake. Never automatic (spam, token cost). |
| The conversation | Quiz first for everyone; an optional 15–20 min call through Cal.com after. |
| Where intakes land | Airtable. |
| How a guide is opened | A private, unguessable link. No login. Can be switched off. |
| Group input | Companion links from the start. Each person answers their own limits and tastes. |
| Email | MailerSend for one-off messages; MailerLite (reopened) for the founding list. |

## 3. The quiz — `/plan-your-trip`

The approved prototype is the reference. Phone-first: 44px targets, no plain dropdowns, no
drag, no slider without a typed alternative, "(optional)" labels instead of asterisks, one
topic per screen, progress counted by section.

**Organiser steps:** 0 Start (name, email, optional phone, occasion, how they found us) ·
1 The trip (destination or help-me-choose; nearby places; one base or several; fixed or
flexible dates; home airport typeahead) · 2 Your crew (counters, ages, relationship,
travel experience, first trip abroad, passports, cost splitting, companion links) ·
3 Budget (per day or per trip, bands plus exact figure, hard limit or guide, splurge and
save) · 4 Your style (six this-or-that pairs, tap-to-rank top 3, "which kind?" per top
interest, also-into, perfect day) · 5 The details (food with allergy severity and
cross-contact, lodging, sleep, getting around, travel-day tolerance, motion sickness,
accessibility, active limits when outdoors is picked, points and cards) · 6 Your wishes
(10/10, must-dos, avoid, booked, loved and hated trips, who gets the link, need-by date,
format, contact preference) · Review (the boarding pass, "We will never plan…", a plain
summary with Change links per section) · Sent (call offer, companions still waiting).

**Companion steps:** name · limits (diet, drinking, hike, altitude, anything to plan
around) · style (pairs, top 3, one thing they would hate to miss).

**Visual language:** passport stamps per step, a boarding pass that builds itself, a
per-step ink colour on selections. The tile symbols in the prototype are placeholders for
drawn icons. The site's dark palette and type stack; the inks are new and used only here.

`/join` keeps the founding list; its "trip this year" track links here. An opt-in box on
step 0 adds the person to MailerLite.

## 4. Data

One shared schema module (`src/intake/schema.js`) used by the quiz and the functions.

**Hard limits** are derived, never typed by us: severe allergies (+ cross-contact),
diets, companion "plan around" notes, no driving, motion sickness, accessibility needs,
the group's shortest hike and altitude limit, a budget marked as a hard limit, passport
problems. They show on the review page and travel into the brief as rules.

**Airtable base "Lads Intakes":**
- `Intakes` — one row per trip; answers as JSON plus key columns for triage
  (destination, dates, party size, budget band, occasion, source); `Status`
  (Draft · New · Spam · Needs follow-up · Run started · In review · Delivered · Closed)
  with a timestamp per status change. These timestamps feed the December capacity review.
- `Companions` — linked to an intake; answers JSON; answered-at.
- `Guides` — linked to an intake; token; state (active · off); delivered-at.

## 5. Functions (Vercel, `api/`)

- `POST /api/intake` — create or update a draft by resume token; returns the token.
  Validates against the schema. Spam checks: hidden honeypot field, minimum
  time-to-complete, Cloudflare Turnstile.
- `GET /api/intake/:resume` — load a draft to resume.
- `POST /api/companion/:invite` — save a companion's answers.
- `GET /api/guide/:token` — return a guide's JSON from Blob storage; 410 when switched off.

Secrets (Airtable token, MailerSend key, Turnstile secret, Blob token) live only in
Vercel environment variables. Brady creates the Airtable token and enables Blob; Claude
walks him through both.

## 6. The research run

`/research --intake <recordId>`:
1. `tools/intake/brief.mjs` fetches the row and its companions and writes `BRIEF.json`
   into the run directory: destination, dates, party, budget, ranked interests with
   sub-types, pace and style, **hard limits merged to the strictest answer in the group**,
   preference conflicts named, must-dos, avoid list, loved and hated trips.
2. `RUN.json` references the brief. The research contract gains a Brief section: hard
   limits are filters (never recommend anything that breaks one), preferences set
   research priority.
3. The roster follows the brief (parks-trails only when outdoors is picked, rewards only
   when points are held, and so on).
4. The Itinerary Architect writes `PACKET.md` (founder review, as today) **and**
   `GUIDE.json` (traveller-facing). `validate.mjs` gains a GUIDE schema: every place
   carries a tier (validated or researched) and sources; every cost is a range with a
   checked-on date; no point prices; no Lads voice the founders did not write.

## 7. The guide page and delivery

- `node tools/guide/publish.mjs <runDir>` validates `GUIDE.json`, mints a 128-bit token,
  stores the JSON in Vercel Blob, writes the Guides row, sets the intake to Delivered and
  sends the "guide ready" email.
- `/guide/:token` (lazy route, rewrite in `vercel.json`) renders with the Peru components:
  map, travel windows, places with gold (validated) and copper (researched) tiers, cost
  ranges, the day plan, "We planned around…", sources. `noindex` meta and
  `X-Robots-Tag`, never in the sitemap. A switched-off guide shows a plain "no longer
  available" page.
- PDF: a print stylesheet on the guide route; a founder saves the PDF for a client who
  asks.

## 8. Privacy

Client data never enters the repo or the site bundle; it lives in Airtable and Blob only.
`/privacy` gains a paragraph on how intake answers are used and kept. Default retention:
delete a trip's data 12 months after travel (founder can change).

## 9. Testing and verification

- `node:test` unit tests: schema validation, hard-limit derivation, companion merge to the
  strictest limit, brief building, GUIDE validator, token minting, each function with
  Airtable and Blob stubbed.
- Playwright click-through of the quiz (both flows) and a sample guide at 390 and 1440,
  clicking every control, not screenshots alone.
- `npm run build` clean; Vercel READY verified by SHA after each merge.

## 10. Build order

1. **Phase 1 — Intakes flowing.** Quiz, schema, functions, Airtable, spam checks,
   MailerSend resume and "received" emails, `/join` hand-off. Target: live in November to
   capture holiday-season leads.
2. **Phase 2 — Brief to run.** `brief.mjs`, `/research --intake`, contract Brief section,
   roster from brief.
3. **Phase 3 — The guide.** `GUIDE.json` from the architect, validator, publish script,
   Blob, `/guide/:token`.
4. **Phase 4 — Polish.** Guide-ready email, PDF stylesheet, companion reminder, privacy copy.

## 11. Open questions (founder)

- Retention period (default 12 months after travel).
- Whether a Travel Tuesday Club offer runs; it needs a price set before December 1.
- Cloudflare Turnstile: fine to enable (no cost on the standard tier)?
