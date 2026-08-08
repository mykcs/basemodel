# Repository agent instructions

This repository is frequently maintained by coding agents through GitHub without requiring a local clone.

## Required reading

Before changing hosting, CI, deployment, URL/base-path behavior, SEO deployment output, or repository automation, read:

- [`docs/agents/cloudflare-pages-deployment.md`](docs/agents/cloudflare-pages-deployment.md)

Agent-oriented documentation index:

- [`docs/agents/README.md`](docs/agents/README.md)

## Operating rules

- GitHub is the canonical source repository.
- Prefer branch + pull request for non-trivial changes; do not silently direct-push `main`.
- Do not treat a GitHub Actions job that fails before step 1 because hosted-runner capacity/allowance is unavailable as an application test failure.
- Do not disable an existing production deployment path until its replacement is verified on a real deployment.
- Keep deployment build logic reproducible in the repository rather than only in a provider dashboard.
- Preserve the distinction between deterministic deployment-blocking checks and expensive/external-network audits.
- When changing deployment hosts or canonical URLs, verify `base`, sitemap, robots, canonical metadata, assets, and bilingual routes.
- Update the relevant file in `docs/agents/` when operational architecture changes materially.

Human-facing project/data instructions remain in `README.md` and the rest of `docs/`.
