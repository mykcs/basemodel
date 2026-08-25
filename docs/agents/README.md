# Agent documentation

Stable Agent entrypoint for `mykcs/basemodel`.

This directory is intentionally split into **a small always-read core** and **task-specific owners**. Do not make every Agent read every current document, and do not create a second long reading-order list in `LATEST.md`.

## Core path

After `/AGENTS.md`, read these for any non-trivial task:

1. `LATEST.md` — current handoff, provider/release state, and recent cross-cutting changes.
2. `current/project-agent-operating-principles.md` — autonomous/clean workflow standard.
3. `current/website-engineering-standard.md` — accepted stack, semantic ownership, static-first/hydration rules, browser boundaries, exact-tree evidence, build-budget discipline, cleanup, and stopping rules.
4. `current/scenario-trigger-registry.md` — just-in-time trigger router; **scan scenario-trigger-registry against the task** and load the matched guidance.
5. `current/product-and-research-integrity.md` — product and scientific completion boundary.
6. For any reader-visible website change, `current/human-thinking-web-expression-contract.md` is mandatory.

Then use the task router below. Executable source/config/tests and live provider state remain higher authority for the facts they own.

## Task router

| Task | Read / check |
| --- | --- |
| Reader-visible copy, explanation, comparison, navigation, onboarding, or status | `current/human-thinking-web-expression-contract.md`, `current/audience-centered-technical-copy.md`, copy audits/tests, plus the local `AGENTS.md` nearest the edited source |
| Research conclusion, benchmark interpretation, experiment narrative, or scientific next-step decision | **also** `current/research-editorial-style.md`; every material claim must expose the minimum visible reasoning bridge: observation → supported inference → boundary |
| SEED × OpenEvo Results route | **also** `current/seed-openevo-results-reader-contract.md`, `current/scientific-state-provenance.md`, and `src/components/research/AGENTS.md` |
| SEED / OpenEvo mission, reproduction flow, or technical explainer | `current/seed-openevo-research-mission-first-principles.md`, `current/reproduction-guide-design-principles.md`, `current/openevo-reproduction-research-page.md`, `current/research-explainer-page-standard.md`, `current/scientific-state-provenance.md` |
| UI/CSS/theme/layout/responsive/animation | `current/ui-design-principles.md`, `current/css-architecture.md`, `current/sitewide-visual-knowledge-architecture.md`, `current/theme-contrast-contract.md`, `current/ui-change-visual-acceptance-gate.md` |
| Current/latest model-family or catalog evidence | `current/model-catalog-verification-policy.md`, `current/model-catalog-audit-2026-08-12.md`, task-relevant model/data policies |
| Vercel Preview / Production / release | `current/hosting-architecture.md`, `current/deployment-policy.md`, `current/release-closeout-protocol.md`; for many PRs also `current/multi-pr-semantic-integration-playbook.md` |
| Private → public repository visibility | `current/public-release-security-gate.md` |
| Lab connectivity, remote compute, SSH/SFTP/rsync, hardware disclosure | `current/personal-compute-profile-consumer.md` plus the relevant scenario trigger |
| Ownership / “where should this change live?” | `current/repository-map.md` and the closest directory `AGENTS.md` |

The `/lab/` routes are governed by `current/personal-compute-profile-consumer.md`, which defines a generic public lab-topology privacy boundary. Personal device inventories and private infrastructure profiles must stay outside this public repository.

## Reader-facing reasoning rule

For a material reader-facing research claim, a sentence being understandable is not enough. The reader should not have to open a disclosure to answer the first-layer question **“你为什么这样说？”**

The visible mainline should normally make this recoverable:

```text
observation
-> inference supported by that observation
-> claim boundary / what remains unproved
```

Detailed numbers, confidence intervals, run IDs, manifests, and source links may remain on demand. Definitions, direct instructions, neutral labels, and simple source facts do not need an artificial inference chain. `current/research-editorial-style.md` owns the detailed research-writing rule; do not fork it into another governance document.

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
read /AGENTS.md + LATEST + core policy
-> use this task router
-> scan scenario-trigger-registry
-> load only matched current docs/tests/provider evidence
-> execute
-> encode reusable lessons in the existing owner
```

`docs/agent-context/` contains retained research-workbench context. `docs/agents/history/` contains superseded product, hosting, incident and release evidence. Neither is current policy. In particular, the former PR #64 product-vision document is historical; current authority lives in the current integrity, mission, visual and deployment documents.

For a concrete browser-infrastructure incident showing how to distinguish zero-step hosted-runner failures from real WebKit failures, when a public production black-box fallback is safe, and why that fallback is not exact-head evidence, see `history/2026-08-21-webkit-runner-recovery.md`.

## Product contract

The current mission is to evaluate OpenEvo on the ALFWorld and WebShop settings used by SEED, understand benchmark-specific behavior and failures, and turn the evidence into defensible OpenEvo improvements. Keep Learn / Run / Compare, evidence levels, benchmark metrics and framework update objects distinct.
