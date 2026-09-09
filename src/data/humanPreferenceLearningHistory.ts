import type { HumanFeedbackCaseId } from './humanFeedbackPrecedents';

export type HumanFeedbackEventId = `EVENT-${string}`;

export type HumanFeedbackVerdict =
  | 'rejected'
  | 'better'
  | 'promising'
  | 'accepted'
  | 'canonical';

export type VisualReferenceTier = 'rejected' | 'silver' | 'golden' | 'current-candidate';
export type FailureFamilySeverity = 'normal' | 'repeated' | 'hard';
export type HumanPreferenceScopeV2 =
  | 'all-public-ui'
  | 'research-ui'
  | 'research-copy'
  | 'briefing'
  | 'results'
  | 'visual'
  | 'workflow';

export interface HumanFeedbackEvent {
  id: HumanFeedbackEventId;
  date: string;
  caseIds: HumanFeedbackCaseId[];
  scopes: HumanPreferenceScopeV2[];
  artifact: string;
  variantId: string;
  comparedToVariantId?: string;
  verdict: HumanFeedbackVerdict;
  ownerSignal: string;
  reasons: string[];
  failureMechanisms: string[];
  repeatSignal?: 'explicit';
  confidence?: 'explicit' | 'repeated-explicit' | 'inferred' | 'page-specific';
  evidenceRefs?: string[];
  antiOvergeneralization?: string[];
  supersedesEventIds?: HumanFeedbackEventId[];
}

export interface PreferenceTrajectoryComparison {
  betterVariantId: string;
  worseVariantId: string;
  reason: string;
  failureMechanisms: string[];
  dimensions: string[];
}

export interface PreferenceTrajectory {
  id: `TRAJECTORY-${string}`;
  scopes: HumanPreferenceScopeV2[];
  variantIds: string[];
  comparisons: PreferenceTrajectoryComparison[];
  canonicalVariantId?: string;
  note: string;
}

export interface HumanVisualReference {
  id: `VISUAL-${string}`;
  tier: VisualReferenceTier;
  scopes: HumanPreferenceScopeV2[];
  artifact: string;
  gitSha?: string;
  pullRequest?: number;
  route?: string;
  ownerEvidence: string;
  note: string;
  viewport?: string;
  supersededById?: `VISUAL-${string}`;
}

export const HUMAN_FEEDBACK_EVENTS: HumanFeedbackEvent[] = [
  {
    id: 'EVENT-20260908-BRIEFING-DENSE-STATUS',
    date: '2026-09-08',
    caseIds: ['CASE-068', 'CASE-082'],
    scopes: ['briefing', 'research-ui', 'visual'],
    artifact: 'OpenEVO advisor briefing',
    variantId: 'briefing-dense-status-v1',
    verdict: 'rejected',
    ownerSignal: '看着心烦意乱，一点都看不进去；科研亮点也被项目状态淹没。',
    reasons: ['多个卡片和标签争夺注意力', '工程状态替代研究判断'],
    failureMechanisms: ['attention-competition', 'project-status-as-research-story'],
  },
  {
    id: 'EVENT-20260908-SOFT-SLIDE-DIRECTION',
    date: '2026-09-08',
    caseIds: ['CASE-068', 'CASE-082'],
    scopes: ['briefing', 'visual'],
    artifact: 'OpenEVO advisor briefing',
    variantId: 'briefing-soft-slide-family',
    comparedToVariantId: 'briefing-dense-status-v1',
    verdict: 'better',
    ownerSignal: '好多了，但不能说很好或者已经 OK。',
    reasons: ['留白、柔和色彩、圆形语言降低了第一眼压力', '仍未达到最终批准'],
    failureMechanisms: ['visual-attention-load', 'premature-canonicalization-risk'],
  },
  {
    id: 'EVENT-20260908-OVERMINIMAL-HTML',
    date: '2026-09-08',
    caseIds: ['CASE-068', 'CASE-082'],
    scopes: ['briefing', 'visual'],
    artifact: 'OpenEVO advisor briefing',
    variantId: 'briefing-overminimal-html',
    comparedToVariantId: 'briefing-soft-slide-family',
    verdict: 'rejected',
    ownerSignal: '还是不像之前的 slides；颜色、圆形和信息量都被削得太过。',
    reasons: ['把降低认知负担误学成越空越好', '丢失已得到正向反馈的视觉特征'],
    failureMechanisms: ['overlearned-minimalism', 'lost-positive-visual-signal'],
  },
  {
    id: 'EVENT-20260908-NAKED-METRICS',
    date: '2026-09-08',
    caseIds: ['CASE-059'],
    scopes: ['briefing', 'research-copy'],
    artifact: 'OpenEVO advisor briefing',
    variantId: 'briefing-naked-metrics',
    verdict: 'rejected',
    ownerSignal: '49.33 / 58⁄128 没有单位和解释，观众不知道数字是什么意思。',
    reasons: ['指标对象、单位和分母缺失'],
    failureMechanisms: ['objectless-number', 'author-context-required'],
  },
  {
    id: 'EVENT-20260908-ENGINEERING-AS-HIGHLIGHT',
    date: '2026-09-08',
    caseIds: ['CASE-082'],
    scopes: ['briefing', 'research-copy'],
    artifact: 'OpenEVO advisor briefing',
    variantId: 'briefing-engineering-gate-highlight',
    verdict: 'rejected',
    ownerSignal: '作为观众只看到解决了一个工程问题，看不出科研上有多强。',
    reasons: ['工程工作没有连接到科学含义或研究决策'],
    failureMechanisms: ['engineering-as-science-highlight', 'missing-scientific-meaning'],
  },
  {
    id: 'EVENT-20260908-MEANINGLESS-ENGLISH-EYEBROW',
    date: '2026-09-08',
    caseIds: ['CASE-027', 'CASE-063'],
    scopes: ['all-public-ui', 'briefing', 'research-copy'],
    artifact: 'OpenEVO advisor briefing',
    variantId: 'briefing-english-eyebrows',
    verdict: 'rejected',
    ownerSignal: '这个问题以前在普通网页就说过；无意义英文小标题增加人的认知负担。',
    reasons: ['删掉英文眉题不损失对象身份或技术定义', '中文观众被迫多做一次解码'],
    failureMechanisms: ['meaningless-english-eyebrow', 'attention-tax'],
    repeatSignal: 'explicit',
    confidence: 'repeated-explicit',
    evidenceRefs: ['conversation:meaningless-english-eyebrow-repeat'],
    antiOvergeneralization: ['不是禁止英文；真实技术名、检索身份和独立阅读模式仍可保留英文。'],
  },
  {
    id: 'EVENT-20260908-DECORATIVE-BUBBLES',
    date: '2026-09-08',
    caseIds: ['CASE-068', 'CASE-082'],
    scopes: ['briefing', 'visual'],
    artifact: 'OpenEVO advisor briefing',
    variantId: 'briefing-decorative-bubbles',
    verdict: 'rejected',
    ownerSignal: 'slide 上莫名的淡色气泡不要。',
    reasons: ['装饰不承担信息角色却占用注意力'],
    failureMechanisms: ['decorative-attention-noise'],
    confidence: 'explicit',
    evidenceRefs: ['conversation:decorative-bubbles'],
    antiOvergeneralization: ['不是禁止圆形；页码、步骤编号或承担结构信息的圆形元素仍可使用。'],
  },
  {
    id: 'EVENT-20260909-MAINLINE-RIGOR-TAX',
    date: '2026-09-09',
    caseIds: ['CASE-082'],
    scopes: ['briefing', 'research-copy', 'visual'],
    artifact: 'OpenEVO summer review',
    variantId: 'briefing-rigor-mainline',
    verdict: 'rejected',
    ownerSignal: '工程严谨性、SHA 和重复性是实验成立的默认前提，不应该单独占一页当科研亮点；感兴趣的人再去技术子页看。',
    reasons: ['主演讲时间应该用于会改变科学问题的判断', '工程证据应渐进披露而不是与科研亮点等权'],
    failureMechanisms: ['engineering-as-science-highlight', 'mainline-rigor-tax', 'missing-progressive-disclosure'],
    repeatSignal: 'explicit',
    confidence: 'repeated-explicit',
    evidenceRefs: ['conversation:engineering-rigor-drilldown'],
    antiOvergeneralization: ['工程证据若决定测量有效性、可识别性或因果归因，仍必须在 claim 附近保持可见。'],
  },
  {
    id: 'EVENT-20260909-CHRONOLOGY-SCIENCE-STORY',
    date: '2026-09-09',
    caseIds: ['CASE-082'],
    scopes: ['briefing', 'research-copy'],
    artifact: 'OpenEVO summer review',
    variantId: 'briefing-chronology-science-story',
    comparedToVariantId: 'briefing-rigor-mainline',
    verdict: 'promising',
    ownerSignal: '从 7B 起点讲到 1.7B / 3B，再讲 15→30、2048→4096、10+10 等小实验如何一步步排除解释，最后进入 GDR / DirectApply，这个故事会更清晰。',
    reasons: ['真实实验顺序自然展示问题如何收窄', '负向小实验比抽象质量页更能展示科研判断'],
    failureMechanisms: ['project-status-as-research-story', 'chronology-with-scientific-judgment'],
    confidence: 'explicit',
    evidenceRefs: ['conversation:scientific-chronology'],
    antiOvergeneralization: ['真实时间顺序只有在它同时展示科学问题如何被证据收窄时才有价值；不要把时间线本身当科研亮点。'],
  },
  {
    id: 'EVENT-20260909-PARAMETER-TITLE-AND-MOBILE-FIT',
    date: '2026-09-09',
    caseIds: ['CASE-082'],
    scopes: ['briefing', 'research-copy', 'visual'],
    artifact: 'OpenEVO summer review',
    variantId: 'briefing-chronology-responsive-refinement',
    comparedToVariantId: 'briefing-chronology-science-story',
    verdict: 'better',
    ownerSignal: '整体效果比上一版好多了；参数数字不要放在标题里营造冲击力，手机端要适应窗口，桌面端保持有上限的演讲画布。',
    reasons: ['自然语言结论应先于具体参数数字', '手机可读性优先于固定 16:9 构图', '桌面演讲画布不应随超宽屏无限扩张'],
    failureMechanisms: ['numeric-shock-heading', 'mobile-fixed-canvas-overflow', 'unbounded-desktop-scaling'],
    confidence: 'explicit',
    evidenceRefs: ['conversation:2048-4096-heading', 'conversation:phone-reflow-desktop-cap', 'PR#569'],
    supersedesEventIds: ['EVENT-20260908-FIXED-DECK-ALL-DEVICES'],
    antiOvergeneralization: ['不是禁止数字出现在标题；当数字本身就是科研发现（例如最终分数或 44→7）时可以前置。', '不是所有页面都固定桌面 16:9；只在明确演讲 deck 语境保留有上限的桌面构图。'],
  },
  {
    id: 'EVENT-20260908-BRIEFING-PRESENTATION-CONTRACT',
    date: '2026-09-08',
    caseIds: ['CASE-082'],
    scopes: ['briefing', 'visual'],
    artifact: 'OpenEVO summer review',
    variantId: 'briefing-owner-specified-deck-contract',
    verdict: 'promising',
    ownerSignal: "结果页采用接近 SEED 论文 / LaTeX 的 Score / Succ. 表格；展示 slides 使用标准 PowerPoint 长宽比；首页和尾页不显示页码，中间页右下角显示当前页 / 总页数；不要‘点击下一页’；开头要有目录 + Too long, Don't read，封面写标题、日期、汇报人；尾页必须把请老师/学长判断的两条选择讲清；‘固定 GPU 确定性已经 PASS’这种内部状态要翻成普通人能理解的科学含义。",
    reasons: ['用户明确把该页面定义成 HTML 承载的演讲稿，而不是普通长网页', '表格、页码、目录、无跳转按钮和尾页决策都是该 briefing 的具体演讲合同', '内部工程状态不能替代读者真正需要理解的科学含义'],
    failureMechanisms: [],
    confidence: 'page-specific',
    evidenceRefs: ['conversation:presentation-contract', 'PR#569'],
    antiOvergeneralization: ['只适用于明确作为 slides / PPT 演讲使用的 briefing；普通公开网页不继承固定画布或页码规则。'],
  },
  {
    id: 'EVENT-20260908-FIXED-DECK-ALL-DEVICES',
    date: '2026-09-08',
    caseIds: ['CASE-082'],
    scopes: ['briefing', 'visual'],
    artifact: 'OpenEVO summer review',
    variantId: 'briefing-fixed-16-9-all-devices',
    verdict: 'promising',
    ownerSignal: '这里因为是展示 slides，我会刻意做成标准 PowerPoint 的长宽比，反而不做屏幕适配。',
    reasons: ['当时用户优先保护演讲构图'],
    failureMechanisms: [],
    confidence: 'page-specific',
    evidenceRefs: ['conversation:fixed-deck-all-devices'],
    antiOvergeneralization: ['这是后来被更具体的手机 / 桌面分层反馈部分覆盖的历史要求，不能继续当现行跨设备规则。'],
  },
  {
    id: 'EVENT-20260909-TECHNICAL-DEPTH-WITHOUT-META',
    date: '2026-09-09',
    caseIds: ['CASE-082'],
    scopes: ['briefing', 'research-copy'],
    artifact: 'OpenEVO summer review',
    variantId: 'briefing-technical-depth-without-meta-performance',
    comparedToVariantId: 'briefing-mechanism-math-depth',
    verdict: 'better',
    ownerSignal: '“这里可以更硬核一点”我们自己知道就行，没有必要向老师展示；可以换成“我们采用一个更技术性的指标”。GDR 只放简单公式，更硬核的推导单独放 BaseModel 子网页。',
    reasons: ['技术深度应由公式和数据本身体现，不需要 meta 自我评价', '主演讲保留理解科学判断所需的简式，完整推导渐进披露'],
    failureMechanisms: ['meta-technical-performance', 'technical-depth-on-wrong-layer'],
    confidence: 'explicit',
    evidenceRefs: ['conversation:technical-depth-without-meta', 'PR#569'],
    antiOvergeneralization: ['不是删公式或把技术内容做浅；只有与当前科学判断直接相关的公式进入主演讲。', '不是所有技术内容都必须拆子页；只在深度明显超过当前阅读任务时下沉。'],
  },
  {
    id: 'EVENT-20260908-FEEDBACK-LEARNING-WORKFLOW',
    date: '2026-09-08',
    caseIds: ['CASE-083'],
    scopes: ['workflow'],
    artifact: 'BaseModel Human Preference Learning workflow',
    variantId: 'feedback-learning-retrieval-and-judge-loop',
    verdict: 'canonical',
    ownerSignal: '我给一次具体反馈，系统要把珍贵语料维护成案例并从中学习；以后我只说“去 AI 味 / 说人话 / 降低认知负担”，Agent 就应该举一反三，而不是让我重复纠正。先把这个工作流落地，再应用。',
    reasons: ['用户明确要求这是长期默认工作流，而非一次页面实现', '后续又明确要求先落地系统、再用系统处理当前 briefing'],
    failureMechanisms: ['passive-case-library', 'retrieval-not-executed', 'evaluation-not-updated'],
    repeatSignal: 'explicit',
    confidence: 'repeated-explicit',
    evidenceRefs: ['conversation:feedback-learning-workflow', 'CASE-083'],
    antiOvergeneralization: ['canonical 的是仓库级“反馈必须改变下一次生成和验收”的流程，不是某个具体视觉模板或某条页面文案。'],
  },
  {
    id: 'EVENT-20260909-BRIEFING-MERGED-ACCEPTED',
    date: '2026-09-09',
    caseIds: ['CASE-082'],
    scopes: ['briefing', 'visual', 'research-copy'],
    artifact: 'OpenEVO summer review',
    variantId: 'briefing-responsive-merged-89fe1190',
    comparedToVariantId: 'briefing-chronology-responsive-refinement',
    verdict: 'accepted',
    ownerSignal: '可以合并这版，但还不是 100% 完成。',
    reasons: ['owner 明确批准当前具体版本进入 main', '“还不是 100%”明确阻止把该视觉风格升级成 canonical'],
    failureMechanisms: [],
    confidence: 'explicit',
    evidenceRefs: ['PR#569', 'sha:89fe1190d0f92909f6da40b9a47ea75c9f45d2d5'],
    antiOvergeneralization: ['accepted 只表示该具体 merged briefing 可以交付；没有“以后按这个标准”的指令，因此不能升级为 canonical / Golden。'],
  },
  {
    id: 'EVENT-20260908-MECHANISM-DEPTH',
    date: '2026-09-08',
    caseIds: ['CASE-082'],
    scopes: ['briefing', 'research-copy'],
    artifact: 'OpenEVO advisor briefing',
    variantId: 'briefing-mechanism-math-depth',
    verdict: 'promising',
    ownerSignal: 'TaskVector、范数和参数机制这里可以稍微硬核，加入 LaTeX 公式和详细数据。',
    reasons: ['降低认知负担不等于删除能证明研究设计的数学细节'],
    failureMechanisms: ['scientific-depth-preserved'],
    confidence: 'explicit',
    evidenceRefs: ['conversation:taskvector-math-depth'],
    antiOvergeneralization: ['不是每一页都加公式；只有公式直接支撑研究问题时才提高技术密度。'],
  },
];

export const HUMAN_PREFERENCE_TRAJECTORIES: PreferenceTrajectory[] = [
  {
    id: 'TRAJECTORY-BRIEFING-VISUAL-20260908',
    scopes: ['briefing', 'visual', 'research-copy'],
    variantIds: [
      'briefing-dense-status-v1',
      'briefing-soft-slide-family',
      'briefing-overminimal-html',
      'briefing-engineering-gate-highlight',
      'briefing-decorative-bubbles',
      'briefing-mechanism-math-depth',
      'briefing-rigor-mainline',
      'briefing-chronology-science-story',
      'briefing-fixed-16-9-all-devices',
      'briefing-chronology-responsive-refinement',
      'briefing-technical-depth-without-meta-performance',
      'briefing-responsive-merged-89fe1190',
    ],
    comparisons: [
      {
        betterVariantId: 'briefing-soft-slide-family',
        worseVariantId: 'briefing-dense-status-v1',
        reason: '柔和、留白和更明确的视觉中心明显降低第一眼压力。',
        failureMechanisms: ['attention-competition'],
        dimensions: ['cognitive-load', 'competing-attention-centers', 'visual-consistency'],
      },
      {
        betterVariantId: 'briefing-soft-slide-family',
        worseVariantId: 'briefing-overminimal-html',
        reason: '用户要的是低竞争注意力，不是无设计、无色彩、无信息。',
        failureMechanisms: ['overlearned-minimalism'],
        dimensions: ['information-density', 'visual-consistency', 'cognitive-load'],
      },
      {
        betterVariantId: 'briefing-mechanism-math-depth',
        worseVariantId: 'briefing-engineering-gate-highlight',
        reason: '机制公式和定量对照直接展示科研设计；普通工程修复本身不构成科研亮点。',
        failureMechanisms: ['missing-scientific-meaning'],
        dimensions: ['scientific-narrative-clarity', 'technical-depth', 'trust'],
      },
      {
        betterVariantId: 'briefing-chronology-responsive-refinement',
        worseVariantId: 'briefing-chronology-science-story',
        reason: '用户明确说整体更好，但要求数字退出冲击式标题，同时手机端响应窗口、桌面端保持有上限的演讲画布。',
        failureMechanisms: ['numeric-shock-heading', 'mobile-fixed-canvas-overflow', 'unbounded-desktop-scaling'],
        dimensions: ['heading-hierarchy', 'numeric-salience', 'mobile-readability', 'desktop-composition'],
      },
      {
        betterVariantId: 'briefing-chronology-science-story',
        worseVariantId: 'briefing-rigor-mainline',
        reason: '按科学问题演进讲负向实验与设计转折，比单独展示工程严谨性更能说明研究能力。',
        failureMechanisms: ['mainline-rigor-tax', 'chronology-with-scientific-judgment'],
        dimensions: ['scientific-narrative-clarity', 'progressive-disclosure', 'terminology-friction'],
      },
      {
        betterVariantId: 'briefing-technical-depth-without-meta-performance',
        worseVariantId: 'briefing-engineering-gate-highlight',
        reason: '技术指标和简式公式可以直接服务科学问题；“这里更硬核”这类作者自评与工程门禁页都不应成为亮点。',
        failureMechanisms: ['meta-technical-performance', 'technical-depth-on-wrong-layer'],
        dimensions: ['technical-depth', 'natural-human-wording', 'progressive-disclosure'],
      },
      {
        betterVariantId: 'briefing-responsive-merged-89fe1190',
        worseVariantId: 'briefing-chronology-responsive-refinement',
        reason: 'owner 明确批准最终具体版本合并，但同时说还不是 100%；因此具体结果 accepted，视觉标准仍非 canonical。',
        failureMechanisms: [],
        dimensions: ['mobile-readability', 'desktop-composition', 'heading-hierarchy', 'scientific-narrative-clarity'],
      },
    ],
    note: '最终 89fe1190 具体版本已获准合并，因此是 accepted；但 owner 同时说明“还不是 100%”，没有任何“以后按这个标准”的授权，所以仍没有 canonicalVariantId。',
  },
];

export const HUMAN_VISUAL_REFERENCE_SET: HumanVisualReference[] = [
  {
    id: 'VISUAL-BRIEFING-DENSE-REJECTED',
    tier: 'rejected',
    scopes: ['briefing', 'visual'],
    artifact: 'dense advisor briefing',
    gitSha: '49ab2665ee7131dec7484063fd132198655da792',
    route: '/research/seed-openevo/study/briefing/',
    ownerEvidence: '用户明确报告注意力涣散、心烦意乱。',
    note: '可 checkout 该 SHA 重建截图；不要把卡片墙和等权重信息块作为默认美学。',
  },
  {
    id: 'VISUAL-BRIEFING-SOFT-SILVER',
    tier: 'silver',
    scopes: ['briefing', 'visual'],
    artifact: 'soft-color / rounded briefing family',
    gitSha: '8bfb5bcdf42416d35eb4f64c5fd176022d6ae517',
    route: '/research/seed-openevo/study/briefing/',
    ownerEvidence: '对应“更柔和、多色、圆形”的正向方向；用户只说过明显更好，没有批准为最终模板。',
    note: 'Silver 只表示方向性正反馈；不得写成“用户喜欢/已批准该模板”。',
  },
  {
    id: 'VISUAL-BRIEFING-OVERMINIMAL-REJECTED',
    tier: 'rejected',
    scopes: ['briefing', 'visual'],
    artifact: 'over-minimal HTML hybrid',
    gitSha: 'bb9315bd71ee61e8c29afb5010753cc07202b485',
    route: '/research/seed-openevo/study/briefing/',
    ownerEvidence: '用户指出它比此前 slides 过度克制，颜色、圆形和信息量被削掉。',
    note: '认知负担低 != 极简主义。',
  },
  {
    id: 'VISUAL-BRIEFING-CURRENT-CANDIDATE',
    tier: 'silver',
    scopes: ['briefing', 'visual'],
    artifact: 'fixed 16:9 advisor briefing candidate',
    pullRequest: 569,
    gitSha: 'caa35d010d16ce13fca12d23fec0bd7585397107',
    route: '/research/seed-openevo/study/briefing/',
    ownerEvidence: '该历史候选曾处于 owner review 中；后续由 merged 89fe1190 版本取代。',
    note: '历史 ID 保留证据链；它不再是 current candidate，也从未成为 Golden。',
    viewport: 'desktop 1280×720',
    supersededById: 'VISUAL-BRIEFING-MERGED-ACCEPTED-SILVER',
  },
  {
    id: 'VISUAL-BRIEFING-MERGED-ACCEPTED-SILVER',
    tier: 'silver',
    scopes: ['briefing', 'visual'],
    artifact: 'merged responsive OpenEVO summer review',
    pullRequest: 569,
    gitSha: '89fe1190d0f92909f6da40b9a47ea75c9f45d2d5',
    route: '/research/seed-openevo/study/briefing/',
    ownerEvidence: 'owner 明确批准该具体版本合并，同时说明“还不是 100%”。',
    note: 'Silver because the concrete delivery was accepted without reusable-template approval. Desktop keeps a capped 16:9 composition; phone reflows to the viewport. No Golden reference exists.',
    viewport: 'desktop capped 1280×720; phone reflow',
  },
];

export function failureFamilySeverity(failureMechanism: string): FailureFamilySeverity {
  const events = HUMAN_FEEDBACK_EVENTS.filter((event) => event.failureMechanisms.includes(failureMechanism));
  if (events.some((event) => event.repeatSignal === 'explicit') || events.length >= 3) return 'hard';
  if (events.length >= 2) return 'repeated';
  return 'normal';
}

export function hardFailureFamilies(): string[] {
  const families = new Set(HUMAN_FEEDBACK_EVENTS.flatMap((event) => event.failureMechanisms));
  return [...families].filter((family) => failureFamilySeverity(family) === 'hard').sort();
}

export function visualReferencesForScope(scope: HumanPreferenceScopeV2): HumanVisualReference[] {
  return HUMAN_VISUAL_REFERENCE_SET.filter((reference) => reference.scopes.includes(scope));
}
