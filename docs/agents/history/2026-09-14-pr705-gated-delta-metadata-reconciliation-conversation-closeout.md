# PR #705 Gated-Delta metadata reconciliation conversation closeout

Date: 2026-09-14  
Follow-up: 2026-09-15 post-merge regression monitoring
Status: **historical closeout evidence; not current scientific, product, deployment, or experiment authority**

This record captures the reusable lessons from reconciling the Gated-Delta current-route metadata with an already-sealed four-round qualification, refreshing the PR onto moving `main`, re-running exact-head acceptance, closing the Production release boundary, and then monitoring that release after later concurrent BaseModel changes.

Current scientific truth still comes from the upstream scientific authority and executable evidence. Current BaseModel operating rules live in `docs/agents/current/*`, root `AGENTS.md`, and executable tests. This file explains why one publication rule was strengthened and how the completed release should be monitored; it is not a new scientific authority.

## Coverage boundary

Reviewed evidence includes the accessible conversation, the merged PR diff and release receipts, current BaseModel policy owners, the current research publication contract, exact-head/Vercel/SSO rules, the current language-surface policy, and the concrete Gated-Delta / historical GDR-v1 publication tests and source.

Temporary branch heads, deployment IDs/URLs, queue states, local ports/PIDs, disposable worktree paths, one-time provider timing, and the current `main` SHA observed during a monitoring pass are intentionally not promoted into standing policy.

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

### 5. Provider-write noun binding repeated during closeout

After the first closeout PR was merged, the Agent used the write-oriented `create_branch` action several times while trying to confirm an already-existing branch. GitHub rejected those requests with `422 Reference already exists`, so no repository mutation occurred, but the action selection was still wrong.

This is a **repeated use-site activation failure**, not a missing-rule failure. Current root `AGENTS.md` already requires `intended object -> exact action -> exact target` before provider writes and explicitly says a file/ref/branch mutation is not a substitute for a different object/action. The corrective witness for this conversation is: `inspect existing branch -> read/search branch action -> no write dispatch; create new branch -> create_branch once -> exact new branch target; 422 before mutation -> NOT_EXECUTED`. Do not add a second provider-write policy.

## 2026-09-15 post-merge monitoring follow-up

The follow-up conversation did not uncover a new scientific result. It exposed a different operational boundary: once a release is already correct, monitoring must not quietly turn back into development.

### A. Every monitoring pass starts from live authority again

A merged PR is historical evidence, not the current state of the website. Before reporting a regression or completion state, re-read the repository's live integration head and the live deployment/provider state, then inspect the currently active route and its executable source/tests. Do not copy the previous monitoring report forward merely because the original PR was already merged.

This is the monitoring form of the existing exact-state rule. No new current policy is needed: `AGENTS.md`, deployment/release policy, and the scenario registry already make live provider state and executable current repository truth stronger than an old PR snapshot or assistant recap.

### B. Expected route retirement is not a regression

The owner intentionally made Chinese the only active runtime locale during the current iteration phase and archived English source under `docs/archive/site-en/`. Therefore an inactive `/en/**` surface must first be classified against the **current language topology** before anyone calls it broken.

Do not restore `src/pages/en/**`, English sitemap/hreflang, or a language switch merely because an old English URL is absent, redirected, or returns a non-success response. English restoration requires an explicit owner request and the full restoration contract already owned by `website-engineering-standard.md`.

### C. A completed release can stay at 100% while monitoring continues

Monitoring is not an excuse to manufacture a commit. If current `main` plus current Production still satisfy the requested publication contract, the correct state is **100% complete, 0% repair work remaining, regression monitoring only**.

The allowed action in that state is read / compare / report. A repository mutation becomes justified only when a concrete engineering, CI, deployment, metadata, copy, or contract regression is actually observed and can be repaired without changing scientific meaning.

This is already the repository's stopping rule: `website-engineering-standard.md` says to stop when the requested problem is closed and not create another optimization phase merely because further work is possible. The follow-up adds a concrete monitoring example, not a second mutable rule.

### D. Monitor lineage boundaries as separate owners, not one SD-LoRA bucket

The monitoring pass must keep three different publication identities separate:

- the current recurrent-write Gated-Delta mechanism and its bounded qualification claim;
- the historical local GDR-v1 / DirectApply candidate-admission story;
- parallel SD-LoRA acceleration / VR engineering lineages.

A change in one surface does not authorize importing its mechanism, claim, or status into another. The historical candidate-admission page keeps its established historical facts; the current Gated-Delta page keeps its current recurrent-write semantics and bounded non-final claim; acceleration/VR pages keep their own estimands and evidence.

This semantic separation is already protected by current publication source/tests and existing research-lineage documentation. The closeout therefore does not create a new policy owner or duplicate the scientific facts here.

### E. Monitoring correction-to-action witness

For future repeated "continue monitoring" requests, use this executable witness before acting:

```text
trigger: another status/monitoring pass
-> current owner: live GitHub/Vercel + current route/test owners
-> checked artifact: current integration SHA, current deployment state, active-language topology, route source/tests
-> allowed next action: report only if compliant; narrowly repair only a concrete regression
-> invalidation cue: integration head/provider state/topology/scientific authority changed
```

This keeps the owner's repeated correction attached to the use site instead of merely preserving it in a retrospective.

## Coverage ledger

| Feedback / failure | Repeated? | Reusable lesson | Canonical destination | Why there |
| --- | --- | --- | --- | --- |
| Body said sealed while route metadata said incomplete | New concrete publication inconsistency | scientific state and claim boundary must match across body + metadata/search/share surfaces | `research-site-presentation-contract.md` + route regression tests | publication contract owns reader-facing scientific wording; tests protect the concrete route |
| Live `main` advanced after the initial snapshot | Known moving-main family, correctly caught | owner-provided SHA is not a lock; refresh live base immediately before release mutations | existing `release-closeout-protocol.md` / `deployment-policy.md` | rule already exists; no duplicate authority needed |
| Protected Preview returned SSO redirect | Known provider-access family, correctly classified | access/auth boundary is not app failure | existing `scenario-trigger-registry.md` / deployment policy | rule already exists and worked here |
| Disposable worktree lacked dependencies / local port occupied | Local execution friction | classify setup failures separately; use supported isolated runtime/port before destructive cleanup | this historical case only | too environment-specific for a new standing rule |
| `create_branch` was reused to inspect an already-existing branch | **Yes** | bind intended provider object/action/target before dispatch; read existing state with a read action | existing root `AGENTS.md` provider-write rule | rule already exists and was recently promoted; failure was use-site activation, so record a witness instead of duplicating policy |
| Repeated monitoring request after PR #705 was already merged | Repeated owner emphasis, but correctly followed in this follow-up | every pass re-resolves live repository + provider state; previous report/PR state is not reusable authority | existing `AGENTS.md` precedence + deployment/release policy | current authority already exists; the missing value was a monitoring-specific use-site witness |
| English active site had been intentionally archived | Known topology change, correctly classified | test the current active-language contract before calling an old `/en/**` route a regression; never restore retired active English without explicit request | existing `website-engineering-standard.md` language-surface section | current policy already owns this state and restoration boundary |
| Owner explicitly said not to create changes merely to "advance" a completed release | Repeated owner emphasis, correctly followed | compliant current `main` + Production means 100% complete and monitor-only; mutate only for a concrete regression | existing `website-engineering-standard.md` stopping rule | avoids status-driven churn without inventing another policy layer |
| Current Gated-Delta, historical GDR-v1/DirectApply, and acceleration/VR could be confused by the shared SD-LoRA vocabulary | Known semantic-identity risk, no regression observed in this follow-up | verify each lineage against its own owner/tests; never repair one by copying another line's mechanism or claim | existing research publication/lineage owners + executable route tests | scientific identity is already owned elsewhere; this history only records the monitoring boundary |

## Future-Agent test

Before publishing a research-state transition, a future Agent should be able to answer:

1. Did I read the live scientific authority rather than infer state from old website copy?
2. Do the body, title, description, OG/Twitter metadata, and search/share summaries say the same current state?
3. Do all those surfaces preserve the same comparison scope, caveats, and final/non-final boundary?
4. Immediately before final gate or merge, did I re-read live `main` and the exact PR head?
5. If hosted HTML is protected by SSO, did I classify that as access state and use provider/exact-head evidence rather than weakening protection?
6. Before any provider write, did I bind the intended object, action, and exact target, and use a read action when I only need to inspect existing state?

For a post-merge monitoring pass, also ask:

7. Did I re-read live GitHub and live deployment state **this pass**, instead of inheriting the previous report?
8. Did I resolve the route against the current language/topology policy before calling absence or 404 a regression?
9. If the contract is still satisfied, did I stop at 100% complete rather than inventing a code/doc change?
10. Did I verify current Gated-Delta, historical GDR-v1/DirectApply, and acceleration/VR against their own semantic owners instead of treating "SD-LoRA" as one interchangeable line?

If these checks run, the contradiction that motivated the original closeout and the status-driven churn risk from the monitoring follow-up are materially harder to recreate.

## Temporary state intentionally not promoted

Do not freeze the PR head, merge SHA, current `main` SHA, deployment identifiers, READY timestamps, CI run numbers, local ports, local PIDs, disposable worktree paths, or one monitoring pass's provider timing as standing knowledge. Git and provider history can recover them when needed.

## Long-term memory boundary

No account-level long-term ChatGPT memory write is claimed by this closeout. The durable project rules already live in the repository's current policy owners and concrete route regression tests; this file adds historical activation evidence and a monitoring use-site witness. Current repository/scientific authority remains stronger than any remembered summary.
