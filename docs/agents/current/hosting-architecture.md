# Hosting architecture — required Public PR CI + Vercel provider gate + manual fallbacks

Last reviewed: **2026-09-09**

Status: **current release architecture. Public GitHub Actions owns required exact-head deterministic/browser acceptance on independent hosted runners; Vercel Pro owns required exact-head provider build/deploy acceptance plus Preview/Production deployment; CircleCI and Mac/OrbStack are manual fallback only; Cloudflare supplies post-deploy smoke.**

Provider-selection rationale and rejected alternatives: [`ci-provider-decision.md`](ci-provider-decision.md). This file owns current topology; the rationale file explains why this topology is preferred.

## Current decision

```text
GitHub = source of truth

working PR / development branch
  -> public hosted GitHub Actions preflight
  -> deterministic gate + shared risk planner
  -> full work uses 8 independent Chromium shards; bounded work uses one focused runner; non-UI work uses zero browser runners
  -> no Git-integrated Vercel acceptance Preview while iterating
  -> when human visual review is needed: manual GitHub-hosted Fast Review build -> prebuilt upload to a dedicated non-Git-connected review Preview
  -> review Preview is non-authoritative, non-Production, and never moves `ci/vercel-gate-final`

final non-draft current-base candidate
  -> required `public-ci-gate` must already be success on the exact PR head
  -> `node scripts/request-vercel-final-gate.mjs <PR_NUMBER>` verifies that check, pins non-deploy `ci/vercel-gate-base` to live `main`, then moves existing persistent `ci/vercel-gate-final` to the exact PR head SHA
  -> Vercel Preview
  -> static production build only
  -> required GitHub statuses: `public-ci-gate` + `Vercel` on that exact SHA

main
  -> Vercel Production
  -> static production build of the already-accepted merge tree
  -> deploy accepted static artifact
  -> Cloudflare production-smoke observes the real origin

manual CI recovery only
  -> CircleCI `manual_cloud_ci` via explicit API trigger
  -> self-hosted GitHub Actions workflow_dispatch
  -> Mac/OrbStack `basemodel-ci` fallback runner
```

Public PR CI owns required **repository/browser acceptance**, while Vercel owns required **provider build/deploy acceptance**. The stable Production identity remains `https://basemodel-preview.vercel.app`. CircleCI and the self-hosted Mac workflow remain explicit recovery paths and never own ordinary merge readiness.

## Public GitHub Actions preflight

`.github/workflows/public-pr-ci.yml` runs on `pull_request` with `contents: read`, no secrets, immutable-SHA-pinned Actions, exact PR-head binding, and same-PR auto-cancellation. A dependency-free planning job allocates browser compute before runner start: zero runners for skip, one for focused, and eight independent public Linux runners for full/global work; every browser runner re-evaluates the same plan before npm/browser spend. Full work uses the repository timing scheduler with one Playwright worker per shard; the browser runtime is the digest-pinned official Playwright 1.62.1 Noble image. The workflow shares `scripts/vercel-ui-plan.ts` and `scripts/ci-ui-gate.mjs`, so it does not own a weaker provider-specific risk taxonomy.

The 2026-09-15 scheduler qualification refreshed the current canonical suite to 197 Chromium identities and held the acceptance contract fixed while testing 4/6/8 shards. Runs `34986898313`, `34987545968`, and `34988052276` all covered 197/197 identities exactly once with retries=0; their maximum browser-step times were 138 s, 102 s, and 80 s, and workflow wall times were 209 s, 159 s, and 139 s. The frozen selection rule chooses the smallest shard count within 10% of the fastest result, so full/global work uses 8 shards. This evidence qualifies the required Public PR CI browser topology. Vercel remains separately required for exact-head provider build/deploy success, but it no longer reruns the browser matrix.

## Exact-head acceptance ownership

Branch protection keeps strict current-base semantics and requires both `public-ci-gate` and `Vercel`. Ordinary PR/development refs are intentionally not deployment-enabled. Hosted provider acceptance is requested by `node scripts/request-vercel-final-gate.mjs <PR_NUMBER>`: it first proves exact-head `public-ci-gate=success`, binds non-deploy `ci/vercel-gate-base` to exact live `main`, then moves the existing persistent `ci/vercel-gate-final` ref to the **same exact commit SHA** as the final PR head. The final ref cannot add or rewrite content. Do not delete/recreate it as the normal trigger: the 2026-09-08 canary showed that creating a new alias directly at an already-known SHA produced no Vercel event, while updating an existing ref did. The separate base ref prevents the next candidate from being diffed against an unrelated prior PR. `scripts/vercel-ignore-build.mjs` remains fail-open after that spend gate:

- every triggered gate Preview: real provider-build acceptance; the Ignored Build Step does not trust PR identity at pre-build time;
- `[vercel-preview]`: optional historical/review marker only, not an executable skip/build gate;
- docs/governance-only final candidate: still requires exact-head Public PR CI; its Vercel gate runs only the static provider build;
- docs/governance-only `main`: ignored as non-deploy-relevant, so an `AGENTS.md`/`docs/agents/**`-only merge cannot publish a new Production website.
- detached HPL control-plane-only candidate: Public PR CI still runs deterministic/HPL/Reader validation; the Vercel gate runs only the static provider build. On `main`, the ignored-build step skips the duplicate Production rebuild. `scripts/hpl-control-plane.mjs` owns the narrow allowlist and scans all non-test runtime `src` modules for forbidden imports; any importer restores fail-closed Public PR CI browser behavior.

Persistent final-gate identity is anchored to live `main`, not to the previous gate deployment. Before moving `ci/vercel-gate-final`, the request helper proves exact-head `public-ci-gate=success` and pins `ci/vercel-gate-base` to current `main`. Strict branch protection still handles base drift: an out-of-date PR must refresh and obtain fresh exact-head Public PR CI and Vercel results before merge.

## Vercel contract

- project: `basemodel-preview`
- production branch: `main`
- build: `npm run build`
- canonical project domain: `https://basemodel-preview.vercel.app`

Public GHA `ci-ui-gate.mjs` and the retained manual fallback paths share `scripts/vercel-ui-plan.ts`; skip/focused/full classification therefore has one owner. Shared/global/unknown changes fail closed to the complete canonical Chromium matrix. Route-owned/content changes may use focused mapped coverage. Lab/server-relevant changes run the dedicated 6-case active-Lab gate in Public PR CI. `vercel-ui-gate.mjs` remains available as fallback/history-compatible tooling but is not part of the ordinary Vercel build command.

HPL-only is a special **control-plane detachment** case, not a generic exemption for `src/lib` or `src/data`. Only the exact paths declared in `scripts/hpl-control-plane.mjs` qualify, and only while no ordinary runtime source imports them. The helper and ignored-build/planner owners themselves are full-risk changes, so this optimization cannot classify its own implementation as harmless.

Vercel Preview is automatically non-indexable through `VERCEL_ENV=preview`; Production uses the stable project domain/canonical. `vercel.json` must not disable `main`.

## Manual fallback surfaces

The repository-owned `.circleci/config.yml` and its two-shard timing scheduler remain preserved for explicit API-triggered recovery only. Automatic PR and `main` workflows are disabled, so normal repository activity must not start CircleCI. CircleCI is not a required GitHub context and does not own merge readiness. Do not weaken or delete those contracts merely to make a manual recovery run green; if an explicitly triggered fallback finds a real regression that Vercel missed, treat that as a Vercel-contract defect and repair the shared acceptance surface.

The retained `.github/workflows/self-hosted-ci.yml` remains manual `workflow_dispatch` fallback only. No ordinary PR or `main` event should require the Mac runner, and research/GPU servers are never substitute website CI runners.

## Acceptance sequence

```text
repository/UI batch updated
-> required Public PR CI supplies exact-head deterministic/browser acceptance
-> optional fast human-review Preview: GitHub-hosted manual build -> prebuilt non-Git-connected upload -> owner inspection
-> continue edits without touching the final-gate ref
-> request helper re-verifies public-ci-gate on the exact current head/base
-> exact PR head receives required Vercel provider-build success
-> inspect the authoritative final Preview route/metadata when the change is user-facing
-> merge accepted release to main
-> Vercel Production runs the static production build of the already-accepted merge tree
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
