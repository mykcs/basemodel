# Hosting architecture — Vercel Preview + Cloudflare Workers Static Assets Production

Last reviewed: **2026-08-11 01:56 +08:00**

Status: **target architecture approved for shadow migration; Production has not cut over yet.**

Read this immediately after `docs/agents/LATEST.md` before changing hosting, deployment, Preview, CI/CD, Cloudflare or Vercel behavior.

## Decision

Keep the application stack stable:

- Astro remains the site framework;
- React remains available where the current site uses it;
- GitHub remains the source of truth;
- do not migrate to Next.js merely because Vercel is used for Preview.

Separate Preview and Production responsibilities:

```text
GitHub
├─ non-main branch / PR
│    -> Vercel `basemodel-preview`
│    -> repository Gate (`npm run verify:deploy`)
│    -> Astro build
│    -> real Preview for Agent / owner review
│
└─ main
     -> target: Cloudflare Workers Static Assets
     -> production static artifact from `dist/`
```

Until the Workers migration passes its acceptance gate, **Cloudflare Pages remains the real Production host** at `https://basemodel.pages.dev` and remains the rollback surface.

Cloudflare Direct Upload (`npm run preview:cloudflare`) remains a supported Cloudflare-specific integration/fallback tool. It is not the ordinary Preview mainline while Vercel is healthy.

## Why this architecture

### Vercel already solved the ordinary Preview problem

The repository has a validated Vercel PR/branch Preview path. It binds deployments to GitHub commits, runs the repository-owned Gate, exposes build failures/logs to Agents, and avoids spending a Cloudflare Pages Git build merely so the owner can inspect a change.

Do not re-create this ordinary Preview layer with Cloudflare credentials/Wrangler unless Vercel is unavailable or the question being tested is specifically Cloudflare behavior.

### Workers Static Assets is the modern Cloudflare production target

Cloudflare's current guidance recommends Workers Static Assets for new static projects and provides an official Pages-to-Workers migration path. The Astro site already emits a static `dist/`, so the production-host migration should be an infrastructure change, not an application-framework rewrite.

### Keep provider responsibilities narrow

The intended steady state is:

```text
GitHub = source / branches / PR / merge history
Vercel = Preview / build feedback / visual review
Cloudflare Workers = Production static delivery and future Cloudflare-native services if genuinely needed
```

Do not add a third routine CI/Preview system merely for symmetry.

## Migration rule: shadow first, cut over later

The Workers migration must be reversible and must not mutate the current Production site while being evaluated.

### Phase 0 — repository contract

Add/maintain a Workers Static Assets configuration that points to the existing `dist/` output and a regression test that protects the architecture split.

The shadow Worker must use a distinct name. Do not reuse the existing Pages project name as evidence that migration is complete.

### Phase 1 — repository / Vercel validation

On a focused non-main branch:

1. run the normal repository Gate;
2. run the normal Astro build;
3. let Vercel validate the exact branch/PR head;
4. keep Preview noindex/canonical behavior pointing to the current Production identity;
5. fix repository regressions before any Workers deployment.

### Phase 2 — Cloudflare Workers shadow deployment

Deploy the same prebuilt `dist/` to a non-production Workers Static Assets service such as `basemodel-workers-shadow`.

Do **not** attach the Production custom domain/route or remove Pages during this phase.

Verify at minimum:

- `/`;
- `/guide/` and `/en/guide/`;
- representative model and paper detail pages;
- `/workspace/` and `/compare/` URL-state behavior;
- static assets, redirects and 404 behavior;
- canonical/hreflang/search-indexing behavior;
- cache/content-type/security headers that the current product depends on;
- exact Git/source provenance of the artifact being compared.

### Phase 3 — cutover decision

Only after the shadow Worker passes:

1. compare Workers and current Pages behavior;
2. record any Pages-specific behavior that needs a Workers equivalent;
3. define rollback before routing changes;
4. warn the owner before any Production-impacting operation;
5. cut over only with explicit release intent;
6. verify the public Production route after cutover;
7. keep Pages available until the new Production path is independently verified and rollback is no longer needed.

A working shadow URL is **not** authorization to change Production.

## Production identity

The current public identity remains `https://basemodel.pages.dev` during migration.

A future custom domain is recommended because it decouples product identity from the hosting provider, but domain migration is a separate SEO/release decision. Do not bundle a hostname/canonical migration into the initial Pages-to-Workers shadow migration.

## Build-budget rule during migration

- Vercel handles ordinary PR Preview builds.
- Intermediate Git synchronization should continue to avoid intentionally triggering Cloudflare Pages Builds; use the current skip-build convention where appropriate.
- Do not trigger a Git-integrated Cloudflare Pages Preview to test Workers.
- A Workers shadow deployment is separate evidence from a Pages Git build.
- Before any action expected to change the current Production deployment, state the expected impact and obtain the owner's release intent.

## Credential rule

Do not store Cloudflare API tokens in tracked source or a plaintext private-repository file.

The existing Wrangler credential investigation is retained only for fallback/Cloudflare-specific execution. Ordinary Preview no longer depends on solving that credential path because Vercel already provides the normal Preview surface.

## Acceptance evidence

Keep these states distinct in every report:

```text
repository Gate passed
!= Vercel Preview passed
!= Workers shadow deployed
!= Workers shadow behavior verified
!= Production cut over
!= old Pages Production retired
```

Until all required cutover evidence exists, report the architecture as:

```text
CURRENT: Vercel Preview + Cloudflare Pages Production
TARGET:  Vercel Preview + Cloudflare Workers Static Assets Production
STATUS:  shadow migration in progress / not cut over
```

## Related current docs

- `docs/agents/LATEST.md`
- `docs/agents/current/vercel-preview-migration-plan.md`
- `docs/agents/current/preview-platform-evaluation.md`
- `docs/agents/current/deployment-policy.md`
- `docs/agents/current/direct-upload-preview-command.md`
- `docs/agents/current/cloudflare-direct-upload-credential-handoff.md`

When this migration reaches a real cutover, update this file, `LATEST.md`, `docs/agents/README.md`, deployment policy, Cloudflare runbook, tests and any canonical/hosting references together.
