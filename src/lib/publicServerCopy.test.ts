import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const guide = read('src/components/OpenEvoSeedBenchmarksGuide.astro');
const labZh = read('src/pages/lab.astro');
const labEn = read('src/pages/en/lab.astro');
const serverExplainer = read('src/components/research/explainer/ServerExplainer.tsx');
const staticServerDiagram = read('src/components/research/ServerAuthorityDiagram.astro');
const experimentProgram = read('src/components/research/OpenEvoExperimentProgram.astro');
const serverOverview = read('src/components/research/Lyg2171ServerOverview.astro');
const serverRouteZh = read('src/pages/research/seed-openevo/flow/server.astro');
const serverRouteEn = read('src/pages/en/research/seed-openevo/flow/server.astro');
const publicOwners = [guide, labZh, labEn, serverExplainer, staticServerDiagram, experimentProgram, serverOverview, serverRouteZh, serverRouteEn];

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

  it('keeps the public storage snapshot anonymous, dated, and separate from shared Docker attribution', () => {
    for (const label of ['用户一', '用户二', '用户三', '用户四', '用户五', '用户六', '用户七']) expect(serverOverview).toContain(label);
    for (const value of ['107.8 GiB', '65.8 GiB', '22.2 GiB', '15.3 GiB', '7.81 GiB', '3.14 GiB']) expect(serverOverview).toContain(value);
    expect(serverOverview).toContain('2026-09-03 01:11 (UTC+8)');
    expect(serverOverview).toContain('19.0 GiB');
    expect(serverOverview).toContain('147.7 GiB');
    expect(serverOverview).toContain('共享 Docker');
    expect(serverOverview).toContain('shared Docker');
    expect(serverOverview).not.toContain('我们的账户');
    expect(serverOverview).not.toContain('我们的主目录');
    expect(serverOverview).not.toContain('Our home directory');
    expect(serverOverview).not.toMatch(/\/data\/home\//);
    expect(serverOverview).not.toMatch(/dev-[a-z0-9_-]+/i);
    expect(serverRouteZh).toContain('2026-09-03 实验服务器库存与存储快照');
    expect(serverRouteEn).toContain('2026-09-03 server inventory and storage snapshot');
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
