# Cloudflare Workers Builds CI qualification

Status: **experimental qualification only — not merge authority, not deployment authority**.

This directory asks one narrow question: can Cloudflare Workers Builds reproduce the existing BaseModel CI acceptance contract on the exact current-main + source-head merge candidate, without weakening tests or publishing another copy of the site?

## Safety boundary

- The three qualification Workers have `workers_dev=false`, `preview_urls=false`, and no routes.
- The Workers Builds deploy command is a repository no-op. Passing a build must not publish website output or a new Worker version.
- The runner refuses `main` and any branch outside `ci/cloudflare-workers-builds-qualification-*`.
- The runner requires Cloudflare's `WORKERS_CI=1`, exact `WORKERS_CI_COMMIT_SHA`, Node 24, and one explicit role.
- Existing CircleCI required checks and the GitHub ruleset remain unchanged until live provider equivalence is proven separately.
- PR #563 is an independent Vercel-first CI candidate. This qualification is parallel evidence, not permission to overwrite or merge that architecture.

## Three isolated roles

| Worker | Build role | Contract |
| --- | --- | --- |
| `basemodel-ci-qual-deterministic` | `deterministic` | existing planner tests, fail-closed full mode, browser-budget test, `npm ci`, `verify:deploy`, static build |
| `basemodel-ci-qual-browser-1` | `browser-1` | existing browser gate, full canonical Chromium matrix shard 1/2, one Playwright worker, Lab reserve |
| `basemodel-ci-qual-browser-2` | `browser-2` | existing browser gate, full canonical Chromium matrix shard 2/2, one Playwright worker |

The adapter reuses `scripts/ci-circleci-prepare.sh` to materialize the same synthetic merge candidate rather than inventing provider-specific base/head semantics.

## Workers Builds settings to qualify

Each Worker must connect only to `mykcs/basemodel` and only include branch `ci/cloudflare-workers-builds-qualification-20260908` during qualification.

Set the root directory to the corresponding directory under `cloudflare/ci-qualification/`. Use:

```text
Build command:      cd ../../.. && node scripts/ci-cloudflare-qualification.mjs
Deploy command:     cd ../../.. && node scripts/ci-cloudflare-qualification-deploy-noop.mjs
Non-prod deploy:    cd ../../.. && node scripts/ci-cloudflare-qualification-deploy-noop.mjs
```

Provider environment variables:

```text
BASEMODEL_CLOUDFLARE_ROLE=deterministic   # or browser-1 / browser-2
NODE_VERSION=24.18.0
SKIP_DEPENDENCY_INSTALL=1
```

`SKIP_DEPENDENCY_INSTALL=1` is intentional: the repository gate owns the exact `npm ci` point, so Cloudflare must not add an implicit dependency install before the measured command.

## Acceptance criteria

Qualification passes only if all of the following are observed on the same source head:

1. private-repository checkout and `git fetch origin main` both work without exposing credentials;
2. `WORKERS_CI_COMMIT_SHA` equals checkout `HEAD` and remains the source-head identity;
3. the adapter materializes current main + exact source head as the tested merge candidate;
4. deterministic validation passes without changes to assertions, copy/scientific gates, or package/build semantics;
5. the two browser roles preserve the full canonical test population, one Playwright worker per shard, and the Lab reserve on shard 1;
6. every individual Cloudflare build finishes inside the provider hard timeout;
7. GitHub receives provider evidence bound to the exact source head with stable, distinguishable status identity;
8. no production/Preview site, route, or public Worker target is created by qualification;
9. measured total provider consumption is acceptable under the account's live entitlement and concurrency;
10. repeated evidence is stable enough to justify a separate migration decision.

Failure of any item is a valid qualification result. Do not loosen tests, split scientific semantics, raise thresholds, or change reader-attention rules to make the provider fit.

## Adoption boundary

This branch does **not** change `.circleci/config.yml`, `vercel.json`, the main ruleset, or current deployment-policy authority. If Cloudflare passes, provider adoption requires a separate current-main migration that first proves replacement statuses and then changes required-check ownership atomically. If Cloudflare cannot satisfy the browser timeout/status contract, preserve the result as negative evidence and close the qualification without forcing the provider into the architecture.
