import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');
const serverOverview = read('../components/research/Lyg2171ServerOverview.astro');
const serverRouteZh = read('../pages/research/seed-openevo/flow/server.astro');
const serverRouteEn = read('../../docs/archive/site-en/src/pages/en/research/seed-openevo/flow/server.astro.archive');
const guide = read('../components/OpenEvoSeedBenchmarksGuide.astro');
const labZh = read('../pages/lab.astro');
const labEn = read('../../docs/archive/site-en/src/pages/en/lab.astro.archive');
const serverExplainer = read('../components/research/explainer/ServerExplainer.tsx');
const staticServerDiagram = read('../components/research/ServerAuthorityDiagram.astro');

describe('public server copy', () => {
  it('keeps the server lifecycle page public-safe and distinguishes current from historical storage facts', () => {
    expect(serverOverview).toContain('2026-09-15 容量快照：实验文件磁盘约 0.99 TiB 可用');
    expect(serverOverview).toContain('约 1.09 TB；TiB 与 TB 是两种容量单位');
    expect(serverOverview).toContain('0.99 TiB');
    expect(serverOverview).toContain('320.9 GiB');
    expect(serverOverview).toContain('304.66 GiB');
    expect(serverOverview).toContain('131');
    expect(serverOverview).toContain('1.69 GiB');
    expect(serverOverview).toContain('delete_authorized=false');
    expect(serverOverview).toContain('例行服务器维护');
    expect(serverOverview).not.toContain('class="server-hero__facts research-fact-band"');
    expect(serverOverview).not.toContain('server-hero__guardrails');
    expect(serverOverview).toContain('server-hero__safety');
    expect(serverOverview).toContain('三个边界始终不变');
    expect(serverOverview).toContain('复制例行维护指令 →');
    expect(serverOverview).toContain('href="#routine-maintenance"');
    expect(serverOverview).toContain('NOT_AUTHORIZED');
    expect(serverOverview.indexOf('</header>')).toBeLessThan(serverOverview.indexOf('<nav class="operation-switchboard"'));
    expect(serverOverview).toContain('这段 Prompt 只负责启动，不固定 Passport 版本');
    expect(serverOverview).toContain('EXPERIMENT_PASSPORT_REGISTRY_IMPLEMENTATION_PLAN_202609111800.md');
    expect(serverOverview).toContain('open Draft PR 只能用于发现重叠或待合入能力');
    expect(serverOverview).toContain('未合并 Draft 不会自己升级成全项目标准');
    expect(serverOverview).toContain('experiment_id + passport_sha256');
    expect(serverOverview).toContain('服务器健康扫描');
    expect(serverOverview).toContain('实验收尾归档');
    expect(serverOverview).toContain('空间回收提案');
    expect(serverOverview).toContain('docs/agents/current/server-storage-pressure-audit-sop.md');
    expect(serverOverview).toContain('docs/agents/current/server-artifact-governance-and-reclaim-sop.md');
    expect(serverOverview).toContain('Hugging Face 私有空间不足时必须停止并告诉我');
    expect(serverOverview).toContain('不能为了省空间自动把数据公开');
    expect(serverOverview).toContain('2026-09-03 01:11');
    expect(serverOverview).toContain('它不是 2026-09-15 的当前排名');
    expect(serverOverview).not.toContain('我固定在最前');
    expect(serverOverview).not.toContain('Me is pinned first');
    expect(serverOverview).not.toContain('我们的账户');
    expect(serverOverview).not.toContain('我们的主目录');
    expect(serverOverview).not.toContain('Our home directory');
    expect(serverOverview).not.toMatch(/\/data\/home\//);
    expect(serverOverview).not.toMatch(/dev-[a-z0-9_-]+/i);
    expect(serverRouteZh).toContain('2026-09-15 22:10（UTC+8）服务器静态快照');
    expect(serverRouteZh).toContain('0.99 TiB');
    // Archived English is historical source evidence and must not be rewritten just to mirror current Chinese runtime state.
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
