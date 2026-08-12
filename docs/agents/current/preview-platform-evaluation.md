# Preview platform evaluation — historical pilot, current Vercel ownership

Last reviewed: **2026-08-12 16:44 +08:00**
Status: **The 2026-08-11 Vercel Preview pilot remains valid evidence; its Preview-only Production conclusion is superseded by the 2026-08-12 owner decision to consolidate Preview + Production on Vercel.**

## Current authority

For executable current behavior read, in order:

- `../LATEST.md`
- `hosting-architecture.md`
- `deployment-policy.md`
- `vercel-preview-migration-plan.md`

Current architecture:

```text
GitHub non-main -> Vercel Preview
GitHub main     -> Vercel Production -> https://basemodel-preview.vercel.app
Cloudflare Pages -> frozen legacy rollback; normal Builds = 0
```

## What this evaluation still proves

The PR #99 pilot established with real provider evidence that the connected Vercel path can clone the private repository, run `npm run verify:deploy && npm run build`, expose logs/status to the Agent, protect Preview access, and provide a temporary share URL when needed. Those facts remain useful.

The earlier recommendation to disable Vercel `main` and retain Cloudflare Pages as active Production was reasonable for the narrower question then being asked: reduce Cloudflare branch Preview consumption without changing Production identity. It is no longer current policy after the owner explicitly chose to remove Cloudflare Build from normal releases as well.

## Durable lesson

Do not conflate application framework, Preview provider and Production provider. The project kept Astro/React and first adopted Vercel only for Preview; after a separate owner decision, the same validated Vercel project now owns Production too.

Cloudflare Direct Upload and Workers shadow remain useful Cloudflare-specific fallbacks. Netlify remains an alternate only if measured Vercel limitations justify re-opening provider selection.

Provider quotas/pricing/features are time-sensitive; re-check first-party documentation before future architecture changes.
