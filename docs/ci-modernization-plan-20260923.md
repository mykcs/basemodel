# CI modernization plan — 2026-09-23

Status: **implemented; final exact-head merge acceptance pending**

Repository: `mykcs/basemodel`  
Integration branch: `main`

## Objective

Make BaseModel's repository-owned Public PR CI an actual merge authority alongside Vercel, without changing scientific or website semantics.

## Current state verified before this PR

- Public PR CI already had exact-head planning, deterministic verification, risk-based browser shards, and the aggregate `public-ci-gate` job.
- Live `main-pr-gate` had drifted to requiring only the Vercel status even though current deployment policy already defined both `public-ci-gate` and Vercel as required acceptance.
- Ordinary working refs intentionally do not spend Vercel compute; final candidates use the persistent exact-SHA `ci/vercel-gate-final` path.
- GitHub Actions used by the current PR CI are already pinned to immutable commit SHAs.

## Implementation checklist

- [x] Open this plan-only PR before changing CI/provider behavior.
- [x] 1. Record the current exact ruleset and observe the exact `public-ci-gate` check identity on a fresh PR head.
- [x] 2. Prove the repository-owned final-gate flow: `public-ci-gate` succeeded first, then `request-vercel-final-gate.mjs` armed Vercel for the same exact PR SHA.
- [x] 3. Update the existing ruleset in place, not create a parallel authority: require both `public-ci-gate` from GitHub Actions and `Vercel` from Vercel.
- [x] 4. Read back the ruleset and preserve PR/deletion/non-fast-forward/review-thread protections.
- [x] 5. Confirm Fast Review Preview remains review-only and Mac CI remains manual fallback; neither becomes a universal merge gate.
- [x] 6. Record durable check/provider identities and validation evidence here.
- [ ] 7. On this final documentation head, rerun Public PR CI, request a fresh exact-head Vercel final gate, refresh current-base identity, and merge only if both required checks are green.

## Durable acceptance configuration

Required checks on `main`:

- `public-ci-gate` — GitHub Actions app integration id `15368`
- `Vercel` — Vercel app integration id `8329`

The existing `main-pr-gate` ruleset also retains:

- branch deletion protection;
- non-fast-forward protection;
- pull-request requirement;
- review-thread resolution requirement;
- strict up-to-date required-status semantics.

## Validation evidence

On the initial plan head `a054d3722da836a04aca16bde550fc9e85720e62`:

- `public-ci-gate`: **SUCCESS**, GitHub Actions app id `15368`;
- ordinary plan branch produced no Vercel status, as expected from the repository's build-budget policy;
- `node scripts/request-vercel-final-gate.mjs 792` first verified exact-head Public PR CI and current-base identity, then moved the persistent Vercel final-gate ref to that same SHA;
- Vercel then reported **success** on that exact SHA;
- live ruleset was updated atomically and read back with both required checks.

The final PR head created by this plan update must repeat both provider checks before merge; that final hosted result is merge-time evidence and is intentionally not faked into this file before it exists.

## Acceptance criteria

- [x] `main` still forbids deletion and non-fast-forward updates and still requires PRs.
- [x] `public-ci-gate` and `Vercel` are both configured as app-bound required checks.
- [x] No scientific result, route, content, Vercel project binding, browser-test population, or provider role changed.
- [x] Existing Public PR CI remains the repository-owned correctness authority.
- [ ] Final exact-head `public-ci-gate` and Vercel both succeed after this last plan update.
- [ ] PR remains current with live `main` immediately before merge.

## Rollout discipline

- Implement this plan in **this same PR**, one phase at a time, and check items only after fresh evidence exists.
- Refresh the integration branch immediately before ruleset changes and again before merge.
- Bind required checks to the exact provider/app; do not trust a same-name status from an unrelated app.
- Keep deterministic correctness in repository-owned commands. Workflow/provider configuration executes that authority rather than reimplementing it.
- A local PASS is not hosted-CI proof. Exercise the exact current PR head before declaring completion.
- Do not weaken existing scientific, product, deployment, privacy, or operational authority to make CI green.

## Non-goals

- No unrelated product/content/scientific changes.
- No provider migration merely for uniformity.
- No destructive cleanup or visibility change.
- No temporary provider/build state becomes long-lived authority beyond the durable architecture and acceptance identities above.
