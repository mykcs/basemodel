import { describe, expect, it } from 'vitest';
import { preparePaperTable, paperTableText } from './researchPaperTable';

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
