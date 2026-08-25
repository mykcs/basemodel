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

### Pre-provider execution gate

For any UI-affecting change, the first provider-triggering ref update is **after** the repository-owned preflight, not before it.

From the exact candidate worktree/ref, run:

```bash
npm run preflight:ui:plan
npm run preflight:ui
```

`preflight:ui:plan` shows the changed paths, their highest UI blast-radius classification, the escaped-regression registry, and the commands that will run. `preflight:ui` then executes that plan without calling Vercel or another deployment provider.

The classifier includes committed, staged, unstaged, and untracked paths relative to the intended base and classifies upward:

- `none`: no UI-affecting path; browser preflight is not required;
- `content` / `local`: deterministic Gate → production build → root-overflow preflight → Chromium `test:ui`;
- `shared` / `global`: deterministic Gate → production build → root-overflow preflight → cross-browser `test:ui:all` on a supported runner.

When a shared/global change requires WebKit, run the preflight on supported macOS, Ubuntu, or Debian. Do not downgrade the candidate to Chromium-only merely because the current execution environment lacks a supported WebKit runtime; keep the cross-browser boundary explicit until a suitable runner is available.

Only after this pre-provider gate passes should an Agent move a ref that can create a Vercel Preview/Production deployment. Vercel remains the exact-head deployment/environment check and final product inspection layer, not the ordinary first place to discover theme, overflow, navigation, hydration, or geometry regressions.

A GitHub/Vercel commit status is not by itself proof that a deployment object was created or a build ran. When deployment usage/quota matters, distinguish the provider status callback from live Vercel deployment records.

When a visual bug escapes to Preview, Production, owner inspection, or external browser QA, add or extend an executable regression for the failure class and keep it wired into the existing gate. Fixing only the visible specimen is not closeout.

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

For shared layout primitives, changed global CSS declarations, theme tokens, navigation, or other cross-browser-sensitive work, run from a Playwright-supported runner:

```bash
npm run test:ui:all
```

This executes the same gate in Chromium and WebKit.

#### Hosted-runner boundary

The repository-owned Vercel browser gate is **Chromium-only**. Vercel's hosted build image is Amazon Linux 2023, while Playwright's WebKit Linux binaries target supported Ubuntu/Debian environments and can require ABI/versioned libraries that AL2023 does not provide. Do not make the Vercel Preview gate fragile by installing Ubuntu WebKit fallback binaries or ad-hoc library shims there.

When WebKit is required, run `npm run test:ui:all` on a Playwright-supported macOS, Ubuntu, or Debian runner. Keep that cross-browser evidence separate from the Vercel exact-head deployment result.

A narrowly defined **cascade-preserving CSS composition refactor** may use `npm run audit:css` + `npm run test:ui` + exact-head Preview review instead of WebKit when all of the following are true:

1. no CSS declaration, selector, token value, media query, typography rule, animation rule, or responsive rule changes;
2. no declaration is moved between owners in a way that changes selector scope;
3. the existing global import order is preserved exactly and `npm run audit:css` proves the canonical graph;
4. the full hosted Chromium matrix and exact-head Preview pass.

This exception is for import/composition structure only. The moment a change alters rendered CSS semantics, selector ownership, cascade order, theme values, typography, navigation behavior, or layout, classify upward and require `npm run test:ui:all` on a supported runner.

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
| cascade-preserving global CSS import/composition refactor with no declaration/token/order change | `npm run audit:css` + `npm run test:ui` + exact-head Preview review |
| local component style or layout | `npm run test:ui` |
| theme tokens / changed global CSS declarations / typography | `npm run test:ui:all` on a supported runner |
| shared visual primitive / header / navigation / workspace shell | `npm run test:ui:all` on a supported runner + exact-head Preview review |
| animation or responsive rewrite | `npm run test:ui:all` on a supported runner + reduced-motion and mobile interaction review |
| docs-only Agent policy | no browser run unless runtime-owned files also changed |

When uncertain, classify upward. Browser verification is cheaper than making the owner discover a predictable regression.

For normal UI work, `npm run preflight:ui` is the canonical pre-provider wrapper around the deterministic Gate, build, overflow preflight, and the risk-selected browser command above. The table remains the semantic minimum; the wrapper prevents future Agents from silently omitting one of the required layers.

---

## 7. Completion-report contract

For UI-affecting work, the Agent must report separately:

```text
pre-provider UI preflight
static Gate
browser UI safety gate
exact-head Vercel deployment
real Preview inspection
remaining subjective review boundary
```

Do not write “UI fixed” based only on source changes, token arithmetic, build success, or a READY deployment.

A valid report names the matrix actually tested, for example:

```text
Pre-provider: risk class + exact candidate/base + PASS/FAIL
UI safety: Chromium, light/dark, 390/768/1440, Chinese representative routes + English sample routes
Cross-browser: WebKit included / not included and why
Artifacts: no failures, or trace/screenshot path for the first failure
Preview: exact commit and routes inspected
```

---

## 8. Cost-aware automation boundary

The repository deliberately does not install/run the full cross-browser Playwright matrix in every hosted Preview build. That protects build time and quota and avoids turning every data/docs edit into browser work.

The compromise is intentional:

- `preflight:ui` is the pre-provider orchestrator for UI-affecting candidate trees;
- `verify:deploy` always protects the static UI contract through Vitest;
- the scenario trigger makes `test:ui` mandatory for UI-affecting work;
- the Vercel hosted UI gate may run the focused Chromium matrix for UI branch families, but must not attempt WebKit on Amazon Linux 2023;
- `test:ui:all` remains the cross-browser command for supported macOS/Ubuntu/Debian runners when the change classification requires it;
- `verify:v2` continues to include the complete E2E suite;
- screenshots/traces/videos are retained when browser checks fail;
- exact-head Preview inspection remains required before owner acceptance.

Do not solve a visual-regression problem by blindly adding an expensive or unsupported full browser matrix to every unrelated deployment. Trigger it precisely when the changed surface requires it and run each browser on an environment that actually supports it.

---

## 9. Ownership

- theme pairs and compatibility aliases: `src/styles/tokens.css`;
- contrast token regression: `src/lib/themeContrast.test.ts`;
- browser UI matrix and geometry/contrast audit: `tests/e2e/ui-safety.spec.ts`;
- pre-provider risk classifier/orchestrator and escaped-regression registry: `scripts/preflight-ui.ts`;
- pre-provider gate wiring regression: `src/lib/preVercelUiGate.test.ts`;
- hosted Chromium trigger: `scripts/vercel-ui-gate.mjs`;
- Playwright failure artifacts: `playwright.config.ts`;
- commands: `package.json` (`preflight:ui:plan`, `preflight:ui`, `test:ui`, `test:ui:all`);
- shared auditable visual primitives: `src/components/visual/*`;
- trigger/router entry: root `AGENTS.md` and `docs/agents/README.md`;
- this policy: `docs/agents/current/ui-change-visual-acceptance-gate.md`.

When a new recurring visual failure appears, improve the existing policy/test/primitive. Do not create another disconnected checklist or rely on conversational memory.

---

## 10. Browser failure classification: product, contract, or measurement

A browser assertion is evidence, not automatically product truth. Before changing UI to satisfy a failed assertion, classify the failure using the current rendered surface and current product authority.

### Real product regression

Treat the failure as product-owned when the browser evidence shows an actual broken property: overflow, clipping, overlap, unreadably narrow geometry, incorrect theme state, missing required interaction, or a canonical entry point that the current product contract still requires.

Fix the component/layout/state. Preserve the test's meaningful safety boundary.

### Stale test contract

A test can lag an accepted redesign. Warning signs include hard-coded headings, item counts, DOM element types, or route structure that current source and current focused contract tests have deliberately replaced.

Before changing the test, require corroborating evidence from the current component plus its current reader/product/unit contract. If they agree and the E2E is stale, update only the retired assumption and keep unrelated geometry, overflow, theme, visibility, and interaction assertions intact.

Do not resurrect duplicate or superseded UI merely to satisfy an old E2E.

### Invalid measurement proxy

A test can point at the correct surface but measure it incorrectly. Inspect the values, not only the assertion name.

For mixed-language copy, a language-specific density proxy must account for the actual rendered language mix. A CJK-only count can misclassify a wide, readable heading containing substantial English tokens. Prefer direct width/line geometry plus a language-agnostic visible-character measure when the content is intentionally mixed-language.

Do not lower broad readability thresholds to hide a bad proxy; repair the proxy and leave the valid geometry checks in place.

### Serial first-failure gates

When the hosted command uses `--max-failures=1`, a repair that turns the first failing test green only unlocks the rest of the suite. Rerun until all tests execute. `N passed / 1 failed / M did not run` means the last `M` are unknown, not green.

The detailed historical case is [`../history/2026-08-26-vercel-ui-gate-serial-failure-recovery.md`](../history/2026-08-26-vercel-ui-gate-serial-failure-recovery.md).
