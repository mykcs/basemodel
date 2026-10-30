# Current development direction

**CI mode: `SPECIALIZED_CI`.**

BaseModel develops a research website that helps readers understand models, methods, experiments, evidence boundaries, and reproducible next steps. The [current Wish](../wish/LATEST.md) owns product intent; research and experiment authorities own scientific claims.

Development favors repository-owned validation and selective browser work before hosted acceptance. GitHub owns source, PRs, and repository/browser checks. A separate Vercel check proves that the accepted candidate builds through the real website provider; Vercel publishes access-protected Production from `main`. Human review may use a lightweight, non-authoritative Preview. CircleCI and the Mac runner remain manual recovery options; Cloudflare is legacy/fallback tooling, not an active Production monitor.

**2026-10-30 可逆发布候选（尚未部署）**：[`CI/REVERSIBLE_HOSTING.md`](CI/REVERSIBLE_HOSTING.md) 规定 Cloudflare Workers + Access 的独立备用线路，使用手工 `plan`／`deploy`、与 Vercel 共享的静态路由、安全响应头、先验 Access 检查与可恢复 Vercel 域名。它不改变当前正式发布架构；真正启用前还需要 Cloudflare 的 Access 与凭证配置和实际登录浏览器验收。尚无自有域名，所以暂时不能“同一网址一键换平台”。

**Pending direction (not yet deployed):** the owner prefers a private GitHub repository now that normal build demand is low. [`CI/PRIVATE_REPOSITORY_STRATEGY.md`](CI/PRIVATE_REPOSITORY_STRATEGY.md) records the high-frequency and low-frequency alternatives, privacy scan, quota distinctions, required-check migration gates, and rollback. The repository remains **public** and the current `public-ci-gate` + `Vercel` merge contract remains intact until a proven, explicitly approved cutover.

[DESIGN.md](DESIGN.md) explains the choice. [The current hosting contract](../agents/current/hosting-architecture.md), [release policy](../agents/current/deployment-policy.md), workflow files, branch rules, and live provider state own the mutable details and required evidence.
