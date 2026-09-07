import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { openEvoHarness2Qualification as q } from '../data/openEvoHarness2Qualification';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');
const component = read('../components/research/OpenEvoHarness2MiniStudy.astro');
const gateway = read('../components/research/OpenEvoRedesignMap.astro');
const exploration = read('../components/research/OpenEvoSuccessorExplorationMap.astro');
const lobby = read('../components/research/OpenEvoCapabilityMapLobby.astro');
const narrative = read('../data/openEvoSuccessorNarrative.ts');
const chooser = read('../components/research/OpenEvoStage2StrategyChooser.astro');
const zhRoute = read('../pages/research/seed-openevo/study/capability-exploration/openevo-2-0/harness-2-0.astro');
const enRoute = read('../pages/en/research/seed-openevo/study/capability-exploration/openevo-2-0/harness-2-0.astro');

describe('OpenEVO Harness 2.0 mini study publication', () => {
  it('publishes the immutable paired qualification facts', () => {
    expect(q.rowsPerCell).toBe(128);
    expect(q.formalTaskConsumption).toBe(0);
    expect(q.finalPanelAccess).toBe(0);
    expect(q.receiptSha256).toBe('78debcd8ba58ed0e44bafb1fad867cf7e11174d30a0fa3be81f0938b37b23527');
    expect(q.evidenceCommit).toBe('6091b4cc389842f11b35f7ff43335d6ba3215678');
    expect(q.mechanicalStatus).toBe('PASS');
    expect(q.activationDecision).toContain('HOLD_NO_FORMAL_ACTIVATION');
    expect(q.control.invalidTerminated).toBe(40);
    expect(q.candidate.invalidTerminated).toBe(54);
    expect(q.paired.controlOnlyInvalid).toBe(11);
    expect(q.paired.candidateOnlyInvalid).toBe(25);
    expect(q.mechanisms.step0TokenDelta).toBe(401);
  });

  it('keeps mechanical PASS separate from scientific activation', () => {
    expect(component).toContain('Passing that check established only that tolerance was not exceeded');
    expect(component).toContain('通过检查只说明未超过预设容忍线，不能证明行为改善');
    expect(component).toContain('FORMAL TRAINING');
    expect(component).toContain('暂停启用');
    expect(component).toContain('没有转化为执行授权');
    expect(component).toMatch(/formal (?:Stage 2 was not authorized|training was held)/);
    expect(component).toContain('did not grant execution authority');
    expect(component).not.toContain('formal activation = PASS');
  });

  it('preserves the v1 repair plan and records the later 2.0.1 status', () => {
    expect(component).toContain('动作解析程序拒绝中文，而提示没有明确要求用英文输出');
    expect(component).toContain('被当成按钮名的动作词');
    expect(component).toContain('未实现只选择少量相关经验的设计');
    expect(component).toContain('共同提示明确要求英文输出');
    expect(component).toContain('使用另一批训练任务作检查');
    expect(component).toContain('pagination / return-to-search');
    expect(component).toContain('第一版对照结果保持原样');
    expect(component).toContain('后来的 2.0.1 修订通过了接口检查');
    expect(component).toContain('当时仍在等待后续学习的准备审查，没有正式训练授权');
    expect(component).toContain('training-readiness audit, without formal training authority');
    expect(component).toContain('不能把它写成已经证实的因果原因');
    expect(component).toContain('这个对照没有单独检验模型规模的作用');
    expect(component).toContain('不能单独证明无效动作因此增加');
    expect(component).not.toContain('3B 本身在语言 contract');
  });

  it('keeps the historical mini-study reachable without making its HOLD the current successor state', () => {
    expect(zhRoute).toContain('OpenEvoHarness2MiniStudy');
    expect(enRoute).toContain('OpenEvoHarness2MiniStudy');
    expect(lobby).toContain('/openevo-2-0/harness-2-0/');
    expect(gateway).toContain('OPEN_EVO_STAGE1_FREEZE.id');
    expect(narrative).toContain("id: '202609030400'");
    expect(gateway).toContain('设计与排查过程');
    expect(gateway).toContain('实验报告');
    expect(exploration).toContain('FREEZE_ONE_SHARED_STAGE1_HARNESS');
    expect(exploration).toContain('paired');
    expect(chooser).toContain('第三次转折 · 从 Stage 1 重开');
    expect(chooser).toContain('Harness201.1 后重新采 Stage 1');
    expect(chooser).not.toContain('Stage 1 不重做');
    expect(component).toContain('2.0.1 后续检查 · 历史记录');
    expect(component).toContain('Harness201.1 与重新采集初始经验属于新实验记录');
  });
});
