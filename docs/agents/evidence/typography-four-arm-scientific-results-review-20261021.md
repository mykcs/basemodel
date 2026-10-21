# Independent Typography Review — Four-arm scientific analysis report

**Status:** Scoped review candidate. **Not** an assertion that sitewide Typography is complete, and **not** merged into #898 or Production.

## Proven current reader surface

- Canonical consumer: \`src/pages/research/seed-openevo/study/results/four-arm-analysis/index.astro\` mounts \`OpenEvoExperimentAnalysisPlan.astro\` with \`mode="four-arm"\`.
- Original #898 base head: \`7e3d5b6ccdec18e565c6d375f9619aad5512cf12\`. Candidate stays in \`review/typography-four-arm-results-paper-20261021\`; review all latest in-flight PR ownership and exact head before any integration. **No writes to Codex's #898 head or Production.**
- The older \`OpenEvoFairComparisonExplainer.astro\` has many hardcoded source sizes, but current production-source search found no direct render consumer. \`/study/design/\` is a redirect to Flow. Do not spend effort blindly enlarging a possibly retired component without proving reachability.
- This reviewed component contains an \`isSeven\` conditional not mounted on the public 7B/self route. The live four-arm route renders \`.per-arm-grid\`, \`.factor-matrix\`, \`.plan-table\`, and \`.reasoning-line\`; the \`.score-comparison\` branch and \`.plan-table td span\` selector are absent in the live four-arm DOM. **Neither is counted as an accepted visual role.**

## Reproduced defect

Independent static-hosted Chromium probe, exact original #898 source at three widths:

| Text on the actual four-arm route | Before | Candidate |
| --- | ---: | ---: |
| Status explanations in the factor-matrix \`small\` | 10.24px | 14px \`--type-caption\` |
| Scientific table column headings | 12.48px | 15px \`--type-table\` |
| Each experiment arm's explanatory paragraphs | 12.8px | 16px \`--type-body\` |
| Scientific work-plan body cells | 12.48px | 15px \`--type-table\` |
| Provenance kicker | 10.88px monospaced | 13px \`--type-meta\` interface |
| Status/technical short labels | 10.88px in several locations | 13px \`--type-meta\` |

The four-arm comparison includes sealed scientific numbers and provenance that must **not** be rewritten to satisfy typography. The candidate edits **only component-scoped CSS**: 20 controlled semantic ownership migrations and a local \`@media(max-width:1040px)\` single-column layout for the reasoning chain. All JSX/Astro markup and script above \`<style>\` are byte-identical with the base. No added \`!important\`, no parallel token system, no changed sample sizes, model scores, claim boundaries, equations, data import or references.

The scientific work-plan remains in a locally scrollable wrapper; do not replace it with full-page overflow. The fixed \`@media print\` 8pt type is a **separate output medium** and is deliberately not changed by this online-reading scope.

## Scoped validation

- Exact code/test revision \`fe3524c3680afe0fbe9f933ada81cb9f6eac8bd3\`: project build / typography static audit **PASS**, 268 generated HTML routes; updated CSS, then checked out the test-only follow-up for exact browser execution (build output same production source).
- Chromium **9/9 PASS**, WebKit **9/9 PASS**, 390/768/1024/1440px × light/dark; rendered font family/size/line height, local table overflow, no full-page horizontal overflow; short technical IDs retain a separate 12px mono role.
- Browser mutation rejects **10px prose**, **9px table data**, and **removed local table scrolling**, then accepts restored production rules.
- An initial test incorrectly required non-rendered \`.plan-table td span\` and failed. Live DOM audit found **zero** such nodes; the assertion was removed rather than inventing content or weakening real rendered-role thresholds.
- Real images were captured and opened for the phone arm narrative and desktop work-plan table; no visible collision or whole-page horizontal scroll. Screenshot images were ephemeral cloud artifacts; exact-head GitHub Actions artifacts and human Preview remain to be collected after owner integration.
- **Important**: last cloud full \`npm run verify:deploy\` was started but the sandbox expired before its exit code could be read. Until a fresh exact-commit check reports exit 0, this item remains **NOT VERIFIED**, not PASS. A later documentation-only commit also needs its own exact-head gate.

## Integration handoff

Codex may compare this isolated branch against the **live** #898 head, then selectively adopt the component and browser witness when its file ownership is free. Re-run combined-head \`verify:deploy\`, \`build\`, full applicable browser/negative tests, proper screenshots and Vercel Review Preview; never borrow this isolated branch's 18 focused passes as a whole-PR CI guarantee.

This result is **one real reused production component** and **one canonical live route**, not 268 visually accepted pages. Remaining sitewide scoped-style debt needs the source/semantic/consumer inventory and visual sampling specified in the #898 execution plan.
