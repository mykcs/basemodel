# SEED × OpenEvo Results reader contract

Last reviewed: **2026-08-26**
Status: **current and mandatory for the SEED × OpenEvo Results route**
Applies to:
- `src/pages/research/seed-openevo/results.astro`
- `src/pages/en/research/seed-openevo/results.astro`
- every mounted `OpenEvoWebShopResults*` component
- tests that protect this route's reader voice, scientific boundaries, evidence interaction, or narrative order

This file specializes, and does not replace, `audience-centered-technical-copy.md`, `research-explainer-page-standard.md`, `scientific-state-provenance.md`, and `experiment-result-publication-workflow.md`.

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
3. **What is the next/current experiment that actually changes the answer?**

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
- `源码忠实任务语义（source-faithful task semantics）`

Avoid sentences that require the reader to decode several untranslated English phrases before reaching the verb.

Practical rule: if an English term can be translated without losing scientific identity, put the Chinese meaning first. Keep experiment IDs such as `H1.39`, model names, filenames, config keys, and code symbols unchanged.

## 4. Density budget

Mainline prose is for understanding; exact evidence is for expansion.

Use these defaults:
- one paragraph = one claim;
- one mainline sentence should normally introduce no more than one new project-specific term;
- keep long experiment IDs and exact attempt counts out of the first screen unless they are necessary to distinguish two claims;
- do not stack several confidence intervals or machine statuses in a beginner paragraph;
- put exact attempt counts, confidence intervals, manifests, hashes, machine reconciliation, and most code links inside the local `<details>` evidence block;
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
-> Q7: what benchmark-facing experiment is still missing / running / awaiting closeout?
-> optional deep technical attribution trace
-> next action
```

Do not organize the main reading path around the website's information architecture, campaign filing system, or experiment chronology alone.

The action-wrapper attribution trace is allowed as a collapsed technical depth layer after the seven-question narrative. It must not displace Q1-Q7 or make first-time readers learn the parser incident before they understand the research question.

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

### 2026-08-25 SEED official-held-out comparison v1 + repaired PRIMARY-v2

A separate benchmark-facing campaign completed **768 episodes** on one frozen historical 128-task panel drawn from the SEED official held-out range `goal_idx 0-499`: 512 PRIMARY/DIAGNOSTIC episodes plus 256 repaired-PRIMARY episodes.

Its story has three layers:

1. **SEED original parsing path / PRIMARY-v1:** both arms produced 0.0 / 0.0%, but the run is **measurement-invalid** because the model's action wrapper and SEED's released action projection did not agree. The zero must not be described as model ability.
2. **OpenEvo-native diagnostic:** valid local diagnostic on the same 128 tasks: BASE task score 14.6 / exact success 2.3%; frozen SD-LoRA task score 28.3 / exact success 1.6%. This shows more partial task progress, not more completed purchases.
3. **Repaired PRIMARY-v2:** completed on the same frozen 128-task panel after changing only action-wrapper recognition. BASE task score 4.1 / exact success 0.0%; frozen SD-LoRA task score 7.3 / exact success 2.3%. Paired ITT mean delta is +3.15 score×100 with bootstrap 95% CI `[-0.65, +7.19]` over 128 paired tasks. This is a positive direction but the interval crosses zero, so it is not evidence of a stable win.

The repaired PRIMARY-v2 is the local **SEED-compatible** headline for that historical frozen panel. It is not the paper's exact reported denominator. The SEED checkpoint/training result has not been locally reproduced. SEED's paper-reported 89.7 / 78.1% must remain labelled paper-reported.

### Action-wrapper attribution boundary

Keep the following layers separate:

- released SEED prompt/parser require `<action>...</action>`;
- saved no-adapter BASE evidence shows Qwen2.5-7B-Instruct can emit `[action]...` even when the prompt requests angle brackets;
- the inference backend directly decodes generated tokens and does not rewrite `<` into `[`;
- current H1.36 training-pipeline evidence does not support the claim that malformed parser-invalid wrappers were qualified self-evolution supervision;
- the experiment-integration failure was that known model-output drift was not preflighted against the formal SEED parser before PRIMARY-v1.

Do not simplify this into “OpenEvo wrote `[action]`”, “SEED parser had a bug”, or a claim about a specific human author. Repository evidence does not identify the upstream Qwen pretraining/SFT example that caused the habit.

### Post-v2 source-semantics audit and source-faithful successor

The historical 128-task panel matched the `goal_idx 0-499` held-out range, but a later audit against pinned SEED public code found that this is not enough for a source-faithful first-validation reproduction.

Pinned public-code semantics use:
- validation base seed `1000`;
- ordered session draw `np.random.RandomState(1000).choice(np.arange(500), size=128, replace=False)`;
- worker seed `1000 + slot`;
- worker-specific goal ordering before `reset(session=N)`.

Because worker seed changes goal ordering, the numeric session index alone is not a complete task identity. The historical panel therefore remains valid as a frozen SEED-compatible local panel, but it must not be relabelled as the source-faithful first-validation semantic panel.

**Current upstream execution state (2026-08-26 snapshot):** the successor campaign `20260826-0630-seed-webshop-public-code-reproduction` on `mykcs/openevo-experiment` branch `seed-webshop-pubcode-repro-v1-prep` has advanced beyond design-only status. Its current-campaign authority records:

- `status = executing-formal-run`;
- execution-readiness release passed 20/20 fail-closed checks;
- the source-faithful semantic panel was deterministically rebuilt;
- the parser-compatible contract and comparison identities are frozen;
- a 256-episode paired formal run was launched.

This is **execution state, not a scientific result**. Do not publish BASE-vs-SD outcome claims until the authoritative reconciliation/analysis/closeout exists. Before using “current”, “running”, “next”, or “completed”, refresh the actual upstream branch/SHA because this state is expected to change.

### WB1

WB1 is a separate fair matched benchmark line (Track B). Its historical train-only evidence must not be rewritten as source-faithful SEED reproduction evidence.

Track A asks whether public SEED code task semantics can be reproduced faithfully. Track B asks for a fair matched comparison under one frozen world and matched budgets. Their evidence may inform the same program, but their claims are not interchangeable.

## 8. Local evidence interaction and claim-level provenance

Each scientific question keeps this pattern:

```text
question
-> short current answer with a minimum observation-to-conclusion bridge
-> optional <details>
   summary: 展开实验依据
   exact observations / counts / confidence intervals / claim boundary
   local evidence references mapped to the observations they support
-> next question
```

Do not replace `展开实验依据` with an abstract phrase such as `证据链与代码回溯` on the Chinese beginner path.

Do not send the reader to a distant bottom Evidence Map to understand a claim they just read.

For highly specific factual observations, a question-level pile of links is not enough if the reader must guess which source proves which row. Prefer local mapping:

```text
specific observation
-> closest primary evidence
```

Examples:

- released parser behavior -> pinned official SEED source lines;
- actual prompt / literal `[action]` output -> raw episode;
- inference transformation claim -> backend source;
- numeric result / uncertainty -> machine analysis/reconciliation;
- task identity / sampling claim -> manifest/builder/preregistration;
- historical engineering discovery -> contemporaneous commit/report.

Keep the page readable: these references belong primarily inside local evidence disclosures, not as a citation wall in the Hero/mainline. Repeating one key source both beside the claim and in a broader evidence grid is acceptable when it improves auditability.

Historical evidence links should be immutable. Use GitHub line anchors only after verifying the actual source lines; do not guess line numbers from memory.

## 9. Before editing this route

Any Agent making a non-trivial change to the Results route must:

1. read this file;
2. read `experiment-result-publication-workflow.md`, `research-explainer-page-standard.md`, and `audience-centered-technical-copy.md`;
3. resolve the latest scientific state from the actual active `mykcs/openevo-experiment` branch/SHA rather than copying an older page sentence or stale current-doc status;
4. write the proposed heading/question sequence before local copy polishing when structure changes;
5. check every English technical term on the Chinese route for a first-use Chinese gloss;
6. check whether exact numbers can move into `展开实验依据`;
7. for every inferential sentence, verify that the visible prose contains the minimum observation that justifies it;
8. for every highly specific observation, verify that the closest primary evidence is locally discoverable without forcing the reader to guess among unrelated links;
9. verify that H1.41 mechanism conclusions, later H1.42 measurement work, the 2026-08-25 held-out comparison, its post-v2 source-semantics audit, the current Track A successor, and WB1 Track B progress are not conflated;
10. for parser/model-output attribution, separately resolve official contract, actual prompt, raw output, backend transformations, training-data path, and harness behavior before assigning responsibility;
11. run reader-voice/scientific-boundary tests and inspect the exact-head Preview.

If new experiment evidence changes the answer to Q7, update the answer and this file's latest-state section in the same coherent change. If an experiment merely starts running, update only the execution-state wording; do not invent its result.
