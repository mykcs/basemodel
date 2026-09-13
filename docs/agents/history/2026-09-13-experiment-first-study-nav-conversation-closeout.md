# Experiment-first Study navigation conversation closeout

Date: 2026-09-13  
Status: **historical closeout evidence; not current product, deployment, or experiment authority**

This record captures reusable lessons from the conversation that completed `docs/agents/current/EXPERIMENT_FIRST_STUDY_NAV_REORGANIZATION_PLAN_20260913.md` and its Production/cold-read closeout.

Current operating rules remain in root `AGENTS.md`, `docs/agents/current/project-agent-operating-principles.md`, `docs/agents/current/scenario-trigger-registry.md`, the release/deployment policies, and the canonical conversation-closeout protocol in `mykcs/openevo-experiment`. This file explains what happened and why existing rules matter; it must not be used as live branch, PR, provider, Production, or scientific authority.

## Coverage boundary

Reviewed evidence includes the accessible conversation, current BaseModel `main`, the completed Experiment-first checklist, PR #661, PR #673, PR #674, root Agent guidance, existing current policy/search results, and the canonical conversation-closeout protocol.

This closeout does not claim access to unavailable private reasoning. Temporary queue state, Preview/Production deployment IDs, transient branch heads, one-time provider timing, local PIDs/ports/worktrees, and other machine/provider snapshots are intentionally not promoted into standing policy.

## What actually taught us something

### 1. A checklist box is an acceptance claim, not a progress feeling

The owner explicitly required the plan to be the execution authority: find the first still-open and safely executable `[ ]`, do the work, run the required validation, and mark it `[x]` only when real file/test/commit/PR/provider evidence exists. `NOT_EXECUTED`, `BUILDING`, queued work, or a human-approval requirement are not completion evidence.

This is not a new rule. `project-agent-operating-principles.md` already says that `done` means the task's real acceptance boundary is evidenced and that checklist progress must be recomputed from the exact ref-qualified checklist. The Experiment-first plan itself also encoded the same rule. The lesson here is to keep completion language tied to the strongest durable artifact, not to conversational momentum.

### 2. The duplicate-closeout-PR failure happened despite an explicit anti-duplication instruction

The task said to continue existing implementation/PR work and avoid parallel duplicate work. Nevertheless, two docs-only closeout PRs were opened for the same finished checklist within the same minute: #673 and #674. They changed the same checklist for the same purpose. #673 was later closed without merge; #674 became the selected closeout and merged.

This belongs to a previously known failure family: the repository already has historical cases of overlapping/duplicate PR work, while root `AGENTS.md` requires refreshing remote/open-PR state around shared writes and `scenario-trigger-registry.md` requires re-scanning when an overlapping PR is discovered.

The missing use-site behavior was **before PR creation**, not after overlap was noticed. For checklist/closeout work, the existing current rules should be executed as a concrete witness before opening another PR:

`task/checklist path -> fresh main SHA -> open PRs touching the same owner/path or same closeout goal -> canonical existing owner, if any -> only then branch/PR creation`

If overlap already exists, stop multiplying branches/provider work, compare scope and current-base freshness, select one canonical continuation, close/supersede the duplicate, and continue on the selected owner. This paragraph is historical evidence of the failure mode; current authority still lives in the existing root/scenario/concurrency rules rather than here.

### 3. Runtime release completion and docs-only closeout are different layers

PR #661 carried the real Study navigation implementation and runtime acceptance. The later closeout PR only updated the checklist after that release evidence existed. Therefore a docs-only closeout provider event is not allowed to replace, invalidate, or masquerade as the runtime Production evidence.

The correct completion chain is literal and layered:

`implementation exact head -> required test/provider acceptance -> merged current main -> Production runtime verification -> docs/checklist closeout`

A later docs-only administrative event can be cancelled or skipped without making the already-verified runtime release untrue. Conversely, a docs-only merge cannot manufacture missing runtime acceptance.

### 4. Definition of Done is also a stopping rule

The owner required a final Production/cold-read review once every Definition-of-Done row was actually satisfied, then required the plan to become `COMPLETE` and new refactor work to stop.

That matters because website/IA work can otherwise expand forever through optional polish. Once the requested five-experiment hierarchy, ownership, responsive behavior, tests, exact-head acceptance, merge, Production verification, and cold read all satisfy the plan, newly noticed improvements belong to a separately authorized successor task. Completion is not an invitation to keep refactoring.

### 5. Final status reports should be ELI5 but evidence-literal

The four requested questions were stable and useful:

1. what was done now;
2. how much remains;
3. where the work currently is;
4. whether a human must act.

The useful simplification is linguistic, not evidentiary. The report may be plain Chinese, but must still distinguish branch commit, PR open, provider running, merged `main`, Production verified, and COMPLETE. Plain language must not collapse different states into one optimistic “done”.

## Coverage ledger

| Feedback / failure | Repeated? | Reusable lesson | Canonical destination | Why there |
| --- | --- | --- | --- | --- |
| Only mark `[x]` after real file/test/commit/PR/provider evidence; `NOT_EXECUTED`/`BUILDING` stay open | Repeated owner preference, already encoded | Checklist state is an acceptance claim tied to exact durable evidence | `project-agent-operating-principles.md` + task checklist | Existing owner already covers done/progress semantics; no duplicate policy needed |
| Continue existing implementation/PR instead of parallel work | **Yes — duplicate PR family recurred as #673/#674** | Run overlap/open-PR scan before creating a closeout PR; if overlap exists, choose one canonical owner and stop multiplying work | root `AGENTS.md` + `scenario-trigger-registry.md` + existing concurrency/PR guidance | The durable rule already existed; failure was activation before creation, not missing policy |
| Do not let docs-only closeout status replace runtime release evidence | Known exact-state family | Keep implementation, provider, merge, Production, and checklist-closeout layers distinct | release/deployment policy + exact-state principles | Provider/release owners define those evidence boundaries |
| Stop once Definition of Done and final Production/cold read are satisfied | Repeated scope-control preference | Treat DoD as a stopping boundary; successor polish requires new authorization | website engineering/project operating principles + task plan | Prevents endless optional refactor churn |
| ELI5 reports still need literal state distinctions | Repeated | Simplify language, not evidence states | project-agent-operating-principles / owner-facing task contract | Keeps plain-language updates truthful |

## Future-Agent test

A future Agent starting from root Agent guidance and this task's checklist should be able to answer these before acting:

1. What is the exact current `main` SHA and exact checklist authority?
2. Which first `[ ]` item is both still open and safe to execute now?
3. Is there already an open branch/PR that owns this same implementation or closeout?
4. What durable artifact proves the item is complete, and is any required provider still only queued/building?
5. Are runtime acceptance, merge state, Production state, and docs-only closeout being kept separate?
6. If every Definition-of-Done row is accepted, did the Agent stop instead of inventing another refactor?

If those checks are performed, the most important failure in this conversation—the creation of parallel closeout PRs despite an explicit anti-duplication instruction—is materially harder to repeat.

## Temporary state intentionally not promoted

Do **not** infer standing truth from the PR head SHAs, exact deployment objects, provider queue timings, temporary review/Preview URLs, local ports/PIDs/worktrees, or one-time branch cleanup state from this conversation. The relevant historical PR objects remain in GitHub; current release/provider truth must always be re-read live.

## Long-term memory boundary

The repository permanently records the project-level lesson. If account-level memory is used, only the stable workflow preference is suitable: checklist-driven repository work should count only durable accepted evidence, continue an existing canonical PR when one already owns the work, and stop when Definition of Done is satisfied. No transient PR/provider/deployment identity belongs in account memory.
