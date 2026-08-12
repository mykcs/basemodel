# SEED × OpenEvo research mission — first principles and information architecture

Status: current product and content contract
Audience: product, design, content, research, and implementation Agents
Scope: Basemodel site, SEED paper, OpenEvo benchmark research, ALFWorld, WebShop

## 1. The original research task

This site exists to support one concrete research program:

> Run OpenEvo on the ALFWorld and WebShop agent benchmarks used by SEED, compare the resulting behavior and evidence with the SEED experimental protocol, identify benchmark-specific failure patterns, and feed those findings back into the design of OpenEvo.

The site is therefore not primarily:

- a generic model catalog;
- a paper list;
- an RL textbook;
- a dashboard of unrelated tools;
- a marketing site for SEED or OpenEvo.

Those surfaces are supporting instruments. The durable product is a **research workbench that connects model literacy, method understanding, benchmark interpretation, execution, comparison, and evidence**.

## 2. First-principles product questions

A new reader should be able to answer these questions in order:

1. **What is the Base Model in this experiment?**
   - What does a checkpoint name mean?
   - What do generation, parameter count, Base/Instruct, context, precision, quantization, SFT, LoRA, RL, and runtime labels mean?
   - Which of these fields change experimental comparability?

2. **How does SEED work?**
   - What is the supervision gap?
   - What is hindsight-skill SFT?
   - How does the current policy act as both rollout actor and trajectory analyzer?
   - How are actions re-scored under ordinary and skill-augmented contexts?
   - How are GRPO and the OPD signal jointly optimized?

3. **How does OpenEvo work?**
   - What is a task session, sealed dataset, evolution method, artifact, Project Head, and successor revision?
   - Which carriers evolve: text memory, skill bundle, agent-system instructions, and internal parametric memory?
   - Why are accepted artifacts applied to a later task rather than midway through the task that produced them?

4. **What are ALFWorld and WebShop measuring?**
   - What is the environment/action/observation contract?
   - What is the task horizon?
   - What metrics are reported?
   - What does success, partial credit, failure, looping, or fallback behavior mean?

5. **How does SEED run on those benchmarks?**
   - Inner loop: observation → policy → action → environment → next observation.
   - Completed trajectory → hindsight skill.
   - Original sampled actions → ordinary and skill-augmented re-scoring.
   - Joint RL + OPD update → refreshed policy/analyzer checkpoint.

6. **How does OpenEvo run on those benchmarks?**
   - Benchmark episode → trajectory and evaluator evidence.
   - Completed task/session → sealed dataset.
   - Selected evolution method → validated artifact(s).
   - Accepted successor revision → next episode/task.

7. **How do we reproduce, compare, and improve?**
   - Hold benchmark, task split, model, action format, step budget, evaluator, and sampling policy fixed where possible.
   - Separate environment readiness, real model action, evolution evidence, framework service-stack evidence, and final measured results.
   - Compare framework behavior before claiming model-quality differences.
   - Turn recurrent failure modes into OpenEvo design changes.

The information architecture must follow these questions. Do not make the user reconstruct this sequence from unrelated navigation labels.

## 3. The central research object

The site should visualize one shared object model:

```text
Base model / checkpoint
        ↓ used by
Agent framework (SEED or OpenEvo)
        ↓ interacts with
Benchmark environment (ALFWorld or WebShop)
        ↓ produces
Trajectory + reward / score + failure evidence
        ↓ transformed by
Learning or evolution mechanism
        ↓ yields
Updated policy parameters or successor context/artifacts
        ↓ evaluated under
The same benchmark protocol
        ↓ informs
OpenEvo framework improvement
```

Every major route should state which object it explains and how it connects to this chain.

## 4. The three reader modes

The site should expose three obvious entry modes on the first screen.

### Learn the system

For readers who do not yet understand Base Models, agent loops, SEED, OpenEvo, or benchmark metrics.

Path:

```text
Base Model literacy
→ SEED method
→ OpenEvo method
→ ALFWorld / WebShop
→ loop comparison
```

### Run the experiment

For readers who understand the concepts and need an execution manual.

Path:

```text
Environment and hardware
→ pinned code and assets
→ WebShop / ALFWorld smoke
→ real CUDA action
→ real evolution
→ measured output
```

### Compare and improve

For readers analyzing results or planning framework changes.

Path:

```text
SEED protocol
→ OpenEvo protocol
→ controlled variables
→ benchmark-specific failures
→ evidence table
→ OpenEvo design hypothesis
```

These are not three unrelated products. They are three views of the same research mission.

## 5. Route architecture

### Mission hub

Route:

- `/research/seed-openevo/`
- `/en/research/seed-openevo/`

Role: answer, in one screen, what the site is for, what is being compared, which two benchmarks are involved, and where the reader should start.

Required visuals:

- the central research-object chain;
- three reader modes;
- the seven first-principles questions;
- the current evidence ladder;
- links to every supporting page.

### Base Model literacy

Route:

- `/research/seed-openevo/base-model/`

Role: decode the model/checkpoint fields needed for this experiment. It must stay connected to Qwen2.5-3B-Instruct and the real hardware/runtime constraints rather than becoming a generic glossary.

### SEED framework

Route:

- `/research/seed-openevo/seed/`

Role: explain the paper’s two stages, inner interaction loop, outer training loop, actor/analyzer synchronization, hindsight skills, OPD, GRPO, and inference-time boundary.

Authoritative external source: the SEED paper and official code repository. Secondary summaries may aid explanation but do not override the paper.

### OpenEvo framework

Route:

- `/research/seed-openevo/openevo/`

Role: explain OpenEvo’s cross-session lifecycle, evolution targets, methods, artifacts, revision activation, and the benchmark adapter boundary. Do not conflate the Desktop product lifecycle with the standalone benchmark package; explain their shared Core concepts and their different execution surfaces.

### Benchmarks

Route:

- `/research/seed-openevo/benchmarks/`

Role: explain ALFWorld and WebShop as experimental instruments.

ALFWorld metrics in the SEED protocol:

- success rate per task family;
- unweighted macro-average across task families.

WebShop metrics in the SEED protocol:

- mean normalized task-completion score;
- exact success rate.

Higher is better, but partial score, exact success, step count, loops, fallback actions, and invalid actions remain distinct evidence.

### Loop comparison

Route:

- `/research/seed-openevo/loops/`

Role: show SEED and OpenEvo side by side without forcing false equivalence.

Key distinction:

- SEED internalizes hindsight into policy parameters through SFT + on-policy distillation and RL.
- OpenEvo currently evolves selected cross-session carriers and activates accepted successor artifacts/revisions for later tasks.

The comparison should show shared inputs/outputs and different update objects.

### Reproduction guide

Existing route:

- `/guide/openevo-webshop-alfworld/`

Role: execution-first manual. It is not the place for the full conceptual history.

### Results and evidence

Route:

- `/research/seed-openevo/results/`

Role: show current experiment status and artifacts without overclaiming.

Required separation:

```text
setup ready
≠ real model action
≠ real evolution
≠ comparable benchmark result
≠ framework improvement validated
```

Historical Kaggle/Colab evidence must be labeled historical. Current RTX6 claims require current artifacts.

## 6. Home-page contract

The first viewport must answer:

1. **What research question is this site pursuing?**
2. **What are SEED and OpenEvo being tested on?**
3. **Why do Base Models matter to the experiment?**
4. **Can I learn, run, or compare from here?**

The first viewport must not lead with:

- catalog counts;
- generic “understand/explore/compare” product language;
- a model leaderboard;
- recent releases;
- broad claims about all Agent research.

Recommended first-screen statement:

> Use the ALFWorld and WebShop experiments from SEED to understand Base Models, reproduce the protocol, evaluate OpenEvo, and turn benchmark failures into framework improvements.

## 7. Navigation contract

The mission hub is the top-level orientation route.

Recommended primary navigation order:

```text
Research mission
→ Guide
→ Models
→ Papers
→ Workspace
→ Compare
```

Supporting routes should show a compact “You are here” mission context when relevant:

- model pages answer the Base Model question;
- the SEED paper page answers the SEED method question;
- the OpenEvo research page answers the OpenEvo method question;
- the benchmark page answers the evaluation question;
- reproduction answers the execution question;
- results answers the evidence/improvement question.

## 8. HTML and visualization contract

Use HTML to encode research structure, not merely decorate prose.

Preferred structures:

- `<ol>` for interaction/training/evolution order;
- `<figure>` for the research-object chain and framework loops;
- `<table>` for controlled variables and benchmark metrics;
- `<dl>` for Base Model symbols and claim meanings;
- `<details>` for optional derivations, historical incidents, and troubleshooting;
- anchors and sticky in-page navigation for long research pages;
- side-by-side comparison only where the compared objects share a meaningful dimension;
- animation only for sequence, state transition, or loop refresh.

Every visual must answer at least one of:

- what depends on what?
- what happens next?
- what object changes?
- what evidence is produced?
- what does this result prove or fail to prove?

## 9. Scientific guardrails

- A newer Base Model is not automatically a better reproduction model.
- A successful environment reset is not a successful benchmark run.
- A non-error completion is not proof of a real model action.
- Reward or score `0` is a valid measured result and not automatically a pipeline failure.
- A historical successful notebook is not a current RTX6 result.
- SEED and OpenEvo do not update the same object; compare them without pretending they are algorithmically identical.
- Benchmark differences must not be attributed to the framework until model, prompt/action format, task set, budget, evaluator, and sampling differences are inspected.
- ALFWorld and WebShop results should not be collapsed into one universal score.
- Unknown evidence remains unknown; it is not false or zero.

## 10. Implementation order

1. Create the mission hub and first-principles pages.
2. Replace the generic home orientation with the research mission.
3. Add the mission to top-level navigation.
4. Connect existing Model, Paper, Guide, Workspace, Compare, and OpenEvo reproduction routes to the mission map.
5. Add a results/evidence page before publishing new experiment claims.
6. Validate bilingual routing, semantic HTML, mobile layout, keyboard access, reduced motion, and exact-head Preview.

## 11. Acceptance criteria

The redesign is acceptable only when a first-time reader can answer, without opening the global model catalog first:

- what the site is trying to discover;
- why SEED, OpenEvo, ALFWorld, WebShop, and Base Models appear together;
- which page explains each concept;
- how the two framework loops differ;
- which metric represents which benchmark;
- how to start a real reproduction;
- what evidence is currently complete or incomplete;
- how an observed benchmark failure could become an OpenEvo design change.

## Product intent in one sentence

Basemodel should help a technically curious reader understand the model and method, reproduce SEED’s ALFWorld/WebShop protocol, evaluate OpenEvo under controlled conditions, and convert evidence from those environments into defensible OpenEvo improvements.