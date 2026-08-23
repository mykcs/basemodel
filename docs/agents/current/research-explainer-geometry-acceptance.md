# Research figure and explainer acceptance gate

Updated: 2026-08-23

This gate applies to canonical research figures and true step-by-step explainers across WebShop, ALFWorld, SEED, OpenEvo, SEED-vs-OpenEvo, and server-authority surfaces.

## Why this gate exists

A successful build and a non-overflowing box are not enough. Two separate regression classes have occurred repeatedly:

1. geometry can be technically valid while connectors drift or nodes overlap;
2. a layout can have zero overflow and still be unreadable because Chinese prose is squeezed into a narrow column, uses 8–10px text, or repeats the same conceptual figure several times.

The second class was previously invisible to release QA because the browser gate measured geometry, clipping, overlap, and contrast but did not measure readable prose width or line density. Interaction ownership also needs an explicit contract: a floating transport is useful while the reader is actually stepping through a long explainer, but the same dock is wrong when it appears over a static canonical figure or a page with no step-by-step interaction.

Acceptance therefore covers **information architecture, readability, geometry, and interaction ownership**.

## Figure ownership rules

A research page must first declare whether a figure is canonical/static or a true step-by-step explainer.

- A canonical figure is complete without JavaScript and owns the stable Figure anchor used by other pages.
- A step-by-step explainer may add Previous / Next / Reset only when the diagram genuinely has a sequence that the reader can advance through.
- A page must not render a canonical comparison and then repeat substantially the same comparison as a second interactive player.
- A summary inside a canonical figure may clarify the mechanism, but it must not recreate the whole left/right comparison a second time.
- Experiment/result pages cite canonical figures instead of owning duplicate background diagrams.

Current SEED-vs-OpenEvo `/loops/` is **canonical-only**: Figure C1 is the comparison. It must not mount `InteractiveResearchExplainer kind="compare"`.

## Required visual matrix

Canonical research figures run at:

- 390×844 light / dark;
- 768×1024 light / dark;
- 1024×900 light;
- 1440×1000 light / dark.

True interactive explainers run at:

- 390×844 light / dark;
- 768×1024 light / dark;
- 1440×1000 light / dark;
- additional 680px / 1082px / 1280px checks where the layout has historically failed.

Representative Chinese and English routes remain required. WebKit acceptance is separate from the repository-owned Vercel Chromium gate and must not be claimed unless actually executed.

## Hard geometry acceptance

For every canonical figure and every interactive step:

- document horizontal overflow: 0 unexpected pixels (2px tolerance for browser rounding);
- figure/explainer root stays inside the viewport;
- audited sibling nodes do not overlap by more than 2px in both axes;
- audited items may not clip horizontally unless the component explicitly owns an intentional scroller;
- connector start and end points resolve from the current DOM node rectangles;
- connector endpoint error must be <= 5px from its declared node anchor;
- a connector may not enter the interior of an unrelated `data-flow-id` node;
- no responsive architecture may use a hand-authored absolute SVG path as its source of truth;
- at narrow widths, a dense horizontal composition must collapse before prose becomes an unreadable narrow column.

## Hard readability acceptance

Readability is a release condition, not a manual preference.

For explanatory prose inside canonical figures and step-by-step explainers:

- normal explanatory prose must compute to at least **10.8px** in interactive explainers;
- canonical-figure prose must compute to at least **11.4px**;
- meta labels such as `STAGE 1`, `POLICY SNAPSHOT`, or `WHAT CHANGES?` may be smaller because they are labels, not explanatory sentences;
- Chinese text with at least 12 CJK characters is measured after fonts settle;
- if such text occupies 3 or more lines, the average must be at least **7 CJK characters per rendered line**;
- a result such as 4–5 Chinese characters per line over many lines is a hard failure even when there is no overflow;
- normal text contrast remains >= 4.5:1 and large text >= 3:1;
- semantic colors remain stable and may not be the only carrier of meaning.

The browser gate reports failures using strings such as `prose font too small` and `CJK prose is too narrow` so this regression class is visible in CI rather than left to a later human screenshot review.

## Interaction ownership acceptance

- Previous / Next / Reset exist only inside a true interactive explainer.
- In system-overview state, the transport stays local to the explainer so a canonical/static figure elsewhere on the same page never appears to own playback.
- When the reader enters step-by-step interaction — by starting the trace, advancing a step, focusing the explainer controls, or actively hovering the explainer on pointer devices — the transport becomes a bottom `position: fixed` dock so Previous / Next remain reachable while reading a long figure.
- Returning to the system overview and moving focus/pointer outside the explainer returns the transport to its local state.
- A static canonical figure must never render transport controls of its own, and canonical-only routes such as `/loops/` must contain no `.irx-transport` at all.
- The floating dock must remain a descendant of its owning `InteractiveResearchExplainer`; floating changes geometry, not ownership.
- keyboard ArrowLeft / ArrowRight / Home / End remain functional for true explainers;
- state changes are visible in the diagram, not only in prose;
- `prefers-reduced-motion: reduce` disables autoplay/animated transitions without hiding meaning.

## Method-specific semantic acceptance

- WebShop observation/action/page/reward stay linked;
- ALFWorld object location and precondition failure stay observable;
- SEED keeps the same sampled actions across plain/skill re-scoring and shows OPD + GRPO convergence;
- OpenEvo shows task-boundary evidence, evolution carrier/state, validation, and successor activation;
- SEED-vs-OpenEvo Figure C1 presents one comparison only: shared experience → method-specific learning/evolution → what changes → next task;
- server view preserves sibling-container semantics and distinguishes technical capability from authorization.

## Static and hydration fallback acceptance

- canonical figures remain complete with JavaScript disabled;
- static SSR content remains readable before hydration;
- deeper interactive content remains available only where it adds a genuinely different reading layer;
- stable Figure anchors continue to resolve from result/reference pages.

## Commands

```text
npm run verify:deploy
npm run build
npm run test:ui
```

`test:ui` includes general UI safety, canonical research figure acceptance, and step-by-step research explainer acceptance.

For release acceptance, the exact PR head must also produce a READY Vercel Preview. Build success is necessary but does not replace browser checks. Production must run the same Chromium gate again from the merged `main` SHA.
