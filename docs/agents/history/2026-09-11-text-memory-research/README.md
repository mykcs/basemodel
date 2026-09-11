# Text Memory 研究页与单页汇报：核验收据

唯一研究总计划仍在 `mykcs/openevo-experiment/docs/experiment-tracking/Q17_TEXT_MEMORY_REDESIGN_PLAN_2026-09-11.md`。本目录是网页表达与软件验收证据，不是第二份实验计划，也不授予模型调用、GPU、正式 successor 或 final-panel 权限。

## 承接关系

复用 BaseModel PR #624。它最初叠在 PR #625 上；#625 合并后，`main` 又吸收了后续 Q17 same-task publication 与治理修订。本次以 current `main@02ba9feac907ae35cdcee52fe14671d6eba3e4f1` 为实际父版本重新核对：`briefing-parent-preservation.json` 逐节证明 current main 的 23 页正文保持相同，仅页码分母更新；只新增 `text-memory-redesign` 一页，合计 24 页。没有把旧 22/23 页 briefing 快照或已被后续 Q17 页面取代的文案覆盖回来。历史 #625 head `6df62b8a4ac8433f532ebf0d05e332f994944bec` 只保留为栈来源记录。

## 实际完成的核验

- 100 个结构测试文件、655 个测试通过；Astro check 为 0 errors、0 warnings、2 个既有提示。
- 新鲜静态构建产出 488 个 route，review build 为 noindex。未复用失败构建前的旧 dist。
- 14 个 Playwright 测试通过，零重试。覆盖 Chromium/WebKit、中英文、明暗主题、1440/768/390 宽度；页面不横向溢出，新增 Slide 的文本均在 16:9 画布内。
- `npm run verify:deploy` 在 current-main 重整候选上完整通过；这只是本地确定性验收，不替代新 exact head 的 Public PR CI / Vercel final gate。
- 共生成 48 张截图，本目录保留四张代表图及各源文件 SHA-256；手机表格在自身容器内横向滚动，并有可见提示。
- source JSON 明确区分 43 个实验仓库软件测试、8 类脚本样例与 0 行真实模型 shadow。未来模型效果和 WebShop 收益均为空值，网页与单页 Slide 显式显示 TBD。

## 表达选择与审查边界

先实际检索现有 Preference Brief，结果保存于 `preference-brief.md`。候选 A 是 PR #624 原始正文的实际截图：它把“分开读与写”说成确定原因，并以修复运行的内部话语开场。候选 B 是本次版本：先解释购物任务和短笔记，分别展示五类历史证据，明确六项假设和预算未冻结的真实对照。

选择 B 的依据是证据边界与读者任务，不是视觉风格更像某个参考网站。截图已由实现者实际查看；这是同一作者的自查，**不是独立盲读，不是 owner approval，也不把新页面列为 accepted/gold reference**。独立盲读与真人审批仍待独立证据。review Preview、CI gate、合并、Production 发布分别记录，不能互相替代。

## 复现

使用仓库要求的 Node 24：

```bash
npm ci --no-audit --no-fund
npm run check
npm run test:structural -- --maxWorkers=2
PUBLIC_SEARCH_INDEXING=disabled npm run build
PLAYWRIGHT_REUSE_BUILD=1 PLAYWRIGHT_PORT=4428 npx playwright test tests/e2e/text-memory-research.spec.ts tests/e2e/seed-openevo-briefing.spec.ts --workers=2 --retries=0
```

端口必须空闲且归当前 worktree，不得接管别人的服务器进程。完整 checkout 是全站结构检查的输入要求；之前缺少 `.github` 和 `cloudflare` 的 sparse checkout 导致读取失败，通过补齐 checkout 修复，没有删除或放宽测试。

未进入本批次完成项：独立盲读、owner approval、正式 Vercel exact-head 发布验收、生产站发布、真实模型 shadow、正式 WebShop successor 结果。当前正式实验没有被本次工作改写。
