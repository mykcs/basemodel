# Latest Agent handoff

Last updated: **2026-08-12**

Status: **Vercel is the only ordinary deployment provider for this repository. PRs use Vercel Preview; `main` uses Vercel Production. Vercel deployments/builds are budgeted, so batch coherent work and avoid push loops.**

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

## Production identity

Current canonical Production target:

`https://basemodel-preview.vercel.app`

Vercel Preview is automatically `noindex` via `VERCEL_ENV=preview`. Production is indexable and must be verified after release. An independent custom domain remains a possible future improvement, but domain purchase requires explicit spending authorization.

## Ordinary workflow

1. read current policy + scan `scenario-trigger-registry.md`;
2. inspect overlapping PRs and decide whether work is independent, stacked, or already superseded;
3. finish one coherent change and run the strongest available local/Agent validation before the first provider-triggering push;
4. publish the branch as one atomic multi-file push whenever the tool allows it;
5. inspect the exact-head Vercel Preview, repository Gate/build logs and real routes;
6. batch evidence-driven fixes into at most one normal corrective push rather than pushing every small edit;
7. synchronize against current `main` only when it moved materially;
8. merge the accepted release to `main`;
9. verify the Vercel Production deployment separately;
10. report Vercel trigger counts/status and Production acceptance.

## Vercel build budget

Default target:

```text
one coherent branch/PR
-> one atomic multi-file push
-> one initial exact-head Preview
-> at most one corrective Preview after real inspection
-> one Production build per accepted release batch
```

A build is justified by a meaningful review checkpoint, not by every file write or thought iteration. When using GitHub APIs, prefer a checked-out worktree or one Git data API commit (`blob/tree/commit/ref`) over sequential Contents API writes, because each ref update can create another Vercel deployment.

`vercel.json` keeps auto-cancellation enabled for superseded same-branch jobs and delegates ignored-build decisions to `scripts/vercel-ignore-build.mjs`. That script compares the current commit with `VERCEL_GIT_PREVIOUS_SHA`, skips Agent/docs-only changes, and fails open to a real build when it cannot prove that skipping is safe.

If several accepted PRs are intended for the same release window, consider one explicit integration/release head and one Production merge when authorship, review, rollback and ownership remain clear. Do not combine unrelated unfinished work merely to save a build.

## Vercel-first reporting

Ordinary completion reports should lead with:

```text
Repository Gate/build
Vercel deployment triggers: total / READY / ERROR / CANCELED / ignored when known
exact-head Preview acceptance
merge commit
Vercel Production deployment and public verification
```

Do not add Cloudflare or another legacy provider to an ordinary report merely because historical configuration or an old snapshot still exists. Mention legacy hosting only when the task explicitly concerns retirement/rollback, the legacy surface changed, or live evidence shows unexpected activity.

## Legacy hosting note — conditional only

Historical Cloudflare material and dormant fallback scripts are not part of the normal workflow. A still-connected external Git integration may require an existing skip prefix until it is disabled account-side. Treat that as a silent compatibility safeguard, not as a normal deployment step or completion-report line.

## Open work safety

Do not mix deployment-policy changes with unrelated product PRs. Re-check live PR state before acting; older PR numbers in historical notes are not current authority.

## Agent reading order

1. `/AGENTS.md`
2. this file
3. `current/project-agent-operating-principles.md`
4. `current/scenario-trigger-registry.md`
5. `current/hosting-architecture.md`
6. `current/deployment-policy.md`
7. task-relevant product/research docs
8. `current/repository-map.md`
9. executable source/config/tests

History is evidence, not current policy. If older material describes Cloudflare as an active Preview or Production provider, this handoff plus current Vercel config and deployment policy wins.
