# SEED guided research workflow

Last reviewed: **2026-08-11**

This document preserves the durable product/workflow decisions from the SEED-guided Basemodel walkthrough. It is intentionally **not** a chat transcript. Future Agents should use it to understand what the SEED guide is supposed to teach, which existing product capabilities it connects, and which claims must remain bounded by evidence.

## Why this exists

Basemodel already had substantial research functionality before the SEED guide was added: model and paper exploration, family/landscape views, model Quick View, Research Workspace, Compare, Decision Memo/snapshots, evidence/data-status surfaces, bilingual routes, theme support and URL-shareable state.

The SEED work did **not** invent all of those features. Its product contribution was to turn them into one coherent, teachable research workflow so that a researcher can start from a real paper and learn how to use the site end to end.

The guiding principle is:

> Do not teach the site as a menu of unrelated features. Teach it as a research decision process using a concrete paper, concrete checkpoints, explicit constraints, evidence gaps and reproducibility goals.

## Current implementation baseline vs successor teaching direction

The original walkthrough was merged through **PR #72 — `docs(guide): teach Basemodel end to end with SEED`**. It established the SEED worked example and the longer site-capability path.

A later onboarding review found that the intended beginner audience has a more specific starting point: many target users already understand ML/DL, Transformers, fine-tuning, inference, APIs/tools and GPUs, but do **not** yet have a compact mental model for how an Agent runs or how agentic-RL training differs from ordinary inference.

For that audience, the durable beginner order is now:

```text
known ML concepts
-> Agent runtime loop
-> runtime vs training
-> minimum RL vocabulary
-> map those concepts into SEED
-> executable ALFWorld / WebShop reproduction
-> deeper reproduction-mode/model-selection decisions
```

This is a teaching-order decision, not permission to turn the Guide into an RL textbook.

The intended bridge should stay compact:

- model/checkpoint -> policy;
- API/function/MCP/tool call -> action/tool;
- browser/app/sandbox/task world -> environment;
- context/history/feedback -> observations/state carried through the loop;
- logs/traces -> trajectory/rollout;
- metric/evaluator/grader -> reward;
- runtime usually changes history/state while model weights stay fixed;
- training collects rollouts, scores them, forms an optimization signal, and updates the policy.

Before the learner is asked to choose strict/method/modern reproduction or execute a long-horizon RL run, they should be able to answer:

1. how does the Agent runtime loop continue from observation to action to a new observation?
2. where does training differ from runtime, and when do the policy weights actually change?
3. what do trajectory/rollout, reward, advantage and GRPO mean well enough to recognize them in the real SEED workflow?

**PR #104 is the active implementation path for this successor teaching direction as of this review. It is not current Production merely because its Preview passed.** Future Agents must inspect the actual PR/main state rather than freezing this sentence as deployment truth.

## Canonical worked example

Paper:

**SEED: Self-Evolving On-Policy Distillation for Agentic Reinforcement Learning**

Relevant repository content:

- `src/content/papers/seed.json`
- `src/content/guides/research-workbench.json`

The paper record is the evidence-backed source for the site-specific SEED representation. It includes the paper workflow, model roles, reproduction modes, paper-scale hardware information, learning-guide content and workspace prefill.

Do not turn the presence of a newer model into an automatic recommendation to replace the paper model. Strict reproduction, method reproduction and modern rerun remain different research questions.

## Beginner bridge before the research-decision layer

### Runtime loop first

A learner should first see the Agent as a repeated decision loop rather than “a chatbot with more buttons”:

```text
observation / context
-> policy / model
-> action / tool
-> environment
-> next observation
-> repeat until an exit condition
```

The important first distinction is that ordinary runtime normally reuses the same model weights while history/state changes over the episode.

### Then separate training from runtime

Training adds another loop around many runtime trajectories:

```text
run tasks / collect trajectories
-> score outcomes / rewards
-> build advantage or other learning signal
-> compute loss
-> update policy weights
-> run again with the updated policy
```

Do not mix these two loops into one diagram without explanation. “The Agent takes many actions” and “the model learns across training updates” are different time scales.

### Minimum RL vocabulary only

Before moving into SEED, introduce only the concepts needed for the next concrete step:

- **policy** — the model/behavior distribution selecting the next action/token under the current context;
- **trajectory / rollout** — the sequence generated while the Agent interacts with the environment;
- **reward** — the outcome/evaluation signal associated with behavior;
- **advantage** — the relative signal indicating whether sampled behavior was better/worse than the relevant comparison baseline;
- **GRPO intuition** — multiple sampled completions/trajectories can be compared within a group so relative reward information becomes an optimization signal.

Avoid full derivations unless the user explicitly asks for them.

### Then map into SEED

Only after the above bridge should the learner be asked to recognize SEED stages such as hindsight-skill SFT, on-policy rollout/self-analysis and OPD + GRPO training.

Keep the inference-time boundary explicit: training machinery such as analysis/skill augmentation should not automatically be described as required deployment architecture if the learned policy can run without it.

## Practical reproduction path

The Guide should connect the conceptual bridge directly to real work rather than restarting as a separate tutorial.

The durable practical sequence is:

```text
available hardware / constraints
-> offline/preflight readiness
-> ALFWorld smoke
-> WebShop smoke
-> Stage 1 data/skill path
-> SFT
-> short RL run + profiling
-> full run only when justified
-> same-condition control / comparison
-> escalate hardware only when measured blockers justify it
```

For the current student-first work, 4×RTX 3090 24GB is a practical first target while 8×A800 80GB remains the paper-hardware condition and 8×A100 80GB is a hardware substitution unless evidence says otherwise. Do not generalize that exact hardware to every user or paper.

A successful four-GPU run can be a valid completion path for the corresponding reproduction claim. Moving to eight GPUs should be evidence-driven by memory, measured runtime or a specific paper-hardware comparability goal, not ritual.

## Canonical SEED workflow links

These routes are part of the guide contract and should remain valid unless the product deliberately changes its URL/state model.

### Paper

`/papers/seed/`

Purpose: understand the method, model roles, benchmarks, code/checkpoint availability and reproduction modes before choosing a replacement model.

### Original/anchor checkpoint

`/models/qwen2-5-3b-instruct/`

Purpose: inspect the actual checkpoint semantics, weight access, RL suitability, runtime evidence, license, revision evidence and unresolved fields.

### Model Explorer prefilter

`/models/?q=qwen2.5&rl=true&paperUse=true`

Purpose: start from models relevant to the paper and RL use rather than browsing a global catalog without context.

### Method-reproduction Workspace prefill

`/workspace/?v=2&mode=method&paper=seed&model=qwen2-5-3b-instruct&role=actor&roles=actor%2Canalyzer&update=rl&access=local&runtime=verl&open=1`

Purpose: load a concrete research task, then add the researcher’s real hardware/resource constraints rather than pretending the paper configuration is automatically feasible locally.

### Comparison example

`/compare/?models=qwen2-5-3b-instruct,qwen3-1-7b&diff=1&impact=1`

Purpose: demonstrate that model substitution should be evaluated through experimental differences/impacts, not by the shortcut “newer model = better replacement”.

## Advanced site-capability path after the bridge

The original longer workflow remains valuable once the learner understands the Agent/training mental model. It should be treated as the **research-decision layer**, not the first cognitive hurdle for the target beginner.

1. **Research modes** — distinguish strict reproduction, method reproduction and modern rerun when the learner is ready to decide what claim they are trying to reproduce.
2. **Global search** — use `⌘K` / `Ctrl+K` to search paper/model checkpoints and reinforce paper-vs-checkpoint identity.
3. **Paper Explorer / SEED detail** — inspect model roles, weight updates, code/checkpoint state, benchmarks, method structure and reproducibility evidence.
4. **Quick View / model detail** — inspect checkpoint identity, weights, RL/runtime fit, license, revision evidence and unknowns. `not_verified` is not equivalent to `false`.
5. **Model Explorer** — use filters and decision/data/timeline views to form candidates.
6. **Families / Landscape** — separate the paper-time model from the current family/model landscape; do not silently rewrite history with today’s newest generation.
7. **Research Workspace** — start from a concrete SEED task, then add the researcher’s actual GPU, VRAM, precision, context, batch and access constraints.
8. **Resource planning / candidate fit** — treat VRAM output as a heuristic planning estimate; it is not measured hardware evidence or a run guarantee.
9. **Compare** — expose differences, impacts and unknowns rather than hiding model substitution behind one score.
10. **Decision Memo / snapshots** — preserve local decision history and field-level changes. Local persistence is not account-backed cloud storage.
11. **Evidence / Data Status / Methodology** — verify checkpoint, hardware, benchmark, code, weight and revision claims; preserve semantic unknown states.
12. **Language / theme / shareability** — equivalent Chinese/English paths, local theme state and canonical Workspace/Compare URLs are part of the usable workflow.

## Misuse warnings that must remain explicit

### 1. Newer does not automatically mean better for reproduction

A current-generation model may be interesting for a modern rerun while being a poor strict-reproduction substitute. The product should show the research consequence of replacement rather than silently upgrading the model.

### 2. Downloadable/callable does not mean reproducible

Weight access, API access, exact checkpoint/revision availability, license rights, runtime compatibility and evidence quality are separate facts.

### 3. Local project state is not cloud collaboration

LocalStorage, local snapshots, exported JSON/memos and shareable URLs are useful product capabilities, but they do not constitute account identity, cross-device cloud save, team permissions, realtime collaboration or a server database.

### 4. Hardware planning is not measured hardware evidence

Paper-reported hardware, rental/catalog specs, heuristic VRAM estimates and measured local profiling are separate evidence classes.

For a real reproduction task, prefer smoke runs and profiling on available hardware before automatically escalating GPU count/class. A hardware substitution changes the experimental condition even when it is a sensible engineering choice.

## Research-integrity guardrails inherited from the broader product contract

The SEED guide must remain consistent with `current/product-and-research-integrity.md`:

- unknown is not false/zero/absent;
- open weights is not synonymous with open source;
- release dates/model IDs must not be fabricated into reproducible revisions;
- paper method summary is distinct from model-selection rationale;
- benchmark values are contextual observations, not universal model scores;
- paper model roles matter;
- hardware catalog tiers, heuristic estimates and measured results are different evidence levels;
- recommendation output should expose tradeoffs rather than hide them in one score;
- “done” means the behavior is reachable through the real product path, not merely that a helper/component exists.

## Validation rule

Guide/product changes should keep lightweight source/unit contracts for easy-to-regress behavior: route/state links, bilingual equivalence, runtime-vs-training distinction, evidence boundaries, practical pass/fail criteria and the bridge into the real worked example.

When a deterministic audit fails, inspect the invariant it protects before weakening the audit. If the invariant is still correct, fix the implementation/copy.

For user-facing Guide changes, final Preview evidence should be tied to the exact PR head. If `main` advances materially before merge, compare/synchronize and re-run the relevant exact-head validation.

## Current deployment architecture

This document previously described a Cloudflare-only ordinary Preview path. That is no longer current.

Use the repository deployment authorities instead:

```text
CURRENT
non-main branch / PR
  -> Vercel `basemodel-preview`
  -> npm run verify:deploy
  -> npm run build
  -> protected Vercel Preview

main
  -> Vercel Git deployment disabled
  -> Cloudflare Pages Production
  -> https://basemodel.pages.dev

TARGET AFTER EXPLICIT CUTOVER
main
  -> Cloudflare Workers Static Assets Production
```

Cloudflare Direct Upload remains fallback / Cloudflare-specific integration validation, not the ordinary first-choice Preview while Vercel is available.

A READY Preview is not independent proof that Production changed. Keep source synchronization, deterministic Gate/build, real Preview inspection and Production verification as separate evidence states.

Read `current/hosting-architecture.md`, `current/vercel-preview-migration-plan.md` and `current/deployment-policy.md` for live operational rules.

## How future Agents should modify this workflow

1. Read `/AGENTS.md`, scan `current/scenario-trigger-registry.md`, then open this file plus `current/product-and-research-integrity.md` for broad research-journey changes.
2. Inspect the current implementation, open PRs and content rather than assuming this document is more current than `main`.
3. Preserve the distinction between **existing product capabilities** and **the Guide that connects/teaches them**.
4. For the target beginner audience, preserve the compact ML -> Agent runtime -> runtime-vs-training -> minimal RL -> SEED bridge before deeper research taxonomy.
5. Keep SEED as a worked example, not a hardcoded assumption that all research tasks use the same model roles, hardware or reproduction mode.
6. If URLs/state contracts change, update the Guide, direct links and tests together.
7. If research semantics change, update `current/product-and-research-integrity.md`; do not bury a methodology change only in UI copy.
8. Keep bilingual behavior equivalent.
9. Do not overclaim external facts, hardware measurements or deployment evidence.
10. Prefer one coherent researcher workflow over disconnected controls or competing onboarding PRs.
11. When introducing a new tutorial paper, reuse the same bridge-and-research-decision structure rather than copying SEED-specific conclusions as universal rules.
12. If this teaching direction changes again, update this current file and the scenario trigger rather than leaving an old current policy to be corrected only by precedence.

## Product intent in one sentence

A researcher who already understands modern ML should be able to learn the missing Agent/runtime/training mental model quickly, see those concepts in SEED, execute a defensible reproduction path under real resource constraints, and then use the rest of Basemodel to make evidence-backed model/reproduction decisions.
