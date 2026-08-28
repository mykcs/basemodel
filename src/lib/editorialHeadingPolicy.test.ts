import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const state = read('src/lib/openEvoScientificState.ts');
const files = [
  'src/pages/_bodies/home-v2.astro',
  'src/pages/_bodies/paper-detail.astro',
  'src/pages/methodology.astro',
  'src/pages/en/methodology.astro',
  'src/pages/guide.astro',
  'src/pages/en/guide.astro',
  'src/pages/guide/today.astro',
  'src/pages/lab.astro',
  'src/pages/en/lab.astro',
  'src/components/papers/PaperRoleDiagram.tsx',
  'src/components/papers/PaperLearningGuide.astro',
  'src/components/papers/ReproductionSummary.astro',
  'src/components/papers/PaperSelectionRationale.astro',
  'src/components/workspace/SubstituteLab.tsx',
  'src/components/research/SeedOpenEvoResearchDetail.astro',
  'src/components/research/SeedOpenEvoResearchPageCore.astro',
  'src/components/research/OpenEvoExperimentProgram.astro',
  'src/components/research/OpenEvoExperimentGateway.astro',
  'src/components/OpenEvoSeedBenchmarksGuide.astro',
  'src/components/research/OpenEvoModelExperimentGuide.astro',
  'src/components/research/BenchmarkDatasetDiagram.astro',
  'src/components/research/SeedFrameworkDiagram.astro',
  'src/components/research/OpenEvoFrameworkDiagram.astro',
  'src/components/research/SeedOpenEvoComparisonDiagram.astro',
  'src/components/research/ServerAuthorityDiagram.astro',
].map(read);
const joined = files.join('\n');

describe('sitewide editorial heading policy', () => {
  it('removes loud meta-narrative headings and sentence-style prompts', () => {
    for (const banned of [
      '把“曾经成功”“当前准备好”“现在测得结果”分开',
      '先用一段话看懂方法',
      '这些模型在论文里分别负责什么',
      '这些模型按什么顺序参与实验',
      '复现这篇论文需要的材料是否齐全',
      '换一个模型会改变什么？',
      '这些数字从哪里来，缺数据时怎么看',
      '第一次读 SEED？从这里开始',
      '像看视频目标分割网络一样，看懂 OpenEvo 和 SEED 自己的工作原理',
      '数据从哪里进来，经过什么加工，最后流向哪里',
      '像看加工流水线一样理解 WebShop 与 ALFWorld',
      '我的设备、4×3090 和连接方式',
    ]) expect(joined).not.toContain(banned);
  });

  it('uses subject headings for the major public surfaces', () => {
    for (const expected of [
      'OpenEvo × WebShop 研究结果', '实验进度', 'OpenEvo × WebShop 实验', 'OpenEvo 实验复现指南',
      '模型扩展实验', 'WebShop 与 ALFWorld 环境模型', 'SEED 自进化训练机制', 'OpenEvo 跨任务演化机制',
      '实验室服务器权限模型', 'SEED 与 OpenEvo 的经验载体', '方法摘要', '数据来源与缺失信息',
      '模型参与顺序', '模型角色', '论文学习指南', '复现材料', '模型选择依据', '模型替换分析',
      '实验设备与服务器', 'RTX6 复现记录',
    ]) expect(joined).toContain(expected);
  });

  it('makes historical hardware, live lab visibility, and branch-aware experiment state explicit', () => {
    expect(joined).toContain('RTX6（4×RTX3090）');
    expect(joined).toContain('8×RTX5090 visible · allocation policy unknown');
    expect(joined).toContain('历史记录：5×RTX5090 allocation');
    expect(joined).toContain('Phase G');
    expect(state).toContain("phase: 'WB1-TRACKB-CONTINUATION'");
    expect(state).toContain("checkedAt: '2026-08-28'");
    expect(joined).toContain('current-campaign');
    expect(joined).toContain('reconciliation');
    expect(joined).not.toContain('formal_task_consumption_allowed = false');
    expect(joined).not.toContain('当前实验分配：5× RTX 5090');
    expect(joined).not.toContain('Current experiment allocation: 5× RTX 5090');
  });
});
