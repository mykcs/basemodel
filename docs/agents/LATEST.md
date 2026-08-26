# Latest Agent handoff

Last updated: **2026-08-26**

Status: **Vercel remains the ordinary deployment provider. The SEED × OpenEvo Results surface has a current action-wrapper attribution/evidence layer on `main`; upstream Track A has advanced to an authorized source-faithful formal run, but no new Track A result should be published until reconciliation/analysis/closeout exists.**

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
- saved no-adapter Qwen2.5-7B BASE episodes can still emit `[action]...` under the same angle-bracket prompt;
- the inference backend directly decodes generated tokens and does not rewrite angle brackets into square brackets;
- H1.36 qualified self-evolution data excluded parser-invalid/fallback traces, so current evidence does not support the claim that SD-LoRA created the habit;
- the experiment-integration failure was that a known model-output drift was not preflighted against the formal SEED parser before PRIMARY-v1.

Do not collapse token provenance, training causation, parser behavior, and experiment responsibility into one “OpenEvo wrote `[action]`” statement.

### Source-faithful Track A successor

At this handoff snapshot, the active experiment authority in `mykcs/openevo-experiment` is campaign:

`20260826-0630-seed-webshop-public-code-reproduction`

on branch:

`seed-webshop-pubcode-repro-v1-prep`

The upstream `current-campaign.json` records:

- `status = executing-formal-run`;
- execution-readiness release passed **20/20** fail-closed checks;
- the source-faithful semantic panel was deterministically rebuilt;
- the same parser-compatible measurement contract is frozen for BASE and SD-LoRA;
- a 256-episode paired formal run was launched.

This is **execution state, not a result**. Before changing Results copy, refresh the actual upstream branch/SHA and latest reconciliation/result. Do not publish an inferred outcome from launch state.

### Track B / WB1

WB1 remains a separate fair matched benchmark line. Track A asks whether pinned SEED public-code task semantics can be reproduced faithfully; Track B asks for a matched method comparison under one frozen world and matched budgets. Their evidence is not interchangeable.

## Current BaseModel Results state

The current Results route keeps the seven-question reader path and a collapsed technical action-wrapper trace after it. The trace exists for code-level attribution without turning the main narrative into an experiment ledger.

A follow-up evidence-provenance pass may attach primary evidence directly to specific observations (for example, SEED parser behavior -> pinned official code line range; raw `[action]` -> raw BASE episode; numerical result -> machine analysis). Preserve the page’s progressive disclosure while making specific claims locally auditable.

For any non-trivial Results edit, read:

1. `current/scientific-state-provenance.md`
2. `current/experiment-result-publication-workflow.md`
3. `current/seed-openevo-results-reader-contract.md`
4. `current/research-explainer-page-standard.md`
5. `current/audience-centered-technical-copy.md`

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

For theme/CSS/layout/responsive/navigation/typography/animation/i18n-length/shared visual changes, follow the UI acceptance policy and run the strongest matched browser matrix.

Do not weaken a valid Gate merely because an unrelated route blocks release. Classify the failure and fix the real owner.

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

- use read/search/fetch operations for discovery;
- never create probe files/comments/mutations to test capability;
- batch intended changes before the first provider-triggering branch update;
- prefer one atomic multi-file commit when practical;
- if an accidental write occurs, clean it immediately when possible and disclose any residue.

## Durable case from this work

See:

[`history/2026-08-26-seed-results-attribution-and-agent-friction-retrospective.md`](history/2026-08-26-seed-results-attribution-and-agent-friction-retrospective.md)

for the detailed rationale covering:

- model-output attribution;
- parser compatibility preflight;
- range-compatible vs source-faithful task identity;
- website/experiment state drift;
- claim-level provenance;
- Vercel exact-head/main-movement friction;
- Agent-document entry cost;
- repository-write hygiene.

History is evidence, not current policy. Re-run fresh diagnostics when the same symptom appears again.
