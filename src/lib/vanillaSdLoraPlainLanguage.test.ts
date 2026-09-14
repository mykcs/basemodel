import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const slide = readFileSync(new URL('../components/research/OpenEvoVanillaSdLoraSlide.astro', import.meta.url), 'utf8');
const mechanism = readFileSync(new URL('../components/research/OpenEvoVanillaSdLoraMechanism.astro', import.meta.url), 'utf8');

describe('Vanilla SD-LoRA first-screen plain-language contract', () => {
  it('starts from the mechanism rather than a defensive or presenter-style opening', () => {
    expect(slide).toContain('Vanilla SD-LoRA 的一轮参数更新');
    expect(slide).not.toContain('不是四张卡片排成一排');
    expect(slide).not.toContain('一轮怎样更新参数');
  });

  it('puts human actions before internal labels', () => {
    for (const phrase of [
      '每题只选一条通过全部检查的成功',
      '最多带回 64 条旧经验',
      '旧方向不改；学一个新方向；重新调整所有方向的影响大小',
      '得到一份新的累计 LoRA',
      '检查通过，下一轮用新参数',
      '先用 16 个任务小测，再选新旧参数',
    ]) expect(slide).toContain(phrase);
  });

  it('keeps the long-form reading path human-first while leaving exact fields in the technical layer', () => {
    for (const phrase of [
      '一轮开始前，模型带着什么？',
      '128 次尝试里，哪些会真的拿来训练参数？',
      'SD-LoRA 真正怎么改参数？',
      '训练结束后，下一轮到底用新参数还是旧参数？',
      'LoRA 训练出来了，不等于下一轮真的用了它',
      '旧方向没被重写，也不代表能力会一直变好',
    ]) expect(mechanism).toContain(phrase);
    for (const exactBoundary of ['paper_equivalent=false', 'rehearsal_free=false', 'routing_mode=single_cumulative_adapter']) {
      expect(mechanism).toContain(exactBoundary);
    }
  });

  it('keeps the scientific mechanism and boundaries visible', () => {
    for (const phrase of ['Dₜ ← BₜAₜ', 'α₁ · α₂ · … · αₜ', 'ΔWₜ = Σ αᵢDᵢ', 'DirectApply', 'GDR-v1']) {
      expect(slide).toContain(phrase);
    }
  });
});
