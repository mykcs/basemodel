/** Closed route inventory: new public routes must declare their reader role. */
export const CAPABILITY_READER_ROUTES = [
  {
    "route": "",
    "coverage": "rebuilt",
    "owner": "OpenEvoCapabilityMapLobby",
    "label": {
      "zh": "研究入口",
      "en": "Research gateway"
    },
    "purpose": {
      "zh": "比较三条不同研究路径，选择历史、新设计或参数机制。",
      "en": "Choose between historical exploration, the successor design, and parameter mechanisms."
    }
  },
  {
    "route": "mechanism-1-0",
    "coverage": "rebuilt",
    "owner": "OpenEvoMechanismMap",
    "label": {
      "zh": "机制实验",
      "en": "Mechanism experiments"
    },
    "purpose": {
      "zh": "检验学习留下的参数变化是否改变购物行为，并说明每个实验何时开始和结束。",
      "en": "Test whether learned parameter changes alter shopping behavior, with explicit start and stop conditions."
    }
  },
  {
    "route": "first-run",
    "coverage": "contextualized",
    "owner": "OpenEvoFirstRunMap",
    "label": {
      "zh": "历史实验",
      "en": "Historical experiment"
    },
    "purpose": {
      "zh": "保留第一轮从初始经验到持续学习的记录；这些历史节点不代表当前运行排期。",
      "en": "Preserve the first campaign from initial experience to continued learning; historical nodes are not a live schedule."
    }
  },
  {
    "route": "openevo-2-0",
    "coverage": "contextualized",
    "owner": "OpenEvoRedesignMap",
    "label": {
      "zh": "新一轮设计",
      "en": "Successor design"
    },
    "purpose": {
      "zh": "比较 3B 与 1.7B 两种模型在共享购物规则下怎样收集经验并学习。",
      "en": "Compare how the 3B and 1.7B models collect experience and learn under shared shopping rules."
    }
  },
  {
    "route": "openevo-2-0/exploration",
    "coverage": "contextualized",
    "owner": "OpenEvoSuccessorExplorationMap",
    "label": {
      "zh": "研究过程",
      "en": "Research process"
    },
    "purpose": {
      "zh": "按发生顺序解释假设、对照检查和修改决定；每个节点保留当时的证据。",
      "en": "Explain hypotheses, controlled checks, and design decisions in order, preserving the evidence at each step."
    }
  },
  {
    "route": "openevo-2-0/report",
    "coverage": "contextualized",
    "owner": "OpenEvoSuccessorReport",
    "label": {
      "zh": "研究报告",
      "en": "Research report"
    },
    "purpose": {
      "zh": "按设置、初始经验、后续学习和结果组织证据；训练过程与最终测试分别解释。",
      "en": "Organize evidence by setup, initial experience, later learning, and results; distinguish training observations from final tests."
    }
  },
  {
    "route": "openevo-2-0/harness-2-0",
    "coverage": "contextualized",
    "owner": "OpenEvoHarness2MiniStudy",
    "label": {
      "zh": "历史接口检查",
      "en": "Historical interface check"
    },
    "purpose": {
      "zh": "任务接口（Harness）把模型输出变成网页动作；这里保留旧接口的资格检查，不代表新版实验状态。",
      "en": "The harness turns model output into website actions. This preserves qualification of an older interface, not the current experiment state."
    }
  },
  {
    "route": "stage1-evolution",
    "coverage": "contextualized",
    "owner": "OpenEvoSuccessorExplorationMap",
    "label": {
      "zh": "研究过程的兼容入口",
      "en": "Legacy entry to the research process"
    },
    "purpose": {
      "zh": "与 3B + 1.7B 探索版共享同一份内容，保留旧书签而不创建另一组实验。",
      "en": "This shares the 3B + 1.7B exploration content, preserving old bookmarks without creating another experiment."
    }
  },
  {
    "route": "stage1-previous",
    "coverage": "contextualized",
    "owner": "OpenEvoLegacyStage1Archive",
    "label": {
      "zh": "历史初始经验",
      "en": "Historical initial experience"
    },
    "purpose": {
      "zh": "保存旧版收集的经验与训练产物；旧数据保持可追溯，与后来的新实验分开。",
      "en": "Preserve older collected experience and training artifacts as traceable evidence, separate from successor experiments."
    }
  },
  {
    "route": "stage2-256-window",
    "coverage": "contextualized",
    "owner": "OpenEvoLegacyStage2Archive",
    "label": {
      "zh": "历史更新规则",
      "en": "Historical update rule"
    },
    "purpose": {
      "zh": "解释旧实验为什么做了许多购物任务，却没有触发参数更新；旧门槛保留为历史证据。",
      "en": "Explain why an older experiment attempted many shopping tasks without triggering parameter updates; retain its old gate as historical evidence."
    }
  },
  {
    "route": "stage2-7b-analysis",
    "coverage": "contextualized",
    "owner": "OpenEvo7BStage2AnalysisMap",
    "label": {
      "zh": "历史参数分析",
      "en": "Historical parameter analysis"
    },
    "purpose": {
      "zh": "检查 7B 训练中哪些参数改变，以及这些观察能支持什么；参数变化本身不证明新任务更好。",
      "en": "Inspect parameter changes during 7B training and their supported claims; change alone does not prove better performance on fresh tasks."
    }
  },
  {
    "route": "stage2-ceiling",
    "coverage": "contextualized",
    "owner": "OpenEvoCeilingStrategy",
    "label": {
      "zh": "7B 封存结果",
      "en": "Sealed 7B results"
    },
    "purpose": {
      "zh": "将历史运行记录与后来封存的最终测试分开；解释固定资源下这次实验实际得到什么。",
      "en": "Separate historical run records from the later sealed final test, explaining what this fixed-resource experiment actually achieved."
    }
  },
  {
    "route": "archive",
    "coverage": "contextualized",
    "owner": "OpenEvoExperimentArchive",
    "label": {
      "zh": "技术与历史档案",
      "en": "Technical and historical archive"
    },
    "purpose": {
      "zh": "查阅原始记录、模型文件和运行修复；技术记录属于证据，不自动成为新的科学分支。",
      "en": "Inspect original records, model artifacts, and runtime repairs; technical records are evidence, not automatically new scientific branches."
    }
  }
] as const;

export type CapabilityReaderRoute = typeof CAPABILITY_READER_ROUTES[number]['route'];
