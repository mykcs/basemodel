import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const readText = (relativePath: string): string =>
  readFileSync(new URL(relativePath, import.meta.url), 'utf8');

const readJson = <T>(relativePath: string): T =>
  JSON.parse(readText(relativePath)) as T;

describe('Cloudflare-only deployment architecture', () => {
  const workflowsDir = new URL('../../.github/workflows/', import.meta.url);
  const astroConfig = readText('../../astro.config.mjs');
  const buildCloudflare = readText('../../scripts/build-cloudflare.mjs');
  const dependabot = readText('../../.github/dependabot.yml');
  const playwright = readText('../../playwright.config.ts');
  const ogCover = readText('../../public/og-cover.svg');
  const packageJson = readJson<{ scripts: Record<string, string> }>('../../package.json');

  it('keeps GitHub Actions retired', () => {
    const workflowFiles = existsSync(workflowsDir)
      ? readdirSync(workflowsDir).filter((name) => /\.ya?ml$/i.test(name))
      : [];
    expect(workflowFiles).toEqual([]);
  });

  it('keeps Cloudflare Production at the origin root', () => {
    expect(astroConfig).toContain("'https://basemodel.pages.dev'");
    expect(astroConfig).toMatch(/\bbase:\s*['"]\/['"]/);
    expect(playwright).toContain("baseURL: 'http://127.0.0.1:4327/'");
  });

  it('keeps deterministic checks, V2 adversarial audits, and hardening inside the repository-owned Cloudflare build gate', () => {
    expect(packageJson.scripts['verify:deploy']).toBe(
      'npm run check && npm run validate && npm run audit:semantic && npm run audit:claims && npm run audit:freshness && npm test && npm run audit:v2 && npm run audit:v2:adversarial && npm run audit:hardening',
    );
    expect(buildCloudflare).toContain("run('npm', ['run', 'verify:deploy'])");
    expect(buildCloudflare).not.toContain('PUBLIC_BASE_PATH');
    expect(buildCloudflare).not.toContain('PUBLIC_CANONICAL_SITE_URL');
  });

  it('does not maintain GitHub Actions dependencies through Dependabot', () => {
    expect(dependabot).not.toContain('package-ecosystem: github-actions');
  });

  it('keeps browser major upgrades deliberate', () => {
    expect(dependabot).toContain('dependency-name: "@playwright/test"');
    expect(dependabot).toContain('version-update:semver-major');
  });

  it('keeps public branding on the active Cloudflare production identity', () => {
    expect(ogCover).toContain('basemodel.pages.dev');
    expect(ogCover).not.toContain('mykcs.github.io/basemodel');
  });
});
