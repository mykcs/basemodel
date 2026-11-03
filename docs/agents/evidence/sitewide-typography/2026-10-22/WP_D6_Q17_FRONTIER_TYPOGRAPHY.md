# D6 — Q17 historical research roadmap + original plot tick typography

Status: **IMPLEMENTED / ACCEPTED for the bounded current-head visual review below**; production source shipped in PR #949.

**Real public route** `/research/seed-openevo/study/capability-exploration/q17-directapply-frontier/`, Astro source `src/components/research/OpenEvoQ17FrontierRoadmap.astro`. This is a *dated historical investigation plan* on September 10, not the later September 11 same-task evidence and not the frozen final panel. Its content and provenance cannot be rewritten in a typography batch.

**Before:** 9 direct hardcoded font-size declarations; 5 decorative `font:` shorthands (18px 800-weight mono editorial kicker/metric heading, 28px 850-weight mono score, 11.5px 800-weight mono experiment index and 10px 700-weight mono SVG axes). 84px hero H2 and ~51px section H2 could overwhelm the surrounding scientific reading hierarchy. Mobile 23px score override was an additional fixed-size divergence.

**After:** **13 semantic `--type-*` declarations, zero font shorthands, zero unclassified size declarations in THIS single owner**. The nested H2 uses `--type-article-page` and later section H2 uses `--type-article-section` (true hierarchy, not giant decorative page heading). Ordinary dates, metrics and experiment indices use interface family / weight 600–650; metric score `--type-article-section` with tabular digits; source and figure caption 16px. True SVG axes use dedicated `--type-plot-label` (12px), not prose-size, with SVG glyph/bbox tests. Removed now-redundant <=860px number-size override. No claims, freeze dates, original plot values/data/axes, labels, colors, series, source links or unfinished placeholders changed.

New `src/lib/q17FrontierTypography.test.ts`: 2 source ownership/falsification checks. Existing CI-wired `tests/e2e/sitewide-typography.spec.ts`: six 390/768/1440 × light/dark real-route cases measuring 14 text roles, original 2 SVG charts and all 11 axis annotations including SVG getBBox containment, four real metric cards and four intentionally unrun placeholders, preserved historic facts; PNG/JSON output. Same acceptance predicate rejects injected 9px mono metadata and 7px plot ticks and passes after restoration.

Historical pre-release gate: do not mark D6 accepted before exact-head Public CI and hosted PNG+JSON review. At that point other pages, reader acceptance, WebKit and a dedicated Vercel Preview remained outstanding; the current bounded verdict is recorded below.

## Historical R1 actual artifact review — 2026-10-22

Reviewed source: `30a8d2ec0b090e77dcb33f1ba5159dbf15e8c885`,
[Public PR CI 39737273849](https://github.com/mykcs/basemodel/actions/runs/39737273849).
Live re-read confirmed deterministic PASS, 8/8 Chromium and 4/4 WebKit PASS,
including both aggregate gates. These results apply to that SHA only.

**D6 verdict: ACCEPT for this bounded visual review.** Q17 Frontier and DirectApply
were inspected through 12 contact sheets containing 108 distinct source PNGs
(two engines × 390/768/1440 × light/dark, nine crops per combination); six source
PNGs were additionally opened at original resolution. This is 108 source images
represented in sheets, not 108 individual image-open calls. Hero, metric cards,
historical charts, captions, zoom controls and local-scroll hints showed no new
overlap or clipping defect. Twelve D6 JSON files bind the source SHA and retain
14 text roles, 11 axis labels at 12px, zero document overflow, four metrics and
four unrun placeholders. Historical plan, later same-task evidence and final-panel
claims remain distinct. No production CSS, scientific data or source coordinates
were changed in this review.

Artifacts: all WebKit Q17 images/JSON are in `12408360486`; Chromium samples are
in `12407263556`, `12406834254`, `12407254484`, `12407519016`, `12408215302`,
`12407263613`, `12407519053`, `12407113941`. All belong to the run above.

**Historical D7 evidence FIX:** native-reader JSON was attached only to the test reporter,
not written into the uploaded test-results tree. WebKit original-viewport PNGs
also captured before smooth scrolling reached the top. A test-only followup
writes the JSON to outputPath and requires instant scroll plus scrollY=0 before
capture. The followup must receive its own exact-head CI and artifact review;
the earlier green run does not validate the new commit. Independent reader
comprehension and whole-site acceptance remain outside this D6 verdict.

## Current release-head R1 review — 2026-10-24

Current source reviewed: `f674206d7fd91151103cdc1f2d0be0cf6c402640`, PR #949, with
exact-head Public PR CI [run 40060099546](https://github.com/mykcs/basemodel/actions/runs/40060099546)
and full Cloud Figure Visual Review [run 40060098996](https://github.com/mykcs/basemodel/actions/runs/40060098996).
The latter's WebKit artifacts include the Q17 Frontier and DirectApply native-reader
PNG/JSON matrix. I opened six Q17 Frontier chart states (390/768/1440 × light/dark)
and six native-reader examples spanning both Q17 routes and phone/tablet/desktop.
The original charts, captions, focusable controls and scroll hints are visible;
mobile overflow stays inside the explicit local chart viewport. Retained JSON binds
the same SHA, reports 12px plot labels and zero document overflow. No scientific
value, chart coordinate or claim changed in this review.

**Current bounded D6 verdict: ACCEPT.** This covers the named Q17 page/chart and
native-reader samples only; it does not claim that every site route or typography
declaration was visually reviewed. Production acceptance is separately recorded
in the 2026-10-24 handoff in `docs/agents/LATEST.md`.
