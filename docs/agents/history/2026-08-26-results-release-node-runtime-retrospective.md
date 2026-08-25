# Results release closeout and Node runtime retrospective

Date: **2026-08-26**

Status: **historical incident / reusable lessons**

This document records the concrete release/debugging sequence around the SEED × OpenEvo Results page, the 390px Production overflow escape, stale UI-test drift, Vercel branch deployment policy, Issue #152 visual-polish closeout, and the Node runtime warning that was removed in PR #251.

Current policy remains owned by:

- `../current/release-closeout-protocol.md`
- `../current/deployment-policy.md`
- `../current/ui-change-visual-acceptance-gate.md`

This file is evidence and rationale, not a second policy checklist.

## Executive summary

The useful lesson from this sequence is not simply “fix the CSS” or “pin Node.” The larger pattern was:

```text
current Production symptom
-> classify the failure correctly
-> identify the real semantic owner
-> fix product/runtime or fix stale contract, but do not blur the two
-> add the escaped regression to the permanent owning Gate
-> validate one exact Preview head
-> merge with the accepted head locked
-> validate the exact new main SHA in Production
-> close only what current evidence actually proves
```

Several mistakes would have been easy here:

- blaming Vercel when a branch was intentionally deployment-disabled;
- treating a post-fix stale assertion as proof that the original layout bug remained;
- adding a dedicated regression spec but forgetting to wire it into `test:ui` / `test:ui:all`;
- reusing a green deployment from an older head;
- changing CSS for a subjective historical issue that no longer reproduced on current Production;
- fixing the Node warning by choosing a range that still permits an unintended future major.

The successful closeout came from separating those failure classes instead of compressing them into “CI is red” or “Vercel is flaky.”

## Incident chain

### 1. Results reader rewrite changed both content and geometry

PR #247 rewrote the Results landing into a reader-first findings page. That was intentional product work, but it changed headings, progressive-disclosure structure, and layout geometry.

After merge, a real mobile regression escaped to Production:

```text
route: /en/research/seed-openevo/results/
viewport: 390px
document width: 404px
viewport width: 390px
```

This was a product/layout defect, not a test artifact.

### 2. PR #248 fixed the actual 390px product bug

The product fix added shrink/wrap behavior for the affected Results question/status layout and introduced:

`tests/e2e/results-mobile-overflow.spec.ts`

The regression test deliberately rejects masking fixes such as global `overflow-x: hidden/clip`; the page must actually fit the viewport.

PR #248 merged as:

`721d16fc2b04ee6798b507829e5d4daaa8f2d6bf`

### 3. “No Preview” was branch policy, not a Vercel outage

The initial #248 branch used a ref class that `vercel.json -> git.deploymentEnabled` did not deploy.

The important diagnostic distinction was:

```text
no deployment object created because branch is excluded by policy
!=
provider integration outage
```

Before calling a provider unstable, inspect both:

- repository deployment policy (`vercel.json`);
- live provider deployment records for the exact ref/SHA.

A missing Preview can be the expected result of branch policy.

### 4. Production then exposed stale test drift, not overflow recurrence

After the layout fix, the Production overflow preflight passed, but `open-evo-webshop-program-report.spec.ts` still asserted pre-#247 headings and visibility assumptions.

That failure belonged to a different class:

```text
original failure: real product overflow
later failure: deterministic stale test contract
```

The correct action was not to touch the already-fixed CSS. The test needed to reflect the new product semantics, including the native `<details>` progressive-disclosure behavior.

### 5. PR #250 closed the contract drift and made the regression durable

PR #250 updated Results assertions so tests interact with the real disclosure UI before checking hidden evidence.

More importantly, it found a structural Gate gap: the new `results-mobile-overflow.spec.ts` existed, but it was not yet part of the ordinary full hosted Chromium commands.

PR #250 therefore did three things:

1. fixed stale assertions;
2. added `results-mobile-overflow.spec.ts` to both `test:ui` and `test:ui:all`;
3. registered the escaped failure class in `scripts/preflight-ui.ts` so `src/lib/preVercelUiGate.test.ts` protects the wiring.

This changed the rule from “we have a regression test somewhere” to “the historical escaped failure is permanently in the canonical Gate.”

Accepted PR head:

`b63243e45d62e4de0b1529c3fa0650a5cf69ab22`

Merged main:

`2b4cf5135a3e9e2c9f441d0a84893877d00d5c4b`

Exact-head Preview and exact-main Production both reached:

```text
ui-overflow-preflight: PASS
hosted Chromium: 91 / 91 PASS
vercel-ui-gate: PASS
deployment: READY
```

The separate Lab browser Gate was explicitly skipped by branch policy and was reported as skipped rather than represented as run.

### 6. Issue #152 demonstrated how to close a subjective historical backlog

Issue #152 contained visual-polish candidates originally reported against an older product shape. Its own protocol required current-Production reproduction before changing CSS.

By the time of this closeout, later merged work had already resolved or structurally transformed most candidates:

- homepage model-catalog composition;
- Lab/public-server layout;
- canonical figure ownership and duplicate explanatory sections;
- CJK containment;
- responsive explainer geometry;
- navigation/chrome invariants;
- step-chip stability;
- representative viewport/theme safety.

The correct action was **not** to invent new CSS solely so the issue could be said to have a fresh patch. The current Production tree was audited against the historical candidates, the existing browser contracts were rerun, and the issue was closed as completed with explicit evidence boundaries.

Reusable principle:

> A subjective historical issue may be closed because the current product no longer reproduces it, but only if that conclusion is based on current Production evidence and the report says what was and was not visually inspected.

### 7. PR #251 removed the open-ended Node major warning

Vercel emitted:

```text
Detected "engines": { "node": ">=22.12.0" }
that will automatically upgrade when a new major Node.js Version is released.
```

The repository allowed every future major even though the Vercel project was already configured for Node 24.x.

The correct fix was therefore not “pick any compatible minimum.” It was to make the repository runtime contract match the intended deployed major:

```json
{
  "engines": {
    "node": "24.x"
  }
}
```

PR #251 also added a deterministic Node runtime policy test so future major movement requires an intentional source change.

Accepted Preview head:

`5d8f97b065985691046956e916732ab88d5c0ea8`

Merged main:

`6ab0ec048c9b9137518d5caee24d33b70030c0d8`

Production deployment:

`dpl_7bL62mQkjj7svz49bqrG6vpy98Yp`

Final Production evidence:

```text
Node auto-major warning: absent
verify:deploy: PASS
435 pages built
ui-overflow-preflight: PASS
hosted Chromium: 91 / 91 PASS
vercel-ui-gate: PASS
Vercel deployment: READY
GitHub Vercel status: success
```

Again, the Lab browser Gate was skipped by its existing branch policy and was not counted as executed.

## Reusable lessons

### Failure class comes before the fix

Use the first failing evidence to decide whether the owner is:

- product/runtime;
- still-valid contract;
- stale contract/test;
- test harness;
- deployment policy;
- provider environment;
- subjective historical backlog.

Do not modify the product to satisfy a stale test, and do not weaken a valid test to hide a product defect.

### Provider diagnosis must include branch eligibility

A GitHub status, missing Preview, ignored deployment, and provider outage are different states.

Before saying “Vercel failed,” answer:

```text
Was this ref eligible to deploy?
Was a deployment object created?
Which exact SHA did it build?
Did it reach READY/ERROR/CANCELED/ignored?
```

### An escaped regression is not durable until it is wired

A standalone test file is insufficient.

For a Production escape, verify all of the following:

```text
regression specimen exists
-> canonical test command runs it
-> broader/full command also runs it when appropriate
-> preflight/registry remembers the failure class
-> a static wiring test prevents silent removal
```

### Progressive disclosure should be tested as UI, not as hidden text

When content moves under native `<details>`, tests should assert the default collapsed state, activate the `<summary>`, verify the disclosure opened, and only then assert the evidence content is visible.

This preserves both semantics and accessibility behavior instead of forcing hidden material visible merely for a test.

### Exact-head evidence expires when the tree changes

Do not authorize a new head with an older READY deployment.

The minimum identity is:

```text
PR/head SHA
base SHA when material
provider deployment SHA
required Gate result
```

After merge, Production is a new acceptance boundary because squash/rebase/merge creates a different main tree identity.

### Final Production closeout should use multiple independent signals

For this incident, “done” meant all of the following on the exact new main SHA:

```text
intended main SHA confirmed
Production target confirmed
build logs show the expected fix behavior
preflight passes
full hosted browser matrix passes
owning gate prints PASS
deployment reaches READY
GitHub provider status reaches success
known skipped Gates are disclosed
```

No single READY badge replaces the rest.

### Subjective visual polish requires present-tense evidence

Old screenshots are hypotheses after major UI rewrites.

Use:

```text
old claim
-> current Production route / viewport / theme / locale
-> still present / resolved / transformed
-> product impact
-> smallest coherent fix if still present
```

Do not generate speculative CSS simply to create activity on an old issue.

### Runtime version warnings should be treated as contract drift

For Vercel Node:

- inspect the project runtime major;
- inspect `package.json -> engines.node`;
- prefer an intentional major-bounded contract such as `24.x` when that matches the deployed policy;
- do not use an open-ended `>=...` range when automatic future-major adoption is not intended;
- add deterministic policy coverage so future upgrades are explicit.

If lockfile root metadata also records the package engine, keep that metadata synchronized during the next lockfile regeneration/change. The runtime authority is still the repository manifest/provider contract, but contradictory metadata creates avoidable ambiguity for future Agents.

## What should not be copied forward

Do not copy incident-specific SHAs, deployment IDs, headings, or Issue numbers into current operating logic.

What should survive is the reasoning pattern:

```text
reproduce current truth
-> classify
-> fix the owning layer
-> encode the escape in the permanent Gate
-> accept an exact head
-> merge-lock that head
-> independently accept exact main Production
-> state skipped/unverified boundaries precisely
```

## Related artifacts

- PR #247 — Results reader-first rewrite
- PR #248 — real Results mobile overflow fix
- PR #250 — stale Results test drift + permanent overflow Gate wiring
- Issue #152 — historical visual-polish follow-up, closed after current-Production audit
- PR #251 — Node 24 runtime contract / Vercel warning removal

Current owners:

- `../current/release-closeout-protocol.md`
- `../current/deployment-policy.md`
- `../current/ui-change-visual-acceptance-gate.md`
- `../LATEST.md`
