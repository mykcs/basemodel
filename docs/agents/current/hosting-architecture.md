# Hosting architecture — Vercel Preview + Vercel Production

Last reviewed: **2026-08-12**

Status: **current release authority. Vercel is the only ordinary deployment provider for Preview and Production.**

## Current decision

```text
GitHub = source of truth

non-main branch / PR
  -> Vercel project `basemodel-preview`
  -> npm run verify:deploy
  -> npm run build
  -> protected Preview

main
  -> Vercel Production
  -> https://basemodel-preview.vercel.app
```

Astro, React and GitHub do not change. This is provider-ownership consolidation, not an application-stack rewrite.

## Vercel contract

- project: `basemodel-preview`
- project ID: `prj_UQRbjvnik0lW21LrzotTLPhKkgAK`
- team: `wangrui92-team`
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
-> exact-head Vercel Preview
-> at most one batched corrective Preview
-> merge accepted release to main
-> one Vercel Production build
-> public Production verification
```

The provider-trigger count is part of acceptance evidence. Completion reports should distinguish total triggers, `READY`, `ERROR`, `CANCELED`, ignored/skipped, exact-head Preview acceptance and Production acceptance.

## Domain boundary

An independent custom domain would decouple product identity from Vercel and is a possible future improvement. It is not required now. Do not purchase a domain or create paid resources without explicit owner authorization.

When a custom domain is adopted, update `PUBLIC_SITE_URL`/Astro canonical identity, sitemap/robots/OG references, provider domain assignment and redirect semantics together.

## Acceptance sequence

```text
repository contract updated
-> exact-head Vercel Preview Gate/build
-> inspect Preview metadata/routes
-> merge accepted release to main
-> Vercel Production build
-> verify Production HTTP/routes/canonical/hreflang/robots/sitemap
-> report Vercel trigger counts and statuses
```

A READY Preview is not Production evidence.

## Legacy hosting — not ordinary workflow

Historical Cloudflare snapshots, Wrangler/Workers helpers or an external legacy Git integration may still exist as migration residue. They are not ordinary deployment authority, not a quota to include in normal reports, and not a reason to load Cloudflare context on every task.

Only load or mention legacy hosting when:

- the task explicitly concerns retirement, redirect or rollback;
- the legacy surface is changed; or
- live evidence shows unexpected provider activity.

A still-required skip prefix is a silent compatibility safeguard until the external integration is disabled. It is not an ordinary release stage or completion-report item.
