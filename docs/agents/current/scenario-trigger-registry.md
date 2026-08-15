# Scenario trigger registry

Last reviewed: **2026-08-11**

This file is a **just-in-time trigger router**, not a second governance system.

Future Agents should scan it at the start of non-trivial work after `AGENTS.md` / `docs/agents/LATEST.md`. Match the current task against the situations below and load only the relevant current docs, tests, scripts, provider state, and fresh external evidence.

**Do not wait for the owner to repeat these reminders.** If the situation matches, trigger the corresponding behavior automatically.

Re-scan when the task materially changes state: a new blocker appears, an overlapping PR is discovered, a provider/deployment boundary is crossed, a previously green branch becomes behind `main`, a Gate exposes an unexpected invariant, or a current/latest external claim becomes important.

Precedence remains:

```text
current user instruction
> live provider state / executable repository truth
> docs/agents/current/*
> historical case evidence
```

A trigger routes attention; it does not override newer evidence or explicit user instructions.

---

## TRIGGER: previous plan / handoff / current doc may be stale

### Cues

Any task where:

- the owner says an earlier plan may be outdated;
- remembered chat guidance conflicts with current repository files;
- two `docs/agents/current/*` files disagree;
- provider behavior no longer matches a prior session;
- the plan depends on fast-moving models, Agent harnesses, frameworks, APIs, or hosting products.

### Automatic response

1. Treat remembered/conversational state as a hypothesis, not authority.
2. Re-read `AGENTS.md`, `docs/agents/LATEST.md`, executable config/tests, and the task-owning current policy.
3. Inspect live provider state for provider-side claims when available.
4. For fast-moving technical claims, verify current first-party docs/source repositories and relevant primary research before redesigning.
5. If executable/live truth contradicts a `current/` document, update or demote the stale document instead of adding another workaround layer.
6. Preserve a sound current design when fresh evidence does not justify churn.

### Refresh cue

Trigger this again whenever the task crosses a platform/provider boundary or the owner explicitly challenges an assumption as stale.

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

## TRIGGER: exact-head Preview / `main` moved / provider says READY

### Cues

Any situation where:

- a PR Preview passed but the branch is now behind `main`;
- a long-running Agent task outlived other merges;
- the validated Preview head is not based on the current intended merge base;
- Vercel/Cloudflare/GitHub says READY/success and the user asked to see or verify the real site;
- Deployment Protection blocks anonymous inspection.

### Automatic response

1. Compare the PR branch against current `main` before final acceptance.
2. Inspect whether intervening `main` changes touch the same files, contracts, deployment config, or assumptions.
3. Synchronize onto current `main` when needed without discarding either side's intended ownership.
4. Re-run the deterministic Gate and build for the **new exact head** when user-facing/runtime behavior is involved.
5. Confirm provider metadata points to that exact commit and that the expected Gate actually ran.
6. Inspect the real route/interaction/metadata required by the task; a READY badge alone is not visual/product acceptance.
7. If Vercel Deployment Protection blocks owner review, generate a temporary share link rather than disabling protection.
8. Keep temporary share links, transient deployment IDs, and intermediate SHAs out of durable project knowledge unless a specific historical case truly needs them.

### Acceptance boundary

Completion reports distinguish:

```text
source synchronization
!= deterministic Gate/build success
!= Preview deployment READY
!= real route/browser acceptance
!= Production acceptance
```

Do not cite an earlier Preview as proof for a later synchronized head.

---

## TRIGGER: deterministic Gate fails / weakening the check looks tempting

### Cues

- copy/docs-like edits fail a semantic, evidence, adversarial, or hardening audit;
- a harmless-looking wording change breaks an acceptance invariant;
- the easiest route to green appears to be removing or weakening a check.

### Automatic response

1. Read the failing invariant and the policy/research boundary it protects.
2. Decide whether the invariant remains valid using current executable/product/research truth.
3. If valid, fix the implementation/content so the protected meaning stays explicit.
4. Change the Gate only when evidence shows the Gate itself is stale or incorrectly specified.
5. If the failure reveals a recurring boundary, encode it in the existing test/runbook or historical case instead of merely remembering the incident.

### Anti-pattern

Do not trade research integrity or deployment safety for a green badge.

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
8. Keep paper-reported hardware, catalog/rental specs, heuristic estimates, and measured profiling as distinct evidence classes.

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
- teach Agent / agentic-RL concepts to someone who already knows modern ML;
- “make it sound human”;
- add a new educational feature or concept block;
- change one part of a workflow that affects the surrounding reading order.

### Automatic response

1. Read the current product/research and SEED workflow docs before editing.
2. Define the learner's assumed prior knowledge explicitly instead of treating “beginner” as “knows nothing”.
3. If the target user knows ML/DL/Transformers/fine-tuning/inference/APIs/GPUs but not Agents, bridge familiar concepts into the missing mental model before product taxonomy or long RL derivations:

```text
known ML concepts
-> Agent runtime loop
-> runtime vs training
-> minimum RL vocabulary
-> map into the real paper/method
-> executable experiment
-> deeper research-mode/model-selection layer
```

4. Teach the runtime loop before optimization details: observation/context -> policy/model -> action/tool -> environment -> next observation.
5. Separate runtime (normally fixed weights, changing history/state) from training (collect rollouts -> reward/evaluator -> advantage/loss -> weight update).
6. Introduce only the RL vocabulary needed for the next real task. For SEED, policy, trajectory/rollout, reward, advantage, and GRPO intuition are enough before the practical workflow.
7. Rewrite the **whole affected journey**, not only the paragraph explicitly criticized, when local patching would make the page feel fragmented.
8. Put the next action first. Prefer short direct lab-mentor language over abstract slogans.
9. For experiment steps, use the pattern:
   - what to do now;
   - exact command/path/action;
   - what observable evidence counts as PASS;
   - what to check first if it fails;
   - what evidence to paste to an Agent if help is needed.
10. Avoid rhetorical filler when a concrete instruction is available.
11. Check surrounding pages/navigation so the site still reads as one system after the change.

### Acceptance boundary

For the target ML-literate Agent newcomer, the learner should be able to explain both **how the Agent runs** and **where training changes the policy** before being asked to choose a reproduction mode or execute a long-horizon RL run.

---

## TRIGGER: user-visible copy / onboarding / status language

### Cues

Any task that adds or changes a public page, heading, introduction, callout, onboarding/Guide section, empty/error/status message, research explanation, bilingual copy, process/evidence visual, or broad UI structure.

### Automatic response

1. Read `audience-centered-technical-copy.md`, `audience-copy-audit-2026-08-12.md`, and `sitewide-visual-knowledge-architecture.md`, plus the relevant research/reproduction contract.
2. Identify the copy-owning source and every generated route it affects; review headings, introductions, calls to action, status/empty/error states, and both locales together.
3. Run `npm run audit:copy` for the contextual review queue. Resolve each changed-source candidate as a fix or a justified warning/exemption.
4. Run `npm run audit:copy:strict` and the existing repository Gate before Preview. Strict mode protects only high-confidence naming, mission-metadata, and bilingual-route invariants.
5. Update the canonical audit inventory when ownership, coverage, or a durable exemption changes. Do not create a second copy standard or audit file.

### Acceptance boundary

The scanner identifies review candidates; it does not mechanically ban words such as “不要”, “current”, or “still”. Contextual review remains responsible for safety warnings, evidence boundaries, time references, and bilingual semantic equivalence.

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

## TRIGGER: credential / token / secret injection / private repository

### Cues

Any task mentioning or implying:

- API tokens, bearer credentials, Account IDs, Wrangler login/auth;
- “put the token in a private GitHub repo so ChatGPT can read it”;
- GitHub Actions Secrets / Agent Secrets;
- persistent credentials for a web Agent or coding Agent.

### Automatic response

1. Distinguish **technically readable** from **appropriate secret storage**.
2. Do not commit a live bearer token as plaintext to a normal Git-tracked file, including in a private repository.
3. Prefer secure execution-environment injection, a connected provider capability, OS/keychain-backed authenticated CLI state for a persistent local Agent, or a real secret manager integrated with the runtime.
4. Do not assume GitHub Secrets are a readable key-value store: their normal APIs expose metadata, not decrypted values for an unrelated ChatGPT sandbox.
5. Use the narrowest provider permission and shortest practical lifetime for task-specific credentials.
6. Never ask the owner to paste a live token into chat when a secure authorization path can be used instead.
7. If current Agent/provider secret capabilities are unclear, verify current first-party docs before concluding the path is impossible.

### Refresh cue

Agent secret-injection and provider connector capabilities change quickly. Re-check current product/provider behavior before treating any 2026 limitation as permanent.

---

## TRIGGER: hosting/platform modernization / “should we change stack?”

### Cues

Any discussion of:

- Vercel vs Cloudflare;
- Pages vs Workers;
- “modern/elegant stack”;
- whether using Vercel implies Next.js;
- replacing Astro/React/GitHub because the hosting provider changed.

### Automatic response

1. Decompose the question into **application stack**, **Preview/CI ownership**, **Production hosting**, **product identity/domain**, and **provider-native services**.
2. Inspect current first-party platform guidance and current repository constraints before migrating.
3. Do not rewrite Astro/React merely because Vercel is used for Preview. Preserve a sound application stack unless product/runtime requirements provide evidence for a rewrite.
4. Prefer narrow provider ownership over duplicate orchestration: one provider may own ordinary Preview while another owns Production.
5. Do not create fake symmetry between providers or restore retired CI merely to make the architecture look uniform.
6. If the product gains SSR/server APIs/state that invalidate the static-host assumption, re-evaluate from requirements rather than from branding.

### Refresh cue

Hosting products and framework integration change rapidly. Verify current provider/framework docs when the architecture decision depends on present capabilities.

---

## TRIGGER: Workers shadow complete / Production cutover / provider behavior differences

### Cues

Any task mentioning:

- `basemodel-workers-shadow`;
- “finish the Workers migration”;
- attach Production domain/route;
- retire/delete Cloudflare Pages;
- a difference between Pages and Workers redirects/cache/MIME/headers;
- a green shadow being treated as permission to release.

### Automatic response

1. Read `docs/agents/LATEST.md` and `hosting-architecture.md` for live migration state before repeating shadow work.
2. The repository/Vercel/real Workers shadow and parity phases are already complete as of the current handoff. Do not make “deploy another shadow” the default next step unless fresh evidence invalidates the prior result.
3. The remaining release chain is:

```text
rollback plan
-> state expected Production impact
-> explicit owner release intent
-> Production cutover
-> public Production verification
-> retain Pages until rollback is no longer needed
```

4. A working shadow URL is evidence, **not release authorization**.
5. When Pages and Workers differ, ask whether the difference breaks product/SEO/security semantics before forcing parity. Preserve acceptable provider-native asymmetry rather than encoding cosmetic equality.
6. If a custom domain/canonical migration is proposed, treat it as a separate SEO/release decision; do not casually bundle it into the first hosting cutover.

### Refresh cue

Rewrite this trigger immediately after a real Production cutover is independently verified so future Agents do not keep treating Pages as Production.

---

## TRIGGER: cross-repository architecture reuse

### Cues

The owner asks to apply a successful hosting/workflow/design pattern to other website repositories or “make the other repos use the same stack”.

### Automatic response

1. Reuse the **decision pattern**, not literal configuration.
2. Inspect each target repo’s `AGENTS.md`/docs, framework, canonical host, base path, deployment provider, server/functions/API dependencies, and release constraints first.
3. Use `basemodel` as a reference implementation or suggestion when helpful, but preserve intentional asymmetry where the target repo differs.
4. Do not write website deployment guidance into non-web repositories merely for account-wide consistency.
5. Prefer an advisory/evaluation note when migration is not yet justified; only encode executable config after the target repo passes its own acceptance reasoning.

---

## TRIGGER: overlapping PRs / large cross-site change

### Cues

Multiple open PRs touch the same page/layout/policy, or a new request substantially changes the product direction established by an older branch.

### Automatic response

- inspect overlap before editing;
- compare changed files, base/head relationships, validation state, and product intent;
- prefer continuing the most complete/current path when it safely subsumes earlier work;
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

If the lesson should only fire under a recognizable future situation, add/refine a short trigger in this registry and link to the existing owner of the detailed rule.

Do not create a new memory file simply because the task ended. Persist only information whose future utility exceeds the cost of another rule/document.

---

## Trigger maintenance

When adding a new scenario:

1. prove that the scenario is likely to recur or costly to forget;
2. route to existing canonical docs/tests rather than duplicating them;
3. include a refresh cue for time-sensitive knowledge;
4. add or update an executable invariant when feasible;
5. remove/supersede triggers that no longer match the current architecture.

Re-scan this registry at least at these state transitions:

- task start;
- new blocker/tool failure;
- discovery of overlapping PRs;
- Preview/build success before claiming final acceptance;
- before merge/release if `main` may have advanced;
- current/latest external fact becomes decision-relevant;
- task completion when deciding whether a lesson deserves persistence.

This registry should stay compact enough to scan at task start. Detailed procedures belong in the owning current doc/runbook/test.
