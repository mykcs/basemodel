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

Tool discovery and capability testing should be read-only whenever a read path exists. This rule is especially important on repositories with Git-connected deployment because every unnecessary ref mutation can also consume build/review attention.

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
