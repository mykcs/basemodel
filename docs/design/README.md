# BaseModel Design

This folder is BaseModel's **current design-direction system**, parallel to `docs/wish/` and `docs/dev/`.

It answers one question:

> **How should BaseModel turn correct research content into a web experience that is fast to understand, worth continuing to read, and still fully auditable?**

The three top-level systems have different jobs:

```text
Wish    -> what BaseModel should become
Dev     -> how BaseModel should be built and operated
Design  -> how research meaning should become content, narrative, HTML and visual hierarchy
```

Design does **not** own scientific facts, experiment status, deployment truth, or security policy. It also does not replace the existing narrow owners under `docs/agents/current/`.

## Files

- [LATEST.md](LATEST.md) — short current direction. Read before material user-facing design work.
- [SYSTEM.md](SYSTEM.md) — the durable BaseModel design model and authority boundaries.
- [PATTERNS.md](PATTERNS.md) — reusable content-to-HTML patterns. Patterns are semantic tools, not mandatory visual templates.
- [DELIVERY.md](DELIVERY.md) — Definition of Done and acceptance evidence.
- [IMPLEMENTATION.md](IMPLEMENTATION.md) — phased site-wide migration plan.
- [CODEX_LUNA_RUNBOOK.md](CODEX_LUNA_RUNBOOK.md) — autonomous long-running execution loop, checkpoints and stop conditions.
- [REFERENCE_PAGES.md](REFERENCE_PAGES.md) — first three pages that must prove Design v1 in real use.
- [ARCHIVE.md](ARCHIVE.md) — superseded design directions only.

Task-specific rollout state belongs under `docs/agents/tasks/`, not in this permanent folder.

## Relationship to existing current owners

The Design system **routes and composes** existing rules rather than duplicating them.

Important narrow owners remain:

- `docs/agents/current/site-reader-attention-contract.md` + `src/data/siteReaderContracts.ts` — route-level reader task and first-viewport contract;
- `docs/agents/current/ui-design-principles.md` — visual identity, editorial/workbench modes, card budget and visual rules;
- `docs/agents/current/website-design-spec.md` — BaseModel-specific public expression and scientific presentation boundaries;
- `docs/agents/current/research-site-presentation-contract.md` and `research-result-reading-contract.md` — research/result ordering;
- `docs/agents/current/human-thinking-web-expression-contract.md` — semantic web expression;
- `docs/agents/current/ui-change-visual-acceptance-gate.md` — browser visual acceptance;
- `docs/wish/LATEST.md` — product intent;
- scientific/result authorities — claims, numbers, panels and limitations.

If a future implementation proves that a detailed rule must change, update the detailed owner itself. Do not let `docs/design/` become a second copy of every current policy.

## Read rule

For ordinary page implementation:

1. read `docs/wish/LATEST.md`;
2. read `docs/design/LATEST.md`;
3. resolve the route's Reader Contract and scientific authority;
4. read the narrow current policies relevant to the change;
5. implement and validate against `DELIVERY.md`.

For a site-wide design-system change, also read `SYSTEM.md`, `PATTERNS.md`, `IMPLEMENTATION.md`, and the task-specific rollout document.
