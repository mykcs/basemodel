# β study · scientific-blog reader redesign

Status: **ACTIVE**
Date: **2026-10-01**
Route: `/research/seed-openevo/study/capability-exploration/bounded-effective-state-gdr/`
Owner: `src/components/research/OpenEvoEffectiveStateGdrLoraStudy.astro`

## User problem

The scientific content is now complete, but the page is visually exhausting: too many card-like surfaces, wide tables, repeated framing devices, pills and competing visual anchors. The reader has to decide where to look instead of being led through one argument.

The redesign should borrow the **reading model** of 苏剑林 / 科学空间 technical articles, not copy its HTML/CSS:

- one article, one argument, one dominant reading column;
- title → short context → prose → equations/figures/tables exactly where needed;
- section headings are navigation through an argument, not dashboard tiles;
- very few visual containers;
- strong typography and whitespace do most of the hierarchy work;
- a short article conclusion restates what the evidence supports.

Reference reading:
- https://www.spaces.ac.cn/archives/11848
- https://www.spaces.ac.cn/archives/11777
- https://spaces.ac.cn/archives/4667

## Scientific first-screen answer

The first screen must answer “β compared with the other two experiments” before explaining the mechanism.

Same frozen 128-task final:
- ordinary OpenEVO: **60.72 / 100**, **50 / 128** exact;
- Bounded: **45.98 / 100**, **32 / 128** exact;
- Bounded + β-gating (α=1): **20.77 / 100**, **10 / 128** exact.

Late 20-round training mean at R140–159:
- ordinary OpenEVO: **67.07**;
- Bounded: **64.33**;
- β-gating: **54.28**.

R200 continuation changes only the training-trajectory interpretation:
- β R160–179 mean: **59.51**;
- β R180–199 mean: **60.39**;
- no new frozen final was opened.

Therefore the page must say plainly:
> β is currently the weakest of the three on the only same-panel frozen final. The R200 continuation shows that its late training decline is not monotonic/irreversible, but does not overturn the frozen-final comparison.

## Visual strategy

### Remove / demote

- oversized six-column hero ablation matrix;
- dashboard-like metric cards;
- pill-shaped “①/②/③” labels;
- repeated rounded panels and shadows;
- competing multi-column grids inside the article body;
- excessive “result-stage” visual boxing.

### Keep / strengthen

- single reading column around 760–820 px;
- title and one-paragraph deck;
- a compact three-row comparison table immediately after the conclusion;
- wide equations / figures allowed to bleed to ~960 px;
- simple horizontal rules;
- restrained metadata / evidence links;
- semantic section headings with generous vertical rhythm;
- tables as academic evidence, not product cards;
- “文章小结” at the end;
- existing scientific claims, evidence links and R200 boundaries.

## Content order

1. Title + short deck.
2. **先说结论：β 目前明显落后，但 R200 说明它没有简单地一路坏下去。**
3. Three-way same-panel comparison.
4. “为什么要做 β” and method derivation.
5. Experiment contract / fairness boundary.
6. 160-round result and R200 continuation.
7. Diagnostics in argument order: loss → β → State geometry → path/entropy.
8. What is supported / not supported.
9. Article summary.
10. Evidence / reproducibility details.

## Acceptance

- [ ] first viewport gives the β-vs-two-baselines answer without scrolling through a giant matrix;
- [ ] same-panel frozen final remains the primary comparison;
- [ ] R200 is not presented as a new final;
- [ ] DirectApply remains a historical predecessor rather than a randomized matched arm;
- [ ] page-specific typography/layout is calmer than the current dashboard-like version;
- [ ] no scientific value, formula, evidence link or boundary is removed;
- [ ] phone / tablet / desktop have no page overflow;
- [ ] light/dark remain readable;
- [ ] focused structural and browser tests pass;
- [ ] full deterministic gate passes;
- [ ] exact-head hosted gates pass before merge.

## Integration boundary

PR #806 (`docs(design): establish BaseModel Design System v1`) is still open and currently unmergeable against main. This redesign is deliberately page-scoped and based on current `main`; it does not merge or silently import #806. If #806 is later revived, this page should be treated as a reader-tested reference rather than overwritten mechanically.
