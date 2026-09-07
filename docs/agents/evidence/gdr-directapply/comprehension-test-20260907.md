# GDR → DirectApply blind comprehension acceptance

- Status: **PASS — 7 / 7**
- Test date: 2026-09-07
- Reader condition: fresh agent with no OpenEVO conversation context
- Allowed source: rendered page text exported to `PAGE.txt` only
- Disallowed: web search, other repository files, prior conversation context

## Questions and accepted answers

1. **What is GDR?** A candidate-state admission rule: probe a changed state, then keep it or fall back to the incumbent.
2. **Why only 7 formal SD updates?** 44 SD-LoRA candidates were trained, but GDR-v1 admitted only 7. Seven means seven candidates entered the continuing model state, not seven training attempts.
3. **Why suspect GDR-v1?** It optimizes a one-step probe while the scientific objective is long-horizon performance; a 16-task probe can also overreact to discrete noise.
4. **What does DirectApply change?** It removes the short-horizon task-score accept/reject decision from the candidate transition policy.
5. **Does No-GDR remove safety checks?** No. Artifact, dataset, schema, capacity, training-success, execution-identity, rollout-accounting, and final-panel isolation checks remain fail-closed.
6. **Why not adopt 4 GPUs × 5 workers/GPU directly?** That successor changed the round driver, launcher, worker/shard topology, and runtime-thread environment. Behavioral equivalence was not yet demonstrated.
7. **Has DirectApply already been proven better?** No. The run was still in progress; the page only establishes that the task-score gate was removed and preserves the pending claim boundary.

## Acceptance decision

All seven answers matched the page's intended scientific meaning without relying on hidden provenance. This clears the required `comprehension >= 6/7` gate.
