import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const component = readFileSync(new URL('./PersonalComputeProfile.astro', import.meta.url), 'utf8');
const zhPage = readFileSync(new URL('../pages/lab.astro', import.meta.url), 'utf8');
const enPage = readFileSync(new URL('../pages/en/lab.astro', import.meta.url), 'utf8');
const policy = readFileSync(new URL('../../docs/agents/current/personal-compute-profile-consumer.md', import.meta.url), 'utf8');

describe('personal compute profile consumer', () => {
  it('uses the fuhuo public endpoint as the only editable data source', () => {
    const endpoint = 'https://mykcs.github.io/fuhuo_20260419/shared/personal-compute-profile.js';
    expect(component).toContain(endpoint);
    expect(policy).toContain(endpoint);
    expect(policy).toContain('must not keep a second editable object');
  });

  it('mounts equivalent Chinese and English routes', () => {
    expect(zhPage).toContain('<PersonalComputeProfile locale="zh" />');
    expect(enPage).toContain('<PersonalComputeProfile locale="en" />');
  });

  it('fails honestly instead of embedding a duplicated device inventory', () => {
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

  it('shows ownership and source state to the reader', () => {
    expect(component).toContain('data-profile-status');
    expect(component).toContain('查看唯一源文件');
    expect(component).toContain('Single-source boundary');
    expect(component).toContain('updatedAt');
  });
});
