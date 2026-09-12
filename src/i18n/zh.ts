// 站点 UI 文案 —— 中文 (默认 locale)。
// 模型名、论文标题、benchmark 名和必要技术缩写保留原样；通用界面词只输出中文。
export const zh: Messages = {
  site: {
    name: '模型图谱',
    fullName: '智能体基础模型图谱',
    tagline: 'SEED 基准上的 OpenEvo 研究工作台',
    titleSuffix: '智能体基础模型图谱 · SEED × OpenEvo 研究工作台',
    defaultDescription: '在 SEED 的 ALFWorld 与 WebShop 基准上理解基础模型、复现实验、评估 OpenEvo，并用轨迹、分数和失败证据设计改进。',
    skipLink: '跳到主要内容',
    backHome: '返回首页',
  },
  nav: {
    home: '选择入口',
    models: '模型',
    families: '家族',
    compare: '对比',
    papers: '论文',
    mainNav: '主导航',
    openMenu: '打开菜单',
    toggleTheme: '切换深色模式',
    toggleDarkTheme: '切换到深色模式',
    toggleLightTheme: '切换到浅色模式',
    switchLang: '英文',
    switchLangLabel: '切换到英文',
    dataStatus: '数据状态',
    workspace: '开始研究',
    guide: '学习指南',
    methodology: '方法说明',
    search: '搜索',
    searchTitle: '全站搜索',
    searchPlaceholder: '搜索模型、alias、厂商、家族或论文…',
    noSearchResults: '没有匹配结果。',
    searchModel: '模型',
    searchPaper: '论文',
    searchFamily: '家族',
    searchGuide: '指南',
    closeSearch: '关闭搜索',
    commandHint: '按 Esc 关闭 · Cmd/Ctrl + K 打开',
  },
  footer: {
    identity: '智能体基础模型图谱',
    motto: '数据优先，证据先行。',
  },
  guide: {
    pageTitle: '学习指南', title: '如何使用研究工作台', lede: '从研究问题出发，逐步形成有证据、可复核的模型决策。', steps: ['先选择研究模式：严格复现、方法复现、现代化重跑或全新实验。', '明确论文、角色、训练方式、资源、开放性和复现约束。', '阅读候选模型的进入理由、风险和待核验项，再加入候选或对比。', '导出决策记录，保留任务、候选、比较和证据上下文。'], note: '硬件档位是粗粒度研究元数据，不是精确显存计算器。'
  },
  methodology: {
    pageTitle: '数据方法', title: '数据、缺失值与证据等级', lede: '公共页面展示事实；研究工作台解释这些事实对当前任务意味着什么。', sections: [{ title: '缺失值语义', body: 'not_disclosed（官方未公开）、not_applicable（不适用）、not_reported（来源未报告）、not_verified（尚未核验）、conflicting_evidence（来源冲突）、not_published（尚未发布）和 unavailable（来源不可用）都是数据状态，不会被转换成 false、0 或确定事实。' }, { title: '证据等级', body: '字段级 supports 关系优先连接到官方来源；论文、代码和运行记录分别保留来源类型与核验日期。每个保留未知值都必须能回到来源说明或 evidence_note。' }, { title: '推荐边界', body: '候选排序是任务内的辅助排序，不是综合性能排行榜；明确冲突才会阻塞，其他未知事实会进入条件候选或待核验区。' }]
  },
  landscape: {
    kicker: 'Landscape',
    title: '模型供应层，一眼看清',
    note: '时间 × 推理硬件；点大小代表参数规模',
    chartHint: '形状区分 dense / MoE；边框区分证据状态',
    d3Hint: '可访问的 SVG 视图：与正式图表共享同一数据适配层',
    chartAria: '按发布日期和推理硬件展示模型的散点图',
    openPrototype: '探索 Landscape →',
    legendNote: '未知参数不会被当成 0：使用固定小点，并在提示信息中标记待核验。',
    prototypeTitle: 'Landscape 交互探索',
    prototypeLede: '使用正式总览与可访问的 SVG 视图探索同一份模型供应数据。',
    engineLabel: '选择图表引擎',
  },
  modelsIndex: {
    pageTitle: '模型浏览器',
    lede: '按厂商、架构、模型类型、开放性和研究可用性（是否适合当前实验约束）组合筛选。未知或未核验不代表“不支持”。',
  },
  families: {
    pageTitle: '模型家族',
    title: '模型家族与代际',
    lede: '按厂商 → 家族 → 官方代际名 → 具体模型展开。页面不假设每个厂商都有连续的第 1、2、3 代。',
    checkpointUnit: '个模型',
    filterLabel: '家族时间线筛选',
    current: '当前代',
    filters: { all: '全部', current: '只看当前代', paper: '只看论文采用', open: '只看开放权重' },
  },
  compare: {
    pageTitle: '模型对比',
    title: '横向对比模型',
    lede: '最多选择 5 个具体模型；缺失值显示为具体核验状态，不强行填补。',
    selectKicker: '选 2–5 个',
    selectTitle: '选择模型',
    selected: '已选',
    minTwo: '(至少选 2 个)',
    empty: '请选择 2–5 个模型以启用对比。',
    dimension: '维度',
    onlyDifferences: '只看差异',
    allFields: '显示全部字段',
    noDifferences: '当前选择的模型在这些字段上没有差异。',
    searchLabel: '搜索模型',
    searchPlaceholder: '按名称、厂商或家族搜索…',
    noMatches: '没有匹配的模型。',
    diff: '存在差异',
    onlyImpacts: '只看影响研究选择',
    onlyUnknown: '只看未核验',
    researchImpact: '研究影响',
    copyMarkdown: '复制 Markdown',
    downloadCsv: '下载 CSV',
    copyLink: '复制分享链接',
    copied: '已复制',
    downloaded: '已下载',
    impactLabels: { generation: '代际或发布时间不同，直接比较需要说明时间差。', checkpoint: 'checkpoint 或上下文不同，复现实验变量会改变。', access: '访问方式不同，可能改变本地权重实验路径。', license: '许可证边界不同，需要单独复核分发条件。', training: '训练能力不同，LoRA / SFT / RL 实验不能直接等同。', hardware: '硬件档位不同，资源预算与运行方式需要重新核验。', evidence: '证据状态不同，较弱记录需要优先核验。' },
  },
  compareGroups: {
    identity: '基本信息',
    architecture: '架构与规模',
    access: '访问方式',
    openness: '开放性与许可证',
    training: '训练与微调',
    runtime: '运行时',
    hardware: '硬件',
    adoption: '论文采用',
    reproducibility: '可复现性',
    evidence: '证据状态',
  },
  papersIndex: {
    pageTitle: '论文采用',
    title: '自进化智能体论文',
    lede: '论文记录单独维护，通过模型 ID 与供应层建立关系。角色比单一“使用了某模型”更重要。',
    matrixTitle: '论文—模型矩阵',
    relationsUnit: '个模型关系',
    matrixPaper: '论文',
  },
  detail: {
    overview: '一眼概览',
    positioning: '模型定位',
    architecture: '架构',
    parameters: '参数',
    activeParams: '激活参数',
    expertCount: '专家数',
    expertsPerToken: '每 token 专家',
    context: '上下文长度',
    modalities: '模态',
    openWeights: '开放权重',
    baseCheckpoint: '基础权重',
    finetuningAllowed: '允许微调',
    derivativeAllowed: '允许衍生',
    commercialAllowed: '允许商用',
    license: '许可证',
    accessTitle: '访问与分发',
    weightsStatus: '权重状态',
    weightsReleasedAt: '完整权重日期',
    apiStatus: 'API 状态',
    apiModelIds: 'API 模型 ID',
    productStatus: '产品状态',
    productNames: '产品入口',
    opennessClass: '开放性分类',
    customLicense: '自定义许可证',
    derivativeDistribution: '衍生分发',
    commercialUse: '商业使用',
    conditions: '许可证条件',
    reproducibilityTitle: '复现与版本固定',
    modelRevision: '模型版本号',
    preservedReasoning: '保留推理历史',
    reproducibilityNotes: '复现说明',
    strengthsTitle: '专长与研究可用性',
    hardwareTitle: '硬件档位',
    inference: '推理',
    fullSft: '全参数 SFT',
    adoptionTitle: '论文采用',
    noAdoption: '暂无论文采用记录。没有记录不等于没有使用。',
    weightUpdatedSuffix: ' · 更新权重',
    totalActive: '总计 / {active}B 激活',
    tokensSuffix: ' token',
    descriptionSuffix: '的架构、开放性、研究可用性和证据来源。',
    unresolvedTitle: '未核验字段',
    unresolvedBody: '这些字段没有被填成猜测值；请回到来源或模型卡逐项核验。',
    noUnresolved: '关键字段均已填入具体值或明确状态。',
    researchSummaryTitle: '研究摘要',
    suitableFor: '适合',
    notSuitableFor: '不适合 / 限制',
    retrieval: '获取方式',
    hardwareSummary: '硬件档位',
    paperAdoptionSummary: '论文采用',
    reproRisk: '复现风险',
    evidenceState: '证据状态',
    pendingVerification: '部分关键事实待核验',
    noExplicitLimit: '暂无明确限制证据',
    noPaperAdoption: '暂无论文采用记录',
    accessLadderTitle: '获取与分发阶梯',
    productSurface: '产品',
    apiSurface: 'API',
    weightsSurface: '权重',
    baseSurface: '基座',
    finetuneSurface: '允许微调',
    derivativeSurface: '允许衍生分发',
    unresolvedCount: '{count} 个关键字段待核验',
    other: '其他',
    research: {
      inference: '推理',
      lora: 'LoRA',
      sft: 'SFT',
      rl: 'RL',
      transformers: 'Transformers',
      vllm: 'vLLM',
      sglang: 'SGLang',
      verl: 'veRL 配方',
    },
  },
  paperDetail: {
    infoTitle: '论文信息',
    evolutionTargets: '进化对象',
    benchmarks: '基准测试',
    category: '类别',
    modelRelations: '模型关系',
    relationsUnit: '个',
    rolesTitle: '模型角色',
    paperLink: '论文链接 ↗',
    codeLink: '代码链接 ↗',
    weightUnknown: '权重更新：未报告',
    weightUpdated: '更新了权重',
    weightNotUpdated: '未更新权重',
    relationError: '关系错误',
    descriptionSuffix: '的模型角色、进化目标和来源证据。',
    reproductionEntryTitle: '从这篇论文开始研究',
    reproductionEntryHint: '选择研究模式后，论文和原始模型会进入工作台上下文。',
    strictReproduction: '严格复现',
    methodReproduction: '方法复现',
    modernRerun: '现代化重跑',
    roleDiagramTitle: '模型角色拓扑',
    roleDiagramHint: '这里只展示数据明确记录的角色与模型关系，不推断未记录的 workflow 边。',
    reproducibilityTitle: '复现状态',
    codeStatus: '代码',
    checkpointStatus: '权重',
    configStatus: '配置',
    environmentStatus: '环境',
    available: '可用',
    partial: '部分可用',
    unavailable: '不可用',
    notVerified: '尚未核验',
    reported: '已报告',
    notReported: '未报告',
    reproNotFilled: '尚未补充结构化复现记录。',
    reproNotes: '复现备注',
  },
  evidence: {
    title: '证据',
    body: '链接来自结构化生产数据；每条来源都保留来源类型、核验日期和证据说明。',
    open: '打开 ↗',
    dataStatus: '数据状态',
    publisher: '发布方',
    publishedAt: '发布日期',
    revision: '版本',
    supports: '支持字段',
    locator: '定位',
    notes: '备注',
    claimCoverage: '字段证据覆盖',
    unresolvedFields: '未核验字段',
    claimTitle: '事实与证据',
    claimBody: '每个判断都尽量连接到支持它的来源；没有字段级关联时，不把来源列表当成直接证明。',
    claimEvidence: '支持来源',
    noClaimLinks: '暂无字段级证据关联；来源列表仍保留在数据记录中。',
    levelOfficial: '一手来源直接支持',
    levelPaper: '论文或代码来源',
    levelSecondary: '二手或运行记录',
    levelUnsupported: '尚未分类',
  },
  dataStatus: {
    pageTitle: '数据状态',
    lede: '显示模型数据的新鲜度、覆盖情况和当前代缺口。这里的告警不会把证据缺口伪装成确定事实。',
    models: '模型记录',
    recent: '近 30 天核验',
    stale: '过期记录',
    partial: '部分 / 待核验',
    verified: '已核验',
    vendors: '厂商覆盖',
    vendor: '厂商',
    latestRelease: '最新发布',
    currentGeneration: '官方当前代',
    catalogChecked: '目录核验日期',
    claimStatus: '声明状态',
    unresolved: '未解决',
    catalogSource: '目录来源',
    present: '已覆盖',
    missing: '缺失',
    issues: '告警',
    noIssues: '当前没有阻断性告警。',
    staleNote: '过期只表示需要重新核验，不等于模型不可用。',
    semanticGaps: '语义缺口',
    semanticState: '状态',
    fields: '字段数',
    severity: '严重级别',
    record: '记录',
    field: '字段',
    issueKind: '问题类型',
    source: '来源',
    flagship: '当前旗舰 ID',
    openWeightApi: '开放权重 / API',
    openWeight: '开放权重',
    api: 'API',
  },
  selector: {
    mode: '实验方式',
    task: '任务方向',
    resource: '资源条件',
    goal: '优先目标',
    candidateTitle: '候选模型组合',
    candidateUnit: '个候选',
    disclaimer: '这是基于元数据和用户条件的规则筛选，不是性能排行榜；未核验条件会被明确保留。',
    view: '查看 →',
    modes: {
      inference: '仅推理',
      lora: 'LoRA / PEFT',
      sft: 'SFT',
      full_sft: '全参数训练',
      rl: 'RL / 自进化参数训练',
      harness: '外部记忆与工具编排',
    },
    tasks: {
      general: '通用智能体',
      webshop: 'WebShop 网页导航',
      alfworld: 'ALFWorld',
      coding: '代码智能体',
      research: '搜索与深度研究',
      math: '数学推理',
      gui: '图形界面与多模态智能体',
      chinese: '中文任务',
      multilingual: '多语言任务',
    },
    resources: {
      cpu_mac: 'CPU / Mac',
      '16gb': '16GB GPU',
      '24gb': '24GB GPU',
      '48gb': '48GB GPU',
      '80gb': '80GB GPU',
      multi_gpu: '多卡 GPU',
      api_only: '仅 API',
    },
    goals: {
      comparability: '论文可比性',
      current: '当前代模型',
      low_cost: '低成本',
      open_weights: '开放权重',
      chinese: '中文能力',
      tool_use: '工具调用',
      rl: '容易进行 RL',
    },
  },
  explorer: {
    searchPlaceholder: '搜索模型、家族、专长…',
    searchLabel: '搜索模型',
    filter: '筛选',
    quickOpenWeights: '开放权重',
    quickLora: '可 LoRA',
    quickRl: '适合 RL',
    quickSingleGpu: '单卡可运行',
    quickCurrent: '当前代',
    quickPaperUse: '有论文采用',
    sort: '排序',
    sortRelease: '最新发布',
    sortParams: '参数规模',
    sortName: '名称',
    vendor: '厂商',
    family: '家族',
    generation: '代际',
    architecture: '架构',
    checkpoint: '模型类型',
    modality: '模态',
    minParams: '参数下限',
    specialization: '专长',
    openWeights: '开放权重',
    finetuning: '允许微调',
    lora: '可 LoRA',
    rl: '适合 RL',
    current: '当前代',
    baseCheckpoint: '基座权重',
    singleGpu: '单卡可运行',
    toolUse: '工具调用',
    coding: '代码能力',
    paperUse: '论文采用',
    hardwareTier: '硬件档位',
    clearAll: '清除全部筛选',
    allVendors: '全部厂商',
    allFamilies: '全部家族',
    allGenerations: '全部代际',
    allArchitectures: '全部架构',
    allCheckpoints: '全部类型',
    allSpecializations: '全部专长',
    any: '不限',
    yes: '是',
    no: '否',
    have: '有',
    haveNot: '无',
    showing: '显示',
    of: '/',
    modelsUnit: '个模型',
    withPapers: '个模型有论文采用记录',
    paramsUnknown: '参数待核验',
    openWeightsTag: '开放权重',
    evidenceStatus: '证据状态',
    compare: '加入对比',
    compareAria: '将 {name} 加入模型对比',
    hasPaper: '有论文采用',
    noPaper: '暂无论文采用',
    emptyTitle: '没有匹配结果',
    emptyBody: '尝试清除筛选或放宽条件。',
    other: '其他',
    activeFilters: '当前筛选',
    viewLabel: '模型视图',
    views: { decision: '决策', data: '数据', timeline: '时间线' },
    model: '模型',
    release: '发布时间',
    parameters: '参数',
    feasibility: '可行性',
    researchSuitability: '研究适配',
    comparability: '论文可比性',
    reproducibility: '可复现性',
    evidenceQuality: '证据完整度',
    levelHigh: '高',
    levelMedium: '中',
    levelLow: '低',
    levelUnknown: '待核验',
    taskFitLabel: '当前任务匹配',
    taskFitPrompt: '设定研究任务后显示适配度',
    fitHigh: '高匹配',
    fitConditional: '条件匹配',
    fitExplore: '探索',
    fitBlocked: '阻塞',
    fitHighHint: '已知约束均有支持证据。',
    fitConditionalHint: '没有明确冲突，但仍有事实待核验。',
    fitExploreHint: '适合继续探索，当前证据或可比性有限。',
    fitBlockedHint: '存在明确约束冲突，不进入正式候选。',
  },
  modalities: {
    text: '文本',
    image: '图像',
    audio: '音频',
    video: '视频',
  },
  compareRows: {
    vendor: '厂商',
    familyGen: '家族 / 代际',
    release: '发布时间',
    architecture: '架构',
    totalParams: '总参数',
    activeParams: '激活参数',
    context: '上下文',
    modalities: '模态',
    specializations: '专长',
    checkpoint: '模型类型',
    openWeights: '开放权重',
    license: '许可证',
    loraSftRl: 'LoRA / SFT / RL',
    inferenceTier: '推理档位',
    apiStatus: 'API 状态',
    weightsStatus: '权重状态',
    baseCheckpoint: '基座权重',
    finetuning: '允许微调',
    derivative: '允许衍生分发',
    commercial: '允许商业使用',
    transformers: 'Transformers',
    vllm: 'vLLM',
    sglang: 'SGLang',
    verl: 'veRL 配方',
    loraTier: 'LoRA 档位',
    sftTier: 'SFT 档位',
    rlTier: 'RL 档位',
    paperRoles: '论文角色',
    apiPin: 'API 版本可固定',
    tokenizer: 'Tokenizer 公开',
    config: 'Config 公开',
    chatTemplate: 'Chat template 公开',
    sourceCount: '来源数量',
    dataStatus: '数据状态',
  },
  familyUnits: {
    checkpoints: '个模型',
  },
  notFound: {
    title: '页面不存在',
    body: '返回首页继续探索。',
    back: '回到选择入口 →',
  },
  v2: {
    home: {
      heroEyebrow: '模型研究台',
      heroTitle: '为你的智能体实验，选择合适且可复现的基础模型。',
      heroLede: '把论文目标、资源约束和优先目标变成一次可共享的研究任务；在候选模型、证据来源和对比托盘之间走一条可核验的路径。',
      heroCta: '开始设计实验',
      exampleKicker: '研究任务示例',
      exampleTitle: '自进化代码智能体 · LoRA · 24GB',
      exampleBody: '先锁定“权重更新 = LoRA、单卡 24GB、开放权重”的约束，再从 18 个模型中筛出 5 个候选，其中 3 个证据链较完整。',
      exampleModels: '个模型',
      exampleCandidates: '个候选',
      exampleEvidence: '个证据较完整',
      entryReproduce: '复现一篇论文',
      entryChoose: '为新实验选择模型',
      entryReplace: '查找某个模型的替代品',
      entryLearn: '学习基础模型概念',
      pathsKicker: '三条研究路径',
      pathsTitle: '按你的复现目标选路径',
      pathStrictTag: '严格复现',
      pathStrict: '保持原论文模型与环境',
      pathStrictBody: '尽量用论文同一模型 ID 和 checkpoint，控制环境变量，只替换非模型因素（如数据集版本、随机种子）。',
      pathMethodTag: '方法复现',
      pathMethod: '换模型但控制关键变量',
      pathMethodBody: '在等效或更新一代模型上验证方法是否仍然成立；记录模型差异对结果的影响。',
      pathModernTag: '现代化重跑',
      pathModern: '用当前代模型重新验证方法',
      pathModernBody: '把旧方法放到当前开放权重或 API 旗舰上重跑，看结论是否随代际迁移而失效或增强。',
      scenariosKicker: '常用研究场景',
      scenariosTitle: '从场景直接开始',
      scenariosNote: '点击预填研究工作台',
      scenarioLora: '单张 24GB GPU 做 LoRA',
      scenarioLoraLede: '权重更新 = LoRA，单卡 24GB，只考虑开放权重。',
      scenarioRl: '多卡 RL 或自进化训练',
      scenarioRlLede: '权重更新 = RL，多卡，开放权重优先。',
      scenarioOpenWeight: '找开放权重代码模型',
      scenarioOpenWeightLede: '只看开放权重，适合代码/工具调用实验。',
      scenarioQwen: '复现使用 Qwen2.5 的论文',
      scenarioQwenLede: '严格复现路径，优先中文能力。',
      scenarioReplace: '将旧模型替换为当前代',
      scenarioReplaceLede: '现代化重跑，关注当前代模型。',
      scenarioApi: '比较 API 与本地模型',
      scenarioApiLede: '低成本优先，对比 API 和本地候选。',
      scenarioAction: '预填工作台',
      recentChangesKicker: '最近模型变化',
      recentChangesTitle: '按发布时间查看最近记录',
      recentChangesNote: '这是数据集中的发布时间流，不等同于厂商实时动态。',
      recentRelease: '发布时间',
      recentSources: '个来源',
      familiesKicker: '最近模型变化',
      familiesTitle: '家族旗舰变化',
      familiesCta: '查看全部家族 →',
      familyFlagship: '旗舰',
      familyOpenWeight: '开放权重',
      overviewKicker: '模型空间',
      overviewTitle: '模型空间概览',
      overviewCta: '打开 Landscape →',
      overviewBody: '按发布时间、推理硬件、参数规模和证据状态浏览全部模型，先看供应层，再叠论文采用层。',
      statModels: '模型总数',
      statFamilies: '家族数',
      statOpenWeights: '开放权重数',
    },
  },
  workspace: {
    pageTitle: '研究工作台',
    title: '公共研究知识库 + 持久化研究工作台',
    lede: '设定研究任务，按约束筛选候选模型，把证据来源、对比清单和候选板串成一条可核验的路径。',
    constraintTitle: '研究约束',
    modeLabel: '实验方式',
    roleLabel: '模型角色',
    updateLabel: '权重更新',
    resourceLabel: '资源条件',
    priorityLabel: '优先目标',
    openWeightLabel: '只考虑开放权重',
    contextLabel: '目标上下文长度',
    accessModeLabel: '运行方式',
    setTask: '设定任务',
    clearTask: '清除任务',
    candidateTitle: '候选模型',
    candidateCount: '个候选',
    emptyCandidates: '调整左侧约束后，会列出满足条件的模型。',
    addToCompare: '加入对比',
    removeFromCompare: '移出对比',
    addCandidate: '加入候选',
    removeCandidate: '移出候选',
    evidenceTitle: '证据摘要',
    openness: '开放性',
    research: '研究可用性',
    hardware: '硬件档位',
    access: '访问',
    sources: '来源',
    noSource: '暂无来源',
    currentTask: '当前研究',
    editConstraints: '编辑约束',
    candidates: '候选',
    compare: '已选对比',
    compareTray: '对比托盘',
    openCompare: '打开对比 →',
    clearCompare: '清空',
    mobileNavLabel: '移动端工作台面板',
    mobileTask: '任务',
    mobileCandidates: '候选',
    mobileEvidence: '证据',
    mobileCompare: '对比',
    closeQuickView: '关闭快速查看',
    taskBuilder: {
      stepMode: '研究目标', stepReference: '参考论文与模型', stepMethod: '角色与更新方式',
      stepResource: '资源条件', stepAccess: '访问与复现', stepPriority: '排序偏好',
      stepOf: '第 {current} / {total} 步', next: '下一步', back: '上一步', finish: '设定研究任务',
      modeImplication: '这会影响模型如何进入基准、现代和资源候选区。',
      strictDesc: '尽量保持论文原始模型、checkpoint 和环境。', methodDesc: '保留方法结构，同时寻找可比的替代模型。',
      modernDesc: '允许换用当前代模型，重点是按核验日期可用的模型栈能否重跑。', newDesc: '从零定义实验，不绑定已有论文或原模型。',
      referenceRequired: '严格复现和方法复现需要先选论文、模型和角色。', referencePaper: '参考论文',
      referenceModel: '论文中的模型', referenceRole: '论文角色', referencePlaceholder: '请选择', referenceSelected: '已选择参考论文',
      noReferenceModels: '这篇论文没有可用的模型关系。', methodHint: '角色与训练方式是两件独立的事；未知不会自动变成否定。',
      resourceHint: '硬件档位来自粗粒度研究元数据，不是精确显存计算器。', gpuVram: '单卡显存（GB）', gpuCount: 'GPU 数量',
      quantization: '接受 4-bit / 8-bit 量化方案', runtimeTitle: '要求运行时', licenseTitle: '许可证约束',
      reproTitle: '复现约束', evidenceTitle: '证据策略', priorityHint: '顺序会影响候选排序；用上移、下移调整优先级。',
      addPriority: '加入排序', removePriority: '移出排序', priorityUp: '上移', priorityDown: '下移',
      summaryTitle: '任务摘要', summaryEmpty: '还没有设置研究任务。',
      pinnableRevision: 'API / 模型版本可固定', publicTokenizer: 'tokenizer 必须公开',
      publicConfig: 'config 必须公开', publicChatTemplate: 'chat template 必须公开',
      priorityTypeHint: '优先级是排序偏好，不是硬性筛选。',
    },
  },
  research: {
    modes: {
      strict: '严格复现',
      method: '方法复现',
      modern: '现代化重跑',
      new: '全新实验',
    },
    updates: {
      none: '不更新权重',
      lora: 'LoRA',
      sft: 'SFT',
      rl: '强化学习',
      unsure: '更新方式待定',
    },
    accessModes: {
      local: '必须本地运行',
      api: '允许 API 运行',
      either: '本地或 API',
    },
    evidencePolicies: {
      verified_preferred: '优先已核验证据',
      verified_only: '仅接受已核验证据',
      allow_unknown: '允许未知状态',
    },
    bucketBaseline: '基准候选',
    bucketModern: '现代候选',
    bucketResource: '资源可行候选',
    bucketBaselineHint: '有论文采用记录，适合作为可比较的复现基准。',
    bucketModernHint: '当前代模型，适合现代化重跑与新实验。',
    bucketResourceHint: '在你的资源约束下可行，但证据或当前性较弱。',
    whyRecommended: '推荐理由',
    mainRisks: '主要风险',
    papersUsed: '篇论文采用',
    reasons: {
      open_weights: '开放权重',
      fits_gpu: '显存可行',
      fits_update: '支持目标更新方式',
      role_match: '角色能力匹配',
      paper_used: '有论文采用',
      paper_comparable: '多篇论文可比较',
      current_gen: '当前代模型',
      low_cost: '低资源门槛',
      chinese: '中文专长',
      tool_use: '工具调用专长',
      baseline_repro: '适合复现基准',
      modern_repro: '适合现代化重跑',
    context_ok: '上下文达标',
    },
    risks: {
      weights_closed: '权重不开放',
      finetune_prohibited: '禁止微调',
      context_short: '上下文偏短',
      gpu_tight: '显存偏紧',
      no_paper: '无论文采用记录',
      not_current: '非当前代',
      update_unverified: '更新方式未核验',
      legacy: '历史版本',
      evidence_unverified: '证据尚未完整核验',
      runtime_missing: '所需运行时不满足',
      license_restricted: '许可证存在限制',
      reproducibility_unverified: '复现条件尚未完整核验',
    },
    excludedTitle: '未进入候选',
    excludedHint: '明确冲突会阻塞；未知事实只会进入待核验状态，不会被当成否定。',
    excludedBlocked: '明确冲突',
    excludedPending: '待核验',
    memo: {
      title: '决策备忘录',
      export: '导出 Markdown',
      download: '下载 .md',
      downloadJson: '下载 JSON',
      saveSnapshot: '保存研究快照',
      snapshotSaved: '快照已保存',
      snapshotChanged: '自该快照以来有 {count} 项研究事实发生变化',
      snapshotField: '字段',
      snapshotPrevious: '当时值',
      snapshotCurrent: '当前值',
      snapshotChecked: '新核验日期',
      copy: '复制',
      copied: '已复制',
      dataRevision: '数据版本',
      empty: '先设定任务并加入候选，再生成决策备忘录。',
      sectionTask: '研究任务',
      sectionCandidates: '候选模型',
      sectionCompare: '对比集合',
      sectionRisks: '风险与未核验项',
      sectionNotSelected: '未选择模型及原因',
      sectionEvidence: '证据来源包',
      unverified: '未核验项',
    },
    substitute: {
      title: '替换分析',
      selectBase: '选择要替换的原模型',
      candidates: '现代替代候选',
      compare: '替换影响对比',
      field: '维度',
      original: '原模型',
      replacement: '替代模型',
      openness: '开放性',
      context: '上下文',
      hardware: '硬件档位',
      finetune: '微调许可',
      release: '发布时间',
      empty: '选一个原模型，查看同家族或同角色的现代替代。',
      noSubstitute: '暂无可比较的现代替代。',
      modeImpact: '当前研究模式下的替换影响',
      impact: '影响',
      impactDimensions: { generation: '模型代际', releaseDate: '发布时间', checkpoint: 'Checkpoint 类型', architecture: '架构', totalParameters: '总参数量', activeParameters: '激活参数量', context: '上下文', openWeights: '开放权重', apiStatus: 'API 状态', baseCheckpoint: 'Base checkpoint', finetuning: '微调许可', derivative: '衍生分发', license: '许可证', runtime: '运行时支持', inferenceHardware: '推理硬件', trainingHardware: '训练硬件', apiPin: 'API 版本固定', chatTemplate: 'Chat template', tokenizer: 'Tokenizer', config: 'Config', paperRole: '论文采用角色' },
      severity: { none: '无变化', low: '低', medium: '中', high: '高', unknown: '未知' },
      confidence: { direct: '直接事实', derived: '派生判断', unknown: '尚无证据' },
      effect: { none: '不改变该维度', operational: '需要重新核验运行条件', requires_recalibration: '需要重新校准实验', breaks_direct_comparison: '会破坏直接可比性', unknown: '影响尚无法判断' },
      impactCodes: { generation_changed: '模型代际变化会改变比较基线。', release_date_changed: '发布时间变化会改变时间窗口。', checkpoint_changed: 'Checkpoint 变化可能改变提示格式与训练初始化。', checkpoint_semantics_changed: 'Base、Instruct 或 Thinking 语义变化会改变输入与优化条件；需匹配 checkpoint 后再比较。', architecture_changed: '架构变化会改变推理与训练行为。', architecture_dense_moe_changed: 'Dense 与 MoE 的路由和激活参数不同；需同时记录架构、激活参数和路由条件，不能只比较总参数。', total_parameters_changed: '总参数变化会改变规模与资源预算。', active_parameters_changed: '激活参数变化会改变 MoE 推理成本。', context_changed: '上下文变化会改变长上下文实验条件。', context_budget_changed: '上下文预算变化会改变记忆/长上下文条件；应固定预算或在结论中报告差异。', weights_changed: '开放性变化会改变本地权重实验路径。', access_local_path_changed: '本地权重与 API 路径不同，会改变版本固定、延迟和权重更新条件。', api_status_changed: 'API 可用性变化会改变部署与重复调用路径。', base_checkpoint_changed: 'Base 可用性变化会改变训练起点。', finetuning_changed: '微调许可变化会改变权重更新实验。', derivative_changed: '衍生分发变化会改变成果发布边界。', license_changed: '许可证变化需要单独复核法律与分发条件。', runtime_changed: '运行时支持变化会改变工程实现路径。', inference_hardware_changed: '推理硬件档位变化需要重新核验资源。', training_hardware_changed: '训练硬件档位变化需要重新核验资源。', api_pin_changed: 'API 版本可固定性变化会影响重复调用。', chat_template_changed: 'Chat template 变化会影响输入格式复现。', tokenizer_changed: 'Tokenizer 变化会影响切分与训练复现。', config_changed: 'Config 变化会影响架构和推理配置复现。', paper_role_changed: '论文采用角色不同，不能直接假定研究职责相同。' },
    },
  },
  format: {
    unknown: '待核验',
    yes: '是',
    no: '否',
    semanticStatus: {
      not_disclosed: '官方未公开',
      not_applicable: '不适用',
      not_reported: '未报告',
      not_verified: '尚未核验',
      conflicting_evidence: '证据冲突',
      not_published: '未发布',
      unavailable: '来源不可用',
    },
    status: {
      verified: '已核验',
      partial: '部分核验',
      demo: '归档示例',
      unknown: '待核验',
    },
    tier: {
      cpu_mac: 'CPU / Mac',
      '16gb': '16GB GPU',
      '24gb': '24GB GPU',
      '48gb': '48GB GPU',
      '80gb': '80GB GPU',
      multi_gpu: '多卡 GPU',
      api_only: '仅 API',
      unknown: '待核验',
    },
    lifecycle: {
      active: '活跃',
      legacy: '历史版本',
      preview: '预览版',
      unknown: '待核验',
    },
    sourceType: {
      official_model_card: '官方模型卡',
      official_docs: '官方文档',
      official_announcement: '官方发布',
      official_weights: '官方权重',
      official_license: '官方许可证',
      official_api_docs: '官方 API 文档',
      official_code: '官方代码',
      official_benchmark: '官方基准测试',
      third_party_runtime: '第三方运行时',
      technical_report: '技术报告',
      paper: '论文',
      code: '代码仓库',
      benchmark: '基准测试',
      demo_record: '归档示例',
    },
    architecture: {
      dense: '稠密',
      moe: '混合专家（MoE）',
      other: '其他',
    },
    checkpoint: {
      base: '基础',
      instruct: '指令',
      thinking: '思考',
      coder: '代码',
      vision: '视觉',
    },
    specialization: {
      general: '通用',
      reasoning: '推理',
      'tool-use': '工具调用',
      agent: '智能体',
      coding: '代码',
      chat: '对话',
      chinese: '中文',
      multilingual: '多语言',
      multimodal: '多模态',
      vision: '视觉',
      mathematics: '数学',
      'long-context': '长上下文',
      'low-latency': '低延迟',
      'lower-cost': '低成本',
    },
    role: {
      actor: '执行者',
      baseline: '基线',
      critic: '批评者',
      optimizer: '优化器',
      policy: '策略',
      reflector: '反思器',
      teacher: '教师模型',
      analyzer: '分析器',
      'reward-model': '奖励模型',
      judge: '评判器',
      evaluator: '评估器',
    },
    category: {
      'multi-agent': '多智能体',
      'prompt-evolution': '提示词演化',
      reasoning: '推理',
      reflection: '反思',
      'self-evolving-agent': '自进化智能体',
      'tool-use': '工具调用',
      'web-agent': '网页智能体',
    },
    evolutionTarget: {
      'actor-policy': '执行策略',
      'agent-evaluation': '智能体评测',
      'app-interaction-policy': '应用交互策略',
      'experience-memory': '经验记忆',
      'memory-reflection': '记忆反思',
      'multi-agent-roles': '多智能体角色',
      'multimodal-policy': '多模态策略',
      'planning-policy': '规划策略',
      'prompt-evolution': '提示词演化',
      'prompt-tuning': '提示词调优',
      reflection: '反思',
      'reflection-memory': '反思记忆',
      'self-correction': '自我纠错',
      'skill-library': '技能库',
      'social-simulation': '社会模拟',
      'tool-use': '工具调用',
      'web-agent-policy': '网页智能体策略',
      'workflow-evolution': '工作流演化',
    },
  },
};

export type Messages = {
  site: {
    name: string;
    fullName: string;
    tagline: string;
    titleSuffix: string;
    defaultDescription: string;
    skipLink: string;
    backHome: string;
  };
  guide: { pageTitle: string; title: string; lede: string; steps: string[]; note: string };
  methodology: { pageTitle: string; title: string; lede: string; sections: Array<{ title: string; body: string }> };
  nav: {
    home: string;
    models: string;
    families: string;
    compare: string;
    papers: string;
    mainNav: string;
    openMenu: string;
    toggleTheme: string;
    toggleDarkTheme: string;
    toggleLightTheme: string;
    switchLang: string;
    switchLangLabel: string;
    dataStatus: string;
    workspace: string;
    guide: string;
    methodology: string;
    search: string;
    searchTitle: string;
    searchPlaceholder: string;
    noSearchResults: string;
    searchModel: string;
    searchPaper: string;
    searchFamily: string;
    searchGuide: string;
    closeSearch: string;
    commandHint: string;
  };
  footer: { identity: string; motto: string };
  landscape: {
    kicker: string;
    title: string;
    note: string;
    chartHint: string;
    d3Hint: string;
    chartAria: string;
    openPrototype: string;
    legendNote: string;
    prototypeTitle: string;
    prototypeLede: string;
    engineLabel: string;
  };
  modelsIndex: { pageTitle: string; lede: string };
  families: { pageTitle: string; title: string; lede: string; checkpointUnit: string; filterLabel: string; current: string; filters: Record<'all' | 'current' | 'paper' | 'open', string> };
  compare: {
    pageTitle: string;
    title: string;
    lede: string;
    selectKicker: string;
    selectTitle: string;
    selected: string;
    minTwo: string;
    empty: string;
    dimension: string;
    onlyDifferences: string;
    allFields: string;
    noDifferences: string;
    searchLabel: string;
    searchPlaceholder: string;
    noMatches: string;
    diff: string;
    onlyImpacts: string;
    onlyUnknown: string;
    researchImpact: string;
    copyMarkdown: string;
    downloadCsv: string;
    copyLink: string;
    copied: string;
    downloaded: string;
    impactLabels: Record<'generation' | 'checkpoint' | 'access' | 'license' | 'training' | 'hardware' | 'evidence', string>;
  };
  compareGroups: { identity: string; architecture: string; access: string; openness: string; training: string; runtime: string; hardware: string; adoption: string; reproducibility: string; evidence: string };
  papersIndex: {
    pageTitle: string;
    title: string;
    lede: string;
    matrixTitle: string;
    relationsUnit: string;
    matrixPaper: string;
  };
  detail: {
    overview: string;
    positioning: string;
    architecture: string;
    parameters: string;
    activeParams: string;
    expertCount: string;
    expertsPerToken: string;
    context: string;
    modalities: string;
    openWeights: string;
    baseCheckpoint: string;
    finetuningAllowed: string;
    derivativeAllowed: string;
    commercialAllowed: string;
    license: string;
    accessTitle: string;
    weightsStatus: string;
    weightsReleasedAt: string;
    apiStatus: string;
    apiModelIds: string;
    productStatus: string;
    productNames: string;
    opennessClass: string;
    customLicense: string;
    derivativeDistribution: string;
    commercialUse: string;
    conditions: string;
    reproducibilityTitle: string;
    modelRevision: string;
    preservedReasoning: string;
    reproducibilityNotes: string;
    strengthsTitle: string;
    hardwareTitle: string;
    inference: string;
    fullSft: string;
    adoptionTitle: string;
    noAdoption: string;
    weightUpdatedSuffix: string;
    totalActive: string;
    tokensSuffix: string;
    descriptionSuffix: string;
    unresolvedTitle: string;
    unresolvedBody: string;
    noUnresolved: string;
    researchSummaryTitle: string;
    suitableFor: string;
    notSuitableFor: string;
    retrieval: string;
    hardwareSummary: string;
    paperAdoptionSummary: string;
    reproRisk: string;
    evidenceState: string;
    pendingVerification: string;
    noExplicitLimit: string;
    noPaperAdoption: string;
    accessLadderTitle: string;
    productSurface: string;
    apiSurface: string;
    weightsSurface: string;
    baseSurface: string;
    finetuneSurface: string;
    derivativeSurface: string;
    unresolvedCount: string;
    other: string;
    research: Record<'inference' | 'lora' | 'sft' | 'rl' | 'transformers' | 'vllm' | 'sglang' | 'verl', string>;
  };
  paperDetail: {
    infoTitle: string;
    evolutionTargets: string;
    benchmarks: string;
    category: string;
    modelRelations: string;
    relationsUnit: string;
    rolesTitle: string;
    paperLink: string;
    codeLink: string;
    weightUnknown: string;
    weightUpdated: string;
    weightNotUpdated: string;
    relationError: string;
    descriptionSuffix: string;
    reproductionEntryTitle: string;
    reproductionEntryHint: string;
    strictReproduction: string;
    methodReproduction: string;
    modernRerun: string;
    roleDiagramTitle: string;
    roleDiagramHint: string;
    reproducibilityTitle: string;
    codeStatus: string;
    checkpointStatus: string;
    configStatus: string;
    environmentStatus: string;
    available: string;
    partial: string;
    unavailable: string;
    notVerified: string;
    reported: string;
    notReported: string;
    reproNotFilled: string;
    reproNotes: string;
  };
  evidence: { title: string; body: string; open: string; dataStatus: string; publisher: string; publishedAt: string; revision: string; supports: string; locator: string; notes: string; claimCoverage: string; unresolvedFields: string; claimTitle: string; claimBody: string; claimEvidence: string; noClaimLinks: string; levelOfficial: string; levelPaper: string; levelSecondary: string; levelUnsupported: string };
  dataStatus: {
    pageTitle: string; lede: string; models: string; recent: string; stale: string; partial: string; verified: string;
    vendors: string; vendor: string; latestRelease: string; currentGeneration: string; catalogChecked: string; claimStatus: string; unresolved: string; catalogSource: string; present: string; missing: string; issues: string; noIssues: string; staleNote: string; semanticGaps: string; semanticState: string; fields: string; severity: string; record: string; field: string; issueKind: string; source: string; flagship: string; openWeightApi: string; openWeight: string; api: string;
  };
  selector: {
    mode: string;
    task: string;
    resource: string;
    goal: string;
    candidateTitle: string;
    candidateUnit: string;
    disclaimer: string;
    view: string;
    modes: Record<'inference' | 'lora' | 'sft' | 'full_sft' | 'rl' | 'harness', string>;
    tasks: Record<'general' | 'webshop' | 'alfworld' | 'coding' | 'research' | 'math' | 'gui' | 'chinese' | 'multilingual', string>;
    resources: Record<'cpu_mac' | '16gb' | '24gb' | '48gb' | '80gb' | 'multi_gpu' | 'api_only', string>;
    goals: Record<'comparability' | 'current' | 'low_cost' | 'open_weights' | 'chinese' | 'tool_use' | 'rl', string>;
  };
  explorer: {
    searchPlaceholder: string;
    searchLabel: string;
    filter: string;
    quickOpenWeights: string;
    quickLora: string;
    quickRl: string;
    quickSingleGpu: string;
    quickCurrent: string;
    quickPaperUse: string;
    sort: string;
    sortRelease: string;
    sortParams: string;
    sortName: string;
    vendor: string;
    family: string;
    generation: string;
    architecture: string;
    checkpoint: string;
    modality: string;
    minParams: string;
    specialization: string;
    openWeights: string;
    finetuning: string;
    lora: string;
    rl: string;
    current: string;
    baseCheckpoint: string;
    singleGpu: string;
    toolUse: string;
    coding: string;
    paperUse: string;
    hardwareTier: string;
    clearAll: string;
    allVendors: string;
    allFamilies: string;
    allGenerations: string;
    allArchitectures: string;
    allCheckpoints: string;
    allSpecializations: string;
    any: string;
    yes: string;
    no: string;
    have: string;
    haveNot: string;
    showing: string;
    of: string;
    modelsUnit: string;
    withPapers: string;
    paramsUnknown: string;
    openWeightsTag: string;
    evidenceStatus: string;
    compare: string;
    compareAria: string;
    hasPaper: string;
    noPaper: string;
    emptyTitle: string;
    emptyBody: string;
    other: string;
    activeFilters: string;
    viewLabel: string;
    views: { decision: string; data: string; timeline: string };
    model: string;
    release: string;
    parameters: string;
    feasibility: string;
    researchSuitability: string;
    comparability: string;
    reproducibility: string;
    evidenceQuality: string;
    levelHigh: string;
    levelMedium: string;
    levelLow: string;
    levelUnknown: string;
    taskFitLabel: string;
    taskFitPrompt: string;
    fitHigh: string;
    fitConditional: string;
    fitExplore: string;
    fitBlocked: string;
    fitHighHint: string;
    fitConditionalHint: string;
    fitExploreHint: string;
    fitBlockedHint: string;
  };
  modalities: Record<'text' | 'image' | 'audio' | 'video', string>;
  compareRows: {
    vendor: string;
    familyGen: string;
    release: string;
    architecture: string;
    totalParams: string;
    activeParams: string;
    context: string;
    modalities: string;
    specializations: string;
    checkpoint: string;
    openWeights: string;
    license: string;
    loraSftRl: string;
    inferenceTier: string;
    apiStatus: string;
    weightsStatus: string;
    baseCheckpoint: string;
    finetuning: string;
    derivative: string;
    commercial: string;
    transformers: string;
    vllm: string;
    sglang: string;
    verl: string;
    loraTier: string;
    sftTier: string;
    rlTier: string;
    paperRoles: string;
    apiPin: string;
    tokenizer: string;
    config: string;
    chatTemplate: string;
    sourceCount: string;
    dataStatus: string;
  };
  familyUnits: { checkpoints: string };
  notFound: { title: string; body: string; back: string };
  v2: {
    home: {
      heroEyebrow: string;
      heroTitle: string;
      heroLede: string;
      heroCta: string;
      exampleKicker: string;
      exampleTitle: string;
      exampleBody: string;
      exampleModels: string;
      exampleCandidates: string;
      exampleEvidence: string;
      entryReproduce: string;
      entryChoose: string;
      entryReplace: string;
      entryLearn: string;
      pathsKicker: string;
      pathsTitle: string;
      pathStrictTag: string;
      pathStrict: string;
      pathStrictBody: string;
      pathMethodTag: string;
      pathMethod: string;
      pathMethodBody: string;
      pathModernTag: string;
      pathModern: string;
      pathModernBody: string;
      scenariosKicker: string;
      scenariosTitle: string;
      scenariosNote: string;
      scenarioLora: string;
      scenarioLoraLede: string;
      scenarioRl: string;
      scenarioRlLede: string;
      scenarioOpenWeight: string;
      scenarioOpenWeightLede: string;
      scenarioQwen: string;
      scenarioQwenLede: string;
      scenarioReplace: string;
      scenarioReplaceLede: string;
      scenarioApi: string;
      scenarioApiLede: string;
      scenarioAction: string;
      recentChangesKicker: string;
      recentChangesTitle: string;
      recentChangesNote: string;
      recentRelease: string;
      recentSources: string;
      familiesKicker: string;
      familiesTitle: string;
      familiesCta: string;
      familyFlagship: string;
      familyOpenWeight: string;
      overviewKicker: string;
      overviewTitle: string;
      overviewCta: string;
      overviewBody: string;
      statModels: string;
      statFamilies: string;
      statOpenWeights: string;
    };
  };
  workspace: {
    pageTitle: string;
    title: string;
    lede: string;
    constraintTitle: string;
    modeLabel: string;
    roleLabel: string;
    updateLabel: string;
    resourceLabel: string;
    priorityLabel: string;
    openWeightLabel: string;
    contextLabel: string;
    accessModeLabel: string;
    setTask: string;
    clearTask: string;
    candidateTitle: string;
    candidateCount: string;
    emptyCandidates: string;
    addToCompare: string;
    removeFromCompare: string;
    addCandidate: string;
    removeCandidate: string;
    evidenceTitle: string;
    openness: string;
    research: string;
    hardware: string;
    access: string;
    sources: string;
    noSource: string;
    currentTask: string;
    editConstraints: string;
    candidates: string;
    compare: string;
    compareTray: string;
    openCompare: string;
    clearCompare: string;
    mobileNavLabel: string;
    mobileTask: string;
    mobileCandidates: string;
    mobileEvidence: string;
    mobileCompare: string;
    closeQuickView: string;
    taskBuilder: Record<string, string>;
  };
  research: {
    modes: { strict: string; method: string; modern: string; new: string };
    updates: { none: string; lora: string; sft: string; rl: string; unsure: string };
    accessModes: { local: string; api: string; either: string };
    evidencePolicies: { verified_preferred: string; verified_only: string; allow_unknown: string };
    bucketBaseline: string;
    bucketModern: string;
    bucketResource: string;
    bucketBaselineHint: string;
    bucketModernHint: string;
    bucketResourceHint: string;
    whyRecommended: string;
    mainRisks: string;
    papersUsed: string;
    reasons: Record<string, string>;
    risks: Record<string, string>;
    excludedTitle: string;
    excludedHint: string;
    excludedBlocked: string;
    excludedPending: string;
    memo: {
      title: string;
      export: string;
      download: string;
      downloadJson: string;
      saveSnapshot: string;
      snapshotSaved: string;
      snapshotChanged: string;
      snapshotField: string;
      snapshotPrevious: string;
      snapshotCurrent: string;
      snapshotChecked: string;
      copy: string;
      copied: string;
      dataRevision: string;
      empty: string;
      sectionTask: string;
      sectionCandidates: string;
      sectionCompare: string;
      sectionRisks: string;
      sectionNotSelected: string;
      sectionEvidence: string;
      unverified: string;
    };
    substitute: {
      title: string;
      selectBase: string;
      candidates: string;
      compare: string;
      field: string;
      original: string;
      replacement: string;
      openness: string;
      context: string;
      hardware: string;
      finetune: string;
      release: string;
      empty: string;
      noSubstitute: string;
      modeImpact: string;
      impact: string;
      impactDimensions: Record<string, string>;
      severity: Record<'none' | 'low' | 'medium' | 'high' | 'unknown', string>;
      confidence: Record<'direct' | 'derived' | 'unknown', string>;
      effect: Record<'none' | 'operational' | 'requires_recalibration' | 'breaks_direct_comparison' | 'unknown', string>;
      impactCodes: Record<string, string>;
    };
  };
  format: {
    unknown: string;
    yes: string;
    no: string;
    semanticStatus: Record<'not_disclosed' | 'not_applicable' | 'not_reported' | 'not_verified' | 'conflicting_evidence' | 'not_published' | 'unavailable', string>;
    status: Record<'verified' | 'partial' | 'demo' | 'unknown', string>;
    lifecycle: Record<'active' | 'legacy' | 'preview' | 'unknown', string>;
    sourceType: Record<string, string>;
    architecture: Record<'dense' | 'moe' | 'other', string>;
    checkpoint: Record<'base' | 'instruct' | 'thinking' | 'coder' | 'vision', string>;
    specialization: Record<string, string>;
    role: Record<string, string>;
    category: Record<string, string>;
    evolutionTarget: Record<string, string>;
    tier: Record<'cpu_mac' | '16gb' | '24gb' | '48gb' | '80gb' | 'multi_gpu' | 'api_only' | 'unknown', string>;
  };
};
