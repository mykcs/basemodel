# BaseModel content-first redesign — baseline audit 2026-09-16

Status: **ACTIVE EVIDENCE / PR #737**

This file is execution evidence for `docs/agents/tasks/BASEMODEL_CONTENT_FIRST_APPLE_GUIDED_REDESIGN_20260916.md`. It is not a new design authority. Current `docs/agents/current/*`, executable Reader Contracts, tests, and live provider/repository state remain authoritative.

## 1. Exact state refreshed before implementation

- current integration base: `main@d3631890f89c0fe62e249c088794b64a0b503f00`;
- that base includes merged PR #731 (`ci: make public preflight risk-adaptive and add cloud review preview`);
- PR #737 working branch was rebuilt onto that exact current base before this audit;
- refreshed PR #737 head at audit start: `881d9500915704e3f97454e77bd470c9aca67627`;
- main `Vercel` status on `d3631890...`: `success`;
- PR #737 remains Draft; no final-release authority is implied by this audit.

### Repeated-correction witness

`owner asks for Apple-like design -> current owner = ui-design-principles + site-reader-attention-contract + website-design-spec/HPL -> checked artifact = owner screenshots + structured Apple-surface rejection precedent + live route source -> allowed next action = change semantic composition only after pre-write preference retrieval and before screenshots -> invalidation cue = main/overlapping PR head changes, new direct owner feedback, or browser evidence contradicts the audit`.

## 2. Human-preference evidence activated before writing

The research-surface `AGENTS.md` requires preference retrieval before the first substantial copy/layout edit. The local execution surface was unavailable during this pass, so the repository command itself has **not** yet been claimed as executed. No substantial page-source rewrite is being credited before that requirement is satisfied.

The underlying current preference data was nevertheless cold-read through repository source. It already contains the exact failure mechanism the owner repeated in this conversation:

- a structured preference titled **“一个首屏只承担一个主要理解任务”**;
- a case titled **“标题命名对象，不主持阅读”**;
- the rejected event `EVENT-20260909-SITEWIDE-APPLE-SURFACE-REPEAT`, whose mechanism is `reference-surface-imitation` and whose owner feedback says the previous Apple reference copied the surface rather than the underlying design logic.

Therefore the migration must optimize reader task, grouping, adjacency, shared axes, flow, progressive disclosure, and content priority. It must not treat Apple-like typography, rounded rectangles, gradients, full-screen heroes, or large display text as the target.

## 3. Route inventory handling

`seed-openevo-research-ia-route-inventory-2026-09-03.md` is a bounded historical inventory at its named baseline. It should **not** be silently rewritten into a claim that the 2026-09-03 route count is still the current tree.

Current-main drift relevant to this redesign includes later semantic owners such as:

- `/research/seed-openevo/flow/sd-lora/`;
- the SD-LoRA acceleration/history/scaling/bounded-state family;
- `/research/seed-openevo/study/capability-exploration/q17-directapply-analysis/`;
- newer server artifact-lifecycle content.

Implementation should use the old inventory for topology rationale and current executable route/Reader-Contract truth for edits.

## 4. Pilot-page smell inventory

| Pilot | Current reader task | Concrete baseline smell | Why it matters | Safe first response |
| --- | --- | --- | --- | --- |
| Flow gateway | build the SEED/OpenEvo/environment mental model | `SeedOpenEvoResearchHub.astro` turns five research objects, three experiment steps, and four evidence types into repeated bordered boxes/cards; the mission hero is also a full-height bordered surface | the page uses the same visual primitive for different relationships, so grouping no longer explains meaning | preserve the Reader Contract, reduce decorative enclosure, express objects/sequence/evidence with different native structures |
| SD-LoRA mechanism | understand why/when the parameter write-back happens | intro stacks H1 + long lede + scope + five-stage process + timing before the next conceptual section; ordinary LoRA vs SD-LoRA is two prose cards rather than a strong shared axis | the mechanism exists, but first-screen density and card treatment can make the causal path harder to scan than necessary | keep the real five-stage path; simplify the first layer and convert true comparisons to shared-axis structure |
| Q17 result/analysis | understand the sealed 160-round result and its boundaries | the route is a good result pilot semantically, but open PR #728 currently owns a W&B/provenance edit in `OpenEvoQ17DirectApplyAnalysis.astro` | editing current main now risks overwriting a fresh scientific-publication delta | WAIT/STACK on #728 exact head before result-pilot implementation |
| Server operations | see storage state, safety boundary, and next safe action | hero contains current status, safety boundary, a default-maintenance prompt disclosure, and a three-link operation switchboard while legacy CSS forces the hero toward one viewport height | controls can compete with the operational fact they are supposed to support; full-height geometry is also suspicious under the no-empty-viewport rule | keep storage/safety visible, make the current state the visual owner, and move secondary controls only as far down as the Reader Contract allows |

## 5. Shared CSS / composition debt found

### 5.1 Historical cascade still owns visible behavior

`src/styles/app.css` currently loads several historical page-wide layers before the canonical component owners:

```text
v2-closeout.css
visual-upgrade.css
design-refinement.css
final-hardening.css
actionable-content.css
mobile-composition.css
visual-closeout.css
```

This confirms that the redesign cannot be implemented by adding one more patch stylesheet. Touched routes should migrate behavior into semantic owners and retire attributable legacy overrides only after pilot proof.

### 5.2 Concrete rule that conflicts with current design intent

`mobile-composition.css` gives `.mission-hero__copy` a decorative gradient, permanent shadow, border and large-radius card treatment on mobile. Current `ui-design-principles.md` says ordinary hierarchy should not rely on permanent shadows and decorative gradient families are not part of the product identity.

This is a direct implementation gap between the current design contract and the rendered CSS, not a request for another Apple-looking skin.

### 5.3 Full-height geometry needs falsification

`visual-closeout.css` forces the server hero (and lab intro) to approximately one viewport height with centered content. `SeedOpenEvoMissionHero.astro` also gives the mission copy `min-height: calc(100svh - 80px)`.

The current Reader Attention Contract explicitly warns against using `100vh/100svh`, padding, or empty space merely to push later content below the fold and obtain a cleaner first-screen count. These rules are therefore candidates for pilot-level removal or narrowing **only after browser evidence shows the reader task remains clear**.

## 6. Open-PR semantic conflict map

| PR | Relationship to #737 | Handling |
| --- | --- | --- |
| #728 · Q17 W&B trajectory mirror | direct overlap with the best current result-pilot component | **WAIT / STACK** before touching `OpenEvoQ17DirectApplyAnalysis.astro`; preserve its non-authoritative W&B mirror wording and provenance |
| #734 · full SD-LoRA two-line conversation | same broader SD-LoRA knowledge family, but currently modifies acceleration-context/v2 owners rather than `/flow/sd-lora/` mechanism owner | **RECONCILE** navigation/naming; do not collapse Stable Reduction and Bounded Online Recurrence or overwrite #734 semantics |
| #729 · Bounded + Effective-State GDR publication plan | currently plan-only; future new route/nav ownership may overlap later family migration | **INDEPENDENT NOW / RECONCILE LATER** when its runtime page or shared nav lands |
| #735 and older conversation-closeout PRs | docs/history/governance only for this route migration | **INDEPENDENT**, except refresh main if any merge changes canonical rules |
| #731 | merged into current main during this task | **ABSORBED** by rebuilding #737 from the new main |

A clean Git merge is not enough; each pilot must re-read overlapping semantic owners before its first source write.

## 7. Before-screenshot and local-execution status

The task requires representative desktop + phone **before** screenshots and the research `AGENTS.md` requires the repository-owned preference retrieval command before a substantial layout rewrite.

During this pass the authorized Remote Desktop Commander endpoint did not respond to a minimal repository-discovery command. That observation means only that the local browser/worktree execution surface is temporarily unavailable; it is **not** a repository or product failure and it does not justify weakening the requirement.

Pending before the first material pilot rewrite:

1. run the repository-owned `feedback:retrieve` for the selected pilot Reader Contract;
2. capture task-owned desktop and phone baseline renders for the selected pilot;
3. bind the render to the exact #737 head / local worktree rather than a stale server;
4. only then change the pilot source and perform Phase-A blind cold read before Phase-B preference comparison.

## 8. Phase-A evidence status

Four of the five Phase-A checklist rows now have durable evidence:

- current main / PR head / current authorities refreshed;
- bounded 2026-09-03 route inventory reused without falsifying its historical cutoff, and current route drift recorded;
- visual/content smell inventory created for all four planned pilot families;
- overlapping PRs classified by semantic ownership.

The fifth Phase-A row — representative desktop + phone before screenshots — remains pending. Phase A must **not** be marked complete until those exact renders exist.

## 9. Next safe action

When the local/browser execution surface is reachable, start with the **Flow gateway** rather than the Q17 result page:

1. run preference retrieval for Reader Contract `flow` with cues around `Apple 内容优先 首屏 视觉中心 卡片化 对象关系`; 
2. capture `/research/seed-openevo/flow/` at the repository’s canonical desktop and phone viewports;
3. perform zero-context baseline answers before reading the preference comparison output;
4. rewrite only the minimum gateway composition needed to prove the design language — likely reducing full-height/card chrome, separating **peer objects / true sequence / evidence** into different semantic forms, while retaining the matched-comparison boundary;
5. validate Reader Contract, overflow, keyboard/focus, mobile geometry, light/dark themes and current CI planner behavior before expanding to another route.

Do not touch Q17 result composition until #728 has been reconciled, and do not turn the pilot into a sitewide CSS rewrite.
