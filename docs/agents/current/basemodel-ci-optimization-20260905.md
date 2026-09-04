# Basemodel CI optimization baseline — 2026-09-05

This receipt records the empirical baseline and the first semantics-preserving browser-gate optimization.

## Observed baseline

From 10 recent successful full `Self-hosted CI` jobs sampled on 2026-09-04 (UTC+8):

- median active full-CI wall time: **25.1 min**
- median `Risk-based browser acceptance`: **19.8 min**
- median pre-browser work (`npm ci` + deterministic verification + build and setup): **4.6 min**
- browser acceptance therefore dominates the blocking wall time.

These are execution timestamps, not provider billing minutes.

## Historical replay

| Historical PR | Exact head | Old active CI | Old browser | New planner | Reason |
| --- | --- | ---: | ---: | --- | --- |
| #430 | `605cd57265e552485b553c95139a63e6e56b4d92` | ~26.0 min | ~21.1 min | `focused` | `Lyg2171ServerOverview.astro` owns only the zh/en server routes |
| #426 | `16f9ea622c16561f9142b79e09b5a0d8a8f35a45` | ~22.9 min | ~15.5 min | `focused` | same bounded owner plus concrete server pages and non-UI governance/docs files |

The replay inputs are encoded in `src/lib/vercelHostedUiGate.test.ts`, so future planner changes must preserve or explicitly amend this decision.

## Safety boundary

- Explicit route ownership can reduce `shared`/`global` directory-level classification to `focused` only when every UI-affecting owner in the diff is bounded.
- Concrete Astro pages may add their exact routes to the focused set.
- Files already classified as UI risk `none` do not enlarge browser blast radius.
- An unrelated/unknown shared component mixed into the same diff immediately fails closed to `full`.
- CI/browser-gate source, runner configuration, global styles/tokens, package/config changes and other unbounded owners remain `full`.

## Draft policy

Heavy self-hosted CI does not run for Draft pull requests. `ready_for_review` remains an explicit trigger, so the merge-ready exact head still receives the existing blocking acceptance.

## Next measurement

When the existing basemodel runner is idle, benchmark the exact focused server route gate (2 routes × mobile/desktop × light/dark) on the same runner. Record wall time here before changing the required CI provider or retiring the Mac runner.
