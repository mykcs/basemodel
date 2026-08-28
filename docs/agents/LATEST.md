# Latest Agent handoff

Last updated: **2026-08-28**

Status: **The SEED × OpenEvo Results route is aligned to the closed Track A paired measurement and the adopted WB1 Gen28 state-v28 boundary. Track A remains `measurement-not-proven-stable-improvement`; WB1 is `GEN28_STATE_V28_BARRIER_PASS_ADOPTED` at 3,584/20,640 counted episodes with 17,056 remaining, while Gen29/GPU/formal-task/final authority remains locked.**

This file is a short current-state router. Detailed policy belongs under `docs/agents/current/`; historical rationale belongs under `docs/agents/history/`.

## Current architecture

```text
GitHub `mykcs/basemodel`          = website source of truth
deployment-eligible non-main PR + exact-head `[vercel-preview]` -> Vercel Preview build
main                              -> Vercel Production
Production                        -> https://basemodel-preview.vercel.app

mykcs/openevo-experiment         = scientific experiment/result authority
```

Current branch eligibility is executable policy in `vercel.json`; `research/**` is deployment-eligible. Preview build spend is a second explicit gate: `scripts/vercel-ignore-build.mjs` requires `[vercel-preview]` in the exact-head Preview commit message, so eligible intermediate pushes are ignored before the site build; `main` Production is unaffected. Vercel remains the ordinary deployment provider and the only ordinary deployment authority. GitHub Actions is active only as a repository-scoped **self-hosted CI control plane**; GitHub-hosted runners and GitHub Pages are not part of this architecture.

The current hosting owner is `current/hosting-architecture.md`; the current release/deployment owner is `current/deployment-policy.md`. Historical Cloudflare deployment paths remain rollback/provider-specific tooling, while `cloudflare/production-smoke/` is the active monitoring-only exception and never deploys the site.

Browser-heavy acceptance now runs **before merge on the repository-scoped self-hosted runner**. `scripts/ci-ui-gate.mjs` reuses the existing `vercel-ui-plan.ts` skip/focused/full policy, keeps Playwright at one worker by default, adds the 12-case Lab gate only for Lab/server-relevant diffs, and leaves Vercel Production with `verify:deploy + astro build` only. Cloudflare production-smoke independently checks the real Production origin every 30 minutes for HTTP, canonical, robots, sitemap and redirect health.

## Current research state

### Historical repaired PRIMARY-v2

The 2026-08-25 repaired measurement on the historical frozen SEED-compatible panel remains unchanged:

- BASE: Task Score×100 `4.1`, exact success `0.0%`;
- frozen OpenEvo SD-LoRA: `7.3`, exact success `2.3%`;
- paired delta `+3.15`;
- bootstrap 95% CI `[-0.65,+7.19]`.

The CI crosses zero, so this is a positive direction, not a stable win. The panel is SEED-compatible, not the paper-final exact 128 and not the later source-faithful first-validation panel.

PRIMARY-v1’s 0/0 result remains **measurement-invalid**, caused by the action-wrapper / released-SEED parser incompatibility. Do not reinterpret it as zero capability.

### Source-faithful Track A — closed

The current immutable publication snapshot is `mykcs/openevo-experiment@f80ae1816384bb7e8e82d193b22644e17f561f19`, refreshed against later `main@17e3ca9dde62d0c6d08c5c9f644c8c6de36fc46d`.

The first source-faithful reconstruction was superseded after the pinned SEED `SimServer.__init__` second `random.seed(worker_seed)` before goal shuffle was found to be missing from the first builder. The corrected panel was rematerialized and then passed the authoritative runtime semantic gate:

- total slots `128`;
- matches `128`;
- mismatches `0`;
- match rate `1.0`.

The completed paired measurement on the corrected source-derived first-validation semantic panel is:

| Metric | BASE | frozen OpenEvo SD-LoRA | Paired contrast |
|---|---:|---:|---:|
| Mean Task Score ×100 | 7.17 | 8.74 | +1.57, 95% CI [-3.21,+6.31] |
| Exact success | 5/128 = 3.9% | 5/128 = 3.9% | 0.0 pp |

Both arms are `128/128` valid, reconciliation is `ok=true`, and parser-invalid count is `0`. The Task Score interval crosses zero, so the supported interpretation is **`measurement-not-proven-stable-improvement`**.

The evidence package is `PUBLISHED_AND_VERIFIED`: 256 raw episodes plus reconciliation, analysis, conclusion, release/readiness, GPU, W&B, executed semantic-panel, deterministic-rebuild, and per-cell receipts were transferred byte-for-byte and verified by per-file SHA-256 (`274` files, mismatch `0`, missing `0`).

Preserve the governance exception: the scientific contract was frozen and readiness passed before formal task consumption, but GitHub branch authority and the `main` router did not precede the first formal episode. This is an authorization-ordering deviation, not evidence that the scientific contract changed, and must not be rewritten as prior `main` launch authorization.

This Track A panel still must **not** be called the exact paper-final 128 behind SEED 89.7 / 78.1%, and the SEED paper checkpoint / reported numbers were not locally reproduced.

### Track B / WB1 — current program line

Immutable adoption authority: `mykcs/openevo-experiment@c2791000a3af97190c264ba5ea39f0c4e5f65823`.

Current WB1 state:

- campaign: `20260821-2341-wb1-seed-aligned-webshop-benchmark`;
- classification: `GEN28_STATE_V28_BARRIER_PASS_ADOPTED`;
- Gen28 episodes: `128/128` valid, `2` exact successes, mean Task Score×100 `2.8646`;
- latest native state: `state-v28`;
- counted matched experience: `3,584 / 20,640`; remaining: `17,056`;
- Amendment 006 repair is complete and exactly-once consumed;
- `formal_task_consumption_allowed=false`;
- `gpu_allocation_allowed=false`;
- Gen29 is not authorized;
- final test remains locked.

The next gate is a separate Gen29 execution-readiness / resumption decision under the frozen Track B contract. Do not rerun the Gen28 repair, start Gen29, allocate GPU, consume new tasks, or unlock final under current authority.

Track A and Track B answer different questions. Track A validates one released-code-recoverable first-validation task semantic panel and measures frozen BASE vs frozen SD-LoRA on it. Track B is the matched method comparison that reruns SEED and OpenEvo under one frozen world and matched budgets.

## Current BaseModel Results state

The Results route keeps the seven-question reader path, claim-local provenance, and the collapsed technical action-wrapper trace. The current publication refresh must visibly reflect:

- Track A semantic validation `128/128 PASS`;
- Track A paired result `7.17` vs `8.74`, both `3.9%` exact success;
- paired Task Score delta `+1.57`, 95% CI `[-3.21,+6.31]`;
- no stable win claim;
- evidence package `PUBLISHED_AND_VERIFIED`;
- paper-final exact-128 / paper-checkpoint boundary;
- governance ordering exception in technical provenance;
- current WB1 `GEN28_STATE_V28_BARRIER_PASS_ADOPTED` state-v28 boundary, with Gen29 still no-execution.

For non-trivial Results edits, read:

1. `current/scientific-state-provenance.md`
2. `current/experiment-result-publication-workflow.md`
3. `current/seed-openevo-results-reader-contract.md`
4. `current/seed-openevo-results-current-state-2026-08-26.md`
5. `current/research-explainer-page-standard.md`
6. `current/audience-centered-technical-copy.md`

Then refresh `mykcs/openevo-experiment` before using words such as current, running, completed, released, next, or authorized.

## Current release / acceptance rules

Keep these boundaries separate:

```text
source synchronization
!= repository Gate/build success
!= exact-head Preview READY
!= changed-route browser acceptance
!= merge
!= Production acceptance
```

For ordinary deployable changes, the Vercel build command must actually execute:

```bash
npm run verify:deploy
npm run build
node scripts/vercel-ui-gate.mjs
node scripts/vercel-lab-browser-gate.mjs
```

`SKIPPED`, ignored, canceled, stale-head, or rate-limited execution is not `PASS`.

For the Results release, require exact-head Preview metadata and zh/en browser acceptance on the changed routes before merging. After merge, require a READY Production successor on `main` and verify the public zh/en routes.

For Production browser scope, read `current/deployment-policy.md` and `scripts/vercel-ui-plan.ts`; never infer that a focused or skipped hosted browser layer weakens the pre-provider acceptance requirement. Uncertain scope must fail closed to the complete hosted matrix.

## Provider wait discipline

Provider latency is not productive Agent work. Do not spend minutes in repeated `sleep -> poll Vercel -> sleep -> poll logs` loops when a deployment is visibly progressing and there is no actionable failure.

Default behavior after a provider-triggering ref update:

1. Record the exact head SHA and deployment ID/URL.
2. Do one immediate provider-state read and, when useful, one short tail/error log read to prove that the build started and is not already failing.
3. If the deployment is still `BUILDING` with active progress and no actionable failure, make at most one short recheck after roughly 30–60 seconds. Do **not** schedule multi-minute conversational sleeps merely to wait for Vercel.
4. While the provider runs, continue only independent work that cannot retrigger or invalidate the same deployment. Do not manufacture source changes just to stay busy.
5. If no independent work remains, stop active polling and return a compact resume checkpoint: exact SHA, deployment ID/URL, current phase, last meaningful log timestamp, and the next acceptance action once the deployment becomes terminal.
6. On the next user turn or explicit monitoring run, resume from that checkpoint. Query the deployment object first; read only `errorsOnly` or the log tail needed for the current phase instead of rescanning full build logs.
7. Repeated fast polling is justified only when the provider is already near a terminal transition, when an actionable failure is suspected, or when the owner explicitly asks to wait synchronously.

The goal is to separate **provider completion latency** from **Agent reasoning time**. A long Vercel build may still be correct for a high-risk change, but the Agent should not occupy the whole build duration babysitting it.

## Repository-write hygiene

Shared GitHub/provider state is not scratch space.

- use reads/searches for discovery;
- never create probe files/comments/commits to test capability;
- batch intended changes before the first provider-triggering branch update;
- prefer one atomic blob/tree/commit/ref update for coherent multi-file changes;
- never create empty/no-op commits solely to wake Vercel;
- if provider state blocks release, report the blocker instead of manufacturing source changes.

## Agent reading model

```text
/AGENTS.md
-> this handoff
-> current/project-agent-operating-principles.md
-> current/branch-and-pr-conventions.md
-> current/website-engineering-standard.md
-> current/scenario-trigger-registry.md
-> one matched task bundle from docs/agents/README.md
-> executable source/config/tests/live provider or experiment truth
```

History is evidence, not current authority. The reusable Results/Vercel/source-faithful cases remain under `docs/agents/history/`; always rerun fresh diagnostics before acting on a similar symptom.
