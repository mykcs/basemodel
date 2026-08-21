import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { openEvoProgramSource, programTimeline } from '../data/openEvoWebShopProgram';

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
const component = read('src/components/research/OpenEvoWebShopNarrativeReport.astro');
const zhRoute = read('src/pages/research/seed-openevo/results.astro');
const enRoute = read('src/pages/en/research/seed-openevo/results.astro');

describe('OpenEvo × WebShop reader-first narrative', () => {
  it('starts from the scientific question rather than run IDs', () => {
    const rendered = component.slice(component.indexOf('<article'));
    expect(rendered).toContain('OpenEvo 在 WebShop 上，能不能从自己的经验里变得更好？');
    expect(rendered).toContain('WebShop 又在测什么？');
    expect(rendered).toContain('一次 WebShop 任务实际上长什么样');
    expect(rendered).toContain('task score=0.667');
    const firstRunRef = rendered.indexOf('Phase G / H0');
    const question = rendered.indexOf('WebShop 又在测什么？');
    expect(question).toBeGreaterThan(0);
    expect(firstRunRef).toBeGreaterThan(question);
  });

  it('introduces LoRA and SD-LoRA only after the problem has been narrowed', () => {
    const rendered = component.slice(component.indexOf('<article'));
    const background = rendered.indexOf('id="background"');
    const journey = rendered.indexOf('id="journey"');
    const method = rendered.indexOf('id="method-control"');
    const firstSd = rendered.indexOf('SD-LoRA');
    expect(background).toBeGreaterThan(0);
    expect(journey).toBeGreaterThan(background);
    expect(method).toBeGreaterThan(journey);
    expect(firstSd).toBeGreaterThan(method);
    expect(rendered).toContain('先补一个概念：LoRA 是什么？');
  });

  it('makes conclusion, evidence, inference, and claim boundaries explicit', () => {
    for (const token of ['主结论 A', '主结论 B', '证据：', '为什么这样推：', '不能外推：', '当前负结论']) {
      expect(component).toContain(token);
    }
    expect(component).toContain('一次参数更新可以把模型自身经验变成新任务收益');
    expect(component).toContain('第二次连续参数写入目前没有证明能继续增加能力');
  });

  it('keeps the sealed positive evidence and current H1.40/H1.41 boundary together', () => {
    for (const token of [
      '0.124',
      '0.248845',
      '132',
      '33',
      'g2Components: 16',
      'g2EffectiveRank: 64',
      '96',
      '384',
      'MEASUREMENT_INVALID',
      '-0.065625',
    ]) expect(component).toContain(token);
    expect(component).toContain('T2 没有打开');
    expect(component).toContain('measurement-invalid 不是“方法永远不行”');
  });

  it('uses a paper-like argument while keeping run IDs in provenance and appendix', () => {
    const ids = ['abstract', 'background', 'journey', 'method-control', 'replication', 'next-experiment', 'interpretation', 'methods', 'appendix'];
    const order = ids.map((id) => component.indexOf(`id="${id}"`));
    expect(order.every((position) => position >= 0)).toBe(true);
    expect(order).toEqual([...order].sort((a, b) => a - b));
    for (const token of ['class="trace-example"', 'class="journey-table"', 'class="ci-figure"', 'class="claim-arguments"', 'data-testid="lineage-appendix"']) {
      expect(component).toContain(token);
    }
    expect(programTimeline).toHaveLength(29);
    expect(component).not.toMatch(/data-testid="(?:lineage|rtx6)-appendix"\s+open/);
  });

  it('uses the current H1.41 source of truth', () => {
    expect(openEvoProgramSource).toMatchObject({
      commit: 'e9088e47531ffec03d1450ffd2601862909cf187',
      campaign: '20260821-0141-h141-magnitude-screen',
    });
  });

  it('routes both locales through the new narrative component', () => {
    for (const route of [zhRoute, enRoute]) {
      expect(route).toContain('OpenEvoWebShopNarrativeReport.astro');
      expect(route).toContain('<OpenEvoWebShopProgramReport locale={locale}>');
      expect(route).toContain('<Seed3090ParametricProgress slot="historical" locale={locale} />');
    }
  });
});