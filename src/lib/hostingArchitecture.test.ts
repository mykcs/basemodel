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
const vercelIgnoreBuild = read('scripts/vercel-ignore-build.mjs');
const ciUiGate = read('scripts/ci-ui-gate.mjs');
const labPlaywrightConfig = read('tests/e2e/lab-playwright.config.ts');
const macFallbackWorkflow = read('.github/workflows/self-hosted-ci.yml');
const circleCiConfig = read('.circleci/config.yml');
const productionSmoke = read('cloudflare/production-smoke/src/index.js');
const productionSmokeConfig = JSON.parse(read('cloudflare/production-smoke/wrangler.jsonc')) as {
  name?: string; triggers?: { crons?: string[] };
};
const staticHeaders = read('public/_headers');
const architecture = read('docs/agents/current/hosting-architecture.md');
const latest = read('docs/agents/LATEST.md');

const productionUrl = 'https://basemodel-preview.vercel.app';

describe('hosting architecture ownership', () => {
  it('keeps Vercel lightweight and moves browser acceptance to CircleCI', () => {
    expect(vercel.buildCommand).toBe('npm run verify:deploy && npm run build');
    expect(vercel.git?.deploymentEnabled?.main).not.toBe(false);
    expect(vercel.ignoreCommand).toBe('node scripts/vercel-ignore-build.mjs');
    expect(vercelIgnoreBuild).toContain("'wrangler.jsonc'");
    expect(circleCiConfig).toContain('pr_cloud_ci:');
    expect(circleCiConfig).toContain('main_cloud_ci:');
    expect(circleCiConfig).toContain('CI_BROWSER_SHARD_TOTAL: "2"');
    expect(circleCiConfig).toContain('PLAYWRIGHT_WORKERS: "1"');
    expect(circleCiConfig).toContain('mcr.microsoft.com/playwright:v1.62.1-noble@sha256:dcc5531e97840b9b5e794f2814476b21571c5124a3fca2267d73041f56e7580e');
    expect(circleCiConfig).toContain('CI_PLAYWRIGHT_PREINSTALLED: "1"');
    expect(circleCiConfig).toContain('CI_PLAYWRIGHT_IMAGE_VERSION: "1.62.1"');
    expect(ciUiGate).toContain('preinstalled Playwright');
    expect(ciUiGate).toContain('JSON.stringify({version:p.version,executablePath:chromium.executablePath()})');
    expect(ciUiGate).toContain("JSON.parse(identity.stdout ?? '{}')");
    expect(macFallbackWorkflow).toContain('workflow_dispatch:');
    expect(macFallbackWorkflow).not.toContain('pull_request:');
    expect(macFallbackWorkflow).not.toMatch(/\n\s*push:/);
    expect(macFallbackWorkflow).toContain('runs-on: [self-hosted, basemodel-ci]');
    expect(macFallbackWorkflow).toContain("CI_UI_FORCE_FULL: '1'");
    expect(macFallbackWorkflow).toContain('persist-credentials: false');
    expect(ciUiGate).toContain("'scripts/vercel-ui-plan.ts'");
    expect(ciUiGate).toContain("'scripts/ci-ui-test-list.mjs'");
    expect(ciUiGate).toContain('--test-list');
    expect(ciUiGate).toContain("PLAYWRIGHT_REUSE_BUILD: '1'");
    expect(ciUiGate).toContain('PWTEST_CACHE_DIR: transformCacheDir');
    expect(ciUiGate).toContain('basemodel-playwright-transform-');
    expect(ciUiGate).toContain('rmSync(transformCacheDir, { recursive: true, force: true })');
    expect(ciUiGate).toContain('tests/e2e/lab-playwright.config.ts');
    expect(labPlaywrightConfig).toContain('process.env.PLAYWRIGHT_PORT ?? 4327');
    expect(labPlaywrightConfig).toContain('url: baseURL');
    expect(architecture).toContain('CircleCI + Vercel + Cloudflare smoke');
    expect(architecture).toContain('Vercel remains the only ordinary deployment provider');
    expect(architecture).toContain(productionUrl);
    expect(latest).toContain(productionUrl);
    expect(latest).toContain('current/hosting-architecture.md');
  });

  it('keeps Cloudflare deployment fallback separate from active smoke monitoring', () => {
    expect(architecture).toContain('Legacy hosting — not ordinary workflow');
    expect(architecture).toContain('production-smoke');
    expect(latest).toContain('Cloudflare production-smoke');
    expect(latest).toContain('Vercel remains the ordinary deployment provider');
  });

  it('uses a tiny scheduled Cloudflare Worker for real Production smoke only', () => {
    expect(productionSmokeConfig.name).toBe('basemodel-production-smoke');
    expect(productionSmokeConfig.triggers?.crons).toEqual(['*/30 * * * *']);
    expect(productionSmoke).toContain(`const ORIGIN = '${productionUrl}'`);
    expect(productionSmoke).toContain("'/robots.txt'");
    expect(productionSmoke).toContain("'/sitemap.xml'");
    expect(productionSmoke).toContain("url.pathname !== '/check'");
    expect(productionSmoke).not.toContain('playwright');
    expect(productionSmoke).not.toContain('npm run');
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
