# SEED × OpenEvo Results current-state addendum — refreshed 2026-08-27

This file is the narrow latest-state override for the Results route.

Read it together with `seed-openevo-results-reader-contract.md`. Where the older reader-contract snapshot says the source-faithful successor is `executing-formal-run`, `PREPARED`, or still awaiting 128/128 runtime semantic validation, **this file is newer and wins**.

## Current Track A state

Source-faithful Track A is now scientifically closed as a **valid paired measurement that does not establish a stable improvement**.

The immutable scientific closeout snapshot is `mykcs/openevo-experiment@f80ae1816384bb7e8e82d193b22644e17f561f19`. A later read-only wrapper audit landed at `mykcs/openevo-experiment@e1229db492504bc9f7b795ca0a5184d5e1cadf1a`; it adds parser-attribution evidence without changing any Track A score.

**128/128 runtime semantic validation PASS.** The corrected source-faithful panel lineage is:

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

## Formal Track A wrapper audit

The completed Track A raw evidence now has a deterministic wrapper audit over all **256 episodes / 3,672 model-action steps**:

- strict `<action>` parse: **300** steps;
- recovered through the identical frozen v3 action-command compatibility projection: **3,253** steps;
- unrecoverable and therefore fail-closed as invalid environment actions: **119** steps;
- BASE unrecoverable fail-closed steps: **77**;
- SD-LoRA unrecoverable fail-closed steps: **42**;
- those 119 steps exactly equal the saved `invalid_action_steps` and environment-invalid-step totals;
- unknown / `other_repairable_surface` wrapper category: **0**;
- formal invalid episodes: **0/256**;
- Track A closeout `parser_invalid_total=0`.

The correct interpretation is:

> **wrapper drift persisted; fail-closed agent action failure and measurement invalidity are distinct events.**

Do not say every malformed wrapper was repaired. Some completions remained unrecoverable and were correctly left as invalid agent actions. What the audit establishes is that they were **not silently substituted with a legal shopping action** and did not turn the formal 256-episode measurement into parser-invalid evidence.

The machine-readable authority is:

- `docs/evidence/seed-webshop-public-code-reproduction-v1/WRAPPER_AUDIT.json`
- `docs/evidence/seed-webshop-public-code-reproduction-v1/WRAPPER_AUDIT.md`
- `scripts/openevo_webshop/audit_seedcmp_wrapper_drift.py`

at immutable `mykcs/openevo-experiment@e1229db492504bc9f7b795ca0a5184d5e1cadf1a`.

## Artifact publication and provenance

Track A artifact publication is `PUBLISHED_AND_VERIFIED`.

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

Allowed technical wrapper summary:

> Track A raw audit: 3,672 model-action steps = 300 strict + 3,253 recovered + 119 unrecoverable fail-closed; the 119 align exactly with recorded invalid-action/environment-invalid steps; formal invalid episodes=0/256 and closeout parser-invalid=0.

## What Results must not say

Do not say:

- Track A is still waiting for 128/128 runtime semantic validation;
- Track A is still `PREPARED` or still waiting for its paired BASE-vs-SD run;
- OpenEvo has a stable held-out WebShop win;
- the source-faithful first-validation 128 tasks are the paper-final exact 128 behind 89.7 / 78.1%;
- the SEED paper checkpoint or paper-reported 89.7 / 78.1 numbers were locally reproduced;
- GitHub `main` had launch authority before the first Track A formal episode;
- every malformed wrapper was repaired;
- the model has stopped producing wrapper drift;
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

The latest publication authority is `mykcs/openevo-experiment@b892d8123cdb4737d7971f84db6e7c1bcc77c6ab`.

The prior read-only reconciliation classification was `GEN28_COMPLETE_STATE_BARRIER_MISSING`. Amendment 006 has now moved the router to:

> **`GEN28_STATE_REPAIR_AUTHORIZED_INPUT_SEAL_PENDING`**

Current authority reports:

- campaign `20260821-2341-wb1-seed-aligned-webshop-benchmark`;
- track `Track B - Fair Matched Benchmark`;
- Gen28 episode completion `128/128-valid-exit-0`;
- Gen28 exact successes `2`;
- Gen28 mean Task Score×100 `2.8646`;
- `state-v28` still does **not** exist;
- latest adoptable native state remains `state-v27`;
- counted experience remains **3,456 / 20,640**;
- Gen28 budget credit remains **0** until a state-v28 repair barrier is published and adopted;
- `formal_task_consumption_allowed=false`;
- `task_bearing_train_dev_allowed=false`;
- `gpu_allocation_allowed=false`;
- `final_test_status=locked` and final unlock is not allowed.

Amendment 006 authorizes exactly one narrow repair sequence:

1. **read-only input seal** over the reconciled Gen28 `attempt-01`, exact `state-v27`, task stream, manifest/config/summary, and pinned identities;
2. if and only if that seal passes, **exactly one CPU-only deferred native `text_memory_memevolve` update** using the historical Gen28 execution implementation and pinned OpenEvo method;
3. **read-only state-v28 barrier reconciliation**.

It does **not** authorize re-running the 128 WebShop episodes, replacement episodes, new task consumption, GPU allocation, Gen29, H1.42/H1.43, or final unlock.

Because the historical native update includes `gpt-5.5` / Codex-driven MemEvolve reflection and candidate selection, this operation is explicitly **not claimed to be a byte-deterministic replay**. The frozen objects are the historical inputs, method identity, sparse-feedback contract, and exactly-one-update boundary. A newly produced state hash becomes authoritative only after its repair receipt and barrier are published and reconciled.

If the repair barrier passes and is published, Gen28 may then receive **128** experience-budget credit, moving the counter to **3,584 / 20,640** with **17,056** remaining. Until then, `state-v27` and `3,456 / 20,640` remain authoritative.

## Primary upstream references

Use immutable links at `f80ae1816384bb7e8e82d193b22644e17f561f19` for the closed Track A scientific measurement:

- `docs/evidence/seed-webshop-public-code-reproduction-v1/CLOSEOUT.json`
- `docs/evidence/seed-webshop-public-code-reproduction-v1/CLOSEOUT.md`
- `docs/evidence/seed-webshop-public-code-reproduction-v1/EVIDENCE_MANIFEST.json`
- `docs/evidence/seed-webshop-public-code-reproduction-v1/GOVERNANCE_EXCEPTION.json`
- `configs/experiment/receipts/webshop-seed-source-faithful-reproduction-v1-semantic-validation.json`
- `configs/experiment/manifests/webshop-seed-source-faithful-reproduction-v1-panel-v1.json`

Use immutable `e1229db492504bc9f7b795ca0a5184d5e1cadf1a` for the later read-only wrapper audit.

Use immutable `b892d8123cdb4737d7971f84db6e7c1bcc77c6ab` for current WB1 Amendment-006 repair authority:

- `configs/experiment/current-campaign.json`
- `docs/experiment-tracking/WB1_AMENDMENT_006_GEN28_DEFERRED_NATIVE_STATE_UPDATE_2026-08-27.md`
- `scripts/openevo_webshop/wb1_gen28_state_repair.py`

Before using words such as `current`, `running`, `released`, `completed`, `next`, or `authorized` in a later edit, refresh upstream again because WB1 state can move independently of this publication snapshot.
