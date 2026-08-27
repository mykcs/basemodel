# Latest Agent handoff

Last updated: **2026-08-27**

Status: **The SEED × OpenEvo Results release is being refreshed to the completed source-faithful Track A measurement before exact-head Vercel acceptance. Track A is closed as `measurement-not-proven-stable-improvement`, with 128/128 runtime semantic validation PASS and the raw 256-episode evidence package `PUBLISHED_AND_VERIFIED`. The active program router is now WB1 Track B, currently fail-closed at `GEN28_COMPLETE_STATE_BARRIER_MISSING`.**

This file is a short current-state router. Detailed policy belongs under `docs/agents/current/`; historical rationale belongs under `docs/agents/history/`.

## Current architecture

```text
GitHub `mykcs/basemodel`          = website source of truth
deployment-eligible non-main PR  -> Vercel Preview
main                              -> Vercel Production
Production                        -> https://basemodel-preview.vercel.app

mykcs/openevo-experiment         = scientific experiment/result authority
```

Current branch eligibility is executable policy in `vercel.json`; `research/**` is deployment-eligible. Vercel remains the ordinary deployment provider. Vercel is the only ordinary deployment authority. GitHub Actions / Pages are not ordinary deployment proof, and a skipped or ignored provider build is not a PASS.

The current hosting owner is `current/hosting-architecture.md`; the current release/deployment owner is `current/deployment-policy.md`. Cloudflare material is legacy rollback/provider-specific tooling only and stays outside ordinary deployment reporting.

The hosted Vercel Chromium layer is now **risk-aware on Production**: shared/global UI or uncertain Git-range changes fail closed to the complete matrix, concrete local Astro pages get exact changed-route browser smoke plus mapped regression owners, content-only changes get representative safety coverage, and non-UI changes may skip only the browser layer after `verify:deploy` and the static build pass. This does not weaken the mandatory pre-provider UI policy in `current/ui-change-visual-acceptance-gate.md`. The full hosted matrix remains serial; a live two-worker trial on the current 2-core Hobby machine did not materially shorten the critical path.

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

Latest checked program authority is `mykcs/openevo-experiment@17e3ca9dde62d0c6d08c5c9f644c8c6de36fc46d`.

Current WB1 state:

- campaign: `20260821-2341-wb1-seed-aligned-webshop-benchmark`;
- classification: `GEN28_COMPLETE_STATE_BARRIER_MISSING`;
- Gen28 episodes: `128/128` valid, `2` exact successes, mean Task Score×100 `2.8646`;
- `state-v28` is absent;
- latest adoptable native state remains `state-v27`;
- `formal_task_consumption_allowed=false`;
- `gpu_allocation_allowed=false`;
- final test remains locked and final unlock is not allowed.

Current next gate is a scientific/governance decision on whether the missing state-v28 update should ever be separately authorized, under what frozen inputs, and with what budget accounting. Under current authority, do not backfill state-v28, start Gen29, allocate GPU, or unlock final.

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
- current WB1 `GEN28_COMPLETE_STATE_BARRIER_MISSING` no-execution state.

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
