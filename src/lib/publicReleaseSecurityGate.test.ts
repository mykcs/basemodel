import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const root = new URL('../../', import.meta.url);
const gitignoreFile = new URL('.gitignore', root);
const gitignore = existsSync(gitignoreFile) ? readFileSync(gitignoreFile, 'utf8') : null;
const hosting = readFileSync(new URL('docs/agents/current/hosting-architecture.md', root), 'utf8');
const vercel = readFileSync(new URL('docs/agents/current/vercel-preview-migration-plan.md', root), 'utf8');
const gate = readFileSync(new URL('docs/agents/current/public-release-security-gate.md', root), 'utf8');

describe('public release security gate', () => {
  it('ignores common local secret and provider-state paths', () => {
    // Vercel CLI intentionally omits .gitignore from direct-upload build inputs.
    // Locally, keep the source-of-truth policy test strict; remotely, assert this
    // is that documented Vercel build context rather than silently accepting it.
    if (!gitignore) {
      expect(process.env.VERCEL).toBeTruthy();
      return;
    }

    for (const value of ['.env.*', '.dev.vars', '.vercel/', '.wrangler/', '*.pem', '*.key', '.omc/']) {
      expect(gitignore).toContain(value);
    }
  });

  it('does not persist private Vercel account identifiers in current docs', () => {
    const current = `${hosting}\n${vercel}`;
    expect(current).not.toContain('wangrui92-team');
    expect(current).not.toMatch(/team_[A-Za-z0-9]+/);
    expect(current).not.toMatch(/prj_[A-Za-z0-9]+/);
  });

  it('forbids persisted temporary preview access parameters', () => {
    expect(vercel).toContain('never persist a share URL or `_vercel_share`');
    expect(gate).toContain('Temporary Vercel share URLs are ephemeral delivery artifacts');
  });

  it('keeps the visibility decision fail-closed until all refs and history are scanned', () => {
    expect(gate).toContain('HOLD until every gate below passes');
    expect(gate).toContain('all refs and complete history');
    expect(gate).toContain('ALL_REFS_HISTORY=PASS');
    expect(gate).toContain('PUBLIC_RELEASE_GATE=PASS');
  });
});
