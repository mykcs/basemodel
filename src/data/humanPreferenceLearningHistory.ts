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
  | 'briefing-mobile'
  | 'briefing-desktop';

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
  supersedesEventIds?: HumanFeedbackEventId[];
  requestedSuccessorVariantId?: string;
  evidence?: { route?: string; pullRequest?: number; gitSha?: string; ledgerId?: string };
}

export interface PreferenceTrajectoryComparison {
  betterVariantId: string;
  worseVariantId: string;
  reason: string;
  failureMechanisms: string[];
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
    failureMechanisms: ['meaningless-english-eyebrow', 'attention-tax', 'internal-detail-promoted-to-primary-attention'],
    repeatSignal: 'explicit',
  },
  {
    id: 'EVENT-20260908-DEFENSIVE-NEGATION-OPENING',
    date: '2026-09-08',
    caseIds: ['CASE-081'],
    scopes: ['briefing', 'research-copy'],
    artifact: 'OpenEVO advisor briefing',
    variantId: 'briefing-defensive-negation-opening',
    verdict: 'rejected',
    ownerSignal: '不要一上来就用“不是 / 不能 / 不要”反驳读者；先说发生了什么、我们做了什么。',
    reasons: ['防御性否定把作者姿态放在事实之前', '科学边界应贴着真正受约束的 claim'],
    failureMechanisms: ['defensive-negation-opening', 'anticipatory-rebuttal'],
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
    failureMechanisms: ['engineering-as-science-highlight', 'mainline-rigor-tax', 'missing-progressive-disclosure', 'internal-detail-promoted-to-primary-attention'],
    repeatSignal: 'explicit',
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
  },
  {
    id: 'EVENT-20260908-FIXED-DECK-ALL-DEVICES',
    date: '2026-09-08',
    caseIds: ['CASE-082'],
    scopes: ['briefing', 'visual', 'briefing-mobile', 'briefing-desktop'],
    artifact: 'OpenEVO summer review',
    variantId: 'briefing-fixed-16-9-all-devices',
    verdict: 'accepted',
    ownerSignal: '这里因为是展示 slides，我会刻意做成标准 PowerPoint 的长宽比，反而不做屏幕适配。',
    reasons: ['当时明确要求固定演讲构图，不随设备重排'],
    failureMechanisms: ['presentation-composition-vs-responsive-reading'],
    evidence: { route: '/research/seed-openevo/study/briefing/', pullRequest: 569, ledgerId: 'FB-18-FIXED-16-9-ALL-DEVICES' },
  },
  {
    id: 'EVENT-20260909-PARAMETER-TITLE-AND-MOBILE-FIT',
    date: '2026-09-09',
    caseIds: ['CASE-082'],
    scopes: ['briefing', 'research-copy', 'visual', 'briefing-mobile', 'briefing-desktop'],
    artifact: 'OpenEVO summer review',
    variantId: 'briefing-chronology-science-story',
    verdict: 'better',
    ownerSignal: '目前整体效果比上一版好多了；2048~4096 不要放标题，直接说“我们把记忆容量翻倍了”，具体参数放正文加粗；手机端适应窗口，电脑端不要随超宽屏无限放大。',
    reasons: ['自然语言主题应先于实现参数数字', '手机可读性优先于固定 16:9 画布', '桌面演讲画布应保持有上限'],
    failureMechanisms: ['numeric-shock-heading', 'mobile-fixed-canvas-overflow', 'unbounded-desktop-scaling', 'internal-detail-promoted-to-primary-attention'],
    supersedesEventIds: ['EVENT-20260908-FIXED-DECK-ALL-DEVICES'],
    requestedSuccessorVariantId: 'briefing-responsive-final-89fe1190',
    evidence: { route: '/research/seed-openevo/study/briefing/', pullRequest: 569, gitSha: '1ca186d42279424f8c848d54cbdc62e5a6342444', ledgerId: 'FB-19-PARAMETER-TITLE-PHONE-DESKTOP-SPLIT' },
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
  },
  {
    id: 'EVENT-20260909-TECHNICAL-DEPTH-WITHOUT-META',
    date: '2026-09-09',
    caseIds: ['CASE-082'],
    scopes: ['briefing', 'research-copy'],
    artifact: 'OpenEVO summer review',
    variantId: 'briefing-mechanism-technical-metric',
    comparedToVariantId: 'briefing-mechanism-math-depth',
    verdict: 'better',
    ownerSignal: '“这里可以更硬核一点”我们自己知道就行，没有必要向老师展示；可以换成“我们采用一个更技术性的指标”。GDR 只放简单公式，更硬核的推导单独放 BaseModel 子网页。',
    reasons: ['技术深度应由公式和数据本身体现，不需要 meta 自我评价', '主演讲保留理解科学判断所需的简式，完整推导渐进披露'],
    failureMechanisms: ['meta-technical-performance', 'technical-detail-wrong-layer'],
    evidence: { route: '/research/seed-openevo/study/briefing/', pullRequest: 569, ledgerId: 'FB-12-MECHANISM-DEPTH-WITHOUT-META-HARDCORE' },
  },
  {
    id: 'EVENT-20260909-BRIEFING-FINAL-ACCEPTED',
    date: '2026-09-09',
    caseIds: ['CASE-082'],
    scopes: ['briefing', 'research-copy', 'visual', 'briefing-mobile', 'briefing-desktop'],
    artifact: 'OpenEVO summer review',
    variantId: 'briefing-responsive-final-89fe1190',
    comparedToVariantId: 'briefing-chronology-science-story',
    verdict: 'accepted',
    ownerSignal: '虽然做的不是100完成，先合并进main',
    reasons: ['明确接受当前具体 PR 版本进入 main', '“不是100完成”明确说明这是具体交付接受，不是未来通用模板批准'],
    failureMechanisms: [],
    evidence: { route: '/research/seed-openevo/study/briefing/', pullRequest: 569, gitSha: '89fe1190d0f92909f6da40b9a47ea75c9f45d2d5', ledgerId: 'FB-24-FINAL-MERGE-AUTHORIZATION' },
  },
];

export const HUMAN_PREFERENCE_TRAJECTORIES: PreferenceTrajectory[] = [
  {
    id: 'TRAJECTORY-BRIEFING-VISUAL-20260908',
    scopes: ['briefing', 'visual'],
    variantIds: [
      'briefing-dense-status-v1',
      'briefing-soft-slide-family',
      'briefing-overminimal-html',
      'briefing-engineering-gate-highlight',
      'briefing-decorative-bubbles',
      'briefing-mechanism-math-depth',
      'briefing-mechanism-technical-metric',
      'briefing-rigor-mainline',
      'briefing-chronology-science-story',
      'briefing-responsive-final-89fe1190',
    ],
    comparisons: [
      {
        betterVariantId: 'briefing-soft-slide-family',
        worseVariantId: 'briefing-dense-status-v1',
        reason: '柔和、留白和更明确的视觉中心明显降低第一眼压力。',
        failureMechanisms: ['attention-competition'],
      },
      {
        betterVariantId: 'briefing-soft-slide-family',
        worseVariantId: 'briefing-overminimal-html',
        reason: '用户要的是低竞争注意力，不是无设计、无色彩、无信息。',
        failureMechanisms: ['overlearned-minimalism'],
      },
      {
        betterVariantId: 'briefing-mechanism-technical-metric',
        worseVariantId: 'briefing-engineering-gate-highlight',
        reason: '机制公式和定量对照直接展示科研设计；普通工程修复本身不构成科研亮点，技术深度也不需要“更硬核”元话术。',
        failureMechanisms: ['missing-scientific-meaning', 'meta-technical-performance'],
      },
      {
        betterVariantId: 'briefing-chronology-science-story',
        worseVariantId: 'briefing-rigor-mainline',
        reason: '按科学问题演进讲负向实验与设计转折，比单独展示工程严谨性更能说明研究能力。',
        failureMechanisms: ['mainline-rigor-tax', 'chronology-with-scientific-judgment'],
      },
      {
        betterVariantId: 'briefing-responsive-final-89fe1190',
        worseVariantId: 'briefing-chronology-science-story',
        reason: 'owner 对 chronology 版给出“好多了”但明确提出参数标题与手机/桌面修正；这些修正进入 89fe1190，随后该 exact-head 获得条件式合并授权并合入 main。',
        failureMechanisms: ['numeric-shock-heading', 'mobile-fixed-canvas-overflow', 'unbounded-desktop-scaling'],
      },
    ],
    note: '最终 PR #569 的具体结果 accepted；但 owner 没有说“以后按这版 / 作为模板”，所以没有 canonicalVariantId，也没有 Golden 视觉模板。',
  },
  {
    id: 'TRAJECTORY-BRIEFING-DEVICE-SCOPE-20260909',
    scopes: ['briefing', 'visual', 'briefing-mobile', 'briefing-desktop'],
    variantIds: ['briefing-fixed-16-9-all-devices', 'briefing-responsive-final-89fe1190'],
    comparisons: [
      {
        betterVariantId: 'briefing-responsive-final-89fe1190',
        worseVariantId: 'briefing-fixed-16-9-all-devices',
        reason: '较新的 owner 指令只在手机 scope 覆盖旧的全设备固定画布规则：手机重排；桌面仍保持 capped 16:9。',
        failureMechanisms: ['mobile-fixed-canvas-overflow', 'unbounded-desktop-scaling'],
      },
    ],
    note: 'scope-specific supersession：历史规则保留，current authority 是 phone reflow + desktop capped composition。',
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
    note: '不要把卡片墙和等权重信息块作为默认美学；可用 SHA 重建。',
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
    id: 'VISUAL-BRIEFING-CHRONOLOGY-SILVER',
    tier: 'silver',
    scopes: ['briefing', 'visual'],
    artifact: 'scientific-chronology briefing before responsive refinement',
    gitSha: '1ca186d42279424f8c848d54cbdc62e5a6342444',
    pullRequest: 569,
    route: '/research/seed-openevo/study/briefing/',
    ownerEvidence: '用户说“目前整体效果比上一版好多了”，同时继续提出参数标题与手机/桌面修正。',
    note: '明确 better，因此是 Silver；后续仍有纠正，所以不是 accepted / Golden。',
  },
  {
    id: 'VISUAL-BRIEFING-FINAL-ACCEPTED-SILVER',
    tier: 'silver',
    scopes: ['briefing', 'visual', 'briefing-mobile', 'briefing-desktop'],
    artifact: 'responsive OpenEVO summer review final result',
    pullRequest: 569,
    gitSha: '89fe1190d0f92909f6da40b9a47ea75c9f45d2d5',
    route: '/research/seed-openevo/study/briefing/',
    ownerEvidence: 'owner 明确说“虽然做的不是100完成，先合并进main”；随后 PR #569 从 exact head 89fe1190… 合入 main。',
    note: '具体结果 accepted，但没有未来模板授权，所以仍是 Silver 而不是 Golden。桌面 capped 16:9，手机按窗口重排。',
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
