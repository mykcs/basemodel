# Hosting architecture — public GHA preflight + Vercel Pro authority + manual fallbacks

Last reviewed: **2026-09-09**

Status: **current release architecture. Public GitHub Actions supplies automatic read-only PR preflight on independent hosted runners; Vercel Pro remains the only required final-candidate acceptance and ordinary Preview/Production deployment authority; CircleCI and Mac/OrbStack are manual fallback only; Cloudflare supplies post-deploy smoke.**

Provider-selection rationale and rejected alternatives: [`ci-provider-decision.md`](ci-provider-decision.md). This file owns current topology; the rationale file explains why this topology is preferred.

## Current decision

```text
GitHub = source of truth

working PR / development branch
  -> public hosted GitHub Actions preflight
  -> deterministic gate + shared risk planner
  -> full work uses 4 independent Chromium shards; bounded work uses focused coverage
  -> no Git-integrated Vercel acceptance Preview while iterating
  -> when human visual review is needed: local/Agent static build -> prebuilt upload to a dedicated non-Git-connected review Preview
  -> review Preview is non-authoritative, non-Production, and never moves `ci/vercel-gate-final`

final non-draft current-base candidate
  -> `node scripts/request-vercel-final-gate.mjs <PR_NUMBER>` pins non-deploy `ci/vercel-gate-base` to live `main`
  -> existing persistent `ci/vercel-gate-final` ref moves to the exact PR head SHA
  -> Vercel Preview
  -> verify:deploy
  -> static build
  -> risk-based Chromium acceptance
  -> Lab gate when relevant
  -> required GitHub status: Vercel on that exact SHA

main
  -> Vercel Production
  -> same deterministic + risk-based browser contract
  -> deploy accepted static artifact
  -> Cloudflare production-smoke observes the real origin

manual CI recovery only
  -> CircleCI `manual_cloud_ci` via explicit API trigger
  -> self-hosted GitHub Actions workflow_dispatch
  -> Mac/OrbStack `basemodel-ci` fallback runner
```

Public hosted GitHub Actions is the ordinary **preflight compute** surface, while Vercel remains the ordinary **final acceptance and deployment authority**. The stable Production identity remains `https://basemodel-preview.vercel.app`. The public preflight is intentionally non-required; CircleCI and the self-hosted Mac workflow remain explicit recovery paths and never own merge readiness.

## Public GitHub Actions preflight

`.github/workflows/public-pr-ci.yml` runs on `pull_request` with `contents: read`, no secrets, immutable-SHA-pinned Actions, exact PR-head binding, and same-PR auto-cancellation. Full/global browser work uses four independent public Linux runners with the repository timing scheduler and one Playwright worker per shard; the browser runtime is the digest-pinned official Playwright 1.62.1 Noble image. The workflow shares `scripts/vercel-ui-plan.ts` and `scripts/ci-ui-gate.mjs`, so it does not own a weaker provider-specific risk taxonomy.

Qualification run `34261768688` on exact head `b1551fffefa9061530a688e48343ea21e4ab0670` covered all 204 canonical Chromium identities exactly once as 51/51/52/50 and passed every shard with retries=0. The slowest browser acceptance step was 191 s versus about 402 s for the representative Vercel full-browser tail, a measured critical-path reduction of about 52.5%. The slowest complete browser job including container/setup overhead was 227 s. This evidence authorizes the public GHA lane as automatic early feedback; it does **not** replace the required Vercel final status.

## Exact-head acceptance ownership

Branch protection keeps strict current-base semantics and requires `Vercel`. Ordinary PR/development refs are intentionally not deployment-enabled. Hosted acceptance is requested by `node scripts/request-vercel-final-gate.mjs <PR_NUMBER>`: it first binds non-deploy `ci/vercel-gate-base` to exact live `main`, then moves the existing persistent `ci/vercel-gate-final` ref to the **same exact commit SHA** as the final PR head. The final ref cannot add or rewrite content. Do not delete/recreate it as the normal trigger: the 2026-09-08 canary showed that creating a new alias directly at an already-known SHA produced no Vercel event, while updating an existing ref did. The separate base ref prevents the next candidate from being diffed against an unrelated prior PR. `scripts/vercel-ignore-build.mjs` remains fail-open after that spend gate:

- every triggered gate Preview: real acceptance; the Ignored Build Step does not trust PR identity at pre-build time;
- `[vercel-preview]`: optional historical/review marker only, not an executable skip/build gate;
- docs/governance-only final candidate: still runs `verify:deploy`, while the browser planner may skip when UI risk is proven absent;
- docs/governance-only `main`: ignored as non-deploy-relevant, so an `AGENTS.md`/`docs/agents/**`-only merge cannot publish a new Production website.

Persistent final-gate browser scope is anchored to live `main`, not to the previous gate deployment. Before moving `ci/vercel-gate-final`, the request helper pins `ci/vercel-gate-base` to current `main`; the hosted range helper verifies that remote equality again before diffing. Missing/stale base identity fails closed to the complete Chromium matrix. Strict branch protection still handles base drift: an out-of-date PR must refresh and obtain a fresh exact-SHA gate result before merge.

## Vercel contract

- project: `basemodel-preview`
- production branch: `main`
- build: `npm run verify:deploy && npm run build && node scripts/vercel-ui-gate.mjs && node scripts/vercel-lab-browser-gate.mjs`
- canonical project domain: `https://basemodel-preview.vercel.app`

`vercel-ui-gate.mjs`, the public GHA `ci-ui-gate.mjs`, and the retained manual CircleCI path share `scripts/vercel-ui-plan.ts`; skip/focused/full classification therefore has one owner. Shared/global/unknown changes fail closed to the complete canonical Chromium matrix. Route-owned/content changes may use focused mapped coverage. Lab/server-relevant changes run the dedicated 12-case Lab gate. Assertion thresholds, reader contracts and scientific-content boundaries are provider-independent.

Vercel Preview is automatically non-indexable through `VERCEL_ENV=preview`; Production uses the stable project domain/canonical. `vercel.json` must not disable `main`.

## Manual fallback surfaces

The repository-owned `.circleci/config.yml` and its two-shard timing scheduler remain preserved for explicit API-triggered recovery only. Automatic PR and `main` workflows are disabled, so normal repository activity must not start CircleCI. CircleCI is not a required GitHub context and does not own merge readiness. Do not weaken or delete those contracts merely to make a manual recovery run green; if an explicitly triggered fallback finds a real regression that Vercel missed, treat that as a Vercel-contract defect and repair the shared acceptance surface.

The retained `.github/workflows/self-hosted-ci.yml` remains manual `workflow_dispatch` fallback only. No ordinary PR or `main` event should require the Mac runner, and research/GPU servers are never substitute website CI runners.

## Acceptance sequence

```text
repository/UI batch updated
-> public GHA preflight supplies early deterministic/browser evidence
-> optional fast human-review Preview: local static build -> prebuilt non-Git-connected upload -> owner inspection
-> continue edits without touching the final-gate ref
-> exact PR head/current base receives required Vercel success
-> inspect the authoritative final Preview route/metadata when the change is user-facing
-> merge accepted release to main
-> Vercel Production runs the same deterministic/risk-based contract
-> verify Production HTTP/routes/canonical/hreflang/robots/sitemap
-> Cloudflare scheduled smoke continues independent observation
```

The fast human-review Preview is a viewing convenience only. It may prove that the built page is inspectable, but it cannot prove merge readiness, exact-head acceptance, current-base freshness, or Production behavior. A READY historical/review Preview is not current merge evidence. A green historical CircleCI run is not current merge evidence.

## Public-source boundary

Provider authentication, bearer tokens, share/access query parameters, account IDs and opaque project/team IDs are not repository documentation. Keep them in provider-side configuration or ephemeral tool output. A temporary Preview share URL must never be committed or persisted in a GitHub PR/Issue body or comment.

## Legacy hosting — not ordinary workflow

Historical Cloudflare deployment snapshots, Pages helpers and Workers shadow-build paths remain migration/fallback residue and are not ordinary deployment authority. The one active exception is `cloudflare/production-smoke/`, which monitors the Vercel Production origin and never publishes the site itself.

Only load or mention legacy hosting when:

- the task explicitly concerns retirement, redirect or rollback;
- the legacy surface is changed; or
- live evidence shows unexpected provider activity.

A still-required skip prefix is a silent compatibility safeguard until the external integration is disabled. It is not an ordinary release stage or completion-report item.
