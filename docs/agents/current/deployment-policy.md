# Deployment and validation policy

Last reviewed: 2026-08-09

## Authority

This file is the authoritative steady-state policy for `mykcs/basemodel`. It replaces the former long-term dual-hosting policy.

The intended architecture is:

```text
GitHub -> Cloudflare Pages
```

A future agent must not restore GitHub Actions or GitHub Pages because older history files mention them. Reintroduction requires an explicit repository-owner decision based on a current need.

## Responsibilities

### GitHub

- canonical source repository and Git history;
- branches and pull requests;
- Dependabot for npm dependencies;
- collaboration/review metadata.

### Cloudflare Pages

- Git-connected Preview deployments for PR/branch pushes;
- Production deployments from `main`;
- execution of repository-owned deployment checks;
- Astro production build;
- hosting at the root path `/`.

The Cloudflare dashboard Build command is:

```bash
npm run build:cloudflare
```

The build output directory is:

```text
dist
```

## Cost and quota policy

The reason for leaving GitHub Actions was not that Cloudflare has no limits. It was to remove the runner-minute-heavy Actions/Pages chain and use a deployment platform whose limits match this static site better.

As of 2026-08-09, Cloudflare Pages Free documents these relevant limits:

- 500 Pages builds per month;
- 1 build at a time;
- 20-minute build timeout;
- requests to static assets are free and unlimited when they do not invoke Pages Functions.

Official references:

- <https://developers.cloudflare.com/pages/platform/limits/>
- <https://developers.cloudflare.com/pages/functions/pricing/>
- <https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/>

These values can change, so verify the official Cloudflare documentation before making future cost/limit decisions.

For this repository, the practical rule is:

```text
visitor traffic to static pages != Pages build consumption
Git push that triggers a Pages deployment = Pages build consumption
```

Therefore the 500-build allowance still matters to the development workflow even though normal static-site traffic does not consume it. Do not describe the project as having “no Cloudflare quota.” Describe it as having **unlimited free static asset requests under the current Pages pricing, plus a separate monthly build quota**.

Build-budget rules:

- batch related edits before pushing;
- avoid no-op/speculative push loops;
- prefer one meaningful PR-head Preview rather than many tiny deployment attempts;
- `[CF-Pages-Skip]` may be used as a commit-message prefix for intermediate commits that intentionally do not need a deployment;
- the final PR head must receive a real Cloudflare Preview build before merge for deployment-sensitive work;
- if the repository becomes a monorepo or hosts multiple Pages projects, configure Cloudflare build watch paths/branch controls so unrelated changes do not trigger unnecessary builds.

If Pages Functions, Workers, SSR, server-side APIs, KV/D1/R2 or other dynamic execution are introduced, revisit both the cost model and this architecture. Static-request assumptions must not be carried over blindly to dynamic workloads.

## Deployment blocking gate

Every normal Cloudflare Preview/Production build runs:

```text
npm run verify:deploy
  -> npm run check
  -> npm run validate
  -> npm run audit:semantic
  -> npm run audit:claims
  -> npm run audit:freshness
  -> npm test
npm run build
```

These checks are intentionally deterministic and repository-local. Any failure blocks the deployment.

`audit:coverage` remains available but currently mainly generates a report after already parsing the same local data, so it is not a useful extra blocking signal on every deployment.

## Retained non-blocking quality tools

The following remain first-class repository capabilities but are not run automatically on every Cloudflare deployment:

- `npm run test:e2e` — full Playwright Chromium + WebKit regression;
- `npm run audit:vendor-catalogs` — external official-vendor catalog checks;
- `npm run audit:urls` — external source URL health checks;
- `npm run audit:coverage` — coverage/data-health report;
- `npm run audit` / `npm run audit:full` — broader on-demand audit bundle.

Use full E2E for major UI/component changes, routing/i18n changes, Astro/framework majors, browser compatibility work, or other changes where browser behavior is materially at risk. Run external-network audits as data/source maintenance or monitoring tasks, not as release gates.

## GitHub Actions policy

GitHub Actions is intentionally retired. The target repository state is zero workflow files.

Do not add a manual workflow “just in case.” If recurring CI, scheduled monitoring, or deep browser automation becomes necessary later, choose the platform based on that future requirement and current cost/reliability constraints.

Tests and scripts are platform-independent repository assets and must not be deleted merely because Actions is not used.

## GitHub Pages policy

GitHub Pages is intentionally retired. Cloudflare Production is the only maintained deployment semantics.

Therefore:

- deployment base is `/`;
- `/basemodel/` compatibility is not a release requirement;
- no GitHub Pages deployment workflow is maintained;
- no GitHub Pages-specific `PUBLIC_BASE_PATH` or `PUBLIC_CANONICAL_SITE_URL` is maintained;
- no duplicate-host noindex/canonical branch is required.

If GitHub Pages is still enabled in repository settings, it may serve a stale historical artifact until disabled. That dashboard setting does not justify retaining build code or workflows.

## SEO and Preview identity

Cloudflare Production is indexable by default and owns canonical, hreflang, OG, JSON-LD, robots and sitemap identity.

Cloudflare Preview must be `noindex`. `scripts/build-cloudflare.mjs` forces Preview `PUBLIC_SEARCH_INDEXING=disabled` and uses the current Preview deployment URL as its site identity. This prevents a Preview from impersonating Production even if a production `PUBLIC_SITE_URL` exists in broader environment configuration.

For Production, an explicit `PUBLIC_SITE_URL` can define a future custom domain. Without one, the stable `https://basemodel.pages.dev` alias is derived from Cloudflare's deployment URL.

## Dependency policy

Dependabot keeps npm updates only. There is no `github-actions` ecosystem after Actions retirement.

Low-risk development dependency minor/patch updates may be grouped; production patches may be grouped. Runtime/framework/compiler/test-runner major upgrades are deliberate migration work, including Node types, Astro integration/runtime, React, TypeScript and Vitest.

## Normal change workflow

```text
1. Read current main and the current agent docs.
2. Create an agent branch.
3. Batch the requested work and make the complete diff.
4. Run the relevant repository-local checks before or during the final Preview build.
5. Open a PR.
6. Confirm the Cloudflare Preview for the exact PR head succeeds.
7. Inspect Preview behavior when visual/routing/SEO behavior matters.
8. Merge to main.
9. Confirm the Cloudflare Production deployment for the merged commit.
```

Do not make Actions runner availability or GitHub Pages deployment state part of acceptance.
