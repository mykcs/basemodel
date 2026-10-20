# Shared controls and Quick View: third implementation receipt

Status: PARTIAL sitewide. This receipt supersedes the remaining-core and Quick
View claims in OWNED_CSS_CLOSEOUT.md. Exact accepted SHA, CI and provider links
are recorded on PR #898 after checks finish, rather than asserted in advance.

## Actual defects and owners

- `interactive-research-explainer-core.css`: the old transport shorthand
  `750 .68rem/1.1 inherit` is invalid. Chromium rendered Arial at 13.333px;
  WebKit rendered its standard family at 16px, both normal weight. Replace it
  with explicit interface/meta/label/heading-leading roles. Migrate 16 direct
  sizes and 19 literal shorthands by selector meaning; technical file/action
  identifiers retain mono, ordinary probabilities use interface normal weight.
  File labels use content width and probability labels may wrap.
- `OpenEvoLegacyStage2Archive.astro`: migrate 19 scoped sizes and six shorthands,
  including the other invalid inherit-family shorthand. Real scores/counts use
  ordinary interface numerals, normal style and weight. The entire pre-style
  markup, copy and script prefix remains SHA256
  `40e8d344fb00b1c334c17fbf8405f027896c7c1733d4431f4bcd96afcfe1a30e`.
- `ModelQuickView.css`, imported by both `GlobalModelQuickView.tsx` and
  `ModelQuickViewDialog.tsx`: own the shared interior. The real global Papers
  dialog lacked the interior stylesheet because it previously lived only in
  Workspace's mobile CSS. Remove those seven duplicates from `workspace.css`.
  Facts now use a shrinking two-column grid, explicit dd reset, ordinary numeric
  family/weight, padded content and wrapping actions. Foundation retains the
  outer dialog; Workspace retains the mobile handoff. Architecture documents
  and a structural ownership regression enforce this boundary.

## Inventory

All 268 generated routes scanned; 73 figures and 130 tables unchanged. CSS
owners 35→36 because the lazy feature now carries its own required stylesheet.
Original CSS ledger: 81 MIGRATE, 2 DEAD_OR_SHADOWED, 208 CONCURRENT_PR_BLOCKER,
8 JUSTIFIED_EXCEPTION, zero unclassified within its 299 original entries.
Direct CSS sizes: 249→213; literal CSS shorthands: 50→3. This package removes
16 direct sizes and 19 shorthands relative to the previous receipt.

The separate scoped-source population is still unfinished: 2,281 live
literal/shorthand rules remain (25 removed here). Unknown inline/JS candidates
remain explicit in inventory.json. These counts do not establish sitewide
completion or visual approval of 268 routes.

## Regressions and real inspection

The parser now rejects invalid inherited-font shorthands while accepting whole
`font: inherit` and a quoted family named `inherit`. A real source injection of
the former transport shorthand makes the same `audit:typography` command exit
1; restoring the longhands returns exit 0. Browser negatives remove the real
control font declarations and restore the invalid shorthand, and separately
remove the Quick View interior rules. The same positive computed-role/layout
assertions must reject both. Existing 9px, Arial, narrow-column, mobile exchange
and Compare bad controls remain enabled.

The geometry matrix now has one independent test per route/state rather than
five routes sharing 90 seconds. All original routes, steps, geometric checks,
thresholds and 90-second per-case limit remain. #806's added tests are in other
hunks. #901's new instant-scroll stabilization is at the file end, separate from
this loop; it is neither overwritten nor silently imported.

Actually opened new PNGs: Chromium Quick View 390 dark, historical Stage 2
390 light, Lab transport 1440 dark; WebKit transport 1440 light and Quick View
768 light. Text and ordinary numbers are readable; close button, fact columns
and actions are separated. These are sampled image inspections, not a blanket
scientific-content or whole-site approval. Full positive/negative browser results
and exact-head follow-up are recorded on #898.

## Remaining work

Reconcile concurrent semantic owners, finish the scoped-source/inline ledger,
complete exact-head deterministic/full browser acceptance and wider screenshot
review, then verify an exact-SHA dedicated Review Preview. PR stays Draft and
stacked on #895; no Production deployment or merge is authorized.
