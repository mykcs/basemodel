# 四项既有 PR 的复用与接手补充

这是新规划对旧工作依赖的说明，不覆盖旧 PR 的源代码，不修改其状态，也不擅自吞并并行 Agent 的成果。执行前刷新 head/base。

## X783：资源如何服务当前研究任务

原 PR #783，分支 `plan/resource-mission-bridges-20260922`；计划 `docs/plans/2026-09-22-pr-d-resource-mission-bridges.md`。本次确认它原先等待的 #781/#782 已合并，不能继续把这两个依赖写成阻塞。

继续目标：Models/Papers/Compare/Workspace 回答为什么在这个研究问题下看这个资源。沿用 ResearchContextBar 与当前 URL/state；不建立新 mission store，也不把长期 schema 锁成 OpenEVO。

具体步骤：读取原计划→列出四面已有 context 数据流→给缺乏 context 的路径保留独立可用入口→比较页先显示固定与变化条件→Workspace 从研究问题/模型角色/公平限制过渡到配置→补无 context、深链接、后退恢复、中文/主题/手机测试。B01 写导航，X783 写资源主体，不并发改同一文件。

退出标准：四类入口各一条真实读者任务可走通；没有跨 benchmark 总排名；无凭空论文关系；共享上下文未复制；相关 deterministic/UI gate、独立冷读与最终 provider 门按现行规则完成。

## X805：发布已完成研究结果

原 PR #805，分支 `research/post-advisor-ab-final-results-20260928`，本次读取 head `43fa2cbb3998824333826e8542cebf8265842f17`；调查时有 main 冲突。上游 #597 和 `FINAL_SCIENTIFIC_SUMMARY.json` 是原计划指向的科学来源。

不新开另一份结果发布实现。未来执行：刷新源结果及文件哈希→在隔离分支处理 main 冲突→保留较新的导航/Reader Contracts→逐项对照数据与正文→先完成科学发布再交给 B02 进一步综合解释。禁止把冲突整块选 ours/theirs。

必须保留：SEED-style Stage1 不是精确 SEED 复现、不是 full Stage2；优化 loss 与任务能力不同；32/64-task 合同分开；rank32 更小不是已证明无损；rank95≈8 不等于 rank8 足够；不重新开启最终评估题。

验收：原结果镜像及网页表述逐值核对；旧“尚未训练”等失效投影被移除；原有科学限制完整；最终当前 base/head 的完整必需检查。PR 正文的旧 PASS 不继承为新合并候选 PASS。

## X806：设计体系与全站既有迁移

原 PR #806，分支 `design/basemodel-design-system-v1-20260928`，本次 head `8f976af80439f83fc4c9bfcf451e87ed60ad8126`；调查时有 main 冲突。设计文件在该分支 `docs/design/`，不能假设 main 已有这套体系。

这是宽范围已有成果，不从零再造。先按路由家庭和 CSS owner 清点差异，分别标记“可复用”“与新基线冲突”“需要读者复核”；已有候选参考页 Stage1、Bounded、briefing 不能当成 owner 已认可标准。

执行顺序：科学内容以 X805/当前 owner 为准→与 X812 合并评估阅读方向→保留真正改善语义的结构→删除被证实失效的补丁而非整批删兼容 CSS→各页面家族保留一份 before/after 和冷读任务→完成冲突整合。A03 在 owner 明确后才能清理共享样式，C01/C02/C03 不创建并行设计系统。

退出标准：旧任务冻结路由清单全部有去向；不丢科学值、可比边界、URL、主题与操作流程；候选/机械验收/owner 认可分别记录；全局 UI 和最终 provider 门在新 head 重验。

## X812：β 页面阅读基准

原 PR #812，分支 `design/beta-sujianlin-reader-20261001`，本次 head `e94b1618760b9cbd201ff88ce61141e592989693`。沿用原 task 文档；不是新建竞争文章。

保留单列正文、克制标题、论文式表格、就地公式/图、文章小结；不要把苏剑林风格理解为逐像素复刻或全面取消图表。

接手步骤：先刷新冻结 Final 与 200 轮训练续跑来源→保留原文正确论证→在同一 PR 完成阅读布局→与 C01/C02 的组件约定对齐而非提前抽象→验证 390/768/1440、亮暗、键盘和无 JS→独立冷读后才决定能否成为全站参考。

必须同时看见：三组同题 Final 对照；训练继续改善不构成新的 Final；DirectApply 历史不是随机对照臂。B02 只能在这条设计 workline 完成或明确移交后改 β 正文。

## 重叠处理规则

不自动关闭、合并或重写任何旧 PR。发生冲突时记录字段/语义 owner 和保留依据；不能把“全部重新来一遍”当成解决。只要既有能力已在当前主线存在，就以能力验收为准，跳过重复建设。
