# 2026-09-09 — Briefing Vercel failure attribution retrospective

Status: **historical case / superseded state evidence**  
Do not treat PR numbers, SHAs, deployment IDs, or review state below as current authority.

## Scope

This case records the diagnosis and recovery of a BaseModel advisor-briefing deployment failure where the scientific/content-specific checks were reported green, yet a fresh Vercel deployment failed.

The durable lesson is not “delete one variable”. The durable lesson is how to separate:

- provider infrastructure trouble;
- repository-owned engineering gates executed by the provider;
- product/rendered-page failures;
- scientific/content regressions;
- stale conversational state versus live exact-head state.

## What happened

A briefing candidate at commit `a547d0ac24f11a5ad301b2fee487a81537247a3a` received a Vercel deployment failure around 16:09 UTC.

At the same time, briefing-specific tests, Reader Contract checks, static build evidence, and rendered QA were described as passing. That combination initially created an attractive but wrong interpretation: “the content is fine, therefore Vercel itself probably failed.”

The Vercel build log showed a different story. Vercel successfully cloned the repository, restored cache, installed dependencies, and started the repository-owned deploy verification chain. The first real failure was ESLint:

```text
SeedOpenEvoProgressBriefing.astro
'gdrHref' is assigned a value but never used
eslint --max-warnings 0
```

The provider then surfaced only the wrapper outcome: the full build command exited with 1.

So the actual classification was:

```text
provider-hosted execution
+ repository-owned lint failure
!= provider infrastructure failure
```

The stale `gdrHref` binding remained after the corresponding GDR explainer link stopped being used during the scientific-state refresh.

A one-line deletion fixed that first gate. The next provider run advanced farther and then exposed a second independent failure: the CSS architecture audit rejected a new `!important` in the briefing stylesheet. That was fixed by tightening selector ownership rather than adding an exception.

A later exact head completed Vercel successfully and the hosted Chromium suite passed. The PR remained under its requested review/merge boundary at that point. Later repository history moved again; those later states are not part of this incident's durable authority.

## Engineering friction and why it happened

### 1. “The provider is red” was almost treated as “the provider is broken”

**Failure mode:** provider status was interpreted before the build log was read.

**Missing context:** Vercel executes repository-owned lint, audit, test and browser gates. A red Vercel badge can therefore be caused by code/policy failures even when provider infrastructure is healthy.

**Pre-action check next time:** fetch deployment ID, exact commit SHA, build log, and first failing command.

**Defensive rule:** classify by the first failing execution phase, never by the provider badge or final wrapper message.

**Reasonable-looking but wrong shortcut:** “Focused tests and rendered QA passed, so the deployment error must be infrastructure.” Different gates observe different layers.

### 2. Focused PASS evidence was overgeneralized

**Failure mode:** briefing-specific PASS evidence was close to being summarized as “the candidate passes everything important.”

**Why:** tests were grouped by outcome rather than by gate identity and environment.

**Missing context:** lint, CSS architecture, Reader Contract, static build, browser QA, and provider deployment are independent acceptance layers.

**Pre-action check:** always name the gate and execution environment in a status report.

**Defensive rule:** never collapse `focused tests PASS + provider FAIL` into a single ambiguous statement. Report both and reconcile them via logs.

**Anti-example:** “43/43 tests pass, therefore source hygiene cannot be the cause.” A source file may satisfy those 43 tests while still violating ESLint.

### 3. Fail-fast behavior hid the second defect

**Failure mode:** after deleting the unused binding, the next Vercel run failed again, which could have been misread as evidence that the first fix was ineffective.

**Why:** the first run stopped at lint and never reached the CSS architecture audit.

**Missing context:** sequential pipelines reveal later failures only after earlier blockers are cleared.

**Pre-action check:** compare the new log to the old log and identify whether execution progressed farther.

**Defensive rule:** treat each newly exposed later gate as a separate diagnosis unless evidence links the failures causally.

**Anti-example:** bundling all subsequent red states into “Vercel is flaky”.

### 4. The narrow repair could have been widened into content churn

**Failure mode:** once a deployment gate was red, it would have been easy to rewrite nearby briefing copy, adjust claims, or alter page structure “while fixing things.”

**Why:** the failing file was also the main scientific presentation component.

**Missing context:** the scientific story had already passed the relevant content/reader checks; the actual failures were dead code and CSS ownership.

**Pre-action check:** identify whether the failing gate owns scientific semantics at all.

**Defensive rule:** when a research-publication failure is engineering-only, freeze the scientific story and touch only the failing engineering owner.

**Anti-example:** removing caveats or changing experiment wording merely to reduce layout/CSS pressure.

### 5. Silencing a gate would have been easier than fixing ownership

**Failure mode:** the unused variable could have been renamed with `_`, or lint could have been disabled; the CSS issue could have been whitelisted.

**Why:** bypasses are locally cheap and make CI green quickly.

**Missing context:** the repository intentionally uses `--max-warnings 0` and a CSS architecture audit to prevent accumulating hidden debt.

**Pre-action check:** ask whether the reported object is genuinely needed. If not, delete it. If CSS specificity is wrong, repair selector/state ownership.

**Defensive rule:** preserve gate strength; prefer deletion and semantic ownership repair over suppression.

**Anti-example:** `eslint-disable-next-line` around a dead binding whose only consumer was already removed.

### 6. Live state moved while the conversation continued

**Failure mode:** the user referenced one exact head, but the PR later advanced through repair commits; after that, repository `main` also moved.

**Why:** provider/repository state is concurrent and conversations are slower than Git events.

**Missing context:** a SHA mentioned in chat is a historical pointer, not a lease on current state.

**Pre-action check:** re-read PR head and provider status immediately before mutation and before closeout.

**Defensive rule:** every “current” claim about PR/deployment state must be backed by a fresh live read. If the failed deployment belongs to an older SHA, say so explicitly.

**Anti-example:** writing another repair commit because the user says “go fix it” even though another Agent already fixed the exact issue and the current head is green.

## Research/scientific reasoning friction

The central scientific risk was not a wrong result value. It was the temptation to treat an engineering deployment problem as a reason to reopen scientific narrative decisions.

The briefing contained a scientifically sensitive Q17 story: the old GDR/DirectApply twin was diagnostic evidence, an in-place DirectApply switch would mutate the frozen one-variable comparison, and a fresh DirectApply experiment identity was therefore required. That narrative boundary must remain independent from lint/CSS troubleshooting.

The general rule is:

```text
engineering gate failure
is not
scientific authorization
```

If an engineering-only issue appears after scientific/content checks pass, fix the engineering layer without changing experiment identity, frozen conditions, evidence values, caveats, or interpretation.

A superficially convenient alternative would have been to simplify or reshape the scientific story until the page happened to pass all UI checks. That is invalid because presentation convenience cannot change the scientific object being reported.

## Repeated-correction check

This incident did not occur in isolation. Earlier BaseModel work had already produced durable guidance that:

- provider state and repository/product failure must be separated;
- exact-head evidence matters;
- `!important` should not be used as a routine CSS strategy;
- current/live truth beats chat summaries;
- repeated corrections must become use-site checks, not merely retrospective prose.

Why did the failure class recur anyway?

1. **The rule was too abstract at the moment of use.** “Classify provider red states” existed, but there was no compact Vercel-oriented operator sequence from deployment identity to first failing command.
2. **PASS evidence was cognitively grouped rather than layered.** Multiple green checks created an intuition that the candidate was globally green.
3. **Historical lessons were easier to read after an incident than to execute before a write.** The repository had principles, but the red-provider trigger needed a direct troubleshooting owner.
4. **Moving state was not always foregrounded in conversation language.** A referenced exact head can become old within minutes.

What changes after this retrospective:

- the durable rule remains in the existing top-level owners rather than being duplicated;
- a dedicated `provider-failure-attribution-runbook.md` now translates the abstract rule into a use-site checklist;
- this file preserves the dated causal history and anti-examples;
- transient SHAs/deployment IDs remain here only as evidence, never as current policy.

## Information-lifetime classification

### A — long-lived rules

- A provider badge is not a root-cause classification.
- Bind every deployment claim to the actual deployed SHA/ref/ID.
- Read the provider log and locate the first failing phase before changing code or architecture.
- Keep gate identities/environments separate when reporting PASS/FAIL.
- Fail-fast pipelines can reveal multiple independent defects sequentially.
- Preserve gate strength; fix the owner rather than bypassing the check.
- Engineering-only fixes to research publication must not alter the accepted scientific story.
- Refresh live PR/provider state before mutation and closeout.
- Do not create redundant commits when another Agent has already made the narrow repair.

### B — BaseModel-specific project lessons

- Vercel runs repository-owned acceptance, so many “Vercel failures” are actually BaseModel gate failures.
- `verify:deploy` is intentionally layered; focused test success is not equivalent to full provider acceptance.
- new `!important` usage outside frozen compatibility debt is rejected by CSS architecture.
- BaseModel release/review decisions require exact-head provider evidence.

### C — transient historical state deliberately not promoted

- PR #569 review state at any one moment;
- `a547d0ac...`, `e399198...`, `0b428b09...` as current authority;
- deployment IDs and timestamps;
- the branch/ref Vercel happened to build from during this incident;
- current `main` SHA;
- one-time test counts as a permanent guarantee.

These values are retained here only so a future Agent can reconstruct this incident accurately.

## Future Agent handoff

When a BaseModel Preview is red but task-specific checks are green:

1. load current deployment policy plus `provider-failure-attribution-runbook.md`;
2. fetch current PR head and the failed deployment's actual SHA;
3. read the build log to the first failing phase;
4. classify ownership before making any mutation;
5. compare base if inherited debt is plausible;
6. freeze unrelated scientific/product semantics;
7. make the smallest owner-preserving fix;
8. rerun on exact new head;
9. if a later gate fails, diagnose it independently;
10. preserve the user's merge/review boundary;
11. save durable A/B lessons, not ephemeral C state.
