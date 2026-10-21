# WP-B3 — Legacy runbook provenance card actual typing

PR #898, base at edit `d33057b7f11e1c5cc626e58fd50c99fdce7267b8`. This is a focused ordinary UI/Guide continuation after B1/B2. True consumer is `src/layouts/AppLayout.astro` conditional `isTodayRunbook` on `/guide/today/`, also localized `/en/guide/today/`. Scope is explicitly an **historical runbook**, not a current server inventory. All warnings, legacy date 2026-08-11 and canonical fuhuo link are preserved.

Owner `src/components/LegacyTodayRunbookNotice.astro` migrates:
- ordinary date from 12.48px **bold monospace** to 13px interface token with conventional tabular date numerals,
- label from 11.52px / 800 and widely tracked uppercase to 13px semantic meta with ordinary restrained weight,
- heading to 20px article-subsection role, legible 16px explanation with standard line-height and 70ch measure,
- canonical source link to 15px UI body-small with semantic label weight.
The existing warning state, desktop date/info grid and phone single-column structure are retained.

`tests/e2e/typography-product-tools.spec.ts` adds 390/768/1440 x light/dark actual DOM/normal-font/card clipping checks, English 390px semantic text, and same-predicate 9/10px negative → restore. Report CI/screenshot URLs only once the new HEAD succeeds. No new token, `!important`, research data change, Vercel Production, PR merge or Mac/RDC. `PageOutline.astro` overlaps open PR #841 and was not edited.
