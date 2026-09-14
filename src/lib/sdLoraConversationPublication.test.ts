import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { SD_LORA_BOUNDED_RECURRENCE_SOURCE } from '../data/sdLoraVrLineages';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');
const overview = read('../components/research/OpenEvoSdLoraHistorySkeleton.astro');
const context = read('../components/research/OpenEvoSdLoraAccelerationContext.astro');

describe('SD-LoRA conversation publication', () => {
  it('mounts the complete context only from the canonical overview owner', () => {
    expect(overview).toContain('OpenEvoSdLoraAccelerationContext');
    expect(context).toContain('一个越来越慢的更新，后来变成两条不同研究路线');
  });

  it('keeps the two acceleration estimands separate', () => {
    expect(context).toContain('不能拼成一条“2× 继续优化到 37×”的曲线');
    expect(context).toContain('SD-LoRA v2 · Stable Reduction');
    expect(context).toContain('SD-LoRA · Bounded Online Recurrence');
  });

  it('records the naming correction without merging treatment identities', () => {
    expect(context).toContain('共享父级改成中性的“SD-LoRA 加速”');
    expect(context).toContain('VR 可以帮助在历史讨论里找到工程加速线，但不是 treatment 名称');
  });

  it('preserves the bounded recurrence final provenance', () => {
    expect(SD_LORA_BOUNDED_RECURRENCE_SOURCE.finalAdapterSha256).toBe('2b65b71a4c822c8b2a6d4639d31a3289dc2267f9de8f0109c8c69bdd1821ad32');
    expect(SD_LORA_BOUNDED_RECURRENCE_SOURCE.finalCloseoutSha256).toBe('0a4be2489779712886b8c0557d4ca74d6000b2dc1d6b727dd56c355ed182cd79');
    expect(context).toContain('protected final panel access = 0');
  });

  it('keeps historical admission and current recurrent writing as a third problem', () => {
    expect(context).toContain('44 个更新，其中 7 个成为后续模型状态的一部分');
    expect(context).toContain('四轮配对资格实验已经全部封存，每臂 512 次任务尝试');
    expect(context).toContain('173 / 512 对 248 / 512');
  });
});
