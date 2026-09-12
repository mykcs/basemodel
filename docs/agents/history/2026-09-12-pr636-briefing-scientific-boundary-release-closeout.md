# PR #636 briefing / scientific-boundary / release closeout

Status: **historical case record, not current authority**
Date: 2026-09-12
Current rule owners: `scenario-trigger-registry.md`, `experiment-result-publication-workflow.md`, `release-closeout-protocol.md`

## Scope and evidence coverage

This closeout covers the accessible conversation that cold-read, corrected, revalidated, approved, merged, and Production-verified BaseModel PR #636. It also re-read the canonical conversation-closeout protocol and the current BaseModel Agent routing/release/publication owners before writing.

This record does not preserve transient head/base SHAs, deployment IDs, Preview URLs, temporary worktree paths, live provider queue state, or experiment progress. Those were useful execution evidence during the task but are not standing knowledge.

## What changed the judgment

### 1. A historical projection and a current publication can both be true

The briefing still contained copy saying the selected-vs-success task-identity audit was open. The dated website projection was not itself wrong: at its recorded snapshot time that audit really was incomplete. Later experiment-repository evidence had closed it.

The correct repair was **not** to flip the old projection's historical boolean or rewrite its bytes. The current briefing instead cited the later immutable audit result separately, while the historical fixture stayed pinned to its original status.

The regression pattern is therefore dual: preserve the old fixture exactly, and separately fail if current rendered copy keeps obsolete `open` / `Pending` language after newer evidence has deliberately been incorporated.
### 2. Publication wording describes order; it does not grant scientific authorization

The final execution strip originally compressed the sequence into “training ends → open frozen final → start successor”. That was too strong because it could read as automatic permission.

The corrected semantics are:

```text
finish the frozen current treatment
-> formally seal the required boundary
-> obtain final-evaluation authorization
-> open the frozen final once
-> separately preregister + authorize any successor
```

A website slide may explain this sequence, but the publication surface cannot authorize final-panel access, experiment mutation, recovery, or successor launch.

Likewise, the completed identity audit supports only a narrow provenance/selection statement. It does not prove that success-only learning caused the plateau, and it does not prove a Frontier Curriculum successor will improve results.

### 3. Exact-head acceptance does not make stale PR prose true

The candidate had to absorb newer `main` work before final acceptance. After that sync, the code and provider evidence were current, but the PR body still named an older review head/base and an older execution-strip summary.

That mismatch did not invalidate the accepted Git tree, but it could mislead the owner reviewing the PR. The durable rule is to refresh PR narrative metadata after the last current-base sync when the body records candidate identity, validation results, or execution-order claims. PR prose is not the merge lock, but it must not contradict the live tuple.
### 4. The “do not stop at pollable pending” mistake happened again

This was a **repeat correction**. After the owner had said to continue, the Agent initially ended with a summary while the exact-head Vercel final gate and PR-body cleanup were still actionable in the same session. Earlier BaseModel closeouts had already recorded the same failure class, and the current scenario registry already said not to end at pollable `pending`.

Adding the same sentence again would not fix the knowledge-system failure. The missing use-site cue was that this conversation resumed from prior context and then crossed from review/advice into mutation/release work without re-running task routing. The registry now makes that transition explicit: a resumed/handoff conversation entering a new action phase is a task-state change, and a prior assistant summary is context rather than bootstrap authority.

### 5. One potentially dangerous local-state situation was handled correctly

The first local BaseModel checkout discovered during implementation was stale, on another branch, and dirty with unrelated work. It was left untouched; the work moved to an isolated checkout instead.

No new rule was needed for this. Existing shared-state/worktree rules already say unknown dirty state is a stop-and-read event rather than permission to reset or overwrite it.

## Coverage ledger

| Feedback / failure | Repeated? | Reusable lesson | Canonical destination | Why there |
| --- | --- | --- | --- | --- |
| Current briefing said a later-completed audit was still open | same stale-publication family, new concrete form | preserve dated evidence, cite later immutable audit separately, test historical + current truth independently | `experiment-result-publication-workflow.md` + documentation regression test | publication owner already owns historical/current evidence semantics |
| Final slide could imply final-eval/successor permission follows automatically from training completion | no exact duplicate in this thread | publication can describe order but cannot grant runtime/final-panel/successor authorization | existing scientific/publication authority; historical case records the concrete failure | do not create a second experiment authority in BaseModel |
| Agent stopped after the owner had said continue while final Vercel/body cleanup remained pollable | **yes** | do not add another pending reminder; treat resume/handoff + action-phase shift as a trigger to reload current routing/authority, then obey the existing synchronous-completion rule | `scenario-trigger-registry.md` + documentation regression test | the repeated mistake exposed an activation/routing gap, not a missing reminder |
| PR body retained old head/base/validation summary after current-base sync | new concrete gap | refresh narrative metadata after the final sync; a metadata-only body edit does not change candidate Git SHA, but stale prose can mislead the owner | `release-closeout-protocol.md` + documentation regression test | release owner already owns the accepted tuple and pre-merge narrative hygiene |
| Dirty unrelated local checkout was discovered | known class, handled correctly | do not reset/overwrite unknown dirty work; use an isolated checkout | existing root `AGENTS.md` / project operating principles | no new rule is needed when the existing rule was followed |

## Retention classification

### A. Durable rules

- A conversation resumed from a handoff/summary and then entering mutation, provider acceptance, merge, or Production verification is a **task-state change**. Re-run the matched current routing/authority; the prior assistant summary is context, not bootstrap authority.
- Dated publication evidence stays historically truthful. Later audit evidence is added as a separate current source, with tests protecting both the old status and the new current copy.
- If a PR body names candidate/base identity or validation state, refresh that narrative after the last current-base sync before owner approval/merge. Exact-head acceptance and narrative freshness are separate checks.

### B. Project-level lessons

- The Q17 task-identity audit supports a narrow selection/provenance statement; it does not establish the cause of the plateau or the efficacy of a Frontier Curriculum successor.
- The BaseModel publication layer may explain the final-evaluation/successor order, but it cannot authorize final-panel access or launch a successor.
### C. Temporary state intentionally not retained

Do not copy from this conversation into standing policy or long-term memory:

- the then-current PR head/base SHA;
- GitHub Actions run numbers or live queue state;
- Vercel deployment IDs, Preview URLs, or transient `BUILDING` / `READY` observations;
- temporary local checkout/worktree paths;
- one-time timestamps or experiment progress.

These remain recoverable from GitHub/provider history when needed and are not durable rules.

No new account-level ChatGPT memory is required for this closeout. The reusable findings are BaseModel/project-specific and are stored in the repository owners above; repository scientific authority remains canonical.

## Future-Agent test

A new Agent starting from root `AGENTS.md` should now be able to:

1. reach `docs/agents/README.md` and the scenario registry, then see that a resumed/handoff conversation crossing into a new action phase must re-route against current authority;
2. reach `experiment-result-publication-workflow.md` and know how to keep a dated historical fixture unchanged while current copy cites a later audit;
3. reach `release-closeout-protocol.md` and know that green exact-head checks do not make stale PR narrative metadata true;
4. distinguish the current rule owners from this historical record;
5. avoid saving temporary deployment/run/worktree state as durable policy;
6. continue a still-pollable requested release task to a terminal state or a real blocker instead of stopping at `pending`.

If any future case contradicts these current owners, live/executable truth wins and the current owner should be corrected rather than extending this history file into a second policy source.
