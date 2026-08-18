# Agent documentation

Stable Agent entrypoint for `mykcs/basemodel`.

## Start here

1. `LATEST.md` — live handoff and provider/release state.
2. `current/project-agent-operating-principles.md` — autonomous/clean workflow standard.
3. `current/scenario-trigger-registry.md` — just-in-time trigger router; scan it automatically against the task.
4. `current/product-and-research-integrity.md` — product and scientific completion boundary.
5. `current/human-thinking-web-expression-contract.md` — mandatory expression/density/semantic-HTML contract for every user-facing change.
6. `current/ui-design-principles.md`, `current/sitewide-visual-knowledge-architecture.md`, `current/theme-contrast-contract.md`, and `current/ui-change-visual-acceptance-gate.md` — UI system and browser acceptance.
7. `current/seed-openevo-research-mission-first-principles.md`, `current/reproduction-guide-design-principles.md`, `current/openevo-reproduction-research-page.md`, `current/audience-centered-technical-copy.md`, and `current/scientific-state-provenance.md` — current research mission, reproduction, copy, and live scientific-state ownership.
8. `current/hosting-architecture.md` — current Vercel Preview + Production ownership.
9. `current/deployment-policy.md` — Vercel build budget, parallel/stacked PR integration, release and Production boundary.
10. `current/multi-pr-semantic-integration-playbook.md` — exact procedure for many-PR semantic conflict resolution, ancestry, combined Preview, worker-PR disposition and post-release audit.
11. `current/release-closeout-protocol.md` — final exact-head acceptance, stale-evidence invalidation, failure classification, retry/flaky handling, pre-merge race check, expected-head merge locking, and Preview → Production closeout.
12. `current/repository-map.md` — ownership/change-to-check map.
13. `current/model-catalog-verification-policy.md` and `current/model-catalog-audit-2026-08-12.md` — current official-source model-catalog rules and latest full-provider differential baseline.
14. Task-relevant model/data policies plus executable source, config and tests.

The personal device/lab profile consumer is owned by `current/personal-compute-profile-consumer.md`; editable device facts stay only in `mykcs/fuhuo_20260419`.

## Current deployment authority

```text
GitHub source
├─ non-main -> Vercel Preview
└─ main     -> Vercel Production -> https://basemodel-preview.vercel.app
```

Vercel is the only ordinary deployment authority. Vercel Preview must be `noindex`; Production must be indexable and canonical to the Vercel Production identity. A temporary Preview share URL is ephemeral and never canonical.

Historical Cloudflare files, Direct Upload runbooks, snapshots and Workers-shadow configuration are conditional legacy evidence/fallbacks. They do not override current Vercel authority and do not belong in ordinary completion reporting unless the legacy surface is explicitly involved or unexpectedly activates.

## Parallel release batches

When the owner asks to ship several open PRs together, load `current/multi-pr-semantic-integration-playbook.md` and follow this release shape:

```text
refresh main and every candidate head
-> classify independent / stacked / superseded / conflicting intent
-> create one explicit integration/release head
-> resolve the final tree by current product and executable truth
-> run one combined exact-head Gate/build and Preview
-> merge main once
-> verify one Vercel Production release
-> record every worker PR disposition
-> audit post-release discovery surfaces such as sitemap/robots/canonical/navigation
```

A clean textual merge is not semantic acceptance. Preserve ancestry and attribution, but do not let old deployment, UI or research semantics overwrite newer current authority.

When the work reaches final merge authorization, switch from integration logic to `current/release-closeout-protocol.md`: acceptance belongs to an exact head/base pair, stale green reports must be invalidated, the final combined tree must be tested, and the merge should be locked to the accepted head when the tool supports it.

## Scenario triggers and durable knowledge

At the start of non-trivial work:

```text
read LATEST + operating principles
-> scan scenario-trigger-registry against the task
-> load only matched current docs/tests/provider evidence
-> execute
-> encode only genuinely reusable lessons in the best existing owner
```

`docs/agent-context/` contains retained research-workbench context. `docs/agents/history/` contains superseded product, hosting, incident and release evidence. Neither is current policy. In particular, the former PR #64 product-vision document is historical; current authority lives in the current integrity, mission, visual and deployment documents.

## Product contract

The current mission is to evaluate OpenEvo on the ALFWorld and WebShop settings used by SEED, understand benchmark-specific behavior and failures, and turn the evidence into defensible OpenEvo improvements. Keep Learn / Run / Compare, evidence levels, benchmark metrics and framework update objects distinct.