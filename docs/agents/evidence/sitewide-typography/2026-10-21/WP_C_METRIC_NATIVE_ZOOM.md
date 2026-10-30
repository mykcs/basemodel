# WP-C · Native-size scientific figure reading (2026-10-21)

**Status: TARGETED PASS in isolated candidate; sitewide typography remains PARTIAL.** Work PR: [#898](https://github.com/mykcs/basemodel/pull/898), Draft stacked above #895. Working input HEAD was `d33057b7f11e1c5cc626e58fd50c99fdce7267b8`; actual committed child HEAD and its CI must be checked separately. This change deliberately avoids the other PRs' shared research page/figure owners.

## Grounded reader defect and fix

The public `/research/seed-openevo/study/capability-exploration/bounded-effective-state-gdr/` report embeds **seven** `MetricEvidenceFigure.astro` research plots, including Task Score, loss, Task Vector, output length, steps, entropy and R200. The source SVGs have a native **1200 × 675** viewBox and 13px axis/round labels. Scaling the entire plot into a 390px phone column yields **at most 4.23px** axis text. Existing page-overflow checks passed: viewport containment is not legibility.

**Real production source:** `src/components/research/MetricEvidenceFigure.astro`.
- Preserve its compact original chart/image and W&B/data-source links.
- Add a user-operated, keyboard-addressable `放大查看图表` control; the *same* SVG image becomes 1200px wide inside a **local horizontal scroll viewport**, with a stable figure-specific `aria-controls`/expanded state.
- The full-size plot's 13px authored axis glyphs now render at native scale, without relabeling, resampling, recomputing scores, or modifying scientific source bytes.
- Use the existing semantic interface/meta/figure-title tokens, no extra global stylesheet, new token family or `!important`. A direct `查看原尺寸 SVG` link works even without JavaScript; the enhancement control is hidden until the script is ready. Reuse one SVG DOM image per plot rather than hiding an accessible duplicate.
- On collapsing, return to the same compact figure; no page-wide horizontal scroll. Preserve light/dark colors and the original figures' white plot background.

## Reproducible isolated acceptance (candidate tree)

- `npm run build` and `npm run audit:typography`: PASS; still 268 generated routes, 73 figures, 130 tables, 36 independent CSS owners, 61 remaining direct standalone CSS size literals. This is not 268 visual acceptances.
- `npm run verify:deploy`: PASS (full repository deterministic Gate; prior warnings in the copy review were candidates, strict invariant failures zero).
- `npm run ui:overflow-preflight`: PASS (390/768/1440 baseline).
- `tests/e2e/sitewide-typography.spec.ts`, `--grep 'metric science plot|metric zoom actual'`: **14/14 Chromium + true WebKit PASS** across 390/768/1440 × light/dark, plus source-size negative injecting the old squeezed appearance and requiring the SAME role predicate to reject it, then restoration to pass. Checks computed image/axis scale, native intrinsic width, scroll compartment, focus/keyboard affordance, page overflow and original-source link. PNG + JSON witnesses emitted under task-scoped Playwright outputs.
- Existing research figure/table tests `effective-state-gdr-lora.spec.ts` plus `sitewide-figure-width-scope.spec.ts` **186/186 PASS across Chromium and WebKit**, including scientific link identities, image source/figure count, panel values, and route containment. None was removed or made looser.
- Candidate blobs verified byte-for-byte against sandbox `git hash-object`: `MetricEvidenceFigure.astro` = `4ad15185b9b6d1a719eb336c14085dd9ed8fd338`; canonical browser test = `1352da821c99c6927146e16d4be4e1f1b6027979`. Actual hosted GitHub CI must bind its own exact commit SHA and screenshots must be opened rather than declared accepted from this report.

## Limits / next owner

This repairs **seven plots through one reusable component**, not the 8 derived SVG figures of the same report or 8 fixed 16:9 briefing-slide graphics whose scaling was separately diagnosed by the #901 Figure workline. Their owning components overlap #806/#820/#827 and must be reconciled rather than silently overridden. Remaining Astro/inline/font-weight debt is still open. No merge, retarget, Production, Mac/RDC or scientific data/claim change is authorized by this receipt.
