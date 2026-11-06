# MiniMax Teacher typography and evidence-status closeout — 2026-10-21

**Status: implemented and independently browser-tested; whole-site Typography PR #898 remains PARTIAL / Draft.** This is one focused contribution to [PR #898](https://github.com/mykcs/basemodel/pull/898), stacked on #895. Intake code head: `a70a10a1c655a0b38b8a5609ea1f55d43b3b5518`. Do not infer that a prior SHA's Preview/CI accepted the eventual post-commit HEAD.

## Real reader defects and semantic owner

Public route: `/research/seed-openevo/study/minimax-teacher/`. Real Chromium computed styles before the change (390px light; 768/1440 samples matched in role) included 10.24px chapter markers, 14.08px answer prose, 10.56px benchmark explanation, 9.28–9.6px fit-chart labels, 9.92px native comparison headers, 12.48px comparison data, and 9–11px cost/protocol notes. Document overflow was zero; that alone concealed unreadable text.

`src/pages/research/seed-openevo/study/minimax-teacher/index.astro` owns the actual fixed copy, tables and candidate status. It now uses existing semantic tokens: readable 16px answer prose, 15px study/table/protocol text, 13px short metadata, 14px notes; interface fonts rather than decorative tiny heavy monospace for ordinary labels/data. It preserves the page's scientific facts, source links, model identities, cost numbers, experiment counts, dates and unknown state. No global typography override, new token scale or new `!important` was introduced. Native comparison tables retain intentional local horizontal scroll.

The old `teacher quality × cost` illustration used arbitrary inline positions for four providers despite no comparable teacher-quality measurements. Browser geometry already showed candidate-label collisions at 390, 768 and 1440px (different pairs at different widths). Instead of shifting arbitrary pseudo-data points or shrinking the labels, the same four provider identities and evidence statuses are presented as a responsive native candidate list, with explicit **no same-task quality ranking** caveat. This removes four unsupported inline coordinate surfaces without replacing them with invented scores. `src/lib/minimaxH146TeacherEvidence.test.ts` now rejects the old coordinate pseudo-ranking and checks the stronger visible scientific caveat while preserving the immutable frozen-facts SHA gate.

## Actual verification on isolated exact-source cloud checkout

- `npm run verify:deploy` **PASS** (125 structural test files, 833 tests after updating the truthful invariant), `npm run build` PASS, `npm run audit:css` PASS, `npm run ui:overflow-preflight` PASS, `git diff --check` PASS.
- `tests/e2e/sitewide-typography.spec.ts --grep 'MiniMax teacher'` **14/14** Chromium + genuine WebKit: 390/768/1440px × light/dark, local table scrolling, document/graph list geometry, fonts/size/weight/normal style and readable model status, plus a same-assertion 9–10px restored-bad-state negative.
- `tests/e2e/minimax-teacher-reproduction-disclosure.spec.ts` **10/10** Chromium + WebKit across desktop/mobile themes, interactive disclosure and theme switching.
- The old 390px actual-browser typography gate **did fail** on the unrepaired 10.24px `.section-no`; after real fixes the same role and scientific-table predicates passed. The old scientific unit test initially failed because it required prose describing an obsolete scatter plot; it was repaired to assert the actual stronger integrity requirement, and its seven scoped tests passed.
- Generated static audit: 268 HTML routes, 73 figures, 130 tables. Owner-level hardcoded-size/shorthand candidate population **53 → 9**; remaining 9 are heading/large-stat roles and necessary `inherit`/body-sized cases, not silently declared site-wide exceptions. At the tested candidate tree, global raw source candidates remained **61 independent CSS, 2,143 Astro scoped**, and **53 unresolved inline/JS surfaces**. These numbers include changes by other open workstreams: compare owner-level deltas, not unrelated global snapshots.
- Evidence PNG/JSON are generated via Playwright `testInfo.outputPath`; exact committed HEAD hosted CI artifacts and protected Review Preview must be linked and inspected after the final commit. Local browser PASS is not yet hosted visual approval.

## Concurrency / final boundaries

The MiniMax page and its scientific test were checked against open PRs for overlapping changed-file ownership; #901 owns a separate math/figure acceptance lane and #806/#895 own other shared research surfaces. `tests/e2e/sitewide-typography.spec.ts` is the existing #898 regression owner; no production CSS from #806/#816/#901 was edited. No MacBook/RDC, GPU, scientific dataset, Notion, Production or merge action occurred.

**Still outstanding:** sitewide semantic classification of remaining scoped/inline rules, complete hosted Chromium/WebKit and screenshot acceptance, exact-head SSO-protected Vercel content inspection, and the main PR's overall visual/reader approval. A green CI for this package cannot by itself close the entire 268-route site.
