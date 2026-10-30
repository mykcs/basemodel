# BaseModel 配额感知双服务商：固定 CI、可切换发布与回退

状态：**双服务商源码合同已形成；实际切换以线上门禁与生产验收为准。** 本文件记录 2026-10-30 用户新增的工程愿望、已实现的候选代码和必须按顺序完成的现场手续。活跃状态以 GitHub 的 `main` ruleset、Actions、Cloudflare Access、Vercel 和真实登录浏览器为准。PR #975 通过前，旧 Vercel 必需检查仍可能生效；不能根据本文件宣称线上控制面已完成迁移。

## 愿望（WHY）

当 Vercel Hobby 的每日部署次数、Cloudflare 的 Worker/构建额度或某家的故障阻碍开发时，**可在两个服务商之间快速选一个工作**，不依赖 Mac 长期开机，不为同一 PR 反复部署，不牺牲测试、隐私或回退。默认优先 Cloudflare，Vercel 保留可用的兜底发布能力。这是“按配额与健康状况选择发布商”，**不是**把两家的免费额度叠成一个无限池，也不是在服务商故障时开放匿名访问。

## 目标拓扑（全部完成迁移后才生效）

```text
PR exact HEAD
  ├─ GitHub Actions public-ci-gate：隐私、内容、构建、风险分级真实浏览器
  └─ GitHub Actions cloudflare-artifact-gate：Cloudflare 专属路由、noindex、静态 Worker、Wrangler --dry-run
       └─ 两者都成功 + strict/current-base → 才能合并 main

已合并 main
  ├─ 选择 Cloudflare：受保护 Environment → Access 预检查 → 发布 exact-main → Access 后检查 → 登录验收
  └─ 选择 Vercel：现有 Vercel Git/Provider 发布入口 → 已授权登录验收

用户入口：Cloudflare Access URL ⇄ Vercel Authentication URL（目前只能换链接）
```

与旧架构的区别：**Vercel 必需 `Vercel` PR 检查在 Cloudflare 通道通过完整资格认证后从 ruleset 替换出去；它不再耗费每个最终 PR 的 Hobby 部署额度。** Vercel 平台和现有登录门保留，不在普通 PR 中自动构建。两边的发布端都有自己的实际登录验收，不能用 Wrangler `--dry-run` 冒充真正发布成功。

源码同时把 `vercel.json` 的 `git.deploymentEnabled.main` 置为 `false`，从源头停止普通合并后自动触发 Vercel；`ci/vercel-gate-final` 保留为**可选**的手动 Vercel Provider 验证入口。生产身份检查不再在每次 `main` push 时比较 Cloudflare 新 SHA 和故意停留在旧版本的 Vercel 回退站，只在 Vercel 部署状态或显式手动检查时触发。此配置不会删除现有 Vercel Production、DNS 或认证。

## 已落地的候选实现

| 检查/操作 | 做什么 | 是否产生服务商部署 | 额度性质 |
| --- | --- | --- | --- |
| `public-ci-gate` | 精确 PR head 的完整仓库与分级浏览器测试 | 否 | 公开仓库标准 GitHub-hosted CI |
| `cloudflare-artifact-gate` | 从同一 PR head 验证 Cloudflare 静态构建与路由/安全设置，最后执行 Wrangler `deploy --dry-run` | **否**，没有 Cloudflare/Vercel 发布凭据 | 额外一份 GitHub 构建；未来可以在同一流水线共享产物后优化 |
| `Protected Cloudflare Site (manual)` → `plan` | 从当前 `main` 打包、封存 SHA、验证与 PR 一致的 Worker 契约 | 否 | GitHub 构建 |
| 同一工作流 → `deploy` | 先验证现有 Access、只发布已封存 main 产物、再次验证 Access | 仅受保护 Cloudflare Worker | 仅在操作员选择时消耗 Worker 发布额度 |
| `node scripts/request-vercel-final-gate.mjs <PR>` | 旧的最终候选 Vercel Preview 门 | 是 | **在旧 ruleset 生效期间仍然必须**；切换后仅按需走回退路线 |

Cloudflare 候选门使用 `pull_request` + `contents:read` + 无 secrets，禁止 Preview/Production 发布；其 `wrangler.standby.jsonc` 继续强制 `preview_urls=false`、独立静态 Worker。`cloudflare-artifact-gate` 只证明离线 provider 兼容性，**不证明 Cloudflare Access 身份名单、部署成功、视觉交互**。不能把一个普通 Cloudflare 免费公开 Preview 当成私有 BaseModel 的验收环境。

## 切换权限的安全事务（必须串行执行，严禁直接删掉 Vercel 检查）

1. 将候选 PR 与现行 `main` 同步到 exact HEAD；让 `public-ci-gate` 和 `cloudflare-artifact-gate` 在真实 GitHub Actions 完整 PASS，并确认新检查所属 GitHub Actions App ID 与现行 required context 的来源一致。任何 `skipped`、失败、stale head 都不算成功。
2. 用当前已授权、**受 Cloudflare Access 保护**的 `basemodel-access-standby` 进行候选工作流的 `main` 受保护发布，不允许把未经合并的 PR 上传现有备用 Worker，也不能先创建公开 preview。读回执行 SHA、部署状态、匿名多路径登录挑战、Access 策略和有权限浏览器真实页面/交互。
3. 再次读取 GitHub `main-pr-gate` 规则集（ID `22224550`），**一次原子更新**只替换 `Vercel` (App 8329) 为 `cloudflare-artifact-gate` (GitHub Actions App 15368)；保留 `public-ci-gate`、strict、PR/review/其他规则和 no-bypass。修改前备份原始规则 JSON 与可恢复操作。若 API 无管理权限，则停在当前 Vercel 门，不能借助其他路径绕过真实权限拒绝。
4. 用一个新鲜、与最新 `main` 对齐的真实 PR 验证两个必需 GitHub Actions 检查在新的 ruleset 下都产生 PASS、Vercel 失败/缺失**不会**阻塞合并；再读回 ruleset 确认；执行一次正常合并并用 Cloudflare 受保护流程部署 exact merged SHA。
5. 通过生产登录的首页、`/research/seed-openevo/flow/`、结果页、旧路径重定向、JSON、SVG、iPhone 18 Pro Max 交互与匿名拒绝检查。将 Cloudflare 设为日常读者入口；再评估是否关闭 Vercel `main` 的**自动** Git 发布以节省额度。**必须先证明已有独立 Vercel 手动恢复发布办法可行**；不删除 Vercel 项目、授权或旧站。

其中第 2、4、5 步需要真实线上证据，不得把 `plan`、PR 已创建、静态构建或匿名 302 单独写成“迁移完成”。每次改 GitHub control plane 都先读回有无其他窗口已经修改，避免覆盖并行操作者。

### 低成本快速操作（只操作已经授权的现有项目）

**发布 Cloudflare：** 先核对目前 Worker 的 `standby-source-sha.txt` 和仓库 `main` 的 SHA；如果已相同直接使用现有站点，不产生部署。不同且需要更新时，从 GitHub 已授权操作端显式运行：

```bash
gh workflow run cloudflare-standby.yml -R mykcs/basemodel --ref main -f operation=deploy
```

等待同一次运行的 `standby-verified-build`、`standby-protected-deploy` 全绿后，重新核对源 SHA、四条未登录 Access 探针与真实登录浏览器（包括移动端）。`plan` 只构建和检查，不发布。

**切到现成的 Vercel 回退：** 不执行任何命令，直接使用原有登录保护的 Vercel URL，明确告知其部署 SHA 可能比 Cloudflare 旧。**只有 Vercel 也需要更新时**，使用已有授权 CLI 和经过确认的项目工作目录：先确认 `main` 精确 SHA、无未提交/未跟踪产物、已链接的是预期 Vercel 项目，再执行 `vercel deploy --prod` 一次；读取真实 Production SHA、登录后页面与 Vercel Authentication，若不符合则恢复既有成功版本。绝不以 Vercel Git 自动 PR/`main` 触发代替明确选择，也不为“看看能否发布”创建额外部署。

**快速切换目前指换两条已存在的链接或显式发布其中一个服务商**，不是同域名自动换源；自动流量切换仍需要受控自有域名，尚未获授权实施。

读者可查看 `/development/` 的中文 CI 流程和双服务商入口；这次更新属于正文结构变化，已在 `typography-intelligence-ui-delta.mjs` 中用前后 SHA 明确使旧 `/development/` 视觉观测失效。**必须在新的 Cloudflare exact-main 部署上重新做桌面/iPhone 18 Pro Max 页面与链接验收**，不能继承历史排版截图的 PASS。

## 操作员快速选择卡

| 触发条件 | 选择 | 操作与回退 |
| --- | --- | --- |
| Vercel Hobby 达部署限制；Cloudflare 额度与 Access 正常 | **Cloudflare** | 先核对目前 Worker 的 SHA；已是目标版本则**不重部署**，直接用受保护 Cloudflare 链接。否则从最新 `main` 手动 `plan`/`deploy`，完成有权限浏览器验收。 |
| Cloudflare 额度、Worker 或 Access 异常；Vercel 可用 | **Vercel 回退** | 使用仍有 Vercel Authentication 的旧站；确认其真实部署 SHA 与页面并告知版本可能落后。需要新版本时按当前授权发布流程执行，不重复刷 Hobby 限额。 |
| 两端均受限 | **冻结发布，不冻结科研/开发** | 继续 GitHub Actions PR 检查与源码开发，保留最后一次通过验收的受保护站；排队等待额度恢复。不能关闭 Access/Authentication 来“修好”发布。 |
| 想同一个网址自动切后台 | **待域名方案** | `.vercel.app` 和 `.workers.dev` 不能彼此接管；另需用户持有的域名、DNS/TLS、双端 Access/身份配置和可回退切流事务。未完成，不计入当前目标。 |

当前两条入口：

- Cloudflare：<https://basemodel-access-standby.gemini202405.workers.dev/>（Access）
- Vercel：<https://basemodel-preview.vercel.app/>（Vercel Authentication）

**安全边界：** 公开 GitHub 源码并不由任何网站登录门保护；私人原始资料、密钥、身份名单不得进入公开仓库、PR 日志、构建产物或网站。发布证据只记录 SHA、检查 PASS、页面路由、时间、匿名拒绝结论，不记 Cookie、Token 或身份邮箱。保留 [完整可逆发布原 SOP](REVERSIBLE_HOSTING.md) 和 [当前活跃部署政策](../../agents/current/deployment-policy.md)。
