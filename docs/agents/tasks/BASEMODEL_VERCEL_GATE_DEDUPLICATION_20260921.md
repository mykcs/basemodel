# BaseModel Vercel gate de-duplication — 2026-09-21

Status: **ADOPTED / Production verified**
Owner goal: reduce merge-ready and Production deployment latency without weakening exact-head/current-base acceptance.

## Correction-to-action witness

`trigger -> current owner -> checked artifact -> allowed next action -> invalidation cue`

- trigger: owner observed ~5–10 minute Vercel builds after the same candidate had already passed Public PR CI -> owner: BaseModel CI/release architecture -> checked: `main@54e99ac0f66dec548cbeb8b9e5b1dd8c98720479`, live branch protection, `vercel.json`, `.github/workflows/public-pr-ci.yml`, current deployment policy, PR #763 CI and Vercel receipts -> allowed: make Public PR CI an explicit required check and narrow Vercel to provider build/deploy acceptance -> invalidate if `main`, required-check configuration, workflow job names, or provider ownership moves.
- trigger: prior release work already established that merge calls must not be used as probes for missing checks -> owner: release-closeout protocol -> checked: the pre-cutover live required context was only `Vercel`; `public-ci-gate` is GitHub Actions App id 15368 -> allowed: qualify the replacement exact-head check before touching branch protection -> execution correction: before merge, the sequence was tightened to require **both** checks so there was no window with provider-only acceptance.
- trigger: CI performance change -> owner: website engineering standard §6.2 -> checked: no overlapping open CI-performance PR -> allowed: hold test identities/thresholds/retries unchanged and measure end-to-end hosted wall time -> invalidate if the optimization changes test population, assertions, retry semantics, or provider machine class.
- trigger: `main` advanced during implementation via #764 -> owner: current `main@dd55d07df6a800bd5913c935d040e3e091fdad29` -> checked: #764 only adds the GitHub-mapped-author guard in `scripts/request-vercel-final-gate.mjs` -> allowed: rebase and preserve that guard before the new `public-ci-gate` guard -> invalidate if main moves or the helper changes again before push/merge.

## Frozen control

Control source: `main@54e99ac0f66dec548cbeb8b9e5b1dd8c98720479`.

Recent full-risk candidate #763:
- Public PR CI run `35585107961`: 09:46:01Z → 09:49:46Z = **225 s** workflow wall; deterministic job 108 s; slowest browser job 188 s; all required test identities passed once with retries unchanged.
- exact-head Vercel final-gate deployment `dpl_AQGc7QDPoUePt5Um75kr6ceaogLN`: build 09:01:33.545Z → READY 09:10:01.275Z = **507.7 s**.
- merged Production deployment `dpl_CCdJGewhMSkFhVR263a852jR69Pj`: build 09:11:11.012Z → READY 09:21:44.351Z = **633.3 s**.
- live `main` branch protection: strict current-base; required status **Vercel** only.
- Vercel build command currently repeats `verify:deploy`, static build, hosted Chromium gate, and Lab gate after Public PR CI has already run deterministic + risk-based browser acceptance.

## Causal question

Can BaseModel remove the duplicate deterministic/browser execution from Vercel while preserving exactly the same deterministic tests, browser identities, thresholds, retries, current-base semantics, and provider deployment proof?

## Treatment

1. Keep Public PR CI's existing test population unchanged.
2. Promote `public-ci-gate` to a required branch-protection check alongside `Vercel`.
3. Before moving the persistent final-gate ref, `request-vercel-final-gate.mjs` must prove that the exact current PR head has a successful GitHub Actions `public-ci-gate` check from the expected GitHub Actions App.
4. Narrow Vercel build command to the static production build. Vercel remains responsible for exact-SHA provider build/deploy success and Production publication, but no longer reruns repository-wide deterministic/browser acceptance already owned by the required Public PR CI check.
5. Keep `verify:deploy` provider-neutral and unchanged for Public PR CI, local/full validation, Cloudflare fallback, and manual recovery.

## Acceptance invariants

Unchanged:
- canonical Vitest population;
- canonical risk-planned Chromium population;
- one worker per browser shard;
- retries = 0;
- Lab acceptance still runs in Public PR CI when the shared planner classifies it relevant;
- unknown/global/CI-owner changes still fail closed to full browser scope;
- Vercel still binds to the exact accepted SHA and must reach READY;
- strict current-base branch protection remains enabled.

New fail-closed invariant:
- final Vercel gate cannot be requested unless the exact PR head already has `public-ci-gate=success` from GitHub Actions.

## Benchmark protocol

Qualification candidate is this CI-infrastructure PR, which is itself full-risk. No test-selection changes are permitted.

Primary metrics:
- Public PR CI wall time;
- exact-head Vercel BUILDING → READY wall time;
- merge-to-Production BUILDING → READY wall time;
- sequential merge-ready critical path = Public PR CI + exact-head Vercel gate.

Meaningful improvement rule:
- exact-head Vercel BUILDING → READY must improve by **at least 50%** versus 507.7 s;
- Production BUILDING → READY should improve by **at least 50%** versus 633.3 s;
- all existing correctness gates stay green with zero test-identity loss.

Theoretical upside:
- eliminating duplicated deterministic/browser work can remove most of the 8–10 minute provider phase; dependency install + Astro static build/audits remain.

## Rollout order

- [x] implement script/config/test/doc changes locally;
- [x] local deterministic tests and build pass;
- [x] push one coherent PR and let existing Public PR CI qualify the unchanged acceptance population;
- [x] request exact-head Vercel final gate only after `public-ci-gate` is green;
- [x] record exact-head Vercel duration and compare with 507.7 s control;
- [x] if exact-head correctness is green and the primary Vercel latency rule passes, update live `main` branch protection **before merge** to require both `public-ci-gate` (GitHub Actions app 15368) and `Vercel` (app 8329); keep strict current-base semantics and preserve all unrelated protection;
- [x] read branch protection back and prove strict mode + both exact contexts; this prevents any no-full-acceptance window during the cutover;
- [x] merge only under the new dual-required authority;
- [x] wait for merged Production READY and record duration vs 633.3 s control;
- [x] update current CI/deployment docs with the adopted architecture and measured result.

## Qualification result — 2026-09-21

The treatment passed the preregistered correctness and latency gates without changing the canonical test population, retries, assertions, or provider machine class.

- qualification PR: **#766**, exact head `e15b12d0b40748cf16bd5b840432661d3b394db2`;
- Public PR CI: run `35592314462`, **SUCCESS**; deterministic job + all eight full-risk browser shards + `public-ci-gate` passed;
- exact-head Vercel gate: `dpl_7vAr4GGQDpG8svgNwstRZ6LuSt4C`, BUILDING `1789989138242` → READY `1789989152412` = **14.170 s**;
- exact-head control: **507.7 s**; reduction = **97.209%**, about **35.83×** faster;
- live branch protection was switched before merge and read back as `strict=true` with `Vercel` app 8329 + `public-ci-gate` app 15368 both required;
- squash merge: `d747a658008566e8ba82df50d5dc35fb87e53534`;
- Production: `dpl_Ha13aXCxbRwnzuDQiJxVX6yN5RSB`, BUILDING `1789989314296` → READY `1789989330904` = **16.608 s**;
- Production control: **633.3 s**; reduction = **97.378%**, about **38.13×** faster;
- stable Production route `/development/` was browser-opened successfully and its rendered HTML contains `public-ci-gate`, “代码与浏览器验收”, and “真实供应商构建”.

Interpretation: the bottleneck was duplicated acceptance work inside Vercel, not Astro's static build or the Standard 4 vCPU / 8 GB machine. The build-machine tier therefore remains unchanged; no progressive rollout feature was needed.

## Stop rule

If Vercel latency does not improve materially, or if making Public PR CI required cannot be proven reliably on exact heads, do not keep the de-duplication architecture merely because it is conceptually cleaner. Restore the previous Vercel full acceptance path.
