import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  claimState,
  h138Metrics,
  nextDecisionNodes,
  openEvoProgramLinks,
  openEvoProgramSource,
  openEvoProgramSourcePaths,
  programTimeline,
} from '../data/openEvoWebShopProgram';

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const component = read('src/components/research/OpenEvoWebShopProgramReport.astro');
const zhRoute = read('src/pages/research/seed-openevo/results.astro');
const enRoute = read('src/pages/en/research/seed-openevo/results.astro');
const explainer = read('src/components/research/InteractiveResearchExplainer.tsx');

describe('OpenEvo × WebShop frozen program report', () => {
  it('pins every source link to the immutable OpenEvo delivery commit and known existing paths', () => {
    expect(openEvoProgramSource.commit).toBe('93a38821c884a633817bf412643b20e0b283a678');
    expect(openEvoProgramSource.branch).toBe('main');
    expect(openEvoProgramSourcePaths.reconciliation).toBe('docs/evidence/remote-runs/2026-08-19/h1.38a-c/evidence/h1.38a-c-combined-reconciliation.json');
    for (const [key, path] of Object.entries(openEvoProgramSourcePaths)) {
      expect(path).not.toContain('..');
      expect(openEvoProgramLinks[key as keyof typeof openEvoProgramLinks]).toBe(
        `https://github.com/mykcs/openevo-experiment/blob/${openEvoProgramSource.commit}/${path}`,
      );
    }
  });

  it('preserves the complete phase lineage and corrected result boundaries', () => {
    const coverage = new Set(programTimeline.flatMap((item) => [...item.coverage]));
    expect(coverage).toContain('Phase G');
    expect(coverage).toContain('H0');
    for (let phase = 1; phase <= 37; phase += 1) expect(coverage).toContain(`H1.${phase}`);
    expect(coverage).toContain('H1.38A-C');
    expect(programTimeline.find((item) => item.id === 'h0')?.result).toBe('supported');
    expect(programTimeline.find((item) => item.id === 'h1-29')?.result).toBe('negative');
    expect(programTimeline.find((item) => item.id === 'h1-30')?.result).toBe('protocol');
    expect(programTimeline.find((item) => item.id === 'h1-33')?.result).toBe('negative');
    expect(programTimeline.find((item) => item.id === 'h1-33')?.coverage).toEqual(['H1.33']);
    expect(coverage).toContain('H1.37-R');
    expect(programTimeline.find((item) => item.id === 'phase-g')?.result).toBe('invalid');
    expect(programTimeline.find((item) => item.id === 'h1-34')?.boundary.en).toContain('embeds H1.30 schema/claim metadata');
    expect(programTimeline.find((item) => item.id === 'h1-35')?.boundary.en).toContain('embeds H1.30 schema/claim metadata');
    expect(programTimeline.find((item) => item.id === 'h1-38b')).toMatchObject({ result: 'design' });
    expect(programTimeline.find((item) => item.id === 'h1-38b')?.summary.en).toContain('no accepted preregistration');
    expect(programTimeline.find((item) => item.id === 'h1-38b')?.summary.en).toContain('authorization, execution, or sealed result');
  });

  it('uses the frozen scientific variables and defines specialized terms at first use', () => {
    const narrative = `${JSON.stringify(programTimeline)}\n${component}`;
    for (const forbidden of [
      ['deeper', 'training'].join(' '), ['加深', '训练'].join(''), ['training', 'depth'].join(' '), ['训练', '深度'].join(''),
      ['preregistered', 'significance'].join(' '), ['预注册', '显著'].join(''), ['H1.33', 'R'].join(''),
      ['protocol', 'draft'].join(' '), ['协议', '草案'].join(''),
    ]) expect(narrative).not.toContain(forbidden);

    expect(component).toContain('固定 16 条成功记录');
    expect(component).toContain('drawn from 4, 8, or 16 training task identities');
    expect(component).toContain('task-cluster 95% CI');
    expect(programTimeline.find((item) => item.id === 'h1-1-4')?.summary.en).toContain('fallback (a substitute action used after parsing failure)');
    expect(programTimeline.find((item) => item.id === 'h1-34')?.boundary.en).toContain('artifact (a frozen saved experiment output)');
  });

  it('keeps H1.17–H1.28 aligned to the frozen diagnostic lineage', () => {
    expect(programTimeline.find((item) => item.id === 'h1-17-21')?.summary.en).toContain('text-memory versus parametric carriers');
    expect(programTimeline.find((item) => item.id === 'h1-22-25')).toMatchObject({ result: 'invalid' });
    expect(programTimeline.find((item) => item.id === 'h1-22-25')?.boundary.en).toContain('cannot support an OpenEvo efficacy');
    expect(programTimeline.find((item) => item.id === 'h1-26-28')?.summary.en).toContain('paired delta of -0.3 against both controls');
  });

  it('freezes exact H1.38A-C denominators and inferential statistics', () => {
    expect(h138Metrics.reduce((sum, arm) => sum + arm.attempts, 0)).toBe(768);
    expect(h138Metrics.reduce((sum, arm) => sum + arm.valid, 0)).toBe(764);
    expect(h138Metrics.find((arm) => arm.id === 'd4')).toMatchObject({ valid: 188, invalid: 4, delta: 0.011660, p: 0.8281 });
    expect(h138Metrics.find((arm) => arm.id === 'd8')).toMatchObject({ mean: 0.139625, delta: -0.005792, p: 0.8704 });
    expect(h138Metrics.find((arm) => arm.id === 'd16')).toMatchObject({ mean: 0.201063, delta: 0.055646, p: 0.1735 });
  });

  it('keeps bilingual claim states equivalent and method control first', () => {
    for (const state of ['confirmed', 'inferred', 'unknown'] as const) {
      expect(claimState[state].zh).toHaveLength(claimState[state].en.length);
    }
    expect(nextDecisionNodes[0].id).toBe('method-control');
    expect(nextDecisionNodes[0].change.zh).toContain('H1.38 D8');
    expect(nextDecisionNodes[0].change.en).toContain('ordinary sequential LoRA');
    for (const item of programTimeline) {
      expect(item.title.zh).toBeTruthy(); expect(item.title.en).toBeTruthy();
      expect(item.summary.zh).toBeTruthy(); expect(item.summary.en).toBeTruthy();
      expect(item.boundary.zh).toBeTruthy(); expect(item.boundary.en).toBeTruthy();
    }
  });

  it('exposes the same direct main-stage report on both locale routes', () => {
    for (const route of [zhRoute, enRoute]) expect(route).toContain('<OpenEvoWebShopProgramReport locale={locale} />');
    for (const token of ['data-ui-audit="contrast layout overflow interactive"', 'data-filter-group="stage"', 'data-filter-group="result"', '<dialog', 'aria-live="polite"', '@media(prefers-reduced-motion:reduce)']) expect(component).toContain(token);
  });

  it('keeps passive explainer synchronization free of document scrolling', () => {
    const handler = explainer.slice(explainer.indexOf("window.addEventListener('irx:scroll-step'" ) - 900, explainer.indexOf("window.removeEventListener('irx:scroll-step'" ) + 100);
    expect(handler).toContain('setStep');
    expect(handler).not.toContain('scrollIntoView');
    expect(handler).not.toContain('requestAnimationFrame');
  });
});
