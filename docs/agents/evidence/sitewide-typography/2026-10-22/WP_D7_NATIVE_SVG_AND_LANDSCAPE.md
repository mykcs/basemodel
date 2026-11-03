# WP-D7 · Native scientific SVG reading and Landscape labels

**Work PR:** historical implementation began in [#898](https://github.com/mykcs/basemodel/pull/898); production source shipped in [#949](https://github.com/mykcs/basemodel/pull/949). The dated authoring and iteration notes below are historical; current visual acceptance is recorded in the 2026-10-24 section.

## 2026-10-22 exact-SHA cloud iteration (after initial authoring)

- The 12-file feature/evidence commit [f7251f31](https://github.com/mykcs/basemodel/commit/f7251f31adcb2314f94db310fe1bf3a340873f0f) was published safely onto `391cae8` without replacing concurrent Q17 work. Its [public CI run 39731928649](https://github.com/mykcs/basemodel/actions/runs/39731928649) **failed**. Full WebKit ran four actual shards: shard 1 passed, shards 2–4 did not; the eight standard Chromium shards and the deterministic gate also failed. Do not describe this run as an acceptance pass.
- Root causes: the existing public plan test legitimately expects three pinned shallow-checkout declarations (the new optional WebKit job added a fourth); two new browser tests interacted before `client:visible` hydration or while Q17's historical `<details>` was collapsed. WebKit shard 4 observed the old carrier-type witness before the disclosure became visibly ready. Those checks are repaired **without weakening their typography predicates** in the followup patch. WebKit shard 2's `scroll-linked explainer` check observed a 189px drift: its `scrollTo({behavior:'auto'})` inherited sitewide smooth scrolling, so the test baseline could be sampled before WebKit's native animation finished. Using `behavior:'instant'` isolates the intended passive event without loosening the <12px jump rule. This must be confirmed by fresh CI, not assumed.
- Vercel deployment [`dpl_3uLwg12UqGJveN3krDcNqFYtyPzF`](https://basemodel-ui-preview-20260811-958p8onrr-wangrui92-team.vercel.app) is a **READY review-only Preview** bound to exact `f7251f31`; `target` is Preview (null, not Production). An authorized SSO-protected fetch returned actual HTML (not the login page) for Home, both Q17 routes and Landscape. The Q17 page includes the native reader and `<meta name="robots" content="noindex,follow">`. This is a source/HTTP verification, **not** pixel-by-pixel screenshot acceptance and **not** the final future SHA.
- The failed run preserved cloud artifact ZIPs with PNG/JSON/error trace and WebKit exit codes. Actual per-route 390/768/1440 Light/Dark screenshots and 100% green WebKit remain pending after followup. The failed run and remaining scientific plot owners are recorded instead of being erased by a later green result.

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

## Followup: exact 58201cf failure diagnosis

Run [39733958050](https://github.com/mykcs/basemodel/actions/runs/39733958050) completed with deterministic PASS, Chromium shards 5/6/7 PASS and 1/2/3/4/8 FAIL; full WebKit shards 1/2 PASS, 3/4 FAIL. All five Landscape failures in both engines measured 12px SVG labels against the unchanged 12.9px minimum. The option set 13px tick labels but left axis-name and legend-pagination defaults unspecified. The corrective candidate sets those roles and the chart's inherited interface family/default size explicitly; scientific series and coordinates remain unchanged. Label receipts now identify every SVG text and its computed size.

The sole other full-WebKit failure was OpenEvo 768px dark: the trace resolves a genuinely closed carrier details element (open=null), not a boolean-attribute serialization mismatch. Its preceding tall screenshot moved the page and restored sticky controls. The typography witness now activates the native summary with keyboard Enter, checks closed→open state and visible carrier content; it does not force open state, retry clicks or relax any font/geometry threshold. Existing pointer-interaction tests remain.

This is a source correction, not a new PASS receipt. Fresh exact-head public and full-WebKit runs, screenshots and Preview acceptance remain required. Vercel Sandbox creation returned 402 Hobby quota exhausted; the scoped CLI fallback returned 403. No billing, permissions or Production settings were changed. GitHub Actions remains the authorized test lane.

## R1 actual artifact review and evidence repair — 2026-10-22

Reviewed source: `30a8d2ec0b090e77dcb33f1ba5159dbf15e8c885`;
[Actions 39737273849](https://github.com/mykcs/basemodel/actions/runs/39737273849)
was freshly confirmed successful: deterministic, 8 Chromium shards, 4 full-WebKit
shards and both aggregate gates. **R1 overall remains PARTIAL until replacement
artifacts below are reviewed.** No Production deployment, merge, retarget,
scientific data, chart coordinates or production styling changed.

| Surface / evidence | Actual review | Verdict |
| --- | --- | --- |
| Four native Q17 SVGs | Both engines × 390/768/1440 × light/dark: 48 distinct full-figure PNGs through eight six-image contact sheets. Controls, captions and expanded-scroll hints visible; phone right edge intentionally lives in the local scroll viewport. | ACCEPT for sampled visible state |
| Q17 page-top witness | WebKit viewport images were still down-page after smooth scroll. This is evidence timing, not proof of a product rendering bug. | FIX |
| Native-reader measurement JSON | `info.attach(body)` did not produce a retained JSON file in the downloaded ZIP. The predicate only measures the first text's scaled size, not every label's getBBox. | FIX retention; all-label geometry not claimed |
| Landscape full view | Eight PNGs: both engines × 390/1440 × light/dark. Axes, legend, captions readable; phone legend pagination visible, no new typography clipping observed. | ACCEPT for sampled visible state |
| Landscape tablet / measurement JSON | No 768 case existed; JSON likewise only reporter-attached. | FIX |
| Briefing chart 0 / EffectiveState image 0 | Separate reviewer opened 24 source PNGs through four contact sheets, both engines × six width/theme combinations. Chart 0 visually readable; image 0 is captured at the far-right scroll state and cannot prove whole-image readability. Remaining chart/image indices were not inspected in this R1 sample. | chart 0 ACCEPT; image 0 NEEDS HUMAN REVIEW |

Native images overlap the Q17 review recorded in D6: do not add 48 to its 108
as unique images. Landscape eight and Briefing/EffectiveState 24 are separate.
Artifacts: WebKit native + Landscape `12408360486`, Briefing `12408566483`;
Chromium Landscape `12407254484`, `12406834254`, `12407263556`, `12407113941`.
WebKit logs confirm the native-reader matrix, old-squeeze falsification and
No-JS keyboard Space test passed; screenshots alone do not prove interactions.
Landscape pagination/tooltip/theme-transition interaction is not newly accepted.

At the time this historical note was written, the minimal test-only repair retained all original positive/negative predicates,
writes SHA-bound native-reader and Landscape JSON into outputPath while retaining
reporter attachments, adds Landscape 768 light/dark, and waits for scrollY=0 after
an instant scroll before the unmodified viewport capture. Independent patch
review and TypeScript syntax transpilation passed; full exact-head CI and actual
replacement PNG/JSON review are pending. Briefing's separate reporter-only JSON
and its uninspected figures were explicit followup scope at that time, not a fabricated PASS.

Correction-to-action witness: missing retained JSON / premature scroll screenshot
-> `tests/e2e/sitewide-typography.spec.ts` and current artifact-upload globs
-> downloaded exact-SHA ZIPs plus source inspected
-> repair outputPath retention and stable capture, rerun same predicates
-> any new SHA, missing file or nonzero browser exit invalidates acceptance.

## Current release-head R1 visual review — 2026-10-24

Reviewed source: `f674206d7fd91151103cdc1f2d0be0cf6c402640`, PR #949;
exact-head Public PR CI [run 40060099546](https://github.com/mykcs/basemodel/actions/runs/40060099546)
and full Cloud Figure Visual Review [run 40060098996](https://github.com/mykcs/basemodel/actions/runs/40060098996)
passed. Current WebKit PNG/JSON artifacts are bound to that candidate.

| Requested R1 surface | Actual review | Verdict |
| --- | --- | --- |
| Q17 Frontier and DirectApply native SVG readers | Six current PNG examples opened across both routes and phone/tablet/desktop, plus the six Q17 Frontier chart states. Controls, captions, labels and scroll hints are visible; mobile's wide scientific SVG scrolls inside its own reader. The full route matrix JSON reports 12px labels and zero document overflow. | ACCEPT for the requested samples |
| Landscape full chart | All six current 390/768/1440 × light/dark full-chart PNGs opened. Axes, legend, caption and phone legend pagination are legible; JSON records 13–14px labels and no document overflow. | ACCEPT for the requested matrix |
| Publication native-reader figures | Twelve segmented screenshots opened across mobile and desktop, including first/middle/end horizontal positions of the wide WebShop score plot and additional figure examples. The reader explicitly explains left/right scrolling; the wide SVG's axes and plotted points remain readable in the local viewport. Six `publication-glyphs.json` records bind the candidate SHA and cover all eight figures across viewport/theme combinations, with labels at least 12px and no page overflow. | ACCEPT for native-reader typography and local-scroll behavior |
| Briefing chart/image readers outside the requested R1 page set | Twenty screenshots opened: eight chart readers and eight image readers at 390 light, plus indices 0 and 7 at 1440 light. Chart samples are readable. Image samples show only a horizontally scrolled segment, so full-span image legibility is not established; other indices/states were not reviewed. | PARTIAL; image span NEEDS HUMAN REVIEW |

**R1 requested D7 scope: ACCEPT.** This does not clear the separately held
Briefing/EffectiveState image-reader scope above, whose owners overlap other PRs.
The review changed no production source or scientific data. The current PNG/JSON
artifacts—not the 2022 historical SHA receipts—support these verdicts. Merge and
Production receipts are recorded in `docs/agents/LATEST.md`.
