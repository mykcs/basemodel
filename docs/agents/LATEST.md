# Latest Agent handoff

Last updated: **2026-08-26**

Status: **Vercel is the ordinary deployment provider. Current work should follow the CSS ownership contract, static-first rendering policy, and the current OpenEvo × WebShop research surfaces on `main`. Reader-facing research claims now also carry a mandatory minimum reasoning bridge in visible prose. Historical release batches and handoffs are evidence, not current workflow.**

## Current architecture

```text
GitHub `mykcs/basemodel` = source of truth
non-main release branch / PR -> Vercel Preview
main                         -> Vercel Production
Production                   -> https://basemodel-preview.vercel.app
```

GitHub Actions and GitHub Pages remain retired for ordinary BaseModel deployment. Cloudflare material remains legacy rollback/provider-specific tooling only. Read `current/hosting-architecture.md` and `current/deployment-policy.md` before release changes.

## Current reader-facing writing invariant

For material research conclusions, comparisons, diagnoses, causal interpretations, validity judgements, and next-experiment decisions, visible prose must carry the first layer of reasoning:

```text
what was observed
-> what that observation supports
-> what it still does not establish
```

A sentence can sound natural and still be incomplete if a lab reader has to open `<details>` or inspect raw evidence to answer “你为什么这样说？”. Exact counts, confidence intervals, run IDs and code may remain in disclosure; the first-layer reason may not.

Definitions, neutral labels, direct instructions, and simple source facts do not need a forced inference chain. The detailed owner is `current/research-editorial-style.md`; every user-facing page still follows `current/human-thinking-web-expression-contract.md`. The SEED × OpenEvo Results specialization lives in `current/seed-openevo-results-reader-contract.md`.

## Current release state

Historical release milestones remain discoverable because tests and later integration work refer to them as evidence, not because they define the current workflow:

- **#144 — semantic release integration** reconciled the earlier multi-branch product/UI/research release ancestry.
- **#147 — final visual closeout** closed the then-current exact-head Chromium visual matrix; that historical combined gate reported **14 passed**.

These historical counts do not prove a later head. Current acceptance must use the current repository Gate and task-relevant browser matrix.

## Current product mission

```text
Base Model
-> SEED / OpenEvo
-> ALFWorld / WebShop
-> trajectories, scores and failures
-> defensible OpenEvo improvements
```

The site is a research decision and explanation system, not a generic model leaderboard. User-visible experiment prose and tests must follow current experiment semantics rather than preserving obsolete titles, counts, or stage assumptions.

## CSS and UI architecture

The global-shell CSS convergence is closed:

- `src/styles/app.css` is the page-wide composition root;
- `src/styles/components/global-shell.css` owns final shared shell/Footer geometry;
- `src/styles/components/header.css` owns final Header/Nav responsive behavior;
- historical patch files are frozen migration debt and should shrink when touched;
- `visual-closeout.css` and `mobile-composition.css` no longer own Header/Nav behavior;
- **do not start a site-wide Tailwind migration without new measured evidence.** The current debt is ownership/cascade debt, not a missing utility framework.

See `current/css-architecture.md`.

## Rendering and performance

The site remains static-first Astro with focused React islands.

- Public/core research content should remain useful before JavaScript where practical.
- Browser-local adjuncts may wait for hydration when there is no truthful static state.
- Use the least eager `client:*` directive that preserves behavior.
- Avoid repeating large serialized catalogs across every route for usually-hidden global adjuncts; prefer existing static data routes or another on-demand boundary.
- D3 and ECharts remain active dependencies and are intentionally lazy-loaded for the Landscape interactive surface.

See `current/rendering-and-performance-policy.md`.

## Ordinary technical-debt review

The 2026-08-21 whole-repository review is closing high-confidence debt without a broad rewrite:

- unreachable root-level Playwright code outside the configured `tests/e2e` directory;
- a stale root handoff with obsolete local worktree/release instructions, archived under `docs/agents/history/`;
- rendering/performance documentation that still described the old host as current;
- duplicated Header/mobile-menu compatibility declarations in `mobile-composition.css` after canonical Header ownership was established;
- global CompareTray serialization of the full model-name catalog into every static page even though browser-local compare state contains at most five model IDs.

The review intentionally does **not** delete `design-refinement.css`, `final-hardening.css`, D3, ECharts, Nanostores, or legacy rollback helpers merely because they are old. Each still has a demonstrated current role. See `history/2026-08-21-ordinary-tech-debt-audit.md` on the accepted cleanup release.

## Browser acceptance

Historical browser passes apply only to the tree they tested. Future UI changes need fresh task-relevant acceptance.

- Vercel-hosted UI gates run Chromium on the supported Vercel environment.
- CSS/theme/layout/browser-semantic changes also need WebKit on a Playwright-supported Ubuntu/Debian/macOS runner.
- Never report a browser as passing unless that browser actually launched and the relevant assertions completed.

## Ordinary workflow

1. read `/AGENTS.md`, this file, and the small core policy set;
2. use `docs/agents/README.md` to select task-specific owners, then scan the scenario registry;
3. inspect overlapping branches/PRs before editing;
4. make the smallest coherent change that closes the actual failure mode;
5. batch edits before the first provider-triggering push when practical;
6. inspect the exact-head Vercel Preview and repository Gate/build logs;
7. run task-relevant browser acceptance;
8. synchronize with current `main` if it moved materially;
9. merge the accepted release once with head/base race protection;
10. verify Production separately and report executed evidence plus remaining boundaries precisely.

A clean merge, READY badge, or historical browser PASS does not prove a changed combined tree is accepted.

## Vercel build budget

Default target:

```text
one coherent branch/PR
-> one atomic multi-file push
-> one initial exact-head Preview
-> at most one corrective Preview
-> one Production build per accepted release batch
```

When using GitHub APIs, prefer one Git data API commit (`blob/tree/commit/ref`) over sequential Contents API writes. `vercel.json` and the repository build classifier are executable truth for current trigger behavior.

## Vercel-first reporting

Ordinary completion reports lead with repository Gate/build, Vercel deployment trigger/status counts when available, exact-head Preview acceptance, merge SHA, and Production verification.

Do not add Cloudflare or another legacy provider to an ordinary report merely because historical fallback material exists.

## Legacy hosting note — conditional only

Cloudflare Pages and Workers helpers are legacy rollback/provider-specific surfaces. Treat them **not as a normal deployment step or completion-report line** unless the task explicitly concerns rollback, retirement, or live legacy-provider behavior.

## Reading-order authority

Do not maintain another numbered Agent reading list in this handoff. `/AGENTS.md` owns the fast start; `docs/agents/README.md` owns the task router; the scenario registry owns just-in-time triggers. This file owns **current state and recent cross-cutting changes only**.

History is evidence, not current policy. Do not restore an obsolete provider, product hierarchy, visual result, test count, or machine snapshot from an older handoff.
