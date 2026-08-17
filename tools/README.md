# tools/ — Midwest map geometry pipeline

`src/midwestGeo.js` is **generated**, not hand-written. These scripts are what
generate it. They were living in an ephemeral scratchpad, which meant the
"regenerate with the tracer" note in the generated file pointed at nothing —
committed here so the geometry is actually reproducible.

## Running

```
cd tools
# 1. fetch the six state boundary files (once)
for s in minnesota wisconsin michigan illinois indiana ohio; do
  curl -sL -o $s.json \
    https://raw.githubusercontent.com/glynnbird/usstatesgeojson/master/$s.geojson
done

node trace-midwest.mjs      # trace + simplify + project -> midwest-out.json
node emit-midwest-geo.mjs   # -> ../src/midwestGeo.js  (also runs trace-routes)
```

`trace-routes.mjs` turns the road-trip waypoints (declared as real lat/lngs
inside it) into smoothed Catmull-Rom paths through the same transform. It is
invoked by the emitter; you rarely run it alone.

## The rule that keeps everything aligned

**One projection, applied to everything.** The six US states define the bounds;
cities, campuses, airports and route waypoints are all real lat/lngs pushed
through that same equirectangular transform. Nothing is hand-placed. Change the
projection and every layer re-fits together.

Current constants (see the header of the generated file):

```
viewBox  0 0 1000 1017
lat0     43.177  (cos 0.7292)
scale    78.076 px/deg
bounds   lon -97.239..-80.519, lat 36.970..49.384
```

After regenerating, sanity-check that nothing drifted:

```
detroit 832.1,574.7 · chicago 571.1,610.1 · gvsu 670.2,525.3 · minneapolis 250.3,368
```

## Clipping (`CLIPPED`) — and why Ontario is currently off

`trace-midwest.mjs` supports adding regions that extend past the canvas by
clipping them to the bounds first (Sutherland–Hodgman, in lon/lat space,
**after** the bounds are fixed — so added regions can never move the
projection). This exists for the Bruce Peninsula / Ontario work.

**Ontario is disabled.** The clipping itself works, and the Bruce already falls
inside the current canvas with no projection change needed (Tobermory lands at
x 910.8, y 346.5). The blocker is the data source:

> The only Ontario boundary to hand is a **political** polygon, and Ontario's
> political boundary runs through the middle of the Great Lakes — it includes
> the Canadian halves of Superior and Huron. Rendered as land it paints over
> the lakes and swallows Georgian Bay.

The US state file does not have this problem because it is **coastline-based**
(which is why Michigan traces as two rings, LP + UP).

**To enable Ontario:** find a land/coastline polygon source (Natural Earth land
polygons, or a lakes file to subtract), drop it in as a `CLIPPED` entry, and
re-run. Everything else is already in place.
