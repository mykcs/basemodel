# BaseModel CI：构建频率与源码隐私的两种运行模式

状态：**迁移提案／待验证**，2026-10-29 核对官方规则。此文属于 BaseModel 的 `docs/dev/` 决策说明，不代替 `docs/agents/current/hosting-architecture.md` 的**当前**执行架构、仓库脚本、GitHub 必需检查和 Vercel 实时配置。**本提案不自动改变仓库可见性、CI、账单或站点访问权限。**

## 先说结论

**认可“两种需求负载、两种费用策略”，但不认可“公开仓库＝无限 CI”或“Vercel 构建＝完整 CI”。**

仓库是否公开是数据开放／隐私决定；每日部署数量是一个计量指标；能否安全合并需要的测试与部署属于另外两项职责。三者相关，不能合并成同一个开关。优先保障隐私，再选择符合成本与验收要求的计算路线。仓库不应因为短期流量高就自动由私有切回公开。

## 当前真实情况与拟议目标

| 层次 | 2026-10-29 当前观察 | 拟议低频目标 |
| --- | --- | --- |
| GitHub 源码 | `mykcs/basemodel` 为**公开**仓库 | 在安全和权限检查通过后改为**私有** |
| 普通 PR 验收 | `public-pr-ci.yml`：确定性检查、风险分级 Chromium；必需状态 `public-ci-gate` | 保留等效测试和精确 SHA／当前基线绑定，重新评估在私有 Actions 或其他可信云执行 |
| Vercel | 项目 `basemodel-preview`：`ci/vercel-gate-final` 的精确候选构建，`main` Production；实际 `buildCommand = npm run build` | 继续负责 Preview／Production 和网站构建；**若想增加 CI，须另行实现并验证** |
| 其他 | CircleCI、Mac 仅手动恢复；Cloudflare Pages 为历史回滚 | 不因私有化重新开启自动构建或占用科研 GPU |
| 访问隐私 | 实测项目 `ssoProtection.enabled = true`、`deploymentType = all` | 继续核对网页访问保护；**仓库私有不会自动保护已发布的站点内容** |

## 模式 A：膨胀期，部署远超每天 100 次

### A1. 公开源码确实符合产品与隐私要求

- 先对 `src/`、`public/`、静态生成物、文档、Git 历史、PR／CI 产物、第三方链接做公开安全审查，特别是姓名、个人对话、账号、服务器及不可撤回的实验资料。
- **只有明确愿意公开源码**时，才考虑公开 GitHub 源码仓库，利用 GitHub 标准托管 Actions 的公开仓库免费运行量来承担独立测试和浏览器矩阵。
- “免费且无按分钟计费的公共仓库额度”**不是无限并发或无限计算权限**；GitHub 仍有运行时长、并发、滥用及使用条款限制。保持精确 SHA、受保护分支和无密钥 PR 运行边界。
- Vercel 继续承担真实站点构建与发布。若实际超出 Hobby 100 次／天，可评估 Pro（官方上限 6,000 次／天）、合并触发、忽略非部署文件和成本。不要为了凑部署次数每次推送都执行网站构建。

### A2. 源码不允许公开

- **保持私有**。即便部署显著超过 100 次／天，也不能把隐私风险换成免费 Actions 分钟。
- 可使用当前 Vercel Pro 或按需调整套餐，并用私有仓库可用的 GitHub Actions 包含额度／付费 Runner、合格的独立云 CI、经过审计的浏览器执行环境完成剩余检查。先测量每月分钟数、并发峰值、构建时长与真实费用，再决定是否迁移。
- 短期提高频率不意味着长久改变可见性。公开后再转私有不能收回历史提交、克隆、fork 或已发布产物。

## 模式 B：平稳期，每天约 100 次以内（当前倾向）

1. **源码拟议改为私有**：保留 GitHub 作为源代码、PR、保护规则的唯一权威；仅在审计和授权完成后改可见性。不会因为改私有就更便宜——私有 GitHub Actions 由账户包含额度与超额计费约束。
2. **Vercel 负责真实构建与发布**：仍然保持 `main` Production 和精确候选 Preview，尽量合并推送与发布。当前项目历史上使用 Pro；实时计费方案在正式切换前重新核对，不能将“100 次”说成现有项目配额。
3. **保留完整 CI 语义**：仓库需要类型／Lint／单元／科研审计、确定性构建、Chromium（必要时 WebKit）浏览器验收、隐私检查、PR exact-head/current-base、发布前后核查。Vercel 现在只执行 `npm run build`，不能声称自动覆盖上述测试。可让 Vercel 构建阶段承接一部分确定性检查，但真实浏览器与 GitHub 必需检查仍需可信执行者及状态回写。
4. **优先减少工作次数而非取消证据**：先用源代码层面的本地／Agent 验证、风险选择、浏览器分片、同 PR 合批、仅最终候选触发 Vercel；需要的独立测试在私有计量范围内运行，超预算先调整执行频率／提供容量方案，不能默默跳过测试。

## 官方限额：不要把四种额度混在一起

| 计量项 | 官方公开规则（查询日 2026-10-29） | 实际影响 |
| --- | --- | --- |
| Vercel Hobby 每日部署 | **100 次／滚动 24 小时** | 不是“每天 100 次免费的完整 CI”；还受小时级与资源约束 |
| Vercel Pro 每日部署 | **6,000 次** | 大于 100，不代表构建执行分钟数无限或零费用 |
| Vercel Hobby 构建频率／并发 | **32 次／小时、1 个并发构建** | 可能没到 100／天就先排队或撞小时限额 |
| Vercel 单次构建时长 | **45 分钟**（官方限额页） | 不宜把大型浏览器矩阵无条件塞入网页构建 |
| GitHub Actions，公开标准 Runner | 标准托管 Runner **免费**，仍有并发等限制 | 不是任意规模／任意用途的“无限机器” |
| GitHub Actions，私有仓库 | 按 GitHub 套餐有月度包含计算与存储；超额计费 | 需要估算 PR 数量 × 计划器／确定性／浏览器分片时长 |

原始文档（未来重新决策时复核，不把本表当成实时仪表盘）：

- [Vercel Limits](https://vercel.com/docs/limits)
- [Vercel Hobby 与 Pro 比较](https://vercel.com/docs/plans/hobby)
- [GitHub Actions Billing and Usage](https://docs.github.com/en/actions/concepts/billing-and-usage)
- [GitHub Actions Limits](https://docs.github.com/en/actions/reference/limits)
- [Vercel Deployment Checks](https://vercel.com/docs/deployment-checks)
- [GitHub Changing Repository Visibility](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/managing-repository-settings/setting-repository-visibility)

## 私有化前的验收门槛（全部满足才允许切换）

1. **内容、历史与外部副本：** 审核真实个人姓名／隐私记录、已发布静态内容、公开 Git 历史和 forks、CI artifacts／logs、第三方引用。源码改私有不会撤回以前的公开副本。GitHub 官方说明：现有公开 forks 会脱离并继续公开；stars/watchers 等可能受损。
2. **用户选择与备份：** 明确确认要变私有、是否保留公开科研复现资料、失去公开 PR／Actions 免费优势是否接受，以及可恢复／回滚方案。仓库权限、公开社区可见性与账单变化不能由此文自动执行。
3. **Vercel Git 与发布：** 在项目已配置的团队账户下验证私有仓库 GitHub App 授权、Webhooks、Preview、Production、保护／分享链接、忽略构建路径和主域名；账号与计划均以 Vercel 实时设置为准。
4. **CI 替换资格：** 在同一 PR HEAD＋当前 `main` 下运行等效的确定性／浏览器／隐私检查，获得来源可核查的终态成功，证明 GitHub 分支规则真正要求新检查后，才解除旧 `public-ci-gate` 必需状态。只出现 Vercel `READY` 不足以通过。
5. **费用预案：** 核算 30 天 Vercel 部署次数、构建执行分钟、同小时峰值、GitHub 私有计算分钟与 artifact 存储；设置预算预警和频率上限。验证故障／超额时不自动扩费或降格验收。
6. **切换与回滚：** 选一个确切提交完成可见性／执行器切换；PR 新旧检查交接、代码拉取、Preview／Production 浏览器验收及最小烟测全部读回；失败时先暂停合并，再按经过验证的回滚方案恢复，不能假定把私有切回公开就能撤销历史后果。

## 全站姓名审查边界

本轮按用户要求只检查发布源 `src/`、`public/` 中已知的私人教师／当事人姓名及变体；学术论文作者的必要正式引用、品牌、模型名称及研究账号路径不应未经判断一律删除。

- 发现历史科研汇报页 `src/pages/research/seed-openevo/recent-challenges/index.astro` 仍出现一处旧导师称谓，本提案关联的最小修复替换为 **W 老师**，不动原研究数据或其他段落。
- 新增 `src/lib/publicSitePersonaPrivacy.test.ts` 作为确定性回归，遍历生产源码／静态文件并阻止已知私人名称直接或 Unicode 转义形式重新出现；不保存未脱敏对话或当事人名单到公开站点。
- 正式私有化前仍须做**人工／语义复核**：自动字符串检查不能保证识别未知姓名、罗马化拼写、图片截图、可反查的昵称／账号或既有外部副本。尤其 `public/` 的 W&B 链接可能包含研究账号标识，这与真实个人姓名不同，但同样值得明确决定是否继续公开。

## 当前阶段不能做的事

- 不因本方案立即把公开仓库改私有，也不反复私有／公开切换。
- 不仅因 Vercel 达到 `READY` 就删除必需的独立浏览器／科研／安全检查。
- 不把 `100/天` 说成 Vercel Pro 的限制，不把 GitHub 公开 Actions 说成无条件无限免费，不把私有源码误认为私有网站。
- 不将原始聊天、真实名字、认证参数、短期分享令牌写进 README、CI 或公开 PR。

**下一步只有一个迁移决策：** owner 审阅低频私有目标之后，先执行私有 CI 额度与等价验收资格测试，再单独授权实际仓库可见性修改。当前 PR 与日常发布照既有 `public-ci-gate` + Vercel 合同运行。
