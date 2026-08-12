# UI change visual acceptance gate

Status: **current and mandatory for UI-affecting work**
Audience: coding Agents, frontend Agents, review Agents, browser-verification Agents

## Why this document exists

A sitewide visual redesign passed the repository build and Vercel deployment, but the owner had to open the Preview to discover that some dark-mode cards were almost unreadable. The immediate bug was a light-only white fallback combined with dark-theme text, but the durable failure was procedural:

> **the owner became the first real visual tester.**

That must not happen again for predictable UI failures.

This document is a scenario-based future warning. When an Agent changes UI, it must assume that one or more of the failure modes below has already happened and proactively try to falsify the new implementation before asking the owner to inspect it.

The owning contrast rules remain in `theme-contrast-contract.md`. This file adds the broader browser/layout/state acceptance gate.

---

## 1. Automatic trigger

Load and execute this gate whenever a change touches or implies any of the following:

- CSS, design tokens, themes, colors, opacity, shadows, borders, gradients;
- page layout, grid, flex, positioning, sticky/fixed elements, z-index;
- typography, font size, line height, truncation, wrapping, code blocks;
- responsive behavior or mobile navigation;
- shared components, cards, route maps, diagrams, tables, modals, drawers, details/summary;
- Chinese/English copy whose length may alter layout;
- animation, transitions, reduced-motion behavior;
- hydration or state changes that alter visible UI;
- a broad UI redesign, even when the source diff appears visually simple.

Do not wait for the owner to ask for dark-mode, mobile, overlap, clipping, or theme-switch verification.

---

## 2. Future-failure scenarios to assume

Before calling a UI change complete, explicitly attempt to disprove all applicable scenarios.

### Scenario A — light mode hides a dark-mode bug

Predicted failure:

- an undefined CSS variable falls back to `#fff`;
- the card remains white in dark mode;
- inherited text becomes light;
- the UI looks correct only in light mode.

Required falsification:

- load the page directly in light and dark themes;
- switch themes after hydration without reloading;
- inspect computed page, surface, muted, border, and on-fill pairs;
- run the token contrast regression.

### Scenario B — required text becomes decorative through opacity

Predicted failure:

- small labels use `opacity: .4` or similar;
- one theme or one surface makes the text effectively disappear;
- the heading remains readable, so a superficial screenshot misses the failure.

Required falsification:

- inspect captions, metadata, limitations, table headers, evidence notes, details content, and button labels;
- required information must use semantic text tokens, not low opacity;
- decorative marks must be `aria-hidden` and have a text equivalent.

### Scenario C — desktop layout passes while mobile overlaps or clips

Predicted failure:

- a six-column process map is compressed into unreadable cards;
- a sticky/fixed element covers content;
- long labels overlap adjacent nodes;
- the document gains horizontal page overflow;
- a scroll container is missing and a table escapes the viewport.

Required falsification:

- run at 390px, 768px, and 1440px widths;
- assert no document-level horizontal overflow;
- assert critical text is not clipped by `overflow: hidden/clip`;
- assert audited sibling items do not geometrically overlap;
- verify intentional horizontal scrolling is contained locally.

### Scenario D — English or long Chinese strings break an otherwise valid layout

Predicted failure:

- English headings are longer than Chinese labels;
- a model name, paper title, path, SHA, or URL refuses to wrap;
- one locale causes buttons or cards to overlap.

Required falsification:

- include representative Chinese and English routes;
- use real long model/paper names rather than placeholder text;
- verify wrapping and minimum-size behavior at mobile width.

### Scenario E — theme switching leaves stale computed styles

Predicted failure:

- direct dark-mode load works;
- switching the theme button after hydration leaves a stale card, chart, SVG label, or third-party component color;
- only a reload makes the page correct.

Required falsification:

- toggle light → dark → light in the same session;
- verify `html[data-theme]`, page background, at least one surface, text, and filled action all change coherently;
- re-run the browser safety audit after each transition.

### Scenario F — expanded or interactive states collide

Predicted failure:

- `<details>` content overlaps the next section;
- a filter panel, menu, dialog, tooltip, comparison tray, or mobile drawer covers controls unexpectedly;
- focus outlines are clipped or invisible.

Required falsification:

- test default and expanded/open states;
- use keyboard focus, Escape, and the principal click path;
- verify overlays have intentional stacking and do not create inaccessible hidden controls.

### Scenario G — animation carries meaning or causes instability

Predicted failure:

- the static page does not explain direction without motion;
- reduced-motion users lose information;
- animation changes geometry or causes text to jitter.

Required falsification:

- disable motion with `prefers-reduced-motion`;
- verify the static route, numbering, arrows, and labels still communicate order;
- animation may reinforce flow, never define it.

---

## 3. Required acceptance matrix

The browser gate uses representative routes rather than pretending every one of hundreds of static detail pages needs a unique manual review.

### Themes

- light direct load;
- dark direct load;
- light → dark → light switch after hydration.

### Viewports

- mobile: `390 × 844`;
- tablet/narrow desktop: `768 × 1024`;
- desktop: `1440 × 1000`.

### Locales

- Chinese primary path;
- representative English home/index/detail/operational paths.

### Representative route classes

- home;
- Guide;
- model index;
- one long-name model detail;
- paper index;
- one paper detail;
- workspace;
- data status;
- methodology;
- OpenEvo reproduction guide when that stacked feature is present.

### States

- default static state;
- theme switched after hydration;
- expanded `<details>` or filter state where relevant;
- mobile navigation or another primary responsive interaction where changed.

---

## 4. Four-layer verification model

### Layer 1 — static semantic/token checks

Run through the normal Vitest gate:

- semantic theme pairs exist;
- light/dark contrast thresholds pass;
- visual components do not reintroduce light-only fallback colors;
- the UI safety harness and commands remain wired.

This layer is fast and belongs in `npm test` / `verify:deploy`.

It cannot prove that the browser layout is correct.

### Layer 2 — browser property audit

Run:

```bash
npm run test:ui
```

The Chromium UI safety suite checks the theme/viewport/route matrix for:

- document-level horizontal overflow;
- clipped required text;
- audited sibling overlap;
- visible audited text with inadequate contrast;
- theme initialization and transition state.

For shared layout primitives, global theme/CSS, navigation, or cross-browser-sensitive work, run:

```bash
npm run test:ui:all
```

This executes the same gate in Chromium and WebKit.

### Layer 3 — failure evidence

Playwright is configured to retain on failure:

- screenshot;
- trace;
- video.

Do not report only “Playwright failed.” Inspect the first failing route/theme/viewport and identify whether the root cause is color pairing, clipping, overlap, overflow, or state transition.

### Layer 4 — exact-head Preview inspection

After automated checks pass:

- confirm Vercel built the exact intended commit;
- inspect the real protected Preview or generate a temporary share link;
- review the primary changed routes in both themes;
- verify the intended visual hierarchy and subjective design quality.

A Vercel READY badge proves deployment, not visual acceptance.

The Preview review is the final product judgment, not the first bug detector.

---

## 5. Auditable-component markup contract

Reusable visual/process components should opt into browser auditing:

```html
<section data-ui-audit="contrast layout">
  <ol>
    <li data-ui-audit-item>...</li>
    <li data-ui-audit-item>...</li>
  </ol>
</section>
```

Meaning:

- `data-ui-audit` identifies a visual region whose visible text and geometry are required;
- `data-ui-audit-item` identifies sibling nodes that must not overlap;
- purely decorative content should use `aria-hidden="true"`;
- an intentional exceptional overlap must be documented and marked with `data-ui-audit-ignore`, not silently excluded in the test.

The shared route, layer, and evidence components are the reference implementation.

---

## 6. Change classification and required command

| Change type | Minimum required verification |
|---|---|
| copy-only with no length/layout effect | normal deterministic Gate |
| local component style or layout | `npm run test:ui` |
| theme tokens / global CSS / typography | `npm run test:ui:all` |
| shared visual primitive / header / navigation / workspace shell | `npm run test:ui:all` + exact-head Preview review |
| animation or responsive rewrite | `npm run test:ui:all` + reduced-motion and mobile interaction review |
| docs-only Agent policy | no browser run unless runtime-owned files also changed |

When uncertain, classify upward. Browser verification is cheaper than making the owner discover a predictable regression.

---

## 7. Completion-report contract

For UI-affecting work, the Agent must report separately:

```text
static Gate
browser UI safety gate
exact-head Vercel deployment
real Preview inspection
remaining subjective review boundary
```

Do not write “UI fixed” based only on source changes, token arithmetic, build success, or a READY deployment.

A valid report names the matrix actually tested, for example:

```text
UI safety: Chromium, light/dark, 390/768/1440, Chinese representative routes + English sample routes
Cross-browser: WebKit included / not included and why
Artifacts: no failures, or trace/screenshot path for the first failure
Preview: exact commit and routes inspected
```

---

## 8. Cost-aware automation boundary

The repository deliberately does not install/run full Playwright in every hosted Preview build. That protects build time and quota and avoids turning every data/docs edit into browser work.

The compromise is intentional:

- `verify:deploy` always protects the static UI contract through Vitest;
- the scenario trigger makes `test:ui` mandatory for UI-affecting work;
- `verify:v2` continues to include the complete E2E suite;
- screenshots/traces/videos are retained when browser checks fail;
- exact-head Preview inspection remains required before owner acceptance.

Do not solve a visual-regression problem by blindly adding an expensive full browser matrix to every unrelated deployment. Trigger it precisely when the changed surface requires it.

---

## 9. Ownership

- theme pairs and compatibility aliases: `src/styles/tokens.css`;
- contrast token regression: `src/lib/themeContrast.test.ts`;
- browser UI matrix and geometry/contrast audit: `tests/e2e/ui-safety.spec.ts`;
- Playwright failure artifacts: `playwright.config.ts`;
- commands: `package.json` (`test:ui`, `test:ui:all`);
- shared auditable visual primitives: `src/components/visual/*`;
- trigger/router entry: root `AGENTS.md` and `docs/agents/README.md`;
- this policy: `docs/agents/current/ui-change-visual-acceptance-gate.md`.

When a new recurring visual failure appears, improve the existing policy/test/primitive. Do not create another disconnected checklist or rely on conversational memory.
