# Repository agent instructions

This repository is frequently maintained by coding agents through GitHub without requiring a local clone.

## Required reading

Before changing hosting, CI, deployment, URL/base-path behavior, SEO deployment output, or repository automation, read these in order:

1. [`docs/agents/dual-hosting-policy.md`](docs/agents/dual-hosting-policy.md) — authoritative steady-state policy. The intended architecture is long-term GitHub Pages + Cloudflare Pages dual hosting.
2. [`docs/agents/cloudflare-pages-deployment.md`](docs/agents/cloudflare-pages-deployment.md) — detailed Cloudflare migration/runbook and implementation notes.

If migration-era wording in the Cloudflare runbook suggests retiring GitHub Pages, the dual-hosting policy takes precedence unless the repository owner explicitly requests a different hosting strategy.

Agent-oriented documentation index:

- [`docs/agents/README.md`](docs/agents/README.md)

## Operating rules

- GitHub is the canonical source repository.
- Preserve both Cloudflare Pages and GitHub Pages as public deployment paths unless the owner explicitly requests otherwise.
- Cloudflare serves from `/`; GitHub Pages serves from `/basemodel/`. Preserve this base-path contract.
- Cloudflare production bootstrap and migration-branch Preview were verified successfully on 2026-08-09; do not redo bootstrap setup unless current state shows it is necessary.
- Prefer branch + pull request for non-trivial changes; do not silently direct-push `main`.
- Do not treat a GitHub Actions job that fails before step 1 because hosted-runner capacity/allowance is unavailable as an application test failure.
- Do not disable an existing production deployment path merely because the other host is healthy.
- Keep deployment build logic reproducible in the repository rather than only in a provider dashboard.
- Preserve the distinction between deterministic deployment-blocking checks and expensive/external-network audits.
- When changing deployment hosts or canonical URLs, verify `base`, sitemap, robots, canonical metadata, assets, and bilingual routes.
- Update the relevant file in `docs/agents/` when operational architecture changes materially.

Human-facing project/data instructions remain in `README.md` and the rest of `docs/`.
