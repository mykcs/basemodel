import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');
const orientation = read('../components/research/ResearchOrientation.astro');
const routeContext = read('../components/research/ResearchRouteContext.astro');
const firstRun = read('../components/research/OpenEvoFirstRunMap.astro');
const successor = read('../components/research/OpenEvoRedesignMap.astro');
const report = read('../components/research/OpenEvoSuccessorReport.astro');
const exploration = read('../components/research/OpenEvoSuccessorExplorationMap.astro');
const mechanism = read('../components/research/OpenEvoMechanismMap.astro');

describe('first-reader attention hierarchy', () => {
  it('keeps the factual subject and outcome visible while progressively disclosing generic orientation detail', () => {
    expect(firstRun).toContain('layout="focus"');
    expect(firstRun).toContain('3B 和 7B 的第一轮实验');
    expect(firstRun).toContain('7B 持续更新参数，并完成最终测试；旧 3B 因购物接口和动作格式问题停止。');
    expect(orientation).toContain("layout?: 'compact' | 'narrative' | 'focus'");
    expect(orientation).toContain('class="research-orientation__details"');
    expect(firstRun).toContain('showGlossary={false}');
    expect(firstRun.indexOf('<ResearchGlossary')).toBeGreaterThan(firstRun.indexOf('id="first-run-summary"'));
    expect(orientation).toContain("details: '实验信息'");
    expect(orientation).not.toContain('.research-orientation[data-layout="focus"] .research-orientation__fields{display:none');
  });

  it('propagates the same attention rule only to high-confidence sibling pages', () => {
    expect(successor).toContain('layout="focus"');
    expect(successor).toContain('1.7B 已完成学习和最终测试；3B 还没有同口径最终结果。');
    expect(report).toContain('layout="focus"');
    expect(report).toContain('1.7B 最终测试 37.60 分、128 题中 1 题完全成功');
    expect(report).toContain('SEED 数字只是外部参考，不是本地配对对照。');
    expect(exploration).not.toContain('layout="focus"');
    expect(mechanism).toContain('layout="narrative"');
  });

  it('keeps route context visible but offers a compact, lower-density mode', () => {
    expect(routeContext).toContain('compact?: boolean');
    expect(routeContext).toContain('data-compact={compact');
    expect(routeContext).toContain('WebShop：按要求搜索、选规格、购买商品。');
    expect(routeContext).toContain('第一轮历史记录；不是当前运行。');
  });
});
