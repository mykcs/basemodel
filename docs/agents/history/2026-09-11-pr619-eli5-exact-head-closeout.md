# PR #619 briefing ELI5 + exact-head closeout — 2026-09-11

Status: **historical evidence, not current policy**.
Current rules live in `website-design-spec.md`, `scenario-trigger-registry.md`, and `release-closeout-protocol.md`.

## What this conversation exposed

The owner asked for a cold read of BaseModel PR #619, then repeatedly asked the Agent to continue until the work was actually complete, requested an ELI5 merge recommendation, explicitly authorized merge, and finally requested conversation-lessons closeout.

Two reusable gaps appeared even though the underlying principles already existed:

1. **ELI5 cleanup had been treated too much like body-copy cleanup.** The main prose was already much better, but internal labels still survived in headings, metric strips, status words and chart-adjacent copy. The final cleanup removed examples such as `NOOP`, `accepted rollout`, `pass / reject`, and `authority loss`. The durable lesson is not a word blacklist: the whole visible surface must be reviewed, and necessary technical names remain when locally explained.
2. **A synchronous completion request nearly stopped at provider `pending`.** The correct behavior was to keep polling the exact candidate while the current session could still do useful work. This is distinct from installing a future watcher. `pending` is a state to monitor, not a completion report.

The conversation also reproduced a known release hazard: `main` moved while exact-head acceptance was running. The Agent correctly treated earlier green evidence as scoped to the older base, synchronized the same semantic candidate, reran the required acceptance, and merged only after explicit owner authorization with an expected-head guard. This behavior was already covered by the exact-head release policy, so no duplicate rule source was created.

## Coverage ledger

| Feedback / failure | Repeated? | Reusable lesson | Canonical destination | Why there |
| --- | --- | --- | --- | --- |
| Owner said to continue until completion after the Agent reported remaining work | yes, twice in this thread | poll an in-session exact check to terminal state or concrete blocker; do not stop at `pending` | `scenario-trigger-registry.md` + `release-closeout-protocol.md` | this is a release-state use-site rule, not a generic retrospective slogan |
| Owner asked for an ELI5 merge explanation | reinforces existing preference | owner-facing release advice should state the decision and reason in plain language; UI ELI5 review must cover all visible labels | `website-design-spec.md` | the copy preference already existed; only the implementation coverage gap was new |
| Owner explicitly said `合并` | no | authorization changes only after an explicit mutation instruction; re-read live tuple and lock expected head | existing `release-closeout-protocol.md` | already canonical; no duplicate rule needed |
| `main` advanced during final-gate work | known recurring release hazard | old green checks remain scoped evidence; resync/revalidate when current-base policy requires | existing exact-head policies | already strongly covered; this incident is evidence, not a new authority |

## What was intentionally not promoted

The closeout does **not** freeze temporary PR head SHAs, provider deployment URLs, transient `pending`/`READY` states, local worktree paths, process IDs, or one-time build timing into standing policy. PR #619 being merged is stable history, but future release decisions must still read live repository/provider state.

No new visual tier was created. This conversation did not contain new owner language making a specific slide design canonical/Golden; it primarily completed an already-requested ELI5/scientific-boundary pass and authorized integration.

No account-level long-term ChatGPT memory write is claimed by this repository closeout. Repository persistence and model/account memory remain separate layers.

## Future-Agent test

A new Agent starting from root `AGENTS.md` already reaches the scenario-trigger registry. On a future briefing/release task it should now:

- scan the entire visible presentation surface for internal-language residue, not only paragraphs;
- keep necessary technical terms but explain them where first used;
- when told to continue until completion, actively poll an available exact-head check instead of ending at `pending`;
- keep readiness separate from merge authorization;
- preserve old green evidence only at the head/base identity it actually validated.

If any of these behaviors regresses, the current policy and its regression test should fail before the owner has to repeat the same correction.
