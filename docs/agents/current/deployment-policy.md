# Deployment and validation policy

Last reviewed: **2026-09-06**

## Authority

```text
GitHub = canonical source

non-draft PR merge candidate
-> CircleCI GitHub App CI
-> deterministic repository gate
-> risk-based Chromium acceptance (focused or 2 full shards)

main
-> CircleCI post-merge revalidation
-> Vercel Production
-> https://basemodel-preview.vercel.app

manual recovery only
-> GitHub Actions workflow_dispatch
-> repository-scoped Mac/OrbStack runner
```

**Vercel is the only ordinary deployment authority. CircleCI is the ordinary CI execution authority.** GitHub Actions hosted compute and GitHub Pages remain outside the ordinary Base Model path. Cloudflare remains post-deploy observation plus dormant fallback assets, not a second deployment authority.

### CircleCI primary CI

The repository-owned `.circleci/config.yml` is the primary CI contract. The `mykcs` CircleCI organization is connected through the CircleCI GitHub App for `mykcs/basemodel`; provider-side trigger configuration must stay narrow:

- non-draft PR opened;
- PR marked ready for review;
- pushes to open non-draft PRs;
- pushes to the default branch.

Draft iteration therefore consumes no heavy browser CI until the PR becomes merge-ready. Redundant branch workflows are auto-cancelled provider-side.

`main` branch protection uses strict up-to-date semantics and requires all three cloud contexts:

```text
ci/circleci: deterministic
ci/circleci: browser_shard_1
ci/circleci: browser_shard_2
```

A PR check must validate the **merge candidate**, not merely the branch head. `scripts/ci-circleci-prepare.sh` materializes `base + PR head` as a two-parent synthetic merge commit and exports the exact comparison range used by all three jobs. If base/head identity cannot be proven, CI fails closed.

The deterministic cloud runtime remains pinned to the qualified Debian 12 / Node 24 container identity. Browser qualification uses the exact Playwright 1.62.1 Noble image only when its preinstalled Chromium identity is verified at runtime; deterministic validation and browser validation remain separate jobs. Full browser acceptance uses two independent CircleCI `medium` shards with one Playwright worker each. `scripts/ci-ui-test-list.mjs` enumerates the current canonical Chromium suite and assigns individual test cases by the exact `202609061200` one-worker timing receipt; unknown or renamed tests remain included with a conservative weight. Focused browser work is owned by shard 1 and the other shards exit before browser installation. Documentation-only PRs exit before npm/browser work after the documentation contract passes.

Do not treat CircleCI provider configuration, a green historical run, or a branch-head benchmark as merge evidence. Required acceptance is the current exact PR head/current-base result plus the repository's ordinary merge rules.

### Risk-aware browser gate

Browser regression does not run inside the ordinary Vercel Production build. `scripts/ci-ui-gate.mjs` reuses `scripts/vercel-ui-plan.ts`; there is one risk taxonomy, not a provider-specific duplicate.

```text
non-UI / governance-only diff
-> deterministic documentation contract
-> browser jobs halt before install

bounded route-owned UI diff
-> verify:deploy + build
-> focused mapped Chromium specs / changed-route smoke

shared/global/unknown UI diff
-> verify:deploy + build
-> complete Chromium matrix split across two cloud shards

Lab/server-relevant diff
-> dedicated 12-case Lab gate on shard 1
```

Changes to the CI/browser gate, CircleCI config, merge-candidate preparation, or retained Mac fallback environment fail closed to full browser coverage. Never weaken assertions or silently reclassify unknown ownership merely to reduce credits.

### Mac manual fallback

`.github/workflows/self-hosted-ci.yml` is a **manual recovery canary only**. It has `workflow_dispatch` and no automatic PR/main triggers. Its job is `basemodel-mac-fallback`, runs on the repository-scoped `basemodel-ci` OrbStack runner, and explicitly forces the complete browser matrix so a manual canary cannot accidentally become a no-op when base/head are identical.

The assets under `.github/runner/` remain recoverable infrastructure: immutable runner/container inputs, start/stop/reconcile/doctor scripts, bounded workspace cleanup, no host mounts, no Docker socket, no published ports, dropped Linux capabilities, bounded CPU/memory/process/log limits, and fail-closed busy-state checks. They are **not** ordinary CI execution authority.

On the owner's Mac, the BaseModel LaunchAgent should remain disabled during ordinary operation so Remote Desktop Commander, SSH, browser automation, and other control-plane work do not compete with persistent CI. If the cloud provider is unavailable and a manual fallback is explicitly needed, restore the runner deliberately, run the manual canary, then return it to the disabled state. Never redirect ordinary CI to research/GPU servers.

### Vercel responsibilities

Project `basemodel-preview` owns both deployment environments. Every deployable Preview/Production build uses:

`npm run verify:deploy && npm run build`

Do not disable Vercel Git deployment on `main`.

Preview acceptance requires exact-head provider success plus real route/metadata inspection. Preview is automatically `noindex` when `VERCEL_ENV=preview`; canonical/hreflang continue to point to the stable Production project domain.

Preview branch eligibility is only the first filter; it is **not permission to spend build compute on every intermediate push**. `scripts/vercel-ignore-build.mjs` requires the exact-head commit message to contain `[vercel-preview]` when `VERCEL_ENV=preview`. Without that token, an eligible Preview trigger exits through the ignored-build path before `verify:deploy`, the static build, or hosted browser work. Production is never gated by this token. A tokenized Preview can still be ignored when the proven Git range is docs/governance-only.

### Cloudflare post-deploy smoke

Cloudflare is not a second deployment authority. `cloudflare/production-smoke/` owns a small Worker that independently checks the real Vercel Production origin: critical HTTP 200s, canonical identity, Production indexability, `robots.txt`, `sitemap.xml`, and the legacy Results redirect. A scheduled check runs every 30 minutes. The deployed health endpoint is `https://basemodel-production-smoke.mykcs01.workers.dev/healthz`.

Do not move repository compilation, npm installation, Vitest, the full Playwright matrix, or screenshot baselines into this Worker. Its job is post-deploy observation, not CI replacement.

### Cost and provider guardrails

- Optimize test selection and sharding before buying larger runners or moving the same inefficient gate to another provider.
- Re-check CircleCI/Cloudflare/GitHub/Vercel quota and billing semantics live; dated free-tier numbers are historical evidence, not repository authority.
- Vercel project build-machine selection remains fixed Standard unless a measured same-workload cost reason justifies a change.
- Heavy Chromium/Lab acceptance belongs to CircleCI; Vercel Production must not install Chromium merely to duplicate CI.
- CircleCI fork PR builds and fork-secret passing remain disabled; SSH reruns remain disabled; redundant branch workflows remain auto-cancelled.
- A provider scheduler is not the compute surface. Keep source hosting, CI control plane, CI compute, deployment, and post-deploy monitoring conceptually separate.

The Mac/OrbStack architecture was the accepted 2026-08-29 baseline and the 20–25 minute CI investigation/optimization is preserved in the dated history documents. Those files explain why the architecture changed; they do not override this current authority. See [`../history/2026-09-05-ci-first-principles-cloud-migration-and-web-ci-retrospective.md`](../history/2026-09-05-ci-first-principles-cloud-migration-and-web-ci-retrospective.md) and [`../history/2026-09-05-basemodel-ci-optimization-closeout-experience.md`](../history/2026-09-05-basemodel-ci-optimization-closeout-experience.md).

## Vercel build-budget discipline

Vercel deployments/builds are finite resources. Optimize the **number of provider-triggering ref updates**, not only the runtime of each build.

Default target for a coherent feature:

```text
one coherent branch/PR
-> one atomic multi-file push
-> one initial exact-head Preview
-> at most one corrective Preview after real route/log inspection
-> one Production build per accepted release batch
```

Rules:

1. Finish the coherent code/content batch and run the strongest available local/Agent checks before the first push. Do not push every typo, intermediate experiment or file write.
2. **Opt in only the exact head that needs hosted review.** Put `[vercel-preview]` in that commit message; ordinary intermediate pushes on deployment-eligible Preview branches should omit it and be ignored before the expensive build.
3. Reuse the existing branch/PR. Do not create a duplicate PR to repair the same deployment or migration unless the old branch is genuinely unsafe to continue.
4. When a GitHub connector would otherwise write files one by one, prefer a checked-out worktree or one Git data API multi-file commit (`blob -> tree -> commit -> ref`). Sequential Contents API writes can create one Vercel deployment per ref update.
5. Keep stacked PRs only for real, reviewable dependencies. Stabilize the parent before repeatedly pushing the child, and do not mirror the same fix across multiple branches.
6. When several already-accepted PRs belong to one release window, one explicit integration/release head plus one merge to `main` may be used if authorship, review, rollback and ownership remain clear. Do not combine unrelated or unaccepted work only to reduce build count.
7. Batch evidence-driven Preview fixes. The normal budget is one initial Preview plus at most one corrective Preview; more pushes require a concrete reason such as a newly discovered Gate failure, exact-head synchronization conflict or real browser finding.
8. Avoid direct micro-commits to `main`. Every deploy-relevant `main` update can become a Production build.
9. Docs/Agent-only changes should remain outside deploy-relevant paths so the ignored-build step can skip them on PR, `main` and Production as well as ordinary branch Previews. The Vercel environment/ref class does not override a proven docs-only diff. Do not touch `src/`, `public/`, `scripts/`, tests or deployment config merely to obtain a Preview badge.
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

The ignore script compares `VERCEL_GIT_PREVIOUS_SHA` with the current commit so multi-commit pushes and accumulated docs-only changes are classified against the previous successful deployment, rather than only looking at `HEAD^..HEAD`. The same path decision applies to ordinary branch Previews, PRs, `main` and Production: when the proven range contains no deploy-relevant path, the command exits `0` and Vercel ignores the build. Missing Git history, an invalid range, or any uncertainty **fails open** and runs the build. An ignored trigger may still appear as an ignored/skipped deployment record; the guarantee here is that Vercel does not execute the site build for a proven docs/Agent-only range.

The path classifier and policy are protected by `src/lib/vercelBuildBudget.test.ts`.

Branch/ref deployment eligibility is also policy. When `vercel.json -> git.deploymentEnabled` excludes a ref class, the absence of a Preview deployment is expected and must not be reported as a Vercel outage. Release/debugging Agents must check ref eligibility and live deployment objects before assigning provider blame; the exact closeout procedure is owned by `release-closeout-protocol.md`.

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
