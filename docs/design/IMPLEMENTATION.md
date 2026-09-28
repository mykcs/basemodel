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

## Phase 2 — Build three reference pages

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
- next capacity sweep is clear.

### 2C. Progress briefing

Target composition:
- desktop may preserve presentation rhythm;
- mobile becomes normal vertical web reading, never a scaled slide;
- final state is "two questions -> two answers -> evidence -> next steps";
- internal run chronology is subordinate.

Acceptance:
- all three satisfy `DELIVERY.md`;
- no scientific claim changes;
- focused tests + browser evidence pass.

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

## Phase 6 — Reduce global visual debt

Only after enough routes use the new system.

Actions:
- map which historical CSS layers are still referenced;
- remove or consolidate dead layers one at a time;
- protect shared behavior with browser regression;
- reduce cascade overrides and route-specific emergency patches;
- keep theme/accessibility contracts intact.

This is evidence-based cleanup, not a "rewrite app.css" project.

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

## Phase 8 — Final acceptance and closeout

Before Ready for review:
- refresh current main/open PRs;
- reconcile material drift;
- run exact-head required CI/browser checks;
- inspect real Preview;
- review mobile/desktop reference pages;
- update task checklist and PR body;
- clearly state which pages are mechanically complete, Design-reference candidates, and owner-accepted.

Merge remains a separate action unless the execution prompt explicitly authorizes it.
