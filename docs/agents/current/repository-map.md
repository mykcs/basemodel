# Repository map for agents

Last reviewed: **2026-08-12**

## 60-second start

Read `AGENTS.md` -> `docs/agents/LATEST.md` -> operating principles -> scenario triggers -> hosting/deployment policy -> task-relevant product/UI docs -> executable config/source/tests.

## Ownership map

```text
AGENTS.md                         fast Agent router/invariants
docs/agents/LATEST.md            live handoff
docs/agents/current/             authoritative current policies/runbooks
docs/agents/history/             historical evidence, not current instructions
src/                              production application/content/domain logic
public/                           production static assets
scripts/                          provider-neutral validation + retained provider helpers
tests/ + src/lib/*.test.ts        executable regression/invariant checks
vercel.json                       active Preview + Production build contract
wrangler.jsonc                    dormant Workers shadow option
package.json                      executable task/Gate surface
```

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
- UI/routing/i18n/SEO: Gate + exact-head Vercel Preview + real route/metadata/interaction inspection; Playwright when relevant.
- deployment architecture: update current docs + machine invariant + provider validation together.
- Production release: verify the real Vercel Production deployment separately from Preview/merge.

GitHub Actions and GitHub Pages remain retired. Do not create duplicate Agent knowledge trees; route reusable situations through the existing trigger/current-policy system.
