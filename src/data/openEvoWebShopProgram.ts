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
    summary: { zh: '围绕动作解析、fallback（解析失败时执行的替代动作）、任务抽样和评估器一致性建立诊断；部分运行只能作为工程证据。', en: 'Diagnostics targeted action parsing, fallback (a substitute action used after parsing failure), task sampling, and evaluator consistency; some runs remain engineering evidence only.' },
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
    id: 'h1-9', stage: 'diagnostic', result: 'negative', coverage: ['H1.9'],
    title: { zh: 'H1.9：fresh-seed 救援仍为 task-specific', en: 'H1.9: fresh-seed rescue remained task-specific' },
    summary: { zh: 'H1.8 的 state-aware rescue 在新 seeds 上复现，但仍局限于同一个 task identity。', en: 'The H1.8 state-aware rescue replicated on fresh seeds but remained limited to the same task identity.' },
    boundary: { zh: '一个任务实例上的复现不是广泛泛化。', en: 'Replication on one task instance is not broad generalization.' },
    evidence: openEvoProgramLinks.ledger,
  },
  {
    id: 'h1-10', stage: 'diagnostic', result: 'negative', coverage: ['H1.10'],
    title: { zh: 'H1.10：新任务正例与实验 arm 无关', en: 'H1.10: new-task positives were arm-independent' },
    summary: { zh: '128 次尝试中出现新任务正行为，但该现象不是 state-aware arm 的选择性效果。', en: 'Positive behavior appeared on new tasks across 128 attempts, but it was not selective to the state-aware arm.' },
    boundary: { zh: '正结果本身不能识别 OpenEvo treatment effect。', en: 'Positive outcomes alone do not identify an OpenEvo treatment effect.' },
    evidence: openEvoProgramLinks.ledger,
  },
  {
    id: 'h1-11', stage: 'diagnostic', result: 'negative', coverage: ['H1.11'],
    title: { zh: 'H1.11：正例监督更易拟合，未迁移到闭环行为', en: 'H1.11: positive supervision fit better without closed-loop transfer' },
    summary: { zh: '96 次 evaluation attempts 显示 positive supervision 比 failure supervision 拟合更好，但 fresh-task 闭环行为没有改善。', en: 'Across 96 evaluation attempts, positive supervision fit better than failure supervision, but fresh-task closed-loop behavior did not improve.' },
    boundary: { zh: 'fit 不是 behavioral transfer。', en: 'Fit is not behavioral transfer.' },
    evidence: openEvoProgramLinks.ledger,
  },
  {
    id: 'h1-12', stage: 'diagnostic', result: 'negative', coverage: ['H1.12'],
    title: { zh: 'H1.12：state-aware recovery cue 未选择性救援', en: 'H1.12: state-aware recovery cue did not selectively rescue' },
    summary: { zh: '在 128 次尝试中，state-aware recovery cue 没有选择性恢复已拟合 adapter 的闭环表现。', en: 'Across 128 attempts, the state-aware recovery cue did not selectively recover closed-loop performance from the fitted adapter.' },
    boundary: { zh: '这是冻结契约下的负诊断，不是全局不可能性结论。', en: 'This is a negative diagnostic under the frozen contract, not a global impossibility claim.' },
    evidence: openEvoProgramLinks.ledger,
  },
  {
    id: 'h1-13', stage: 'diagnostic', result: 'negative', coverage: ['H1.13'],
    title: { zh: 'H1.13：action-only targets 能拟合，未产生选择性迁移', en: 'H1.13: action-only targets fit without selective transfer' },
    summary: { zh: '96 次尝试中，action-only supervision targets 可以拟合，但没有形成 selective closed-loop transfer。', en: 'Across 96 attempts, action-only supervision targets fit but did not produce selective closed-loop transfer.' },
    boundary: { zh: '只排除该冻结契约下的 target-format 解释。', en: 'Rules out this target-format explanation only under the frozen contract.' },
    evidence: openEvoProgramLinks.ledger,
  },
  {
    id: 'h1-14', stage: 'diagnostic', result: 'protocol', coverage: ['H1.14'],
    title: { zh: 'H1.14：teacher control 只有 protocol-only 证据', en: 'H1.14: teacher control has protocol-only evidence' },
    summary: { zh: 'recovery corpus 已准备，但原 successful-state teacher 路线没有密封 matched evaluation panel。', en: 'The recovery corpus was prepared, but the original successful-state teacher route did not seal a matched evaluation panel.' },
    boundary: { zh: '没有 H1.14 comparative scientific result。', en: 'There is no H1.14 comparative scientific result.' },
    evidence: openEvoProgramLinks.ledger,
  },
  {
    id: 'h1-15', stage: 'diagnostic', result: 'invalid', coverage: ['H1.15'],
    title: { zh: 'H1.15：carrier diagnostic 无效且非因果', en: 'H1.15: invalid, non-causal carrier diagnostic' },
    summary: { zh: '观察到 carrier 行为异质性，但 panel 含 parser-invalid cells 与 executable-SHA drift，比较不满足 strict-causal 条件。', en: 'Carrier behavior was heterogeneous, but parser-invalid cells and executable-SHA drift made the comparison non-strict and non-causal.' },
    boundary: { zh: '不承担 carrier 结论；严格 carrier 主张以 H1.16 为准。', en: 'Carries no carrier claim; use H1.16 for the strict carrier result.' },
    evidence: openEvoProgramLinks.ledger,
  },
  {
    id: 'h1-16', stage: 'diagnostic', result: 'negative', coverage: ['H1.16'],
    title: { zh: 'H1.16：三种 carrier 的严格负结果', en: 'H1.16: strict negative across three carriers' },
    summary: { zh: '96/96 次尝试有效；BASE、text memory 与 parametric carrier 都是 0 个合格正例、0 paired carrier gain。', en: 'All 96 attempts were valid; BASE, text memory, and parametric carrier each had zero qualified positives and zero paired carrier gain.' },
    boundary: { zh: '这是本 panel 上的 clean negative，不证明所有 carrier 永远无效。', en: 'This is a clean negative on this panel, not proof that every carrier can never work.' },
    evidence: openEvoProgramLinks.ledger,
  },
  {
    id: 'h1-17-21', stage: 'diagnostic', result: 'negative', coverage: ['H1.17', 'H1.18', 'H1.19', 'H1.20', 'H1.21'],
    title: { zh: 'H1.17–H1.21：horizon、admissibility 与 carrier 的简单解释减弱', en: 'H1.17–H1.21: simple horizon, admissibility, and carrier explanations weakened' },
    summary: { zh: 'horizon 从 15 增至 30 仍无改善；96 次 H1.18 尝试中 88 次科学有效，但未出现 recovery-vs-success 跨 partition 选择性收益；text-memory/parametric carrier 无 paired gain，过滤不可执行动作和匹配长 horizon 也未恢复 reward。', en: 'Increasing horizon from 15 to 30 did not improve outcomes; 88 of 96 H1.18 attempts were scientifically valid without recovery-versus-success selectivity across partitions; text-memory versus parametric carriers had no paired gain, and executable-action filtering plus matched longer horizon did not restore reward.' },
    boundary: { zh: '这些是在各自冻结契约下的否定诊断；不能外推为所有 horizon、动作过滤或经验载体都无效。', en: 'These are negative diagnostics under their frozen contracts; they do not establish that every horizon, action filter, or experience carrier is ineffective.' },
    evidence: openEvoProgramLinks.ledger,
  },
  {
    id: 'h1-22-25', stage: 'diagnostic', result: 'invalid', coverage: ['H1.22', 'H1.23', 'H1.24', 'H1.25'],
    title: { zh: 'H1.22–H1.25：任务异质性的描述性诊断', en: 'H1.22–H1.25: descriptive diagnosis of task heterogeneity' },
    summary: { zh: 'descriptive-only 分析确认 task complexity、task family 与具体 task identity 会明显影响结果；这些实验没有 OpenEvo treatment arm。', en: 'Descriptive-only analyses showed that task complexity, task family, and exact task identity materially affect outcomes; these experiments had no OpenEvo treatment arm.' },
    boundary: { zh: '只能描述任务异质性，不能作为 OpenEvo 方法效果或因果证据。', en: 'They describe task heterogeneity only and cannot support an OpenEvo efficacy or causal claim.' },
    evidence: openEvoProgramLinks.ledger,
  },
  {
    id: 'h1-26-28', stage: 'diagnostic', result: 'negative', coverage: ['H1.26', 'H1.27', 'H1.28'],
    title: { zh: 'H1.26–H1.28：grounding、模型与动作标签诊断', en: 'H1.26–H1.28: grounding, model, and action-label diagnostics' },
    summary: { zh: '标题/价格 grounding 改变点击但未改变 score/win；H1.27 的 64 次尝试中 48 次有效、16 次 parser/fallback invalid，且无完整多任务赢家；H1.28 的 96 次尝试中 84 次有效、12 次 parser invalid，精确 oracle action 相对两种控制的 paired delta 均为 -0.3。', en: 'Title/price grounding changed clicks but not score or wins; H1.27 had 48 valid and 16 parser/fallback-invalid attempts out of 64, with no complete multi-task winner; H1.28 had 84 valid and 12 parser-invalid attempts out of 96, and the exact oracle action had a paired delta of -0.3 against both controls.' },
    boundary: { zh: '不支持 grounding 足以改善得分或精确动作标签带来收益；parser/fallback 无效尝试不进入科学分母。', en: 'Does not support grounding as sufficient for score improvement or a benefit from exact action labels; parser/fallback-invalid attempts stay outside the scientific denominator.' },
    evidence: openEvoProgramLinks.ledger,
  },
  {
    id: 'h1-29', stage: 'transfer', result: 'negative', coverage: ['H1.29'],
    title: { zh: 'H1.29：自生成经验未带来 held-out 增益', en: 'H1.29: self-generated experience produced no held-out gain' },
    summary: { zh: '用 3B 自生成成功经验训练真实 SD-LoRA（当前 sequential-difference LoRA 更新路径）；64 次 BASE/SELF-EVOLUTION 尝试没有 score gain。', en: 'A real SD-LoRA (the current sequential-difference LoRA update path) was trained on 3B self-generated successes; 64 BASE/SELF-EVOLUTION attempts produced no score gain.' },
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
    id: 'h1-33', stage: 'transfer', result: 'negative', coverage: ['H1.33'],
    title: { zh: 'H1.33：正例 replay 未支持迁移', en: 'H1.33: positive replay did not support transfer' },
    summary: { zh: '用 H0.1 正例 replay 后，complete-valid tasks 上 BASE mean 为 0.142857、SELF mean 为 0。', en: 'After replaying H0.1 positives, BASE mean was 0.142857 and SELF mean was 0 on complete-valid tasks.' },
    boundary: { zh: '不支持正向迁移；也不提供 OpenEvo-vs-SEED 比较。', en: 'Does not support positive transfer and does not provide an OpenEvo-versus-SEED comparison.' },
    evidence: openEvoProgramLinks.ledger,
  },
  {
    id: 'h1-34', stage: 'transfer', result: 'negative', coverage: ['H1.34'],
    title: { zh: 'H1.34：bounded parser repair 提高有效率', en: 'H1.34: bounded parser repair increased validity' },
    summary: { zh: '64 次尝试中有 60 次有效；parser repair 改善了可解释性，但 mean score 仍为 0。', en: 'Sixty of 64 attempts were valid; parser repair improved interpretability, but mean score remained 0.' },
    boundary: { zh: '仅诊断；历史 artifact（冻结保存的实验产物文件）内嵌 H1.30 schema/claim metadata，虽源行与身份为 H1.34，现仅披露而不改写。没有行为收益或迁移主张。', en: 'Diagnostic only; the historical artifact (a frozen saved experiment output) embeds H1.30 schema/claim metadata although its source rows and identity are H1.34. The mismatch is disclosed, not rewritten; no behavioral-gain or transfer claim.' },
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
    id: 'h1-37-r', stage: 'transfer', result: 'negative', coverage: ['H1.37-R'],
    title: { zh: 'H1.37-R：同期 BASE 重跑排除时期漂移', en: 'H1.37-R: contemporaneous BASE rerun rules out period drift' },
    summary: { zh: '重跑 48 个 BASE task × 4 seeds；BASE-original 与 BASE-R 完全相同，同周期 SELF-vs-BASE 仍为 null-like 且 underpowered。', en: 'Forty-eight BASE tasks × four seeds were rerun; BASE-original and BASE-R were identical, while contemporaneous SELF versus BASE remained null-like and underpowered.' },
    boundary: { zh: '排除了执行时期漂移这一简单解释；未建立可靠正向迁移，也未证明零效应。', en: 'Rules out execution-period drift as a simple explanation; it establishes neither reliable positive transfer nor a zero effect.' },
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
    summary: { zh: '四臂共 768 次尝试，764 次科学有效；D4、D8、D16 相对 base 的 task-cluster 95% CI 均跨 0，ordered delta 不单调。', en: 'Across four arms, 764 of 768 attempts were scientifically valid; the task-cluster 95% CI versus base crosses zero for D4, D8, and D16, and the ordered deltas are non-monotonic.' },
    boundary: { zh: '建立完整固定面板与非单调 ordered delta，未建立可靠正向迁移；不证明所有 task-identity diversity 选择或 OpenEvo 修改都无效。', en: 'Establishes a complete fixed panel and non-monotonic ordered deltas without reliable positive transfer; it does not prove every task-identity diversity choice or OpenEvo modification ineffective.' },
    evidence: openEvoProgramLinks.reconciliation,
  },
  {
    id: 'h1-38b', stage: 'closeout', result: 'design', coverage: ['H1.38B'],
    title: { zh: 'H1.38B：方法对照仅有 goal/design handoff', en: 'H1.38B: method control is only a goal/design handoff' },
    summary: { zh: '当前只有 goal/design handoff；尚未形成 accepted preregistration，未授权、未执行，也没有密封结果。', en: 'Only a goal/design handoff exists: there is no accepted preregistration, authorization, execution, or sealed result.' },
    boundary: { zh: 'not-established；它不是协议结果或已执行实验，不能写成已运行或已证明。', en: 'Not established; this is neither a protocol result nor an executed experiment and cannot be presented as run or proven.' },
    evidence: openEvoProgramLinks.campaign,
  },
  {
    id: 'next', stage: 'closeout', result: 'design', coverage: ['Next'],
    title: { zh: '下一步：方法修改是推断，不是结果', en: 'Next: method changes are inference, not results' },
    summary: { zh: '优先冻结 H1.38 D8 的同一份数据，比较 ordinary sequential LoRA 与现有 SD-LoRA，并拆开 acquisition（新学会）、retention（旧能力保留）与 untouched transfer（未见任务迁移）。', en: 'First freeze the same H1.38 D8 data, compare ordinary sequential LoRA with the current SD-LoRA, and separate acquisition (new learning), retention (preservation of old capabilities), and untouched transfer (transfer to unseen tasks).' },
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
    zh: ['完整冻结面板为 768 次尝试、764 次科学有效。', 'D4/D8/D16 相对 base 的 task-cluster 95% CI 均跨 0。', '固定 16 条成功记录时，4/8/16 个 training task identity 的 ordered delta 不单调。'],
    en: ['The complete frozen panel contains 768 attempts, 764 scientifically valid.', 'The task-cluster 95% CI versus base crosses zero for D4, D8, and D16.', 'With 16 successful records fixed, the ordered deltas for 4/8/16 training task identities are non-monotonic.'],
  },
  inferred: {
    zh: ['经验质量和信用分配可能比单独增加 task-identity 数量更关键。', '框架应在持久化前加入反事实验证与回滚门控。'],
    en: ['Experience quality and credit assignment may matter more than task-identity count alone.', 'The framework should add counterfactual validation and rollback gates before persistence.'],
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
