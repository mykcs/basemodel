import type { HumanFeedbackEventId } from './humanPreferenceLearningHistory';
import type { HumanFeedbackPairId, HumanPreferenceId } from './humanPreferenceModel';

export type HumanFeedbackLedgerDisposition =
  | 'ingest'
  | 'merge-duplicate'
  | 'out-of-scope'
  | 'ambiguous-hold'
  | 'superseded'
  | 'task-fact-not-preference'
  | 'page-specific-only';

export interface HumanFeedbackCoverageLedgerEntry {
  id: `FEEDBACK-${string}`;
  sourceTurn: string;
  rawExcerpt: string;
  context: string;
  disposition: HumanFeedbackLedgerDisposition;
  reason: string;
  eventIds?: HumanFeedbackEventId[];
  preferenceIds?: HumanPreferenceId[];
  goldPairIds?: HumanFeedbackPairId[];
  visualReferenceIds?: `VISUAL-${string}`[];
  nonPreferenceFragments?: string[];
  supersessionNote?: string;
}

export interface HumanFeedbackIngestionCloseout {
  id: `INGESTION-${string}`;
  sourceWindow: { start: string; end: string; triggerExcluded: boolean };
  repository: string;
  baselineMainSha: string;
  finalArtifact: { pullRequest: number; mergedHeadSha: string; mergeCommitSha: string; route: string };
  ledger: HumanFeedbackCoverageLedgerEntry[];
  supersessions: Array<{ olderEventId: HumanFeedbackEventId; newerEventId: HumanFeedbackEventId; boundary: string }>;
  futureTaskProbe: {
    query: string;
    contractId: string;
    expectedPreferenceIds: HumanPreferenceId[];
    expectedFailureFamilies: string[];
    expectedGoldPairIds: HumanFeedbackPairId[];
    mustStateNoGoldenReference: boolean;
  };
  evaluationProbe: {
    candidate: string;
    expectedRejectedMechanisms: string[];
  };
  nonLearningDecisions: Array<{ signal: string; reason: string }>;
  automationGap: string;
  mergeBoundary: { ownerAuthorizedIfGreen: boolean; authorization: string };
}

export const OPEN_EVO_BRIEFING_CLOSEOUT_20260909: HumanFeedbackIngestionCloseout = {
  id: 'INGESTION-20260909-OPENEVO-BRIEFING',
  sourceWindow: {
    start: 'owner: 为什么没有按照你前面对话发给我的 slide 做？',
    end: 'owner: 可以合并这版，但还不是 100% 完成',
    triggerExcluded: true,
  },
  repository: 'mykcs/basemodel',
  baselineMainSha: 'bb01176ccc3703dbf320145530d94037e422c682',
  finalArtifact: {
    pullRequest: 569,
    mergedHeadSha: '89fe1190d0f92909f6da40b9a47ea75c9f45d2d5',
    mergeCommitSha: '2471d63593df808040a62a83654c360ceb9e38d2',
    route: '/research/seed-openevo/study/briefing/',
  },
  ledger: [
    {
      id: 'FEEDBACK-SLIDE-SOURCE-OF-TRUTH',
      sourceTurn: '为什么没有按照你前面对话发给我的 slide 做？',
      rawExcerpt: '前面那套 Slide 的视觉设计我觉得好多了；最终不要交 PPT，而是把那套设计做成 HTML。',
      context: 'HTML 迁移把已获正反馈的 slide 视觉重新设计成普通网页，owner 指出媒介变化不等于视觉重置。',
      disposition: 'merge-duplicate',
      reason: '强化已有 soft-slide > dense-status / overminimal 轨迹，不额外制造“必须复制某套模板”的全局规则。',
      eventIds: ['EVENT-20260908-SOFT-SLIDE-DIRECTION', 'EVENT-20260908-OVERMINIMAL-HTML'],
      visualReferenceIds: ['VISUAL-BRIEFING-SOFT-SILVER', 'VISUAL-BRIEFING-OVERMINIMAL-REJECTED'],
    },
    {
      id: 'FEEDBACK-HYBRID-AMBIGUOUS',
      sourceTurn: '两者中和一下',
      rawExcerpt: '两者中和一下。',
      context: '短句只表达要在 slide 感和 HTML 能力之间折中，未给可长期抽象的具体机制。',
      disposition: 'ambiguous-hold',
      reason: '后续更具体的视觉、信息密度和设备反馈提供了可学习信号；不从这四个字单独推导规则。',
    },
    {
      id: 'FEEDBACK-SOFT-COLOR-ROUND-DENSITY',
      sourceTurn: '还是不像之前你给的 slides 多色彩 柔和 圆形 什么的 之前你给的 slides 上的信息也有一点点多',
      rawExcerpt: '多色彩、柔和、圆形……信息也可以多一点。',
      context: '上一版为了减少认知负担过度极简，失去已获正反馈的柔和视觉和恰当信息密度。',
      disposition: 'merge-duplicate',
      reason: '强化 soft-slide Silver 与 overminimal rejection；后续“淡色气泡不要”限制了圆形只能承担结构/信息功能。',
      eventIds: ['EVENT-20260908-SOFT-SLIDE-DIRECTION', 'EVENT-20260908-OVERMINIMAL-HTML', 'EVENT-20260908-DECORATIVE-BUBBLES'],
      visualReferenceIds: ['VISUAL-BRIEFING-SOFT-SILVER', 'VISUAL-BRIEFING-OVERMINIMAL-REJECTED'],
      supersessionNote: '“圆形”不能泛化为装饰气泡；后续 owner 明确拒绝无信息淡色气泡。',
    },
    {
      id: 'FEEDBACK-INTERMEDIATE-POSITIVE-NOT-APPROVAL',
      sourceTurn: '好多了，但不能说很好，也不能说 OK',
      rawExcerpt: '好多了，但是不能说很好，也不能说 OK。',
      context: 'owner 明确给出相对改善，但拒绝把中间版本视为完成。',
      disposition: 'merge-duplicate',
      reason: '强化非二元 verdict：better / promising 不得自动升级 accepted / canonical / Golden。',
      eventIds: ['EVENT-20260908-SOFT-SLIDE-DIRECTION'],
      visualReferenceIds: ['VISUAL-BRIEFING-SOFT-SILVER'],
    },
    {
      id: 'FEEDBACK-PRESENTATION-CONTRACT',
      sourceTurn: 'SEED 表格 + 标准 PowerPoint 比例 + 页码 + 目录/TLDR + 封面/尾页要求',
      rawExcerpt: "结果页模拟 SEED 论文里的 LaTeX 表格；展示 slides 做成标准 PowerPoint 长宽比；首页和尾页不显示页码；其他页右下角显示当前页 / 总页数；不要下一页按钮；开头要目录 + Too long, Don't read；封面写标题、日期、汇报人；最后一页要让老师知道在判断什么；‘固定 GPU 确定性已经 PASS’这种话很难让人理解。",
      context: 'owner 给该具体 briefing 的结果表、演讲形态、页码/目录、尾页决策和人类语言合同。',
      disposition: 'page-specific-only',
      reason: '这些是 OpenEVO briefing 的具体 presentation contract，不应传播成所有 BaseModel 页面规则。',
      eventIds: ['EVENT-20260908-BRIEFING-PRESENTATION-CONTRACT', 'EVENT-20260908-FIXED-DECK-ALL-DEVICES'],
      preferenceIds: ['PREF-DEVICE-SCOPED-COMPOSITION'],
      supersessionNote: '其中“所有设备都不适配”的设备子规则后来被手机 reflow + 桌面 cap 明确覆盖；目录/页码/封面等其他部分不受该 supersession 影响。',
    },
    {
      id: 'FEEDBACK-ENGLISH-BUBBLES-TECHNICAL-DEPTH',
      sourceTurn: 'OpenEVO · SEED × WebShop 无意义英文；淡色气泡不要；TaskVector 可以更技术',
      rawExcerpt: '不要这种无意义的英文小标题；这种莫名的淡色气泡也不要；TaskVector、范数、参数可以稍微硬核一点，引入 LaTeX 公式或详细数据。',
      context: '同时纠正文案注意力税、无信息装饰和“降认知负担 ≠ 降科研深度”。',
      disposition: 'ingest',
      reason: '三个机制均有明确原因且能改变未来 first draft；英文眉题为重复纠正，应升级 hard。',
      eventIds: ['EVENT-20260908-MEANINGLESS-ENGLISH-EYEBROW', 'EVENT-20260908-DECORATIVE-BUBBLES', 'EVENT-20260908-MECHANISM-DEPTH'],
      preferenceIds: ['PREF-DIRECT-FACTS', 'PREF-FIRST-SCREEN-ATTENTION', 'PREF-RESEARCH-JUDGMENT'],
      goldPairIds: ['PAIR-027-ENGLISH-EYEBROW'],
      supersessionNote: '同一轮提到“向老师展示思路、质量、速度”是汇报目标；后续反馈进一步限定：质量/速度若只是工程通过或吞吐提升，不单独占主演讲，必须嵌入真正改变科学判断的证据。',
    },
    {
      id: 'FEEDBACK-HPL-WORKFLOW',
      sourceTurn: '希望案例库从真人反馈里真正学习，减少重复纠正',
      rawExcerpt: '我给你一些具体要求并希望触类旁通；这些反馈是很珍贵的语料，希望维护案例库并从里面学习，越来越符合我的要求。',
      context: 'owner 把“去 AI 味 / 说人话 / 减轻 ADHD 与注意力负担”定义为应调用历史偏好，而不是每次现场猜。',
      disposition: 'ingest',
      reason: '这是明确长期工作流要求，scope 为 workflow；canonical 的是反馈闭环，不是任何具体视觉模板。',
      eventIds: ['EVENT-20260908-FEEDBACK-LEARNING-WORKFLOW'],
      preferenceIds: ['PREF-FEEDBACK-LEARNING-LOOP'],
      goldPairIds: ['PAIR-083-LEARNING-LOOP'],
    },
    {
      id: 'FEEDBACK-LAND-WORKFLOW-FIRST',
      sourceTurn: '那好的，那我们把这个工作流应用先落地，然后再应用。',
      rawExcerpt: '先把这个工作流落地，然后再应用。',
      context: '明确先让 HPL 成为仓库正式能力，再用它处理当前页面。',
      disposition: 'merge-duplicate',
      reason: '强化同一 workflow canonical 事件，不新建重复偏好。',
      eventIds: ['EVENT-20260908-FEEDBACK-LEARNING-WORKFLOW'],
      preferenceIds: ['PREF-FEEDBACK-LEARNING-LOOP'],
    },
    {
      id: 'FEEDBACK-PARAMETER-HEADING',
      sourceTurn: '2048→4096 参数不要直接抢标题',
      rawExcerpt: '标题不要直接写 2048→4096；先说“我们把记忆容量翻倍了”，2048 → 4096 放正文。',
      context: '参数是实现细节，当前页的第一认知任务是理解“容量翻倍仍不能解决问题”。',
      disposition: 'ingest',
      reason: '形成 heading hierarchy 规则，并通过 anti-overgeneralization 保留真正科研结果数字做标题的权利。',
      eventIds: ['EVENT-20260909-PARAMETER-TITLE-AND-MOBILE-FIT'],
      preferenceIds: ['PREF-DIRECT-FACTS', 'PREF-FIRST-SCREEN-ATTENTION'],
      goldPairIds: ['PAIR-082-PARAMETER-HEADING'],
    },
    {
      id: 'FEEDBACK-DEVICE-SCOPE-SUPERSESSION',
      sourceTurn: '手机端要 reflow；桌面仍保留有上限 16:9，不随超宽屏无限变大',
      rawExcerpt: '手机应该正常适配窗口，不要把整个 1280×720 slide 缩小；桌面仍然保持 16:9 的 slide 构图，而且宽度要有上限。',
      context: '更具体、更新的设备范围反馈覆盖了早期“固定 16:9、不做屏幕适配”的 phone 行为。',
      disposition: 'ingest',
      reason: '这是明确 scope-specific supersession，必须保留旧证据而不是改写历史。',
      eventIds: ['EVENT-20260909-PARAMETER-TITLE-AND-MOBILE-FIT'],
      preferenceIds: ['PREF-DEVICE-SCOPED-COMPOSITION'],
      goldPairIds: ['PAIR-082-DEVICE-SCOPE'],
      supersessionNote: 'EVENT-20260909-PARAMETER-TITLE-AND-MOBILE-FIT supersedes EVENT-20260908-FIXED-DECK-ALL-DEVICES only for device behavior.',
    },
    {
      id: 'FEEDBACK-ENGINEERING-DOWN-SCIENCE-STORY-UP',
      sourceTurn: '3B / 工程严谨性下沉 / GDR 简式 / 科研故事线',
      rawExcerpt: '“我怎么保证：结果可信，而且推进得快”这一页完全没必要；SHA、固定 GPU 等严谨性默认应该做好，感兴趣再看子网页。GDR 简单说明 Gated Delta Rule，只放简单公式；故事从 7B 低分讲到 1.7B/3B，再讲 15→30、20→10+10、2048→4096 等小实验，最后讲 GDR 和不带 GDR。',
      context: 'owner 把科研价值定义为“遇到问题 → 提出可证伪解释 → 小实验排除 → 缩窄下一问”，并把工程审计移出主叙事。',
      disposition: 'ingest',
      reason: '同时强化 research judgment、progressive disclosure 和 technical-depth-without-meta；3B 是否存在属于科学事实，不进入偏好模型。',
      eventIds: ['EVENT-20260909-MAINLINE-RIGOR-TAX', 'EVENT-20260909-CHRONOLOGY-SCIENCE-STORY', 'EVENT-20260909-TECHNICAL-DEPTH-WITHOUT-META'],
      preferenceIds: ['PREF-PROGRESSIVE-DISCLOSURE', 'PREF-RESEARCH-JUDGMENT', 'PREF-DIRECT-FACTS'],
      goldPairIds: ['PAIR-082-TECHNICAL-META', 'PAIR-082-RIGOR-DISCLOSURE'],
      nonPreferenceFragments: ['“3B 确实做过”是实验历史事实，需要从科学证据核验，不是用户审美或表达偏好。'],
    },
    {
      id: 'FEEDBACK-GDR-44-7-NATURAL-LANGUAGE',
      sourceTurn: '44→7 解释改成人类能理解的更新次数',
      rawExcerpt: 'OpenEVO 在训练过程中会有 SD-LoRA 的更新，本来应该可以更新 44 次，但是实际上只更新了 7 次。GDR 这里应该简单说明一下 gated delta rule。',
      context: 'owner 接受 44→7 的核心信息，但要求先说“什么东西有 44 次、实际发生 7 次”，并就地解释 GDR。',
      disposition: 'ingest',
      reason: '强化对象先行与术语就地解释，不把裸数字或缩写交给读者自行解码。',
      eventIds: ['EVENT-20260909-CHRONOLOGY-SCIENCE-STORY'],
      preferenceIds: ['PREF-OBJECT-FIRST', 'PREF-INLINE-TERMINOLOGY'],
      goldPairIds: ['PAIR-070-GLOSSARY'],
    },
    {
      id: 'FEEDBACK-FINAL-MERGE-NONCANONICAL',
      sourceTurn: '最终版本允许合并，但仍不是 100%',
      rawExcerpt: '可以合并这版，但还不是 100% 完成。',
      context: '对最终具体 PR #569 的交付接受；没有说“以后就按这个标准”。',
      disposition: 'ingest',
      reason: '具体 artifact verdict = accepted；visual tier = Silver；不得创建 canonicalVariantId 或 Golden。',
      eventIds: ['EVENT-20260909-BRIEFING-MERGED-ACCEPTED'],
      visualReferenceIds: ['VISUAL-BRIEFING-MERGED-ACCEPTED-SILVER'],
    },
  ],
  supersessions: [
    {
      olderEventId: 'EVENT-20260908-FIXED-DECK-ALL-DEVICES',
      newerEventId: 'EVENT-20260909-PARAMETER-TITLE-AND-MOBILE-FIT',
      boundary: '只覆盖设备行为：phone 从固定画布改为 viewport reflow；desktop 仍保留有上限的 16:9 演讲构图。目录、页码、封面/尾页规则继续有效。',
    },
  ],
  futureTaskProbe: {
    query: '给导师做一个新的科研阶段汇报页面：展示模型实验怎样一步步排除错误解释，也要讲参数机制。桌面像演讲稿，手机要能舒服阅读；复现和工程审计证据要完整，但不要淹没主讲内容。',
    contractId: 'study-briefing',
    expectedPreferenceIds: [
      'PREF-RESEARCH-JUDGMENT',
      'PREF-PROGRESSIVE-DISCLOSURE',
      'PREF-DIRECT-FACTS',
      'PREF-DEVICE-SCOPED-COMPOSITION',
    ],
    expectedFailureFamilies: [
      'engineering-as-science-highlight',
      'mainline-rigor-tax',
      'meaningless-english-eyebrow',
      'mobile-fixed-canvas-overflow',
    ],
    expectedGoldPairIds: ['PAIR-082-RIGOR-DISCLOSURE', 'PAIR-082-DEVICE-SCOPE', 'PAIR-082-TECHNICAL-META'],
    mustStateNoGoldenReference: true,
  },
  evaluationProbe: {
    candidate: 'OpenEVO · SEED × WebShop；这里可以更硬核一点；2048 → 4096；主 slide 单独展示 SHA / fixed-GPU / repeatability / resume 作为科研亮点；手机端也固定 1280×720，只缩放或横向滚动画布。',
    expectedRejectedMechanisms: [
      'meaningless-english-eyebrow',
      'meta-technical-performance',
      'numeric-shock-heading',
      'engineering-as-science-highlight',
      'mobile-fixed-canvas-overflow',
    ],
  },
  nonLearningDecisions: [
    { signal: '3B 确实做过', reason: '属于实验历史 / 科学事实，需要用实验权威核验，不能作为人类偏好训练信号。' },
    { signal: '具体 SEED / OpenEVO 分数', reason: '属于科学内容和证据边界；偏好系统只学习如何呈现，不把数值本身当审美偏好。' },
    { signal: '去做 / 做完了吗 / 继续解决', reason: '属于任务推进指令，不描述用户界面、文案、科研叙事或学习机制偏好。' },
    { signal: '内部 A/B/C 候选的 Agent 自评', reason: '除非 owner 明确评价，不把 Agent 自己的候选排序回灌成用户偏好。' },
  ],
  automationGap: 'Repository code cannot independently read the raw ChatGPT conversation transcript. Candidate-turn extraction remains Agent-assisted; after extraction, coverage, references, verdict tiers, supersession, retrieval proof, and rejected-example evaluation are machine-verified.',
  mergeBoundary: {
    ownerAuthorizedIfGreen: true,
    authorization: 'Current closeout request explicitly authorizes merging the HPL-only closeout PR if all required validation passes and no product/science behavior changes are introduced.',
  },
};
