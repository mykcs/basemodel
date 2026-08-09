# Agent documentation

This directory is the stable Agent entrypoint for `mykcs/basemodel`.

## Start here

1. [`LATEST.md`](./LATEST.md) — fixed timestamped handoff, current repository/deployment state and next action.
2. [`current/deployment-policy.md`](./current/deployment-policy.md) — authoritative steady-state architecture and validation policy.
3. [`current/product-vision-and-design-policy.md`](./current/product-vision-and-design-policy.md) — durable product mission, research workflow, UI/design principles, evidence rules and V3 trigger conditions.
4. [`current/repository-map.md`](./current/repository-map.md) — current repository ownership map and change-to-check matrix.
5. [`current/rendering-and-performance-policy.md`](./current/rendering-and-performance-policy.md) — static-first Astro, hydration, performance and evidence-quality rules.
6. [`current/cloudflare-pages-deployment.md`](./current/cloudflare-pages-deployment.md) — Cloudflare Pages build/deploy runbook and build-budget rules.
7. [`/AGENTS.md`](../../AGENTS.md) — repository-wide operating and collaboration rules.

If historical wording conflicts with `LATEST.md` or files under `current/`, current guidance wins unless the repository owner explicitly changes policy.

## Stable structure

```text
docs/agents/
├── README.md
├── LATEST.md
├── current/
│   ├── deployment-policy.md
│   ├── product-vision-and-design-policy.md
│   ├── repository-map.md
│   ├── rendering-and-performance-policy.md
│   └── cloudflare-pages-deployment.md
└── history/
    ├── repository-layout-plan.md
    ├── dual-hosting-policy.md
    └── dated migration / audit / retirement records
```

`LATEST.md` keeps the same path. Update its timestamp/status after a meaningful repository-layout, deployment-architecture or build-budget change rather than creating a new “latest” file.

The product/design policy is intentionally durable rather than timestamped handoff material. Update it only when the owner materially changes the product mission, research workflow, recommendation/evidence policy, information architecture, or the conditions under which a server-side V3 should be introduced.

## Historical records

The material under [`history/`](./history/) records how the current architecture was reached. Notable records include:

- [`history/2026-08-08-github-actions-ci-optimization-history.md`](./history/2026-08-08-github-actions-ci-optimization-history.md)
- [`history/2026-08-09-cloudflare-migration-retrospective.md`](./history/2026-08-09-cloudflare-migration-retrospective.md)
- [`history/2026-08-09-post-migration-second-audit.md`](./history/2026-08-09-post-migration-second-audit.md)
- [`history/2026-08-09-final-hardening-addendum.md`](./history/2026-08-09-final-hardening-addendum.md)
- [`history/2026-08-09-actions-cost-after-cloudflare.md`](./history/2026-08-09-actions-cost-after-cloudflare.md)
- [`history/2026-08-09-actions-and-pages-retirement.md`](./history/2026-08-09-actions-and-pages-retirement.md)
- [`history/2026-08-09-cloudflare-steady-state-summary.md`](./history/2026-08-09-cloudflare-steady-state-summary.md)
- [`history/dual-hosting-policy.md`](./history/dual-hosting-policy.md) — retired policy snapshot.
- [`history/repository-layout-plan.md`](./history/repository-layout-plan.md) — plan that produced the current repository organization.

These files are evidence/history, not a reason to restore GitHub Actions, GitHub Pages, old test paths or previous Cloudflare assumptions.
