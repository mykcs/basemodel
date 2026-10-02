# A02 static-first implementation evidence — 2026-10-02

Status: implementation evidence for PR #815. This file records measured before/after behavior; it is not a production-performance benchmark and does not authorize merge or deployment.

## Measurement boundary

Baseline: A02 planning head `e40fd3d43452ec6990dc2dcc75d6ecdc8d2faddf`, whose product implementation matched main `360eabb92e5feb9ccef6ae7785332f73f7620ee0` for the measured surfaces.

Local qualification used Node 24, a fresh static Astro build, the repository static server, and Chromium at 1280×800. First-view network observations were taken after `DOMContentLoaded` plus 900 ms without scrolling. JavaScript figures below are gzip sizes of locally requested built JavaScript; the catalog figure is gzip size of `/model-data/catalog.json`. These are controlled local observations, not Core Web Vitals or Internet latency claims.

## What changed

- Models, Workspace and Landscape now preserve a useful static first view and defer the heavy React/catalog path until the reader reaches the interactive surface.
- Papers and Compare no longer serialize the whole models/papers catalog into Astro island props. They fetch the shared prerendered catalog instead.
- A single `src/lib/catalogClient.ts` owns the per-page cached catalog request instead of duplicate fetch implementations.
- Catalog fetch failure leaves a readable static fallback instead of replacing the page with an inert or blank interactive surface.
- Workspace/model/landscape deep links point at the deferred interactive surface, so explicit user intent still starts the tool immediately.
- Landscape continues to code-split ECharts and D3; A02 did not add another visualization dependency.

## Built HTML size

| Route | Baseline bytes | A02 bytes | Change |
| --- | ---: | ---: | ---: |
| Models | 80,063 | 80,288 | +0.3% |
| Papers | 908,920 | 86,673 | **−90.5%** |
| Compare | 847,367 | 67,492 | **−92.0%** |
| Workspace | 35,323 | 35,694 | +1.1% |
| Landscape | 842,833 | 87,208 | **−89.7%** |

The small Models/Workspace increases are the explicit static/failure affordances. The large Papers/Compare/Landscape reductions come from removing full-catalog island serialization, not from removing reader-visible scientific content.

Gzip HTML after A02: Papers 14,732 B; Compare 14,468 B; Landscape 15,960 B; Models 16,251 B; Workspace 11,095 B.

## Initial first-view network

| Surface | Baseline | A02 | Interpretation |
| --- | --- | --- | --- |
| Static research article | 3,223 B JS; no catalog | 3,223 B JS; no catalog | unchanged static-first behavior |
| WebShop Flow | 3,223 B JS; no catalog | 3,223 B JS; no catalog | existing visible island remains deferred below first view |
| Models | 103,506 B JS + 46,032 B catalog | **3,223 B JS; no catalog** | heavy first-view work reduced ~97.8% by this local byte accounting |
| Workspace | 115,133 B JS + 46,032 B catalog | **3,223 B JS; no catalog** | heavy first-view work reduced ~98.0%; negative root margin avoids the island being triggered by a few pixels at the fold |
| Landscape | 3,223 B JS; no catalog, but full catalog in HTML | 3,223 B JS; no catalog, compact HTML | same first-view JS plus ~89.7% smaller HTML |
| Papers | 89,721 B JS; full catalog in HTML | 90,321 B JS + 46,032 B catalog, compact HTML | remains interactive in first viewport, but removes ~0.82 MB duplicated HTML payload |
| Compare | 91,081 B JS; full catalog in HTML | 91,652 B JS + 46,032 B catalog, compact HTML | primary interactive task remains eager, but removes ~0.78 MB duplicated HTML payload |

Papers is physically inside the first viewport and Compare is itself the primary task, so A02 deliberately does not delay those tools merely to make the metric look smaller.

## Functional acceptance

- `npm run verify:deploy`: PASS.
- Astro check: 0 errors, 0 warnings; two pre-existing Zod deprecation hints remain.
- Full Vitest inside verify:deploy: 123 files / 806 tests PASS.
- New static/loading browser tests: 7/7 PASS, including desktop, phone, no-JavaScript, explicit deep-link activation, and catalog-request failure.
- Static-first + Workspace browser qualification: 16/16 PASS.
- Relevant Research Path browser qualification: 4/4 PASS after updating two stale assertions to the current UI labels/actions.
- Relevant Final Product tests: model explorer, paper explorer, decision memo, and landscape PASS. The suite also contains unrelated stale Home/Guide wording assertions that already disagree with current main and are not modified in A02.
- Relevant ordinary-tech-debt Landscape test: PASS.

## Existing payload-budget debt kept explicit

`node scripts/assert-payload-budget.mjs` still fails on the pre-existing homepage global CSS budget:

- measured `homeGlobalCssGzip = 24,035 B`
- existing limit `21,360 B`

A02 extends the script with explicit Models/Papers/Compare/Workspace/Landscape HTML budgets, and all five A02 route metrics are below their limits. It does **not** loosen the homepage CSS threshold or edit the shared global CSS owner; that work belongs to the separate style-ownership track (A03).

## Scientific/content boundary

A02 changes loading and data transport, not scientific results. Model/paper records, comparison semantics, experiment claims, URLs and theme/i18n direction are preserved. No new remote service, CMS, database, analytics tracker, experiment, or publication permission was introduced.
