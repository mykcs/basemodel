# Agent documentation

This directory contains operational documentation intended primarily for coding and maintenance agents working on this repository.

Before changing deployment, CI, hosting, URL/base-path behavior, SEO output, or repository automation, read:

- [`cloudflare-pages-deployment.md`](./cloudflare-pages-deployment.md) — hosting architecture, Cloudflare Pages migration/runbook, GitHub Actions quota fallback, validation responsibilities, rollback, and agent rules.

Migration status (2026-08-09): the initial Cloudflare Pages production bootstrap from `main` succeeded at `https://basemodel.pages.dev/`. The active migration PR must still prove branch/PR Preview deployment and post-migration root-path/SEO behavior before the legacy GitHub Pages fallback is retired.

Repository-level agent entrypoint: [`/AGENTS.md`](../../AGENTS.md).

Human-facing product/data documentation remains in the normal `docs/` tree and `README.md`; this directory is specifically for implementation and operations context that future agents should not have to rediscover from chat history.
