# Vercel Pro blocking-acceptance cutover retrospective — 2026-09-08

Status: **historical engineering evidence, not current CI/deployment authority**. Current behavior is owned by `/AGENTS.md`, `docs/agents/current/deployment-policy.md`, `hosting-architecture.md`, `release-closeout-protocol.md`, executable Vercel/GitHub configuration/tests, and live provider/ruleset state.

## 1. Scope and historical outcome

This conversation investigated BaseModel PR #563 while it was moving blocking browser acceptance from CircleCI back to Vercel Pro. The supplied exact head `ebb8a2141110ca2cd49d5afd1ddffbe6aeabffbc` had a failed Vercel status at 04:09 UTC while the three CircleCI contexts were still pending.

The failure was localized inside `npm run verify:deploy`, before hosted Chromium/Lab acceptance started. Two `agentScenarioTriggerRegistry.test.ts` assertions still pinned the superseded CircleCI-as-ordinary-authority text. The narrow successor `c1ee4f2d41bb7034b2ccb63e6eb7ee8d747fd814` changed only those authority assertions and then completed the hosted 203-case Chromium matrix plus the 12-case Lab matrix with Vercel READY.

A second, more important cutover gap was then found: repository code/docs described Vercel as blocking authority while the live GitHub `main-pr-gate` ruleset still required the three CircleCI contexts. Before this conversation mutated the ruleset, a concurrent operator changed it to require only `Vercel` (GitHub App integration) while preserving strict required-status and PR/review protections. The planned duplicate mutation was therefore not executed.

PR #563 was subsequently merged by another operator, not by this conversation. Its Production deployment reached READY. `main` then advanced again through a later release; that newer Production also ran the same Vercel blocking contract and reached READY. These are historical receipts, not future state.

No GPU, experiment controller, scientific protocol, server storage, Docker cleanup, model artifact, or research result was changed in this conversation.

## 2. Friction matrix

| Friction | What actually happened | Missing context / wrong assumption | Check before acting next time | Defensive rule | Plausible but wrong anti-example |
|---|---|---|---|---|---|
| Vercel was red, so the cutover looked broken | Failure occurred in `verify:deploy` before browser execution | Provider status color was treated as failure classification | Read build command phase + first failing assertion + whether browser gate launched | Localize the first failing execution owner before changing provider architecture | Revert Vercel browser acceptance because an old repository string assertion failed |
| Repository said Vercel-first but merge still waited on CircleCI | Live ruleset still required three CircleCI contexts | Repository config/docs were mistaken for the external control plane | Read live ruleset/branch protection and required integration identity | Provider migration is repository contract **plus** live control-plane authority | Declare migration complete because `vercel.json` and docs say Vercel is required |
| A narrow test-only successor looked like “weakening CI” | Successor only replaced stale authority strings; full hosted matrices then ran | Test edits were judged by filename rather than invariant | Compare old assertion to current owner/live truth; verify downstream gate still executes | Update a stale contract narrowly when live/executable truth proves it obsolete; never lower semantic thresholds | Delete the failing test or skip `verify:deploy` so Vercel can reach Playwright |
| Planned ruleset write became stale while preparing it | Another operator had already installed the desired required `Vercel` context | Conversation ownership was mistaken for a lock on shared provider state | Re-read live ruleset immediately before mutation | If shared state already satisfies intent, do not replay/overwrite it; continue from readback | PUT the whole old ruleset payload anyway so “our” migration is recorded |
| PR was later merged by another operator | Closeout state changed from open to merged between reads | Earlier “do not merge” task boundary was mistaken for permanent external state | Re-read PR state/merge commit/actor before reporting or mutating | Report who actually performed shared mutations; never claim authorship from observed outcome | Say “I merged #563” because the PR became merged during the task |
| Latest Production moved beyond the cutover merge | Another release advanced `main` after #563 | One successful Production was assumed to remain latest-site proof | Resolve stable Production alias -> backing deployment -> SHA | Post-cutover health must be checked on current main when later overlapping release movement can invalidate the contract | Send the old generated deployment URL as “the latest website” |
| Fish rejected Bash-style assignment during this retrospective | `WT=...` was parsed by Fish before intended Bash semantics | Inner intent was confused with outer parser boundary | Inspect tool shell; use explicit Bash/Python for Bash syntax | Shell dialect is part of execution identity | Keep retrying Bash syntax through Fish because the command is “obviously Bash” |

## 3. A / B / C retention

### A — durable cross-task rules

- A provider/CI migration is a transaction across repository contract, replacement exact-head execution, live required-status authority, predecessor role, and post-merge Production verification.
- A provider red badge is not a root cause. Classify repository Gate, browser/product, environment/bootstrap, policy skip/ignore, and provider infrastructure separately.
- Shared provider/repository control-plane state is mutable. Re-read immediately before mutation; if another operator already completed the desired change, do not replay it.
- A stale test may legitimately need updating when current owner + executable/live truth prove the assertion obsolete, but acceptance scope/thresholds must remain unchanged and the downstream gate must actually execute.
- Observing a merge/ruleset change does not mean the current Agent performed it. Mutation authorship is part of historical truth.
- Shell/interpreter selection belongs to the actual outer parser boundary.

### B — BaseModel project lessons

- Current BaseModel blocking acceptance is owned by Vercel current policy/config plus live GitHub required-status state; CircleCI can remain shadow/fallback without merge authority.
- `verify:deploy` is deliberately inside the Vercel build command, so stale governance tests can block before browser acceptance. That is correct fail-closed behavior when the test is valid; when the test is stale, update the owning assertion rather than bypassing the Gate.
- Vercel Preview qualification and Vercel Production are separate boundaries; current `main` Production must still execute the required contract after merge.
- `scripts/vercel-ui-plan.ts` / hosted gates remain the semantic browser owner; changing provider authority must not fork or weaken reader/scientific/browser rules.

### C — transient state deliberately not promoted

Do not reuse without live readback: PR #563 state, exact SHAs, deployment IDs/URLs, the 04:09 UTC failure timestamp, the then-pending CircleCI jobs, current `main`, ruleset update timestamp, current Vercel plan/usage, temporary worktree path, shell PID, or current Production deployment.

Those values remain here only to reconstruct this historical incident.

## 4. Repeated-error audit

This conversation did **not** discover most underlying ideas for the first time.

- **Fish/Bash** had already been promoted to root/current policy and still recurred. The remaining problem was use-site execution: the command was issued before explicitly choosing the outer parser. The defense is a pre-command witness, not another shell essay.
- **Green outer status != real provider execution** had already appeared in prior Vercel closeouts. It recurred because the visible status badge remained easier to read than the execution phase/provider object. This case therefore adds provider-cutover localization directly to the Preview/Production trigger and release owner.
- **Moving/concurrent shared state** had already been documented for PR heads and merges. Here the same rule applied to the **GitHub ruleset itself**. The missing abstraction was that provider control-plane configuration is shared mutable state just like a branch.
- **Retrospective history alone did not prevent recurrence.** Deep history explained the failures, but provider-cutover tasks lacked a concise trigger that says “read live required-status authority before declaring migration complete.” That use-site is now in current deployment policy, release closeout, scenario trigger, and one root bootstrap sentence.

The remedy is therefore not “write more retrospectives.” It is: history for causality, current owner for the rule, trigger for discovery, and live readback for enforcement.

## 5. Scientific/content boundary

Although this was CI/deployment work, the migration could have silently weakened scientific or reader safety if the replacement provider ran a reduced Gate. The accepted contract preserved `verify:deploy`, reader-contract audits, semantic/claim/freshness checks, the canonical Chromium acceptance surface, and Lab checks where relevant.

The invariant is provider-independent:

```text
change who executes/blocks the contract
!= change what scientific/reader/browser contract must pass
```

A speed/cutover fix that deletes assertions, skips viewports, removes reader-contract checks, loosens scientific-content audits, or converts unknown risk to PASS changes treatment semantics and is not a valid provider migration.

## 6. Zero-context procedure for the next provider-cutover Agent

1. Read root bootstrap, current deployment/hosting/release owners, scenario trigger, executable provider config/scripts/tests, and live provider state.
2. Write the role model: source host, CI control plane, CI compute, deployment, post-deploy observation.
3. Record current required-status/ruleset state before changing repository code.
4. Build the replacement contract without weakening deterministic/browser/reader/scientific invariants.
5. Qualify the replacement on one exact PR head and prove the provider build path really executed.
6. If red, stop at the first failing execution owner and classify it before editing architecture.
7. Immediately before ruleset/branch-protection mutation, read live state again; preserve unrelated protections and avoid a no-required-check window.
8. Switch required authority atomically when still necessary; leave the predecessor as shadow/fallback only if current policy wants it.
9. Re-read PR/ruleset/provider after the write. If another operator already moved state, record the actual actor/outcome and do not replay writes.
10. Merge only under the current required authority and task authorization.
11. Verify the merge/main SHA gets a Production deployment using the same contract and verify the stable Production identity.
12. If `main` advances again before closeout and the later release can affect the same contract, verify the latest Production too.
13. Deposit durable rule in current owner + trigger; keep PR/SHA/timing/provider IDs in history only.

## 7. Long-term-memory boundary

Repository persistence is not ChatGPT native memory. The runtime used for this retrospective exposes no callable account-level memory-write action. Therefore **native long-term-memory writes: 0**.

The stable candidates are the A-class rules above. They are persisted in repository startup/current policy so future BaseModel Agents can discover them, but this must not be described as account memory. PR numbers, SHAs, provider states, timestamps, worktree paths and deployment IDs are intentionally excluded from memory candidates.

## 8. Historical truth boundary

The historical failure at `ebb8a214...` remains a real failed exact-head Vercel deployment; it is not rewritten as a platform outage. The successor `c1ee4f2...` remains the narrow assertion-alignment fix that qualified the hosted contract. The later ruleset change and merge happened concurrently and were observed, not performed by this conversation. Production READY evidence closed the migration at that time.

Future Agents must re-read current repository, GitHub ruleset and Vercel state before acting. This file explains **why** the rules exist; it does not say what is currently pending or green.
