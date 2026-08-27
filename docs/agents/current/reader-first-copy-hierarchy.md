# Reader-first copy hierarchy

Status: **current and mandatory for public website copy**
Audience: Agents editing Basemodel pages, especially research results, experiment explanations, benchmark reports, guides, callouts, and incident analysis.

## Core rule

**事实先于读法；结论先于解释；视觉权重服从语义权重。**

The reader should learn the thing itself before being told how to read the page. A decisive fact must not be visually quieter than the background prose that surrounds it.

## 1. Enter the subject directly

Delete stage directions that do not add factual content. Do not make the reader pass through sentences such as:

- `如果你第一次打开这一页，可以先……`
- `如果你已经知道 X，但没有跟进 Y……`
- `这一页先讲……再讲……`
- `下面我们会……`
- `下面我们依次分析……`
- `If this is your first time on the page…`
- `This page starts by…`
- `The analysis below asks…`

Replace them with the fact, experiment, question, or mechanism itself.

This is **not** a ban on the words `先 / 再 / 最后`. Keep them when they describe a real scientific, operational, or causal sequence, for example `先封存 evidence，再运行 evolution method`.

## 2. Headings name the concrete object or anomaly

A heading should let the reader know what happened without unpacking the paragraph below it.

Prefer:

`动作格式错误：<action>...</action> 被写成 [action]...`

Over:

`实验里出现了一次动作格式错误：发生了什么，为什么会发生，我们怎么修复`

If `发生了什么 / 为什么 / 如何修复` is still useful as orientation, render it as a small secondary kicker or omit it. It must not compete with the concrete subject for headline weight.

## 3. Conclusion and decision-relevant numbers come first

For causal analysis, experiment interpretation, debugging, and decisions, use this order when applicable:

```text
conclusion / answer
-> key denominator or scale
-> direct evidence
-> explanation / mechanism
-> caveat and evidence boundary
```

Do not bury the numbers that determine the reader's judgment inside a long paragraph. Training records, task count, generations/increments, epochs, optimizer-step limits, evaluation denominator, and whether an adapter was actually loaded should be surfaced before a causal argument when they matter to that argument.

A heuristic or prior expectation may motivate a hypothesis. Direct evidence still outranks the heuristic. For example, a belief about how many training steps should improve output legality can motivate checking training scale; a no-adapter raw completion that already exhibits the same malformed wrapper is stronger evidence about the wrapper's origin.

## 4. Visual weight must match semantic importance

Use the normal/high-contrast text color for the main scientific statement and conclusion.

Use stronger weight or a semantic accent when a sentence is the concrete failure, root cause, decision, or result the reader is trying to find. Error color is appropriate for an actual error condition such as an expected action wrapper being emitted in the wrong form; it is not decoration.

Reserve muted gray primarily for:

- provenance and source metadata;
- dates, run IDs, and audit labels;
- secondary implementation detail;
- caveats and evidence boundaries after the main claim is understood.

**Never mute the decisive sentence merely because it is technical.** A paragraph containing the root cause or the number that changes the interpretation should not look less important than surrounding explanatory prose.

## 5. Expose causal scale before attribution

Before attributing behavior to model capability, training, an adapter, a parser, or the harness, expose the minimum scale needed to judge the alternatives. Depending on the claim, this may include:

- model family and parameter scale;
- whether the observed sample loaded the adapter;
- whether evaluation used frozen checkpoints or retrained on the spot;
- training records and unique task identities;
- independent rollouts per task;
- increments / generations, epochs, and optimizer-step limits;
- final adapter/rank identity;
- evaluation tasks, arms, rollouts/seeds, and total episodes.

Then state which evidence actually identifies the cause. Do not let scale numbers become decoration, and do not substitute a nearby historical experiment for the exact artifact used in the formal comparison.

## 6. Preserve the scientific boundary

Reader-first writing is not license to simplify away uncertainty. Keep claim → evidence → inference → boundary intact. Preserve immutable evidence links, exact artifact lineage, invalid-measurement distinctions, and uncertainty intervals.

The main path should make the conclusion easy to find; the evidence layer should make it easy to audit.

## 7. Sitewide review rule

When reviewing existing public copy, classify each sentence by function before changing it:

```text
fact / result / cause / decision
real sequence or procedure
explanation
provenance / caveat
editorial stage direction
```

Remove or rewrite the last category. Preserve genuine procedural ordering. Promote facts/results/causes that are visually quieter than their importance. Keep provenance and caveats available without allowing them to drown the main line.

## Merge checklist

Before merging visible copy, verify:

1. Does the first sentence enter the subject rather than describe the page?
2. Does each heading name a concrete subject, comparison, result, or anomaly?
3. Are the key conclusion and decision-relevant numbers visible before the long explanation?
4. Is a decisive causal sentence normal/high contrast or intentionally emphasized rather than gray?
5. Is muted text limited to genuinely secondary information?
6. Are `先 / 再 / 最后` used for real sequence rather than editorial choreography?
7. Could a reader ignore run IDs and still understand the scientific argument?
8. Are direct evidence and exact artifact lineage stronger than heuristics or narrative convenience?
9. Are Chinese and English equivalent in meaning and information hierarchy?
10. Do the copy regression tests and deploy verification pass?
