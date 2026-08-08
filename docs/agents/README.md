# Agent documentation

This directory contains operational documentation intended primarily for coding and maintenance agents working on this repository.

Before changing deployment, CI, hosting, URL/base-path behavior, SEO output, repository automation, dependency automation, or Copilot review policy, read in this order:

1. [`dual-hosting-policy.md`](./dual-hosting-policy.md) — authoritative steady-state hosting policy. GitHub Pages + Cloudflare Pages coexist long-term; GitHub remains the canonical source repository; Cloudflare Production is the indexed identity and GitHub Pages is the noindex fallback.
2. [`cloudflare-pages-deployment.md`](./cloudflare-pages-deployment.md) — current operational runbook for Cloudflare build/deploy, Preview behavior, stable production URLs, search indexing, GitHub Actions quota fallback, rollback, and cost controls.
3. [`2026-08-08-github-actions-ci-optimization-history.md`](./2026-08-08-github-actions-ci-optimization-history.md) — CI optimization/hardening history before the quota incident: static/E2E parallelization, Playwright caching and failed worker experiment, external-network audit separation, Node runtime warning removal, immutable Action SHA pinning, classifier/gate hardening, and tradeoffs.
4. [`2026-08-09-cloudflare-migration-retrospective.md`](./2026-08-09-cloudflare-migration-retrospective.md) — complete migration/incident history, including what succeeded, what failed, tool limitations, quota diagnosis, PR acceptance sequence, cost mistakes, and lessons for future agents.
5. [`2026-08-09-post-migration-second-audit.md`](./2026-08-09-post-migration-second-audit.md) — follow-up audit after the system was live: actual Copilot Code review settings, repository-vs-account automatic review diagnosis, Copilot Actions billing, Dependabot grouping, Node runtime/type drift protection, remaining major-upgrade PR policy, and refreshed Cloudflare limits.

If historical/migration wording conflicts with `dual-hosting-policy.md`, the dual-hosting policy takes precedence unless the repository owner explicitly changes that policy.

Deployment status (2026-08-09): Cloudflare Pages Preview and Production are verified, the dashboard Build command is the repository-owned `npm run build:cloudflare`, PR #36 proved that command in Preview, and merged `main` commit `fcc872a` was confirmed green in Production. Post-acceptance hardening stabilized Cloudflare canonical identity and made GitHub Pages a public noindex fallback. Low-risk npm maintenance is grouped and validated through Cloudflare Preview; runtime-major dependency drift is treated as a deliberate migration, not routine maintenance.

Repository-level Agent entrypoint: [`/AGENTS.md`](../../AGENTS.md).

Human-facing project/data instructions remain in the normal `docs/` tree and `README.md`; this directory is specifically for implementation and operations context that future agents should not have to rediscover from chat history.
