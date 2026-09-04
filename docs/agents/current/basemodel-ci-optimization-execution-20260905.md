# Basemodel CI Optimization — executable implementation checklist

Status: **IN PROGRESS**

Owner: repository CI architecture

Execution branch: `ci/route-owned-browser-planner-20260905`

Primary PR: `#433`

Scope start: 2026-09-05 (UTC+8)

## 0. Completion definition

This checklist is COMPLETE only when every required checkbox below is `[x]` and the final `main` receipt is recorded.

Primary target:
- preserve the existing deterministic/build/browser acceptance semantics;
- stop Draft PR iteration from consuming the heavy Mac browser runner;
- make provably route-owned UI changes use focused browser coverage;
- preserve fail-closed `full` behavior for unknown/shared/global UI ownership;
- restructure the longest full-browser test so later cloud sharding is mechanically safe;
- prove the common route-owned path with historical replay + real wall-clock measurement.

Target wall clock for a route-owned merge-ready PR: **5–7 min blocking CI**, versus the observed ~23–26 min historical full path.
## 1. Hard safety boundaries

- [x] Do not change website copy, scientific results, research semantics, routes, or production hosting behavior.
- [x] Do not weaken unknown/shared/global UI changes: they must remain `full`.
- [x] Do not adopt `PLAYWRIGHT_WORKERS=2` on the Mac merely because it is faster elsewhere; Mac-specific proof is required.
- [x] Do not leave temporary benchmark workflows in the final branch.
- [x] Do not use Vercel production/preview builds as generic CI benchmarking compute.
- [x] Do not touch GPU/Ray/experiment servers.
- [x] Keep `persist-credentials: false` in repository checkout.

Provider migration is deliberately **out of scope for this PR**. Cloudflare/CircleCI/Blacksmith selection, required-check authority migration, and retiring `basemodel-ci-runner` become a separate change after this optimization is merged and measured.

## 2. Frozen empirical baseline

- [x] Record successful full-CI baseline: median total ≈ **25.1 min**.
- [x] Record browser-stage median ≈ **19.8 min**.
- [x] Record pre-browser deterministic/build median ≈ **4.6 min**.
- [x] Record historical PR #430: active CI ≈ **26.0 min**, browser ≈ **21.1 min**.
- [x] Record historical PR #426: active CI ≈ **22.9 min**, browser ≈ **15.5 min**.
- [x] Record existing Mac runner envelope: **4 CPU / 4 GiB RAM**.

Evidence owner: `docs/agents/current/basemodel-ci-optimization-20260905.md`.
## 3. Route-ownership planner implementation

Files:
- `scripts/vercel-ui-plan.ts`
- `src/lib/vercelHostedUiGate.test.ts`

Required implementation:
- [x] Replace the explainer-only special case with a generic explicit `ROUTE_OWNERS` map.
- [x] Register `src/components/research/Lyg2171ServerOverview.astro` as owning only:
  - `/research/seed-openevo/flow/server/`
  - `/en/research/seed-openevo/flow/server/`
- [x] Permit companion files only when the existing UI classifier proves `risk=none`, or when they are explicit regression companions.
- [x] Permit concrete `src/pages/*.astro` routes to join the same bounded ownership set.
- [x] Keep max changed-route smoke bound at `MAX_CHANGED_ROUTE_SMOKE=8`.
- [x] If any file cannot be proven bounded, return `full`.
- [x] If a bounded owner is mixed with an unrelated shared component, return `full`.

PASS standard: all route-owned positive cases are `focused`; every unknown/shared/global negative case remains `full`.
## 4. Focused changed-route smoke correctness

Files:
- `tests/e2e/vercel-changed-route-smoke.spec.ts`

Required implementation:
- [x] Use the repository's canonical `#main-content` container instead of generic `locator('main')`.
- [x] Keep route HTTP success assertion.
- [x] Keep light/dark theme assertion.
- [x] Keep visible H1 assertion.
- [x] Keep non-empty meta description assertion.
- [x] Keep document/body horizontal-overflow assertions.
- [x] Keep mobile/desktop × light/dark matrix for each changed route.

PASS standard: Server route smoke is 8/8 PASS for 2 bilingual routes × 4 presentation states, with no website markup/CSS change made solely to satisfy the test.

## 5. Draft iteration suppression

File:
- `.github/workflows/self-hosted-ci.yml`

Required implementation:
- [x] Heavy `validate` job must not run for Draft PRs.
- [x] `ready_for_review` remains in the PR trigger list.
- [x] Pushes after a PR becomes Ready still trigger current merge-ready CI behavior.
- [x] `workflow_dispatch` remains available.

Observed receipt:
- [x] PR #433 Draft head `219b53a542b03c36314663ccf1038d4e795fe7af` produced `basemodel-self-hosted = SKIPPED`.

PASS standard: Draft development commits consume zero basemodel self-hosted browser-runner time.
## 6. Historical replay proof

File:
- `src/lib/vercelHostedUiGate.test.ts`

Required replay fixtures:
- [x] PR #430 exact changed files must classify `focused` with exactly the zh/en server routes.
- [x] PR #426 exact changed files, including docs + `AGENTS.md` + server pages, must classify `focused` with exactly the zh/en server routes.
- [x] Add a negative replay where the server owner plus unrelated shared component classifies `full`.

Local targeted validation:
- [x] `vercelHostedUiGate.test.ts` + `hostingArchitecture.test.ts` = **17/17 PASS**.
- [x] `git diff --check` = PASS.

## 7. Focused wall-clock benchmark

One-off cloud benchmark rules:
- [x] Use GitHub-hosted Ubuntu only as temporary measurement compute.
- [x] Do not invoke Vercel.
- [x] Do not invoke the Mac self-hosted runner.
- [x] Delete the temporary workflow after measurement.

Successful receipt: run `33897594449`, job `101103791595`:
- [x] cold total = **66 s**;
- [x] `npm ci` = **13 s**;
- [x] 474-page build = **10 s**;
- [x] cold Chromium/dependency install = **25 s**;
- [x] focused browser = **9 s**, **8/8 PASS**.

Interpretation constraint: 66 s is not the complete blocking CI because it intentionally omitted the full deterministic `verify:deploy` suite. Expected complete route-owned path is ~**5–7 min** when combined with the measured ~4.6 min pre-browser baseline.
## 8. Sync to current authority before further edits

Current authority observed at checklist creation:
- `main = cfdaddfd3f0f8ce7ad05eb4258c0e707002ebbcc`
- #433 head before sync = `219b53a542b03c36314663ccf1038d4e795fe7af`
- main ruleset `main-pr-gate` requires PR-based integration and has no bypass actor.

Required steps:
- [x] Fetch latest `main` into the dedicated worktree.
- [x] Merge latest `main` into the #433 branch without force-push.
- [x] Resolve only genuine textual conflicts; do not overwrite newer server/research content. (Merge was conflict-free.)
- [x] Re-run targeted planner/architecture tests after sync: **17/17 PASS**.
- [x] Replay PR #426/#430 fixtures after sync: both remain `focused` on the two server routes.
- [x] Record the post-sync merge receipt: `f690d3eb3376c33c415c2ea1539d21f1e10be314` (before this checklist-update commit).

PASS standard: #433 contains current `main` plus CI-only changes, with no unrelated source drift.

## 9. Full-browser test granularity

Candidate source: PR #432. Adopt only the semantic-preserving test-structure part, not its unproven Mac worker-count change.

File:
- `tests/e2e/global-header-visibility.spec.ts`

Required implementation:
- [x] Split the long all-public-routes header sweep into 4 deterministic test cases.
- [x] Partition by stable route index modulo 4 through `partitionRoundRobin`.
- [x] Preserve every route, every viewport/theme state, and every existing assertion.
- [x] Assert every shard is non-empty.
- [x] Add regression contracts: `ciRouteSharding.test.ts` + deployment architecture assertions.
- [x] Keep canonical Mac `PLAYWRIGHT_WORKERS='1'`; no unproven Mac worker increase was adopted.

PASS standard: route union is identical to the pre-split set; duplicate route coverage = 0; omitted route coverage = 0.

Observed Section 9 receipt:
- sharding/planner/architecture tests: **38/38 PASS**;
- helper proof over 86 synthetic routes: **22/22/21/21**, unique union exact;
- Header Chromium discovery: **6 tests** (4 route shards + operability + 404);
- full Chromium UI discovery: **156 tests / 24 files**;
- canonical Mac worker count remains **1**.
## 10. Full-browser cloud sharding benchmark

Purpose: prove the restructured full suite is ready for a future cloud runner without changing the canonical provider in this PR.

Temporary benchmark design:
- [x] Create a branch-only temporary workflow; it was never added to `main`.
- [x] Use two independent GitHub-hosted Ubuntu jobs in parallel, each executing inside the canonical Debian 12 runtime container.
- [x] Each job uses exactly 1 Playwright worker.
- [x] Run shard `1/2` and `2/2` over the same canonical Chromium UI spec list.
- [x] Use exact Playwright `1.62.1` browser/runtime compatibility and canonical Debian 12 base.
- [x] Run a fresh 474-page static build independently in each shard before browser execution.
- [x] Record per-shard wall clock, total hosted runner minutes, test counts, failures, retries (0), and setup overhead.
- [x] Delete the temporary workflow after the receipt is captured.

Acceptance:
- [x] both shards PASS;
- [x] no retries convert failure to PASS (`retries=0`);
- [x] union of sharded tests equals the unsharded discovered test set: **156 = 78 + 78**, unique=156, duplicates=0;
- [x] full-browser wall clock = **5m51s**, materially below historical ~19.8 min and the ≤12 min target;
- [x] total temporary benchmark spend is recorded: successful full benchmark **10.7 runner-min**; all focused/full/diagnostic measurement runs combined **21.55 runner-min**.

If sharding fails, do not weaken assertions; fix test granularity or reject sharding.

Observed Section 10 receipt (successful run `33900586206`):
- exact candidate benchmark head: `b1ef43d92014ee1a6de744bfe485f4a5c31d8993`;
- shard 1 job `101113462772`: 78/78 PASS; UI 3m18s; Lab 12/12 PASS in 29s; total job 4m51s;
- shard 2 job `101113462996`: 78/78 PASS; UI 4m52s; total job 5m51s;
- both jobs launched at the same time, therefore blocking browser wall clock = **5m51s**;
- successful full benchmark runner consumption = **10.7 min**;
- all one-off optimization measurement runs combined = **21.55 hosted runner-min**;
- no retry, no Vercel build, and the Draft self-hosted job remained skipped.

A first native-Ubuntu benchmark exposed a rendering-environment mismatch in the canonical figure gate. Re-running the unchanged figure/test in the canonical Debian 12 + Playwright 1.62.1 runtime passed; the successful sharded benchmark therefore pins that runtime rather than weakening any geometry assertion.

## 11. Repository contract validation

Required commands on the final candidate:
- [x] `npx vitest run src/lib/vercelHostedUiGate.test.ts src/lib/hostingArchitecture.test.ts src/lib/deploymentArchitecture.test.ts src/lib/ciRouteSharding.test.ts` → **38/38 PASS**.
- [x] planner replay for PR #426 and #430 remains `focused` on exactly the two server routes.
- [x] unknown shared/global/mixed examples remain `full`.
- [x] `git diff --check` PASS.
- [x] no temporary workflow files remain.
- [x] diff contains no website content/science changes; candidate paths are CI/tests/docs only.

PASS standard: CI architecture tests encode the optimization and fail if Draft suppression, route ownership, canonical main selector, or full-test sharding regresses.

Observed Section 11 receipt:
- latest main synchronized before validation: `8c5fee55ff215d91e7c18a976c07b60d752ba22b`;
- post-sync candidate before this checklist commit: `751ee3b916d64f1a141a706a52c161c52fdb5d3a`;
- 38/38 targeted contract tests PASS in 268 ms;
- #426/#430 replay focused; unknown/global/mixed fail closed to full;
- temporary benchmark workflow absent;
- candidate diff contains no website/science content path changes.
## 12. PR readiness and merge gate

- [x] Update #433 body with final benchmark receipts and exact candidate SHA.
- [x] Confirm #433 base matches current `main` immediately before Ready.
- [x] Confirm no unresolved review thread.
- [x] Mark #433 Ready only after Sections 8–11 PASS.
- [x] Do not merge if the exact head changes after validation.
- [x] If the repository's existing self-hosted required/expected check cannot run because the Mac runner is unavailable, do not fake a PASS; keep the PR open and record the infrastructure blocker.
- [x] Merge with expected-head SHA only after the acceptance boundary is satisfied.

## 13. Post-merge receipt

After merge:
- [x] Record merge commit / new `main` SHA.
- [x] Verify the optimization files on exact `main`.
- [x] Verify no temporary benchmark workflow exists on `main`.
- [x] Verify Draft suppression remains encoded.
- [x] Verify route-owned server replay remains focused from `main`.
- [ ] Record any automatic post-merge CI run and its result; do not cancel a scientifically meaningful or release-critical check merely to improve timing numbers.
- [ ] Update this file `Status` to **COMPLETE** and append the closeout table below.

Observed Section 12/13 receipts so far:
- #433 final validated head: `1ebbcab675308c95783e5d4dde6f10c7d0c7a06c`; canonical required run `33901504296` PASS.
- #433 was merged with expected-head protection; squash/main commit: `9ba65cf02d588d9027a7de6716d08c2075ec9714`.
- exact `main` planner blob `df0be33c28ee9f0769b1829d5c3d0be1ae1677dd` and workflow blob `1d41d4d6bbe6dac8e43be598e48e91f2c6506fb2` match the validated candidate content.
- exact `main` contains only `.github/workflows/self-hosted-ci.yml`; the temporary benchmark workflow is absent.
- Draft suppression remains encoded and `ready_for_review` remains a trigger.
- exact-main-equivalent planner replay: server owner + safe companion → `focused` on exactly zh/en server routes; unknown shared/global examples → `full`.
- automatic post-merge main CI: run `33924493381` (result pending at this checkpoint).

## 14. Closeout table

| Item | Required final evidence | Result |
|---|---|---|
| Baseline | historical run timings | PASS — median total 25.1 min; browser 19.8 min; pre-browser 4.6 min |
| Route ownership | replay + negative fail-closed tests | PASS — server owner → focused two routes; unknown/global → full |
| Draft suppression | real Draft run skipped | PASS — Draft #433 heavy job SKIPPED |
| Focused browser | 8/8 + 66 s cold benchmark | PASS — 8/8; 66 s cold benchmark |
| Full granularity | 4-way header sweep, exact route union | PASS — 4 deterministic tests; no omitted/duplicate routes |
| Full cloud sharding | 2 shards × 1 worker, no retries | PASS — 78 + 78 = 156; 5m51s wall clock; retries=0 |
| Final candidate tests | targeted architecture suite + diff check | PASS — 38/38 + diff check + exact-head canonical CI |
| Main integration | exact merge SHA + post-merge verification | WAITING — post-merge run `33924493381` in progress |

Final rule: **performance is never allowed to redefine correctness.** Optimization changes scheduling and test selection only when ownership is explicitly provable; uncertainty remains full/fail-closed.