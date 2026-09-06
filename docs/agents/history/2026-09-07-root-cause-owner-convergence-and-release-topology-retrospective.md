# Root-cause owner convergence and release topology — 2026-09-07

Status: **historical incident / reusable causal record**. PR numbers, SHAs, provider deployment IDs, and point-in-time `main` values below are historical evidence only. Current authority lives in `AGENTS.md`, `docs/agents/current/*`, executable repository config/tests, and live provider state.

## 1. Why this case exists

The owner asked for a high-strength root-cause cleanup across recently active repositories: replace wrong logic with the correct logic, avoid patch stacks, and express current rules as affirmative target-state contracts. The work exposed a recurring pattern: the visible symptom often lived one layer below the real owner.

BaseModel's Landscape hydration race looked like an E2E timing problem, but the user-facing product itself exposed clickable SSR controls before React owned their events. OpenEVO had similar ownership duplication in CI integration-base resolution and in human-readable/current-state documents. Release closeout then exposed a separate ownership mistake: a green outer provider status did not prove that the required Preview build actually ran.

## 2. The durable causal pattern

Use this sequence whenever the same intent has been corrected repeatedly:

```text
symptom
-> identify the semantic concept
-> enumerate every place that currently decides it
-> choose the real owner
-> move the correct invariant into that owner
-> migrate callers/tests to consume the owner
-> retire duplicate/current-state implementations
-> validate the actual user/scientific/provider contract
```

A smaller diff is not automatically a root fix. A larger shared helper is not automatically better either. The deciding question is: **which layer owns the truth that the failing caller was trying to infer?**

## 3. BaseModel: test timing was not the product contract

### What happened

Landscape used Astro `client:visible`. SSR rendered React-owned buttons and inputs as enabled-looking controls. Before hydration, a real user could click them while React had not attached handlers. Several E2E files also carried their own hydration waits, so the first repair direction centralized test synchronization.

### Wrong assumption

“Waiting correctly in Playwright” was treated as equivalent to “the user cannot observe the race.” That only proves hydrated-test behavior. It does not define what the product does during the SSR→hydrated interval.

### Root fix

The product now owns one readiness transition: SSR renders the control group unavailable through a disabled `fieldset` and `aria-busy`; hydration flips one product-owned state; the group then becomes interactive. Landscape tests consume that signal. A shared helper remains only for tests that genuinely need post-hydration geometry/readiness.

### Before acting next time

Check:

- Can a real user see and interact with the element in SSR HTML?
- Does the product expose a readiness state, or is the test inferring one from framework internals?
- Is the required guarantee “first visible click works” or “control is unavailable until ready”?
- Are multiple tests duplicating framework-level waits because the product lacks one contract?

### Defensive rule

Choose one product readiness contract. Tests consume the product signal. Framework internals such as Astro's `ssr` marker remain diagnostic evidence, not the user-facing contract when a product signal exists.

### Anti-example

A test adds `expect(astroIsland).not.toHaveAttribute('ssr', '')` before clicking and goes green, while the page still shows an enabled button that drops a real user's pre-hydration click.

## 4. Preview routing: green status was not an executed Preview

### What happened

A candidate used a zero-content commit whose message carried `[vercel-preview]`. GitHub showed the Vercel context as success, but provider readback reported an ignored/CANCELED deployment. BaseModel's ignore-build script evaluates both the exact-head token and the exact changed range; the marker commit contained no deploy-relevant change.

### Wrong assumption

“Green Vercel status” was treated as equivalent to “exact-head Preview built and is READY.” The status context was only the outer reporting surface.

### Root fix

The final candidate used one coherent commit: the same exact head contained the deploy-relevant root-fix diff and `[vercel-preview]`. Provider readback then showed a real READY deployment bound to that exact SHA.

### Before acting next time

Read:

- the repository's executable ignore/build classifier;
- the exact head commit message;
- the provider's evaluated changed range;
- the provider deployment state/readyState and bound SHA.

### Defensive rule

When acceptance requires real provider execution, require the provider object to prove that execution. Classify ignored/skipped/canceled separately from READY/PASS.

### Anti-example

Adding another provider exception or retry because a token-bearing no-op commit did not build. The correct repair is release topology: the acceptance head must present both the opt-in and the deploy-relevant candidate change to the existing classifier.

## 5. Moving main: current-base rigor turned into PR churn

### What happened

While Landscape CI/Preview ran, unrelated and then CI-architecture PRs repeatedly advanced `main`. The work correctly re-checked current base, but several successive PR numbers were created to re-project the same 10 semantic blobs onto newer bases.

### Wrong assumption

“Fresh current-base candidate” was conflated with “new PR identity.” Freshness is an ancestry/acceptance property; it does not inherently require a new semantic candidate.

### Better procedure

- Inspect likely near-merge PRs before starting the expensive final Gate.
- Keep one live PR for one semantic fix.
- On independent base drift, synchronize the same branch when policy requires current-base freshness.
- Preserve semantic blob/diff identity and rerun the current required checks.
- Create a successor only when the semantic scope, release routing, or authority contract changes.

### Anti-example

`fix A #1 -> same fix A #2 -> same fix A #3` solely because documentation merged during each browser run. That creates review noise without adding semantic information.

## 6. CI authority can change while a candidate is running

BaseModel adopted four independent medium browser shards while an earlier candidate was being validated. The correct response was to treat the old two-shard green evidence as historical and validate the final current-main candidate under the new deterministic + shard1/2/3/4 protection contract.

The durable lesson is not “always rerun everything.” It is: **read current branch protection/required checks immediately before merge; acceptance authority is a live contract.** Re-run the checks required by that contract plus overlap-affected checks.

## 7. Cross-repository owner examples from the same conversation

OpenEVO exposed the same pattern in two different forms:

- timestamp integration context had multiple decision points (validator, preflight, CircleCI); the validator became the single owner and callers delegated;
- a human-readable Mechanism CURRENT document carried stale current-state prose while the machine campaign router already represented later phase authority; the human document was rebuilt as a projection of the machine owner.

These are the same abstraction error as the hydration race: a consumer copied or inferred truth instead of consuming the owning state.

## 8. Tool and environment friction

### Git transport vs authorization

Git smart-HTTP/HTTP2 intermittently failed while GitHub REST/CLI authentication remained valid. A transport error did not justify credential rotation, remote rewriting, or repository policy changes. The safe fallback was an already-authorized API/Git Data path, followed by exact tree/SHA readback.

**Rule:** classify `transport`, `authentication`, `authorization`, and `repository state` separately.

### Shell dialect

A Bash-style `root=...` command was once parsed by Fish and failed before the intended script ran.

**Rule:** when syntax depends on Bash, set `/bin/bash` at the outer execution surface. An inner Bash command cannot repair text rejected by an outer parser.

### Required CI queue

A queued/running browser gate was initially at risk of being called stuck. Live runner/process evidence showed valid progress.

**Rule:** queue state, runner assignment, active process progress, and required-check SUCCESS are separate facts. Preserve valid earlier work; cancel only superseded task-owned runs.

## 9. Repeated mistakes: why earlier retrospectives did not fully prevent recurrence

Several underlying rules already existed: exact-head evidence, current-main refresh, product-vs-harness semantics, tool-layer separation, and one source of truth. They still escaped because:

1. some rules were phrased as broad warnings rather than a trigger + concrete response;
2. history explained incidents but did not always promote the missing invariant to the owning current document;
3. “green status” and “mergeable” remained visually tempting shortcuts;
4. moving-base closeout lacked an explicit anti-churn rule for keeping one live candidate;
5. framework-level readiness signals were easier for tests to inspect than product-level readiness, so test convenience hid the ownership mistake.

This closeout therefore promotes the missing pieces into the current website-engineering, release-closeout, and scenario-trigger owners.

## 10. A / B / C retention classification

### A — durable cross-task rules

- One semantic concept has one writable owner; callers consume it.
- Product readiness precedes test readiness.
- Provider/CI acceptance reads the actual owning execution state.
- Keep one live candidate through independent base drift.
- Human current-state prose projects machine/executable authority when one exists.
- Transport failure, authorization failure, and application failure are distinct.
- Current rules use affirmative target-state language: owner, trigger, action, acceptance.

These belong in current policy / account-level Agent instructions.

### B — BaseModel project lessons

- Landscape readiness is product-owned.
- BaseModel Preview opt-in is exact-head and path-sensitive through `scripts/vercel-ignore-build.mjs`.
- BaseModel merge authority is whatever branch protection currently requires; read it live.
- Vercel provider READY and real route acceptance remain separate layers.

These belong in BaseModel current engineering/release owners.

### C — temporary incident state

The exact PR numbers, intermediate candidate SHAs, transient `main` values, CircleCI workflow IDs, Vercel deployment IDs, local temporary worktree paths, and momentary runner queue state are historical receipts only. They are intentionally absent from current policy and long-term memory candidates.

## 11. Closeout checklist for a future Agent

```text
[ ] Read current owner before touching a symptom-level caller.
[ ] Enumerate all places that decide the same semantic concept.
[ ] Pick the real owner and migrate consumers.
[ ] Decide the product/science/provider contract before editing tests.
[ ] Read branch/deploy eligibility before choosing the ref topology.
[ ] Before expensive acceptance, inspect near-merge base activity.
[ ] Keep one live semantic candidate across independent drift.
[ ] Read current required checks immediately before merge.
[ ] Verify provider execution state, not only the outer status context.
[ ] Merge with expected-head locking when available.
[ ] Verify Production/main separately after merge.
[ ] Deposit A/B rules in current owners; keep C only in dated history.
```
