# Deployment and validation policy

Last reviewed: **2026-09-09**

## Authority

Provider-selection rationale: [`ci-provider-decision.md`](ci-provider-decision.md). This file owns executable release/validation policy.

```text
GitHub = canonical source

working PR
-> public hosted GitHub Actions
-> exact PR head + current base identity
-> deterministic gate + static build
-> shared risk planner
-> full/global UI: 4 independent Chromium shards, one worker each
-> bounded UI: focused mapped coverage
-> required GitHub status: public-ci-gate (GitHub Actions App 15368)

optional provider Preview
-> run `node scripts/request-vercel-final-gate.mjs <PR_NUMBER>` only when a real Vercel Preview answers a review/provider/recovery question
-> ci/vercel-gate-base = exact live main
-> ci/vercel-gate-final = exact PR head
-> Vercel Preview runs repository validation + build + Vercel Chromium/Lab acceptance
-> Preview is not ordinary merge authority

main
-> Vercel Production
-> npm run verify:deploy
-> npm run build
-> Production skips duplicate full Chromium/Lab browser CI
-> https://basemodel-preview.vercel.app
-> Cloudflare production-smoke observes the released origin

manual recovery only
-> CircleCI explicit API trigger
-> GitHub Actions workflow_dispatch
-> repository-scoped Mac/OrbStack runner
```

**Cutover target:** protected `main` requires **`public-ci-gate` from GitHub Actions App 15368**, with strict current-base semantics preserved. Vercel is no longer the required merge check; it remains the deployment provider and on-demand Preview surface. CircleCI automatic PR/main workflows remain disabled. Cloudflare remains post-deploy observation, not deployment or merge authority.

The qualification that authorizes this topology is exact head `5545f6e922b007b7bacd3c2667a2f9b6b6e1ae15`: public GHA run `34299509005` passed deterministic + all four browser shards + `public-ci-gate`, with the slowest complete browser job about 213 seconds. The same candidate passed Vercel full Chromium `204/204` and Lab `12/12`, proving provider-specific Preview coverage and the repaired public Git-range resolver.

### Exact-head and current-base acceptance

`main` branch protection/ruleset must keep strict up-to-date semantics and require `public-ci-gate`. The workflow binds `github.event.pull_request.head.sha` and `github.event.pull_request.base.sha`, checks out the exact PR head, and runs with read-only repository permission and no secrets.

A green status is merge evidence only while all of these remain true:

```text
head SHA unchanged
base is current protected main
public-ci-gate == SUCCESS on that head
PR is non-draft and mergeable
no unresolved review/thread blocker
```

If main or the candidate changes, refresh the candidate and obtain a new public GHA result. A historical Vercel Preview, CircleCI run, local pass, or GHA result from another SHA/base is not current evidence.

### Provider cutover is a repository + live-control-plane transaction

Changing repository prose/config is only half of a CI migration. Before reporting that blocking authority moved:

```text
replacement repository contract
-> exact-head replacement execution really runs and passes
-> predecessor bridge evidence is collected when needed
-> live required-status authority is switched without a no-gate window
-> re-read live ruleset
-> merge under the new authority
-> Production executes the intended deployment contract
```

Preserve unrelated PR/review/thread protections while changing only the required-status owner. Immediately before any ruleset mutation, re-read live state; another Agent or administrator may have changed it.

A replacement-provider failure must be localized by phase before blaming infrastructure: repository validation, browser assertion, missing runtime/library, provider scheduling, and deployment are different owners.

### On-demand Vercel Preview policy

`vercel.json -> git.deploymentEnabled` blocks ordinary working refs before Vercel compute. Only `main` and persistent `ci/vercel-gate-final` are deployment-enabled.

Vercel Preview is now **optional** merge-adjacent evidence. Use it when:

- a human needs to inspect the real Vercel-rendered candidate;
- a change is specifically about Vercel behavior, runtime, headers, routing, or deployment configuration;
- provider-specific recovery/equivalence evidence is required.

When needed, `scripts/request-vercel-final-gate.mjs` first pins non-deploy `ci/vercel-gate-base` to live `main`, then moves persistent `ci/vercel-gate-final` to the exact PR head. The ref cannot add, cherry-pick, rebuild, or rewrite content. `scripts/vercel-git-range.mjs` verifies the remote base still equals live main and compares that base tree directly with the candidate. Missing/stale identity fails closed.

Do not create fresh gate aliases, no-op wake commits, or use `[vercel-preview]` as an executable switch.

### Shared risk-aware browser gate

Public GHA is the required browser CI. Vercel Preview and the retained manual CircleCI path reuse the same risk taxonomy so optional/fallback evidence is comparable rather than weaker.

```text
non-UI / governance-only PR diff
-> deterministic GHA gate
-> browser layer may skip when risk ownership is proven absent

bounded route-owned UI diff
-> deterministic GHA gate
-> focused mapped Chromium specs / changed-route smoke

shared/global/unknown UI diff
-> deterministic GHA gate
-> complete canonical Chromium matrix split across 4 independent public runners

Lab/server-relevant diff
-> public GHA primary-shard Lab tail / equivalent owned Lab coverage
```

The canonical Chromium suite remains `npm run test:ui`. Full public-GHA work uses one Playwright worker per independent shard, retries=0, and the digest-pinned official Playwright browser image. `public-ci-gate` depends on deterministic + browser completion.

Changes to the GHA workflow, risk planner, Vercel gate, deployment config, CircleCI manual-fallback config, merge-candidate tooling, or retained Mac fallback environment fail closed to full browser coverage. Never weaken assertions, reader contracts, scientific-content boundaries, or unknown-owner handling to reduce wall time.

### Vercel Production contract

The Vercel build command is:

```bash
npm run verify:deploy && npm run build && node scripts/vercel-browser-gates.mjs
```

`scripts/vercel-browser-gates.mjs` skips browser execution **only** for `VERCEL_ENV=production`, because the required `public-ci-gate` already owns pre-merge Chromium acceptance. Preview and unknown environments remain fail-closed and run `vercel-ui-gate.mjs` plus `vercel-lab-browser-gate.mjs`.

This keeps two useful Production checks inside Vercel:

- repository validation must still execute in the deployment provider;
- the real Astro/static build must succeed there.

But it avoids paying a second full browser matrix after merge.

Vercel Preview stays noindex. Production keeps the stable canonical/hreflang identity. Do not disable Vercel Git deployment on `main`.

### Budget-first execution

At the current public-repository/provider state, standard public GitHub-hosted runners are the zero-marginal-cost ordinary CI lane. Vercel Pro is metered, so use Vercel for deploy-relevant `main` builds and explicit Previews that answer a real question.

Do not optimize by weakening tests. Optimize by:

- four-way GHA parallelism;
- same-PR cancellation;
- risk-based test selection;
- avoiding duplicate Vercel browser work;
- batching coherent changes before Production;
- using local/RDC feedback when it is faster than waiting for hosted retries.

Provider prices/quotas are mutable. Re-check them live before a future architecture change.

### Reading provider evidence when a dashboard is awkward

Use structured exact-SHA API/CLI/provider reads first. A GUI timeout is a monitoring failure until job state or terminal output proves an underlying execution failure.

If a virtualized/canvas log hides text, change the read path instead of repeating clicks/scrolls: use structured job metadata, documented log output, CLI/API, or a provider connector. Retrieve only missing evidence. Do not rerun a green workflow just to get easier logs.

Provider latency is not productive Agent work. Once a hosted run is visibly progressing without actionable failure, do not occupy the conversation with minute-by-minute polling.

### Mac manual fallback

`.github/workflows/self-hosted-ci.yml` is a **manual recovery canary only**. It uses `workflow_dispatch`, runs on the repository-scoped `basemodel-ci` OrbStack runner, and forces complete browser coverage so a manual canary cannot accidentally become a no-op.

The Mac LaunchAgent should remain disabled during ordinary operation. Remote Desktop Commander, browser work, SSH, and other control-plane tasks take precedence over keeping a personal CI farm online. If cloud CI is unavailable and manual fallback is explicitly needed, restore the runner deliberately, run the canary, then return it to the disabled state. Never redirect ordinary website CI to research/GPU servers.

The assets under `.github/runner/` remain recoverable infrastructure with bounded CPU/memory/process/log limits, no host mounts, no Docker socket, and dropped Linux capabilities. Dormant/offline state is not deletion authority.

### CircleCI manual fallback

`.circleci/config.yml` retains `manual_cloud_ci` for explicit API-triggered recovery only. Automatic PR and main workflows stay disabled. CircleCI is not a required GitHub context and its credit state must never become merge latency.

If a manually triggered fallback finds a real regression missed by public GHA, treat that as a primary-gate defect and repair the shared acceptance contract rather than weakening the fallback.

### Cloudflare post-deploy smoke

Cloudflare is not a second deployment or CI authority. `cloudflare/production-smoke/` owns a small Worker that checks the real Vercel Production origin: critical HTTP 200s, canonical identity, Production indexability, `robots.txt`, `sitemap.xml`, and the legacy Results redirect. A scheduled check runs every 30 minutes.

Do not move repository compilation, npm installation, Vitest, Playwright, or screenshot baselines into this Worker. Its job is independent post-deploy observation.

### Cost and provider guardrails

- Public GitHub Actions owns ordinary required PR CI.
- Vercel owns Production and on-demand Preview, not required merge CI.
- Cloudflare owns independent Production smoke only.
- CircleCI and Mac/OrbStack are manual fallback only.
- Source hosting, CI control plane, CI compute, deployment, and monitoring are separate roles even when one vendor could technically do several.
- Provider/control-plane operations are API/CLI/connector-first. Repeated coordinate/mouse browser automation is a fallback, not the default.

## Vercel deployment-budget discipline

Vercel deployments/builds are finite resources. Optimize the **number of provider-triggering ref updates**, not only the runtime of each build.

Default target for a coherent feature:

```text
one coherent branch/PR with as many local commits as needed
-> ordinary pushes spend zero Vercel build compute
-> zero Vercel Preview by default
-> at most one explicit Preview when human/provider evidence is actually needed
-> one Production build per accepted release batch
```

Rules:

1. Finish the coherent code/content batch and run the strongest available local/Agent checks before the first push. Do not push every typo, intermediate experiment or file write.
2. **Ordinary working refs do not trigger Vercel.** Public GHA owns PR CI. Move persistent `ci/vercel-gate-final` only when an explicit provider Preview is justified; do not create a fresh gate alias per PR and do not use `[vercel-preview]` as a spend switch.
3. Reuse the existing branch/PR. Do not create a duplicate PR to repair the same deployment or migration unless the old branch is genuinely unsafe to continue.
4. When a GitHub connector would otherwise write files one by one, prefer a checked-out worktree or one Git data API multi-file commit (`blob -> tree -> commit -> ref`). Sequential Contents API writes can create one Vercel deployment per ref update.
5. Keep stacked PRs only for real, reviewable dependencies. Stabilize the parent before repeatedly pushing the child, and do not mirror the same fix across multiple branches.
6. When several already-accepted PRs belong to one release window, one explicit integration/release head plus one merge to `main` may be used if authorship, review, rollback and ownership remain clear. Do not combine unrelated or unaccepted work only to reduce build count.
7. Batch evidence-driven Preview/provider fixes. The normal budget is zero Vercel Preview runs; when provider/human Preview evidence is needed, use one Preview plus at most one corrective Preview. Additional runs require a concrete new provider-specific reason.
8. Avoid direct micro-commits to `main`. Every deploy-relevant `main` update can become a Production build.
9. Docs/Agent-only changes should remain outside deploy-relevant paths. Public GHA may validate them without Vercel. On `main`/Production, a proven docs-only range may be ignored entirely and must not publish a new Production build. Do not request a Preview merely to manufacture a provider badge. Do not touch `src/`, `public/`, `scripts/`, tests or deployment config merely to manufacture a Preview badge.
10. Vercel same-branch auto-cancellation limits wasted execution when a newer push supersedes a running job, but a canceled/ignored deployment is not a substitute for batching pushes.
11. When usage matters, report deployment triggers separately as `READY`, `ERROR`, `CANCELED` and ignored/skipped when provider evidence is available. Do not report only successful builds.

## Parallel Agent and stacked-PR integration

The detailed semantic decision procedure is owned by [`multi-pr-semantic-integration-playbook.md`](./multi-pr-semantic-integration-playbook.md). This section owns the provider, build-budget and release boundaries. The historical case that produced the playbook is [`../history/2026-08-12-open-pr-semantic-integration.md`](../history/2026-08-12-open-pr-semantic-integration.md).

The reusable cross-project protocol is owned by `mykcs/myk-skills/website-improve/references/parallel-agent-delivery.md`. This repository adapts it as follows:

```text
latest intended base
├─ focused worker branch / Draft PR A ┐
├─ focused worker branch / Draft PR B ├─> explicit integration/release head
└─ focused worker branch / Draft PR C ┘        -> one exact-head combined Preview
                                               -> one accepted merge to main
                                               -> one Vercel Production build
                                               -> one post-release route/metadata audit
```

- Worker conversations do not merge their PRs to `main` independently when the owner intends one release batch. They record base/head SHA, changed files, checks, dependencies and shared surfaces such as layouts, global CSS, theme tokens, navigation, dependency manifests, lockfiles and deployment configuration.
- The integration conversation refreshes current `main`, inspects every candidate diff/check, and classifies textual, semantic/UI, research/evidence, device/runtime, dependency/generated, metadata/discovery and provider/release conflicts. A clean Git merge is not combined-product acceptance.
- Record which current authority owns every material overlapping surface, what each PR contributes, and which outcome is deliberately superseded before constructing the final tree.
- For stacked PRs, preserve the real dependency chain while it is still under review. Once the selected changes are accepted for one release, create one explicit integration head from the current intended base rather than merging each stacked layer separately into `main`.
- Choose ancestry deliberately. When worker heads must remain recognized while the resolved final tree differs from the mechanical merge, preserve that ancestry and state the required merge method; do not accidentally squash it away.
- Run `npm run verify:deploy` and `npm run build` on the exact integrated head. When provider-rendered hosted review is actually necessary, use one combined Vercel Preview and inspect the affected real routes, desktop/mobile behavior and light/dark themes. It is review evidence, not the required merge check.
- Earlier worker-branch Previews that already ran remain consumed. Opening a new integration chat or PR cannot retroactively turn them into one build; only future ref updates and current Vercel trigger rules can be controlled.
- After the integration PR is accepted, merge/update `main` once. Mark worker PRs as merged, incorporated-but-closed, superseded, deferred or rejected with explicit links instead of leaving ambiguous duplicate release paths.
- After Production is READY, inspect discovery and metadata surfaces separately. The 2026-08-12 release proved that new pages can build and return 200 while still being absent from `sitemap.xml`.
- Do not batch unrelated or unaccepted work merely to save builds. Reviewability, attribution, rollback and research/product integrity remain hard requirements.

## Executable build-scope protection

`vercel.json` owns two safeguards:

- `github.autoJobCancelation: true` keeps the newest same-branch job authoritative;
- `ignoreCommand: node scripts/vercel-ignore-build.mjs` decides whether a build is needed.

The ignored-build step still uses `VERCEL_GIT_PREVIOUS_SHA` for ordinary `main`/Production build relevance. Optional `ci/vercel-gate-final` Preview browser selection instead compares the exact candidate against remote `ci/vercel-gate-base` after verifying that base ref still equals live `main`. An enabled Preview always runs repository validation and the static build; missing/stale base identity, invalid Git range, or uncertainty fails closed in the optional Preview browser planner.

The path classifier and policy are protected by `src/lib/vercelBuildBudget.test.ts`.

`vercel.json -> git.deploymentEnabled` deliberately blocks ordinary working refs and enables only `main` plus `ci/vercel-gate-final`. The existing persistent gate ref is now an on-demand Preview trigger, not final merge authority. `scripts/vercel-ignore-build.mjs` still fails open for a triggered Preview so provider evidence cannot be satisfied by an ignored deployment. Merge readiness is owned by exact-head/current-base `public-ci-gate`.

## Node runtime major contract

The repository must declare an intentional Node major for Vercel rather than an open-ended future-major range.

Current contract:

```json
{
  "engines": {
    "node": "24.x"
  }
}
```

Rationale:

- Vercel treats `engines.node` in `package.json` as the repository runtime contract and it can override the project-setting major;
- a range such as `>=22.12.0` permits automatic adoption of later major releases and causes Vercel to warn that a future major will be selected automatically;
- when the intended deployed major is Node 24, `24.x` preserves patch/minor movement within that major without silently crossing to Node 25+;
- any future major upgrade must be an explicit source change accompanied by deterministic repository validation and exact-head Preview/Production evidence.

When investigating a runtime-version warning, inspect together:

```text
Vercel project runtime major
package.json engines.node
package manager / lockfile metadata
exact build log runtime selection or warning
```

If the lockfile root package metadata records `engines`, keep it synchronized when regenerating or intentionally changing the lockfile. Contradictory lockfile metadata is not the Vercel runtime authority, but it creates avoidable ambiguity for future Agents and tooling.

The deterministic policy test protecting the current contract is `src/lib/nodeRuntimePolicy.test.ts`.

Historical rationale: `../history/2026-08-26-results-release-node-runtime-retrospective.md`.

## Production release

After the accepted exact head is current with `main`:

```text
merge to main
-> Vercel Production build
-> https://basemodel-preview.vercel.app
-> verify indexability, canonical/hreflang, robots/sitemap, representative routes and interaction
```

One accepted release batch should normally create one Production build. Do not add a second `main` micro-commit merely to adjust release notes or wording that could have been included before merge.

## Repository Gate

Executable truth lives in `package.json`. `npm run verify:deploy` remains provider-neutral and includes the project’s deterministic checks/tests/audits. Do not weaken a valid Gate to get a green deployment.

The public GHA risk planner owns required Chromium coverage. Third-party/network audits remain on demand when the changed surface requires them.

### Serial browser-gate failures and retry discipline

A hosted browser command that uses `--max-failures=1` exposes only the first currently reachable failure. Output such as `66 passed / 1 failed / 22 did not run` does **not** prove the unexecuted tests are clean.

When a deployment fails in a serial UI gate:

```text
read the exact first assertion and measured values
-> classify product regression / stale test contract / invalid metric / harness-provider failure
-> make the smallest evidence-backed repair
-> rerun the complete gate
-> verify the formerly failing test passes
-> continue until the entire suite executes and passes
-> confirm the authoritative required GHA state or, for an explicit Preview incident, the authoritative Vercel state
```

Rules:

1. Do not issue blind no-op retries while Vercel logs contain an actionable application or assertion failure. A generic deployment badge is weaker evidence than the exact failing line and measured values.
2. A newly green formerly-failing test is only a checkpoint. Completion requires the whole gated suite to finish, plus the deployment reaching its authoritative success state.
3. If current source and focused product/unit contracts agree but an older E2E still pins retired headings, counts, DOM, or information architecture, update the stale assertion narrowly. Preserve unrelated overflow, geometry, theme, visibility, and interaction checks.
4. If the measurement itself is invalid for the rendered content, fix the metric rather than contorting the product. For example, a CJK-only density proxy is not appropriate for a deliberately mixed Chinese/English heading unless the English width is also accounted for.
5. Do not downgrade valid safety thresholds merely to obtain green status. First prove whether the failure is product, contract, or measurement.
6. Provider messages that explicitly fail open and continue the build, such as an ignore-range lookup failure, and benign environment fallbacks such as locale selection are not application failures by themselves. Classify them by whether execution actually stops.
7. For asynchronously measured UI, hydration completion is not automatically geometry readiness. If SVG connectors, ResizeObserver work, font loading, requestAnimationFrame measurement, virtualized layout or another derived visual state is part of the acceptance contract, wait for that final observable state rather than treating removal of a hydration marker or a fixed sleep as proof of readiness.
8. Retries may help diagnose a race, but a retry-only PASS is not stability evidence. After the real synchronization boundary is repaired, validate the regression with retries disabled when practical so the harness cannot hide the same race.

The historical incidents that motivated these rules are [`../history/2026-08-26-vercel-ui-gate-serial-failure-recovery.md`](../history/2026-08-26-vercel-ui-gate-serial-failure-recovery.md) and [`../history/2026-08-27-vercel-browser-gate-performance-and-lab-flaky-retrospective.md`](../history/2026-08-27-vercel-browser-gate-performance-and-lab-flaky-retrospective.md).

## CI-first completion report

Ordinary completion reports start with required GitHub CI, then report deployment separately:

```text
Exact PR head/current base
public-ci-gate + deterministic/browser outcome
Optional Vercel Preview only when one was actually requested
Merged to main
Vercel Production deployment + public verification
Cloudflare smoke when release/hosting observation is in scope
External boundary, only when it materially blocked or changed the result
```

For a parallel release batch, also report candidate PRs inspected, accepted/deferred/superseded, conflict classes checked, integration head SHA, combined Preview evidence, merge method, final worker-PR disposition and any post-release corrective PR.

Do not include Cloudflare in an ordinary completion report merely because historical config, an old snapshot or dormant fallback code still exists. Mention a legacy provider only when:

- the user explicitly asks about it;
- the task changes or retires that legacy surface;
- rollback is actually being exercised; or
- live provider evidence shows unexpected legacy activity.

## Legacy external-integration safeguard

A historical external Git integration may still exist outside repository control. Until it is disabled account-side, an existing skip prefix may remain necessary as a silent compatibility safeguard. It is not an ordinary deployment stage, quota to monitor, or completion-report line unless it unexpectedly activates or the task explicitly concerns its retirement.

Do not infer exact provider quota counters without authoritative account evidence.
