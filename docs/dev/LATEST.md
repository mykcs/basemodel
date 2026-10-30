# Current development direction

**CI mode: `SPECIALIZED_CI`.**

BaseModel develops a research website that helps readers understand models, methods, experiments, evidence boundaries, and reproducible next steps. The [current Wish](../wish/LATEST.md) owns product intent; research and experiment authorities own scientific claims.

**当前工程选择（用户 2026-10-30 确认）：保持 `mykcs/basemodel` GitHub 源码仓库公开**，使用公开仓库的 **标准 GitHub-hosted Actions** 进行免费独立 CI（有并发、运行时间、滥用政策及特定服务费用边界，**不是无限算力**）。将 CI 测试与网页部署解耦，减少 Vercel Provider build 次数；以 `public-ci-gate` + 精确 PR HEAD 的 `Vercel` 检查为当前必需合并合同，不能为省额度删验收。只有指定读者才应能访问当下受保护的网页入口；**网页登录保护不等于公开 GitHub 源码、Git 历史或以前的镜像受保护**。详见 [DESIGN.md](DESIGN.md)。

当前发布分工：GitHub Actions 完成仓库/浏览器验证；Vercel 从 `main` 发布受 **Vercel Authentication** 保护的正式站点，最后候选还需 Vercel 独立构建证明。Cloudflare Workers + Access 是**已部署、手动发布的受保护备用入口**，不是第二个自动正式站点。CircleCI 和 Mac runner 只保留故障恢复用途；不让本地 Mac 或科研 GPU 承担日常 CI。没有为普通 PR 自动打开额外 Cloudflare/Vercel 构建。

**2026-10-30 可逆备用站已部署（未切正式入口）**：[`CI/REVERSIBLE_HOSTING.md`](CI/REVERSIBLE_HOSTING.md) 的 Cloudflare Workers + Access 备用线路已在 [GitHub Actions #41044575890](https://github.com/mykcs/basemodel/actions/runs/41044575890) 从固定 `main@e7eee109` 成功部署；上传前后 4/4 匿名 Access 跳转 PASS，已有授权会话浏览器完成首页、研究页、JSON、SVG、旧路由及 iPhone 18 Pro Max 视口的代表性验收。GitHub `cloudflare-protected` Environment 保存仅限独立 Worker 的凭据，`main` 限定；原 Vercel 正式发布与访问保护维持不变。尚无自有域名，因此当前只能切换两个不同入口网址，不能声称同一网址一键切换。

**已取代的旧设想：** 2026-10-29 提出的“低频时将仓库改为私有”仅保留在 [`CI/PRIVATE_REPOSITORY_STRATEGY.md`](CI/PRIVATE_REPOSITORY_STRATEGY.md) 作为历史比较；**当前不执行私有化**。若未来出现必须隐藏源码的真实需求，重新评估源代码公开风险、私有 CI 额度和等价验收，再另行决策。现有站点对外链接和访问策略由 [`CI/REVERSIBLE_HOSTING.md`](CI/REVERSIBLE_HOSTING.md) 指引；没有自有域名时只能**切换不同受保护网址**，无法把 `.vercel.app` 变成 `.workers.dev`。

[DESIGN.md](DESIGN.md) explains the choice. [The current hosting contract](../agents/current/hosting-architecture.md), [release policy](../agents/current/deployment-policy.md), workflow files, branch rules, and live provider state own the mutable details and required evidence.
