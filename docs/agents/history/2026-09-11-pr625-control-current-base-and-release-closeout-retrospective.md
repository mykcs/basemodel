# PR #625 control, current-base, and release-closeout retrospective

Status: **historical evidence; not current policy**
Date: 2026-09-11
Current rules live in `../current/deployment-policy.md` and `../current/multi-pr-semantic-integration-playbook.md`.

## Scope

This record preserves reusable reasoning failures from the PR #625 closeout. It intentionally omits temporary Preview URLs, worktree paths, ports, PIDs, provider-pending snapshots, and other one-run machine state.

## What actually mattered

### 1. A green control PR is only a control after execution-shape matching

PR #625 changed focused-CI/planner code and failed all browser shards, so it was tempting to blame the new focused selection logic. PR #628 was green nearby, but that comparison became meaningful only after checking what both runs actually executed.

The candidate's planner change itself forced a fail-closed **full** browser matrix. The control also ran the complete relevant browser matrix. The shared failing test family then isolated the problem to reader typography in the integrated Q17 page, not to focused route selection or shared browser infrastructure.

Reusable rule: compare **actual provider/workflow/risk mode/test identities**, not PR intent or filenames, before using another PR as causal control evidence.

### 2. “Current with main” must be proved by live ancestry

After the candidate absorbed newer `main`, GitHub PR metadata could still expose the base SHA recorded earlier in the PR lifecycle. Treating that cached field as the current-base truth produced a false stale rejection in the final-gate requester.
The durable proof is the live relation between `main` and the exact head: the PR still targets `main`, live `main` is the merge base, the head is not behind, and the comparison is ahead/identical. The final-gate requester was corrected to use that relation and to re-check it after arming the base ref.

Reusable rule: exact-head release identity is graph/provenance state, not one cached PR metadata field.

### 3. Planned worker-PR disposition is not live PR state

During closeout, the integration plan said older worklines were absorbed/superseded. That wording was almost turned directly into close actions. A live read showed that two named predecessors were already merged historical PRs; only the actually open duplicate workline needed closure.

This repeated an older failure pattern: conversational or planning state was allowed to stand in for current GitHub state. The fix therefore belongs at the worker-PR closeout use-site: read `state` and merge record immediately before mutating the PR.

### 4. Existing shell rules still have to be executed at the use-site

During this closeout, a nested Bash/Python heredoc was made more complicated than necessary and failed during parsing before the repository write executed. The worktree stayed clean. Root `AGENTS.md` already says that non-trivial quoting should move into a standalone, syntax-checked script, so no duplicate shell policy was added.

Reusable rule: when a known rule already exists and the failure is non-use rather than missing knowledge, record the miss and follow the existing rule instead of adding another copy.

## Coverage ledger

| Feedback / failure | Repeated? | Reusable lesson | Canonical destination | Why there |
| --- | --- | --- | --- | --- |
| Candidate changed focused CI, so failure was initially at risk of being blamed on focused selection | No | Match actual execution shape before using a green PR as control evidence | `multi-pr-semantic-integration-playbook.md` §4.2 | Integration/CI attribution logic |
| Final gate rejected an actually current-base head because cached PR base metadata lagged | No | Prove current-base by live ancestry/compare and re-check after arming gate base | `deployment-policy.md` exact-head/current-base section | Final-candidate identity and Vercel gate semantics |
| Planned “absorbed/superseded” labels were almost applied to PRs already merged | **Yes** | Re-read live PR state/merge record immediately before closeout mutation | `multi-pr-semantic-integration-playbook.md` §9 | Concrete mutation point where remembered status escaped |
| Complex nested shell quoting failed despite an existing standalone-script rule | **Yes** | Use the existing root shell rule at the command site; do not duplicate it | root `AGENTS.md` | Knowledge existed; execution discipline failed |
| Temporary Preview/build/port/worktree/provider state accumulated during diagnosis | No | Keep it out of standing rules | intentionally not persisted | No durable predictive value |

## Future-Agent test

A future Agent starting from root `AGENTS.md` reaches the overlapping-PR/release bundle through `docs/agents/README.md`, then the multi-PR playbook and deployment policy. Before diagnosing a multi-shard failure it now has an explicit control-matching check; before final-gate arming it has an explicit ancestry check; before closing worker PRs it has an explicit live-state read.

The most likely repeated error was trusting remembered/planned PR status. The new rule is intentionally located at the mutation point instead of adding another generic reminder.

The shell quoting miss was also repeated, but the canonical rule was already explicit. The corrective action was to use a standalone syntax-checked script during this closeout, not to add a second mutable shell policy.
