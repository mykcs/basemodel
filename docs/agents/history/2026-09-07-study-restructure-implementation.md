# Study research-page restructure implementation · 2026-09-07

Status: implementation record for the `study/` information-architecture rebuild. Provider/Preview results are recorded on the implementation PR so exact-head deployment identity does not drift merely to rewrite this file.

Plan authority: PR #525, `docs/agents/current/study-restructure-plan-202609070900.md`.

## Page Expression Brief

- Reader: teacher/student who understands research in general but has not followed the OpenEvo run history and may not know agents, SEED, WebShop, Stage1/2, SD-LoRA, GDR, or internal run IDs.
- Page role: `/research/seed-openevo/study/` is the scientific overview and router. It is not the training-design article, execution runbook, mechanism archive, or full results paper.
- Starting confusion: the old route rendered multiple complete explainers in sequence, so research framing, state, design, fairness tutorial, decision history, next experiment, and results competed as equal-weight sections.
- Target mental model: one study asks whether OpenEvo learns transferable WebShop ability under fair comparison; secondary experiments explain starting-state and update-mechanism effects; final evaluation is distinct from training progress.
- Primary path: concrete task -> shared 3-stage experimental flow -> scores with phase/provenance -> Q1/Q2/Q3 relationship -> observation/support/boundary -> next scientific question -> detail routes.
- Secondary depth: design details move to Design, execution details stay in Run, mechanism history stays in Capability, sealed analysis stays in Results; provenance is a named disclosure at the end.
- Semantic shapes: ordered process, paper-style score table, research-question definition list, claim/evidence/boundary list, deep-route navigation.
- Density: L0/L1 are visible and continuous; exact SHAs/branch snapshots are L2/L3 provenance. No nested whole-page components remain on the overview.

## REPEAT-CORRECTION witness

Repeated failure: prior attempts shortened or rewrote copy but kept the same structural error: whole detail experiences remained embedded on the study overview, and first-time readers still had to infer what the experiments jointly answered.

Current owners read before mutation:

- root `AGENTS.md` and branch/deployment conventions;
- `website-design-spec.md`;
- `human-thinking-web-expression-contract.md`;
- `research-site-presentation-contract.md`;
- `research-journey-experience.md`;
- `scientific-state-provenance.md`;
- PR #525 plan.

Overlap check: main remained `aa765005`. PR #524 advanced during the audit to `bdb837152f33ff7e08a85d8df7717aacf9875d11`; the implementation branch starts from that exact corrected head, retaining its 24 changed files instead of rebuilding from stale main or the earlier #524 head.

Allowed action: website source, content migration, tests, review evidence, Preview. Forbidden: experiment server/GPU/Docker operations, experiment configuration changes, execution authorization changes, and merge/Production release.

## Baseline inventory

Live target captured before source mutation at `https://basemodel-preview.vercel.app/research/seed-openevo/study/`.

- body text: 13,608 rendered characters;
- 16 H2 headings after the H1;
- homepage directly rendered the experiment gateway, the full training-design lab, the full fair-comparison explainer, and the next-experiment protocol;
- visible headings included research framing/state, training-design laboratory, responsibility boundaries, experiment route, parameter protocol, decision history, teacher role, fair budget, final decision tree, and next experiment on one route;
- desktop and 390×844 screenshots were captured before implementation.

The failure was therefore not “too many words” alone. The route had multiple owners and multiple primary narratives.

## Research question → experiment relationship

| Question | Why it exists | Relevant experiment families | What is still unknown |
| --- | --- | --- | --- |
| Q1: under comparable WebShop experience, does OpenEvo improve final held-out performance relative to baseline / SEED? | this is the primary benchmark claim | completed 7B Track A paired measurement; matched-budget line; MiniMax-teacher SEED Stage2 successor | no sealed same-protocol current OpenEvo-final vs SEED-final contrast yet |
| Q2: if outcomes differ, is the cause base model, starting experience, or teacher-produced hindsight supervision? | initial experience changes what later training can learn from | shared 1.7B/3B Stage1, MiniMax analysis, MiniMax-teacher SEED successor | independent causal contribution still needs controlled comparison |
| Q3: does update filtering protect learning or reject locally-worse/long-term-useful updates? | candidate updates and applied updates are different scientific events | GDR / No-GDR / DirectApply and parameter-update diagnostics | long-horizon causal effect of rejection policy remains unresolved |

## Content migration ledger

| Old study-home owner | New owner | Decision |
| --- | --- | --- |
| `OpenEvoExperimentGateway` | new `SeedOpenEvoStudyOverview` plus Results / Capability links | distill unique study framing, state-boundary and evidence-routing into one overview; do not re-embed the gateway |
| inline completed-vs-next comparison scope | score/provenance section on overview; historical frozen-budget context on Design | replace stale current-sounding budget language with phase-labelled evidence; preserve historical design facts as historical |
| `SeedOpenEvoTrainingDecisionLab` | `/study/design/` | Design remains canonical owner; removed from overview |
| `OpenEvoFairComparisonExplainer` | `/study/design/` | moved intact under an explicit historical frozen-design context; removed from overview |
| `OpenEvoNextExperimentProtocol` | `/study/design/` | Chinese design route owns the detailed follow-up protocol; overview retains only one next scientific question |
| results/statistics | `/study/results/` | overview keeps only the minimum score/provenance table and claim boundary; full analysis remains Results |
| mechanism/update history | `/study/capability-exploration/` | overview states the candidate-vs-applied and observation-vs-causality distinction, then links to the mechanism route |
| commands/run mechanics | `/study/run/` | not duplicated on overview |

No component was deleted merely to make the page shorter. Full training/fairness/protocol depth has a canonical destination; the overview keeps only the context needed to understand why those details exist.

## Scientific-state refresh used by the overview

Checked 2026-09-07 from public GitHub evidence, without touching the experiment server:

- `openevo-experiment/main@1ad894cfd76157b4f9ecde7e81351bd7564a1f65` contains the merged MiniMax-teacher SEED Stage2 successor preregistration; its activation state remains false and formal task consumption remains blocked pending explicit gates.
- active/public execution snapshot branch `exec/stage2-shared-final-freeze-202609050041` does not provide a sealed final result for the small-arm Stage2 rows: the 1.7B release requires manual reconciliation of the external execution state, while the 3B release records formal-vNext start pending.
- historical Track A remains a completed measurement: OpenEvo Task Score×100 8.74 vs BASE 7.17 on the same 128-task panel, Exact Success 5/128 for both; it did not establish a stable advantage.
- SEED paper-reported 89.7 remains an external literature reference and is explicitly not treated as directly comparable to Track A or current unsealed training.

Consequently the overview does not reuse old Rxx progress counters, does not convert training/round scores into final scores, and does not present preregistration or execution status as scientific completion.

## Anti-regression ownership

`src/lib/studyOverviewStructure.test.ts` protects:

- overview pages mount only the overview owner rather than whole detail-page owners;
- Design owns the migrated training/fairness/protocol depth;
- one overview H1;
- candidate vs applied update, training vs final score, observation/support/boundary wording;
- all four canonical detail links;
- dated scientific-state source identity.

`headingOwnership.test.ts` is updated to reflect the new H1 owner instead of requiring the old embedded design lab.

## Acceptance matrix

Exact-head runtime results belong on the implementation PR. Required checks remain unchanged:

| ID | Gate | Required evidence |
| --- | --- | --- |
| IA-01 | one primary overview narrative | source + browser headings |
| IA-02 | no whole detail page nested on overview | source anti-regression test |
| IA-03 | Design/Run/Capability/Results ownership | source + link checks |
| SC-01 | training score != final score | visible copy + test |
| SC-02 | candidate update != applied update | visible copy + test |
| SC-03 | observation != causal explanation | claim/support/boundary structure |
| SC-04 | execution completion != conclusion | next-question stopping rule |
| DT-01/02 | current state and score provenance | dated GitHub snapshot + source links |
| WR-01 | newcomer-oriented subject-first copy | source + browser review |
| UX-01/02 | 390/320/desktop/theme/zoom/keyboard | browser acceptance |
| LK-01 | canonical links | browser/source checks |
| RG-01 | no lowered quality threshold | unchanged CI/Preview gates |
| RD-01 | real-reader comprehension | **PENDING** until three real readers perform the rubric; AI self-review is not accepted as a pass |
| SZ-01 | overview remains an overview | rendered-content and heading audit; no hard byte-count gate |

## Release boundary

Implementation complete, automated tests passing, real-reader comprehension verified, Preview reviewed, merged, and Production live are separate states. This branch/PR may establish only the first three that are actually evidenced. Merge and Production require separate owner confirmation.
