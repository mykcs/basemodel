# Agent documentation

This directory is the stable Agent entrypoint for `mykcs/basemodel`.

## Start here

1. [`LATEST.md`](./LATEST.md) — current handoff and authoritative day-to-day architecture.
2. [`current/vercel-preview-migration-plan.md`](./current/vercel-preview-migration-plan.md) — **validated ordinary Preview workflow: non-main GitHub branches/PRs -> Vercel Preview; `main` Vercel deployment disabled; Cloudflare remains Production.**
3. [`current/preview-platform-evaluation.md`](./current/preview-platform-evaluation.md) — decision record explaining why Vercel won the real pilot, why Netlify is deferred, and why Cloudflare Direct Upload remains fallback.
4. [`current/product-and-research-integrity.md`](./current/product-and-research-integrity.md) — durable product north star, evidence semantics, recommendation philosophy, and false-complete acceptance rules.
5. [`current/model-catalog-verification-policy.md`](./current/model-catalog-verification-policy.md) — rules for current-model/family verification, first-party evidence, API-vs-open-weight boundaries, and semantic unknowns.
6. [`current/seed-guided-research-workflow.md`](./current/seed-guided-research-workflow.md) — SEED worked-example research workflow and teaching contract.
7. [`current/deployment-policy.md`](./current/deployment-policy.md) — provider/release boundaries and deployment acceptance rules.
8. [`current/direct-upload-preview-command.md`](./current/direct-upload-preview-command.md) — repository-owned Cloudflare Direct Upload command; use as fallback / Cloudflare-specific Preview path.
9. [`current/direct-upload-preview-policy.md`](./current/direct-upload-preview-policy.md) — detailed Cloudflare Direct Upload mechanics and build-budget rules.
10. [`current/cloudflare-pages-deployment.md`](./current/cloudflare-pages-deployment.md) — Cloudflare Production / rollback / Direct Upload runbook.
11. [`current/repository-map.md`](./current/repository-map.md) — repository ownership map and change-to-check guidance.
12. [`current/rendering-and-performance-policy.md`](./current/rendering-and-performance-policy.md) — static-first Astro, hydration, performance, and rendering rules.
13. [`current/web-gpt-cloudflare-build-budget-workflow.md`](./current/web-gpt-cloudflare-build-budget-workflow.md) — older Cloudflare-first execution model; retain as fallback context, but it no longer overrides the validated Vercel ordinary-Preview workflow.
14. [`/AGENTS.md`](../../AGENTS.md) — repository-wide collaboration / operating rules.

## Current deployment authority

For ordinary web-GPT / Codex website work, the validated split is:

```text
GitHub non-main branch / PR
  -> Vercel Preview
  -> npm run verify:deploy
  -> npm run build
  -> inspect real Preview

main
  -> Vercel Git deployment disabled
  -> Cloudflare Pages Production
  -> https://basemodel.pages.dev
```

Cloudflare Direct Upload remains a supported fallback and a Cloudflare-specific integration Preview. It is not the ordinary first-choice path when Vercel is available.

If older current/history material says every ordinary Preview should use Cloudflare Direct Upload, `LATEST.md` plus `current/vercel-preview-migration-plan.md` wins.

## Preview access rule

The Vercel project is connected to a private GitHub repository, so Deployment Protection is active.

- Agents can inspect deployments/build logs through the connected Vercel capability.
- Stable branch/exact URLs may require Vercel authentication.
- When the owner needs a click-through review URL without Vercel login, generate a temporary Vercel share link and return it.
- Do not store temporary share links as durable documentation because they expire.

## Release rule

Intermediate feature commits may use `[CF-Pages-Skip]` to avoid intentionally triggering Cloudflare branch builds while Vercel handles Preview.

When the owner accepts a feature and expects Cloudflare Production to update, the final merge/release commit must use a normal non-skip message. Do not accidentally carry `[CF-Pages-Skip]` / `[Skip CI]` into the actual Production release boundary.

## Stable structure

```text
docs/agents/
├── README.md
├── LATEST.md
├── current/
│   ├── vercel-preview-migration-plan.md
│   ├── preview-platform-evaluation.md
│   ├── product-and-research-integrity.md
│   ├── model-catalog-verification-policy.md
│   ├── seed-guided-research-workflow.md
│   ├── deployment-policy.md
│   ├── direct-upload-preview-command.md
│   ├── direct-upload-preview-policy.md
│   ├── cloudflare-pages-deployment.md
│   ├── repository-map.md
│   ├── rendering-and-performance-policy.md
│   └── web-gpt-cloudflare-build-budget-workflow.md
└── history/
    └── dated / retired migration and incident records
```

## Product contract

The deployment change does not alter the research/product north star:

- the site is a research decision system rather than merely a model database;
- strict reproduction, method reproduction, and modern rerun remain distinct;
- unknown/evidence/license/revision/hardware semantics must not be simplified into false facts;
- recommendations should expose tradeoffs rather than hide them behind one score;
- heuristic compute estimates must remain distinct from measured hardware results;
- “done” means connected to the real user path and protected by acceptance checks.

Read `current/product-and-research-integrity.md` and the task-relevant research/data policies before broad product changes.

## Historical records

Files under [`history/`](./history/) describe how previous architectures were reached. They are evidence, not a reason to restore GitHub Actions, GitHub Pages, or superseded Cloudflare-only ordinary-Preview assumptions.

Update `LATEST.md` and the relevant current policy whenever deployment architecture, ownership boundaries, validation Gates, or build-budget behavior changes materially.
