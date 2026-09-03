# PR #420 exact-head validation boundary

This note records the final release boundary for the OpenEvo Stage 1 evolution and historical 7B Stage 2 analysis maps.

- PR: `mykcs/basemodel#420`
- Website feature branch: `website/openevo-stage1-stage2-evidence-maps-20260903`
- The branch must be synchronized to the then-current `main` before Preview/merge acceptance.
- Pull-request CI must compare against the base parent of the merge candidate actually checked out by GitHub Actions, not a stale trigger-time `base.sha` if `main` moved while the job waited in the self-hosted queue.
- Keep `actions/checkout` shallow for ordinary PR validation (`fetch-depth: 2`); do not restore full-history checkout merely to work around moving-main drift.
- `persist-credentials: false` remains required. The moving-main fix must not reintroduce persisted GitHub credentials.
- The new Stage 1 page may describe the `202609030400` shared-harness freeze and its gates, but must not claim raw Stage 1 / MiniMax / Stage 2 completion beyond upstream authority.
- The new 7B Stage 2 page may preserve historical design conclusions, Task Vector diagnostic-only semantics, and the capacity amendment. Exact Ceiling snapshot counters classified `stale-unknown` by Phase C must remain absent until immutable receipt binding is restored.

This note is operational evidence only; it is not a scientific authority source for the experiment itself.
