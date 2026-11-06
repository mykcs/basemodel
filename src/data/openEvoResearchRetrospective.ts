/** Immutable historical inventory projection; not a live experiment registry.
 * Source: openevo-experiment@2c05d2692, historical ledger dated2026-08-21.
 * Forty sealed-result records include continuations and protocol variants.
 */
export const HISTORICAL_RESEARCH_RECORDS = [
  {
    "id": "phase-g",
    "status": "diagnostic-only",
    "finding": "The real adapter lifecycle worked, but near-zero reward prevented a naive adapter-efficacy interpretation.",
    "boundary": "Diagnostic-only dated narrative; exact raw rows are not independently machine-reconciled here, and this is not fresh-task self-evolution evidence.",
    "evidence": "docs/reports/OPEN_EVO_WEBSHOP_PROGRESS_REPORT_2026-08-15.md"
  },
  {
    "id": "h0-original-queue",
    "status": "sealed-result",
    "finding": "The frozen 3B base has bounded natural success on selected train-only tasks.",
    "boundary": "Does not establish transfer or an OpenEvo treatment effect.",
    "evidence": "docs/evidence/remote-runs/2026-08-15/h0-final/evidence/h0-final-reconciliation.json"
  },
  {
    "id": "h0.1-success-discovery-v2",
    "status": "sealed-result",
    "finding": "A reusable native-Qwen positive reservoir exists.",
    "boundary": "Train-only supply evidence; not held-out adaptation efficacy.",
    "evidence": "docs/evidence/remote-runs/2026-08-17/h0.1/evidence/h0.1-reconciliation.json"
  },
  {
    "id": "h1.1",
    "status": "sealed-result",
    "finding": "Likelihood/fit behavior was measurable without establishing closed-loop improvement.",
    "boundary": "Offline likelihood evidence is not WebShop reward transfer.",
    "evidence": "docs/evidence/server-snapshots/2026-08-18/phase-h1.1-cross-arm-trace-likelihood-v1-20260814/evidence/h1.1-reconciliation-v1.json"
  },
  {
    "id": "h1.2",
    "status": "sealed-result",
    "finding": "Greedy decoding exposed output-budget/action-contract validity problems.",
    "boundary": "Invalid/confounded reward rows do not support efficacy.",
    "evidence": "docs/evidence/server-snapshots/2026-08-18/phase-h1.2-decoding-calibration-transfer-v1-20260814/evidence/h1.2-reconciliation-v1.json"
  },
  {
    "id": "h1.3-original",
    "status": "invalid",
    "finding": "The original output-budget protocol did not isolate the intended variable.",
    "boundary": "Protocol/invalid engineering history only.",
    "evidence": "configs/experiment/h1.3-greedy-output-budget.json"
  },
  {
    "id": "h1.3-repair",
    "status": "sealed-result",
    "finding": "The repair separated GPU binding/output validity from scientific reward.",
    "boundary": "Runtime repair does not by itself establish adapter benefit.",
    "evidence": "docs/evidence/server-snapshots/2026-08-18/phase-h1.3-greedy-output-budget-repair-v1-20260814/evidence/h1.3-reconciliation-v1.json"
  },
  {
    "id": "h1.4-original",
    "status": "superseded-protocol",
    "finding": "Compact prompting required runtime repairs before interpretation.",
    "boundary": "Protocol only.",
    "evidence": "configs/experiment/h1.4-compact-action-prompt.json"
  },
  {
    "id": "h1.4-runtime-repair-v1",
    "status": "superseded-protocol",
    "finding": "The first JDK-only repair was insufficient as the final contract.",
    "boundary": "Superseded engineering protocol.",
    "evidence": "configs/experiment/h1.4-compact-action-prompt-runtime-repair.json"
  },
  {
    "id": "h1.4-runtime-repair-v2",
    "status": "sealed-result",
    "finding": "The runnable compact-v2 action contract was established.",
    "boundary": "Runtime/action validity is not general transfer.",
    "evidence": "docs/evidence/server-snapshots/2026-08-18/phase-h1.4-compact-action-prompt-runtime-repair-v2-20260814/evidence/h1.4-reconciliation-v1.json"
  },
  {
    "id": "h1.5",
    "status": "sealed-result",
    "finding": "Compact-v2 behavior could be checked on fresh seeds, but no broad transfer claim followed.",
    "boundary": "Calibration/task-panel evidence only.",
    "evidence": "docs/evidence/server-snapshots/2026-08-18/phase-h1.5-compact-recovery-action-calibration-v1-20260814/evidence/h1.5-reconciliation-v1.json"
  },
  {
    "id": "h1.6",
    "status": "sealed-result",
    "finding": "The seen-task rescue did not establish held-out reward transfer.",
    "boundary": "Contract/state-distribution diagnosis, not a positive transfer result.",
    "evidence": "docs/evidence/server-snapshots/2026-08-18/phase-h1.6-heldout-state-distribution-v1-20260814/evidence/h1.6-reconciliation-v1.json"
  },
  {
    "id": "h1.7",
    "status": "diagnostic-only",
    "finding": "Trajectory differences motivated state-aware action selection.",
    "boundary": "Descriptive and hypothesis-generating only.",
    "evidence": "configs/experiment/h1.7-offline-state-distribution-diagnosis.json"
  },
  {
    "id": "h1.8",
    "status": "sealed-result",
    "finding": "A selective state-aware rescue appeared on a held-out task, with strong task heterogeneity.",
    "boundary": "Task-specific rescue, not general transfer.",
    "evidence": "docs/evidence/portable-runs/h1.8-reconciliation-v1.json"
  },
  {
    "id": "h1.9",
    "status": "sealed-result",
    "finding": "The H1.8 rescue replicated on fresh seeds but remained task-specific.",
    "boundary": "Replication on one task identity is not broad generalization.",
    "evidence": "docs/evidence/portable-runs/h1.9-reconciliation-v1.json"
  },
  {
    "id": "h1.10",
    "status": "sealed-result",
    "finding": "New-task positives occurred, but the effect was arm-independent rather than state-aware selective.",
    "boundary": "Positive outcomes do not identify an OpenEvo treatment effect.",
    "evidence": "docs/evidence/remote-runs/2026-08-15/h1.10/evidence/h1.10-reconciliation-v2.json"
  },
  {
    "id": "h1.11",
    "status": "sealed-result",
    "finding": "Positive supervision fitted better than failure supervision but did not improve fresh-task closed-loop behavior.",
    "boundary": "Fit is not behavioral transfer.",
    "evidence": "docs/evidence/remote-runs/2026-08-15/h1.11/evidence/h1.11-reconciliation-v1.json"
  },
  {
    "id": "h1.12",
    "status": "sealed-result",
    "finding": "State-aware cues did not selectively recover the fitted adapter.",
    "boundary": "Negative diagnostic; no global impossibility claim.",
    "evidence": "docs/evidence/remote-runs/2026-08-15/h1.12/evidence/h1.12-reconciliation-v1.json"
  },
  {
    "id": "h1.13",
    "status": "sealed-result",
    "finding": "Action-only targets fitted but did not create selective closed-loop transfer.",
    "boundary": "Rules out this target-format explanation under the tested contract only.",
    "evidence": "docs/evidence/remote-runs/2026-08-15/h1.13/evidence/h1.13-reconciliation-v1.json"
  },
  {
    "id": "h1.14",
    "status": "sealed-result",
    "finding": "A recovery corpus was prepared, but the planned successful-state teacher control was not established by the original route.",
    "boundary": "No H1.14 comparative scientific result.",
    "evidence": "docs/evidence/remote-runs/2026-08-15/h1.14/evidence/h1.14-teacher-artifact.json"
  },
  {
    "id": "h1.15",
    "status": "invalid",
    "finding": "Carrier behavior was heterogeneous, but the comparison was not strict-causal.",
    "boundary": "Prefer H1.16 for carrier claims.",
    "evidence": "docs/evidence/remote-runs/2026-08-15/h1.15/evidence/h1.15-reconciliation-v1.json"
  },
  {
    "id": "h1.16",
    "status": "sealed-result",
    "finding": "BASE, text memory, and parametric carrier had zero qualified positives and zero paired carrier gain.",
    "boundary": "Clean negative on this panel; not proof that all carriers can never work.",
    "evidence": "docs/evidence/remote-runs/2026-08-15/h1.16/evidence/h1.16-reconciliation-v1.json"
  },
  {
    "id": "h1.17",
    "status": "sealed-result",
    "finding": "Doubling the horizon from 15 to 30 did not recover reward; oracle paths showed some tasks were feasible.",
    "boundary": "Horizon-only explanation weakened; reachability remains task-dependent.",
    "evidence": "docs/evidence/remote-runs/2026-08-15/h1.17/evidence/h1.17-reconciliation-v1.json"
  },
  {
    "id": "h1.18",
    "status": "sealed-result",
    "finding": "No cross-partition selective recovery gain was established.",
    "boundary": "Closed negative under the frozen recovery-vs-success contract.",
    "evidence": "docs/evidence/remote-runs/2026-08-15/h1.18/evidence/h1.18-reconciliation-v3.json"
  },
  {
    "id": "h1.19",
    "status": "sealed-result",
    "finding": "Neither text memory nor parametric SD-LoRA produced a paired carrier gain.",
    "boundary": "No carrier sweep is authorized from this negative result.",
    "evidence": "docs/evidence/remote-runs/2026-08-15/h1.19/evidence/h1.19-reconciliation-v1.json"
  },
  {
    "id": "h1.20",
    "status": "sealed-result",
    "finding": "Hiding inadmissible retrieved actions did not recover reward.",
    "boundary": "Action filtering alone is not supported as the missing mechanism.",
    "evidence": "docs/evidence/remote-runs/2026-08-15/h1.20/evidence/h1.20-reconciliation-v1.json"
  },
  {
    "id": "h1.21",
    "status": "sealed-result",
    "finding": "A sufficient horizon plus action admissibility still did not recover reward.",
    "boundary": "The tested interface branch closed; no universal agent-interface conclusion.",
    "evidence": "docs/evidence/remote-runs/2026-08-15/h1.21/evidence/h1.21-reconciliation-v1.json"
  },
  {
    "id": "h1.22",
    "status": "sealed-result",
    "finding": "Base behavior clustered by task complexity, descriptively.",
    "boundary": "Completed descriptive-only; no adaptation effect.",
    "evidence": "docs/evidence/remote-runs/2026-08-15/h1.22/evidence/h1.22-reconciliation-v1.json"
  },
  {
    "id": "h1.23",
    "status": "sealed-result",
    "finding": "Task-family heterogeneity was observed descriptively.",
    "boundary": "Exploratory/descriptive; Q3 remained closed.",
    "evidence": "docs/evidence/remote-runs/2026-08-15/h1.23/evidence/h1.23-reconciliation-v1.json"
  },
  {
    "id": "h1.24",
    "status": "sealed-result",
    "finding": "Task-level clustering received a bounded replication check.",
    "boundary": "Descriptive stability evidence; no OpenEvo efficacy claim.",
    "evidence": "docs/evidence/remote-runs/2026-08-15/h1.24/evidence/h1.24-reconciliation-v1.json"
  },
  {
    "id": "h1.25",
    "status": "sealed-result",
    "finding": "The terminal-transition pattern was tested on independent task identities.",
    "boundary": "Completed descriptive-only; no method effect.",
    "evidence": "docs/evidence/remote-runs/2026-08-15/h1.25/evidence/h1.25-reconciliation-v1.json"
  },
  {
    "id": "h1.26",
    "status": "sealed-result",
    "finding": "Product grounding changed click behavior but not score/win.",
    "boundary": "Negative interface diagnostic.",
    "evidence": "docs/evidence/remote-runs/2026-08-15/h1.26/evidence/h1.26-reconciliation-v1.json"
  },
  {
    "id": "h1.27",
    "status": "sealed-result",
    "finding": "Scaling/comparable small models did not yield a complete multi-task winner.",
    "boundary": "Scale-only not supported or task-local; no OpenEvo causal result.",
    "evidence": "docs/evidence/remote-runs/2026-08-15/h1.27/evidence/h1.27-reconciliation-v1.json"
  },
  {
    "id": "h1.28",
    "status": "sealed-result",
    "finding": "Exact oracle-action labels were not supported; paired delta was -0.3 versus both controls.",
    "boundary": "Negative label-fidelity result; no Q3 opening.",
    "evidence": "docs/evidence/remote-runs/2026-08-16/h1.28/evidence/h1.28-reconciliation-v1.json"
  },
  {
    "id": "h1.29",
    "status": "sealed-result",
    "finding": "Pure self-evolution did not produce a BASE/SELF held-out score gain.",
    "boundary": "Closed negative on the frozen 3B contract; config draft text is historical, not current status.",
    "evidence": "docs/evidence/remote-runs/2026-08-16/h1.29/evidence/h1.29-reconciliation-v1.json"
  },
  {
    "id": "h1.30-seed-comparison",
    "status": "protocol-only",
    "finding": "The formal matched comparison was blocked before execution.",
    "boundary": "No OpenEvo-versus-SEED superiority or equivalence claim.",
    "evidence": "docs/evidence/remote-runs/2026-08-17/h1.30/H1.30_STATUS.md"
  },
  {
    "id": "h1.30-seed-route-qualification",
    "status": "diagnostic-only",
    "finding": "The SEED route reached a clean checkpoint-reload technical gate.",
    "boundary": "Engineering readiness is not method efficacy.",
    "evidence": "docs/evidence/remote-runs/2026-08-17/h1.30/evidence/h1.30-seed-route-qualification-rc15.json"
  },
  {
    "id": "h1.30-task-identity-diagnostic",
    "status": "diagnostic-only",
    "finding": "Positive supply was task-identity-dependent and insufficient for the formal gate.",
    "boundary": "No formal method-comparison denominator.",
    "evidence": "docs/evidence/remote-runs/2026-08-17/h1.30/evidence/h1.30-task-identity-diagnostic-reconciliation.json"
  },
  {
    "id": "h1.31",
    "status": "sealed-result",
    "finding": "Teacher bootstrap was a closed negative result.",
    "boundary": "Does not support teacher-assisted improvement, pure self-evolution, or generalization.",
    "evidence": "docs/reports/OPEN_EVO_WEBSHOP_CHECKPOINT_2026-08-17-H1.31.md"
  },
  {
    "id": "h1.32",
    "status": "diagnostic-only",
    "finding": "The frozen adapter showed paired delta 0 on the consumed replacement panel.",
    "boundary": "Non-formal transfer diagnostic; config launch authorization is historical.",
    "evidence": "docs/evidence/server-snapshots/2026-08-18/phase-h1.32-openevo-transfer-v2-20260817/evidence/h1.32-transfer-reconciliation.json"
  },
  {
    "id": "h1.33",
    "status": "diagnostic-only",
    "finding": "Positive replay did not improve fresh-task behavior; BASE mean 0.142857 and SELF mean 0 on complete-valid tasks.",
    "boundary": "No OpenEvo efficacy or SEED comparison claim.",
    "evidence": "docs/evidence/remote-runs/2026-08-17/h1.33/evidence/h1.33-reconciliation.json"
  },
  {
    "id": "h1.34",
    "status": "diagnostic-only",
    "finding": "Validity improved, but mean score remained 0 with no qualified positives.",
    "boundary": "Diagnostic-only: parser repair retained, with no behavioral gain claim. The immutable artifact inherits H1.30 schema/claim metadata despite H1.34 source rows and identity; that provenance mismatch is disclosed, not rewritten.",
    "evidence": "docs/evidence/remote-runs/2026-08-17/h1.34/evidence/h1.34-parser-contract-diagnostic-reconciliation.json"
  },
  {
    "id": "h1.35",
    "status": "diagnostic-only",
    "finding": "The prompt shifted loop types but mean score stayed 0.",
    "boundary": "Diagnostic-only: prompt sweep closed, with no transfer claim. The immutable artifact inherits H1.30 schema/claim metadata despite H1.35 source rows and identity; that provenance mismatch is disclosed, not rewritten.",
    "evidence": "docs/evidence/remote-runs/2026-08-17/h1.35/evidence/h1.35-state-aware-navigation-diagnostic-reconciliation.json"
  },
  {
    "id": "h1.36",
    "status": "sealed-result",
    "finding": "The 7B self-evolution result was completed-negative and underpowered/null-like.",
    "boundary": "Does not prove self-evolution is impossible; no hyperparameter sweep authorized.",
    "evidence": "docs/evidence/remote-runs/2026-08-18/h1.36/evidence/h1.36-reconciliation-v3.json"
  },
  {
    "id": "h1.37",
    "status": "sealed-result",
    "finding": "No resolved fresh-task transfer from the frozen H1.36 adapter; result was underpowered.",
    "boundary": "An unresolved/null-like estimate is not proof of no transfer.",
    "evidence": "docs/evidence/remote-runs/2026-08-18/h1.37/evidence/h1.37-reconciliation.json"
  },
  {
    "id": "h1.37-r",
    "status": "sealed-result",
    "finding": "BASE-original and BASE-R matched exactly; contemporaneous SELF-vs-BASE remained null-like and underpowered.",
    "boundary": "Closes the period-instability explanation on the bridge, not the transfer question.",
    "evidence": "docs/evidence/remote-runs/2026-08-18/h1.37-r/evidence/h1.37-r-analysis.json"
  },
  {
    "id": "h1.38-reservoir-v1-aborted",
    "status": "invalid",
    "finding": "Pre-protocol work is retained only as an exclusion ledger.",
    "boundary": "No scientific result.",
    "evidence": "configs/experiment/h1.38-reservoir-v1-aborted-preprotocol-ledger.json"
  },
  {
    "id": "h1.38-reservoir-v2",
    "status": "sealed-result",
    "finding": "A finite endogenous reservoir supported a frozen pooled-diversity experiment.",
    "boundary": "Selector/supply evidence; it does not estimate transfer.",
    "evidence": "docs/evidence/remote-runs/2026-08-18/h1.38-reservoir/evidence/h1.38-selector.json"
  },
  {
    "id": "h1.38a-original",
    "status": "invalid",
    "finding": "The original campaign closed incomplete, underpowered, and non-inferential.",
    "boundary": "Must not be presented as the final diversity result.",
    "evidence": "docs/evidence/remote-runs/2026-08-19/h1.38a/evidence/h1.38a-reconciliation.json"
  },
  {
    "id": "h1.38a-c",
    "status": "sealed-result",
    "finding": "Task-weighted deltas versus BASE are D4 +0.011660, D8 -0.005792, D16 +0.055646; all task-cluster 95% intervals include zero and the ordered pattern is non-monotonic.",
    "boundary": "Complete fixed-panel result only; not adaptive continuation, reliable positive transfer, upstream continual-method causality, teacher/SEED superiority, or authorization for H1.38B.",
    "evidence": "docs/evidence/remote-runs/2026-08-19/h1.38a-c/evidence/h1.38a-c-combined-reconciliation.json"
  },
  {
    "id": "h1.38b-method-control",
    "status": "sealed-result",
    "finding": "SD-LoRA versus BASE has fresh task-weighted delta +0.124 with task-cluster bootstrap 95% CI [0.032622, 0.219356]; the selector is B1 and chooses H1.39-MR independent frozen replication.",
    "boundary": "Matched H1.38B WebShop method control only; B1 is a next-experiment selector, not an H1.39 result or universal transfer claim.",
    "evidence": "docs/evidence/remote-runs/2026-08-20/h1.38b-qualification/qualification.json"
  },
  {
    "id": "h1.38b-continuation-amendment-2026-08-20",
    "status": "sealed-result",
    "finding": "The pinned GPU gate passed and the frozen method-control matrix completed; B1 selects H1.39-MR independent frozen replication.",
    "boundary": "Continuation closeout and selector only; no follow-up task consumption is authorized without a new frozen contract and live gate.",
    "evidence": "docs/agent-handoffs/OPEN_EVO_WEBSHOP_H138B_CONTINUATION_AND_NEXT_2026-08-20.md"
  },
  {
    "id": "h1.39-mr-independent-replication",
    "status": "sealed-result",
    "finding": "R4 BOTH_REPLICATE: ordinary-BASE and SD-BASE are both positive with task-cluster bootstrap CI lower bounds above zero; R5 is a secondary positive SD-ordinary method difference.",
    "boundary": "Supports only the preregistered frozen-adapter fresh-task result on the committed task-ID-disjoint panel; no universal-transfer, upstream, or multi-generation self-evolution claim follows.",
    "evidence": "configs/experiment/manifests/h1.39-mr-exclusion-ledger-v1.json"
  },
  {
    "id": "h1.40-g2-multigeneration",
    "status": "protocol-only",
    "finding": "Formal H1.40 consumption was reclosed fail-closed at the runtime gate. G2 remains uncreated and T2 remains unevaluated.",
    "boundary": "Protocol and reproducibility evidence only; no H1.40 efficacy, multi-generation, recursive self-improvement, or GPU-resource claim follows until a separately authorized execution is reconciled.",
    "evidence": "configs/experiment/manifests/h1.40-g2-exclusion-ledger-v1.json"
  },
  {
    "id": "h1.40-g2-multigeneration-r2",
    "status": "sealed-result",
    "finding": "The frozen G1 E2 harvest/selector passed, the eight-increment G2 update route produced a cumulative 16-component adapter, and the complete upstream matrix was reconciled. Acquisition, retention, and preservation all failed their frozen gates; T2 was not evaluated.",
    "boundary": "Supports structural G2 training and a negative upstream-gate closeout only. No acquisition success, retention, preservation, fresh-task transfer, forgetting, T2, or multi-generation self-evolution claim follows.",
    "evidence": "configs/experiment/h1.40-r2-g2-multigeneration-v1.json"
  },
  {
    "id": "h1.40-g2-multigeneration-r2-path-contract",
    "status": "protocol-only",
    "finding": "The path contract is a pre-allocation invariant and does not authorize or imply experiment efficacy.",
    "boundary": "Infrastructure validation only; container visibility and permissions must be probed on the live runtime before allocation.",
    "evidence": "configs/experiment/h1.40-r2-path-contract-v1.json"
  },
  {
    "id": "h1.41-magnitude-screen",
    "status": "sealed-result",
    "finding": "H1.41 v2 completed its preregistered matched C0/C1 screen, but the selector is MEASUREMENT_INVALID. C0 acquisition had point estimate 0.0, C0 and C1 retention were identical at -0.065625 versus G1, and C1 had incomplete acquisition and preservation clusters. The reset-magnitude treatment is not supported as an improvement.",
    "boundary": "Completed updater-mechanism screen only; no magnitude-reset efficacy, fresh-task transfer, multi-generation, or H1.40/H1.41 T2 claim is supported.",
    "evidence": "configs/experiment/h1.41-magnitude-screen-v2.json"
  },
  {
    "id": "h1.41-magnitude-screen-v1-superseded",
    "status": "superseded-protocol",
    "finding": "Superseded by H1.41 v2, which freezes an audited deterministic task-level G1 reference without changing the C0/C1 panel.",
    "boundary": "Historical protocol only; it provides no H1.41 efficacy or transfer claim.",
    "evidence": "configs/experiment/h1.41-magnitude-screen-v1.json"
  },
  {
    "id": "h1.41-magnitude-screen-path-contract",
    "status": "protocol-only",
    "finding": "H1.41 path and external-core patch preparation are infrastructure prerequisites, not scientific evidence.",
    "boundary": "Infrastructure validation only; the patched worktree must be materialized and attested before GPU allocation.",
    "evidence": "configs/experiment/h1.41-path-contract-v1.json"
  },
  {
    "id": "wb1-trackb-continuation",
    "status": "protocol-only",
    "finding": "The current router is WB1 Track B with Gen28 read-only reconciliation complete and the native state-v28 barrier still missing; no new execution is authorized.",
    "boundary": "Protocol and accounting evidence only; no causal improvement, final held-out benchmark, or final-test claim is supported.",
    "evidence": "configs/experiment/wb1/protocol.json"
  }
] as const;
