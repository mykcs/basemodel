# Current candidate inline/JS disposition

The current source sweep has **81 raw discovery hits**, all individually identified in [inventory.json](inventory.json): 10 audit false positives, 40 non-typographic geometry/presentation expressions, four currently unreachable producers, 24 existing/migrated role bindings and three specific scientific SVG reader exceptions. The latest additional hit is Papers header minWidth120/overflowWrap normal, tested with and without JavaScript. None is silently removed from the raw UNKNOWN discovery output.

The complete CSS/Astro role ledger and its limitations are in [README.md](README.md) and [source-disposition-ledger.json](source-disposition-ledger.json). Source classification, migration implementation and exact-head visual acceptance are separate statuses.

---

## Historical 58-hit snapshot (superseded counts)

# Typography inline/JS candidate triage — 2026-10-22

This is a **source-level triage**, not a claim of 58 accepted screenshots. Reproduce with `npm run build && node scripts/audit-sitewide-typography.mjs --json <output-path>` on the checked-out exact PR HEAD. The inventory's `unresolvedSurfaces` regex deliberately flags anything that looks like inline/JS `style`; it does not prove a dynamic `font-size` was emitted. The isolated candidate based on `02950bb` plus the independent four-chart reader returned **58** such hits in 23 file owners (57 in the parent), including the new `--native-svg-width` plot-geometry variable.

Each owner was inspected at the reported source lines. These 58 items have the following *source intent* disposition: **48 JUSTIFIED_EXCEPTION** (data-dependent geometry, timing, SVG/CI position, layout visibility/color/spacing), **1 MIGRATE (implemented)** (Landscape ECharts' 11px legend → 14px with 13px chart axes), and **9 AUDIT_FALSE_POSITIVE** (the literal `data-paper-citation-style` attribute and parser/test fixtures). False positives are not mislabeled as dead production declarations. Browser evidence for legitimate geometry still needs collection.

| Source owner | Hits | Decision / why |
| --- | ---: | --- |
| `Lyg2171ServerOverview.astro` | 8 | Exception — proportional storage-bar width, not font styling |
| `NativeSvgChartReader.astro` | 1 | Exception — `--native-svg-width` intrinsic 760/700/400/360px plot geometry |
| `OpenEvoFairComparisonExplainer.astro` | 4 | Exception — `--delay` staggered animation duration |
| `OpenEvoHarness2MiniStudy.astro` | 2 | Exception — experiment percentage bar widths |
| `OpenEvoQ17DirectApplyAnalysis.astro` | 1 | Exception — candidate agreement bar width (audit line offset is approximate) |
| `OpenEvoSdLoraScaling.astro` | 3 | Exception — runtime component breakdown flex-basis |
| `OpenEvoWebShopResultsQuestions.astro` | 2 | Exception — confidence interval left/width and point position |
| `PaperIntervalPlot.astro` | 6 | Exception — scientific interval/axis positioning and transforms |
| `LayerMap.astro` | 1 | Exception — layer index custom layout variable |
| `VisualRoute.astro` | 1 | Exception — step-count column variable |
| `_bodies/model-detail.astro` | 2 | Exception — existing fixed 16px vertical separation (not text size); preserve model layout owner |
| `_bodies/not-found.astro` | 1 | Exception — 50vh minimum empty-state height |
| `study/advisor-questions/index.astro` | 1 | False positive — `data-paper-citation-style` string, no inline style |
| `study/minimax-teacher/index.astro` | 9 | Exception — existing percentage/token bar widths |
| `study/openevo-methods/index.astro` | 1 | False positive — `data-paper-citation-style` string |
| `study/parameter-memory-results/index.astro` | 1 | False positive — `data-paper-citation-style` string |
| `LandscapeECharts.tsx` | 2 | 1 migrated real ECharts `fontSize:11` legend (now 14); 1 exception — tooltip text-color HTML interpolation |
| `EnvironmentExplainers.tsx` | 1 | Exception — initial hidden position of draggable visual apple |
| `ResearchExplainerPrimitives.tsx` | 5 | Exception — progress/bar width and grid index variables |
| `capabilityLobbyScopedTypography.test.ts` | 1 | False positive — parser's test fixture string |
| `ceilingResearchTypography.test.ts` | 3 | False positive — regex strings asserting size/shorthand detection |
| `minimaxH146TeacherEvidence.test.ts` | 1 | False positive — negative fixture regex |
| `openEvoAdvisorTenQuestionsReport.test.ts` | 1 | False positive — CSS file path string |

**Counts reconcile:** 48 exceptions + 1 migrated presentation size + 9 scanner false positives = 58 raw hits. One `style` expression in a chart does **not** warrant deleting a scientific encoding; retain evidence-based geometry.

## Larger semantic owner queue (not falsely closed)

The same parent candidate output contained **3,668** AST declarations in CSS/Astro style scopes; **1,981 distinct Astro literal-size/shorthand candidates** and **61 independent `.css` direct literal sizes**. These are candidate counts, **not** 2,042 proven typography defects or 2,042 reviewed consumer mappings. The source audit still marks most selector `consumer`, `semanticRole` and `decision` as `UNKNOWN`/`null`; this receipt does **not** convert those to `unclassified=0`.

Highest Astro owners at that scan: `SeedOpenEvoProgressBriefing.astro` 277 (fixed 16:9, parallel #806/#827/#818/#805), `OpenEvoFairComparisonExplainer.astro` 56, `OpenEvoSuccessorReport.astro` 44, `OpenEvoFirstRunMap.astro` 39, `WebShopSeedSplitFigure.astro` 39, `OpenEvoQ17DirectApplyAnalysis.astro` 36, `OpenEvoHarness2MiniStudy.astro` 35, `WebShopGoalGenerationFigure.astro` 33, `AdvisorTenEvidenceVisual.astro` 30, `OpenEvoExperimentAnalysisPlan.astro` 30, `SeedOpenEvoCanonicalFigure.astro` 29. Priority classification must follow real rendered selectors and readable plot/bbox evidence, not declaration counts.

## Required next evidence

1. Regenerate the complete AST JSON at **final exact HEAD** after CI, track any delta against these baseline values and include its SHA/dirty status.
2. Classify every relevant scoped CSS selector/consumer and retain *real* pending concurrent conflicts; avoid overwriting the Briefing/EffectiveState owners.
3. Check 390/768/1440 light/dark and *actual* full Figure/table boxes in Chromium and WebKit. Treat absent browser evidence as **NEEDS HUMAN REVIEW**, not `JUSTIFIED` visual acceptance.
