# Gated-Delta D1 final website sync — 2026-09-14

## Authority

- Scientific authority: `mykcs/openevo-experiment` PR #461 at `67ff77c291fd94212aa931575d41c3ccf0748892`.
- Final interpretation: `docs/science/webshop/GATED_DELTA_SD_LORA_D1_FINAL_QUALIFICATION_20260914.md`.
- Machine evidence: `docs/evidence/gated-delta-d1-20260914/` in the scientific repository.
- Website base: `mykcs/basemodel` main at `63cd6e069f3be930eb2a942eefea0a635b3c5e3b`.

## Published scientific boundary

The preregistered four-round paired qualification is complete: 512 frozen-schedule WebShop rollouts per arm. Pooled mean reward is `0.7050621` for Vanilla and `0.7406980` for Gated-Delta (`+0.0356359`). Exact success is `173/512` versus `248/512` (`+75`, `+14.65` percentage points). The preregistered matched-cluster bootstrap has 95% intervals `[+0.01677,+0.05475]` for reward delta and `[+0.08398,+0.21289]` for exact-success-rate delta.

The website therefore states only the bounded qualification claim: on this exact frozen D1 successor schedule, Gated-Delta outperformed the matched Vanilla DirectApply control. It does not claim universal superiority, generalization to other beta/g settings or treatment scopes, final-panel improvement, a single-submechanism causal effect, or equalized post-treatment training compute.

Task Vector remains retrospective/offline label, diagnostic, and post-hoc evaluation only. Runtime does not read Task Vector, reward/score, fixed-probe outcomes, or final-panel information. Frozen `g=0`, beta policy, final-layer-only treatment scope, schedule, and sealed Q17 lineage are unchanged.

## Website changes

- Replaced the stale 2/4 interim publication snapshot with the sealed 4/4 D1 snapshot.
- Added Round 2, Round 3, pooled, and matched-cluster-bootstrap results.
- Updated Chinese/English hero copy, reader contracts, and route purpose to the final bounded claim.
- Linked the final qualification note, paired seal, and paired-results evidence.
- Updated structural and browser regression expectations without changing the historical GDR-v1 / DirectApply page.

## Acceptance

- `npm run verify:deploy` — PASS.
- `npm run build` — PASS, 510 static routes.
- `npm run ui:overflow-preflight` — PASS at 390, 768, and 1440 px checks.
- Focused Playwright: Gated-Delta publication + reader contracts + CJK containment — 30/30 PASS across Chromium and WebKit.
- Production-source stale-copy scan for the previous 2/4 snapshot and old scientific SHA — zero matches.
- `git diff --check` — PASS.
