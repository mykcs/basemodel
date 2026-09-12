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
      "zh": "先看到最新固定同题诊断，再选择历史、新设计或参数机制路径。",
      "en": "See the latest same-task diagnostic first, then choose the historical, successor-design, or parameter-mechanism path."
    }
  },
  {
    "route": "gdr-directapply",
    "coverage": "contextualized",
    "owner": "OpenEvoGdrDirectApplyExplainer",
    "label": {
      "zh": "GDR 与 DirectApply 决策反思",
      "en": "GDR and DirectApply decision record"
    },
    "purpose": {
      "zh": "解释本地 GDR-v1 为什么把 44 个 SD-LoRA candidate 过滤成 7 次正式更新，区分它与原始 recurrent Gated Delta Rule，并说明 Task Vector 在当前讨论中是诊断对象而不是运行时 gate 输入。",
      "en": "Explain why local GDR-v1 filtered 44 SD-LoRA candidates into seven formal updates, distinguish it from the original recurrent Gated Delta Rule, and clarify that Task Vector is currently a diagnostic object rather than a runtime gate input."
    }
  },
  {
    "route": "vanilla-sd-lora",
    "coverage": "contextualized",
    "owner": "OpenEvoVanillaSdLoraMechanism",
    "label": {
      "zh": "Vanilla SD-LoRA 机制",
      "en": "Vanilla SD-LoRA mechanism"
    },
    "purpose": {
      "zh": "解释一轮 WebShop rollout 怎样筛成 SD-LoRA 训练数据、旧方向与新方向怎样组合，以及 candidate adapter 怎样进入下一轮。",
      "en": "Explain how one WebShop round becomes SD-LoRA training data, how old and new directions are composed, and how the candidate adapter can feed the next round."
    }
  },
  {
    "route": "sd-lora-history",
    "coverage": "contextualized",
    "owner": "OpenEvoSdLoraHistorySkeleton",
    "label": { "zh": "SD-LoRA 历史专题", "en": "SD-LoRA history series" },
    "purpose": {
      "zh": "作为七个连续问题的总入口：从 Vanilla 机制与计算变慢，走到历史新颖度、当前函数、未来学习和固定大小状态。",
      "en": "Serve as the gateway to seven connected questions, from Vanilla mechanics and compute scaling to history novelty, present function, future learning, and bounded state."
    }
  },
  {
    "route": "sd-lora-equivalence",
    "coverage": "contextualized",
    "owner": "OpenEvoSdLoraHistorySkeleton",
    "label": { "zh": "SD-LoRA 严格等价", "en": "Strict SD-LoRA equivalence" },
    "purpose": {
      "zh": "解释为什么数学上等价的并行计算可能改变 BF16 backward 的实际累加语义；当前先建立页面入口，不把待整理证据写成新结论。",
      "en": "Explain why mathematically equivalent parallel compute can change effective BF16 backward accumulation; for now establish the route without upgrading unfinished evidence into a new conclusion."
    }
  },
  {
    "route": "sd-lora-history-novelty",
    "coverage": "contextualized",
    "owner": "OpenEvoSdLoraHistorySkeleton",
    "label": { "zh": "SD-LoRA 历史新颖度", "en": "SD-LoRA history novelty" },
    "purpose": {
      "zh": "研究不断增加的 component 是否一直带来同等数量的新有效方向，并把这个问题与平台期分开检验。",
      "en": "Test whether each additional component contributes a comparable amount of new effective direction, keeping that question separate from the score plateau itself."
    }
  },
  {
    "route": "sd-lora-present-function",
    "coverage": "contextualized",
    "owner": "OpenEvoSdLoraHistorySkeleton",
    "label": { "zh": "当前函数保持", "en": "Present-function preservation" },
    "purpose": {
      "zh": "研究压缩、删除或合并历史以后，模型当前行为是否仍被保留；参数接近本身不等于函数保持。",
      "en": "Test whether current behavior survives compression, deletion, or merging of history; parameter similarity alone does not establish function preservation."
    }
  },
  {
    "route": "sd-lora-future-learning",
    "coverage": "contextualized",
    "owner": "OpenEvoSdLoraHistorySkeleton",
    "label": { "zh": "未来学习保持", "en": "Future-learning preservation" },
    "purpose": {
      "zh": "让完整历史与压缩状态接受相同后续经验，检验今天行为相近是否足以保证未来继续学得一样。",
      "en": "Give full-history and compressed states the same later experience to test whether matching behavior today is enough to preserve future learning."
    }
  },
  {
    "route": "sd-lora-bounded-state",
    "coverage": "contextualized",
    "owner": "OpenEvoSdLoraHistorySkeleton",
    "label": { "zh": "固定大小学习状态", "en": "Bounded learning state" },
    "purpose": {
      "zh": "在前面的科学问题有结果以后，再讨论能否用固定大小状态替代不断增长的历史，以及 GDR、WY、chunkwise 在其中分别扮演什么角色。",
      "en": "Only after the earlier scientific questions are answered, ask whether a fixed-size state can replace growing history and what roles GDR, WY, and chunkwise might play."
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
      "zh": "以上游同题诊断作为动机，检验学习留下的参数变化是否因果改变购物行为，并说明每个实验何时开始和结束。",
      "en": "Use the upstream same-task diagnostic as motivation, then test whether learned parameter changes causally alter shopping behavior with explicit start and stop conditions."
    }
  },
  {
    "route": "text-memory",
    "coverage": "contextualized",
    "owner": "OpenEvoTextMemoryPlan",
    "label": { "zh": "Text Memory 研究", "en": "Text Memory research" },
    "purpose": {
      "zh": "记录写满输出上限与重复旧笔记的不同案例；正式实验快照与下一代验证分开。",
      "en": "Document distinct cases of output saturation and repeated prior notes; keep the dated formal-run snapshot separate from future validation."
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
    "route": "q17-directapply-analysis",
    "coverage": "contextualized",
    "owner": "OpenEvoQ17DirectApplyAnalysis",
    "label": {
      "zh": "DirectApply 完整实验分析",
      "en": "DirectApply complete analysis"
    },
    "purpose": {
      "zh": "把 DirectApply 的完整 160 轮训练、可靠性与覆盖变化、R127→R128 同题行为、四种学习载体、SD-LoRA component-count latency、一次冻结终评和 D1 参数压缩放在同一条证据链里，并明确区分真实结果、工程机制和仍未执行的下一代设计。",
      "en": "Connect the full 160-round DirectApply trajectory, reliability versus coverage, R127→R128 same-task behavior, the four learning carriers, SD-LoRA component-count latency, the one frozen final, and D1 compression in one evidence chain while separating measured results, engineering mechanisms, and still-prospective redesigns."
    }
  },
  {
    "route": "q17-directapply-frontier",
    "coverage": "contextualized",
    "owner": "OpenEvoQ17AdvisorDiagnostics",
    "label": {
      "zh": "R127 / R128 同题重测",
      "en": "R127 / R128 same-task check"
    },
    "purpose": {
      "zh": "让 R127 和 R128 做同样的 32 道 WebShop 题，看看训练曲线的大幅掉分到底是模型变差了，还是两轮题目不同造成的。",
      "en": "Run R127 and R128 on the same 32 WebShop tasks to separate model change from differences in the task samples used by the two training rounds."
    }
  },
  {
    "route": "sd-lora-scaling",
    "coverage": "rebuilt",
    "owner": "OpenEvoSdLoraScaling",
    "label": {
      "zh": "SD-LoRA 计算扩展性",
      "en": "SD-LoRA compute scaling"
    },
    "purpose": {
      "zh": "解释同样的 94-step 更新为什么会随着历史 component 增多而变慢，并把外围工程开销与 forward/backward 计算分开。",
      "en": "Explain why the same 94-step update becomes slower as historical components accumulate, separating pipeline overhead from forward/backward compute."
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
