# Vercel-only Production migration decision — 2026-08-12

## Decision

The project will evaluate moving from:

```text
GitHub
├─ PR -> Vercel Preview
└─ main -> Cloudflare Pages Production
```

to:

```text
GitHub
├─ PR -> Vercel Preview
└─ main -> Vercel Production
```

## Reason

The original Cloudflare Pages Build quota problem was caused by using Git-integrated Preview builds for iteration. Vercel already owns the Preview workflow. Consolidating Preview and Production on Vercel removes the need to maintain two deployment ownership models.

## Boundary

This is not an Astro/framework migration. The application stack remains Astro.

Cloudflare may remain temporarily for DNS, rollback, or historical Production access until the Vercel Production deployment is verified.

## Migration order

1. Enable Vercel Production deployments.
2. Create a real Vercel Production deployment from main.
3. Verify routes, SEO metadata, sitemap, robots, headers, and browser behavior.
4. Use a custom domain when available for long-term product identity.
5. Retire Cloudflare Pages only after rollback is no longer needed.

## Build discipline

Vercel replaces Cloudflare Pages as the build owner, but Agent workflows must still batch coherent changes. Avoid creating many tiny pushes that consume Preview build capacity.
