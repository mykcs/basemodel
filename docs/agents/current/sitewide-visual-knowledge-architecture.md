# Sitewide visual knowledge architecture

Status: current design contract for the sitewide visual-information redesign
Audience: product/design agents, content agents, implementation agents
Parent branch / prerequisite: `feat/openevo-reproduction-research-page`

## Why this document exists

The site is not a model directory and should not read like a collection of disconnected pages. Its product promise is to help a technically curious reader move from a vague research question to a model decision that preserves paper comparability, resource feasibility, and source-backed evidence.

The OpenEvo reproduction-guide redesign established a useful lesson: HTML should encode sequence, dependency, evidence, and failure branches rather than merely decorate prose. This document extends that lesson to the whole product.

The redesign must begin with the expression goal of the product and each route. Do not start by adding cards or animations to existing markup.

## 1. The whole-site story

The durable user journey is:

```text
Orient
  → Learn the knowledge structure
  → Explore models, families, and papers
  → Compare differences and their research impact
  → Decide inside a task-specific workspace
  → Verify evidence, unknowns, and data freshness
```

A shorter product formulation is:

```text
Understand → Explore → Compare → Decide → Verify
```

Every major page should clearly belong to one or more steps. A page that cannot explain its role in this journey needs an information-architecture review before visual polish.

## 2. The four knowledge layers

The site separates four layers that must remain visually distinguishable.

### A. Model supply layer

Routes: `/models/`, `/families/`, `/landscape/`, model details.

Question answered: **What model states exist, how are they related, and what can I actually access or run?**

Key structures:

- vendor → family → generation → checkpoint;
- base / instruct / thinking / coder identity;
- architecture, scale, modalities, runtime and hardware;
- product / API / weights / base checkpoint access ladder.

### B. Paper and method layer

Routes: `/papers/`, paper details, `/guide/`, reproduction guides.

Question answered: **How do papers use models, what changes during the method, and what must stay fixed for a valid reproduction?**

Key structures:

- question → method → model roles → benchmark → result;
- policy / actor / reflector / teacher / evaluator role graph;
- strict reproduction / method reproduction / modern rerun;
- execution and evidence ladders.

### C. Decision layer

Routes: `/workspace/`, `/compare/`.

Question answered: **Given my research goal and constraints, which candidates remain and what changes if I choose one?**

Key structures:

- task → constraints → candidates → evidence → comparison → memo;
- difference → operational impact → comparability impact → decision;
- known conflict vs unknown fact.

### D. Evidence and governance layer

Routes: `/data-status/`, `/methodology/`, evidence panels on detail pages.

Question answered: **Which claims are supported, which are stale or unknown, and what may the interface legitimately conclude?**

Key structures:

- source → field claim → verification state → freshness → user-facing statement;
- verified / partial / semantic unknowns;
- reported result vs independent reproduction;
- recommendation boundary.

## 3. Route intent map

### Home

Role: low-density orientation and routing.

It should answer in one screen:

1. What is this site?
2. What are the four knowledge layers?
3. What path should I take today?
4. Where does a claim become a decision?

Do not use the home page as a full catalog or a long tutorial.

### Guide

Role: conceptual bridge and operational learning path.

It should visualize:

- the agent loop;
- how the loop maps into SEED;
- the reproduction progression from setup to measured evidence;
- where a beginner may jump to execution.

Long instructions remain linear and numbered. The overview must reduce, not duplicate, the body.

### Models index

Role: model-state discovery and filtering.

The primer should teach the five lenses before the explorer:

`Identity → Access → Adaptation → Hardware → Evidence`

The explorer remains the dense operational surface.

### Families

Role: hierarchy and time.

Visualize:

`Vendor → Family → Official generation → Concrete checkpoint`

Do not imply that every vendor has a clean numerical generation sequence.

### Landscape

Role: spatial overview of the supply layer.

The interface must explain how to read axes, point size, shape, and evidence border before the chart. Do not add a second redundant chart.

### Papers index

Role: method and adoption discovery.

Teach the reading sequence:

`Research question → Method → Model roles → Benchmarks → Reproducibility`

The matrix remains an advanced relation lookup, not the default entry.

### Model detail

Role: high-density decision evidence for one checkpoint.

A compact top overview should answer:

- what exact model state is this?
- how can it be accessed?
- what can be adapted?
- what hardware class is implied?
- how strong is the evidence?

The overview must link into the existing detailed sections rather than repeat them.

### Paper detail

Role: method anatomy and reproduction entry.

The top flow should connect:

`Question → Method → Model roles → Benchmarks → Reproduction choice → Evidence`

Existing role diagrams remain authoritative for recorded model-role relations.

### Compare

Role: translate field differences into research consequences.

Visualize:

`Select → Isolate differences → Interpret research impact → Inspect unknowns → Export`

The page must not resemble a generic specification table.

### Workspace

Role: high-interaction decision workflow.

Visualize the persistent process before the panels:

`Define task → Generate candidates → Inspect evidence → Compare → Export memo`

This overview should orient first-time users without delaying experienced users.

### Data status

Role: evidence-governance dashboard.

Visualize:

`Source → Claim mapping → Verification → Freshness / semantic unknown → Alert`

Use actual repository counts for health bars where possible. Tables remain available for exact inspection.

### Methodology

Role: teach the rules that prevent false certainty.

Visualize:

- semantic unknowns are states, not false values;
- evidence levels;
- recommendation funnel and its boundary.

This page should become the visual legend for the whole site.

## 4. Information-density system

The redesign uses four density levels.

### L0 — orientation

Where: home hero, visual primers, top-of-page maps.

Rules:

- one clear statement;
- three to six nodes;
- short labels;
- direct links to the next action;
- no dense tables.

### L1 — index and exploration

Where: models, papers, families, landscape, compare entry states.

Rules:

- one visual reading model before the interactive surface;
- filters and summaries may be dense;
- secondary matrices live behind disclosure or advanced modes.

### L2 — detail and evidence

Where: model detail, paper detail, data status.

Rules:

- compact decision overview first;
- high-density facts and sources afterward;
- unresolved evidence stays visible;
- summaries link to exact sections.

### L3 — operational workflow

Where: workspace and reproduction manuals.

Rules:

- sequence is part of correctness;
- current step and completion state must be legible;
- commands, expected output, decisions, and failure branches must remain close together;
- visual orientation may not hide required action.

## 5. Reusable visual grammar

### Route map

Use for ordered journeys and processes. Each node links to the relevant section or route. Use `<ol>` because order has meaning.

### Layer map

Use for knowledge architecture or system boundaries. Use `<figure>` and a caption that explains what the spatial arrangement means.

### Evidence ladder

Use when users may confuse readiness with proof. Every rung states:

- what it proves;
- what it does not prove.

### Hierarchy map

Use for vendor/family/generation/checkpoint or source/claim/field structures. Do not render hierarchy as a flat card grid.

### Difference-to-impact flow

Use in comparison and replacement workflows. A raw difference is not yet a research conclusion.

### Health pipeline

Use in data governance. Connect source coverage, claim mapping, verification, freshness, semantic gaps, and alerts.

### Progressive disclosure

Use native `<details>/<summary>` for secondary explanation, advanced matrices, historical incidents, and optional troubleshooting. Required commands and acceptance evidence stay open.

## 6. Animation policy

Animation is allowed only when it helps the reader perceive sequence, flow, state transition, or dependency.

Good uses:

- a subtle moving signal along a process route;
- step activation when a linked section enters the viewport;
- a loop indicator for policy → action → observation → trajectory → update;
- a health/evidence state transition.

Bad uses:

- decorative floating cards;
- continuous movement with no semantic meaning;
- animation that makes a static fact look live or measured;
- motion that is required to understand content.

Requirements:

- respect `prefers-reduced-motion`;
- preserve complete meaning without JavaScript;
- avoid heavy animation libraries for simple flows;
- use CSS/native HTML first;
- never imply real-time data when the site is showing a static verified snapshot.

## 7. Accessibility and implementation rules

- Use semantic headings and stable anchors.
- Use `<ol>` for ordered execution and `<dl>` for definitions/claim levels.
- Use `<figure>/<figcaption>` for topology and diagrams.
- Give every visual a text-equivalent label/caption.
- Keep keyboard focus visible.
- Keep routes and tables usable on narrow screens.
- Do not encode meaning by color alone.
- Interactive enhancement must fail back to readable static HTML.
- Shared components must work in both Chinese and English.

## 8. Scope of the first sitewide PR

The first PR should establish the system and cover every major route without rewriting all existing interactive internals.

Required coverage:

- home knowledge map;
- guide overview;
- models / papers / families / landscape primers;
- compare and workspace process maps;
- model and paper detail decision overviews;
- data-status evidence pipeline;
- methodology visual legend;
- shared CSS and reusable semantic components.

Non-goals for the first PR:

- replacing the existing model explorer, charts, or workspace state management;
- inventing new model facts;
- converting every fact block into a diagram;
- adding decorative motion;
- changing deployment architecture;
- changing current evidence semantics.

## 9. Acceptance checklist

A sitewide visual redesign is acceptable only when:

1. every major route can state its role in the whole-site journey;
2. the home page exposes the overall knowledge structure;
3. index pages teach how to read their dense surface;
4. detail pages lead with decision/evidence orientation;
5. process pages use semantic ordered flows;
6. visualization distinguishes setup, evidence, and conclusion;
7. motion has a semantic purpose and a reduced-motion fallback;
8. Chinese and English routes remain coherent;
9. existing interactive tools still work;
10. `npm run verify:deploy` and `npm run build` pass;
11. exact-head Vercel Preview is inspected across desktop/mobile-relevant routes;
12. Production is not updated before owner acceptance.
