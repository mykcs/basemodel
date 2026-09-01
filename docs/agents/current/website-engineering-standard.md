# Website engineering standard

Status: **current cross-cutting implementation standard**  
Decision date: **2026-08-22**  
Audience: coding, frontend, refactor, performance, browser-test and release Agents

## Purpose

Use this document as the default engineering posture for ordinary Base Model website work. It summarizes durable decisions; detailed CSS, rendering, browser, deployment and release rules remain with their existing owner documents.

Default shape:

```text
preserve accepted architecture
-> identify a concrete failure or measurable opportunity
-> change the smallest semantic owner
-> verify the exact changed behavior/tree
-> release and verify Production
-> stop when the requested problem is closed
```

Do not create another optimization phase merely because further cleanup is theoretically possible.

## 1. Accepted stack is a baseline, not migration debt

The ordinary stack is:

```text
Astro static output
+ focused React islands
+ TypeScript
+ native CSS / CSS variables / design tokens
+ Vitest
+ Playwright
+ Vercel Preview + Production
```

- Preserve Astro + React unless a concrete product/runtime requirement makes the current model insufficient.
- Preserve native CSS and the current token + semantic-owner model.
- Do **not** start a site-wide Tailwind, CSS-in-JS, framework, SSR or hosting rewrite merely because another stack appears newer or tidier.
- A future Tailwind experiment requires measured evidence that native CSS ownership is the cause of a real problem, and starts as a bounded pilot. It does not begin as a whole-site migration.
- Keep `tokens.css` as design truth unless an explicit architecture decision replaces it.

Detailed owners: `css-architecture.md`, `rendering-and-performance-policy.md`.

## 2. Prefer semantic ownership over override accumulation

- Page-wide CSS enters through `src/styles/app.css`; do not create another global composition root.
- Shared tokens belong in `src/styles/tokens.css`.
- Shared Header/shell behavior belongs to established semantic owners under `src/styles/components/`.
- Feature styles stay with their feature unless global reach is genuinely required.
- Heading ownership follows component ownership: the page root owns the single `<h1>`; embeddable components use lower ranks or an explicit heading-level prop. `npm run build` audits generated static HTML so duplicate page-level headings fail before deployment.
- Do not add new global files whose purpose is effectively “fix”, “final”, “hardening”, “closeout” or “refinement”.
- Do not increase specificity or add `!important` as the default cascade strategy; repair ownership first.
- Do not mass-delete old CSS because it is old. Retire compatibility copies property-by-property after the canonical owner is browser-proven.
- Delete duplicate helpers/formatters/state decoders only after repository evidence proves a canonical replacement exists.

A tidier directory tree is not sufficient evidence for a risky migration.

## 3. Static-first and narrow-island rendering

Public research and knowledge content should remain useful in generated HTML whenever a truthful static state exists.

Classify interaction deliberately:

- render-only: no `client:*`;
- immediate/above-fold interaction: `client:load` when actually necessary;
- supporting global UI: usually `client:idle`;
- below-fold/expensive exploration: usually `client:visible`.

Additional rules:

- Route-scope islands to pages that can actually trigger them.
- Serialize the narrowest props an island renders; do not repeat full catalogs or full locale trees across global islands.
- Prefer existing static JSON/data routes for interaction-only data.
- Keep D3/ECharts or other heavy engines behind visibility/interaction boundaries when practical.
- Do not introduce SSR/functions merely to solve browser URL/local-state behavior unless that is an explicit architecture decision.

### User-provided and brand assets are implementation inputs, not automatic generation requests

When a user supplies a screenshot, logo, icon, or visual reference and asks to use that identity in the website, treat it first as **repository/UI asset work**, not as an instruction to synthesize new media.

- Do not generate, redraw, or restyle the visual unless the user explicitly asks to create or edit media.
- Distinguish **exact supplied pixels** from **recognizable brand/entity identity**. If exact pixels matter, use the supplied binary through a binary-safe path and verify file type, dimensions, and hash when identity matters.
- For a named model/provider/brand, prefer a first-party official asset over an invented pictogram when one exists. Pin immutable upstream content or vendor the asset according to current repository policy.
- Do not move binary UI assets through ad-hoc hand-assembled base64/shell text paths when a binary-safe repository/file route exists.
- Verify the actual rendered mark in the real component and representative themes/viewports. An “official” filename or upstream source is provenance evidence, not visual acceptance by itself.
- If a supplied reference and the available first-party asset differ materially, surface that discrepancy rather than silently choosing one.

Historical case: [`../history/2026-08-27-seed-glm-stage1-and-brand-asset-retrospective.md`](../history/2026-08-27-seed-glm-stage1-and-brand-asset-retrospective.md).

## 4. SSR-visible controls must preserve the user's first interaction

Visibility and hydration are different states. An Astro/React control can be visible in SSR HTML while its client handler is not attached yet.

The durable rule from the 2026-08-21 QuickView incident is:

> If a server-rendered control is presented to the user as clickable, the product must not silently lose the first click merely because the owning island has not hydrated yet.

Therefore:

- A browser test that intentionally exercises **hydrated** behavior should wait for a real hydration signal, not a guessed sleep.
- But “the click happened before hydration” is **not automatically a harness failure** when a real user can make that same click on visible SSR UI.
- For independently hydrated trigger/receiver islands, prefer the least invasive readiness design. A tiny delegated/pre-hydration bridge that preserves the first interaction can be better than making every island eager.
- Such a bridge must be route-scoped, act only during the SSR→hydrated gap, and hand off to the canonical React/store path after hydration.
- When first-click preservation matters, add a deterministic regression that keeps the trigger island unhydrated (for example by blocking its client bundle or asserting its `ssr` marker), performs the visible SSR click, and verifies the real product effect.
- If an interaction still fails after required hydration or after the first-click bridge has accepted it, treat that as a product/browser failure until disproven.

Do not “fix” hydration races by globally upgrading every island to `client:load` without evidence.

Detailed owner: `ui-change-visual-acceptance-gate.md`. Historical evidence remains under `docs/agents/history/` and PR #185.

## 5. Browser-local persistence is untrusted, long-lived input

`localStorage`, saved snapshots and URL/browser state can outlive schemas or be corrupted.

At persistence boundaries:

- normalize/validate before values become live application state;
- reject unsupported enums and invalid numeric ranges/types;
- trim/de-duplicate string arrays and enforce product bounds;
- ignore unknown keys unless supported intentionally;
- fail closed on malformed JSON/fingerprints rather than throwing through the UI;
- restore state through canonical APIs rather than writing directly into internal stores;
- cover malformed and old-schema cases with deterministic tests where practical.

TypeScript assertions are not runtime validation.

## 6. Classify red Gates before changing the product

For ordinary deployable work:

```bash
npm run verify:deploy
npm run build
```

For UI-affecting work, also run the task-required browser matrix.

Classify failures first:

```text
product/runtime failure
contract violation
hydration/readiness failure
harness failure
environment/runner failure
stale test/policy
provider quota/rate-limit failure
```

- Do not weaken a valid threshold to get green.
- Retries are diagnostic, not proof of stability.
- A stale test should be updated to the current product contract, not satisfied by restoring retired UI.
- An unsupported browser runner or missing library is environment evidence, not a browser-product failure.

## 7. Chromium and WebKit have different execution boundaries

- Vercel's hosted browser gate is Chromium-only.
- Do not force Playwright WebKit into Vercel Amazon Linux with Ubuntu fallback binaries or ad-hoc library shims.
- Run WebKit on a Playwright-supported macOS/Ubuntu/Debian runner and confirm the browser actually launched and assertions completed before reporting PASS.
- A public Production black-box harness may be used only when it contains no private BaseModel source/credentials and tests only already-public URLs.
- Public Production WebKit evidence is not private exact-head Preview evidence; state the boundary precisely.

## 8. Acceptance belongs to an exact tree

A PR number, branch name, READY badge or remembered green run is not an acceptance identity.

Before merge, tie evidence to:

```text
accepted head SHA
intended base SHA
required deterministic Gate/build
required browser evidence
exact-head Preview deployment
```

Immediately before merge:

- refresh PR head and current `main`;
- invalidate stale evidence when head/base moved materially;
- inspect semantic overlap, not only textual mergeability;
- use expected-head merge locking where supported.

After merge, verify separately:

```text
accepted tree
-> merged main tree
-> Vercel Production READY for the intended main SHA/tree
-> representative public route/interaction/metadata checks
```

When squash merge changes the commit SHA, compare Git tree SHA to prove file identity where appropriate.

## 9. Provider-triggering writes are a finite resource

Vercel deployments are not a free editing loop.

Default release shape:

```text
one coherent branch/PR
-> one atomic initial push
-> one exact-head Preview
-> at most one normal evidence-driven corrective Preview
-> one Production deployment
```

- Batch related edits before provider-triggering ref updates.
- Prefer atomic Git data writes when tooling supports them.
- Do not create repeated no-op commits merely to poll provider availability.
- The Hobby rolling daily deployment quota can reject a deployment **before build starts** (`api-deployments-free-per-day`). Classify that as provider quota, not code failure.
- When the rolling 24-hour quota is exhausted, stop burning attempts. Keep the accepted source/tree stable, use existing valid evidence where its boundary is exact, and re-trigger once the provider actually allows builds again.
- Do not let superseded experiment branches consume deployment budget.
- Docs-only work should follow the repository build classifier rather than manufacturing browser runs.

Detailed owners: `deployment-policy.md`, `hosting-architecture.md`, `release-closeout-protocol.md`.

## 10. Temporary browser infrastructure must leave no active debt

A temporary public harness is acceptable only when:

1. the target is already public;
2. no private BaseModel source, credentials, private artifacts or secrets are copied into it;
3. it is clearly temporary and never merged into an unrelated repository;
4. its result is reported as Production black-box evidence, not private exact-head evidence;
5. the successful historical run can remain after cleanup.

Afterward:

- close the temporary PR without merging;
- reset/delete temporary branch contents so no active workflow/diff remains;
- do not leave a permanent Actions workflow merely because a one-off fallback worked.

Permanent cross-browser CI is a separate, explicit architecture decision.

## 11. Performance work needs evidence and a stopping rule

Prefer, in order:

1. remove unnecessary hydration;
2. keep public content useful before JS;
3. route-scope/defer low-priority islands;
4. narrow repeated serialized props;
5. lazy-load heavy interactive engines;
6. harden persistence boundaries and remove proven duplicate helpers;
7. use browser traces/field data for finer tuning only when needed.

Do not claim Core Web Vitals or network improvements without measurement.

Once the requested problem is fixed, relevant gates are green and release is verified, **stop**. Further cleanup requires a new explicit request or new measured evidence.

Historical end-to-end case: [`../history/2026-08-30-site-optimization-implementation-and-release-retrospective.md`](../history/2026-08-30-site-optimization-implementation-and-release-retrospective.md) records the 95-branch audit → fail-closed Gate repair → payload/hydration reduction → no-JS/WebKit regressions → exact-tree Preview/CI → expected-head merge → Production `READY` sequence that motivated several rules above.

## 12. Durable knowledge belongs in the best existing owner

Conversation is not the project database.

- Encode cheap deterministic invariants in tests/scripts/config when possible.
- Update an existing current owner before creating a new policy layer.
- Keep incident SHAs/logs/timelines under history when useful.
- Do not preserve temporary share URLs or transient deployment states as current truth.
- Current user instruction and executable/live truth outrank this document.

## Definition of done

A normal runtime/UI release may require:

```text
coherent source change
+ deterministic Gate/build
+ task-required browser acceptance
+ exact-head Preview evidence
+ final base/head race check
+ accepted merge
+ Production READY
+ representative Production verification
+ temporary-infrastructure cleanup
```

Docs-only policy work should not manufacture browser/deployment evidence that the repository classifier intentionally skips.

Completion reports must distinguish source changed, tests green, Preview READY, browser accepted, merged and Production accepted. Never collapse those layers into one vague “done”.

## Policy ownership map

| Concern | Detailed owner |
| --- | --- |
| autonomous Agent workflow / durable learning | `project-agent-operating-principles.md` |
| scenario triggers | `scenario-trigger-registry.md` |
| CSS composition / ownership / Tailwind decision | `css-architecture.md` |
| rendering / hydration / performance | `rendering-and-performance-policy.md` |
| UI/browser/theme/layout acceptance | `ui-change-visual-acceptance-gate.md`, `theme-contrast-contract.md` |
| deployment/provider/build budget | `hosting-architecture.md`, `deployment-policy.md` |
| exact-head merge / Production closeout | `release-closeout-protocol.md` |
| product/research truth | `product-and-research-integrity.md` |
| source ownership | `repository-map.md` |
