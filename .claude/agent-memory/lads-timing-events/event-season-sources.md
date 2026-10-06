---
name: event-season-sources
description: Which official festival/Christmas-market sites publish next season's dates early and fetch cleanly, which block or 404, and the fetch-first budget tactic
metadata:
  type: reference
---

- **Fetch-first tactic works:** WebFetch of official organiser sites does not count against the search budget. Guess the organiser domain and fetch before searching; spend searches only to discover URLs. (Christmas markets run, Oct 2026: 25 findings on 12 searches.)
- **German/Austrian/Swiss/French/Belgian organisers post next season's dates by early October** and fetch cleanly: christkindlesmarkt.de, christkindlmarkt-muenchen.de (city-run), koelnerweihnachtsmarkt.com, christkindlmarkt.at, christkindlmarkt.co.at, bs.ch/weihnachtsmarkt, montreuxnoel.com/en/, plaisirsdhiver.be/en/practical-info, noel-colmar.com/en/.../practical, adventbazilika.hu/en/opening-hours/, tivoli.dk/en/jul.
- **Czech, Polish, Hungarian city markets publish late** (Nov). In early October expect gaps for Prague, Kraków, Wrocław, Gdańsk, Vörösmarty tér; record prior-year pattern in the gap detail, not as a finding. wroclaw.pl news articles carry full per-day exceptions for the prior year.
- **Blocking/broken:** dresden.de 503'd all day; striezelmarkt.dresden.de does not resolve; prague.eu /en/event/ URLs 404; visitstrasbourg.fr 403; oesterreich.gv.at holiday URLs 404; hospitality-on.com 403.
- **noel.strasbourg.eu FAQ carries LAST year's text** while the homepage shows the new opening date. Label anything from the FAQ as prior-year.
- **KMK Ferienkalender PDF is unreadable via fetch** (binary, no pdftoppm). Use state ministry pages: km.bayern.de/ministerium/termine/ferientermine.html works.
- **Wikipedia climate tables via WebFetch return wrong numbers** (record highs read as mean max). Do not use; tourism-board climate pages or climate aggregators read cleaner.
- **Trap pattern: the famous event whose operator quit.** Schönbrunn's Christmas market operator (MTS Wien) ended after 2023 while guides still list it. Same family as Vancouver's cancelled Celebration of Light. For any guide-consensus anchor event, check the organiser page still exists for this season. See [[timing-source-lessons]].
