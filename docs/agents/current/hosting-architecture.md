# Hosting architecture — Vercel Preview + Cloudflare Workers Static Assets Production

Last reviewed: **2026-08-11 02:17 +08:00**

Status: **target architecture approved; repository contract and exact-head Vercel validation are complete; real Workers shadow deployment is the next step; Production has not cut over.**

Read this immediately after `docs/agents/LATEST.md` before changing hosting, deployment, Preview, CI/CD, Cloudflare or Vercel behavior.

## Current migration progress

Completed:

- architecture decision recorded in the top-level Agent handoff/index;
- PR #105 added the Workers Static Assets shadow contract and was squash-merged to `main` as `3bb916d5754b352e59687b0ec6085179a85e674e`;
- repository configuration now contains `wrangler.jsonc`, `npm run build:workers:shadow`, and a hosting-architecture regression test;
- the exact PR head `5eb372491e3cd6ec7f974c1817883818cc632ea3` passed the full Vercel repository Gate and Astro build;
- Vercel deployment `dpl_3tA1HQrdUrVWZbwoc6rEEH4eGVAg` reached READY;
- its real Preview returned HTTP 200, `robots noindex`, `x-robots-tag: noindex`, and canonical/hreflang identity pointing to `https://basemodel.pages.dev`;
- both the migration commit and its squash merge used `[CF-Pages-Skip]`; the merge commit exposed no Cloudflare Pages status/check.

Not yet completed:

- `basemodel-workers-shadow` has **not** been deployed to Cloudflare Workers in the implementation session because that ChatGPT session has no Cloudflare account/deploy connector or injected Cloudflare credential;
- therefore Workers route/404/header/asset parity has not yet been tested on a real `workers.dev` shadow URL;
- Production remains Cloudflare Pages and no cutover is authorized.

**Next Agent action:** if a Cloudflare-capable execution surface is available, do not redesign the architecture. Build the shadow artifact with `npm run build:workers:shadow`, deploy `wrangler.jsonc` to the distinct `basemodel-workers-shadow` service, capture the actual `workers.dev` URL, and execute the Phase 2 parity checks below. Do not attach Production routing/domain during this step.

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

**Status: complete via PR #105.**

### Phase 1 — repository / Vercel validation

On a focused non-main branch:

1. run the normal repository Gate;
2. run the normal Astro build;
3. let Vercel validate the exact branch/PR head;
4. keep Preview noindex/canonical behavior pointing to the current Production identity;
5. fix repository regressions before any Workers deployment.

**Status: complete for PR #105 exact head `5eb372491e3cd6ec7f974c1817883818cc632ea3`.**

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

**Status: pending a Cloudflare-capable execution surface.**

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

For the one-time/current Workers shadow deployment, use a Cloudflare-connected Agent/tool or secure runtime credential injection. If the current session has neither, stop at the credential/tool boundary and hand off the exact next command/state rather than spending a Pages Build or committing a token.

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
STATUS:  repository + Vercel phases passed; Workers shadow pending; not cut over
```

## Related current docs

- `docs/agents/LATEST.md`
- `docs/agents/current/vercel-preview-migration-plan.md`
- `docs/agents/current/preview-platform-evaluation.md`
- `docs/agents/current/deployment-policy.md`
- `docs/agents/current/direct-upload-preview-command.md`
- `docs/agents/current/cloudflare-direct-upload-credential-handoff.md`

When this migration reaches a real cutover, update this file, `LATEST.md`, `docs/agents/README.md`, deployment policy, Cloudflare runbook, tests and any canonical/hosting references together.
