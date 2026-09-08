export type ReaderAttentionMode = 'focus' | 'choice' | 'reference' | 'operational' | 'narrative' | 'comparison';

export interface FirstViewportBudget {
  maxInteractive: number;
  maxHeadings: number;
  maxTextChars: number;
}

export interface SiteReaderContract {
  id: string;
  sourceRoute: string;
  samplePath: string;
  attentionMode: ReaderAttentionMode;
  audience: string;
  primaryTask: string;
  firstViewportGoal: string;
  mustStayVisible: string;
  nextStep: string;
  firstViewportSelector?: string;
  firstViewportBudget?: FirstViewportBudget;
  redirectsTo?: string;
}

const audience = '第一次访问、不了解项目内部代号，但具备普通技术阅读能力的读者';
const c = (
  id: string,
  sourceRoute: string,
  samplePath: string,
  attentionMode: ReaderAttentionMode,
  primaryTask: string,
  firstViewportGoal: string,
  mustStayVisible: string,
  nextStep: string,
  firstViewportSelector?: string,
  firstViewportBudget?: FirstViewportBudget,
): SiteReaderContract => ({ id, sourceRoute, samplePath, attentionMode, audience, primaryTask, firstViewportGoal, mustStayVisible, nextStep, firstViewportSelector, firstViewportBudget });

export const SITE_READER_CONTRACTS = [
  c('home', '/', '/', 'choice', '判断这个站点能帮助自己完成什么研究任务', '先认出 SEED × OpenEvo 研究主题和两个主要入口', '研究对象与两条主线的区别', '选择流程理解或实验研究入口', '.mission-hero__lede', { maxInteractive: 2, maxHeadings: 1, maxTextChars: 420 }),
  c('not-found', '/404/', '/404/', 'reference', '知道当前地址不存在并安全返回有效入口', '明确页面不存在，而不是让读者误以为内容加载失败', '错误状态和返回路径', '返回首页或主要导航'),
  c('development', '/development/', '/development/', 'reference', '了解开发状态和页面用途', '先知道这是开发信息而非实验结论', '开发/生产边界', '进入对应正式页面或开发说明'),
  c('models-index', '/models/', '/models/', 'choice', '从模型目录中找到适合继续查看的模型', '先知道这是模型目录以及如何筛选', '目录对象与筛选含义', '开始筛选或选择其他浏览方式', '.models-entry .button-primary', { maxInteractive: 2, maxHeadings: 1, maxTextChars: 420 }),
  c('model-detail', '/models/[id]/', '/models/kimi-k2-thinking/', 'reference', '确认一个模型是什么、能否用于当前实验', '先认出模型身份和最影响实验决策的事实', '来源、许可与实验约束', '检查研究摘要，再按需展开引用和页内导航', '.model-detail-intro', { maxInteractive: 4, maxHeadings: 2, maxTextChars: 720 }),
  c('families', '/families/', '/families/', 'choice', '按模型家族理解可选模型关系', '先知道家族页在组织什么对象', '家族关系不是性能结论', '选择家族或具体模型'),
  c('compare', '/compare/', '/compare/', 'comparison', '并排比较模型差异以支持实验决策', '先看到比较双方和真正改变实验的维度', '缺失数据与不可比边界', '保留候选或回到实验工作台'),
  c('papers-index', '/papers/', '/papers/', 'choice', '找到与实验问题相关的论文', '先知道论文目录覆盖什么研究证据', '论文报道与本地复现不是同一证据层', '开始查找论文', '.papers-entry .button-primary', { maxInteractive: 1, maxHeadings: 1, maxTextChars: 400 }),
  c('paper-detail', '/papers/[id]/', '/papers/metagpt/', 'reference', '理解一篇论文做了什么以及本项目能复现什么', '先认出论文主张、方法和本项目关系', '论文原始主张与本地验证边界', '检查模型角色、设置或复现路径'),
  c('guide', '/guide/', '/guide/', 'choice', '找到适合自己的复现入口', '先理解 Agent 轨迹与 SEED / OpenEvo 的关系，再选择继续学习或直接看结果', '不同复现等级不能混写', '进入 Agent 流程或 WebShop 结果', '.guide-primary .button-primary', { maxInteractive: 2, maxHeadings: 1, maxTextChars: 480 }),
  c('guide-today', '/guide/today/', '/guide/today/', 'operational', '完成当天需要执行的实验准备或运行步骤', '先看到现在该做什么和什么不能做', '当前授权与安全边界', '执行下一个明确步骤'),
  c('landscape', '/landscape/', '/landscape/', 'choice', '在模型与研究版图中找到相关对象', '先知道这张图按什么维度组织信息', '目录关系不等于能力排序', '进入模型关系总览', '.landscape-entry .button-primary', { maxInteractive: 1, maxHeadings: 1, maxTextChars: 400 }),
  c('methodology', '/methodology/', '/methodology/', 'reference', '理解站点如何区分事实、推断和未知', '先认出证据等级和比较边界', '未知必须保持未知', '按方法规则返回具体研究页面'),
  c('workspace', '/workspace/', '/workspace/', 'operational', '把模型、资源和实验约束组合成可执行决策', '先明确研究目标、模型角色、资源限制和开始入口', '约束与证据不能被自动补猜', '开始填写实验条件', '.workspace-primary .button-primary', { maxInteractive: 1, maxHeadings: 1, maxTextChars: 420 }),
  c('data-status', '/data-status/', '/data-status/', 'reference', '判断站点数据的更新时间和可信范围', '先知道哪些数据已核验、哪些仍未知', '新鲜度和来源边界', '回到受影响的数据或页面'),
  c('lab', '/lab/', '/lab/', 'operational', '理解实验服务器资源与可安全操作范围', '先看到 8×RTX5090、约 1 TiB RAM、160 线程和共享授权边界', '共享硬件、授权和所有权边界', '继续查看服务器概况', '.lab-intro .lede', { maxInteractive: 0, maxHeadings: 1, maxTextChars: 520 }),

  c('flow', '/research/seed-openevo/flow/', '/research/seed-openevo/flow/', 'choice', '建立 OpenEvo、SEED、环境和训练流程的整体心智模型', '先看研究主题和公平比较边界，再下滑理解对象关系', '流程关系不等于实验结果', '进入流程对象与训练设计', '.mission-hero__lede', { maxInteractive: 1, maxHeadings: 1, maxTextChars: 440 }),
  c('flow-server', '/research/seed-openevo/flow/server/', '/research/seed-openevo/flow/server/', 'reference', '理解服务器在实验流程中的角色', '先知道服务器提供什么资源而不承担什么科学语义', '资源事实与实验授权分开', '继续看资源详情', '.server-hero', { maxInteractive: 0, maxHeadings: 1, maxTextChars: 560 }),
  c('flow-base-model', '/research/seed-openevo/flow/base-model/', '/research/seed-openevo/flow/base-model/', 'reference', '理解基础模型在实验开始时是什么', '先认出基础模型和它进入实验前的状态', '模型身份、权重和后续训练状态不可混写', '继续到 SEED 或 OpenEvo 流程'),
  c('flow-seed', '/research/seed-openevo/flow/seed/', '/research/seed-openevo/flow/seed/', 'narrative', '理解 SEED 怎样从经验形成训练信号', '先看 SEED 的输入、处理和输出顺序', '论文方法与本地实现边界', '继续查看 benchmark 或对照实验'),
  c('flow-openevo', '/research/seed-openevo/flow/openevo/', '/research/seed-openevo/flow/openevo/', 'narrative', '理解 OpenEvo 怎样把经验用于后续学习', '先看经验如何进入下一次模型变化', '机制说明不能升级成效果结论', '继续到具体实验'),
  c('flow-benchmarks', '/research/seed-openevo/flow/benchmarks/', '/research/seed-openevo/flow/benchmarks/', 'comparison', '理解 ALFWorld 与 WebShop 分别测什么', '先区分两个 benchmark 的任务和评分对象', '不同 benchmark 的分数不能直接混比', '进入具体环境说明'),
  c('flow-webshop', '/research/seed-openevo/flow/webshop/', '/research/seed-openevo/flow/webshop/', 'narrative', '理解一次 WebShop 任务怎样进行和怎样评分', '先看模型看到什么、做什么、何时成功', '动作解析错误与模型能力错误要分开', '继续到实验设置或结果'),
  c('flow-alfworld', '/research/seed-openevo/flow/alfworld/', '/research/seed-openevo/flow/alfworld/', 'narrative', '理解一次 ALFWorld 任务怎样进行和怎样评分', '先看环境、动作和成功定义', 'ALFWorld 成功率语义独立于 WebShop 分数', '继续到 benchmark 或实验设计'),
  c('flow-loops', '/research/seed-openevo/flow/loops/', '/research/seed-openevo/flow/loops/', 'narrative', '理解经验、反馈和参数更新怎样形成循环', '先看到循环的真实输入输出而不是抽象口号', '循环存在不等于已经证明持续提升', '进入对应实验验证'),

  c('study', '/research/seed-openevo/study/', '/research/seed-openevo/study/', 'choice', '理解当前实验结论，再决定进入哪个研究阶段', '先看到同一 128 个 WebShop 任务上的当前 7B 对比结论和仍未完成的 OpenEVO-vs-SEED 最终比较', '完整成功数仍为 5/128 对 5/128；SEED 论文、运行条件与流程背景继续可达但不与当前结论争夺首屏', '查看当前结果，或继续三个研究问题', '.study-hero', { maxInteractive: 2, maxHeadings: 1, maxTextChars: 620 }),
  { ...c('study-design', '/research/seed-openevo/study/design/', '/research/seed-openevo/study/design/', 'reference', '知道旧训练设计地址已经迁移，并进入新的唯一设计位置', '先看到训练设计已并入流程理解图，而不是误以为这是第二套设计页面', '旧 URL 只做兼容跳转；真正设计内容只有一个语义 owner', '进入流程理解图中的训练设计', '#training-design-title'), redirectsTo: '/research/seed-openevo/flow/' },
  c('study-run', '/research/seed-openevo/study/run/', '/research/seed-openevo/study/run/', 'operational', '知道当前实验怎样运行以及下一步能做什么', '先确认授权边界与持久工作区，再从 Gate 01 开始', '技术能力不等于项目授权；真实服务器身份与路径必须从私有运行文档解析', '从 Gate 01 开始复现', '.run-primary', { maxInteractive: 2, maxHeadings: 2, maxTextChars: 720 }),
  c('study-results', '/research/seed-openevo/study/results/', '/research/seed-openevo/study/results/', 'focus', '快速抓住当前最重要实验结论和证据边界', '先看到同一 128 题评测还没有证明稳定优势', '完整成功数相同、统计范围包含无差异以及执行授权边界必须首层可见', '进入这轮 128 题机器证据', '.results-primary', { maxInteractive: 2, maxHeadings: 1, maxTextChars: 900 }),
  c('result-note', '/research/seed-openevo/study/results/[note]/', '/research/seed-openevo/study/results/current-conclusion/', 'narrative', '理解一个结果问题的现象、原因、证据与边界', '先看到该结果主题和直接结论', '历史记录、测量无效和未运行状态不能混写', '继续证据或返回结果目录'),
  c('result-3b-self', '/research/seed-openevo/study/results/3b-self-analysis/', '/research/seed-openevo/study/results/3b-self-analysis/', 'focus', '理解 3B self 分析的主要发现', '先看到结果对象和主要发现', '分析解释不能超过证据', '查看证据或四组比较'),
  c('result-7b-self', '/research/seed-openevo/study/results/7b-self-analysis/', '/research/seed-openevo/study/results/7b-self-analysis/', 'focus', '理解 7B self 分析的主要发现', '先看到结果对象和主要发现', '分析解释不能超过证据', '查看证据或四组比较'),
  c('result-3b-minimax', '/research/seed-openevo/study/results/3b-minimax-analysis/', '/research/seed-openevo/study/results/3b-minimax-analysis/', 'focus', '理解 3B MiniMax 分析的主要发现', '先看到结果对象和主要发现', '外部分析不能改写原轨迹事实', '查看证据或四组比较'),
  c('result-7b-minimax', '/research/seed-openevo/study/results/7b-minimax-analysis/', '/research/seed-openevo/study/results/7b-minimax-analysis/', 'focus', '理解 7B MiniMax 分析的主要发现', '先看到结果对象和主要发现', '外部分析不能改写原轨迹事实', '查看证据或四组比较'),
  c('result-four-arm', '/research/seed-openevo/study/results/four-arm-analysis/', '/research/seed-openevo/study/results/four-arm-analysis/', 'comparison', '比较 3B/7B × self/MiniMax 四组结果', '先看到四组比较对象和最重要差异', '模型规模与分析来源是不同变量', '进入具体组或结论'),
  c('minimax-teacher', '/research/seed-openevo/study/minimax-teacher/', '/research/seed-openevo/study/minimax-teacher/', 'reference', '理解 MiniMax 在实验中何时参与、做什么', '先认出 MiniMax 是事后分析者而不是在线替模型操作', 'teacher 参与边界不能污染模型自身表现', '返回实验设计或结果'),

  c('capability-home', '/research/seed-openevo/study/capability-exploration/', '/research/seed-openevo/study/capability-exploration/', 'choice', '理解能力探索当前在研究什么并选择路径', '先看到历史事实、当前参数问题和一个主入口', '历史、后继设计和机制实验不能混成一个当前状态', '进入当前参数机制实验', '[data-research-orientation] [data-reader-purpose]', { maxInteractive: 3, maxHeadings: 1, maxTextChars: 560 }),
  c('capability-first-run', '/research/seed-openevo/study/capability-exploration/first-run/', '/research/seed-openevo/study/capability-exploration/first-run/', 'focus', '几秒内理解 3B 与 7B 第一轮实验发生了什么', '先看到 7B 完成、旧 3B 因接口问题停止', '3B 的接口问题不能被简化成模型能力失败', '看两种模型各自发生了什么', '[data-research-orientation] [data-reader-purpose]'),
  c('capability-gdr', '/research/seed-openevo/study/capability-exploration/gdr-directapply/', '/research/seed-openevo/study/capability-exploration/gdr-directapply/', 'narrative', '理解为什么 44 个候选只留下 7 次正式更新，以及这不能证明什么', '先看到 44 个候选被训练、7 个被 GDR-v1 采用，以及 final-performance 边界', '7 次 UPDATE 不等于只训练 7 次；不能据此证明 GDR 降低最终成绩或 DirectApply 更好；No-GDR 也不等于取消安全合同', '查看 GDR 与 DirectApply 的 transition rule 差异', '.gdr-primary', { maxInteractive: 2, maxHeadings: 1, maxTextChars: 760 }),
  c('capability-stage1-previous', '/research/seed-openevo/study/capability-exploration/stage1-previous/', '/research/seed-openevo/study/capability-exploration/stage1-previous/', 'reference', '理解旧 Stage 1 的历史设置和证据', '先知道这是旧实验记录以及与当前设计的区别', '历史记录不能当当前合同', '返回当前实验或查看历史证据'),
  c('capability-stage1-evolution', '/research/seed-openevo/study/capability-exploration/stage1-evolution/', '/research/seed-openevo/study/capability-exploration/stage1-evolution/', 'narrative', '理解 Stage 1 为什么发生设计变化', '先看到现实问题与对应修订', '工程便利不能偷偷改变科学语义', '进入后继实验'),
  c('capability-stage2-window', '/research/seed-openevo/study/capability-exploration/stage2-256-window/', '/research/seed-openevo/study/capability-exploration/stage2-256-window/', 'focus', '理解旧 Stage 2 为什么没有触发参数更新', '先看到成功轨迹存在但门槛未满足', '未更新参数不等于模型完全没有成功', '查看门槛证据或后继设计'),
  c('capability-stage2-ceiling', '/research/seed-openevo/study/capability-exploration/stage2-ceiling/', '/research/seed-openevo/study/capability-exploration/stage2-ceiling/', 'focus', '理解 7B Ceiling 实验的主要结果', '先看到最终测试结果与持续参数更新事实', 'SEED 数字只是参考而非本地配对对照', '查看完整证据和参数分析'),
  c('capability-stage2-analysis', '/research/seed-openevo/study/capability-exploration/stage2-7b-analysis/', '/research/seed-openevo/study/capability-exploration/stage2-7b-analysis/', 'focus', '理解 7B 参数变化分析说明什么', '先看到参数结构的主要测量结果', '参数几何不能直接替代任务效果', '查看各项参数证据'),
  c('capability-successor', '/research/seed-openevo/study/capability-exploration/openevo-2-0/', '/research/seed-openevo/study/capability-exploration/openevo-2-0/', 'focus', '快速判断 3B 与 1.7B 后继实验目前得到什么结果', '先看到 1.7B 已完成而 3B 尚无同口径最终结果', '共同规则与不同起点都要保留', '查看实验报告', '[data-research-orientation] [data-reader-purpose]'),
  c('capability-successor-exploration', '/research/seed-openevo/study/capability-exploration/openevo-2-0/exploration/', '/research/seed-openevo/study/capability-exploration/openevo-2-0/exploration/', 'narrative', '理解购物接口怎样经过排查和修订', '先看到失败现象与排查对象', '诊断历史不能被改写成事后必然路线', '按时间顺序继续阅读'),
  c('capability-successor-harness', '/research/seed-openevo/study/capability-exploration/openevo-2-0/harness-2-0/', '/research/seed-openevo/study/capability-exploration/openevo-2-0/harness-2-0/', 'reference', '理解共享购物接口怎样保证比较语义', '先看到接口允许什么、禁止教什么', '接口修复不能成为任务策略提示', '返回后继实验或查看诊断'),
  c('capability-successor-report', '/research/seed-openevo/study/capability-exploration/openevo-2-0/report/', '/research/seed-openevo/study/capability-exploration/openevo-2-0/report/', 'focus', '快速抓住 3B 与 1.7B 实验报告的结果与边界', '先看到 37.60、1/128、3B 未同口径收口以及 SEED 参考边界', 'SEED 是外部参考，不是本地配对对照', '查看实验方法', '[data-research-orientation] [data-reader-purpose]'),
  c('capability-mechanism', '/research/seed-openevo/study/capability-exploration/mechanism-1-0/', '/research/seed-openevo/study/capability-exploration/mechanism-1-0/', 'narrative', '理解参数机制实验怎样开始、比较和停止', '先看到机制问题与实验生命周期', '开始/停止/授权边界本身是科学内容，不能为了简洁隐藏', '进入一次购物任务或具体机制实验'),
  c('capability-archive', '/research/seed-openevo/study/capability-exploration/archive/', '/research/seed-openevo/study/capability-exploration/archive/', 'reference', '查找历史实验记录和证据身份', '先知道这是档案而不是当前运行状态', '历史 receipt 与当前 authority 分开', '打开对应历史实验记录'),
] as const satisfies readonly SiteReaderContract[];

const normalize = (pathname: string) => {
  const path = (pathname.split(/[?#]/, 1)[0] || '/').replace(/^\/en(?=\/|$)/, '') || '/';
  return path === '/' ? '/' : `/${path.replace(/^\/+|\/+$/g, '')}/`;
};

function sourceRouteMatches(sourceRoute: string, pathname: string): boolean {
  const pattern = sourceRoute
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    .replace(/\\\[[^/]+\\\]/g, '[^/]+');
  return new RegExp(`^${pattern}$`).test(pathname);
}

export function readerContractForRoute(pathname: string): SiteReaderContract | undefined {
  const route = normalize(pathname);
  const exact = SITE_READER_CONTRACTS.find((contract) => !contract.sourceRoute.includes('[') && contract.sourceRoute === route);
  if (exact) return exact;
  return SITE_READER_CONTRACTS.find((contract) => contract.sourceRoute.includes('[') && sourceRouteMatches(contract.sourceRoute, route));
}

export function normalizeReaderRoute(pathname: string): string {
  return normalize(pathname);
}