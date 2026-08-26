# 2026-08-26 SEED Results attribution, provenance, and Agent-friction retrospective

Status: **historical case record**. This document explains why the current Agent/research-publication rules exist; it does not override `docs/agents/current/*`, executable repository truth, or live experiment/provider state.

## Scope

This closeout covers the 2026-08-25/26 SEED × OpenEvo Results work that combined:

- the SEED-held-out WebShop comparison and repaired PRIMARY-v2 measurement;
- the later source-semantics audit that narrowed what the historical 128-task panel could be called;
- root-cause attribution for the `<action>...</action>` versus `[action]...[/action]` mismatch;
- the website explanation of model-side format drift versus experiment-integration responsibility;
- the follow-up plan to make Results evidence claim-level and directly auditable;
- repeated Preview/Production/main-movement friction during release verification;
- the final Results information-hierarchy correction that moved code-level attribution out of the major-section path and into collapsed technical depth after the seven-question narrative;
- serial UI-gate closeout across the Results and `/lab/` surfaces, including a gate that exited successfully while silently skipping on `main`;
- Agent-documentation drift and repository-write hygiene issues discovered during closeout.

The purpose is not to preserve every transient SHA or deployment state. It is to preserve the reusable failure modes, diagnostic order, successful recovery sequence, and boundaries future Agents should apply automatically.

## What actually happened

The most important scientific/engineering distinction was this:

```text
literal `[action]` token origin
!= prompt contract
!= training-data cause
!= inference-backend rewrite
!= parser behavior
!= experiment-integration responsibility
```

The released SEED WebShop prompt requires `<action>...</action>`, and the released `webshop_projection` extracts that wrapper and falls back to the final 20 characters when it cannot find the tags. In saved no-adapter BASE episodes, the actual prompt also requested `<action>...</action>`, yet Qwen2.5-7B-Instruct sometimes generated `[action]...`, while later steps in the same episode could return to angle brackets. The Transformers backend decoded generated tokens directly; there was no bracket rewrite. The H1.36 self-evolution data path filtered parser-invalid/fallback traces before they could become qualified training samples.

The deepest repository-supported attribution was therefore:

> Qwen2.5-7B-Instruct exhibits action-wrapper format drift under this prompt/chat-template inference path.

The experiment-level responsibility was different:

> This drift had already been identified during H1.36, but the later formal SEED-strict PRIMARY-v1 integration did not preflight the known model-output/parser compatibility boundary. The measurement path therefore projected otherwise valid `search[...]` / `click[...]` commands into invalid tail fragments and produced an all-zero measurement that was not interpretable as model capability.

This must not be rewritten as any of the following:

- “SEED parser had a bug”;
- “OpenEvo prompt told the model to use `[action]`”;
- “SD-LoRA created the `[action]` habit”;
- “the commit author who documented the issue wrote the model’s `[action]` tokens”;
- “OpenEvo cannot do WebShop.”

Repository evidence does not identify which Qwen pretraining/SFT example produced the wrapper habit, so attribution stops before naming an upstream sample or person.

## Friction 1 — the page had evidence, but claims and evidence were not locally bound

The Results page already contained many Code / Config / Machine result / Human report links. The friction was that a reader could see a highly specific observation and then have to infer which later link supported it.

Example:

```text
SEED released parser rule
webshop_projection recognises <action>...</action>;
when the tags are absent it falls back to the final 20 characters.
```

This should not force the reader to search a later evidence grid. The reusable rule is:

```text
specific claim
-> local evidence reference
-> closest primary source
-> immutable revision
-> exact line range when practical
```

Evidence priority for research publication is:

1. official source code / raw episode / machine result / frozen config or manifest / runtime receipt / commit diff;
2. contemporaneous experiment report, closeout, audit, or preregistration;
3. later human summary or website prose.

A Level-3 summary may help interpretation, but it should not replace Level-1 evidence when Level-1 exists.

## Friction 2 — model-output provenance and human responsibility were initially easy to conflate

The phrase “OpenEvo outputs `[action]`” is too coarse because “OpenEvo” can refer to a prompt template, adapter, training procedure, runner, backend, or whole experiment stack.

For future attribution work, walk the layers in this order:

1. **Official benchmark contract** — what does the upstream prompt/parser require?
2. **Actual prompt at runtime** — what text did the model really receive?
3. **Raw model output** — what exact completion tokens were generated?
4. **Backend transformations** — did any decode/postprocessor rewrite the text?
5. **Training-data path** — could malformed behavior have entered supervision?
6. **Measurement harness** — how was output projected into the environment?
7. **Prior knowledge** — was this failure mode already known before the formal run?

Only after those steps should responsibility be assigned. Separate:

- token provenance;
- method/training causation;
- integration responsibility;
- publication wording.

## Friction 3 — a known compatibility failure was not promoted into a formal preflight gate

H1.36 had already recorded wrapper drift and introduced compatibility handling. The later PRIMARY-v1 still entered a SEED-strict measurement path without proving the frozen policy’s real completions were compatible with the released parser.

The durable benchmark-interface preflight is:

```text
freeze model + prompt + chat template
-> collect a non-formal canary sample from BOTH arms
-> retain raw_completion
-> run the exact formal parser/projection
-> record detected wrapper + projected action + validity reason
-> compare against admissible environment actions
-> fail closed on unknown format
-> only then authorize formal held-out consumption
```

A synthetic parser unit test alone is not enough. The canary must exercise the real `model -> decode -> projection` path.

Formal episode records should preserve at least:

- raw completion;
- parser/projection version or hash;
- detected wrapper;
- projected action;
- parser-valid / invalid reason;
- fallback usage;
- adapter identity;
- task identity.

Unknown wrappers should remain visible invalid measurements. They must never be silently dropped or converted into a seemingly normal model score.

## Friction 4 — “correct held-out range” was weaker than “source-faithful task identity”

The historical 128-task panel did come from SEED’s held-out `goal_idx 0-499` range. The later audit showed that worker-specific seeds change goal ordering before `reset(session=N)`, so numeric session/goal index is not a complete task identity for a source-faithful public-code validation reconstruction.

The reusable distinction is:

```text
range-compatible panel
!= source-faithful task semantics
!= paper-final denominator
```

A later audit may narrow the label of older valid evidence without deleting that evidence. The historical panel remains useful as a frozen local SEED-compatible panel; it must not be relabelled as the exact paper-final 128 or as a source-faithful first-validation panel.

## Friction 5 — website state lagged the experiment repository

At one point the public Results workflow still described the source-faithful successor as design-only while the experiment repository had advanced through deterministic manifest construction, fail-closed readiness, and formal-run authorization.

The publication rule is:

```text
resolve exact openevo-experiment branch/SHA
-> read current-campaign on that state
-> resolve latest valid reconciliation/result
-> determine claim boundary
-> only then edit website copy/current docs
```

Do not begin from the previous website sentence and ask whether it still sounds plausible. `docs/agents/current/*` can become stale too; if executable/live truth contradicts a current document, update the current document rather than adding another workaround layer.

## Friction 6 — deployment identity and product acceptance were repeatedly easy to confuse

Three separate facts were repeatedly in play:

- a historical Vercel deployment-specific hostname is immutable;
- `main` can move while a long-running deployment is still building;
- a deployment can fail because of an unrelated route even when the changed Results route already passed its own UI gates.

The acceptance chain is:

```text
source change
!= exact-head repository Gate/build
!= exact-head Preview deployment
!= changed-route browser acceptance
!= merge
!= Production acceptance
```

When `main` moves, verify ancestry. A successor Production commit can still contain an earlier accepted Results change when the newer commit is its descendant. Conversely, an old READY deployment URL never mutates into the newest main content.

Unrelated gate failures must be classified rather than blamed on the current change. In this case, a `/lab/` ServerExplainer geometry failure blocked Production after the Results route had passed its relevant gates; the correct response was to fix the real lab regression, not weaken or skip the gate and not claim the Results page itself had failed.

## Friction 7 — Agent documentation had become correct but expensive to enter

The repository already had strong policies, but the entry path had accumulated a long linear list in both `/AGENTS.md` and `docs/agents/README.md`. That makes future Agents either over-read everything or skip important task-specific documents.

The intended structure is progressive disclosure:

```text
small bootstrap
-> scan scenario triggers
-> load one task bundle
-> inspect executable truth
-> execute
```

Document roles should stay distinct:

- `/AGENTS.md` — fast router + non-negotiable invariants;
- `docs/agents/LATEST.md` — short current handoff/state snapshot;
- `docs/agents/README.md` — task-based documentation map;
- `docs/agents/current/*` — authoritative current policy/runbooks;
- `docs/agents/history/*` — incidents, rationale, superseded state, and retrospectives;
- `docs/agent-context/*` — retained historical research-workbench context.

Do not duplicate a full policy into multiple entrypoints merely to make it discoverable. Improve the router instead.

## Friction 8 — repository write operations must never be used as discovery probes

During closeout, a tool-routing mistake created temporary probe writes/comments. They were cleaned or explicitly marked as accidental, but the lesson is reusable:

- use read/search/fetch operations to discover repository/provider capabilities;
- never create a file, comment, branch mutation, or other shared-state artifact merely to test whether a tool works;
- know the intended path/content before invoking a write;
- prefer one atomic multi-file commit over sequential Contents-API writes;
- if an accidental write occurs, stop, classify it, clean it immediately when possible, and report any residue rather than hiding it.

Shared repository surfaces are user-visible state, not a scratchpad.

## Friction 9 — deep technical attribution was initially given too much page hierarchy

The action-wrapper investigation was valuable, but its first publication shape promoted it to a major Results section. That made a forensic implementation detail compete with the page’s actual job: answer the seven research questions and explain what the experiment has established.

The correction in PR #261 moved the material after the seven-question narrative and made it default-collapsed. The durable placement rule is:

```text
reader question
-> visible answer + minimum reasoning bridge
-> local “展开实验依据” for exact numbers/code tied to that answer
-> optional collapsed forensic trace for readers who want the full chronology
```

A technical trace should **not** become a top-level section merely because it contains a lot of evidence. Promote it only when it changes the scientific answer, comparison, or next decision for the default reader.

For code-level responsibility chains, use chronology rather than abstract blame labels:

```text
upstream official contract
-> our actual runtime prompt
-> raw model output
-> backend transformation boundary
-> contemporaneous commit where the issue was known
-> training-data inclusion/exclusion path
-> formal experiment where the mismatch became consequential
-> repair and what exactly changed
```

The final Results action-wrapper trace follows this order: SEED prompt/projection -> our saved prompt/raw BASE episode -> no-adapter wrapper drift -> H1.36 report and commit `8e526e42` -> H1.36 data filtering -> PRIMARY-v1 failure -> PRIMARY-v2 compatibility repair.

Progressive disclosure is not hiding evidence. It is assigning detail to the correct reader depth.

## Friction 10 — a serial browser gate can reveal several independent defects one after another

The closeout from PR #254 onward demonstrated why “the test that was red is green now” is not completion.

The sequence was:

1. **PR #254** introduced the layered Results explanation and changed page density/structure while preserving scientific boundaries.
2. **PR #255** repaired the SEED 128-task mobile readability failure without weakening the CJK threshold. The canonical 390px issue passed, but full Production continued into later gates.
3. Production then exposed a separate **Results desktop heading/card proximity** regression. **PR #256** fixed layout order only; it did not rewrite science or loosen the existing geometry test.
4. Full `vercel-ui-gate` then passed **91/91**, but `vercel-lab-browser-gate` printed `skipped for branch: main`. The command path had not failed, yet the required gate had not executed. **PR #257** fixed the branch condition so the gate genuinely ran on `main`.
5. Once the lab gate actually ran, it exposed real `/lab/` responsive connector issues. **PR #258** restored the intended mobile/text vs tablet-desktop/SVG split; **PR #260** aligned the server topology with the measured viewport contract and rerouted the connector around unrelated nodes.
6. **PR #259** added the action-wrapper attribution evidence; subsequent owner feedback showed the scientific content was useful but its page hierarchy was too high.
7. **PR #261** preserved the evidence while folding it into a collapsed post-seven-question technical trace.
8. **PR #262** consolidated the reusable attribution/provenance and Agent-workflow lessons into the current documentation system.

The reusable interpretation is:

```text
first failure fixed
!= remaining suite exercised
!= next gate executed
!= full release accepted
```

A hosted gate with `--max-failures=1` is a serial diagnostic queue. Every newly exposed failure must be classified independently as product, stale contract, invalid metric, harness/environment, or policy/wiring. Do not infer that later tests are clean just because they were not reached.

## Friction 11 — “exit 0” and “PASS” can still be semantically different

The lab-gate skip on `main` is a particularly important release lesson.

For every acceptance gate that the release contract requires, verify evidence of **execution**, not just process success:

```text
expected gate start marker
-> expected branch/ref eligibility
-> expected test file(s) or test count actually launched
-> assertions completed
-> explicit PASS / zero failures
```

If logs say `skipped`, `ignored`, or `not eligible`, that can be a correct policy outcome, but it cannot satisfy an acceptance requirement that says the gate must actually run.

This distinction applies equally to branch-only Previews, expensive browser subsets, conditional tests, and provider ignore rules.

## Successful patterns that worked in this round

Several recovery choices repeatedly reduced risk and should be reused.

### 1. Freeze the scientific boundary while fixing presentation or harness defects

For #255, #256, #258, #260, and #261, keep the research claim stable and change only the owning layer: wording/layout/connector geometry/information hierarchy. This prevents a UI failure from silently becoming a scientific rewrite.

### 2. Fix the smallest owning layer; do not weaken the detector

When a valid threshold exposed a real problem, repair the product. When a stale assertion encoded retired information architecture, update that assertion narrowly while retaining unrelated overflow/geometry/theme protection. When a gate was skipped, fix the execution condition rather than marking the skip as acceptable.

### 3. Treat Production as an evidence-producing environment, not a green badge

The useful signal came from reading exact failing assertions, measured widths/geometry, gate markers, and test counts. Provider state was necessary but weaker than the executable line that explained what happened.

### 4. Use exact-head identity and expected-head merge locking

Before each merge, tie acceptance to the actual head SHA and merge with `expected_head_sha` when available. This prevents a late branch mutation from slipping into an already-approved release.

### 5. Keep the main reader path stable and move detail downward

The seven-question Results narrative remained the semantic spine. Extra evidence was made locally discoverable and the full forensic chain became optional depth. This preserved auditability without forcing every reader through the debugging chronology.

### 6. Link evidence at the level where the claim is made

Official behavior links to official code; our runtime behavior links to saved prompts/raw episodes; historical knowledge links to the contemporaneous commit/report; metric claims link to machine analysis/reconciliation. This made responsibility language much less ambiguous.

### 7. Deposit lessons only after the failure class is understood

The durable docs were written after the product/test/provider distinctions were clear. This avoids freezing a first guess as policy.

## Reusable end-to-end SOP distilled from this case

For a future research-page change that touches scientific copy, evidence, layout, and release:

```text
1. resolve current scientific authority
   branch/SHA -> campaign -> reconciliation/result -> claim boundary

2. write the reader-path map before implementation
   first-screen answer -> major questions -> local evidence -> optional deep trace

3. pin evidence locally
   official code / raw episode / config / machine result / contemporaneous commit

4. identify existing semantic and visual contracts
   reader tests + overflow + geometry + theme + browser gates

5. make one coherent change without widening the scientific claim

6. run deterministic Gate/build and focused browser checks

7. obtain exact-head hosted acceptance when the ref is eligible
   verify deployment metadata, not only branch name

8. if a gate fails, classify the first failure and fix its owner
   product / stale contract / invalid metric / harness / environment / policy wiring

9. rerun until the whole required suite executes
   a formerly-red test passing is only a checkpoint

10. race-check head/base/provider state and merge the accepted exact head

11. verify Production separately
   exact main SHA + required gates actually executed + affected route + metadata

12. after closeout, deposit only reusable lessons
   executable invariant first, current SOP second, historical case for detailed rationale
```

If a Preview is absent, first check `vercel.json` ref eligibility and whether Vercel created a deployment object for the exact SHA. Do not generate no-op writes merely to “wake up” an integration, and do not call policy-driven absence a provider outage.

## Failed approaches / anti-patterns to avoid repeating

- promoting a detailed forensic chain to major page hierarchy because it is long or technically interesting;
- using a page-level evidence pile where a specific claim has no obvious supporting source;
- assigning blame before separating official contract, runtime prompt, raw output, backend, training path, and harness;
- treating a known model/parser mismatch as something human memory will catch next time instead of adding a real canary/preflight;
- assuming a fixed numeric task range uniquely identifies source-faithful task semantics;
- starting a website update from stale website prose instead of the active experiment state;
- calling an absent Preview a Vercel outage before checking ref eligibility/deployment objects;
- treating `skipped` as `passed` when the release contract requires execution;
- accepting a serial gate because the first formerly-red test turned green;
- weakening a quality threshold to force green instead of classifying the failure;
- creating repository/provider writes as tool-discovery probes;
- persisting transient deployment IDs/URLs as timeless current truth.

## Claim-level provenance contract

For a specific factual row, observation, or number, ask:

> If a PI points to this sentence and asks “why are we allowed to say this?”, can the reader reach the closest primary evidence in one local click?

Use these mappings:

- upstream benchmark behavior -> pinned official code;
- runtime prompt -> saved prompt/raw episode;
- model text -> raw completion;
- backend behavior -> implementation source;
- training inclusion/exclusion -> dataset-builder/launcher source;
- metrics and uncertainty -> machine analysis/reconciliation;
- task selection -> manifest/builder/preregistration;
- historical decision -> contemporaneous commit/report;
- current live state -> explicit mutable router such as `current-campaign.json`, labelled as current state.

For historical evidence, use immutable commit links. For source claims, add GitHub line anchors where stable and verified. Do not fabricate line ranges.

The main page should still remain readable without opening evidence. Claim-level provenance belongs primarily in local evidence disclosures rather than turning the first screen into a citation wall.

## Current boundary at this retrospective

At the time this record was written, the source-faithful Track A successor had advanced beyond design-only status. The experiment repository recorded an execution-readiness release with 20/20 checks passed and a 256-episode paired formal run in progress. That is **execution state, not a result**. No website or current policy should infer the eventual BASE-versus-SD outcome until reconciliation/analysis/closeout exists.

This status is intentionally not frozen as timeless truth. Future Agents must refresh `mykcs/openevo-experiment` before using words such as “current”, “next”, or “still running”.

## Where the durable rules live now

This historical case should remain detailed evidence. Reusable rules belong in the current owners:

- `project-agent-operating-principles.md` — read-before-write and repository-write hygiene;
- `experiment-result-publication-workflow.md` — upstream-state refresh, evidence hierarchy, claim-level provenance, and attribution workflow;
- `seed-openevo-results-reader-contract.md` — Results-specific reader hierarchy, local evidence interaction, and current scientific-state boundary;
- `release-closeout-protocol.md` — exact-head identity, required-gate execution proof, merge race-check, and Preview -> Production closeout;
- `deployment-policy.md` — serial browser-gate failure classification and provider/build-budget rules;
- `docs/agents/README.md` — task-based Agent reading map;
- `docs/agents/LATEST.md` — short current handoff.

If future work finds another parser/output-contract mismatch, do not merely cite this incident. Run the current preflight, inspect fresh raw evidence, and update the executable gate when the invariant can be machine-protected.
