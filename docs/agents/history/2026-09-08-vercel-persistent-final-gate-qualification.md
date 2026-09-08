# Vercel persistent final-gate qualification — 2026-09-08

Status: historical provider-trigger receipt. Current authority lives in `docs/agents/current/deployment-policy.md` and `hosting-architecture.md`.

After BaseModel stopped deployment-enabled ordinary branches, qualification PR #574 used exact candidate SHA `ca2ddd31f304ac48f7c0ce425ae314146a3061f9`. The ordinary `verify/...` head produced zero checks/statuses, proving working PR activity consumed no Vercel acceptance build.

A newly created `ci/vercel-gate-canary-20260908` ref pointed directly to that already-existing candidate SHA but produced no Vercel status. The same ref was then moved away and updated back to the exact candidate SHA. That **existing-ref update** emitted the provider event; Vercel deployment `dpl_DHJXnfY6nF9kQ7YW8Pzy5tbp1dXp` reached READY and GitHub attached `Vercel=success` to the exact PR head.

Durable rule: keep one persistent `ci/vercel-gate-final` ref and move it to the exact final candidate SHA. Do not create a fresh alias ref per PR as the ordinary execution trigger. The gate ref is only an execution alias and must never add, cherry-pick, or rewrite candidate content.
