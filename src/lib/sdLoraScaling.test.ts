import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  SD_LORA_FIXED_WORKLOAD,
  SD_LORA_K128_REPLICATION,
  SD_LORA_SCALING_FITS,
  SD_LORA_SCALING_POINTS,
} from '../data/sdLoraScaling';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');
const page = read('../components/research/OpenEvoSdLoraScaling.astro');
const zhRoute = read('../pages/research/seed-openevo/study/capability-exploration/sd-lora-scaling/index.astro');
const enRoute = read('../pages/en/research/seed-openevo/study/capability-exploration/sd-lora-scaling/index.astro');
const lobby = read('../components/research/OpenEvoCapabilityMapLobby.astro');
const contracts = read('../data/siteReaderContracts.ts');
const routes = read('../data/capabilityReaderRoutes.ts');
const publicEvidence = JSON.parse(read('../../public/research/seed-openevo/evidence/q17-sd-lora-component-scaling-20260912.json'));

describe('SD-LoRA component-count scaling publication', () => {
  it('keeps the five fixed-workload scaling points exact', () => {
    expect(SD_LORA_SCALING_POINTS.map((point) => point.k)).toEqual([1, 32, 64, 128, 148]);
    expect(SD_LORA_SCALING_POINTS[0].trainer).toBeCloseTo(44.0458693341, 8);
    expect(SD_LORA_SCALING_POINTS[4].trainer).toBeCloseTo(969.1709041460, 8);
    expect(SD_LORA_FIXED_WORKLOAD.optimizerSteps).toBe(94);
    expect(SD_LORA_FIXED_WORKLOAD.currentExamples).toBe(47);
    expect(SD_LORA_FIXED_WORKLOAD.replayExamples).toBe(47);
  });
  it('publishes the qualified linear scaling fit and replication boundary', () => {
    expect(SD_LORA_SCALING_FITS.trainer.slope).toBeCloseTo(6.1480371796, 8);
    expect(SD_LORA_SCALING_FITS.trainer.r2).toBeGreaterThan(0.997);
    expect(SD_LORA_K128_REPLICATION.deltaPercent).toBeLessThan(0.1);
    expect(publicEvidence.claim).toContain('approximately linearly');
    expect(publicEvidence.fixed_workload.optimizer_steps).toBe(94);
    expect(publicEvidence.points).toHaveLength(5);
  });

  it('keeps the public claim bounded to compute scaling', () => {
    for (const text of ['还没有证明哪种替代算法最好', '不能单独证明模型发生了持续学习遗忘', '也没有证明 component 累积本身会让 WebShop 能力下降']) {
      expect(page).toContain(text);
    }
    expect(page).toContain('forward / backward');
    expect(page).toContain('T(K)=38.07+6.15K');
  });

  it('registers bilingual routes and a capability-lobby entry', () => {
    expect(zhRoute).toContain('OpenEvoSdLoraScaling');
    expect(enRoute).toContain('OpenEvoSdLoraScaling');
    expect(contracts).toContain("capability-sd-lora-scaling");
    expect(routes).toContain('sd-lora-scaling');
    expect(lobby).toContain('SD-LoRA 计算诊断');
    expect(lobby).toContain('查看 SD-LoRA 计算扩展性');
  });
});
