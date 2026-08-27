import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const component = read('src/components/research/Seed3090ParametricProgress.astro');
const zhRoute = read('src/pages/research/seed-openevo/study/results.astro');
const enRoute = read('src/pages/en/research/seed-openevo/study/results.astro');
const appendix = read('src/components/research/OpenEvoWebShopResultsAppendix.astro');

describe('historical seed3090 parametric evidence', () => {
  it('marks RTX6 / 4×RTX3090 as historical instead of the active experiment', () => {
    expect(component).toContain('RTX6 参数实验记录');
    expect(component).toContain('RTX6（4×RTX 3090）已退出当前实验主线');
    expect(component).toContain('RTX6 (4×RTX 3090) is no longer the active experiment platform');
    expect(component).toContain('openevo-experiment');
  });

  it('preserves the real SD-LoRA mechanism and key historical score sequence', () => {
    for (const token of ['causal-LM loss','optimizer.step','LoRA / PARAMETRIC_MEMORY','0.0 → 0.0','0 → 0.429','0 → 0.429 → 0','continual LoRA-SFT','OPD + GRPO']) expect(component).toContain(token);
    expect(component).toContain('OPENEVO_WEBSHOP_STAGE_REPORT_2026-08-13.md');
  });

  it('carries diagnosis forward inside the collapsed appendix instead of the results landing body', () => {
    expect(component).toContain('SD-LoRA 是否先拟合训练任务？');
    expect(component).toContain('gen2 回退来自遗忘还是 rollout 方差？');
    expect(component).toContain('Phase H0');
    expect(component).toContain('data-testid="seed3090-parametric-progress"');
    expect(component).not.toContain('client:');

    for (const route of [zhRoute, enRoute]) {
      expect(route).not.toContain('Seed3090ParametricProgress');
      expect(route).toContain('OpenEvoWebShopResultsAppendix');
    }
    expect(appendix).toContain('data-testid="rtx6-appendix"');
    expect(appendix).toContain('<Seed3090ParametricProgress locale={locale} />');
  });
});
