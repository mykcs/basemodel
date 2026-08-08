# Repository agent instructions

This repository is frequently maintained by coding agents through GitHub without requiring a local clone.

## Required reading

Before changing hosting, CI, deployment, URL/base-path behavior, SEO deployment output, repository automation, dependency automation, or Copilot review policy, read these in order:

1. [`docs/agents/dual-hosting-policy.md`](docs/agents/dual-hosting-policy.md) — authoritative steady-state policy. The intended architecture is long-term GitHub Pages + Cloudflare Pages dual hosting.
2. [`docs/agents/cloudflare-pages-deployment.md`](docs/agents/cloudflare-pages-deployment.md) — current operational runbook for Cloudflare/GitHub Pages behavior.
3. [`docs/agents/2026-08-08-github-actions-ci-optimization-history.md`](docs/agents/2026-08-08-github-actions-ci-optimization-history.md) — CI optimization/hardening history that preceded the quota incident, including successful changes, failed experiments, security boundaries, and cost/latency tradeoffs.
4. [`docs/agents/2026-08-09-cloudflare-migration-retrospective.md`](docs/agents/2026-08-09-cloudflare-migration-retrospective.md) — full incident/migration history, successful and failed experiments, tool limitations, quota diagnosis, final workflow, and lessons.
5. [`docs/agents/2026-08-09-post-migration-second-audit.md`](docs/agents/2026-08-09-post-migration-second-audit.md) — follow-up audit covering actual Copilot settings, account-vs-repository automatic review, review billing, Dependabot grouping, Node runtime/type alignment, remaining major upgrades, and refreshed Cloudflare limits.

If historical migration wording conflicts with the dual-hosting policy, `dual-hosting-policy.md` takes precedence unless the repository owner explicitly requests a different hosting strategy.

Agent-oriented documentation index:

- [`docs/agents/README.md`](docs/agents/README.md)

## Operating rules

- GitHub is the canonical source repository.
- Preserve both Cloudflare Pages and GitHub Pages as public deployment paths unless the owner explicitly requests otherwise.
- Cloudflare serves from `/`; GitHub Pages serves from `/basemodel/`. Preserve this base-path contract.
- Cloudflare Production is the indexed/canonical provider identity; GitHub Pages is a public `noindex` fallback unless the owner explicitly changes the SEO policy.
- Cloudflare Preview deployments are `noindex`. Do not use robots crawling blocks as a substitute for noindex or authentication.
- The Cloudflare dashboard Build command is `npm run build:cloudflare`; keep build logic in the repository.
- Cloudflare Preview and Production deployment were fully accepted on 2026-08-09, including a Preview using the repository-owned build command and merged Production commit `fcc872a`. Do not redo bootstrap setup unless current state proves it is necessary.
- Prefer branch + pull request for non-trivial changes; do not silently direct-push `main`.
- Read Cloudflare's GitHub bot PR comment/status before asking the owner for deployment screenshots; the integration reports Preview success and URLs directly on PRs.
- Do not treat a GitHub Actions job that fails before step 1 because hosted-runner capacity/allowance is unavailable as an application test failure.
- Do not repeatedly retry zero-step GitHub Actions jobs once billing/quota is confirmed.
- Do not disable an existing production deployment path merely because the other host is healthy.
- Preserve the distinction between deterministic deployment-blocking checks and expensive/external-network audits.
- When changing deployment hosts or canonical URLs, verify `base`, sitemap, robots, canonical metadata, assets, and bilingual routes.
- Batch related GitHub edits. Avoid no-op or wording-only commit churn because every normal branch push can consume a Cloudflare Pages build.
- Fetch the latest blob SHA before sequential GitHub file updates to avoid 409 conflicts and retry-generated commits.
- Cloudflare skip-build commit prefixes may be used only for true non-deploy changes and only when a missing Cloudflare status cannot violate current branch/ruleset policy.
- The repository currently has no Copilot review ruleset. Do not tell the owner to change `Review new pushes` unless a ruleset actually exists.
- Copilot code review on a private repository consumes GitHub Actions minutes as well as AI credits. Prefer manual review requests while Actions allowance is constrained.
- Repository-level Copilot MCP access should remain off unless a concrete task justifies the extra permissions and the security impact has been reviewed.
- Keep `@types/node` on the same major as `.node-version`; cross-major Node type updates belong in an explicit runtime migration PR.
- Low-risk development dependency minor/patch updates may be grouped and merged after a green Cloudflare Preview; major tool/runtime upgrades remain deliberate review items.
- Update the relevant file in `docs/agents/` when operational architecture or automation policy changes materially.

Human-facing project/data instructions remain in `README.md` and the rest of `docs/`.
