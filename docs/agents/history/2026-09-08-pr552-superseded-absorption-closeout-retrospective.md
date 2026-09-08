# PR #552 superseded absorption closeout — experience deposition

Recorded: **2026-09-08**  
Status: **historical engineering record; not current release authority**

Current owners for the durable rules are:

- [`../current/project-agent-operating-principles.md`](../current/project-agent-operating-principles.md) — live shared-state refresh, durable-state reconstruction, A/B/C retention, repeated-correction handling;
- [`../current/multi-pr-semantic-integration-playbook.md`](../current/multi-pr-semantic-integration-playbook.md) — semantic disposition of stale/superseded PRs and absorption into one live integration line;
- [`../current/release-closeout-protocol.md`](../current/release-closeout-protocol.md) — exact-head acceptance and merge-window evidence;
- root [`../../../AGENTS.md`](../../../AGENTS.md) — bootstrap routing and stale-governance authority-topology guard.

This file preserves what actually happened in the PR #552 closeout conversation. It must not be used to infer that the PRs, SHAs, checks, or branches named here still have the same live state later.

## 1. What the task actually contained

The conversation was narrowly about BaseModel PR #552. It did **not** involve GPU scheduling, experiment execution, server storage, Docker cleanup, SSH, shell dialect, Python environments, local worktrees, or scientific-result changes. Those classes were checked for relevance and are intentionally absent rather than fabricated to make the retrospective look more comprehensive.

The owner supplied a remembered starting state: PR #552 was said to be open, non-draft, mergeable at exact head `144955e08c8a27e031c936124c17d7833aecffc0`, with deterministic CI and both browser shards successful, and previously left unmerged only because merge had not been authorized. The requested action was to re-check current `main`/head drift and overlap, then finish the docs-only closeout if release conditions still held, without creating an unnecessary Preview or changing reader-facing code.

The first live read changed the task:

- PR #552 was already **closed, unmerged**;
- its body explicitly classified it as **absorbed into PR #557** and said not to revive or merge the stale branch independently;
- #552's exact head remained `144955e08c8a27e031c936124c17d7833aecffc0`;
- the three required CircleCI contexts on that exact head were still successful;
- current `main` had advanced from #552's old base `51c6228296658b6caaab1b23affbd2b5b91b7a28` to `ded8b5d0a2ea7f38bb6f5d0769dc7383e85a3227` via #556;
- #556's changed files were disjoint from #552's three docs files;
- #557 was the live integration line based on current `main` and contained all three #552 files;
- patch-level comparison showed the two current-owner changes and the dated PR #550 retrospective had been carried forward, rather than merely being claimed as carried forward in prose;
- #557 also contained substantial reader-facing code, so its acceptance identity was independent from #552's historical docs-only CI receipt.

The resulting action was therefore **no merge, no revive, no new Preview, no reader-facing mutation**. PR #552 remained closed as superseded lineage evidence; #557 remained the single live release line.

## 2. A / B / C retention classification

### A — durable cross-task rules

No genuinely new A-level rule was discovered. The conversation re-exercised rules that already existed in current owners:

1. live provider/repository state overrides remembered chat state for claims that can change;
2. stale governance work must re-resolve current authority topology before refresh/merge;
3. exact-head CI belongs to that exact tree and does not transfer to a successor head;
4. readiness, semantic disposition, and mutation authorization are separate questions;
5. historical evidence and current authority must be preserved separately;
6. docs-only/governance work must not spend a Vercel Preview merely to satisfy stale wording.

Because these rules were already present in root/current owners, this deposition does **not** duplicate them into another bootstrap document.

### B — BaseModel project-level refinement

The reusable refinement from this case is an **absorption proof** for a predecessor PR that has been closed as superseded:

```text
predecessor identity + changed-file set
-> current main drift / intervening owners
-> successor identity
-> path-by-path semantic carry-forward proof
-> separate successor acceptance identity
-> predecessor disposition remains closed/superseded
```

A PR body saying “absorbed into #N” is not enough by itself. The integrator should enumerate the predecessor's intended contributions, verify they exist in the successor/current owner at file/blob/patch/semantic level, check that intervening `main` changes were not overwritten, and only then treat the predecessor as safely superseded.

This is a project-level execution refinement of the existing multi-PR semantic integration rules, not a new global GitHub policy.

### C — transient state intentionally not promoted

The following are retained here only because they reconstruct this dated incident:

- #552 was closed/unmerged at the time of the live read;
- #557 was open/mergeable at the time of the live read;
- the exact SHAs named above;
- the three CI contexts being green at that moment;
- the then-current `main` SHA;
- the number of files in #557;
- timestamps and temporary PR-state facts.

None of these should be copied into long-lived current policy or account memory.

## 3. Friction matrix: event -> cause -> preflight -> defensive rule

| Friction / risk | What happened | Wrong assumption or missing context | Next-time preflight | Defensive rule | Plausible but wrong action |
|---|---|---|---|---|---|
| User-supplied PR state was stale | The request said #552 was open; live GitHub said closed/superseded | Treating the prompt's state sentence as a lock rather than a hypothesis | Re-read PR state, head, base, body/disposition immediately | Mutable provider state must be live-read before mutation | Reopen #552 first because the task said it was still open |
| `mergeable=true` looked like merge authority | Closed #552 could still expose mergeability metadata and an exact green receipt | Equating mechanical mergeability with current semantic disposition | Read state, merged flag, body/disposition, successor lineage, current owner | A superseded PR is not revived merely because Git can still merge it | Reopen and merge because all checks were green |
| `merge_commit_sha` can be misread | A closed-unmerged PR can still expose a `merge_commit_sha` field | Assuming the field name proves the PR landed | Require `merged=true` / `merged_at` and verify ancestry/main | GitHub metadata fields must be interpreted together, not by label alone | Report “already merged” from `merge_commit_sha` alone |
| “absorbed” could have been only prose | #552 body claimed carry-forward into #557 | Trusting a closeout narrative without verifying artifacts | Compare predecessor changed files and successor patches/blobs/semantics | Absorption requires artifact-level proof | Close the predecessor without checking whether one file was dropped |
| Main drift could hide overlap | #552's base was behind current main by #556 | Assuming a one-commit drift is harmless because it is docs/test work | Compare intervening PR changed paths and semantic owners | Drift is classified by owned surface, not commit count | Rebase/merge blindly because Git reports no conflict |
| Old green CI could leak into successor acceptance | #552's exact head had all three required checks green; #557 had a different tree | Treating lineage evidence as acceptance for a successor | Pin successor exact head and its own required gates/provider evidence | CI receipts do not transfer across exact heads | Merge #557 because the docs it inherited were already green in #552 |
| Desire to “finish” could create pointless Preview work | Original task said finish docs-only closeout | Confusing procedural completion with another deployment cycle | Check deploy relevance and current disposition before branch/ref mutation | Do not spend Preview/build quota for superseded docs-only work | Add a release-marker commit just to make Vercel produce a Preview |
| Fixing the predecessor could duplicate authority | #557 already carried the three docs assets | Assuming every valid PR should eventually merge independently | Check whether one current integration line already owns the contribution | Preserve one live semantic release line; close duplicate predecessor paths | Revive #552 “for clean history” and then merge #557 too |

## 4. Repeated-error audit

This conversation did not expose a brand-new failure class; it exposed a **use-site recurrence** of lessons already documented elsewhere.

The same general pattern had appeared before in this repository:

- stale or moving shared state being treated as current;
- exact-head evidence being accidentally generalized to a PR/branch name;
- stale governance branches needing authority-topology migration rather than ordinary replay;
- worker PR outcomes being absorbed into an integration line while the worker PR remains closed/superseded;
- green/mergeable state being mistaken for semantic or mutation authority.

Why can the mistake still recur even after retrospectives exist?

1. **Retrieval gap:** the relevant rule may live in a release or multi-PR document that an Agent does not load when the task looks like a simple single-PR closeout.
2. **Use-site gap:** knowing “refresh live state” abstractly is weaker than performing the live read before the first mutation.
3. **Evidence gap:** “absorbed” is easy to accept as prose unless the procedure names the actual changed-file/patch comparison.
4. **Completion pressure:** an instruction to “finish the PR” can bias an Agent toward producing a mutation even when the correct completion is to leave the predecessor closed.

The repository already counters the first two with root `AGENTS.md`, the scenario registry, `REPEAT-CORRECTION`, and the stale-governance guard. This case adds the concrete absorption-proof witness to the existing multi-PR owner rather than creating another generic SOP.

## 5. Scientific and infrastructure boundary

No experiment or scientific semantics were changed in this conversation. No scientific claim was reinterpreted, no run lineage was modified, and no GPU/server operation occurred.

The relevant boundary is negative but important: **do not let a repository-retrospective template invent scientific or infrastructure incidents that were not part of the task.** Historical completeness means accurately saying “not involved” when appropriate.

Likewise, no local worktree was needed. The repository connector was sufficient, so the task stayed on the narrow cloud-owned execution surface instead of crossing into a user device merely for convenience.

## 6. Repository placement decision

Placement was intentionally minimal:

- **root `AGENTS.md`: unchanged.** It already contains the live shared-state, stale-governance, exact-ref, durable-state, and docs-not-production guards. Adding another PR-specific bullet would dilute the bootstrap.
- **`project-agent-operating-principles.md`: unchanged.** Its read-before-write, reconstruct-from-durable-state, A/B/C, and repeat-correction rules already cover the durable cross-task behavior.
- **`release-closeout-protocol.md`: unchanged by this deposition.** Exact-head evidence ownership is already its responsibility; separately, PR #552's older contribution to that file is being carried on the #557 lineage.
- **`multi-pr-semantic-integration-playbook.md`: refined.** It is the correct current owner for proving that a superseded predecessor's semantic delta was actually absorbed by one live integration line.
- **this file:** historical causality, exact PR/SHA facts, and anti-examples only.

This avoids creating a second mutable copy of release policy.

## 7. Long-term memory extraction

Account-level long-term-memory write performed: **0**.

Reason: this execution environment exposes no writable long-term-memory interface. Repository commits, PR descriptions, chat summaries, and personal-context retrieval are not substitutes for an account-memory write and must not be reported as one.

There is also little new A-level memory content to write: the cross-task rules exercised here already exist in repository current owners. The PR/SHA/status facts are C-level and intentionally excluded from memory.

## 8. Future zero-context checklist for an absorbed/superseded PR

```text
[ ] Live-read predecessor PR state/head/base/body; do not trust remembered “open/mergeable”.
[ ] Enumerate predecessor changed files and intended semantic contributions.
[ ] Read current main and classify intervening drift by changed path + semantic owner.
[ ] Identify the claimed successor/integration line and pin its exact head/base.
[ ] Prove carry-forward path-by-path (blob/patch/semantic), not only from PR prose.
[ ] Verify newer main/current-owner work was not overwritten by the transplant.
[ ] Keep predecessor CI as historical evidence for predecessor exact head only.
[ ] Apply successor's own current release gates; never inherit predecessor green checks.
[ ] If absorption is complete, keep predecessor closed/superseded; do not revive for aesthetics.
[ ] Do not create a Preview for docs-only/superseded work unless current policy and acceptance actually require it.
[ ] Record the final disposition and the single live release line.
```

## 9. Closeout truth for this historical case

At the end of the conversation, the correct disposition was:

```text
PR #552
  -> historical exact-head CI receipt retained
  -> semantic contribution verified as carried forward
  -> closed / superseded
  -> not revived
  -> not merged independently

PR #557
  -> single live integration/release line
  -> owns its own exact-head release evidence
  -> no acceptance inherited from #552
```

That is a dated historical statement, not a command to preserve #557's future state.