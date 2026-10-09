# BaseModel medium-mismatch audit

Status: **ACTIVE TASK PLAN · audit only**
Repository: `mykcs/basemodel`
Baseline: `main@aeac85458c6dc2fc949f7147d1ba4a40884225e8`
Date: **2026-10-03**

> This PR answers one question: **is each important reader task currently expressed in the right medium?** It inventories and prioritizes; it does not redesign production pages.

## 1. Authority

Read current:
- `docs/agents/current/website-design-spec.md`;
- `docs/agents/current/human-thinking-web-expression-contract.md`;
- `docs/agents/current/layered-technical-explainer-copy.md`;
- `docs/agents/current/research-explainer-page-standard.md`;
- `docs/agents/current/site-reader-attention-contract.md`;
- `src/data/siteReaderContracts.ts`;
- canonical full-artifact Human Expression Standard at `mykcs/.agents/docs/agents/HUMAN_EXPRESSION_STANDARD.md`;
- shared learned evidence in `mykcs/.agents`.

PR #828 made medium choice an explicit authoring/acceptance rule. The later `.agents` PR #262 and BaseModel PR #834 established the loading boundary: lightweight conversation stays on root Agent defaults, while substantial/durable website artifacts load the full Human Expression Standard.

This audit itself produces a durable human-readable report, so its report artifact uses the full standard. Routine progress/status messages around the audit remain lightweight chat and must not inherit the full writing stack.

## 2. Scope

Audit canonical, user-facing BaseModel research/explainer routes.

Include at minimum:
- SEED/OpenEVO study gateway and major study/result routes;
- WebShop/ALFWorld flow explainers;
- SD-LoRA family;
- DirectApply / GDR / bounded-state / Gated Delta explainers;
- high-traffic model/paper/methodology surfaces where relation/comparison structure matters.

Exclude from ranking:
- compatibility redirects;
- archived source snapshots;
- purely operational/admin surfaces whose current medium already follows their dedicated role;
- historical evidence files that are not public reading surfaces.

## 3. Per-route classification

For every audited route record:

- route + current owner component/data owner;
- Reader Contract role and primary task;
- current dominant medium;
- semantic shape: fact / comparison / sequence / topology / branch / evidence ladder / exploration / temporal change;
- current comprehension bottleneck;
- recommended medium:
  - KEEP_PROSE
  - TABLE_OR_COMPARISON
  - SEMANTIC_DIAGRAM
  - INTERACTIVE_HTML
  - TEMPORAL_MEDIA
  - MIXED
- **concrete comprehension/verification gain**;
- static/accessibility fallback;
- scientific/evidence risks;
- whether the mismatch is shared-family or route-local.

## 4. Priority model

Rank implementation candidates from evidence, not aesthetics.

Score separately:
- reader impact: 0–3;
- mismatch severity: 0–3;
- evidence readiness: 0–2;
- reusable-learning value: 0–2;
- implementation/scientific risk: 0–2 penalty.

Publish the dimensions, not only one opaque total.

A high rank means “high expected comprehension gain with evidence ready enough to act,” not “page quality is bad.”

## 5. Required deliverables

Create:
- `docs/agents/evidence/medium-mismatch-audit/BASELINE_20261003.md` — human-readable findings;
- `docs/agents/evidence/medium-mismatch-audit/BASELINE_20261003.json` — machine-readable inventory;
- top implementation shortlist with rationale.

The shortlist must explicitly evaluate:
1. Vanilla SD-LoRA mechanism route;
2. `/research/seed-openevo/study/`;
3. at least one result-heavy page where the correct answer may be “keep prose/table; do not add interaction”.

## 6. Guardrails

- no production copy/layout/component changes in this PR;
- do not call every dense page a medium mismatch;
- do not rank video/animation above text by default;
- no new scientific claims;
- do not fabricate absent evidence to make visual forms symmetrical;
- do not turn archive routes into new product work;
- do not broaden into general visual-polish debt.

## 7. Acceptance

- [ ] canonical route inventory is explicit and deduplicated;
- [ ] every recommendation names the reader question and semantic shape;
- [ ] every richer-medium recommendation states a concrete gain;
- [ ] at least one negative control concludes that current prose/table is already correct;
- [ ] top candidates are ranked with visible dimensions;
- [ ] Vanilla SD-LoRA and study gateway are explicitly classified;
- [ ] findings distinguish shared-family fixes from route-local fixes;
- [ ] JSON and Markdown agree;
- [ ] no product route changed;
- [ ] repository validation passes.

## 8. Loading boundary

This task audits **public/durable BaseModel artifacts**, not ordinary conversation. Do not turn findings into a reason to load the full writing standard for every status update, quick explanation, or small wording tweak.

## 9. Handoff

This PR is the portfolio map. It may refine the priority/order of child implementation PRs, but it must not absorb their product code.
