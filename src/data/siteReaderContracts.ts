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
  c('development', '/development/', '/development/', 'reference', '理解 BaseModel 用哪些工具开发、验收和上线，以及当前 CI 为什么这样分工', '先看到 GitHub → Vercel → Production → Cloudflare 的主线，并知道 ChatGPT 是人的控制入口', 'CircleCI / GitHub Actions 只是手动恢复；Cloudflare 不负责普通 BaseModel 部署；网页是人类投影，Agent 文档和 live provider state 才是执行依据', '继续看每个工具的职责和一次改动怎样上线', '.development-hero .lede', { maxInteractive: 0, maxHeadings: 1, maxTextChars: 520 }),
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

  c('study-briefing', '/research/seed-openevo/study/briefing/', '/research/seed-openevo/study/briefing/', 'narrative', '用固定 16:9 HTML 演讲稿讲清 OpenEVO 暑期实验怎样从 7B 结果推进到更窄的科学问题', '先看到当前结果和 evaluation protocol 边界，再回到最早 7B，沿旧 gate、64-component、失败诊断、3B、TaskVector、GDR 与 DirectApply 追踪判断怎样改变', 'SEED 论文值与 OpenEVO 本地终评不是同协议胜负；3B 仍无同口径冻结终评；DirectApply 已完成自己冻结的 128 题 final，但历史 GDR final 不是同一题集', '沿时间线理解哪些小实验排除了错误解释，以及当前为什么转向更新准入和参数机制', '#briefing-title'),
  c('study-briefing-technical', '/research/seed-openevo/study/briefing/technical-notes/', '/research/seed-openevo/study/briefing/technical-notes/', 'reference', '按需查看汇报背后的完整技术推导与实验严谨性证据', '先知道主汇报只保留科研判断，本页负责展开负向实验、TaskVector、GDR/DirectApply 和复现边界', '技术页可以保留 SHA、重复性和完整公式，但这些默认不抢占主演讲；DirectApply final 已完成，但不同 final panel 的 GDR / DirectApply 结果仍不得写成算法胜负', '展开感兴趣的技术段落，或返回暑期考核汇报', '.technical-intro'),
  c('study', '/research/seed-openevo/study/', '/research/seed-openevo/study/', 'choice', '先理解研究问题与当前证据，再决定进入哪个研究阶段', '标题下直接保留 SEED 对照、论文、GitHub、运行条件与流程入口，再用 TL;DR 说明同一 128 个 WebShop 任务上的当前 7B 证据', '完整成功数仍为 5/128 对 5/128；SEED 89.7 使用不同模型与评测口径，不能直接比较；四个紧凑资源入口是明确真人反馈要求，不扩张为第二套导航', '继续三个研究问题，或进入流程、结果、机制与复现页面', '.study-hero', { maxInteractive: 4, maxHeadings: 1, maxTextChars: 620 }),
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

  c('capability-home', '/research/seed-openevo/study/capability-exploration/', '/research/seed-openevo/study/capability-exploration/', 'choice', '理解能力探索最新证据并选择下一条研究路径', '先看到 DirectApply 已完成 160 轮与一次冻结 final，再把 R127→R128 同题诊断作为解释训练曲线波动的历史证据', 'DirectApply 的 final 不能升级成 GDR-v1 的胜负结论；固定同题诊断也只解释局部 checkpoint 变化', '先看 DirectApply 完整曲线与 final，再按需进入 R127→R128 固定同题诊断', '[data-research-orientation] [data-reader-purpose]', { maxInteractive: 3, maxHeadings: 1, maxTextChars: 720 }),
  c('capability-first-run', '/research/seed-openevo/study/capability-exploration/first-run/', '/research/seed-openevo/study/capability-exploration/first-run/', 'focus', '几秒内理解 3B 与 7B 第一轮实验发生了什么', '先看到 7B 完成、旧 3B 因接口问题停止', '3B 的接口问题不能被简化成模型能力失败', '看两种模型各自发生了什么', '[data-research-orientation] [data-reader-purpose]'),
  c('capability-gdr', '/research/seed-openevo/study/capability-exploration/gdr-directapply/', '/research/seed-openevo/study/capability-exploration/gdr-directapply/', 'narrative', '理解本地 GDR-v1 为什么变成 candidate 放行 gate、DirectApply 为什么移除它，以及它与原始 Gated Delta Rule 的区别', '先看到本地 GDR-v1 实际过滤了什么，再沿页面理解原始 Gated Delta Rule 是 recurrent state update 而不是外部 task-score gate', '历史 GDR-v1、DirectApply 对照和未来原始-rule successor 必须分开；Task Vector 目前是诊断对象，不是已冻结的运行时 gate 输入', '查看原始 Gated Delta Rule 对比、固定同题诊断与仍未解决的映射问题'),
  c('capability-vanilla-sd-lora', '/research/seed-openevo/study/capability-exploration/vanilla-sd-lora/', '/research/seed-openevo/study/capability-exploration/vanilla-sd-lora/', 'narrative', '理解当前 OpenEvo × WebShop 一轮 SD-LoRA 从 rollout 到下一轮参数状态的真实机制', '先看到 128 次 rollout 如何筛成成功训练数据，再看到旧方向冻结、新方向学习、全部 coefficient 重排并合成累计 adapter', '当前语言 Agent 实现使用 bounded replay 且 paper_equivalent=false；SD-LoRA candidate 训练与 GDR/DirectApply 状态准入必须分开', '继续查看 GDR/DirectApply 的 candidate 准入或 Q17 同题诊断', '.sdlora-slide__header'),
  c('capability-q17-directapply-analysis', '/research/seed-openevo/study/capability-exploration/q17-directapply-analysis/', '/research/seed-openevo/study/capability-exploration/q17-directapply-analysis/', 'narrative', '在一页里理解 DirectApply 160 轮到底学到了什么、哪里不稳定、四种学习载体怎样变化、为什么 SD-LoRA 后期变慢，以及 Final 与 D1 最终说明什么', '先看到 160 轮 / 20,480 次任务 / 159 次参数更新、Final 60.72 与 50/128，以及“参数几何可压缩但行为不能无损保持”的核心结论', 'R159=72.90 只是训练轮分数；R127→R128 只能支持局部能力重新分配而非全局遗忘；latency scaling 是机制诊断而非能力缺陷；Text Memory NOOP 是运行语义修复而非新算法成功；D1 不修改 final state；历史 GDR 37.60 使用不同 final panel，不能直接当方法差', '沿完整轨迹、可靠性与覆盖、同题行为诊断、四种载体、SD-LoRA latency、Final、D1 几何和功能保持依次核对，再进入具体机制或原始证据', '.q17-analysis__hero', { maxInteractive: 3, maxHeadings: 1, maxTextChars: 1050 }),
  c('capability-q17-frontier', '/research/seed-openevo/study/capability-exploration/q17-directapply-frontier/', '/research/seed-openevo/study/capability-exploration/q17-directapply-frontier/', 'focus', '看懂 R127 和 R128 在同样 32 道题上到底差多少', '先看到训练曲线虽然从 76.1 掉到 48.9，但同题重测只有 63.58 → 59.41、完全做对 10 题 → 8 题，因此不能直接说模型整体遗忘', '这 32 道诊断题当时与 final 隔离；后来 final 已单独完成，但本页仍只支持 R127→R128 的局部判断，不能外推整条训练轨迹', 'R160 已完成；本页保留为历史同题诊断，并把最终状态结果交给 DirectApply 完整曲线 / final 页面', '[data-q17-advisor-diagnostics] .lede', { maxInteractive: 4, maxHeadings: 1, maxTextChars: 760 }),
  c('capability-sd-lora-scaling', '/research/seed-openevo/study/capability-exploration/sd-lora-scaling/', '/research/seed-openevo/study/capability-exploration/sd-lora-scaling/', 'narrative', '理解为什么 SD-LoRA 随历史 component 累积而越来越慢', '先看到同一 94-step workload 下，历史 component 从 1 增到 148 时更新时间从 44.05 秒增到 969.17 秒，增长主要来自 forward/backward', '这是当前 Vanilla SD-LoRA 实现的计算扩展性证据；不证明哪种替代算法最好，也不能单独证明持续学习遗忘', '先看 Vanilla SD-LoRA 一轮机制，再回到 DirectApply 完整分析或继续研究怎样在保持科学语义时降低这项计算成本', '[data-sd-lora-scaling] .scaling-hero__result', { maxInteractive: 3, maxHeadings: 1, maxTextChars: 760 }),

  c('capability-stage1-previous', '/research/seed-openevo/study/capability-exploration/stage1-previous/', '/research/seed-openevo/study/capability-exploration/stage1-previous/', 'reference', '理解旧 Stage 1 的历史设置和证据', '先知道这是旧实验记录以及与当前设计的区别', '历史记录不能当当前合同', '返回当前实验或查看历史证据'),
  c('capability-stage1-evolution', '/research/seed-openevo/study/capability-exploration/stage1-evolution/', '/research/seed-openevo/study/capability-exploration/stage1-evolution/', 'narrative', '理解 Stage 1 为什么发生设计变化', '先看到现实问题与对应修订', '工程便利不能偷偷改变科学语义', '进入后继实验'),
  c('capability-stage2-window', '/research/seed-openevo/study/capability-exploration/stage2-256-window/', '/research/seed-openevo/study/capability-exploration/stage2-256-window/', 'focus', '理解旧 Stage 2 为什么没有触发参数更新', '先看到成功轨迹存在但门槛未满足', '未更新参数不等于模型完全没有成功', '查看门槛证据或后继设计'),
  c('capability-stage2-ceiling', '/research/seed-openevo/study/capability-exploration/stage2-ceiling/', '/research/seed-openevo/study/capability-exploration/stage2-ceiling/', 'focus', '理解 7B Ceiling 实验的主要结果', '先看到最终测试结果与持续参数更新事实', 'SEED 数字只是参考而非本地配对对照', '查看完整证据和参数分析'),
  c('capability-stage2-analysis', '/research/seed-openevo/study/capability-exploration/stage2-7b-analysis/', '/research/seed-openevo/study/capability-exploration/stage2-7b-analysis/', 'focus', '理解 7B 参数变化分析说明什么', '先看到参数结构的主要测量结果', '参数几何不能直接替代任务效果', '查看各项参数证据'),
  c('capability-successor', '/research/seed-openevo/study/capability-exploration/openevo-2-0/', '/research/seed-openevo/study/capability-exploration/openevo-2-0/', 'focus', '快速判断 3B 与 1.7B 后继实验目前得到什么结果', '先看到 1.7B 已完成而 3B 尚无同口径最终结果', '共同规则与不同起点都要保留', '查看实验报告', '[data-research-orientation] [data-reader-purpose]'),
  c('capability-successor-exploration', '/research/seed-openevo/study/capability-exploration/openevo-2-0/exploration/', '/research/seed-openevo/study/capability-exploration/openevo-2-0/exploration/', 'narrative', '理解购物接口怎样经过排查和修订', '先看到失败现象与排查对象', '诊断历史不能被改写成事后必然路线', '按时间顺序继续阅读'),
  c('capability-successor-harness', '/research/seed-openevo/study/capability-exploration/openevo-2-0/harness-2-0/', '/research/seed-openevo/study/capability-exploration/openevo-2-0/harness-2-0/', 'reference', '理解共享购物接口怎样保证比较语义', '先看到接口允许什么、禁止教什么', '接口修复不能成为任务策略提示', '返回后继实验或查看诊断'),
  c('capability-successor-report', '/research/seed-openevo/study/capability-exploration/openevo-2-0/report/', '/research/seed-openevo/study/capability-exploration/openevo-2-0/report/', 'focus', '快速抓住 3B 与 1.7B 实验报告的结果与边界', '先看到 37.60、1/128、3B 未同口径收口以及 SEED 参考边界', 'SEED 是外部参考，不是本地配对对照', '查看实验方法', '[data-research-orientation] [data-reader-purpose]'),
  c('capability-mechanism', '/research/seed-openevo/study/capability-exploration/mechanism-1-0/', '/research/seed-openevo/study/capability-exploration/mechanism-1-0/', 'narrative', '理解参数机制实验怎样从同题观察进入因果检验并明确开始、比较和停止', '先看到同题诊断提示任务能力重新分配，再进入参数因果实验生命周期', '上游同题观察不是 M1-A/B 因果结果；开始/停止/授权边界本身仍是科学内容', '进入一次购物任务或具体机制实验'),
  c('capability-text-memory', '/research/seed-openevo/study/capability-exploration/text-memory/', '/research/seed-openevo/study/capability-exploration/text-memory/', 'narrative', '理解 Text Memory 怎样整理购物经验、哪里失败以及如何独立验证下一代设计', '先知道短笔记的作用，并区分这份正式实验快照的失败记录与下一代待验证方案', 'R104 与 R122 的失败原因形态不同；保留旧笔记不等于更新成功；软件测试不等于模型 shadow 或 WebShop 收益', '比较历史案例，再查看下一代待验证方案和对应证据', '.tm-hero'),
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