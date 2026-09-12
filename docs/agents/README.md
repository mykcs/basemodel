# Agent documentation router

Status: **current documentation router**  
Authority: **navigation only**  
Canonical repository bootstrap: [`../../AGENTS.md`](../../AGENTS.md)

Stable task router for `mykcs/basemodel`. This file selects documentation; it does not own repository-wide Agent behavior or deployment authority.

The documentation system uses **progressive disclosure**: every Agent gets a small bootstrap, then loads only the owners that match the task. Do not turn this repository into one giant reading list, and do not create a second current policy merely because an older document is awkward to update.

## Core bootstrap

After root `AGENTS.md`, for any non-trivial task:

1. use this README to select the task bundle;
2. read [`LATEST.md`](LATEST.md) for short-lived current state;
3. read [`current/project-agent-operating-principles.md`](current/project-agent-operating-principles.md) for autonomy, tool boundaries, write hygiene, and durable-knowledge rules;
4. read [`current/branch-and-pr-conventions.md`](current/branch-and-pr-conventions.md) before choosing a branch/PR path;
5. read [`current/website-engineering-standard.md`](current/website-engineering-standard.md) for cross-cutting implementation and stopping rules;
6. scan [`current/scenario-trigger-registry.md`](current/scenario-trigger-registry.md) and load the matched bundle below;
7. inspect executable source/config/tests/manifests and live provider/experiment truth for the surface you will actually change.

Root [`/AGENTS.md`](../../AGENTS.md) is the unique bootstrap/invariant layer. [`../README.md`](../README.md) owns the documentation-system lifecycle and archive boundary. This file owns **navigation/task selection only**; durable rules live in their single current policy owner.

## Task bundles

### User-facing page, copy, navigation, explanation, or feature

Always load the relevant combination of:

- [`current/product-and-research-integrity.md`](current/product-and-research-integrity.md) — product/research truth and false-complete boundaries;
- [`current/website-design-spec.md`](current/website-design-spec.md) — canonical website-level design/copy preference: what “说人话 / 去 AI 味” means, information order, heading voice, and conflict resolution;
- [`current/human-preference-learning-system.md`](current/human-preference-learning-system.md) — executable human-feedback learning loop: scoped Preference Model, rejected↔accepted Gold Pairs, task-time retrieval, two-phase cold read, and judge receipts;
- [`current/site-reader-attention-contract.md`](current/site-reader-attention-contract.md) — executable per-route audience/task/first-viewport/boundary/next-step contract; register or update it before public-page HTML is substantially written or rearranged;
- [`current/human-thinking-web-expression-contract.md`](current/human-thinking-web-expression-contract.md) — semantic HTML/visual expression and information-density contract;
- [`current/audience-centered-technical-copy.md`](current/audience-centered-technical-copy.md) — site-wide technical-copy baseline;
- [`current/sitewide-visual-knowledge-architecture.md`](current/sitewide-visual-knowledge-architecture.md) — whole-site knowledge journey and route roles.
- [`current/experiment-lineage-map-visual-standard.md`](current/experiment-lineage-map-visual-standard.md) — required specialization when a research UI expresses experiment lineage, roguelike routes, scientific amendments, engineering fixes, blockers, or evidence nodes.

#### Writing stack: load by responsibility

These files are complementary owners, not competing style guides:

| Owner | Load when | Owns |
|---|---|---|
| [`website-design-spec.md`](current/website-design-spec.md) | every public page/copy task | canonical user preference for natural human wording, anti-AI rhetorical patterns, heading/lede/CTA defaults, and rule precedence |
| [`site-reader-attention-contract.md`](current/site-reader-attention-contract.md) | any new public page or substantial public-page structure/attention change | per-route audience, primary task, first-viewport goal, non-hideable boundary, next step, attention mode, and executable fail-closed coverage |
| [`audience-centered-technical-copy.md`](current/audience-centered-technical-copy.md) | any public technical copy | headings name subjects, concrete language, context, terminology, audience baseline |
| [`reader-first-copy-hierarchy.md`](current/reader-first-copy-hierarchy.md) | public explanation/result/incident copy | facts before stage directions, conclusion/numbers before long explanation, visual weight follows semantic weight |
| [`layered-technical-explainer-copy.md`](current/layered-technical-explainer-copy.md) | Chinese technical/research explainers | L1 plain meaning → L2 mechanism → L3 evidence; Chinese-first terminology and scientific boundaries |
| [`research-editorial-style.md`](current/research-editorial-style.md) | research results, benchmark reports, scientific interpretation | research narrative, claim → evidence → inference → boundary, run IDs as provenance |
| [`research-site-presentation-contract.md`](current/research-site-presentation-contract.md) | research publication/result routes | result-first publication order, visible scientific caveats, and progressive disclosure for commands/configs/logs |
| [`seed-student-reproduction-writing.md`](current/seed-student-reproduction-writing.md) | SEED student/onboarding execution guidance | lab-mentor sequencing, observable PASS criteria, hardware/evidence language |

For user-facing research work, `reader-first-copy-hierarchy.md` and `research-editorial-style.md` are mandatory through `src/components/research/AGENTS.md`. Add `layered-technical-explainer-copy.md` when the Chinese page teaches a technical mechanism. A narrower task-specific contract refines the general rule; it does not erase scientific or product truth.

If the owner says `说人话`, `不要 AI 味`, `自然一点`, or equivalent, read [`current/website-copy-cases.md`](current/website-copy-cases.md) **and** [`current/human-preference-learning-system.md`](current/human-preference-learning-system.md), then run `npm run feedback:retrieve -- "<task cues>"` before writing. The case library is raw preference evidence; do not reduce it to a word blacklist or expect passive storage to change the next draft.

For UI/layout/theme/CSS work also read:

- [`current/ui-design-principles.md`](current/ui-design-principles.md)
- [`current/css-architecture.md`](current/css-architecture.md)
- [`current/theme-contrast-contract.md`](current/theme-contrast-contract.md)
- [`current/ui-change-visual-acceptance-gate.md`](current/ui-change-visual-acceptance-gate.md)

For route-role/deduplication questions in the research area, read [`current/research-journey-experience.md`](current/research-journey-experience.md).

### SEED × OpenEvo publication / Results

Before a non-trivial Results change, read:

- [`current/seed-openevo-research-mission-first-principles.md`](current/seed-openevo-research-mission-first-principles.md)
- [`current/scientific-state-provenance.md`](current/scientific-state-provenance.md)
- [`current/experiment-result-publication-workflow.md`](current/experiment-result-publication-workflow.md)
- [`current/seed-openevo-results-reader-contract.md`](current/seed-openevo-results-reader-contract.md)
- [`current/research-explainer-page-standard.md`](current/research-explainer-page-standard.md)
- [`current/reader-first-copy-hierarchy.md`](current/reader-first-copy-hierarchy.md)
- [`current/research-editorial-style.md`](current/research-editorial-style.md)
- [`current/research-site-presentation-contract.md`](current/research-site-presentation-contract.md)
- [`current/layered-technical-explainer-copy.md`](current/layered-technical-explainer-copy.md) for Chinese explainers

Then resolve the live scientific authority in `mykcs/openevo-experiment`. An old website sentence, chat recap, dated snapshot, or `current/` filename is not evidence that upstream state has not moved.

Useful historical cases, after current policy:

- [`history/2026-09-12-q17-directapply-complete-analysis-page-conversation-closeout.md`](history/2026-09-12-q17-directapply-complete-analysis-page-conversation-closeout.md) — Q17 publication closeout: one canonical long-form experiment-analysis route, supported-later-evidence before unreconstructed earlier narrative, independent-review unavailability honesty, readable scientific helper text, and the repeated Fish/Bash use-site witness.
- [`history/2026-09-12-pr636-briefing-scientific-boundary-release-closeout.md`](history/2026-09-12-pr636-briefing-scientific-boundary-release-closeout.md) — PR #636 closeout: preserve dated snapshot truth while current copy cites later audit evidence, keep final-evaluation/successor wording authorization-qualified, refresh PR narrative metadata after base sync, and treat resumed/handoff conversations as a fresh routing boundary so pollable release checks are not abandoned at `pending`.
- [`history/2026-09-12-pr624-text-memory-current-main-release-closeout.md`](history/2026-09-12-pr624-text-memory-current-main-release-closeout.md) — PR #624 closeout: moving-main authority refresh, exact-head final-gate activation, immutable dated receipts, concurrent-branch safety, and repeated shell-quoting activation failure.
- [`history/2026-09-10-briefing-fast-preview-pr-workline-and-hpl-closeout-retrospective.md`](history/2026-09-10-briefing-fast-preview-pr-workline-and-hpl-closeout-retrospective.md) — briefing/HPL closeout for same-surface PR proliferation, fast review Preview artifact identity, stale generated-output reuse, HPL retrieval-capacity + activation-cue/scope regressions, and the repeated Fish/Bash bootstrap miss; current rules live in deployment, multi-PR integration, scenario-trigger, HPL, and ingestion owners.
- [`history/2026-09-09-openevo-briefing-preference-learning-execution-retrospective.md`](history/2026-09-09-openevo-briefing-preference-learning-execution-retrospective.md) — OpenEVO advisor-briefing closeout focused on repeated-correction failure mechanisms: engineering-validity vs scientific-contribution boundaries, scientific question→test→pivot storytelling, Preference Learning V2 generation/evaluation binding, owner-over-generic-reviewer precedence, exact-artifact screenshot receipts, moving-main/concurrent-PR safety, stale-copy/full-gate/tool/transport friction, and explicit A/B/C retention.
- [`history/2026-08-31-human-copy-preference-mining-and-governance-retrospective.md`](history/2026-08-31-human-copy-preference-mining-and-governance-retrospective.md) — end-to-end recovery of the owner's “说人话 / 去 AI 味” preference from site history: preference-vs-evolution evidence, historical rule drift, case-library design, moving-main synchronization, worktree/shell/tool friction, docs-only Vercel avoidance, self-hosted CI queue diagnosis, and final PR #345 closeout.
- [`history/2026-09-07-reader-attention-contract-and-apple-cognition-retrospective.md`](history/2026-09-07-reader-attention-contract-and-apple-cognition-retrospective.md) — direct first-run human feedback → literal scientific copy → cognition-first attention hierarchy → site-wide executable Reader Contract; includes reference-design philosophy vs surface imitation, case-cluster propagation, compatibility-redirect semantics, WebKit/first-screen geometry, moving-main integration, protected-Preview boundaries, and repeat-correction lessons.
- [`history/2026-09-08-governance-branch-reconciliation-retrospective.md`](history/2026-09-08-governance-branch-reconciliation-retrospective.md) — stale governance PR reconciliation across BaseModel/OpenEVO: exact-head freshness, authority-topology migration, same-PR refresh vs narrow successor, preserving unique Stage1 lineage without duplicate Agent authorities, dirty-worktree/tool-route friction, auto-merge closeout readback, and A/B/C information lifetime separation.
- [`history/2026-08-26-seed-results-attribution-and-agent-friction-retrospective.md`](history/2026-08-26-seed-results-attribution-and-agent-friction-retrospective.md)
- [`history/2026-08-28-results-provenance-publication-and-release-closeout-retrospective.md`](history/2026-08-28-results-provenance-publication-and-release-closeout-retrospective.md) — end-to-end Results provenance closeout: moving scientific authority, concurrent integration/supersession, stale public metadata, branch-prefix deployment eligibility, Preview gate skip vs PASS, exact-head/Production lineage, and provider-wait discipline.
- [`history/2026-08-28-site-three-pass-audit-and-release-retrospective.md`](history/2026-08-28-site-three-pass-audit-and-release-retrospective.md) — whole-site facts → reader-first copy → visual-language audit: live-truth precedence, bounded first-party model evidence, stale scientific/test contracts, exact-head Vercel spend control, protected Preview access vs deployment health, Production 91/91 acceptance, and compatibility-token cleanup guidance.
- [`history/2026-08-27-results-zero-context-and-tool-boundary-retrospective.md`](history/2026-08-27-results-zero-context-and-tool-boundary-retrospective.md)
- [`history/2026-08-27-results-model-identity-and-checkpoint-lineage-retrospective.md`](history/2026-08-27-results-model-identity-and-checkpoint-lineage-retrospective.md) — `BASE` vs vendor Base checkpoint, `frozen` vs provenance, 3B/7B ambiguity, pinned adapter checkpoints, runtime-image naming traps, and concurrent-main release closeout.
- [`history/2026-08-27-seed-glm-stage1-and-brand-asset-retrospective.md`](history/2026-08-27-seed-glm-stage1-and-brand-asset-retrospective.md) — missing Stage-1 GLM bootstrap, GLM-vs-GRPO-vs-OPD signal separation, user-supplied icon references, official brand-asset provenance, binary-transfer friction, flaky browser-gate classification, and concurrent-main supersession.
- [`history/2026-08-28-webshop-explainer-and-results-reader-workflow-retrospective.md`](history/2026-08-28-webshop-explainer-and-results-reader-workflow-retrospective.md) — WebShop semantic-object traps (`12,087` vs `6,910`, split identity, unknown `128` mapping), semantic visual grammar, local evidence accordions, editor-facing copy removal, stale tests, responsive-gate fixes, Vercel exact-head verification, and contaminated-PR clean integration.
- [`history/2026-08-28-seed-responsibility-topology-and-visual-acceptance-retrospective.md`](history/2026-08-28-seed-responsibility-topology-and-visual-acceptance-retrospective.md) — model-facing SEED/verl-agent harness vs Princeton `WebAgentTextEnv`, whole-page responsibility topology, stale CSS-owner drift, connector/overflow/CJK browser failures, candidate-vs-base gate classification, exact-head Preview acceptance, and tool-scope reset when work becomes GitHub-only.
- [`history/2026-08-29-four-arm-result-scaffold-and-7b-self-checkpoint-publication-retrospective.md`](history/2026-08-29-four-arm-result-scaffold-and-7b-self-checkpoint-publication-retrospective.md) — pre-built Pending result slots, four-arm comparison pre-specification, MiniMax analyzer-role precision, completed 7B/self checkpoint curve, loss-vs-capability non-monotonicity, post-hoc panel contamination, worktree dependency friction, synchronized result fill-in, and skipped-Preview-vs-PASS semantics.
- [`history/2026-08-30-openevo-capability-exploration-series-retrospective.md`](history/2026-08-30-openevo-capability-exploration-series-retrospective.md) — complete conversation closeout for the OpenEvo capability-exploration series: Pending scaffolds → 7B/self fill-in → HTML/SVG checkpoint visualization → functional 3B/7B × self/MiniMax selector → 2×2 joint matrix → stable series naming/navigation, plus Vercel/worktree/TypeScript/mobile/GitHub/shell friction patterns.
- [`history/2026-08-31-ceiling-stage1-versioning-gpu-handoff-and-artifact-publication-retrospective.md`](history/2026-08-31-ceiling-stage1-versioning-gpu-handoff-and-artifact-publication-retrospective.md) — Ceiling Stage-1 execution/publication closeout: decoding config-vs-runtime drift, workload-qualified GPU admission, zero-consumption startup recovery, clean 4-GPU reshard, model-backed Holder semantics, `protocol-equivalent / realization-different / runtime-corrected`, retained historical Stage-1 artifacts, pinned HF/GitHub provenance, moving-main and CI cleanup friction.
- [`history/2026-08-31-superseded-stage2-archive-ceiling-publication-retrospective.md`](history/2026-08-31-superseded-stage2-archive-ceiling-publication-retrospective.md) — old Stage-2 four-arm archive/checkpoint semantics, immutable HF bytes vs mutable README, `not run` vs measured zero, cold archive + local smoke retention, current Ceiling protocol vs dated execution snapshot, and PR #366 exact-head/Production closeout.
- [`history/2026-08-31-7b-webshop-score-table-and-live-final-freshness-retrospective.md`](history/2026-08-31-7b-webshop-score-table-and-live-final-freshness-retrospective.md) — paper-vs-local 7B WebShop HTML score table, stale MiniMax Pending assumption exposed by a live-final check, completion-layer/result reconciliation, stale-test repair, mobile table overflow, and pre-merge release-gate lessons.
- [`history/2026-08-31-arxiv-like-experiment-table-family-retrospective.md`](history/2026-08-31-arxiv-like-experiment-table-family-retrospective.md) — one 7B paper-table refinement becoming a family-wide arXiv/LaTeX table grammar: shared semantic ownership, sibling-route propagation, local-scroll mobile tables, stale copy-test repair, moving-main overlap classification, protected-Preview auth boundaries, exact-head CI/Production closeout, and cleanup.
- [`history/2026-08-31-openevo-readable-result-language-and-release-retrospective.md`](history/2026-08-31-openevo-readable-result-language-and-release-retrospective.md) — end-to-end #341 closeout for turning OpenEvo Results shorthand into reader-complete explanations: `20,480 → 797 → 8 → 7 → 0`, true zero vs Pending, `16 / 1,440` training-admission semantics, historical-design boundaries, overlapping #353/#354 integration, moving-main synchronization, Preview-skip semantics, parallel PR close/reopen/merge races, and layered Production acceptance.
- [`history/2026-08-31-openevo2-harness-redesign-and-lineage-publication-retrospective.md`](history/2026-08-31-openevo2-harness-redesign-and-lineage-publication-retrospective.md) — 3B/7B matched-prefix harness diagnosis → carrier/upstream-vs-bridge attribution → OpenEVO 2.0 design (`Context Governor`, carrier separation, Telemetry v2, Preformal Qualification) → shared-Stage1 experiment lineage UI and PR #379 release/CI friction, including state-inadmissible actions, stacked-PR cleanup, stale tests, fish/Bash, worktree dependencies, and setup-node cache-save delay.
- [`history/2026-09-03-phase-a-authority-and-experience-retention.md`](history/2026-09-03-phase-a-authority-and-experience-retention.md) — Phase A authority freeze/revalidation: moving-main boundaries, checkbox acceptance evidence, parent-policy completeness, exact-head docs-only closeout, memory-capability honesty, and the stable-vs-project-vs-temporary deposition rules.

### Reproduction workflow / experiment design

Read:

- [`current/seed-openevo-research-mission-first-principles.md`](current/seed-openevo-research-mission-first-principles.md)
- [`current/reproduction-guide-design-principles.md`](current/reproduction-guide-design-principles.md)
- [`current/openevo-reproduction-research-page.md`](current/openevo-reproduction-research-page.md)
- [`current/product-and-research-integrity.md`](current/product-and-research-integrity.md)
- current experiment-side authority in `mykcs/openevo-experiment`

Keep strict reproduction, method reproduction, modern rerun, diagnostic evidence, benchmark-facing evidence, and paper-reported results separate.

### Release / Preview / Production / overlapping PRs

Read:

- [`current/ci-provider-decision.md`](current/ci-provider-decision.md) — why BaseModel uses final-candidate-only Vercel instead of always-on CircleCI / GitHub Actions / Cloudflare CI; read before proposing a provider migration
- [`current/hosting-architecture.md`](current/hosting-architecture.md)
- [`current/deployment-policy.md`](current/deployment-policy.md)
- [`current/release-closeout-protocol.md`](current/release-closeout-protocol.md)
- [`current/multi-pr-semantic-integration-playbook.md`](current/multi-pr-semantic-integration-playbook.md) when PRs overlap or ship together

Vercel owns exact-head final acceptance and Production. Repeated UI/copy/slide review may use the non-authoritative prebuilt review Preview lane from current deployment policy; that viewing surface is not merge evidence. Historical Vercel pilot/adoption records are under `history/`; Cloudflare files in `current/` are conditional rollback/provider-specific runbooks, not normal release authority.

For a red Vercel/provider status, first use [`current/provider-failure-attribution-runbook.md`](current/provider-failure-attribution-runbook.md) to bind the exact deployed SHA and first failing execution phase before assigning blame or changing architecture. Its dated incident evidence is [`history/2026-09-09-briefing-vercel-failure-attribution-retrospective.md`](history/2026-09-09-briefing-vercel-failure-attribution-retrospective.md).

For provider/browser performance incidents, use the dated retrospective that matches the failure after reading the current policy. For Vercel billing, `Overdue`, unexplained Build CPU, or spend-reduction work, read [`history/2026-08-28-vercel-billing-and-cost-control-retrospective.md`](history/2026-08-28-vercel-billing-and-cost-control-retrospective.md). For internal `src/pages/_*` modules being mistaken for public routes, Preview `READY` with skipped browser gates, or a Production changed-route smoke failure caused by route derivation, read [`history/2026-08-27-home-maintenance-shortcuts-release-retrospective.md`](history/2026-08-27-home-maintenance-shortcuts-release-retrospective.md).

For CI-provider responsibility, zero-extra-cost self-hosted runner setup, Vercel browser offload, Cloudflare Production smoke, CI-vs-deploy relevance, runner/bootstrap failures, or safe Mac-host disk pressure and scoped cache maintenance, read [`history/2026-08-29-ci-runner-cloudflare-vercel-offload-retrospective.md`](history/2026-08-29-ci-runner-cloudflare-vercel-offload-retrospective.md) after the current deployment owners.

For the 2026-09-04→06 Mac/OrbStack closeout — bounded backup/cleanup, clean runner images in private GHCR, credential-exclusion rules, shared BuildKit idle gates, dormant-fallback interpretation, two rejected in-executor Playwright parallelism experiments, and the final cloud-shard/manual-fallback architecture — read [`history/2026-09-06-mac-orbstack-runner-housekeeping-ghcr-and-ci-parallelism-retrospective.md`](history/2026-09-06-mac-orbstack-runner-housekeeping-ghcr-and-ci-parallelism-retrospective.md).

- [history/2026-09-05-pr429-7b-final-release-closeout-and-experience-retention.md](history/2026-09-05-pr429-7b-final-release-closeout-and-experience-retention.md) — PR #429’s 7B final-release case: exact-head CI versus moving main, mergeability versus semantic compatibility, protected Preview access, three identity ledgers, claim-domain boundaries, expected-head merge, and post-merge Production verification.\n\nFor the 2026-09-04/05 follow-up that clarified Workers vs Workers Builds vs Wrangler, proved an OpenEVO CircleCI cloud cutover, exposed required-check/runner-retirement/browser-automation pitfalls, and reopened Base Model CI optimization after measured 20–25 minute full jobs, read [`history/2026-09-05-ci-first-principles-cloud-migration-and-web-ci-retrospective.md`](history/2026-09-05-ci-first-principles-cloud-migration-and-web-ci-retrospective.md). It is historical rationale; current Base Model provider authority remains in `current/deployment-policy.md`.

For the 2026-09-06 Base Model CircleCI performance-experiment closeout — fixed-sleep/readiness, deferred video, npm cache, native historical timing, qualification-vs-steady-state measurement, frozen controls, legacy status-by-SHA contamination, concurrent-Agent duplicate work/premature merge, and precise revert while preserving later research commits — read [`history/2026-09-06-circleci-benchmark-causality-and-multi-agent-closeout-retrospective.md`](history/2026-09-06-circleci-benchmark-causality-and-multi-agent-closeout-retrospective.md) after the current CI/deployment owners.

For the 2026-09-08 Vercel-Pro blocking cutover closeout — stale CircleCI authority assertions inside `verify:deploy`, exact-head Vercel 203-case Chromium + 12-case Lab qualification, live GitHub required-status migration, concurrent ruleset/merge movement, Production re-verification, and why repository config is only half of a provider cutover — read [`history/2026-09-08-vercel-blocking-cutover-retrospective.md`](history/2026-09-08-vercel-blocking-cutover-retrospective.md) after the current deployment/release owners.

For the cross-repository BaseModel + OpenEvo CI/PR cleanup case — especially red-check classification, exact-head evidence, stale-but-mergeable PRs, disposable-worktree dependency friction, PR reopen/moving-head concurrency, and expected-head guarded merge closeout — read [`history/2026-08-31-ci-pr-stability-and-moving-head-retrospective.md`](history/2026-08-31-ci-pr-stability-and-moving-head-retrospective.md).

For whole-site performance/hydration/payload cleanup that must preserve static-first behavior while `main` keeps moving, read [`history/2026-08-30-site-optimization-implementation-and-release-retrospective.md`](history/2026-08-30-site-optimization-implementation-and-release-retrospective.md). It covers fail-closed Gate repair, no-JS regressions, dead-code reachability, port/worktree collisions, a WebKit hydration race, exact-tree stopping rules, protected-Preview HTTP boundaries, expected-head merge locking, and Production closeout.

### Model catalog / current-provider claims

Read:

- [`current/model-catalog-verification-policy.md`](current/model-catalog-verification-policy.md)
- current first-party provider/source evidence

The 2026-08-12 differential audit is retained at [`history/2026-08-12-model-catalog-differential-audit.md`](history/2026-08-12-model-catalog-differential-audit.md) as a point-in-time baseline only. Do not treat it as a current catalog. Current/latest/full-family claims must be re-verified.

For the concrete failure mode where a recent broad audit became stale within days, and for the evidence-boundary lessons around official SDK/code evidence versus provider catalogs, read [`history/2026-08-28-model-catalog-freshness-and-evidence-boundary-retrospective.md`](history/2026-08-28-model-catalog-freshness-and-evidence-boundary-retrospective.md) after the current policy.

### `/lab/`, remote compute, SSH/SFTP/rsync, or hardware disclosure

Read [`current/personal-compute-profile-consumer.md`](current/personal-compute-profile-consumer.md) plus the matched scenario trigger. Keep personal device inventories, private profile feeds, hostnames, usernames, VPN endpoints, tokens, and other identifying infrastructure out of the public repository. Publish only minimum reproducibility-relevant aggregate facts. For shared experiment-server disk pressure, storage attribution, or cleanup, also load [`current/server-storage-pressure-audit-sop.md`](current/server-storage-pressure-audit-sop.md). The dated implementation/incident case [`history/2026-09-03-server-storage-audit-and-public-snapshot-retrospective.md`](history/2026-09-03-server-storage-audit-and-public-snapshot-retrospective.md) explains the repeated Fish/Bash failure, incomplete mount-namespace trap, Docker snapshot fallback, mistaken future-dependency deletion, Preview-branch eligibility miss, moving-main rebase semantics, and required-CI queue diagnosis; read it only after the current SOP/policies.

### Private → public visibility change

Read and execute [`current/public-release-security-gate.md`](current/public-release-security-gate.md). The gate is fail-closed and covers tracked tree, collaboration surfaces, refs/history, and public intent.

## Document roles

| Location | Role |
|---|---|
| `/AGENTS.md` | fast router + non-negotiable invariants |
| `docs/README.md` | documentation lifecycle, archive boundary, top-level map |
| `docs/agents/LATEST.md` | short-lived current handoff/state snapshot |
| `docs/agents/README.md` | task router and precedence |
| `docs/agents/current/*` | authoritative current policies/runbooks/maps and deliberately maintained current inventories |
| `docs/agents/history/*` | incidents, completed audits/pilots/migrations/closeouts, superseded-state evidence |
| `docs/archive/*` | pre-current product snapshots and one-off superseded plans/context |
| `docs/agent-context/*` | compatibility entrypoint for older historical links |

A date in a filename does not decide lifecycle. Ask whether the file **owns behavior today**. A dated state owner that is actively refreshed and consumed by source/tests may remain current; a completed audit or migration belongs in history even if its lesson remains useful.

The 2026-08-10 final-hardening closeout is historical at [`history/2026-08-10-final-product-hardening-closeout.md`](history/2026-08-10-final-product-hardening-closeout.md). Its durable requirements are owned by current product/UI policies and the executable `scripts/audit-final-product-hardening.ts`, not by the old closeout narrative.

## Knowledge precedence

```text
current user instruction
> live provider state for provider-side claims
> executable repository / experiment truth
> docs/agents/current/*
> docs/agents/LATEST.md
> docs/agents/history/* and docs/archive/*
```

If two current documents disagree, resolve against executable/live truth and update or demote the stale owner. Do not add a reconciliation policy layer.

## Current deployment authority

```text
GitHub source
├─ deployment-eligible non-main -> Vercel Preview
└─ main                         -> Vercel Production -> https://basemodel-preview.vercel.app
```

Branch eligibility is executable policy in `vercel.json`. Preview must be `noindex`; Production is the stable canonical identity. Temporary share links are ephemeral and must not be persisted in repository text or GitHub collaboration surfaces.

Cloudflare Pages/Direct Upload/Workers material is loaded only for explicit rollback, retirement, Cloudflare-specific reproduction, or unexpected legacy-provider activity.

## Repository-write hygiene

Shared GitHub state is not a scratchpad. Prefer read/search for discovery, one coherent branch/PR, and one atomic multi-file commit over sequential write probes. Use GitHub for GitHub-owned state, Vercel for Vercel-owned state, and a user device only when the task materially depends on local-only state.

At task completion, persist only knowledge whose future utility justifies another durable rule. Current cross-task rule → update its existing `current/` owner; short-lived state → `LATEST.md`; reusable incident/migration rationale → `history/`; superseded pre-current milestone/context → `archive/`.

- [`history/2026-09-11-pr619-eli5-exact-head-closeout.md`](history/2026-09-11-pr619-eli5-exact-head-closeout.md) — PR #619 ELI5 surface-wide cleanup, synchronous pending-check completion, moving-main evidence, and explicit merge-authorization boundary.
- [`history/2026-09-11-q17-diagnostics-publication-conversation-closeout.md`](history/2026-09-11-q17-diagnostics-publication-conversation-closeout.md) — conversation closeout for Q17 plain-language publication, stale historical-vs-current longitudinal charts, shared snapshot ownership, repeated Fish/Bash use-site failure, and temporary-state exclusion.
