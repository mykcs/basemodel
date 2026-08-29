# MiniMax hindsight 教师：智能比较、Token 成本与网页发布复盘 — 2026-08-30

Status: **historical case / reusable Agent friction record, not current authority**  
Conversation scope: 从用户提供 MiniMax 控制台截图、官方价格文本和实验网页截图开始，到 H1.46 真实调用证据审计、成本重建、教师能力 benchmark 设计、冻结事实/活分析双文档、HTML 页面、PR #335 与 Production 发布完成。  
Primary current owners: `../current/minimax-h146-frozen-facts-2026-08-30.md`, `../current/minimax-h146-teacher-intelligence-cost-analysis.md`, `../current/model-catalog-verification-policy.md`, `../current/human-thinking-web-expression-contract.md`, `../current/deployment-policy.md`, and `../current/release-closeout-protocol.md`.

This file records **how the reasoning and engineering actually converged**, especially the places where a plausible shortcut would have produced a scientifically wrong or operationally fragile answer. If this file disagrees with executable repository truth, live experiment/provider state, or a current policy file, this file loses.

## Executive summary

The conversation began as a seemingly simple website request: the MiniMax arm should disclose how many API tokens it consumed, how long it took, what it would cost at public API prices, and whether MiniMax was a sufficiently strong external teacher compared with the GLM-5.2 teacher used by SEED, Kimi K3, and GPT-class models.

The key correction was that these are **not one question**. The work had to separate:

```text
what MiniMax actually did in H1.46
!=
how much the account spent that day
!=
how much the final scientific treatment consumed
!=
how intelligent MiniMax is as a hindsight teacher
!=
how cost-efficient it is relative to another provider
```

The final architecture therefore became three layers:

1. **Frozen facts** — exact experiment/API/account facts that future Agents must not rewrite in place.
2. **Living analysis** — benchmark design, model-comparison logic, cost-efficiency interpretation, and next experiments that may evolve.
3. **Reader-facing HTML** — a research page that answers the scientific question first, then exposes resource accounting and provenance.

The main scientific design conclusion was that a generic benchmark such as GPQA, AIME, SWE-bench, or even WebShop actor score is not the primary test for this role. H1.46 MiniMax is a **post-episode trajectory analyzer**, not the WebShop actor. The proposed direct benchmark is therefore **WHTB — WebShop Hindsight Teacher Bench**: give candidate teachers the same frozen trajectories, same pinned SEED hindsight prompt, same output schema, and then compare diagnosis quality, credit assignment, reusable skill quality, downstream student utility, latency, tokens, and dollars.

## Conversation arc: what changed our belief

### 1. The screenshots were useful orientation, but not the strongest evidence

The user provided:

- a website screenshot showing 3B/7B × self/MiniMax experiment structure;
- a MiniMax API usage screenshot showing `27,663,133` total tokens over the relevant window;
- MiniMax public pricing text for M3 input/output/cache-read tokens;
- contextual knowledge that the calls used a personally purchased MiniMax Token Plan and an API key.

A tempting first answer would have been to divide the console total between 3B and 7B or to call all `27.66M` tokens “the experiment cost”. That would have been wrong.

The server run tree contained stronger evidence: per-arm summary JSON plus per-trajectory JSONL with provider-reported `prompt_tokens`, `completion_tokens`, `total_tokens`, request latency, retries, model identity, and reasoning metadata. The correct move was to inspect those first and use the console export as a reconciliation layer rather than as the primary scientific meter.

### 2. “OpenAI API” turned out to mean OpenAI-compatible protocol, not OpenAI provider

The user remembered that MiniMax had been connected through an “OpenAI format API”. The actual H1.46 code showed:

```text
endpoint: https://api.minimaxi.com/v1/chat/completions
transport: direct httpx POST
provider: MiniMax
model: MiniMax-M3
protocol shape: OpenAI-compatible Chat Completions
credential env name: OPENAI_API_KEY
```

The environment variable name was misleading. It did **not** mean the request went to OpenAI. The adapter deliberately bypassed SEED's OpenAI client and sent a Bearer token to MiniMax's endpoint.

Reusable lesson: never infer provider identity from an environment variable name or SDK-shaped payload. Resolve endpoint + request code + model ID + provider contract together.

### 3. MiniMax was not the WebShop actor

The most important semantic correction was role identity. MiniMax did not click/search inside WebShop. The actor trajectory was already complete; MiniMax read that completed trajectory afterward and generated SEED-style episode summary/skill hindsight.

That changes both benchmark choice and causal claims. A “MiniMax teacher” label is acceptable shorthand in UI, but the scientific role is **post-hoc trajectory analyzer / hindsight teacher**.

This is why actor benchmarks cannot directly answer “is MiniMax a good teacher here?” and why the four-arm design must not be overstated as a pure teacher-identity causal comparison without analyzer-matched controls.

## The resource accounting that survived audit

The final primary `thinking=adaptive` pass was recoverable exactly by arm:

| arm | trajectories | prompt tokens | completion tokens | total tokens | approximate wall time |
| --- | ---: | ---: | ---: | ---: | ---: |
| 3B / MiniMax | 1,440 | 6,932,829 | 669,587 | 7,602,416 | ~2:02:13 |
| 7B / MiniMax | 1,440 | 5,723,780 | 687,362 | 6,411,142 | ~1:56:06 |
| combined primary | 2,880 | 12,656,609 | 1,356,949 | 14,013,558 | ~2:02 concurrent wall |

The account window showed `27,663,133` tokens. A prior complete analysis pass consumed `13,173,879`; adding the final primary pass gives `27,187,437`, explaining about **98.28%** of the account window before qualification, paired thinking tests, retries, and other residual activity.

The residual was intentionally not reverse-assigned to 3B or 7B without evidence.

## Cost reasoning lessons

### 1. Public pay-as-you-go equivalent is not the same as actual incremental charge

The user used a prepaid Token Plan. Therefore three cost notions must remain distinct:

```text
provider token usage
→ public pay-as-you-go equivalent
→ actual incremental account charge
→ amortized Token Plan purchase cost
```

The experiment can reconstruct the first two. It cannot derive the fourth without the plan purchase price, included quota, validity period, and allocation rule.

So the page correctly says the calls were covered by the Token Plan and treats public API pricing as an **equivalent**, not as proof of what the user economically paid for those calls.

### 2. Cache-read makes per-arm historical billing non-reconstructible from the final summaries

The MiniMax account export distinguishes ordinary input, output, and cache-read tokens. The per-arm experiment summaries preserve prompt/completion totals but do not freeze per-arm cache-read attribution.

Therefore the per-arm public-price numbers are conservative upper bounds that assume prompt tokens are billed as ordinary input. The account-window equivalent can use the exported cache-read split more precisely.

Reusable lesson: if a future experiment needs exact per-arm billing, log provider billing-class counters at request granularity at experiment time. Do not assume a later account-level hourly export can be perfectly unmixed when arms ran concurrently.

### 3. Re-running does not recover historical billing truth

The user offered to rerun MiniMax analysis if needed. That was unnecessary for the core accounting because the original run already logged per-request usage and latency.

More importantly, a rerun would create a **new cache state, new provider behavior, new latency conditions, and potentially new model revision**, so it would not reconstruct historical cache-read billing exactly anyway.

Reusable rule: before paying to rerun, inventory the original receipts. Rerun only when the missing quantity is scientifically necessary and reproducible under a new, explicitly dated measurement contract.

## Scientific benchmark lessons

### 1. Benchmark the role actually used in the experiment

The candidate teacher's job is:

```text
completed WebShop trajectory
→ diagnose what happened
→ assign credit/blame
→ compress the episode into reusable summary/skill
→ provide supervision that may improve the student
```

So the direct benchmark should reproduce that workload. Generic reasoning/coding leaderboards are context, not the main outcome.

The proposed WHTB protocol fixes:

- the same frozen trajectory bytes;
- the same pinned SEED analysis prompt;
- the same output schema (`episode_summary`, `episode_skill`);
- the same parsing/evaluation contract;
- blind teacher-quality judging;
- downstream student utility for the strongest candidates.

### 2. “Same token count” is not a clean cross-provider control

Raw token counts are tokenizer- and provider-dependent. Reasoning tokens, cache accounting, hidden/internal token treatment, and output conventions can differ.

A better design uses two complementary controls:

1. **same semantic workload** — identical trajectories and prompt contract; measure each provider's resulting tokens, dollars, and latency;
2. **same dollar budget** — e.g. $5/$10; measure how much usable teacher supervision each provider buys.

This produces a meaningful quality/cost frontier instead of pretending 14M MiniMax tokens are equivalent to 14M Kimi or GPT tokens.

### 3. Downstream utility is stronger evidence than “the hindsight sounds good”

A teacher can generate fluent summaries that judges like but still fail to improve the student. The strongest scientific endpoint is therefore not only blind text quality, but whether a fixed downstream training recipe produces better held-out WebShop performance.

The recommended staged design is:

```text
128 frozen trajectories
→ all candidate teachers generate hindsight
→ blind quality scoring
→ retain top candidates
→ fixed downstream bootstrap/update recipe
→ held-out WebShop evaluation
```

This controls API spend while still testing the mechanism that matters.

## Evidence-boundary lesson: current external model claims must stay current

The user specifically wanted comparison with GLM-5.2, Kimi K3, and GPT models. During the conversation, live web search was unavailable. Repository policy also requires current first-party verification for fast-moving model identity, price, benchmark, and lifecycle claims.

The correct decision was to leave current Kimi/GLM/GPT numeric price/ranking cells **pending** rather than fill them from memory or marketing tables.

Reusable rule: when the scientific page needs a current provider/model fact and current first-party verification is unavailable, preserve the unknown. A visually complete but stale comparison table is worse than an explicit pending cell.

## Why frozen facts and living analysis were split

The user explicitly wanted one document that future Agents could not casually rewrite, plus a second document for interpretation.

That was implemented as:

- `docs/agents/current/minimax-h146-frozen-facts-2026-08-30.md`
- `docs/agents/current/minimax-h146-teacher-intelligence-cost-analysis.md`

The frozen record has an in-file “do not edit in place” rule, a directory-level Agent instruction, and a regression test that pins its SHA-256. Corrections require a new dated superseding record while preserving the old bytes.

This pattern is useful when a research page mixes two very different kinds of knowledge:

```text
immutable historical observation
vs
interpretation / recommendation / next experiment
```

Do not force both into one mutable document.

## Web-expression lessons

### 1. The page should answer the scientific question before showing the bill

The final page order was deliberately:

```text
what should we benchmark?
→ how should GLM/MiniMax/Kimi/GPT be compared?
→ why same-token is not enough
→ what MiniMax actually consumed
→ why the console says 27.66M
→ what experiment to run next
→ provenance
```

This prevents an accounting dashboard from becoming the apparent scientific conclusion.

### 2. Native HTML is better than a generated infographic for this evidence

The resource bars, accounting reconciliation, comparison table, and proposed quality/cost frontier were built as HTML/CSS rather than as a generated image. That keeps the numbers inspectable, text selectable, responsive, testable, and easy to update from future evidence.

The cost-quality frontier intentionally labels unmeasured candidates as pending; plotted vertical positions must not silently imply a capability ranking before WHTB exists.

### 3. Put the audit where readers encounter the MiniMax choice

The new page was also linked from the MiniMax area of the OpenEvo experiment selector. The user should not have to know the internal route to discover why MiniMax was chosen or what it cost.

## Engineering friction and recovery patterns

### Friction A — sequential GitHub Contents writes created noisy Preview churn

The initial implementation used several sequential file writes. Each commit triggered the Git integration, and Vercel created multiple deployments that were then canceled by ignored-build logic.

Worse, the first commit carrying `[vercel-preview]` touched only a test file. The ignore script correctly concluded that the exact Git range had no deploy-relevant change and canceled the Preview even though earlier commits in the branch contained the page.

Recovery: make a deploy-relevant source change on the exact head with the Preview opt-in token, then run the hosted build.

Reusable rule: for multi-file website changes, prefer one atomic local/tree commit (or one intentionally grouped integration head). Put `[vercel-preview]` on the exact head whose diff contains or reaches the deploy-relevant source under the repository's range semantics. A green GitHub/Vercel context or an opt-in token alone does not prove the hosted build ran.

### Friction B — `main` moved while the branch was being built

A separate server-overview PR landed on `main` during this work. The feature branch had been created from an older base.

Recovery: fetch current `main`, inspect the intervening work, merge it without discarding peer changes, rerun local Gate/build, then create the final Preview and merge.

Reusable rule: exact-head acceptance is ephemeral. Before the final provider-triggering push and again before merge, compare branch base/head with current intended `main`.

### Friction C — shell dialect assumptions caused a harmless but avoidable failure

One local automation command used Bash loop/heredoc syntax while Desktop Commander defaulted to `fish`; it failed before mutation.

Recovery: explicitly run commands requiring Bash semantics with `/bin/bash`.

Reusable rule: shell dialect is part of the execution environment. Do not treat syntax failure as repository failure.

### Friction D — protected Preview fetches can redirect even when the deployment is healthy

The Vercel Preview was protected. Programmatic fetches could return authentication redirects, so a simple fetch was not sufficient visual acceptance evidence.

Recovery: combine provider deployment state/logs with local browser screenshots for desktop/mobile, then separately verify the merged Production route with an HTTP 200 and expected rendered content.

Reusable rule: provider `READY`, authenticated fetchability, visual acceptance, and public Production acceptance are separate evidence layers.

### Friction E — CI can still be in browser acceptance after deterministic checks are green

The self-hosted CI completed deterministic verification and static build before its risk-based browser step. Merging before that final step would have weakened the intended gate.

Recovery: wait for the exact-head CI run to reach terminal `success`, then merge.

Reusable rule: report step-level progress accurately; “tests passed” is not the same as “workflow passed”.

### Friction F — visual inspection caught layout safety, but not bilingual route integrity

Desktop and mobile screenshots looked good and body-level overflow was acceptable. However, the shipped Chinese page uses `AppLayout`, which emits an English alternate/hreflang URL automatically, while no English sibling route was created.

A later direct Production check confirmed:

```text
/en/research/seed-openevo/study/minimax-teacher/ -> 404
```

This is a **known residual gap from this conversation**. It does not invalidate the scientific accounting, but it means the release should not be treated as perfectly bilingual-complete.

Reusable rule: when a shared layout synthesizes locale alternates, route existence must be part of acceptance. A page can visually pass in one locale while publishing a broken hreflang/language-switch destination.

## What worked especially well

### Evidence was taken from the closest source to the event

Per-request and per-arm experiment receipts beat screenshots; account exports beat visual totals for billing classes; code beats memory for provider/protocol identity; Production provider metadata beats “it should be deployed”.

### Unknowns were preserved instead of cosmetically filled

Kimi/GLM/GPT current prices and head-to-head teacher quality stayed pending. Cache-read attribution was not invented. Residual account tokens were not arbitrarily assigned. Token Plan amortization was not guessed.

### The next experiment was made cheaper and more informative

Instead of repeating 2,880 MiniMax analyses, the next proposed spend is a 128-trajectory head-to-head that directly tests the uncertainty: teacher quality and efficiency across providers.

### Facts gained a real immutability mechanism

The frozen record is protected by both instruction and a hash regression test. This is stronger than a warning paragraph alone and makes accidental “cleanup” detectable in CI.

## Recommended workflow for the next Agent

When asked again about MiniMax/GLM/Kimi/GPT teacher quality or API cost:

1. Read the frozen H1.46 fact record first; do not edit it in place.
2. Read the living teacher-intelligence/cost analysis for the current benchmark design.
3. Inspect current experiment-side receipts before proposing any rerun.
4. Re-verify current external model IDs, pricing, lifecycle, and first-party benchmark claims on the date of comparison.
5. Keep provider role identity explicit: actor vs post-hoc analyzer vs judge vs reward model.
6. Prefer same semantic workload plus same-dollar controls; do not treat raw token equality as fairness.
7. If WHTB is executed, freeze trajectory IDs/hashes, prompt/parser/schema, model IDs, service tiers, temperature/reasoning settings, request limits, usage counters, latency, retries, and provider billing classes before the first formal call.
8. Judge teacher text blind to provider identity; retain raw outputs and scoring rubric.
9. Use downstream student utility for the strongest candidates before making a causal recommendation.
10. Publish measured quality, cost, tokens, and latency on separate axes; do not call “cheaper” “smarter”.
11. Batch source/docs/tests into one coherent branch head and run exact-head Preview only when deploy-relevant changes are actually present.
12. Verify both language routes when the layout emits hreflang/language-switch metadata.

## Durable references

Current factual authority:

- `docs/agents/current/minimax-h146-frozen-facts-2026-08-30.md`

Current living interpretation:

- `docs/agents/current/minimax-h146-teacher-intelligence-cost-analysis.md`

Historical experiment/presentation context:

- `2026-08-30-openevo-capability-exploration-series-retrospective.md`
- `2026-08-28-webshop-training-design-and-analyzer-architecture-retrospective.md`

Release that implemented the page and protections:

- PR #335
- merge commit `432e3e7d8e68db8b132e4a1c0dbeeec3a89f4704`
- reader route: `/research/seed-openevo/study/minimax-teacher/`

## Final mental model

The most reusable lesson from the whole conversation is this:

```text
first identify the scientific role
→ find the closest immutable evidence
→ separate experiment treatment from account activity
→ separate usage from price-equivalent from real prepaid economics
→ benchmark the role with the same semantic workload
→ preserve unknowns for fast-moving external models
→ freeze facts, keep analysis mutable
→ express the reasoning in inspectable HTML
→ accept the exact source tree, exact provider deployment, both locales, and the public route separately
```

That sequence prevented a superficially simple “how many tokens did MiniMax cost?” question from turning into a misleading model-ranking page or a false accounting claim.
