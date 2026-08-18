import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const guide = read('src/components/OpenEvoSeedBenchmarksGuide.astro');
const labZh = read('src/pages/lab.astro');
const labEn = read('src/pages/en/lab.astro');
const serverExplainer = read('src/components/research/explainer/ServerExplainer.tsx');
const publicOwners = [guide, labZh, labEn, serverExplainer];

const forbidden = [
  'dev-wangr',
  'wangr-dev',
  'dev-guozy',
  'dev-huzh',
  '/data/home/wangr',
  'ssh wangrui_user',
  'ssh wangrui_root',
] as const;

describe('public server copy', () => {
  it('does not publish private machine or account identifiers on rendered public owners', () => {
    for (const source of publicOwners) {
      for (const value of forbidden) expect(source).not.toContain(value);
    }
  });

  it('uses transferable role placeholders in the public reproduction runbook', () => {
    for (const placeholder of ['<ordinary-account>', '<approved-control-account>', '<approved-persistent-workspace>', '<zju-server-checkout>']) {
      expect(guide).toContain(placeholder);
    }
    expect(guide).toContain('真实服务器身份和路径回 zju-server 当前运行文档解析');
    expect(guide).toContain('resolve real server identities and paths from the current zju-server runbook');
  });

  it('keeps the public server authority model descriptive rather than identifying sibling users', () => {
    expect(serverExplainer).toContain('User A · User B · …');
    expect(serverExplainer).toContain('technical capability ≠ authorization scope');
    expect(serverExplainer).toContain('container root ≠ physical-host root');
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
