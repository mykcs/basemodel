# BaseModel Design v1 implementation plan

The rollout is intentionally **reference-first, then extract, then propagate**.

Do not start with a site-wide CSS rewrite.

## Phase 0 — Inventory and authority lock

Goal: know what exists before changing it.

Actions:
1. refresh `main`, open PRs and live task branch state;
2. read Wish, Design, Reader Contract and relevant current visual/research policies;
3. inventory route families and shared layout/CSS owners;
4. identify active overlapping PRs that touch the same semantic owners;
5. record legacy CSS layers and shared components that may create global coupling;
6. capture baseline screenshots for the three reference pages.

Output:
- task-specific route/owner inventory in the rollout task document;
- no speculative visual rewrite.

Freeze the v1 scope against a recorded base SHA using `src/pages/`, `src/data/siteReaderContracts.ts`, navigation and dynamic route generators. Cover both Phase 4 and Phase 5. For each family record canonical routes or generator, actual active locales, template/component/CSS owners, reader task, scientific owner, planned batch and validation witnesses. Redirects and retired routes get an explicit disposition; generated families need template coverage plus representative instances selected for long copy, dense evidence and interaction states. Do not revive archived English routes merely to fill a matrix.

Every in-scope route must end as `migrated`, `already conforms — verified`, or `blocked`, with evidence. Out-of-scope entries require a product/route-status reason; difficulty is not an exclusion. New unrelated routes after the baseline do not expand v1 automatically. Reconcile additions that share changed owners or materially alter this scope, and record that delta before proceeding.

Acceptance:
- no unknown overlapping writer on the same shared owner;
- each reference page has known scientific/content authority.

## Phase 1 — Establish Design authority

Goal: make Design discoverable and executable without duplicating narrow policies.

Actions:
- land `docs/design/`;
- route it from root `AGENTS.md`;
- keep Wish, Dev and Design responsibilities distinct;
- keep current narrow policies as detailed owners.

This phase is the planning/authority PR bootstrap.

It is already present in PR #806. Verify its discoverability; do not create another authority PR or merge it as a prerequisite to implementation.

## Phase 2 — Build three reference pages

Before each reference, apply the three-page scientific integration rule in the rollout task, including PR #805's evidence, navigation, Reader Contracts and tests. The examples below are design briefs, not a second scientific source. Read current evidence before using any number or completion claim.

The owner request authorizes an editorial/responsive migration: Stage1 presents the latest supported answer first; Bounded brings the rank32 capacity question forward while retaining original rank128 recurrence; Briefing gains a readable current-answer entry and phone flow while retaining its research history. Update the affected executable Reader Contract and presentation-only tests in the same batch. Keep scientific, visibility, accessibility and functional assertions intact. A retired 16:9 or section-order assumption is not a sealed scientific invariant.

Order:

### 2A. Stage1 learning objectives

Target composition:
- first screen visualizes the tension:
  - supervised objective improves;
  - WebShop capability does not;
- short sentence: "训练目标学得更好了，但没有因此更会做 WebShop";
- full SEED Stage2-not-tested boundary stays visible;
- setup, checkpoints, CI and provenance move deeper.

### 2B. Bounded state / rank32

Target composition:
- rank128 -> rank32 is the visual center;
- parameter payload uses an honest proportional comparison;
- behavior metrics sit on the same reading axis;
- "about 4x smaller / most behavior retained / strict losslessness not proven" appears together;
- label payload as persistent adapter payload, not total model memory, VRAM or speed; pair the capacity gain with the measured Task Score decrease;
- next capacity sweep is clear.

### 2C. Progress briefing

Target composition:
- desktop may preserve presentation rhythm;
- mobile becomes normal vertical web reading, never a scaled slide;
- final state is "two questions -> two answers -> evidence -> next steps";
- internal run chronology is subordinate.

This is an entry/ending and responsive-composition brief, not permission to replace the entire historical briefing with two answers. Preserve meaningful research chronology, deep links, technical-note access and useful desktop presentation controls.

Acceptance:
- all three satisfy `DELIVERY.md`;
- no scientific claim changes;
- focused tests + browser evidence pass.

Keep implementation and review in separate passes. Inspect the rendered page against `DELIVERY.md`, record concrete findings and fix them. Once the three pages meet the candidate criteria, continue; owner review remains pending unless a real acceptance signal exists. The 3/30-second model is a design heuristic, not a measured comprehension result.

## Phase 3 — Extract proven patterns

Only after Phase 2.

Actions:
1. compare what actually repeated across the three pages;
2. extract stable semantic patterns;
3. create components only where reuse is real;
4. establish tokens/utility classes only for repeated hierarchy/spacing needs;
5. remove one-off styling only when doing so does not flatten page semantics.

Candidate extractions:
- result reveal;
- contradiction comparison;
- capacity comparison;
- claim/evidence/boundary cluster;
- evidence disclosure;
- briefing Q/A block.

Do not build a component library in advance of proven use.

Apply the extraction rule in `PATTERNS.md`; zero justified extractions is an acceptable evidenced outcome. When candidates have not received owner acceptance, propagate only the demonstrated semantic structure and verify each recipient page on its own reader task. Do not describe the candidate's styling as an owner-approved standard.

## Phase 4 — Migrate the active research journey

Recommended order:
1. research gateway / Study entry;
2. current experiment result pages;
3. mechanism/Flow pages;
4. history/archive pages;
5. reproduction/run pages.

Work in bounded batches (normally <= 3 closely related routes).

For every batch:
- resolve Reader Contracts first;
- apply the closest proven pattern;
- keep route-specific composition where the reader task differs;
- run focused + browser checks before moving on.

## Phase 5 — Migrate broader BaseModel route families

After the active research journey is coherent:

1. model/paper/reference pages;
2. comparison/workspace surfaces;
3. homepage/global gateways;
4. secondary/legacy public routes still intended for readers.

Editorial and Workbench canvases remain distinct. Do not force one universal visual template.

Use the Phase 0 inventory as the completion denominator. A page that already meets the target should be verified and retained. Preserve route URLs/anchors, query-driven compare state, local workspace persistence, empty/error states and keyboard interactions as applicable; design migration does not authorize unrelated product or storage changes.

## Phase 6 — Reduce global visual debt

Only after enough routes use the new system.

Actions:
- map which historical CSS layers are still referenced;
- remove or consolidate dead layers one at a time;
- protect shared behavior with browser regression;
- reduce cascade overrides and route-specific emergency patches;
- keep theme/accessibility contracts intact.

This is evidence-based cleanup, not a "rewrite app.css" project.

Search both direct and generated/dynamic consumers and inspect the emitted cascade before removing a layer. A text-search miss alone is insufficient. Record the removed owner and covered consumers, or why no deletion is justified; deletion volume is not a success metric.

## Phase 7 — Add objective Design gates

Automate only what is objective.

Good candidates:
- reader-contract coverage;
- H1 uniqueness;
- root overflow;
- forbidden desktop-slide scaling patterns on mobile;
- first-viewport structural regressions for reference pages;
- card-count alarms in known editorial surfaces where a regression test is meaningful;
- figure/table accessibility checks;
- theme/responsive snapshots where stable.

Do not turn subjective taste into a brittle numeric score.

Inventory existing Reader Contract, theme, overflow, CSS and UI guards first. Extend the owning tests for a demonstrated gap; do not create duplicate gates or demand a new test for every reversible copy/style adjustment. A gate change must preserve meaningful failure detection and include a known bad case when practical.

## Phase 8 — Final acceptance and closeout

Before Ready for review:
- refresh current main/open PRs;
- reconcile material drift;
- run exact-head required CI/browser checks;
- inspect real Preview;
- review mobile/desktop reference pages;
- update task checklist and PR body;
- clearly state which pages are mechanically complete, Design-reference candidates, and owner-accepted.

Require every in-scope route to be accounted for, including broader families. Follow the current engineering/deployment owners for preflight, actual public CI execution and the same-head Vercel deployment. A docs-only planning update does not perform this website acceptance phase. A pending provider run remains pending; a resumed session rechecks its real state before reporting completion. Keep the PR Draft until this phase passes, then mark Ready without merging.

Merge remains a separate action unless the execution prompt explicitly authorizes it.
