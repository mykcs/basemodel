# Vercel migration-plan path — compatibility shim

Status: **fixed-path executable compatibility only; not current deployment authority**  
Last reviewed: **2026-08-27**

The Vercel Preview/Production migration is complete. The historical adoption record previously stored at this path is preserved at:

- [`../history/2026-08-12-vercel-preview-production-adoption.md`](../history/2026-08-12-vercel-preview-production-adoption.md)

For current behavior read:

- [`hosting-architecture.md`](hosting-architecture.md)
- [`deployment-policy.md`](deployment-policy.md)
- [`release-closeout-protocol.md`](release-closeout-protocol.md)
- executable `vercel.json` and current tests

This path remains only because `src/lib/vercelBuildBudget.test.ts` and `src/lib/publicReleaseSecurityGate.test.ts` still read it. Remove this shim in the same change that deliberately migrates those executable consumers.

## Compatibility assertions retained for the existing tests

Ordinary working PR refs remain disabled in Vercel because required CI now runs in public GitHub Actions. When an optional provider Preview is explicitly requested, `ci/vercel-gate-base` records live `main` and `ci/vercel-gate-final` records the exact candidate; browser scope is computed from that pair so unrelated prior PRs do not create false-full runs. `VERCEL_GIT_PREVIOUS_SHA` remains relevant to ordinary `main`/Production ignored-build decisions. The full build-budget policy is owned by `deployment-policy.md`.

Historical providers are not ordinary report dimensions. Ordinary completion reporting starts with required `public-ci-gate`, then reports Vercel Production separately; an optional Preview appears only when one was actually requested.

Temporary Vercel share access is ephemeral: never persist a share URL or `_vercel_share` parameter in repository files, PR/Issue bodies, or GitHub comments.
