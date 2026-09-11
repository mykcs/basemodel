# Q17 analysis publication / Slide 19 trajectory closeout — 2026-09-11

Status: **historical case record; not current operating or scientific authority**

Current owners:

- research presentation: `../current/research-site-presentation-contract.md`
- Preview/release workflow: `../current/deployment-policy.md`
- just-in-time use-site checks: `../current/scenario-trigger-registry.md`
- scientific truth: the current OpenEVO experiment authority, never this history file
- conversation closeout: `../../operations/governance/CONVERSATION_LESSONS_CLOSEOUT.md` → canonical protocol in `mykcs/openevo-experiment`

## Coverage boundary

The accessible conversation covered Q17 DirectApply/No-GDR authority-to-publication alignment, BaseModel integration, and later iterative briefing corrections. The owner directly corrected missing Preview handoff, stale Slide 19 content, and the accidental removal of the early R0–R69 trajectory when the slide was updated through R121.

Some older turns were available through conversation summaries and repository evidence rather than verbatim raw chat, so this record does not claim verbatim access to every historical turn. Current repository/provider state was re-read where it affected closeout decisions.

## Coverage ledger

| Feedback / failure | Repeated? | Reusable lesson | Canonical destination | Why there |
| --- | --- | --- | --- | --- |
| `为什么不给我preview连接` | **yes, known Preview family** | A review handoff is incomplete without a verified, clickable current-candidate Preview URL. | `scenario-trigger-registry.md` + existing `deployment-policy.md` | The workflow rule already existed; the missing piece was an owner-facing false-complete use-site check. |
| `网站slide19的内容要更新啊` | same-surface publication correction | When analysis changes, audit sibling reader surfaces that carry the same claim instead of updating only the website page or only the deck. | existing shared-surface / research-presentation owners | This family was already covered; no duplicate authority was created. |
| `slide19 为什么把 rollout0-70 的给我丢了` | **new direct correction** | A figure that claims a whole run / sealed snapshot must preserve the full relevant time axis and earlier trajectory; recent-window summaries are secondary, not replacements. | `research-site-presentation-contract.md` + regression test | This is publication integrity for longitudinal evidence, not one-off slide styling. |
| Full final-gate acceptance was repeatedly used while the owner was still reviewing small slide edits | **yes, existing rule was skipped** | Classify `active review` vs `merge-ready` before moving the final gate; active review stays on the fast review-only lane. | `scenario-trigger-registry.md` + existing `deployment-policy.md` | The rule existed, but lacked a sufficiently explicit pre-dispatch classification at the use site. |
| Head/base/provider evidence became stale whenever the candidate changed or `main` moved | recurring project-wide | Exact-head evidence belongs only to the exact head/base pair that produced it. | existing release / exact-state policy | Already startup-visible and mechanically protected; another copy would add drift. |
| Repeated “都完成了吗” questions | recurring project-wide | Report branch / PR / merged-main / Production as distinct states. | existing closeout and project operating principles | Already canonical; no duplicate rule added. |

## 1. Recent-window analysis must not erase whole-run evidence

The Slide 19 rewrite was trying to emphasize the late plateau/recovery story. The shortcut replaced the original full training curve with five recent 10-round block means. That made the newest interpretation easier to see, but it silently changed the visual question from “how did the run evolve from the start?” to “what happened after R70?”.

The missing pre-edit question was:

```text
what semantic object does this figure own?
whole-run history | sealed snapshot | intentionally recent window
```

If the answer is `whole-run history` or `sealed snapshot`, the x-domain and earlier trajectory are part of the evidence. A recent-window summary may be highlighted, overlaid, annotated, or placed beside the main figure, but it must not replace the earlier history while the title still implies the whole run.

If the intended figure really is recent-only, the title/caption must say so explicitly. This preserves the reader's ability to distinguish an analytical zoom from the experiment's actual longitudinal history.
## 2. Preview delivery was a repeated known failure

The repository already had a correct fast-Preview rule: during iterative review, use a lightweight review surface, open the hosted target route/anchor/slide, verify the claimed change, then give the owner the URL. The conversation still missed the link once and later used full final-gate acceptance repeatedly during active review.

That means the problem was not missing documentation. The use-site decision was too easy to skip. The durable repair therefore makes two checks explicit in the scenario trigger:

1. before moving the final gate, classify the surface as `owner still reviewing/correcting` or `merge-ready`;
2. if it is review handoff, the owner-facing response must contain a clickable URL for the current candidate or the handoff is false-complete.

The existing rule against reusing an old Preview after a source change remains unchanged. Final acceptance still belongs to the exact-head final gate once the candidate is actually merge-ready.

## 3. Preserve historical diagnosis while updating later evidence

The earlier R97 diagnosis and the later R0–R121 analysis answer different questions. The correct presentation keeps the earlier diagnosis visibly historical, then shows how later sealed evidence changed the interpretation. Updating a publication surface must not rewrite the earlier observation into something it did not know at that time.

This is already covered by current authority/history rules, so the closeout does not create a new scientific-policy source for it.

## Temporary information intentionally not promoted

The following were useful execution facts but are intentionally absent from standing policy:

- temporary Preview/share URLs and deployment IDs;
- current PR heads, mergeability, Vercel queue state, and one observed `main` SHA;
- local worktree paths, ports, PIDs, and temporary build state;
- momentary live experiment round/progress;
- any temporary provider or review status.
Scientific current state must still be re-read from the current experiment authority. Publication history is evidence about what was known and shown, not a live run-status feed.

## Repeated-mistake check

The Preview/handoff family **did repeat** even though the repository already had a rule and regression coverage. This closeout therefore does not add another retrospective reminder as the only repair. It strengthens the scenario trigger at the exact decision point and extends its regression witness.

The whole-trajectory cropping failure is a new correction in this evidence window. It is promoted to the research-presentation contract because the same semantic error could recur on any longitudinal training/result figure.

## Future-Agent test

A new Agent starting from root `AGENTS.md` should now reach two independent defenses before repeating these failures:

1. a research publication/briefing task loads `research-site-presentation-contract.md`, which says a whole-run/sealed-snapshot figure preserves the full relevant time axis and earlier trajectory;
2. a Preview/review task loads `scenario-trigger-registry.md`, which forces review-vs-merge-ready classification and marks a handoff without a clickable current-candidate Preview URL as false-complete.

The structural tests fail if either durable phrase disappears. The history record explains why the checks exist but never acts as current PR, provider, or scientific authority.

## Long-term memory boundary

No account-level ChatGPT memory mutation is claimed by this closeout. The durable project lessons are stored in repository current policy and regression tests; temporary state remains outside long-term memory.
