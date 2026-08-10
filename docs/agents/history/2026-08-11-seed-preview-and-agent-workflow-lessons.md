# Reusable lessons from the SEED / Preview / Agent workflow work

Date: **2026-08-11**

This is a historical case record, not a current policy file. It captures the reusable lessons from a long sequence of SEED reproduction, preview/deployment, beginner-writing, and Agent-governance work. Current behavior should be taken from `AGENTS.md`, `docs/agents/LATEST.md`, and `docs/agents/current/*`.

## Why this case is worth keeping

Several lessons recurred across otherwise different tasks and were expensive to rediscover:

- a Cloudflare Preview can consume the same Pages build budget the owner is trying to preserve;
- a research guide can be factually correct yet still fail beginners if it reads as disconnected feature blocks;
- an offline GPU server changes the experiment-preparation workflow more than it changes Git itself;
- a time estimate is only useful when its derivation and evidence level are visible;
- a code block or generated result is not really usable if the user must manually select/retype it;
- a technically workable provider workaround can become the wrong default once a native platform path solves the real job better;
- “private GitHub repo” and “secret manager” are not interchangeable concepts;
- changing Preview/hosting providers does not automatically justify changing the application framework;
- durable Agent knowledge works best when future tasks can trigger it just in time rather than loading every historical note on every turn.

These lessons are now routed through `docs/agents/current/scenario-trigger-registry.md` instead of requiring the owner to repeat them.

## 1. Build-budget lesson: Preview is not free just because it is non-Production

### Situation

The owner cared strongly about the monthly Cloudflare Pages build quota and wanted previews without spending it.

### What worked

The project eventually validated a provider split where ordinary PR Preview runs on Vercel and Cloudflare remains the Production boundary until an explicit hosting migration/cutover. Cloudflare Direct Upload remains useful for Cloudflare-specific Preview fidelity.

### Failure worth remembering

When Direct Upload credentials/tooling were unavailable, a Git-connected Cloudflare branch build was once used to obtain a Preview URL after the owner explicitly asked for one. That did produce the URL, but it consumed one Pages build. The important lesson is not the historical count; it is the failure mode:

> **Do not silently relax a build-budget constraint just because the preferred Preview path is unavailable.**

Future Agents should either use the validated zero-Cloudflare-build Preview path, use Direct Upload when appropriate, or report the permission/tooling boundary. A Cloudflare Git Preview requires explicit prior authorization when the owner has declared the build budget protected.

## 2. Research-guide lesson: teach one experiment, not a feature inventory

### Situation

Earlier SEED guidance explained many site capabilities, but a beginner could still lose the main question while moving between paper, model, hardware, workspace, comparison, and evidence pages.

### What worked

The useful teaching shape is a single experiment with a visible finish line:

```text
available hardware
-> environment/data readiness
-> smallest smoke
-> Stage-1 data
-> SFT
-> short RL + profiling
-> full run
-> control/baseline
-> evidence/provenance
-> only then decide whether migration is necessary
```

Each page/feature should explain how it helps the current experiment and where the reader returns next.

### Writing lesson

A student-facing technical guide is clearer when every stage says:

- what to do now;
- what command/action to use;
- what output counts as PASS;
- what to inspect first on failure;
- what evidence to give an Agent for a concrete judgment.

Abstract phrases and repeated rhetorical contrasts are weaker than direct instructions when the actual operation is already known.

## 3. 4×RTX 3090 lesson: existing hardware is the default experiment machine, not a prelude to renting

### Situation

The researcher may have access to four RTX 3090 24GB GPUs. The paper used 8×A800 80GB, but the actual research question is whether SEED can be reproduced/validated meaningfully under available resources.

### Durable rule

Start with available hardware. If the four-GPU machine completes the planned training, evaluation, controls, and provenance record, the experiment can end there for the corresponding reproduction claim.

Do not make 8×A800/A100 a ritual final step.

Migration is justified by evidence such as:

- 24GB VRAM prevents a stable run under an acceptable configuration;
- measured update time makes the projected total runtime unacceptable;
- the research question specifically requires closer paper-hardware comparability.

When migration is needed, preserve model/data/evaluation/seed/provenance and change only the hardware/parallelism parameters that must change.

## 4. Offline-server lesson: GitHub and SFTP have different jobs

### Situation

The GPU server may have no outbound public internet and may only be reachable from a workstation over a physical network connection. Code is edited on the workstation and transferred by SFTP/SSH.

### Durable model

```text
online workstation = development + Git truth + offline-bundle preparation
GitHub             = history/collaboration/source truth
SFTP/SSH           = deployment + result transfer
GPU server         = offline execution target
```

SFTP does not replace version control. Formal results must still trace back to a Git revision.

### What must be prepared before isolation

- Linux/CUDA-compatible dependencies (not blindly copied from a macOS/Windows workstation);
- complete model files;
- ALFWorld data;
- fully prepared WebShop data/search index/dependencies;
- Stage-1 analyzer strategy;
- hashes/manifests;
- GPU topology and environment fingerprints.

The physical workstation↔server cable does not describe intra-server GPU communication. Inspect actual GPU topology.

## 5. Stage-1 / environment lesson: expensive training should start only after small observable gates

The reliable order is to prove small things first:

- environment reset/action/observation/search/click;
- smallest rollout path;
- analyzer/skill generation and parsing;
- SFT records actually produced;
- checkpoint produced and loadable;
- multi-GPU DRY_RUN/config path;
- at least several stable RL updates;
- checkpoint save/resume;
- finite loss/reward and no persistent OOM.

A completed process is not automatically a reproduced method. Method-level evidence also needs an appropriate control (for the SEED path, same-condition GRPO is the natural comparison) and repeated runs where the claim requires stability.

## 6. Time/cost lesson: planning estimates must collapse into measured timing as soon as possible

### Situation

Before renting hardware, a researcher needs an estimate. The paper may report workload parameters without wall-clock runtime.

### What worked

Show the workload arithmetic first, then clearly label throughput assumptions as engineering priors. Once the real machine produces stable updates, replace the prior with measurement.

Useful form:

```text
T_RL ≈ median(stable update time) × target updates
T_total ≈ preparation/SFT + T_RL + evaluation
reservation ≈ T_total × first-run buffer
```

The first few stable updates are much more valuable than theoretical GPU peak numbers for predicting the actual experiment.

### Market-data boundary

Cloud GPU catalog, price, and inventory are time-sensitive. Record an as-of time, distinguish public catalog from real-time logged-in inventory, and avoid freezing an old provider snapshot into timeless guidance.

## 7. Actionable-content lesson: “shown” is not the same as “usable”

A code block that the user needs in a terminal should have an in-place Copy action. The same principle applies to prompts, paths, IDs, URLs, JSON/config, citations, generated hardware plans, task summaries, decision memos, and exports.

The right question is:

> **If the user needs this exact artifact in the next tool, what do they click?**

Prefer shared interaction primitives and automatic safe enhancement over each feature implementing clipboard behavior independently. Preserve selection, keyboard access, mobile usability, feedback, and React hydration boundaries.

## 8. PR/workflow lesson: a clean branch can be safer than extending a heavily diverged branch

When an old feature branch has accumulated many unrelated commits or stale assumptions, continuing to stack changes can increase risk even if it seems cheaper in the moment.

A better pattern for a large direction change can be:

```text
inspect overlapping PRs
-> identify reusable parts
-> branch from current main
-> rebuild the coherent final change
-> supersede obsolete duplicates
```

Do not merge unrelated work merely to tidy the branch graph.

Also: do not probe write permissions by creating throwaway files on `main`. Use discovery/read operations or create the intended branch first.

## 9. Credential lesson: readable is not the same as securely injectable

### Situation

The conversation explored whether a Cloudflare token could be stored as a normal file in a private GitHub repository so ChatGPT could read it and then use Wrangler.

### What mattered

A normal private-repository file is still Git-tracked source. If it contains a live bearer credential, that credential becomes part of Git history and its read surface expands to every person/app/integration with sufficient repository access.

Real GitHub secret stores deliberately behave differently: they can be consumed by the intended runtime, but their decrypted values are not exposed as a generic readable key-value database to an unrelated ChatGPT sandbox.

### Durable rule

Prefer secure execution-environment injection, a connected provider capability, authenticated CLI/keychain state on a persistent Agent machine, or a real secret manager integrated with the runtime.

The repository should own **how to deploy**; the execution environment should own **how credentials are injected**.

Do not freeze a 2026 Agent limitation as timeless truth: secret/connector capabilities must be re-checked against current first-party product documentation.

## 10. Provider-ownership lesson: using Vercel did not mean rewriting Astro

### Situation

Once Vercel became the ordinary Preview provider, it was reasonable to ask whether the project should also move to a Vercel-centered application stack such as Next.js.

### Result

That would have solved the wrong problem. The site remained well suited to Astro/static generation. The original pain was Preview/build ownership, not the application framework.

The cleaner architecture was intentionally asymmetric:

```text
GitHub = source/history/PRs
Vercel = ordinary non-main Preview + build feedback
Cloudflare = Production provider
```

Later, Cloudflare Workers Static Assets became the approved Production target inside Cloudflare while Vercel stayed Preview-only.

### Durable rule

Decompose “the stack” before modernizing it. A hosting-layer improvement does not automatically justify application-framework churn. Prefer native capabilities and narrow ownership over duplicate provider pipelines or cosmetic symmetry.

## 11. Workers-shadow lesson: prove semantic parity, not cosmetic provider equality

### Situation

Cloudflare Workers Static Assets was prepared as the modern Production target, but Production still lived on Pages.

### What worked

Use a distinct non-production shadow first, then verify the product contract: representative routes, assets, custom 404, canonical/hreflang, indexing defense, security headers, workspace/compare URL state, and real browser behavior.

The shadow passed while still exposing provider-native differences such as redirect status, cache behavior for 404s, MIME formatting, and response-header behavior.

### Durable rule

Do not force every provider difference away. Ask whether the difference breaks product behavior, SEO/security semantics, or an explicit contract. Preserve acceptable native asymmetry.

A green shadow is evidence, not release authorization. The remaining release chain is:

```text
rollback plan
-> explicit owner release intent
-> Production cutover
-> public verification
-> keep Pages until rollback is no longer needed
```

If a custom domain/canonical migration is desired, treat it as a separate SEO/release decision rather than bundling it casually into the first hosting cutover.

## 12. Cross-repository lesson: copy the decision process, not literal config

When the owner asked for the architecture idea to be shared with other website repositories, the safe approach was not to push identical provider/config files everywhere.

Each target repository can have different constraints: GitHub Pages base paths, canonical hosts, provider functions/APIs, framework/runtime choices, or local Agent rules.

The reusable pattern is:

```text
inspect target repo
-> identify the actual problem
-> compare with basemodel as a reference implementation
-> preserve target-specific asymmetry
-> write an advisory/evaluation first when migration is not yet justified
-> encode executable config only after target-specific acceptance
```

Non-web repositories should not receive website hosting policy merely for account-wide consistency.

## 13. Agent-knowledge lesson: future triggers are more useful than exhaustive memory

The owner does not need every temporary SHA, Preview URL, log, or transient provider status preserved forever. Those are reconstructible.

What is worth preserving is the ability to recognize recurring situations automatically:

- protected Cloudflare build budget;
- SEED/offline-lab reproduction;
- time-sensitive GPU rental decisions;
- beginner-facing cross-site rewrites;
- actionable content;
- blocked tool/provider paths;
- credential/secret boundaries;
- hosting/platform modernization;
- Workers cutover/provider differences;
- cross-repository reuse;
- overlapping PRs;
- genuinely reusable lessons.

That recognition now lives in `docs/agents/current/scenario-trigger-registry.md`, which routes future Agents to the appropriate current source of truth.

## Boundary

This record intentionally avoids preserving temporary Preview share URLs, current PR heads, exact remaining build quota, or other reconstructible state. Future Agents should query Git/provider state when those facts matter.