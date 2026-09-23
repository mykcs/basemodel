# CI modernization plan — 2026-09-23

Status: **plan accepted for implementation; implementation pending**

Repository: `mykcs/basemodel`  
Integration branch: `main`

## Objective

Make BaseModel's repository-owned Public PR CI an actual merge authority alongside Vercel, without changing scientific or website semantics.

## Current state verified before this PR

- Public PR CI already has exact-head planning, deterministic verification, risk-based browser shards, and the aggregate `public-ci-gate` job.
- The active `main-pr-gate` ruleset currently requires only the Vercel status.
- GitHub Actions used by the current PR CI are already pinned to immutable commit SHAs.

## Implementation checklist

- [x] Open this plan-only PR before changing CI/provider behavior.
- [ ] 1. Record the current exact ruleset and observe the exact `public-ci-gate` check identity on a fresh PR head.
- [ ] 2. Update the existing ruleset, not create a parallel authority: require both `public-ci-gate` from GitHub Actions and `Vercel` from Vercel.
- [ ] 3. Verify a current-base PR cannot merge when either repository validation or Vercel is missing/failing, and can merge when both succeed.
- [ ] 4. Confirm Fast Review Preview remains review-only and Mac CI remains manual fallback; do not make either a universal merge gate.
- [ ] 5. Update this plan with exact check identities, validation evidence, and completion state.

## Acceptance criteria

- [ ] `main` still forbids deletion and non-fast-forward updates and still requires PRs.
- [ ] `public-ci-gate` and `Vercel` are both required on the exact PR head.
- [ ] No scientific result, route, content, Vercel project binding, or browser-test population changes.
- [ ] Existing public PR CI remains the repository-owned correctness authority.

## Rollout discipline

- Implement this plan in **this same PR**, one phase at a time, and check items only after fresh evidence exists.
- Refresh the integration branch immediately before ruleset changes and again before merge.
- Bind required checks to the exact provider/app when GitHub supports it; do not trust a same-name status from an unrelated app.
- Keep deterministic correctness in repository-owned commands. Workflow/provider configuration should execute that authority rather than reimplement it.
- A local PASS is not hosted-CI proof. Exercise a clean hosted checkout before declaring the migration complete.
- Do not weaken existing scientific, product, deployment, privacy, or operational authority to make CI green.

## Non-goals

- No unrelated product/content/scientific changes.
- No provider migration merely for uniformity.
- No destructive cleanup or visibility change.
- No temporary provider/build state should become long-lived documentation except the durable architecture and acceptance evidence.
