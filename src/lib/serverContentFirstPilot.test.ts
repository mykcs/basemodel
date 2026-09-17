import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');
const server = read('../components/research/Lyg2171ServerOverview.astro');
const closeout = read('../styles/visual-closeout.css');

describe('content-first server operations pilot', () => {
  it('makes the dated operational state the first subject without hiding deletion authority', () => {
    expect(server).toContain('容量快照（某一时刻保存的状态）· 2026-09-15 22:10（UTC+8）· 非实时数据');
    expect(server).toContain('实验文件磁盘：约 0.99 TiB 可用');
    expect(server).toContain('NOT_AUTHORIZED');
    expect(server).toContain('2.0 TiB 持久文件系统已用约 51%，还剩约 0.99 TiB');
    expect(server).toContain('复制例行维护指令 →');
    expect(server).toContain('href="#routine-maintenance"');
    expect(server).toContain('例行维护顺序：');
    expect(server).toContain('重新读取或最小加载确认真的能恢复');
    expect(server).toContain('最后只生成精确回收清单（明确列出准备回收的具体文件）');
    expect(server).toContain('远端已有副本，也不能自动删服务器文件。');
    expect(server).toContain('删服务器文件和把私有归档改成公开，是两件事。');
    expect(server).toContain('必须分别批准');
    expect(server).toContain('真正执行时，只认当前已合并或被实验明确采用的正式规则');
    expect(server).toContain('归档和“回收清单”都不等于删除；删除仍未授权');
    expect(server).toContain('对象 / 服务器负责人仍要批准同一版精确回收清单');
    expect(server).toContain('例行服务器维护');
    expect(server).toContain('df（查看文件系统容量的系统命令）');
    expect(server).toContain('约 1.09 TB；TiB 与 TB 是两种容量单位');
    expect(server).toContain('文件数量容量（inode，文件系统能记录多少个文件）');
    expect(server).toContain('正式归档版本（恢复时默认认的那一份）');
    expect(server).toContain('具体归档对象、负责人、预计释放量和完成状态只来自本次维护的现场扫描');
    expect(server).not.toContain('#health-scan{margin-top:9.25rem}');
    expect(server).toContain('给科研产物补实验身份证，并验证远端确实能恢复');
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
