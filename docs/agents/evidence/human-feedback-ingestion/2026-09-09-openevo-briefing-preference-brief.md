# Human Preference Brief

Query: 给导师做下一轮科研汇报：讲清实验失败如何推进科学问题，参数机制可以用公式；手机要能读，桌面用于投影；不要让工程验证、英文小标签或参数数字抢主线。
Reader Contract: study-briefing

## Generation rules
- Do not start from generic Agent aesthetics; treat this brief as generation context before the first substantial draft.
- Hard failure families must be explicitly checked before owner review: attention-tax, engineering-as-science-highlight, mainline-rigor-tax, meaningless-english-eyebrow, missing-progressive-disclosure.
- Repeated failure families deserve proactive sibling-surface scanning: project-status-as-research-story.
- Silver visual references are directional evidence only; preserve what improved without treating them as approved templates.
- There is no Golden visual reference for this scope; do not claim an owner-approved template exists.
- Current-candidate visual references are under review only; never use them as preference evidence or let them override verified direct feedback.
- Ambiguous/held feedback is unresolved evidence, not a learned preference. Surface the conflict and do not resolve it by guessing.
- For material user-facing work, internally produce 2–3 candidates, rank them pairwise against this brief, and show the owner only the selected candidate.
- For visual work, every internal candidate needs a screenshot reference before pairwise ranking.
- After generation, run the existing blind cold read before revealing preference evidence, then run the preference comparison/judge.

## Hard failure families
- attention-tax
- engineering-as-science-highlight
- mainline-rigor-tax
- meaningless-english-eyebrow
- missing-progressive-disclosure

## Most relevant direct feedback events
- EVENT-20260909-MAINLINE-RIGOR-TAX · rejected · briefing-rigor-mainline
  owner: 工程严谨性、SHA 和重复性是实验成立的默认前提，不应该单独占一页当科研亮点；感兴趣的人再去技术子页看。
  scope: briefing, research-copy, visual
  mechanism: engineering-as-science-highlight, mainline-rigor-tax, missing-progressive-disclosure
- EVENT-20260909-PARAMETER-TITLE-AND-MOBILE-FIT · better · briefing-chronology-responsive-refinement
  owner: 整体效果比上一版好多了；参数数字不要放在标题里营造冲击力，手机端要适应窗口，桌面端保持有上限的演讲画布。
  scope: briefing, research-copy, visual, briefing-mobile, briefing-desktop
  mechanism: numeric-shock-heading, mobile-fixed-canvas-overflow, unbounded-desktop-scaling
- EVENT-20260909-CHRONOLOGY-SCIENCE-STORY · promising · briefing-chronology-science-story
  owner: 从 7B 起点讲到 1.7B / 3B，再讲 15→30、2048→4096、10+10 等小实验如何一步步排除解释，最后进入 GDR / DirectApply，这个故事会更清晰。
  scope: briefing, research-copy
  mechanism: project-status-as-research-story, chronology-with-scientific-judgment
- EVENT-20260908-ENGINEERING-AS-HIGHLIGHT · rejected · briefing-engineering-gate-highlight
  owner: 作为观众只看到解决了一个工程问题，看不出科研上有多强。
  scope: briefing, research-copy
  mechanism: engineering-as-science-highlight, missing-scientific-meaning
- EVENT-20260908-MEANINGLESS-ENGLISH-EYEBROW · rejected · briefing-english-eyebrows
  owner: 这个问题以前在普通网页就说过；无意义英文小标题增加人的认知负担。
  scope: all-public-ui, briefing, research-copy
  mechanism: meaningless-english-eyebrow, attention-tax
- EVENT-20260908-MECHANISM-DEPTH · promising · briefing-mechanism-math-depth
  owner: TaskVector 可以更技术，但不要在 slide 上写“这里可以更硬核一点”；公式、范数、真实参数和详细数据可以直接给。
  scope: briefing, research-copy
  mechanism: scientific-depth-preserved, meta-technical-performance
- EVENT-20260909-BRIEFING-FINAL-ACCEPTED · accepted · briefing-responsive-final-89fe1190
  owner: 继续推进 OpenEVO 夏季汇报的 BaseModel PR #569：如果 Vercel 和 GitHub Actions 都通过，就直接合并到 main；如果有失败，先修复后再合并。
  scope: briefing, research-copy, visual, briefing-mobile, briefing-desktop
  mechanism: none (positive/acceptance evidence)
- EVENT-20260908-BRIEFING-DENSE-STATUS · rejected · briefing-dense-status-v1
  owner: 看着心烦意乱，一点都看不进去；科研亮点也被项目状态淹没。
  scope: briefing, research-ui, visual
  mechanism: attention-competition, project-status-as-research-story
- EVENT-20260908-DEFENSIVE-NEGATION-OPENING · rejected · briefing-defensive-negation-opening
  owner: 不要一上来就用“不是 / 不能 / 不要”反驳读者；先说发生了什么、我们做了什么。
  scope: briefing, research-copy
  mechanism: defensive-negation-opening, anticipatory-rebuttal
- EVENT-20260908-NAKED-METRICS · rejected · briefing-naked-metrics
  owner: 49.33 / 58⁄128 没有单位和解释，观众不知道数字是什么意思。
  scope: briefing, research-copy
  mechanism: objectless-number, author-context-required

## Ambiguous / held feedback — do not guess
- FB-25-UNVERIFIED-MOBILE-169-ATTRIBUTION: PR #594 claims: “实际复看 Preview 后，明确要求手机上也保持 16:9。”（当前 closeout 未能把这句话绑定到可核验的直接 owner turn）
  hold reason: 该归因只存在于并发 draft PR 的 Agent-authored preference patch，并与已核验的后续直接反馈“手机端适应窗口、桌面封顶 1280×720”冲突；在获得直接 owner evidence 前不得升级为 current preference。

## Preference trajectories
- TRAJECTORY-BRIEFING-VISUAL-20260908: 最终 PR #569 的具体版本已得到合并授权，因此存在 accepted 结果；但 owner 没有说“以后按这版 / 作为模板”，所以仍没有 canonicalVariantId，也不能产生 Golden 视觉模板。
  - briefing-soft-slide-family > briefing-dense-status-v1: 柔和、留白和更明确的视觉中心明显降低第一眼压力。
  - briefing-soft-slide-family > briefing-overminimal-html: 用户要的是低竞争注意力，不是无设计、无色彩、无信息。
  - briefing-mechanism-math-depth > briefing-engineering-gate-highlight: 机制公式和定量对照直接展示科研设计；普通工程修复本身不构成科研亮点。
  - briefing-chronology-responsive-refinement > briefing-chronology-science-story: 用户明确说整体更好，但要求数字退出冲击式标题，同时手机端响应窗口、桌面端保持有上限的演讲画布。
  - briefing-responsive-final-89fe1190 > briefing-chronology-responsive-refinement: 最终 exact-head 版本在 GitHub Actions 与 Vercel 通过后得到明确合并授权；这是具体结果 accepted，不等于视觉模板 canonical。
  - briefing-chronology-science-story > briefing-rigor-mainline: 按科学问题演进讲负向实验与设计转折，比单独展示工程严谨性更能说明研究能力。

## Visual references
- REJECTED · VISUAL-BRIEFING-DENSE-REJECTED · sha=49ab2665ee7131dec7484063fd132198655da792 · /research/seed-openevo/study/briefing/
  用户明确报告注意力涣散、心烦意乱。
  boundary: 可 checkout 该 SHA 重建截图；不要把卡片墙和等权重信息块作为默认美学。
- SILVER · VISUAL-BRIEFING-SOFT-SILVER · sha=8bfb5bcdf42416d35eb4f64c5fd176022d6ae517 · /research/seed-openevo/study/briefing/
  对应“更柔和、多色、圆形”的正向方向；用户只说过明显更好，没有批准为最终模板。
  boundary: Silver 只表示方向性正反馈；不得写成“用户喜欢/已批准该模板”。
- REJECTED · VISUAL-BRIEFING-OVERMINIMAL-REJECTED · sha=bb9315bd71ee61e8c29afb5010753cc07202b485 · /research/seed-openevo/study/briefing/
  用户指出它比此前 slides 过度克制，颜色、圆形和信息量被削掉。
  boundary: 认知负担低 != 极简主义。
- SILVER · VISUAL-BRIEFING-FIXED16-INTERMEDIATE-SILVER · sha=caa35d010d16ce13fca12d23fec0bd7585397107 · PR=#569 · /research/seed-openevo/study/briefing/
  该候选成为后续科学叙事与响应式 refinement 的基线，但随后仍被参数标题与手机适配反馈继续修正。
  boundary: 历史中间版本；保留为 Silver 方向证据，不是最终版本，也不是模板。
- SILVER · VISUAL-BRIEFING-FINAL-ACCEPTED-SILVER · sha=89fe1190d0f92909f6da40b9a47ea75c9f45d2d5 · PR=#569 · /research/seed-openevo/study/briefing/
  owner 明确授权：exact-head 的 GitHub Actions 与 Vercel 通过后直接合并；随后 PR #569 已合入 main。
  boundary: 具体结果 accepted，但没有未来模板授权，所以仍是 Silver 而不是 Golden。最后一条可核验直接反馈要求桌面封顶 16:9、手机按窗口重排。
- CURRENT-CANDIDATE · VISUAL-BRIEFING-TRAINING-DYNAMICS-CURRENT-CANDIDATE · sha=88653a8de98c05f8da5529266ac3dd5589ea2222 · PR=#594 · /research/seed-openevo/study/briefing/
  当前 draft PR #594；未捕获到 owner 对该具体视觉版本的 accepted/canonical verdict。
  boundary: 仅表示正在评审的候选，不是偏好证据。该 draft 内部声称“手机也固定 16:9”的 owner correction 尚无法绑定到可核验直接 owner turn，因此保持 ambiguous-hold。

## Retrieved Preference Model
- PREF-RESEARCH-JUDGMENT 科研汇报展示研究判断，不展示项目管理流水账: 科研叙事按问题 → 假设 → 实验 → 结果 → 下一步判断组织；工程 gate 只在决定可解释性、可识别性或因果归因时进入主线。
- PREF-DIRECT-FACTS 事实和主题优先于主持人、叙事隐喻和防御性开场: 能直接说做了什么、发生了什么、结果是什么时，不用“怎样读 / 先看 / 分岔 / 这不是”等作者姿态抢第一理解层；参数细节也不应为了冲击力抢在自然语言对象之前。
- PREF-SCIENTIFIC-BOUNDARY 简化表达不能削弱科学边界: 结果先行，但 claim → evidence → inference → boundary 必须完整；不能为了好读把不可比、未授权、未证明或未知状态藏掉。
- PREF-PROGRESSIVE-DISCLOSURE 按阅读时机分层，不把分层本身做成模板: 首层只给开始理解所需的信息；可恢复的背景、provenance 和深层机制后置，但不要机械制造“一句话看懂 / 专业解释”等可见层级。
- PREF-FIRST-SCREEN-ATTENTION 一个首屏只承担一个主要理解任务: 字号、加粗、卡片、CTA、导航和 provenance 都在消耗注意力；第一屏应只有一个明显认知中心。
- PREF-INLINE-TERMINOLOGY 术语在第一次出现的位置就地解释: 能不用内部代号就不用；必须保留时先给人类名称，再在当前句附近解释它在这里做什么。

## Retrieved Gold Pairs
- PAIR-082-RESEARCH-NARRATIVE
  rejected: 实验系统 / 质量体系 / 推进节奏 / 当前阻塞
  accepted: 能力上限 → 参数机制 → 因果控制
- PAIR-082-ENGINEERING-DEPTH
  rejected: 固定 GPU 确定性 PASS / SHA / replay hash 单独占主演讲页
  accepted: 现在终于可以公平比较 GDR 和直接应用更新了；SHA / 重复性证据放技术页或按需证据层
- PAIR-082-PARAMETER-HEADING
  rejected: 2048 → 4096：容量实验
  accepted: 我们把记忆容量翻倍了（正文保留并强调 2048 → 4096）
- PAIR-081-DEFENSIVE-OPENING
  rejected: 质量不是“页面做得漂亮”或“GPU 跑得满”。
  accepted: 我们把实验质量拆成四层：科学设计、工程门禁、证据身份和对外表达。每一层都有可追溯的证据，也都有明确的停止条件。
- PAIR-068-ATTENTION
  rejected: 研究问题 / 为什么重要 / 从哪里开始 / 什么时候结束 / 现在到哪了
  accepted: 7B 持续更新参数，并完成最终测试；旧 3B 因购物接口和动作格式问题停止。
- PAIR-067-METAPHOR
  rejected: 第一轮购物学习：7B 与 3B 的分岔
  accepted: 3B 和 7B 的第一轮购物实验

## Anti-overgeneralization boundaries
- 不是禁止关系词；先建立关系两端后，准确关系仍应保留。
- 内部代号在 provenance、复现和审计层仍可精确保留。
- 真实研究问题可以是问句。
- 真正改变科学解释的否定句和 caveat 必须保留，并贴近所约束的 claim。
- 能建立正确心智模型的必要类比不是禁用项。
- LoRA / RL / GDR / TaskVector 等真实技术对象不是禁用项；要删的是不增加信息的英文装饰标签。
- 不是禁止标题出现数字；当数字本身就是主要科研结果（例如最终分数或 44→7 的准入瓶颈）时可以前置。具体实现参数若能先用自然语言说清，则把精确数值放在正文。
- 不是越少越好；必须默认可见的科学边界、比较双方和当前状态不能为了简洁被藏掉。
- 首屏预算是报警器，不替代真人 cold read。
- 不是 minimalism；exactly enough 比“越空越好”更重要。
- 会改变结论含义的 caveat 不能被当成次要背景折叠。
- 不是删除专业词；精确术语在需要时必须保留。
- 集中 glossary 可以做参考工具，但不能成为主阅读路径。
- 不是用否定句淹没开场；边界应贴着它真正约束的 claim。
- 训练过程信号、最终评测和外部文献参照必须保持不同证据层。
- 不是删除工程证据；当工程事实决定实验是否有效时，它就是科学叙事的一部分。
- “像汇报”描述信息节奏；桌面端可保留固定 16:9 演讲构图并设置宽度上限，但手机端应优先适应窗口和可读性，不把 1280×720 画布强塞进窄屏。
- 降低认知负担不等于降低科研深度；机制页可以用公式、真实参数和定量阈值，只要它们直接回答研究问题。
