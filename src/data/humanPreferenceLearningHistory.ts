import type { HumanFeedbackCaseId } from './humanFeedbackPrecedents';

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
  | 'visual';

export interface HumanFeedbackEvent {
  id: `EVENT-${string}`;
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
    failureMechanisms: ['meaningless-english-eyebrow', 'attention-tax'],
    repeatSignal: 'explicit',
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
    failureMechanisms: ['engineering-as-science-highlight', 'mainline-rigor-tax', 'missing-progressive-disclosure'],
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
      'briefing-rigor-mainline',
      'briefing-chronology-science-story',
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
        betterVariantId: 'briefing-mechanism-math-depth',
        worseVariantId: 'briefing-engineering-gate-highlight',
        reason: '机制公式和定量对照直接展示科研设计；普通工程修复本身不构成科研亮点。',
        failureMechanisms: ['missing-scientific-meaning'],
      },
      {
        betterVariantId: 'briefing-chronology-science-story',
        worseVariantId: 'briefing-rigor-mainline',
        reason: '按科学问题演进讲负向实验与设计转折，比单独展示工程严谨性更能说明研究能力。',
        failureMechanisms: ['mainline-rigor-tax', 'chronology-with-scientific-judgment'],
      },
    ],
    note: '没有 canonicalVariantId：owner 只给过“好多了 / 更接近”的中间反馈，不能升级成最终模板。',
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
    tier: 'current-candidate',
    scopes: ['briefing', 'visual'],
    artifact: 'fixed 16:9 advisor briefing candidate',
    pullRequest: 569,
    gitSha: 'caa35d010d16ce13fca12d23fec0bd7585397107',
    route: '/research/seed-openevo/study/briefing/',
    ownerEvidence: '当前候选，尚未获得 owner 最终通过。',
    note: '必须继续以 current-candidate 对待；只有明确“OK/可以/按这个标准”后才能创建 golden reference。',
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
