# Agent documentation

This directory contains current operational guidance plus historical architecture records.

## Current authoritative documents

Read these before changing deployment, hosting, URL/SEO behavior, release validation, or repository automation:

1. [`deployment-policy.md`](./deployment-policy.md) — authoritative steady-state policy: GitHub source -> Cloudflare Pages, with GitHub Actions and GitHub Pages intentionally retired.
2. [`cloudflare-pages-deployment.md`](./cloudflare-pages-deployment.md) — current Cloudflare build/deploy and verification runbook.
3. [`/AGENTS.md`](../../AGENTS.md) — repository-wide operating rules.

If any historical file conflicts with these documents, the current documents win unless the repository owner explicitly changes policy.

## Historical records

The dated 2026-08-08/09 files record the path that led here: GitHub Actions CI optimization, quota exhaustion, Cloudflare migration, dual-hosting experiments, hardening, cost analysis, and the later retirement decision. Keep them as history; do not treat them as instructions to restore Actions or GitHub Pages.

Notable history:

- [`2026-08-08-github-actions-ci-optimization-history.md`](./2026-08-08-github-actions-ci-optimization-history.md)
- [`2026-08-09-cloudflare-migration-retrospective.md`](./2026-08-09-cloudflare-migration-retrospective.md)
- [`2026-08-09-post-migration-second-audit.md`](./2026-08-09-post-migration-second-audit.md)
- [`2026-08-09-final-hardening-addendum.md`](./2026-08-09-final-hardening-addendum.md)
- [`2026-08-09-actions-cost-after-cloudflare.md`](./2026-08-09-actions-cost-after-cloudflare.md)
- [`dual-hosting-policy.md`](./dual-hosting-policy.md) — retired policy snapshot; no longer authoritative.
- [`2026-08-09-actions-and-pages-retirement.md`](./2026-08-09-actions-and-pages-retirement.md) — decision record for the current simplified architecture.

Current deployment status: Cloudflare Pages project `basemodel` is connected to `mykcs/basemodel`, Production uses `main`, the repository-owned build entrypoint is `npm run build:cloudflare`, and root `/` is the only maintained deployment base.
