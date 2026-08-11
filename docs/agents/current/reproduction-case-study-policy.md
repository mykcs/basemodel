# Reproduction case-study policy

Last reviewed: **2026-08-12**

Load this policy when adding or materially updating a reproduction case after real execution/debugging has already happened.

## Trigger

Use this pattern when one or more of these is true:

- the experiment has crossed multiple runtime blockers;
- the current runbook is materially different from the original plan;
- a failed hypothesis changed transport, data, runtime, model, adapter, or proof design;
- the owner explicitly asks to preserve successes and failures;
- the case is meant to teach an Agent/student how to avoid dead ends, not only copy commands.

## Required page structure

A mature reproduction case should preserve **two simultaneous truths**.

### A. Current shortest path

Answer:

> If the reader begins today, what should they do?

Include:

- research claim / reproduction mode;
- source/model/data pins;
- execution assets and transport;
- ordered gates;
- positive pass evidence;
- current pending boundary;
- next benchmark / scale step.

Delete obsolete workarounds from this track.

### B. Historical debugging path

Answer:

> Why does the current path look this way?

For each incident worth keeping, capture:

```text
symptom
→ first/wrong hypothesis (when informative)
→ actual failing layer
→ final fix
→ durable lesson
```

Keep incidents that changed architecture, evidence standards, asset handling, runtime policy, Agent behavior, or scientific interpretation.

Do not preserve every typo or one-off command mistake.

## Evidence rule

The case must expose the strongest currently verified level.

Examples:

```text
static source review
< environment ready
< real component smoke
< mechanism proof
< official end-to-end
< sustained/scale result
```

Do not narrate pending work as completed merely because code for that stage exists.

When a new real artifact arrives, update the **current evidence boundary**. Do not rewrite historical failures into a cleaner fictional past.

## Anti-dead-end rule

If a troubleshooting path reports the same error class twice under unchanged causal conditions, the case should teach the reader to stop retrying and change one causal variable.

Prefer failure-layer localization over unordered troubleshooting lists:

```text
scheduler/admission
→ tool/agent
→ auth
→ transport
→ source
→ parser/schema/patch
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

## Reproduction-mode integrity

Strict reproduction, method reproduction, and modern rerun must remain distinct.

For **method reproduction / 复现 C**:

- engineering substitutions are allowed when they preserve the research question;
- hardware/network/adapter/runtime substitutions must be disclosed;
- comparison variables and budgets must still be controlled;
- a method-reproduction success is not renamed as exact paper-hardware reproduction.

## Current worked example

OpenEVO × WebShop / ALFWorld:

- page: `/guide/reproduction-c/openevo/`;
- historical evidence: `docs/agents/history/2026-08-12-openevo-reproduction-debugging-lessons.md`;
- broader student writing rules: `docs/agents/current/seed-student-reproduction-writing.md`.

Use this case as the reference pattern when a future reproduction page has a similarly rich debugging history.
