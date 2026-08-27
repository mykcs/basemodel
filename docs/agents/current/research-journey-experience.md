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

## Contextual subnavigation invariant

The site header now owns two primary research journeys, and the local research navigation must behave as the child navigation of the active journey rather than as one second, independent global row.

The two tracks are:

| Primary journey | Child navigation owns |
| --- | --- |
| `01 · 流程理解图 / Flow map` | 流程总览, 模型, SEED, OpenEvo, 环境总览, WebShop, ALFWorld, 更新机制 |
| `02 · OpenEvo × WebShop 科学研究 / study` | 实验流程, 运行实验, 研究结果 |

`SeedOpenEvoResearchNav.astro` must choose exactly one of these child sets from the current page ID. Do not restore the old flat row containing both conceptual-learning routes and experiment/result routes together. The old flat row duplicated the top-level journey switch and made the two navigation bars feel unrelated.

Keep route URLs stable when changing this structure. The fix is navigation ownership, not a route migration.

The local navigation should expose its resolved track (`flow` or `study`) in a machine-readable way so source/UI acceptance can verify track membership, active state, and accidental cross-track leakage.

The Results label remains `研究结果 / Research findings`. Do not rename it to `实验结果 / Experiment results` merely to make the three study children sound parallel; the repository already treats the Results surface as a broader research-findings publication, and tests intentionally protect that wording.

Historical friction, failed-build details, and the release/verification sequence that produced this rule are recorded in [`../history/2026-08-27-contextual-research-navigation-retrospective.md`](../history/2026-08-27-contextual-research-navigation-retrospective.md).

## Implementation invariant

`ResearchConceptIndex.astro` is the compact cross-route reference surface. `AgentEnvironmentTrajectory.astro` remains temporarily as a compatibility shell for existing callers, but it may only render that index; it must not import `InteractiveResearchExplainer`, `BenchmarkDatasetDiagram`, or another full concept figure.

The benchmark route must not mount `AgentEnvironmentTrajectory` at all. The reproduction guide must not directly mount `InteractiveResearchExplainer` for server or comparison content.

For contextual navigation, `SeedOpenEvoResearchNav.astro` is the single owner of child-track membership. Pages pass their semantic page ID; they must not grow local copies of the child-navigation arrays.

## Acceptance invariant

Source-level tests protect these ownership rules so later work cannot reintroduce the same duplication accidentally. UI acceptance still verifies the dedicated interactive pages, especially the WebShop previous/next controls, while overview and execution routes are checked for compact, non-duplicated navigation.

Navigation acceptance must cover both sides of the split: at least one `flow` route (for example WebShop) and one `study` route (for example experiment). Verify the rendered child links, the active page, and absence of the other track's children. A production `200` plus correct rendered HTML proves structural release state; pixel/layout claims still require browser/visual acceptance when the task changes appearance.

## Stopping rule

Do not remove useful local detail merely because two routes mention the same noun. Duplication means the same explanatory object is competing in multiple places. A short contextual summary, metric table, or link is allowed when it serves the current route's distinct job.

Likewise, do not flatten the two research journeys simply because every route is related to SEED × OpenEvo. The question is not whether routes share a topic; it is whether they serve the same reader task.
