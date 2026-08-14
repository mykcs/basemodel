import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const component = read('src/components/research/OpenEvoExperimentProgram.astro');
const zhRoute = read('src/pages/research/seed-openevo/results.astro');
const enRoute = read('src/pages/en/research/seed-openevo/results.astro');

describe('current OpenEvo × WebShop experiment program', () => {
  it('separates retired sources from the active experiment repository', () => {
    for (const repo of ['seed3090','openevo-webshop','openevo-experiment']) expect(component).toContain(repo);
    expect(component).toContain("state: t('历史', 'Historical')");
    expect(component).toContain("state: t('当前', 'Current')");
    expect(component).toContain('RTX6（4×RTX 3090）');
  });

  it('keeps Phase D–F mechanism evidence distinct from task efficacy', () => {
    expect(component).toContain('SD-LoRA optimizer steps');
    expect(component).toContain('2 components · effective rank 8');
    expect(component).toContain('nonzero logit delta');
    expect(component).toContain('这些是机制证据，不是 WebShop 效果结论');
    expect(component).toContain('RTX5090_PHASE_D_F_2026-08-14.md');
  });

  it('shows completed Phase G measurements rather than the old preflight state', () => {
    expect(component).toContain('Phase G · completed');
    expect(component).toContain('12 个 promotion-dev episodes');
    expect(component).toContain("{ arm: 'base', score: '0.000'");
    expect(component).toContain("{ arm: 'adapter1x', score: '0.000'");
    expect(component).toContain("{ arm: 'cumulative', score: '0.000'");
    expect(component).not.toContain('formal_task_consumption_allowed = false');
    expect(component).not.toContain('0 consumed');
  });

  it('makes Phase H0 and the current 5×RTX5090 experiment allocation visible', () => {
    expect(component).toContain('Phase H0');
    expect(component).toContain('64–128');
    expect(component).toContain('≤ 256');
    expect(component).toContain('teacher-success bootstrap');
    expect(component).toContain('5× RTX 5090');
    expect(component).toContain('8 visible RTX 5090 GPUs');
  });

  it('keeps W&B observational and wires the bilingual static section before historical evidence', () => {
    expect(component).toContain('wandb==0.26.1');
    expect(component).toContain('20260814-1431-phaseg-base-vs-adapters');
    expect(component).toContain('Run Manifests and local JSON evidence remain the core provenance');
    expect(component).toContain('data-testid="openevo-experiment-program"');
    expect(component).not.toContain('client:');
    for (const route of [zhRoute,enRoute]) {
      expect(route).toContain('<OpenEvoExperimentProgram locale={locale} />');
      expect(route.indexOf('<OpenEvoExperimentProgram locale={locale} />')).toBeLessThan(route.indexOf('<Seed3090ParametricProgress locale={locale} />'));
    }
  });
});
