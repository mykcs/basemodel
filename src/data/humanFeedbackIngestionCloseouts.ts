export type FeedbackLedgerDisposition =
  | 'ingest'
  | 'merge-duplicate'
  | 'superseded'
  | 'task-fact-not-preference'
  | 'page-specific-only'
  | 'ambiguous-hold'
  | 'out-of-scope';

export interface FeedbackCoverageLedgerItem {
  id: `FB-${string}`;
  date: string;
  ownerSignal: string;
  disposition: FeedbackLedgerDisposition;
  rationale: string;
  eventIds?: `EVENT-${string}`[];
  caseIds?: `CASE-${string}`[];
  supersededBy?: `FB-${string}`;
}

export interface HumanFeedbackIngestionCloseoutRecord {
  id: `INGESTION-${string}`;
  schema: 'human-feedback-ingestion-closeout.v1';
  task: string;
  sourceWindow: {
    start: string;
    end: string;
    route: string;
    pullRequests: number[];
    finalAcceptedHead: string;
    mergedMainCommit: string;
    currentCandidate?: { pullRequest: number; head: string };
  };
  ledger: FeedbackCoverageLedgerItem[];
  futureTaskQuery: string;
  expectedRetrievedSignals: string[];
  evaluationProof: {
    hardFamily: string;
    mechanism: string;
  };
  automationGap: string;
}

export const OPEN_EVO_BRIEFING_INGESTION_20260909: HumanFeedbackIngestionCloseoutRecord = {
  id: 'INGESTION-20260909-OPENEVO-BRIEFING',
  schema: 'human-feedback-ingestion-closeout.v1',
  task: 'OpenEVO summer/advisor briefing webpage human-preference closeout',
  sourceWindow: {
    start: '2026-09-08T03:02:15Z',
    end: '2026-09-09T05:37:34Z',
    route: '/research/seed-openevo/study/briefing/',
    pullRequests: [569, 594],
    finalAcceptedHead: '89fe1190d0f92909f6da40b9a47ea75c9f45d2d5',
    mergedMainCommit: '2471d63593df808040a62a83654c360ceb9e38d2',
    currentCandidate: { pullRequest: 594, head: '88653a8de98c05f8da5529266ac3dd5589ea2222' },
  },
  ledger: [
    {
      id: 'FB-01-RESEARCH-IDEAS-MISSING',
      date: '2026-09-08',
      ownerSignal: '你这个汇报完全没有体现出我的实验的思路和亮点。',
      disposition: 'merge-duplicate',
      rationale: '强化既有“科研汇报展示研究判断，不是项目状态流水账”机制。',
      eventIds: ['EVENT-20260908-ENGINEERING-AS-HIGHLIGHT'],
      caseIds: ['CASE-082'],
    },
    {
      id: 'FB-02-DENSE-STATUS-OVERLOAD',
      date: '2026-09-08',
      ownerSignal: '看着心烦意乱，一点都看不进去；科研亮点也被项目状态淹没。',
      disposition: 'ingest',
      rationale: '直接负反馈，覆盖注意力竞争与状态页替代科研叙事。',
      eventIds: ['EVENT-20260908-BRIEFING-DENSE-STATUS'],
      caseIds: ['CASE-068', 'CASE-082'],
    },
    {
      id: 'FB-03-SOFT-BETTER-NOT-OK',
      date: '2026-09-08',
      ownerSignal: '好多了，但不能说很好或者已经 OK。',
      disposition: 'ingest',
      rationale: '必须保留 better 而不是 accepted/canonical，防止把中间正反馈过度升级。',
      eventIds: ['EVENT-20260908-SOFT-SLIDE-DIRECTION'],
      caseIds: ['CASE-068', 'CASE-082'],
    },
    {
      id: 'FB-04-OVERMINIMAL-REGRESSION',
      date: '2026-09-08',
      ownerSignal: '还是不像之前的 slides；颜色、圆形和信息量都被削得太过。',
      disposition: 'ingest',
      rationale: '纠正“降低认知负担 = 越空越好”的过拟合。',
      eventIds: ['EVENT-20260908-OVERMINIMAL-HTML'],
      caseIds: ['CASE-068', 'CASE-082'],
    },
    {
      id: 'FB-05-SOFT-COLOR-ROUND-DENSITY',
      date: '2026-09-08',
      ownerSignal: '更像之前的 slides：多色彩、柔和、圆形，而且信息可以稍微多一点。',
      disposition: 'merge-duplicate',
      rationale: '强化 Soft Silver 方向，但没有模板级批准；与 FB-03/04 合并学习。',
      eventIds: ['EVENT-20260908-SOFT-SLIDE-DIRECTION', 'EVENT-20260908-OVERMINIMAL-HTML'],
      caseIds: ['CASE-068', 'CASE-082'],
    },
    {
      id: 'FB-06-NAKED-METRICS',
      date: '2026-09-08',
      ownerSignal: '49.33 / 58⁄128 没有单位和解释，观众不知道数字是什么意思。',
      disposition: 'ingest',
      rationale: '数字必须带对象、单位/分母与测量含义。',
      eventIds: ['EVENT-20260908-NAKED-METRICS'],
      caseIds: ['CASE-059'],
    },
    {
      id: 'FB-07-OBJECTIFY-44-TO-7-AND-R-STATES',
      date: '2026-09-08',
      ownerSignal: '44→7 必须把两个数字是什么说清楚；R14 / R27 / R49 也要解释它们是保存下来的参数状态。',
      disposition: 'merge-duplicate',
      rationale: '与 objectless-number / inline-terminology 机制相同；不新建近义 failure family。',
      eventIds: ['EVENT-20260908-NAKED-METRICS'],
      caseIds: ['CASE-059', 'CASE-070', 'CASE-082'],
    },
    {
      id: 'FB-08-INTERNAL-ENGLISH-TERMS',
      date: '2026-09-08',
      ownerSignal: 'closeout / successor / continuing state / transition authority 这种项目内部英文不要直接给老师猜；LoRA / RL / GPU 这类真实技术对象可以保留。',
      disposition: 'merge-duplicate',
      rationale: '强化中文含义先行；不是 English blacklist。',
      eventIds: ['EVENT-20260908-MEANINGLESS-ENGLISH-EYEBROW'],
      caseIds: ['CASE-027', 'CASE-070'],
    },
    {
      id: 'FB-09-MEANINGLESS-ENGLISH-EYEBROW-REPEAT',
      date: '2026-09-08',
      ownerSignal: '这个问题以前在普通网页就说过；无意义英文小标题增加人的认知负担。',
      disposition: 'ingest',
      rationale: 'owner 明确指出重复发生，failure family 必须升级为 hard。',
      eventIds: ['EVENT-20260908-MEANINGLESS-ENGLISH-EYEBROW'],
      caseIds: ['CASE-027', 'CASE-063'],
    },
    {
      id: 'FB-10-DEFENSIVE-NEGATION-OPENING',
      date: '2026-09-08',
      ownerSignal: '不要一上来就用“不是 / 不能 / 不要”反驳读者；先说发生了什么、我们做了什么。',
      disposition: 'ingest',
      rationale: '直接 briefing 反馈，补成 V2 Event；科学 caveat 仍贴近受约束 claim。',
      eventIds: ['EVENT-20260908-DEFENSIVE-NEGATION-OPENING'],
      caseIds: ['CASE-081'],
    },
    {
      id: 'FB-11-DECORATIVE-BUBBLES',
      date: '2026-09-08',
      ownerSignal: 'slide 上莫名的淡色气泡不要。',
      disposition: 'ingest',
      rationale: '拒绝不承担信息角色却抢注意力的装饰；功能性圆形不受影响。',
      eventIds: ['EVENT-20260908-DECORATIVE-BUBBLES'],
      caseIds: ['CASE-068', 'CASE-082'],
    },
    {
      id: 'FB-12-MECHANISM-DEPTH-WITHOUT-META-HARDCORE',
      date: '2026-09-08',
      ownerSignal: 'TaskVector 可以更技术，但不要在 slide 上写“这里可以更硬核一点”；公式、范数、真实参数和详细数据可以直接给。',
      disposition: 'ingest',
      rationale: '保留技术深度，同时拒绝自我表演式“硬核”元话术。',
      eventIds: ['EVENT-20260908-MECHANISM-DEPTH'],
      caseIds: ['CASE-082'],
    },
    {
      id: 'FB-13-ENGINEERING-GATE-PAGE-NOT-SCIENCE',
      date: '2026-09-08',
      ownerSignal: '“第一道门：先证明测量是真的”单独占一页，只让我看到修了工程问题，看不出科研上有多强。',
      disposition: 'merge-duplicate',
      rationale: '与 engineering-as-science-highlight 同机制，作为重复证据而非新 family。',
      eventIds: ['EVENT-20260908-ENGINEERING-AS-HIGHLIGHT', 'EVENT-20260909-MAINLINE-RIGOR-TAX'],
      caseIds: ['CASE-082'],
    },
    {
      id: 'FB-14-RIGOR-SHA-TO-TECHNICAL-DEPTH',
      date: '2026-09-09',
      ownerSignal: '工程严谨性、SHA 和重复性是实验成立的默认前提，不应该单独占一页当科研亮点；感兴趣的人再去技术子页看。',
      disposition: 'ingest',
      rationale: '显式重复工程主线问题，使 engineering-as-science-highlight 成为 hard family。',
      eventIds: ['EVENT-20260909-MAINLINE-RIGOR-TAX'],
      caseIds: ['CASE-082'],
    },
    {
      id: 'FB-15-SCIENCE-CHRONOLOGY',
      date: '2026-09-09',
      ownerSignal: '从 7B 起点讲到 1.7B / 3B，再讲 15→30、2048→4096、10+10 等小实验如何一步步排除解释，最后进入 GDR / DirectApply，这个故事会更清晰。',
      disposition: 'ingest',
      rationale: '正向 scientific-thinking 方向；仍是 promising，直到最终具体版本被接受。',
      eventIds: ['EVENT-20260909-CHRONOLOGY-SCIENCE-STORY'],
      caseIds: ['CASE-082'],
    },
    {
      id: 'FB-16-SCIENTIFIC-DECISION-CHAIN',
      date: '2026-09-09',
      ownerSignal: '遇到什么科学问题 → 怎么判断 → 做了什么实验 → 排除了什么解释 → 为什么进入下一步。',
      disposition: 'merge-duplicate',
      rationale: '与 chronology-with-scientific-judgment 同一核心机制，作为强化证据。',
      eventIds: ['EVENT-20260909-CHRONOLOGY-SCIENCE-STORY'],
      caseIds: ['CASE-082'],
    },
    {
      id: 'FB-17-HTML-NATIVE-DOM-DELIVERY',
      date: '2026-09-08',
      ownerSignal: '最终还是 HTML 页面；视觉参考可以借，但标题、表格、正文要是真实 HTML / CSS / DOM，不要把整套汇报做成图片。',
      disposition: 'page-specific-only',
      rationale: '这是 briefing 交付介质边界，不升级成所有设计工作的全局视觉偏好。',
      caseIds: ['CASE-082'],
    },
    {
      id: 'FB-18-FIXED-16-9-ALL-DEVICES',
      date: '2026-09-08',
      ownerSignal: '演讲稿按固定 16:9，手机也不要为了适配破坏构图。',
      disposition: 'superseded',
      rationale: '后续 owner 直接反馈明确要求手机适应窗口；旧规则保留为历史，不再作为 current authority。',
      caseIds: ['CASE-082'],
      supersededBy: 'FB-19-PARAMETER-TITLE-PHONE-DESKTOP-SPLIT',
    },
    {
      id: 'FB-19-PARAMETER-TITLE-PHONE-DESKTOP-SPLIT',
      date: '2026-09-09',
      ownerSignal: '标题不要用参数数字制造冲击；标题只写“我们把记忆容量翻倍了”，正文再强调“2048 → 4096”；手机按窗口宽度重排，桌面保持16:9且封顶1280×720、不随超宽屏无限拉伸。',
      disposition: 'ingest',
      rationale: '参数层级 + phone/desktop scope split；明确覆盖 FB-18。',
      eventIds: ['EVENT-20260909-PARAMETER-TITLE-AND-MOBILE-FIT'],
      caseIds: ['CASE-082'],
    },
    {
      id: 'FB-20-BRIEFING-SCAFFOLD',
      date: '2026-09-08',
      ownerSignal: '封面先给标题、日期、汇报人；第二页目录 + Too long, Don\'t read；中间页有页码，不要“下一页”按钮；最后把两条路线各自回答什么问题说清楚。',
      disposition: 'page-specific-only',
      rationale: '对这套 advisor briefing 的演讲脚手架有效，不推广成所有研究页面固定模板。',
      caseIds: ['CASE-082'],
    },
    {
      id: 'FB-21-PERSISTENT-OPENEVO-NAV',
      date: '2026-09-09',
      ownerSignal: 'study / flow / briefing 这些页面的导航栏应该一直显示，而且几个页面的导航语言要统一。',
      disposition: 'page-specific-only',
      rationale: '属于 OpenEVO 研究页族的信息架构要求，不升级成通用视觉偏好。',
    },
    {
      id: 'FB-22-WANDB-CHECKPOINT-CURVE',
      date: '2026-09-09',
      ownerSignal: '把 checkpoint 的 loss 和最终得分展示出来，画一条曲线，看它到底是慢慢收敛还是有上涨趋势；这能帮助说明分数低不是工程问题。',
      disposition: 'page-specific-only',
      rationale: '属于本次科学证据展示需求；是否长期使用取决于后续实验数据，不升级成全局图表规则。',
    },
    {
      id: 'FB-23-BUILD-PREVIEW-STATUS',
      date: '2026-09-09',
      ownerSignal: 'build失败 / 网页preview呢。',
      disposition: 'task-fact-not-preference',
      rationale: '这是临时交付/构建状态，不是可复用的人类表达偏好。',
    },
    {
      id: 'FB-24-FINAL-MERGE-AUTHORIZATION',
      date: '2026-09-09',
      ownerSignal: '继续推进 OpenEVO 夏季汇报的 BaseModel PR #569：如果 Vercel 和 GitHub Actions 都通过，就直接合并到 main；如果有失败，先修复后再合并。',
      disposition: 'ingest',
      rationale: '这是对通过 gate 的具体最终版本的 accepted 信号；没有 future-template 语言，所以不能升级为 canonical/Golden。',
      eventIds: ['EVENT-20260909-BRIEFING-FINAL-ACCEPTED'],
      caseIds: ['CASE-082'],
    },
    {
      id: 'FB-25-UNVERIFIED-MOBILE-169-ATTRIBUTION',
      date: '2026-09-09',
      ownerSignal: 'PR #594 claims: “实际复看 Preview 后，明确要求手机上也保持 16:9。”（当前 closeout 未能把这句话绑定到可核验的直接 owner turn）',
      disposition: 'ambiguous-hold',
      rationale: '该归因只存在于并发 draft PR 的 Agent-authored preference patch，并与已核验的后续直接反馈“手机端适应窗口、桌面封顶 1280×720”冲突；在获得直接 owner evidence 前不得升级为 current preference。',
    },
  ],
  futureTaskQuery:
    '给导师做下一轮科研汇报：讲清实验失败如何推进科学问题，参数机制可以用公式；手机要能读，桌面用于投影；不要让工程验证、英文小标签或参数数字抢主线。',
  expectedRetrievedSignals: [
    'intermediate-better-is-not-canonical',
    'meaningless-english-eyebrow',
    'numeric-shock-heading',
    'phone-vs-desktop-scope-split',
    'ambiguous-mobile-16-9-held',
    'technical-depth-without-meta-performance',
    'engineering-rigor-progressive-disclosure',
    'scientific-decision-chain',
  ],
  evaluationProof: {
    hardFamily: 'meaningless-english-eyebrow',
    mechanism: 'candidate receipt verifier rejects a candidate set that omits this hard family from hardFamiliesChecked',
  },
  automationGap:
    'Conversation-to-ledger extraction is still interpreted manually by the Agent because ChatGPT conversation turns are not exposed to a repository ingestion API. The repository now validates the structured ledger, cross-references, verdict/tier boundaries, retrieval proof, and evaluation proof fail-closed.',
};

export const HUMAN_FEEDBACK_INGESTION_CLOSEOUTS = [OPEN_EVO_BRIEFING_INGESTION_20260909];
