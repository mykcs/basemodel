import { readFileSync, readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const analysisPlan = readFileSync(
  new URL('../components/research/OpenEvoExperimentAnalysisPlan.astro', import.meta.url),
  'utf8',
);

const resultsScaffold = readFileSync(
  new URL('../components/research/OpenEvoExperimentResultsScaffold.astro', import.meta.url),
  'utf8',
);

const capabilityResultsRoot = new URL('../pages/research/seed-openevo/study/results/', import.meta.url);
const capabilityReportPages = readdirSync(capabilityResultsRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && entry.name.endsWith('-analysis'))
  .map((entry) => readFileSync(new URL(`${entry.name}/index.astro`, capabilityResultsRoot), 'utf8'));

describe('7B WebShop score comparison', () => {
  it('transcribes the Qwen2.5-7B WebShop slice of SEED Table 1 into HTML', () => {
    expect(analysisPlan).toContain("{ method: 'Vanilla', score: '5.9', success: '1.6' }");
    expect(analysisPlan).toContain("{ method: 'SDAR', score: '89.4', success: '82.8'");
    expect(analysisPlan).toContain("{ method: 'SEED (Ours)', score: '89.7', success: '78.1'");
    expect(analysisPlan).toContain('data-testid="webshop-7b-score-comparison"');
    expect(analysisPlan).toContain('SEED Table 1 ↗');
  });

  it('shows both completed OpenEVO 7B finals', () => {
    expect(analysisPlan).toContain('OpenEVO · 7B / self');
    expect(analysisPlan).toContain("t('无外部教师','No external teacher')");
    expect(analysisPlan).toContain('<strong>25.66</strong>');
    expect(analysisPlan).toContain('<strong>3.1%</strong><small>3/128 → 4/128</small>');
    expect(analysisPlan).toContain('OpenEVO · 7B + MiniMax');
    expect(analysisPlan).not.toContain("t('等待 primary final','primary final pending')");
    expect(analysisPlan).toContain('<strong>16.94</strong>');
    expect(analysisPlan).toContain('<strong>0.0%</strong>');
  });

  it('documents the historical MiniMax 16-of-1440 bootstrap branch as an incomplete design', () => {
    expect(analysisPlan).toContain('data-testid="stage1-choice-map"');
    expect(analysisPlan).toContain('MiniMax-M3');
    expect(analysisPlan).toContain('1,440 / 1,440');
    expect(analysisPlan).toContain('16 / 1,440');
    expect(analysisPlan).toContain('task000:0 · task000:1');
    expect(analysisPlan).toContain('same_16_records_reused_in_each_increment=true');
    expect(analysisPlan).toContain('Stage-2 updates');
    expect(analysisPlan).toContain('<strong>16.94</strong>');
    expect(analysisPlan).toContain('不能据此判断 SD-LoRA 本身无效');
  });

  it('shares the research table contract without inventing a page-local font system', () => {
    expect(resultsScaffold).toContain('border-top:1.5px solid var(--color-text)');
    expect(resultsScaffold).toContain('font-variant-numeric:tabular-nums lining-nums');
    expect(resultsScaffold).toContain('font-family:var(--font-interface)');
    expect(resultsScaffold).not.toContain('Times New Roman');
    expect(analysisPlan).toContain('.matrix-wrap,.plan-table-wrap');
    expect(analysisPlan).toContain('font-family:var(--font-interface)');
    expect(analysisPlan).not.toContain('Times New Roman');
    for (const page of capabilityReportPages) {
      expect(page).toContain('OpenEvoExperimentResultsScaffold');
    }
  });

  it('keeps the paper score and local OpenEVO score in separate claim domains', () => {
    expect(analysisPlan).toContain('不代表它们已经是同一批 128 题、同一模型保存点（checkpoint）或可以直接相减的方法效果');
    expect(analysisPlan).toContain('does not mean they already share the same exact 128 tasks/checkpoint or can be directly subtracted as a method effect');
  });
});
