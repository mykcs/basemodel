# Research journey experience consolidation — current ownership update

Status: **current**  
Originally consolidated: **2026-08-12**  
Ownership correction: **2026-08-22**

## Why this update exists

The research area accumulated a second structural problem after the original journey work: the same full SEED, OpenEvo, WebShop, ALFWorld, comparison, and server explainers were embedded on multiple routes. That made an overview page compete with the dedicated concept page and made the execution guide read like a second conceptual textbook.

The durable rule is now:

> A full research explainer has one canonical route. Other routes may link to it, summarize the minimum context they need, or compare metrics, but they must not embed a second copy of the same full figure.

This is an information-architecture rule, not merely a visual cleanup.

## Canonical explainer ownership

| Full explainer | Canonical route | Other routes do |
| --- | --- | --- |
| SEED method | `/research/seed-openevo/seed/` | link or give short method context |
| OpenEvo lifecycle | `/research/seed-openevo/openevo/` | link or give short experiment context |
| WebShop interaction | `/research/seed-openevo/webshop/` | link; keep score/metric summaries where needed |
| ALFWorld interaction | `/research/seed-openevo/alfworld/` | link; keep success-rate summaries where needed |
| SEED vs OpenEvo update comparison | `/research/seed-openevo/loops/` | link; do not embed another comparison figure |
| server / Docker authority | `/lab/` | link from execution material |

The dedicated WebShop and ALFWorld pages keep the interactive, scroll-following explainer controls. In particular, the WebShop page remains the canonical place for the persistent previous/next learning interaction the owner selected.

## Route roles after de-duplication

### Research mission hub

`/research/seed-openevo/` is orientation. It routes readers to methods, environments, experiments, results, and execution without reproducing their full bodies.

### Benchmark overview

`/research/seed-openevo/benchmarks/` compares ALFWorld and WebShop as experimental instruments: metrics, evidence types, and fair-comparison controls. It links to the two environment pages for full interaction teaching.

### Experiment gateway

`/research/seed-openevo/experiment/` owns experiment state, study framing, evidence, source references, and live-state resolution. It uses a compact concept index rather than embedding method/environment figures.

### Reproduction guide

`/guide/openevo-webshop-alfworld/` stays execution-first: machine/code boundary, numbered gates, commands, expected evidence, and troubleshooting. Conceptual diagrams are references, not repeated content.

## Implementation invariant

`ResearchConceptIndex.astro` is the compact cross-route reference surface. `AgentEnvironmentTrajectory.astro` remains temporarily as a compatibility shell for existing callers, but it may only render that index; it must not import `InteractiveResearchExplainer`, `BenchmarkDatasetDiagram`, or another full concept figure.

The benchmark route must not mount `AgentEnvironmentTrajectory` at all. The reproduction guide must not directly mount `InteractiveResearchExplainer` for server or comparison content.

## Acceptance invariant

Source-level tests protect these ownership rules so later work cannot reintroduce the same duplication accidentally. UI acceptance still verifies the dedicated interactive pages, especially the WebShop previous/next controls, while overview and execution routes are checked for compact, non-duplicated navigation.

## Stopping rule

Do not remove useful local detail merely because two routes mention the same noun. Duplication means the same explanatory object is competing in multiple places. A short contextual summary, metric table, or link is allowed when it serves the current route's distinct job.
