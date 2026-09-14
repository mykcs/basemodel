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
    "coverage": "self-contained",
    "owner": "OpenEvoGdrDirectApplyExplainer",
    "label": {
      "zh": "历史 GDR-v1 / DirectApply",
      "en": "Historical GDR-v1 / DirectApply"
    },
    "purpose": {
      "zh": "解释旧 GDR-v1 怎样先训练 44 个 SD-LoRA 候选更新，再用固定 16 题只让其中 7 个真正改到后续模型；同时说明 DirectApply 怎样取消这道训练后筛选。",
      "en": "Explain how old GDR-v1 trained 44 SD-LoRA candidate updates, then used a fixed 16-task check so only seven actually changed later models, and how DirectApply removed that post-training filter."
    }
  },
  {
    "route": "gated-delta-sd-lora",
    "coverage": "self-contained",
    "owner": "OpenEvoGatedDeltaSdLoraExplainer",
    "label": {
      "zh": "Gated-Delta SD-LoRA 推导",
      "en": "Gated-Delta SD-LoRA derivation"
    },
    "purpose": {
      "zh": "解释当前 Gated-Delta SD-LoRA 怎样在每次学习时直接更新 LoRA 参数，以及四轮 Vanilla-vs-GDR 配对实验已封存两轮后，我们现在能说什么、还不能说什么。",
      "en": "Explain how current Gated-Delta SD-LoRA updates LoRA parameters during learning, what the first two sealed Vanilla-vs-GDR paired rounds show, and why the four-round result is still incomplete."
    }
  },
  {
    "route": "sd-lora-history",
    "coverage": "contextualized",
    "owner": "OpenEvoSdLoraHistorySkeleton",
    "label": { "zh": "SD-LoRA 两条加速路线", "en": "Two SD-LoRA acceleration lines" },
    "purpose": {
      "zh": "先区分 SD-LoRA v2 · Stable Reduction 与 SD-LoRA · Bounded Online Recurrence，再沿七个连续问题查看机制、扩展性、历史与固定状态证据。",
      "en": "Distinguish SD-LoRA v2 · Stable Reduction from SD-LoRA · Bounded Online Recurrence, then follow the seven connected questions through mechanics, scaling, history, and bounded-state evidence."
    }
  },
  {
    "route": "sd-lora-equivalence",
    "coverage": "contextualized",
    "owner": "OpenEvoSdLoraV2Outcome",
    "label": { "zh": "SD-LoRA v2 · Stable Reduction", "en": "SD-LoRA v2 · Stable Reduction" },
    "purpose": {
      "zh": "解释这条 v2 为什么保留历史 component 列表、只改变跨 component 的稳定归约规则，以及约 2× trainer 加速和 prospective WebShop 小面板支持什么。",
      "en": "Explain why this v2 keeps the historical component list and changes only the stable cross-component reduction rule, plus what the ~2× trainer speedup and prospective WebShop panel support."
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
    "owner": "OpenEvoSdLoraBoundedRecurrence",
    "label": { "zh": "SD-LoRA · Bounded Online Recurrence", "en": "SD-LoRA · Bounded Online Recurrence" },
    "purpose": {
      "zh": "展示 R150–R159 连续在线更新怎样把历史保持在固定 rank128，同时每轮学习 rank8 新更新，并与 Stable Reduction 的 2× 结果明确分开。",
      "en": "Show how recurrent R150–R159 updates keep history at fixed rank128 while learning a new rank8 update each round, explicitly separate from the Stable Reduction ~2× result."
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
      "zh": "这是技术与历史档案，不代表当前运行状态；用于查阅原始记录、模型文件和运行修复，技术记录属于证据，不自动成为新的科学分支。",
      "en": "This is a technical and historical archive, not live run state; use it to inspect original records, model artifacts, and runtime repairs. Technical records are evidence, not automatically new scientific branches."
    }
  }
] as const;

export type CapabilityReaderRoute = typeof CAPABILITY_READER_ROUTES[number]['route'];
