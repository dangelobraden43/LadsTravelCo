---
name: booking-sources-and-viator-matching
description: Durable lessons on where official booking rules live (NPS concessioner/CUA pages, operator FAQs, Recreation.gov) and why Viator searches for US parks mis-resolve
metadata:
  type: reference
---

**Official channels for US national park units**
- NPS `planyourvisit/boat-tour.htm`-style pages name the sole concessioner for an experience. That makes the concessioner the official sale channel; name it as a fact, never as a pick.
- NPS `planyourvisit/kayak-tours.htm`-style pages carry the Commercial Use Authorization (CUA) list of permitted guides. It changes yearly; it is the check against unauthorized operators.
- Operator `/faqs/` pages are the best single read for sell-out language, refund cutoffs, check-in times and season dates.
- Recreation.gov listings can contradict the park's own page (Pictured Rocks, Oct 2026: a "guided tour" ticket listing for a climb the NPS says is first come, first served). Trust the NPS page; flag the conflict as a trap.
- Recreation.gov pages are JS-heavy; snippets are usable, fetches rarely are.

**West Virginia / New River Gorge (Oct 2026 run)**
- NPS does NOT license rafting outfitters on the New/Gauley/Bluestone; the state does (whitewater.wvdnr.gov). The neri CUA page names no operators. `nps.gov/neri/planyourvisit/outfitters.htm` is a 404.
- Gauley rafting depends on Summersville Dam releases and ends on Bridge Day weekend (third weekend of Oct). Any late-October trip date is past it: check every year.
- `wvstateparks.com/aerial-tramways` 404s and park pages omit tram schedules; local press (WVNS digital-release, WVVA) and county CVB blogs carry them.
- `bridgewalk.com` and `aceraft.com/product/...` pages fetch cleanly. AOTG promo-titled URLs load blog shells with no offer content: do not spend a fetch on them.
- Restaurant reservation policies for small-town casual spots are not findable by search; budget a gap rather than calls.

**Viator product matching (Tivoli rule)**
- `allowed_domains: ["viator.com"]` searches for niche US parks return name collisions (Pictured Rocks -> Sydney "The Rocks"). Three searches found no matching product.
- Better next approach: fetch Viator's destination page for the gateway town and match by operator name against the NPS concessioner/CUA list. If no match, record a gap.

**Budget**
- 12 calls covers about 5 bookable experiences well. Read the earlier-wave agent files first: parks-trails usually already holds campground and permit rules, so spend calls on cruises, guided tours and lighthouse/attraction tickets instead.

Related: [[research-contract]]
