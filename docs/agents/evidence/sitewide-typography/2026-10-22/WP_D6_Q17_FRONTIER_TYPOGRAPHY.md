# D6 — Q17 historical research roadmap + original plot tick typography

Status: **IMPLEMENTED / PENDING exact-head CI and hosted PNG review**; sole PR #898 Draft on #895.

**Real public route** `/research/seed-openevo/study/capability-exploration/q17-directapply-frontier/`, Astro source `src/components/research/OpenEvoQ17FrontierRoadmap.astro`. This is a *dated historical investigation plan* on September 10, not the later September 11 same-task evidence and not the frozen final panel. Its content and provenance cannot be rewritten in a typography batch.

**Before:** 9 direct hardcoded font-size declarations; 5 decorative `font:` shorthands (18px 800-weight mono editorial kicker/metric heading, 28px 850-weight mono score, 11.5px 800-weight mono experiment index and 10px 700-weight mono SVG axes). 84px hero H2 and ~51px section H2 could overwhelm the surrounding scientific reading hierarchy. Mobile 23px score override was an additional fixed-size divergence.

**After:** **13 semantic `--type-*` declarations, zero font shorthands, zero unclassified size declarations in THIS single owner**. The nested H2 uses `--type-article-page` and later section H2 uses `--type-article-section` (true hierarchy, not giant decorative page heading). Ordinary dates, metrics and experiment indices use interface family / weight 600–650; metric score `--type-article-section` with tabular digits; source and figure caption 16px. True SVG axes use dedicated `--type-plot-label` (12px), not prose-size, with SVG glyph/bbox tests. Removed now-redundant <=860px number-size override. No claims, freeze dates, original plot values/data/axes, labels, colors, series, source links or unfinished placeholders changed.

New `src/lib/q17FrontierTypography.test.ts`: 2 source ownership/falsification checks. Existing CI-wired `tests/e2e/sitewide-typography.spec.ts`: six 390/768/1440 × light/dark real-route cases measuring 14 text roles, original 2 SVG charts and all 11 axis annotations including SVG getBBox containment, four real metric cards and four intentionally unrun placeholders, preserved historic facts; PNG/JSON output. Same acceptance predicate rejects injected 9px mono metadata and 7px plot ticks and passes after restoration.

Do NOT mark D6 accepted before exact-head Public CI and inspecting hosted PNG+JSON. Other pages, figure/reader cold acceptance, WebKit and final dedicated Vercel preview remain outstanding. No Production or RDC.
