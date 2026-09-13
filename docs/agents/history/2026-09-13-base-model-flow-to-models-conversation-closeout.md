# Base Model Flow → Models migration conversation closeout

Status: **historical closeout evidence; not current policy**

This record captures reusable lessons from the conversation that moved the SEED / OpenEVO Qwen model setup out of the research-flow page and into the canonical model area, then carried the change through HPL, browser acceptance, PR/release, Production verification, and checklist closeout.

Current rules live in `docs/agents/current/*`. This file explains why several current rules were tightened; it must not be used as live deployment, branch, provider, or experiment authority.

## Coverage boundary

Reviewed evidence includes the accessible conversation, the merged migration checklist/evidence, current BaseModel governance, and the canonical conversation-closeout protocol. It does not claim access to unavailable private reasoning.

Temporary execution state is intentionally excluded: local port numbers, PIDs, worktree paths, transient branch heads, Preview/share URLs, provider queue state, deployment IDs, and one-time automation failures are not preserved here as standing truth.

## What actually taught us something

### 1. Information architecture ownership was right; duplicate ownership was the real smell

The old research-flow model page mixed model identity, reproduction fields, and fair-comparison controls. Those facts belong to the model record; research flow should link to that record instead of maintaining a second prose owner. The existing route-role and canonical-owner policies already cover this, so no new parallel IA rule was created.

### 2. HPL review scope can be wrong even when the task scope sounds right

The internal A/B/C candidates changed the `/models/` discovery surface, but the first cold-read attempt borrowed the destination model-detail contract because the migration ultimately linked into a Qwen detail page. That broader contract surfaced real but unrelated pre-existing detail-page debt and produced a false migration blocker.
The correction was to bind candidate screening and cold read to the surface whose presentation actually varied. For multi-route migrations, review each materially changed surface separately and use deterministic/browser checks for routing/ownership elsewhere. Phase B should distinguish candidate-caused regressions from independent old debt instead of forcing scope expansion.

### 3. A dirty working tree is not the commit named in the report

A full browser/HPL run initially appeared to belong to the current `HEAD`, but later inspection showed additional tracked product edits still existed in the working tree. The browser had rendered `HEAD + local delta`, so the earlier SHA attribution was too strong.

The durable fix is a use-site check before exact-head claims: inspect `git status`; if product-affecting files are dirty, the run is preflight evidence only. Commit the intended delta and rerun affected visual/HPL/browser acceptance before writing a SHA-bound receipt.

### 4. The port requested from a dev server is not necessarily the port that launched

Concurrent local Agents already occupied several ports. The framework automatically chose another port, while the first browser check opened the originally requested port and therefore inspected another server. This looked like a missing migration section even though the source was correct.

Manual browser acceptance must use the actual URL emitted by the task-owned server and verify a route/sentinel from the intended candidate before screenshots or assertions. A requested port is configuration intent, not server identity.

### 5. The Fish/Bash parser failure recurred

A command using Bash process substitution was sent through an execution surface that reported Fish. The parser failed before the intended Git comparison ran. The repository already had the durable shell rule, so repeating it again would not solve the knowledge-system failure.

The missing use-site detail was timing: some execution APIs reveal the interpreter only after they launch the same command. On those surfaces, the first probe must be dialect-neutral; Bash-only syntax belongs only after interpreter readback or inside an explicit standalone Bash/Python script.
### 6. Progress percentages must come from accepted checklist rows

The owner repeatedly required progress reports to separate what actually happened from what was merely planned, opened, or still running. A scheduled continuation task failing or a PR existing did not make the migration more complete.

When a percentage is requested, use an explicit checklist denominator and count only rows backed by durable evidence. Report the next missing milestone beside the percentage. Automation is orchestration, not acceptance evidence.

### 7. Diverged branch history is a semantic question, not a reason to force-push

The local task branch and remote PR branch later had different ancestry even though the remote-only changes were patch-equivalent to changes already present locally. The safe path was to compare semantic/patch equivalence first and preserve ancestry rather than resetting or force-overwriting unknown work.

Existing concurrent-state and multi-PR rules already cover this behavior, so this closeout adds no second Git-integration policy.

## Coverage ledger

| Feedback / failure | Repeated? | Reusable lesson | Canonical destination | Why there |
| --- | --- | --- | --- | --- |
| HPL cold read used the destination detail contract for an index-layout candidate | New | Review contract follows the surface materially varied by candidates | `current/human-preference-learning-system.md` + scenario trigger | HPL owns candidate/reviewer scope |
| Browser/HPL evidence was temporarily attributed to `HEAD` while product files were still dirty | Repeated exact-tree family | Dirty-tree render is preflight, not exact-SHA evidence | `current/website-engineering-standard.md` | Exact-tree acceptance owner |
| Browser opened the requested port instead of the server's emitted port | Project-level recurrence class | Bind browser checks to task-owned server stdout + route sentinel | `current/project-agent-operating-principles.md` + scenario trigger | Local execution/browser identity |
| Bash-only syntax hit Fish before comparison executed | Yes | First shell probe must be dialect-neutral when interpreter is only reported after launch | `current/project-agent-operating-principles.md` | Existing shell owner; fixes the use-site gap |
| Progress wording counted planning/running state too optimistically | Repeated owner preference | Percentage = durable accepted rows / explicit checklist rows | `current/project-agent-operating-principles.md` | Cross-task progress-report semantics |
| Diverged local/remote branch looked like a force-push problem | No | Compare semantic/patch equivalence before mutation; preserve unknown ancestry | Existing concurrent-state / multi-PR owners | Already covered; no duplicate rule |
## Future-Agent test

A new Agent should now be able to answer these before acting:

1. Which visible surface actually differs between HPL candidates, and therefore which Reader Contract owns the review?
2. Is the browser rendering a clean exact commit or a dirty working tree?
3. Which URL did the task-owned dev/preview server actually emit, and does the opened route contain a task-specific sentinel?
4. If the execution tool reports its shell only after launch, was the first command dialect-neutral?
5. If a progress percentage is shown, which accepted checklist rows are in the numerator and what milestone is still missing?

If those checks are performed, the most expensive mistakes from this conversation become harder to repeat without creating a second policy system.

## Temporary state intentionally not promoted

No local PID, local port, machine-specific worktree path, temporary dependency symlink, Preview/share URL, provider queue state, one-time automation failure, or short-lived branch/deployment identity is made current policy by this closeout.

The task's completed product/release evidence remains in its own migration checklist and Git/provider history. This retrospective records only the reusable causal lessons.

## Long-term memory boundary

No account-level long-term ChatGPT memory write is claimed by this closeout. Repository documentation is the durable project record; it is not the same thing as account memory.
