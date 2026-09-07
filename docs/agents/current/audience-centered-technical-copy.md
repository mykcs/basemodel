# Audience-centered technical copy standard

Last reviewed: **2026-09-07**
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


## First-screen attention contract

**First identify the object; then summarize the experiment. 首屏先认对象，再回答实验做了什么。**

For a research or experiment overview, the first screen should normally resolve this order:

```text
H1: stable subject + object type when a first-time reader may not know it
source/resource row: comparison target, paper, training/run links
TL;DR: what was run or compared + what is currently known + the main claim boundary
background: link to the canonical explainer when that background already exists elsewhere
```

Good first-screen identity is explicit enough for a new reader: `OpenEVO (Harness) · WebShop 数据集实验` tells the reader what OpenEVO is and what WebShop is before introducing the SEED comparison. A relation such as `OpenEvo × SEED` is not a substitute for identifying either object. The same identity should survive the global entry label and local research navigation, so the reader does not receive an older relationship-first name before reaching the H1.

**Canonical background belongs behind a link when the overview would otherwise repeat it.** If the site already has one maintained explainer for OpenEVO, SEED, WebShop, or the shared flow, the experiment overview should link there instead of spending the first screen teaching the same background again.

A TL;DR is not a second abstract slogan. It must say, in ordinary language, what the experiment did or is designed to compare and what the evidence currently allows the reader to conclude.

Presenter phrases such as `怎样连起来`, `怎么读`, `如何阅读`, or `先 A，再 B` belong in body copy when they express explanation or sequencing. Use the heading to name the object: `三个研究问题`, `未知状态`, `结果判定`, `复现协议`. Genuine scientific research questions may still be written as questions.

## 1. Concrete language still matters

Normal headings do **not** mean vague headings. Prefer a specific subject over abstract packaging:

- Prefer `Phase G WebShop 对比` over `当前声明边界`.
- Prefer `Run Manifest 与 W&B` over `可复现与可观察，但不能污染科学变量`.
- Prefer `参数训练闭环` over `先看“训练”到底发生了什么`.
- Prefer `公平比较协议` over `先冻结协议，再比较框架`.

Buttons and action links should still say what they do: `查看实验结果`, `打开复现指南`, `比较模型`, `保存实验记录`.

### First-reader comparisons name both sides before the statistical design

A comparison label should first tell the reader **who is compared and on what shared object**. Do not replace an internal project code with a statistical term that still requires prior knowledge.

- Prefer two explicit rows — `7B · 基础模型` and `7B · 使用 OpenEVO 学习结果` — over `OpenEVO · 7B 配对评测`.
- Show each score beside its actual object, then explain that both rows used the same 128 WebShop tasks and evaluation. Only after that, if useful, explain that task-level outcomes can be paired one by one.
- Terms such as `paired evaluation`, `matched panel`, `paired CI`, or route names belong in the methodological/provenance layer unless the surrounding text already defines them.

### 1.1 Prefer the literal experimental operation over a narrative metaphor

When the experiment simply ran two models separately, say that directly. Do not upgrade the relationship into `分岔 / 分叉 / fork / diverge` unless a real shared state is deliberately split and that topology matters to the scientific interpretation.

Prefer:

- `我们分别用 7B 和 3B 模型做了 WebShop 实验`;
- `从同一 checkpoint 分成 SEED 与 OpenEvo 两组` when a shared checkpoint is actually split.

Avoid using `分岔`, `路径分叉`, `核心分叉问题`, or `design fork` merely to make a research page sound like a story. The reader should spend attention on the experimental object, not on decoding an invented metaphor.

Eyebrows and kickers are optional. Keep one only when it adds phase, date, status, category, or provenance information that the heading does not already provide. On a Chinese surface, a decorative all-English uppercase eyebrow such as `HISTORICAL MAP · FIRST RUN` or `ROGUELIKE RESEARCH MAP · EXPLORATION` should be removed; if the label is scientifically necessary, provide the Chinese meaning first.

## 2. Separate subject, snapshot, live state, and interpretation

For fast-moving experiment pages, use distinct visual levels:

```text
heading: stable subject
historical milestone: dated completed phase/result
snapshot: branch-labelled + checked date
live-state source: actual branch -> campaign -> reconciliation/result
body: interpretation and claim boundary
```

Example:

```text
H2: OpenEvo × WebShop 实验
historical: Phase G · 2026-08-14 · 12 episodes · zero score/win across three arms
snapshot: openevo-experiment/main · checked 2026-08-18 · H1.27 · completed-descriptive-only
live state: resolve the actual experiment branch, current-campaign.json, then latest reconciliation/result
```

Do not turn the interpretation itself into the largest heading. Do not label a dated snapshot simply `Current phase`.

## 3. Hardware chronology and authority must be explicit

Project hardware names are not universal prerequisites and must carry their role in time and authority.

Keep these concepts separate:

```text
historical platform
server inventory / visible devices
experiment allocation
GPU authorization
live idle capacity
```

Stable examples:

- **historical platform:** `RTX6 / 4×RTX3090` when discussing migrated evidence;
- **inventory snapshot:** a dated audit may report 8 visible RTX 5090 GPUs when supported by the server evidence;
- **historical allocation:** a prior campaign may record `5×RTX5090` when explicitly labelled historical;
- **live allocation/authorization:** must come from the current parent execution policy + active preregistration + explicitly authorized GPU UUIDs + live-idle checks.

`seed3090` and `openevo-webshop` are historical/provenance sources. `openevo-experiment` owns scientific state. The private laboratory infrastructure repository owns live server/resource policy.

Never promote a prior allocation into an undated `current allocation` sentence merely because an older page or test contained it.

## 4. Reader context before project shorthand

Before using a project-specific machine, service, script, phase, or artifact, explain its role once. Examples:

- `Run Manifest` — the local record that pins experiment identity and inputs;
- `artifact` — a versioned output produced by an evolution method;
- `successor revision` — the accepted state used by a later task;
- `fallback action` — a predefined action used when model output cannot be executed;
- `Phase H0` — a historical Natural Success Search stage that followed the bounded Phase G comparison; do not use the term alone to imply the live campaign is still H0.

After first-use explanation, use the precise technical term consistently instead of replacing it with vague prose.


### Internal route names are provenance, not reader-facing identities

Names such as `Track A`, `Track B`, `WB1`, `H1.42`, or a branch nickname may be useful for repository lineage, but they must not be the first identity a public label gives the reader.

Bad first-reader label: `OpenEvo · Track A 7B`.

Preferred first-reader presentation: show `7B · 基础模型` and `7B · 使用 OpenEVO 学习结果` as explicit comparison rows. If a compact label is unavoidable, name both concrete sides before any route or statistical term.

If the internal alias matters for auditability, introduce it only after the concrete object, for example `源码忠实任务测量路线（内部代号 Track A）`. A table row, H1/H2/H3, TL;DR, or first-screen result label must name the actual model / comparison / measurement before the project code.

### Zero-context incident entry and causal context

A technically clear paragraph can still fail if it assumes the reader already knows the project. For research incidents, parser failures, attribution, or responsibility analysis, assume a first-time reader knows **none** of the phase names, model arms, artifact names, or experiment shorthand.

Use this order:

```text
what experiment are we running and why
-> what model/task/intervention/comparison does the reader need to know
-> what concrete incident happened
-> what alternative explanations are plausible
-> what evidence rules each explanation in or out
-> only then name the technical mechanism and responsibility boundary
```

Before attributing an error to model capability, training, adapter behavior, or the harness, provide enough setup for the reader to judge those hypotheses. When relevant, include:

- model family and scale;
- whether the observed example loaded an adapter;
- which exact frozen adapter/artifact was used in the formal comparison;
- training-data scale: records, task identities, and independent rollouts;
- update scale: increments/generations, epochs, and optimizer-step limits;
- evaluation scale: tasks, arms, seeds/rollouts, and total episodes.

Do not present these numbers as decoration. Their job is to let the reader evaluate natural hypotheses such as “the model is too small,” “training was too weak,” or “training caused the formatting error.” Label those as hypotheses until the evidence supports them.

For lineage-sensitive claims, resolve the exact artifact before writing. A nearby historical run may explain prior knowledge without being the artifact used in the later formal evaluation. Keep `origin`, `frequency/effect`, `historical knowledge`, and `formal integration responsibility` as separate claims.

When the user’s wording points to the right narrative but names the wrong experimental stage, preserve the narrative intent while choosing the scientifically correct stage label. Explain the distinction in the technical layer rather than forcing the reader through it at the top.

## 5. Current scientific claims must be delegated, not copied

For OpenEvo × WebShop, the public site is a presentation layer. It does not own live experiment state.

Resolve live state from:

```text
actual openevo-experiment checkout / branch / SHA
-> configs/experiment/current-campaign.json on that branch
-> latest valid reconciliation / result for that campaign or successor
```

An active scientific branch may intentionally be ahead of default `main`.

The public site may preserve dated history, for example:

- Phase D–F mechanism evidence;
- Phase G’s 12 formal promotion-dev episodes and all-zero bounded outcome;
- H0 and later H1.x diagnostics as dated milestones.

It may also display a **dated default-branch snapshot** when useful. The snapshot must say which branch was checked and when. It must not become an undated “current phase”.

See `scientific-state-provenance.md` for the full contract.

## 6. Positive main path; warnings after context

The main reading path should state the object, method, and next action positively. Safety or research-integrity prohibitions can be direct after the protected object and consequence are clear.

Avoid using `不要…`, `不是…`, `不能…`, or incident-history corrections as section titles unless the page is explicitly a warning/error surface.

## 7. Remove conversation-dependent language

Words such as `当前`, `之前`, `又`, `重新`, `这次`, and `正确修法` require a visible reference point. Prefer dates, phase names, repository roles, branch/SHA identity, or experiment IDs when chronology matters.

Incident history belongs in historical sections, provenance notes, or `<details>` rather than the first screen.

For a moving scientific program, `当前` is acceptable only when the page also makes the authority and freshness visible, or when it links the reader to the live-state source rather than embedding an unversioned value.

## 8. Evidence boundaries in ordinary language

State what evidence supports without making the boundary itself a theatrical headline.

Examples:

- A clean process exit shows the program ended; task success requires task metrics.
- A real parameter digest change shows an update occurred; it does not establish reward improvement.
- Phase G’s all-zero task outcomes show no measured advantage in that bounded matrix; they do not erase the separate Phase D–F mechanism evidence.
- RTX6 results remain useful historical evidence; they do not define the live 5090 experiment state.
- A default-main H1.27 snapshot proves what `main` recorded at its checked date; it does not prove a newer active scientific branch has not advanced.
- Visible GPU inventory does not prove allocation, authorization, or idle capacity.

## 9. Sitewide review checklist

Before publishing user-facing copy, inspect every H1/H2/H3 and the first paragraph under it:

1. Does the heading name the subject directly?
2. Is it short enough to scan in navigation and on mobile?
3. Is an explanatory sentence masquerading as a heading?
4. Is a disclaimer, reading rule, chronology note, or claim boundary visually louder than the subject?
5. Does the body explain technical terms at first use?
6. Do buttons describe the action they perform?
7. Does hardware say whether it is historical, inventory, allocation, authorization, or reader example?
8. If copy says `current`, `active`, `next`, or `now`, did you resolve the actual experiment branch/campaign/reconciliation rather than copy an older static page?
9. If a default-branch snapshot is shown, are branch and checked date visible?
10. Are Chinese and English versions equivalent in meaning and hierarchy?
11. Could a reader understand the page without the originating chat?
12. If the section explains an incident, could a reader first state the experiment in one sentence before encountering the incident name?
13. Before causal attribution, have you supplied the model/training/evaluation context needed to judge the obvious alternatives?
14. Did you resolve the exact artifact lineage rather than borrow settings from a nearby historical experiment?
15. On a first-time entry page, does H1 identify unfamiliar object types before relationships between them?
16. Does the first-screen TL;DR say what the experiment did / compares and the current evidence boundary, rather than repeat benchmark background?
17. If a canonical explainer already owns the background, does this page link to it instead of teaching it again?
18. Does any `fork / 分叉 / 分岔 / diverge` wording describe a real experimental split that matters scientifically, or is it only narrative packaging?
19. Does every eyebrow/kicker add a real phase/date/status/category/provenance fact, and is a Chinese surface free of decorative English-only eyebrow text?

Run `npm run audit:copy` for the review queue and `npm run audit:copy:strict` for repository-approved invariants. `npm run verify:deploy` includes the strict copy gate and unit tests.

## 10. HTML presentation

- H1: page subject only.
- H2: major subject within the page.
- H3: subsection/object name.
- Eyebrow/kicker: optional; use only for phase, date, category, status, or provenance that adds information beyond the heading.
- Paragraph: interpretation, caveat, explanation, or chronology.
- `<dl>` / compact facts: configuration and status values.
- `<details>`: optional incident history and troubleshooting.
- Diagrams: boundaries and flows, not decorative slogans.

A visual cannot repair a bad information hierarchy. If a sentence is valuable but not a section subject, keep it as prose instead of making it bigger.
