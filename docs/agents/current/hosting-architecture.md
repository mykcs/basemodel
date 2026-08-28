# Hosting architecture — self-hosted CI + Vercel + Cloudflare smoke

Last reviewed: **2026-08-28**

Status: **current release architecture. Vercel remains the only ordinary deployment provider; GitHub self-hosted Actions supplies pre-merge CI and Cloudflare supplies post-deploy smoke only.**

## Current decision

```text
GitHub = source of truth

PR / release candidate
  -> repository-scoped self-hosted CI
  -> deterministic checks + risk-based Playwright

Vercel Preview / main Production
  -> npm run verify:deploy
  -> npm run build
  -> deploy static artifact

Cloudflare production-smoke Worker
  -> https://basemodel-production-smoke.mykcs01.workers.dev/healthz
  -> scheduled HTTP / canonical / robots / sitemap / redirect checks every 30 minutes
```

Astro, React and GitHub do not change. This is provider-ownership consolidation, not an application-stack rewrite.

## Vercel contract

- project: `basemodel-preview`
- account/team and opaque project IDs: provider-side state, intentionally not stored in public source
- production branch: `main`
- build: `npm run verify:deploy && npm run build`
- current canonical project domain: `https://basemodel-preview.vercel.app`

`vercel.json` must not disable `main`. Vercel Preview is automatically treated as non-indexable through `VERCEL_ENV=preview`; Production uses the stable project domain/canonical.

The Astro config rejects the old `https://basemodel.pages.dev` value as a stale `PUBLIC_SITE_URL` override so an obsolete environment variable cannot silently keep canonical metadata on the retired host.

## Vercel build ownership

The ordinary lifecycle is:

```text
one coherent branch/PR
-> one atomic multi-file push
-> self-hosted risk-based CI
-> optional exact-head Vercel Preview
-> merge accepted release to main
-> one lightweight Vercel Production build
-> Cloudflare/public Production smoke
```

The provider-trigger count is part of acceptance evidence. Completion reports should distinguish total triggers, `READY`, `ERROR`, `CANCELED`, ignored/skipped, exact-head Preview acceptance and Production acceptance.

## Domain boundary

An independent custom domain would decouple product identity from Vercel and is a possible future improvement. It is not required now. Do not purchase a domain or create paid resources without explicit owner authorization.

When a custom domain is adopted, update `PUBLIC_SITE_URL`/Astro canonical identity, sitemap/robots/OG references, provider domain assignment and redirect semantics together.

## Acceptance sequence

```text
repository contract updated
-> self-hosted CI passes the required risk plan
-> optional exact-head Vercel Preview build / route inspection
-> merge accepted release to main
-> lightweight Vercel Production build
-> verify Production HTTP/routes/canonical/hreflang/robots/sitemap
-> Cloudflare scheduled smoke continues independent observation
```

A READY Preview is not Production evidence.

## Public-source boundary

Provider authentication, bearer tokens, share/access query parameters, account IDs and opaque project/team IDs are not repository documentation. Keep them in provider-side configuration or ephemeral tool output. A temporary Preview share URL must never be committed or persisted in a GitHub PR/Issue body or comment.

## Legacy hosting — not ordinary workflow

Historical Cloudflare deployment snapshots, Pages helpers and Workers shadow-build paths remain migration/fallback residue and are not ordinary deployment authority. The one active exception is `cloudflare/production-smoke/`, which monitors the Vercel Production origin and never publishes the site itself.

Only load or mention legacy hosting when:

- the task explicitly concerns retirement, redirect or rollback;
- the legacy surface is changed; or
- live evidence shows unexpected provider activity.

A still-required skip prefix is a silent compatibility safeguard until the external integration is disabled. It is not an ordinary release stage or completion-report item.
