import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const readText = (relativePath: string): string => readFileSync(new URL(relativePath, import.meta.url), 'utf8');
const readJson = <T>(relativePath: string): T => JSON.parse(readText(relativePath)) as T;

describe('Vercel production deployment architecture', () => {
  const workflowsDir = new URL('../../.github/workflows/', import.meta.url);
  const selfHostedWorkflow = readText('../../.github/workflows/self-hosted-ci.yml');
  const runnerDockerfile = readText('../../.github/runner/Dockerfile');
  const runnerStart = readText('../../.github/runner/mac-orbstack-start.sh');
  const astroConfig = readText('../../astro.config.mjs');
  const appLayout = readText('../../src/layouts/AppLayout.astro');
  const robots = readText('../../src/pages/robots.txt.ts');
  const sitemap = readText('../../src/pages/sitemap.xml.ts');
  const buildCloudflare = readText('../../scripts/build-cloudflare.mjs');
  const dependabot = readText('../../.github/dependabot.yml');
  const playwright = readText('../../playwright.config.ts');
  const ogCover = readText('../../public/og-cover.svg');
  const packageJson = readJson<{ scripts: Record<string, string> }>('../../package.json');
  const vercelConfig = readJson<{
    buildCommand?: string;
    git?: { deploymentEnabled?: Record<string, boolean> };
    github?: { autoJobCancelation?: boolean };
  }>('../../vercel.json');

  it('uses GitHub Actions only as a self-hosted CI control plane', () => {
    const workflowFiles = existsSync(workflowsDir) ? readdirSync(workflowsDir).filter((name) => /\.ya?ml$/i.test(name)) : [];
    expect(workflowFiles).toEqual(['self-hosted-ci.yml']);
    expect(selfHostedWorkflow).toContain('runs-on: [self-hosted, basemodel-ci]');
    expect(selfHostedWorkflow).not.toMatch(/runs-on:\s*(?:ubuntu|macos|windows)-/);
    expect(selfHostedWorkflow).toContain('persist-credentials: false');
    expect(selfHostedWorkflow).toContain('needs_validation=true');
    expect(selfHostedWorkflow).toContain("grep -Ev '^(docs/|AGENTS\\.md$|README\\.md$|\\.github/)'");
    expect(selfHostedWorkflow).not.toContain('node scripts/vercel-ignore-build.mjs');
    expect(selfHostedWorkflow).toContain('runner/');
    expect(selfHostedWorkflow).toContain("PLAYWRIGHT_WORKERS: '1'");
    expect(selfHostedWorkflow).not.toContain('cache: npm');
    expect(runnerDockerfile).toContain('FROM node:24-bookworm-slim');
    expect(runnerDockerfile).toContain('@playwright/test@1.62.1');
    expect(runnerStart).toContain("grep -q 'AC Power'");
    expect(runnerStart).toContain('--cpus 4');
    expect(runnerStart).toContain('--memory 8g');
    expect(runnerStart).toContain('docker top "$container" -eo pid,args');
    expect(runnerStart).not.toContain('docker exec "$container" bash -lc "ps -ef');
    expect(runnerStart).not.toContain('/var/run/docker.sock');
    expect(runnerStart).not.toMatch(/(?:^|\s)(?:-v|--volume)(?:\s|=)/m);
  });

  it('keeps browser regression out of the Vercel Production build command', () => {
    expect(vercelConfig.buildCommand).toBe('npm run verify:deploy && npm run build');
    expect(vercelConfig.buildCommand).not.toContain('vercel-ui-gate');
    expect(vercelConfig.buildCommand).not.toContain('vercel-lab-browser-gate');
    expect(readText('../../scripts/ci-ui-gate.mjs')).toContain('const ciInfrastructureChanged');
    expect(readText('../../scripts/ci-ui-gate.mjs')).toContain("file.startsWith('.github/runner/')");
  });

  it('uses the stable Vercel project domain as Production identity at the origin root', () => {
    expect(astroConfig).toContain("'https://basemodel-preview.vercel.app'");
    expect(astroConfig).toMatch(/\bbase:\s*['"]\/['"]/);
    expect(appLayout).toContain("process.env.VERCEL_ENV === 'preview'");
    expect(playwright).toContain("process.env.PLAYWRIGHT_PORT ?? '4327'");
    expect(playwright).toContain('const previewURL = `http://127.0.0.1:${previewPort}/`');
    expect(playwright).toContain('baseURL: previewURL');
  });

  it('keeps Vercel Production indexable even if an old Preview-only noindex variable survives', () => {
    for (const source of [appLayout, robots, sitemap]) {
      expect(source).toContain("process.env.VERCEL_ENV === 'production'");
      expect(source).toContain("process.env.PUBLIC_SEARCH_INDEXING === 'disabled' && !isVercelProduction");
      expect(source).toContain("process.env.VERCEL_ENV === 'preview'");
    }
  });

  it('keeps Preview deployments out of cooperative crawler indexes', () => {
    expect(robots).toContain("return new Response('User-agent: *\\nDisallow: /\\n'");
  });

  it('keeps ordinary search available while opting out named AI training crawlers', () => {
    expect(robots).toContain("'GPTBot'");
    expect(robots).toContain("'ClaudeBot'");
    expect(robots).toContain("'Google-Extended'");
    expect(robots).toContain("'User-agent: OAI-SearchBot");
    expect(robots).toContain("'User-agent: ChatGPT-User");
    expect(robots).toContain('User-agent: *');
    expect(robots).toContain('Allow: /');
  });

  it('keeps deterministic checks provider-neutral and preserves Cloudflare fallback validation', () => {
    expect(packageJson.scripts['verify:deploy']).toContain('npm run check');
    expect(packageJson.scripts['verify:deploy']).toContain('npm test');
    expect(buildCloudflare).toContain("run('npm', ['run', 'verify:deploy'])");
    expect(buildCloudflare).toContain('Legacy/fallback Cloudflare validation only');
  });

  it('spends automatic Vercel deployments on production, semantic-release, and research preview branches', () => {
    expect(vercelConfig.git?.deploymentEnabled).toEqual({
      '*': false,
      '**/*': false,
      main: true,
      'agent/semantic-release-*': true,
      'research/**': true,
    });
    expect(vercelConfig.github?.autoJobCancelation).toBe(true);
  });

  it('does not maintain GitHub Actions dependencies through Dependabot', () => {
    expect(dependabot).not.toContain('package-ecosystem: github-actions');
  });

  it('keeps browser major upgrades deliberate', () => {
    expect(dependabot).toContain('dependency-name: "@playwright/test"');
    expect(dependabot).toContain('version-update:semver-major');
  });

  it('keeps public branding on the Vercel Production identity', () => {
    expect(ogCover).toContain('basemodel-preview.vercel.app');
    expect(ogCover).not.toContain('basemodel.pages.dev');
  });
});
