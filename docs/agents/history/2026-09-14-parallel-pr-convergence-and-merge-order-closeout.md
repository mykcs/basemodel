# Parallel PR convergence + merge-order closeout — 2026-09-14

Status: **historical closeout evidence; not current scientific, product, deployment, or experiment authority**

Current owners:

- `../current/multi-pr-semantic-integration-playbook.md` — parallel-PR convergence, stale-governance reconciliation, and merge ordering;
- `../current/project-agent-operating-principles.md` + root `AGENTS.md` — provider-write hygiene and repeated-correction use-site activation;
- `../current/release-closeout-protocol.md` — exact-head/current-base acceptance and Production closeout;
- OpenEVO canonical lineage authority — scientific treatment identity and evidence ownership.

## Coverage boundary

This closeout covers the accessible conversation that reconciled BaseModel PRs #707/#708 with OpenEVO PR #478 after newer authority had already landed, created the narrow BaseModel successor #710, sequenced the independent factual metadata repair #705 before the docs/governance successor, and verified the resulting Production publication.

The earlier lineage/navigation lesson is **not re-ingested** here. It already lives in `2026-09-14-sd-lora-parallel-lineage-and-study-grouping-conversation-closeout.md`, current BaseModel policy/tests, and the OpenEVO lineage authority. This follow-up records only the still-missing operational lessons.

Temporary PR heads, CI run IDs, Vercel deployment IDs/URLs, one-time worktree paths, local PIDs, and provider timing are intentionally excluded. Stable merged PR numbers may appear only to explain the historical decision sequence.

## Durable lessons

### 1. Re-read live authority before treating a parallel-PR snapshot as current
The initial task framed #707, #708, and #478 as three nearly simultaneous candidates. A fresh read showed that #707 had already merged and OpenEVO had already merged #483, which owned the scientific-side lineage-resolution lesson. Treating the original chat framing as current would have created duplicate mutable governance.

The safe response was to classify the surviving semantic deltas, not preserve the old PR count: keep #707 as the navigation/treatment-boundary owner, let OpenEVO current authority own scientific lineage resolution, retain only #708's genuinely distinct pre-write semantic-overlap lesson in a narrow current-main successor, then close the superseded predecessors with explicit absorption lineage.

### 2. Merge order matters even when two independent PRs are already green

After the narrow governance successor was accepted, another independent PR was also current-base and fully green. That PR repaired a user-visible factual contradiction: the Gated-Delta page body said the frozen four-round qualification was sealed while route metadata still said the comparison was incomplete.

Merging the docs/governance PR first would have advanced `main` and invalidated the factual repair's exact-current-base acceptance, forcing the more important user-visible correction through another full qualification. The lower-cost path was the reverse: merge the factual repair first, then rebuild the docs/governance PR on the new `main`, prove its three-file semantic delta remained narrow, and obtain fresh exact-head/current-base acceptance.

The durable rule is now explicit in `multi-pr-semantic-integration-playbook.md`: for independent accepted candidates, merge ordering is release scheduling. Dependency still comes first; otherwise prioritize correctness/authority harm and then revalidation cost. This is not permission to merge an unsafe or unauthorized PR.

### 3. `REPEAT-CORRECTION`: accidental provider-write/action mismatch happened again

The intended action was to open a PR, but the Agent selected a file-creation mutation and created an unintended repository file named `__noop__`. It was deleted immediately and the branch history was restored to the intended semantic commit, so no accidental file reached `main`.

This failure family was already recorded in the PR #698 closeout, where an unintended temp file was created twice. Current project principles and the retrospective trigger already said to bind the target object to the exact action before dispatch. The failure therefore came from **use-site activation**, not missing knowledge.
Because the same mistake escaped a startup-visible rule again, this closeout promotes only a short use-site guard to root `AGENTS.md`: immediately before a non-read provider call, bind `intended object -> exact action -> exact target`; `open PR -> create_pull_request` cannot be substituted by a file/ref/branch mutation. The detailed rule remains in its existing owner rather than being copied into another policy.

Correction-to-action witness for future recurrence:

```text
provider write requested
-> root AGENTS + project-agent-operating-principles
-> intended noun/action/target written down and selected tool schema names the same noun
-> dispatch exactly that action
-> invalidate if the tool recipient/schema targets another object or the live target moved
```

### 4. A shared final-gate control plane must not be preempted

The Vercel final-gate ref was already running acceptance for the factual repair when the governance successor became ready. The correct behavior was to leave the active gate alone, verify that it was genuinely still building, and only move the gate after the earlier candidate reached a terminal successful state. This is an application of existing provider-control rules, not a new Vercel policy.

### 5. Deployment relevance is a range property, not the label of the latest merge

The later governance merge itself changed only Agent docs/tests, but Production still needed to build because the not-yet-published `main` range also contained the earlier user-visible metadata repair. The provider correctly classified the cumulative Production range and built it.

Future Agents must not conclude “latest merge is docs-only, therefore Production should skip” without resolving the actual deployed-base-to-`main` range. The existing deployment machinery already did the right thing; this case records why that behavior matters.

## Coverage ledger
| Feedback / failure | Repeated? | Reusable lesson | Canonical destination | Why there |
| --- | --- | --- | --- | --- |
| Original three-PR framing had already gone stale after newer merges | Known moving-authority family | re-read live current owners before integration; chat framing is not authority | existing multi-PR playbook + OpenEVO lineage authority | current owners already exist; no second registry |
| #708 / #478 overlapped with newer governance owners | Known multi-PR family | preserve only unique semantic delta and record explicit absorption/supersession | existing multi-PR playbook + this history case | avoids duplicate mutable authority |
| Two independent accepted PRs were both green | **New concrete scheduling lesson** | order merges by dependency, user-visible correctness/authority harm, then revalidation cost | `multi-pr-semantic-integration-playbook.md` §3.5 | merge order changes exact-head acceptance cost |
| Intended PR creation dispatched as an unintended file creation | **Yes — same failure family as the PR #698 closeout** | bind noun → exact action → exact target immediately before dispatch; change surface after repeated mismatch | root `AGENTS.md` + existing project principles + this case | the rule existed but was not activated at the use site |
| Shared Vercel final gate was already active | Known provider-control family | do not preempt an in-progress final candidate; wait for terminal state | existing deployment/release owners | no new provider policy needed |
| Latest merge was docs-only but unpublished range still contained page changes | New observation, existing machinery behaved correctly | determine Production relevance from deployed-base → current-main range | this history case + existing deployment machinery | rationale is reusable; control semantics already executable |

## Future-Agent test

A future Agent starting only from repository entry documents should be able to answer:

1. Did I refresh live scientific/product/governance ownership before preserving an old parallel-PR framing?
2. If several independent candidates are already accepted, which merge order minimizes user harm and exact-head invalidation without widening merge authority?
3. After the first merge advanced `main`, did I rebuild and revalidate every remaining current-base candidate that still needs to land?
4. Immediately before a provider write, does the selected tool schema name the same object and action I intend to mutate?
5. If an accidental write occurred, did I clean only that object and verify the final changed-file/ref set before continuing?
6. Am I judging Production relevance from the actual deployed-base → `main` range rather than from the label of the latest commit?
If these checks run, the important failures from this conversation — stale parallel authority, wasteful merge ordering, and repeated provider-action mismatch — are materially harder to repeat.

## Temporary state intentionally not promoted

The following are deliberately **not** standing policy or long-term memory:

- one-time branch/head/base SHAs and merge timing;
- CI run IDs, test-count snapshots, provider queue/build state, or deployment IDs/URLs;
- temporary worktree paths, local process IDs, and one-off monitoring commands;
- which unrelated PR happened to be open or waiting at this moment.

Merged history remains reconstructible from Git/GitHub. Future work must re-read current repository, scientific authority, and provider state instead of replaying this dated status.

## Long-term memory boundary

No account-level long-term ChatGPT memory write is claimed by this closeout. This conversation has no verifiable memory-write receipt. The durable project knowledge is stored in repository startup policy, the existing current owners, executable regression coverage, and this indexed historical case.
