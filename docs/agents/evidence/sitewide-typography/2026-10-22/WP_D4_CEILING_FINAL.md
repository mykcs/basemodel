# WP-D4 — Ceiling-1.0 frozen 7B final report typography

Status: **IMPLEMENTED / PENDING exact-head CI + hosted screenshot review**. Original Draft PR #898 remains stacked onto #895; no merge or Production release.

**Actual mounted page** `/research/seed-openevo/study/capability-exploration/stage2-ceiling/`; source owner `src/components/research/OpenEvoCeilingStrategy.astro`. Its opening final panel reports 49.33/100, 58/128 exact success, and explicitly warns that the SEED 89.7 reference is not a causal paired local rerun. Study's scientific text, every score, progress snapshot, data source, link, chronology, sample size and comparison rows remain unchanged.

**Scoped CSS classification BEFORE:** 22 direct `font-size` declarations + **7 font shorthands** using 800/820/850/750 monospace status/index/metric/data labels. Comparison header was `.85rem` (13.6px) and row names `.88rem` (14.08px) despite a `data-copy-review` scientific page.

**AFTER:** 29 direct declarations, **27 existing `--type-*` tokens**, **2 justified responsive article H1/H2 clamps**, **0 old `font:` shorthands and 0 undecided size values WITHIN THIS OWNER**. Ordinary budgets, index numbers, statuses, table names and labels use the interface font with 600/650 roles and true 16px minimum source text. Important budget values use the existing `--type-article-subsection` (20px) and tabular digits, not an 850-weight monospaced decoration. Long archive revisions remain technical `<code>` content and keep their original identity/links. No new tokens, global override or production `!important`.

**Executable gates:** `src/lib/ceilingResearchTypography.test.ts` inventories 29/27+2 rules and rejects restored 9px shorthand. `tests/e2e/sitewide-typography.spec.ts` is already included in canonical Public PR CI and adds 6 mounted viewport/theme measurements (390/768/1440 light/dark) plus an injected-negative test. Each browser case expands archive details; checks role size/family/weight, final figures and comparison data rows, desktop/phone geometry, and requires the **table wrapper, NOT the document**, to scroll when narrow. It writes native PNG for final cards and table plus JSON. The same acceptance predicate must reject 9px false status/table text and accept restored style.

No part of this classification claims all 268 routes or all remaining Astro source debt resolved. WebKit, full cross-component screenshots, final isolated exact-head Vercel Preview and cold reader review remain pending.


## Screenshot integrity follow-up (2026-10-22)

The first Chromium `6832a9d9` artifact visual review opened the actual 390-light final-card crop and 768-dark crop: sticky `.research-navigation` overlaid the very top card text **because Playwright element screenshot scrolls into the sticky header's paint area**. They were marked **NEEDS CAPTURE FIX**, not visually accepted, even though the visible rest of the typography was readable. The table crops were legible and their horizontal clipping at 390 is expected inside the independently scrollable table wrapper (3 columns, 4 comparison rows). The first PR run was later canceled when a parallel agent appended the unrelated MetricEvidenceFigure zoom follow-up (`2fdc6b90`) on the SAME #898 branch; that code and its test edits remain preserved.

The test now records an **unaltered top viewport PNG** for each viewport/theme, and for the two TARGETED element crops hides only `.site-header,.research-navigation` using Playwright's *capture-only* `style` option **after all original-page CSS/geometry/number checks**. No product nav behavior, production CSS or test expectation is altered. A **new exact-head full Public PR CI pass and fresh visual inspection** are mandatory before accepting D4. Don't reuse the partial/canceled old run or the contaminated images as final approval.
