# Research journey experience consolidation — 2026-08-12

## Why this follow-up exists

Several earlier PRs improved copy, visual hierarchy, the SEED/OpenEvo research map, and mobile safety. The remaining gap was structural: the global navigation still exposed the repository's page inventory, while the owner consistently thinks in three durable goals:

1. reproduce SEED;
2. run OpenEvo on WebShop / ALFWorld;
3. learn the necessary model, agent, and training foundations.

The WebShop / ALFWorld material also explained the environments mostly through prose and tables. A newcomer could read the definitions without seeing the actual turn-by-turn contract among task, observation, model action, environment response, evaluator, and evolution mechanism.

## Page Expression Brief

- **Reader**: a paper researcher who understands models and training at a basic level but is new to long-horizon agent experiments.
- **Page role**: orient the reader, make one run legible, then route them to execution or controlled comparison.
- **Starting state**: the reader sees SEED, OpenEvo, WebShop, ALFWorld, memory, artifact, reward, and revision as many disconnected terms.
- **Target mental model**: one task is a stateful dialogue; the resulting trajectory can feed different update mechanisms; each evidence gate permits only a bounded claim.
- **Next action**: open the OpenEvo experiment gateway, inspect one illustrative trajectory, then enter the executable reproduction guide.
- **Primary path**: three global journeys → OpenEvo experiment gateway → environment dialogue → evidence gates → reproduction guide.
- **Secondary depth**: benchmark metric definitions, SEED/OpenEvo loop comparison, result/evidence ladder, models, papers, workspace, and comparison tools.
- **Semantic shape**: native navigation, `details` disclosures, ordered dialogue turns, ordered mechanism flows, definition lists for update boundaries, and explicit evidence gates.
- **Density plan**: L0 three journeys; L1 one run; L2 mechanism comparison; L3 diagnostics and artifacts.
- **Acceptance evidence**: bilingual source-level contract tests, mobile touch targets, horizontal pipeline scrolling, explicit illustrative-content label, and one final Vercel Preview build.

## Implemented invariants

### Global navigation

The first-level navigation is organized by user intent rather than page type:

- **Reproduce SEED**
- **OpenEvo experiments**
- **Foundations**

Models, papers, workspace, comparison, and the complete research map remain available from a secondary research-tools menu. Mobile navigation exposes the same structure without hiding entries.

### Agent/environment trajectory lab

The trajectory lab must always:

- label examples as illustrative rather than measured benchmark results;
- separate task, environment, agent, and evaluator messages;
- expose model-action evidence and fallback status as distinct concepts;
- explain WebShop exact success versus normalized partial score;
- explain ALFWorld family success rate and unweighted macro-average;
- show that SEED updates policy parameters inside a training loop;
- show that OpenEvo creates versioned carriers/revisions across completed sessions;
- state each activation boundary explicitly.

### Process diagrams

Process connectors are structural CSS lines and nodes, not text-arrow diagrams. On narrow screens, a horizontal pipeline remains horizontal and becomes touch-scrollable rather than collapsing into an unrelated stack.

### Build-budget discipline

All files in this follow-up are prepared and source-checked before the branch ref is updated. The GitHub branch is updated once so the Vercel Git integration receives one cohesive preview build rather than one build per edit.

## Primary files

- `src/components/Header.astro`
- `src/components/research/AgentEnvironmentTrajectory.astro`
- `src/components/research/OpenEvoExperimentGateway.astro`
- `src/pages/research/seed-openevo/experiment.astro`
- `src/pages/en/research/seed-openevo/experiment.astro`
- `src/pages/research/seed-openevo/benchmarks.astro`
- `src/pages/en/research/seed-openevo/benchmarks.astro`
- `src/lib/researchJourneyExperience.test.ts`
