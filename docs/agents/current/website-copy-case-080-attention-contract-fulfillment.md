# CASE-080 — 有 Reader Contract 也可能认知失败：首屏必须只有一个主理解中心

**PREFERENCE · direct human feedback · 2026-09-08**

主案例库：[`website-copy-cases.md`](website-copy-cases.md)
执行契约：[`site-reader-attention-contract.md`](site-reader-attention-contract.md)

## 反面案例

#545 已经让每个公开 page source 拥有 Reader Attention Contract，也能检查 H1 是否位于第一屏。但真人继续打开生产站后明确指出：首页、总览和其他子网页仍然没有真正遵守这条设计准则。

真实浏览器审计说明了为什么：

- 首页第一屏同时出现 H1、长解释、两个 CTA、四张研究变量卡和 provenance / 状态说明；
- Study / Capability 总览在读者看到主问题之前先暴露整排研究导航和多组等权重 orientation；
- Workspace 第一屏一度同时出现约 20 个可读或可点击对象；
- 模型详情第一屏出现 14–16 个引用、来源与页内导航操作；
- Lab 的互动讲解器还在页面下方，但 `Previous / Play / Next / Reset` 因 `position: fixed` 从初始加载就占据第一屏；
- Flow Server 在 H1 后立即把磁盘、GPU、CPU、RAM 四个资源标题做成同权重视觉中心。

这些页面的数据大多正确，H1 也可见，但读者仍必须自己决定“第一眼到底看谁”。因此 **Contract 存在不等于 Contract 被兑现**。

## 认可处理

本轮把高层入口和典型子页改为同一个认知原则，而不是同一个视觉模板：

1. **一个主题**：先让读者识别真实对象；
2. **一个最重要事实 / 用途**：结果页先给结果，目录先给如何开始，操作页先给任务与边界；
3. **1–2 个主要动作**：其余导航、引用工具、浏览方式和 provenance 后置；
4. **次要复杂度 progressive disclose**：模型 / 方法 / 环境 / 记录卡、术语、引用工具、长导航等保留，但不抢第一屏；
5. **会改变解释的边界仍默认可见**：claim-changing caveat、比较双方、运行授权、安全边界不能为了数字好看而隐藏。

## 可执行回归

`SiteReaderContract` 增加 `firstViewportBudget`，浏览器 Gate 在 1280×633 与 390×844 上实际统计第一屏：

- visible interactive targets；
- visible H1/H2/H3；
- visible text characters。

高层入口显式注册预算，其他页面按 attention mode 使用默认预算。闭合 `<details>` 的内部内容不参与当前第一屏竞争，但 summary 仍算一个动作。

**预算是报警器，不是审美分数。** 如果失败，默认先修信息层级；不能把 `maxInteractive` / `maxHeadings` / `maxTextChars` 调大来“修 CI”。只有页面任务本身确实要求更多同时可见信息，并经零上下文冷读证明不可再降级时，才允许调整预算及其理由。

## 与相邻案例的关系

- **CASE-068** 已经规定“一个首屏只承担一个主要理解任务”；CASE-080 证明这条规则不能只靠 prose contract 或 H1 几何检查执行。
- **CASE-069** 说明字号、加粗和标题是在分配注意力；CASE-080 把这个结论推广到按钮、导航、卡片和固定控件。
- **CASE-079** 说明即使一行里有部分信息有用，也要继续审查剩余重复层；CASE-080 同样要求逐个判断首屏元素是否真的需要同时存在。

## 规律

**首屏的可读性不是“所有元素都正确且可见”，而是“一个零上下文读者不用自己做信息排序”。默认结构是：一个主题 → 一个最重要事实/用途 → 1–2 个主要动作 → 其余下沉。Reader Contract 必须在真实渲染的注意力竞争中兑现，而不只是存在于注册表里。**

这条规则不是要求所有页面变成 hero，也不是“越空越好”。机制页可以把开始/停止条件作为主要对象，比较页可以同时保留比较双方，操作页必须保留授权与安全状态。统一的是读者当下的认知任务，不是页面皮肤。
