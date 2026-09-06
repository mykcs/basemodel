# Repository Agent instructions

## Historical Codex dialogue archive

When prior product, deployment, or research-workbench decisions are relevant,
consult the private [basemodel dialogue archive](https://github.com/mykcs/Codex-Dialogue/tree/main/projects/basemodel).
It is historical evidence only and never overrides current task instructions,
executable repository truth, or live provider state.

This repository is frequently maintained by coding Agents through GitHub. Keep this root file as a **fast router + non-negotiable project invariants**; detailed current policy belongs under `docs/agents/current/` rather than being duplicated here.

## Fast start

Before non-trivial work, read in this order:

1. [`docs/agents/LATEST.md`](docs/agents/LATEST.md) — fixed-path current handoff and deployment state.
2. [`docs/agents/README.md`](docs/agents/README.md) — Agent documentation map and precedence.
3. [`docs/agents/current/project-agent-operating-principles.md`](docs/agents/current/project-agent-operating-principles.md) — project-wide standards for autonomous problem solving, clean workflow design, and selective deposition of reusable experience.
4. [`docs/agents/current/website-engineering-standard.md`](docs/agents/current/website-engineering-standard.md) — cross-cutting website engineering defaults: accepted stack, semantic ownership, static-first/hydration discipline, browser runner boundaries, exact-tree release evidence, build-budget discipline, temporary-harness cleanup, and the stopping rule against unrequested optimization churn.
5. [`docs/agents/current/scenario-trigger-registry.md`](docs/agents/current/scenario-trigger-registry.md) — scan this against the current task and automatically load/execute the matched scenario guidance without waiting for the owner to repeat it.
6. [`docs/agents/current/product-and-research-integrity.md`](docs/agents/current/product-and-research-integrity.md) — product north star and false-complete rules.
7. [`docs/agents/current/human-thinking-web-expression-contract.md`](docs/agents/current/human-thinking-web-expression-contract.md) — **mandatory for every user-facing page**, section, copy, navigation, comparison, explanation, or feature change. For research publication work, also read [`docs/agents/current/research-site-presentation-contract.md`](docs/agents/current/research-site-presentation-contract.md): keep results and interpretation visible, and place copy/paste implementation depth behind progressive disclosure.
8. [`docs/agents/current/website-design-spec.md`](docs/agents/current/website-design-spec.md) — **canonical for every user-facing copy task**: defines “说人话 / 去 AI 味”, subject-first headings, natural technical language, evidence layering, and current preference precedence; use its companion case library when tone is explicitly at issue.
9. [`docs/agents/current/ui-design-principles.md`](docs/agents/current/ui-design-principles.md) and [`docs/agents/current/sitewide-visual-knowledge-architecture.md`](docs/agents/current/sitewide-visual-knowledge-architecture.md) — learning-first responsive UI and the whole-site knowledge journey.
10. [`docs/agents/current/ui-change-visual-acceptance-gate.md`](docs/agents/current/ui-change-visual-acceptance-gate.md) and [`docs/agents/current/theme-contrast-contract.md`](docs/agents/current/theme-contrast-contract.md) — required browser/theme/layout acceptance for UI work.
11. [`docs/agents/current/seed-openevo-research-mission-first-principles.md`](docs/agents/current/seed-openevo-research-mission-first-principles.md), [`docs/agents/current/reproduction-guide-design-principles.md`](docs/agents/current/reproduction-guide-design-principles.md), and [`docs/agents/current/audience-centered-technical-copy.md`](docs/agents/current/audience-centered-technical-copy.md) when changing the current SEED × OpenEvo mission, reproduction flow, or technical copy.
12. [`docs/agents/current/model-catalog-verification-policy.md`](docs/agents/current/model-catalog-verification-policy.md) — required for current/latest model-family or evidence changes.
13. [`docs/agents/current/hosting-architecture.md`](docs/agents/current/hosting-architecture.md) and [`docs/agents/current/deployment-policy.md`](docs/agents/current/deployment-policy.md) — current CircleCI CI authority, Mac fallback boundary, Vercel Preview + Production workflow, build budget, parallel integration, release and Production boundary.
14. [`docs/agents/current/public-release-security-gate.md`](docs/agents/current/public-release-security-gate.md) — required before any private → public visibility change.
15. [`docs/agents/current/repository-map.md`](docs/agents/current/repository-map.md) — detailed ownership/change-to-check map.
16. `package.json`, `vercel.json`, config, source and task-specific tests — executable truth.

Files under `docs/agents/history/` and `docs/agent-context/` are evidence and rationale, not instructions to restore previous architecture. The older product-vision document from PR #64 is retained under history; current product authority is the executable product plus the current integrity, research-mission, visual and deployment policies.

### Pre-mutation guards for repeatedly escaped failures

Before creating a branch, running compound local/remote shell automation, or mutating shared experiment-server storage:

- **Preview first, branch second.** Decide whether exact-head Vercel Preview acceptance is required **before** choosing the branch prefix. If it is required, load `branch-and-pr-conventions.md` and use a deployment-eligible ref; do not create `docs/**` first and discover the policy only after the missing Preview.
- **Name the shell when syntax matters.** If a command depends on Bash semantics (`VAR=value`, `set -euo pipefail`, loops, arrays, heredocs, process substitution), set the execution tool's shell/interpreter to `/bin/bash` or run a standalone Bash/Python script explicitly. Do not assume an inner `bash -lc` protects a complex command from an outer `fish` parser; nested quoting can fail before Bash starts. A parser failure under `fish` is an execution-surface failure, not repository or server failure.
- **Shared storage begins read-only.** A model/checkpoint/run is protected by future planned use as well as current process references. “Not mounted/open right now” is never deletion authority. For snapshot-only work load `server-storage-pressure-audit-sop.md`; for the end-to-end organize → passport → publish/verify → reclaim workflow load `server-artifact-governance-and-reclaim-sop.md` as well.
- **Incomplete namespace is not a complete inventory.** If the currently authorized view exposes only a subset of expected homes, do not enter sibling-user containers or exercise Docker/admin mount capability merely to complete a public ranking. Refresh global facts, preserve the most recent complete anonymous attribution as separately dated historical evidence, and never turn one visible home into “all users.”
- **Names are zero ownership evidence on the shared experiment server.** `OpenEvo`, a familiar run/checkpoint/container/image name, a project-looking path, or a top-level UID is not by itself authority to upload, move, or delete an object. Close filesystem + Run/Artifact manifest + Git/runtime/reference evidence first; unresolved ownership is HOLD.
- **CI/provider changes start from a role-and-workload model, not a provider name.** Separate Git/source hosting, CI control plane, CI compute, deployment, and post-deploy observation; measure real phase wall-clock first; then verify live privacy/account eligibility, billing unit, per-job timeout, concurrency, and quota semantics. Do not move an inefficient full gate unchanged merely because another provider has a free tier, and do not confuse a deployment limit with CI compute allowance.
- **CI performance benchmarks are experiments, not ordinary green-PR work.** Before the first provider-triggering benchmark write, pin the candidate/control base, head/tree, canonical test identities, executor/worker/retry contract, metric, meaningful acceptance rule, expected upside bound, and qualification-vs-steady-state distinction. Search for overlapping benchmark PRs/runs first, run candidate and control sequentially, and use a fresh head SHA for each workflow measurement. A green qualification proves correctness; it does not authorize merge while a pre-registered steady-state benchmark/control is still pending.
- **Unexpected shared-state drift is a stop-and-read event.** Immediately before writing or merging a shared branch, refresh the remote head/open PRs and inspect local worktree state. If an unexpected head, dirty file, reopened PR, or concurrent Agent edit appears, identify its owner and semantic delta before continuing. Never `reset`, overwrite, or merge through unknown concurrent work just to restore the state you expected.
- **Dormant fallback state is not failure or deletion authority.** For Mac/OrbStack CI, `offline`, `exited`, Docker `reclaimable`, or an image shown as `In Use` are observations, not conclusions. Resolve current CI authority plus local mode, LaunchAgent loaded/disabled state, GitHub runner `online/busy`, container state, and image/container references before waking, pruning, or deleting anything. A stopped container may be an intentional manual-recovery asset; do not re-enable or delete it merely to make the host look tidy.

When account-level shared Agent conventions are available, they supplement this repository. Project facts and project-specific constraints remain canonical here.

When a task involves lab connectivity, remote compute, SSH/SFTP/rsync, or hardware disclosure, read [`docs/agents/current/personal-compute-profile-consumer.md`](docs/agents/current/personal-compute-profile-consumer.md). Base Model stores only a generic public topology: never add the owner's personal device inventory, private profile feed, IP/hostname/username, VPN endpoint, access token or other identifying infrastructure detail. Publish only the minimum aggregate hardware facts required for a reproducible experiment.

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

non-draft PR / release candidate
  -> CircleCI GitHub App
  -> ci/circleci: deterministic
  -> ci/circleci: browser_shard_1
  -> ci/circleci: browser_shard_2
  -> ci/circleci: browser_shard_3
  -> ci/circleci: browser_shard_4

deployment-eligible non-main branch / PR + exact-head `[vercel-preview]`
  -> Vercel project `basemodel-preview`
  -> npm run verify:deploy
  -> npm run build
  -> protected Vercel Preview

main
  -> CircleCI post-merge revalidation
  -> Vercel project `basemodel-preview` Production
  -> https://basemodel-preview.vercel.app

manual CI recovery only
  -> GitHub Actions workflow_dispatch
  -> Mac/OrbStack `basemodel-ci` fallback runner
```

**Vercel is the only ordinary deployment provider.** Historical Cloudflare files, snapshots and fallback scripts are not part of normal Preview, release, Production verification, quota reporting or completion reports. Load them only for an explicitly legacy-hosting, rollback or retirement task, or when live evidence shows unexpected legacy-provider activity.

CircleCI GitHub App execution is the ordinary Base Model CI path. GitHub-hosted Actions compute and GitHub Pages remain outside the ordinary path; GitHub Actions is retained only for explicit `workflow_dispatch` to the repository-scoped Mac/OrbStack fallback runner. Do not read a scheduler name as proof of where compute runs. Astro/React remain the application stack; do not rewrite them merely because deployment or CI execution ownership changes.

Eligible Preview branches are **opt-in at the exact head**: `scripts/vercel-ignore-build.mjs` requires `[vercel-preview]` in the Preview commit message before provider build compute is spent. Omit the token on intermediate pushes. Production on `main` remains automatic and does not require the token.

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
read LATEST + current policy
-> scan scenario-trigger-registry and load matched guidance
-> inspect overlapping PRs and relevant code/data/tests
-> classify independent, stacked, superseded and semantically conflicting work
-> finish one coherent change or one explicit integration/release head before the first provider-triggering push
-> publish one atomic multi-file branch update when possible
-> add `[vercel-preview]` only to the exact head that intentionally needs hosted acceptance
-> let Vercel create that exact-head non-main Preview
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
On deployment-eligible Preview branches, omit `[vercel-preview]` from intermediate commits and add it only when the exact head is ready for hosted acceptance; the ignored-build step then prevents those intermediate triggers from entering `verify:deploy`, build, and Playwright.

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
