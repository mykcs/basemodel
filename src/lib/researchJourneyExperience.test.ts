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
    for (const label of ['复现 SEED', 'OpenEvo 实验', '相关知识']) expect(header).toContain(label);
    expect(header).toContain('journey-nav');
    expect(header).toContain('mobile-journeys');
    expect(header).toContain('/research/seed-openevo/experiment/');
    expect(header).toContain('resource-menu__panel');
    expect(header).not.toContain('const primaryLinks');
  });

  it('uses semantic HTML to express both benchmark data pipelines', () => {
    expect(trajectory).toContain("id: 'webshop'");
    expect(trajectory).toContain("id: 'alfworld'");
    expect(trajectory).toContain('<details class="trajectory-scenario"');
    expect(trajectory).toContain('<ol class="trajectory-dialogue">');
    expect(trajectory).toContain('trajectory-turn__io');
    expect(trajectory).toContain("t('流入','IN')");
    expect(trajectory).toContain("t('加工','PROCESS')");
    expect(trajectory).toContain("t('流出','OUT')");
    expect(trajectory).toContain('step.code && <code>{step.code}</code>');
    expect(trajectory).toContain('交互示意');
    expect(trajectory).toContain('不是 benchmark 实测结果');
  });

  it('keeps SEED and OpenEvo update objects and activation boundaries explicit', () => {
    expect(trajectory).toContain('更新对象：policy 参数');
    expect(trajectory).toContain('memory / skill / agent-system artifact / revision');
    expect(trajectory).toContain('生效边界：下一次 policy update 后');
    expect(trajectory).toContain('successor revision');
    expect(trajectory).toContain('不要把“反思文本出现了”误判成“框架已经进化”');
  });

  it('adds visible structural pipes, data packet motion, mobile flow, and reduced-motion fallback', () => {
    expect(trajectory).toContain('class="trajectory-pipe"');
    expect(trajectory).toContain('@keyframes trajectory-packet');
    expect(trajectory).toContain('@media(max-width:720px)');
    expect(trajectory).toContain('@media(prefers-reduced-motion:reduce)');
  });

  it('exposes a bilingual OpenEvo experiment gateway and reuses the lab on benchmark pages', () => {
    expect(experimentZh).toContain('OpenEvoExperimentGateway');
    expect(experimentEn).toContain('OpenEvoExperimentGateway');
    expect(gateway).toContain('V0 ↔ O1');
    expect(gateway).toContain('Scientific evidence gates');
    expect(benchmarkZh).toContain('AgentEnvironmentTrajectory');
    expect(benchmarkEn).toContain('AgentEnvironmentTrajectory');
  });

  it('keeps the existing navigation connectors structural', () => {
    expect(header).toContain(".mission-chain li:not(:last-child)::after");
    expect(header).toContain("content: '' !important");
    expect(header).toContain('grid-auto-flow: column');
    expect(header).toContain('scroll-snap-type: inline mandatory');
  });
});
