# Rendering and performance policy

Last reviewed: 2026-08-30

This file is the authoritative rendering/performance policy for `mykcs/basemodel`. It complements `deployment-policy.md` and the current Vercel Preview + Vercel Production architecture.

## Core principle

The site is an Astro static knowledge/research site. Public research content should be useful in generated HTML before client JavaScript runs. JavaScript is an enhancement boundary, not a prerequisite for reading the catalog.

Astro framework components render HTML at build time by default. Add a `client:*` directive only when the component genuinely needs browser-side interactivity. Current Astro documentation:

- <https://docs.astro.build/en/reference/directives-reference/#client-directives>
- <https://docs.astro.build/en/concepts/islands/>

## Classify an island before changing hydration

### A. Public/core content islands

Examples include model/paper lists, comparison pickers, family timelines, Landscape content and other indexable research material.

Rules:

- Generated HTML must contain useful content; do not return `null` solely because hydration has not happened.
- The build render and the first client render must be deterministic and markup-compatible.
- If URL or persisted state only exists in the browser, render a safe default state first and restore browser state in `useEffect`, or design an explicit deterministic static fallback.
- Do not read `window`, `localStorage` or browser-only Nanostore state in a way that makes initial client markup differ from generated HTML.
- If a component is render-only and has no client interaction, remove `client:*` entirely.

Current examples:

- `PaperExplorer` renders the default paper catalog before hydration, then restores URL filters.
- `PaperModelMatrix` is render-only and must remain free of `client:*`.
- `ModelComparison` renders its picker before hydration and restores URL/persisted selection afterward.

### B. User-local state adjuncts

Examples include the native Astro `ResearchContextBar` / `CompareTray` adjuncts and React-owned `ModelTaskFit`. Their content can depend entirely on browser-local Research Task, candidate or compare state that the static build cannot know.

Rules:

- Native global adjuncts must emit meaningful hidden/static markup and progressively reveal normalized browser-local state; they must not require a React island merely to read persistence.
- It remains valid for a framework component to render nothing until hydration when there is no meaningful deterministic public fallback.
- Do not fabricate server state merely to avoid a `null` render.
- Keep adjunct JavaScript small and out of the critical path. The native bars use narrow labels, exact existing localStorage keys, safe normalization, and same-document custom events; they do not serialize the catalog or hydrate React globally.
- Do not serialize a large catalog into every page merely to support an adjunct that is usually hidden. Prefer existing static data routes or another on-demand boundary when the adjunct only needs data after browser-local state becomes meaningful.

This distinction is important: **“remove every hydration guard” is not a valid optimization strategy.**

## Choosing an Astro client directive

Use the least eager directive that still preserves product behavior:

- no `client:*`: static/render-only component;
- `client:load`: above-the-fold or immediately interactive behavior that must work as soon as the page loads, such as keyboard command UI or primary page controls;
- `client:idle`: lower-priority global/supporting UI that can wait until the browser is idle;
- `client:visible`: below-the-fold or expensive UI whose JavaScript is only needed near the viewport.

Do not mechanically change directives without checking state initialization and hydration markup.

## URL state on static Vercel output

Vercel serves the current product as static Astro output. Request query parameters are not available to the build-time render of a prerendered page.

For interactive filters/deep links:

1. render a deterministic useful default state in HTML;
2. after hydration, read `window.location.search` and restore the requested UI state;
3. keep subsequent state reflected in the URL with `history.replaceState` when shareability matters.

If a future feature requires query-dependent server HTML, that is an architecture change (SSR/functions) and must not be introduced implicitly as a hydration workaround.

## Data and localization are performance-quality concerns too

A fast page that exposes storage enums or stale evidence is still a product regression.

- Visible storage enums must go through shared locale formatters such as `statusLabel`, `tierLabel`, `semanticStatusLabel`, etc.
- Evidence-backed fields must map their source `supports` entries to the factual fields they justify.
- Refresh `checked_at` only when the cited first-party source was actually re-verified.
- Do not fill semantic unknowns from memory or inference when a source does not support the value.

## Performance validation

Prefer architectural wins over speculative micro-optimizations:

1. avoid unnecessary hydration entirely;
2. avoid blank-until-JS core content;
3. defer low-priority islands;
4. avoid repeating large serialized props across every static route;
5. keep heavy libraries behind interaction/visibility boundaries where practical;
6. then measure real pages with browser performance tooling before making fine-grained bundle or rendering claims.

Do not claim Core Web Vitals improvements without measuring them in an appropriate browser trace or field dataset.

The Landscape implementation is a useful reference: the interactive shell is visibility-gated, and its ECharts/D3 engines are dynamically loaded rather than entering every page's initial bundle.

## Regression expectations

Deterministic rendering/evidence contracts that are cheap to verify belong in Vitest and therefore in `verify:deploy`. `npm test` reports the explicit `test:structural` and `test:behavior` categories; `src/lib/testTaxonomy.test.ts` fails if any `*.test.ts/tsx` file is omitted. Browser-only behavior remains Playwright in CircleCI risk-based acceptance and is never classified as Vitest; the repository-scoped Mac/OrbStack runner is manual fallback only.

The regression suite under `src/lib/optimizationPhase.test.ts` protects several static-first, localization and performance contracts.

## Build-budget rule

Follow the Vercel deployment policy:

- batch related changes into one coherent branch head;
- prefer one atomic multi-file push before the first Preview;
- use the repository build classifier to skip documentation-only/non-deploy-relevant changes rather than creating synthetic builds;
- inspect one meaningful exact-head Preview for deployment-sensitive work;
- batch evidence-driven fixes before a corrective Preview instead of pushing one build per thought;
- merge the accepted release once and verify Production separately.

CircleCI GitHub App execution is the ordinary CI path. GitHub Actions is retained only for explicit `workflow_dispatch` to the repository-scoped Mac/OrbStack fallback runner; GitHub-hosted runners and GitHub Pages remain outside ordinary `basemodel` deployment. Cloudflare Pages/build helpers and Workers shadow tooling remain legacy rollback/provider-specific surfaces, while `cloudflare/production-smoke/` is the active monitoring-only exception and does not build or publish the site.
