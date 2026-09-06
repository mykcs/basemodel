# 2026-09-06 Browser test-list experiment: lessons for future Agents

Status: **historical engineering retrospective; not current CI authority**

This case records the BaseModel browser-CI experiment that followed the failed two-worker and four-small-executor proposals. It is written as a transfer document: current Agents must use the rules below, then re-read current CI files and live provider state. Current authority remains the executable repository, `docs/agents/current/deployment-policy.md`, `docs/agents/current/hosting-architecture.md`, and exact current PR/main checks.

## 1. Lineage and scope

The experiment asked whether the stable browser contract could remain two CircleCI `medium` executors, one Playwright worker per executor, Chromium, Playwright 1.62.1, retries=0, the same UI test set and Lab gate, while replacing raw-count sharding with individual test-case assignment by historical runtime.

Preceding evidence:

- PR #452: two Playwright workers per medium executor were unstable and did not improve the critical path.
- PR #453: four small executors were slower than the two-medium baseline.
- PR #455 was a valid historical attempt using a frozen 156-case receipt and 78+78 raw-count shards, but was later superseded and must not be revived as a competing scheduler.
- PR #454 used a newer 163-case receipt, merged as `6f081374ba1c43bec1ec38f9a2dd038c4892b265`, and is the accepted implementation lineage.
- PR #457 tested finer scheduling granularity against the later ~5m51s browser-tail baseline; it closed unmerged and is rejected historical evidence, not a successor authority.
- Historical PR numbers and timing receipts are evidence labels, not current authority; do not combine counts and timings from different receipts into one benchmark object.

The experiment changed scheduling only. It did not authorize changing assertions, routes, viewports, themes, geometry thresholds, hydration checks, Lab coverage, retries, Chromium selection, or the one-worker contract.

## 2. Browser acceptance is a hard boundary

For every scheduling experiment, write the contract before changing the scheduler. At this experiment's closeout, the accepted contract was:

- exactly two CircleCI `medium` browser executors for full coverage;
- exactly one Playwright worker per executor;
- Playwright 1.62.1 in the qualified Debian 12 / Node 24 runtime;
- Chromium project only;
- retries remain `0`;
- the existing planner still decides focused/full/Lab scope;
- the full canonical UI set is covered exactly once across shards;
- the 12-case Lab gate remains on its existing owning shard;
- deterministic acceptance, required check names, and fail-closed behavior remain intact.

A green check proves only that the candidate passed its acceptance gate. It does not prove that the scheduler was faster, that the right test set ran, or that the timing receipt is current. An early failure before browser execution is a harness/provider failure, not evidence that the scheduling idea is slow.

Defensive rule: before comparing performance, prove execution identity, test-set identity, worker/retry identity, and failure identity. Never trade acceptance semantics for a green or faster badge. Omitting Lab or reducing assertions to make a shard look faster measures a different workload and must be rejected.

## 3. Test-list identity: line numbers are not stable history

Playwright's native list format includes project, file, suite/title, and optional line/column. The line/column is useful for executing the current list, but it is not a durable timing identity: inserting or splitting tests changes line numbers without changing semantic identity.

Safe design:

1. enumerate the current canonical Chromium list with Playwright;
2. retain current native list lines for the actual `--test-list` file;
3. derive a stable lookup key from project + spec path + full test title;
4. reject duplicate stable keys;
5. use measured history for known keys;
6. include unknown/new/renamed tests with a conservative maximum weight;
7. assign by deterministic longest-duration-first greedy balancing;
8. fail closed if parsing, duplicate detection, coverage, or identity reconciliation is uncertain.

Do not key timing only by `file:line:column`; harmless edits then create false unknown-test churn. Do not drop tests whose timing is missing; conservative inclusion is safer than silently shrinking coverage.

## 4. Measurement protocol

Before the first provider-triggering push:

- pin exact base and candidate SHAs;
- record the receipt's source run, runtime image, Playwright version, worker count, retries, project, test count, Lab scope, and whether setup/build time is included;
- run local parser, assignment, and coverage tests;
- validate native Playwright 1.62.1 `--test-list` behavior with a tiny disposable list;
- validate the exact command shape; separate `--test-list` and path arguments are less ambiguous than hand-built shell strings;
- validate architecture contracts and `git diff --check`.

For each cloud run, capture exact candidate SHA, merge-base/current-main relation, provider job IDs, start/end and browser-stage wall-clock, canonical count, per-shard count, estimated and observed load, retries/failures/skips, Lab result, runtime/container/browser versions, and credits/minutes when cost matters.

Only compare like with like. GitHub Actions Ubuntu, CircleCI Debian, a branch head, and a merge-candidate synthetic commit are different evidence objects even if the tree looks similar. A status API can establish PASS/FAIL; it cannot substitute for provider log timestamps.

Decision rule: do not merge a speed experiment after one green run. Require the exact current head to pass deterministic and both browser gates, require a materially better critical path than the baseline, then repeat on a fresh exact head when the scheduler or timing receipt changes. If slower, unstable, incomplete, or unmeasurable, reject or hold; do not weaken the contract.

## 5. Engineering friction and causal fixes

### 5.1 Local scratch was not the repository

The available local directory contained a tiny Playwright harness but no `.git` checkout. Treating it as the BaseModel worktree would have hidden repository docs, branch state, and existing tests.

- Cause: execution environment and repository/provider environment were conflated.
- Preflight: run `pwd`, `git rev-parse --show-toplevel`, and `git status --short --branch` before claiming repository state.
- Rule: if the local checkout is absent, use the repository connector for reads/writes or obtain a real checkout; never infer that scratch artifacts represent the project.
- Counterexample: a local Playwright smoke pass validates Playwright syntax, not BaseModel architecture or CI acceptance.

### 5.2 Generated code can fail before its idea is tested

The first implementation passes were damaged by literal newline escaping and over-escaped regular expressions. A later tree reconstruction also risked reverting already-fixed parser behavior.

- Cause: nested shell/tool quoting without inspecting exact bytes.
- Preflight: syntax-check, inspect representative lines, run smallest parser tests, and compare the final tree after reconstruction.
- Rule: verify bytes and behavior before broader CI; prefer one atomic tree update over layered reconstruction.
- Counterexample: patch text looking correct in a tool call is not evidence that the committed file contains real newlines or the intended regex.

### 5.3 Architecture tests can assert the wrong ownership boundary

An early deterministic failure expected an implementation script name inside CircleCI config even though the script was invoked indirectly through the UI gate.

- Cause: coupling an architecture test to incidental text rather than execution behavior.
- Preflight: trace CircleCI config -> UI gate -> scheduler and assert the stable boundary.
- Rule: architecture tests protect behavior and ownership contracts, not incidental strings at the wrong layer.
- Counterexample: adding a fake config reference only to satisfy the test makes the architecture less clear.

### 5.4 Native tool behavior must be proved independently

The exact Playwright 1.62.1 list format was initially uncertain. A tiny disposable harness proved that native `--test-list` accepts the intended lines and runs one worker.

- Cause: relying on memory or a newer example instead of the pinned version.
- Preflight: check the pinned package and run the smallest native command against a disposable list.
- Rule: distinguish “our parser wrote a file” from “the pinned provider tool consumes it correctly.”
- Counterexample: a newer locally installed Playwright may accept syntax that 1.62.1 rejects.

### 5.5 Provider status is not provider timing evidence

The GitHub connector exposed CircleCI status states and target URLs but not CircleCI job logs. Browser navigation reached an unauthenticated CircleCI page. This created pressure to ask the owner to relay logs, and GitHub Actions log capabilities were considered even though the jobs were CircleCI.

- Cause: confusing source-control check APIs with the external CI provider's execution/log API.
- Preflight: identify the actual provider, its authenticated log endpoint, and the evidence fields needed before benchmarking.
- Rule: try provider connector, repository checks, browser/session path, and downloadable artifact path; if none exposes logs, state “timing measurement blocked” rather than inventing a result or making the owner shuttle routine status.
- Counterexample: green CircleCI badges establish acceptance, not that the candidate beat 5m51s.

### 5.6 Moving main and superseded PRs invalidate remembered state

During the conversation, #455 became obsolete, #454 merged, and #457 became a follow-up experiment that was later rejected and closed unmerged.

- Cause: treating a PR number, branch name, or earlier summary as stable authority.
- Preflight: re-read main, PR state, head SHA, required checks, and overlapping PRs immediately before every write or merge decision.
- Rule: classify branches as current, stacked, incorporated, superseded, deferred, or rejected; never revive an older scheduler because its code is familiar.
- Counterexample: a green check on an old SHA is not evidence for the current head.

## 6. Repeated corrections: highest-priority transfer rules

1. Do not ask the owner to manually relay information when the Agent can continue. Exhaust repository/provider reads and alternate tools first; human help is for real auth/2FA/CAPTCHA or unavailable credentials.
2. Do not claim the experiment is measured from green checks alone. Acceptance and performance are separate evidence types.
3. Do not treat PR #455 or #457 as current. #455 is superseded, #457 is rejected and unmerged, and merged #454 is the accepted implementation lineage.
4. Do not merge a scheduling optimization merely because it passes. The question is wall-clock improvement under the unchanged browser contract.
5. Do not confuse shards with workers. Shards add independent executors; workers add concurrency inside one executor and can create contention/instability.
6. Do not weaken the browser contract to make the experiment look favorable. Preserve Lab, assertions, retries=0, exact test union, and runtime identity.

## 7. Information classification

### Long-lived rules

- Provider status and performance timing are different evidence.
- Exact-head identity must bind every acceptance and benchmark claim.
- Current native test-list lines and stable timing identities serve different purposes.
- Unknown identities stay included with conservative weight; parsing/coverage uncertainty fails closed.
- Browser scheduling experiments preserve the acceptance contract and compare like-for-like workloads.
- Use the narrowest authorized execution surface; never expose credentials or infer provider access from a status badge.

### Project-specific knowledge

- BaseModel's qualified full-browser contract is two CircleCI medium executors, one worker each, Chromium, Playwright 1.62.1, retries=0, existing planner, and Lab gate.
- The 156-case receipt belongs to superseded #455; the later ~5m51s baseline belongs to #457's comparison against post-#454 main. They are dated, distinct evidence objects, not a combined or timeless performance guarantee.
- #452 and #453 are rejected experiments; #455 is superseded; #454 merged as the accepted implementation; #457 is a rejected, unmerged follow-up. Live main and current deployment policy win.
- Timing receipts, script names, shard/job IDs, and provider URLs must be refreshed from live state.

### Deliberately not retained as durable state

Do not promote temporary PIDs, GPU occupancy, local scratch paths, current PR head/status, current CircleCI job URLs, transient provider latency, or an in-progress branch/worktree into policy or long-term memory.

## 8. Third-time prevention checklist

The repository already had strong rules about exact heads, fail-closed UI coverage, one-worker safety, provider boundaries, and not making the owner relay logs. Repetition happened because those rules were distributed across deep history/current docs while the active conversation used a stale/superseded branch and treated a status badge as if it were a timing receipt.

Before the next CI experiment, the Agent must answer:

1. What exact provider ran the job, and can I read its logs?
2. What exact SHA and merge-base does the evidence cover?
3. What is the unchanged acceptance contract?
4. What is the measured workload union and which timing fields are comparable?
5. What would make this experiment a rejection rather than a pass?

If any answer is unknown, label the work blocked or exploratory; do not report a definitive speed result.

## 9. Historical truth boundary

This document records the failed/obsolete path honestly. It does not say that #455 is current, that CircleCI logs were retrieved, or that green status proved speed. The accepted #454 implementation and current main may contain the same design with different file names, receipts, and exact SHAs. Re-run live checks before using any dated fact.
