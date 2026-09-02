# Server storage audit and public snapshot retrospective — 2026-09-03

Status: **historical incident / lessons record; not current operating authority**

Current behavior is owned by `../current/server-storage-pressure-audit-sop.md`, `../current/project-agent-operating-principles.md`, `../current/branch-and-pr-conventions.md`, `../current/release-closeout-protocol.md`, the scenario trigger registry, executable repository configuration/tests, and live server/provider state.

This record preserves what happened during the shared-server cleanup + BaseModel server-page refresh conversation so future Agents can understand why those current rules exist. Snapshot numbers, PR/CI/deployment states and temporary paths mentioned here are historical only.

## What made this conversation unusually instructive

The work crossed four boundaries that are easy to conflate:

1. shared scientific storage, where a wrong deletion can destroy or delay experiments;
2. public attribution/privacy, where operational identities must not leak into the site;
3. local Git/worktree/shell execution, where environment errors can masquerade as source failures;
4. exact-head Preview/required-CI/Production release, where “looks green” is not the same as accepted and merged.

The largest lesson is that a retrospective is not durable merely because it exists. Several failures below had already appeared in older history files. They recurred because the rule was buried in history or activated too late. The corrective action was to promote triggerable rules into current SOP/entry/release layers.

## Repeated failure 1 — “not currently used” was incorrectly treated as deletion authority

### What happened

During an earlier storage-reclaim pass, a 3B model directory was deleted after observing that it was not currently mounted. The owner corrected the Agent: the model was still part of a future planned working set. A later instruction explicitly protected the 3B temporary/download/cache workset because another window needed it.

### Why it happened

The decision model was too local in time: process/mount liveness was treated as the whole definition of “in use.” Scientific workflows also have **future dependencies, frozen inputs, rollback points and concurrent-agent ownership**.

### Wrong assumption

```text
no open process / mount now -> safe to delete
```

### Durable rule

Before any storage mutation, prove all of: ownership, current **and next planned** working-set status, process/container/orchestrator references, scientific retention role, and exact recoverability. Any unknown answer means hold/inspect.

### Anti-example

A model can be idle for an hour while the next experiment stage is preparing inputs. Deleting it may look like a reversible 6 GB cleanup but can force a large re-download, invalidate offline assumptions, or break another Agent window.

## Repeated failure 2 — Fish/Bash semantics were documented repeatedly but still escaped

### What happened

Compound local commands and Python/heredoc patch scripts were sent through a default `fish` execution surface while assuming Bash syntax. They failed before mutation. Similar failures were already recorded in multiple 8/28–8/31 retrospectives.

### Why it happened

The lesson lived mostly in historical cases. The Agent remembered “shell can be weird” only after the parser failed instead of treating shell choice as a precondition.

### Durable rule

If syntax relies on Bash (`VAR=value`, `set -euo pipefail`, arrays, loops, heredocs, process substitution), explicitly invoke `/bin/bash`. For multi-layer SSH or scripts containing regex/Unicode, prefer a single explicit remote interpreter (`ssh host 'bash -s'`, `python3 -`, or an uploaded script) instead of nested local/remote quoting.

A parser error before mutation is an **execution-surface failure**, not evidence that the repository, server, or scientific run is corrupt.

### Anti-example

Do not keep escaping another layer of quotes in `fish -> ssh -> bash -> python heredoc` because the command is “almost working.” Collapse the layers first.

## Repeated failure 3 — clean worktree without dependencies was misread as a test failure

### What happened

Isolated worktrees correctly protected unrelated dirty checkouts, but the first validation command failed because the new worktree had no `node_modules`. This exact class had already appeared in earlier BaseModel retrospectives.

### Why it happened

Git isolation and dependency installation were treated as one property. A worktree contains the Git tree; it does not automatically contain ignored package installations.

### Durable rule

Classify “package/tool absent from this worktree” separately from source/test failure. Reuse a known lockfile-compatible local dependency tree or install from the lockfile locally. Remove temporary dependency symlinks before commit. Never spend a hosted Preview just to discover missing local packages.

## Failure 4 — the first storage inventory saw only one home namespace

### What happened

A read-only `du` from one namespace exposed only one home directory even though the shared server had multiple identifiable users. Treating that result as complete would have produced a false public ranking.

### Why it happened

The filesystem view was assumed to be globally complete. On the host, user homes may be visible through bind mounts in authorized development containers even when the current namespace cannot enumerate them all.

### Durable rule

A surprisingly small user count is a **completeness failure**, not a result. Enumerate authorized bind-mounted home roots, run read-only `du` in namespaces that can see them, and publish only after the expected topology is reconciled. Never infer “all users” from one namespace.

## Failure 5 — Docker attribution needs two separate concepts

### What happened

The public page evolved from “home sizes + a shared remainder” to a more precise method: home size plus uniquely attributable container writable layers per anonymous account, while shared images/build cache/ambiguous writable layers remain separate.

The first storage SOP still contained the older formula `df used - sum(home)`, which no longer matched the page methodology.

### Why it happened

A living SOP was created while the measurement method was still evolving, and the formula was not updated when page attribution became more precise.

### Durable rule

Use these buckets:

```text
account attributable total = home + uniquely attributable SizeRw
unattributed Docker writable layers = SizeRw with no reliable owner
shared/system used = df used - attributable totals - unattributed Docker writable layers
```

Shared image layers are not per-user usage merely because image/container names resemble one account.

### Anti-example

Do not charge a multi-gigabyte shared image entirely to the user whose container label happens to mention that image.

## Failure 6 — one stale Docker snapshot can break daemon-wide summaries

### What happened

`docker system df` failed because a historical image snapshot record was missing. A large batched `docker inspect --size` could also fail as one command even when most containers were readable.

### Wrong reaction to avoid

“Fix Docker” by pruning images/containers or resetting daemon state just so the audit command returns cleanly.

### Durable recovery

Keep the audit read-only. Record daemon-wide summary as unavailable; retry `docker inspect --size` in smaller batches/per container; count unreadable objects as unknown; continue using the measurements that are independently valid. Tool health and storage ownership are separate questions.

## Failure 7 — public anonymity must include the owner

### What happened

An earlier page version anonymized other accounts but still singled out one row as “our account.” The owner explicitly required uniform labels such as 用户一 / 用户二 and no real-identity mapping.

### Durable rule

Every account follows the same snapshot-local ranking. Do not expose “ours,” a stable pseudonym, or the mapping between rank and real account. Regenerate numbering from the current attributable totals on every snapshot.

The page may explain what is public and what is deliberately withheld, but that explanation must not itself reveal the mapping.

## Failure 8 — chained string replacement can silently corrupt factual snapshots

### What happened

While refreshing many repeated numbers in one component, broad string replacements left a stale old `used` value in one explanatory sentence and accidentally changed one reserve/rounding value because the same numeric token appeared in another context.

### Why it happened

The page stored a snapshot across multiple prose/ARIA/table locations. A replacement operation knew strings, not semantic fields.

### Durable rule

For factual snapshot refreshes, prefer structured snapshot values or exact field-scoped edits. After any textual patch, sweep for the previous timestamp and all old used/free/percent/bucket numbers, and recompute bucket arithmetic before browser acceptance.

### Anti-example

“Replace every `22.2` with the new third user's total” is unsafe when `22.2` also represents filesystem reserve elsewhere.

## Repeated failure 9 — Preview branch eligibility was known but checked too late

### What happened

A user-facing server-page change that required exact-head Preview was first placed on `docs/**`. The commit carried `[vercel-preview]`, but no Preview appeared because the branch prefix itself was not deployment-eligible. The same exact head then had to be pushed on a `research/**` branch and the first PR closed/reopened under the correct branch.

### Why it happened

`branch-and-pr-conventions.md` already documented the rule, but it was consulted after branch creation. The rule was correct; the trigger timing was wrong.

### Durable rule

Decide the acceptance path **before creating the branch**. If exact-head hosted Preview is required, inspect executable branch eligibility first and choose the deployment-eligible prefix. `[vercel-preview]` is necessary on the accepted head but cannot make an ineligible branch eligible.

“No Preview” should first be classified as policy/eligibility vs provider failure.

## Failure 10 — moving main + rebase `ours/theirs` semantics can restore stale truth

### What happened

While the branch was being validated, `main` advanced with another server-page refresh. The conflict had to preserve the newer attribution model from `main` while applying the new anonymity/SOP work. An initial script selected the wrong side because `ours/theirs` intuition from an ordinary merge was applied during rebase.

### Durable rule

Do not use the words `ours` or `theirs` as semantic authority during rebase. Inspect the actual commit/blob, or explicitly materialize `origin/main:path`, then transplant the intended contribution. For public research/infrastructure facts, newest authoritative content wins over an older feature branch's whole-file copy.

If an automated conflict script aborts, verify `git status` and file bytes before staging or continuing.

## Failure 11 — CI `queued` / long browser acceptance was repeatedly at risk of being called stuck

### What happened

The repository has one required self-hosted browser runner. A PR check could remain queued while a valid `main` post-merge CI occupied the runner, and browser acceptance itself could run much longer than local six-worker Playwright because the runner uses a constrained worker policy.

### Durable rule

Before declaring CI stuck or canceling anything:

1. read branch protection to identify the required check;
2. inspect the currently running workflow/job and runner owner;
3. do not cancel unrelated `main`/other-PR work just to advance this PR;
4. once running, use live job steps/process activity only to diagnose progress versus hang;
5. still require the official check to reach SUCCESS before merge.

Cancel only obsolete runs from superseded heads of the same work when safe.

## What was intentionally not promoted to current policy

The following are historical/transient and must not become durable facts:

- specific PIDs, container IDs, runner process IDs, or temporary ports;
- the exact free-space value at any point in the conversation;
- the current identity behind User 1/User 2/etc.;
- current PR numbers, CI run IDs, branch SHA, Preview URL or deployment ID as future authority;
- one moment's GPU/process occupancy;
- the temporary 3B recovery/download state.

Those facts are useful only to reconstruct this incident. Future Agents must re-measure live state.

## Why earlier retrospectives did not prevent recurrence

Three mechanisms failed:

1. **Placement:** shell/worktree lessons were buried in dated history instead of current operating principles.
2. **Activation timing:** branch eligibility existed in current policy, but no high-salience pre-branch guard forced it to be read before branch creation.
3. **Drift:** the storage SOP preserved an older attribution formula after the live page adopted a more precise Docker writable-layer split.

The fix is not “write another bigger retrospective.” The fix is to put a concise trigger in root/current policy, keep the detailed procedure in one current owner, protect machine-checkable invariants with tests, and leave this dated file as explanation only.

## Current authority after this incident

Use, in order:

1. current user instruction;
2. live server/GitHub/Vercel state and executable repository truth;
3. `server-storage-pressure-audit-sop.md` for storage measurement/mutation;
4. `project-agent-operating-principles.md` for shell/worktree/tool boundaries;
5. `branch-and-pr-conventions.md` + `release-closeout-protocol.md` for branch/Preview/CI/merge/Production;
6. `scenario-trigger-registry.md` for automatic activation;
7. this file only for historical rationale and anti-examples.
