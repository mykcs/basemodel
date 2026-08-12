# Vercel-only Production migration policy

## Current direction

The project moves toward:

```text
GitHub
├─ pull request / branch → Vercel Preview
└─ main → Vercel Production
```

This is a hosting ownership change only. Astro, GitHub, repository validation, and application architecture remain unchanged.

## Why

The original Cloudflare Pages build problem came from using Git-integrated Preview builds during iteration. Vercel already provides the Preview workflow, so keeping Preview and Production under one deployment owner reduces operational complexity.

## Migration safety

Do not remove Cloudflare immediately.

Order:

1. Enable Vercel Production deployments.
2. Create and verify a Vercel Production deployment.
3. Compare routes, metadata, sitemap, robots, headers, and browser behavior.
4. Keep Cloudflare Pages available as rollback until confidence is established.
5. Move to a custom domain when available.
6. Retire old hosting only after verification.

## Build discipline

Vercel becomes the build owner, but Agent workflows still need batching. Avoid many tiny pushes that consume Preview/Production build capacity.

A single coherent commit is preferred over repeated micro-deployments.

## Boundaries

- Do not migrate the framework just because hosting changes.
- Do not claim Production changed until the Vercel Production deployment and public verification pass.
- Do not delete Cloudflare rollback infrastructure during the first migration step.
