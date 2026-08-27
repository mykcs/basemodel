# 2026-08-27 Vercel Pro decision, build-latency, and provider-wait retrospective

Status: **historical rationale / reusable workflow evidence**  
Date: **2026-08-27**  
Related changes: PR #273, #277, #279, #281, #283

This document records the parts of the 2026-08-27 Vercel conversation that are **not fully captured by the browser-gate/Lab-flaky retrospective**: how to decide whether paying for Vercel Pro is actually useful, how to separate traffic quota from build latency, how to interpret queue/build/Agent-wait time, how to avoid babysitting provider jobs, and how to handle billing/add-on uncertainty honestly.

For the detailed Lab hydration race, Chromium shell cache, and 4-vs-6-vs-8 worker benchmark, also read [`2026-08-27-vercel-browser-gate-performance-and-lab-flaky-retrospective.md`](./2026-08-27-vercel-browser-gate-performance-and-lab-flaky-retrospective.md).

This file is historical evidence. Current executable source, live Vercel state, and `docs/agents/current/*` remain authoritative.

## Why this case is worth keeping

The original question sounded simple:

> Will paying for Vercel make website work faster?

That question mixed together several different clocks:

```text
traffic/runtime usage
!= deployment queue time
!= build/validation time
!= Agent time spent waiting for the provider
!= billing add-ons
```

The useful result came only after those were separated.

At the beginning, account usage was far below Hobby runtime quotas, so traffic capacity was not the problem. The real bottleneck was a hosted browser-validation pipeline in which a 91-test Playwright matrix was running serially. Later, after the team moved to Pro, live provider evidence showed larger build machines and the same test surface could use bounded parallelism safely. The full high-risk feedback loop dropped from roughly twelve minutes to roughly three minutes without deleting tests or lowering thresholds.

A second, independent friction source then became obvious: even when the provider legitimately needed a few minutes, the Agent was wasting user-visible time in repeated `sleep -> poll -> inspect partial logs -> sleep` loops. That was fixed as a workflow problem rather than a Vercel performance problem.

## 1. Friction: runtime quota and developer feedback were initially conflated

The account's last-30-day usage at the time of the decision was small relative to Hobby limits:

- Edge Requests: about `32K / 1M`;
- Fast Data Transfer: about `1.19 GB / 100 GB`;
- Speed Insights events: about `695 / 10K`;
- Edge Request CPU: about `13s / 1h`;
- Function invocations: `0`.

That evidence correctly showed that the site did **not** need Pro for traffic scale, bandwidth, functions, or CPU quota.

But that did **not** answer whether Pro could improve the development loop.

The durable distinction is:

```text
runtime headroom
answers: can the deployed site handle current traffic?

build feedback
answers: how quickly can a developer/Agent get a trustworthy Preview or Production result?
```

Do not use low request/transfer usage as evidence that a paid build plan has no value. Conversely, do not use slow builds as evidence that the site needs more runtime quota.

## 2. Friction: the first plan decision was under-informed until build logs were decomposed

A slow deployment should be split into at least three timings:

```text
queue
-> build/validation
-> deploy/finalization
```

Live evidence showed two very different cases.

One Preview had meaningful queueing (roughly a minute-plus) and a short build, so concurrent-build benefits could matter there.

But the painful full deployments showed approximately:

```text
queue: about 1 second
build: about 12 minutes
```

The dominant cost was inside the build itself, especially:

```text
91 Playwright tests
using 1 worker
~9.5-9.9 minutes
```

That meant “no build queueing” was not the main answer to the twelve-minute problem.

### Reusable rule

Before recommending a hosting-plan upgrade for speed, inspect the exact deployment and answer:

1. How long was it queued?
2. How long did the build run?
3. Which command consumed the build wall time?
4. Is that command CPU-bound, I/O-bound, network-bound, or intentionally serial?
5. Would a larger machine help this command, or is the command/configuration the real bottleneck?

Plan marketing language is weaker evidence than the exact build log.

## 3. Success: optimize build scope before paying for brute force

PR #273 (`perf(vercel): scope Production browser gate by UI risk`) addressed the largest structural waste first.

The hosted browser layer became risk-aware:

```text
shared/global UI or planner uncertainty
-> full Chromium matrix

concrete page-only change
-> changed-route smoke + mapped regression owners

content-only change
-> representative safety coverage + mapped owners

non-UI change
-> browser layer may skip after deterministic Gate + static build
```

The important success pattern is not “skip tests.” It is:

> Stop rerunning unrelated browser surfaces when the changed surface can be proven narrowly, while failing closed whenever scope is uncertain.

This is the right first optimization because it improves both free and paid plans.

## 4. Friction: hardware conclusions from Hobby did not transfer automatically to Pro

On the 2-core / 8 GB Hobby builder, the obvious experiment—use two Playwright workers—did not help. The same full matrix still took about `12m21s`, and several CPU-heavy cases slowed down under contention.

It would have been a mistake to freeze that result into a universal rule such as:

```text
parallel Playwright is bad
```

After the team upgraded, live Vercel evidence showed an 8-core / 16 GB Enhanced build machine. PR #277 then used the machine's actual visible CPU count and chose bounded concurrency:

```text
workers = max(1, min(4, floor(visible CPUs / 2)))
```

On the 8-core Pro builder:

```text
91 tests / 4 workers
~1.6 minutes
full build ~2m38s to READY
```

Later provider runs also showed a 30-core / 60 GB Turbo class. The worker cap still stayed at four because 6 and 8 workers had already been measured and were slower on the comparable ordinary Pro class.

### Reusable rule

A provider plan is not a fixed hardware identity, and a benchmark on one class is not automatically portable to another.

Always record:

- exact deployment;
- visible CPU/memory or provider-reported machine class;
- source SHA;
- test matrix;
- worker count;
- measured wall time.

Then re-evaluate only when one of those materially changes.

## 5. Success: the paid plan became useful for the actual bottleneck, not for its headline quotas

The eventual evidence for Pro's value was concrete:

```text
before
full high-risk Vercel build ~12 min
91-test hosted UI matrix serial ~9.5-9.9 min

with Pro-aware bounded workers + other gate fixes
full high-risk build ~3 min
91-test hosted UI matrix ~1.3-1.6 min
```

The useful part of Pro in this project was therefore primarily:

- stronger build machines;
- enough CPU headroom for four stable Playwright workers;
- better tolerance for frequent Preview/Production iteration;
- concurrent build capacity when multiple branches/jobs actually overlap.

It was **not** justified by traffic volume, function usage, or data-transfer pressure at that time.

This is a better way to explain paid-plan value to a future maintainer:

```text
what bottleneck exists?
-> what provider feature changes that bottleneck?
-> what exact before/after evidence confirms it?
```

## 6. Friction: Vercel Pro, usage credit, and Speed Insights Plus were easy to misread as one price

At checkout, the visible monthly total was:

```text
Pro                     $20
Speed Insights Plus     $10
---------------------------
Total                   $30 / month
```

The same checkout also showed `$20` of included/flexible usage credit.

Those are different concepts.

The credit is for eligible metered usage. It is not evidence that the `$20` Pro subscription fee disappears.

At the time, Speed Insights usage was only about `695 / 10K` events, so there was no workload evidence that the extra `$10` Speed Insights Plus add-on was needed for this project, and it does not accelerate builds.

### Tool-boundary friction

The connected Vercel tool could confirm that the team plan was `pro`, inspect deployments/build machines/logs, and verify production behavior. It did **not** expose a reliable action for reading or changing the current Speed Insights Plus billing add-on.

Therefore the correct closeout was:

```text
Pro confirmed
build performance confirmed
Speed Insights Plus current billing state = not confirmed by connector
```

Do not infer that an add-on is canceled because it is unnecessary. Do not claim a billing mutation was performed when the connected tool does not expose it.

When billing state matters and the provider connector cannot read it, require the Billing UI or another authoritative billing surface.

## 7. Success: Cloudflare Workers Paid and Vercel Pro were compared by job-to-be-done, not sticker price

The user also considered Cloudflare Workers Paid at roughly a lower base price.

The useful comparison was not “which cloud is cheaper?” It was:

```text
Cloudflare Workers Paid
-> more runtime/backend/edge/container/AI capacity

Vercel Pro
-> faster/stronger build feedback, Preview workflow, concurrent builds, build machines
```

For a static/Astro research site whose pain was GitHub -> build -> Playwright -> Preview/Production latency, Vercel Pro addressed the actual bottleneck more directly.

If the pain had instead been API throughput, container execution, edge compute, or backend request volume, the decision could be different.

### Reusable rule

Compare plans against the workload stage they improve:

```text
source authoring
build/CI
preview/review
runtime/traffic
backend compute
observability
billing/support
```

Two plans can both say “performance” while optimizing completely different stages.

## 8. Friction: provider latency was being converted into Agent latency

After the build pipeline became faster, screenshots of the Agent execution history exposed another problem:

```text
inspect Vercel logs
-> sleep ~several minutes
-> inspect again
-> sleep again
-> calculate wait time
-> inspect again
```

This created conversational friction without changing the provider's completion time.

PR #279 (`docs(agents): stop busy-waiting on Vercel builds`) recorded a better default:

```text
1. record exact SHA + deployment ID/URL
2. do one immediate state/log sanity check
3. optionally do one short ~30-60s recheck
4. if BUILDING is healthy and progressing, stop active polling
5. continue only independent work that cannot invalidate/retrigger the deployment
6. otherwise return a resume checkpoint
7. on the next turn, query deployment state first and read only the needed tail/errors
```

A good checkpoint contains:

- exact head SHA;
- deployment ID/URL;
- current phase/state;
- last meaningful log timestamp or milestone;
- next acceptance action once terminal.

### Reusable rule

Provider latency is not productive Agent work.

A long build can be legitimate. The Agent should not spend the whole duration babysitting it unless the user explicitly requests synchronous waiting or there is an actionable near-terminal failure transition to watch.

## 9. Success: docs-only merges can be intentionally canceled by Ignore Build

After #279 merged, Vercel created a Production deployment object for the new `main` SHA, then `vercel-ignore-build.mjs` reported:

```text
No deploy-relevant changes since the previous successful deployment; skip this build.
```

Vercel marked that deployment `CANCELED` because the Ignored Build Step intentionally stopped the build.

That is not the same thing as an application failure.

### Reusable rule

Interpret provider terminal states together with the exact log reason:

```text
CANCELED by ignored-build policy for docs-only change
= expected optimization

CANCELED by newer authoritative same-branch job
= expected supersession, but verify the successor

ERROR with actionable Gate/test/runtime failure
= real failure requiring diagnosis
```

Do not report every `CANCELED` deployment as an outage.

## 10. Friction: partial logs encouraged repeated checking and premature conclusions

While a build was running, partial tails showed only the first part of the 91-test matrix or only some Lab cases. Reading those tails repeatedly did not improve correctness.

The stronger pattern is:

```text
state read
-> if ERROR: inspect the smallest actionable error tail
-> if BUILDING and healthy: checkpoint, do not rescan everything
-> if READY: inspect final acceptance evidence once
```

This reduces both tool churn and the temptation to mistake “currently green so far” for “completed successfully.”

## 11. Success: performance work was layered instead of solved by one blunt change

The final improvement was not one trick. It was a sequence of independently useful fixes:

```text
#273  remove unrelated hosted browser work by risk-aware scoping
#277  use Pro CPU headroom with bounded 4-worker Playwright
#281  fix Lab readiness race + cache only required Chromium shell + benchmark worker cap
#279  stop Agent busy-waiting on healthy provider jobs
#283  record the browser-gate/Lab lessons and current executable policy
```

Each layer addressed a different bottleneck:

- scope;
- compute parallelism;
- harness correctness;
- browser-install/cache overhead;
- human/Agent wait behavior;
- durable documentation.

This is a better pattern than repeatedly increasing machine size or deleting tests.

## 12. Stop rule: do not keep optimizing after the measured bottleneck is closed

Once the full high-risk build was around three minutes and browser correctness was stable, the remaining “focused page-only Production path” did not justify manufacturing a fake source change just to produce another benchmark.

The correct next measurement should come from the next real low-blast-radius page edit.

### Reusable rule

Do not create source churn solely to obtain a prettier performance number.

Stop when:

- the original bottleneck is materially reduced;
- safety contracts remain intact;
- the next optimization target is not yet backed by a real workload;
- further work would mostly generate provider traffic or benchmark-only code.

## 13. Better decision procedure for future hosting-plan questions

When asked “should we pay for Pro / a larger cloud plan?”, use this sequence:

```text
1. read current account/runtime usage
   -> are traffic/runtime quotas actually close to a limit?

2. inspect several representative deployment timings
   -> queue vs build vs deploy

3. inspect the build critical path
   -> which command dominates?

4. classify whether the bottleneck is configuration or hardware
   -> unnecessary test scope?
   -> serial CPU-bound tests?
   -> cold dependency/browser downloads?
   -> actual provider queueing?

5. optimize provider-independent waste first
   -> risk-aware scope, cache, deterministic preflight

6. if hardware can plausibly help, run one real provider-class benchmark
   -> exact SHA, same suite, measured wall time

7. separate base plan from optional add-ons
   -> do not confuse usage credit with subscription price

8. after upgrade, re-measure on the actual machine class
   -> do not reuse Hobby conclusions blindly

9. tune concurrency experimentally
   -> more workers are not automatically faster

10. separate provider wait from Agent wait
   -> checkpoint instead of multi-minute polling

11. interpret ignored/canceled builds by reason
   -> CANCELED is not automatically ERROR

12. record only durable evidence and stop when the bottleneck is closed
```

## 14. Evidence ledger

Key historical evidence from this work:

- PR #273 — `perf(vercel): scope Production browser gate by UI risk`
  - baseline: full Vercel build about 12m;
  - 91-test hosted matrix about 9.5-9.9m at 1 worker;
  - rejected Hobby 2-worker experiment about 12m21s overall.
- PR #277 — `perf(vercel): use Pro build CPU for hosted Playwright`
  - ordinary Pro Enhanced builder: 8 cores / 16 GB;
  - 91 tests / 4 workers: about 1.6m;
  - overall build about 2m38s to READY.
- PR #281 — `perf(vercel): stabilize Lab gate and cache hosted Chromium`
  - 6 workers: 137.8s;
  - 8 workers: 141.7s;
  - retained cap: 4 workers;
  - Lab 12/12 first-attempt PASS with zero retries;
  - later Turbo builder: 30 cores / 60 GB, still capped at 4 workers, 91 tests about 1.3m;
  - public Production HTTP 200.
- PR #279 — `docs(agents): stop busy-waiting on Vercel builds`
  - provider-wait checkpoint discipline merged to `main`;
  - its docs-only Production trigger was intentionally skipped by `vercel-ignore-build.mjs` and appeared as CANCELED.
- PR #283 — `docs(agents): record Vercel browser-gate friction and proven fixes`
  - current deployment policy brought back in sync with the measured worker/cache/readiness behavior.

Historical pricing/account snapshot at decision time:

```text
Pro base plan             $20/month
Speed Insights Plus       $10/month
checkout total            $30/month
included flexible credit  $20 for eligible metered usage
```

Historical runtime usage was far below Hobby quotas, so this pricing evidence should be read as a build-productivity decision, not a runtime-capacity emergency.

Provider plan names, prices, machine classes, and billing details can change. Re-check current Vercel first-party state before making a new purchase decision.

## 15. Where current policy lives

Use this document for rationale and failure-pattern recognition. Current instructions live in:

- `docs/agents/current/deployment-policy.md`;
- `docs/agents/current/release-closeout-protocol.md`;
- `docs/agents/current/hosting-architecture.md`;
- `docs/agents/LATEST.md` for the current provider-wait handoff;
- `scripts/vercel-ui-plan.ts`;
- `scripts/vercel-ui-gate.mjs`;
- `scripts/vercel-lab-browser-gate.mjs`;
- `scripts/vercel-ignore-build.mjs`;
- `playwright.config.ts` and the Lab Playwright config/tests.

For the browser-specific correctness/performance incident, load [`2026-08-27-vercel-browser-gate-performance-and-lab-flaky-retrospective.md`](./2026-08-27-vercel-browser-gate-performance-and-lab-flaky-retrospective.md).

The durable lesson from the plan decision is:

> **Measure the actual bottleneck before paying for capacity; after paying, re-measure on the actual provider class; and never turn provider wait time into Agent busy-work.**
