# BaseModel CI provider decision — fast, cheap, exact-head

Last reviewed: **2026-09-09**

Status: **current provider-selection rationale for `mykcs/basemodel`**.  
Executable authority remains `vercel.json`, repository scripts/tests, the live GitHub ruleset, [`hosting-architecture.md`](hosting-architecture.md), and [`deployment-policy.md`](deployment-policy.md). If this rationale disagrees with executable or live control-plane state, executable/live state wins and this document must be corrected in the same closeout.

Human-facing projection: [`/development/`](/development/) explains the same architecture for readers. That webpage is a presentation layer, not a second CI authority; Agents must continue to read this document plus executable/live state.

## One-sentence decision

**Use public GitHub Actions as the automatic, read-only, four-shard PR preflight; keep Vercel Pro as the only required final-candidate acceptance and Preview/Production authority; spend zero Vercel compute on ordinary working pushes; keep the Mac, CircleCI, and Cloudflare out of the ordinary critical path.**

The optimization target is not "find the provider with the largest free quota." It is:

> **minimum total cost and waiting time per trustworthy merged change, without weakening exact-head/current-base acceptance.**

## Current topology

```text
ordinary research/fix/docs/feature PR push
  -> public GitHub Actions preflight
       -> deterministic repository gate
       -> risk-based browser planner
       -> full/global work: 4 independent Chromium shards, 1 worker each
       -> bounded work: focused mapped coverage
  -> zero ordinary Vercel Preview compute
  -> Mac is optional acceleration/control only, never required CI

final non-draft candidate, current with main
  -> node scripts/request-vercel-final-gate.mjs <PR_NUMBER>
  -> ci/vercel-gate-base = exact live main (non-deploy ref)
  -> ci/vercel-gate-final = exact PR head (persistent deploy ref)
  -> Vercel Preview
       -> verify:deploy
       -> static build
       -> risk-based Chromium acceptance
       -> Lab browser gate when relevant
  -> required GitHub status: Vercel on that exact SHA
  -> merge only while still current with main

main
  -> Vercel Production
  -> same repository acceptance contract
  -> Cloudflare production-smoke observes the released origin

manual recovery only
  -> CircleCI explicit API trigger
  -> self-hosted GitHub Actions workflow_dispatch
  -> Mac/OrbStack repository-scoped fallback
```

## First-principles criteria

We choose a CI architecture by these criteria, in this order:

1. **Trustworthy merge evidence.** The result must belong to the exact PR head and current base, not an older green SHA or a provider badge detached from the candidate.
2. **No duplicate expensive work.** If the deployment provider already has to build the exact site, do not automatically run the same heavy site/browser work on another hosted CI provider.
3. **Final candidates are the billing unit.** Development commits are cheap Git history; hosted acceptance is reserved for a candidate that is actually ready to merge.
4. **Risk controls test scope, never correctness.** Non-UI work may skip browser execution; bounded UI work may use focused coverage; shared/global/unknown UI changes fail closed to the full browser matrix.
5. **Personal machines and research GPUs are not ordinary CI infrastructure.** They remain fallbacks; CI must not compete with experiments or require a laptop to stay online.
6. **Provider changes must earn their complexity.** A nominally free provider is not cheaper if it adds a second build contract, duplicated browser environment, status-binding adapter, or frequent migration/debug work.

## Why Vercel is the ordinary BaseModel path

BaseModel is an Astro website and Vercel is already the Production host. The Pro plan is already paid for, so using the same provider for the final Preview gate lets one hosted execution do two jobs:

- test the exact website candidate in the environment that will build the site; and
- produce the Preview/Production artifact.

That is cheaper than automatically paying two providers to validate the same site.

The important cost-control change is **not** "make Vercel tests weaker." It is "run Vercel much less often":

- ordinary PR branches are disabled by `vercel.json -> git.deploymentEnabled`;
- one persistent `ci/vercel-gate-final` ref requests hosted acceptance only for the final candidate;
- `ci/vercel-gate-base` records the exact live base so browser scope is computed against `main`, not against an unrelated prior PR;
- strict GitHub required-status freshness forces a new exact-head result after base/head drift;
- `scripts/vercel-ui-plan.ts` reduces browser work only when the changed surface is mechanically bounded.

This preserves the existing reader, browser, build, and scientific-content gates while moving the main saving to **fewer provider-triggering executions**.

## Why CircleCI is not ordinary CI

CircleCI credits were exhausted, and its former automatic PR/main jobs duplicated work that can already be performed in the Vercel acceptance path.

Therefore:

- automatic PR/main CircleCI allocation is disabled;
- the qualified CircleCI contract is retained for explicit recovery/diagnosis;
- CircleCI is not a required GitHub merge context;
- a missing/red CircleCI signal is never merge authority for BaseModel.

Do not re-enable automatic CircleCI merely because credits refill. Re-enable it only if there is a measured reliability or correctness gap that Vercel cannot cover efficiently.

## Why public GitHub Actions is the ordinary preflight, not merge authority

Making the repository public changed the cost/performance trade-off without changing the deployment trust boundary. Standard public GitHub-hosted runners can now provide parallel PR feedback without consuming the private-repository Actions minute budget, while Vercel still owns the real Preview/Production environment and the required merge status.

The accepted qualification on exact head `b1551fffefa9061530a688e48343ea21e4ab0670` used workflow run `34261768688` with a digest-pinned Playwright 1.62.1 Noble image, read-only repository permission, no secrets, `pull_request` rather than `pull_request_target`, retries=0, and one Playwright worker per runner. The canonical 204 Chromium identities were assigned exactly once across four independent shards as `51 + 51 + 52 + 50`. All four passed. Browser acceptance steps were 114 s, 113 s, 182 s, and 191 s; the slowest complete browser job was 227 s including container/setup overhead. The prior representative Vercel full-browser tail was about 402 s, so the measured browser-step critical path fell by about 52.5%, exceeding the preregistered 35% improvement threshold.

This does **not** make GitHub Actions a second merge authority. Its job is early, free, parallel evidence:

```text
working PR push
-> public GHA preflight catches deterministic/browser regressions quickly
-> no Vercel spend

final candidate
-> Vercel exact-head Preview proves the deployment environment
-> Vercel remains the required GitHub status
```

A red public preflight must be investigated; it is not ignored merely because it is non-required. But provider availability or a public-runner anomaly does not silently replace the Vercel final gate. The self-hosted Mac workflow remains manual fallback and is deliberately separate from the public hosted preflight.

## Why Cloudflare Pages / Workers are not ordinary BaseModel CI

We considered both because Cloudflare can be inexpensive and has useful CI/deployment products. The decision is still **not to make Cloudflare the ordinary BaseModel merge gate today**.

### Pages

The objection is not merely that "Pages is for pages." It can run build commands. The problem is architectural duplication:

- Production is already Vercel;
- a Pages CI authority would require us to maintain provider-side exact-head/current-base/status-binding behavior separately;
- browser/runtime parity with the Vercel site gate would become a second acceptance environment;
- build-count quotas make an every-push design especially unattractive for our high-frequency Agent workflow.

Pages remains legacy/rollback evidence for BaseModel, not ordinary authority.

### Workers / Workers Builds

Workers Builds is a more plausible future CI alternative than Pages when the goal is compute rather than a Pages product. But "more free minutes" is not sufficient reason to migrate.

Before Workers Builds could replace Vercel acceptance it would have to prove, on the same exact candidate:

- current-main + exact-head identity;
- trustworthy GitHub required-status binding;
- equivalent deterministic/build checks;
- equivalent browser acceptance or a deliberately qualified replacement;
- acceptable timeout/concurrency behavior;
- lower measured total cost/latency after counting migration and maintenance work.

Until those conditions are demonstrated, Cloudflare is more valuable as **independent Production smoke/observation** than as a duplicate primary gate.

Provider quotas and prices are mutable external facts. Do not hard-code a historical monthly number into future architecture decisions; re-check the provider before a migration.

## Why Cloudflare smoke is still useful

`cloudflare/production-smoke/` is intentionally different from duplicate CI. It observes the real released Vercel origin after deployment and checks externally visible behavior such as HTTP/discovery/metadata health.

That gives us provider diversity where diversity is useful:

- Vercel proves the candidate and deploys it;
- Cloudflare independently observes the released result.

We do **not** pay the complexity cost of making both providers full pre-merge authorities.

## Cost model we actually optimize

Think in terms of provider-triggering events, not commits:

```text
many working PR pushes
  cost: public standard GHA preflight; zero ordinary Vercel compute

one final gate request
  cost: one real Vercel acceptance build

at most one evidence-driven corrective gate
  cost: one additional Vercel acceptance build when a real gate finding justifies it

one accepted merge to main
  cost: one Production build when the change is deploy-relevant
```

This is why high development frequency does not imply high hosted-CI spend.

Do not push typo-by-typo to the final gate. Do not create empty commits to obtain another provider badge. Do not mirror the same candidate into several hosted providers "just in case."

## Required Agent operating procedure

For a normal BaseModel PR:

1. Work on the semantic branch (`research/*`, `fix/*`, `docs/*`, etc.). Ordinary pushes start the public GHA preflight but must not start Vercel.
2. Use the public GHA result as early evidence. Investigate any real deterministic/browser regression; do not rerun Vercel merely to duplicate a green preflight. Local/RDC checks are optional accelerators when they shorten the loop.
3. Refresh `main`; ensure the PR is non-draft, mergeable, and current-base.
4. Run `node scripts/request-vercel-final-gate.mjs <PR_NUMBER>` from a current checkout. Do not manually create a new gate alias.
5. Require `Vercel=SUCCESS` on the exact current PR head.
6. If the change is user-facing, inspect the real Preview/routes and preserve the reader/scientific boundaries.
7. Immediately before merge, re-check head SHA, base freshness, required status, public-preflight state, and review threads.
8. Merge the accepted exact head.
9. Verify the resulting Production deployment and relevant public routes/metadata.

For provider control-plane changes, prefer connector/CLI/API operations. Browser GUI automation is a fallback only; repeated coordinate/mouse clicking is not the normal method.

## Anti-patterns

Do not:

- re-enable CI on every push because a provider has unused free quota;
- move tests from Vercel to another provider without proving exact-head/status/browser equivalence;
- call a green deployment badge "CI PASS" when the real acceptance command did not run;
- weaken browser/readability/scientific assertions to fit a cheaper provider;
- make the MacBook or RTX research server an always-on CI dependency;
- create a fresh `ci/vercel-gate-*` branch per PR; use the persistent helper-controlled refs;
- treat Cloudflare Pages, Workers, GitHub Actions, CircleCI, and Vercel as interchangeable merely because all can execute shell commands.

## When to reconsider this decision

Re-open provider selection when **measured** evidence shows one of these conditions, not merely because another service advertises a free tier:

- Vercel acceptance/Production usage repeatedly exceeds the intended monthly budget despite final-candidate-only triggering;
- final-gate queue or wall time becomes a material development bottleneck;
- Vercel can no longer run the required browser/build contract reliably;
- an alternative provider proves the same trust and browser semantics on exact candidates at materially lower total cost;
- the site stops using Vercel as Production host, removing the "one build does CI + deployment" advantage.

A migration is complete only after a qualification candidate passes on the replacement, the live GitHub required-status authority is switched atomically, the predecessor is retired to fallback, current docs are updated, and a real merge/Production closeout succeeds.

## Do not copy this decision blindly to OpenEVO Experiment

`mykcs/openevo-experiment` is a scientific code/experiment repository, not the BaseModel website. Its CI cost/trust trade-off is different. The correct first-principles rule is shared — exact evidence, final-candidate spend, no duplicated work — but the provider choice may differ.

When working there, read that repository's current CI strategy instead of importing this Vercel architecture by analogy.
