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

## Cloudflare Pages 构建配额保护（2026-08-10）

- 本账户 Pages Free 的月度 Git 集成构建上限按 500 次处理；预览、截图和视觉验证默认先用本地 `npm run dev` 或本地 `npm run build`，不要先触发 Cloudflare Pages Build。
- 需要线上临时预览时，只上传已经在本地生成的静态输出（Direct Upload，例如 `npx wrangler pages deploy <OUTPUT_DIR> --project-name=<PROJECT_NAME>`）；不要把临时预览提交到会触发 Git 集成构建的分支。
- 已在本账户用独立临时项目实测 Direct Upload：部署记录显示为 `Assets uploaded`、没有 Pages Build 记录；测试前后账户 Workers build minutes 都是 `337 / 3,000`。Cloudflare 当前界面不提供 Pages 已用/剩余次数的直接计数器，因此这条证据证明“不走 Pages 构建器”，不能伪装成官方剩余计数。
- Pages 与 Workers Builds 是两套口径：此前审计的 Pages 非 `Skipped` 记录约为 381；598 是四个 Workers 项目的非 `Skipped` 记录，不是 Pages 的 500 次。

### 网页改动后的默认交付

- 改动完成并验证后，必须明确说明网站已改好、是否触发 Cloudflare Pages Build，并给出新的公开预览网址。
- 预览默认走本地构建 + Direct Upload；只有确实拿到 URL 时才报告预览地址。构建失败、上传失败或配额无法确认时，必须如实报告。
