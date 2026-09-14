# PR #698 receipt-only scientific-boundary closeout — 2026-09-14

Status: **historical case record, not current authority**

Current rule owners:

- `../current/release-closeout-protocol.md` — exact-head acceptance, moving-main/base drift, research/provenance handling, and merge-time freshness;
- `../current/scenario-trigger-registry.md` — release/Production routing and live-state refresh;
- `../../operations/governance/CONVERSATION_LESSONS_CLOSEOUT.md` — BaseModel closeout entrypoint.

This record is a worked example. It must not be used as current experiment status.

## Durable lessons

### Receipt-only still needs exact-head and current-base review

A PR can be documentation-only and still become stale when `main` moves. The correct review is:

1. inspect the actual changed files/diff rather than trusting the title/body;
2. re-read the current PR head and current integration base;
3. compare concurrent changes for semantic overlap;
4. treat earlier green evidence as historical if head/base freshness is no longer valid;
5. rerun the repository-required checks for the actual merge candidate.

This is already owned by `release-closeout-protocol.md`; no duplicate current policy was added.

### Release-time science and current science are different temporal objects

A release receipt records the authority and sealed evidence that justified the released artifact at that time. Later research progress does not automatically make that historical receipt wrong, and the receipt must not be mistaken for current scientific truth after the authority advances.

For a research release receipt:

- verify that its release-time claims were true for the released artifact;
- separately inspect current scientific authority for contradictions;
- do not rewrite the old receipt merely to mirror later execution;
- do not promote later unsealed execution into an earlier release result;
- handle genuinely new science as a new publication update.

### Interim evidence must keep both fact and interpretation boundaries

A cold read must check two separate things:

- **fact boundary:** only sealed/authorized evidence is described as a result;
- **interpretation boundary:** an interim directional difference is not upgraded into superiority, causal efficacy, long-term stability, or a final-panel claim.

### Repeated accidental temp-file creation needs a stronger execution witness

During this closeout implementation, the Agent accidentally created `docs/agents/history/README.tmp`, removed it, and then created the same unintended file a second time before removing it again.

The second occurrence means the first correction did not change behavior enough. The strengthened rule for the remainder of the task was:

```text
before repository mutation
-> name the intended tool/action
-> name the exact target path
-> execute only if both match the plan

after cleanup
-> verify the actual changed-file list
```

This is recorded here as a concrete repeated execution mistake. It does not justify another mutable global policy source because the repository already owns broader exact-diff and shared-state discipline.

## Coverage ledger

| Feedback / failure | Repeated? | Reusable lesson | Canonical destination |
| --- | --- | --- | --- |
| `main` moved after the initial cold read | recurring hazard, not repeated as an error | refresh exact head/base and inspect overlap | `release-closeout-protocol.md` |
| release-time snapshot could be confused with current science | known provenance family | keep historical release receipt separate from current authority | `release-closeout-protocol.md` |
| PR called itself receipt-only | no review error | prove scope from the diff | existing release protocol + this case |
| interim numbers could be read as superiority/final | known scientific boundary | preserve sealed/interim/no-superiority/no-final wording | scientific authority + release protocol |
| temporary PR/CI/provider state could leak into policy | avoided | keep one-time state in dated evidence only | dated evidence, not standing policy |
| unintended `README.tmp` created twice during closeout | **yes** | pre-check intended action + exact path; verify final changed-file list | this case + existing exact-diff discipline |

## Temporary state intentionally not promoted

The following remain case evidence only and are not standing rules:

- one-time PR/head/base SHAs;
- one-time CI run IDs;
- one-time provider deployment IDs or Preview URLs;
- the exact `main` SHA observed during this review;
- live execution state of later Gated-Delta rounds;
- the fact that one concurrent PR happened to be non-overlapping.

Future Agents must re-read live state.

## Repetition check

The scientific/release mistakes this conversation was designed to prevent did **not** repeat: old green evidence was not blindly carried across base drift; receipt-only scope was inspected; later execution was not promoted into the release snapshot; and interim evidence was not turned into superiority/final claims.

A separate implementation mistake **did repeat** inside this closeout: the same unintended temp file was created twice. The corrective behavior was therefore strengthened from “delete it” to “verify action + path before the next write, then verify the final changed-file list.”

## Future-Agent test

A future Agent starting from root `AGENTS.md` already reaches the current release and scenario policies. Those files remain the authority. This dated record only supplies the worked example and the repeated-mistake evidence without creating a second mutable rule source.
