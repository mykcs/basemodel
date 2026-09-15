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

The research-surface `AGENTS.md` requires preference retrieval before the first substantial copy/layout edit. After the local execution surface became available, the repository-owned command was executed on the Flow Reader Contract before the first material source rewrite:

```text
npm run feedback:retrieve -- --contract=flow "Apple 内容优先 首屏 视觉中心 卡片化 对象关系 说人话"
```

The returned preference brief activated the exact failure mechanisms relevant to this task: one primary first-screen task, direct facts before presenter choreography, object-first identity, progressive disclosure, and preservation of scientific boundaries. It also surfaced the prior rejected Apple-surface imitation event.

The same current preference data contains the exact failure mechanism the owner repeated in this conversation:

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

The local browser/worktree surface is now available and bound to the task-owned checkout. Before the first material Flow rewrite, the repository-owned preference retrieval command ran and task-owned baseline renders were captured at the canonical viewports:

- desktop: `1280×633`;
- phone: `390×844`;
- route: `/research/seed-openevo/flow/`;
- source branch: `design/content-first-apple-guided-redesign-20260916`.

The screenshots remain temporary review evidence outside the repository. They are intentionally not promoted to standing policy or long-term source assets. The baseline showed the H1 and lede pushed down inside a large rounded full-height surface, with large areas of empty space on both desktop and phone.

## 8. Phase-A evidence status

All five Phase-A checklist rows now have durable evidence:

- current main / PR head / current authorities refreshed;
- bounded 2026-09-03 route inventory reused without falsifying its historical cutoff, and current route drift recorded;
- visual/content smell inventory created for all four planned pilot families;
- overlapping PRs classified by semantic ownership;
- representative desktop + phone before renders captured from the exact task-owned Flow route.

Phase A is therefore complete: **10 / 10 weighted points**.

## 9. Flow gateway pilot — first implementation loop

The first Flow pilot now tests the program’s core content-shape claim instead of adding another visual skin:

- the compact hero no longer uses a full-height rounded panel;
- the first layer names the actual experiment directly: `SEED 与 OpenEvo：ALFWorld / WebShop 实验`;
- a semantic `dl` keeps model, methods, tasks, matched conditions and scientific record together in the first comprehension layer;
- the five equal research-object cards are replaced by a grouped relationship map (`模型 / 学习方法 / 任务环境`);
- the experiment route stays an ordered list with an explicit connected path;
- evidence becomes a line-separated ledger rather than another equal-weight card set;
- the Flow-specific mobile override neutralizes the legacy gradient/shadow only for this compact pilot instead of performing a sitewide CSS rewrite.

The first browser Reader Contract run correctly rejected the initial rewrite because the next `研究对象` heading and extra links entered the first screen. The fix did **not** loosen the budget or re-add empty `100svh` spacing. Instead, a meaningful first-layer experiment frame now occupies that space. Fresh geometry shows only the H1 and one disclosure target in the first viewport at both `1280×633` and `390×844`, while the next section begins below the first screen.

This is the intended gate behavior: when a compact layout exposes too much at once, add or regroup useful information only when it belongs to the first task; do not game the proxy with blank space or higher thresholds.

## 10. Phase-B shared-composition audit status

Two Phase-B rows are now complete:

1. the global shell, research nav, heading rhythm, spacing, radii, borders, elevation, color semantics and disclosure behavior have been audited against the active Flow pilot;
2. the legacy page-wide cascade has been traced through `v2-closeout.css`, `visual-upgrade.css`, `design-refinement.css`, `final-hardening.css`, `actionable-content.css`, `mobile-composition.css` and `visual-closeout.css`, with canonical `components/global-shell.css` and `components/header.css` loading last.

The pilot has produced candidate composition forms — editorial compact hero, fact `dl`, relationship `dl`, connected `ol`, evidence ledger — but they are **not yet promoted as shared components**. A second semantically different pilot must prove which of these are genuinely reusable before Phase B’s shared-primitive checkbox is closed.

## 11. Next safe action

Finish the Flow pilot validation and preserve its exact evidence, then move to the SD-LoRA mechanism pilot. Q17 result composition remains blocked from direct editing until PR #728 is reconciled. The SD-LoRA pilot must refresh PR #734 first, run its own Reader Contract preference retrieval, and preserve the real five-stage causal topology rather than inheriting the gateway layout.

## 12. Flow pilot validation snapshot

Validation was rerun after the first-screen frame fix on the task-owned worktree.

Repository checks:

- `npm run check`: **575 files, 0 errors, 0 warnings** (2 existing deprecation hints);
- targeted copy / visual-language / human-feedback / Reader Contract Vitest: **35 / 35 PASS**;
- `npm run audit:human-feedback`: **PASS** — 26 precedents, 18 preference dimensions, 30 Gold Pairs, 6 reader-contract bindings, 262 public source files;
- `npm run build`: **262 pages PASS**;
- static-heading audit: **262 / 262 routes PASS**;
- external-brand-link audit: **PASS**.

Browser evidence:

- full `site-reader-contracts.spec.ts`: **5 / 5 PASS**, including desktop `1280×633` and phone `390×844` first-screen budgets;
- focused layout / training-design suite: **6 PASS, 1 expected locale-scope skip** across phone, tablet, desktop, large-desktop dark, dark theme and reduced motion;
- direct Flow geometry check: zero page-level horizontal overflow on desktop light/dark, phone light/dark and tablet light;
- desktop and phone first screens each expose one H1 and one Flow-content disclosure target before the next H2 enters view.

The repository-owned blind and preference-comparison cold-read prompts were generated for Reader Contract `flow`. This Agent had already read the preference evidence before implementation, so it does **not** self-certify an independent blind-review receipt. That human/independent-review criterion remains open for the pilot exit gate.

One local browser check for the archived `/en/**` training-design compatibility redirect cannot reproduce Vercel provider redirects through the repository static server. The active Chinese Flow route, dark/reduced-motion behavior and layout checks pass; the provider-owned archived-route redirect remains a release/provider concern and was not weakened or rewritten here.

## 13. SD-LoRA mechanism pilot — pre-write expression brief

Live refresh before the first source write: `main@d3631890f89c0fe62e249c088794b64a0b503f00`, PR #737 `ea36989be565cdb73757c6f7a050b3977861e5ed`, and overlapping PR #734 `b83be37d8e5f1969131ff07e14ae8335d44f90af`. #734 changes the acceleration/history explanation, not the canonical Vanilla mechanism owner, so this pilot may proceed while preserving Stable Reduction / Bounded Online Recurrence as separate treatments.

**Page Expression Brief**

- Reader: first-time technical reader who knows neither the OpenEvo run codes nor the SD-LoRA implementation details.
- Page role: narrative mechanism page for the parameter-write path inside the broader OpenEvo flow.
- Starting state: “a rollout succeeded; why does that not automatically change the next model, and where does SD-LoRA act?”
- Target mental model: selected successful traces become training data; bounded replay joins from the side; SD-LoRA writes a candidate cumulative LoRA; a separate admission rule chooses the state used by the next round; the loop then returns to task attempts.
- Next action: understand ordinary LoRA versus SD-LoRA on a shared axis, then inspect the real one-round topology and its scientific boundaries.
- Primary path: task attempts → checked success → SD-LoRA parameter update → candidate LoRA → next-state decision → next round.
- Secondary depth: exact Q17 parameters, private implementation evidence, paper/protocol differences, and later acceleration/GDR studies.
- Semantic shape: causal loop with one replay side input and one post-training decision branch; the LoRA-vs-SD-LoRA section is a true aligned comparison.
- Density plan: first screen = why/when parameter write-back happens; mainline = comparison + one connected mechanism figure; audit/config/history remain later or disclosed.
- Acceptance: Reader Contract at 1280×633 and 390×844, desktop/mobile topology assertions, light/dark, reduced motion, no horizontal overflow, targeted copy tests, and a cold-read pass that can recover the full path without animation.

**FLOW-WITNESS**

- Main path: prior selected LoRA → 128 task attempts → earliest fully checked success per task → SD-LoRA update → candidate cumulative LoRA → selected next-round state.
- Side input: up to 64 replay examples join the SD-LoRA update; they are not current-round attempts.
- Branch: after candidate training, current DirectApply and historical local GDR-v1 are different admission rules; candidate training itself must not be visually merged with that decision.
- Return: the selected state enters the next round and returns to another 128 task attempts.
- Connector carrier: semantic figure + SVG paths on desktop; explicit stacked nodes + SVG side/branch/return connectors on narrow screens. Character arrows may decorate prose but do not own topology.
- Rendered acceptance: required edge identities, node ordering, branch/join, and return edge must exist in the DOM and remain visible in static/reduced-motion state on desktop and phone.

Copy guard from the task-time HPL retrieval: explain the mechanism as concrete subject → action → result; titles name the mechanism object rather than saying “how to read”; retain the factual Vanilla-vs-ordinary-LoRA distinction without making a defensive “不是……而是……” sentence the visual center. The paper-equivalence / rehearsal-free boundary stays adjacent to the SD-LoRA definition because removing it would change the scientific interpretation.

## 14. SD-LoRA mechanism pilot — implementation and validation

The second pilot deliberately uses a different composition from the Flow gateway. Its reader task is causal understanding, so the page now separates three shapes instead of repeating one card grammar:

- the first viewport directly states the parameter-write job: `SD-LoRA 把成功经验写进下一轮模型参数`;
- a compact definition list keeps **input / timing / action / output** adjacent to that claim, with the candidate-training-versus-next-round-adoption boundary visible in the same layer;
- ordinary LoRA versus SD-LoRA is a real shared-axis table rather than two independent prose cards;
- the existing one-round mechanism figure remains the topology owner, with explicit main path, replay side input, DirectApply / historical GDR-v1 branch, join and return edge; decorative shadow/meta explanation was removed without removing topology.

The mobile baseline had pushed the real mechanism canvas to roughly 2429 px because a five-step card wall and a long comparison stack came first. In the revised composition the mechanism canvas begins around 1604 px on the same 390×844 viewport, while the first viewport remains focused on the write-back role and scientific boundary. Desktop mechanism arrival moves from roughly 1402 px to 1242 px. These distances are review evidence, not standing design targets.

Validation on the candidate worktree:

- task-time `feedback:retrieve` executed for Reader Contract `flow-sd-lora` before the material rewrite;
- `npm run check`: **575 files, 0 errors, 0 warnings** (2 existing deprecation hints);
- targeted mechanism / plain-language / Reader Contract / visual-language Vitest: **21 / 21 PASS**;
- SD-LoRA Chromium mechanism suite: **15 / 15 PASS** across first-screen focus, desktop/mobile topology, reduced motion, phone/tablet/desktop light+dark, overflow and reusable 16:9 canvas containment;
- full site Reader Contract Chromium suite: **5 / 5 PASS** after the rewrite;
- `npm run build`: **262 pages PASS**, heading audit **262 / 262 PASS**, external-brand-link audit PASS;
- `npm run audit:human-feedback`: PASS;
- `git diff --check`: PASS.

As with the Flow pilot, this Agent had already read the preference evidence before rendering the candidate, so no independent blind-review receipt is self-certified. That pilot exit criterion remains open.

## 15. Small reusable composition vocabulary after two pilots

Two semantically different pilots now support a small vocabulary without creating a universal template or component factory:

1. **Fact frame (`dl`)** — use when several short fields belong to one object/state and must stay adjacent to the primary claim.
2. **Shared-axis comparison (`table`)** — use when the reader must compare the same dimensions across methods/objects; do not force memory-based card-to-card reading.
3. **Connected mechanism (`figure` / ordered topology)** — use when sequence, side input, branch, join or return is part of the meaning; static topology must survive without animation.
4. **Editorial explanation** — ordinary prose remains prose unless choice, operation, comparison, status isolation or topology gives a container a semantic job.

This closes the Phase-B “define the smallest reusable composition primitives” item. It does **not** authorize a generic `Card`, `Hero`, or `AppleSection` factory. Shared tokens/components remain pending until another pilot demonstrates a repeated semantic need that local HTML/CSS cannot express cleanly.
