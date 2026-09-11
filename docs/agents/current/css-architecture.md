# CSS architecture

Status: **current implementation contract**  
Decision date: **2026-08-20**  
Last reviewed: **2026-08-30**

## Decision

Base Model will **not** perform a site-wide Tailwind CSS migration at this stage.

The concrete problem in this repository is ownership/cascade drift, not the absence of utility classes. The site already has a token system, semantic component owners, Astro scoped styles, structural CSS audits, and real-browser acceptance. Rewriting the existing surface into utilities would create a second large migration surface without removing the need for component ownership, tokens, responsive contracts, or browser testing.

The implementation strategy is:

```text
Astro + React + CSS variables
-> one global stylesheet composition root
-> explicit semantic owners
-> frozen patch-style compatibility layers
-> delete an old copy whenever its semantic owner is proven
-> retire whole legacy layers only after required rules have moved
-> reconsider Tailwind only from new evidence
```

## Current phase status

| Phase | Status | Current result |
| --- | --- | --- |
| 1 · composition root | complete | `AppLayout.astro -> app.css`, structural audit, exact-head browser acceptance |
| 2 · global shell ownership | complete | `components/global-shell.css` and `components/header.css` are final shell owners |
| 3 · responsive ownership | complete | 1080/1081 navigation handoff and phone menu behavior are owned by `components/header.css` |
| 4 · retire patch layers | complete for global-shell scope; incremental debt remains | Header/Nav rules are gone from `visual-closeout.css`, `mobile-composition.css`, and `design-refinement.css`; retained patch files still contain required non-shell behavior |
| 5 · Tailwind evaluation | complete: no pilot | evidence still points to ownership debt, not utility-authoring friction |

There is no Phase 6 in the current plan. A new phase should exist only for a new, independently testable architecture problem.

## Canonical import graph

All page-wide CSS enters through one file:

```text
AppLayout.astro
└─ src/styles/app.css
   ├─ global.css
   │  ├─ tokens.css
   │  ├─ site.css
   │  └─ visual-identity.css
   │     └─ editorial-hierarchy.css
   ├─ frozen legacy compatibility layers
   ├─ actionable-content.css
   ├─ mobile-composition.css
   ├─ visual-closeout.css
   └─ components/
      ├─ global-shell.css
      ├─ header.css
```

`AppLayout.astro` must not accumulate another list of page-wide stylesheet imports. `app.css` is the only composition root for global CSS.

Feature-owned CSS may still be imported by its owning component when the rules do not need page-wide reach. That is not a second global composition root.

## Ownership classes

### Tokens

`src/styles/tokens.css` owns shared color, typography, spacing, radius, width, elevation, and theme primitives. Reuse existing tokens before creating another visual scale.

### Foundation

`global.css`, `site.css`, `visual-identity.css`, and `editorial-hierarchy.css` own durable site-wide primitives and the long-lived visual language. `site.css` and `visual-identity.css` still contain original foundation forms of some shell selectors; the semantic owner controls the final responsive result.

### Semantic shell owners

`src/styles/components/global-shell.css` owns shared `.shell` width and Footer geometry.

`src/styles/components/header.css` owns final shared Header/Nav behavior, including:

- sticky header chrome and final stacking/background treatment;
- desktop/mobile navigation handoff at `1080/1081px`;
- command search, language, theme and menu control composition;
- mobile menu geometry and interaction-visible state;
- the closed resource popover geometry invariant.

The Header component's scoped Astro style may still own internal structure. It must not become a convenient global feature-style injection point: research diagrams, homepage cards, and other route content stay with their owning component/page even when Header happens to render on every route. `Header.astro` therefore contains no `<style is:global>` block. The global semantic owner exists only for cross-route shell behavior that historically leaked into late global files.

`src/styles/components/webshop-training-note.css` owns the WebShop training-note themed editorial surface that previously escaped through route-scoped styling. Its semantic background/text/color-scheme invariants are part of the CSS architecture audit.

### Named cross-cutting systems

Files such as `actionable-content.css` and `mobile-composition.css` are valid because each has a durable named responsibility. `workspace.css` is feature-owned and imported by `ResearchWorkspace` rather than the global composition root.

`mobile-composition.css` owns mobile reading composition only. Its old Header/mobile-menu compatibility copy has been removed. It must not regain Header/Nav selectors.

`workspace.css` also owns workbench-only hardening and memo rules. Those selectors must not return to the universal compatibility payload; confirmed selectors left behind by retired components may be removed only after production-source reachability checks.

A new global stylesheet must have a durable semantic responsibility that can be described without words such as “fix”, “final”, “hardening”, “closeout”, “cleanup”, or “refinement”.

### Feature/component styles

Prefer feature styling beside or directly imported by the owning component when rules do not need page-wide reach. A component should not depend on a later global override merely because it is faster to patch there.

Astro scoped CSS only matches elements that carry the component's generated scope marker. DOM nodes created later by a component script do not automatically inherit that marker. When a component intentionally creates runtime DOM, keep styling ownership local but make the selector reach explicit: use a tightly namespaced `<style is:global>` block or another proven mechanism that reaches those runtime nodes, then browser-test real geometry/interaction. `is:global` changes selector reach, not semantic ownership, and it does not override stricter component-specific rules such as the Header global-style prohibition above.

`SeedOpenEvoMissionHero.astro` owns the complete `.mission-chain` visual system, including its narrow-screen horizontal rail. `mobile-composition.css` no longer carries a compatibility copy of those selectors. A named cross-cutting mobile layer may provide shared tokens/composition primitives, but it must not become a second owner for a feature that can own its own responsive behavior.

Ordinary corner radii follow the shared 6 / 10 / 16px system in `tokens.css`. Existing one-off pixel radii are migration debt, not a palette to copy. Clean/new components should use `--radius-control`, `--radius-panel`, or `--radius-feature`; pills and circles keep their separate fully rounded semantics. The CSS audit freezes remaining legacy per-file/per-value debt so it can decrease but cannot grow.

State colors follow the semantic tokens in `tokens.css`: positive, warning, danger, info, and muted/unknown roles must not pick raw hex colors inside state selectors. This applies to status/verification/bug/blocker/pending/fit-state UI, not to intentional chart or figure palettes. If two states have different meanings (for example `medium` versus `unknown`), do not merge them under one color rule merely because an old stylesheet did so.

`!important` is also frozen compatibility debt. The current baseline records the remaining declaration count per production CSS/Astro file; a clean/new owner must not introduce it, and an existing file must not increase its frozen count. When a real ownership cleanup removes declarations, lower the baseline with that cleanup instead of treating the old number as a reusable allowance.

### Frozen legacy compatibility layers

These files remain because portions of their cascade still contain required behavior:

- `v2-closeout.css`
- `visual-upgrade.css`
- `design-refinement.css`
- `final-hardening.css`
- `visual-closeout.css`

They are **migration debt, not extension points**.

Current Header/Nav selector inventory is intentionally frozen to:

- canonical owner: `components/header.css`;
- legacy compatibility: `visual-upgrade.css`, `final-hardening.css`;
- foundation history: `site.css`, `visual-identity.css`.

`design-refinement.css`, `visual-closeout.css`, and `mobile-composition.css` are no longer allowed to contain Header/Nav selectors.

Do not delete a whole legacy file merely to make the folder tree cleaner. `design-refinement.css` still contains required editorial/Guide/page behavior even though its Header copy is retired; `final-hardening.css` still contains required page-level responsive/guide/card rules. Retire remaining debt property-owner by property-owner, with browser evidence, until a file is actually empty or semantically redundant.

## Cascade rules

1. Preserve validated import order while retirement is in progress; semantic owners load after compatibility debt and are the only permitted final shell owners.
2. Do not introduce CSS Cascade Layers (`@layer`) merely to reorganize names. Layering changes precedence semantics and is a visual migration.
3. Avoid increasing specificity to win a local conflict. Fix ownership first. During a compatibility cutover, matching an existing selector's specificity is acceptable if it lets the later semantic owner win without adding `!important`; then delete the old copy when proven safe.
4. Treat `!important` as compatibility debt, not a normal authoring tool. Fix semantic/state/selector ownership first; the audit freezes the remaining per-file debt so it cannot spread.
5. Never hide root overflow to make a broken child pass.
6. Responsive rules belong to the component/system whose composition changes.

## Tailwind evaluation

The current answer remains **no migration and no pilot**.

The repository-wide debt reviews found:

- real debt is stale compatibility copies, stale execution documentation, repeated page payload, browser-persistence boundaries, and a few historical patch layers;
- D3, ECharts and Nanostores are actively used rather than orphan dependencies;
- the expensive Landscape engines are already lazy-loaded behind the interactive surface;
- existing semantic owner + audit patterns directly prevent the failure mode that previously produced CSS drift;
- current Production Lighthouse lab baselines on the measured home/results surfaces are 99–100, so there is no performance evidence that replacing native CSS would improve the site.

Tailwind may be reconsidered only if a future isolated surface shows measured authoring/review benefits that the current semantic-owner model cannot provide. A future pilot must preserve `tokens.css` as canonical design truth and must compare browser regressions, review complexity, bundle/build cost, and Agent edit quality against the current implementation. Do not start with a site-wide rewrite.

## Automated gate

`npm run audit:css` verifies:

- `AppLayout.astro` imports only the canonical global entry;
- the explicit `app.css` order and semantic-owner tail remain stable;
- other layouts do not compose their own global CSS stacks;
- no new patch-style stylesheet family appears;
- Header/Nav selectors cannot spread to new files;
- `Header.astro` cannot regain a global style block or feature selectors such as `mission-chain` / `intent-row`;
- `.mission-chain` CSS selectors have exactly one production owner: `SeedOpenEvoMissionHero.astro`;
- `design-refinement.css`, `visual-closeout.css`, and `mobile-composition.css` cannot regain Header/Nav ownership;
- required Header/shared-shell invariants remain in their semantic owners;
- the WebShop training-note theme owner remains wired with semantic surface/text/color-scheme invariants;
- the canonical 6 / 10 / 16px radius tokens remain defined, and frozen non-canonical single-pixel radius debt cannot spread to a new file/value or increase in count.
- selectors that explicitly encode product state contain no raw hex colors; they must use theme-aware semantic tokens instead.
- production `.css` / `.astro` `!important` compatibility debt cannot appear in a new file or increase above the frozen per-file baseline.

`src/lib/globalShellOwnership.test.ts` independently enforces page isolation, owner ordering, breakpoint ownership, retired Header debt, and the frozen remaining selector set.

The structural audit does **not** prove visual correctness. Any declaration, token, selector ownership, cascade, typography, theme, responsive, animation, or layout change still requires task-relevant real-browser acceptance across the supported viewport/theme/language pressure matrix.

## Relationship to project UI policy

This file owns CSS implementation structure and migration discipline.

- `ui-design-principles.md` owns visual identity and non-drift rules.
- `human-thinking-web-expression-contract.md` owns semantic web expression.
- `sitewide-visual-knowledge-architecture.md` owns the knowledge journey.
- `theme-contrast-contract.md` owns theme/contrast correctness.
- `ui-change-visual-acceptance-gate.md` owns browser acceptance.

Changing CSS architecture must preserve those product contracts rather than treating a green compiler or a cleaner folder tree as completion.
