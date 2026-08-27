# 2026-08-27 Results zero-context and tool-boundary retrospective

Status: **historical case record**. This document preserves the reusable lessons from the 2026-08-27 Results-page editing conversation. It does not override `docs/agents/current/*`, executable repository truth, or live provider/experiment state.

## Scope

This case began after the action-wrapper incident had already been technically explained correctly. The remaining problem was not factual accuracy; it was that the page still assumed the reader already knew what the project was doing.

The work then exposed four additional failure modes:

1. a paragraph can be technically clear while still being impossible for a zero-context reader to enter;
2. causal attribution is weak if the reader is not first given model scale, training scale, evaluation scale, and exact artifact lineage;
3. nearby historical experiments can be accidentally substituted for the artifact actually used in a later formal comparison;
4. a convenient local Git/terminal workflow does not justify escalating a cloud-side repository task onto the user’s computer.

The final page change was shipped in PR #280 (`docs(results): add zero-context setup before format-error attribution`) after the earlier event-first reframing in PR #278. The production merge for #280 was `1f6b91f22a01541ad57fe473675a605e0a74f511`.

## What changed in the reader model

The first improvement had already moved the section away from an internal forensic heading and toward an incident-first title:

```text
实验里出现了一次动作格式错误：发生了什么，为什么会发生，我们怎么修复
```

That was better, but still not sufficient. The opening still began with:

```text
PRIMARY-v1 正式评测里……
```

For someone who had never seen OpenEvo, SEED, WebShop, BASE, SD-LoRA, or PRIMARY-v1, this was clear only after accepting several undefined assumptions.

The successful rewrite moved the entry point one layer earlier:

```text
we are testing whether OpenEvo can let Qwen2.5-7B-Instruct
learn from its own successful WebShop trajectories
-> train a small SD-LoRA adapter
-> compare untouched BASE vs the same model + adapter
on the same WebShop tasks
-> PRIMARY-v1 is one formal evaluation in that pipeline
-> then explain the formatting incident
```

The durable lesson is:

> “Clear to a project participant” and “clear to a first-time reader” are different standards.

A first-reader section should let someone answer **what experiment is being run and why** before it asks them to understand an incident inside that experiment.

## Friction 1 — event-first was better, but still too late

The user correctly rejected a forensic heading that began with internal mechanism language. Reframing the title around “a formatting error occurred” fixed the first hierarchy problem, but the next draft still started with PRIMARY-v1 and therefore assumed project context.

The correct ordering became:

```text
experiment purpose
-> model/task/intervention/comparison
-> concrete incident
-> analysis
```

Do not mistake “the first sentence describes the accident” for “the section is zero-context readable.” If the accident itself contains undefined experiment shorthand, one more layer of context is still missing.

## Friction 2 — responsibility analysis lacked the setup needed to judge alternatives

The section originally said the drift appeared in raw BASE generation rather than adapter/backend rewriting. That attribution was evidence-backed, but the reader had not been told enough to evaluate obvious alternatives such as:

- Was this a tiny 3B model that simply failed instruction following?
- Was the model barely trained?
- Did a small or unstable LoRA update teach the wrong output format?
- Was PRIMARY-v1 itself a training run or only an evaluation?

The fix was to put the relevant experiment scale immediately before causal attribution.

For the historical PRIMARY-v1 comparison:

- base model: **Qwen2.5-7B-Instruct**;
- formal comparison: **128 tasks × 2 arms = 256 PRIMARY episodes**;
- BASE arm: no adapter loaded;
- comparison adapter: the **H1.38B final SD-LoRA**, not the earlier H1.36 adapter;
- H1.38B sealed training stream: **16 successful rollout records**;
- task identities: **8**;
- independent successful trajectories: **2 per task**;
- training order: **8 sequential increments**;
- epochs: **1**;
- optimizer limit: **at most 16 steps per increment**;
- final effective rank: **32**.

These numbers do not prove the cause by themselves. Their job is to make the natural hypotheses visible and testable.

The stronger evidence comes next: a frozen BASE episode recorded `adapter_loaded=false` while the raw completion still emitted `[action] search[...]`, and a later step returned to `<action>...</action>`. Therefore the existence/origin of `[action]` drift cannot require the SD-LoRA adapter.

Keep the stronger boundary too:

> This does not prove that training can never change wrapper frequency. Origin and frequency are separate claims.

## Friction 3 — the wrong nearby experiment was almost used as the training context

H1.36 was highly relevant because it had already documented wrapper drift and later introduced compatibility handling. But the formal PRIMARY-v1 comparison did **not** use the H1.36 adapter.

The actual frozen comparison used the later **H1.38B final SD-LoRA**.

This distinction matters because otherwise a page can accidentally answer a causal question using the wrong training budget or artifact lineage.

The correct roles are:

```text
H1.36
= historical evidence that 7B wrapper drift was already known

H1.38B final SD-LoRA
= actual frozen adapter compared against BASE in PRIMARY-v1
```

Durable rule:

```text
historical prior-knowledge source
!= artifact used in formal evaluation
!= artifact whose training budget should be quoted
```

Before publishing model/training attribution, resolve the exact artifact identity from the formal comparison config rather than borrowing settings from the nearest experiment that discussed the same failure mode.

## Friction 4 — a useful scientific regression lock caught a wording drift

While refining the prose, an existing test still required the precise boundary sentence:

```text
不声称 SD-LoRA 绝不可能改变 wrapper frequency
```

The new copy initially conveyed the idea in different wording, but the regression test failed. The right response was not to weaken the test. The exact scientific boundary was restored in the deep evidence layer while the first-reader layer stayed plain-language and event-first.

This is a useful pattern:

```text
plain-language entry can change
technical claim boundary can remain exact
regression test can protect the exact boundary
```

A copy test is not automatically stale just because it blocks a rewrite. First ask what invariant it protects. If it protects a real scientific distinction, preserve it and move it to the correct reader depth.

## Friction 5 — local-machine escalation added noise without adding necessary capability

The repository change could be completed using the GitHub connector plus Vercel verification. During one small follow-up wording change, Remote Desktop Commander was nevertheless used to reach the user’s Mac checkout because a one-line local Git patch felt more convenient than a full-file GitHub API update.

That escalation was not necessary.

It created additional friction:

- the first local command used shell syntax that was incompatible with the active fish shell;
- the isolated worktree then lacked `vitest`, so the attempted local test could not run;
- the decisive verification still came from the GitHub/Vercel pipeline;
- the task did not depend on any uncommitted local file or device-only state.

The user explicitly questioned why the local-device plugin had been used for work they expected to happen in the web/GitHub path. That concern is correct and should change the default workflow.

Durable tool-surface rule:

```text
GitHub-owned state -> GitHub connector
Vercel-owned state -> Vercel connector
user-device state -> Remote Desktop / local tools only when the task actually depends on it
```

Do not access a user device merely because local shell/Git ergonomics are nicer. Broader access should be justified by task necessity, not convenience.

If the user says “在网页端 / GitHub 里做”, treat that as an execution-scope constraint unless a real blocker makes escalation necessary.

## Friction 6 — sequential small writes caused unnecessary provider churn

The Results change went through several small branch commits: initial copy, an evidence-kind correction, a test update, and a final wording-boundary fix. Because the branch was deployment-eligible, each ref update could trigger another Preview.

Some of those fixes were unavoidable once the gate exposed them, but the sequence illustrates why repository write hygiene matters.

The better default for coherent documentation work is:

```text
read all relevant owners
-> prepare all intended file contents
-> create blobs/tree/commit without moving a deployable ref
-> move/create the branch ref once
-> open PR
```

Provider-triggering branch writes should be the last step after the coherent change is assembled, not part of iterative capability discovery.

## Successful pattern 1 — zero-context before incident detail

The final entry explains, in plain language:

- what WebShop is doing at the task level;
- what OpenEvo is trying to change;
- what BASE means;
- what the adapter means;
- why two versions of the same 7B model are compared;
- that PRIMARY-v1 is an evaluation, not a new training run.

Only then does it describe `[action]` vs `<action>`.

This gives a first-time reader a mental model before asking them to inspect a failure inside that model.

## Successful pattern 2 — expose the natural alternative explanations before ruling them out

A good causal explanation should not jump directly to blame. It should make the obvious alternatives visible:

```text
model too weak?
training too small?
training taught the bad format?
backend rewrote it?
prompt asked for it?
parser/harness failed to handle it?
```

Then attach evidence to each layer.

In this case, the decisive origin evidence was the no-adapter raw BASE completion. Training scale was useful context, but not the proof.

## Successful pattern 3 — separate four different claims

The final wording keeps these separate:

```text
origin: [action] can appear without the SD-LoRA adapter
frequency: training might still change how often it appears
historical knowledge: H1.36 already documented wrapper drift
integration responsibility: PRIMARY-v1 did not preflight known real-output/parser compatibility
```

Collapsing any two of these into one sentence makes responsibility language much less trustworthy.

## Successful pattern 4 — preserve user narrative intent while correcting the scientific stage

The user naturally described the issue as something that happened “in training.” The better public wording used “实验里” because the specific all-zero incident became consequential in formal evaluation/integration, while training-data inclusion was only one part of the later attribution investigation.

The useful behavior is:

> Preserve the reader-facing narrative the user is asking for, but quietly choose the stage label that the evidence supports.

Do not force the user to accept an inaccurate stage name just to preserve their exact wording, and do not use the correction as an excuse to ignore the requested narrative structure.

## Successful pattern 5 — progressive disclosure kept both readability and rigor

The page now follows:

```text
zero-context experiment explanation
-> concrete incident
-> ordered investigation
-> exact technical attribution
-> evidence boundary
```

This allowed the main path to stay readable while still preserving phrases such as:

```text
模型自身有已知 wrapper 漂移，而我们的正式集成没有提前做兼容性预检。
```

Technical precision did not need to disappear; it needed to move to the correct reader layer.

## Successful pattern 6 — claim-local evidence and exact lineage

The revised section links the model-generation attribution directly to:

- the frozen PRIMARY comparison config;
- the H1.38B training config;
- the raw BASE adapter receipt;
- the raw completion showing `[action] -> <action>`;
- the inference backend code.

This is stronger than a generic evidence appendix because the reader can see exactly which source supports the claim they are reading.

## Successful pattern 7 — exact-head provider verification remained the release authority

The final branch Preview reached READY, the PR was merged, Production ran the repository and browser gates, and the public Results HTML was fetched after Production became READY to confirm the new copy was actually present.

This preserved the distinction:

```text
source edit
!= test pass
!= Preview READY
!= merge
!= Production READY
!= public HTML verified
```

For public research copy, the last step matters because the goal is not merely to merge prose; it is to change what readers actually receive.

## Reusable SOP for future Results incident/attribution edits

```text
1. resolve the exact scientific artifact and comparison lineage
2. write a one-sentence zero-context description of the experiment
3. explain task, model, intervention, and comparison before phase names
4. state the concrete incident in ordinary language
5. list the natural alternative explanations
6. add model/training/evaluation scale needed to judge those alternatives
7. use raw/model/backend/training/harness evidence to assign responsibility
8. keep origin, frequency, prior knowledge, and integration responsibility separate
9. preserve exact scientific boundaries in the technical layer and tests
10. keep deep forensics below the main reader path
11. use GitHub/Vercel connectors for cloud-owned state
12. use a user-device tool only when local-only state is materially required
13. batch coherent repository edits before the first deployable ref move
14. verify exact-head Preview, merge, Production, and public HTML as separate states
```

## Trigger for future Agents

Load this case after current policies when any of these are true:

- a Results section is understandable only to someone who already knows the project;
- an incident explanation starts with a phase/code/artifact name rather than the experiment’s purpose;
- responsibility is being assigned without model/training/evaluation context;
- a historical experiment and the actual formal comparison artifact are easy to conflate;
- a copy regression test blocks a rewrite and it is unclear whether the test is stale or protecting a claim boundary;
- an Agent is about to use Remote Desktop/SSH/local checkout for a task that appears fully solvable through GitHub/Vercel connectors;
- several small repository writes are about to move a deployment-eligible branch repeatedly.

Current policy owners for the durable rules are:

- `docs/agents/current/audience-centered-technical-copy.md` — zero-context reader and causal-context requirements;
- `docs/agents/current/project-agent-operating-principles.md` — narrowest execution-surface/tool-boundary rule;
- `docs/agents/README.md` — discovery route for future Results work.
