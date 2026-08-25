# Repository Agent instructions

## Historical Codex dialogue archive

When prior product, deployment, or research-workbench decisions are relevant,
consult the private [basemodel dialogue archive](https://github.com/mykcs/Codex-Dialogue/tree/main/projects/basemodel).
It is historical evidence only and never overrides current task instructions,
executable repository truth, or live provider state.

This repository is frequently maintained by coding Agents through GitHub. Keep this root file as a **fast router + non-negotiable project invariants**; detailed current policy belongs under `docs/agents/current/` rather than being duplicated here.

## Fast start

Before non-trivial work, read the small core below in this order, then use the task router in `docs/agents/README.md` to load only the specialized policies that match the task:

1. [`docs/agents/LATEST.md`](docs/agents/LATEST.md) — fixed-path current handoff and provider/release state.
2. [`docs/agents/README.md`](docs/agents/README.md) — task router, documentation ownership, and precedence.
3. [`docs/agents/current/project-agent-operating-principles.md`](docs/agents/current/project-agent-operating-principles.md) — autonomous problem solving, clean workflow design, and reusable experience.
4. [`docs/agents/current/website-engineering-standard.md`](docs/agents/current/website-engineering-standard.md) — accepted stack, semantic ownership, rendering, browser, exact-tree evidence, and build-budget defaults.
5. [`docs/agents/current/scenario-trigger-registry.md`](docs/agents/current/scenario-trigger-registry.md) — scan against the current task and automatically load the matched guidance.
6. [`docs/agents/current/human-thinking-web-expression-contract.md`](docs/agents/current/human-thinking-web-expression-contract.md) — **mandatory for every user-facing page change** that affects meaning, copy, structure, comparison, explanation, or interaction.

Do not maintain another long universal reading list here. UI, research, deployment, security, model-catalog, lab-compute, and release-specific documents are selected through `docs/agents/README.md` and the scenario registry. Existing visual contracts remain directly discoverable here for non-drift protection: [`docs/agents/current/ui-design-principles.md`](docs/agents/current/ui-design-principles.md) and [`docs/agents/current/sitewide-visual-knowledge-architecture.md`](docs/agents/current/sitewide-visual-knowledge-architecture.md). Load them through the task router when the task changes UI or visual structure.

Files under `docs/agents/history/` and `docs/agent-context/` are evidence and rationale, not instructions to restore previous architecture. The older product-vision document from PR #64 is retained under history; current product authority is the executable product plus the current integrity, research-mission, visual and deployment policies.

When account-level shared Agent conventions are available, they supplement this repository. Project facts and project-specific constraints remain canonical here.

When a task involves lab connectivity, remote compute, SSH/SFTP/rsync, or hardware disclosure, read [`docs/agents/current/personal-compute-profile-consumer.md`](docs/agents/current/personal-compute-profile-consumer.md). Base Model stores only a generic public topology: never add the owner's personal device inventory, private profile feed, IP/hostname/username, VPN endpoint, access token or other identifying infrastructure detail. Publish only the minimum aggregate hardware facts required for a reproducible experiment.

## Reader-facing reasoning invariant

Natural language is not enough if the reader still has to ask **“你为什么这样说？” / “Why do you say that?”** and the first answer is hidden in an appendix, `<details>`, run log, or source link.

For any material reader-facing **research conclusion, comparison, diagnosis, causal interpretation, validity judgement, or next-step decision**, the visible mainline must expose a minimum reasoning bridge:

```text
what we observed
-> what that observation supports
-> what it still does not establish
```

Detailed counts, confidence intervals, run IDs, manifests, and code can stay in progressive disclosure. The first-layer reason cannot. Definitions, direct instructions, neutral labels, and simple source facts do not need a forced inference chain.

For research copy, the detailed owner is [`docs/agents/current/research-editorial-style.md`](docs/agents/current/research-editorial-style.md). For the SEED × OpenEvo Results route, also read [`docs/agents/current/seed-openevo-results-reader-contract.md`](docs/agents/current/seed-openevo-results-reader-contract.md). Protect recurring reader-facing boundaries with executable tests when practical.

## Knowledge precedence

```text
current user instruction
> live provider state for provider-side claims
> executable repository truth (code/config/tests/manifests)
> docs/agents/current/*
> docs/agents/LATEST.md
> historical handoffs / archives / docs/agent-context
```

If two current documents disagree, resolve the disagreement against executable/live truth and update the stale document. Do not add another contradictory policy layer.

## Current product mission

The site is a research decision system centered on a concrete mission:

```text
Base Model
-> SEED / OpenEvo
-> ALFWorld / WebShop
-> trajectories, scores and failures
-> defensible OpenEvo improvements
```

Preserve Learn / Run / Compare as distinct entry modes. Keep ALFWorld success-rate semantics separate from WebShop normalized score/exact success. Keep environment readiness, real model action, real evolution, comparable results and causal improvement as different evidence levels.

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
```

**Vercel is the only ordinary deployment provider.** Historical Cloudflare files, snapshots and fallback scripts are not part of normal Preview, release, Production verification, quota reporting or completion reports. Load them only for an explicitly legacy-hosting, rollback or retirement task, or when live evidence shows unexpected legacy-provider activity.

GitHub Actions and GitHub Pages remain intentionally retired. Astro/React remain the application stack; do not rewrite them merely because deployment ownership changed.

## Repository map

```text
src/                         production application/content/domain logic
public/                      production static assets
scripts/                     build, validation and audit helpers
tests/e2e/                   browser regression tests
tests/fixtures/demo-archive/ non-production fixtures
docs/agents/current/         authoritative current Agent policies/runbooks/maps
docs/agents/history/         migration/incident/superseded records
docs/agent-context/          retained historical research-workbench context
docs/agents/LATEST.md        stable current handoff
vercel.json                  Vercel Preview + Production contract
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

For theme, CSS, layout, responsive, navigation, typography, animation, i18n-length, or shared visual changes, follow the UI acceptance policy and run the strongest available browser matrix:

```bash
npm run test:ui
npm run test:ui:all   # shared/global/theme/cross-browser changes
```

Full browser suites or third-party network/vendor audits remain on demand when the changed surface requires them; they are not automatically part of every blocking hosted build.

## Ordinary Agent workflow

```text
read LATEST + core current policy
-> use docs/agents/README.md task router
-> scan scenario-trigger-registry and load matched guidance
-> inspect overlapping PRs and relevant code/data/tests
-> classify independent, stacked, superseded and semantically conflicting work
-> finish one coherent change or one explicit integration/release head before the first provider-triggering push
-> publish one atomic multi-file branch update when possible
-> let Vercel create the exact-head non-main Preview
-> verify build logs and inspect real Preview route(s)
-> batch evidence-driven fixes into at most one normal corrective push
-> synchronize with current main only when materially required
-> merge the accepted release to main once
-> let Vercel create one Production deployment for the accepted release batch
-> verify https://basemodel-preview.vercel.app separately
```

A clean Git merge is not combined-product acceptance. When several PRs belong to one release, use the parallel/stacked integration policy in `deployment-policy.md`; preserve attribution and ancestry, but resolve the final file tree by current product intent, executable invariants and current provider truth.

Protected Vercel Preview URLs may require authentication. When the owner needs anonymous review access, generate a temporary share link through the connected Vercel capability, deliver it only through an ephemeral review/chat surface, and never persist the URL or `_vercel_share` parameter in repository files, PR/Issue bodies, or GitHub comments.

## Vercel build-budget boundary

Vercel deployments/builds are finite resources. Optimize provider-triggering ref updates, not only build duration.

Default target for one coherent feature or accepted release batch:

```text
one branch / integration PR
-> one atomic push
-> one initial Preview
-> at most one corrective Preview after real inspection
-> one Production build per accepted release batch
```

Do not push every typo, file write, speculative experiment or intermediate thought. Reuse the same PR for corrections. Prefer a worktree or one Git data API commit (`blob -> tree -> commit -> ref`) over sequential Contents API writes.

Ordinary completion reports are **Vercel-first** and report, when live evidence is available:

```text
Vercel deployment triggers: total
READY / ERROR / CANCELED / ignored or skipped
exact-head Preview acceptance
merge commit
Production deployment and public verification
```

Do not add a Cloudflare line merely because historical config exists. Mention a legacy provider only when the task explicitly concerns it, it changed, or live provider evidence shows unexpected activity.

A legacy external Git integration may still require an existing skip prefix until it is disabled account-side. Treat that as a silent compatibility safeguard, not as an ordinary deployment stage or reporting requirement.

## Product / research-integrity invariants

Preserve these even when simplifying UI or data flows:

- this is a research decision system, not merely a leaderboard/model database;
- strict reproduction, method reproduction and modern rerun are distinct;
- unknown must remain unknown rather than guessed;
- open weights are not automatically open source or unrestricted licensing;
- heuristic resource estimates, catalog tiers and measured hardware results are distinct evidence levels;
- current/latest/full-family claims require current first-party verification;
- “done” means wired into the real user path and protected by acceptance checks, not merely a component/file existing;
- a visualization must externalize order, hierarchy, comparison, evidence, decision, failure, topology or executable action; decoration alone is not justification;
- the owner must not become the first real dark-mode, overlap, clipping, responsive or theme-transition tester.

For all user-facing UI work, follow the human-thinking expression contract, UI design principles, sitewide visual architecture, theme contract and browser acceptance gate. Responsive behavior across desktop and mobile is a completion requirement rather than optional polish.

Read the detailed current product/model policies before broad UI/data/recommendation changes.

## Stable technical constraints

- Preserve Vercel Preview `noindex` and Vercel Production canonical/hreflang identity.
- Keep `PUBLIC_SITE_URL` / search-indexing semantics aligned with the current deployment policies.
- Keep Node type/tooling majors aligned with the repository's declared Node target.
- Astro/React/TypeScript/Vitest/Playwright major upgrades are deliberate migration work, not routine dependency churn.
- Keep Astro `compressHTML: true` unless inline-whitespace behavior has been explicitly audited/migrated; regression coverage protects this contract.
- Do not reintroduce retired GitHub Pages compatibility/config or Actions infrastructure without an explicit architecture decision.
- Keep the Public Release Security Gate fail-closed: private → public requires a complete all-ref/full-history secret scan with zero unresolved real secrets.

## Collaboration expectations

Prefer autonomous end-to-end execution using connected repository/provider evidence. Do not make the owner relay logs, URLs or status between tools when the Agent can retrieve them directly. If one tool path fails, try another available path before requesting human intervention.

For the durable project-level standard on expanding the solution space, keeping ownership/tooling clean, and deciding whether/where experience deserves persistence, follow [`docs/agents/current/project-agent-operating-principles.md`](docs/agents/current/project-agent-operating-principles.md) rather than creating a second governance layer.

For the cross-cutting website implementation standard, follow [`docs/agents/current/website-engineering-standard.md`](docs/agents/current/website-engineering-standard.md). It summarizes the accepted technical baseline and stopping rules, while detailed CSS/rendering/browser/deployment contracts remain with their existing owners.

For recurring situations that should trigger without a fresh reminder from the owner, scan [`docs/agents/current/scenario-trigger-registry.md`](docs/agents/current/scenario-trigger-registry.md) and follow the matched route. Keep detailed truth in the owning policy/runbook/test; the registry is a trigger router, not a duplicate knowledge store.

Human intervention is appropriate for real authorization/2FA/CAPTCHA/billing boundaries, irreversible/high-risk actions, or subjective product decisions.

Completion reports must distinguish source synchronization, repository validation, Vercel trigger counts/status, exact-head Preview acceptance, merge, worker-PR disposition and Vercel Production acceptance. A successful source diff or READY badge alone is not proof that the intended production outcome happened.

## Documentation maintenance

Update `docs/agents/LATEST.md` in place when current state changes materially. Update the owning file under `docs/agents/current/` when architecture, validation, deployment, evidence semantics or repository ownership changes.

Do not duplicate those detailed policies back into this root file. The purpose of `AGENTS.md` is to get a new Agent onto the correct current documents quickly.
