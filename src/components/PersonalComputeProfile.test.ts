import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const zhPage = readFileSync(new URL('../pages/lab.astro', import.meta.url), 'utf8');
const enPage = readFileSync(new URL('../pages/en/lab.astro', import.meta.url), 'utf8');
const policy = readFileSync(new URL('../../docs/agents/current/personal-compute-profile-consumer.md', import.meta.url), 'utf8');
const agents = readFileSync(new URL('../../AGENTS.md', import.meta.url), 'utf8');
const publicSurface = [zhPage, enPage, policy, agents].join('\n');

describe('public lab topology privacy boundary', () => {
  it('keeps the current lab routes server-first and does not mount the personal profile', () => {
    expect(zhPage).toContain('实验设备与服务器');
    expect(enPage).toContain('Experiment devices and servers');
    expect(zhPage).not.toContain('<PersonalComputeProfile locale="zh" />');
    expect(enPage).not.toContain('<PersonalComputeProfile locale="en" />');
    expect(zhPage).toContain('/research/seed-openevo/study/results/');
    expect(enPage).toContain('/research/seed-openevo/study/results/');
  });

  it('does not reconnect the former personal device profile', () => {
    for (const forbidden of [
      'fuhuo_20260419',
      'personal-compute-profile.js',
      '__MYKCS_PERSONAL_COMPUTE_PROFILE__',
      'MacBook Pro M4',
      'iPhone',
      'iPad',
    ]) expect(publicSurface).not.toContain(forbidden);
  });

  it('protects identifying infrastructure details', () => {
    expect(policy).toContain('must not publish or dynamically load the owner');
    expect(policy).toContain('IP addresses, hostnames, usernames');
    expect(policy).toContain('minimum scientifically relevant aggregate specification');
    expect(agents).toContain('generic public topology');
  });
});
