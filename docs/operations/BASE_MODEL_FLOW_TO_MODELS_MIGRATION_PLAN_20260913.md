# Base Model Flow → Models 迁移施工计划（2026-09-13）

> **Checklist authority**：本文件是本次对话后续施工、验收与收尾的唯一任务清单。后续自动任务必须从这里读取状态，只能在有证据时把 `- [ ]` 改成 `- [x]`。

## 0. 目标

把原页面：

`/research/seed-openevo/flow/base-model/`

中关于 **Qwen2.5-3B-Instruct 的模型身份、复现实验字段、公平比较控制变量** 完整迁移到模型区域的 canonical owner：

`/models/qwen2-5-3b-instruct/#experiment-setup`

同时让 `/models/` 成为自然入口，Research Flow 只保留“模型”链接，不再维护第二份正文；旧 URL 保留兼容跳转。

## 1. 不变边界

- 不重写 Qwen 模型目录的已有结构化事实。
- 不把 SEED/OpenEVO 的实验结果混进模型身份事实。
- 不让旧 `flow/base-model` 与新模型详情长期双写。
- 中文与英文必须同时迁移。
- 不用临时本机端口、node_modules symlink、截图路径作为永久事实。
- 不因为迁移页面而改变实验科学结论、模型许可证或目录证据等级。

## 2. 当前代码基线与工作面

- 工作仓库：`mykcs/basemodel`
- 工作分支：`research/move-base-model-content-to-models-20260912`
- 本轮开始时 `main`：`05fffea30fd90819572dca52eee1f911e4ded707`
- 施工方式：独立 worktree；禁止覆盖主 checkout 中其他 Agent 的未提交工作。

主要代码 owner：

- 模型详情正文：`src/pages/_bodies/model-detail.astro`
- 模型目录入口：`src/pages/_bodies/models-index.astro`
- 新实验设置组件：`src/components/models/detail/SeedOpenEvoExperimentSetup.astro`
- 模型详情页内导航：`src/components/models/detail/ModelDetailNav.astro`
- Research Flow 入口：`src/components/research/SeedOpenEvoMissionHero.astro`、`SeedOpenEvoResearchHub.astro`、`SeedOpenEvoResearchNav.astro`
- 旧 Research detail owner 清理：`SeedOpenEvoResearchPage.astro`、`SeedOpenEvoResearchDetail.astro`、`SeedOpenEvoResearchPageCore.astro`
- 读者契约：`src/data/siteReaderContracts.ts`
- 路由/语言发现：`src/lib/sitemapRoutes.ts`
- 旧地址兼容：中英文 `src/pages/**/research/seed-openevo/flow/base-model/index.astro` + `vercel.json`
- 浏览器回归：`tests/e2e/ui-safety.spec.ts`
- 结构回归：`src/lib/modelExperimentSetupMigration.test.ts` 及相关 route/navigation tests

## 3. Phase A — 信息架构归属

- [x] 冷读旧 `/research/seed-openevo/flow/base-model/`，确认其核心语义属于“模型记录”，而不是独立研究流程。
- [x] 冷读 `/models/` 与 Qwen2.5-3B-Instruct 详情页，确认 canonical owner 应是模型详情页。
- [x] 确定单一事实源：`/models/qwen2-5-3b-instruct/#experiment-setup`。
- [x] 确定 `/models/` 只提供入口，不复制整段实验设置。

## 4. Phase B — 模型详情迁移实现

- [x] 新增 `SeedOpenEvoExperimentSetup.astro`，承接旧页核心知识。
- [x] 模型名拆解：`Qwen / 2.5 / 3B / Instruct`。
- [x] 迁移复现字段：Base/Instruct、parameters、context、precision/quantization、SFT/LoRA/RL、checkpoint/revision。
- [x] 迁移公平比较控制：checkpoint、精度/量化、推理后端、prompt/parser。
- [x] 对 `fallback` 给出中文近邻解释，避免只留内部术语。
- [x] 只在 `model.id === 'qwen2-5-3b-instruct'` 时渲染实验设置。
- [x] `ModelDetailNav.astro` 仅对这个模型增加 `#experiment-setup` 导航项。
- [x] 保证其他模型详情页不出现该实验专属章节。

代码验收：

```bash
npx vitest run --config vitest.structural.config.ts \
  src/lib/modelExperimentSetupMigration.test.ts
npm run check
```

通过标准：Astro 0 error；结构测试证明 Qwen 页存在、其他模型页不存在该章节。

## 5. Phase C — `/models/` 目录入口

- [x] 在 `src/pages/_bodies/models-index.astro` 增加 SEED / OpenEVO 实验模型入口。
- [x] 链接直达 `/models/qwen2-5-3b-instruct/#experiment-setup`。
- [x] 入口放在模型目录首屏主要筛选任务之后，不与主 CTA 竞争第一注意力中心。
- [x] 中英文文案都说明：模型身份、复现字段、公平比较变量由模型记录统一维护。

## 6. Phase D — Research Flow 去重与链接改写

- [x] `SeedOpenEvoMissionHero.astro` 的模型入口改到 canonical 模型详情。
- [x] `SeedOpenEvoResearchHub.astro` 的 Qwen 卡片改到 canonical 模型详情。
- [x] `SeedOpenEvoResearchNav.astro` 的“模型 / Model”入口改到 canonical 模型详情。
- [x] `SeedOpenEvoResearchPage.astro` 移除 `base-model` 正文页面身份。
- [x] `SeedOpenEvoResearchDetail.astro` 移除 `base-model` copy owner。
- [x] `SeedOpenEvoResearchPageCore.astro` 删除旧模型名图、术语表和比较表正文。
- [x] `AppLayout.astro` 不再把旧地址当成常规 Research bridge page。

回归要求：

```bash
rg "flow/base-model|page === 'base-model'|model-name-diagram" src
```

允许出现的位置只有：兼容路由、兼容 reader contract、测试断言、Vercel redirect 配置；不得再有第二份正文。

## 7. Phase E — 旧 URL 兼容与 sitemap

- [x] 中文旧地址保留兼容页面，加载后跳到新模型详情锚点。
- [x] 英文旧地址保留兼容页面，加载后跳到英文模型详情锚点。
- [x] `vercel.json` 将旧地址及 trailing-slash 版本永久 redirect 到新模型详情。
- [x] `sitemapRoutes.ts` 将旧路径从 canonical static paths 移到 `bilingualCompatibilityPaths`。
- [x] Sitemap 不再发布旧 `flow/base-model` 为 canonical 页面。
- [x] locale discovery 仍识别旧地址的中英文兼容关系。

## 8. Phase F — 自动化回归与浏览器验收

- [x] 新增 `modelExperimentSetupMigration.test.ts`，固定 canonical owner 与旧正文删除边界。
- [x] 更新 `researchNavigation.test.ts`、`researchRouteHierarchy.test.ts`、`sitemapRoutes.test.ts`。
- [x] 新增 Playwright 回归：目录入口存在、Qwen 章节存在、英文存在、其他模型不存在、旧地址跳转成功。
- [x] focused Playwright：`SEED / OpenEVO model setup has one canonical model-detail owner` 通过。
- [x] 390×844 手机实测无页面级横向溢出；表格只在自己的 scroll container 内滚动。
- [x] 桌面中文 Qwen 详情页实测新章节完整出现。
- [x] 英文 Qwen 详情页实测新章节完整出现。
- [x] Research Flow 实测所有 Qwen 模型入口统一指向同一新地址。
- [x] 旧中文 URL 实测最终落到新模型详情锚点。

最终产品源 SHA `f425a37f25c6c50b9fa5839104f37ee1a3970c6b` 上又执行完整 global-risk Gate：`npm run verify:deploy`、`npm run build`、`npm run ui:overflow-preflight`、`npm run test:ui:all` 全部 PASS；Chromium + WebKit 共 **416/416** PASS，migration-specific ui-safety 在两浏览器均 PASS。摘要保存在 `docs/agents/evidence/base-model-flow-to-models-20260913/final-ui-gate-current.txt`。

已完成整仓证据：

```text
Structural tests: 104 files / 678 tests PASS
Behavior tests:   7 files / 37 tests PASS
Astro check:      0 errors
Static build:     494 pages
Heading audit:    494/494 exactly one H1
Reader contract:  PASS
Strict copy invariant failures: 0
```

- [x] 在最终产品源 commit SHA 上重跑受影响 route 的正常 UI gate，确认没有“测试写完但未进入最终树”的情况。
- [x] 最终产品源 commit SHA 上确认 console error = 0，中文/英文/手机均无 overflow、遮挡、重复 H1。

## 9. Phase G — Human Preference Learning / 冷读

- [x] 已做 3 个内部布局候选截图比较；选择“入口位于首屏主要筛选任务之后”的版本。

仍需完成：

- [x] 用 `scripts/generate-human-preference-candidate-receipt.ts` 生成本任务 candidate receipt。
- [x] 将 3 个候选的 hypothesis、attention center、density、visual rationale、截图证据写入 receipt。
- [x] 记录 pairwise comparison，保证最终候选显式胜过另外两个。
- [x] 运行 `verify-human-preference-candidate-receipt.ts` 并 PASS。
- [x] 在最终渲染树上运行 Phase A blind cold read，并先保存结果。
- [x] 再运行 Phase B compare，把 blind 观察与 Reader Contract / 历史偏好对照。
- [x] 独立 reviewer 可用；已生成并通过 final preference judge receipt。

> **HPL scope correction（2026-09-13）**：三候选比较的是 `/models/` 上实验模型入口的层级与首屏注意力，因此 candidate/cold-read contract 应为 `models-index`，不是整页 `model-detail`。早期用 `model-detail` 得到的 NEEDS_FIX 不作为放行证据；已在最终产品源 SHA `f425a37f25c6c50b9fa5839104f37ee1a3970c6b` 上重跑 `models-index` blind-first review。独立 Phase B 给出 `MIGRATION_VERDICT: PASS`，final judge receipt PASS。

最终 HPL 证据：`docs/agents/evidence/base-model-flow-to-models-20260913/`。

建议命令骨架：

```bash
npx tsx scripts/generate-human-preference-candidate-receipt.ts \
  --contract=models-index \
  "move SEED/OpenEVO base-model content into canonical Qwen model record"

npm run feedback:cold-read -- models-index --phase=blind --url=<FINAL_RENDERED_URL>
npm run feedback:cold-read -- models-index --phase=compare
npm run feedback:cold-read -- models-index --phase=receipt --url=<FINAL_RENDERED_URL> \
  > /tmp/model-migration-preference-judge.json
npm run feedback:judge -- /tmp/model-migration-preference-judge.json
```

## 10. Phase H — Git / PR / exact-head

- [x] 运行 `git diff --check`，不得有 whitespace error。
- [x] 删除/忽略所有仅用于本地运行的临时状态；不得提交 `node_modules` symlink、临时端口、`/tmp` 截图路径作为产品事实。
- [x] 提交当前迁移代码 + 本计划文件，commit message 明确写出 canonical-owner migration。
- [x] push `research/move-base-model-content-to-models-20260912` 到 GitHub。
- [x] 创建或复用唯一 PR；不得为同一迁移制造平行 PR。
- [x] PR body 写明：旧 owner → 新 owner、兼容路由、测试证据、科学边界、剩余验收。
- [x] PR 创建后重新读取 live `main`；若 `main` 前进，先做 current-base refresh，再重跑受影响验收。
- [x] 确认 PR head 与最新 `main` 可干净集成，且没有覆盖其他 Agent 的语义更新。

### 当前 durable evidence

- current base: `68f6cc3118bf0515cef7aa4ceaa2fd7f4349f259`
- current integration head before this evidence update: `627ed4170ca4c0edc9c4065453e1271912d1a984`
- PR: `#658` — `Move SEED/OpenEVO base-model content into Models`
- current-base ancestry check: `origin/main` is an ancestor of the branch head
- current-base focused structural tests: 27/27 PASS
- current-base `npm run check`: 0 errors / 0 warnings; 2 pre-existing deprecation hints
- latest `origin/main` is an ancestor of the task branch; merge-tree conflict scan is clean
- the two former remote-only task commits are patch-equivalent (`git cherry` = `-`), then remote task ancestry was merged with an unchanged tree; no unknown concurrent semantics were overwritten

## 11. Phase I — Vercel final gate

仅在最终候选已经稳定后执行，避免浪费 provider build：

- [ ] 运行 `node scripts/request-vercel-final-gate.mjs <PR_NUMBER>`。
- [ ] 确认 `ci/vercel-gate-base` 指向当时 live `main`。
- [ ] 确认 `ci/vercel-gate-final` 精确指向 PR head SHA。
- [ ] 等待该 exact SHA 的 Vercel Preview 完成。
- [ ] Vercel required status 必须为 green；`IGNORED/CANCELED` 不能冒充网站验收。
- [ ] 若失败，只修具体失败 job 的最窄原因；不得绕过 provider authority。
- [ ] Preview 中再次人工/浏览器确认 `/models/`、Qwen detail、旧 URL redirect 的真实行为。

## 12. Phase J — 合并与 Production

- [ ] exact-head Vercel green 后，确认没有新的 blocking review / conflict / main drift。
- [ ] 按仓库当前 merge policy 合并 PR 到 `main`；不得以本地 build 代替 required provider gate。
- [ ] 记录 merge commit SHA。
- [ ] 等待 `main` 的 Vercel Production deployment。
- [ ] Production 必须成功，且 canonical/hreflang/noindex 语义符合 production contract。
- [ ] 在线访问旧 `/research/seed-openevo/flow/base-model/`，确认最终跳到新 Qwen 模型详情。
- [ ] 在线访问 `/models/` 与中英文 Qwen 页，确认内容、链接、手机布局无回归。

## 13. 最终交付标准（Definition of Done）

只有以下 **全部成立** 才能把本任务写成 COMPLETE：

- [ ] 内容归属：Qwen 实验设置只由 `/models/qwen2-5-3b-instruct/` 维护一份。
- [ ] 信息完整：旧页有价值的模型名解释、复现字段、公平比较控制变量都能在新 owner 找到。
- [ ] 目录逻辑：`/models/` 能自然发现该实验模型，但不破坏模型浏览器的首屏主任务。
- [ ] Flow 逻辑：Research Flow 只链接模型记录，不继续拥有模型正文。
- [ ] 兼容性：旧中英文 URL、带/不带 trailing slash 都安全迁移。
- [ ] 国际化：中文和英文都通过。
- [ ] 响应式：390px 手机及桌面无页面级水平溢出、遮挡、元素重叠。
- [ ] 可访问性/结构：每页一个 H1；Reader Contract 和正常 UI gate 通过。
- [ ] 回归：结构测试、行为测试、build、受影响 Playwright 都 green。
- [ ] HPL：内部候选筛选有可核验证据；blind-first 冷读完成；不可用的独立 reviewer 不得被伪装为 PASS。
- [ ] Git：最终 PR 基于 current `main`，无未知并发覆盖，无第二个同目的 PR。
- [ ] Provider：exact-head Vercel required status green。
- [ ] Release：PR 已合并，Vercel Production green，线上真实路由通过 smoke check。
- [ ] Closeout：本文件所有必要 checkbox 都是 `[x]`，并写入最终 SHA / PR / provider 证据。

## 14. 每小时自动执行协议

每次自动触发都必须：

1. 先读取本文件，不凭聊天记忆猜进度。
2. 读取 live `main`、当前 PR、当前 branch/head 和 provider 状态。
3. 找到**最靠前的未完成 checkbox**，优先完成它及其直接依赖。
4. 只有拿到 file / test / SHA / PR / Vercel / Production 等证据后才能勾选。
5. 若发现并发 drift，先识别语义差异；禁止 reset/覆盖未知工作。
6. 每次提交都同步更新本文件的 checkbox 与简短证据。
7. 已满足 Definition of Done 后，不再做额外优化；报告 COMPLETE，并停用本小时自动任务。
