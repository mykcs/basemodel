# Long-term dual-hosting policy

Last reviewed: 2026-08-09

## Authority

This file records the intended steady-state hosting policy for `mykcs/basemodel` and takes precedence over older migration-era wording.

The desired architecture is long-term **GitHub + Cloudflare dual hosting**.

A future agent may change this only when the repository owner explicitly requests a different hosting policy.

## Core decisions

1. GitHub remains the canonical source repository and collaboration surface.
2. Cloudflare Pages is the continuously deployable production path independent of GitHub Actions minutes.
3. GitHub Pages remains a second public/fallback endpoint and is not removed merely because Cloudflare works.
4. Cloudflare Production is the indexed/canonical public identity unless a custom domain is later selected.
5. GitHub Pages remains accessible to humans but is intentionally `noindex` to avoid duplicate-content competition.
6. Cloudflare Preview deployments remain `noindex`.
7. The same repository must support both `/` and `/basemodel/` deployment bases.

## Why dual hosting is intentional

The repository owner values a workflow where ChatGPT/coding agents can modify GitHub directly without requiring a local clone. GitHub therefore remains the source of truth.

Cloudflare Pages is independent build/deployment compute. This prevents GitHub Actions quota exhaustion from stopping normal website releases.

GitHub Pages provides a second provider endpoint and a useful fallback copy once GitHub Actions capacity is available.

Failure model:

```text
GitHub repository remains available
        |
        +------------------------------+
        |                              |
        v                              v
Cloudflare Pages                 GitHub Pages
Cloudflare build system          GitHub Actions deploy
        |                              |
        v                              v
basemodel.pages.dev              mykcs.github.io/basemodel/
```

If GitHub Actions quota is exhausted, Cloudflare remains deployable. GitHub Pages may temporarily lag behind `main`; that is acceptable.

If Cloudflare has an incident, GitHub Pages remains the independent public fallback when its latest deployment is available.

## Canonical source and deployment ownership

### Source of truth

```text
mykcs/basemodel
```

Do not manually edit generated output on either hosting provider as the source of truth.

### Cloudflare Pages

Cloudflare Pages should:

- connect directly to GitHub via Git integration;
- build Production from `main`;
- build PR/branch Previews automatically;
- run deterministic deployment-blocking checks before building;
- serve from root `/`;
- remain independent of GitHub-hosted Actions minutes;
- use a stable production identity rather than deployment-specific hash URLs.

Long-term dashboard build command:

```bash
npm run build:cloudflare
```

Build output directory:

```text
dist
```

### GitHub Pages

GitHub Pages remains configured for:

```text
https://mykcs.github.io/basemodel/
```

Build contract:

```text
PUBLIC_SITE_URL=https://mykcs.github.io
PUBLIC_BASE_PATH=/basemodel
PUBLIC_CANONICAL_SITE_URL=https://basemodel.pages.dev
PUBLIC_SEARCH_INDEXING=disabled
```

Do not change the GitHub Pages base to `/`.

GitHub Pages is public but intentionally excluded from search indexing. This keeps it useful as a fallback without creating an equal SEO competitor to Cloudflare Production.

## Development workflow

Normal development must work even with zero GitHub Actions minutes:

```text
1. Agent creates a GitHub branch.
2. Agent commits changes and opens/updates a PR.
3. Cloudflare creates a Preview deployment.
4. Cloudflare runs deterministic validation and the Astro build.
5. Preview is reviewed when visual behavior matters.
6. PR is merged to main.
7. Cloudflare automatically deploys the new main commit.
8. GitHub Pages deploys the same source when GitHub Actions capacity is available.
```

A GitHub Actions zero-step failure caused by quota/billing is infrastructure/account state, not an application test failure.

## Base-path contract

```text
Cloudflare Pages: /
GitHub Pages:     /basemodel/
```

Therefore:

- Cloudflare build logic must explicitly set `PUBLIC_BASE_PATH=/`;
- GitHub Pages build logic must explicitly use `/basemodel`;
- avoid hard-coded `/basemodel/` links in application code where base-aware URLs should be used;
- verify navigation/assets under both origins after base-sensitive changes.

## Stable production URL policy

Cloudflare's `CF_PAGES_URL` describes the current deployment and can be a unique/hash hostname.

Production identity must not drift to a new hash hostname on every deploy.

`npm run build:cloudflare` therefore follows:

```text
explicit PUBLIC_SITE_URL
        -> use explicit value
else production main
        -> use stable <project>.pages.dev origin
else Preview
        -> use current CF_PAGES_URL
```

Current indexed production identity:

```text
https://basemodel.pages.dev/
```

If a custom domain is introduced later, make it the production `PUBLIC_SITE_URL` and update the GitHub Pages canonical override to the same origin.

## SEO and indexing policy

Two provider URLs serving the same content are intentional for redundancy but should not both compete in search.

Steady state:

```text
Cloudflare Production: indexable
Cloudflare Preview:    noindex
GitHub Pages:           noindex, canonical -> Cloudflare Production
```

Cloudflare Preview already adds `X-Robots-Tag: noindex`. The repository adds noindex metadata as defense in depth.

Do not use `robots.txt: Disallow /` as the primary noindex mechanism for Preview or GitHub Pages. Crawlers need to retrieve a response/page to observe `noindex`; a disallowed URL can still be discovered and surfaced as a URL-only result.

Noindex deployments should:

- remain crawlable;
- emit `meta robots=noindex,follow`;
- not advertise a sitemap;
- emit an empty sitemap if `/sitemap.xml` is requested directly.

Indexing controls are not access controls. Sensitive Previews must be protected with Cloudflare Access rather than only SEO directives.

## CI responsibilities

Cloudflare deployment-blocking checks stay deterministic and repository-local:

- `npm run check`
- `npm run validate`
- `npm run audit:semantic`
- `npm run audit:claims`
- `npm run audit:freshness`
- `npm test`
- `npm run build`

GitHub Actions remains useful when capacity is available for:

- full Chromium/WebKit Playwright tests;
- scheduled vendor-catalog checks;
- URL/source-health checks;
- deep/artifact-heavy regression jobs;
- GitHub Pages deployment.

Cloudflare protects deployability; GitHub Actions provides deeper assurance when runner capacity exists.

## Cost policy

Agents should avoid unnecessary builds on both systems:

- batch related changes;
- avoid no-op commits;
- do not create repeated commits just to retrigger Preview;
- use Cloudflare skip-build commit prefixes only for true non-deploy changes and only when missing checks cannot violate branch policy;
- do not broadly disable Preview builds without considering PR validation;
- re-check provider quotas/pricing before making cost-sensitive decisions.

Cloudflare Pages Free limits are provider-controlled and may change; do not treat current numbers as permanent configuration.

## Copilot review cost policy

GitHub Copilot code review on private repositories consumes GitHub Actions minutes.

When Actions allowance matters:

- request Copilot review selectively;
- avoid automatic re-review on every push unless valuable;
- prefer Low review effort unless deeper analysis is justified.

Copilot review is advisory and should not be confused with deployment validation.

## Rollback and incidents

### Cloudflare deployment issue

- preserve GitHub source/history;
- roll Cloudflare back to a known-good successful Production deployment;
- fix on a branch and validate via Preview;
- do not delete the GitHub Pages path.

### GitHub Actions quota exhausted

- continue normal development through GitHub + Cloudflare;
- treat zero-step hosted-runner failures as infrastructure/account state;
- allow GitHub Pages to catch up after quota is restored.

### GitHub Pages issue

- Cloudflare remains independently deployable;
- repair GitHub Pages without blocking Cloudflare releases.

## Rules for future agents

Before changing hosting/CI, an agent must:

1. read this file, `cloudflare-pages-deployment.md`, and the migration retrospective when relevant;
2. preserve GitHub as the canonical repository;
3. preserve both Cloudflare Pages and GitHub Pages unless the owner explicitly changes policy;
4. preserve the `/` vs `/basemodel/` contract;
5. preserve Cloudflare as indexed identity and GitHub Pages as noindex fallback unless explicitly changed;
6. avoid secrets in repository files or `PUBLIC_*` values;
7. use branch + PR for architecture changes;
8. keep Cloudflare build logic reproducible in the repository;
9. distinguish provider/quota failures from code failures;
10. batch commits to control Cloudflare build usage;
11. update agent docs when the hosting contract materially changes.

## Current state

As of 2026-08-09:

- GitHub repository is the canonical source.
- Cloudflare Pages project `basemodel` is connected to `mykcs/basemodel`.
- Cloudflare Preview and Production deployments are verified.
- dashboard Build command is `npm run build:cloudflare`.
- PR #36 Preview succeeded with that command.
- merged commit `fcc872a` was confirmed green in Cloudflare Production.
- GitHub Pages configuration remains in the repository.
- GitHub-hosted Actions allowance is exhausted for the current billing period, so the GitHub Pages copy may lag until capacity returns.
- long-term target is dual hosting, not retirement of GitHub Pages.
- Cloudflare Production is the search-indexed identity; GitHub Pages is a noindex fallback.
