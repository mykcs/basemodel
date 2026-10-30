# Current development direction

**CI mode: `SPECIALIZED_CI`.**

BaseModel develops a research website that helps readers understand models, methods, experiments, evidence boundaries, and reproducible next steps. The [current Wish](../wish/LATEST.md) owns product intent; research and experiment authorities own scientific claims.

Development favors repository-owned validation and selective browser work before hosted acceptance. GitHub owns source, PRs, and repository/browser checks. A separate Vercel check proves that the accepted candidate builds through the real website provider; Vercel publishes access-protected Production from `main`. Human review may use a lightweight, non-authoritative Preview. CircleCI and the Mac runner remain manual recovery options; Cloudflare is legacy/fallback tooling, not an active Production monitor.

**2026-10-30 可逆备用站已部署（未切正式入口）**：[`CI/REVERSIBLE_HOSTING.md`](CI/REVERSIBLE_HOSTING.md) 的 Cloudflare Workers + Access 备用线路已在 [GitHub Actions #41044575890](https://github.com/mykcs/basemodel/actions/runs/41044575890) 从固定 `main@e7eee109` 成功部署；上传前后 4/4 匿名 Access 跳转 PASS，已有授权会话浏览器完成首页、研究页、JSON、SVG、旧路由及 iPhone 18 Pro Max 视口的代表性验收。GitHub `cloudflare-protected` Environment 保存仅限独立 Worker 的凭据，`main` 限定；原 Vercel 正式发布与访问保护维持不变。尚无自有域名，因此当前只能切换两个不同入口网址，不能声称同一网址一键切换。

**Pending direction (not yet deployed):** the owner prefers a private GitHub repository now that normal build demand is low. [`CI/PRIVATE_REPOSITORY_STRATEGY.md`](CI/PRIVATE_REPOSITORY_STRATEGY.md) records the high-frequency and low-frequency alternatives, privacy scan, quota distinctions, required-check migration gates, and rollback. The repository remains **public** and the current `public-ci-gate` + `Vercel` merge contract remains intact until a proven, explicitly approved cutover.

[DESIGN.md](DESIGN.md) explains the choice. [The current hosting contract](../agents/current/hosting-architecture.md), [release policy](../agents/current/deployment-policy.md), workflow files, branch rules, and live provider state own the mutable details and required evidence.
