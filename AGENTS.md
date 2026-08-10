# Repository agent instructions

This repository is frequently maintained by coding agents through GitHub without requiring a local clone. Agents should prefer autonomous execution through available repository/deployment tools and avoid making the owner relay information between services.

## Fast start

Before making non-trivial changes, read in this order:

1. [`docs/agents/LATEST.md`](docs/agents/LATEST.md) — fixed timestamped handoff and current state.
2. [`docs/agents/current/product-and-research-integrity.md`](docs/agents/current/product-and-research-integrity.md) — durable product north star, research-integrity invariants and false-complete acceptance rules.
3. [`docs/agents/current/model-catalog-verification-policy.md`](docs/agents/current/model-catalog-verification-policy.md) — required before broad current-model/family audits, vendor-catalog refreshes or changes to model evidence semantics.
4. [`docs/agents/current/direct-upload-preview-policy.md`](docs/agents/current/direct-upload-preview-policy.md) — **default preview/release behavior and Cloudflare Pages build-budget rule**.
5. [`docs/agents/current/deployment-policy.md`](docs/agents/current/deployment-policy.md) — Git-integrated production architecture, build gate and validation policy.
6. [`docs/agents/current/repository-map.md`](docs/agents/current/repository-map.md) — fast map of ownership boundaries and change-to-check guidance.
7. [`docs/agents/current/cloudflare-pages-deployment.md`](docs/agents/current/cloudflare-pages-deployment.md) — formal Cloudflare production/rollback runbook.
8. [`package.json`](package.json) — executable validation/build/audit commands.
9. [`README.md`](README.md) — product/data model and human-facing project guidance.

Historical migration/incident material now lives under `docs/agents/history/`. It is evidence of what happened, not instructions to restore previous architecture.

## Current repository layout

```text
src/                         production application/content/domain logic
public/                      production static assets
scripts/                     build, validation, audit and maintenance tooling
tests/e2e/                   Playwright browser regression tests
tests/fixtures/demo-archive/ non-production demo fixtures
docs/agents/current/         authoritative current Agent policy/runbooks/maps
docs/agents/history/         migration and superseded architecture records
docs/agents/LATEST.md        stable latest handoff
```

Do not move `src/`, `public/`, `scripts/`, dependency manifests or build configuration merely for visual uniformity.

## Current architecture

```text
GitHub -> Cloudflare Pages
```

- GitHub is the canonical source repository, Git history, branch/PR surface, and Dependabot host.
- Cloudflare Pages remains the Production host and supports Preview deployments.
- GitHub Actions is intentionally retired. `.github/workflows/` should remain empty/absent unless the repository owner explicitly decides to reintroduce an automated CI platform.
- GitHub Pages is intentionally retired. Do not restore `/basemodel/` deployment compatibility merely because historical documents mention it.
- Cloudflare Production serves from `/` and is the canonical/indexed identity.
- Cloudflare Preview deployments are `noindex`; `noindex` is not access control.
- The formal Git-integrated Cloudflare Build command is `npm run build:cloudflare`; keep real build logic in the repository.

## Default preview and release behavior

The owner's current priority is to conserve Cloudflare Pages Builds.

For ordinary website changes, the default workflow is **not** “push a branch and let Cloudflare build it.” Instead:

```text
edit -> repository-local build/validation -> Direct Upload preview -> public preview verification -> report
```

Use `docs/agents/current/direct-upload-preview-policy.md` as the authoritative day-to-day preview policy.

Key rules:

- default to a local/agent-side production build plus Wrangler Direct Upload to a unique non-production preview branch;
- give the owner the newly created public preview URL after upload;
- Direct Upload uses prebuilt assets and avoids the Git-connected Cloudflare build step, but it still creates a Pages deployment and is not “quota free” in the broad sense;
- if source/documentation is synchronized to GitHub without a formal deployment request, use a Cloudflare-supported skip prefix such as `[Skip CI]` so the commit does not intentionally consume a Pages Build;
- only trigger the normal Git-connected Preview/Production path when the owner explicitly asks for a formal Git-integrated deployment/production release;
- before intentionally triggering such a build, warn that the operation may consume a Cloudflare Pages Build and state which environment(s) are expected to build;
- if build/upload/auth/quota evidence is unavailable, report that honestly instead of claiming the path was safe or complete.

## Cloudflare quota model

Do not tell the owner that the Cloudflare Pages build quota is irrelevant merely because this is a static site.

Cloudflare documents a separate Git-build budget and static-request model. The practical distinction for this project is:

```text
normal visitor traffic to static assets != Git build consumption
Git push that triggers Pages Preview/Production = Pages Build consumption
local build + Wrangler Direct Upload = prebuilt deployment, not a Git-connected Pages Build
```

Direct Upload still has platform/deployment/file limits. Re-check current Cloudflare documentation before cost/limit decisions because limits can change.

To protect the build budget:

- build and validate locally/agent-side first;
- use Direct Upload for ordinary public previews;
- batch related edits before Git synchronization;
- avoid empty, no-op and speculative push loops;
- use Cloudflare-supported skip commit prefixes when a Git commit should not deploy;
- reserve real Git-integrated Preview/Production builds for an explicit formal deployment boundary;
- use Build Watch Paths so docs, Agent files, generated reports, browser-only tests and fixtures do not consume builds unnecessarily.

If Pages Functions, Workers, SSR, APIs or other dynamic execution are introduced, revisit the cost and deployment model instead of assuming static-site rules still apply.

## Validation rules

Cloudflare automated blocking checks must stay deterministic and repository-local. The formal deployment gate is `npm run verify:deploy`, followed by `npm run build`.

The same repository-owned checks should be run locally before a Direct Upload preview when they are relevant to the change.

Keep, but do not automatically add to every Cloudflare build without a deliberate reliability decision:

- full Chromium/WebKit Playwright E2E from `tests/e2e/`;
- vendor-catalog network audits;
- URL/source-health network probes;
- monitoring/reporting tasks whose success depends on third parties.

Run those on demand for major UI, routing/i18n, Astro/framework, browser compatibility, or data-source maintenance work.

## Normal agent workflow

For ordinary non-trivial website work, use this default flow:

```text
1. Read current main + docs/agents/LATEST.md + current Agent docs.
2. Inspect the relevant code/data/tests before editing.
3. Batch the requested work into a focused diff.
4. Run repository-local validation and a production build locally/agent-side.
5. Direct Upload the built output to a unique non-production Cloudflare preview branch.
6. Capture the new public Preview URL and inspect it when UI/routing/SEO behavior changed.
7. Synchronize source to GitHub with a skip-build commit/PR strategy unless a formal Git deployment was explicitly requested.
8. Explicitly report: completed/not completed, local build result, Preview URL, whether Cloudflare Pages Build was triggered, Git synchronization status, and Production status.
```

For an **explicit formal Git-integrated deployment**, follow `deployment-policy.md` and `cloudflare-pages-deployment.md`, warn about expected Pages Build consumption first, then verify the exact Preview/Production deployment and commit.

Do not make GitHub Actions status or GitHub Pages deployment state part of acceptance.

## Collaboration expectations

The owner prefers high-autonomy execution.

- Use connected GitHub/Cloudflare/repository evidence directly when available.
- Do not ask the owner to copy logs, screenshots, file contents, URLs or status between tools if the agent can retrieve them itself.
- If one tool path fails, try another available read/write/search route before requesting human intervention.
- Keep the owner out of routine implementation loops; report meaningful milestones/results instead of asking permission for each low-risk step.
- Human intervention is appropriate for genuine account/permission boundaries such as login/authorization, 2FA/CAPTCHA, unavailable dashboard admin settings, billing, or high-risk/irreversible decisions.
- Do not require a local Agent merely to repeat validation that can already be performed with repository/Cloudflare evidence; use a local environment only when the task truly requires capabilities unavailable through connected tools.

## Operating rules

- Prefer branch + pull request for non-trivial source changes when it does not create unnecessary deployment side effects; a documentation-only policy sync may use a skip-build direct commit when that is the safer build-budget choice.
- For an explicit deployment-sensitive Git-integrated release, verify the exact Cloudflare Preview/Production deployment and commit.
- For ordinary previews, prefer Direct Upload and verify the returned public URL instead of spending a Git build.
- Read the Cloudflare GitHub App PR comment before asking the owner for dashboard screenshots when a Git-integrated deployment is actually used; compare any reported commit with the actual PR head SHA because comments can arrive out of order.
- Preserve Preview `noindex`, stable Production canonical identity, sitemap/robots correctness, bilingual hreflang, OG/JSON-LD identity, and root-relative routing.
- Preserve the product/research-integrity rules in `docs/agents/current/product-and-research-integrity.md`: unknown must stay unknown, evidence must not be fabricated, and “done” requires wiring into the real user path rather than component/file existence.
- Preserve the model-catalog rules in `docs/agents/current/model-catalog-verification-policy.md`: re-check first-party sources for current/latest/full-family claims, distinguish hosted/API from open-weight/base/research checkpoints, and use precise semantic unknowns instead of guesses.
- Do not reintroduce `PUBLIC_BASE_PATH`, `PUBLIC_CANONICAL_SITE_URL`, GitHub Pages workflows, Actions runner containers, required Actions checks, or `github-actions` Dependabot updates without an explicit owner decision.
- Keep `@types/node` on the same major as `.node-version`; Node, Astro, React, TypeScript, Vitest and Playwright major upgrades are deliberate migration work rather than routine churn.
- Batch related GitHub edits. Avoid no-op commits because every normal non-skip branch push may consume a Cloudflare Pages Build.
- Fetch the latest blob/ref state before sequential writes to avoid conflict-generated commits.
- Keep Astro 7 `compressHTML: true` unless inline whitespace has been explicitly audited and migrated; a regression test protects this compatibility contract.
- Update `docs/agents/LATEST.md` plus the relevant file under `docs/agents/current/` when architecture, repository ownership boundaries, product/research-integrity boundaries, quota assumptions or validation boundaries change materially.

Human-facing project/data instructions remain in `README.md` and the rest of `docs/`.
