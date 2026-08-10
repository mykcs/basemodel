# Agent documentation

This directory is the stable Agent entrypoint for `mykcs/basemodel`.

## Start here

1. [`LATEST.md`](./LATEST.md) — fixed timestamped handoff, current repository/deployment state and next action.
2. [`current/product-and-research-integrity.md`](./current/product-and-research-integrity.md) — durable product north star, research-integrity invariants, recommendation philosophy and false-complete acceptance rules.
3. [`current/seed-guided-research-workflow.md`](./current/seed-guided-research-workflow.md) — durable SEED worked-example workflow connecting paper/model exploration, Workspace, Compare, evidence and decision-record behavior.
4. [`current/model-catalog-verification-policy.md`](./current/model-catalog-verification-policy.md) — durable rules for current-model/family verification, first-party evidence, API-vs-open-weight generation boundaries, semantic unknowns and catalog-audit acceptance.
5. [`current/direct-upload-preview-policy.md`](./current/direct-upload-preview-policy.md) — **default day-to-day website preview workflow and Cloudflare Pages Build-budget rule**. Read this before intentionally triggering any Git-connected Pages build.
6. [`current/deployment-policy.md`](./current/deployment-policy.md) — steady-state architecture and the boundary between normal Direct Upload previews and explicit formal Git-integrated releases.
7. [`current/repository-map.md`](./current/repository-map.md) — current repository ownership map and change-to-check matrix.
8. [`current/rendering-and-performance-policy.md`](./current/rendering-and-performance-policy.md) — static-first Astro, hydration, performance and evidence-quality rules.
9. [`current/cloudflare-pages-deployment.md`](./current/cloudflare-pages-deployment.md) — Cloudflare Pages Direct Upload / formal Git release runbook, SEO identity and rollback rules.
10. [`/AGENTS.md`](../../AGENTS.md) — repository-wide operating and collaboration rules.

If historical wording conflicts with `LATEST.md` or files under `current/`, current guidance wins unless the repository owner explicitly changes policy. For **preview/build-budget behavior**, `current/direct-upload-preview-policy.md` is the newest and most specific authority: ordinary website changes should not spend a Git-connected Pages Build merely to obtain a preview.

## Stable structure

```text
docs/agents/
├── README.md
├── LATEST.md
├── current/
│   ├── product-and-research-integrity.md
│   ├── seed-guided-research-workflow.md
│   ├── model-catalog-verification-policy.md
│   ├── direct-upload-preview-policy.md
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

`current/seed-guided-research-workflow.md` records how those product principles are taught through the concrete SEED example. It preserves the canonical paper/model/workspace/compare routes, the teaching path, misuse warnings and deployment-evidence boundaries.

`current/model-catalog-verification-policy.md` records the durable data-maintenance lessons from the 2026-08-10 full-catalog audit. It requires future Agents to distinguish latest hosted/API generations from latest open-weight/base/research checkpoints, verify family ladders against first-party catalogs, map concrete claims to evidence fields, use precise semantic unknown states, and preserve deployment Gates rather than weakening them to make a data update pass.

`current/direct-upload-preview-policy.md` records the owner's cost-sensitive deployment preference for Codex, ChatGPT conversations and work-mode Agents: locally validate/build first, Direct Upload the prebuilt `dist` to a unique non-production Pages branch, return the public preview URL, and explicitly report whether a Cloudflare Pages Build was triggered. If build/upload/auth/quota evidence is unavailable, say so rather than claiming completion or safety. Only an explicit request for a formal Git-integrated release should intentionally spend the Git-connected Pages Build budget.

Future Agents should read the relevant current policy files before broad UI, data-model, research-workflow, model-catalog, framework or deployment redesign work.

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
