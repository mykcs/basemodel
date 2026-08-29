# H1.46 MiniMax-M3 external hindsight analyzer — frozen fact record

**Record date:** 2026-08-30  
**Status:** **FROZEN FACT RECORD / DO NOT EDIT IN PLACE**  
**Scope:** H1.46 MiniMax-M3 trajectory-analysis resource use, API route, role boundary, and the MiniMax price/account materials supplied for this study.

> [!CAUTION]
> **Agent rule — immutable in place.** This file is a dated evidence record, not a living summary. Future Agents MUST NOT rewrite, “clean up”, refresh prices inside, silently correct, or reinterpret any line in this file. If later evidence changes a fact, create a new dated superseding fact record, explicitly name this file as its predecessor, and update downstream analysis/page references to the newer record. Preserve this file byte-for-byte as historical evidence.
>
> This rule is intentionally stronger than ordinary `docs/agents/current/*` maintenance. Analysis belongs in a separate document. New model rankings, current-market claims, estimates, causal interpretations, and benchmark judgments are forbidden here.

## 1. Evidence boundary

This record freezes only evidence available in the 2026-08-29/30 investigation:

1. **H1.46 server artifacts** under:
   - `/data/home/wangr/workspace/runs/20260828-h146-minimax-m3-analyzer-webshop/`
2. **Exact experiment code/config** in `mykcs/openevo-experiment`, including commit `a9100d67ca436532a1a46eee2a69505ce4f0f56c`:
   - `scripts/openevo_webshop/h146_analyze_trajectories.py`
   - `configs/experiment/h1.46-two-arm-minimax-m3-v1.json`
   - `configs/experiment/h1.46-external-analyzer-bootstrap-v1.json`
3. **MiniMax official pricing material supplied by the owner**, including the official pay-as-you-go pricing page snapshot/documentation:
   - `https://platform.minimaxi.com/docs/guides/pricing-paygo`
4. **MiniMax console usage screenshot and official exported usage table supplied by the owner** for the 2026-08-27 through 2026-08-29 window.
5. **Historical CNY→USD conversion used only for deterministic currency translation in the companion analysis:** 2026-08-28, `1 CNY = 0.14866 USD`. This exchange rate is not a MiniMax fact and is not used to redefine any original RMB value.

No secret API key value is stored here. Console/account labels that are not scientifically necessary are intentionally not reproduced on the public record.

## 2. What MiniMax actually did in H1.46

### 2.1 Provider, model, endpoint, protocol

| Field | Frozen fact |
|---|---|
| Provider | MiniMax |
| Model | `MiniMax-M3` |
| Endpoint base | `https://api.minimaxi.com/v1` |
| Request endpoint in code | `/chat/completions` |
| Wire/API shape | OpenAI-compatible Chat Completions |
| HTTP client used by H1.46 adapter | `httpx.post(...)` |
| Credential transport | `Authorization: Bearer <MiniMax API key>` |
| Environment variable name used by the H1.46 script | `OPENAI_API_KEY` |
| Meaning of that variable in this run | It held a MiniMax API key; the variable name does **not** mean requests were sent to OpenAI. |
| Service tier | `standard` |
| Temperature | `0.0` |
| Max completion tokens | `1024` |
| Final primary reasoning profile | `thinking.type = adaptive`, `reasoning_split = true` |

The implementation deliberately prevents the pinned SEED OpenAI client from being used. It imports the pinned SEED analyzer prompt/parser, then sends the resulting messages through the H1.46 MiniMax adapter.

### 2.2 Scientific role boundary

MiniMax was a **post-hoc trajectory analyzer / external hindsight source**.

Frozen role invariants:

- MiniMax analyzes an already completed WebShop episode.
- MiniMax does **not** generate WebShop `search[...]` or `click[...]` actor actions in the valid H1.46 treatment.
- H1.46 reuses frozen student trajectories; it does not recollect the 3B/7B student rollouts for the external-analyzer pass.
- There is one primary analyzer job per completed trajectory before parse-retry overhead.
- MiniMax is not called in the Stage-2 environment step loop.
- After the Stage-1 analyzer gate, Stage 2 is local student/self evolution; external API credentials are forbidden there.

This is important because “MiniMax teacher tokens” are **analysis tokens**, not actor/environment-interaction tokens.

## 3. Frozen student trajectory corpus analyzed by MiniMax

| Arm | Frozen source trajectories | Source model |
|---|---:|---|
| 3B / MiniMax | 1,440 | Qwen2.5-3B-Instruct |
| 7B / MiniMax | 1,440 | Qwen2.5-7B-Instruct |
| **Total** | **2,880** | two frozen student corpora |

Shared Stage-1 schedule identity in the H1.46 contract:

- 180 WebShop tasks
- 8 rollouts per task
- maximum 15 steps
- `180 × 8 = 1,440` trajectories per student corpus

## 4. Final primary MiniMax analysis: exact recorded resource use

The final primary profile is the `thinking=adaptive` / `reasoning_split=true` run under:

`formal-thinking-on-4bd21431/`

### 4.1 3B / MiniMax

Source summary:

`formal-thinking-on-4bd21431/3b-thinking-on.summary.json`

| Metric | Exact recorded value |
|---|---:|
| Requested trajectories | 1,440 |
| Records | 1,440 |
| Parse OK | 1,440 |
| Parse failures | 0 |
| Primary analyzer generations | 1,440 |
| Parse retries | 2 |
| Generation calls | 1,442 |
| HTTP attempts | 1,456 |
| Transport retries | 14 |
| Prompt tokens | **6,932,829** |
| Completion tokens | **669,587** |
| Total tokens | **7,602,416** |
| Source actions represented in the frozen trajectories | 20,341 |
| Records with reasoning present | 1,440 |

Per-record files also preserve `prompt_tokens`, `completion_tokens`, `total_tokens`, `latency_seconds`, request latencies, trajectory ID/hash, reasoning metadata, and parse/retry state.

Observed timing evidence:

- formal start receipt created: `2026-08-28 06:50:44 UTC`
- 3B summary file completed: approximately `2026-08-28 08:52:57 UTC`
- observed wall-clock span: approximately **2 h 02 min 13 s**

### 4.2 7B / MiniMax

Source summary:

`formal-thinking-on-4bd21431/7b-thinking-on.summary.json`

| Metric | Exact recorded value |
|---|---:|
| Requested trajectories | 1,440 |
| Records | 1,440 |
| Parse OK | 1,440 |
| Parse failures | 0 |
| Primary analyzer generations | 1,440 |
| Parse retries | 10 |
| Generation calls | 1,450 |
| HTTP attempts | 1,459 |
| Transport retries | 9 |
| Prompt tokens | **5,723,780** |
| Completion tokens | **687,362** |
| Total tokens | **6,411,142** |
| Source actions represented in the frozen trajectories | 15,978 |
| Records with reasoning present | 1,440 |

Observed timing evidence:

- formal start receipt created: `2026-08-28 06:50:44 UTC`
- 7B summary file completed: approximately `2026-08-28 08:46:50 UTC`
- observed wall-clock span: approximately **1 h 56 min 06 s**

### 4.3 Final primary two-arm total

Deterministic sum of the two frozen summaries:

| Metric | Two-arm total |
|---|---:|
| Analyzed trajectories | **2,880** |
| Prompt tokens | **12,656,609** |
| Completion tokens | **1,356,949** |
| Total tokens | **14,013,558** |
| Primary analyzer generations | **2,880** |
| Generation calls | **2,892** |
| HTTP attempts | **2,915** |
| Transport retries | **23** |
| Parse retries | **12** |

The 3B and 7B analyses ran concurrently. Therefore their per-arm wall times must **not** be added. The observed elapsed wall time for the paired primary pass is approximately the slower arm: **2 h 02 min**.

## 5. Earlier full analysis pass that was not the final primary profile

Before the final `thinking=adaptive` primary pass, H1.46 also produced a full earlier analysis under:

`formal-4c76178c-r1/`

Frozen totals from its two summary files:

| Earlier pass | Total tokens |
|---|---:|
| 3B | 7,218,723 |
| 7B | 5,955,156 |
| **Combined** | **13,173,879** |

This earlier pass is real API consumption, but it is **not** the final primary treatment whose outputs are used to describe the scientific MiniMax arm. It must not be silently mixed with the primary 14,013,558-token figure.

The two full passes together account for:

`13,173,879 + 14,013,558 = 27,187,437 tokens`.

## 6. MiniMax official account-window usage supplied by the owner

For the supplied console/export window covering 2026-08-27 through 2026-08-29, the MiniMax console reports:

**27,663,133 total tokens**.

The exported table permits the following aggregate decomposition:

| Billing/use class | Tokens |
|---|---:|
| Ordinary input / chat-completion input | **24,348,408** |
| Output | **1,918,101** |
| Cache read | **1,396,624** |
| **Total** | **27,663,133** |

The two known full H1.46 analysis passes explain **27,187,437 tokens**, or about **98.28%** of this supplied account-window total. The residual is **475,696 tokens**. Qualification probes, paired thinking tests, retries, and/or other calls exist in this window, but this record does **not** assign every residual token to a particular request because no complete request-ID-to-billing-row reconciliation was frozen.

Therefore:

- `27,663,133` is the **supplied account-window total**, not the final scientific treatment cost.
- `14,013,558` is the **final primary two-arm MiniMax analyzer total** recorded by H1.46.
- `13,173,879` is a **real earlier full analysis pass** and explains why the console total is roughly twice the primary treatment total.

## 7. Frozen MiniMax public pay-as-you-go price snapshot

For MiniMax-M3, standard service tier, context ≤ 512K, the supplied official pricing material states:

| Billing class | Price |
|---|---:|
| Input | **¥2.10 / 1M tokens** |
| Output | **¥8.40 / 1M tokens** |
| Cache read | **¥0.42 / 1M tokens** |

The page also displays higher prices for >512K contexts and for the `priority` service tier. H1.46's frozen contract says `service_tier = standard`; its per-request prompts were far below 512K.

The owner's actual calls were covered by a personally purchased MiniMax Token Plan. The supplied console rows show no additional pay-as-you-go cash charge for these calls. This does **not** mean the Token Plan itself was free and does **not** establish the plan's amortized economic cost.

## 8. Deterministic price translations permitted from the frozen facts

These are mechanical arithmetic, not new provider claims.

### 8.1 Final primary pass: conservative pay-as-you-go upper bound

The H1.46 per-arm summaries record prompt/completion totals but do not preserve a per-arm split of prompt tokens into ordinary-input versus cache-read billing buckets. Therefore the conservative reproducible calculation prices **all prompt tokens as ordinary input**:

`cost_upper_bound = prompt_M × ¥2.10 + completion_M × ¥8.40`

| Final primary arm | Conservative RMB upper bound | 2026-08-28 USD translation (`1 CNY = 0.14866 USD`) |
|---|---:|---:|
| 3B / MiniMax | **¥20.18** | **≈ $3.00** |
| 7B / MiniMax | **¥17.79** | **≈ $2.64** |
| **Two-arm primary** | **¥37.98** | **≈ $5.65** |

Because any cache-read portion would be billed below the ordinary-input rate, these are upper bounds under the frozen public price snapshot, not exact provider invoices for the two arms.

### 8.2 Entire supplied account window: price-equivalent using the export's billing classes

Here the supplied export already separates ordinary input, output, and cache read, so the mechanical pay-as-you-go equivalent is:

- ordinary input: `24.348408M × ¥2.10 = ¥51.13`
- output: `1.918101M × ¥8.40 = ¥16.11`
- cache read: `1.396624M × ¥0.42 = ¥0.59`
- total: **≈ ¥67.83**
- 2026-08-28 USD translation: **≈ $10.08**

This `≈¥67.83 / ≈$10.08` value is a **public-price equivalent for the supplied account window**, not the final primary scientific treatment and not the owner's Token Plan purchase price.

## 9. Downstream training-use fact that must not be conflated with analysis volume

H1.46 preserves all 1,440 MiniMax analysis rows per arm as durable evidence. The preregistered primary bootstrap does **not** train on all 1,440 rows directly.

Frozen downstream selection rule:

- 8 task identities
- rollout slots 0 and 1
- **16 selected analyzer-supervision records per arm**
- selected without using outcome fields for post-hoc cherry-picking
- those 16 records feed the OpenEvo-native SD-LoRA bootstrap recipe

So two different quantities must remain visible:

1. **1,440 trajectories analyzed per arm** — API/hindsight evidence volume.
2. **16 analyzer records selected per arm** — primary bootstrap training-supervision volume.

## 10. Facts explicitly NOT frozen by this record

The following are outside this fact record and must not be inferred from it:

- MiniMax-M3 is smarter/weaker than GLM-5.2, Kimi K3, or any GPT model.
- Any current 2026-08-30 general benchmark ranking among those models.
- Any claim that equal provider-reported token counts are semantically equal across tokenizers.
- Any causal claim that the MiniMax arm differs from self solely because of analyzer identity; H1.45 self is not an analyzer-matched self-teacher control.
- Exact per-arm MiniMax cache-read token counts.
- Exact Token Plan amortized RMB/USD cost.
- Exact account-window attribution of the residual 475,696 tokens.
- Any future/current provider price after this frozen MiniMax price snapshot.

Those questions belong to the companion analysis and/or a new benchmark experiment.

## 11. Supersession protocol

A correction must be made by creating a new file, for example:

`docs/agents/current/minimax-h146-frozen-facts-YYYY-MM-DD-v2.md`

The new file must include:

- `Supersedes: minimax-h146-frozen-facts-2026-08-30.md`
- the exact evidence that changed;
- old value → new value;
- whether the change affects published HTML conclusions;
- a new immutable hash/protection test if the repository uses one.

**Do not edit this record to make history look cleaner.**
