# Briefing fast-Preview, PR workline, and HPL closeout retrospective — 2026-09-10

Status: **historical case record; not current operating authority**

Current owners:

- Preview/release workflow: `../current/deployment-policy.md`
- overlapping/same-surface PR integration: `../current/multi-pr-semantic-integration-playbook.md`
- just-in-time triggers: `../current/scenario-trigger-registry.md`
- human-preference learning: `../current/human-preference-learning-system.md`
- conversation-closeout protocol: `../../operations/governance/CONVERSATION_LESSONS_CLOSEOUT.md` → canonical protocol in `mykcs/openevo-experiment`

This record preserves why those rules were strengthened. It must not be used as current experiment status, PR status, Preview identity, or scientific authority.

## Coverage boundary

The accessible conversation covered the OpenEVO briefing redesign, HPL-driven copy/visual corrections, No-GDR/DirectApply slide addition, repeated Preview handoffs, and the subsequent HPL closeout. Some older turns were represented through repository closeout/HPL evidence rather than raw chat text, so this record does not claim verbatim access to every historical turn.

## Coverage ledger

| Feedback / failure | Repeated? | Reusable lesson | Canonical destination | Why there |
| --- | --- | --- | --- | --- |
| `pr 散落太多了 smartly合并一下` plus earlier same-surface consolidation requests | yes | One actively revised product surface should normally keep one survivor product PR; create a successor only for a real authority/base/authorization boundary. | `multi-pr-semantic-integration-playbook.md` | PR topology/integration is the owning workflow, not HPL visual preference. |
| `我的人类语音偏好库也积累了很多 据此修改 slide` | yes | Existing human feedback must affect first draft and pre-owner-review checks. | `human-preference-learning-system.md` | Already captured and tested by HPL; do not duplicate it into release policy. |
| `我新实验也得用在html表现和其他实验一样的分数loss表` | yes | New sibling experiments with the same measurements inherit the existing Score/loss visual grammar. | HPL CASE-088 / Preference Model | A research-visual preference, already ingested by HPL closeout. |
| `没看到曲线` after the Agent claimed curves were available | no (one direct incident) | A fast Preview is not delivered until the hosted target slide is opened and the claimed visible change is confirmed. | `deployment-policy.md` + scenario trigger | The missing use-site witness was in the review workflow, not the chart implementation. |
| Local clean build exposed a stale generated-chunk reference | no | Never upload the last successful `dist/` after the current build failed; clean only generated output and rebuild. | `deployment-policy.md` | Prevents stale artifact identity without authorizing broad cleanup. |
| HPL focused tests regressed when new events displaced older relevant evidence | no | New preference evidence must not silently evict older required lessons; fix bounded retrieval/closure instead of deleting old assertions or faking severity. | `human-preference-learning-system.md` / HPL tests | Already repaired in the HPL control plane; history only records the incident. |
| Assistant completion reports became stale while other actors moved PR/main state | recurring project-wide | Read live Git/PR/provider state immediately before saying open/merged/done; remembered status is historical. | canonical conversation closeout + release closeout | This rule already existed; the incident reinforces its use-site importance, so no duplicate current rule was added. |

## What actually went wrong

### 1. Same-surface feedback produced too many product worklines

The briefing stayed conceptually one product surface, but corrections were sometimes treated as reasons for successor PRs. That made “which PR is the current product authority?” harder than the product change itself.

The missing rule was not “merge everything”. The missing rule was a **survivor default**: while the owner is still iterating the same route/deck, keep updating the designated product PR unless the old line is genuinely unsafe, semantically obsolete, or separated by a different authorization boundary. HPL/control-plane work may still use a separate PR because it intentionally changes a different owner and can have a different merge contract.

### 2. Fast Preview optimized latency but lost artifact identity

The intended optimization was correct: do not run the complete final acceptance stack after every small slide correction. The failure was that the loop ended at “upload URL”. One handoff reused an older Preview while the assistant described the newer curve state, so the owner saw no curves.

The durable workflow is now:

```text
coherent edit
-> focused local checks
-> fresh successful static build
-> prebuilt review deployment
-> open hosted target route/anchor
-> verify the exact claimed object is visible
-> share URL
```

This target verification is deliberately narrow. It must not be inflated back into the full final release matrix during rapid review.

### 3. A failed current build cannot inherit an older successful `dist/`

During recovery, a clean build surfaced a stale generated-chunk reference in generated output. The correct response was to clear only rebuildable generated output and rebuild. The dangerous shortcut would have been to deploy the previous successful `dist/`, because provider success would then validate an older artifact while the conversation described newer source.

Generated-output cleanup is safe only because the directory is repository-owned and reconstructible. This does not authorize broad cache cleanup, source deletion, or worktree cleanup.

### 4. Preference retrieval capacity is part of correctness

Adding new HPL evidence caused old closeout tests to expose that a bounded top-N event set could evict still-relevant evidence. The correct repair preserved old tests, kept hard-family closure, enlarged the bounded relevance core modestly, and pinned the canonical Preview workflow only when Preview cues activate it.

The wrong fixes would have been: deleting old assertions, raising a one-off preference to `hard` to force retrieval, or returning the entire history on every query. The system must remain both bounded and complete for required lessons.

## Temporary information intentionally not promoted

The following were useful during execution but are not standing rules and are intentionally absent from current policy text:

- live No-GDR round, Score, loss, and shadow-GDR counts;
- temporary Vercel share URLs and deployment aliases;
- local PIDs, ports, worktree paths, and generated screenshot locations;
- momentary PR open/merged/mergeable states;
- transient build-provider timing such as one observed multi-minute deployment;
- current GPU/server occupancy.

Scientific live state belongs to current experiment authority or dated evidence; provider/PR state must be re-read live.

## Future-Agent test

A new Agent starting from `/AGENTS.md` reaches `scenario-trigger-registry.md`, then:

1. Preview work routes to `deployment-policy.md`, which now requires a fresh successful build and hosted target verification before handoff.
2. Multiple PRs on one active surface route to `multi-pr-semantic-integration-playbook.md`, which now requires a designated survivor product workline unless a real boundary justifies a successor.
3. Briefing visual/copy work separately loads HPL, where the repeated experiment-chart grammar and Preview preference evidence already live.
4. Final completion still requires a fresh live-state read; this history file never acts as current PR, Preview, or experiment authority.

The most serious repeat from this conversation — “owner becomes the first person to discover that the claimed Preview is not the claimed artifact” — now has an explicit use-site check before the URL is sent.

## Follow-up — reader-first case-cluster closeout and HPL retrieval proof

This later window continued the same BaseModel conversation after the earlier closeout. Product wording preferences such as `Track A` / `配对评测` and the case-cluster requirement already belong to the HPL CASE / Preference Model system; this follow-up therefore does **not** duplicate them as a second preference authority. It records only the execution and knowledge-system lessons that were still missing.

### Coverage ledger

| Feedback / failure | Repeated? | Reusable lesson | Canonical destination | Why there |
| --- | --- | --- | --- | --- |
| `OpenEvo · Track A 7B` and then `配对评测？这是什么意思？` | preference family already captured | Internal code and method jargon cannot replace concrete comparison objects in the first reader layer. | HPL CASE-065/066 + Preference Model | Already ingested preference evidence; conversation-lessons closeout must not count it again. |
| `Agent 能通过一系列案例总结出规律然后修改其他地方` | yes | Case clusters must change generation and sibling scanning, not become a larger blacklist. | HPL CASE-064/083 + current HPL owner | Existing preference owner already has the rule; this follow-up only checks the retrieval machinery. |
| First HPL closeout receipt missed case-cluster workflow evidence even though low-level retrieval knew the preference | new engineering gap | Workflow activation cues must agree across Preference Model retrieval and compiled Event/trajectory selection. Generic feedback-learning cues must not depend on Preview words, while Preview-specific evidence must stay opt-in. | `human-preference-learning-system.md` + `human-feedback-ingestion-closeout.md` | This is retrieval correctness, not a page preference. |
| First future-task proof used a broad `research-ui` scope while the relevant comparison Gold Pairs were owned by `research-copy` | no | Scope is semantic evidence selection, not a PASS knob. Pick the narrow honest task scope; do not broaden evidence to force retrieval. | `human-feedback-ingestion-closeout.md` | The closeout protocol owns future-task retrieval proof. |
| Focused HPL unit tests were green before the actual closeout receipt exposed missing retrieval signals | no | The source-window `feedback:ingestion-closeout` receipt is the integrated proof; focused tests are necessary but insufficient. | `human-feedback-ingestion-closeout.md` | Prevents false-complete HPL closeouts. |
| First RDC discovery command again used a Bash compound loop under the default Fish shell | **yes, repeated known failure** | Read root `AGENTS.md` before the first local terminal command in a closeout and name `/bin/bash` when Bash syntax is used. A task protocol read is not a substitute for the repository bootstrap. | root `AGENTS.md` already owns shell rule; HPL closeout now adds a use-site preflight | The rule already existed at startup and was still skipped, so another history reminder alone would not help. |
| Repeated status questions about “都完成了吗” | project-wide repeat, existing owner | Completion language must name the actual evidence stage instead of collapsing local draft / branch / PR / main / Production / HPL receipt into `done`. | existing exact-state closeout + project operating principles | Already current and startup-visible; no duplicate rule added. |

### Why the Fish/Bash repeat matters

This was not a new shell discovery. Root `AGENTS.md` already said, before any compound shell call, to set the outer interpreter to `/bin/bash` when Bash syntax is required. The failure happened because the task-specific HPL closeout started local execution before reloading the repository bootstrap. That makes the repair a **use-site ordering fix**: the HPL closeout protocol now explicitly loads root Agent instructions before its first local/RDC/terminal command.

The command failed at parsing, before repository mutation. Do not misclassify this as repository corruption or tool unavailability.

### HPL retrieval activation is a pipeline contract

The HPL stack has more than one selection layer. A workflow preference can exist and rank correctly in `retrieveHumanPreferenceContext(...)` but still disappear from the final task-time Brief if Event/trajectory selection uses a different cue family. The same mistake can also over-activate adjacent workflow evidence: for example, adding `feedback` cues must not automatically pin the canonical fast-Preview Event when the task says nothing about Preview.

The durable rule is therefore two-sided:

```text
intended workflow cue -> low-level preference + direct event/trajectory can appear
unrequested adjacent workflow cue -> remains absent
```

This is a bounded retrieval requirement, not permission to dump the whole preference history.

### Scope mismatch is not evidence loss

The first receipt also demonstrated that `research-ui` and `research-copy` are not interchangeable labels. If a comparison preference/Gold Pair is intentionally copy-scoped, a broad UI query can exclude it. The correct response is to choose the future task's honest scope, not to widen all historical evidence until the test passes.

### Temporary information intentionally not promoted

This follow-up does not preserve local worktree paths, temporary branch names, process IDs, transient test process state, current open-PR status, one observed SHA, or the momentary state of an unmerged HPL workline. Those facts must be refreshed from Git/provider state when needed. No account-level long-term memory write is claimed by this repository closeout.

### Future-Agent test

A new Agent starting from root `AGENTS.md` should now hit three defenses before repeating this window's mistakes:

1. root Fast Start names the shell before the first compound command;
2. the HPL closeout protocol repeats that rule at the task use site before any local/RDC/terminal execution;
3. HPL retrieval guidance requires positive/negative activation-cue parity plus honest task scope, and the integrated ingestion receipt remains the final generation/evaluation proof.

The key goal is not that the next Agent remembers this retrospective. It is that the next closeout is less likely to fail only after the owner or the final receipt exposes the same problem.
