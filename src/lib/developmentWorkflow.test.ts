import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { SITE_READER_CONTRACTS } from '../data/siteReaderContracts';

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
    expect(page).toContain('The default manual release destination remains protected by Vercel Authentication');
    expect(page).toContain('Ordinary PRs and main merges do not auto-deploy to Vercel');
    expect(page).toContain('Vercel Authentication (default)');
    expect(page).toContain('Cloudflare Access (standby)');
    expect(page).toContain('basemodel-access-standby.gemini202405.workers.dev');
    expect(page).toContain('basemodel-preview.vercel.app');
    expect(page).toContain('Mac/OrbStack remains manual recovery only');
    expect(page).not.toContain('Cloudflare is not part of ordinary BaseModel deployment');
    expect(page).not.toContain('heavy acceptance runs in CircleCI');
    expect(page).not.toContain('final-candidate CI + Preview');
  });


  it('keeps the Development reader orientation aligned with current dual gates and protected manual release', () => {
    const row = SITE_READER_CONTRACTS.find((contract) => contract.id === 'development');
    expect(row?.firstViewportGoal).toContain('GitHub Actions 双门禁');
    expect(row?.firstViewportGoal).toContain('默认手动发布');
    expect(row?.firstViewportGoal).toContain('Cloudflare Access 是备用站');
    expect(row?.firstViewportGoal).not.toContain('Vercel Preview → Production');
    expect(row?.mustStayVisible).toContain('public-ci-gate');
    expect(row?.mustStayVisible).toContain('cloudflare-artifact-gate');
    expect(row?.mustStayVisible).toContain('无部署构建检查');
    expect(row?.mustStayVisible).toContain('普通 PR / main 不自动发布');
    expect(page).toContain('Vercel Authentication (default)');
    expect(page).toContain('Cloudflare Access (standby)');
  });

  it('is discoverable through navigation, sitemap, locale switch, and reader contract', () => {
    expect(header).toContain("path: '/development/'");
    expect(sitemap).toContain("'/development/'");
    expect(contracts).toContain("c('development'");
    expect(contracts).toContain("'.development-hero .lede'");
  });
});
