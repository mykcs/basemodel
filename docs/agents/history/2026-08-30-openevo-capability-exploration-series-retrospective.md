# OpenEvo 基础能力探索实验：结果发布、可视化与导航收尾复盘 — 2026-08-30

Status: **historical case / reusable Agent friction record, not current authority**
Conversation scope: the end-to-end website work that became the **OpenEvo 基础能力探索实验** series.
Primary current owners: `../current/experiment-result-publication-workflow.md`, `../current/scientific-state-provenance.md`, `../current/seed-openevo-results-reader-contract.md`, `../current/deployment-policy.md`, and `../current/release-closeout-protocol.md`.

This record extends [`2026-08-29-four-arm-result-scaffold-and-7b-self-checkpoint-publication-retrospective.md`](2026-08-29-four-arm-result-scaffold-and-7b-self-checkpoint-publication-retrospective.md). The earlier file owns the detailed Pending-scaffold and 7B/self checkpoint-fill chronology. This file closes the **whole conversation arc** by adding the later HTML/SVG visualization, experiment-selector, series naming, navigation, and release lessons.

If this file disagrees with current policy, executable repository truth, live `mykcs/openevo-experiment` state, or current provider state, this file loses.

## Executive summary

The work started with a simple request: several 3B/7B × self/MiniMax experiments were running or incomplete, but the website should already have stable result pages and explicit empty slots instead of waiting until every number existed.

The final product became a named research series:

**OpenEvo 基础能力探索实验**

with four single-arm pages plus one cross-arm analysis page, a shared experiment-design selector, a 2×2 factor matrix, and an inline HTML/SVG checkpoint chart for 7B/self.
## Conversation arc: what actually shipped

The work landed in four main publication steps:

1. **PR #326 — pre-build the result structure.** The website gained the four single-arm result routes plus a joint four-arm analysis route. Unfinished measurements were explicitly `Pending`; existing deeper analysis pages were preserved rather than replaced.
2. **PR #328 — fill the completed 7B/self diagnostic.** The server-side checkpoint sweep was confirmed complete from machine-readable evidence, and the 7B/self page, result index, four-arm matrix, and deeper analysis text were updated together.
3. **PR #332 — make the experiment legible as a system, not a list of links.** The old pill/button navigation became a real experiment-design selector, and the 7B/self loss/capability relationship became a native HTML/SVG chart instead of prose-only reporting.
4. **PR #333 — give the work a stable public identity.** The series was named **OpenEvo 基础能力探索实验**, a bilingual landing page was added, the study subnavigation gained a first-class entry, and all five deep pages were classified as children of the same series while keeping their existing URLs stable.

Production commits for the last two steps were `4b124109` and `e02b474f`. These SHAs are historical release markers, not instructions to treat those snapshots as current scientific truth.

The final study navigation became:

```text
实验流程
→ 训练设计
→ 运行实验
→ OpenEvo 基础能力探索实验
→ 研究结果
```

The landing route is `/research/seed-openevo/study/capability-exploration/`, with a bilingual English counterpart.
## The scientific facts that forced better presentation

At this historical point, 7B/self was the only arm whose main result and post-hoc checkpoint diagnostic had both closed. The publication-relevant facts were:

- Stage 1 produced **8 parameter updates**;
- training loss across the eight updates fell from **0.479 to 0.055**;
- Stage 2 wrote **20,480 rollouts** and **797 qualified-positive trajectories**;
- Stage 2 still produced **0 parameter updates** across **80/80 blocks**;
- the strongest per-block qualifying-identity count was **7**, while the admission gate required **8**;
- the 128-task Task Score moved from **13.33 to 25.66**;
- valid episodes moved from **109/128 to 122/128**;
- parser/action failures moved from **19 to 6**;
- exact success moved only from **3/128 to 4/128**.

The complete checkpoint Task Score curve was:

```text
base     13.33
inc-00   17.13
inc-01   18.41
inc-02   13.67
inc-03   17.63
inc-04   16.51
inc-05   22.01
inc-06   20.72
inc-07   25.66
```

The key scientific communication problem was therefore not “how do we show that training worked?” It was “how do we show that several different signals changed in different ways?”
## Scientific reasoning lessons

### 1. Rollouts are not optimizer updates

The phrase “Stage 2 ran 20,480 rollouts” can sound like massive training if the reader is not told what a rollout is. In this run, the correct causal chain was:

```text
20,480 environment rollouts
→ 797 qualified-positive trajectories
→ per-block identity coverage never reached gate=8
→ 80/80 blocks admitted no update
→ Stage-2 optimizer updates = 0
```

A future Agent must never collapse environment interaction count, selected trajectories, admission events, and parameter updates into one word such as “training”.

### 2. Loss is not a monotonic capability meter

The completed sweep showed two concrete counterexamples:

```text
loss 0.301 → 0.196 ↓
Task Score 18.41 → 13.67 ↓  (-4.74)

loss 0.070 → 0.066 ↓
Task Score 22.01 → 20.72 ↓  (-1.29)
```

The final checkpoint was still the strongest at 25.66. The correct conclusion is therefore **not** “training did nothing” and **not** “every update made the model better”. It is: later training was useful overall, but held-out WebShop capability was non-monotonic and training loss was not a reliable monotonic capability proxy.
### 3. Task Score, exact success, and action validity answer different questions

Task Score roughly doubled, but exact success changed only by one task. At the same time, valid episodes improved and parser/action failures dropped sharply.

That supports a layered interpretation:

```text
format / action executability improved materially
+ partial task progress improved
+ exact completion improved only slightly
```

Do not translate “Task Score doubled” into “the model became twice as good at fully solving WebShop”. Always report Task Score, exact success, and action-validity evidence separately when they move differently.

### 4. “MiniMax teacher” is useful shorthand but scientifically incomplete

The public selector may use “外部教师” as a reader-facing category, but the mechanism must remain explicit: MiniMax is a **post-episode hindsight analyzer**. It does not replace the actor during WebShop clicking/searching.

The four-arm comparison therefore estimates a treatment-bundle difference, not a pure “teacher identity” causal effect. Without an analyzer-matched control, do not promote the contrast into a cleaner causal claim than the design supports.

### 5. A post-hoc diagnostic can contaminate a selection panel

The checkpoint sweep reused the same 128-task panel to inspect intermediate checkpoints. That is acceptable for a post-hoc diagnostic, but once the intermediate curve has been viewed, that panel is no longer fully unseen for future checkpoint selection.

If later work wants to choose a checkpoint or tune a continuation rule, use an independent diagnostic panel or freeze the selection rule before seeing the formal panel.
## Reader-model and information-architecture lessons

### 1. A list of five links hid the experiment design

The first version exposed five destinations: four single-arm pages and one joint page. That was navigable, but it did not explain **why those five pages exist**.

The better mental model is two binary choices inside one OpenEvo research wrapper:

```text
Actor model size: 3B | 7B
×
external hindsight: none/self | MiniMax
=
4 single-arm experiments
```

The joint page is then a comparison over those four cells, **not a fifth experimental arm**.

### 2. The 2×2 matrix is both navigation and experimental explanation

Rows encode model scale; columns encode hindsight treatment. A reader can see the whole design in one glance and open any cell. This is superior to inventing a separate icon for “joint analysis” because the matrix itself reveals the factorization.

### 3. Stable series naming matters once several related result pages exist

The pages initially looked like isolated result routes. Naming the group **OpenEvo 基础能力探索实验** created a durable parent concept and allowed the study navigation to distinguish this research series from generic “研究结果”.

The parent name should describe the scientific question, not one temporary implementation detail. Here the question is how OpenEvo behaves when wrapped around different base model scales and different bootstrap/hindsight conditions.

### 4. Preserve deep URLs when the conceptual hierarchy changes

The five existing result URLs were already useful and possibly externally referenced. The hierarchy was improved by adding a landing page and route classification rather than renaming every deep path. A conceptual reorganization does not automatically justify breaking stable URLs.
## Visualization lesson: use inspectable HTML/SVG when the data itself is the argument

A major user correction in this conversation was: **do not generate a picture in the chat; build the chart into the website with HTML/SVG.**

That correction exposed a useful general rule. If the scientific point depends on exact source-backed values, a native web chart has several advantages over a generated static image:

- values remain inspectable in source and DOM;
- labels can stay tied to exact checkpoints;
- accessibility text can explain the chart;
- responsive behavior can be tested directly;
- the underlying table can remain adjacent as an exact-value fallback;
- future result fill-in can update data without recreating an asset pipeline.

For the 7B/self chart, the design used one shared checkpoint x-axis with two vertically separated panels:

```text
upper panel: training loss, lower is better
lower panel: WebShop Task Score, higher is better
```

The two capability regressions were highlighted directly, while the final checkpoint was visually marked as the best point. This preserved the actual scientific claim: **loss kept falling, capability sometimes fell too, and the final checkpoint was still best**.

Do not force two metrics with incompatible units onto one unlabeled y-axis merely to make the lines cross. Separate panels with a shared x-axis make the relationship legible without implying common scale.

The chart also kept the full checkpoint table below it. Visual summary and exact audit trail are complementary, not substitutes.
## Engineering friction and recovery patterns

### Friction A — `Pending` was at risk of becoming fake certainty

The page needed to exist before three arms had final results. The correct recovery was to freeze the **question and slot**, not invent the answer.

Reusable rule: `Pending` is a first-class scientific state. It is not `0`, not “probably no update”, not an ETA, and not the latest training snapshot.

### Friction B — filling one completed arm can leave the website internally inconsistent

When 7B/self closed, the same fact existed in several derived surfaces: the detail page, result index, four-arm matrix, deep analysis plan, titles/metadata, and bilingual routes.

Reusable rule: after replacing one Pending state, search the repository for the old status wording and update every owner of the same fact in one coherent change. Leave unrelated arms untouched.

### Friction C — a green GitHub Vercel status did not prove a hosted build ran

During the earlier scaffold work, GitHub could show a successful Vercel check while Vercel itself reported the deployment as deliberately **CANCELED** by the repository's ignored-build logic.

A second attempt used an empty commit with the opt-in token, but the ignored-build script still skipped it because there was no deploy-relevant file diff.

Reusable rule: distinguish provider check status from actual build execution. If current policy requires an exact-head Preview, verify the provider deployment state and logs, not just a green commit status. A token on an empty/non-relevant commit may still be intentionally ignored.

Do not generalize the historical choice to skip some Preview builds in this conversation. Current `deployment-policy.md` and executable `vercel.json` / ignore-script behavior are authoritative.
### Friction D — a clean worktree can lack dependencies even when the main checkout is healthy

A local `verify:deploy` initially failed because the temporary worktree had no `node_modules`; Astro was not available there. That was a validation-environment problem, not evidence that the page code was broken.

The recovery was to reuse/install the locked local dependency tree, rerun the same repository checks, and remove temporary dependency plumbing before commit.

Reusable rule: classify “tool/package unavailable in this worktree” separately from “source failed validation”. Do not push to a hosted provider merely to diagnose a local dependency setup issue.

### Friction E — fixed chart indices triggered TypeScript safety correctly

The first chart implementation addressed known regression segments by fixed array positions. TypeScript refused to assume those elements always existed.

The correct fix was not a non-null assertion scattered through the template. The segments were derived safely before render so the chart code had explicit, validated data.

Reusable rule: when a scientific chart highlights specific intervals, precompute typed derived data and fail safely. Treat compile-time index warnings as data-contract feedback.

### Friction F — desktop success did not imply mobile safety

The wide SVG chart needed more horizontal space than a phone. The correct mobile behavior was **not** to let the entire page overflow. The chart container can scroll internally while the document body remains viewport-bounded.

Acceptance included a 390px viewport check: no body-level horizontal overflow, while the navigation/chart can use local overflow where designed.

Reusable rule: test document-level `scrollWidth` as well as component appearance for research pages with wide tables/charts.
### Friction G — GitHub `mergeable=false` immediately after PR creation was transient

Both publication changes briefly surfaced a non-mergeable state immediately after PR creation. Re-reading the PR after GitHub finished computing mergeability returned `true`; there was no real content conflict.

Reusable rule: do not force-merge or start rebasing from the first transient mergeability snapshot. Re-read the PR, inspect the base/head if needed, and distinguish “GitHub still computing” from an actual conflict.

### Friction H — shell dialect assumptions can break otherwise harmless automation

Desktop Commander defaulted to `fish` in one closeout step. A Bash-style assignment such as `WT=/tmp/...` failed before any repository mutation occurred.

Reusable rule: when a command relies on Bash syntax (`VAR=value`, `set -euo pipefail`, compound loops, heredocs), explicitly request `/bin/bash` rather than assuming the remote/default shell.

### Friction I — the first experiment selector was visually useful but still placed too low

The user wanted the experiment selector to be the first thing a reader sees on the result page. After initial implementation it still sat after page framing, so it was moved ahead of the result-page title.

Reusable rule: if a visual is meant to establish the reader's mental model for everything below, placement is part of semantics. Do not bury a navigation/explanation model under the content it is supposed to explain.

### Friction J — naming a series is not the same as renaming every route

The scientific grouping became clear only after the four-arm selector existed. The correct architecture was to add a stable parent landing page and navigation identity, then annotate child titles/eyebrows while preserving deep URLs.

Reusable rule: prefer additive hierarchy over destructive route churn when the existing deep routes are already useful and semantically correct.
## What worked well

### Pre-building the “answer sheet” reduced later scientific drift

Creating result slots before all arms closed meant the website already knew what evidence it wanted: final Task Score, exact success, validity, Stage-2 update count, checkpoint curve, and mechanism interpretation.

This reduced the temptation to choose whichever metric looked best after the experiments finished. The four-arm comparison questions were also fixed before all final values were visible.

### The selector preserved the orthogonal choice while navigating

On a single-arm page, changing 7B → 3B keeps the current treatment; changing self → MiniMax keeps the current model scale. That makes the control structure operational rather than decorative.

### The joint page remained explicitly a comparison layer

The 2×2 matrix plus separate “四组联合分析” action made it clear that joint analysis consumes the four arms; it is not another experiment cell.

### Deep analysis was preserved beneath the concise scaffold

The website already had detailed A1–A7 / B1–B8 analysis content. The new summary scaffold solved a different reader problem: current status, result slots, and fast interpretation. Keeping both prevented a redesign from deleting useful research depth.

### Production was accepted independently of local success

After merge, the release was not considered done merely because tests had passed. Vercel Production was checked for the exact merged SHA, terminal `READY`, public HTTP `200`, and expected rendered content on the new landing/deep routes.

This is the correct separation:

```text
local/source validation != Production acceptance
```
## Reusable workflow for the next Agent

When one of the remaining capability-exploration arms or diagnostics closes, use this sequence:

1. **Refresh authority.** Read current publication/provenance policy and the exact upstream experiment branch/SHA; do not infer completion from this retrospective.
2. **Verify completion mechanically.** Resolve completion marker, machine-readable status, expected task/checkpoint cardinality, model identity, panel/protocol identity, and claim boundary.
3. **Classify the evidence.** Separate run completion, optimizer-update count, final evaluation, post-hoc diagnostic, and cross-arm comparison completion.
4. **Update only closed facts.** Replace the relevant `Pending` cells; keep unrelated arms Pending.
5. **Synchronize derived surfaces.** Search detail pages, landing/index, four-arm matrix, deep analysis, tests, bilingual titles/metadata, and navigation labels.
6. **Choose the right visual.** If the scientific argument depends on a trend/contrast, prefer a source-backed HTML/SVG/table visualization over a decorative image.
7. **Preserve claim boundaries.** Keep Task Score, exact success, validity, update count, and treatment semantics distinct.
8. **Run repository validation locally.** Classify dependency/worktree failures separately from source failures.
9. **Run the current release process.** Follow current Preview/CI/deployment policy rather than copying the historical exceptions from this case.
10. **Accept Production.** Verify merged SHA, terminal provider state, public status code, expected content, and absence/presence of Pending exactly where intended.

For the series itself, preserve this conceptual model unless the experiment design changes upstream:

```text
OpenEvo wrapper
  × actor scale {3B, 7B}
  × external hindsight {self/none, MiniMax}
  = four arms

four-arm analysis = comparison over those arms
```

If new factors are added, revisit the information architecture instead of silently stretching a 2×2 selector into something it no longer represents.
## Anti-patterns to avoid

Do not repeat these mistakes:

- wait until every experiment finishes before designing the result structure;
- fill unfinished values with `0`, estimates, ETAs, or training-in-progress snapshots;
- describe 20,480 rollouts as 20,480 training updates;
- treat monotonic loss as proof of monotonic task capability;
- treat Task Score growth as equivalent to exact-success growth;
- call MiniMax the acting WebShop model when it only analyzes sealed episodes afterward;
- show four arms plus joint analysis as five equivalent experiments;
- use a decorative/generated image where exact source-backed HTML/SVG data is the argument;
- hide the exact table after adding a chart;
- let a wide chart create document-level mobile overflow;
- update one result page while the joint matrix/index/deep analysis remains stale;
- destroy stable deep URLs merely to introduce a better parent hierarchy;
- diagnose missing local dependencies by spending a hosted build first;
- interpret a provider status check as proof that the provider actually executed the intended build;
- assume `fish`, Bash, or another shell dialect without checking when syntax matters;
- force-merge based on a transient PR mergeability snapshot;
- reuse a post-hoc-inspected formal panel as an untouched model-selection panel;
- infer current state from the word “current” in a dated document.

## Historical state boundary

At the end of this conversation, 7B/self had a completed main result and checkpoint sweep, while other arms still contained Pending fields. That statement is intentionally historical.

A future Agent must re-read `mykcs/openevo-experiment` and the live BaseModel source before saying which arms are now complete. Do not use this retrospective as a live experiment dashboard.
## Related repository owners and historical cases

Read these current owners first for future work:

- `../current/experiment-result-publication-workflow.md` — result intake, Pending semantics, full-curve publication, synchronized fill-in;
- `../current/scientific-state-provenance.md` — upstream scientific authority and freshness;
- `../current/seed-openevo-results-reader-contract.md` — reader hierarchy and claim boundaries;
- `../current/research-explainer-page-standard.md` — explanatory page structure;
- `../current/ui-change-visual-acceptance-gate.md` — visual/responsive acceptance;
- `../current/deployment-policy.md` — current Preview/Production behavior;
- `../current/release-closeout-protocol.md` — current merge and Production acceptance.

Historical cases that complement this one:

- [`2026-08-29-four-arm-result-scaffold-and-7b-self-checkpoint-publication-retrospective.md`](2026-08-29-four-arm-result-scaffold-and-7b-self-checkpoint-publication-retrospective.md) — detailed Pending scaffold and checkpoint fill-in;
- [`2026-08-28-webshop-training-design-and-analyzer-architecture-retrospective.md`](2026-08-28-webshop-training-design-and-analyzer-architecture-retrospective.md) — self/MiniMax treatment architecture and analyzer-role reasoning;
- [`2026-08-27-contextual-research-navigation-retrospective.md`](2026-08-27-contextual-research-navigation-retrospective.md) — contextual navigation and shared-route hierarchy;
- [`2026-08-28-results-provenance-publication-and-release-closeout-retrospective.md`](2026-08-28-results-provenance-publication-and-release-closeout-retrospective.md) — result provenance and exact-head/Production closeout;
- [`2026-08-28-pr-closeout-vercel-cost-and-light-theme-retrospective.md`](2026-08-28-pr-closeout-vercel-cost-and-light-theme-retrospective.md) — Vercel cost/closeout lessons.

The main durable insight from this conversation is simple: **design the scientific questions and reader model before all answers exist; when evidence arrives, fill only what closed; when the relationship itself matters, make it inspectable in the page rather than hiding it in prose or a decorative image.**
