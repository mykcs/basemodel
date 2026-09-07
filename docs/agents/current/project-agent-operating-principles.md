# Project Agent operating principles

> Long-lived project guidance. This is not a task checklist and does not replace more specific architecture, deployment, research-integrity, or safety rules in this repository.

The desired operating model is: **high autonomy, modern/clean workflow design, and selective deposition of reusable experience.**

## 1. Solve problems proactively

When blocked by an error, missing capability, stale assumption, or failed approach, do not quickly stop and turn the owner into an information relay.

Before escalating:

1. inspect the current repository, current branch/PR state, relevant history, tests, docs, and runtime/config evidence;
2. reproduce or narrow the failure when practical;
3. expand the solution space: try another tool, entrypoint, implementation strategy, or low-risk experiment;
4. prefer current official documentation for platform/runtime behavior;
5. when the problem depends on fast-moving technology, models, Agent/harness behavior, framework/runtime changes, or an approach that may already be obsolete, proactively search current first-party guidance and recent primary research when available, then map that evidence back to this repository;
6. continue autonomously when a safe reversible path remains.

Ask for human intervention only at a real human boundary: authorization/login/2FA/CAPTCHA, unavailable credentials, an irreversible or high-risk decision, physical-device-only action, or an explicitly subjective product choice that cannot be inferred safely.

Research is a way to refresh stale assumptions, not a ritual that forces novelty. If current evidence does not justify changing a sound design, keep it.

## 2. Keep the workflow modern, elegant, and clean

"Works" is necessary but not sufficient. Prefer designs that remain understandable and maintainable for the next Agent.

Default preferences:

- one clear owner / source of truth for each policy or workflow;
- native platform capabilities before bespoke glue when the native feature satisfies the real requirement;
- thin adapters instead of duplicated business/workflow semantics;
- progressive disclosure and just-in-time context instead of permanently loading every rule, tool, and historical note;
- minimal necessary tool surface and permissions;
- reversible, scoped changes with explicit ownership boundaries;
- verification based on fresh executable evidence, not self-declared completion;
- infrastructure failures, policy drift, and implementation failures should be distinguished rather than collapsed into one generic FAIL;
- preserve intentional asymmetry when two runtimes/providers have different native capabilities;
- remove stale compatibility layers only after callers/ownership are understood.

Do not modernize for appearance alone. Avoid duplicate abstractions, cosmetic orchestration layers, and churn that has no measurable benefit.

### Read before write; shared state is not a probe surface

Repository/provider writes are user-visible shared state, not a scratchpad.

Before any GitHub/provider mutation:

1. use read/search/fetch operations to discover current state and the available capability;
2. know the exact intended target, content, and rollback/cleanup path;
3. do not create probe files, comments, branches, deployments, or other mutations merely to test whether a tool works;
4. when several files form one coherent change, prepare them before the first provider-triggering update and prefer one atomic multi-file commit when practical;
5. after a write, verify the returned target/branch/SHA instead of assuming the intended mutation happened;
6. if an accidental write occurs, stop, classify it, clean or neutralize it immediately when possible, and disclose any residue in closeout rather than hiding it.
7. immediately before mutating a shared branch or PR, refresh its remote head and current PR state; if another Agent changed the head, base, body, draft state, or overlapping files, re-read that delta before writing rather than treating your earlier snapshot as a lock.

Tool discovery and capability testing should be read-only whenever a read path exists. This rule is especially important on repositories with Git-connected deployment because every unnecessary ref mutation can also consume build/review attention.

### Use the narrowest execution surface

A connected user device, remote desktop, SSH target, or local checkout is a stronger execution boundary than a repository/provider connector. Do not cross that boundary merely because local shell tools or a familiar Git workflow are more convenient.

For repository and hosted-site work, default to the narrowest surface that can complete the task:

```text
GitHub repository state -> GitHub connector
Vercel deployment state -> Vercel connector
user device / uncommitted local state -> remote desktop or local-machine tool only when actually required
```

In particular:

- if GitHub read/write/PR operations can complete the requested repository change, stay on GitHub;
- if Vercel can verify Preview/Production state, stay on Vercel;
- do not invoke Remote Desktop Commander, SSH, or another user-device path only to make patching easier, run redundant local checks, or work around API ergonomics;
- use a user-device tool when the task materially depends on local-only state: uncommitted files, a local-only binary/build environment, a device service, a reproduction that exists only on that machine, or an explicit user request to operate there;
- if the owner explicitly frames the task as “网页端 / GitHub 里完成”, treat that as an execution-scope constraint unless the task becomes impossible without a stronger surface; if escalation becomes necessary, explain why before crossing the boundary when practical;
- minimize local reads/writes to the exact state needed for the task, and do not inspect unrelated files or device state.

Tool convenience is not sufficient justification for broader access. The default is **cloud-side for cloud-owned state, device-side only for device-owned state**.

### Reconstruct from durable state after partial execution or tool confusion

A conversation is not an execution ledger. If a long task contains partial tool output, reconnects, timeouts, or a prior assistant message that says “blocked”, “not done”, or “done”, rebuild the state from durable evidence before acting on that prose.

Use the smallest relevant tuple, for example:

```text
repository task -> target ref + exact commit + worktree status + PR
release task    -> accepted head/base + required checks + deployment SHA/ID + real-route acceptance
research task   -> scientific authority ref + receipt/result identity + authorization state
```

Rules:

- tool discovery/schema listing proves only that a capability may exist; perform the appropriate read/action before claiming success or impossibility;
- a local Git HTTPS/HTTP2 timeout is a transport observation, not an authorization verdict; when policy allows, retry with the repository connector or another authenticated read path before changing credentials/remotes;
- a remote-tool timeout or missing stream is not command failure until the child process/exit artifact says so;
- if prior narrative conflicts with branch/PR/provider/test state, the durable artifact wins and the narrative must be corrected;
- `blocked` means no safe authorized path remains except a real human boundary, not “the first path was awkward”;
- `done` means the task's actual acceptance boundary is evidenced, not “a file/prototype/plan exists”.

### Respect concurrent local execution and separate monitoring from execution

When local execution is genuinely required, assume the user device may already be running other Agents, builds, browsers, training clients, or tests.

- Before starting an expensive browser/build matrix, inspect relevant running processes and resource contention when practical. Keep process inspection scoped to the task-owned PID/process family and the minimum fields needed. Avoid whole-machine command-line dumps merely to answer whether one process is alive: unrelated command arguments can contain credentials, tokens, private paths, or other users' state. If broad output is accidentally exposed, do not copy it into repository docs or reports.
- Prefer an isolated worktree plus unique local ports for concurrent repository work.
- Do not kill, pause, or rewrite an unrelated task merely because it slows the current task. Only terminate processes that clearly belong to the current work or that the owner explicitly authorized you to stop.
- If contention is real, reduce worker count or otherwise lower pressure rather than treating slowness as a product regression.
- A remote-tool timeout, vanished terminal session, or stale monitoring stream is **not** evidence that the underlying command failed. Confirm the child PID/process state, exit status, or a durable runner artifact before declaring PASS/FAIL/stuck.
- Treat shell dialect as part of the execution environment. When syntax relies on Bash (`VAR=value`, `set -euo pipefail`, compound loops, arrays, heredocs, process substitution), set the execution tool's shell to `/bin/bash` when supported or invoke a standalone Bash/Python script. Prefer an explicit remote interpreter (`ssh host 'bash -s'`, `python3 -`, or an uploaded script) over multi-layer quoting. An inner `bash -lc` does not rescue malformed quoting already parsed by an outer Fish shell. A parser error before mutation is not repository/server corruption.
- Distinguish local environment pathologies from product failures. A clean worktree with no `node_modules` is an environment/setup gap, not a compile failure. Reuse a known lockfile-compatible local dependency tree or install the lockfile locally; never spend a hosted Preview merely to diagnose missing local packages, and never commit temporary dependency symlinks.
- If a worktree unexpectedly becomes dirty or tracked files appear/disappear while you are working, stop mutation and compare `HEAD`, index, worktree diff, mtimes when useful, and remote branch state. Another Agent may be editing the same checkout. Do not `reset --hard`, restore, format, or overwrite those files until ownership is resolved; move your work to an isolated worktree when necessary.
- Clean up only the worktrees, ports, browser sessions, and processes owned by the current task.

Historical case: [`../history/2026-08-27-seed-glm-stage1-and-brand-asset-retrospective.md`](../history/2026-08-27-seed-glm-stage1-and-brand-asset-retrospective.md).

### User-facing work must externalize human thinking

Any change to visible website content, page structure, interaction, copy, navigation, comparison, explanation, or feature automatically loads [`human-thinking-web-expression-contract.md`](./human-thinking-web-expression-contract.md).

This is a project invariant, not an optional style preference. Even a request such as “add one item to this page” must consider:

- the reader’s mental model and next action;
- the role of the page or section in the whole-site journey;
- the primary reading path versus secondary depth;
- information-density allocation;
- the semantic shape of the information;
- whether HTML, a table, a process map, a hierarchy, an evidence ladder, progressive disclosure, or another web-native form communicates it better than appended prose;
- the browser visual acceptance gate after implementation.

Before implementation, form a concise **Page Expression Brief**. Broad user-facing changes should expose it in the PR description or design note; small changes may use a compact version, but they may not skip the reasoning entirely.

The default sequence is:

```text
expression goal
-> page role and reader state
-> primary path
-> density layers
-> semantic HTML / visual form
-> implementation
-> browser UI gate
-> exact-head Preview
```

Do not wait for the owner to repeat “use HTML well,” “keep the page coherent,” or “balance information density.”

## 3. Deposit reusable experience where it belongs

After solving a meaningful problem, evaluate whether the result has durable reuse value. Useful material can include:

- a successful reusable workflow;
- a repeated or surprising failure mode;
- the smallest reliable diagnostic sequence;
- a non-obvious architecture tradeoff;
- a provider/runtime boundary;
- an invariant worth automatically protecting;
- an approach that looked reasonable but failed, when knowing why will prevent repetition.

**Do not hard-code one mandatory destination for all experience.** First inspect the repository's existing knowledge and execution structure, then choose the representation future Agents are most likely to discover and correctly use.

Prefer, in roughly this order:

- executable invariant -> test, guard, schema, script, config check, or manifest;
- recurring operational procedure -> existing runbook/workflow/skill;
- durable architecture decision -> current architecture doc or ADR/decision record;
- repeated failure/recovery pattern -> troubleshooting/runbook or a well-indexed incident/case record;
- repository navigation/ownership lesson -> Agent entrypoint or repository map;
- short-lived continuation state -> dated handoff only when another Agent truly needs it;
- globally reusable user preference -> shared harness/user policy rather than project duplication;
- reconstructible ephemeral state (temporary logs, current SHA, transient deployment status) -> usually do not persist.

Prefer updating an existing canonical document over creating another near-duplicate file. If a new durable document is necessary, connect it to the repository's existing Agent index/navigation so the next Agent can actually find it.

Do not mechanically create memory, case, ADR, or handoff files after every task. Persistence should be earned by future utility.


## 3.1 Authority freeze, moving refs, and retrospective handoff

When a task depends on a dated audit, plan, or execution snapshot, treat the
snapshot as a bounded evidence object rather than as a claim that the repository
will remain unchanged.

Before acting:

1. identify the live repository/ref and the bounded comparison baseline
   separately;
2. fetch the current PR/repository state instead of inferring state from a user
   summary, branch name, or old document;
3. record exact commit SHAs and, for important files, blob/file identities;
4. read the named parent standards and the parent repository policy they
   reference;
5. write the precedence between owner instruction, frozen scientific evidence,
   active object-owning lineage, governance, generated projections, provider
   metadata, and website copy;
6. evaluate each checkbox against its acceptance criterion, not against the fact
   that a previous Agent marked it complete.

If main moves after the snapshot:

- do not rewrite the old baseline into the new head;
- finish the bounded audit against the pinned baseline and record later movement as
  drift, or open a successor snapshot and re-run the affected rows;
- do not combine current claims from one SHA with route/content observations from
  another without labeling the boundary.

When depositing experience, classify it before writing. Use three explicit retention classes so temporary state cannot masquerade as policy:

- **A — durable cross-task rule:** expected to remain useful across future tasks/months. Put it in the existing current owner, Agent router, executable guard, or shared user-policy/memory system when a real memory-write capability exists.
- **B — project-scoped lesson:** valid because of this repository/experiment architecture or lineage. Put it in the existing project runbook/current owner and/or an indexed history case; do not generalize it into account-wide truth.
- **C — transient state:** current PID/GPU occupancy, branch/PR head, provider status, current round/percentage, temporary worktree path, one-time ETA. Keep it only in a bounded handoff/history receipt when needed to reconstruct the incident; never promote it to current policy or long-term memory.

Then choose the destination:

- cross-task invariant -> existing current owner or executable guard;
- recognizable trigger -> scenario registry plus the existing owner;
- incident and causal explanation -> indexed history case;
- short-lived continuation -> dated handoff only when another Agent needs it;
- current PID, GPU occupancy, branch head, provider status, or transient ETA ->
  do not promote to durable policy or long-term memory.

A retrospective is not complete until its history case is indexed, its durable
rules are placed in the current owner, its trigger is discoverable, and volatile
state is explicitly excluded.

### Correction-to-action witness

Use the marker `REPEAT-CORRECTION` when the same owner correction or failure class recurs. Before the next affected action, put one compact witness in the existing task/PR record:

`trigger -> current owner -> checked artifact -> allowed next action -> invalidation cue`

The artifact is the actual command argument/readback/test result, not “read AGENTS”. For shell failures it includes the outer interpreter; for a source export it includes its classification and base/tree mapping; for release claims it includes the tested head and deployment identity. Do not store credentials or full unrelated process arguments.

This is execution of an existing safeguard, **not a new scientific gate or a request for another acknowledgement**. Reuse stable evidence while its fingerprint matches, and refresh only the facts that can have changed. A repeat means that retrieval, abstraction, enforcement, or use-site execution failed; identify which instead of appending the same rule again.

### Concurrent registries allocate identity at integration time

Treat manually numbered shared registries—case libraries, ADR/incident/rule IDs, numbered evidence records, and similar append-only indexes—as shared integration data, not branch-local counters. Before assigning a new ID, read the exact current base and overlapping work when it is relevant. A branch-local `max + 1` is only provisional while other writers can advance the same registry.

Before merge or other shared-ref publication, inspect the **combined candidate tree** for duplicate IDs, duplicate anchors, and references that still point at the old identity. When a collision exists, preserve both factual records and renumber the later/coherent block plus its references; do not drop another Agent's record, overwrite the shared branch, or treat the collision as proof that one case is obsolete. If uniqueness is mechanically checkable, wire it into the normal repository Gate so concurrent branches can fail at integration instead of silently corrupting the registry.

This rule governs durable repository identity only. PR heads, temporary ports, current PIDs, current provider status, and other C-class state remain transient and must not be converted into permanent registry facts merely to make the numbering convenient.

### Progress reports have bounded meanings

For repeated “continue / where are we?” requests, report the current goal, the last verified artifact, the actual missing condition, and the next authorized action. Explain the work in Chinese before identifiers unless the owner requests another language. Do not substitute schema discovery, repeated polling, or another plan for execution.

“Almost done”, “last gate”, and an unmeasured 80%/90% are not acceptance evidence. Use a phase/acceptance checklist; keep implementation, local testing, PR, hosted acceptance, Production, and real-reader feedback separate. Report test suite, ref/tree, and environment together; the total number of green tests is not a measure of understanding. Do not promise later background delivery without an actual supported automation.

For conversation retention, distinguish visible user/tool evidence, independently fetched repository evidence, prior assistant summaries, and unavailable/redacted material. Summaries may locate evidence but cannot fill missing commands, outcomes, or responsibility attribution. A repository write, a personal-context search, and a real long-term-memory write have different receipts.

## 4. Make recurring lessons triggerable

A reusable lesson is incomplete if future Agents cannot recognize **when** it should become active.

When a lesson is valuable only in a recognizable situation:

1. describe the trigger using observable cues rather than a vague “remember this later” note;
2. add or refine a concise route in [`scenario-trigger-registry.md`](./scenario-trigger-registry.md) when the lesson is broad enough to deserve a global trigger;
3. otherwise route it through the task-specific index/runbook that a future Agent will naturally load;
4. keep detailed truth in the existing owning policy/runbook/test/history case rather than copying it into every router;
5. include the automatic response and a refresh cue when the knowledge is time-sensitive;
6. prefer executable protection when a machine-checkable invariant exists.

The registry should be scanned at task start **and re-scanned when the task changes state**: a new blocker appears, an overlapping PR is discovered, a provider/deployment boundary is crossed, `main` moves before final acceptance, a deterministic Gate reveals a hidden invariant, a current/latest claim becomes material, or the finished task appears to have produced a reusable lesson.

This is progressive disclosure: recognize the situation first, then load only the relevant material.

## 5. What a useful deposited lesson should contain

When prose is the right representation, preserve the parts that make the lesson reusable:

- **situation / trigger** — when this lesson matters;
- **result** — what actually worked or failed;
- **why** — the causal explanation or evidence, not just the outcome;
- **reproduction / procedure** — the smallest reliable sequence another Agent can follow;
- **failed approaches** — only the ones whose failure teaches something reusable;
- **boundaries** — what is project-specific, provider-specific, temporary, or still uncertain;
- **future refresh cue** — what should be re-checked against current docs/research instead of frozen as timeless truth.

## 6. Core judgment rule

> Do not try to make the Agent remember everything. Make it able to solve forward, know when current knowledge may be stale, know where to look, and leave genuinely reusable knowledge where a future Agent will naturally discover and act on it.

Apply this principle through the repository's existing structure rather than creating a second governance system beside it.
