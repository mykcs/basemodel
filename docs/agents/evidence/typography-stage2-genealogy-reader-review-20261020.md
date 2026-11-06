# Independent typography review: historical Stage-2 genealogy

**Scope:** review-only branch \`review/typography-stage2-genealogy-reader-20261020\` based on BaseModel Typography [#898](https://github.com/mykcs/basemodel/pull/898) at \`7b8246b3dd54c00af1ec387572a92533f9dc02c8\`. The component had **no overlapping owner** in the 35-PR evidence ledger plus the then-current new #903–#906, #901, #898 and #895 changed-file lists. Before integrating, recheck **all current open PR heads and file owners**. Do not push to #898, #806 or Production without owner reconciliation.

## Product defect and actual source owner

\`src/components/research/OpenEvoLegacyStage2ResearchJourney.astro\` is a genuine reader-facing component on:

\`/research/seed-openevo/study/capability-exploration/stage2-256-window/\`

It explains how the old 8-success-tasks / 2 successes each / 256 attempts rule evolved, its scientific limitation, matching 3B/7B outcome table and later diagnostic evidence. It is **not** an SVG coordinate plot or an interface-only metadata widget.

Previous real rendered/source evidence includes main paragraph/caveat font sizes of ~11.5px; table data ~11.0px and header ~9.6px. They were far below BaseModel's existing body16 / table15 roles. The original \`--type-*\` token authority already existed; this is a component-level migration, not a new design system.

## What changed

- 24 scoped CSS role/cascade declarations changed (including one responsive breakpoint). All markup/scientific content **before the component's \`<style>\` block is byte-for-byte unchanged**. No scores, citations, versions, experiment outcomes or scientific limitations changed.
- Intro, timeline text, causal caveats, diagnostic explanations and "next" summary use the shared body 16px and normal line-height roles; h2/h3 use article-subsection/minor-heading. Short labels, provenance and links use existing 13px meta, not decorative monospace. No new token or \`!important\`.
- Data cells and table column headers use 15px \`--type-table\`; table minimum width increased from 760px to 960px **inside an overflow-auto wrapper**. This preserves seven-column scientific data readability without widening the page.
- Timeline moves to a vertical reading sequence when viewport <=1180px, rather than squeezing four 16px-prose cards into a mid-width desktop window. Desktop 1440px retains a four-part genealogy.
- Diagnostic "intervention / observation / meaning" grid uses a flexible label column rather than the previous 74px; phone at <=700px retains a single-column stacked explanation.
- Existing semantic/screenshot tests remain intact. Standalone \`tests/e2e/typography-stage2-genealogy.spec.ts\` checks rendered computed family, size, line-height, normal font style, clipping and local table scroll, at 390/768/1024/1440px × light/dark across **both Chromium and WebKit**; it injects real 10px prose and 9px cells and proves the same acceptance predicate rejects them.
- The sticky research sub-navigation can temporarily appear over an element-only screenshot during Playwright automatic scrolling. The test's **screenshot-only** styling hides \`.research-module-nav-shell\` and \`.site-header\` after all live-page assertions. The product itself is not modified to accommodate the capture.

## Verification and limitations

Review source code commit \`4bc040cc800133cea92426e06dae3340afce97f9\` was verified in an isolated Vercel cloud sandbox using Node 24:

| Validation | Outcome |
| --- | --- |
| \`npm run verify:deploy\` | exit 0 |
| \`npm run build\` | exit 0; 268 static HTML routes and the existing Figure/Table source audits passed |
| Focused Chromium cases | 9/9 PASS |
| Focused WebKit cases | 9/9 PASS |
| Negative mutation | 10px paragraph and 9px metric cell rejected on both engines |
| Screenshots inspected | mobile-light timeline and desktop-light comparison table, plus computed geometry |
| Production/merged | **No; branch isolated** |

A later commit updates **only screenshot capture style**; run exact-head focused tests after this documentation write before claiming the final review SHA accepted. These scoped results are **not** the whole 268-page visual gate or a new Vercel Preview. They also do not warrant making the parent #898 "ready" or merging #895/#806/#901. Its latest state must be read before integrating.

## Integration handoff

The Codex owner may selectively port only this component's CSS and the witness spec after verifying the current #898 head and its more recent work. If parent CSS changes the cascade, validate the final \`getComputedStyle\` values again. Run that integrated SHA's deterministic/Public CI, the **full** browser suite, actually inspect current-head screenshots and deliver a matching Vercel Review Preview; do not reuse this isolated checkout's results as parent-PR evidence.

If the parent now owns these exact selectors, do **not** force cherry-pick or overwrite the owner; treat the changes as a review candidate only.
