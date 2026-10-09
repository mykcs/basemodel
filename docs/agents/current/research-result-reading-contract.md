# Research result reading contract

Status: current and mandatory for canonical research-result and experiment-analysis pages.

This contract specializes the research explainer page standard. Scientific authority remains with sealed experiment evidence, data owners, preregistration, and route-specific Reader Contracts.

## Reader promise

A first-time lab reader should not have to learn a new reading grammar on every result page.

Default order:

~~~
research question / experiment identity
→ direct task result
→ optimization / training signal
→ parameter change
→ deeper geometry or mechanism
→ behavior
→ synthesis
→ limits
→ next research question
~~~

A page skips dimensions it does not have. It must never fabricate an empty metric, fake a comparison, or add a section merely to make the template look complete.

## Direct result before deep diagnosis

Before asking the reader to interpret loss, Task Vector, spectral or rank geometry, carrier state, latency, entropy, or implementation details, show the strongest task-level endpoint the experiment actually owns.

Examples include a frozen Task Score and exact success, a same-panel comparison matrix, or a direct statement that training produced parameter updates but did not yet establish reliable transfer.

Training-round score is not a frozen final. A historical or mismatched panel is not a causal treatment effect.

## Reader Question Check — explain an observed surprise before planning another experiment

For substantial research results and advisor/peer reports, load the canonical
[Project Report Skill](https://github.com/mykcs/myk-skills/blob/main/project-report/SKILL.md)
when it is available through the active Harness. This BaseModel contract
specializes its scientific HTML publication, not a second report-writing authority.

**This is an internal analysis check, not a recipe for question-shaped headings.** Headings normally name the experiment or topic in ordinary declarative Chinese; preserve a question mark only when it is a genuine research question the section actually investigates. Do not manufacture an H1 to make a report seem intriguing, and do not turn section navigation into an invitation such as “从哪里读起？”. This inherits the existing Human Expression heading rules; it does not replace them.

Before approving a page, review the visible artifact as a scientifically literate reader
who has not followed the author's working sessions:

1. Identify **one interpretation-changing natural question** raised by the actual evidence, if one exists: an unexpectedly large score gap, a reversal between checkpoints, a loss/ability contradiction, a model that appears finished but has no outcome, or a change in the research decision. Do not manufacture a question for a straightforward result.
2. Put all values of **the same named metric on one explicit reader-facing scale**, stating denominator, panel and measurement point. For WebShop, `0.06617` on a 0–1 scale can be displayed as `6.62 / 100`; a scientific source may still retain the full raw precision.
3. **Presentation normalization does not establish protocol comparability.** Separately check model state, tasks, prompt, sampling, carriers, evaluator, and phase. A paper's 87.1/100 and a local custom-panel 6.62/100 must not appear as a causal method ranking merely because their score units match.
4. Explain what existing traces, task-level pairs, confidence intervals, and protocol facts establish; distinguish supported observations from plausible but untested causes. If no cause can be isolated, state precisely **what remains unknown** next to the result. An unexecuted future experiment is not the explanation of today's result.
5. For a real turn in the research direction, show prior assumption → evidence that changed it → revised judgment and its limits. Never reconstruct a person's motivations without a source.
6. In HTML, ensure a mobile/touch/keyboard reader can recover the question, primary evidence and scientific boundary without hovering, animations or opening every detail disclosure. Charts and interactive views must be more informative than a well-labeled static table; maintain a static reading path.

This is a **semantic review**. A machine check proving that the page has a title,
four labels or the word “why” does not establish that it genuinely answered the reader.
Use route-level regression for observed failure families and a cold-read of the final output.
A new failure found in one route triggers a sibling-family check, not 53 identical cards.

## Metric subsection rule

When a metric owns a subsection, use this order:

1. What it measures and why the reader needs it.
2. What this experiment actually observed.
3. What that result can and cannot support.

A figure stays beside the metric it explains. W&B is an observability and evidence surface, not a separate narrative chapter.

## Parameter evidence ladder

When the evidence exists, move from easier to more structural diagnostics:

~~~
update magnitude / Frobenius
→ Task Vector relation
→ spectral / effective-rank / cosine / geometry
→ function or behavior preservation
~~~

Parameter movement does not automatically imply task improvement. Geometric proximity does not automatically imply functional equivalence.

## Behavior evidence

Output length, episode steps, action-family entropy, task transitions, and action agreement appear after the reader knows the task result they are trying to explain.

## Synthesis, limits, and next question

The ending distinguishes supported findings, local or post-hoc diagnostics, missing or unrun experiments, unsupported causal claims, and the next experiment that would reduce uncertainty.

Unknown stays unknown. Not run never becomes zero.

For BaseModel's research-archive role, a returning reader should be able to recover this chain without reconstructing chat or logs:

~~~text
why this experiment exists
→ what was changed
→ current result
→ evidence
→ what is still unknown
→ next experiment / decision
~~~

The blocks do not need these literal labels. The information must simply remain recoverable in the visible reading path.

## Validation, checkpoint selection, and final evaluation

When intermediate checkpoints exist, keep three roles distinct:

- **train trajectory** — optimization history;
- **development / validation panel** — checkpoint, round-budget, or hyperparameter selection when its selection rule was fixed before reading outcomes;
- **locked final panel** — final reporting, not a hidden tuning surface.

Do not call a low training loss "converged" without validation evidence. Do not promote the best-looking checkpoint after inspection into a preregistered stopping rule. If a development curve is noisy, report the noise instead of pretending it selects one exact round with certainty.

## Setup versus analysis

Keep enough identity in the first screen to know model, task, treatment, budget or panel, and final-evaluation boundary. Full runtime and configuration detail belongs in progressive evidence unless it is itself the research variable.

## Reference implementation and canonical owners

`bounded-effective-state-gdr` is the accepted reference witness for the result-first diagnostic ladder and should not be rewritten merely to make other pages look similar.

The current canonical multi-metric owners are:

- `bounded-effective-state-gdr`;
- `q17-directapply-analysis`;
- `stage2-7b-analysis`;
- `results/four-arm-analysis`;
- `stage1-learning-objectives`.

These pages keep their own visual grammar. The shared contract is semantic order, metric locality, evidence boundary, and next-question recovery — not a shared card/table skin.

A mechanism page, runbook, catalog, archive, or operational page must keep its own role rather than pretending to be a result paper.

## Acceptance

For every migrated route:
- DOM order and visual order agree.
- The route-specific Reader Contract states the direct result and claim boundary.
- A regression test asserts only stages that actually exist.
- 390 / 768 / 1440 stay readable with no horizontal overflow.
- Sealed values and experiment identities do not change.
- Exact-head hosted acceptance is required before merge.
