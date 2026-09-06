import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (relative: string) => readFileSync(new URL(relative, import.meta.url), 'utf8');
const scaffold = read('../components/research/OpenEvoExperimentResultsScaffold.astro');
const analysis = read('../components/research/OpenEvoExperimentAnalysisPlan.astro');
const stage1Versions = read('../components/research/OpenEvoStage1VersionComparison.astro');
const legacyStage1Archive = read('../components/research/OpenEvoLegacyStage1Archive.astro');
const capabilityIndex = read('../pages/research/seed-openevo/study/capability-exploration/index.astro');
const capabilityLobby = read('../components/research/OpenEvoCapabilityMapLobby.astro');
const stage2Chooser = read('../components/research/OpenEvoStage2StrategyChooser.astro');
const legacyStage2Archive = read('../components/research/OpenEvoLegacyStage2Archive.astro');
const legacyStage2Journey = read('../components/research/OpenEvoLegacyStage2ResearchJourney.astro');
const legacyStage2Data = read('../data/openEvoLegacyStage2Archive.ts');
const ceilingStage2Snapshot = read('../data/openEvoCeilingStage2Snapshot.ts');
const ceilingStage2 = read('../components/research/OpenEvoCeilingStrategy.astro');
const redesign = read('../components/research/OpenEvoRedesignMap.astro');
const successorExploration = read('../components/research/OpenEvoSuccessorExplorationMap.astro');
const successorReport = read('../components/research/OpenEvoSuccessorReport.astro');
const successorNarrative = read('../data/openEvoSuccessorNarrative.ts');
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

const resultFamilyCopy = `${scaffold}\n${stage1Versions}\n${stage2Chooser}\n${legacyStage2Archive}\n${legacyStage2Journey}\n${legacyStage2Data}\n${ceilingStage2}\n${redesign}\n${successorExploration}\n${successorReport}\n${ceilingStage2Snapshot}\n${analysis}\n${legacyResultNote}\n${movedPrimer}\n${resultsAppendix}\n${program}\n${hero}\n${protocol}\n${planIndex}\n${nextSteps}\n${benchmarkNote}\n${questions}\n${currentQ7}`;

describe('OpenEvo capability-exploration result language', () => {
  it('presents current and historical Stage 1 as comparable but non-identical trajectory collections', () => {
    expect(stage1Versions).toContain('Ceiling-1.0：fresh corrected Stage 1（历史）');
    expect(stage1Versions).toContain('旧版：previous Stage 1 replicate');
    expect(stage1Versions).toContain('180 × 8 = 1,440');
    expect(stage1Versions).toContain('145000000');
    expect(stage1Versions).toContain('148000000');
    expect(stage1Versions).toContain("old:'0.8'");
    expect(stage1Versions).toContain("fresh:'1.0'");
    expect(stage1Versions).toContain("old:'20'");
    expect(stage1Versions).toContain("fresh:'0'");
    expect(stage1Versions).toContain("old:'1.05'");
    expect(stage1Versions).toContain('1 / 0 / 1 的意义是“关闭额外旋钮”，不是“保证更高分”');
    expect(stage1Versions).toContain('旧 Stage 1 没有因为旧 Stage 2 错误而作废');
    expect(stage1Versions).toContain('不能把两批 1,440 条当成同一批 trajectory');
  });

  it('keeps old Stage 1 usable while the redesign starts from a fresh successor boundary', () => {
    expect(capabilityIndex).not.toContain('当前 corrected Stage 1 仍是共同起点');
    expect(capabilityIndex).not.toContain('Ceiling-1.0 和 OpenEVO 2.0 都沿用同一份 corrected Stage 1');
    expect(capabilityIndex).toContain('OpenEvoCapabilityMapLobby');
    expect(capabilityLobby).toContain("id: 'first-run'");
    expect(capabilityLobby).toContain('第一轮：OpenEvo 能不能真的持续更新？');
    expect(capabilityLobby).toContain("id: 'redesign'");
    expect(capabilityLobby).toContain('不会把旧轨迹冒充成新实验数据');
    expect(stage1Versions).toContain('旧 Stage 1 没有因为旧 Stage 2 错误而作废');
    expect(stage1Versions).toContain('旧版仍能回答“当时这套 Qwen + WebShop harness 产生了什么轨迹”');
    expect(stage1Versions).toContain('/stage1-previous/');
    expect(stage1Versions).toContain('打开旧版 trajectory / adapter / HF / GitHub 产物');
    expect(legacyStage1Archive).toContain('性质一样，参数有小幅定稿；旧版能用，新实验以新版为准');
    expect(legacyStage1Archive).toContain('openevo-webshop-h145-h146-trajectories');
    expect(legacyStage1Archive).toContain('9bdca2fcb80d3272b5c9c9a32fdc2f3873f03bbc');
    expect(legacyStage1Archive).toContain('openevo-webshop-h145-h146-adapters');
    expect(legacyStage1Archive).toContain('cc64938ac0bbef573b631d2742e3b9f477aff36b');
    expect(legacyStage1Archive).toContain('superseded-stage2-publication-closeout.json');
    expect(legacyStage1Archive).toContain('CASE-HUGGINGFACE-ASSET-GOVERNANCE-20260829.md');
  });

  it('separates the superseded window-local method-control from the current Ceiling-1.0 mainline', () => {
    expect(stage2Chooser).toContain('第一版 · 已取代');
    expect(stage2Chooser).toContain('第二版 · 7B 点燃，3B 暴露新问题');
    expect(legacyStage2Archive).toContain('SUPERSEDED METHOD-CONTROL');
    expect(legacyStage2Archive).toContain('data-model-choice="3b"');
    expect(legacyStage2Archive).toContain('data-teacher-choice="minimax"');
    expect(legacyStage2Data).toContain("qualifiedPositives: '797'");
    expect(legacyStage2Data).toContain("taskScoreX100: 1.71");
    expect(legacyStage2Data).toContain("taskScoreX100: 16.94");
    expect(ceilingStage2).toContain('每 128 次任务形成一轮共同证据');
    expect(ceilingStage2).toContain('不再使用旧的 7 对 8 门槛');
    expect(ceilingStage2).toContain('64-component guard 现在只保留为 upstream provenance');
    expect(ceilingStage2).toContain('effective rank ≤ 4096');
    expect(ceilingStage2).toContain('这个 amendment 只授权 7B，不自动授权 3B');
    expect(ceilingStage2).not.toContain('SD-LoRA 最多保留 64 个组件');
    expect(ceilingStage2Snapshot).toContain('rolloutsConsumed: 3_968');
    expect(ceilingStage2Snapshot).toContain('rolloutsConsumed: 2_304');
    expect(ceilingStage2Snapshot).toContain('finalPanelAccessCount: 0');
    expect(ceilingStage2).not.toContain('Stage 2 正式 task consumption：尚未开始');
  });

  it('explains how the old 8×2×256 rule grew from bounded experiments and how it was diagnosed later', () => {
    expect(legacyStage2Archive).toContain('OpenEvoLegacyStage2ResearchJourney');
    expect(legacyStage2Journey).toContain('H1.38A-C');
    expect(legacyStage2Journey).toContain('148 次尝试里得到 50 条可以用于训练的完整成功轨迹');
    expect(legacyStage2Journey).toContain('8 个不同任务，每个任务各有 2 条独立成功');
    expect(legacyStage2Journey).toContain('最多允许 256 次任务尝试');
    expect(legacyStage2Journey).toContain('这里还出现过另一个“256”，但它和这次错误不是一回事');
    expect(legacyStage2Journey).toContain('max_records=256');
    expect(legacyStage2Journey).toContain("oldInvalid:'130 / 1,280 · 10.2%'");
    expect(legacyStage2Journey).toContain("nextInvalid:'481 / 1,280 · 37.6%'");
    expect(legacyStage2Journey).toContain("oldInvalid:'171 / 1,280 · 13.4%'");
    expect(legacyStage2Journey).toContain("nextInvalid:'322 / 1,280 · 25.2%'");
    expect(legacyStage2Journey).toContain('H1.20');
    expect(legacyStage2Journey).toContain('480 条历史动作里的 128 条不可执行建议');
    expect(legacyStage2Journey).toContain('960 条建议里的 164 条不可执行动作');
    expect(legacyStage2Journey).toContain('Harness 2.0 正式实验前检查 · 128 + 128');
    expect(legacyStage2Journey).toContain('分数和成功数只作为诊断');
  });

  it('adds the OpenEvo redesign as a fresh successor without rewriting Ceiling-1.0 history', () => {
    expect(stage2Chooser).toContain('重新设计 OpenEvo');
    expect(stage2Chooser).toContain('Harness201.1 后重新采 Stage 1');
    expect(stage2Chooser).toContain('/openevo-2-0/');
    expect(stage2Chooser).not.toContain('Stage 1 不重做');
    expect(redesign).toContain('同一个实验，两种读法');
    expect(redesign).toContain('OPEN_EVO_STAGE1_FREEZE.id');
    expect(successorNarrative).toContain("id: '202609030400'");
    expect(successorExploration).toContain('FREEZE_ONE_SHARED_STAGE1_HARNESS');
    expect(successorExploration).toContain('4096 失败 → bounded A2');
    expect(successorReport).toContain('共享一套 strategy-neutral bootstrap harness');
    expect(successorReport).toContain('MiniMax 对已完成 trajectory 做 task-after analysis');
    expect(successorReport).toContain('PRE_STAGE2_READY');
    expect(successorReport).toContain('stage2_authorized=false');
    expect(successorReport).toContain('“Stage2 已经证明稳定提升”');
    expect(successorReport).toContain('不支持');
    expect(redesign).not.toContain('Ceiling-1.0 已暂停');
    expect(ceilingStage2).toContain('Ceiling-1.0 历史证据原样保留');
    expect(ceilingStage2).toContain('新版从新的 Harness 与 fresh Stage 1 重新开始');
    expect(legacyStage2Journey).toContain('不能在其余变量中继续排名谁最可能是根因');
    expect(legacyStage2Journey).not.toContain('真正的问题更可能出在新的上下文 / 动作接口');
    expect(analysis).toContain('训练 loss 不是任务得分的单调代理指标');
    expect(analysis).toContain('剩余差距没有被这组数据进一步定位');
    expect(analysis).not.toContain('说明优化目标和真正任务能力脱节');
  });

  it('preserves the historical 7-versus-8 run fact without promoting it into the long-term algorithm', () => {
    expect(scaffold).toContain('这里的 8 不是分数，也不是 8 条轨迹');
    expect(scaffold).toContain('旧规则要求至少 8 个，实际最高只有 7 个');
    expect(scaffold).toContain('这个事实只能解释旧实验为什么没有继续训练');
    expect(scaffold).toContain('它不能证明长期 Stage 2 应该继续使用同样的逐批清零规则');
    expect(scaffold).toContain('模型并不是“没有成功经验”');
    expect(scaffold).toContain('这个结果只说明旧方法控制规则怎样阻断了学习，不代表当前 OpenEVO Stage 2');
    expect(analysis).toContain('7 < 8 是本次程序零更新的直接原因');
    expect(analysis).toContain('797 条成功轨迹说明不能把它解释成“没有可学习数据”');
    expect(analysis).toContain('旧 7/8 配置保留为历史 method-control 对照');
    expect(analysis).toContain('0/80 达到旧门槛；合并到 512 次是 4/40，1,024 次是 12/20，2,048 次是 10/10');
    expect(analysis).toContain('不能单凭事后合并确定新的长期算法');
    expect(analysis).toContain('预先固定一个新的累计—更新—清空合同');
    expect(scaffold).not.toContain('成功不能跨不同数据块累积来凑 8');
  });

  it('separates attempts, successful trajectories, task identities, and parameter updates', () => {
    expect(scaffold).toContain('Stage 1：第一次让模型真正学习');
    expect(scaffold).toContain('旧 Stage 2：继续自己做题');
    expect(scaffold).toContain('一次完整任务尝试（rollout）');
    expect(scaffold).toContain('一条可用于训练的完整成功轨迹');
    expect(scaffold).toContain('一个“重复成功的不同任务”');
    expect(scaffold).toContain('旧实验允许参数更新的条件');
    expect(scaffold).toContain("term:t('参数更新', 'Parameter update')");
    expect(scaffold).toContain('Stage 1 启动训练');
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
    expect(analysis).toContain('封存的最终 128 任务评测为 Task Score ×100 = 1.71、完整成功 1/128、技术有效 121/128');
    expect(analysis).toContain('不再继续最终评测');
    expect(analysis).toContain('旧 Stage 2：20,480 次任务尝试全部完成');
    expect(analysis).toContain('旧 Stage 2 完成 59 批完整数据');
    expect(analysis).toContain('第 60 批已产生 171 次任务尝试时由用户明确停止');
    expect(analysis).toContain('历史 128 任务最终 Task Score ×100 = 16.94');
    expect(analysis).toContain('没有触发 Stage-2 参数更新');
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
    expect(planIndex).toContain('3B/self、7B/self、7B/MiniMax 的 final 已封存');
    expect(planIndex).toContain('3B/MiniMax 的 final 明确未运行');
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
