import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const component = readFileSync(new URL('./PersonalComputeProfile.astro', import.meta.url), 'utf8');
const zhPage = readFileSync(new URL('../pages/lab.astro', import.meta.url), 'utf8');
const enPage = readFileSync(new URL('../pages/en/lab.astro', import.meta.url), 'utf8');
const policy = readFileSync(new URL('../../docs/agents/current/personal-compute-profile-consumer.md', import.meta.url), 'utf8');
const agents = readFileSync(new URL('../../AGENTS.md', import.meta.url), 'utf8');

describe('personal compute profile consumer', () => {
  it('uses the fuhuo public endpoint as the only editable legacy personal-profile data source', () => {
    const endpoint = 'https://mykcs.github.io/fuhuo_20260419/shared/personal-compute-profile.js';
    expect(component).toContain(endpoint);
    expect(policy).toContain(endpoint);
    expect(policy).toContain('must not keep a second editable object');
  });

  it('keeps public lab routes server-first while preserving experiment lineage instead of mounting the stale profile', () => {
    expect(zhPage).toContain('实验设备与服务器');
    expect(zhPage).toContain('8×RTX5090 visible · allocation policy unknown');
    expect(zhPage).toContain('5×RTX5090');
    expect(zhPage).toContain('RTX6 · historical');
    expect(zhPage).toContain('4×RTX3090');
    expect(zhPage).toContain('/research/seed-openevo/results/');
    expect(enPage).toContain('Experiment devices and servers');
    expect(enPage).toContain('8×RTX5090 visible · allocation policy unknown');
    expect(enPage).toContain('5×RTX5090');
    expect(enPage).toContain('RTX6 · historical');
    expect(enPage).toContain('4×RTX3090');
    expect(enPage).toContain('/research/seed-openevo/results/');
    expect(zhPage).not.toContain('<PersonalComputeProfile locale="zh" />');
    expect(enPage).not.toContain('<PersonalComputeProfile locale="en" />');
  });

  it('fails honestly instead of embedding a duplicated device inventory in the legacy consumer', () => {
    expect(component).toContain('script.onerror=fail');
    expect(component).toContain('共享档案暂时无法读取');
    expect(component).toContain('does not keep a second device inventory');
    for (const forbidden of ['vramPerGpuGb: 24', 'publicInternet: false', 'codex-remote-ethernet-failure']) expect(component).not.toContain(forbidden);
  });

  it('preserves time-sensitive observation and security boundaries', () => {
    expect(policy).toContain('user-observed time-sensitive outcome');
    expect(policy).toContain('must not become “Codex never works”');
    expect(policy).toContain('server offline');
    expect(policy).toContain('IP addresses, hostnames, usernames');
  });

  it('keeps source ownership visible inside the legacy consumer', () => {
    expect(component).toContain('data-profile-status');
    expect(component).toContain('查看唯一源文件');
    expect(component).toContain('Single-source boundary');
    expect(component).toContain('updatedAt');
  });

  it('is discoverable by future Agents without controlling the current lab route', () => {
    expect(agents).toContain('personal-compute-profile-consumer.md');
    expect(agents).toContain('mykcs/fuhuo_20260419');
    expect(agents).toContain('do not create a second editable device inventory');
  });
});