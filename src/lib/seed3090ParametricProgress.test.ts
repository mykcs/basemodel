import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) =>
  readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');

const component = read('src/components/research/Seed3090ParametricProgress.astro');
const zhRoute = read('src/pages/research/seed-openevo/results.astro');
const enRoute = read('src/pages/en/research/seed-openevo/results.astro');

describe('seed3090 parametric OpenEvo × WebShop progress', () => {
  it('shows the real SD-LoRA training loop without overstating efficacy', () => {
    expect(component).toContain('真实 WebShop 轨迹');
    expect(component).toContain('causal-LM loss');
    expect(component).toContain('optimizer.step');
    expect(component).toContain('LoRA / PARAMETRIC_MEMORY');
    expect(component).toContain('工程闭环：已通过');
    expect(component).toContain('稳定收益：未证明');
    expect(component).toContain('Engineering loop: passed');
    expect(component).toContain('Stable reward gain: unproven');
  });

  it('preserves the key result sequence and method boundary from the stage report', () => {
    expect(component).toContain('0.0 → 0.0');
    expect(component).toContain('0 → 0.429');
    expect(component).toContain('0 → 0.429 → 0');
    expect(component).toContain('continual LoRA-SFT');
    expect(component).toContain('OPD + GRPO');
    expect(component).toContain('multi-seed effect estimate');
    expect(component).toContain('OPENEVO_WEBSHOP_STAGE_REPORT_2026-08-13.md');
  });

  it('makes diagnosis the next step and keeps the current page static and bilingual', () => {
    expect(component).toContain('SD-LoRA 先学会训练任务了吗？');
    expect(component).toContain('gen2 回退是遗忘还是 rollout 方差？');
    expect(component).toContain('Did SD-LoRA first learn the training tasks?');
    expect(component).toContain('Is the gen2 regression forgetting or rollout variance?');
    expect(component).toContain('data-testid="seed3090-parametric-progress"');
    expect(component).not.toContain('client:');

    for (const route of [zhRoute, enRoute]) {
      expect(route).toContain('Seed3090ParametricProgress');
      expect(route).toContain('<Seed3090ParametricProgress locale={locale} />');
      expect(route).not.toContain('Seed3090EvidenceGate');
      expect(route).not.toContain('Seed3090PairedRunAudit');
    }
  });
});
