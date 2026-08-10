# Vercel Preview migration plan

Status: **Proposed — not yet validated**

Last reviewed: **2026-08-11 00:37 +08:00**

Owner intent: reduce Cloudflare Pages Build consumption during high-frequency Agent-driven website development while preserving Cloudflare as the current Production host until a Vercel Preview path is proven in practice.

## Decision summary

The proposed intermediate architecture is:

```text
GitHub feature branch / PR
        |
        v
Vercel Preview deployment
        |
        v
public *.vercel.app URL for review

main branch
        |
        v
Cloudflare Pages Production
        |
        v
https://basemodel.pages.dev
```

This is **not yet the repository's adopted deployment architecture**. Until the acceptance gate below passes, the existing Cloudflare Direct Upload policy remains authoritative for ordinary Preview work and Cloudflare remains the only validated Production host.

The purpose of this experiment is narrow: determine whether Vercel can become the default public Preview surface for web-GPT / Codex / Agent work so that routine Preview iteration no longer depends on the Cloudflare Pages Git-build quota.

## Why test this architecture

The current Cloudflare policy is sound when an Agent environment has a working Wrangler login: build locally/Agent-side, Direct Upload prebuilt assets, return a public Preview URL, and reserve Git-integrated Pages Builds for deliberate release boundaries.

The recurring operational failure mode is different: some ChatGPT/Agent sessions have GitHub write access but do not expose a usable Cloudflare deployment credential. In those sessions, obtaining a public Cloudflare Preview can force a fallback to Git-integrated Pages Preview builds, which consumes the monthly Cloudflare Pages Build budget.

Vercel is being evaluated because its product model is natively aligned with the repository's high-frequency Preview workflow:

- Vercel supports static Astro projects with zero-configuration deployment.
- Git-connected projects can create Preview deployments for branch pushes / pull requests.
- Preview deployments receive unique public URLs.
- Vercel automatically adds `X-Robots-Tag: noindex` to Preview deployments by default, which matches this repository's Preview SEO requirement.
- The Vercel CLI supports `vercel build` followed by `vercel deploy --prebuilt`, allowing Agent-side build validation before a Preview is uploaded.
- Current Hobby limits are materially different from Cloudflare Pages' Git-build quota and should be evaluated against this project's actual Preview cadence rather than assumed unlimited.

Primary references checked on 2026-08-11:

- https://vercel.com/docs/frameworks/frontend/astro
- https://vercel.com/docs/git
- https://vercel.com/docs/git/vercel-for-github
- https://vercel.com/docs/deployments/environments
- https://vercel.com/docs/deployments/generated-urls
- https://vercel.com/docs/headers/response-headers
- https://vercel.com/docs/cli/build
- https://vercel.com/docs/cli/deploy
- https://vercel.com/docs/limits

## Non-goals

This experiment does **not** authorize the following:

- moving `basemodel.pages.dev` Production to Vercel;
- changing DNS or canonical Production identity;
- removing Cloudflare Pages;
- changing SEO canonical URLs to `vercel.app`;
- enabling Vercel-only framework features, SSR, Functions, ISR, Image Optimization, Analytics, or other runtime coupling;
- adding `@astrojs/vercel` merely to get a static Preview working;
- changing the repository build contract away from its existing Astro static build unless a real incompatibility is proven;
- deleting the existing Cloudflare Direct Upload policy before Vercel is validated.

The first experiment should treat Vercel as a **disposable Preview provider for the existing static artifact**, not as a reason to redesign the application architecture.

## Phase 0 — preserve current Production

Before any Vercel experiment:

1. Keep Cloudflare Pages Production branch = `main`.
2. Keep `https://basemodel.pages.dev` as canonical Production.
3. Do not merge a Vercel-specific experiment merely to obtain a Preview.
4. Do not trigger a Cloudflare Git-integrated Preview as part of the Vercel test.
5. Keep Cloudflare Preview automatic deployments disabled where the current account configuration supports that state.
6. Keep repository validation/build commands provider-neutral.

A failed Vercel experiment must leave Production unchanged.

## Phase 1 — connect Vercel as Preview-only

Create or select a Vercel project under the owner's Vercel account and connect GitHub repository:

```text
mykcs/basemodel
```

Initial target settings:

```text
Framework: Astro / auto-detected
Production branch: main (connection metadata only)
Preview source: non-main branches / PRs
Production domain: none assigned for this experiment
Custom domain: none
```

Do not point the Production domain at Vercel during this phase. The Vercel project may technically create a Production-environment deployment for `main`; that deployment is not the site's canonical Production and should not be advertised or indexed as such.

If Vercel's Git integration would create an unwanted deployment from `main` during connection, avoid changing Cloudflare and record the Vercel deployment as non-canonical test infrastructure only.

## Phase 2 — validate with an existing real PR

Use a real feature PR rather than a no-op probe. The preferred first validation candidate is the current SEED / 4×3090 offline-lab work if that PR is still open and relevant.

Acceptance sequence:

```text
exact PR head
-> Vercel Preview deployment
-> unique commit Preview URL
-> branch Preview URL if provided
-> inspect target Guide route
-> verify headers / SEO / static assets / routes
-> confirm Cloudflare Production unchanged
-> confirm no Cloudflare Git-integrated Pages Build was intentionally triggered
```

Do not create meaningless source edits solely to trigger Vercel if a real feature head already exists.

## Phase 3 — Preview acceptance gate

Vercel Preview is considered **validated** only if all of the following are true:

### Repository and build

- Vercel builds the current Astro project without requiring a Vercel-specific application rewrite.
- Existing bilingual routes render.
- Static assets load from the root correctly.
- Existing repository-local build/validation can still run before hosted deployment.
- No Production-only absolute host assumption breaks the Preview.

### URL and PR integration

- A GitHub PR receives or exposes a Vercel Preview URL for the exact tested head.
- The URL is publicly reachable without requiring the owner to relay dashboard information manually.
- A stable branch Preview URL is available or the commit-specific URL is sufficient for review.

### SEO / identity

- `*.vercel.app` Preview responses include `X-Robots-Tag: noindex` or equivalent verified noindex behavior.
- Canonical metadata continues to identify the real Production site rather than promoting the Preview host.
- sitemap / robots / hreflang behavior does not create a new indexed site identity.

### Cloudflare isolation

- `https://basemodel.pages.dev` remains unchanged during Preview validation.
- No Cloudflare Production deployment is triggered.
- No Cloudflare Git-integrated Preview Build is triggered merely to validate Vercel.

### Product behavior

For the first real validation, inspect at minimum:

- `/`
- `/guide/`
- `/guide/#seed-reproduction`
- the specific route/anchor changed by the candidate PR
- `/en/guide/` when the change is bilingual

A source-level success or a Vercel "READY" badge alone is not enough; the actual public Preview must be opened and checked.

## Preferred steady state if validation passes

If Phase 3 passes, update this file from `Proposed` to `Validated`, then change the day-to-day architecture guidance to:

```text
ordinary feature work
-> Agent-side repository validation + production build
-> GitHub focused branch / PR
-> Vercel Preview
-> inspect public *.vercel.app URL
-> iterate
-> owner accepts
-> merge main
-> Cloudflare Production release remains the explicit production boundary
```

Cloudflare Direct Upload should remain documented as a valid fallback / independent integration-preview mechanism unless the owner explicitly retires it.

The primary benefit is operational: ordinary Preview iteration is no longer blocked on a Cloudflare Wrangler credential in every Agent session and no longer needs to consume Cloudflare Git-integrated Preview Builds merely to obtain a review URL.

## Optional CLI/prebuilt path after Git Preview validation

After Git-connected Vercel Preview works, test whether the Agent environment can use:

```bash
vercel pull
vercel build
vercel deploy --prebuilt
```

Vercel documents that `vercel build` writes Build Output API artifacts to `.vercel/output`, and `vercel deploy --prebuilt` deploys those artifacts; the deploy command returns the Deployment URL on stdout.

This path is desirable when the Agent has Vercel credentials because it preserves the owner's preferred order:

```text
validate locally first -> upload prebuilt result -> public Preview
```

Do not assume `--prebuilt` is always equivalent to Git deployment. Vercel warns that system environment variables are not available at build time in the same way when using prebuilt output; if this repository later depends on Vercel build-time system variables, re-evaluate the path.

## Vercel quota / limit interpretation

Do not describe Vercel Hobby as unlimited.

As checked on 2026-08-11, Vercel's limits documentation lists, among other limits:

- 100 deployments created per day on Hobby;
- 2,000 CLI-created deployments per week;
- 45 minutes maximum build time per deployment;
- 1 concurrent build on Hobby;
- per-hour build rate limits and other platform limits documented separately/currently on the same limits page.

These limits can change. Re-check official Vercel documentation before making quota/cost claims.

The architecture decision should be based on whether those limits fit this repository's actual Agent Preview cadence, not on the false claim that Vercel Preview is quota-free.

## Failure / rollback rule

If Vercel Preview is unreliable, incompatible, inaccessible from ChatGPT/Agent tooling, or creates worse operational constraints:

1. mark this plan `Rejected` or `Deferred` with dated evidence;
2. do not change Cloudflare Production;
3. keep the existing Direct Upload policy as default;
4. record the exact blocker so a later Agent does not repeat the same experiment blindly.

There is no Production rollback needed if the experiment obeys the Preview-only boundary.

## Documentation update rule after the experiment

If Vercel validation succeeds, update together:

- this file: `Proposed` -> `Validated` / `Adopted`;
- `docs/agents/LATEST.md`;
- `docs/agents/README.md`;
- `/AGENTS.md` architecture and normal workflow sections;
- `deployment-policy.md` if Vercel Preview becomes authoritative;
- `repository-map.md` if provider ownership boundaries change;
- `cloudflare-pages-deployment.md` only where Cloudflare's role changes;
- `web-gpt-cloudflare-build-budget-workflow.md` so it no longer implies Cloudflare Direct Upload is the only ordinary Preview path.

Do **not** edit all of these files merely because a Vercel project was created. Update the authoritative architecture only after a real public Preview passes the acceptance gate.

## Required experiment report

The Agent performing the first Vercel test must report:

```text
Vercel project connected: yes / no
GitHub repository connected: yes / no
Candidate PR / exact head: <PR + SHA>
Agent-side validation/build: passed / failed / not run
Vercel Preview status: READY / ERROR / unknown
Commit Preview URL: <URL or none>
Branch Preview URL: <URL or none>
Preview noindex verified: yes / no / unknown
Cloudflare Git-integrated Pages Builds triggered by this experiment: 0 / more / unknown
Cloudflare Production changed: no / yes / unknown
Canonical Production URL: https://basemodel.pages.dev
Plan status after experiment: Proposed / Validated / Rejected / Deferred
```

Do not call the migration successful until the real Preview URL and isolation checks are verified.
