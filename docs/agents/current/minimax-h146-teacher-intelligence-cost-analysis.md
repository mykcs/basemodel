# MiniMax-M3 hindsight teacher: intelligence benchmark and cost analysis

**Analysis date:** 2026-08-30  
**Status:** living analysis; may be revised when new first-party model evidence or new benchmark runs exist  
**Frozen factual input:** [`minimax-h146-frozen-facts-2026-08-30.md`](./minimax-h146-frozen-facts-2026-08-30.md)

> This document contains interpretation, benchmark design, and decision guidance. It is intentionally separate from the immutable fact record. When this analysis and the frozen fact record differ on an H1.46 measured value, the frozen fact record wins.

## Executive answer

The scientific question is **not “which vendor model has the highest generic benchmark score?”** It is:

> **Given the same completed WebShop trajectories and the same SEED hindsight-analysis task, which model produces the most useful episode-level hindsight for the student, and at what token/time/money cost?**

That distinction changes the benchmark choice.

For this experiment, the best primary benchmark is a **paired, task-specific WebShop hindsight-teacher benchmark** using the exact pinned SEED analysis prompt/parser on the same frozen trajectories. The gold-standard endpoint is downstream utility: does supervision derived from that teacher improve a held-out student evaluation under an otherwise fixed training recipe?

Generic benchmarks such as GPQA/AIME, SWE-bench, chat preference arenas, or even WebShop actor score can be useful supporting context, but none directly measures the job MiniMax/GLM performs here. In H1.46 the teacher does not click or search; it reads a finished trajectory and extracts a reusable episode summary/skill.

The current measured MiniMax-M3 primary pass is already cheap enough that **we do not need to rerun it merely to recover cost**:

- 2,880 frozen trajectories analyzed
- 14,013,558 provider-reported tokens
- about 2 h 02 min wall time with the two arms running concurrently
- conservative public pay-as-you-go equivalent ≤ **¥37.98 ≈ $5.65** for the final primary two-arm pass
- approximately **¥13.19 ≈ $1.96 per 1,000 analyzed trajectories** at the same observed token mix, before any cache discount

The scientifically useful next spend is therefore **not another full MiniMax replay**. It is a small, controlled head-to-head benchmark of MiniMax-M3 vs the SEED reference teacher GLM-5.2 vs Kimi K3 vs one or more exact GPT model IDs.

## 1. What “teacher intelligence” means in this experiment

A model can be excellent at mathematics or coding and still be a mediocre hindsight teacher for a WebShop trajectory. Conversely, a model can be cheaper and less dominant on broad frontier benchmarks while being excellent at this narrow job.

For this study, teacher intelligence should be decomposed into five scientific capabilities:

1. **Trajectory comprehension** — correctly reconstruct what happened across observations/actions.
2. **Diagnosis** — identify why an episode succeeded or failed rather than merely summarize it.
3. **Credit assignment** — locate the decision(s) that materially changed the outcome.
4. **Skill distillation** — turn one episode into a concise, reusable rule that can help future episodes.
5. **Supervision utility** — when the distilled hindsight is actually used for a fixed student update, it improves held-out behavior rather than merely sounding insightful.

The fifth item is strongest because it closes the loop. A fluent teacher response is not necessarily useful training supervision.

## 2. Which benchmark is best?

### 2.1 Primary benchmark: paired WebShop Hindsight Teacher Bench

Recommended internal name: **WHTB — WebShop Hindsight Teacher Bench**.

Every candidate teacher receives the **same semantic inputs**:

```text
same frozen trajectory
+ same pinned SEED episode-analysis prompt
+ same required output schema
+ same maximum output budget
-> teacher output
```

Then evaluate the output without knowing which provider generated it.

### 2.2 Why this is better than common public benchmarks for the present question

| Benchmark family | What it measures well | Why it is not the primary answer here |
|---|---|---|
| GPQA / AIME / general reasoning | difficult reasoning and problem solving | no WebShop trajectory, no hindsight credit assignment, no reusable episode skill |
| SWE-bench / coding-agent benchmarks | code editing and software-agent execution | wrong domain and wrong action space; our teacher is not editing a repository |
| Chat preference / arena ratings | broad user preference | preference is not equivalent to scientific correctness or training utility |
| Long-context benchmarks | retrieval/reasoning over long inputs | useful supporting evidence, but H1.46 prompts are far below the advertised context limit |
| WebShop actor score | ability to act in WebShop | wrong role: H1.46 MiniMax/SEED teacher analyzes completed episodes and must never generate actor actions |
| **WHTB (proposed)** | **exact hindsight job used by the experiment** | directly aligned with the treatment; can be linked to downstream student utility |

### 2.3 Recommended scorecard

Do **not** fold money into an “intelligence” score. Keep quality and efficiency as separate axes.

Suggested quality metrics:

| Metric | Suggested weight in a descriptive composite | Measurement |
|---|---:|---|
| Output/schema validity | 10% | parser pass + required fields |
| Outcome diagnosis correctness | 25% | blinded rubric against trajectory evidence |
| Critical-step / credit-assignment quality | 20% | blinded rubric; optional annotated gold subset |
| Episode-skill specificity and reusability | 20% | blinded human rating with explicit anchors |
| Downstream student utility | 25% | fixed bootstrap/update recipe → held-out WebShop delta |

The weighted score is optional. The raw dimensions should remain visible even if a composite is reported.

Efficiency metrics should be shown beside, not inside, the quality score:

- input tokens / trajectory
- output tokens / trajectory
- total tokens / trajectory
- wall time and per-request latency
- pay-as-you-go equivalent per 1,000 trajectories
- actual incremental charge under the owner's plan
- quality per $ / downstream delta per $

## 3. How to compare MiniMax-M3, GLM-5.2, Kimi K3, and GPT fairly

### 3.1 Candidate roles

| Candidate | Why include it | What is already established here | What is still missing |
|---|---|---|---|
| **GLM-5.2** | SEED Stage-1 external hindsight reference used by the project/paper interpretation | it is the reference teacher role represented by the SEED explainer in this repository | a same-corpus WHTB run and frozen current API/price snapshot |
| **MiniMax-M3** | teacher actually used in H1.46 | complete per-trajectory usage, latency, output and two-arm primary resource accounting | a blinded cross-model teacher-quality score |
| **Kimi K3** | plausible alternative where “more capable per token” is the owner's hypothesis | candidate only | exact model/API identity, first-party price snapshot, then same-corpus WHTB run |
| **GPT** | strong frontier reference and useful price/quality anchor | repository's 2026-08-12 catalog audit recorded GPT-5.6 Sol/Terra/Luna as the then-current general-purpose family | choose exact model ID(s), refresh first-party evidence, freeze price, run same corpus |

**Evidence boundary:** this 2026-08-30 work session does not have enabled live web search. Therefore it would be scientifically wrong to invent current Kimi/GLM/GPT benchmark scores or current API prices. The HTML should show those external numeric cells as **“待同任务实测 / pending source freeze”**, not fill them from memory or marketing tables.

### 3.2 The most important fairness rule: same semantic workload, not same raw token count

The owner's intuition — “with the same token budget, perhaps Kimi K3 is smarter” — is a useful efficiency hypothesis, but **equal raw token counts are not a clean control** because providers use different tokenizers and may account for reasoning/cache tokens differently.

Prefer two complementary comparisons:

**A. Same-workload comparison (primary)**

- same exact trajectory bytes/semantic content
- same SEED prompt
- same required output fields
- same maximum completion budget
- then report each provider's own token count, latency, and cost

This answers: **who gives the best hindsight on the same scientific work?**

**B. Same-money comparison (secondary)**

- fixed budget, e.g. $5 or $10
- each model analyzes as many benchmark trajectories as the budget permits
- quality is evaluated on the completed matched subset or by a predeclared sampling rule

This answers: **how much useful teacher signal can one dollar buy?**

A “same tokens” table may still be shown, but only as resource normalization, not as semantic equivalence.

## 4. Minimal benchmark protocol before spending on a full rerun

A full 2,880-trajectory pass is unnecessary for model selection.

Recommended Phase A:

- **128 frozen trajectories total**
  - 64 from 3B source corpus
  - 64 from 7B source corpus
- preregister sampling before seeing candidate-model outputs
- stratify by source success/failure and trajectory length so easy short cases do not dominate
- use the same pinned SEED episode-analysis prompt/parser
- require the same `episode_summary` + `episode_skill` schema
- cap output length consistently
- preserve every raw response, usage record, latency, parse state, and request/model identity
- blind model identity during qualitative scoring

If two models are close, use a second, independently sampled 128-trajectory panel rather than immediately spending on all 2,880 rows.

Only finalists need Phase B:

- full 2,880 trajectories if durable full-corpus supervision is scientifically useful; and/or
- matched downstream bootstrap/update experiment to measure student utility.

This turns API spend into information gain rather than rerunning a model whose resource accounting is already known.

## 5. What we now know about MiniMax-M3 resource efficiency

### 5.1 Final primary pass

| Metric | 3B source | 7B source | Combined |
|---|---:|---:|---:|
| trajectories | 1,440 | 1,440 | **2,880** |
| prompt tokens | 6,932,829 | 5,723,780 | **12,656,609** |
| completion tokens | 669,587 | 687,362 | **1,356,949** |
| total tokens | **7,602,416** | **6,411,142** | **14,013,558** |
| avg total tokens / trajectory | ~5,279 | ~4,452 | **~4,866** |
| observed wall time | ~2:02:13 | ~1:56:06 | **~2:02 wall** because concurrent |
| conservative price equivalent | ≤¥20.18 | ≤¥17.79 | **≤¥37.98** |
| USD at 2026-08-28 rate | ≈$3.00 | ≈$2.64 | **≈$5.65** |

The longer 3B trajectories are reflected in higher prompt-token use: the frozen 3B source corpus contains 20,341 source actions versus 15,978 for 7B.

### 5.2 Per-trajectory economics under the same conservative pricing assumption

| Metric | 3B | 7B | Overall |
|---|---:|---:|---:|
| RMB / trajectory | ~¥0.0140 | ~¥0.0124 | **~¥0.0132** |
| USD / trajectory | ~$0.00208 | ~$0.00184 | **~$0.00196** |
| equivalent / 1,000 trajectories | ~¥14.02 | ~¥12.36 | **~¥13.19 / ~$1.96** |

These remain upper bounds because per-arm cache-read attribution was not frozen.

### 5.3 Latency distribution from the preserved per-record outputs

During the investigation, the primary JSONL records yielded:

| Arm | mean record latency | median | p95 |
|---|---:|---:|---:|
| 3B | ~10.17 s | ~8.83 s | ~19.36 s |
| 7B | ~9.66 s | ~8.65 s | ~18.66 s |

These are sums of request latency within one trajectory record. Wall-clock completion is much shorter than the sum of all record latencies because requests were concurrent.

## 6. Why the MiniMax console showed 27.66M tokens when the final experiment used 14.01M

This discrepancy is explainable and should be visible on the website because otherwise readers may believe one number is wrong.

Known full passes:

```text
earlier full pass       13,173,879
final thinking-on pass  14,013,558
                       -----------
two full passes          27,187,437
```

Supplied account-window total:

`27,663,133`

Difference:

`475,696 tokens`

The two full passes explain approximately **98.28%** of the account-window tokens. H1.46 also contains qualification/pairing/retry activity. Without a complete request-ID billing reconciliation, the residual should remain residual rather than being forced into a fabricated exact attribution.

The page should therefore display two different boxes:

- **Scientific primary pass: 14.01M tokens**
- **Whole supplied account window: 27.66M tokens**

and explain the earlier full pass in one sentence.

## 7. Public-price-equivalent money: RMB and USD

Frozen MiniMax standard-tier ≤512K public price snapshot:

- input: ¥2.10 / 1M
- output: ¥8.40 / 1M
- cache read: ¥0.42 / 1M

For the final primary pass we do not have a per-arm cache split, so pricing all prompt tokens at ordinary input rate gives a conservative bound:

`12.656609 × 2.10 + 1.356949 × 8.40 = ¥37.98 ≈ $5.65`

For the full supplied account window, the export separates billing classes:

```text
ordinary input 24.348408M -> ~¥51.13
output          1.918101M -> ~¥16.11
cache read      1.396624M -> ~¥0.59
                         = ~¥67.83 ≈ $10.08
```

USD translation uses the historical 2026-08-28 rate used in this analysis: `1 CNY = 0.14866 USD`.

The actual calls were covered by a personally purchased MiniMax Token Plan, so the console did not impose the same incremental pay-as-you-go cash charge. We cannot infer the Token Plan's amortized true cost without the plan purchase price, included quota, and remaining/consumed quota accounting.

## 8. A reusable formula for Kimi/GLM/GPT cost comparisons

For the **same primary H1.46 semantic workload**, the observed MiniMax prompt/output volumes are:

- prompt: `12.656609M`
- completion: `1.356949M`

For a candidate model with public prices:

- `P_in` = currency / million input tokens
- `P_out` = currency / million output tokens

an initial no-cache comparison is:

`estimated_same-volume_cost = 12.656609 × P_in + 1.356949 × P_out`

This is a planning formula, not an invoice forecast. The actual candidate may tokenize the same content differently and produce a different amount of reasoning/output. Once the candidate is run on WHTB, replace this projection with its provider-reported usage.

## 9. The chart the website should lead with

The reader's decision is two-dimensional:

```text
                         better teacher quality
                                  ↑
                                  |
       expensive + strong         |       cheap + strong  ← desired frontier
                                  |
  --------------------------------+----------------------------→ lower cost
                                  |
       expensive + weak           |       cheap + weak
                                  |
```

Recommended real plot once WHTB results exist:

- **Y axis:** teacher quality / downstream student utility
- **X axis:** USD per fixed 128-trajectory panel or per 1,000 trajectories
- **bubble size:** median latency or wall time
- **tooltip/table:** tokens, parser validity, model ID, source date

Today only MiniMax has measured resource coordinates; the other model points should appear as dashed **“pending same-task benchmark”** placeholders. Do not invent vertical positions from generic marketing benchmark charts.

## 10. What can be said today about GLM-5.2 vs MiniMax-M3?

We can say:

- GLM-5.2 is the SEED Stage-1 hindsight-teacher reference represented in this project's SEED explanation.
- MiniMax-M3 was used in H1.46 in the same broad **post-episode analyzer** role, with the pinned SEED analysis prompt/parser and OpenAI-compatible MiniMax endpoint.
- MiniMax resource use is now measured in detail.
- **We do not yet have a controlled head-to-head same-trajectory quality comparison between GLM-5.2 and MiniMax-M3.**

We cannot yet say:

- MiniMax-M3 is as smart as / smarter than GLM-5.2 for SEED hindsight;
- a generic benchmark gap predicts teacher utility;
- the H1.46 downstream result isolates teacher identity causally, because the self arm is not an analyzer-matched self-teacher control.

The direct 128-trajectory WHTB test is the shortest path to answering the first missing scientific question.

## 11. Kimi K3 / GPT decision logic

The owner's hypothesis should be tested as an **efficiency frontier**, not as a slogan that “Kimi is smarter.”

For each candidate, record:

```text
quality on same WHTB panel
÷
provider-reported token use
÷
pay-as-you-go equivalent
÷
wall time
```

Then ask two independent questions:

1. **Absolute quality:** which teacher produces better hindsight on the same trajectories?
2. **Efficiency:** how much of that quality/downstream lift do we get per dollar and per minute?

A model can win one and lose the other. That is scientifically more informative than forcing one global rank.

## 12. Recommended next experiment

**Do not rerun MiniMax full-corpus for accounting.** Its accounting is already recoverable.

Next, preregister and run:

1. one 128-trajectory WHTB panel;
2. MiniMax-M3 as the measured anchor;
3. GLM-5.2 as the SEED reference;
4. Kimi K3 after exact current API/model/price evidence is frozen;
5. one exact GPT frontier model (and optionally one cheaper GPT tier) after exact model/price evidence is frozen;
6. blinded quality scoring;
7. resource/cost table;
8. only if warranted, a downstream matched bootstrap test for the best two candidates.

That experiment directly answers the owner's real question: **if we spend the same scientific workload or the same dollars on a teacher, which model gives the student the most useful hindsight?**
