# WP-D7 · Native scientific SVG reading and Landscape labels

**Work PR:** [#898](https://github.com/mykcs/basemodel/pull/898), Draft stacked above #895. **Status at authoring:** source + static build completed in an isolated candidate; exact-head cloud screenshots, full WebKit exit code, and protected Preview are pending. Do not write ACCEPT until the corresponding run and PNG are inspected.

## Live source and interaction

1. Existing `MetricEvidenceFigure.astro` had already gained the 1200px interactive SVG reader and explicit expanded-only horizontal-scroll hint before this work, with a mobile squeeze-negative test. Do not reintroduce the older unpublished Blob or replace concurrent code.
2. Two separate, still-compact Q17 scientific chart owners gained `NativeSvgChartReader.astro` wrappers: `OpenEvoQ17DirectApplyAnalysis.astro` (760px Score and 400px loss) and `OpenEvoQ17FrontierRoadmap.astro` (700px historic Score and 360px loss). These are four *original inline SVGs*, not redrawn results. The native checkbox/label works with JavaScript disabled; the label changes from `放大查看刻度` to `收起原尺寸图`, the hint appears only in the expanded state, and the scroll is local to a keyboard-focusable chart viewport. No point lists, viewBoxes, source facts or coordinates changed. Existing #898 Q17 Frontier 12px/interface-label and weight migration is retained; this work does not replace it.
3. `LandscapeECharts.tsx` upgraded the previously literal **11px** ECharts legend to 14px and set 13px x/y tick labels plus 14px tooltip text. It changes presentation settings only, not series data or symbols. The full chart lives behind the user-selected **完整视图**, not the default learning list; the browser test explicitly opens that real state.

## Verification and falsifiability

The extended `tests/e2e/sitewide-typography.spec.ts` runs Q17 at **390 / 768 / 1440px × light/dark** for both actual routes, checks all four native viewBox widths, computed SVG/tick scale, local scroll, hint state, page containment and collapse; screenshots include the **full Figure including caption, control, hint and graph**, plus an unmodified viewport PNG and JSON. It adds one phone negative: inject the old `width:100% !important` SVG shrink, require the **same** native-axis predicate to fail, then remove the injection and require it to pass. A no-JS keyboard Space test exercises the native checkbox.

The Landscape test opens the real ECharts full view, measures computed SVG `text` sizes and retains 390/1440px light/dark PNG+JSON. A 9px label injection must fail the same rule and recover when removed. Existing #898 historic Q17 axes test and its 9px/7px negative stay intact; neither suite was deleted or relaxed.

At the parent `02950bbede0a00c704d4f004af57406e76354a75` before concurrent changes, `npm run build` passed: **268** static routes, **73** figures, **130** tables; **36** CSS owners, **61** standalone CSS literal-size candidates. That is a static/build result, not cross-browser acceptance. After the concurrent branch advanced to `cbc2bc56682ed2647cf0d7b26afd326a986b76df` and `391cae899a89bb881ee239376f1492f7a78af6e9`, local changes were safely reapplied on top, preserving its separate Q17 12px glyph migration, its extra disclosure-open screenshot fix and both expanded browser test blocks. The new exact merged candidate requires a fresh `verify:deploy`, `build`, and full CI.

An isolated pair of **PR #898-only jobs** in the existing `.github/workflows/public-pr-ci.yml` runs the full `test:ui:all --project=webkit` selection on four GitHub-hosted WebKit shards. The workflow binds `git rev-parse HEAD` to the PR head SHA, preserves per-shard run logs, exit status, screenshot/JSON artifacts, and requires all four shards through an independent `typography-full-webkit-gate`. It contains no write token, repository secrets, deploy or Production action. The repository's `deploymentArchitecture.test.ts` requires **exactly three workflow files**: an attempted fourth workflow was rejected by that real invariant and was removed rather than weakening its test. The existing workflow also intersects #814's independent static-build optimization; these new jobs are appended after its currently untouched acceptance gate and must be reconciled if #814 lands. Its PASS must be verified on the final HEAD, not assumed from its presence.

## Hold boundaries

- `SeedOpenEvoProgressBriefing.astro` (8 fixed 16:9 figures) and `OpenEvoEffectiveStateGdrLoraStudy.astro` (derived evidence figures) overlap #806/#827/#818/#805 or #820. They were **not** opportunistically rewritten. Full 557-case WebKit from the older handoff remains **PARTIAL (539 observed at most)** until the fresh full-suite run completes; current listing may contain more cases.
- The Project Report scientific claims/data and figures' coordinate sources remain untouched.
- No Production deployment, PR merge/retarget, or Mac/RDC use. The historical Vercel READY deployment is not an exact candidate Preview.
- Visual verdicts are pending actual cloud artifact inspection: **NEEDS HUMAN REVIEW** rather than a fabricated green stamp.
