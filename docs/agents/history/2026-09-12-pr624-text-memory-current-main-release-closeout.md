# PR #624 Text Memory current-main / release closeout

Status: **historical case record, not current authority**
Date: 2026-09-12
Current rule owners: `release-closeout-protocol.md`, `scenario-trigger-registry.md`, `experiment-result-publication-workflow.md`

## Scope and evidence coverage

This closeout covers the accessible conversation that reconciled BaseModel PR #624 onto moving `main`, preserved newer briefing / Q17 / GDR / Vanilla SD-LoRA work, completed exact-head GitHub and Vercel acceptance, obtained explicit owner approval, and merged the PR. It also includes the final conversation-closeout pass itself.

The record intentionally omits transient branch heads, deployment IDs, Preview URLs, local worktree paths, live queue state, and one-time timestamps. Those remain in Git/provider history and are not standing policy.

## What changed the judgment

### 1. A base refresh can change authority, not only ancestry

The PR had to absorb several newer `main` changes while validation was running. Some were product/publication changes; a later refresh also carried governance and release-routing changes.

The important failure was subtle: merging those newer authority files into the candidate did **not** mean the Agent had re-read and activated the new rules. The conversation still briefly stopped at “only Vercel remains” even though the repository's final-gate request helper was actionable in the same session.

The durable repair is now in `release-closeout-protocol.md`: after base drift, inspect whether the intervening paths touched bootstrap/current governance or release-gate executables. If yes, re-read those owners before the next provider/merge action and record a compact base-refresh authority witness. The scenario router now surfaces the same activation cue.

### 2. “Continue until complete” must execute the final-gate request before polling

This was a **repeat correction**. The repository already said not to stop at pollable `pending`, but the Agent initially reported Vercel as the sole remaining item without first invoking the repository-owned persistent final-gate request.

The missing use-site distinction was between two states:

- no exact-head hosted object exists because the request has not been made yet -> **actionable topology**;
- the exact-head hosted object exists and is still running -> **pollable pending**.

The release owner now says explicitly that a merge-ready candidate on a non-deploying working ref must run `request-vercel-final-gate.mjs` before switching into poll-only mode.

### 3. Historical receipts stay historical

During reconciliation, dated validation material from an earlier candidate was no longer current. The correct model was to keep those old receipts as historical evidence and create a new dated current-main receipt, rather than rewriting the old files to look current.

This lesson already had a current owner in the publication workflow, so no duplicate policy was added. The final candidate preserved the old evidence and added a separate current receipt.

### 4. Concurrent branch/worktree drift is a stop-and-read event

A concurrent Agent advanced the same remote PR branch while local work was being prepared. The resulting non-fast-forward push rejection was treated as protection, not as a reason to force-push. The remote-only commits were inspected, their useful ancestry was retained, and the final tree was rebuilt from current `main` plus the intended Text Memory contribution.

No new current rule was needed: the existing shared-state rule already required stop-and-read behavior, and this conversation followed it.

### 5. Explicit Bash does not make content quoting safe

This closeout itself repeated a known shell mistake: a read-only search command correctly selected `/bin/bash` but still embedded Markdown backticks inside a double-quoted shell argument, allowing command substitution.

No repository mutation occurred, but this is a genuine repeat. The current scenario registry already contains the correct rule: content-bearing arguments with backticks, `$()` / `${...}`, nested quotes, or heredoc delimiters are non-trivial quoting, and explicit Bash does not make them safe. Instead of duplicating that prose, this closeout adds a regression assertion protecting the existing use-site rule.

### 6. Approval and merge are separate authorization states

The owner first granted approval and later separately requested merge. The Agent kept those two actions distinct and used expected-head protection for the merge.

No new rule was required because the release owner already treats acceptance/readiness and merge authorization as separate states.

## Coverage ledger

| Feedback / failure | Repeated? | Reusable lesson | Canonical destination | Why there |
| --- | --- | --- | --- | --- |
| Stopped with exact-head Vercel still requestable after “continue” | **yes** | distinguish actionable final-gate topology from pollable pending; request the persistent exact-head gate before waiting | `release-closeout-protocol.md` + regression test | release owner controls the final provider transition |
| `main` refresh carried newer governance/release rules but they were not immediately re-read | **yes, same activation family** | base refresh that touches authority owners requires re-read + base-refresh authority witness before next provider/merge action | `release-closeout-protocol.md` + `scenario-trigger-registry.md` + regression test | fixes activation, not wording duplication |
| Dated validation evidence became stale after current-main reconciliation | known class, handled correctly | preserve historical receipt; create a new current dated receipt | existing `experiment-result-publication-workflow.md` | current owner already exists |
| Remote PR branch advanced concurrently and rejected a push | known class, handled correctly | inspect remote semantic delta; never force-push through unknown concurrent work | existing root/shared-state rules | no new rule needed when rule worked |
| Backticks in a double-quoted Bash search argument executed substitution | **yes** | content quoting is a separate boundary from shell selection | existing `scenario-trigger-registry.md` + new regression assertion | the rule existed; failure was activation/use-site |
| Owner approval preceded explicit merge authorization | no failure; handled correctly | approval/readiness does not itself authorize merge | existing `release-closeout-protocol.md` | current rule already worked |

## Retention classification

### A. Durable rules changed in current authority

- After a current-base refresh, detect **authority drift** separately from content drift; if release/governance owners changed, re-read them before the next provider or merge action.
- A missing exact-head Vercel object on a merge-ready candidate is actionable until the repository-owned persistent final-gate request has actually been made.

### B. Existing durable rules confirmed, not duplicated

- Historical receipts remain historical; new current evidence gets a new dated receipt.
- Unknown concurrent branch/worktree state is stop-and-read, never force-overwrite.
- Explicit Bash does not make nested content/backtick quoting safe.
- Owner acceptance and merge authorization are distinct.

### C. Temporary state intentionally not retained

Do not promote from this conversation into standing policy or long-term memory:

- exact PR/base/head commit IDs;
- deployment IDs, Preview/share URLs, live provider states, or queue timing;
- local checkout/worktree paths;
- one-time test counts or timestamps;
- temporary PR-body wording used only during reconciliation.

No new account-level ChatGPT memory is required. These lessons are BaseModel-specific and are now stored in repository authority/history.

## Future-Agent test

A new Agent starting only from root `AGENTS.md` should now be able to:

1. route exact-head / moving-main work into the scenario registry and release-closeout owner;
2. notice when a base refresh changed governance or gate-owner files and re-read them before continuing;
3. distinguish “final gate not requested yet” from “provider object exists and is still pending”;
4. preserve dated evidence instead of rewriting history;
5. stop on unexpected concurrent branch movement instead of force-pushing;
6. keep approval separate from merge authorization;
7. avoid shell command substitution when the payload is content even after Bash is explicitly selected.

If those current owners later change, live/executable truth and the updated current owner supersede this historical case.
