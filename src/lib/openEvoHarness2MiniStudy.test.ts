import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { openEvoHarness2Qualification as q } from '../data/openEvoHarness2Qualification';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');
const component = read('../components/research/OpenEvoHarness2MiniStudy.astro');
const parent = read('../components/research/OpenEvo2Strategy.astro');
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
    expect(component).toContain('Mechanical PASS did not mean better behavior');
    expect(component).toContain('机械 PASS，不等于行为变好');
    expect(component).toContain('SCIENTIFIC');
    expect(component).toContain('HOLD');
    expect(component).toContain('不创建 formal activation');
    expect(component).toContain('do not activate v1');
    expect(component).not.toContain('formal activation = PASS');
  });

  it('preserves the v1 repair plan and records the later 2.0.1 status', () => {
    expect(component).toContain('Prompt 与 parser 的语言规则没对齐');
    expect(component).toContain('抽象动作词又被 3B 当成按钮');
    expect(component).toContain('Context Governor 没有达到预定的 selective / thin 设计');
    expect(component).toContain('共享 prompt 明确 English-only');
    expect(component).toContain('v1 closeout 当时计划：换一个全新的资格窗口');
    expect(component).toContain('pagination / return-to-search');
    expect(component).toContain('Mini Study 01 的 v1 结果保持原样');
    expect(component).toContain('mechanical qualification = PASS');
    expect(component).toContain('scientific closeout = HOLD_FOR_STAGE2_READINESS_AUDIT');
    expect(component).toContain('下一阶段 = STAGE2_READINESS_AUDIT_AND_DRESS_REHEARSAL');
    expect(component).toContain('不能把它写成已经证实的因果原因');
    expect(component).toContain('不能继续把责任归到“3B 本身”');
    expect(component).toContain('不能单独证明它造成了非法动作增加');
    expect(component).not.toContain('3B 本身在语言 contract');
  });

  it('wires the study into the bilingual OpenEVO 2.0 research path', () => {
    expect(zhRoute).toContain('OpenEvoHarness2MiniStudy');
    expect(enRoute).toContain('OpenEvoHarness2MiniStudy');
    expect(parent).toContain('/openevo-2-0/harness-2-0/');
    expect(parent).toContain('MINI STUDY 01 · 128 + 128');
    expect(chooser).toContain('第三版 · 2.0.1 机械资格已完成');
    expect(chooser).toContain('HOLD_FOR_STAGE2_READINESS_AUDIT');
    expect(chooser).toContain('formal_stage2_authorized=false');
    expect(parent).toContain('这条 Harness 分支在方法空间里的位置');
    expect(parent).toContain('部署时只用学到的 policy');
    expect(parent).toContain('不能把 Harness 2.x 写成“更接近 SEED”的必然下一步');
    expect(parent).toContain('https://github.com/jinyangwu/SEED');
  });
});
