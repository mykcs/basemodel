# 2026-08-28 WebShop training-design and analyzer-architecture retrospective

Status: **historical case record**. This document preserves the engineering and reasoning lessons from the long 2026-08-27/28 conversation that began with GPU/NVML uncertainty, re-audited SEED Stage 1 semantics and fairness, redesigned the OpenEvo experiment matrix, exposed several execution-layer failures, corrected external-teacher placement, moved from Kimi to MiniMax, qualified MiniMax thinking ON/OFF, and finally turned the reasoning into the BaseModel WebShop training-design page in PR #309.

This document does **not** override `docs/agents/current/*`, executable repository truth, live GitHub/Vercel state, or current scientific authority in `mykcs/openevo-experiment`. It is a reusable incident/reasoning record. Future Agents must re-read live state before acting.

## Why this case matters

The conversation looked like many separate problems:

- `nvidia-smi` / NVML returned `Unknown Error` while long runs were active;
- an old 7B run appeared interrupted;
- SEED Stage 1 fairness was unclear;
- 3B/7B rollout parameters had hidden differences;
- four new experimental arms were proposed;
- Kimi API spend exploded;
- one Agent said Stage 2 had started while another said it had not;
- 7B/self passed its bootstrap gate but failed before training;
- MiniMax replaced Kimi;
- MiniMax thinking mode then became a scientific treatment;
- the resulting reasoning had to be translated into a public web page without turning it into a chat log.

The common thread was **layer confusion**. Across infrastructure, scientific protocol, runtime orchestration, teacher usage, and website explanation, many failures came from treating two different layers as one thing.

The durable mental model is:

```text
host / driver / Docker health
!= experiment process liveness
!= episode engineering validity
!= scientific protocol validity
!= training update actually applied
!= Stage-2 schedule position
!= final scientific claim
```

and, for the learning pipeline:

```text
student actor
-> model-facing harness
<-> benchmark environment
-> completed trajectory
-> optional post-hoc analyzer
-> bootstrap / update signal
-> persisted student state
-> later evaluation
```

## 1. Infrastructure incident: NVML failure did not automatically mean the experiment was dead

The conversation began with a host-level symptom:

```text
nvidia-smi / nvitop
-> Failed to initialize NVML: Unknown Error
```

while an R1 job was still writing shard episodes and consuming CPU.

The initial temptation was to restart Docker to “fix the GPU.” That would have been dangerous because:

- Docker itself was still healthy;
- episode files were still growing;
- the running job had not yet been proven hung;
- restarting the daemon could convert a recoverable observability issue into an experiment interruption.

The correct first response was evidence-based:

```text
host NVML broken
+ container/process still advancing
-> do not restart Docker only to repair observability
```

Durable lesson:

> Do not let a monitoring-plane failure become a data-plane intervention without proof that the experiment has stopped progressing.

Check separately:

1. host GPU visibility;
2. container status;
3. process CPU/GPU activity;
4. output-file growth;
5. checkpoint/state movement;
6. whether the current scientific unit has closed safely.

Only then decide whether restart/rebuild/resume is allowed.

## 2. “Stage 1 performance” required resolving what Stage 1 actually is

A major reasoning branch asked whether the raw 7B Stage-1 score should be compared directly with the SEED paper table.

That forced a more basic question:

> In SEED Stage 1, is Qwen using bare Princeton WebShop, SEED’s own harness, or a teacher-assisted policy?

The eventual answer was layered:

```text
Qwen policy
-> SEED / verl-agent model-facing harness
-> Princeton WebShop WebAgentTextEnv
-> completed episode
-> external GLM-5.2 post-hoc analysis
```

The external GLM is **not** the actor and **not** the WebShop reward scorer.

This was the first major conceptual repair. The earlier binary framing—“SEED harness or official WebShop harness?”—was wrong because SEED wraps the Princeton environment rather than replacing it.

Durable lesson:

> For benchmark agents, never use one word like “harness” to mean prompt construction, action parsing, environment transition, reward, and trajectory analysis all at once.

Ask who owns each boundary.

## 3. Fairness is claim-dependent, not one universal setup

Once Stage 1 ownership was clear, the conversation moved to fairness.

Using OpenEvo’s own harness from the first trajectory is **not automatically invalid**. It answers a different scientific question from a matched-bootstrap comparison.

The useful taxonomy that emerged was:

### Track A — full-system / native comparison

```text
SEED uses its native interaction stack
vs
OpenEvo uses its native interaction stack
```

This supports a claim such as:

> Which complete system performs better under matched benchmark/evaluation budgets?

It does **not** isolate the Stage-2 learner.

### Track B — matched Stage 1, then learner comparison

```text
same student trajectories
+ same external analyzer
+ same bootstrap checkpoint
-> fork
   SEED Stage 2
   OpenEvo Stage 2
```

This is the stronger design for a learner-level claim.

### Track C — no-bootstrap / direct-evolution arm

Skip the 1,440-trajectory bootstrap and enter OpenEvo directly. This tests bootstrap necessity/sample efficiency, but the saved environment budget must be reported rather than hidden.

### Track D — analyzer ablation

Freeze the student trajectories and change only the analyzer/model/thinking setting.

Durable lesson:

> Choose the claim first. Then choose which variables must be shared. “Fair” means “the design supports the stated inference,” not “every component is identical.”

## 4. Matching rollout count was not enough: temperature=0 broke the intended information budget

One of the most important scientific mistakes was hidden in a seemingly harmless parameter.

The intended Stage-1 schedule was:

```text
180 tasks × 8 rollouts = 1,440 trajectories
```

But an earlier OpenEvo path used greedy-like `temperature=0.0`. The same task’s eight attempts became highly repetitive.

So the ledger said “8 attempts,” while the actual exploration information was much smaller.

The repair was to make generation defaults explicit rather than inherit model/config defaults:

- Stage-1 actor temperature: `0.4` for the sampled-v2 OpenEvo primary;
- top-p: explicitly frozen rather than silently inherited;
- top-k: explicitly disabled/frozen;
- repetition penalty: neutralized when needed to avoid hidden model defaults;
- eight rollout seeds: distinct and frozen;
- max WebShop steps: `15`;
- malformed regeneration: separated from transport retry.

Stage-2 `temperature=0.7` was treated as an **OpenEvo-side design choice**, not mislabeled as a SEED official parameter.

Durable lesson:

> An equal count of environment interactions is not an equal information budget if one arm deterministically repeats itself.

## 5. Parser repair, fallback, and transport retry are three different things

Another repeated source of confusion was treating every “retry/fix” as one category.

The final distinction was:

### Deterministic parser repair

Allowed only when the model’s intended action is unambiguous and the repair does not choose a new action for the model. It must be logged.

### Harness fallback action

Dangerous for scientific training data. If the model emits a genuinely inadmissible action and the harness silently substitutes another legal action, the resulting trajectory contains behavior the model did not choose.

The safer rule became:

```text
true inadmissible action
-> terminate episode / mark non-trainable
not
-> harness chooses a helpful action
```

### Transport retry

Different again. If no model response is obtained because the HTTP connection resets or the provider returns a retryable server error, a bounded transport retry does not give the model a second “semantic lottery ticket.”

Durable lesson:

> Parser repair, policy fallback, and transport retry have different causal meanings and must have separate counters, gates, and training eligibility.

## 6. Preflight failures should consume zero scientific budget when possible

A long engineering phase repeatedly failed before formal task consumption:

- missing Python module path;
- output-root permission mismatch;
- Docker GPU argument parsing;
- nested bind-mount target not existing in a read-only source tree;
- runtime image missing a package in one invocation path;
- container entrypoint mismatch.

The productive pattern was fail-closed qualification:

```text
source SHA
+ immutable manifest hash
+ runtime image digest
+ model identity
+ benchmark data/index hash
+ GPU assignment
+ launcher import/path
+ output-root writeability
+ bounded model load/generation
-> only then consume WebShop tasks
```

When a failure happened before task reset/model load, the evidence explicitly recorded zero task consumption.

Durable lesson:

> A scientific experiment should distinguish “execution plumbing failed before the task existed” from “the model failed the task.”

The former is engineering-invalid and should not become episode-level scientific evidence.

## 7. Four-arm design exposed a semantic bug: “external teacher” had been implemented as the actor

The proposed matrix was:

```text
3B / external teacher
3B / self
7B / external teacher
7B / self
```

with two GPUs reserved per cell.

The first implementation made a critical mistake: the external gateway backend was placed inside the WebShop rollout loop. That meant Kimi generated `search[...]` / `click[...]` actions directly.

This violated the intended SEED semantics and caused API usage to scale with environment steps:

```text
wrong:
trajectory × 5–15 steps
-> 5–15 external API generations

correct SEED-style analyzer:
1 completed trajectory
-> about 1 analyzer generation
```

This was the single most expensive conceptual bug in the conversation.

Durable lesson:

> “Teacher” is not a sufficient architecture label. Always specify whether it is actor, scorer, critic, post-hoc analyzer, privileged distillation model, reward model, or evaluator.

If an external analyzer client appears inside `for step -> env.step(...)`, fail-stop unless the experiment explicitly intends a teacher actor.

## 8. Kimi incident: provider health, endpoint identity, and long-run stability were separate questions

The Kimi path produced several different API failures over time:

- an initial `401` came from probing the wrong endpoint/route;
- later short qualification calls succeeded;
- longer formal runs then experienced `500`, connection reset, rate/transport issues, and later widespread `403` failures.

The key lesson was that these statements are not equivalent:

```text
credential file exists
!= endpoint/model identity is correct
!= one probe returns 200
!= 8 probes return 200
!= long concurrent WebShop analysis remains stable
```

The final safety behavior included:

- bounded transport retry only for transport/server failures;
- explicit counters for HTTP attempts/retries;
- stop receipts before abandoning contaminated attempts;
- no reuse of provider-corrupted Stage-1 evidence;
- a hard Stage-1 engineering-clean gate before bootstrap/Stage 2.

Durable lesson:

> Provider qualification must resemble the real call pattern closely enough to test admission/limits, but still remain bounded. A tiny success probe proves connectivity, not campaign stability.

## 9. “Entered Stage 2” and “started learning” are not the same state

At one point, two Agents appeared to disagree:

- one reported that several arms had entered Stage 2;
- another said Stage 2 had not started.

Both were partially describing different artifacts/runs, and “Stage 2” itself was overloaded.

The useful state machine is:

```text
Stage-1 schedule complete
-> bootstrap gate passed?
-> bootstrap training actually executed?
-> adapter/checkpoint produced?
-> adapter/checkpoint reloaded?
-> Stage-2 rollout process started?
-> Stage-2 rollout uses updated state?
-> Stage-2 update completed?
```

An arm can consume Stage-2 rollout schedule while `current_adapter=None`; that is not evidence that self-evolution has already updated the model.

Durable lesson:

> Report schedule position, optimizer/update state, and persisted model state separately. Do not use “in Stage 2” as a single scientific status.

## 10. Stale run-root / attempt identity caused Agent disagreement

A major operational friction came from different Agents reading different attempts.

One Agent quoted a small partial run with an old SHA and `Exited(137)`. Another inspected a later formal run that had already completed Stage 1 and progressed further.

The fix was not more argument; it was identity resolution:

```text
campaign
-> attempt root
-> execution SHA
-> container name
-> manifest hash
-> state file / receipts
```

Durable lesson:

> Before comparing two status reports, verify they point to the same attempt identity. “Same experiment name” is not enough.

For status questions, lead with the authoritative run root / execution SHA, then the phase.

## 11. 7B/self bootstrap failure was an execution bug, not a reason to rerun Stage 1

The 7B/self arm eventually had enough clean Stage-1 evidence to pass the bootstrap gate, but the first SD-LoRA launch failed because the trainer required a canonical model ID rather than a local filesystem path.

The wrong response would have been to rerun 1,440 trajectories.

The correct repair preserved Stage-1 evidence and fixed only model resolution:

```text
scientific identity: canonical model ID
runtime weights: local immutable/offline snapshot mapping
```

Then the bootstrap could resume from the existing records.

Durable lesson:

> When evidence is already safely closed, repair the failing downstream execution layer and reuse the closed evidence. Do not restart upstream science to fix a local loader contract.

## 12. The decisive architecture repair: freeze trajectories and decouple the analyzer

The strongest simplification came late in the conversation.

Once the 3B and 7B student Stage-1 trajectories existed, they became reusable experimental artifacts:

```text
frozen 3B student trajectories
frozen 7B student trajectories
        ↓
independent analyzer treatments
        ↓
GLM / MiniMax / other analyzer
thinking ON / OFF
prompt/parser variants
```

This means changing the analyzer does **not** require re-running WebShop.

For SEED-style Stage 1:

```text
Qwen student completes episode
-> trajectory sealed
-> analyzer reads full trajectory once
-> episode_summary / episode_skill
```

For the canonical 180 × 8 schedule:

```text
1 model: 1,440 trajectories ≈ 1,440 primary analyzer jobs
3B + 7B: ≈ 2,880 primary analyzer jobs
```

not `2,880 × trajectory steps`.

Durable lesson:

> Treat completed trajectories as first-class immutable experiment assets. Decoupling actor data collection from post-hoc analysis turns a costly coupled pipeline into a cheap paired-analysis experiment.

## 13. MiniMax migration: change provider without repeating the Kimi architecture mistake

When Kimi spend/stability became unacceptable, MiniMax-M3 was introduced.

The first design constraint was not “make MiniMax cheaper.” It was:

> MiniMax is a Stage-1 post-hoc trajectory analyzer, never a WebShop actor.

The API profile also needed provider-specific handling:

- OpenAI-compatible endpoint;
- no unsupported/undocumented `seed` leakage unless verified;
- thinking behavior explicitly controlled;
- reasoning separated from final JSON where supported;
- usage metadata recorded per trajectory.

Every analyzer call should preserve at least:

```text
trajectory_id
prompt_tokens
completion_tokens
total_tokens
latency
transport retries
parse retries
parse result
```

Durable lesson:

> Provider compatibility is not just URL + API key. Freeze the semantic request profile and record usage as part of the experiment artifact.

## 14. GLM-5.2 reasoning defaults changed the MiniMax thinking decision

The conversation then asked whether `thinking=disabled` was truly SEED-aligned.

The public SEED analyzer path showed:

- temperature `0.0`;
- max completion tokens `1024` in the released default path inspected during the conversation;
- no explicit thinking-off control in the request path.

GLM-5.2 public model documentation indicated a reasoning-enabled default rather than a no-thinking default.

The evidence boundary mattered:

> Public model defaults + SEED not disabling reasoning strongly suggest a reasoning-enabled analyzer, but we did not have a forensic snapshot of the exact hosted provider’s historical server-side defaults.

That led to a paired MiniMax design rather than a guess.

Durable lesson:

> When a provider default is scientifically meaningful, do not silently inherit or silently override it. Make it an explicit treatment when feasible.

## 15. MiniMax thinking ON/OFF qualification showed why decoupling was powerful

The same 10 completed trajectories were sent through both MiniMax treatments.

Point-in-time qualification evidence from the conversation:

```text
10 trajectories
127 student actions
10 primary analyzer generations per treatment
10/10 parse success
0 transport retry in the paired qualification
```

Thinking OFF:

- about `35,029` total tokens;
- about `33.3 s` cumulative latency.

Thinking ON (`adaptive` + reasoning split):

- about `38,149` total tokens;
- about `91.1 s` cumulative latency.

The important observation was not merely cost:

- total tokens increased modestly relative to the large trajectory prompt;
- completion tokens and latency increased more strongly;
- the paired skills changed;
- API call count stayed at one primary call per trajectory.

Durable lesson:

> Paired analyzer experiments are cheap once trajectories are frozen. Use paired inputs to isolate analyzer behavior before committing to full-scale processing.

## 16. The website task: translate reasoning structure, not chat chronology

The final phase asked BaseModel to preserve the conversation as an interactive research page.

A literal transcript would have been a poor product. The useful structure was instead:

```text
responsibility topology
-> experiment tracks
-> parameter ledger
-> belief-change timeline
-> teacher-role matrix
-> API-cost layer
-> thinking ablation
-> claim-first decision tree
```

The page therefore used:

- semantic topology figures;
- real comparison tables;
- `<details>` for historical/diagnostic depth;
- an ordered belief-change timeline;
- a claim selector for “what experiment supports this conclusion?”;
- reduced-motion-safe animation only where it reinforced flow.

Durable lesson:

> When a long conversation contains valuable branching reasoning, externalize the **decision structure** rather than reproducing the message order.

The reader should learn:

```text
what was confused
-> what evidence resolved it
-> what decision changed
-> what experiment now answers which claim
```

## 17. Vercel cost-control lesson: branch-level eligibility and ignore-build logic must both work

The website work intentionally tried to avoid repeated Preview builds by withholding `[vercel-preview]` from intermediate commits.

However, Vercel’s shallow clone could not resolve an older comparison commit required by `vercel-ignore-build.mjs`, so the script could not prove a safe skip and failed open to a build attempt.

This produced more provider activity than planned even though most intermediate deployments were canceled/failed quickly.

Durable lesson:

> A “skip expensive build” policy is only real if its proof inputs are available in the provider checkout.

When spend matters:

1. prefer non-deployment-eligible `docs/**` branches for docs-only work;
2. batch UI changes before the first eligible push;
3. verify the provider’s Git depth is sufficient for ignore-build comparisons;
4. stop fragmentary pushes once provider behavior proves the skip gate is ineffective;
5. use one exact-head Preview for final acceptance.

This is why the present retrospective is being written on a `docs/**` branch rather than appended to the `research/**` UI branch.

## 18. Tool-boundary lesson: task phase should determine the tool

The conversation used different systems for different authorities:

```text
GitHub-owned repository state -> GitHub connector
Vercel deployment state       -> Vercel connector
server process / GPU state     -> remote compute tooling when needed
```

The owner explicitly asked that the BaseModel website phase not use Remote Desktop Commander because GitHub/Vercel connectors were sufficient.

Durable lesson:

> Do not keep using a stronger tool because it was useful earlier in the same conversation. Re-evaluate authority and minimum required capability whenever the task changes phase.

## 19. What future Agents should do first

For a similar SEED/OpenEvo WebShop experiment-design task:

1. **Resolve the claim.** Full-system, learner-only, bootstrap-necessity, or analyzer-effect?
2. **Resolve responsibilities.** Actor, harness, environment, analyzer, scorer, optimizer, persisted state.
3. **Resolve attempt identity.** Run root, SHA, manifest, current state; do not compare stale attempts.
4. **Freeze sampling defaults explicitly.** Temperature/top-p/top-k/seeds/history/max steps.
5. **Keep fallback/repair/transport separate.** Never let harness-selected actions become clean student evidence.
6. **Qualify execution before task consumption.** Source, image, model, data/index, mounts, output permissions, GPU binding.
7. **Treat closed trajectories as reusable artifacts.** Do not re-run WebShop just to change the analyzer.
8. **Keep external analyzers post-hoc.** One completed trajectory should map to about one primary analyzer job.
9. **Qualify providers with usage telemetry.** Call count, tokens, latency, retries, parse success.
10. **Distinguish Stage-2 schedule from actual learning.** Verify adapter/checkpoint creation and reload.
11. **Record stop/failure receipts.** Preserve invalid attempts without reusing them as scientific evidence.
12. **Translate reasoning into semantic web structures.** Topology, matrix, timeline, decision tree—not transcript dumping.
13. **Use docs-only branches for historical deposition.** Avoid unnecessary Vercel Preview spend.

## 20. Anti-patterns to reject immediately

Do not:

- restart Docker solely because NVML is broken while a job is still progressing;
- call a binary “SEED harness vs WebShop harness” question resolved without tracing the layered call chain;
- claim that equal rollout counts imply equal exploration information;
- let a parser choose a fallback WebShop action and then call the trajectory clean student behavior;
- put an external hindsight analyzer inside the WebShop step loop;
- infer long-run provider stability from one successful API probe;
- treat `Stage2 position > 0` as proof that a model update occurred;
- compare status reports without confirming run-root/SHA identity;
- rerun closed Stage-1 science to repair a downstream model-loader contract;
- re-run student trajectories merely because the analyzer changes;
- silently change thinking/reasoning defaults when the analyzer treatment matters;
- dump a long chat transcript into a webpage and call it a research explanation;
- trigger repeated Vercel builds for docs-only or intermediate work when branch policy can avoid them.

## 21. Relationship to the BaseModel training-design page

PR #309 (`Clarify SEED responsibility topology and WebShop training design`) turned the core reasoning from this conversation into the bilingual WebShop training-design route:

```text
/research/seed-openevo/study/design/
/en/research/seed-openevo/study/design/
```

The page is a user-facing explanation; this retrospective is the Agent-facing engineering/reasoning record.

Do not make the page a live experiment-state source. Live experiment truth remains in `mykcs/openevo-experiment` and must be refreshed before any current-status claim.

## 22. One-sentence memory

> Keep layers separate: the student acts, the harness mediates, WebShop transitions, the completed trajectory becomes evidence, an optional external analyzer reviews that evidence after the episode, and only then does a training method decide what state to persist. Most of the expensive mistakes in this conversation came from collapsing two of those layers into one.
