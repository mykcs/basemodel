import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const protocol = read('src/components/research/OpenEvoWebShopResultsProtocol.astro');
const q7 = read('src/components/research/OpenEvoWebShopCurrentQ7.astro');
const next = read('src/components/research/OpenEvoWebShopNextSteps.astro');
const modelGuide = read('src/components/research/OpenEvoModelExperimentGuide.astro');

describe('case-cluster reader follow-through', () => {
  it('names the two task populations and explains them where they first appear', () => {
    expect(protocol).toContain('训练范围内未见任务与 SEED 验证任务');
    expect(protocol).toContain('训练范围内没有见过的任务');
    expect(protocol).toContain('任务 500–6909');
    expect(protocol).toContain('SEED 留作验证的任务');
    expect(protocol).toContain('任务 0–499');
    expect(protocol).toContain('任务完成度与完整成功');
    expect(protocol).not.toContain('先分清两种“新任务”');
    expect(protocol).not.toContain('数字、单位与项目内部编号');
    expect(protocol).not.toContain('project-terms');
    expect(protocol).not.toContain('goal_idx');
    expect(protocol).not.toContain('专业解释：');
  });

  it('puts the remaining method comparison before internal route names', () => {
    expect(q7).toContain('还缺的方法级对照');
    expect(q7).toContain('同一 128 个 WebShop 任务已经分别给基础模型');
    expect(q7).toContain('真正还缺的是让 SEED 和 OpenEvo 在同一环境');
    expect(q7).not.toContain('最后还缺哪一个关键实验？');
    expect(q7).not.toContain('源码忠实任务测量路线（Track A）已经完成，不再是“待验证”');
    expect(q7).not.toContain('真正还缺的是方法对方法的公平比较路线（Track B）');
    expect(q7).not.toContain('专业解释：');
  });

  it('keeps next-step titles about experiments and moves internal state into optional records', () => {
    for (const phrase of [
      '同一 128 个任务的两模型测量已完成',
      '方法对方法比较等待继续授权',
      'WebShop 稳定后再做 ALFWorld 复现',
      '下一轮 OpenEvo 与 SEED 公平比较',
      '两轮比较回答不同问题',
    ]) expect(next).toContain(phrase);
    expect(next).toContain('<details class="step-detail">');
    expect(next).not.toContain('专业解释：');
    expect(next).not.toContain('路线 A 已完成：测量有效，但没有证明稳定胜出');
    expect(next).not.toContain('第 28 代状态断点已修复；路线 B / WB1 等待第 29 代授权');
  });

  it('explains same-model comparison before paired/statistical terminology', () => {
    expect(modelGuide).toContain('同一个模型的两种条件');
    expect(modelGuide).toContain('同一个模型，不使用 OpenEVO');
    expect(modelGuide).toContain('同一个模型，使用 OpenEVO');
    expect(modelGuide).toContain('四个检查项');
    expect(modelGuide).toContain('同模型比较');
    expect(modelGuide).not.toContain('配对实验协议');
    expect(modelGuide).not.toContain('四步阅读法');
  });
});
