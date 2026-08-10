# Scenario trigger registry

Last reviewed: **2026-08-11**

This file is a **just-in-time trigger router**, not a second governance system.

Future Agents should scan it at the start of non-trivial work after `AGENTS.md` / `docs/agents/LATEST.md`. Match the current task against the situations below and load only the relevant current docs, tests, scripts, provider state, and fresh external evidence.

**Do not wait for the owner to repeat these reminders.** If the situation matches, trigger the corresponding behavior automatically.

Precedence remains:

```text
current user instruction
> live provider state / executable repository truth
> docs/agents/current/*
> historical case evidence
```

A trigger routes attention; it does not override newer evidence or explicit user instructions.

---

## TRIGGER: deployment-budget / Preview / Cloudflare

### Cues

Any task mentioning or implying:

- Cloudflare Pages / Workers;
- Preview URL, `pages.dev`, deploy, release, publish;
- build quota / build count / “500 builds” / avoid builds;
- Git-connected deployment, Direct Upload, Wrangler;
- Vercel Preview or hosting migration.

### Automatic response

1. Read `hosting-architecture.md`, `vercel-preview-migration-plan.md`, and `deployment-policy.md` before changing deployment behavior.
2. Treat **Cloudflare Pages Git builds as budgeted/expensive**. Do not intentionally trigger one unless the owner has explicitly authorized that use after being told why it is necessary.
3. Ordinary Preview defaults to the validated Vercel Preview-only path while it is available.
4. Use Cloudflare Direct Upload only when Cloudflare-specific fidelity / `pages.dev` is actually required or Vercel is unavailable; follow the repository-owned command/runbook.
5. Never silently fall back from an unavailable Direct Upload path to a Git-integrated Cloudflare Preview.
6. Distinguish source sync, build validation, Preview state, Production state, and account-level quota evidence in completion reports.
7. Never claim an exact remaining Cloudflare build counter without authoritative account evidence.

### Refresh cue

Hosting products, quotas, build semantics, and provider limits are time-sensitive. Verify current first-party provider docs/state when the answer depends on them.

---

## TRIGGER: SEED / ALFWorld / WebShop / reproduction / GPU choice

### Cues

Any task involving:

- SEED reproduction;
- ALFWorld or WebShop;
- Qwen2.5-3B-Instruct in the SEED context;
- strict reproduction vs method reproduction vs modern rerun;
- 4×RTX 3090, 8×A800 80GB, 8×A100 80GB;
- deciding whether local hardware is enough before renting cloud GPUs.

### Automatic response

1. Read `seed-guided-research-workflow.md` and `product-and-research-integrity.md`.
2. Keep one continuous student experiment path instead of teaching the site as disconnected feature blocks.
3. Prefer the hardware the researcher already has first. If a 4×3090 machine completes the planned full training, evaluation, controls, and provenance record, say plainly that the experiment is done there; do not make eight GPUs mandatory merely because the paper used them.
4. Treat 8×A800 80GB as the paper-hardware target and 8×A100 80GB as a hardware substitution unless evidence says otherwise.
5. Separate “the code runs”, “the training chain is healthy”, “the method effect is reproduced”, and “the run is paper-hardware comparable”.
6. Require observable pass criteria and provenance: code revision, data/model hashes, config, hardware/topology, logs, checkpoint save/resume, evaluation results, and appropriate controls.
7. If a newer model is proposed, first ask whether the task is strict reproduction, method reproduction, or a modern rerun. Do not silently upgrade the paper checkpoint.

### Refresh cue

Paper/repository defaults can change; use the current official SEED repository and paper for exact commands/defaults. Hardware availability and prices must be re-verified separately.

---

## TRIGGER: offline lab server / SFTP / no outbound internet

### Cues

Any experiment where:

- the GPU server has no public internet;
- code is edited on a workstation and transferred by SFTP/SSH;
- GitHub is reachable from the workstation but not the server;
- large models/data/dependencies must be staged offline.

### Automatic response

Treat the **online workstation as the preparation + Git truth source** and the **GPU server as the offline execution target**.

Default sequence:

```text
freeze Git revision
-> prepare Linux-compatible dependencies/model/data/indexes online
-> hash the bundle
-> SFTP/SSH transfer
-> verify hashes + GPU topology on server
-> force offline runtime mode
-> smallest environment smoke
-> smallest Stage-1 data path
-> SFT
-> short multi-GPU RL + save/resume + profiling
-> full run + control
-> export compact provenance/results back to the workstation
```

Additional rules:

- do not assume the workstation OS can prepare binary wheels for the Linux/CUDA server; use a compatible online Linux staging environment when needed;
- a physical Ethernet cable controls workstation↔server transfer, not intra-server GPU topology; inspect `nvidia-smi topo -m`;
- WebShop data/search-index preparation and ALFWorld data must be present before the server is isolated;
- Stage-1 analyzer/network dependencies must be solved explicitly (approved online generation or an internal compatible endpoint); do not discover this after expensive training starts;
- SFTP is deployment/transfer, not version control: experiment outputs must still trace to a Git revision.

---

## TRIGGER: time estimate / GPU rental cost / current compute catalog

### Cues

Any request asking:

- how many hours an experiment will take;
- how much rented compute will cost;
- which exact GPU SKU to rent today;
- whether a provider currently has A800/A100/4090/3090 or another SKU;
- whether local hardware saves money.

### Automatic response

1. Search current first-party provider information; timestamp the snapshot.
2. Distinguish **public catalog** from **logged-in real-time inventory**.
3. Give an exact decision ladder when possible: which SKU for smoke, reduced validation, paper-scale substitute, strict-hardware target.
4. Show the arithmetic behind time/cost estimates. Label paper-reported workload separately from engineering throughput assumptions.
5. Never present a planning range as a measured benchmark.
6. Once the real machine has at least ~5 stable updates after warm-up, replace the prior with measured timing:

```text
T_RL ≈ median(stable update time) × target updates
T_total ≈ preparation/SFT + T_RL + evaluation
first-run reservation ≈ T_total × appropriate buffer
```

7. When local compute can absorb setup, smoke tests, SFT, reduced RL, or profiling, show how that reduces paid-cloud time rather than treating cloud rental as the default.

---

## TRIGGER: beginner-facing technical writing / broad UI rewrite

### Cues

Any request to:

- make the site easier for a technical beginner/student;
- rewrite Guide/onboarding/copy;
- “make it sound human”;
- add a new educational feature or concept block;
- change one part of a workflow that affects the surrounding reading order.

### Automatic response

1. Read the current product/research and SEED workflow docs before editing.
2. Rewrite the **whole affected journey**, not only the paragraph explicitly criticized, when local patching would make the page feel fragmented.
3. Put the next action first. Prefer short direct lab-mentor language over abstract slogans.
4. For experiment steps, use the pattern:
   - what to do now;
   - exact command/path/action;
   - what observable evidence counts as PASS;
   - what to check first if it fails;
   - what evidence to paste to an Agent if help is needed.
5. Avoid rhetorical filler such as “不是……而是……” / “它的价值是……” / “把 X 翻译成 Y 的语言” when a concrete instruction is available.
6. Check surrounding pages/navigation so the site still reads as one system after the change.

---

## TRIGGER: actionable content / code blocks / generated artifacts

### Cues

Any UI that displays something the user is likely to reuse immediately:

- code/commands;
- prompts;
- paths, SHAs, IDs, URLs;
- JSON/YAML/config;
- citations/BibTeX;
- generated task summaries, decision memos, comparison exports, hardware estimates;
- files or structured results.

### Automatic response

Before calling the feature complete, ask:

> **If the user needs this exact thing in the next terminal, editor, Agent, paper, or tool, what do they click?**

Then expose the action **at the content location**:

- copy for code/commands/prompts/IDs/structured text;
- open for sources/URLs;
- download for files/exports;
- share for canonical state URLs;
- save/snapshot for durable project state when the product supports it.

Do not make the user manually retype, drag-select long blocks, reconstruct URLs, or hunt elsewhere on the page for the action.

Preserve text selection, keyboard access, mobile usability, clear success/failure feedback, and hydration boundaries. Prefer a shared primitive / automatic safe enhancement over each feature inventing its own clipboard behavior.

If a current task branch already contains a dedicated actionable-content policy/test, treat that implementation as executable truth and keep the rule aligned with it.

---

## TRIGGER: blocked Agent / unavailable tool / failed approach

### Cues

A tool cannot access a provider, a connector is missing, credentials are unavailable, a build/deploy route fails, or a first implementation approach does not work.

### Automatic response

Follow `project-agent-operating-principles.md`:

1. inspect current repo/provider state;
2. try another safe tool/entrypoint;
3. reproduce/narrow the failure;
4. search current first-party docs when provider/tool behavior may have changed;
5. use a reversible workaround when it preserves the user’s actual constraint;
6. do **not** relax a hard user constraint merely to produce an output (for example, do not spend a Cloudflare build just because Direct Upload is unavailable);
7. escalate only at a real human permission/irreversibility/subjective boundary.

---

## TRIGGER: overlapping PRs / large cross-site change

### Cues

Multiple open PRs touch the same page/layout/policy, or a new request substantially changes the product direction established by an older branch.

### Automatic response

- inspect overlap before editing;
- prefer one clean branch from current `main` when an old feature branch has diverged heavily and a partial cherry-pick would preserve stale assumptions;
- keep one focused feature/PR when practical;
- stack deliberately only when the dependency is explicit and reviewable;
- do not merge unrelated visual/product work merely to make the branch graph look tidy;
- close/supersede obsolete duplicates once the replacement is clear.

Never use a throwaway write to `main` merely to probe permissions. Use read/discovery operations or create the intended branch first.

---

## TRIGGER: reusable lesson discovered

### Cues

A task reveals a repeated failure mode, a reliable new workflow, a non-obvious boundary, or a lesson that would materially reduce future friction.

### Automatic response

Use `project-agent-operating-principles.md` to decide whether to encode it as a test, script, config rule, runbook, architecture decision, navigation rule, historical case, or not persist it at all.

Do not create a new memory file simply because the task ended. Persist only information whose future utility exceeds the cost of another rule/document.

---

## Trigger maintenance

When adding a new scenario:

1. prove that the scenario is likely to recur or costly to forget;
2. route to existing canonical docs/tests rather than duplicating them;
3. include a refresh cue for time-sensitive knowledge;
4. add or update an executable invariant when feasible;
5. remove/supersede triggers that no longer match the current architecture.

This registry should stay compact enough to scan at task start. Detailed procedures belong in the owning current doc/runbook/test.