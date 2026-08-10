# Repository map for agents

Last reviewed: 2026-08-10

This file is the fast orientation map for coding agents. It explains where to look before making changes; it does not replace the authoritative current policy files.

## 60-second start

Before editing this repository, read in this order:

1. [`/AGENTS.md`](../../../AGENTS.md) — repository-wide operating rules and collaboration expectations.
2. [`../LATEST.md`](../LATEST.md) — latest timestamped handoff and current state.
3. [`product-and-research-integrity.md`](./product-and-research-integrity.md) — durable product/research-integrity contract.
4. [`model-catalog-verification-policy.md`](./model-catalog-verification-policy.md) — required before broad current-model/family audits, vendor-catalog refreshes or changes to model evidence semantics.
5. [`direct-upload-preview-policy.md`](./direct-upload-preview-policy.md) — **default website preview workflow and Cloudflare Pages Build-budget rule**.
6. [`deployment-policy.md`](./deployment-policy.md) — GitHub -> Cloudflare Pages architecture and the formal Git-release boundary.
7. [`cloudflare-pages-deployment.md`](./cloudflare-pages-deployment.md) — Direct Upload / formal release runbook, SEO identity and quota guardrails.
8. [`/package.json`](../../../package.json) — validation, audit, build and E2E commands.
9. [`/README.md`](../../../README.md) — product purpose, data model and human-facing maintenance notes.

If a document under `../history/` conflicts with current files, current files win. For ordinary preview/build-budget behavior, `direct-upload-preview-policy.md` is the most specific authority.

## Top-level map

```text
AGENTS.md                         agent operating contract
README.md                         project/data overview for humans and agents
package.json                      executable task surface
astro.config.mjs                  Astro production configuration
playwright.config.ts              on-demand browser regression configuration
.github/                          GitHub-native configuration; no Actions workflows
docs/agents/LATEST.md             stable latest handoff
docs/agents/current/              authoritative current Agent docs
docs/agents/history/              migration/superseded architecture records
scripts/                          validation, audits, migrations and Cloudflare build entrypoint
src/                              application, content, schemas and domain logic
tests/e2e/                        Playwright browser regression tests
tests/fixtures/demo-archive/      non-production demo fixtures
reports/                          generated audit/report outputs when present
```

## `src/` map

```text
src/pages/                 Astro routes and page entrypoints
src/layouts/               shared page shell, metadata, canonical/hreflang/SEO behavior
src/components/            UI and interactive React/Astro components
src/content/models/        model checkpoint records, one JSON record per model
src/content/papers/        paper records and model references
src/content.config.ts      Astro content collection loading/configuration
src/lib/schemas.ts         Zod data contracts
src/lib/                   pure domain rules, codecs, recommendation/filter/hardware logic and tests
src/stores/                client-side application state such as Research Task state
```

When changing data shape, start from `src/lib/schemas.ts` and content configuration before touching many records. Before broad model/provider freshness work, read `model-catalog-verification-policy.md` and check both model records and family/vendor coverage indexes. When changing URL/SEO behavior, inspect `src/layouts/AppLayout.astro`, i18n/path helpers and relevant tests together. When changing interactive behavior, inspect the component plus its unit/E2E coverage rather than patching rendered output only.

## `tests/` map

```text
tests/e2e/                 Chromium/WebKit Playwright regression specs
tests/fixtures/            non-production fixtures used for examples/tests
tests/fixtures/demo-archive/ historical demo model records; never production content
```

`playwright.config.ts` points to `tests/e2e/`. Moving or renaming these paths requires updating the config and Cloudflare Build Watch Paths together.

## `scripts/` map

The repository keeps quality logic in scripts instead of tying it to a CI vendor.

Important commands are exposed through `package.json`:

- `npm run verify:deploy` — deterministic repository-local deployment gate.
- `npm run build:cloudflare` — repository-owned Cloudflare/preview build entrypoint; runs the gate and then Astro production build.
- `npm run test:e2e` — full Chromium + WebKit regression, on demand.
- `npm run audit:vendor-catalogs` — external vendor catalog audit, on demand.
- `npm run audit:urls` — external source-health probes, on demand.
- `npm run audit:coverage` — data-health/coverage report, on demand.

For ordinary previews, run the relevant deterministic checks and `build:cloudflare` locally/agent-side, then Direct Upload the prebuilt `dist`. Do not spend a hosted Git build merely to execute repository-local scripts.

## GitHub surface

GitHub is the source/review system, not the build runner.

Expected steady state:

- `main` is the Production source branch.
- `.github/workflows/` remains absent/empty.
- `.github/dependabot.yml` manages npm dependencies only.
- GitHub Pages remains retired; `/basemodel/` is not a maintained deployment base.
- ordinary Agent work may use a focused branch/PR, but Git synchronization should use Build Watch exclusions or a Cloudflare-supported skip prefix when a formal Git-integrated deployment was not requested.
- do not manufacture a deployment-sensitive final PR head just to obtain a preview; use Direct Upload instead.

## Cloudflare surface

Expected Pages project contract:

```text
Project: basemodel
Repository: mykcs/basemodel
Production branch: main
Formal Git build command: npm run build:cloudflare
Build output directory: dist
Root directory: repository root
Production base path: /
```

Default Preview path:

```text
repository-local validation/build
-> wrangler pages deploy dist --project-name=basemodel --branch=<unique-preview-branch>
-> public non-production Preview URL
```

Preview deployments must remain `noindex`. Production is the only maintained indexed identity.

Durable Build Watch exclusions are intended to cover docs, Agent files, generated reports, browser-only tests/fixtures and Playwright config while keeping production source/build inputs included. The Cloudflare dashboard remains the authority for actual current settings; `../LATEST.md` records the last known state.

## Agent collaboration rules

The owner prefers high-autonomy execution and is highly sensitive to unnecessary Cloudflare Pages Build consumption.

- inspect GitHub, repository files, PR state and available Cloudflare evidence directly when tools allow it;
- do not make the owner copy information between tools/services when the Agent can retrieve it;
- batch related edits and avoid speculative/no-op push loops;
- **default to local build + Direct Upload public Preview** for ordinary website changes;
- return the Preview URL and explicitly state `Cloudflare Pages Build triggered: yes / no / unknown`;
- if local build, Wrangler upload, authentication, Preview verification or quota evidence is unavailable, say so rather than claiming completion or safety;
- only intentionally allow a Git-connected Cloudflare Preview/Production build after the owner explicitly requests a formal Git-integrated deployment; warn about possible Pages Build consumption before doing it;
- ask the owner to intervene only at genuine human/account boundaries such as login/authorization, 2FA/CAPTCHA, billing, unavailable admin settings, or a high-risk/irreversible product decision.

## Change-to-check matrix

| Change type | Minimum local/Agent validation | Default public verification |
| --- | --- | --- |
| docs-only, no runtime semantics | inspect diff/links | no runtime Preview required; sync with no-build Git semantics |
| data/schema/domain rules | `npm run verify:deploy` | Direct Upload Preview when user-facing output changes |
| UI/component behavior | `npm run verify:deploy` + focused tests | Direct Upload Preview + visual inspection |
| routing/i18n/SEO | `npm run verify:deploy` + relevant Playwright | Direct Upload Preview + route/metadata inspection |
| Astro/React/browser compatibility major change | `npm run verify:deploy` + full `npm run test:e2e` | Direct Upload Preview before any formal release |
| vendor/source maintenance | read model-catalog policy + relevant external audits | Direct Upload if rendered content changed |
| deployment architecture | update current Agent docs + local validation | Direct Upload for ordinary validation; formal Git build only when explicitly requested |

A hosted Cloudflare Git build is no longer the default acceptance surface for normal iteration. The repository-owned checks plus a verified Direct Upload Preview are the normal day-to-day path.
