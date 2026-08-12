# Hosting architecture — Vercel Preview + Vercel Production

Last reviewed: **2026-08-12 16:44 +08:00**

Status: **current target and release authority. Vercel owns ordinary Preview and Production. Cloudflare Pages is retained only as a frozen legacy rollback snapshot; Workers/Direct Upload are dormant Cloudflare-specific options.**

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

Cloudflare Pages
  -> legacy rollback snapshot
  -> Cloudflare Pages Build = 0 for ordinary development/releases
```

Astro, React and GitHub do not change. This is provider-ownership consolidation, not an application-stack rewrite.

## Why this supersedes the 2026-08-11 split audit

The previous audit correctly found that “fewer providers != fewer hosted builds” and kept Pages because Preview quota pressure had already moved to Vercel. The owner then made a new requirement explicit: **remove Cloudflare Build from the normal workflow and use Vercel’s build/deployment quota for both Preview and Production.**

That requirement changes the optimization target. Keeping Pages as an active release builder would now preserve exactly the operational surface the owner wants to retire.

## Vercel contract

- project: `basemodel-preview`
- project ID: `prj_UQRbjvnik0lW21LrzotTLPhKkgAK`
- team: `wangrui92-team`
- production branch: `main`
- build: `npm run verify:deploy && npm run build`
- current canonical project domain: `https://basemodel-preview.vercel.app`

`vercel.json` must not disable `main`. Vercel Preview is automatically treated as non-indexable through `VERCEL_ENV=preview`; Production uses the stable project domain/canonical.

The Astro config also rejects the old `https://basemodel.pages.dev` value as a stale `PUBLIC_SITE_URL` override so an old Preview environment variable cannot silently keep canonical metadata on Cloudflare.

## Cloudflare legacy rollback

Do not delete the existing Pages project during cutover. Keeping the last known-good `basemodel.pages.dev` snapshot provides rollback evidence without requiring new builds.

Until the Cloudflare account-side Git integration is disabled:

- keep `[CF-Pages-Skip]` on branch and merge/release commits;
- do not intentionally trigger a Pages Preview or Production build;
- do not “synchronize” the legacy site after every Vercel release;
- do not spend one last Pages Build merely to add a redirect without first informing the owner and receiving explicit authorization.

The session currently lacks Cloudflare account write access, so provider-side disabling/redirect configuration is an external boundary. This must not be hidden by an ad-hoc Git build.

## Workers / Direct Upload

`basemodel-workers-shadow`, `npm run build:workers:shadow`, and `npm run preview:cloudflare` remain valid fallback/diagnostic assets. The shadow canonical follows the current Vercel Production URL and remains `noindex`.

They are not normal Preview or Production paths.

## Domain boundary

An independent custom domain would decouple product identity from Vercel and is a good future improvement. It is not required for this migration. Do not purchase a domain or create paid resources without explicit owner authorization.

When a custom domain is adopted, update `PUBLIC_SITE_URL`/Astro canonical identity, sitemap/robots/OG references, provider domain assignment and redirect/rollback semantics together.

## Acceptance sequence

```text
repository contract updated
-> exact-head Vercel Preview Gate/build
-> inspect Preview metadata/routes
-> merge to main with Cloudflare skip prefix
-> Vercel Production build
-> verify Production HTTP/routes/canonical/hreflang/robots/sitemap
-> keep Pages frozen as rollback
-> disable Pages Git auto-build when Cloudflare account write access is available
```

A READY Preview is not Production evidence. Completion reports separate exact Git head, Preview, merge, Vercel Production and Cloudflare rollback state.
