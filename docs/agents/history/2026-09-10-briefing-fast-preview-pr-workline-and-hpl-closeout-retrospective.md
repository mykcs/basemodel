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
