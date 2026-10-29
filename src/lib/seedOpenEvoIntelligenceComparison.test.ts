import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { seedOpenEvoIntelligenceComparison, stage2TeacherBoundary } from '../data/seedOpenEvoIntelligenceComparison';

const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8');
const component = read('../components/research/SeedOpenEvoTrainingDesignOverview.astro');
const hub = read('../components/research/SeedOpenEvoResearchHub.astro');

describe('SEED and OpenEVO Intelligence UI comparison contract', () => {
  const initialization = seedOpenEvoIntelligenceComparison[0]!;
  const evolution = seedOpenEvoIntelligenceComparison[1]!;

  it('has two major stages, both including parameter learning', () => {
    expect(seedOpenEvoIntelligenceComparison).toHaveLength(2);
    expect(seedOpenEvoIntelligenceComparison.map((stage) => stage.id)).toEqual(['stage-1', 'stage-2']);
    expect(initialization.name.zh).toBe('学习信号与能力初始化');
    expect(evolution.name.zh).toBe('内部反馈驱动的持续演化');
    for (const stage of seedOpenEvoIntelligenceComparison) {
      expect(stage.rows.some((row) => row.tone === 'model')).toBe(true);
      expect(stage.result.zh).toMatch(/参数/);
    }
  });

  it('renders both sides from the same immutable shared wording, not separately hand-typed labels', () => {
    expect(component).toContain("(['seed', 'openEvo'] as const).map((side)");
    expect(component).toContain('say(step.sharedAction)');
    expect(component).toContain('say(step.sharedBoundary)');
    for (const stage of seedOpenEvoIntelligenceComparison) {
      for (const row of stage.rows) {
        expect(row.sharedAction.zh.length).toBeGreaterThan(6);
        expect(row.sharedAction.en.length).toBeGreaterThan(6);
        expect(row.seed.explanation.zh).toBeTruthy();
        expect(row.openEvo.explanation.zh).toBeTruthy();
      }
    }
    expect(initialization.rows[0]!.sharedAction.zh).toBe('Qwen 自主采集 WebShop 任务轨迹');
    expect(initialization.rows[0]!.seed.explanation).toBe(initialization.rows[0]!.openEvo.explanation);
    expect(evolution.rows[1]!.sharedAction.zh).toBe('从新轨迹中构造学习信号');
  });

  it('puts the role first and only the replaceable teacher implementation in parentheses', () => {
    const teacher = initialization.rows.find((row) => row.id === 'external-teacher');
    expect(teacher?.sharedAction.zh).toBe('外部高能力教师模型 API');
    expect(teacher?.similarity).toBe('same-operation');
    expect(teacher?.seed.replaceableTeacher?.zh).toBe('（GLM-5.2）');
    expect(teacher?.openEvo.replaceableTeacher?.zh).toBe('（MiniMax-M3）');
    expect(teacher?.seed.explanation).toBe(teacher?.openEvo.explanation);
  });

  it('gives both Stage-2 columns the verbatim absence-of-external-teacher boundary', () => {
    const signal = evolution.rows.find((row) => row.id === 'online-signal');
    expect(signal?.sharedBoundary).toBe(stage2TeacherBoundary);
    expect(stage2TeacherBoundary.zh).toBe('本阶段不再调用 Stage 1 的外部高能力教师模型 API。');
    expect(signal?.seed.technique?.zh).toContain('当前策略自行生成');
    expect(signal?.openEvo.technique?.zh).toContain('候选更新');
  });

  it('distinguishes algorithms and persistent state without claiming they are interchangeable', () => {
    expect(initialization.rows.find((row) => row.id === 'initial-training')?.seed.technique?.zh).toContain('SFT');
    expect(initialization.rows.find((row) => row.id === 'initial-training')?.openEvo.technique?.zh).toContain('OPSD');
    const update = evolution.rows.find((row) => row.id === 'online-update');
    expect(update?.seed.technique?.zh).toContain('GRPO + OPD');
    expect(update?.openEvo.technique?.zh).toContain('SD-LoRA');
    expect(update?.seed.explanation.zh).toContain('不是部署时持续读取的外部技能库');
    expect(update?.openEvo.explanation.zh).toContain('Text Memory');
    expect(evolution.rows.find((row) => row.id === 'next-round')?.openEvo.explanation.zh).toContain('NOOP');
  });

  it('makes the comparison the first explanatory section of Flow and retains linked evidence', () => {
    expect(hub.indexOf('id="training-design"')).toBeLessThan(hub.indexOf('id="questions"'));
    expect(hub).toContain('SeedOpenEvoTrainingDesignOverview');
    expect(hub).not.toContain('第二阶段（Stage 2，持续学习）才用这些轨迹和复盘');
    expect(component).toContain('data-intelligence-comparison');
    expect(component).toContain('data-framework={side}');
    expect(component).toContain('data-learning-comparison-scope');
    expect(component).toContain('https://github.com/jinyangwu/SEED');
  });
});
