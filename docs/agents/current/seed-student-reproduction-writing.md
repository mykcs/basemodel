# Student-first SEED reproduction writing guide

Last reviewed: **2026-08-11**

Use this file when changing `/guide/`, SEED onboarding, or site-wide copy that teaches the SEED worked example.

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

A planning range is not a measured RTX 3090 benchmark. A four-GPU method reproduction is not automatically paper-hardware reproduction. An 8×A100 run is a hardware substitution when the paper used 8×A800.

## Migration rule

Prepare code so GPU-count changes are configuration changes rather than a second implementation. Preserve model/data/evaluation/seed/provenance and rerun:

```text
preflight -> DRY_RUN -> short run -> full run
```

on the new machine before spending time on a complete eight-GPU experiment.
