# GDR → DirectApply research-page delivery acceptance

Verified: 2026-09-07

## Scientific evidence rechecked
- GDR-v1 sealed run: 160 rounds, 20,480 formal rollouts, 44 SD-LoRA candidates, 7 accepted formal SD updates.
- R49 state-after: 28 candidates / 7 accepted; sealed final: 44 / 7, so post-R49 = 16 candidates / 0 accepts.
- Round 0: 128 / 128 rollout cases matched for task id, rollout/generation seeds, raw completions, action trajectories, reward, and invalid status; both means = 0.3364082792207789.
- R0 adapter is not bitwise-identical: task-vector norm 0.3315128741 vs 0.3307554585, ≈0.228% relative drift. Published claim: `semantic-matched`.
- DirectApply last dynamic verification: 15 / 160 rounds, 1,920 / 20,480 rollouts, GDR candidate-probe calls = 0, GDR acceptance evaluations = 0. This is an interim timestamped snapshot, not a final result.

## Exact-tree product acceptance
- `npm run verify:deploy`: PASS, including lint, negative gate self-tests, data/semantic/claims/freshness audits, 491 structural tests, 37 behavior tests, v2/adversarial/hardening, and copy strict with 0 strict invariant failures.
- `npm run build`: PASS — 480 static routes; heading and external-brand audits PASS.
- Focused Chromium regression `tests/e2e/gdr-directapply.spec.ts`: PASS — 5 / 5.
- Reader route is registered in the capability-exploration route contract and mounts the shared first-reader task/context strip in both locales.
- Viewports: 390px mobile and 1440px desktop have no page-level horizontal overflow; mobile experiment controls render as cards.
- Axe WCAG 2 A/AA: 0 violations. One `color-contrast` group remains `incomplete` because the automated tool cannot resolve several overlapped/SVG backgrounds.
- Blind comprehension: PASS — 7 / 7; see `comprehension-test-20260907.md`.

## Evidence images
- `gdr-directapply-desktop.png`
- `gdr-directapply-mobile.png`

## Scientific-semantics boundary
This change is presentation-layer only. It reads canonical receipts/archives but does not modify experiment authority, experiment outputs, Ray pools, Docker/container state, rollout accounting, or transition policy. GDR-v1 remains historical control; DirectApply remains an independent ablation; GDR-v2 remains concept/future work.
