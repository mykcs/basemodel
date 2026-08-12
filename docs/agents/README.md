# Agent documentation

Stable Agent entrypoint for `mykcs/basemodel`.

## Start here

1. `LATEST.md` — live handoff and provider state.
2. `current/project-agent-operating-principles.md` — autonomous/clean workflow standard.
3. `current/scenario-trigger-registry.md` — just-in-time trigger router; **scan scenario-trigger-registry against the task** automatically.
4. `current/hosting-architecture.md` — current Vercel Preview + Production ownership.
5. `current/deployment-policy.md` — release/validation boundary.
6. `current/repository-map.md` — ownership/change-to-check map.
7. `current/ui-design-principles.md` and task-relevant product/research/data docs plus executable source/tests.

Retained files such as `preview-platform-evaluation.md`, Direct Upload runbooks, `cloudflare-pages-deployment.md`, and Workers shadow configuration document historical or fallback paths. They do not override the current Vercel Production authority.

## Current deployment authority

```text
GitHub source
├─ non-main -> Vercel Preview
└─ main     -> Vercel Production -> https://basemodel-preview.vercel.app

Cloudflare Pages -> frozen legacy rollback snapshot; normal Git builds = 0
```

**Cloudflare Pages Build = 0** is the normal operating target. Until Pages Git integration is disabled at the account level, use `[CF-Pages-Skip]` for branch and release commits.

Vercel Preview must be `noindex`; Production must be indexable and canonical to the Vercel Production identity. A temporary Preview share URL is ephemeral and never canonical.

## Scenario triggers and durable knowledge

At the start of non-trivial work:

```text
read LATEST + operating principles
-> scan scenario-trigger-registry against the task
-> load only matched current docs/tests/provider evidence
-> execute
-> encode only genuinely reusable lessons in the best existing owner
```

Historical records explain past decisions and should not restore retired GitHub Actions/Pages or a superseded hosting architecture.

## Product contract

Deployment changes do not alter the research-decision-system north star, evidence semantics, reproduction-mode distinctions, UI design principles, or acceptance rules. Read the relevant current policies before broad changes.
