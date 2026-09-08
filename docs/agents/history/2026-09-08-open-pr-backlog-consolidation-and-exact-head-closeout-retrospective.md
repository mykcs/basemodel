# Open-PR backlog consolidation and exact-head closeout retrospective

Date: **2026-09-08**  
Status: **historical evidence, not current authority**  
Current owners: `../current/multi-pr-semantic-integration-playbook.md`, `../current/release-closeout-protocol.md`, root `AGENTS.md`

## Scope

This case records a BaseModel cleanup/integration conversation in which a large open-PR backlog was reduced to one release authority while preserving useful scientific, product, reader-contract, and Agent-governance deltas. It is deliberately not a second runbook. Current rules were promoted to the existing owners; this file keeps causal history, mistakes, and rejected approaches.

## What actually happened

The work began as a repository-wide PR closeout, not a single-PR review. Several old product/docs PRs, multiple Dependabot PRs, and two live product lines were open at the same time. The task evolved into a semantic consolidation exercise:

- clearly superseded historical PRs were closed with lineage-preserving explanations rather than merged merely because they were mergeable;
- one older closeout/governance PR still contained a unique exact-head monitoring rule, so that rule was absorbed into the surviving release line before the old PR was closed;
- an independent advisor briefing PR was absorbed into the site-wide release PR because six files were independent and the only shared file needed one narrow Reader Contract insertion;
- the repository ultimately converged to one open release PR rather than several parallel product authorities;
- the surviving release head then had to collect fresh exact-head CI because every integration mutation invalidated earlier head-bound evidence.

The closeout also exposed several execution failures that had occurred before in this repository: shell-dialect mismatch, stale local checkout assumptions, concurrent branch movement, guessed file paths, and temptation to treat PR count reduction as the objective.

## A. Durable cross-task rules extracted from the case

### A1. Backlog cleanup is authority migration, not arithmetic

**What happened:** it would have been easy to close or merge PRs based on age, mergeability, or the desire to make the open count small. Instead, at least one old PR contained a unique rule that was still absent from current authority.

**Why this happens:** PR lists encourage item-count thinking. GitHub presents every PR as a peer object even when their semantic roles differ: current release candidate, stale worker, historical authority, dependency update, or superseded experiment branch.

**Wrong assumption:** “old + mergeable” means safe to merge, or “old + apparently superseded” means safe to close without extraction.

**Pre-action check:** for every candidate record exact head/base, changed paths, current semantic owner, unique delta, current-main equivalent, and intended disposition.

**Defensive rule:** never close a stale PR until its unique semantic delta has been classified as already present, explicitly absorbed, intentionally rejected, or preserved as historical-only evidence.

**Anti-example:** closing a docs PR because newer docs exist, then discovering later that its exact-head CI state-machine rule existed nowhere else.

### A2. Converge parallel implementations into one release authority when they are one product decision

**What happened:** two live product PRs both belonged to the same Study/site reader-attention release. Keeping both open would have preserved duplicate ownership and guaranteed another shared-file conflict later.

**Why this happens:** parallel Agents create valid local improvements on separate heads, but PR topology begins to represent implementation history rather than the desired final product topology.

**Wrong assumption:** every independently useful PR deserves an independent trip to `main`.

**Pre-action check:** compare changed-file sets and semantic owners. If most files are disjoint and overlap is narrow, absorb the unique delta into the designated release authority and close the worker PR with an explicit lineage note.

**Defensive rule:** when several PRs implement one accepted product/research decision, prefer one surviving integration/release authority unless separate release timing or scientific ownership genuinely requires independence.

**Anti-example:** sequentially merging two reader-attention PRs only because both are green, then repairing the shared Reader Contract after the first merge changes the second base.

### A3. A non-fast-forward rejection means the shared-state snapshot expired

**What happened:** while an integration commit was being prepared, another Agent advanced the same release branch. GitHub correctly rejected the attempted ref update as non-fast-forward.

**Why this happens:** a long integration task spans multiple reads and writes; another actor can mutate the shared ref between them.

**Wrong assumption:** the head observed at the beginning of a patch remains an implicit lock.

**Pre-action check:** immediately before every shared ref update, re-read the remote head and compare it with the parent used to construct the candidate commit.

**Defensive rule:** on unexpected non-fast-forward, never force merely to restore the expected state. Read the new head, inspect the intervening semantic delta, rebuild the intended change on that head, and retry only as a fast-forward.

**Anti-example:** force-updating the release branch because “my commit only adds docs”; this can erase a concurrent product fix and invalidate its tests.

### A4. File names and local paths are hypotheses until read back from durable state

**What happened:** one component filename was initially remembered incorrectly and returned 404. Separately, a familiar local clone contained an unrelated dirty `package-lock.json`.

**Why this happens:** long conversations accumulate near-identical file names and multiple clones/worktrees.

**Wrong assumption:** a plausible path or familiar checkout is current authority.

**Pre-action check:** discover actual PR changed filenames or exact repository paths first; for a local checkout record root, branch, HEAD, dirty state, and intended remote ref.

**Defensive rule:** do not create fallback paths after a 404 and do not mutate an unexpectedly dirty checkout. Re-discover the durable repository object or move to an isolated/cloud-side path.

**Anti-example:** guessing the “obvious” component name after a 404, or using `git reset --hard` to make a local clone look clean.

### A5. Shell dialect is part of the execution contract

**What happened:** a heredoc/compound command was sent through the machine's default Fish shell and failed before the intended Bash semantics could run.

**Why this happens:** nested `bash -lc` feels like it should isolate shell syntax, but the outer shell may parse quoting/redirection first.

**Wrong assumption:** mentioning Bash inside a command guarantees Bash parses the whole command.

**Pre-action check:** if syntax uses heredocs, arrays, `set -euo pipefail`, process substitution, or Bash assignment/loop rules, set the execution tool's outer shell to Bash or run a standalone Bash/Python script.

**Defensive rule:** an outer-shell parser error is an execution-surface failure, not repository/server failure; retry with an explicit interpreter, not a different repository mutation.

**Anti-example:** diagnosing a Fish parse error as a broken GitHub API or repository permissions problem.

### A6. Exact-head checks are consumed by integration mutations

**What happened:** a PR that previously had successful checks could not be merged after its effective candidate identity changed; required checks returned to pending/expected on the new head.

**Why this happens:** CI statuses attach to commit identities, while humans remember them as “PR is green.”

**Wrong assumption:** once a PR has been green, semantic-only or docs absorption can retain that release authorization.

**Pre-action check:** after every candidate-head mutation, read the exact head and required statuses again. Treat previous runs only as historical evidence.

**Defensive rule:** merge authorization belongs to the final exact head plus current base/review/provider state, never to the PR number.

**Anti-example:** forcing merge because the previous head had three green checks and the new commit “only moved docs.”

## B. BaseModel/OpenEVO project-scoped lessons

### B1. Reader Contract is a semantic owner; merge it narrowly

The advisor briefing integration had six independent files and one shared `siteReaderContracts.ts` change. The safe merge was not to replace the whole shared contract file with the worker PR's older blob. The correct operation was to preserve the current site-wide contract and insert only the `study-briefing` registration.

Project rule: shared registries, research navigation, scientific state projections, and Reader Contracts are semantic owners. A worker branch containing a correct new entry may still carry stale surrounding state. Transplant the entry, not the old registry snapshot.

### B2. Dependency-update backlog should not hijack a coordinated product release

Several dependency PRs were stale relative to a rapidly moving product release; at least one had become unmergeable and one represented a major-version change. They were deliberately excluded from the reader-attention release rather than merged merely to reach zero open PRs.

Project rule: dependency updates are separate risk decisions. During a coordinated product/scientific release, stale lockfile/version PRs should be refreshed/re-generated on current main or deferred, not bundled as incidental cleanup.

### B3. Closing superseded PRs must retain lineage wording

Historical PRs were closed with explicit reasons and references to their successor/current authority. This matters in a research repository: “closed” must not be misread later as “scientifically false” or “never used.”

Project rule: distinguish `superseded`, `absorbed`, `rejected`, and `historical evidence retained`; do not use one generic “obsolete” label for all four.

## C. Transient facts intentionally not promoted

The following belong only to this historical receipt and must not become current policy or long-term memory:

- the exact open-PR count observed during this cleanup;
- the exact release-head SHA and main SHA of the day;
- which CircleCI checks were pending at one moment;
- the local temporary process IDs;
- the particular local clone path and its one dirty `package-lock.json` observation;
- the Vercel deployment URL/status snapshot;
- temporary branch names used during the closeout.

Future Agents must fetch all of these live.

## Repeated-failure audit

Several failures were already documented before this conversation:

1. **Fish vs Bash** had already appeared in earlier OpenEVO/BaseModel retrospectives and current operating principles.
2. **Moving shared heads / concurrent Agents** already had a pre-mutation guard.
3. **Exact-head CI identity** already existed in the release-closeout protocol.
4. **Historical docs vs current authority** already existed in the governance reconciliation rules.

Why did they recur? The problem was not absence of prose. The use-site trigger was incomplete: “clean up all open PRs” was not explicit in the multi-PR procedure, so an Agent could have read the right repository generally but still execute one step from stale conversational context.

The correction is therefore hierarchical rather than additive:

- root `AGENTS.md` remains the unique bootstrap;
- `multi-pr-semantic-integration-playbook.md` receives the backlog-consolidation and absorption-proof procedure;
- the existing scenario registry already routes overlapping-PR / large cross-site work, so no second backlog trigger is added;
- this dated file retains causal details and anti-examples only;
- no volatile PR/GPU/PID state is promoted.

## Retention classification

| Finding | Class | Destination |
|---|---|---|
| backlog cleanup is authority migration | A | current multi-PR playbook; existing overlapping-PR trigger remains the router |
| non-fast-forward => snapshot expired | A | current multi-PR playbook; root shared-state guard already owns general form |
| explicit Bash when syntax depends on Bash | A | already in root/operating principles; history records recurrence, no duplicate rule |
| exact-head evidence invalidation | A | already in release-closeout protocol; history records recurrence, no duplicate rule |
| narrow Reader Contract transplantation | B | current multi-PR playbook specialization + this case |
| dependency PRs separated from coordinated product release | B | multi-PR playbook |
| exact PR count/SHA/check state | C | historical receipt only |

## Historical truth boundary

This document does not claim that the PRs, SHAs, CI states, or release topology described above remain current after 2026-09-08. It records why the durable rules exist. For current execution, re-read root `AGENTS.md`, the current playbook/protocol, executable repository state, and live GitHub/provider evidence.