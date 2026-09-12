# Human Preference Brief

Query: Text Memory 研究进展 证据 R104 R122 ELI5 中文 一页 不编造结果
Reader Contract: study-briefing

## Generation rules
- Do not start from generic Agent aesthetics; treat this brief as generation context before the first substantial draft.
- Hard failure families must be explicitly checked before owner review: anticipatory-rebuttal, attention-tax, compressed-shorthand-heading, defensive-negation-opening, engineering-as-science-highlight, incomplete-scientific-decision-loop, internal-detail-promoted-to-primary-attention, mainline-rigor-tax, meaningless-english-eyebrow, missing-progressive-disclosure, numeric-shock-heading, project-status-as-research-story, reference-surface-imitation.
- Repeated failure families deserve proactive sibling-surface scanning: cross-experiment-legend-relearning, inconsistent-experiment-chart-grammar, mobile-fixed-canvas-overflow, presenter-language, technical-detail-wrong-layer.
- Silver visual references are directional evidence only; preserve what improved without treating them as approved templates.
- There is no Golden visual reference for this scope; do not claim an owner-approved template exists.
- Current-candidate visual references are still under review; use them only as evidence of the live iteration state, never as accepted or Golden preference.
- For material user-facing work, internally produce 2–3 candidates, rank them pairwise against this brief, and show the owner only the selected candidate.
- For visual work, every internal candidate needs a screenshot reference before pairwise ranking.
- After generation, run the existing blind cold read before revealing preference evidence, then run the preference comparison/judge.

## Hard failure families
- anticipatory-rebuttal
- attention-tax
- compressed-shorthand-heading
- defensive-negation-opening
- engineering-as-science-highlight
- incomplete-scientific-decision-loop
- internal-detail-promoted-to-primary-attention
- mainline-rigor-tax
- meaningless-english-eyebrow
- missing-progressive-disclosure
- numeric-shock-heading
- project-status-as-research-story
- reference-surface-imitation

## Most relevant direct feedback events
- EVENT-20260909-BRIEFING-METHOD-CONTEXT · promising · briefing-results-with-assumed-method-context
  owner: 虽然我的网站里其他页面画了有关 SEED 是怎么做的，OpenEVO 是怎么做的，我觉得还是有必要向我的观众解释一下 OpenEVO 的两个阶段，比方说轨迹采集、MiniMax 的老式分析，以及 Agent System、Text Memory、SD-LoRA、OPSD 这堆东西，训练是怎么训练的还是要跟大家说一声。
  mechanism: briefing-method-context-assumed, cross-page-context-dependency
- EVENT-20260909-MAINLINE-RIGOR-TAX · rejected · briefing-rigor-mainline
  owner: 工程严谨性、SHA 和重复性是实验成立的默认前提，不应该单独占一页当科研亮点；感兴趣的人再去技术子页看。
  mechanism: engineering-as-science-highlight, mainline-rigor-tax, missing-progressive-disclosure, internal-detail-promoted-to-primary-attention
- EVENT-20260909-BRIEFING-STORYLINE-DIAGNOSTIC-ENTRY · rejected · briefing-diagnostic-intervention-first-0aa9693c
  owner: “为什么后来会去改‘15 步’和 Text Memory？”这个不符合人类说话的习惯。我们的分数很低，先去日志里看有没有什么问题；然后讲我们发现了一些具体问题；最后再讲怎么去改这个步数，还有 Text Memory。
  mechanism: intervention-before-problem, presenter-language
- EVENT-20260909-BRIEFING-STORYLINE-ENGLISH-GLUE · rejected · briefing-storyline-label-first-a83eb0da
  owner: “composed state”也是没必要的专业名词。Agent 或 SD-LoRA 这种算有必要的专业名词；不能假设每个人英语很好，我都看不出来 composed state 是什么意思。
  mechanism: jargon-memory-load, internal-detail-promoted-to-primary-attention
- EVENT-20260909-DIAGNOSTIC-MOTIVATION-MISSING · rejected · briefing-intervention-before-observed-problem
  owner: “多给 15 步，模型还是在几个导航动作里打转”这一页，前面都没说是什么问题，你就直接说我们为什么要多给 15 步，这个没说清楚；15→30、4096、20→10+10 都应该先说我们当时碰见了什么问题，才会去做这些处理。
  mechanism: incomplete-scientific-decision-loop, intervention-before-observed-problem
- EVENT-20260909-BRIEFING-SCIENCE-CHECKLIST-REJECTED · rejected · briefing-pr605-final-merged-rejected-56b5120
  owner: 不要把“科学尝试”页做成数字清单；应拆成几张 slide。
  mechanism: project-status-as-research-story, story-compression-hides-causal-sequence
- EVENT-20260909-DIAGNOSTIC-BEHAVIOR-EVIDENCE · rejected · briefing-horizon-scalar-only
  owner: slide07写得还是有问题，你应该写出来，我们当时实际看了15、30步，都是在固定那几个动作打转，然后30步了还是打转，那我们就知道问题不在这里了，这个类型的细节要说出来。
  mechanism: incomplete-scientific-decision-loop, diagnostic-conclusion-without-observed-evidence
- EVENT-20260909-BRIEFING-STORYLINE-SUMMARY-DIRECTION · promising · briefing-storyline-human-causal-670ab9b4
  owner: 目录后面加一页，放我们尝试了哪些科学语义改变的实验或方法；最后也加一页我们做了哪些技术工作。都用接近目录的数字序号、大粗字体和短语，保持简单。
  mechanism:
- EVENT-20260909-7B-64-UPDATE-RESEARCH-PIVOT · promising · briefing-7b-curve-without-64-pivot
  owner: “7B：训练过程明显学起来，但冻结终评仍是 49.33”这页要加上当时我们突破了 64 次的 SD-LoRA 更新，然后我们当时怎么思考的、学长是怎么说的。
  mechanism: milestone-without-research-meaning
- EVENT-20260909-BRIEFING-604-ACCEPTED · accepted · briefing-method-context-unified-charts-59f46044
  owner: 先合并进main里。
  mechanism:
- EVENT-20260908-BRIEFING-DENSE-STATUS · rejected · briefing-dense-status-v1
  owner: 看着心烦意乱，一点都看不进去；科研亮点也被项目状态淹没。
  mechanism: attention-competition, project-status-as-research-story
- EVENT-20260908-NAKED-METRICS · rejected · briefing-naked-metrics
  owner: 49.33 / 58⁄128 没有单位和解释，观众不知道数字是什么意思。
  mechanism: objectless-number, author-context-required
- EVENT-20260908-ENGINEERING-AS-HIGHLIGHT · rejected · briefing-engineering-gate-highlight
  owner: 作为观众只看到解决了一个工程问题，看不出科研上有多强。
  mechanism: engineering-as-science-highlight, missing-scientific-meaning
- EVENT-20260908-MEANINGLESS-ENGLISH-EYEBROW · rejected · briefing-english-eyebrows
  owner: 这个问题以前在普通网页就说过；无意义英文小标题增加人的认知负担。
  mechanism: meaningless-english-eyebrow, attention-tax, internal-detail-promoted-to-primary-attention
- EVENT-20260908-MECHANISM-DEPTH · promising · briefing-mechanism-math-depth
  owner: TaskVector、范数和参数机制这里可以稍微硬核，加入 LaTeX 公式和详细数据。
  mechanism: scientific-depth-preserved
- EVENT-20260910-NOGDR-CHART-GRAMMAR-REPEAT · rejected · briefing-nogdr-summary-cards-0ff4b053
  owner: 我新实验也得用在html表现和其他实验一样的分数loss表
  mechanism: inconsistent-experiment-chart-grammar, cross-experiment-legend-relearning
- EVENT-20260910-BRIEFING-UNNAMED-DIAGNOSTIC-REFERENT · rejected · briefing-sdlora-unnamed-diagnostic-referent
  owner: 《为了判断问题是不是 SD-LoRA 独有》这里也讲清什么问题是不是 SD 罗拉独有。
  mechanism: unnamed-scientific-referent
- EVENT-20260909-CHRONOLOGY-SCIENCE-STORY · promising · briefing-chronology-science-story
  owner: 从 7B 起点讲到 1.7B / 3B，再讲 15→30、2048→4096、10+10 等小实验如何一步步排除解释，最后进入 GDR / DirectApply，这个故事会更清晰。
  mechanism: project-status-as-research-story, chronology-with-scientific-judgment
- EVENT-20260909-PARAMETER-TITLE-AND-MOBILE-FIT · better · briefing-chronology-science-story
  owner: 目前整体效果比上一版好多了；2048~4096 不要放标题，直接说“我们把记忆容量翻倍了”，具体参数放正文加粗；手机端适应窗口，电脑端不要随超宽屏无限放大。
  mechanism: numeric-shock-heading, mobile-fixed-canvas-overflow, unbounded-desktop-scaling, internal-detail-promoted-to-primary-attention
- EVENT-20260909-TECHNICAL-DEPTH-WITHOUT-META · better · briefing-mechanism-technical-metric
  owner: “这里可以更硬核一点”我们自己知道就行，没有必要向老师展示；可以换成“我们采用一个更技术性的指标”。GDR 只放简单公式，更硬核的推导单独放 BaseModel 子网页。
  mechanism: meta-technical-performance, technical-detail-wrong-layer
- EVENT-20260909-BRIEFING-FINAL-ACCEPTED · accepted · briefing-responsive-final-89fe1190
  owner: 虽然做的不是100完成，先合并进main
  mechanism:
- EVENT-20260909-MOBILE-WHOLE-SLIDE-FIT-REPEAT · rejected · briefing-phone-horizontal-scroll
  owner: iPhone要自适应宽度，就是在iPhone上看，宽度应该是对齐的，我自己选择放大或者怎么样，不要我再去横着滑动。
  mechanism: mobile-fixed-canvas-overflow
- EVENT-20260909-TRAINING-DYNAMICS-EVIDENCE · promising · briefing-training-dynamics-request
  owner: 我们的训练过程不是会有很多 checkpoint 吗？把这些 checkpoint 的 loss 和最终得分展示出来，画一条曲线，看它到底是慢慢收敛，还是有上涨趋势；这个应该跟当时的 W&B 相关很大。
  mechanism: final-score-without-training-dynamics, evidence-layer-conflation
- EVENT-20260909-DIAGNOSTIC-MISSING-RESOLUTION · rejected · briefing-diagnostic-no-resolution
  owner: slide07 你也没说这个问题我们怎么解决的
  mechanism: incomplete-scientific-decision-loop, diagnostic-result-without-next-action
- EVENT-20260909-PHONE-INTERNAL-CANVAS-SQUEEZED · rejected · briefing-phone-outer-fit-inner-squeezed
  owner: 现在你做到了这个 slide 的宽度是适应手机屏幕的宽度，这很好。但是里面的内容却因为挤压而显示不完全。我想要的就是电脑上的 slide 的宽度等比例缩小到手机上，这样的效果。
  mechanism: presentation-canvas-not-scaled-as-unit
- EVENT-20260909-BRIEFING-STORYLINE-SHORTHAND-REPEAT · rejected · briefing-storyline-label-first-a83eb0da
  owner: “7 < 8：不是模型没有成功经验，而是一个控制门槛挡住了长期训练”又是这种先给了一个数字，然后后面再做解释，这不是人类说话的习惯。直接说我们训练了很久，但是一直没有更新参数，然后再开始找原因。
  mechanism: compressed-shorthand-heading, numeric-shock-heading, internal-detail-promoted-to-primary-attention
- EVENT-20260909-BRIEFING-BINARY-CONTRAST-REPEAT · rejected · briefing-binary-contrast-recurrence-e9b767d4
  owner: Slide 的第3页还是犯了“不是……而是……”这样的错误。再照着这个标准看一看，然后改。
  mechanism: defensive-negation-opening, anticipatory-rebuttal
- EVENT-20260909-BRIEFING-TASKVECTOR-DETAIL-LAYER-REJECTED · rejected · briefing-pr605-final-merged-rejected-56b5120
  owner: 这轮 hard-failure 不是“建议”，是必须修掉：TaskVector 页面现在太像数学附录。主 deck 只保留 v = θ_after − θ_before、参数变化的 norm、更新方向的 cosine；完整 Gram matrix、Frobenius geometry、R14/R27/R49、random norm-matched controls、identifiability gate 全部下沉 technical-notes。
  mechanism: technical-detail-wrong-layer, internal-detail-promoted-to-primary-attention, missing-progressive-disclosure
- EVENT-20260908-DEFENSIVE-NEGATION-OPENING · rejected · briefing-defensive-negation-opening
  owner: 不要一上来就用“不是 / 不能 / 不要”反驳读者；先说发生了什么、我们做了什么。
  mechanism: defensive-negation-opening, anticipatory-rebuttal

## Preference trajectories
- TRAJECTORY-BRIEFING-VISUAL-20260908: PR #569 与后续 PR #604 都有 concrete acceptance；最新 accepted visual 是 59f46044。owner 从未说“以后按这版 / 作为模板”，所以仍没有 canonicalVariantId，也没有 Golden 视觉模板。
  - briefing-soft-slide-family > briefing-dense-status-v1: 柔和、留白和更明确的视觉中心明显降低第一眼压力。
  - briefing-soft-slide-family > briefing-overminimal-html: 用户要的是低竞争注意力，不是无设计、无色彩、无信息。
  - briefing-mechanism-technical-metric > briefing-engineering-gate-highlight: 机制公式和定量对照直接展示科研设计；普通工程修复本身不构成科研亮点，技术深度也不需要“更硬核”元话术。
  - briefing-chronology-science-story > briefing-rigor-mainline: 按科学问题演进讲负向实验与设计转折，比单独展示工程严谨性更能说明研究能力。
  - briefing-responsive-final-89fe1190 > briefing-chronology-science-story: owner 对 chronology 版给出“好多了”但明确提出参数标题与手机/桌面修正；这些修正进入 89fe1190，随后该 exact-head 获得条件式合并授权并合入 main。
  - briefing-method-context-unified-charts-59f46044 > briefing-training-dynamics-layered: owner 在训练曲线 successor 上继续补充方法背景、GDR 人话语序、统一图表语法、干预动机与真正整张手机缩放；这些反馈进入 59f46044 后，owner 明确要求合并。
- TRAJECTORY-BRIEFING-DEVICE-SCOPE-20260909: scope-specific supersession：历史固定原尺寸、phone reflow、以及“外层 fit 但内部仍挤压”的失败都保留。current authority 是 desktop capped 1280×720 + phone 保留内部 1280×720 坐标系并整张 transform scale-to-width，无横向滚动。
  - briefing-responsive-final-89fe1190 > briefing-fixed-16-9-all-devices: 较新的 owner 指令先纠正了把 1280×720 原尺寸画布硬塞进手机的问题；这是中间态。
  - briefing-phone-whole-slide-fit > briefing-responsive-final-89fe1190: 最新 owner 指令进一步明确：iPhone 宽度要对齐、默认不横向滑动，细看时由用户自己放大；因此保留同一 16:9 slide 构图，只改变整张画布的显示比例，不把内部结构重排成长网页。
  - briefing-phone-full-canvas-transform-59f46044 > briefing-phone-outer-fit-inner-squeezed: owner 发现“外层已经 390px”仍不足以证明手机适配：内部内容被挤压会显示不全。最终实现保留真实 1280×720 内部画布，只对整个 slide 做同一 transform scale。
- TRAJECTORY-BRIEFING-DIAGNOSTIC-CLOSURE-20260909: 这是内容/推理结构 trajectory，不是视觉模板。PR #604 的具体闭环实现已被 owner 接受并合入，但该接受不等于把整套视觉风格 canonicalize。
  - briefing-diagnostic-closed-loop > briefing-horizon-scalar-only: owner 要求把 15/30 步都在固定动作间打转的观察写出来，才能说明为什么排除“只是步数太少”。
  - briefing-diagnostic-closed-loop > briefing-diagnostic-no-resolution: owner 再次指出页面没有说后续怎么处理；闭环版本必须写清停止继续加步数、转查下一机制，并区分解决错误诊断与解决最终低分。
  - briefing-diagnostic-motivated-closed-loop-59f46044 > briefing-intervention-before-observed-problem: owner 第三次纠正同一科研闭环：15→30、2048→4096、10+10 不能先冒出来，先写日志/轨迹里看见什么问题，再解释为什么用这个最小干预。
- TRAJECTORY-BRIEFING-STORYLINE-NATURAL-COPY-20260909: 670ab9b4 是 PR #605 的历史 current-candidate；后续 exact head 56b5120 进入 main，但 owner 在该 head 之后明确指出 TaskVector 技术层级和“科学尝试”checklist 仍是必须修掉的 hard failure。2026-09-10 又补充“关键归因句不能让听众猜‘问题’指什么”。这些是 copy/storyline trajectory；PR #614 的 No-GDR successor 仍在 review，没有新的 canonicalVariantId / Golden。
  - briefing-log-first-a83eb0da > briefing-diagnostic-intervention-first-0aa9693c: 从“为什么改 15 步/Text Memory”改成“分数低 → 查日志 → 发现问题”，让 intervention 在原因之后出现。
  - briefing-storyline-human-causal-670ab9b4 > briefing-log-first-a83eb0da: 进一步移除 7<8 / 7B:结论 这类压缩标题、“老师很可能会问”元话术和 composed state 内部英文，并把科学尝试与技术工作分开总结。
  - briefing-pr605-final-merged-rejected-56b5120 > briefing-binary-contrast-recurrence-e9b767d4: 在“科学尝试”标题这一维，后继版本把“我们不是只跑一次实验，而是……”改成直接主题“我们做过哪些尝试”。该后继版本后来仍因 TaskVector 技术层级与科学尝试页结构问题被整体判为 Rejected；这里仅记录这一个文案维度的改进。
  - briefing-sdlora-explicit-diagnostic-referent-30d55de > briefing-sdlora-unnamed-diagnostic-referent: owner 直接指出“问题是不是 SD-LoRA 独有”没有说清“问题”是什么；后继表达先写成功轨迹进入参数后能力仍未明显提升，再解释普通 LoRA 对照如何定位是否为 SD-LoRA 特有。
- TRAJECTORY-BRIEFING-EXPERIMENT-CHART-GRAMMAR-20260909: PR #604 的统一图表具体实现被接受；2026-09-10 的新增 No-GDR 线再次复现同一要求，因此两条 failure family 升到 repeated。这条 trajectory 学的是“相同证据对象继承同一视觉语义”，不是固定数值轴、固定颜色模板或所有研究图都必须长这样。
  - briefing-unified-experiment-charts-59f46044 > briefing-mixed-experiment-charts: owner 要求 7B / 1.7B / 3B 的 checkpoint Score、loss 与 SD-LoRA 更新使用同一视觉语法，只允许坐标轴因真实技术范围不同而变化。
  - briefing-nogdr-score-loss-curves-b1f86769 > briefing-nogdr-summary-cards-0ff4b053: owner 对新增 No-GDR / DirectApply 再次要求“和其他实验一样的分数 loss 表”。b1f86769 在这个单一维度上按要求恢复左 Score / 右 SD-LoRA loss；该 exact visual 随后只得到“能看见曲线”的验证，没有新的整体 accepted / canonical 表述，因此仍是 current-candidate。

## Visual references
- REJECTED · VISUAL-BRIEFING-DENSE-REJECTED · sha=49ab2665ee7131dec7484063fd132198655da792 · /research/seed-openevo/study/briefing/
  用户明确报告注意力涣散、心烦意乱。
  boundary: 不要把卡片墙和等权重信息块作为默认美学；可用 SHA 重建。
- SILVER · VISUAL-BRIEFING-SOFT-SILVER · sha=8bfb5bcdf42416d35eb4f64c5fd176022d6ae517 · /research/seed-openevo/study/briefing/
  对应“更柔和、多色、圆形”的正向方向；用户只说过明显更好，没有批准为最终模板。
  boundary: Silver 只表示方向性正反馈；不得写成“用户喜欢/已批准该模板”。
- REJECTED · VISUAL-BRIEFING-OVERMINIMAL-REJECTED · sha=bb9315bd71ee61e8c29afb5010753cc07202b485 · /research/seed-openevo/study/briefing/
  用户指出它比此前 slides 过度克制，颜色、圆形和信息量被削掉。
  boundary: 认知负担低 != 极简主义。
- SILVER · VISUAL-BRIEFING-CHRONOLOGY-SILVER · sha=1ca186d42279424f8c848d54cbdc62e5a6342444 · PR=#569 · /research/seed-openevo/study/briefing/
  用户说“目前整体效果比上一版好多了”，同时继续提出参数标题与手机/桌面修正。
  boundary: 明确 better，因此是 Silver；后续仍有纠正，所以不是 accepted / Golden。
- SILVER · VISUAL-BRIEFING-FINAL-ACCEPTED-SILVER · sha=89fe1190d0f92909f6da40b9a47ea75c9f45d2d5 · PR=#569 · /research/seed-openevo/study/briefing/
  owner 明确说“虽然做的不是100完成，先合并进main”；随后 PR #569 从 exact head 89fe1190… 合入 main。
  boundary: 具体结果 accepted，但没有未来模板授权，所以仍是 Silver 而不是 Golden。它保留当时的 phone-reflow 历史实现；后续最新 phone whole-slide fit 指令只作为 superseding preference，不倒改这张历史视觉证据。
- REJECTED · VISUAL-BRIEFING-STORYLINE-LABEL-FIRST-REJECTED · repo=mykcs/basemodel · sha=a83eb0da4481de465191c0b4a0d36cd8ff60c2c0 · PR=#605 · /research/seed-openevo/study/briefing/
  owner 明确拒绝 7<8 先行、7B：结论、老师很可能会问、composed state 等表达，并要求改成人类因果顺序。
  boundary: Rejected 的是 copy/storyline attention grammar，不代表该 commit 的所有视觉元素都被逐项否定。exact SHA + route 可重建。
- REJECTED · VISUAL-BRIEFING-BINARY-CONTRAST-REJECTED · repo=mykcs/basemodel · sha=e9b767d4f278edd1d03e68006f94116399f1db7f · PR=#605 · /research/seed-openevo/study/briefing/
  owner 明确说 Slide 3 “还是犯了‘不是……而是……’这样的错误”，要求按已有标准重新检查整套。
  boundary: Rejected 的是 Slide 3 的防御式二元 framing / copy grammar；不表示该 commit 的所有视觉元素都被逐项否定。
- REJECTED · VISUAL-BRIEFING-605-MERGED-REJECTED · repo=mykcs/basemodel · sha=56b5120b22b6c709aaf485e3b1fdea348fb3041b · PR=#605 · /research/seed-openevo/study/briefing/
  owner 在 56b5120 之后明确说“这轮 hard-failure 不是建议，是必须修掉”，并点名 TaskVector 太像数学附录、科学尝试页不应是数字 checklist。
  boundary: Rejected。该 head 后来被合进 main 只说明 Git 状态变化，不构成 owner acceptance。没有新的页面 commit 解决这两条反馈；可用 exact SHA + route 重建视觉。
- SILVER · VISUAL-BRIEFING-604-ACCEPTED-SILVER · repo=mykcs/basemodel · sha=59f46044e15aa92d95f50f0332a9798adf8d385b · PR=#604 · /research/seed-openevo/study/briefing/
  owner 看过该 successor 后明确说“先合并进main里”；PR #604 exact head 59f46044 随后通过最终 gate 并合入 main。
  boundary: Concrete accepted result → Silver。没有“以后按这版 / 作为模板”的未来视觉授权，因此不是 Golden；可用 repo + exact SHA + route + 390/1280 viewport 重建。
- REJECTED · VISUAL-BRIEFING-NOGDR-SUMMARY-CARDS-REJECTED · repo=mykcs/basemodel · sha=0ff4b05303cd45af329d30a783e3ac004cb6fd83 · PR=#614 · /research/seed-openevo/study/briefing/
  owner 直接纠正：“我新实验也得用在html表现和其他实验一样的分数loss表”。
  boundary: REJECTED 只针对“同类训练实验退回摘要卡片、没有沿用 Score / loss 视觉语法”这个维度；不表示该 head 的科学边界或全部页面元素都被否定。
- CURRENT-CANDIDATE · VISUAL-BRIEFING-NOGDR-CURVES-CURRENT-CANDIDATE · repo=mykcs/basemodel · sha=b1f86769e8c36df257dbee82a018a6d0b4336706 · PR=#614 · /research/seed-openevo/study/briefing/
  owner 要求新实验沿用其他实验的分数/loss表现；随后 Agent 重新生成 Preview，并实际核对该 slide 有 2 张 SVG、3 条 polyline。owner 在看到该链接后直接进入 closeout，没有对 exact visual 给出 accepted / canonical 语言。
  boundary: CURRENT-CANDIDATE。它在 chart-grammar 维度落实了明确要求，但“实现了要求”不等于整张视觉获得人类接受；没有 Silver / Golden 升级。exact SHA + route 可重建。

## Retrieved Preference Model
- PREF-SCIENTIFIC-BOUNDARY 简化表达不能削弱科学边界: 结果先行，但 claim → evidence → inference → boundary 必须完整；不能为了好读把不可比、未授权、未证明或未知状态藏掉。
- PREF-DIRECT-FACTS 事实和主题优先于主持人、叙事隐喻和防御性开场: 能直接说做了什么、发生了什么、结果是什么时，不用“怎样读 / 先看 / 分岔 / 这不是”等作者姿态抢第一理解层；作者内部编码、实现参数或基线质量证明也不应为了冲击力抢在真实对象和科学结论之前。
- PREF-RESEARCH-JUDGMENT 科研汇报展示研究判断，不展示项目管理流水账: 科研叙事按触发问题 / 观察 → 假设 → 实验 → 结果 → 下一步判断组织；先让听众知道为什么开始查，再讲改了哪个参数或模块。工程 gate 只在决定可解释性、可识别性或因果归因时进入主线。
- PREF-INLINE-TERMINOLOGY 术语在第一次出现的位置就地解释: 能不用内部代号就不用；必须保留时先给人类名称，再在当前句附近解释它在这里做什么。
- PREF-BRIEFING-SELF-CONTAINED-METHOD 阶段汇报先给足以理解后续结果的最小方法背景: 现场观众不应被假定已经读过网站的其他方法页；在结果和机制之前，用一页或同等体量交代 Stage 1 / Stage 2 如何接续、轨迹由谁产生、MiniMax 在哪里回看，以及 OPSD / SD-LoRA / Text Memory / Skill / Agent System 各自扮演什么角色。
- PREF-DIAGNOSTIC-CLOSURE 诊断实验要让观察、排除和处理形成闭环: 科研汇报里的负向或诊断实验应说明实际观察到了什么、它排除了哪个解释、因此停止继续调什么并转向哪个下一问；长期训练证据要区分优化 loss、训练过程任务表现和冻结终评。
- PREF-PROGRESSIVE-DISCLOSURE 按阅读时机分层，不把分层本身做成模板: 首层只给开始理解所需的信息；可恢复的背景、provenance 和深层机制后置，但不要机械制造“一句话看懂 / 专业解释”等可见层级。
- PREF-FIRST-SCREEN-ATTENTION 一个首屏只承担一个主要理解任务: 字号、加粗、卡片、CTA、导航、空白和内容到达位置都在分配注意力；第一屏应只有一个明显认知中心。参考 Apple 等设计系统时，先转译它怎样帮助人识别、分组、决定和继续，再决定本站自己的视觉实现，不把品牌表面构图当成认知原则。
- PREF-EVENT-FIRST-RESEARCH-HEADINGS 科研标题先说可直接复述的事件，再给压缩标签: briefing 标题优先用一整句自然语言说清“发生了什么 / 我们为什么开始查”。模型名、数字关系、方法名和内部英文如果需要额外解码，就留到副标题、正文或图注。
- PREF-CONCRETE-MECHANISM-WORDING 机制文案把具体问题、主体、动作和结果说清: 当科研机制或归因实验可以直接说清时，先把正在诊断的具体失败写出来，再写谁训练了什么、谁做了什么判断、下一状态因此怎样；避免用没有近邻 antecedent 的“这个问题 / 这个现象”或“X 与 Y 之间存在落差”让观众自己补前提。
- PREF-TECHNICAL-DEPTH-WITHOUT-META 技术深度由科学论证承担，不用“更硬核”自我表演: 机制页可以使用公式、真实参数和定量阈值；标题和旁白直接命名技术对象或指标，不把“这里更硬核 / 更专业”这种作者自评展示给观众。
- PREF-CONSISTENT-EXPERIMENT-VISUAL-GRAMMAR 同类实验图复用同一视觉语法: 同一 briefing 内展示多条同类训练线时，Score、loss、candidate/accepted update 应保持稳定的图表位置、线型和标记含义；这也适用于后来新增的实验线，只要它展示的是相同训练证据，观众就不该因为“新实验”而重新学习一套图例。
- PREF-BRIEFING-DEVICE-SCOPE 演讲构图按设备缩放：桌面封顶，手机整张等比适配: HTML briefing 保留同一套 16:9 演讲构图：桌面端封顶 1280×720；手机端把整张 slide 等比缩到 viewport 宽度，不重排内部结构，也不要求横向滑动；需要细看时由读者自行缩放。
- PREF-OBJECT-FIRST 先建立现实对象，再说关系、代号和方法: 零上下文首层先让读者知道对象是什么、比较双方是谁；关系符号、内部路线名和统计方法不能替代对象身份。

## Retrieved Gold Pairs
- PAIR-081-DEFENSIVE-OPENING
  rejected: 质量不是“页面做得漂亮”或“GPU 跑得满”。
  accepted: 我们把实验质量拆成四层：科学设计、工程门禁、证据身份和对外表达。每一层都有可追溯的证据，也都有明确的停止条件。
- PAIR-089-BRIEFING-METHOD-CONTEXT
  rejected: 直接从 7B / 1.7B / 3B 结果开始，默认观众已经去网站其他页面读过 OpenEVO 的方法。
  accepted: 结果前先用一页交代 Stage 1 的轨迹采集与 MiniMax 回看，再说明 Stage 2 如何用 SD-LoRA、Text Memory、Skill 和 Agent System 继续滚动学习。
- PAIR-084-DIAGNOSTIC-CLOSE-LOOP
  rejected: 15→30 仍然 0，所以 horizon 不是问题。
  accepted: 先交代失败轨迹已经把 15 步走满却仍在 next / back 等导航动作里打转，所以才怀疑 horizon 太短；把上限加到 30 后行为仍没有改变，于是停止继续加步数，把“步数太少”从原因列表移除，转去检查 Text Memory 与后续更新机制。
- PAIR-090-COMPOSED-STATE
  rejected: 后来跑到 49.33 的 Ceiling-1.0 7B 已经是 composed state
  accepted: 后来那条 7B 长跑里，Text Memory、Skill Bundle、Agent System 和 SD-LoRA 会一起组成下一轮模型状态
- PAIR-090-DIAGNOSTIC-ENTRY
  rejected: 为什么后来会去改“15 步”和 Text Memory？因为日志里先暴露了两个很具体的问题
  accepted: 分数很低，我们先去看日志，看看是不是哪里出了问题
- PAIR-068-ATTENTION
  rejected: 研究问题 / 为什么重要 / 从哪里开始 / 什么时候结束 / 现在到哪了
  accepted: 7B 持续更新参数，并完成最终测试；旧 3B 因购物接口和动作格式问题停止。
- PAIR-081-BINARY-CONTRAST-SUMMARY
  rejected: 我们不是只跑一次实验，而是一步步换问题去验证
  accepted: 我们做过哪些尝试
- PAIR-082-ENGINEERING-DEPTH
  rejected: 固定 GPU 确定性 PASS / SHA / replay hash 单独占主演讲页
  accepted: 主演讲说清它改变了什么科学判断；SHA / 重复性证据放技术页或按需证据层
- PAIR-090-MODEL-COLON-HEADING
  rejected: 7B：训练过程明显学起来，但冻结终评仍是 49.33
  accepted: 我们做了一次 7B 长跑：训练在变好，冻结终评是 49.33
- PAIR-082-TECHNICAL-WITHOUT-META
  rejected: 这里可以更硬核一点
  accepted: 我们采用一个更技术性的指标
- PAIR-087-CONCRETE-MECHANISM
  rejected: “训练出一个更新”和“让这个更新进入后续模型”之间出现了很大的落差。
  accepted: 训练程序有 44 次都把 SD-LoRA 候选训出来了；GDR 又筛了一次，只同意 7 次真的改到下一轮模型，另外 37 次被拒绝。
- PAIR-082-CHRONOLOGICAL-SCIENCE-STORY
  rejected: 实验系统 / 质量体系 / 推进节奏 / 当前阻塞
  accepted: 7B 基线 → 1.7B / 3B 诊断 → 小实验排除解释 → 参数机制 → GDR / DirectApply → 当前天花板
- PAIR-090-GATE-HEADING
  rejected: 7 < 8：不是模型没有成功经验，而是一个控制门槛挡住了长期训练
  accepted: 训练跑了很久，但参数一次都没有更新
- PAIR-082-PARAMETER-HEADING
  rejected: 2048 → 4096：单次记忆容量翻倍仍然失败
  accepted: 我们把记忆容量翻倍了（正文保留并强调 2048 → 4096）
- PAIR-082-RESEARCH-NARRATIVE
  rejected: 实验系统 / 质量体系 / 推进节奏 / 当前阻塞
  accepted: 能力上限 → 参数机制 → 因果控制
- PAIR-027-ENGLISH-EYEBROW
  rejected: OpenEVO · SEED × WebShop
  accepted: OpenEVO 暑期考核汇报

## Anti-overgeneralization boundaries
- 不是禁止关系词；先建立关系两端后，准确关系仍应保留。
- 内部代号在 provenance、复现和审计层仍可精确保留。
- 真实研究问题可以是问句。
- 真正改变科学解释的否定句和 caveat 必须保留，并贴近所约束的 claim。
- 能建立正确心智模型的必要类比不是禁用项。
- LoRA / RL / GDR / TaskVector 等真实技术对象不是禁用项；要删的是不增加信息的英文装饰标签。
- 不是禁止标题出现数字；当数字本身就是主要科研结果且两端对象已经说清时可以前置。像 7<8 这种需要先解释 operands 与 gate 的诊断 shorthand，应先说观众能直接复述的事件，再在正文给精确值。
- 不是禁止模型名出现在标题；如果“7B：结论”只是压缩标签而完整事件句更自然，就优先完整事件句。
- 不是把所有工程/内部信息都后置；如果它本身决定科学有效性、对象身份或因果归因，就必须在相关 claim 附近可见。
- 不是越少越好；必须默认可见的科学边界、比较双方和当前状态不能为了简洁被藏掉。
- 首屏预算是报警器，不替代真人 cold read。
- 不是禁止留白、大标题、serif、圆角或一屏一页 presentation；当它们服务当前 reader task、分组、阅读节奏或真实 presentation 介质时可以使用，不能因为参考品牌用了就机械复制。
- 不是 minimalism；exactly enough 比“越空越好”更重要。
- 会改变结论含义的 caveat 不能被当成次要背景折叠。
- 工程复现细节可以下沉，但当工程证据改变科学有效性、可识别性或因果归因时，必须回到主叙事保护 claim。
- 不是删除专业词；精确术语在需要时必须保留。
- 集中 glossary 可以做参考工具，但不能成为主阅读路径。
- Agent / SD-LoRA / GDR 这类必要技术对象可以保留；像 composed state 这种只起连接作用、中文一句就能说清的内部英文不应要求观众额外解码。
- 不是用否定句淹没开场；边界应贴着它真正约束的 claim。
- 训练过程信号、最终评测和外部文献参照必须保持不同证据层。
- 不是删除工程证据；当工程事实决定实验是否有效时，它就是科学叙事的一部分。
- 不是要求按逐分钟日志复述历史；“先问题、后 intervention”指因果理解顺序，不是机械时间线。
- 可以有目录/总结页，但当“这些实验如何一步步排除解释”本身就是科研贡献时，不能只用一张等权 checklist 代替主线实验；是否拆页取决于它是否承载因果理解，而不是固定模板。
- 不是把公式加到每一页；只有公式、参数或阈值直接承担科研论证时才提高技术密度。
- 不是删除深推导；主演讲保留理解科学判断所需的简式，完整推导可以进入相邻技术页。
- “更硬核”可以是内部设计目标，但不应成为面向老师的自我评价标签。
- 当前 OpenEVO TaskVector briefing 的最新 owner 边界是：主演讲只留 v = θ_after − θ_before、norm、cosine 和一条科学判断；Gram/Frobenius、R14/R27/R49、同范数随机对照与 identifiability 下沉 technical-notes。这个具体配方是 briefing-scoped 例子，不是所有机制页的公式数量上限。
- 不是所有网页都要固定 16:9；这里只适用于明确承担 slides / presentation 角色的 briefing。
- 手机端适应窗口指整张 slide 等比缩放，不是把内部两列、卡片或层级重排成长网页。
- 不要让手机默认出现横向滚动；桌面端仍保持 capped 1280×720，不随超宽屏放大。
- 不是每个标题都必须写成长句；对象已经建立、短名本身就清楚时可以简短。
- 不是禁止结果数字、模型名或 GDR / SD-LoRA 等技术词；只有当它们在第一注意层要求读者先猜含义时才后置。
- 真正可直接理解的科研发现（例如“44 个候选只有 7 个进入后续模型”）仍可在标题使用数字，因为数字两端对象已经同时说清。
- 不是禁止“问题 / 现象 / 它”等代词；近邻 antecedent 已清楚时可以自然使用。关键因果归因不能要求听众跨段猜它指什么。
- 不是禁止抽象关系词；当“关系”本身就是科研对象时可以精确命名。
- 不是删除 GDR / SD-LoRA / LoRA 等专业词；保留真实技术对象，同时把被诊断对象、动作和结果说清。
- 不要把自然语言改成过度口语或牺牲技术因果；问题、主体、动作和状态仍需准确。
- 不是强迫不同实验使用相同数值范围、单位或 y 轴；真实量纲差异必须保留。
- 不是所有科学对象都必须用同一 chart type；只有测量对象相同时才复用视觉语义。
- 新实验只有在确实拥有同类 per-round Score / loss / update 数据时才继承这套图；不能为了形式一致从摘要数字合成不存在的曲线。
- 视觉一致不能覆盖数据缺失：没有 authoritative loss 的点仍应留空，而不是为了图形对称补值。
- 不是把完整方法文档复制进每场汇报；只保留理解紧接着科学结论所必需的心智模型。
- 已有专门方法页仍然有价值，深参数、实现细节和完整流程可以继续 progressive disclosure。
- 若听众已经明确共享方法上下文，可以压缩这层，但不能让后续 claim 依赖未交代的内部对象。
- 不是每个负结果都必须声称“问题已经解决”；如果只排除了一个解释，就明确写“解决的是错误诊断”，再说明下一步。
- training loss 下降不等于最终任务能力提高；在线 round score、优化 loss、冻结 final eval 必须保持不同证据层。
- 工程恢复可以解决流程卡死，但不能自动升级成 benchmark gain。
