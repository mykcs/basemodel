# Latest Agent handoff

Last updated: **2026-08-11 01:32 +08:00**

Status: **Vercel Preview + Cloudflare Production is now the validated deployment split for Agent-driven website work. Vercel handles non-main PR/branch Previews with the full repository Gate; Vercel Git deployment is disabled for `main`; Cloudflare Pages remains canonical Production. Cloudflare Direct Upload remains the fallback / Cloudflare-specific Preview path.**

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

GitHub Actions and GitHub Pages remain intentionally retired.

## Ordinary website workflow

1. Read this file plus the task-relevant files under `docs/agents/current/`.
2. Inspect overlapping PRs before editing.
3. Work on one focused branch / PR.
4. For ordinary branch synchronization, use `[CF-Pages-Skip]` where appropriate so Cloudflare does not intentionally spend a Git Preview build.
5. Let Vercel create the non-main Preview.
6. Verify that the exact PR head received `Vercel = success` and that Vercel actually ran `npm run verify:deploy` before `npm run build`.
7. Inspect the real Preview route(s). Do not equate a source diff or READY badge with product acceptance.
8. Because the repository is private, generate a temporary Vercel share URL when the owner needs anonymous access. Share links expire; regenerate them rather than storing them as permanent URLs.
9. Iterate until the exact head passes.
10. After owner acceptance, merge/release to `main` with a **normal non-skip merge message** so the intended Cloudflare Production deployment is not accidentally skipped.

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
- `PUBLIC_SITE_URL=https://basemodel.pages.dev`;
- `noindex` on Preview;
- canonical / hreflang identity pointing to Cloudflare Production.

## First validated pilot

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

Cloudflare remains canonical Production and the release target for `main`.

During the Vercel pilot:

- no new Cloudflare Git-integrated Preview was intentionally requested;
- GitHub showed Vercel success for the final pilot head;
- the Cloudflare PR bot remained on an older `828aaf4` Preview;
- Production was not intentionally changed by the pilot.

Do not claim the exact monthly Cloudflare build counter from this evidence; the available tools do not expose the authoritative account-level counter.

Cloudflare Direct Upload remains supported through the repository-owned command/runbooks and is preferred when Cloudflare-specific Preview fidelity is the thing being tested.

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

Vercel Previews run this Gate before `npm run build`. Cloudflare formal builds retain their repository-owned gate via `npm run build:cloudflare`.

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
3. `docs/agents/current/vercel-preview-migration-plan.md`
4. `docs/agents/current/preview-platform-evaluation.md`
5. `docs/agents/current/product-and-research-integrity.md`
6. `docs/agents/current/model-catalog-verification-policy.md`
7. `docs/agents/current/seed-guided-research-workflow.md`
8. `docs/agents/current/deployment-policy.md`
9. `docs/agents/current/direct-upload-preview-command.md`
10. `docs/agents/current/direct-upload-preview-policy.md`
11. `docs/agents/current/cloudflare-pages-deployment.md`
12. `docs/agents/current/repository-map.md`
13. `package.json`, `vercel.json`, and task-specific source/tests

If older Cloudflare-only text conflicts with the validated Vercel Preview / Cloudflare Production split, this handoff plus `current/vercel-preview-migration-plan.md` wins for ordinary Preview behavior.

## Release warning

Do not use `[CF-Pages-Skip]`, `[Skip CI]`, or another Cloudflare skip prefix on the final merge/release commit when the owner expects Cloudflare Production to deploy. Skip prefixes are for intermediate/non-release synchronization, not the real Production boundary.

## External boundaries

Do not falsely mark these complete without real services/evidence:

- account-backed cross-device storage;
- team/realtime collaboration;
- server-side notifications/personalized APIs;
- unreported paper hardware measurements or author intent;
- exact Cloudflare account-level build-quota counters when the account API is unavailable.

Historical migration/incident records live under `docs/agents/history/` and are evidence, not current operating policy.
