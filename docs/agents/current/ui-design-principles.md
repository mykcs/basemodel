# UI design principles

Status: **current project-wide visual identity and UI requirement**  
Decision date: **2026-08-12**

This file is the durable visual contract for every user-facing BaseModel page and component. It is intentionally more specific than a general “make it clean” guideline so future UI work does not drift when different Agents work on different pages.

The visual north star is:

> **Research Editorial × Experimental Workbench**

The site should feel like a careful research publication when the user is learning or inspecting evidence, and like a precise experimental workbench when the user is making or recording a research decision.

It must not drift toward a generic SaaS dashboard, card gallery, leaderboard, or blue-purple “AI product” landing page.

## 1. Product personality

The interface should communicate:

- **precise** — hierarchy and terminology have deliberate meaning;
- **restrained** — visual emphasis is scarce and therefore useful;
- **traceable** — claims visibly connect to evidence and decisions;
- **readable** — long technical material remains comfortable to learn from;
- **operational** — dense controls appear only where the user is actually doing work.

A more decorated page is not automatically a better page. If a visual treatment does not improve order, hierarchy, comparison, evidence, decision, failure, topology, or executable action, remove it.

### Attention is a budget

Treat visual emphasis as scarce. A first viewport normally gets one primary semantic center, not a dashboard of equally correct facts. Start from the person’s likely question and mental model, surface the one fact they need first, and let lower-priority complexity appear later through ordinary reading order or progressive disclosure. This is not a marketing-hero rule and not an instruction to imitate Apple’s surface styling; it is a cognition rule. Removing information is only justified when the same scientific meaning remains available later. Evidence boundaries that change interpretation stay visible.

## 2. Two canvases, one product

### A. Research Editorial

Use for learning, explanation, papers, model detail, methodology, evidence narratives, family/history views, and public orientation.

Visual character:

- warm paper-like canvas;
- generous whitespace and strong typographic rhythm;
- restrained borders and almost no permanent shadow;
- approximately **720px** reading width for long prose;
- approximately **1120px** editorial width for public page composition;
- selective editorial/serif display typography for major research titles;
- facts, definitions, timelines, source notes, tables, diagrams, and separators instead of repeated cards.

The Editorial canvas should feel like a technical publication with interactive evidence, not a marketing landing page.

### B. Experimental Workbench

Use for `/workspace/`, comparison, candidate analysis, substitution, and decision memo work.

Visual character:

- slightly cooler neutral canvas;
- interface/sans typography;
- denser spacing than Editorial pages;
- approximately **1440px** maximum workbench composition width;
- desktop decision layout biased toward **260px / flexible center / 320px**;
- the candidate/decision surface is the visual center;
- constraints are quieter;
- evidence reads like a source notebook, not a competing dashboard.

The Workbench may be dense, but it should still feel calm. Density must come from useful information, not extra chrome.

## 3. The site-wide visual signature is an evidence line

Prefer a reusable visible reasoning chain over decorative motifs.

Canonical forms include:

```text
Model → Framework → Benchmark → Evidence → Feedback
Fact → Evidence → Judgment → Decision
Source → Claim → Verification → User-facing statement
```

Use semantic HTML, structural CSS, SVG, or real tables/figures when appropriate. Do not encode important process meaning as character-arrow art in production UI.

This evidence-line grammar should recur across home, paper detail, model detail, workspace, comparison, methodology, and research results so the site becomes visually recognizable through how it reasons.

## 4. Card budget: cards are scarce

A bordered rounded rectangle is justified only when at least one of these is true:

1. the user can **choose** the object;
2. the user can **operate** on the object;
3. the object is a summary that must be **isolated** from surrounding content.

Normal explanation, facts, evidence, methods, and sequential steps should prefer:

- whitespace;
- section rhythm;
- thin separators;
- definition lists;
- ordered lists;
- timelines;
- tables;
- evidence/source notebooks;
- structural diagrams;
- inline status labels.

Do not solve a hierarchy problem by wrapping every idea in a new card.

## 5. Shape and elevation contract

Use only three ordinary radius levels:

```text
control  = 6px
panel    = 10px
feature  = 16px
```

Pills are reserved for compact tags/chips/status controls and may remain fully rounded.

Permanent shadows are not an ordinary hierarchy tool.

- flat content: no shadow;
- interactive content: border/background/focus change, normally no shadow;
- floating layers only: dialog, drawer, command menu, popover, compare tray may use a shadow.

Hovering a normal card must not make it “float upward”. Prefer a border or subtle background response and keep layout geometry stable.

Adding another radius family or a new permanent card shadow requires updating this contract and the shared tokens first. Do not introduce one-off values inside a component.

## 6. Color semantics

The durable palette is warm neutral + terracotta + evidence teal.

- terracotta / accent: current selection, primary action, project emphasis;
- teal / positive: evidence verified or supported;
- amber / warning: conditional, partial, or needs attention;
- red / danger: conflict, invalid state, blocker, destructive action;
- gray / unknown: not reported, not verified, or unavailable;
- blue/info: remote/API/access semantics when genuinely useful, not a decorative second accent.

Color never carries state alone. Pair it with text, iconography, shape, or another non-color cue.

Do not introduce a generic neon/blue-purple AI gradient system. Decorative gradients are not part of the product identity.

## 7. Typography

Use the shared interface font stack for navigation, controls, workbench UI, filters, metadata, and dense operational content.

Editorial/serif typography may be used selectively for:

- home research mission titles;
- paper titles;
- major research conclusions;
- major editorial section titles.

Do not use editorial typography for dense workbench controls.

Use the shared mono stack for revision IDs, hashes, field paths, commands, machine-readable keys, and similar technical identifiers.

Long-form reading should remain near the shared reading-width token rather than stretching across the entire page.

## 8. Hierarchy before decoration

Every screen should establish, in order:

1. **where the reader is**;
2. **what question or task is active**;
3. **what the next primary action is**;
4. **what evidence supports the current state**;
5. **what optional depth exists**.

Do not give five unrelated sections equal headline/card/CTA weight.

Home is orientation, not a catalog.  
Paper pages are research cases, not product cards.  
Model pages are decision evidence, not spec sheets.  
Workspace is a staged decision process, not three equal dashboards.

## 9. Responsive and mobile contract

Responsive behavior is a completion requirement.

- multi-column layouts must reorganize intentionally rather than merely shrink;
- text must remain readable without page-level horizontal scrolling;
- tables, diagrams, code, and long identifiers need an explicit narrow-screen strategy;
- important evidence must not disappear on mobile;
- touch targets remain comfortable;
- horizontal rails are acceptable only when continuation is visible and the page itself does not horizontally scroll.

### Persistent-layer budget

On a phone, show at most **two persistent UI layers at the same time**:

1. the global/site header;
2. one contextual action/navigation layer.

If compare state also needs to persist, compact or integrate it so it does not stack a third or fourth full-width bar over the content.

## 10. Motion

Motion exists to explain:

- sequence;
- flow;
- state transition;
- evidence/decision relationship.

Good examples: a data packet moving through a real pipeline, a research step becoming active, evidence highlighting after a claim is selected.

Do not use continuous decorative floating, card lift, parallax, or motion that makes static data look live.

Honor `prefers-reduced-motion`. The static state must remain fully understandable.

## 11. Parallel-PR integration rule

Before broad UI work:

1. inspect currently open PRs and their changed-file ownership;
2. classify work as independent, stacked, superseded, or semantically conflicting;
3. prefer shared tokens and low-conflict visual contracts when page owners are moving in parallel;
4. if the intended design depends on an open architectural PR, stack on its exact head and say so explicitly;
5. never overwrite another PR's semantic improvements merely to make a visual diff easier to merge;
6. after the prerequisite PR merges, retarget/rebase and validate the combined product, not only the isolated branch.

A clean Git merge is not visual acceptance.

## 12. Non-drift stop conditions

Stop and reconsider before adding any of the following:

- a fourth ordinary radius scale;
- a new permanent card-shadow style;
- a new decorative gradient family;
- a new color that duplicates an existing semantic state;
- another global sticky bar;
- a component that turns explanation into a card only for visual variety;
- a page-specific design language that cannot reuse the Editorial/Workbench system;
- a large hero/CTA that competes with the page's real research action.

If a new visual primitive is genuinely necessary, update the shared token/system contract and acceptance test in the same change.

## 13. Acceptance

For a shared/global visual change, completion requires the repository UI acceptance policy and the strongest available browser matrix.

At minimum inspect:

- light and dark themes;
- Chinese and English long-copy pressure;
- phone, tablet, and desktop;
- page-level overflow;
- sticky/fixed-layer collisions;
- hover/focus/touch behavior;
- reduced-motion behavior when animation changed;
- real representative routes rather than only an isolated component.

The owner must not become the first real tester of dark mode, overflow, clipping, or sticky-layer collisions.

### Theme-sensitive change loop — mandatory after every related edit

Any edit that can change foreground color, background/surface color, border color, theme tokens, component-scoped CSS, route-level CSS, or theme switching is **not complete after a final one-time screenshot**. After **every related change**, re-run the affected route in both light and dark themes before continuing or handing off.

The minimum loop is:

1. load the real affected route in **light** theme;
2. switch to **dark** theme without reloading and verify the same surface again;
3. switch back to **light** and verify the state returns correctly;
4. repeat at one desktop and one narrow/mobile viewport when the change can affect layout or wrapping;
5. inspect computed styles or the compiled CSS when a framework/scoping mechanism is involved — source CSS that looks correct is not proof that the emitted selectors match the real DOM;
6. add or extend an executable Playwright regression for any bug that reached a Preview or production deployment.

For Astro specifically, global route overrides must use the actual `is:global` directive. `is="global"` is not equivalent: Astro can still scope the emitted selectors, making apparently-correct theme overrides fail to match components rendered with another scope ID.

The WebShop training-note routes are a permanent regression set because this exact failure reached Preview:

- `/research/seed-openevo/study/results/webshop-training/`;
- `/research/seed-openevo/study/results/seed-training/`;
- `/research/seed-openevo/study/results/openevo-training/`.

A UI/theme change touching these pages, their layout, shared theme tokens, or their CSS ownership must run `tests/e2e/webshop-training-theme.spec.ts` before it is considered complete.

### Regression-class closure — fix the family, not only the specimen

When a UI bug reaches a Preview or production deployment, the repair is incomplete if it only changes the one selector, route, component, or test that exposed the symptom. The same change must close the **failure class** as far as the repository can reasonably prove it.

Required closure steps:

1. reproduce and name the mechanism, not only the screenshot symptom;
2. search the repository for sibling uses of the same syntax, ownership pattern, token misuse, route assumption, or test shortcut;
3. fix every confirmed sibling instance that has the same failure mechanism;
4. add a **negative executable invariant** that makes the bad pattern itself fail CI when practical, rather than only asserting one known-good example;
5. if semantic ownership moved, update the browser route matrix in the same change so tests follow the current canonical owner instead of historical pages;
6. if the bug escaped Preview, verify that the production `main` deployment actually executes the relevant real-browser gate rather than merely containing the test in the repository;
7. preserve the focused regression as part of the broader UI suite so a later refactor cannot silently drop it.

Examples of valid negative invariants include forbidding a known-wrong framework directive repository-wide, freezing a semantic CSS owner in the architecture audit, or asserting that retired non-owner routes cannot re-enter an explainer geometry matrix.

The stopping condition is not “this page looks fixed.” It is: **the observed bug is fixed, confirmed siblings are fixed, and the repository has become materially less permissive of the mechanism that caused it.**

## Relationship to other project rules

This file owns the **visual identity and non-drift rules**.

- `human-thinking-web-expression-contract.md` owns how thought structures become web structures.
- `research-site-presentation-contract.md` owns research-publication purpose, reader-facing depth, and the code/operations disclosure boundary.
- `sitewide-visual-knowledge-architecture.md` owns the whole-site knowledge journey and reusable information grammar.
- `ui-change-visual-acceptance-gate.md` owns browser-level acceptance.
- `theme-contrast-contract.md` owns theme/contrast correctness.
- product/research semantics and evidence truth remain owned by their corresponding current policies and executable tests.

When these documents are applied together, the expected result is not “more UI”; it is a coherent research system whose visual language stays stable even when different Agents change different parts of the site.
