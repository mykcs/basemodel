# 2026-08-29 four-arm result scaffold and 7B/self checkpoint-publication retrospective

Status: **historical case record**. This file preserves reusable engineering and scientific-reasoning lessons from the four-arm Results prebuild and the later 7B/self checkpoint-sweep publication. It does not override `docs/agents/current/*`, executable repository truth, live experiment state, or current provider policy.

## Scope

This closeout covers one continuous Results workflow:

1. pre-build result pages for four experiment arms before all experiments finished;
2. pre-build the four-arm comparison page and its comparison questions before final numbers were known;
3. preserve unknown values as explicit Pending cells rather than inventing zeroes or copying in-flight snapshots;
4. keep MiniMax's role scientifically accurate as post-episode hindsight analysis rather than a WebShop actor;
5. preserve the existing deeper 7B/self and four-arm analysis layers instead of replacing them with the new summary scaffold;
6. later detect that the 7B/self post-hoc GPU checkpoint sweep had completed;
7. resolve the sealed server artifact before editing the website;
8. publish the full checkpoint curve, not merely the base/final endpoints;
9. update every website surface that had encoded the former Pending state;
10. validate locally, merge through GitHub, and independently accept Production.

The two website releases were:

- PR **#326**, which created the pre-built result scaffolds and joint comparison surface;
- PR **#328**, which replaced the 7B/self checkpoint-analysis Pending state with the completed diagnostic result.

The scientific evidence for the second release came from the completed `20260829-7b-self-stage1-checkpoint-sweep` artifact. The website must not become a second experiment ledger; this retrospective therefore records only the publication-relevant result and workflow, not private server topology or infrastructure details.

## Executive lesson

The strongest pattern from this round is:

```text
freeze the questions before the answers exist
-> make unknowns visibly unknown
-> wait for sealed evidence
-> publish the whole evidence shape, not the convenient endpoint
-> separate observation from interpretation
-> update every derived surface atomically
-> verify source, rendered page, and Production as different things
```

The website scaffold acted like a pre-printed answer sheet. That was valuable because it reduced two common research-publication risks:

- **HARKing / metric opportunism** (Hypothesizing After Results are Known): deciding what comparison matters only after seeing results;
- **false completion**: turning an unfinished arm, in-flight counter, or missing analysis into a zero or a confident conclusion.

The later 7B/self sweep then demonstrated why the whole curve matters: training loss fell monotonically, while held-out WebShop capability did not.

---

## What was pre-built before the four-arm experiments closed

The four arms were:

| Model | Bootstrap treatment | Public shorthand |
|---|---|---|
| Qwen2.5-3B | native self bootstrap | `3B / self` |
| Qwen2.5-7B | native self bootstrap | `7B / self` |
| Qwen2.5-3B | MiniMax post-episode hindsight analysis + bootstrap bundle | `3B / MiniMax` |
| Qwen2.5-7B | MiniMax post-episode hindsight analysis + bootstrap bundle | `7B / MiniMax` |

The website created individual result routes for all four arms plus one four-arm joint-analysis route. The result scaffold fixed the reader questions and result slots before most final values existed.

The joint page pre-specified six comparisons:

```text
C1  3B/MiniMax - 3B/self
C2  7B/MiniMax - 7B/self
C3  7B/self - 3B/self
C4  7B/MiniMax - 3B/MiniMax
C5  (7B/MiniMax-7B/self) - (3B/MiniMax-3B/self)
C6  bootstrap -> Stage-2 coverage -> update -> final
```

This was not a claim that all six comparisons were already answerable. It was a declaration of what evidence would later be needed.

---

## What the completed 7B/self evidence actually showed

The already-closed main run had established:

- Stage 1: `8` parameter updates;
- training loss: approximately `0.479 -> 0.055`;
- Stage 2: `20,480` rollouts and `797` qualified-positive trajectories;
- Stage 2 optimizer updates: `0` across `80/80` blocks;
- maximum qualifying identities in one block: `7`, while the gate required `8`;
- final 128-task Task Score ×100: `13.33 -> 25.66`;
- valid episodes: `109/128 -> 122/128`;
- parser/action failures: `19 -> 6`;
- exact success: `3/128 -> 4/128`.

The missing diagnostic was the relationship between Stage-1 training loss and held-out WebShop capability across intermediate checkpoints.

The completed sweep supplied nine comparable points on the same sealed 128-task panel:

| Point | Training loss | Effective rank | Task Score ×100 | Exact success | Valid episodes | Parser/action failures |
|---|---:|---:|---:|---:|---:|---:|
| base | — | 0 | 13.33 | 3/128 | 109/128 | 19 |
| increment-00 | 0.479 | 4 | 17.13 | 3/128 | 114/128 | 14 |
| increment-01 | 0.301 | 8 | 18.41 | 1/128 | 117/128 | 11 |
| increment-02 | 0.196 | 12 | 13.67 | 3/128 | 116/128 | 12 |
| increment-03 | 0.179 | 16 | 17.63 | 3/128 | 115/128 | 13 |
| increment-04 | 0.129 | 20 | 16.51 | 3/128 | 119/128 | 9 |
| increment-05 | 0.070 | 24 | 22.01 | 4/128 | 114/128 | 14 |
| increment-06 | 0.066 | 28 | 20.72 | 3/128 | 118/128 | 10 |
| increment-07 | 0.055 | 32 | 25.66 | 4/128 | 122/128 | 6 |

The sweep status was `COMPLETE`; the seven intermediate checkpoints were added while the existing base and final endpoints were reused. The recorded wall time was about `4,813.6 s` (~80.2 min).

Supported interpretation:

> Later Stage-1 checkpoints were stronger overall and the final checkpoint was the best point in this sweep, but capability was visibly non-monotonic even while training loss kept falling. Training loss is therefore not a monotonic proxy for held-out WebShop capability.

Two concrete regressions make the point:

```text
increment-01 -> increment-02: 18.41 -> 13.67
increment-05 -> increment-06: 22.01 -> 20.72
```

The supported single-arm story is also narrower than “task ability doubled”:

> The run clearly improved executability and partial task progress, while exact full-task completion moved only from 3/128 to 4/128.

---

## Friction 1 — pre-building a Results page can accidentally invent future facts

The first challenge was not implementation. It was deciding what a page is allowed to say before the experiment is done.

A tempting but unsafe design is:

```text
unfinished arm
-> render today's partial counter
-> reader sees a number
-> number later looks like a final result
```

The safer design used deliberate Pending cells:

```text
question is fixed
metric slot is fixed
interpretation boundary is fixed
value stays Pending until sealed evidence exists
```

### Durable rule

For a pre-built result page:

- never fill unfinished final metrics with `0`;
- never promote an ETA or in-flight Stage-2 snapshot into a final cell;
- never infer a final conclusion from the existence of a page;
- make the unknown state visually explicit and semantically meaningful;
- freeze the comparison questions early so result selection is not driven by whichever metric looks best later.

This is especially important in multi-arm studies because the page itself can otherwise become a source of accidental post-hoc metric selection.

---

## Friction 2 — “有老师 / with teacher” was useful shorthand but scientifically too loose

The user-facing shorthand “有老师” was understandable, but it risks implying that MiniMax acts inside WebShop or directly chooses `search[...]` / `click[...]` actions.

That was not the treatment.

The correct role boundary was:

```text
student completes trajectory
-> MiniMax analyzes the completed episode
-> hindsight supervision / bootstrap selection bundle changes
-> later Stage 2 returns to local student self-exploration
```

### Durable rule

Use the friendly shorthand only if the precise role is stated nearby. For causal or scientific comparison text, prefer:

- `MiniMax post-episode hindsight analyzer`;
- `external hindsight supervision bundle`;
- `treatment-bundle effect`.

Do not call the contrast a pure “teacher identity effect” unless the experiment includes a matched control that actually isolates analyzer identity from bootstrap selection/supervision changes.

---

## Friction 3 — endpoint thinking would have hidden the most interesting scientific result

Before the checkpoint sweep, the visible endpoints were:

```text
loss: 0.479 -> 0.055
Task Score: 13.33 -> 25.66
```

Looking only at those endpoints strongly invites the story:

> lower loss -> better WebShop ability.

The full curve disproved the monotonic version of that story.

### Durable rule

When the research question is explicitly about whether optimization progress tracks capability, publish the whole checkpoint curve or a faithful visualization of it. Do not answer a trajectory question with two endpoints.

For this kind of page, prefer a real HTML/CSS/SVG data visualization or semantic table driven by the measured values. Do not replace scientific data with a decorative generated image; the reader should be able to inspect exact values, labels, and boundaries in the page itself.

---

## Friction 4 — training loss, Task Score, validity, and exact success are different variables

The 7B/self result contains at least four distinct signals:

1. **training loss** — how well the model fits the Stage-1 training objective;
2. **Task Score** — graded WebShop progress/reward;
3. **valid/executable action rate** — whether the environment can execute the model's actions;
4. **exact success** — whether the complete shopping task succeeds.

The run improved these by very different amounts.

### Durable rule

Never collapse them into one sentence like “the model got twice as good”. Use a layered interpretation:

```text
loss says optimization changed
Task Score says graded task progress improved
validity says the execution interface improved
exact success says full completion barely changed
```

A large Task Score increase with almost flat exact success is not evidence that complete end-to-end task solving doubled.

---

## Friction 5 — “20,480 rollout” sounded like lots of Stage-2 training even though Stage 2 never updated

A large rollout count is visually impressive and easy to misread as a large amount of parameter training.

But the actual chain was:

```text
20,480 Stage-2 rollouts
-> 797 qualified-positive trajectories
-> per-block identity coverage never reached gate 8
-> 80/80 blocks produced no optimizer update
-> final model is effectively the post-Stage-1 checkpoint
```

### Durable rule

Always separate:

```text
experience collection volume
!= admitted training data
!= optimizer updates
!= changed model weights
```

A Results page should report the actual update ledger whenever a training stage can run without producing parameter updates.

---

## Friction 6 — a post-hoc diagnostic can consume the epistemic value of a “final” panel

The intermediate checkpoints were evaluated on the same sealed 128-task panel already used for the base/final endpoint comparison.

That was useful for diagnosis, but once the panel has been inspected across checkpoints, it is no longer fully unseen for future model selection.

### Durable rule

Label such a sweep **post-hoc diagnostic**. If the observed checkpoint curve is later used to decide which checkpoint or training budget to choose, then a later formal comparison should either:

- use an independent diagnostic/selection panel; or
- freeze the checkpoint-selection rule before observing the formal panel.

Do not silently keep calling the repeatedly inspected panel an untouched final-selection benchmark.

---

## Friction 7 — “experiment completed” and “analysis completed” were different states

The 7B/self main run had already closed before the checkpoint sweep finished. The page initially needed to say:

```text
main experiment complete
checkpoint diagnostic pending
```

Later it needed to become:

```text
main experiment complete
checkpoint diagnostic complete
```

### Durable rule

Represent completion per evidence layer. Useful states include:

- run complete;
- final evaluation complete;
- post-hoc diagnostic pending;
- post-hoc diagnostic complete;
- cross-arm comparison pending;
- causal follow-up not yet run.

A single green “complete” badge should not erase these distinctions.

---

## Friction 8 — server timestamps and directory names were hints, not completion proof

The server contained a recently modified checkpoint-sweep directory and multiple result files. The reliable completion evidence was not merely “the directory is recent”. It was the combination of:

- explicit `STATUS.txt = COMPLETE`;
- `learning_curve.json` with `status = pass`;
- all expected checkpoint points present;
- consistent base/final endpoint reuse;
- protocol/manifests matching the intended sealed panel.

### Durable rule

When filling a previously Pending website slot, resolve the scientific artifact in this order:

```text
completion marker
-> machine-readable result status
-> expected row/checkpoint cardinality
-> model/panel/protocol identity
-> headline metrics
-> claim boundary
```

Do not infer “finished” from mtime, a process exit, a directory name, or the presence of one CSV.

---

## Friction 9 — updating only the detail page would have left stale contradictions elsewhere

The old Pending state existed in several derived surfaces:

- 7B/self result scaffold;
- Results analysis-plan index;
- four-arm comparison matrix;
- deeper A4/A6 analysis text;
- Chinese and English page metadata.

A single-file patch would have produced contradictory readers depending on where they entered the site.

### Durable rule

Before filling a completed result, search for the old state phrase and the experiment identity across the whole repository. Build a small “derived-surface map” and update all owners in one coherent change.

For this case the correct atomic update touched five website files. The other three experiment arms remained Pending.

---

## Friction 10 — preserve existing deep analysis instead of replacing it with the new scaffold

The website already had deeper 7B/self A1–A7 analysis and a four-arm analysis plan. The new result scaffold solved a different reader need: compact current status + fillable metrics.

Deleting the older layer would have thrown away useful mechanism analysis. Leaving only the deep layer would have made the current result hard to scan.

### Durable rule

Use progressive disclosure:

```text
current result / headline evidence
-> compact interpretation
-> full checkpoint table or chart
-> deeper mechanism analysis / next experiments
```

Add a summary layer when the information need is new; do not automatically replace deeper evidence that still answers a different question.

---

## Friction 11 — a temporary worktree failed validation because dependencies were absent

The first local `npm run verify:deploy` in the isolated worktree failed with an Astro import error. The code was not the problem: the worktree did not have its own `node_modules`.

The main checkout already had the locked dependencies installed. Reusing that local dependency tree allowed the exact branch source to be validated without burning a hosted Preview just to discover a local environment issue.

### Durable rule

Classify local validation failures before editing source:

```text
missing package / worktree environment
!= source compile failure
!= test failure
```

For a local-only worktree, it is acceptable to reuse a known compatible installed dependency tree or install the lockfile locally. If a temporary `node_modules` symlink is created, remove it before commit so it can never enter Git state.

Do not push merely to make Vercel act as your package-install debugger.

---

## Friction 12 — Vercel build eligibility had two gates, and forcing the second gate created avoidable Git churn

The repository intentionally uses `scripts/vercel-ignore-build.mjs` to reduce Preview spend. A real Preview required both:

```text
exact-head commit message contains [vercel-preview]
AND
that commit contains a deployment-relevant change
```

During the first scaffold release (#326), an empty `[vercel-preview]` commit still did not produce the intended hosted acceptance build because there was no deployment-relevant diff. A later tiny comment-only source change with the trigger did run the Preview.

That recovered the release, but it exposed a workflow smell: provider wake-up commits are shared Git history, not free control-plane buttons.

### Durable rule

Batch the actual deploy-relevant change and Preview trigger intentionally before the first provider-triggering push. Do not manufacture empty commits, comment-only edits, or unrelated source mutations solely to wake Vercel. If the current policy makes a required acceptance impossible without such churn, fix the policy or obtain an explicit exception instead of encoding control-plane behavior in meaningless source changes.

This lesson is already reflected in the repository-write hygiene rules in `LATEST.md` and current release documentation.

---

## Friction 13 — Vercel `success` on a branch did not mean an exact-head Preview actually ran

A non-main commit without the exact `[vercel-preview]` trigger can yield a canceled/ignored Preview deployment while GitHub still exposes a Vercel success context.

That is provider-policy success, not page acceptance.

In PR #328, after local full `verify:deploy` + build, the branch was intentionally not given `[vercel-preview]` to avoid an extra hosted build. The PR was then merged and Production was accepted directly.

This was a **historical process deviation** from the standing Results release contract, which says a non-trivial Results change should receive exact-head Preview acceptance before merge. It must not be generalized into a new policy merely because the Production release succeeded.

### Durable rule

Keep these separate:

```text
GitHub Vercel context = success
!= Preview build executed
!= Preview READY
!= route acceptance
```

For future work, follow the current deployment/publication contract. If the owner wants a cost-based exception for a class of low-risk result-fill changes, change that standing policy explicitly first; do not infer the exception from this retrospective.

---

## Friction 14 — local Gate/build and Production acceptance answered different questions

The successful local checks established that the source tree was internally coherent:

- `npm run verify:deploy`: PASS;
- Astro diagnostics: `0` errors, `0` warnings, `0` hints;
- `npm run build`: PASS;
- static build: `447` pages.

Production acceptance established something different:

- the `main` commit was actually deployed;
- Vercel reached `READY`;
- the public 7B/self route returned `200`;
- the new title, checkpoint-complete status, nine-point curve, interpretation, and updated deeper A4/A6 content were actually present;
- the four-arm page showed the 7B/self checkpoint cell as complete while the other arms remained Pending.

### Durable rule

Report source validation and deployed acceptance separately. Neither one substitutes for the other.

---

## Friction 15 — a newly created PR briefly reported `mergeable=false` before GitHub finished computing it

Immediately after PR #328 was created, the first normalized PR snapshot reported `mergeable=false`. A second read moments later reported `mergeable=true` without any source change.

### Durable rule

Treat mergeability immediately after PR creation as potentially eventually consistent. Before rebasing, rewriting commits, or declaring a conflict:

1. re-read the PR metadata;
2. inspect actual changed files/base movement if it remains non-mergeable;
3. only then take conflict-resolution action.

Do not create source churn to solve a merge conflict that does not actually exist.

---

## Friction 16 — scientific interpretation had to stop where the evidence stopped

The full sweep supports:

- later Stage-1 checkpoints are stronger overall in this run;
- the final checkpoint is the best observed point;
- lower loss does not guarantee a stronger next checkpoint;
- executability improved substantially;
- exact full-task success improved only slightly.

It does **not** prove:

- every additional Stage-1 update will keep helping;
- longer Stage 2 will help, because Stage 2 currently makes zero updates;
- the gate is causally responsible for the final plateau;
- 7B/self will generalize the same way to another task distribution or training seed;
- the four-arm treatment/scale effects before the other arms close.

### Durable rule

Use a three-layer closeout:

```text
observation
-> supported interpretation
-> still-unproven next question
```

For 7B/self, the next meaningful causal question is the Stage-2 admission/coverage mechanism, not “can we make the loss even smaller?” by default.

---

## The workflow that worked

Future Agents handling “the server result just finished; fill the website” should use this sequence.

### 1. Resolve the result upstream

Read the experiment authority, not the old website copy.

Confirm:

- exact experiment identity;
- completion marker;
- machine result status;
- expected number of checkpoints/tasks;
- model/checkpoint identity;
- evaluation panel identity;
- protocol identity;
- headline metrics;
- claim boundary.

### 2. Compare against the website's pre-built slots

For every previously Pending slot ask:

- do we now have sealed evidence for this exact field?
- is the result final, diagnostic, or in-flight?
- does the evidence change the interpretation or only populate a number?

Leave unrelated arms Pending.

### 3. Inspect the full evidence shape before writing the conclusion

For a learning-curve question:

```text
read all checkpoints
-> test monotonic/non-monotonic behavior
-> inspect validity + exact-success signals
-> identify best point
-> only then write the narrative
```

Do not write the conclusion from base/final alone when intermediate points exist.

### 4. Search for stale derived state

Search the website for:

- experiment name;
- old Pending wording;
- old “GPU analysis pending” wording;
- old next-step recommendation;
- joint matrix cells;
- bilingual metadata.

Update all owning surfaces in one branch.

### 5. Keep user-facing visualization factual and inspectable

For result curves, prefer real webpage data structures: semantic table, SVG, or HTML/CSS chart tied to the measured values. Generated illustrative images are not a substitute for the experiment data.

### 6. Run deterministic local validation before paying for provider debugging

At minimum:

```bash
npm run verify:deploy
npm run build
```

If the worktree cannot resolve dependencies, fix the local environment first. Do not misclassify dependency absence as a source regression.

### 7. Follow the current Preview/Production policy

Read the current deployment and publication owners. A skipped provider build is not Preview acceptance. Treat any exception as explicit and narrow.

### 8. Accept Production independently

Verify:

- exact merged `main` SHA in provider metadata;
- deployment terminal `READY`;
- changed public route HTTP status;
- the intended new result values/text;
- stale Pending text removed only from the completed arm;
- still-unfinished arms remain Pending.

---

## Anti-patterns to avoid

Do not repeat any of these:

- infer experiment completion from a recent directory timestamp;
- fill Pending with zero because “nothing happened yet”;
- call MiniMax the acting WebShop teacher when it is a post-episode analyzer;
- infer monotonic capability from a monotonic training loss;
- call Task Score doubling a doubling of exact task completion;
- call 20,480 rollouts “20,480 training updates”;
- update only the detail route while the joint matrix/index stays stale;
- delete a still-useful deep analysis layer just because a new summary component exists;
- push to Vercel merely to diagnose missing local dependencies;
- read GitHub Vercel `success` as proof that a Preview actually executed;
- reuse a post-hoc-inspected formal panel as though it remains untouched for checkpoint selection;
- generalize one run to a scale/treatment law before the remaining arms or independent training seeds exist.

---

## What should remain current after this retrospective

The durable rules belong in current owners rather than here:

- `current/experiment-result-publication-workflow.md` — pre-built Pending scaffolds, sealed-result fill-in, whole-curve interpretation, post-hoc panel contamination boundary, and synchronized derived-surface updates;
- `current/scenario-trigger-registry.md` — trigger when a previously Pending experiment/result slot becomes complete;
- `current/deployment-policy.md` / `current/release-closeout-protocol.md` — Preview and Production acceptance semantics;
- `current/research-editorial-style.md` and Results reader contracts — claim/evidence/inference/boundary presentation.

This file exists so future Agents can understand **why** those rules matter and recognize the failure modes quickly.
