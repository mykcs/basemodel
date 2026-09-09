# Repository map for Agents

Last reviewed: **2026-08-27**

## 60-second start

```text
/AGENTS.md
-> docs/README.md
-> docs/agents/LATEST.md
-> docs/agents/README.md
-> matched docs/agents/current owner
-> executable source/config/tests + live provider/experiment truth
```

`docs/README.md` explains lifecycle. `docs/agents/README.md` selects task owners. Do not treat every Markdown file as equal authority.

## Documentation ownership map

```text
AGENTS.md                              fast Agent router + invariants
docs/README.md                        docs lifecycle + compatibility exceptions
docs/agents/LATEST.md                 short-lived live/current handoff
docs/agents/README.md                 task router + precedence
docs/agents/current/                  authoritative current policies/runbooks/maps
docs/agents/history/                  incidents, completed audits/pilots/migrations/closeouts
docs/archive/                         superseded pre-current product/context snapshots
docs/agent-context/                   compatibility entrypoint for old historical links
docs/V2_PRODUCT_COMPLETION_MATRIX.md  fixed-path legacy audit compatibility mirror
```

Two explicit fixed-path compatibility exceptions currently exist: the root V2 matrix and `current/vercel-preview-migration-plan.md`. The latter is a short test-consumer shim, **not** a deployment policy owner; current Vercel behavior lives in `hosting-architecture.md` and `deployment-policy.md`.

A date does not decide lifecycle. `seed-openevo-results-current-state-2026-08-26.md` remains current because it is actively refreshed/consumed. Completed Vercel pilots, migration/adoption records, one-time catalog audits, and the 2026-08-10 product closeout belong in history.

## Current implementation ownership

```text
src/                                  production application/content/domain logic
src/styles/app.css                    only page-wide CSS composition root
src/styles/tokens.css                 canonical shared design tokens
public/                               production static assets
scripts/                              build, validation and audit helpers
tests/ + src/lib/*.test.ts            executable regression/invariant checks
vercel.json                           active Preview + Production build contract
package.json                          executable task/Gate surface
wrangler.jsonc                        dormant/legacy provider-specific helper, not normal release authority
```

Important current owners include:

- `current/css-architecture.md` — CSS composition/ownership/migration debt;
- `current/hosting-architecture.md` + `current/deployment-policy.md` — public GHA merge CI + Vercel deployment authority;
- `current/product-and-research-integrity.md` — product/research false-complete rules;
- `current/audience-centered-technical-copy.md` plus the writing stack in `docs/agents/README.md` — public/research language;
- `current/research-journey-experience.md` — canonical research route roles and explainer deduplication;
- `current/model-catalog-verification-policy.md` — current model/provider claims;
- `current/scientific-state-provenance.md` + experiment-side authority — moving scientific state.

## CSS ownership map

```text
AppLayout.astro
└─ styles/app.css
   ├─ foundation: global.css -> tokens.css + site.css + visual-identity.css
   ├─ named global systems
   ├─ frozen compatibility debt: v2-closeout / visual-upgrade / design-refinement / final-hardening / visual-closeout
   └─ semantic component owners loaded last
```

The historical-looking CSS filenames are **live migration debt**, not documentation clutter. Do not delete them for cosmetic consistency. Follow `current/css-architecture.md` and retire declarations property-owner by property-owner with browser evidence until a legacy layer is actually redundant.

## Deployment map

```text
GitHub PR / release candidate          -> required public GitHub Actions CI
public-ci-gate                         -> exact-head/current-base merge authority
optional ci/vercel-gate-final          -> Vercel Preview for provider/human review only
GitHub main                            -> Vercel Production validation + build; duplicate browser CI skipped
Production identity                    -> https://basemodel-preview.vercel.app
CircleCI                               -> automatic PR/main disabled; explicit API fallback only
Mac/OrbStack self-hosted workflow      -> manual workflow_dispatch fallback only
Cloudflare production-smoke Worker     -> post-deploy monitoring only
Cloudflare Pages/Direct Upload/shadow  -> rollback or provider-specific fallback only
```

Public GitHub-hosted Actions is the ordinary required CI authority. Vercel is the ordinary deployment provider and optional Preview surface, not merge authority. CircleCI and the Mac/OrbStack workflow are manual recovery only. `cloudflare/production-smoke/` is the active monitoring exception; other Cloudflare deployment helpers remain fallback/history surfaces.

## Change-to-check guidance

- docs/Agent-only: verify lifecycle, precedence, links, and executable consumers; no hosted deployment unless executable semantics changed;
- data/schema/domain: run the repository Gate and task-specific tests; request Vercel Preview only when provider-rendered review is materially useful;
- CSS/global visual ownership: `npm run audit:css` + Gate + required public-GHA real-browser matrix; add an exact-head Vercel Preview only when human/provider review needs it;
- UI/routing/i18n/SEO: Gate + required public-GHA browser CI + real route/metadata/interaction acceptance; Preview is optional provider evidence;
- public copy/onboarding/status: load the writing stack, run contextual/strict copy audits, review both locales and affected route owners;
- deployment architecture: current docs + executable provider config/tests + live provider validation must change together;
- Production release: verify the actual Vercel Production deployment separately from merge/Preview.

## Lifecycle stopping rule

Do not create a new current document just to preserve a task recap. Update the existing owner. Put a completed audit/migration/closeout in `history/` when its main value becomes rationale/evidence. Put old pre-current milestone/context snapshots in `archive/`. Leave scratch notes uncommitted.
