# BaseModel Design System v1 — execution plan

Status: **IMPLEMENTATION IN PROGRESS**
Date: 2026-09-28
Repository: `mykcs/basemodel`
Branch: `design/basemodel-design-system-v1-20260928`
PR: #806

## 1. Owner request

Establish a BaseModel Design system parallel to Wish and Dev, then use it to redesign the site so content, explanation, HTML and visual composition reinforce each other.

The original request asked for a refined execution prompt to hand to Codex Luna. The owner's later instruction, `执行计划`, supersedes that planning-only boundary and authorizes implementation in this existing PR/worktree. Continue here; do not dispatch a separate implementation chat automatically. The existing prohibitions on experiments and merge remain in force.

## 2. Why this exists

The current site already has strong scientific and reader-contract rules, but visually correct pages can still feel like research documents poured into a web layout:
- too many equally weighted blocks;
- result appears late;
- card-heavy composition;
- weak visual reward for continuing to read;
- mobile can inherit desktop presentation logic;
- copy, HTML structure and visual hierarchy are not always designed as one system.

This program closes that gap without redesigning the science.

## 3. Authorities

Before implementation read:

- root `AGENTS.md`;
- `docs/wish/LATEST.md` and relevant Wish design interpretation;
- `docs/design/README.md`;
- `docs/design/LATEST.md`;
- `docs/design/SYSTEM.md`;
- `docs/design/PATTERNS.md`;
- `docs/design/DELIVERY.md`;
- `docs/design/IMPLEMENTATION.md`;
- `docs/design/CODEX_LUNA_RUNBOOK.md`;
- `docs/design/REFERENCE_PAGES.md`;
- route-specific Reader Contract;
- scientific/result authority;
- relevant `docs/agents/current/*` design/research/browser owners.

## 4. Non-goals

This task does not authorize:
- rerunning OpenEVO experiments;
- changing scientific conclusions;
- creating a new research ranking;
- rewriting Astro/React stack;
- replacing all existing current policies with Design docs;
- copying Apple/OpenAI visual styling;
- a big-bang global CSS rewrite;
- merging without explicit merge authorization.

## 5. Deliverables

### Authority
- [x] create `docs/design/` parallel to Wish/Dev;
- [x] define Design responsibilities and precedence;
- [x] define current Design direction;
- [x] define semantic pattern catalog;
- [x] define delivery standard;
- [x] define site-wide implementation phases;
- [x] define Codex Luna autonomous runbook;
- [x] define first reference pages;
- [x] route Design from root `AGENTS.md`.

### Implementation
- [x] Phase 0 inventory, baseline screenshots, and shared UI preflight (checkpoint recorded below);
- [ ] Stage1 reference-page redesign;
- [ ] Bounded reference-page redesign;
- [ ] Progress briefing responsive redesign;
- [ ] extract only proven shared patterns/components;
- [ ] migrate active research journey;
- [ ] migrate broader route families;
- [ ] reduce proven-dead legacy visual layers;
- [ ] add objective Design guards where useful;
- [ ] full exact-head CI/browser/Preview acceptance.

### Closeout
- [ ] update this checklist with evidence;
- [ ] classify mechanically complete vs Design-reference candidate vs owner-accepted;
- [ ] refresh current main/open PRs before final gate;
- [ ] make PR Ready only after exact-head acceptance;
- [ ] do not merge unless separately authorized.

## 6. Scientific integration prerequisite for all three references

Stage1, Bounded **and Progress briefing** have scientific publication work in PR #805. The dependency includes their content components, `src/data/siteReaderContracts.ts`, `src/data/openEvoExperimentNavigation.ts`, the evidence mirror and publication/reading/briefing tests.

Before each affected batch:
1. refresh `main`, #806 head, #805 state/head/diff and the upstream scientific source revisions;
2. distinguish sealed scientific evidence from whether its website publication has merged; record both;
3. if #805 merged, incorporate current main into this branch before editing; if open, review its whole dependency set and integrate the required delta into this same branch only when semantic ownership is understood;
4. preserve newer scientific content and related assertions; never restore an old page snapshot or partially copy only a new hero;
5. re-read any subsequent #805 changes before the next affected write and final gate; unresolved concurrent semantics block that owner while independent work continues.

Keep #806 targeting `main`; no prerequisite merge or parallel redesign PR is authorized. Main and PR movement invalidates only the affected scientific/integration assumptions, not all prior independent work.

### Planning inspection checkpoint — refresh on execution

- Main observed at `f2d272bf697b5d121e233ceaf8b5af79c7b0cd3d`; #806 at `ee5067942b33b588f451dd91c4995a5209bf1015`, OPEN/Draft, before this revision.
- #805 was OPEN at `43fa2cbb3998824333826e8542cebf8265842f17`. Upstream `mykcs/openevo-experiment#597` was OPEN at `9aa6293e0fd409d9043d2f0ac62d72e27699ec7a`; its final scientific summary and #805's mirror agreed on the checked A/B results. These are inspection snapshots, not permanent current-state authority.
- No page in this rollout has yet received mechanical completion, Design-reference candidate or owner-accepted status. Existing references accepted under other contracts keep their original, narrower scope.
- The observed #806 bootstrap `public-ci-gate` passed; browser execution was skipped for docs-only scope. This is documentation CI evidence, not website Design acceptance.

The Design program may change hierarchy, narrative entry, semantic HTML and responsive composition. The current owner request authorizes updating the associated editorial Reader Contracts and presentation assertions in the same batch: Bounded may lead with the new capacity question while preserving original rank128 recurrence; Briefing may present current answers first and use phone vertical reading while preserving its full historical explanation. Scientific chronology, values, panels, claim limits, accessibility and functional checks remain protected. See `REFERENCE_PAGES.md` for exact owners, known test conflicts and the byte-unit correction to make during implementation.

### Phase 0 — frozen scope and baseline

**Scope base:** `f2d272bf697b5d121e233ceaf8b5af79c7b0cd3d` (`origin/main`, refreshed 2026-09-28). **Integrated candidate:** `e28bcac38d2fdac516f937117b64c993907d8ffd`, which contains the exact open #805 head `43fa2cbb3998824333826e8542cebf8265842f17` and this PR's plan commit. #805 remains OPEN and its science is not described as a merged website publication. Upstream `openevo-experiment#597` remains OPEN at `9aa6293e0fd409d9043d2f0ac62d72e27699ec7a`; its scientific summary is PASS. No experiment was run.

The active site builds **265 HTML files** from **68 route templates** (65 fixed and 3 generated); `dist` matched the predicted route set with no missing or extra paths and contains no active English pages. Freeze **257 design acceptance surfaces**: 256 canonical content routes plus `dist/404.html`. Six HTML compatibility routes (three fixed and three generated primer pages) and two externally migrated routes are verified for their destinations, not redesigned. The 10 `_bodies` files are partials, not routes. `/en` redirect rules and other aliases are compatibility checks, not separate page instances. Active locale is `zh`; archived English source remains out of scope.

| Family / routes | Owner and contract | Phase / representative coverage |
|---|---|---|
| Stage1 `/research/seed-openevo/study/capability-exploration/stage1-learning-objectives/`; Bounded `/research/seed-openevo/study/capability-exploration/sd-lora-bounded-state/`; briefing `/research/seed-openevo/study/briefing/` | `OpenEvoStage1LearningObjectives.astro`, `OpenEvoSdLoraBoundedRecurrence.astro`, `SeedOpenEvoProgressBriefing.astro`; `siteReaderContracts.ts` and `capabilityReaderRoutes.ts`; page-scoped CSS, `AppLayout.astro` / `src/styles/app.css` shell | Phase 2, in this order; dedicated tests and all three routes |
| Research journey and mechanism: `/research/seed-openevo/study/`, `/research/seed-openevo/study/capability-exploration/`, `/research/seed-openevo/flow/`; `/research/seed-openevo/flow/{seed,openevo,benchmarks,webshop,alfworld,loops,sd-lora}/`; capability mechanism routes `/research/seed-openevo/study/capability-exploration/{gated-delta-sd-lora,gdr-directapply,mechanism-1-0,text-memory,sd-lora-scaling}/` | Study/Flow route components, `InteractiveResearchExplainer`, canonical figures and route-scoped styles; `siteReaderContracts.ts`, `capabilityReaderRoutes.ts`, navigation owner | Phase 4; one route per semantic family, with mechanism and narrow viewport representatives |
| Results and analysis: `/research/seed-openevo/study/results/`; `/research/seed-openevo/study/results/{3b-self-analysis,7b-self-analysis,3b-minimax-analysis,7b-minimax-analysis,four-arm-analysis}/`; generated canonical notes listed below | Results components and `OpenEvoExperimentResultsScaffold`; `[note].astro` → `OpenEvoWebShopResultNote` / `OpenEvoWebShopBenchmarkNote`; matching reader contracts and route-scoped styles | Phase 4; current, historical, unrun and measurement-boundary states |
| History and follow-on routes: `/research/seed-openevo/study/capability-exploration/{archive,first-run,stage1-previous,stage1-evolution,stage2-256-window,stage2-7b-analysis,stage2-ceiling,bounded-effective-state-gdr,openevo-2-0,openevo-2-0/exploration,openevo-2-0/harness-2-0,openevo-2-0/report,q17-directapply-analysis,q17-directapply-frontier,sd-lora-bounded-acceleration,sd-lora-equivalence,sd-lora-history,sd-lora-history-novelty,sd-lora-present-function,sd-lora-future-learning}/` | Route wrappers and `OpenEvo*` content owners; SD-LoRA history series shares `OpenEvoSdLoraHistorySkeleton`; route contracts and local styles | Phase 4; preserve historical identities, anchors, evidence, interactive and long-form examples |
| Research operations and technical reference: `/research/seed-openevo/study/{run,minimax-teacher,briefing/technical-notes}/`, `/guide/`, `/guide/today/` | `OpenEvoSeedBenchmarksGuide`, `SeedOpenEvoBriefingTechnicalNotes`, operational route components and disclosures; route contracts and scoped styles | Phase 4; route-specific operational/reference task and keyboard/disclosure states |
| Generated model pages `/models/{id}/` (167 records), model index `/models/`; generated papers `/papers/{id}/` (21 records), paper index `/papers/` | `src/pages/models/[id].astro` → `_bodies/model-detail.astro`; `src/pages/papers/[id].astro` → `_bodies/paper-detail.astro`; `content.config.ts`; model/paper reader contracts and detail styles | Phase 5; models: `kimi-k2-thinking`, long-name `mistral-small-24b-instruct-2501`, dense `mistral-large-3`, experiment-linked `qwen2-5-3b-instruct`; papers: `metagpt`, long-title `osworld`, evidence-dense `seed` |
| Generated result-note routes `/research/seed-openevo/study/results/{why-it-kept-failing,first-positive-transfer,independent-replication,second-generation,measurement-boundary,current-conclusion,benchmark-first,seed-faithful-benchmark,openevo-benchmark-design}/` (9 canonical instances) | `src/pages/research/seed-openevo/study/results/[note].astro`; two note components; `result-note` contract | Phase 4; inspect `measurement-boundary`, `current-conclusion`, and `seed-faithful-benchmark` |
| Family / landscape / compare / workspace: `/families/`, `/landscape/`, `/compare/`, `/workspace/` | `FamilyTimeline`, `LandscapePrototype`, `ModelComparison`, `ResearchWorkspace`; respective reader contracts, `workspace.css` and scoped owners | Phase 5; filters, empty/error states, URL compare state, stored workspace state and keyboard interactions |
| Broad entry and reference: `/`, `/methodology/`, `/data-status/`, `/development/`, `/404.html` | `_bodies/home-v2`, `_bodies/data-status`, `DevelopmentWorkflowPage`, route-local methodology/404 owners; reader contracts and global shell | Phase 5; home/global gateway, evidence status, methodology, 404 recovery |

The fixed route templates are frozen at these routes (all active `zh`):

```text
/compare/  /data-status/  /development/  /families/  /guide/today/  /guide/  /
/landscape/  /methodology/  /models/  /papers/  /workspace/  /404.html
/research/seed-openevo/flow/  /research/seed-openevo/flow/alfworld/  /research/seed-openevo/flow/benchmarks/
/research/seed-openevo/flow/loops/  /research/seed-openevo/flow/openevo/  /research/seed-openevo/flow/sd-lora/
/research/seed-openevo/flow/seed/  /research/seed-openevo/flow/webshop/
/research/seed-openevo/study/  /research/seed-openevo/study/briefing/  /research/seed-openevo/study/briefing/technical-notes/
/research/seed-openevo/study/capability-exploration/  /research/seed-openevo/study/capability-exploration/archive/
/research/seed-openevo/study/capability-exploration/bounded-effective-state-gdr/  /research/seed-openevo/study/capability-exploration/first-run/
/research/seed-openevo/study/capability-exploration/gated-delta-sd-lora/  /research/seed-openevo/study/capability-exploration/gdr-directapply/
/research/seed-openevo/study/capability-exploration/mechanism-1-0/  /research/seed-openevo/study/capability-exploration/openevo-2-0/
/research/seed-openevo/study/capability-exploration/openevo-2-0/exploration/  /research/seed-openevo/study/capability-exploration/openevo-2-0/harness-2-0/
/research/seed-openevo/study/capability-exploration/openevo-2-0/report/  /research/seed-openevo/study/capability-exploration/q17-directapply-analysis/
/research/seed-openevo/study/capability-exploration/q17-directapply-frontier/  /research/seed-openevo/study/capability-exploration/sd-lora-bounded-acceleration/
/research/seed-openevo/study/capability-exploration/sd-lora-bounded-state/  /research/seed-openevo/study/capability-exploration/sd-lora-equivalence/
/research/seed-openevo/study/capability-exploration/sd-lora-future-learning/  /research/seed-openevo/study/capability-exploration/sd-lora-history/
/research/seed-openevo/study/capability-exploration/sd-lora-history-novelty/  /research/seed-openevo/study/capability-exploration/sd-lora-present-function/
/research/seed-openevo/study/capability-exploration/sd-lora-scaling/  /research/seed-openevo/study/capability-exploration/stage1-evolution/
/research/seed-openevo/study/capability-exploration/stage1-learning-objectives/  /research/seed-openevo/study/capability-exploration/stage1-previous/
/research/seed-openevo/study/capability-exploration/stage2-256-window/  /research/seed-openevo/study/capability-exploration/stage2-7b-analysis/
/research/seed-openevo/study/capability-exploration/stage2-ceiling/  /research/seed-openevo/study/capability-exploration/text-memory/
/research/seed-openevo/study/minimax-teacher/  /research/seed-openevo/study/results/  /research/seed-openevo/study/results/3b-minimax-analysis/
/research/seed-openevo/study/results/3b-self-analysis/  /research/seed-openevo/study/results/7b-minimax-analysis/
/research/seed-openevo/study/results/7b-self-analysis/  /research/seed-openevo/study/results/four-arm-analysis/  /research/seed-openevo/study/run/
```

Generated route inputs: `src/content/models/*.json` (167 unique IDs), `src/content/papers/*.json` (21 unique IDs), and the 12-entry result-note generator (9 canonical notes + 3 compatibility primers). Compatibility dispositions: `/research/seed-openevo/flow/base-model/` → `/models/qwen2-5-3b-instruct/#experiment-setup`; `/research/seed-openevo/study/design/` → `/research/seed-openevo/flow/#training-design`; `/research/seed-openevo/study/capability-exploration/vanilla-sd-lora/` → `/research/seed-openevo/flow/sd-lora/`; generated `webshop-training` → `/research/seed-openevo/flow/webshop/`, `seed-training` → `/research/seed-openevo/flow/webshop/#fig-seed-webshop`, `openevo-training` → `/research/seed-openevo/flow/openevo/`. Externally migrated `/lab/` → `https://fuhuo-20260419.vercel.app/docs/machines` and `/research/seed-openevo/flow/server/` → `https://fuhuo-20260419.vercel.app/docs/server-governance`; verify their live redirect behavior and keep them outside the redesign denominator. There are 154 redirect rules; `/en` variants and old aliases are redirect compatibility cases, not active English page inventory. `sitemapRoutes.ts` omits nine active research paths and 404, so it is not the scope authority.

Route discovery evidence: `rg --files src/pages -g '*.astro'`; model/paper JSON ID counts from `src/content`; generator outputs from `getStaticPaths`; exact generated output from `dist/**/*.html`. The initial build at candidate `e28bcac3` emitted 265 HTML files, exactly matching predicted route instances (0 missing/0 extra), 0 English pages; `audit:headings`, `audit:brand-links`, `audit:math:rendered`, and `audit:human-expression:rendered` passed.

Baseline render evidence is saved outside the repository at `/Users/myk/Documents/Codex/2026-09-28/basemodel-mykcs-basemodel-pr-806-docs/work/design-v1-baseline/`. It contains 18 full-page screenshots plus six readable 390×844 first-viewport screenshots for the three references, each in light/dark at 390×844, 768×1024, and 1440×1000. The real built Preview returned 200 for all 18 visits and reported no root horizontal overflow. I visually inspected the three 390×844 light first viewports: Stage1 spends much of the entry on route/setup text before the result; Bounded leads with the old rank128 recurrence before its new capacity result; Briefing retains a 16:9 slide surface on a phone. These are baseline findings, not acceptance. At candidate `e28bcac3`, `npm run preflight:ui` passed all project-required phases: `verify:deploy`, static build (265 HTML pages), 390/768/1440 overflow preflight, and 418 Chromium/WebKit UI tests. Playwright used a task-local browser directory with exact cached Chromium and newly installed WebKit 2359; no user home browser files were changed. The local built preview returned 200 across the 18 captured visits. This is mechanical baseline evidence, not reference acceptance.

Overlap snapshot: #805's entire current delta is integrated locally into this branch. #783 is a Draft plan-only PR targeting Models/Papers/Compare/Workspace after its own #781/#782 dependencies; it has no implementation files in this task's current tree and must be refreshed before Phase 5 touches those reader tasks. #800 is a dependency-update PR with no route-owner overlap. No other open implementation PR targets the three reference owners. Refresh all heads again before each relevant batch and final acceptance.

## 7. Execution order

```text
authority + inventory
-> Stage1
-> Bounded
-> Briefing
-> compare three real pages
-> extract proven patterns
-> active research route families
-> broader BaseModel route families
-> shared CSS debt reduction
-> objective design guards
-> exact-head acceptance
-> Ready for review
```

## 8. Evidence cadence

After each reference page and each route-family batch, record:
- reader task;
- scientific authority checked;
- files changed;
- focused tests;
- browser widths inspected;
- visual problem found;
- fix made;
- remaining work.

Do not persist temporary Preview share tokens, local PIDs or ports.

Phase 0 must add the finite route/family inventory here following `IMPLEMENTATION.md`; this existing task is the execution ledger, not a second Design constitution. Use compact records with route/template/locale, owner, planned phase/batch, disposition and evidence links. Track canonical routes separately from redirect/retired routes and generated family representatives. Record migrated versus already-conformant routes honestly.

For each completed batch add the base/source commit or tree, exact checks actually run, fresh build/browser evidence, concrete review findings/resolution and the three separate acceptance fields from `DELIVERY.md`. Record any blocked owner and dependency explicitly. Keep the next action below current so another session can continue without rebuilding the plan.

**Next execution action:** refresh current main, PR #805 and upstream scientific source status, then implement the Stage1 reference page. Phase 0 is mechanically complete at candidate `e28bcac3`; Phases 2–8 remain open.

## 9. Stop conditions

Follow `docs/design/CODEX_LUNA_RUNBOOK.md`.

In particular, do not stop for ordinary build/test/visual iteration. Stop only for a real authority, concurrency, irreversible-action or authentication blocker.

## 10. Handoff to Codex Luna

After the owner reviews this plan, hand Luna this instruction:

> Continue `mykcs/basemodel` PR #806 on `design/basemodel-design-system-v1-20260928`, targeting main. First read `docs/agents/tasks/BASEMODEL_DESIGN_SYSTEM_V1_20260928.md`, then its full authority chain and current checkpoint. Execute `docs/design/IMPLEMENTATION.md` with `CODEX_LUNA_RUNBOOK.md` through the finite Phase 0 inventory and all mechanically executable phases. Refresh main, #805 and upstream science before touching any of the three references; preserve their full publication dependencies. Work Stage1 -> Bounded -> Progress briefing, compare all three, then extract only demonstrated reuse and migrate route families. Editorial Reader Contract/test migrations are authorized as documented; sealed science and meaningful assertions remain protected. Use one reference or at most three related routes per batch, real 390/768/1440 light/dark browser review plus the existing required matrices, and durable source-bound checkpoints. Continue through ordinary failures; isolate true blocked owners and finish independent work. Candidate design may propagate provisionally; only an actual owner render review grants owner acceptance. Finish with exact-head repository CI, actual Vercel deployment and real Preview inspection, then mark Ready. Keep one PR; do not merge or run experiments. If runtime ends, save the exact next action and report interruption rather than completion. Report scope, routes, extractions, CSS removals, guards, actual browser/CI/Preview evidence, acceptance levels and any remaining blocker.
