# Student-first SEED reproduction writing guide

Last reviewed: **2026-08-12**

Use this file when changing `/guide/`, SEED onboarding, reproduction case studies, or site-wide copy that teaches the SEED worked example.

## Reader

Write for a student who understands basic ML terms but may not know how to decide whether an experiment has actually been reproduced.

The reader often uses an Agent/AI as a lab assistant. Give observable acceptance criteria so the Agent can judge evidence instead of offering vague reassurance.

## Mainline

The default worked example is one continuous experiment:

```text
4×RTX 3090 24GB offline lab server
-> prepare offline bundle on an online workstation
-> ALFWorld smoke
-> WebShop smoke
-> Stage-1 data
-> SFT
-> four-GPU RL short run + profiling
-> full SEED runs
-> same-condition GRPO controls
-> stop if the research question is answered
-> migrate to 8×A800/A100 only if memory or projected runtime is a real blocker
```

If the four 3090s finish the planned full training, evaluation, and controls, say plainly: **“我们在这个 3090 上就全部做完了。”**

Do not make cloud rental or eight-GPU hardware feel mandatory merely because the paper used it.

## Page-writing pattern

For each experiment stage, prefer this order:

1. **现在做什么** — one action only.
2. **复制哪段命令** — runnable command or exact file/path.
3. **看到什么算通过** — beginner-observable output, artifact, count, or exit status.
4. **没过先查什么** — smallest likely diagnostic before changing training logic.
5. **必要时问 Agent** — provide the pass criteria and raw output; ask for PASS / FAIL / insufficient evidence and one next diagnostic command.

Avoid teaching the site as disconnected feature blocks. Every page should tell the reader how it helps the current experiment and where to return next.

## Reproduction-case pattern: current path + failure path

When a reproduction has already gone through several debugging rounds, do **not** rewrite the page into a fictional clean-room tutorial that hides how the current runbook was discovered.

Use two parallel tracks:

### Track A — current shortest path

Keep only the currently preferred route:

- exact research claim;
- pinned source / model / data;
- asset acquisition and cache;
- runtime requirements;
- ordered validation gates;
- explicit success criterion;
- current next benchmark / experiment.

This track answers: **“If I start now, what should I do?”**

### Track B — historical debugging evidence

Keep the failures that changed the architecture or produced a reusable lesson:

- symptom;
- initial/wrong hypothesis when useful;
- actual failing layer;
- final fix;
- durable rule.

This track answers: **“Why is the current path designed this way, and how do I avoid the same dead end?”**

Do not include every transient typo. Include failures that changed the dependency graph, proof standard, transport, asset path, runtime policy, or Agent behavior.

### Evidence boundary between the tracks

The current path may contain planned future gates. Mark those gates as **pending** until real artifacts exist.

Do not turn:

- a static code review into a runtime claim;
- an environment-ready state into a benchmark result;
- a real rollout into a full mechanism proof;
- a mechanism proof into official framework E2E;
- a partial method reproduction into paper-hardware reproduction.

Historical bugs stay historical after they are fixed. Do not remove them merely because the final path is clean.

## Why the OpenEVO case is a good Reproduction C example

The OpenEVO × WebShop / ALFWorld case should be treated as **method reproduction with explicit engineering substitutions**:

- the scientific target is the method/agent-evolution chain on comparable environments;
- the lab execution machine is 4×RTX 3090 rather than the paper's original hardware;
- an online Mac may acquire assets for an offline GPU server;
- a benchmark adapter may be implemented to match OpenEVO's environment abstraction;
- every substitution must be reported instead of silently being called “strict reproduction.”

The case page lives at:

```text
/guide/reproduction-c/openevo/
```

Its main teaching structure is intentionally dual-track: current runbook on one side, real debugging history on the other.

## Anti-loop writing rule

A debugging guide should teach the reader when **not** to keep trying the same thing.

Useful rule to expose explicitly:

> Same error class + same source + same machine/network + unchanged conditions twice → stop retrying and change one causal variable.

Also teach failure-layer localization before suggesting fixes:

```text
scheduler/admission
→ tool/agent invocation
→ authentication
→ transport
→ source materialization
→ parser/patch/schema
→ data
→ runtime/interpreter
→ dependencies
→ index/database
→ model
→ GPU
→ real component
→ mechanism
→ official E2E
```

This is more useful than a long unranked troubleshooting list.

## Tone

Prefer short, concrete sentences that sound like a lab mentor speaking to a student.

Avoid abstract slogans and rhetorical constructions such as:

- “不是……而是……” when a direct instruction is clearer;
- “它的价值是……” when the next action can be stated directly;
- “把 X 翻译成 Y 的语言” when the concrete operation is known;
- dense terminology before the reader has encountered the corresponding experiment step.

Put the conclusion or next action first. Explain the reason immediately after it. Keep raw facts and evidence after the user knows why they matter.

## Evidence boundaries

Keep these levels explicit:

- paper-reported condition/result;
- current official repository behavior/default;
- time-sensitive market information;
- engineering planning estimate;
- measured result from the user's real machine.

For multi-agent/runtime cases, also separate:

- static validity;
- environment readiness;
- real component smoke;
- mechanism proof;
- official end-to-end proof;
- sustained/scale result.

A planning range is not a measured RTX 3090 benchmark. A four-GPU method reproduction is not automatically paper-hardware reproduction. An 8×A100 run is a hardware substitution when the paper used 8×A800.

## Migration rule

Prepare code so GPU-count changes are configuration changes rather than a second implementation. Preserve model/data/evaluation/seed/provenance and rerun:

```text
preflight -> DRY_RUN -> short run -> full run
```

on the new machine before spending time on a complete eight-GPU experiment.

## Related Agent evidence

- `docs/agents/history/2026-08-12-openevo-reproduction-debugging-lessons.md` — why the dual-track pattern was adopted.
- `docs/agents/current/seed-guided-research-workflow.md` — current SEED worked-example product flow.
- `docs/agents/current/scenario-trigger-registry.md` — scenarios that should load these policies.
