# Research editorial style

Status: **current and mandatory for research-result narratives**
Audience: Agents editing experiment results, benchmark reports, research notes, closeouts, and scientific interpretation pages.

## Reader model

Assume the reader is a technically capable lab peer who knows the shared project name and broad goal, but did not run the experiment sequence and does not know the internal run IDs, campaign names, debugging history, or shorthand.

The page must teach enough context for that reader to understand the scientific question, evidence, inference, and boundary without reconstructing the project from GitHub archaeology.

## Start from the subject, not from the article

Open with the phenomenon, background fact, tension, or concrete research question. Move from what is known to what is unknown.

Do **not** begin by explaining how the article is written or defending its structure. In particular, avoid unprompted meta-narration such as:

- “这篇文章不是……” / “This article is not…”
- “下面我们会……” / “Below we will…”
- “如果只从最后的结果讲……” / “If we start from the final result…”
- “如果只带走一句话……” / “If you remember one sentence…”
- “为了少一点内部代号……” / “To keep notation minimal…”
- “为了避免 AI 味……” or any other comment about the writing process itself.

A reader should not be asked to care about a presentation problem they have not encountered. If a term needs definition, define it. If a comparison needs a caveat, state the caveat. Otherwise stay inside the scientific subject.

This follows the useful high-level habit visible in strong technical research blogging: establish the relevant background, let a concrete question arise naturally, then introduce the method or experiment needed to answer it. Do not imitate another author’s exact wording or persona.

## Preferred research flow

The main line should usually resemble:

```text
background / phenomenon
-> concrete question
-> what would count as evidence
-> first observations or failures
-> which simpler explanations those failures weaken
-> the experiment that changes the interpretation
-> replication / stronger evidence
-> current conclusion
-> inference connecting evidence to conclusion
-> boundary: what is still not established
-> next scientific question
```

This is a reasoning flow, not a mandatory set of visible labels. Do not turn every item into a card or heading.

## Internal experiment IDs are provenance

Identifiers such as `H1.38B`, campaign names, selector codes, SHAs, and internal phase labels are useful for audit, not for reader orientation.

- Do not use internal IDs as the primary table of contents or first explanation of the science.
- Introduce the scientific question and variables first.
- Put run IDs beside the relevant result as quiet provenance, or in an appendix / evidence section.
- A first-time reader should be able to follow the main argument while ignoring all run IDs.

## Explain terms only when they become necessary

Do not front-load a glossary of SD-LoRA, task clusters, selectors, or campaign vocabulary.

When the argument reaches a point where a term is necessary, introduce it in the local context that motivates it. Prefer constructions such as:

> Each new batch of experience cannot justify retraining all 7B parameters. LoRA gives us a smaller parameter increment to update and reload.

rather than:

> Before continuing, here are five terms you need to know.

Notation may be introduced directly and neutrally: “第一次更新后的模型记为 G1……” is better than explaining that the notation exists to make the article easier to read.

## Conclusions require an evidence chain

For each material scientific conclusion, the reader must be able to locate four things even if they are not always rendered as literal labels:

1. **Claim** — what the evidence supports.
2. **Evidence** — observations, effect estimates, uncertainty, replication, or failure state.
3. **Inference** — why those observations support the claim rather than a simpler explanation.
4. **Boundary** — what the experiment does not establish.

Do not jump from one high score to a method claim. Do not write “significant improvement” without the comparison, denominator, uncertainty, and protocol context that make the phrase meaningful.

### Minimum reasoning bridge — visible by default

A sentence can be ordinary, fluent human language and still be scientifically under-explained. The practical test is simple:

> If a PI or lab colleague points at this sentence and asks **“你为什么这样说？” / “Why do you say that?”**, can the visible prose immediately give the first-layer answer?

For any material conclusion, comparison, diagnosis, causal interpretation, measurement-validity judgement, or next-experiment decision, expose this minimum bridge in the mainline:

```text
observation
-> what the observation supports
-> what it still does not prove
```

Examples of incomplete prose:

- “收益并不会自动出现。” — What was observed that supports this?
- “这是目前最明显的瓶颈。” — Which repeated observations make it the strongest bottleneck?
- “下一步只需要修 parser。” — Why does the evidence justify changing only the parser rather than the task panel, model, or method?

A stronger version gives the short answer before the reader opens evidence detail. Exact run counts, confidence intervals, manifests, code, and raw output may remain under `展开实验依据` or another disclosure.

Do **not** apply this mechanically to every sentence. Definitions, direct instructions, neutral labels, simple source facts, and literal code behavior do not need an invented “therefore.” The rule targets sentences that ask the reader to accept an inference or scientific decision.

Progressive disclosure is for depth, not for repairing the argument. If removing all collapsed details makes a material claim look unsupported, the visible mainline is incomplete.

## Negative results are part of the argument

Do not present long runs of null experiments as a changelog. Explain what hypothesis each negative result weakened and how it changed the next experiment.

Keep these distinct:

- a scientific zero;
- a statistical null / underpowered result;
- parser or runtime invalidity;
- a measurement-invalid panel;
- an experiment that was designed but never executed.

A failed measurement is not a failed method. An unrun experiment has no result.

## Prose and page-form anti-patterns

Avoid the recurring AI-presentation habits below unless the content genuinely requires them:

- self-referential introductions that explain the article before the subject;
- repeated “核心结论 / 关键洞察 / 值得注意的是 / 总的来说” scaffolding;
- a summary that immediately repeats the title and first paragraph;
- equal-weight rounded cards for every thought;
- headings whose only job is to announce that a conclusion or summary is coming;
- invented drama such as “重大突破”, “全面验证”, or “显著领先” without evidence;
- decorative badges, gradients, or arrows that add importance without adding meaning;
- explaining an obvious transition instead of simply making the transition.

Use tables for aligned comparisons, figures for real structure, real trajectories for concrete behavior, confidence intervals for uncertainty, and appendices/details for audit depth.

## Review questions before merge

For a research-results page, verify all of the following:

1. Does the title or first paragraph enter the scientific subject immediately?
2. Is there any sentence explaining how the article is written rather than explaining the research? Remove it unless it resolves a real ambiguity.
3. Can a lab peer unfamiliar with the run history understand WebShop, the tested update, and what “fresh” means before seeing internal IDs?
4. Do experiment IDs remain provenance rather than narrative structure?
5. Does each major positive or negative conclusion have evidence, inference, and a clear boundary?
6. For every material judgement, can the visible mainline answer the first-layer question “你为什么这样说？” without requiring a disclosure to be opened?
7. Are invalid measurements separated from scientific failures?
8. Does the chronology explain why the next experiment followed from the previous result?
9. Does the page remain readable as continuous prose rather than an AI-generated dashboard of summaries?
10. Are detailed evidence and full lineage still available for audit without interrupting the main path?
11. Have browser, mobile, theme, no-JS/print, and overflow acceptance checks passed where applicable?

When reader feedback identifies a recurring unnatural writing pattern, update this contract and add executable regression coverage where practical. Do not rely on conversational memory alone.
