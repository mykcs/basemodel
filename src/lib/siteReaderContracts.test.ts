import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { SITE_READER_CONTRACTS, readerContractForRoute } from '../data/siteReaderContracts';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');
const layout = read('../layouts/AppLayout.astro');
const packageJson = JSON.parse(read('../../package.json')) as { scripts: Record<string, string> };
const spec = read('../../docs/agents/current/website-design-spec.md');
const contractDoc = read('../../docs/agents/current/site-reader-attention-contract.md');
const triggers = read('../../docs/agents/current/scenario-trigger-registry.md');

describe('site-wide reader attention contracts', () => {
  it('requires explicit cognitive fields instead of a catch-all page template', () => {
    expect(SITE_READER_CONTRACTS.length).toBeGreaterThanOrEqual(50);
    expect(new Set(SITE_READER_CONTRACTS.map((row) => row.id)).size).toBe(SITE_READER_CONTRACTS.length);
    for (const row of SITE_READER_CONTRACTS) {
      for (const value of [row.audience, row.primaryTask, row.firstViewportGoal, row.mustStayVisible, row.nextStep]) {
        expect(value.trim().length, row.id).toBeGreaterThan(0);
        expect(value, row.id).not.toMatch(/\b(?:tbd|todo|placeholder)\b|待定|以后再说/i);
      }
      expect(row.sourceRoute).not.toBe('/**');
    }
  });

  it('resolves exact pages before dynamic families and shares contracts across locales', () => {
    expect(readerContractForRoute('/models/kimi-k2-thinking/')?.id).toBe('model-detail');
    expect(readerContractForRoute('/en/models/kimi-k2-thinking/')?.id).toBe('model-detail');
    expect(readerContractForRoute('/research/seed-openevo/study/results/current-conclusion/')?.id).toBe('result-note');
    expect(readerContractForRoute('/research/seed-openevo/study/results/3b-self-analysis/')?.id).toBe('result-3b-self');
    expect(readerContractForRoute('/en/research/seed-openevo/study/results/3b-self-analysis/')?.id).toBe('result-3b-self');
  });

  it('fails closed in AppLayout and keeps the audit/browser gate wired into normal acceptance', () => {
    expect(layout).toContain('readerContractForRoute(localeNeutralPath)');
    expect(layout).toContain('Public page is missing a reader-attention contract');
    expect(layout).toContain('data-reader-contract-id={readerContract.id}');
    expect(layout).toContain('data-reader-attention-mode={readerContract.attentionMode}');
    expect(packageJson.scripts['verify:deploy']).toContain('audit:reader-contracts');
    expect(packageJson.scripts['test:ui']).toContain('site-reader-contracts.spec.ts');
    expect(packageJson.scripts['test:ui:all']).toContain('site-reader-contracts.spec.ts');
  });

  it('makes the design spec route through the executable contract instead of another optional guideline', () => {
    expect(spec).toContain('site-reader-attention-contract.md');
    expect(spec).toContain('新增页面没有 `audience / primaryTask / firstViewportGoal / mustStayVisible / nextStep / attentionMode` 时，CI 应直接失败');
    expect(contractDoc).toContain('一个首屏通常只承担一个主要理解任务');
    expect(contractDoc).toContain('不允许新增 catch-all contract');
    expect(contractDoc).toContain('人工冷读能在 5–10 秒回答');
    expect(triggers).toContain('Before writing or substantially rearranging public-page HTML');
    expect(triggers).toContain('src/data/siteReaderContracts.ts');
  });
});
