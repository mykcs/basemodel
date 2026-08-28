# SEED guided research workflow

Last reviewed: **2026-08-27**  
Status: **current teaching/workflow contract**

This file owns how Basemodel teaches the SEED worked example. It does **not** own live experiment state or deployment architecture.

## Reader and purpose

Assume the reader understands modern ML/DL, Transformers, fine-tuning, inference, APIs/tools, and GPUs, but may not yet have a compact mental model for how an Agent runs or how agentic-RL training differs from ordinary inference.

SEED is the worked example that connects existing Basemodel capabilities into one research process. Do not teach the site as a menu of unrelated features.

The default learning order is:

```text
known ML concepts
-> Agent runtime loop
-> runtime vs training
-> minimum RL vocabulary
-> map those concepts into SEED
-> executable ALFWorld / WebShop reproduction
-> deeper reproduction-mode/model-selection decisions
```

## Agent runtime before training

Teach the runtime loop first:

```text
observation / context
-> policy / model
-> action / tool
-> environment
-> next observation
-> repeat until exit
```

Ordinary runtime usually reuses the same model weights while history/environment state changes during an episode.

Then add the training loop around many trajectories:

```text
collect trajectories / rollouts
-> score outcomes / rewards
-> build advantage or another learning signal
-> compute loss
-> update policy weights
-> run again with the updated policy
```

“The Agent takes more actions” and “the policy learned across updates” are different time scales. Do not collapse them into one unlabeled loop.

Introduce only the RL vocabulary needed for the next real step: policy, trajectory/rollout, reward, advantage, and GRPO intuition. Add deeper derivations only when they answer the reader's actual question.

## Map the concepts into SEED

After the runtime/training distinction is clear, map it into the real SEED stages such as hindsight-skill SFT, on-policy rollout/self-analysis, and OPD + GRPO training. Keep model roles explicit: actor/policy, teacher/analyzer/evaluator roles are method facts, not interchangeable labels.

Training machinery does not automatically become inference-time architecture. Say what is used to produce training signal and what the released policy needs at runtime.

## Reproduction path

The practical teaching path is one continuous experiment:

```text
real hardware + constraints
-> environment/data/model preflight
-> ALFWorld smoke
-> WebShop smoke
-> Stage-1 data / skill path
-> SFT
-> short RL run + checkpoint save/resume + profiling
-> full run only when justified
-> same-condition control/comparison
-> preserve provenance and evidence
```

Each stage should expose:

1. what to do now;
2. the exact command/path/config when available;
3. what observable evidence counts as PASS;
4. the smallest first diagnostic if it fails;
5. what artifact/log to give an Agent for diagnosis.

Do not discover environment identity, action-parser incompatibility, missing network/index dependencies, checkpoint save/resume failure, or evaluation-denominator drift only after the expensive run is complete. Preflight the real model-output → parser/environment boundary early.

## Reproduction modes

Keep three questions separate:

1. **Strict reproduction** — preserve original experimental conditions as closely as evidence permits.
2. **Method reproduction** — preserve the method while allowing an explicit model/hardware substitution.
3. **Modern rerun** — test the older method under a current model stack.

A newer checkpoint is not an automatic replacement for the paper checkpoint. A hardware substitution can be sensible engineering while still changing strict comparability.

## Hardware and evidence

Prefer already-available/authorized hardware when it can answer the scientific question. Paper hardware is a comparison target, not a ritual prerequisite.

Keep these evidence classes distinct:

```text
paper-reported hardware/result
catalog/provider specification
engineering planning estimate
measured local/server profiling
formal experiment result
```

A planning range is not a measured benchmark. A successful smaller-hardware method reproduction is not automatically paper-hardware reproduction.

## Canonical product path

The worked example should connect the real product surfaces instead of inventing a parallel SEED-only product:

- `/papers/seed/` — method, model roles, benchmark/reproduction evidence;
- `/models/qwen2-5-3b-instruct/` — anchor checkpoint identity and access/evidence state;
- Model Explorer — form candidates under research constraints;
- Workspace — add the researcher's real reproduction mode and resources;
- Compare — expose substitution differences/experimental impact;
- Decision Memo/snapshots — preserve the decision and evidence trail;
- Data Status / Methodology — inspect source quality, unknowns, and conflicts;
- `/research/seed-openevo/flow/` — current SEED × OpenEvo research journey and results;
- `/research/seed-openevo/study/run/` — execution-first reproduction guidance.

Route-role and explainer deduplication are owned by `research-journey-experience.md`; do not copy full SEED/OpenEvo/WebShop explainers into every route.

## Research-integrity boundaries

The guide follows `product-and-research-integrity.md`:

- unknown is not false/zero/absent;
- open weights is not synonymous with open source;
- model IDs/release dates are not fabricated into reproducible revisions;
- paper method summary is distinct from model-selection rationale;
- benchmark values are contextual observations, not universal model scores;
- paper model roles matter;
- recommendation output exposes tradeoffs instead of hiding them in one score;
- “done” means the real path produced the required evidence, not that a component/helper exists.

For SEED WebShop source-faithful environment identity, read `seed-webshop-environment-audit.md`. For moving Results claims, resolve the current experiment-side authority rather than copying a dated page sentence.

## Writing and validation

For learner-facing SEED execution prose, use `seed-student-reproduction-writing.md`. For research explanations/results, use the writing stack in `docs/agents/README.md`. Keep lightweight executable contracts for route/state links, bilingual equivalence, runtime-vs-training distinction, evidence boundaries, and pass/fail semantics.

When a deterministic audit fails, inspect the invariant before weakening it. If the invariant remains valid, fix the implementation/copy.

## Deployment boundary

This teaching document deliberately contains **no separate hosting plan**. Deployment changes are owned by:

- `hosting-architecture.md`;
- `deployment-policy.md`;
- `release-closeout-protocol.md`;
- executable `vercel.json` and provider state.

Current ordinary architecture is self-hosted risk-based CI + optional Vercel Preview + Vercel Production, with Cloudflare production-smoke as monitoring only. Historical Cloudflare/Vercel migration states belong under `docs/agents/history/` and must not be restored from an old teaching document.

## Maintenance rule

Update this file when the durable SEED teaching sequence changes. Update `LATEST.md` or experiment-side authority when live runs change. Update the relevant current product/research policy when scientific semantics change. Do not put one-off PR status or temporary deployment state here.

## Product intent in one sentence

A researcher who already understands modern ML should be able to learn the missing Agent/runtime/training mental model quickly, see those concepts in SEED, execute a defensible reproduction path under real constraints, and then use Basemodel to make evidence-backed reproduction/model decisions.
