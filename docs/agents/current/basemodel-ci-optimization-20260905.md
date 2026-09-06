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

At the time of PR #433, heavy self-hosted CI did not run for Draft pull requests and `ready_for_review` triggered the merge-ready blocking acceptance. This is historical optimization evidence; current CI provider/trigger authority is owned by `deployment-policy.md` and `hosting-architecture.md`.

## Focused browser benchmark

A temporary GitHub-hosted Ubuntu 24.04 benchmark was run on Draft PR #433 so it did not compete with the busy Mac runner. The temporary workflow is not part of the proposed final architecture.

Successful run `33897594449` / job `101103791595`:

- cold hosted job wall time: **66 s**
- `npm ci`: **13 s**
- 474-page production build: **10 s**
- cold Chromium + Linux browser dependency install: **25 s**
- focused server browser gate: **9 s**
- focused matrix: 2 exact server routes × mobile/desktop × light/dark = **8/8 PASS**

The first benchmark run (`33897274555`) exposed an ambiguity in the generic changed-route smoke: the server page legitimately contains the canonical layout `#main-content` plus an internal server-overview `<main>`, so `locator('main')` violated Playwright strict mode. The harness was corrected to target the existing canonical `#main-content`, already used by the site skip link, page outline, header regression tests, and other e2e tests. No website content or CSS changed.

This **does not mean the complete blocking CI is 66 seconds**: the benchmark intentionally isolated build + focused browser work and did not duplicate the full deterministic `verify:deploy` suite. Using the observed median pre-browser baseline (~4.6 min), a route-owned server change should target roughly **5–7 min blocking wall time** instead of the historical ~23–26 min full jobs. That projection must be confirmed on a normal merge-ready change after adoption.

The two one-off hosted benchmark attempts consumed only about **2.2 GitHub-hosted runner minutes total** and are not retained as recurring workflows.

## 2026-09-06 successor-experiment boundary

A later experiment evaluated replacing the retained static exact-test timing receipt with CircleCI historical test timing. The candidate was correct and fail-safe, but its ordinary-full steady-state benchmark did **not** show a clear repeatable end-to-end improvement above hosted-runner variance. PR #473 was merged before its own performance acceptance rule completed and was subsequently reverted by PR #481 after post-merge validation.

Current meaning of this baseline:

- the proven static exact-test scheduler remains the current BaseModel authority;
- the 2026-09-06 adaptive implementation is historical experimental evidence, not a dormant successor to restore;
- future timing-scheduler changes must use the causal benchmark protocol in `website-engineering-standard.md` §6.2 and the exact acceptance/merge boundary in `release-closeout-protocol.md`;
- historical PR numbers, SHAs and timing samples belong to the dated retrospective, not to future current-state assumptions.

Detailed case: [`../history/2026-09-06-circleci-benchmark-causality-and-multi-agent-closeout-retrospective.md`](../history/2026-09-06-circleci-benchmark-causality-and-multi-agent-closeout-retrospective.md).
