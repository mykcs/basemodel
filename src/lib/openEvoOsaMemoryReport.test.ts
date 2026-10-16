import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import report from '../../public/data/research/osa-memory-20261015.json';
import { availableLocalesForRoute } from './sitemapRoutes';
import { readerContractForRoute } from '../data/siteReaderContracts';

const route = '/research/seed-openevo/study/osa-memory/';
const read = (path: string) => readFileSync(new URL('../../' + path, import.meta.url), 'utf8');
const navigation = read('src/components/research/OpenEvoArticleNavigation.astro');
const page = read('src/pages' + route + 'index.astro');

describe('OSA memory report scientific boundaries and discovery', () => {
  it('keeps all completed cells distinct from model training and shopping tasks', () => {
    expect(report.phases.map(p => p.cells)).toEqual([80, 30, 25]);
    expect(report.phases.reduce((sum, p) => sum + p.cells, 0)).toBe(135);
    expect(report.validation.webshopEpisodes).toBe(0);
    expect(report.validation.llmParameterUpdates).toBe(0);
    expect(report.validation.finalPanelAccess).toBe(0);
    expect(report.catalog).toEqual({ documents: 512, derivedQueries: 1024, seedsPerPilot: 5 });
    expect(page).toContain('不能代表独立的人类购物目标');
    expect(page).toContain('不是独立测试集确认');
  });
  it('preserves negative paired ridge evidence and the stronger retrieval baselines', () => {
    const ridge = report.phases.find(p => p.id === 'ridge')!;
    const get = (id: string) => ridge.rows.find(r => r.id === id)!;
    expect(get('none').top1).toBe(0.196875);
    expect(get('osa').top1).toBe(0.190234375);
    expect(get('osa').top1).toBeLessThan(get('none').top1);
    expect(get('osa').top5).toBeLessThan(get('none').top5!);
    expect(get('matched_reservoir_bank').bytes).toBe(get('osa').bytes);
    expect(get('matched_reservoir_bank').top1).toBeGreaterThan(get('osa').top1);
    expect(get('full_vector_bank').bytes).toBe(131072);
    expect(page).toContain('不能把差值全部归因于更新方法');
    const catalog = report.phases.find(p => p.id === 'catalog')!;
    expect(catalog.rows.find(r => r.id === 'osa')!.bytes).toBe(32768);
    expect(get('osa').bytes).toBe(49152);
  });
  it('places the independent report after questions and retains the three historical ordinals', () => {
    expect(navigation.indexOf("id: 'osa'")).toBeGreaterThan(navigation.indexOf("id: 'questions'"));
    expect(navigation.indexOf("id: 'osa'")).toBeLessThan(navigation.indexOf("id: 'results'"));
    expect(navigation).toContain("id: 'osa', number:'＋'");
    expect(navigation).toContain("id: 'results', number:'03'");
    const index = read('src/components/research/OpenEvoExperimentIndex.astro');
    expect(index.indexOf('data-osa-report-link')).toBeGreaterThan(index.indexOf('data-advisor-report-link'));
    expect(index).toContain(route);
    expect(availableLocalesForRoute(route)).toEqual(['zh']);
    expect(readerContractForRoute(route)?.id).toBe('study-osa-memory');
  });
  it('offers public aggregates and explicitly labels restricted raw sources without publishing server details', () => {
    expect(page).toContain('download');
    expect(page).toContain('原始结果和源代码为受限来源');
    expect(page).toContain('需要相应仓库权限');
    const serialized = JSON.stringify(report);
    expect(serialized).not.toMatch(/GPU-[a-f0-9-]+|wangr-dev|\/root\/|\/data\/home\/|\b(?:\d{1,3}\.){3}\d{1,3}\b/);
  });
});
