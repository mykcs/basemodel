import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const wrangler = JSON.parse(read('wrangler.jsonc')) as Record<string, unknown>;
const vercel = JSON.parse(read('vercel.json')) as {
  buildCommand?: string;
  ignoreCommand?: string;
  git?: { deploymentEnabled?: Record<string, boolean> };
};
const packageJson = JSON.parse(read('package.json')) as { scripts: Record<string, string> };
const shadowBuild = read('scripts/build-workers-shadow.mjs');
const staticHeaders = read('public/_headers');
const architecture = read('docs/agents/current/hosting-architecture.md');
const latest = read('docs/agents/LATEST.md');

const productionUrl = 'https://basemodel-preview.vercel.app';

describe('hosting architecture ownership', () => {
  it('uses Vercel for both Preview and Production with the repository Gate', () => {
    expect(vercel.buildCommand).toBe('npm run verify:deploy && npm run build');
    expect(vercel.git?.deploymentEnabled?.main).not.toBe(false);
    expect(vercel.ignoreCommand).toContain('wrangler.jsonc');
    expect(architecture).toContain('Vercel Preview + Vercel Production');
    expect(architecture).toContain(productionUrl);
    expect(latest).toContain(productionUrl);
  });

  it('keeps Cloudflare Pages as legacy rollback rather than a release build dependency', () => {
    expect(architecture).toContain('legacy rollback');
    expect(architecture).toContain('Cloudflare Pages Build = 0');
    expect(latest).toContain('Cloudflare Pages Build = 0');
  });

  it('retains a static-only non-production Workers shadow option', () => {
    expect(wrangler.name).toBe('basemodel-workers-shadow');
    expect(wrangler.workers_dev).toBe(true);
    expect(wrangler.preview_urls).toBe(true);
    expect(wrangler).not.toHaveProperty('route');
    expect(wrangler).not.toHaveProperty('routes');
    const assets = wrangler.assets as Record<string, unknown>;
    expect(assets.directory).toBe('./dist');
    expect(assets.not_found_handling).toBe('404-page');
  });

  it('builds the dormant Workers shadow against the current Vercel canonical with noindex', () => {
    expect(packageJson.scripts['build:workers:shadow']).toBe('node scripts/build-workers-shadow.mjs');
    expect(shadowBuild).toContain(`const CURRENT_PRODUCTION_URL = '${productionUrl}'`);
    expect(shadowBuild).toContain("PUBLIC_SEARCH_INDEXING: 'disabled'");
    expect(shadowBuild).toContain("run('npm', ['run', 'verify:deploy'])");
    expect(shadowBuild).toContain('robots noindex');
  });

  it('preserves security headers on the dormant Workers shadow', () => {
    expect(staticHeaders).toContain('https://basemodel-workers-shadow.mykcs01.workers.dev/*');
    expect(staticHeaders).toContain('X-Content-Type-Options: nosniff');
    expect(staticHeaders).toContain('Referrer-Policy: strict-origin-when-cross-origin');
  });
});
