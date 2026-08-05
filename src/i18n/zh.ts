// 站点 UI 文案 —— 中文 (默认 locale)。
// 模型名、论文标题、benchmark 名和必要技术缩写保留原样；通用界面词只输出中文。
export const zh: Messages = {
  site: {
    name: 'Model Atlas',
    fullName: 'Agent Foundation Model Atlas',
    tagline: '智能体基础模型选择地图',
    titleSuffix: 'Agent Foundation Model Atlas',
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
    switchLang: 'English',
    switchLangLabel: '切换到英文',
  },
  footer: {
    mvp: 'Agent Foundation Model Atlas · MVP',
    motto: '数据优先，证据先行。',
  },
  home: {
    pageTitle: '研究者的模型选择入口',
    heroEyebrow: 'Agent Foundation Model Atlas',
    heroTitle: '把模型选择，变成一条可核验的研究路径。',
    heroLede: '面向智能体与自进化实验的基础模型地图。先看供应层，再看论文采用层；未知值保留未知，演示数据明确标记。',
    howToRead: '怎么读这份地图',
    howToReadBody: '模型供应层回答“现在能选什么”；研究采用层回答“论文实际怎么用”。推荐只是规则筛选，不是性能排名。',
    browseAll: '浏览全部模型 →',
    statsModels: '模型',
    statsVendors: '厂商 / 提供方',
    statsPapers: '论文记录',
    selectorKicker: '从这里开始',
    selectorTitle: '告诉我你的实验条件',
    selectorNote: '输出候选，不输出伪排名',
    supplyKicker: '模型供应层',
    latestTitle: '最近记录的模型',
    viewExplorer: '查看模型浏览器 →',
    contractTitle: '证据状态是产品的一部分',
    contractBody: '每条模型和论文记录都要求来源 URL 与最后核验日期。当前 MVP 使用少量演示记录验证页面结构；批量录入真实资料前，请先替换这些占位来源。',
  },
  modelsIndex: {
    pageTitle: '模型浏览器',
    eyebrow: '模型供应层',
    lede: '按厂商、架构、模型类型、开放性和研究可用性组合筛选。未知值不会自动变成“否”。',
  },
  families: {
    pageTitle: '模型家族',
    eyebrow: '家族层',
    title: '模型家族与代际',
    lede: '按厂商 → 家族 → 官方代际名 → 具体模型展开。页面不假设每个厂商都有连续的第 1、2、3 代。',
    checkpointUnit: '个模型',
  },
  compare: {
    pageTitle: '模型对比',
    eyebrow: '决策面',
    title: '横向对比模型',
    lede: '最多选择 5 个具体模型；缺失值显示为“未知”，不强行填补。',
    selectKicker: '选 2–5 个',
    selectTitle: '选择模型',
    selected: '已选',
    minTwo: '(至少选 2 个)',
    empty: '请选择 2–5 个模型以启用对比。',
    dimension: '维度',
  },
  papersIndex: {
    pageTitle: '论文采用',
    eyebrow: '研究采用层',
    title: '自进化智能体论文',
    lede: '论文记录单独维护，通过模型 ID 与供应层建立关系。角色比单一“使用了某模型”更重要。',
    matrixKicker: '论文 × 模型',
    matrixTitle: '论文—模型矩阵',
    relationsUnit: '个模型关系',
    matrixPaper: '论文',
  },
  detail: {
    overview: '一眼概览',
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
    weightUnknown: '权重更新未知',
    weightUpdated: '更新了权重',
    weightNotUpdated: '未更新权重',
    relationError: '关系错误',
    descriptionSuffix: '的模型角色、进化目标和来源证据。',
  },
  evidence: {
    title: '证据',
    body: '链接来自结构化数据；演示记录使用 example.com 占位，不代表真实事实。',
    open: '打开 ↗',
    dataStatus: '数据状态',
  },
  selector: {
    mode: '实验方式',
    task: '任务方向',
    resource: '资源条件',
    goal: '优先目标',
    candidateKicker: '候选集',
    candidateTitle: '候选模型组合',
    candidateUnit: '个候选',
    disclaimer: '这是基于元数据和用户条件的规则筛选，不是性能排行榜；未知条件会被明确保留。',
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
    paramsUnknown: '参数未知',
    openWeightsTag: '开放权重',
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
    unknown: '未知',
    yes: '是',
    no: '否',
    status: {
      verified: '已核验',
      partial: '部分核验',
      demo: '演示数据',
      unknown: '未知',
    },
    tier: {
      cpu_mac: 'CPU / Mac',
      '16gb': '16GB GPU',
      '24gb': '24GB GPU',
      '48gb': '48GB GPU',
      '80gb': '80GB GPU',
      multi_gpu: '多卡 GPU',
      api_only: '仅 API',
      unknown: '未知',
    },
    lifecycle: {
      active: '活跃',
      legacy: '历史版本',
      preview: '预览版',
      unknown: '未知',
    },
    sourceType: {
      official_model_card: '官方模型卡',
      official_docs: '官方文档',
      paper: '论文',
      code: '代码仓库',
      benchmark: '基准测试',
      demo_record: '演示记录',
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
    statsModels: string;
    statsVendors: string;
    statsPapers: string;
    selectorKicker: string;
    selectorTitle: string;
    selectorNote: string;
    supplyKicker: string;
    latestTitle: string;
    viewExplorer: string;
    contractTitle: string;
    contractBody: string;
  };
  modelsIndex: { pageTitle: string; eyebrow: string; lede: string };
  families: { pageTitle: string; eyebrow: string; title: string; lede: string; checkpointUnit: string };
  compare: {
    pageTitle: string;
    eyebrow: string;
    title: string;
    lede: string;
    selectKicker: string;
    selectTitle: string;
    selected: string;
    minTwo: string;
    empty: string;
    dimension: string;
  };
  papersIndex: {
    pageTitle: string;
    eyebrow: string;
    title: string;
    lede: string;
    matrixKicker: string;
    matrixTitle: string;
    relationsUnit: string;
    matrixPaper: string;
  };
  detail: {
    overview: string;
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
  evidence: { title: string; body: string; open: string; dataStatus: string };
  selector: {
    mode: string;
    task: string;
    resource: string;
    goal: string;
    candidateKicker: string;
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
