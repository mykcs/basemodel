# Repository agent instructions

This repository is frequently maintained by coding agents through GitHub without requiring a local clone.

## Required reading

Before changing hosting, CI, deployment, URL/base-path behavior, SEO deployment output, repository automation, dependency automation, or Copilot review policy, read these in order:

1. [`docs/agents/dual-hosting-policy.md`](docs/agents/dual-hosting-policy.md) — authoritative steady-state policy. The intended architecture is long-term GitHub Pages + Cloudflare Pages dual hosting.
2. [`docs/agents/cloudflare-pages-deployment.md`](docs/agents/cloudflare-pages-deployment.md) — current operational runbook for Cloudflare/GitHub Pages behavior.
3. [`docs/agents/2026-08-08-github-actions-ci-optimization-history.md`](docs/agents/2026-08-08-github-actions-ci-optimization-history.md) — CI optimization/hardening history that preceded the quota incident, including successful changes, failed experiments, security boundaries, and cost/latency tradeoffs.
4. [`docs/agents/2026-08-09-cloudflare-migration-retrospective.md`](docs/agents/2026-08-09-cloudflare-migration-retrospective.md) — full incident/migration history, successful and failed experiments, tool limitations, quota diagnosis, final workflow, and lessons.
5. [`docs/agents/2026-08-09-post-migration-second-audit.md`](docs/agents/2026-08-09-post-migration-second-audit.md) — follow-up audit covering actual Copilot settings, account-vs-repository automatic review, review billing, Dependabot grouping, Node runtime/type alignment, and major-update churn.
6. [`docs/agents/2026-08-09-final-hardening-addendum.md`](docs/agents/2026-08-09-final-hardening-addendum.md) — final hardening findings: Cloudflare status ordering, Astro 7 whitespace, public Preview access, `main` branch protection, and provider-only build skipping.
7. [`docs/agents/2026-08-09-actions-cost-after-cloudflare.md`](docs/agents/2026-08-09-actions-cost-after-cloudflare.md) — post-Cloudflare Actions cost model: normal PR and `main` pushes are change-aware; scheduled/manual regressions remain full.

If historical migration wording conflicts with the dual-hosting policy, `dual-hosting-policy.md` takes precedence unless the repository owner explicitly requests a different hosting strategy.

Agent-oriented documentation index:

- [`docs/agents/README.md`](docs/agents/README.md)

## Operating rules

- GitHub is the canonical source repository.
- Preserve both Cloudflare Pages and GitHub Pages as public deployment paths unless the owner explicitly requests otherwise.
- Cloudflare serves from `/`; GitHub Pages serves from `/basemodel/`. Preserve this base-path contract.
- Cloudflare Production is the indexed/canonical provider identity; GitHub Pages is a public `noindex` fallback unless the owner explicitly changes the SEO policy.
- Cloudflare Preview deployments are `noindex`, but `noindex` is not access control. Preview URLs are public by default unless Cloudflare Access is enabled.
- The Cloudflare dashboard Build command is `npm run build:cloudflare`; keep build logic in the repository.
- Prefer branch + pull request for non-trivial changes; do not silently direct-push `main`.
- The repository currently has no GitHub ruleset. A minimal `main` protection ruleset is recommended and documented in the final hardening addendum, but do not invent required status checks while Actions allowance is unavailable or while `[CF-Pages-Skip]` is part of the workflow.
- Read Cloudflare's GitHub bot PR comment before asking the owner for deployment screenshots, but always compare the comment's `Latest commit` to the actual PR head SHA. Build completion order can overwrite the comment with an older commit's result.
- Do not treat a GitHub Actions job that fails before step 1 because hosted-runner capacity/allowance is unavailable as an application test failure.
- Do not repeatedly retry zero-step GitHub Actions jobs once billing/quota is confirmed.
- Normal pull requests and normal `main` pushes use the same conservative docs/data/full changed-path tiers; manual and weekly scheduled validation stay full. If a push range cannot be classified safely, fail safe to full.
- Do not disable an existing production deployment path merely because the other host is healthy.
- Preserve the distinction between deterministic deployment-blocking checks and expensive/external-network audits.
- When changing deployment hosts or canonical URLs, verify `base`, sitemap, robots, canonical metadata, assets, and bilingual routes.
- Batch related GitHub edits. Avoid no-op or wording-only commit churn because every normal branch push can consume a Cloudflare Pages build.
- Fetch the latest blob SHA before sequential GitHub file updates to avoid 409 conflicts and retry-generated commits.
- Cloudflare skip-build commit prefixes may be used only for true non-deploy changes and only when a missing Cloudflare status cannot violate current branch/ruleset policy.
- GitHub Actions Dependabot commits intentionally begin with `[CF-Pages-Skip]` because Action implementation changes do not change the Cloudflare-built site and cannot be validated by a Pages build.
- The repository currently has no Copilot review ruleset. Do not tell the owner to change `Review new pushes` unless a ruleset actually exists.
- Copilot code review on a private repository consumes GitHub Actions minutes as well as AI credits. Prefer manual review requests while Actions allowance is constrained.
- Repository-level Copilot MCP access should remain off unless a concrete task justifies the extra permissions and the security impact has been reviewed.
- Keep `@types/node` on the same major as `.node-version`; cross-major Node type updates belong in an explicit runtime migration PR.
- Low-risk development dependency minor/patch updates may be grouped and merged after a green Cloudflare Preview; major runtime/compiler/test-runner upgrades are deliberate migration work.
- Astro 7 must keep `compressHTML: true` unless inline whitespace has been explicitly audited and migrated; a regression test protects this compatibility contract.
- Update the relevant file in `docs/agents/` when operational architecture or automation policy changes materially.

Human-facing project/data instructions remain in `README.md` and the rest of `docs/`.
