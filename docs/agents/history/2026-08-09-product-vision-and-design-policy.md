# Product vision and design policy for agents

Last reviewed: 2026-08-09

This document is the durable product/design counterpart to the deployment and rendering policies. It summarizes the product decisions that should survive individual UI refactors, data backfills, framework upgrades, and future Agent handoffs.

It is intentionally **not** a transcript or a backlog dump. Treat it as the answer to: **what is this product trying to help a researcher accomplish, what interaction model supports that goal, and what regressions must future changes avoid?**

## Product mission

Do not define Basemodel as “a website for browsing foundation-model information.”

The product mission is:

> Given a research task, experimental method, hardware/resource constraints, reproducibility goal, and openness requirements, help an agent researcher narrow the feasible model set and produce a verifiable, reproducible, explainable model-selection rationale.

A shorter operating definition is:

> **Basemodel is a research decision system for understanding models, forming candidates, evaluating tradeoffs, reproducing papers, analyzing model substitutions, and preserving the reasons behind a model choice.**

The primary failure mode to prevent is not “missing one more catalog field.” It is a researcher making a model choice that is wrong, ambiguous, poorly evidenced, or impossible to reproduce later.

## Primary user jobs

A researcher should be able to use the site to answer questions such as:

1. Why did a paper use this model?
2. Was the choice mainly about capability, cost, openness, trainability, historical availability, or another constraint?
3. Which current models are credible replacements?
4. Does replacing the original model invalidate or weaken comparison with the paper?
5. Can the model be downloaded, fine-tuned, used for RL/self-evolution, and redistributed under the relevant license?
6. What hardware/resource assumptions are required for the intended experiment?
7. Which claims are verified, which are unknown, and which primary sources support them?
8. Months later, can the researcher reconstruct why a model was selected and see what underlying facts changed?

## Core product principle: relationships over raw facts

Raw fields are necessary but insufficient. A fact must be translated into its research consequence.

Example:

- weak catalog output: `weights available: false`
- useful research output: `API-only access is unsuitable for experiments that require weight updates, local revision pinning, or self-evolution through training; it may still be appropriate for prompt/tool/memory/evaluation work.`

Future UI and recommendation work should preserve this progression:

```text
research conclusion
  -> reasons / satisfied and unsatisfied constraints
  -> methodological impact
  -> raw facts
  -> evidence and verification state
```

Do not regress model detail pages into schema dumps or recommendation outputs into opaque scores.

## Three reproduction modes are first-class

Model choice is inseparable from the user’s reproducibility goal. Keep these modes explicit throughout paper pages, Research Task creation, candidate evaluation, and substitution analysis.

### Strict reproduction

Goal: reproduce the original experiment as closely as possible.

Prefer the original model/checkpoint/revision/template/environment. Modern replacements are not equivalent just because they are stronger or newer.

### Method reproduction

Goal: test the method while allowing model substitution.

Replacement is allowed, but the product must expose changed variables that may affect comparability: scale, checkpoint semantics, reasoning mode, context budget, architecture, tool templates, access path, runtime, and other relevant conditions.

### Modern rerun

Goal: test whether the method remains useful with current models.

A modern rerun is not a claim that the original paper’s numbers were reproduced. The UI and exported decision record must keep this distinction clear.

## Product architecture: four layers

### 1. Learning layer

Purpose: give researchers enough conceptual structure to interpret the catalog correctly.

Important concepts include:

- Base / Instruct / Thinking / specialized checkpoints;
- Dense vs MoE and total vs active parameters;
- open weights vs open source vs API/product access;
- LoRA / SFT / RL and whether weights must be modified;
- context vs external memory;
- family / generation / checkpoint / product identity;
- semantic unknown states and evidence quality;
- why papers may use smaller or older models.

Learning content should link concepts to real models and paper cases instead of remaining abstract documentation.

### 2. Exploration layer

Purpose: let a researcher inspect the same model space from multiple useful perspectives.

Expected views include:

- decision-oriented model browsing;
- raw/data-oriented browsing;
- family/generation/time views;
- openness/trainability/resource filters;
- paper-adoption filters;
- evidence/verification status;
- current vs historical context where the data allows it.

Exploration should support a decision, not become a leaderboard for its own sake.

### 3. Decision layer

Purpose: turn a concrete Research Task into differentiated candidates.

A Research Task may include:

- strict / method / modern / new-experiment mode;
- reference paper/model/role;
- model role in the agent system;
- update method such as inference-only, LoRA, SFT, or RL;
- GPU count / VRAM / precision / batch / context / LoRA rank / optimizer / KV-cache assumptions;
- openness/access constraints;
- ordered research priorities.

The candidate engine should normally form differentiated buckets rather than one global ranking:

- **baseline candidate** — preserves paper comparability;
- **modern candidate** — more current, but introduces generation/methodology confounds;
- **resource candidate** — easier/cheaper to run, with explicit capability or comparability tradeoffs.

### 4. Research-output layer

Purpose: leave the researcher with a durable decision artifact.

Decision output should preserve, where available:

- Research Task and resource assumptions;
- selected candidates and comparison set;
- why candidates were included;
- why alternatives were excluded;
- risks and methodological confounds;
- evidence sources and verification dates;
- unresolved/unknown fields;
- data revision or snapshot information;
- a shareable/exportable Markdown/JSON representation.

The output is part of the research record, not merely a UI convenience.

## Recommendation policy: no single “best model” score

Do not collapse model choice into an unexplained scalar score.

The product should expose at least these independent dimensions:

1. **feasibility** — can the experiment actually be run under the stated constraints?
2. **research suitability** — is the model appropriate for the task/role/update method?
3. **comparability** — how well does it preserve the reference experiment’s relevant conditions?
4. **reproducibility** — can model revision, templates, runtime/config and other conditions be fixed or recovered?
5. **evidence quality** — how strongly are the important claims supported?

Each dimension should be explainable. Unknown evidence must remain unknown rather than being silently converted into a low or high score.

## Model substitution is a core differentiator

A major product capability is not merely “compare model A and model B,” but **analyze what changing the base model does to the experiment**.

Replacement analysis should surface methodology-relevant changes such as:

- parameter/scale changes that may mask or amplify a method effect;
- Base -> Instruct -> Thinking changes that alter behavior or inference budget;
- context-window changes that may reduce the apparent contribution of memory methods;
- Dense <-> MoE changes that make total-parameter comparisons misleading;
- local weights -> API access changes that affect revision pinning and reproducibility;
- license changes that affect redistribution or derivative release;
- tool/chat template changes that make the agent scaffold non-equivalent;
- runtime or preserved-reasoning behavior changes where evidence exists.

When evidence permits, classify consequences in language equivalent to:

- definite impact;
- possible impact;
- no evidence / unknown;
- no material impact.

Do not infer a paper workflow or methodological effect when the source record does not support it.

## Information architecture and browsing model

The top-level experience should be task-oriented rather than database-table-oriented.

Current durable public structure:

```text
Home / task entry
Research Workspace
Model space
Paper cases
Learning guide
Compare and search as tools
Methodology / data status as supporting evidence surfaces
```

The homepage should answer **“what are you trying to do?”** before showing cognitively dense catalog visualizations.

Useful entry intents include:

- reproduce a paper;
- choose a model for a new experiment;
- find a replacement for an older model;
- learn foundation-model concepts.

Landscape/family/catalog views are important, but they are secondary to the research task.

## Persistent research context

Once a Research Task exists, context should survive navigation wherever practical.

The user should not have to remember their constraints while moving among models, papers, families, quick views, and comparison pages.

Durable interaction patterns include:

- global Research Context Bar;
- persistent candidate state;
- persistent Compare Tray;
- quick model inspection without losing the current location;
- URL-encoded shareable state where appropriate;
- browser-local project/snapshot persistence in the current static architecture.

Public/core catalog content should remain available in generated HTML; browser-local task/candidate state may enhance it after hydration. Follow the separate static-first rendering policy for implementation details.

## Model detail information order

A model page should prioritize researcher decisions over storage schema order.

Preferred conceptual order:

1. research summary / suitability;
2. fit against the active Research Task, if one exists;
3. access/openness/revision path;
4. training and runtime suitability;
5. resource assumptions;
6. paper adoption and model roles;
7. alternatives/substitution context;
8. raw facts;
9. claim/evidence links and semantic unknowns.

Long detail pages may use a sticky section navigator when it materially improves orientation. Do not remove high-value evidence simply to make pages shorter.

## Paper pages are experiment case studies

Paper pages are not just citation lists.

They should help a researcher understand:

- method/evolution target;
- model roles such as actor/policy, teacher, critic, judge/evaluator, reward, or baseline;
- whether weights are updated;
- recorded workflow edges, without inventing missing relationships;
- model-selection rationale and its evidence boundary;
- reproduction conditions and difficulty;
- strict/method/modern rerun paths;
- credible substitution questions.

Paper-to-workspace deep links are part of the intended workflow.

## Evidence and semantic-unknown policy

The product’s credibility depends on refusing to turn missing information into false certainty.

Preserve semantic states such as:

- not disclosed;
- not applicable;
- not reported;
- not verified;
- conflicting evidence;
- not published;
- unavailable.

Rules:

- `unknown` is not `false`;
- missing benchmark conditions must not be treated as comparable conditions;
- third-party inference must not be presented as first-party fact;
- absence of a recorded paper rationale must be shown as absence, not reverse-engineered into certainty;
- evidence should retain source, locator where available, checked-at date, support/contradiction relationship, and historical validity where the data supports it.

## Claim graph and time dimension

The long-term data model is closer to a **claim graph** than an ever-growing flat model JSON document.

Useful claim properties include:

```text
subject
predicate / field path
value
scope
valid-from / valid-to
source/evidence references
confidence / evidence class
support vs contradiction
checked-at / history link
```

The current V2 already contains claim/history primitives. Future work may extend them toward an explicit “as of date X” model-space view.

Time-sensitive facts that should remain distinguishable include:

- model release date;
- weight release date;
- API availability/status dates;
- model/product identifiers;
- license/status changes;
- current family flagship/open-weight representative;
- evidence verification date;
- data snapshot date.

Historical paper choices must be evaluated against what existed at publication time, not only against today’s catalog.

## Benchmark and empirical-evidence policy

A benchmark result without its conditions is not enough for research comparison.

Where data exists, preserve conditions such as:

- benchmark/version;
- model revision;
- scaffold/prompt/system behavior;
- temperature/reasoning/inference budget;
- tool permissions;
- context length;
- hardware/precision/batch;
- evaluation date;
- result provenance: paper-reported, reproduced, independent, or not verified.

Do not reduce heterogeneous benchmark runs to one universal leaderboard score.

The schema may support more evidence than is currently populated. Never fabricate missing empirical coverage merely because the UI can display it.

## Resource-estimation policy

Resource guidance must distinguish:

- official documented requirements;
- observed/community measurements;
- site-generated planning estimates.

Heuristic estimates should expose assumptions such as precision, context, batch, training/inference mode, optimizer, LoRA rank, KV cache, architecture, and GPU count/VRAM where relevant.

Do not phrase a heuristic result as an official hardware guarantee.

## Visual and interaction direction

The durable visual direction is:

> **Research Editorial × Analytical Workbench**

Public knowledge pages should feel like a high-quality interactive research publication: clear typography, strong hierarchy, restrained annotation, evidence and footnote-like provenance.

The Workspace may be denser and more application-like: persistent context, constraint panels, candidate analysis, evidence inspection, and comparison tools.

Preserve the warm neutral / terracotta / teal identity unless there is an explicit redesign decision. Semantic colors must accompany text/icons rather than becoming the only carrier of meaning.

Avoid a “card ocean.” Cards are useful for task/scenario/candidate boundaries, but long-form research content should also use whitespace, dividers, lists, tables, timelines, and editorial grouping.

## Accessibility and static-first requirements

Product quality includes:

- keyboard-accessible navigation and core interactions;
- visible focus;
- semantic headings and status text;
- theme controls that expose state;
- reduced-motion support;
- accessible alternatives for charts;
- color-independent status meaning;
- bilingual Chinese/English parity for public product paths.

Core public research content should not disappear when JavaScript is unavailable. JavaScript should enhance filters, local state, quick views, comparison, and the Workspace rather than becoming a prerequisite for basic catalog readability.

## Technical strategy

The current stack is intentionally retained:

```text
Astro + React + Zod + Content Collections + Nano Stores + ECharts/D3
GitHub -> Cloudflare Pages
static output
```

Do not migrate to Next.js or add SSR/database infrastructure merely because the product has become more sophisticated.

The current static architecture is appropriate for:

- public research content;
- SEO/indexable model/paper pages;
- client-side Research Task/candidate/compare state;
- local multi-project persistence;
- URL sharing;
- static decision-record export;
- deterministic Cloudflare build validation.

Revisit the architecture only when an actual product requirement needs server-side capability.

## V3 trigger conditions

Server-side or database work becomes justified when the owner explicitly wants capabilities such as:

- user accounts;
- cross-device cloud project storage;
- team workspaces;
- permissions/review workflows;
- shared comments or real-time collaboration;
- server-managed notifications;
- large-scale dynamic querying or editing that no longer fits build-time collections;
- richer historical/as-of-date data services that materially exceed the static model.

If those requirements arrive, evaluate Astro server rendering / Cloudflare Workers or another appropriate backend architecture at that time. Do not pre-emptively rebuild the current site into a SaaS stack.

## Current V2 status boundary

As of 2026-08-09, the static research-decision loop is largely implemented:

```text
define task
  -> set constraints
  -> form baseline/modern/resource candidates
  -> inspect research fit and evidence
  -> compare models
  -> analyze substitutions
  -> save/export a decision memo and snapshot
```

The repository’s deterministic V2 audits and completion matrices are the executable evidence for code-completable V2 items. This document describes product intent and should be read alongside those checks rather than replacing them.

Remaining product opportunities that do **not** imply a framework rewrite include:

- stronger sticky navigation on long model-detail pages;
- refining quick-view presentation toward an optimal desktop drawer / mobile sheet pattern where usability testing supports it;
- richer in-context glossary/help surfaces;
- a clearer global last-verified/data-freshness cue;
- a true as-of-date historical model-space UI built on the existing claim/change-event primitives;
- further reducing unnecessary card-heavy layouts;
- continued growth of high-quality independent benchmark and paper-rationale evidence.

These are opportunities, not permission to claim unsupported facts.

## Success criteria

Do not measure success primarily by “number of models in the catalog.” Better product outcomes include:

- time required to form three credible candidates;
- whether the researcher can explain why each candidate is present;
- whether strict reproduction and modern rerun are clearly distinguished;
- whether a model substitution’s confounds are visible;
- whether important claims trace to evidence;
- whether unknown/unverified states remain visible;
- whether the decision record preserves alternatives, risks, resource assumptions, and evidence;
- whether an older saved decision can reveal changed underlying facts.

A successful session should leave the researcher able to say something like:

> I retained three candidates: one strict-reproduction baseline, one modern replacement, and one low-cost/resource candidate. I understand the capability, hardware, license, comparability and evidence tradeoffs, know which facts remain uncertain, and have a saved record of why the decision was made.

## Non-goals and anti-regression rules

Do not turn Basemodel into:

- a generic vendor catalog;
- a single-score leaderboard;
- a Hugging Face search clone;
- a paper-link aggregator;
- a parameter database with no research consequences;
- an AI-SaaS visual template that hides evidence behind generic cards;
- an auto-generated recommendation system that invents missing facts.

When changing the product, ask first:

> Does this change make it easier for a researcher to understand the model choice, narrow feasible candidates, evaluate methodological tradeoffs, reproduce the experiment, and preserve the evidence behind the decision?

If the answer is no, the change is probably secondary to the product mission.
