# 2026-08-30 site optimization implementation and release retrospective

Status: **historical implementation / release closeout evidence**
Audience: future coding, performance, browser-test, integration and release Agents
Related audit: [`2026-08-30-all-branch-site-optimization-audit.md`](2026-08-30-all-branch-site-optimization-audit.md)
Delivered PR: [#350](https://github.com/mykcs/basemodel/pull/350)

## 1. Why this retrospective exists

This record preserves the full engineering and reasoning lessons from the conversation that began with an already-completed 95-branch audit and ended with the optimization merged to `main` and Vercel Production `READY`.

The value of the case is not the final patch by itself. The difficult parts were the boundaries around the patch:

- the audited baseline kept moving while implementation was running;
- a supposedly simple performance refactor exposed false-green linting, stale tests, no-JS regressions, a hidden duplicate heading and a WebKit-only hydration race;
- browser and provider failures had to be classified before deciding whether product code, test code, environment or provider state was wrong;
- performance work could not be accepted by deleting functionality or raising budgets;
- exact-tree evidence had to survive concurrent `main` movement without turning the task into an endless rebase loop;
- a protected Vercel Preview was `READY`, but application-layer HTTP assertions were not reachable from the available automation session, so the correct answer was to report the boundary rather than manufacture a PASS.

Future Agents should read the current owners first. This document explains **why** several of those current rules exist and gives a concrete failure/recovery sequence.

## 2. Starting state and acceptance contract

The implementation conversation did not start from a blank request. The preceding audit had already produced:

- a full diagnosis of current `main`;
- classification of 95 live branch heads;
- a Phase 0→4 implementation plan;
- an acceptance contract;
- a copyable executor prompt;
- an explicit instruction to leave the optimization PR unmerged for independent verification.

Original handoff branch/commit before later rebases:

```text
branch: codex/site-optimization-audit-20260830
original audit commit: 8875ec1521329fa95371ba912454bc7eeda9ea39
```

The implementation eventually landed through:

```text
audit commit in merged lineage: bced068
implementation head: d4f86e0208440b684faaae146baa3ac18c2d8047
PR: #350
merge commit: e11d443107442ec93cf697531b69c8aea6f925bf
```

The important initial constraints were:

1. preserve Astro + React rather than rewrite the stack;
2. preserve static-first research semantics and unknown/evidence boundaries;
3. fix false-green Gates before performance work;
4. keep the then-active PR #335 isolated;
5. do not delete remote branches;
6. do not merge `main` or deploy Production until acceptance was complete;
7. use one exact-head Vercel Preview rather than provider-triggering edit loops;
8. return base/head/tree identity, tests, payload deltas and Preview evidence.

## 3. Final outcome

The merged implementation changed 81 files:

```text
1,046 insertions
2,837 deletions
```

The optimization did not raise the performance ceilings.

| Surface | Audit baseline | Accepted PR head |
| --- | ---: | ---: |
| Models HTML | 1,027,736 B | 68,390 B |
| Workspace HTML | 930,385 B | 34,926 B |
| CommandMenu payload | ~53.7 KB React-island markup | 4,522 B native payload / 0 island props |
| Homepage reachable JS gzip | 89,844 B | 9,466 B |
| Global CSS gzip | 26,718 B | 21,349 B |

Final local/CI evidence included:

- `npm run verify:deploy` PASS;
- Astro check: 407 files, 0 errors / 0 warnings / 0 hints;
- `npm run build`: 452 pages;
- `npm run verify:payload` PASS;
- 74 reciprocal locale routes verified;
- overflow preflight PASS at 390 / 768 / 1440 px;
- `npm audit --offline`: 0 vulnerabilities;
- full Playwright matrix: **204/204 PASS**, Chromium 102 + WebKit 102, one worker, zero retries;
- WebKit Quick View regression repeated 5× after the final fix: 5/5 PASS;
- exact-head self-hosted CI completed `success`;
- exact-head Vercel Preview `READY`;
- PR #350 merged using expected-head locking;
- Vercel Production for merge commit `e11d443` reached `READY`, `aliasError=null`.

## 4. Timeline: where the task actually became difficult

### 4.1 The audit snapshot was already aging when implementation began

The implementation Agent was instructed to re-fetch live state rather than trust the audit as timeless truth. That mattered immediately.

During execution:

- PR #335, which the audit treated as active and isolated, had already merged independently;
- new runner/CI fixes landed on `main`;
- research/publication changes landed while browser acceptance was running;
- the implementation branch had to rebase more than once.

The first lesson is simple:

> A detailed audit is a plan and evidence snapshot, not a substitute for Phase 0 live reconciliation.

The correct response was not to redo the whole 95-branch audit. It was to refresh `main`, open PRs and overlapping files, then preserve only still-relevant findings.

### 4.2 False-green lint had to be fixed before optimization

The audit found that lint used `|| true` and `verify:deploy` did not genuinely enforce lint. Fixing the code before fixing that Gate would have left the optimization unverifiable.

A second lint problem appeared after fail-closed behavior was restored: ESLint was scanning generated snapshot/output material such as `.omc/visual-root-current`, producing false failures from generated JavaScript.

The correct repair was:

```text
make lint fail closed
+ define the correct source boundary
!= edit generated artifacts to satisfy lint
```

Negative self-tests were added so an intentional lint violation and an intentional UI assertion failure must both return nonzero. That prevents a future “green command that never rejects bad input” regression.

### 4.3 Performance work repeatedly tried to expose hidden functional coupling

The largest wins came from removing unnecessary global hydration and serialization:

- CommandMenu became a narrow/native surface;
- full model/workspace catalogs moved behind static/on-demand JSON boundaries;
- native Research Context / Compare Tray replaced global React cost where React was not required;
- feature CSS left the universal bundle;
- production-unreachable components were removed after reachability evidence.

But two tempting shortcuts were rejected because they changed semantics:

1. hiding the home research context simply to remove React;
2. clearing Compare Tray localStorage without synchronizing the mounted nanostore.

The final rule is:

> Performance acceptance requires **semantic equivalence**, not merely smaller bytes.

A payload budget that passes after deleting user-visible state behavior is a regression, not an optimization.

### 4.4 Dead-code deletion required reachability, not aesthetics

Twelve candidates looked obsolete, but deletion was based on production reachability across source imports/dynamic references, tests, scripts and current docs.

The final classification was that all 12 were production-dead. Tests/docs that existed only to preserve those retired production owners were updated or removed; historical references remained historical evidence.

The lesson:

```text
old-looking file
!= dead code

test-only/doc-only reference to a production component
!= production reachability
```

Delete only after the canonical runtime path is proven absent.

### 4.5 Static-first regressions appeared only after real browser execution

The deterministic suite was not enough. The full UI work exposed three user-visible static-first failures in sequence:

#### `/models/`

The page still had content with JavaScript disabled, but the SSR cards did not preserve a meaningful direct navigation path into model details.

#### `/papers/`

The paper catalog existed without JS, but the paper-model relationship matrix did not. The fix was a genuine SSR `<table>`, not a relaxed test.

#### `/workspace/`

The optimization temporarily left two H1 owners: a static Astro fallback and a React H1. Once hydration hid the static fallback, the visual audit could observe a hidden first H1 and fail the page.

The fix was to make the static page the single H1 owner instead of teaching the browser test to ignore the hidden duplicate.

These failures justify the current static-first rule:

> “Readable without JavaScript” means the core navigation/semantic surface remains useful, not merely that some text exists in the DOM.

### 4.6 A stale test was not a product failure

After the workspace H1 moved to the correct Astro owner, `humanReadableProductLanguage.test.ts` still expected the phrase `实验工作台` inside `ResearchWorkspace.tsx`.

Restoring that string to React would have reintroduced the duplicate ownership bug.

The correct response was:

```text
current product owner moved intentionally
-> test still checks retired owner
-> update the test to the new owner
```

This case is an example of a **stale structural assertion**, not permission to weaken the underlying “subject heading must remain concrete” invariant.

### 4.7 Port collision looked like a browser failure until ownership was checked

`preflight:ui` initially failed because port `4328` was already used by another independent worktree (`/private/tmp/basemodel-capability-nav`).

Nothing in the optimized page caused that failure.

The correct behavior was:

- do not kill an unrelated process/worktree;
- make the overflow preflight port configurable;
- rerun the same product checks on an isolated port.

This is why environment ownership belongs in failure classification.

### 4.8 The WebKit-only Quick View race was the most instructive bug

The full 204-case matrix passed all Chromium cases, then failed WebKit on paper-detail Quick View.

The observed symptom:

```text
button click succeeds
Global Quick View dialog exists
model data eventually loads
but dialog remains hidden on WebKit
```

The first hypothesis focused on the SSR marker / capture bridge transition. Strengthening the bridge alone did **not** fix the problem; five repeated WebKit attempts still failed.

Only after instrumenting the exact DOM/event timeline did the real sequence become clear:

```text
1. user clicks SSR-visible trigger
2. bridge stores pending model id
3. quickView store receives selected = gpt-4
4. GlobalModelQuickView is not yet hydrated / dialog ref not mounted
5. effect depending only on [selected] runs too early or cannot open dialog
6. hydration completes later
7. selected has not changed, so the effect does not rerun
8. model payload is present, but <dialog> remains closed forever
```

The decisive fix was to make dialog-open readiness depend on both state dimensions:

```text
[hydrated, selected]
```

The capture bridge remained idempotent and could call native `showModal()` when the dialog already existed, but the important root cause was **effect dependency ownership**, not “WebKit needs a longer timeout.”

This case produced several durable lessons:

- cross-island readiness is a product state, not merely test timing;
- instrument before making a second speculative patch;
- “data loaded but UI closed” can mean the state changed before the receiver became mount-ready;
- do not solve this by globally changing every island to `client:load`;
- repeat the exact browser regression several times after fixing a race;
- then rerun the entire owning matrix, not only the focused case.

### 4.9 Long Playwright execution was not a hang

The final matrix ran one worker across 204 cases and took about 6.8 minutes. Several WebKit geometry cases individually took around 10–16 seconds.

At one point the conversation appeared “stuck”. Process inspection showed:

- Playwright worker still existed;
- CPU activity continued;
- the static server was alive;
- output resumed when the heavy geometry case completed.

The correct diagnosis was “slow expected case”, not hang.

Future Agents should report progress at semantic checkpoints such as `102/102 Chromium`, `156/204`, or “currently in WebKit visual-closeout geometry” instead of repeatedly saying only that a process is still running.

### 4.10 Rebase timing mattered

A complete browser matrix was started before discovering that `origin/main` had advanced by ten commits. Once that was known, continuing the old-tree matrix had little acceptance value.

The better sequence is:

```text
checkpoint current implementation
-> refresh main
-> classify overlap
-> rebase/integrate
-> validate the exact post-integration tree
```

A local checkpoint commit was valuable because it protected the implementation before rebasing and made conflict recovery explicit.

The rebase produced one real conflict in `WebShopTrainingNote.astro`:

- upstream had added `ResearchTechnicalDisclosure`;
- optimization had added feature-owned CSS import.

Those changes were orthogonal, so both were preserved. Whole-file `ours`/`theirs` would have lost intended semantics.

### 4.11 There is also a stopping rule for chasing moving `main`

After the final exact-tree 204/204 run started, `main` advanced again through unrelated runner and MiniMax/publication changes.

At that point the Agent compared changed-file sets and found zero overlap with the optimization branch.

Rather than rebase yet again and invalidate a very expensive exact-tree run, the release recorded:

- accepted base SHA;
- later intervening main commits;
- zero changed-file overlap;
- PR mergeability.

This is a useful nuance:

> “Refresh main before merge” does not mean “invalidate expensive evidence for every unrelated commit.” Materiality must be inspected.

If shared runtime/config/policy/UI surfaces had overlapped, a new integration and new acceptance would have been required.

### 4.12 Vercel `READY` and application HTTP acceptance are different layers

The exact-head Preview reached `READY` and Vercel metadata pointed to the correct SHA. However, the project protects Preview with Vercel Authentication.

The available automation path behaved as follows:

```text
get_access_to_vercel_url -> share token generated
web_fetch_vercel_url -> SSO 302
plain curl -> SSO 302 / no-store
```

The project did not expose a `VERCEL_AUTOMATION_BYPASS_SECRET` to this workflow. Vercel documents `x-vercel-protection-bypass` as the normal automated path for protected Preview checks.

Therefore these application-response assertions were **not** marked PASS:

- `X-Content-Type-Options`;
- `Referrer-Policy`;
- `Permissions-Policy`;
- report-only CSP;
- `/model-data/*` cache-control.

They were still covered by repository tests/config and the exact-head build, but the real protected application response could not be reached from the available automation session.

The wrong responses would have been:

- disable Preview protection just to make the test green;
- treat the SSO 302 headers as application headers;
- install random tooling or invent credentials;
- report `READY` as proof of response-header acceptance.

The correct response was to record a **provider/access boundary** separately from application/build health.

### 4.13 Tool availability should not silently expand scope

Two dead ends occurred during hosted verification:

- local `vercel` CLI was not installed;
- `agent-browser` CLI was not installed in the Mac environment.

The task did not authorize installing new network packages just to bypass an already-understood provider protection boundary.

The Agent correctly stopped trying to turn a missing local tool into a new dependency-management task.

A smaller shell-level friction also appeared earlier: a heredoc command was sent through `fish` and failed parsing. Complex shell/heredoc work should explicitly use Bash when the script is written for Bash semantics.

## 5. Reasoning lessons

### 5.1 Fix truthfulness before speed

The implementation order mattered:

```text
Gate truthfulness / locale correctness / accessibility
-> serialization and hydration
-> CSS/dead code/test structure
-> exact-tree acceptance
```

If performance had been optimized before fixing false-green lint/UI gates, later green numbers would have had weaker meaning.

### 5.2 Never “win” a budget by deleting the contract

The CSS ceiling was tight: final gzip `21,349 B` against a `21,360 B` limit. The correct pressure response was to remove proven unreachable/feature-owned bytes, not raise the limit or hide required functionality.

### 5.3 Focused tests are diagnostic; full suites are ownership proof

A productive loop was:

```text
full suite finds failure
-> focused reproduction
-> instrument root cause
-> focused repeat several times
-> full owning suite from zero
```

The final WebKit race was accepted only after both 5× focused success and a fresh 204/204 matrix.

### 5.4 A worker report is not acceptance evidence

An implementation Worker was useful for Phase 1–3 edits, but it temporarily waited on delegated sub-roles without producing file changes. The parent workflow had to heartbeat it, reclaim execution when delegation stalled, inspect the diff and run independent acceptance.

The durable rule:

> Worker self-report can accelerate implementation; only repository/provider evidence closes the task.

### 5.5 Checkpoint before risky integration

Before rebasing a large dirty implementation, make a local checkpoint commit. This gives a recoverable semantic boundary without prematurely pushing or consuming a Preview.

### 5.6 Do not confuse invocation error with product failure

One combined local command called `assert:provider-headers` without its required base URL. It exited 2 and printed usage.

That was neither a header failure nor a build failure. The script contract requires a deployed base URL; the test belongs after Preview availability.

Failure classification should include **wrong invocation** as an operator/harness error.

### 5.7 Communicate long operations by state, not silence

The user explicitly asked “卡在哪里了 继续做” during long browser work. Future Agents should proactively report:

- which test family is running;
- last passed count;
- whether process CPU/output proves progress;
- the most recent real blocker found;
- whether the next action changes code or only continues validation.

This makes a seven-minute full matrix feel observable rather than abandoned.

## 6. Anti-patterns exposed by this conversation

Do not repeat these patterns:

1. Treat the audit's `main`/open-PR snapshot as current without a fresh Phase 0 read.
2. Continue an expensive old-tree browser matrix after discovering the acceptance base already moved materially.
3. Accept `|| true` lint or “full” browser Gates that do not actually launch known-critical tests.
4. Fix generated-file lint noise by editing generated output instead of correcting lint scope.
5. Remove hydration by removing browser-local product semantics.
6. Treat a static page as “no-JS safe” because text exists while primary navigation/relationships disappeared.
7. Restore duplicated runtime markup only to satisfy a stale source-string test.
8. Kill an unrelated dev server because a hard-coded port collided.
9. Raise payload/visual thresholds to avoid doing the real optimization.
10. Assume a WebKit-only failure is a timeout before instrumenting state/hydration timing.
11. Keep applying speculative race patches without recording event/store/dialog state.
12. Treat a Vercel Authentication 302 as the application's HTTP response.
13. Disable security protection merely to complete an automated check.
14. Install new CLI/dependencies ad hoc when the task can truthfully report the existing tool/access boundary.
15. Chase every unrelated `main` commit after an expensive exact-tree run without first checking material overlap.
16. Merge without expected-head locking after recording an accepted SHA.
17. Call the task done at merge time without watching the intended Production deployment reach a terminal state.

## 7. Rules promoted into current owners

This incident did not need a new permanent policy layer. Its durable rules are already owned by current documents:

- `current/website-engineering-standard.md`
  - static-first and narrow-island rendering;
  - first-click preservation across hydration;
  - failure classification;
  - Chromium/WebKit runner boundaries;
  - exact-tree acceptance;
  - provider-triggering write budget;
  - performance stopping rule.
- `current/rendering-and-performance-policy.md`
  - useful generated HTML;
  - safe URL/browser-state restoration;
  - native local-state adjuncts;
  - explicit structural/behavior test taxonomy;
  - payload/build-budget rules.
- `current/release-closeout-protocol.md`
  - material base movement;
  - retry is diagnostic, not acceptance;
  - expected-head merge locking;
  - Preview vs Production boundaries;
  - required Gate must execute, not merely exist.
- `current/ui-change-visual-acceptance-gate.md`
  - browser matrix and escaped-regression ownership.

Future changes should update those owners when behavior changes. This historical file should not become a competing current standard.

## 8. Recommended future Agent workflow for comparable tasks

### Phase A — establish the live baseline

1. Read current owners and the task-specific audit/handoff.
2. `git fetch` current `main`.
3. List open/recent PRs touching shared surfaces.
4. Record current base SHA and branch eligibility.
5. Reproduce still-relevant failures before editing.
6. Classify already-solved audit findings as closed rather than re-implementing them.

### Phase B — make correctness Gates truthful

1. Remove false-green wrappers.
2. Fix source/generated boundaries.
3. Add negative self-tests for changed verifier logic.
4. Fix route/locale/a11y/security contracts before byte shaving.
5. Keep thresholds unchanged unless a separate evidence-backed decision changes the contract.

### Phase C — optimize by semantic owner

1. Remove unnecessary hydration first.
2. Narrow serialized labels/DTOs.
3. Put bulk catalogs behind static/on-demand data routes.
4. Move feature CSS out of global reach.
5. Delete only reachability-proven dead code.
6. Re-test browser-local state, URL sharing, clear/update synchronization and first-click behavior.

### Phase D — browser diagnosis loop

For every red case:

```text
reproduce focused
-> classify product / stale test / harness / environment
-> instrument if timing/state is ambiguous
-> fix the owning layer
-> repeat focused case
-> rerun the full owning matrix
```

Use an isolated configurable port. Do not kill unrelated worktrees.

### Phase E — synchronize once before expensive final acceptance

1. Make a local checkpoint commit.
2. Refresh `main`.
3. Diff intervening commits and overlapping files.
4. Integrate material changes semantically.
5. Run deterministic + full browser acceptance on the exact post-integration tree.
6. If `main` later moves only through proven-independent files, record the boundary rather than automatically throwing away expensive evidence.

### Phase F — one provider-triggering Preview

1. Make the exact accepted head carry the required `[vercel-preview]` marker.
2. Push once.
3. Record deployment ID, URL and metadata SHA.
4. Require `READY`, not skipped/ignored.
5. Run application-layer hosted assertions only when the automation path actually passes Deployment Protection.
6. If protection blocks automated access, report that access boundary separately; never weaken protection to manufacture PASS.

### Phase G — merge and Production closeout

1. Refresh PR state immediately before merge.
2. Require head == accepted head and `mergeable=true`.
3. Check material base overlap.
4. Use `expected_head_sha` locking.
5. Record merge commit.
6. Watch the Production deployment for that merge commit.
7. Require `READY` / `aliasError=null` and inspect meaningful build logs.
8. Keep Preview, merge and Production as separate reported states.

## 9. Evidence ledger

```text
PR: https://github.com/mykcs/basemodel/pull/350
accepted implementation head:
  d4f86e0208440b684faaae146baa3ac18c2d8047
accepted implementation tree before final moving-main merge:
  a85bb7bec1a7db481026ade2f25d2eb9ecd562c6
PR merge commit:
  e11d443107442ec93cf697531b69c8aea6f925bf
merged main tree:
  f27107ec4785ff6a643442629e7919d3fb3986ef
exact-head Preview deployment:
  dpl_7nxUQQa3n4B57MM83YbxHRnAbTU2
Production deployment:
  dpl_6b8CRzsPSoSPJMBUtKU9FUKkumer
Production canonical URL:
  https://basemodel-preview.vercel.app
```

The accepted implementation tree and merged-main tree differ because `main` advanced through unrelated commits while the expensive exact-tree acceptance was running. The PR was confirmed mergeable and the intervening changed-file set was inspected for overlap before expected-head merge.

## 10. Final conclusion

The main technical lesson is not “remove React” or “delete old CSS”. It is:

> **Optimize only after the verification system is truthful, preserve semantic ownership while shrinking runtime cost, diagnose browser/provider failures at the correct layer, and attach acceptance to an exact tree rather than a conversational notion of “the branch”.**

The main process lesson is:

> **Long-running engineering work needs explicit checkpoints: live baseline, semantic implementation, focused diagnosis, exact-tree full acceptance, provider identity, locked merge and Production closeout.**

Following that sequence turned a broad 95-branch optimization audit into a large but controlled release without reviving stale branches, weakening quality thresholds, deleting current functionality, or hiding the one hosted-HTTP check that the available Vercel authentication path could not actually execute.
