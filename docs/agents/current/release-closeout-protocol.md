# Exact-head release closeout protocol

Last reviewed: **2026-09-06**

Status: **current**
Audience: coding Agents, review Agents, integration Agents, release Agents

This protocol owns the final transition from “a branch looked good at some point” to “the exact code that was accepted is the code that was merged and verified in Production.” It complements `deployment-policy.md`, `multi-pr-semantic-integration-playbook.md`, and `ui-change-visual-acceptance-gate.md`; it does not replace their provider, semantic-integration, or UI-specific rules.

The historical cases that motivated these rules include `../history/2026-08-17-pr147-pr148-release-closeout.md`, `../history/2026-08-26-seed-results-attribution-and-agent-friction-retrospective.md`, and `../history/2026-09-02-official-external-brand-links-retrospective.md`.

## Core rule

> Acceptance evidence belongs to an exact commit tree, not to a PR number, branch name, Preview URL, or remembered report.

A previously valid report becomes historical evidence when the PR head changes or when the intended merge base changes materially.

## 0. Decide hosted-acceptance needs before creating the branch

Before the first branch/ref mutation, decide whether the task requires exact-head Vercel Preview acceptance. Then read `branch-and-pr-conventions.md` and executable `vercel.json` / `scripts/vercel-ignore-build.mjs` **before** choosing the prefix.

A `docs/**` branch can be correct for documentation-only work and still be the wrong release vehicle for a user-facing change that requires Preview. If no Preview appears, first classify branch eligibility and exact-head opt-in state; do not call Vercel unhealthy and do not create probe commits.

## 1. Resolve the acceptance identity first

Before deciding that a PR can merge, record:

```text
PR number
current head SHA
current intended base branch + base SHA
changed files / shared surfaces
provider deployment SHA
required Gate/browser evidence
```

If a report names an older head, do not “carry forward” its green result by assumption.

### Evidence invalidation rule

Re-evaluate acceptance when either of these changes:

- **head moved** — any new commit may change implementation or tests;
- **base moved materially** — another merge may change the same files, runtime assumptions, deployment policy, shared UI, data contracts, or generated output.

A base move that is provably docs-only and independent may not require every expensive browser test again, but the independence must be inspected rather than assumed.

## 2. Classify a red Gate before fixing it

A red build/test can represent different failure classes:

| Class | Example | Correct response |
|---|---|---|
| product/runtime failure | connector crosses an unrelated node | fix product/runtime behavior |
| contract failure | implementation violates a still-valid policy/test invariant | fix implementation; preserve invariant |
| test-harness failure | valid case exceeds an unrealistically small execution timeout | fix harness budget without changing quality threshold |
| environment failure | browser binary has missing shared libraries | repair/preflight environment, then rerun the same product checks |
| stale test/policy | executable/current truth proves the check itself is obsolete | update the owning contract with evidence |
| inherited base debt | candidate and exact base fail the same budget/check with the same relevant measurement | record base debt; do not blame/revert the candidate without a differential |

Do not treat every red result as permission to weaken the test.

### 2.1 Causal attribution requires an exact-base differential

When a surprising budget, performance, geometry, static-audit, or deterministic-test failure is not clearly owned by the changed diff, reproduce the **same check on the exact intended base SHA** before claiming the candidate caused it.

Use:

```text
candidate head + measurement/failure
vs
exact intended base + same measurement/failure
```

Interpretation:

- candidate fails, base passes -> candidate regression is plausible and must be investigated;
- candidate and base fail in the same relevant way/value -> inherited base debt until a candidate delta is demonstrated;
- both fail but candidate is measurably worse -> separate inherited debt from candidate regression;
- environmental conditions differ -> the A/B is not valid yet; normalize the environment first.

Do not raise a threshold or remove unrelated candidate work merely because the first observed red result happened on the branch. A failing state is not yet a causal attribution.

Historical example: during the 2026-09-02 official external-brand-link work, a CSS payload budget looked like a feature regression until the same exact-base check reproduced the same value on `main`.

## 3. Execution budget is not acceptance tolerance

Resource/time allowances may be changed when measurement shows the harness needs more room. Product-quality thresholds must remain unchanged unless a separate evidence-backed contract decision says otherwise.

Allowed example:

```text
Playwright case timeout: 30s -> 45s
because the same unchanged desktop geometry walk measures ~31–33s on the 2-core hosted builder.
```

Not allowed merely to get green:

```text
connector anchor tolerance: 5px -> 20px
ignore a known crossing edge
skip a failing viewport/theme
turn a required browser assertion into a warning
```

When changing a harness budget, state explicitly which semantic thresholds did **not** change.

## 4. Retry is diagnostic evidence, not acceptance quality

A command can exit 0 while still hiding instability behind retries.

For release-closeout work:

- inspect retry/flaky output, not only the final exit code;
- a newly introduced deterministic regression that passes only on retry is not closed;
- investigate whether the instability comes from product geometry/state, font/hydration timing, the test harness, or provider load;
- prefer a final exact-head run where the affected critical cases pass on the first attempt.

Repository-level retry configuration may remain useful for diagnostics, but a release report must disclose retries/flakes that occurred in the accepted run.

## 5. Preserve semantic owners when `main` moved

When another PR lands before closeout, do not resolve overlaps with a blind whole-file `ours` / `theirs` choice.

For each overlapping shared surface, record:

```text
current policy/implementation owner
contribution from this PR
contribution already present on main
final combined invariant
```

Typical shared surfaces include:

- `vercel.json` and deployment/build-budget contracts;
- package/test commands;
- global CSS/theme/layout primitives;
- shared browser gates;
- research/evidence semantics;
- generated/discovery surfaces.

Build the final combined tree first, then validate **that tree**. A clean textual merge is not combined-product acceptance.

When resolving a **rebase**, remember that `ours` / `theirs` labels do not mean what many operators expect from an ordinary merge: the stage roles are relative to the rebase operation. Do not use the label as semantic authority. Inspect the actual blobs/commits, or materialize the required base explicitly (for example `git show origin/main:path`) and transplant the intended contribution. If an automated conflict-resolution script aborts, verify `git status` and file contents before `git add` / `rebase --continue`; a failed patch attempt is not evidence that the conflict was resolved.

### 5.1 Research/provenance overlaps: newest authority first, feature contribution second

A UI-only or infrastructure branch can still contain stale copies of research text. When a conflict touches experiment status, artifact roots, checkpoint identity, provenance labels, result interpretation, or other scientific publication facts, treat conflict resolution as a publication-integrity boundary.

Default order:

```text
current user instruction
> current scientific authority / executable evidence
> newest main/current publication truth
> this PR's intended UI/engineering contribution
> historical branch wording
```

Operationally:

1. start from the newest authoritative semantic content rather than the feature branch's older whole-file copy;
2. transplant only the intended UI/engineering behavior around that content;
3. do not resurrect stale labels, artifact paths, experiment states, or interpretations merely because they coexist with correct feature code;
4. after resolving conflicts, review the semantic diff against current `main`/authority before expensive acceptance;
5. if the task itself intends to change scientific narrative, require fresh scientific authority rather than treating the merge conflict as permission to do so.

This rule is stronger than “the file merged cleanly.” A compile-green tree can still publish stale science.

## 6. Validate the final combined head

Run the repository-owned deterministic release checks on the final head:

```bash
npm run verify:deploy
npm run build
```

Then run every task-triggered acceptance layer required by current policy, for example:

```bash
npm run test:ui
npm run test:ui:all
```

Acceptance evidence must point to the same final SHA that will be merged.

For UI work, report at least:

```text
viewports/themes/locales actually exercised
geometry/overflow/contrast/state coverage
retry/flaky count
provider exact-head state
```

A READY deployment badge proves provider completion, not product acceptance.

### Required CI queue / long-browser diagnosis

A required self-hosted check that is `queued` or spends many minutes in browser acceptance is not automatically stuck. Before canceling/restarting:

1. read live workflow/job state and branch protection to confirm which check is actually required;
2. inspect whether the sole runner is legitimately occupied by `main` or another earlier job; do not cancel unrelated valid work merely to move the current PR forward;
3. once the job is running, distinguish progress from hang using job steps and runner process evidence (active Playwright/browser processes, changing renderer/test activity, CPU use);
4. treat that process evidence as diagnosis only — the required GitHub check must still reach SUCCESS before merge;
5. cancel only obsolete runs that belong to a superseded head of the same work and are safe to discard.

Do not merge around a required check merely because local and Preview evidence are already green.

### 6.1 Prove the required Gate actually executed

A successful shell command, build step, or provider deployment is not sufficient evidence that a **conditional** acceptance gate ran. A gate may return success after printing `skipped`, `ignored`, `not eligible`, or an equivalent branch-policy outcome.

For every gate the acceptance contract says **must execute**, verify the execution chain in logs:

```text
expected gate start marker
-> current branch/ref matched the execution condition
-> expected test file(s) / test count actually launched
-> assertions completed
-> explicit PASS / zero failures
```

If the log says the gate was skipped, classify that separately:

- if skip is the current designed cost/policy boundary, record it as **SKIPPED BY POLICY**, not PASS;
- if the acceptance requirement says the gate must run on this ref (for example, a Production `main` gate), the skip is a release blocker and the branch/allowlist/wiring condition must be fixed;
- do not change the test threshold merely because the gate was previously unreachable.

The 2026-08-26 Results closeout exposed exactly this failure mode: `vercel-ui-gate` completed 91/91 while `vercel-lab-browser-gate` still printed `skipped for branch: main`. The release was not accepted until the gate condition was corrected and the focused lab suite actually launched and passed.

This is the same ownership principle as escaped-regression wiring: **a test that exists, or a command that exits 0, is not durable protection unless the intended release path executes it.**

### 6.2 Provider success must represent the required execution

A successful GitHub status context is not sufficient when the provider can report success for an ignored/skipped deployment. Read the owning provider object and classify its actual state.

For BaseModel Vercel Preview acceptance:

```text
GitHub context = success
AND deployment metadata points to the exact accepted SHA
AND provider readyState/state = READY
AND the required build path actually executed
```

`CANCELED`, ignored build, or policy skip is **SKIPPED BY POLICY**, not a product Preview PASS. This remains true when the outer GitHub `Vercel` context is green.

`scripts/vercel-ignore-build.mjs` evaluates both the exact-head `[vercel-preview]` opt-in and the deploy-relevant changed range. A zero-content release-marker commit can therefore carry the token while still producing an ignored deployment because `previous -> head` contains no deploy-relevant path. When hosted Preview acceptance is required, the exact head that carries `[vercel-preview]` must also contain (or otherwise prove in its evaluated range) the deploy-relevant candidate change.

Do not add provider exceptions to compensate for a release-topology mistake. Fix the candidate topology so the provider sees the intended product diff and the intended opt-in on the same acceptance identity.

### 6.3 Keep one live candidate through independent base drift

Moving `main` is normal shared-state behavior; repeated new PRs are not the default freshness mechanism.

Before an expensive final Gate:

1. inspect open/recent PRs that are likely to merge into the same base and choose a reasonably stable acceptance window;
2. keep one live candidate PR for one semantic root fix;
3. when `main` advances, compare the intervening paths/contracts with the candidate's semantic diff;
4. for provably independent drift, update/synchronize the same candidate branch when repository policy requires current-base freshness, preserving the semantic contribution;
5. rerun the checks required by the **current** branch-protection/provider contract, plus any checks affected by overlap;
6. create a successor PR only when the semantic scope, release routing, authority owner, or acceptance topology actually changes.

A current-base refresh may change ancestry without changing the semantic fix. Keep those claims separate. Do not manufacture a chain of `#N -> #N+1 -> #N+2` successors solely because unrelated documentation merged while CI was running.

Historical worked case: [`../history/2026-09-07-root-cause-owner-convergence-and-release-topology-retrospective.md`](../history/2026-09-07-root-cause-owner-convergence-and-release-topology-retrospective.md).

### 6.4 Source exports are not Git worktrees

A downloaded/copied source tree may be useful for bounded testing without containing `.git`. Label it `source export`; do not report it as a clean exact-head checkout when `git rev-parse` fails. Preserve its known base plus an explicit changed-file inventory and content hashes. Do not fabricate or repair Git metadata to make the label true.

To publish an accepted export, use a healthy isolated worktree or an atomic Git-data update based on the verified remote base. Read back every changed blob and the final commit/tree; validate the final combined candidate under the current checks. A prior test of a different export/base is historical evidence, not an exact-head receipt. Never overlay generated output, dependency symlinks, or an older whole repository onto newer main.

## 7. Race-check immediately before merge

Right before merge, re-read live state and require all applicable conditions to still match the accepted evidence:

```text
PR head == accepted exact head
intended base has not moved materially since final validation
provider status == success/READY for accepted head
PR is mergeable
required review threads are resolved
required Gate/browser evidence is still the accepted run
```

If head or material base state changed, stop and refresh acceptance instead of merging from memory.

### 7.1 Explicit acceptance rules are merge-authorization boundaries

A PR can be mergeable and all currently required checks can be green while the work is still **not authorized to merge**. This is especially common for CI/performance experiments whose PR body pre-registers a later steady-state benchmark, control, canary, or repeat requirement.

Rules:

1. Treat an explicit acceptance rule in the task/PR as part of merge authority, not as optional prose. If it says "do not merge until candidate + control", a green qualification run only proves correctness of the candidate implementation.
2. For performance experiments, keep the implementation PR non-authoritative while measurement remains incomplete. When non-draft state is required to trigger qualification CI, it is acceptable to mark the PR Ready for that run and then return it to Draft while benchmark/control work proceeds; mark it Ready for merge only after the pre-registered acceptance rule is satisfied.
3. Benchmark-only PRs are measurement harnesses and must never merge. Close them after recording the receipt.
4. In multi-Agent work, re-read the PR body, head/base, draft state, benchmark/control PRs, and current `main` immediately before merge. Another Agent's push, close/reopen, or merge can invalidate the earlier plan.
5. If a candidate is merged before its own acceptance boundary completes, preserve that historical fact. Do not silently reinterpret the merge as evidence that the criterion passed. Finish post-merge validation and, when the criterion is not met, repair or revert only the candidate-owned surfaces while preserving later independent `main` work.

Counterexample: a CI-infrastructure PR can pass deterministic + both browser shards because those jobs are **qualification** runs, while the PR's stated question is whether ordinary post-merge full-browser work becomes faster. Merging from the green qualification alone answers the wrong question.

## 8. Lock the merge to the accepted head

When the merge interface supports an expected-head SHA, use it.

Conceptually:

```text
merge(PR, expected_head_sha = accepted_head)
```

This prevents an unreviewed push between the final check and merge from being included accidentally.

If the provider/tool does not support expected-head locking, re-fetch the head immediately before the merge mutation and fail closed on mismatch.

## 9. Production is a separate acceptance boundary

After merge:

```text
accepted PR head
-> merge commit on main
-> Vercel Production build
-> Production route/metadata/interaction verification
```

Verify:

- Production built the intended merge/main SHA;
- normal Production Gate/build succeeded;
- conditional browser gates either execute or skip exactly according to the **current designed boundary**; any gate explicitly required on `main` must actually execute and may not be counted as passed when skipped;
- representative changed routes return and render successfully;
- canonical/hreflang/robots/sitemap/discovery are checked when the change can affect them.

Preview acceptance is not Production acceptance.

A generated deployment URL identifies that deployment; it does not become the latest website when a later commit ships. Verify the stable Production alias and its backing deployment/SHA before sending the owner a “latest site” link. Preserve old URLs as historical references only. Temporary protected-Preview share credentials stay in the ephemeral review surface, never in Git or a retrospective.



### 9.1 Keep three release identities separate

A research publication closeout normally has three independent identities:

scientific evidence/archive identity
  != website source/merge commit
  != provider deployment identity

Record all three when they exist. A field such as an experiment archive head, an immutable model/archive revision, a Git merge SHA, or a Vercel deployment ID belongs to its own system and must be labeled with that system. Never replace one with another because they are all hexadecimal strings, and never infer that a website commit proves the scientific archive bytes were restored.

For a PR whose exact-head acceptance predates a moving main:

1. compare the accepted head with the current base by changed file and shared contract;
2. classify intervening commits as overlapping, provider-policy-affecting, or provably independent;
3. preserve old exact-head evidence only within its original scope;
4. if changed surfaces are independent, let the merged main Production deployment close combined-tree acceptance;
5. if they overlap or alter acceptance machinery, rerun affected checks on the combined tree before release.

A successful pre-merge run named “tested merge candidate” is evidence about the tree it actually checked, not a timeless certificate for every later base. A post-merge READY deployment is provider completion; it still needs representative Production route and metadata verification under Section 9.

### 9.2 Scientific archive identity and freshness boundary

A research publication may need three independent ledgers:

```text
scientific evidence/archive identity
  != website source/merge identity
  != provider deployment identity
```

When a page publishes a scientific archive, the data projection must pin the archive by role (for example component store, full lineage, and parameter analysis), revision, and—where applicable—content hash. A single field such as `archiveHead` is not sufficient when it hides which object was identified.

Before calling an archive current or verified:

1. read the object-owning scientific repository and its governance receipt;
2. label private/restricted access explicitly;
3. distinguish prior remote verification from a new fresh-read;
4. treat a tool-parameter error, unavailable private artifact, or incomplete read as unresolved—not as PASS;
5. expose the exact evidence commit/path that supports the projection.

Do not replace an immutable scientific archive revision with a website commit, Vercel deployment ID, PR number, or a plausible-looking hexadecimal string. A successful website build proves the public projection rendered; it does not prove that private scientific bytes were freshly re-read.

## 10. Completion report contract

A release-closeout report should contain:

```text
original report/head, if stale:
final accepted head:
current base used for acceptance:
real blockers found after refresh:
product fixes:
harness/environment fixes:
semantic overlaps resolved:
verify:deploy:
build:
browser matrix:
required gates actually executed / policy-skipped:
retry/flaky count:
provider exact-head state:
race check:
merge method + merge commit:
Production deployment/state:
Production routes/metadata checked:
remaining subjective or non-blocking items:
```

Do not collapse these stages into “CI green” or “merged successfully.”

## 11. Durable anti-patterns

- authorizing a new head with an old green report;
- equating `mergeable` with semantically compatible;
- changing quality thresholds to make CI green;
- blaming a candidate for a red budget/test without checking the exact base when inherited debt is plausible;
- accepting critical UI cases only because retry eventually passed;
- counting a required gate as PASS when it only skipped/ignored;
- resolving shared config by whole-file overwrite without identifying the current owner;
- resolving research/provenance conflicts by restoring an older branch's whole-file narrative around correct UI code;
- validating a worker head, then merging a different combined tree;
- checking Preview but not Production;
- letting the owner become the first person to discover predictable browser regressions.

## 12. Provider eligibility is part of failure classification

“No Preview exists” is not enough evidence to call the provider unhealthy.

Before diagnosing a Vercel outage or integration failure, inspect:

```text
is this branch/ref eligible under vercel.json git.deploymentEnabled?
did Vercel create a deployment object for the exact SHA?
was the deployment READY / ERROR / CANCELED / ignored?
is the GitHub status callback describing a real deployment or only provider status state?
```

A branch intentionally excluded by deployment policy is a **policy outcome**, not a provider outage. If exact-head hosted acceptance is required, use a ref/deployment path allowed by the current repository policy rather than misclassifying the absence of a Preview as flakiness.

Do not create no-op commits/ref mutations merely to probe whether Git integration will “wake up”. Shared repository state is not a provider-discovery scratchpad; use provider/repository reads first.

## 13. Escaped regressions must be permanently wired, not merely tested once

When a defect escaped to Preview, Production, owner inspection, or external QA, closeout requires more than adding a dedicated spec file.

Verify the full ownership chain:

```text
regression specimen exists
-> canonical focused/full commands actually run it
-> preflight/escaped-regression registry records the failure class when the repository uses one
-> static wiring coverage prevents silent removal
-> exact-head and exact-main acceptance both exercise the intended Gate
```

A test that exists but is absent from the normal owning Gate is historical evidence, not durable protection.

When a later failure appears after the product defect is fixed, classify it independently. A stale assertion caused by an intentional UI/content rewrite is not evidence that the original product bug returned.

## 14. Subjective historical issues require current-Production reproduction

Old screenshots and visual-polish notes become hypotheses after substantial UI or information-architecture changes.

Before changing CSS to close a historical subjective issue, record:

```text
old claim
-> current Production route + viewport + theme + locale
-> still present / resolved / transformed
-> current product impact
-> smallest coherent fix, only if still present
```

It is valid to close a historical umbrella issue as completed when current Production no longer reproduces the candidates and current executable UI contracts remain green. Do not invent speculative CSS merely to create a fresh patch. State any subjective/manual-inspection boundary separately from automated browser evidence.

Historical rationale: `../history/2026-08-26-results-release-node-runtime-retrospective.md`.

## Ownership

- provider/build budget: `deployment-policy.md`;
- multi-PR semantic ownership: `multi-pr-semantic-integration-playbook.md`;
- UI browser matrix/quality thresholds: `ui-change-visual-acceptance-gate.md` + executable Playwright tests;
- just-in-time trigger routing: `scenario-trigger-registry.md`;
- Results reader hierarchy / technical-depth placement: `seed-openevo-results-reader-contract.md`;
- this file: final exact-head acceptance, base-vs-candidate attribution at closeout, research/provenance conflict preservation, required-gate execution proof, race-check, merge lock, and Preview -> Production closeout.

When another closeout incident reveals a reusable rule, update the best existing owner and keep the incident-specific evidence under `docs/agents/history/`.
