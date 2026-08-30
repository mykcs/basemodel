export const openEvoProgramSource = {
  commit: 'd1f35ecdf84c61b07df7c646e83588d63b9297bd',
  checkedAt: '2026-08-21',
  branch: 'codex/h142-measurement-validity-20260821',
  campaign: '20260821-0142-h142-measurement-validity',
} as const;

const sourceRoot = `https://github.com/mykcs/openevo-experiment/blob/${openEvoProgramSource.commit}`;

export const openEvoProgramSourcePaths = {
  ledger: 'docs/experiment-tracking/WEBSHOP_PROGRAM_LEDGER.v1.json',
  report: 'docs/reports/OPEN_EVO_WEBSHOP_PROGRAM_REPORT_2026-08-21.md',
  reconciliation: 'docs/evidence/remote-runs/2026-08-20/h1.40-g2-r2/formal-upstream-evaluation-v5b-summary.json',
  h141Reconciliation: 'docs/evidence/remote-runs/2026-08-21/h1.41/H141_RECONCILIATION_V5.md',
  h142Closeout: 'docs/evidence/remote-runs/2026-08-21/h1.42-mv/H142_STAGE_B_CLOSEOUT.md',
  h142Reconciliation: 'docs/evidence/remote-runs/2026-08-21/h1.42-mv/stage-b-reconciliation.json',
  h142ResourceAccounting: 'docs/evidence/remote-runs/2026-08-21/h1.42-mv/stage-b-resource-accounting.json',
  campaign: 'configs/experiment/current-campaign.json',
} as const;

export const openEvoProgramLinks = {
  ledger: `${sourceRoot}/${openEvoProgramSourcePaths.ledger}`,
  report: `${sourceRoot}/${openEvoProgramSourcePaths.report}`,
  reconciliation: `${sourceRoot}/${openEvoProgramSourcePaths.reconciliation}`,
  h141Reconciliation: `${sourceRoot}/${openEvoProgramSourcePaths.h141Reconciliation}`,
  h142Closeout: `${sourceRoot}/${openEvoProgramSourcePaths.h142Closeout}`,
  h142Reconciliation: `${sourceRoot}/${openEvoProgramSourcePaths.h142Reconciliation}`,
  h142ResourceAccounting: `${sourceRoot}/${openEvoProgramSourcePaths.h142ResourceAccounting}`,
  campaign: `${sourceRoot}/${openEvoProgramSourcePaths.campaign}`,
} as const;

export type ProgramLocale = 'zh' | 'en';
export type ProgramStage = 'foundation' | 'diagnostic' | 'transfer' | 'closeout';
export type ProgramResult = 'supported' | 'negative' | 'invalid' | 'protocol' | 'design';

export const programStageLabels = {
  foundation: { zh: '基础与机制', en: 'Foundation & mechanism' },
  diagnostic: { zh: '诊断与校准', en: 'Diagnosis & calibration' },
  transfer: { zh: '迁移与新任务', en: 'Transfer & fresh tasks' },
  closeout: { zh: '冻结面板收口', en: 'Frozen-panel closeout' },
} as const;

export const programResultLabels = {
  supported: { zh: '有可用证据', en: 'Usable evidence' },
  negative: { zh: '未支持预期', en: 'Expected effect not supported' },
  invalid: { zh: '无效或仅诊断', en: 'Invalid or diagnostic-only' },
  protocol: { zh: '仅协议', en: 'Protocol only' },
  design: { zh: '目标 / 设计移交', en: 'Goal / design handoff' },
} as const;

export const programTimeline = [
  {
    id: 'phase-g', stage: 'foundation', result: 'invalid', coverage: ['Phase G'],
    title: { zh: 'Phase G：闭环首次端到端落地', en: 'Phase G: first end-to-end closed loop' },
    summary: { zh: '参数载体、重新加载与评测链路都能运行，但三种策略在 12 个仅用于内部晋级筛选的开发任务回合（promotion-dev episode）上得分都为 0。这里的 0 是有效评测结果，不是“没有运行”。', en: 'The parametric carrier, reload, and evaluation path ran, but all three strategies scored 0 across 12 promotion-dev episodes.' },
    boundary: { zh: '只保留了带日期的人工文字记录，没有独立的机器对账结果；因此只能作为机制 / 基线诊断，不能证明 WebShop 能力改善。', en: 'Only a dated narrative survives, without a standalone machine reconciliation; diagnostic mechanism/baseline evidence only, not WebShop improvement.' },
    evidence: openEvoProgramLinks.ledger,
  },
  {
    id: 'h0', stage: 'foundation', result: 'supported', coverage: ['H0', 'H0.1'],
    title: { zh: 'H0–H0.1：成功经验供给成立', en: 'H0–H0.1: successful-experience supply established' },
    summary: { zh: 'H0 共完成 128 次任务尝试，其中 96 次满足科学有效性要求，28 条是“任务完整成功且可用于训练”的轨迹；这证明 3B 初始基础模型在只用于训练的选定任务上能够产生可学习的成功经验。', en: 'H0 produced 96 scientifically valid attempts and 28 qualified positives out of 128, establishing that the 3B base can generate learnable successful experience on selected train-only tasks.' },
    boundary: { zh: '证明可用于训练的完整成功轨迹确实存在；不证明参数更新后能迁移到未参与训练的新任务。', en: 'Establishes that positives exist; does not establish post-update transfer to fresh tasks.' },
    evidence: openEvoProgramLinks.ledger,
  },
  {
    id: 'h1-1-4', stage: 'diagnostic', result: 'invalid', coverage: ['H1.1', 'H1.2', 'H1.3', 'H1.4'],
    title: { zh: 'H1.1–H1.4：先修可比性', en: 'H1.1–H1.4: repair comparability first' },
    summary: { zh: '围绕动作解析、系统替代动作（fallback，解析失败时执行的替代动作）、任务抽样和评测器一致性建立诊断；部分运行只能作为工程证据。', en: 'Diagnostics targeted action parsing, fallback (a substitute action used after parsing failure), task sampling, and evaluator consistency; some runs remain engineering evidence only.' },
    boundary: { zh: '动作解析失败或触发系统替代动作的任务尝试不得进入科学比较分母。', en: 'Attempts contaminated by parsing or fallback must not enter the scientific denominator.' },
    evidence: openEvoProgramLinks.ledger,
  },
  {
    id: 'h1-5-8', stage: 'diagnostic', result: 'negative', coverage: ['H1.5', 'H1.6', 'H1.7', 'H1.8'],
    title: { zh: 'H1.5–H1.8：成功样本与适配器信号', en: 'H1.5–H1.8: success samples and adapter signal' },
    summary: { zh: '逐步验证经验抽取、适配器构建与行为探针；机制信号出现，但任务收益仍未成立。', en: 'Experience extraction, adapter construction, and behavior probes were validated incrementally; mechanism signals appeared, but task benefit remained unestablished.' },
    boundary: { zh: '参数变成非零，或模型对输出 token 的原始偏好分数（logit）发生变化，只能说明内部机制改变；不等于 WebShop 任务分数提升。', en: 'Nonzero parameter or logit changes are mechanism evidence, not task-score improvement.' },
    evidence: openEvoProgramLinks.ledger,
  },
  {
    id: 'h1-9', stage: 'diagnostic', result: 'negative', coverage: ['H1.9'],
    title: { zh: 'H1.9：更换随机种子后仍能复现，但只局限于同一个任务', en: 'H1.9: fresh-seed rescue remained task-specific' },
    summary: { zh: 'H1.8 的“根据当前状态提供恢复提示”在新的随机种子上复现，但收益仍只局限于同一个具体任务身份。', en: 'The H1.8 state-aware rescue replicated on fresh seeds but remained limited to the same task identity.' },
    boundary: { zh: '一个任务实例上的复现不是广泛泛化。', en: 'Replication on one task instance is not broad generalization.' },
    evidence: openEvoProgramLinks.ledger,
  },
  {
    id: 'h1-10', stage: 'diagnostic', result: 'negative', coverage: ['H1.10'],
    title: { zh: 'H1.10：新任务上的正向行为并不是某个实验组独有', en: 'H1.10: new-task positives were arm-independent' },
    summary: { zh: '128 次任务尝试中出现了新任务上的正向行为，但这种现象并不是“状态感知”实验组独有，因此不能把它归因于该实验处理。', en: 'Positive behavior appeared on new tasks across 128 attempts, but it was not selective to the state-aware arm.' },
    boundary: { zh: '仅仅出现正向行为，不能识别它是否由 OpenEvo 的实验处理造成。', en: 'Positive outcomes alone do not identify an OpenEvo treatment effect.' },
    evidence: openEvoProgramLinks.ledger,
  },
  {
    id: 'h1-11', stage: 'diagnostic', result: 'negative', coverage: ['H1.11'],
    title: { zh: 'H1.11：正例监督更易拟合，未迁移到闭环行为', en: 'H1.11: positive supervision fit better without closed-loop transfer' },
    summary: { zh: '96 次评测任务尝试显示：用成功经验做监督比用失败经验做监督更容易拟合训练数据，但在未参与训练的新任务上，完整交互表现没有改善。', en: 'Across 96 evaluation attempts, positive supervision fit better than failure supervision, but fresh-task closed-loop behavior did not improve.' },
    boundary: { zh: '拟合训练数据不等于在完整环境交互中产生迁移收益。', en: 'Fit is not behavioral transfer.' },
    evidence: openEvoProgramLinks.ledger,
  },
  {
    id: 'h1-12', stage: 'diagnostic', result: 'negative', coverage: ['H1.12'],
    title: { zh: 'H1.12：根据当前状态提供恢复提示，没有产生处理组独有的救援效果', en: 'H1.12: state-aware recovery cue did not selectively rescue' },
    summary: { zh: '在 128 次任务尝试中，根据当前状态提供的恢复提示没有选择性恢复已训练学习适配器的完整交互表现。', en: 'Across 128 attempts, the state-aware recovery cue did not selectively recover closed-loop performance from the fitted adapter.' },
    boundary: { zh: '这是冻结契约下的负诊断，不是全局不可能性结论。', en: 'This is a negative diagnostic under the frozen contract, not a global impossibility claim.' },
    evidence: openEvoProgramLinks.ledger,
  },
  {
    id: 'h1-13', stage: 'diagnostic', result: 'negative', coverage: ['H1.13'],
    title: { zh: 'H1.13：只监督动作的训练目标可以拟合，但没有产生处理组独有的迁移', en: 'H1.13: action-only targets fit without selective transfer' },
    summary: { zh: '96 次任务尝试中，只监督动作本身的训练目标可以被模型拟合，但没有形成只出现在处理组里的完整交互迁移收益。', en: 'Across 96 attempts, action-only supervision targets fit but did not produce selective closed-loop transfer.' },
    boundary: { zh: '这里只排除了这套预先固定实验条件下“训练目标格式导致失败”这一种解释。', en: 'Rules out this target-format explanation only under the frozen contract.' },
    evidence: openEvoProgramLinks.ledger,
  },
  {
    id: 'h1-14', stage: 'diagnostic', result: 'protocol', coverage: ['H1.14'],
    title: { zh: 'H1.14：外部老师对照只完成了实验协议，没有形成结果', en: 'H1.14: teacher control has protocol-only evidence' },
    summary: { zh: '用于恢复训练的数据集已经准备，但原来的“成功状态老师”路线没有形成并封存一套严格匹配的评测面板。', en: 'The recovery corpus was prepared, but the original successful-state teacher route did not seal a matched evaluation panel.' },
    boundary: { zh: 'H1.14 没有形成可以用于组间比较的科学结果。', en: 'There is no H1.14 comparative scientific result.' },
    evidence: openEvoProgramLinks.ledger,
  },
  {
    id: 'h1-15', stage: 'diagnostic', result: 'invalid', coverage: ['H1.15'],
    title: { zh: 'H1.15：经验载体诊断无效，不能作因果解释', en: 'H1.15: invalid, non-causal carrier diagnostic' },
    summary: { zh: '不同经验载体表现出差异，但评测面板里含有动作解析无效的评测单元，而且实际执行代码的 SHA 发生漂移，因此这次比较不满足严格因果对照条件。', en: 'Carrier behavior was heterogeneous, but parser-invalid cells and executable-SHA drift made the comparison non-strict and non-causal.' },
    boundary: { zh: '这次运行不承担“哪种经验载体更好”的结论；严格的经验载体比较以 H1.16 为准。', en: 'Carries no carrier claim; use H1.16 for the strict carrier result.' },
    evidence: openEvoProgramLinks.ledger,
  },
  {
    id: 'h1-16', stage: 'diagnostic', result: 'negative', coverage: ['H1.16'],
    title: { zh: 'H1.16：三种经验载体的严格负结果', en: 'H1.16: strict negative across three carriers' },
    summary: { zh: '96 / 96 次任务尝试都有效；基础模型、文本记忆载体和参数化载体都没有产生可用于训练的完整成功轨迹，严格配对比较也没有观察到载体带来的增益。这里的“0”是有效负结果，不是实验没运行。', en: 'All 96 attempts were valid; BASE, text memory, and parametric carrier each had zero qualified positives and zero paired carrier gain.' },
    boundary: { zh: '这是这套固定评测面板上的干净负结果：预期收益没有得到支持；它不证明所有经验载体在所有设置下永远无效。', en: 'This is a clean negative on this panel, not proof that every carrier can never work.' },
    evidence: openEvoProgramLinks.ledger,
  },
  {
    id: 'h1-17-21', stage: 'diagnostic', result: 'negative', coverage: ['H1.17', 'H1.18', 'H1.19', 'H1.20', 'H1.21'],
    title: { zh: 'H1.17–H1.21：交互步数上限、动作可执行性与经验载体这些简单解释逐步被排除', en: 'H1.17–H1.21: simple horizon, admissibility, and carrier explanations weakened' },
    summary: { zh: '把最大交互步数从 15 增至 30 仍无改善；H1.18 的 96 次任务尝试中 88 次科学有效，但“恢复经验”相对“成功经验”没有在不同任务分区上出现只属于某一处理的收益；文本记忆与参数化经验载体的配对比较没有增益，过滤不可执行动作和统一更长步数上限也没有恢复任务奖励。', en: 'Increasing horizon from 15 to 30 did not improve outcomes; 88 of 96 H1.18 attempts were scientifically valid without recovery-versus-success selectivity across partitions; text-memory versus parametric carriers had no paired gain, and executable-action filtering plus matched longer horizon did not restore reward.' },
    boundary: { zh: '这些都是在各自预先固定的实验条件下得到的否定诊断；不能外推成“所有交互步数上限、动作过滤或经验载体都无效”。', en: 'These are negative diagnostics under their frozen contracts; they do not establish that every horizon, action filter, or experience carrier is ineffective.' },
    evidence: openEvoProgramLinks.ledger,
  },
  {
    id: 'h1-22-25', stage: 'diagnostic', result: 'invalid', coverage: ['H1.22', 'H1.23', 'H1.24', 'H1.25'],
    title: { zh: 'H1.22–H1.25：任务异质性的描述性诊断', en: 'H1.22–H1.25: descriptive diagnosis of task heterogeneity' },
    summary: { zh: '仅做描述、不作因果推断的分析确认：任务复杂度、任务类型和具体任务身份都会明显影响结果；这些实验没有设置 OpenEvo 处理组，因此不能估计 OpenEvo 方法效应。', en: 'Descriptive-only analyses showed that task complexity, task family, and exact task identity materially affect outcomes; these experiments had no OpenEvo treatment arm.' },
    boundary: { zh: '只能描述任务异质性，不能作为 OpenEvo 方法效果或因果证据。', en: 'They describe task heterogeneity only and cannot support an OpenEvo efficacy or causal claim.' },
    evidence: openEvoProgramLinks.ledger,
  },
  {
    id: 'h1-26-28', stage: 'diagnostic', result: 'negative', coverage: ['H1.26', 'H1.27', 'H1.28'],
    title: { zh: 'H1.26–H1.28：网页信息对齐、模型与动作标签诊断', en: 'H1.26–H1.28: grounding, model, and action-label diagnostics' },
    summary: { zh: '加入标题 / 价格信息让动作更贴合网页内容（grounding）并改变了点击行为，但没有改善任务得分或完整成功。H1.27 的 64 次任务尝试中 48 次有效、16 次因动作解析或系统替代动作而无效，且没有模型在多个任务上完整成功；H1.28 的 96 次任务尝试中 84 次有效、12 次动作解析无效，理想动作标签相对两种对照的配对平均差值都为 −0.3。', en: 'Title/price grounding changed clicks but not score or wins; H1.27 had 48 valid and 16 parser/fallback-invalid attempts out of 64, with no complete multi-task winner; H1.28 had 84 valid and 12 parser-invalid attempts out of 96, and the exact oracle action had a paired delta of -0.3 against both controls.' },
    boundary: { zh: '现有结果不支持“只靠更好的网页信息对齐就足以提高得分”，也不支持“提供理想动作标签会带来收益”；动作解析或系统替代动作污染的尝试不进入科学分母。', en: 'Does not support grounding as sufficient for score improvement or a benefit from exact action labels; parser/fallback-invalid attempts stay outside the scientific denominator.' },
    evidence: openEvoProgramLinks.ledger,
  },
  {
    id: 'h1-29', stage: 'transfer', result: 'negative', coverage: ['H1.29'],
    title: { zh: 'H1.29：自生成经验没有在训练未见任务上带来增益', en: 'H1.29: self-generated experience produced no held-out gain' },
    summary: { zh: '用 3B 自己产生的成功经验训练真实 SD-LoRA；在 64 次“基础模型 vs 自进化模型”任务尝试中没有观察到任务得分增益。', en: 'A real SD-LoRA (the current sequential-difference LoRA update path) was trained on 3B self-generated successes; 64 BASE/SELF-EVOLUTION attempts produced no score gain.' },
    boundary: { zh: '关闭冻结 3B 契约上的负结果；不证明所有自进化方法都无效。', en: 'A closed negative on the frozen 3B contract; does not prove every self-evolution method ineffective.' },
    evidence: openEvoProgramLinks.ledger,
  },
  {
    id: 'h1-30', stage: 'transfer', result: 'protocol', coverage: ['H1.30'],
    title: { zh: 'H1.30：OpenEvo-vs-SEED 正式比较未执行', en: 'H1.30: formal OpenEvo-vs-SEED comparison not executed' },
    summary: { zh: '正式评测的有效统计分母为 0，也就是没有任何样本满足进入正式比较的完整条件；路径资格检查和任务身份诊断只能作为工程证据，不能当成模型得分为 0。', en: 'The formal evaluation denominator is 0; route qualification and task-identity diagnostics provide engineering evidence only.' },
    boundary: { zh: '不能主张 OpenEvo 或 SEED 的优越、等价或劣势。', en: 'No superiority, equivalence, or inferiority claim is available for OpenEvo or SEED.' },
    evidence: openEvoProgramLinks.ledger,
  },
  {
    id: 'h1-31-32', stage: 'transfer', result: 'negative', coverage: ['H1.31', 'H1.32'],
    title: { zh: 'H1.31–H1.32：未参与训练的新任务效应校准', en: 'H1.31–H1.32: fresh-task effect calibration' },
    summary: { zh: '把验证重心移到未参与经验生成的新任务，并校准基线差异与统计口径。', en: 'Validation shifted to tasks not used to generate experience, with baseline differences and statistical conventions calibrated.' },
    boundary: { zh: '任务新鲜度是必要条件，但单一小面板不足以证明泛化。', en: 'Task freshness is necessary, but one small panel is insufficient to establish generalization.' },
    evidence: openEvoProgramLinks.ledger,
  },
  {
    id: 'h1-33', stage: 'transfer', result: 'negative', coverage: ['H1.33'],
    title: { zh: 'H1.33：回放成功经验没有支持跨任务迁移', en: 'H1.33: positive replay did not support transfer' },
    summary: { zh: '回放 H0.1 的成功经验后，在数据完整且科学有效的任务上，基础模型平均分为 0.142857，自进化模型平均分为 0。这个 0 是有效任务上的平均结果，不是缺少数据。', en: 'After replaying H0.1 positives, BASE mean was 0.142857 and SELF mean was 0 on complete-valid tasks.' },
    boundary: { zh: '不支持正向迁移；也不提供 OpenEvo-vs-SEED 比较。', en: 'Does not support positive transfer and does not provide an OpenEvo-versus-SEED comparison.' },
    evidence: openEvoProgramLinks.ledger,
  },
  {
    id: 'h1-34', stage: 'transfer', result: 'negative', coverage: ['H1.34'],
    title: { zh: 'H1.34：受限的动作解析修复提高了有效任务尝试比例', en: 'H1.34: bounded parser repair increased validity' },
    summary: { zh: '64 次任务尝试中有 60 次有效；动作解析修复让更多轨迹能被可靠解释，但有效样本上的平均任务得分仍为 0。', en: 'Sixty of 64 attempts were valid; parser repair improved interpretability, but mean score remained 0.' },
    boundary: { zh: '仅作诊断。历史冻结实验产物文件里嵌入了 H1.30 的数据结构 / 结论元数据，但实际源记录和实验身份属于 H1.34；这里如实披露这个历史不一致，不改写原产物，也不据此提出行为收益或迁移结论。', en: 'Diagnostic only; the historical artifact (a frozen saved experiment output) embeds H1.30 schema/claim metadata although its source rows and identity are H1.34. The mismatch is disclosed, not rewritten; no behavioral-gain or transfer claim.' },
    evidence: openEvoProgramLinks.ledger,
  },
  {
    id: 'h1-35', stage: 'transfer', result: 'negative', coverage: ['H1.35'],
    title: { zh: 'H1.35：根据当前状态调整导航策略，改变了循环行为但没有改变分数', en: 'H1.35: state-aware navigation changed loops, not scores' },
    summary: { zh: '64 / 64 次任务尝试都有效；提示词改变了模型反复操作的循环类型，但平均任务得分仍为 0。', en: 'All 64 attempts were valid; the prompt changed loop types, but mean score remained 0.' },
    boundary: { zh: '仅作诊断。历史冻结实验产物文件里嵌入了 H1.30 的数据结构 / 结论元数据，但实际源记录和实验身份属于 H1.35；这里如实披露而不改写原产物。提示词系列实验已收口，没有迁移结论。', en: 'Diagnostic only; the historical artifact embeds H1.30 schema/claim metadata although its source rows and identity are H1.35. The mismatch is disclosed, not rewritten; the prompt sweep is closed with no transfer claim.' },
    evidence: openEvoProgramLinks.ledger,
  },
  {
    id: 'h1-36-37', stage: 'transfer', result: 'negative', coverage: ['H1.36', 'H1.37'],
    title: { zh: 'H1.36–H1.37：封存的配对试验收口', en: 'H1.36–H1.37: sealed paired-test closeout' },
    summary: { zh: '在完整性门禁下完成配对检验，未建立稳定的总体改进，为更大冻结面板提供方差与协议依据。', en: 'Paired tests closed under integrity gates without establishing stable overall improvement, supplying variance and protocol evidence for a larger frozen panel.' },
    boundary: { zh: '未拒绝零效应不等于证明完全无效。', en: 'Failure to reject a null effect is not proof of zero effect.' },
    evidence: openEvoProgramLinks.ledger,
  },
  {
    id: 'h1-37-r', stage: 'transfer', result: 'negative', coverage: ['H1.37-R'],
    title: { zh: 'H1.37-R：同期重跑基础模型，排除执行时期漂移', en: 'H1.37-R: contemporaneous BASE rerun rules out period drift' },
    summary: { zh: '对 48 个基础模型任务各用 4 个随机种子重跑；原始基础模型结果与同期重跑结果完全相同，排除了“执行时期变化”这一简单解释。同期自进化模型相对基础模型的差异仍接近零，而且样本量不足以支持精确的小效应判断。', en: 'Forty-eight BASE tasks × four seeds were rerun; BASE-original and BASE-R were identical, while contemporaneous SELF versus BASE remained null-like and underpowered.' },
    boundary: { zh: '排除了执行时期漂移这一简单解释；未建立可靠正向迁移，也未证明零效应。', en: 'Rules out execution-period drift as a simple explanation; it establishes neither reliable positive transfer nor a zero effect.' },
    evidence: openEvoProgramLinks.ledger,
  },
  {
    id: 'h1-38a-original', stage: 'closeout', result: 'invalid', coverage: ['H1.38A'],
    title: { zh: 'H1.38A 原始运行：评测面板未完整，因此不能形成有效结论', en: 'H1.38A original launch: incomplete panel, invalid conclusion' },
    summary: { zh: '原始大面板因为缺少评测单元而无法封存为完整结果；这次不完整运行被保留为失败证据，随后只按预先冻结的清单补齐缺失评测单元。', en: 'The original large panel could not be sealed because cells were missing; it remains failure evidence, followed by completion of only the frozen missing cells.' },
    boundary: { zh: '不得把中途 checkpoint 或部分分母写成最终 H1.38 结果。', en: 'Intermediate checkpoints or partial denominators must not be presented as the final H1.38 result.' },
    evidence: openEvoProgramLinks.reconciliation,
  },
  {
    id: 'h1-38ac', stage: 'closeout', result: 'supported', coverage: ['H1.38A-C'],
    title: { zh: 'H1.38A-C：固定评测面板完整收口', en: 'H1.38A-C: complete frozen-panel closeout' },
    summary: { zh: '四个实验组共完成 768 次任务尝试，其中 764 次科学有效；D4、D8、D16 相对基础模型的按任务簇统计 95% 置信区间都跨过 0，而且平均差值并不随设置强度单调增加。', en: 'Across four arms, 764 of 768 attempts were scientifically valid; the task-cluster 95% CI versus base crosses zero for D4, D8, and D16, and the ordered deltas are non-monotonic.' },
    boundary: { zh: '这轮建立了完整固定评测面板，并确认效果大小并不随任务多样性设置单调增加；没有建立可靠正向迁移。它不证明所有“增加任务身份多样性”的选择或所有 OpenEvo 修改都无效。', en: 'Establishes a complete fixed panel and non-monotonic ordered deltas without reliable positive transfer; it does not prove every task-identity diversity choice or OpenEvo modification ineffective.' },
    evidence: openEvoProgramLinks.reconciliation,
  },
  {
    id: 'h1-38b', stage: 'closeout', result: 'design', coverage: ['H1.38B'],
    title: { zh: 'H1.38B：方法对照目前只有目标 / 设计移交', en: 'H1.38B: method control is only a goal/design handoff' },
    summary: { zh: '当前只有目标 / 设计移交；还没有形成被正式接受的预先登记方案，也没有获得执行授权、没有运行，更没有封存结果。', en: 'Only a goal/design handoff exists: there is no accepted preregistration, authorization, execution, or sealed result.' },
    boundary: { zh: '尚未建立结果（not established）：这只是目标 / 设计移交，不是已执行实验，也不能写成“已经运行”或“已经证明”。', en: 'Not established; this is neither a protocol result nor an executed experiment and cannot be presented as run or proven.' },
    evidence: openEvoProgramLinks.campaign,
  },
  {
    id: 'h1-40', stage: 'transfer', result: 'negative', coverage: ['H1.40'],
    title: { zh: 'H1.40：第二代参数写入未过稳定性门', en: 'H1.40: second-generation parameter writing failed stability gates' },
    summary: { zh: '第二轮经验采集共完成 256 次任务尝试，其中 132 条是可用于训练的完整成功轨迹，这些成功覆盖 33 个不同任务。第二代学习适配器 G2 也真实创建了 16 个参数组成项；但“新知识获取、旧能力保持、已有收益保持”三项上游门槛没有全部通过，因此预留的第二代新任务迁移评测 T2 没有启动。', en: 'The 256-attempt E2 harvest produced 132 qualified positives across 33 qualifying identities; G2 was genuinely created with 16 components, but acquisition, retention, and H1.39 preservation upstream gates all failed, so the reserved T2 panel remained unopened.' },
    boundary: { zh: '支持“缺少可学习成功经验不是当前直接瓶颈”；不支持“G2 已经在新任务上产生迁移”或“多代自进化已经成立”。T2 根本没有运行，因此不能把它描述成 T2 评测失败。', en: 'Supports that experience supply was not the immediate bottleneck, but does not support G2 fresh transfer or multi-generation self-evolution; T2 did not run.' },
    evidence: `${sourceRoot}/docs/evidence/remote-runs/2026-08-20/h1.40-g2-r2/FORMAL_UPSTREAM_EVALUATION_REPORT.md`,
  },
  {
    id: 'h1-40-md', stage: 'diagnostic', result: 'invalid', coverage: ['H1.40-MD'],
    title: { zh: 'H1.40-MD：现有实验产物提示“新旧参数幅度失衡”假设', en: 'H1.40-MD: existing artifacts point to a magnitude-imbalance hypothesis' },
    summary: { zh: '离线检查显示，前 8 个历史参数方向保持不变；但最终旧参数组成项的系数均值约为 0.691，新组成项约为 0.181。经验回放构成也从“62 条历史记录 + 2 条本轮记录”变为“48 条历史记录 + 16 条本轮记录”。', en: 'Offline autopsy found the first eight historical directions unchanged, while final old-component coefficients averaged about 0.691 versus 0.181 for new components; replay also shifted from 62 historical plus 2 current records to 48 historical plus 16 current.' },
    boundary: { zh: '这些现象支持优先检查“参数幅度”和“经验回放构成”两个机制假设，但还没有证明它们就是因果原因；那个新知识获取评测单元里的 4 / 4 次任务尝试都因动作解析失败而无效。', en: 'This is diagnostic support for magnitude and replay hypotheses, not a confirmed causal mechanism; all four attempts in the invalid acquisition cell were parser-invalid.' },
    evidence: `${sourceRoot}/docs/evidence/remote-runs/2026-08-21/h1.40-md/ARTIFACT_AUTOPSY.md`,
  },
  {
    id: 'h1-41', stage: 'closeout', result: 'invalid', coverage: ['H1.41'],
    title: { zh: 'H1.41：机制筛选完成，但测量门未通过', en: 'H1.41: mechanism screen completed, measurement boundary not cleared' },
    summary: { zh: 'H1.41 比较“保持 H1.40 原更新器”的 C0 与“重置参数幅度”的 C1，共完成 96 个评测单元、384 次任务尝试。C0 的新知识获取指标点估计为 0，C0 / C1 的旧能力保持指标都为 −0.065625；C1 在“新知识获取”和“已有收益保持”各有一个数据无效的任务簇，因此 T2 没有启动。', en: 'C0 exact H1.40 and C1 reset-magnitude completed 96 cells / 384 attempts; C0 acquisition was 0-point, C0/C1 retention were both −0.065625, C1 had one invalid cluster in acquisition and one in preservation, and T2 remained unopened.' },
    boundary: { zh: '预先固定的机器判定为“测量无效（MEASUREMENT_INVALID）”：当前数据不能支持“重置参数幅度带来改善”、新任务迁移或任何 T2 结论。H1.40 / H1.41 的 T2 都没有运行；这不是把无效数据记成 0 分。', en: 'The selector is MEASUREMENT_INVALID; it supports no magnitude-reset improvement, fresh transfer, or T2 claim. Both H1.40 and H1.41 T2 remain closed.' },
    evidence: openEvoProgramLinks.h141Reconciliation,
  },
  {
    id: 'h1-42', stage: 'diagnostic', result: 'invalid', coverage: ['H1.42-MV'],
    title: { zh: 'H1.42-MV：测量校准仍停在有效性边界', en: 'H1.42-MV: measurement calibration remains at the validity boundary' },
    summary: { zh: 'Stage A 完成 192 个评测单元、768 次任务尝试并通过 MV4 测量校准；条件 Stage B 又完成 144 个评测单元、576 次正式任务尝试。修正“科学实验组”与“模型加载器身份”字段混淆后，C1 在“新知识获取”和“已有收益保持”各仍有一个因动作解析或运行时错误而无效的任务簇，因此机器判定为 MVD0：重新测量仍无效。', en: 'Stage A completed 192 cells / 768 attempts and passed MV4; conditional Stage B completed 144 cells / 576 attempts. After fixing the arm-versus-loader_arm validator bug, C1 retained one parser/runtime-invalid cluster in acquisition and one in preservation; the selector was MVD0.' },
    boundary: { zh: '这是“测量仍无效”的边界结果：不能支持或反驳“重置参数幅度”的可靠机制效应，也不能支持新任务迁移、多代自进化或任何 T2 结论。H1.40 / H1.41 / H1.42 的 T2 都没有运行。', en: 'This is a measurement-boundary result, not evidence for a magnitude-reset effect, fresh transfer, multi-generation self-evolution, or T2; all H1.40/H1.41/H1.42 T2 panels remain closed.' },
    evidence: openEvoProgramLinks.h142Closeout,
  },
] as const;

export const h138Metrics = [
  { id: 'base', label: 'Base', attempts: 192, valid: 192, invalid: 0, mean: 0.145417, delta: null, ci: null, p: null },
  { id: 'd4', label: 'D4', attempts: 192, valid: 188, invalid: 4, mean: 0.138894, delta: 0.011660, ci: [-0.071617, 0.096340], p: 0.8281 },
  { id: 'd8', label: 'D8', attempts: 192, valid: 192, invalid: 0, mean: 0.139625, delta: -0.005792, ci: [-0.067833, 0.048375], p: 0.8704 },
  { id: 'd16', label: 'D16', attempts: 192, valid: 192, invalid: 0, mean: 0.201063, delta: 0.055646, ci: [-0.019354, 0.131521], p: 0.1735 },
] as const;

export const h140Metrics = {
  e2Harvest: { attempts: 256, qualified: 132, identities: 33 },
  g2: { components: 16, effectiveRank: 64 },
  acquisition: { attempts: 32, valid: 28, invalid: 4, delta: 0 },
  retention: { delta: -0.1635, ci: [-0.40725, 0.0355] },
  preservation: { delta: -0.003625, ci: [-0.08012734375, 0.0755015625] },
  t2Opened: false,
} as const;

export const h142Metrics = {
  stageA: { cells: 192, attempts: 768, gpuHours: 4.161926864215381, selector: 'MV4 MEASUREMENT_VALIDATED' },
  stageB: { cells: 144, attempts: 576, gpuHours: 2.335990229417965, invalidAcquisition: 'webshop_003560', invalidPreservation: 'webshop_004357', selector: 'MVD0 REMEASUREMENT_INVALID' },
  totalGpuHours: 6.497917093633346,
  t2Opened: false,
} as const;

export const claimState = {
  confirmed: {
    zh: ['H1.40 第二轮经验采集有 256 次任务尝试，其中 132 条是可用于训练的完整成功轨迹，覆盖 33 个不同的成功任务。', '第二代学习适配器 G2 真实创建了 16 个参数组成项，有效秩为 64。', 'H1.40 的新知识获取、旧能力保持、已有收益保持三项上游门槛没有全部通过；H1.41 与 H1.42 又停在测量有效性边界，因此 T2 没有启动。'],
    en: ['H1.40 E2 harvest contained 256 attempts, 132 qualified positives, and 33 qualifying identities.', 'G2 was genuinely created with 16 components and effective rank 64.', 'H1.40 upstream gates did not pass; H1.41 and H1.42 both closed at measurement boundaries, and T2 remained unopened.'],
  },
  inferred: {
    zh: ['第二轮并不缺可学习成功经验；当前瓶颈转向“学习新知识”与“保持旧能力”之间的冲突。', 'H1.40-MD 支持优先检查参数幅度、经验回放构成，以及连续增加参数组成项时可能产生的相互干扰。'],
    en: ['E2 supply was not the immediate bottleneck; the bottleneck shifted to stability–plasticity during continual parameter writing.', 'H1.40-MD supports prioritizing magnitude, replay, and cumulative-component-interference diagnostics.'],
  },
  unknown: {
    zh: ['新旧参数幅度失衡是否是 G2 没能继续建立可靠迁移证据的因果机制，仍然未知。', 'G2、H1.41 与 H1.42 都没有进行可解释为“第二代新任务迁移”的正式 T2 评测；T2 根本没有运行。', 'H1.42 修正测量校验器后，C1 仍有因动作解析或运行时错误而无效的任务簇；后续能否通过测量流程修复消除这些无效数据，仍然未知。'],
    en: ['Whether magnitude imbalance is the causal mechanism behind G2 failure remains unknown.', 'Fresh-task transfer was not measured for G2, H1.41, or H1.42; T2 did not run.', 'H1.42 still had C1 parser/runtime-invalid clusters after the validator fix; whether later measurement repair can remove them remains unknown.'],
  },
} as const;

export const nextDecisionNodes = [
  {
    id: 'magnitude-control', order: '01',
    title: { zh: '同一批数据，只改变参数幅度策略', en: 'Same data, one magnitude-policy change' },
    question: { zh: '问题是否来自新参数的初始幅度？', en: 'Does magnitude initialization explain the failure?' },
    change: { zh: 'C0 保持 H1.40 原参数更新方法；C1 只把新参数幅度重置为初始系数，其他训练数据、低秩容量、经验回放构成和训练调度都保持不变。', en: 'C0 keeps the H1.40 updater; C1 resets magnitudes to coefficient init while holding data, rank, replay, and schedule fixed.' },
  },
  {
    id: 'three-gates', order: '02',
    title: { zh: '先通过三个上游门槛', en: 'Pass three upstream gates first' },
    question: { zh: '新知识写入后旧能力还在吗？', en: 'Does old capability survive new writing?' },
    change: { zh: '先分别报告新知识获取、旧能力保持与 H1.39 已有收益保持；只有三者都可靠通过后，才会另外预先固定并启动 T2 新任务迁移评测。', en: 'Report acquisition, retention, and H1.39 preservation separately; preregister T2 only after all three pass reliably.' },
  },
  {
    id: 'state-schema', order: '03',
    title: { zh: '决策状态一等化', en: 'Make decision state first-class' },
    question: { zh: '经验在什么状态下才有用？', en: 'In what state is an experience useful?' },
    change: { zh: '若 method control 仍为 null，再在 schema 中记录可执行动作、结构化状态、credit、状态变化和恢复点。', en: 'If the method control remains null, extend the schema with admissible actions, structured state, credit, state change, and recovery points.' },
  },
  {
    id: 'evolution-ledger', order: '04',
    title: { zh: '持续进化五项账本', en: 'Five-part continual-evolution ledger' },
    question: { zh: '何时才能声称自进化？', en: 'When can self-evolution be claimed?' },
    change: { zh: '每一轮都分别记录新知识获取、参数更新是否有效、旧能力保持、向后续新任务的迁移，以及无效数据和算力消耗；只有连续多轮都通过后，才使用“多代自进化能力已经建立”的结论。', en: 'Track acquisition, update validity, retention, forward transfer, and invalidity/compute each round; use a capability claim only after repeated passes.' },
  },
] as const;
