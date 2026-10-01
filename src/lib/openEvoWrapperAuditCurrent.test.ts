import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');
const wrapper = read('../components/research/OpenEvoActionWrapperAttribution.astro');
const nextSteps = read('../components/research/OpenEvoWebShopNextSteps.astro');

describe('current Track A wrapper audit and adopted WB1 state', () => {
  it('keeps the formal wrapper audit inside the collapsed technical trace', () => {
    expect(wrapper).toContain('已发布 256 个正式回合的完整审计');
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
    expect(nextSteps).toContain('state-v28 采纳时的不可变 campaign 快照');
    expect(nextSteps).toContain('前序 WB1 state-v28 是独立匹配比较线的历史状态');
    expect(nextSteps).toContain('3,584 / 20,640');
    expect(nextSteps).not.toContain('formal_task_consumption_allowed=false');
    expect(nextSteps).not.toContain('gpu_allocation_allowed=false');
    expect(nextSteps).toContain('正式任务消费仍锁定');
    expect(nextSteps).toContain('PENDING_ZERO_FORMAL_PREFLIGHT');
    expect(nextSteps).toContain('RECONCILIATION.json');
  });
});
