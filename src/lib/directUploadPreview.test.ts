import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const script = readFileSync(new URL('../../scripts/direct-upload-preview.mjs', import.meta.url), 'utf8');
const packageJson = JSON.parse(
  readFileSync(new URL('../../package.json', import.meta.url), 'utf8'),
) as { scripts: Record<string, string> };
const commandDoc = readFileSync(
  new URL('../../docs/agents/current/direct-upload-preview-command.md', import.meta.url),
  'utf8',
);

describe('safe Cloudflare Direct Upload preview command', () => {
  it('exposes one repository command without adding GitHub Actions', () => {
    expect(packageJson.scripts['preview:cloudflare']).toBe(
      'node scripts/direct-upload-preview.mjs',
    );
    expect(script).not.toContain('github-actions');
  });

  it('requires automation credentials without embedding them in arguments', () => {
    expect(script).toContain('CLOUDFLARE_API_TOKEN');
    expect(script).toContain('CLOUDFLARE_ACCOUNT_ID');
    expect(script).not.toMatch(/--api-token/i);
    expect(script).not.toMatch(/--account-id/i);
  });

  it('builds locally with preview noindex semantics before upload', () => {
    expect(script).toContain("run('npm', ['run', 'build:cloudflare']");
    expect(script).toContain("PUBLIC_SEARCH_INDEXING: 'disabled'");
    expect(script).toContain('robots noindex');
    expect(script.indexOf("run('npm', ['run', 'build:cloudflare']")).toBeLessThan(
      script.indexOf("'pages',\n    'deploy'"),
    );
  });

  it('forces a generated non-production branch and attaches Git provenance', () => {
    expect(script).toContain("const PROJECT_NAME = 'basemodel'");
    expect(script).toContain("const PRODUCTION_BRANCH = 'main'");
    expect(script).toContain('agent-preview-');
    expect(script).toContain('--branch=${previewBranch}');
    expect(script).toContain('--commit-hash=${sha}');
    expect(script).toContain('working tree is dirty');
    expect(script).toContain('--commit-dirty=true');
  });

  it('uses Wrangler v4 Direct Upload and returns machine-readable URLs', () => {
    expect(script).toContain("prefixArgs: ['--yes', 'wrangler@4']");
    expect(script).toContain('DIRECT_UPLOAD_PREVIEW_URL=');
    expect(script).toContain('DIRECT_UPLOAD_BRANCH_URL=');
    expect(script).toContain('DIRECT_UPLOAD_MODE=wrangler-pages-direct-upload');
  });

  it('documents the one-command credential and production-safety contract', () => {
    expect(commandDoc).toContain('npm run preview:cloudflare');
    expect(commandDoc).toContain('Account → Cloudflare Pages → Edit');
    expect(commandDoc).toContain('Never commit');
    expect(commandDoc).toContain('Production');
    expect(commandDoc).toContain('DIRECT_UPLOAD_PREVIEW_URL');
  });
});
