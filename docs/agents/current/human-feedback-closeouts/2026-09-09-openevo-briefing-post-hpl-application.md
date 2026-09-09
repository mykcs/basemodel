# Human Preference Learning closeout — OpenEVO briefing post-HPL application — 2026-09-09

Authority: `INGESTION-20260909-OPENEVO-BRIEFING-POST-HPL-APPLICATION` in `src/data/humanFeedbackIngestionCloseouts.ts`.

This source window begins after the prior PR #607 HPL closeout was merged and covers the owner asking to apply those learned rules back to PR #605, the subsequent repeated Slide 3 correction, and the final concrete acceptance of exact head `56b5120b…` into `main@edad8507…`.

Recompute with:

```bash
npm run feedback:ingestion-closeout -- INGESTION-20260909-OPENEVO-BRIEFING-POST-HPL-APPLICATION
```

The ledger contains **7** candidate owner turns: 2 `ingest`, 3 `merge-duplicate`, 1 `task-fact-not-preference`, 1 `out-of-scope`, and 0 unresolved holds.

## New learning

- HPL application itself can regress: the first post-closeout draft still used `我们不是只跑一次实验，而是一步步换问题去验证` as Slide 3 title.
- The owner explicitly called this a repeated `不是……而是……` mistake. Reuse CASE-081; do **not** create a word blacklist.
- `defensive-negation-opening` and `anticipatory-rebuttal` are therefore hard families and must be checked before owner review.
- Concrete Gold Pair: `我们不是只跑一次实验，而是一步步换问题去验证` → `我们做过哪些尝试`.
- PR #605 `56b5120b…` is concrete `accepted` and its visual reference is Silver. It is not canonical/Golden because no future-template language was given.

## Trajectory / visual state

`670ab9b4…` remains a historical current-candidate from the earlier source window. `e9b767d4…` is Rejected for the repeated binary-contrast framing. `56b5120b…` is accepted/Silver and supersedes the old active candidate. No briefing visual is Golden.

## Future-task proof

The future query is intentionally a different advisor talk containing an experiment-summary slide, minimal two-stage method context, low-score diagnostics, a parameter gate and final results. The generated Preference Brief must retrieve the new defensive-framing hard family together with event-first headings, self-contained method context, diagnostic motivation, scientific decision-chain rules, internal-detail attention boundaries, and the accepted-not-canonical status of the final PR #605 visual.

Evaluation proof removes `defensive-negation-opening` from a synthetic candidate receipt's hard-family checks; validation must fail. Restoring the full hard-family set must pass. This proves the system checks the mechanism rather than banning the words `不是 / 而是`.

## Ingestion-system gap fixed

Adding the new PR #605 events initially pushed the older `EVENT-20260909-DIAGNOSTIC-MOTIVATION-MISSING` outside the direct-event top-K, which made a predecessor hard lesson disappear from a realistic future Preference Brief. Increasing a fixed K by a couple of rows was still brittle. The compiler now takes the 20 most relevant direct events, then closes over additional in-scope events carrying any hard failure family, with an absolute cap of 30. Old hard evidence therefore survives corpus growth without dumping the full event history into every prompt.

Conversation → ledger semantic extraction remains Agent-interpreted because the repository still has no direct ChatGPT turn-export API. Coverage, exact-head evidence, verdict/tier boundaries, retrieval and recurrence rejection are executable.
