# Delta/β R200 webpage analysis

Status: **ACTIVE · stacked on BaseModel Design System PR #806**
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

- [ ] mirror the sealed R200 extension summary into a public BaseModel evidence artifact without server-local paths or secrets;
- [ ] compute the R120/R160/R200 trajectory windows from immutable round receipts;
- [ ] reuse existing 160-round diagnostics where identities match;
- [ ] add new R160–R199 diagnostics from sealed evidence;
- [ ] keep final-panel and external-teacher counts explicit;
- [ ] pin upstream Git evidence used by the page.

## Website changes

- [ ] update `OpenEvoEffectiveStateGdrLoraStudy.astro`;
- [ ] extend its route-specific Reader Contract only where the R200 result changes the first-screen promise / next question;
- [ ] update the experiment navigation summary if its current boundary still stops at R160;
- [ ] keep figures beside the metric they explain;
- [ ] add regression coverage for the R200 endpoint and claim boundaries;
- [ ] preserve the existing mathematical explanation and 160-round sealed result instead of rewriting history.

## Acceptance

- [ ] zero-context reader sees why R200 exists before deep diagnostics;
- [ ] `next_round=200` and `25,600` total rollouts are represented correctly;
- [ ] R199 PASS is represented correctly;
- [ ] final-panel access = 0 and external-teacher calls = 0;
- [ ] no claim that dynamic α+β was run;
- [ ] no claim that R120/R160/R200 is the optimal stopping point without validation evidence;
- [ ] no causal claim from β, Task Vector, norm/spectrum, path length, or entropy alone;
- [ ] no server-private path or credential leaks;
- [ ] focused deterministic tests pass;
- [ ] 390 / 768 / 1440, light/dark browser acceptance passes for the target route;
- [ ] exact-head Public PR CI passes;
- [ ] final exact-head Vercel gate is requested only after the candidate is ready.

## Stacking boundary

This PR is based on the open Design System PR #806 because #806 currently changes the same canonical component and tests. Until #806 merges, keep this PR stacked on `design/basemodel-design-system-v1-20260928` so the R200 diff stays isolated. After #806 lands, retarget/rebase this PR to `main` and re-run acceptance.
