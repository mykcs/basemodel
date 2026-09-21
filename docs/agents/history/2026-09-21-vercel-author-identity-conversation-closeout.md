# Vercel author identity repair — conversation closeout

Status: **historical conversation lessons**
Date: **2026-09-21**
Repository: `mykcs/basemodel`

Current rules remain under `docs/agents/current/`, root `AGENTS.md`, and executable scripts. This file does not create a second mutable authority.

## Scope

This closeout covers the accessible conversation from the owner-provided Vercel screenshots through:

- diagnosis of `GitHub user not found / Vercel Account Unavailable`;
- repair of the effective Git author identity;
- PR #764 final-gate protection and merge;
- the decision not to batch unrelated stale PRs into that release;
- publication of the reusable engineering case through PR #770;
- the release friction encountered while publishing that case.

The detailed incident mechanics already live in:

- `docs/agents/history/2026-09-21-vercel-github-author-identity-mismatch-case.md`.

This closeout preserves only additional process lessons and repeated-failure evidence.

## What was newly learned

### 1. A valid global Git identity is not enough

The visible provider symptom came from commit metadata produced by a repository-local Git configuration that overrode the valid global identity.

The durable diagnostic chain is:

```text
provider warning
-> exact commit
-> GitHub commit author mapping
-> git config origin
-> effective Git author
```
The reusable implementation already landed before this closeout:

- the machine-side BaseModel Git identity was repaired;
- `scripts/request-vercel-final-gate.mjs` now refuses a candidate whose primary author does not map to GitHub;
- the historical engineering case is indexed from the Agent docs and provider-failure runbook.

No second author-identity gate is added here because the concrete failure mode is already covered by an executable use-site check.

### 2. Primary commit author and message trailers are different evidence

A commit message may contain a historical `Co-authored-by: ... <agent@openai.invalid>` trailer while the primary commit author is correctly mapped to GitHub.

Future diagnosis must inspect GitHub's commit object rather than grep commit-message text and infer provider identity from that alone.

This distinction is already captured in the engineering case, so it is not copied into another current policy.

## Repeated mistakes / activation failures

### A. Isolated-worktree dependency state was initially treated too casually

During local validation of the #764 repair, the isolated worktree had no dependency tree. A dependency symlink from another checkout was reused first, and the resulting check reported a missing `katex` module.

That looked like a candidate failure, but it was an execution-route/setup mismatch. Running a lockfile-faithful `npm ci` in the isolated worktree removed the false signal and the repository gate passed.

This failure class was already known. Current `project-agent-operating-principles.md` explicitly says that a clean worktree without `node_modules` is an environment/setup gap and dependency state must be normalized before classifying a compile failure.

So this conversation **repeated a known mistake**. The fix is not another rule; it is a use-site witness:
- trigger: isolated worktree starts without dependencies, or shared dependencies may not match the worktree lockfile;
- current owner: `docs/agents/current/project-agent-operating-principles.md`;
- checked artifact: worktree lockfile + actual local dependency installation;
- allowed next action: install/reuse only lockfile-compatible dependencies, then rerun the check;
- invalidation cue: the same module/type failure remains after dependency state is normalized.

### B. Exact-head green evidence was used once without a fresh merge-window read

PR #770 obtained green exact-head Public PR CI and Vercel acceptance. Before the first merge attempt, however, another independent PR advanced `main`.

The merge was rejected with the required Vercel check reported as expected. The historical exact-head Vercel success was real, but it was no longer current-base merge evidence.

The recovery was correct:

```text
re-read live main
-> prove the new main movement did not overlap the closeout files
-> rebase the same closeout PR
-> rerun Public PR CI
-> request a fresh exact-head Vercel gate
-> merge with expected head
```

This also **repeated a known failure class**. Current `release-closeout-protocol.md` already requires one atomic merge-window witness immediately before merge.

No new merge rule is added. The activation witness is:

- trigger: all required checks appear green and a merge mutation is about to happen;
- current owner: `docs/agents/current/release-closeout-protocol.md` §7.0;
- checked artifact: live `main`, PR head/base, required contexts, provider exact SHA/state, reviews, mergeability;
- allowed next action: guarded merge only while the tuple is unchanged;
- invalidation cue: any movement of `main`, head, required-check owner/state, or provider identity.

## A decision that should remain deliberate

When the owner asked whether other open PRs should be merged together, the fresh author-identity fix was not used as an excuse to sweep the backlog.
The other PRs had independent semantics, stale bases, or separate acceptance needs. They were classified for separate stale-PR governance instead of being batched into #764.

That follows the existing `multi-pr-semantic-integration-playbook.md` rule:

```text
a clean release window is not permission
to hitchhike unrelated or stale PRs into main
```

No new policy is needed.

## Coverage ledger

| Feedback / failure | Repeated? | Reusable lesson | Canonical destination | Why there |
| --- | --- | --- | --- | --- |
| Vercel showed `GitHub user not found` for `agent@openai.invalid` | New concrete incident | inspect effective Git identity and GitHub account mapping; reject unmapped deployable heads before provider execution | executable final-gate guard + provider-failure runbook + dated engineering case | prevention belongs at the release use site; causality belongs in history |
| Valid global Git config masked a repository-local override | New concrete incident | inspect config origin, not only one config scope | dated engineering case | detailed Git precedence explanation is historical troubleshooting evidence |
| Shared dependency tree produced a false missing-module signal in an isolated worktree | Yes | normalize dependency state before classifying candidate errors | `project-agent-operating-principles.md` | current rule already exists; closeout records activation failure only |
| Green exact-head checks were followed by a merge attempt after `main` moved | Yes | capture the atomic live merge tuple immediately before merge | `release-closeout-protocol.md` §7.0 | current rule already exists; no duplicate reminder |
| Owner asked whether other PRs should ride the same merge | No failure | classify independent/stale PRs separately; do not batch for convenience | `multi-pr-semantic-integration-playbook.md` | this is existing PR-governance authority |
| Owner asked for the engineering modification to become a reusable case | No | historical case + early index + current-runbook link | #770 case + README + provider runbook | makes the lesson discoverable without making history current authority |

## Necessity filter

No additional helper, schema, gate, router, or watchdog is justified by this closeout.

The three relevant risks are already covered:

1. unmapped deployable commit author -> final-gate author-mapping check;
2. isolated-worktree dependency drift -> current execution principles;
3. stale merge evidence after moving `main` -> atomic merge-window protocol.

Adding another mechanism would duplicate authority rather than reduce risk.
## Future-Agent test

A new Agent starting from root `AGENTS.md` can reach the important protections in one or two jumps:

1. provider/release task -> scenario registry / deployment owners;
2. provider identity failure -> provider-failure runbook -> author-identity engineering case;
3. final candidate -> `request-vercel-final-gate.mjs` author-mapping check;
4. isolated worktree -> project operating principles dependency-state rule;
5. pre-merge -> release closeout protocol atomic merge-window witness;
6. multiple open PRs -> multi-PR semantic integration playbook.

The historical case is clearly labeled historical, while the executable/current rules remain the authority.

The two repeated mistakes are now explicitly named as **activation failures of existing rules**, not treated as missing-policy problems.

## Temporary state deliberately not retained

This closeout does not promote any of the following into standing policy:

- current `main` SHA;
- PR head/base SHAs;
- Vercel deployment IDs or Preview URLs;
- temporary worktree paths;
- one-time CI run IDs or durations;
- momentary open/closed/mergeable PR states;
- one-time tool/session/process state.

GitHub history retains the relevant implementation receipts when reconstruction is needed.

## Long-term memory boundary

No new account-level ChatGPT memory is required for this closeout.

The durable knowledge is project-specific and is now stored in the BaseModel repository at the correct levels: executable guard, current runbooks, indexed historical case, and this closeout record.
