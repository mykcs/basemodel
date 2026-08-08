# Agent documentation

This directory contains operational documentation intended primarily for coding and maintenance agents working on this repository.

Before changing deployment, CI, hosting, URL/base-path behavior, SEO output, or repository automation, read in this order:

1. [`dual-hosting-policy.md`](./dual-hosting-policy.md) — authoritative steady-state hosting policy. GitHub Pages + Cloudflare Pages are intended to coexist long-term; GitHub remains the canonical source repository.
2. [`cloudflare-pages-deployment.md`](./cloudflare-pages-deployment.md) — detailed Cloudflare Pages migration/runbook, GitHub Actions quota fallback, validation responsibilities, rollback, and implementation notes.

If migration-era wording in the Cloudflare runbook conflicts with the steady-state dual-hosting policy, `dual-hosting-policy.md` takes precedence unless the repository owner explicitly changes that policy.

Deployment status (2026-08-09): Cloudflare Pages production deployment from merged `main` commit `a4b619f` succeeded, the dashboard Build command has been switched to the repository-owned `npm run build:cloudflare` entrypoint, and this follow-up branch exists solely to verify that the simplified command can still produce an automatic Preview deployment before the dual-hosting migration is considered fully accepted. GitHub Pages remains intentionally retained as the second public site.

Repository-level agent entrypoint: [`/AGENTS.md`](../../AGENTS.md).

Human-facing project/data instructions remain in the normal `docs/` tree and `README.md`; this directory is specifically for implementation and operations context that future agents should not have to rediscover from chat history.
