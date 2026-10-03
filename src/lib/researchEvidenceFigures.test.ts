import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');

const shell = read('src/components/research/ResearchEvidenceFigure.astro');
const beta = read('src/components/research/BetaTrainingEvidenceFigure.astro');
const samePanel = read('src/components/research/SamePanelFinalEvidenceFigure.astro');
const capacity = read('src/components/research/CapacityTradeoffEvidenceFigure.astro');
const study = read('src/components/research/OpenEvoEffectiveStateGdrLoraStudy.astro');

describe('C02 research evidence figures', () => {
  it('uses one narrow figure shell for claim, boundary, source, and pending state', () => {
    for (const term of [
      'data-research-evidence-figure',
      '这张图支持',
      '这张图不支持',
      'sourceHref',
      'status === \'pending\'',
    ]) expect(shell).toContain(term);
  });

  it('renders the beta trajectory as native SVG rather than a screenshot-only figure', () => {
    for (const term of [
      '<svg',
      'viewBox=',
      'beta-trend__raw-line',
      'beta-trend__windows',
      'beta-trend__extension',
      'Task Score / 100',
      'data-beta-round-reader',
    ]) expect(beta).toContain(term);
    expect(beta).not.toContain('<canvas');
    expect(beta).not.toContain('echarts.init');
  });

  it('keeps the beta y-axis untruncated and exposes the transformation in prose', () => {
    expect(beta).toContain('const yTicks = [0, 20, 40, 60, 80, 100]');
    expect(beta).toContain('纵轴从0到100，不截断');
    expect(beta).toContain('五个互不重叠窗口均值');
    expect(beta).toContain('第160轮延长实验起点');
  });

  it('has a keyboard and touch friendly round reader plus a static raw table', () => {
    expect(beta).toContain('type="range"');
    expect(beta).toContain('<output data-beta-round-output');
    expect(beta).toContain('addEventListener(\'input\'');
    expect(beta).toContain('展开104轮逐轮数据');
    expect(beta).toContain('<table>');
  });

  it('keeps the same-panel comparison as two separate metrics with one denominator', () => {
    expect(samePanel).toContain('SAME_PANEL_FINAL_FIGURE');
    expect(samePanel).toContain('Task Score / 100');
    expect(samePanel).toContain('完整成功率');
    expect(samePanel).toContain('row.exactCount}/{figure.denominator}');
    expect(samePanel).not.toContain('60.72');
    expect(samePanel).not.toContain('45.98');
    expect(samePanel).not.toContain('20.77');
  });

  it('fails closed on rank32 publication instead of drawing unpublished points', () => {
    expect(capacity).toContain('CAPACITY_TRADEOFF_FIGURE');
    expect(capacity).toContain('status="pending"');
    expect(capacity).toContain('这里故意不画点');
    expect(capacity).toContain('等待 PR 805 接入');
    for (const forbidden of ['0.6297622', '0.6118560', '205551528', '51410296']) {
      expect(capacity).not.toContain(forbidden);
    }
  });

  it('wires all three figure roles into the canonical bounded study page', () => {
    expect(study).toContain('<SamePanelFinalEvidenceFigure locale={locale} />');
    expect(study).toContain('<BetaTrainingEvidenceFigure locale={locale} />');
    expect(study).toContain('<CapacityTradeoffEvidenceFigure locale={locale} />');
    expect(study).not.toContain('<MetricEvidenceFigure item={metricCharts.r200TaskScore} />');
  });

  it('keeps other existing W&B evidence figures intact', () => {
    for (const term of [
      '<MetricEvidenceFigure item={metricCharts.taskScore} />',
      '<MetricEvidenceFigure item={metricCharts.loss} />',
      '<MetricEvidenceFigure item={metricCharts.taskVector} />',
      '<MetricEvidenceFigure item={metricCharts.entropy} />',
    ]) expect(study).toContain(term);
  });

  it('keeps no-JavaScript meaning in server-rendered SVG, tables, and captions', () => {
    expect(beta.indexOf('<svg')).toBeLessThan(beta.indexOf('<script'));
    expect(beta).toContain('<details class="beta-trend__raw-table">');
    expect(samePanel).toContain('<table>');
    expect(capacity).toContain('<table>');
    expect(shell).toContain('<figcaption>');
  });

  it('does not add a second charting dependency', () => {
    for (const source of [beta, samePanel, capacity]) {
      expect(source).not.toContain('from \'d3\'');
      expect(source).not.toContain('from \'echarts\'');
    }
  });
});
