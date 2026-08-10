# Deployment and validation policy

Last reviewed: 2026-08-10

## Authority

This file is the authoritative steady-state deployment policy for `mykcs/basemodel`.

The maintained production architecture is still:

```text
GitHub -> Cloudflare Pages
```

GitHub remains the canonical source repository. Cloudflare Pages remains the production host. What changes here is the **default Agent preview/development workflow**: routine website iteration must avoid consuming Cloudflare Pages Build quota when a local build plus manual upload can validate the same change.

A future agent must not restore GitHub Actions or GitHub Pages because older history files mention them. Reintroduction requires an explicit repository-owner decision based on a current need.

## Responsibilities

### GitHub

- canonical source repository and Git history;
- branches and pull requests;
- Dependabot for npm dependencies;
- collaboration/review metadata.

### Cloudflare Pages

- Production hosting at the root path `/`;
- Git-integrated Preview/Production builds **only when intentionally allowed**;
- manual Wrangler deployments of already-built assets for no-build-cost previews;
- execution of the repository-owned deployment gate when a Git-integrated build is intentionally used.

The Git-integrated Cloudflare dashboard Build command remains:

```bash
npm run build:cloudflare
```

The build output directory remains:

```text
dist
```

## Default Agent workflow: local build + Direct Upload preview

For normal website changes, Codex/Claude/ChatGPT work mode should use this order unless the owner explicitly asks for a formal Git-integrated deployment:

```text
edit locally
  -> run repository-local checks/build
  -> upload the prebuilt dist/ with Wrangler to a preview branch
  -> return the new public preview URL
  -> report explicitly whether a Cloudflare Pages Build was triggered
```

The preferred preview deployment is:

```bash
npx wrangler pages deploy dist \
  --project-name=basemodel \
  --branch=<preview-branch>
```

For an existing Git-integrated Pages project, Wrangler can create a manual deployment of the prebuilt output. The build has already happened locally; do not trigger a hosted Pages Build merely to obtain a preview.

When committing/pushing repository changes while automatic Git deployments are still enabled, prevent unnecessary Pages Builds by using one of the verified no-build mechanisms:

- Cloudflare Build Watch Paths / branch controls when the changed path is intentionally excluded;
- a Cloudflare-supported commit-message prefix such as `[CF-Pages-Skip]` for commits that must not deploy.

Do not use push-loop debugging as the preview mechanism.

## Explicit Git-integrated deployment boundary

Only intentionally allow a Git-connected Cloudflare Pages Preview/Production build when:

1. the owner explicitly asks for a formal Git-integrated deployment; or
2. Direct Upload/manual preview cannot validate a required deployment property and the limitation is explained before triggering the hosted build.

Before an operation that is expected to consume a Pages Build, explicitly tell the owner that the next push/merge may consume a Pages Build.

For a formal Git-integrated release, batch the final coherent change and then verify the exact deployed commit. Do not spend hosted builds on intermediate diagnostic commits.

## Completion reporting

After website changes are implemented and validated, the Agent must explicitly report completion. The final status must include, when relevant:

- **change complete:** yes/no;
- **local build/validation:** pass/fail/not available;
- **Cloudflare Pages Build triggered:** yes/no/unknown;
- **Direct Upload preview:** the public URL, or the exact reason upload/verification could not be completed.

If local build fails, upload fails, authentication is unavailable, the Pages project cannot be resolved, or quota/build state cannot be confirmed, say so. Never claim the deployment path was safe, quota-free, or fully verified without evidence.

## Cost and quota policy

Cloudflare Pages Build quota is a real engineering constraint.

Cloudflare's current Pages limits documentation describes the hosted build quota separately from static delivery. In practical terms for this repository:

```text
normal static visitor traffic != Pages Build consumption
Git-connected push that triggers a Pages build = Build consumption
local build + manual upload of prebuilt assets = preferred preview path
```

Verify current Cloudflare documentation before future cost/limit decisions because limits can change.

Official references:

- <https://developers.cloudflare.com/pages/platform/limits/>
- <https://developers.cloudflare.com/pages/get-started/direct-upload/>
- <https://developers.cloudflare.com/pages/configuration/git-integration/>
- <https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/>

Build-budget priority:

1. local build/test only;
2. local build + Wrangler Direct Upload/manual preview;
3. Git commit with Build Watch exclusion or `[CF-Pages-Skip]` when no deployment is intended;
4. hosted Git-integrated Preview/Production build only at the explicit deployment boundary.

If Pages Functions, Workers, SSR, server-side APIs, KV/D1/R2 or other dynamic execution are introduced, revisit both the cost model and this architecture.

## Repository-local validation gate

The repository's deterministic deployment validation remains:

```text
npm run verify:deploy
npm run build
```

The exact scripts may evolve in `package.json`; treat the repository scripts as executable truth.

The important distinction is that the same deterministic checks should be run **locally first** for normal iteration. A Cloudflare hosted build is not required merely to execute repository-local validation.

Keep, but do not automatically add to every hosted build without a deliberate reliability decision:

- full Chromium/WebKit Playwright E2E from `tests/e2e/`;
- vendor-catalog network audits;
- URL/source-health network probes;
- monitoring/reporting tasks whose success depends on third parties.

Run those on demand for major UI, routing/i18n, Astro/framework, browser compatibility, or data-source maintenance work.

## GitHub Actions policy

GitHub Actions is intentionally retired. The target repository state is zero workflow files.

Do not add a manual workflow "just in case." Tests and scripts are platform-independent repository assets and must not be deleted merely because Actions is not used.

## GitHub Pages policy

GitHub Pages is intentionally retired. Cloudflare Production is the only maintained deployment semantics.

Therefore:

- deployment base is `/`;
- `/basemodel/` compatibility is not a release requirement;
- no GitHub Pages deployment workflow is maintained;
- no GitHub Pages-specific `PUBLIC_BASE_PATH` or `PUBLIC_CANONICAL_SITE_URL` is maintained.

## SEO and Preview identity

Cloudflare Production is indexable by default and owns canonical, hreflang, OG, JSON-LD, robots and sitemap identity.

Any public preview created through Wrangler/manual deployment must remain a **preview**, not a competing canonical identity. Preserve preview `noindex` behavior and verify the generated preview URL rather than assuming production SEO configuration applies automatically.

For Production, an explicit `PUBLIC_SITE_URL` can define a future custom domain. Without one, the stable `https://basemodel.pages.dev` alias remains the production identity.

## Dependency policy

Dependabot keeps npm updates only. There is no `github-actions` ecosystem after Actions retirement.

Low-risk development dependency minor/patch updates may be grouped; runtime/framework/compiler/test-runner major upgrades are deliberate migration work.

## Normal change workflow

Default website change:

```text
1. Read current main and current Agent docs.
2. Make the complete coherent change.
3. Run local deterministic checks/build.
4. If a public preview is useful, upload the prebuilt dist/ with Wrangler to a preview branch.
5. Inspect the public preview for UI/routing/SEO changes.
6. Report completion, the preview URL, and whether Pages Build was triggered.
7. Commit/PR using no-build Git semantics when formal Git-integrated deployment was not requested.
```

Formal Git-integrated deployment, **only when explicitly requested**:

```text
1. Warn that the next Git operation may consume a Pages Build.
2. Batch/finalize the exact deployable change.
3. Intentionally allow the Git-integrated Preview/Production build.
4. Verify the exact commit/deployment result.
5. Report the hosted build/deployment status explicitly.
```

Do not make Actions runner availability or GitHub Pages deployment state part of acceptance.
