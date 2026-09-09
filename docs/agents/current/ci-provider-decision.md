# BaseModel CI provider decision — public GHA required, Vercel deploys

Last reviewed: **2026-09-09**

Status: **current provider-selection rationale for `mykcs/basemodel`**.  
Executable/live authority is the GitHub ruleset, `.github/workflows/public-pr-ci.yml`, `vercel.json`, repository scripts/tests, [`hosting-architecture.md`](hosting-architecture.md), and [`deployment-policy.md`](deployment-policy.md). If this document conflicts with executable or live control-plane state, executable/live state wins and this document must be corrected in the same closeout.

Human-facing projection: [`/development/`](/development/) explains the same architecture for readers. It is presentation, not CI authority.

## One-sentence decision

**Use the read-only public GitHub Actions workflow as BaseModel's required PR CI; keep Vercel for Production and explicitly requested Previews; keep Cloudflare as independent Production smoke; keep CircleCI and Mac/OrbStack as manual recovery only.**

The optimization target is:

> **minimum waiting time and marginal hosted cost per trustworthy merged change, without weakening exact-head/current-base, browser, reader, or scientific-content acceptance.**

## Current topology

```text
ChatGPT / Agent work
  -> GitHub branch + PR
  -> public GitHub Actions (`pull_request`)
       -> exact PR head + current base identity
       -> deterministic repository gate
       -> risk planner
       -> full/global UI: 4 independent Chromium shards, 1 worker each
       -> bounded UI: focused mapped coverage
       -> aggregate required check: public-ci-gate
  -> merge only while the PR remains current with main

Vercel Preview (on demand, not merge authority)
  -> persistent ci/vercel-gate-base / ci/vercel-gate-final refs
  -> exact candidate Preview
  -> repository validation + build + Vercel Chromium/Lab acceptance
  -> human/provider-specific inspection when actually needed

main
  -> Vercel Production
       -> repository validation
       -> static build
       -> no duplicate full Chromium/Lab matrix
  -> stable Production origin
  -> Cloudflare production-smoke observes the released origin

manual recovery only
  -> CircleCI explicit API trigger
  -> self-hosted GitHub Actions workflow_dispatch
  -> Mac/OrbStack repository-scoped fallback
```

## Why the decision changed

The earlier Vercel-first design was rational while BaseModel was private: Vercel was already paid for and could combine final acceptance with deployment, while another hosted CI provider would duplicate cost.

Two facts changed the optimum:

1. BaseModel became public, making standard public GitHub-hosted runners a zero-marginal-cost CI compute lane under the current account/provider rules.
2. The public GHA qualification proved that four independent runners are materially faster than the representative Vercel full-browser tail while preserving the same canonical test identities and fail-closed planner.

Provider choice follows current measured workload economics; it is not a permanent vendor preference.

## Qualification evidence for public GitHub Actions

The cutover qualification was run on exact head `5545f6e922b007b7bacd3c2667a2f9b6b6e1ae15` against current base `94167e4e7bca4379d7520f9449d6682f7e79c2c5`.

Public workflow run `34299509005` proved:

- `pull_request`, never `pull_request_target`;
- repository permission `contents: read`;
- no workflow secrets;
- exact candidate head binding in every job;
- immutable-SHA-pinned GitHub actions;
- digest-pinned Playwright 1.62.1 Noble browser image;
- retries = 0;
- four independent Chromium shards with one Playwright worker per runner;
- deterministic validation + all four shards green;
- aggregate `public-ci-gate` green;
- slowest complete browser job about **213 s**, below the preregistered 240 s ceiling and about **47% shorter** than the representative ~402 s Vercel full-browser tail.

The same exact head also passed the persistent Vercel gate: full Chromium `204/204` and Lab `12/12` green. That provider run additionally proved the repaired public Git range path could resolve the actual base/head diff inside Vercel without depending on a local `origin` remote.

This is why the public GHA lane is now allowed to become merge authority rather than merely an advisory preflight.

## Exact-head and current-base authority

The required GitHub check is **`public-ci-gate` from GitHub Actions App 15368**. Branch/ruleset strictness must remain enabled so a PR cannot borrow a green result after `main` or the candidate changes.

The aggregate job depends on the deterministic job and the complete browser matrix selected by the shared planner. A historical GHA result, Vercel Preview, CircleCI result, local run, or result from another SHA is never current merge evidence.

Before merge, refresh live state and require all of these at the same time:

```text
PR head == the reviewed exact SHA
PR base == current protected main
PR is non-draft and mergeable
public-ci-gate == SUCCESS on that head
no unresolved review/thread blocker
```

If main or the PR head moves, rerun against the new identity.

## Why Vercel is no longer required CI

Vercel still owns the website Production environment, but that is a deployment responsibility, not a reason to pay for the same full browser matrix twice.

After the cutover:

- ordinary PR refs remain outside Vercel through `vercel.json -> git.deploymentEnabled`;
- merge readiness comes from `public-ci-gate`;
- Production still runs repository validation and the real static build so provider/build incompatibilities fail before publication;
- `scripts/vercel-browser-gates.mjs` skips duplicate Chromium/Lab execution only when `VERCEL_ENV=production`;
- Vercel Preview and unknown environments fail closed and still run the Vercel browser gates.

So Vercel continues to prove that the site can actually build and deploy there, while GitHub Actions owns the expensive pre-merge browser regression matrix.

## On-demand Vercel Preview

The persistent Preview mechanism is retained because a real provider Preview is useful for human review, Vercel-specific debugging, or recovery qualification. It is no longer a mandatory merge stage.

When a real Preview is needed:

```text
node scripts/request-vercel-final-gate.mjs <PR_NUMBER>
```

The helper pins non-deploy `ci/vercel-gate-base` to live `main`, then moves persistent `ci/vercel-gate-final` byte-for-byte to the exact PR head. `scripts/vercel-git-range.mjs` resolves the public canonical repository remote and compares the candidate against that pinned live base. Missing/stale identity fails closed.

Do not create fresh alias refs, manufacture probe commits, or treat `[vercel-preview]` as an executable gate.

## Why CircleCI stays manual

CircleCI credits were exhausted on 2026-09-08, and the automatic jobs duplicated work that now runs faster on public GitHub runners. Therefore:

- automatic PR/main CircleCI allocation stays disabled;
- `.circleci/config.yml` is retained for explicit API-triggered recovery/cross-checking;
- CircleCI is not a required merge context;
- a CircleCI credit refill is not by itself a reason to turn automatic CI back on.

## Why Cloudflare stays observation-only

Cloudflare Pages and Workers can both execute useful build workloads, but BaseModel already has a Production host and now has a qualified zero-marginal-cost public CI lane. Moving the same gate to Cloudflare would add another status-binding/runtime/control plane without a measured benefit.

`cloudflare/production-smoke/` is useful precisely because it does something different: a small Worker independently observes the released Vercel origin and checks externally visible HTTP/discovery/metadata behavior. It does not publish the site and does not run the repository test matrix.

## Why Mac/OrbStack and RDC are not CI authority

Remote Desktop Commander is an execution accelerator for real filesystem, shell, Git, Node, Playwright, CLI, and local visual work. The repository-scoped Mac/OrbStack runner is a deliberate recovery surface.

Neither is an always-on merge dependency. A personal computer should not need to stay online for ordinary PRs, and research GPU servers must not absorb generic website CI work.

Provider/control-plane operations remain CLI/API/connector-first. Repeated coordinate-based browser clicking is not the normal control path.

## Cost and speed model

Think in terms of distinct work, not provider brands:

```text
many PR pushes
  -> public GHA CI
  -> current marginal hosted CI cost: zero for standard public runners
  -> four-way browser parallelism

merge
  -> one Vercel Production build when deploy-relevant
  -> validation + static build
  -> no duplicate full browser matrix

optional human/provider review
  -> one explicit Vercel Preview only when it answers a real question

post-deploy
  -> tiny Cloudflare smoke observation
```

This architecture removes the former final-gate queue from ordinary merges and protects Vercel's included usage from duplicate browser compute.

Provider pricing/quota rules are mutable external facts. Re-check them before any future provider migration rather than hard-coding today's allowance as permanent architecture.

## Required Agent procedure

For a normal BaseModel PR:

1. Work on a coherent semantic branch. Prefer GitHub for small repository edits and an isolated RDC/local worktree when local build/Playwright feedback materially shortens the loop.
2. Let public GitHub Actions run automatically. Investigate a red deterministic/browser result; do not move work to Vercel merely to obtain another badge.
3. Refresh main and the PR. Require current base, non-draft state, mergeability, and exact-head `public-ci-gate=SUCCESS`.
4. For user-facing work, use local browser evidence first. Request a Vercel Preview only when a real provider-rendered page or provider-specific diagnosis is needed.
5. Re-read the live ruleset and review threads immediately before merge.
6. Merge the accepted exact head/current-base candidate.
7. Verify Vercel Production reaches READY for deploy-relevant work and inspect the real public route/metadata.
8. Verify Cloudflare production-smoke when the task changes release/hosting behavior or when live observation is part of closeout.

## Anti-patterns

Do not:

- make Vercel a required duplicate browser CI merely because it is the deployment provider;
- weaken the GHA planner, assertions, reader contracts, or scientific boundaries to get faster results;
- use a stale green from another SHA or base;
- re-enable automatic CircleCI because credits refill;
- replace public GHA with Pages/Workers only because a free quota looks large;
- make the MacBook or research GPU server an ordinary CI dependency;
- treat a deployment badge as a substitute for the required `public-ci-gate`;
- use repeated GUI coordinate clicking when an API/CLI/connector path exists.

## When to reconsider

Re-open this decision if measured/live evidence shows one of these:

- the repository becomes private and public-runner economics change materially;
- GitHub-hosted public runner availability/limits make the required gate unreliable;
- the four-shard critical path ceases to be materially better;
- Vercel changes so Production cannot build reliably without restoring more provider-side acceptance;
- another provider proves equal exact-head/current-base/browser trust at lower total latency/maintenance cost;
- the site stops using Vercel as Production host.

Any future cutover must again be a repository + live-control-plane transaction: qualify the replacement on an exact candidate, switch the live required check without a no-gate window, merge under the new authority, then verify Production.

## Do not copy this provider choice blindly to OpenEVO Experiment

`mykcs/openevo-experiment` is a private scientific code/experiment repository, not this public website repository. Its accepted architecture is final-candidate-only GitHub Actions with a hardened base-owned verifier. Cloudflare qualification remains evidence/fallback, not the current primary gate. Read that repository's live ruleset and current CI docs rather than importing BaseModel's public-runner topology by analogy.
