Read CLAUDE.md completely — in particular `THE VISION AND THE TIMELINE` (the plan
everything serves) and `THE NEW FRAMEWORK AGENDA` (the current build slate).

Do NOT read internal/brady/3-WEEK-SPRINT.md. It was an April 11 – May 3, 2026
document, it went stale for four months, and it was archived on September 1, 2026
to internal/brady/archive/. The plan now lives in CLAUDE.md.

Verify state rather than trusting the file's own record — a session record can be
written before the session's last commit:
- `git status --short` and `git log -3`. Report ANY uncommitted work explicitly.
- Confirm `main` == `origin/main`. A session is not over until origin/main has it.
- If a canonical count matters, re-derive it by importing src/data/*.js. Never
  quote a number off the page.

Output, 10 lines max:
1. Where we are against the timeline — which month's milestone, what shipped last
2. Today's single most important task, tied to the fall sequence
   (/local ships now → Peru sets the bar → enrichment scales the count)
3. Bundle: target under 8 MB vs actual dist size
4. Live blockers, and who owns each

Then ask: "Ready to start?"
