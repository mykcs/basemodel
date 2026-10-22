# Typography candidate: source and acceptance evidence

The isolated #898 candidate preserves its Draft status and stacked base #895. It integrates the user-authorized #840 rewrite, current Q01/Q03 PGFPlots and booktabs assets, the #930 120px Papers headers/no-JS fallback, and #931's explicit recommendation-versus-advisor-approval boundary. No merge, retarget or Production deployment is authorized. The latest exact commit, CI run, artifact review and Review-only URL belong in the [PR status receipt](https://github.com/mykcs/basemodel/pull/898); historical local results below cannot substitute for them.

## Source classification

`source-disposition-ledger.json` contains every current CSS/Astro typography declaration, its stable occurrence identity, actual producer role, disposition, source evidence, routes and static computed samples. Its recursive dictionary is lossless and self-described by `schema.references`. No source declarations are discarded to lower the count. `inventory.json` separately retains all 81 inline/JS discovery hits, including non-font geometry and parser false positives.

Run `node scripts/verify-typography-ledger.mjs` against this candidate source tree. It checks the full source fingerprint, exact declaration multiset, all occurrence IDs, source/observation identity and explicit plan targets. A later source change requires a fresh affected classification; this historical receipt is not a permanent global build constraint. Run `npm run build` and `node scripts/audit-sitewide-typography.mjs --json /tmp/typography-HEAD.json` in a clean exact-head checkout to bind the inventory to the real published SHA.

The current source fingerprint is `49e986572da7cd57d721926bd951cea91aa8a718f952fc16f138d3738822c685`: 5,774 declarations; 4,205 MIGRATE, 510 specific justified exceptions and 1,059 currently dead/unproduced/shadowed candidates. Execution status is a separate axis: 1,438 implemented in this change, 1,206 pre-existing role bindings, 1,536 future migrations, 25 future selector splits and 1,569 retained-source entries. Zero pending role mappings does **not** mean zero literal debt or all migrations implemented. Dead-source classification is not deletion permission.

Static observation covers 268 generated routes × three widths × two themes × two native disclosure states = 3,216 states: 4,519 matched declarations, 4,459 with visible text, zero parser-to-compiled mapping errors. Scripts and network fonts were blocked; selector matching is neither a winning-cascade proof nor loaded-font visual acceptance. Hydrated controls, print, SVG readers, math and scientific data use separate browser/source evidence.

## Implemented behavior and bounded local checks

137 source files changed in the candidate: real prose/captions use existing roles; ordinary scientific values use the interface family; labels and headings use canonical weights. Long explanations retain a readable row on narrow screens, result tables scroll locally, and canonical figure captions keep their own 14px role instead of forcing all paragraphs into caption text. Fifty-one retirement receipts distinguish 47 complete legacy removals, two partial selector retirements and two fallback corrections; live members of comma selectors were restored.

470 route/selector witnesses cover 58 route identities, with font-family/size/weight/style/leading/tracking, geometry and same-predicate injected bad cases. Twenty-four Briefing slides have a same-source reflow reader; immutable SVG/PGF can open at native readable size with keyboard/no-JS controls and print reset. Seven WandB polylines and scientific table expressions were checked for parity; unmeasured rounds remain explicitly unmeasured.

Latest frozen local build and `verify:deploy` passed. Focused Chromium/WebKit checks passed: 30 explanation/caption/narrow-row positive/negative cases; eight Papers JS/no-JS checks at 390/768/1440px; two CI-matching single-worker tablet scientific-reader diagnostics. Six Papers PNG/JSON pairs and four narrow-explanation PNG/JSON pairs received bounded independent dirty-candidate review. Earlier 808-test run retained four failures: two corrected witness-text joins, subsequently green in both engines, and two image/timing failures under four workers, subsequently green with CI's one-worker setting. These bounded reruns do not represent a final hosted full-suite pass.

## Publication acceptance

Before closing the task, require the exact published head's eight Chromium and four full-WebKit shards plus aggregate/deterministic gates; inspect fresh PNG/JSON, not just job colors. Require a READY Review-only deployment with the same Git SHA, real authenticated business HTML, noindex and representative mobile/tablet/desktop light/dark views. Keep unreviewed samples explicit. An independent reader task must use a fresh context and cannot borrow the implementation agents' understanding.

`ownership.json` records #932's 45 overlapping paths and the distinction between wrapper-only hunks and typography changes. Its article rewrite and #860's handbook/dependency work remain separately owned; this candidate does not claim their combined integration or acceptance. At a future authorized integration, preserve both sets of actual behavior and rerun the combined exact-head gates.
