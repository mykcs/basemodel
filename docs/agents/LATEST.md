# Latest Agent handoff

Last updated: **2026-08-11**

Status: **Vercel Preview + Cloudflare Pages Production is the accepted current architecture.** The Workers Static Assets shadow has been successfully validated, but the Production cutover is paused after a cross-provider audit found no current product requirement strong enough to justify a hostname/SEO migration or another hosting transition.

This is the stable first-stop handoff for future coding Agents.

## Current architecture

```text
GitHub `mykcs/basemodel` = source of truth

non-main branch / PR
  -> Vercel `basemodel-preview`
  -> npm run verify:deploy
  -> npm run build
  -> protected Preview

main / explicit release
  -> Vercel Git deployment disabled
  -> Cloudflare Pages Production
  -> https://basemodel.pages.dev
```

Read `docs/agents/current/hosting-architecture.md` before any hosting/deployment change.

## Hosting decision after the 2026-08-11 provider audit

The earlier Workers shadow work remains valid evidence, but **Workers is no longer an approved automatic next step**. It is a validated optional capability.

Why the cutover is paused:

- ordinary Preview no longer consumes Cloudflare Pages Git builds because Vercel owns that role;
- the product is still a static Astro site and does not currently require Workers-native runtime services;
- `basemodel.pages.dev` is the live Production/canonical identity, so moving to Workers or Vercel is also a hostname/SEO/release migration;
- removing Cloudflare Production would move both Preview and Production resource pressure onto Vercel without eliminating the normal release boundary;
- provider uniformity alone is not sufficient reason for migration.

Re-open Workers cutover only for a real trigger such as a custom-domain migration, a genuine Workers-native feature, a measured Pages limitation, or explicit owner Production-host intent. Re-check current first-party provider documentation when that happens.

## Workers shadow evidence retained

The repository still contains the validated static-only shadow contract (`wrangler.jsonc`, `build:workers:shadow`, headers and regression tests). The live shadow previously passed representative routes/assets/SEO/headers and browser behavior with documented provider differences. Preserve that evidence as rollback/future-option knowledge; do not report it as current Production.

## Ordinary website workflow

1. Read this file, `current/hosting-architecture.md`, the scenario-trigger registry, and task-relevant current docs/code/tests.
2. Inspect overlapping PRs before editing.
3. Work on one focused branch/PR and batch coherent changes before pushing.
4. Avoid intentionally triggering Cloudflare Pages Preview builds during branch iteration; use the documented skip convention where appropriate.
5. Let Vercel create the non-main Preview and verify the **exact PR head** ran `npm run verify:deploy` before `npm run build`.
6. Inspect the real affected Preview routes. READY is not visual/product acceptance.
7. Merge/release only after acceptance. An intentional Pages Production release must not be skipped.
8. Verify Cloudflare Pages Production separately and report source, Gate, Preview, merge, Production and provider-build evidence as separate claims.

Because the repository is private, generate a temporary Vercel share URL when the owner needs anonymous Preview access; do not weaken deployment protection merely for convenience.

## Build-resource policy

- Vercel is the ordinary Preview resource pool; avoid rapid push/build storms and trigger-only commits.
- Cloudflare Pages is the Production resource pool; ordinary PR review should not consume its Git build budget.
- Direct Upload is fallback/Cloudflare-specific fidelity tooling, not the ordinary first-choice Preview.
- Do not claim account-level build counters without authoritative provider evidence.

## Current deployment Gate

For deployable work:

```text
npm run verify:deploy
npm run build
```

Do not weaken repository audits merely to obtain a green hosted check. Full browser suites and network/vendor audits remain scope-triggered unless deliberately promoted into the blocking Gate.

## Product / research integrity

Still authoritative:

- the product is a research decision system, not merely a leaderboard;
- strict reproduction, method reproduction and modern rerun remain distinct;
- unknown stays unknown rather than guessed;
- open weights != automatically open source/unrestricted licensing;
- hardware catalog tiers, heuristic resource estimates and measured hardware results remain separate evidence levels;
- current/latest claims require current first-party verification;
- done means wired into the real user path and protected by acceptance checks.

Read `current/product-and-research-integrity.md`, `current/model-catalog-verification-policy.md`, and `current/seed-guided-research-workflow.md` when relevant.

## Agent reading order

1. `/AGENTS.md`
2. `docs/agents/LATEST.md`
3. `docs/agents/current/project-agent-operating-principles.md`
4. `docs/agents/current/scenario-trigger-registry.md`
5. `docs/agents/current/hosting-architecture.md`
6. task-relevant current product/deployment/evidence docs
7. `package.json`, `vercel.json`, `wrangler.jsonc` and task-specific source/tests

Historical migration/incident files are rationale and evidence, not instructions to restore a superseded target architecture.