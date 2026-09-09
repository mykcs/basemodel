# Human Preference Learning closeout — OpenEVO briefing — 2026-09-09

Authority: `INGESTION-20260909-OPENEVO-BRIEFING` in `src/data/humanFeedbackIngestionCloseouts.ts`.

This is a completion receipt, not the preference source of truth. Recompute it with:

```bash
npm run feedback:ingestion-closeout -- INGESTION-20260909-OPENEVO-BRIEFING
```

Recorded source window: the OpenEVO summer/advisor briefing modification conversation ending with PR #569. The ledger contains 28 identified candidate feedback turns: 12 `ingest`, 7 `merge-duplicate`, 2 `superseded`, 5 `page-specific-only`, 2 `task-fact-not-preference`, 0 `ambiguous-hold`, 0 `out-of-scope`.

The closeout deliberately keeps `better`, `promising`, `accepted`, and `canonical` distinct. The final PR result is concrete `accepted` after conditional merge authorization; no briefing visual has reusable-template approval, so the Visual Reference Set contains no Golden reference.

The future-task proof uses a new advisor-briefing request phrased differently from the original feedback. It must retrieve the parameter-heading, phone/desktop, technical-depth, engineering-drilldown and scientific-chronology lessons. The evaluation proof intentionally omits `internal-detail-promoted-to-primary-attention` from a candidate receipt and requires the verifier to reject it.

Conversation-to-ledger semantic extraction was manual from the current conversation. The repository validates the structured result and recurrence behavior; it does not claim to read ChatGPT history automatically.
