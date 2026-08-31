# 2026-08-31 CI / PR stability retrospective: red checks, moving heads, and safe closeout

Status: **historical engineering retrospective**
Scope: `mykcs/basemodel` CI / PR integration during the cross-repository BaseModel + OpenEvo cleanup.
Current authority remains `docs/agents/current/deployment-policy.md`, `release-closeout-protocol.md`, repository code/tests, and live provider state.

## Why this retrospective exists

Several unrelated PR states all looked like “CI is broken”: runner bootstrap failure, branch drift, stale prose, an already-incorporated PR, and a PR reopened by another Agent. Treating all of them as one CI defect would have caused unnecessary rebases, duplicate provider builds, and unsafe merges.

The durable lesson is:

> **A red or blocked PR is a symptom, not a diagnosis. Classify the failure layer first, repair only the owning layer, and accept only exact-current-head evidence.**

This incident was investigated together with `mykcs/openevo-experiment`; that repository keeps the experiment-side counterpart in its CI topic.

## What actually happened in BaseModel

### 1. A required check failed before repository code could run

The self-hosted Mac runner had a hook/bootstrap defect. The job could fail before checkout, so the failure looked like repository CI even though the candidate source tree had not been exercised.

```text
runner/bootstrap fails before checkout
!= candidate code/test failure
!= Vercel application failure
```

The runner defect was repaired separately. Later exact-head self-hosted runs passed. Changing research/UI code to “fix CI” would have attacked the wrong layer.

### 2. CI relevance and deployment relevance were different

A docs/governance-only PR still needed the required self-hosted check long enough to classify the diff, but it did not need a Vercel Preview build. A source/UI PR can require both repository validation and deployment evidence when its risk class says so.

Future Agents must not use “Vercel did not build” as proof that CI was skipped incorrectly. First determine whether the exact diff is deploy-relevant under executable policy.

### 3. A mergeable PR could still contain stale reasoning

One documentation PR was structurally mergeable but still described another PR as open/pending after that result had entered `main`. Synchronizing with current `main` produced no code conflict, yet the prose itself needed correction before merge.

```text
Git mergeability = structural compatibility
fresh PR body/docs = semantic compatibility
```

A green check does not validate stale narrative state.

### 4. A closed PR was later reopened with new work

During final inventory, a previously closed PR was reopened by another Agent and received additional reader-facing result work. Its old classification immediately became stale.

The correct response was to re-read the new head, check the new exact-head self-hosted CI, and only then merge.

> **PR state, mergeability, head SHA, checks, and even whether a PR is open are volatile facts. Re-read them at the decision boundary.**

## Friction patterns and lessons

### Red badge without failed phase

Bad reasoning:

```text
PR is red -> source must be bad -> change source until green
```

Correct reasoning:

```text
PR is red
-> identify exact head
-> inspect the first failing phase
-> classify owner: runner / checkout / deterministic test / browser / provider / branch state
-> repair only that owner
```

If checkout never happened, application code is not yet implicated.

### Old green check after the head moved

A check belongs to the SHA it tested. A later merge from `main`, documentation sync, conflict repair, or another Agent push creates a different candidate.

Use:

```text
read live PR head
-> require green check for that head
-> re-read PR head immediately before merge
-> merge with expected-head guard
```

Do not cite an older successful run as exact-head proof.

### Local harness state mistaken for candidate failure

A clean temporary worktree did not contain `node_modules`, so a focused Vitest command initially failed with missing package/config errors. The candidate source was not the problem; the local validation environment was incomplete.

Separate dependency/bootstrap absence in a disposable worktree from deterministic repository-test failure after dependencies are available.

### “Behind main” treated as automatically dangerous

Being behind `main` is a freshness signal, not proof of conflict. In this incident a docs/governance branch merged current `main` cleanly; the actual semantic repair was a stale statement about another PR.

Use merge-base/compare evidence and a trial merge before deciding a branch must be rebuilt.

### One conversation assumed to own the PR

Multiple Agents were modifying related branches. A PR could change between inspection and merge. The protection was executable expected-head checking, not social coordination alone.

If the guard rejects the merge, re-read current state. Never force the old conclusion through.

## BaseModel closeout runbook

When the user reports “CI/PRs are broken”:

1. Read current deployment/CI authority and executable workflow/classifier files.
2. List live open PRs; do not infer the set from memory.
3. For each PR, record base, head SHA, draft/open state, mergeability, and required checks.
4. Inspect the first failing step, not just the final badge.
5. Classify the failure: runner/bootstrap, deterministic source/test, browser/runtime, Vercel/provider, stale/conflicting branch, superseded PR, or moving-head concurrency.
6. Repair the owning layer only.
7. Synchronize with current `main` when needed; separately audit stale prose and PR metadata.
8. Run focused local validation, then the required exact-head check.
9. Re-read live head immediately before merge.
10. Merge with expected-head protection; if it fails, restart from live state rather than force-pushing.
11. After merge, verify lineage and close/supersede duplicate PRs explicitly.

## What not to do

- Do not change product/research semantics to repair runner or provider infrastructure.
- Do not request Vercel builds for docs-only changes merely to obtain a green badge.
- Do not treat `mergeable` as proof that the PR description is current.
- Do not treat `behind main` as proof that a conflict exists.
- Do not reuse a check from an older SHA as merge evidence.
- Do not assume a closed PR stays closed while other Agents are active.
- Do not force-push over a moving branch because earlier local validation passed.

## Durable mental model

PR acceptance is an evidence join:

```text
candidate identity = current PR head SHA
structural state   = mergeable against current intended base
integration proof  = required check green for the same candidate
semantic freshness = PR/docs describe current repository reality
release proof      = exact deployment/browser evidence when required
```

Only when the required terms refer to the same current candidate should the PR be merged.

## Cross-repository counterpart

The experiment-side half of the same incident is recorded in [`mykcs/openevo-experiment/docs/infrastructure/ci/CI_PR_STABILITY_FAIL_CLOSED_RETROSPECTIVE_2026-08-31.md`](https://github.com/mykcs/openevo-experiment/blob/main/docs/infrastructure/ci/CI_PR_STABILITY_FAIL_CLOSED_RETROSPECTIVE_2026-08-31.md). Read both when a BaseModel publication PR and an OpenEvo evidence/experiment PR appear to fail at the same time.
