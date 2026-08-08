# Cloudflare Pages deployment architecture and migration runbook

Last reviewed: 2026-08-09

## Purpose

This document is the authoritative operational guide for agents working on hosting, CI, deployment, base-path handling, preview environments, and deployment-related repository settings.

The repository remains hosted on GitHub. Cloudflare Pages becomes the primary build/deploy platform so normal development and production deployment do not depend on GitHub-hosted Actions minutes.

The intended user workflow is:

```text
ChatGPT / coding agent
        |
        v
GitHub repository -> branch / PR / merge
        |
        +--------------------------+
        |                          |
        v                          v
Cloudflare Pages              GitHub Actions
build + preview + deploy      deep/periodic CI when available
        |
        v
production site
```

The key architectural rule is **do not move source control away from GitHub merely to avoid Actions billing**. GitHub is the source of truth and remains the integration surface for ChatGPT/agents. Build/deployment compute is decoupled from GitHub Actions.

---

## Why this architecture exists

In August 2026 the personal GitHub Pro account reached its included GitHub Actions allowance (`3,000 / 3,000` minutes). New GitHub-hosted jobs were created but failed before step 1 and produced no normal job log. Repository code and workflow configuration had recent known-good runs, so the immediate blocker was account-level hosted-runner allowance rather than application code.

This created an undesirable coupling:

```text
GitHub Actions allowance exhausted
        -> validation cannot start
        -> GitHub Pages deploy workflow cannot start
        -> otherwise valid site changes cannot reach production
```

Cloudflare Pages Git integration removes that coupling. Cloudflare pulls the GitHub repository and uses Cloudflare's build infrastructure. GitHub Actions minutes are not consumed by Cloudflare Pages builds.

As verified against Cloudflare documentation on 2026-08-09:

- Pages can connect directly to GitHub, including private repositories.
- A push to a connected branch triggers a Cloudflare Pages build/deploy.
- Pull requests from branches in the same repository receive preview deployments and GitHub check runs.
- The Free plan allows 500 Pages builds per month, one concurrent build, with a 20-minute build timeout.
- Pages injects `CF_PAGES`, `CF_PAGES_URL`, `CF_PAGES_BRANCH`, and `CF_PAGES_COMMIT_SHA` during builds.
- The current Pages v3 build image provides Node.js 22 and supports `.node-version`.

Official references:

- https://developers.cloudflare.com/pages/configuration/git-integration/
- https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/
- https://developers.cloudflare.com/pages/configuration/preview-deployments/
- https://developers.cloudflare.com/pages/configuration/build-configuration/
- https://developers.cloudflare.com/pages/configuration/build-image/
- https://developers.cloudflare.com/pages/platform/limits/
- https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/

Re-check these URLs before making assumptions about current limits or product behavior.

---

## Current and target responsibilities

### GitHub

GitHub remains responsible for:

- canonical source repository
- branches, pull requests, reviews, and merge history
- ChatGPT / coding-agent repository access
- issues and normal collaboration
- optional/deep CI through GitHub Actions when hosted-runner capacity is available

Do not migrate the repository away from GitHub unless there is a separate product requirement.

### Cloudflare Pages

Cloudflare Pages is the target primary platform for:

- installing dependencies
- deployment-blocking static/data/unit validation
- Astro production build
- pull-request preview deployments
- production deployment from `main`
- GitHub deployment/check status
- serving the static site from Cloudflare's network

### GitHub Actions after migration

GitHub Actions should no longer be required for a production deployment to happen.

When GitHub-hosted runner capacity is available, Actions remains useful for tasks that Cloudflare Pages should not be forced to perform on every deployment:

- full Chromium + WebKit Playwright coverage
- change-aware browser smoke/full regression tiers
- scheduled vendor-catalog audits that perform external network requests
- scheduled URL/source-health checks
- manually requested deep regressions
- artifact-heavy diagnostics

A temporary GitHub Actions outage or quota exhaustion must not prevent an otherwise validated Cloudflare production build.

---

## Repository implementation

### Cloudflare build entrypoint

Use:

```bash
npm run build:cloudflare
```

The command is intentionally stored in the repository rather than as a long dashboard-only shell expression.

Implementation:

- `package.json` exposes `build:cloudflare`.
- `scripts/build-cloudflare.mjs` runs deployment-blocking checks and then the Astro build.

The deployment-blocking checks are:

```text
npm run check
npm run validate
npm run audit:semantic
npm run audit:claims
npm run audit:freshness
npm test
npm run build
```

The final Astro build receives:

```text
PUBLIC_SITE_URL = PUBLIC_SITE_URL if explicitly configured,
                  otherwise CF_PAGES_URL
PUBLIC_BASE_PATH = /
```

Do **not** add `audit:vendor-catalogs` or `audit:urls` to every Cloudflare Pages build without a deliberate decision. Those audits depend on third-party network behavior and can make deployment availability depend on external sites. They belong in scheduled/deep auditing unless product requirements change.

### Node runtime

`.node-version` pins the Pages build runtime to:

```text
22.16.0
```

Before changing the value:

1. confirm Cloudflare Pages supports the target version;
2. confirm Astro and repository dependencies support it;
3. keep GitHub CI and local development expectations in mind;
4. update this document if the deployment contract changes materially.

### Base-path strategy

This repository historically deploys to GitHub Pages at:

```text
https://mykcs.github.io/basemodel/
```

Therefore the existing Astro defaults intentionally use:

```text
site = https://mykcs.github.io
base = /basemodel
```

Do not casually change those defaults because local Playwright and the existing GitHub Pages fallback were designed around `/basemodel/`.

Instead, the Cloudflare-specific build explicitly overrides:

```text
PUBLIC_BASE_PATH=/
```

Cloudflare Pages therefore serves the site from the origin root:

```text
https://<project>.pages.dev/
```

This allows both deployment models to coexist during migration:

```text
GitHub Pages build -> /basemodel/
Cloudflare build   -> /
```

### Site URL strategy

For normal Cloudflare Pages deployments, `CF_PAGES_URL` is injected automatically and should be used as the Astro `site` value.

This is especially important for preview deployments because each preview has its own URL.

If a permanent custom domain is later attached, set a **production-only** environment variable in Cloudflare:

```text
PUBLIC_SITE_URL=https://<canonical-domain>
```

Do not set that same value for previews. Preview builds should continue using `CF_PAGES_URL` so sitemap/canonical generation does not point preview content at a misleading deployment URL.

### robots.txt strategy

`public/robots.txt` was GitHub-Pages-specific and contained a hard-coded sitemap URL. It is replaced by `src/pages/robots.txt.ts`.

Behavior:

- Cloudflare preview branch (`CF_PAGES=1` and branch is not `main`) -> `Disallow: /`
- production/main or non-Cloudflare build -> `Allow: /` and a deployment-aware sitemap URL

This prevents Cloudflare preview deployments from being indexed while preserving a correct production sitemap reference.

If the production branch is ever changed away from `main`, update the preview-detection rule in `src/pages/robots.txt.ts` at the same time.

---

## Initial Cloudflare Pages setup

This section contains the human dashboard steps required once per project. An agent should prepare the repository first, then guide the account owner through only these required actions.

### 1. Create the Pages project

In Cloudflare dashboard:

```text
Workers & Pages
-> Create application
-> Pages
-> Connect to Git / Import an existing Git repository
```

Authorize GitHub when prompted.

Security preference: grant the `Cloudflare Workers and Pages` GitHub App access to **only the repositories that need Cloudflare deployment**, ideally only `mykcs/basemodel` for this setup.

Select:

```text
Repository: mykcs/basemodel
Production branch: main
Build output directory: dist
Root directory: repository root
```

Project name may be `basemodel` if available. The chosen name determines the initial `*.pages.dev` hostname and should be treated as durable because Pages project subdomains are not intended to be casually renamed.

### 2. Bootstrap build command before this migration PR is merged

When the Cloudflare project is first created, `main` may not yet contain `npm run build:cloudflare`.

For the first deployment only, use this dashboard build command:

```bash
npm run check && npm run validate && npm run audit:semantic && npm run audit:claims && npm run audit:freshness && npm test && PUBLIC_SITE_URL="$CF_PAGES_URL" PUBLIC_BASE_PATH=/ npm run build
```

Output directory:

```text
dist
```

This command is intentionally compatible with the pre-migration `main` branch.

After the migration PR is merged, replace the dashboard build command with:

```bash
npm run build:cloudflare
```

The repository entrypoint is the long-term source of truth.

### 3. Build environment

Use the current Pages v3 build system.

The repository includes `.node-version`, so a separate `NODE_VERSION` dashboard variable should not normally be necessary.

Do not add secrets unless a future feature genuinely requires them. This static site currently does not require deployment secrets.

### 4. Preview deployments

Keep preview deployments enabled for branches in this repository.

Expected behavior:

- a branch push creates a preview deployment;
- a pull request from a branch in `mykcs/basemodel` receives a preview URL;
- subsequent commits update that preview;
- preview deployment does not modify production;
- preview `robots.txt` blocks indexing.

PRs from forks do not receive the same automatic preview behavior; account for that if collaboration model changes.

---

## Migration verification checklist

Do not remove the GitHub Pages fallback until all checks below are complete.

### Cloudflare project health

- [ ] GitHub App is authorized for `mykcs/basemodel`.
- [ ] Pages project is connected to the correct repository.
- [ ] Production branch is `main`.
- [ ] Build output directory is `dist`.
- [ ] First production build succeeds.
- [ ] A deployment URL under `*.pages.dev` is reachable.

### Migration-branch preview

For `agent/migrate-cloudflare-pages` or the active migration PR:

- [ ] Cloudflare creates a preview deployment.
- [ ] Cloudflare build command completes all blocking validation steps.
- [ ] `/` renders correctly.
- [ ] `/models/` renders correctly.
- [ ] `/families/` renders correctly.
- [ ] `/compare/` renders correctly.
- [ ] `/papers/` renders correctly.
- [ ] `/guide/` renders correctly.
- [ ] `/landscape/` renders correctly.
- [ ] `/methodology/` renders correctly.
- [ ] `/workspace/` renders correctly.
- [ ] `/data-status/` renders correctly.
- [ ] `/en/` and representative English routes render correctly.
- [ ] static JS/CSS/assets load from root paths and there are no accidental `/basemodel/` asset requirements.
- [ ] `/sitemap.xml` uses the preview deployment origin.
- [ ] `/robots.txt` returns `Disallow: /` on preview.
- [ ] browser console has no obvious asset/route errors.

### Post-merge production

After the migration PR is merged:

- [ ] Cloudflare builds the new `main` commit.
- [ ] dashboard build command is simplified to `npm run build:cloudflare`.
- [ ] production `/robots.txt` returns `Allow: /`.
- [ ] production sitemap uses the intended production origin.
- [ ] GitHub PR/check UI reports the Cloudflare deployment status.
- [ ] production route/asset smoke checks pass.

If a custom domain is introduced:

- [ ] custom domain resolves to Pages.
- [ ] production `PUBLIC_SITE_URL` equals the canonical custom-domain origin.
- [ ] sitemap/canonical/robots references use the custom domain.
- [ ] preview environment does not inherit the production canonical-domain override.

---

## GitHub branch protection / required checks

During GitHub Actions quota exhaustion, an old required GitHub Actions check can block merges even though Cloudflare successfully validates and previews the PR.

Do not guess the Cloudflare check name. After the first Pages-connected PR build:

1. open the GitHub PR;
2. identify the exact Cloudflare Pages check-run name shown by GitHub;
3. inspect repository branch protection/rulesets;
4. if `Validate Atlas` / `Validation gate` is required and cannot run because hosted-runner allowance is exhausted, replace or temporarily remove that requirement according to repository policy;
5. if a Cloudflare build check is made required, verify docs-only/build-skipped behavior cannot leave PRs permanently pending.

Because Cloudflare build-watch exclusions can prevent a check from being created, avoid excluding paths while the Cloudflare check is required unless the ruleset has been designed for that behavior.

The safe interim principle is:

```text
Cloudflare deployment-blocking validation = required for deploy
GitHub Actions deep browser regression      = advisory / periodic while quota is unavailable
```

After GitHub Actions allowance resets, agents may re-enable stricter GitHub required checks if desired, but production deployment should remain decoupled from Actions quota.

---

## What to do with existing GitHub Pages deployment

During migration, keep `.github/workflows/deploy.yml` unchanged as a fallback. It is already fail-closed behind successful `Validate Atlas` runs.

Once Cloudflare production has been verified and the user explicitly accepts Cloudflare as primary hosting:

1. remove or disable the GitHub Pages deployment workflow so it no longer consumes hosted-runner minutes;
2. update `README.md` deployment documentation to identify Cloudflare Pages as primary;
3. keep GitHub Actions validation workflows only for tasks that justify runner cost;
4. decide whether the legacy `mykcs.github.io/basemodel/` URL should remain as a stale fallback, be retired, or redirect via a separate deliberate mechanism;
5. do not destroy rollback information until at least one known-good Cloudflare production release exists.

Do not disable the old Pages deployment before Cloudflare production is confirmed reachable.

---

## Development workflow while GitHub Actions minutes are exhausted

Normal source development can continue.

Expected workflow:

```text
1. agent creates branch
2. agent commits changes to GitHub
3. Cloudflare creates preview build
4. Cloudflare runs deployment-blocking validation
5. human/agent checks preview when visual behavior matters
6. PR is merged
7. Cloudflare builds main and updates production
```

No local clone is required for this workflow.

GitHub Actions failures that occur before step 1 because of account allowance are infrastructure/account state, not application test failures. Do not modify application code merely to make those zero-step jobs green.

When GitHub Actions allowance becomes available again, deep CI can resume without changing the Cloudflare deployment architecture.

---

## Validation boundary: Cloudflare vs GitHub Actions

### Must block Cloudflare production deployment

Keep deterministic repository-local checks here:

- Astro/type/content check
- data schema/relation validation
- semantic-gap audit
- claim evidence audit
- freshness audit
- Vitest
- Astro static build

A non-zero exit from any of these prevents deployment.

### Prefer GitHub Actions scheduled/deep checks

Keep expensive or externally dependent checks out of every deployment unless there is a deliberate reliability tradeoff:

- Chromium full E2E
- WebKit full E2E
- Playwright container/matrix jobs
- vendor official-catalog network audit
- URL/source-health external requests
- long-running coverage/adversarial audits

If a future agent moves an external-network audit into the Cloudflare blocking build, document why deployment availability is now allowed to depend on that external service.

---

## Cost-control rules

Cloudflare Pages Free currently provides 500 builds/month. This is a different meter from GitHub Actions runner minutes.

Agents should still avoid waste:

- batch related edits into intentional commits when practical;
- do not create repeated no-op commits merely to retrigger preview builds;
- use Cloudflare's documented skip-build commit flags only for changes that truly do not need a deployment;
- do not disable preview builds broadly just to save quota without considering PR validation/visibility;
- before adding build-watch exclusions, check whether Cloudflare check runs are required by GitHub rulesets.

Re-check Cloudflare limits before making a quota-sensitive architectural decision.

---

## Security rules

- Limit the Cloudflare GitHub App to the minimum repository scope practical.
- Do not put Cloudflare API tokens, GitHub tokens, or other secrets in repository files.
- Static Pages deployment does not require a Cloudflare API token when using Git integration.
- Prefer repository-controlled build logic (`npm run build:cloudflare`) over complex dashboard-only scripts.
- Keep preview deployments non-indexable.
- Do not expose secrets as `PUBLIC_*` variables; Astro public variables can become client-visible.
- Before adding Pages Functions, Workers bindings, KV, D1, R2, or secrets, update this architecture document because the security/deployment model will have changed from static hosting.

---

## Rollback

### Before Cloudflare becomes primary

Rollback is trivial: close/revert the migration PR. Existing GitHub Pages configuration remains intact.

### After Cloudflare becomes primary but GitHub Pages still exists

If a bad Cloudflare configuration is introduced:

1. use Cloudflare deployment rollback/redeploy capabilities to restore a known-good production deployment;
2. fix configuration on a branch and verify via preview;
3. avoid switching source repositories or recreating the Pages project unless necessary.

### If Cloudflare is unavailable

GitHub remains the source repository. Once GitHub Actions runner capacity is available, the historical GitHub Pages deployment path can be restored from Git history if it has been removed.

Never delete repository history or migration documentation as part of a hosting rollback.

---

## Agent change protocol

Any agent modifying deployment-related files must:

1. read this document first;
2. inspect the current Cloudflare/GitHub state rather than assuming the migration status;
3. preserve GitHub as source of truth unless explicitly instructed otherwise;
4. use a branch + PR for deployment architecture changes;
5. avoid disabling the current production path before the replacement is verified;
6. distinguish account/quota/runner failures from code/test failures;
7. keep Cloudflare build logic reproducible in the repository;
8. verify base-path behavior for both `/` and legacy `/basemodel/` when relevant;
9. verify sitemap/robots/canonical behavior after hostname changes;
10. update this document when the deployment contract materially changes.

Files that normally require reading this document before editing include:

```text
astro.config.mjs
package.json
scripts/build-cloudflare.mjs
src/pages/robots.txt.ts
src/pages/sitemap.xml.ts
.github/workflows/*.yml
.node-version
```

---

## Migration status

At the time this document was introduced:

- GitHub remains the source repository.
- Existing GitHub Pages workflow is intentionally preserved during migration.
- GitHub Actions included minutes are exhausted for the current billing period.
- Repository-side Cloudflare build support is being prepared on `agent/migrate-cloudflare-pages`.
- Cloudflare account-side Git integration still requires the account owner to authorize/select the GitHub repository and create the Pages project.
- The migration is **not complete** until the verification checklist above has been executed against a real Cloudflare preview and production deployment.

Future agents must update this section when the state changes so they do not repeat completed setup or accidentally remove the active production path.
