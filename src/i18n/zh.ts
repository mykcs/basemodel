// 站点 UI 文案 —— 中文 (默认 locale)。
// 模型名、论文标题、benchmark 名和必要技术缩写保留原样；通用界面词只输出中文。
export const zh: Messages = {
  site: {
    name: '模型图谱',
    fullName: '智能体基础模型图谱',
    tagline: '智能体基础模型选择地图',
    titleSuffix: '智能体基础模型图谱',
    defaultDescription: '面向 AI 研究者的基础模型选择与论文采用地图。',
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
    switchLang: '英文',
    switchLangLabel: '切换到英文',
    dataStatus: '数据状态',
  },
  footer: {
    mvp: '智能体基础模型图谱 · MVP',
    motto: '数据优先，证据先行。',
  },
  home: {
    pageTitle: '研究者的模型选择入口',
    heroEyebrow: '',
    heroTitle: '把模型选择，变成一条可核验的研究路径。',
    heroLede: '面向智能体与自进化实验的基础模型地图。先看供应层，再看论文采用层；每个未完成字段都保留明确的证据状态。',
    howToRead: '怎么读这份地图',
    howToReadBody: '模型供应层回答“现在能选什么”；研究采用层回答“论文实际怎么用”。推荐只是规则筛选，不是性能排名。',
    browseAll: '浏览全部模型 →',
    heroPrimaryCta: '按实验条件筛选模型 →',
    heroSecondaryCta: '直接浏览模型',
    statsModels: '模型',
    statsVendors: '厂商 / 提供方',
    statsPapers: '论文记录',
    statsAria: '网站数据统计',
    selectorKicker: '从这里开始',
    selectorTitle: '告诉我你的实验条件',
    selectorNote: '输出候选，不输出伪排名',
    latestTitle: '最近记录的模型',
    viewExplorer: '查看模型浏览器 →',
    contractTitle: '证据状态是产品的一部分',
    contractBody: '每条模型和论文记录都要求一手来源 URL 与最后核验日期。未核验、官方未公开、未报告和未发布分别标注，不用猜测值填充。',
  },
  landscape: {
    kicker: 'Landscape',
    title: '模型供应层，一眼看清',
    note: '时间 × 推理硬件；点大小代表参数规模',
    chartHint: '形状区分 dense / MoE；边框区分证据状态',
    d3Hint: 'D3 原型：同一数据适配层的自定义 SVG 版本',
    chartAria: '按发布日期和推理硬件展示模型的散点图',
    openPrototype: '打开双引擎原型 →',
    legendNote: '未知参数不会被当成 0：使用固定小点，并在提示信息中标记待核验。',
    prototypeTitle: 'Landscape 双引擎原型',
    prototypeLede: 'ECharts 负责首页正式总览；D3 保留为可调试、可扩展的 SVG 原型。两者共享同一份模型数据适配层。',
    engineLabel: '选择图表引擎',
  },
  modelsIndex: {
    pageTitle: '模型浏览器',
    lede: '按厂商、架构、模型类型、开放性和研究可用性组合筛选。未核验字段不会自动变成“否”。',
  },
  families: {
    pageTitle: '模型家族',
    title: '模型家族与代际',
    lede: '按厂商 → 家族 → 官方代际名 → 具体模型展开。页面不假设每个厂商都有连续的第 1、2、3 代。',
    checkpointUnit: '个模型',
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
  },
  compareGroups: {
    identity: '基本信息',
    architecture: '架构与规模',
    access: '访问与开放性',
    research: '研究适配',
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
    quickRl: '适合 RL',
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
    rl: '适合 RL',
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
  format: {
    unknown: '待核验',
    yes: '是',
    no: '否',
    semanticStatus: {
      not_disclosed: '官方未公开',
      not_applicable: '不适用',
      not_reported: '未报告',
      not_verified: '尚未核验',
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
  nav: {
    home: string;
    models: string;
    families: string;
    compare: string;
    papers: string;
    mainNav: string;
    openMenu: string;
    toggleTheme: string;
    switchLang: string;
    switchLangLabel: string;
    dataStatus: string;
  };
  footer: { mvp: string; motto: string };
  home: {
    pageTitle: string;
    heroEyebrow: string;
    heroTitle: string;
    heroLede: string;
    howToRead: string;
    howToReadBody: string;
    browseAll: string;
    heroPrimaryCta: string;
    heroSecondaryCta: string;
    statsModels: string;
    statsVendors: string;
    statsPapers: string;
    statsAria: string;
    selectorKicker: string;
    selectorTitle: string;
    selectorNote: string;
    latestTitle: string;
    viewExplorer: string;
    contractTitle: string;
    contractBody: string;
  };
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
  families: { pageTitle: string; title: string; lede: string; checkpointUnit: string };
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
  };
  compareGroups: { identity: string; architecture: string; access: string; research: string; evidence: string };
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
  };
  evidence: { title: string; body: string; open: string; dataStatus: string; publisher: string; publishedAt: string; revision: string; supports: string; locator: string; notes: string; claimCoverage: string; unresolvedFields: string };
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
    quickRl: string;
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
    rl: string;
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
    dataStatus: string;
  };
  familyUnits: { checkpoints: string };
  notFound: { title: string; body: string; back: string };
  format: {
    unknown: string;
    yes: string;
    no: string;
    semanticStatus: Record<'not_disclosed' | 'not_applicable' | 'not_reported' | 'not_verified' | 'not_published' | 'unavailable', string>;
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
