# Hosting architecture — Cloudflare-first with authenticated Vercel fallback

Last reviewed: **2026-10-29**

**2026-10-30 target architecture, requiring live control-plane verification:** Cloudflare is the normal protected Production release surface; the existing Vercel Production is kept as a protected, manually refreshed fallback. Every PR must pass two separate GitHub-hosted exact-head checks (`public-ci-gate` and `cloudflare-artifact-gate`); the latter packages the Worker and runs an offline deploy dry-run, without Vercel Hobby or Cloudflare publication. Ordinary `main` updates no longer trigger Vercel Git deployment (`vercel.json` disables `main`). A new release is an explicit Cloudflare protected workflow dispatch or an optional authenticated Vercel CLI/API action. [The dual-provider migration SOP](../../dev/CI/QUOTA_AWARE_PROVIDER_SWITCH.md) requires live ruleset `22224550` to be read back and post-merge Access/visual/browser acceptance. If its live ruleset still requires `Vercel`, **the legacy policy below remains the actual current merge authority**, no matter what this branch proposes.

**2026-10-30 protected standby deployed; not current release authority:** [`docs/dev/CI/REVERSIBLE_HOSTING.md`](../../dev/CI/REVERSIBLE_HOSTING.md) records the separate, manually dispatched, fail-closed Cloudflare Access standby. [GitHub Actions #41044575890](https://github.com/mykcs/basemodel/actions/runs/41044575890) deployed the exact `main@e7eee109` artifact only after anonymous Access pre-probes; postdeploy probes also passed and representative authenticated-browser/mobile routes were inspected. It does **not** change required `public-ci-gate` + Vercel exact-head checks, `main` Production, Vercel Authentication, release DNS, or public-repo policy. No owned custom domain is verified, so one-URL provider switching is not yet available.

Status: **Cloudflare-first repository contract; live cutover depends on exact-head qualification, ruleset readback and protected main release.** Public GitHub Actions owns required exact-head deterministic/browser and Cloudflare candidate checks on hosted runners. Vercel keeps its last approved Production and credentials for deliberate fallback; CircleCI and Mac/OrbStack remain manual CI recovery. No anonymous Production monitor is active.

Provider-selection rationale and rejected alternatives: [`ci-provider-decision.md`](ci-provider-decision.md). This file owns current topology; the rationale file explains why this topology is preferred.

## Previous Vercel-first architecture (historical reference; superseded only after live cutover)

```text
GitHub = source of truth

working PR / development branch
  -> public hosted GitHub Actions preflight
  -> deterministic gate + shared risk planner
  -> full work uses Chromium 4 + WebKit 8 independent shards and one seven-case extras runner; bounded work uses one focused runner; non-UI work uses zero browser runners
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
  -> access-protected Production; verify deployment identity/state through Vercel and use authenticated page access only when needed

manual CI recovery only
  -> CircleCI `manual_cloud_ci` via explicit API trigger
  -> self-hosted GitHub Actions workflow_dispatch
  -> Mac/OrbStack `basemodel-ci` fallback runner
```

Public PR CI owns required **repository/browser acceptance**, while Vercel owns required **provider build/deploy acceptance**. The live cutover was verified on 2026-09-21: exact-head Vercel provider time was **14.170 s** versus the **507.7 s** control, and Production was **16.608 s** versus **633.3 s**, with the build-machine tier unchanged. The stable Production identity remains `https://basemodel-preview.vercel.app`. CircleCI and the self-hosted Mac workflow remain explicit recovery paths and never own ordinary merge readiness.

Performance implementation and qualification are recorded in [`docs/dev/CI/README.md`](../../dev/CI/README.md). Candidate mechanisms there are not effective until merged; executable workflows and live exact-head evidence determine acceptance.

## Public GitHub Actions preflight

`.github/workflows/public-pr-ci.yml` is the sole automatic PR browser graph. It uses immutable-SHA-pinned Actions, read-only permissions, no secrets and same-PR cancellation. Planning resolves one immutable open main-target PR identity, binds the event base and exact head, and allocates zero browser runners for skip, one for focused, or Chromium 4 + WebKit 8 full-population shards plus a distinct seven-case Public extras runner. The existing shared `scripts/vercel-ui-plan.ts` remains the risk owner. A non-skip typography branch upgrades to full work; its exhaustive failure collection and seven-day diagnostics remain. Draft opening/synchronization already runs acceptance; Ready promotion does not repeat it.

The deterministic job owns one static build and one overflow preflight in the same digest-pinned Playwright 1.63.0 Noble image. Browser consumers wait for success, download only that same run's successful producer attempt and verify exact head/base/tree, configuration, toolchain and every output byte. Full-title duration allocation uses one worker and zero retries. Each engine executes the complete `test:ui:all` population once with expanded figure capture; default light reading at 390/1440 is separately asserted before any evidence-state mutation, preserving the old ordinary route checks. Chromium's distinct core visual capture and six Lab cases run in the extras job, with their own execution proof. `public-ci-gate` requires deterministic validation, all allocated browser work and both verified figure aggregates; missing, failed, canceled or unexpected skipped work fails.

The 2026-09-15 197-case qualification selected eight Chromium shards for that earlier workload. The later 2026-10-29 topology replaces duplicate automatic browser populations with one Chromium/WebKit graph and assigns more independent runners to the slower engine. Historical measurements remain in the [CI performance record](../../dev/CI/README.md); they do not measure the new topology. Vercel remains separately required and does not rerun browser tests.

## Exact-head acceptance ownership

Branch protection keeps strict current-base semantics and requires both `public-ci-gate` and `Vercel`. Ordinary PR/development refs are intentionally not deployment-enabled. Hosted provider acceptance is requested by `node scripts/request-vercel-final-gate.mjs <PR_NUMBER>`: it first proves exact-head `public-ci-gate=success`, binds non-deploy `ci/vercel-gate-base` to exact live `main`, then moves the existing persistent `ci/vercel-gate-final` ref to the **same exact commit SHA** as the final PR head. The final ref cannot add or rewrite content. Do not delete/recreate it as the normal trigger: the 2026-09-08 canary showed that creating a new alias directly at an already-known SHA produced no Vercel event, while updating an existing ref did. The separate base ref prevents the next candidate from being diffed against an unrelated prior PR. `scripts/vercel-ignore-build.mjs` remains fail-open after that spend gate:

- every triggered gate Preview: real provider-build acceptance; the Ignored Build Step does not trust PR identity at pre-build time;
- `[vercel-preview]`: optional historical/review marker only, not an executable skip/build gate;
- docs/governance-only final candidate: still requires exact-head Public PR CI; its Vercel gate runs only the static provider build;
- docs/governance-only `main`: ignored as non-deploy-relevant, so an `AGENTS.md`/`docs/agents/**`-only merge cannot publish a new Production website.

Persistent final-gate identity is anchored to live `main`, not to the previous gate deployment. Before moving `ci/vercel-gate-final`, the request helper proves exact-head `public-ci-gate=success` and pins `ci/vercel-gate-base` to current `main`. Strict branch protection still handles base drift: an out-of-date PR must refresh and obtain fresh exact-head Public PR CI and Vercel results before merge.

## Vercel contract

- project: `basemodel-preview`
- production branch: `main`
- build: `npm run build`
- canonical project domain: `https://basemodel-preview.vercel.app`

Public GHA `ci-ui-gate.mjs` and the retained manual fallback paths share `scripts/vercel-ui-plan.ts`; skip/focused/full classification therefore has one owner. Shared/global/unknown changes fail closed to both complete canonical engine populations. Route-owned/content changes may use focused mapped coverage. Lab/server-relevant changes run the dedicated 6-case active-Lab gate in Public PR CI. `vercel-ui-gate.mjs` remains available as fallback/history-compatible tooling but is not part of the ordinary Vercel build command.


Vercel Preview is automatically non-indexable through `VERCEL_ENV=preview`. Production is intentionally access-protected and is also emitted as `noindex`; it still uses the stable project domain/canonical. The historical automatic-Production rule required `main` enabled; the quota-aware target explicitly disables only automatic Git `main` deploys without removing manual Vercel deployment or its existing Production.

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
-> verify the Production deployment SHA/status through Vercel
-> when page-level confirmation is needed, use authenticated access; do not treat an anonymous login page as product evidence
```

The fast human-review Preview is a viewing convenience only. It may prove that the built page is inspectable, but it cannot prove merge readiness, exact-head acceptance, current-base freshness, or Production behavior. A READY historical/review Preview is not current merge evidence. A green historical CircleCI run is not current merge evidence.

## Public-source boundary

Provider authentication, bearer tokens, share/access query parameters, account IDs and opaque project/team IDs are not repository documentation. Keep them in provider-side configuration or ephemeral tool output. A temporary Preview share URL must never be committed or persisted in a GitHub PR/Issue body or comment.

## Legacy hosting — not ordinary workflow

Historical Cloudflare deployment snapshots, Pages helpers, Workers shadow-build paths, and the retired Production-smoke implementation remain migration/fallback/history residue and are not ordinary deployment authority. No Cloudflare surface actively monitors private Production.

Only load or mention legacy hosting when:

- the task explicitly concerns retirement, redirect or rollback;
- the legacy surface is changed; or
- live evidence shows unexpected provider activity.

A still-required skip prefix is a silent compatibility safeguard until the external integration is disabled. It is not an ordinary release stage or completion-report item.


### Scientific figure cloud evidence lane

`cloud-figure-visual-review.yml` is now a manual entrypoint. Explicit full review calls the same Public reusable graph with `force_full`; there is no second automatic PR build or duplicated browser matrix. A separately named, bounded performance pilot records diagnostic evidence and never produces merge-gate artifact names or substitutes for full acceptance.

Scientific figure acceptance lives in Public's Chromium 4 / WebKit 8 duration-balanced selections, one worker per shard and no retry. It preserves the complete canonical population, six width/theme capture states, applicable grayscale/print images, scientific table hashes, and two original default-reading width checks before expanded capture. The two stable `cloud-figure-{browser}` checks require every allocated shard, verify exact population/source and upload/download round-trip bytes. The verifier binds the expected shard total as well as source and engine; a missing eighth WebKit shard cannot pass as an old four-shard run.

Raw screenshots and failure videos/traces retain three days, or seven for semantic typography branches. The `typography-full-webkit-gate` alias consumes the exhaustive unified population rather than rerunning it. An intentional skip/focused plan still requires successful planning/deterministic validation and an unallocated full matrix. Artifact integrity remains separate from independent visual and reader acceptance.
