# Audience-centered copy audit — 2026-08-12

Status: source-level audit baseline for PR #128
Branch reviewed: `agent/seed-openevo-research-mission`
Primary standard: `audience-centered-technical-copy.md`

## Executive conclusion

The site has **not** undergone a literal sentence-by-sentence rewrite of every user-facing source.

The completed rewrite covers the highest-priority new research surfaces and the OpenEvo reproduction manual. Existing shared Guide, SEED onboarding, model-explorer, route-context, pricing, and structured content sources still contain a mixture of:

- copy that already satisfies the standard;
- direct warnings that are justified by nearby safety/evidence context;
- negative-first or project-internal copy that should be improved in a later sitewide copy pass.

Do not describe PR #128 as “all website text rewritten.” Describe it as:

> the first audience-centered rewrite of the SEED × OpenEvo mission and reproduction path, plus a source-level audit baseline for the remaining site.

## Audit scope

The audit reviewed source templates rather than attempting to inspect 408 generated HTML files independently. Shared templates and structured content generate most repeated copy.

Reviewed surfaces:

- mission-first home and navigation;
- SEED × OpenEvo research pages;
- OpenEvo × WebShop / ALFWorld reproduction guide;
- Guide content and decision chapters;
- Agent primer;
- SEED student reproduction guide;
- SEED compute/time-budget explanation;
- sitewide SEED use-case strip;
- sitewide research-mainline context;
- model explorer decision copy;
- core Chinese UI dictionary;
- research-workbench structured guide content.

Not exhaustively rewritten in this pass:

- every model and paper record description;
- every error message and empty state in all React islands;
- every historical document;
- every English sentence outside the changed mission/reproduction surfaces;
- every generated page considered as an independent artifact.

## Completed / strong surfaces

### OpenEvo reproduction manual

The manual now establishes the common student/lab topology before naming the Mac and RTX6, explains technical terms at first use, places incident history behind `<details>`, and separates P0/P1/P2/P3 claims.

### Mission-first research pages

The new pages start from the research question, then introduce Base Model, SEED, OpenEvo, benchmarks, loops, and evidence. Their copy generally supplies the object and purpose before the warning or boundary.

### Evidence-language boundaries

The new pages explain in complete sentences why:

- a successful process exit is not task success;
- environment readiness is not a real model action;
- a real action is not real evolution;
- a numeric `0.0` can be real evidence without proving performance improvement;
- historical notebook evidence is not current RTX6 evidence.

## Remaining high-priority copy risks

### 1. `SeedUseCaseStrip.astro`

Risk:

- appears across multiple general routes;
- assumes the reader is already inside a 4×3090 SEED experiment;
- uses directive phrases such as “现在只问”, “不用来改今天的实验”, and “机器能做完就到此为止”.

Recommended change:

- begin with one sentence explaining that the strip shows how the current page contributes to the site's SEED/OpenEvo research mission;
- replace imperative wording with route-purpose wording;
- keep the concrete 4×3090 case as an example, not an unexplained universal context.

### 2. `ResearchMainline.astro`

Risk:

- generic pages can show highly specific instructions such as `4×24GB、离线、本地权重` without first identifying the example experiment;
- fallback copy says “不要被页面里的其他信息带走”, which reads like an internal coaching instruction.

Recommended change:

- label the active experiment context explicitly;
- state what information the page contributes, then link back to the mission;
- use positive navigation language rather than controlling the reader.

### 3. `GuideDecisionChapters.astro`

Risk:

- the heading “不要背术语” is negative-first;
- the OpenEvo card foregrounds the “真实故障复盘” instead of the reader's execution goal.

Recommended change:

- use “按四个研究决定理解术语”;
- describe the OpenEvo card as an execution guide with optional known-failure diagnostics.

### 4. `GuideContent.astro`

Risk:

- several titles use “不要先……” or “遇到 unknown 时……” as the first explanation;
- copy is understandable in context, but it remains instructor-centric rather than reader-situation-first.

Recommended change:

- rewrite section titles as positive decisions;
- preserve the warnings in the body after the reader's task is established.

### 5. `AgentPrimer.astro`

Risk:

- most of the primer is strong and contextual;
- the final heading “不要先浏览所有模型” is an unnecessary negative-first instruction.

Recommended change:

- replace with “把概念按论文 → checkpoint → 工作台的顺序落到真实证据”.

## Remaining medium-priority copy risks

### `SeedStudentReproductionGuide.astro`

Most warnings are tied to commands and pass criteria, which is appropriate. The opening assumes a specific offline server. A later pass should generalize the first paragraph to “workstation with internet + internal GPU server” before narrowing to this lab's setup.

### `SeedComputeTimeBudget.astro`

The page contains direct warnings such as not multiplying monthly SKU hours into a fake payable amount. These are justified because the pricing context appears immediately before the warning. The main risk is tone (“把能算死的东西算死”), which is colloquial but not structurally confusing.

### `ModelExplorer.tsx`

The warning that hosted/API models should not be mixed with trainable open-weight models is supported by the surrounding category explanation. It is a valid classification boundary, not an abrupt incident fragment.

### `research-workbench.json`

Most concepts use complete causal explanations. A few sentences remain negative-first, for example “不要把可调用写成可复现”; these are lower priority because the preceding sentence explains API/weight/license distinctions.

## Direct warnings that should remain

The standard does not ban the word “不要”. Keep direct prohibitions when the context and protected resource are explicit:

- do not kill or reset another researcher's GPU process;
- do not present a monthly SKU time estimate as an hourly payable amount;
- do not jump to the next experiment stage when the current gate lacks evidence;
- do not fill an unknown field with a plausible value;
- do not call a fallback-only trajectory a real model action.

These statements protect safety or research integrity and are understandable from nearby context.

## Sustainability assessment

### Current state: medium sustainability

Strengths:

- a durable copy standard exists;
- the standard names the actual audiences;
- the standard includes a review checklist and HTML guidance;
- the OpenEvo manual demonstrates the target style;
- docs-only standards are ignored by the Preview build path.

Weaknesses:

- the standard is not yet an executable lint/gate;
- not every future Agent is guaranteed to open the file unless the task routing explicitly points to it;
- heuristic word searches can identify candidates but cannot determine whether a warning has sufficient context;
- existing shared copy predates the standard.

### Target state: high sustainability

Use four layers:

1. **Discoverability** — user-facing writing tasks must route to `audience-centered-technical-copy.md`.
2. **Author checklist** — every changed heading, introduction, callout, empty state, error message, and troubleshooting summary gets the ten-question review.
3. **Heuristic audit** — a manual source scanner reports negative-first phrases, unexplained project nouns, conversation-dependent time words, and mixed jargon. It reports candidates; it does not auto-fail every match.
4. **Human/Agent contextual review** — inspect each candidate in the actual paragraph and decide whether it is a valid safety/evidence warning or an unexplained internal fragment.

A purely automatic ban on words such as `不要`, `当前`, or `仍然` would damage valid safety and evidence language. Automation should produce a review queue, not replace semantic judgment.

## Recommended next implementation

Do not spend another Preview build only to add governance.

In a later intentionally batched runtime pass:

- rewrite the five high-priority shared components above;
- add a lightweight manually invoked copy-audit script;
- run it locally or in an existing validation session;
- do not add a new always-on CI job merely for prose linting;
- update the exact-head Preview only after the batched runtime rewrite is ready for visual review.

Until that pass, completion reports must state that the new mission/reproduction surfaces meet the standard while the rest of the site has an audited improvement backlog.