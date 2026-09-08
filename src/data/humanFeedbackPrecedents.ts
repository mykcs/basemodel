export interface HumanFeedbackPrecedent {
  id: `CASE-${string}`;
  title: string;
  tags: string[];
  principle: string;
  antiPatterns: string[];
  positiveSignals: string[];
}

export const HUMAN_FEEDBACK_PRECEDENTS: HumanFeedbackPrecedent[] = [
  {
    id: 'CASE-029',
    title: '结论先于实验账本',
    tags: ['结果', '结论', '证据', '科研页面'],
    principle: '先给读者当前能下的结论，再展开运行账本、过程记录和 provenance。',
    antiPatterns: ['先展示长运行记录再让读者自己找结论'],
    positiveSignals: ['首层直接出现结果与解释边界'],
  },
  {
    id: 'CASE-030',
    title: '可见推理桥而不是只给标签',
    tags: ['结果', '解释', '因果', '证据'],
    principle: '结论与证据之间要有一条人能读懂的推理桥，不能只丢状态标签或内部字段。',
    antiPatterns: ['只给 PASS/FAIL、stage、gate 等标签'],
    positiveSignals: ['说明观察如何支持当前判断'],
  },
  {
    id: 'CASE-061',
    title: '首屏先建立对象身份',
    tags: ['首屏', '身份', '标题', 'Harness', 'WebShop'],
    principle: '第一次进入先知道对象是什么；架构、数据集和比较对象的身份优先于抽象研究关系。',
    antiPatterns: ['OpenEvo × SEED：WebShop 研究'],
    positiveSignals: ['OpenEVO (Harness)', 'WebShop 数据集'],
  },
  {
    id: 'CASE-062',
    title: 'TL;DR 直接回答实验做了什么',
    tags: ['首屏', 'TL;DR', '摘要', '实验'],
    principle: '首层摘要回答做了什么、现在看到什么、还不能证明什么；不要把背景百科当摘要。',
    antiPatterns: ['只写“当前发现”却不交代实验对象和边界'],
    positiveSignals: ['明确 TL;DR', '做了什么', '还不能证明什么'],
  },
  {
    id: 'CASE-063',
    title: '标题命名对象，不主持阅读',
    tags: ['标题', 'AI味', '说人话', '主持人'],
    principle: '普通 H1/H2/H3 优先命名主题；“怎么读 / 怎样连起来 / 先…再…”属于作者主持动作。',
    antiPatterns: ['三个研究问题怎样连起来', '怎么读', '先分清'],
    positiveSignals: ['三个研究问题', '实验结果', 'GPU 规格'],
  },
  {
    id: 'CASE-064',
    title: '真人反馈必须形成闭环',
    tags: ['真人反馈', '案例库', '举一反三', '全站扫描'],
    principle: '真人指出一次问题后，要保存反例、正例、规律和适用范围，并扫描 sibling surfaces，而不是只修被点名页面。',
    antiPatterns: ['只修一个页面后宣布完成'],
    positiveSignals: ['相关案例绑定', '同类页面扫描', '回归保护'],
  },
  {
    id: 'CASE-067',
    title: '直接说实验事实，少用叙事隐喻',
    tags: ['AI味', '隐喻', '实验', '标题'],
    principle: '能直接说实验事实时，不用“分岔 / 分叉 / 旅程”等叙事包装替代真实对象。',
    antiPatterns: ['分岔', '分叉'],
    positiveSignals: ['直接命名实验对象和状态'],
  },
  {
    id: 'CASE-068',
    title: '首屏只承担一个主要理解任务',
    tags: ['ADHD', '注意力', '首屏', '认知负担', '信息层级'],
    principle: '首屏不是正确字段库存；只保留完成当前 primary task 必需的对象、结论、边界和下一步。',
    antiPatterns: ['多个同权重 CTA、卡片、导航和 provenance 同时竞争'],
    positiveSignals: ['一个明显认知中心', '次要深度后置'],
  },
  {
    id: 'CASE-069',
    title: '视觉中心只给真实主题或结论',
    tags: ['ADHD', '注意力', '加粗', '标题', '视觉中心'],
    principle: '字号、加粗、卡片和标题都在分配注意力；不能把作者的教学动作做成最大视觉中心。',
    antiPatterns: ['把“先分清”之类教学动作加粗放大'],
    positiveSignals: ['视觉重量跟随真实对象、结论或决定性数字'],
  },
  {
    id: 'CASE-070',
    title: '术语与代号就地解释',
    tags: ['术语', '代号', '认知负担', '解释'],
    principle: '先用人类名称；必须保留内部术语时，在第一次出现的位置解释，不让读者跳去集中术语表再回来。',
    antiPatterns: ['正文裸奔内部代号，再要求查远处 glossary'],
    positiveSignals: ['术语第一次出现就地解释'],
  },
  {
    id: 'CASE-071',
    title: '解释深度不变成模板标签',
    tags: ['解释', 'AI味', '信息层级'],
    principle: '浅层/深层是信息深度，不要机械渲染“一句话看懂 / 专业解释”等主持标签。',
    antiPatterns: ['一句话看懂', '专业解释'],
    positiveSignals: ['自然递进的正文层级'],
  },
  {
    id: 'CASE-081',
    title: '不要用防御性否定开场',
    tags: ['开场', 'AI味', '科研边界'],
    principle: '先说发生了什么和我们做了什么，再在真正改变结论的地方补“不代表什么”。',
    antiPatterns: ['第一句连续解释“这不是…”'],
    positiveSignals: ['事实先行', '边界紧邻相关 claim'],
  },
  {
    id: 'CASE-082',
    title: '科研汇报按研究问题组织',
    tags: ['briefing', '科研汇报', '叙事', '研究问题'],
    principle: '阶段汇报按问题 → 假设 → 实验 → 结果 → 决策转折组织，不让工程状态模块替代研究主线。',
    antiPatterns: ['按工程模块或项目状态流水账组织汇报'],
    positiveSignals: ['Ceiling → Mechanism → Control', '问题驱动叙事'],
  },
];

export const READER_CONTRACT_PRECEDENTS: Record<string, string[]> = {
  study: ['CASE-061', 'CASE-062', 'CASE-063', 'CASE-064', 'CASE-068', 'CASE-069', 'CASE-070'],
  'study-results': ['CASE-029', 'CASE-030', 'CASE-064', 'CASE-068', 'CASE-069', 'CASE-070'],
  'study-run': ['CASE-064', 'CASE-068', 'CASE-070', 'CASE-081'],
  'study-briefing': ['CASE-064', 'CASE-068', 'CASE-070', 'CASE-081', 'CASE-082'],
  'capability-home': ['CASE-064', 'CASE-068', 'CASE-069', 'CASE-070'],
  'capability-first-run': ['CASE-029', 'CASE-030', 'CASE-064', 'CASE-068', 'CASE-069', 'CASE-070'],
};

export const GLOBAL_REJECTED_SURFACE_PATTERNS = [
  'OpenEvo × SEED：WebShop 研究',
  '三个研究问题怎样连起来',
  '先分清两种“新任务”',
] as const;
