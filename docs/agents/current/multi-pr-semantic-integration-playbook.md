# Multi-PR semantic integration playbook

Last reviewed: **2026-09-08**

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

#### 3.1 Close a stacked dependency parent-first and child-clean

When a child PR targets an unmerged parent, the child's green state is valid only for that stack identity. Once the parent lands, do not assume that retargeting the child to `main` automatically produces a clean release candidate.

Use this sequence:

1. refresh current `main`, the parent's actual merge commit, the child's old base/head, and all required-check/provider state;
2. record the **child semantic delta** from the old parent head to the child head before rewriting ancestry;
3. rebuild/rebase the child on current `main`, preserving that child delta plus every accepted intervening main change;
4. compare `main..new-child` and require it to contain only the intended child files/semantics; if the parent contribution reappears as part of the child diff, stop and repair the stack rather than merging it wholesale;
5. treat the rebuilt child as a **new exact head**: rerun the required checks and any Preview/browser acceptance required by the changed surface; old green statuses remain historical evidence for the old SHA only;
6. merge with expected-head/auto-merge protection when available; if another actor merges first, refresh live state and switch to post-merge verification instead of issuing a second merge attempt.

The purpose is not to manufacture a pretty one-commit history. It is to preserve parent attribution while proving that the final child contribution is exactly the intended semantic delta on top of current main.

Anti-patterns:

- merge the child before the parent because GitHub says both are mergeable;
- retarget the base and reuse the old exact-head green checks;
- squash the whole stacked child onto `main` without proving which lines belong to the already-merged parent;
- force-reset the parent/child branch merely to recover the ancestry shape you expected;
- treat required checks that are `expected`/`pending` on a fresh rebuilt head as optional because the pre-rebuild SHA was green.

### 3.2 Stale governance PRs: re-resolve authority topology before refreshing

A governance/documentation PR can become stale in a way that ordinary source-code rebasing does not capture: the **role of a path may have changed**. A file that used to own standing policy may now be navigation-only; a root bootstrap may have become the unique authority; a historical case may have been demoted from current guidance; or an executable test may now own a boundary that prose previously described.

Before refreshing a stale governance PR, classify every changed path against the **current documentation/authority topology**:

| Question | Required check |
|---|---|
| Does this path still own the same kind of mutable rule? | Read current root router, documentation governance, and the target file's status/authority header. |
| Is the semantic rule already present elsewhere on current `main`? | Search current canonical owners and executable tests; do not infer from filenames alone. |
| Would replaying the old hunk create two writable copies of the same rule? | Compare root/bootstrap, router, runbook/policy, and historical-case responsibilities. |
| Is the old branch still one coherent decision unit? | Compare `main..old-head` semantically, not only by changed-file count. |
| Are old checks still evidence for the candidate being proposed now? | No: any rebuilt/refreshed head is a new exact-head candidate and must receive current required checks. |

Disposition rule:

- **Refresh the same PR** when its semantic intent is still absent from current `main`, its changed paths still own that intent, and merging current `main` into/rebuilding the branch preserves a narrow diff.
- **Create a narrow successor from current `main`** when the useful lesson remains valid but one or more old changed paths no longer own that rule. Carry only the current canonical/history-owner deltas, explicitly link the predecessor, then close the predecessor as superseded.
- **Close as fully superseded** when current `main` already contains the semantic intent and the stale branch adds no unique evidence or executable protection.

A helper PR whose sole purpose is to merge current `main` into an existing feature branch is acceptable only when the repository/provider workflow makes that the safest non-force update path. Treat it as a mechanical ancestry operation: review that its head is exactly current `main`, merge it into the feature branch, then verify `main..feature` is still the intended narrow semantic delta. The helper PR's mergeability does not validate the feature PR.

Anti-patterns:

- replaying old `docs/agents/README.md` standing rules after that file became navigation-only;
- choosing `ours` for an entire governance file because the old branch contains a useful paragraph, thereby erasing newer reader/deployment policy;
- closing a stale PR as "obsolete" without first extracting unique historical/scientific lessons;
- refreshing a branch and reusing its pre-refresh green checks;
- declaring the task complete immediately after enabling auto-merge without later reading whether the PR actually merged.

### 3.3 Repository-wide backlog closeout: reduce authorities, not just PR count

When the owner asks to “clean up all open PRs”, “finish the backlog”, or otherwise reduce many historical/current PRs, treat the task as an **authority migration**.

Before closing or merging each PR, record: `exact head/base -> changed paths -> current semantic owner -> unique delta -> current-main equivalent -> disposition`. A stale PR may still contain one unique rule, scientific lineage note, route, test, or registry entry that current `main` lacks. Extract or explicitly reject that delta before closure.

Prefer convergence to **one live release authority per accepted product/research decision**. If two PRs are parts of one release and their overlap is narrow, absorb the independent files plus only the narrow shared-owner delta into the designated release head, then close the worker PR as `absorbed` with lineage. Do not sequentially merge parallel implementations merely because both are green.

Shared registries and scientific/publication owners require entry-level reconciliation. Preserve the newest authoritative surrounding file and transplant only the still-valid entry/change from the worker branch; never replace a current registry with an older whole-file blob to recover one useful row.

Immediately before every shared-ref write, refresh the branch head. An unexpected non-fast-forward means the snapshot used to construct the write expired. **Never force to recover the expected topology.** Inspect the intervening commit, rebuild the intended delta on the new head, and retry as a fast-forward. Any rebuilt head is a new exact-head acceptance identity.

Keep dependency-update cleanup separate from coordinated product/scientific release semantics. A stale lockfile/version PR, especially an unmergeable or major-version candidate, should be refreshed/re-generated on current `main`, explicitly deferred, or closed as stale; it must not hitchhike into the release merely to make the open-PR count reach zero.

Required closeout labels/reasons must distinguish `absorbed`, `superseded`, `rejected`, `deferred`, and `historical evidence retained`. “Closed” alone is not a scientific or product disposition.

Treat an `absorbed into #N` statement as a **disposition claim to verify, not proof**. Pin the predecessor exact head/base plus intended semantic delta, current `main` plus intervening owner drift, and successor exact head/base. For every intended predecessor contribution, prove survival at the narrowest artifact level: exact blob when it should remain byte-identical, patch/hunk equivalence when the text should remain identical, or an explicitly documented semantic transformation when ownership/topology changed. Preserve unique lineage/history in its historical owner. If any intended contribution is missing, repair the live successor/current owner or build a narrow successor from current `main`; do not revive and merge the stale whole tree. The predecessor's CI/Preview remains historical evidence for that predecessor exact head only; the surviving successor must satisfy its own current acceptance contract.

Historical case: [`../history/2026-09-08-open-pr-backlog-consolidation-and-exact-head-closeout-retrospective.md`](../history/2026-09-08-open-pr-backlog-consolidation-and-exact-head-closeout-retrospective.md).


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

### 4.1 Attribute conflicts before choosing a side

A conflict marker identifies an automatic-merge failure; it does **not** identify which recent PR caused the conflict or which blob owns the current meaning. Before choosing `ours` / `theirs` or copying a whole file, attribute the conflict.

For each material conflict:

1. compute the conflict-path set and the changed-path sets of the intervening `main` commits / candidate PRs;
2. distinguish exact path overlap from semantic-owner overlap; a newer PR with zero conflict-path overlap must not be blamed for, or discarded because of, conflicts inherited from an earlier merge;
3. when an older worker PR already landed on `main`, compare its exact PR head with the merged `main` blobs to see whether later policy/CI-only edits changed the file or whether the conflicting content is semantically identical;
4. retain current authoritative semantics plus the still-valid candidate contribution, then verify that disjoint newer work remains present in the final tree;
5. record the attribution in the integration PR so a future Agent can distinguish “conflicted after PR X merged” from “PR X actually touched this surface.”

Path-set intersection is an attribution aid, not a semantic-compatibility proof. A zero path intersection can show that one PR did not create those textual conflicts; shared schemas, navigation, generated output, or scientific authority can still conflict semantically and require owner-level review.

Anti-example: `main` advances through PR B, ten files now conflict, and the integrator chooses the candidate's whole-file versions while calling PR B “the conflict source” without checking that PR B's own changed paths are disjoint. That can silently erase valid work and creates a false causal record.

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
6. When a stacked parent merges during closeout, the child must be rebuilt on current `main`, proved as a child-only semantic delta, and requalified at the fresh exact head before merge.

Provider mechanics and repository merge settings are time-sensitive. Re-check them before repeating the implementation details; the semantic decision model is the durable part.