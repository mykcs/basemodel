# Documentation

`docs/` has two jobs: route Agents to the **current source of instruction**, and retain historical evidence without letting old state masquerade as current policy.

## Start here

For active work, use this order:

1. [`/AGENTS.md`](../AGENTS.md) — fast repository router and non-negotiable invariants.
2. [`agents/LATEST.md`](agents/LATEST.md) — short-lived current handoff/state snapshot.
3. [`agents/README.md`](agents/README.md) — task-based reading map and precedence.
4. the matched owner under [`agents/current/`](agents/current/), then executable source/config/tests/live provider or experiment truth.

## Directory map

```text
docs/
├─ README.md                         this index
├─ V2_PRODUCT_COMPLETION_MATRIX.md  fixed-path legacy audit fixture; see below
├─ agents/
│  ├─ README.md                      task router and precedence
│  ├─ LATEST.md                      current handoff
│  ├─ current/                       authoritative current owners + explicit compatibility shims
│  └─ history/                       incidents, completed audits/pilots/migrations/closeouts
├─ agent-context/                    compatibility entrypoint for older links
└─ archive/                          superseded pre-current product/context snapshots
```

### `agents/current/`

Put a document here only when it is an authoritative rule, runbook, map, maintained current inventory/state owner, or an explicitly documented fixed-path compatibility shim required by executable repository consumers. If an owner already exists, update it instead of creating another overlapping policy.

A date in a filename does not by itself make a file historical. Ask whether the file owns behavior today and whether source/tests actively consume it.

### `agents/history/`

Use for a dated incident, completed audit, pilot, migration/adoption record, retrospective, or superseded Agent-facing state whose rationale is still likely to help future work. History explains **why**; it does not override current policy.

### `archive/`

Use for old product milestones, one-off plans, and context from before the current Agent-documentation system. Archived files are evidence from their original date and may intentionally mention retired providers, old paths, or old completion state.

`agent-context/` remains only as a compatibility entrypoint so older repository links do not send readers directly into stale instructions.

## Fixed-path compatibility exceptions

Compatibility files are allowed only when moving the path would otherwise break executable repository behavior. They must say plainly that they are not the current semantic owner.

### V2 matrix

`V2_PRODUCT_COMPLETION_MATRIX.md` mirrors [`archive/V2_PRODUCT_COMPLETION_MATRIX.md`](archive/V2_PRODUCT_COMPLETION_MATRIX.md) because `scripts/audit-v2-completion.ts` still reads the root path. Treat it as a historical V2 acceptance artifact. Keep the two copies byte-identical until that executable consumer is deliberately migrated; then remove the compatibility copy in the same change.

### Vercel migration-plan path

`agents/current/vercel-preview-migration-plan.md` is a small compatibility shim because current tests still read that historical filename for a few deployment/security invariant strings. The completed Vercel adoption record lives at [`agents/history/2026-08-12-vercel-preview-production-adoption.md`](agents/history/2026-08-12-vercel-preview-production-adoption.md).

The shim is **not** deployment authority. Current behavior is owned by [`agents/current/hosting-architecture.md`](agents/current/hosting-architecture.md), [`agents/current/deployment-policy.md`](agents/current/deployment-policy.md), and executable provider configuration/tests. If the tests are deliberately migrated away from the old path later, delete the shim in the same change.

## Documentation lifecycle

When work produces reusable knowledge:

- current cross-task rule → update the existing owner in `agents/current/`;
- short-lived live status → update `agents/LATEST.md` in place;
- reusable failure/recovery case or completed Agent-facing audit/migration → `agents/history/`;
- superseded pre-current milestone/plan/context snapshot → `archive/`;
- task-local scratch notes → do not commit them as durable documentation.

Do not create a second current document merely to reconcile disagreement. Resolve the disagreement against executable/live truth, then update or demote the stale owner.

## Authority

```text
current user instruction
> live provider state for provider-side claims
> executable repository / experiment truth
> docs/agents/current/* semantic owners
> docs/agents/LATEST.md
> compatibility shims (only for their fixed-path contract)
> docs/agents/history/* and docs/archive/*
```

For the detailed Agent reading model and task bundles, continue to [`agents/README.md`](agents/README.md).
