# Website engineering standard

Status: **current cross-cutting implementation standard**  
Decision date: **2026-08-22**  
Audience: coding, frontend, refactor, performance, browser-test and release Agents

## Purpose

Use this document as the default engineering posture for ordinary Base Model website work. It summarizes durable decisions; detailed CSS, rendering, browser, deployment and release rules remain with their existing owner documents.

Default shape:

```text
preserve accepted architecture
-> identify a concrete failure or measurable opportunity
-> change the smallest semantic owner
-> verify the exact changed behavior/tree
-> release and verify Production
-> stop when the requested problem is closed
```

Do not create another optimization phase merely because further cleanup is theoretically possible.

## 1. Accepted stack is a baseline, not migration debt

The ordinary stack is:

```text
Astro static output
+ focused React islands
+ TypeScript
+ native CSS / CSS variables / design tokens
+ Vitest
+ Playwright
+ Vercel Preview + Production
```

- Preserve Astro + React unless a concrete product/runtime requirement makes the current model insufficient.
- Preserve native CSS and the current token + semantic-owner model.
- Do **not** start a site-wide Tailwind, CSS-in-JS, framework, SSR or hosting rewrite merely because another stack appears newer or tidier.
- A future Tailwind experiment requires measured evidence that native CSS ownership is the cause of a real problem, and starts as a bounded pilot. It does not begin as a whole-site migration.
- Keep `tokens.css` as design truth unless an explicit architecture decision replaces it.

Detailed owners: `css-architecture.md`, `rendering-and-performance-policy.md`.

## 2. Prefer semantic ownership over override accumulation

- Page-wide CSS enters through `src/styles/app.css`; do not create another global composition root.
- Shared tokens belong in `src/styles/tokens.css`.
- Shared Header/shell behavior belongs to established semantic owners under `src/styles/components/`.
- Feature styles stay with their feature unless global reach is genuinely required.
- Heading ownership follows component ownership: the page root owns the single `<h1>`; embeddable components use lower ranks or an explicit heading-level prop. `npm run build` audits generated static HTML so duplicate page-level headings fail before deployment.
- Do not add new global files whose purpose is effectively “fix”, “final”, “hardening”, “closeout” or “refinement”.
- Do not increase specificity or add `!important` as the default cascade strategy; repair ownership first.
- Do not use HTML `hidden` as an implementation flag for content that is still intentionally visible. A visible preview/locked state needs its own state attribute/class plus keyboard/ARIA behavior; reserve `hidden` for content that should not be presented.
- Do not mass-delete old CSS because it is old. Retire compatibility copies property-by-property after the canonical owner is browser-proven.
- Delete duplicate helpers/formatters/state decoders only after repository evidence proves a canonical replacement exists.

A tidier directory tree is not sufficient evidence for a risky migration.

## 3. Static-first and narrow-island rendering

Public research and knowledge content should remain useful in generated HTML whenever a truthful static state exists.

Classify interaction deliberately:

- render-only: no `client:*`;
- immediate/above-fold interaction: `client:load` when actually necessary;
- supporting global UI: usually `client:idle`;
- below-fold/expensive exploration: usually `client:visible`.

Additional rules:

- Route-scope islands to pages that can actually trigger them.
- Serialize the narrowest props an island renders; do not repeat full catalogs or full locale trees across global islands.
- Prefer existing static JSON/data routes for interaction-only data.
- Keep D3/ECharts or other heavy engines behind visibility/interaction boundaries when practical.
- Do not introduce SSR/functions merely to solve browser URL/local-state behavior unless that is an explicit architecture decision.

### User-provided and brand assets are implementation inputs, not automatic generation requests

When a user supplies a screenshot, logo, icon, or visual reference and asks to use that identity in the website, treat it first as **repository/UI asset work**, not as an instruction to synthesize new media.

- Do not generate, redraw, or restyle the visual unless the user explicitly asks to create or edit media.
- Distinguish **exact supplied pixels** from **recognizable brand/entity identity**. If exact pixels matter, use the supplied binary through a binary-safe path and verify file type, dimensions, and hash when identity matters.
- For a named model/provider/brand, prefer a first-party official asset over an invented pictogram when one exists. Pin immutable upstream content or vendor the asset according to current repository policy.
- Do not move binary UI assets through ad-hoc hand-assembled base64/shell text paths when a binary-safe repository/file route exists.
- Verify the actual rendered mark in the real component and representative themes/viewports. An “official” filename or upstream source is provenance evidence, not visual acceptance by itself.
- If a supplied reference and the available first-party asset differ materially, surface that discrepancy rather than silently choosing one.

Historical case: [`../history/2026-08-27-seed-glm-stage1-and-brand-asset-retrospective.md`](../history/2026-08-27-seed-glm-stage1-and-brand-asset-retrospective.md).

## 4. SSR-visible controls need an explicit product readiness contract

Visibility and hydration are different states. An Astro/React control can be visible in SSR HTML while its client handler is not attached yet. The product must therefore choose and expose one of two coherent contracts before the control is presented to the user:

1. **Interactive during the SSR→hydrated gap:** the product preserves the user's first interaction through a route-scoped pre-hydration bridge or another canonical mechanism, then hands off to React/store ownership after hydration.
2. **Interactive only after hydration:** SSR renders the whole React-owned control group explicitly unavailable (for example a disabled `fieldset` plus a product-owned busy/readiness signal). Hydration flips that product state once, then the group becomes interactive.

The invalid middle state is “looks enabled and clickable, but silently drops the event until hydration.”

Testing follows the product contract:

- A test for hydrated behavior waits on the **product readiness signal** when the product exposes one.
- An Astro `ssr` marker may still diagnose island hydration or geometry timing, but it is not a substitute for a product-level readiness contract.
- If SSR presents a control as clickable, add a deterministic first-interaction regression that holds the island unhydrated and verifies the real product effect.
- If SSR presents the control as unavailable, add SSR output coverage plus a browser regression proving `unavailable -> ready -> enabled` and the first enabled interaction.
- For independently hydrated trigger/receiver islands, prefer the least invasive readiness design; do not globally upgrade every island to `client:load` unless the product contract requires it.

This is the root-cause boundary: synchronize the **product state** first; test synchronization then consumes that state instead of inventing a parallel readiness model.

### Initial visibility is not scroll intent

Scroll-linked explainers often use `IntersectionObserver` to synchronize an article section with an interactive step. Treat **initial visibility on load/hydration as an observation, not as proof that the reader intentionally entered that step**. A spacing or typography change can move an observed section into the initial viewport and otherwise make the component auto-advance before the user does anything.

For scroll-linked state:

- initialize the product-owned overview/starting state explicitly;
- unless the product contract intentionally says otherwise, arm observer-driven step changes only after the current document receives real scroll/navigation intent or another explicit user action;
- handle history restoration/deep links deliberately rather than relying on a transient inherited `scrollY`;
- regression-test both halves: initial load preserves the declared starting state, and real user scrolling still synchronizes the step;
- for shared scroll/visibility logic, include WebKit in the focused regression because event/observer timing can expose races that an isolated Chromium run misses.

Detailed owner: `ui-change-visual-acceptance-gate.md`. Historical evidence remains under `docs/agents/history/`, including the 2026-09-07 root-cause closeout case.

## 5. Browser-local persistence is untrusted, long-lived input

`localStorage`, saved snapshots and URL/browser state can outlive schemas or be corrupted.

At persistence boundaries:

- normalize/validate before values become live application state;
- reject unsupported enums and invalid numeric ranges/types;
- trim/de-duplicate string arrays and enforce product bounds;
- ignore unknown keys unless supported intentionally;
- fail closed on malformed JSON/fingerprints rather than throwing through the UI;
- restore state through canonical APIs rather than writing directly into internal stores;
- cover malformed and old-schema cases with deterministic tests where practical.

TypeScript assertions are not runtime validation.

## 6. Classify red Gates before changing the product

For ordinary deployable work:

```bash
npm run verify:deploy
npm run build
```

For UI-affecting work, also run the task-required browser matrix.

Classify failures first:

```text
product/runtime failure
contract violation
hydration/readiness failure
harness failure
environment/runner failure
stale test/policy
provider quota/rate-limit failure
inherited base debt
```

- Do not weaken a valid threshold to get green.
- Retries are diagnostic, not proof of stability.
- A stale test should be updated to the current product contract, not satisfied by restoring retired UI. **Protect the semantic behavior, not an incidental CSS token:** if the real contract is “controls must not become viewport-fixed before the reader reaches the explainer,” a test should not require `position: static` when `sticky` also satisfies the product behavior.
- An unsupported browser runner or missing library is environment evidence, not a browser-product failure.
- Before attributing a surprising budget, performance, geometry, or deterministic-test failure to the candidate branch, reproduce the **same command in the same relevant environment on the exact intended base/current `main`** when the failure could plausibly pre-exist. Compare measured values and failure mode, not only PASS/FAIL.
- `branch FAIL + base FAIL with the same relevant value/failure` is inherited base debt until evidence shows a candidate delta. Report it separately; do not raise the threshold, revert unrelated feature work, or claim a regression merely because the candidate is the tree on which the red result was first noticed.

Historical differential-attribution case: [`../history/2026-09-02-official-external-brand-links-retrospective.md`](../history/2026-09-02-official-external-brand-links-retrospective.md).

## 6.1 CI optimization preserves acceptance semantics

When CI becomes slow or expensive, optimize the **work selected and the dominant measured phase** before changing provider or buying a larger runner.

Required sequence:

```text
measure recent real jobs by phase
-> identify the dominant cost
-> separate CI relevance from deploy relevance
-> improve safe affected-surface selection
-> split long indivisible tests so parallelism can work
-> benchmark the exact same gate on candidate runners
-> only then migrate required-status authority
```

Rules:

- A provider migration is not a performance optimization by itself. Moving a 20–25 minute gate unchanged to another cloud merely moves the bill/timeout/queue.
- Use `fast / focused / full` only when each lower tier has a defensible impact map. Unknown/shared/global/CI-classifier changes fail closed to the stronger tier.
- The planner, workflow, test-selection code, Playwright config, runner image and acceptance harness must never use their own optimized low-risk path without explicit self-protection.
- Directory names are weak evidence of impact. Prefer semantic ownership (`component/style/data -> owned routes/specs`) when it can be maintained deterministically; otherwise keep the conservative full path.
- Playwright `workers` and CI **shards** solve different problems. Increasing workers on one CPU-bound machine can increase contention; split long single tests first, then benchmark independent shards on separate executors when wall-clock matters.
- Heuristic changed-test features may be useful as an early signal but cannot silently replace the final merge/release proof when the tool itself documents incomplete impact inference.
- Preserve the strongest required acceptance on the exact merge candidate. Do not save minutes by converting a real merge gate into a non-blocking nightly check unless the product-risk contract is deliberately changed.

Provider selection is a separate decision. Before adopting a runner/provider, verify live:

```text
private-repository support and source-access boundary
account eligibility (personal vs organization)
GitHub App/repository permission scope
secret/fork/SSH-debug behavior
billing unit and free-tier reset/overage behavior
single-job timeout
concurrency / queue semantics
CPU/RAM/architecture/browser support
required-check integration and failure visibility
```

Pricing, quotas and product eligibility are time-sensitive evidence, not durable architecture facts. Record dated measurements in history and keep current policy provider-neutral where possible.

## 6.2 CI performance experiments require a frozen causal benchmark

A performance experiment must answer **one pre-registered causal question**. Do not decide what counts as success after seeing the run. Before the first benchmark ref mutation, record:

```text
question / proposed mechanism
candidate base + head/tree
control ref/tree
canonical test identities/count
executor, shard count, Playwright workers, retries
qualification-only extras (Lab gate, reserve, diagnostics, planner mode)
metric and critical-path definition
meaningful-improvement rule
rough theoretical maximum upside
concurrent-run policy
```

Measurement rules:

1. **Qualification is not steady state.** A CI-infrastructure PR may deliberately trigger stronger self-protection: different shard reserve, a Lab tail, diagnostics, or another qualification-only path. Those extra costs prove correctness but are not automatically the cost ordinary post-merge PRs will pay. When the shapes differ, measure steady state with a benchmark-only stacked PR whose diff has the ordinary risk class being optimized (`focused` or `full`) and whose base is the candidate. Never merge that benchmark PR.
2. **Freeze the control.** A PR base branch is a moving ref, not an immutable commit. If the experiment needs the pre-change scheduler or another historical control, create/use a dedicated frozen base ref at the exact commit. Re-read GitHub's resolved `base_sha` after the PR opens.
3. **One workflow measurement -> one fresh commit SHA.** CircleCI currently reports legacy GitHub status contexts keyed by commit SHA. Reusing one SHA under multiple PR/base/workflow contexts can mix old and new statuses. For an identical-tree repeat, create a new commit that points to the exact same tree; do not alter source merely to obtain another sample.
4. **Run candidate and control sequentially.** Search overlapping PRs and active provider runs first. Do not create duplicate benchmark PRs, and do not intentionally overlap your own candidate/control runs on shared hosted capacity. Record unavoidable external overlap as noise.
5. **Preserve test identity byte-for-byte when identity is part of timing.** If a no-op marker is needed to trigger an ordinary-full PR, append it after existing test definitions so line-based Playwright identities do not move, then diff the canonical `--list` identity set. The benchmark must not add/drop/rename tests, change retries, or alter quality thresholds.
6. **Use the repository's canonical runner/config for identity discovery.** A bare `playwright --list` can load a different config/fixture path and fail for reasons the canonical `test:ui` command does not. A fresh worktree without `node_modules` is an environment/bootstrap gap, not a candidate regression. Normalize the local environment before interpreting source correctness.
7. **Separate wall-clock layers.** GitHub `pending -> success` is useful as a user-visible critical-path measure but can contain queue, spin-up, setup, and test execution. When provider job timing is available, inspect those layers before assigning causality. Do not invent a queue explanation merely because two runs differ.
8. **Hosted critical path outranks a local hotspot for hosted-CI decisions.** A local focused A/B can prove that one loop became cheaper, but it cannot authorize a CI optimization when the hosted slower shard/overall critical path does not improve. Compare the maximum browser-shard duration, not the best-looking shard.
9. **Estimate the upside before spending CI.** If the code path can save at most `X` seconds in total and `X` is already smaller than observed hosted variance/critical-path noise, stop or use a cheaper focused measurement. Do not spend full CI repeatedly on an optimization whose theoretical ceiling cannot satisfy the meaningful-improvement rule.
10. **Repeat only to resolve a decision, not to fish for a green number.** When the candidate-control delta is inside observed runner variance, use an identical-tree repeat. If the advantage remains small/non-causal/non-repeatable, reject the complexity even when the implementation is correct.
11. **Do not let tooling churn become experimental treatment.** Review diffs after formatters; legacy `.mjs`/config files may produce large quote/format rewrites. Restore unrelated churn before benchmarking so the causal diff stays narrow.
12. **Network and authorization failures are different layers.** A Git HTTPS connection timeout is not proof that credentials are wrong. Classify transport vs auth first; if local push transport is unavailable and a connected GitHub write path exists, preserve the same intended tree through that path rather than changing credentials or the experiment.
13. **Qualify adaptive inputs in shadow before making them authoritative.** When a new scheduler depends on provider historical timing or another learned/adaptive signal, first compute its complete assignment after the existing authoritative run and verify non-empty buckets, exact union, no duplicates, no unknown identities, and no silent provider fallback. Missing/new timing must fall back to the proven conservative scheduler for that run so a new test can execute and seed history; an optimizer must not create a cold-start deadlock where missing history prevents the test that would generate that history.

Stopping rule: an optimization that does not demonstrate a **clear, meaningful, repeatable** end-to-end benefit under unchanged acceptance semantics is closed unmerged. A scientifically/engineering-correct negative experiment is a successful outcome when it prevents permanent complexity.

### CI evidence preflight

Before the first provider-triggering write, record the checked artifacts for the applicable rows in the existing PR/task witness. These refine the frozen benchmark protocol; they do not add an approval round.

| Trigger | Required evidence before acting | Invalid shortcut |
| --- | --- | --- |
| TypeScript or Node API overloads changed | Repository typecheck with its Node types/compiler options, separately from executable tests. If only a source export is available, name omitted coverage and require complete hosted validation. | Vitest transpilation passed, therefore TypeScript compiles. |
| Local files came from connector downloads | Classify checkout versus partial export; bind files to ref/blob identities. Whole-source consumer/route inventories require a complete source population. | Create a synthetic local Git history or call a partial export a clean current-main worktree. |
| Historical control was squash-merged | Use merge-base comparison for contribution ancestry; use exact endpoint tree/blob comparison for equal product content. Enumerate intended CI/test/doc deltas separately. | A three-dot compare displays a page change, therefore the two endpoint page blobs differ. |
| Optimizing affected-test selection | Prove component consumers, routes and side effects; preserve the complete relevant spec registration (including imported cases), assertions and required route/theme/viewport coverage. Show which previously full-suite work is omitted and why. | Label fewer tests as a faster scheduler, or keep only tests whose filename/title mentions the changed page. |
| Optimizing scheduling/cache/runtime | Hold the canonical test population and acceptance semantics fixed; isolate the scheduling/runtime treatment. | Change test selection while attributing the gain to executor speed. |
| Making a budget claim | Report provider workflow wall-clock, sum of all job execution times including setup and early-exit jobs, and queue separately. Record failed/corrective qualification and post-merge work as adoption cost. | Faster longest shard means fewer credits; executor-seconds prove account balance or a money saving. |

Use explicit labels: planner classification, full correctness qualification, ordinary workload measurement, merge, and post-merge validation. A successful status for a policy exit proves that the exit contract ran; it does not prove that skipped tests passed. A discovered test list is not an execution receipt.

A historical one-pair replay supports a bounded case observation, not a universal or independently established repeatability claim. Preserve the pre-registered sample/acceptance rule; do not weaken it after measurement. Broader claims or a protocol requiring repeats need the corresponding evidence. Re-read refs, consumers, test registrations and runtime inputs when they change rather than treating a historical count or hash as permanent.

The [mechanism-route case](../history/2026-09-07-mechanism-ci-route-ownership.md) retains the initial type failure, exact content comparison, bounded measurement and repetition audit.

## 7. Chromium and WebKit have different execution boundaries

- Vercel's hosted browser gate is Chromium-only.
- Do not force Playwright WebKit into Vercel Amazon Linux with Ubuntu fallback binaries or ad-hoc library shims.
- Run WebKit on a Playwright-supported macOS/Ubuntu/Debian runner and confirm the browser actually launched and assertions completed before reporting PASS.
- A public Production black-box harness may be used only when it contains no private BaseModel source/credentials and tests only already-public URLs.
- Public Production WebKit evidence is not private exact-head Preview evidence; state the boundary precisely.

## 8. Acceptance belongs to an exact tree

A PR number, branch name, READY badge or remembered green run is not an acceptance identity.

Before merge, tie evidence to:

```text
accepted head SHA
intended base SHA
required deterministic Gate/build
required browser evidence
exact-head Preview deployment
```

Immediately before merge:

- refresh PR head and current `main`;
- invalidate stale evidence when head/base moved materially;
- inspect semantic overlap, not only textual mergeability;
- use expected-head merge locking where supported.

After merge, verify separately:

```text
accepted tree
-> merged main tree
-> Vercel Production READY for the intended main SHA/tree
-> representative public route/interaction/metadata checks
```

When squash merge changes the commit SHA, compare Git tree SHA to prove file identity where appropriate.

## 9. Provider-triggering writes are a finite resource

Vercel deployments are not a free editing loop.

Default release shape:

```text
one coherent branch/PR
-> one atomic initial push
-> one exact-head Preview
-> at most one normal evidence-driven corrective Preview
-> one Production deployment
```

- Batch related edits before provider-triggering ref updates.
- Prefer atomic Git data writes when tooling supports them.
- Do not create repeated no-op commits merely to poll provider availability.
- The Hobby rolling daily deployment quota can reject a deployment **before build starts** (`api-deployments-free-per-day`). Classify that as provider quota, not code failure.
- When the rolling 24-hour quota is exhausted, stop burning attempts. Keep the accepted source/tree stable, use existing valid evidence where its boundary is exact, and re-trigger once the provider actually allows builds again.
- Do not let superseded experiment branches consume deployment budget.
- Docs-only work should follow the repository build classifier rather than manufacturing browser runs.

Detailed owners: `deployment-policy.md`, `hosting-architecture.md`, `release-closeout-protocol.md`.

## 10. Temporary browser infrastructure must leave no active debt

A temporary public harness is acceptable only when:

1. the target is already public;
2. no private BaseModel source, credentials, private artifacts or secrets are copied into it;
3. it is clearly temporary and never merged into an unrelated repository;
4. its result is reported as Production black-box evidence, not private exact-head evidence;
5. the successful historical run can remain after cleanup.

Afterward:

- close the temporary PR without merging;
- reset/delete temporary branch contents so no active workflow/diff remains;
- do not leave a permanent Actions workflow merely because a one-off fallback worked.

Permanent cross-browser CI is a separate, explicit architecture decision.

## 11. Performance work needs evidence and a stopping rule

Prefer, in order:

1. remove unnecessary hydration;
2. keep public content useful before JS;
3. route-scope/defer low-priority islands;
4. narrow repeated serialized props;
5. lazy-load heavy interactive engines;
6. harden persistence boundaries and remove proven duplicate helpers;
7. use browser traces/field data for finer tuning only when needed.

Do not claim Core Web Vitals or network improvements without measurement.

Once the requested problem is fixed, relevant gates are green and release is verified, **stop**. Further cleanup requires a new explicit request or new measured evidence.

Historical end-to-end case: [`../history/2026-08-30-site-optimization-implementation-and-release-retrospective.md`](../history/2026-08-30-site-optimization-implementation-and-release-retrospective.md) records the 95-branch audit → fail-closed Gate repair → payload/hydration reduction → no-JS/WebKit regressions → exact-tree Preview/CI → expected-head merge → Production `READY` sequence that motivated several rules above.

## 12. Durable knowledge belongs in the best existing owner

Conversation is not the project database.

- Encode cheap deterministic invariants in tests/scripts/config when possible.
- Update an existing current owner before creating a new policy layer.
- Keep incident SHAs/logs/timelines under history when useful.
- Do not preserve temporary share URLs or transient deployment states as current truth.
- Current user instruction and executable/live truth outrank this document.

## 13. Site-wide promises need site-wide proofs

Words such as `all`, `every`, `site-wide`, `wherever`, `全部`, `所有`, and `凡是` create a **set-level acceptance contract**. A handful of representative routes can prove visual quality for samples; they cannot prove completeness of the set.

For a cheap machine-checkable site-wide invariant:

```text
define the semantic population
-> centralize the classifier / rendering owner
-> build or enumerate the complete product surface
-> assert every matching member satisfies the invariant (or is an explicit exemption)
-> use browser sampling for appearance/interaction
```

Rules:

- Prefer one shared semantic classifier/primitive over repeated per-page conditionals.
- When the invariant concerns generated Astro HTML, a build-time `dist/**/*.html` audit is often a better completeness boundary than a Playwright crawler.
- Source grep is not a complete rendered-site proof when links/content come from shared components, data-driven renderers, localized variants, or generated routes.
- Browser tests remain required where the promise includes geometry, theme, focus, hover, responsive behavior, accessibility state, or interaction; they complement rather than replace the static set-level audit.
- If a rule depends on a URL/provider identity, parse URL/protocol/hostname semantics rather than using loose substring matching; include lookalike-host regression cases.
- Do not claim “site-wide complete” until the complete inventory/audit is green or every exemption is named and justified.

Historical case: [`../history/2026-09-02-official-external-brand-links-retrospective.md`](../history/2026-09-02-official-external-brand-links-retrospective.md). The brand-link feature initially passed representative visual checks while many dynamic/shared-renderer links remained unwired; a generated-output audit exposed the gap and then became executable protection.

## Definition of done

A normal runtime/UI release may require:

```text
coherent source change
+ deterministic Gate/build
+ task-required browser acceptance
+ exact-head Preview evidence
+ final base/head race check
+ accepted merge
+ Production READY
+ representative Production verification
+ temporary-infrastructure cleanup
```

Docs-only policy work should not manufacture browser/deployment evidence that the repository classifier intentionally skips.

Completion reports must distinguish source changed, tests green, Preview READY, browser accepted, merged and Production accepted. Never collapse those layers into one vague “done”.

## Policy ownership map

| Concern | Detailed owner |
| --- | --- |
| autonomous Agent workflow / durable learning | `project-agent-operating-principles.md` |
| scenario triggers | `scenario-trigger-registry.md` |
| CSS composition / ownership / Tailwind decision | `css-architecture.md` |
| rendering / hydration / performance | `rendering-and-performance-policy.md` |
| UI/browser/theme/layout acceptance | `ui-change-visual-acceptance-gate.md`, `theme-contrast-contract.md` |
| deployment/provider/build budget | `hosting-architecture.md`, `deployment-policy.md` |
| exact-head merge / Production closeout | `release-closeout-protocol.md` |
| product/research truth | `product-and-research-integrity.md` |
| source ownership | `repository-map.md` |
