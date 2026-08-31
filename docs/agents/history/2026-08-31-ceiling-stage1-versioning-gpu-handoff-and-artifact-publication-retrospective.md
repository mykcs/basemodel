# 2026-08-31 Ceiling Stage-1 versioning, GPU handoff, and artifact-publication retrospective

Status: **historical cross-repository case record**
Scope: OpenEVO-Ceiling-1.0 Stage-1 collection, GPU/Holder handoff, superseded H1.46 Stage-2 closeout, Stage-1 old/new scientific boundary, and BaseModel publication.
Current authority remains `docs/agents/current/*`, executable `basemodel` source/tests, current `mykcs/openevo-experiment` scientific authority, and live provider/runtime state.

## Why this retrospective exists

This conversation started as a narrow execution handoff: launch the frozen Ceiling Stage-1 trajectory collection without touching later analysis or Stage 2. It then exposed several distinct classes of friction that looked superficially similar but required different responses:

- a config/runtime decoding mismatch;
- an over-conservative universal GPU admission gate;
- a formal-run import failure before any trajectory was consumed;
- a need to stop a scientifically superseded but still historically meaningful old Stage-2 run;
- a clean reshard from two 3B workers to four without mixing partial corpora;
- Holder containers whose names implied model residency but whose implementation only allocated tensors;
- confusion between “same Stage-1 protocol” and “identical Stage-1 trajectory corpus”;
- a publication problem where “old” risked being read as “wrong” even though only the downstream Stage 2 had been superseded;
- moving-`main`, worktree, Preview, CI, and post-job cache friction during release.

The durable lesson is:

> **Separate scientific identity, stochastic realization, runtime implementation, resource ownership, artifact retention, and publication semantics. A repair in one layer must not silently rewrite the others.**
## 1. Start state: the handoff was intentionally narrow

The initial execution contract was deliberately strict:

```text
Ceiling Stage 1 trajectory collection only
-> 3B and 7B formal rollouts
-> stop
```

The run was not authorized to continue into Stage-1 analysis, OPSD, Text Memory, or Stage 2. GPU release was also transactional: Holders were to remain resident until all immutable preflight checks passed, then only the named Holders could stop, the formal run had to start immediately, and Holder restoration had to happen automatically on normal or abnormal exit.

That narrow scope prevented an execution/debugging conversation from silently turning into a scientific-design change.

### General rule

When a handoff says “collect only”, encode the stop boundary in executable scope and receipts. Do not rely on a conversational promise that later stages “probably will not start”.

A useful pre-handoff record should freeze at least:

- branch / exact execution SHA;
- config and schedule hashes;
- model revisions;
- image/runtime identity;
- GPU UUID mapping;
- forbidden downstream actions;
- Holder identities and restoration behavior.
## 2. Friction: config said `1 / 0 / 1`, runtime was actually `0.8 / 20 / 1.05`

The frozen Stage-1 config declared:

```text
temperature = 0.4
top_p = 1.0
top_k = 0
repetition_penalty = 1.0
```

But the local Transformers backend only forwarded `temperature`. Because the other decoding values were omitted, Qwen's local `generation_config.json` supplied its own defaults:

```text
top_p = 0.8
top_k = 20
repetition_penalty = 1.05
```

This was not a scientific decision to change four knobs. It was an implementation defect: the old config already expressed the intended `1 / 0 / 1`, but the runner failed to execute it.

The correct repair was narrow: explicitly forward the frozen values for Ceiling while preserving historical callers that omit them.

### Why `1 / 0 / 1` matters

It does **not** mean “use the settings that score higher”. It mostly disables three extra decoding filters/penalties so that `temperature=0.4` remains the main sampling-control knob. Scores may rise or fall; the scientific value is config/runtime agreement.
## 3. Friction: one universal GPU-free rule blocked a safe 3B shared placement

The first launcher gate effectively required a nearly empty GPU plus no other compute process. That was safe but too coarse for the actual workload. Live evidence showed an existing shared vLLM workload on the target 3B cards, while representative 3B rollout workers used only about 7 GiB each.

The owner explicitly allowed safe co-residency as long as nobody else's workload was killed and OOM risk remained controlled. The correct response was therefore **not** to remove the gate and **not** to preempt the other workload. It was to replace the universal rule with workload-qualified admission:

```text
representative same-workload VRAM measurement
+ explicit safety margin
+ projected free VRAM after Holder release
+ external-workload non-preemption
+ immediate live recheck at launch
```

For that incident, a temporary 9 GiB free-VRAM floor was justified for the exact 3B rollout path. That number is historical evidence, not a permanent “3B always needs 9 GiB” constant.

The 7B path appropriately retained a stricter admission rule.

### General rule

A conservative gate is not automatically scientifically virtuous. If it blocks a measured-safe execution pattern, refine the gate to the workload; do not bypass it or kill unfamiliar processes to satisfy it.
## 4. Friction: the first formal container failed before science because import smoke was missing

After the shared-GPU gate was relaxed, the first formal container started but exited almost immediately. The failure was not OOM and not a bad trajectory. All shards failed during Python import because the vendored `openevo-webshop/src` path was missing from `PYTHONPATH`.

The important scientific fact was that the attempt consumed **zero trajectories**. That allowed a clean engineering repair without contaminating the scientific corpus.

The correct recovery was:

```text
preserve failed run root + container evidence
-> classify as 0-consumption startup failure
-> fix import path only
-> run same-image, no-GPU import smoke while Holders remain resident
-> launch under a new immutable run identity
```

Do not overwrite the failed attempt, and do not reuse its run identity as though nothing happened.

### General rule

Before releasing scarce GPU Holders, smoke the exact runtime image through every startup boundary that can fail without GPU: imports, package paths, config parsing, output-directory writes, and launcher argument construction. “Python syntax passes” is weaker than “the formal image imports the formal runner”.
## 5. Friction: an old Stage-2 run was scientifically superseded but still historically valuable

GPU0/1 were still running the old 3B + MiniMax H1.46 Stage 2. The key question was not simply “is it old?” but “does finishing the remaining budget still answer a useful current question?”

Inspection showed that 59 complete blocks had produced **zero Stage-2 parameter updates** under the window-local method-control gate. The run was therefore still useful evidence about the failure mode of that old design, but it no longer deserved two GPUs as a current Ceiling experiment.

The right action was:

```text
preserve complete blocks + partial block + current model pointer
-> write a superseded-method-control receipt
-> stop the old run
-> keep all artifacts
-> explicitly state that no OOM or scientific corruption caused the stop
```

The classification matters:

```text
superseded as current algorithm
!= useless history
!= invalid Stage 1
!= permission to delete artifacts
```

This distinction later became central to the website story.
## 6. Friction: hot resharding would have made provenance ambiguous

Once GPU0/1 became available, the owner wanted the fresh 3B Ceiling collection to use GPU0/1/2/3 together. The already-running attempt had two 3B shards. It was technically possible to kill the two child workers and redistribute only their unfinished tails.

That would have been operationally efficient but scientifically awkward: one formal parent attempt would contain rows produced under two different worker-sharding topologies, and the parent summary would have to explain killed workers, replacement workers, and mixed attempt semantics.

The cleaner decision was to preserve the small partial attempt and start a new formal identity with one stable topology:

```text
3B: four disjoint shards × 360 positions
7B: two disjoint shards × 720 positions
```

Schedule, per-position seed derivation, model revision, prompt, parser, and decoding contract stayed fixed. Only execution sharding changed.

### General rule

Do not optimize away a few already-consumed trajectories if doing so makes the accepted corpus harder to explain. For formal science, a clean rerun identity is often cheaper than a permanently complicated provenance story.

Before resharding, prove that each accepted position is covered exactly once and that no partial attempt is silently concatenated into the new formal corpus.
## 7. Friction: Holder names looked correct while the implementation was semantically wrong

The existing Holder containers were named as if they were 3B/7B model-backed Holders. Inspection showed that they only allocated raw tensors. The container name encoded an intended role, not actual model residency.

The owner's intended invariant was stronger:

```text
GPU0-3 -> real Qwen2.5-3B model resident + additional reserved VRAM + memory-activity heartbeat
GPU4-5 -> real Qwen2.5-7B model resident + additional reserved VRAM + memory-activity heartbeat
```

The replacement Holders were prepared while the formal experiment was still running, so preparation did not steal GPU capacity. Completion recovery then had to verify more than `docker ps`:

- the expected model really loaded;
- the expected GPU UUID owned the process;
- extra VRAM was actually reserved;
- the heartbeat produced non-zero memory activity;
- all expected Holder containers were healthy after formal exit.

### General rule

A resource-ownership container is not correct because its name says `3b-holder` or because it reserves the right number of bytes. Verify the semantic resource it claims to protect.
## 8. Scientific reasoning: same Stage-1 protocol is not the same trajectory corpus

The owner then asked whether the new Ceiling Stage 1 was “completely identical” to the Stage 1 that preceded the old, later-superseded Stage 2.

The answer required separating three labels:

```text
protocol-equivalent
realization-different
runtime-corrected
```

The two Stage-1 families shared the important protocol skeleton:

- the same `180 × 8 = 1,440` task budget;
- the same semantic task schedule and schedule hash;
- the same 3B/7B model revisions;
- the same WebShop harness, prompt, admissible-action contract, parser, and fail-closed behavior;
- `temperature=0.4`;
- `max_steps=15`;
- `max_new_tokens=512`;
- base-model trajectory collection before downstream learning.

But they were not the same stochastic realization, and the old implementation had a decoding-plumbing defect.
The meaningful differences were:

| Dimension | Historical Stage 1 | Current Ceiling Stage 1 | Scientific meaning |
|---|---:|---:|---|
| generation seed base | `145000000` | `148000000` | deliberate independent stochastic replicate, not a bug fix |
| actual `top_p` | `0.8` | `1.0` | old runtime inherited model default; current runtime executes frozen config |
| actual `top_k` | `20` | `0` | same implementation correction |
| actual repetition penalty | `1.05` | `1.0` | same implementation correction |

The seed change and the decoding repair must not be collapsed into one story.

### Durable wording

Good:

> The old and current Stage 1 have the same scientific role and nearly the same protocol. The current version is a fresh independent replicate with a corrected runtime implementation; future work uses it as the authoritative version, while the old version remains valid historical evidence.

Bad:

> We changed four parameters because the old Stage 1 was wrong.

The old Stage 1 was not invalidated by the downstream Stage-2 design error.
## 9. Publication reasoning: “old” must not visually or verbally mean “wrong”

The first BaseModel update added an HTML Stage-1 old/new comparison. The important product decision was to make the **current version primary without devaluing the historical version**.

The page therefore needed to communicate, in this order:

```text
same scientific role
-> old version is still valid and reusable
-> current version made a small, explicit parameter/runtime finalization
-> future headline experiments use current version
-> downstream old Stage 2 is a separate superseded method-design issue
```

The comparison table was not allowed to stop at raw values. It added a reader-facing “what this means” column so that `145M -> 148M`, `0.8 -> 1.0`, `20 -> 0`, and `1.05 -> 1.0` were not presented as unexplained magic numbers.

This was especially important for `1 / 0 / 1`: the reader needed to learn that these values disable extra decoding restrictions rather than guarantee a higher score.

### General rule

When a version comparison is about scientific provenance, always separate:

- what stayed conceptually the same;
- what changed numerically;
- why it changed;
- whether the change is a new treatment, an independent replicate, or an implementation repair;
- which version is authoritative going forward;
- whether the older evidence remains usable.
## 10. Publication friction: a historical version needs a real artifact path, not just a label

After the comparison existed, the owner asked for the historical Stage-1 card itself to be clickable. That exposed another completeness boundary: saying “old data is still usable” is weak if the reader cannot reach the actual trajectories, analyzers, adapters, manifests, or provenance.

The historical route was therefore turned into an artifact index with pinned remote identities:

- canonical Hugging Face trajectory / MiniMax-analyzer dataset;
- canonical Hugging Face Stage-1 / bootstrap adapter repository;
- retained compatibility copy for reusable data;
- exact historical H1.45/H1.46 cold archive;
- GitHub publication closeout;
- GitHub Stage-1 old/new scientific-boundary retrospective;
- GitHub Hugging Face asset-governance evidence.

The Hugging Face links use immutable revisions instead of mutable repository heads. The page also states when an artifact is a private research asset rather than pretending that a URL is automatically anonymous-public evidence.

### General rule

For reusable historical experiments, publication is a graph:

```text
reader explanation
-> historical version entry
-> canonical artifact
-> pinned revision
-> provenance / restore evidence
-> retention boundary
```

Do not publish local server paths as the user-facing artifact story, and do not treat “uploaded once” as evidence that the cited bytes remain retrievable.
## 11. Release friction: old worktrees and moving `main` can replay already-merged history

The first Stage-1 website implementation was developed on a worktree that had also carried an earlier Stage-2 redesign. By the time the Stage-1 change was ready, that Stage-2 work had already been squash-merged to `main`.

Continuing to use the old branch as the final merge source would have made the PR appear to contain already-integrated Stage-2 history again.

The safe recovery was:

```text
identify the single Stage-1 commit
-> start from current origin/main
-> transplant only the Stage-1 delta
-> rerun acceptance on the clean candidate
```

This produced a one-commit PR whose diff matched the user's actual request.

During the later artifact-page work, `main` moved repeatedly again. Those intervening commits were docs-only and did not touch runtime/UI/test surfaces. The correct response was to classify overlap rather than automatically discard expensive browser evidence.

### General rule

`branch behind main` is a freshness signal, not an automatic instruction to redo everything. Classify intervening changes by file ownership and contract impact. Rebase or transplant to keep the PR clean; rerun the expensive evidence only when the runtime-relevant tree actually changed.
## 12. Validation friction: local harness and CI cleanup failures are not automatically product failures

Several release-time symptoms looked like page failures but belonged to the validation environment:

- a targeted Vitest invocation initially used the wrong test-group config;
- a clean worktree lacked its own `node_modules` and reused the unchanged dependency tree from the already-validated workspace;
- a local Playwright/static-server port was occupied by an old preview process;
- self-hosted CI later finished all deterministic/build/browser checks successfully but remained `pending` while `actions/setup-node` post-job cache save took much longer than the product tests.

The correct debugging pattern was to ask which phase actually owns the symptom.

```text
wrong test selector / missing local deps / occupied local port
!= source regression

all product checks green + setup-node cache-save still running
!= browser/product failure
```

The final candidate still required real acceptance: language/provenance regression, Astro check, production build, overflow checks, Chromium + WebKit matrix, exact-head Vercel Preview, PR merge, Production READY, and direct Production HTML verification.

### General rule

Do not weaken source or research semantics to repair validation infrastructure. Conversely, do not call the product accepted merely because a provider says READY; inspect the real changed route and exact head.
## 13. What BaseModel finally published

Two focused releases closed the website side of the conversation.

### PR #365 — Stage-1 old/new comparison

It established the current-first comparison and explained both values and meaning:

- current Stage 1 is primary;
- historical Stage 1 remains valid evidence;
- shared task/model/harness/temperature/length contract is explicit;
- seed-family difference is explained separately from runtime-decoding repair;
- `1 / 0 / 1` is described as disabling extra knobs rather than as a score guarantee.

### PR #370 — historical Stage-1 artifact route

It made the historical Stage-1 card clickable and added bilingual artifact pages with pinned Hugging Face and GitHub provenance links.

The accepted Production lineage for the second release was `ddcbad99e857f2f0b94a9c6dae09447d9d48a81c`.

The public route became:

```text
/research/seed-openevo/study/capability-exploration/
  -> current-vs-historical Stage 1
  -> historical Stage-1 artifact route
  -> separate historical-vs-current Stage-2 method choice
```

This keeps “version of Stage 1” and “method version of Stage 2” as different axes.
## 14. Anti-patterns to reject next time

Do **not** repeat these moves:

- trust a config file without proving the backend actually receives the declared decoding values;
- describe a deliberate independent seed as if it were a bug fix;
- use one “entire GPU must be free” gate for every model/workload after measured co-residency evidence exists;
- make room by killing an unfamiliar shared workload;
- release Holders before the formal image passes a same-image startup/import smoke;
- overwrite a zero-consumption failed run instead of preserving it under its own identity;
- hot-reshard a formal parent attempt and silently mix partial outputs into the accepted corpus;
- trust Holder container names without proving the expected model is really resident;
- say “old experiment was wrong” when only a downstream stage was superseded;
- equate protocol equivalence with byte/trajectory identity;
- show changed parameter values without explaining their experimental meaning;
- cite mutable artifact heads when an immutable HF/GitHub revision is available;
- treat an uploaded artifact as deletable-local evidence without restore verification and retention authorization;
- let an already-squash-merged feature branch become the source of a new PR that replays old history;
- throw away an expensive browser matrix solely because `main` gained proven-independent docs-only commits;
- treat post-job cache upload latency as a product-test failure;
- treat Vercel `READY` as a substitute for changed-route acceptance.

## 15. Fast decision checklist for future Agents

When a similar old/new experiment + publication problem appears, ask in this order:
1. **What scientific layer changed?** Upstream collection, downstream learning, evaluation, or only implementation plumbing?
2. **Is the old evidence invalid, superseded, or simply historical?** These are different states.
3. **Are old/new protocols equivalent?** Compare task schedule, model revision, prompt/harness, temperature, horizon, parser, and update timing.
4. **Are the realizations identical?** Compare seed family and actual consumed row identities; never infer identity from protocol similarity.
5. **Did runtime execute the config?** Trace declared parameters into the actual backend call and model defaults.
6. **Is a resource gate workload-qualified?** Use measured same-workload footprint plus safety margin and live recheck.
7. **Can startup fail before science?** Smoke imports, package paths, writes, arguments, and runtime image before Holder release.
8. **Will a reshard/recovery complicate accepted provenance?** Prefer a new formal identity when the clean story is cheaper than mixed lineage.
9. **Does the Holder protect the semantic resource it claims?** Verify model residency, extra reservation, activity, and UUID ownership.
10. **Can readers reach the historical artifact?** Publish canonical pinned links plus provenance, not only a “historical” badge.
11. **Does the page explain why a number changed?** Values alone are not a scientific comparison.
12. **Did `main` move?** Classify overlap before rebasing, rerunning, or discarding expensive evidence.
13. **Which validation phase actually failed?** Source, browser, provider, runner, or post-job cleanup?
14. **Is Production the accepted exact lineage?** Verify merge SHA, provider metadata, and the real route.

## 16. Search cues for this case

Future Agents should find this retrospective when the task mentions any of:

`Ceiling Stage 1`, `previous Stage 1 replicate`, `historical Stage 1`, `145000000`, `148000000`, `top_p 0.8`, `top_k 20`, `repetition_penalty 1.05`, `protocol-equivalent`, `realization-different`, `runtime-corrected`, `model-backed Holder`, `GPU co-residency`, `superseded Stage 2`, `historical artifact`, `pinned Hugging Face revision`, or `old version still usable`.
## 17. Related authority and historical evidence

Read current policy before this historical case:

- [`../current/experiment-result-publication-workflow.md`](../current/experiment-result-publication-workflow.md) — cross-repository result intake and publication owner;
- [`../current/scientific-state-provenance.md`](../current/scientific-state-provenance.md) — scientific-state ownership and freshness;
- [`../current/scenario-trigger-registry.md`](../current/scenario-trigger-registry.md) — just-in-time routing;
- [`../current/deployment-policy.md`](../current/deployment-policy.md) and [`../current/release-closeout-protocol.md`](../current/release-closeout-protocol.md) — exact-head Preview/merge/Production boundaries.

Useful neighboring historical cases:

- [`2026-08-30-openevo-capability-exploration-series-retrospective.md`](2026-08-30-openevo-capability-exploration-series-retrospective.md) — earlier capability-exploration page/scaffold work;
- [`2026-08-31-7b-webshop-score-table-and-live-final-freshness-retrospective.md`](2026-08-31-7b-webshop-score-table-and-live-final-freshness-retrospective.md) — stale result/publication boundaries;
- [`2026-08-31-ci-pr-stability-and-moving-head-retrospective.md`](2026-08-31-ci-pr-stability-and-moving-head-retrospective.md) — moving heads and CI-layer classification.

Experiment-side durable evidence remains in `mykcs/openevo-experiment`; BaseModel must not become a second source of truth for live execution state. In particular, the pinned [`CASE-CEILING1-END-TO-END-SCIENCE-ENGINEERING-RETROSPECTIVE-20260831.md`](https://github.com/mykcs/openevo-experiment/blob/8a0e983487310d736b40fa0dbca88f8a65255c79/docs/troubleshooting/experiment-ops/CASE-CEILING1-END-TO-END-SCIENCE-ENGINEERING-RETROSPECTIVE-20260831.md) owns the execution details behind the `protocol-equivalent / realization-different / runtime-corrected` distinction and the GPU/Holder lessons summarized here.

The purpose of this document is not to freeze 2026-08-31 runtime state forever. It is to preserve the reasoning pattern that prevents future Agents from turning one repaired layer into a false scientific rewrite of another.
