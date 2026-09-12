# Research editorial style

Status: **current and mandatory for research-result narratives**
Audience: Agents editing experiment results, benchmark reports, research notes, closeouts, and scientific interpretation pages.

## Reader model

Assume the reader is a student or teacher encountering agents and this project for the first time. Establish the concrete task, what the model controls, the research question, and what starts and ends an experiment before relying on project terms. Technical depth remains available in local evidence disclosures.

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

## Negative results are part of the argument

Do not present long runs of null experiments as a changelog. Explain what hypothesis each negative result weakened and how it changed the next experiment.

Keep these distinct:

- a scientific zero;
- a statistical null / underpowered result;
- parser or runtime invalidity;
- a measurement-invalid panel;
- an experiment that was designed but never executed.

A failed measurement is not a failed method. An unrun experiment has no result.

## Method names need identity boundaries

A local experiment may borrow a paper or library method name while implementing it at a different abstraction level. A shared label is **not** proof that the two mechanisms are the same.

Before publishing or revising a research explanation that uses a literature-derived method name:

1. resolve the upstream/original method from first-party paper or implementation evidence;
2. resolve what the local historical run actually executed from the experiment authority, code, receipts, and frozen lineage;
3. name the two identities separately when their update rule, control point, state object, or execution timing differs;
4. preserve the historical local run truthfully instead of retroactively rewriting it to match a later design;
5. keep a proposed successor design explicitly **proposed / unexecuted** until executable evidence exists.

Do not promote a diagnostic object, offline teacher signal, correlation, or post-hoc analysis into a runtime control input merely because it could be used that way in a future design. A quantity controls the runtime only when executable evidence shows that it is actually read by the update path.

When the owner corrects one such identity boundary, scan sibling pages, slides, technical notes, route metadata, and tests for the same overloaded term before declaring the publication repair complete. Fix the semantic family, not only the sentence that exposed the problem.

This publication rule does not authorize taking over a parallel implementation or mathematical-derivation task. The website may state the current evidence boundary and link to the owning workline, but it must not silently freeze an unfinished successor design.

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
3. Can a reader with no agent or project background explain the shopping task, tested change, start/stop conditions, and supported outcome from visible content alone?
4. Do experiment IDs remain provenance rather than narrative structure?
5. Does each major positive or negative conclusion have evidence, inference, and a clear boundary?
6. Are invalid measurements separated from scientific failures?
7. Does the chronology explain why the next experiment followed from the previous result?
8. Does the page remain readable as continuous prose rather than an AI-generated dashboard of summaries?
9. Are detailed evidence and full lineage still available for audit without interrupting the main path?
10. Have browser, mobile, theme, no-JS/print, and overflow acceptance checks passed where applicable?
11. If a local method name overlaps an upstream paper/library term, can the reader tell which mechanism actually ran, which semantics belong to the original method, and which successor ideas remain unexecuted?

When reader feedback identifies a recurring unnatural writing pattern, update this contract and add executable regression coverage where practical. Do not rely on conversational memory alone.

Historical case evidence for the method-identity rule: [`../history/2026-09-12-gdr-sitewide-semantic-consistency-closeout.md`](../history/2026-09-12-gdr-sitewide-semantic-consistency-closeout.md). It records why a local candidate-admission rule and an upstream recurrent state-update rule needed explicit separation; the current contract above remains the authority.
