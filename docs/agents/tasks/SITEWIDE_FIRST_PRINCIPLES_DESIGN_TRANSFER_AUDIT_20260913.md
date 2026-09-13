# Sitewide first-principles design transfer audit

Status: **OPEN TASK CHECKLIST · audit-only baseline**
Repository: `mykcs/basemodel`
Audit branch: `research/sitewide-first-principles-design-audit-20260913`
Baseline main: `57e3db8f4f2e2711334b5026cc01523e5a55ef08`
Created: 2026-09-13

> This file is the task/checklist authority for this audit PR. It does **not** replace the standing design authorities under `docs/agents/current/`. Future work on this PR should update checkboxes and evidence here instead of reconstructing the task from chat memory.

## 0. Why this PR exists

The question is not whether the WebShop lesson was written down. The stronger test is whether the same preference can be transferred to pages that were **not** edited in the WebShop conversation and still detect real design problems without mechanically forcing every page into the same template.

The transfer standard is:

```text
real object / research object
-> why it matters here / what evidence makes it relevant
-> how this experiment uses it
-> mechanism, data, implementation and provenance depth
```

This ordering is a default for benchmark/environment/reference pages, not a universal template. Operational pages may legitimately start with the current state and next safe action; result pages may legitimately start with the result; historical/archive pages may legitimately start with provenance identity. The audit must preserve those route-role differences.

## 1. Authority loaded for this audit

- [x] Read root `AGENTS.md` on exact baseline main.
- [x] Read `branch-and-pr-conventions.md` before creating this workline.
- [x] Read `scenario-trigger-registry.md`, including the first-principles benchmark/environment trigger.
- [x] Read `human-thinking-web-expression-contract.md`.
- [x] Read `site-reader-attention-contract.md`.
- [x] Read `research-site-presentation-contract.md`.
- [x] Read `ui-change-visual-acceptance-gate.md`.
- [x] Checked for an already-open overlapping sitewide first-principles audit PR; none was found.

### REPEAT-CORRECTION witness

`trigger -> current owner -> checked artifact -> allowed next action -> invalidation cue`

`WebShop first-principles lessons should generalize beyond one page -> current design/reader authorities + siteReaderContracts -> this audit compares sibling/unrelated routes against those owners -> record PASS/REVIEW/FAIL and create a future repair queue, without changing product pages yet -> invalidate/re-audit when a route role, current design authority, or rendered page materially changes`

## 2. What counts as PASS, REVIEW and FAIL

### PASS

Evidence supports the route's declared reader task and no concrete violation was found in the inspected scope. PASS is always scoped: `sampled first screen PASS` is not the same as `full route PASS`.

### REVIEW

A real risk signature is present, but route role or rendered context could justify it. REVIEW is **not** a defect count and must not be mass-fixed by regex.

Examples:

- an eyebrow that may carry real state/date/provenance;
- imperative language on an operational route;
- a wide table with local scroll but no observed root overflow;
- a comparison rendered as cards when the cards may actually be independently scannable objects.

### FAIL

The rendered/source evidence already contradicts the declared reader/design contract, or a concrete browser/layout failure is reproduced.

A FAIL needs a semantic repair, not threshold inflation, global overflow hiding, or removal of evidence.

## 3. Baseline system audit

### 3.1 What is already institutionalized

| Layer | Baseline | Audit result |
| --- | --- | --- |
| Root bootstrap | design/copy/reader authorities are mandatory from `AGENTS.md` | **PASS** |
| Just-in-time retrieval | first-principles benchmark/environment trigger now exists | **PASS** |
| Reader contracts | `audit:reader-contracts` reports **63 / 63 public page patterns covered** | **PASS for coverage; not semantic consistency** |
| Human-preference system | `audit:human-feedback` reports **25 precedents / 17 dimensions / 29 Gold Pairs / 6 reader-contract bindings / 315 public source files** | **PASS for system integrity** |
| Responsive safety | current UI gate explicitly covers root overflow, local scroll, Grid/Flex min-content propagation and 390 / 768 / 1440 pressure points | **PASS at policy level** |
| Scientific boundaries | current research contract keeps unknown unknown and separates evidence layers | **PASS** |

### 3.2 Institutional gaps exposed by the transfer test

- [ ] **GAP-A · Contract coverage is not semantic transfer coverage.** A page can have a valid reader contract and still encode an older mental model. `flow-alfworld` is the concrete witness: it has a contract, but the contract itself remains mechanism-first.
- [ ] **GAP-B · Strict copy audit is not a finished review system.** Current `audit:copy:strict` scanned **579 production source files**, produced **904 contextual review candidates**, and still had **0 strict invariant failures**. This is expected by design, but it means the review queue needs a prioritization/transfer workflow rather than being treated as “green means no design debt.”
- [ ] **GAP-C · No explicit sibling-page transfer test exists.** After a strong human correction becomes a reusable rule, there is no single checklist/test that asks “which sibling and unrelated pages still violate the same semantic rule?”
- [ ] **GAP-D · Page-family invariants are incomplete.** Benchmark/environment routes do not yet have an executable family rule distinguishing `object-first` entry from mechanism-first entry. Do not add such a rule until at least two sibling pages establish a non-overfit shape.
- [ ] **GAP-E · Review-candidate false-positive control needs to remain explicit.** “Contains `先…`”, “contains an eyebrow”, “uses cards”, or “has `overflow-x:auto`” must never become automatic failure by itself.

## 4. Production transfer sample — 2026-09-13

A read-only Chromium transfer sample was run against current Production at **390×844** and **1440×1000** for eight routes. All 16 sampled renders returned HTTP 200 and had `document.scrollWidth - clientWidth = 0`.

This sample is evidence for the listed surfaces only; it is not a whole-site browser certification.

| Route | Classification | Evidence / reason |
| --- | --- | --- |
| `/research/seed-openevo/flow/webshop/` | **PASS · control** | object-first H1/lede, visible Contents, benchmark identity/evidence before mechanism; no root overflow |
| `/research/seed-openevo/flow/alfworld/` | **FAIL** | first viewport goes from `ALFWorld 世界状态与任务成功` directly into `ALFWorld 环境模型`, world state, action family and interactive mechanism; it does not first establish benchmark identity/role/why this research uses it |
| `/research/seed-openevo/flow/benchmarks/` | **REVIEW** | object pair is clear, but small labels `环境 / 证据 / 对比` precede already self-explanatory H2s; likely redundant hierarchy rather than new information |
| `/research/seed-openevo/study/capability-exploration/` | **REVIEW** | first H1 is clear and no overflow was found, but the shared orientation grammar still carries author-host fields such as question/why/start/finish; verify that these help this route rather than narrate how to read it |
| `/research/seed-openevo/study/capability-exploration/sd-lora-history/` | **REVIEW** | H1 correctly names the scientific object, but `SD-LoRA 专题总览` duplicates surrounding route identity and the hero exposes scaffold/meta copy about “establishing page structure and navigation” |
| `/models/` | **PASS · sampled first screen** | concrete object (`模型浏览器`) and research-model entry are visible; no first-screen eyebrow/root-overflow issue found |
| `/papers/` | **PASS · sampled first screen** | concrete object (`自进化智能体论文`) with low first-screen noise; no sampled root overflow |
| `/guide/` | **PASS · sampled first screen** | object/relationship (`Agent、SEED 与 OpenEvo`) is immediately named; no sampled root overflow |

## 5. High-confidence repair queue

### P0 — confirmed semantic failure

- [ ] **ALFWorld object-first entry.** Rework `/research/seed-openevo/flow/alfworld/` so a zero-context reader first learns what ALFWorld is, why it is a benchmark relevant here, and how this research/SEED uses or reports it before entering world-state/action mechanics.
- [ ] Update the `flow-alfworld` reader contract to describe the accepted first-principles object, not merely the current mechanism-first implementation.
- [ ] Preserve ALFWorld-specific semantics: success / task-family success / macro-average must remain distinct from WebShop normalized Score / exact Success.
- [ ] Do **not** mechanically copy WebShop citation-count UI. Add publication/impact evidence only if it helps establish ALFWorld's role and can be sourced cleanly.

### P1 — likely same-family presentation debt

- [ ] **Benchmarks labels.** Cold-read whether `环境`, `证据`, `对比` add real state/category information beyond `交互与评测`, `结果与轨迹证据`, `公平比较协议`. Remove only the labels that add no independent meaning.
- [ ] **SD-LoRA history overview eyebrow.** Test removing `SD-LoRA 专题总览` when breadcrumb + H1 already identify the object. Preserve `NN / 07` on child pages because sequence position is real metadata.
- [ ] **SD-LoRA scaffold/meta copy.** Replace public “当前先建立页面结构和导航 / 这页接下来会放什么” authoring-state narration with an honest scientific availability state that names the research question and what evidence is/not yet available.
- [ ] **Capability landing orientation.** Audit `ResearchOrientation` usage on the capability home. Keep scientific question/boundary if useful; remove fields that mainly tell the reader how the author wants the page read.

### P2 — shared grammar review, not automatic removal

- [ ] Review `InteractiveResearchExplainer` labels such as `30 秒直觉`, `逐步操作`, `技术边界`, `先读全局结构，再追踪一次运算`. Determine which are genuine interaction modes and which are narrator UI.
- [ ] Review shared `ResearchOrientation` question/why/start/finish grammar against `PREF-FIRST-SCREEN-ATTENTION` and object-first rules.
- [ ] Review generic `.eyebrow`, `.section-kicker`, `.frontier-section-kicker`, and similar patterns on research pages. Preserve date, sequence, sealed/historical state and provenance; remove generic category narration that repeats the heading.
- [ ] Review `SeedOpenEvoProgressBriefing` separately under the **projected-deck exception**. Do not apply long-page rules to a slide just because lexical signatures match.
- [ ] Review `OpenEvoFairComparisonExplainer` separately as an interactive teaching surface. A mode label can be useful if it controls a real view; it is not justified if it only decorates the explanation depth.

## 6. Full route-family transfer audit

The initial production sample is not enough. Future work on this PR should expand to every reader-contract family.

### Reference / benchmark / environment pages

- [ ] Audit `flow-seed` for object/method identity before internal training mechanics.
- [ ] Audit `flow-openevo` for object/method identity before artifact/update mechanics.
- [ ] Audit `flow-benchmarks` after label cleanup.
- [ ] Audit `flow-webshop` as the positive control after sibling changes.
- [ ] Audit `flow-alfworld` after the P0 repair.
- [ ] Audit `flow-server` with the resource-vs-scientific-authority boundary.

### Research/result pages

- [ ] Audit `study`, `study-results`, and all four-arm result pages for result-first ordering and evidence-local boundaries.
- [ ] Audit DirectApply full analysis, frontier diagnostic, GDR/DirectApply, Vanilla SD-LoRA and scaling pages for object/result-before-provenance ordering.
- [ ] Audit Stage 1 / Stage 2 historical and current pages; historical identity must remain visible and must not be “modernized” into current-state prose.
- [ ] Audit the seven-page SD-LoRA history series as one family so shared grammar is changed once, not page by page.

### Catalog / decision pages

- [ ] Audit Models index/detail pages for object identity, experimental relevance, and unknown-state handling.
- [ ] Audit Papers index/detail pages for paper claim vs local reproduction boundary.
- [ ] Audit Compare and Workspace as decision surfaces; do not force the benchmark/reference template onto them.
- [ ] Audit Guide / reproduction routes with the rule that operational imperatives can be valid when the page role is operational.

### Archive / operational exceptions

- [ ] Audit archive pages for clear `historical` identity and provenance-first semantics.
- [ ] Audit `/study/run/`, `/lab/`, and other operational routes using `operational` reader contracts. Their first job is current state / authorization / next safe action, not “what is this benchmark?”.
- [ ] Audit projected briefing/slide routes using the projected-deck exception rather than ordinary long-page reflow rules.

### Locale parity

- [ ] For every page actually changed, audit both Chinese and English. Semantic parity is required; literal translation shape is not.

## 7. Copy-review queue discipline

The baseline copy audit returned **904 review candidates**. They are not 904 bugs.

- [ ] Group candidates by semantic family before fixing: presenter headings, project shorthand, relative time, shared hardware, abstract packaging, narrator labels, repeated eyebrow/kicker.
- [ ] Prioritize candidates that appear in H1/H2/H3, ledes, first-viewport labels, result cards and primary navigation before deep evidence/provenance text.
- [ ] For each candidate family, inspect at least two positive and two negative examples before making a shared rule stricter.
- [ ] Never mass-rewrite operational instructions merely because they contain `先…`.
- [ ] Never remove a status/sequence/date label merely because it is visually an eyebrow.
- [ ] Only promote a contextual candidate into a strict invariant after false-positive review demonstrates a stable semantic boundary.

## 8. Layout transfer audit

The sampled eight routes currently have no document-level horizontal overflow at 390px or 1440px. That does not clear every wide child on the site.

### High-risk wide-content owners to verify before/when touched

- [ ] `ModelExplorer.css` — 920px model table inside local scroll.
- [ ] `SeedOpenEvoExperimentSetup.astro` — 620px experiment table.
- [ ] `OpenEvoQ17DirectApplyAnalysis.astro` — 1040px analysis table and multi-column metric grids.
- [ ] `OpenEvoQ17AdvisorDiagnostics.astro` — 760px table.
- [ ] `OpenEvoStage1VersionComparison.astro` — 850px table.
- [ ] `OpenEvoLegacyStage2ResearchJourney.astro` — 760px historical table.
- [ ] `OpenEvoExperimentAnalysisPlan.astro` — 700/880px comparison/plan tables.

For every verified owner:

- [ ] 390px: root `scrollWidth == clientWidth`; intentional child scrolling stays local.
- [ ] 768px: no min-content expansion, clipping or sibling overlap.
- [ ] 1440px: table/diagram uses available width without gratuitous empty-card layout.
- [ ] Do not use global `overflow-x:hidden` to hide a structural failure.
- [ ] For Grid/Flex parents, inspect `min-width:0` / `minmax(0,1fr)` owner geometry when a wide child can propagate min-content width.

## 9. DOM / anchor ownership audit

- [ ] When adding same-page anchors, first reuse an existing semantic heading/section id.
- [ ] Before introducing a wrapper solely for an anchor, inspect direct-child selectors, sticky/fixed positioning, hydration ownership and browser tests.
- [ ] If a wrapper is genuinely semantic, classify it as a structure/layout change and rerun selector-dependent tests.
- [ ] Preserve the WebShop regression witness: the interactive explainer's Previous/Next transport must not silently change behavior because its DOM ancestry changed.

## 10. Transfer-test instrumentation backlog

Do not automate a rule until the manual audit proves a stable semantic boundary.

- [ ] Design a small **transfer-test** helper/checklist that takes a newly accepted preference and requires: sibling routes, one unrelated positive-control route, one exception route, and false-positive notes.
- [ ] After ALFWorld + WebShop establish a two-page benchmark family, decide whether `flow-*` environment contracts should gain an executable object-first invariant.
- [ ] Decide whether a repeated-eyebrow detector can safely compare rendered label meaning to adjacent headings without deleting useful metadata.
- [ ] Decide whether first-screen copy review can surface contextual audit candidates in priority order instead of one flat 904-item queue.
- [ ] Keep visual/semantic acceptance layered: source lint is a hint; browser geometry is different evidence; human cold-read is required for comprehension.

## 11. Acceptance standard for each future page repair

A checkbox for a page may become `[x]` only when the relevant evidence exists.

- [ ] Reader contract updated if the reader task/first viewport changed.
- [ ] First screen identifies the correct real object/result/state for that route role.
- [ ] Secondary mechanism/provenance does not compete with the primary task.
- [ ] Unknown/scientific boundaries stay visible where they change interpretation.
- [ ] No redundant narrator copy / empty eyebrow / equal-weight card wall remains in the repaired semantic region.
- [ ] Chinese and English semantics remain aligned.
- [ ] Exactly one H1.
- [ ] 390 / 768 / 1440 pressure points pass for changed layout surfaces.
- [ ] Light/dark remain readable.
- [ ] Keyboard/focus/reduced-motion behavior remains intact where relevant.
- [ ] Focused tests pass, then repository-owned UI preflight is run at release scope.
- [ ] Exact hosted route is inspected before owner handoff.

## 12. PR workflow / stopping rule

This PR is intentionally a **draft long-running audit workline**.

- [x] Initial PR contains only the audit/checklist; no product page has been changed as part of the baseline audit.
- [ ] Keep future repairs on this PR only while they remain one coherent sitewide design-transfer program. Split only when a change becomes scientifically/operationally independent or current repository policy requires another owner.
- [ ] Refresh `origin/main` before each repair batch; inspect semantic overlap with concurrent page work before editing.
- [ ] Do not trigger Vercel final-gate acceptance while this is still an audit/review workline.
- [ ] When every intended repair is complete, reconcile current main, run the repository's exact-current-base UI acceptance path, then request Vercel final gate once for the actual merge candidate.
- [ ] Do not merge this PR merely because CI is green; merge only when the Delivery Standard below is complete or the owner explicitly narrows/supersedes the scope.

## 13. Delivery Standard — required before this PR can become DONE

### Institutional transfer

- [ ] Every current reader-contract family has been reviewed against the transfer standard or an explicit route-role exception.
- [ ] At least one reusable transfer-test mechanism exists so the next major preference correction automatically asks about sibling/unrelated pages.
- [ ] Contextual copy candidates are prioritized by semantic position; no claim is made that raw candidate count equals defect count.

### High-confidence pages

- [ ] ALFWorld no longer starts mechanism-first.
- [ ] Benchmark page redundant labels are resolved or explicitly justified.
- [ ] SD-LoRA history overview no longer exposes redundant/meta first-screen packaging unless a concrete reader need justifies it.
- [ ] Shared orientation/explainer narrator grammar has been reviewed and only meaningful interaction/state labels remain.

### Safety / scientific integrity

- [ ] No PAPER / RELEASED CODE / UNKNOWN evidence layers are collapsed for visual simplicity.
- [ ] No unknown exact manifest/task identity is guessed.
- [ ] No global overflow hiding or threshold weakening is used to manufacture green UI checks.
- [ ] Route-role exceptions (operational, archive, projected deck) remain intact.

### Release

- [ ] All changed routes pass focused browser validation.
- [ ] Final exact current-base tree passes repository-owned UI preflight.
- [ ] Required exact-head GitHub/Vercel acceptance is green.
- [ ] Production is READY after merge.
- [ ] Representative Production routes are cold-read in Chinese/English and phone/desktop after release.
- [ ] This checklist records final evidence and contains no unresolved intended task items.

## 14. Baseline evidence ledger

| Evidence | Baseline |
| --- | --- |
| Audit main | `57e3db8f4f2e2711334b5026cc01523e5a55ef08` |
| Overlapping open audit PR | none found before branch creation |
| Reader-contract audit | **PASS · 63 / 63 public page patterns** |
| Strict copy audit | **579 production source files; 904 contextual review candidates; 0 strict invariant failures** |
| Human-feedback audit | **PASS · 25 precedents / 17 dimensions / 29 Gold Pairs / 6 reader-contract bindings / 315 public source files** |
| Production transfer sample | **16 / 16 renders HTTP 200; 8 routes × phone/desktop; root overflow 0 in every sampled render** |
| Positive control | WebShop first-principles page |
| Confirmed semantic FAIL | ALFWorld environment page starts mechanism-first |
| REVIEW witnesses | Benchmarks labels; capability orientation grammar; SD-LoRA history eyebrow/meta copy |
| Product changes in initial audit | **none** |

## 15. Future run protocol

When continuing this PR later:

1. Read root `AGENTS.md` and this checklist first.
2. Fetch live `origin/main` and the PR head; do not trust old chat status.
3. Re-scan overlapping PRs for the page/component being touched.
4. Pick the first meaningful unchecked item whose prerequisites are satisfied.
5. Prove the issue on current source/render before editing.
6. Make the smallest semantic-owner repair.
7. Run focused validation first.
8. Mark `[x]` only after acceptance evidence exists.
9. Update the evidence ledger with durable evidence, not temporary PIDs/ports.
10. Stop at the checklist boundary; do not turn the audit into an unrequested whole-site redesign.
