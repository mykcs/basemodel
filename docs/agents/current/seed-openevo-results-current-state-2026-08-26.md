# SEED × OpenEvo Results current-state addendum — 2026-08-26

This file is a narrow latest-state override for the Results route.

Read it together with `seed-openevo-results-reader-contract.md`. Where the older reader-contract snapshot says the source-faithful successor is `executing-formal-run` or that a 256-episode paired run is currently authorized, **this file is newer and wins**.

## Current Track A state

The source-faithful SEED WebShop successor has progressed beyond design-only work, but it is **not currently authorized for formal task consumption**.

Latest upstream evidence on `mykcs/openevo-experiment` main, commit `af89bb5c39aeab8aaa04eed57585c91e5598a968`, records a scientific correction to the source-faithful panel builder:

- pinned SEED `SimServer.__init__` re-seeds Python `random` with `worker_seed` after synthetic-goal construction and before `random.shuffle(self.goals)`;
- the prior builder omitted this second reseed;
- therefore every old shuffled goal ordering, and thus every instruction identity, differed from the authoritative `WebshopWorker.reset(session_index)` path;
- the old manifest was marked superseded;
- a corrected 128-task manifest was rematerialized;
- deterministic rebuild of the corrected manifest is PASS;
- current activation state is `PREPARED`;
- `formal_task_consumption_allowed=false`;
- the next fail-closed gate is authoritative `WebshopWorker` runtime semantic validation at `128/128` on the corrected manifest.

This is a **measurement/task-identity correction**, not a new BASE-vs-SD result.

## What Results may say now

Allowed visible summary:

> The source-faithful 128-task panel has been rebuilt, but a stricter audit found one missing SEED runtime reseed step in the first reconstruction. That manifest was superseded and corrected. The current step is 128/128 runtime semantic validation of the corrected panel; only after that passes may the formal BASE-vs-OpenEvo comparison be released again.

Allowed technical summary:

> Corrected manifest: PREPARED; formal task consumption fail-closed; next gate = authoritative WebshopWorker runtime semantic validation 128/128.

## What Results must not say

Do not say:

- the source-faithful successor is still design-only;
- the source-faithful paired BASE-vs-SD result is complete;
- a current formal run is safely underway based on the superseded manifest;
- the old source-faithful manifest is still authoritative;
- the source-faithful 128 tasks are the exact paper-final denominator behind 89.7 / 78.1%;
- the repaired historical PRIMARY-v2 result has changed.

## Historical benchmark-facing result remains unchanged

The 2026-08-25 repaired PRIMARY-v2 result remains the latest interpretable completed BASE-vs-SD measurement on the historical frozen SEED-compatible panel:

- BASE task score 4.1 / exact success 0.0%;
- frozen OpenEvo SD-LoRA task score 7.3 / exact success 2.3%;
- paired mean delta +3.15 score×100;
- bootstrap 95% CI `[-0.65, +7.19]`;
- interval crosses zero, so no stable win is claimed.

The new Track A work changes the confidence in **task semantics for the next comparison**, not those historical repaired-PRIMARY numbers.

## Primary upstream references

Use immutable links at commit `af89bb5c39aeab8aaa04eed57585c91e5598a968` for the corrected Track A state:

- `configs/experiment/activations/webshop-seed-source-faithful-reproduction-v1-execution-release-v1.json`
- `configs/experiment/manifests/webshop-seed-source-faithful-reproduction-v1-panel-v1.json`
- `scripts/openevo_webshop/build_seed_source_faithful_panel.py`
- `scripts/openevo_webshop/validate_seed_source_faithful_runtime.py`

Before using words such as `current`, `running`, `released`, `completed`, or `next`, refresh upstream again because this gate is expected to change quickly.
