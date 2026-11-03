# Independent Typography review: four-arm experiment selector (2026-10-20)

**Status:** Scoped implementation plus focused Chromium/WebKit acceptance; **not** full-site Typography completion, not merged, not part of #898 yet.

**Working PR:** [#898](https://github.com/mykcs/basemodel/pull/898) (Draft/stacked on #895). This optional review branch began at `be785915a59733492d5637f4977d5d5ce6eb80c0`, without touching #898, #806, #816, #895 or Production. Recheck live PR ownership and re-run exact-head tests before cherry-picking; the parent #898 head moved during this review.

## Evidence-driven target choice

The source typography auditor had already recorded **2,281 unclassified scoped Astro font-size/shorthand candidates**. An independent Chromium pass over **268 generated routes** at **390px/light and 1440px/dark** (536 page observations, original #898 HEAD `be785915`) found:

- 0 page-load failures and 0 document-wide unexpected horizontal scrolls in those initial states.
- 1,584 **observations** (not distinct rules) of prose-like elements under 14.5px, including 236 under 12px; 334 under-12px metric-cell observations and 30 possible local clipping observations. These are triage candidates; repeated routes and nested `li`/paragraphs can count more than once. They are **not** 1,584 confirmed defects or complete visual acceptance.
- High-priority routes included `/research/seed-openevo/study/briefing/` (some slides are intentional exceptions); `/research/seed-openevo/study/results/7b-self-analysis/`; `/research/seed-openevo/study/run/`; and research flow pages. Slides/fixed plot labels must be reviewed separately rather than mechanically enlarged.
- The reusable `src/components/research/OpenEvoExperimentSelector.astro` renders three full explanatory paragraphs at **10.56px** and the four-arm matrix reading explanation at **10.88px**. Unlike dense slides or technical IDs, these are normal explanations. No open PR in the then-current 35-PR ownership inventory owned this component; its source body and science are unchanged by this patch.

## Code changes

**Production owner:** `src/components/research/OpenEvoExperimentSelector.astro`.

- Migrate 15 relevant selectors/declarations to pre-existing `--type-body-small`, `--type-meta`, `--type-minor-heading`, `--type-weight-label` and `--type-leading-caption` roles, with no new token scale, `!important`, or global cascade patch.
- All three model/stage/teacher explanations and the comparison-matrix paragraph now compute as **15px / 24px** at both 390px and 1440px. Their previous values were 10.56px / 15.312px (three explanatory paragraphs) and 10.88px / 16.32px (matrix paragraph).
- Selection links become normally readable, selected-arm text receives the body-small role; the teacher option's extra size override is deleted. Short `OpenEVO`, `3B`, `7B` identifiers remain distinct technical/compact labels.
- **All markup before `<style>`, choices, URLs, accessibility labels, research numbers, experiment outcomes and copy are byte-for-byte unchanged.**

**New independent test:** `tests/e2e/typography-experiment-selector.spec.ts` checks three real result routes × 390/768/1440px × light/dark, computed family/size/line-height/normal style, text containment and page horizontal overflow; the same computed-size gate must reject an intentionally restored 10px explanation. Screenshots are captured for each width/theme on the first route; only the capture temporarily hides the sticky site header. Live-page assertions are done **before** capture on the unaltered page. A short technical-brand label is intentionally not subject to the prose minimum.

## Exact-head validation

Independent review branch `review/typography-experiment-selector-readable-20261020`:

| Acceptance | Result |
| --- | --- |
| `npm run verify:deploy` (Node 24, exact review source) | PASS |
| `npm run build` and static Typography Audit | PASS: 268 pages, 73 figures, 130 tables; CSS direct literals 213 (unchanged because this patch modifies Astro scoped CSS) |
| Chromium focused 3 routes × 3 widths × 2 themes + negative witness | 19/19 PASS |
| WebKit focused identical matrix + negative witness | 19/19 PASS |
| 390px actual element reading measure | 294–326px across core explanations; no page horizontal overflow |
| 1440px four-column selector layout | Grid 1,098px wide; explanations 166–322px, no page horizontal overflow |

One initial test incorrectly expected short navigation links to be at least 200px wide. That test expectation was corrected to distinguish prose reading measure from link length; no production geometry was altered to satisfy a bad assertion. The captured-before screenshot revealed that sticky site chrome can cover the top of an element-only capture after auto-scroll; the screenshot-only CSS hides that chrome **after all page checks** for trustworthy component evidence. The baseline before/after measurement is more important than any UI screenshot captured in this ephemeral sandbox.

## Integration decisions and boundaries

- **Do not** silently merge, retarget, rebase or push into #898 while Codex is editing its head. The intent is to leave a self-contained, reviewable candidate for its owner.
- Before integrating, diff `OpenEvoExperimentSelector.astro` against the **current** #898 and all overlapping PRs. If the component has since been modified, manually reconcile rather than force cherry-pick.
- Re-run exact-head full Public CI, Chromium/WebKit, and final Vercel Review on the *integrated* SHA. The independent green tests alone do not establish whole-site acceptance or user approval.
- Further open work: 2,281 scoped style candidates need semantic consumer classification; the present review fixes only a repeated, confirmed tiny-prose example. Slide/plot labels must retain justified geometry exceptions, and currently unreviewed routes/states should be described as unreviewed.
