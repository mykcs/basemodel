# WebShop explainer and Results reader-workflow retrospective

Date: **2026-08-28**  
Status: **historical case / reusable friction retrospective**  
Scope: `mykcs/basemodel` research explainers, especially SEED × OpenEvo × WebShop, GitHub → Vercel iteration, Results evidence UX, and multi-Agent integration.

> This file records **how the current rules were discovered in practice**. It is not a second current policy. For behavior today, read the current owners first:
>
> - `docs/agents/current/research-explainer-page-standard.md`
> - `docs/agents/current/reader-first-copy-hierarchy.md`
> - `docs/agents/current/research-editorial-style.md`
> - `docs/agents/current/audience-centered-technical-copy.md`
> - `docs/agents/current/ui-change-visual-acceptance-gate.md`
> - `docs/agents/current/branch-and-pr-conventions.md`
> - `docs/agents/current/release-closeout-protocol.md`
> - `docs/agents/current/multi-pr-semantic-integration-playbook.md`
>
> Scientific claims must still be re-resolved against executable source and current experiment authority. Historical numbers and commit IDs below are provenance, not current truth.

---

## 1. What this work was actually trying to do

The task began as a seemingly local WebShop visualization change, but it exposed a larger problem: the site needed to explain the SEED-compatible WebShop setting to a lab colleague who knew **that the project existed** but knew almost none of the implementation details.

The reader model that eventually worked was:

> A smart lab colleague arrives directly on the website, has not necessarily read the paper or source code, has low attention available, and will keep asking basic scientific questions while reading.

That reader needs the page to establish, in order:

```text
what WebShop interaction is
-> what the original benchmark contains
-> what the official small world is
-> how products become executable goals
-> how SEED uses the goal pool
-> what the score means
-> what must be identical for a fair SEED/OpenEvo comparison
```

Later, the same reader model had to be applied to the Results page:

```text
Did OpenEvo really learn?
-> was there successful experience to learn from?
-> did training absorb it?
-> did it transfer to new tasks?
-> did the gain survive another generation?
-> what can we actually claim now?
-> what decisive experiment is still missing?
```

The important lesson is that **mechanism pages and Results pages need different heading grammars**:

- mechanism / benchmark explainers usually state operations directly;
- Results pages may use genuine scientific questions, because answering those questions is the page's job.

Do not turn this distinction into a blanket “never use question headings” rule.

---

## 2. Scientific-semantic friction that caused the most downstream UI errors

### 2.1 “1,000 products” was an upstream WebShop small mode, not a SEED-only resampling step

An early mental model could easily become:

```text
SEED takes 1.18M WebShop products
-> SEED randomly selects 1,000
```

That framing was too strong. The code-grounded interpretation is:

```text
Original WebShop product world
-> WebShop's own official small configuration
-> 1,000-product small world
-> SEED released code points at those small assets
```

Why this mattered visually: a diagram that says “SEED sampled 1,000” invents scientific ownership that the source does not support.

General lesson:

> Before drawing a transformation, identify **who performs the operation** and whether it is upstream benchmark behavior, paper-specific behavior, or our inference.

### 2.2 `12,087` human instructions and `6,910` small-world goals are different object types

This was the most important semantic trap.

The tempting but wrong visual story was:

```text
12,087 instructions
-> filter / shrink
6,910 goals
```

The correct mental model is closer to:

```text
Original WebShop benchmark
├─ product world
└─ 12,087 crowd-sourced human text instructions

Official 1,000-product small world
-> synthetic goal generation
-> 6,910 executable goals
```

The `6,910` are not “the 12,087 after filtering.” The small environment constructs executable goals from product records and options. A single product can yield multiple goals because option combinations can be enumerated.

This one scientific distinction drove several design rules:

1. do not use one arrow for relationships that are not derivations;
2. do not treat all decreasing/increasing numbers as the same “scale” operation;
3. when two quantities count different object types, say so locally;
4. a correction such as `12,087 ≠ 6,910` should sit beside the generation diagram rather than becoming another full-width lesson after the correct relationship was already taught.

### 2.3 Goal ordering and goal IDs are constructed identities, not natural product order

The environment deterministically shuffles goals before indexed access. Therefore a goal ID such as `500` is an index in the generated-and-shuffled goal list, not a natural product identifier.

General lesson:

> When a split is expressed as numeric IDs, first establish what those IDs index and what ordering procedure produced them. Otherwise a visually precise ruler can communicate a false ontology.

### 2.4 Three different “split” concepts were easy to collapse into one

The conversation repeatedly had to separate:

1. original benchmark human-instruction train/dev/test counts;
2. the original WebShop baseline wrapper goal-index selection;
3. the SEED released wrapper's active train/non-train goal-index selection.

A page can be scientifically correct at each local paragraph and still become globally confusing if these units are shown with the same visual treatment.

The useful pattern became:

```text
original benchmark split
  human instructions

original WebShop baseline wrapper
  goal indices: TEST / EVAL / TRAIN

SEED released wrapper
  goal indices: NON-TRAIN / TRAIN
```

The final SEED explanation should not force a first-time reader to decode terms such as “released wrapper” or “goal-index rule” in the headline. Put the easy fact first:

> SEED 把 6,910 个 goals 分成两块

Then place exact code terminology in the evidence layer.

### 2.5 Paper-reported `128` and the released-code `0–499` pool must not be connected by invented certainty

The released code gave a concrete held-out boundary. The paper reported 128 test samples. The exact public mapping from the 500-slot pool to the 128 sampled task IDs was not pinned by the evidence being used.

The correct representation was therefore not:

```text
500 held-out
-> exact known sampling
128
```

but:

```text
500 held-out slots
...
exact mapping not pinned
...
128 paper-reported test samples
```

General lesson:

> Known endpoints do not imply a known mapping. Unknown provenance must remain visually unknown.

### 2.6 A score table was not enough to teach evaluation

A glossary like:

```text
task_score: 0..1
won: boolean
```

is technically correct but does not answer the first-time reader's real question: “What happened at the end of one WebShop episode, and what do these numbers mean?”

The better explanatory grammar was:

```text
Goal requirements
      +
Agent terminal purchase state
      ↓
WebShop evaluator
      ↓
Task Score
      +
Exact Success
```

Then explain:

- score = degree of task satisfaction;
- exact success = whether the task was fully satisfied.

This also prevented a pedagogical mock value from looking like a measured experiment result.

---

## 3. Visual-design friction: locally attractive choices repeatedly created false semantics

### 3.1 Dark gray vs light gray with no data meaning

One early figure used two gray tones for product blocks. The reader naturally asked what the distinction meant. Attempts to explain them as “foreground” and “the rest not expanded” only made the confusion worse because those categories were not real scientific categories.

The correct fix was not a better legend. The correct fix was:

> Remove the distinction.

This is one of the most reusable lessons from the entire work:

> **If a color, shade, width, shape, icon, or animation has no real semantic meaning, delete the distinction instead of inventing a legend after the fact.**

### 3.2 One arrow style cannot mean subset, generation, split, evaluation, and comparison

Repeated use of arrows made unrelated operations look equivalent. The useful operation vocabulary became:

```text
SUBSET
  same object type, smaller world

GENERATE
  inputs produce a different object type

SPLIT / REASSIGN
  one indexed set is partitioned or boundaries change

EVALUATE
  terminal behavior becomes metrics

COMPARE
  two methods enter one frozen contract
```

This is not decorative labeling. The operation itself is part of the research meaning.

### 3.3 “Corrective” sections can become duplicate sections

The section equivalent to “这些数字之间，不是同一种‘缩小’关系” was initially useful as a repair for an earlier misleading scale diagram. Once the preceding sections individually encoded `SUBSET`, `GENERATE`, and unknown mappings correctly, the repair section no longer added a new mental-model step.

It became pure repetition and was removed.

A practical test that worked well:

> If this entire section disappeared, what unique new understanding would be lost?

If the answer is “none,” merge or delete it.

### 3.4 Step-by-step development creates page-level duplication even when every step is individually good

The one-figure-at-a-time acceptance loop was highly effective for correctness. But after several accepted figures, the route accumulated overlapping summaries, duplicated interaction explainers, and repeated numbers.

This is a structural consequence of incremental design, not necessarily poor local work.

Therefore add a **page-level editorial checkpoint** after several accepted stages:

```text
inspect whole route
-> write one-line story
-> assign one unique role to every major section
-> remove sections that no longer advance the story
```

Do not keep adding new figures indefinitely just because each one passed local review.

---

## 4. Reader-model friction: the site kept speaking like its own editor

A recurring anti-pattern was copy such as:

```text
背景只保留入口，不在实验结果页重新讲一遍
这页不按 H0/H1 排列
背景定义不在这里重复
完整代码继续向下放在 Evidence Map
这些页面从主报告骨架降为 deep dive
下一步实验设计从 Results 中移到这里
页面显示的是带日期的默认分支快照
```

These sentences tell the reader how authors reorganized the website. They do not answer a scientific question.

The better pattern was to replace page-management narration with either a scientific fact or the reader's actual question:

```text
OpenEvo、WebShop、SEED 和实验记录分别指什么？
这些结论具体来自哪些实验？
哪些实验值得进一步追问？
下一场真正关键的实验是什么？
H1.42 发生在 H1.41 之后，因此不能改变 H1.41 时点的结论。
```

Important nuance:

- “本页内容” as a navigation label is normal UI and does not need mechanical removal.
- The problem is **research prose written from the information architect's point of view**.

The final reader assumption should be carried into review:

> The lab reader may know the project name but not the details; the page supplies missing context when needed and does not assume they witnessed previous edits or discussions.

---

## 5. Evidence-UX friction: a second full-page evidence pass was the wrong interaction

The original Results pattern made the reader:

```text
read a question and answer
-> click “查看证据链”
-> jump to a distant Evidence Map
-> reread the same claim in evidence form
-> navigate back mentally to the mainline
```

This is poor for a reader who is likely to read the prose only once.

The successful pattern became:

```text
read question
-> read current answer
-> optionally expand “实验依据” in the same card
-> inspect claim boundary + manifest/result/report links
-> collapse
-> continue to next question
```

This produced a stronger rule:

> **The claim owns its evidence.**

A separate Evidence Map is justified only if it serves a distinct archival/search purpose. It should not duplicate the main narrative merely to host source links.

The local evidence layer should include not only “where the evidence is” but also **how far the evidence allows the claim to go**. In practice, adding a visible claim boundary next to links reduced overclaim risk.

---

## 6. Engineering friction: tests sometimes protected the old mistake

Several changes failed not because the new scientific explanation was wrong, but because repository tests still asserted the old wording or old visual structure.

Examples included tests that expected:

- obsolete scale ratios such as `÷1.7`;
- an old complex SEED split heading after the heading had been simplified;
- the old evidence-map navigation pattern;
- a stale count of background reference cards.

The wrong response would have been to restore the old UI to make CI green.

The correct response was:

```text
verify the new scientific / product contract
-> identify whether the failing test protects real behavior or stale implementation
-> update the test to protect the new invariant
-> never weaken a valid gate just to make the build pass
```

Good tests should protect semantic invariants such as:

- no legacy duplicate section is rendered;
- evidence stays local to its claim;
- old misleading ratios do not reappear;
- the current heading is the low-attention version;
- public research copy does not regress into page-management language.

Bad tests merely freeze a historical string or layout that no longer represents the intended product.

---

## 7. Browser-gate friction: responsive failures were useful product feedback

Production/browser gates later exposed issues that were not visible in source review:

- a mixed Chinese/English sentence became too narrow on mobile;
- an explanatory transition column became a text rail at intermediate width;
- Task Score and Exact Success were squeezed side-by-side into unreadably narrow prose on a very wide viewport because the containing grid had a fixed max width.

The productive response was not to relax the layout heuristic. It was to simplify the page:

- shorten or translate the sentence;
- remove redundant transition prose and keep the visual transition;
- stack the two evaluation outputs vertically.

General lesson:

> A strict visual gate can reveal real information-density problems. Fix the reader experience before changing the threshold.

Also, passing one viewport does not imply global acceptance. The useful matrix covered narrow mobile, tablet, compact desktop, normal desktop, and large desktop, plus light/dark where relevant.

---

## 8. Vercel friction: deployment state is not the same as acceptance

Several mistakes were easy to make during rapid iteration:

1. assuming a branch alias already represented the latest commit;
2. treating `BUILDING` or `QUEUED` as a future promise instead of checking exact state now;
3. seeing an old `READY` deployment and assuming it belonged to the current head;
4. pushing many tiny commits to a deployment-eligible branch and creating a build queue;
5. checking Vercel status without verifying the `githubCommitSha` metadata.

The safer closeout sequence is:

```text
identify exact Git head
-> identify deployment whose metadata has that exact SHA
-> confirm it actually ran the required gates
-> inspect failures by gate, not just top-level state
-> only then hand off the Preview
```

A stable branch alias is convenient for the user, but exact-head verification is what gives it meaning.

Current branch/deployment policy has evolved since this incident; follow current `branch-and-pr-conventions.md` and deployment policy rather than copying historical commit behavior literally.

---

## 9. Multi-Agent Git friction: a previously clean PR can become unsafe to merge

The working WebShop PR was initially scoped to the explainer work. Later, other Agent work entered the same branch and introduced unrelated Results/Experiment changes and CI failures.

At that point, “the PR used to be correct” was no longer a valid merge argument.

The successful recovery was:

```text
inspect current PR head
-> detect unrelated concurrent changes
-> do not merge the contaminated head
-> create a clean integration line from current main
-> copy only the accepted WebShop / policy / test files
-> verify the clean diff
-> open a new integration PR
-> merge the clean PR
-> explicitly close the superseded PR
```

Historical anchors from this incident:

- PR `#214` became a contaminated/superseded worker line and was not used as the final merge vehicle.
- PR `#215` carried the clean accepted WebShop explainer integration into `main`.

These are historical references only; do not infer current branch state from them.

General lesson:

> **Merge the current diff, not the memory of what the branch used to contain.**

### 9.1 A 409 on stale SHA is protection, not annoyance

During concurrent writes, GitHub rejected an update because another Agent had changed the target file after it was read. That was the correct behavior.

The safe pattern is:

```text
fetch current blob SHA
-> edit against that exact content
-> update with that SHA
-> if 409, re-read and reconcile
```

Never force-write over a file simply because the intended change is small.

---

## 10. Build-budget friction: sequential writes can create deployment storms

Incremental work created many commits, and deployment-eligible research branches can queue many Vercel jobs if every intermediate commit is treated as a preview candidate.

What worked better later:

- batch coherent source changes before requesting hosted acceptance;
- keep one acceptance head per meaningful review stage;
- use repository Git-data APIs or an atomic multi-file commit when practical;
- do not create many probe branches or commits solely to observe provider behavior;
- distinguish local/source validation from expensive hosted Preview acceptance.

Current executable deployment policy is authoritative; follow it rather than historical assumptions.

---

## 11. The step-by-step acceptance loop was still one of the strongest techniques

Despite the duplication risk, the stage gate was valuable:

```text
one core figure
-> code-grounded facts
-> GitHub implementation
-> Preview
-> user acceptance
-> only then next figure
```

It prevented a large wrong redesign and made semantic errors cheap to correct.

The improvement is not to abandon stage gates. It is to combine them with periodic page-level editing:

```text
local acceptance gates
+
periodic global deduplication audit
```

A good cadence is to perform a route-wide audit after several accepted stages or whenever the user starts noticing repetition.

---

## 12. A practical future-Agent workflow that incorporates the lessons

### Phase A — resolve truth before visual design

1. Read current Agent docs and the route-local `AGENTS.md`.
2. Resolve the current scientific authority from source/config/tests/manifests.
3. Label each important claim as appropriate: paper explicit, released-code explicit/default, inference, or unknown.
4. Write down the object types involved: product, human instruction, generated goal, goal index, episode, score, success.
5. Do not draw arrows until the operation is known.

### Phase B — define the reader and the one-line story

1. Assume a lab colleague who knows the project exists but not the details.
2. For an explainer, write the operation sequence in one line.
3. For Results, write the genuine scientific questions in the order the lab would ask them.
4. Give every major section exactly one unique role.

### Phase C — implement one semantic visual at a time

1. Use HTML/Astro/CSS semantic diagrams, not generated decorative images, when the content is executable data/code relationships.
2. Make visual differences correspond to real data/operation differences.
3. Put technical terminology below the easy statement, not in the low-attention headline.
4. Put corrections beside the relationship that can be misread.
5. Attach evidence locally with `<details>` when optional.

### Phase D — perform a global editorial pass

Ask of every major section:

```text
What new understanding is added here?
```

If none, merge/delete it.

Also search for editor-facing copy:

```text
this page does / does not ...
we moved ... here
background is not repeated ...
see evidence below ...
canonical page owns ...
```

Replace with the reader's question or a scientific fact.

### Phase E — validate behavior, not old strings

1. Update tests when the intended semantic contract changes.
2. Never reintroduce a known-bad explanation solely to satisfy a stale assertion.
3. Run responsive/light/dark browser checks.
4. Fix content density/layout before weakening a valid visual gate.

### Phase F — integrate safely

1. Re-check branch diff immediately before merge.
2. If unrelated Agent work entered the branch, do clean integration from current `main`.
3. Verify the exact deployment SHA.
4. Close superseded PRs explicitly.
5. Do not call a release complete until the required hosted/browser gates for the exact head have run.

---

## 13. Red flags that should make a future Agent stop and re-check

Stop and re-evaluate if any of these happen:

- A reader asks “what does this color/shade mean?” and there is no scientific answer.
- A legend exists mainly to justify decorative variation.
- Two adjacent large sections teach the same numbers/relationship.
- A mechanism-page heading assumes the reader already asked a source-code-specific question.
- A Results paragraph explains where content was moved instead of answering a scientific question.
- Clicking “evidence” scrolls the reader to a second copy of a claim they already read.
- A solid arrow connects two known endpoints whose exact mapping is actually unknown.
- `12,087` and `6,910` are shown as one filtering chain.
- Original benchmark train/dev/test and goal-index splits are treated as the same object.
- A test fails only because it expects a superseded phrase or visualization.
- A PR contains unrelated files from another Agent.
- A GitHub write returns 409 and the next impulse is to force it.
- Vercel is `READY`, but nobody checked which commit is `READY`.
- A narrow/large-screen layout failure is “fixed” only by loosening the test threshold.
- Many tiny pushes are generating a queue of hosted builds.

Each red flag corresponds to a real friction point from this work.

---

## 14. What should remain durable vs historical

The durable rules discovered here are already owned by current policy. In particular, future Agents should prefer the current explainer standard for:

- lab-colleague reader model;
- mechanism vs Results heading grammar;
- one major section = one new mental-model step;
- semantic visual distinctions only;
- operation-specific visual grammar;
- claim-local evidence;
- prohibition on editor-facing page-management narration;
- evaluation as input → evaluator → outputs;
- exact-head Preview acceptance.

This retrospective should remain in `history/` because its purpose is different: it preserves **failure signatures, causal explanations, and recovery patterns** so a future Agent can recognize that a familiar-looking problem has already happened before.

---

## 15. Short version for a future Agent under time pressure

If you only remember ten things:

1. Resolve scientific object types before drawing anything.
2. `12,087 human instructions` are not a filtered parent of `6,910 synthetic goals`.
3. A visual distinction without scientific meaning should be deleted.
4. Use different visual grammar for subset, generate, split, evaluate, and compare.
5. Build for a lab colleague who knows the project exists but not the details.
6. Explainers teach operations; Results answer genuine scientific questions.
7. Evidence should expand next to the claim, not force a second full-page reading pass.
8. If CI protects a superseded explanation, update the test rather than restoring the mistake.
9. Before merging, inspect the **current** branch diff; use clean integration if concurrent work contaminated it.
10. “Vercel READY” is not enough — verify the exact commit and the required browser gates.
