# Experiment result publication workflow

Last reviewed: **2026-08-29**
Status: **current**  
Audience: research, content, UI, review, and release Agents

Experiment-side counterpart: [`mykcs/openevo-experiment/docs/experiment-tracking/RESULT_PUBLICATION_HANDOFF.md`](https://github.com/mykcs/openevo-experiment/blob/main/docs/experiment-tracking/RESULT_PUBLICATION_HANDOFF.md).

This runbook defines how scientific results move from `mykcs/openevo-experiment` into the Base Model website without turning the website into a second experiment-state database.

It specializes, and does not replace:

- `scientific-state-provenance.md` for scientific-source ownership and freshness;
- `seed-openevo-results-reader-contract.md` for the Results route's reader voice and claim boundaries;
- `human-thinking-web-expression-contract.md` and `audience-centered-technical-copy.md` for user-facing expression;
- `deployment-policy.md` and `release-closeout-protocol.md` for Preview -> Production release.

## Ownership boundary

The normal flow is:

```text
mykcs/openevo-experiment
  experiment design / preregistration
  -> execution
  -> reconciliation / result
  -> explicit claim boundary
  -> publication-ready evidence

mykcs/basemodel
  resolve exact upstream state
  -> translate claim for the reader
  -> attach pinned evidence
  -> test exact page semantics
  -> Vercel Preview
  -> merge
  -> Vercel Production
```

`openevo-experiment` owns whether a scientific claim is valid. `basemodel` owns how that valid claim is explained, navigated, tested, and released.

A website edit must never upgrade an upstream “signal” into a “win”, turn a measurement-invalid run into a valid negative result, merge two benchmark protocols into one claim, or use deployment status as scientific evidence.

## Intake rule: resolve science before writing copy

Before changing current-facing experiment copy, resolve the scientific source in this order:

```text
actual openevo-experiment branch / SHA used by the scientific work
-> configs/experiment/current-campaign.json on that state
-> latest valid reconciliation / result for that campaign or successor
-> claim boundary recorded by that evidence
```

Do not start from the existing website sentence and ask whether it “still sounds plausible”. Do not start from a chat recap, W&B panel, or an older default-branch status page if a newer active scientific branch is operative.

The website Agent should be able to state all of the following before editing:

1. exact upstream repository branch and commit SHA;
2. which campaign/question changed;
3. which result/reconciliation is authoritative;
4. validity classification of the relevant runs;
5. comparison/task/denominator semantics;
6. headline metrics and uncertainty needed for the claim;
7. what the evidence supports;
8. what it still does not prove;
9. whether older evidence remains valid history, is superseded, or is invalid for a specific reason;
10. what “next/current/active” means if the page will use those words.

If one of those is genuinely unresolved, fix the scientific ambiguity upstream rather than hiding it with website wording.

## Translate the claim; do not reinterpret it

The public page should expose the shortest correct reasoning bridge:

```text
what we observed
-> what that supports
-> what it does not yet prove
```

Exact counts, confidence intervals, commit hashes, manifest IDs, machine reconciliation, and code paths belong near the claim in local evidence disclosures such as `展开实验依据` unless the number itself is the comparison the reader must immediately see.

On the Chinese Results route:

- Chinese should carry the explanation;
- English should remain mainly for project names, identifiers, established technical terms, and source lookup;
- do not lead the first screen with campaign IDs, hashes, or dense statistical notation;
- preserve the seven-question scientific conversation and the current Results reader contract.

## Evidence hierarchy and claim-level provenance

The publication target is not merely “the page has evidence links”. A specific factual claim should be locally connected to the closest primary evidence that supports it.

Use this evidence priority:

### Primary / closest-to-fact evidence

Prefer, where applicable:

- pinned official upstream source code;
- raw episode / raw completion / actual runtime prompt;
- machine-generated analysis or reconciliation;
- frozen config / manifest / preregistration;
- runtime receipt / adapter identity receipt;
- contemporaneous commit diff or implementation source.

### Contemporaneous explanatory evidence

Use for interpretation and historical context:

- closeout report;
- experiment report;
- audit note;
- contemporaneous design/handoff document.

### Later summaries

Use for convenience, not as a substitute for existing primary evidence:

- later `RESULTS.md` summary;
- website prose;
- later retrospective/program report.

The preferred shape is:

```text
specific claim on page
-> local evidence reference attached to that claim/observation
-> closest primary source
-> immutable revision
-> exact line range when practical
-> optional broader report for interpretation
```

A question-level evidence grid may still provide the complete material package, but it should not force a reader to guess which source supports a highly specific row.

For historical numerical/scientific claims, prefer links pinned to the exact `openevo-experiment` commit that supported the website snapshot. For official-code claims, pin the upstream revision as well. Add GitHub `#Lx-Ly` anchors only after verifying the actual lines; never invent a line range from memory.

Mutable `main` links are appropriate for explicit live-state routers such as `current-campaign.json`. They are weaker provenance for historical measurements because `main` can advance.

Do not copy large raw artifacts, private traces, credentials, server-private paths, or private infrastructure details into this repository merely to make evidence “local”. Point to public-safe immutable evidence instead.

## Attribution workflow for model-output / parser / harness mismatches

When a benchmark failure involves output formatting, parsing, projection, or action validity, do not assign responsibility from the first visible symptom.

Resolve the layers in this order:

1. **released benchmark contract** — upstream prompt/parser/projection requirements;
2. **actual runtime prompt** — the exact text the model received;
3. **raw generated output** — literal completion tokens before projection;
4. **backend transformations** — decode/postprocessing that may rewrite text;
5. **training-data path** — whether the behavior could have entered supervision;
6. **measurement harness** — how model text became an environment action;
7. **prior known state** — whether the mismatch was already identified before the formal run.

Then separate the resulting claims:

```text
literal token provenance
!= training causation
!= parser behavior
!= integration responsibility
!= human authorship
```

For the 2026-08-25/26 WebShop case, the current supported boundary is documented in `../history/2026-08-26-seed-results-attribution-and-agent-friction-retrospective.md`: Qwen2.5-7B-Instruct exhibited wrapper drift under the prompt/chat-template path, while the formal experiment integration failed to preflight a known compatibility boundary. That historical attribution must not be generalized to a future model/run without fresh raw evidence.

## Benchmark-interface preflight before formal held-out consumption

If formal evaluation depends on a structured action/output contract, validate the real end-to-end interface before consuming the scientific denominator:

```text
freeze model + prompt + chat template
-> obtain a non-formal canary from BOTH arms
-> retain raw_completion
-> run the exact formal parser/projection
-> record detected wrapper + projected action + validity reason
-> compare against admissible environment actions
-> fail closed on unknown format
-> only then authorize formal held-out consumption
```

A parser unit test alone does not prove the frozen model’s real completions are compatible with the parser. The canary should exercise the actual model -> decode -> projection path.

Formal traces should retain enough evidence to distinguish model failure from measurement failure. At minimum, preserve raw completion, parser/projection identity, projected action, validity reason, fallback usage, adapter identity, and task identity when the experiment design permits it.

Unknown parser/wrapper outcomes must remain visible invalid measurements. Never silently drop them or transform them into apparently normal scores.

## What must stay separate

The website must preserve scientific distinctions already present upstream.

### Valid measurement vs invalid measurement

If a run was measurement-invalid because the evaluator/parser/action contract did not measure the model correctly, keep it measurement-invalid. A later repaired run becomes a new evidence layer; it does not retroactively turn the old zero into model ability.

### Diagnostic vs benchmark-facing evidence

A local diagnostic may explain behavior and still not be the benchmark headline. Label the measurement contract and task semantics before comparing numbers across layers.

### Range alignment vs source-faithful task semantics

A task panel that lies inside SEED's held-out `goal_idx 0-499` range is not automatically a source-faithful reproduction of SEED public-code worker-seed -> goal-order -> instruction semantics. Preserve “SEED-compatible historical panel” and “source-faithful public-code reproduction” as different claims when upstream evidence distinguishes them.

### Track A vs Track B

Source-faithful SEED public-code reproduction and the WB1 fair matched benchmark answer different questions. They can live on the same research program page, but evidence from one must not be presented as proof for the other.

### Direction vs stable superiority

A positive paired mean is not automatically a stable win. If the relevant uncertainty interval crosses zero, the page may report a positive direction/signal and the exact interval in evidence, but it must not claim stable superiority.

### Paper-reported vs locally reproduced

Paper numbers must remain labelled paper-reported unless the corresponding checkpoint/training/evaluation result has actually been reproduced locally under the relevant protocol.

## Pre-built result scaffolds and later fill-in

A Results page may be created before an experiment or diagnostic closes. In that case, the page is a **question scaffold**, not evidence that the answer already exists.

Use this pattern:

```text
freeze the scientific question
-> freeze the metric/comparison slot
-> mark the value Pending
-> wait for sealed upstream evidence
-> fill only the fields that evidence actually closes
```

Rules:

- `Pending` is a meaningful state; never replace it with `0`, an ETA, an in-flight counter, or a best guess;
- pre-specify cross-arm contrasts before all finals are visible when practical, so the website does not choose metrics opportunistically after seeing outcomes;
- distinguish run completion, final-evaluation completion, post-hoc diagnostic completion, and cross-arm-comparison completion;
- when one arm closes, leave unrelated unfinished arms Pending;
- search the repository for the old experiment status/Pending wording and update all derived owners together: detail page, result index, joint matrix, deeper analysis text, tests, and bilingual metadata as applicable;
- preserve an existing deeper analysis layer when the new result scaffold answers a different reader need.

When the question concerns checkpoint progression, inspect and publish the **full comparable curve**, not only base/final endpoints. Training loss, graded Task Score, action validity, and exact success are different signals and must not be collapsed into one “got better” claim.

For a post-hoc checkpoint sweep on a panel already used for final evaluation, state the epistemic consequence explicitly: once intermediate checkpoints have been inspected on that panel, it is no longer fully unseen for future checkpoint/model selection. A later formal experiment should use an independent diagnostic/selection panel or freeze its selection rule before observing the formal panel.

Before replacing Pending, confirm upstream completion with machine evidence rather than timestamps alone:

```text
completion marker
-> machine-readable result status
-> expected checkpoint/task cardinality
-> model + panel + protocol identity
-> metrics
-> claim boundary
```

Historical case: [`../history/2026-08-29-four-arm-result-scaffold-and-7b-self-checkpoint-publication-retrospective.md`](../history/2026-08-29-four-arm-result-scaffold-and-7b-self-checkpoint-publication-retrospective.md).

## Publication workflow

### 1. Detect a meaningful upstream change

Refresh the website when `openevo-experiment` records a new campaign, reconciliation, result, validity reclassification, source-semantics audit, or next experiment that materially changes the reader's answer.

Do not publish every intermediate run. The website should move when the scientific story moves.

### 2. Build one publication snapshot

Record the upstream branch/SHA and checked date together. Preserve old experimental evidence as history instead of rewriting it as though the program had always known the newer interpretation.

If the website needs live-state wording, make clear that it is a snapshot and provide the route for resolving current upstream truth.

### 3. Update the correct website owners

For SEED × OpenEvo Results work, the ordinary change set may include:

```text
Results page/component copy
-> local claim-level evidence links
-> seed-openevo-results-reader-contract.md latest-state section when Q7/current answer changes
-> semantic/reader-boundary tests
```

Do not invent a second status JSON or duplicate experiment ledger in this repository.

### 4. Protect semantics with tests

Tests should assert scientific boundaries and required reader outcomes, not freeze obsolete prose.

Good examples:

- measurement-invalid remains visibly invalid;
- source-faithful reproduction is not conflated with range-compatible history;
- Track A and Track B remain distinct;
- a confidence interval crossing zero cannot be described as a stable win;
- current-facing evidence resolves to the intended upstream source;
- Chinese first-use terminology and local evidence interaction remain understandable;
- parser-invalid/fallback outcomes cannot silently disappear from a formal scientific denominator when the protocol requires fail-closed behavior.

A stale test that requires an old phrase or old “next step” should be updated rather than forcing the page back to stale science.

### 5. Validate the exact page tree

Use the repository-owned gates appropriate to the change:

```bash
npm run verify:deploy
npm run build
```

For layout, theme, responsive, navigation, or other visual changes, also run the required browser acceptance from the UI policy. For Results changes, inspect the exact route at the relevant mobile and desktop widths even when the code change appears to be “only copy”.

### 6. Verify Preview before merge

Use the exact-head Vercel Preview. Confirm that the rendered Results page contains the intended claim, evidence links, reading order, and no overflow/regression.

A compile pass is not page acceptance. A previously red test turning green is not proof that the remaining suite passed.

### 7. Merge once, then verify Production separately

After exact-head acceptance, merge the coherent release once and verify `https://basemodel-preview.vercel.app` independently. Production success proves release/rendering; it does not alter the scientific classification inherited from `openevo-experiment`.

If `main` moves during acceptance, verify ancestry and the provider commit metadata. A deployment-specific Vercel hostname is immutable and cannot be treated as a moving alias for newest `main`.

## Lessons from the 2026-08-25/26 Results refresh

The recent SEED held-out update exposed several reusable workflow lessons:

- **Resolve upstream state before editing.** Website/current-doc text can become stale while the experiment branch advances. Refresh the active scientific branch rather than beginning from the old page.
- **A newer audit can narrow an older claim without deleting the old evidence.** The historical 128-task panel remained useful after the source-semantics audit, but its label had to narrow from “potential reproduction denominator” to “frozen local SEED-compatible panel”.
- **Measurement failures need their own narrative layer.** PRIMARY-v1's zero was useful evidence about a parser/projection incompatibility but invalid as a model-capability result.
- **Attribution must be layered.** Prompt convention, raw model tokens, backend transformations, training causation, parser behavior, and experiment responsibility are different claims.
- **Known interface drift belongs in a preflight gate.** Once a model-output/parser mismatch is known, do not rely on human memory before the next formal run; exercise the real frozen interface and fail closed.
- **Evidence should be local to the claim.** A page-level evidence collection is not enough when the reader must guess which source supports a specific observation.
- **Public prose should match uncertainty.** A positive paired delta whose interval crosses zero is a positive signal, not a stable win.
- **Tests can become stale scientific contracts.** Protect the semantic boundary, not one frozen phrase.
- **Keep visual language stable when only the science changed.** Reuse the surrounding components unless new evidence creates a real new reader need.
- **Do not make the owner act as a data courier.** Connected repository/provider tools should bridge experiment evidence, source code, Preview, and Production directly when possible.

The detailed historical case is [`../history/2026-08-26-seed-results-attribution-and-agent-friction-retrospective.md`](../history/2026-08-26-seed-results-attribution-and-agent-friction-retrospective.md).

## Anti-friction stopping rules

- Do not rerun scientific experiments because the website needs a cleaner sentence.
- Do not rerun stable website checks unrelated to the changed surface merely from habit; use the repository's defined gates and matched scenario guidance.
- Do not create a new publication artifact when existing result/reconciliation evidence already answers the claim.
- Do not update the public page for a transient W&B blip, incomplete run, or unreviewed intermediate file.
- Do not let a website deploy failure block already-authorized future scientific work in `openevo-experiment`.
- Do not let a website success badge upgrade weak or invalid scientific evidence.
- Do not use repository writes as tool-discovery probes; shared state is not Agent scratch space.

## Two-way maintenance rule

This document owns the **website-side intake and publication workflow**. The experiment-side publication-readiness and claim-handoff boundary are owned by:

- [Experiment-side result publication handoff](https://github.com/mykcs/openevo-experiment/blob/main/docs/experiment-tracking/RESULT_PUBLICATION_HANDOFF.md)

When this cross-repository workflow changes materially, update both documents in the same work session when practical so an Agent entering from either repository can discover the other owner and reconstruct the complete experiment -> evidence -> website -> Production path.
