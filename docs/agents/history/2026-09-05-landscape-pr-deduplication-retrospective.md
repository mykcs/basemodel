# Landscape hydration PR deduplication — 2026-09-05

Status: **historical incident record**. The PR numbers, SHAs, run IDs, and main snapshot below describe the state observed during this closeout. They are not current release authority.

## 1. Scope and outcome

Three open BaseModel PRs addressed the same post-merge browser failure in `tests/e2e/ordinary-tech-debt-round2.spec.ts`: a visible Landscape `client:visible` control could be clicked while its Astro island still carried the SSR marker.

The closeout kept [PR #442](https://github.com/mykcs/basemodel/pull/442) as the sole open canonical candidate. [PR #440](https://github.com/mykcs/basemodel/pull/440) and [PR #441](https://github.com/mykcs/basemodel/pull/441) were commented as superseded and closed. No browser assertion, product code, CI workflow, or scientific content was removed.

The canonical functional change is:

```ts
await fullView.scrollIntoViewIfNeeded();
const island = fullView.locator('xpath=ancestor::astro-island[1]');
await expect(island).not.toHaveAttribute('ssr', '');
await fullView.click();
await expect(page.locator('.landscape-view-note')).toBeVisible();
```

The test still checks the same user-visible result; it now synchronizes on the real hydration signal instead of relying on timing.

## 2. Evidence table

| PR | Exact head | Diff against shared base | Evidence | Disposition |
|---|---|---:|---|---|
| #440 | `da843e31aafdcc5b5004de7752e64d53f18c9055` | `+3/-1` | Self-hosted CI run 33926739523 succeeded | Closed; duplicate plus unrelated final-newline deletion |
| #441 | `8f3e157b27334e3e4343afc8c8d0f4b4fd865d72` | `+3/-1` | Self-hosted CI run 33928596066 succeeded; focused test reported 10/10 repetitions | Closed; evidence retained on #442 |
| #442 | `032d285615d2b743581fff461f10f5bc1dfe4c78` | `+2/-0` | Self-hosted CI run 33930357580 succeeded | Kept open as canonical |

All three used base `main@9ba65cf02d588d9027a7de6716d08c2075ec9714`. The #440 and #441 patches were functionally identical to #442 but also changed the file's EOF state. That cosmetic change did not alter runtime behavior, but it made #442 the cleaner exact patch.

## 3. What required judgment

### 3.1 Functional equivalence is not byte-level equivalence

The first two candidates looked identical when summarized as “wait for hydration before clicking.” Their unified diffs exposed an extra deletion caused only by missing final newline. The correct comparison unit is both:

- semantic behavior and preserved assertions; and
- the exact patch, including unrelated formatting churn.

A green check cannot distinguish those.

### 3.2 Stronger evidence does not automatically define the canonical patch

#441 carried the strongest explicit repetition evidence (10/10). That evidence supports the two-line synchronization, but it does not make #441's extra EOF deletion desirable. The evidence was copied into #442's thread before #441 was closed. This preserves validation without retaining a second merge path.

### 3.3 `mergeable` is only a GitHub mergeability hint

All three PRs were reported mergeable and had successful Self-hosted CI. That established feasibility, not uniqueness, current-base freshness, or semantic superiority. Canonical selection still required exact diff inspection and current-main comparison.

### 3.4 Current main must be checked before closing or merging

At closeout, `main` was `5fa92b97d87c197409f4d9feaa873b32f5cb2bd0`, two commits ahead of the shared PR base. The intervening commits touched only documentation files; the affected test file was unchanged. Therefore there was no demonstrated test-surface conflict, but the independence was checked rather than assumed.

## 4. Engineering frictions and their causes

### Friction A — local GitHub CLI was assumed available

The scratch directory was not a checkout and `gh` was not installed. This did not mean GitHub access was unavailable: the authorized GitHub connector could read PRs, diffs, branches, files, workflow runs, and perform the requested PR mutations.

**Defensive rule:** classify the access layer first: local checkout/Git, GitHub connector, provider API, and local shell are separate capabilities. If one is missing, use an authorized read-only path before requesting credentials or changing remotes.

**Counterexample:** do not install a new CLI, paste a token into a remote URL, or infer that repository permissions are broken merely because `gh auth status` cannot run.

### Friction B — PR prose compressed distinct questions

Each body correctly described “the hydration race,” but descriptions did not expose the EOF difference or prove current-main independence.

**Defensive rule:** for overlapping PRs, fetch exact metadata and unified diff; compare changed files and base/head SHAs; then inspect the current target branch and relevant file. Treat prose as intent, not executable truth.

**Counterexample:** “same title + same CI + mergeable” is not enough to call two PRs interchangeable.

### Friction C — successful CI was mistaken for complete acceptance risk

The three exact heads had successful Self-hosted CI runs, but CI success alone did not answer which patch should remain, whether the base had moved, or whether a duplicate preserved useful evidence.

**Defensive rule:** separate `required check passed`, `exact diff is correct`, `current base is compatible`, and `PR disposition is clean`. Report each layer.

**Counterexample:** merging the first green PR and leaving two equivalent open PRs creates ambiguous release paths and can cause a second, redundant fix later.

## 5. Scientific/reasoning boundaries

This was a website test-harness incident, not an OpenEvo experiment or GPU scheduling decision.

Do not infer from it that:

- the Landscape product implementation was changed;
- hydration should be globally eager;
- all visible SSR controls must be tested as pre-hydration first-click guarantees;
- a browser race licenses weaker assertions;
- current research, GPU, server, or experiment authority changed.

The correct boundary is narrower: this test intentionally verifies the React-owned click after a real hydration signal. A separate product contract is needed if the user-visible first click must work before hydration.

## 6. A/B/C deposition

### A. Long-term stable rules

These belong in current policy and are reusable beyond this incident:

- Exact-head evidence belongs to an exact tree; refresh when head or materially relevant base moves.
- For overlapping PRs, inspect semantic diff, byte-level churn, current-main overlap, and required-check evidence before mutating state.
- `mergeable` and green CI do not choose a canonical PR.
- Prefer the smallest patch that preserves all existing assertions and uses a real readiness signal for hydration.
- Preserve useful evidence from a duplicate before closing it; close superseded PRs explicitly so only one release path remains.
- Keep local Git/CLI availability separate from authorized GitHub connector access.
- Put reusable rules in the existing current owner; put incident-specific receipts and reasoning in dated history.

These rules are now reinforced in `docs/agents/current/multi-pr-semantic-integration-playbook.md`; hydration-specific acceptance remains owned by `website-engineering-standard.md` and the browser acceptance policy.

### B. Project-level BaseModel experience

- Landscape's affected test is `tests/e2e/ordinary-tech-debt-round2.spec.ts`.
- The accepted synchronization is ancestor `astro-island` `ssr`-attribute removal before the `完整视图` click.
- #442 is the canonical PR for this incident; #440/#441 are superseded duplicates.
- #441's 10/10 focused repetitions are useful supporting evidence, not a second implementation authority.

These are historical project facts. Re-verify live state before relying on them.

### C. Temporary state deliberately not promoted

The following remain only in this dated record and PR threads:

- PR open/closed state;
- exact head/base/main SHAs;
- workflow run IDs;
- branch names;
- the number of intervening commits;
- current mergeability or provider status.

They must not be copied into long-term memory or current policy as timeless facts.

## 7. Repeated-mistake check

### What had already been summarized before?

The repository already had current rules for:

- exact-head acceptance and base-vs-candidate differentials;
- hydration/readiness versus product semantics;
- semantic multi-PR integration and explicit supersession;
- distinguishing skipped checks from passed checks;
- using history for receipts and current docs for durable rules.

### Why did repetition remain possible?

Those rules were correct but distributed across several documents and written at a level broad enough that an Agent could still begin with a shortcut:

- trust the PR title/body;
- trust `mergeable`;
- trust a successful workflow;
- compare only logical intent, not the exact patch;
- assume local `gh` is the only GitHub route.

The missing trigger was an explicit “duplicate test PR” decision procedure tied to exact diff/EOF inspection and evidence transfer.

### Third-occurrence prevention

The current multi-PR playbook now has a dedicated exact-duplicate subsection. It requires:

1. exact head/base and byte-level diff inspection;
2. assertion-preservation check;
3. current-main overlap check;
4. evidence transfer from non-canonical duplicates;
5. explicit supersession comments/closure;
6. branch deletion only after reachability/dependency checks.

The history file preserves the concrete case so future Agents can understand why those rules exist without mistaking the case's numbers for current authority.

## 8. Closeout checklist for a future Agent

```text
[ ] Read AGENTS.md, docs/agents/README.md, and the matched current policy.
[ ] Fetch every overlapping PR's exact head/base, diff, checks, and comments.
[ ] Compare functional invariants and byte-level churn.
[ ] Fetch current main and inspect intervening commits touching the same surface.
[ ] Choose one canonical patch by preserved behavior + minimal exact diff.
[ ] Copy useful validation evidence to the canonical thread.
[ ] Comment and close superseded duplicates.
[ ] Do not delete branches without a dependency/reachability check.
[ ] Re-fetch final PR states and report what remains open.
[ ] Keep exact IDs in dated history, not long-term memory/current policy.
```

## 9. Deposition decision

No new root `AGENTS.md` policy was created. It already routes Agents to the current multi-PR, hydration, and exact-head owners, and the repository explicitly warns against duplicate policy layers.

One current owner was extended rather than duplicated:

- `docs/agents/current/multi-pr-semantic-integration-playbook.md` — reusable decision procedure for exact duplicate test PRs.

One historical record was added:

- this file — exact #440/#441/#442 receipts, reasoning, friction, A/B/C classification, and repeated-mistake analysis.

No GPU, server, OpenEvo scientific state, or transient provider snapshot was modified.
