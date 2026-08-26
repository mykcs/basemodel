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
- Agent-documentation drift and repository-write hygiene issues discovered during closeout.

The purpose is not to preserve every transient SHA or deployment state. It is to preserve the reusable failure modes, diagnostic order, and boundaries future Agents should apply automatically.

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
- `seed-openevo-results-reader-contract.md` — Results-specific local evidence interaction and current scientific-state boundary;
- `docs/agents/README.md` — task-based Agent reading map;
- `docs/agents/LATEST.md` — short current handoff.

If future work finds another parser/output-contract mismatch, do not merely cite this incident. Run the current preflight, inspect fresh raw evidence, and update the executable gate when the invariant can be machine-protected.
