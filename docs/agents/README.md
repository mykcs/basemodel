# Agent documentation

This directory contains operational documentation intended primarily for coding and maintenance agents working on this repository.

Before changing deployment, CI, hosting, URL/base-path behavior, SEO output, or repository automation, read in this order:

1. [`dual-hosting-policy.md`](./dual-hosting-policy.md) — authoritative steady-state hosting policy. GitHub Pages + Cloudflare Pages coexist long-term; GitHub remains the canonical source repository; Cloudflare Production is the indexed identity and GitHub Pages is the noindex fallback.
2. [`cloudflare-pages-deployment.md`](./cloudflare-pages-deployment.md) — current operational runbook for Cloudflare build/deploy, Preview behavior, stable production URLs, search indexing, GitHub Actions quota fallback, rollback, and cost controls.
3. [`2026-08-09-cloudflare-migration-retrospective.md`](./2026-08-09-cloudflare-migration-retrospective.md) — complete migration/incident history, including what succeeded, what failed, tool limitations, quota diagnosis, PR acceptance sequence, cost mistakes, and lessons for future agents.

If historical/migration wording conflicts with `dual-hosting-policy.md`, the dual-hosting policy takes precedence unless the repository owner explicitly changes that policy.

Deployment status (2026-08-09): Cloudflare Pages Preview and Production are verified, the dashboard Build command is the repository-owned `npm run build:cloudflare`, PR #36 proved that command in Preview, and merged `main` commit `fcc872a` was confirmed green in Production. GitHub Pages remains intentionally retained as the second public endpoint. Post-acceptance hardening fixes stable Cloudflare production identity and keeps GitHub Pages public but non-indexed to avoid duplicate-content SEO competition.

Repository-level agent entrypoint: [`/AGENTS.md`](../../AGENTS.md).

Human-facing project/data instructions remain in the normal `docs/` tree and `README.md`; this directory is specifically for implementation and operations context that future agents should not have to rediscover from chat history.
