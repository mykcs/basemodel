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

  it('keeps current capacity separate from the compact owner-first attribution bar', () => {
    for (const label of ['我', '用户一', '用户二', '用户三', '用户四', '用户五', '用户六']) expect(serverOverview).toContain(label);
    for (const value of ['65.8 GiB', '15.1%', '107.8 GiB', '22.2 GiB', '15.3 GiB', '7.81 GiB', '3.14 GiB']) expect(serverOverview).toContain(value);
    for (const value of ['397.3 GiB', '16.5 GiB', '97%']) expect(serverOverview).toContain(value);
    expect(serverOverview).toContain('2026-09-04 13:46 (UTC+8)');
    expect(serverOverview).toContain('2026-09-03 01:11 (UTC+8)');
    expect(serverOverview).toContain('data-storage-responsibility-view="owner-relative-historical-v2"');
    expect(serverOverview).toContain('storage-attribution-owner');
    expect(serverOverview).toContain("tone: 'mine'");
    expect(serverOverview.indexOf("label: t('我', 'Me')")).toBeLessThan(serverOverview.indexOf("label: t('用户一', 'User 1')"));
    expect(serverOverview).not.toContain('storage-legend');
    expect(serverOverview).not.toContain('legend-swatch');
    expect(serverOverview).not.toContain('用户七');
    expect(serverOverview).not.toContain('User 7');
    expect(serverOverview).not.toContain('各用户磁盘占用');
    expect(serverOverview).not.toContain('Disk usage by account');
    expect(serverOverview).not.toContain('storage-table');
    expect(serverOverview).toContain('19.0 GiB');
    expect(serverOverview).toContain('147.7 GiB');
    expect(serverOverview).toContain('其余用户按可归属容量从大到小');
    expect(serverOverview).toContain('remaining users are sorted by attributable usage');
    expect(serverOverview).not.toContain('我们的账户');
    expect(serverOverview).not.toContain('我们的主目录');
    expect(serverOverview).not.toContain('Our home directory');
    expect(serverOverview).not.toMatch(/\/data\/home\//);
    expect(serverOverview).not.toMatch(/dev-[a-z0-9_-]+/i);
    expect(serverRouteZh).toContain('2026-09-04 实验服务器容量与硬件快照');
    expect(serverRouteEn).toContain('2026-09-04 server capacity and hardware snapshot');
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

  it('ships a copyable end-to-end artifact governance, publication, and reclaim prompt', () => {
    expect(serverOverview).toContain('整理、上传与清理服务器空间');
    expect(serverOverview).toContain('data-copy-label');
    expect(serverOverview).toContain('server-artifact-governance-and-reclaim-sop.md');
    expect(serverOverview).toContain('Run Manifest');
    expect(serverOverview).toContain('Hugging Face');
    expect(serverOverview).toContain('GHCR');
    expect(serverOverview).toContain('名字看起来像我们的”一律不算证据');
    expect(serverOverview).toContain('zero ownership evidence');
    expect(serverOverview).toContain('NOT_AUTHORIZED');
    expect(serverOverview).toContain('exact-head Preview');
    expect(serverOverview).toContain('未知删除清单不被这条 Prompt 预授权');
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
