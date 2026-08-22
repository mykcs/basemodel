import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');

const legend = read('src/components/research/ResearchDiagramLegend.astro');
const seedFigure = read('src/components/research/SeedWebShopCanonicalFigure.astro');
const compareFigure = read('src/components/research/SeedOpenEvoCanonicalFigure.astro');
const seedZh = read('src/pages/research/seed-openevo/seed.astro');
const seedEn = read('src/pages/en/research/seed-openevo/seed.astro');
const loopsZh = read('src/pages/research/seed-openevo/loops.astro');
const loopsEn = read('src/pages/en/research/seed-openevo/loops.astro');
const results = read('src/components/research/OpenEvoWebShopResultIndex.astro');

describe('canonical SEED / OpenEvo research figures', () => {
  it('uses paper-familiar trainable, frozen, and stop-gradient semantics consistently', () => {
    expect(legend).toContain('🔥');
    expect(legend).toContain('❄️');
    expect(legend).toContain('⊥');
    expect(legend).toContain('trainable / updated in this optimization');
    expect(legend).toContain('frozen / no parameter update in this operation');
    expect(legend).toContain('stop-gradient / detached signal');
    expect(seedFigure).toContain('π<sub>θold</sub>');
    expect(seedFigure).toContain('teacher signal detached');
    expect(seedFigure).toContain('❄️ and ⊥ mean different things here');
  });

  it('makes the SEED WebShop paper configuration visible without implying full-dataset evaluation', () => {
    for (const term of [
      '12,087',
      '10,587',
      '1,000',
      '500',
      '180 tasks × 8 rollouts',
      '= 1,440 trajectories',
      '2,400 training instances',
      '150 policy updates · N = 8',
      '128 test samples',
      'Score + Success Rate',
      'SFT × 3 epochs',
    ]) expect(seedFigure).toContain(term);
    expect(seedFigure).toContain('not an evaluation over all 500 tasks');
    expect(seedFigure).toContain('DEV remains visible as an official split but has no usage arrow');
  });

  it('shows a concrete WebShop task, SEED stage 1, stage 2, and a simpler inference path', () => {
    expect(seedFigure).toContain('instruction → search → product → options → buy');
    expect(seedFigure).toContain('HINDSIGHT-SKILL SFT');
    expect(seedFigure).toContain('SAME SAMPLED ACTION TOKENS');
    expect(seedFigure).toContain('skill-induced probability shift');
    expect(seedFigure).toContain('GRPO');
    expect(seedFigure).toContain('OPD');
    expect(seedFigure).toContain('TRAINING ONLY');
    expect(seedFigure).toContain('No permanent hindsight-skill prompt is required at inference.');
    expect(seedFigure).toContain('One trajectory leaves more than a score');
  });

  it('keeps the abstract SEED/OpenEvo comparison reusable across benchmarks and avoids the external-memory false dichotomy', () => {
    expect(compareFigure).toContain('fig-seed-openevo-update-target');
    expect(compareFigure).toContain('SHARED EXPERIENCE');
    expect(compareFigure).toContain('MODEL PARAMETERS · θ → θ′');
    expect(compareFigure).toContain('memory · skill · instructions · adapter');
    expect(compareFigure).toContain('NON-WEIGHT PATH');
    expect(compareFigure).toContain('PARAMETRIC PATH');
    expect(compareFigure).toContain('SD-LoRA experiments');
    expect(compareFigure).toContain('SUCCESSOR CARRIER / STATE');
    expect(compareFigure).toContain('“SEED = parameters, OpenEvo = external memory” is an over-simplification');
  });

  it('mounts each canonical figure before the existing interactive deep-dive in both locales', () => {
    for (const route of [seedZh, seedEn]) {
      expect(route).toContain('SeedWebShopCanonicalFigure');
      expect(route.indexOf('<SeedWebShopCanonicalFigure')).toBeLessThan(route.indexOf('<InteractiveResearchExplainer'));
    }
    for (const route of [loopsZh, loopsEn]) {
      expect(route).toContain('SeedOpenEvoCanonicalFigure');
      expect(route.indexOf('<SeedOpenEvoCanonicalFigure')).toBeLessThan(route.indexOf('<InteractiveResearchExplainer'));
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

  it('keeps the canonical figures static-first and responsive', () => {
    for (const figure of [seedFigure, compareFigure]) {
      expect(figure).toContain('data-ui-audit="contrast layout overflow"');
      expect(figure).toContain('<figcaption>');
      expect(figure).toContain('ResearchDiagramLegend');
      expect(figure).toContain('@media(prefers-reduced-motion:reduce)');
      expect(figure).not.toContain('client:');
    }
  });
});
