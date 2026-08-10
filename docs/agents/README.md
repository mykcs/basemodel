# Agent documentation

This directory is the stable Agent entrypoint for `mykcs/basemodel`.

## Start here

1. [`LATEST.md`](./LATEST.md) — current handoff and authoritative day-to-day architecture.
2. [`current/project-agent-operating-principles.md`](./current/project-agent-operating-principles.md) — durable project-wide standard for proactive problem solving, modern/clean workflow ownership, and selective deposition of reusable experience.
3. [`current/hosting-architecture.md`](./current/hosting-architecture.md) — **approved target hosting architecture and active shadow-migration rule: Vercel for PR Preview; Cloudflare Workers Static Assets is the target Production host; Cloudflare Pages remains real Production until explicit cutover.**
4. [`current/vercel-preview-migration-plan.md`](./current/vercel-preview-migration-plan.md) — validated ordinary Preview workflow: non-main GitHub branches/PRs -> Vercel Preview; `main` Vercel deployment disabled.
5. [`current/preview-platform-evaluation.md`](./current/preview-platform-evaluation.md) — decision record explaining why Vercel won the real pilot, why Netlify is deferred, and why Cloudflare Direct Upload remains fallback.
6. [`current/cloudflare-direct-upload-credential-handoff.md`](./current/cloudflare-direct-upload-credential-handoff.md) — Wrangler credential-injection handoff retained for fallback / Cloudflare-specific Preview work; ordinary Preview no longer depends on solving it.
7. [`current/product-and-research-integrity.md`](./current/product-and-research-integrity.md) — durable product north star, evidence semantics, recommendation philosophy, and false-complete acceptance rules.
8. [`current/model-catalog-verification-policy.md`](./current/model-catalog-verification-policy.md) — rules for current-model/family verification, first-party evidence, API-vs-open-weight boundaries, and semantic unknowns.
9. [`current/seed-guided-research-workflow.md`](./current/seed-guided-research-workflow.md) — SEED worked-example research workflow and teaching contract.
10. [`current/deployment-policy.md`](./current/deployment-policy.md) — provider/release boundaries and deployment acceptance rules.
11. [`current/direct-upload-preview-command.md`](./current/direct-upload-preview-command.md) — repository-owned Cloudflare Direct Upload command; use as fallback / Cloudflare-specific Preview path.
12. [`current/direct-upload-preview-policy.md`](./current/direct-upload-preview-policy.md) — detailed Cloudflare Direct Upload mechanics and build-budget rules.
13. [`current/cloudflare-pages-deployment.md`](./current/cloudflare-pages-deployment.md) — current Pages Production / rollback / Direct Upload runbook during migration.
14. [`current/repository-map.md`](./current/repository-map.md) — repository ownership map and change-to-check guidance.
15. [`current/rendering-and-performance-policy.md`](./current/rendering-and-performance-policy.md) — static-first Astro, hydration, performance, and rendering rules.
16. [`current/web-gpt-cloudflare-build-budget-workflow.md`](./current/web-gpt-cloudflare-build-budget-workflow.md) — older Cloudflare-first execution model; retain as fallback/history context.
17. [`/AGENTS.md`](../../AGENTS.md) — repository-wide collaboration / operating rules and fast router.

## Current deployment authority

Do not collapse CURRENT and TARGET into one claim:

```text
CURRENT
GitHub non-main branch / PR
  -> Vercel Preview
  -> npm run verify:deploy
  -> npm run build
  -> inspect real Preview

main
  -> Vercel Git deployment disabled
  -> Cloudflare Pages Production
  -> https://basemodel.pages.dev

TARGET AFTER SHADOW ACCEPTANCE
GitHub
├─ PR / non-main -> Vercel Preview
└─ main          -> Cloudflare Workers Static Assets Production
```

Cloudflare Pages stays Production and rollback infrastructure until the Workers shadow deployment passes the acceptance gate and the owner explicitly authorizes cutover.

Cloudflare Direct Upload remains a supported fallback and a Cloudflare-specific integration Preview. It is not the ordinary first-choice path when Vercel is available.

If older current/history material conflicts with this split, `LATEST.md` plus `current/hosting-architecture.md` wins.

## Preview access rule

The Vercel project is connected to a private GitHub repository, so Deployment Protection is active.

- Agents can inspect deployments/build logs through the connected Vercel capability.
- Stable branch/exact URLs may require Vercel authentication.
- When the owner needs a click-through review URL without Vercel login, generate a temporary Vercel share link and return it.
- Do not store temporary share links as durable documentation because they expire.

## Release / migration rule

Intermediate feature and migration commits may use `[CF-Pages-Skip]` / `[Skip CI]` where appropriate so Cloudflare Pages is not intentionally rebuilt during ordinary Preview/shadow work.

Do not assume that landing `wrangler.jsonc` or Workers migration code on `main` changes Production. A Workers Production cutover is a separate release boundary: shadow deploy -> compare -> rollback plan -> explicit owner intent -> route/hosting switch -> public verification.

Likewise, if the owner intentionally releases through the still-current Pages Production path before cutover, the release commit must not accidentally carry a Cloudflare skip prefix.

## Stable structure

```text
docs/agents/
├── README.md
├── LATEST.md
├── current/
│   ├── project-agent-operating-principles.md
│   ├── hosting-architecture.md
│   ├── vercel-preview-migration-plan.md
│   ├── preview-platform-evaluation.md
│   ├── cloudflare-direct-upload-credential-handoff.md
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

Update `LATEST.md` and the relevant current policy whenever deployment architecture, ownership boundaries, validation Gates, build-budget behavior, shadow status or Production cutover changes materially.
