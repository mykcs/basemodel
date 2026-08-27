# Final product hardening closeout — 2026-08-10

Status: **historical closeout evidence; not a current policy owner**

This record captures the V2 hardening batch and the invariants it was designed to protect. Current semantic ownership now lives in `../current/product-and-research-integrity.md`, the current UI/knowledge-architecture policies, and executable `scripts/audit-final-product-hardening.ts`.

The closeout protected these classes of behavior:

## Research-integrity invariants

1. Current hosted/API models and current open-weight models are distinct concepts.
2. Absence from an API catalog is not proof that weights do not exist; unsupported facts remain semantic unknowns.
3. SEED's released `Seed-AlfWorld-3B` checkpoint must be represented as available when the evidence supports it.
4. Paper-card reproduction evidence completeness is not the same as experiment cost/difficulty.
5. Atlas-derived summaries or heuristics must be visibly labeled as derived/estimated.

## Product hierarchy invariants

1. Research constraints lead Model Explorer; vendor/family/architecture metadata is secondary catalog detail.
2. Decision views group models by research meaning before exposing the complete catalog.
3. Home gives clear research entry intents rather than hard-coded demo counts.
4. Paper/model matrix is advanced detail, not the default papers experience.
5. Decision Memo renders a human-readable research record first; Markdown/JSON remain export formats.

## Visual invariants

1. Research-critical reasons/risks/evidence must not be rendered as tiny metadata.
2. Active controls require an accessible fill/text contrast pair.
3. Prefer editorial hierarchy over indiscriminate card containers.
4. Workspace responsive geometry must preserve usable constraint/evidence space.

## Acceptance evidence at the time

The batch required static assertions plus Playwright coverage for actual user paths. PR #88 was the authoritative final-state Cloudflare validation run for that historical batch.

Do not restore the historical Cloudflare validation workflow from this record. The durable behavior is now protected by current policy and executable audits; current deployment authority is Vercel.
