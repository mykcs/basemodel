import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');
const server = read('../components/research/Lyg2171ServerOverview.astro');
const closeout = read('../styles/visual-closeout.css');

describe('content-first server operations pilot', () => {
  it('makes the dated operational state the first subject without hiding deletion authority', () => {
    expect(server).toContain('实验文件磁盘：约 1.09 TB 可用');
    expect(server).toContain('容量快照 · 2026-09-15 22:10（UTC+8）· 0.99 TiB 与 1.09 TB 是同一可用容量 · 非实时数据');
    expect(server).toContain('NOT_AUTHORIZED');
    expect(server).toContain('当前空间充足，不需要紧急扩容；删除仍未授权');
    expect(server).toContain('只读健康扫描');
    expect(server).toContain('只检查，不修改，不删除。');
    expect(server).toContain('远端可恢复 ≠ 本地可删除。');
    expect(server).toContain('删除 ≠ 改公开可见性。');
    expect(server).toContain('必须分别批准');
    expect(server).toContain('未合并草稿不能替代当前已合并或被实验明确采用的正式规则');
    expect(server).toContain('删除仍未授权');
    expect(server).toContain('对象 / 服务器负责人仍要批准同一版精确回收清单');
    expect(server).toContain('例行服务器维护');
    expect(server).toContain('df（查看文件系统容量的系统命令）');
    expect(server).toContain('约 1.09 TB；TiB 与 TB 是两种容量单位');
    expect(server).toContain('文件数量容量（inode，文件系统能记录多少个文件）');
    expect(server).toContain('正式归档版本（恢复时默认认的那一份）');
    expect(server).toContain('具体归档对象、负责人、预计释放量和完成状态只来自本次维护的现场扫描');
  });

  it('keeps optional one-stage navigation after the primary operational owner', () => {
    const heroEnd = server.indexOf('</header>');
    const switchboard = server.indexOf('<nav class="operation-switchboard"');
    const health = server.indexOf('<section class="server-section" id="health-scan">');
    expect(heroEnd).toBeGreaterThan(-1);
    expect(switchboard).toBeGreaterThan(heroEnd);
    expect(health).toBeGreaterThan(heroEnd);
    expect(switchboard).toBeGreaterThan(health);
    const routine = server.indexOf('<aside class="routine-entry"');
    expect(routine).toBeGreaterThan(switchboard);
  });

  it('retires the legacy full-height server hero without changing the lab owner', () => {
    expect(closeout).not.toContain("body[data-reader-contract-id='flow-server'] .server-hero");
    expect(closeout).toContain("body[data-reader-contract-id='lab'] .lab-intro");
    expect(closeout).toContain('min-height: calc(100svh');
  });
});
