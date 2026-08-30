import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const analysisPlan = readFileSync(
  new URL('../components/research/OpenEvoExperimentAnalysisPlan.astro', import.meta.url),
  'utf8',
);

describe('7B WebShop score comparison', () => {
  it('transcribes the Qwen2.5-7B WebShop slice of SEED Table 1 into HTML', () => {
    expect(analysisPlan).toContain("{ method: 'Vanilla', score: '5.9', success: '1.6' }");
    expect(analysisPlan).toContain("{ method: 'SDAR', score: '89.4', success: '82.8'");
    expect(analysisPlan).toContain("{ method: 'SEED (Ours)', score: '89.7', success: '78.1'");
    expect(analysisPlan).toContain('data-testid="webshop-7b-score-comparison"');
    expect(analysisPlan).toContain('SEED Table 1 ↗');
  });

  it('shows OpenEVO 7B without a teacher and reserves the MiniMax row without inventing a score', () => {
    expect(analysisPlan).toContain('OpenEVO · 7B / self');
    expect(analysisPlan).toContain("t('无外部教师','No external teacher')");
    expect(analysisPlan).toContain('<strong>25.66</strong>');
    expect(analysisPlan).toContain('<strong>3.1%</strong><small>3/128 → 4/128</small>');
    expect(analysisPlan).toContain('OpenEVO · 7B + MiniMax');
    expect(analysisPlan).toContain("t('最终评测尚未完成','Final evaluation not yet complete')");
  });

  it('keeps the paper score and local OpenEVO score in separate claim domains', () => {
    expect(analysisPlan).toContain('不代表它们已经是同一批 128 题、同一 checkpoint 或可以直接相减的方法效果');
    expect(analysisPlan).toContain('does not mean they already share the same exact 128 tasks/checkpoint or can be directly subtracted as a method effect');
  });
});
