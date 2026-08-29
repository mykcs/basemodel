import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');
const scaffold = read('../components/research/OpenEvoExperimentResultsScaffold.astro');
const analysis = read('../components/research/OpenEvoExperimentAnalysisPlan.astro');

const resultFamilyCopy = `${scaffold}\n${analysis}`;

describe('OpenEvo capability-exploration result language', () => {
  it('explains the 7-versus-8 Stage-2 update rule in reader terms', () => {
    expect(scaffold).toContain('这个 8 是“不同任务数门槛”，不是 8 分，也不是要 8 条轨迹');
    expect(scaffold).toContain('7 表示最好的一块仍差 1 个任务身份才允许训练');
    expect(scaffold).toContain('成功不能跨不同数据块累积来凑 8');
    expect(scaffold).toContain('"0 次更新"则表示 Stage 2 没有改变模型参数，而不是 Stage 2 没有运行');
  });

  it('separates attempts, successful trajectories, task identities, and parameter updates', () => {
    expect(scaffold).toContain('Stage 1：启动学习阶段');
    expect(scaffold).toContain('Stage 2：模型自主探索阶段');
    expect(scaffold).toContain('一次任务尝试（rollout）');
    expect(scaffold).toContain('可用于训练的完整成功轨迹（qualified positive）');
    expect(scaffold).toContain('达标任务身份（qualifying identity）');
    expect(scaffold).toContain('Stage 2 参数更新门槛（gate）');
    expect(scaffold).toContain('参数更新与学习适配器（adapter）');
    expect(scaffold).toContain('启动训练（bootstrap）');
  });

  it('does not regress to author-only shorthand for negative result states', () => {
    for (const opaque of [
      '80/80 个 block 都没有参数更新',
      '单个 block 的 qualifying identity 最大只有 7，而 gate 需要 8',
      '0 update / 无 adapter',
      'Stage-2 仍然全是 no-update',
      'success 数据很多，但 gate 一直不打开',
      'q-positive / identity / distance-to-gate',
      'gate/coverage',
      'final pending',
    ]) {
      expect(resultFamilyCopy, `opaque result shorthand "${opaque}" should not reappear`).not.toContain(opaque);
    }
  });

  it('spells out incomplete and zero-update states instead of making zero mean failure', () => {
    expect(scaffold).toContain('尚无最终结果（对应实验仍未封口）');
    expect(analysis).toContain('未达到启动门槛，因此 0 次参数更新');
    expect(analysis).toContain('最终 128 任务评测尚未完成');
    expect(analysis).toContain('Stage 2 虽然做了大量任务尝试，却没有发生参数训练');
  });
});
