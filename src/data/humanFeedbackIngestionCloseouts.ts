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
  scopes?: string[];
  eventIds?: `EVENT-${string}`[];
  caseIds?: `CASE-${string}`[];
  preferenceIds?: `PREF-${string}`[];
  pairIds?: `PAIR-${string}`[];
  visualReferenceIds?: `VISUAL-${string}`[];
  supersededBy?: `FB-${string}`;
  excludedSubsignals?: string[];
}

export type HumanFeedbackIngestionCloseoutSchema =
  | 'human-feedback-ingestion-closeout.v1'
  | 'human-feedback-ingestion-closeout.v2';

export interface HumanFeedbackIngestionSourceWindow {
  start: string;
  end: string;
  route: string;
  pullRequest: number;
  finalAcceptedHead?: string;
  mergedMainCommit?: string;
  finalOwnerVisibleHead?: string;
  mainAtCloseout?: string;
  finalVerdict?: 'accepted' | 'current-candidate';
}

export interface HumanFeedbackIngestionCloseoutRecord {
  id: `INGESTION-${string}`;
  schema: HumanFeedbackIngestionCloseoutSchema;
  task: string;
  sourceWindow: HumanFeedbackIngestionSourceWindow;
  predecessorIngestionIds?: `INGESTION-${string}`[];
  candidateFeedbackSignals: number;
  ledger: FeedbackCoverageLedgerItem[];
  futureTaskQuery: string;
  expectedRetrievedSignals: string[];
  evaluationProof: {
    hardFamily?: string;
    failureFamily?: string;
    pairId?: `PAIR-${string}`;
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
    end: '2026-09-09T04:30:36Z',
    route: '/research/seed-openevo/study/briefing/',
    pullRequest: 569,
    finalAcceptedHead: '89fe1190d0f92909f6da40b9a47ea75c9f45d2d5',
    mergedMainCommit: '2471d63593df808040a62a83654c360ceb9e38d2',
  },
  candidateFeedbackSignals: 29,
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
      eventIds: ['EVENT-20260908-MECHANISM-DEPTH', 'EVENT-20260909-TECHNICAL-DEPTH-WITHOUT-META'],
      caseIds: ['CASE-082'],
      preferenceIds: ['PREF-TECHNICAL-DEPTH-WITHOUT-META'],
      pairIds: ['PAIR-082-TECHNICAL-WITHOUT-META'],
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
      preferenceIds: ['PREF-RESEARCH-JUDGMENT', 'PREF-PROGRESSIVE-DISCLOSURE'],
      pairIds: ['PAIR-082-ENGINEERING-DEPTH'],
    },
    {
      id: 'FB-15-SCIENCE-CHRONOLOGY',
      date: '2026-09-09',
      ownerSignal: '从 7B 起点讲到 1.7B / 3B，再讲 15→30、2048→4096、10+10 等小实验如何一步步排除解释，最后进入 GDR / DirectApply，这个故事会更清晰。',
      disposition: 'ingest',
      rationale: '正向 scientific-thinking 方向；仍是 promising，直到最终具体版本被接受。',
      eventIds: ['EVENT-20260909-CHRONOLOGY-SCIENCE-STORY'],
      caseIds: ['CASE-082'],
      preferenceIds: ['PREF-RESEARCH-JUDGMENT'],
      pairIds: ['PAIR-082-CHRONOLOGICAL-SCIENCE-STORY'],
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
      eventIds: ['EVENT-20260908-FIXED-DECK-ALL-DEVICES'],
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
      preferenceIds: ['PREF-DIRECT-FACTS', 'PREF-BRIEFING-DEVICE-SCOPE'],
      pairIds: ['PAIR-082-PARAMETER-HEADING', 'PAIR-082-DEVICE-SCOPE'],
      visualReferenceIds: ['VISUAL-BRIEFING-CHRONOLOGY-SILVER'],
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
      id: 'FB-22-HORIZON-BEHAVIOR-MUST-BE-VISIBLE',
      date: '2026-09-09',
      ownerSignal: 'slide07写得还是有问题，你应该写出来，我们当时实际看了15、30步，都是在固定那几个动作打转，然后30步了还是打转，那我们就知道问题不在这里了，这个类型的细节要说出来。',
      disposition: 'ingest',
      rationale: '补足旧 chronology 抽象：负向诊断必须展示真实行为证据，说明为什么能排除“只是步数太少”。',
      eventIds: ['EVENT-20260909-DIAGNOSTIC-BEHAVIOR-EVIDENCE'],
      caseIds: ['CASE-082', 'CASE-084'],
      preferenceIds: ['PREF-RESEARCH-JUDGMENT', 'PREF-DIAGNOSTIC-CLOSURE'],
      pairIds: ['PAIR-084-DIAGNOSTIC-CLOSE-LOOP'],
    },
    {
      id: 'FB-23-IPHONE-REFLOW-REPEAT',
      date: '2026-09-09',
      ownerSignal: 'iPhone要自适应宽度，就是在iPhone上看，宽度应该是对齐的，我自己选择放大或者怎么样，不要我再去横着滑动。',
      disposition: 'ingest',
      rationale: '第二次直接 phone-scope 证据：手机宽度要对齐、默认不横滑，并允许用户自行放大；这把中间 phone-reflow 解释进一步收窄为“同一 16:9 slide 整张 fit-to-width”，不扩成所有网页的固定布局政策。',
      eventIds: ['EVENT-20260909-MOBILE-WHOLE-SLIDE-FIT-REPEAT'],
      caseIds: ['CASE-082'],
      preferenceIds: ['PREF-BRIEFING-DEVICE-SCOPE'],
      pairIds: ['PAIR-082-DEVICE-SCOPE'],
    },
    {
      id: 'FB-24-FINAL-MERGE-AUTHORIZATION',
      date: '2026-09-09',
      ownerSignal: '虽然做的不是100完成，先合并进main',
      disposition: 'ingest',
      rationale: '这是对当前具体版本的明确合并授权；“不是100完成”同时明确阻止把它升级为 canonical/Golden。',
      eventIds: ['EVENT-20260909-BRIEFING-FINAL-ACCEPTED'],
      caseIds: ['CASE-082'],
      visualReferenceIds: ['VISUAL-BRIEFING-FINAL-ACCEPTED-SILVER'],
    },
    {
      id: 'FB-25-SLIDE-SOURCE-OF-TRUTH',
      date: '2026-09-08',
      ownerSignal: '为什么没有按照你前面对话发给我的 slide 做？',
      disposition: 'page-specific-only',
      rationale: '只能恢复到邻近 assistant 对 owner 意图的复述，无法验证 direct owner 原句；保留为本页实现历史，但不作为 supersession 或长期规则证据。',
      caseIds: ['CASE-082'],
      excludedSubsignals: ['no verified direct-owner wording; do not promote this reconstructed sentence into Preference Model or Gold Pairs'],
    },
    {
      id: 'FB-26-SLIDE-HTML-HYBRID',
      date: '2026-09-08',
      ownerSignal: '两者中和一下。',
      disposition: 'page-specific-only',
      rationale: '这是本 briefing 的视觉实现方向：承接 slide 的注意力结构，同时保留 HTML 的真实 DOM/链接/可访问性；不推广成所有网页都应做成 slides。',
      caseIds: ['CASE-082'],
    },
    {
      id: 'FB-27-PREFERENCE-LEARNING-MUST-ACCUMULATE',
      date: '2026-09-09',
      ownerSignal: '我希望你能把这个库维护好，然后从这个库里学习，然后越来越变得更加聪明一些、更加符合我的要求一些。',
      disposition: 'merge-duplicate',
      rationale: '强化 CASE-083：CASE 存档不等于学习，真人反馈必须改变下一次 first draft 的 retrieval 与 owner-review 前的 evaluation。',
      caseIds: ['CASE-083'],
      preferenceIds: ['PREF-FEEDBACK-LEARNING-LOOP'],
      pairIds: ['PAIR-083-LEARNING-LOOP'],
    },
    {
      id: 'FB-28-LAND-WORKFLOW-THEN-APPLY',
      date: '2026-09-09',
      ownerSignal: '那好的，那我们把这个工作流应用先落地，然后再应用。',
      disposition: 'task-fact-not-preference',
      rationale: '这是本次任务的执行顺序授权，不足以推导成所有未来页面任务都必须先改偏好系统再做产品工作。',
      caseIds: ['CASE-083'],
    },
    {
      id: 'FB-29-THREE-B-EXPERIMENT-EXISTS',
      date: '2026-09-09',
      ownerSignal: '我记得除了“OpenEVO （1.7B，GDR 筛选）”我们应该还做过 3B 的实验，对吗？',
      disposition: 'task-fact-not-preference',
      rationale: '这是对实验资产/科学事实的核对，不代表长期表达或视觉偏好；后续叙事偏好由 FB-15 单独吸收。',
      scopes: ['briefing'],
    },
  ],
  futureTaskQuery:
    '准备一场新的科研组会，介绍一个强化学习机制排查项目。听众懂机器学习，但不了解项目内部工程。汇报里有几个负结果、几次超参数调整和小型诊断实验，机制部分需要少量公式；同一份 HTML 需要能在手机阅读，也要在会议室大屏展示。请给出第一版结构与表达方案。',
  expectedRetrievedSignals: [
    'intermediate-better-is-not-canonical',
    'meaningless-english-eyebrow',
    'numeric-shock-heading',
    'phone-vs-desktop-scope-split',
    'technical-depth-without-meta-performance',
    'engineering-rigor-progressive-disclosure',
    'scientific-decision-chain',
    'internal-detail-primary-attention',
    'concrete-accepted-is-not-canonical',
  ],
  evaluationProof: {
    hardFamily: 'internal-detail-promoted-to-primary-attention',
    mechanism: 'candidate receipt verifier rejects a candidate set that omits the cross-form hard family from hardFamiliesChecked',
  },
  automationGap:
    'Conversation-to-ledger extraction is still interpreted manually by the Agent because ChatGPT conversation turns are not exposed to a repository ingestion API. The repository now validates the structured ledger, cross-references, verdict/tier boundaries, retrieval proof, and evaluation proof fail-closed.',
};


export const OPEN_EVO_BRIEFING_SUCCESSOR_INGESTION_20260909: HumanFeedbackIngestionCloseoutRecord = {
  id: 'INGESTION-20260909-OPENEVO-BRIEFING-SUCCESSOR',
  schema: 'human-feedback-ingestion-closeout.v2',
  task: 'OpenEVO briefing successor: diagnostic closure, training dynamics, and iterative review workflow',
  sourceWindow: {
    start: '2026-09-09T04:30:37Z',
    end: '2026-09-09T06:34:17Z',
    route: '/research/seed-openevo/study/briefing/',
    pullRequest: 594,
    finalOwnerVisibleHead: 'e5d8a184c25cd49d0264efe8881cc02b302d9c51',
    mainAtCloseout: '6b6f58ae62b69edadc8b72949a0456bed2815cc2',
    finalVerdict: 'current-candidate',
  },
  predecessorIngestionIds: ['INGESTION-20260909-OPENEVO-BRIEFING'],
  candidateFeedbackSignals: 8,
  ledger: [
    {
      id: 'FB-S2-01-BUILD-FAILED-STATUS',
      date: '2026-09-09',
      ownerSignal: 'build失败',
      disposition: 'task-fact-not-preference',
      rationale: '单次构建失败是交付状态；长期 workflow 偏好由后续“每次 build 怎么这么久”和 future-default 指令单独吸收。',
    },
    {
      id: 'FB-S2-02-CHECKPOINT-WANDB-CURVE',
      date: '2026-09-09',
      ownerSignal: '我们的训练过程不是会有很多 checkpoint 吗？把这些 checkpoint 的 loss 和最终得分展示出来，画一条曲线，看它到底是慢慢收敛，还是有上涨趋势。这个应该跟当时的 W&B 相关很大。',
      disposition: 'ingest',
      rationale: '吸收“用连续训练证据解释低分”的科研表达方向；保持 loss / 在线任务表现 / frozen final eval 三层边界，不能据此证明所有工程问题都不存在。',
      eventIds: ['EVENT-20260909-TRAINING-DYNAMICS-EVIDENCE'],
      caseIds: ['CASE-084'],
      preferenceIds: ['PREF-DIAGNOSTIC-CLOSURE', 'PREF-SCIENTIFIC-BOUNDARY'],
      visualReferenceIds: ['VISUAL-BRIEFING-DYNAMICS-CURRENT-CANDIDATE'],
    },
    {
      id: 'FB-S2-03-PREVIEW-MISSING',
      date: '2026-09-09',
      ownerSignal: '网页preview呢',
      disposition: 'task-fact-not-preference',
      rationale: '这是对当轮交付缺失的追问；可复用的审阅速度规则由 FB-S2-06/07 承担。',
    },
    {
      id: 'FB-S2-04-FAILURE-STATUS',
      date: '2026-09-09',
      ownerSignal: '失败了吗',
      disposition: 'task-fact-not-preference',
      rationale: '这是当前部署状态询问，不升级为表达或视觉规则。',
    },
    {
      id: 'FB-S2-05-DIAGNOSTIC-RESOLUTION-MISSING',
      date: '2026-09-09',
      ownerSignal: 'slide07 你也没说这个问题我们怎么解决的',
      disposition: 'ingest',
      rationale: '第二个同机制纠正：诊断页不能只排除一个解释，还要说我们停止继续调什么、转向什么，以及“解决错误诊断”与“解决最终低分”的边界。',
      eventIds: ['EVENT-20260909-DIAGNOSTIC-MISSING-RESOLUTION'],
      caseIds: ['CASE-082', 'CASE-084'],
      preferenceIds: ['PREF-DIAGNOSTIC-CLOSURE', 'PREF-RESEARCH-JUDGMENT'],
      pairIds: ['PAIR-084-DIAGNOSTIC-CLOSE-LOOP'],
    },
    {
      id: 'FB-S2-06-FULL-BUILD-TOO-SLOW',
      date: '2026-09-09',
      ownerSignal: '每次build怎么这么久 能不能加快一点',
      disposition: 'ingest',
      rationale: '拒绝把最终全量验收用于每次小修改的人审反馈环；问题机制是 review 与 release acceptance 混用。',
      eventIds: ['EVENT-20260909-FULL-GATE-ITERATION-LATENCY'],
      caseIds: ['CASE-085'],
      preferenceIds: ['PREF-FAST-REVIEW-PREVIEW'],
      pairIds: ['PAIR-085-FAST-REVIEW-PREVIEW'],
    },
    {
      id: 'FB-S2-07-FAST-PREVIEW-FUTURE-DEFAULT',
      date: '2026-09-09',
      ownerSignal: '把这个规则合并到main或者怎么样 我希望以后都这样改',
      disposition: 'ingest',
      rationale: '明确 future-default 语言，足以把 BaseModel 的快速 review Preview 工作流升级为 canonical；不涉及视觉 Golden。',
      eventIds: ['EVENT-20260909-FAST-PREVIEW-FUTURE-DEFAULT'],
      caseIds: ['CASE-085'],
      preferenceIds: ['PREF-FAST-REVIEW-PREVIEW'],
      pairIds: ['PAIR-085-FAST-REVIEW-PREVIEW'],
    },
    {
      id: 'FB-S2-08-HPL-CLOSEOUT-SUCCESS-CRITERION',
      date: '2026-09-09',
      ownerSignal: '未来完全不同的 Agent 在没有读过本对话的情况下，只依赖 current main，也应该能在第一次生成时明显更接近我的要求，并减少我重复纠正同一类问题的次数。',
      disposition: 'merge-duplicate',
      rationale: '强化既有 CASE-083 / PREF-FEEDBACK-LEARNING-LOOP；这是 HPL 的成功指标，不创建新的近义 workflow family。',
      caseIds: ['CASE-083'],
      preferenceIds: ['PREF-FEEDBACK-LEARNING-LOOP'],
      pairIds: ['PAIR-083-LEARNING-LOOP'],
    },
  ],
  futureTaskQuery: '下一次我要做一场新的机器人强化学习诊断组会：有若干负向实验、连续训练 checkpoint，还会和导师快速来回看网页草稿。请设计第一次汇报和审阅流程，让人能看出为什么排除了某个解释、训练过程是否在学，同时适合手机和会议室屏幕。',
  expectedRetrievedSignals: [
    'diagnostic-observation-to-decision',
    'training-dynamics-evidence-layers',
    'mobile-whole-slide-fit-repeat',
    'fast-review-preview-canonical-workflow',
    'current-candidate-is-not-accepted',
    'scientific-decision-chain',
    'phone-vs-desktop-scope-split',
  ],
  evaluationProof: {
    failureFamily: 'incomplete-scientific-decision-loop',
    pairId: 'PAIR-084-DIAGNOSTIC-CLOSE-LOOP',
    mechanism: 'preference judge must reject a PASS receipt that is rejected-like against the diagnostic-close-loop Gold Pair, then pass after the recurrence is repaired',
  },
  automationGap: 'Conversation-to-ledger extraction is still manually interpreted because the repository has no direct ChatGPT turn-export API. The v2 record adds an honest current-candidate closure state so an unfinished page cannot be mislabeled accepted; repository code validates coverage, retrieval, scope/tier boundaries, and evaluation-side recurrence rejection.',
};

export const HUMAN_FEEDBACK_INGESTION_CLOSEOUTS = [
  OPEN_EVO_BRIEFING_INGESTION_20260909,
  OPEN_EVO_BRIEFING_SUCCESSOR_INGESTION_20260909,
];
