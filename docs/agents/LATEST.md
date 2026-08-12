# Latest Agent handoff

Last updated: **2026-08-12**

Status: **Production is owned by Vercel Preview + Vercel Production. Cloudflare Pages is a frozen legacy rollback snapshot and should consume zero normal Git builds. Vercel builds are also budgeted: batch coherent work and avoid push loops.**

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

Cloudflare Pages
  -> legacy snapshot / rollback only
  -> no ordinary Preview or Production Build
```

Read `current/hosting-architecture.md` and `current/deployment-policy.md` before hosting/release changes.

## Why the prior Pages decision changed

The 2026-08-11 audit correctly concluded that provider count alone does not reduce build count. The owner then made the stronger requirement explicit: **stop spending Cloudflare Pages Builds and let Vercel own both build environments.** That requirement superseded the prior steady-state choice.

The application stack is unchanged: Astro + React + GitHub remain. This is deployment ownership consolidation, not a Next.js/framework migration.

## Production identity

Current Vercel canonical target:

`https://basemodel-preview.vercel.app`

The code treats stale `PUBLIC_SITE_URL=https://basemodel.pages.dev` as legacy and falls back to the Vercel Production identity. Vercel Preview is automatically `noindex` via `VERCEL_ENV=preview`; Production is indexable and must be verified after release.

An independent custom domain remains a recommended future product-identity improvement, but domain purchase is not required and must not be performed without explicit spending authorization.

## Cloudflare boundary

**Cloudflare Pages Build = 0** for normal work. Until the external Pages Git integration can be disabled, branch and merge commits should keep the `[CF-Pages-Skip]` convention. The existing `basemodel.pages.dev` deployment remains available as a frozen rollback/legacy snapshot; do not update it just to keep it synchronized.

Direct Upload and `basemodel-workers-shadow` remain dormant Cloudflare-specific diagnostics, not release paths.

## Ordinary workflow

1. read current policy + scan `scenario-trigger-registry.md`;
2. inspect overlapping PRs and decide whether work is independent, stacked, or already superseded;
3. finish one coherent change and run the strongest available local/Agent validation before the first provider-triggering push;
4. publish the branch as one atomic multi-file push whenever the tool allows it;
5. inspect the exact-head Vercel Preview + repository Gate/build;
6. batch any evidence-driven fixes into one corrective push rather than pushing every small edit;
7. sync against current `main` only when it moved materially;
8. merge with `[CF-Pages-Skip]` while legacy Pages integration exists;
9. verify the Vercel Production deployment separately;
10. report Cloudflare as unchanged rollback unless authoritative provider evidence says otherwise.

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

## Open work safety

Do not mix deployment-policy changes with unrelated product PRs. At this handoff, #121, #125 and #119 are separate product work; #116 is an older divergent UI branch. Re-check live PR state before acting.

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

History is evidence, not current policy. If older material says Cloudflare Pages is Production, this handoff plus the current hosting/deployment files wins.

## External boundary still requiring provider access

The connected session can change GitHub and Vercel, but currently has no Cloudflare account write connector. Therefore disabling Pages Git automatic deployments or adding an old-host redirect is an external Cloudflare-account action. Do not spend a Pages Build as a workaround. The repository protects zero-build behavior with skip commits until that provider-side switch is available.
