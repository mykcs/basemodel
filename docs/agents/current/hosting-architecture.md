# Hosting architecture — CircleCI + Vercel + Cloudflare smoke

Last reviewed: **2026-09-06**

Status: **current release architecture. CircleCI supplies ordinary pre-merge/post-merge CI, Vercel remains the only ordinary deployment provider, Cloudflare supplies post-deploy smoke, and the Mac/OrbStack runner is manual fallback only.**

## Current decision

```text
GitHub = source of truth

non-draft PR / release candidate
  -> CircleCI GitHub App
  -> deterministic repository gate
  -> risk-based Playwright
     -> focused coverage on shard 1, or
     -> full coverage across 2 independent 1-worker shards

main
  -> CircleCI post-merge revalidation
  -> Vercel Production
     -> npm run verify:deploy
     -> npm run build
     -> deploy static artifact

manual CI recovery only
  -> GitHub Actions workflow_dispatch
  -> repository-scoped Mac/OrbStack runner

Cloudflare production-smoke Worker
  -> https://basemodel-production-smoke.mykcs01.workers.dev/healthz
  -> scheduled HTTP / canonical / robots / sitemap / redirect checks every 30 minutes
```

Astro, React and GitHub do not change. This is execution-ownership consolidation, not an application-stack rewrite.

## CI execution ownership

The executable primary CI contract is `.circleci/config.yml` plus `scripts/ci-circleci-prepare.sh`, `scripts/ci-plan.mjs`, `scripts/ci-ui-gate.mjs`, and `scripts/vercel-ui-plan.ts`.

For pull requests, CircleCI validates an explicitly materialized `base + PR head` merge candidate. The five required cloud contexts are:

```text
ci/circleci: deterministic
ci/circleci: browser_shard_1
ci/circleci: browser_shard_2
ci/circleci: browser_shard_3
ci/circleci: browser_shard_4
```

Full browser work uses the qualified Debian 12 / Node 24 runtime on four independent CircleCI `medium` shards with one Playwright worker each. Instead of Playwright raw-count sharding, the full Chromium suite is enumerated into exact `--test-list` inputs and balanced by the retained `202609061200` one-worker timing receipt. New or renamed tests are conservatively weighted and remain in coverage. The Mac fallback stays one-worker and is not part of ordinary cloud scheduling.

The retained `.github/workflows/self-hosted-ci.yml` is manual fallback only. `.github/runner/` preserves the no-mount/no-socket OrbStack recovery implementation, but no ordinary PR or `main` event should require the Mac runner. The local LaunchAgent stays disabled during ordinary operation.

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
-> CircleCI risk-based CI
-> optional exact-head Vercel Preview
-> merge accepted release to main
-> CircleCI post-merge revalidation
-> one lightweight Vercel Production build
-> Cloudflare/public Production smoke
```

The provider-trigger count is part of acceptance evidence. Completion reports should distinguish CI status, Vercel trigger counts, `READY`, `ERROR`, `CANCELED`, ignored/skipped, exact-head Preview acceptance and Production acceptance.

## Domain boundary

An independent custom domain would decouple product identity from Vercel and is a possible future improvement. It is not required now. Do not purchase a domain or create paid resources without explicit owner authorization.

When a custom domain is adopted, update `PUBLIC_SITE_URL`/Astro canonical identity, sitemap/robots/OG references, provider domain assignment and redirect semantics together.

## Acceptance sequence

```text
repository contract updated
-> exact PR merge candidate passes all required CircleCI contexts
-> optional exact-head Vercel Preview build / route inspection
-> merge accepted release to main
-> CircleCI main revalidation passes
-> lightweight Vercel Production build
-> verify Production HTTP/routes/canonical/hreflang/robots/sitemap
-> Cloudflare scheduled smoke continues independent observation
```

A READY Preview is not Production evidence. A historical CircleCI run is not current merge evidence.

## Public-source boundary

Provider authentication, bearer tokens, share/access query parameters, account IDs and opaque project/team IDs are not repository documentation. Keep them in provider-side configuration or ephemeral tool output. A temporary Preview share URL must never be committed or persisted in a GitHub PR/Issue body or comment.

## Legacy hosting — not ordinary workflow

Historical Cloudflare deployment snapshots, Pages helpers and Workers shadow-build paths remain migration/fallback residue and are not ordinary deployment authority. The one active exception is `cloudflare/production-smoke/`, which monitors the Vercel Production origin and never publishes the site itself.

Only load or mention legacy hosting when:

- the task explicitly concerns retirement, redirect or rollback;
- the legacy surface is changed; or
- live evidence shows unexpected provider activity.

A still-required skip prefix is a silent compatibility safeguard until the external integration is disabled. It is not an ordinary release stage or completion-report item.
