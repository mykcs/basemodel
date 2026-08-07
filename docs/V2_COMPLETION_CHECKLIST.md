# Basemodel V2 completion checklist

This is the release gate for the V2 research decision workbench. A checked item must have automated evidence from `scripts/audit-v2-completion.ts` or a recorded browser/build check.

## Product shell

- [x] V2-SHELL-001 — No page imports `BaseLayout.astro`.
- [x] V2-SHELL-002 — `src/layouts/BaseLayout.astro` is removed.
- [x] V2-SHELL-003 — All required routes exist in Chinese and English.
- [x] V2-OLD-001 — Public source has no obsolete MVP or dual-engine prototype labels.
- [x] V2-STATE-001 — Compare sharing uses only `?models=`.

## Research workflow

- [x] V2-WORKSPACE-001 — Research tasks, candidates, compare IDs, and snapshots persist locally.
- [x] V2-WORKSPACE-002 — English workspace uses the same mounted React workbench and locale-safe links.
- [x] V2-WORKSPACE-003 — Snapshot save and field-level change detection are mounted in Decision Memo.
- [x] V2-NAV-001 — Header primary navigation is organized around research actions.
- [x] V2-SEARCH-001 — Global search loads a build-time index and supports keyboard navigation.
- [x] V2-COMPARE-001 — Compare tray shows model names and opens the canonical URL.

## Evidence and data contract

- [x] V2-DATA-001 — Content Collections include models, papers, claims, benchmarkRuns, guides, and changeEvents.
- [x] V2-DATA-002 — Guide content is read from the guides collection in both locales.
- [x] V2-DATA-003 — Semantic missing-value states remain explicit and are not coerced to false or zero.
- [x] V2-DATA-004 — License risk and evidence-quality signals remain visible in decision output.

## Visual and accessibility quality

- [x] V2-CSS-001 — Tokens are the style source and global CSS is only an import layer.
- [x] V2-A11Y-001 — Theme controls expose current state and dispatch theme changes to charts.
- [x] V2-A11Y-002 — Reduced motion and sticky comparison fields are present.
- [x] V2-A11Y-003 — Landscape data points remain keyboard reachable.
- [x] V2-I18N-001 — UI changes are synchronized in Chinese and English.

## Release verification

- [x] V2-VERIFY-001 — `check`, `validate`, `audit`, unit tests, build, E2E, and this audit pass.
- [x] V2-VERIFY-002 — GitHub Pages static output and `/basemodel` base-path links build successfully.
- [x] V2-FACTS-001 — Facts that cannot be verified from repository evidence remain explicitly marked as unknown.
