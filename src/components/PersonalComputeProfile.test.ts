import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const component = readFileSync(new URL('./PersonalComputeProfile.astro', import.meta.url), 'utf8');
const zhPage = readFileSync(new URL('../pages/lab.astro', import.meta.url), 'utf8');
const enPage = readFileSync(new URL('../pages/en/lab.astro', import.meta.url), 'utf8');
const policy = readFileSync(new URL('../../docs/agents/current/personal-compute-profile-consumer.md', import.meta.url), 'utf8');
const agents = readFileSync(new URL('../../AGENTS.md', import.meta.url), 'utf8');

const publicSurface = [component, zhPage, enPage, policy, agents].join('\n');

describe('public lab topology privacy boundary', () => {
  it('keeps the lab routes generic and bilingual', () => {
    expect(component).toContain('data-public-lab-topology');
    expect(zhPage).toContain('<PersonalComputeProfile locale="zh" />');
    expect(enPage).toContain('<PersonalComputeProfile locale="en" />');
    expect(component).toContain('Public boundary');
  });

  it('does not reconnect the former personal device profile', () => {
    for (const forbidden of [
      'fuhuo_20260419',
      'personal-compute-profile.js',
      '__MYKCS_PERSONAL_COMPUTE_PROFILE__',
      'MacBook Pro M4',
      'iPhone',
      'iPad',
      '4×RTX 3090',
    ]) expect(publicSurface).not.toContain(forbidden);
  });

  it('protects identifying infrastructure details', () => {
    expect(policy).toContain('must not publish or dynamically load the owner');
    expect(policy).toContain('IP addresses, hostnames, usernames');
    expect(policy).toContain('minimum scientifically relevant aggregate specification');
    expect(agents).toContain('generic public topology');
  });
});
