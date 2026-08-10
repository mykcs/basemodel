# Cloudflare Pages deployment runbook

Last reviewed: 2026-08-10

## Current architecture

```text
GitHub source of truth
        |
        +---- ordinary preview: local/Agent build -> Wrangler Direct Upload -> public Preview URL
        |
        +---- explicit formal release: Git-integrated Cloudflare Pages build -> Preview / Production
```

Cloudflare Pages remains the Production host. GitHub Actions and GitHub Pages are intentionally retired.

For normal Agent-driven website changes, [`direct-upload-preview-policy.md`](./direct-upload-preview-policy.md) is the default preview/build-budget authority. This runbook retains the Cloudflare project contract, SEO identity, formal Git-release flow and rollback rules.

## Cloudflare project contract

```text
Project: basemodel
Repository: mykcs/basemodel
Production branch: main
Formal Git build command: npm run build:cloudflare
Build output directory: dist
Root directory: repository root
```

Node is pinned with `.node-version`; keep build logic in the repository.

## Default: local build + Direct Upload preview

The owner prioritizes conserving Cloudflare Pages Git-build quota.

For ordinary website changes:

```text
1. edit and batch the requested source changes;
2. run repository-local validation on the Agent/local side;
3. build the production output locally/agent-side;
4. Direct Upload dist/ to a unique non-production Pages branch;
5. capture the public Preview URL returned by Wrangler;
6. inspect the Preview when UI/routing/SEO behavior changed;
7. synchronize source to GitHub with a Cloudflare-supported skip-build commit strategy;
8. report completion, Preview URL, Git state, Production state, and whether a Pages Build was triggered.
```

Practical command pattern:

```bash
PREVIEW_BRANCH="agent-preview-<short-task-name>-<short-id>"
PREVIEW_ORIGIN="https://${PREVIEW_BRANCH}.basemodel.pages.dev"

CF_PAGES_BRANCH="$PREVIEW_BRANCH" \
PUBLIC_SITE_URL="$PREVIEW_ORIGIN" \
PUBLIC_SEARCH_INDEXING=disabled \
npm run build:cloudflare

npx wrangler pages deploy dist \
  --project-name=basemodel \
  --branch="$PREVIEW_BRANCH"
```

Use the actual deployment URL returned by Wrangler as primary evidence. Direct Upload uploads prebuilt assets, so Cloudflare does not run the Git-connected build step for that deployment. It still creates a Pages deployment and remains subject to upload/deployment/file/platform limits; do not describe it as broadly quota-free.

Official references:

- <https://developers.cloudflare.com/pages/get-started/direct-upload/>
- <https://developers.cloudflare.com/pages/configuration/git-integration/>
- <https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/>
- <https://developers.cloudflare.com/pages/platform/limits/>

Re-check current Cloudflare docs before quota/cost decisions.

## Git synchronization without intentionally spending a Pages Build

When source should be saved to GitHub but the owner did not request a formal Git-integrated release, use Build Watch / branch controls or a Cloudflare-supported skip prefix on commits that would otherwise trigger Pages, for example:

```text
[Skip CI] ...
```

Cloudflare also documents variants such as `[CF-Pages-Skip]`, `[CI Skip]`, `[CI-Skip]`, and `[Skip-CI]`.

Batch related changes. Avoid no-op commits, probe branches and speculative push loops merely to test whether Pages is healthy.

## Repository-owned validation

`npm run build:cloudflare` performs deterministic deployment validation and the production Astro build. Repository scripts in `package.json` are executable truth.

For Direct Upload, run the same relevant checks locally/agent-side before uploading `dist`; moving validation off the hosted Git builder is not permission to weaken the research-integrity gates.

Keep full Chromium/WebKit Playwright and third-party-dependent audits on demand unless the change actually needs them:

```bash
npm run test:e2e
npm run audit:vendor-catalogs
npm run audit:urls
npm run audit:coverage
```

## Formal Git-integrated deployment boundary

Only use the normal Git-connected Preview / Production workflow when the owner explicitly asks for a formal Git-integrated deployment, merge-and-deploy, Production release, or equivalent production boundary.

Before intentionally triggering it:

1. tell the owner the next push/merge may consume Cloudflare Pages Build quota;
2. state whether Preview, Production or both are expected to build;
3. batch and validate the final diff locally first;
4. use the exact final head as the release boundary;
5. verify the exact deployment/commit rather than assuming success.

Do not silently convert an ordinary “show me the website” request into a Git-connected Pages build.

## Required completion report

After a website modification, explicitly state whether the requested acceptance boundary is complete and report:

- local validation/build result;
- Direct Upload result and public Preview URL when that is the default/requested path;
- `Cloudflare Pages Build triggered: yes / no / unknown`;
- Git synchronization status;
- whether Production was intentionally changed;
- any blocker or unverified boundary.

If the Agent cannot build locally, cannot authenticate Wrangler, cannot upload, cannot inspect the Preview, or cannot confirm relevant quota/deployment evidence, say so. Do not claim success or safety at that boundary.

## Preview identity and indexing

Cloudflare is the only maintained hosting target, so application base is `/`.

Production remains the indexed canonical identity. Every non-production Preview, including Direct Upload branch Previews, must remain `noindex` and must be built with the Preview origin so generated canonical/OG/JSON-LD metadata do not impersonate Production. `noindex` is not access control.

## Build budget and limits

As of the 2026-08-10 review, Cloudflare documents a Free Pages Git-build allowance of 500 builds/month, one concurrent build and a 20-minute build timeout. Values can change.

Project distinction:

```text
normal static requests != Git build consumption
Git-connected push/merge deployment = may consume Pages Build
local build + Direct Upload = prebuilt Pages deployment, not a Git-connected Pages Build
```

Direct Upload still has deployment/upload/file/platform limits.

## Rollback and security

For a bad Production release, roll back to a previous successful Cloudflare Pages Production deployment, then fix the repository on a branch. GitHub remains source of truth.

- Do not commit Cloudflare/GitHub tokens.
- Do not put secrets in `PUBLIC_*` variables.
- Keep Cloudflare GitHub App access scoped narrowly.
- Revisit this runbook if Pages Functions, Workers, SSR, server APIs, KV/D1/R2, Durable Objects, Queues, scheduled workloads or multiple deployable applications change the deployment/cost model.
