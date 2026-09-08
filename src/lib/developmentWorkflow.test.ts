import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const page = read('src/components/DevelopmentWorkflowPage.astro');
const zhRoute = read('src/pages/development.astro');
const enRoute = read('src/pages/en/development.astro');
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
    expect(page).toContain('final-candidate CI + Preview');
    expect(page).toContain('ci/vercel-gate-final');
    expect(page).toContain('Cloudflare is not the ordinary BaseModel deployment provider');
    expect(page).toContain('CircleCI and GitHub Actions are manual recovery paths only');
    expect(page).not.toContain('heavy acceptance runs in CircleCI');
  });

  it('is discoverable through navigation, sitemap, locale switch, and reader contract', () => {
    expect(header).toContain("path: '/development/'");
    expect(sitemap).toContain("'/development/'");
    expect(contracts).toContain("c('development'");
    expect(contracts).toContain("'.development-hero .lede'");
  });
});
