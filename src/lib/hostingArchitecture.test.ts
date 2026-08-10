import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) =>
  readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');

const wrangler = JSON.parse(read('wrangler.jsonc')) as Record<string, unknown>;
const vercel = JSON.parse(read('vercel.json')) as {
  buildCommand?: string;
  ignoreCommand?: string;
  git?: { deploymentEnabled?: Record<string, boolean> };
};
const packageJson = JSON.parse(read('package.json')) as {
  scripts: Record<string, string>;
};
const shadowBuild = read('scripts/build-workers-shadow.mjs');
const staticHeaders = read('public/_headers');
const architecture = read('docs/agents/current/hosting-architecture.md');

describe('hosting architecture shadow migration', () => {
  it('keeps Vercel as non-main Preview with the repository Gate', () => {
    expect(vercel.buildCommand).toBe('npm run verify:deploy && npm run build');
    expect(vercel.git?.deploymentEnabled?.main).toBe(false);
    expect(vercel.ignoreCommand).toContain('wrangler.jsonc');
  });

  it('defines a static-only non-production Workers shadow service', () => {
    expect(wrangler.name).toBe('basemodel-workers-shadow');
    expect(wrangler.compatibility_date).toBe('2026-08-11');
    expect(wrangler.workers_dev).toBe(true);
    expect(wrangler.preview_urls).toBe(true);
    expect(wrangler).not.toHaveProperty('main');
    expect(wrangler).not.toHaveProperty('route');
    expect(wrangler).not.toHaveProperty('routes');

    const assets = wrangler.assets as Record<string, unknown>;
    expect(assets.directory).toBe('./dist');
    expect(assets.not_found_handling).toBe('404-page');
    expect(assets.html_handling).toBe('auto-trailing-slash');
  });

  it('builds the shadow artifact with current Production identity and noindex', () => {
    expect(packageJson.scripts['build:workers:shadow']).toBe(
      'node scripts/build-workers-shadow.mjs',
    );
    expect(shadowBuild).toContain("const CURRENT_PRODUCTION_URL = 'https://basemodel.pages.dev'");
    expect(shadowBuild).toContain("PUBLIC_SEARCH_INDEXING: 'disabled'");
    expect(shadowBuild).toContain("run('npm', ['run', 'verify:deploy'])");
    expect(shadowBuild).toContain("run('npm', ['run', 'build']");
    expect(shadowBuild).toContain('robots noindex');
    expect(shadowBuild).toContain('WORKERS_SHADOW_PRODUCTION_CHANGED=no');
  });

  it('preserves the Production security headers on Workers static assets', () => {
    expect(staticHeaders).toContain('https://basemodel-workers-shadow.mykcs01.workers.dev/*');
    expect(staticHeaders).toContain('X-Content-Type-Options: nosniff');
    expect(staticHeaders).toContain('Referrer-Policy: strict-origin-when-cross-origin');
  });

  it('documents current Pages Production separately from target Workers Production', () => {
    expect(architecture).toContain('Cloudflare Pages remains the real Production host');
    expect(architecture).toContain('Cloudflare Workers Static Assets');
    expect(architecture).toContain('shadow first, cut over later');
    expect(architecture).toContain('A working shadow URL is **not** authorization to change Production');
  });
});
