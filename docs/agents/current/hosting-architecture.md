# Hosting architecture — Vercel Pro + manual fallbacks + Cloudflare smoke

Last reviewed: **2026-09-08**

Status: **current release architecture. Vercel Pro supplies ordinary pre-merge acceptance and the only ordinary Preview/Production deployment path; CircleCI automatic PR/main workflows are disabled and API-triggered fallback only; Cloudflare supplies post-deploy smoke; the Mac/OrbStack runner is manual fallback only.**

## Current decision

```text
GitHub = source of truth

non-draft PR / release candidate
  -> automatic Vercel Preview
  -> verify:deploy
  -> static build
  -> risk-based Chromium acceptance
  -> Lab gate when relevant
  -> required GitHub status: Vercel

main
  -> Vercel Production
  -> same deterministic + risk-based browser contract
  -> deploy accepted static artifact
  -> Cloudflare production-smoke observes the real origin

manual CI recovery only
  -> CircleCI `manual_cloud_ci` via explicit API trigger
  -> GitHub Actions workflow_dispatch
  -> Mac/OrbStack `basemodel-ci` fallback runner
```

Vercel is the ordinary CI and deployment authority. The stable Production identity remains `https://basemodel-preview.vercel.app`. CircleCI does not run automatically for PRs or `main`; it exists only as explicit API-triggered recovery and never owns merge readiness.

## Exact-head acceptance ownership

Branch protection keeps strict current-base semantics and requires `Vercel`. Every open PR branch is eligible to reach Vercel. `scripts/vercel-ignore-build.mjs` distinguishes PR acceptance from ordinary branch previews:

- every Preview: automatic real acceptance; the Ignored Build Step does not trust PR identity at pre-build time;
- `[vercel-preview]`: optional historical/review marker only, not an executable skip/build gate;
- docs/governance-only PR: still runs `verify:deploy`, while the browser planner may skip when UI risk is proven absent;
- docs/governance-only `main`: ignored as non-deploy-relevant, so an `AGENTS.md`/`docs/agents/**`-only merge cannot publish a new Production website.

The first PR Preview without a previous accepted Vercel SHA fails closed to the complete Chromium matrix. Subsequent Preview runs may compare the previous accepted same-branch Vercel SHA to the current head. Base drift is handled by strict branch protection: an out-of-date PR must refresh and obtain a new required Vercel result before merge.

## Vercel contract

- project: `basemodel-preview`
- production branch: `main`
- build: `npm run verify:deploy && npm run build && node scripts/vercel-ui-gate.mjs && node scripts/vercel-lab-browser-gate.mjs`
- canonical project domain: `https://basemodel-preview.vercel.app`

`vercel-ui-gate.mjs` and the retained manual CircleCI `ci-ui-gate.mjs` share `scripts/vercel-ui-plan.ts`; skip/focused/full classification therefore has one owner. Shared/global/unknown changes fail closed to the complete canonical Chromium matrix. Route-owned/content changes may use focused mapped coverage. Lab/server-relevant changes run the dedicated 12-case Lab gate. Assertion thresholds, reader contracts and scientific-content boundaries are provider-independent.

Vercel Preview is automatically non-indexable through `VERCEL_ENV=preview`; Production uses the stable project domain/canonical. `vercel.json` must not disable `main`.

## Manual fallback surfaces

The repository-owned `.circleci/config.yml` and its two-shard timing scheduler remain preserved for explicit API-triggered recovery only. Automatic PR and `main` workflows are disabled, so normal repository activity must not start CircleCI. CircleCI is not a required GitHub context and does not own merge readiness. Do not weaken or delete those contracts merely to make a manual recovery run green; if an explicitly triggered fallback finds a real regression that Vercel missed, treat that as a Vercel-contract defect and repair the shared acceptance surface.

The retained `.github/workflows/self-hosted-ci.yml` remains manual `workflow_dispatch` fallback only. No ordinary PR or `main` event should require the Mac runner, and research/GPU servers are never substitute website CI runners.

## Acceptance sequence

```text
repository contract updated
-> exact PR head/current base receives required Vercel success
-> inspect real Preview route/metadata when the change is user-facing
-> merge accepted release to main
-> Vercel Production runs the same deterministic/risk-based contract
-> verify Production HTTP/routes/canonical/hreflang/robots/sitemap
-> Cloudflare scheduled smoke continues independent observation
```

A READY historical Preview is not current merge evidence. A green historical CircleCI run is not current merge evidence.

## Public-source boundary

Provider authentication, bearer tokens, share/access query parameters, account IDs and opaque project/team IDs are not repository documentation. Keep them in provider-side configuration or ephemeral tool output. A temporary Preview share URL must never be committed or persisted in a GitHub PR/Issue body or comment.

## Legacy hosting — not ordinary workflow

Historical Cloudflare deployment snapshots, Pages helpers and Workers shadow-build paths remain migration/fallback residue and are not ordinary deployment authority. The one active exception is `cloudflare/production-smoke/`, which monitors the Vercel Production origin and never publishes the site itself.

Only load or mention legacy hosting when:

- the task explicitly concerns retirement, redirect or rollback;
- the legacy surface is changed; or
- live evidence shows unexpected provider activity.

A still-required skip prefix is a silent compatibility safeguard until the external integration is disabled. It is not an ordinary release stage or completion-report item.
