# Agent documentation

This directory contains operational documentation intended primarily for coding and maintenance agents working on this repository.

Before changing deployment, CI, hosting, URL/base-path behavior, SEO output, or repository automation, read in this order:

1. [`dual-hosting-policy.md`](./dual-hosting-policy.md) — authoritative steady-state hosting policy. GitHub Pages + Cloudflare Pages are intended to coexist long-term; GitHub remains the canonical source repository.
2. [`cloudflare-pages-deployment.md`](./cloudflare-pages-deployment.md) — detailed Cloudflare Pages migration/runbook, GitHub Actions quota fallback, validation responsibilities, rollback, and implementation notes.

If migration-era wording in the Cloudflare runbook conflicts with the steady-state dual-hosting policy, `dual-hosting-policy.md` takes precedence unless the repository owner explicitly changes that policy.

Migration status (2026-08-09): the initial Cloudflare Pages production bootstrap from `main` succeeded at `https://basemodel.pages.dev/`, and the migration branch Preview succeeded and rendered correctly from the Cloudflare root path. The remaining steps are to merge the migration PR, verify the new `main` production deployment, and switch the Cloudflare dashboard build command to the repository-owned `npm run build:cloudflare` entrypoint. The GitHub Pages deployment is intentionally retained as the second public site.

Repository-level agent entrypoint: [`/AGENTS.md`](../../AGENTS.md).

Human-facing product/data documentation remains in the normal `docs/` tree and `README.md`; this directory is specifically for implementation and operations context that future agents should not have to rediscover from chat history.
