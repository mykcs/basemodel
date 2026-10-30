import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const page = read('src/components/DevelopmentWorkflowPage.astro');
const zhRoute = read('src/pages/development.astro');
const enRoute = read('docs/archive/site-en/src/pages/en/development.astro.archive');
const header = read('src/components/Header.astro');
const sitemap = read('src/lib/sitemapRoutes.ts');
const contracts = read('src/data/siteReaderContracts.ts');

describe('human-facing development workflow', () => {
  it('uses one bilingual semantic owner', () => {
    expect(zhRoute).toContain('DevelopmentWorkflowPage');
    expect(enRoute).toContain('DevelopmentWorkflowPage');
  });

  it('names the real control and provider surfaces', () => {
    for (const term of ['ChatGPT', 'GitHub plugin', 'Remote Desktop Commander', 'GitHub', 'Vercel', 'Cloudflare', 'CircleCI', 'GitHub Actions']) {
      expect(page).toContain(term);
    }
  });

  it('keeps the current BaseModel CI authority and fallbacks honest', () => {
    expect(page).toContain('repository + browser acceptance');
    expect(page).toContain('offline check; no deploy');
    expect(page).toContain('ci/vercel-gate-final');
    expect(page).toContain('public-ci-gate');
    expect(page).toContain('cloudflare-artifact-gate');
    expect(page).toContain('The normal release destination is the existing Cloudflare Access-protected Worker');
    expect(page).toContain('Ordinary PRs and main merges do not auto-deploy to Vercel');
    expect(page).toContain('basemodel-access-standby.gemini202405.workers.dev');
    expect(page).toContain('basemodel-preview.vercel.app');
    expect(page).toContain('Mac/OrbStack remains manual recovery only');
    expect(page).not.toContain('Cloudflare is not part of ordinary BaseModel deployment');
    expect(page).not.toContain('heavy acceptance runs in CircleCI');
    expect(page).not.toContain('final-candidate CI + Preview');
  });

  it('is discoverable through navigation, sitemap, locale switch, and reader contract', () => {
    expect(header).toContain("path: '/development/'");
    expect(sitemap).toContain("'/development/'");
    expect(contracts).toContain("c('development'");
    expect(contracts).toContain("'.development-hero .lede'");
  });
});
