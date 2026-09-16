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

## 9. Flow gateway pilot — expression brief

Refresh for this acceptance pass: `main@d3631890f89c0fe62e249c088794b64a0b503f00`; PR #737 exact remote head `cc9d803888967dcea4b9079d7031896e9d3e64e8`. Current overlapping owners remain separate: #728 owns the Q17 W&B mirror component, #729 owns the Effective-State successor/navigation delta, and #734 owns the SD-LoRA acceleration/history explanation. None owns the Flow gateway source.

**Page Expression Brief**

- Reader: a first-time technical reader who needs the overall OpenEvo / SEED / environment mental model before opening experiment detail.
- Page role: choice/gateway; it should orient and route, not imitate a marketing landing page or summarize every downstream result.
- Starting state: “what is being compared here, on which tasks, and where should I go next?”
- Target mental model: one experiment frame contains model, learning methods, task environments, matched conditions and scientific record; the deeper objects then separate into model / learning method / task-environment groups.
- Next action: follow the connected experiment path or open one named research object; secondary evidence stays below the first comprehension layer.
- Primary path: experiment identity → matched facts → grouped research objects → ordered experiment path → evidence ledger.
- Secondary depth: implementation detail, historical evidence, exact reproduction and downstream result pages.
- Semantic shape: choice gateway with one fact relationship, one grouped object map, one ordered path and one evidence ledger; these shapes must remain distinct instead of collapsing into equal cards.
- Density plan: first viewport owns the experiment identity and matched frame; the next H2 must not become a competing center on 1280×633 or 390×844.
- Acceptance: current `flow` Reader Contract, phone + desktop first-screen budgets, no page-level overflow, light/dark compatibility, keyboard-reachable disclosure, and exact preservation of the scientific-comparison boundary.

Apple first-party translation used in this pass: WWDC25’s design-system guidance says hierarchy should come from layout and grouping rather than unnecessary decoration, related content should stay together as layouts adapt, and controls/navigation should support content rather than steal focus. For this gateway that means preserving the same information relationships across widths without copying Apple materials, typography, glass, or marketing-hero styling.

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

This closes the Phase-B “define the smallest reusable composition primitives” item. It does **not** authorize a generic `Card`, `Hero`, or `AppleSection` factory. The fact-frame relationship is now promoted as one shared CSS primitive after both pilots proved the same semantic need. No new global token was added because existing `--line`, `--muted`, and `--ink` already express it; other comparison/topology forms remain local until reuse is independently proved.

## 16. Phase-B shared primitive proof — Flow + SD-LoRA

The second semantically different pilot proved one reusable content relationship without proving a universal page template: both the Flow gateway and SD-LoRA mechanism page need a compact semantic `dl` that keeps a small set of facts on a shared axis. The shared owner is now `src/styles/components/research-content-primitives.css`, using the single class `.research-fact-band`; each page still owns its own H1, copy, topology, comparison form, evidence and route-specific layout.

No new global visual token was added. Both pilots already express the needed treatment with canonical `--line`, `--muted`, and `--ink`; inventing a second spacing/color token set would add vocabulary without adding meaning. This closes the Phase-B token audit by deliberate reuse rather than token proliferation.

The primitive is protected by `src/lib/researchContentPrimitives.test.ts`, which verifies canonical import order, semantic `dl` adoption in both pilot families, different column counts (5 vs 4), and the absence of generic card/hero/background/shadow behavior. Local duplicate fact-band CSS was removed from both pilot components.

Validation after promotion:

- targeted Vitest: **26 / 26 PASS**;
- `npm run check`: **576 files, 0 errors, 0 warnings** (2 existing deprecation hints);
- combined Flow + SD-LoRA Chromium suite: **20 / 20 PASS** after a real first-screen regression was caught and repaired;
- the regression was caused by making mobile fact rows too compact, which let a second H2 enter the phone first screen; the shared primitive now preserves the meaningful row height instead of loosening the Reader Contract;
- phone/desktop first-screen budgets, light/dark, reduced motion, topology, and page-level horizontal overflow gates all remain green.

Apple-guidance translation remains behavioral rather than cosmetic: “simplicity” means exactly enough context, hierarchy keeps the primary object obvious, and shared UI should support content rather than compete with it. The result is one narrow relationship primitive, not an Apple-looking card system.

## 14. Server operations pilot — pre-write expression brief

Refresh before source write: `main@d3631890f89c0fe62e249c088794b64a0b503f00`; PR #737 `cbb8bc19d6b27dd0db851eef85bd05ecf76d599e`; open semantic owners #728 / #729 / #734 remain independent of the server route. Current route owner is `Lyg2171ServerOverview.astro` + `flow-server` Reader Contract; `visual-closeout.css` still injects the legacy full-height server hero.

Repeated-correction witness: `Apple reference / first-screen redesign -> current owners = ui-design-principles + human-thinking-web-expression-contract + site-reader-attention-contract -> checked artifact = current server render, flow-server contract, current shared primitives, Apple WWDC26 Principles of great design + WWDC25 design-system structure -> allowed next action = make static server state + safety boundary + one default operation the first cognitive owner and retire only the route-specific full-height override -> invalidation cue = main/PR head drift, server authority/data change, or browser evidence that the operational path became less discoverable`.

**Page Expression Brief**

- Reader: project operator who needs to know whether the shared research server is under pressure and what the safe next action is.
- Page role: operational reference / entry point, not a live monitoring dashboard.
- Starting state: “Do I need to act now, and what can I safely run?”
- Target mental model: this is a dated snapshot; space is not currently presented as an emergency; large experiment assets need lifecycle management; remote recoverability never grants deletion authority.
- Next action: use the single routine-maintenance entry by default; choose health scan / closeout / reclaim only when deliberately doing one stage.
- Primary path: snapshot state -> deletion/authority boundary -> default routine-maintenance action -> optional single-stage operations.
- Secondary depth: filesystem breakdown, lifecycle mechanics, Q17 example, exact prompts, hardware, privacy/history.
- Semantic shape: status + safety boundary + one operation; later stages remain ordered/operational structures.
- Density plan: first screen contains one state statement, a compact fact band, the safety boundary, and one default operation disclosure; the three single-stage links move below the first-layer owner.
- Acceptance: no `100svh`/full-height spacer for this route; 1280×633 and 390×844 show one H1 and the declared status owner; no horizontal overflow; default operation remains keyboard reachable; light/dark browser checks stay green.

Apple reasoning applied: WWDC26 defines simplicity as “exactly enough” and hierarchy as order/spacing/contrast around the most important item; WWDC25 treats interface structure as subordinate to content. For this route that means emphasizing the operational state and action, not reproducing Apple surface styling.

## 15. Server operations pilot — implementation and automated acceptance

The operational pilot now uses a dated state as the first visual owner: `服务器快照：约 0.99 TiB 可用`. The first layer keeps the Q17 size example and `NOT_AUTHORIZED` deletion state in one semantic fact band, keeps the static-snapshot / remote-recovery boundary visible, and leaves one justified operation (`例行服务器维护`) as the default action. The three single-stage links now follow the hero instead of competing inside it.

The route-specific legacy `100svh` server-hero rule was removed from `visual-closeout.css`; the independent Lab rule remains unchanged. The server route now owns its natural content height. Browser geometry measured `min-height: 0px`, hero height ≈505px at 1280×633 and ≈703px at 390×844; the routine-maintenance summary remains visible in both, while the optional three-stage switchboard begins below the first viewport. Page-level horizontal overflow is 0 in both captures.

Validation on the task-owned worktree:

- `npm run check`: 578 files, 0 errors (2 existing deprecation hints);
- targeted structural/copy/Reader Contract Vitest: 17 / 17 PASS;
- `server-content-first.spec.ts` + full `site-reader-contracts.spec.ts`: 10 / 10 Chromium PASS, including desktop, phone, keyboard-open disclosure, light/dark and overflow assertions;
- `npm run audit:human-feedback`: PASS;
- `npm run build`: 262 pages PASS; static-heading 262 / 262 and external-brand-link audit PASS;
- post-write HPL comparison prompt generated for `flow-server`; this Agent had already seen preference evidence, so it does not claim an independent blind-human comprehension receipt.

No Phase-C generic checkbox is closed from this pilot alone: those rows apply to the complete four-pilot exit. The remaining focus/comparison pilot still depends on reconciling #728, and independent owner/cold-read review remains a separate acceptance layer.

## 15. Focus/comparison pilot — Q17 R127/R128 same-task diagnostic

Live refresh before source write: `main@d3631890f89c0fe62e249c088794b64a0b503f00`, PR #737 `0946e42f403aabfcf1aa7da10e8bfdd6f434acdd`. PR #728 owns `OpenEvoQ17DirectApplyAnalysis.astro` and its W&B publication delta, so the fourth pilot uses the independent active focus owner `/q17-directapply-frontier/` (`OpenEvoQ17AdvisorDiagnostics`) instead of competing for that file.

**Page Expression Brief**

- Reader: a technical reader who has seen the volatile training curve but does not yet know whether R128 actually lost comparable capability.
- Page role: focused diagnostic result page; it explains one local R127→R128 comparison, not the whole 160-round DirectApply outcome.
- Starting state: “training score fell 76.1 → 48.9; did the model really lose that much?”
- Target mental model: the original two rounds used different task samples; on the same frozen 32 tasks the gap is much smaller, and uncertainty still includes no difference.
- Next action: inspect the aligned same-task measurements, then read the mechanism clues or the completed DirectApply final on its separate owner.
- Primary path: apparent live-round drop → same-task comparison → inference → claim boundary.
- Secondary depth: per-metric uncertainty, task transition counts, action-format/entropy clues, exact method, replication and provenance.
- Semantic shape: focus result plus aligned comparison; use ordinary editorial hierarchy, a compact fact band, and a real table rather than summary cards.
- Density plan: first screen owns the same-task result and its scientific limit; provenance links move after the primary result instead of competing with the conclusion.
- Acceptance: 1280×633 and 390×844 first-screen budget, table/shared-axis readability, light/dark, keyboard/focus, no page overflow, current Reader Contract, and targeted diagnostics tests.

Apple first-party guidance is translated here as content priority rather than surface imitation: controls recede behind the result, logically related facts stay grouped, and layout adapts without changing the scientific hierarchy. No Apple typography, glass, marketing hero, or universal card pattern is introduced.

## 16. Q17 focus/comparison pilot — implementation and automated acceptance

The fourth pilot now has a real content-first implementation on the independent `q17-directapply-frontier` owner, with no overlap against PR #728's Q17 W&B files.

- The first conclusion is now the comparable observation: **同题重测只差 4.18 分，远小于训练曲线的掉分**.
- The first layer aligns `76.1 → 48.9` (different live-round task samples), `63.58 → 59.41` (same 32 tasks), and `10/32 → 8/32` (fully solved) in the existing `research-fact-band` semantic primitive.
- The `95%` uncertainty boundary remains in the visible lede and still includes no difference; the page does not upgrade this local diagnostic to global forgetting.
- Provenance links moved below the aligned result instead of competing with the first conclusion.
- The full comparison table, task transitions, interface/entropy clues, final-panel boundary, method details and independent GPU replication remain available in their original scientific roles.

Exact local acceptance on the isolated result-pilot worktree:

- focused semantic / primitive / Reader Contract Vitest: **17 / 17 PASS**;
- `npm run check`: **579 files, 0 errors** (2 existing deprecation hints);
- focused Q17 + full Reader Contract Chromium: **10 / 10 PASS**;
- `npm run audit:human-feedback`: **PASS**;
- static build: **262 pages PASS**; heading audit **262 / 262 PASS**; external-brand-link audit **PASS**;
- desktop `1280×633` keeps the lede and three aligned facts in the first viewport; phone `390×844` keeps the result + caveat visible without page overflow; light/dark and keyboard focus checks pass.

A repository-owned zero-context cold-read prompt was generated for `capability-q17-frontier`, but this Agent had already read the preference evidence. It therefore does **not** mark the independent cold-read checkbox complete. The four pilots now have implementation + automated evidence; Phase C remains open until an independent phone/desktop cold read (and review Preview when required) satisfies the human exit gate.

## 17. Phase-D consolidation — shared ownership without a universal template

Before this write, current state was refreshed at `main@d3631890f89c0fe62e249c088794b64a0b503f00` and PR #737 `f9324a6f47ba89fd92ae95aec2f0111861d19daf`. Open semantic owners remained separate: #728 owns the Q17 W&B mirror files, #734 owns the SD-LoRA acceleration/history explanation, and #729 owns the Effective-State successor plus its navigation/Reader-Contract files. This consolidation changes none of those paths.

Task-time HPL retrieval again made the governing rule explicit: scientific caveats stay adjacent to the claim they constrain; first-screen hierarchy comes from content grouping rather than decorative surfaces; progressive disclosure may move recoverable detail, not meaning-changing boundaries.

**REPEAT-CORRECTION witness:** content-first pilot surface is being re-touched → current owners are the pilot component plus `research-content-primitives.css` / current Reader Contracts → checked artifacts were all four pilot sources, legacy CSS selectors, current open-PR file ownership, and phone/desktop rendered geometry → allowed next action was narrow ownership consolidation only → any main/PR-head drift, new overlapping owner, or browser/Reader-Contract regression invalidates this receipt.

The resulting implementation is deliberately small:

- `.research-fact-band` is now explicitly protected as a four-pilot relationship primitive: Flow gateway, SD-LoRA mechanism, Q17 comparison and server operations all use the same semantic `dl` grammar without inheriting a shared Hero/Card shell.
- The legacy mobile decorative enclosure now applies only to `mission-hero:not(.mission-hero--compact)`. The Flow gateway no longer receives the old gradient/border/shadow and then cancels them through a route-specific override; the compact component owns its own surface directly.
- The non-compact mission hero keeps its historical mobile enclosure unchanged. This is a targeted ownership cleanup, not a sitewide restyle.
- All four migrated pilot owners and their route shells remain static Astro content: no `client:load`, `client:idle`, `client:visible`, `client:media` or `client:only` hydration was introduced.
- A dedicated consolidation regression now protects static-first behavior and prevents the removed Flow/server compatibility overrides from returning.

Rendered validation after the selector cleanup:

- compact Flow hero at 390×844 and 1280×633, light and dark: `border=0`, `background-image=none`, `box-shadow=none`, page overflow `0`;
- non-compact home mission hero at 390×844 still retains its intended `1px` border, gradient and shadow, with page overflow `0`;
- four pilot routes on desktop + phone each have exactly one active research-nav owner; nav text stays materially quieter than the page H1 (12px versus 56–70px desktop; about 11px versus 34–38px phone); page overflow remains `0`;
- targeted consolidation / primitive / journey / copy / Reader-Contract Vitest: **28 / 28 PASS**;
- `npm run check`: **580 files, 0 errors** (2 existing deprecation hints);
- static build: **262 pages PASS**; heading audit **262 / 262 PASS**; external-brand-link audit **PASS**;
- human-feedback audit: **PASS**;
- `git diff --check`: **PASS**.

This closes Phase D at **15 / 15 points**. Phase C remains open because the same Agent cannot self-certify an independent phone/desktop cold read after reading the preference evidence. Phase E broad route-family migration therefore remains blocked; the next safe work should stay within non-human-gated preparation/acceptance or wait for an independent cold-read receipt rather than pretending the pilot exit is complete.

## 18. Phase-C prerequisite closeout — four pilot contracts, independent review still open

This pass closed the remaining documentation/contract prerequisite without claiming the human exit. The Flow gateway now has the same explicit Page Expression Brief shape already recorded for SD-LoRA, Server, and Q17; all four exact route owners are protected as four distinct Reader Contract modes (`choice`, `narrative`, `operational`, `focus`) rather than one visual template.

A new executable Reader Contract regression asserts the exact route, mode, first-viewport selector, and resolver identity for all four pilot owners. That protects the semantic reason the pilots look different and makes a future “universal Hero/Card” normalization fail visibly.

Acceptance on this candidate tree:

- focused pilot/primitive/Reader Contract Vitest: **22 / 22 PASS**;
- `npm run check`: **580 files, 0 errors** (2 pre-existing deprecation hints);
- combined Server + site Reader Contract + SD-LoRA Chromium: **25 / 25 PASS**, including 1280×633, 390×844, light/dark, reduced motion, keyboard disclosure, topology and page-level overflow checks;
- repository-owned Phase-A blind and Phase-B compare prompts were freshly generated for `flow`, `flow-sd-lora`, `flow-server`, and `capability-q17-frontier`.

The prompt generation is preparation, not independent review. This Agent has already seen the preference evidence, so the phone + desktop cold-read row remains open and Phase C still contributes **0 / 20** weighted points. Broad Phase-E migration therefore remains blocked by the existing pilot exit rule.

## 19. Phase-C review Preview — exact four-pilot product head inspected

Live refresh before this acceptance pass: `main@d3631890f89c0fe62e249c088794b64a0b503f00`; PR #737 exact product head `949c7eb1d990f0c94a6cf10e4bfabffd4097a4ea`. Open semantic owners #728 / #729 / #734 remain separate from the four pilot surfaces and were not modified.

Apple first-party guidance was re-read before this review pass. WWDC26 defines simplicity as removing unnecessary friction while keeping exactly enough context, and says clear hierarchy uses order, spacing, and contrast to make the most important item obvious. WWDC25's design-foundations session likewise treats structure, navigation, content grouping, progressive disclosure, and adaptivity as one system rather than a surface-style recipe. The review therefore checks whether each pilot's content owner is still obvious, not whether it looks cosmetically Apple-like.

A fresh noindex static build of the exact product head completed with 262 pages, single-H1 audit 262 / 262 PASS, and external-brand-link audit PASS. The canonical GitHub Fast Review workflow had already proven the immutable build stage on this exact head, but its deploy job could not authenticate to the dedicated review project; no credential or repository secret was created or changed in this task. An equivalent review-only Preview was therefore deployed from the same fresh static output using the already-authorized local Vercel CLI session, without touching Production or `ci/vercel-gate-final`.

Hosted target-specific inspection then confirmed all four pilot owners on the review deployment:

- Flow gateway visibly contains `SEED 与 OpenEvo：ALFWorld / WebShop 实验`;
- SD-LoRA visibly contains `SD-LoRA 把成功经验写进下一轮模型参数`;
- Server visibly contains `服务器快照：约 0.99 TiB 可用`;
- Q17 focus/comparison visibly contains `R127 与 R128 平均分只差 4.18 分`;
- all four hosted pages preserve `robots=noindex,follow` on the review surface.

The Preview is explicitly review-only and is not merge, Vercel-final-gate, Production, scientific-authority, or human-comprehension evidence. The required phone + desktop **human** cold-read remains open, so Phase C still contributes 0 / 20 weighted points and Phase E broad migration remains blocked.

## 20. Phase-C human exit — fail-closed receipt gate

Before this write, live control state was refreshed again: `main` remained `d3631890f89c0fe62e249c088794b64a0b503f00`; PR #737 remained Draft and mergeable; #728 still owned the Q17 W&B mirror, #729 the Effective-State GDR publication, and #734 the acceleration/history explanation. None of those scientific owners are changed here.

Apple's current first-party guidance was re-read as a structure rule, not a styling recipe: WWDC25 explicitly says hierarchy should be expressed through layout and grouping rather than extra decoration, secondary actions should move out of crowded primary control groups, and intentionally grouped content should stay together as layouts adapt across device sizes. This pass applies the same principle to review evidence: the human judgment stays attached to the exact pilot, device class and product head it evaluated.

The open Phase-C cold-read row now has an executable task-scoped verifier:

- four exact pilot Reader Contracts are frozen in one mapping (`flow`, `flow-sd-lora`, `flow-server`, `capability-q17-frontier`);
- each pilot requires a separate desktop and phone receipt, for eight receipts total;
- every receipt must already PASS the canonical `HumanPreferenceJudgeReceipt` validator;
- the reviewer must be a real human for this program exit; an `independent-agent` receipt remains useful preparation but cannot close Phase C;
- every receipt must bind the same exact product Git SHA and the correct pilot Reader Contract;
- missing, duplicated, stale-head, wrong-contract, non-human or FAIL evidence fails closed.

Focused validator tests pass **23 / 23**, `npm run check` reports **583 files, 0 errors** with the same two existing Zod deprecation hints, and an intentionally empty receipt directory correctly exits non-zero. No human receipt was fabricated, so the Phase-C checkbox remains open and the weighted total remains **35 / 100**.
