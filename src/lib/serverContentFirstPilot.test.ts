import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');
const server = read('../components/research/Lyg2171ServerOverview.astro');
const closeout = read('../styles/visual-closeout.css');

describe('content-first server operations pilot', () => {
  it('makes the dated operational state the first subject without hiding deletion authority', () => {
    expect(server).toContain('服务器快照：约 0.99 TiB 可用');
    expect(server).toContain('2026-09-15 静态快照');
    expect(server).toContain('NOT_AUTHORIZED');
    expect(server).toContain('远端已经能恢复，也不等于本地可以删除');
    expect(server).toContain('例行服务器维护');
  });

  it('keeps optional one-stage navigation after the primary operational owner', () => {
    const heroEnd = server.indexOf('</header>');
    const switchboard = server.indexOf('<nav class="operation-switchboard"');
    const health = server.indexOf('<section class="server-section" id="health-scan">');
    expect(heroEnd).toBeGreaterThan(-1);
    expect(switchboard).toBeGreaterThan(heroEnd);
    expect(health).toBeGreaterThan(switchboard);
  });

  it('retires the legacy full-height server hero without changing the lab owner', () => {
    expect(closeout).not.toContain("body[data-reader-contract-id='flow-server'] .server-hero");
    expect(closeout).toContain("body[data-reader-contract-id='lab'] .lab-intro");
    expect(closeout).toContain('min-height: calc(100svh');
  });
});
