---
name: feedback-two-source-honesty
description: How to handle the researched-mode two-host rule for park trails without gaming the validator
metadata:
  type: feedback
---

The validator counts distinct hostnames, so `www.nps.gov` and `home.nps.gov` would pass as
"independent". Never use that. Two NPS pages are one source.

**Why:** the contract's intent is independent corroboration; manufacturing it defeats the
trust layer the whole product sells.

**How to apply:** a trail with only NPS sourcing ships as `kind: "fact"` with a note that it
needs a second host before it can be a `route`. Use `route` only when a different website
(visitors bureau, outdoors press, aggregator snippet) corroborates it, and say in notes what
the second source actually confirms (existence vs exact mileage). Record the park's own
difficulty rating when an aggregator disagrees. Never put an inference ("white pine on top",
"best seen from the water") in a claim unless a page read that run says it.

See [[reference-nps-sources]].
