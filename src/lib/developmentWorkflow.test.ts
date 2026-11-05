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

  it('keeps the standards acceptance index on current dual gates and manual protected release', () => {
    const row = read('docs/standards/ACCEPTANCE_MAP.md')
      .split('\n')
      .find((line) => line.startsWith('| Is a PR merge-safe,'));
    expect(row).toBeDefined();
    for (const term of ['public-ci-gate', 'cloudflare-artifact-gate', 'exact PR head', 'fresh current base', 'Vercel Authentication (default)', 'Cloudflare Access (standby)', 'authenticated desktop/mobile']) {
      expect(row).toContain(term);
    }
    expect(row).not.toContain('request-vercel-final-gate.mjs');
    expect(row).not.toContain('Same-SHA Vercel status');
  });

  it('keeps the current website-engineering overlay aligned with exact-head GitHub gates and manual protected release', () => {
    const overlay = read('docs/agents/current/website-engineering-standard.md');
    const activeTopology = overlay.split('## 2. BaseModel release topology')[1]?.split('## 3. Exact local browser evidence')[0];
    const activeSpend = overlay.split('## 6. Public PR CI and Vercel spend boundary')[1]?.split('## 7. Temporary exemptions')[0];
    const done = overlay.split('## 8. BaseModel definition of done')[1]?.split('## 9. Ownership map')[0];

    expect(activeTopology).toContain('public-ci-gate');
    expect(activeTopology).toContain('cloudflare-artifact-gate');
    expect(activeTopology).toContain('release-provider.yml');
    expect(activeTopology).toContain('Vercel default + plan first');
    expect(activeTopology).toContain('Cloudflare Workers + Access');
    expect(activeTopology).toContain('logged-in desktop/mobile');
    expect(activeTopology).not.toContain('→ required Vercel provider acceptance');
    expect(activeSpend).toContain('Neither spends provider deployment quota');
    expect(activeSpend).not.toContain('persistent final-gate ref triggers');
    expect(done).toContain('cloudflare-artifact-gate');
    expect(done).not.toContain('exact-current-base Vercel final-gate');
  });

  it('is discoverable through navigation, sitemap, locale switch, and reader contract', () => {
    expect(header).toContain("path: '/development/'");
    expect(sitemap).toContain("'/development/'");
    expect(contracts).toContain("c('development'");
    expect(contracts).toContain("'.development-hero .lede'");
  });
});
