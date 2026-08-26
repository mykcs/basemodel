# Latest Agent handoff

Last updated: **2026-08-26**

Status: **Vercel remains the ordinary deployment provider. The SEED × OpenEvo Results work is being integrated from the claim-level provenance pass and the corrected Track A state. Upstream Track A is PREPARED corrected task-construction evidence: the earlier manifest was superseded after the pinned SEED SimServer reseed semantic was found, formal task consumption is not authorized, and no new Track A scientific outcome exists.**

This file is a short current-state router. Detailed policy belongs under `docs/agents/current/`; historical rationale belongs under `docs/agents/history/`.

## Current architecture

```text
GitHub `mykcs/basemodel` = website source of truth
non-main branch / PR      -> Vercel Preview
main                      -> Vercel Production
Production                -> https://basemodel-preview.vercel.app

mykcs/openevo-experiment  = scientific experiment/result authority
```

GitHub Actions and GitHub Pages remain retired for ordinary BaseModel deployment. Cloudflare material is legacy rollback/provider-specific tooling only. Read `current/hosting-architecture.md` and `current/deployment-policy.md` before release work.

## Current research state

### Historical SEED-compatible 128-task comparison

The 2026-08-25 campaign remains a three-layer historical measurement:

- SEED-strict PRIMARY-v1: both arms appeared 0.0 / 0.0%, but the run is **measurement-invalid** because model action wrappers and the released SEED projection were incompatible;
- OpenEvo-native diagnostic: useful local diagnostic on the same historical panel, not the SEED benchmark headline;
- repaired PRIMARY-v2: BASE 4.1 task score / 0.0% exact success; frozen SD-LoRA 7.3 / 2.3%; paired mean delta +3.15 score×100 with bootstrap 95% CI `[-0.65, +7.19]`, so the direction is positive but not a stable win.

The historical panel is **SEED-compatible**, not the paper-final exact 128 and not the source-faithful first-validation semantic panel.

### Action-wrapper attribution boundary

The current repository-supported explanation is:

- released SEED prompt/parser require `<action>...</action>`;
- the saved BASE prompt also requests `<action>` rather than `[action]`;
- saved no-adapter Qwen2.5-7B BASE episodes can still emit `[action]...` under that angle-bracket prompt;
- the inference backend directly decodes generated tokens and does not rewrite angle brackets into square brackets;
- H1.36 qualified self-evolution data excluded parser-invalid/fallback traces, so current evidence does not support the claim that SD-LoRA created the habit;
- the experiment-integration failure was that a known model-output drift was not preflighted against the formal SEED parser before PRIMARY-v1.

Do not collapse token provenance, training causation, parser behavior, and experiment responsibility into one “OpenEvo wrote `[action]`” statement.

### Source-faithful Track A successor

Latest authoritative upstream evidence used by Results is `mykcs/openevo-experiment@af89bb5c39aeab8aaa04eed57585c91e5598a968`.

That commit corrected the task builder to match the pinned SEED runtime semantics: `SimServer.__init__` re-seeds Python `random` with `worker_seed` after synthetic-goal construction and before `random.shuffle(self.goals)`. The earlier builder omitted that second reseed, so its shuffled goal order and instruction identities were not source-faithful. The earlier manifest is superseded.

Current Track A state:

- corrected 128-slot source-faithful semantic manifest is rematerialized and immutable at the `af89...` snapshot;
- corrected deterministic rebuild receipts agree on canonical content;
- activation is `PREPARED`;
- `formal_task_consumption_allowed=false`;
- BASE / frozen SD-LoRA identities and the parser-compatible measurement contract remain frozen;
- the next fail-closed gate is **authoritative WebshopWorker runtime semantic validation 128/128** on the corrected manifest;
- only after that gate passes may a separate activation/release authorize formal GPU task consumption.

This is task-identity / measurement preparation evidence, **not a new BASE-vs-SD scientific result**. The corrected first-validation panel is also not the unrecoverable paper-final exact 128 behind 89.7 / 78.1%.

An older preparation branch briefly carried `executing-formal-run`; that state was superseded by the later manifest-semantic correction. Before changing Results copy again, refresh actual upstream main/activation/reconciliation rather than inheriting an old branch label.

### Track B / WB1

WB1 remains a separate fair matched benchmark line. Track A asks whether pinned SEED public-code task semantics can be reproduced faithfully; Track B asks for a matched method comparison under one frozen world and matched budgets. Their evidence is not interchangeable.

## Current BaseModel Results state

The Results route keeps the seven-question reader path and a collapsed technical action-wrapper trace after it. Claim-local provenance should point highly specific observations to their closest available primary evidence while preserving the broader evidence package for each question.

The current integration also exposes a teacher-facing immutable link to the corrected 128-task manifest. Visible copy must say that this is the **current frozen corrected first-validation panel**, pending 128/128 runtime semantic validation; it must not call it the paper-final exact 128.

For any non-trivial Results edit, read:

1. `current/scientific-state-provenance.md`
2. `current/experiment-result-publication-workflow.md`
3. `current/seed-openevo-results-reader-contract.md`
4. `current/seed-openevo-results-current-state-2026-08-26.md`
5. `current/research-explainer-page-standard.md`
6. `current/audience-centered-technical-copy.md`

Then resolve fresh upstream experiment truth before writing copy.

## Current deployment / acceptance rules

Historical browser passes and old deployment URLs prove only the tree they tested.

Keep these boundaries separate:

```text
source synchronization
!= repository Gate/build success
!= exact-head Preview READY
!= changed-route browser acceptance
!= merge
!= Production acceptance
```

A Vercel deployment-specific hostname is immutable. When `main` moves during a long task, verify ancestry and provider commit metadata rather than assuming an old READY URL represents the newest main.

For ordinary deployable changes:

```bash
npm run verify:deploy
npm run build
```

Required gates must actually execute. `SKIPPED` is not `PASS`.

For theme/CSS/layout/responsive/navigation/typography/animation/i18n-length/shared visual changes, follow the UI acceptance policy and run the strongest matched browser matrix.

Do not weaken a valid Gate merely because an unrelated route blocks release. Classify the failure and fix the real owner.

### Vercel build budget

Keep provider-triggering repository writes coherent. When many files belong to one change, prefer a single Git data API commit (`blob/tree/commit/ref`) or another atomic multi-file write rather than a sequence of probe pushes. The objective is to reduce redundant Preview builds without hiding real source changes or required gates.

### Vercel-first reporting

Ordinary deployment completion reports should describe the Vercel Preview/Production lineage that actually serves this repository. Do not add Cloudflare or another legacy provider to an ordinary report unless the task is explicitly about rollback or provider migration.

## Agent reading model

Do not use one giant linear reading list.

```text
/AGENTS.md
-> this handoff
-> current/project-agent-operating-principles.md
-> current/website-engineering-standard.md
-> current/scenario-trigger-registry.md
-> one matched task bundle from docs/agents/README.md
-> executable source/config/tests/live provider or experiment truth
```

The task-based bundle map is in [`README.md`](README.md).

## Repository-write hygiene

Shared repository/provider state is not an Agent scratchpad.

- use fetch/search/read operations for discovery;
- never create probe files/comments/mutations to test capability;
- batch intended changes before the first provider-triggering branch update;
- prefer one atomic multi-file commit when practical;
- if an accidental write occurs, clean it immediately when possible and disclose any residue.

## Durable case from this work

See [`history/2026-08-26-seed-results-attribution-and-agent-friction-retrospective.md`](history/2026-08-26-seed-results-attribution-and-agent-friction-retrospective.md) for rationale covering model-output attribution, parser compatibility, range-compatible vs source-faithful task identity, website/experiment state drift, claim-level provenance, Vercel exact-head friction, and repository-write hygiene.

History is evidence, not current policy. Re-run fresh diagnostics when the same symptom appears again.
