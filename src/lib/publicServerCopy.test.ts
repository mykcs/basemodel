import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');
const serverOverview = read('../components/research/Lyg2171ServerOverview.astro');
const serverRouteZh = read('../pages/research/seed-openevo/flow/server.astro');
const serverRouteEn = read('../pages/en/research/seed-openevo/flow/server.astro');
const guide = read('../components/OpenEvoSeedBenchmarksGuide.astro');
const labZh = read('../pages/lab.astro');
const labEn = read('../pages/en/lab.astro');
const serverExplainer = read('../components/research/explainer/ServerExplainer.tsx');
const staticServerDiagram = read('../components/research/ServerAuthorityDiagram.astro');

describe('public server copy', () => {
  it('keeps the public server page free of private identifiers while preserving audited capacity facts', () => {
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
    expect(serverRouteZh).toContain('2026-09-05 实验服务器容量与硬件快照');
    expect(serverRouteZh).toContain('16.1 GiB');
    expect(serverRouteEn).toContain('2026-09-05 server capacity and hardware snapshot');
    expect(serverRouteEn).toContain('16.1 GiB');
  });

  it('uses transferable role placeholders in the public reproduction runbook', () => {
    for (const placeholder of ['<ordinary-account>', '<approved-control-account>', '<approved-persistent-workspace>', '<lab-infrastructure-checkout>']) {
      expect(guide).toContain(placeholder);
    }
    expect(guide).toContain('真实 SSH 身份、hostname、端口和项目路径只从实验室私有运行文档解析');
    expect(guide).toContain('Resolve real SSH identities, hostnames, ports, and project paths only from the private laboratory runbook');
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
  });
});
