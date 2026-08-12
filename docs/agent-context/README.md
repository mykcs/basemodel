# Agent Context

这是仓库内供编码 agent 读取的长期项目上下文，不是逐轮聊天记录。

## 读取顺序

1. [Research Workbench context](./RESEARCH_WORKBENCH_CONTEXT.md)：目标、不可破坏的语义、状态协议和继续开发规则。
2. [Long-page navigation pattern](./LONG_PAGE_NAVIGATION.md)：长页面默认考虑的悬浮本页导航、响应式边界、可访问性和验收规则。
3. [V2 completion matrix](../V2_PRODUCT_COMPLETION_MATRIX.md)：当前产品完成度和外部阻塞项。
4. [V2 completion checklist](../V2_COMPLETION_CHECKLIST.md)：可自动验收的 release gate。
5. [Adversarial acceptance](../V2_ADVERSARIAL_ACCEPTANCE.md)：反向验收和“不能把未知说成事实”的边界。

## 维护规则

- 这里记录稳定的架构决策、页面表达约束和交接规则；页面完成度以 `docs/V2_*` 文档为准。
- 修改 schema、状态语义、路由协议或长期页面表达约束后，必须同步本目录和相应测试/验收规则。
- 不把本地一次成功的构建、外部 URL 可访问性或第三方目录结果写成科学事实。
- 开始新任务前先检查 `git status --short --branch`，并保留不属于当前任务的工作树改动。
