# Vanilla SD-LoRA Archify release-checklist conversation closeout — 2026-09-13

Status: **historical closeout evidence; not current product, release, or scientific authority**

Scope: the accessible completion conversation for `2026-09-13-vanilla-sd-lora-archify-flow-completion-plan.md`, plus current BaseModel governance and release evidence. This file records only the reusable lesson that was not already captured by the earlier Vanilla SD-LoRA HTML-flow closeout.

## Coverage boundary

The closeout reviewed the visible user instructions and reports in this conversation, the current completion plan, current BaseModel Agent/release policy, and the earlier `2026-09-12-vanilla-sd-lora-html-flow-conversation-closeout.md`. It does not claim access to hidden reasoning or vanished provider logs.

The earlier closeout already owns the important visual correction: a row of cards is not a recoverable process flow, and branch/join/return topology needs rendered acceptance. This closeout does not duplicate that rule.

## REPEAT-CORRECTION witness

`owner requires every recurring report to use an evidence/checklist-based percentage -> current owner is project-agent-operating-principles.md and the task's canonical checklist -> checked artifact is the current ref-qualified completion plan plus the report sequence -> allowed next action is to recount checked acceptance items from that exact file before each percentage report -> invalidation cue is any checklist/ref change, which requires a fresh recount rather than carrying the old denominator forward`

## What happened

The release process itself followed the important existing boundaries: a checklist was used as authority, provider acceptance had to be a real exact-head deployment rather than a status-only callback, Production was verified separately, completion was written back to the plan, and the recurring automation was stopped only after the durable completion state existed.

The reporting arithmetic was weaker. Across repeated progress reports, the denominator used for the same task changed and was later changed back. The individual reports generally respected the rule that pending work must not raise the percentage, but the percentage still became internally inconsistent because the denominator was being carried conversationally instead of being mechanically recomputed from the canonical checklist.

This is not a new release-provider problem. Current release policy already covers exact-head identity, real Vercel execution, skipped-provider semantics, Production acceptance, and provider wait discipline. The missing reusable rule was narrower: **the canonical checklist must also be the counting source, not merely the evidence source.**

## Durable change

`docs/agents/current/project-agent-operating-principles.md` now requires that, when a task names one canonical checklist and asks for a completion percentage, every report recompute both numerator and denominator from the exact ref-qualified checklist. Only acceptance rows with durable evidence count as complete. If the checklist itself changes, the report must say so and recount rather than silently switching denominators.

No new deployment policy, automation policy, or second checklist authority was created.

## Coverage ledger

| Feedback / failure | Repeated? | Reusable lesson | Canonical destination | Why there |
| --- | --- | --- | --- | --- |
| Evidence-based percentage was requested repeatedly, but the denominator drifted between reports | Yes — the repository already rejected unmeasured percentages, but the use-site counting rule was underspecified | Recompute numerator and denominator from the exact canonical checklist on every report; explain checklist-scope changes | `docs/agents/current/project-agent-operating-principles.md` | It already owns progress-report semantics, so this closes the gap without another policy source |
| A green callback / skipped provider state must not be treated as release completion | Known rule, not newly escaped here | Keep requiring real exact-head provider execution and Production evidence | existing `release-closeout-protocol.md`, `LATEST.md`, and task plan | already explicit and sufficient; duplicating it would weaken authority clarity |
| Do not spend recurring runs busy-waiting on a provider | Known rule, not newly escaped here | Read provider state once, do independent work, then resume from durable identity | existing `LATEST.md` / release policy | already explicit; no new rule needed |
| “Four cards” did not visibly communicate the SD-LoRA flow | Yes, but already closed in the 2026-09-12 Vanilla HTML-flow closeout | Require authored topology plus rendered flow acceptance | existing human-thinking/UI owners and prior closeout | this conversation should not create a second copy of the same lesson |
| Recurring automation should stop after confirmed durable COMPLETE, not merely after a chat claim | Correctly handled in this run | Read back durable completion and then disable the task when the task contract says to | task-specific completion plan + existing exact-state rules | successful application, not a missing global policy |

## Temporary state intentionally excluded

This closeout does **not** promote any live branch head, PR head, deployment ID, Preview URL, build queue state, transient percentage snapshot, local worktree path, PID, port, or automation runtime state into standing policy or long-term memory. The task plan already contains the bounded release evidence needed to reconstruct that historical delivery; this closeout does not copy it into another authority.

## Future-Agent test

A future Agent starting from root `AGENTS.md` reaches `project-agent-operating-principles.md` during normal bootstrap. If an owner then says “每小时继续，告诉我百分比” and names one checklist authority, the Agent should be able to answer the percentage by recounting the current exact checklist rather than remembering yesterday's denominator.

If two consecutive reports can silently use different denominators for the same unchanged checklist, this closeout has failed.
