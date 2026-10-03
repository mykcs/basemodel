# Post-advisor A/B final results → BaseModel publication handoff

Status: **CURRENT · IMPLEMENT NOW**
Date: 2026-09-28
Source authority: `mykcs/openevo-experiment#597`

## 0. Why this exists

The post-advisor WebShop experiment window is scientifically closed. BaseModel still contains stale pre-result copy such as “SEED-style not trained” and “rank32 pending”. This document is the durable handoff for updating the website without turning development evidence into a final-panel claim.

The reader-facing story should be understandable without the upstream experiment chat:

1. We first asked whether the OpenEVO ceiling is mainly a **learning-signal problem**.
2. We then asked whether Bounded needs a **rank128 persistent state**, or whether that capacity is over-provisioned.
3. The two answers point in different directions:
   - Stage1 SEED-style supervision learned its supervised objective but did **not** improve held-out WebShop capability.
   - rank32 kept most matched continuation behavior with about one quarter of the rank128 adapter payload, but is not proven strictly lossless/non-inferior.

Do not merge those into a single “winner” story.

## 1. Scientific authority and claim boundaries

Upstream authority:
- PR: https://github.com/mykcs/openevo-experiment/pull/597
- authority: `docs/science/webshop/program/POST_ADVISOR_SEED_RANK32_8GPU_WINDOW_AUTHORITY_20260928.md`
- final summary: `docs/evidence/post-advisor-ab-20260928/FINAL_SCIENTIFIC_SUMMARY.json`

BaseModel local evidence mirror:
- `public/research/seed-openevo/evidence/post-advisor-ab-final-20260928.json`

### A · SEED-style Qwen3-1.7B

Required wording boundary:

> SEED-style Qwen3-1.7B under frozen OpenEVO Stage1 trajectories and historical MiniMax analyses; Stage1 episode-skill SFT only; not an exact SEED-paper reproduction.

Do not write:
- “SEED fails”;
- “SEED is worse than SFT/OPSD” unless the panel and estimator are actually matched;
- “Stage2 self-evolving OPD/RL was tested”.

What was actually tested:
- 3 epochs, 486 optimizer steps, LR 5e-6, global batch 8;
- train loss 2.713 → 0.830;
- SFT validation loss 1.161 → 1.091 → 1.093;
- fixed 64-task outcome-blind WebShop primary-validation panel.

Primary-validation result:

| State | Mean Task Score | Exact | Positive reward |
| --- | ---: | ---: | ---: |
| initial | 0.0368862 | 0 / 64 | 6 / 64 |
| epoch1 / step162 | 0.0352431 | 0 / 64 | 3 / 64 |
| epoch2 / step324 | 0.0000000 | 0 / 64 | 0 / 64 |
| epoch3 / step486 | 0.0000000 | 0 / 64 | 0 / 64 |

Paired mean-score differences versus initial:
- epoch1: -0.0016431, 95% CI [-0.0516927, 0.0523438];
- epoch2: -0.0368862, 95% CI [-0.0738281, -0.0091518];
- epoch3: -0.0368862, 95% CI [-0.0734375, -0.0089286].

Reader-facing ELI5:

> 模型越来越会完成监督训练目标，但没有因此更会做 WebShop。第一轮基本没变，继续训练后反而更差。这个结果否定的是“只换成这套 Stage1 hindsight-skill SFT 就能解决 capability ceiling”的简单解释，不是否定完整 SEED Stage2。

### B · Bounded rank32 capacity screen

Matched continuation:
- common fork: sealed R151-after;
- prospective rounds: R152–R159;
- 1,024 paired rollout attempts;
- historical rank128 was not rerun.

Result:

| | rank128 | rank32 |
| --- | ---: | ---: |
| Mean Task Score | 0.6297622 | 0.6118560 |
| Exact success | 341 / 1024 | 350 / 1024 |
| Adapter payload | 205,551,528 B | 51,410,296 B |

rank32 - rank128:
- mean Task Score: -0.0179062;
- paired 95% CI: [-0.0368120, 0.0011840];
- exact-success-rate difference: +0.0087891;
- exact-rate 95% CI: [-0.0136719, 0.03125];
- payload ratio: 0.250109.

Reader-facing ELI5:

> 把“长期记忆盒子”从 rank128 缩到 rank32 后，盒子只有原来的约四分之一大，但大部分行为还在。平均 Task Score 有小幅下降迹象，所以不能说完全无损；但这已经说明 rank128 很可能偏大，下一步应该先扫 rank16/32/64/128，而不是直接加复杂 alpha/beta，也不能因为 rank95≈8 就跳到“rank8 足够”。

## 2. Pages that must change

### `stage1-learning-objectives`

Owner component:
`src/components/research/OpenEvoStage1LearningObjectives.astro`

Required:
- remove “SFT 3-epoch running / SEED-style not trained” copy;
- keep the older 32-task SFT-vs-OPSD evidence as historical development evidence;
- add the completed ordinary-SFT budget result;
- add the completed SEED-style 64-task primary-validation result;
- clearly separate the 32-task and 64-task panels;
- state that Stage1 SEED-style did not improve held-out capability under this contract;
- state that full SEED Stage2 was not tested;
- final panel remains locked.

### `sd-lora-bounded-state`

Owner component:
`src/components/research/OpenEvoSdLoraBoundedRecurrence.astro`

Required:
- preserve the old rank128 recurrence result;
- append the new rank32 capacity fork as a follow-up result, not a rewrite of the old experiment;
- show ~4× smaller adapter payload;
- show matched R152–R159 Task Score and exact-success results;
- explicitly say “not proven lossless / non-inferior”;
- next step is a rank-capacity sweep before more complex alpha/beta;
- do not claim rank8 suffices.

### Study navigation

Owner:
`src/data/openEvoExperimentNavigation.ts`

Required:
- Experiment 07 becomes `completed`;
- replace stale “SEED-style not sealed” result boundary;
- keep Stage1 and Stage2 scientifically separate;
- update the Bounded next question to reflect that rank32 is now measured, not hypothetical.

### Reader contract

Owner:
`src/data/siteReaderContracts.ts`

Required:
- remove stale “SFT 3-epoch and SEED-style unsealed” language;
- first viewport must show the closed Stage1 learning-signal result without implying a cross-panel winner;
- bounded-state reader contract must preserve the new capacity result and its non-inferiority boundary.

### Progress briefing

Owner:
`src/components/research/SeedOpenEvoProgressBriefing.astro`

Required:
- replace the “A/B in progress / resource paused” final slide;
- show that both post-advisor questions are now answered;
- A: supervised objective improves while task capability does not;
- B: rank32 is ~4× smaller and keeps most matched behavior, but is not proven lossless;
- next research split:
  1. learning / credit assignment → full SEED Stage2 or another mechanism that actually changes task capability;
  2. state capacity → rank16/32/64/128 sweep before alpha/beta.

## 3. Reader-design rules

Keep the BaseModel low-attention style:

First viewport should answer:
- 为什么做；
- 做了什么；
- 最基本结果；
- 这个结果能不能支持原假设；
- 下一步是什么。

Avoid:
- large raw receipt/hash walls above the fold;
- mixing optimization loss and WebShop capability as if they were the same metric;
- calling development evidence “final”;
- “SEED failed” shorthand;
- “rank32 equals rank128” shorthand;
- “rank8 is enough” shorthand.

Detailed hashes belong in expandable evidence or the local evidence JSON.

## 4. Acceptance criteria

The PR is ready when:

- [ ] Stage1 page no longer says SEED-style is untrained.
- [ ] Stage1 page shows Initial / Epoch1 / Epoch2 / Epoch3 64-task results.
- [ ] Stage1 copy separates loss improvement from task-capability decline.
- [ ] Stage1 copy says full SEED Stage2 was not tested.
- [ ] Bounded page shows rank128 vs rank32 matched R152–R159 evidence.
- [ ] Bounded page shows the ~0.25 payload ratio.
- [ ] Bounded page preserves the “not proven lossless/non-inferior” boundary.
- [ ] Navigation marks Experiment 07 completed.
- [ ] Progress briefing no longer says the A/B experiment is pending.
- [ ] Reader contracts no longer preserve stale unsealed wording.
- [ ] final-panel access remains described as 0.
- [ ] new teacher calls remain described as 0.
- [ ] no cross-panel SFT/OPSD/SEED winner is fabricated.
- [ ] existing research-result-reading and reader-attention tests are updated rather than weakened.
- [ ] site build / relevant tests pass before merge.

## 5. Next research message to preserve

The current evidence narrows the research program:

> The main unresolved capability problem is not “train Stage1 SFT longer.” The next learning question is whether a stronger credit-assignment / self-evolving mechanism such as the untested SEED Stage2 can actually convert experience into better WebShop decisions. Separately, the state-capacity problem is now concrete: rank32 is promising but not proven equivalent, so sweep capacity before adding richer write-control mechanisms.
