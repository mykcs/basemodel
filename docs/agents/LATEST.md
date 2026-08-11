# Latest Agent handoff

Last updated: **2026-08-11 15:27 +08:00**

Status: **Vercel Preview + Cloudflare Pages Production is the reaffirmed steady-state architecture after a fresh provider/workflow audit. The previously prepared Cloudflare Workers Static Assets path remains validated as a non-production option, but Production cutover is paused and no longer the default target.**

This is the stable first-stop handoff for future coding Agents.

## Current architecture

```text
GitHub `mykcs/basemodel` = source of truth

non-main branch / PR
  -> Vercel `basemodel-preview`
  -> npm run verify:deploy
  -> npm run build
  -> protected *.vercel.app Preview

main
  -> Vercel Git deployment disabled
  -> Cloudflare Pages Production
  -> https://basemodel.pages.dev
```

**Read `docs/agents/current/hosting-architecture.md` before any hosting/deployment change.** It is the current architecture authority.

## 2026-08-11 architecture re-audit

The project explicitly re-checked whether Cloudflare should be removed now that Vercel already consumes ordinary Preview builds.

Conclusion:

- **do not remove Cloudflare from Production now;**
- **do not continue Pages -> Workers cutover by default;**
- keep Vercel as the only ordinary Preview provider;
- keep Cloudflare Pages as the stable Production host;
- freeze the validated Workers shadow as an optional future path;
- revisit provider consolidation only when real product/domain/quota requirements change.

The key lesson is:

```text
fewer providers
!= fewer hosted builds
```

The original pain was Cloudflare Pages build quota being consumed by branch Preview iteration. That pain is already contained because normal PR Preview now runs on Vercel. Moving Production to Vercel would reduce provider count, but a normal PR -> Production workflow still has separate Preview and Production deployments and would concentrate both responsibilities into one quota pool.

`https://basemodel.pages.dev` is also the current canonical product identity. Leaving Pages is therefore a hostname/canonical/hreflang/robots/sitemap migration unless the project first adopts an independent custom domain.

See `docs/agents/history/2026-08-11-hosting-architecture-audit.md` for the detailed reasoning.

## Workers Static Assets status

PR #105 already proved that a pure-static Workers Static Assets shadow can serve the generated Astro `dist/` with the required product semantics.

That work is retained as migration evidence, not as an instruction to cut over:

- `wrangler.jsonc` defines the separate `basemodel-workers-shadow` service;
- `npm run build:workers:shadow` preserves current Production identity and disables indexing;
- route, asset, redirect, custom 404, canonical/hreflang, robots/sitemap, security-header and representative browser behavior were previously validated;
- known provider differences were documented rather than hidden.

**Do not continue Workers Production migration unless a current trigger justifies reopening the decision.** Typical triggers: independent custom domain adoption, a demonstrated Pages limitation, or a real need for Workers/KV/D1/R2/Durable Objects/server-side capabilities.

## Ordinary website workflow

1. Read this file, `current/hosting-architecture.md`, `current/scenario-trigger-registry.md`, and task-relevant current policy.
2. Inspect overlapping PRs before editing.
3. Work on one focused branch / PR.
4. Use the Cloudflare skip-build convention for intermediate/non-release synchronization where appropriate.
5. Let Vercel create the non-main Preview.
6. Verify the exact PR head received the expected Vercel Gate/build.
7. Inspect the real Preview route(s); READY alone is not product acceptance.
8. Generate a temporary Vercel share URL when the owner needs anonymous access to a protected Preview.
9. Before final acceptance, compare the branch against current `main` and revalidate a new exact head if the base moved materially.
10. After owner acceptance, merge/release to `main` with a normal non-skip release commit when Cloudflare Production is intended to update.
11. Verify Cloudflare Pages Production separately.

## Vercel Preview contract

Project:

- team: `wangrui92-team`
- project: `basemodel-preview`
- project ID: `prj_UQRbjvnik0lW21LrzotTLPhKkgAK`

`vercel.json` is authoritative for Vercel behavior:

- `buildCommand`: `npm run verify:deploy && npm run build`;
- docs-only / Agent-only changes can be ignored through `ignoreCommand` unless runtime-owned paths changed;
- `git.deploymentEnabled.main = false` keeps Vercel Preview-only.

Preview identity must preserve:

- `PUBLIC_SEARCH_INDEXING=disabled`;
- `PUBLIC_SITE_URL=https://basemodel.pages.dev` while Pages remains Production;
- `noindex` on Preview;
- canonical / hreflang identity pointing to current Production.

## Production / Cloudflare boundary

Cloudflare Pages remains the canonical Production host at:

```text
https://basemodel.pages.dev
```

Cloudflare Direct Upload remains a fallback / Cloudflare-specific integration Preview tool, not the ordinary Preview path.

Do not intentionally trigger a Cloudflare Pages Git Preview merely to obtain a branch review URL while Vercel is available.

Do not claim an exact account-level Cloudflare build counter without authoritative provider evidence.

A Production release expected to deploy on Pages must not accidentally use `[CF-Pages-Skip]`, `[Skip CI]`, or another Cloudflare skip prefix.

## Build-once boundary

If the future requirement becomes literally “build one hosted artifact, inspect it, then promote that exact artifact to Production without rebuilding,” treat that as a dedicated deployment-workflow design problem.

Do not assume that deleting Cloudflare automatically produces a one-build workflow. Re-check current first-party provider promotion/staging semantics before changing architecture.

## Current deployment Gate

`npm run verify:deploy` includes deterministic repository-local checks. Vercel Previews run this Gate before `npm run build`. Cloudflare Pages formal builds retain the repository-owned Gate through `npm run build:cloudflare` while Pages remains Production.

Do not weaken a valid Gate merely to obtain a green hosted deployment.

Full Playwright browser suites and third-party network/vendor audits remain on-demand unless deliberately promoted into the blocking Gate.

## Product / research integrity

Read `current/product-and-research-integrity.md` before broad UI/data/recommendation work and `current/model-catalog-verification-policy.md` before current/latest model-family audits.

Durable invariants include:

- this is a research decision system, not merely a leaderboard;
- strict reproduction, method reproduction, and modern rerun are separate modes;
- unknown must remain unknown rather than guessed;
- open weights != open source / unrestricted licensing;
- hardware catalog tiers, heuristic estimates, and measured hardware results are separate evidence levels;
- “done” means wired into the real user path and protected by acceptance checks.

The SEED worked-example product flow remains documented in `current/seed-guided-research-workflow.md`.

## Agent reading order

1. `/AGENTS.md`
2. `docs/agents/LATEST.md`
3. `docs/agents/current/project-agent-operating-principles.md`
4. `docs/agents/current/scenario-trigger-registry.md`
5. `docs/agents/current/hosting-architecture.md`
6. `docs/agents/current/vercel-preview-migration-plan.md`
7. `docs/agents/current/product-and-research-integrity.md`
8. `docs/agents/current/model-catalog-verification-policy.md`
9. `docs/agents/current/seed-guided-research-workflow.md`
10. `docs/agents/current/deployment-policy.md`
11. `docs/agents/current/repository-map.md`
12. `package.json`, `vercel.json`, `wrangler.jsonc` when task-relevant, and task-specific source/tests

If older text says Workers Static Assets is the default next Production target, this handoff plus `current/hosting-architecture.md` wins: **Workers is now a validated frozen option, not the default migration path.**

## External boundaries

Do not falsely mark these complete without real services/evidence:

- a future Pages-to-Workers or Pages-to-Vercel Production cutover until the real public route changes and is verified;
- account-backed cross-device storage;
- team/realtime collaboration;
- server-side notifications/personalized APIs;
- unreported paper hardware measurements or author intent;
- exact provider quota counters when authoritative account evidence is unavailable.

Historical migration/incident/audit records live under `docs/agents/history/` and are evidence, not current operating policy.
