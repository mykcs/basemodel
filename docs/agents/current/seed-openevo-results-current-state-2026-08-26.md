# SEED × OpenEvo Results current-state addendum — refreshed 2026-08-27

This file is the narrow latest-state override for the Results route.

Read it together with `seed-openevo-results-reader-contract.md`. Where the older reader-contract snapshot says the source-faithful successor is `executing-formal-run`, `PREPARED`, or still awaiting 128/128 runtime semantic validation, **this file is newer and wins**.

## Current Track A state

Source-faithful Track A is now scientifically closed as a **valid paired measurement that does not establish a stable improvement**.

The latest immutable closeout snapshot used by Results is `mykcs/openevo-experiment@f80ae1816384bb7e8e82d193b22644e17f561f19`. A freshness check through `mykcs/openevo-experiment/main@17e3ca9dde62d0c6d08c5c9f644c8c6de36fc46d` shows later work has moved program routing to WB1 Track B; it does not supersede the Track A closeout numbers below.

The corrected source-faithful panel lineage is:

- the first reconstruction was superseded because the builder omitted pinned SEED `SimServer.__init__` re-seeding Python `random` with `worker_seed` after synthetic-goal construction and before `random.shuffle(self.goals)`;
- the corrected panel was rematerialized;
- authoritative runtime semantic validation reports `total_slots=128`, `matches=128`, `mismatches=0`, `match_rate=1.0`;
- the executed semantic panel and corrected mainline panel share selected-panel digest `4e7ace9224e3f7311bdda00e726291545269bd0afcda751e83b4194b9a4d5854`.

The completed paired measurement is:

- BASE: `128/128` valid episodes, mean Task Score×100 `7.17`, exact success `5/128 = 3.9%`;
- frozen OpenEvo SD-LoRA: `128/128` valid episodes, mean Task Score×100 `8.74`, exact success `5/128 = 3.9%`;
- paired Task Score delta: `+1.57`;
- paired bootstrap: 10,000 rounds, seed `20260826`, 95% CI `[-3.21, +6.31]`;
- positive / tie / negative paired task counts: `10 / 112 / 6`;
- parser-invalid total: `0`;
- paired exact-success delta: `0.0` percentage points; no exact-success bootstrap CI was computed.

The Task Score interval crosses zero. Therefore the correct interpretation is:

> **measurement-not-proven-stable-improvement**

Do not promote this to a stable OpenEvo win.

## Artifact publication and provenance

Track A artifact publication is now `PUBLISHED_AND_VERIFIED`.

The closeout records:

- 256 raw episode JSON files transferred byte-for-byte;
- server-generated reconciliation, analysis, conclusion, execution-release receipt, GPU accounting, W&B receipts, executed semantic-panel manifest, deterministic rebuild receipt, and per-cell summaries committed under the evidence package;
- `EVIDENCE_MANIFEST.json` verifies 274 files / 18,920,039 bytes with per-file SHA-256;
- verification result `PASS`, `mismatch_count=0`, `missing_count=0`.

One governance exception must stay visible in technical provenance:

- the scientific contract was frozen and readiness passed before formal task consumption;
- but GitHub branch authority and the `main` router did **not** precede the first formal episode;
- this is a control-plane authorization-ordering deviation, not evidence that the scientific contract changed during the run;
- do not rewrite the historical launch as if `main` had already authorized it.

## What Results may say now

Allowed visible summary:

> The corrected source-faithful 128-task panel passed 128/128 runtime semantic validation and the paired BASE-vs-frozen-SD measurement is complete. BASE scored 7.17 / 3.9% exact success; SD-LoRA scored 8.74 / 3.9%. The paired Task Score difference is +1.57 with 95% CI [-3.21,+6.31], so the result does not establish a stable improvement.

Allowed technical summary:

> Track A: semantic validation 128/128 PASS; 256/256 valid paired episodes; parser-invalid=0; artifact evidence PUBLISHED_AND_VERIFIED; interpretation=measurement-not-proven-stable-improvement; governance ordering exception preserved.

## What Results must not say

Do not say:

- Track A is still waiting for 128/128 runtime semantic validation;
- Track A is still `PREPARED` or still waiting for its paired BASE-vs-SD run;
- OpenEvo has a stable held-out WebShop win;
- the source-faithful first-validation 128 tasks are the paper-final exact 128 behind 89.7 / 78.1%;
- the SEED paper checkpoint or paper-reported 89.7 / 78.1 numbers were locally reproduced;
- GitHub `main` had launch authority before the first Track A formal episode;
- the historical repaired PRIMARY-v2 result has changed.

## Historical repaired PRIMARY-v2 remains unchanged

The 2026-08-25 repaired PRIMARY-v2 result on the historical frozen SEED-compatible panel remains:

- BASE task score 4.1 / exact success 0.0%;
- frozen OpenEvo SD-LoRA task score 7.3 / exact success 2.3%;
- paired mean delta +3.15 score×100;
- bootstrap 95% CI `[-0.65, +7.19]`;
- interval crosses zero, so no stable win is claimed.

Track A is a newer and more source-faithful task-semantic measurement, not a rewrite of those historical numbers.

## Current Track B / WB1 state

The latest program router at `mykcs/openevo-experiment@17e3ca9dde62d0c6d08c5c9f644c8c6de36fc46d` is now WB1 Track B.

Current authority reports:

- campaign `20260821-2341-wb1-seed-aligned-webshop-benchmark`;
- track `Track B - Fair Matched Benchmark`;
- classification `GEN28_COMPLETE_STATE_BARRIER_MISSING`;
- Gen28 episode completion `128/128-valid-exit-0`;
- Gen28 exact successes `2`;
- Gen28 mean Task Score×100 `2.8646`;
- `state-v28` does not exist;
- latest adoptable native state remains `state-v27`;
- `formal_task_consumption_allowed=false`;
- `gpu_allocation_allowed=false`;
- `final_test_status=locked` and final unlock is not allowed.

Current `next_gate` is a scientific/governance decision on whether the missing state-v28 update should ever be separately authorized, and under what frozen inputs and accounting. Under current authority, do **not** backfill state-v28, start Gen29, allocate GPU, or unlock final.

This Track B state answers a different question from Track A and must not be conflated with the completed source-faithful paired measurement.

## Primary upstream references

Use immutable links at `f80ae1816384bb7e8e82d193b22644e17f561f19` for the closed Track A state:

- `docs/evidence/seed-webshop-public-code-reproduction-v1/CLOSEOUT.json`
- `docs/evidence/seed-webshop-public-code-reproduction-v1/CLOSEOUT.md`
- `docs/evidence/seed-webshop-public-code-reproduction-v1/EVIDENCE_MANIFEST.json`
- `docs/evidence/seed-webshop-public-code-reproduction-v1/GOVERNANCE_EXCEPTION.json`
- `configs/experiment/receipts/webshop-seed-source-faithful-reproduction-v1-semantic-validation.json`
- `configs/experiment/manifests/webshop-seed-source-faithful-reproduction-v1-panel-v1.json`

Use immutable `17e3ca9dde62d0c6d08c5c9f644c8c6de36fc46d/configs/experiment/current-campaign.json` for the publication-time WB1 current state.

Before using words such as `current`, `running`, `released`, `completed`, `next`, or `authorized` in a later edit, refresh upstream again because WB1 state can move independently of this publication snapshot.
