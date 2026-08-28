# Product direction and research-integrity contract

Last reviewed: 2026-08-10

This document preserves the durable product and research-method decisions that should survive individual chat sessions, UI rewrites and future coding-agent handoffs. It is current guidance, not a historical transcript.

## North star

`basemodel` is not primarily a model catalog, leaderboard, vendor directory or paper-link collection.

The product goal is:

> Help agent/self-evolution researchers understand the current base-model space, form feasible candidates, evaluate tradeoffs, reproduce prior work, and leave behind an evidence-backed, reproducible record of why a model was chosen.

The core job is:

> Given a research task, experimental method, hardware budget, openness requirements and reproduction goal, shrink the feasible model space and produce a verifiable, explainable model-selection rationale.

A page that exposes more fields but does not help the researcher make or defend a decision is not sufficient progress.

## Product model

The intended product has two complementary surfaces.

### Public knowledge area

Use Astro-first pages for durable, searchable, bilingual research knowledge:

- model space and model details;
- paper cases and model roles;
- family/generation history;
- learning guides;
- evidence, claims, methodology and data-status explanations.

The visual direction is `Research Editorial`: warm neutral surfaces, restrained terracotta/teal identity, strong typography, generous whitespace, fine rules, evidence that reads like research footnotes rather than marketing badges.

### Research Workbench

Use a denser analytical interface for active research decisions:

- define a research task and constraints;
- generate and inspect candidates;
- compare tradeoffs;
- analyze model substitution;
- inspect evidence and unknowns;
- save/export a decision memo or snapshot.

The visual direction is `Analytical Workbench`: compact panels, high information density, minimal decorative chrome, clear status semantics and persistent task context.

These two surfaces should share data and state but do not need to look identical.

## The three reproduction modes are first-class

Do not collapse reproduction into one generic recommendation mode.

1. **Strict reproduction** — preserve the original experimental conditions as closely as the evidence permits. Comparability has priority over using the newest model.
2. **Method reproduction** — preserve the method while allowing a model replacement; explicitly analyze what the replacement may change.
3. **Modern rerun** — test the old method with a current model stack; novelty/current capability matters more than strict comparability.

A replacement candidate can be suitable for one mode and unsuitable for another. The UI and decision logic should expose all three when substitution is being evaluated.

## Recommendation philosophy

There is no globally best model for research use.

Recommendations should narrow the feasible solution space and expose tradeoffs rather than manufacture a single opaque leaderboard score. Prefer candidate roles such as:

- baseline/comparability candidate;
- modern/current-generation candidate;
- resource-efficient candidate.

Evaluate candidates along separable dimensions such as:

- feasibility;
- research fit;
- paper comparability;
- reproducibility;
- evidence quality.

Keep the reasons visible. A researcher should be able to explain why a model is recommended without reverse-engineering an internal score.

## Research-integrity invariants

These rules are more important than making every card look complete.

### Unknown is not false

Preserve explicit semantic states such as `not_disclosed`, `not_reported`, `not_verified`, `not_applicable`, `not_published`, `unavailable` and conflicting evidence.

Never turn an unknown into `false`, `0`, an empty capability or an inferred absence merely to simplify filtering or display.

### Open weights is not open source

Keep access surfaces separate:

```text
product access
API access
weight access
base checkpoint availability
trainability / finetuning rights
derivative-release rights
commercial-use rights
```

A model can have open weights while still imposing license or distribution constraints. Do not collapse these concepts into one `open` badge.

### Do not fabricate revisions

A release date, marketing version, model ID or current catalog entry is not automatically a reproducible model revision.

Only present/copy a pinned revision when repository evidence explicitly supports the revision field. If a revision cannot be verified, say that the model version is not pinned.

PR #67 fixed a previous false-complete behavior that constructed a revision-like value from `model.id` and `release_date`; future agents must not reintroduce that pattern.

### Method summary is not model-selection rationale

A paper's method description and its reason for choosing a model are different facts.

Do not use `model_selection.rationale` as a substitute for a missing paper method summary. When the method summary has not been captured from evidence, label it as pending/unverified and show other known research-scope metadata separately.

### Claim -> evidence is the preferred direction

Do not assume a page-level list of sources proves every fact on the page.

Prefer field/claim-level evidence links with stable source identity. Sources should support specific fields or claims, and conflicts should remain visible rather than silently choosing one side.

Stable source IDs are generated consistently from normalized source URLs when an explicit ID is absent. The content loader and source-ID migration must continue to use the same deterministic algorithm.

### Hardware statements need a level label

Keep three different concepts separate:

1. **catalog hardware tier** — coarse filtering metadata;
2. **heuristic VRAM planning estimate** — a planning calculator based on assumptions;
3. **measured hardware result** — an empirically reported configuration/result with evidence.

Never present a heuristic estimate as measured hardware evidence. Precision, context length, batch size, LoRA rank, optimizer, KV cache and GPU count can materially change a planning estimate.

### Benchmarks are contextual observations

Do not flatten a benchmark result into a context-free universal model score.

Preserve relevant conditions such as benchmark/version, scaffold or prompt, inference budget, reasoning/tool configuration, temperature, context, model revision and evaluation date when they are known. Unknown conditions should stay unknown.

### Paper model roles matter

A paper can use multiple models in different roles: actor/policy, teacher, critic, judge/evaluator, reward model, baseline and others.

Do not reduce paper adoption to “paper uses model X” when the role changes the methodological meaning.

## Presentation order

For research decision pages, prefer this cognitive order:

```text
conclusion
-> reasons
-> experimental impact
-> raw facts
-> evidence
```

Do not make users decode a giant fact grid before learning what the facts imply for the experiment.

Model detail should answer, near the top:

- what this checkpoint is;
- whether it fits the current research task;
- which constraints it satisfies;
- the main blockers/unknowns;
- what would change if it replaced another model.

Raw schema paths belong in maintenance/evidence views, not as the primary user language.

## Persistent cross-page research context

The active research task, candidate set and compare set are product state, not page-local decoration.

The intended experience is that a researcher can move through models, papers and families without losing:

- current research mode and constraints;
- candidate models;
- compare models;
- Quick View context;
- saved local project/snapshot state.

Use the shared client stores for cross-page state. `AppLayout` owns global surfaces such as the model Quick View host. Avoid implementations where the same capability exists only inside one explorer component while documentation claims it is global.

## Quick View and Compare behavior

Quick View is a cross-page research affordance. Paper-role diagrams, family timelines and model exploration should be able to open the same model quick view and link to the full model detail.

Compare must remain shareable through the canonical `?models=` URL contract. Desktop may use a dense table, but mobile needs a dedicated readable representation rather than depending on horizontal scrolling alone.

## Model substitution analysis

When comparing an original paper model with a candidate replacement, analyze methodological changes, not just parameter count.

Important dimensions include:

- generation/time gap;
- model/checkpoint semantics (`base`, `instruct`, `thinking`, etc.);
- Dense vs MoE architecture;
- total/active parameter scale;
- context budget;
- tool/chat-template behavior;
- local weights vs API-only access;
- license/distribution changes;
- ability to pin the exact version;
- likely comparability risk.

Each impact should be classified honestly: supported change, possible impact, no evidence, or no meaningful impact. Do not overclaim causal effects from metadata alone.

## Data architecture direction

Current structured content is valuable and should not be thrown away during UI rewrites.

Core entities include:

- model family;
- checkpoint/model record;
- distribution/access surface;
- paper;
- paper-model use/role;
- claim;
- evidence/source;
- benchmark run;
- research task;
- candidate/compare state;
- decision snapshot/change event.

Long-term claim data should support temporal validity and conflict, conceptually:

```text
subject
predicate / field
value
scope
valid_from / valid_to
source/evidence
locator
checked_at
confidence / review status
```

Do not perform a destructive “database redesign” merely because this direction exists. Evolve the current Zod/content contracts incrementally and keep stable model/paper IDs where practical.

## Technology decision

The current Astro + React architecture is not the limiting factor for the present product.

Keep the current static-first shape while the product is mainly public research knowledge plus a client-side workbench:

- Astro for public/static pages and SEO;
- React for dense interactive workbench surfaces;
- Zod/Content Collections for reviewed repository data;
- Nano Stores/persistent stores for client task/candidate/compare state;
- ECharts/D3 only where visualization adds decision value;
- Cloudflare Pages for build/Preview/Production/hosting.

Do not migrate to Next.js or a server-first framework merely because the UI is becoming richer.

Revisit the backend/runtime architecture only when requirements genuinely include server-owned capabilities such as:

- accounts/authentication;
- cross-device cloud project storage;
- team collaboration/permissions;
- realtime synchronization;
- server-side notifications;
- server-side search or user-specific APIs;
- database-backed current/history administration.

At that point an Astro server/hybrid deployment is a valid option; a framework migration should be justified by product needs, not fashion.

## Static-product boundary

The current static implementation can honestly provide:

- public knowledge pages;
- bilingual routes;
- model/paper filtering;
- URL-shareable research tasks/compare state;
- local multi-project persistence;
- static snapshots/memos;
- charts and timelines;
- deterministic build-time validation.

It cannot honestly claim, without external services:

- account login;
- cross-device cloud save;
- shared team workspaces;
- realtime collaboration;
- server-side authorization;
- automatic verification of unavailable external facts.

Keep these as explicit external capability/fact boundaries. Do not mark them complete with a localStorage or static-JSON substitute.

## “Done” means wired, not present

A recurring failure mode in this project was treating file/component existence as feature completion.

For product features, completion requires evidence that the behavior is reachable through the real product path. Examples:

- a Quick View component is not “global” unless non-explorer pages can actually invoke it;
- a replacement-analysis helper is not complete unless the real lab renders its conclusions;
- a mobile comparison requirement is not complete if the desktop table merely becomes horizontally scrollable;
- a revision control is not complete if its value is fabricated;
- a method summary is not complete if a different field is displayed under that label.

Use adversarial acceptance checks that look for these false-complete patterns.

## PR #67 closeout — durable lessons

PR #67 (`V2 adversarial closeout: finish remaining research-workbench gaps`) was merged to `main` on 2026-08-10 (+08:00) as squash commit `ea97be21f0a3bc2babeb5c2a1d5f0bdc00f74e4b`.

It closed several false-complete gaps and added permanent regression coverage for them, including:

- revision truthfulness;
- human-readable unresolved model facts;
- sticky model-detail research navigation;
- paper method-summary boundary;
- benchmark/checkpoint paper filters;
- global Quick View wiring;
- paper/family model links;
- historical paper-adoption semantics;
- three-mode replacement verdicts;
- dedicated mobile comparison;
- hardware-tier vs heuristic-estimate wording;
- deterministic source identity;
- deployment-blocking V2 completion/adversarial audits.

The final PR head `c39d4eeae06905839d01d018037131ca012d3770` received a successful Cloudflare Preview with the full deterministic deployment gate before merge.

The Cloudflare gate now includes both V2 audits in addition to the previous deterministic checks. Keep `package.json`, the deployment tests and current Agent deployment docs synchronized when changing this contract.

## Validation philosophy

Tests should protect research semantics, not merely rendering mechanics.

Important invariant coverage includes:

- semantic unknowns remain semantic unknowns;
- release dates never become revisions;
- paper method and model-selection rationale remain distinct;
- global capabilities are actually reachable globally;
- mobile has a usable comparison path;
- three reproduction modes remain distinct;
- source identity stays deterministic;
- completion checklists cannot be satisfied by dead/unwired components.

Full Playwright remains on-demand on the repository-scoped self-hosted runner so browser downloads and execution stay out of Vercel Production. Deterministic source/data/unit/V2 audits remain appropriate deployment blockers; Cloudflare production-smoke only observes the deployed Vercel origin.

## How future agents should continue

Before proposing a broad redesign:

1. Read `AGENTS.md`, `docs/agents/LATEST.md`, this document and the deployment/repository-map docs.
2. Inspect the current implementation; do not assume an older audit still describes `main`.
3. Start from a real researcher task, not from a desire to add components.
4. Preserve evidence/unknown semantics and stable IDs.
5. Prefer changing the smallest coherent product slice that closes a real research workflow.
6. Add a regression that proves the behavior is wired into the real path.
7. Use branch -> PR -> self-hosted risk-based CI -> optional exact-head Vercel Preview -> merge for deployment-sensitive work.
8. Keep GitHub Actions limited to the repository-scoped self-hosted CI control plane; do not reintroduce GitHub-hosted runners or GitHub Pages.
9. Do not ask the owner to relay logs/content between tools when connected tools can retrieve them.
10. Keep external-service and unavailable-fact boundaries explicit rather than faking completion.

The desired end state is not “a database with more fields.” It is a research decision system where the researcher leaves with a small set of justified candidates, explicit tradeoffs, evidence gaps, hardware/license/comparability implications and a reproducible record of the decision.
