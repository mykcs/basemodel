# Cloudflare Pages deployment runbook

Last reviewed: **2026-08-11 15:27 +08:00**

Status: **Cloudflare Pages is the current Production host. Vercel is the ordinary Preview path. Direct Upload is fallback / Cloudflare-specific validation. The previously prepared Workers cutover is paused.**

## Current architecture

```text
GitHub source of truth
        |
        +---- non-main branch / PR -> Vercel Preview
        |
        +---- accepted release on main -> Cloudflare Pages Production

Cloudflare Direct Upload -> fallback / same-provider Preview when specifically useful
Workers Static Assets     -> validated/frozen non-production option
```

GitHub Actions and GitHub Pages remain intentionally retired.

For ordinary Preview behavior read `vercel-preview-migration-plan.md` and `deployment-policy.md`. This runbook owns the current Pages Production contract, formal release path, same-provider fallback, SEO identity and rollback rules.

## Cloudflare project contract

```text
Project: basemodel
Repository: mykcs/basemodel
Production branch: main
Formal Git build command: npm run build:cloudflare
Build output directory: dist
Root directory: repository root
Production identity: https://basemodel.pages.dev
```

Node is pinned with `.node-version`; keep build logic in the repository.

## Ordinary Preview is Vercel, not Pages

Do not intentionally spend a Cloudflare Pages Git Preview build merely so the owner can inspect a branch while the validated Vercel path is available.

Normal flow:

```text
focused PR branch
-> Vercel runs npm run verify:deploy
-> Vercel runs npm run build
-> inspect exact-head Preview
-> owner accepts
-> release to main
-> Cloudflare Pages Production build
```

Intermediate/non-release Git synchronization may use the documented Cloudflare skip-build convention where appropriate.

This division is the mechanism that protects Pages build budget. Do not redesign Production merely because Preview consumes Vercel resources; provider count and hosted-build count are separate variables.

## Cloudflare Direct Upload fallback

Use Direct Upload when:

- Cloudflare-specific Pages behavior is under test;
- Vercel is unavailable/rate-limited and a Cloudflare-hosted Preview is actually useful;
- the owner explicitly requests a `pages.dev` Preview;
- a Production issue needs same-provider pre-release reproduction;
- a temporary integration state needs Cloudflare-specific fidelity.

Follow `direct-upload-preview-policy.md` and `direct-upload-preview-command.md` rather than inventing an ad-hoc Wrangler workflow.

Representative low-level command:

```bash
npx wrangler pages deploy dist \
  --project-name=basemodel \
  --branch=<unique-preview-branch>
```

Use the deployment URL returned by Wrangler as primary evidence. Direct Upload uploads prebuilt assets, so Cloudflare does not run the Git-connected build step for that deployment. It is still a platform deployment and remains subject to deployment/upload/file/platform limits.

## Git synchronization without intentionally spending a Pages Build

When source should be saved to GitHub but the owner did not request a release, use a supported Cloudflare skip prefix or current Build Watch/branch controls where appropriate.

Repository convention includes `[CF-Pages-Skip]` for non-release work.

Batch related changes. Avoid no-op commits, probe branches and speculative push loops merely to test whether Pages is healthy.

### Production warning

A real release expected to update Pages must **not** accidentally carry `[CF-Pages-Skip]`, `[Skip CI]` or another Cloudflare skip prefix.

## Repository-owned validation

`npm run build:cloudflare` performs deterministic deployment validation and the production Astro build. Repository scripts in `package.json` are executable truth.

Do not weaken a failing repository Gate to make a deployment green. Fix the product/data/test mismatch or revise the invariant only with evidence.

Keep full Chromium/WebKit Playwright and third-party-dependent audits on demand unless the change requires them:

```bash
npm run test:e2e
npm run audit:vendor-catalogs
npm run audit:urls
npm run audit:coverage
```

## Formal Production release boundary

Only a deliberate accepted release should spend the normal Git-connected Pages Production build.

Before the release:

1. ensure the intended PR head is current with the merge base;
2. ensure the deterministic Gate/build passed for the exact accepted state;
3. inspect the real Vercel Preview when user-facing behavior changed;
4. merge/release with a normal non-skip commit;
5. verify the real `https://basemodel.pages.dev` Production route after deployment.

Do not merge merely to obtain a Preview.

## Production identity and indexing

Production remains the indexed canonical identity:

```text
https://basemodel.pages.dev
```

Every non-production Preview must remain `noindex` and must not impersonate Production canonical identity.

Leaving Pages is therefore not just a hosting change: because `pages.dev` is provider-owned, a future migration must explicitly handle hostname/canonical/hreflang/robots/sitemap/external-link/rollback semantics, normally together with an independent custom-domain decision.

## Workers Static Assets boundary

The repository retains a previously validated pure-static Workers shadow path.

That path proves migration feasibility, but the 2026-08-11 architecture audit paused the default Pages -> Workers cutover because:

- the current Astro product does not require Workers runtime features;
- ordinary Preview/build-budget pressure is already solved by Vercel;
- moving off Pages changes the `basemodel.pages.dev` product identity unless a separate domain migration is performed.

Do not continue Workers Production cutover by default. Re-read `hosting-architecture.md` and reopen the decision only when current requirements justify it.

## Build budget and limits

Keep these distinctions explicit:

```text
static visitor request != Git build consumption
Vercel branch Preview    != Cloudflare Pages Git build
Cloudflare release       = intended Pages Production build boundary
Direct Upload            = prebuilt Pages deployment, not Git-connected build
```

Provider limits and pricing are time-sensitive. Re-check current first-party documentation/account evidence when exact quota or cost affects a decision.

Do not freeze an old numeric limit into architecture logic and do not claim an exact remaining account-level build count without authoritative evidence.

## Rollback and security

For a bad Production release, roll back to a previous successful Cloudflare Pages Production deployment, then fix the repository on a branch. GitHub remains source of truth.

- Do not commit Cloudflare/GitHub tokens.
- Do not put secrets in `PUBLIC_*` variables.
- Keep Cloudflare GitHub App access scoped narrowly.
- Revisit hosting architecture if Pages Functions, Workers, SSR, server APIs, KV/D1/R2, Durable Objects, Queues, scheduled workloads or multiple deployable applications materially change the product requirements.

## Required completion report

After deployment-related website work, report the relevant boundaries separately:

```text
Repository Gate/build: passed / failed / not run
Vercel Preview: READY / ERROR / none
Direct Upload: succeeded / failed / not run
Cloudflare Git Preview intentionally triggered: yes / no
Merged/released to main: yes / no
Cloudflare Pages Production changed: yes / no / unknown
Production verification: passed / failed / not run
```

Do not conflate source sync, Preview, merge and Production state.
