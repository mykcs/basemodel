# Repository Agent instructions

## Historical Codex dialogue archive

When prior product, deployment, or research-workbench decisions are relevant,
consult the private [basemodel dialogue archive](https://github.com/mykcs/Codex-Dialogue/tree/main/projects/basemodel).
It is historical evidence only and never overrides current task instructions,
executable repository truth, or live provider state.

This repository is frequently maintained by coding Agents through GitHub. This root `AGENTS.md` is the **unique repository-root Agent bootstrap authority** and the first repository file an Agent reads. Detailed topic policy belongs under `docs/agents/current/`; `docs/agents/README.md` is navigation-only and must not become a second mutable copy of Agent rules.

## Fast start

You are already reading the repository bootstrap. After this file, read in this order:

**Before the first compound shell call:** if the syntax depends on Bash, set the execution tool's outer shell/interpreter to `/bin/bash` before running it. This applies even while doing bootstrap/discovery; see the detailed pre-mutation guard below.

1. [`docs/agents/README.md`](docs/agents/README.md) — navigation-only Agent documentation map and topic router.
2. [`docs/agents/LATEST.md`](docs/agents/LATEST.md) — fixed-path current handoff and deployment state.
3. [`docs/agents/current/project-agent-operating-principles.md`](docs/agents/current/project-agent-operating-principles.md) — project-wide standards for autonomous problem solving, clean workflow design, and selective deposition of reusable experience.
4. [`docs/agents/current/website-engineering-standard.md`](docs/agents/current/website-engineering-standard.md) — cross-cutting website engineering defaults: accepted stack, semantic ownership, static-first/hydration discipline, browser runner boundaries, exact-tree release evidence, build-budget discipline, temporary-harness cleanup, and the stopping rule against unrequested optimization churn.
5. [`docs/agents/current/scenario-trigger-registry.md`](docs/agents/current/scenario-trigger-registry.md) — scan this against the current task and automatically load/execute the matched scenario guidance without waiting for the owner to repeat it.
6. [`docs/agents/current/product-and-research-integrity.md`](docs/agents/current/product-and-research-integrity.md) — product north star and false-complete rules.
7. [`docs/agents/current/human-thinking-web-expression-contract.md`](docs/agents/current/human-thinking-web-expression-contract.md) — **mandatory for every user-facing page**, section, copy, navigation, comparison, explanation, or feature change. Before writing or substantially rearranging public-page HTML, also read [`docs/agents/current/site-reader-attention-contract.md`](docs/agents/current/site-reader-attention-contract.md) and register/update the route's executable reader contract. For research publication work, also read [`docs/agents/current/research-site-presentation-contract.md`](docs/agents/current/research-site-presentation-contract.md): keep results and interpretation visible, and place copy/paste implementation depth behind progressive disclosure.
8. [`docs/agents/current/website-design-spec.md`](docs/agents/current/website-design-spec.md) — **canonical for every user-facing copy task**: defines “说人话 / 去 AI 味”, subject-first headings, natural technical language, evidence layering, and current preference precedence. **Also read [`docs/agents/current/website-copy-cases.md`](docs/agents/current/website-copy-cases.md) and [`docs/agents/current/human-preference-learning-system.md`](docs/agents/current/human-preference-learning-system.md) for every user-facing copy/design task**; raw human cases are training evidence, while the preference system requires task-time retrieval and post-write comparison rather than passive storage.
9. [`docs/agents/current/ui-design-principles.md`](docs/agents/current/ui-design-principles.md) and [`docs/agents/current/sitewide-visual-knowledge-architecture.md`](docs/agents/current/sitewide-visual-knowledge-architecture.md) — learning-first responsive UI and the whole-site knowledge journey.
10. [`docs/agents/current/ui-change-visual-acceptance-gate.md`](docs/agents/current/ui-change-visual-acceptance-gate.md) and [`docs/agents/current/theme-contrast-contract.md`](docs/agents/current/theme-contrast-contract.md) — required browser/theme/layout acceptance for UI work.
11. [`docs/agents/current/seed-openevo-research-mission-first-principles.md`](docs/agents/current/seed-openevo-research-mission-first-principles.md), [`docs/agents/current/reproduction-guide-design-principles.md`](docs/agents/current/reproduction-guide-design-principles.md), and [`docs/agents/current/audience-centered-technical-copy.md`](docs/agents/current/audience-centered-technical-copy.md) when changing the current SEED × OpenEvo mission, reproduction flow, or technical copy.
12. [`docs/agents/current/model-catalog-verification-policy.md`](docs/agents/current/model-catalog-verification-policy.md) — required for current/latest model-family or evidence changes.
13. [`docs/agents/current/ci-provider-decision.md`](docs/agents/current/ci-provider-decision.md), [`docs/agents/current/hosting-architecture.md`](docs/agents/current/hosting-architecture.md), and [`docs/agents/current/deployment-policy.md`](docs/agents/current/deployment-policy.md) — BaseModel CI provider rationale plus required public GitHub Actions authority, Vercel Production/on-demand Preview boundaries, CircleCI/Mac fallbacks, Cloudflare smoke, and release closeout.
14. [`docs/agents/current/public-release-security-gate.md`](docs/agents/current/public-release-security-gate.md) — required before any private → public visibility change.
15. [`docs/agents/current/repository-map.md`](docs/agents/current/repository-map.md) — detailed ownership/change-to-check map.
16. `package.json`, `vercel.json`, config, source and task-specific tests — executable truth.

Files under `docs/agents/history/` and `docs/agent-context/` are evidence and rationale, not instructions to restore previous architecture. The older product-vision document from PR #64 is retained under history; current product authority is the executable product plus the current integrity, research-mission, visual and deployment policies.

### Pre-mutation guards for repeatedly escaped failures

Before creating a branch, running compound local/remote shell automation, or mutating shared experiment-server storage:

- **Repeated correction needs a use-site witness (REPEAT-CORRECTION).** Before repeating the next affected command, design choice, or completion claim, record `trigger -> current owner -> checked artifact -> allowed next action -> invalidation cue` in the existing task/PR record. Reading or linking a retrospective is not proof that its check ran. Follow [the correction-to-action rule](docs/agents/current/project-agent-operating-principles.md#correction-to-action-witness); do not add a new approval layer.
- **PR acceptance is exact-head/current-base GitHub Actions authority.** The protected required check is `public-ci-gate` from the read-only public PR workflow; stale results from another SHA/base are invalid. Ordinary PR refs do not enter Vercel. A Vercel Preview is optional provider/human-review evidence: only when one is actually needed, run `node scripts/request-vercel-final-gate.mjs <PR_NUMBER>` to pin live `main` in `ci/vercel-gate-base` and move persistent `ci/vercel-gate-final` to the exact PR head. Do not use `[vercel-preview]` or a fresh alias ref as a gate.
- **Provider control planes are CLI/API-first.** For GitHub, Vercel, Cloudflare, and similar services, use an authorized connector, CLI, or REST/API route before browser GUI automation. Use browser interaction only when no supported programmatic control exists; repeated coordinate/mouse clicking is never the default control-plane method.
- **BaseModel execution uses the fastest safe path.** Do not force either GitHub-only or RDC-first development. Keep small/self-contained repository edits on GitHub; use an isolated RDC/local worktree when UI, shared/multi-file changes, or local test/build/dev/Playwright feedback materially shortens the loop or reduces hosted retries; then return PR/status/provider authority to GitHub/Vercel. RDC is an accelerator, never a required dependency. Follow [the execution-surface rule](docs/agents/current/project-agent-operating-principles.md#choose-the-fastest-safe-execution-surface).
- **Name the shell when syntax matters.** If a command depends on Bash semantics (`VAR=value`, `set -euo pipefail`, loops, arrays, heredocs, process substitution), set the execution tool's shell/interpreter to `/bin/bash` or run a standalone Bash/Python script explicitly. Do not assume an inner `bash -lc` protects a complex command from an outer `fish` parser; nested quoting can fail before Bash starts. A parser failure under `fish` is an execution-surface failure, not repository or server failure.
- **Shared storage begins read-only.** A model/checkpoint/run is protected by future planned use as well as current process references. “Not mounted/open right now” is never deletion authority. For snapshot-only work load `server-storage-pressure-audit-sop.md`; for the end-to-end organize → passport → publish/verify → reclaim workflow load `server-artifact-governance-and-reclaim-sop.md` as well.
- **Incomplete namespace is not a complete inventory.** If the currently authorized view exposes only a subset of expected homes, do not enter sibling-user containers or exercise Docker/admin mount capability merely to complete a public ranking. Refresh global facts, preserve the most recent complete anonymous attribution as separately dated historical evidence, and never turn one visible home into “all users.”
- **Names are zero ownership evidence on the shared experiment server.** `OpenEvo`, a familiar run/checkpoint/container/image name, a project-looking path, or a top-level UID is not by itself authority to upload, move, or delete an object. Close filesystem + Run/Artifact manifest + Git/runtime/reference evidence first; unresolved ownership is HOLD.
- **CI/provider changes start from a role-and-workload model, not a provider name.** Separate Git/source hosting, CI control plane, CI compute, deployment, and post-deploy observation; measure real phase wall-clock first; then verify live privacy/account eligibility, billing unit, per-job timeout, concurrency, and quota semantics. Do not move an inefficient full gate unchanged merely because another provider has a free tier, and do not confuse a deployment limit with CI compute allowance. A provider cutover is not complete when repository prose/config says so: before declaring authority moved, read the live required-status/ruleset control plane, prove the replacement exact-head provider execution, switch required authority without a no-gate window, then verify post-merge Production under the same contract.
- **CI performance benchmarks are experiments, not ordinary green-PR work.** Before the first provider-triggering benchmark write, pin the candidate/control base, head/tree, canonical test identities, executor/worker/retry contract, metric, meaningful acceptance rule, expected upside bound, and qualification-vs-steady-state distinction. Search for overlapping benchmark PRs/runs first, run candidate and control sequentially, and use a fresh head SHA for each workflow measurement. A green qualification proves correctness; it does not authorize merge while a pre-registered steady-state benchmark/control is still pending. For affected-route selection, source exports, and squash-based controls, execute the [CI evidence preflight](docs/agents/current/website-engineering-standard.md#ci-evidence-preflight) before the first triggering write; its checks distinguish type/runtime proof, content/ancestry comparison, and selection/scheduling experiments.
- **Unexpected shared-state drift is a stop-and-read event.** Immediately before writing or merging a shared branch, refresh the remote head/open PRs and inspect local worktree state. If an unexpected head, dirty file, reopened PR, or concurrent Agent edit appears, identify its owner and semantic delta before continuing. Never `reset`, overwrite, or merge through unknown concurrent work just to restore the state you expected.
- **Stale governance branches are authority-topology migrations, not ordinary rebases.** Before refreshing an old docs/policy PR, re-resolve the current role of every changed path. If a file has since become navigation-only, historical, generated, or otherwise lost ownership of mutable rules, do not replay its old hunk merely because Git can merge it. Preserve the still-valid semantic delta in the current canonical owner or a narrow successor, and supersede the obsolete topology. Follow [`multi-pr-semantic-integration-playbook.md`](docs/agents/current/multi-pr-semantic-integration-playbook.md#32-stale-governance-prs-re-resolve-authority-topology-before-refreshing).
- **Current-file reads are ref-qualified, not path-qualified.** Before treating a local file as current `main`/branch authority, record the checkout `HEAD`, branch, dirty state, and intended remote/ref SHA. Read authority with an exact ref (`git show <ref>:path`, connector fetch at a pinned SHA/ref, or equivalent). A file that exists in a stale/dirty working tree is evidence about that checkout only; “I can cat it locally” never proves “current main says it”.
- **Reconstruct status from durable artifacts before declaring blocked or done.** If prior chat prose, a vanished tool stream, or one failed transport path conflicts with branch/PR/CI/provider/test artifacts, re-read those durable objects and continue from them. Tool discovery/listing is not execution; one Git/HTTP/provider path failure is not proof that the underlying capability is unavailable. Escalate only after safe alternate owner-appropriate paths are exhausted or a real human boundary remains.
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

non-draft PR / candidate
  -> public GitHub Actions `pull_request`
  -> exact PR head + current base identity
  -> deterministic repository gate
  -> risk-based Chromium acceptance
  -> full/global work uses 4 independent public runners
  -> required GitHub status: public-ci-gate

optional provider/human Preview
  -> persistent ci/vercel-gate-base / ci/vercel-gate-final
  -> exact candidate Vercel Preview
  -> repository validation + build + Vercel Chromium/Lab acceptance
  -> not ordinary merge authority

main
  -> Vercel project `basemodel-preview` Production
  -> npm run verify:deploy + npm run build
  -> Production browser wrapper skips duplicate full Chromium/Lab CI
  -> https://basemodel-preview.vercel.app
  -> Cloudflare production-smoke observes the released origin

manual CI recovery only
  -> CircleCI explicit API trigger
  -> GitHub Actions workflow_dispatch
  -> Mac/OrbStack `basemodel-ci` fallback runner
```

**GitHub Actions is the ordinary merge CI authority.** The public workflow is read-only, secret-free, exact-head-bound, and aggregates deterministic + risk-based browser work into required `public-ci-gate`. Full/global UI work is four-way parallel; strict branch/ruleset freshness keeps the result current with `main`.

**Vercel is the only ordinary deployment provider.** It owns Production and explicitly requested Previews, but no longer duplicates the required full browser matrix on Production. `vercel.json` keeps ordinary PR refs deployment-disabled; `main` and persistent `ci/vercel-gate-final` remain the only enabled refs. Preview/unknown Vercel environments still fail closed into the Vercel browser gates.

CircleCI automatic PR/main workflows are disabled and `.circleci/config.yml` is retained only for explicit API-triggered manual recovery. The separate self-hosted GitHub Actions workflow is manual Mac/OrbStack fallback. Cloudflare's active role is the small Production smoke Worker; historical hosting/shadow assets are not ordinary deployment authority.

**Agent-control documents are never website-production inputs.** A change limited to root `AGENTS.md`, `docs/agents/**`, repository prose, or test-only governance may run public GHA CI, but `scripts/vercel-ignore-build.mjs` must classify a docs-only `main` range as non-deploy-relevant so it cannot replace the Production website. A provider record created before an ignored-build decision is not a publication.

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
-> finish one coherent change or one explicit integration/release head
-> use GitHub for small repository edits; use an isolated RDC/local worktree when local build/Playwright feedback is faster
-> push/update the PR
-> let public GHA run exact-head/current-base deterministic + browser CI
-> require public-ci-gate SUCCESS
-> request one Vercel Preview only when a real provider-rendered page/provider diagnosis is needed
-> synchronize with current main when materially required and re-run required CI
-> immediately before merge re-check head/base, public-ci-gate and review threads
-> merge the accepted release to main once
-> let Vercel create one Production deployment for deploy-relevant work
-> verify https://basemodel-preview.vercel.app separately
-> verify Cloudflare smoke when release/hosting observation is in scope
```

A clean Git merge is not combined-product acceptance. When several PRs belong to one release, use the parallel/stacked integration policy in `deployment-policy.md`; preserve attribution and ancestry, but resolve the final tree by current product intent, executable invariants and current provider truth.

Protected Vercel Preview URLs may require authentication. When the owner needs anonymous review access, generate a temporary share link through the connected Vercel capability, deliver it only through an ephemeral review/chat surface, and never persist the URL or `_vercel_share` parameter in repository files, PR/Issue bodies, or GitHub comments.

## CI and Vercel budget boundary

At the current public-repository/provider state, standard public GitHub-hosted runners are the ordinary zero-marginal-cost CI compute lane. Vercel deployments/builds are finite paid resources.

Default target for one coherent feature or accepted release batch:

```text
one branch / integration PR
-> public GHA on PR updates
-> zero ordinary Vercel Preview builds
-> optional one Preview only when it answers a real human/provider question
-> one Production build per accepted deploy-relevant release batch
```

Do not push every typo or speculative intermediate state merely to obtain a hosted badge. Reuse the same PR, prefer atomic multi-file updates, and use local/RDC checks when they shorten the loop. `ci/vercel-gate-final` is an on-demand Preview trigger, not merge authority. Every Preview that reaches Vercel remains real provider acceptance; `[vercel-preview]` is only a marker.

Ordinary completion reports are **CI-first** and distinguish:

```text
exact PR head / current base
public-ci-gate + deterministic/browser outcome
optional Vercel Preview only if actually requested
merge commit
Vercel Production deployment and public verification
Cloudflare smoke when relevant to release/hosting closeout
```

Provider/control-plane work is connector/CLI/API-first. Do not use repeated coordinate-based browser clicking when a programmatic path exists.

A legacy external Git integration may still require an existing skip prefix until disabled account-side. Treat that as a silent compatibility safeguard, not an ordinary stage or quota dimension.

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
