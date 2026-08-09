# Basemodel V2 completion checklist

This is the release gate for the V2 research decision workbench. A checked item must have automated evidence from `scripts/audit-v2-completion.ts`, `scripts/audit-v2-adversarial.ts`, the unit/E2E suite, or a recorded browser/build check.

The complete 18-yellow/25-red audit matrix is maintained in [`V2_PRODUCT_COMPLETION_MATRIX.md`](./V2_PRODUCT_COMPLETION_MATRIX.md). This narrow release gate must not be read as proof that external cloud/account/team capabilities or unavailable source facts are complete.

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
- [x] V2-PRODUCT-014 — Paper records can provide bilingual learn/method/strict tutorials; SEED is the first evidence-backed template and deep-links into the workbench.

## Evidence and data contract

- [x] V2-DATA-001 — Content Collections include models, papers, claims, benchmarkRuns, guides, and changeEvents.
- [x] V2-DATA-002 — Guide content is read from the guides collection in both locales.
- [x] V2-DATA-003 — Semantic missing-value states remain explicit and are not coerced to false or zero.
- [x] V2-DATA-004 — License risk and evidence-quality signals remain visible in decision output.
- [x] V2-DATA-005 — Content ingestion guarantees deterministic source IDs from canonical URLs while preserving explicit source IDs; the migration script uses the same algorithm.

## Visual and accessibility quality

- [x] V2-CSS-001 — Tokens are the style source and global CSS is only an import layer.
- [x] V2-A11Y-001 — Theme controls expose current state and dispatch theme changes to charts.
- [x] V2-A11Y-002 — Reduced motion and sticky comparison fields are present.
- [x] V2-A11Y-003 — Landscape data points remain keyboard reachable.
- [x] V2-I18N-001 — UI changes are synchronized in Chinese and English.

## 2026-08-09 adversarial closeout

- [x] V2-CLOSEOUT-001 — A model revision is copyable only when a source carries a real `revision` and explicitly supports `reproducibility.model_revision`; release dates cannot be fabricated into revisions.
- [x] V2-CLOSEOUT-002 — Paper method summaries are semantically separate from model-selection rationale; missing evidence-checked summaries remain visibly unverified.
- [x] V2-CLOSEOUT-003 — Paper Explorer has dedicated Benchmark and Checkpoint filters in addition to role/family/code/weight/reproduction filters.
- [x] V2-CLOSEOUT-004 — Model Quick View is shared at AppLayout level outside the local model/workspace hosts and loads one model on demand from a static per-model JSON route.
- [x] V2-CLOSEOUT-005 — Model detail has research-first section navigation plus human-readable unresolved facts with research-impact explanations.
- [x] V2-CLOSEOUT-006 — Family history notices are based on non-current models actually used by papers, not whether the current flagship appears in a paper.
- [x] V2-CLOSEOUT-007 — Paper model roles and family checkpoints can open Quick View and full model details.
- [x] V2-CLOSEOUT-008 — Substitute Lab simultaneously reports strict-reproduction, method-reproduction, and modern-rerun verdicts.
- [x] V2-CLOSEOUT-009 — Mobile Compare uses dedicated per-field comparison cards and does not depend on the desktop wide table.
- [x] V2-CLOSEOUT-010 — Guides and model detail distinguish catalog hardware tiers, heuristic VRAM planning estimates, and measured hardware facts.
- [x] V2-CLOSEOUT-011 — Data-issue reporting opens a prefilled GitHub issue with model/page/source context.
- [x] V2-CLOSEOUT-012 — The closeout invariants are represented in Vitest, Playwright, and the adversarial audit so future Agents cannot satisfy the gate by merely creating unused components.

## Release verification

- [x] V2-VERIFY-001 — `check`, `validate`, `audit`, unit tests, build, E2E, and the V2 completion/adversarial audits are the required release gate.
- [x] V2-VERIFY-002 — Cloudflare-root static output and root-path links are the deployment contract; `/basemodel/` is no longer maintained.
- [x] V2-FACTS-001 — Facts that cannot be verified from repository evidence remain explicitly marked as unknown.
