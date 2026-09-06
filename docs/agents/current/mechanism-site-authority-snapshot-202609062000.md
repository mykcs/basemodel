# Mechanism-1.0 website authority snapshot — 202609062000

> **Historical publication snapshot, not current execution authority.** The date and values below describe this refresh only, despite the legacy `current/` location. Later phase releases can supersede these states. Resolve current science from the [Mechanism machine-router projection](https://github.com/mykcs/openevo-experiment/blob/main/docs/science/webshop/program/OPEN_EVO_MECHANISM_1.0_CURRENT.md); this document grants no authority and is not a runtime monitor.

This website refresh publishes execution status only. It does not publish M1-D scientific results.

## Scientific authority

- Program design origin: `mykcs/openevo-experiment` PR #319 / `8d2f2024c8b70f633f9824ce2e01272582bbdc0b`.
- Authority snapshot recorded for this refresh: `mykcs/openevo-experiment@b4cdf8ecc5d442f984402f517a6d5b6b5e5e3bc9`.
- M1-D Stage1 release recorded for this refresh: `configs/experiment/activations/openevo-mechanism1-m1d-stage1-execution-release-202609062029.json`.
- M1-D MiniMax binding: `configs/experiment/designs/openevo-mechanism1-m1d-minimax-posthoc-202609061925.json`.

## Publishable status

- M1-D Stage1 is phase-activated for exactly 1,440 trajectories, then MiniMax post-hoc analysis and stop.
- The resource release uses the shared GPU0–3 Ray pool, but exactly one currently free GPU is selected; physical GPU index is not a scientific variable.
- The 202609062029 successor release repairs only the outer driver's `argparse` abbreviation behavior. It records zero formal trajectories before the repair and explicitly states that scientific semantics did not change.
- M1-A, M1-B, and M1-C remain execution-locked.
- The MiniMax binding itself records zero M1-D baseline rollouts and zero M1-D MiniMax records at binding time; it is a preregistration, not an outcome.
- No M1-D trajectory or MiniMax result is published by this refresh. Result language remains blocked until the required trajectory and MiniMax seals exist.

## Website rule

The Mechanism page may describe the state above as execution authority. It must not convert activation, runtime readiness, driver repair, or a MiniMax preregistration into a scientific outcome.
