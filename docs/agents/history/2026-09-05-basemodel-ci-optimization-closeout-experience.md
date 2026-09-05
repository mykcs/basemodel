# Base Model CI optimization closeout experience — 2026-09-05

Status: **historical case evidence, not current policy**.

This file records the final closeout lessons from the Base Model CI optimization work that culminated in PRs #433 and #439. It intentionally does **not** create a new CI governance layer.

Current authority remains:

1. `/AGENTS.md` for startup-visible invariants and task routing;
2. `docs/agents/current/project-agent-operating-principles.md` for read-before-write, tool-boundary, failure-classification, and durable-knowledge rules;
3. `docs/agents/current/website-engineering-standard.md` for CI optimization, exact-tree acceptance, build-budget, and temporary-harness rules;
4. `docs/agents/current/release-closeout-protocol.md` for exact-head, retry/flaky, expected-head merge, and post-merge acceptance;
5. `.github/workflows/self-hosted-ci.yml`, planner/tests/config, branch protection, and live GitHub/Vercel state for executable/provider truth.

The broader provider/CI reasoning that preceded this closeout is already preserved in `2026-09-05-ci-first-principles-cloud-migration-and-web-ci-retrospective.md`; the earlier Mac/self-hosted architecture incident is preserved in `2026-08-29-ci-runner-cloudflare-vercel-offload-retrospective.md`. This file adds only the closeout-specific lessons that were not yet captured as a finished case.

---

## 1. Historical outcome boundary

The optimization implementation was merged through PR #433. The exact accepted PR head was `1ebbcab675308c95783e5d4dde6f10c7d0c7a06c`; the squash/main commit was `9ba65cf02d588d9027a7de6716d08c2075ec9714`.

The automatic post-merge Self-hosted CI run `33924493381` was bound to that exact main SHA.

- Attempt 1 passed deterministic verification and the production build, then failed in `ordinary-tech-debt-round2.spec.ts` while exercising a `client:visible` Landscape control. The expected hydrated note did not appear inside the five-second window.
- Neither the Landscape product component nor that test was changed by the optimization PR.
- No assertion, timeout, product behavior, or scientific/site semantics were weakened to manufacture green.
- GitHub reran the same workflow on the **same exact SHA**. Attempt 2 succeeded, including deterministic verification, production build, and risk-based browser acceptance.

A separate docs-only closeout PR #439 then updated `docs/agents/current/basemodel-ci-optimization-execution-20260905.md` to `Status: COMPLETE`, checked every remaining Section 13 item, and marked Main integration PASS. Its exact validated head was `b54e3c109c46524ae6a793245b31cff28cb5e3ec`; its docs-only required check passed without running the heavyweight browser path. It was squash-merged with expected-head protection as main commit `3694b1cec87e13c0c7b595c21faecf59a4c4d22f`.

At that final main, the COMPLETE checklist was present and the temporary benchmark workflow was absent.

All IDs, SHAs, timings, and PR numbers in this section are **historical receipts only**. They are not current-state claims for future work.

---

## 2. Durable lesson: acceptance identity is an exact tree, not a remembered green PR

### What happened

The closeout did not stop at “#433 merged” or “the PR check was green.” It explicitly verified the automatic post-merge run against the exact main SHA produced by the squash merge, then separately verified that the final docs-only closeout main contained the COMPLETE checklist and no temporary benchmark workflow.

### Why this matters

A PR number, branch name, previous check, or READY badge is not an immutable acceptance identity. Heads move; main moves; squash changes commit identity; conditional gates can skip; provider checks can report success for a different tree.

### Wrong assumption to avoid

> “This PR already passed once, therefore whatever is currently on the branch/main is accepted.”

### Before acting next time, check

```text
current PR head SHA
current intended base/main SHA
which exact SHA each required check tested
whether a squash/rebase changed commit identity
whether the final main tree contains the accepted files and excludes temporary artifacts
```

### Defensive rule

**Never authorize merge or closeout from a PR/branch label alone. Tie every acceptance claim to the exact tree that was tested, merge with expected-head protection when available, and verify the resulting main separately.**

### Counterexample

It is not enough that a prior PR run passed if a later documentation, workflow, planner, test, or conflict-resolution commit changed the head. The prior PASS is historical evidence, not current acceptance.

---

## 3. Durable lesson: same-SHA retry helps classify a failure, but it does not erase the first failure

### What happened

The first automatic post-merge attempt failed only in a browser hydration timing path. The same exact SHA passed on attempt 2.

### Why this was easy to misread

Two bad simplifications were both tempting:

1. “The first red run means the optimization regressed the site.”
2. “The second green run means the first red run never mattered.”

Both are wrong.

### Missing context that mattered

The failing component/test was outside the optimization diff, deterministic verification and build had already passed, the failure mode was timing-sensitive, and the rerun used the identical commit.

### Before changing code next time, check

```text
Did the candidate change the failing product/test/harness surface?
Did deterministic/build stages fail too, or only one browser timing assertion?
Can the same exact failing case be reproduced on the candidate and intended base?
Did the rerun use the identical SHA and equivalent environment?
Was a retry already configured, and did it hide instability inside one nominally successful job?
```

### Defensive rule

**Classify the first failure honestly. A same-SHA rerun is useful diagnostic evidence for flakiness/environment/timing, but it is not permission to relabel the first attempt PASS or weaken assertions. Preserve both receipts and separate a recurring flaky-test repair from an otherwise correct CI-optimization closeout.**

### Counterexample

Do not increase a five-second product-readiness timeout, delete the assertion, or switch an island to eager hydration merely because a same-SHA retry eventually passed. Those changes alter harness or product semantics and require their own evidence.

---

## 4. Durable lesson: a closeout PR should validate what it changes, not replay heavyweight product acceptance by ritual

### What happened

PR #439 changed only closeout documentation. The repository classifier gave it the docs-only path: the required documentation contract ran and passed; npm install, deterministic product validation, build, and browser acceptance were skipped by policy.

### Why this matters

The optimization would partly defeat itself if every receipt update forced the same 20–25 minute browser suite that the planner was designed to avoid.

### Wrong assumption to avoid

> “Every PR must run every check, otherwise green is fake.”

The correct question is whether the **required acceptance contract for that change class actually executed**.

### Before acting next time, check

```text
Is the change truly docs/governance only?
Did executable CI/product/test files change?
Did the required docs contract actually run, or did the entire workflow silently skip?
Does this change alter a release fact that requires fresh exact-head/provider evidence despite being Markdown?
```

### Defensive rule

**Use the narrowest proven acceptance path. Docs-only changes should not manufacture browser or Vercel runs, but a required docs gate must still genuinely execute and pass. A policy-designed skip is SKIPPED BY POLICY, not evidence that the skipped product gate passed.**

### Counterexample

A Markdown file that changes a scientific publication claim or a deployment contract may not be “cheap docs” semantically. File extension alone does not define the acceptance surface.

---

## 5. Durable lesson: performance optimization may change scheduling and selection, never correctness semantics

### What happened

The optimization introduced route-owned `focused` browser selection, Draft suppression, and sharding-friendly test granularity. Unknown/shared/global/CI-infrastructure changes remained `full` and fail-closed. The work did not change site copy, scientific results, research semantics, routes, or production behavior.

### Why this was the central scientific/engineering boundary

Faster CI is valuable only if the accepted evidence means the same thing. A planner that saves time by silently missing impacted routes is not an optimization; it is a weaker release contract.

### Before changing CI selection next time, check

```text
What exact acceptance semantics exist today?
Which changed surface owns which routes/specs?
What happens for unknown/shared/global ownership?
Does the classifier protect changes to itself, the workflow, runner image, Playwright config, and acceptance harness?
Does historical replay prove previously expensive bounded changes would be safely focused?
```

### Defensive rule

**Optimize only where impact is explicitly provable. Unknown ownership escalates to full. The planner/test harness/CI workflow must not use their own low-risk fast path without explicit self-protection.**

### Counterexample

“Most edits in this directory only affect one page, so classify the whole directory focused” looks reasonable but is unsafe when shared imports, global CSS, data ownership, or planner behavior crosses route boundaries.

---

## 6. Durable lesson: benchmark environment mismatch must not be repaired by weakening product assertions

### What happened

A first native-Ubuntu full-browser benchmark exposed a rendering-environment mismatch in the canonical figure gate. Re-running the unchanged figure/test in the repository's canonical Debian 12 + Playwright 1.62.1 runtime passed. The successful benchmark pinned that runtime; no geometry assertion was loosened.

### Wrong assumption to avoid

> “If a benchmark runner is faster but one visual gate fails, relax the gate so the benchmark can proceed.”

### Before changing a threshold next time, check

```text
Is the product actually different, or only the rendering/runtime environment?
Does the canonical repository runtime reproduce the failure?
Are browser/package versions identical?
Are fonts/system libraries/CPU architecture materially different?
Can the candidate executor reproduce the accepted runtime instead of redefining acceptance?
```

### Defensive rule

**Normalize the execution environment before changing quality thresholds. Benchmark a candidate runner against the same semantic gate and canonical runtime where possible.**

### Counterexample

A cloud runner that passes only after a geometry tolerance is widened is not equivalent compute; it has changed the acceptance contract.

---

## 7. Durable lesson: workers and shards solve different bottlenecks

### What happened

The long global-header route sweep was split into deterministic test cases before cloud sharding was benchmarked. The canonical Mac worker count remained 1 because a 2-worker Mac path had not been proven safe.

### Wrong assumption to avoid

> “More Playwright workers always means faster CI.”

A long indivisible test remains assigned to one worker, and extra workers on a CPU/RAM-constrained machine can increase contention.

### Defensive rule

**Make the test graph divisible first. Then benchmark independent shards/executors. Track wall-clock and total compute separately. Do not raise worker count on a personal/self-hosted runner without machine-specific evidence.**

### Counterexample

Running two workers on a four-core/low-memory personal runner can be slower or flakier even when two cloud shards on independent machines cut wall-clock sharply.

---

## 8. Durable lesson: temporary benchmark infrastructure has a deletion/absence acceptance criterion

### What happened

One-off hosted workflows were used only to measure focused/full browser execution. The execution checklist required them to be deleted afterward, and post-merge verification explicitly checked that final main contained only the canonical `self-hosted-ci.yml` workflow.

### Why this needs an explicit rule

Temporary benchmark YAML is executable infrastructure. Leaving it active can consume CI quota, create confusing status checks, trigger on future branches, or silently become an unsupported second CI path.

### Before closeout next time, check

```text
Which files/jobs/workflows were introduced only for measurement?
Are they absent from the candidate and final main?
Are there leftover branches or active provider projects that can still trigger them?
Is the successful historical run receipt preserved without preserving the executable trigger?
```

### Defensive rule

**A temporary benchmark is not cleaned up until the final accepted tree proves the executable benchmark workflow is absent. Preserve receipts, not active debt.**

### Counterexample

Closing a temporary PR while leaving its workflow merged on main is not cleanup; the trigger still exists.

---

## 9. Durable lesson: provider migration is downstream of workload optimization

### What happened

The measured bottleneck was the browser phase, not npm/build. The accepted optimization improved risk selection and test divisibility first. Provider migration remained explicitly out of scope.

### Repeated mistaken frame

This conversation series repeatedly drifted toward “which provider is faster/free?” even though earlier retrospectives had already established that provider brand is not the semantic owner of CI performance.

### Defensive rule

Use this order:

```text
measure real jobs by phase
-> repair false-positive full selection
-> make long tests divisible
-> benchmark equivalent semantics
-> only then compare executor/provider economics and limits
```

Do not migrate a 25-minute inefficient full gate unchanged just because another provider advertises free minutes.

---

## 10. Durable lesson: website CI must not consume scientific/GPU infrastructure merely because it is available

### What happened

The closeout instruction explicitly prohibited GPU/research servers, and the optimization work stayed inside repository/CI/provider surfaces.

### Why this is more than resource etiquette

Using a shared experiment server for ordinary website CI couples release throughput to scientific workloads, creates ownership/cleanup ambiguity, can disturb experiments, and tempts an Agent to cancel or deprioritize scientifically meaningful work for a web check.

### Defensive rule

**Ordinary Base Model CPU/browser CI stays off shared research/GPU servers unless there is an explicit architecture decision with scientific workload protection. Never cancel scientifically meaningful or release-critical checks merely to improve timing numbers.**

### Counterexample

An idle-looking GPU node is not “free CI compute.” Apparent idleness can coexist with reserved experiment ownership, model residency, future scheduled use, or a control-plane dependency.

---

## 11. Project-level Base Model lessons from this optimization

These are useful for Base Model but should not be mistaken for universal CI laws:

| Project-specific lesson | Current interpretation |
|---|---|
| Draft PR heavy validation | Draft iteration should consume zero heavyweight Mac browser-runner time; `ready_for_review` re-enters merge-ready acceptance. |
| Planner tiers | `fast / focused / full` are valid only because lower tiers have explicit impact rules; uncertainty fails closed upward. |
| Route-owned focused case | Bounded route owners may use changed-route browser smoke only when companion files are proven safe and the ownership union is explicit. |
| CI infra self-protection | Workflow/planner/test-selection/Playwright/runner changes force stronger coverage. |
| Canonical Mac workers | Keep one Playwright worker until a Mac-specific benchmark proves a higher count without correctness or stability loss. |
| Full-suite sharding | Split long tests first, then shard on independent executors; do not confuse shard speed with worker speed. |
| Temporary cloud benchmark | Hosted benchmark workflows are measurement tools, not production CI authority; delete them after receipts are captured. |
| Merge convention | Use the repository's normal squash merge and expected-head protection after exact-head acceptance. |
| Docs-only closeout | Let the docs classifier validate documentation-only closure without manufacturing Vercel/browser work. |
| Post-merge closure | A CI-architecture change is not COMPLETE until exact main is checked and any required automatic post-merge CI is classified/recorded. |

The completed execution receipt remains `docs/agents/current/basemodel-ci-optimization-execution-20260905.md`. Its dates, PRs, SHAs, and benchmarks describe this completed implementation, not a permanent claim that future CI timings or provider economics remain identical.

---

## 12. Repeated mistakes: what had happened before, why retrospectives were not enough, and how to avoid a third recurrence

### Repeated mistake A: provider names replaced semantic role names

This was already identified in the 2026-08-29 CI retrospective and again in the broader 2026-09-05 provider retrospective.

Why it repeated: historical files are not guaranteed startup context, while provider names are memorable shorthand. An Agent can remember “Cloudflare/Vercel/GitHub Actions” and forget whether it means scheduler, compute, deployment, or observation.

Current mitigation: the rule has already been promoted into startup-visible `/AGENTS.md`, the current website engineering standard, and the scenario router. This closeout does **not** create a third policy file for the same rule.

### Repeated mistake B: CI relevance and deployment relevance were conflated

The 2026-08-29 incident produced an empty-green test-only PR when a Vercel deploy classifier was reused as the CI classifier. The conceptual confusion surfaced again during provider optimization.

Why it repeated: the distinction lived first as an incident rather than an always-loaded invariant.

Current mitigation: executable classifiers are separate and current docs explicitly describe the distinction. Future Agents should inspect execution logs to prove a required gate ran rather than inferring from a green check badge.

### Repeated mistake C: “red CI” was treated as one failure class

Past work had already seen queueing, first-download slowness, detached preview servers, missing libraries, provider parser errors, cancellation, and flaky browser timing. The post-merge hydration race added another reminder.

Why it repeated: GitHub's red/yellow/green UI compresses many causes into one visual status.

Current mitigation: `project-agent-operating-principles.md`, `website-engineering-standard.md`, and `release-closeout-protocol.md` now require failure classification and exact-base differential where relevant. This file preserves the same-SHA hydration case as evidence, not as a new rule owner.

### Repeated mistake D: historical PASS was mentally attached to a PR instead of an exact tree

This has appeared across Base Model release work more than once.

Why it repeated: PR number and “Ready” are human-friendly identifiers; SHA/tree identity feels like bookkeeping until moving-main or squash changes the artifact.

Current mitigation: exact-head acceptance and expected-head merge locking are now in current release policy and root startup guidance. Closeout documents must retain exact receipts but may not convert them into timeless current-state claims.

### Repeated mistake E: zero-cash compute was treated as zero-cost compute

The Mac runner was once attractive because it avoided recurring runner bills. As the browser suite grew, 20–25 minute full jobs imposed workstation contention even without a provider invoice.

Why it repeated: cash cost was easy to see; control-surface contention, queueing, battery/thermal pressure, and human interruption cost were less visible.

Current mitigation: current policy now treats the Mac as a scarce operational control surface and requires workload measurement before expanding its use.

---

## 13. A / B / C information classification for future Agents

### A. Long-term stable rules

Keep these in current policy and long-term memory, not only in this history case:

- acceptance evidence belongs to an exact tree;
- expected-head merge locking is preferred when supported;
- retries are diagnostic and must not erase a first failure;
- classify red checks before changing code or thresholds;
- CI relevance, deploy relevance, CI compute, deployment, and post-deploy observation are separate responsibilities;
- performance must not redefine correctness;
- unknown/shared/global/CI-infrastructure impact fails closed to stronger coverage;
- docs-only work should not manufacture heavyweight browser/deployment work;
- temporary executable benchmark infrastructure must be absent from the final accepted tree;
- do not use shared scientific/GPU servers for ordinary website CI;
- a personal operational-control workstation has real contention cost even when its cash cost is zero.

These are already owned by root/current documents; future policy edits should modify those owners rather than copying this list into another current file.

### B. Project-level Base Model experience

Keep these with Base Model runbooks, tests, execution receipts, and historical cases:

- current `fast / focused / full` planner behavior;
- Draft heavy-job suppression and `ready_for_review` behavior;
- route-owner mapping and changed-route smoke semantics;
- current Mac runner envelope and worker setting until re-benchmarked;
- current Playwright/canonical runtime choices;
- current self-hosted required-check identity;
- the completed #433/#439 optimization implementation and benchmark receipts.

Project-level values that can change — timings, browser counts, runner resources, provider quotas, route map size — require fresh live/executable verification before reuse.

### C. Temporary state

Do **not** promote these into long-term memory or future “current” claims:

- PR #433 / #439 open/closed state;
- exact branch heads and merge SHAs;
- run `33924493381` current status;
- current queue depth or Mac process state;
- benchmark wall-clock numbers as if they were permanent SLAs;
- temporary benchmark branch/workflow identities;
- current provider quotas, prices, credits, or account limits.

They remain here only to preserve historical truth.

---

## 14. Zero-context checklist for the next Agent doing similar CI closeout

1. Read `/AGENTS.md`, `docs/agents/LATEST.md`, `docs/agents/README.md`, `project-agent-operating-principles.md`, `website-engineering-standard.md`, `scenario-trigger-registry.md`, and `release-closeout-protocol.md` before the first mutation.
2. Fetch live `main`, PR head, required checks, workflow/config, and relevant history; do not treat a chat summary as live state.
3. Decide whether the change is docs-only, CI-only, product/UI, research publication, or mixed by semantics, not extension.
4. For CI optimization, measure phase wall-clock and identify the dominant cost before changing provider or concurrency.
5. Preserve the existing acceptance contract; unknown/shared/global/CI-infrastructure changes fail closed.
6. If a browser check fails, classify product vs harness vs hydration vs environment vs queue/provider vs inherited base debt before editing anything.
7. If retrying, use the same exact SHA when diagnosing flakiness and preserve both the failed and successful receipts.
8. Never count a skipped conditional gate as PASS when the acceptance contract required it to execute.
9. Remove temporary benchmark workflows/branches/provider triggers and prove final-main absence before declaring cleanup complete.
10. Before merge, refresh head/base, verify exact-head required acceptance, resolve material overlap, and use expected-head protection.
11. After squash merge, verify the resulting main tree separately and run/inspect any post-merge acceptance required by the task.
12. Deposit only new reusable lessons: current owner for durable rules, history for incident receipts, and nowhere for reconstructible transient state.

---

## 15. Final deposition decision

No new root/current CI policy file is created by this closeout because doing so would duplicate rules that were already promoted into the correct owners after earlier incidents.

This historical file exists for three reasons only:

1. preserve the exact #433/#439 closeout causal chain without rewriting history;
2. record the same-SHA hydration failure/success pair and the docs-only closure as concrete evidence behind current rules;
3. make the repeated-mistake analysis explicit so future Agents understand why the current rules live high in the startup hierarchy rather than only in deep retrospectives.

The governing principle remains:

> **Make durable rules easy to trigger, keep historical facts historically labeled, and do not turn temporary status into authority.**
