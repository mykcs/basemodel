# A03 CSS ownership consolidation evidence — 2026-10-02

Status: implementation evidence for PR #816. This work consolidates proven shared CSS ownership without intentionally changing the rendered design. It does not merge or deploy the site.

## Scope and dependency boundary

A03 was planned after inspecting the open design worklines:

- PR #806 (`design/basemodel-design-system-v1-20260928`, head `8f976af80439f83fc4c9bfcf451e87ed60ad8126`) already contains broad route-family design work, but remains open and was unmergeable against the A03 baseline. Its relevant shared-CSS delta does not own the three A03 hotspots below; it mainly moves a small Compare surface into component CSS and normalizes several radii.
- PR #812 (`design/beta-sujianlin-reader-20261001`, head `e94b1618760b9cbd201ff88ce61141e592989693`) is still a planning-only page-scoped reader redesign. A03 therefore does not pretend its proposed β article layout is an accepted shared owner.

A03 stays on current main and does not absorb either PR. Scientific content, result values, page order, and route semantics are untouched.

## Hotspot 1 — shared section-heading structure

### Before

The same shared selector was structurally owned by multiple global layers:

- `src/styles/site.css`: base flex layout, gap, margin;
- `src/styles/visual-upgrade.css`: wrap, row gap, muted-child measure, <=760 column handoff;
- `src/styles/design-refinement.css`: final align-start, `h2` measure, <=720 grid handoff;
- `src/styles/mobile-composition.css`: purposeful <=640 mobile spacing/typography override.

That made the actual result depend on import order rather than one readable owner.

### After

`src/styles/site.css` now owns the shared structural contract that was already effective in the browser:

- flex layout, align-start, wrap, 20px column gap / 10px row gap;
- `h2` max-width 22ch;
- muted supporting copy max-width 46ch;
- <=760 column handoff;
- <=720 grid handoff.

The duplicate `.section-heading` structural rules were removed from `visual-upgrade.css` and `design-refinement.css`. `mobile-composition.css` deliberately keeps its <=640 mobile spacing/typography role; `editorial-hierarchy.css` and `final-hardening.css` keep typography responsibilities rather than shared layout ownership.

The CSS architecture audit now fails if either retired patch layer regains `.section-heading` ownership.

## Hotspot 2 — canonical paper-style research figure shell

### Before

Seven live WebShop canonical figures on the Flow/WebShop route independently repeated the same outer shell:

`width 1120px cap -> 2.2rem vertical margin -> responsive padding -> 1px border -> 16px radius -> surface background`.

The live consumers were:

1. `SeedWebShopCanonicalFigure.astro`
2. `WebShopDatasetCanonicalFigure.astro`
3. `WebShopEvaluationFigure.astro`
4. `WebShopGoalGenerationFigure.astro`
5. `WebShopSeedDataUsageFigure.astro`
6. `WebShopSeedSplitFigure.astro`
7. `WebShopSmallWorldFigure.astro`

`WebShopInteractionCanonicalFigure.astro` is a legacy duplicate not mounted by the live route and remains untouched. `SeedOpenEvoCanonicalFigure.astro` intentionally uses a different full-width comparison shell and remains separate.

### After

The existing semantic owner `src/styles/research-figure-readability.css` now owns `.canonical-figure--paper` with that shared shell. The seven live figures opt into the class and retain their feature-specific geometry, charts, evidence layout, and responsive behavior locally.

`WebShopSeedDataUsageFigure.astro` keeps its unique `scroll-margin-top`. No new generic Figure framework or UI library was added.

The CSS audit now:

- allows exactly one CSS selector owner for `.canonical-figure--paper`;
- requires the seven live consumers to opt in;
- rejects duplicated default width/padding in those consumers;
- explicitly rejects the different SEED × OpenEvo comparison figure from opting in.

## Hotspot 3 — reading-width token truth

### Before

Three files claimed ownership of one token:

- `tokens.css`: `--reading-width: 720px`;
- `visual-upgrade.css`: later override `72ch`;
- `design-refinement.css`: still later override `68ch`.

Chromium confirmed the real rendered value was **68ch**, while the existing contract test only asserted that the earlier `720px` token text existed. The test therefore did not describe runtime truth.

### After

`src/styles/tokens.css` is the only `--reading-width` owner and contains the already-rendered value **68ch**. The two compatibility overrides are removed. `visualIdentityContract.test.ts` now asserts the truthful canonical token, and the CSS audit fails if a second owner appears.

This is an ownership repair, not a deliberate reading-width redesign: browser-computed width remains 68ch.

## Render-equivalence witness

Before mutation, a Chromium probe recorded computed layout values for:

- `.section-heading` on Papers, Families, and Landscape;
- three representative canonical WebShop figures;
- widths **390 / 768 / 1440**;
- both **light / dark** themes.

Total: **36 computed-style cases**.

After all three consolidations and a fresh build, the same probe reported:

> **36 cases measured; 0 computed-style differences.**

The browser still reports `--reading-width: 68ch` after token consolidation.

The witness compares effective properties relevant to this migration: display, alignment, flex direction/wrap, gap, margin, measured width, padding, radius, surface/border color, and section-heading `h2` max-width/font-size.

## Developer path after A03

### Add a normal research section heading

Use the existing `.section-heading` structure. Shared layout belongs in `site.css`; page-specific meaning or geometry remains scoped to the page/component. Do not add another global `.section-heading` patch layer.

### Add a paper-style canonical WebShop figure

Use:

```html
<section class="canonical-figure canonical-figure--paper feature-name">
```

Then keep only semantic/feature-specific layout in the component. Do not duplicate the common 1120px shell, common padding, border, radius, or surface background.

A figure with a genuinely different semantic canvas may remain separate; the SEED × OpenEvo comparison figure is the explicit witness that “visually related” does not mean “force every figure into one component.”

## Mechanical validation completed before hosted CI

- fresh `npm run build`: PASS, 265 routes;
- `npm run audit:css`: PASS;
- `cssOwnershipConsolidation.test.ts`: PASS;
- `visualIdentityContract.test.ts`: PASS;
- `canonicalResearchFigures.test.ts`: PASS;
- first and final 36-case render-equivalence probes: **0 style drift**;
- reading-width runtime witness: **68ch before and after**;
- `git diff --check`: PASS during each migration step.

Full repository and browser acceptance are recorded separately in the PR once complete.

## Explicit non-goals

- no scientific result or copy rewrite;
- no β article implementation from PR #812;
- no wholesale deletion of the frozen compatibility stylesheets;
- no Tailwind/framework migration;
- no radius/`!important` debt game solely to improve a counter;
- no merge, Vercel final gate, or Production deployment.

## Full repository and browser acceptance

After the final ownership changes:

- `npm run verify:deploy`: **PASS**.
- Full repository Vitest inside the gate: **PASS** (123 test files / 807 tests after adding the A03 ownership contract).
- CSS audit: **PASS** with the new single-owner checks.
- Fresh build: **PASS**, 265 routes.

The strongest local UI command was also exercised across both configured browser projects. One repository-baseline failure and one transient browser-runtime race need to be stated separately rather than hidden inside a single green percentage:

1. The unmodified test `briefing scales the whole 16:9 slide...` expects the second viewport switch from 390px to 2560px to produce a 1280px slide, but local Chromium continues to report 390px. A clean detached worktree at main `360eabb92e5feb9ccef6ae7785332f73f7620ee0` reproduces the exact same `Expected: 1280 / Received: 390` failure. A03 does not modify Briefing code or this test.
2. With that proven main-baseline case excluded, the two-project run contains **416 tests**. Chromium completed its **208/208** cases. WebKit reached 177/208 before one all-route math audit lost its execution context during navigation (`Execution context was destroyed`), with no math or CSS assertion failure. The same WebKit test passed immediately in isolation (**1/1**), and the 30 tests that `max-failures=1` had prevented from running then passed **30/30**. Thus every A03-relevant configured Chromium/WebKit case was observed green; this is not misreported as one uninterrupted 416/416 invocation.

No failure observed in these runs asserted a changed A03 style value, layout geometry, overflow, theme, figure meaning, math rendering, keyboard path, print path, or no-JavaScript path.
