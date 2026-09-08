# Vercel exact-SHA gate-alias qualification — 2026-09-08

This docs-only candidate tests the spend-control invariant after PR #573:

- ordinary working branch: `verify/vercel-alias-qualification-20260908`;
- the working branch itself must not trigger Vercel;
- a `ci/vercel-gate-*` ref will later be moved to this exact same commit SHA;
- the resulting Vercel check must attach to this SHA and satisfy this PR's required `Vercel` status without changing candidate content.

No reader-facing, scientific, browser-assertion, deployment-domain, or CircleCI semantics change.
