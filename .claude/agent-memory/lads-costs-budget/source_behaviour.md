---
name: source-behaviour-costs
description: Which price and tax sources fetch cleanly for a costs run, which fail, and how to spend the WebSearch budget
metadata:
  type: reference
---

Learned on the Vancouver pilot (2026-09-29). Re-verify, sources change.

- WebFetch on official pages is not counted against the WebSearch budget in practice, so fetch official pages directly and use searches to discover URLs. Guessed deep URLs on gov.bc.ca and translink.ca often 404; search first to get the real path (gov.bc.ca uses `/pst/publications/<topic>`).
- Fetched fine: tourism-board guides (vancouvertourism.org), museum sites, ticketing pages for Grouse Mountain, gov.bc.ca publication pages, dailyhive.com.
- Failed: shop/ticket portals (403), vancouverisawesome.com (403), gov PDFs (compressed text, unreadable), attraction info pages that hide the price behind a portal (Capilano).
- The search tool returns an LLM summary, not per-figure attribution. Snippet-only price ranges must be marked `access: snippet`, confidence low, and the note must say attribution is unclear.
- Budget-guide totals almost always include lodging; a per-day figure excluding lodging usually has to be summed from component prices and marked low confidence.
- Coffee and other small items tend to have only one source; plan the second-source search early or record a gap.
- Fares and attraction prices reset each July 1 (transit) or each season; guides written before then show old figures. Check for both old and new figures.
- Two same-domain pages do not count as two independent sources for the validator.
