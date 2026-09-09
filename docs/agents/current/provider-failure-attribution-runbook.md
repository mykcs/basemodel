# Provider failure attribution runbook

Status: **current operational runbook**
Scope: BaseModel Preview / Production / hosted CI and deployment failures
Owner relationship: refines `AGENTS.md`, `scenario-trigger-registry.md`, `website-engineering-standard.md`, and `deployment-policy.md`; it does not replace them.

## Purpose

A red provider badge is an envelope, not a diagnosis.

For BaseModel, never jump from:

```text
Vercel = FAILED
```

to:

```text
Vercel infrastructure is broken
```

or:

```text
the product/scientific change is wrong
```

without locating the **first failing execution phase on the exact deployed commit**.

The required mental model is:

```text
provider event
-> exact deployed SHA / ref / deployment ID
-> build log
-> first failing command / phase
-> owning layer
-> narrowest owner-preserving correction
-> exact-head rerun
```

## 1. First establish identity, not interpretation

Before reading prose summaries or changing code, record:

- PR number, if any;
- current PR head SHA;
- SHA actually attached to the failed provider deployment;
- provider deployment ID / URL;
- source ref used by the provider;
- whether the PR head moved after the failure;
- whether `main` moved after the failure.

If the failed deployment belongs to an older SHA, do not call the current PR “failing”. State that **the historical deployment at SHA X failed**, then inspect current-head status independently.

A user message, PR body, old assistant report, or provider badge shown in a cached UI may be stale. Live GitHub/Vercel state wins.

## 2. Read the provider build log before classifying the failure

The first failure phase determines the likely owner.

Typical classes:

| First failing phase | Default classification | First owner to inspect |
| --- | --- | --- |
| clone / auth / provider machine startup | provider / access / infrastructure | provider configuration and live service state |
| install / lockfile bootstrap | environment / dependency contract | package manager, lockfile, runtime image |
| `lint` | source hygiene / static contract | exact source line and lint rule |
| typecheck / `astro check` | compile/type contract | exact file and diagnostic |
| CSS architecture audit | repository architecture contract | selector/state ownership, not provider |
| semantic / claims / freshness audit | repository/product/research contract | named audit owner |
| unit tests | implementation/test contract | failing test and base comparison |
| build/static generation | application/build contract | first build error |
| browser gate | rendered product / browser harness / environment | failing test plus runner evidence |
| deploy/upload after successful build | provider infrastructure / output contract | provider logs and artifact shape |
| runtime request after READY | runtime/product/provider edge | runtime logs and route behavior |

Do not classify by the final wrapper message such as `Command exited with 1`. The wrapper is not the root cause.

## 3. Preserve the difference between “provider-hosted failure” and “provider failure”

A command can fail **inside Vercel** while Vercel itself is healthy.

Example pattern:

```text
Vercel clones repository successfully
-> installs dependencies successfully
-> runs repository-owned verify:deploy
-> ESLint finds one unused binding
-> --max-warnings 0 converts the warning into exit 1
-> Vercel marks deployment ERROR
```

Classification: **repository lint failure executed by Vercel**, not Vercel infrastructure failure.

Likewise, an architecture audit that rejects `!important` is a repository CSS-governance failure hosted by Vercel, not a cloud outage.

## 4. A passing focused test suite does not prove the full provider pipeline is green

Different gates observe different layers.

A briefing-specific test can pass while the provider later fails lint. A static build can pass locally while the provider rejects a CSS architecture rule that was not run in that local command. Rendered QA can pass while a stale unused variable still violates `eslint --max-warnings 0`.

Therefore always report gates by name and environment:

```text
focused briefing tests: PASS
Reader Contract: PASS
local static build: PASS
Vercel exact-head verify:deploy: FAIL at lint
```

Never compress this into “all tests passed but Vercel randomly failed”.

## 5. When science/content checks pass and an engineering gate fails, freeze the scientific story

For research-publication work, once evidence shows the red state comes from an engineering-only gate, the default correction boundary is:

- do not rewrite scientific claims;
- do not change experiment identity;
- do not change result values to make a gate pass;
- do not weaken Reader Contract / claims / freshness / CSS / lint thresholds;
- fix the smallest engineering owner that actually failed.

A deployment failure is not authorization to opportunistically “improve” nearby research copy.

## 6. Prefer deletion/ownership repair over bypasses

When the first failure is a stale binding or architectural override:

- unused variable after removing its only consumer -> delete the binding;
- `!important` rejected by CSS architecture -> repair selector/state ownership;
- stale test enforcing retired UI -> update the test only after proving the product contract moved;
- base and candidate fail identically -> classify inherited debt before touching the candidate.

Invalid shortcuts:

- rename an unused variable to `_foo` merely to silence lint when it is genuinely dead;
- add `eslint-disable` around accidental dead code;
- weaken `--max-warnings 0`;
- add another `!important` exception to the baseline without an architecture decision;
- remove a scientific caveat because a page becomes easier to fit;
- rerun until green and call the first red result flaky without causal evidence.

## 7. Treat sequential gates as progressive diagnosis

After fixing the first failing gate, the next run may expose a second independent gate.

This does **not** mean the first diagnosis was wrong. It means the pipeline was fail-fast.

Required handling:

```text
failure A
-> fix A narrowly
-> rerun exact head
-> failure B appears later
-> classify B independently
-> fix B narrowly
```

Do not bundle an unseen second failure into the first root-cause story.

For every correction, record the delta size and semantic scope. “1 file, 1 deletion” or “same file, selector specificity only” is useful evidence that the fix did not mutate unrelated content.

## 8. Exact-head closeout

A provider incident is closed only when all of these are true:

1. current PR/ref head is re-read;
2. the deployed SHA equals the intended exact head;
3. the provider deployment for that SHA is READY/SUCCESS;
4. required repository checks for that head are green;
5. no unresolved failure was hidden by weakening a gate;
6. the requested merge/release boundary is respected.

If the task says “do not merge”, a successful deployment is **not** permission to merge.

If the task says “waiting for owner review”, stop after exact-head acceptance and preserve the review gate.

## 9. Moving-state guard

During diagnosis, PRs and `main` may move.

Immediately before any repair write:

- refresh PR head;
- refresh `main` if base drift matters;
- check for concurrent commits touching the same owner;
- compare the failed SHA to current head.

If another Agent already made the narrow repair and current exact head is green, do **not** create a no-op or cosmetic follow-up commit merely to demonstrate activity. Verify and report the existing repair instead.

This rule prevents duplicate provider spend and avoids turning a closed incident into new drift.

## 10. Retention model

Classify what survives the incident:

### A — durable rule

Persist rules such as:

- provider badge != root cause;
- first failing phase owns classification;
- exact deployed SHA must be bound to every claim;
- fail-fast pipelines can reveal multiple independent defects sequentially;
- narrow engineering repair must preserve accepted scientific semantics.

### B — project-level lesson

Persist BaseModel-specific details such as:

- `verify:deploy` is a chain of lint/type/audit/test/build/browser ownership layers;
- CSS architecture rejects new `!important` outside frozen debt;
- Vercel owns exact-head final acceptance and Production; repeated human-review iterations may use the separate non-authoritative prebuilt review Preview lane defined by current deployment policy;
- exact-head provider evidence is part of release/review acceptance.

### C — transient state

Do not promote:

- one deployment ID;
- one PR head SHA;
- one failure timestamp;
- current PR review state;
- current `main` SHA;
- temporary branch/ref names.

These may appear in a dated history case solely to reconstruct what happened.

## 11. Compact operator checklist

Before changing anything after a red provider event:

```text
[ ] fetch current PR/ref head
[ ] fetch failed deployment identity
[ ] confirm failed deployment SHA
[ ] read build logs
[ ] locate first failing phase
[ ] classify owner: provider / environment / repository / product / research / harness
[ ] compare base when inheritance is plausible
[ ] preserve scientific/product semantics outside the failing owner
[ ] apply smallest correction
[ ] rerun on exact new head
[ ] repeat classification if a later gate appears
[ ] verify provider SUCCESS on exact intended head
[ ] preserve merge/review boundary
[ ] save only A/B rules; leave C state historical
```
