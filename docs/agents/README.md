# Agent documentation

Stable Agent entrypoint for `mykcs/basemodel`.

The goal of this directory is **progressive disclosure**: give every Agent a small common bootstrap, then load only the current documents that match the task. Do not treat the repository as requiring one giant linear reading list.

## Core bootstrap

For any non-trivial task, start with:

1. [`LATEST.md`](LATEST.md) — short current handoff and live/release-state snapshot.
2. [`current/project-agent-operating-principles.md`](current/project-agent-operating-principles.md) — autonomy, clean workflow, write hygiene, and durable-knowledge rules.
3. [`current/branch-and-pr-conventions.md`](current/branch-and-pr-conventions.md) — semantic branch/PR naming plus the BaseModel-specific Vercel branch-eligibility exception.
4. [`current/website-engineering-standard.md`](current/website-engineering-standard.md) — cross-cutting implementation baseline and stopping rules.
5. [`current/scenario-trigger-registry.md`](current/scenario-trigger-registry.md) — scan the task and load the matched bundle below.
6. executable source/config/tests/manifests for the surface you will actually change.

`/AGENTS.md` remains the root fast router and non-negotiable invariant layer. This file is the detailed task map.

## Task bundles

### User-facing page, copy, navigation, explanation, or feature work

Read:

- [`current/product-and-research-integrity.md`](current/product-and-research-integrity.md)
- [`current/human-thinking-web-expression-contract.md`](current/human-thinking-web-expression-contract.md)
- [`current/audience-centered-technical-copy.md`](current/audience-centered-technical-copy.md)
- [`current/sitewide-visual-knowledge-architecture.md`](current/sitewide-visual-knowledge-architecture.md)
- task-specific research/reproduction contract

For UI/layout/theme/CSS changes also read:

- [`current/ui-design-principles.md`](current/ui-design-principles.md)
- [`current/css-architecture.md`](current/css-architecture.md)
- [`current/theme-contrast-contract.md`](current/theme-contrast-contract.md)
- [`current/ui-change-visual-acceptance-gate.md`](current/ui-change-visual-acceptance-gate.md)

### SEED × OpenEvo research publication / Results route

Read this bundle before any non-trivial Results change:

- [`current/seed-openevo-research-mission-first-principles.md`](current/seed-openevo-research-mission-first-principles.md)
- [`current/scientific-state-provenance.md`](current/scientific-state-provenance.md)
- [`current/experiment-result-publication-workflow.md`](current/experiment-result-publication-workflow.md)
- [`current/seed-openevo-results-reader-contract.md`](current/seed-openevo-results-reader-contract.md)
- [`current/research-explainer-page-standard.md`](current/research-explainer-page-standard.md)
- [`current/audience-centered-technical-copy.md`](current/audience-centered-technical-copy.md)

Then resolve the live scientific source in `mykcs/openevo-experiment` before editing website copy. Never start from an old page sentence, chat recap, or stale current-doc status when upstream executable evidence has moved.

For parser/model-output attribution, benchmark-interface compatibility, or claim-level evidence questions, also read the historical case [`history/2026-08-26-seed-results-attribution-and-agent-friction-retrospective.md`](history/2026-08-26-seed-results-attribution-and-agent-friction-retrospective.md) after the current policies. It is rationale/evidence only; current policy still wins.

### Reproduction workflow / experiment design

Read:

- [`current/seed-openevo-research-mission-first-principles.md`](current/seed-openevo-research-mission-first-principles.md)
- [`current/reproduction-guide-design-principles.md`](current/reproduction-guide-design-principles.md)
- [`current/openevo-reproduction-research-page.md`](current/openevo-reproduction-research-page.md)
- [`current/product-and-research-integrity.md`](current/product-and-research-integrity.md)
- current experiment-side authority in `mykcs/openevo-experiment`

Keep strict reproduction, method reproduction, modern rerun, diagnostic evidence, benchmark-facing evidence, and paper-reported results separate.

### Release / Preview / Production / overlapping PRs

Read:

- [`current/hosting-architecture.md`](current/hosting-architecture.md)
- [`current/deployment-policy.md`](current/deployment-policy.md)
- [`current/release-closeout-protocol.md`](current/release-closeout-protocol.md)
- [`current/multi-pr-semantic-integration-playbook.md`](current/multi-pr-semantic-integration-playbook.md) when several PRs overlap or ship together

Use exact-head evidence. A clean merge, a READY badge, and an earlier Preview do not prove the later intended tree.

### Model catalog / current-provider claims

Read:

- [`current/model-catalog-verification-policy.md`](current/model-catalog-verification-policy.md)
- the latest applicable model-catalog audit
- current first-party provider/source evidence

Current/latest/full-family claims must be re-verified rather than copied from older snapshots.

### `/lab/`, remote compute, SSH/SFTP/rsync, or hardware disclosure

Read:

- [`current/personal-compute-profile-consumer.md`](current/personal-compute-profile-consumer.md)
- matched scenario-trigger guidance

Keep personal device inventories, private profile feeds, hostnames, usernames, VPN endpoints, tokens, and other identifying infrastructure out of the public repository. Publish only the minimum reproducibility-relevant aggregate facts.

### Private → public visibility change

Read and execute:

- [`current/public-release-security-gate.md`](current/public-release-security-gate.md)

The gate is fail-closed and covers tracked tree, collaboration surfaces, refs/history, and public intent.

## Document roles

Keep these ownership boundaries clear:

| Location | Role | What not to do |
|---|---|---|
| `/AGENTS.md` | fast router + non-negotiable invariants | do not duplicate every detailed policy here |
| `docs/agents/LATEST.md` | short-lived current handoff/state snapshot | do not turn it into a permanent architecture encyclopedia |
| `docs/agents/README.md` | task-based reading map and precedence | do not duplicate owner-policy contents |
| `docs/agents/current/*` | authoritative current policy/runbooks/maps | do not leave known-stale operational/scientific state here |
| `docs/agents/history/*` | incident, migration, retrospective, superseded-state evidence | do not treat history as current instruction |
| `docs/agent-context/*` | retained historical research-workbench context | do not use it to override current executable truth |

If two current documents disagree, resolve the disagreement against executable/live truth and update the stale owner. Do not add another policy layer merely to reconcile the contradiction.

## Knowledge precedence

```text
current user instruction
> live provider state for provider-side claims
> executable repository / experiment truth
> docs/agents/current/*
> docs/agents/LATEST.md
> history / archive / docs/agent-context
```

Historical dialogue may be useful evidence through the private `mykcs/Codex-Dialogue` archive, but it never overrides current task instructions, executable repository truth, or live provider state.

## Current deployment authority

```text
GitHub source
├─ deployment-eligible non-main -> Vercel Preview
└─ main                         -> Vercel Production -> https://basemodel-preview.vercel.app
```

Current branch eligibility is executable policy in `vercel.json`, not a blanket rule for every non-main branch. Read [`current/branch-and-pr-conventions.md`](current/branch-and-pr-conventions.md) before choosing a branch that must receive an exact-head Preview.

Vercel is the only ordinary deployment authority. Vercel Preview must be `noindex`; Production must be indexable and canonical to the Vercel Production identity. A temporary Preview share URL is ephemeral, never canonical, and must not be persisted in repository text or GitHub PR/Issue bodies/comments.

Historical Cloudflare files, Direct Upload runbooks, snapshots, and Workers-shadow configuration are conditional legacy evidence/fallbacks. They do not belong in ordinary completion reporting unless the legacy surface is explicitly involved or unexpectedly activates.

## Parallel release batches

When the owner asks to ship several open PRs together, load `current/multi-pr-semantic-integration-playbook.md` and follow:

```text
refresh main and candidate heads
-> classify independent / stacked / superseded / conflicting intent
-> create one explicit integration/release head
-> resolve the final tree by current product and executable truth
-> run one combined exact-head Gate/build and Preview
-> merge main once
-> verify one Vercel Production release
-> record worker-PR disposition
-> audit post-release discovery surfaces
```

A clean textual merge is not semantic acceptance. Preserve ancestry and attribution, but do not let older deployment, UI, or research semantics overwrite newer current authority.

## Scenario triggers and durable knowledge

At the start of non-trivial work:

```text
read core bootstrap
-> scan scenario-trigger-registry
-> load one matched task bundle
-> inspect executable/live truth
-> execute
-> deposit only genuinely reusable lessons in the existing owner
```

Re-scan triggers when the task changes state: a blocker appears, an overlapping PR is discovered, a provider boundary is crossed, `main` moves, a Gate exposes an invariant, or the work reveals a reusable failure mode.

Do not create a memory/case/ADR/handoff file after every task. Persistence should be earned by future utility.

## Repository-write hygiene

Shared GitHub state is not a scratchpad.

- use fetch/search/read operations for discovery;
- never create probe files, comments, branches, or provider mutations just to see whether a tool works;
- know the intended path/content before invoking a write;
- prefer one atomic multi-file commit over sequential Contents-API writes when practical;
- if an accidental write happens, stop, classify, clean it when possible, and report residue rather than hiding it.

The detailed project-wide rule lives in `current/project-agent-operating-principles.md`.

## Useful historical cases

History is rationale, not current policy. Particularly reusable cases include:

- [`history/2026-08-21-webkit-runner-recovery.md`](history/2026-08-21-webkit-runner-recovery.md) — hosted-runner failure vs real browser failure and black-box fallback boundaries.
- [`history/2026-08-26-vercel-ui-gate-serial-failure-recovery.md`](history/2026-08-26-vercel-ui-gate-serial-failure-recovery.md) — `--max-failures=1`, stale E2E contracts, and why one formerly-red test turning green is not suite completion.
- [`history/2026-08-26-results-release-node-runtime-retrospective.md`](history/2026-08-26-results-release-node-runtime-retrospective.md) — Results overflow, stale tests, deployment eligibility, and Node runtime closeout.
- [`history/2026-08-26-seed-results-attribution-and-agent-friction-retrospective.md`](history/2026-08-26-seed-results-attribution-and-agent-friction-retrospective.md) — model-output attribution, parser compatibility, claim-level provenance, current-doc drift, exact-head deployment identity, and write-operation hygiene.
- [`history/2026-08-26-seed-results-source-faithful-128-integration-retrospective.md`](history/2026-08-26-seed-results-source-faithful-128-integration-retrospective.md) — source-faithful 128-task identity correction, teacher-facing immutable manifest links, Vercel status disambiguation, test-owner drift, and semantic integration of overlapping Results PRs.

## Product contract

The current mission is to evaluate OpenEvo on the ALFWorld and WebShop settings used by SEED, understand benchmark-specific behavior and failures, and turn the evidence into defensible OpenEvo improvements.

Preserve Learn / Run / Compare as distinct entry modes. Keep ALFWorld success-rate semantics separate from WebShop normalized score/exact success. Keep environment readiness, real model action, real evolution, comparable results, and causal improvement as different evidence levels.
