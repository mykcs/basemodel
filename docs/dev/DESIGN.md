# Why BaseModel develops this way

## Workload and acceptance

The site combines static publishing, research explanation, executable audits, and browser behavior. A green static build alone cannot prove its reader contracts or interactions. Local checks and repository-owned scripts catch source mistakes before spending hosted resources; [the engineering standard](../agents/current/website-engineering-standard.md) defines which checks apply. The [Public PR workflow](../../.github/workflows/public-pr-ci.yml) plans browser coverage from the changed surface, so a non-UI change need not allocate the full browser matrix while shared or uncertain UI work retains broad acceptance.

GitHub Actions supplies independent Linux compute for repository and browser acceptance. Vercel supplies the distinct provider-build and deployment proof, then serves the Production site. The [hosting architecture](../agents/current/hosting-architecture.md) owns the exact PR/ref/status sequence, required checks, Preview distinction, and release evidence. A viewing Preview helps human iteration; it never substitutes for merge acceptance. [The deployment policy](../agents/current/deployment-policy.md) owns Production and rollback procedure.

## Provider choices and spend

The required Vercel candidate is requested only when a PR is ready for final acceptance. Repository-only changes still receive required merge checks, while Production build relevance is decided by the [Vercel ignore script](../../scripts/vercel-ignore-build.mjs). This keeps documentation or Agent-policy edits from publishing a new website. [The provider decision](../agents/current/ci-provider-decision.md) records the measured alternatives and current provider rationale; live plan limits and provider settings must be rechecked before a migration.

Cloudflare's active role is [Production smoke observation](../../cloudflare/production-smoke/), not ordinary site publication. The [manual Mac workflow](../../.github/workflows/self-hosted-ci.yml) and CircleCI configuration are recovery paths, not routine PR or Production compute. Research/GPU machines do not become CI capacity. Source, workflow, ruleset, and provider settings remain authoritative over this explanation.

## Change and recovery rule

For a CI change, inspect the local validator, current workflow, branch rules, provider identity, and the first failing job or build phase. [The failure runbook](../agents/current/provider-failure-attribution-runbook.md) distinguishes application failure, CI contract failure, and provider failure. Qualify any replacement on the actual final candidate before moving merge authority; keep the previous path available until the new one is proven. A scientific result or experiment state is never altered to repair a CI bill or a provider outage.
