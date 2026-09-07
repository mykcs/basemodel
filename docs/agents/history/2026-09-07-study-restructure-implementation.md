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

---

## Experience deposition and retrospective

Status: **historical causal/operational record for the study restructure conversation; not current runtime, scientific, or release authority**.

This section was written after #527 had merged and after `main` later advanced through #530. That later reader-comprehension repair is current repository history, but it does not retroactively rewrite what #527 had or had not proven. In particular, #527's `RD-01` remained pending at its own closeout. Current authority is the root router, `docs/agents/current/*`, executable tests/source, live provider state, and current OpenEvo scientific receipts.

### Retention class A — durable cross-task rules

1. **Repeated reader confusion is an ownership/enforcement problem, not a copy-length problem.** Before rewriting, identify the page role, canonical owner for every major block, required reader questions, and the normal regression Gate. A shorter page is diagnostic evidence only.
2. **Scientific state must be reconstructed from current receipts.** Chat summaries, old Rxx counters, historical screenshots, and stale website copy can locate evidence but cannot fill a final score, authorization state, or causal conclusion.
3. **Keep epistemic distinctions explicit.** Training score != final held-out score; candidate update != applied update; observation != causal explanation; execution complete != scientific conclusion established; literature reference != same-protocol comparison.
4. **A red Gate is a classification problem before it is a product rewrite.** Distinguish candidate bug, valid contract violation, stale ownership test, hydration/readiness race, local toolchain mismatch, inherited base debt, and provider failure. Never weaken a valid threshold merely to get green.
5. **Local environment identity is part of test evidence.** Before diagnosing a local failure, verify repository engine/runtime requirements, lockfile-compatible dependencies, browser/config entrypoint, and the exact source head. A Node/runtime mismatch is not a product regression.
6. **Visible SSR content is not automatically hydrated interaction.** Tests for ordinary hydrated behavior wait on the product/readiness boundary; if the product promises first-click behavior before hydration, protect that separately. Do not use retries as the synchronization model.
7. **Release evidence is exact-head evidence.** Rebase, retarget, parent-merge, test-only follow-up, or concurrent main movement creates a new release identity. Old green checks remain historical evidence for the old head only.
8. **Stacked dependencies close parent-first and child-clean.** Once the parent lands, rebuild/rebase the child on current `main`, preserve the child's semantic delta plus intervening main changes, prove `main..child` contains only the intended child delta, and rerun the required exact-head checks before merge.
9. **Real-reader comprehension is its own evidence layer.** Agent cold-read, semantic browser assertions, and visual gates can prepare the page but cannot be reported as measured human comprehension.
10. **Long-term memory requires a memory-write receipt.** Repository commits, personal-context retrieval, and conversational summaries are not account-level memory writes.

Most of rules 1–7, 9, and 10 are already owned by current `project-agent-operating-principles.md`, `human-thinking-web-expression-contract.md`, and `website-engineering-standard.md` after later repairs. This retrospective does not duplicate them there. The new durable delta from this conversation is the explicit stacked-parent closeout procedure, added to `multi-pr-semantic-integration-playbook.md`.

### Retention class B — BaseModel / OpenEvo project lessons

- `/research/seed-openevo/study/` is an overview/router. Design, Run, Capability, and Results are separate semantic owners; embedding their complete page experiences back into the overview is a regression even if the result looks visually polished.
- BaseModel publication must resolve current scientific state from `mykcs/openevo-experiment` authority/receipts, not from BaseModel copy. Website code can explain scientific state; it cannot advance it.
- BaseModel Vercel Preview eligibility and `[vercel-preview]` exact-head opt-in are executable repository rules. A Vercel ignored-build success on a test-only head is not a fresh runtime deployment; runtime equivalence must be proven separately when that distinction matters.
- Site-standard GitHub/Hugging Face brand-link audits are acceptance contracts. New evidence links must use the owning branded-link pattern rather than bypassing the audit.
- A migration can intentionally change component/page ownership. Tests that encode the retired owner may be updated only after the new semantic owner is explicit and the scientific/user invariant is preserved; otherwise fix the implementation, not the test.

### Retention class C — transient state deliberately not promoted

The exact PR heads, merge SHAs, Vercel deployment IDs, CircleCI job IDs, temporary local process IDs/ports, momentary mergeability, one-time test counts/durations, the Mac's then-current Node version, temporary screenshot paths, and provider pending/success timestamps are historical reconstruction evidence only. They must not be copied into current policy or long-term memory as if still live.

The baseline character/H2 counts above remain in this history file because they explain the incident. They are not a permanent product budget.

### Friction matrix

| Friction | What happened | Wrong assumption / missing context | Check before acting next time | Defensive rule | Reasonable-looking anti-example |
| --- | --- | --- | --- | --- | --- |
| Parent PR moved during the initial audit | #524 advanced after the first overlap check | “I checked the PR once” was treated as a lock | refresh parent/base/head immediately before branch creation or mutation | bind implementation to the latest accepted exact parent head | keep working from the earlier head because the PR title is unchanged |
| `main` moved while implementation was in progress | #528 changed current Agent/CI policy after implementation had started | standards read at task start were assumed to remain current | compare intervening main commits and re-read changed policy owners | policy reads are ref-qualified and refresh on relevant main drift | cite an old AGENTS read as “current” after main changed |
| CSS architecture audit failed | a redundant `!important` was added for reduced motion | a local style fix was assumed harmless | inspect owning CSS contract and whether the rule is needed at all | remove the unnecessary override; do not relax the audit | whitelist one more `!important` because the page looks correct |
| Migration broke an old ownership test | a test still required `OpenEvoNextExperimentProtocol` on the study homepage | every red test was treated as current product authority | ask whether the tested invariant or only the historical owner changed | update stale owner assertions while preserving the reader/science invariant | restore the old embedded component just to make the test green |
| Brand-link audit failed | new GitHub evidence links lacked the repository-standard brand mark | raw external links were assumed semantically sufficient | inspect existing branded-link pattern before adding evidence links | use the canonical link owner; preserve the audit | disable the brand audit for research pages |
| WebKit quick-view race appeared | a visible `client:visible` control was clicked before its hydrated handler was attached | visible SSR == ready client interaction | resolve the product readiness contract and test the intended boundary | hydrated-path test waits on readiness; pre-hydration first-click promise is tested separately | add retries/timeouts until the race disappears |
| Local build environment initially used the wrong Node major | local default Node differed from repository engine contract | local shell default was assumed compatible | read `package.json` engines and canonical command/runtime before interpreting failure | normalize the environment before classifying source correctness | call the branch broken because Node 23 fails a Node 24 repository |
| A test-only final head had no new runtime deployment | Vercel correctly ignored build-relevant work after only an E2E test changed | every successful Vercel status was assumed to mean a new site build | compare runtime file tree between deployed head and current PR head | distinguish deployment success, ignored build, and runtime equivalence | claim “new exact-head Preview deployed” when no runtime file changed |
| First merge attempt hit protected required checks | the stacked parent was rebased to current main, producing a fresh head with expected checks still pending | old green checks on the pre-rebase head were treated as transferable | read branch protection + fresh combined status for the new SHA | let the fresh required checks run; never bypass or reuse stale status | force/admin merge because the previous SHA was green |
| Child PR still carried stacked ancestry after parent landed | simply retargeting #527 to main temporarily showed parent history in the child | GitHub base retarget was assumed to produce a clean child delta automatically | compare merged parent, current main, old parent->child delta, and new main->child delta | rebuild child on current main so its diff is only the intended child change | merge the child wholesale because Git reports it mergeable |
| Plan-only PR became obsolete after implementation shipped | #525 still said “not implemented” after the actual implementation was merged | historical plan status was treated as harmless current work | check whether a plan PR is now superseded and whether its current-path file would misstate reality | close/supersede stale plan PRs; preserve historical link instead of merging false-current text | merge the old plan after implementation solely to keep the file |
| Screenshot evidence existed but was not packaged as a durable artifact | Before/After screenshots were captured and reviewed but not separately attached as stable files | “I looked at it” was treated as identical to a review handoff | match each requested deliverable to a stable review surface before closeout | distinguish captured/reviewed from formally handed off | report screenshot delivery complete when only transient local captures exist |
| Repository write capability was probed with a write-shaped call during this deposition pass | a `create_file` request targeted an intentionally nonexistent branch and returned 404; no repository state changed | “harmless because it should fail” was used as a capability check | use schema discovery/read-only checks first; create the real target only after intent is fixed | shared writes are never probe surfaces, even when failure is expected | create a throwaway file/branch just to see whether the connector can write |

### Scientific reasoning corrections

#### A clearer page and a scientifically faithful page are the same problem

The successful structure was not “delete text until the page feels lighter.” It was:

```text
current scientific authority
-> explicit semantic objects and evidence states
-> research-question relationship
-> one primary reader path
-> canonical detail owners
-> local evidence/provenance
-> anti-regression tests
```

This avoids two symmetric failures: a precise evidence wall nobody can understand, and a friendly story that silently changes the experiment.

#### Unknown is not zero, and reference is not comparison

When current small-arm/follow-up evidence did not provide a sealed final result, the correct public state was “no publishable final yet,” not a training score or historical round counter. Likewise, the SEED paper's reported 89.7 and the historical Track A 8.74/100 came from different protocols/evidence roles; subtracting them would create a comparison the experiment did not establish.

#### Update mechanics and outcome claims are different layers

A candidate parameter change can be generated and later rejected; only an applied update changes the retained model. Observing that updates occur, or that a task-vector signal exists, does not by itself establish long-horizon causal benefit. The page must expose this boundary near the claim rather than hide it in provenance.

### Why earlier retrospectives did not prevent the same class of failure

Several problems here were already present in older BaseModel history: moving-main identity, stale tests, exact-head release evidence, prose-only readability fixes, and “green provider status != product acceptance.” They returned because:

1. **the rule lived too deep in history** and was not always triggered at the moment of action;
2. **the rule was phrased as a past incident** rather than an observable pre-action check;
3. **some rules had no executable owner/test**, so a later edit could drift without failing;
4. **status prose replaced durable receipts** in a long tool sequence;
5. **stacked-parent closeout lacked one explicit child-clean procedure**, so a generic “retarget/rebase” instruction still left room for an ancestry/diff mistake.

The repository has since lifted much of the reader-comprehension lesson into current owners and executable tests, especially `human-thinking-web-expression-contract.md` §§10.8–10.10 and `website-engineering-standard.md` §§4 and 6. This pass therefore does not add another copy standard. It adds only the missing stacked-dependency closeout rule to the existing integration playbook and keeps this conversation's causal detail here in history.

### Long-term-memory extraction boundary

Memory-eligible candidates from this conversation are stable preferences/principles: newcomer-first Chinese technical explanations; preserve scientific distinctions instead of filling unknowns; fix repeated comprehension problems at semantic owners/tests rather than adding another prose layer; protect other Agents' work; use exact-head evidence; and never represent AI self-review as real-reader validation.

No account-level memory write is claimed. The current runtime exposes no long-term-memory mutation tool. Repository commits are project knowledge, not ChatGPT memory; personal-context retrieval would also not be a write receipt.

### Temporary information intentionally excluded

Do not promote current PID/GPU occupancy, temporary worktree paths, current rounds/percentages, transient provider queue state, temporary Preview/share URLs, one-off exact test counts, or momentary PR mergeability into current policy or long-term memory. If needed for historical reconstruction, keep them only in bounded receipts with their date/ref.

No experiment-server, GPU, Docker, experiment configuration, or execution-authority state from this website task was touched or promoted.

### Future Agent preflight for the same problem class

Before another “people still cannot understand this research page” implementation:

1. pin current `main`, target page, overlapping PRs, and upstream scientific authority;
2. read the current page-expression/research/provenance owners, not a historical plan alone;
3. write the reader's task/purpose/start/stop/evidence/unknown questions before editing copy;
4. inventory every current block and assign one canonical route owner;
5. build a research-question -> experiment -> evidence-boundary map;
6. model lifecycle/evidence states explicitly; never fill unknowns with convenient numbers;
7. implement one primary narrative and move detail to canonical owners rather than nested full pages;
8. update stale ownership tests only when the semantic owner intentionally changed; add negative-state/anti-regression coverage;
9. normalize the local runtime and run the unchanged deterministic/build/browser gates;
10. inspect exact-head Preview and requested deliverables; keep human comprehension explicitly separate;
11. immediately before merge, refresh main/parent/child heads, rebuild stacked children cleanly when needed, and rerun fresh required checks;
12. verify post-merge/Production separately and deposit only the reusable delta.