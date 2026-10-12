# /deals — Holiday Travel Sales 2026 (design)

Approved in chat by Brady, Oct 12 2026 ("this looks good … strengthen our positioning and then
get to work"). Worldwide page; the US section is the deepest because most clients are US-based.

## Purpose

The honest alternative to deal sites. A traveller learns when the 2026 sales run, how to tell a
real deal from a re-labelled normal fare, and which sales actually cover the trip they want —
with the catch printed before the percentage. It is a booking hook into `/plan-your-trip` and the
founding list, and a proof-of-quality surface (Gate 4) a stranger sees before paying.

## Positioning (what makes it ours, and stays true)

1. **The catch first.** Every sale card leads with its restriction line (base fare only, blackout
   dates, members only), then the brand's own wording, never our superlatives.
2. **"Will this sale cover my trip?"** An interactive date finder: pick travel dates, see which
   sales' travel windows cover them and which blackouts collide. Derived from data, not typed.
   No deal site does this; it is the trust layer as a tool.
3. **Nothing goes stale.** Every card has a source and a checked-on date; it removes itself after
   its book-by date, and hides during sale week if not re-checked within 7 days.
4. **Nobody paid to be here.** A plain disclosure: brands do not pay for placement; only Viator
   links earn us a commission and they are marked. Airline, hotel, rail and ski cards link to the
   brand's own page untagged.
5. **Evidence, not hype.** "Is it actually a deal?" cites the studies, including where the
   evidence is thin, and teaches one habit: track a price before the sale.
6. **Derived flags in our read.** e.g. "Travel window ends Mar 4: misses most spring breaks" is
   computed from the card's dates, never hand-typed.

## Page (top to bottom)

1. **Hero** — edition name, the three dates, a computed state: countdown before Nov 27, "sale week
   is on" Nov 27–Dec 5, "last chances" until the latest live `bookBy`, then the January edition.
2. **Is it actually a deal?** — evidence cards (Hopper's deal-count framing, Which? travel and
   retail tests, Google's booking-window data, consumer-protection rules) + the habit.
3. **The traps** — each quoted from a brand's own fine print, with the source.
4. **Will this sale cover my trip?** — the finder.
5. **The sales** — two sections, **Worldwide** and **From the US** (US deepest: airline by
   airline). Before 2026 sales are announced each section shows the **2025 pattern, labelled
   "last year"**; announced 2026 sales render above it as live cards.
6. **Deals that aren't on Black Friday** — ski pass price steps, the Christmas-market fare window
   (links `/christmas-markets`), spring break 2027 booking window, early-January airline sales,
   National Plan for Vacation Day (Jan 26 2027).
7. **Close** — `/plan-your-trip` and `/join`. No price, no Club offer (pricing is a founder
   decision locked in December).
8. **Method line** — researched, checked on {date} against brands' own pages, independent
   fact-checker.

## Data and logic

- `src/data/holidayDeals.js` — `EDITION`, `EVIDENCE`, `TRAPS`, `SALES`, `SEASONAL`, `CHECKED_ON`.
  A sale: `id, brand, region ('us'|'world'), kind, year, offer (brand's words), appliesTo,
  bookStart?, bookBy, travelStart?, travelEnd?, blackouts[], fineprint[], src, checkedOn,
  viator?`. Only findings the fact-checker CONFIRMED or CORRECTED go in.
- `src/utils/deals.js` — `saleStatus(sale, today)` → `expired | stale | live | announced | last-year`;
  `visibleSales`, `coversTrip(sale, from, to)` (window covers the dates, no blackout inside),
  `missesSpringBreak(sale)`, `heroState(edition, sales, today)`. Tests in
  `tools/tests/deals.test.mjs`.
- Route `/deals` in `main.jsx`, rewrite in `vercel.json`, sitemap 0.8, own canonical + meta.
- Palette new and exclusive to this page: ink and price-tag ("fine print under a highlighter").

## Rules held

Ranges and the brand's own percentages only; never a single fare from us; never a Lads price;
never "free" in our voice (brand offer names quoted with attribution); no insurance; Viator via
`resolveBooking()` only; no counts typed into copy.

## Verification

`npm test`, `npm run build`, then a click-test at 1440 and 390: the finder, every card's links,
the hero state under mocked dates (before, during, after sale week), no overflow.

## Operations

Nov 13–Dec 5: short refresh sessions every 2–3 days adding announced 2026 sales. Cards expire on
their own if a session is missed. January: switch `EDITION` to "Book your 2027".
