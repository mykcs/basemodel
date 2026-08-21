# Ordinary technical debt audit — 2026-08-21

Status: **historical audit snapshot**. Current policy remains in `/AGENTS.md` and `docs/agents/current/`.

## Scope

Whole-repository review of ordinary engineering debt after the CSS ownership convergence. The goal was not to maximize deletion count; it was to distinguish dead/redundant code from old code that still has a demonstrated product or rollback role.

Reviewed areas included repository root hygiene, deployment/configuration truth, CSS ownership, Astro/React hydration boundaries, client payloads, major frontend dependencies, browser-test placement, and current agent documentation.

## Fixed in the cleanup line

### Repository hygiene

- Removed the root `e2e/v2-closeout.spec.ts` file because Playwright is configured with `testDir: './tests/e2e'`; the root file was unreachable by the configured test suite and had no references.
- Moved the temporary 2026-08-18 explainer handoff out of the repository root into `docs/agents/history/` and marked it historical so old local worktree paths and release instructions cannot be mistaken for current policy.
- Refreshed `docs/agents/LATEST.md` and the rendering/performance policy to match the current Vercel architecture and current engineering contracts.

### CSS debt

- Removed the duplicated Header/mobile-menu compatibility block from `mobile-composition.css` after `components/header.css` had become the tested final owner.
- Shrunk the executable Header selector inventory in both `audit-css-architecture.ts` and `globalShellOwnership.test.ts`.
- Kept the remaining patch layers because they still contain required non-shell page behavior. Whole-file deletion would be a visual redesign, not technical-debt cleanup.

### Global page payload

- Removed the full model-name catalog from `AppLayout.astro` and the global CompareTray props.
- Reused the existing static `/model-data/[id].json` routes so CompareTray resolves only the browser-local compare IDs when the tray is actually active.
- The compare store already limits compare state to five IDs, so the global adjunct no longer needs the whole catalog serialized into every page.
- Added a source-level regression contract so the full catalog does not silently return to `AppLayout`.

## Intentionally retained

### Tailwind

No Tailwind migration or pilot was started. The observed problems were stale compatibility copies, late cascade ownership, stale documentation, and repeated page payload. Utility classes do not directly solve those failure modes. The existing token + semantic-owner + structural-audit model remains the lower-risk architecture.

### D3 and ECharts

Both dependencies are actively used by the Landscape interactive view. The implementation already defers the interactive shell and dynamically loads chart engines; they are not orphan dependencies.

### Nanostores

Nanostores and its React/persistent adapters are actively used for research task, comparison, candidate, and UI state. They are not cleanup targets.

### `design-refinement.css` and `final-hardening.css`

Both files still contain substantial required page-level behavior. They remain frozen migration debt, not extension points. Continue property-owner migration when touching the relevant feature; do not delete the files just to improve folder aesthetics.

### Cloudflare rollback/provider helpers

Current normal deployment is Vercel. Existing Cloudflare helper/shadow artifacts remain because current hosting policy still treats them as rollback/provider-specific diagnostics. Removing them is a separate retirement decision, not generic cleanup.

## Remaining incremental debt

1. Continue retiring Header/Nav selector copies property-by-property from `visual-upgrade.css`, `design-refinement.css`, and `final-hardening.css`, with browser evidence for each cutover.
2. Move unrelated page-level rules out of legacy patch layers only when a stable semantic owner is available; prefer a smaller touched file over a broad cosmetic rewrite.
3. Measure real browser payload/interaction cost before further hydration micro-optimizations. Do not infer Core Web Vitals improvements from source cleanup alone.
4. Establish a durable WebKit execution surface that does not depend on exhausted private-repository hosted-runner minutes; until then, cross-browser acceptance needs an explicit supported runner path.

## Rejected cleanup ideas

- Site-wide Tailwind rewrite: no current evidence of net benefit.
- Bulk dependency removal: active imports/usages exist for the examined major dependencies.
- Whole-file deletion of historical CSS layers: unsafe while required page rules remain.
- Removing rollback-provider tooling solely because it is not part of ordinary deployment: conflicts with current rollback policy.

## Decision rule for future debt work

Delete or migrate an old artifact when at least one of these is true and evidence is available:

- it is unreachable by configured execution;
- it has no references and no policy/rollback role;
- a semantic owner fully supersedes it and browser acceptance proves equivalent behavior;
- it imposes measurable repeated runtime/build payload without a corresponding product need.

Age, naming style, or aesthetic cleanliness alone is not enough.
