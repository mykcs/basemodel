import { describe, expect, it } from 'vitest';
import { isPaperTableNumeric, preparePaperTable, paperTableText } from './researchPaperTable';

describe('same-source narrow scientific records', () => {
  const head = '<thead><tr><th rowspan="2">模型</th><th colspan="2">旧方案</th><th colspan="2">Ceiling</th></tr><tr><th>完整成功</th><th>均分</th><th>完整成功</th><th>均分</th></tr></thead>';
  const body = '<tbody><tr><th>3B</th><td>7</td><td>0.0149</td><td>0</td><td><strong>0.00145</strong></td></tr></tbody>';

  it('keeps every original value, zero and numeric token while disambiguating repeated column names', () => {
    const result = preparePaperTable(head + body, true);
    expect(paperTableText(result)).toBe(paperTableText(head + body));
    expect(result).toContain('scope="row" role="rowheader"');
    expect(result).toContain('data-paper-label="旧方案 · 完整成功"');
    expect(result).toContain('data-paper-label="Ceiling · 完整成功"');
    expect(result).toContain('<div class="paper-record-value"><strong>0.00145</strong></div>');
    expect(result).toContain('<div class="paper-record-value">0</div>');
  });

  it('does not turn the unmeasured em dash into a measured zero', () => {
    const result = preparePaperTable('<thead><tr><th>方法</th><th>Score</th></tr></thead><tbody><tr><td>未做</td><td>—</td></tr></tbody>', true);
    expect(result).toContain('<div class="paper-record-value">—</div>');
    expect(result).not.toContain('>0<');
  });

  it('requires an explicit reading representation for ambiguous spanning body cells', () => {
    expect(() => preparePaperTable(head + '<tbody><tr><td colspan="5">整组说明</td></tr></tbody>', true)).toThrow(/Spanning body cells/);
    expect(() => preparePaperTable(head + '<tbody><tr><td>3B</td></tr></tbody>', true)).toThrow(/same complete columns/);
  });

  it('keeps a shared two-column scientific value once with both native column names', () => {
    const source = '<thead><tr><th>方法</th><th>旧题</th><th>新题</th></tr></thead><tbody><tr><th>相同起点</th><td colspan="2">未测</td></tr></tbody>';
    const result = preparePaperTable(source, true);
    expect(paperTableText(result)).toBe(paperTableText(source));
    expect(result).toContain('data-paper-label="旧题 · 新题"');
    expect(result.match(/>未测</g)).toHaveLength(1);
  });

  it('allows an intentionally unnamed row-identity column but rejects unnamed values', () => {
    expect(preparePaperTable('<thead><tr><th></th><th>Score</th></tr></thead><tbody><tr><th>模型A</th><td>0</td></tr></tbody>', true)).toContain('scope="row"');
    expect(() => preparePaperTable('<thead><tr><th>方法</th><th></th></tr></thead><tbody><tr><th>A</th><td>0</td></tr></tbody>', true)).toThrow(/complete native column/);
  });

  it('keeps preregistered footer thresholds labelled by their actual metric', () => {
    const source = '<thead><tr><th>候选</th><th>JS</th><th>Logit相对误差</th></tr></thead><tbody><tr><th>K64</th><td>0.1</td><td>0.2</td></tr></tbody><tfoot><tr><th>预注册要求</th><td>≤1e-4</td><td>≤0.05</td></tr></tfoot>';
    const result = preparePaperTable(source, true);
    expect(paperTableText(result)).toBe(paperTableText(source));
    expect(result).toContain('<tfoot role="rowgroup">');
    expect(result).toContain('data-paper-label="JS"><div class="paper-record-value">≤1e-4</div>');
    expect(result).toContain('data-paper-label="Logit相对误差"><div class="paper-record-value">≤0.05</div>');
  });

  it('keeps optional native tables unchanged apart from the existing numeric tagging', () => {
    const result = preparePaperTable(head + body);
    expect(result).not.toContain('data-paper-label');
    expect(paperTableText(result)).toBe(paperTableText(head + body));
  });
});

describe('paper table scientific-content preservation', () => {
  it('keeps values, units, uncertainty and missing states intact while aligning numerical columns', () => {
    const source = '<thead><tr><th>Method</th><th>Score</th><th>95% CI</th></tr></thead><tbody><tr><th>A</th><td><strong>60.72</strong></td><td>−15.02 to −5.60</td></tr><tr><th>B</th><td>—</td><td>Not run</td></tr></tbody>';
    const result = preparePaperTable(source);
    expect(paperTableText(result)).toBe(paperTableText(source));
    expect(result).toContain('<th data-numeric>Score</th>');
    expect(result).toContain('<td data-numeric><strong>60.72</strong></td>');
    expect(result).toContain('<td>—</td>');
    expect(result).toContain('−15.02 to −5.60');
    expect(result).not.toContain('>0<');
  });
  it('keeps mixed descriptive columns left aligned and never duplicates existing numerical markers', () => {
    const result = preparePaperTable('<thead><tr><th>Observation</th></tr></thead><tbody><tr><td data-numeric="">0/64</td></tr><tr><td>Not comparable: different panel</td></tr></tbody>');
    expect(result).toContain('<th>Observation</th>');
    expect(result.match(/data-numeric/g)).toHaveLength(1);
  });
  it('makes an existing real caption visible without replacing its subject or source identity', () => {
    const result = preparePaperTable('<caption id="panel" class="sr-only">Frozen 128-task panel</caption><tbody><tr><td>3.71</td></tr></tbody>');
    expect(result).toContain('<caption id="panel">Frozen 128-task panel</caption>');
    expect(result).not.toContain('sr-only');
  });
  it('aligns numeric row headings with the corresponding column heading', () => {
    const result = preparePaperTable('<thead><tr><th>Checkpoint</th><th>Score</th></tr></thead><tbody><tr><th scope="row">128</th><td>60.72</td></tr></tbody>');
    expect(result).toContain('<th data-numeric>Checkpoint</th>');
    expect(result).toContain('<th scope="row" data-numeric>128</th>');
  });
  it('does not infer grouped or spanning headers from an incomplete rectangular matrix', () => {
    const result = preparePaperTable('<thead><tr><th colspan="2">Protocol</th></tr></thead><tbody><tr><td colspan="2">128</td></tr></tbody>');
    expect(result).toContain('<th colspan="2">Protocol</th>');
  });
  it.each(['0/64','−10.06','1.2e-5','105.11 s','约 63%','Not run','rank128','R159'])('retains the original text %s', value => {
    const source = '<tbody><tr><td>'+value+'</td></tr></tbody>';
    expect(paperTableText(preparePaperTable(source))).toBe(value);
  });
  it('classifies ordinary measurements without treating scientific labels as numeric data', () => {
    expect(isPaperTableNumeric('0/64')).toBe(true);
    expect(isPaperTableNumeric('−10.06')).toBe(true);
    expect(isPaperTableNumeric('rank128')).toBe(false);
    expect(isPaperTableNumeric('Not run')).toBe(false);
  });
});
