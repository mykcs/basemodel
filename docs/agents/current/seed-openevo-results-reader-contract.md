# SEED × OpenEvo Results reader contract

Last reviewed: **2026-08-26**
Status: **current and mandatory for the SEED × OpenEvo Results route**
Applies to:
- `src/pages/research/seed-openevo/results.astro`
- `src/pages/en/research/seed-openevo/results.astro`
- every mounted `OpenEvoWebShopResults*` component
- tests that protect this route's reader voice, scientific boundaries, or narrative order

This file specializes, and does not replace, `audience-centered-technical-copy.md`, `research-explainer-page-standard.md`, and `scientific-state-provenance.md`.

## 1. Default reader

Write for a lab colleague who already knows that the lab is studying OpenEvo, SEED, and WebShop, but has **not followed the individual experiment runs**.

Assume they do **not** know:
- H1.38B / H1.39 / H1.40 / H1.41 / H1.42;
- what `task-ID-disjoint`, `held-out`, `parser`, `projection`, `denominator`, or `measurement-invalid` mean;
- why one run can be scientifically useful even when its headline score is invalid;
- which numbers are internal transfer evidence and which belong to the SEED official held-out task range.

The page should feel like a labmate explaining progress at a whiteboard, not like a machine-generated experiment ledger.

## 2. First-screen promise

The first screen must answer three questions in plain language before showing dense experiment identifiers:

1. **What have we already learned?**
2. **What happened in the latest benchmark-facing evaluation?**
3. **What is the next experiment that actually changes the answer?**

A reader should understand those three answers without opening any `<details>` element.

Do not lead with confidence intervals, campaign IDs, manifest hashes, or chains of English jargon.

## 3. Chinese-first technical language

On the Chinese route, Chinese carries the explanation. English is kept only when it is a code identifier, an established project name, or useful for later source lookup.

Preferred first-use forms:
- `官方保留任务（held-out tasks）`
- `解析器（parser）`
- `动作投影规则（projection）`
- `测量无效（measurement-invalid）`
- `内部新任务、任务 ID 不重叠评估（OpenEvo internal fresh task-ID-disjoint evaluation）`
- `与 SEED 评测设置兼容（SEED-compatible）`

Avoid sentences that require the reader to decode several untranslated English phrases before reaching the verb.

Practical rule: if an English term can be translated without losing scientific identity, put the Chinese meaning first. Keep experiment IDs such as `H1.39`, model names, filenames, config keys, and code symbols unchanged.

## 4. Density budget

Mainline prose is for understanding; exact evidence is for expansion.

Use these defaults:
- one paragraph = one claim;
- one mainline sentence should normally introduce no more than one new project-specific term;
- keep long experiment IDs and exact attempt counts out of the first screen unless they are necessary to distinguish two claims;
- do not stack several confidence intervals or machine statuses in a beginner paragraph;
- put exact attempt counts, confidence intervals, manifests, hashes, machine reconciliation, and code links inside the local `<details>` evidence block;
- a visible table is justified only when the table itself is the scientific comparison the reader needs at that moment.

If removing a number from the mainline does not change the reader's interpretation, move it into `展开实验依据`.

## 5. Minimum reasoning bridge

Plain language must not become unsupported shorthand. A reader should not have to open `<details>` merely to answer “why do you think that?”

For every mainline sentence that makes an inference — especially sentences using ideas such as **therefore**, **this means**, **does not automatically**, **the main bottleneck**, **supports**, **explains**, or **proves** — expose the minimum reasoning bridge in the visible prose:

```text
what we observed
-> what that observation supports
-> what it still does not prove
```

The mainline does **not** need exact counts or confidence intervals. It does need at least one concrete observation in ordinary language.

Bad:

> 在真实 WebShop 闭环里，收益并不会自动出现。

Better:

> 两次对照都能把训练目标拟合下来，但新任务闭环表现没有稳定改善。因此目前只能说模型学到了训练目标；在这两轮实验里，这种学习还没有转化成稳定的新任务收益。

Bad:

> 这是目前最明显的瓶颈。

Better:

> 旧能力保持指标在 H1.40 和 H1.41 两轮里都朝下降方向，因此“保住旧能力”是目前证据最一致的瓶颈。

Practical check: if a lab PI can point at a sentence and ask “你为什么这样说？”, the immediately preceding or following sentence should already contain the short answer. `<details>` is for “具体是哪一轮、多少次、置信区间和代码在哪里？”, not for the first layer of reasoning.

## 6. Results narrative order

Preserve the seven-question scientific conversation, but make each answer understandable without prior experiment history.

Recommended reading sequence:

```text
30-second progress summary
-> experiment/data boundary in ordinary language
-> Q1: did learning machinery really run?
-> Q2: did the model produce useful experience?
-> Q3: could the update fit that experience?
-> Q4: did one update transfer to unseen internal tasks?
-> Q5: did that become stable multi-generation improvement?
-> Q6: could engineering/measurement failures be separated from model ability?
-> Q7: what benchmark-facing experiment is still missing or still needs repair?
-> next action
```

Do not organize the main reading path around the website's information architecture, campaign filing system, or experiment chronology alone.

## 7. Latest scientific state to preserve

### H1.38B / H1.39

These support a reproducible **internal fresh-task transfer** result after one parameter update.

The evaluation tasks came from `goal_idx >= 500` and were task-ID-disjoint from training. They are **not** the SEED official held-out task range.

### H1.40

Second-generation experience supply and a real G2 write existed, but acquisition, retention, and preservation did not all pass. T2 was not opened.

Allowed summary: **second-generation continual integration is not established.**

Do not say G2 proved transfer failure on T2.

### H1.41 / H1.42

H1.41 is the cutoff for the mechanism conclusions presented as the main historical result set.

H1.42 happened later and is a measurement-boundary / calibration record. It may explain how measurement was checked, but it must not be blended backward into H1.41's mechanism conclusion as though it existed at that cutoff.

### 2026-08-25 SEED official-held-out comparison v1

A separate benchmark-facing campaign completed **512 episodes** on a frozen 128-task panel drawn from the SEED official held-out range `goal_idx 0-499`.

Its story has three layers:

1. **SEED original parsing path / PRIMARY-v1:** both arms produced 0.0 / 0.0%, but the run is **measurement-invalid** because the model's action wrapper and SEED's released action projection did not agree. The zero must not be described as model ability.
2. **OpenEvo-native diagnostic:** valid local diagnostic on the same 128 tasks: BASE task score 14.6 / exact success 2.3%; frozen SD-LoRA task score 28.3 / exact success 1.6%. This shows more partial task progress, not more completed purchases. It is not the final SEED-compatible headline result.
3. **Repaired primary:** still pending. Keep the same frozen 128 tasks and two arms; repair only the parser compatibility and rerun 256 episodes.

The 128-task panel is **SEED-compatible**, not the paper's exact reported denominator. The SEED checkpoint/training result has not been locally reproduced. SEED's paper-reported 89.7 / 78.1% must remain labelled paper-reported.

### WB1

WB1 is a separate ongoing train-only SEED-aligned benchmark line. Its train generations may be shown as progress, but they are not a final held-out comparison and must not overwrite the H1.40 parametric G2 conclusion.

## 8. Local evidence interaction

Each scientific question keeps this pattern:

```text
question
-> short current answer with a minimum observation-to-conclusion bridge
-> optional <details>
   summary: 展开实验依据
   exact counts / confidence intervals / machine result / config / code / claim boundary
-> next question
```

Do not replace `展开实验依据` with an abstract phrase such as `证据链与代码回溯` on the Chinese beginner path.

Do not send the reader to a distant bottom Evidence Map to understand a claim they just read.

## 9. Before editing this route

Any Agent making a non-trivial change to the Results route must:

1. read this file;
2. read `research-explainer-page-standard.md` and `audience-centered-technical-copy.md`;
3. resolve the latest scientific state from `mykcs/openevo-experiment` rather than copying an older page sentence;
4. write the proposed heading/question sequence before local copy polishing;
5. check every English technical term on the Chinese route for a first-use Chinese gloss;
6. check whether exact numbers can move into `展开实验依据`;
7. for every inferential sentence, verify that the visible prose contains the minimum observation that justifies it;
8. verify that H1.41 mechanism conclusions, later H1.42 measurement work, the 2026-08-25 held-out comparison, and ongoing WB1 progress are not conflated;
9. run the reader-voice/scientific-boundary tests and inspect the exact-head Preview.

If new experiment evidence changes the answer to Q7, update the answer and this file's latest-state section in the same change.
