# Latest Agent handoff

Last updated: **2026-08-12 16:44 +08:00**

Status: **Production ownership is migrating to Vercel. The intended steady state is Vercel Preview + Vercel Production. Cloudflare Pages is a frozen legacy rollback snapshot and should consume zero normal Git builds.**

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

The 2026-08-11 audit correctly concluded that provider count alone does not reduce build count. The owner has now made the stronger requirement explicit: **stop spending Cloudflare Pages Builds and let Vercel own both build environments.** That new requirement reopens and supersedes the prior steady-state choice.

The application stack is unchanged: Astro + React + GitHub remain. This is deployment ownership consolidation, not a Next.js/framework migration.

## Production identity

Current Vercel canonical target:

`https://basemodel-preview.vercel.app`

The code treats stale `PUBLIC_SITE_URL=https://basemodel.pages.dev` as legacy and falls back to the Vercel Production identity. Vercel Preview is automatically `noindex` via `VERCEL_ENV=preview`; Production is expected to be indexable and must be verified after release.

An independent custom domain remains a recommended future product-identity improvement, but domain purchase is not required for this cutover and must not be performed without explicit spending authorization.

## Cloudflare boundary

**Cloudflare Pages Build = 0** for normal work. Until the external Pages Git integration can be disabled, branch and merge commits should keep the `[CF-Pages-Skip]` convention. The existing `basemodel.pages.dev` deployment remains available as a frozen rollback/legacy snapshot; do not update it just to keep it synchronized.

Direct Upload and `basemodel-workers-shadow` remain dormant Cloudflare-specific diagnostics, not release paths.

## Ordinary workflow

1. read current policy + scan `scenario-trigger-registry.md`;
2. inspect overlapping PRs;
3. focused branch/PR;
4. exact-head Vercel Preview + repository Gate/build;
5. inspect real routes/metadata;
6. sync against current `main` if it moved materially;
7. merge with `[CF-Pages-Skip]` while legacy Pages integration exists;
8. verify the Vercel Production deployment separately;
9. report Cloudflare as unchanged rollback unless authoritative provider evidence says otherwise.

## Open work safety

Do not mix hosting migration with unrelated product PRs. At this handoff, #121 and #119 are separate product work; #116 is an older divergent UI branch. Re-check live PR state before acting.

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

History is evidence, not current policy. If older material says Cloudflare Pages is Production, this handoff plus the current hosting/deployment files wins after the Vercel cutover commit.

## External boundary still requiring provider access

The connected session can change GitHub and Vercel, but currently has no Cloudflare account write connector. Therefore disabling Pages Git automatic deployments or adding an old-host redirect is an external Cloudflare-account action. Do not spend a Pages Build as a workaround. The repository protects zero-build behavior with skip commits until that provider-side switch is available.
