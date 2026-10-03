import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');
const component = read('../components/research/ScientificTable.astro');
const rankOwner = read('../components/research/OpenEvoSdLoraBoundedRecurrence.astro');
const finalOwner = read('../components/research/OpenEvoEffectiveStateGdrLoraStudy.astro');
const tables = read('../data/scientificResearchTables.ts');

describe('C01 scientific table publication', () => {
  it('uses native table semantics and a keyboard-focusable local scroll region', () => {
    expect(component).toContain('<table>');
    expect(component).toContain('<caption>');
    expect(component).toContain('scope="col"');
    expect(component).toContain('scope="row"');
    expect(component).toContain('scope="rowgroup"');
    expect(component).toContain('tabindex="0"');
    expect(component).toContain('overflow-x:auto');
    expect(component).toContain('@media print');
  });

  it('mounts the shared view on the two intended scientific callers only', () => {
    expect(rankOwner).toContain("import ScientificTable from './ScientificTable.astro'");
    expect(rankOwner).toContain('view={RANK32_CAPACITY_TABLE}');
    expect(finalOwner).toContain("import ScientificTable from './ScientificTable.astro'");
    expect(finalOwner).toContain('view={SAME_PANEL_FINAL_TABLE}');
  });

  it('keeps rank32 values bound to the post-advisor source object', () => {
    for (const sourcePath of [
      'postAdvisor.B.rank128.mean_task_score',
      'postAdvisor.B.rank32.mean_task_score',
      'postAdvisor.B.rank128.exact_success_count',
      'postAdvisor.B.rank32.exact_success_count',
      'postAdvisor.B.rank128.final_adapter_bytes',
      'postAdvisor.B.rank32.final_adapter_bytes',
    ]) expect(tables).toContain(sourcePath);
  });

  it('keeps different-panel SEED evidence outside the same-panel table', () => {
    expect(finalOwner).toContain('外部参考');
    expect(finalOwner).toContain('不放进同题表中比较高低');
    expect(tables).toContain('由于任务 panel 不同');
    expect(tables).not.toContain("group: 'SEED");
  });

  it('preserves missing dynamic alpha+beta as null rather than zero', () => {
    expect(tables).toContain("id: 'dynamic-alpha-beta'");
    expect(tables.match(/raw: null/g)?.length).toBeGreaterThanOrEqual(2);
    expect(tables).toContain("finalScore: { raw: null }");
    expect(tables).toContain("exact: { raw: null }");
  });

  it('reuses the existing MathFormula path instead of inventing CSS/HTML math', () => {
    expect(finalOwner).toContain("import MathFormula from '../common/MathFormula.astro'");
    expect(finalOwner).not.toContain('<sub>');
    expect(finalOwner).not.toContain('<sup>');
  });
});
