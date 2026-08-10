# Final product hardening — 2026-08-10

This file records the final product-audit defects that must remain closed after the V2 adversarial closeout.

## Research-integrity invariants

1. Current hosted/API models and current open-weight models are distinct concepts. A family may point to different records for each surface.
2. Absence from an API catalog is not proof that weights do not exist. Only explicit first-party evidence may set a weight fact to `false`/`unavailable`; otherwise use a semantic unknown.
3. SEED's released `Seed-AlfWorld-3B` checkpoint is available and must not be shown as unpublished/unavailable.
4. Paper-card "reproduction evidence completeness" is not the same as experiment cost/difficulty.
5. Atlas-derived summaries or heuristics must be visibly labeled as derived/estimated.

## Product hierarchy invariants

1. Model Explorer core filters are research constraints (weights, update method, currentness, local resource, paper adoption). Vendor/family/architecture/parameter metadata belong to the advanced catalog layer.
2. Decision view groups models by research meaning before exposing the complete catalog.
3. Home starts from three user intents: reproduce a paper, design a new experiment, replace an older model. Beginner learning routes to `/guide/`.
4. Home example counts must be computed from live catalog rules, not hard-coded demo numbers.
5. Paper/model matrix is advanced detail, not the default papers experience.
6. Decision Memo renders a human-readable research record first; Markdown/JSON remain export formats.

## Visual invariants

1. Research-critical reasons/risks/evidence must not be rendered as tiny metadata.
2. Small active controls must use a fill/text pair with WCAG-AA contrast; the soft terracotta accent is not a white-text fill.
3. Prefer editorial rows/dividers over additional card containers when hierarchy is clearer without a card.
4. Workspace desktop columns must reserve enough width for constraints and evidence; mobile remains pane-based.

## Validation

Any future closeout claiming these items complete must include static assertions and Playwright coverage for the actual user paths, not just component existence.

The `agent/final-product-hardening-final` branch is intentionally a single-push Cloudflare validation branch created from the completed implementation head. Its purpose is to validate the final state once, without replaying intermediate commits that intentionally failed later acceptance gates.

PR #88 is the authoritative final-state Cloudflare validation run for this hardening batch.
