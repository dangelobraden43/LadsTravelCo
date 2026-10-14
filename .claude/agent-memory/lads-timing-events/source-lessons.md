---
name: timing-source-lessons
description: Durable source lessons for timing/events research - which pages are empty, which list stale years, how search summaries mislead on dates
metadata:
  type: reference
---

- **NPS `planyourvisit/visitorcenters.htm` pages can have EMPTY "Hours & Seasons" blocks** (seen at Pictured Rocks, Oct 2026). Do not spend a fetch expecting season dates there; `hours.htm` is also generic. The park's `winter-road-closures.htm` and `insects.htm` pages are the concrete ones.
- **Local visitor-bureau "Annual Events" pages give reliable recurring PATTERNS ("last Sunday in June") but stale-year dates** (munising.org listed 2024 dates in late 2026). Record the pattern; never publish the old year's date or a computed next date without confirming.
- **WebSearch answer summaries state future event dates without naming which page they came from.** Treat as snippet-only, confidence low, and flag for the verifier; cite the event's own listing.
- **Visitation figures in press coverage cluster on record years** (2020-2021 pandemic). NPS IRMA stats are the real source for a current crowd curve; budget one call for it.
- **The trap season pattern for northern parks:** insect season (black flies mid-May to mid-June) and the post-cruise / pre-snowmobile gap (late Oct to Nov) are the two "cheap for a reason" windows. Check both. See [[timing-budget-plan]].
- **Search summaries can get weekdays wrong** (a school-calendar summary called a Tuesday "Monday"). Check every weekday/date pair yourself; if one is wrong, mark all dates from that summary low.
- **OPM `federal-holidays/` page is a one-fetch source for US holidays a year out** (read Oct 2026, had 2027). Use it instead of searching holidays.
- **news.wttw.com returns 403 on fetch.** Snippet only.
- **Ski seasons:** resort-announced opening targets are not out by early October. A regional press roundup of last season's openings (e.g. Northern Express for N. Michigan) gives per-resort dates in one read; resort press releases give late-season traps (one-run "still open"). Lake Michigan car ferries are seasonal and are a winter logistics closure.
- **Eclipse runs:** timeanddate.com city eclipse pages 403 on fetch (all cities). NASA GSFC `SEpath/.../SE<date>Tpath.html` fetches clean (limits, sun alt, duration by UT) and the `SEplot` GIF is readable as an image via Read. IGN astronomia.ign.es eclipse page gives headline towns but its municipality table renders empty. Eclipsophile 2027 is at `eclipsophile.com/?p=4226` (the /2027tse/ slug 404s). See [[event-season-sources]].
- **AEMET climate normals fetch clean** at `aemet.es/es/serviciosclimaticos/datosclimatologicos/valoresclimatologicos?l=<station>&k=<region>` (Sevilla 5783, Malaga 6155A): all 12 months, mean max, rain days, clear days. Use instead of Wikipedia climate tables.
- **Spanish regional holidays:** BOJA PDFs do not render on fetch; press (andaluciainforma.es, which eldiario subdomain 301s to) plus diainternacionalde.com calendar pages read clean.
- **Big-tournament fixtures (RWC 2027 run, Oct 2026):** organiser match pages render client-side and fetch empty; the governing body's news releases (world.rugby/news/...) fetch clean with phase dates; participating national unions' schedule pages (scottishrugby.org) carry venue-local kick-off times; the state stadium operator (stadiums.qld.gov.au) lists its venue's full fixture. Ask the organiser /news index for article URLs instead of searching.
- **Australia gov sources:** state education "future term dates" pages (NSW, WA, QLD `/about-us/calendar/future-dates`, vic.gov.au) and nsw.gov.au / qld.gov.au public-holiday pages fetch clean a year out. bom.gov.au, timeanddate.com, sa.gov.au, education.sa.gov.au, business.vic.gov.au = 403; fairwork.gov.au times out. Climate: australia.com + climatestotravel.com city pages (australia.com's Melbourne row duplicated Sydney's).
- **Ticket phases:** past phases go in one CLOSED-history finding; the open phase gets a re-check datedUntil (today+30) since no end date is published.
- Budget note: 12 calls covers ~4 windows + events + closures only if fetches are spent on official pages; school breaks and weather normals got squeezed out. Plan one call each up front.
