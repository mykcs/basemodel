import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const slide = readFileSync(new URL('../components/research/OpenEvoVanillaSdLoraSlide.astro', import.meta.url), 'utf8');
const mechanism = readFileSync(new URL('../components/research/OpenEvoVanillaSdLoraMechanism.astro', import.meta.url), 'utf8');

describe('Vanilla SD-LoRA first-screen plain-language contract', () => {
  it('starts from the parameter-write job and keeps the detailed LoRA comparison at optional depth', () => {
    for (const phrase of [
      '把做对的网页购物轨迹训练成下一轮候选参数',
      '这条参数更新方法叫 SD-LoRA（Scalable Decoupled LoRA）',
      '基础模型保持不动，只训练少量适配参数',
      'WebShop（网页购物任务）',
      '筛出完整成功轨迹',
      '训练候选 LoRA',
      '共同检查通过后，下一轮采用',
      '候选参数不等于能力一定提升',
      '普通 LoRA 与 SD-LoRA 的参数区别',
      'Scalable Decoupled LoRA',
      '本页把没有加入后续加速变体的当前基线称为 “Vanilla SD-LoRA”',
    ]) expect(mechanism).toContain(phrase);

    expect(mechanism).toContain('历史本地 GDR-v1 会先用 16 个任务小测');
    expect(mechanism).toContain('Hugging Face PEFT（LoRA 训练与加载工具库）');
    expect(mechanism).toContain('αₜ（缩放系数，用来记录这个方向原本有多强）');
    expect(mechanism).toContain('checkpoint，也就是某一轮保存下来的参数状态');
    expect(mechanism).not.toContain('下一屏：');
    expect(mechanism).toContain('<details class="sdlora__section sdlora__section--primer"');
    expect(mechanism).not.toContain('sdlora-intro__frame research-fact-band');
    const intro = mechanism.slice(mechanism.indexOf('<section class="sdlora-intro"'), mechanism.indexOf('</section>') + 10);
    expect(intro).toContain('sdlora-intro__path');
    expect(intro).not.toContain('DirectApply');
    expect(intro).not.toContain('GDR-v1');
    const motivation = mechanism.indexOf('把做对的网页购物轨迹训练成下一轮候选参数');
    const comparison = mechanism.indexOf('普通 LoRA 与 SD-LoRA 的参数区别');
    const slideOwner = mechanism.indexOf('<OpenEvoVanillaSdLoraSlide');
    expect(motivation).toBeGreaterThan(-1);
    expect(slideOwner).toBeGreaterThan(motivation);
    expect(comparison).toBeGreaterThan(slideOwner);
  });

  it('keeps the reusable slide mechanism-first rather than adding duplicate orientation inside it', () => {
    expect(slide).toContain('一轮 SD-LoRA 参数更新');
    expect(slide).not.toContain('为什么 OpenEvo 里需要 SD-LoRA？');
    expect(slide).not.toContain('不是四张卡片排成一排');
    expect(mechanism).not.toContain('那 SD-LoRA 到底是什么？');
    expect(mechanism).not.toContain('这里的 “Vanilla SD-LoRA” 不等于普通 LoRA');
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
      '128 次尝试里，哪些会进入参数训练？',
      'SD-LoRA 怎样更新参数？',
      '训练结束后，下一轮到底用新参数还是旧参数？',
      'LoRA 训练完成和下一轮采用它是两件事',
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
