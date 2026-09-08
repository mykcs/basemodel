import type { HumanFeedbackCaseId } from './humanFeedbackPrecedents';

export type HumanPreferenceScope =
  | 'all-public-ui'
  | 'research-ui'
  | 'research-copy'
  | 'study'
  | 'results'
  | 'run'
  | 'briefing'
  | 'capability'
  | 'workflow';

export type HumanPreferenceConfidence =
  | 'explicit-project'
  | 'repeated-explicit'
  | 'cluster-inference'
  | 'page-specific';

export type HumanPreferenceId = `PREF-${string}`;
export type HumanFeedbackPairId = `PAIR-${string}`;

export interface HumanPreferenceDimension {
  id: HumanPreferenceId;
  title: string;
  statement: string;
  scopes: HumanPreferenceScope[];
  confidence: HumanPreferenceConfidence;
  priority: 1 | 2 | 3 | 4 | 5;
  retrievalTags: string[];
  supportingCaseIds: HumanFeedbackCaseId[];
  antiOvergeneralization: string[];
  activation?: 'explicit-cues';
}

export interface HumanFeedbackGoldPair {
  id: HumanFeedbackPairId;
  caseId: HumanFeedbackCaseId;
  preferenceIds: HumanPreferenceId[];
  scopes: HumanPreferenceScope[];
  rejected: string;
  accepted: string;
  reason: string;
  failureMechanisms: string[];
  ownerStatus: 'accepted';
}

export const HUMAN_PREFERENCE_MODEL: HumanPreferenceDimension[] = [
  {
    id: 'PREF-OBJECT-FIRST',
    title: '先建立现实对象，再说关系、代号和方法',
    statement: '零上下文首层先让读者知道对象是什么、比较双方是谁；关系符号、内部路线名和统计方法不能替代对象身份。',
    scopes: ['all-public-ui', 'research-ui', 'research-copy', 'study', 'results', 'capability'],
    confidence: 'repeated-explicit',
    priority: 5,
    retrievalTags: ['对象', '身份', 'Harness', 'Track A', '配对评测', '比较双方', '零上下文'],
    supportingCaseIds: ['CASE-061', 'CASE-065', 'CASE-066'],
    antiOvergeneralization: [
      '不是禁止关系词；先建立关系两端后，准确关系仍应保留。',
      '内部代号在 provenance、复现和审计层仍可精确保留。',
    ],
  },
  {
    id: 'PREF-DIRECT-FACTS',
    title: '事实和主题优先于主持人、叙事隐喻和防御性开场',
    statement: '能直接说做了什么、发生了什么、结果是什么时，不用“怎样读 / 先看 / 分岔 / 这不是”等作者姿态抢第一理解层。',
    scopes: ['all-public-ui', 'research-ui', 'research-copy', 'study', 'results', 'run', 'briefing', 'capability'],
    confidence: 'repeated-explicit',
    priority: 5,
    retrievalTags: ['AI味', '说人话', '主持人', '标题', '分岔', '隐喻', '开场', '不是', '不能'],
    supportingCaseIds: ['CASE-063', 'CASE-067', 'CASE-081'],
    antiOvergeneralization: [
      '真实研究问题可以是问句。',
      '真正改变科学解释的否定句和 caveat 必须保留，并贴近所约束的 claim。',
      '能建立正确心智模型的必要类比不是禁用项。',
    ],
  },
  {
    id: 'PREF-FIRST-SCREEN-ATTENTION',
    title: '一个首屏只承担一个主要理解任务',
    statement: '字号、加粗、卡片、CTA、导航和 provenance 都在消耗注意力；第一屏应只有一个明显认知中心。',
    scopes: ['all-public-ui', 'research-ui', 'study', 'results', 'run', 'briefing', 'capability'],
    confidence: 'explicit-project',
    priority: 5,
    retrievalTags: ['ADHD', '注意力', '认知负担', '首屏', '视觉中心', 'CTA', '信息密度'],
    supportingCaseIds: ['CASE-068', 'CASE-069'],
    antiOvergeneralization: [
      '不是越少越好；必须默认可见的科学边界、比较双方和当前状态不能为了简洁被藏掉。',
      '首屏预算是报警器，不替代真人 cold read。',
    ],
  },
  {
    id: 'PREF-PROGRESSIVE-DISCLOSURE',
    title: '按阅读时机分层，不把分层本身做成模板',
    statement: '首层只给开始理解所需的信息；可恢复的背景、provenance 和深层机制后置，但不要机械制造“一句话看懂 / 专业解释”等可见层级。',
    scopes: ['all-public-ui', 'research-ui', 'research-copy', 'study', 'results', 'capability'],
    confidence: 'repeated-explicit',
    priority: 4,
    retrievalTags: ['渐进披露', 'progressive disclosure', '背景', 'TLDR', '专业解释', '详情', '折叠'],
    supportingCaseIds: ['CASE-062', 'CASE-068', 'CASE-071'],
    antiOvergeneralization: [
      '不是 minimalism；exactly enough 比“越空越好”更重要。',
      '会改变结论含义的 caveat 不能被当成次要背景折叠。',
    ],
  },
  {
    id: 'PREF-INLINE-TERMINOLOGY',
    title: '术语在第一次出现的位置就地解释',
    statement: '能不用内部代号就不用；必须保留时先给人类名称，再在当前句附近解释它在这里做什么。',
    scopes: ['all-public-ui', 'research-copy', 'study', 'results', 'run', 'briefing', 'capability'],
    confidence: 'repeated-explicit',
    priority: 4,
    retrievalTags: ['术语', 'glossary', '代号', 'Track A', 'paired', '统计', '跳转'],
    supportingCaseIds: ['CASE-066', 'CASE-070'],
    antiOvergeneralization: [
      '不是删除专业词；精确术语在需要时必须保留。',
      '集中 glossary 可以做参考工具，但不能成为主阅读路径。',
    ],
  },
  {
    id: 'PREF-SCIENTIFIC-BOUNDARY',
    title: '简化表达不能削弱科学边界',
    statement: '结果先行，但 claim → evidence → inference → boundary 必须完整；不能为了好读把不可比、未授权、未证明或未知状态藏掉。',
    scopes: ['research-ui', 'research-copy', 'study', 'results', 'run', 'briefing', 'capability'],
    confidence: 'repeated-explicit',
    priority: 5,
    retrievalTags: ['caveat', '边界', '证据', '不能证明', '不可比', '授权', '未知', '结果'],
    supportingCaseIds: ['CASE-029', 'CASE-030', 'CASE-062', 'CASE-068', 'CASE-081'],
    antiOvergeneralization: [
      '不是用否定句淹没开场；边界应贴着它真正约束的 claim。',
      '训练过程信号、最终评测和外部文献参照必须保持不同证据层。',
    ],
  },
  {
    id: 'PREF-RESEARCH-JUDGMENT',
    title: '科研汇报展示研究判断，不展示项目管理流水账',
    statement: '科研叙事按问题 → 假设 → 实验 → 结果 → 下一步判断组织；工程 gate 只在决定可解释性、可识别性或因果归因时进入主线。',
    scopes: ['research-copy', 'briefing'],
    confidence: 'page-specific',
    priority: 4,
    retrievalTags: ['科研汇报', 'briefing', '研究问题', '状态流水账', 'Ceiling', 'Mechanism', 'Control'],
    supportingCaseIds: ['CASE-082'],
    antiOvergeneralization: [
      '不是删除工程证据；当工程事实决定实验是否有效时，它就是科学叙事的一部分。',
      '“像汇报”描述信息节奏，不要求把 HTML 变成 PPT。',
    ],
  },
  {
    id: 'PREF-FEEDBACK-LEARNING-LOOP',
    title: '一次真人纠正必须改变下一次任务的生成与验收',
    statement: '案例不是墓碑；新反馈要沉淀成偏好对、更新模型、进入 task-time retrieval，并在生成后通过 cold read / preference judge 反向检查。',
    scopes: ['workflow', 'all-public-ui', 'research-ui', 'research-copy'],
    confidence: 'explicit-project',
    priority: 5,
    retrievalTags: ['真人反馈', '案例库', '举一反三', '偏好学习', 'Gold Pair', 'Preference Model', 'cold read', 'judge'],
    supportingCaseIds: ['CASE-064', 'CASE-083'],
    activation: 'explicit-cues',
    antiOvergeneralization: [
      '不是每条反馈都升级成全局规则；单页实现细节必须保留 scope。',
      '不是声称模型权重被训练；这是仓库级 retrieval + evaluation 学习循环。',
    ],
  },
];

export const HUMAN_FEEDBACK_GOLD_PAIRS: HumanFeedbackGoldPair[] = [
  {
    id: 'PAIR-061-IDENTITY',
    caseId: 'CASE-061',
    preferenceIds: ['PREF-OBJECT-FIRST'],
    scopes: ['study', 'research-copy'],
    rejected: 'OpenEvo × SEED：WebShop 研究',
    accepted: 'OpenEVO (Harness) · WebShop 数据集实验',
    reason: '先给关系会迫使零上下文读者猜对象类型；认可版本先建立 Harness 与数据集身份。',
    failureMechanisms: ['relation-before-identity', 'abstract-before-concrete'],
    ownerStatus: 'accepted',
  },
  {
    id: 'PAIR-063-HEADING',
    caseId: 'CASE-063',
    preferenceIds: ['PREF-DIRECT-FACTS'],
    scopes: ['all-public-ui', 'research-copy'],
    rejected: '三个研究问题怎样连起来',
    accepted: '三个研究问题',
    reason: '标题应命名主题，而不是把作者的阅读主持动作做成视觉中心。',
    failureMechanisms: ['presenter-language', 'meta-narration'],
    ownerStatus: 'accepted',
  },
  {
    id: 'PAIR-065-INTERNAL-CODE',
    caseId: 'CASE-065',
    preferenceIds: ['PREF-OBJECT-FIRST', 'PREF-INLINE-TERMINOLOGY'],
    scopes: ['research-copy'],
    rejected: 'OpenEvo · Track A 7B',
    accepted: '7B · 基础模型',
    reason: '内部路线代号不能替代读者真正需要识别的实验对象。',
    failureMechanisms: ['internal-code-as-identity', 'provenance-before-object'],
    ownerStatus: 'accepted',
  },
  {
    id: 'PAIR-066-METHOD-JARGON',
    caseId: 'CASE-066',
    preferenceIds: ['PREF-OBJECT-FIRST', 'PREF-INLINE-TERMINOLOGY'],
    scopes: ['results', 'research-copy'],
    rejected: 'OpenEVO · 7B 配对评测',
    accepted: '7B · 基础模型 — 7.17 / 100',
    reason: '先显示比较对象和测量，再解释 paired analysis，比用统计方法名做身份更低认知负担。',
    failureMechanisms: ['method-before-object', 'jargon-as-label'],
    ownerStatus: 'accepted',
  },
  {
    id: 'PAIR-067-METAPHOR',
    caseId: 'CASE-067',
    preferenceIds: ['PREF-DIRECT-FACTS'],
    scopes: ['research-copy', 'capability'],
    rejected: '第一轮购物学习：7B 与 3B 的分岔',
    accepted: '3B 和 7B 的第一轮购物实验',
    reason: '“分岔”没有增加科学信息，却制造额外故事 mental model；直接写实验事实更清楚。',
    failureMechanisms: ['decorative-metaphor', 'unnecessary-narrative-model'],
    ownerStatus: 'accepted',
  },
  {
    id: 'PAIR-068-ATTENTION',
    caseId: 'CASE-068',
    preferenceIds: ['PREF-FIRST-SCREEN-ATTENTION', 'PREF-PROGRESSIVE-DISCLOSURE'],
    scopes: ['all-public-ui', 'research-ui', 'capability'],
    rejected: '研究问题 / 为什么重要 / 从哪里开始 / 什么时候结束 / 现在到哪了',
    accepted: '7B 持续更新参数，并完成最终测试；旧 3B 因购物接口和动作格式问题停止。',
    reason: '五个等权重 orientation 字段让读者自己做取舍；认可版本让一个最重要事实成为第一认知中心。',
    failureMechanisms: ['equal-priority-stack', 'first-screen-attention-competition'],
    ownerStatus: 'accepted',
  },
  {
    id: 'PAIR-069-VISUAL-CENTER',
    caseId: 'CASE-069',
    preferenceIds: ['PREF-DIRECT-FACTS', 'PREF-FIRST-SCREEN-ATTENTION'],
    scopes: ['all-public-ui', 'results', 'research-ui'],
    rejected: '先分清两种“新任务”',
    accepted: '训练范围内未见任务与 SEED 验证任务',
    reason: '视觉中心应落在现实对象，而不是作者对读者发出的教学指令。',
    failureMechanisms: ['instruction-as-heading', 'attention-misdirection'],
    ownerStatus: 'accepted',
  },
  {
    id: 'PAIR-070-GLOSSARY',
    caseId: 'CASE-070',
    preferenceIds: ['PREF-INLINE-TERMINOLOGY'],
    scopes: ['results', 'research-copy'],
    rejected: 'attempt / cell / qualified positive / qualifying identity / gate / H1.38B / Track A / 128×2 / Gen28 / BASE / SD-LoRA / Δ / 95% CI',
    accepted: '训练范围内没有见过的任务（任务 500–6909）',
    reason: '集中术语表要求读者离开当前阅读路径；认可版本在第一次出现的位置直接解释现实对象。',
    failureMechanisms: ['glossary-roundtrip', 'jargon-memory-load'],
    ownerStatus: 'accepted',
  },
  {
    id: 'PAIR-071-LAYER-TEMPLATE',
    caseId: 'CASE-071',
    preferenceIds: ['PREF-PROGRESSIVE-DISCLOSURE'],
    scopes: ['research-copy', 'results'],
    rejected: '一句话看懂：',
    accepted: '事实 → 解释 → 边界',
    reason: '信息深度应自然递进，不应机械渲染成需要读者再次选择的 UI 模板。',
    failureMechanisms: ['visible-layer-template', 'meta-explanation-chrome'],
    ownerStatus: 'accepted',
  },
  {
    id: 'PAIR-081-DEFENSIVE-OPENING',
    caseId: 'CASE-081',
    preferenceIds: ['PREF-DIRECT-FACTS', 'PREF-SCIENTIFIC-BOUNDARY'],
    scopes: ['briefing', 'research-copy'],
    rejected: '质量不是“页面做得漂亮”或“GPU 跑得满”。',
    accepted: '我们把实验质量拆成四层：科学设计、工程门禁、证据身份和对外表达。每一层都有可追溯的证据，也都有明确的停止条件。',
    reason: '先陈述对象和做法，再把限制贴到相关 claim，比预先反驳读者更自然且不损失严谨性。',
    failureMechanisms: ['defensive-negation-opening', 'anticipatory-rebuttal'],
    ownerStatus: 'accepted',
  },
  {
    id: 'PAIR-082-RESEARCH-NARRATIVE',
    caseId: 'CASE-082',
    preferenceIds: ['PREF-RESEARCH-JUDGMENT'],
    scopes: ['briefing', 'research-copy'],
    rejected: '实验系统 / 质量体系 / 推进节奏 / 当前阻塞',
    accepted: '能力上限 → 参数机制 → 因果控制',
    reason: '阶段汇报要展示研究问题如何被证据推进，而不是把工程模块和状态清单当主叙事。',
    failureMechanisms: ['project-status-narrative', 'engineering-module-first'],
    ownerStatus: 'accepted',
  },
  {
    id: 'PAIR-083-LEARNING-LOOP',
    caseId: 'CASE-083',
    preferenceIds: ['PREF-FEEDBACK-LEARNING-LOOP'],
    scopes: ['workflow'],
    rejected: '写入案例库 → 等未来 Agent 自己想起来',
    accepted: '反馈 → Gold Pair → Preference Model → task-time retrieval → blind cold read → preference judge → release',
    reason: '保存资料不等于学习；只有反馈真正改变下一次生成上下文和验收标准，纠正才产生累积收益。',
    failureMechanisms: ['passive-case-library', 'retrieval-not-executed', 'evaluation-not-updated'],
    ownerStatus: 'accepted',
  },
];
