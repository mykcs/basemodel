# Cloudflare steady-state summary

Last reviewed: 2026-08-09

This document consolidates the decisions, migration work, fixes, and operating lessons that led to the current `mykcs/basemodel` deployment model. It is a summary and decision record. The authoritative current rules remain `deployment-policy.md`, `cloudflare-pages-deployment.md`, `repository-map.md`, and `/AGENTS.md`.

## Why the architecture changed

The repository previously relied heavily on GitHub Actions and GitHub Pages. That model accumulated two problems:

1. GitHub-hosted Actions runner minutes became a practical quota/cost constraint.
2. Deployment, validation, browser testing, external-network audits, and hosting responsibilities were coupled together in a way that made the release path heavier than this static Astro site required.

The migration goal was not “find a platform with no limits.” The goal was to use the simplest platform whose limits match the workload, while keeping tests and validation as repository capabilities.

The final long-term architecture is:

```text
GitHub
  -> source of truth / Git history
  -> branches + pull requests
  -> npm Dependabot
       |
       v
Cloudflare Pages
  -> Preview
  -> Production
  -> deterministic deployment gate
  -> Astro build
  -> hosting at /
```

GitHub Actions and GitHub Pages are intentionally retired.

## Final platform responsibilities

### GitHub

GitHub is responsible for:

- canonical source code;
- Git history;
- branches and pull requests;
- review/collaboration metadata;
- npm Dependabot.

GitHub is not the deployment runtime and does not host the maintained production site.

### Cloudflare Pages

Cloudflare Pages is responsible for:

- Git-connected Preview deployments;
- Production deployments from `main`;
- running the repository-owned deployment gate;
- Astro production build;
- hosting the maintained public site.

Current production identity:

```text
https://basemodel.pages.dev/
```

The maintained deployment base is `/`, not `/basemodel/`.

## GitHub Actions retirement

The intended repository state is zero GitHub Actions workflow files.

Retiring Actions did **not** mean deleting tests. Tests, audits, and validation scripts were kept as platform-independent repository assets.

The important distinction is:

```text
retire GitHub Actions != retire testing
```

The release path now runs only deterministic repository-local checks automatically. Browser-heavy and external-network checks remain available on demand.

## GitHub Pages retirement

GitHub Pages was retired as a maintained deployment target. Therefore the repository no longer needs to preserve:

- `/basemodel/` deployment compatibility;
- Pages-specific workflow files;
- Pages-only environment variables;
- duplicate-host canonical logic;
- Pages-specific browser acceptance paths.

If GitHub Pages remains enabled in repository settings, disabling that setting is an administrative cleanup. It is not a reason to restore Pages build code.

## Repository-owned deployment contract

Cloudflare uses:

```bash
npm run build:cloudflare
```

The build script first runs the deterministic deployment gate:

```text
npm run verify:deploy
  -> npm run check
  -> npm run validate
  -> npm run audit:semantic
  -> npm run audit:claims
  -> npm run audit:freshness
  -> npm test
```

Then it runs the Astro production build.

This keeps the real deployment contract in Git rather than hiding it in a dashboard-only shell command.

## Validation boundary

### Automatic deployment blockers

The automatic Cloudflare build should contain checks that are:

- deterministic;
- repository-local;
- reasonably fast;
- independent of third-party uptime;
- appropriate to block a release.

### Retained on-demand checks

The following remain first-class repository capabilities but are not part of every Pages build:

- `npm run test:e2e` — Chromium + WebKit Playwright regression;
- `npm run audit:vendor-catalogs` — external official-vendor checks;
- `npm run audit:urls` — external source URL health;
- `npm run audit:coverage` — coverage/data-health reporting;
- `npm run audit` / `npm run audit:full` — deeper audit bundles.

Use them when the type of change justifies them rather than turning every deployment into a browser/network monitoring job.

## Cloudflare quota model

The Cloudflare migration does not remove all quotas.

As of 2026-08-09, Cloudflare Pages Free documents:

- 500 Pages builds per month;
- 1 concurrent build;
- a 20-minute build timeout.

Cloudflare also documents that static asset requests are free and unlimited when they do not invoke Pages Functions.

Official references:

- <https://developers.cloudflare.com/pages/platform/limits/>
- <https://developers.cloudflare.com/pages/functions/pricing/>
- <https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/>
- <https://developers.cloudflare.com/pages/configuration/build-watch-paths/>

The practical distinction is:

```text
visitor loads static HTML/CSS/JS/images
  -> does not consume the Pages build quota

Git push triggers a Pages build/deployment
  -> consumes development build capacity
```

Therefore the build quota matters to Agent workflow even though normal visitor traffic is an excellent fit for static Pages hosting.

## Build-budget discipline

The primary quota risk for this repository is not reader traffic. It is an Agent producing many tiny Git pushes that each trigger Preview builds.

The default rule is:

> For one logical task/PR, aim for one real Cloudflare Preview of the final deployment-sensitive PR head. Additional real Preview builds should happen only when they provide real validation value, such as verifying a fix after a failed build or correcting a visual/routing problem found in Preview.

Agents must:

- inspect and edit related files before pushing;
- batch related changes into a coherent diff;
- avoid pushing after every individual file edit;
- avoid empty/no-op/speculative commits;
- avoid using Cloudflare as the first syntax checker when repository-local validation can run before push;
- use `[CF-Pages-Skip]` as a commit-message prefix for intermediate commits that intentionally do not need deployment;
- leave the final deployment-sensitive PR head unskipped so it receives a real Preview;
- use Build watch paths and branch controls when multiple Pages projects share a repository.

Cloudflare documents that commit messages prefixed with `[CF-Pages-Skip]` (and equivalent skip prefixes) cause Pages to omit that deployment.

A raw deployment/history row count must not automatically be treated as “builds used this month” when skipped entries are mixed into the history. For quota reasoning, distinguish actual builds from omitted/skipped deployment attempts.

## Recommended Agent push strategy

For normal non-trivial work:

```text
read current main + agent docs
  -> inspect all relevant files/tests
  -> make the complete local/logical diff
  -> run repository-local checks
  -> push coherent branch state
  -> open/update PR
  -> one real exact-head Cloudflare Preview
  -> inspect Preview if behavior is visual/routing/SEO-sensitive
  -> merge
  -> confirm Production
```

If the tool being used creates one Git commit per file write and cannot batch them into a single commit, intermediate file-write commits should use `[CF-Pages-Skip]`; the final commit should be the deployment-triggering commit.

This optimizes **builds**, not commit count for its own sake. Multiple local commits are fine if they do not create unnecessary remote deployments.

## Product regressions fixed during the migration/hardening work

Several real application bugs were found and fixed independently of the deployment architecture:

1. **English command search** — English pages incorrectly requested `/en/search-index.json`; the shared search index now uses the deployment base correctly while result URLs remain locale-aware.
2. **Research Task URL state** — stale task-owned query parameters could survive after options were removed; URL synchronization now replaces the owned parameter set while preserving unrelated parameters.
3. **BibTeX model URLs** — exported model URLs previously hard-coded `/models/...` and could lose locale/base semantics; they now use locale-aware URL construction.

These fixes must not be reverted when touching deployment/routing code.

## Deployment/SEO hardening completed

The steady state also includes:

- Astro production base `/`;
- stable Cloudflare Production identity;
- Preview `noindex` behavior;
- Production canonical/hreflang/OG/JSON-LD/sitemap/robots ownership;
- no `PUBLIC_BASE_PATH` deployment contract;
- no `PUBLIC_CANONICAL_SITE_URL` dual-host override contract;
- Node runtime pinning with repository tests protecting the Node/types major relationship;
- npm-only Dependabot after Actions retirement;
- architecture regression tests preventing accidental restoration of workflow files or retired deployment assumptions.

## Agent-oriented repository documentation added

The repository now contains a deliberate Agent onboarding layer:

- `/AGENTS.md` — repository-wide operating contract;
- `docs/agents/deployment-policy.md` — authoritative current architecture and validation boundary;
- `docs/agents/repository-map.md` — fast map of repository ownership and change-to-check guidance;
- `docs/agents/cloudflare-pages-deployment.md` — current deployment runbook;
- `docs/agents/README.md` — index separating authoritative current guidance from migration history.

A new Agent should read those files before making non-trivial changes instead of reconstructing the architecture from old PRs or historical notes.

## Collaboration model

The owner prefers high-autonomy execution.

Agents should retrieve repository, PR, Preview, Production, logs, files, and official documentation directly through available tools instead of making the owner copy information between services.

Human intervention should be reserved for real account/permission boundaries, for example:

- login or OAuth authorization;
- 2FA/CAPTCHA;
- billing;
- dashboard settings unavailable through connected tools;
- genuinely high-risk or irreversible decisions.

GitHub Pages enable/disable state is an example of an account-level setting that may require a manual owner action when no Pages administration tool is available.

## When this architecture must be revisited

Do not assume this exact model remains correct if the project later adds:

- SSR;
- Pages Functions;
- Workers;
- server-side APIs;
- authentication middleware;
- scheduled jobs;
- queues;
- KV/D1/R2 or other server-side state;
- dynamic AI/API calls requiring secrets;
- a monorepo with several independently deployed sites.

At that point, re-evaluate both architecture and quota/cost assumptions using current Cloudflare documentation. The goal is not uniformity across all projects; it is the simplest stable architecture that satisfies the actual workload.

## Current acceptance model

For deployment-sensitive changes:

```text
branch
  -> PR
  -> exact final-head Cloudflare Preview succeeds
  -> inspect behavior when needed
  -> merge main
  -> Production deployment succeeds
```

GitHub Actions runner availability and GitHub Pages deployment state are not release acceptance criteria.

## Authority reminder

This file explains how the current state was reached. If wording here conflicts with current steady-state policy, follow these in order:

1. `/AGENTS.md`
2. `docs/agents/deployment-policy.md`
3. `docs/agents/repository-map.md`
4. `docs/agents/cloudflare-pages-deployment.md`

Historical migration documents remain useful evidence, but they must not be used to restore GitHub Actions, GitHub Pages, or dual-hosting behavior without an explicit new owner decision.
