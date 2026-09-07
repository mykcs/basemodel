# 机制页 CI 路由归属优化（202609070100）

状态：候选，尚未合并；下列标准在本次首次触发 CI 前固定。

## 问题与边界

主线 `5de1aeeb31a9d02e836b7244137ba7f34fbfe805` 已使用两台 medium、每台一个 Playwright worker、重试 0。#517 的先规划后安装和依赖更新串行化已生效，本次沿用。

#521 只修改机制页组件的中英文导语及历史说明，却因组件没有 ROUTE_OWNERS 记录而触发 full。其冻结对照为 `9e5d3f0654876751142161fae42353a34ef2757c`，父节点是上述 main，CircleCI pipeline 154 / workflow `5fb4c6a8-094a-4924-9ff8-8df0f255c062` 已成功：deterministic 124 秒，browser 1 为 356 秒，browser 2 为 343 秒，workflow 359 秒。合计 823 executor-seconds。这是页面实改的历史测量，不是新增空跑，也不能解释为当前额度余额。

## 修改

- 仅把 `OpenEvoMechanismMap.astro` 映射到机制页中英文两条路由。
- 保留完整 `openevo-two-map.spec.ts`，包括它注册的 reader-journey 和 research-deep-dive 检查；加上两路由 × 手机/桌面 × 浅色/深色 smoke，保留 overflow preflight。
- 确定性 Gate、构建、主线复验、双分片 required contexts、执行器、worker、retries、测试断言不变。focused 的第二片在 npm/browser 安装前退出。
- 在普通确定性 Gate 内检查所有 src 文件：该组件只能由两条登记页面导入；禁止组件全局样式、脚本和额外 CSS import。新消费者/全局副作用要求重新评估路由范围。共享 primitive、数据、测试或全局 CSS 混入仍为 full。

## 冻结验收与测量方法

1. 优化 PR 本身修改 planner，必须通过完整 CircleCI qualification（确定性、两个 full browser 分片、overflow、Lab）；qualification 耗时不当作普通机制页修改的收益。
2. qualification 完成后，在候选上开一个 benchmark-only 子 PR，机制页内容与 #521 一致，只在组件末尾追加一个无渲染作用的 Astro 注释作为范围标记。相对候选的 diff 只有这个组件，比较范围必须映射为 focused。它不能合并。
3. 对照已经完成，候选测量随后单独运行。运行前核查其他 BaseModel 工作流；如果有同期负载，记录为受干扰，不声称干净的速度对比。
4. 候选必须保留原始完整 reader spec 的每个测试身份，并跑足 8 个改动路由 smoke；所有实际测试完成且 retries=0，第二片在安装前按策略退出。不得用跳过冒充浏览器 PASS。
5. 采用标准：普通工作流耗时 <=215 秒（相对359秒至少约40%降低），三个任务合计 <=493 executor-seconds（相对823秒至少约40%降低）。用 provider job/workflow 时间，包含 setup；独立列出 queue。当前成本指标为 executor-seconds，不假装是账户账单或余额。
6. 预期上限：移除第二片的 npm/build/browser，以及非相关全站浏览器检查；确定性检查约124秒构成现有实测下界。因此不承诺低于两分钟，也不承诺全量任务获得同样收益。
7. 此次是冻结真实案例的顺序重放，只有一对观测；不声称随机试验或普适速度提升。无收益则保留原调度，关闭候选；收益验收完成才允许合并。

## 写入前见证

REPEAT-CORRECTION：重复 CI 优化/历史成功误当当前权威 → deployment-policy 与 release-closeout → 固定 main、#521 exact head、真实 CircleCI job 时间、当前全部开放 PR → 在独立 ci/ 分支做一次完整 qualification，随后一次 focused replay → main/head/测试身份/执行器或同期负载变化时重新核验。#502 是已被 #500 采用、随后由 #517 改回预算优先配置的历史测量，不是本次待执行方案。

预览判定：没有页面产品改动，使用 `ci/` 分支，不申请 Vercel Preview。源文件为按固定 ref 下载的部分源码导出，不是 Git worktree；本地测试仅证明导出中的规划逻辑与负例，完整 importer inventory 和仓库验收由真实 CircleCI checkout 完成。只原子发布五个明确改动文件，不覆盖其他 Agent 的页面内容。

## 本地检查与后续凭据

- planner Vitest：14/14；部分源码导出环境。
- 人为添加第三个 importer / 全局 CSS 的负例必须失败；恢复后必须通过。
- no-spend / installer-failure 回归在完整确定性 CI 的现有命令中运行。
- exact candidate/tree、qualification、focused replay、最终采用或拒绝决定记录在本次 PR；不把待执行项目改写为已完成。

官方依据：[Playwright CI](https://playwright.dev/docs/ci) 建议受限 CI 默认一个 worker，并通过独立分片扩展；[CircleCI caching](https://circleci.com/docs/guides/optimize/caching/) 说明缓存只是可缺失的优化。本轮依据真实负载先缩小已证明的页面检查范围，没有添加缓存或更换镜像。


首次写入前 main 已合并 #521，前进到 `9bbae312a027d6623de39f61d50ec275d1a9f473`。已读取完整 compare：仅上述机制页导语与历史说明两个文件；CI、测试、依赖、共享 UI 无漂移。候选改基于该 main，保留页面全部新内容。既有 #521 对照的产品代码因此与候选相同；测量标记仅用于触发同一组件的路由规划。
