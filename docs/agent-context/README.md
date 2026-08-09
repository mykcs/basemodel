# Agent Context

这是仓库内供编码 agent 读取的长期项目上下文，不是逐轮聊天记录。

## 读取顺序

1. [Research Workbench context](./RESEARCH_WORKBENCH_CONTEXT.md)：目标、不可破坏的语义、状态协议和继续开发规则。
2. [V2 completion matrix](../V2_PRODUCT_COMPLETION_MATRIX.md)：当前产品完成度和外部阻塞项。
3. [V2 completion checklist](../V2_COMPLETION_CHECKLIST.md)：可自动验收的 release gate。
4. [Adversarial acceptance](../V2_ADVERSARIAL_ACCEPTANCE.md)：反向验收和“不能把未知说成事实”的边界。

## 维护规则

- 这里记录稳定的架构决策和交接约束；页面完成度以 `docs/V2_*` 文档为准。
- 修改 schema、状态语义或路由协议后，必须同步本目录和相应测试。
- 不把本地一次成功的构建、外部 URL 可访问性或第三方目录结果写成科学事实。
- 开始新任务前先检查 `git status --short --branch`，并保留不属于当前任务的工作树改动。
