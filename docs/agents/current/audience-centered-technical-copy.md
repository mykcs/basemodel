# Audience-centered technical copy standard

Status: current design and writing contract
Audience: product, design, content, research, and implementation Agents
Applies to: Basemodel public pages, SEED/OpenEvo research pages, reproduction guides, callouts, troubleshooting, and status language

## Core editorial rule

**Headings name the subject. 标题先命名主题。**

A heading is navigation, not a miniature essay, instruction to the reader, disclaimer, or explanation of how the page should be interpreted. H1/H2/H3 should normally be short noun phrases or stable topic names such as:

- `ALFWorld 与 WebShop 研究`
- `实验结果与证据`
- `SEED 训练阶段`
- `OpenEvo 演化载体`
- `WebShop 与 ALFWorld 数据流`
- `方法摘要`
- `模型角色`
- `数据来源与缺失信息`

Put the explanatory sentence immediately below the heading. Put the action in a button, link, checklist item, or body sentence when an action is actually needed.

Avoid promoting editorial instructions into headings, for example:

- `把“曾经成功”“当前准备好”“现在测得结果”分开`
- `先用一段话看懂方法`
- `这些模型在论文里分别负责什么`
- `先做 A，再做 B，最后比较 C`
- `真正重要的不是 X，而是 Y`
- `为什么我们现在要……`

These can be useful explanations, but they should not visually outrank the subject itself.

## 1. Concrete language still matters

Normal headings do **not** mean vague headings. Prefer a specific subject over abstract packaging:

- Prefer `Phase G WebShop 对比` over `当前声明边界`.
- Prefer `Run Manifest 与 W&B` over `可复现与可观察，但不能污染科学变量`.
- Prefer `参数训练闭环` over `先看“训练”到底发生了什么`.
- Prefer `公平比较协议` over `先冻结协议，再比较框架`.

Buttons and action links should still say what they do: `查看实验结果`, `打开复现指南`, `比较模型`, `保存实验记录`.

## 2. Separate subject, status, and interpretation

For experiment pages, use three visual levels:

```text
heading: stable subject
status label / compact fact: current phase, date, hardware, result
body paragraph: interpretation and claim boundary
```

Example:

```text
H2: 当前实验进展
status: Phase H0 · 5×RTX5090
body: Phase G completed 12 WebShop episodes; all three arms had zero score/win outcomes. Phase D–F still provides independent mechanism evidence.
```

Do not turn the interpretation itself into the largest heading.

## 3. Hardware chronology must be explicit

Project hardware names are not universal prerequisites and must carry their role in time.

Current project state (2026-08-14):

- **current experiment allocation:** `5×RTX5090` on the OpenEvo server;
- **server inventory fact:** the server record shows `8×RTX5090` visible; visible inventory is not the same as experiment allocation;
- **historical platform:** `RTX6 / 4×RTX3090`;
- `seed3090` and `openevo-webshop` are historical/provenance sources;
- `openevo-experiment` is the active experimental source of truth.

A historical hardware fact can remain on a page when it explains provenance, but it must not read as the current experiment configuration.

## 4. Reader context before project shorthand

Before using a project-specific machine, service, script, phase, or artifact, explain its role once. Examples:

- `Run Manifest` — the local record that pins experiment identity and inputs;
- `artifact` — a versioned output produced by an evolution method;
- `successor revision` — the accepted state used by a later task;
- `fallback action` — a predefined action used when model output cannot be executed;
- `Phase H0` — the Natural Success Search after the bounded Phase G comparison.

After first-use explanation, use the precise technical term consistently instead of replacing it with vague prose.

## 5. Current results must use dated evidence

Do not describe a preparation gate as current after the experiment has advanced.

For the OpenEvo × WebShop line on 2026-08-14:

- Phase D–F: real model generation, SD-LoRA optimizer steps, adapter reload, cumulative state, and nonzero model-output changes are mechanism evidence.
- Phase G: 12 formal promotion-dev episodes completed across `base`, `adapter1x`, and `cumulative`; all three arms measured `0.000` mean score and `0/4` wins in the bounded matrix.
- Phase H0: search for natural successful trajectories on new train-only WebShop tasks before learner hyperparameter sweeps.

The public page may explain what these results do and do not prove, but that interpretation belongs under a normal result heading.

## 6. Positive main path; warnings after context

The main reading path should state the object, method, and next action positively. Safety or research-integrity prohibitions can be direct after the protected object and consequence are clear.

Avoid using `不要…`, `不是…`, `不能…`, or incident-history corrections as section titles unless the page is explicitly a warning/error surface.

## 7. Remove conversation-dependent language

Words such as `当前`, `之前`, `又`, `重新`, `这次`, and `正确修法` require a visible reference point. Prefer dates, phase names, repository roles, or experiment IDs when chronology matters.

Incident history belongs in historical sections, provenance notes, or `<details>` rather than the first screen.

## 8. Evidence boundaries in ordinary language

State what evidence supports without making the boundary itself a theatrical headline.

Examples:

- A clean process exit shows the program ended; task success requires task metrics.
- A real parameter digest change shows an update occurred; it does not establish reward improvement.
- Phase G’s all-zero task outcomes show no measured advantage in that bounded matrix; they do not erase the separate Phase D–F mechanism evidence.
- RTX6 results remain useful historical evidence; they are not the current 5×RTX5090 experiment state.

## 9. Sitewide review checklist

Before publishing user-facing copy, inspect every H1/H2/H3 and the first paragraph under it:

1. Does the heading name the subject directly?
2. Is it short enough to scan in navigation and on mobile?
3. Is an explanatory sentence masquerading as a heading?
4. Is a disclaimer, reading rule, chronology note, or claim boundary visually louder than the subject?
5. Does the body explain technical terms at first use?
6. Do buttons describe the action they perform?
7. Does hardware say whether it is current allocation, visible inventory, historical, or a reader example?
8. Does current experiment status match the latest source-of-truth repository?
9. Are Chinese and English versions equivalent in meaning and hierarchy?
10. Could a reader understand the page without the originating chat?

Run `npm run audit:copy` for the review queue and `npm run audit:copy:strict` for repository-approved invariants. `npm run verify:deploy` includes the strict copy gate and unit tests.

## 10. HTML presentation

- H1: page subject only.
- H2: major subject within the page.
- H3: subsection/object name.
- Eyebrow/kicker: phase, date, category, status, or provenance label.
- Paragraph: interpretation, caveat, explanation, or chronology.
- `<dl>` / compact facts: configuration and status values.
- `<details>`: optional incident history and troubleshooting.
- Diagrams: boundaries and flows, not decorative slogans.

A visual cannot repair a bad information hierarchy. If a sentence is valuable but not a section subject, keep it as prose instead of making it bigger.
