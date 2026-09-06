# SEED × OpenEvo Research IA — Phase A Authority Revalidation

Status: **PHASE A REVALIDATED / ACCEPTED**
Revalidation time: **2026-09-03 20:59:37 SGT**
Repository: `mykcs/basemodel`
Masterplan: [seed-openevo-research-information-architecture-masterplan.md](./seed-openevo-research-information-architecture-masterplan.md)
Original snapshot: [2026-09-03 authority snapshot](./seed-openevo-research-ia-authority-snapshot-2026-09-03.md)

This note re-checks the Phase A authority boundary against the GitHub state visible at the revalidation time. It does not silently replace the original bounded audit baseline used by the Phase B/C documents.

## 1. Current GitHub refs

| Role | Repository / ref | Exact identity | Evidence |
| --- | --- | --- | --- |
| Current website main | `mykcs/basemodel/main` | `ec12bb5fd2809acad330f5530bfeb0c5cc1f553c` | [commit](https://github.com/mykcs/basemodel/commit/ec12bb5fd2809acad330f5530bfeb0c5cc1f553c) |
| Original website audit baseline | `mykcs/basemodel/main` | `3151686bdc594e723d08764b180532e86ef02fd3` | [merge commit for PR #417](https://github.com/mykcs/basemodel/commit/3151686bdc594e723d08764b180532e86ef02fd3) |
| OpenEvo merged governance/main | `mykcs/openevo-experiment/main` | `8692bf6dfbfdb948b7f6a7229fb65f26a49566a9` | [current main commit](https://github.com/mykcs/openevo-experiment/commit/8692bf6dfbfdb948b7f6a7229fb65f26a49566a9) |
| Active shared Stage 1 lineage | PR #270, `research/shared-stage1-min-deliberation-final-candidate-20260903` | head `8c039ec0ef63f1e2f94e2c8f091d48f371e58c0f`, still Draft/open | [PR #270](https://github.com/mykcs/openevo-experiment/pull/270) |
| Supplementary autonomous/asset-control-plane evidence | PR #268, `research/ceiling1-autonomous-campaign-clean-20260903` | head `9b410451ea5184e238a51f88f99d6c65fad29e80`, still Draft/open | [PR #268](https://github.com/mykcs/openevo-experiment/pull/268) |
| Merged cross-platform governance milestone | PR #271 merge | `bb57c88eb5de3036dee3ea9b095bc550dd6882c8` | [PR #271](https://github.com/mykcs/openevo-experiment/pull/271) |
| Parent server policy | `mykcs/zju-server/main` | `c426ccd9d325c2fac73bb5cc69d5e84f87668b74` | [current parent commit](https://github.com/mykcs/zju-server/commit/c426ccd9d325c2fac73bb5cc69d5e84f87668b74) |

The original `3151686…` ref remains the correct Phase B/C comparison baseline because those bounded audit documents explicitly say they were computed against it. The later `ec12bb5…` ref is recorded as current-main drift, not substituted into old inventory rows.

## 2. Authority documents read and reconciled

### OpenEvo identity and experiment standards

- [Cross-platform Experiment Asset Standard](https://github.com/mykcs/openevo-experiment/blob/8692bf6dfbfdb948b7f6a7229fb65f26a49566a9/docs/operations/governance/CROSS_PLATFORM_EXPERIMENT_ASSET_STANDARD.md), blob `2b8bfeb54dd82c7c0c3fb9a4090dbfc40fc96042`.
- [Experiment Standard](https://github.com/mykcs/openevo-experiment/blob/8692bf6dfbfdb948b7f6a7229fb65f26a49566a9/docs/operations/governance/EXPERIMENT_STANDARD.md), blob `6a6fc1079c798dc64a86fa08de817c1931a98b9d`.
- [Artifact Archive and Publication Standard](https://github.com/mykcs/openevo-experiment/blob/8692bf6dfbfdb948b7f6a7229fb65f26a49566a9/docs/operations/publication/ARTIFACT_ARCHIVE_AND_PUBLICATION_STANDARD.md), blob `019651cf7ce122fafce083553e557b15a8864c05`.
- [OpenEvo AGENTS.md](https://github.com/mykcs/openevo-experiment/blob/8692bf6dfbfdb948b7f6a7229fb65f26a49566a9/AGENTS.md), blob `542269ac0c931d75eccc79507a9b813064ec4681`.

Reconciled rule: Git-backed identity, frozen design/preregistration, run manifests, receipts, and reconciliations govern scientific state; provider metadata is a binding/observability layer; the website consumes public-safe derived data and never becomes a second experiment-state database.

### Parent server policy

The standard names the parent host policy, so the parent entry points were also read:

- [zju-server AGENTS.md](https://github.com/mykcs/zju-server/blob/c426ccd9d325c2fac73bb5cc69d5e84f87668b74/AGENTS.md), blob `a1ba2de6f2312276a2a4fc5a12a4bef224a55be0`.
- [Experiment execution policy](https://github.com/mykcs/zju-server/blob/c426ccd9d325c2fac73bb5cc69d5e84f87668b74/docs/experiment-execution-policy.md), blob `4e027efa2bca1e081a18666229996502fa4dbc2a`.
- [Research artifact lifecycle policy](https://github.com/mykcs/zju-server/blob/c426ccd9d325c2fac73bb5cc69d5e84f87668b74/docs/research-artifact-lifecycle.md), blob `b567493609420badd34c2f7d2db9168166f203cb`.

Reconciled rule: host/shared-resource policy, experiment semantics, publication/retention, and public visibility remain separate boundaries. A server observation or publication pointer does not by itself prove ownership, current scientific validity, or deletion authorization.

### Basemodel contracts and implementation

The following current contracts were read at the original bounded website baseline `basemodel@3151686bdc594e723d08764b180532e86ef02fd3`; their current-main copies were also checked for the revalidation:

- [Scientific-state provenance](https://github.com/mykcs/basemodel/blob/main/docs/agents/current/scientific-state-provenance.md) — public pages are derived, source/SHA/date/claim-boundary aware.
- [Research mission](https://github.com/mykcs/basemodel/blob/main/docs/agents/current/seed-openevo-research-mission-first-principles.md) — the site is a research workbench connecting model, method, benchmark, evidence, and improvement.
- [Research-site presentation contract](https://github.com/mykcs/basemodel/blob/main/docs/agents/current/research-site-presentation-contract.md) — question, result, evidence, interpretation, boundary, then optional implementation depth.
- [Layered technical explainer copy](https://github.com/mykcs/basemodel/blob/main/docs/agents/current/layered-technical-explainer-copy.md) and [website design / copy specification](https://github.com/mykcs/basemodel/blob/3151686bdc594e723d08764b180532e86ef02fd3/docs/agents/current/website-design-spec.md) — Chinese-first, object/fact before internal labels and mechanism.
- [Sitewide visual knowledge architecture](https://github.com/mykcs/basemodel/blob/main/docs/agents/current/sitewide-visual-knowledge-architecture.md) — visual structure expresses dependency, sequence, comparison, evidence, and decision.
- [Deployment policy](https://github.com/mykcs/basemodel/blob/main/docs/agents/current/deployment-policy.md) — current CI/deployment authority; do not restore a provider identity from this dated revalidation record.

The current [OpenEvoExperimentDesignCatalog.astro](https://github.com/mykcs/basemodel/blob/main/src/components/research/OpenEvoExperimentDesignCatalog.astro) remains a hard-coded catalog at blob `b4ace58970e1a6c60782fb8b7f53057854d6d7d2`: family data, statuses, member sets, source SHAs/paths, and provider-evidence roots are embedded in the component. Locale selection, markup, provider-mark rendering, and URL construction are derived from that embedded data. No upstream generated public-safe projection currently drives it.

## 3. Precedence and conflict handling

For this research IA audit, the effective order is:

1. current explicit owner instruction;
2. frozen preregistration/design plus exact execution receipt/reconciliation for the object;
3. the exact active lineage that owns the object, such as PR #270 for the shared Stage 1 rerun;
4. merged OpenEvo governance and standards at `8692bf6…`;
5. validated registry / Asset Graph / public-safe projection, visibly marked Draft/derived when applicable;
6. provider metadata on W&B, Hugging Face, or Kaggle;
7. website copy, components, and tests.

The revalidation confirms that PR #270 and PR #268 remain Draft and that the OpenEvo `current-campaign.json` router is not sufficient to override object-level frozen lineage/receipt evidence. Later website commits do not retroactively change the original audit baseline.

## 4. Acceptance decision

All seven Phase A criteria are satisfied:

- **A01:** exact original website audit baseline recorded; current `main` drift recorded separately.
- **A02:** OpenEvo governance/main, active Stage 1 PR, supplementary Draft control-plane PR, and parent policy refs recorded.
- **A03:** cross-platform identity standard read and reconciled.
- **A04:** artifact publication standard, experiment-standard parent, repository AGENTS rules, and parent server policy read and reconciled.
- **A05:** required Basemodel provenance, mission, presentation, copy, visual, and deployment contracts read.
- **A06:** Experiment Designs component inspected; hard-coded scientific-looking fields and derived presentation behavior documented.
- **A07:** dated no-silent-mixing snapshot preserved; subsequent main movement is explicitly classified as drift.

Therefore Phase A remains **accepted**. No Phase B–N checkbox is changed by this revalidation, and no scientific run is started, resumed, modified, or restarted.
