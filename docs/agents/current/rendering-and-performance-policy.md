# Rendering and performance policy

Last reviewed: 2026-08-09

This file is the authoritative rendering/performance policy for `mykcs/basemodel`. It complements `deployment-policy.md`; it does not change the settled GitHub -> Cloudflare Pages architecture.

## Core principle

The site is an Astro static knowledge/research site. Public research content should be useful in generated HTML before client JavaScript runs. JavaScript is an enhancement boundary, not a prerequisite for reading the catalog.

Astro framework components render HTML on the server/build by default. Add a `client:*` directive only when the component genuinely needs browser-side interactivity. Current Astro documentation:

- <https://docs.astro.build/en/reference/directives-reference/#client-directives>
- <https://docs.astro.build/en/concepts/islands/>

## Classify an island before changing hydration

### A. Public/core content islands

Examples include model/paper lists, comparison pickers, family timelines, Landscape content and other indexable research material.

Rules:

- Generated HTML must contain useful content; do not return `null` solely because hydration has not happened.
- The server/build render and the first client render must be deterministic and markup-compatible.
- If URL or persisted state only exists in the browser, render a safe default state first and restore browser state in `useEffect`, or design an explicit deterministic static fallback.
- Do not read `window`, `localStorage` or browser-only Nanostore state in a way that makes initial client markup differ from generated HTML.
- If a component is render-only and has no client interaction, remove `client:*` entirely.

Current examples:

- `PaperExplorer` renders the default paper catalog before hydration, then restores URL filters.
- `PaperModelMatrix` is render-only and must remain free of `client:*`.
- `ModelComparison` renders its picker before hydration and restores URL/persisted selection afterward.

### B. User-local state adjuncts

Examples include `ResearchContextBar`, `CompareTray` and `ModelTaskFit`. Their content can depend entirely on browser-local Research Task, candidate or compare state that the static build cannot know.

Rules:

- It is valid for these components to render nothing until hydration when there is no meaningful deterministic public fallback.
- Do not fabricate server state merely to avoid a `null` render.
- Keep these islands out of the critical hydration path when practical. `CompareTray`, for example, uses `client:idle` because it is global but not required for first paint.

This distinction is important: **“remove every hydration guard” is not a valid optimization strategy.**

## Choosing an Astro client directive

Use the least eager directive that still preserves the product behavior:

- no `client:*`: static/render-only component;
- `client:load`: above-the-fold or immediately interactive behavior that must work as soon as the page loads, such as keyboard command UI or primary page controls;
- `client:idle`: lower-priority global/supporting UI that can wait until the browser is idle;
- `client:visible`: below-the-fold or expensive UI whose JavaScript is only needed near the viewport.

Do not mechanically change directives without checking state initialization and hydration markup.

## URL state and static Pages

Cloudflare Pages serves this project as a static Astro site. Request query parameters are not available to the build-time render of a prerendered page.

For interactive filters/deep links:

1. render a deterministic useful default state in HTML;
2. after hydration, read `window.location.search` and restore the requested UI state;
3. keep subsequent state reflected in the URL with `history.replaceState` when shareability matters.

If a future feature requires query-dependent server HTML, that is an architecture change (SSR/Functions/Workers) and must not be introduced implicitly as a hydration workaround.

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
4. keep heavy libraries behind interaction/visibility boundaries where possible;
5. then measure real pages with browser performance tooling before making fine-grained bundle or rendering claims.

Do not claim Core Web Vitals improvements without measuring them in an appropriate browser trace or field dataset.

## Regression expectations

Deterministic rendering/evidence contracts that are cheap to verify belong in Vitest and therefore in `verify:deploy`. Browser-only behavior remains Playwright/on-demand unless it becomes important enough to justify the extra deployment cost.

The current regression suite under `src/lib/optimizationPhase.test.ts` protects several static-first, localization and evidence contracts introduced during the 2026-08-09 optimization phase.

## Build-budget rule

Follow the existing Cloudflare steady-state policy: batch related production changes, use `[CF-Pages-Skip]` only for intermediate commits that do not need deployment, and require one meaningful final-head Preview for deployment-sensitive PRs. Documentation-only changes under `docs/*` are excluded by Cloudflare Build Watch and do not require a synthetic Preview.
