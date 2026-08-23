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
    expect(openEvoProgramSource.commit).toBe('d1f35ecdf84c61b07df7c646e83588d63b9297bd');
    expect(openEvoProgramSource.branch).toBe('codex/h142-measurement-validity-20260821');
    expect(openEvoProgramSourcePaths.reconciliation).toBe('docs/evidence/remote-runs/2026-08-20/h1.40-g2-r2/formal-upstream-evaluation-v5b-summary.json');
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
    expect(coverage).toContain('H1.40');
    expect(coverage).toContain('H1.40-MD');
    expect(coverage).toContain('H1.41');
    expect(coverage).toContain('H1.42-MV');
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
    expect(programTimeline.find((item) => item.id === 'h1-40')?.boundary.en).toContain('T2 did not run');
    expect(programTimeline.find((item) => item.id === 'h1-40-md')?.result).toBe('invalid');
  });

  it('uses the frozen scientific variables and defines specialized terms at first use', () => {
    const narrative = `${JSON.stringify(programTimeline)}\n${component}`;
    for (const forbidden of [
      ['deeper', 'training'].join(' '), ['加深', '训练'].join(''), ['training', 'depth'].join(' '), ['训练', '深度'].join(''),
      ['preregistered', 'significance'].join(' '), ['预注册', '显著'].join(''), ['H1.33', 'R'].join(''),
      ['protocol', 'draft'].join(' '), ['协议', '草案'].join(''),
    ]) expect(narrative).not.toContain(forbidden);

    expect(component).toContain('H1.40 established E2 experience supply and G2 construction');
    expect(component).toContain('The 4/4 invalid acquisition cell was a parser-only measurement failure');
    expect(programTimeline.find((item) => item.id === 'h1-1-4')?.summary.en).toContain('fallback (a substitute action used after parsing failure)');
    expect(programTimeline.find((item) => item.id === 'h1-34')?.boundary.en).toContain('artifact (a frozen saved experiment output)');
  });

  it('keeps H1.17–H1.28 aligned to the frozen diagnostic lineage', () => {
    expect(programTimeline.find((item) => item.id === 'h1-17-21')?.summary.en).toContain('text-memory versus parametric carriers');
    expect(programTimeline.find((item) => item.id === 'h1-22-25')).toMatchObject({ result: 'invalid' });
    expect(programTimeline.find((item) => item.id === 'h1-22-25')?.boundary.en).toContain('cannot support an OpenEvo efficacy');
    expect(programTimeline.find((item) => item.id === 'h1-26-28')?.summary.en).toContain('paired delta of -0.3 against both controls');
  });

  it('keeps every H1.9–H1.16 semantic result and validity boundary distinct', () => {
    const expected = {
      'h1-9': ['negative', 'fresh seeds', 'broad generalization'],
      'h1-10': ['negative', 'state-aware arm', 'treatment effect'],
      'h1-11': ['negative', 'positive supervision', 'Fit is not behavioral transfer'],
      'h1-12': ['negative', 'state-aware recovery cue', 'global impossibility'],
      'h1-13': ['negative', 'action-only supervision targets', 'target-format'],
      'h1-14': ['protocol', 'successful-state teacher route', 'no H1.14 comparative scientific result'],
      'h1-15': ['invalid', 'executable-SHA drift', 'use H1.16'],
      'h1-16': ['negative', 'zero qualified positives', 'clean negative'],
    } as const;
    for (const [id, [result, summaryToken, boundaryToken]] of Object.entries(expected)) {
      const item = programTimeline.find((entry) => entry.id === id);
      expect(item?.result).toBe(result);
      expect(item?.summary.en).toContain(summaryToken);
      expect(item?.boundary.en).toContain(boundaryToken);
    }
  });

  it('defines laboratory terms bilingually before asking readers to use them', () => {
    expect(component).toContain('H1.40-MD 是对已有 artifact 的 CPU-only 尸检');
    expect(component).toContain('H1.40-MD is a CPU-only autopsy of existing artifacts');
    expect(programTimeline.find((item) => item.id === 'h1-29')?.summary.en).toContain('SD-LoRA (the current sequential-difference LoRA update path)');
    expect(programTimeline.find((item) => item.id === 'h1-41')?.summary.en).toContain('acquisition');
    expect(programTimeline.find((item) => item.id === 'h1-41')?.summary.en).toContain('retention');
    expect(programTimeline.find((item) => item.id === 'h1-41')?.summary.en).toContain('T2');
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
    expect(nextDecisionNodes[0].id).toBe('magnitude-control');
    expect(nextDecisionNodes[0].change.zh).toContain('C1');
    expect(nextDecisionNodes[0].change.en).toContain('coefficient init');
    for (const item of programTimeline) {
      expect(item.title.zh).toBeTruthy(); expect(item.title.en).toBeTruthy();
      expect(item.summary.zh).toBeTruthy(); expect(item.summary.en).toBeTruthy();
      expect(item.boundary.zh).toBeTruthy(); expect(item.boundary.en).toBeTruthy();
    }
  });

  it('keeps the frozen report static-first while the Chinese results route becomes an article index', () => {
    expect(zhRoute).toContain('OpenEvoWebShopResultIndex');
    expect(zhRoute).not.toContain('<OpenEvoWebShopProgramReport locale={locale}>');
    expect(zhRoute).not.toContain('Seed3090ParametricProgress');
    expect(enRoute).toContain('<OpenEvoWebShopProgramReport locale={locale}>');
    expect(enRoute).toContain('<Seed3090ParametricProgress slot="historical" locale={locale} />');

    const order = ['id="abstract"', 'id="results"', 'id="interpretation"', 'id="next-experiment"', 'id="methods"', 'id="appendix"']
      .map((token) => component.indexOf(token));
    expect(order.every((position) => position >= 0)).toBe(true);
    expect(order).toEqual([...order].sort((a, b) => a - b));
    for (const token of ['<table>', 'scope="col"', 'class="causal-flow"', '<dl class="interpretation-list"', '<details', 'data-testid="lineage-appendix"', 'data-testid="rtx6-appendix"', '@media print']) expect(component).toContain(token);
    for (const forbidden of ['data-filter-group', '<dialog', '<script>', '.timeline-card', 'showModal']) expect(component).not.toContain(forbidden);
    expect(programTimeline).toHaveLength(30);
    expect(component).not.toMatch(/data-testid="(?:lineage|rtx6)-appendix"\s+open/);
  });

  it('keeps passive explainer synchronization free of document scrolling', () => {
    const handler = explainer.slice(explainer.indexOf("window.addEventListener('irx:scroll-step'" ) - 900, explainer.indexOf("window.removeEventListener('irx:scroll-step'" ) + 100);
    expect(handler).toContain('setStep');
    expect(handler).not.toContain('scrollIntoView');
    expect(handler).not.toContain('requestAnimationFrame');
  });
});
