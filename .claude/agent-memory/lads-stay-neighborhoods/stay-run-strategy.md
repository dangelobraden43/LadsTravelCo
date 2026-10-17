---
name: stay-run-strategy
description: How to spend a 12-call stay budget - multi-city event briefs, where search results come from, which STR sources pay off
metadata:
  type: reference
---

- **Multi-city event briefs (e.g. Christmas markets, 15+ cities):** 12 calls covered 5 headline cities (neighbourhoods + STR rules) at snippet grade only. Pick the 4-5 headline cities up front and record the rest as a `could-not-look` gap; do not spread thin.
- **"Where to stay in X" searches return hotel-aggregator listicles** (Hotels.com, Expedia, travel blogs), never tourism boards. Result: every neighbourhood finding lands at low/medium confidence. If confidence matters, spend one WebFetch per city on the tourism board's district page instead of a search.
- **One search per city for STR rules pays off.** shorttermrentalz.com (trade press) indexes European city rules and pairs well with local English-language press (expats.cz, The Local) for the two-source bar. City sites (e.g. strasbourg.eu "changement d'usage") show in results; fetch them to upgrade from snippet.
- **District-level STR bans are a recurring trap shape** (Budapest District VI from 2026; Prague 1 pushing for powers). Search by district, not just city.
- **Check article dates on "night-life / noise" press.** A night-mayor piece looked current and was from 2019. Name the year in notes.
- **Multi-venue sports tournaments (7+ host cities):** 12 calls = 3 fill-evidence calls + 3 STR-rule calls + 4 city bases + 2 regional fill. The smallest host cities went unresearched. Next time, batch two small cities per search, or skip the 4th big-city search.
- **Single-venue mega-event, 8 candidate bases, 25 calls (Ryder Cup 2027):** official accommodation + travel-services FAQ + campsite + transport pages (4 fetches) were the highest-value calls. Press on fill/price ate ~9 more, leaving 1 call per base and none for Newcastle West or Killarney nights. Next time: cap fill/price press at 5 calls and batch two small towns per search. Event-week tier ranges do not exist in sources ahead of time; record the gap on call one rather than hunting.
- **Follow-up regional run (3 small towns, 20 calls, Clare Oct 2026):** reading the head-start run first saved ~6 calls. Best split: 3 STR/fill press, 1 competing-festival, 3 tourism-wiki town fetches, 1 bus timetable, 2 spare. Price-tier hunting (statistics office, hotel survey) burned 3 calls for nothing.
- **This agent may run without a shell tool**, so `node tools/research/validate.mjs` cannot be run; check the file by hand against validate.mjs (money regex, two hosts per actionable kind, derivedFrom ids) and say so in the report.
- **Bookend city for an event elsewhere (Dublin for Ryder Cup, 20 calls):** 2 neighbourhood fetches (Time Out + one local guide) covered 6 areas; ~6 calls on price tiers/seasonality; 3 on event-week venue calendars; 2 on areas to avoid; 1-2 on STR. Frame each area by the trip's two anchors (the train station west, the airport). The agent may have no Bash; check the file against validate.mjs by reading its regexes.
- **Shared search pool:** see [[stay-source-lessons]]. On 2026-10-17 it refused one agent at its 13th search and another at its 15th; WebFetch kept working.
- **Follow-up runs on the same event:** read the prior run's verifier verdicts first and spend calls only on its gaps; the official pages (accommodation, campsite FAQ) are worth one re-read for status changes.
- **Single-city follow-up (Galway, 20 calls, no WebFetch):** 5 area-character searches, 4 price-tier searches (hotel star averages, STR ADR, ADR press, hostels), 4 STR-law searches, 3 demand/competing-event, 2 lodging-supply/campus, 1 areas-to-avoid, 1 population. Grep the same run's scout files first: drink/eat files already locate nightlife and late food by area, so area claims can cite them instead of re-searching.
- Read other agents' JSON first: provenance gives each market's district (P131), which tells you which neighbourhood the market is in for free.
- See [[stay-source-lessons]].
