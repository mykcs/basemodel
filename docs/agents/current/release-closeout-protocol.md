# Exact-head release closeout protocol

Last reviewed: **2026-08-26**

Status: **current**
Audience: coding Agents, review Agents, integration Agents, release Agents

This protocol owns the final transition from “a branch looked good at some point” to “the exact code that was accepted is the code that was merged and verified in Production.” It complements `deployment-policy.md`, `multi-pr-semantic-integration-playbook.md`, and `ui-change-visual-acceptance-gate.md`; it does not replace their provider, semantic-integration, or UI-specific rules.

The historical case that motivated these rules is `../history/2026-08-17-pr147-pr148-release-closeout.md`.

## Core rule

> Acceptance evidence belongs to an exact commit tree, not to a PR number, branch name, Preview URL, or remembered report.

A previously valid report becomes historical evidence when the PR head changes or when the intended merge base changes materially.

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

Do not treat every red result as permission to weaken the test.

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
- branch-only expensive browser gates skip on `main` when that is the designed cost boundary;
- representative changed routes return and render successfully;
- canonical/hreflang/robots/sitemap/discovery are checked when the change can affect them.

Preview acceptance is not Production acceptance.

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
- accepting critical UI cases only because retry eventually passed;
- resolving shared config by whole-file overwrite without identifying the current owner;
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
- this file: final exact-head acceptance, race-check, merge lock, and Preview -> Production closeout.

When another closeout incident reveals a reusable rule, update the best existing owner and keep the incident-specific evidence under `docs/agents/history/`.
