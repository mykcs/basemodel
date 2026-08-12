import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');

const header = read('../components/Header.astro');
const trajectory = read('../components/research/AgentEnvironmentTrajectory.astro');
const gateway = read('../components/research/OpenEvoExperimentGateway.astro');
const benchmarkZh = read('../pages/research/seed-openevo/benchmarks.astro');
const benchmarkEn = read('../pages/en/research/seed-openevo/benchmarks.astro');
const experimentZh = read('../pages/research/seed-openevo/experiment.astro');
const experimentEn = read('../pages/en/research/seed-openevo/experiment.astro');

describe('three-journey research experience', () => {
  it('turns the global navigation into the three enduring user goals', () => {
    for (const label of ['复现 SEED', 'OpenEvo 实验', '相关知识']) {
      expect(header).toContain(label);
    }
    expect(header).toContain('journey-nav');
    expect(header).toContain('mobile-journeys');
    expect(header).toContain('/research/seed-openevo/experiment/');
    expect(header).toContain('resource-menu__panel');
    expect(header).not.toContain('const primaryLinks');
  });

  it('uses semantic HTML to express both benchmark interactions', () => {
    expect(trajectory).toContain("id: 'webshop'");
    expect(trajectory).toContain("id: 'alfworld'");
    expect(trajectory).toContain('<details class="trajectory-scenario"');
    expect(trajectory).toContain('<ol class="trajectory-dialogue">');
    expect(trajectory).toContain('<code>{turn.code}</code>');
    expect(trajectory).toContain('交互示意');
    expect(trajectory).toContain('不是 benchmark 实测结果');
  });

  it('keeps SEED and OpenEvo update objects and activation boundaries explicit', () => {
    expect(trajectory).toContain('更新对象：policy 参数');
    expect(trajectory).toContain('memory / skill / agent-system artifact / revision');
    expect(trajectory).toContain('生效边界：下一次 policy update 后');
    expect(trajectory).toContain('successor revision');
    expect(trajectory).toContain('比较 SEED 更新模型参数与 OpenEvo 更新外部载体');
    expect(trajectory).not.toContain('把框架与基准讲成一场可追踪的对话');
    expect(trajectory).not.toContain('不要把“反思文本出现了”误判成“框架已经进化”');
  });

  it('exposes a bilingual OpenEvo experiment gateway and reuses the interaction view on benchmark pages', () => {
    expect(experimentZh).toContain('OpenEvoExperimentGateway');
    expect(experimentEn).toContain('OpenEvoExperimentGateway');
    expect(gateway).toContain('运行 OpenEvo 的 WebShop 与 ALFWorld 实验');
    expect(gateway).toContain('Run OpenEvo experiments on WebShop and ALFWorld');
    expect(gateway).toContain('V0 ↔ O1');
    expect(gateway).toContain('Scientific evidence gates');
    expect(benchmarkZh).toContain('AgentEnvironmentTrajectory');
    expect(benchmarkEn).toContain('AgentEnvironmentTrajectory');
  });

  it('renders process connectors structurally instead of restoring text-arrow diagrams', () => {
    expect(header).toContain(".mission-chain li:not(:last-child)::after");
    expect(header).toContain("content: '' !important");
    expect(header).toContain('grid-auto-flow: column');
    expect(header).toContain('scroll-snap-type: inline mandatory');
  });
});
