import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) =>
  readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');

const component = read('src/components/research/OpenEvoExperimentProgram.astro');
const zhRoute = read('src/pages/research/seed-openevo/results.astro');
const enRoute = read('src/pages/en/research/seed-openevo/results.astro');

describe('current OpenEvo × WebShop experiment program', () => {
  it('makes repository succession explicit instead of treating retired repositories as live mainlines', () => {
    expect(component).toContain('seed3090');
    expect(component).toContain('openevo-webshop');
    expect(component).toContain('openevo-experiment');
    expect(component).toContain('已退休 · 历史证据');
    expect(component).toContain('已退休 · 迁移桥梁');
    expect(component).toContain('当前 · 唯一主线');
    expect(component).toContain('Retired · historical evidence');
    expect(component).toContain('Current · source of truth');
  });

  it('separates verified RTX 5090 mechanism evidence from WebShop efficacy', () => {
    expect(component).toContain('SD-LoRA optimizer steps');
    expect(component).toContain('2 components · effective rank 8');
    expect(component).toContain('nonzero logit delta');
    expect(component).toContain('还没有 WebShop 效果结论');
    expect(component).toContain('still no WebShop efficacy result');
    expect(component).toContain('RTX5090_PHASE_D_F_2026-08-14.md');
  });

  it('preserves the historical experience bottleneck without turning it into a Phase G result', () => {
    expect(component).toContain('0 / 30');
    expect(component).toContain('parser-safe retry');
    expect(component).toContain('self-acquired rollout');
    expect(component).toContain('不能自动外推到 teacher-trajectory');
    expect(component).toContain('is not a negative Phase G result');
    expect(component).toContain('CURRENT_FINDINGS.md');
  });

  it('shows the frozen Phase G matrix and fail-closed activation gate', () => {
    expect(component).toContain('promotion-dev');
    expect(component).toContain('6680 · 2590');
    expect(component).toContain('202652 · 202653');
    expect(component).toContain('base');
    expect(component).toContain('adapter1x');
    expect(component).toContain('cumulative');
    expect(component).toContain('2 goals × 2 generation seeds × 3 arms');
    expect(component).toContain('formal_task_consumption_allowed = false');
    expect(component).toContain('12');
  });

  it('keeps W&B observational and wires the static bilingual section before historical seed3090 evidence', () => {
    expect(component).toContain('wandb==0.26.1');
    expect(component).toContain('20260814-1431-phaseg-base-vs-adapters');
    expect(component).toContain('0 consumed');
    expect(component).toContain('Run Manifests and local JSON evidence remain canonical provenance');
    expect(component).toContain('data-testid="openevo-experiment-program"');
    expect(component).not.toContain('client:');

    for (const route of [zhRoute, enRoute]) {
      expect(route).toContain('OpenEvoExperimentProgram');
      expect(route).toContain('<OpenEvoExperimentProgram locale={locale} />');
      expect(route.indexOf('<OpenEvoExperimentProgram locale={locale} />')).toBeLessThan(
        route.indexOf('<Seed3090ParametricProgress locale={locale} />'),
      );
    }
  });
});
