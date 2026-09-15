# Q17 diagnostics publication closeout — 2026-09-11

Status: **historical closeout evidence; not current policy**

Current reusable owners already exist in `docs/agents/current/`: `human-thinking-web-expression-contract.md`, `scenario-trigger-registry.md`, `deployment-policy.md`, and `release-closeout-protocol.md`. This file records recurrence/evidence only and deliberately does not create a second mutable rule source.

## What the publication work taught us

### Put the new conclusion at the right information layer

The capability-exploration lobby needed one short “latest evidence” bridge, not a copy of the whole diagnostics report. The full 32-task table, confidence intervals, entropy and GPU2 replication belong on the Q17 detail page; raw scientific evidence remains owned by `openevo-experiment`. GDR/DirectApply received only the interpretation relevant to that decision, and Mechanism-1.0 received only the upstream motivation link.

This is an application of the existing whole-page flow and L0–L3 density contract, not a new design rule.

### Public CI caught two real reader-facing defects

The first release candidate introduced a metadata label that was too small for the mobile readability gate. After fixing that, the English hero exceeded the existing 1280×633 first-screen contract by about one line. Both were implementation defects; the existing gates were correct. The fixes kept the metadata at normal readable size and shortened only the English hero wording without weakening the scientific boundary.

**Reusable use-site check:** before calling a reader-facing candidate frozen, run the repository’s actual mobile readability and compact first-screen browser contracts on both languages. A static build alone is insufficient.

### Current-base drift was handled correctly after it occurred

`main` advanced through the OpenEVO briefing/frontier consolidation while the PR was waiting. The candidate was rebased onto current main, exact-head validation and Public PR CI were rerun, and only then was the persistent Vercel final gate requested. This is evidence that the current exact-head/current-base rule works; no duplicate policy is needed.

### We still stopped too early while completion was pollable

The owner had to say “继续完成” again after intermediate reports while Vercel/Production were still pending and pollable in the same session. This is a repeated failure family. Current `release-closeout-protocol.md` and `scenario-trigger-registry.md` already contain the stronger `continue until complete` rule (reinforced by merged closeouts #634/#638), so this file records recurrence rather than adding another instruction.

## Coverage ledger

| Feedback / failure | Repeated? | Reusable lesson | Canonical destination | Why there |
| --- | --- | --- | --- | --- |
| Latest Q17 result needed on the capability-exploration page | New page-placement decision | Lobby gets the short conclusion/link; detail page owns full diagnostics; experiment repo owns raw evidence | Existing human-thinking web expression contract | Information-layer decision, not a new authority |
| New metadata text failed mobile readability | Existing UI-safety family | Run actual mobile readability gate before freeze; do not solve hierarchy with tiny prose | Existing UI/browser gates | Executable check already exists |
| English hero missed the 1280×633 first-screen contract | Existing first-screen family | Validate both languages at compact desktop, not only 1440px | Existing reader-journey test | Executable contract already exists |
| `main` moved before final acceptance | Repeated release family | Refresh same semantic candidate and revalidate exact head/current base | Existing deployment/release policy | Already canonical and correctly applied |
| Agent stopped while Vercel/Production was still pollable | **Yes** | Continue synchronous polling until terminal state, identity change, or real blocker | Existing release closeout + scenario registry | #634/#638 already strengthened the current rule |
| Preview URLs, ports, worktrees, transient SHAs/provider pending states | Temporary | Do not promote to durable policy | Not saved | Volatile implementation state |

## Future-Agent test

A new Agent should be able to start from current BaseModel routers and do all of the following without reading this history file first:

1. choose a summary/detail/evidence placement from the Page Expression Brief and density contract;
2. run mobile readability and compact first-screen checks in both languages before freezing a candidate;
3. re-resolve live `main` before the final gate;
4. if the owner said continue until complete, keep polling the same exact provider identity until terminal, identity change, or a concrete blocker;
5. verify the actual Production target route after merge instead of equating merge or provider READY with visible publication.

The history file exists only to show that these checks were exercised by a real Q17 publication and that the premature-stop failure recurred.

## Temporary state intentionally not retained

No temporary Preview URL, deployment ID, local port, PID, worktree path, transient provider state, current branch head, or current experiment progress is promoted here. Immutable merged PR history remains available separately.
