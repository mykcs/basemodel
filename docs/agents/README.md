# Agent documentation

This directory is the stable Agent entrypoint for `mykcs/basemodel`.

## Start here

1. [`LATEST.md`](./LATEST.md) — current handoff and authoritative day-to-day architecture.
2. [`current/project-agent-operating-principles.md`](./current/project-agent-operating-principles.md) — durable project-wide standard for proactive problem solving, modern/clean workflow ownership, and selective deposition of reusable experience.
3. [`current/scenario-trigger-registry.md`](./current/scenario-trigger-registry.md) — **just-in-time router for recurring situations. Scan it against each non-trivial task and load the matched guidance automatically; do not wait for the owner to repeat known constraints.**
4. [`current/hosting-architecture.md`](./current/hosting-architecture.md) — **current hosting authority: Vercel owns ordinary PR Preview; Cloudflare Pages remains Production; the validated Workers Static Assets path is frozen as an optional future migration rather than the default target.**
5. [`current/vercel-preview-migration-plan.md`](./current/vercel-preview-migration-plan.md) — validated ordinary Preview workflow: non-main GitHub branches/PRs -> Vercel Preview; `main` Vercel deployment disabled.
6. [`current/preview-platform-evaluation.md`](./current/preview-platform-evaluation.md) — decision record explaining why Vercel won the real Preview pilot and why Cloudflare Direct Upload remains fallback.
7. [`current/cloudflare-direct-upload-credential-handoff.md`](./current/cloudflare-direct-upload-credential-handoff.md) — Wrangler credential-injection handoff retained for fallback / Cloudflare-specific Preview work; ordinary Preview no longer depends on solving it.
8. [`current/product-and-research-integrity.md`](./current/product-and-research-integrity.md) — durable product north star, evidence semantics, recommendation philosophy, and false-complete acceptance rules.
9. [`current/model-catalog-verification-policy.md`](./current/model-catalog-verification-policy.md) — rules for current-model/family verification, first-party evidence, API-vs-open-weight boundaries, and semantic unknowns.
10. [`current/seed-guided-research-workflow.md`](./current/seed-guided-research-workflow.md) — SEED worked-example research workflow and teaching contract.
11. [`current/deployment-policy.md`](./current/deployment-policy.md) — provider/release boundaries and deployment acceptance rules.
12. [`current/direct-upload-preview-command.md`](./current/direct-upload-preview-command.md) — repository-owned Cloudflare Direct Upload command; use as fallback / Cloudflare-specific Preview path.
13. [`current/direct-upload-preview-policy.md`](./current/direct-upload-preview-policy.md) — detailed Cloudflare Direct Upload mechanics and build-budget rules.
14. [`current/cloudflare-pages-deployment.md`](./current/cloudflare-pages-deployment.md) — current Pages Production / rollback / Direct Upload runbook.
15. [`current/repository-map.md`](./current/repository-map.md) — repository ownership map and change-to-check guidance.
16. [`current/rendering-and-performance-policy.md`](./current/rendering-and-performance-policy.md) — static-first Astro, hydration, performance, and rendering rules.
17. [`current/web-gpt-cloudflare-build-budget-workflow.md`](./current/web-gpt-cloudflare-build-budget-workflow.md) — older Cloudflare-first execution model; retain as fallback/history context.
18. [`/AGENTS.md`](../../AGENTS.md) — repository-wide collaboration / operating rules and fast router.

## How scenario triggers work

The trigger registry is intentionally small and procedural. It does not replace the owning current policies.

At the start of a non-trivial task:

```text
read LATEST + operating principles
-> scan scenario-trigger-registry against the task
-> load only matched current docs/tests/provider evidence
-> execute
-> if a new reusable lesson appears, decide whether to encode it in an existing owner/test/runbook or leave it ephemeral
```

Examples of recurring triggers include protected Cloudflare build budget, hosting/platform modernization, exact-head Preview drift, SEED/offline-lab reproduction, GPU time/cost decisions, beginner-facing rewrites, actionable content, unavailable tool/provider paths, overlapping PRs, and reusable-lesson deposition.

Historical cases can explain why a trigger exists, but current policy and executable truth win.

## Current deployment authority

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

The 2026-08-11 architecture re-audit reaffirmed this as the **current steady state**, not merely a temporary migration midpoint.

The previously validated Workers Static Assets shadow remains available as a reversible future option, but it is **not** the default next Production target. Reopen that decision only when a real requirement changes: independent custom domain, demonstrated Pages limitation, Cloudflare-native server capability need, materially different provider economics, or another explicit architecture trigger.

Cloudflare Direct Upload remains a supported fallback and a Cloudflare-specific integration Preview. It is not the ordinary first-choice path when Vercel is available.

If older current/history material says Workers is the automatic next Production target, `LATEST.md` plus `current/hosting-architecture.md` wins.

## Provider-count vs build-count rule

Do not infer that removing a provider removes a build.

```text
fewer providers
!= fewer hosted builds
```

A normal PR -> Production flow can still have separate Preview and Production deployments on one provider. If the real requirement is one hosted build, inspect a deliberate build-once -> staged inspection -> artifact-promotion design instead of treating provider deletion as the solution.

The detailed audit reasoning is preserved in [`history/2026-08-11-hosting-architecture-audit.md`](./history/2026-08-11-hosting-architecture-audit.md).

## Preview access rule

The Vercel project is connected to a private GitHub repository, so Deployment Protection is active.

- Agents can inspect deployments/build logs through the connected Vercel capability.
- Stable branch/exact URLs may require Vercel authentication.
- When the owner needs a click-through review URL without Vercel login, generate a temporary Vercel share link and return it.
- Do not store temporary share links as durable documentation because they expire.

## Release rule

Intermediate feature commits may use `[CF-Pages-Skip]` / `[Skip CI]` where appropriate so Cloudflare Pages is not intentionally rebuilt during ordinary Preview work.

When the owner intentionally releases through the current Pages Production path, the release commit must not accidentally carry a Cloudflare skip prefix.

Do not interpret `wrangler.jsonc` or the existence of a validated Workers shadow as release authorization. Any future Production-host migration is a separate architecture/release decision with domain/canonical planning, rollback, explicit owner intent and public verification.

## Stable structure

```text
docs/agents/
├── README.md
├── LATEST.md
├── current/
│   ├── project-agent-operating-principles.md
│   ├── scenario-trigger-registry.md
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
    └── dated migration / incident / audit records
```

## Product contract

The deployment decision does not alter the research/product north star:

- the site is a research decision system rather than merely a model database;
- strict reproduction, method reproduction, and modern rerun remain distinct;
- unknown/evidence/license/revision/hardware semantics must not be simplified into false facts;
- recommendations should expose tradeoffs rather than hide them behind one score;
- heuristic compute estimates must remain distinct from measured hardware results;
- “done” means connected to the real user path and protected by acceptance checks.

Read `current/product-and-research-integrity.md` and the task-relevant research/data policies before broad product changes.

## Historical records

Files under [`history/`](./history/) explain how previous decisions were reached. They are evidence, not a reason to restore GitHub Actions, GitHub Pages, superseded Cloudflare-only ordinary-Preview assumptions, or a paused Workers cutover.

Update `LATEST.md` and the relevant current policy whenever deployment architecture, ownership boundaries, validation Gates, build-budget behavior or Production hosting changes materially.
