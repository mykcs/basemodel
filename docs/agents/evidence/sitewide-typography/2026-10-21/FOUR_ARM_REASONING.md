# WP2 — four-arm research reasoning typography (2026-10-21)

**Status: TARGETED IMPLEMENTATION PASS; SITEWIDE PARTIAL / NOT ACCEPTED.**
Canonical work PR: [#898](https://github.com/mykcs/basemodel/pull/898), stacked on #895. Source parent at intake: `7e3d5b6ccdec18e565c6d375f9619aad5512cf12`. The parent branch, main, Production, scientific data and other agents' PRs were not modified.

## Reader defect and actual implementation

Actual browser computed styles on `/research/seed-openevo/study/results/four-arm-analysis/` at 390/768/1440px, light/dark, showed the reader-facing **three reasons supporting the experimental comparison** at 12.8px, numbered reasoning labels at 10.88px with decorative mono/800, and the desktop snapshot metadata at 10.88px with mono/800. These are explanatory prose and provenance, not fixed-coordinate scientific axis glyphs.

The sole production edit is `src/components/research/OpenEvoExperimentAnalysisPlan.astro`, using canonical existing tokens in the semantic owner:
- `.reasoning-line li`: `--type-body-small` (15px) and `--type-leading-caption` instead of 12.8px prose.
- `.reasoning-line li span`: `--type-meta` (13px), `--font-interface`, `--type-weight-label` (600), rather than the 10.88px mono/800 marker.
- `.section-kicker`: 13px, interface, weight-label 600, instead of desktop 10.88px mono/800.
- `.reasoning-line figcaption`: `--type-figure-title` (15px) and heading weight 650.

No experimental result, source URL, number, formula, comparison boundary, human-facing claim, or other route component was edited. Mobile already lays the three rationale rows vertically; the edit does not add a global override or `!important`.

## Acceptance performed on the exact candidate source in an isolated cloud checkout

- Git HEAD used to construct candidate: `7e3d5b6ccdec18e565c6d375f9619aad5512cf12`; local source/test Git blob SHA receipts are `a3c72c6e5363b0a0a8ce158bc6bbbbf845b4877d` and `e1f0bcf9e6af0bd310400596e68c6113a859c93f`. GitHub blob objects were checked against these hashes before committing.
- Focused Playwright: **14/14 PASS**, true Chromium + true WebKit: 390/768/1440 × light/dark plus a negative that deliberately restores a 10px explanation/marker and checks that the SAME role predicate rejects it, then accepts the restored normal style. Actual role metrics, no-document-overflow and figure-region screenshots were emitted in the isolated run.
- `npm run build` PASS; `npm run audit:css` PASS; `npm run verify:deploy` PASS with 125 structural test files / **833 tests**; `npm run ui:overflow-preflight` PASS. A first TypeScript run failed on five new test typing mistakes; they were corrected without relaxing assertions; this red→green sequence is deliberately retained as engineering evidence.
- `npm run preflight:ui:plan -- --files src/components/research/OpenEvoExperimentAnalysisPlan.astro,tests/e2e/sitewide-typography.spec.ts` identified **shared** blast radius and required the full UI matrix.
- Full local `test:ui:all` run **did NOT pass**: 950 scheduled, 451 passed, one `tests/e2e/sitewide-math-rendering.spec.ts` route-wide test timed out at its 90s bound during `browserContext.newPage` / `Target.createTarget` on a resource-constrained cloud runner; 495 did not run and several in-flight tests were interrupted. This is a separate test/environment blocker; **not** a WebKit or whole-site PASS. The altered component is not entitled to a threshold or test weakening. Refer to cloud scratch `/tmp/typography-ui-full.log` only while the temporary sandbox remains available.

## Honest inventory and remaining work

A fresh build/source audit of this candidate found 268 generated HTML routes, 73 figures, 130 tables, 36 CSS owners, **61** remaining direct-size literals in independent CSS, **2,278** literal/shorthand candidates in Astro scoped styles (down from 2,281 at handoff), and **56** unresolved inline-style surfaces. These are *unclassified candidates, not 2,395 proven defects*. Current browser evidence is representative, not 268 manual screenshot approvals.

Largest scoped owner `SeedOpenEvoProgressBriefing.astro` has 277 source candidates but overlaps #805/#818/#827/#806; do not make bulk edits while those PRs own it. #806 also overlaps Models/Papers component CSS, #816 overlaps section-heading/global owners, and #901 owns the cloud Figure acceptance lane. Owner reconciliation, scientific/figure/table geometry, remaining semantic CSS classification, current-head hosted CI, full WebKit acceptance, screenshot review, and exact-head isolated Vercel Preview are still necessary.

This receipt does not declare the sitewide Typography task finished.
