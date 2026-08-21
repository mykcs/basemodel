# Agent documentation

Stable Agent entrypoint for `mykcs/basemodel`.

## Start here

1. `LATEST.md` — live handoff and provider/release state.
2. `current/project-agent-operating-principles.md` — autonomous/clean workflow standard.
3. `current/website-engineering-standard.md` — cross-cutting website engineering baseline: accepted stack, semantic ownership, static-first/hydration rules, browser runner boundaries, exact-tree release evidence, build-budget discipline, temporary-harness cleanup, and the stopping rule against unrequested optimization churn.
4. `current/scenario-trigger-registry.md` — just-in-time trigger router; scan it automatically against the task.
5. `current/product-and-research-integrity.md` — product and scientific completion boundary.
6. `current/human-thinking-web-expression-contract.md` — mandatory expression/density/semantic-HTML contract for every user-facing change.
7. `current/ui-design-principles.md`, `current/css-architecture.md`, `current/sitewide-visual-knowledge-architecture.md`, `current/theme-contrast-contract.md`, and `current/ui-change-visual-acceptance-gate.md` — UI system, CSS ownership, and browser acceptance.
8. `current/seed-openevo-research-mission-first-principles.md`, `current/reproduction-guide-design-principles.md`, `current/openevo-reproduction-research-page.md`, `current/audience-centered-technical-copy.md`, and `current/scientific-state-provenance.md` — current research mission, reproduction, copy, and live scientific-state ownership.
9. `current/hosting-architecture.md` — current Vercel Preview + Production ownership.
10. `current/deployment-policy.md` — Vercel build budget, parallel/stacked PR integration, release and Production boundary.
11. `current/public-release-security-gate.md` — fail-closed tracked-tree, collaboration-surface, all-ref/history and public-intent gate before repository visibility changes.
12. `current/multi-pr-semantic-integration-playbook.md` — exact procedure for many-PR semantic conflict resolution, ancestry, combined Preview, worker-PR disposition and post-release audit.
13. `current/release-closeout-protocol.md` — final exact-head acceptance, stale-evidence invalidation, failure classification, retry/flaky handling, pre-merge race check, expected-head merge locking, and Preview → Production closeout.
14. `current/repository-map.md` — ownership/change-to-check map.
15. `current/model-catalog-verification-policy.md` and `current/model-catalog-audit-2026-08-12.md` — current official-source model-catalog rules and latest full-provider differential baseline.
16. Task-relevant model/data policies plus executable source, config and tests.

The `/lab/` routes are governed by `current/personal-compute-profile-consumer.md`, which now defines a generic public lab topology privacy boundary. Personal device inventories and private infrastructure profiles must stay outside this public repository.

## Current deployment authority

```text
GitHub source
├─ non-main -> Vercel Preview
└─ main     -> Vercel Production -> https://basemodel-preview.vercel.app
```

Vercel is the only ordinary deployment authority. Vercel Preview must be `noindex`; Production must be indexable and canonical to the Vercel Production identity. A temporary Preview share URL is ephemeral, never canonical, and must not be persisted in repository text or GitHub PR/Issue bodies/comments.

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
read LATEST + operating principles + website engineering standard
-> scan scenario-trigger-registry against the task
-> load only matched current docs/tests/provider evidence
-> execute
-> encode only genuinely reusable lessons in the best existing owner
```

The website engineering standard is intentionally a cross-cutting summary. Detailed CSS, rendering/performance, browser, deployment, release, and product rules remain authoritative in their existing owner documents; do not create a second checklist when one of those owners should be updated instead.

`docs/agent-context/` contains retained research-workbench context. `docs/agents/history/` contains superseded product, hosting, incident and release evidence. Neither is current policy. In particular, the former PR #64 product-vision document is historical; current authority lives in the current integrity, mission, visual and deployment documents.

For a concrete browser-infrastructure incident showing how to distinguish zero-step hosted-runner failures from real WebKit failures, when a public production black-box fallback is safe, and why that fallback is not exact-head evidence, see `history/2026-08-21-webkit-runner-recovery.md`.

## Product contract

The current mission is to evaluate OpenEvo on the ALFWorld and WebShop settings used by SEED, understand benchmark-specific behavior and failures, and turn the evidence into defensible OpenEvo improvements. Keep Learn / Run / Compare, evidence levels, benchmark metrics and framework update objects distinct.
