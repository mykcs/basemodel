# Audience-centered technical copy standard

Status: current design and writing contract
Audience: product, design, content, research, and implementation Agents
Applies to: Basemodel public pages, SEED/OpenEvo research pages, reproduction guides, explanatory callouts, troubleshooting text, and user-facing status language

## Why this document exists

A technically correct sentence can still be difficult to understand when it starts from project-internal history rather than the reader's situation.

The site is read by:

- the researcher currently running the experiment;
- students trying to reproduce the work on their own machines;
- colleagues who know the project exists but do not know its implementation history;
- Agent practitioners who understand parts of the stack but may not know this laboratory's topology, scripts, names, or previous failures.

These readers do not share the conversation, incident log, or assumptions that produced the current implementation. Public copy must supply the missing context before it states a warning or conclusion.

## Core rule

For user-facing technical explanations, use this order:

```text
common reader situation
→ practical constraint
→ why the constraint matters
→ what this project does
→ what the reader should do next
```

Do not begin with a correction such as “不要混淆……”, “不要再……”, or “当前不再……” unless the preceding sentence has already explained who might make that mistake and why.

## Canonical example

Avoid:

> 不要把“Mac 有公网”和“RTX6 有公网”混在一起。

This sentence assumes the reader already knows why the Mac and RTX6 are being discussed, that they are different machines, and that network access caused previous failures.

Prefer:

> 复现这类实验时，学生通常会有一台可以访问公网的个人电脑或实验室工作站，同时使用一台位于实验室内网的 GPU 服务器。GPU 服务器主要承担计算任务，可能无法直接访问外网。本项目中，实验室 Mac 负责获取和缓存代码、模型、数据与离线依赖，再通过 SSH / rsync 把同一份实验材料同步到 RTX6；RTX6 负责运行 GPU 实验。

The revised version establishes the general situation first, then explains this project's concrete topology.

## 1. Reader context before project shorthand

Before using a project-specific machine, service, script, status, or acronym, answer the question a new reader will silently ask:

> Why is this object here?

Examples:

- Before `RTX6`, explain that it is a shared laboratory GPU server on an internal network.
- Before `Mac relay`, explain that a workstation may have internet access while the compute server does not.
- Before `P0`, state the scientific claim that P0 is designed to prove.
- Before `snapshot`, explain that ordinary Git transport or worktree ownership may be unreliable in this environment.
- Before `wheelhouse`, explain that the server needs a repeatable offline dependency bundle.

A label is not an explanation.

## 2. Practical consequence before abstract mechanism

Lead with what changes for the reader, then explain the mechanism.

Prefer:

> 三份 JSON 只证明原始数据存在。还要打开 Lucene 索引并完成一次查询，才能确认 WebShop 搜索链可用。

Over:

> JSON 数据存在还不够，pipeline 必须验证 LuceneSearcher。

The first version explains the evidence gap before naming the technical check.

## 3. Use positive descriptions for the main path

The main path should describe what to do and why. Negative language belongs in safety rules or optional troubleshooting.

Prefer headings such as:

- `用可验证的源码快照避免分支和网络差异`
- `从固定来源下载并长期缓存`
- `先建立最小科学运行环境`
- `分开记录四种结论`

Avoid using these as default section headings:

- `不要把 git clone 当成必需步骤`
- `不要依赖 Hugging Face`
- `P0 不是基础设施展示`
- `P1 / P2 / P3 不要混写`

Safety-critical warnings may use direct prohibitions after the shared context is clear. For example, on a shared GPU server it is appropriate to say not to kill or reset another researcher's process.

## 4. Remove conversation-dependent words

Words such as the following often reveal that public copy was written from an internal debugging conversation:

- 当前
- 仍然
- 之前
- 又
- 重新
- 这就是我们踩过的坑
- 正确修法
- 不要再

They are not forbidden, but each one needs an explicit reference point.

Ask:

- Current relative to which release, run, or date?
- Still true after which earlier state?
- Previous in which documented experiment?
- Correct for which failure signature and environment?

When the reference point is not useful to a new reader, remove the conversational word and state the durable rule directly.

## 5. Translate mixed jargon at first use

The site can retain precise English technical terms, but the surrounding sentence must explain their role.

Examples:

- `artifact` — a versioned output produced by an evolution method;
- `successor revision` — the accepted context/model/adapter state used by a later task;
- `fallback action` — a predefined safe action used when the model output cannot be executed;
- `exact snapshot` — source content tied to one commit SHA rather than a moving branch;
- `wheelhouse` — a local directory containing installable dependency packages for an offline machine.

Do not replace all terminology with vague Chinese. Explain the term once, then use it consistently.

## 6. Separate public guidance from incident history

The public success path answers:

```text
What do I have?
What do I need?
What command do I run?
What output should I see?
What does that output prove?
```

Incident history answers:

```text
What failed before?
How was it diagnosed?
What rule prevents recurrence?
```

Keep incident history in `<details>/<summary>`, troubleshooting sections, or Agent documents. A first-time reader should be able to complete the main path without reading the project's chronology.

Troubleshooting entries should use:

```text
common context
→ visible symptom
→ likely failure layer
→ smallest safe check
→ fix
```

Do not write them as fragments from a chat transcript.

## 7. Explain evidence boundaries in ordinary language

When using a claim ladder, state both what an event proves and what it does not prove.

Examples:

- A clean process exit proves the program ended; it does not prove the task succeeded.
- Environment reset proves the benchmark can start; it does not prove the model produced a real action.
- A numeric reward of `0.0` can come from a real run; it does not prove a performance improvement.
- Historical Kaggle/Colab success can identify a golden environment; it does not prove the current RTX6 run completed.
- A working vLLM/gateway/Docker path proves infrastructure availability; it is separate from the scientific P0 claim.

Prefer complete causal sentences over slogans such as “X ≠ Y” when the audience may not yet know either side.

## 8. Audience-centered copy review pass

Before merging a user-facing technical page, review every heading, introductory paragraph, callout, and troubleshooting summary with these questions:

1. Can a colleague who only knows the project goal understand why this paragraph appears here?
2. Does the sentence identify the person, machine, or experimental situation before giving a warning?
3. Does “current / previous / still / again” have a visible reference point?
4. Is the practical consequence stated before low-level implementation detail?
5. Is the first use of each project-specific term explained?
6. Is a negative instruction necessary for safety, or can the main path be phrased positively?
7. Has internal incident chronology been moved out of the default reading path?
8. Does each pass/fail statement say what evidence it relies on?
9. Does the English version preserve the same explanation rather than translating the shorthand literally?
10. Could a reader follow the page without access to the original chat or Agent handoff?

Run `npm run audit:copy` before this contextual review. It reports file, line, rule ID, snippet, and reason across public source owners. Candidate output is advisory; `npm run audit:copy:strict` blocks only the small set of repository-approved high-confidence invariants and is included in `verify:deploy`.

## 9. HTML presentation rules

Use the medium to make context visible:

- Use `<figure>` for machine and data-flow topology, with a caption explaining why the machines have different responsibilities.
- Use ordered lists for required execution order.
- Use `<dl>` for term definitions and claim levels.
- Use `<details>` for optional incident history and troubleshooting.
- Place expected output next to the command that produces it.
- Put safety warnings beside the shared resource they protect.
- Use diagrams to show boundaries, not decorative movement.

A visual cannot repair missing prose. The diagram and its introduction must tell the same causal story.

## 10. Repository placement and build-cost rule

This standard lives under:

`docs/agents/current/`

Keep future changes to the writing standard in this documentation path. Do not modify `.github/`, build scripts, package files, or `src/` merely to revise the standard itself.

For changes that affect both runtime copy and the standard:

1. batch all Astro/user-facing copy edits into one runtime commit and validate that exact head once;
2. make the durable writing-standard update as a separate docs-only commit;
3. do not request another Preview solely for the docs-only commit;
4. preserve the repository's Build Watch / ignored-build behavior for documentation paths.

On this project, prior docs-only commits have been skipped by the Vercel Preview path. Treat that as a deployment optimization, not as permission to skip source review of the document.

## 11. Ownership

This document is the general copy contract. More specific documents may add constraints but should not weaken it:

- `reproduction-guide-design-principles.md`
- `seed-openevo-research-mission-first-principles.md`
- `openevo-reproduction-research-page.md`
- `sitewide-visual-knowledge-architecture.md`

When a public sentence feels technically correct but strangely abrupt, use this document before making a grammar-only edit. Rewrite the causal explanation from the reader's starting point.
