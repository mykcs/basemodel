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
│  ├─ current/                       authoritative current policies/runbooks/maps
│  └─ history/                       reusable incidents, migrations and retrospectives
├─ agent-context/                    compatibility entrypoint for older links
└─ archive/                          superseded product snapshots and pre-current context
```

### `agents/current/`

Put a document here only when it is an authoritative rule, runbook, map, or state owner that a new Agent should act on today. If an owner already exists, update it instead of creating another overlapping policy.

### `agents/history/`

Use for a dated incident, migration, retrospective, or superseded Agent-facing case whose rationale is still likely to help future work. History explains **why**; it does not override current policy.

### `archive/`

Use for old product milestones, one-off plans, and context from before the current Agent-documentation system. Archived files are evidence from their original date and may intentionally mention retired providers, old paths, or old completion state.

`agent-context/` remains only as a compatibility entrypoint so older repository links do not send readers directly into stale instructions.

### Root V2 matrix compatibility file

`V2_PRODUCT_COMPLETION_MATRIX.md` is an intentional fixed-path compatibility mirror of [`archive/V2_PRODUCT_COMPLETION_MATRIX.md`](archive/V2_PRODUCT_COMPLETION_MATRIX.md). The repository's executable `scripts/audit-v2-completion.ts` still reads the root path, so deleting or moving that copy would break `verify:deploy`.

Treat the matrix as a historical V2 acceptance artifact, **not** as current product/deployment authority. Keep the two copies byte-identical for as long as the executable audit retains the legacy path; if that audit is deliberately migrated later, remove the compatibility copy in the same change.

## Documentation lifecycle

When work produces reusable knowledge:

- current cross-task rule → update the existing owner in `agents/current/`;
- short-lived live status → update `agents/LATEST.md` in place;
- reusable failure/recovery case → `agents/history/`;
- superseded milestone/plan/context snapshot → `archive/`;
- task-local scratch notes → do not commit them as durable documentation.

Do not create a second current document merely to reconcile disagreement. Resolve the disagreement against executable/live truth, then update the stale owner.

## Authority

```text
current user instruction
> live provider state for provider-side claims
> executable repository / experiment truth
> docs/agents/current/*
> docs/agents/LATEST.md
> docs/agents/history/* and docs/archive/*
```

For the detailed Agent reading model and task bundles, continue to [`agents/README.md`](agents/README.md).
