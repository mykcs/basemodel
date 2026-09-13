import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  SD_LORA_STRICT_ACCELERATION,
  SD_LORA_V2_LOCAL,
  SD_LORA_V2_WEBSHOP,
} from '../data/sdLoraV2Outcome';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');
const page = read('../components/research/OpenEvoSdLoraV2Outcome.astro');
const zhRoute = read('../pages/research/seed-openevo/study/capability-exploration/sd-lora-equivalence/index.astro');
const enRoute = read('../pages/en/research/seed-openevo/study/capability-exploration/sd-lora-equivalence/index.astro');
const contracts = read('../data/siteReaderContracts.ts');

describe('SD-LoRA v2 publication', () => {
  it('keeps strict acceleration failure separate from speedup failure', () => {
    expect(SD_LORA_STRICT_ACCELERATION.speedup).toBeCloseTo(2.75236, 4);
    expect(page).toContain('失败的不是“加速 SD-LoRA”');
    expect(page).toContain('NO_STRICT_SUCCESSOR');
  });

  it('publishes the matched eight-step speed result without claiming equivalence', () => {
    expect(SD_LORA_V2_LOCAL.referenceEightStepSeconds).toBeCloseTo(105.11307, 5);
    expect(SD_LORA_V2_LOCAL.v2EightStepSeconds).toBeCloseTo(52.281216, 5);
    expect(SD_LORA_V2_LOCAL.eightStepSpeedup).toBeGreaterThan(2);
    expect(SD_LORA_V2_LOCAL.priorTensorCount).toBe(33152);
    expect(page).toContain('它们的 loss / 参数轨迹确实不同');
    expect(page).toContain('新的 fast baseline');
  });

  it('keeps the prospective WebShop result local and bounded', () => {
    expect(SD_LORA_V2_WEBSHOP.attemptsPerArm).toBe(128);
    expect(SD_LORA_V2_WEBSHOP.pairedPositive).toBe(8);
    expect(SD_LORA_V2_WEBSHOP.pairedTie).toBe(117);
    expect(SD_LORA_V2_WEBSHOP.pairedNegative).toBe(3);
    expect(page).toContain('这不是“v2 显著更好”的证据');
    expect(page).toContain('不是 final panel');
  });

  it('replaces the old placeholder on both locale routes', () => {
    expect(zhRoute).toContain('OpenEvoSdLoraV2Outcome');
    expect(enRoute).toContain('OpenEvoSdLoraV2Outcome');
    expect(zhRoute).not.toContain('OpenEvoSdLoraHistorySkeleton');
    expect(enRoute).not.toContain('OpenEvoSdLoraHistorySkeleton');
    expect(contracts).toContain('先看到 SD-LoRA v2 确实能更快训练');
    expect(contracts).toContain("'.sdlora-v2__lede'");
  });

  it('keeps the owner-facing plain-language conclusion visible', () => {
    expect(page).toContain('原来的 900 多秒不是非得忍着');
    expect(page).toContain('目前的小规模真实 WebShop 检查没有发现它因为加速而明显变笨');
    expect(page).toContain('下一步不是继续死磕 v2，而是把它变成 GDR 的强基线');
  });
});
