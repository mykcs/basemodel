# Hosting architecture — public GHA merge authority + Vercel Production

Last reviewed: **2026-09-09**

Status: **current release architecture. Public GitHub Actions is the required PR CI authority; Vercel owns Production and explicitly requested Previews; Cloudflare supplies independent post-deploy smoke; CircleCI and Mac/OrbStack are manual recovery only.**

Provider-selection rationale: [`ci-provider-decision.md`](ci-provider-decision.md). Release policy: [`deployment-policy.md`](deployment-policy.md).

## Current topology

```text
GitHub = source of truth

working PR
  -> public GitHub Actions (`pull_request`, contents: read, no secrets)
  -> deterministic repository gate
  -> shared risk planner
  -> full/global UI: 4 independent Chromium shards, 1 worker each
  -> bounded UI: focused mapped coverage
  -> aggregate required GitHub check: public-ci-gate
  -> strict current-base policy

optional Vercel Preview
  -> only when a real provider-rendered Preview or Vercel-specific diagnosis is useful
  -> persistent ci/vercel-gate-base / ci/vercel-gate-final refs
  -> exact candidate identity
  -> repository validation + build + Vercel Chromium/Lab acceptance
  -> never required for ordinary merge readiness

main
  -> Vercel Production
  -> npm run verify:deploy
  -> npm run build
  -> Production skips duplicate full Chromium/Lab browser work
  -> https://basemodel-preview.vercel.app
  -> Cloudflare production-smoke observes the real origin

manual recovery only
  -> CircleCI manual_cloud_ci via explicit API trigger
  -> self-hosted GitHub Actions workflow_dispatch
  -> Mac/OrbStack basemodel-ci runner
```

## Required GitHub Actions CI

`.github/workflows/public-pr-ci.yml` is the ordinary merge CI surface. It runs on `pull_request`, uses `contents: read`, has no secrets, binds the exact candidate head, pins third-party Actions to immutable SHAs, and auto-cancels superseded runs for the same PR.

The deterministic job runs the repository gate and static build. Browser work shares the same `scripts/vercel-ui-plan.ts` risk taxonomy as the other retained paths. Full/global/unknown changes run the canonical Chromium suite across four independent public runners with one Playwright worker each; bounded changes run focused mapped coverage. `public-ci-gate` depends on deterministic + browser completion and is the single required aggregate context.

Qualification on exact head `5545f6e922b007b7bacd3c2667a2f9b6b6e1ae15` used run `34299509005`. Every job passed, the slowest complete browser job was about 213 seconds, and the same candidate later passed Vercel's full Chromium 204/204 plus Lab 12/12. The public GHA critical path was about 47% shorter than the representative ~402-second Vercel full-browser tail.

Branch/ruleset strictness owns current-base freshness. A green result is valid only for the current PR head while it remains current with protected `main`; stale results from another SHA or base are not merge evidence.

## Vercel contract

Vercel project `basemodel-preview` remains the only ordinary website deployment provider.

`vercel.json` keeps ordinary working refs disabled and enables only:

```text
main
ci/vercel-gate-final
```

The build command is:

```bash
npm run verify:deploy && npm run build && node scripts/vercel-browser-gates.mjs
```

`scripts/vercel-browser-gates.mjs` has one cost boundary:

- `VERCEL_ENV=production`: deterministic validation and the real site build have already run; skip duplicate Chromium/Lab execution because the required public GHA gate owns browser CI;
- Preview or an unknown environment: fail closed and run `vercel-ui-gate.mjs` plus `vercel-lab-browser-gate.mjs`.

This keeps Production provider compatibility real without spending another full browser matrix after a required PR gate has already passed.

Vercel Preview remains automatically non-indexable. Production uses the stable canonical project domain. `main` must stay deployment-enabled.

## On-demand exact-head Preview

A real Vercel Preview is optional evidence for human review, provider-specific debugging, or recovery qualification.

When needed:

```bash
node scripts/request-vercel-final-gate.mjs <PR_NUMBER>
```

The helper pins non-deploy `ci/vercel-gate-base` to exact live `main`, then moves persistent `ci/vercel-gate-final` to the same exact PR head commit. The ref is an execution alias and cannot add or rewrite content.

`scripts/vercel-git-range.mjs` uses the canonical public GitHub remote, verifies that the pinned remote base still equals live `main`, and diffs that base tree against the exact candidate. This path was provider-qualified on the #588 exact head: Vercel resolved the real changed-file set instead of failing closed because a local `origin` remote was missing.

Do not create a fresh alias per PR, manufacture no-op commits, or treat `[vercel-preview]` as a gate token.

## Cloudflare production smoke

`cloudflare/production-smoke/` is the active Cloudflare surface. It is intentionally small and independent: a Worker observes the released Vercel Production origin and checks externally visible HTTP/discovery/metadata behavior.

It does not:

- publish BaseModel;
- install the repository;
- run Vitest or Playwright;
- act as a GitHub required check.

Provider diversity is useful here because Cloudflare observes the result from outside Vercel instead of duplicating the same pre-merge computation.

## Manual recovery surfaces

`.circleci/config.yml` retains `manual_cloud_ci` for explicit API-triggered recovery only. Automatic PR/main CircleCI workflows remain disabled. CircleCI credit state never controls ordinary merge readiness.

`.github/workflows/self-hosted-ci.yml` remains manual `workflow_dispatch` fallback on the repository-scoped Mac/OrbStack runner. No ordinary PR or main event requires the Mac, and research/GPU servers are never substitute website CI runners.

Remote Desktop Commander can use an authorized machine for local files, shell, Git, Node, Playwright, and CLI work when that shortens the feedback loop. It is an execution surface, not merge authority.

## Acceptance sequence

```text
working branch / PR
-> public GitHub Actions exact-head/current-base CI
-> public-ci-gate SUCCESS
-> optional real Vercel Preview only if it answers a review/provider question
-> merge while still current with main
-> Vercel Production validation + build
-> verify real Production routes/canonical/hreflang/robots/sitemap
-> Cloudflare scheduled smoke independently observes Production
```

A READY historical Preview, a historical GHA run, a CircleCI green, or a local pass is not current merge evidence.

## Public-source boundary

Provider authentication, bearer tokens, share/access query parameters, account IDs, and opaque project/team IDs are not repository documentation. Keep them provider-side or in ephemeral tool output. Temporary Vercel Preview share URLs must never be committed or persisted in PR/Issue bodies or comments.

## Legacy hosting — not ordinary workflow

Historical Cloudflare Pages/Workers deployment helpers and static shadow paths remain migration/rollback evidence, not ordinary deployment authority. Load them only when the task explicitly concerns retirement, redirect, rollback, or unexpected legacy-provider activity.
