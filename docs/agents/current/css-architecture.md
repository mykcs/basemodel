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
   └─ visual-closeout.css
```

`AppLayout.astro` must not accumulate another list of global stylesheet imports. `app.css` is the only composition root for page-wide CSS.

Feature-owned CSS may still be imported by the component that owns the feature. `InteractiveResearchExplainer.tsx` and its explainer stylesheet are the current example: feature code owns feature styling instead of adding another site-wide override file.

## Ownership classes

### 1. Tokens

`src/styles/tokens.css` is the canonical source for shared color, typography, spacing, radius, width, elevation, and theme values.

Before introducing a repeated literal or a fourth visual scale, decide whether it is truly a new design primitive. If yes, update the token contract and its acceptance coverage. If no, reuse an existing token.

### 2. Foundation

`global.css`, `site.css`, `visual-identity.css`, and `editorial-hierarchy.css` own durable site-wide primitives and visual identity.

Examples include the canvas, shared typography, ordinary controls, common shells, durable shape rules, and the Editorial/Workbench visual language.

### 3. Named cross-cutting systems

Files such as `workspace.css`, `actionable-content.css`, `knowledge-architecture.css`, and `mobile-composition.css` are allowed because they have a named semantic responsibility.

A new global stylesheet requires the same standard: it must have a durable owner that can be described without words such as “fix”, “final”, “hardening”, “closeout”, “cleanup”, or “refinement”.

### 4. Feature/component styles

Prefer feature styling beside or directly imported by the owning component when the rules do not need page-wide reach.

A component should not rely on a later global override merely because it was faster to patch there. When a component is already being changed, migrate relevant overrides back to the component when that can be done without expanding risk unnecessarily.

### 5. Frozen legacy compatibility layers

These files remain because their cascade order has already been browser-validated:

- `v2-closeout.css`
- `visual-upgrade.css`
- `design-refinement.css`
- `final-hardening.css`
- `visual-closeout.css`

They are **migration debt, not extension points**.

Do not create new siblings with patch-oriented names. Do not add a new final override file because an older selector is inconvenient. When a rule in one of these layers must change, first identify its semantic owner. Prefer moving the rule to that owner and deleting the legacy copy.

A temporary edit inside a frozen file is acceptable only when moving ownership in the same change would materially increase regression risk. In that case, keep the patch minimal and leave the file smaller or unchanged in scope; do not broaden it into a new design system.

## Cascade rules

1. Preserve the validated import order in `app.css` until a migration is separately browser-accepted.
2. Do not introduce CSS Cascade Layers (`@layer`) merely to reorganize names. Layering changes precedence semantics and therefore requires deliberate visual migration work.
3. Avoid increasing selector specificity to win a local conflict. Fix ownership first.
4. Treat `!important` as existing compatibility debt, not a normal authoring tool.
5. Never hide root overflow to make a broken child pass. Geometry must remain observable to browser gates.
6. Responsive rules belong to the component/system whose composition changes, even when the temporary legacy rule still lives in `mobile-composition.css`.

## Migration sequence

This is intentionally gradual so visual output stays stable.

### Phase 1 — composition root and guardrail

- route `AppLayout.astro` through `src/styles/app.css` only;
- preserve the existing cascade order exactly;
- add `npm run audit:css`;
- make the deployment gate reject new patch-style global layers.

Phase 1 is deliberately a **cascade-preserving CSS composition refactor**: it changes the import root, not selectors, declarations, tokens, media queries, typography, responsive behavior, or ownership scope. Its acceptance therefore consists of the structural CSS audit, the full exact-head hosted Chromium matrix, and exact-head Preview review. It does not require forcing Playwright WebKit into Vercel's Amazon Linux build image.

### Phase 2 — global shell ownership

When header/navigation/footer work is next touched:

- move header-specific overrides out of `mobile-composition.css`, `final-hardening.css`, and `visual-closeout.css` into the Header/shared-shell owner;
- keep global theme/tokens in the foundation;
- run the full header + UI browser matrix before deleting old rules.

Phase 2 changes selector ownership and potentially rendered cascade semantics, so it must run `npm run test:ui:all` on a Playwright-supported macOS/Ubuntu/Debian runner in addition to exact-head Preview review.

### Phase 3 — responsive ownership

Move component-specific mobile rules from the broad mobile composition file into their real owners. Keep only true cross-site mobile composition primitives in `mobile-composition.css`.

### Phase 4 — retire patch layers

As semantic owners absorb validated rules, shrink the frozen files. Delete a legacy layer once no required rule remains and the exact-head browser matrix passes without it.

### Phase 5 — optional Tailwind evaluation

Reconsider Tailwind only if future evidence shows that utility authoring materially reduces repeated layout code or Agent drift after ownership has already been fixed.

If a pilot is run:

- use a new isolated surface first;
- keep `tokens.css` as the semantic design source;
- do not translate existing CSS merely for syntax uniformity;
- compare bundle/build behavior, maintainability, Agent edit quality, and visual regression rate before expanding adoption.

## Automated gate

`npm run audit:css` protects the structural part of this contract. It verifies:

- `AppLayout.astro` imports only the canonical global entry;
- the validated `app.css` import order remains explicit;
- the foundation import chain remains explicit;
- other layouts do not begin composing their own global CSS stacks;
- no new patch-style stylesheet family is introduced.

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
