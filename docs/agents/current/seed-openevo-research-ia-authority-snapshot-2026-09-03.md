# SEED × OpenEvo Research IA Authority Snapshot — 2026-09-03

Status: **ACTIVE AUDIT SNAPSHOT**
Scope: Phase A authority freeze for `seed-openevo-research-information-architecture-masterplan.md`.
Audit date: **2026-09-03 (SGT)**

This note freezes the repository refs and precedence used by the first website identity/provenance audit. It exists to prevent the audit from silently mixing facts from different experiment lineages or dates.

## 1. Website audit baseline

The website baseline for this audit is:

```text
repository: mykcs/basemodel
branch: main
commit: 3151686bdc594e723d08764b180532e86ef02fd3
```

This commit includes the identity-driven information-architecture masterplan merged from PR #417. All Phase B route/content inventory should compare against this exact tree unless a later snapshot is explicitly opened.

## 2. OpenEvo authority refs

The first audit intentionally uses more than one OpenEvo ref because merged governance, the currently active scientific lineage, and the newer draft asset-control plane are not the same Git object.

### 2.1 Merged governance baseline

```text
repository: mykcs/openevo-experiment
branch: main
commit: 8692bf6dfbfdb948b7f6a7229fb65f26a49566a9
```

Use this ref for merged repository governance and the stable parent standards.

Relevant merged governance milestone:

```text
PR #271 merge commit: bb57c88eb5de3036dee3ea9b095bc550dd6882c8
purpose: unify cross-platform experiment asset identity
```

The current website Experiment Designs component pins this `bb57c88...` governance snapshot when it links to the dry-run design-family/public-safe evidence.

### 2.2 Active shared Stage 1 scientific lineage

For current shared Stage 1 identity and provenance, use the active draft lineage:

```text
PR: #270
branch: research/shared-stage1-min-deliberation-final-candidate-20260903
head: 8c039ec0ef63f1e2f94e2c8f091d48f371e58c0f
freeze: 202609030400
scientific decision: FREEZE_ONE_SHARED_STAGE1_HARNESS
```

The PR records the canonical formal runs as:

```text
qwen25-3b-stage1-202609030400
qwen3-1p7b-stage1-202609030400
```

and pins formal execution to `362271d3cdc411581dd7f09d98d5ce69cfb1cb57` while preserving the qualified generation-semantics SHA separately.

**Important boundary:** this PR is the authority for that active Stage 1 lineage, not a blanket replacement for every historical OpenEvo campaign.

### 2.3 Draft autonomous/asset-control-plane evidence

The newer end-to-end control plane is still Draft and therefore is supplementary audit evidence rather than merged scientific authority:

```text
PR: #268
branch: research/ceiling1-autonomous-campaign-clean-20260903
head: 9b410451ea5184e238a51f88f99d6c65fad29e80
```

It is useful for Phase D because it extends the merged cross-platform standard into Provider Observation Registry, Canonical Asset Graph, asset contracts, and Server Run Passports. Its derived identity/navigation records cannot override frozen preregistrations, immutable Git state, execution receipts, or reconciliations.

## 3. Current-campaign conflict found during Phase A

The audit found a material routing inconsistency that must not be hidden by the website.

At merged `openevo-experiment/main@8692bf6...`, `configs/experiment/current-campaign.json` still points to the older WB1 Track B continuation:

```text
campaign_id: 20260821-2341-wb1-seed-aligned-webshop-benchmark
phase: WB1-TRACKB-CONTINUATION
```

At active PR #270 head `8c039ec...`, the inherited `configs/experiment/current-campaign.json` points to an older 7B Ceiling-1.0 Stage2 Agent-contract recovery state:

```text
campaign_id: 20260830-openevo-ceiling-1.0-webshop
phase: CEILING-1.0-STAGE2-7B-AGENT-CONTRACT-RECOVERY-V1
```

But PR #270 itself explicitly declares the current shared Stage 1 rerun/freeze `202609030400` as the active lineage it owns.

Therefore, for this audit:

> `current-campaign.json` is not sufficient by itself to resolve the current global research state. The audit must resolve each scientific object against the exact lineage/preregistration/receipt that owns it, and Phase C/D must record the stale-router debt explicitly.

No public page should turn either stale `current-campaign.json` value into an undated “current experiment” claim.

## 4. Standards reconciled in Phase A

All files below were read from `openevo-experiment@8692bf6dfbfdb948b7f6a7229fb65f26a49566a9`.

### Cross-platform identity standard

```text
docs/operations/governance/CROSS_PLATFORM_EXPERIMENT_ASSET_STANDARD.md
blob: 2b8bfeb54dd82c7c0c3fb9a4090dbfc40fc96042
```

Rules carried forward:

- canonical hierarchy is program → benchmark/research line → campaign → design → run → asset → provider revision;
- Git-backed scientific identity outranks provider display metadata;
- server, W&B, HF, Kaggle, and website have distinct roles;
- website consumes a public-safe projection and must not become a second experiment-state database;
- lifecycle, scientific validity, and asset lifecycle are separate axes;
- historical aliases are preserved instead of renaming frozen identity;
- one public design family represents one real scientific question, not one config file.

### Experiment standard parent

```text
docs/operations/governance/EXPERIMENT_STANDARD.md
```

Rules carried forward:

- scientific identity and display names are distinct;
- immutable Git + Run Manifest is canonical provenance;
- W&B is observational, not sole authority;
- protocol/runtime fingerprints remain distinct;
- campaign identity represents a frozen scientific question/comparison contract;
- runtime failure, protocol invalidity, valid-negative evidence, and tracking degradation are distinct;
- authority propagation is a transaction from committed amendment/preregistration through routing, activation/validation, and execution receipts.

### Artifact archive/publication parent

```text
docs/operations/publication/ARTIFACT_ARCHIVE_AND_PUBLICATION_STANDARD.md
blob: 019651cf7ce122fafce083553e557b15a8864c05
```

Rules carried forward:

- GitHub stores compact source/config/manifest/receipt identity;
- authorized checkpoint/adapter bytes belong on HF with immutable revision + exact verification;
- runtime images use immutable digests and remain separate assets;
- raw rollouts and large/private data are not public by default;
- `REMOTE_VERIFIED_EXACT`, `RECONSTRUCTIBLE_PINNED`, and `UNVERIFIED_OR_UNIQUE` are different recovery claims;
- remote verification never implies delete authorization;
- publication failure is a delivery failure and must not change scientific treatment or cause a rerun.

## 5. Basemodel presentation/engineering contracts read

All files below were read at `basemodel@3151686bdc594e723d08764b180532e86ef02fd3`.

- `docs/agents/current/scientific-state-provenance.md` — public pages are derived views; current claims must be branch/SHA/date/claim-boundary aware.
- `docs/agents/current/seed-openevo-research-mission-first-principles.md` — the site is a research workbench connecting model, method, benchmark, evidence, and improvement.
- `docs/agents/current/research-site-presentation-contract.md` — visible order is scientific question → result → decisive evidence → interpretation → boundary; implementation depth is progressive disclosure.
- `docs/agents/current/website-design-spec.md` — “说人话” means subject/fact first, then conclusion/mechanism/evidence; internal labels cannot precede the thing they describe.
- `docs/agents/current/sitewide-visual-knowledge-architecture.md` — visual hierarchy must express dependency, sequence, comparison, evidence, and decision rather than mirror repository folders.
- `docs/agents/current/deployment-policy.md` — current CI/deployment authority; provider execution details must be read live from that policy rather than frozen into this 2026-09-03 research-IA snapshot.

These contracts do not override scientific evidence. When presentation guidance and current scientific truth disagree, scientific truth wins and the stale presentation rule must be updated.

## 6. Existing Experiment Designs implementation audit

Current implementation inspected at:

```text
basemodel@3151686bdc594e723d08764b180532e86ef02fd3
src/components/research/OpenEvoExperimentDesignCatalog.astro
```

### Hard-coded today

The component itself currently owns scientific-looking data that should eventually move into a validated public-safe projection:

- `governanceSha = bb57c88...`;
- design-family IDs and ordering;
- Chinese/English family summaries and scientific questions;
- lifecycle/status display strings;
- model membership;
- `memberSets`;
- member labels, status, source SHA, and source path;
- the autonomous campaign summary and members;
- dry-run catalog/summary URL roots.

The component constructs source URLs from those embedded SHA/path pairs, but that URL construction does not make the underlying scientific data generated.

### Generated/derived behavior today

- locale selection (`zh`/`en`);
- presentation markup;
- provider-brand rendering through the existing external-brand component;
- source URLs computed from already hard-coded member metadata.

### What is not yet happening

- no build-time ingestion of a canonical upstream public-safe projection as the scientific source;
- no shared design → run → asset → provider-revision graph driving the component;
- no automatic refresh when upstream lifecycle/validity/provider bindings change;
- no projection-level validation preventing a stale embedded family/member snapshot from surviving indefinitely.

The existing test `src/lib/openEvoExperimentDesignCatalog.test.ts` primarily protects the mounted component/source contract; it does not prove freshness against an upstream registry.

The existing grouping is useful and should be retained as presentation logic, but the component must become a consumer rather than a scientific authority.

## 7. Audit snapshot and no-silent-mixing rule

Phase B–D begins from this frozen snapshot:

```text
basemodel website tree:
  main@3151686bdc594e723d08764b180532e86ef02fd3

openevo merged governance:
  main@8692bf6dfbfdb948b7f6a7229fb65f26a49566a9

active shared Stage1 lineage:
  PR270 / research/shared-stage1-min-deliberation-final-candidate-20260903
  @8c039ec0ef63f1e2f94e2c8f091d48f371e58c0f

supplementary draft asset/control-plane evidence:
  PR268 / research/ceiling1-autonomous-campaign-clean-20260903
  @9b410451ea5184e238a51f88f99d6c65fad29e80

existing website catalog governance snapshot:
  openevo-experiment@bb57c88eb5de3036dee3ea9b095bc550dd6882c8
```

If any of these refs moves while B–D is in progress, do not silently combine old inventory rows with new upstream facts. Either:

1. finish the bounded audit against this snapshot and record later changes as post-snapshot drift; or
2. open a clearly labelled successor snapshot and re-run affected rows.

## 8. Precedence for this audit

When two sources disagree, use this order:

1. current explicit owner instruction;
2. immutable frozen prereg/design plus exact execution receipts/reconciliation for the scientific object being discussed;
3. the exact active scientific lineage that owns that object (for current Stage 1, PR #270 head above);
4. merged `openevo-experiment` governance/standards at `8692bf6...`;
5. validated registry / Asset Graph / public-safe projection, with Draft records visibly marked Draft/derived;
6. provider metadata on W&B/HF/Kaggle;
7. `basemodel` website copy/components/tests.

Recency alone never outranks object ownership or immutable evidence.

## 9. Phase A acceptance

Phase A is accepted when the masterplan records A01–A07 complete and links to this note. This note is the authority record required by the Phase A acceptance criterion.
