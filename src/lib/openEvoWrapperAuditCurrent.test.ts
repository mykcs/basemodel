import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');
const wrapper = read('../components/research/OpenEvoActionWrapperAttribution.astro');
const nextSteps = read('../components/research/OpenEvoWebShopNextSteps.astro');

describe('current Track A wrapper audit and adopted WB1 state', () => {
  it('keeps the formal wrapper audit inside the collapsed technical trace', () => {
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

  it('publishes the continuation boundary in human language while retaining the exact state in the record layer', () => {
    expect(nextSteps).toContain('GEN28_STATE_V28_BARRIER_PASS_ADOPTED');
    expect(nextSteps).toContain('原本漏存的训练状态也已经在不重跑 WebShop、不使用 GPU 的前提下补齐并核对通过');
    expect(nextSteps).toContain('3,584 / 20,640');
    expect(nextSteps).toContain('17,056');
    expect(nextSteps).not.toContain('formal_task_consumption_allowed=false');
    expect(nextSteps).not.toContain('gpu_allocation_allowed=false');
    expect(nextSteps).toContain('当前记录仍明确禁止继续消耗正式任务和分配 GPU，最终测试也保持锁定');
    expect(nextSteps).toContain('恢复执行前必须重新读取最新的运行授权');
    expect(nextSteps).toContain('RECONCILIATION.json');
  });
});
