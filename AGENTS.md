# Repository Agent instructions

This repository is frequently maintained by coding Agents through GitHub. Keep this root file as a **fast router + non-negotiable project invariants**; detailed current policy belongs under `docs/agents/current/` rather than being duplicated here.

## Fast start

Before non-trivial work, read in this order:

1. [`docs/agents/LATEST.md`](docs/agents/LATEST.md) — fixed-path current handoff and deployment state.
2. [`docs/agents/README.md`](docs/agents/README.md) — Agent documentation map and precedence.
3. [`docs/agents/current/project-agent-operating-principles.md`](docs/agents/current/project-agent-operating-principles.md) — project-wide standards for autonomous problem solving, clean workflow design, and selective deposition of reusable experience.
4. [`docs/agents/current/scenario-trigger-registry.md`](docs/agents/current/scenario-trigger-registry.md) — **scan this against the current task and automatically load/execute the matched scenario guidance without waiting for the owner to repeat it.**
5. [`docs/agents/current/product-and-research-integrity.md`](docs/agents/current/product-and-research-integrity.md) — product north star and false-complete rules.
6. [`docs/agents/current/ui-design-principles.md`](docs/agents/current/ui-design-principles.md) — required baseline for comfortable, readable, learning-first UI and responsive desktop/mobile behavior.
7. [`docs/agents/current/model-catalog-verification-policy.md`](docs/agents/current/model-catalog-verification-policy.md) — required for current/latest model-family or evidence changes.
8. [`docs/agents/current/vercel-preview-migration-plan.md`](docs/agents/current/vercel-preview-migration-plan.md) — Vercel Preview + Production workflow.
9. [`docs/agents/current/deployment-policy.md`](docs/agents/current/deployment-policy.md) — release/Production boundary.
10. [`docs/agents/current/repository-map.md`](docs/agents/current/repository-map.md) — detailed ownership/change-to-check map.
11. `package.json`, `vercel.json`, config, source and task-specific tests — executable truth.

Files under `docs/agents/history/` are evidence and rationale, not instructions to restore previous architecture.

When account-level shared Agent conventions are available, they supplement this repository. Project facts and project-specific constraints remain canonical here.

## Knowledge precedence

```text
current user instruction
> live provider state for provider-side claims
> executable repository truth (code/config/tests/manifests)
> docs/agents/current/*
> docs/agents/LATEST.md
> historical handoffs / archives
```

If two current documents disagree, resolve the disagreement against executable/live truth and update the stale document. Do not add another contradictory policy layer.

## Current deployment architecture

```text
GitHub = source of truth

non-main branch / PR
  -> Vercel project `basemodel-preview`
  -> npm run verify:deploy
  -> npm run build
  -> protected Vercel Preview

main
  -> Vercel project `basemodel-preview` Production
  -> https://basemodel-preview.vercel.app

Cloudflare Pages
  -> frozen legacy rollback snapshot
  -> normal Git Builds = 0
```

Cloudflare Direct Upload and the Workers shadow remain supported fallback / Cloudflare-specific diagnostic paths. They are not ordinary Preview or Production paths.

GitHub Actions and GitHub Pages remain intentionally retired. Astro/React remain the application stack; do not rewrite them merely because deployment ownership changed.

## Repository map

```text
src/                         production application/content/domain logic
public/                      production static assets
scripts/                     build, validation, audit and retained provider helpers
tests/e2e/                   browser regression tests
tests/fixtures/demo-archive/ non-production fixtures
docs/agents/current/         authoritative current Agent policies/runbooks/maps
docs/agents/history/         migration/incident/superseded records
docs/agents/LATEST.md        stable current handoff
vercel.json                  Vercel Preview + Production contract
wrangler.jsonc               dormant Workers shadow option
package.json                 executable validation/build entrypoints
```

Do not move production directories merely for visual uniformity, and do not treat generated output, archive fixtures or Agent scratch state as production source.

## Validation

For ordinary deployable changes, the repository-owned deterministic Gate is:

```bash
npm run verify:deploy
npm run build
```

`verify:deploy` includes the repository's check/validation/semantic/evidence/test/V2/hardening gates. Do not weaken these audits merely to make a deployment pass.

Run full browser suites or third-party network/vendor audits when the changed surface requires them; they are not automatically part of every blocking hosted build.

## Ordinary Agent workflow

```text
read LATEST + current policy
-> scan scenario-trigger-registry and load matched guidance
-> inspect overlapping PRs and relevant code/data/tests
-> make one focused branch/PR
-> let Vercel create the exact-head non-main Preview
-> verify build logs and inspect real Preview route(s)
-> synchronize with current main when needed
-> merge/release with [CF-Pages-Skip] while legacy Pages Git integration still exists
-> let Vercel create Production from main
-> verify https://basemodel-preview.vercel.app separately
```

Because the repository is private, normal Vercel Preview URLs may require Vercel authentication. When the owner needs anonymous review access, generate a temporary share link through the connected Vercel capability instead of disabling protection for convenience.

## Cloudflare zero-build boundary

**Cloudflare Pages Build = 0 for normal development and releases.** Do not intentionally trigger a Cloudflare Pages Git Preview or Production build unless the owner has first been told why Cloudflare-specific execution is necessary and explicitly authorizes it.

Until the Cloudflare account-side Git integration is disabled, branch synchronization and merge/release commits use `[CF-Pages-Skip]` / another documented skip prefix so Vercel can deploy without waking the frozen Pages builder.

Cloudflare Direct Upload is appropriate only when Cloudflare-specific fidelity is under test, Vercel cannot answer the question, or a `pages.dev` Preview is explicitly required. Never store provider tokens in Git.

Do not claim an exact account-level build counter without authoritative provider evidence.

## Product / research-integrity invariants

Preserve these even when simplifying UI or data flows:

- this is a research decision system, not merely a leaderboard/model database;
- strict reproduction, method reproduction and modern rerun are distinct;
- unknown must remain unknown rather than guessed;
- open weights are not automatically open source or unrestricted licensing;
- heuristic resource estimates, catalog tiers and measured hardware results are distinct evidence levels;
- current/latest/full-family claims require current first-party verification;
- “done” means wired into the real user path and protected by acceptance checks, not merely a component/file existing.

For all user-facing UI work, also follow [`docs/agents/current/ui-design-principles.md`](docs/agents/current/ui-design-principles.md): the interface should be comfortable and readable for learning, and responsive behavior across desktop and mobile is a completion requirement rather than optional polish.

Read the detailed current product/model policies before broad UI/data/recommendation changes.

## Stable technical constraints

- Preserve Vercel Preview `noindex` and Vercel Production canonical/hreflang identity.
- Keep `PUBLIC_SITE_URL` / search-indexing semantics aligned with the current deployment policies.
- Keep Node type/tooling majors aligned with the repository's declared Node target.
- Astro/React/TypeScript/Vitest/Playwright major upgrades are deliberate migration work, not routine dependency churn.
- Keep Astro `compressHTML: true` unless inline-whitespace behavior has been explicitly audited/migrated; regression coverage protects this contract.
- Do not reintroduce retired GitHub Pages compatibility/config or Actions infrastructure without an explicit architecture decision.

## Collaboration expectations

Prefer autonomous end-to-end execution using connected repository/provider evidence. Do not make the owner relay logs, URLs or status between tools when the Agent can retrieve them directly. If one tool path fails, try another available path before requesting human intervention.

For the durable project-level standard on expanding the solution space, keeping ownership/tooling clean, and deciding whether/where experience deserves persistence, follow [`docs/agents/current/project-agent-operating-principles.md`](docs/agents/current/project-agent-operating-principles.md) rather than creating a second governance layer.

For recurring situations that should trigger without a fresh reminder from the owner, scan [`docs/agents/current/scenario-trigger-registry.md`](docs/agents/current/scenario-trigger-registry.md) and follow the matched route. Keep detailed truth in the owning policy/runbook/test; the registry is a trigger router, not a duplicate knowledge store.

Human intervention is appropriate for real authorization/2FA/CAPTCHA/billing boundaries, irreversible/high-risk actions, or subjective product decisions.

Completion reports must distinguish source synchronization, validation, Preview state, merge, Vercel Production state and Cloudflare rollback state. A successful source diff or READY badge alone is not proof that the intended production outcome happened.

## Documentation maintenance

Update `docs/agents/LATEST.md` in place when current state changes materially. Update the owning file under `docs/agents/current/` when architecture, validation, deployment, evidence semantics or repository ownership changes.

Do not duplicate those detailed policies back into this root file. The purpose of `AGENTS.md` is to get a new Agent onto the correct current documents quickly.
