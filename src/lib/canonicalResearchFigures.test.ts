import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');

const seedFigure = read('src/components/research/SeedWebShopCanonicalFigure.astro');
const datasetFigure = read('src/components/research/WebShopDatasetCanonicalFigure.astro');
const smallWorldFigure = read('src/components/research/WebShopSmallWorldFigure.astro');
const goalGenerationFigure = read('src/components/research/WebShopGoalGenerationFigure.astro');
const seedSplitFigure = read('src/components/research/WebShopSeedSplitFigure.astro');
const evaluationFigure = read('src/components/research/WebShopEvaluationFigure.astro');
const compareFigure = read('src/components/research/SeedOpenEvoCanonicalFigure.astro');
const seedZh = read('src/pages/research/seed-openevo/seed.astro');
const seedEn = read('src/pages/en/research/seed-openevo/seed.astro');
const webshopZh = read('src/pages/research/seed-openevo/webshop.astro');
const webshopEn = read('src/pages/en/research/seed-openevo/webshop.astro');
const loopsZh = read('src/pages/research/seed-openevo/loops.astro');
const loopsEn = read('src/pages/en/research/seed-openevo/loops.astro');
const results = read('src/components/research/SeedOpenEvoResearchNav.astro');
const explainerStandard = read('docs/agents/current/research-explainer-page-standard.md');

describe('canonical SEED / OpenEvo research figures', () => {
  it('keeps the original WebShop benchmark as two parallel object types', () => {
    for (const term of ['1,181,436', '12,087', '10,587', '1,000', '500', 'crowd-sourced text instructions', '＋']) {
      expect(datasetFigure).toContain(term);
    }
    for (const term of ['Train', 'Dev', 'Test']) expect(datasetFigure).toContain(term);
    for (const forbidden of ['SEED Agent', 'OpenEvo Agent', 'PPO', 'OPD', 'hindsight']) expect(datasetFigure).not.toContain(forbidden);
    expect(datasetFigure).not.toContain('原始 WebShop 数据集有多大？');
  });

  it('explains official small mode as a subset operation', () => {
    for (const term of ['1,181,436', '1,000', './setup.sh -d small', 'WebShop 官方提供', 'SUBSET ·']) {
      expect(smallWorldFigure).toContain(term);
    }
    expect(smallWorldFigure).not.toContain('完整 WebShop 怎样变成 SEED 使用的小商品世界？');
  });

  it('keeps product-to-goal generation and the 12,087-vs-6,910 boundary in one section', () => {
    for (const term of ['1,000', '6,910', 'get_synthetic_goals(...)', 'itertools.product', '12,087', 'synthetic goals', 'UNIT BOUNDARY']) {
      expect(goalGenerationFigure).toContain(term);
    }
    expect(goalGenerationFigure).toContain('不是 6,910 个 synthetic goals 的过滤来源');
    expect(goalGenerationFigure).not.toContain('÷1.7');
    expect(goalGenerationFigure).not.toContain('1,000 个商品，为什么最后会有 6,910 个 goals？');
  });

  it('shows the original three-way goal-index wrapper and SEED active two-way rule without re-teaching the benchmark counts', () => {
    for (const term of [
      '三段式 goal-index split',
      '两段式：non-train / train',
      '500–1499',
      'goal 0–499',
      'goal 500–6909',
      '6,410 goals',
      'UNKNOWN / NOT PINNED',
    ]) expect(seedSplitFigure).toContain(term);
    expect(seedSplitFigure).toContain('SEED 把 6,910 个 goals 分成两块');
    expect(seedSplitFigure).not.toContain('SEED released wrapper：三段 goal-index 规则改为两段');
    expect(seedSplitFigure).not.toContain('原始 WebShop 有 train / eval / test，为什么 SEED 这里只剩两块？');
  });

  it('teaches WebShop evaluation as inputs -> evaluator -> two complementary outputs', () => {
    for (const term of ['task_score ∈ [0, 1]', 'EXACT SUCCESS', 'won ∈', 'get_reward(...)', 'Score 看完成程度', '不是某一次实验 run 的测量结果']) {
      expect(evaluationFigure).toContain(term);
    }
    expect(evaluationFigure).toContain('INPUT · GOAL');
    expect(evaluationFigure).toContain('TERMINAL STATE');
    expect(evaluationFigure).toContain('EVALUATE');
  });

  it('keeps the WebShop route as one first-reader sequence without legacy duplicate sections', () => {
    const ordered = [
      '<InteractiveResearchExplainer',
      '<WebShopDatasetCanonicalFigure',
      '<WebShopSmallWorldFigure',
      '<WebShopGoalGenerationFigure',
      '<WebShopSeedSplitFigure',
      '<WebShopEvaluationFigure',
      '<SeedWebShopCanonicalFigure',
    ];

    for (const route of [webshopZh, webshopEn]) {
      ordered.forEach((component) => expect(route).toContain(component));
      for (let index = 0; index < ordered.length - 1; index += 1) {
        expect(route.indexOf(ordered[index]!)).toBeLessThan(route.indexOf(ordered[index + 1]!));
      }
      for (const legacyDuplicate of ['WebShopInteractionCanonicalFigure', 'WebShopInstructionGoalSeparationFigure', 'WebShopScaleEcho']) {
        expect(route).not.toContain(legacyDuplicate);
      }
    }
  });

  it('keeps the fair-comparison anchor stable while using declarative copy', () => {
    for (const term of ['fig-seed-webshop', 'SAME WEBSHOP SETTING', 'goal 500–6909', 'goal 0–499', '128', 'RELEASED-CODE DEFAULT', 'exact 128-goal manifest']) {
      expect(seedFigure).toContain(term);
    }
    expect(seedFigure).toContain('SEED 与 OpenEvo：进入同一套 WebShop 比较合同');
    expect(seedFigure).not.toContain('公平比较要进入哪个 WebShop 场地？');
  });

  it('formalizes the first-time-reader explainer standard as repository policy', () => {
    for (const term of [
      'Default reader: a lab colleague who knows the project exists but not the details',
      'One major section = one new mental-model step',
      'Every visual distinction must carry real semantics',
      'SUBSET / select',
      'GENERATE',
      'SPLIT / REASSIGN',
      'EVALUATE',
      'COMPARE',
      'Scoring must be taught as input -> evaluator -> outputs',
      'WebShop canonical explainer sequence',
    ]) expect(explainerStandard).toContain(term);
  });

  it('keeps C1 as one reusable comparison instead of repeating the same conclusion', () => {
    expect(compareFigure).toContain('fig-seed-openevo-update-target');
    expect(compareFigure).toContain('SHARED EXPERIENCE');
    expect(compareFigure).toContain('MODEL PARAMETERS · θ → θ′');
    expect(compareFigure).toContain('memory · skill · instructions · adapter');
    expect(compareFigure).toContain('VALIDATED SUCCESSOR CARRIER / STATE');
    expect(compareFigure).toContain('non-weight');
    expect(compareFigure).toContain('parametric');
    expect(compareFigure).not.toContain('CORE COMPARISON');
  });

  it('keeps WebShop context ownership on WebShop while other canonical routes keep their own figures', () => {
    for (const route of [seedZh, seedEn]) {
      expect(route).not.toContain('WebShopDatasetCanonicalFigure');
      expect(route).not.toContain('SeedWebShopCanonicalFigure');
      expect(route).not.toContain('WebShopScaleEcho');
      expect(route).toContain('InteractiveResearchExplainer');
      expect(route).toContain('kind="seed"');
    }
    for (const route of [loopsZh, loopsEn]) {
      expect(route).toContain('SeedOpenEvoCanonicalFigure');
      expect(route).not.toContain('InteractiveResearchExplainer');
      expect(route).not.toContain('kind="compare"');
    }
  });

  it('lets research findings point to canonical background owners instead of re-owning background explanation', () => {
    expect(results).toContain('/research/seed-openevo/webshop/');
    expect(results).toContain('/research/seed-openevo/openevo/');
    expect(results).toContain('/research/seed-openevo/seed/');
    expect(results).toContain('/research/seed-openevo/experiment/');
    expect(results).not.toContain('WebShopDatasetCanonicalFigure');
    expect(results).not.toContain('SeedFrameworkDiagram');
  });

  it('keeps the canonical static figures responsive and readability-audited', () => {
    for (const figure of [datasetFigure, smallWorldFigure, goalGenerationFigure, seedSplitFigure, evaluationFigure, seedFigure, compareFigure]) {
      expect(figure).toContain('<figcaption');
      expect(figure).toContain('data-ui-audit=');
      expect(figure).not.toContain('client:');
    }
  });
});
