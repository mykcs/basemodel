# Mac / OrbStack runner housekeeping, GHCR recovery, and CI parallelism retrospective

Status: **historical case + reusable causal lessons, closed 2026-09-06.**

This document explains the 2026-09-04 → 2026-09-06 BaseModel/OpenEvo Mac-runner work. It does **not** own current CI provider authority. Read `/AGENTS.md`, `docs/agents/LATEST.md`, `docs/agents/current/scenario-trigger-registry.md`, and `docs/agents/current/deployment-policy.md` first. Provider roles, runner status, disk usage, image sizes, PR state, and live process state below are dated evidence only.

## 1. Why this case matters

The task started as a seemingly simple question: what inside OrbStack on the owner's MacBook could be cleaned up or backed up elsewhere? It exposed a larger class of recurring mistakes:

- treating container/image UI labels as execution truth;
- treating reclaimable bytes as deletion authority;
- confusing source backup, runtime-image backup, mutable runner identity, and scientific artifact archival;
- assuming an offline self-hosted runner is broken instead of intentionally dormant;
- assuming more Playwright workers are safe because memory is available;
- interpreting a long self-hosted queue as a stuck job;
- using Bash syntax through a Fish-default execution surface;
- attempting branch/rebase work in dirty or stale local worktrees;
- preserving a dated migration document under a current-looking path without making its historical status impossible to miss;
- assuming a provider-level halt command also exits the current shell;
- assuming hosted CI cannot enter a pager/prompt merely because `CI=1` or Docker is present;
- treating a newly written regression test as authoritative before validating its own fixture;
- letting parallel duplicate PRs accumulate instead of selecting one canonical root fix;
- treating a checked PR snapshot as stable while another Agent can move or merge it.

The final architecture and closeout avoided those traps by separating source, recovery images, mutable local state, CI authority, deployment authority, exact-head acceptance, and provider execution semantics rather than trying to make one layer or one green badge serve every purpose.

## 2. A / B / C information classification

### A. Long-lived rules

Promote these into startup/current policy or executable guards:

- explicit shell selection when syntax depends on Bash;
- clean-worktree / exact-head discipline;
- queue-vs-stuck diagnosis before cancellation;
- source / CI control / CI compute / deployment / observation role separation;
- cleanup requires ownership/reference/liveness classification, not size alone;
- registered runner credentials and writable workspaces are never backup payloads;
- OCI runtime recovery belongs in a container registry; scientific model/data artifacts follow the experiment publication path;
- upload is not recovery proof until immutable remote identity and readback are verified;
- fallback `offline + disabled + stopped` can be healthy desired state;
- browser-performance changes must preserve the full acceptance contract;
- CI subprocesses attached to terminal streams must be made explicitly non-interactive when paging/prompting is possible;
- a newly written regression guard should, when practical, demonstrate the causal witness `pre-fix FAIL -> post-fix PASS` before it is treated as authoritative evidence;
- exact-head/current-base/shared-PR state must be refreshed immediately before writes or merge because another Agent can move or complete the work between checks;
- duplicate fixes should converge to one canonical minimal root repair with explicit supersession rather than being stacked merely because one duplicate is larger.

### B. Project-level lessons

Keep these in BaseModel/OpenEvo CI runbooks and this case:

- BaseModel ordinary CI eventually moved to cloud-side independent browser shards with one Playwright worker per shard; the Mac path became manual fallback.
- The BaseModel/OpenEvo runner bundles have repository-owned start/stop/doctor/reconcile/housekeeping scripts and intentionally isolated containers.
- Shared Mac BuildKit pruning needs awareness of every runner that shares the OrbStack daemon.
- Historical Mac activation/cutover documents must not be read as current provider authority after later migrations.
- BaseModel CircleCI uses different event semantics: a documentation-only PR may take the `docs` fast path, while `main` push revalidation is intentionally `full`; identical status-context names do not imply the same execution path.
- `scripts/ci-docs-contract.mjs` owns the documentation contract, and its Git helper is intentionally `--no-pager`; root-fix changes to CI machinery must themselves receive the full CircleCI contract before the original docs PR is refreshed.
- When GitHub exposes CircleCI status metadata but not causal logs, provider-log inspection through an authorized UI/browser is a legitimate diagnostic escalation; authentication/session details remain outside repository evidence.

### C. Transient state

Do **not** promote these into current policy or account memory:

- exact disk free-space snapshots;
- current Docker image/container byte counts;
- current PR numbers/heads/check queues as live authority;
- current runner `online/busy` state;
- temporary benchmark containers;
- current process IDs, elapsed times, and one-off cache totals;
- exact PR/job/workflow IDs and SHAs once they are no longer needed as historical receipts;
- temporary browser profile/session identity used to reach a provider UI;
- task-owned worktree paths and short-lived debug branches.

They remain below only where useful to explain causality. They must never be restated as live authority in `current/` policy or account memory.

## 3. Historical sequence, without turning it into authority

1. The Mac UI was correctly identified as **OrbStack**, not Docker Desktop. The self-hosted GitHub Actions jobs ran inside long-lived Linux/ARM64 Docker containers managed by OrbStack; the Mac was also the Remote Desktop Commander / SSH / browser-control machine.
2. The first bounded audit found current BaseModel/OpenEvo runner containers plus stopped legacy/backup containers, runner/browser/npm caches, and several GiB of BuildKit cache. Old timestamped backups and clearly unused images were removed without touching active jobs.
3. Housekeeping was implemented so only the newest rollback bundle/container is retained, BuildKit has a bounded target, probes are time-bounded, cleanup is best-effort, and shared cache prune fails closed unless runner state is proven safe.
4. A first two-worker Playwright benchmark (historical PR #431) ran 153 Chromium tests with `PLAYWRIGHT_WORKERS=2`. Memory stayed well below the 4 GiB cgroup ceiling with no swap/OOM, but a monolithic all-public-route header test exceeded its timeout; only 104 tests passed before fail-fast stopped the matrix. It was rejected.
5. A second benchmark (historical PR #432) split the 86-route header sweep into four deterministic route shards. The header shards passed, but two-worker contention moved the failure to `research-explainer-layout`: the complete matrix again terminated early. It was rejected too. This proved that the bottleneck was not just one pathological test or memory capacity.
6. Clean BaseModel and OpenEvo runner images were checked for runner-registration files, tagged with human-readable plus immutable identities, pushed to **private GHCR**, and verified by remote digest readback. Registered/live containers were deliberately not converted into backup images.
7. The Mac runner cleanup/housekeeping changes were merged (historical BaseModel PR #428 and OpenEvo follow-up work). Old stopped legacy registrations/containers were retired only after current recovery paths were proved.
8. The later CI migration made cloud execution primary and the Mac runner manual fallback. BaseModel's accepted design became two independent cloud browser shards with one worker each rather than two workers competing inside one bounded Mac executor.
9. At final closeout the Mac fallback LaunchAgents/runners were intentionally disabled/offline; BuildKit had already been pruned below its cap. An unreferenced local CircleCI qualification image was removed only after proving no container referenced it. Stopped fallback runner containers were retained because current policy still treats them as recovery assets.
10. The docs-only experience-deposition PR #467 exposed a separate CircleCI control-flow defect: `circleci-agent step halt` did not exit the current Bash step. Root-fix PR #469 added explicit successful shell exits plus a deterministic guard.
11. After #469 landed, #467 exact head `0b5101d…` passed both browser docs-mode shards but deterministic stopped at `--More-- (END)` and hit CircleCI's ten-minute no-output timeout. The cause was Git paging on inherited terminal streams, not a failing repository assertion.
12. Root-fix PR #484 made the documentation contract's Git helper explicitly `--no-pager`, protected it with a behavioral guard, passed the full CircleCI contract, and merged. A parallel wider duplicate (#483) was compared, marked superseded, and closed instead of being stacked.
13. #467 was refreshed onto the accepted root fix. Its relative diff remained five documentation files, exact-head docs-mode CircleCI passed, and the PR was merged by another actor while final readiness was being re-read. The resulting `main` commit was then validated separately through the full post-merge CircleCI path.
14. PR #485 deposited the non-interactive subprocess rule into the current deployment owner and extended this historical case; its own docs-mode CI and the subsequent main full revalidation both passed.

Historical numbers, PR states, SHAs, and provider job identities in this section are evidence only. Do not use them as today's live state.

## 4. Friction 1 — OrbStack `In Use` / Docker `reclaimable` were almost treated as activity/deletion semantics

**What happened:** the OrbStack image list showed images as `In Use`, while `docker system df` showed reclaimable image/container/cache bytes. Those labels were initially tempting as cleanup decisions.

**Why:** Docker/OrbStack expose storage/reference metadata in UI terms that sound operational.

**Missing assumption:** `In Use` usually means a container references an image; it does not prove CPU work. `Reclaimable` is a storage calculation; it does not prove the object is unnecessary, remotely recoverable, or outside a rollback path.

**Precheck next time:** inspect `docker ps -a`, image ancestors/references, container running state, GitHub runner state, current fallback policy, and whether the object is a deliberately retained rollback/recovery asset.

**Defensive rule:** **reference/liveness/policy classification precedes deletion. Size output never grants deletion authority.**

**Anti-example:** “This stopped runner container is 1.8 GiB reclaimable, so delete it.” That is wrong when current policy retains the stopped container for manual recovery.

## 5. Friction 2 — backup destination was initially discussed as “GitHub / Docker / Hugging Face” without classifying the artifact

**What happened:** the owner asked whether Mac assets should be backed up to GitHub, Docker, or Hugging Face. The correct answer depended entirely on artifact class.

**Why:** “backup” hides several independent requirements: source reproducibility, fast runtime recovery, scientific preservation, and mutable machine state.

**Missing assumption:** a Docker runtime image, a Git repository, a checkpoint, and a registered Actions runner are not interchangeable backup units.

**Precheck next time:** classify the object first:

```text
source/config/scripts           -> GitHub
clean OCI runtime image         -> private GHCR / OCI registry
scientific model/data/checkpoint-> experiment publication policy / Hugging Face where appropriate
runner credentials/workspace    -> do not archive; reconstruct
cache/log/tmp                    -> do not archive; regenerate
```

**Defensive rule:** choose backup storage by artifact semantics, not by whichever provider is already authenticated.

**Anti-example:** uploading a GitHub Actions runner container to Hugging Face merely because HF stores other large files.

## 6. Friction 3 — a registered runner container is not a safe image backup

**What happened:** the clean runner image was safe to publish, but the live/registered container had machine identity and mutable runner state.

**Why:** `docker commit` makes it easy to snapshot “whatever works now.”

**Missing assumption:** GitHub self-hosted runner registration material (`.credentials`, `.runner`, related key state), workspaces, diagnostics, and caches are not reusable application state and should not be exported.

**Precheck next time:** verify the image itself contains no runner registration identity. Prefer build inputs from GitHub plus a clean image. If publishing, inspect the image/container boundary rather than trusting a tag name.

**Defensive rule:** **publish clean build output, never a registered runner snapshot.**

**Anti-example:** `docker commit basemodel-ci-runner-v2 ghcr.io/...:backup` followed by `docker push`.

## 7. Friction 4 — “push succeeded” was not enough to call GHCR a recovery copy

**What happened:** after pushing, the registry package was queried again to verify private visibility and exact remote digest/tag identity.

**Why:** upload output can finish ambiguously; tags can move; registry/package metadata can contain untagged manifest/index objects that look like duplicates.

**Missing assumption:** local image ID/repo digest does not prove remote availability, privacy, or immutable identity.

**Precheck next time:** read the remote package/version/manifest back, verify visibility, compare the exact digest, and distinguish tagged image identities from auxiliary/untagged OCI manifest objects.

**Defensive rule:** remote recovery state begins at **immutable remote identity + readback**, not at “push printed success.”

**Anti-example:** deleting the only local image immediately after the first push line without verifying the remote digest or privacy.

## 8. Friction 5 — shared BuildKit cleanup needed multi-runner authority, not one-container idleness

**What happened:** BaseModel and OpenEvo shared the same OrbStack Docker/BuildKit daemon. Pruning while one runner was idle could still disrupt the other runner's active build cache.

**Why:** the cleanup target was machine-wide even though each CI workflow looked repository-scoped.

**Missing assumption:** shared daemon/cache scope is wider than repository/container scope.

**Precheck next time:** resolve every runner that shares the daemon. Require each to be `online + idle`, or intentionally disabled with its local runner container proven stopped/absent. Unknown state blocks prune.

**Defensive rule:** shared cache requires shared-idleness proof; use a bounded cap, lock/rate limit, and best-effort failure behavior. Never use `docker system prune` as routine runner maintenance.

**Anti-example:** “OpenEvo is idle, so prune BuildKit” while BaseModel is in a browser/build step.

## 9. Friction 6 — `offline` was repeatedly at risk of being interpreted as “broken; restart it”

**What happened:** after CI cutovers, the Mac runners were intentionally disabled/offline and their containers exited. A later inspection could easily mistake this for an incident.

**Why:** runner dashboards are optimized around always-on workers; `offline` visually resembles failure.

**Missing assumption:** the provider role may have changed. A fallback runner's desired state can be dormant.

**Precheck next time:** read current CI authority, local mode file, LaunchAgent disabled/loaded state, GitHub runner state, and container state together.

**Defensive rule:** **resolve role before health.** Do not wake a manual fallback to make a dashboard green.

**Anti-example:** reloading a LaunchAgent because GitHub says the fallback runner is offline while CircleCI/cloud CI is the current ordinary path.

## 10. Friction 7 — single-runner queueing was mistaken for a possible stuck job

**What happened:** BaseModel housekeeping PRs waited behind unrelated long browser jobs on the single Mac runner. The queued state persisted for a long time.

**Why:** elapsed wall-clock is visible; queue ownership and active child-process progress are less visible.

**Missing assumption:** one self-hosted label/runner serializes jobs, and long browser gates can legitimately hold it.

**Precheck next time:** inspect provider queue order, runner `busy`, workflow current step, child PID/process CPU/liveness, and durable logs/artifacts before cancel/retry.

**Defensive rule:** queued ≠ stuck; timeout/monitor loss ≠ job failure. Read back execution state before mutation.

**Anti-example:** canceling a healthy unrelated research-site browser acceptance merely to let a housekeeping PR run sooner.

## 11. Friction 8 — available memory was incorrectly close to becoming a “2 workers are safe” conclusion

**What happened:** the first two-worker benchmark used only about 2.34 GiB peak of a 4 GiB cgroup, with zero swap/OOM, but the browser matrix still timed out.

**Why:** resource capacity was easier to measure than contention-sensitive latency and test reliability.

**Missing assumption:** Playwright workers contend for CPU, browser renderer time, static server capacity, filesystem, and test timeout budget even when RAM is plentiful.

**Precheck next time:** define the full acceptance contract and baseline before changing workers; keep retries, test set, assertions, executor, browser, build path and fail-fast semantics fixed; record complete-matrix outcome plus wall-clock and resource counters.

**Defensive rule:** memory headroom is only one qualification. A performance change is accepted only when the **entire** matrix remains reliable and the speedup is material.

**Anti-example:** “104 tests passed in 12 minutes instead of 153 in 15 minutes, so 2 workers are faster.” The early-terminated run is incomparable and unacceptable.

## 12. Friction 9 — fixing the first long test did not prove the concurrency model

**What happened:** the 86-route header test was split deterministically into four shards. Those shards passed under two workers, but another tablet layout test then hit the existing timeout and the matrix again failed.

**Why:** the first observed failure was treated as a candidate bottleneck, but it was only the first failure exposed by `--max-failures=1`.

**Missing assumption:** fail-fast browser output reveals the first reachable failure, not the only concurrency-sensitive test.

**Precheck next time:** after any fix, rerun the complete matrix; do not infer unexecuted tests are clean. Prefer horizontal shard isolation when executor-local concurrency shifts failures around the suite.

**Defensive rule:** eliminate the architecture-level failure mode, not only the first symptom. In this case independent cloud shards with one worker each preserved isolation better than two workers inside one bounded executor.

**Anti-example:** raising only the header test timeout after the first failure and merging without a full rerun.

## 13. Friction 10 — dirty/stale worktrees made otherwise simple Git refresh work unsafe

**What happened:** the long-lived BaseModel/OpenEvo local checkouts contained unrelated dirty work. A housekeeping worktree also had uncommitted local edits, so a direct rebase failed. Network Git fetches could also hang.

**Why:** local Git state was convenient and familiar, but not an isolated authority surface.

**Missing assumption:** another Agent/user process may own dirty local changes; the remote PR head and current `main` may have advanced independently.

**Precheck next time:** read local `HEAD` + dirty state, remote PR head/base, current `main`, and worktree registration immediately before commit/rebase/push. If dirty, create a fresh detached worktree from a proven commit object or use a repository-side branch/update path; do not stash/reset someone else's work.

**Defensive rule:** never rebase or repurpose an unrelated dirty worktree. Verify exact file/blob identity before deleting a temporary worktree whose edits may already exist remotely.

**Anti-example:** `git reset --hard origin/main` in `/Users/.../Projects/basemodel` simply to make a CI documentation task easier.

## 14. Friction 11 — Fish/Bash mismatch recurred even after earlier retrospectives

**What happened:** a compound command using Bash `if ...; then ...; else ...; fi` syntax was accidentally sent through a Fish-default remote execution surface and failed before doing the intended checks.

**Why:** the shell was implicit in the tool call, while the command was authored with Bash assumptions.

**Missing assumption:** shell dialect is runtime identity just like Python/Node/container identity.

**Precheck next time:** if the command uses Bash assignment, `set -euo pipefail`, arrays, heredocs, process substitution, or compound loops/conditionals, set `/bin/bash` explicitly or run a checked-in script.

**Defensive rule:** parser failure under the wrong shell is `NOT_EXECUTED`, not evidence about Docker/Git/repository health.

**Anti-example:** retrying the same Bash compound command through the default Fish shell and then debugging the repository because it still fails.

## 15. Friction 12 — current provider architecture and historical Mac documents drifted apart

**What happened:** provider migration moved ordinary CI away from the Mac runner, but historical activation documents could still say `ACTIVE PRIMARY CPU CI`. A future Agent reading the wrong file first could re-enable retired infrastructure or misread required checks.

**Why:** migration completion focused on executable triggers/checks; the old document's historical value made deletion undesirable.

**Missing assumption:** preservation and current-authority status are independent. A historical file can stay, but its status must be unmistakable and current routers must point elsewhere.

**Precheck next time:** provider migration closeout must update executable triggers, required checks, startup-visible current docs, and any misleading current-looking historical document headers in the same closure.

**Defensive rule:** keep historical facts immutable in meaning, but mark them historical/superseded and route current behavior through one current policy. Never maintain two co-equal “current” provider stories.

**Anti-example:** editing a dated activation record to pretend CircleCI was always primary, or leaving `ACTIVE PRIMARY` at the top after a later cutover.

## 16. Friction 13 — provider “halt” control was mistaken for shell `exit`

**What happened:** the experience-deposition PR itself exposed a dormant CircleCI docs-mode bug. Both CircleCI jobs called `circleci-agent step halt` for a valid `mode=docs`, but the same shell continued into the following fail-closed `mode != full` branch and returned failure.

**Why:** provider orchestration commands and shell process control were mentally collapsed into one mechanism.

**Missing assumption:** `circleci-agent step halt` changes what CircleCI schedules **after the current step**; it does not terminate the current Bash command body.

**Precheck next time:** for every provider-level early-stop/skip command, verify whether it exits the current shell/process or only changes later scheduling. Exercise the fast path itself, not only the planner that selects it.

**Defensive rule:** a successful early-return path must end the current execution scope explicitly and must have a deterministic test that proves it cannot fall through into an error branch.

**Anti-example:**

```bash
if [[ "$mode" == docs ]]; then
  circleci-agent step halt
fi
if [[ "$mode" != full ]]; then
  exit 1
fi
```

The provider halt does not make the second `if` unreachable. Use an explicit successful exit/return after the halt.

## 17. Friction 14 — inherited CI terminal streams opened Git's pager

**What happened:** after the `step halt` fallthrough was fixed, the same docs-only deposition PR reached a second, independent failure. Exact head `0b5101d6dfcabe751f0769f04d0c170085f6be71` passed both browser docs-mode shards, completed merge-candidate preparation, passed all nine CI plan/prepare tests, and classified the five-file diff as `mode=docs`. The deterministic job then stopped producing output while the documentation contract ran `git diff --check`; its last visible terminal state was `--More-- (END)`. CircleCI killed the step only after the 10-minute no-output deadline.

**Why:** the documentation contract deliberately inherited stdout/stderr for `git diff --check` so whitespace diagnostics stayed visible, but that also attached Git to the runner's terminal surface. The implementation assumed a hosted CI process would therefore remain non-interactive. Under the actual CircleCI terminal behavior, Git could invoke a pager and wait for input. Local runs with captured output did not exercise that surface.

**Missing assumption:** non-interactive intent is not the same as non-interactive process behavior. `CI=1`, Docker, and provider execution do not by themselves prove that a subprocess cannot page or prompt when terminal streams are inherited.

**Precheck next time:** for every CI subprocess that inherits stdin/stdout/stderr, inspect pager/prompt behavior explicitly. Reproduce suspicious no-output stalls under a real or simulated TTY, and distinguish "the test is slow" from "the process is waiting for input" before changing timeouts.

**Defensive rule:** make non-interactivity explicit at the owning helper boundary. The canonical fix prepends `git --no-pager` to every Git invocation in `ci-docs-contract.mjs`, including the streamed whitespace check, and protects that behavior with a regression test that rejects any Git call lacking `--no-pager`. Keep the underlying `git diff --check`, safe-path, conflict-marker, NUL-byte, merge-candidate, and browser contracts unchanged.

**Anti-example:** increasing CircleCI's no-output timeout, suppressing the documentation contract, or redirecting away diagnostics without first proving the job is doing real work. Those changes hide the symptom while preserving the interactive wait.

## 18. Friction 15 — a red provider status was not enough to identify the failing mechanism

**What happened:** GitHub exposed the three CircleCI status contexts and the deterministic job target URL, but the status API did not contain the causal step output. The two browser shards were green while deterministic was red. Local reproduction of the planner and documentation contract passed, so the decisive evidence had to come from the actual CircleCI job output. The first browser session was unauthenticated; an already-authorized local browser session was used to inspect the provider log rather than asking the owner to relay it manually.

**Why:** provider status surfaces are optimized for state (`pending / success / failure`), not necessarily for root-cause detail. A local reproduction can also differ from the hosted terminal/TTY surface even when code and commits match.

**Missing assumption:** a red status, elapsed duration, or target URL is a pointer to evidence, not the evidence itself. Authentication/session state is a tooling boundary separate from repository correctness.

**Precheck next time:** capture exact head/base and status contexts, then read the failing provider job's last successful step plus raw stdout/stderr. If the connected API exposes only status metadata, use an authorized provider UI/browser path when available; do not persist browser-profile names, cookies, or session material in repository evidence.

**Defensive rule:** do not infer a CI root cause from color or duration. Resolve the failing execution layer from the provider log before changing code, timeouts, or acceptance semantics.

**Anti-example:** seeing `deterministic = failure` at ten minutes and immediately increasing the timeout without checking that the last terminal state was an interactive pager.

## 19. Friction 16 — the first new regression test failed because the test fixture was wrong

**What happened:** the first behavioral regression test for `git --no-pager` used a fake `git` logger. Its string escaping wrote a literal `\\t` sequence while the assertion expected a real tab, so the new test failed even though the production helper already prepended `--no-pager`. The fixture was corrected to log JSON argument arrays. The same test was then run once against the pre-fix implementation, where it failed on the first Git invocation, and again against the fixed implementation, where it passed.

**Why:** the regression guard and its fixture were both new code. The initial failure was interpreted only after inspecting what the fixture actually emitted instead of assuming the implementation was still wrong.

**Missing assumption:** a newly written test has not yet earned authority. Test fixtures, escaping, mocks, fake executables, clocks, and environment setup can be the failing implementation.

**Precheck next time:** when a new guard fails after the intended product/root fix, inspect fixture output and isolate the harness from the implementation. Prefer a causal witness: the same guard should fail against the known pre-fix behavior and pass against the fixed behavior.

**Defensive rule:** a regression test becomes strong evidence only after **fail-before / pass-after** is demonstrated when practical. A new red test is not automatic proof of a product regression.

**Anti-example:** repeatedly changing production CI logic to satisfy a fake executable whose own logging/escaping is malformed.

## 20. Friction 17 — a parallel Agent produced a wider duplicate root-fix PR

**What happened:** while the narrow pager fix was being prepared, another Agent independently opened PR #483 for the same `git --no-pager` root cause. It also added ignored stdin and a separate nine-case documentation-contract suite. The narrow PR #484 changed only the central Git helper plus one behavioral guard, passed the complete deterministic + two-browser-shard contract, and was merged. The wider duplicate was compared path-by-path, found unnecessary for the observed failure, marked superseded, closed, and its remote branch was later deleted.

**Why:** parallel Agents can converge on the same diagnosis at nearly the same time. A larger patch can look “stronger” because it includes more tests or defensive changes even when those additions are not necessary to close the root cause.

**Missing assumption:** canonicality is not proportional to patch size or number of tests. The correct choice minimizes semantic surface while preserving the strongest necessary evidence and acceptance contract.

**Precheck next time:** compare duplicate PRs by exact head/base, root-cause semantics, changed files, extra-scope necessity, accepted CI evidence, ancestry/dependents, and whether useful evidence can be retained without merging redundant code.

**Defensive rule:** one root cause should have one canonical fix. Do not stack a duplicate merely for “extra confidence” when the extra scope is not required; explicitly close/supersede the alternate path and preserve its useful evidence in the disposition record.

**Anti-example:** merging #484 and then merging #483 because “nine tests are better than one,” thereby re-opening already-accepted CI surfaces and creating two historical owners for the same repair.

## 21. Friction 18 — shared PR state changed between final acceptance and the intended merge action

**What happened:** after #467 was refreshed onto the pager fix, exact head `eb8954a…` passed deterministic plus both browser docs-mode shards. While the final merge/readiness check was underway, another actor merged the PR. The correct response was not another merge attempt: live `main` was refreshed, the actual merge commit was identified, and post-merge CircleCI was followed to completion. The main-push deterministic job ran longer because `push` is intentionally `full`, not `docs`; its continuing output distinguished it from the earlier pager stall.

**Why:** GitHub PR state is shared mutable state, and the same named job can execute a different plan under `pull_request` and `push` events.

**Missing assumption:** a checked PR/head snapshot is not a lock, and job-name similarity does not imply execution-path identity.

**Precheck next time:** immediately before any merge/write, re-fetch PR state, head, base, review threads, and current `main`. If another actor already merged or moved the head, stop the planned mutation and switch to verification of the state that actually exists. When diagnosing runtime, inspect event/plan mode and live output rather than comparing wall-clock alone.

**Defensive rule:** acceptance belongs to an exact tree **and execution context**. Docs-mode PR acceptance and main full revalidation are separate evidence layers; a concurrent merge turns the next task into post-merge verification, not a retry of the merge mutation.

**Anti-example:** treating a two-minute main deterministic run as recurrence of a docs-mode pager hang merely because the status context is also named `deterministic`, or attempting to force a second merge after the PR is already closed/merged.

## 22. Zero-context diagnostic recipe for this failure family

A future Agent encountering “docs-only PR, browser shards green, deterministic red/slow” should use this sequence before modifying CI:

1. Fetch the live PR and record exact head SHA, intended base SHA, changed files, mergeability, and all required status contexts.
2. Inspect the **exact PR head**, not only current `main`, to verify which CI fixes/config are actually present.
3. Materialize or reproduce the repository's exact merge-candidate preparation path; run the CI control tests, planner, and documentation contract against that identity.
4. If local control tests pass but hosted deterministic fails, obtain the real provider log and locate the last successful output. Distinguish active progress from no-output wait.
5. Classify the layer: product/contract, CI planner, shell/provider control, interactive subprocess/pager, test harness/fixture, environment, or inherited base debt.
6. Fix the smallest causal owner. Keep `git diff --check`, safe-path checks, browser coverage, required status names, and timeout/quality thresholds unchanged unless separate evidence proves one of those contracts is itself wrong.
7. Add a behavioral regression guard. When practical, prove it fails on the known pre-fix behavior and passes on the fixed behavior.
8. Because a CI-script/test change changes acceptance machinery, let the root-fix PR receive the repository's ordinary **full** deterministic + browser contract.
9. Merge the accepted root fix first. Then refresh the original docs-only PR onto current `main`, confirm its relative diff is still documentation-only, and require fresh exact-head docs-mode statuses.
10. Race-check immediately before merge. If another Agent moved/merged the PR, do not overwrite or duplicate the action; verify the resulting `main` commit instead.
11. Follow post-merge `main` full revalidation separately. A longer full run with continuing output is not equivalent to a docs-mode no-output hang.
12. Close duplicate/superseded PRs, remove only task-owned worktrees/branches/browser sessions, and leave unrelated concurrent work untouched.

This recipe is incident guidance, not a second current CI authority. `deployment-policy.md`, `release-closeout-protocol.md`, branch/PR conventions, and executable tests remain authoritative.

## 23. Scientific-semantics boundary

This conversation was operational/CI work. It deliberately did **not** use the RTX 5090 research server as a convenient CI fallback and did not change OpenEvo Stage1/Stage2 task identity, sampling, seeds, model state, reward, eligibility, final panel, or GPU scheduling semantics.

The reusable principle is broader:

> Engineering optimization may change placement, caching, CI provider, or test scheduling only when the scientific/acceptance contract is unchanged and proved unchanged.

A browser test worker count is not scientific sampling, but weakening browser coverage to obtain a faster green check would still alter the product acceptance semantics. Likewise, routing ordinary CPU CI to the scientific GPU server would change resource isolation even if no experiment code changed.

## 24. Repeated-error audit

Several failures had already appeared in earlier BaseModel/OpenEvo retrospectives:

| Repeated issue | Why prior deposition was insufficient | This closeout's fix |
| --- | --- | --- |
| Fish/Bash mismatch | detailed cases existed, but an execution tool still defaulted to Fish and the rule was not always activated at command construction | keep explicit-shell guard in root startup rules and current operating principles; treat shell as runtime identity |
| dirty/stale worktree use | historical cases documented moving-main and worktree contamination, but convenience still pulled work toward long-lived dirty checkouts | current operating principles already route to isolated worktrees; this case adds exact remote/blob verification before cleanup |
| queued self-hosted CI mistaken for stuck | queue diagnosis lived mainly in dated retrospectives | Mac fallback trigger now requires queue/runner/child-process readback before cancellation |
| provider-role confusion | old Mac/Cloudflare/CircleCI cases remained discoverable and could look operational | current provider owner is explicit; old activation docs must be marked historical/manual fallback |
| cleanup from size/reclaimable output | prior disk-pressure lessons focused on server storage, not Mac runner fallback semantics | Mac trigger now owns reference/liveness/recovery classification and forbids size-only deletion |
| “upload” treated as backup | archive rules existed mainly for scientific artifacts | Mac trigger/deployment policy now require clean-image classification plus private GHCR immutable digest readback |
| exact-head / moving-main acceptance | older closeouts had already shown stale heads and moving bases, but shared PR state can still change during the final seconds of a task | current release closeout requires a live race-check plus expected-head locking; this conversation correctly switched to post-merge verification when #467 was merged concurrently |
| duplicate PR convergence | earlier duplicate-PR cases existed, but parallel Agents can independently rediscover the same root cause before either sees the other's branch | compare exact root semantics and evidence, choose one canonical fix, explicitly supersede the other, and delete only after dependency/reachability checks |
| red CI -> weaken timeout/gate | earlier optimization work repeatedly made “make it green” tempting when the failure layer was unclear | provider logs + fail-before/pass-after regression evidence now separate interactive waits/test-fixture failures from acceptance-contract defects |

The recurring meta-failure was **information level**: a lesson placed only in a deep incident file was not guaranteed to trigger during a superficially different task. The fix is not another giant retrospective. It is the combination used here:

```text
root AGENTS invariant
-> scenario trigger
-> current deployment owner
-> detailed historical case
-> executable housekeeping / CI architecture
```

## 25. Durable-rule placement audit

The closeout deliberately avoids copying every lesson into every layer. The current ownership map is:

| Lesson | Class | Durable owner / protection | Placement decision |
| --- | --- | --- | --- |
| Bash semantics require explicit Bash | A | `/AGENTS.md` + `project-agent-operating-principles.md` | already startup-visible; do not repeat here as current authority |
| dirty/concurrent worktree and moving shared state | A | `project-agent-operating-principles.md` + `release-closeout-protocol.md` | existing current rules already require isolation, live refresh, and race-check |
| provider halt is not shell exit | A | `deployment-policy.md` + `tests/ci-plan.test.mjs` | current policy + executable regression guard |
| inherited Git output must not page interactively | A | `deployment-policy.md` + `scripts/ci-docs-contract.mjs` + `tests/ci-plan.test.mjs` | landed during this conversation via #484/#485; no second policy owner needed |
| red CI is not permission to weaken the Gate | A | `scenario-trigger-registry.md` + `release-closeout-protocol.md` | already current; this case supplies the provider/pager example |
| exact-head/base drift and merge race | A | `release-closeout-protocol.md` | already current and stronger than any incident-specific wording |
| duplicate fixes converge to one canonical path | A | `branch-and-pr-conventions.md` + `multi-pr-semantic-integration-playbook.md` | existing current ownership; this case records #483/#484 as evidence |
| `pre-fix FAIL -> post-fix PASS` for a newly written regression guard | B for now | this historical case + the concrete no-pager executable guard | keep as a project diagnostic technique until recurrence justifies another cross-task policy sentence; current release rules already classify test-harness failure |
| docs PR fast path vs main push full revalidation | B | `deployment-policy.md` | BaseModel-specific execution semantics, already current |
| provider status may require authenticated UI log inspection | B | this case / tool boundary | diagnostic technique only; browser profile/session identity is transient and must not become policy |

This is the stopping rule against policy sprawl: a lesson can be reusable without becoming another startup bullet. Promote only when the existing owner cannot express or trigger it reliably.

## 26. Durable memory candidates

Cross-conversation memory candidates from this case are intentionally narrow:

- the owner's Mac is a control-plane device as well as a possible fallback runner, so ordinary CI should prefer cloud execution and avoid persistent Mac contention;
- the owner prefers free/cloud CI when it preserves the acceptance contract and does not use the scientific GPU server;
- explicit Bash should be selected for Bash semantics;
- dirty concurrent worktrees must not be reset/rebased merely for convenience;
- current provider/experiment authority must be re-read instead of inferred from a historical retrospective;
- backups must be identity-verified before local destructive cleanup;
- a CI red status or no-output timeout is not causal evidence: inspect the provider log and make subprocess non-interactivity explicit before changing acceptance budgets;
- exact-head/current-base state must be re-read immediately before merge/write because parallel Agents can move or merge shared PR state;
- prefer one narrow, evidence-backed canonical root fix and explicitly retire duplicate PR paths rather than stacking redundant patches;
- preserve the user's standing preference for root-cause replacement over layered patches, and never trade away deterministic/browser/scientific acceptance semantics merely to obtain green CI.

This execution environment exposes personal-context **read** capability but no writable long-term-memory action. Therefore no claim is made that account-level ChatGPT memory was updated. The durable, writable representation for this task is the repository hierarchy above.

## 27. Completion boundary

This experience deposition is complete when:

- startup/current rules contain the reusable guards rather than only this history file;
- this case is indexed from the Agent documentation router;
- current deployment policy owns the Mac fallback / GHCR / cache / browser-parallelism boundary;
- stale OpenEvo Mac-primary wording is explicitly demoted in its own repository rather than silently treated as current;
- volatile disk/runner/PR/process snapshots remain historical only;
- repository validation passes and the documentation change is committed/published through normal review.
