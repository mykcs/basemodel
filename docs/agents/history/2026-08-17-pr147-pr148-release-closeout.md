# PR #147 / #148 exact-head visual closeout — 2026-08-17

Status: **historical case evidence**

This file records the release-closeout incident that turned a stale “one last browser command remains” report into a fully refreshed, exact-head, semantically integrated release. Current policy lives in `../current/release-closeout-protocol.md`, `../current/ui-change-visual-acceptance-gate.md`, `../current/multi-pr-semantic-integration-playbook.md`, and `../current/deployment-policy.md`.

## Context

PR #147 was the final visual-closeout branch for Base Model. A 2026-08-15 report correctly described one then-current head (`16c14ca...`) as having deterministic Gate/build success with `npm run test:ui` still outstanding.

That report later became stale because:

- #147 continued to receive commits;
- its changed surface expanded;
- PR #148 (the ZJU Lab update) landed on `main` first;
- #147 overlapped #148/current `main` in release infrastructure such as Vercel/browser-gate ownership.

The old report remained useful historical evidence, but it no longer authorized the changed PR head for merge.

## Refresh finding: the blocker was real browser geometry

After refreshing the actual #147 head and Vercel state, Chromium was no longer blocked by repository checkout access. The hosted browser Gate was running and reported a real geometry regression:

```text
connector crosses unrelated node: trajectory-grpo -> seed-skill
```

This matched the owner’s visual QA class of failures: connectors visually crossing boxes, detached arrows/labels, and short residual line stubs.

The important lesson was that the failure was **product geometry**, not an unavailable test environment.

## Corrective product fix

Commit:

```text
80064bd713d74285f711eddf95dc8a1200db2ff4
fix(ui): route GRPO connector around skill node
```

The `trajectory -> GRPO` edge was rerouted through a right-side exterior corridor and into the GRPO node from a real edge anchor. The implementation did not:

- hide the connector;
- add a per-edge ignore;
- loosen the 5px endpoint-drift threshold;
- permit unrelated-node crossing.

The existing browser contract remained authoritative.

## Second finding: the remaining desktop red state was harness time budget

After the crossing was removed, mobile/tablet geometry passed. Desktop cases then showed a different pattern: the substantive geometry checks no longer failed, but the full bilingual/stepwise browser walk sometimes exceeded Playwright’s default 30-second test timeout on the hosted 2-core builder.

Measured desktop work was approximately 31–33 seconds.

Commit:

```text
7ce7ba1f02e3b2c1721bd880f21bd304357f49b2
test(ui): allow full desktop geometry walk
```

The timeout moved from 30s to 45s. No geometry, crossing, overflow, clipping, contrast, theme, or reduced-motion acceptance threshold changed.

This separated two different red states correctly:

```text
real UI defect -> fix product geometry
harness execution budget too small -> adjust runtime allowance only
```

## Retry/flaky evidence mattered

During diagnosis, desktop cases sometimes passed after retry. The closeout did not treat “eventually green” as sufficient proof.

The accepted run was required to show the critical desktop cases passing on the first attempt after the timeout budget was corrected. This prevented Playwright retry from hiding a timing/geometry instability.

## #148 moved `main`: textual merge was not enough

PR #148 had already landed as:

```text
d784616b1d2a2cba5c6614478aa20c28e0e12cec
feat(lab): add verified ZJU server audit (#148)
```

#147 could therefore not be merged based only on its isolated worker-head evidence. The final tree had to preserve both:

- #147 visual/browser-closeout behavior;
- #148 ZJU Lab pages, privacy regression coverage, and focused Lab browser gate;
- current Vercel deployment/build-budget policy from `main`.

An intermediate semantic integration commit was constructed:

```text
214b558d99904c9efecdf38c58b967c05bb5d5ba
merge: preserve lab and visual browser gates
```

Static tests then correctly exposed a merge-resolution mistake: an older `vercel.json` policy outcome had been selected for a shared surface and violated the newer build-budget contract.

The fix was **not** to weaken the build-budget tests. Ownership was corrected so the current deployment policy remained authoritative while both branch-focused browser gates were retained.

Final closeout head:

```text
7be2351be2e2c7183208b66b25e95a289a210bd5
fix(hosting): preserve Vercel build budget after merge
```

## Final exact-head acceptance

The final combined head, already containing the #148 contribution, passed:

```text
npm run verify:deploy  PASS
npm run build          PASS
real Chromium UI gate 14 / 14 PASS
retry/flaky            0 / 0 for accepted critical cases
```

Coverage included:

- 390×844;
- 768×1024;
- 1440×1000;
- light and dark;
- connector endpoint geometry;
- unrelated-node crossing protection;
- overflow/clipping;
- contrast;
- reduced-motion behavior;
- light -> dark -> light transition safety.

The final accepted evidence belonged to `7be2351...`, not to the earlier `16c14ca...` report.

## Merge race check

Immediately before merge the closeout re-read live state and confirmed:

- PR head was still the accepted exact head;
- intended `main` base had not changed underneath the accepted tree;
- Vercel exact-head state was READY/success;
- the PR was mergeable;
- no unresolved review thread remained.

The merge was locked to the accepted head SHA so a late push could not be silently included.

Resulting merge commit:

```text
9272543ee125aab79786a810ff7ee5c84bbae60c
fix(ui): close visual QA regressions (#147)
```

## Production verification

After merge, Vercel Production built the merged `main` state successfully and representative changed routes returned normally, including the OpenEvo guide, SEED research page, and Lab.

The expensive visual-closeout and Lab browser-install scripts remained branch-focused and skipped on `main`, preserving the repository’s build-budget design rather than making every Production build download Chromium.

## What this incident changed conceptually

### 1. “PR passed” is too imprecise

The usable statement is:

```text
exact SHA X passed acceptance Y against base Z
```

Branch and PR names are moving pointers.

### 2. Old green evidence expires

A head move always requires refreshed evidence. A material base move requires semantic re-evaluation and usually validation of the combined tree.

### 3. A red Gate must be classified before editing

The same red CI surface can be caused by product behavior, contract mismatch, harness budget, or environment. Fix the right layer.

### 4. Runtime allowance and quality threshold are different

Giving a complete browser walk enough seconds is legitimate. Allowing a connector to miss its anchor or cross a node merely to get green is not.

### 5. Retry is not invisible

A final exit code of 0 can still conceal instability. Release evidence should disclose and investigate retry/flaky behavior on the affected critical cases.

### 6. Semantic merge requires policy ownership

When multiple PRs touch deployment config/tests/shared UI, identify the current owner of each invariant. Never resolve a shared config by arbitrary whole-file overwrite.

### 7. Validate the tree that will actually merge

Worker-head acceptance does not authorize a later integration tree. The final combined head needs its own task-relevant checks.

### 8. Close the race window

Re-read head/base/provider/review state immediately before merge and use expected-head locking where supported.

### 9. Production remains a separate boundary

Preview/browser success is necessary evidence for UI work; Production still needs its own build/SHA/public-route verification.

## Follow-up accepted for future hardening

The owner’s visual QA also called for an intermediate 1280px desktop-width check and explicit protection against step-chip layout shift. The 2026-08-17 release matrix used 390/768/1440 as the mandatory baseline. A later focused follow-up should add 1280 and stepper-geometry stability without replacing the existing widths.

That follow-up belongs in executable Playwright tests; subjective layout questions such as card whitespace balance, duplicate explanatory diagrams, and page-level visual hierarchy remain product-review concerns rather than pretending every aesthetic judgment can be reduced to a numeric Gate.