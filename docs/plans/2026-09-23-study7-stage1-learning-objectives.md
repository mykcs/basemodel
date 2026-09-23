# Experiment 07 — Stage1 learning-objective ablation

## Goal

Add a seventh experiment to the OpenEVO × WebShop Study index that separates:

- Stage1 bootstrap: learn one initial parameter set from fixed experience.
- Stage2 continual evolution: use SD-LoRA / DirectApply / Bounded / GDR to keep updating parameters over rounds.

## Page question

Under the same Qwen3-1.7B starting point and Stage1 experience, which learning rule should create the Stage2 starting model?

Primary arms:

1. OPSD — current formal Stage1 bootstrap.
2. SFT — same action-step data / rank8 / optimizer-step budget, completion CE.
3. SEED-style hindsight-skill SFT — prepared follow-up; MiniMax labels, not claimed as an exact paper reproduction.

## Current sealed evidence

- OPSD development panel: 36.01 / 100, exact 0 / 32.
- SFT 1-pass final: 34.96 / 100, exact 3 / 32.
- SFT validation checkpoints: 44.72 @ 4096, 42.74 @ 8192, 32.01 @ 10240, 34.96 final.
- Final panel remains locked.
- SFT 3-epoch and SEED-style SFT are explicitly shown as unsealed.

## Files

- [x] Add experiment 07 navigation record.
- [x] Add canonical route owner.
- [x] Add reader-role declaration.
- [x] Add dedicated Stage1 learning-objectives page.
- [x] Update Study and Home copy from six to seven experiments.
- [x] Run lint/build/reader-navigation checks.
- [x] Open PR.
- [ ] Verify hosted CI / Vercel preview.

## Claim boundary

This page does not claim an overall SFT-vs-OPSD winner yet. The current 32-task development comparison is inconclusive on mean score, while exact success differs. Ongoing arms remain labeled as ongoing / prepared until sealed.
