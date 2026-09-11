# Q17 diagnostics + publication conversation closeout

Date: 2026-09-11
Status: historical closeout evidence; **not current scientific authority**
Scope: Q17 same-task diagnostics publication, plain-language rewrite, chart freshness, release friction, and execution-surface lessons from the accessible conversation.

Current scientific truth remains in `mykcs/openevo-experiment`; current website/release rules remain under `docs/agents/current/`. This file explains why a few current rules were strengthened. It must not be used as live experiment status.

## Coverage boundary

This closeout reviewed the accessible conversation plus current BaseModel/experiment repository evidence and already-recorded history. It does not claim access to unavailable conversation text or private reasoning. Earlier incidents already captured by experiment evidence or BaseModel HPL were referenced rather than copied into a second authority.

## What needed durable capture

### 1. A historical curve was still being used as the current whole-run figure

The Q17 result page had already moved on to newer diagnostic evidence, but a lower training-curve section still rendered an older dated snapshot ending much earlier in the run. The chart was factually correct **for its original timestamp**, yet its placement made it look like the current whole-run trajectory.

The wrong assumption was that “a valid historical chart with the right fields is good enough for a current page.” It is not. A current-facing longitudinal figure has an additional freshness contract: resolve the latest completed/sealed upstream boundary at publication time, create a new dated evidence object, and make the plotted cutoff/caption/source agree.

A second implementation trap was discovered at the same time: the old data module was also consumed by a historical briefing. Mutating that shared module in place would silently rewrite the historical briefing. The safe pattern is **historical source stays pinned; current page gets a separate dated source**.

This lesson is now owned by `current/experiment-result-publication-workflow.md` and routed by `current/scenario-trigger-registry.md`.

### 2. “说人话” was a repeated owner correction, but the rule already had an owner

The owner again rejected research copy that made readers decode statistical/internal language before understanding the result. That failure family was already captured in CASE-090, Human Preference Learning events, the Preference Model, and the research-component instructions.

The closeout therefore does **not** create another style rule. The durable action was already taken in the existing HPL owner: plain meaning first, technical/statistical precision locally available, and claim-changing caveats still visible.

### 3. The Fish/Bash parser failure repeated even though the rule already existed

A compound Bash loop was again sent through an outer Fish execution surface and failed before mutation. This was not a new discovery: root `AGENTS.md` and `project-agent-operating-principles.md` already require naming and verifying the outer interpreter.

The missing layer was use-site attention. The scenario registry now has a trigger for compound RDC/SSH shell work: set the outer interpreter, verify the tool actually launched it, and treat a pre-mutation parser failure as `NOT_EXECUTED`. The registry points back to the existing operating-principles owner instead of becoming a second shell policy.

### 4. A generic formatter error was not a product failure

A generic Prettier invocation could not infer a parser for an Astro component. That failure only established that the chosen formatter entrypoint was not configured for that file; it did not establish that the Astro source was invalid.

This remains a project-level historical lesson rather than a new standing rule because the repository already owns validation through Astro check/build and task-specific tests. Future work should prefer repository-owned validation commands over interpreting a generic formatter mismatch as source failure.

### 5. Port collisions and provider latency were handled without creating new rules

Local Preview ports were already in use by other worktrees. The task did not kill unrelated processes; it identified ownership and moved to an isolated port. Long hosted gates were also allowed to finish before merge/Production claims. Both behaviors were already required by current operating/release policy, so no duplicate rule was added.

## Coverage ledger

| Feedback / failure | Repeated? | Reusable lesson | Canonical destination | Why there |
| --- | --- | --- | --- | --- |
| Current Q17 page showed an old longitudinal cutoff as if it represented the current run | Yes: existing full-axis/freshness principles were already present but not applied at this use site | Current-facing whole-run charts must resolve latest completed/sealed upstream state at publication time; historical snapshots stay historical | `current/experiment-result-publication-workflow.md` + scenario trigger | Publication workflow owns experiment → website freshness |
| One shared historical data module fed both a historical briefing and a current page | New concrete mechanism | Do not mutate shared historical snapshot bytes to make a current page fresh; split current vs historical data owners | `current/experiment-result-publication-workflow.md` | Prevents fixing freshness by rewriting history |
| Owner again said the Q17 page must “说人话” | Yes | Reuse existing HPL/CASE-090; do not create another copy rule | existing HPL owners | Preference system already owns the failure family |
| Compound Bash syntax was again parsed by Fish | Yes, repeatedly documented | Put the shell check at the use site: explicit outer interpreter + verify launched shell before compound syntax | `current/scenario-trigger-registry.md` → existing operating-principles owner | The knowledge existed; retrieval at action time failed |
| Generic Prettier could not infer an Astro parser | No | Classify formatter-entrypoint mismatch separately from Astro/product validity | this history only | Useful friction evidence, not a cross-task policy owner |
| Local Preview port belonged to another worktree | Known class | Identify ownership; do not kill unrelated process; isolate port/worktree | existing operating principles | Rule already current and adequate |
| Long PR/Vercel closeout required repeated “continue until complete” | Known class | Reconstruct from durable state and continue exact-head release until terminal state or real blocker | existing scenario/release owners | Already current; no duplicate rule |
| Historical malformed JSONL framing in experiment diagnostics | Already captured upstream | Preserve formal file; use verified source-episode fallback only with complete identity coverage | experiment-side evidence/analyzer | Scientific execution belongs upstream, not BaseModel policy |

## Temporary state intentionally not promoted

The closeout intentionally does not store as standing policy: current round number, current Score/loss, live GPU/process occupancy, PIDs, temporary worktree/branch names, temporary ports, Preview URLs, deployment IDs, transient PR heads, or one-time provider state.

A dated experiment/publication evidence object may legitimately preserve a bounded cutoff for provenance; that is different from turning the cutoff into a standing “current” fact.

## Future-Agent test

A future Agent starting from `AGENTS.md` and the scenario registry should now be able to answer two questions before acting:

1. **Am I about to run compound Bash syntax through an unverified outer shell?** If yes, verify the interpreter first.
2. **Am I about to publish a current/latest/whole-run chart from an older website snapshot?** If yes, resolve the latest completed/sealed experiment boundary and build a new dated publication snapshot; preserve the old chart only as history.

If those checks happen at the use site, the two most reusable failures in this conversation are materially harder to repeat.
