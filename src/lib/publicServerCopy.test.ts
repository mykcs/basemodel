import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const guide = read('src/components/OpenEvoSeedBenchmarksGuide.astro');
const labZh = read('src/pages/lab.astro');
const labEn = read('src/pages/en/lab.astro');
const serverExplainer = read('src/components/research/explainer/ServerExplainer.tsx');
const staticServerDiagram = read('src/components/research/ServerAuthorityDiagram.astro');
const experimentProgram = read('src/components/research/OpenEvoExperimentProgram.astro');
const publicOwners = [guide, labZh, labEn, serverExplainer, staticServerDiagram, experimentProgram];

const forbidden = [
  'dev-wangr',
  'wangr-dev',
  'dev-guozy',
  'dev-huzh',
  '/data/home/wangr',
  'ssh wangrui_user',
  'ssh wangrui_root',
  '浙江大学',
  'ZJU',
  'zju-server',
  'CompLifeLab-ZJU',
] as const;

describe('public server copy', () => {
  it('does not publish private machine or account identifiers on rendered or reusable public owners', () => {
    for (const source of publicOwners) {
      for (const value of forbidden) expect(source).not.toContain(value);
    }
  });

  it('uses transferable role placeholders in the public reproduction runbook', () => {
    for (const placeholder of ['<ordinary-account>', '<approved-control-account>', '<approved-persistent-workspace>', '<lab-infrastructure-checkout>']) {
      expect(guide).toContain(placeholder);
    }
    expect(guide).toContain('真实服务器身份和路径回实验室私有运行文档解析');
    expect(guide).toContain('resolve real server identities and paths from the private laboratory runbook');
  });

  it('uses neutral laboratory naming and explains the 436 GiB provenance before the conclusion', () => {
    expect(labZh).toContain('实验室 GPU Server');
    expect(labZh).toContain('同一个容器里报告出来的三个入口');
    expect(labZh).toContain('不同 backing device 的容量');
    expect(labZh).not.toContain('OWNED vs VISIBLE');
    expect(labEn).not.toContain('OWNED vs VISIBLE');
    expect(staticServerDiagram).toContain('实验室服务器权限模型');
  });

  it('keeps server authority diagrams descriptive rather than identifying sibling users', () => {
    expect(serverExplainer).toContain('User A · User B · …');
    expect(serverExplainer).toContain('technical capability ≠ authorization scope');
    expect(serverExplainer).toContain('container root ≠ physical-host root');
    expect(staticServerDiagram).toContain('User A');
    expect(staticServerDiagram).toContain('User B');
    expect(staticServerDiagram).toContain('approved control container');
    expect(staticServerDiagram).toContain('approved persistent workspace');
  });

  it('keeps code blocks content-height-driven instead of equal-height filler panels', () => {
    expect(guide).toContain('.gate-copy pre{min-height:0!important;height:auto!important');
    expect(guide).not.toMatch(/\.gate-copy pre\{[^}]*min-height:\s*(?:1\d{2}|[2-9]\d)px/i);
  });

  it('routes scientific state away from public server identifiers', () => {
    expect(guide).toContain('actual branch → current-campaign → reconciliation/result');
    expect(guide).toContain('Phase G / H0 are historical evidence');
    expect(guide).not.toContain('当前下一步是 Phase H0');
    expect(guide).not.toContain('the next gate is Phase H0');
  });
});
