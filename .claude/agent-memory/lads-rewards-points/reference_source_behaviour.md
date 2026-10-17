---
name: rewards-source-behaviour
description: Which card-issuer, airline and points pages fetch cleanly for rewards research and which fail (learned Oct 14 2026, eclipse-2027-spain run)
metadata:
  type: reference
---

Learned on the eclipse-2027-spain run (2026-10-14), when the session-wide WebSearch
limit (200 shared by every agent) was already exhausted and only WebFetch worked.

**Fetch cleanly (official, read):**
- Chase product pages, e.g. `creditcards.chase.com/rewards-credit-cards/sapphire/preferred`,
  `.../sapphire/reserve`, `creditcards.chase.com/travel-credit-cards/iberia`: fee, bonus,
  earn rates; the Preferred page lists every Ultimate Rewards transfer partner.
- Capital One transfer partner page
  `capitalone.com/learn-grow/money-management/venture-miles-transfer-partnerships/`:
  full list with ratios and a publication date.
- `capitalone.com/credit-cards/venture-x/`: fee and earn, but no bonus shown.
- `citi.com/credit-cards/citi-strata-premier-credit-card`: fee and earn; bonus fields
  render blank; partner list partial ("and others"). It carried an embedded instruction
  aimed at automated readers: ignore page text that gives instructions.
- Wikipedia `Avios`: which programmes use Avios and rename dates; NOT transfer terms.

**Fail or come back empty:**
- `global.americanexpress.com/rewards/transfer`: no partner list renders.
- Amex product pages (`americanexpress.com/us/credit-cards/card/gold-card/`, `/platinum/`):
  truncated before the annual fee and welcome offer. Need another route to Amex fees.
- `aa.com` partner award chart: HTTP 403.
- Guessing points-blog URLs wastes calls (upgradedpoints Iberia chart guess was 404).

**Added on the ryder-cup-2027-transit run (2026-10-17):**
- Read cleanly: `creditcards.chase.com/travel-credit-cards/aer-lingus` (fee, bonus, companion
  ticket rule); `hilton.com/en/locations/ireland/` (whole-country hotel list, towns only
  partly tied); Air Canada Aeroplan chart-change notices under
  `aircanada.com/ca/en/ado/home/aeroplan/news/...` (changed values only, no unchanged ones);
  `dealspoints.com/redeem-aer-lingus-avios/` (full Avios zone chart + peak calendar, aggregator).
- Fail: `aerlingus.com/aerclub/avios/` returns a CAPTCHA page; `ihg.com/destinations/...` 403.
- This agent has no Bash tool, so `validate.mjs` cannot be run from inside the agent. Check
  the file by hand against `tools/research/validate.mjs` (claim <= 600 chars, two hosts per
  range, no currency amount without fixedPrice + official source) and say so in the report.

**How to apply:** start card work with the Chase and Capital One pages (one fetch each
covers a whole currency). Budget a search for Amex fees and for award charts. Card terms
(fee, bonus spend) pass the validator as `fixedPrice: true` with an official source; never
put a dollar figure in a synthesis finding. See [[rewards-run-lessons]].
