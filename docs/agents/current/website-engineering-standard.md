# BaseModel website-engineering overlay

Status: **CURRENT / SITE-SPECIFIC**

Shared cross-site website-engineering rules are owned centrally at:

https://github.com/mykcs/.codex/blob/main/website-governance/ENGINEERING_STANDARD.md

Prior engineering feedback/evidence lives at:

https://github.com/mykcs/.codex/blob/main/website-learning/shared/engineering/LEARNED_PRACTICES.md

This file keeps only BaseModel-specific stack, provider, CI, browser-evidence and use-site guard details. The pre-split full standard is frozen at:

https://github.com/mykcs/.codex/blob/main/website-learning/legacy/basemodel-engineering-spec/website-engineering-standard-2026-09-22.md

## 1. BaseModel stack and rendering boundary

BaseModel remains an Astro + React + TypeScript static-first site with Vitest/Playwright verification.

Prefer static/server-rendered HTML and CSS for research content. Hydrate only interactions that need client state. Do not rewrite the application stack merely because CI/deployment ownership changes.

Shared component/data owners outrank page-local overrides. BaseModel-specific CSS, theme, hydration, navigation and route ownership remain with their existing current contracts/tests.

## 2. BaseModel release topology

Current ordinary release path:

~~~text
working PR
→ Public PR CI (exact-head deterministic/browser acceptance)
→ exact current-base candidate
→ scripts/request-vercel-final-gate.mjs <PR>
→ persistent ci/vercel-gate-final at exact PR head
→ required Vercel provider acceptance
→ merge
→ Vercel Production from main
~~~

CircleCI and the Mac/OrbStack runner are manual recovery/fallback surfaces, not ordinary merge authority. Concrete provider/check names and branch rules remain in `ci-provider-decision.md`, `hosting-architecture.md`, `deployment-policy.md`, workflow files and `vercel.json`.

## 3. Exact local browser evidence

Before claiming browser/review evidence belongs to a commit SHA, check the candidate worktree state. **A dirty working tree means the rendered artifact is `HEAD + local delta`**, not the named commit. Dirty-tree evidence is preflight only unless explicitly fingerprinted.

For manual local browser acceptance, bind the browser to the task-owned server's **actual emitted URL**, not the requested port. Framework port fallback can otherwise attach the test to another worktree or stale server.

Verify a task-specific route/sentinel before screenshots or DOM assertions.

## 4. Initial visibility and persisted state

### Initial visibility is not scroll intent

When a control/page has persisted or default state, the **initial load preserves the declared starting state**. Do not scroll, open a menu, expand details, or mutate local state merely to expose the changed control and then call that screenshot the default first viewport.

Review expanded/secondary states separately when relevant.

**Protect the semantic behavior, not an incidental CSS token.** A regression guard should defend what the reader can see/do, not one implementation class name when equivalent implementations are valid.

## 5. CI evidence preflight

### CI evidence preflight

Before the first provider-triggering CI benchmark/selection change, bind:

- candidate and control base/head/tree;
- exact test identities and whether the experiment changes selection vs scheduling;
- executor / worker / retry semantics;
- metric and acceptance rule;
- qualification vs steady-state role;
- expected upside and stopping rule.

For test-selection changes, prove the consumer/side effects and retained test identities. Do not apply scheduler-only same-population reasoning to a selection experiment.

A green qualification proves correctness; it does not prove a speedup or authorize merge while the registered steady-state comparison is still pending.

## 6. Public PR CI and Vercel spend boundary

Ordinary working pushes stay outside Vercel acceptance. Public PR CI owns repository/browser preflight; the persistent final-gate ref triggers exact-head provider acceptance only when the candidate is ready.

Do not use a fresh alias ref, commit-message marker, or historical READY deployment as current merge evidence.

Docs/Agent-governance-only `main` changes should remain non-deploy-relevant under the project ignored-build policy; a CANCELED/IGNORED Vercel Git event is not a Production publication.

## 7. Temporary exemptions and site-wide promises

**Temporary exemptions are leases, not permanent blind spots.**

When a concurrent change requires an exemption, record the exact route/component, failure class, **current owner or PR/workline**, and a **repository-observable removal trigger**.

The owning integration/closeout must remove it when the trigger becomes true or report a concrete blocker/follow-up; **an anonymous or open-ended exemption cannot support a site-wide-complete claim**.

Site-wide claims must use explicit/discoverable coverage. A few representative routes are not automatically proof of a whole-site promise.

## 8. BaseModel definition of done

For a deployable change, completion normally requires:

- current factual/scientific/source authority resolved;
- declared deterministic/project tests passed;
- required rendered/browser acceptance for the changed risk class;
- exact-head Public PR CI success;
- exact-current-base Vercel final-gate success;
- expected-head merge;
- Production verification when the merge changes deploy-relevant inputs.

Provider READY alone is not page/product acceptance. A successful source diff alone is not release completion.

## 9. Ownership map

| Concern | BaseModel owner |
| --- | --- |
| cross-site website engineering | `.codex/website-governance/ENGINEERING_STANDARD.md` |
| BaseModel CI provider rationale | `ci-provider-decision.md` |
| current hosting topology | `hosting-architecture.md` |
| Vercel/ref/build budget/release policy | `deployment-policy.md` + executable scripts/config |
| CSS/semantic ownership | `css-architecture.md` |
| UI/browser acceptance | `ui-change-visual-acceptance-gate.md` + Playwright/Vitest owners |
| Reader first-viewport semantics | `site-reader-attention-contract.md` |
| current source/build truth | `package.json`, config, source and tests |

Do not recreate another cross-site engineering rulebook locally. If a shared invariant changes, update the central standard; if a BaseModel-specific provider/stack contract changes, update this overlay or the narrower local owner.
