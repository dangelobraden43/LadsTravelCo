---
name: source-behaviour-costs
description: Which price and tax sources fetch cleanly for a costs run, which fail, and how to spend the WebSearch budget
metadata:
  type: reference
---

Learned on Vancouver (2026-09-29) and Pictured Rocks (2026-10-06). Re-verify, sources change.

- WebFetch on official pages is not counted against the WebSearch budget in practice, so fetch official pages directly and use searches to discover URLs. Guessed deep URLs on gov.bc.ca and translink.ca often 404; search first to get the real path (gov.bc.ca uses `/pst/publications/<topic>`).
- Fetched fine: tourism-board guides (vancouvertourism.org), museum sites, ticketing pages for Grouse Mountain, gov.bc.ca publication pages, dailyhive.com, nps.gov park pages, legislature.mi.gov statute pages (`/Laws/MCL?objectName=mcl-205-52` style), concessioner fare pages, local TV news (wxyz.com, wlns.com).
- Failed: shop/ticket portals (403), vancouverisawesome.com (403), gov PDFs (compressed text, unreadable), attraction info pages that hide the price behind a portal (Capilano), michigan.gov Treasury (403), pos.toasttab.com (403), Square ordering sites (empty).
- Small-town restaurant sites rarely publish prices (menus are PDFs or absent). For small gateway towns, use the nearest city on Numbeo + livingcost.org as two independent crowdsourced sources, label it a proxy, confidence low. Numbeo URL form that worked: `/cost-of-living/in/Marquette` (not `Marquette-MI`); it reports contributor count, record it.
- The search tool returns an LLM summary, not per-figure attribution. Snippet-only price ranges must be marked `access: snippet`, confidence low, and the note must say attribution is unclear.
- Budget-guide totals almost always include lodging; a per-day figure excluding lodging usually has to be summed from component prices and marked low confidence.
- Validator scans `notes` for point prices too: write derived-budget arithmetic with ranges only ("2 x USD 16-20 = USD 32-40"), never a lone amount.
- A derivedFrom budget can only cite findings in this file: if another agent owns the entrance fee, restate it as your own fixedPrice finding so the tier can reference it.
- Coffee and other small items tend to have only one source; plan the second-source search early or record a gap.
- Fares and attraction prices reset each July 1 (transit) or each season; guides written before then show old figures. Check for both old and new figures.
- Two same-domain pages do not count as two independent sources for the validator.
