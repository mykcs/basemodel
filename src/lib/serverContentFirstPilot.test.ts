import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');
const server = read('../components/research/Lyg2171ServerOverview.astro');
const closeout = read('../styles/visual-closeout.css');

describe('content-first server operations pilot', () => {
  it('makes the dated operational state the first subject without hiding deletion authority', () => {
    expect(server).toContain('保存时刻 · 2026-09-15 22:10（UTC+8）');
    expect(server).toContain('2026-09-15 的非实时容量快照：实验文件磁盘约 0.99 TiB 可用');
    expect(server).toContain('NOT_AUTHORIZED');
    expect(server).toContain('2026-09-15 的非实时容量快照：实验文件磁盘约 0.99 TiB 可用');
    expect(server).toContain('保存时刻，2.0 TiB 持久文件系统已用约 51%');
    expect(server).toContain('只读健康扫描（只检查，不改文件）');
    expect(server).toContain('具体文件（回收清单）');
    expect(server).toContain('复制例行维护指令 →');
    expect(server).toContain('href="#routine-maintenance"');
    expect(server).toContain('下一步：');
    expect(server).toContain('把已封存资产复制到已授权远端（归档），再重新读取或只加载最小必要部分确认备份真的能恢复');
    expect(server).toContain('只列出准备释放空间的具体文件（回收清单）');
    expect(server).toContain('远端已有副本，也不能自动删服务器文件');
    expect(server).toContain('删服务器文件和把私有归档改成公开，是两件事');
    expect(server).toContain('必须分别批准');
    expect(server).toContain('模型参数保存点（checkpoint）');
    expect(server).not.toContain('server-hero__guardrails');
    expect(server).toContain('还没合并的草稿，不能当正式规则');
    expect(server).toContain('归档和“回收清单”都不等于删除；删除仍未授权');
    expect(server).toContain('批准人是对象 / 服务器负责人：必须在当前 zju-server 删除安全规则下明确批准同一版精确清单');
    expect(server).toContain('删除前还要核对同一版精确回收清单和当前是否仍被使用');
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
