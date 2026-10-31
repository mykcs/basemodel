# Current development direction

**CI mode: `SPECIALIZED_CI`.**

BaseModel develops a research website that helps readers understand models, methods, experiments, evidence boundaries, and reproducible next steps. The [current Wish](../wish/LATEST.md) owns product intent; research and experiment authorities own scientific claims.

**当前工程选择（用户 2026-10-30 确认）：保持 `mykcs/basemodel` GitHub 源码仓库公开**，使用公开仓库的 **标准 GitHub-hosted Actions** 进行免费独立 CI（有并发、运行时间、滥用政策及特定服务费用边界，**不是无限算力**）。将 CI 与网页部署解耦。现在必须在准确、与 `main` 同步的 PR HEAD 上同时通过 `public-ci-gate`（代码与真实浏览器）和 `cloudflare-artifact-gate`（无密钥 Worker 构建与 dry-run）；两项均由 GitHub Actions 提供，不消耗 Vercel/Cloudflare 发布额度。只有指定读者才应能访问当下受保护的网页入口；**网页登录保护不等于公开 GitHub 源码、Git 历史或以前的镜像受保护**。详见 [DESIGN.md](DESIGN.md)。

当前发布分工：GitHub Actions 做两道 PR 门禁；**Cloudflare Workers + Access 是默认受保护的手动发布端**（只从已合并的 `main` 显式发布、前后检查 Access）；**Vercel Authentication 保护的旧 Production 保持可用，按配额与健康状况手动回退/更新**。普通 PR 和 `main` 不再自动触发 Vercel 部署。CircleCI 和 Mac runner 只保留故障恢复用途；不让本地 Mac 或科研 GPU 承担日常 CI。没有为普通 PR 自动打开额外 Cloudflare/Vercel 构建。

**2026-10-30 首次受保护 Worker 发布（历史记录）**：[`CI/REVERSIBLE_HOSTING.md`](CI/REVERSIBLE_HOSTING.md) 的 Cloudflare Workers + Access 备用线路已在 [GitHub Actions #41044575890](https://github.com/mykcs/basemodel/actions/runs/41044575890) 从固定 `main@e7eee109` 成功部署；上传前后 4/4 匿名 Access 跳转 PASS，已有授权会话浏览器完成首页、研究页、JSON、SVG、旧路由及 iPhone 18 Pro Max 视口的代表性验收。GitHub `cloudflare-protected` Environment 保存仅限独立 Worker 的凭据，`main` 限定；原 Vercel 正式发布与访问保护维持不变。**同日控制面切换：** [PR #975](https://github.com/mykcs/basemodel/pull/975) 合并为 `6f60ff67`；GitHub `main-pr-gate` 规则集和旧式 `main` 分支保护都实际替换为上述两项检查，保留严格 current-base 与既有审查限制。当前 Worker 部署 SHA、最新发布验收与可切换步骤必须按 [配额感知操作手册](CI/QUOTA_AWARE_PROVIDER_SWITCH.md) 实时读回。尚无自有域名，因此只能切换两个不同受保护网址，不能声称同一网址一键切换。

**已取代的旧设想：** 2026-10-29 提出的“低频时将仓库改为私有”仅保留在 [`CI/PRIVATE_REPOSITORY_STRATEGY.md`](CI/PRIVATE_REPOSITORY_STRATEGY.md) 作为历史比较；**当前不执行私有化**。若未来出现必须隐藏源码的真实需求，重新评估源代码公开风险、私有 CI 额度和等价验收，再另行决策。现有站点对外链接和访问策略由 [`CI/REVERSIBLE_HOSTING.md`](CI/REVERSIBLE_HOSTING.md) 指引；没有自有域名时只能**切换不同受保护网址**，无法把 `.vercel.app` 变成 `.workers.dev`。

[DESIGN.md](DESIGN.md) explains the choice. [The current hosting contract](../agents/current/hosting-architecture.md), [release policy](../agents/current/deployment-policy.md), workflow files, branch rules, and live provider state own the mutable details and required evidence.
