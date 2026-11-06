# SEED ↔ OpenEVO comparison / causal-expression sample

Status: **ACTIVE TASK PLAN · product sample**
Repository: `mykcs/basemodel`
Primary target: `/research/seed-openevo/study/`
Baseline: `main@aeac85458c6dc2fc949f7147d1ba4a40884225e8`
Date: **2026-10-03**

## 1. Reader problem

This sample should test a **different medium family** from the Vanilla SD-LoRA task.

The reader should be able to recover:
- what SEED and OpenEVO each do;
- what is actually held comparable;
- where their learning/update paths differ;
- which experiment/result answers which scientific question;
- what remains not directly comparable or not proven.

The current task is not to add a dashboard or generic interactive timeline.

## 2. Loading / authority boundary

This is substantial, durable public website content. Before substantial copy/structure work load:

1. `mykcs/.agents/docs/agents/HUMAN_EXPRESSION_STANDARD.md`;
2. BaseModel `website-design-spec.md`;
3. the study gateway Reader Contract, research-integrity, comparison, and semantic web-expression owners.

The root Agent lightweight conversation limits govern progress/status chat, not the finished page body. Keep the full shared standard centralized in `.agents`; BaseModel adds only project-specific scientific and product constraints.

## 3. Preferred representation hypothesis

Start from:

**aligned comparison + semantic causal/dependency map**.

Use:
- a real comparison table/matrix when dimensions align;
- a semantic diagram when the important difference is “what feeds what / what updates what / where evidence enters”;
- interaction only when it lets the reader inspect a real evidence branch or comparison state that would otherwise require duplicate pages.

Do not add interaction just to make the gateway feel modern.

## 4. Scope

Primary product owner is the canonical study gateway at `/research/seed-openevo/study/`.

Phase A must bind the current source/component/data owners before editing.

Prefer improving the existing route. A new route requires explicit Reader Contract evidence that the gateway cannot carry the comparison without competing with its primary task.

## 5. Scientific/comparison contract

Preserve:
- actual model/task/budget identities;
- training versus validation/final distinctions;
- sampling/denominator/cadence differences;
- historical versus current evidence state;
- unknown / not-run / not-directly-comparable states;
- the fact that BaseModel is reader-facing publication, not experiment authority.

Do not make a visual symmetry imply scientific symmetry.

## 6. Page story

A useful candidate sequence:

1. **What are the two systems?**
2. **What common question are we asking?**
3. **What is held fixed enough to compare?**
4. **Where do the update/learning paths differ?**
5. **Which evidence belongs to which question?**
6. **What can we conclude, and what remains outside the comparison?**

This is a reasoning sequence, not six mandatory cards.

## 7. Implementation phases

Phase A — cold-read current study gateway and sibling result routes.

Phase B — write the Page Expression Brief and choose comparison/diagram forms from current truth.

Phase C — implement the smallest aligned comparison that removes reconstruction work.

Phase D — add one semantic relation/causal map only if it carries a relationship the table cannot.

Phase E — browser acceptance and zero-context cold read.

Phase F — report reusable semantics to the later primitives-extraction PR; do not generalize them here.

## 8. Negative controls

The result fails if:
- it becomes a card wall;
- it turns chronology/project status into the research story;
- it hides denominator or evidence-role differences to make columns align;
- it creates an interactive switch whose only effect is visual;
- it makes SEED/OpenEVO look scientifically identical except for branding;
- it moves exact evidence farther from the claim.

## 9. Acceptance

- [ ] a zero-context reader can state SEED vs OpenEVO in ordinary language;
- [ ] comparable dimensions are truly aligned;
- [ ] non-comparable dimensions are visibly marked rather than forced;
- [ ] any diagram encodes real dependency/update/evidence relationships;
- [ ] current result/experiment identity remains truthful;
- [ ] main claim and caveats work statically;
- [ ] Chinese/English preserve the same scientific boundary;
- [ ] 390 / 768 / 1440, light/dark pass;
- [ ] focused policy/unit/E2E coverage passes;
- [ ] exact-head Public PR CI + required Vercel final gate pass before merge.

## 10. Concurrency

This PR may run in parallel with the Vanilla sample because it owns a different route and a different representation problem.

Do not edit `ResearchExplainerPrimitives.tsx` for speculative reuse. Generalization belongs to the dedicated extraction PR after both samples produce evidence.
