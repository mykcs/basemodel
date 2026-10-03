import { describe, expect, it } from 'vitest';
import {
  displayScientificCell,
  escapeLatexText,
  scientificTableToCsv,
  scientificTableToLatex,
  scientificTableCell,
  validateScientificTableView,
  type ScientificTableView,
} from './scientificTable';
import { RANK32_CAPACITY_TABLE, SAME_PANEL_FINAL_TABLE } from '../data/scientificResearchTables';
import { EFFECTIVE_STATE_GDR_LORA_STUDY as study } from '../data/effectiveStateGdrLoraStudy';

const fixture: ScientificTableView = {
  id: 'fixture',
  caption: 'A&B_% table',
  comparisonId: 'fixture-comparison',
  rowHeaderLabel: 'Metric',
  columns: [
    { key: 'value', label: 'Value', unit: 'ratio', align: 'right' },
    { key: 'note', label: 'Note', align: 'left' },
  ],
  rows: [
    { id: 'negative', label: 'negative', cells: { value: { raw: -0.25 }, note: { raw: '=SUM(A1:A2)' } } },
    { id: 'missing', label: 'missing', cells: { value: { raw: null }, note: { raw: '50% & ready' } } },
  ],
  notes: ['CI crosses zero; this is not equivalence.'],
  sourceIds: ['source_1'],
  exportBasePath: '/exports/fixture',
};

describe('scientific table semantics', () => {
  it('keeps display precision separate from raw values and missing distinct from zero', () => {
    expect(displayScientificCell({ raw: 0.6118559549174762, display: '0.6119' })).toBe('0.6119');
    expect(displayScientificCell({ raw: null })).toBe('—');
    expect(displayScientificCell({ raw: 0 })).toBe('0');
  });

  it('rejects incomplete or non-finite table views', () => {
    expect(() => validateScientificTableView({ ...fixture, rows: [{ id: 'bad', label: 'bad', cells: { value: { raw: 1 } } }] })).toThrow(/missing cell note/);
    expect(() => validateScientificTableView({ ...fixture, rows: [{ id: 'nan', label: 'nan', cells: { value: { raw: Number.NaN }, note: { raw: 'x' } } }] })).toThrow(/non-finite/);
  });

  it('exports spreadsheet-safe CSV without corrupting scientific negative numbers', () => {
    const csv = scientificTableToCsv(fixture);
    expect(csv).toContain('"-0.25"');
    expect(csv).toContain('"\'=SUM(A1:A2)"');
    expect(csv).toContain('"NA"');
    expect(csv).not.toContain('"0","50% & ready"');
  });

  it('escapes LaTeX text and keeps null explicit', () => {
    expect(escapeLatexText('A&B_%')).toBe(String.raw`A\&B\_\%`);
    const tex = scientificTableToLatex(fixture);
    expect(tex).toContain(String.raw`\caption{A\&B\_\% table}`);
    expect(tex).toContain(String.raw`\textemdash{}`);
    expect(tex).toContain(String.raw`50\% \& ready`);
  });

  it('builds rank32 and frozen-final views from scientific owners rather than duplicated literals', () => {
    const rankCsv = scientificTableToCsv(RANK32_CAPACITY_TABLE);
    expect(rankCsv).toContain('"0.6297621936440276"');
    expect(rankCsv).toContain('"0.6118559549174762"');
    expect(rankCsv).toContain('"205551528"');
    expect(rankCsv).toContain('"51410296"');

    const finalCsv = scientificTableToCsv(SAME_PANEL_FINAL_TABLE);
    expect(finalCsv).toContain(`"${String(study.threeWayFinal.directApply.score)}"`);
    expect(finalCsv).toContain(`"${String(study.threeWayFinal.off.score)}"`);
    expect(finalCsv).toContain(`"${String(study.threeWayFinal.on.score)}"`);
    expect(finalCsv).toContain('"NA"');
  });

  it('never upgrades missing or cross-contract evidence into a numeric winner', () => {
    const dynamic = SAME_PANEL_FINAL_TABLE.rows.find((row) => row.id === 'dynamic-alpha-beta')!;
    expect(scientificTableCell(dynamic, 'finalScore', SAME_PANEL_FINAL_TABLE.id).raw).toBeNull();
    expect(SAME_PANEL_FINAL_TABLE.notes.join(' ')).toContain('不同');
    expect(RANK32_CAPACITY_TABLE.notes.join(' ')).toContain('不能写成等价');
  });
});
