# Research explainer page standard

Status: **current and mandatory specialization for research explainer / benchmark learning pages**
Audience: product Agents, research Agents, frontend Agents, writing Agents, review Agents
Applies to: benchmark explainers, method explainers, dataset/protocol pages, research learning pages, and any route whose primary job is to teach a technical system to a reader.

## Relationship to existing current policy

This file is a specialization, not a competing design system.

- `human-thinking-web-expression-contract.md` owns the general rule that web structure should externalize human thought structure.
- `audience-centered-technical-copy.md` owns project-wide technical copy and heading discipline.
- `ui-design-principles.md` owns the visual identity, semantic color, card budget, responsive behavior, and non-drift rules.
- `experiment-lineage-map-visual-standard.md` owns node/edge hierarchy for experiment-lineage and roguelike research maps: mainline, branch, scientific amendment, engineering fix, evidence, blocker state, and future preview semantics.
- research/data/evidence policies own scientific truth and claim boundaries.
- this file owns the **first-time-reader narrative shape of research explainer pages**: what each section is allowed to do, how sections advance, how corrective material is placed, how evidence is attached to claims, and how diagrams encode meaning.

When two rules overlap, apply the stricter current rule. Do not duplicate this file into page-local instructions.

---

## 1. Default reader: a lab colleague who knows the project exists but not the details

Assume the reader has heard that the lab is doing this project, but may know almost nothing about the implementation, dataset reconstruction, experiment IDs, or current evidence. They may arrive **before reading the paper or source code** and will naturally keep asking basic questions as they read.

The page must therefore supply the missing context at the moment it becomes necessary. Do not write as if the reader attended the previous discussion, remembers earlier drafts, or understands the website's internal information architecture.

On a **mechanism / benchmark explainer**, the primary narrative should normally state what happens in order.

Bad main-section heading:

> 原始 WebShop 有 train / eval / test，为什么 SEED 这里只剩两块？

Preferred:

> SEED 把 6,910 个 goals 分成两块

Bad:

> 1,000 个商品，为什么最后会有 6,910 个 goals？

Preferred:

> Small WebShop：1,000 个商品生成 6,910 个可执行 goals

On a **results / decision page**, genuine reader questions are appropriate and often preferred when they match the questions a first-time lab reader would actually ask, for example:

> OpenEvo 真的发生了学习吗？
>
> 学到的经验能迁移到新的任务吗？
>
> 最后还缺哪一个关键实验？

The distinction is simple: do not invent rhetorical questions for an operation diagram, but do use real scientific questions to organize results when the page exists to answer them.

---

## 2. Headings reveal the scientific story, not the website's filing system

For H1/H2/H3 on explainer pages:

- name the subject or state the operation directly;
- prefer short declarative phrases over rhetorical questions when teaching a mechanism;
- use genuine scientific questions on results pages when the section directly answers them;
- do not require the reader to already know the surprising part;
- do not make a correction, disclaimer, or “why this matters” sentence visually outrank the subject;
- keep the explanation in the paragraph immediately below the heading;
- never use the heading to tell the reader where content was moved, what this page intentionally omitted, or how the site was reorganized.

A good explainer sequence can be understood by scanning only the headings.

Example:

```text
原始 WebShop：商品世界与人工任务
WebShop 官方 small 模式：1,000 个商品
Small WebShop：商品生成可执行 goals
SEED 把 6,910 个 goals 分成两块
WebShop 最终评分：task score 与 exact success
SEED × OpenEvo：同一比较合同
```

A good results sequence can instead read like the lab's scientific conversation:

```text
OpenEvo 真的发生了学习吗？
有没有成功经验可以学习？
学进去以后能迁移到新的任务吗？
第一代能迁移，是否意味着可以一直越学越好？
现在真正可以下什么结论？
最后还缺哪一个关键实验？
```

---

## 3. One major section = one new mental-model step

Every major section must add one unique operation, distinction, or output that the reader did not already learn in the preceding sections.

Before keeping a section, ask:

> If this entire section vanished, what unique mental-model step would be lost?

If the answer is “none; it only restates the previous two sections,” delete or merge it.

Do not promote a recap into another full-width canonical figure merely because the recap is visually attractive.

Allowed repetition:

- a previous value appears as the **input** to the next operation;
- a compact reference strip reminds the reader of an earlier split;
- a local evidence note repeats an identifier so the claim can be verified.

Disallowed repetition:

- re-teaching the same quantities and relationships with a second large diagram;
- a “summary” section that redraws all preceding steps without adding a new decision or operation;
- a second interaction explainer immediately after the first one unless the two have clearly different roles.

---

## 4. Corrections belong next to the misconception source

A research explainer should not be organized around what the reader must **not** think.

If one relationship is easy to misread, place a concise corrective callout beside that relationship.

Example:

```text
1,000 products
   -> synthetic goal generation
6,910 goals

boundary note:
12,087 human instructions ≠ source list filtered into 6,910 goals
```

Do not create a separate full section titled “这些数字之间，不是同一种缩小关系” after the page has already taught the correct operations individually.

Use negative/corrective headings only when the page itself is a warning, incident, or troubleshooting surface.

---

## 5. Every visual distinction must carry real semantics

Any persistent visual distinction must answer **what it encodes**.

This applies to:

- color;
- light/dark shade;
- line style;
- arrow type;
- width/area;
- shape;
- position;
- icon/badge;
- animation.

If a reader asks “what does the dark gray mean?” and the answer is “nothing; it just makes the figure look richer,” remove the distinction.

Do not invent explanatory legends for decoration after the fact. Simplify the visual instead.

A visual element may be schematic, but it must say so. For example:

> 商品块仅表示规模示意，不按 1:1 数量绘制。

---

## 6. Use different visual grammar for different operations

Do not draw every numeric relationship with the same arrow. The operation itself is part of the data.

Canonical operation vocabulary:

```text
SUBSET / select
  same object type, smaller world
  e.g. 1.18M products -> official small -> 1,000 products

GENERATE
  input objects create a different object type
  e.g. 1,000 products -> synthetic goal generation -> 6,910 goals

SPLIT / REASSIGN
  one indexed set is partitioned or wrapper boundaries change
  e.g. original TEST/EVAL/TRAIN -> SEED NON-TRAIN/TRAIN

EVALUATE
  a completed trajectory / terminal state becomes metrics
  e.g. goal + terminal purchase -> evaluator -> task score + exact success

COMPARE
  two methods enter the same frozen contract
  e.g. SEED / OpenEvo -> same environment/data/evaluation contract
```

Never use a transformation arrow when the relationship is actually coexistence. When two datasets are parallel parts of one benchmark, prefer grouping, `+`, or side-by-side structure over an arrow that implies derivation.

---

## 7. Mainline first; evidence local to the claim

A first-time reader should be able to understand the full story without opening source-code details.

Use three reading layers:

```text
L1 beginner mainline
  plain language + one semantic diagram per new step

L2 researcher evidence
  exact file, function, config, commit, provenance, and evidence status

L3 reproduction detail
  manifests, hashes, scripts, verification, unresolved exact IDs
```

The crucial interaction rule is:

> **The claim owns its evidence.**

If a paragraph, question, or figure makes a claim, its L2/L3 evidence should normally be attached immediately beside or below it. `<details>` is preferred when evidence is optional:

```html
<article>
  <h3>学到的经验能迁移到新的任务吗？</h3>
  <p>当前答案……</p>
  <details>
    <summary>展开实验依据</summary>
    <!-- exact manifest / machine result / report / claim boundary -->
  </details>
</article>
```

The intended reading motion is:

```text
read claim
-> optionally expand its evidence
-> optionally inspect source links
-> collapse
-> continue to the next claim
```

Do **not** make the normal evidence interaction:

```text
read the entire narrative
-> click “查看证据链”
-> jump to a distant Evidence Map
-> reread the same claims in a second traversal
```

A separate evidence index is justified only when it has a distinct archival/search function that cannot be served locally. It must not duplicate the main narrative just to provide source links.

Evidence status language should remain explicit where relevant:

- PAPER EXPLICIT
- RELEASED-CODE EXPLICIT / DEFAULT
- OUR INFERENCE
- UNKNOWN / NOT PINNED

Unknown mappings must stay visually unknown. Do not draw a solid sampling arrow merely because the endpoints are known.

---

## 8. Scoring must be taught as input -> evaluator -> outputs

A metric glossary or table is not enough when the reader needs to understand what a score means.

Preferred scoring figure:

```text
Goal constraints
      +
Agent terminal state / purchase
      ↓
Evaluator
      ↓
normalized task score [0, 1]
      +
exact success {yes, no}
```

The page should make the interpretation visible:

- normalized score answers **how much of the task was satisfied**;
- exact success answers **whether the terminal task was fully satisfied**.

If the figure is illustrating the metric schema rather than showing a measured run, label it clearly. Never let a pedagogical value look like an experiment result.

---

## 9. Page-level sequence before local polish

Before adding or revising a canonical figure, inspect the entire route and write the page story as a one-line sequence.

Example for the WebShop explainer:

```text
Agent interaction
-> original benchmark
-> official small product world
-> synthetic goal generation
-> SEED goal split
-> evaluation outputs
-> fair-comparison contract
```

Then verify that each rendered major section owns exactly one arrow in that story.

If a section cannot be assigned a unique arrow, it is probably a duplicate, appendix, or local callout rather than a major section.

---

## 10. First-time-reader copy: talk about the research, not about page management

On research pages:

- define project-specific terms at first use;
- translate necessary English terms immediately when the Chinese page needs them;
- prefer concrete environment nouns and verbs over generic AI metaphors;
- avoid conversation-dependent words such as “刚才 / 前面说过 / 这里为什么又 / 这次” unless the visible page supplies the referent;
- avoid rhetorical “你可能会问”; either state the fact or ask the real scientific question directly;
- use source links beside the claim they support;
- keep the page understandable when read before the source code.

Most importantly, **never expose the author's content-management decisions as reader-facing prose**. The reader should see the research, not instructions about how the website was organized.

Avoid wording such as:

```text
背景只保留入口，不在实验结果页重新讲一遍
这页不按 H0/H1 排列
方法背景不在这里重复
完整代码继续向下放在 Evidence Map
这些页面从主报告骨架降为 deep dive
下一步实验设计从 Results 中移到这里
一个概念只保留一个 canonical explanation
```

Prefer the reader's actual question or the scientific fact:

```text
OpenEvo、WebShop、SEED 和实验记录分别指什么？
OpenEvo 真的发生了学习吗？
这些结论具体来自哪些实验？
哪些实验值得进一步追问？
下一场真正关键的实验是什么？
H1.42 发生在 H1.41 之后，因此不能改变 H1.41 时点的结论。
```

Links to another route are fine, but their copy should answer **what the reader will learn there**, not explain why the author chose to place the content there.

---

## 11. Acceptance checklist for a research explainer / results page

Before handing a Preview to the owner, verify:

1. A first-time lab reader can identify the subject without prior paper/code reading.
2. Mechanism/benchmark headings state the operation directly; results headings may use genuine scientific questions.
3. Scanning the headings alone reveals a coherent scientific sequence.
4. Every major section adds one unique mental-model step or answers one distinct research question.
5. Removing any recap-only section would not make the argument less complete; recap-only sections have been removed or merged.
6. Corrective material sits beside the relationship it protects instead of becoming a second main storyline.
7. Every color, shade, shape, arrow, width, badge, and animation has a named semantic meaning.
8. Different operations (subset, generate, split, evaluate, compare) do not share a misleading identical visual grammar.
9. Previous numbers appear only when needed as inputs/reference, not as another full lesson.
10. Optional evidence is attached locally to the claim/question/figure it supports.
11. A reader does not need a second full-page traversal to inspect evidence for claims already read.
12. Claim boundaries and unknowns remain visible in the evidence layer.
13. Metric figures explain what the outputs mean, not only their field names.
14. No pedagogical mock value is visually presented as a measured experiment result.
15. Public copy contains no editor-facing “this page omits/moves/organizes content” narration.
16. The route still works as static HTML and remains legible in light/dark and narrow/wide layouts.
17. The exact-head Vercel Preview is inspected after repository validation.

---

## 12. WebShop canonical explainer sequence

Until executable/source truth changes, the WebShop learning route should prefer this narrative order:

```text
0. WebShop interaction model
   observation -> action -> page transition -> terminal evaluation

1. Original benchmark
   product world + human instruction split

2. Official small product world
   1.18M products -> WebShop official small -> 1,000 products

3. Synthetic goal generation
   1,000 products -> get_synthetic_goals(...) -> 6,910 goals
   local boundary: 12,087 human instructions are not filtered into 6,910 goals

4. SEED goal-index wrapper
   original three-way baseline wrapper -> SEED two-way active wrapper
   then 0–499 vs 500–6909 on the 6,910-goal small environment

5. Evaluation
   goal + terminal state -> evaluator -> normalized task score + exact success

6. Fair comparison
   SEED and OpenEvo enter the same frozen WebShop contract; learning method may differ
```

This sequence is a presentation contract, not a substitute for source verification. If upstream code/evidence changes, update the facts first and then update this section in the same change.

---

## 13. Change discipline

For a non-trivial research-page change:

```text
inspect whole route
-> identify unique section roles / reader questions and duplicates
-> form the scientific heading sequence
-> map each explainer section to a real operation
-> attach each result claim to its local evidence and claim boundary
-> implement semantic HTML/Astro/CSS
-> run reader-voice + repository validation
-> inspect exact-head Vercel Preview
-> revise once as a coherent batch when possible
```

Do not use generated decorative images as a substitute for the page's semantic HTML diagram when the goal is to explain executable code/data relationships. The explainer itself should remain inspectable, responsive, selectable, accessible HTML whenever practical.
