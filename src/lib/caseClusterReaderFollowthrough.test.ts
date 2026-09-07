import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const protocol = read('src/components/research/OpenEvoWebShopResultsProtocol.astro');
const q7 = read('src/components/research/OpenEvoWebShopCurrentQ7.astro');
const next = read('src/components/research/OpenEvoWebShopNextSteps.astro');
const modelGuide = read('src/components/research/OpenEvoModelExperimentGuide.astro');

describe('case-cluster reader follow-through', () => {
  it('names the two task populations instead of presenting a reading instruction', () => {
    expect(protocol).toContain('OpenEVO 内部新任务与 SEED 官方保留任务');
    expect(protocol).toContain('数字、单位与项目内部编号');
    expect(protocol).toContain('任务完成度与完整成功');
    expect(protocol).not.toContain('先分清两种“新任务”');
    expect(protocol).not.toContain('先把数字、单位和项目内部编号翻译成人话');
    expect(protocol).not.toContain('两个分数分别回答两个问题');
  });

  it('puts the missing OpenEVO-vs-SEED comparison before internal route names', () => {
    expect(q7).toContain('OpenEVO 与 SEED 的同协议最终比较');
    expect(q7).toContain('7B 基础模型和加载冻结 OpenEVO SD-LoRA 后的 7B 模型');
    expect(q7).not.toContain('最后还缺哪一个关键实验？');
    expect(q7).not.toContain('源码忠实任务测量路线（Track A）已经完成，不再是“待验证”');
    expect(q7).not.toContain('真正还缺的是方法对方法的公平比较路线（Track B）');
  });

  it('keeps next-step titles about the experiments rather than Track/WB aliases', () => {
    for (const phrase of [
      '7B 基础模型与 OpenEVO：128 个 WebShop 任务已完成，未证明稳定优势',
      '连续学习实验：第 28 代状态已补齐，第 29 代尚未获准执行',
      'ALFWorld 跨环境复测',
      'OpenEVO 与 SEED 的同协议方法比较',
      '已经完成的测量与下一步方法比较',
    ]) expect(next).toContain(phrase);
    for (const rejected of [
      '路线 A 已完成：测量有效，但没有证明稳定胜出',
      '第 28 代状态断点已修复；路线 B / WB1 等待第 29 代授权',
      '最后再去 ALFWorld 看这个现象是不是 WebShop 特有',
      '下一场真正会改变结论的实验',
      '两条路线回答不同问题',
    ]) expect(next).not.toContain(rejected);
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
