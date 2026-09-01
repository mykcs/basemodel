# OpenEVO 2.0 Harness 重设计与实验谱系发布复盘 — 2026-08-31

Status: **historical case / reusable Agent friction record, not current scientific authority**

Conversation scope: 这一轮从“3B 当前 Stage 2 为什么没有成功轨迹、是不是只能靠 Memory / Skill / Agent 学”开始，继续比较旧错误 Stage 2 与当前 Ceiling-1.0 的 3B/7B 行为，重新追溯 OpenEVO carrier 的官方来源与 WebShop bridge 边界，收敛出 **OpenEVO 2.0** 的 Harness 设计方向，最后在 BaseModel 中增加新的实验谱系分支与双语子页，并完成 PR #379 的本地、浏览器、Vercel 与 self-hosted CI 验收。

Primary current owners:

- `../current/project-agent-operating-principles.md`
- `../current/product-and-research-integrity.md`
- `../current/scientific-state-provenance.md`
- `../current/experiment-result-publication-workflow.md`
- `../current/seed-openevo-research-mission-first-principles.md`
- `../current/research-site-presentation-contract.md`
- `../current/website-design-spec.md`
- `../current/deployment-policy.md`
- executable/live scientific authority in `mykcs/openevo-experiment`

If this file disagrees with current user instruction, live experiment state, executable repository truth, current policy, or current GitHub/Vercel state, **this file loses**. All run counts, PR states, SHAs and CI phases below are conversation-time provenance only.

## Executive summary

The apparent problem was “3B Stage 2 has no successful trajectories.” The deeper problem turned out to be a harness-design question: the current WebShop bridge injected Text Memory, Skill Bundle and Agent System too literally and too redundantly, while the smaller Qwen2.5-3B model was much less able than 7B to recover from conflicting or stale UI guidance.
The conversation produced three durable conclusions:

1. **Do not diagnose a weak-model failure from score alone.** Compare the same task/schedule prefix, separate parser-format errors from state-inadmissible actions, and use the stronger model as a natural control when possible.
2. **OpenEVO’s multi-target idea and our WebShop runtime bridge are different layers.** SD-LoRA is closest to a literal upstream primitive; Text Memory, Skill and Agent System have upstream method-family roots, but the concrete “inject three Markdown artifacts into every Qwen step” behavior is a downstream Ceiling adaptation.
3. **The successor should be a scientific amendment, not a silent hotfix.** Preserve the existing Ceiling lineage and artifacts; create OpenEVO 2.0 from the same corrected Stage-1 evidence root; make the new harness contract explicit, prequalified and auditable.

The first OpenEVO 2.0 scope was intentionally limited to four high-value changes:

```text
Context Governor
+ real Memory / Skill / Agent responsibility separation
+ Telemetry v2
+ Preformal Harness Qualification
```

The more ambitious typed Strategy IR was deliberately deferred. Action-grounded decoding and per-model optimized harnesses remain useful diagnostics/secondary ceilings, not part of the first matched headline protocol.

## Conversation arc

### 1. The first question was whether 3B had any successful Stage-2 trajectory

The live investigation found that the current 3B Ceiling Stage 2 had produced no exact/clean success over a substantial prefix and therefore no SD-LoRA parameter update. At one observed boundary it had sealed 13 rounds / 1,664 rollouts with zero exact success and roughly 37.6% action-invalid termination.

This was not enough by itself to conclude “3B is too weak” or “Stage 2 is broken.” The next step was to compare the same model under earlier Stage1/Stage2 conditions and the same schedule positions.
### 2. Matched-prefix comparison showed a real interface regression signal

The most informative 3B comparison used the same Stage-2 schedule prefix rather than unrelated aggregate totals. In the conversation-time matched 1,280-position slice:

- the historical 3B Stage 2 had 7 exact successes, 6 clean/qualified successes, and about 10.2% invalid-action termination;
- the current Ceiling 3B had 0 exact success and about 37.6% invalid-action termination;
- the current corrected Stage1 3B at temperature 0.4 had also produced some exact success and only about 11.7% invalid-action termination.

That made “3B is simply incapable of WebShop” an inadequate explanation. Something about the new Stage-2 entry state, sampling or prompt/interface stack was making behavior materially worse.

### 3. Parser code was not the main culprit

The old and current Stage2 paths used the same v3 action parser, the same bounded repair idea, and the same requirement that the parsed action be admissible in the current page state.

Most new 3B invalid episodes were not malformed tags. The dominant pattern was:

```text
syntactically valid command
+ plausible WebShop action
+ action absent from the current page
= state-inadmissible termination
```

Examples included attempting `Next >` or `Back to Search` when that action was not actually offered by the live page.

This exposed an observability defect too: the old telemetry collapsed malformed output and state-inadmissible action into the same coarse `parser_failure` bucket. That delayed diagnosis and later became a core reason for Telemetry v2.
### 4. 7B became the natural control

The user explicitly asked not to diagnose 3B in isolation because 7B had also run an older, scientifically flawed Stage2. That was the right move.

The important pattern was not one exact historical aggregate but the direction across aligned prefixes:

- old 7B Stage2 had an action-invalid rate close to its Stage1 baseline;
- new Ceiling 7B entered Stage2 with a much worse invalid-action rate and a lower early Task Score;
- round 0 already showed the regression before many later Stage2 parameter updates could be blamed;
- later 7B rounds gradually recovered toward historical action-validity levels and continued to produce clean successes and real SD-LoRA updates.

This changed the interpretation from “3B-specific engineering breakage” to a stronger hypothesis:

> The new multi-carrier Stage2 start state hurts both scales, but 7B is strong enough to bootstrap through the bad initialization while 3B can get trapped before its first clean-success-driven parameter update.

That is a possible **scale-dependent bootstrap cliff**, not the old fake `gate=8` failure.

### 5. Concrete carrier wording provided a mechanism hypothesis

Inspection of live prompts and invalid actions showed repeated historical guidance around `Next >`, `Back to Search`, pagination and search resets. The key lesson was subtle: invalid commands were not necessarily copied verbatim from a carrier artifact. The carrier could mention a UI concept in natural language and still bias the model into generating a currently unavailable command.

Therefore a literal string scrub such as “delete exact `click[next >]`” was too weak. The real design problem was that long-term experience was allowed to compete with current environment truth at the wrong abstraction level.
## What was actually “official OpenEVO” and what was our bridge

One major source of confusion was the temptation to say either “the carrier design is official, so we must not touch it” or “the carrier design is ours, so upstream is irrelevant.” Both are too coarse.

The conversation-time source audit established this boundary:

| Layer | Relationship to OpenEVO upstream | Ceiling/WebShop-specific part |
|---|---|---|
| SD-LoRA / parametric memory | closest to pinned upstream native primitive | WebShop schedule, success grouping and update contract |
| Text Memory | upstream textual-memory / MemEvolve-style method family exists | our teacher-pool consolidation and current WebShop rendering policy |
| Skill Bundle | upstream skill/evolution target exists | `webshop_qwen_skill_bridge_v1`; not a literal upstream WebShop loader |
| Agent System | upstream agent-system evolution family exists | our WebShop/Qwen system-message bridge and composition policy |
| “carrier” as one shared label | useful project abstraction | not a claim that upstream exposes one identical four-carrier WebShop recipe |

An especially useful historical clue was that an earlier Ceiling design had Skill disabled because the WebShop harness did not yet have a qualified native skill-consumption path. It was enabled only after a downstream bridge was created.

So the right conclusion is:

> OpenEVO provides the evolution-target ideas; Ceiling-1.0 chose a specific downstream way to make those artifacts runtime-effective in WebShop. That bridge is legitimate research code, but it is not protected from redesign by the phrase “official OpenEVO.”

This distinction gives future Agents permission to improve the harness while preserving scientific honesty: name the amendment, keep the old lineage, and do not rewrite a downstream adaptation as an upstream default.
## OpenEVO 2.0 design that emerged from the conversation

The governing idea became:

> **Minimal guidance, explicit authority, contextual memory.**

Or in the more operational form used during the discussion:

> **Thin harness, hard boundaries. Harness organizes information and enforces interface truth; the model still reasons and chooses.**

This was motivated by a broader concern from the user: as foundation models improve, overly prescriptive harnesses can become constraints rather than aids. At the same time, Qwen2.5-3B may still need more scaffolding than much stronger contemporary models. The design therefore should not assume “less harness is always better”; it should minimize unnecessary instruction while preserving clear environment and safety boundaries.

### Context Governor — included in 2.0

The current harness only bounded the base WebShop prompt, while carrier text could be appended afterward. OpenEVO 2.0 should instead own one total context budget with explicit priority:

```text
current task / observation / Allowed Actions
> recent history
> compact Agent policy
> relevant Skills
> relevant Memory
```

Environment truth is never sacrificed to preserve historical experience. The first implementation should use fixed auditable budgets rather than online reward-based token tuning.

### Real carrier responsibility separation — included in 2.0

The desired contract is:

```text
Memory = reusable knowledge / observations
Skill  = conditional strategy for a class of situations
Agent  = global policy, priority and conflict arbitration
```

The harness should lint obvious responsibility collapse, task-specific literal leakage and excessive carrier overlap instead of trusting free-form Markdown to stay abstract by prompt instruction alone.
### Telemetry v2 — included in 2.0

The old mixed `parser_failure` category hid the true failure mode. At minimum, action execution should separately record:

```text
format_valid
semantic_command_valid
state_admissible
environment_accepted
repair_used
```

A future Agent should be able to answer “is the model formatting badly, inventing unavailable actions, or being rejected by the environment?” from one aggregate report without manually rereading hundreds of trajectories.

### Preformal Harness Qualification — included in 2.0

Before spending the formal 20,480-rollout Stage2 budget, the harness should run on a non-final qualification set and prove that the interface itself has not regressed materially.

Qualification is **not** a score-selection contest. Its purpose is interface health:

- action-format rate;
- state-admissible rate;
- carrier-token share;
- literal leakage;
- carrier overlap;
- runtime readback and environment truth preservation.

If adding carriers turns a historically ordinary invalid-action rate into a dramatic interface regression, formal task consumption should fail closed before round 0.

### Deferred / diagnostic-only ideas

The conversation intentionally did **not** put everything into the first 2.0 mainline:

- typed Strategy IR / DSL: architecturally attractive, but too expensive for the immediate GPU/time budget;
- constrained action decoding: useful as an `action-grounded upper bound`, but changes the interface and should not silently become the headline OpenEVO score;
- per-model optimized carrier budget/temperature: useful for a later “best 3B” and “best 7B” ceiling, but not the first matched 3B-vs-7B protocol;
- changing temperature together with the carrier bridge: avoided initially because changing two variables at once would destroy attribution.
## Scientific amendment and lineage rules

A major reasoning correction in the conversation was realizing that “this looks like a bad harness” does not automatically authorize rewriting the formal run after seeing results.

The safe pattern is:

```text
observe anomaly
-> diagnose on already-consumed or separate non-final data
-> preserve current lineage and immutable evidence
-> freeze a successor contract before new formal consumption
-> start successor from a declared fork boundary
```

For the 3B discussion, that meant:

- do not delete or rewrite the zero-success Ceiling prefix;
- do not silently lower temperature, relax parser rules or add retries because 3B looked bad;
- if the carrier-consumption contract changes, name it as a scientific amendment/successor;
- reuse the same corrected Stage1 evidence only when the upstream experiment authority says that reuse is scientifically valid;
- if final 3B-vs-7B comparability is claimed under 2.0, both models ultimately need the same 2.0 contract, even if the existing 7B Ceiling lineage is still useful and allowed to finish.

The conversation also preserved the distinction between two legitimate future questions:

```text
Matched Harness:
  same 2.0 contract for 3B and 7B
  -> clean model-scale comparison

Per-model Best Harness:
  each model receives its own tuned context/retrieval/sampling
  -> each model's own practical ceiling
```

Do not mix these into one headline result.
## Website information architecture that followed from the science

The website problem was not “add one more card.” The experiment had become a lineage tree.

The correct public model was:

```text
current corrected Stage 1 evidence root
            |
            +--> historical 256-window Stage 2
            |      superseded method-control lineage
            |
            +--> OpenEVO-Ceiling-1.0
            |      current running lineage / harness risk under review
            |
            +--> OpenEVO 2.0
                   successor under design
```

The important fork is **not** a fake claim that Stage1 trajectory collection must be rerun. The page explains that the current corrected Stage1 remains the shared root, and the meaningful divergence begins around Stage1 analysis/state construction and the downstream Stage2 harness/state design.

The selector therefore became a three-generation experiment-lineage chooser rather than a flat list of unrelated pages.

The OpenEVO 2.0 page was designed to show:

- why another redesign is being considered;
- which Stage1 evidence is expected to remain reusable;
- the four first-version Harness 2.0 changes;
- what has **not** happened yet;
- the migration/stop boundary for Ceiling-1.0;
- explicit slots for stop-time accepted/partial counts, successes, parameter updates, checkpoints and published artifacts once a real stop occurs.
## Publication truth boundary

A critical implementation rule was: **do not let the website announce an experiment state before the experiment authority has actually reached it.**

During implementation, Ceiling-1.0 was still running. Therefore the first OpenEVO 2.0 page explicitly said:

- Ceiling-1.0 is still running;
- a harness risk has been observed and is under review;
- OpenEVO 2.0 is designing / not formally launched;
- no premature “Ceiling-1.0 paused” sentence is allowed.

The page uses a dated publication snapshot rather than pretending the website is runtime authority. When a real stop happens later, a new snapshot can fill the prepared stop/artifact fields without rewriting history.

This is the reusable publication pattern for a moving scientific program:

```text
immutable historical lineage
+ time-bounded live snapshot
+ explicit successor state
+ no future-tense fact promoted to present tense
```

## Engineering friction and recovery patterns

### Friction 1 — the first implementation was stacked on an overlapping copy PR

The OpenEVO 2.0 work initially sat on top of PR #375 because #375 had better first-reader wording for many of the same OpenEvo surfaces. This was useful for development, but it would have produced a polluted PR containing both tasks.

The clean recovery was:

```text
finish and validate the feature delta
-> inspect latest main
-> transplant only OpenEVO 2.0 changes to a fresh main-based worktree
-> resolve semantic overlaps against current main
-> rerun exact-tree acceptance
```

The final PR #379 therefore remained a focused OpenEVO 2.0 lineage change rather than carrying all of #375.
### Friction 2 — semantic conflicts must be resolved by meaning, not `ours/theirs`

When the clean branch was rebuilt on latest `main`, the conflicts were not random code collisions. They represented two useful but different changes:

- newer first-reader wording from the OpenEvo copy work;
- newer table/archive/runtime snapshot changes already on main.

The correct resolution was to preserve the more complete reader explanation while absorbing current-main facts and shared UI ownership. Whole-file winner-takes-all merging would have regressed one side.

**Reusable rule:** classify each conflicting hunk by semantic owner: scientific fact, reader explanation, shared visual primitive, current status snapshot, or test contract.

### Friction 3 — stale tests can be wrong even when they are green on an older branch

Two language tests still required older exact phrases such as a previous Stage1 label and an older 7-vs-8 sentence. Current main already expressed the same scientific meaning in clearer language.

The right fix was **not** to regress the page to satisfy exact-string tests. The tests were updated to protect the current semantic contract:

- 8 is a distinct-task threshold, not a score;
- Stage1 is the first real learning phase;
- old Stage2 is continued self-exploration under a historical update rule;
- attempts, successful traces, task identities and parameter updates remain different quantities.

A separate MiniMax audit-link test had the same kind of drift: the page said “MiniMax 的能力、Token 与 API 成本” while the test still expected an older phrase.

**Reusable rule:** tests should freeze meaning and user-critical wording, not force the product back to stale author phrasing.

### Friction 4 — a clean worktree had no dependencies

The isolated feature worktree had no `node_modules`, so targeted Vitest initially could not run. That was a local validation-environment issue, not source failure.

The temporary recovery reused the locked dependency tree through a symlink, ran the required checks, then removed the symlink before commit. The final Git tree remained clean.
### Friction 5 — default shell assumptions caused a harmless but real release failure

One PR-creation command used Bash heredoc syntax while Desktop Commander had started `fish`. The command failed before mutating repository state.

The recovery was simply to rerun the release command explicitly under `/bin/bash`.

**Reusable rule:** if a command depends on `set -euo pipefail`, `VAR=value`, Bash heredocs, compound loops or Bash quoting, request Bash explicitly instead of assuming the remote default shell.

### Friction 6 — shared-route navigation tests needed to understand the whole subtree

Adding `/capability-exploration/openevo-2-0/` exposed a navigation regression test that treated only the capability landing page as belonging to the capability-exploration section.

The correct product rule is broader: the entire capability-exploration subtree owns the same research navigation context. The regression test was updated accordingly and a dedicated OpenEVO 2.0 browser test was added.

### Friction 7 — do not confuse local success, hosted Preview and exact-tree acceptance

The final feature branch passed several distinct layers:

```text
focused semantic tests
-> Astro check
-> repository verify:deploy
-> production build
-> OpenEVO 2.0 dedicated browser matrix
-> full global UI preflight
-> Vercel Preview
-> GitHub self-hosted CI
```

These layers answer different questions. The final local exact tree built 460 pages; the OpenEVO 2.0 focused browser suite passed 16/16 across Chinese/English, 390/768/1440 widths, light/dark and Chromium/WebKit; the full UI matrix passed 204/204.

### Friction 8 — GitHub `IN_PROGRESS` did not mean Playwright was stuck

After PR #379 had already passed Vercel, GitHub still showed the self-hosted CI check as `IN_PROGRESS`. A shallow status read made it look as if browser acceptance might be hanging.
A deeper job-step read showed the actual state:

- deterministic verification: success;
- production build: success;
- risk-based browser acceptance: success;
- current step: `Post Setup Node 24`;
- runner process: `actions/setup-node` cache-save cleanup.

The self-hosted runner container was healthy, and the browser process was already gone. The delay belonged to post-job cache persistence, not product acceptance.

**Reusable rule:** when a self-hosted CI job stays green-looking but `IN_PROGRESS`, inspect the job steps and runner process tree before declaring a browser hang. `all product checks green + setup-node cache-save running != product failure`.

### Friction 9 — website work must not accidentally become experiment execution

This conversation moved back and forth between live scientific diagnosis and BaseModel publication. It would have been easy to let a website task kill or reshape the running 3B/7B experiment.

The implementation deliberately did not:

- stop the 7B scientific lineage;
- prematurely stop 3B just because the website was ready for a successor page;
- change temperature or carrier runtime while writing BaseModel;
- publish final stop counts before the experiment actually stopped.

**Reusable rule:** BaseModel may explain and route scientific lineage, but experiment mutations belong to the current `openevo-experiment` authority and its execution safeguards.

## What worked well

### Matched-prefix evidence beat intuition

The strongest scientific progress came from comparing old/new runs on aligned schedule positions rather than arguing from global averages or model reputation. This converted “maybe 3B is weak” into a concrete interface-regression hypothesis.

### 7B provided a natural scale control

Looking at 7B prevented premature overfitting to the 3B symptom. The observation that 7B also degraded at Stage2 entry but later recovered motivated the bootstrap-cliff interpretation and a more defensible 2.0 design.

### Source attribution prevented false conservatism

Tracing which parts were literal upstream primitives versus downstream WebShop bridges made it possible to improve the harness without pretending either “upstream is wrong” or “we are forbidden to change anything.”
### The page model followed the scientific model

Instead of adding another isolated route, the site now teaches the experiment as a shared Stage1 root with historical/current/successor branches. That means the reader can understand why OpenEVO 2.0 exists before reading implementation detail.

### Prepared stop slots prevent retrospective cherry-picking

The OpenEVO 2.0 transition data model reserves places for stop time, accepted/partial counts, success trajectories, parameter updates, checkpoints and artifact links before the eventual stop is published. This reduces the temptation to invent the publication structure after seeing which numbers look good.

### Dedicated browser protection matched the new information architecture

The new route received explicit end-to-end coverage for:

- Chinese and English routes;
- lineage selector visibility;
- “not yet paused” truth boundary;
- mobile/tablet/desktop overflow;
- light/dark themes;
- Chromium/WebKit;
- progressive disclosure for future stop artifacts.

## Anti-patterns to avoid

Do not repeat these mistakes:

- infer that a weak model is the sole cause before comparing the same task/schedule prefix;
- call every invalid action a parser failure;
- treat a syntactically valid but unavailable action as a formatting problem;
- assume more carrier text is automatically more helpful for a smaller model;
- inject Memory, Skill and Agent as three full free-form documents without explicit responsibility, budget or conflict rules;
- make long-term memory authoritative over the current environment’s Allowed Actions;
- claim the current downstream WebShop bridge is “official OpenEVO” merely because its artifacts come from OpenEVO method families;
- change carrier rendering, temperature, parser repair and success gates all at once after seeing a bad result;
- overwrite a contaminated/informative lineage instead of preserving it and starting an explicit successor;
- write “paused” on the website before the scientific run actually reaches a stop boundary;
- use a website snapshot as execution authority;
- keep a stacked feature branch merely because the stacked copy is convenient;
- resolve semantic conflicts with whole-file `ours/theirs` selection;
- force new public wording back to an outdated exact-string test;
- interpret self-hosted CI `IN_PROGRESS` as browser failure without reading step-level state.
## Trigger guide for future Agents

Load this retrospective after current policy when any of these observable situations appears:

1. a new OpenEVO/WebShop run has much worse action validity than an older matched run;
2. 3B and 7B react differently to the same multi-carrier harness;
3. a carrier mentions actions/UI concepts that may not exist in the live environment state;
4. a new scientific successor needs to reuse Stage1 evidence without rewriting the old lineage;
5. the BaseModel site must show “old design -> current run -> successor under design” without fabricating a stop;
6. a self-hosted CI job stays `IN_PROGRESS` after browser work appears complete.

## Smallest reliable procedure

### For a harness regression

1. Refresh live scientific authority; never trust a website snapshot or old chat recap as current truth.
2. Compare matched task/schedule positions before comparing whole-run totals.
3. Split `format_valid`, command semantics and `state_admissible`; inspect representative raw outputs.
4. Compare a stronger model under the same harness to test for scale-dependent recovery.
5. Trace each carrier to its generation source and runtime injection path; distinguish upstream primitive from downstream bridge.
6. If a runtime contract change is justified, preregister the successor and preserve the current lineage rather than patching it in place.
7. Use non-final qualification data to test interface health before formal task consumption.

### For the website lineage

1. Resolve which Stage1 evidence is genuinely shared from the current experiment authority.
2. Draw the experiment as a lineage/fork before writing prose.
3. Keep historical, running and designing states visually and semantically distinct.
4. Use dated snapshots for running counts; never write future stop facts in present tense.
5. Reserve stop/artifact fields before final closeout.
6. Update bilingual routes, sitemap/navigation ownership and semantic regression tests together.
7. Run dedicated changed-route browser checks plus the repository-required exact-tree gate.

### For lingering self-hosted CI

1. Read `gh pr view` check rollup.
2. Read the exact Actions job steps through the GitHub API.
3. If product/browser steps are complete, inspect the runner process tree before treating the job as stuck.
4. Distinguish Playwright execution, post-action cache save and runner cleanup.
5. Do not modify product source to “fix” a post-job cache delay.
## Historical publication / CI provenance

The BaseModel feature work was prepared on a clean branch from current `main`:

- feature branch: `research/openevo-2-0-main-20260831`;
- feature PR: **#379 — `research: add OpenEVO 2.0 experiment lineage`**;
- conversation-time feature head: `925a756c92163f6e443439273f687374b8715bb8`;
- PR state at this closeout: OPEN and MERGEABLE.

Acceptance recorded during this conversation:

- repository `verify:deploy`: PASS;
- Astro production build: PASS, 460 pages;
- OpenEVO 2.0 focused browser matrix: 16/16 PASS;
- full exact-tree UI preflight: 204/204 PASS;
- Vercel status: SUCCESS;
- Vercel Preview Comments: SUCCESS;
- self-hosted CI: COMPLETED / SUCCESS.

The self-hosted job is a useful diagnostic case because its step history proved the browser work was not the final delay:

```text
Deterministic verification       PASS
Build static production artifact PASS
Risk-based browser acceptance    PASS
Post Setup Node 24 cache-save    delayed briefly, then PASS
Complete runner/job              PASS
```

Do not promote this PR/head/status to current authority after the date of this record; refresh GitHub and the experiment repository.

## Final lesson

The most reusable outcome of the conversation is not one prompt rewrite. It is the separation of responsibilities:

> **OpenEVO may evolve knowledge, skills, agent policy and parameters; the harness must decide how much of that experience is relevant now, while the live environment remains the sole authority on what actions actually exist.**

For stronger models, this keeps the harness from becoming an unnecessary cage. For smaller models, it provides scaffolding without drowning the actor in repeated historical instructions. For researchers, explicit lineage and qualification make the resulting comparison auditable rather than post-hoc.