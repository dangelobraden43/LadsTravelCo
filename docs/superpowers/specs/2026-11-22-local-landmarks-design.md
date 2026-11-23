# /local landmarks: airports as gateways, venues as the richest point, model cities on fly-in

Approved by Brady in chat, Nov 22 2026 ("Model city" direction; "yes go ahead and build").

## Intent

The rebuilt `/local` is research-forward and honest; it is not yet enticing. Three additions make the
map worth lingering on, and each one carries information rather than decoration:

1. **Venues (stadiums, arenas, theatres, clubs) are the richest point on the map.** The marker says how
   much is on before the tap; the card opens on the next event with a link to each organiser page.
2. **Airports are gateways.** The marker carries the code. The card shows researched fare ranges from
   that airport to six destinations (Dublin, Rome, Barcelona, Prague, Munich, Sydney), each with the day it
   was checked, and ends in "Plan this trip" into the intake. Regional airports point at the nearest
   gateway's fares (O'Hare, Detroit, Minneapolis, Grand Rapids).
3. **A model city rises when you fly into a hub.** Every block is a real building footprint from
   OpenStreetMap extruded to its recorded height or storey count; stadiums and arenas from their own
   footprints; airports show their real runways with a plane on approach. The models are enlarged many
   times, like a souvenir model, so they read on the relief; the page says so.

## Goals, non-goals, anti-goals

- Goals: enticing fly-in; the most useful information at venues and airports; fast on phones; every
  shape generated from data at build time.
- Non-goals: live fares, ticketing, a full 3D city at street scale, trails or roads.
- Anti-goals (would make it a failure even if it works): an invented skyline; a printed point price; a
  fare that reads as a quote; a page that renders black on a founder's GPU; a build that needs a hand-drawn
  asset per city.

## Constraints

- No price on the page but a sourced historical range with a check date (research contract).
- Coordinates and identity by ID: airports by Wikidata entity confirmed on its IATA property; building
  and venue footprints from OpenStreetMap by `wikidata` tag or by position around a data-derived hub centre.
- OpenStreetMap data carries its ODbL credit on the page.
- Verified in the real Chrome on this machine at 1440 and 390, not only headless (the Nov 17 lesson).

## How it gets made

- `tools/build-local-landmarks.mjs`: airports from Wikidata (P238 IATA, P625, P3872 passengers), hub centres
  as the densest member cluster, buildings/venues/runways from Overpass, simplified and written to
  `public/local/build/<hub>.json` (lazy-loaded on fly-in) and `src/data/localLandmarks.js`.
- `src/LocalMap.jsx`: `CityBuild` (merged extruded geometry, rises on fly-in, fades on leave), `Runways`
  with a looping plane, venue bowls; airports as a layer with their own mark.
- `src/LocalPage.jsx`: airport card (fares from `src/data/localFares.js`, generated from the
  `midwest-fares` research run after verification), venue card leads with the next event.
- Scale: footprints ×8, heights ×25 in model space, stated under "How this page is built".

## Left to the builder

Default building height where OSM has none (12 m, stated), simplification tolerance, the plane's path,
the fade timings, and how many buildings a phone keeps.
