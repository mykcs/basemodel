# Repository map for agents

Last reviewed: **2026-08-20**

## 60-second start

Read `AGENTS.md` -> `docs/agents/LATEST.md` -> operating principles -> scenario triggers -> hosting/deployment policy -> task-relevant product/UI docs -> executable config/source/tests.

## Ownership map

```text
AGENTS.md                         fast Agent router/invariants
docs/agents/LATEST.md            live handoff
docs/agents/current/             authoritative current policies/runbooks
docs/agents/current/css-architecture.md
                                  CSS composition/ownership/migration contract
docs/agents/history/             historical evidence, not current instructions
src/                              production application/content/domain logic
src/styles/app.css               only page-wide CSS composition root
src/styles/tokens.css            canonical shared design tokens
public/                           production static assets
scripts/                          build, validation and audit helpers
scripts/audit-css-architecture.ts CSS ownership/cascade structural gate
tests/ + src/lib/*.test.ts        executable regression/invariant checks
scripts/audit-audience-copy.ts    public-copy candidate scan + strict invariants
docs/agents/current/audience-*    copy contract + source-owner audit inventory
vercel.json                       active Preview + Production build contract
wrangler.jsonc                    dormant Workers shadow option
package.json                      executable task/Gate surface
```

## CSS ownership map

```text
AppLayout.astro
└─ styles/app.css
   ├─ foundation: global.css -> tokens.css + site.css + visual-identity.css
   ├─ named global systems: workspace / actionable-content / knowledge-architecture / mobile-composition
   └─ frozen compatibility debt: v2-closeout / visual-upgrade / design-refinement / final-hardening / visual-closeout

feature component
└─ feature-owned stylesheet when page-wide reach is not required
```

Do not create another global `*-hardening.css`, `*-closeout.css`, `*-refinement.css`, or `*-upgrade.css` layer. Existing files with those names are frozen migration debt. Follow `current/css-architecture.md` and move touched rules back toward their semantic owner while preserving browser-validated behavior.

## Deployment map

```text
Ordinary Preview surface — Vercel
Vercel project `basemodel-preview`
non-main -> Vercel Preview
main     -> Vercel Production -> https://basemodel-preview.vercel.app
Pages    -> frozen legacy rollback; normal builds = 0
```

`vercel.json` must not disable `main`. Preview noindex is protected in source using `VERCEL_ENV=preview`. The repository Gate remains `npm run verify:deploy`; `npm run build` produces the static artifact.

Cloudflare Direct Upload remains a supported fallback for Cloudflare-specific validation. Other Cloudflare helper scripts and the Workers shadow stay available only for rollback/provider-specific diagnostics. `npm run build:cloudflare` is no longer the formal release command.

## Change-to-check guidance

- docs/Agent-only: inspect precedence/links; no hosted deployment unless executable semantics changed.
- data/schema/domain: `npm run verify:deploy`; Preview if rendered behavior changes.
- CSS architecture/global style ownership: `npm run audit:css` + Gate + exact-head Vercel Preview + strongest task-relevant UI browser matrix.
- UI/routing/i18n/SEO: Gate + exact-head Vercel Preview + real route/metadata/interaction inspection; Playwright when relevant.
- public copy/onboarding/status: read the audience-copy contract and inventory, run `npm run audit:copy`, resolve candidates contextually, then run `npm run audit:copy:strict` (also included in `verify:deploy`).
- deployment architecture: update current docs + machine invariant + provider validation together.
- Production release: verify the real Vercel Production deployment separately from Preview/merge.

GitHub Actions and GitHub Pages remain retired. Do not create duplicate Agent knowledge trees; route reusable situations through the existing trigger/current-policy system.
