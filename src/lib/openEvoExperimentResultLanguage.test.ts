import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');
const scaffold = read('../components/research/OpenEvoExperimentResultsScaffold.astro');
const analysis = read('../components/research/OpenEvoExperimentAnalysisPlan.astro');
const legacyResultNote = read('../components/research/OpenEvoWebShopResultNote.astro');
const movedPrimer = read('../components/research/ResearchPrimerMoved.astro');
const resultsAppendix = read('../components/research/OpenEvoWebShopResultsAppendix.astro');
const program = read('../data/openEvoWebShopProgram.ts');
const hero = read('../components/research/OpenEvoWebShopResultsHero.astro');
const protocol = read('../components/research/OpenEvoWebShopResultsProtocol.astro');
const planIndex = read('../components/research/OpenEvoExperimentAnalysisPlanIndex.astro');
const nextSteps = read('../components/research/OpenEvoWebShopNextSteps.astro');
const benchmarkNote = read('../components/research/OpenEvoWebShopBenchmarkNote.astro');
const questions = read('../components/research/OpenEvoWebShopResultsQuestions.astro');
const currentQ7 = read('../components/research/OpenEvoWebShopCurrentQ7.astro');

const resultFamilyCopy = `${scaffold}\n${analysis}\n${legacyResultNote}\n${movedPrimer}\n${resultsAppendix}\n${program}\n${hero}\n${protocol}\n${planIndex}\n${nextSteps}\n${benchmarkNote}\n${questions}\n${currentQ7}`;

describe('OpenEvo capability-exploration result language', () => {
  it('preserves the historical 7-versus-8 run fact without promoting it into the long-term algorithm', () => {
    expect(scaffold).toContain('这个 8 是“不同任务数门槛”，不是 8 分，也不是要 8 条轨迹');
    expect(scaffold).toContain('7 表示最好的一块仍差 1 个任务身份才允许训练');
    expect(scaffold).toContain('这是当时预先采用的方法控制规则');
    expect(scaffold).toContain('不能被推广成 OpenEVO 长期 Stage 2 的必然清空条件');
    expect(scaffold).toContain('不代表模型没有产生可学习数据');
    expect(scaffold).toContain('不是合理 Stage 2 训练后的能力上限');
    expect(analysis).toContain('7 < 8 是本次程序零更新的直接原因');
    expect(analysis).toContain('797 条成功轨迹说明不能把它解释成“没有可学习数据”');
    expect(analysis).toContain('旧 7/8 配置保留为历史 method-control 对照');
    expect(scaffold).not.toContain('成功不能跨不同数据块累积来凑 8');
  });

  it('separates attempts, successful trajectories, task identities, and parameter updates', () => {
    expect(scaffold).toContain('Stage 1：启动学习阶段');
    expect(scaffold).toContain('Stage 2：模型自主探索阶段');
    expect(scaffold).toContain('一次任务尝试（rollout）');
    expect(scaffold).toContain('可用于训练的完整成功轨迹（qualified positive）');
    expect(scaffold).toContain('达标任务身份（qualifying identity）');
    expect(scaffold).toContain('Stage 2 参数更新门槛（gate）');
    expect(scaffold).toContain('参数更新与学习适配器（adapter）');
    expect(scaffold).toContain('启动训练（bootstrap）');
  });

  it('does not regress to author-only shorthand for negative result states', () => {
    for (const opaque of [
      '80/80 个 block 都没有参数更新',
      '单个 block 的 qualifying identity 最大只有 7，而 gate 需要 8',
      '0 update / 无 adapter',
      'Stage-2 仍然全是 no-update',
      'success 数据很多，但 gate 一直不打开',
      'q-positive / identity / distance-to-gate',
      'gate/coverage',
      'final pending',
    ]) {
      expect(resultFamilyCopy, `opaque result shorthand "${opaque}" should not reappear`).not.toContain(opaque);
    }
  });

  it('spells out incomplete and zero-update states instead of making zero mean failure', () => {
    expect(scaffold).toContain('尚无最终结果（对应实验仍未封口）');
    expect(analysis).toContain('未达到启动门槛，因此 0 次参数更新');
    expect(analysis).toContain('最终 128 任务评测尚未完成');
    expect(analysis).toContain('Stage 2 虽然做了大量任务尝试，却没有发生参数训练');
  });

  it('explains legacy result counts and negative states instead of exposing log shorthand', () => {
    expect(legacyResultNote).toContain('这组页面先统一 7 个词');
    expect(legacyResultNote).toContain('cell 数不能直接当任务成功数');
    expect(legacyResultNote).toContain('“未通过”表示实验有效运行但目标门槛没有达到');
    expect(legacyResultNote).toContain('“测量无效”表示当前数据不足以可靠比较');
    expect(legacyResultNote).toContain('不能写成“T2 评测失败”');
    expect(legacyResultNote).toContain('这些成功来自 33 个不同任务，而不是 132 个不同任务');
    expect(legacyResultNote).toContain('这表示当前比较不能支持机制结论，不表示实验没有运行');

    expect(program).toContain('这里的“0”是有效负结果，不是实验没运行');
    expect(program).toContain('不能当成模型得分为 0');
    expect(program).toContain('T2 根本没有运行，因此不能把它描述成 T2 评测失败');
    expect(movedPrimer).toContain('任务从哪里开始和结束');
    expect(movedPrimer).toContain('哪些证据被正式封存');
    expect(resultsAppendix).toContain('历史时间线读数说明');
  });

  it('keeps old author-only result shorthand out of public result copy', () => {
    for (const opaque of [
      '132 个 qualified positives',
      '33 个 qualifying identities',
      'upstream gates 没有过',
      'T2 fresh-transfer panel',
      '完成 96 cells / 384 attempts',
      'selector 是 MEASUREMENT_INVALID',
      '正式 evaluation denominator 为 0',
      'parameter-write 主实验主要依赖 qualified positive records',
      'task boundary、sealed evidence、evolution carrier、validation 与 successor revision',
      'fresh-task transfer 已得到独立 replication',
    ]) {
      expect(resultFamilyCopy, `legacy opaque result shorthand "${opaque}" should not reappear`).not.toContain(opaque);
    }
  });


  it('explains the MiniMax 16-of-1440 historical branch without turning counts into unexplained shorthand', () => {
    expect(analysis).toContain('这里的 16 / 1,440 数的是“真正进入参数训练的讲评记录”，不是模型分数，也不是 MiniMax 只分析了 16 条');
    expect(analysis).toContain('真正进入启动参数训练');
    expect(analysis).toContain('Stage 2 参数更新次数');
    expect(analysis).toContain('MiniMax 的 0.0% 明确表示这次 128 个有效评测任务里完整成功 0 个，不是“结果缺失”');
    expect(analysis).toContain('发生在不同环节，不是同一个问题');
    expect(analysis).toContain('预先冻结的实验方案（preregistration）');
    expect(analysis).not.toContain("t('真正进入 bootstrap','Entered bootstrap')");
    expect(analysis).not.toContain("t('Stage-2 updates','Stage-2 updates')");
  });

  it('translates homepage project codes and status values before using them as evidence', () => {
    expect(protocol).toContain('先把数字、单位和项目内部编号翻译成人话');
    expect(protocol).toContain('它不是一次参数训练，也不是一个单独动作');
    expect(protocol).toContain('cell 数不能直接当成成功任务数');
    expect(protocol).toContain('数字本身不是模型分数，也不是训练步数');
    expect(protocol).toContain('不是 256 个不同任务');
    expect(protocol).toContain('false 通常表示当前没有权限做某一步');
    expect(protocol).toContain('locked 表示正式测试仍被锁住');
    expect(protocol).toContain('Pending 表示还没有最终结果');

    expect(hero).toContain('同一 128 个任务 × 两个模型组（共 256 个任务回合）');
    expect(hero).toContain('formal_task_consumption_allowed=false 表示“不允许继续消耗正式任务”');
    expect(hero).toContain('gpu_allocation_allowed=false 表示“当前不授权为这一步分配 GPU”');
    expect(hero).toContain('final_test_status=locked 表示“最终测试仍锁定”');
  });

  it('explains homepage counts, zeroes, pending results, and formal-denominator zero', () => {
    expect(questions).toContain('H0 完整任务尝试次数');
    expect(questions).toContain('其中科学有效的任务尝试');
    expect(questions).toContain('其中可用于训练的完整成功轨迹');
    expect(questions).toContain('这些成功来自 33 个不同任务');
    expect(questions).toContain('这是有效运行后得到的负结果');
    expect(questions).toContain('T2 根本没有启动');

    expect(benchmarkNote).toContain('没有任何样本满足进入正式比较的完整条件');
    expect(benchmarkNote).toContain('不是“模型得 0 分”');
    expect(planIndex).toContain('尚无最终结果（Pending）”，不能用 0 代替');
    expect(nextSteps).toContain('当前已使用 3,584 / 20,640 个计入预算的任务回合，还剩 17,056');
    expect(currentQ7).toContain('total_slots=128、matches=128、mismatches=0，分别表示');
    expect(currentQ7).toContain('包含 0，因此未证明稳定差异');
  });

  it('does not regress the homepage to raw project-state shorthand', () => {
    for (const opaque of [
      'source-faithful Track A 先通过 authoritative runtime semantic validation 128/128',
      'Gen28 的 128 个 episode 已完成',
      'formal_task_consumption_allowed=false、gpu_allocation_allowed=false、final 继续 locked',
      'H0 尝试次数（attempts）',
      '256 次尝试 → 132 条合格正向经验',
      'Track A 机器可读 closeout',
      '正式 evaluation denominator（正式评估分母）= 0',
      'task boundary、sealed evidence、evolution carrier、validation 与 successor revision',
    ]) {
      expect(resultFamilyCopy, `raw homepage shorthand "${opaque}" should not reappear`).not.toContain(opaque);
    }
  });

});
