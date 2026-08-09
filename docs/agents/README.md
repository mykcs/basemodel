# Agent documentation

This directory is the stable Agent entrypoint for `mykcs/basemodel`.

## Start here

1. [`LATEST.md`](./LATEST.md) — fixed timestamped handoff, current repository/deployment state and next action.
2. [`current/product-and-research-integrity.md`](./current/product-and-research-integrity.md) — durable product north star, research-integrity invariants, recommendation philosophy and false-complete acceptance rules.
3. [`current/deployment-policy.md`](./current/deployment-policy.md) — authoritative steady-state architecture and validation policy.
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
│   ├── product-and-research-integrity.md
│   ├── deployment-policy.md
│   ├── repository-map.md
│   ├── rendering-and-performance-policy.md
│   └── cloudflare-pages-deployment.md
└── history/
    ├── repository-layout-plan.md
    ├── dual-hosting-policy.md
    └── dated migration / audit / retirement records
```

`LATEST.md` keeps the same path. Update its timestamp/status after a meaningful product-contract, repository-layout, deployment-architecture or build-budget change rather than creating a new “latest” file.

## Current product contract

`current/product-and-research-integrity.md` is the durable bridge between the product goal and implementation details. It records decisions that should not be lost when an individual conversation ends, including:

- the site is a research decision system rather than merely a model database;
- strict reproduction, method reproduction and modern rerun are distinct research modes;
- unknown/evidence/license/revision/hardware semantics must not be simplified into false facts;
- recommendations should expose tradeoffs instead of hiding them in one score;
- cross-page research state, Quick View, Compare and substitution analysis are product contracts;
- file/component existence is not proof that a feature is complete;
- server-only capabilities such as accounts, cross-device cloud save and team collaboration remain explicit external boundaries until real services exist.

Future Agents should read that file before broad UI, data-model or framework redesign work.

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
