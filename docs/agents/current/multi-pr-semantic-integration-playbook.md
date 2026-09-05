# Multi-PR semantic integration playbook

Last reviewed: **2026-08-12**

Use this playbook when several Agent-authored PRs must become one coherent release. Provider and build-budget rules remain in [`deployment-policy.md`](./deployment-policy.md). The case that produced these lessons is [`../history/2026-08-12-open-pr-semantic-integration.md`](../history/2026-08-12-open-pr-semantic-integration.md).

## Core rule

> A clean Git merge is not semantic acceptance.

Integration has two separate goals:

1. preserve useful history and attribution;
2. produce the correct current executable tree.

A worker PR may stay in ancestry while its obsolete CSS, policy, duplicate component, device assumption, or hosting outcome is deliberately superseded.

## Trigger

Load this guidance when:

- the owner asks to merge many PRs and publish once;
- PRs are stacked or change shared UI, research, data, device, dependency, or deployment surfaces;
- several Agent conversations worked in parallel;
- old branches may contain stale product or provider assumptions;
- Git says branches merge cleanly but their intended outcomes disagree.

Do not batch unrelated or unaccepted work only to reduce build count.

## Procedure

### 1. Freeze the candidate set

Refresh `main` and every candidate. Record:

| Evidence | What to capture |
|---|---|
| identity | PR number, URL, intent |
| ancestry | base branch/SHA, exact head SHA, stack relation |
| scope | changed files and shared surfaces |
| acceptance | checks, build, Preview, browser review, known failures |
| authority risk | whether the branch predates newer product/provider/device truth |
| disposition | accept, accept partly, supersede, defer, reject |

If `main` or a candidate head moves, refresh the affected comparison. An older Preview does not validate a newer head.

### 2. Apply the authority order

```text
current owner instruction
> live provider/runtime state
> executable code, config, tests and manifests
> docs/agents/current/*
> accepted product/research intent
> branch recency or stack position
> historical docs, handoffs and snapshots
```

Newer is not automatically authoritative. Older is not automatically useless. Historical policy must not overwrite current executable or provider truth.

### 3. Classify each PR

- **independent** — owns a separate compatible surface;
- **stacked dependency** — depends on a parent branch;
- **complementary overlap** — both contain valid work on the same surface;
- **semantic conflict** — intended product/research/UI/device/provider outcomes disagree;
- **superseded outcome, retained ancestry** — attribution or rationale remains useful, runtime result must not ship;
- **deferred/rejected** — incomplete, unsafe, unrelated, or not accepted.

### 4. Check conflict classes

Do not stop at conflict markers. Review:

- textual/file conflicts;
- product mission, navigation, reading order and UI hierarchy;
- research semantics, benchmark metrics, evidence levels and causal claims;
- current device/runtime truth versus dated scenarios;
- hosting, canonical domain, indexing and release policy;
- dependencies, lockfiles, schemas and generated artifacts;
- routes, navigation, search index, canonical/hreflang, robots and sitemap;
- current-policy ownership versus historical evidence.

For each material conflict, record:

```text
current owner
retained contribution
superseded outcome
reason
acceptance evidence
```

### 5. Build one integration head

```text
latest intended main
-> explicit integration branch
-> path-by-path resolved final tree
-> one atomic push
-> one exact-head combined Preview
```

Start from current `main`, not from the oldest or largest worker branch. Do not replace the whole tree with one stacked child unless it is current for every shared surface.

Use the simplest ancestry strategy that preserves the needed attribution. Ordinary merges/cherry-picks are fine when they naturally describe the final tree. A multi-parent integration commit or equivalent merge structure is useful when several exact worker heads must be recognized while the final tree intentionally differs from the mechanical merge result.

When ancestry is intentionally encoded, state that in the PR and do not squash the integration PR. Squash remains acceptable for ordinary corrective or documentation PRs.

### 6. Make the PR a decision record

The integration PR should include:

1. release goal and current base SHA;
2. candidate table with exact heads and stack relations;
3. semantic conflict resolutions;
4. current invariants preserved from `main`;
5. exact integration head;
6. required Gate/build/browser/metadata checks;
7. required merge method;
8. expected worker-PR disposition;
9. Production verification boundary.

“Merge all PRs” is not enough documentation.

### 7. Validate the exact head

For this repository:

```bash
npm run verify:deploy
npm run build
```

Add task-specific acceptance:

- representative routes for every accepted contribution;
- Chinese and English routes where applicable;
- desktop/mobile and light/dark for shared UI;
- Preview `noindex` and Production canonical/hreflang;
- robots, sitemap, navigation/search discoverability;
- provider metadata pointing to the exact integration SHA.

A READY badge alone is not acceptance. A route returning 200 does not prove it is discoverable.

### 8. Merge and release once

After exact-head acceptance:

```text
merge integration PR once
-> one main update
-> one Vercel Production deployment
-> separate public Production verification
```

Verify the stable domain, indexability, canonical/hreflang, robots/sitemap, representative routes and the key user path. Do not treat Preview acceptance as Production acceptance.

### 9. Close the worker-PR loop

Record each worker PR as:

- incorporated and shown as merged;
- incorporated by integration/ancestry but GitHub still shows closed;
- explicitly superseded;
- deferred for later;
- rejected with reason.

Stacked PRs may need explicit comments linking the integration PR because GitHub's merged flag can be misleading when their base was not `main`.

### 10. Run a post-release audit

Look for failures a green build can miss:

- new routes absent from sitemap, navigation or search;
- stale canonical domain or hreflang;
- Preview indexing leakage or Production `noindex`;
- historical hosting/policy text restored as current truth;
- duplicate device facts;
- source components not wired into the real user path;
- wrong deployment SHA;
- worker PRs left open as duplicate release paths.

If a narrow defect is found after release, create one minimal corrective PR from current `main`, protect it with a focused test when possible, and verify Production again. Do not reopen the whole release unnecessarily.

## Build-budget target

```text
one integration branch
-> one atomic initial push
-> one combined exact-head Preview
-> at most one evidence-driven corrective Preview
-> one Production build
```

Earlier worker Previews remain consumed. Optimize future ref updates, not historical counts. Keep Agent/docs-only experience deposition in docs-only paths so ignored-build rules can skip it.

## Anti-patterns

- merging every PR sequentially into `main`;
- treating “mergeable” as “semantically compatible”;
- choosing one stacked child as the full final tree without comparing current `main`;
- allowing old CSS, navigation, research or hosting semantics to reassert themselves because they merge cleanly;
- squashing away intentionally constructed ancestry;
- weakening a valid Gate to make integration green;
- validating only the homepage;
- trusting READY without exact-head and real-route checks;
- forgetting sitemap/robots/canonical/hreflang/discoverability;
- leaving worker PR disposition ambiguous;
- batching unrelated work only to save builds.

## Completion report

```text
Candidate PRs inspected:
Accepted / partly accepted / superseded / deferred:
Conflict classes resolved:
Integration head:
Repository Gate/build:
Vercel triggers and statuses:
Exact-head Preview acceptance:
Merge method and merge commit:
Worker PR disposition:
Production deployment and public verification:
Post-release finding/corrective PR, if any:
```

## Lessons from the 2026-08-12 release

1. Preserve history separately from behavior: PR #116 remained attributable while its pre-mission CSS outcome was superseded.
2. Stacked PRs require path-level ownership: the #121 -> #125 -> #128 chain could not be accepted by choosing one branch wholesale.
3. Current provider truth must dominate historical policy: older Cloudflare-era assumptions stayed historical and did not overwrite Vercel authority.
4. GitHub PR state is not the full disposition record: stacked PRs required explicit closure/comments after incorporation.
5. Build success is not discovery completeness: the first Production release contained the new routes but omitted them from `sitemap.xml`, requiring focused PR #132 and route tests.

Provider mechanics and repository merge settings are time-sensitive. Re-check them before repeating the implementation details; the semantic decision model is the durable part.

## Exact duplicate test PRs: choose by semantic diff and preserve evidence

When multiple PRs claim the same narrow test fix, do not choose a canonical PR from title, creation time, `mergeable`, or a green badge alone.

Before mutating PR state, compare each exact head against the same base and record:

```text
head SHA and base SHA
changed path(s), additions, deletions, and byte-level details
functional invariant added or removed
unrelated formatting/EOF/lockfile churn
focused-repeat evidence and exact-head required-check evidence
current-main movement and overlap with intervening commits
```

Use this decision order:

1. Reject any candidate that weakens or deletes the existing assertion.
2. Prefer the smallest patch that fully restores the intended contract.
3. Treat byte-level cleanliness (for example, avoiding an unrelated final-newline deletion) as a tie-breaker, not as a reason to discard stronger functional evidence.
4. Preserve stronger evidence from a non-canonical duplicate in the canonical PR's body or thread before closing the duplicate.
5. Comment the supersession relationship and close duplicate PRs explicitly once the replacement is identified.
6. Do not delete branches automatically; first check whether they are the only reachable home of useful history or are referenced by another PR/workflow.

For hydration tests specifically, wait on a real readiness signal such as the owning Astro island losing its `ssr` marker. Do not replace the synchronization with a guessed sleep, globally eager hydration, a removed assertion, or a click that intentionally bypasses the product contract. A test that proves behavior after hydration is distinct from a product guarantee that the first visible pre-hydration click is preserved; keep those claims separate.

The post-closeout record should state:

```text
canonical PR and exact head
functional equivalence/difference of every duplicate
evidence retained from closed candidates
current-main/base-drift assessment
closed duplicate PR numbers and reason
remaining merge/release boundary
```

Historical worked example: [the 2026-09-05 Landscape hydration PR deduplication](../history/2026-09-05-landscape-pr-deduplication-retrospective.md).
\n