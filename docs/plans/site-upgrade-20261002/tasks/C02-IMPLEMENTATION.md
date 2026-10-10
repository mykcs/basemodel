# C02 实际实现：科研图表与同源交互

## Page Expression Brief

**读者。** 第一次看这组结果的实验室同伴、几个月后回访的自己，以及需要继续实验的研究者。

**页面角色。** 这是 Bounded / β 结果页里的证据表达升级，不新建第二个结果页，也不替代 W&B。图表要让读者先看清“训练期发生了什么”和“冻结 Final 发生了什么”，再进入更深诊断。

**起始困惑。** 旧页面同时有静态 SVG、窗口表、W&B 链接和大量诊断。读者容易把训练曲线当 Final，或者不知道窗口均值和逐轮值是不是同一份数据。rank32 结果仍由 PR 805 管理，不能为了画图先复制数字。

**目标心智模型。**

1. 训练趋势：第96–199轮是一条训练期轨迹；逐轮值和窗口均值来自同一数据。
2. 同题 Final：三组最终模型在完全相同的冻结128题上可以并排读 Task Score 和完整成功数。
3. 容量取舍：rank32/rank128 还没完成网站来源接入，所以现在应明确显示“等待来源”，而不是画一个看起来已经有结论的前沿。

**主阅读路径。** 问题 → 图 → 同源表 → 支持什么 / 不支持什么 → 最近证据链接。

**次级深度。** 104轮逐轮表、机器可读 JSON、W&B 原生入口继续可查，但不抢主路径。

**表达形态。** 时间序列用原生 SVG；同题 Final 用对齐条形比较；容量取舍在证据未接入时用明确的 pending 图形和空值表。交互只帮助读数，不改变分析。

**验收。** 390 / 768 / 1440，亮暗、Chromium/WebKit、键盘、无 JavaScript、打印、局部横向滚动、页面级无溢出以及来源一致性都需要可执行证据。

## 实际交付

### 1. 一个窄的研究图表外壳

ResearchEvidenceFigure.astro 统一每张图必须同时出现的四件事：

- 这张图在回答什么；
- 它属于训练、开发还是冻结 Final；
- 它支持什么；
- 它不支持什么，以及最近的来源入口。

它不是新的全站设计系统，只服务本次科研证据图。已有 W&B 图和其他 canonical figure 不被替换。

### 2. β 第96–199轮训练趋势

BetaTrainingEvidenceFigure.astro 直接消费 D01/D03 已固定的 104 个逐轮 Task Score 和五个预设窗口。

- 纵轴固定 0–100，不截断制造视觉夸张；
- 细线保留104个逐轮原值；
- 粗线是五个互不重叠窗口均值；
- 第160轮用虚线标出延长训练边界；
- 第一个窗口真实是24轮，其余四个是20轮，没有假装样本量一样；
- 缺失值保留为缺口，不补零、不插值；
- 104轮完整表可以展开核对。

交互只有一个 range input：键盘、触屏都能读取某一轮数值。关掉 JavaScript 后，SVG、窗口表、逐轮表和结论边界全部仍在。

手机上 960px 的图不会被压缩成难读小字：图形在自己的容器内横向滚动，整页仍严格保持 390px 页面宽度。视觉冷读时发现全局 smooth-scroll 会让锚点测试产生假阳性，因此浏览器测试会先禁用 smooth-scroll 再验证 scroll-margin。

### 3. 同一冻结128题 Final

SamePanelFinalEvidenceFigure.astro 不维护一份手抄数字；它从 D01 frozenFinalView() 读取：

- 普通 OpenEVO：Task Score 60.72，50/128 exact；
- Bounded：45.98，32/128 exact；
- Bounded + β：20.77，10/128 exact。

Task Score 和 exact success 保持两个不同视觉轨道和两个表格字段。普通 OpenEVO 仍是历史前序实验，不被升级成后两组预注册正式对照的第三随机臂。

### 4. rank32 容量图 fail-closed

CapacityTradeoffEvidenceFigure.astro 有意不复制 PR 805 的结果数字。

D01 当前仍把 rank32-continuation-pending 标成 unavailable，因此图上只展示 rank128 / rank32 的比较位置、等待来源状态和需要接入的四个维度。adapter 文件大小、Task Score、exact success 全部保持未知。

这不是“少做了一张图”，而是 C02 的重要失败关闭行为：证据没进入网站单一来源之前，图表不能成为第二个事实来源。

## 同源数据

src/data/researchFigureData.ts 是这三张图唯一的数据适配层：

- β 趋势来自 researchAnalysisSnapshot.json 与 beta-r200-task-score；
- 同题 Final 来自 frozenFinalView()；
- 容量图来自 rank32-continuation-pending 的发布状态。

组件里不重新抄核心实验数字。D01/D03 的状态发生变化时，测试会暴露漂移。

## 并发处理

原本的共享 checkout 在实施中出现了另一组未提交 C02 修改。远端 PR 820 当时仍没有新 head 或认领评论，所以没有覆盖那组本地文件。

我建立了独立 worktree basemodel-agent2-c02-isolated-20261003，把当前 C02 候选作为只读输入复制进去，逐项冷读后只保留符合本计划的部分。后续编辑、测试和提交全部发生在隔离 worktree。共享 checkout 保持原状。

## 验收

最终候选本地检查：

- C02 数据与组件新增 19 项结构测试；
- C02 相关聚焦结构测试 58/58 通过；
- npm run verify:deploy：130 个结构测试文件、974 项测试通过；7 个行为测试文件、37 项测试通过；
- 类型检查：612 个文件，0 error / 0 warning；只有仓库原有 2 个 hint；
- npm run build：265 个静态页面通过；
- strict copy invariant failures = 0；
- Reader Contract：68/68；
- Chromium canonical research figures：19/19；
- C02 跨浏览器 Chromium + WebKit：12/12。

agent-browser 额外做了 390px 与 1440px 视觉冷读：页面有内容、无错误 overlay、document 宽度不溢出；β 图桌面能直接看到低谷、恢复和第160轮边界，手机保持局部横滚；同题 Final 的两个指标可独立阅读；rank32 区域明确不画未发布数据。

## 未完成边界

容量—质量—成本的真实 rank32/rank128 数据图仍等待 PR 805 完成网站来源接入。C02 当前交付的是正确的 pending 状态和自动保护，而不是抢先发布该结果。

本 PR 不改变 W&B 权限、不内嵌登录墙、不新增图表依赖、不运行实验、不访问 Final 题目、不修改原始证据，不请求 Vercel final gate，也不合并或部署。

PR 805 一旦完成，后续只需要替换 CAPACITY_TRADEOFF_FIGURE 的 pending 数据适配和对应测试，不需要重建图表框架。
