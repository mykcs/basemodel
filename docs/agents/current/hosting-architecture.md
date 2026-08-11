# Hosting architecture — Vercel Preview + Cloudflare Pages Production

Last reviewed: **2026-08-11**

Status: **accepted current recommendation after cross-provider audit.** Vercel remains the ordinary Preview provider. Cloudflare Pages remains the recommended Production host at `https://basemodel.pages.dev`. The validated Workers Static Assets shadow is retained as a dormant future option; Production cutover is paused.

Read this after `docs/agents/LATEST.md` before changing hosting, Preview, CI/CD, Cloudflare, Vercel, canonical URLs, or release behavior.

## Decision

Keep the current split:

```text
GitHub = source / branches / PR history

non-main branch / PR
  -> Vercel `basemodel-preview`
  -> npm run verify:deploy
  -> npm run build
  -> protected Preview for review

main / explicit release
  -> Cloudflare Pages Production
  -> https://basemodel.pages.dev
```

Do **not** migrate Production merely to make provider ownership look uniform. The earlier problem was excessive Cloudflare Preview/Git build consumption; Vercel already solved that problem by owning ordinary Preview. Moving Production to Vercel would not eliminate the normal Preview-versus-Production release distinction and would also require a deliberate production-hostname/canonical migration away from `basemodel.pages.dev`.

## Provider roles

- **GitHub** — source of truth, branches, PRs, merge history.
- **Vercel** — ordinary non-main Preview, repository Gate/build feedback, owner/Agent review.
- **Cloudflare Pages** — current and recommended Production static delivery and current public identity.
- **Cloudflare Workers Static Assets shadow** — validated fallback/future capability, not an active Production target.
- **Cloudflare Direct Upload** — Cloudflare-specific fidelity/fallback tool, not the ordinary Preview mainline while Vercel is healthy.

Adding or removing a provider requires a role audit: identify which distinct responsibility changes, what existing role is replaced, what identity/SEO/runtime contract moves, and what rollback remains. Do not create a third routine Preview/CI/release path for symmetry.

## Why Pages remains Production

The current product is a static Astro research site. Cloudflare Pages already serves the canonical production identity reliably, while ordinary Preview builds have been removed from its day-to-day iteration path. The Pages build-budget problem is therefore an orchestration problem that has already been addressed, not evidence that the Production host itself is unsuitable.

`https://basemodel.pages.dev` is also part of the current product identity: canonical/hreflang, sitemap/robots, external links, and verification all depend on it. A move to Vercel or Workers would be a hostname/SEO/release migration, not a transparent backend swap.

## Workers shadow: validated but frozen

The repository intentionally retains the already-validated Workers Static Assets shadow contract:

- `wrangler.jsonc` defines the static-only `basemodel-workers-shadow` service;
- `npm run build:workers:shadow` builds the same Astro output with Production identity preserved and indexing disabled;
- the real shadow deployment previously passed representative route, asset, redirect, 404, canonical/hreflang, robots/sitemap, security-header, query-state, and browser checks;
- known provider differences were documented rather than hidden.

That evidence proves Workers is a viable option. It does **not** create an obligation to cut over. Keep the shadow configuration available unless a separate cleanup decision shows that even dormant maintenance cost is no longer justified.

### Re-open a Workers Production cutover only when at least one trigger is real

1. the project adopts a custom domain and deliberately decouples product identity from `pages.dev`;
2. a genuine Workers-native requirement appears (for example server/runtime behavior or Cloudflare-native services that materially benefit the product);
3. Cloudflare Pages develops a measured operational/cost/limit problem that the current Preview split does not solve;
4. the owner explicitly requests a Production-host migration for reasons stronger than provider uniformity.

When a trigger is real, re-check current first-party Cloudflare/Vercel docs and current repository/provider state before relying on this 2026-08-11 audit.

## Ordinary workflow and build budget

```text
focused branch / PR
-> coherent change (batch before push)
-> Vercel exact-head Gate + Preview
-> inspect the real affected route(s)
-> merge/release only after acceptance
-> verify Cloudflare Pages Production separately
```

Intermediate branch synchronization should avoid intentionally spending Cloudflare Pages Git builds; use the repository's documented Cloudflare skip convention where appropriate. Do not use a skip prefix on an explicit Pages Production release that is expected to publish.

Avoid Vercel build storms as well: batch coherent edits before push, prefer one exact-head Preview per meaningful iteration, and do not create trigger-only commits just to obtain another hosted status.

## Acceptance evidence

Keep these states separate:

```text
repository Gate passed
!= Vercel deployment READY
!= real Preview inspected
!= source merged
!= Cloudflare Pages Production updated
!= Production behavior verified
```

A provider READY badge is infrastructure evidence, not visual/product acceptance.

## Production identity and future domain work

Current Production/canonical identity remains:

`https://basemodel.pages.dev`

A custom domain may be useful later because it separates product identity from host choice. Treat that as its own SEO/release decision. Do not bundle a domain migration into routine hosting cleanup.

## Related current docs

- `docs/agents/LATEST.md`
- `docs/agents/current/vercel-preview-migration-plan.md`
- `docs/agents/current/preview-platform-evaluation.md`
- `docs/agents/current/deployment-policy.md`
- `docs/agents/current/cloudflare-pages-deployment.md`
- `docs/agents/current/direct-upload-preview-command.md`

Historical Workers migration/shadow evidence remains useful rationale, but it does not override this current recommendation.