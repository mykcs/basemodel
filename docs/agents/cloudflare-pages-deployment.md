# Cloudflare Pages deployment runbook

Last reviewed: 2026-08-09

## Current architecture

```text
ChatGPT / coding agent
        |
        v
GitHub repository
        |
        v
Cloudflare Pages
Preview + Production + build gate + hosting
```

GitHub Actions and GitHub Pages are intentionally retired. Historical documents may describe the earlier dual-hosting state; they are not instructions to restore it.

## Cloudflare dashboard contract

```text
Project: basemodel
Repository: mykcs/basemodel
Production branch: main
Build command: npm run build:cloudflare
Build output directory: dist
Root directory: repository root
```

Node is pinned in the repository using `.node-version`. Keep the actual build logic in the repository rather than expanding it into dashboard-only shell commands.

## Repository-owned build entrypoint

`npm run build:cloudflare` performs two phases.

First, deterministic deployment blocking validation:

```text
npm run verify:deploy
  -> npm run check
  -> npm run validate
  -> npm run audit:semantic
  -> npm run audit:claims
  -> npm run audit:freshness
  -> npm test
```

Then it resolves deployment identity and runs:

```text
npm run build
```

Do not add vendor-catalog network audits, URL/source probes, browser downloads, full Chromium/WebKit E2E, or other third-party-dependent monitoring to every Pages build without a deliberate reliability decision.

## URL, base path and canonical identity

Cloudflare is the only maintained deployment target, so the application base is `/`.

Cloudflare injects `CF_PAGES_URL`, `CF_PAGES_BRANCH`, `CF_PAGES_COMMIT_SHA`, and `CF_PAGES=1`.

Production identity rule:

```text
explicit PUBLIC_SITE_URL
        -> use it (future custom domain)
else main Production
        -> derive stable https://basemodel.pages.dev origin
```

Preview identity rule:

```text
Preview -> always use current CF_PAGES_URL
```

This keeps Production canonical/hreflang/OG/JSON-LD/sitemap stable while making Preview metadata describe the Preview itself.

`PUBLIC_BASE_PATH` and `PUBLIC_CANONICAL_SITE_URL` are no longer part of the deployment contract.

## Search indexing

```text
Cloudflare Production = indexable by default
Cloudflare Preview    = noindex
```

Preview builds force `PUBLIC_SEARCH_INDEXING=disabled`. The application emits `meta robots=noindex,follow`, omits the advertised sitemap, and serves an empty sitemap when directly requested. Cloudflare also adds `X-Robots-Tag: noindex` to Preview responses.

Do not use `robots.txt: Disallow /` as the noindex mechanism. Crawlers need to fetch pages to observe noindex. If Preview content becomes sensitive, use access control; SEO directives are not authentication.

## Normal agent workflow

1. Create an agent branch from current `main`.
2. Batch related changes into a deliberate commit.
3. Open a PR.
4. Read the Cloudflare GitHub App result and verify it corresponds to the actual PR head SHA.
5. Open the Preview URL when visual/routing/SEO behavior needs inspection.
6. Merge only after the deployment-blocking build succeeds.
7. Verify the resulting Production deployment and public site after merge.

If the Cloudflare connector/dashboard is unavailable to an Agent, GitHub's Cloudflare PR comment plus the public Preview/Production URL are acceptable verification surfaces. Ask the owner for dashboard intervention only for settings that cannot be changed or observed through available tools.

## On-demand deep validation

Run full Playwright E2E for major UI, routing/i18n, browser compatibility, Astro/framework upgrades, or substantial component refactors:

```bash
npm run test:e2e
```

Run external data/source health checks separately when relevant:

```bash
npm run audit:vendor-catalogs
npm run audit:urls
npm run audit:coverage
```

These scripts are deliberately retained after Actions retirement.

## GitHub Pages retirement

Do not maintain a second `/basemodel/` build path, duplicate-host canonical override, Pages workflow, or Pages-specific tests.

If GitHub Pages remains enabled in repository settings and serves stale content, disable it in the repository settings when a connected tool with that permission is available. This is an administrative cleanup; it must not block the Cloudflare release path or cause build code to be reintroduced.

## Rollback

For a bad Production release, use Cloudflare Pages rollback to a previous successful Production deployment, then fix the repository on a branch and validate through Preview. GitHub remains the source of truth; do not edit generated deployment output as the canonical fix.

## Security rules

- Do not commit Cloudflare/GitHub tokens.
- Do not put secrets in `PUBLIC_*` variables.
- Keep Cloudflare GitHub App repository access scoped as narrowly as practical.
- `noindex` is not authentication.
- If Pages Functions, Workers, KV, D1, R2, secrets, or server-side APIs are introduced, revisit this runbook because the threat/deployment model changes materially.
