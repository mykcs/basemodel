import { z } from 'zod';

export type MechanismNarrativeLocale = 'zh' | 'en';
const localized = z.object({ zh: z.string().trim().min(1), en: z.string().trim().min(1) });
const text = (zh: string, en: string) => ({ zh, en });

/** Publication snapshot, not a runtime monitor or authority to launch work. */
export const OPEN_EVO_MECHANISM_SOURCE = {
  programId: 'openevo-mechanism-1.0-202609052200',
  sourcePr: 319,
  programCommit: '8d2f2024c8b70f633f9824ce2e01272582bbdc0b',
  mergedCommit: '8ddb7890073bdc0573acb1fc9ef40239e2655979',
  checkedDate: '2026-09-06',
  branch: 'main',
  activationCommit: 'b4cdf8ecc5d442f984402f517a6d5b6b5e5e3bc9',
  activationRelease: 'configs/experiment/activations/openevo-mechanism1-m1d-stage1-execution-release-202609062029.json',
  minimaxBinding: 'configs/experiment/designs/openevo-mechanism1-m1d-minimax-posthoc-202609061925.json',
  m1aAmendment: 'configs/experiment/amendments/openevo-mechanism1-m1a-identifiability-202609062100.json',
  m1cAmendment: 'configs/experiment/amendments/openevo-mechanism1-m1c-m1a-successor-gate-202609062100.json',
  state: 'M1D_STAGE1_ACTIVATED_MINIMAX_BOUND_RESULTS_UNSEALED',
} as const;

export const mechanismEvidenceUrl = (path: string) =>
  `https://github.com/mykcs/openevo-experiment/blob/${OPEN_EVO_MECHANISM_SOURCE.mergedCommit}/${path}`;

/** Fields are rendered by ExperimentLifecycle, not merely required in a style guide. */
export const mechanismLifecycleSchema = z.object({
  id: z.enum(['M1-A', 'M1-B', 'M1-C', 'M1-D']),
  track: z.enum(['causal', 'reference']),
  name: localized,
  question: localized,
  start: localized,
  action: localized,
  stop: localized,
  output: localized,
  state: localized,
  execution: z.enum(['locked', 'authorized', 'running', 'completed']),
  results: z.enum(['unsealed', 'sealed']),
  executionRelease: z.string().regex(/^configs\/experiment\/activations\/[a-z0-9.-]+\.json$/).nullable(),
  resultReceipt: z.string().trim().min(1).nullable(),
  actualStart: z.string().datetime({ offset: true }).nullable(),
  actualEnd: z.string().datetime({ offset: true }).nullable(),
  budget: z.number().int().positive(),
  budgetKind: z.enum(['maximum', 'fixed']),
  source: z.string().regex(/^configs\/experiment\/designs\/[a-z0-9.-]+\.json$/),
}).strict().superRefine((record, context) => {
  const issue = (message: string) => context.addIssue({ code: 'custom', message });
  if (record.execution !== 'locked' && !record.executionRelease) issue('Execution state requires an explicit release');
  if (record.execution === 'locked' && (record.executionRelease || record.actualStart || record.actualEnd)) issue('Locked work cannot carry an active release or run timestamps');
  if (record.execution === 'running' && !record.actualStart) issue('Running requires an actual start receipt timestamp');
  if (record.execution === 'completed' && (!record.actualStart || !record.actualEnd)) issue('Completion requires actual start and end timestamps');
  if (record.actualEnd && !record.actualStart) issue('An end cannot precede an unrecorded start');
  if (record.actualStart && record.actualEnd && Date.parse(record.actualEnd) < Date.parse(record.actualStart)) issue('End time must follow start time');
  if (record.results === 'sealed' && !record.resultReceipt) issue('Sealed outcomes require a result receipt');
  if (record.results === 'unsealed' && record.resultReceipt) issue('A result receipt and publication state must reconcile');
  if (record.results === 'sealed' && record.execution === 'locked') issue('Locked work has no publishable result');
});
export type MechanismLifecycle = z.infer<typeof mechanismLifecycleSchema>;

export const OPEN_EVO_MECHANISM_EXPERIMENTS: readonly MechanismLifecycle[] = [
  {
    id: 'M1-A', track: 'causal',
    name: text('移植末次学习的变化', 'Transplant the last accepted change'),
    question: text('把末次被接受的参数变化加到更早的模型上，购物行为会跟着变吗？', 'Does adding the last accepted parameter change to an earlier model change its shopping behavior?'),
    start: text('先封存训练历史，确认最后三个被接受的模型状态互不相同、变化方向可计算，再取得独立执行授权。', 'Seal the training history, verify three distinct final accepted model states and an identifiable direction, then obtain a separate execution release.'),
    action: text('在同一批 64 个诊断任务上，比较原模型、加减真实变化、三个同幅度随机变化，以及两个自然训练状态。', 'On the same 64 diagnostic tasks, compare the baseline, signed changes, three equally sized random changes, and two natural training states.'),
    stop: text('身份或方向检查不通过就停止，消耗 0 个任务；通过并获授权后，最多完成 576 次任务尝试，按固定方案封存。', 'Stop with zero task consumption if identity or direction checks fail. After qualification and authorization, run at most 576 attempts and seal the fixed comparison.'),
    output: text('真实变化相对随机变化造成的任务完成度和完整成功次数差异。', 'Differences in task completion score and exact-success count caused by the real change relative to random changes.'),
    state: text('修订方案已登记 · 执行仍锁定', 'Successor registered · execution locked'),
    execution: 'locked', results: 'unsealed', executionRelease: null, resultReceipt: null, actualStart: null, actualEnd: null,
    budget: 576, budgetKind: 'maximum',
    source: 'configs/experiment/designs/openevo-mechanism1-taskvector-causal-transplant-202609062100.json',
  },
  {
    id: 'M1-B', track: 'causal',
    name: text('移除主要参数变化', 'Remove major parameter changes'),
    question: text('移除某一组主要参数变化，模型的购物表现会比随机移除下降更多吗？', 'Does removing a major pattern of parameter changes hurt shopping behavior more than a random removal?'),
    start: text('最终模型和参数分析包通过核验；在查看行为结果前选定前三组变化，并取得独立执行授权。', 'Verify the terminal model and measurement pack, freeze the top three patterns before seeing behavioral outcomes, and obtain a separate execution release.'),
    action: text('保留原模型作对照，分别移除三组变化，再加入三个同幅度随机移除对照；每组测试同样 64 个诊断任务。', 'Keep the original model as baseline, remove each of three patterns separately, and add three equally sized random-removal controls; each condition uses the same 64 diagnostic tasks.'),
    stop: text('按固定比较方案完成最多 448 次任务尝试后封存；不因分数好坏临时多跑或少跑。', 'Seal after at most 448 attempts in the fixed comparison; outcomes do not change the stopping rule.'),
    output: text('哪些变化的移除会额外损害行为；参数变化很大本身只算观察。', 'Which removals cause extra behavioral harm; a large parameter change alone remains descriptive evidence.'),
    state: text('方案已登记 · 等待核验与执行授权', 'Registered · awaiting qualification and execution release'),
    execution: 'locked', results: 'unsealed', executionRelease: null, resultReceipt: null, actualStart: null, actualEnd: null,
    budget: 448, budgetKind: 'maximum',
    source: 'configs/experiment/designs/openevo-mechanism1-parameter-theme-knockout-202609052200.json',
  },
  {
    id: 'M1-C', track: 'causal',
    name: text('用有效变化指导后续学习', 'Guide later learning with a useful change'),
    question: text('方向有效的证据足够后，用它指导模型继续学习，能否比普通学习更有效？', 'Once evidence for a useful direction is sufficient, can it make later learning more effective than the ordinary update?'),
    start: text('先检查 M1-A 修订实验的封存结果；未达到门槛时再检查 M1-B 的第一组变化。只有预设门槛通过且获得独立授权才开始。', 'Check the sealed M1-A successor result first; if it misses the threshold, check M1-B Theme 1. Start only after the preregistered gate and a separate execution release pass.'),
    action: text('让普通更新、有效方向引导、随机方向引导三组模型，在相同任务和随机种子下各做 512 次尝试；参数修改幅度相同。', 'Compare ordinary updates, useful-direction guidance, and random-direction guidance on identical tasks and seeds, with 512 attempts per arm and equal update magnitude.'),
    stop: text('无方向特异信号就不启动；启动后按三组共 1,536 次尝试的固定预算结束，不追着好结果加跑。', 'Do not start without a direction-specific signal. Once started, stop at the fixed total of 1,536 attempts across three arms.'),
    output: text('在这次小规模后续学习中，引导是否改善效率；这不是新的能力天花板分数。', 'Whether guidance improves efficiency in this bounded follow-up; this is not a new capability-ceiling score.'),
    state: text('条件实验 · 门槛通过前保持锁定', 'Conditional experiment · locked until the gate passes'),
    execution: 'locked', results: 'unsealed', executionRelease: null, resultReceipt: null, actualStart: null, actualEnd: null,
    budget: 1536, budgetKind: 'fixed',
    source: 'configs/experiment/designs/openevo-mechanism1-taskvector-guided-microtrial-202609052200.json',
  },
  {
    id: 'M1-D', track: 'reference',
    name: text('比较最初收集的购物经验', 'Compare the initial shopping experience'),
    question: text('同样做 1,440 次购物尝试，SEED 方法收集的初始经验和已有 OpenEvo 3B 经验有什么不同？', 'With the same 1,440 shopping attempts, how does the initial experience collected by SEED differ from the existing OpenEvo 3B corpus?'),
    start: text('任务清单、模型身份和运行环境先匹配并通过核验，再按独立放行记录启动。此快照已有 Stage1 执行授权。', 'Match and qualify the task manifest, model identity, and runtime, then use the independent phase release. This snapshot includes Stage1 execution authority.'),
    action: text('同一个 3B 模型按 SEED 的采集方法完成 180 个任务，每题尝试 8 次；再由 MiniMax 分析这些记录。MiniMax 是事后分析器，不是替模型购物的选手。', 'Use the 3B model with SEED collection semantics on 180 tasks, eight attempts each, then analyze the records with MiniMax. MiniMax analyzes completed attempts; it is not the shopping agent.'),
    stop: text('恰好 1,440 条轨迹和全部 MiniMax 分析通过核验并封存后结束；不生成技能、不训练模型，也不进入 SEED Stage2。', 'Stop once exactly 1,440 trajectories and all MiniMax analyses are verified and sealed; do not generate skills, train the model, or enter SEED Stage2.'),
    output: text('初始经验的成功、错误和多样性差异；只能解释初始化经验，不能当成 SEED 论文最终分数。', 'Differences in success, errors, and diversity of initial experience; these do not reproduce the SEED paper’s final score.'),
    state: text('M1-D 阶段已激活 · 结果未封存', 'M1-D PHASE ACTIVATED · results not sealed'),
    execution: 'authorized', results: 'unsealed', executionRelease: OPEN_EVO_MECHANISM_SOURCE.activationRelease, resultReceipt: null, actualStart: null, actualEnd: null,
    budget: 1440, budgetKind: 'fixed',
    source: 'configs/experiment/designs/openevo-mechanism1-seed-stage1-init-probe-3b-202609052200.json',
  },
].map((record) => mechanismLifecycleSchema.parse(record));

export const OPEN_EVO_MECHANISM_BOUNDARIES = {
  zh: ['Ceiling 的训练历史和已封存结果保持原样。', '只在规定的同一模型内干预；诊断不访问最终测试题。', '不可识别、没有运行和有效负结果分别记录。'],
  en: ['Ceiling training history and sealed results remain unchanged.', 'Intervene only within the prescribed model; diagnostics never access final-panel tasks.', 'Record non-identifiability, unexecuted work, and valid negative outcomes separately.'],
} as const;
