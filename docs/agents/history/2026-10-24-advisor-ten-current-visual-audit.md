# 2026-10-24 · 学长十问 Intelligence UI：逐题实图复核与 Q07 轻量回归

## 任务、证据及边界

原话目标：把此前一起选定的 Q01–Q10 概念图放到 BaseModel，按最终讨论适度微调，**只能更好，不能更差**；Q02 重画用了 34 分钟，今后应直接复用现成成果和快速测试。

比对源：`.agents` 的 [2026-10-23 十题偏好审阅](https://github.com/mykcs/.agents/blob/main/docs/learning/projects/basemodel/2026-10-23-q01-q10-intelligence-ui-design-review.md)、[Q06–Q10 原话节选](https://github.com/mykcs/.agents/blob/main/docs/learning/raw/transcripts/2026/2026-10-23-chatgpt-advisor-q06-q10-ui-feedback.md)，以及本站 [前次审计](2026-10-23-advisor-q01-q10-fidelity-audit.md)。独立、未改动的基线为 `main@4c8bc35a3c3b946eac4fdeb10b4cc4786d9a4c2e`。原对话并非每题都有可复取的最终截图，档案是 `RAW_PARTIAL`：**结构匹配、交互合格不能宣称逐像素复刻或用户已经最终认可审美**。

2026-10-24 使用已授权 macOS CLI 上隔离的临时 checkout 构建并运行 Playwright；实际观看了 Q01、Q02、Q03、Q04、Q05、Q06、Q07、Q08、Q09、Q10 的页面截图，检查 390px 浅色主路径、关键开关。基线静态构建通过，Q02–Q10 390px 概念检查通过，Q01/Q03 专项 2/2，Q04/Q08/Q09 390px 专项 3/3。此处是候选现场验证，正式发布仍需绑定最终 PR SHA、云端 CI 与 Preview/Production。

| 题 | 实际可见的关键关系 | 此次审查决定 |
| --- | --- | --- |
| Q01 | 普通/Bounded/历史 β/GDR 的 PGFPlots 主图；详细曲线单独展开；对新题不可比的边界 | 保留论文图，不用“流程卡片”替代数值证据 |
| Q02 | 同一批数据分入 SFT/token CE 与 OPSD/冻结教师 JSD，再收束到学生 LoRA | 保留 PR #945 恢复的并列版；不重新生成流程 |
| Q03 | 自然宽度的论文式三线表、四项对照限制 | 保留；相对偏好的 A 不是最终设计金标准 |
| Q04 | 单次实验的显存×时间示意与离散实测，手机整幅缩放 | 保留；不把示意峰值说成真实测量 |
| Q05 | 同一个问题下三种 β 策略 + 数轴 0.25/0.5/0.75/1，默认有选项 | 保留 PR #948 的连续矢量与离散选择 |
| Q06 | 同一个合法动作集合连到三例、说明并非穷举或实测 100% | 保留共同根节点的分叉，不换通用孤立卡 |
| Q07 | +Δ / 0 / −Δ 的一条有符号数轴、八轮证据和 Holm 界限 | **修复手机端三选竖排**，利用已有三臂选择样式；不改科学结论 |
| Q08 | 96 题“成绩变化／证据状态”逐题对应；手机上按训练阶段纵排，每组网格可读 | 保留两层证据语义；无真实初学后基线不能宣称已证明遗忘 |
| Q09 | R129/R159 可选、三种指导、首步变化、差异区间；四种写入 1×4 | 保留 #951 的手机 1×4；首步变化不等于分数提升 |
| Q10 | 已完成的独立题准备与未完成的长期泛化检验分离 | 保留 A 方向；单步新题结果不冒充 160 轮长期终评 |

## 本次修复及今后快速复用

Q07 复用 `.advisor-intel__picker--fork`，只为选项加已有 class，避免另造 CSS。手机原本三个大行会切断“同一个向量三种处理”的空间关系；一行三选把单一数轴留在选择后面。Playwright 在 320/390px 验证三个控件同一行、每个宽度至少 64px、不溢出视口，其他 Q05/Q06 的交互保留。此修改不更动任何科学数据、题目结论、字体角色或数字。

**反向检验揭示真实问题：** 初版一行三选在单题检查中 320/390px、Chromium/WebKit 4/4 通过，但全站 WebKit 科研表格巡检触发 `320px scrollWidth=399`，溢出 79px；独立 `main@4c8bc35` 对照在同项测试 PASS。元素级追踪明确唯一越界宽元素是 Q07 的可见 `<legend>`（WebKit 计算 372px，右缘 399px）。为不降低屏幕阅读器支持、不做全站 overflow 隐藏、不放松断言，复用 Q05 已有的 `visually-hidden legend + visible explanation outside fieldset` 模式，专门解决这一浏览器固有布局陷阱。必须再次用**原失败场景**验收，不能拿最初的 4/4 假装全套合格。

发现“排版指纹门禁”后，没有删掉 `verify-typography-ledger.mjs` 或跳过构建：Astro 模板发生变化即刷新受约束的确切源码 SHA-256；用清单验证 **5,491 条** CSS/ASTRO 源声明的语义类别、实例 ID、多重集合及执行状态均未增减。源级门禁与真实截图分别验收，不互相冒充。

下次用户指出某一题问题时：先恢复该题已批准的拓扑/文案和对应归档，再运行 `npx playwright test tests/e2e/advisor-intelligence-q02-q10.spec.ts --grep 'Focused QNN' --project=chromium` 作快速回归；对完整候选才执行 320/390/768/1440 浅/深主题及 WebKit、静态构建、`npm run preflight:ui`、精确 SHA 的 Vercel Preview 与 Production 比对。**人工实图与用户盲测高于“测试绿了”**。浏览器截图不作为存档 RAW 的替代品；若无精确原稿，标记不可证明，不自信声称“原封不动”。
