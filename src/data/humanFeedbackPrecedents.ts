export type HumanFeedbackCaseId = `CASE-${string}`;

export interface HumanFeedbackPrecedent {
  id: HumanFeedbackCaseId;
  title: string;
  tags: string[];
  principle: string;
  antiPatterns: string[];
  positiveSignals: string[];
}

export const HUMAN_FEEDBACK_PRECEDENTS: HumanFeedbackPrecedent[] = [
  {
    id: 'CASE-027',
    title: '中文含义先于无信息英文标签',
    tags: ['英文眉题', '术语', '认知负担', 'briefing'],
    principle: '英文只有在它命名真实技术对象、检索身份或独立阅读模式时才保留；删掉不损失信息的英文眉题属于认知噪声。',
    antiPatterns: ['OpenEVO · SEED × WebShop', 'AGENDA / RESULTS / QUESTION / MECHANISM'],
    positiveSignals: ['直接中文标题', 'LoRA / RL / GDR / TaskVector 等必要技术对象保留'],
  },
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
    id: 'CASE-059',
    title: '数字第一次出现必须带对象和测量含义',
    tags: ['ELI5', '数字', '对象', '指标', '分母', 'briefing'],
    principle: '重要数字不能要求读者猜它在数什么；第一次出现时给对象、单位/分母和必要的测量含义。',
    antiPatterns: ['49.33 / 58⁄128', '44 → 7 但不说 44 和 7 分别是什么'],
    positiveSignals: ['49.33 / 100 Task Score', '58 / 128 个任务完整成功', '44 个 SD-LoRA 更新候选中 7 个进入后续模型'],
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
    id: 'CASE-065',
    title: '内部路线代号不能代替实验对象',
    tags: ['代号', '身份', 'Track A', 'provenance', '首层'],
    principle: '公开首层先命名真实对象；内部 route、branch、phase 名只在需要精确索引时作为 provenance 出现。',
    antiPatterns: ['OpenEvo · Track A 7B'],
    positiveSignals: ['7B · 基础模型', '7B · 使用 OpenEVO 学习结果'],
  },
  {
    id: 'CASE-066',
    title: '不要用方法学术语替代比较双方',
    tags: ['配对评测', '统计术语', '比较', 'ELI5', '对象'],
    principle: '能直接显示比较双方、共同任务和分数时先显示这些；paired analysis 等方法学术语放到第二层解释。',
    antiPatterns: ['OpenEVO · 7B 配对评测'],
    positiveSignals: ['7B · 基础模型', '7B · 使用 OpenEVO 学习结果', '同一批 128 个 WebShop 任务'],
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
    title: '科研汇报按问题、诊断和下一问组织',
    tags: ['briefing', '科研汇报', '叙事', '研究问题', '参数标题', '技术推导', '手机', '16:9'],
    principle: '阶段汇报按科学问题 → 诊断实验 → 排除解释 → 下一问组织；默认工程正确不等于科研亮点；技术深度由公式和数据本身承担；实现参数不为冲击力抢标题；presentation 的手机与桌面可承担不同布局责任。',
    antiPatterns: ['按工程模块或项目状态流水账组织汇报', '把 SHA / 重复性等默认工程正确性单独做成科研亮点', '为了极简删掉能够证明机制设计的数学细节', '用“这里更硬核”替代真实技术指标', '纯装饰气泡抢占科研内容注意力', '实现参数数字为了冲击力抢标题', '手机强制承载桌面固定 16:9 画布'],
    positiveSignals: ['问题 → 诊断 → 排除 → 下一问', '主演讲简式 + 技术子页完整推导', '自然语言标题 + 正文精确参数', '桌面 capped 16:9 + 手机整张 slide 等比 fit-to-width' ],
  },
  {
    id: 'CASE-083',
    title: '案例库必须改变下一次任务的生成与验收',
    tags: ['案例库', '偏好学习', 'Gold Pair', 'Preference Model', 'cold read', 'judge', '举一反三'],
    principle: '真人纠正必须进入下一次任务的 pre-write retrieval 与 post-write judge；只保存 Markdown 案例而不改变生成上下文和验收流程，不算学会。',
    antiPatterns: ['写入案例库 → 等未来 Agent 自己想起来', '只靠 style guide 或词语黑名单'],
    positiveSignals: ['Rejected → Accepted Gold Pair', 'Preference Model', 'task-time retrieval', 'blind cold read', 'preference judge'],
  },
  {
    id: 'CASE-084',
    title: '负向诊断必须闭环到观察、排除与下一步',
    tags: ['briefing', '科研汇报', '诊断', '负结果', 'checkpoint', 'loss', 'W&B', '下一步'],
    principle: '诊断实验不能只报一个分数或“没改善”；要把观察到的行为证据、因此排除的解释、随后采取的处理或下一问连起来。训练 loss、训练过程任务表现与冻结终评是不同证据层，展示曲线时必须分清。',
    antiPatterns: ['15→30 仍然 0，所以 horizon 不是问题', '只画 loss 就声称任务能力在收敛', '报完负结果却不说停止调什么、转查什么'],
    positiveSignals: ['15/30 步都在同几类动作间打转 → 排除单纯步数不足 → 固定 horizon 转查 Text Memory', '训练 loss 与在线任务分数分别画，并把 frozen final eval 作为独立终评点'],
  },
  {
    id: 'CASE-085',
    title: '人审 Preview 与最终验收是两条不同的工作流',
    tags: ['workflow', 'Preview', 'build', 'Vercel', '审阅', '迭代', '速度'],
    principle: '还在反复改 UI/copy/slide 时，用本地静态构建加非权威 prebuilt Preview 快速给人看；只有准备 merge/release 时才运行 exact-head 最终 Vercel gate。',
    antiPatterns: ['每改一句文案都跑完整 205 项 Chromium 最终 gate', '把快速 review Preview 当成 merge evidence'],
    positiveSignals: ['coherent edit → local build → prebuilt review Preview', 'merge-ready → exact-head Vercel final gate'],
  },

  {
    id: 'CASE-086',
    title: '紧急恢复页先给行动，再给运行手册',
    tags: ['恢复', '急救', '着急', '失忆', '零上下文', '下一步', '技术细节', 'action-first'],
    principle: '人在高压恢复场景里不应先解码工程系统；首层先用普通话确认处境，再给一个最短且安全的下一步，并说明接下来会发生什么。完整运行手册和实现名词保留在后层。',
    antiPatterns: ['一打开恢复页先展示设备型号、launchd、watchdog、pmset、token 等实现名词', '让着急的人先理解架构和排障历史，才能知道下一步做什么'],
    positiveSignals: ['场景 → 一个主要动作 → 预期结果', '明确告诉读者技术细节平时不用读', '完整工程排障资料后置但仍可恢复'],
  },
  {
    id: 'CASE-087',
    title: '机制解释先说谁做了什么，再说抽象关系',
    tags: ['briefing', '科研汇报', '说人话', '机制', '语序', 'GDR', 'SD-LoRA'],
    principle: '技术机制能按主体→动作→结果说清时，先写“谁做了什么、因此下一状态怎样”；不要把动词全部名词化成“X 与 Y 之间存在落差”让观众自己还原过程。',
    antiPatterns: ['“训练出一个更新”和“让这个更新进入后续模型”之间出现了很大的落差', '用抽象关系名词代替候选训练、GDR 拒绝、下一轮不变这条实际动作链'],
    positiveSignals: ['44 次都训练出了 SD-LoRA 候选；GDR 只同意 7 次真正改到下一轮', '保留 GDR / SD-LoRA 等真实技术对象，同时用自然句序解释它们做什么'],
  },
  {
    id: 'CASE-088',
    title: '同类实验图共享一套视觉语法',
    tags: ['briefing', '科研汇报', '图表', 'checkpoint', 'loss', 'Score', 'SD-LoRA', '视觉一致性'],
    principle: '同一组实验若展示相同证据类型，应复用同一图表位置、线型与更新标记语义；坐标范围和单位可以因真实技术差异调整。',
    antiPatterns: ['7B、1.7B、3B 各自发明不同的 Score / loss / update 视觉编码', '为了视觉整齐强迫不同量纲共用同一数值轴'],
    positiveSignals: ['左侧训练过程 Score、右侧 SD-LoRA loss、底部 candidate/accepted update 标记保持一致', '轴范围随实验真实数值变化但图表语义不变'],
  },
  {
    id: 'CASE-089',
    title: '阶段汇报要自带理解后续结论所需的最小方法背景',
    tags: ['briefing', '科研汇报', 'Stage 1', 'Stage 2', 'MiniMax', 'OPSD', 'Agent System', 'Text Memory', '自包含'],
    principle: '即使网站已有完整方法页，现场汇报仍要在结果之前给听众一份最小方法心智模型：阶段怎么接、谁产生轨迹、谁做回看、哪些状态会训练或更新。',
    antiPatterns: ['直接从 7B / 1.7B / 3B 结果开始，默认观众已经读过网站其他方法页', '为了自包含把完整实现手册和所有参数重复搬进主演讲'],
    positiveSignals: ['一页交代 Stage 1 轨迹采集 + MiniMax 回看 + 学习载体，再交代 Stage 2 自生成 round 与更新', '只保留理解后续科学判断必需的方法背景，深实现继续留技术页'],
  },
];

export const READER_CONTRACT_PRECEDENTS: Record<string, HumanFeedbackCaseId[]> = {
  study: ['CASE-061', 'CASE-062', 'CASE-063', 'CASE-064', 'CASE-068', 'CASE-069', 'CASE-070'],
  'study-results': ['CASE-029', 'CASE-030', 'CASE-059', 'CASE-064', 'CASE-068', 'CASE-069', 'CASE-070'],
  'study-run': ['CASE-064', 'CASE-068', 'CASE-070', 'CASE-081'],
  'study-briefing': ['CASE-027', 'CASE-059', 'CASE-064', 'CASE-068', 'CASE-070', 'CASE-081', 'CASE-082', 'CASE-084', 'CASE-087', 'CASE-088', 'CASE-089'],
  'capability-home': ['CASE-064', 'CASE-068', 'CASE-069', 'CASE-070'],
  'capability-first-run': ['CASE-029', 'CASE-030', 'CASE-064', 'CASE-068', 'CASE-069', 'CASE-070'],
};

export const GLOBAL_REJECTED_SURFACE_PATTERNS = [
  'OpenEvo × SEED：WebShop 研究',
  '三个研究问题怎样连起来',
  '先分清两种“新任务”',
] as const;
