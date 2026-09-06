# CircleCI benchmark causality and multi-Agent closeout retrospective — 2026-09-06

Status: **historical engineering case evidence, not current CI authority**.

This case records the Base Model browser-CI optimization conversation that followed the earlier #433/#454 work. It preserves the failed and successful experiments, the measurement corrections, the multi-Agent integration incident, and the final narrow revert. Current authority remains `/AGENTS.md`, `docs/agents/current/website-engineering-standard.md`, `deployment-policy.md`, `release-closeout-protocol.md`, executable CI/test files, and live GitHub/CircleCI state.

All PR numbers, SHAs, timestamps, timings, and provider observations below are historical receipts. Future Agents must not promote them to current state without a fresh read.

---

## 1. Outcome

The conversation began with a seemingly simple question: after #459 replaced roughly 600 fixed 40 ms browser sleeps with bounded readiness, was the change materially faster than the recorded ~5m01s full-browser critical-path baseline?

That question expanded into a sequence of controlled CI experiments. Several plausible micro-optimizations were rejected because they either made the hosted critical path worse or produced gains too small relative to hosted-runner variance. The final experiment explored CircleCI historical test timing as an adaptive replacement for the retained static exact-test timing receipt. Its correctness design was made fail-safe and qualified successfully, but its steady-state wall-clock advantage was not clear, meaningful, or repeatable.

A concurrent Agent merged the adaptive candidate before its own PR acceptance rule was complete. Post-merge validation preserved that historical fact, completed the missing controls, and then reverted only the six adaptive-CI paths while preserving later independent research/publication commits. PR #481 restored the proven static scheduler and merged as historical main commit `a0d718346e37a0e05d78d58981e94c039d95ad3f`.

The durable conclusion is not “adaptive timing is always bad.” It is:

> **A CI performance change earns authority only when the exact end-to-end metric it claims to improve beats a frozen comparable control by more than the observed execution noise, under unchanged acceptance semantics. Correct implementation and green qualification are necessary but not sufficient.**

---

## 2. Historical experiment chain

### 2.1 #459 — bounded readiness replaced fixed sleeps, but added duplicate audits

The original browser loops contained about 600 fixed `waitForTimeout(40)` calls, creating a rough upper bound of ~24 seconds of unconditional sleep across the whole matrix. PR #459 kept the same 40 ms ceiling and the same geometry/stepper assertions, but replaced each sleep with an eager readiness audit followed by bounded polling.

Exact comparison at the time:

- main browser critical path: **301 s / 5m01s**;
- #459 browser critical path: **353 s / 5m53s**;
- regression: **+52 s / +17.3%**.

The likely structural cost was that the post-click readiness helper performed an audit and then the next loop iteration performed the same class of audit again. The candidate remained semantically strict, but it failed its own performance purpose and was closed unmerged.

Lesson: replacing waiting with work is not automatically faster. Count the new work added at each transition.

### 2.2 #464 — carry readiness fixed the duplicate audit; local hotspot won, hosted critical path lost

A second implementation changed loop ownership: initial state was checked once; each click then waited within the same 40 ms ceiling and produced the next state's accepted audit result; the next iteration reused that result rather than auditing twice.

Focused local A/B over the 25 affected Chromium tests, one worker and retries=0:

- exact main: **203.68 s**;
- candidate: **182.44 s**;
- local improvement: **21.24 s / 10.4%**.

That almost matched the theoretical ~24-second unconditional-sleep pool, so the mechanism-level hypothesis looked correct.

Hosted result told a different story:

- shard 1: **281 s / 4m41s**;
- shard 2: **363 s / 6m03s**;
- critical path: **363 s**;
- versus 301 s baseline: **+62 s / +20.6% slower**.

#464 was closed unmerged.

Lesson: a local hotspot benchmark can validate a mechanism, but the hosted CI decision belongs to the hosted critical path. Never let a proxy metric overrule the target metric.

### 2.3 #463 — deferred success-path video exposed qualification-vs-steady-state confounding

A separate candidate disabled success-path video recording and kept failure diagnostics through a rerun path. Early raw PR timings looked poor. The initial interpretation compared the CI-infrastructure PR's whole browser job directly to an ordinary main baseline.

That comparison was later corrected. Because #463 changed CI/browser infrastructure, the planner deliberately made it `labRelevant`, which changed the primary-shard reserve and added a 12-case Lab tail. Its own qualification split therefore was not the same workload as an ordinary post-merge full-browser PR.

The corrected measurement used benchmark-only stacked PR #466 on top of the candidate. The stacked diff was an ordinary E2E no-op marker, so it exercised the candidate in the steady-state shape ordinary full-browser work would see:

- shard 1: **299 s / 4m59s**;
- shard 2: **322 s / 5m22s**;
- critical path: **322 s**;
- versus the historical 301 s reference: **+21 s / +7.0%**.

The video experiment was closed unmerged.

Historical truth requirement: the earlier “qualification total proves it is slower” interpretation was wrong. The final conclusion remained negative, but for the correct reason: the clean steady-state measurement still did not demonstrate improvement.

### 2.4 CircleCI job inspection — queue was not the universal explanation

Because shard durations varied strongly, one hypothesis was that GitHub `pending -> success` was mostly queue/provisioning noise. A currently authenticated CircleCI browser session was used read-only, without exporting cookies or credentials, to inspect several job pages.

For the sampled jobs, queue time was shown as 0 seconds and bootstrap/setup was much smaller than the browser acceptance step. This ruled out a blanket “all variance is queue” explanation for those samples. Later the browser session expired; no new login or cookie extraction was forced merely to obtain more telemetry.

Lesson: separate queue, spin-up, setup, and test execution when evidence exists. Do not invent a provider-layer explanation from a duration pattern alone.

### 2.5 Header viewport-resize micro-optimization — reasonable idea, negligible effect

The heavy `global-header-visibility` tests repeatedly set the same viewport across light/dark states. A local two-run baseline was stable around **80.70 s mean** for the four heavy cases. A candidate that skipped redundant same-size resizes averaged about **79.65 s**, roughly **1.3%** better.

That delta was treated as local noise. No PR and no hosted CI spend were created for it.

Lesson: reject weak ideas cheaply before spending provider budget.

### 2.6 npm download cache — warm cache lost to contemporaneous control

Official guidance supported caching npm's download cache rather than `node_modules`, while Playwright's own browser-binary caching guidance did not justify a broad browser cache. The experiment therefore stayed narrow: restore `~/.npm` in all jobs, save only from deterministic, and keep `npm ci` authoritative.

The seed run was explicitly treated as cold-cache population, not performance evidence.

A concurrency mistake then surfaced: another Agent had already created the warm-cache benchmark/control pair. A duplicate benchmark PR created in this conversation was closed immediately rather than allowed to contaminate shared runner measurements.

Useful comparison from the existing pair:

- warm-cache critical path: **362 s**;
- contemporaneous current-main control: **315 s**;
- candidate regression: **+47 s / +14.9%**.

The cache candidate was closed unmerged.

Lesson: search live benchmark work before creating another “same” experiment. Duplicate measurement can change the environment being measured.

### 2.7 #454 static exact-test timing was already a successful project-level optimization

The retained scheduler came from PR #454. It used a single historical exact-test timing receipt to build two Playwright `--test-list` shards. At qualification time it improved a prior ~352-second critical path to roughly **304/306 s**, with the same canonical browser suite and one worker per medium executor.

This mattered because the next question was not “can timing-aware sharding work?” It already had. The new question was narrower: can CircleCI's continuously learned historical timing improve on the static receipt enough to justify extra complexity?

### 2.8 #473 — shadow timing qualification before authority

Playwright 1.62.1 JUnit output exposed test title, classname, and duration. Rather than immediately replacing the static scheduler, the experiment first added JUnit telemetry while leaving #454 fully authoritative.

Then a shadow probe asked CircleCI for both timing buckets after the real browser run and checked that the provider output represented the complete canonical population: non-empty buckets, no duplicate titles, no unknown titles, no gaps, and exact union coverage.

Both independent browser jobs passed the shadow compatibility phase. This established that the two separate required jobs could each access usable historical timing without rewriting required-check identities into one `parallelism:2` job.

Lesson: when provider metadata compatibility is uncertain, run it in shadow first. The old authority should remain the correctness path until the learned/adaptive input proves complete.

### 2.9 Adaptive cold-start deadlock discovered before final authority

A concurrent in-flight implementation initially made native historical timing mandatory. That design contained a bootstrap deadlock:

```text
new or renamed test
-> no historical timing
-> scheduler fails before running tests
-> test never executes
-> historical timing can never be created
```

The root fix made native timing an optimization rather than a correctness dependency:

```text
complete warning-free native timing -> native split
missing/new timing or provider degradation -> whole-run static fallback
provider splitter failure -> static fallback
identity/union corruption -> fail closed
```

Thus a new test would execute under the proven conservative scheduler, upload timing, and become eligible for native timing later.

The adaptive implementation itself was scientifically/engineering correct after this fix. The later rejection was about unproven performance value, not a correctness defect.

### 2.10 Formatter churn was removed before causal measurement

Running the repository formatter on legacy `.mjs`/config files produced large quote/style rewrites unrelated to the adaptive logic. Those changes would have enlarged review surface and made performance attribution less clean.

The files were restored to their existing style and only the semantic changes were retained.

Lesson: formatting is part of the experimental treatment if it changes the diff. Remove unrelated formatter churn before benchmarking.

### 2.11 #474 — first ordinary-full adaptive steady-state benchmark

#473's own CI was CI-infrastructure qualification and intentionally used the stronger Lab-aware/static path. Therefore it could not answer the post-merge steady-state performance question.

Benchmark-only stacked PR #474 used the candidate as its base and added only an E2E EOF marker after existing test definitions. The candidate and benchmark enumerated the same **163 Chromium test identities / 24 files** byte-for-byte.

First adaptive steady-state result:

- shard 1: **278 s**;
- shard 2: **326 s**;
- critical path: **326 s**.

A later identical/repeat candidate run created by another Agent produced:

- shard 1: **323 s**;
- shard 2: **324 s**;
- critical path: **324 s**.

Adaptive mean critical path was therefore roughly **325 s** across those two historical samples.

### 2.12 Control attempt #477 — moving `main` silently changed the treatment

A current-main control branch had been prepared locally from pre-adaptive main. Before the PR was opened, #473 itself had already been merged by another Agent. Because the PR targeted the branch name `main`, GitHub resolved the PR base to the newer adaptive main.

The supposed static control therefore no longer compared static versus adaptive. It compared against adaptive itself and was invalidated/closed without using its timing.

Lesson: a locally prepared branch parent does not freeze a PR's target branch. Read the resolved `base_sha` after PR creation. If historical behavior is the control, use a dedicated frozen base ref.

### 2.13 Control attempt #478 — reusing a head SHA contaminated legacy statuses

The next control correctly targeted a frozen pre-adaptive base but reused the same head commit SHA from the invalidated control. CircleCI wrote legacy GitHub status contexts keyed by commit SHA. Old workflow status and new workflow status appeared together on the same commit, including an old browser error beside new pending work.

The run was invalidated without interpretation.

Lesson: one workflow measurement needs one fresh commit SHA. If the source tree must remain identical, create a new commit pointing to the same tree; do not modify source just to retrigger CI.

### 2.14 #479 — clean frozen static control plus identical-tree repeat quantified noise

A fresh head SHA and a dedicated base frozen at pre-adaptive main finally produced a clean static control.

Static run 1:

- shard 1: **281 s**;
- shard 2: **330 s**;
- critical path: **330 s**.

An identical-tree repeat used a new commit with the exact same tree:

- shard 1: **389 s**;
- shard 2: **385 s**;
- critical path: **389 s**.

The exact static tree therefore varied by **59 seconds** between two hosted runs.

Adaptive's 324–326 second critical paths were only 4–6 seconds faster than the nearest clean static run, a difference far smaller than the directly observed same-tree hosted variance. Historical static samples also included substantially faster critical paths around 301, 306, and 315 seconds.

That evidence failed the pre-registered “clear, meaningful, repeatable” improvement criterion.

### 2.15 Multi-Agent incident — #473 merged before its own acceptance rule completed

The #473 PR body explicitly said not to merge from its qualification timing. It required an ordinary-full candidate benchmark and a contemporaneous control first.

Nevertheless, another concurrent Agent merged #473 after its correctness checks went green and before the control protocol completed. This did not make the pending acceptance criterion retroactively true.

The correct response was not to rewrite history or pretend the merge authorized the science/engineering claim. Post-merge validation continued, showed the performance claim was not established, and moved to a surgical revert.

Lesson: **mergeable + required checks green != merge authority when the task/PR has an additional explicit acceptance boundary.**

### 2.16 #481 — precise revert on latest main preserved later research work

After #473 merged, later independent research/publication PRs also landed on `main`. Reverting by resetting main to the pre-adaptive commit would have destroyed legitimate later work.

The revert therefore started from the latest current main tree and reversed only the six #473-owned CI paths: four restored to their pre-adaptive blobs and two adaptive-only files removed. Each time main moved during closeout, the overlap was rechecked. Later research paths had zero overlap and were preserved.

The final revert exact head passed deterministic + both browser required contexts. PR #481 merged, restoring the proven static exact-test scheduler while preserving the later research updates.

Lesson: a revert is a semantic inverse of the offending contribution on the latest intended tree, not “go back to an old commit.”

---

## 3. Durable friction patterns and defensive rules

### 3.1 Optimize the claimed outcome, not the easiest local proxy

**What happened:** #464 saved ~21 seconds in its focused local hotspot yet made the hosted critical path worse in its first full run.

**Why:** local execution measured only the changed loop; hosted CI includes the whole shard workload plus runner variability.

**Wrong assumption:** “the code path is 10% faster locally, therefore CI is 10% faster.”

**Before acting:** name the actual target metric, its aggregation rule, the runner/config, and every major layer included in it.

**Defensive rule:** mechanism benchmarks diagnose causality; the deployment/CI decision uses the end-to-end metric the optimization claims to improve.

**Counterexample:** do not merge a hosted-CI optimization because 25 focused tests are faster when the slower hosted shard is unchanged or slower.

### 3.2 Qualification workload and steady-state workload are different experimental treatments

**What happened:** #463 and #473 changed CI infrastructure, which intentionally triggered stronger Lab/reserve/self-protection behavior.

**Why:** the repository correctly fails closed when the acceptance machinery itself changes.

**Wrong assumption:** “the PR's own full CI time is the time ordinary PRs will pay after merge.”

**Before acting:** inspect planner mode, Lab relevance, reserve, diagnostics, test list, and any self-protection path for candidate and control.

**Defensive rule:** if qualification and steady-state shapes differ, use a benchmark-only stacked ordinary-full PR on the candidate to measure steady state.

**Counterexample:** do not compare a CI-infra PR with 12 extra Lab cases and a different reserve directly to an ordinary content/UI PR and call the delta performance.

### 3.3 `main` is a moving ref, not a frozen control

**What happened:** #477's intended pre-adaptive control resolved to a newer adaptive main by the time the PR opened.

**Why:** branch names resolve at provider decision time; local ancestry did not freeze the PR base.

**Wrong assumption:** “I created this branch from old main, so a PR to `main` still compares against old main.”

**Before acting:** read the PR's actual `base_sha` after creation and again at the decision boundary.

**Defensive rule:** use an immutable commit or dedicated frozen base branch for historical controls. Treat moving main as a separate current-state comparison.

### 3.4 Commit SHA is part of provider measurement identity

**What happened:** #478 reused the same head SHA in another PR/base context and inherited legacy CircleCI status records from the earlier workflow.

**Why:** GitHub legacy status contexts are attached to commit SHA, not to the analyst's conceptual experiment.

**Wrong assumption:** “same tree means I should reuse the same commit for a clean repeat.”

**Before acting:** identify how the provider/GitHub records status: workflow, check-run, commit status, job, or PR.

**Defensive rule:** one workflow measurement gets one fresh commit SHA. For an identical-tree repeat, create a new commit pointing to the exact same tree.

### 3.5 Multi-Agent branches and PRs are shared mutable state

**What happened:** duplicate benchmark PRs appeared; #473's branch advanced while another Agent was editing it; #474 gained another repeat head; #473 was eventually merged by another Agent before the acceptance boundary completed.

**Why:** social ownership of a conversation does not lock a Git ref or PR.

**Wrong assumption:** “I am working on this PR, therefore its head/body/draft/merge state will stay mine.”

**Before acting:** refresh remote head, PR state/body/base, overlapping PRs, and local worktree status immediately before each write and merge.

**Defensive rule:** unexpected shared-state movement is a stop-and-read event. Never reset/overwrite unknown concurrent edits. Use isolated worktrees and expected-head locking, and keep performance candidates Draft/non-authoritative while measurement is incomplete when workflow policy permits.

### 3.6 A green qualification is not merge authorization

**What happened:** #473's deterministic and two browser checks were green, but its own PR body still required steady-state benchmark + control. It was merged anyway.

**Why:** required CI checks encoded correctness qualification, not the full task-specific acceptance rule.

**Wrong assumption:** “all required checks green + mergeable means the task is accepted.”

**Before acting:** read the current task/PR acceptance rule, not only branch protection.

**Defensive rule:** explicit acceptance criteria are part of merge authority. A performance PR with unfinished benchmark/control evidence remains non-authoritative even when branch protection is green.

### 3.7 Adaptive optimization must not become a correctness dependency

**What happened:** a mandatory native-timing design would have blocked any test that lacked timing before that test could run and seed history.

**Why:** the learned/adaptive input had a cold-start state that the scheduler treated as fatal.

**Wrong assumption:** “missing optimization metadata is a correctness error.”

**Before acting:** model new-test/renamed-test/provider-degraded/provider-unavailable states before making an adaptive service authoritative.

**Defensive rule:** missing optimization metadata falls back to the proven conservative correctness scheduler for that run. Identity corruption/gaps still fail closed.

### 3.8 Shadow qualification belongs before authority migration

**What happened:** Playwright JUnit field compatibility with CircleCI timing was initially uncertain.

**Why:** provider documentation and actual reporter shape did not make the full mapping obvious.

**Wrong assumption:** “the provider says it supports timing, so use it to select required tests immediately.”

**Before acting:** shadow-compute the full split after the existing authoritative run and validate exact population/union/duplicates/unknowns and provider fallback warnings.

**Defensive rule:** learned/provider scheduling signals prove completeness in shadow before they can own test execution.

### 3.9 Disposable worktrees need environment normalization before source diagnosis

**What happened:** a fresh worktree lacked `node_modules`; a bare Playwright `--list` also followed a configuration path that expected a visual-baseline artifact not present in that invocation.

**Why:** worktree cleanliness was mistaken for environment completeness, and an ad-hoc command was mistaken for the canonical repository test-discovery path.

**Wrong assumption:** “a command failed in the new worktree, therefore the candidate source is broken.”

**Before acting:** identify the canonical package command/config and confirm dependencies/fixtures are present or deliberately reused from a lockfile-compatible environment.

**Defensive rule:** environment/bootstrap gaps are not candidate regressions. Use the repository's canonical command for identity/contract checks.

### 3.10 Formatter output can contaminate a causal diff

**What happened:** Prettier rewrote large legacy `.mjs` sections for a tiny scheduler edit.

**Why:** current formatter style differed from historical file style.

**Wrong assumption:** “formatter output is semantically irrelevant, so it is free to include in an experiment.”

**Before acting:** inspect `git diff --stat` and semantic diff after formatters.

**Defensive rule:** restore unrelated format churn before benchmark/review; causal experiments should change the smallest semantic owner.

### 3.11 Transport failure is not authorization failure

**What happened:** a local `git push` failed because HTTPS could not connect to GitHub port 443. There was no authentication rejection.

**Why:** network transport and repository authorization are separate layers.

**Wrong assumption:** “push failed, so repair credentials/remotes/tokens.”

**Before acting:** classify DNS/connectivity/TLS/HTTP/auth separately; retry a read-only path if useful.

**Defensive rule:** when a connected GitHub write interface is already authorized, preserve the intended tree through it rather than mutating credentials to work around a transport outage.

### 3.12 Estimate theoretical upside before consuming full CI

**What happened:** the fixed-sleep pool was only about 24 seconds across the whole matrix; parallel shards meant the critical-path ceiling was even smaller. Several full runs were therefore chasing a benefit comparable to hosted noise.

**Why:** optimization effort started from an obvious local inefficiency rather than an end-to-end attainable-gain calculation.

**Wrong assumption:** “600 sleeps sounds large, so it must materially control a five-minute critical path.”

**Before acting:** compute a rough upper bound on seconds the candidate can possibly remove from the critical path.

**Defensive rule:** if the theoretical ceiling cannot beat the meaningful-improvement threshold or observed variance, stop or use a cheaper diagnostic benchmark.

### 3.13 Identical-tree repeats measure environment variance without changing treatment

**What happened:** the static control tree produced 330 s and 389 s critical paths on two runs.

**Why:** hosted execution itself had large variance.

**Wrong assumption:** “one clean candidate and one clean control are enough whenever their numbers differ.”

**Before acting:** compare the candidate-control delta with same-tree repeat variance and known historical spread.

**Defensive rule:** use an identical-tree fresh-commit repeat only when it resolves a borderline decision. Do not keep rerunning until one sample supports the desired conclusion.

### 3.14 Surgical revert preserves independent newer authority

**What happened:** #476/#480 research work landed after the premature #473 merge.

**Why:** shared main continued moving while the CI experiment was being validated.

**Wrong assumption:** “revert means reset to the commit before the bad merge.”

**Before acting:** compare later commits for overlap with the candidate-owned files and semantic contracts.

**Defensive rule:** construct the inverse contribution on the latest intended main. Preserve newer independent research/product changes and revalidate the resulting exact head.

### 3.15 Scope process inspection; command lines are not harmless telemetry

**What happened:** a broad whole-machine process listing was used while checking whether a Git/network operation remained active. It returned large amounts of unrelated process command-line state.

**Why:** “list processes” was treated as a cheap generic liveness query rather than an information-disclosure surface.

**Wrong assumption:** “process inspection is read-only, therefore broad output is harmless.”

**Before acting:** identify the exact PID/process family or use the session/process handle already returned by the tool.

**Defensive rule:** query only task-owned processes and the minimum fields needed. Command arguments can contain credentials, tokens, private paths, or other users' state. If broad output is accidentally exposed, do not repeat or persist it.

### 3.16 Shell selection must be made at the actual parser boundary

**What happened:** even during this retrospective, a complex write command wrapped an inner `bash -lc`, but the execution tool still launched through Fish and malformed nested quoting was parsed before Bash started. No repository mutation occurred.

**Why:** the rule “use Bash for Bash syntax” was remembered conceptually but applied one layer too late.

**Wrong assumption:** “if the string contains `bash -lc`, the outer shell cannot matter.”

**Before acting:** inspect the execution tool's actual shell parameter/default and minimize nested quoting.

**Defensive rule:** set the tool shell/interpreter explicitly when supported, or run a standalone Bash/Python script. A parser failure before the intended interpreter starts is an execution-surface error, not repository failure.

---

## 4. Scientific and semantic boundary

This was engineering optimization work, but it still had a scientific-style causal contract.

The invariant was not “make CI green faster at any cost.” The treatment had to preserve:

- the canonical Chromium population and test identity;
- the same routes, themes, viewports, assertions, geometry/stepper thresholds, Lab checks, and overflow checks;
- two medium executors and one Playwright worker each for the compared full path;
- retries=0;
- the same 40 ms readiness ceiling where that experiment was under test;
- fail-closed handling for unknown/shared/CI-infrastructure impact.

Engineering convenience that changes those variables changes the experiment. Examples of invalid “optimizations” would have been deleting slow assertions, widening geometry thresholds, hiding a failing viewport, increasing retries, comparing qualification-only Lab work to an ordinary baseline without labeling the treatment difference, or changing worker/executor shape while claiming the scheduler alone caused the result.

The precise #481 revert also protected scientific/publication semantics: later Mechanism-1.0 research updates were preserved while only the CI contribution was reversed. Infrastructure cleanup is not permission to restore an older scientific website tree.

No GPU experiment was started/stopped, no scientific protocol/seed/prompt/model budget was changed, no server artifact was deleted, and no shared research/GPU server was used as website CI compute in this conversation. Those live states are outside this case and must not be inferred from it.

---

## 5. A / B / C knowledge classification

### A. Long-term stable rules

These deserve startup/current-policy visibility because forgetting them repeatedly causes expensive errors:

- acceptance and performance evidence belong to an exact candidate/control identity;
- explicit task/PR acceptance criteria are merge-authorization boundaries, not optional prose;
- `main` and shared PR branches are moving refs; refresh before writes and merge;
- concurrent Agent state is not socially locked; unexpected drift is a stop-and-read event;
- performance experiments pre-register metric, control, environment, acceptance rule, and theoretical upside;
- qualification and steady-state workload must be separated when self-protection changes the workload;
- one provider workflow measurement uses a fresh commit identity when statuses are SHA-scoped;
- preserve exact test identity and acceptance semantics across candidate/control;
- local hotspot speedups are diagnostic; end-to-end hosted critical path decides hosted-CI value;
- compare small deltas against same-tree/environment variance before claiming causality;
- adaptive optimization metadata must have a conservative correctness fallback and shadow qualification;
- performance never buys weaker correctness thresholds, retries, routes, or scientific semantics;
- broad process command-line inspection can expose unrelated sensitive state; inspect narrowly;
- select the actual shell/interpreter at the tool parser boundary;
- transport, authentication, provider, harness, environment, and product failures are different layers;
- a revert should invert the offending contribution on latest intended authority, not erase independent later work;
- a negative optimization experiment is useful when it prevents permanent complexity.

### B. Base Model project-level experience

These belong in current Base Model CI policy and executable truth, not global memory as timeless facts:

- the current full browser contract at this historical closeout was 163 Chromium tests / 24 files, two CircleCI medium shards, one Playwright worker each, retries=0;
- CI-infrastructure changes deliberately receive stronger qualification/self-protection;
- the retained exact-test static timing receipt/scheduler remained the accepted authority after #481;
- CircleCI's historical timing experiment proved technically possible in shadow but did not prove enough steady-state value to replace the static scheduler;
- CircleCI legacy commit-status behavior made commit SHA part of measurement identity in this provider configuration;
- benchmark-only stacked ordinary-full PRs are the project mechanism for measuring a CI-infra candidate's post-merge steady-state shape when qualification differs.

Every item above must be rechecked against current code/provider state before reuse. The dated numbers are not SLAs.

### C. Temporary state deliberately not promoted

Do not put these into long-term memory or current policy as ongoing facts:

- whether #459/#463/#464/#468/#473/#474/#479/#481 are currently open/closed/mergeable;
- their branch names, exact heads, merge SHAs, workflow/job IDs, or historical timestamps;
- current `main` after future commits;
- any current CircleCI queue depth, browser session, process PID, local worktree path, or Git network condition;
- 301/315/324/326/330/389-second historical samples as future expected wall-clock;
- any temporary Chrome authentication/session state;
- any unrelated process command arguments seen during diagnostics.

Those facts remain here only as bounded historical evidence where useful.

---

## 6. Repeat-offense audit: why earlier retrospectives did not fully prevent recurrence

### 6.1 Exact-tree / moving-main mistakes had already been documented

The 2026-08-31 CI/PR stability retrospective and the 2026-09-05 CI closeout already said that checks belong to exact SHAs, PRs move, and expected-head protection matters.

Why it still repeated here: those rules protected release closeout but did not define a **performance experiment identity**. The control was still casually described as “current main,” which allowed the experimental treatment to move underneath it.

Change now: the frozen-control/fresh-SHA/steady-state protocol lives in the current website engineering standard and has its own scenario trigger.

### 6.2 Concurrent-Agent PR drift had already happened before

The August retrospective already recorded a closed PR being reopened and changed by another Agent.

Why it repeated: “re-read before merge” was present, but there was no explicit rule to re-read **before every shared branch write/benchmark mutation**, and no merge-authority distinction between qualification green and task acceptance.

Change now: operating principles and root guards treat unexpected branch/worktree/PR movement as a stop-and-read event; release closeout now treats pre-registered acceptance as merge authority.

### 6.3 Disposable-worktree dependency failure had already been documented

The August retrospective already recorded clean worktrees missing `node_modules`.

Why it repeated: the lesson was in history and general environment guidance, but benchmark preparation used an ad-hoc discovery command before verifying the canonical test entrypoint.

Change now: the current benchmark protocol explicitly requires canonical runner/config identity discovery and environment normalization.

### 6.4 Fish/Bash had already been promoted to root policy — and still recurred during this retrospective

The root rule already said to invoke Bash for Bash semantics.

Why it repeated: the instruction named the desired inner interpreter but did not state that an execution tool's **outer parser** may still be Fish. Nested quoting therefore failed before inner Bash started.

Change now: root/current policy says to set the execution tool's shell/interpreter directly or run a standalone script, and explicitly warns that an inner `bash -lc` is not sufficient protection from outer-shell parsing.

### 6.5 “Documented” was again weaker than “triggerable”

The repository already had excellent CI retrospectives, yet the experiment still had to rediscover several principles.

Why: historical files are rich but deep; future Agents do not automatically load every case, and the specific cue “I am doing a CI performance benchmark” had no dedicated trigger.

Change now: `scenario-trigger-registry.md` has a CI-performance trigger; the detailed case is indexed from `docs/agents/README.md`; durable rules live in current owners rather than only this history file.

### 6.6 Provider wait/status polling was already governed

The repository already had provider wait discipline. This conversation still performed many status reads during active long-running browser jobs.

Why: the user repeatedly asked to continue synchronously and the final decision genuinely depended on terminal browser results, but some intermediate polls had no new action attached.

No new policy layer was added. Future Agents should keep using the existing wait discipline: record exact start, inspect once for actionable failure, do independent work, and avoid high-frequency empty polling.

---

## 7. Tool and permission boundaries

- GitHub connector was the canonical shared-repository write/read path when local HTTPS transport failed.
- Remote Desktop Commander was used only because local-only worktrees/dependency/browser-session state materially mattered. It must not become the default for GitHub-owned state.
- Existing authenticated browser state was used read-only for CircleCI job telemetry; cookies/credentials were not exported. When that session expired, the task did not weaken browser security or force a new login just to obtain optional timing detail.
- A global process listing proved too broad for a narrow liveness question. Future process diagnostics must be scoped.
- No server/GPU/root authority was exercised for this website CI task. Availability of a GPU/research server would not have been permission to use it as CI compute.

---

## 8. Zero-context procedure for the next CI-performance Agent

1. Read `/AGENTS.md`, `docs/agents/LATEST.md`, `docs/agents/README.md`, current operating principles, website engineering standard §6.1–6.2, deployment policy, scenario trigger registry, and release closeout protocol.
2. Refresh live `main`, open PRs, overlapping benchmark branches, and required checks before creating anything.
3. Write the causal question and pre-register candidate/control refs/trees, canonical test identities, executor/shards/workers/retries, metric, critical-path aggregation, meaningful delta, theoretical upside, and concurrency policy.
4. Decide whether the candidate's own PR is qualification-only. If so, design a benchmark-only ordinary-full stacked PR before looking at timing results.
5. Keep correctness authority on the existing scheduler/gate while new timing/scheduling metadata runs in shadow.
6. Prove complete population mapping and conservative fallback for new/missing timing before authority can move.
7. Prepare candidate locally using the canonical repository command/config; classify missing dependencies/fixtures as environment issues.
8. Search again for overlapping Agents/PRs immediately before the first provider-triggering write.
9. Run candidate alone. Record exact SHA, resolved base SHA, start/end, both browser shards, critical path, and any provider job-layer timings available.
10. Run control alone on a frozen base with a fresh head SHA and exact same test identities/contract.
11. If the delta is inside known noise, use at most the repeat necessary to decide; for same treatment, prefer a fresh commit pointing to the identical tree.
12. Do not merge benchmark-only PRs. Close them with receipts.
13. Merge the implementation only if its explicit acceptance rule is satisfied, not merely because branch protection is green.
14. Immediately before merge, re-read head/base/draft/body/checks/main; use expected-head locking.
15. If another Agent has already merged prematurely, preserve the fact, finish the missing validation, and apply a narrow latest-main revert/repair if needed.
16. After closeout, update current owners only for genuinely durable rules, put causal numbers in history, and leave transient status out of memory/current policy.

---

## 9. Long-term memory boundary

Repository persistence and ChatGPT long-term memory are different systems.

In the environment used for this retrospective, there was no available long-term-memory mutation endpoint. Personal-context retrieval is not a memory write, and a GitHub commit is not a memory write. Therefore this case **must not** claim that these rules were saved into ChatGPT long-term memory.

The stable rules were instead placed in the repository's startup/current owners so future Base Model Agents can discover them. If a future environment exposes a real memory-write capability, only the A-class cross-conversation rules should be considered; PR numbers, SHAs, timings, current provider state, PIDs, GPU occupancy, and worktree paths must remain excluded.

---

## 10. Final historical boundary

The adaptive CircleCI timing work is retained as a valid negative experiment:

- it proved provider historical test timing could be mapped safely in shadow;
- it exposed and fixed a cold-start correctness hazard;
- it did not prove a large enough steady-state wall-clock improvement to justify replacing the simpler static scheduler;
- its premature merge was corrected without erasing later research work.

Do not restore #473 because it once passed CI. Any successor must start from current executable truth and satisfy the current causal benchmark protocol anew.
