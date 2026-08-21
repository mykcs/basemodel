# CSS architecture

Status: **current implementation contract**  
Decision date: **2026-08-20**

## Decision

Base Model will **not** perform a site-wide Tailwind CSS migration at this stage.

The current problem is CSS ownership and cascade drift, not a missing utility framework. The repository already has a durable token system and a validated Astro/React visual stack. Rewriting thousands of lines into Tailwind would create a large visual-regression surface without removing the underlying need for shared components, design tokens, responsive contracts, and browser acceptance.

The implementation strategy is therefore:

```text
preserve Astro + React + CSS variables
-> establish one global stylesheet entrypoint
-> make ownership explicit
-> freeze patch-style global layers
-> migrate touched overrides back to semantic owners
-> delete legacy layers as they become empty
-> reconsider Tailwind only from new evidence
```

## Current phase status

| Phase | Status | Current result |
| --- | --- | --- |
| 1 · composition root | complete | `AppLayout.astro -> app.css`, structural audit, exact-head browser acceptance |
| 2 · global shell ownership | complete | `components/global-shell.css` and `components/header.css` are the final cascade owners; Header rules are removed from `visual-closeout.css` |
| 3 · responsive ownership | complete | the 1080/1081 navigation handoff and phone menu behavior are explicitly owned by `components/header.css`; legacy duplicates are frozen retirement debt, not owners |
| 4 · retire patch layers | complete for the global-shell migration scope | Header/Nav ownership has been physically removed from the final `visual-closeout.css` patch layer; remaining patch files still contain required non-shell behavior and are frozen to shrink when touched |
| 5 · Tailwind evaluation | complete: no pilot | current evidence points to ownership debt, not utility-authoring friction, so no Tailwind dependency or pilot is introduced |

Phases 2–5 are closed for the global-shell convergence scope. Remaining non-shell declarations in historical patch files are ordinary incremental migration debt, not an unfinished shell phase and not a reason to rewrite unrelated page behavior. There is no Phase 6 in the current plan. A new phase should be defined only if a new, independently testable architecture problem appears.

## Canonical import graph

All page-wide CSS enters the application through one file:

```text
AppLayout.astro
└─ src/styles/app.css
   ├─ global.css
   │  ├─ tokens.css
   │  ├─ site.css
   │  └─ visual-identity.css
   │     └─ editorial-hierarchy.css
   ├─ workspace.css
   ├─ frozen legacy compatibility layers
   ├─ actionable-content.css
   ├─ knowledge-architecture.css
   ├─ mobile-composition.css
   ├─ visual-closeout.css
   └─ components/
      ├─ global-shell.css
      └─ header.css
```

`AppLayout.astro` must not accumulate another list of global stylesheet imports. `app.css` is the only composition root for page-wide CSS.

The semantic shell owners deliberately load after retained compatibility layers during the migration. This makes ownership explicit without requiring an unsafe all-at-once rewrite of every large historical stylesheet. A legacy declaration that is superseded by a semantic owner is deletion debt and must not be extended.

Feature-owned CSS may still be imported by the component that owns the feature. `InteractiveResearchExplainer.tsx` and its explainer stylesheet are the current example: feature code owns feature styling instead of adding another site-wide override file.

## Ownership classes

### 1. Tokens

`src/styles/tokens.css` is the canonical source for shared color, typography, spacing, radius, width, elevation, and theme values.

Before introducing a repeated literal or a fourth visual scale, decide whether it is truly a new design primitive. If yes, update the token contract and its acceptance coverage. If no, reuse an existing token.

### 2. Foundation

`global.css`, `site.css`, `visual-identity.css`, and `editorial-hierarchy.css` own durable site-wide primitives and visual identity.

Examples include the canvas, shared typography, ordinary controls, durable shape rules, and the Editorial/Workbench visual language. During migration, `site.css` and `visual-identity.css` may still contain the original foundation form of some shell selectors; the final responsive/interaction contract is owned by the semantic component owner.

### 3. Semantic shell owners

`src/styles/components/global-shell.css` owns shared `.shell` width and Footer geometry that had accumulated later overrides.

`src/styles/components/header.css` owns the final shared Header/Nav behavior that must remain stable across route classes and viewports, including:

- sticky header chrome and final stacking/background treatment;
- desktop/mobile navigation handoff at `1080/1081px`;
- command search, language, theme and menu control composition;
- mobile menu geometry and interaction-visible state;
- the closed resource popover geometry invariant.

The component's scoped Astro style remains the base styling of its internal structure. The semantic owner exists for page-wide shell behavior that historically leaked into later global files.

### 4. Named cross-cutting systems

Files such as `workspace.css`, `actionable-content.css`, `knowledge-architecture.css`, and `mobile-composition.css` are allowed because they have a named semantic responsibility.

`mobile-composition.css` now owns cross-site mobile reading composition, not the final Header/Nav contract. Any remaining Header declarations in that file are frozen compatibility copies and must be deleted opportunistically when that file is next changed; they may not be extended or treated as an alternate owner.

A new global stylesheet requires the same standard: it must have a durable owner that can be described without words such as “fix”, “final”, “hardening”, “closeout”, “cleanup”, or “refinement”.

### 5. Feature/component styles

Prefer feature styling beside or directly imported by the owning component when the rules do not need page-wide reach.

A component should not rely on a later global override merely because it was faster to patch there. When a component is already being changed, migrate relevant overrides back to the component when that can be done without expanding risk unnecessarily.

### 6. Frozen legacy compatibility layers

These files remain because portions of their cascade have already been browser-validated and still contain required non-shell behavior:

- `v2-closeout.css`
- `visual-upgrade.css`
- `design-refinement.css`
- `final-hardening.css`
- `visual-closeout.css`

They are **migration debt, not extension points**.

Header/Nav legacy selector debt is frozen to `visual-upgrade.css`, `design-refinement.css`, `final-hardening.css`, and `mobile-composition.css`. `visual-closeout.css` is no longer allowed to contain Header/Nav selectors. Foundation copies in `site.css` and `visual-identity.css` remain valid foundation history, while the semantic owner controls the final responsive result.

Do not create new siblings with patch-oriented names. Do not add a new final override file because an older selector is inconvenient. When a rule in one of these layers must change, first identify its semantic owner. Prefer moving the rule to that owner and deleting the legacy copy.

A temporary edit inside a frozen file is acceptable only when moving ownership in the same change would materially increase regression risk. In that case, keep the patch minimal and leave the file smaller or unchanged in scope; do not broaden it into a new design system.

## Cascade rules

1. Preserve the validated legacy import order while retirement is in progress; semantic owners load after that debt and are the only permitted final shell owners.
2. Do not introduce CSS Cascade Layers (`@layer`) merely to reorganize names. Layering changes precedence semantics and therefore requires deliberate visual migration work.
3. Avoid increasing selector specificity to win a local conflict. Fix ownership first. During a compatibility cutover, matching an existing legacy selector's specificity is acceptable when it lets the later semantic owner win without adding `!important`; delete the legacy duplicate when that source is next safely migrated.
4. Treat `!important` as existing compatibility debt, not a normal authoring tool. When an existing `!important` moves into an owner, remove it when the legacy source that required it is retired and browser evidence proves the lower-specificity contract.
5. Never hide root overflow to make a broken child pass. Geometry must remain observable to browser gates.
6. Responsive rules belong to the component/system whose composition changes. A legacy duplicate may remain temporarily only as frozen deletion debt.

## Migration sequence

### Phase 1 — composition root and guardrail

Complete.

- route `AppLayout.astro` through `src/styles/app.css` only;
- preserve the existing cascade order exactly;
- add `npm run audit:css`;
- make the deployment gate reject new patch-style global layers.

Phase 1 was deliberately a **cascade-preserving CSS composition refactor**. Its accepted exact-head browser evidence therefore used the structural CSS audit, full hosted Chromium matrix, and Preview review without forcing WebKit into Vercel's Amazon Linux build image.

### Phase 2 — global shell ownership

Complete for implementation:

- `components/global-shell.css` owns shared shell width and Footer geometry;
- `components/header.css` owns final Header/Nav behavior;
- Header-specific rules have been removed from `visual-closeout.css`;
- the structural audit and Vitest ownership gate reject new Header-owner files and prevent `visual-closeout.css` from regaining Header selectors.

Because this phase changes selector ownership and rendered cascade semantics, release acceptance requires the full hosted Chromium matrix plus WebKit on a Playwright-supported runner and exact-head Preview review.

### Phase 3 — responsive ownership

Complete for the global Header contract.

The final responsive Header behavior is explicit in `components/header.css`, including the existing `1080px` mobile / `1081px` desktop handoff and compact phone menu states. Physical duplicate declarations still present in historical files are not alternate owners; structural gates prevent that debt from spreading.

### Phase 4 — retire patch layers

Complete for the global-shell migration scope.

The goal of this phase is not to delete files merely to produce a cleaner folder tree. It is to remove late patch ownership from the shell while preserving unrelated validated behavior. The shell slice is closed because:

1. the final Header/Nav and shared-shell behavior lives in semantic owners;
2. the late `visual-closeout.css` Header/Nav overrides were physically removed;
3. remaining Header-like legacy declarations are frozen and cannot spread to new files;
4. each retained patch file still contains required non-shell behavior, so deleting the entire file would expand this task into unrelated visual redesign work.

Future changes to a retained legacy file must make that file smaller or keep its scope unchanged. Whole-file retirement remains the preferred outcome once all required rules in that file have semantic owners.

### Phase 5 — Tailwind evaluation

Complete. Evaluation result for 2026-08-20: **do not start a Tailwind pilot**.

Evidence:

- the concrete defects found in Phase 1–4 are ambiguous ownership, late overrides, duplicated responsive contracts, and runner-policy drift;
- none of those defects is caused by the absence of utility classes;
- semantic owner files and executable ownership gates directly address the failure mode without adding another build/runtime dependency;
- translating the existing site would create a new visual-regression surface before legacy debt is retired.

Tailwind may be reconsidered only after legacy debt is materially smaller and a new isolated surface demonstrates, with measured review/build/regression evidence, that utility authoring improves Agent edit quality. `tokens.css` remains canonical even in any future pilot.

## Automated gate

`npm run audit:css` protects the structural part of this contract. It verifies:

- `AppLayout.astro` imports only the canonical global entry;
- the explicit `app.css` import order and semantic-owner tail remain stable;
- the foundation import chain remains explicit;
- other layouts do not begin composing their own global CSS stacks;
- no new patch-style stylesheet family is introduced;
- Header/Nav selectors cannot spread to new global files;
- `visual-closeout.css` cannot regain Header/Nav ownership;
- the Header and shared shell owners retain their required breakpoint/geometry invariants.

`src/lib/globalShellOwnership.test.ts` independently enforces page isolation, owner ordering, Header breakpoint ownership, visual-closeout retirement, and the frozen legacy debt set.

The audit does **not** prove visual correctness. Shared/global CSS changes still require the repository UI acceptance policy and real browser coverage for light/dark, Chinese/English pressure, phone/tablet/desktop, overflow, focus/touch, sticky layers, and reduced motion where relevant.

Browser depth follows the semantic change, not the filename alone. A composition-only import-root refactor with unchanged declarations/order may use `audit:css` + hosted Chromium + exact-head Preview. Any declaration, token, selector ownership, cascade order, typography, theme, responsive, animation, or layout change is classified upward and requires the cross-browser command on a supported runner.

## Relationship to project UI policy

This file owns **CSS implementation structure and migration discipline**.

- `ui-design-principles.md` owns visual identity and non-drift rules.
- `human-thinking-web-expression-contract.md` owns semantic web expression.
- `sitewide-visual-knowledge-architecture.md` owns the knowledge journey.
- `theme-contrast-contract.md` owns theme/contrast correctness.
- `ui-change-visual-acceptance-gate.md` owns browser acceptance.

Changing CSS architecture must preserve those product contracts rather than treating a green compiler or a cleaner folder tree as completion.
