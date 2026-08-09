# Repository map for agents

Last reviewed: 2026-08-09

This file is the fast orientation map for coding agents. It explains where to look before making changes; it does not replace the authoritative deployment policy or product/design policy.

## 60-second start

Before editing this repository, read in this order:

1. [`/AGENTS.md`](../../../AGENTS.md) — repository-wide operating rules and collaboration expectations.
2. [`../LATEST.md`](../LATEST.md) — latest timestamped handoff and current state.
3. [`deployment-policy.md`](./deployment-policy.md) — authoritative GitHub -> Cloudflare Pages architecture and validation boundary.
4. [`product-vision-and-design-policy.md`](./product-vision-and-design-policy.md) — product mission, research workflow, recommendation/evidence rules, UI principles, anti-regression guidance and V3 triggers.
5. [`cloudflare-pages-deployment.md`](./cloudflare-pages-deployment.md) — Cloudflare build/deploy runbook and quota guardrails.
6. [`/package.json`](../../../package.json) — available validation, audit, build and E2E commands.
7. [`/README.md`](../../../README.md) — product purpose, data model and human-facing maintenance notes.

If a document under `../history/` conflicts with current files, current files win.

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

Important current Agent docs include:

```text
docs/agents/current/deployment-policy.md
  architecture, hosting, validation and build-budget authority

docs/agents/current/product-vision-and-design-policy.md
  durable product mission, research-decision UX, evidence semantics,
  information architecture and server-side/V3 trigger conditions

docs/agents/current/rendering-and-performance-policy.md
  static-first Astro, hydration and performance rules

docs/agents/current/cloudflare-pages-deployment.md
  operational Cloudflare Pages runbook
```

## `src/` map

```text
src/pages/                 Astro routes and page entrypoints
src/layouts/               shared page shell, metadata, canonical/hreflang/SEO behavior
src/components/            UI and interactive React/Astro components
src/content/models/        model checkpoint records, one JSON record per model
src/content/papers/        paper records and model references
src/content/claims/        claim/history primitives for evidence-backed facts
src/content/benchmarkRuns/ benchmark observations and their experimental conditions
src/content/guides/        learning/concept content
src/content/changeEvents/  time-sensitive catalog/evidence/status events
src/content.config.ts      Astro content collection loading/configuration
src/lib/schemas.ts         Zod data contracts
src/lib/                   pure domain rules, codecs, recommendation/filter/hardware logic and tests
src/stores/                client-side Research Task, candidates, compare, projects and snapshots
```

When changing data shape, start from `src/lib/schemas.ts` and content configuration before touching many records. When changing URL/SEO behavior, inspect `src/layouts/AppLayout.astro`, i18n/path helpers and relevant tests together. When changing interactive behavior, inspect the component plus its unit/E2E coverage rather than patching rendered output only.

For product-facing changes, also identify which research-decision stage is affected:

```text
define task
  -> constrain feasible models
  -> form differentiated candidates
  -> inspect fit / evidence / risks
  -> compare and analyze substitutions
  -> preserve decision record
```

If a proposed change does not support that loop, treat it as secondary to the product mission unless the owner explicitly wants a different goal.

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

- `npm run verify:deploy` — deterministic repository-local deployment gate run by Cloudflare.
- `npm run build:cloudflare` — Cloudflare build entrypoint; runs the gate and then Astro production build.
- `npm run test:e2e` — full Chromium + WebKit regression, retained for on-demand use.
- `npm run audit:v2` — deterministic V2 product-completion checks.
- `npm run audit:v2:adversarial` — adversarial probes against code-completable V2 regressions.
- `npm run audit:vendor-catalogs` — external vendor catalog audit, on demand.
- `npm run audit:urls` — external source-health probes, on demand.
- `npm run audit:coverage` — data-health/coverage report, on demand.

Do not move external-network probes or browser downloads into every Cloudflare build unless the owner deliberately changes the reliability/cost policy.

## Product and data ownership map

Use this as a starting point for common product changes:

| Change | Start here |
| --- | --- |
| Research Task steps / constraints | `src/components/workspace/task/`, `src/stores/researchTask.ts`, `src/lib/researchTaskCodec.ts` |
| Candidate recommendation / fit dimensions | `src/lib/research/`, `src/lib/researchEngine.ts`, `src/components/workspace/CandidateBoard.tsx` |
| Model substitution methodology | `src/lib/research/replacement.ts`, `src/components/workspace/SubstituteLab.tsx` |
| Decision memo / snapshot history | `src/components/workspace/DecisionMemo.tsx`, `src/lib/decisionRecord.ts`, `src/stores/snapshots.ts` |
| Model browsing / filters / quick view | `src/components/ModelExplorer.tsx`, `src/components/models/` |
| Model detail research interpretation | `src/pages/_bodies/model-detail.astro`, `src/components/models/detail/` |
| Paper case-study / reproduction UX | `src/pages/_bodies/paper-detail.astro`, `src/components/papers/` |
| Claim/evidence semantics | `src/content/claims/`, `src/components/evidence/`, `src/lib/evidence/` |
| Benchmark conditions | `src/content/benchmarkRuns/`, `src/content.config.ts`, relevant data-status/evidence views |
| Learning concepts | `src/content/guides/`, `src/pages/guide.astro`, `src/pages/en/guide.astro` |
| Landscape/family temporal views | `src/components/landscape/`, `src/components/FamilyTimeline.tsx`, `src/content/changeEvents/` |
| Global Research Context / Compare | `src/layouts/AppLayout.astro`, `src/components/workspace/ResearchContextBar.tsx`, `CompareTray.tsx`, `src/stores/` |

Do not add a parallel product state system when the relevant Nano Store/URL codec already owns that state.

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

Durable Build Watch exclusions after the repository re-layout are intended to cover docs, Agent files, generated reports, browser-only tests/fixtures and Playwright config while keeping `Include: *` as the safety net. The dashboard is the authority for the actually configured list; `../LATEST.md` records the last verified state.

## Agent collaboration rules

The owner prefers high-autonomy execution. For repository work:

- inspect GitHub, repository files, PR status and Cloudflare-visible deployment evidence directly when tools allow it;
- do not make the owner copy information between tools or services when the agent can retrieve it itself;
- batch related edits and keep the PR focused;
- avoid repeated speculative pushes; each normal Git-connected push can consume a Cloudflare Pages build;
- use `[CF-Pages-Skip]` only for intermediate commits that intentionally do not need a deployment, and ensure the final deployment-sensitive PR head receives a real Cloudflare Preview build;
- ask the owner to intervene only at genuine human/account boundaries such as login/authorization, 2FA/CAPTCHA, billing, unavailable admin settings, or a high-risk/irreversible product decision.

## Change-to-check matrix

| Change type | Minimum validation |
| --- | --- |
| docs-only, no runtime semantics | inspect diff; Cloudflare Preview may be skipped |
| product policy / information architecture docs only | inspect diff and cross-links; no runtime build required |
| data/schema/domain rules | `npm run verify:deploy` |
| UI/component behavior | `npm run verify:deploy`; add/run focused tests |
| research recommendation/substitution rules | `npm run verify:deploy` + relevant V2/adversarial tests |
| routing/i18n/SEO | `npm run verify:deploy` + relevant Playwright E2E |
| Astro/React/browser compatibility major change | `npm run verify:deploy` + full `npm run test:e2e` |
| vendor/source maintenance | relevant external audit commands on demand |
| deployment architecture | update current Agent docs + verify exact-head Preview before merge |

The Cloudflare build itself is the final automated deployment gate for normal Preview/Production releases.
