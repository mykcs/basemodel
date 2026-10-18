/**
 * Human-facing progress snapshot for Q01–Q10. Execution truth stays in each
 * experiment PR/ledger; workload is NOT an ETA or authorization for GPU work.
 * Use beside a question only, never as a scientific outcome or live run lock.
 */
export interface AdvisorProgress {
  /** What is still scientifically missing, scoped to the question. */
  remaining: string;
  /** Task counts / training cells and human work based on linked receipts. */
  effort: string;
  /** Time only when actually measured; otherwise state the sizing dependency. */
  time: string;
  source: string;
  sourceLabel: string;
}

export const ADVISOR_PROGRESS_AS_OF = '2026-10-18';

export const ADVISOR_QUESTION_PROGRESS = {
  q01: {
    remaining: '这批固定 64 题上的训练时长判断已经得到限定答案；换新题的判断归 Q10。',
    effort: '本问没有必须重跑的训练。若要验证其他新题，需要先冻结新的题单。',
    time: '本问现有测量已完成；新题耗时尚未测定。',
    source: 'https://github.com/mykcs/openevo-experiment/blob/48e1368c7afc260a1745a49e6c7c173bfbb172b2/docs/evidence/advisor-q01-horizon-plateau-20261001/Q01_THREE_WAY_RESULT.json',
    sourceLabel: '11 个保存点与判断规则',
  },
  q02: {
    remaining: '完成剩余的 3 个训练单元、六组同题评测和配对统计；最新执行记录还报告了存储空间不足。',
    effort: '训练剩余 3 个单元；原计划评测上限 1,216 次，必须先扣除已经完成且可复用的记录。',
    time: '磁盘与训练吞吐尚未恢复核实，不能可靠估算需要多少小时。',
    source: 'https://github.com/mykcs/openevo-experiment/pull/629',
    sourceLabel: 'Q02 当前训练与评测工作单',
  },
  q03: {
    remaining: '工程 SFT 第三轮、八卡保存与恢复验收、存储资格仍缺；正式数据 SFT 和 160 轮 Stage2 尚未开始。',
    effort: '先完成工程恢复与存储检查，再按正式配方训练 3 遍 SFT、160 轮 Stage2；现有 1,536 次工程评测不能抵扣正式成绩。',
    time: '历史工程 Step30 / Step60 更新分别约 296 / 309 秒；不能据此推算整段正式训练耗时。',
    source: 'https://github.com/mykcs/openevo-experiment/pull/707',
    sourceLabel: 'SEED 八卡工程恢复进度',
  },
  q04: {
    remaining: 'rank8、16、64 的晚期容量筛查与后续继续学习确认仍缺；rank32/rank128 的已测结果需要保留。',
    effort: '早期计划 Phase A 净新增训练任务最多约 2,944 次，已有的 128 次需复用；是否开展后续 40 轮确认取决于筛查结果。',
    time: '这是 10 月 5 日工作包的预算上限，不是当前剩余时长；实际耗时要重新核账。',
    source: 'https://github.com/mykcs/openevo-experiment/pull/631',
    sourceLabel: 'Q04 晚期容量筛查与续学计划',
  },
  q05: {
    remaining: '较新的简单 β 仍在训练；尚无封存的正式同题得分差、置信区间与成本结论。',
    effort: '执行记录列出 12 个训练单元、96 轮的方案，R120 已有更新收据；目前仍需完成后续训练和 1,280 次评测。',
    time: '不同单元的真实吞吐与 GPU 分配未统一核账，不能报固定小时数。',
    source: 'https://github.com/mykcs/openevo-experiment/pull/632',
    sourceLabel: 'Q05 当前训练与评估状态',
  },
  q06: {
    remaining: '已测选择概率，还缺能在新题上预测失败的独立验证；旧日志部分缺失不能补造。',
    effort: '已完成至少一个 64 题评测；下一步要核可恢复特征、划分无泄漏训练／验证，并评估剩余模型。',
    time: '历史单组 64 题评测曾消耗 0.959 GPU 小时；不同模型的后续运行不能直接按此推算。',
    source: 'https://github.com/mykcs/openevo-experiment/pull/633',
    sourceLabel: 'Q06 预测验证与原始记录',
  },
  q07: {
    remaining: '在一个模型状态、第 156 轮更新上的方向效应已有结论；跨模型的在线方向控制器尚未证明有效。',
    effort: '本问的局部结论无须重新运行；要研究通用控制器需另设实验，不计入已完成范围。',
    time: '现有局部实验已完成；扩展控制器时长尚无可用预算。',
    source: 'https://github.com/mykcs/openevo-experiment/pull/634',
    sourceLabel: '第 156 轮方向反转实验',
  },
  q08: {
    remaining: '960 次旧题评测已完成；部分题缺少“当时确实学会过”的可靠起点，遗忘结论仍不成立。',
    effort: '先核早期学习身份、逐题对应和首次学会后的成绩；方案另有最多 192 次条件评估，不自动重跑已完成的 960 次。',
    time: '主要先做收据匹配与数据审计，是否还需 GPU 评测及用时取决于缺口。',
    source: 'https://github.com/mykcs/openevo-experiment/pull/635',
    sourceLabel: 'Q08 旧任务保持分析和缺口',
  },
  q09: {
    remaining: '改变文字提示已得到局部结果；彻底关闭 Text Memory、Skill 和 Agent System 的正式消融仍未启动。',
    effort: '正式计划必要部分最多 40,960 次新训练任务、1,664 次评估；先完成载体资格、训练身份及成本冻结，再核实际净新增量。',
    time: '目前尚未启动该正式方案，没有可信的训练时间或费用实测。',
    source: 'https://github.com/mykcs/openevo-experiment/pull/636',
    sourceLabel: 'Q09 文字载体正式消融计划',
  },
  q10: {
    remaining: '新配方、三条独立完整训练过程及真正新题的验证结果尚未启动或封存。',
    effort: '原计划完整预算上限为 122,880 次训练任务、4,224 次评估；只有满足严格同源复用条件才可减少。先冻结新任务与配方。',
    time: '这是计划上限，不是已经占用的 GPU 时间；开始前仍需成本与资源验收。',
    source: 'https://github.com/mykcs/openevo-experiment/pull/637',
    sourceLabel: 'Q10 新任务独立复现计划',
  },
} as const satisfies Record<string, AdvisorProgress>;
