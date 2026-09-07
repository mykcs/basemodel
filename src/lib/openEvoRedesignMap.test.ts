import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');
const gateway = read('../components/research/OpenEvoRedesignMap.astro');
const exploration = read('../components/research/OpenEvoSuccessorExplorationMap.astro');
const report = read('../components/research/OpenEvoSuccessorReport.astro');
const fairness = read('../components/research/OpenEvoHarnessFairnessPanel.astro');
const narrative = read('../data/openEvoSuccessorNarrative.ts');
const zh = read('../pages/research/seed-openevo/study/capability-exploration/openevo-2-0/index.astro');
const en = read('../pages/en/research/seed-openevo/study/capability-exploration/openevo-2-0/index.astro');
const zhExplore = read('../pages/research/seed-openevo/study/capability-exploration/openevo-2-0/exploration/index.astro');
const enReport = read('../pages/en/research/seed-openevo/study/capability-exploration/openevo-2-0/report/index.astro');

describe('OpenEvo 3B + 1.7B successor dual narrative', () => {
  it('makes one successor expose exactly two readings over one shared fact set', () => {
    expect(gateway).toContain('3B 与 1.7B 的学习实验');
    expect(gateway).toContain('data-successor-mode="exploration"');
    expect(gateway).toContain('data-successor-mode="report"');
    expect((gateway.match(/data-successor-mode=/g) || []).length).toBe(2);
    expect(gateway).toContain('OPEN_EVO_STAGE1_FREEZE.id');
    expect(narrative).toContain("id: '202609030400'");
    expect(gateway).toContain('报告与探索过程使用同一份实验记录');
  });

  it('keeps the exploration view chronological, falsifiable, and visibly backtracking', () => {
    expect(exploration).toContain('ROGUELIKE RESEARCH MAP · EXPLORATION');
    expect(exploration).toContain('步数上限：15 步与 30 步');
    expect(exploration).toContain('30 → 15');
    expect(exploration).toContain('FREEZE_ONE_SHARED_STAGE1_HARNESS');
    expect(exploration).toContain('PATCH · MODEL PATH');
    expect(exploration).toContain('4096 失败 → bounded A2');
    expect(exploration).toContain('PRE_STAGE2_READY');
  });

  it('uses the report view as a linear What / Why / Evidence / Boundary argument', () => {
    expect(report).toContain('REPORT / PAPER VIEW · STAGE 1 → QWEN3-1.7B FINAL CLOSEOUT');
    for (const label of ['操作', '理由', '记录', '适用范围']) expect(report).toContain(`<dt>{t("${label}",`);
    expect((report.match(/class="paper-step__meaning"/g) || []).length).toBe(12);
    expect(report).toContain('report-chronology');
    expect(report).toContain('共享购物规则');
    expect(report).toContain('Qwen2.5-3B 与 Qwen3-1.7B');
    expect(report).toContain('MiniMax 对已完成 trajectory 做 task-after analysis');
    expect(report).toContain('可加载的参数增量、文本记忆、技能集合和系统指令');
    expect(report).toContain('stage2_authorized=false');
    expect(report).toContain('stage2_requires_separate_activation=true');
  });

  it('publishes the sealed 1.7B final panel without confusing it with the training trajectory score', () => {
    expect(narrative).toContain('OPEN_EVO_Q17_FINAL');
    expect(narrative).toContain('score: 37.60');
    expect(narrative).toContain('successPercent: 0.78125');
    expect(report).toContain('qwen3-1p7b-final-closeout');
    expect(report).toContain('R159 = {final17.stage2.finalTrainingTrajectoryScore.toFixed(2)}');
    expect(report).toContain('不是最终测试分数');
    expect(report).toContain('engineering-invalid');
    expect(report).toContain('128/128 valid');
    expect(report).toContain('PR #348 · final closeout evidence');
  });

  it('preserves the scientific fairness boundary instead of claiming zero scaffolding', () => {
    expect(fairness).toContain('strategy-neutral bootstrap harness');
    expect(fairness).toContain('不是“零脚手架裸跑”');
    expect(fairness).toContain('task-solving strategy');
    expect(fairness).toContain('hard action envelope');
    expect(fairness).toContain('external teacher actions');
    expect(fairness).toContain('final-panel information');
  });

  it('keeps historical evidence from being relabeled into the successor', () => {
    expect(report).toContain('旧 3B 轨迹只能作为 predecessor evidence，不能改名接到 successor');
    expect(exploration).toContain('这些诊断发生在不同历史批次');
    expect(exploration).toContain('旧记录保留原身份');
  });

  it('mounts the gateway and both views bilingually', () => {
    expect(zh).toContain('OpenEvoRedesignMap');
    expect(en).toContain('OpenEvoRedesignMap');
    expect(zhExplore).toContain('OpenEvoSuccessorExplorationMap');
    expect(enReport).toContain('OpenEvoSuccessorReport');
  });
});
