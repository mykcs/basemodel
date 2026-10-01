# Delta/β R200 website completeness pass

Status: **ACTIVE**
Date: **2026-10-01**
Owner page: `src/components/research/OpenEvoEffectiveStateGdrLoraStudy.astro`

## Why this follows PR #810

PR #810 correctly published the sealed R160–R199 continuation and its main conclusions. This pass is narrower: make the canonical page preserve the **complete experiment/evidence chain**, not only the summary windows.

## Missing pieces to close

- [ ] publish a round-level R96–R199 evidence series for Task Score, training loss, β, episode steps, output length and action-family entropy;
- [ ] add a reader-facing R200 trajectory figure instead of relying only on four 20-round table rows;
- [ ] state the sealed extension accounting: 40 new frontiers, 5,120 new formal rollouts, 40 parameter UPDATEs, 0 NOOPs;
- [ ] explain the R160 zero-replay recovery and later Completion-First content rejection as **control-plane recovery**, not a new scientific treatment;
- [ ] state explicitly that no sealed R0–R159 rollout was replayed and no final-panel or external-teacher access was introduced;
- [ ] preserve the distinction between the failed predecessor attempt and the completed successor lineage;
- [ ] connect these experiment facts to the loss / β / State geometry / path-length / entropy conclusions already on the page;
- [ ] keep dynamic α+β marked unrun and keep stopping-point claims prospective.

## Acceptance

- [ ] public evidence contains no server-local path or credential;
- [ ] R159 recomputation still reproduces the existing published geometry;
- [ ] page can answer: what ran, what recovered, what changed, what did not change, and what remains unknown;
- [ ] focused unit tests pass;
- [ ] Astro check and Reader Contract audit pass;
- [ ] phone/tablet/desktop light/dark target-route browser acceptance passes;
- [ ] full deterministic repository gate passes;
- [ ] exact-head Public PR CI and final Vercel gate pass before merge.
