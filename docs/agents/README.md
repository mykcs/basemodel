# Agent documentation

This directory is the stable Agent entrypoint for `mykcs/basemodel`.

## Start here

1. [`LATEST.md`](./LATEST.md) — fixed timestamped handoff, current repository/deployment state and next action.
2. [`current/vercel-preview-migration-plan.md`](./current/vercel-preview-migration-plan.md) — **Proposed Preview-platform experiment: evaluate Vercel for GitHub PR/Agent previews while Cloudflare remains canonical Production. This is not adopted architecture until a real Vercel Preview passes the acceptance gate.**
3. [`current/web-gpt-cloudflare-build-budget-workflow.md`](./current/web-gpt-cloudflare-build-budget-workflow.md) — **current validated owner decision for web-GPT + GitHub + Cloudflare work: Agent-side build, Wrangler Preview, Preview auto-builds off, and normally one Cloudflare Production Build only at release. Read this before any ordinary website push/deploy while the Vercel experiment remains unvalidated.**
4. [`current/product-and-research-integrity.md`](./current/product-and-research-integrity.md) — durable product north star, research-integrity invariants, recommendation philosophy and false-complete acceptance rules.
5. [`current/seed-guided-research-workflow.md`](./current/seed-guided-research-workflow.md) — durable SEED worked-example workflow connecting paper/model exploration, Workspace, Compare, evidence and decision-record behavior.
6. [`current/model-catalog-verification-policy.md`](./current/model-catalog-verification-policy.md) — durable rules for current-model/family verification, first-party evidence, API-vs-open-weight generation boundaries, semantic unknowns and catalog-audit acceptance.
7. [`current/direct-upload-preview-policy.md`](./current/direct-upload-preview-policy.md) — project-specific Direct Upload commands, PR isolation, integration-preview and Cloudflare Pages Build-budget details.
8. [`current/deployment-policy.md`](./current/deployment-policy.md) — steady-state architecture and the boundary between normal Direct Upload previews and explicit formal Git-integrated releases.
9. [`current/repository-map.md`](./current/repository-map.md) — current repository ownership map and change-to-check matrix.
10. [`current/rendering-and-performance-policy.md`](./current/rendering-and-performance-policy.md) — static-first Astro, hydration, performance and evidence-quality rules.
11. [`current/cloudflare-pages-deployment.md`](./current/cloudflare-pages-deployment.md) — Cloudflare Pages Direct Upload / formal Git release runbook, SEO identity and rollback rules.
12. [`/AGENTS.md`](../../AGENTS.md) — repository-wide operating and collaboration rules.

If historical wording conflicts with `LATEST.md` or files under `current/`, current guidance wins unless the repository owner explicitly changes policy. For **ordinary web-GPT preview/build-budget behavior today**, `current/web-gpt-cloudflare-build-budget-workflow.md` remains the validated policy; `current/vercel-preview-migration-plan.md` is an experiment plan only until its real-preview acceptance gate passes. Use `current/direct-upload-preview-policy.md` for the project-specific commands and detailed Cloudflare Direct Upload mechanics.

## Stable structure

```text
docs/agents/
├── README.md
├── LATEST.md
├── current/
│   ├── vercel-preview-migration-plan.md
│   ├── web-gpt-cloudflare-build-budget-workflow.md
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

`LATEST.md` keeps the same path. Update its timestamp/status after a meaningful product-contract, repository-layout, deployment-architecture or build-budget change rather than creating a new “latest” file. The Vercel plan does not by itself change `LATEST.md`; update `LATEST.md` when the Vercel experiment is actually validated, rejected, deferred, or adopted with evidence.

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

`current/vercel-preview-migration-plan.md` records the current Preview-platform experiment. Its proposed architecture is GitHub PR -> Vercel Preview for ordinary review while Cloudflare remains canonical Production. The file deliberately preserves the existing Cloudflare workflow as authoritative until a real Vercel Preview is reachable, noindex is verified, the target Astro routes work, and Cloudflare Production remains isolated. If the experiment succeeds, future Agents must update the authoritative architecture documents together rather than silently treating Vercel as adopted based on project creation alone.

`current/web-gpt-cloudflare-build-budget-workflow.md` records the owner's validated 2026-08-10 execution model: ordinary development should be fully orchestratable from ChatGPT/Codex-style web tooling; Agent-side builds are sufficient for the build step; public review uses Wrangler Direct Upload; Cloudflare Preview automatic deployments should be `None`; and `main` remains the deliberate Production boundary so a normal accepted feature usually consumes one Git-integrated Pages Build only when released. This remains the fallback/default until the Vercel experiment is validated and explicitly promoted into current architecture policy.

`current/direct-upload-preview-policy.md` contains the detailed repository-specific implementation of that decision: build the prebuilt `dist`, Direct Upload to a unique non-production Pages branch, return the public preview URL, isolate parallel PRs, and explicitly report whether a Cloudflare Pages Build was triggered. If build/upload/auth/quota evidence is unavailable, say so rather than claiming completion or safety.

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
