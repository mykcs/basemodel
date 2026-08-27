# 2026-08-28 Results provenance, publication, and release-closeout retrospective

Status: **historical case record**. This document preserves one complete Agent conversation and its engineering/reasoning friction. It does **not** override `docs/agents/current/*`, executable repository truth, live GitHub/Vercel state, or current scientific authority in `mykcs/openevo-experiment`.

This record extends [`2026-08-26-seed-results-attribution-and-agent-friction-retrospective.md`](2026-08-26-seed-results-attribution-and-agent-friction-retrospective.md). The earlier record owns the detailed `<action>` attribution investigation and early Results-gate chronology. This record owns the **end-to-end conversation arc** from provenance audit through concurrent integration, scientific-state refresh, exact-head Preview, merge, Production lineage, and final acceptance.

## Why this record exists

The task looked like a normal research-page improvement:

> Make the SEED × OpenEvo Results page more trustworthy by binding specific claims to primary evidence, clarify the action-wrapper root cause, keep the scientific state current, and ship the result safely.

In practice, the work crossed five moving systems at once:

```text
scientific experiment state
+ website source state
+ GitHub branch / PR state
+ Vercel deployment policy
+ browser / publication acceptance gates
```

Most friction did not come from writing Astro markup. It came from repeatedly distinguishing facts that looked similar but had different authority or lifecycle.

The reusable lesson is:

```text
correct content
!= current scientific content
!= correctly sourced content
!= correctly integrated source
!= deployment-eligible source
!= exact-head accepted source
!= merged source
!= Production-accepted source
```

Future Agents should treat those as separate proof obligations.

## Conversation arc

### Phase 1 — Start from claims, not from the old page

The Results page already had many evidence links. The first temptation was to treat “lots of links” as “good provenance”. That was wrong.

The actual defect was local binding:

```text
specific observation
-> reader has to scan a later evidence bundle
-> reader infers which link proves the observation
```

The target architecture became:

```text
specific claim / number / attribution
-> nearest primary evidence
-> immutable revision
-> exact line range when practical

question / section
-> still keeps a complete evidence package for audit depth
```

This produced a shared evidence vocabulary and local evidence-reference component rather than repeated ad-hoc link markup. The important implementation owners included:

- `src/lib/researchEvidence.ts`
- `src/components/research/OpenEvoEvidenceRefs.astro`

The durable principle is not the filename. It is that **claim-level provenance and section-level audit packages are complementary**. One does not replace the other.

### Phase 2 — Scientific authority moved while the page work was in progress

The website was not the authority for whether Track A was still “prepared”, “validating”, “running”, or “complete”. The experiment repository was.

During the work, source-faithful Track A advanced from a preparation/validation story to a completed paired measurement. At the historical closeout point the supported Track A result was:

- authoritative runtime semantic validation: `128/128 PASS`, `mismatches=0`;
- BASE: `128/128` valid, mean Task Score×100 `7.17`, exact success `5/128 = 3.9%`;
- frozen OpenEvo SD-LoRA: `128/128` valid, mean Task Score×100 `8.74`, exact success `5/128 = 3.9%`;
- paired Task Score delta: `+1.57`;
- paired bootstrap 95% CI: `[-3.21,+6.31]`;
- parser-invalid: `0`;
- evidence publication: `PUBLISHED_AND_VERIFIED`.

The scientific conclusion was therefore:

> valid measurement, directionally positive Task Score, **no stable OpenEvo advantage established**.

This was not the paper-final exact 128 behind SEED 89.7 / 78.1%, and it did not reproduce the SEED paper checkpoint/training state.

This movement forced a general rule:

```text
before writing “current”, “next”, “complete”, “running”, “authorized”, or “blocked”
-> refresh experiment-side authority
-> pin the exact state used for the claim
-> then edit public copy
```

A website sentence can become scientifically stale without any website code changing.

### Phase 3 — Preserve scientific distinctions while improving attribution

Several phrases looked interchangeable but were not:

```text
internal fresh task-ID-disjoint transfer
!= held-out-range compatible evaluation
!= source-faithful first-validation semantics
!= paper-final exact denominator
```

Likewise:

```text
parameter update happened
!= task performance improved

measurement-valid result
!= positive effect

positive point estimate
!= stable improvement

Track A completed
!= OpenEvo vs SEED method comparison answered
```

The page work was only safe if these boundaries stayed visible while the information architecture changed.

This is the central reasoning pattern for research publication: **first preserve the claim lattice, then improve presentation**.

### Phase 4 — The original implementation path was overtaken by concurrent integration

A major source of wasted work would have been assuming that the Agent’s original branch remained the unique release candidate.

While the conversation continued, the provenance work was absorbed by a later integration PR, **PR #267**, together with the newer Track A state. Instead of creating a second competing provenance PR, the correct move was to compare semantic coverage and verify that the newer integration contained the intended work.

This produced another durable rule:

```text
my branch still exists
!= my branch is still the release authority
```

When main or another integration branch moves:

1. identify the new candidate;
2. compare semantics, not just filenames;
3. verify the required provenance/science/UI behavior is present;
4. if the new candidate subsumes the old one, treat the old path as superseded rather than duplicating it.

A later mainline PR (#270) also moved the branch after the core provenance work, reinforcing the need to verify ancestry and behavior rather than freezing the conversation around an earlier SHA.

### Phase 5 — Visible page state was correct, but public metadata was stale

After the major Results work landed, direct Production inspection found an important residual inconsistency:

- the visible Results body already described completed Track A;
- `<meta name="description">`, Open Graph description, and Twitter description still described `128/128 runtime validation` as the next step.

This mattered because metadata is public scientific copy too. Search previews, link cards, crawlers, and downstream consumers can see a different research state than a human reading the visible page.

The fix was deliberately narrow: update the Chinese and English Results route descriptions and do not reopen the whole Results implementation.

A second residual was also found: an older Q7 remained in raw DOM but was hidden by the migration CSS while a newer authoritative Q7 was visible. The initial instinct was to remove the stale hidden block immediately. That would have been unnecessary scope expansion because the migration structure was already protected by tests and was not the public visible claim owner.

The reusable ownership rule is:

```text
publicly wrong state
-> fix the smallest owning layer

legacy implementation smell with no current semantic defect
-> do not automatically refactor during release closeout
```

“Clean everything while we are here” is not a release strategy.

### Phase 6 — Branch naming turned out to be executable deployment configuration

The first metadata-cleanup PR used a `fix/**` branch. The code was fine, but the expected Vercel Preview did not appear.

The root cause was not Vercel failure and not source failure. In this repository, branch prefix is part of executable deployment policy. At the time, the relevant Vercel policy enabled ordinary Git-triggered deployment for selected branch patterns such as `research/**`, not ordinary `fix/**` branches.

The cleanup was therefore moved to a deployment-eligible `research/**` branch, the earlier PR (#271) was marked superseded, and the replacement became **PR #272**.

The durable rule is already captured by current branch policy, but this incident is the concrete reason:

```text
branch naming convention
can be
branch execution policy
```

Before choosing a branch for work that requires exact-head Preview acceptance:

1. inspect executable `vercel.json` / provider policy;
2. inspect any exact-head build-spend token rule;
3. choose the branch prefix that satisfies the required release workflow;
4. do not discover eligibility by waiting for a deployment that can never start.

### Phase 7 — GitHub Contents API introduced a meaningless EOF diff

The metadata edit also exposed a small but recurring tool friction: a file write dropped the final newline on one route.

That changed nothing semantically, but it polluted the diff and changed the exact head. The newline was restored before acceptance.

This is a small lesson with disproportionate value:

```text
API write succeeded
!= diff is clean
```

After repository API writes, inspect the final diff for:

- accidental EOF/newline changes;
- encoding drift;
- formatting-only churn;
- unrelated file rewrites.

Every unnecessary diff line raises review and lineage cost.

### Phase 8 — Preview READY did not mean every required browser gate executed

The replacement branch produced an exact-head Vercel Preview and the deployment build ran the repository verification chain. The build itself was healthy, but the hosted browser-gate logic for that branch did not execute the same full Results release matrix; the relevant browser layer was reported as skipped.

This created a critical semantic distinction:

```text
process exit 0
!= gate executed

Preview READY
!= browser acceptance executed

skipped
!= PASS
```

For the metadata-only change, the risk was bounded because:

- the diff was only two metadata descriptions;
- the already-landed Results UI had passed the full browser suite under the core release;
- the exact-head source/HTML could be inspected for the metadata change;
- no visible DOM/layout component changed.

But the skip was kept explicit rather than relabelled as browser acceptance.

The later Production build on `main` did execute the full required browser layers and closed the verification gap.

Future Agents should verify gate semantics from logs:

```text
expected gate start marker
-> expected ref/branch eligibility
-> expected test files or test count launched
-> assertions completed
-> explicit PASS
```

Do not infer execution from a green provider card.

### Phase 9 — Preview access protection was a tooling limitation, not a product failure

The exact-head Preview was protected by team authentication/SSO. One provider fetch path therefore returned a redirect/login response instead of the page HTML.

That did not mean the Preview was broken. Deployment metadata and build logs still proved:

- the exact Git SHA;
- build execution;
- build status;
- deployment state.

The lesson is to classify access failures correctly:

```text
cannot fetch protected Preview anonymously
!= Preview build failed
!= public Production route failed
```

Use the strongest provider-owned evidence available for the property being tested, and do not turn an authentication boundary into a source-code diagnosis.

### Phase 10 — Final acceptance required Production lineage, not merely a successful merge

PR #272 was merged with expected-head protection. The historical merge commit was:

`0a6db58004e868c48a462dd25e9d8da4d49865b7`

The release was not called complete at merge time.

The Production successor had to prove that it was built from that merge (or a descendant), then the stable Chinese and English Results routes had to be re-read.

At the closeout point the Production build:

- built `435` pages;
- completed `verify:deploy` successfully;
- passed the full Chromium UI gate `91/91`;
- passed the focused lab browser gate `12/12`;
- served the Chinese and English Results routes with HTTP `200`;
- returned updated meta / Open Graph / Twitter descriptions describing completed Track A;
- preserved the visible current Track A result and Track B boundary.

Only then did the task move from “implemented” to “implemented and verified”.

The release ladder is:

```text
source change
-> exact-head repository verification
-> exact-head Preview (when required)
-> required Preview/browser acceptance actually executed
-> merge locked to expected head
-> Production successor from merge or descendant
-> stable-route acceptance
-> scientific/public-copy consistency check
```

Skipping any arrow creates a different statement than “verified”.

## The main reasoning frictions

### 1. Authority was multidimensional

There was no single universal “source of truth”. Different questions had different owners:

| Question | Authority |
|---|---|
| What does the current experiment prove? | `mykcs/openevo-experiment` executable artifacts / current campaign / reconciliation / receipts |
| What does the website source currently say? | `mykcs/basemodel` exact Git state |
| Which branch/PR is the current release candidate? | live GitHub refs / PR ancestry |
| Will this branch receive a Preview? | executable Vercel/Git deployment policy |
| Did a hosted gate really run? | build logs + launched test evidence |
| What is public now? | READY Production lineage + stable public routes |

A future Agent should write this authority matrix down mentally before editing.

### 2. Similar labels hid different scientific claims

The largest scientific risk was collapsing distinct denominators or lifecycle stages into one phrase such as “SEED 128 tasks”.

A safe public Results page needs the exact denominator/semantics attached to every major result.

### 3. Provenance is about local explanatory distance

The strongest primary source is less useful if the reader cannot tell which sentence it supports. Good provenance minimizes the distance between claim and evidence without turning the page into a dump of raw files.

### 4. Release closeout rewards minimal ownership

Once the core result was accepted, the correct cleanup was two metadata descriptions, not a large migration refactor. Small ownership reduced the chance of invalidating already-proven UI behavior.

### 5. Green states need semantic interpretation

Several green-looking states were weaker than they appeared:

- Preview did not appear because the branch was ineligible;
- a deployment could be READY while a conditional browser gate was skipped;
- a process could exit 0 because the gate intentionally did nothing;
- a stable URL could return 200 while still serving an older deployment if lineage was not checked.

The correct question is never only “is it green?” It is “**what exactly does this green state prove?**”

## Approaches that created friction or would have created it

### Starting from stale website prose

Bad pattern:

```text
read current page
-> edit old wording incrementally
```

Better:

```text
resolve scientific authority
-> build claim table
-> compare website against it
-> rewrite only stale owners
```

### Treating the original branch as sacred

Bad pattern:

```text
I started this branch
-> therefore this branch must merge
```

Better:

```text
which exact head now contains the intended semantics?
-> verify it
-> supersede duplicate paths
```

### Assuming branch prefixes are cosmetic

Bad pattern:

```text
use fix/** because it sounds semantically right
-> wait for Preview
```

Better:

```text
release requires Preview
-> inspect executable deployment eligibility first
-> choose a compatible prefix intentionally
```

### Treating skipped acceptance as passed acceptance

Bad pattern:

```text
provider card green
-> all gates passed
```

Better:

```text
gate required?
-> prove it launched
-> prove assertions ran
-> prove explicit PASS
```

### Removing every stale-looking hidden implementation detail during closeout

Bad pattern:

```text
hidden legacy DOM looks old
-> refactor before release
```

Better:

```text
is this the current public semantic owner?
-> if no, defer unless it creates a concrete defect
```

### Polling a healthy provider build for many minutes

The closeout spent too much conversational effort in repeated provider polling while Vercel was visibly progressing through a long browser matrix.

That produced little new information and no action until the next meaningful gate transition.

Current `docs/agents/LATEST.md` now records the better discipline:

1. pin exact SHA and deployment identity;
2. do one immediate state/log check;
3. if the build is healthy and progressing, avoid rapid repeated sleeps/polls;
4. continue only independent work that cannot invalidate the same deployment;
5. otherwise return a resume checkpoint and re-read the provider later.

Provider latency is not Agent reasoning work.

## A reusable workflow for future Results / research-publication tasks

### Step 1 — Resolve current authority before touching copy

Read current Agent policy, then inspect:

- exact BaseModel `main`;
- exact experiment-side scientific authority;
- active PRs/branches that may already overlap the task;
- executable deployment policy if a Preview will be required.

### Step 2 — Build a claim inventory

For every important public claim record:

```text
claim
claim type
scientific status
primary evidence
immutable revision
boundary / non-claim
public owner location
```

Important claim types include:

- official-code behavior;
- raw runtime behavior;
- machine measurement;
- derived statistical interpretation;
- governance/authorization state;
- paper-reported value;
- historical diagnosis.

### Step 3 — Bind the closest primary evidence locally

Prefer:

1. pinned official code;
2. raw episode;
3. machine result/reconciliation;
4. frozen config/manifest/receipt;
5. commit diff;
6. contemporaneous report;
7. later summary only when stronger evidence does not exist.

### Step 4 — Preserve claim boundaries before changing hierarchy

Freeze the meaning first. Only then move, collapse, simplify, or restyle the content.

### Step 5 — Check all public semantic surfaces

Do not inspect only visible body text. Check:

- visible Chinese copy;
- visible English copy;
- meta description;
- Open Graph/Twitter description;
- structured data when relevant;
- print/provenance output;
- hidden/migration content only to decide whether it is a current owner or technical debt.

### Step 6 — Re-resolve concurrent Git state

Before opening or merging a PR, ask whether another PR or new `main` already subsumed the work. Prefer one authoritative integration head.

### Step 7 — Choose branch/release path from executable policy

If exact-head Preview is required, verify branch eligibility and any explicit Preview-spend token before the first provider-triggering push.

### Step 8 — Keep the final diff minimal and clean

Inspect for EOF, formatting, generated-file, or unrelated churn. Do not let tooling artifacts become part of the scientific release diff.

### Step 9 — Verify execution, not status color

For every required gate, prove that it actually ran. `SKIPPED`, ignored, stale-head, canceled, or rate-limited execution is not a PASS.

### Step 10 — Merge with expected-head locking

Record the exact accepted head and reject the merge if the PR head moved after acceptance.

### Step 11 — Verify Production lineage

Require a READY Production successor from the merge commit or a descendant. Do not infer lineage from a stable hostname alone.

### Step 12 — Re-read stable public routes

For research Results, re-read both languages and confirm:

- current scientific numbers;
- current conclusion wording;
- metadata wording;
- next-step/governance boundary;
- no accidental paper-reproduction overclaim.

Only then report the work as verified.

## A compact diagnostic ladder

When something “does not look released”, diagnose in this order:

```text
1. Is the intended change present in the exact Git head?
2. Is that head still the authoritative release candidate?
3. Is the branch deployment-eligible?
4. Did the provider actually start a build?
5. Did repository verification run?
6. Did the required browser gate execute rather than skip?
7. Is the deployment READY?
8. Does deployment metadata point to the expected SHA?
9. Is Production that SHA or a descendant?
10. Do stable zh/en routes expose the intended content and metadata?
```

This order prevents debugging UI code when the real problem is branch policy, and prevents debugging Vercel when the real problem is stale scientific copy.

## What should remain historical versus current

This file is intentionally a retrospective. Durable behavior belongs in current owners.

Future Agents should read these current files instead of treating this case record as policy:

- `docs/agents/current/scientific-state-provenance.md` — scientific authority and provenance boundaries;
- `docs/agents/current/experiment-result-publication-workflow.md` — experiment-to-site publication flow;
- `docs/agents/current/branch-and-pr-conventions.md` — branch semantics and deployment eligibility;
- `docs/agents/current/deployment-policy.md` — hosted verification/deployment rules;
- `docs/agents/current/release-closeout-protocol.md` — merge/Production closeout and lineage;
- `docs/agents/current/project-agent-operating-principles.md` — tool/write hygiene and autonomy;
- `docs/agents/current/research-editorial-style.md` — claim/evidence/inference/boundary writing;
- `docs/agents/current/seed-openevo-results-reader-contract.md` — Results-reader hierarchy and scientific copy contract.

If this retrospective disagrees with any current owner or executable truth, the retrospective loses.

## Historical anchors from this conversation

These are useful for reconstructing the case, not for discovering current state:

- **PR #267** — integration that absorbed the core Results provenance/scientific-state work;
- **PR #271** — first metadata-cleanup path, superseded after branch deployment-eligibility was diagnosed;
- **PR #272** — replacement metadata cleanup on a deployment-eligible research branch;
- PR #272 exact accepted head: `712b38033c9ce00f2e7d1b9073f0d1b8363df61c`;
- PR #272 historical merge commit: `0a6db58004e868c48a462dd25e9d8da4d49865b7`;
- historical Production closeout: `435` pages built, `91/91` UI tests passed, `12/12` lab browser tests passed, Chinese/English Results routes returned `200` with refreshed completed-Track-A metadata.

`main` and WB1 moved again after this closeout. That is expected and is itself part of the lesson: **a historical retrospective can preserve process truth while becoming stale as a current-state source**.

## Final mental model

The most useful compact model from the whole conversation is:

```text
RESEARCH PUBLICATION

scientific authority
    ↓
claim inventory
    ↓
claim-local primary evidence
    ↓
reader hierarchy + boundary-preserving copy
    ↓
exact Git integration head
    ↓
deployment-eligible release path
    ↓
exact-head verification that actually executes
    ↓
merge locked to accepted head
    ↓
Production lineage
    ↓
stable-route + metadata acceptance

Only after the final arrow is “implemented and verified” justified.
```

And the main stopping rule is:

> When a new problem appears, first identify **which layer owns the property that is wrong**. Fix that layer only. Do not let a scientific-state problem become a CSS refactor, a branch-policy problem become a Vercel debugging session, a provider-auth boundary become a product bug, or a hidden migration detail become an excuse for broad release-scope expansion.
