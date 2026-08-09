# Repository map for agents

Last reviewed: 2026-08-09

This file is the fast orientation map for coding agents. It explains where to look before making changes; it does not replace the authoritative deployment policy.

## 60-second start

Before editing this repository, read in this order:

1. [`/AGENTS.md`](../../AGENTS.md) — repository-wide operating rules and collaboration expectations.
2. [`deployment-policy.md`](./deployment-policy.md) — authoritative GitHub -> Cloudflare Pages architecture and validation boundary.
3. [`cloudflare-pages-deployment.md`](./cloudflare-pages-deployment.md) — Cloudflare build/deploy runbook and current quota guardrails.
4. [`/package.json`](../../package.json) — available validation, audit, build and E2E commands.
5. [`/README.md`](../../README.md) — product purpose, data model and human-facing maintenance notes.

If a dated migration/history document conflicts with these current files, the current files win.

## Top-level map

```text
AGENTS.md                  agent operating contract
README.md                  project/data overview for humans and agents
package.json               executable task surface
astro.config.mjs           Astro production configuration
playwright.config.ts       on-demand browser regression configuration
.github/                   GitHub-native configuration; no Actions workflows
docs/agents/               current agent runbooks + migration history
scripts/                   validation, audits, migrations and Cloudflare build entrypoint
src/                       application, content, schemas and domain logic
e2e/                       Playwright browser regression tests
reports/                   generated audit/report outputs when present
demo-archive/              test/archive fixtures; not production content
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

When changing data shape, start from `src/lib/schemas.ts` and content configuration before touching many records. When changing URL/SEO behavior, inspect `src/layouts/AppLayout.astro`, i18n/path helpers and relevant route tests together. When changing interactive behavior, inspect the component plus its unit/E2E coverage rather than patching rendered output only.

## `scripts/` map

The repository keeps quality logic in scripts instead of tying it to a CI vendor.

Important commands are exposed through `package.json`:

- `npm run verify:deploy` — deterministic repository-local deployment gate run by Cloudflare.
- `npm run build:cloudflare` — Cloudflare build entrypoint; runs the gate and then Astro production build.
- `npm run test:e2e` — full Chromium + WebKit regression, retained for on-demand use.
- `npm run audit:vendor-catalogs` — external vendor catalog audit, on demand.
- `npm run audit:urls` — external source-health probes, on demand.
- `npm run audit:coverage` — data-health/coverage report, on demand.

Do not move external-network probes or browser downloads into every Cloudflare build unless the owner deliberately changes the reliability/cost policy.

## GitHub surface

GitHub is the source/review system, not the build runner.

Expected steady state:

- `main` is the Production source branch.
- non-trivial work uses `agent/<description>` branch -> PR -> Cloudflare Preview -> merge -> Production.
- `.github/workflows/` remains absent/empty.
- `.github/dependabot.yml` manages npm dependencies only.
- GitHub Pages remains retired; `/basemodel/` is not a maintained deployment base.

## Cloudflare surface

Expected Pages project contract:

```text
Project: basemodel
Repository: mykcs/basemodel
Production branch: main
Build command: npm run build:cloudflare
Build output directory: dist
Root directory: repository root
Production base path: /
```

Preview deployments must remain `noindex`. Production is the only maintained indexed identity.

## Agent collaboration rules

The owner prefers high-autonomy execution. For repository work:

- inspect GitHub, repository files, PR status and Cloudflare-visible deployment evidence directly when tools allow it;
- do not make the owner copy information between tools or services when the agent can retrieve it itself;
- batch related edits and keep the PR focused;
- avoid repeated speculative pushes; each normal Git-connected push can consume a Cloudflare Pages build;
- use `[CF-Pages-Skip]` only for intermediate commits that intentionally do not need a deployment, and ensure the final PR head receives a real Cloudflare Preview build;
- ask the owner to intervene only at genuine human/account boundaries such as login/authorization, 2FA/CAPTCHA, billing, unavailable admin settings, or a high-risk/irreversible product decision.

## Change-to-check matrix

| Change type | Minimum validation |
| --- | --- |
| docs-only, no runtime semantics | inspect diff; Cloudflare Preview may be skipped for intermediate commits |
| data/schema/domain rules | `npm run verify:deploy` |
| UI/component behavior | `npm run verify:deploy`; add/run focused tests |
| routing/i18n/SEO | `npm run verify:deploy` + relevant Playwright E2E |
| Astro/React/browser compatibility major change | `npm run verify:deploy` + full `npm run test:e2e` |
| vendor/source maintenance | relevant external audit commands on demand |
| deployment architecture | update current agent docs + verify exact-head Preview before merge |

The Cloudflare build itself is the final automated deployment gate for normal Preview/Production releases.