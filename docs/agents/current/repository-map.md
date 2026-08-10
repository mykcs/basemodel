# Repository map for agents

Last reviewed: 2026-08-11

This file is the fast orientation map for coding Agents. It explains where to look before making changes; it does not replace the authoritative current policy files.

## 60-second start

Before editing this repository, read in this order:

1. [`/AGENTS.md`](../../../AGENTS.md) — repository-wide operating rules and collaboration expectations.
2. [`../LATEST.md`](../LATEST.md) — latest handoff and current provider/deployment state.
3. [`project-agent-operating-principles.md`](./project-agent-operating-principles.md) — proactive problem solving, clean ownership, and selective experience deposition.
4. [`scenario-trigger-registry.md`](./scenario-trigger-registry.md) — scan situation cues and load only matched guidance.
5. [`hosting-architecture.md`](./hosting-architecture.md) — current-vs-target hosting authority.
6. [`vercel-preview-migration-plan.md`](./vercel-preview-migration-plan.md) — **default ordinary Preview workflow**.
7. [`product-and-research-integrity.md`](./product-and-research-integrity.md) — durable product/research-integrity contract.
8. [`model-catalog-verification-policy.md`](./model-catalog-verification-policy.md) — required before broad current-model/family audits or evidence-semantics changes.
9. [`deployment-policy.md`](./deployment-policy.md) — formal Preview/Production/release boundaries.
10. [`/package.json`](../../../package.json), [`/vercel.json`](../../../vercel.json), and task-specific source/tests — executable truth.

If documents disagree, follow the precedence in `/AGENTS.md`: current user instruction > live provider state for provider claims > executable truth > current policy > latest handoff > history. Correct stale `current/` material instead of leaving contradictory instructions in place.

## Top-level map

```text
AGENTS.md                         Agent router + non-negotiable invariants
CLAUDE.md                         thin provider adapter importing AGENTS.md
README.md                         project/data overview for humans and Agents
package.json                      executable task surface
astro.config.mjs                  Astro production configuration
vercel.json                       ordinary non-main Preview contract
wrangler.jsonc                    Cloudflare Workers Static Assets shadow/target config
.github/                          GitHub-native configuration; no Actions workflows
docs/agents/LATEST.md             stable latest handoff
docs/agents/current/              authoritative current Agent docs/runbooks/maps
docs/agents/history/              migration/incident/explanatory evidence
scripts/                          validation, audits, migrations and provider build helpers
src/                              application, content, schemas and domain logic
tests/                            browser/fixture regression surfaces
reports/                          generated audit/report outputs when present
```

Do not create a second `agent-context`, `memory`, or governance tree merely to preserve a conversation. Reuse the current structure and route durable situation-specific knowledge through `scenario-trigger-registry.md` when it has earned reuse value.

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

When changing data shape, start from `src/lib/schemas.ts` and content configuration before touching many records. Before broad model/provider freshness work, read `model-catalog-verification-policy.md`. When changing URL/SEO behavior, inspect `src/layouts/AppLayout.astro`, i18n/path helpers and relevant tests together. When changing interactive behavior, inspect the component plus its unit/E2E coverage rather than patching rendered output only.

## `tests/` and executable regression map

```text
src/lib/*.test.ts                             domain and lightweight repository invariants
src/lib/agentScenarioTriggerRegistry.test.ts Agent router/trigger-registry invariant
tests/e2e/                                   Chromium/WebKit Playwright regression specs
tests/fixtures/                              non-production fixtures used for examples/tests
tests/fixtures/demo-archive/                 historical demo model records; never production content
```

The Agent-routing regression is intentionally small: it protects discovery/activation wiring and selected high-cost triggers, not every sentence of Agent documentation. Detailed policy remains prose-owned and should not be copied wholesale into tests.

## `scripts/` and validation surface

The repository keeps quality logic in scripts instead of tying it to GitHub Actions.

Important commands exposed through `package.json` include:

- `npm run verify:deploy` — deterministic repository-local deployment Gate;
- `npm run build` — Astro static build;
- `npm run build:cloudflare` — current Cloudflare Pages formal build entrypoint while Pages remains Production;
- `npm run build:workers:shadow` — Workers Static Assets shadow artifact path during migration;
- `npm run preview:cloudflare` — repository-owned Direct Upload helper for fallback / Cloudflare-specific validation;
- `npm run test:e2e` — full Chromium + WebKit regression, on demand;
- `npm run audit:vendor-catalogs` / `audit:urls` / `audit:coverage` — broader external/data-health maintenance audits, on demand.

Do not weaken deterministic audits just to obtain a green hosted build. When a Gate fails, first decide whether it is protecting a still-valid invariant.

## GitHub surface

GitHub is the source/review system, not the build runner.

Expected current state:

- `main` is the Production source branch;
- `.github/workflows/` remains absent/empty;
- GitHub Pages remains retired;
- ordinary Agent work uses one focused branch/PR after inspecting overlap;
- intermediate branch commits may use the documented Cloudflare skip prefix so ordinary iteration does not intentionally spend a Pages Git build;
- before final acceptance, compare the PR branch with current `main`; if the base moved materially, synchronize and revalidate the exact new head;
- do not create a new PR when an existing current PR safely owns the same user goal.

## Ordinary Preview surface — Vercel

Current default:

```text
GitHub non-main branch / PR
-> Vercel project `basemodel-preview`
-> npm run verify:deploy
-> npm run build
-> protected Preview
```

`vercel.json` is executable authority for the Preview build and for disabling Vercel deployment on `main`.

Because the repository is private, Deployment Protection may require authentication. When the owner needs a click-through anonymous review path, generate a temporary share link through the connected Vercel capability. Do not store expiring share URLs as long-lived documentation.

A READY deployment is not sufficient evidence for user-facing acceptance by itself. Confirm the exact commit, Gate/build logs, and real route/interaction/metadata required by the change.

## Cloudflare surface

Current vs target:

```text
CURRENT Production: Cloudflare Pages -> https://basemodel.pages.dev
TARGET Production:  Cloudflare Workers Static Assets after explicit cutover
```

Cloudflare Direct Upload remains a supported fallback and Cloudflare-specific integration Preview. It is not the ordinary first-choice Preview while Vercel is available.

Workers shadow/parity work does not implicitly authorize Production cutover. Read `hosting-architecture.md` and `deployment-policy.md` before changing Production routing/identity.

Do not claim an exact account-level Cloudflare build counter without authoritative provider evidence.

## Agent collaboration rules

The owner prefers high-autonomy execution and low unnecessary provider-build consumption.

- inspect GitHub, current policy, PR state and provider evidence directly when tools allow it;
- do not make the owner relay logs, URLs or state between services when the Agent can retrieve them;
- batch related edits and avoid speculative/no-op push loops;
- use Vercel Preview for ordinary website validation;
- use Cloudflare Direct Upload only for fallback / Cloudflare-specific fidelity when appropriate;
- distinguish source, deterministic validation, Preview, browser acceptance and Production in completion reports;
- ask the owner to intervene only at genuine human/account boundaries or explicit subjective/irreversible decisions;
- re-scan `scenario-trigger-registry.md` when task state changes instead of continuing from a stale plan automatically.

## Change-to-check matrix

| Change type | Minimum repository validation | Default public verification |
| --- | --- | --- |
| docs/Agent-only, no runtime semantics | inspect diff, links, precedence; Agent-routing test when practical | no runtime Preview required; keep Cloudflare skip/no-build semantics |
| data/schema/domain rules | `npm run verify:deploy` | Vercel Preview when rendered/runtime behavior changes |
| UI/component behavior | `npm run verify:deploy` + focused tests | exact-head Vercel Preview + visual/interaction inspection |
| routing/i18n/SEO | `npm run verify:deploy` + relevant Playwright | exact-head Vercel Preview + route/metadata inspection |
| Astro/React/browser compatibility major change | `npm run verify:deploy` + full `npm run test:e2e` | exact-head Vercel Preview before release |
| vendor/source maintenance | read model-catalog policy + relevant external audits | Vercel Preview if rendered content changed |
| deployment architecture | update current Agent docs + repository/provider validation | Vercel for ordinary Preview; provider-specific shadow/Direct Upload only when the architecture task requires it |
| Production hosting cutover | current hosting/deployment policy + rollback + explicit owner intent | verify the real public Production route after cutover |

The default acceptance path can change again in the future. If it does, update this map and the owning current docs in the same architecture change; do not leave an obsolete default in `current/` and hope precedence rules compensate forever.
