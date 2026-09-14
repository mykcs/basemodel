# PR #705 Gated-Delta metadata reconciliation conversation closeout

Date: 2026-09-14
Status: **historical closeout evidence; not current scientific, product, deployment, or experiment authority**

This record captures the reusable lessons from reconciling the Gated-Delta current-route metadata with an already-sealed four-round qualification, refreshing the PR onto moving `main`, re-running exact-head acceptance, and closing the Production release boundary.

Current scientific truth still comes from the upstream scientific authority and executable evidence. Current BaseModel operating rules live in `docs/agents/current/*`, root `AGENTS.md`, and executable tests. This file explains why one publication rule was strengthened; it is not a new scientific authority.

## Coverage boundary

Reviewed evidence includes the accessible conversation, the merged PR diff and release receipts, current BaseModel policy owners, the current research publication contract, and existing exact-head/Vercel/SSO rules.

Temporary branch heads, deployment IDs/URLs, queue states, local ports/PIDs, disposable worktree paths, and one-time provider timing are intentionally not promoted into standing policy.

## What actually taught us something

### 1. Route metadata is scientific copy, not decorative SEO

The rendered Gated-Delta page body had already moved to the sealed 4/4 qualification state, while the route-level title/description still described the comparison as incomplete. Both surfaces were individually plausible, but together they contradicted each other.

The durable lesson is that `<title>`, description, Open Graph/Twitter metadata, search/share summaries, and the visible page body are one publication surface whenever they encode scientific state. A state transition such as interim -> sealed must update all of them to the same bounded claim.

The metadata must also carry the same limits as the body. A route summary may be shorter, but it may not silently convert a qualification result into universal superiority or a final-panel claim.

### 2. User-provided `main` is a starting observation, not a lock

The conversation began with a concrete `main` SHA, but live repository state had already advanced again. The correct response was to re-read live `main`, reconcile against the actual current base, and invalidate the older mergeability assumption before mutating the PR.

This is not a new policy. `release-closeout-protocol.md`, `deployment-policy.md`, and current multi-Agent rules already require exact-current-base evidence. The useful lesson is activation discipline: refresh immediately before a rebase/final gate/merge decision even when the owner supplied a recent SHA.

### 3. A protected Preview redirect is an access boundary, not a product failure

Direct fetching of the hosted Preview returned Vercel authentication/SSO rather than page HTML. That did not contradict the deployment reaching READY or the exact-head hosted browser suite passing.

The repository already owns this rule in the scenario registry and deployment history. The safe evidence chain is provider deployment identity + exact-head hosted acceptance + source/current-main readback, unless an authenticated browser path is explicitly available. Do not weaken Preview protection or call an SSO redirect an application regression.

### 4. Local validation friction should not trigger destructive shortcuts

A disposable worktree initially lacked installed dependencies, so an ad-hoc `npx` path attempted to use the wrong test runtime. A later browser run found the default local port already occupied. Both were execution-environment problems, not product failures.

The safe recovery was to reuse the repository's installed dependency context and its supported isolated Playwright port rather than killing an unknown process or treating setup failure as a test failure. These details are retained here as historical friction, not promoted into a new global policy because no durable project gap was found.

## Coverage ledger

| Feedback / failure | Repeated? | Reusable lesson | Canonical destination | Why there |
| --- | --- | --- | --- | --- |
| Body said sealed while route metadata said incomplete | New concrete publication inconsistency | scientific state and claim boundary must match across body + metadata/search/share surfaces | `research-site-presentation-contract.md` + route regression tests | publication contract owns reader-facing scientific wording; tests protect the concrete route |
| Live `main` advanced after the initial snapshot | Known moving-main family, correctly caught | owner-provided SHA is not a lock; refresh live base immediately before release mutations | existing `release-closeout-protocol.md` / `deployment-policy.md` | rule already exists; no duplicate authority needed |
| Protected Preview returned SSO redirect | Known provider-access family, correctly classified | access/auth boundary is not app failure | existing `scenario-trigger-registry.md` / deployment policy | rule already exists and worked here |
| Disposable worktree lacked dependencies / local port occupied | Local execution friction | classify setup failures separately; use supported isolated runtime/port before destructive cleanup | this historical case only | too environment-specific for a new standing rule |

## Future-Agent test

Before publishing a research-state transition, a future Agent should be able to answer:

1. Did I read the live scientific authority rather than infer state from old website copy?
2. Do the body, title, description, OG/Twitter metadata, and search/share summaries say the same current state?
3. Do all those surfaces preserve the same comparison scope, caveats, and final/non-final boundary?
4. Immediately before final gate or merge, did I re-read live `main` and the exact PR head?
5. If hosted HTML is protected by SSO, did I classify that as access state and use provider/exact-head evidence rather than weakening protection?

If these checks run, the contradiction that motivated this closeout is materially harder to recreate.

## Temporary state intentionally not promoted

Do not freeze the PR head, merge SHA, deployment identifiers, READY timestamps, CI run numbers, local ports, local PIDs, or disposable worktree paths as standing knowledge. Git and provider history can recover them when needed.

## Long-term memory boundary

No account-level long-term ChatGPT memory write is claimed by this closeout. The durable project rule is stored in the repository publication contract and concrete route regression tests; current repository/scientific authority remains stronger than any remembered summary.
