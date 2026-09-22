# BaseModel public-expression overlay

状态：**CURRENT / SITE-SPECIFIC**

共享的「说人话 / 去 AI 味」当前标准由中央 authority 负责：

https://github.com/mykcs/.codex/blob/main/website-governance/HUMAN_EXPRESSION_STANDARD.md

真人 RAW、共享偏好和 BaseModel 专有 learned experience 分别位于：

- https://github.com/mykcs/.codex/tree/main/website-learning/raw
- https://github.com/mykcs/.codex/blob/main/website-learning/shared/content/HUMAN_EXPRESSION.md
- https://github.com/mykcs/.codex/tree/main/website-learning/sites/basemodel

本文件只保留 **BaseModel 专有的科研表达、页面职责与执行边界**。它不再复制跨网站通用的人类表达规范。

拆分前的完整历史规范已冻结于：

https://github.com/mykcs/.codex/blob/main/website-learning/legacy/basemodel-expression-spec/website-design-spec-2026-09-22.md

## 0. Authority 顺序

遇到冲突时，默认顺序：

1. 当前 owner 明确指令；
2. 科学事实、封存结果、证据边界、安全边界和可执行真相；
3. BaseModel 当前 Wish 与科研/产品 authority；
4. 中央共享的人类表达偏好与当前 Human Expression Standard；
5. 本 BaseModel 专属 overlay；
6. 通用设计建议和 Agent 自己的审美。

中央 closeout 保存 RAW；BaseModel 只写回当前站点真正需要执行的规则和 guard。不要新建平行 preference system。

## 1. 科研表达先保护事实

自然语言不能为了顺口而改变科学语义。

必须严格区分：

- `未运行` 与 `结果为 0`；
- 训练轨迹证据与固定题终评；
- 同题比较与外部论文参考；
- 观察、相关性、机制解释与因果结论；
- 当前正式结果与历史/诊断结果；
- public display 与 scientific authority。

任何 claim-changing caveat 都必须靠近被约束的 claim，不能因为首屏简洁就藏掉。

## 2. BaseModel 研究页的默认叙事

结果/分析类页面优先按下面顺序组织：

~~~text
科学问题
→ 做了哪些实验 / 比较
→ 直接结果
→ 决定性数字
→ 为什么这样理解
→ 证据边界
→ provenance
→ 可选复现 / 实现细节
~~~

Setup 必须足以理解结果，但不能在读者看到结果前形成一堵配置墙。

高级诊断只在它回答新的研究问题时出现。一般先从简单、直接的指标开始，再进入参数几何、谱、方向、长度、entropy 等更复杂诊断。

## 3. Benchmark 数字必须自解释

Task Score、success rate、last-N 平均或 fixed-panel final 第一次出现时，要说明：

- 数字怎么算；
- 分母 / 单位是什么；
- 题集是谁；
- 不同实验是否同题；
- 这个指标能说明什么、不能说明什么。

外部论文数字可以作为参考，但不得伪装成本地 same-panel arm。

## 4. 实验身份必须一致

一个实验在 H1、消融表、图例、正文和跨页链接中应使用同一个 reader-facing 名称。

底层 run ID、branch、内部 arm 名和历史代号保留在 provenance / evidence 层，不要让读者先做名称翻译。

完整方法包含多个机制而正式实验只运行其中一部分时，公共名称必须写清实际启用的部分。未做实验保持空白或明确写“未做”，不能为了表格完整补出数据。

## 5. Reader Contract 是可执行站点边界

每条公开 route 都必须有明确的 audience、primary task、first-viewport goal、must-stay-visible boundary、next step 与 attention mode。

**新增页面没有 `audience / primaryTask / firstViewportGoal / mustStayVisible / nextStep / attentionMode` 时，CI 应直接失败。**

首屏通常只承担一个主要理解任务，但这不允许通过大面积空白、隐藏 caveat 或删掉必要比较对象来“作弊”。

具体 owner：

- `docs/agents/current/site-reader-attention-contract.md`
- `src/data/siteReaderContracts.ts`
- `tests/e2e/site-reader-contracts.spec.ts`

## 6. 已经被 owner 接受的人话，先保真再网页化

当 owner 明确认可一段对话表达时，把它视为 **accepted copy baseline**。

网页化默认只做：

- 结构整理；
- 去重；
- 事实与边界校验；
- 证据分层；
- 响应式与可访问性表达。

不要为了“更像网页 / 更专业 / 更论文”把已自然讲清的话重新写成抽象管理语言。原则是：**先保真再网页化**。

## 7. ELI5 是发布覆盖，不是附赠文案

**ELI5 要扫完整个可见表面，不只扫正文。**

检查范围至少包括：

- H1/H2/H3；
- lede；
- 表格 subject / caption；
- 图例与图注；
- result card；
- callout/status；
- button/link；
- empty/error state；
- 默认展开的 evidence。

一个正确表格或阈值列表不等于读者已经理解“发生了什么、数字数什么、为什么、能推出什么、不能推出什么”。

## 8. 关系性结论先给参照物

**关系性结论需要先给最小参照物。**

例如“仍然 / 继续 / 共同 / 后续 / 第二版”这类词，如果关系两端还没建立，就先说明对象，再说关系。

这条规则来自 legacy **CASE-060**；历史原句保存在中央冻结 case corpus。当前保护应优先由具体页面回归测试和 Reader Contract 承担，而不是重新加载整套旧 case library。

## 9. BaseModel 专有的科研深度

“说人话”不意味着去掉：

- LaTeX 数学公式；
- W&B / sealed run / receipt provenance；
- 精确配置；
- 实验限制；
- 复现命令；
- 失败诊断。

但这些内容按页面职责逐层出现。主阅读层先回答研究问题和结果，深实现进入对应 evidence / mechanism / reproduction 层。

## 10. 页面 owner 分工

| 问题 | 当前 owner |
| --- | --- |
| 跨站说人话 / 去 AI 味 | `.codex/website-governance/HUMAN_EXPRESSION_STANDARD.md` |
| 真人 RAW / learned experience | `.codex/website-learning/` |
| BaseModel 当前产品愿望 | `docs/wish/LATEST.md` + `DESIGN.md` |
| 首屏任务与预算 | `site-reader-attention-contract.md` + `siteReaderContracts.ts` |
| 科研结果表达 | `research-site-presentation-contract.md` |
| 中文技术分层解释 | `layered-technical-explainer-copy.md` |
| 视觉关系与 semantic HTML | `human-thinking-web-expression-contract.md` |
| UI / 响应式 / accessibility | `ui-design-principles.md` + visual acceptance gate |
| 科学事实与 claim boundary | `product-and-research-integrity.md` + live experiment authority |

## 11. Agent 工作流

任何 BaseModel 公开文案/结构任务：

1. 先读中央 Human Expression Standard；
2. 读当前 Wish；
3. 再读本 overlay 与任务对应的更窄科研/Reader Contract；
4. 先核实事实，再写文案；
5. 通读受影响页面的完整阅读路径，而不是只修 owner 点名的一句；
6. 对高置信同类问题做 sibling scan；
7. 可机械检测的重复问题进入现有 audit/test；
8. 跑 copy audit、Reader Contract、对应 deterministic/browser gate。

不要恢复 retired local HPL、`feedback:retrieve`、Gold Pair 或 Preference Brief 作为生成时第二套大脑。

## 12. 品牌外链属于 BaseModel 本地实现

GitHub、Hugging Face 等品牌外链继续使用第一方官方 mark，并由 BaseModel 共享组件统一容器、尺寸、dark/light 对比和 accessible label。

当前实现 owner：

- `src/components/common/ExternalBrandMark.tsx`
- `src/lib/externalLinkBrand.ts`
- `public/brands/`

不要为了中央表达规范把品牌资产或站点实现搬进 `.codex`。
