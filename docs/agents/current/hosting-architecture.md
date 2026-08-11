# Hosting architecture — Vercel Preview + Cloudflare Pages Production

Last reviewed: **2026-08-11 15:27 +08:00**

Status: **current steady state reaffirmed after architecture audit. Vercel remains the ordinary Preview provider; Cloudflare Pages remains Production at `https://basemodel.pages.dev`. The previously prepared Workers Static Assets path is validated but frozen as an optional future migration, not the current target.**

Read this immediately after `docs/agents/LATEST.md` before changing hosting, deployment, Preview, CI/CD, Cloudflare or Vercel behavior.

## Current decision

Keep the application and provider responsibilities narrow:

```text
GitHub = source of truth

non-main branch / PR
  -> Vercel `basemodel-preview`
  -> npm run verify:deploy
  -> npm run build
  -> protected Vercel Preview

main
  -> Vercel Git deployment disabled
  -> Cloudflare Pages Production
  -> https://basemodel.pages.dev
```

GitHub Actions and GitHub Pages remain intentionally retired.

Cloudflare Direct Upload (`npm run preview:cloudflare`) remains a fallback / Cloudflare-specific integration tool. It is not the ordinary Preview mainline while Vercel is healthy.

## Architecture-audit conclusion

The earlier problem was **Cloudflare Pages build budget being consumed by ordinary Preview iteration**. That problem has already been solved by moving ordinary non-main Preview to Vercel.

Do not confuse these two optimization goals:

```text
fewer hosting providers
!= fewer hosted builds
```

Moving Production to Vercel would simplify the provider count, but a normal PR -> merge flow still has a Preview deployment and a Production deployment. It would also concentrate Preview and Production usage into the same Vercel quota pool.

The current split is therefore intentional rather than accidental duplication:

```text
GitHub = source / branch / PR history
Vercel = ordinary Preview + build feedback + visual review
Cloudflare Pages = stable Production delivery
```

For this static Astro site, that division currently gives a better operational tradeoff than provider consolidation.

## Why Cloudflare Pages remains Production

### 1. The original build-budget problem is already contained

Ordinary branch/PR iteration no longer needs a Cloudflare Pages Git Preview. Cloudflare Pages should normally spend a hosted Git build only when a real release is intended.

Future Agents should optimize **when a Preview is worth creating** before redesigning Production hosting merely to reduce build counts.

### 2. `basemodel.pages.dev` is the current public identity

The current canonical Production identity is:

```text
https://basemodel.pages.dev
```

Leaving Cloudflare Pages is not merely a hosting switch. It also implies a hostname / canonical / hreflang / robots / sitemap / external-link migration unless the project first adopts an independent custom domain.

Do not bundle a product-identity migration into a hosting cleanup just to make the provider graph look simpler.

### 3. Current product requirements do not need a Cloudflare runtime

The validated Workers shadow is pure static assets: it does not contain a Worker script and exists to prove that the generated `dist/` can be served correctly on Workers Static Assets.

The current product does not require Workers runtime logic, KV, D1, R2, Durable Objects or another Cloudflare-native server capability for its existing core workflow.

A platform capability being modern or available is not by itself a reason to migrate.

## Workers Static Assets status: validated but frozen

PR #105 prepared and validated a non-production Workers Static Assets shadow path.

That work remains useful evidence:

- `wrangler.jsonc` defines the distinct `basemodel-workers-shadow` service;
- the shadow uses `./dist`, `404-page`, and `auto-trailing-slash`;
- the repository-owned shadow build preserves current Production identity and disables indexing;
- representative routes, assets, redirects, 404 behavior, canonical/hreflang, indexing defense, security headers and real browser flows were previously verified;
- known provider differences were documented instead of being hidden.

However, **a passed shadow is evidence that migration is possible, not evidence that migration is currently worthwhile.**

Do not continue Workers cutover work by default. Preserve the shadow configuration as a reversible option and revisit it only when a trigger below becomes real.

## Revisit Workers or Vercel-only only when requirements change

Re-open the hosting decision when at least one of these becomes true:

- the project adopts an independent custom domain and is ready to migrate canonical identity deliberately;
- Cloudflare Pages limits, reliability, product direction or release behavior become a demonstrated blocker;
- the product genuinely needs Workers / KV / D1 / R2 / Durable Objects / server-side APIs or another Cloudflare-native capability;
- Vercel Preview limits or build economics become a repeated material blocker and a different Preview/release ownership model is justified;
- the owner explicitly chooses a **build-once -> inspect -> promote the same artifact** workflow and current first-party provider behavior confirms it can satisfy the product/release requirements;
- a future architecture audit shows that provider consolidation now removes more operational cost than it introduces.

When none of those triggers is present, preserve the current steady state.

## Build-once is a workflow question, not a provider-deletion shortcut

If the future requirement is literally:

> build one hosted artifact, inspect it, then make that exact artifact Production without rebuilding

then evaluate staged/deployment-promotion capabilities directly against current first-party provider documentation.

Do **not** assume that deleting Cloudflare automatically creates a one-build workflow. Treat build-once promotion as a separate deployment-design problem with its own acceptance and rollback rules.

## Ordinary website workflow

```text
inspect current policy + overlapping PRs
-> focused branch / PR
-> use Cloudflare skip-build convention for non-release synchronization when appropriate
-> Vercel exact-head Gate + build
-> inspect real Preview route/interaction/metadata
-> owner accepts
-> merge/release to main with a normal non-skip release commit
-> verify Cloudflare Pages Production separately
```

Do not merge merely to obtain a Preview.

Because the repository is private, normal Vercel Preview URLs may require Vercel authentication. Generate a temporary share URL when the owner needs an anonymous click-through path; do not store expiring share links as durable project state.

## Production release boundary

Cloudflare Pages remains the intended Production target for `main`.

A release expected to update Production must not accidentally use `[CF-Pages-Skip]`, `[Skip CI]`, or another Cloudflare skip prefix.

Keep these evidence levels separate:

```text
source synchronized
!= repository Gate/build passed
!= Vercel Preview READY
!= real Preview accepted
!= merged to main
!= Cloudflare Production verified
```

A successful Vercel Preview does not prove Production changed.

## Cloudflare build-budget rule

- Vercel handles ordinary PR Preview builds.
- Intermediate branch synchronization should avoid intentionally triggering Cloudflare Pages builds when no release is requested.
- Do not trigger Cloudflare Pages Git Preview merely to obtain a review URL while Vercel is available.
- Direct Upload is for Cloudflare-specific fidelity, fallback, or an explicit `pages.dev` Preview request.
- Do not claim an exact account-level Cloudflare build counter without authoritative provider evidence.
- Re-check current first-party provider limits when quota/cost numbers become decision-relevant.

## Credential rule

Do not store Cloudflare API tokens in tracked source or a plaintext private-repository file.

The repository owns deployment procedure; the execution environment owns secure credential injection.

Ordinary Preview no longer depends on Cloudflare credentials because Vercel owns that job.

## Application-stack boundary

Astro remains the site framework. React remains available where the product uses it. GitHub remains source of truth.

Using Vercel for Preview does not imply a Next.js migration. Keeping Cloudflare for Production does not imply using Cloudflare-native application services.

Change application architecture only when product/runtime requirements justify it.

## Related current docs

- `docs/agents/LATEST.md`
- `docs/agents/current/scenario-trigger-registry.md`
- `docs/agents/current/vercel-preview-migration-plan.md`
- `docs/agents/current/preview-platform-evaluation.md`
- `docs/agents/current/deployment-policy.md`
- `docs/agents/current/repository-map.md`
- `docs/agents/current/direct-upload-preview-command.md`
- `docs/agents/current/cloudflare-pages-deployment.md`

The reasoning behind the 2026-08-11 architecture re-audit is preserved under `docs/agents/history/2026-08-11-hosting-architecture-audit.md`.

If this decision changes later, update this file, `LATEST.md`, repository/deployment maps, executable architecture tests and any canonical/hosting references together. Do not leave an obsolete target architecture in `docs/agents/current/`.
