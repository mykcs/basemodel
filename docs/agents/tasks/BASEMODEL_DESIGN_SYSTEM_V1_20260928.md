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
- [x] Stage1 reference-page redesign (mechanically complete; Design-reference candidate at `94ec441d`; owner acceptance pending);
- [x] Bounded reference-page redesign (mechanically complete; Design-reference candidate at `b0dcf772`; owner acceptance pending);
- [x] Progress briefing responsive redesign (mechanically complete; Design-reference candidate for this batch; owner acceptance pending);
- [x] compare the three reference candidates; retain only the already documented shared semantic pattern, with no new component/token (Phase 3 checkpoint below);
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
- Stage1 is now mechanically complete and marked a Design-reference candidate at `94ec441d`; it has not been reviewed and accepted by the owner. Bounded and briefing retain their own upcoming evaluation; existing references accepted under other contracts keep their original, narrower scope.
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

### Phase 1 checkpoint — Stage1 reference page

- **Source/base:** code batch `94ec441d0e1d447fb7237eb9e105f869939ce381`, based on the locally integrated PR #805 publication head; `main` remained `f2d272bf697b5d121e233ceaf8b5af79c7b0cd3d`, PR #805 remained OPEN at `43fa2cbb3998824333826e8542cebf8265842f17`, and PR #806 remains one Draft candidate branch. No science or experiment state changed.
- **Reader task and order:** understand whether Stage1 supervision fit improved WebShop; first viewport now presents separate Train loss and fixed-64-task Task Score evidence with panel and Stage2/final boundaries. Full 64-task checkpoint table and method follow, then Stage1/Stage2 distinction, historical 32-task SFT/OPSD comparison, ordinary-SFT checkpoints, synthesis and evidence. Historical anchors and data remain.
- **Changed owners:** `OpenEvoStage1LearningObjectives.astro`, compact Stage1 context wording in `ResearchRouteContext.astro`, Stage1 record in `siteReaderContracts.ts`, scientific-order structural test and Stage1 browser reading-contract cases. No shared pattern/token was extracted before comparing all three references.
- **Scientific safeguards:** the new arm is explicitly historical MiniMax targets with full-parameter FSDP, 1,296 train / 144 validation examples, 3 epochs / 486 steps, LR `5e−6`, global batch 8. Its train loss, non-monotonic validation loss, fixed-64 Task Score, positive reward, exact success, paired CI, untouched final, and untested full Stage2 remain distinct from the old rank-8 LoRA, 11,198-step 32-task SFT/OPSD comparison.
- **Verification:** `npm run build` passed (265 pages and all four rendered audits); focused structural tests passed (15); `site-reader-contracts.spec.ts` passed all 24 Chromium/WebKit tests, including 390 / 768 / 1440 light/dark first viewports, existing 1280×633 and 390×844 checks, 200% text reflow and keyboard focus; `npm run check` reported 0 errors / 0 warnings / 2 existing hints; lint, CSS architecture audit and strict copy invariant audit passed. Browser screenshots and geometry are saved at `/Users/myk/Documents/Codex/2026-09-28/basemodel-mykcs-basemodel-pr-806-docs/work/design-v1-stage1-candidate/`: 390×844 figure y=367–701; 768×1024 y=411–618; 1440×1000 y=415–630; all six light/dark views had no horizontal overflow. I visually reviewed phone-light, phone-dark, tablet-light and desktop-dark. These checks establish mechanical completion and candidate status, not owner acceptance.
- **Design debt:** the duplicated long hero task/purpose copy and second separator were removed from this page. No cross-route legacy CSS debt has been retired or common component extracted in this batch.
- **Acceptance:** mechanically complete = yes; Design-reference candidate = yes; owner-accepted reference = no (owner has not reviewed the render).

### Phase 2 checkpoint — Bounded / rank32 reference candidate

- **Source/base:** Bounded code batch is being prepared from `23d60dbfd9e04c74df32b8ef81da3aed82a05b3b`. Before editing, refreshed `main` (`f2d272bf697b5d121e233ceaf8b5af79c7b0cd3d`), PR #805 (`43fa2cbb3998824333826e8542cebf8265842f17`, OPEN), PR #806 (`23d60dbfd9e04c74df32b8ef81da3aed82a05b3b`, Draft), and upstream #597 (`9aa6293e0fd409d9043d2f0ac62d72e27699ec7a`, OPEN; sealed evidence PASS). The current PR #805 rank32 publication is integrated; no experiment was run and no sealed result changed.
- **Reader task and order:** decide what the rank32 capacity screen supports. The first viewport leads with the proportional persistent-payload result, separate Task Score and Exact Success ledgers, matched R152–R159 / 1,024-pair scope, uncertainty, protected-final-panel boundary and rank16/32/64/128 next step. The earlier rank128 R150–R159 recurrence remains in the visible reading path with its 9/9 gate and ~37× trainer result labeled as a distinct historical qualification window.
- **Changed owners:** `OpenEvoSdLoraBoundedRecurrence.astro`, compact route-context label/purpose, Bounded route title/description, its executable Reader Contract, evidence publication assertions and 390/768/1440 light/dark browser cases. Rank32 persistent payload is corrected to 49.0 MiB (51,410,296 B); the copy says strict losslessness/non-inferiority are not established. The earlier longitudinal S3a R155 margin failure is identified as a different experiment from the PR #805 matched capacity fork.
- **Scientific safeguards:** score and exact-success intervals remain separate; no claim of rank32==rank128, proven equivalence/non-inferiority, rank128 over-provisioning, or rank95→rank8 capability. The capacity display explicitly covers persistent payload only, not total memory or runtime. Existing recurrence bounds, per-round sample/token dependence, historical rank128 result and untouched protected-final disclosure remain.
- **Verification:** full `npm test` passed (124 structural files / 809 tests and 7 behavior files / 37 tests); `npm run lint` passed; `npm run check` reported 0 errors / 0 warnings / 2 existing deprecation hints; `npm run build` passed all 265 pages and rendered audits; `npm run audit:css` passed. `site-reader-contracts.spec.ts` passed 36/36 tests across Chromium and WebKit, including new Bounded first-viewport assertions at 390/768/1440 in light/dark. A real built Preview at port 4173 returned HTTP 200; screenshots and measured geometry are saved at `/Users/myk/Documents/Codex/2026-09-28/basemodel-mykcs-basemodel-pr-806-docs/work/design-v1-bounded-candidate/`: the 390×844 result figure is y=432–651, boundary y=662–786; at 768×1024 result y=364–579, boundary y=590–665; at 1440×1000 result y=406–621, boundary y=632–707. All six theme/width views had no page horizontal overflow. Chromium and WebKit checks cover the actual route output; this is candidate evidence, not owner acceptance.
- **Design debt:** the duplicated rank128-first hero and redundant result link were removed. No shared Pattern/component/token was extracted before comparing all three reference candidates, and no legacy cross-route CSS debt has yet been retired. A route-specific proportional payload figure and two-ledger outcome layout were added as candidate semantics.
- **Acceptance:** mechanically complete = yes; Design-reference candidate = yes; owner-accepted reference = no (owner has not reviewed the render).

**Prior checkpoint action:** refresh current `main`, PR #805 and upstream science, then redesign the Progress Briefing reference. This action is complete; see the following checkpoint.

### Phase 2C checkpoint — Progress Briefing responsive reference candidate

- **Source/base:** Progress Briefing batch starts from #806 commit `b0dcf7727aa37a3608b9ac156609bbc70c00a6d8`; the implementation diff fingerprint is `94298c964957464c1c433fbfb9939d3267259cbb08a8a47eac5162c1ec4c9297` (SHA-256 over the non-ledger code/test diff). Refreshed current `main` (`f2d272bf697b5d121e233ceaf8b5af79c7b0cd3d`), #805 (OPEN, non-draft, head `43fa2cbb3998824333826e8542cebf8265842f17`), #806 (OPEN/Draft, head `b0dcf7727aa37a3608b9ac156609bbc70c00a6d8` before this batch), and upstream #597 (CLOSED/Draft, unmerged, head `462a1da5b20a6556c1b2849ca4a8efe81e459458`). The working tree still uses the integrated #805 publication content. No experiment was run, no scientific result was changed, and #806 remains the only redesign PR.
- **Reader task and order:** answer what Stage1 learning-signal and rank32 capacity results currently establish, then let readers follow the complete dated research history. The cover now leads with both recent answers and links to their detail pages; the 24 historical sections retain their IDs, evidence, dates, and chronology, and the ending returns to next research questions. At phone width the same content becomes ordinary vertical reading.
- **Changed owners:** `SeedOpenEvoProgressBriefing.astro`, the `study-briefing` Reader Contract, scientific/semantic structural tests, responsive browser tests, and the enforcement registry notes. The cover states Stage1 train loss improved while fixed-64-task capability did not, and rank32 reduced persistent payload while its Task Score CI crosses zero and strict non-inferiority remains unproven. DirectApply's completed 160-round history and own frozen 128-task final remain explicitly separate from 7B/GDR/SEED comparisons. No historical result, limitation, or evidence section was removed.
- **Presentation and guards:** removed the fixed 1280×720 canvas, scale script, and transformed inner slide; each section now has natural height. Added an objective current-answer first-viewport contract, stable-anchor check for all 24 sections, full-content containment, page-overflow checks, and 390/768/1440 light/dark browser cases. A wide historical Task Vector layout now becomes one column below 900px, so its scientific text and citations remain visible without page-level clipping; intentionally wide tables retain local horizontal scrolling.
- **Verification:** The full `npm test` suite passed earlier in this batch (124 structural files / 809 tests; 7 behavior files / 37 tests); `npm run lint` passed; `npm run check` reported 0 errors / 0 warnings / 2 existing deprecation hints; CSS, Reader Contract and strict copy audits passed (0 invariant failures). `npm run build` passed after the final responsive edits, building all 265 pages and rendered audits. The latest focused Chromium briefing gate passed 2/2: six 390/768/1440 light/dark views, the 390×844 two-card first viewport, all 24 stable anchors, page overflow and copy containment, plus 320px reflow and 200% text enlargement. The broader Chromium and WebKit briefing/Reader Contract/Text Memory matrices each passed 22/22 before the final 320px/200% refinements. The WebKit rerun after those refinements did not return a test result because the local test runner stopped responding during module loading; hosted exact-head CI remains the authoritative pending retry. All six saved briefing screenshots are under `work/design-v1-progress-candidate/`; visual review covered 390 light/dark, 768 light, and 1440 dark. Local Preview at `127.0.0.1:4173/research/seed-openevo/study/briefing/` returned HTTP 200 with both answers and their boundaries. Provider Preview remains final-gate work.
- **Design debt and extraction:** the obsolete fixed-slide sizing/scaling CSS and runtime script are removed. This batch adds no shared component or token; compare Stage1, Bounded, and Briefing before extracting repeated patterns. Other route-family legacy CSS work remains open.
- **Acceptance:** mechanically complete = yes; Design-reference candidate = yes; owner-accepted reference = no (the owner has not reviewed the rendered candidate). Hosted exact-head CI and provider Preview remain final-gate work.

### Phase 3 checkpoint — reference comparison and extraction decision

- **Compared:** Stage1 (`comparison`), Bounded/rank32 (`focus`), and Progress Briefing (`narrative`) against `SYSTEM.md`, `PATTERNS.md`, their three Reader Contracts, and the corresponding focused browser guards.
- **Finding:** all three keep each claim beside the evidence and boundary needed to interpret it. The actual semantic tasks differ: opposing learning/capability signals; one capacity result with two independent behaviors; and two separate research answers followed by chronology.
- **Decision:** no shared component or new token is justified. The existing `claim → evidence → boundary` entry in `PATTERNS.md` captures the stable reader responsibility; a common DOM/component would erase meaningful differences. Keep each reference composition route-specific and reuse existing tokens only where they fit.
- **Status:** Phase 3 mechanically complete; shared component/token extraction = none. Candidate styling remains provisional because the owner has not accepted any rendered reference.

**Next execution action:** migrate `/research/seed-openevo/flow/openevo/` using its Reader Contract and current experiment-side authority, then continue mechanism/Flow routes in the frozen Phase 0 inventory order.

### Phase 4 batch checkpoint — Study research gateway

- **Reader task:** show why the seven OpenEVO × WebShop experiments form one research progression, then let readers choose an experiment or cross-experiment result route. The existing ordered experiment tree remains the right desktop structure; this is a chronology/progression task, not another result-reveal page.
- **First viewport decision:** keep the experiment question in the title and lede, then show the complete seven-step research chain on phones before the seven parent entries. The prior CSS forced that chain into one tiny, ellipsized line; it now wraps at readable 16px text. Phone layouts continue to hide the child-link tree while preserving the seven parent experiments and the contract-selected featured routes.
- **Changed owners and guard:** `OpenEvoExperimentIndex.astro` and `site-reader-contracts.spec.ts`. New browser coverage checks all seven transitions, 320px/390px light/dark readability, no chain clipping or page overflow, and no mobile child-link wall.
- **Science and route scope:** the batch changes no experiment copy, result values, route identities, links, or publication state. The Study Reader Contract remains the governing content contract.
- **Verification state:** local Astro build passed (265 pages); Vitest passed (124 structural files / 809 tests and 7 behavior files / 37 tests); ESLint passed. Chromium Reader Contract passed 22/22, including the Study chain at 320px/390px, Stage1 and Bounded references at 390px/768px/1440px in light/dark, and the 1280×633 desktop plus 390×844 phone contract walks. The Study phone gate confirms all seven parent routes remain visible alongside the complete, readable progression chain. WebKit is not installed in this local checkout and is recorded as not run. Exact-head GitHub Actions run `36473622383` passed on `7542568093f3f8b0b822b9784cc9770d4c4e7895`: deterministic build, plan gate, all eight browser shards, and aggregate gate.
- **Acceptance:** mechanically complete = yes; Design-reference candidate = yes; owner-accepted reference = no (the owner has not reviewed the rendered candidate).

### Phase 4 batch checkpoint — Results paired-measurement route

- **Source/base:** Results implementation is commit `14bd3490cc9b096593563589e27d31b98a93fc8f`, on the current #806 branch based on `origin/main@f2d272bf697b5d121e233ceaf8b5af79c7b0cd3d`. Refreshed upstream authority: `mykcs/openevo-experiment/main@18f0d2bb9e6fdb8f4b8e6f86d511fb8a8c2feac5` records WB1 state-v28 as a historical adopted state; open PR #609 remains at `836fc465f94619ecf81fe24aa1465015a6d8cc66` with five owner-authorized studies preregistered but activation `PENDING_ZERO_FORMAL_PREFLIGHT`. The page keeps Track A's published result, WB1's predecessor state, and PR #609's inactive plan distinct. No experiment was run and no sealed result changed.
- **Reader task and first viewport:** answer what one-update internal transfer is established, what the latest corrected source-faithful paired 128-task measurement found, and what is actually authorized next. The page now presents those three answers before expandable detail. It labels the latest result a paired measurement, records equal 5/128 exact successes and the +1.57 interval crossing zero below the first-screen summary, and says the five-study plan is not a result and formal tasks remain locked.
- **Changed owners and guards:** Results hero, current Q7 evidence panel, next-step plan, route description, dated current-state override and the route's structural/browser guards. Existing Q1–Q7 evidence, disclosures, dated mechanism cutoff and source provenance remain in place. The obsolete method-comparison continuation prose was replaced by the current five-package plan and its activation gate; old WB1 values are identified as predecessor history. Test changes bind to reader-facing claims and state distinctions rather than stale editorial wording.
- **Pattern / debt decision:** use the compared `claim → evidence → boundary` pattern. Keep the three-answer lead and the detailed Q7 evidence table route-specific; no new shared component or token is supported by this batch. This batch removes no legacy global CSS debt.
- **Verification:** `npm test` passed (124 structural files / 810 tests; 7 behavior files / 37 tests); `npm run lint` passed; `npm run check` reported 0 errors / 0 warnings / 2 existing deprecation hints; Reader Contract audit passed (68/68); `npm run build` passed all 265 routes and rendered audits. Results route Chromium passed 14/14, including 390/768/1440 light/dark overflow/readability, no-JavaScript, and provenance checks. Combined Reader Contract + reference visual Chromium passed 24/24, including 1280×633 desktop and 390×844 phone first-screen checks, Stage1/Bounded at 390/768/1440 light/dark, Study at 320/390, and briefing at phone/tablet/desktop. The latest results-route copy change only narrows “benchmark evaluation” to “paired measurement”; this exact copy is covered by the final build and 14-test browser pass.
- **Provider / acceptance:** exact-head GitHub Actions run `36477777052` passed on `14bd3490cc9b096593563589e27d31b98a93fc8f`; PR #806 remains OPEN/Draft. Vercel's final gate is deferred until the whole candidate reaches Phase 8 under `hosting-architecture.md` and `branch-and-pr-conventions.md`; ordinary working refs intentionally do not deploy. Mechanically complete = yes; Design-reference candidate = yes; owner-accepted reference = no. The actual Vercel Preview remains a final acceptance item.
- **Next action taken:** continued into the mechanism/Flow family on the same #806 branch. The next route-specific checkpoint records that work.

### Phase 4 batch checkpoint — SEED / OpenEvo mechanism comparison

- **Source/base:** started from exact Results commit `14bd3490cc9b096593563589e27d31b98a93fc8f`. Code/test diff before checkpoint SHA-256: `ff8af8d06da1a0b14e27c71ee85b706d26dad33699853618848311c1a9bd81d5`; route scope is `/research/seed-openevo/flow/loops/`, using the canonical bilingual mechanism figure.
- **Authority and reader task:** followed `flow-loops` in `src/data/siteReaderContracts.ts`, the research presentation/copy/attention contracts, central shared content preferences and BaseModel research-archive preferences. This route explains how the same completed task experience enters SEED and OpenEvo, what each path updates, and when the result takes effect. No scientific copy, value, or evidence identity changed.
- **First viewport decision:** move the SEED × WebShop and OpenEvo deep links below the complete comparison figure and legend. On 390×844, the shared task-experience node moves from y=669 to y=578 (91px earlier), and the two method paths begin at y=724. This places the common input and first branch in the reader's initial view before navigation competes for attention; both links remain available after the full explanation.
- **Changed owners and guards:** `SeedOpenEvoCanonicalFigure.astro`, its structural invariant, and `canonical-research-figures.spec.ts`. The new browser guard verifies both deep links follow the shared input at 390/768/1440 in light/dark and checks page overflow. It preserves the canonical figure, source path, bilingual link destinations and no-JavaScript rendering.
- **Pattern / debt decision:** retain the route-specific `shared input → two update paths → accepted successor` comparison. No shared component/token or legacy global CSS removal is justified by this batch.
- **Verification:** canonical figure Chromium suite passed 19/19 across the seven figure owners, with the new six 390/768/1440 light/dark mechanism-order cases. Full Vitest passed (124 structural files / 810 tests; 7 behavior files / 37 tests); ESLint passed; Astro check reported 0 errors / 0 warnings / 2 existing Zod deprecation hints; Reader Contract audit passed (68/68); build passed all 265 static routes and rendered audits; CSS architecture audit passed. The built local Preview at `127.0.0.1:4174` returned the updated route in Chromium; 390/768/1440 light/dark had no page overflow. At 768px the shared input begins at y=424; at 1440px it begins at y=499. The 390px screenshot shows the shared input and the start of the SEED path before the fold.
- **Provider / acceptance:** Flow/loops commit `a32bbf94d1202869d47ca569056fa90f6653c01e` is pushed to #806; exact-head GitHub Actions run `36479637569` passed. Vercel final-gate Preview remains deferred to Phase 8. Mechanically complete = yes; Design-reference candidate = yes; owner-accepted reference = no.
- **Exact next action taken:** continued with the OpenEvo mechanism route `/research/seed-openevo/flow/openevo/` on the same branch.

### Phase 4 batch checkpoint — OpenEvo lifecycle explainer

- **Source/base:** started from #806 commit `a32bbf94d1202869d47ca569056fa90f6653c01e`. Route scope is `/research/seed-openevo/flow/openevo/`; no result page, result value, or scientific copy changed.
- **Authority and reader task:** followed the `flow-openevo` contract in `src/data/siteReaderContracts.ts`, canonical lifecycle ownership in `research-journey-experience.md`, and the required research copy/presentation/attention contracts. The route teaches how sealed task evidence crosses the evolution boundary, what can carry state, how validation gates the successor, and when that state reaches later tasks.
- **First viewport decision:** keep transport controls before the map so readers can advance while watching it. Shorten the WebShop example intro and collapse its seven-step picker behind a native disclosure; the current revision node then begins at y=688 on a 390×844 screen (previously y=887). The complete step list, reset after entering trace mode, module notes, technical boundary, and static task-boundary explanation remain available.
- **Changed owners and guard:** `InteractiveResearchExplainer.tsx`, `ResearchExplainerPrimitives.tsx`, and the existing scoped explainer stylesheet keep the compact picker exclusive to OpenEvo; sibling explainers retain their original controls. `research-explainer-layout.spec.ts` verifies controls-before-map order, first-viewport map entry, step disclosure, themes, and no page overflow at 390/768/1440 in light/dark.
- **Pattern / debt decision:** preserve the route-specific interactive lifecycle map and its existing evidence → validation → successor semantics. No new shared component/token, scientific copy, or legacy CSS debt removal is justified by this batch.
- **Verification:** focused OpenEvo controls passed 7/7; full `research-explainer-layout.spec.ts` Chromium passed 22/22. Full Vitest passed (124 structural files / 810 tests; 7 behavior files / 37 tests); ESLint passed; Astro check reported 0 errors / 0 warnings / 2 existing Zod deprecation hints; Reader Contract audit passed (68/68); CSS architecture audit passed; build passed all 265 static routes and rendered audits. Chromium inspection at 390/768/1440 showed the map entering each first viewport with no horizontal overflow; the 390px screenshot shows the current-revision node beginning below the controls.
- **Provider / acceptance:** current head `7fcbe41c` passed exact-head Public PR CI run `36482950772` (deterministic gate, all eight browser shards, and aggregate gate). Vercel Preview remains deferred to Phase 8. Mechanically complete = yes; Design-reference candidate = yes; owner-accepted reference = no.
- **Exact next action taken:** proceeded to the related SEED method route after refreshing its contract and the still-open PR #805 publication diff.

### Phase 4 batch checkpoint — SEED method explainer

- **Source/base:** started from #806 head `7fcbe41cd06306056f4268c5e0406dbfd779d513`, on `origin/main@f2d272bf697b5d121e233ceaf8b5af79c7b0cd3d`. Route scope is `/research/seed-openevo/flow/seed/` and its shared interaction primitives with the OpenEvo lifecycle route.
- **Authority and reader task:** followed `flow-seed` in `siteReaderContracts.ts`, research copy/presentation/attention contracts, canonical explainer ownership, current upstream experiment main `18f0d2bb9e6fdb8f4b8e6f86d511fb8a8c2feac5`, and open PR #805 at `43fa2cbb3998824333826e8542cebf8265842f17`. PR #805 changes the Stage1 learning-objective page and its reader contract; this batch leaves those files and accepted result content intact. The route still distinguishes completed-trajectory Stage1 hindsight-skill SFT from Stage2 self-analysis with OPD + GRPO under the shared WebShop interaction contract. No result value, evidence identity, or claim boundary changed.
- **First viewport decision:** the page repeated its Stage1/Stage2 overview in the outer lede and long interactive lede, then showed six trace steps before the mechanism map. Keep the outer first-layer explanation; shorten the second paragraph to the distinct Stage1/Stage2 processing difference, collapse the six-step picker, and reveal the live narration only after trace begins. Controls stay before the map and reset remains available after interaction. On 390×844 the map begins at y=738 versus y=963 before this batch.
- **Changed owners and guard:** `InteractiveResearchExplainer.tsx`, `ResearchExplainerPrimitives.tsx`, and scoped mobile CSS reuse the optional compact step picker for SEED and OpenEvo only; other interactive routes keep their existing control presentation. `research-explainer-layout.spec.ts` verifies map/controls order, first-viewport map entry, disclosure recovery, light/dark themes, and overflow at 390/768/1440 for both sibling routes.
- **Pattern / debt decision:** reuse the existing interactive map and step-control owners. No new component/token catalog entry or legacy CSS debt removal is justified.
- **Verification:** `research-explainer-layout.spec.ts` Chromium passed 28/28; full Vitest passed (124 structural files / 810 tests; 7 behavior files / 37 tests); ESLint passed; Astro check reported 0 errors / 0 warnings / 2 existing Zod deprecation hints; Reader Contract audit passed (68/68); CSS architecture audit passed; build passed all 265 static routes and rendered audits. Local Chromium confirmed no overflow for both method routes at 390/768/1440 in light/dark; both map figures enter the first viewport, and the six-step picker remains fully available on demand.
- **Provider / acceptance:** exact-head Public PR CI passed on commit `4690a56cfaee1b3345adff0f8fcc76502a38d237`, run `36484654503` (deterministic gate, all eight browser shards, aggregate gate). Vercel Preview remains deferred to Phase 8. Mechanically complete = yes; Design-reference candidate = yes; owner-accepted reference = no.
- **Exact next action taken:** inspected `/research/seed-openevo/flow/benchmarks/` under `flow-benchmarks`; its existing first viewport already shows both ALFWorld and WebShop plus the explicit non-comparable-score boundary, so no change was warranted. Continued to `/research/seed-openevo/flow/webshop/` under `flow-webshop`.

### Phase 4 route audit — Benchmarks comparison gateway

- **Source/base:** #806 head `4690a56cfaee1b3345adff0f8fcc76502a38d237`; audited `/research/seed-openevo/flow/benchmarks/` under `flow-benchmarks`.
- **Reader task and decision:** the route introduces what ALFWorld and WebShop test, displays both environment summaries in the first view, and states their scores cannot be directly compared. Its existing semantic composition already meets the contract, so the route and copy remain unchanged.
- **Browser evidence:** local Preview returned HTTP 200. Chromium at 390/768/1440 in light/dark showed both comparison labels and the score boundary in the initial viewport, with no page overflow or browser errors; on 390px the two environment headings begin at y=488 and y=603.
- **Status:** mechanically complete = yes; Design-reference candidate = yes; owner-accepted reference = no. No component, token, Pattern, or CSS debt change was justified.
- **Exact next action:** repair the WebShop route's first-viewport order under `flow-webshop`, keeping paper-reported evidence, released-code defaults, and unknown final task manifest distinct.

### Phase 4 batch checkpoint — WebShop benchmark reference page

- **Source/base and authority:** started from #806 commit `4690a56cfaee1b3345adff0f8fcc76502a38d237`. Followed the `flow-webshop` Reader Contract and canonical route ownership: the complete WebShop interaction explainer remains on this route.
- **Reader task and first viewport:** establish what WebShop is, its NeurIPS 2022 paper, scale, and dated citation evidence before offering the deeper page directory. The six-link directory previously consumed the mobile first screen before the required paper, scale, and citation facts. It now follows the benchmark summary and precedes the SEED-specific setting. Paper report, released-code defaults, and the unknown exact final 128-task manifest remain separate; no science text or evidence value changed.
- **Changed owners and guard:** `WebShopReaderMap.astro` changes only section order. `research-explainer-layout.spec.ts` adds a six-case 390/768/1440 light/dark first-viewport gate for the paper link, NeurIPS year, 1.18M products, 12,087 instructions, dated 386 Scopus citations, directory position, and page overflow.
- **Verification:** focused first-viewport Chromium gate passed all six viewport/theme cases; the complete `research-explainer-layout.spec.ts` passed 29/29; Reader Contract audit passed 68/68; ESLint passed on changed owners; CSS architecture audit passed; `npm run build` built all 265 routes and passed static heading, branded-link, rendered-math, and rendered-expression audits. Browser assertions confirm the complete facts block fits inside each first viewport; no horizontal page overflow was found.
- **Pattern / debt decision:** reuse the existing benchmark summary and page-directory owners. No shared component, token, new Pattern, scientific copy, or legacy CSS removal is justified by this route.
- **Provider / acceptance:** exact-head Public PR CI awaits this batch's commit and push. Vercel final-gate Preview remains deferred to Phase 8. Mechanically complete = pending exact-head CI; Design-reference candidate = yes; owner-accepted reference = no.
- **Exact next action:** commit and push this checkpoint on the existing #806 branch, verify exact-head Public PR CI, then continue to `/research/seed-openevo/flow/alfworld/` under `flow-alfworld`.

## 9. Stop conditions

Follow `docs/design/CODEX_LUNA_RUNBOOK.md`.

In particular, do not stop for ordinary build/test/visual iteration. Stop only for a real authority, concurrency, irreversible-action or authentication blocker.

## 10. Handoff to Codex Luna

After the owner reviews this plan, hand Luna this instruction:

> Continue `mykcs/basemodel` PR #806 on `design/basemodel-design-system-v1-20260928`, targeting main. First read `docs/agents/tasks/BASEMODEL_DESIGN_SYSTEM_V1_20260928.md`, then its full authority chain and current checkpoint. Execute `docs/design/IMPLEMENTATION.md` with `CODEX_LUNA_RUNBOOK.md` through the finite Phase 0 inventory and all mechanically executable phases. Refresh main, #805 and upstream science before touching any of the three references; preserve their full publication dependencies. Work Stage1 -> Bounded -> Progress briefing, compare all three, then extract only demonstrated reuse and migrate route families. Editorial Reader Contract/test migrations are authorized as documented; sealed science and meaningful assertions remain protected. Use one reference or at most three related routes per batch, real 390/768/1440 light/dark browser review plus the existing required matrices, and durable source-bound checkpoints. Continue through ordinary failures; isolate true blocked owners and finish independent work. Candidate design may propagate provisionally; only an actual owner render review grants owner acceptance. Finish with exact-head repository CI, actual Vercel deployment and real Preview inspection, then mark Ready. Keep one PR; do not merge or run experiments. If runtime ends, save the exact next action and report interruption rather than completion. Report scope, routes, extractions, CSS removals, guards, actual browser/CI/Preview evidence, acceptance levels and any remaining blocker.
