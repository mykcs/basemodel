import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');

const seedFigure = read('src/components/research/SeedWebShopCanonicalFigure.astro');
const interactionFigure = read('src/components/research/WebShopInteractionCanonicalFigure.astro');
const datasetFigure = read('src/components/research/WebShopDatasetCanonicalFigure.astro');
const compareFigure = read('src/components/research/SeedOpenEvoCanonicalFigure.astro');
const seedZh = read('src/pages/research/seed-openevo/seed.astro');
const seedEn = read('src/pages/en/research/seed-openevo/seed.astro');
const webshopZh = read('src/pages/research/seed-openevo/webshop.astro');
const webshopEn = read('src/pages/en/research/seed-openevo/webshop.astro');
const loopsZh = read('src/pages/research/seed-openevo/loops.astro');
const loopsEn = read('src/pages/en/research/seed-openevo/loops.astro');
const results = read('src/components/research/OpenEvoWebShopResultIndex.astro');

describe('canonical SEED / OpenEvo research figures', () => {
  it('separates the WebShop interaction, original dataset, and fair-comparison setting', () => {
    for (const term of ['Agent', 'search[…]', 'click[…]', 'Buy', 'Page changes', 'Score / Success']) expect(interactionFigure).toContain(term);
    for (const forbidden of ['SEED Agent', 'OpenEvo Agent', '1,181,436', '1,000-product']) expect(interactionFigure).not.toContain(forbidden);
    for (const term of ['1,181,436', '12,087', '10,587', '1,000', '500', 'ORIGINAL PRODUCT WORLD']) expect(datasetFigure).toContain(term);
    for (const term of ['购物指令 / 任务（shopping instructions / tasks）', '训练集（Train）', '开发集（Dev）', '测试集（Test）']) expect(datasetFigure).toContain(term);
    for (const forbidden of ['SEED', 'OpenEvo', 'PPO', 'OPD', 'hindsight']) expect(datasetFigure).not.toContain(forbidden);
    for (const term of ['SAME WEBSHOP SETTING', 'goal 500–6909', 'goal 0–499', '128', 'RELEASED-CODE DEFAULT', 'PAPER BOUNDARY', 'exact 128-goal manifest']) expect(seedFigure).toContain(term);
    for (const forbidden of ['180 tasks × 8 rollouts', '1,440 trajectories', '2,400 training instances', '150 policy updates', 'N = 8', 'HINDSIGHT-SKILL SFT', 'GLM-5.2', 'GRPO', 'OPD', 'teacher signal detached', '🔥', '❄️', '⊥']) expect(seedFigure).not.toContain(forbidden);
  });

  it('keeps Figure S1 evidence boundaries explicit instead of fabricating a complete manifest', () => {
    expect(seedFigure).toContain('The paper does not state the catalog size');
    expect(seedFigure).toContain('Exact 128-goal manifest: not yet pinned here.');
    expect(seedFigure).toContain('Same world, same tasks, same test, same scoring');
  });

  it('keeps C1 as one reusable comparison instead of repeating the same conclusion', () => {
    expect(compareFigure).toContain('fig-seed-openevo-update-target');
    expect(compareFigure).toContain('SHARED EXPERIENCE');
    expect(compareFigure).toContain('MODEL PARAMETERS · θ → θ′');
    expect(compareFigure).toContain('memory · skill · instructions · adapter');
    expect(compareFigure).toContain('VALIDATED SUCCESSOR CARRIER / STATE');
    expect(compareFigure).toContain('non-weight');
    expect(compareFigure).toContain('parametric');
    expect(compareFigure).toContain('Agent 参数不变');
    expect(compareFigure).toContain('adapter 可更新');
    expect(compareFigure).toContain('Carrier subtypes are intentionally not expanded here');
    expect(compareFigure).not.toContain('aligned-comparison');
    expect(compareFigure).not.toContain('CORE COMPARISON');
  });

  it('keeps the dataset with WebShop while the SEED deep-dive remains interactive', () => {
    for (const route of [seedZh, seedEn]) {
      expect(route).toContain('SeedWebShopCanonicalFigure');
      expect(route).not.toContain('WebShopDatasetCanonicalFigure');
      expect(route.indexOf('<SeedWebShopCanonicalFigure')).toBeLessThan(route.indexOf('<InteractiveResearchExplainer'));
    }
    for (const route of [webshopZh, webshopEn]) {
      expect(route).toContain('WebShopDatasetCanonicalFigure');
      expect(route.indexOf('<WebShopDatasetCanonicalFigure')).toBeLessThan(route.indexOf('<InteractiveResearchExplainer'));
    }
    for (const route of [loopsZh, loopsEn]) {
      expect(route).toContain('SeedOpenEvoCanonicalFigure');
      expect(route).not.toContain('InteractiveResearchExplainer');
      expect(route).not.toContain('kind="compare"');
    }
  });

  it('lets experiment results cite canonical figures instead of re-owning the background explanation', () => {
    expect(results).toContain('/research/seed-openevo/webshop/');
    expect(results).toContain('/research/seed-openevo/seed/#fig-seed-webshop');
    expect(results).toContain('/research/seed-openevo/openevo/');
    expect(results).toContain('/research/seed-openevo/loops/#fig-seed-openevo-update-target');
    expect(results).toContain('/papers/seed/');
    expect(results).toContain('一个概念只保留一个 canonical explanation');
  });

  it('keeps the canonical figures static-first, responsive, and readability-audited', () => {
    expect(seedFigure).toContain('data-ui-audit="contrast layout overflow"');
    expect(compareFigure).toContain('data-ui-audit="contrast layout overflow readability"');
    expect(compareFigure).toContain('data-ui-prose');
    for (const figure of [seedFigure, interactionFigure, datasetFigure, compareFigure]) {
      expect(figure).toContain('<figcaption');
      expect(figure).not.toContain('client:');
    }
  });
});
