import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parseLsRemote, VERCEL_FINAL_BASE_REF, VERCEL_FINAL_GATE_REF } from '../../scripts/vercel-git-range.mjs';
import { planHostedUi } from '../../scripts/vercel-ui-plan';

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');

describe('persistent Vercel final-gate range', () => {
  it('uses one non-deploy base identity beside the persistent final trigger', () => {
    expect(VERCEL_FINAL_GATE_REF).toBe('ci/vercel-gate-final');
    expect(VERCEL_FINAL_BASE_REF).toBe('ci/vercel-gate-base');
    const range = read('scripts/vercel-git-range.mjs');
    expect(range).toContain("ls-remote', 'origin', ref");
    expect(range).toContain("const liveMainRef = 'refs/heads/main'");
    expect(range).toContain('persistent gate base is stale');
    expect(range).toContain("'fetch', '--no-tags', '--depth=1'");
  });

  it('parses exact ls-remote identity and rejects missing refs', () => {
    const sha = 'a'.repeat(40);
    expect(parseLsRemote(`${sha}\trefs/heads/main\n`, 'refs/heads/main')).toBe(sha);
    expect(() => parseLsRemote('', 'refs/heads/main')).toThrow(/could not resolve remote ref/);
  });

  it('keeps docs-only final candidates out of the Chromium layer once the correct base range is known', () => {
    const plan = planHostedUi(['AGENTS.md', 'docs/agents/current/deployment-policy.md']);
    expect(plan.mode).toBe('skip');
    expect(plan.risk).toBe('none');
  });

  it('arms base before final and refuses to cancel another pending Vercel gate', () => {
    const request = read('scripts/request-vercel-final-gate.mjs');
    expect(request).toContain('another Vercel final gate is still pending');
    expect(request.indexOf('updateRef(VERCEL_FINAL_BASE_REF')).toBeLessThan(request.indexOf('updateRef(VERCEL_FINAL_GATE_REF'));
    expect(request).toContain('PR/main identity moved while arming');
    expect(request).toContain('must already exist; do not create a fresh final alias');
  });
});
