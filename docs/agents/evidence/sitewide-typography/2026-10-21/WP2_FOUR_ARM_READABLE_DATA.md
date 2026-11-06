# Sitewide Typography #898 — live four-arm reader and honest screenshot receipt

**Status: TARGETED LIVE COMPONENT PASS at production/test SHA `185f3dd67ca652cf901369a40441325adc6447b6`; full site remains PARTIAL.** Work PR [#898](https://github.com/mykcs/basemodel/pull/898), still Draft and stacked on #895.

## Actual production effect

The current `src/components/research/OpenEvoExperimentAnalysisPlan.astro` renders on **one verified Chinese route**: `/research/seed-openevo/study/results/four-arm-analysis/`. It now uses canonical tokens for explanations/status labels and research tables, without changing a single scientific number, conclusion, method, model state, reference, or Claim Boundary. Git commit [33ee2d9d](https://github.com/mykcs/basemodel/commit/33ee2d9d4e203d92dc1ebbf7c9c335ecf228c064) initially included a 7B-specific dormant branch and invalid test. The corrective [185f3dd6](https://github.com/mykcs/basemodel/commit/185f3dd67ca652cf901369a40441325adc6447b6) removed that false public-page claim and retained only genuinely mounted four-arm changes. **7B public page `OpenEvoExperimentResultsScaffold.astro` is not fixed by this patch.**

## Executed true hosted CI, test case matrix and negative proof

- Current working implementation [Public PR CI run #39544919705](https://github.com/mykcs/basemodel/actions/runs/39544919705) at exactly `185f3dd67ca652cf901369a40441325adc6447b6`: **success**; public-plan, public-deterministic, all **8/8 full Chromium shards**, public-ci-gate.
- New live four-arm matrix `tests/e2e/sitewide-typography.spec.ts`: 390/768/1440px × light/dark = **6 test states**, checked actual `font-size/weight/family/style/line-height/letter-spacing`, public route 200, theme, root overflow ≤2 px, scientific plan-table local scrolling, plus 1 negative test injecting prior 11px status/12px question prose, verifying same predicate rejects it and restored style passes. Existing six rationale tests and their 10px negative also remain.
- 7 visual cloud artifacts / 93 PNG / 31 JSON generated over this SHA. All **six** new evidence-card crops plus **one** mobile reasoning image were manually opened at the actual PNG bytes; compare [original artifact #3](https://github.com/mykcs/basemodel/actions/runs/39544919705/artifacts/12321755552) with other shard artifacts linked from the run.
- Visible issue in all six evidence-card crops: the sticky `research-navigation` is printed on top of part of a tall element capture. This is an **artifact crop obstruction, not yet proof that real viewport layout is broken**. Existing crops classified **NEEDS CAPTURE FIX / no screenshot acceptance**. Follow-up test captures the unmodified viewport including sticky nav and a component-only cropped image with nav hidden, allowing independent acceptance; it requires its own new commit and CI.
- These are *six real Chromium card samples*, not 268 human-reviewed pages and not WebKit evidence.

## Refreshed source/classification debt

Prior build/source audit at `7987f2a7`: 268 HTML routes, 73 Figure, 130 Table, 36 independent CSS files, 61 independent CSS direct font-size literals, 2,278 Astro scoped candidate literals/shorthands, 56 unresolved inline/JS style candidates. The patch retained at `185f3dd67ca652cf901369a40441325adc6447b6` replaced **seven** literal scoped `font-size` and **one** literal scoped `font` shorthand in the single real four-arm owner; no standalone CSS, route list or inline/JS declarations changed. Hence the source-count estimate/proof at `185f3dd67ca652cf901369a40441325adc6447b6`: **61 independent CSS / 2,270 scoped Astro / 56 unknown inline+JS**. Counts are candidates, not 2,387 proven defects. The original `inventory.json` rules[] represent older 4b source, remain historical and not a completely classified current ledger. **`unclassified=0` is NOT achieved.**

## Real concurrency and deployment boundaries

GitHub open-PR inventory refreshed to **41**; #895 stacked base, #806 live 7B and shared CSS, #816 shared section owners, #901 separate not-yet-merged WebKit screenshot workflow; #908 at `a9a94b80` modifies the very same Astro file with a distinct plan-table min-width media rule. No other PR was touched or rebased. No Mac/RDC, merge, Production or base retarget.

Isolated existing Vercel Review-only project: `basemodel-ui-preview-20260811`. Existing Ready deployment at SHA `7e3d5b6c` is stale. Require new exact-SHA non-production preview, noindex and verified real content, not a 200 login shell. A Preview that requires SSO cannot be treated as independently visually accessible without authentication.

### Classification of remaining acceptance

| Gate | Result |
| --- | --- |
| Four-arm production owner token migration | PASS, source commit `185f3dd67ca652cf901369a40441325adc6447b6` |
| Exact-head Public PR CI | PASS #39544919705 (Chromium) |
| 390/768/1440 × light/dark card/rationale browser predicates | PASS (Chromium) |
| Six first-pass card-crop visual acceptance | NEEDS CAPTURE FIX (sticky nav overlays component crops) |
| Complete source-level semantic classification | PARTIAL, thousands unclassified |
| WebKit full matrix, broad 268-page manual acceptance | NOT RUN on this exact head |
| Vercel new exact-head Review Preview + real page inspection | NOT YET RUN at this receipt |
