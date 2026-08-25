# Vercel UI gate serial-failure recovery — product regressions, stale contracts, and metric false positives

Date: 2026-08-26
Status: historical incident / reusable UI-gate diagnosis evidence

## Why this document exists

A SEED × OpenEvo Results deployment reached the hosted Playwright gate and failed after dozens of green tests. The first visible symptom was:

```text
1 failed
[chromium] › tests/e2e/results-reference-visual.spec.ts
22 did not run
66 passed
```

The useful lesson was not one CSS tweak. The incident exposed a recurring failure mode in a large serial browser gate:

> with `--max-failures=1`, each repair can reveal a later, independent failure that the previous run never reached.

It also showed that a Playwright assertion can represent three materially different things:

1. a real product/layout regression;
2. a stale test contract that still describes an older information architecture;
3. a bad measurement that misclassifies a healthy render.

Those cases require different fixes. Treating every red browser assertion as “change the page until the test is green” is unsafe.

This document records the incident. Current policy remains in `docs/agents/current/ui-change-visual-acceptance-gate.md`, `deployment-policy.md`, and `release-closeout-protocol.md`.

## Incident sequence

The deployment gate ran one Chromium worker and stopped at the first failure. The debugging loop therefore had to continue across several deployments.

### 1. Real compact-desktop layout regression

`canonical-research-figures.spec.ts` found that a SEED/WebShop split explanation became too narrow at the 1024px compact-desktop viewport. The evidence showed the actual prose wrapping below the readability floor.

The correct fix was a product fix: widen the responsive breakpoint so the comparison stacks at compact desktop while preserving the three-column layout on larger screens.

Commit in the incident chain:

- `cdc8f8281dbc04a527078fec4edd177bda793a10` — stack the seed-split comparison on compact desktop.

Durable lesson:

> When rendered geometry and prose measurements show a real layout collapse, fix the layout. Do not shorten scientific copy merely to satisfy a density assertion, and do not lower the geometry threshold without evidence that the threshold is wrong.

### 2. Missing canonical deep links

After the first failure was fixed, the gate advanced and exposed a missing Results-index contract: canonical figure deep links were absent.

The product contract still required those entry points, so the correct change was to restore the links rather than weaken the test.

Commit:

- `d967f37fa8e4bb2599d06d5f098a8cfe064ddaf5` — restore canonical figure links from the Results index.

### 3. Legacy primer migration copy

The next run exposed a legacy-primer expectation. At that point in the incident, the product/test state still required migration messaging, so the component was adjusted and the gate advanced.

Commits in that phase included:

- `ff2b9ccc1978d7d7d948cb0b2914fea404e66f4d` — restore primer migration notice;
- `97733bfc9fc218106b174b34ce623cb851265450` — restore a semantic migration aside for the then-current theme audit.

This DOM requirement is **historical, not current policy**. The repository later intentionally removed the aside and updated the tests to the new product truth, including later commits such as `9313a4e823bd15fda3ac8e0de459f3bc22ec951f` and follow-up research cleanup.

Durable lesson:

> Never turn an incident-specific DOM shape into a permanent rule. Re-evaluate current source, current reader/product contract, and current tests each time. Historical fixes are evidence, not authority.

### 4. Stale Results architecture test

A later failure expected headings from an older Results information architecture even though the current component and unit tests had already moved to a question-first reader flow.

The correct fix was a test-contract update, not resurrecting duplicate UI.

Commit:

- `56cbf3e24cdb879f67ad1fe73465480937cf82ff` — align Results E2E with the question-first index.

The important evidence was agreement between the current component and its current unit-level contract, while the old E2E still asserted removed headings.

### 5. Stale reference-card count

The Results index intentionally had four reference cards, while the visual E2E still hard-coded five in two places. The geometry assertions around the cards remained valid.

The narrow fix updated only the obsolete cardinality assumption and preserved the rest of the visual safety contract.

Commit:

- `029a84c6ab59409b9fa25a032a7eb2b235b4f344` — align the reference visual count with the four-card index.

Durable lesson:

> When a test is stale, edit the smallest obsolete assumption. Preserve unrelated width, overflow, wrapping, spacing, and visibility assertions.

### 6. Mixed-language density false positive

The user-visible failure that motivated this incident summary occurred in `results-reference-visual.spec.ts` at 1440px. Vercel's error log exposed the actual metrics:

```json
{
  "titleWidth": 740,
  "columnWidth": 740,
  "headingWidth": 1112,
  "titleLines": 2,
  "cjkPerLine": 5,
  "gridGap": 24,
  "firstCardWidth": 272,
  "gridWidth": 1112
}
```

The title was `OpenEvo、WebShop、SEED 和实验记录分别指什么？`. Its geometry was healthy: 740px title width, 1112px heading row, two lines, wide cards, and no detached grid. The assertion failed because it counted only CJK code points while the title intentionally contained large English tokens (`OpenEvo`, `WebShop`, `SEED`).

This was a measurement bug, not a layout bug.

The test was changed to measure non-whitespace visible characters per line while keeping all geometric thresholds intact.

Commit:

- `b5b1788dc538c28f315003472345b5df99cbb635` — measure mixed-language heading density correctly.

Durable lesson:

> A language-specific proxy must match the content it measures. For mixed Chinese/English copy, CJK-only density can report a false “narrow rail” even when the rendered block is wide and readable. Prefer direct geometry plus a language-agnostic visible-character measure when the content is mixed-language.

## The serial-gate trap

The browser command used `--max-failures=1`. Therefore a line such as:

```text
66 passed
1 failed
22 did not run
```

means only:

> the first currently exposed failure occurred after 66 passes.

It does **not** mean the remaining 22 tests are clean.

The correct recovery loop is:

```text
inspect exact first failure
-> classify product / stale contract / metric / harness-provider
-> make the smallest evidence-backed fix
-> rerun the complete gate
-> verify the formerly failing test passes
-> continue until all remaining tests execute
-> only then claim suite completion
```

In this incident, fixing the Results-reference failure let the suite advance to a later theme test. Only after that was resolved did the run reach:

```text
89 passed
[vercel-ui-gate] PASS
```

A passing formerly-red test was a checkpoint, not completion.

## Failure-classification decision tree

Use this order when a browser gate fails.

### A. Did the browser reach a real application assertion?

If no, classify runner/bootstrap/harness/provider first. Do not call it a UI regression.

If yes, capture the exact assertion, route, theme, viewport, and measured values.

### B. Do the measured geometry/state values show a real product problem?

Examples:

- actual horizontal overflow;
- clipped required text;
- unreadably narrow prose column;
- overlapping siblings;
- broken theme transition;
- missing required navigation or canonical entry point.

If yes, fix the product.

### C. Does the assertion still match current product authority?

Compare:

- the current component/source;
- current route/reader/product contract;
- current unit tests or other focused executable contract;
- recent accepted redesign commits when needed.

If the E2E pins retired headings, old card counts, removed DOM, or superseded ownership, update the stale test narrowly.

### D. Is the measurement itself valid for the content?

Inspect what the metric actually counts. A proxy can be wrong even when its threshold was reasonable for an older specimen.

Examples:

- CJK-only character density on mixed-language copy;
- a selector that assumes an element type rather than its semantic role;
- a fixed item count after intentional IA consolidation.

If the proxy is wrong, fix the metric. Do not contort the page to satisfy a broken proxy.

## What not to do

Do not:

- lower broad geometry/contrast/overflow thresholds just to make one specimen pass;
- rewrite or shorten research copy before proving the layout is actually too narrow;
- resurrect removed UI solely because an old E2E still references it;
- assume a test is stale merely because it is inconvenient;
- assume a test is authoritative merely because it is E2E;
- stop after the previously failing test turns green when `--max-failures=1` left later tests unexecuted;
- issue blind no-op deployment retries while actionable assertion logs exist;
- treat `vercel-ignore-build` fail-open messages or locale fallbacks as application failures when the build proceeds normally.

## Evidence hierarchy used in the incident

The most effective order was:

1. Vercel error-only logs for the exact first failing assertion;
2. the full assertion metrics, not only the test title;
3. current component/source owning the rendered surface;
4. current focused unit/contract tests;
5. recent redesign history when source and old E2E disagreed;
6. a minimal patch preserving unrelated safety checks;
7. a fresh full hosted gate;
8. final Vercel deployment state.

This avoided two common mistakes: guessing at CSS from the test name, and weakening a valid gate before determining whether the product or the assertion was stale.

## Incident closeout evidence

The final incident deployment was:

- deployment: `dpl_AHtsUHcV5zteYqjk5CpbUEcGgZW3`;
- Vercel state at closeout: `READY`;
- Playwright UI suite: `89 passed`;
- `vercel-ui-gate`: `PASS`;
- `vercel-lab-browser-gate`: skipped on `main` by its branch rule, not failed.

The 1440px and 2048px `results-reference-visual` cases both passed after the mixed-language metric fix.

## Reusable rules promoted to current policy

The current owner documents should retain these general rules even if the concrete Results DOM changes again:

1. classify browser failures before editing product code;
2. distinguish real UI regressions from stale test contracts and invalid proxies;
3. for mixed-language typography, use metrics that account for the actual rendered language mix;
4. preserve unaffected safety assertions when updating a stale test;
5. with first-failure serial gates, rerun until the whole suite executes and passes;
6. inspect actionable provider logs before retrying deployment;
7. completion requires both full gate completion and authoritative deployment state, not only one repaired test.

## Related current authority

- `docs/agents/current/ui-change-visual-acceptance-gate.md`
- `docs/agents/current/deployment-policy.md`
- `docs/agents/current/release-closeout-protocol.md`
- `docs/agents/README.md`

If any historical detail here conflicts with current code or current policy, the current code and current owner documents win.