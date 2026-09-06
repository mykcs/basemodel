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
- preserving a dated migration document under a current-looking path without making its historical status impossible to miss.

The final architecture avoided those traps by separating source, recovery images, mutable local state, CI authority, and deployment authority rather than trying to make one layer serve every purpose.

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
- browser-performance changes must preserve the full acceptance contract.

### B. Project-level lessons

Keep these in BaseModel/OpenEvo CI runbooks and this case:

- BaseModel ordinary CI eventually moved to cloud-side independent browser shards with one Playwright worker per shard; the Mac path became manual fallback.
- The BaseModel/OpenEvo runner bundles have repository-owned start/stop/doctor/reconcile/housekeeping scripts and intentionally isolated containers.
- Shared Mac BuildKit pruning needs awareness of every runner that shares the OrbStack daemon.
- Historical Mac activation/cutover documents must not be read as current provider authority after later migrations.

### C. Transient state

Do **not** promote these into current policy or account memory:

- exact disk free-space snapshots;
- current Docker image/container byte counts;
- current PR numbers/heads/check queues as live authority;
- current runner `online/busy` state;
- temporary worktree paths;
- temporary benchmark containers;
- current process IDs, elapsed times, and one-off cache totals.

They remain below only where useful to explain causality.

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

Historical numbers in this section are evidence only. Do not use them as today's disk or provider state.

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

## 17. Scientific-semantics boundary

This conversation was operational/CI work. It deliberately did **not** use the RTX 5090 research server as a convenient CI fallback and did not change OpenEvo Stage1/Stage2 task identity, sampling, seeds, model state, reward, eligibility, final panel, or GPU scheduling semantics.

The reusable principle is broader:

> Engineering optimization may change placement, caching, CI provider, or test scheduling only when the scientific/acceptance contract is unchanged and proved unchanged.

A browser test worker count is not scientific sampling, but weakening browser coverage to obtain a faster green check would still alter the product acceptance semantics. Likewise, routing ordinary CPU CI to the scientific GPU server would change resource isolation even if no experiment code changed.

## 18. Repeated-error audit

Several failures had already appeared in earlier BaseModel/OpenEvo retrospectives:

| Repeated issue | Why prior deposition was insufficient | This closeout's fix |
| --- | --- | --- |
| Fish/Bash mismatch | detailed cases existed, but an execution tool still defaulted to Fish and the rule was not always activated at command construction | keep explicit-shell guard in root startup rules and current operating principles; treat shell as runtime identity |
| dirty/stale worktree use | historical cases documented moving-main and worktree contamination, but convenience still pulled work toward long-lived dirty checkouts | current operating principles already route to isolated worktrees; this case adds exact remote/blob verification before cleanup |
| queued self-hosted CI mistaken for stuck | queue diagnosis lived mainly in dated retrospectives | Mac fallback trigger now requires queue/runner/child-process readback before cancellation |
| provider-role confusion | old Mac/Cloudflare/CircleCI cases remained discoverable and could look operational | current provider owner is explicit; old activation docs must be marked historical/manual fallback |
| cleanup from size/reclaimable output | prior disk-pressure lessons focused on server storage, not Mac runner fallback semantics | Mac trigger now owns reference/liveness/recovery classification and forbids size-only deletion |
| “upload” treated as backup | archive rules existed mainly for scientific artifacts | Mac trigger/deployment policy now require clean-image classification plus private GHCR immutable digest readback |

The recurring meta-failure was **information level**: a lesson placed only in a deep incident file was not guaranteed to trigger during a superficially different task. The fix is not another giant retrospective. It is the combination used here:

```text
root AGENTS invariant
-> scenario trigger
-> current deployment owner
-> detailed historical case
-> executable housekeeping / CI architecture
```

## 19. Durable memory candidates

Cross-conversation memory candidates from this case are intentionally narrow:

- the owner's Mac is a control-plane device as well as a possible fallback runner, so ordinary CI should prefer cloud execution and avoid persistent Mac contention;
- the owner prefers free/cloud CI when it preserves the acceptance contract and does not use the scientific GPU server;
- explicit Bash should be selected for Bash semantics;
- dirty concurrent worktrees must not be reset/rebased merely for convenience;
- current provider/experiment authority must be re-read instead of inferred from a historical retrospective;
- backups must be identity-verified before local destructive cleanup.

This execution environment exposes personal-context **read** capability but no writable long-term-memory action. Therefore no claim is made that account-level ChatGPT memory was updated. The durable, writable representation for this task is the repository hierarchy above.

## 20. Completion boundary

This experience deposition is complete when:

- startup/current rules contain the reusable guards rather than only this history file;
- this case is indexed from the Agent documentation router;
- current deployment policy owns the Mac fallback / GHCR / cache / browser-parallelism boundary;
- stale OpenEvo Mac-primary wording is explicitly demoted in its own repository rather than silently treated as current;
- volatile disk/runner/PR/process snapshots remain historical only;
- repository validation passes and the documentation change is committed/published through normal review.
