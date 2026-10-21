# Typography — historical per-arm results shared scaffold

**Scope:** `src/components/research/OpenEvoExperimentResultsScaffold.astro`, an active component used by at least `/research/seed-openevo/study/results/3b-minimax-analysis/`, `7b-self-analysis/` and `7b-minimax-analysis/`. Scoped CSS-only migration; the component's script, markup, scientific text, result numerators/denominators, checkpoint references and all links remain unchanged.

**Baseline source:** #898 `d33057b7f11e1c5cc626e58fd50c99fdce7267b8`. This is a staged review branch before integration. The stack parent #895 and open #806 both touched this component previously, but their distinct content was preserved verbatim; later integration must recheck live owner HEAD and avoid overwriting concurrent edits.

## Why this is reader-facing, not arbitrary debt

Actual Chromium `getComputedStyle` before changes, using three real static routes and opened in-page historical disclosures:

| Reader role | Before | After expected source role |
| --- | --- | --- |
| Historical-method warning paragraph | 12.16px | `--type-body` = 16px |
| Stage/attempt explanation descriptions | 12px | `--type-body` = 16px |
| Five-step gate explanation (7B self) | 11.2px | `--type-body-small` = 15px |
| Resource-evidence footnote (7B self) | 11.2px | `--type-body-small` = 15px |
| Saved-checkpoint explanation | 12px | `--type-body` = 16px |
| Scientific table cell / heading | 13.12px / 12.8px | `--type-table` = 15px |
| Process explanation | 13px | `--type-body-small` = 15px |
| Secondary provenance label | ~10–12px in multiple areas | Existing `--type-meta` = 13px |

The original stylesheet contained **30** literal `font-size:` declarations and **11** literal-size `font:` shorthands (41 total by this narrow source method). After the change it retains **six** intentional literal sizes, e.g. editorial Hero `clamp()` and the resource metric display, with **zero** remaining literal-size `font:` shorthands. Thus **35 declarations migrated**; 39 scoped rule/property changes plus a 1180px grid-breakpoint layout guard. This file-specific count is not the sitewide audit number.

## Geometry and invariants

- Historical gate/process graph becomes two columns between 861–1180px (instead of five very narrow nodes); at <=860px existing one-column route and vertical connectors remain. The 1180px two-column intermediate state hides continuous one-way connectors rather than drawing misleading broken arrows.
- Tables retain the original wrapper’s **local** horizontal scrolling, with no new page-wide horizontal scroll. The existing `@media(max-width:640px)` reading layout remains.
- Ordinary numbers and word labels use BaseModel's existing interface font; technical code remains monospace. Scientific assertions, missing endpoint values, captions, citation content and provenance are preserved.
- No new `!important` or parallel token system.

## Validation contract

- Exact staged code originally built **268 static HTML pages**, including **73 figures** and **130 tables**; static Typography audit PASS.
- `tests/e2e/typography-historical-results-scaffold.spec.ts` checks three real routes × 390/768/1440px × light/dark in Chromium and WebKit. **19/19 Chromium and 19/19 WebKit PASS** on the production CSS with a subsequent test-only TypeScript cast fix.
- Computed `fontFamily`, font size, line height, local table scroll, viewport overflow and conditional 7B checkpoint explanations are directly checked. The **same rendered predicate** detects injected 10px explanation, 9px table data and a broken local-scroll wrapper; test-only mutations are always restored.
- Real screenshot review: checked a 390px light five-step genealogy and the desktop dark scientific results table; no observed label collision or whole-page overflow. Temporary cloud screenshots are not durable GitHub artifact links; ensure exact-head CI archives fresh screenshots on integration.
- A test-runner closure error and an Astro `HTMLDetailsElement` typing error were detected by separate browser and deterministic gates, corrected, and **never bypassed by weakening thresholds**.

**Local engineering validation:** source and browser-test revision `ea7a9cfe` passed `npm run verify:deploy` (exit 0), `npm run build` (268 pages), 19/19 Chromium and 19/19 WebKit focused tests. The following documentation-only commits still require combined PR validation. **Remaining:** integrate safely into #898, pass integrated exact-HEAD Public CI, archive and inspect hosted screenshots, then inspect the accurate-HEAD Vercel Review Preview. Production is unchanged; this work package is not whole-site completion.
