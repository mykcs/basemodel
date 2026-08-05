// 站点 UI 文案 —— 中文 (默认 locale)。
// 专业名词刻意保留英文: 模型名 / MoE / Dense / LoRA / SFT / RL / Checkpoint / API only /
// 论文标题 / benchmark 名, 两种语言都不译 (用户决策: 全站专业名词保持英文)。
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
    statsModels: '模型 checkpoint',
    statsVendors: '厂商 / 提供方',
    statsPapers: '论文记录',
    selectorKicker: '从这里开始',
    selectorTitle: '告诉我你的实验条件',
    selectorNote: '输出候选，不输出伪排名',
    supplyKicker: '模型供应层',
    latestTitle: '最近记录的模型',
    viewExplorer: '查看模型浏览器 →',
    contractKicker: '数据约定',
    contractTitle: '证据状态是产品的一部分',
    contractBody: '每条模型和论文记录都要求来源 URL 与最后核验日期。当前 MVP 使用少量演示记录验证页面结构；批量录入真实资料前，请先替换这些占位来源。',
  },
  modelsIndex: {
    pageTitle: '模型浏览器',
    eyebrow: '模型供应层',
    lede: '按厂商、架构、checkpoint、开放性和研究可用性组合筛选。未知值不会自动变成“否”。',
  },
  families: {
    pageTitle: '模型家族',
    eyebrow: '家族层',
    title: '模型家族与代际',
    lede: '按厂商 → 家族 → 官方代际名 → checkpoint 展开。页面不假设每个厂商都有连续的第 1、2、3 代。',
    checkpointUnit: 'checkpoints',
  },
  compare: {
    pageTitle: '模型对比',
    eyebrow: '决策面',
    title: '横向对比 checkpoint',
    lede: '最多选择 5 个具体 checkpoint；缺失值显示为“未知”，不强行填补。',
    selectKicker: '选 2–5 个',
    selectTitle: '选择 checkpoint',
    selected: '已选',
    minTwo: '(至少选 2 个)',
    empty: '请选择 2–5 个模型以启用对比。',
    dimension: '维度',
  },
  papersIndex: {
    pageTitle: '论文采用',
    eyebrow: '研究采用层',
    title: '自进化智能体论文',
    lede: '论文记录单独维护，通过 model ID 与供应层建立关系。角色比单一“使用了某模型”更重要。',
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
    context: 'Context',
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
    checkpointIdentity: 'Checkpoint 档案',
    weightUpdatedSuffix: ' · 更新权重',
    totalActive: 'total / {active}B active',
    tokensSuffix: ' tokens',
    descriptionSuffix: '的架构、开放性、研究可用性和证据来源。',
    other: 'Other',
    research: {
      inference: 'Inference',
      lora: 'LoRA',
      sft: 'SFT',
      rl: 'RL',
      transformers: 'Transformers',
      vllm: 'vLLM',
      sglang: 'SGLang',
      verl: 'veRL recipe',
    },
  },
  paperDetail: {
    infoTitle: '论文信息',
    evolutionTargets: '进化对象',
    benchmarks: 'Benchmark',
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
    evidenceKicker: '论文证据',
    evidenceTitle: '证据链',
    evidenceBody: '模型关系由 model ID 连接；校验脚本会阻止不存在的关系进入构建。',
    descriptionSuffix: '的模型角色、进化目标和来源证据。',
  },
  evidence: {
    kicker: '证据',
    title: '来源与核验',
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
      inference: '仅推理 / Prompt',
      lora: 'LoRA / PEFT',
      sft: 'SFT',
      full_sft: '全参数训练',
      rl: 'RL / 自进化参数训练',
      harness: '外部 Memory / Harness',
    },
    tasks: {
      general: '通用 Agent',
      webshop: 'WebShop / Web navigation',
      alfworld: 'ALFWorld',
      coding: 'Coding Agent',
      research: 'Search / Deep Research',
      math: '数学推理',
      gui: 'GUI / 多模态 Agent',
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
      api_only: 'API only',
    },
    goals: {
      comparability: '论文可比性',
      current: '当前代模型',
      low_cost: '低成本',
      open_weights: '开放权重',
      chinese: '中文能力',
      tool_use: 'Agent / Tool use',
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
    checkpoint: 'Checkpoint',
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
    other: 'Other',
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
    context: 'Context',
    modalities: '模态',
    specializations: '专长',
    checkpoint: 'Checkpoint',
    openWeights: '开放权重',
    license: '许可证',
    loraSftRl: 'LoRA / SFT / RL',
    inferenceTier: '推理档位',
    dataStatus: '数据状态',
  },
  familyUnits: {
    checkpoints: 'checkpoints',
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
    contractKicker: string;
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
    checkpointIdentity: string;
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
    evidenceKicker: string;
    evidenceTitle: string;
    evidenceBody: string;
    descriptionSuffix: string;
  };
  evidence: { kicker: string; title: string; body: string; open: string; dataStatus: string };
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
    tier: Record<'cpu_mac' | '16gb' | '24gb' | '48gb' | '80gb' | 'multi_gpu' | 'api_only' | 'unknown', string>;
  };
};
