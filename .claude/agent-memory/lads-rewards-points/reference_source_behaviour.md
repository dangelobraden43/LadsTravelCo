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

**Added on the rugby-world-cup-2027 run (2026-11-10):**
- Read cleanly, and good for award prices (all dated, points press): `upgradedpoints.com/news/qantas-new-award-charts-2025/`
  (full Qantas zone tables, old and new), `pointhacks.com.au` guides (Qantas and Velocity,
  state an "as of" month), `thepointsguy.com/travel/use-points-and-miles-travel-to-<city>/`
  (one-way price per programme with taxes), `frequentmiler.com/?p=<id>` (search returns
  these ids and they fetch), `awardwallet.com/blog/...` and `awardwallet.com/news/...`
  (chart-change articles give old and new values), `awardfares.com/blog/ultimate-guide-to-award-release-dates/`
  (days-before-departure table per programme), `thriftytraveler.com/news/points/...`.
- Read cleanly, official: `bilt.com/card` (three cards, fees, issuer; names no partners),
  `capitalone.com/credit-cards/venture/` (shows the bonus; the Venture X page shows only a
  referral offer), `citi.com/credit-cards/citi-aadvantage-platinum-select-world-elite-mastercard`
  (earn rates; fee amount and bonus blank), `hilton.com/en/locations/<country>/<city>/`
  (hotel names; the country page lists only city links), `horwathhtl.com` chains reports
  (properties and rooms per hotel group, national), `ihgplc.com` news releases.
- `thepointsguy.com/credit-cards/credit-card-transfer-partners/` fetches but the table
  flattens: ratios per programme survive, the bank each belongs to does not.
- Fail: `qantas.com/.../classic-flight-reward-tables.html` times out (US and AU);
  `alaskaair.com/atmosrewards/content/...` returns a title only; `nerdwallet.com` articles
  return navigation only. The WebFetch `offset` parameter does NOT rescue Amex or Alaska:
  the page text simply ends (Amex ~12,600 chars, earn rates and no-FX-fee only).
- One programme per search query. Queries naming five programmes at once came back thin
  and needed a second search.

**How to apply:** start card work with the Chase and Capital One pages (one fetch each
covers a whole currency). Budget a search for Amex fees and for award charts. Card terms
(fee, bonus spend) pass the validator as `fixedPrice: true` with an official source; never
put a dollar figure in a synthesis finding. See [[rewards-run-lessons]].
