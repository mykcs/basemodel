import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');

const rootAgents = read('../../AGENTS.md');
const agentReadme = read('../../docs/agents/README.md');
const latest = read('../../docs/agents/LATEST.md');
const editorial = read('../../docs/agents/current/research-editorial-style.md');
const localResearchAgents = read('../components/research/AGENTS.md');
const hub = read('../components/research/SeedOpenEvoResearchHub.astro');
const detail = read('../components/research/SeedOpenEvoResearchDetail.astro');
const gateway = read('../components/research/OpenEvoExperimentGateway.astro');
const nextProtocol = read('../components/research/OpenEvoNextExperimentProtocol.astro');
const modelGuide = read('../components/research/OpenEvoModelExperimentGuide.astro');
const benchmarkNote = read('../components/research/OpenEvoWebShopBenchmarkNote.astro');
const seedSplit = read('../components/research/WebShopSeedSplitFigure.astro');
const goalGeneration = read('../components/research/WebShopGoalGenerationFigure.astro');
const evaluation = read('../components/research/WebShopEvaluationFigure.astro');

describe('reader-facing minimum reasoning bridge', () => {
  it('is discoverable from the root and routed to one research-writing owner', () => {
    expect(rootAgents).toContain('Reader-facing reasoning invariant');
    expect(rootAgents).toContain('你为什么这样说？');
    expect(rootAgents).toContain('what we observed');
    expect(rootAgents).toContain('research-editorial-style.md');
    expect(agentReadme).toContain('## Task router');
    expect(agentReadme).toContain('observation → supported inference → boundary');
    expect(editorial).toContain('Minimum reasoning bridge — visible by default');
    expect(editorial).toContain('Progressive disclosure is for depth, not for repairing the argument');
    expect(localResearchAgents).toContain('## Minimum reasoning bridge');
  });

  it('keeps LATEST as state handoff instead of a competing reading-order owner', () => {
    expect(latest).toContain('Last updated: **2026-08-26**');
    expect(latest).toContain('## Reading-order authority');
    expect(latest).not.toContain('## Agent reading order');
    expect(latest).toContain('current/research-editorial-style.md');
  });

  it('makes overview and setup judgements explain their first-layer why', () => {
    expect(hub).toContain('单一分数不能区分模型能力、动作解析、运行环境和策略行为等原因');
    expect(hub).toContain('模型、环境和评测协议如果同时变化');
    expect(detail).toContain('同一个模型名不能唯一确定实验状态');
    expect(detail).toContain('不能把差异简化成“参数 vs memory”');
    expect(modelGuide).toContain('是否饱和必须由 baseline 运行确认');
    expect(modelGuide).toContain('单个 reward 既不能说明结果是否稳定');
  });

  it('keeps the current held-out status and the reason for a parser-only rerun visible', () => {
    for (const source of [gateway, nextProtocol, benchmarkNote]) {
      expect(source).toContain('2026-08-25');
      expect(source).toContain('512 episodes');
      expect(source).toContain('测量无效');
      expect(source).toContain('同一批 128');
      expect(source).toContain('parser');
      expect(source).toContain('256 episodes');
    }
    expect(nextProtocol).not.toContain('正式比较没有启动');
    expect(benchmarkNote).toContain('H1.30');
    expect(benchmarkNote).toContain('历史边界');
    expect(benchmarkNote).toContain('不能再把 H1.30 当成“现在仍未运行”的证据');
  });

  it('does not force reasoning scaffolding onto canonical facts that already expose evidence and boundary', () => {
    expect(seedSplit).toContain('目前没有公开证据确定这 128 个 goal ID');
    expect(seedSplit).toContain('因此不画出确定的抽样关系');
    expect(goalGeneration).toContain('两个数字数的是不同对象');
    expect(evaluation).toContain('一个中间 task_score 表示任务被部分满足，但它不等于 exact success');
  });
});
