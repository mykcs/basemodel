import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const layoutSource = readFileSync(new URL('../layouts/AppLayout.astro', import.meta.url), 'utf8');
const mainlineSource = readFileSync(new URL('../components/ResearchMainline.astro', import.meta.url), 'utf8');
const seedSource = readFileSync(new URL('../components/SeedUseCaseStrip.astro', import.meta.url), 'utf8');
const homeSource = readFileSync(new URL('../pages/_bodies/home-v2.astro', import.meta.url), 'utf8');
const socialCoverSource = readFileSync(new URL('../../public/og-cover.svg', import.meta.url), 'utf8');

describe('researcher visual guidance', () => {
  it('keeps one global research compass and removes the decorative footer slogan', () => {
    expect(layoutSource).toContain('<ResearchMainline locale={locale} path={localeNeutralPath} />');
    expect(layoutSource).not.toContain('footer.motto');
    expect(socialCoverSource).not.toContain('数据优先，证据先行');
  });

  it('protects the five-stage research decision mainline', () => {
    for (const label of ['明确问题', '收紧约束', '形成候选', '核验证据', '做出决策']) {
      expect(mainlineSource).toContain(label);
    }
    expect(mainlineSource).toContain("t('现在做什么', 'What now')");
    expect(mainlineSource).toContain("t('为什么', 'Why')");
    expect(mainlineSource).toContain("t('下一步', 'Next')");
  });

  it('keeps SEED as a concrete example without repeating the full worked example on every inner page', () => {
    expect(seedSource).toContain('seed-use-case-compact');
    expect(seedSource).toContain('{standalone ? (');
    expect(seedSource).toContain('market-snapshot');
    expect(seedSource).toContain('ALFWorld / WebShop');
  });

  it('makes the novice SEED walkthrough a first-class home entry while retaining a direct expert path', () => {
    expect(homeSource).toContain("t('从 SEED 实战开始', 'Start with the SEED walkthrough')");
    expect(homeSource).toContain("t('我已有研究任务', 'I already have a research task')");
    expect(homeSource).toContain('decisionSteps');
    expect(homeSource).toContain('home-compass-list');
  });
});
