# Delta/β R200 website completeness pass

Status: **LOCAL ACCEPTANCE PASS · awaiting exact-head hosted gates on PR #811**
Date: **2026-10-01**
Owner page: `src/components/research/OpenEvoEffectiveStateGdrLoraStudy.astro`

## Why this follows PR #810

PR #810 correctly published the sealed R160–R199 continuation and its main conclusions. This pass is narrower: make the canonical page preserve the **complete experiment/evidence chain**, not only the summary windows.

## Missing pieces to close

- [x] publish a round-level R96–R199 evidence series for Task Score, training loss, β, episode steps, output length and action-family entropy;
- [x] add a reader-facing R200 trajectory figure instead of relying only on four 20-round table rows;
- [x] state the sealed extension accounting: 40 new frontiers, 5,120 new formal rollouts, 40 parameter UPDATEs, 0 NOOPs;
- [x] explain the R160 zero-replay recovery and later Completion-First content rejection as **control-plane recovery**, not a new scientific treatment;
- [x] state explicitly that no sealed R0–R159 rollout was replayed and no final-panel or external-teacher access was introduced;
- [x] preserve the distinction between the failed predecessor attempt and the completed successor lineage;
- [x] connect these experiment facts to the loss / β / State geometry / path-length / entropy conclusions already on the page;
- [x] keep dynamic α+β marked unrun and keep stopping-point claims prospective.

## Acceptance

- [x] public evidence contains no server-local path or credential;
- [x] R159 recomputation still reproduces the existing published geometry;
- [x] page can answer: what ran, what recovered, what changed, what did not change, and what remains unknown;
- [x] focused unit tests pass;
- [x] Astro check and Reader Contract audit pass;
- [x] phone/tablet/desktop light/dark target-route browser acceptance passes;
- [x] full deterministic repository gate passes;
- Hosted release gates: exact-head Public PR CI and final Vercel are live provider state owned by PR #811; merge occurs only after both pass.

## Local acceptance · 2026-10-01

- Focused study/Reader Contract tests: **43 / 43 PASS**.
- Astro check: **0 errors / 0 warnings**; two pre-existing Zod deprecation hints.
- Reader Contract audit: **68 / 68 PASS**.
- Target-route Chromium: **22 / 22 PASS** across phone / tablet / desktop, light / dark, overflow, keyboard disclosure, reduced motion, and browser-error checks.
- Full deterministic `verify:deploy`: **PASS**.
  - Structural: **806 / 806 PASS**.
  - Behavior: **37 / 37 PASS**.
  - Strict copy audit: **0 invariant failures**.
- The public round-level evidence has **104 rows (R96–R199)** and contains no server-local path.
- R159 geometry was already reproduced before #810; this completeness pass reuses that validated geometry and adds no new scientific mutation.

## Provider boundary

The final Public PR CI, Vercel exact-head gate, merge SHA, and Production verification are provider-owned state and must be recorded on PR #811 after they occur. They are not hard-coded as pre-completed facts in this document.
