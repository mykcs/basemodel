export const openEvoProgramSource = {
  commit: '93a38821c884a633817bf412643b20e0b283a678',
  checkedAt: '2026-08-20',
  branch: 'main',
  campaign: '20260819-0215-h138a-c-frozen-panel-completion',
} as const;

const sourceRoot = `https://github.com/mykcs/openevo-experiment/blob/${openEvoProgramSource.commit}`;

export const openEvoProgramSourcePaths = {
  ledger: 'docs/experiment-tracking/WEBSHOP_PROGRAM_LEDGER.v1.json',
  report: 'docs/reports/OPEN_EVO_WEBSHOP_PROGRAM_REPORT_2026-08-20.md',
  reconciliation: 'docs/evidence/remote-runs/2026-08-19/h1.38a-c/evidence/h1.38a-c-combined-reconciliation.json',
  campaign: 'configs/experiment/current-campaign.json',
} as const;

export const openEvoProgramLinks = {
  ledger: `${sourceRoot}/${openEvoProgramSourcePaths.ledger}`,
  report: `${sourceRoot}/${openEvoProgramSourcePaths.report}`,
  reconciliation: `${sourceRoot}/${openEvoProgramSourcePaths.reconciliation}`,
  campaign: `${sourceRoot}/${openEvoProgramSourcePaths.campaign}`,
} as const;

export type ProgramLocale = 'zh' | 'en';
export type ProgramStage = 'foundation' | 'diagnostic' | 'transfer' | 'closeout';
export type ProgramResult = 'supported' | 'negative' | 'invalid' | 'protocol';

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
} as const;

export const programTimeline = [
  {
    id: 'phase-g', stage: 'foundation', result: 'invalid', coverage: ['Phase G'],
    title: { zh: 'Phase G：闭环首次端到端落地', en: 'Phase G: first end-to-end closed loop' },
    summary: { zh: '参数载体、重载与评估链路能够运行，但三种策略在 12 个 promotion-dev episode 上均为 0。', en: 'The parametric carrier, reload, and evaluation path ran, but all three strategies scored 0 across 12 promotion-dev episodes.' },
    boundary: { zh: '仅有 dated narrative，没有独立 machine reconciliation；只作机制/基线诊断，不证明 WebShop 改善。', en: 'Only a dated narrative survives, without a standalone machine reconciliation; diagnostic mechanism/baseline evidence only, not WebShop improvement.' },
    evidence: openEvoProgramLinks.ledger,
  },
  {
    id: 'h0', stage: 'foundation', result: 'supported', coverage: ['H0', 'H0.1'],
    title: { zh: 'H0–H0.1：成功经验供给成立', en: 'H0–H0.1: successful-experience supply established' },
    summary: { zh: 'H0 的 128 次尝试中有 96 次科学有效和 28 个合格正例，证明 3B base 在选定 train-only 任务上能够产生可学习成功经验。', en: 'H0 produced 96 scientifically valid attempts and 28 qualified positives out of 128, establishing that the 3B base can generate learnable successful experience on selected train-only tasks.' },
    boundary: { zh: '证明正例存在；不证明更新后能迁移到 fresh tasks。', en: 'Establishes that positives exist; does not establish post-update transfer to fresh tasks.' },
    evidence: openEvoProgramLinks.ledger,
  },
  {
    id: 'h1-1-4', stage: 'diagnostic', result: 'invalid', coverage: ['H1.1', 'H1.2', 'H1.3', 'H1.4'],
    title: { zh: 'H1.1–H1.4：先修可比性', en: 'H1.1–H1.4: repair comparability first' },
    summary: { zh: '围绕动作解析、fallback、任务抽样和评估器一致性建立诊断；部分运行只能作为工程证据。', en: 'Diagnostics targeted action parsing, fallback behavior, task sampling, and evaluator consistency; some runs remain engineering evidence only.' },
    boundary: { zh: '解析或 fallback 污染的尝试不得进入科学分母。', en: 'Attempts contaminated by parsing or fallback must not enter the scientific denominator.' },
    evidence: openEvoProgramLinks.ledger,
  },
  {
    id: 'h1-5-8', stage: 'diagnostic', result: 'negative', coverage: ['H1.5', 'H1.6', 'H1.7', 'H1.8'],
    title: { zh: 'H1.5–H1.8：成功样本与适配器信号', en: 'H1.5–H1.8: success samples and adapter signal' },
    summary: { zh: '逐步验证经验抽取、适配器构建与行为探针；机制信号出现，但任务收益仍未成立。', en: 'Experience extraction, adapter construction, and behavior probes were validated incrementally; mechanism signals appeared, but task benefit remained unestablished.' },
    boundary: { zh: '非零参数或 logit 变化是机制证据，不等于任务分数提升。', en: 'Nonzero parameter or logit changes are mechanism evidence, not task-score improvement.' },
    evidence: openEvoProgramLinks.ledger,
  },
  {
    id: 'h1-9-12', stage: 'diagnostic', result: 'negative', coverage: ['H1.9', 'H1.10', 'H1.11', 'H1.12'],
    title: { zh: 'H1.9–H1.12：策略和评分敏感性', en: 'H1.9–H1.12: policy and scoring sensitivity' },
    summary: { zh: '用受控变体检查训练强度、打分和动作选择的敏感性，没有建立稳定的正向规律。', en: 'Controlled variants tested sensitivity to training intensity, scoring, and action selection; no stable positive pattern was established.' },
    boundary: { zh: '局部波动不能被解释为泛化改善。', en: 'Local fluctuations cannot be interpreted as generalization gains.' },
    evidence: openEvoProgramLinks.ledger,
  },
  {
    id: 'h1-13-16', stage: 'diagnostic', result: 'negative', coverage: ['H1.13', 'H1.14', 'H1.15', 'H1.16'],
    title: { zh: 'H1.13–H1.16：载体与重载诊断', en: 'H1.13–H1.16: carrier and reload diagnosis' },
    summary: { zh: '排查适配器保存、重新加载和行为生效，缩小“训练发生但行为未改善”的解释空间。', en: 'Adapter persistence, reload, and behavioral activation were inspected, narrowing explanations for training without behavioral improvement.' },
    boundary: { zh: '排除实现故障仍不自动支持科学假设。', en: 'Ruling out implementation faults does not automatically support the scientific hypothesis.' },
    evidence: openEvoProgramLinks.ledger,
  },
  {
    id: 'h1-17-20', stage: 'diagnostic', result: 'negative', coverage: ['H1.17', 'H1.18', 'H1.19', 'H1.20'],
    title: { zh: 'H1.17–H1.20：运行恢复与严谨分母', en: 'H1.17–H1.20: runtime recovery and strict denominators' },
    summary: { zh: 'GPU/容器恢复后继续受控实验，同时把运行成功、工程有效和科学有效分开。', en: 'Controlled experiments resumed after GPU/container recovery while separating runtime success, engineering validity, and scientific validity.' },
    boundary: { zh: '能跑完不是能用于结论；无效尝试必须显式保留。', en: 'Completion is not scientific usability; invalid attempts must remain explicit.' },
    evidence: openEvoProgramLinks.ledger,
  },
  {
    id: 'h1-21-24', stage: 'diagnostic', result: 'negative', coverage: ['H1.21', 'H1.22', 'H1.23', 'H1.24'],
    title: { zh: 'H1.21–H1.24：尺度与任务局部性', en: 'H1.21–H1.24: scale and task locality' },
    summary: { zh: '扩大或重配训练信号后，仍未形成跨任务稳定收益，提示问题不只是训练量不足。', en: 'Increasing or reallocating training signal still did not produce stable cross-task benefit, suggesting the issue was not merely insufficient scale.' },
    boundary: { zh: '不能把更大训练量等同于更强自进化。', en: 'More training cannot be equated with stronger self-evolution.' },
    evidence: openEvoProgramLinks.ledger,
  },
  {
    id: 'h1-25-28', stage: 'diagnostic', result: 'negative', coverage: ['H1.25', 'H1.26', 'H1.27', 'H1.28'],
    title: { zh: 'H1.25–H1.28：尺度假设未获支持', en: 'H1.25–H1.28: scale hypothesis not supported' },
    summary: { zh: '密封结果显示扩大训练规模不足以解释改善，且一部分尝试因解析/fallback 被排除。', en: 'Sealed results showed that scaling training was insufficient to explain improvement, with some attempts excluded for parsing/fallback contamination.' },
    boundary: { zh: '支持“仅靠尺度不够”的否定性结论，不支持“方法已失败于所有设置”。', en: 'Supports the negative claim that scale alone is insufficient; not that the method fails in every setting.' },
    evidence: openEvoProgramLinks.ledger,
  },
  {
    id: 'h1-29', stage: 'transfer', result: 'negative', coverage: ['H1.29'],
    title: { zh: 'H1.29：自生成经验未带来 held-out 增益', en: 'H1.29: self-generated experience produced no held-out gain' },
    summary: { zh: '用 3B 自生成成功经验训练真实 SD-LoRA；64 次 BASE/SELF-EVOLUTION 尝试没有 score gain。', en: 'A real SD-LoRA was trained on 3B self-generated successes; 64 BASE/SELF-EVOLUTION attempts produced no score gain.' },
    boundary: { zh: '关闭冻结 3B 契约上的负结果；不证明所有自进化方法都无效。', en: 'A closed negative on the frozen 3B contract; does not prove every self-evolution method ineffective.' },
    evidence: openEvoProgramLinks.ledger,
  },
  {
    id: 'h1-30', stage: 'transfer', result: 'protocol', coverage: ['H1.30'],
    title: { zh: 'H1.30：OpenEvo-vs-SEED 正式比较未执行', en: 'H1.30: formal OpenEvo-vs-SEED comparison not executed' },
    summary: { zh: '正式 evaluation denominator 为 0；route qualification 和 task-identity diagnostic 只提供工程诊断。', en: 'The formal evaluation denominator is 0; route qualification and task-identity diagnostics provide engineering evidence only.' },
    boundary: { zh: '不能主张 OpenEvo 或 SEED 的优越、等价或劣势。', en: 'No superiority, equivalence, or inferiority claim is available for OpenEvo or SEED.' },
    evidence: openEvoProgramLinks.ledger,
  },
  {
    id: 'h1-31-32', stage: 'transfer', result: 'negative', coverage: ['H1.31', 'H1.32'],
    title: { zh: 'H1.31–H1.32：新任务效应校准', en: 'H1.31–H1.32: fresh-task effect calibration' },
    summary: { zh: '把验证重心移到未参与经验生成的新任务，并校准基线差异与统计口径。', en: 'Validation shifted to tasks not used to generate experience, with baseline differences and statistical conventions calibrated.' },
    boundary: { zh: '任务新鲜度是必要条件，但单一小面板不足以证明泛化。', en: 'Task freshness is necessary, but one small panel is insufficient to establish generalization.' },
    evidence: openEvoProgramLinks.ledger,
  },
  {
    id: 'h1-33', stage: 'transfer', result: 'negative', coverage: ['H1.33', 'H1.33R'],
    title: { zh: 'H1.33：正例 replay 未支持迁移', en: 'H1.33: positive replay did not support transfer' },
    summary: { zh: '用 H0.1 正例 replay 后，complete-valid tasks 上 BASE mean 为 0.142857、SELF mean 为 0。', en: 'After replaying H0.1 positives, BASE mean was 0.142857 and SELF mean was 0 on complete-valid tasks.' },
    boundary: { zh: '不支持正向迁移；也不提供 OpenEvo-vs-SEED 比较。', en: 'Does not support positive transfer and does not provide an OpenEvo-versus-SEED comparison.' },
    evidence: openEvoProgramLinks.ledger,
  },
  {
    id: 'h1-34', stage: 'transfer', result: 'negative', coverage: ['H1.34'],
    title: { zh: 'H1.34：bounded parser repair 提高有效率', en: 'H1.34: bounded parser repair increased validity' },
    summary: { zh: '64 次尝试中有 60 次有效；parser repair 改善了可解释性，但 mean score 仍为 0。', en: 'Sixty of 64 attempts were valid; parser repair improved interpretability, but mean score remained 0.' },
    boundary: { zh: '仅诊断；历史 artifact 内嵌 H1.30 schema/claim metadata，虽源行与身份为 H1.34，现仅披露而不改写。没有行为收益或迁移主张。', en: 'Diagnostic only; the historical artifact embeds H1.30 schema/claim metadata although its source rows and identity are H1.34. The mismatch is disclosed, not rewritten; no behavioral-gain or transfer claim.' },
    evidence: openEvoProgramLinks.ledger,
  },
  {
    id: 'h1-35', stage: 'transfer', result: 'negative', coverage: ['H1.35'],
    title: { zh: 'H1.35：state-aware navigation 改变 loop，未改分数', en: 'H1.35: state-aware navigation changed loops, not scores' },
    summary: { zh: '64/64 次尝试有效；提示改变了 loop 类型，但 mean score 仍为 0。', en: 'All 64 attempts were valid; the prompt changed loop types, but mean score remained 0.' },
    boundary: { zh: '仅诊断；历史 artifact 内嵌 H1.30 schema/claim metadata，虽源行与身份为 H1.35，现仅披露而不改写。prompt sweep 关闭，没有迁移主张。', en: 'Diagnostic only; the historical artifact embeds H1.30 schema/claim metadata although its source rows and identity are H1.35. The mismatch is disclosed, not rewritten; the prompt sweep is closed with no transfer claim.' },
    evidence: openEvoProgramLinks.ledger,
  },
  {
    id: 'h1-36-37', stage: 'transfer', result: 'negative', coverage: ['H1.36', 'H1.37'],
    title: { zh: 'H1.36–H1.37：密封配对试验收口', en: 'H1.36–H1.37: sealed paired-test closeout' },
    summary: { zh: '在完整性门禁下完成配对检验，未建立稳定的总体改进，为更大冻结面板提供方差与协议依据。', en: 'Paired tests closed under integrity gates without establishing stable overall improvement, supplying variance and protocol evidence for a larger frozen panel.' },
    boundary: { zh: '未拒绝零效应不等于证明完全无效。', en: 'Failure to reject a null effect is not proof of zero effect.' },
    evidence: openEvoProgramLinks.ledger,
  },
  {
    id: 'h1-38a-original', stage: 'closeout', result: 'invalid', coverage: ['H1.38A'],
    title: { zh: 'H1.38A 原始启动：面板未完整，结论无效', en: 'H1.38A original launch: incomplete panel, invalid conclusion' },
    summary: { zh: '原始大面板因缺失 cell 无法密封，保留为失败证据，随后按冻结清单只补缺失 cell。', en: 'The original large panel could not be sealed because cells were missing; it remains failure evidence, followed by completion of only the frozen missing cells.' },
    boundary: { zh: '不得把中途 checkpoint 或部分分母写成最终 H1.38 结果。', en: 'Intermediate checkpoints or partial denominators must not be presented as the final H1.38 result.' },
    evidence: openEvoProgramLinks.reconciliation,
  },
  {
    id: 'h1-38ac', stage: 'closeout', result: 'supported', coverage: ['H1.38A-C'],
    title: { zh: 'H1.38A-C：冻结面板完整收口', en: 'H1.38A-C: complete frozen-panel closeout' },
    summary: { zh: '四臂共 768 次尝试，764 次科学有效；D4、D8、D16 相对 base 均未达到预注册显著性标准。', en: 'Across four arms, 764 of 768 attempts were scientifically valid; D4, D8, and D16 did not meet the preregistered significance criterion versus base.' },
    boundary: { zh: '建立“本冻结面板未检出显著收益”；不证明所有深度或所有 OpenEvo 修改都无效。', en: 'Establishes no detected significant benefit on this frozen panel; does not prove every depth or every OpenEvo modification ineffective.' },
    evidence: openEvoProgramLinks.reconciliation,
  },
  {
    id: 'h1-38b', stage: 'closeout', result: 'protocol', coverage: ['H1.38B'],
    title: { zh: 'H1.38B：方法对照尚未获授权', en: 'H1.38B: method control not authorized' },
    summary: { zh: '存在协议草案，但当前 campaign 明确关闭任务消耗；没有密封结果，也没有执行授权。', en: 'A protocol draft exists, but the current campaign explicitly closes task consumption; there is no sealed result and no execution authorization.' },
    boundary: { zh: '只能写 protocol-only / not-established，不能写成已运行或已证明。', en: 'May only be described as protocol-only / not-established, never as executed or proven.' },
    evidence: openEvoProgramLinks.campaign,
  },
  {
    id: 'next', stage: 'closeout', result: 'protocol', coverage: ['Next'],
    title: { zh: '下一步：方法修改是推断，不是结果', en: 'Next: method changes are inference, not results' },
    summary: { zh: '优先冻结 H1.38 D8 的同一份数据，比较 ordinary sequential LoRA 与现有 SD-LoRA，并拆开 acquisition、retention 与 untouched transfer。', en: 'First freeze the same H1.38 D8 data, compare ordinary sequential LoRA with the current SD-LoRA, and separate acquisition, retention, and untouched transfer.' },
    boundary: { zh: '这是 inference/recommendation，必须经新预注册实验验证。', en: 'This is inference/recommendation and requires a new preregistered experiment.' },
    evidence: openEvoProgramLinks.report,
  },
] as const;

export const h138Metrics = [
  { id: 'base', label: 'Base', attempts: 192, valid: 192, invalid: 0, mean: 0.145417, delta: null, ci: null, p: null },
  { id: 'd4', label: 'D4', attempts: 192, valid: 188, invalid: 4, mean: 0.138894, delta: 0.011660, ci: [-0.071617, 0.096340], p: 0.8281 },
  { id: 'd8', label: 'D8', attempts: 192, valid: 192, invalid: 0, mean: 0.139625, delta: -0.005792, ci: [-0.067833, 0.048375], p: 0.8704 },
  { id: 'd16', label: 'D16', attempts: 192, valid: 192, invalid: 0, mean: 0.201063, delta: 0.055646, ci: [-0.019354, 0.131521], p: 0.1735 },
] as const;

export const claimState = {
  confirmed: {
    zh: ['完整冻结面板为 768 次尝试、764 次科学有效。', 'D4/D8/D16 相对 base 均未达到预注册显著性标准。', '扩大训练深度本身没有成为稳定改进规律。'],
    en: ['The complete frozen panel contains 768 attempts, 764 scientifically valid.', 'D4/D8/D16 did not meet the preregistered significance criterion versus base.', 'Increasing training depth alone did not become a stable improvement rule.'],
  },
  inferred: {
    zh: ['经验质量和信用分配可能比单独增加深度更关键。', '框架应在持久化前加入反事实验证与回滚门控。'],
    en: ['Experience quality and credit assignment may matter more than depth alone.', 'The framework should add counterfactual validation and rollback gates before persistence.'],
  },
  unknown: {
    zh: ['带匹配方法对照的 H1.38B 尚未授权或执行。', '这些修改能否跨任务、跨种子稳定改善仍未知。'],
    en: ['H1.38B with a matched method control is not authorized or executed.', 'Whether these changes improve reliably across tasks and seeds remains unknown.'],
  },
} as const;

export const nextDecisionNodes = [
  {
    id: 'method-control', order: '01',
    title: { zh: '同数据、不同更新方法', en: 'Same data, different update methods' },
    question: { zh: '瓶颈来自数据还是 update rule？', en: 'Is the bottleneck the data or the update rule?' },
    change: { zh: '冻结 H1.38 D8 的 16 条记录、8 个 task identity 和原顺序；比较 ordinary sequential LoRA 与现有 SD-LoRA。', en: 'Freeze the 16 H1.38 D8 records, 8 task identities, and original order; compare ordinary sequential LoRA with the current SD-LoRA.' },
  },
  {
    id: 'three-panels', order: '02',
    title: { zh: '拆开三类能力', en: 'Separate three capabilities' },
    question: { zh: '学会、记住、迁移分别怎样？', en: 'What was acquired, retained, and transferred?' },
    change: { zh: '分别报告 acquisition、retention 与 untouched transfer，避免一个总分掩盖失败位置。', en: 'Report acquisition, retention, and untouched transfer separately so one aggregate score cannot hide where failure occurs.' },
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
    change: { zh: '逐轮记录 acquisition、update validity、retention、forward transfer 和 invalidity/compute；多轮通过后才使用能力结论。', en: 'Track acquisition, update validity, retention, forward transfer, and invalidity/compute each round; use a capability claim only after repeated passes.' },
  },
] as const;
