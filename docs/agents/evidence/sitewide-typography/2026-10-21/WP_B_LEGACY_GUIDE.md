# WP-B3 — Legacy runbook provenance card actual typing

PR #898, base at edit `d33057b7f11e1c5cc626e58fd50c99fdce7267b8`. This is a focused ordinary UI/Guide continuation after B1/B2. True consumer is `src/layouts/AppLayout.astro` conditional `isTodayRunbook` on `/guide/today/`, the repository's Astro i18n build is Chinese-only (`locales: ['zh']`); English is archived, **not** a browser route. Scope is explicitly an **historical runbook**, not a current server inventory. All warnings, legacy date 2026-08-11 and canonical fuhuo link are preserved.

Owner `src/components/LegacyTodayRunbookNotice.astro` migrates:
- ordinary date from 12.48px **bold monospace** to 13px interface token with conventional tabular date numerals,
- label from 11.52px / 800 and widely tracked uppercase to 13px semantic meta with ordinary restrained weight,
- heading to 20px article-subsection role, legible 16px explanation with standard line-height and 70ch measure,
- canonical source link to 15px UI body-small with semantic label weight.
The existing warning state, desktop date/info grid and phone single-column structure are retained.

`tests/e2e/typography-product-tools.spec.ts` adds 390/768/1440 x light/dark actual DOM/normal-font/card clipping checks, a real Chinese-route semantic/aria and canonical-link test, and same-predicate 9/10px negative → restore. Report CI/screenshot URLs only once the new HEAD succeeds. No new token, `!important`, research data change, Vercel Production, PR merge or Mac/RDC. `PageOutline.astro` overlaps open PR #841 and was not edited.

## 2026-10-21 actual PNG review caught an escaped visual defect

Exact-head `ce0140fb` Public PR CI [#39567251389](https://github.com/mykcs/basemodel/actions/runs/39567251389) did pass the structural and Chromium gates, but the downloaded 768px-dark original screenshot from [shard 3](https://github.com/mykcs/basemodel/actions/runs/39567251389/artifacts/12329992964) showed the globally localized date **`2026 年 8 月 11 日` wrapping the final `日` onto a second line** in the old fixed 112px date column. This was a real screenshot defect despite no horizontal overflow and green CI. The date source and scientific facts were not wrong; the global human-expression date transformation is valid.

The follow-up CSS changes the date-column grid to `max-content`, adds `white-space:nowrap` and semantic caption line-height to the date itself, and adds actual geometry `height <= computed line-height + 2px` to all six state checks. A new tablet negative injects the former fixed 112px column and normal wrapping, confirms it **fails the same production acceptance**, and restores the correct appearance. All acceptance for this follow-up requires a fresh full GitHub CI and real 390/768/1440 screenshot on its exact SHA; previous ce0140 Green is not used as proof of this new code.
