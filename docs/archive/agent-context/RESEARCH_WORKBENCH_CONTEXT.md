---
kind: project-context
status: active
updated: 2026-08-10
scope: basemodel V2 Research Workbench
source: 2026-08-07 research-workbench implementation conversation
---

# Basemodel V2 Research Workbench：Agent Context

## 一句话目标

把网站从“模型数据库 + 独立工作台”推进成研究决策系统：研究任务、模型、论文、Claim、Evidence 和 Decision 必须形成可追溯闭环。

## 不可改变的技术边界

- 保留 Astro static、React、Nano Stores、Zod、Content Collections、Vitest、Playwright 和 GitHub Pages。
- 研究工作台状态使用 URL + localStorage/Nano Stores；URL 是可分享协议，本机状态用于恢复，URL 优先于 localStorage。
- 不迁移 Next.js、Remix、SSR、数据库、登录系统或后端 API。
- 保留既有 model ID、paper ID，以及 `/models/[id]/`、`/papers/[id]/` 等公共 URL。
- 公开事实来自 `src/content/`；没有来源支持的值必须保留语义缺失状态。

## 研究语义不变量

### 未知不等于否

`not_verified`、`not_disclosed`、`not_reported`、`not_published`、`unavailable` 和 `not_applicable` 都是数据状态，不能转成 `false`、`0` 或硬失败。

研究引擎使用 `pass / fail / unknown / not_applicable`。只有明确事实冲突才是 hard fail；未知事实进入待核验或条件候选，行为由 `EvidencePolicy` 决定。

### 角色与训练方式正交

不能因为模型承担 `Teacher`、`Critic`、`Actor` 或 `Judge` 角色，就推断它适合 SFT、RL 或其他更新方式。角色适配必须来自论文/代码中的直接角色证据；没有证据就返回 unknown。

### 严格复现必须保留原始参考

strict/method 模式需要论文、原始模型和角色的明确选择。strict 的原始模型即使旧、昂贵或不符合当前硬件，也必须作为基准显示，并标记资源不匹配；不能因为推荐逻辑而消失。

### 不制造综合性能分数

研究匹配应展示可行性、研究适配、可比性、可复现性和证据质量等维度及其理由/风险。内部排序 key 不得被渲染成“综合性能排行榜”。

### 硬件只表达粗粒度研究档位

没有实测或官方证据时，只能表达硬件 tier 或启发式规划值；不能根据参数量自行声称精确显存。

## 状态与 URL 协议

- ResearchTask 使用版本化 schema；默认“未创建任务”不是 strict。
- 任务分享 URL 使用 `?v=2` 和命名参数，例如 `mode`、`paper`、`model`、`roles`、`update`、`gpu`、`runtime`、`priority`。
- Compare 只使用 `/compare/?models=id1,id2`，不要重新引入 `ids`。
- 所有中英文链接经过 `localePath()`；不能把中文 `/workspace/` 硬编码进英文页面。
- 页面壳统一使用 AppLayout，使 ResearchContextBar 和 Compare Tray 在模型、论文、家族、对比和详情页持续存在。

## Evidence 与 Decision 的最小闭环

用户看到的链路必须是：

```text
事实/判断 → Claim → 支持或反驳它的 Source → locator / checked_at → 研究影响
```

- Evidence UI 以 Claim 为中心，不要求用户从一串来源反推来源支持了什么。
- `source.supports[]` 是第一阶段字段级证据索引；真实 Claim collection 可在有可信数据后继续扩充。
- 内部字段 path 不直接展示给用户；使用 `fieldCatalog` 的人类标签和本地化影响说明。
- Boolean 和 semantic status 使用统一的 `SemanticStatus`，不能靠颜色单独表达状态。
- Decision Memo 应保存任务、候选、排除理由、未知字段、来源包、比较结果和数据 revision；导出格式由独立 formatter 生成，不在组件里拼接。

## 页面职责

- 公共模型页回答“事实是什么”。
- Workspace 回答“这些事实对当前研究意味着什么”。
- 论文页回答“原实验为什么这样选模型、角色和方法”。
- Replacement/Compare 回答“换模型后哪些变量改变、是否破坏直接可比性”。
- Evidence 层回答“这个判断依据什么”。
- Decision Record 回答“几个月后还能否复原当初为什么这样选”。

## 当前仓库事实源

优先阅读并以这些文件为准，不要凭旧聊天状态判断完成度：

- `docs/V2_PRODUCT_COMPLETION_MATRIX.md`：18 个黄色项、25 个红色项及外部阻塞。
- `docs/V2_COMPLETION_CHECKLIST.md`：窄版 release gate。
- `docs/V2_ADVERSARIAL_ACCEPTANCE.md`：反向验收和事实语义边界。
- `src/lib/schemas.ts`、`src/content.config.ts`：模型、论文、Claim、benchmark、guide、change event 的数据契约。
- `scripts/audit-v2-completion.ts`、`scripts/audit-v2-adversarial.ts`：自动验收入口。
- `src/lib/research/`、`src/lib/evidence/`：决策引擎、替换影响和证据派生逻辑。

当前 Content Collections 包含 `models`、`papers`、`claims`、`benchmarkRuns`、`guides` 和 `changeEvents`。不要因某个集合内容暂时为空而填充猜测记录。

## Agent 继续开发协议

1. 先执行 `git status --short --branch`、`git remote -v`，确认真实 checkout 和不属于当前任务的 dirty changes。
2. 先读本目录、`docs/V2_*` 和相关 schema/测试，再修改页面；不要重复实现已经存在的 completion matrix 条目。
3. 涉及数据字段时先更新 schema、证据语义和回归测试，再考虑 UI；不以 UI 缺字段为理由删除 semantic status。
4. 涉及路由或持久化时同时验证中文、英文、GitHub Pages base path、刷新恢复和分享 URL。
5. 完成前至少运行 `npm run check`、`npm run validate`、`npm test`、`npm run build` 和相关 Playwright；审计告警要区分代码失败、数据缺证据和外部 URL 波动。
6. 没有外部服务授权时，明确标记云端保存、账号、团队协作和数据库为 blocked，不得用 localStorage 模拟并宣称已完成。

## 这段对话的历史交接快照

对话中的早期实现曾验证过 ResearchTask v2、三值研究引擎、统一 AppLayout、Compare `models` URL、移动端 Workspace、Claim → Evidence、替换影响和决策导出；随后仓库又有新的 CI、SEO、无障碍、论文学习指南和视觉回归提交。因此这些历史验证只能作为方向线索，不能替代当前 checkout 的重新验证。

归档当天的工作树曾包含未提交的 CI/视觉回归改动；任何 agent 都必须先检查当前 `git status`，不能把这些改动默认为本归档的一部分，也不能使用 `git reset --hard` 清理它们。

## 明确禁止

- 把 unknown 当 false。
- 根据角色推断训练能力。
- 把开放权重写成开源。
- 虚构论文 workflow 边、精确 VRAM、benchmark 排名或作者/硬件事实。
- 删除既有模型/论文 ID 或破坏公共 URL。
- 为了让 CI 变绿而删除审计、放宽 schema 或填充猜测数据。
- 把静态 GitHub Pages 的本地恢复能力说成跨设备云端同步。
