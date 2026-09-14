# SD-LoRA parallel lineage + Study grouping conversation closeout

Date: 2026-09-14  
Status: **historical closeout evidence; not current scientific, product, deployment, or experiment authority**

This record captures reusable lessons from the conversation that separated two concurrent SD-LoRA engineering-acceleration worklines, published them without mixing evidence, and then corrected the Study directory so one reader-facing parent label could contain two distinct scientific children.

Current operating rules live in `docs/agents/current/*`, root `AGENTS.md`, executable tests, and the canonical closeout protocol in `mykcs/openevo-experiment`. The merged OpenEvo lineage registry remains the scientific identity authority for the two acceleration lines.

## Coverage boundary

Reviewed evidence includes the accessible conversation, current BaseModel `main`, the merged SD-LoRA lineage/publication work, current Study navigation source/tests, current release/multi-PR/shell policies, and the prior 2026-09-13 SD-LoRA v2 Study-index closeout.

Temporary PR heads, Vercel deployment IDs/URLs, provider queue states, local ports/PIDs/worktree paths, and transient branch timing are intentionally excluded. Merged PR history and canonical routes remain recoverable from Git/GitHub when needed.

## What actually taught us something

### 1. A shared umbrella phrase is not enough to identify a scientific workline

Two concurrent Agents were both described informally as working on “SD-LoRA engineering acceleration / VR”. That label was too coarse for safe integration. One line changed stable reduction semantics while still retaining the growing historical component set; the other changed the historical-state representation through bounded online recurrence.

Before merging website copy, branches, or conclusions, identify each line by its mechanism, exact scientific authority, evidence owner, and estimand. A generic umbrella name is useful for discovery but is not a treatment identity.

### 2. Preserve a line before reconciling it with a concurrent sibling

The shared research branch had moved concurrently. Force-restoring the expected branch would have risked overwriting another Agent. The safe pattern was to preserve the completed work on an unambiguous branch/tag anchor first, then compare sibling work read-only and integrate through a separate reconciliation authority.

The durable rule already exists in the multi-PR and shared-state policies: unexpected branch movement is a stop-and-read event, and a non-fast-forward must not be “fixed” by force merely to recover the topology we expected.

### 3. Navigation taxonomy is not scientific treatment identity — and the umbrella must not steal a child's formal name

An earlier step in this conversation used `SD-LoRA v2` as the Study parent label while visibly nesting `Stable Reduction` and `Bounded Online Recurrence`. That was useful for exposing the taxonomy-versus-treatment distinction: a reader-facing navigation group can be broader than one scientific child without becoming a third treatment or merging the children scientifically.

Later exact-lineage reconciliation exposed the remaining naming bug. The formal `SD-LoRA v2` identity belongs only to `Stable Reduction`; `Bounded Online Recurrence` is an independent lineage. Reusing `SD-LoRA v2` as the shared parent therefore made the sibling look like a v2 treatment even though the child routes, evidence, and estimands stayed separate. The parent was corrected to the neutral umbrella `SD-LoRA 加速` / `SD-LoRA acceleration` while both children retained their own canonical names.

The durable rule is narrower and stronger: use a neutral navigation umbrella when several independent treatments are grouped and one child owns the tempting parent label as a formal scientific name. Reuse a treatment/version name as the parent only when upstream scientific authority explicitly defines that name as the umbrella for every child. The parent may remain non-clickable; each child keeps its own route, evidence, metric/estimand, lineage, and claim boundary. Browser acceptance must prove the hierarchy on desktop and phone, not merely source order.

This sequence is also a knowledge-system lesson: historical owner corrections remain evidence, not standing copy authority. A future Agent must resolve the current lineage owner and current navigation owner before replaying an old literal label.

### 4. Do not create a second reconciliation PR when a better current owner already exists

During reconciliation, a parallel OpenEvo PR was discovered that already encoded the two canonical line IDs, exact scientific authorities, separate speed estimands, and a third-line Gated-Delta boundary with machine-readable tests. Opening another competing integration path would have recreated the ambiguity the task was supposed to remove.

The correct response was to adopt that existing PR as the single integration path while retaining the separate preservation branch/tag only as safety evidence. This is an application of the existing multi-PR convergence rule, not a new policy family.

### 5. Moving `main` invalidates release evidence even when the feature did not change

`main` moved several times while final acceptance was running. Some moves were independent docs changes; others touched shared Reader Contract/navigation owners. Each move required reclassification before carrying evidence forward. Overlapping moves required a semantic rebase and fresh exact-head acceptance; provably independent docs-only moves could reuse unchanged product-tree browser evidence only after verifying that the product/test/config tree was identical.

This behavior is already owned by `release-closeout-protocol.md`; the lesson here is activation discipline, not another release policy.

### 6. A real hosted failure is not noise just because local focused tests were green

One Vercel gate found a first-screen contract failure that the earlier focused browser set did not expose. The fix changed the actual first-screen information owner instead of weakening the viewport budget. Later hosted acceptance passed the same contract.

The existing release rule remains correct: classify the red result first; if the product violates a still-valid contract, fix the product rather than the threshold.

### 7. The Fish/Bash failure family repeated again

Several local commands with Bash heredoc/assignment syntax were initially sent through a Fish-launched surface and failed before execution. This is a repeated known mistake. Root `AGENTS.md`, `project-agent-operating-principles.md`, and the scenario registry already contain the right rule, so adding another shell policy would be duplication.

`REPEAT-CORRECTION` witness for this closeout: `compound Bash/heredoc -> root AGENTS + project-agent-operating-principles -> tool-reported outer interpreter checked as /bin/bash -> compound command allowed only on that explicit Bash surface -> invalidate immediately if the tool reports Fish/another shell or the command crosses another parsing layer`.

The failure was at use-site execution, not knowledge absence. Parser failure before mutation remains `NOT_EXECUTED`.


### 8. Docs-only Production detachment does not waive exact-head Vercel merge authority

During this closeout, the Agent incorrectly inferred that a docs/governance/tests-only PR should not request the Vercel final gate. GitHub branch protection rejected the merge because the required `Vercel` status was absent. Re-reading current `deployment-policy.md` showed the precise split: an explicit final-candidate gate still runs exact-head Vercel acceptance (with risk-based browser work allowed to skip when proven non-UI), while a proven docs/governance-only range on `main` must not publish or replace the Production website artifact.

This was another policy-activation/use-site failure, not a missing-rule failure. The durable deployment owner already states the correct behavior. Future closeout must distinguish **merge authority** from **Production deploy relevance** instead of collapsing both into “docs-only does not deploy.”

## Coverage ledger

| Feedback / failure | Repeated? | Reusable lesson | Canonical destination | Why there |
| --- | --- | --- | --- | --- |
| Two concurrent “SD-LoRA VR” Agents looked similar | New concrete instance of parallel-lineage risk | resolve mechanism + scientific authority + estimand before integration | merged OpenEvo lineage registry + existing BaseModel lineage tests; this history case | scientific identity already has an executable owner; do not create another registry |
| Parent naming changed from `SD-LoRA v2` to neutral `SD-LoRA 加速` after exact-lineage reconciliation | **Yes; the earlier correction remained reachable as historical guidance** | a navigation umbrella may be broader than its children, but must not borrow a formal name owned by only one child | `research-site-presentation-contract.md` + Study source/browser regressions | current policy now encodes the neutral-umbrella rule while executable tests protect the concrete hierarchy |
| Shared research branch moved under another Agent | Known concurrency family | preserve first; never force branch topology back to expectation | existing `project-agent-operating-principles.md` + `multi-pr-semantic-integration-playbook.md` | current rules already own shared-state safety |
| Nearly created a duplicate reconciliation path | Known multi-PR family | one scientific/product decision should converge to one live integration authority | existing `multi-pr-semantic-integration-playbook.md` | duplicate policy would worsen the problem |
| `main` moved repeatedly during final gates | **Yes** | classify overlap, rebuild current-base candidate, and requalify exact head when required | existing `release-closeout-protocol.md` | release owner already contains the exact rule |
| Hosted first-screen gate found a real regression | Known gate-integrity family | fix product/contract ownership, not threshold, when the contract is still valid | existing `release-closeout-protocol.md` + Reader Contract/browser tests | executable gate owns acceptance |
| Bash/heredoc under Fish | **Yes** | verify the outer interpreter before compound syntax; parser failure is NOT_EXECUTED | existing root `AGENTS.md` + project principles + scenario registry | rule is already startup-visible; failure was use-site activation |
| Docs/governance-only final candidate was treated as exempt from Vercel | New closeout-time activation failure | exact-head Vercel remains required merge authority; only merged-main Production relevance may be ignored | existing `deployment-policy.md` + `release-closeout-protocol.md` | the rule already existed; the failure was conflating merge acceptance with Production publication |

## Future-Agent test

Before changing a research directory that groups several related methods, a future Agent should be able to answer:

1. Is this label a scientific treatment identity, a reader-facing navigation group, or both in different contexts?
2. If the group spans independent treatments, does the parent use a neutral umbrella rather than a formal treatment/version name owned by only one child?
3. Is it visually/semantically presented as a group rather than a third result destination?
4. Do the child treatments keep separate canonical routes, evidence, estimands, provenance, and claim boundaries?
5. If another Agent is working on a similar line, have I found the exact current lineage/integration owner before creating a competing PR or branch mutation?
6. If `main` or the shared branch moved, did I classify the semantic overlap before carrying forward acceptance evidence?
7. Does responsive browser acceptance prove the intended parent/child hierarchy is visible, not merely present in the DOM?
8. Before compound local shell syntax, did the execution tool actually report Bash as the outer interpreter?
9. For docs/governance-only closeout, did I still obtain the required exact-head Vercel status before merge while keeping merged-main Production non-deploy-relevant?

If these checks run, the most important failures from this conversation—scientific-line conflation, navigation/treatment identity conflation, duplicate integration authority, and repeated shell misuse—are materially harder to repeat.

## Temporary state intentionally not promoted

Do not freeze current PR heads, branch heads, Vercel deployment IDs/URLs, provider READY/BUILDING states, local ports/PIDs/worktree paths, one-time CI counts, or intermediate merge timing as standing policy. Re-read provider/repository state when it matters.

Merged scientific lineage and merged product behavior remain reconstructible from their canonical repositories and executable tests; this closeout records the reusable decision model rather than a transient status ledger.

## Long-term memory boundary

No account-level long-term ChatGPT memory write is claimed by this closeout. The durable information needed for this project is stored in repository policy, executable tests, the merged scientific lineage owner, and this indexed historical case. Repository authority remains stronger than any remembered summary.
