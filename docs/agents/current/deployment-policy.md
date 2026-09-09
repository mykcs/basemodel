# Deployment and validation policy

Last reviewed: **2026-09-09**

## Authority

Provider-selection rationale: [`ci-provider-decision.md`](ci-provider-decision.md). This file owns the executable release/validation policy; the rationale file explains why the provider topology was chosen and when to reconsider it.

```text
GitHub = canonical source

working PR / development branch
-> public hosted GitHub Actions preflight: deterministic gate + shared risk planner + up to 4 independent Chromium shards
-> no ordinary Vercel Preview while iterating

final non-draft current-base candidate
-> run `node scripts/request-vercel-final-gate.mjs <PR_NUMBER>`; it records live `main` in non-deploy `ci/vercel-gate-base` before moving persistent `ci/vercel-gate-final` to the exact PR head SHA
-> Vercel Pro Preview on that exact SHA
-> npm run verify:deploy
-> npm run build
-> risk-based Chromium acceptance
-> 12-case Lab acceptance when relevant
-> required GitHub status: Vercel on the exact candidate SHA
-> CircleCI automatic PR/main workflows disabled; API-triggered manual fallback only

main
-> Vercel Production
-> the same deterministic + risk-based browser contract
-> https://basemodel-preview.vercel.app
-> Cloudflare production-smoke observes the released origin

manual recovery only
-> GitHub Actions workflow_dispatch
-> repository-scoped Mac/OrbStack runner
```

**Cutover state: complete.** Live `main` branch protection was verified on **2026-09-08** at `main@f64f742807e269885970eb2c5e7499b7af3639d2`: the only required GitHub status is **`Vercel`**. CircleCI contexts are not required checks and do not own merge readiness. Automatic CircleCI PR/main workflows are disabled.

**Vercel remains the required final-candidate CI and deployment authority.** Public GitHub-hosted Actions is now the ordinary non-required PR preflight compute lane; it runs automatically because the public repository can use standard hosted runners without consuming the former private-repository minute budget. CircleCI remains explicit API-triggered fallback, and the Mac/OrbStack workflow remains self-hosted manual fallback. Cloudflare remains post-deploy observation plus dormant fallback assets, not a second deployment authority.

### Exact-head and current-base acceptance

`main` branch protection must keep strict up-to-date semantics and require the `Vercel` status. Ordinary working refs do not spend Vercel compute. When a PR is ready for merge, run `node scripts/request-vercel-final-gate.mjs <PR_NUMBER>`; it first pins non-deploy `ci/vercel-gate-base` to live `main`, then moves the **already-existing persistent** `ci/vercel-gate-final` ref to the **same exact commit SHA** as the current PR head; the gate ref must not add, cherry-pick, rebuild, or otherwise change content. Do not rely on creating a new ref at an already-known SHA: live Vercel qualification showed ref creation produced no provider event, while an existing-ref update did. GitHub status is accepted only for that exact candidate SHA. If `main` moves, strict protection makes the PR stale and forces a current-base update plus a fresh gate ref / Vercel result before merge; a historical Preview is never current merge evidence.

For the persistent final-gate Preview, `scripts/request-vercel-final-gate.mjs` first pins non-deploy `ci/vercel-gate-base` to the exact live `main`, then moves `ci/vercel-gate-final` to the candidate. `scripts/vercel-git-range.mjs` independently checks that the remote base ref still equals live `main` and compares that base tree directly with the exact candidate. It deliberately does **not** use `VERCEL_GIT_PREVIOUS_SHA` for the persistent gate, because that SHA can belong to an unrelated prior PR and would cause expensive false-full browser runs. Missing/stale base identity fails closed to the complete Chromium matrix.

### Provider cutover is a repository + live-control-plane transaction

Changing `vercel.json`, tests, docs, or the declared current architecture is only the **repository half** of a CI/provider migration. Before reporting that blocking acceptance authority moved, read the live GitHub ruleset/branch-protection state and prove the replacement provider object for the exact head.

Required sequence:

```text
replacement repository contract
-> exact-head provider execution really runs and passes
-> live required-status authority is switched atomically
-> predecessor may remain as non-blocking shadow/fallback
-> merge under the new required authority
-> Production/main executes the same contract and reaches accepted state
```

Do not create a temporary window with no required acceptance by deleting the predecessor check first and adding the successor later. Preserve unrelated PR/review/thread protections while changing only the required-status owner. Immediately before mutating provider/repository control-plane state, re-read it: another Agent or administrator may already have completed the change. If the desired live state already exists, do not overwrite it merely to make this conversation the writer of record.

A replacement provider `ERROR` must also be localized by **execution phase** before the migration is blamed on infrastructure. A failure inside `verify:deploy` from a stale authority assertion is repository contract drift; a browser assertion is product/acceptance evidence; a missing binary/library is environment; only provider/platform evidence should be labeled provider infrastructure failure.

### Final-gate Preview and ordinary working-ref policy

`vercel.json -> git.deploymentEnabled` is the first spend gate. Ordinary development refs are disabled before provider compute; only `main` and explicit `ci/vercel-gate-final` refs are deployment-enabled. The repository-owned `scripts/vercel-ignore-build.mjs` remains a second fail-safe once an enabled ref reaches Vercel:

- every triggered `VERCEL_ENV=preview` execution is a real acceptance build. The Ignored Build Step intentionally does **not** rely on `VERCEL_GIT_PULL_REQUEST_ID`, because real provider evidence showed that variable can be absent at the pre-build boundary;
- `ci/vercel-gate-final` is one persistent execution alias, not a new candidate: update that existing ref byte-for-byte to the exact PR head commit SHA;
- `[vercel-preview]` is only a historical/review marker and never opens the spend gate;
- a docs/governance-only final candidate still runs `verify:deploy` when its explicit gate ref is created, but the browser planner may skip Chromium when the diff is proven non-UI;
- a docs/governance-only change on `main` remains non-deploy-relevant and **must not publish a Production build**. This preserves the rule that changing `AGENTS.md` or `docs/agents/**` cannot replace the website Production artifact.

### Shared risk-aware browser gate: public GHA preflight + Vercel final

Public GHA and Vercel use the same risk taxonomy. Public GHA provides the cheap parallel feedback lane; Vercel proves the exact final candidate in the deployment provider. Full/global public-GHA work is timing-balanced over four independent shards with one worker each; bounded work remains focused; unknown ownership fails closed. Vercel retains the required status and its own risk-based Chromium/Lab acceptance.

### Risk-aware browser gate on Vercel Pro

The Vercel build command is:

```bash
npm run verify:deploy && npm run build && node scripts/vercel-ui-gate.mjs && node scripts/vercel-lab-browser-gate.mjs
```

`vercel-ui-gate.mjs` and `ci-ui-gate.mjs` share `scripts/vercel-ui-plan.ts`; there is one risk taxonomy, not a provider-specific weaker copy. The public GHA full path preserves canonical identities, retries=0, and one worker per independent shard.

```text
non-UI / governance-only diff
-> verify:deploy + static build
-> hosted browser layer may skip

bounded route-owned UI diff
-> verify:deploy + build
-> focused mapped Chromium specs / changed-route smoke

shared/global/unknown UI diff
-> verify:deploy + build
-> complete canonical Chromium matrix

Lab/server-relevant diff
-> dedicated 12-case Lab gate
```

Changes to the Vercel gate, planner, deployment config, CircleCI manual-fallback config, merge-candidate tooling, or retained Mac fallback environment fail closed to full browser coverage. Never weaken assertions, reader-contract checks, scientific-content boundaries, or unknown-owner handling merely to reduce wall time or credits.

The canonical Chromium suite remains `npm run test:ui`. Vercel chooses Playwright workers from visible build CPUs with the existing half-CPU rule capped at four; provider evidence, not a hard-coded Pro assumption, decides the actual worker count. CircleCI's two-shard implementation and static timing receipt remain available only inside the manual API fallback and do not own merge readiness.

### Budget-first execution

Vercel Pro is metered, so ordinary pushes use the public GHA preflight and spend zero Vercel compute. Keep `github.autoJobCancelation=true`, finish coherent batches before requesting the persistent Vercel final gate, and let the shared risk-aware planner control unchanged browser work. A skipped/focused/full browser plan is an optimization of **which unchanged tests need to run**, never an assertion reduction.

Routine Dependabot version updates keep their existing weekly schedule, grouping and major-upgrade boundaries, with at most one open version-update PR. Security updates have a separate GitHub limit and are not disabled. This bounds concurrent update churn; it does not retroactively cancel existing PRs or guarantee fewer eventual updates.

### Reading provider evidence when the dashboard fails

Use structured exact-SHA provider/status reads for job identity and state, and provider job/workflow timing for consumption evidence. A dashboard interaction timeout is a monitoring failure until job state or terminal output proves otherwise.

For canvas/virtualized logs, DOM snapshots may expose only line numbers even when the screenshot contains text. After the same action fails again without new evidence, change the read path instead of repeating clicks, scrolls or full-page screenshots: use the UI's observed standalone step-output link, documented log retrieval/export where available, or a fresh task-owned tab. Wait for rendering before interpreting a blank screenshot. Keep browser bindings/session boundaries intact; never extract cookies, call hidden page APIs, weaken access controls or close other tasks' tabs to repair monitoring.

Retrieve only missing evidence: metadata for durations, terminal summary for actual passed/skipped/retried cases. Do not rerun a green workflow merely to obtain easier logs. Bound returned output; recover required text hidden by truncation instead of claiming it was read. Follow existing operating-principles wait discipline and record the exact receipt once available.

Historical example and limits: [mechanism CI route ownership](../history/2026-09-07-mechanism-ci-route-ownership.md).

### Mac manual fallback

`.github/workflows/self-hosted-ci.yml` is a **manual recovery canary only**. It has `workflow_dispatch` and no automatic PR/main triggers. Its job is `basemodel-mac-fallback`, runs on the repository-scoped `basemodel-ci` OrbStack runner, and explicitly forces the complete browser matrix so a manual canary cannot accidentally become a no-op when base/head are identical.

The assets under `.github/runner/` remain recoverable infrastructure: immutable runner/container inputs, start/stop/reconcile/doctor scripts, bounded workspace cleanup, no host mounts, no Docker socket, no published ports, dropped Linux capabilities, bounded CPU/memory/process/log limits, and fail-closed busy-state checks. They are **not** ordinary CI execution authority.

On the owner's Mac, the BaseModel LaunchAgent should remain disabled during ordinary operation so Remote Desktop Commander, SSH, browser automation, and other control-plane work do not compete with persistent CI. If the cloud provider is unavailable and a manual fallback is explicitly needed, restore the runner deliberately, run the manual canary, then return it to the disabled state. Never redirect ordinary CI to research/GPU servers.

Recovery state is deliberately layered:

```text
GitHub repository -> canonical Dockerfile / runner scripts / policy
private GHCR      -> optional clean immutable runner-image recovery copy
Mac/OrbStack      -> disabled manual-fallback container + bounded local cache
```

Do not archive a registered runner container as the recovery image. Runner registration credentials, `.runner` identity, workspace, diagnostics, package/browser caches and temporary files are machine state and must remain reconstructible/disposable. If a clean runner image is published to GHCR, verify the package is private and the remote manifest digest equals the intended local immutable identity before treating it as recovery evidence. Hugging Face is for scientific/model/data artifacts, not OCI CI runtimes.

Housekeeping is fail-closed around shared state: a cache prune requires the BaseModel runner to be proven idle and every peer sharing that Docker/BuildKit cache to be proven idle, or intentionally disabled with its runner container stopped/absent. Unknown state means no prune. Keep bounded tool-owned cache policies and deliberate rollback/fallback assets; `docker system df` reclaimable output alone never authorizes deletion and broad `docker system prune` is outside ordinary runner housekeeping.

The accepted cloud browser design uses **independent shards with one Playwright worker each**. Historical attempts to run two Playwright workers inside the same bounded Mac executor reduced elapsed time before failure but did not preserve the complete matrix: first the monolithic all-route header sweep timed out, then after deterministic route sharding another layout test timed out. Therefore worker-count experiments must remain isolated benchmarks and may enter current CI only after the entire exact-head matrix passes without retries/semantic weakening and the improvement is material.

### Vercel responsibilities

Project `basemodel-preview` owns both deployment environments. Every deployable Preview/Production build uses:

`npm run verify:deploy && npm run build && node scripts/vercel-ui-gate.mjs && node scripts/vercel-lab-browser-gate.mjs`

Do not disable Vercel Git deployment on `main`.

Preview acceptance requires exact-head provider success plus real route/metadata inspection. Preview is automatically `noindex` when `VERCEL_ENV=preview`; canonical/hreflang continue to point to the stable Production project domain.

Every Preview that reaches Vercel through an enabled `ci/vercel-gate-final` ref is real acceptance and cannot be skipped by omitting a commit token. `[vercel-preview]` is not an executable pre-build gate. Ordinary working refs are excluded earlier by `git.deploymentEnabled`; Production is never gated by this token. A proven docs/governance-only `main` range is still ignored so governance edits cannot replace Production.

### Cloudflare post-deploy smoke

Cloudflare is not a second deployment authority. `cloudflare/production-smoke/` owns a small Worker that independently checks the real Vercel Production origin: critical HTTP 200s, canonical identity, Production indexability, `robots.txt`, `sitemap.xml`, and the legacy Results redirect. A scheduled check runs every 30 minutes. The deployed health endpoint is `https://basemodel-production-smoke.mykcs01.workers.dev/healthz`.

Do not move repository compilation, npm installation, Vitest, the full Playwright matrix, or screenshot baselines into this Worker. Its job is post-deploy observation, not CI replacement.

### Cost and provider guardrails

- Optimize test selection and sharding before buying larger runners or moving the same inefficient gate to another provider.
- Re-check CircleCI/Cloudflare/GitHub/Vercel quota and billing semantics live; dated free-tier numbers are historical evidence, not repository authority.
- Vercel project build-machine selection remains fixed Standard unless a measured same-workload cost reason justifies a change.
- Parallel Chromium preflight belongs on public GitHub-hosted runners; exact final Preview/Chromium/Lab acceptance and merge authority remain on Vercel Pro. CircleCI may run the retained contract only when explicitly triggered through the manual API fallback; it must not duplicate ordinary merge authority.
- CircleCI fork PR builds and fork-secret passing remain disabled; SSH reruns remain disabled; redundant branch workflows remain auto-cancelled.
- A provider scheduler is not the compute surface. Keep source hosting, CI control plane, CI compute, deployment, and post-deploy monitoring conceptually separate.

The Mac/OrbStack architecture was the accepted 2026-08-29 baseline and the 20–25 minute CI investigation/optimization is preserved in the dated history documents. Those files explain why the architecture changed; they do not override this current authority. See [`../history/2026-09-05-ci-first-principles-cloud-migration-and-web-ci-retrospective.md`](../history/2026-09-05-ci-first-principles-cloud-migration-and-web-ci-retrospective.md) and [`../history/2026-09-05-basemodel-ci-optimization-closeout-experience.md`](../history/2026-09-05-basemodel-ci-optimization-closeout-experience.md).

## Vercel build-budget discipline

Vercel deployments/builds are finite resources. Optimize the **number of provider-triggering ref updates**, not only the runtime of each build.

Default target for a coherent feature:

```text
one coherent branch/PR with as many local commits as needed
-> ordinary pushes spend zero Vercel build compute
-> one explicit final gate ref on the exact accepted-candidate SHA
-> at most one corrective gate Preview after a real Gate finding
-> one Production build per accepted release batch
```

Rules:

1. Finish the coherent code/content batch and run the strongest available local/Agent checks before the first push. Do not push every typo, intermediate experiment or file write.
2. **Ordinary working refs do not trigger Vercel.** Push intermediate development commits as needed; when the exact candidate is ready, move the persistent `ci/vercel-gate-final` ref to that SHA. Do not create a fresh gate alias per PR and do not use `[vercel-preview]` as a spend switch.
3. Reuse the existing branch/PR. Do not create a duplicate PR to repair the same deployment or migration unless the old branch is genuinely unsafe to continue.
4. When a GitHub connector would otherwise write files one by one, prefer a checked-out worktree or one Git data API multi-file commit (`blob -> tree -> commit -> ref`). Sequential Contents API writes can create one Vercel deployment per ref update.
5. Keep stacked PRs only for real, reviewable dependencies. Stabilize the parent before repeatedly pushing the child, and do not mirror the same fix across multiple branches.
6. When several already-accepted PRs belong to one release window, one explicit integration/release head plus one merge to `main` may be used if authorship, review, rollback and ownership remain clear. Do not combine unrelated or unaccepted work only to reduce build count.
7. Batch evidence-driven Gate fixes. The normal budget is one final gate Preview plus at most one corrective gate Preview; ordinary development pushes are not Vercel events. Additional gate runs require a concrete reason such as a newly discovered Gate failure, exact-head synchronization conflict or real browser finding.
8. Avoid direct micro-commits to `main`. Every deploy-relevant `main` update can become a Production build.
9. Docs/Agent-only changes should remain outside deploy-relevant paths. They consume no Vercel while iterating; if they are a final candidate, the explicit gate ref still runs `verify:deploy`, while the hosted browser layer may skip when UI risk is proven absent. On `main`/Production, a proven docs-only range may be ignored entirely. Do not touch `src/`, `public/`, `scripts/`, tests or deployment config merely to manufacture a Preview badge.
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
- Run `npm run verify:deploy` and `npm run build` on the exact integrated head. When hosted review is necessary, use one combined Vercel Preview and inspect the affected real routes, desktop/mobile behavior and light/dark themes before release.
- Earlier worker-branch Previews that already ran remain consumed. Opening a new integration chat or PR cannot retroactively turn them into one build; only future ref updates and current Vercel trigger rules can be controlled.
- After the integration PR is accepted, merge/update `main` once. Mark worker PRs as merged, incorporated-but-closed, superseded, deferred or rejected with explicit links instead of leaving ambiguous duplicate release paths.
- After Production is READY, inspect discovery and metadata surfaces separately. The 2026-08-12 release proved that new pages can build and return 200 while still being absent from `sitemap.xml`.
- Do not batch unrelated or unaccepted work merely to save builds. Reviewability, attribution, rollback and research/product integrity remain hard requirements.

## Executable build-scope protection

`vercel.json` owns two safeguards:

- `github.autoJobCancelation: true` keeps the newest same-branch job authoritative;
- `ignoreCommand: node scripts/vercel-ignore-build.mjs` decides whether a build is needed.

The ignored-build step still uses `VERCEL_GIT_PREVIOUS_SHA` for ordinary `main`/Production build relevance, but persistent final-gate browser selection does not. For `ci/vercel-gate-final`, `scripts/vercel-git-range.mjs` compares the exact candidate against remote `ci/vercel-gate-base`, after verifying that base ref still equals live `main`. An enabled gate Preview therefore always runs `verify:deploy` and the static build, while a proven docs/Agent-only candidate can skip Chromium/Lab. Missing/stale base identity, invalid Git range, or any uncertainty **fails closed to full browser acceptance**, not to a cheaper assumption.

The path classifier and policy are protected by `src/lib/vercelBuildBudget.test.ts`.

`vercel.json -> git.deploymentEnabled` deliberately blocks ordinary working refs and enables only `main` plus `ci/vercel-gate-final`. Final acceptance is requested by updating the existing persistent gate ref to the exact PR head SHA; `scripts/vercel-ignore-build.mjs` then fails open for that Preview so the required `Vercel` status cannot be satisfied by an ignored deployment. Spend control therefore starts before provider compute, with the risk planner providing a second layer of runtime optimization. If the exact candidate SHA lacks a green Vercel status, it is not merge-ready.

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

Full browser suites and third-party/network audits remain on demand when the changed surface requires them.

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
-> confirm authoritative Vercel state
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

## Vercel-first completion report

Ordinary completion reports are Vercel-first and report separately:

```text
Repository Gate/build
Vercel deployment triggers: total / READY / ERROR / CANCELED / ignored when known
Vercel Preview + exact head
Preview route/metadata acceptance
Merged to main
Vercel Production deployment + public verification
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
