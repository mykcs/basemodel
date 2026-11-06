# BaseModel 全站 Project Report 审查与分阶段 PR 计划

**首次清点：2026-10-14**。研究写作与图表标准来自已合并的 mykcs/myk-skills Project Report PR #247。审查范围是 BaseModel 网站的**所有构建后实际路由**，不是把所有 UI 文本一律写成论文。

## 1. 实际覆盖范围

执行 npm run build 后，用 scripts/audit-project-report-sitewide.mjs 枚举 dist 下 268 个 HTML 路由，保存于 [完整机器清单](../evidence/project-report-sitewide-20261014/ROUTE_INVENTORY.json)。

| 页面真实角色 | 路由数 | 适用标准和内容 owner |
| --- | ---: | --- |
| OpenEVO/SEED 研究结果与分析 | 48 | Project Report P0–P4；研究证据/实验数据 owner |
| OpenEVO/SEED 方法与导读 | 18 | Project Report P0–P4；机制解释和公式来源 |
| 论文目录与详情 | 22 | 科学真实性与来源；动态 paper 数据/模板 |
| 模型目录与详情 | 168 | 模型身份/来源/可比性；动态 model 数据/模板 |
| 首页、指南、工作台等 | 12 | 项目 Reader Contract/Wish 与选择性的 Project Report 表达 |
| **合计** | **268** | **共 81 个路由源文件和共享组件/数据生成的网页** |

**完成状态严格分开**：自动扫描路由 268/268；逐页人工 Construction 0/268；逐页人工 Regression 0/268；本次新增科学测量 0。把路由列出来不能宣称文章已改好。

机器初扫有 **53 个页面**触发至少一个候选项，其中科研表格 caption 37、研究引用 28、代码展示 7、图中按钮 6、短正文 6、科学状态词 1、figure caption 不配对 1。候选可能重叠，也可能是客户端渲染、导航/工具表和动态数据产生的**假阳性**，绝不能自动称作 53 个科学错误。

## 2. 正确的全站质量门

- **P0 科学身份**：评测器、模型、版本、任务集合、有效预算、Task Score 分母/时间点、实验状态、真实 source。没有结果不冒充 0 分或 PASS；明确要求论文稿件的未测指标允许正式版式占位并标 TBD-EVIDENCE，但**不允许把论文标记为 submission-ready**。
- **P1 首读理解**：新读者先认识研究对象、问题、方法、实测、结论和未知；不需要先学习站点文件系统或 PR/run ID。
- **P2 论文媒介**：Figure 1、核心公式、booktabs、克制的顶会论文科研图；核心代码版本对照仿 Kimi Linear 的红删绿增，但只有两份真实提交才能称 Git Diff。没有新知识的按钮/动画不加。
- **P3 语言**：每段事实、推断和后续决定分明；减少“不是而是”、模板式标语、过度术语，统一主语与计量单位。
- **P4 双轮验收**：来源 Claim Ledger、Construction → 重读最终产物 → Regression、手机/桌面浏览器、项目 CI 和部署身份。不同页面角色适用不同层次，目录/模型卡片不强制伪装成科研论文。

## 3. 按工作量拆分 PR（严格按序合并）

| 顺序与工量 | 负责主题 | 预计实际对象 | 状态 |
| --- | --- | --- | --- |
| **A · S–M** | 全站清单、诊断脚本和真实分工 | 268 个路由全量登记；候选信号；后续工单 | **本 PR** |
| **B · M** | 核心研究结果首批实际改稿 | 48 个研究结果中的 **6–10 个**，优先 source 与读者理解最影响判断的 | 待 A |
| **C · L–XL** | 其他研究结果 | 剩余约 38–42 个结果页面，按同一科学来源/模板归组，预计再 4–6 PR | 待 B |
| **D · L** | 方法/Flow 的公式与核心代码 | 18 个机制和导读页面，按相同组件归组，预计 2–3 PR；仿 Kimi 的展示有证据才上 | 待 A、与并行 PR 协调 |
| **E · M–L** | 论文与模型档案模板 | 22 个 paper 实例及 168 个 model 实例对应的模板与真实数据源；预计 2 PR | 待 A |
| **F · M** | 其它网页与工作台 | 12 个入口、指南、决策与操作页面，按页面职责和实际交互验收，预计 1–2 PR | 待 A |
| **G · M** | 全站合并后的独立 Regression | 重新扫描全部路由、来源与视觉回归、声明真实完工数与未完工数 | 最后 |

工量为 **S/M/L/XL 相对工量**，不是预计小时数。最终可能约 12–17 个独立 PR；实际量应在 B 首组审查后修正。不能为凑 PR 人为拆一个修复，也不能在 A 一次性重写全站。

## 4. 目前并发所有权必须先处理

- [BaseModel PR #856](https://github.com/mykcs/basemodel/pull/856)：Q01 科研曲线，包含 AdvisorTenEvidenceVisual.astro；本 PR 不碰它。
- [PR #855](https://github.com/mykcs/basemodel/pull/855)：三篇研究博客第一屏读者路径；B 阶段须先判定是否合并/重叠。
- [PR #841](https://github.com/mykcs/basemodel/pull/841)：跨研究页面导航；D/F 不抢相同导航组件。
- [PR #831](https://github.com/mykcs/basemodel/pull/831)：SEED 与 OpenEVO 的研究对照；D 不能抹掉已有方法设计。
- [论文视觉标准](https://github.com/mykcs/iclr2027-openevo/blob/main/标准/11-论文视觉语言与可验证代码对比.md)：Kimi Linear 的 LaTeX 技法及真实 Git Diff 界线已经核实，不在网站复制一份科研 authority。
- 168 model + 22 paper 页面共用少数动态页面模板；覆盖全部 URL 与修复单一内容 owner 需要分别计数。

## 5. 每个后续 PR 的真实完成定义

1. 写明本组**精确路由**、读者目标、已查出的问题、Claim Ledger、原始证据链接，保留被用户接受的旧正文。
2. 靠原始 source/真实实验记录修复；未运行保留未运行。图表要实际帮助读者理解，源码双栏不得伪造历史。
3. 完成 Construction 与 Regression，重新读取发布候选，真实浏览器看桌面、手机及必要的黑白视觉；通过测试、当前仓库 Provider Gate，再核实 Production。
4. 只有真的逐页阅读并回归的路由才增加 human_reviewed_count；统计工具自己跑通不增加任何人工完成数。
5. 变更总结里报“实际验收几页 / 268”，以及剩余 blocker 和下一阶段，不使用假进度。

## 6. 复现与工具限制

先在 Node 24 下运行 npm run build，再执行 node scripts/audit-project-report-sitewide.mjs。脚本不修改源文章，只记录所有生成 HTML 的内容密度、来源链接、表图、代码和候选信号。其机器输出**不能读取客户端 hydration 后才出现的文案**，这部分由后续 owner-aware 检查覆盖。脚本无科学测量能力，不能改变科研权威。
