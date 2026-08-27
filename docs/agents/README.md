# Agent documentation

Stable task router for `mykcs/basemodel`.

The documentation system uses **progressive disclosure**: every Agent gets a small bootstrap, then loads only the owners that match the task. Do not turn this repository into one giant reading list, and do not create a second current policy merely because an older document is awkward to update.

## Core bootstrap

For any non-trivial task:

1. read [`LATEST.md`](LATEST.md) for short-lived current state;
2. read [`current/project-agent-operating-principles.md`](current/project-agent-operating-principles.md) for autonomy, tool boundaries, write hygiene, and durable-knowledge rules;
3. read [`current/branch-and-pr-conventions.md`](current/branch-and-pr-conventions.md) before choosing a branch/PR path;
4. read [`current/website-engineering-standard.md`](current/website-engineering-standard.md) for cross-cutting implementation and stopping rules;
5. scan [`current/scenario-trigger-registry.md`](current/scenario-trigger-registry.md) and load the matched bundle below;
6. inspect executable source/config/tests/manifests and live provider/experiment truth for the surface you will actually change.

`/AGENTS.md` is the fast router and invariant layer. [`../README.md`](../README.md) owns the documentation lifecycle and archive boundary. This file owns task selection.

## Task bundles

### User-facing page, copy, navigation, explanation, or feature

Always load the relevant combination of:

- [`current/product-and-research-integrity.md`](current/product-and-research-integrity.md) — product/research truth and false-complete boundaries;
- [`current/human-thinking-web-expression-contract.md`](current/human-thinking-web-expression-contract.md) — semantic HTML/visual expression and information-density contract;
- [`current/audience-centered-technical-copy.md`](current/audience-centered-technical-copy.md) — site-wide technical-copy baseline;
- [`current/sitewide-visual-knowledge-architecture.md`](current/sitewide-visual-knowledge-architecture.md) — whole-site knowledge journey and route roles.

#### Writing stack: load by responsibility

These files are complementary, not five competing style guides:

| Owner | Load when | Owns |
|---|---|---|
| [`audience-centered-technical-copy.md`](current/audience-centered-technical-copy.md) | any public technical copy | headings name subjects, concrete language, context, terminology, audience baseline |
| [`reader-first-copy-hierarchy.md`](current/reader-first-copy-hierarchy.md) | public explanation/result/incident copy | facts before stage directions, conclusion/numbers before long explanation, visual weight follows semantic weight |
| [`layered-technical-explainer-copy.md`](current/layered-technical-explainer-copy.md) | Chinese technical/research explainers | L1 plain meaning → L2 mechanism → L3 evidence; Chinese-first terminology and scientific boundaries |
| [`research-editorial-style.md`](current/research-editorial-style.md) | research results, benchmark reports, scientific interpretation | research narrative, claim → evidence → inference → boundary, run IDs as provenance |
| [`seed-student-reproduction-writing.md`](current/seed-student-reproduction-writing.md) | SEED student/onboarding execution guidance | lab-mentor sequencing, observable PASS criteria, hardware/evidence language |

For user-facing research work, `reader-first-copy-hierarchy.md` and `research-editorial-style.md` are mandatory through `src/components/research/AGENTS.md`. Add `layered-technical-explainer-copy.md` when the Chinese page teaches a technical mechanism. A narrower task-specific contract refines the general rule; it does not erase scientific or product truth.

For UI/layout/theme/CSS work also read:

- [`current/ui-design-principles.md`](current/ui-design-principles.md)
- [`current/css-architecture.md`](current/css-architecture.md)
- [`current/theme-contrast-contract.md`](current/theme-contrast-contract.md)
- [`current/ui-change-visual-acceptance-gate.md`](current/ui-change-visual-acceptance-gate.md)

For route-role/deduplication questions in the research area, read [`current/research-journey-experience.md`](current/research-journey-experience.md).

### SEED × OpenEvo publication / Results

Before a non-trivial Results change, read:

- [`current/seed-openevo-research-mission-first-principles.md`](current/seed-openevo-research-mission-first-principles.md)
- [`current/scientific-state-provenance.md`](current/scientific-state-provenance.md)
- [`current/experiment-result-publication-workflow.md`](current/experiment-result-publication-workflow.md)
- [`current/seed-openevo-results-reader-contract.md`](current/seed-openevo-results-reader-contract.md)
- [`current/research-explainer-page-standard.md`](current/research-explainer-page-standard.md)
- [`current/reader-first-copy-hierarchy.md`](current/reader-first-copy-hierarchy.md)
- [`current/research-editorial-style.md`](current/research-editorial-style.md)
- [`current/layered-technical-explainer-copy.md`](current/layered-technical-explainer-copy.md) for Chinese explainers

Then resolve the live scientific authority in `mykcs/openevo-experiment`. An old website sentence, chat recap, dated snapshot, or `current/` filename is not evidence that upstream state has not moved.

Useful historical cases, after current policy:

- [`history/2026-08-26-seed-results-attribution-and-agent-friction-retrospective.md`](history/2026-08-26-seed-results-attribution-and-agent-friction-retrospective.md)
- [`history/2026-08-27-results-zero-context-and-tool-boundary-retrospective.md`](history/2026-08-27-results-zero-context-and-tool-boundary-retrospective.md)
- [`history/2026-08-27-results-model-identity-and-checkpoint-lineage-retrospective.md`](history/2026-08-27-results-model-identity-and-checkpoint-lineage-retrospective.md) — `BASE` vs vendor Base checkpoint, `frozen` vs provenance, 3B/7B ambiguity, pinned adapter checkpoints, runtime-image naming traps, and concurrent-main release closeout.

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
- [`current/multi-pr-semantic-integration-playbook.md`](current/multi-pr-semantic-integration-playbook.md) when PRs overlap or ship together

Vercel owns ordinary Preview and Production. Historical Vercel pilot/adoption records are under `history/`; Cloudflare files in `current/` are conditional rollback/provider-specific runbooks, not normal release authority.

For provider/browser performance incidents, use the dated retrospective that matches the failure after reading the current policy. For internal `src/pages/_*` modules being mistaken for public routes, Preview `READY` with skipped browser gates, or a Production changed-route smoke failure caused by route derivation, read [`history/2026-08-27-home-maintenance-shortcuts-release-retrospective.md`](history/2026-08-27-home-maintenance-shortcuts-release-retrospective.md).

### Model catalog / current-provider claims

Read:

- [`current/model-catalog-verification-policy.md`](current/model-catalog-verification-policy.md)
- current first-party provider/source evidence

The 2026-08-12 differential audit is retained at [`history/2026-08-12-model-catalog-differential-audit.md`](history/2026-08-12-model-catalog-differential-audit.md) as a point-in-time baseline only. Do not treat it as a current catalog. Current/latest/full-family claims must be re-verified.

### `/lab/`, remote compute, SSH/SFTP/rsync, or hardware disclosure

Read [`current/personal-compute-profile-consumer.md`](current/personal-compute-profile-consumer.md) plus the matched scenario trigger. Keep personal device inventories, private profile feeds, hostnames, usernames, VPN endpoints, tokens, and other identifying infrastructure out of the public repository. Publish only minimum reproducibility-relevant aggregate facts.

### Private → public visibility change

Read and execute [`current/public-release-security-gate.md`](current/public-release-security-gate.md). The gate is fail-closed and covers tracked tree, collaboration surfaces, refs/history, and public intent.

## Document roles

| Location | Role |
|---|---|
| `/AGENTS.md` | fast router + non-negotiable invariants |
| `docs/README.md` | documentation lifecycle, archive boundary, top-level map |
| `docs/agents/LATEST.md` | short-lived current handoff/state snapshot |
| `docs/agents/README.md` | task router and precedence |
| `docs/agents/current/*` | authoritative current policies/runbooks/maps and deliberately maintained current inventories |
| `docs/agents/history/*` | incidents, completed audits/pilots/migrations/closeouts, superseded-state evidence |
| `docs/archive/*` | pre-current product snapshots and one-off superseded plans/context |
| `docs/agent-context/*` | compatibility entrypoint for older historical links |

A date in a filename does not decide lifecycle. Ask whether the file **owns behavior today**. A dated state owner that is actively refreshed and consumed by source/tests may remain current; a completed audit or migration belongs in history even if its lesson remains useful.

The 2026-08-10 final-hardening closeout is historical at [`history/2026-08-10-final-product-hardening-closeout.md`](history/2026-08-10-final-product-hardening-closeout.md). Its durable requirements are owned by current product/UI policies and the executable `scripts/audit-final-product-hardening.ts`, not by the old closeout narrative.

## Knowledge precedence

```text
current user instruction
> live provider state for provider-side claims
> executable repository / experiment truth
> docs/agents/current/*
> docs/agents/LATEST.md
> docs/agents/history/* and docs/archive/*
```

If two current documents disagree, resolve against executable/live truth and update or demote the stale owner. Do not add a reconciliation policy layer.

## Current deployment authority

```text
GitHub source
├─ deployment-eligible non-main -> Vercel Preview
└─ main                         -> Vercel Production -> https://basemodel-preview.vercel.app
```

Branch eligibility is executable policy in `vercel.json`. Preview must be `noindex`; Production is the stable canonical identity. Temporary share links are ephemeral and must not be persisted in repository text or GitHub collaboration surfaces.

Cloudflare Pages/Direct Upload/Workers material is loaded only for explicit rollback, retirement, Cloudflare-specific reproduction, or unexpected legacy-provider activity.

## Repository-write hygiene

Shared GitHub state is not a scratchpad. Prefer read/search for discovery, one coherent branch/PR, and one atomic multi-file commit over sequential write probes. Use GitHub for GitHub-owned state, Vercel for Vercel-owned state, and a user device only when the task materially depends on local-only state.

At task completion, persist only knowledge whose future utility justifies another durable rule. Current cross-task rule → update its existing `current/` owner; short-lived state → `LATEST.md`; reusable incident/migration rationale → `history/`; superseded pre-current milestone/context → `archive/`.
