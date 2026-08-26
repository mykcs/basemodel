# SEED × OpenEvo Results reader contract

Last reviewed: **2026-08-26**
Status: **current and mandatory for the SEED × OpenEvo Results route**
Applies to:
- `src/pages/research/seed-openevo/results.astro`
- `src/pages/en/research/seed-openevo/results.astro`
- every mounted `OpenEvoWebShopResults*` component
- tests that protect this route's reader voice, scientific boundaries, evidence interaction, or narrative order

This file specializes, and does not replace, `experiment-result-publication-workflow.md`, `audience-centered-technical-copy.md`, `research-explainer-page-standard.md`, and `scientific-state-provenance.md`.

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

### 6.1 Technical-depth placement rule

The amount of detail does **not** determine hierarchy. A long, important, code-backed investigation can still belong below the main reader path.

Use this decision rule:

```text
does this material change the default reader's scientific answer, comparison, or next decision?
  yes -> it may deserve visible/mainline placement
  no  -> keep the answer visible and move the forensic depth into progressive disclosure
```

For Results, prefer this stack:

```text
question
-> visible answer + minimum reasoning bridge
-> local <details> for exact evidence tied to that answer
-> optional collapsed technical trace for full chronology / responsibility analysis
```

A forensic trace should not become a major H2/H3 navigation destination merely because it contains many source links. If it exists to explain **how** one answer was measured, debugged, or attributed, it is usually secondary depth.

When a full responsibility chain is useful, organize it chronologically and attach evidence at each step:

```text
upstream official contract
-> our actual runtime prompt
-> raw model output
-> backend transformation boundary
-> contemporaneous commit/report where the issue was known
-> training-data inclusion/exclusion path
-> formal experiment where the mismatch mattered
-> repair and the exact variable changed
```

For the current action-wrapper case, that means SEED prompt/projection -> our saved prompt/raw BASE episode -> no-adapter wrapper drift -> H1.36 report + parser-compat commit -> H1.36 dataset filtering -> PRIMARY-v1 measurement failure -> PRIMARY-v2 compatibility repair.

Keep this trace default-collapsed. It should be discoverable from the relevant Results context, but it should not compete with the seven-question narrative in the page outline or first-reader flow.

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

Keep these evidence layers separate:

- released SEED prompt/parser require `<action>...</action>`;
- the actual saved BASE prompt also asks for `<action>` and does not ask for `[action]`;
- saved no-adapter BASE evidence shows Qwen2.5-7B-Instruct can emit `[action]...` even when the prompt requests angle brackets;
- the inference backend directly decodes generated tokens and does not rewrite `<` into `[`;
- current H1.36 training-pipeline evidence does not support the claim that malformed parser-invalid wrappers were qualified self-evolution supervision;
- the experiment-integration failure was that known model-output drift was not preflighted against the formal SEED parser before PRIMARY-v1.

Do not simplify this into “OpenEvo wrote `[action]`”, “SEED parser had a bug”, “SD-LoRA taught `[action]`”, or a claim about a specific human author. Repository evidence does not identify the upstream Qwen pretraining/SFT example that caused the habit, and it does not prove that SD-LoRA could never affect wrapper frequency.

### Post-v2 source-semantics audit and source-faithful successor

The historical 128-task panel matched the `goal_idx 0-499` held-out range, but a later audit against pinned SEED public code found that this is not enough for a source-faithful first-validation reproduction.

Pinned public-code semantics use:
- validation base seed `1000`;
- ordered session draw `np.random.RandomState(1000).choice(np.arange(500), size=128, replace=False)`;
- worker seed `1000 + slot`;
- worker-specific goal ordering before `reset(session=N)`.

Because worker seed changes goal ordering, the numeric session index alone is not a complete task identity. The historical panel therefore remains valid as a frozen SEED-compatible local panel, but it must not be relabelled as the source-faithful first-validation semantic panel.

**Current authority after refreshing `mykcs/openevo-experiment/main`:** successor campaign `20260826-0638-webshop-seed-source-faithful-reproduction` is **PREPARED task-construction evidence, not an executed scientific result**. Its 128-slot semantic manifest has been materialized, and two clean rebuild receipts are `PASS` with identical `manifest_content_sha256`, `manifest_file_sha256`, and `selected_panel_digest`. The frozen preregistration still states `formal_task_consumption_allowed=false`.

The next gate is **server runtime semantic validation 128/128**, followed by a separate activation/release PR before any formal GPU task consumption. BASE / frozen SD-LoRA identities, parser-compatible measurement contract, validation/worker seed schedule, task manifest, and data identity remain frozen.

An older preparation branch, `seed-webshop-pubcode-repro-v1-prep`, briefly carried an `executing-formal-run` state. Do not infer current execution from that branch unless it again becomes current authority and produces sealed evidence. Before using “current”, “running”, “next”, or “completed”, refresh the actual upstream authority branch/SHA rather than copying a stale current-doc snapshot.

This source-faithful panel represents the task semantics of one specified released-code **first validation**. It still does not recover the paper-final 128 denominator behind 89.7 / 78.1%, because the public paper/code do not uniquely identify the final table's validation ordinal and checkpoint.

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
   exact observation / number
   -> claim-local primary evidence reference(s)
   -> question-level evidence package
   -> claim boundary
-> next question
```

The evidence block must answer two different questions without forcing the reader to infer a mapping:

- **Observation-level evidence:** “这一行具体从哪来？”
- **Question-level evidence package:** “这一整个问题还有哪些相关材料？”

It is acceptable for one important source to appear in both places. Do not remove a useful local mapping merely to avoid duplication.

Evidence priority is:

1. **Level A / closest to the fact:** official source code, raw model episode/completion, machine-generated analysis or reconciliation, frozen config/manifest, runtime receipt, immutable artifact or commit;
2. **Level B / contemporaneous record:** experiment report, closeout, audit, preregistration, dated tracking note;
3. **Level C / later human synthesis:** Results.md, website explanation, later program summary.

If Level A directly supports a claim, do not use Level C as its only link. Historical scientific evidence links should be immutable (`blob/<commit SHA>/...`) and source-code links should use exact `#Lx-Ly` anchors when a stable line range is available.

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

Use the shared evidence vocabulary consistently:

- Official code / 官方代码
- Code / 源代码
- Raw episode / 原始回合
- Machine result / 机器结果
- Config / 实验配置
- Manifest / 任务清单
- Commit / 提交记录
- Runtime receipt / 运行凭据
- Preregistration / 预注册
- Audit / 审计
- Human report / 人工报告
- Design / 实验设计
- Historical record / 历史记录

Do not replace `展开实验依据` with an abstract phrase such as `证据链与代码回溯` on the Chinese beginner path.

Do not send the reader to a distant bottom Evidence Map to understand a claim they just read. The Hero remains a reading layer, not a bibliography: if it needs provenance, prefer an in-page anchor rather than a row of external GitHub links. Repeating one key source both beside the claim and in a broader evidence grid is acceptable when it improves auditability.

Historical evidence links should be immutable. Use GitHub line anchors only after verifying the actual source lines; do not guess line numbers from memory.

## 9. Before editing this route

Any Agent making a non-trivial change to the Results route must:

1. read this file;
2. read `experiment-result-publication-workflow.md`, `research-explainer-page-standard.md`, `audience-centered-technical-copy.md`, and `scientific-state-provenance.md`;
3. resolve the latest scientific state from the actual active/current-authority `mykcs/openevo-experiment` branch/SHA rather than copying an older page sentence or stale current-doc status;
4. write the proposed heading/question sequence before local copy polishing when structure changes;
5. check every English technical term on the Chinese route for a first-use Chinese gloss;
6. check whether exact numbers can move into `展开实验依据`;
7. for every inferential sentence, verify that the visible prose contains the minimum observation that justifies it;
8. for every highly specific observation, verify that the closest primary evidence is locally discoverable without forcing the reader to guess among unrelated links;
9. if adding a deep debugging/attribution narrative, decide explicitly whether it changes the default reader's scientific answer; if not, keep it below the seven-question spine as collapsed technical depth and use chronology + local code/commit/experiment evidence;
10. verify that H1.41 mechanism conclusions, later H1.42 measurement work, the 2026-08-25 held-out comparison, its post-v2 source-semantics audit, the current Track A successor, and WB1 Track B progress are not conflated;
11. for parser/model-output attribution, separately resolve official contract, actual prompt, raw output, backend transformations, training-data path, and harness behavior before assigning responsibility;
12. sample at least 20 concrete claims and verify that each can reach the closest available primary evidence in one click from its local evidence block;
13. verify every newly added immutable URL, repository path, and source-code line anchor against the actual file;
14. run the reader-voice/scientific-boundary tests and inspect the exact-head Preview.

If new experiment evidence changes the answer to Q7, update the answer and this file's latest-state section in the same coherent change. If an experiment merely starts running, update only the execution-state wording; do not invent its result.
