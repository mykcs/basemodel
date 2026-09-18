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
      if (row.firstViewportBudget) {
        expect(row.firstViewportBudget.maxInteractive, row.id).toBeGreaterThanOrEqual(0);
        expect(row.firstViewportBudget.maxHeadings, row.id).toBeGreaterThan(0);
        expect(row.firstViewportBudget.maxTextChars, row.id).toBeGreaterThan(0);
      }
    }
  });

  it('gives high-level gateways an explicit first-screen budget instead of relying on H1 visibility alone', () => {
    for (const id of ['home', 'models-index', 'model-detail', 'papers-index', 'guide', 'landscape', 'workspace', 'lab', 'flow', 'flow-server', 'study', 'capability-home']) {
      const row = SITE_READER_CONTRACTS.find((contract) => contract.id === id);
      expect(row, id).toBeDefined();
      expect(row?.firstViewportSelector, id).toBeTruthy();
      expect(row?.firstViewportBudget, id).toBeDefined();
    }
  });

  it('keeps the four redesign pilots as distinct reader modes with exact route owners', () => {
    const pilots = [
      ['flow', '/research/seed-openevo/flow/', 'choice', '.mission-hero__lede'],
      ['flow-sd-lora', '/research/seed-openevo/flow/sd-lora/', 'narrative', '.sdlora-intro__lede'],
      ['flow-server', '/research/seed-openevo/flow/server/', 'operational', '.server-hero__status'],
      ['capability-q17-frontier', '/research/seed-openevo/study/capability-exploration/q17-directapply-frontier/', 'focus', '[data-q17-advisor-diagnostics] .lede'],
    ] as const;

    expect(new Set(pilots.map(([, , mode]) => mode)).size).toBe(4);
    for (const [id, route, mode, selector] of pilots) {
      const row = SITE_READER_CONTRACTS.find((contract) => contract.id === id);
      expect(row, id).toBeDefined();
      expect(row?.sourceRoute, id).toBe(route);
      expect(row?.attentionMode, id).toBe(mode);
      expect(row?.firstViewportSelector, id).toBe(selector);
      expect(readerContractForRoute(route)?.id, route).toBe(id);
    }
  });

  it('binds model detail first-screen acceptance to decision facts instead of a tall identity wrapper', () => {
    const model = SITE_READER_CONTRACTS.find((contract) => contract.id === 'model-detail');
    expect(model?.firstViewportSelector).toBe('.model-detail-quickfacts');
    expect(model?.firstViewportBudget).toEqual({ maxInteractive: 4, maxHeadings: 2, maxTextChars: 720 });
  });

  it('anchors the SD-LoRA first-screen contract to the actual motivation message rather than the whole tall intro block', () => {
    const flow = SITE_READER_CONTRACTS.find((contract) => contract.id === 'flow-sd-lora');
    const compatibility = SITE_READER_CONTRACTS.find((contract) => contract.id === 'capability-vanilla-sd-lora');
    expect(flow?.firstViewportSelector).toBe('.sdlora-intro__lede');
    expect(compatibility?.firstViewportSelector).toBe('.sdlora-intro__lede');
  });

  it('keeps the Study phone budget at six experiment parents plus one SD-LoRA overview and two treatment branches', () => {
    const row = SITE_READER_CONTRACTS.find((contract) => contract.id === 'study');
    expect(row?.firstViewportBudget?.maxInteractive).toBe(9);
    expect(row?.firstViewportGoal).toContain('六次主要实验');
    expect(row?.firstViewportGoal).toContain('两条路线说明');
    expect(row?.firstViewportGoal).toContain('Stable Reduction');
    expect(row?.firstViewportGoal).toContain('Bounded Online Recurrence');
    expect(row?.mustStayVisible).toContain('六个主实验父项');
    expect(row?.mustStayVisible).toContain('SD-LoRA 加速');
    expect(row?.mustStayVisible).toContain('解释入口而不是第三个 treatment');
    expect(row?.mustStayVisible).toContain('SD-LoRA v2 只属于 Stable Reduction');
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
    expect(contractDoc).toContain('不让 Gate 奖励“空白作弊”');
    expect(contractDoc).toContain('不得为了过首屏预算而新增满屏 `min-height`、空占位或无语义大留白');
    expect(contractDoc).toContain('人工冷读能在 5–10 秒回答');
    expect(triggers).toContain('Before writing or substantially rearranging public-page HTML');
    expect(triggers).toContain('src/data/siteReaderContracts.ts');
  });
});