# Cloudflare Pages deployment runbook

Last reviewed: 2026-08-09

## Authority and scope

This is the operational runbook for Cloudflare Pages, GitHub Pages coexistence, deployment URLs, indexing behavior, CI boundaries, quota incidents, and rollback.

Read these files together:

1. `dual-hosting-policy.md` — authoritative steady-state hosting policy.
2. this file — operational implementation/runbook.
3. `2026-08-09-cloudflare-migration-retrospective.md` — incident/migration history, successes, failures, and lessons.

If older migration wording conflicts with `dual-hosting-policy.md`, the dual-hosting policy wins.

---

## Current architecture

GitHub remains the canonical source repository and the integration surface used by ChatGPT/coding agents.

```text
ChatGPT / coding agent
        |
        v
GitHub repository
        |
        +------------------------------+
        |                              |
        v                              v
Cloudflare Pages                 GitHub Actions
Preview + Production             deep/scheduled CI
        |                              |
        v                              v
basemodel.pages.dev              GitHub Pages deploy
                                       |
                                       v
                             mykcs.github.io/basemodel/
```

Cloudflare deployment must not depend on GitHub-hosted Actions minutes.

GitHub Pages is intentionally retained as a second public endpoint, not retired after Cloudflare succeeds.

---

## Verified migration state

The migration is complete.

Verified on 2026-08-09:

- Cloudflare Pages project `basemodel` is connected to `mykcs/basemodel`.
- production branch is `main`.
- output directory is `dist`.
- `basemodel.pages.dev` is live.
- PR/branch Preview deployments work.
- Cloudflare's GitHub App comments successful Preview URLs directly on PRs.
- dashboard Build command is `npm run build:cloudflare`.
- PR #36 proved that repository-owned command succeeds in Preview.
- merged `main` commit `fcc872a` was confirmed green in Cloudflare Production.
- GitHub Pages workflow remains in the repository.

Historical identifiers are evidence only; do not hard-code them into automation.

---

## Cloudflare dashboard contract

Current Pages configuration:

```text
Project: basemodel
Repository: mykcs/basemodel
Production branch: main
Build command: npm run build:cloudflare
Build output directory: dist
Root directory: repository root
```

Node is pinned in the repository using `.node-version`.

Do not replace the repository-owned build command with a long dashboard-only shell command. The repository is the source of truth for build behavior.

### GitHub App permissions

Use the Cloudflare Workers and Pages GitHub App with selected-repository access rather than all repositories when practical.

Multiple repositories can be authorized in one App installation; each repository still requires its own Pages/Workers project before it deploys.

No Cloudflare API token is required in this repository for Git integration.

---

## Cloudflare build entrypoint

Long-term entrypoint:

```bash
npm run build:cloudflare
```

Implementation:

```text
package.json
scripts/build-cloudflare.mjs
```

The entrypoint runs deployment-blocking checks before Astro build:

```text
npm run check
npm run validate
npm run audit:semantic
npm run audit:claims
npm run audit:freshness
npm test
npm run build
```

Keep these checks deterministic and repository-local.

Do not put the following into every Cloudflare deployment without a deliberate reliability decision:

- vendor-catalog network audits;
- URL/source-health probes;
- full Chromium/WebKit matrices;
- other checks whose success depends on third-party network availability.

Those belong in GitHub Actions scheduled/deep CI when runner capacity is available.

---

## Base-path contract

The same source intentionally supports two public path layouts:

```text
Cloudflare Pages: /
GitHub Pages:     /basemodel/
```

Cloudflare build therefore injects:

```text
PUBLIC_BASE_PATH=/
```

GitHub Pages injects:

```text
PUBLIC_SITE_URL=https://mykcs.github.io
PUBLIC_BASE_PATH=/basemodel
```

Do not globally change Astro's default base to `/`; that would break GitHub Pages.

Avoid hard-coded `/basemodel/` links in application code. Use base-aware URL helpers.

Base-path-sensitive changes should be checked against both deployment contracts when GitHub Pages capacity is available.

---

## Stable production identity vs deployment URL

Cloudflare injects:

```text
CF_PAGES_URL
CF_PAGES_BRANCH
CF_PAGES_COMMIT_SHA
CF_PAGES=1
```

`CF_PAGES_URL` is the URL of the **current deployment**, not necessarily the durable production hostname.

Cloudflare also keeps a stable production alias:

```text
https://basemodel.pages.dev/
```

Unique/hash deployments remain independently addressable.

Therefore `scripts/build-cloudflare.mjs` follows this rule:

```text
explicit PUBLIC_SITE_URL
        -> use it (future custom-domain override)
else main/production
        -> derive stable <project>.pages.dev origin
else Preview
        -> use current CF_PAGES_URL
```

This prevents production canonical URLs, sitemap URLs, Open Graph metadata, hreflang, and JSON-LD from drifting to a new hash hostname on every release.

If a custom domain becomes the permanent public identity, configure production-only:

```text
PUBLIC_SITE_URL=https://<canonical-domain>
```

Do not set that override for Preview environments.

---

## Search indexing and duplicate-content policy

Long-term indexing model:

```text
Cloudflare Production = indexable canonical production site
Cloudflare Preview    = noindex
GitHub Pages          = public fallback, noindex
```

GitHub Pages remains accessible to humans; `noindex` only prevents it from competing with Cloudflare in search results.

GitHub Pages build sets:

```text
PUBLIC_CANONICAL_SITE_URL=https://basemodel.pages.dev
PUBLIC_SEARCH_INDEXING=disabled
```

The application then:

- emits `meta robots=noindex,follow` on noindex builds;
- emits canonical/hreflang/OG identity pointing at Cloudflare's stable production paths;
- does not advertise a sitemap link on noindex pages;
- emits an empty sitemap for noindex builds.

### Preview indexing

Cloudflare Pages automatically adds:

```text
X-Robots-Tag: noindex
```

to Preview deployments.

The repository also emits noindex metadata as defense in depth.

**Do not block Preview pages with `robots.txt: Disallow /`.** Search crawlers need to fetch a response/page to observe `noindex`. A disallowed URL can still appear as a URL-only search result if discovered elsewhere.

For noindex deployments, `robots.txt` therefore allows crawling but does not advertise a sitemap.

If Preview content ever becomes sensitive rather than merely unreleased, indexing controls are not access control. Use Cloudflare Access to require authentication.

---

## Normal agent workflow

For normal code/product changes:

```text
1. Read AGENTS.md and relevant docs/agents files.
2. Create an agent branch from current main.
3. Batch related edits into intentional commits.
4. Open a PR.
5. Wait for/read the Cloudflare Pages bot PR result.
6. If visual behavior changed, inspect the Preview URL.
7. Merge after Cloudflare deployment-blocking checks succeed and review is satisfactory.
8. For deployment-sensitive work, confirm the resulting main Production deployment.
```

Cloudflare's GitHub App comments the Preview result directly on the PR. Prefer reading that through GitHub tooling instead of requiring the user to repeatedly open the Cloudflare dashboard.

---

## GitHub Actions quota exhaustion

A known 2026 incident exhausted the GitHub Pro included Actions allowance (`3,000 / 3,000`). Jobs then failed before step 1.

When that state occurs:

- continue normal GitHub source development;
- continue Cloudflare Preview/Production deployment;
- allow GitHub Pages to lag temporarily;
- do not weaken code/tests because a hosted runner cannot start;
- do not repeatedly retry zero-step jobs after billing/quota is confirmed.

When quota returns, GitHub Actions resumes deep CI and GitHub Pages deployment without changing the Cloudflare architecture.

---

## GitHub Pages role

Keep `.github/workflows/deploy.yml`.

It is the second public deployment path and is allowed to lag when Actions capacity is unavailable.

The workflow is fail-closed behind a successful `Validate Atlas` main run and builds the exact validated commit.

Search policy is intentionally different from Cloudflare:

```text
publicly accessible: yes
search indexed:      no
canonical identity:  Cloudflare production
```

Do not remove the workflow merely to save minutes unless the repository owner explicitly changes the dual-hosting policy.

---

## Branch protection and Cloudflare checks

Cloudflare Git integration produces GitHub check runs/comments for normal builds.

If a Cloudflare check becomes a required status check, remember:

- skipped builds do not produce the normal check/status;
- build-watch exclusions can therefore leave required-check workflows in an awkward state;
- commit-message skip flags should be used only when compatible with current rulesets.

Do not guess a check-run name. Observe the actual name GitHub reports before configuring a required rule.

---

## Cost controls

At the 2026-08-09 review, Cloudflare Pages Free documentation listed:

```text
500 builds/month
1 concurrent build
20 minute build timeout
```

These are time-sensitive provider limits; re-check official docs before making quota-sensitive decisions.

Agent rules:

- batch related edits;
- avoid no-op commits;
- fetch current blob SHA before sequential GitHub file updates;
- do not create commits merely to preserve wording;
- keep Dependabot previews because dependency changes benefit from real builds;
- use `[CF-Pages-Skip]`, `[CI Skip]`, or equivalent only for true non-deploy changes and only when a missing Cloudflare check cannot block policy;
- do not broadly disable Preview deployments just to save builds.

The migration itself demonstrated why this matters: many tiny documentation commits each generated a real Preview deployment.

---

## Copilot review cost note

GitHub documents that Copilot code review on private repositories consumes GitHub Actions minutes.

For a cost-sensitive private repository:

- request Copilot review selectively;
- avoid automatic re-review on every push for high-churn agent PRs unless justified;
- prefer Low review effort unless deeper review is needed.

Copilot review is advisory and does not count as a required approval by itself.

---

## Third-party PR bot noise

During migration, an `ecc-tools` GitHub App repeatedly posted paid-upgrade comments on a private-repository PR and did not provide useful validation.

If that App is not intentionally used for another workflow, remove/disable its repository access in GitHub's installed-app settings.

Do not confuse third-party bot comments with Cloudflare deployment status or repository CI.

---

## Rollback

### Bad Cloudflare production

Cloudflare Pages supports rollback to a previous successful **Production** deployment.

Use the Cloudflare Deployments page to roll back, then fix the repository on a branch and validate via Preview.

Preview deployments are not production rollback targets.

### Cloudflare incident

GitHub remains source of truth. GitHub Pages is the independent public fallback when its latest build is available.

### GitHub Actions incident/quota

Cloudflare remains deployable. Do not block normal releases solely because GitHub Pages cannot update.

### GitHub Pages incident

Repair GitHub Pages independently. Do not weaken or disable Cloudflare production.

---

## Custom domain future state

A custom domain is recommended if the project needs a durable public brand independent of provider hostnames.

When adding one:

1. attach it to Cloudflare Pages;
2. set **production-only** `PUBLIC_SITE_URL` to that origin;
3. change GitHub Pages `PUBLIC_CANONICAL_SITE_URL` to that origin;
4. verify canonical, hreflang, OG metadata, JSON-LD, sitemap, and robots;
5. do not make Preview builds inherit the production custom-domain override.

Keep provider URLs as technical/fallback endpoints unless the owner explicitly chooses redirects or retirement.

---

## Security rules

- GitHub remains source of truth.
- Grant Cloudflare GitHub App only needed repository access.
- Do not commit Cloudflare/GitHub tokens.
- Do not put secrets in `PUBLIC_*` variables; public Astro values may reach browser output.
- Keep repository-owned build logic reproducible.
- `noindex` is not authentication; use Cloudflare Access for sensitive Previews.
- If Pages Functions, Workers, KV, D1, R2, secrets, or server-side APIs are introduced, update this runbook because the threat/deployment model changes materially.

---

## Files requiring this runbook before editing

Normally read this file before changing:

```text
AGENTS.md
astro.config.mjs
package.json
scripts/build-cloudflare.mjs
src/layouts/AppLayout.astro
src/pages/robots.txt.ts
src/pages/sitemap.xml.ts
.github/workflows/*.yml
.node-version
docs/agents/dual-hosting-policy.md
```

---

## Official references to re-check

Cloudflare:

- https://developers.cloudflare.com/pages/configuration/git-integration/
- https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/
- https://developers.cloudflare.com/pages/configuration/preview-deployments/
- https://developers.cloudflare.com/pages/configuration/build-configuration/
- https://developers.cloudflare.com/pages/configuration/build-watch-paths/
- https://developers.cloudflare.com/pages/configuration/branch-build-controls/
- https://developers.cloudflare.com/pages/platform/limits/
- https://developers.cloudflare.com/pages/configuration/rollbacks/

GitHub:

- https://docs.github.com/en/actions/concepts/billing-and-usage
- https://docs.github.com/en/billing/concepts/product-billing/github-actions
- https://docs.github.com/en/copilot/how-tos/copilot-on-github/set-up-copilot/configure-runners

Search indexing:

- https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- https://developers.google.com/search/docs/crawling-indexing/block-indexing

Re-check provider documentation instead of treating quota/pricing/runtime values in this file as permanent.
