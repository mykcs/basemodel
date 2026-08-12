# Latest Agent handoff

Last updated: **2026-08-12**

Status: **The accepted release batch integrates open PRs #64, #69, #116, #119, #121, #125, #128 and #129 on one semantically resolved release head. Vercel remains the only ordinary deployment provider; PRs use Vercel Preview and `main` uses Vercel Production.**

## Integrated release intent

The release combines:

- the OpenEvo × WebShop / ALFWorld execution-first reproduction guide;
- the sitewide visual knowledge architecture, theme contrast contract and browser UI safety gate;
- the SEED × OpenEvo mission-first homepage, bilingual research routes and Learn / Run / Compare path;
- the same-day SEED lab runbook, explicitly labeled as an optional 2026-08-11 dedicated-old-Mac scenario rather than current device truth;
- retained research-workbench context and historical product rationale;
- the parallel Agent / stacked-PR integration and one-release-head policy.

Semantic conflict outcomes:

- PR #128 owns the latest research mission and supersedes its older duplicate component versions.
- PR #125 owns the current global visual/theme system. PR #116 remains in release ancestry and attribution, but its competing pre-mission CSS outcome is superseded rather than mechanically appended.
- PR #64 is retained under `docs/agents/history/`; it does not restore stale deployment authority.
- PR #69 retains its context documents, while README links and Production identity use the current Vercel site.
- PR #119 remains usable, with a visible notice directing current machine facts to `/lab/` and the fuhuo-owned single source.
- PR #129 is reapplied onto the latest current deployment policy rather than replacing it with an older branch copy.

The durable integration record is `history/2026-08-12-open-pr-semantic-integration.md`.

## Current architecture authority

```text
GitHub `mykcs/basemodel` = source of truth

non-main branch / PR
  -> Vercel `basemodel-preview`
  -> npm run verify:deploy && npm run build
  -> protected Preview / exact-head review

main
  -> Vercel Production
  -> https://basemodel-preview.vercel.app
```

Read `current/hosting-architecture.md` and `current/deployment-policy.md` before hosting/release changes.

## Current product mission

```text
Base Model
-> SEED / OpenEvo
-> ALFWorld / WebShop
-> trajectories, scores and failures
-> defensible OpenEvo improvements
```

The mission hub and child routes own the first-principles reading path. Generic site orientation remains available on the catalog/decision/evidence surfaces, while mission pages avoid redundant primers.

## Production identity

Current canonical Production target:

`https://basemodel-preview.vercel.app`

Vercel Preview is automatically `noindex` via `VERCEL_ENV=preview`. Production is indexable and must be verified after release. An independent custom domain remains a possible future improvement, but domain purchase requires explicit spending authorization.

## Ordinary workflow

1. read current policy + scan `scenario-trigger-registry.md`;
2. inspect overlapping PRs and decide whether work is independent, stacked, superseded or semantically conflicting;
3. finish one coherent change or explicit release head before the first provider-triggering push;
4. publish the branch as one atomic multi-file push whenever the tool allows it;
5. inspect the exact-head Vercel Preview, repository Gate/build logs and real routes;
6. run the focused/cross-browser UI gate when the changed surface requires it;
7. batch evidence-driven fixes into at most one normal corrective push;
8. synchronize against current `main` only when it moved materially;
9. merge the accepted release to `main` once;
10. verify the Vercel Production deployment separately;
11. report Vercel trigger counts/status, final worker-PR disposition and Production acceptance.

## Vercel build budget

Default target:

```text
one coherent branch or release head
-> one atomic multi-file push
-> one initial exact-head Preview
-> at most one corrective Preview after real inspection
-> one Production build per accepted release batch
```

A build is justified by a meaningful review checkpoint, not by every file write or thought iteration. When using GitHub APIs, prefer a checked-out worktree or one Git data API commit (`blob/tree/commit/ref`) over sequential Contents API writes.

`vercel.json` keeps auto-cancellation enabled for superseded same-branch jobs and delegates ignored-build decisions to `scripts/vercel-ignore-build.mjs`. That script compares the current commit with `VERCEL_GIT_PREVIOUS_SHA`, skips Agent/docs-only changes, and fails open to a real build when it cannot prove that skipping is safe.

## Vercel-first reporting

Ordinary completion reports should lead with:

```text
Repository Gate/build
Vercel deployment triggers: total / READY / ERROR / CANCELED / ignored when known
exact-head Preview acceptance
candidate PR disposition and merge commit
Vercel Production deployment and public verification
```

Do not add Cloudflare or another legacy provider to an ordinary report merely because historical configuration or an old snapshot still exists. Mention legacy hosting only when the task explicitly concerns retirement/rollback, the legacy surface changed, or live evidence shows unexpected activity.

## Legacy hosting note — conditional only

Historical Cloudflare material, snapshots and dormant fallback scripts remain conditional evidence only. A still-connected external integration may keep an existing skip prefix as a silent safeguard, but treat it **not as a normal deployment step or completion-report line**. Load or report legacy hosting only for an explicit rollback/retirement task or when live evidence shows unexpected legacy activity.

## Agent reading order

1. `/AGENTS.md`
2. this file
3. `current/project-agent-operating-principles.md`
4. `current/scenario-trigger-registry.md`
5. `current/product-and-research-integrity.md`
6. `current/human-thinking-web-expression-contract.md`
7. `current/audience-centered-technical-copy.md` and `current/audience-copy-audit-2026-08-12.md` for any user-visible copy, onboarding, status, or bilingual change
8. task-relevant mission/UI/data policies
9. `current/hosting-architecture.md`
10. `current/deployment-policy.md`
11. `current/repository-map.md`
12. executable source/config/tests

History is evidence, not current policy. Older material must not restore a retired provider, obsolete product hierarchy or superseded visual outcome.
