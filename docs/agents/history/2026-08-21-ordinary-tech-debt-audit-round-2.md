# Ordinary technical-debt audit — round 2

Date: 2026-08-21

Baseline: `main@4cd4e905de450497612fbe1de02063d6dfbd6be0`

This pass re-reviewed the production source after the first ordinary-debt cleanup and the command-search on-demand optimization. The objective was not to make the repository look newer; it was to remove work that is dead, repeated, globally eager, oversized at island boundaries, or unsafe at browser-persistence boundaries while preserving accepted product and research semantics.

## Changes worth making

### 1. Scope the global model quick-view island to routes that can trigger it

`AppLayout` previously mounted `GlobalModelQuickView` on almost every route except `/models` and `/workspace`. Repository search shows the global trigger is needed by the family timeline and paper-detail role diagram; models/workspace own local quick-view behavior.

The global island is now mounted only on `/families[/]` and `/papers/<id>[/]`. This removes a React/Nanostores/fetch-capable idle island from unrelated static routes without removing the feature where it is reachable.

### 2. Restore below-fold hydration boundaries

The rendering policy already says lower-priority visual explorers should use visibility-gated hydration where static HTML remains truthful. The implementation had drifted to `client:load` for the Landscape and family timeline.

- Landscape returns to `client:visible`; its learning view is server-rendered and D3/ECharts remain lazy full-view dependencies.
- FamilyTimeline returns to `client:visible`; the timeline remains server-rendered before interaction.
- PaperRoleDiagram uses `client:visible` because it appears after the paper overview/reproduction material and remains meaningful as SSR HTML.

### 3. Stop serializing oversized props into global and paper-detail islands

Paper detail previously passed the entire model catalog to `PaperRoleDiagram`, although the component only resolves models referenced by that paper/workflow. The Astro page now filters the island prop to referenced model IDs before serialization. Full model quick-view data continues to load on demand from the existing static `/model-data/<id>.json` boundary.

The global layout also previously passed the complete locale `Messages` object separately into `ResearchContextBar`, `GlobalModelQuickView`, and `CompareTray`. Each island now receives only the small label slice it actually renders. This removes repeated serialized locale payload from every page without changing translation ownership or UI copy.

### 4. Harden all browser-local persistence boundaries

Candidate, compare, research-task, project, and decision-snapshot data live in browser storage and can outlive schema changes or be manually corrupted. Several decoders previously trusted shallow type assertions, and project restore could write saved arrays directly into live stores.

This pass makes normalization explicit:

- candidate and compare IDs are string-only, trimmed, de-duplicated, and bounded at their store boundaries;
- project restore goes through replacement helpers instead of direct store writes;
- persisted research-task values normalize back to supported enums, non-negative numeric fields, boolean fields, string lists, and known nested constraint keys;
- saved projects normalize nested task/candidate/compare data before becoming live workspace state;
- saved decision snapshots normalize the same nested state, discard malformed claim fingerprints, and make claim-diff parsing fail closed instead of throwing on stale storage.

### 5. Remove obsolete compatibility helpers

`filterCandidatesByTask` and the old store-level `taskBlockers` export had no repository callers. The latter also encoded weaker semantics than the current GlobalModelQuickView blocker logic. Both are removed instead of retaining a misleading second implementation.

## Re-reviewed and intentionally retained

### Native CSS + design tokens

Keep. The debt discovered in this pass is hydration scope, serialized props, persistence invariants, and legacy ownership cleanup. None of those are solved by translating markup to utility classes.

### Tailwind CSS migration

Do not start a site-wide migration now.

A Tailwind rewrite would create large template churn, invalidate accepted visual evidence, and duplicate the already-working design-token/semantic-owner system without addressing the actual debt found in this audit. Re-open the decision only with measured evidence such as repeated utility-style duplication that survives semantic-owner cleanup, sustained authoring cost attributable to native CSS itself, or adoption of a component system whose tested architecture genuinely requires Tailwind.

### D3 / ECharts

Keep. They are active, data-driven Landscape dependencies and are already lazy-loaded only for the full interactive view.

### Legacy CSS layers

Do not delete whole files by age. `visual-upgrade.css`, `design-refinement.css`, `final-hardening.css`, `site.css`, and `visual-identity.css` still contain active non-Header/page-level behavior. Header/Nav selector copies remain frozen debt and should be retired property-by-property only when the canonical owner has a browser-proven equivalent. The current copies are mostly overridden by the later canonical Header owner, so mass deletion offers little runtime benefit while creating a large cascade-risk diff.

### Cloudflare rollback/provider helpers

Keep while the current hosting policy still defines them as rollback/provider-specific tooling. They are not part of the ordinary Vercel deployment path.

## Remaining ordinary debt

1. Continue the property-level retirement of the remaining legacy Header/Nav selector copies when each removal can be browser-proven.
2. Move page-specific rules out of broad legacy patch layers when a stable semantic owner exists; do not create new patch layers.
3. Establish a durable WebKit execution surface that does not depend on private-repository GitHub-hosted minutes. The 2026-08-21 production WebKit 26.5 acceptance passed via an isolated public production-only harness, but that workaround is evidence, not durable CI architecture.
4. Obtain a real browser performance trace before making further hydration micro-optimizations. Source review can identify obvious eager islands and oversized props, but it cannot substitute for Core Web Vitals/network evidence.

## Acceptance intent

The second-pass changes are intentionally behavior-preserving. Acceptance must include `npm run verify:deploy`, the task-relevant Chromium matrix including the round-2 regression file, and focused interaction checks for family/paper quick view plus Landscape controls. Changes to new visual values, responsive semantics, or browser-specific behavior continue to require real cross-browser acceptance rather than this source audit alone.
