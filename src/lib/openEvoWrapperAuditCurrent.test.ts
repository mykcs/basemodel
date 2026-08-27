import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');
const wrapper = read('../components/research/OpenEvoActionWrapperAttribution.astro');
const nextSteps = read('../components/research/OpenEvoWebShopNextSteps.astro');

describe('current Track A wrapper audit and WB1 repair gate', () => {
  it('keeps the formal wrapper audit inside the collapsed technical trace', () => {
    expect(wrapper).toContain('技术回溯 · 默认折叠');
    expect(wrapper).toContain('Track A 正式审计');
    expect(wrapper).toContain('3,672');
    expect(wrapper).toContain('300 步严格 <action>');
    expect(wrapper).toContain('3,253 步');
    expect(wrapper).toContain('119 步');
    expect(wrapper).toContain('BASE 77、SD-LoRA 42');
    expect(wrapper).toContain('256/256 formal episodes');
    expect(wrapper).toContain('parser-invalid=0');
    expect(wrapper).toContain('WRAPPER_AUDIT.json');
    expect(wrapper).toContain('audit_seedcmp_wrapper_drift.py');
    expect(wrapper).not.toContain('<section class="wrapper-attribution"');
  });

  it('describes Amendment 006 as repair authority, not a completed state-v28', () => {
    expect(nextSteps).toContain('Amendment 006');
    expect(nextSteps).toContain('GEN28_STATE_REPAIR_AUTHORIZED_INPUT_SEAL_PENDING');
    expect(nextSteps).toContain('state-v27');
    expect(nextSteps).toContain('3,456/20,640');
    expect(nextSteps).toContain('3,584/20,640');
    expect(nextSteps).toContain('17,056');
    expect(nextSteps).toContain('CPU-only');
    expect(nextSteps).toContain('不声称“字节级 deterministic replay”');
    expect(nextSteps).toContain('formal_task_consumption_allowed=false');
    expect(nextSteps).toContain('gpu_allocation_allowed=false');
    expect(nextSteps).toContain('final 继续 locked');
    expect(nextSteps).toContain('WB1_AMENDMENT_006_GEN28_DEFERRED_NATIVE_STATE_UPDATE_2026-08-27.md');
    expect(nextSteps).toContain('wb1_gen28_state_repair.py');
    expect(nextSteps).not.toContain('state-v28 已经生成');
  });
});
