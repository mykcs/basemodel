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

  it('publishes state-v28 adoption without unlocking Gen29', () => {
    expect(nextSteps).toContain('GEN28_STATE_V28_BARRIER_PASS_ADOPTED');
    expect(nextSteps).toContain('第 28 代的 state-v28 已补齐、通过状态门并被正式采用');
    expect(nextSteps).toContain('3,584/20,640');
    expect(nextSteps).toContain('17,056');
    expect(nextSteps).toContain('formal_task_consumption_allowed=false');
    expect(nextSteps).toContain('gpu_allocation_allowed=false');
    expect(nextSteps).toContain('final locked 表示最终测试仍锁定');
    expect(nextSteps).toContain('第 29 代仍需要一次独立的“可以恢复执行”授权');
    expect(nextSteps).toContain('RECONCILIATION.json');
  });
});
