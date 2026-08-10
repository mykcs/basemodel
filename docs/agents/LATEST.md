# Latest Agent handoff

Last updated: **2026-08-11 02:35 +08:00**

Status: **Vercel Preview is the validated ordinary Preview path. Cloudflare Pages is still the real Production host today. The approved target is Cloudflare Workers Static Assets; the repository, Vercel, and real Workers shadow phases are complete. Production has not cut over.**

This is the stable first-stop handoff for future coding Agents.

## Current vs target architecture

```text
CURRENT
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

TARGET AFTER SHADOW ACCEPTANCE
GitHub
├─ non-main branch / PR -> Vercel Preview
└─ main                 -> Cloudflare Workers Static Assets Production
```

**Read `docs/agents/current/hosting-architecture.md` before any hosting/deployment change.** It is the current migration authority and explicitly separates current Production from the target architecture.

## Workers migration: exact current progress

Completed:

- PR #105 added the Workers Static Assets shadow contract and was squash-merged to `main` as `3bb916d5754b352e59687b0ec6085179a85e674e`;
- `wrangler.jsonc` now defines a distinct pure-static service named `basemodel-workers-shadow` using `./dist`, `404-page`, and `auto-trailing-slash`;
- `npm run build:workers:shadow` preserves `https://basemodel.pages.dev` as canonical Production identity and forces shadow indexing off;
- the exact PR head `5eb372491e3cd6ec7f974c1817883818cc632ea3` passed the full Vercel Gate and a 392-page Astro build;
- Vercel deployment `dpl_3tA1HQrdUrVWZbwoc6rEEH4eGVAg` is READY; the real Preview returned HTTP 200 with `robots noindex`, `x-robots-tag: noindex`, and canonical/hreflang pointing to current Pages Production;
- migration branch and merge commits used `[CF-Pages-Skip]`; the merge commit showed no Cloudflare Pages status/check.
- the application artifact based on `origin/main` commit `4f9c55124bbbd6f1c9c188d3acc4f9dce497e56a`, plus the task-owned shadow-header contract, passed the full Gate and a 392-page shadow build;
- `basemodel-workers-shadow` is live at `https://basemodel-workers-shadow.mykcs01.workers.dev`; latest verified version: `df40fca7-46d7-4140-9b12-7b2a8bdba28b`;
- route, asset, redirect, custom 404, canonical, hreflang, robots/sitemap, security-header, workspace query-state, compare query-state, and SEED-to-workspace browser checks passed;
- the shadow keeps `robots noindex`, omits the Production sitemap advertisement, and emits an empty sitemap while canonical/hreflang remain on `https://basemodel.pages.dev`;
- the browser pass reported zero console errors, page errors, or failed requests.

Known non-blocking provider differences:

- Workers uses HTTP 307 rather than Pages HTTP 308 for automatic trailing-slash redirects;
- Workers returns `public, max-age=0, must-revalidate` rather than Pages `no-store` for custom 404 responses;
- Workers MIME formatting differs (`text/html` without an explicit charset and `text/javascript` for JavaScript), but real Chrome hydration and representative product flows passed;
- the live workers.dev response does not add `X-Robots-Tag`; shadow indexing remains disabled by the verified HTML meta tag plus the empty sitemap/no sitemap advertisement;
- Production remains Pages and Pages remains rollback infrastructure; cutover still requires explicit owner release intent.

GitHub Actions and GitHub Pages remain intentionally retired for this repository.

## Ordinary website workflow

1. Read this file, `current/hosting-architecture.md`, and the task-relevant files under `docs/agents/current/`.
2. Inspect overlapping PRs before editing.
3. Work on one focused branch / PR.
4. For ordinary branch synchronization, use `[CF-Pages-Skip]` where appropriate so Cloudflare Pages does not intentionally spend a Git Preview build.
5. Let Vercel create the non-main Preview.
6. Verify that the exact PR head received `Vercel = success` and that Vercel actually ran `npm run verify:deploy` before `npm run build`.
7. Inspect the real Preview route(s). Do not equate a source diff or READY badge with product acceptance.
8. Because the repository is private, generate a temporary Vercel share URL when the owner needs anonymous access. Share links expire; regenerate them rather than storing them as permanent URLs.
9. Iterate until the exact head passes.
10. During the Workers migration, do **not** infer that merging a configuration PR authorizes Production cutover. Shadow deploy, compare, record rollback, then obtain explicit release intent before changing Production routing/hosting.

## Workers Static Assets migration boundary

The application framework is not being replaced. Astro/React/GitHub stay in place; this is a Production-host migration.

Migration sequence:

```text
repository contract                  [DONE]
-> exact-head Vercel validation      [DONE]
-> non-production Workers shadow     [DONE]
-> route / SEO / asset / header comparison [DONE WITH DOCUMENTED PROVIDER DIFFERENCES]
-> rollback plan
-> explicit owner cutover decision
-> Production verification
-> only then retire Pages when safe
```

Until that sequence completes:

- `https://basemodel.pages.dev` remains the Production/canonical identity;
- Workers shadow URLs are test surfaces only;
- Pages remains rollback infrastructure;
- a working Workers shadow deployment is not evidence that Production changed.

## Vercel Preview contract

Project:

- team: `wangrui92-team`
- project: `basemodel-preview`
- project ID: `prj_UQRbjvnik0lW21LrzotTLPhKkgAK`

`vercel.json` is authoritative for Vercel behavior:

- `buildCommand`: `npm run verify:deploy && npm run build`;
- docs-only / Agent-only changes are ignored through `ignoreCommand` unless runtime-owned paths changed;
- `git.deploymentEnabled.main = false` keeps Vercel Preview-only.

Preview identity must preserve:

- `PUBLIC_SEARCH_INDEXING=disabled`;
- `PUBLIC_SITE_URL=https://basemodel.pages.dev` while Pages remains Production;
- `noindex` on Preview;
- canonical / hreflang identity pointing to the current Production identity.

## First validated Vercel pilot

Pilot: **PR #99 — SEED / 4×RTX 3090 student reproduction Guide**

Final tested head:

`674f60bb57b37cd712cc745bf8dcf1ce513b722f`

Final Vercel deployment:

- deployment ID: `dpl_E3NeYkTLnsgUJyfNVUtomUqpmMuJ`;
- exact URL: `https://basemodel-preview-be5vofsnz-wangrui92-team.vercel.app`;
- branch alias: `https://basemodel-preview-git-agent-seed-owned-4x-54f1f3-wangrui92-team.vercel.app`;
- state: READY;
- GitHub status: Vercel success.

Final Gate:

- Astro check: 0 errors;
- data validation: 164 models / 21 papers;
- semantic audit: 0 findings;
- 14 Vitest files / 75 tests passed;
- V2 completion: pass;
- V2 adversarial: pass;
- hardening: pass;
- Astro build: 392 pages.

The full Gate caught two real PR regressions before final acceptance: loss of the `guides` collection contract and loss of the “heuristic resource estimate != measured hardware result” evidence boundary. Both were fixed. Preserve these audits.

## Cloudflare boundary

Cloudflare remains the Production provider, but the product inside Cloudflare is changing only after a shadow migration proves parity:

```text
current: Cloudflare Pages
 target: Cloudflare Workers Static Assets
```

Do not intentionally trigger a Cloudflare Pages Git Preview to test Workers. Intermediate source/docs synchronization should remain skip-build where appropriate.

Cloudflare Direct Upload remains supported through the repository-owned command/runbooks and is a fallback / Cloudflare-specific Preview tool, not the ordinary first-choice Preview path.

Do not claim the exact monthly Cloudflare build counter unless authoritative account evidence is available.

## Current deployment Gate

`npm run verify:deploy` includes deterministic repository-local checks:

```text
npm run check
npm run validate
npm run audit:semantic
npm run audit:claims
npm run audit:freshness
npm test
npm run audit:v2
npm run audit:v2:adversarial
npm run audit:hardening
```

Vercel Previews run this Gate before `npm run build`. Cloudflare Pages formal builds retain their repository-owned gate via `npm run build:cloudflare` until Pages is retired. The Workers shadow migration must preserve the same repository correctness contract rather than weakening it for the new host.

Full Playwright browser suites and third-party network/vendor audits remain on-demand unless deliberately promoted into the blocking Gate.

## Product / research integrity — still authoritative

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
3. `docs/agents/current/hosting-architecture.md`
4. `docs/agents/current/vercel-preview-migration-plan.md`
5. `docs/agents/current/preview-platform-evaluation.md`
6. `docs/agents/current/product-and-research-integrity.md`
7. `docs/agents/current/model-catalog-verification-policy.md`
8. `docs/agents/current/seed-guided-research-workflow.md`
9. `docs/agents/current/deployment-policy.md`
10. `docs/agents/current/direct-upload-preview-command.md`
11. `docs/agents/current/cloudflare-pages-deployment.md`
12. `docs/agents/current/repository-map.md`
13. `package.json`, `vercel.json`, `wrangler.jsonc` when present, and task-specific source/tests

If older Cloudflare-only text conflicts with the validated Vercel Preview split or the approved Workers shadow migration, this handoff plus `current/hosting-architecture.md` wins.

## Release warning

During the shadow migration, use skip-build commits for intermediate synchronization where appropriate. **Do not use a skip prefix on an intentional Pages Production release**, and do not perform a Workers Production cutover merely because configuration landed on `main`. Production cutover is a separate explicit release boundary with rollback and verification.

## External boundaries

Do not falsely mark these complete without real services/evidence:

- Workers shadow deployment and parity verification until an actual Workers URL has been tested;
- Production Pages-to-Workers cutover until the real public route changes and is verified;
- account-backed cross-device storage;
- team/realtime collaboration;
- server-side notifications/personalized APIs;
- unreported paper hardware measurements or author intent;
- exact Cloudflare account-level build-quota counters when the account API is unavailable.

Historical migration/incident records live under `docs/agents/history/` and are evidence, not current operating policy.
