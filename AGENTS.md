# Repository agent instructions

This repository is frequently maintained by coding agents through GitHub without requiring a local clone. Agents should prefer autonomous execution through available repository/deployment tools and avoid making the owner relay information between services.

## Fast start

Before making non-trivial changes, read in this order:

1. [`docs/agents/LATEST.md`](docs/agents/LATEST.md) — fixed timestamped handoff and current state.
2. [`docs/agents/current/product-and-research-integrity.md`](docs/agents/current/product-and-research-integrity.md) — durable product north star, research-integrity invariants and false-complete acceptance rules.
3. [`docs/agents/current/model-catalog-verification-policy.md`](docs/agents/current/model-catalog-verification-policy.md) — required before broad current-model/family audits, vendor-catalog refreshes or changes to model evidence semantics.
4. [`docs/agents/current/deployment-policy.md`](docs/agents/current/deployment-policy.md) — authoritative steady-state architecture, build-budget and validation policy.
5. [`docs/agents/current/repository-map.md`](docs/agents/current/repository-map.md) — fast map of ownership boundaries and change-to-check guidance.
6. [`docs/agents/current/cloudflare-pages-deployment.md`](docs/agents/current/cloudflare-pages-deployment.md) — current Cloudflare operational runbook.
7. [`package.json`](package.json) — executable validation/build/audit commands.
8. [`README.md`](README.md) — product/data model and human-facing project guidance.

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
- Cloudflare Pages owns Preview, Production, build execution, deployment-blocking validation, and hosting.
- GitHub Actions is intentionally retired. `.github/workflows/` should remain empty/absent unless the repository owner explicitly decides to reintroduce an automated CI platform.
- GitHub Pages is intentionally retired. Do not restore `/basemodel/` deployment compatibility merely because historical documents mention it.
- Cloudflare Production serves from `/` and is the canonical/indexed identity.
- Cloudflare Preview deployments are `noindex`; `noindex` is not access control.
- The Cloudflare dashboard Build command is `npm run build:cloudflare`; keep real build logic in the repository.

## Cloudflare quota model

Do not tell the owner that the Cloudflare Pages build quota is irrelevant merely because this is a static site.

As of 2026-08-09, Cloudflare Pages Free documents 500 builds per month, one concurrent build and a 20-minute build timeout. Static asset requests that do not invoke Pages Functions are free and unlimited. The practical distinction is:

```text
normal visitor traffic to static assets != build consumption
Git push that triggers Pages Preview/Production = build consumption
```

The current official sources are linked from `docs/agents/current/deployment-policy.md` and the Cloudflare runbook. Re-check Cloudflare documentation before future cost/limit decisions because plan limits can change.

To protect the build budget:

- batch related edits before pushing;
- avoid empty, no-op and speculative push loops;
- use Cloudflare-supported `[CF-Pages-Skip]` only for intermediate commits that intentionally do not require a deployment;
- ensure the final deployment-sensitive PR head receives a real Cloudflare Preview build;
- use Build Watch Paths so docs, Agent files, generated reports, browser-only tests and fixtures do not consume builds unnecessarily.

If Pages Functions, Workers, SSR, APIs or other dynamic execution are introduced, revisit the cost and deployment model instead of assuming static-site rules still apply.

## Validation rules

Cloudflare automated blocking checks must stay deterministic and repository-local. The current deployment gate is `npm run verify:deploy`, followed by `npm run build`.

Keep, but do not automatically add to every Cloudflare build without a deliberate reliability decision:

- full Chromium/WebKit Playwright E2E from `tests/e2e/`;
- vendor-catalog network audits;
- URL/source-health network probes;
- monitoring/reporting tasks whose success depends on third parties.

Run those on demand for major UI, routing/i18n, Astro/framework, browser compatibility, or data-source maintenance work.

## Normal agent workflow

For non-trivial work, use this default flow:

```text
1. Read current main + docs/agents/LATEST.md + current Agent docs.
2. Create agent/<description> from current main.
3. Inspect the relevant code/data/tests before editing.
4. Batch the requested work into a focused diff.
5. Run the relevant repository-local validation.
6. Open a PR.
7. Confirm Cloudflare Preview succeeded for the exact final PR head SHA when deployment-sensitive.
8. Inspect Preview visually when UI/routing/SEO behavior changed.
9. Merge to main.
10. Confirm Production deployment/public behavior for deployment-sensitive work.
```

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

- Prefer branch + pull request for non-trivial changes; do not silently direct-push `main`.
- For deployment-sensitive PRs, verify the Cloudflare Preview for the exact PR head SHA before merge, then verify Production after merge.
- Read the Cloudflare GitHub App PR comment before asking the owner for dashboard screenshots; compare any reported commit with the actual PR head SHA because comments can arrive out of order.
- Preserve Preview `noindex`, stable Production canonical identity, sitemap/robots correctness, bilingual hreflang, OG/JSON-LD identity, and root-relative routing.
- Preserve the product/research-integrity rules in `docs/agents/current/product-and-research-integrity.md`: unknown must stay unknown, evidence must not be fabricated, and “done” requires wiring into the real user path rather than component/file existence.
- Preserve the model-catalog rules in `docs/agents/current/model-catalog-verification-policy.md`: re-check first-party sources for current/latest/full-family claims, distinguish hosted/API from open-weight/base/research checkpoints, and use precise semantic unknowns instead of guesses.
- Do not reintroduce `PUBLIC_BASE_PATH`, `PUBLIC_CANONICAL_SITE_URL`, GitHub Pages workflows, Actions runner containers, required Actions checks, or `github-actions` Dependabot updates without an explicit owner decision.
- Keep `@types/node` on the same major as `.node-version`; Node, Astro, React, TypeScript, Vitest and Playwright major upgrades are deliberate migration work rather than routine churn.
- Batch related GitHub edits. Avoid no-op commits because every normal branch push may consume a Cloudflare Pages build.
- Fetch the latest blob/ref state before sequential writes to avoid conflict-generated commits.
- Keep Astro 7 `compressHTML: true` unless inline whitespace has been explicitly audited and migrated; a regression test protects this compatibility contract.
- Update `docs/agents/LATEST.md` plus the relevant file under `docs/agents/current/` when architecture, repository ownership boundaries, product/research-integrity boundaries, quota assumptions or validation boundaries change materially.

Human-facing project/data instructions remain in `README.md` and the rest of `docs/`.
