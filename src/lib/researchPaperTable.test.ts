import { describe, expect, it } from 'vitest';
import { isPaperTableNumeric, paperTableText, preparePaperTable } from './researchPaperTable';

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
