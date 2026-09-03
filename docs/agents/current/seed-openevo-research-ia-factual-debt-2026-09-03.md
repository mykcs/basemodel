# SEED × OpenEvo Research Factual-Debt Register — 2026-09-03

Status: **PHASE C AUDIT COMPLETE**
Website audit baseline: `mykcs/basemodel@3151686bdc594e723d08764b180532e86ef02fd3`
Phase-B accepted main: `mykcs/basemodel@74c6c728da1b4a501f88658ccd495e4725934857`
Authority snapshot: [`seed-openevo-research-ia-authority-snapshot-2026-09-03.md`](./seed-openevo-research-ia-authority-snapshot-2026-09-03.md)
Route inventory: [`seed-openevo-research-ia-route-inventory-2026-09-03.md`](./seed-openevo-research-ia-route-inventory-2026-09-03.md)

This document is the Phase C factual/freshness audit. It does **not** rewrite the website. It identifies which current-looking statements are still supported, which are historical, which have been superseded, and which must not be reused until an upstream identity/evidence binding is restored.

The governing rule is:

> A website sentence is never evidence for itself. Current or mutable scientific claims must resolve to the exact scientific object that owns them: frozen design/preregistration, execution receipt, reconciliation/result, or another immutable upstream record.

---

## 1. Status vocabulary used in this audit

### `current-supported`

The claim is supported as current **within an explicit scope** by the exact active scientific lineage frozen for this audit. For fast-moving state, the source ref and checked date/claim boundary must remain visible.

### `historical-supported`

The claim is supported for a completed or dated historical object. It remains valid evidence, but must not be worded as today's active experiment merely because it is accurate history.

### `superseded`

The claim was once a valid design/current-state statement but a later scientific decision or lineage now replaces it for the active question. Preserve it as history where useful; do not present it as active.

### `stale-unknown`

The website contains a value or state, but this audit did not establish a sufficient upstream immutable binding for reuse as a scientific fact. Preserve the source page until Phase D resolves identity, but do not copy the value into new canonical pages.

### `duplicate`

The fact may be valid, but it is repeated in multiple website owners. The canonical rewrite should keep one semantic owner and link to it.

### `unsupported`

The website claim conflicts with upstream evidence or asserts a stronger conclusion than the evidence supports. It must not survive as a scientific claim.

---

## 2. Authority timeline that explains most current-state debt

The website currently contains material from at least three different “current” eras.

### Era 1 — WB1 / Track B default-main snapshot

Website owner:

```text
src/lib/openEvoScientificState.ts
checkedAt: 2026-08-28
checkedSourceCommit: 04c0faf02af6f0fcb0724aff3c5697b0c858e9e4
phase: WB1-TRACKB-CONTINUATION
status: trackb-gen28-state-v28-adopted-final-locked-no-training
```

The underlying Gen28 adoption point is recorded in the Results current-state addendum as:

```text
mykcs/openevo-experiment@c2791000a3af97190c264ba5ea39f0c4e5f65823
```

This remains valid **historical** evidence for WB1 Gen28. It is not the active global research lineage on the Phase-C audit date.

### Era 2 — successor based on `Stage1-202609021800`

Website owners include:

```text
OpenEvoRedesignMap.astro
OpenEvoExperimentDesignCatalog.astro
openevo-capability-exploration-two-map-implementation-runbook.md
```

Pinned upstream design/member refs include:

```text
Stage1 design/freeze: 1d08703c611292a2b6e6d88455add1d762957958
MiniMax successor: c60419cad2e4ff0aad0b7e22177ac6e16475fe97
```

That lineage is useful history but is no longer the active formal Stage-1 entry point.

### Era 3 — active shared Stage1 freeze `202609030400`

Phase-C current authority for raw Stage1 is the bounded active lineage:

```text
PR #270 (Draft)
branch: research/shared-stage1-min-deliberation-final-candidate-20260903
head: 8c039ec0ef63f1e2f94e2c8f091d48f371e58c0f
scientific decision: FREEZE_ONE_SHARED_STAGE1_HARNESS
freeze: 202609030400
formal execution SHA: 362271d3cdc411581dd7f09d98d5ce69cfb1cb57
```

Canonical formal run identities declared there:

```text
qwen25-3b-stage1-202609030400
qwen3-1p7b-stage1-202609030400
```

The PR explicitly says the canonical `1440 + 1440` collections are running and the PR must remain Draft until both raw corpora seal and post-collection audit passes. Therefore the current-supported claim boundary is **shared raw Stage1 design/execution in progress**, not “Stage1 complete”, not “MiniMax released”, and not “Stage2 ready”.

---

# 3. C01 — research overview / Flow factual audit

| ID | Website owner / claim | Upstream evidence | Classification | Rewrite rule |
| --- | --- | --- | --- | --- |
| C01-01 | `/flow/` says `openevo-experiment` is the scientific source of truth | merged governance `openevo-experiment@8692bf6dfbfdb948b7f6a7229fb65f26a49566a9`; Cross-Platform Experiment Asset Standard | `current-supported` | Keep as stable authority rule. |
| C01-02 | `/flow/` Mission Hero shows a “recently checked main snapshot” from `openEvoScientificState.defaultBranchSnapshot` | website snapshot `2026-08-28`; underlying WB1 adoption `c2791000...` | `historical-supported` | Keep only as clearly dated default-main history, never as live experiment state. |
| C01-03 | `openEvoScientificState.liveStateRule` says actual working branch may be ahead of default main | current basemodel provenance contract + Phase-A discovered router conflict | `current-supported` | Preserve concept, but strengthen object-specific ownership: branch + frozen design/receipt/reconciliation, not `current-campaign.json` alone. |
| C01-04 | `openEvoScientificState.gpuRule` says GPU use needs preregistration, authorization, and live-idle check | current basemodel scientific-state provenance contract | `current-supported` | Keep as policy, do not convert inventory into allocation. |
| C01-05 | `/flow/server/` publishes 2026-09-03 01:11 UTC+8 server inventory/storage numbers and explicitly calls them a static snapshot | page itself carries timestamp; server audit refresh SOP requires new measurement before refresh | `current-supported` **as dated snapshot only** | Preserve dated snapshot semantics; never turn it into live usage/allocation. |
| C01-06 | server page says disk capacity “remains the tightest resource” | only the 2026-09-03 01:11 snapshot is bound in this audit | `historical-supported` / time-bounded | Rephrase as “in that snapshot” unless refreshed from a new measurement. |
| C01-07 | Flow conceptual pages for SEED/OpenEvo/WebShop/ALFWorld/update mechanisms describe stable roles | papers/code/merged repo standards are the intended owners; no conflict found in this Phase-C pass | `current-supported` for conceptual role, not live experiment state | Keep stable explanation separate from mutable experiment projection. |

### C01 conclusion

The largest overview debt is not that the 2026-08-28 WB1 snapshot is false; it is that a historical default-main snapshot is still structurally wired into current-facing entry components. The replacement must keep a dated historical snapshot if useful while sourcing active lineage state separately.

---

# 4. C02 — Study / design factual audit

| ID | Website owner / claim | Upstream evidence | Classification | Rewrite rule |
| --- | --- | --- | --- | --- |
| C02-01 | `/study/`: source-faithful Track A paired 128-task measurement is complete | `openevo-experiment@f80ae1816384bb7e8e82d193b22644e17f561f19` closeout | `historical-supported` | Preserve result and claim boundary; move to Results/history rather than “current experiment” narrative. |
| C02-02 | `/study/`: “下一场” is the previously frozen 21,920-rollout long-horizon fair comparison | historical WB1/public-launcher design; current audit authority is PR #270 `202609030400` | `superseded` as next/current experiment | Keep 21,920 provenance only if explaining that historical design; remove “next experiment” status. |
| C02-03 | 21,920 is public-code-derived from a 160-epoch launcher and is not the paper's 150-update / 20,640 total environment-trajectory accounting | `openevo-experiment@8692bf6.../configs/experiment/wb1/protocol.json` records public launcher 160 epochs; SEED paper protocol remains separate | `historical-supported` | Preserve unit/provenance distinction as historical design context. |
| C02-04 | `SeedOpenEvoTrainingDecisionLab`: current/primary Stage1 actor temperature = `0.4` | active PR #270 formal Stage1 says `temperature=1.0`, `top_p=1.0`, `top_k=0` | `superseded` | Do not carry `0.4` into the current shared Stage1 design page. Preserve as older sampled-v2 design history if evidence warrants. |
| C02-05 | TrainingDecisionLab: sampled-v2 is the current primary design | active PR #270 says earlier Stage1 lineages had protocol/interface regressions and freezes `202609030400` shared harness | `superseded` | Replace current recommendation with projection from the active canonical design; retain old design as predecessor. |
| C02-06 | TrainingDecisionLab: old Stage2 `0.7` / `256 rollouts` are superseded historical controls | component labels them historical; old 256-window route explicitly archives the method-control failure | `historical-supported` | Keep as history, not active parameter table. |
| C02-07 | TrainingDecisionLab: “current Ceiling-1.0 uses 128 attempts per evidence round” | historical Ceiling lineage, not PR #270 raw Stage1 | `historical-supported` for Ceiling; `superseded` as generic current OpenEvo | Scope to the historical Ceiling design. |
| C02-08 | `/study/run/` says live state should resolve from actual experiment branch + current-campaign + reconciliation/result | Phase-A conflict proves `current-campaign.json` can itself be stale within a branch | `current-supported` in principle, **needs narrowing** | Change to object-owned frozen design/prereg + exact receipts/reconciliation; router is an index, not sole authority. |

### C02 contradiction resolved

Website “current primary Stage1 T=0.4” loses to PR #270 because PR #270 owns the active raw Stage1 object and explicitly freezes `T=1.0`. This is not a stylistic preference or recency vote; it is object ownership + later formal freeze.

---

# 5. C03 — Results and result-note factual audit

| ID | Website owner / claim | Upstream evidence | Classification | Rewrite rule |
| --- | --- | --- | --- | --- |
| C03-01 | Results: Track A semantic validation `128/128 PASS`, BASE `7.17`, SD-LoRA `8.74`, exact `5/128` vs `5/128`, delta `+1.57`, 95% CI `[-3.21,+6.31]`, no stable improvement | `openevo-experiment@f80ae1816384bb7e8e82d193b22644e17f561f19` closeout/evidence package | `historical-supported` | Preserve exactly with historical/closed label and original claim boundary. |
| C03-02 | Results: Track A artifacts are `PUBLISHED_AND_VERIFIED` | same immutable Track A closeout | `historical-supported` | Keep technical provenance; do not imply active publication status for unrelated newer runs. |
| C03-03 | Results: historical repaired PRIMARY-v2 BASE `4.1`, SD `7.3`, delta `+3.15`, CI crosses zero | Results addendum identifies it as 2026-08-25 historical result | `historical-supported` | Retain only under historical result lineage. |
| C03-04 | Results description/next-step components say next decision moves to Track B / WB1 | active PR #270 now owns current shared Stage1 rerun | `superseded` | Remove “next/current” semantics; retain WB1 as historical lineage. |
| C03-05 | Results current-state addendum calls Gen28/State-v28 the current Track B state and Gen29 the current next gate | immutable WB1 state `c2791000...` supports that historical point; PR #270 supersedes it as the active object for current Stage1 work | `historical-supported` for Gen28; `superseded` as current next gate | Move into dated history. |
| C03-06 | `/results/current-conclusion/` presents an H1.41 cutoff under a permanent “current” slug | `[note].astro` metadata explicitly says “截至 H1.41” | `superseded` as current; `historical-supported` as H1.41 cutoff | Absorb supported claims into current Results; retain old URL/history semantics. |
| C03-07 | `why-it-kept-failing`, `first-positive-transfer`, `independent-replication`, `second-generation`, `measurement-boundary` are steps in how conclusions evolved | Results appendix explicitly frames them as research history | `historical-supported` at their original cutoffs | Preserve as history; do not let H1 labels define top-level current IA. |
| C03-08 | `benchmark-first`, `seed-faithful-benchmark`, `openevo-benchmark-design` are active-looking experiment design notes under Results | newer design families and PR #270 exist | `historical-supported` as design history / `superseded` as active design | Move under Experiment Designs/History. |
| C03-09 | `webshop-training`, `seed-training`, `openevo-training` are Results pages | their component explicitly says the primers moved to Flow/paper pages | `duplicate` | Convert to compatibility redirect/landing behavior; no independent scientific owner. |

---

# 6. C04 — capability exploration / Stage-specific factual audit

| ID | Website owner / claim | Upstream evidence | Classification | Rewrite rule |
| --- | --- | --- | --- | --- |
| C04-01 | capability lobby: first-run map is historical | page explicitly identifies it as `HISTORICAL MAP`; no current conflict | `historical-supported` | Preserve under History. |
| C04-02 | capability lobby/redesign: `openevo-2-0` is the “current design route” | active PR #270 replaces `202609021800` entry with `202609030400` formal shared Stage1 | `superseded` as current route | Keep redesign concept but regenerate its state from canonical projection. |
| C04-03 | RedesignMap: `Stage1-202609021800` is the current shared Harness201.1 Stage1 contract | upstream frozen member at `1d08703...` supports that historical design; PR #270 says earlier Stage1 lineages had regressions and freezes `202609030400` | `superseded` | Preserve predecessor relation; do not call current. |
| C04-04 | RedesignMap: MiniMax `202609022300` analysis is the next/current Stage1 analysis contract | active PR #270 says raw corpora must first independently seal and pass post-collection audit; MiniMax is not auto-released | `superseded` / premature as current | New current page must show MiniMax as gated downstream, not already-authorized successor for the active corpus. |
| C04-05 | RedesignMap: downstream OPSD/Memory/Skill/Agent cards are future/not released | PR #270 explicitly says finalizer only seals raw corpora and MiniMax must wait for audit; downstream comes later | `current-supported` as **not yet released** boundary | Keep gated/future semantics; source them from projection instead of hand-coded cards. |
| C04-06 | ExperimentDesignCatalog family `fresh-stage1-202609021800` and member list represent current Experiment Designs | member SHAs make the snapshot traceable, but active PR #270 owns newer formal Stage1 | `superseded` as current catalog state | Keep family predecessor/history; active family/object must be generated from current identity. |
| C04-07 | `stage1-previous` is an old trajectory/adapter/HF/Git archive | page explicitly historical | `historical-supported` at category level; exact asset bindings deferred to Phase D | Preserve; do not reuse asset numbers until identity graph joins them upstream. |
| C04-08 | `stage2-256-window` explains old method-control gate causing zero parameter updates despite successful trajectories | page/data label it historical method control | `historical-supported` at design interpretation level | Preserve as superseded design history; explain meaning before `7 vs 8`. |
| C04-09 | `stage2-ceiling` snapshot says 7B had 25 SD-LoRA components while 3B had 0 after 18 rounds, then successor restarts fresh Stage1 | this audit did not rebind those snapshot counters to an immutable upstream receipt | `stale-unknown` for exact counters; successor relation generally `historical-supported` | Do not copy exact counters into new canonical pages until Phase D restores source binding. |
| C04-10 | `harness-2-0` is a current Harness page | its own description says it is a historical snapshot and parent redesign map is later | `historical-supported`, not current | Keep as diagnostic/history evidence. |
| C04-11 | experiment archive separates scientific amendment from engineering/runtime repair | consistent with experiment/governance standards | `current-supported` as conceptual classification | Reuse this distinction in History/Assets IA. |

---

# 7. C05 — model/self/MiniMax/cross-arm analysis factual audit

The four arm pages and the joint analysis are already labelled sealed/stopped historical evidence. Phase C does not upgrade their website-local numbers into new current claims.

| ID | Arm / claim | Current website binding | Classification | Rewrite rule |
| --- | --- | --- | --- | --- |
| C05-01 | `3B / self`: old Stage2 `80/80`, `20,480`, 138 qualified positives, 0 Stage2 updates, final `1.71`, `1/128`, `121/128` valid | `src/data/openEvoLegacyStage2Archive.ts`, archive/HF/runtime revisions embedded there | `historical-supported` as sealed site archive; upstream run/asset join still required in Phase D | Preserve page; new graph must cite canonical run/assets before duplicating numbers elsewhere. |
| C05-02 | `7B / self`: old Stage2 `80/80`, `20,480`, 797 positives, 0 Stage2 updates, final `25.66`, `4/128`, `122/128` valid | same archived data owner | `historical-supported` as sealed site archive; Phase-D binding needed | Preserve as history/evidence, not current Stage2. |
| C05-03 | `3B / MiniMax`: `59/80 + partial`, stopped/superseded at `74.58%`, final evaluation not run | archived data explicitly distinguishes `not-run` from zero | `historical-supported` at archived cutoff; Phase-D binding needed | Preserve `not-run`; never show missing final as zero. |
| C05-04 | `7B / MiniMax`: old Stage2 `80/80`, `20,480`, 592 positives, 0 updates, final `16.94`, `0/128`, `116/128` valid | archived data owner | `historical-supported` as sealed archive; Phase-D binding needed | Preserve as history/evidence. |
| C05-05 | four-arm analysis compares those arms under their sealed/stopped evidence boundary | page metadata explicitly notes 3B/MiniMax final was not run | `historical-supported` within original evidence boundary | Keep as historical cross-arm analysis, not an additional arm/design. |
| C05-06 | MiniMax teacher page has `FROZEN FACTS · LIVING ANALYSIS` | H1.46 frozen fact record + separate living teacher/cost analysis contract | `historical-supported` for frozen facts; analysis is non-authoritative for live experiment state | Preserve two-layer contract; current campaign claims must come from active run receipts, not this analysis page. |

### Important Phase-D handoff

The numeric rows in `openEvoLegacyStage2Archive.ts` are useful retained evidence, but Phase C intentionally does not treat a website-local TypeScript file as sufficient canonical provenance for future duplication. Phase D must join these arms to canonical run IDs, asset IDs, immutable provider revisions, and producing/consuming relations. Until then, their existing pages may remain as historical evidence but new pages should link rather than copy their numbers.

---

# 8. C06/C07 — consolidated claim register

The audit categories above produce this high-level inventory:

| Claim family | Classification | Canonical handling |
| --- | --- | --- |
| `openevo-experiment` is scientific source of truth | `current-supported` | stable site rule |
| 2026-08-28 WB1 Gen28 snapshot | `historical-supported` | dated default-main snapshot only |
| WB1 / Track B is the current next experiment | `superseded` | History, not current navigation |
| Track A 128-task closeout and no-stable-win conclusion | `historical-supported` | Results/history with immutable closeout |
| 21,920 public-code-derived campaign budget | `historical-supported` as old design provenance | old design/history only |
| 21,920 campaign is “下一场” | `superseded` | remove current/next wording |
| Stage1 T=0.4 sampled-v2 is current primary | `superseded` | predecessor design only |
| `Stage1-202609021800` is current formal Stage1 | `superseded` | predecessor lineage |
| `202609022300` MiniMax is already current downstream for active corpus | `superseded` / premature | gated until current 030400 corpora seal + audit |
| `FREEZE_ONE_SHARED_STAGE1_HARNESS`, freeze `202609030400`, 3B+1.7B raw corpus collection in progress | `current-supported` within PR #270 scope | current design/run projection, branch/SHA labelled |
| PR #270 raw Stage1 already completed | `unsupported` | must not claim until formal seals/audit exist |
| PR #270 MiniMax/OPSD/Memory/Skill/Agent/Stage2 already released | `unsupported` | explicitly blocked by current PR boundary |
| old 256-window/7-vs-8 method control | `historical-supported` | History/Superseded |
| old self/MiniMax four-arm data | `historical-supported` at existing archive boundary | History/Assets; Phase-D canonical join required |
| static server snapshot 2026-09-03 01:11 UTC+8 | `current-supported` only as dated observation | Operations; never live allocation |
| `current-conclusion` H1.41 page is today's current conclusion | `superseded` | H1.41 historical cutoff |
| moved-primer Results pages own WebShop/SEED/OpenEvo concepts | `duplicate` | redirect to Flow/paper owners |

---

# 9. C08 — contradiction-resolution ledger

## CONTRADICTION-01 — what is the current experiment?

Competing website/upstream signals:

```text
WB1 Track B Gen28 / Gen29 next gate
vs
Stage1-202609021800 successor
vs
Stage1-202609030400 shared formal rerun
```

Resolution:

```text
current bounded raw-Stage1 authority = PR #270 @ 8c039ec0...
freeze = 202609030400
```

Reason: PR #270 explicitly owns the active shared Stage1 object and records why earlier lineages were rerun. WB1 and 202609021800 remain history/predecessors.

## CONTRADICTION-02 — Stage1 sampling temperature

Competing values:

```text
TrainingDecisionLab current-primary: T=0.4
PR #270 current formal readback: T=1.0
```

Resolution: `T=1.0` for active `202609030400` raw Stage1. The old `0.4` design is superseded for this object.

## CONTRADICTION-03 — can current-campaign.json resolve live state by itself?

Competing claims:

```text
website guide pattern: active branch -> current-campaign.json -> latest reconciliation/result
Phase-A observation: current-campaign.json is stale in both merged main and PR #270 lineage
```

Resolution: `current-campaign.json` remains a routing hint/index, not sufficient authority. Resolve the **object owner** first, then exact frozen design/prereg + execution receipts/reconciliation.

## CONTRADICTION-04 — is MiniMax next already released?

Website redesign `202609022300` makes MiniMax look like the frozen next analysis step for the current successor.

PR #270 explicitly requires:

```text
both 1440 corpora finish
-> formal seals PASS
-> post-collection engineering/provenance/behavior audit PASS
-> only then MiniMax may consume the new canonical corpora
```

Resolution: for the current `202609030400` corpus, MiniMax is gated/not yet released at the frozen Phase-C snapshot.

## CONTRADICTION-05 — does “final not run” mean zero?

`3B / MiniMax` historical archive explicitly has `finalEvaluation.status = not-run`.

Resolution: not-run remains not-run. Never convert missing evaluation to zero; this distinction must become a semantic gate in Phase K.

---

# 10. C09 — tests/docs that currently freeze stale “current” state

These are not all bad tests. Some correctly protect historical snapshots. The debt is that several tests/docs use exact old values as **current-state contracts** instead of testing provenance semantics.

## WB1 / 2026-08-28 state hard-coding

| Owner | Current hard-coded expectation/debt | Required later change |
| --- | --- | --- |
| `scripts/audit-audience-copy.ts` | requires `checkedAt: '2026-08-28'`, `WB1-TRACKB-CONTINUATION`, old status | test dated-snapshot labeling and active-projection semantics, not immutable “current” phase text |
| `src/lib/editorialHeadingPolicy.test.ts` | expects old WB1 phase token | allow historical snapshot, stop using it as current heading contract |
| `src/lib/audienceCopyAudit.test.ts` | expects fixed 2026-08-28 WB1 state | verify provenance/date/source structure instead |
| `src/lib/openEvoExperimentProgram.test.ts` | explicitly tests the dated WB1 Gen28 snapshot | keep only as historical snapshot test; add current projection test separately |
| `src/lib/openEvoScientificState.test.ts` | expects exact old date/commit/phase | split historical snapshot fixture from live/current projection owner |
| `src/components/SeedStudentReproductionGuide.test.ts` | current-state protection depends on old default-main snapshot tokens | verify source/checked-date/live-state-resolution rule |
| `src/lib/seedOpenEvoCurrentState.test.ts` | title/contract says “current Track A closeout and Track B continuation” | rename/reframe as historical cutoff or replace with projection-driven current state |
| `src/lib/seedOpenEvoReaderVoiceProtection.test.ts` | requires “路线 B（Track B，WB1）” and `GEN28_STATE_V28_BARRIER_PASS_ADOPTED` as next-state copy | retain under history only; current next-step test must follow projection |
| `src/lib/openEvoWrapperAuditCurrent.test.ts` | describes “current ... adopted WB1 state” | convert to historical Track-A/WB1 evidence boundary |

## `202609021800` successor hard-coding

| Owner | Current hard-coded expectation/debt | Required later change |
| --- | --- | --- |
| `src/lib/openEvoExperimentDesignCatalog.test.ts` | requires family `fresh-stage1-202609021800` and associated titles | test projection schema/grouping; predecessor may remain but current family cannot be fixed to this ID |
| `src/lib/openEvoRedesignMap.test.ts` | requires `202609021800` as fresh Stage1 | test design/run status from projection; retain old ID only as historical predecessor fixture |
| `docs/agents/current/openevo-capability-exploration-two-map-implementation-runbook.md` | calls Stage1-202609021800 latest experiment authority | move/refresh authority statement; do not let current docs freeze a superseded lineage |

## Results current-state doc debt

```text
docs/agents/current/seed-openevo-results-current-state-2026-08-26.md
```

Its Track A closeout facts remain valuable. Its section “Current Track B / WB1 state” is now historical. The file should either be reframed as a dated historical snapshot or replaced by a projection-driven current-state owner; retaining it under `current/` must not cause future Agents to prefer it over PR #270/object-owned evidence.

### Testing principle for later implementation

Good:

```text
expect current-facing data to carry source ref + checked_at + claim boundary
expect historical WB1 to remain labelled historical/dated
expect active design to be whatever the validated projection declares
expect not-run != zero
```

Bad:

```text
expect current phase == WB1 forever
expect current Stage1 ID == 202609021800 forever
expect exact old next-step prose merely to keep a regression test green
```

---

# 11. C10 — factual-debt backlog for implementation phases

## FD-01 — split historical default-main snapshot from active research state

Current `openEvoScientificState.ts` combines a dated historical snapshot with current-facing consumers. Phase F/G should introduce a projection owner for active design/run state while retaining dated historical snapshots as explicitly historical data.

## FD-02 — stop treating router files as sufficient live authority

`current-campaign.json` is demonstrably stale relative to the object it is supposed to route in the current scientific branch. Current-site projection must resolve object identity from frozen design/prereg/receipts/reconciliation, with router metadata as an index only.

## FD-03 — replace current WB1 next-step narrative

Study/Results/NextSteps metadata and components that say the next/current direction is Track B/WB1 must move to History or be rewritten against the active projection.

## FD-04 — replace current `202609021800` successor narrative

Redesign map/catalog/runbook must preserve `202609021800` as a predecessor but source the active `202609030400` shared Stage1 design and runs from canonical projection.

## FD-05 — eliminate hand-written sampling/protocol “current primary” values

TrainingDecisionLab must not be a second protocol database. Current protocol fields should come from the canonical design projection. Historical design comparisons can remain explanatory content.

## FD-06 — separate closed Results from current experimental routing

Track A and H1.x conclusions remain valid historical evidence. Current Results should answer supported claims; current experimental execution status belongs to design/run projection, not to a dated Results addendum.

## FD-07 — restore upstream identity for historical arm/assets before copying numbers

The old 3B/7B self/MiniMax archive is useful, but Phase D must join each arm and important trajectory/checkpoint/adapter/evaluation asset to canonical identities and immutable provider revisions. Until then, link to existing historical pages instead of duplicating site-local counters.

## FD-08 — preserve not-run / negative / invalid distinctions

`3B/MiniMax final not run` is a concrete regression trap. Phase K tests must protect `not-run != zero`, `protocol-invalid != valid-negative`, and tracking/runtime failure boundaries.

## FD-09 — treat server state as dated observation only

The server page already follows the right pattern. New IA must not connect server inventory directly to experiment GPU allocation/authorization or ownership.

## FD-10 — rewrite stale “current” tests into provenance-semantic tests

Tests listed in C09 must be updated together with the projection migration. Historical fixtures can keep old WB1/202609021800 tokens, but current-state assertions must resolve through the validated projection.

---

# 12. Phase C source ledger

The following upstream refs are sufficient for the classifications made above.

## Current bounded Stage1

```text
mykcs/openevo-experiment PR #270
head: 8c039ec0ef63f1e2f94e2c8f091d48f371e58c0f
freeze: 202609030400
formal execution SHA: 362271d3cdc411581dd7f09d98d5ce69cfb1cb57
```

Claim boundary: shared raw Stage1 formal design/execution in progress; no claim of sealed corpora, MiniMax release, downstream construction, Stage2, or final evaluation.

## Merged governance

```text
mykcs/openevo-experiment@8692bf6dfbfdb948b7f6a7229fb65f26a49566a9
```

Claim boundary: merged governance/standards, not current experiment execution.

## Track A closeout

```text
mykcs/openevo-experiment@f80ae1816384bb7e8e82d193b22644e17f561f19
```

Claim boundary: closed source-faithful 128-task paired measurement and artifact publication evidence.

## WB1 Gen28 adoption

```text
mykcs/openevo-experiment@c2791000a3af97190c264ba5ea39f0c4e5f65823
```

Claim boundary: historical Gen28/state-v28 adoption boundary; not current global research state.

## `202609021800` predecessor design refs

```text
Stage1 design/freeze: 1d08703c611292a2b6e6d88455add1d762957958
MiniMax successor: c60419cad2e4ff0aad0b7e22177ac6e16475fe97
```

Claim boundary: predecessor design/analysis lineage; superseded as the active formal Stage1 entry point by PR #270.

## Historical arm archive

Website baseline includes provider/archive revision hints in:

```text
src/data/openEvoLegacyStage2Archive.ts
archiveRevision: f2d436659f060c6e1cba1fec391b1fbf20cec0dd
adapterRevision: cc64938ac0bbef573b631d2742e3b9f477aff36b
trajectoriesRevision: 9bdca2fcb80d3272b5c9c9a32fdc2f3873f03bbc
reusableDataRevision: 9bc053ffffa4453bad0a5f6f779c4b8e826ff70a
runtime digest: sha256:d0f8796010899ae41a7af8ae3f44f47b96dea73b297b5af124049b3ae88e2850
```

These are sufficient to retain the existing archive pages without deleting evidence, but not sufficient for new cross-page canonical duplication. Phase D must rebuild the canonical run/asset/provider join.

---

# 13. Phase C acceptance

Phase C acceptance condition:

> No planned rewrite relies on an undated website statement as its own source of truth.

Satisfied because:

1. mutable current-state claims have been resolved either to a bounded active upstream object or marked superseded/stale;
2. completed Track A/WB1/H1.x/legacy-arm evidence is explicitly historical rather than silently promoted to current;
3. unresolved historical asset/run joins are flagged for Phase D instead of guessed;
4. conflicting current-state claims are resolved by object ownership and immutable evidence, not by whichever website page looks newest;
5. tests/docs that would force stale phase/design/next-step wording are enumerated before implementation begins.

No runtime page, scientific protocol, experiment execution, provider object, or historical evidence is mutated by this Phase-C document.