import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');
const server = read('../components/research/Lyg2171ServerOverview.astro');
const closeout = read('../styles/visual-closeout.css');

describe('content-first server operations pilot', () => {
  it('makes the dated operational state the first subject without hiding deletion authority', () => {
    expect(server).toContain('实验文件磁盘：约 1.09 TB 可用');
    expect(server).toContain('容量快照 · 2026-09-15 22:10（UTC+8）· 可用约 1.09 TB（0.99 TiB，是同一容量的两种单位写法）· 非实时数据');
    expect(server).toContain('NOT_AUTHORIZED');
    expect(server).toContain('当前空间充足，不需要紧急扩容；删除仍未授权');
    expect(server).toContain('按例行维护顺序继续');
    expect(server).toContain('先只读检查，再归档并验证恢复；这里不会直接删除文件');
    expect(server).toContain('远端已有副本，也不能自动删服务器文件');
    expect(server).toContain('删服务器文件和把私有归档改成公开，是两件事');
    expect(server).toContain('两种动作必须分别批准');
    expect(server).toContain('还没合并的草稿，不能当正式规则');
    expect(server).toContain('删除仍未授权');
    expect(server).toContain('对象 / 服务器负责人仍要批准同一版精确回收清单');
    expect(server).toContain('例行服务器维护');
    expect(server).toContain('df（查看文件系统容量的系统命令）');
    expect(server).toContain('约 1.09 TB；TiB 与 TB 是两种容量单位');
    expect(server).toContain('文件数量容量（inode，文件系统能记录多少个文件）');
    expect(server).toContain('正式归档版本（恢复时默认认的那一份）');
    expect(server).toContain('具体归档对象、负责人、预计释放量和完成状态只来自本次维护的现场扫描');
  });

  it('shows the full maintenance path immediately after the primary operational owner', () => {
    const heroEnd = server.indexOf('</header>');
    const routine = server.indexOf('<aside class="routine-entry"');
    const switchboard = server.indexOf('<nav class="operation-switchboard"');
    const health = server.indexOf('<section class="server-section" id="health-scan">');
    expect(heroEnd).toBeGreaterThan(-1);
    expect(routine).toBeGreaterThan(heroEnd);
    expect(switchboard).toBeGreaterThan(routine);
    expect(health).toBeGreaterThan(switchboard);
    expect(server).not.toContain('#health-scan{margin-top:clamp(8rem,20vh,11rem)}');
    expect(server).not.toContain('#health-scan{margin-top:calc(20vh + 2rem)}');
  });

  it('retires the legacy full-height server hero without changing the lab owner', () => {
    expect(closeout).not.toContain("body[data-reader-contract-id='flow-server'] .server-hero");
    expect(closeout).toContain("body[data-reader-contract-id='lab'] .lab-intro");
    expect(closeout).toContain('min-height: calc(100svh');
  });
});
