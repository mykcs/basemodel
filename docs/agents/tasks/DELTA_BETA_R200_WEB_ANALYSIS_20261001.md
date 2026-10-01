# Delta/β R200 webpage analysis

Status: **IMPLEMENTED · rebased onto main · hosted acceptance lives on PR #810**
Date: **2026-10-01**
Target route owner: `src/components/research/OpenEvoEffectiveStateGdrLoraStudy.astro`

## Goal

Extend the canonical **Bounded Online Recurrence + β-gating（α=1）** study from its sealed 160-round analysis through the completed R160–R199 continuation, without creating a second competing story.

The reader should be able to answer:

1. Why was the trajectory extended from 160 to 200 rounds?
2. Did the extra 40 rounds support a simple “R120/R160 is already saturated” story?
3. What happened to task score after R160?
4. Do loss, β, Task Vector direction, parameter norm/spectrum, output length / episode steps, and action entropy explain the trajectory?
5. What remains correlation / post-hoc diagnosis rather than causal evidence?
6. What does the completed extension change — and what does it **not** change — about the original 160-round conclusion?

## Scientific identity to preserve

- Method name on the completed run: **Bounded Online Recurrence + β-gating（α=1）**.
- Do not rename it as a completed dynamic α+β experiment.
- The R200 continuation adds **40 rounds × 128 = 5,120** formal WebShop rollouts after the sealed R159 boundary.
- Historical R0–R159 is not rerun.
- Final-panel access remains **0**.
- External-teacher calls remain **0**.
- The extension ends at `next_round=200`, `rollouts_consumed=25,600`, with R199 sealed PASS.
- Completion-First carrier handling is a control-plane recovery rule; it does not change β/GDR semantics, data, sampling, update frequency, or replay budget.
- No post-hoc diagnostic may be upgraded into a causal mechanism claim.

Upstream scientific authority remains `mykcs/openevo-experiment`; BaseModel is only a reader-facing projection.

## Narrative

### First screen

Lead with the question, not with implementation history:

> 160 轮之后，继续训练还有没有新的东西？

Then give the minimal answer supported by the full R200 trajectory. Do not imply that lower training loss alone proves convergence or that a noisy training-score curve selects one exact stopping round.

### Analysis order

Follow the existing research-result reading contract:

1. **Task trajectory / saturation question**
   - compare the behavior around R120, R160, and the new R200 endpoint;
   - distinguish noisy train-round Task Score from a validation/final estimate;
   - do not call one round “optimal” post hoc.

2. **Loss**
   - what it measures;
   - what changed through the late trajectory;
   - whether loss and WebShop Task Score move together.

3. **β**
   - β is the frozen learned write-control signal, not WebShop reward;
   - show the late-round β trajectory / distribution;
   - test whether the prior score decline is explained by a trivial β collapse.

4. **Task Vector / direction**
   - compare rising, high-window, decline, and post-R160 continuation phases;
   - separate update-direction change from update-magnitude change;
   - do not treat direction geometry as causal proof.

5. **Parameter norm / spectrum / rank**
   - report only measured diagnostics;
   - preserve the boundary that posterior geometry does not prove a smaller state is task-equivalent.

6. **Behavior**
   - output length;
   - episode steps / task-path length;
   - action-family entropy;
   - state explicitly if these diagnostics rule out simple explanations but still do not identify the cause.

7. **Synthesis**
   - supported findings;
   - explanations ruled out;
   - unresolved mechanism;
   - next experiment that would actually distinguish stopping/convergence or causal mechanism hypotheses.

## Evidence work

Before public copy:

- [x] mirror the sealed R200 extension summary into a public BaseModel evidence artifact without server-local paths or secrets;
- [x] compute the R120/R160/R200 trajectory windows from immutable round receipts;
- [x] reuse existing 160-round diagnostics where identities match;
- [x] add new R160–R199 diagnostics from sealed evidence;
- [x] keep final-panel and external-teacher counts explicit;
- [x] pin upstream Git evidence used by the page.

## Website changes

- [x] update `OpenEvoEffectiveStateGdrLoraStudy.astro`;
- [x] extend its route-specific Reader Contract only where the R200 result changes the first-screen promise / next question;
- [x] update the experiment navigation summary if its current boundary still stops at R160;
- [x] keep figures beside the metric they explain;
- [x] add regression coverage for the R200 endpoint and claim boundaries;
- [x] preserve the existing mathematical explanation and 160-round sealed result instead of rewriting history.

## Acceptance

- [x] zero-context reader sees why R200 exists before deep diagnostics;
- [x] `next_round=200` and `25,600` total rollouts are represented correctly;
- [x] R199 PASS is represented correctly;
- [x] final-panel access = 0 and external-teacher calls = 0;
- [x] no claim that dynamic α+β was run;
- [x] no claim that R120/R160/R200 is the optimal stopping point without validation evidence;
- [x] no causal claim from β, Task Vector, norm/spectrum, path length, or entropy alone;
- [x] no server-private path or credential leaks;
- [x] focused deterministic tests pass;
- [x] 390 / 768 / 1440, light/dark browser acceptance passes for the target route;
- Provider acceptance: exact-head Public PR CI is live state owned by PR #810, not duplicated as a permanent checkbox here;
- Provider acceptance: the final exact-head Vercel gate and merge/Production verification are live release state owned by PR #810.

## Integration boundary

The work was initially stacked on Design System PR #806 because both lines touched the canonical component. Before release, the four R200 commits were independently rebased onto current `main`, and the only real conflicts were resolved in the canonical page, experiment navigation, and Reader Contract. No #806-only Design System files are part of this PR.

Local acceptance after the main rebase: focused Vitest **43 / 43 PASS**; Astro **0 errors / 0 warnings** with two pre-existing deprecation hints; Reader Contract audit **68 / 68**; target-route Chromium **22 / 22 PASS**; full `verify:deploy` PASS with structural **806 / 806** and behavior **37 / 37** tests.
