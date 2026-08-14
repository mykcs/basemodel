import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');

const files = [
  'src/pages/_bodies/home-v2.astro',
  'src/pages/_bodies/paper-detail.astro',
  'src/pages/methodology.astro',
  'src/pages/en/methodology.astro',
  'src/pages/guide.astro',
  'src/pages/en/guide.astro',
  'src/components/research/SeedOpenEvoResearchDetail.astro',
  'src/components/research/SeedOpenEvoResearchPageCore.astro',
  'src/components/research/OpenEvoExperimentProgram.astro',
  'src/components/research/OpenEvoExperimentGateway.astro',
  'src/components/OpenEvoSeedBenchmarksGuide.astro',
  'src/components/research/OpenEvoModelExperimentGuide.astro',
  'src/components/research/OpenEvoSeedMechanismAnimation.astro',
  'src/components/research/AgentEnvironmentTrajectory.astro',
  'src/components/research/AgentMechanismDialogues.astro',
].map(read);

const joined = files.join('\n');

describe('sitewide editorial heading policy', () => {
  it('removes the loud meta-narrative headings called out in review', () => {
    for (const banned of [
      '把“曾经成功”“当前准备好”“现在测得结果”分开',
      '先用一段话看懂方法',
      '这些模型在论文里分别负责什么',
      '这些数字从哪里来，缺数据时怎么看',
      '像看视频目标分割网络一样，看懂 OpenEvo 和 SEED 自己的工作原理',
      '数据从哪里进来，经过什么加工，最后流向哪里',
      '像看加工流水线一样理解 WebShop 与 ALFWorld',
    ]) expect(joined).not.toContain(banned);
  });

  it('uses subject headings for the main research surfaces', () => {
    for (const expected of [
      '实验结果与证据',
      '实验进度',
      '当前实验进展',
      'OpenEvo × WebShop 实验',
      'OpenEvo 实验复现指南',
      '模型扩展实验',
      'OpenEvo 与 SEED 机制图',
      'WebShop 与 ALFWorld 数据流',
      'SEED 与 OpenEvo 数据流',
      '方法摘要',
      '数据来源与缺失信息',
    ]) expect(joined).toContain(expected);
  });

  it('makes RTX6 historical and the current experiment allocation explicit', () => {
    expect(joined).toContain('RTX6（4×RTX 3090）');
    expect(joined).toContain('历史');
    expect(joined).toContain('5× RTX 5090');
    expect(joined).toContain('Phase H0');
    expect(joined).toContain('Phase G');
    expect(joined).not.toContain('formal_task_consumption_allowed = false');
  });
});
