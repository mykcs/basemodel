# Long-term dual-hosting policy

Last reviewed: 2026-08-09

## Authority

This file records the intended steady-state hosting policy for `mykcs/basemodel` and **takes precedence over any migration-era wording** in `cloudflare-pages-deployment.md` that suggests retiring GitHub Pages after Cloudflare is verified.

The desired architecture is long-term **GitHub + Cloudflare dual hosting**.

Do not remove or disable either hosting path merely because the other one works. A future agent may change this only when the repository owner explicitly requests a different hosting policy.

## Why dual hosting is intentional

The repository owner values a workflow where ChatGPT/coding agents can modify GitHub directly without requiring a local clone. GitHub therefore remains the canonical source of truth and collaboration surface.

Cloudflare Pages is added as an independent build/deployment path because GitHub-hosted Actions minutes can be exhausted. Cloudflare must continue to deploy even when GitHub Actions cannot start runners.

GitHub Pages is retained because it provides a second public endpoint and an independent deployment path once GitHub Actions capacity is available again.

The intended failure model is:

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

If GitHub Actions quota is exhausted, Cloudflare remains deployable. The GitHub Pages copy may temporarily lag behind `main`; this is acceptable and must not block normal development.

If Cloudflare has an incident, the GitHub Pages site remains a useful independent public copy when its latest deployment is available.

## Canonical source and deployment ownership

### Source of truth

GitHub is always the source of truth:

```text
mykcs/basemodel
```

Do not manually edit generated files on either hosting provider as a source of truth.

### Cloudflare Pages

Cloudflare Pages should:

- connect directly to the GitHub repository via Git integration;
- build production from `main`;
- build PR/branch previews automatically;
- run deterministic deployment-blocking checks before building;
- serve at the Cloudflare root path `/`;
- remain independent of GitHub-hosted Actions minutes.

Long-term dashboard build command:

```bash
npm run build:cloudflare
```

Build output directory:

```text
dist
```

### GitHub Pages

GitHub Pages should remain configured for:

```text
https://mykcs.github.io/basemodel/
```

Its build keeps the historical GitHub Pages deployment contract:

```text
PUBLIC_SITE_URL=https://mykcs.github.io
PUBLIC_BASE_PATH=/basemodel
```

Do not change the GitHub Pages build to `/`; doing so would break the repository subpath deployment.

The GitHub Pages workflow may remain unable to run while the account has no GitHub-hosted Actions allowance. This is an account/runtime constraint, not a reason to delete the workflow.

## Development workflow

Normal development should work even with zero GitHub Actions minutes:

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

A GitHub Actions zero-step failure caused by quota/billing must not be misdiagnosed as an application failure.

## Base-path contract

The same source must intentionally support two public path layouts:

```text
Cloudflare Pages: /
GitHub Pages:     /basemodel/
```

Therefore:

- keep the existing Astro GitHub Pages defaults unless deliberately refactoring both deployment systems;
- Cloudflare build logic must explicitly set `PUBLIC_BASE_PATH=/`;
- GitHub Pages build logic must explicitly use `/basemodel`;
- avoid hard-coded `/basemodel/` links in application code where Astro/base-aware URLs should be used;
- verify navigation/assets under both origins after base-path-sensitive changes.

## SEO and canonical URL policy

Two publicly reachable copies create an SEO duplication concern. Hosting redundancy and canonical indexing are separate decisions.

Until a custom canonical domain is deliberately selected:

- do not silently invent a canonical hostname;
- keep Cloudflare Preview deployments non-indexable (`Disallow: /`);
- ensure each production deployment emits internally consistent sitemap/robots URLs for its own build origin;
- if explicit canonical `<link rel="canonical">` metadata is introduced, document which host is canonical and why.

If a custom domain is later introduced, prefer making that domain the canonical public identity while retaining the provider URLs as technical/fallback endpoints.

## CI responsibilities

Cloudflare deployment-blocking checks should stay deterministic and repository-local:

- `npm run check`
- `npm run validate`
- `npm run audit:semantic`
- `npm run audit:claims`
- `npm run audit:freshness`
- `npm test`
- `npm run build`

Do not put flaky third-party network audits into every Cloudflare production build without an explicit reliability decision.

GitHub Actions remains useful when quota is available for:

- full Chromium/WebKit Playwright tests;
- scheduled external vendor-catalog checks;
- URL/source-health checks;
- deep or artifact-heavy regression jobs.

The two CI systems have different purposes. Cloudflare protects deployability; GitHub Actions provides deeper cross-browser/scheduled assurance when capacity exists.

## Cost policy

The purpose of this architecture is not to maximize builds on both systems. Agents should avoid waste:

- batch related changes when practical;
- do not create no-op commits to force deployments unless troubleshooting requires it;
- keep expensive Playwright matrices out of routine Cloudflare builds;
- let GitHub Pages temporarily lag while GitHub Actions quota is exhausted rather than purchasing capacity implicitly;
- re-check current provider quotas/pricing before making cost-sensitive changes.

## Rollback and incidents

### Cloudflare deployment issue

- preserve GitHub source/history;
- roll Cloudflare back to a known-good deployment if available;
- fix on a branch and validate via Preview;
- do not delete the GitHub Pages path.

### GitHub Actions quota exhausted

- continue normal development through GitHub + Cloudflare;
- treat zero-step hosted-runner failures as infrastructure/account state;
- do not weaken application code merely to make unavailable runners appear green;
- allow GitHub Pages to catch up after quota is restored.

### GitHub Pages issue

- Cloudflare remains the independently deployable production path;
- repair GitHub Pages separately without blocking Cloudflare releases.

## Rules for future agents

Before changing hosting/CI, an agent must:

1. read this file and `cloudflare-pages-deployment.md`;
2. preserve GitHub as the canonical repository;
3. preserve both Cloudflare Pages and GitHub Pages unless the owner explicitly requests otherwise;
4. verify the `/` vs `/basemodel/` base-path contract;
5. avoid secrets in repository files or `PUBLIC_*` variables;
6. use branch + PR for architecture changes;
7. keep Cloudflare build logic reproducible in the repository;
8. distinguish provider/quota failures from code failures;
9. update these docs when the hosting contract materially changes.

## Current state

As of 2026-08-09:

- GitHub repository is the canonical source.
- Cloudflare Pages project `basemodel` is connected to `mykcs/basemodel`.
- Cloudflare production bootstrap from `main` succeeded.
- Cloudflare Preview for `agent/migrate-cloudflare-pages` commit `0edcae2` succeeded and rendered correctly in the browser.
- GitHub Pages configuration remains in the repository.
- GitHub-hosted Actions allowance is exhausted for the current billing period, so the GitHub Pages copy may not update until Actions capacity returns.
- Long-term target is dual hosting, not retirement of GitHub Pages.
