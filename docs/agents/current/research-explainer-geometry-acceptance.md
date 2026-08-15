# Research Explainer geometry acceptance gate

Updated: 2026-08-15

This gate applies to WebShop, ALFWorld, SEED, OpenEvo, SEED-vs-OpenEvo, and server-authority explainers.

## Why this gate exists

Responsive HTML nodes and fixed SVG path coordinates are different coordinate systems. If text wraps, fonts settle, a panel resizes, or the viewport changes, fixed connector paths drift away from their nodes. A successful Astro build cannot detect that failure.

The explainer layer therefore uses one of two patterns only:

1. linear teaching flow: semantic HTML + CSS layout/connector treatment;
2. branch / merge / feedback / authority relation: live DOM measurement (`getBoundingClientRect` + `ResizeObserver`) feeding an overlay SVG in the same container coordinate system.

No responsive architecture may use hand-authored absolute path coordinates as its source of truth.

## Required visual matrix

Run the research explainer browser gate at all of these viewports and themes:

- 390×844 light / dark;
- 768×1024 light / dark;
- 1440×1000 light / dark.

Representative Chinese and English routes must include benchmark, SEED, OpenEvo, loop comparison, server authority, and the reproduction guide.

## Hard geometry acceptance

For every interactive step:

- document horizontal overflow: 0 unexpected pixels (2px tolerance for browser rounding);
- explainer root stays inside the viewport;
- audited sibling nodes do not overlap by more than 2px in both axes;
- connector start and end points resolve from the current DOM node rectangles;
- connector endpoint error must be <= 5px from its declared node anchor;
- no connector may depend on a hard-coded responsive architecture `d="M…"` path;
- at <=760px the desktop SVG edge layer is removed from layout and the explainer becomes a guided vertical flow;
- mobile must retain relationship meaning in text/state, not merely hide the diagram.

## Readability acceptance

Inside the explainer audit surface:

- normal text contrast >= 4.5:1;
- large text contrast >= 3:1;
- semantic colors remain stable: environment blue, experience amber, learning signal red, model/state violet, validated/persistent green;
- semantic line colors and semantic text colors may use separate tokens so small labels remain readable in both themes;
- labels may not rely on color alone.

## Interaction acceptance

- Previous / Next / Reset work at every step;
- keyboard ArrowLeft / ArrowRight / Home / End remain functional;
- state changes are visible in the diagram, not only in prose;
- WebShop observation/action/page/reward stay linked;
- ALFWorld object location and precondition failure stay observable;
- SEED keeps the same sampled actions across plain/skill re-scoring and shows OPD + GRPO convergence;
- OpenEvo shows true carrier fan-out, validation fan-in, successor revision, and Task N+1 feedback;
- server view preserves sibling-container semantics and distinguishes technical capability from authorization.

## Motion and fallback acceptance

- `prefers-reduced-motion: reduce` disables autoplay/animated transitions without hiding meaning;
- static SSR content remains readable before hydration;
- existing deeper Astro content remains available after the interactive first layer.

## Commands

```text
npm run verify:deploy
npm run build
npm run test:ui
```

`test:ui` includes both the general UI safety matrix and the research-explainer geometry gate.

For release acceptance, the exact PR head must also produce a READY Vercel Preview. Build success is necessary but does not replace browser geometry checks.
